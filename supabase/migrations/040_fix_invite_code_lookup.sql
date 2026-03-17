-- ============================================================
-- Migration 040: Fix invite code lookup — RLS was too restrictive
--
-- Bug: Migration 027 tightened the "Anyone can read pending invites by code"
-- policy to only allow inviter_id or accepted_by to read invites.
-- But when a new user enters a code, they are NEITHER the inviter
-- nor the accepted_by (which is NULL for pending invites).
-- Result: getInviteByCode() always returns empty → "invalid code".
--
-- Fix: Replace with a SECURITY DEFINER function that looks up the
-- invite by code, checks expiry, and returns safe fields only.
-- This avoids exposing all pending invites via RLS while still
-- allowing code-based lookup.
--
-- Also adds a self-invite guard to accept_couple_invite RPC.
-- ============================================================

-- 1. Drop the overly-restrictive SELECT policy for pending invites
DROP POLICY IF EXISTS "Anyone can read pending invites by code" ON couple_invites;

-- 2. Create a secure lookup function (bypasses RLS safely)
CREATE OR REPLACE FUNCTION lookup_invite_by_code(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite RECORD;
  v_raw TEXT;
  v_formatted TEXT;
BEGIN
  -- Normalize code: uppercase, strip non-alphanumeric, reformat as XXXX-XXXX
  v_raw := upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g'));

  IF length(v_raw) = 8 THEN
    v_formatted := substring(v_raw from 1 for 4) || '-' || substring(v_raw from 5 for 4);
  ELSE
    v_formatted := upper(trim(p_code));
  END IF;

  SELECT * INTO v_invite
  FROM couple_invites
  WHERE invite_code = v_formatted
    AND status = 'pending'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Check expiry
  IF v_invite.expires_at < now() THEN
    UPDATE couple_invites SET status = 'expired', updated_at = now()
    WHERE id = v_invite.id;
    RETURN NULL;
  END IF;

  -- Return only safe fields (no inviter_id exposed)
  RETURN jsonb_build_object(
    'id', v_invite.id,
    'invite_code', v_invite.invite_code,
    'inviter_name', v_invite.inviter_name,
    'status', v_invite.status,
    'expires_at', v_invite.expires_at,
    'created_at', v_invite.created_at
  );
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION lookup_invite_by_code(TEXT) TO authenticated;

-- 3. Patch accept_couple_invite to reject self-invites
CREATE OR REPLACE FUNCTION accept_couple_invite(
  p_invite_id UUID,
  p_acceptor_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invite RECORD;
  v_couple RECORD;
  v_now TIMESTAMPTZ := now();
BEGIN
  -- 1. Lock and update the invite (only if still pending)
  UPDATE couple_invites
    SET status = 'accepted',
        accepted_by = p_acceptor_id,
        updated_at = v_now
    WHERE id = p_invite_id
      AND status = 'pending'
    RETURNING * INTO v_invite;

  IF v_invite IS NULL THEN
    RAISE EXCEPTION 'Invite not found or no longer pending';
  END IF;

  -- 1b. Reject self-invites (user trying to accept their own code)
  IF v_invite.inviter_id = p_acceptor_id THEN
    -- Roll back the status change
    UPDATE couple_invites
      SET status = 'pending', accepted_by = NULL, updated_at = v_now
      WHERE id = p_invite_id;
    RAISE EXCEPTION 'Cannot accept your own invite';
  END IF;

  -- 2. Create the couple record
  INSERT INTO couples (partner_a_id, partner_b_id, invite_id)
    VALUES (v_invite.inviter_id, p_acceptor_id, p_invite_id)
    RETURNING * INTO v_couple;

  -- 3. Update both partners' relationship_mode
  UPDATE user_profiles
    SET relationship_mode = 'real_partner', updated_at = v_now
    WHERE user_id IN (p_acceptor_id, v_invite.inviter_id);

  -- 4. Initialize sharing defaults for both partners
  INSERT INTO sharing_preferences (user_id, couple_id, assessment_type, shared)
    SELECT u.user_id, v_couple.id, t.type, false
    FROM (VALUES (p_acceptor_id), (v_invite.inviter_id)) AS u(user_id)
    CROSS JOIN (VALUES ('ecr-r'), ('dutch'), ('sseit'), ('dsi-r'), ('ipip-neo-120'), ('values')) AS t(type)
    ON CONFLICT DO NOTHING;

  RETURN jsonb_build_object(
    'couple_id', v_couple.id,
    'partner_a_id', v_couple.partner_a_id,
    'partner_b_id', v_couple.partner_b_id,
    'status', v_couple.status,
    'created_at', v_couple.created_at
  );
END;
$$;
