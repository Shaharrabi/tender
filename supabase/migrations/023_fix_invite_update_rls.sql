-- ============================================================
-- Migration 023: Fix couple_invites UPDATE RLS Policy
--
-- Bug: The acceptor (non-inviter) could not update an invite
-- because the implicit WITH CHECK defaulted to the USING clause.
-- After changing status from 'pending' to 'accepted', neither
-- condition (auth.uid() = inviter_id OR status = 'pending')
-- held true, so PostgreSQL silently rejected the write.
--
-- Fix: Add an explicit WITH CHECK that allows the acceptor
-- (who sets accepted_by = their own uid) to complete the update.
-- ============================================================

DROP POLICY IF EXISTS "Users can update invites" ON couple_invites;
CREATE POLICY "Users can update invites"
  ON couple_invites FOR UPDATE
  USING (auth.uid() = inviter_id OR status = 'pending')
  WITH CHECK (auth.uid() = inviter_id OR auth.uid() = accepted_by);
