/**
 * Partner Activity Hooks
 * ─────────────────────────────────────────────────────
 * Helper that fires partner activity notifications after key events.
 * Non-blocking: failures are silently swallowed so they never
 * break the primary action (step completion, practice, etc.).
 *
 * Also exposes a lightweight listener so the UI can show a brief
 * "✓ Partner notified" toast without any changes at each call site.
 */

import { getMyCouple } from './couples';
import { createPartnerActivity, type ActivityType } from './partner-activity';

// ─── Lightweight event emitter for "partner notified" confirmation ───
type PartnerNotifiedListener = () => void;
const _listeners = new Set<PartnerNotifiedListener>();

/** Subscribe to successful partner notifications. Returns unsubscribe fn. */
export function onPartnerNotified(fn: PartnerNotifiedListener): () => void {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
}

function emitPartnerNotified(): void {
  _listeners.forEach((fn) => fn());
}

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

    // Let any listeners know (for "✓ Partner notified" toast)
    emitPartnerNotified();
  } catch {
    // Best-effort — never break the primary action
  }
}
