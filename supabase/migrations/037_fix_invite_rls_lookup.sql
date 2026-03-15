-- ============================================================
-- Migration 037: Fix invite code lookup RLS
--
-- Migration 027 broke the invite acceptance flow by restricting
-- SELECT to only inviter_id or accepted_by. When Partner B tries
-- to look up a pending invite code, accepted_by is still NULL and
-- they are not the inviter, so RLS silently returns zero rows —
-- making the code appear "invalid or expired."
--
-- Fix: Re-allow anyone to read pending invites (needed for code
-- lookup), while keeping the tighter policy for non-pending rows.
-- The UPDATE policy from 027 is correct and stays unchanged.
-- ============================================================

ALTER POLICY "Anyone can read pending invites by code" ON couple_invites
  USING (
    status = 'pending'
    OR auth.uid() = inviter_id
    OR auth.uid() = accepted_by
  );
