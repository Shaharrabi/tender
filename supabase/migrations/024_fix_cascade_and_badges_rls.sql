-- Migration 024: Fix user deletion + badges RLS
--
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- =====================================================================

-- ═══════════════════════════════════════════════════════════════
-- FIX 1: Add ON DELETE CASCADE to missing foreign keys
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE couple_invites
  DROP CONSTRAINT IF EXISTS couple_invites_accepted_by_fkey;
ALTER TABLE couple_invites
  ADD CONSTRAINT couple_invites_accepted_by_fkey
  FOREIGN KEY (accepted_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE couple_chat_sessions
  DROP CONSTRAINT IF EXISTS couple_chat_sessions_created_by_fkey;
ALTER TABLE couple_chat_sessions
  ADD CONSTRAINT couple_chat_sessions_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE couple_chat_messages
  DROP CONSTRAINT IF EXISTS couple_chat_messages_user_id_fkey;
ALTER TABLE couple_chat_messages
  ADD CONSTRAINT couple_chat_messages_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- FIX 2: Enable RLS on badges and daily_challenges
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════
-- FIX 3: Create a helper function to delete users properly
-- The Supabase dashboard delete sometimes fails because of
-- internal auth tables (sessions, refresh_tokens, identities,
-- mfa_factors, etc.). This function cleans everything up.
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.delete_user_completely(target_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get email for confirmation
  SELECT email INTO user_email FROM auth.users WHERE id = target_user_id;

  IF user_email IS NULL THEN
    RETURN 'User not found: ' || target_user_id::text;
  END IF;

  -- Delete from auth internal tables first
  DELETE FROM auth.sessions WHERE user_id = target_user_id;
  DELETE FROM auth.refresh_tokens WHERE user_id = target_user_id;
  DELETE FROM auth.mfa_factors WHERE user_id = target_user_id;
  DELETE FROM auth.mfa_challenges WHERE factor_id IN (
    SELECT id FROM auth.mfa_factors WHERE user_id = target_user_id
  );
  DELETE FROM auth.identities WHERE user_id = target_user_id;
  DELETE FROM auth.one_time_tokens WHERE user_id = target_user_id;

  -- Now delete the user (CASCADE will clean up public tables)
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN 'Deleted user: ' || user_email || ' (' || target_user_id::text || ')';
END;
$$;

-- Grant execute to service_role (so it can be called from SQL Editor)
GRANT EXECUTE ON FUNCTION public.delete_user_completely(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_user_completely(UUID) TO postgres;
