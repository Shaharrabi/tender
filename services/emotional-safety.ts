/**
 * Emotional Safety Service
 * Anti-pressure rules for the retention engine.
 *
 * Rules:
 * - Max 1 relational nudge per day (notification budget)
 * - No stacking multiple partner-triggered hooks in one day
 * - Quiet mode after conflict-heavy weeks (auto-detected from WEARE)
 * - Hide partner-triggered hooks if consent/share state is partial or stale
 */

import { supabase } from './supabase';

const MAX_RELATIONAL_NUDGES_PER_DAY = 1;
const QUIET_MODE_DAYS = 5; // days of quiet after conflict-heavy week

// ─── Notification Budget ────────────────────────────────

export async function canSendRelationalNudge(userId: string): Promise<boolean> {
  const today = localDateString();

  const { data } = await supabase
    .from('notification_budget')
    .select('relational_nudges_sent, quiet_mode_until')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  // Check quiet mode
  if (data?.quiet_mode_until) {
    const quietUntil = new Date(data.quiet_mode_until);
    if (quietUntil > new Date()) return false;
  }

  // Check daily budget
  if (data && data.relational_nudges_sent >= MAX_RELATIONAL_NUDGES_PER_DAY) {
    return false;
  }

  return true;
}

export async function recordRelationalNudge(userId: string): Promise<void> {
  const today = localDateString();

  const { data: existing } = await supabase
    .from('notification_budget')
    .select('id, relational_nudges_sent')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('notification_budget')
      .update({
        relational_nudges_sent: (existing.relational_nudges_sent || 0) + 1,
        last_nudge_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('notification_budget')
      .insert({
        user_id: userId,
        date: today,
        relational_nudges_sent: 1,
        last_nudge_at: new Date().toISOString(),
      });
  }
}

// ─── Quiet Mode ─────────────────────────────────────────

export async function checkAndEnableQuietMode(
  userId: string,
  coupleId: string,
): Promise<boolean> {
  // Check if the couple had a conflict-heavy week
  // (WEARE emergence_delta < -2 or resistance bottleneck)
  const { data: weare } = await supabase
    .from('weare_scores')
    .select('bottleneck, emergence_delta, resonance_delta')
    .eq('couple_id', coupleId)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!weare) return false;

  const isConflictHeavy =
    (weare.emergence_delta != null && weare.emergence_delta < -2) ||
    (weare.resonance_delta != null && weare.resonance_delta < -3) ||
    weare.bottleneck === 'resistance';

  if (isConflictHeavy) {
    const quietUntil = new Date();
    quietUntil.setDate(quietUntil.getDate() + QUIET_MODE_DAYS);

    const today = localDateString();

    // Upsert today's budget with quiet mode
    const { data: existing } = await supabase
      .from('notification_budget')
      .select('id')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('notification_budget')
        .update({
          quiet_mode_until: quietUntil.toISOString(),
          quiet_reason: `conflict_heavy_week:${weare.bottleneck}`,
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('notification_budget')
        .insert({
          user_id: userId,
          date: today,
          quiet_mode_until: quietUntil.toISOString(),
          quiet_reason: `conflict_heavy_week:${weare.bottleneck}`,
        });
    }

    return true;
  }

  return false;
}

// ─── Consent Check ──────────────────────────────────────

export async function shouldShowPartnerHooks(
  userId: string,
  coupleId: string,
): Promise<boolean> {
  // Check if sharing consent is current and complete
  const { data: consent } = await supabase
    .from('sharing_preferences')
    .select('share_portrait, share_reflections, updated_at')
    .eq('user_id', userId)
    .eq('couple_id', coupleId)
    .maybeSingle();

  if (!consent) return false;

  // If consent is stale (>30 days old), hide partner hooks
  if (consent.updated_at) {
    const lastUpdated = new Date(consent.updated_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (lastUpdated < thirtyDaysAgo) return false;
  }

  // At least one sharing preference must be on
  return consent.share_portrait || consent.share_reflections;
}

// ─── Is In Quiet Mode ───────────────────────────────────

export async function isInQuietMode(userId: string): Promise<boolean> {
  // Check most recent budget entry for active quiet mode
  const { data } = await supabase
    .from('notification_budget')
    .select('quiet_mode_until')
    .eq('user_id', userId)
    .not('quiet_mode_until', 'is', null)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.quiet_mode_until) return false;

  return new Date(data.quiet_mode_until) > new Date();
}

// ─── Helper ─────────────────────────────────────────────

function localDateString(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
