/**
 * Support Groups — Service Layer
 *
 * Supabase CRUD for the 4 support-group tables.
 * ECR-R score fetching + attachment-based routing logic.
 */

import { supabase } from './supabase';
import type {
  SupportGroup,
  SupportGroupMember,
  SupportGroupSession,
  SupportGroupAttendance,
  RegistrationFormData,
  GroupRecommendation,
  SupportGroupType,
} from '@/types/support-groups';
import type { AttachmentStyle, ECRRScores } from '@/types';

// ─── ECR-R Score Fetching ─────────────────────────────

/**
 * Fetch the most recent ECR-R assessment scores for a user.
 * Returns null if the user hasn't completed the ECR-R.
 */
export async function getECRRScores(userId: string): Promise<ECRRScores | null> {
  const { data, error } = await supabase
    .from('assessments')
    .select('scores')
    .eq('user_id', userId)
    .eq('type', 'ecr-r')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data?.scores) return null;

  return data.scores as ECRRScores;
}

// ─── Group Routing ────────────────────────────────────

/**
 * Determine which support group to recommend based on ECR-R results.
 *
 * Routing logic:
 *   anxious-preoccupied  → 'anxious' (The Reach)
 *   dismissive-avoidant  → 'avoidant' (The Retreat)
 *   fearful-avoidant     → whichever score is higher
 *   secure               → null (user picks)
 *   no ECR-R data        → null (prompt to take assessment)
 */
export async function getRecommendedGroup(userId: string): Promise<GroupRecommendation> {
  const scores = await getECRRScores(userId);

  if (!scores) {
    return {
      recommendedGroup: null,
      reason: 'Complete your attachment assessment to find the right support group for your pattern.',
      attachmentStyle: null,
      isFearfulAvoidant: false,
    };
  }

  const { anxietyScore, avoidanceScore, attachmentStyle } = scores;

  if (attachmentStyle === 'secure') {
    return {
      recommendedGroup: null,
      reason: 'Your secure attachment style means either group could benefit you. Explore both and choose the one that resonates.',
      attachmentStyle: 'secure',
      isFearfulAvoidant: false,
    };
  }

  if (attachmentStyle === 'anxious-preoccupied') {
    return {
      recommendedGroup: 'anxious',
      reason: 'Based on your attachment assessment, The Reach is designed for your pattern of reaching for connection.',
      attachmentStyle,
      isFearfulAvoidant: false,
    };
  }

  if (attachmentStyle === 'dismissive-avoidant') {
    return {
      recommendedGroup: 'avoidant',
      reason: 'Based on your attachment assessment, The Retreat is designed for your pattern of creating space.',
      attachmentStyle,
      isFearfulAvoidant: false,
    };
  }

  // fearful-avoidant → route by dominant score
  if (attachmentStyle === 'fearful-avoidant') {
    const group: SupportGroupType = avoidanceScore > anxietyScore ? 'avoidant' : 'anxious';
    return {
      recommendedGroup: group,
      reason: 'Your pattern has elements of both reaching and retreating. We\'ve suggested a starting group based on your assessment, but you can switch anytime.',
      attachmentStyle,
      isFearfulAvoidant: true,
    };
  }

  // Fallback
  return {
    recommendedGroup: null,
    reason: 'Explore both groups and choose the one that resonates with your experience.',
    attachmentStyle,
    isFearfulAvoidant: false,
  };
}

// ─── Group Queries ────────────────────────────────────

/** Fetch all active support groups. */
export async function getActiveGroups(): Promise<SupportGroup[]> {
  const { data, error } = await supabase
    .from('support_groups')
    .select('*')
    .eq('is_active', true)
    .order('group_type', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapGroup);
}

/** Count active members in a group (for capacity checks). */
export async function getGroupMemberCount(groupId: string): Promise<number> {
  const { count, error } = await supabase
    .from('support_group_members')
    .select('*', { count: 'exact', head: true })
    .eq('group_id', groupId)
    .eq('status', 'active');

  if (error) throw error;
  return count ?? 0;
}

// ─── Membership ───────────────────────────────────────

/** Get the user's current membership across all groups. */
export async function getUserMembership(userId: string): Promise<SupportGroupMember | null> {
  const { data, error } = await supabase
    .from('support_group_members')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['pending', 'active', 'waitlisted'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? mapMember(data) : null;
}

/** Register for a support group. Handles capacity + waitlist. */
export async function registerForGroup(
  userId: string,
  groupId: string,
  formData: RegistrationFormData,
  ecrScores: ECRRScores | null,
): Promise<SupportGroupMember> {
  // Check capacity
  const group = await getGroupById(groupId);
  if (!group) throw new Error('Group not found');

  const memberCount = await getGroupMemberCount(groupId);
  const isFull = memberCount >= group.maxMembers;

  // Calculate waitlist position if full
  let waitlistPosition: number | null = null;
  if (isFull) {
    const { count } = await supabase
      .from('support_group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId)
      .eq('status', 'waitlisted');
    waitlistPosition = (count ?? 0) + 1;
  }

  const { data, error } = await supabase
    .from('support_group_members')
    .insert({
      group_id: groupId,
      user_id: userId,
      preferred_name: formData.preferredName,
      timezone: formData.timezone,
      preferred_times: formData.preferredTimes,
      in_therapy: formData.inTherapy,
      emergency_contact_name: formData.emergencyContactName || null,
      emergency_contact_phone: formData.emergencyContactPhone || null,
      consent_given: formData.consentGiven,
      consent_given_at: formData.consentGiven ? new Date().toISOString() : null,
      status: isFull ? 'waitlisted' : 'active',
      waitlist_position: waitlistPosition,
      attachment_style: ecrScores?.attachmentStyle ?? null,
      anxiety_score: ecrScores?.anxietyScore ?? null,
      avoidance_score: ecrScores?.avoidanceScore ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapMember(data);
}

/** Get a group by ID. */
async function getGroupById(groupId: string): Promise<SupportGroup | null> {
  const { data, error } = await supabase
    .from('support_groups')
    .select('*')
    .eq('id', groupId)
    .maybeSingle();

  if (error) throw error;
  return data ? mapGroup(data) : null;
}

// ─── Sessions ─────────────────────────────────────────

/** Fetch upcoming (future) sessions for a group. */
export async function getUpcomingSessions(
  groupId: string,
  limit: number = 3,
): Promise<SupportGroupSession[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('support_group_sessions')
    .select('*')
    .eq('group_id', groupId)
    .gte('session_date', today)
    .neq('status', 'cancelled')
    .order('session_date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapSession);
}

/** Fetch past sessions with user's attendance data. */
export async function getSessionHistory(
  groupId: string,
  userId: string,
): Promise<(SupportGroupSession & { attendance?: SupportGroupAttendance })[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data: sessions, error: sessErr } = await supabase
    .from('support_group_sessions')
    .select('*')
    .eq('group_id', groupId)
    .lt('session_date', today)
    .order('session_date', { ascending: false })
    .limit(12);

  if (sessErr) throw sessErr;
  if (!sessions || sessions.length === 0) return [];

  const sessionIds = sessions.map((s: any) => s.id);

  const { data: attendance, error: attErr } = await supabase
    .from('support_group_attendance')
    .select('*')
    .eq('user_id', userId)
    .in('session_id', sessionIds);

  if (attErr) throw attErr;

  const attMap = new Map(
    (attendance ?? []).map((a: any) => [a.session_id, mapAttendance(a)]),
  );

  return sessions.map((s: any) => ({
    ...mapSession(s),
    attendance: attMap.get(s.id),
  }));
}

// ─── Attendance ───────────────────────────────────────

/** Record or update attendance for a session. */
export async function recordAttendance(
  sessionId: string,
  userId: string,
  personalNotes?: string,
): Promise<SupportGroupAttendance> {
  const { data, error } = await supabase
    .from('support_group_attendance')
    .upsert(
      {
        session_id: sessionId,
        user_id: userId,
        attended: true,
        personal_notes: personalNotes || null,
      },
      { onConflict: 'session_id,user_id' },
    )
    .select()
    .single();

  if (error) throw error;
  return mapAttendance(data);
}

// ─── Leave Group ─────────────────────────────────────

/** Deactivate a user's membership so they can re-choose a group. */
export async function leaveGroup(userId: string, groupId: string): Promise<void> {
  const { error } = await supabase
    .from('support_group_members')
    .update({ status: 'inactive', updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('group_id', groupId)
    .in('status', ['active', 'waitlisted', 'pending']);

  if (error) throw error;
}

// ─── Group Community Room ────────────────────────────

/**
 * Fetch community posts scoped to a specific support group.
 * Only returns posts where group_id matches (RLS enforces membership).
 */
export async function getGroupPosts(
  userId: string,
  groupId: string,
  options: { limit?: number } = {}
): Promise<any[]> {
  const { limit = 50 } = options;

  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('group_id', groupId)
    .eq('is_approved', true)
    .eq('is_flagged', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  // Fetch user reactions for these posts
  const postIds = (data ?? []).map((p: any) => p.id);
  const userReactions = new Map<string, Set<string>>();

  if (userId && postIds.length > 0) {
    const { data: reactions } = await supabase
      .from('community_reactions')
      .select('post_id, reaction_type')
      .eq('user_id', userId)
      .in('post_id', postIds);

    for (const r of reactions ?? []) {
      if (!userReactions.has(r.post_id)) {
        userReactions.set(r.post_id, new Set());
      }
      userReactions.get(r.post_id)!.add(r.reaction_type);
    }
  }

  return (data ?? []).map((row: any) => {
    const reactions = userReactions.get(row.id);
    return {
      id: row.id,
      authorId: row.author_id,
      content: row.content,
      category: row.category,
      healingPhase: row.healing_phase ?? undefined,
      attachmentStyle: row.attachment_style ?? undefined,
      isApproved: row.is_approved,
      isFlagged: row.is_flagged,
      resonatedCount: row.resonated_count ?? 0,
      feltSeenCount: row.felt_seen_count ?? 0,
      beenThereCount: row.been_there_count ?? 0,
      createdAt: row.created_at,
      hasResonated: reactions ? reactions.has('resonated') : false,
      hasFeltSeen: reactions ? reactions.has('felt_seen') : false,
      hasBeenThere: reactions ? reactions.has('been_there') : false,
      aliasName: row.alias_name ?? undefined,
      aliasColor: row.alias_color ?? undefined,
    };
  });
}

/**
 * Create a community post scoped to a support group.
 * RLS enforces that only active group members can insert.
 */
export async function createGroupPost(
  userId: string,
  groupId: string,
  content: string,
  category: string,
  aliasName?: string,
  aliasColor?: string
): Promise<any> {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      author_id: userId,
      group_id: groupId,
      content,
      category,
      alias_name: aliasName ?? null,
      alias_color: aliasColor ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    authorId: data.author_id,
    content: data.content,
    category: data.category,
    createdAt: data.created_at,
    aliasName: data.alias_name ?? undefined,
    aliasColor: data.alias_color ?? undefined,
    resonatedCount: 0,
    feltSeenCount: 0,
    beenThereCount: 0,
    isApproved: true,
    isFlagged: false,
    hasResonated: false,
    hasFeltSeen: false,
    hasBeenThere: false,
  };
}

// ─── Mappers (snake_case DB → camelCase TS) ───────────

function mapGroup(row: any): SupportGroup {
  return {
    id: row.id,
    groupType: row.group_type,
    name: row.name,
    description: row.description ?? null,
    maxMembers: row.max_members,
    cohortNumber: row.cohort_number,
    zoomLink: row.zoom_link ?? null,
    scheduleDay: row.schedule_day ?? null,
    scheduleTime: row.schedule_time ?? null,
    scheduleTimezone: row.schedule_timezone,
    durationMinutes: row.duration_minutes,
    currentStep: row.current_step,
    status: row.status,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMember(row: any): SupportGroupMember {
  return {
    id: row.id,
    groupId: row.group_id,
    userId: row.user_id,
    preferredName: row.preferred_name ?? null,
    timezone: row.timezone ?? null,
    preferredTimes: row.preferred_times ?? null,
    inTherapy: row.in_therapy ?? null,
    emergencyContactName: row.emergency_contact_name ?? null,
    emergencyContactPhone: row.emergency_contact_phone ?? null,
    consentGiven: row.consent_given,
    consentGivenAt: row.consent_given_at ?? null,
    status: row.status,
    waitlistPosition: row.waitlist_position ?? null,
    attachmentStyle: row.attachment_style ?? null,
    anxietyScore: row.anxiety_score ?? null,
    avoidanceScore: row.avoidance_score ?? null,
    registrationData: row.registration_data ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSession(row: any): SupportGroupSession {
  return {
    id: row.id,
    groupId: row.group_id,
    sessionNumber: row.session_number,
    stepNumber: row.step_number,
    sessionDate: row.session_date,
    sessionTime: row.session_time ?? null,
    zoomLink: row.zoom_link ?? null,
    status: row.status,
    facilitatorNotes: row.facilitator_notes ?? null,
    createdAt: row.created_at,
  };
}

function mapAttendance(row: any): SupportGroupAttendance {
  return {
    id: row.id,
    sessionId: row.session_id,
    userId: row.user_id,
    attended: row.attended,
    personalNotes: row.personal_notes ?? null,
    reflection: row.reflection ?? null,
    createdAt: row.created_at,
  };
}
