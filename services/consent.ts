/**
 * Consent & Sharing Service
 * Handles data consent records and per-assessment sharing preferences.
 */

import { supabase } from '@/services/supabase';
import type { ConsentType, DataConsent, SharingPreference } from '@/types/consent';

// ─── Individual Assessment Types ─────────────────────────
const INDIVIDUAL_ASSESSMENT_TYPES = [
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
    .single();

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

export async function eraseUserData(userId: string): Promise<void> {
  // 0. Clean up couple-related data first (has foreign key dependencies)
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

  // Also clean up couple invites
  await supabase.from('couple_invites').delete().eq('inviter_id', userId);

  // 1. Delete chat messages via sessions owned by this user
  const { data: sessions } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('user_id', userId);

  if (sessions && sessions.length > 0) {
    const sessionIds = sessions.map((s: any) => s.id);
    const { error: msgError } = await supabase
      .from('chat_messages')
      .delete()
      .in('session_id', sessionIds);

    if (msgError) {
      console.error('[Consent] Failed to delete chat messages:', msgError);
      throw msgError;
    }
  }

  // 2. Delete from remaining tables in dependency-safe order
  const tables = [
    'chat_sessions',
    'exercise_completions',
    'growth_edge_progress',
    'daily_check_ins',
    'assessments',
    'portraits',
    'sharing_preferences',
    'data_consents',
  ];

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error(`[Consent] Failed to delete from ${table}:`, error);
      throw error;
    }
  }
}
