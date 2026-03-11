/**
 * Guest Write Guard — Prevents guest users from executing write operations.
 *
 * Provides a lightweight check that services can call before any Supabase
 * INSERT / UPDATE / DELETE. Guest users (no JWT) would be rejected by RLS
 * anyway, but this guard:
 *
 *   1. Fails fast with a clear error (vs. cryptic RLS denial)
 *   2. Prevents unnecessary network round-trips
 *   3. Gives us a single place to log/track blocked attempts
 *
 * Usage:
 *   import { assertNotGuest } from '@/utils/security/guest-guard';
 *   assertNotGuest(userId, 'saveAssessment');
 */

/**
 * Throws if the provided userId is falsy (null / undefined / empty string),
 * which indicates a guest or unauthenticated session.
 */
export function assertNotGuest(
  userId: string | null | undefined,
  operation: string
): asserts userId is string {
  if (!userId) {
    if (__DEV__) {
      console.warn(
        `[GuestGuard] Blocked write operation "${operation}" — no authenticated user.`
      );
    }
    throw new Error(
      `This action requires a Tender account. Please sign in to ${operation.replace(/_/g, ' ')}.`
    );
  }
}
