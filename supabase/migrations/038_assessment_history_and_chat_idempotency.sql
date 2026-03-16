-- ============================================================
-- Migration 038: Assessment history preservation + Chat idempotency
-- ============================================================
-- 1. Adds is_current flag to assessments table so retakes preserve history
-- 2. Adds idempotency_key to chat_messages to prevent duplicate inserts
-- 3. Adds is_estimated flag context for WEARE field data
-- ============================================================

-- ─── 1. Assessment history: add is_current column ───────
-- Instead of deleting old assessments on retake, we now mark
-- only the latest as is_current = true. Old rows are preserved
-- for longitudinal analysis.

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS is_current BOOLEAN NOT NULL DEFAULT true;

-- Partial index: fast lookup for "give me the current assessment of type X"
CREATE INDEX IF NOT EXISTS idx_assessments_current
  ON assessments (user_id, type) WHERE is_current = true;

-- ─── 2. Chat idempotency key ────────────────────────────
-- Prevents duplicate user messages when the client retries
-- after a timeout or network error.

DO $$
BEGIN
  -- chat_messages
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_messages') THEN
    ALTER TABLE chat_messages
      ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

    -- Unique constraint: same session + same idempotency key = reject duplicate
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chat_messages_idempotency'
    ) THEN
      CREATE UNIQUE INDEX idx_chat_messages_idempotency
        ON chat_messages (session_id, idempotency_key)
        WHERE idempotency_key IS NOT NULL;
    END IF;
  END IF;

  -- couple_chat_messages
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'couple_chat_messages') THEN
    ALTER TABLE couple_chat_messages
      ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes WHERE indexname = 'idx_couple_chat_messages_idempotency'
    ) THEN
      CREATE UNIQUE INDEX idx_couple_chat_messages_idempotency
        ON couple_chat_messages (session_id, idempotency_key)
        WHERE idempotency_key IS NOT NULL;
    END IF;
  END IF;
END $$;

-- ─── 3. Atomic couple invite acceptance RPC ─────────────
-- Replaces multi-step client-side writes with a single
-- transactional function. If any step fails, everything rolls back.

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
