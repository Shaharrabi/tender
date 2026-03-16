/**
 * Partner Activity Service
 * Tracks when a partner completes something the other can see.
 * Core curiosity loop: "Your partner did something — come see."
 */

import { supabase } from './supabase';

export type ActivityType =
  | 'step_reflection'
  | 'practice_complete'
  | 'checkin'
  | 'assessment_complete'
  | 'portrait_update';

export interface PartnerActivity {
  id: string;
  coupleId: string;
  actorUserId: string;
  recipientUserId: string;
  activityType: ActivityType;
  activityData: Record<string, any>;
  requiresCompletion: string | null;
  unlocked: boolean;
  unlockedAt: string | null;
  createdAt: string;
  seenAt: string | null;
}

// ─── Create Activity ────────────────────────────────────

export async function createPartnerActivity(
  coupleId: string,
  actorUserId: string,
  recipientUserId: string,
  activityType: ActivityType,
  activityData: Record<string, any>,
  requiresCompletion?: string | null,
): Promise<{ data: any; error: any }> {
  return supabase
    .from('partner_activity')
    .insert({
      couple_id: coupleId,
      actor_user_id: actorUserId,
      recipient_user_id: recipientUserId,
      activity_type: activityType,
      activity_data: activityData,
      requires_completion: requiresCompletion ?? null,
      unlocked: !requiresCompletion,
    });
}

// ─── Get Pending Activities ─────────────────────────────

export async function getPendingActivities(
  userId: string,
): Promise<PartnerActivity[]> {
  const { data, error } = await supabase
    .from('partner_activity')
    .select('*')
    .eq('recipient_user_id', userId)
    .is('seen_at', null)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.warn('[PartnerActivity] getPending error:', error.message);
    return [];
  }
  return (data ?? []).map(mapActivity);
}

// ─── Get Recent Activities (seen + unseen) ──────────────

export async function getRecentActivities(
  userId: string,
  limit = 10,
): Promise<PartnerActivity[]> {
  const { data, error } = await supabase
    .from('partner_activity')
    .select('*')
    .eq('recipient_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[PartnerActivity] getRecent error:', error.message);
    return [];
  }
  return (data ?? []).map(mapActivity);
}

// ─── Mark Seen ──────────────────────────────────────────

export async function markActivitySeen(activityId: string): Promise<void> {
  await supabase
    .from('partner_activity')
    .update({ seen_at: new Date().toISOString() })
    .eq('id', activityId);
}

// ─── Unlock Activity ────────────────────────────────────

export async function unlockActivity(activityId: string): Promise<void> {
  await supabase
    .from('partner_activity')
    .update({ unlocked: true, unlocked_at: new Date().toISOString() })
    .eq('id', activityId);
}

// ─── Mapper ─────────────────────────────────────────────

function mapActivity(row: any): PartnerActivity {
  return {
    id: row.id,
    coupleId: row.couple_id,
    actorUserId: row.actor_user_id,
    recipientUserId: row.recipient_user_id,
    activityType: row.activity_type,
    activityData: row.activity_data ?? {},
    requiresCompletion: row.requires_completion,
    unlocked: row.unlocked,
    unlockedAt: row.unlocked_at,
    createdAt: row.created_at,
    seenAt: row.seen_at,
  };
}
