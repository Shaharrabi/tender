/**
 * Engagement Notification Service — Supabase CRUD for the notification log.
 *
 * Logs which engagement notifications were shown, tapped, and led to actions.
 * Used for analytics and cross-device persistence.
 */

import { supabase } from './supabase';
import type { NotificationInstance } from '@/types/notifications';

// ─── Log Operations ─────────────────────────────────────

/** Log a notification shown to the user. Returns the log entry ID. */
export async function logNotificationShown(
  userId: string,
  promptId: string,
  category: string,
  weareTarget?: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('engagement_notification_log')
    .insert({
      user_id: userId,
      prompt_id: promptId,
      category,
      weare_target: weareTarget ?? null,
    })
    .select('id')
    .single();

  if (error) {
    if (__DEV__) console.warn('[Engagement] Log shown error:', error);
    return null;
  }
  return data?.id ?? null;
}

/** Log that a notification was tapped. */
export async function logNotificationTapped(notifId: string): Promise<void> {
  const { error } = await supabase
    .from('engagement_notification_log')
    .update({ tapped_at: new Date().toISOString() })
    .eq('id', notifId);

  if (error && __DEV__) console.warn('[Engagement] Log tap error:', error);
}

/** Log that a notification was dismissed. */
export async function logNotificationDismissed(notifId: string): Promise<void> {
  const { error } = await supabase
    .from('engagement_notification_log')
    .update({ dismissed_at: new Date().toISOString() })
    .eq('id', notifId);

  if (error && __DEV__) console.warn('[Engagement] Log dismiss error:', error);
}

/** Log that the notification led to an action (e.g., started a practice). */
export async function logNotificationAction(notifId: string): Promise<void> {
  const { error } = await supabase
    .from('engagement_notification_log')
    .update({ action_taken: true })
    .eq('id', notifId);

  if (error && __DEV__) console.warn('[Engagement] Log action error:', error);
}

// ─── History ────────────────────────────────────────────

/** Fetch recent notification history for a user. */
export async function getNotificationHistory(
  userId: string,
  limit: number = 50,
): Promise<NotificationInstance[]> {
  const { data, error } = await supabase
    .from('engagement_notification_log')
    .select('*')
    .eq('user_id', userId)
    .order('shown_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (__DEV__) console.warn('[Engagement] History error:', error);
    return [];
  }

  return (data ?? []).map(mapNotification);
}

// ─── Mapper ─────────────────────────────────────────────

function mapNotification(row: any): NotificationInstance {
  return {
    id: row.id,
    promptId: row.prompt_id,
    category: row.category,
    userId: row.user_id,
    shownAt: row.shown_at,
    dismissedAt: row.dismissed_at ?? undefined,
    tappedAt: row.tapped_at ?? undefined,
    actionTaken: row.action_taken ?? false,
  };
}
