-- ============================================================
-- Migration 044: Fix couple reconnection after disconnect
--
-- Bug: disconnectCouple() sets status='disconnected' but does NOT
-- delete the couples row. When the same pair tries to reconnect,
-- INSERT INTO couples hits UNIQUE(partner_a_id, partner_b_id).
--
-- Fix: accept_couple_invite now checks for existing disconnected
-- couple records and reactivates them instead of inserting new ones.
-- Also handles the reverse order (A invited B first, now B invites A).
-- ============================================================

CREATE OR REPLACE FUNCTION accept_couple_invite(
  p_invite_id UUID,
  p_acceptor_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite RECORD;
  v_couple RECORD;
  v_existing RECORD;
  v_now TIMESTAMPTZ := now();
BEGIN
  -- 1. Lock the invite row
  SELECT * INTO v_invite
  FROM couple_invites
  WHERE id = p_invite_id
    AND status = 'pending'
  FOR UPDATE;

  IF v_invite IS NULL THEN
    RAISE EXCEPTION 'Invite not found or no longer pending';
  END IF;

  -- 1b. Reject self-invites
  IF v_invite.inviter_id = p_acceptor_id THEN
    RAISE EXCEPTION 'Cannot accept your own invite';
  END IF;

  -- 2. Mark invite as accepted
  UPDATE couple_invites
    SET status = 'accepted',
        accepted_by = p_acceptor_id,
        updated_at = v_now
    WHERE id = p_invite_id;

  -- 3. Check for existing couple record (either direction)
  SELECT * INTO v_existing
  FROM couples
  WHERE (partner_a_id = v_invite.inviter_id AND partner_b_id = p_acceptor_id)
     OR (partner_a_id = p_acceptor_id AND partner_b_id = v_invite.inviter_id)
  LIMIT 1;

  IF v_existing IS NOT NULL THEN
    -- Reactivate existing couple record
    UPDATE couples
      SET status = 'active',
          invite_id = p_invite_id,
          updated_at = v_now
      WHERE id = v_existing.id
      RETURNING * INTO v_couple;
  ELSE
    -- Create new couple record
    INSERT INTO couples (partner_a_id, partner_b_id, invite_id)
      VALUES (v_invite.inviter_id, p_acceptor_id, p_invite_id)
      RETURNING * INTO v_couple;
  END IF;

  -- 4. Update both partners' relationship_mode
  UPDATE user_profiles
    SET relationship_mode = 'real_partner', updated_at = v_now
    WHERE user_id IN (p_acceptor_id, v_invite.inviter_id);

  -- 5. Initialize sharing defaults (ON CONFLICT DO NOTHING handles existing)
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

-- Also expire any old pending invites from the same user before creating new ones
CREATE OR REPLACE FUNCTION create_invite_and_expire_old(
  p_inviter_id UUID,
  p_inviter_name TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
  v_invite RECORD;
  v_chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_i INT;
  v_raw TEXT := '';
BEGIN
  -- 1. Expire all old pending invites from this user
  UPDATE couple_invites
    SET status = 'expired', updated_at = now()
    WHERE inviter_id = p_inviter_id
      AND status = 'pending';

  -- 2. Generate code
  FOR v_i IN 1..8 LOOP
    v_raw := v_raw || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
  END LOOP;
  v_code := substr(v_raw, 1, 4) || '-' || substr(v_raw, 5, 4);

  -- 3. Create invite
  INSERT INTO couple_invites (inviter_id, invite_code, inviter_name, status, expires_at)
    VALUES (p_inviter_id, v_code, p_inviter_name, 'pending', now() + interval '7 days')
    RETURNING * INTO v_invite;

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

GRANT EXECUTE ON FUNCTION create_invite_and_expire_old(UUID, TEXT) TO authenticated;
