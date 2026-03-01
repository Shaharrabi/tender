-- ============================================================
-- Migration 027: Tighten couple_invites RLS policies
--
-- Security fix: The SELECT policy "Anyone can read pending invites by code"
-- allowed ANY authenticated user to read ALL pending invites.
-- The UPDATE policy allowed ANY user to update ANY pending invite.
--
-- Fix: Restrict both to only the inviter or the accepted_by user.
-- ============================================================

-- Tighten SELECT: only the inviter or the person who accepted can read
ALTER POLICY "Anyone can read pending invites by code" ON couple_invites
  USING (auth.uid() = inviter_id OR auth.uid() = accepted_by);

-- Tighten UPDATE: only the inviter or the person who accepted can update
ALTER POLICY "Users can update invites" ON couple_invites
  USING (auth.uid() = inviter_id OR auth.uid() = accepted_by)
  WITH CHECK (auth.uid() = inviter_id OR auth.uid() = accepted_by);
