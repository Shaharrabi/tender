/**
 * Couples Service
 * Handles partner invitation, couple linking, and dyadic assessment CRUD.
 */

import { supabase } from './supabase';
// initializeSharingDefaults is now handled inside the accept_couple_invite RPC
import { assertNotGuest } from '@/utils/security/guest-guard';
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
    .maybeSingle();

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
  assertNotGuest(inviterId, 'create_partner_invite');
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
  // Use SECURITY DEFINER RPC to bypass RLS for code lookup.
  // Direct SELECT was blocked by migration 027 which restricted reads
  // to inviter_id or accepted_by — but the accepting user is neither.
  const { data, error } = await supabase.rpc('lookup_invite_by_code', {
    p_code: code,
  });

  if (error) {
    console.error('[Couples] Invite lookup failed:', error.message);
    return null;
  }

  if (!data) return null;

  // RPC returns JSONB with safe fields
  return {
    id: data.id,
    invite_code: data.invite_code,
    inviter_name: data.inviter_name,
    status: data.status,
    expires_at: data.expires_at,
    created_at: data.created_at,
  } as CoupleInvite;
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
  assertNotGuest(acceptorId, 'accept_partner_invite');

  // Use atomic RPC — all steps (invite update, couple creation, profile
  // updates, sharing defaults) happen in a single database transaction.
  // If any step fails, everything rolls back cleanly.
  const { data, error } = await supabase.rpc('accept_couple_invite', {
    p_invite_id: inviteId,
    p_acceptor_id: acceptorId,
  });

  if (error) {
    console.error('[Couples] Atomic accept failed:', error.message);
    // Surface specific errors for better debugging
    if (error.message?.includes('Cannot accept your own invite')) {
      throw new Error("You can't accept your own invite code.");
    }
    if (error.message?.includes('no longer pending')) {
      throw new Error('This invite has already been used or expired.');
    }
    throw new Error(`Connection failed: ${error.message}`);
  }

  // RPC returns a JSONB object with couple fields
  const result = data as any;
  return {
    id: result.couple_id,
    partner_a_id: result.partner_a_id,
    partner_b_id: result.partner_b_id,
    status: result.status || 'active',
    created_at: result.created_at,
  } as Couple;
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

/** Returns true if this couple row is a self-couple (partner_a === partner_b) */
export function isSelfCouple(couple: Couple): boolean {
  return couple.partner_a_id === couple.partner_b_id;
}

export async function getMyCouple(userId: string): Promise<Couple | null> {
  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .or(`partner_a_id.eq.${userId},partner_b_id.eq.${userId}`)
    .eq('status', 'active')
    .maybeSingle();

  if (error || !data) return null;
  return data as Couple;
}

export async function getPartnerProfile(userId: string): Promise<UserProfile | null> {
  const couple = await getMyCouple(userId);
  if (!couple) return null;

  // Self-couple: no real partner exists
  if (isSelfCouple(couple)) return null;

  const partnerId = couple.partner_a_id === userId
    ? couple.partner_b_id
    : couple.partner_a_id;

  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', partnerId)
    .maybeSingle();

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

export async function deleteCouple(coupleId: string): Promise<boolean> {
  const { error } = await supabase
    .from('couples')
    .delete()
    .eq('id', coupleId);

  return !error;
}

/**
 * Clean up all couple-related data for a user.
 * Deletes dyadic assessments, relationship portraits, and couple rows.
 */
export async function cleanupAllCouples(userId: string): Promise<void> {
  const { data: allCouples } = await supabase
    .from('couples')
    .select('id')
    .or(`partner_a_id.eq.${userId},partner_b_id.eq.${userId}`);

  if (allCouples && allCouples.length > 0) {
    for (const row of allCouples) {
      await supabase.from('dyadic_assessments').delete().eq('couple_id', row.id);
      await supabase.from('relationship_portraits').delete().eq('couple_id', row.id);
      await supabase.from('sharing_preferences').delete().eq('couple_id', row.id);
    }
    await supabase
      .from('couples')
      .delete()
      .or(`partner_a_id.eq.${userId},partner_b_id.eq.${userId}`);
  }
}

/**
 * Setup a demo partner as a virtual couple.
 * Creates a self-couple (partner_a = partner_b = userId to satisfy RLS)
 * and seeds dyadic assessment scores.
 */
export async function setupDemoPartnerCouple(
  userId: string,
): Promise<Couple | null> {
  // 1. Clean up any existing couples for this user
  await cleanupAllCouples(userId);

  // 2. Create fresh self-couple
  const { data: couple, error } = await supabase
    .from('couples')
    .insert({
      partner_a_id: userId,
      partner_b_id: userId,
      status: 'active',
    })
    .select()
    .single();

  if (error || !couple) {
    console.error('[Couples] Failed to create demo couple:', error);
    return null;
  }

  return couple as Couple;
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
    throw new Error(`Dyadic save failed: ${error.message} (code: ${error.code})`);
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
    .maybeSingle();

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
    .maybeSingle();

  if (error || !data) return null;
  return data as RelationshipPortrait;
}

// ─── Deep Couple Portrait ────────────────────────────────

/**
 * Save the deep couple portrait to the relationship_portraits.deep_portrait JSONB column.
 * Uses update (not upsert) since the relationship_portraits row must already exist.
 */
export async function saveDeepCouplePortrait(
  coupleId: string,
  deepPortrait: any,
): Promise<boolean> {
  const { error } = await supabase
    .from('relationship_portraits')
    .update({
      deep_portrait: deepPortrait,
      updated_at: new Date().toISOString(),
    })
    .eq('couple_id', coupleId);

  if (error) {
    // Column may not exist if migration 029 hasn't been applied
    if (error.code === '42703' || error.message?.includes('deep_portrait')) {
      console.warn('[Couples] deep_portrait column missing — migration 029 not applied yet');
      return false;
    }
    console.error('[Couples] Failed to save deep couple portrait:', error);
    return false;
  }
  return true;
}

/**
 * Get the cached deep couple portrait from the database.
 * Returns null if not saved or if the column doesn't exist.
 */
export async function getDeepCouplePortrait(
  coupleId: string,
): Promise<any | null> {
  const { data, error } = await supabase
    .from('relationship_portraits')
    .select('deep_portrait')
    .eq('couple_id', coupleId)
    .maybeSingle();

  if (error || !data) return null;
  return data.deep_portrait || null;
}

// ─── Unlock State Helper ───────────────────────────────

export async function checkDyadicCompletion(
  coupleId: string,
  userId: string,
): Promise<{
  userComplete: string[];
  partnerComplete: string[];
  allDone: boolean;
  completionLevel?: 'none' | 'preliminary' | 'partial' | 'full';
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

  const userComplete = [...new Set(data
    .filter((d: any) => d.user_id === userId)
    .map((d: any) => d.assessment_type as string))];
  const partnerComplete = [...new Set(data
    .filter((d: any) => d.user_id === partnerId)
    .map((d: any) => d.assessment_type as string))];

  const requiredTypes: DyadicAssessmentType[] = ['rdas', 'dci', 'csi-16', 'relational-field'];

  // Unlock portal after at least 1 dyadic assessment per partner (lower bar)
  const allDone =
    userComplete.length >= 1 && partnerComplete.length >= 1;

  // Track depth for progressive messaging
  const completionLevel: 'none' | 'preliminary' | 'partial' | 'full' =
    !allDone ? 'none'
    : (requiredTypes.every((t) => userComplete.includes(t)) &&
       requiredTypes.every((t) => partnerComplete.includes(t)))
      ? 'full'
      : (userComplete.length + partnerComplete.length >= 4)
        ? 'partial'
        : 'preliminary';

  return { userComplete, partnerComplete, allDone, completionLevel };
}
