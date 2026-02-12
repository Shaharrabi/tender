/**
 * Couples Service
 * Handles partner invitation, couple linking, and dyadic assessment CRUD.
 */

import { supabase } from './supabase';
import type {
  CoupleInvite,
  Couple,
  UserProfile,
  DyadicAssessmentRecord,
  DyadicAssessmentType,
  RelationshipPortrait,
} from '@/types/couples';

// ─── Invite Code Generation ────────────────────────────

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Format: XXXX-XXXX
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

// ─── User Profile ──────────────────────────────────────

export async function getOrCreateProfile(userId: string, displayName?: string): Promise<UserProfile | null> {
  // Try to get existing
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) return existing as UserProfile;

  // Create new
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      display_name: displayName || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[Couples] Failed to create profile:', error);
    return null;
  }
  return data as UserProfile;
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
  const { error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    console.error('[Couples] Failed to update profile:', error);
    return false;
  }
  return true;
}

// ─── Partner Invitation ────────────────────────────────

export async function createInvite(inviterId: string, inviterName?: string): Promise<CoupleInvite | null> {
  const code = generateInviteCode();

  const { data, error } = await supabase
    .from('couple_invites')
    .insert({
      inviter_id: inviterId,
      invite_code: code,
      inviter_name: inviterName || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[Couples] Failed to create invite:', error);
    return null;
  }
  return data as CoupleInvite;
}

export async function getInviteByCode(code: string): Promise<CoupleInvite | null> {
  const normalized = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const formatted = normalized.length === 8
    ? `${normalized.slice(0, 4)}-${normalized.slice(4)}`
    : code.toUpperCase().trim();

  const { data, error } = await supabase
    .from('couple_invites')
    .select('*')
    .eq('invite_code', formatted)
    .eq('status', 'pending')
    .single();

  if (error || !data) return null;

  // Check if expired
  if (new Date(data.expires_at) < new Date()) {
    await supabase
      .from('couple_invites')
      .update({ status: 'expired' })
      .eq('id', data.id);
    return null;
  }

  return data as CoupleInvite;
}

export async function getMyInvites(userId: string): Promise<CoupleInvite[]> {
  const { data, error } = await supabase
    .from('couple_invites')
    .select('*')
    .eq('inviter_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []) as CoupleInvite[];
}

export async function acceptInvite(inviteId: string, acceptorId: string): Promise<Couple | null> {
  // 1. Update the invite
  const { data: invite, error: invError } = await supabase
    .from('couple_invites')
    .update({
      status: 'accepted',
      accepted_by: acceptorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', inviteId)
    .eq('status', 'pending')
    .select()
    .single();

  if (invError || !invite) {
    console.error('[Couples] Failed to accept invite:', invError);
    return null;
  }

  // 2. Create the couple record
  const { data: couple, error: coupleError } = await supabase
    .from('couples')
    .insert({
      partner_a_id: invite.inviter_id,
      partner_b_id: acceptorId,
      invite_id: inviteId,
    })
    .select()
    .single();

  if (coupleError) {
    console.error('[Couples] Failed to create couple:', coupleError);
    // Rollback invite
    await supabase
      .from('couple_invites')
      .update({ status: 'pending', accepted_by: null })
      .eq('id', inviteId);
    return null;
  }

  return couple as Couple;
}

export async function declineInvite(inviteId: string): Promise<boolean> {
  const { error } = await supabase
    .from('couple_invites')
    .update({
      status: 'declined',
      updated_at: new Date().toISOString(),
    })
    .eq('id', inviteId);

  return !error;
}

// ─── Couple Queries ────────────────────────────────────

export async function getMyCouple(userId: string): Promise<Couple | null> {
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .or(`partner_a_id.eq.${userId},partner_b_id.eq.${userId}`)
    .eq('status', 'active')
    .single();

  if (error || !data) return null;
  return data as Couple;
}

export async function getPartnerProfile(userId: string): Promise<UserProfile | null> {
  const couple = await getMyCouple(userId);
  if (!couple) return null;

  const partnerId = couple.partner_a_id === userId
    ? couple.partner_b_id
    : couple.partner_a_id;

  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', partnerId)
    .single();

  return data as UserProfile | null;
}

export async function disconnectCouple(coupleId: string): Promise<boolean> {
  const { error } = await supabase
    .from('couples')
    .update({
      status: 'disconnected',
      updated_at: new Date().toISOString(),
    })
    .eq('id', coupleId);

  return !error;
}

// ─── Dyadic Assessments ────────────────────────────────

export async function saveDyadicAssessment(
  userId: string,
  coupleId: string,
  assessmentType: DyadicAssessmentType,
  responses: any,
  scores: any,
): Promise<DyadicAssessmentRecord | null> {
  const { data, error } = await supabase
    .from('dyadic_assessments')
    .insert({
      user_id: userId,
      couple_id: coupleId,
      assessment_type: assessmentType,
      responses,
      scores,
    })
    .select()
    .single();

  if (error) {
    console.error('[Couples] Failed to save dyadic assessment:', error);
    return null;
  }
  return data as DyadicAssessmentRecord;
}

export async function getDyadicAssessments(
  coupleId: string,
  userId?: string,
): Promise<DyadicAssessmentRecord[]> {
  let query = supabase
    .from('dyadic_assessments')
    .select('*')
    .eq('couple_id', coupleId)
    .order('completed_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data || []) as DyadicAssessmentRecord[];
}

export async function getLatestDyadicScores(
  coupleId: string,
  assessmentType: DyadicAssessmentType,
): Promise<{ partnerA: any | null; partnerB: any | null }> {
  const couple = await getCoupleById(coupleId);
  if (!couple) return { partnerA: null, partnerB: null };

  const { data } = await supabase
    .from('dyadic_assessments')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('assessment_type', assessmentType)
    .order('completed_at', { ascending: false });

  if (!data || data.length === 0) return { partnerA: null, partnerB: null };

  const partnerAResult = data.find((d: any) => d.user_id === couple.partner_a_id);
  const partnerBResult = data.find((d: any) => d.user_id === couple.partner_b_id);

  return {
    partnerA: partnerAResult?.scores || null,
    partnerB: partnerBResult?.scores || null,
  };
}

export async function getCoupleById(coupleId: string): Promise<Couple | null> {
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .eq('id', coupleId)
    .single();

  if (error || !data) return null;
  return data as Couple;
}

// ─── Relationship Portrait ─────────────────────────────

export async function saveRelationshipPortrait(
  portrait: Partial<RelationshipPortrait> & { couple_id: string },
): Promise<RelationshipPortrait | null> {
  // Upsert — one portrait per couple
  const { data, error } = await supabase
    .from('relationship_portraits')
    .upsert(
      {
        ...portrait,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'couple_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('[Couples] Failed to save relationship portrait:', error);
    return null;
  }
  return data as RelationshipPortrait;
}

export async function getRelationshipPortrait(
  coupleId: string,
): Promise<RelationshipPortrait | null> {
  const { data, error } = await supabase
    .from('relationship_portraits')
    .select('*')
    .eq('couple_id', coupleId)
    .single();

  if (error || !data) return null;
  return data as RelationshipPortrait;
}

// ─── Unlock State Helper ───────────────────────────────

export async function checkDyadicCompletion(
  coupleId: string,
  userId: string,
): Promise<{
  userComplete: string[];
  partnerComplete: string[];
  allDone: boolean;
}> {
  const couple = await getCoupleById(coupleId);
  if (!couple) return { userComplete: [], partnerComplete: [], allDone: false };

  const partnerId = couple.partner_a_id === userId
    ? couple.partner_b_id
    : couple.partner_a_id;

  const { data } = await supabase
    .from('dyadic_assessments')
    .select('user_id, assessment_type')
    .eq('couple_id', coupleId);

  if (!data) return { userComplete: [], partnerComplete: [], allDone: false };

  const userComplete = data
    .filter((d: any) => d.user_id === userId)
    .map((d: any) => d.assessment_type);
  const partnerComplete = data
    .filter((d: any) => d.user_id === partnerId)
    .map((d: any) => d.assessment_type);

  const requiredTypes: DyadicAssessmentType[] = ['rdas', 'dci', 'csi-16'];
  const allDone =
    requiredTypes.every((t) => userComplete.includes(t)) &&
    requiredTypes.every((t) => partnerComplete.includes(t));

  return { userComplete, partnerComplete, allDone };
}
