/**
 * Partner Activity Hooks
 * ─────────────────────────────────────────────────────
 * Helper that fires partner activity notifications after key events.
 * Non-blocking: failures are silently swallowed so they never
 * break the primary action (step completion, practice, etc.).
 */

import { getMyCouple } from './couples';
import { createPartnerActivity, type ActivityType } from './partner-activity';

/**
 * Notify the partner that the user did something.
 * Looks up the couple, figures out who the partner is, and inserts
 * an activity row. Safe to call even if the user has no partner —
 * it will silently no-op.
 */
export async function notifyPartner(
  userId: string,
  activityType: ActivityType,
  activityData: Record<string, any>,
  requiresCompletion?: string | null,
): Promise<void> {
  try {
    const couple = await getMyCouple(userId);
    if (!couple) return; // no partner — nothing to notify

    const partnerId = couple.partner_a_id === userId
      ? couple.partner_b_id
      : couple.partner_a_id;

    // Don't notify yourself (self-couple)
    if (partnerId === userId) return;

    await createPartnerActivity(
      couple.id,
      userId,
      partnerId,
      activityType,
      activityData,
      requiresCompletion,
    );
  } catch {
    // Best-effort — never break the primary action
  }
}
