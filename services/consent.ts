/**
 * Consent & Sharing Service
 * Handles data consent records and per-assessment sharing preferences.
 */

import { supabase } from '@/services/supabase';
import { assertNotGuest } from '@/utils/security/guest-guard';
import type { ConsentType, DataConsent, SharingPreference } from '@/types/consent';

// ─── Individual Assessment Types ─────────────────────────
export const INDIVIDUAL_ASSESSMENT_TYPES = [
  'ecr-r',
  'dutch',
  'sseit',
  'dsi-r',
  'ipip-neo-120',
  'values',
];

// ─── Consent Records ─────────────────────────────────────

export async function getUserConsent(userId: string): Promise<DataConsent | null> {
  const { data, error } = await supabase
    .from('data_consents')
    .select('*')
    .eq('user_id', userId)
    .is('revoked_at', null)
    .order('consented_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    consentType: data.consent_type,
    consentText: data.consent_text,
    consentedAt: data.consented_at,
    revokedAt: data.revoked_at,
  } as DataConsent;
}

export async function saveConsent(
  userId: string,
  consentType: ConsentType,
  consentText: string,
): Promise<DataConsent> {
  const { data, error } = await supabase
    .from('data_consents')
    .insert({
      user_id: userId,
      consent_type: consentType,
      consent_text: consentText,
    })
    .select()
    .single();

  if (error) {
    console.error('[Consent] Failed to save consent:', error);
    throw error;
  }

  return {
    id: data.id,
    userId: data.user_id,
    consentType: data.consent_type,
    consentText: data.consent_text,
    consentedAt: data.consented_at,
    revokedAt: data.revoked_at,
  } as DataConsent;
}

export async function revokeConsent(userId: string): Promise<void> {
  const { error } = await supabase
    .from('data_consents')
    .update({ revoked_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('revoked_at', null);

  if (error) {
    console.error('[Consent] Failed to revoke consent:', error);
    throw error;
  }
}

// ─── Sharing Preferences ─────────────────────────────────

export async function getSharingPreferences(
  userId: string,
  coupleId: string,
): Promise<SharingPreference[]> {
  const { data, error } = await supabase
    .from('sharing_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('couple_id', coupleId);

  if (error) {
    console.error('[Consent] Failed to get sharing preferences:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    coupleId: row.couple_id,
    assessmentType: row.assessment_type,
    shared: row.shared,
    updatedAt: row.updated_at,
  })) as SharingPreference[];
}

export async function updateSharingPreference(
  userId: string,
  coupleId: string,
  assessmentType: string,
  shared: boolean,
): Promise<void> {
  const { error } = await supabase
    .from('sharing_preferences')
    .upsert(
      {
        user_id: userId,
        couple_id: coupleId,
        assessment_type: assessmentType,
        shared,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,couple_id,assessment_type' },
    )
    .select();

  if (error) {
    console.error('[Consent] Failed to update sharing preference:', error);
    throw error;
  }
}

export async function initializeSharingDefaults(
  userId: string,
  coupleId: string,
): Promise<void> {
  const rows = INDIVIDUAL_ASSESSMENT_TYPES.map((assessmentType) => ({
    user_id: userId,
    couple_id: coupleId,
    assessment_type: assessmentType,
    shared: false,
  }));

  const { error } = await supabase
    .from('sharing_preferences')
    .upsert(rows, { onConflict: 'user_id,couple_id,assessment_type' })
    .select();

  if (error) {
    console.error('[Consent] Failed to initialize sharing defaults:', error);
    throw error;
  }
}

export async function getPartnerSharedAssessments(
  partnerId: string,
  coupleId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from('sharing_preferences')
    .select('assessment_type')
    .eq('user_id', partnerId)
    .eq('couple_id', coupleId)
    .eq('shared', true);

  if (error) {
    console.error('[Consent] Failed to get partner shared assessments:', error);
    return [];
  }

  return (data || []).map((row: any) => row.assessment_type);
}

// ─── Data Erasure ─────────────────────────────────────────

/**
 * Erase ALL user data across every table the app writes to.
 *
 * Phases:
 *   0 — Couple-related data (FK dependencies)
 *   1 — Chat / couple-chat message cascades
 *   2 — Every remaining user_id table (dependency-safe order)
 *
 * Tables that are global/shared (no user_id) are NOT touched:
 *   weekly_prompts, support_groups, support_group_sessions,
 *   daily_challenges, badges, steps, mystery_content.
 */
export async function eraseUserData(userId: string): Promise<void> {
  assertNotGuest(userId, 'delete_account_data');

  // ── Phase 0: Couple-related data (FK dependencies) ─────────
  const { data: myCouples } = await supabase
    .from('couples')
    .select('id')
    .or(`partner_a_id.eq.${userId},partner_b_id.eq.${userId}`);

  if (myCouples && myCouples.length > 0) {
    for (const c of myCouples) {
      await supabase.from('dyadic_assessments').delete().eq('couple_id', c.id);
      await supabase.from('relationship_portraits').delete().eq('couple_id', c.id);
      await supabase.from('sharing_preferences').delete().eq('couple_id', c.id);
    }
    await supabase
      .from('couples')
      .delete()
      .or(`partner_a_id.eq.${userId},partner_b_id.eq.${userId}`);
  }

  await supabase.from('couple_invites').delete().eq('inviter_id', userId);

  // ── Phase 1: Chat message cascades ─────────────────────────
  // Individual chat
  const { data: chatSessions } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('user_id', userId);

  if (chatSessions && chatSessions.length > 0) {
    await supabase
      .from('chat_messages')
      .delete()
      .in('session_id', chatSessions.map((s: any) => s.id));
  }

  // Couple chat (user may have created sessions)
  const { data: coupleSessions } = await supabase
    .from('couple_chat_sessions')
    .select('id')
    .eq('user_id', userId);

  if (coupleSessions && coupleSessions.length > 0) {
    await supabase
      .from('couple_chat_messages')
      .delete()
      .in('session_id', coupleSessions.map((s: any) => s.id));
  }

  // ── Phase 2: All user_id tables (dependency-safe order) ────
  const tables = [
    // Chat parents (children already deleted above)
    'chat_sessions',
    'couple_chat_sessions',

    // Core assessment & portrait data
    'assessments',
    'portraits',

    // Growth & progress
    'growth_edge_progress',
    'daily_check_ins',
    'step_progress',
    'step_minigame_outputs',
    'practice_completions',
    'exercise_completions',

    // Gamification
    'xp_transactions',
    'user_badges',
    'user_daily_challenges',
    'user_gamification',

    // Engagement
    'engagement_streaks',
    'engagement_notification_log',

    // Journal & reflections
    'daily_reflections',
    'card_completions',
    'weare_scores',
    'weekly_check_ins',

    // Dating mode
    'dating_room_activity',
    'dating_journal',
    'dating_letters',
    'dating_profiles',

    // Community & support
    'community_reactions',
    'community_posts',
    'community_letters',
    'community_memberships',
    'support_group_attendance',
    'support_group_members',

    // Consent & sharing (last — least dependent)
    'sharing_preferences',
    'data_consents',

    // User profile (very last — identity row)
    'user_profiles',
  ];

  const errors: string[] = [];

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('user_id', userId);

    if (error) {
      // Log but continue — best-effort deletion across all tables
      console.error(`[Consent] Failed to delete from ${table}:`, error);
      errors.push(`${table}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`[Consent] Data erasure completed with ${errors.length} error(s):`, errors);
    // Throw only if critical tables failed
    const critical = errors.filter(
      (e) => e.startsWith('assessments:') || e.startsWith('portraits:') || e.startsWith('chat_sessions:'),
    );
    if (critical.length > 0) {
      throw new Error(`Failed to delete critical data: ${critical.join('; ')}`);
    }
  }
}
