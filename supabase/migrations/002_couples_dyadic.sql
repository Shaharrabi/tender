-- ============================================================
-- Couples App — Phase 2: Couples & Dyadic Assessment Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- Safe to re-run: uses IF NOT EXISTS and DROP POLICY IF EXISTS
-- ============================================================

-- ─── 7. Couple Invites ──────────────────────────────────────
-- Handles the secure partner invitation flow.
-- One partner creates an invite, the other accepts it.

CREATE TABLE IF NOT EXISTS couple_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,
  inviter_name TEXT,           -- Display name for the consent screen
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  accepted_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE couple_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own invites" ON couple_invites;
CREATE POLICY "Users can read own invites"
  ON couple_invites FOR SELECT
  USING (auth.uid() = inviter_id OR auth.uid() = accepted_by);

DROP POLICY IF EXISTS "Users can create invites" ON couple_invites;
CREATE POLICY "Users can create invites"
  ON couple_invites FOR INSERT
  WITH CHECK (auth.uid() = inviter_id);

DROP POLICY IF EXISTS "Users can update invites" ON couple_invites;
CREATE POLICY "Users can update invites"
  ON couple_invites FOR UPDATE
  USING (auth.uid() = inviter_id OR status = 'pending');

-- Anyone can read pending invites by code (for accepting)
DROP POLICY IF EXISTS "Anyone can read pending invites by code" ON couple_invites;
CREATE POLICY "Anyone can read pending invites by code"
  ON couple_invites FOR SELECT
  USING (status = 'pending');

CREATE INDEX IF NOT EXISTS idx_couple_invites_code ON couple_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_couple_invites_inviter ON couple_invites(inviter_id);


-- ─── 8. Couples ─────────────────────────────────────────────
-- Links two partners together. Created when an invite is accepted.

CREATE TABLE IF NOT EXISTS couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_a_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_b_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_id UUID REFERENCES couple_invites(id),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'disconnected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(partner_a_id, partner_b_id)
);

ALTER TABLE couples ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners can read own couple" ON couples;
CREATE POLICY "Partners can read own couple"
  ON couples FOR SELECT
  USING (auth.uid() = partner_a_id OR auth.uid() = partner_b_id);

DROP POLICY IF EXISTS "Partners can update own couple" ON couples;
CREATE POLICY "Partners can update own couple"
  ON couples FOR UPDATE
  USING (auth.uid() = partner_a_id OR auth.uid() = partner_b_id);

-- Insert is handled by the accept-invite flow (service role or direct)
DROP POLICY IF EXISTS "Users can insert couples" ON couples;
CREATE POLICY "Users can insert couples"
  ON couples FOR INSERT
  WITH CHECK (auth.uid() = partner_a_id OR auth.uid() = partner_b_id);

CREATE INDEX IF NOT EXISTS idx_couples_partner_a ON couples(partner_a_id);
CREATE INDEX IF NOT EXISTS idx_couples_partner_b ON couples(partner_b_id);


-- ─── 9. User Profiles ──────────────────────────────────────
-- Basic profile info for display (names, etc.)
-- Separate from auth.users to store app-specific data.

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  individual_assessments_complete BOOLEAN NOT NULL DEFAULT false,
  dyadic_assessments_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Partners can read each other's profile names
DROP POLICY IF EXISTS "Partners can read linked profiles" ON user_profiles;
CREATE POLICY "Partners can read linked profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE (couples.partner_a_id = auth.uid() AND couples.partner_b_id = user_profiles.user_id)
         OR (couples.partner_b_id = auth.uid() AND couples.partner_a_id = user_profiles.user_id)
    )
  );


-- ─── 10. Dyadic Assessments ────────────────────────────────
-- Stores completed dyadic assessment results.
-- Each partner completes these independently about the relationship.

CREATE TABLE IF NOT EXISTS dyadic_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL
    CHECK (assessment_type IN ('rdas', 'dci', 'csi-16', 'csi-4')),
  responses JSONB NOT NULL DEFAULT '[]',
  scores JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE dyadic_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own dyadic assessments" ON dyadic_assessments;
CREATE POLICY "Users can read own dyadic assessments"
  ON dyadic_assessments FOR SELECT
  USING (auth.uid() = user_id);

-- Partners can read each other's dyadic assessments (needed for combined report)
DROP POLICY IF EXISTS "Partners can read linked dyadic assessments" ON dyadic_assessments;
CREATE POLICY "Partners can read linked dyadic assessments"
  ON dyadic_assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = dyadic_assessments.couple_id
        AND (couples.partner_a_id = auth.uid() OR couples.partner_b_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own dyadic assessments" ON dyadic_assessments;
CREATE POLICY "Users can insert own dyadic assessments"
  ON dyadic_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_dyadic_assessments_user ON dyadic_assessments(user_id, assessment_type);
CREATE INDEX IF NOT EXISTS idx_dyadic_assessments_couple ON dyadic_assessments(couple_id, assessment_type);


-- ─── 11. Relationship Portraits ─────────────────────────────
-- Combined portrait for the couple (generated from both individual
-- portraits + dyadic assessment data).

CREATE TABLE IF NOT EXISTS relationship_portraits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE UNIQUE,
  partner_a_portrait_id UUID REFERENCES portraits(id),
  partner_b_portrait_id UUID REFERENCES portraits(id),
  dyadic_scores JSONB NOT NULL DEFAULT '{}',
  relationship_patterns JSONB NOT NULL DEFAULT '[]',
  combined_cycle JSONB NOT NULL DEFAULT '{}',
  discrepancy_analysis JSONB NOT NULL DEFAULT '{}',
  relationship_growth_edges JSONB NOT NULL DEFAULT '[]',
  couple_anchor_points JSONB NOT NULL DEFAULT '{}',
  intervention_priorities JSONB NOT NULL DEFAULT '[]',
  version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE relationship_portraits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners can read own relationship portrait" ON relationship_portraits;
CREATE POLICY "Partners can read own relationship portrait"
  ON relationship_portraits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = relationship_portraits.couple_id
        AND (couples.partner_a_id = auth.uid() OR couples.partner_b_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can insert relationship portrait" ON relationship_portraits;
CREATE POLICY "Partners can insert relationship portrait"
  ON relationship_portraits FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = relationship_portraits.couple_id
        AND (couples.partner_a_id = auth.uid() OR couples.partner_b_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can update relationship portrait" ON relationship_portraits;
CREATE POLICY "Partners can update relationship portrait"
  ON relationship_portraits FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = relationship_portraits.couple_id
        AND (couples.partner_a_id = auth.uid() OR couples.partner_b_id = auth.uid())
    )
  );


-- ─── 12. Couple Chat Sessions ───────────────────────────────
-- Chat sessions for the couple portal (shared between partners).

CREATE TABLE IF NOT EXISTS couple_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL DEFAULT 'New Conversation',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  current_mode TEXT DEFAULT 'EXPLORATION',
  message_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE couple_chat_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners can read couple sessions" ON couple_chat_sessions;
CREATE POLICY "Partners can read couple sessions"
  ON couple_chat_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = couple_chat_sessions.couple_id
        AND (couples.partner_a_id = auth.uid() OR couples.partner_b_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can insert couple sessions" ON couple_chat_sessions;
CREATE POLICY "Partners can insert couple sessions"
  ON couple_chat_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = couple_chat_sessions.couple_id
        AND (couples.partner_a_id = auth.uid() OR couples.partner_b_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can update couple sessions" ON couple_chat_sessions;
CREATE POLICY "Partners can update couple sessions"
  ON couple_chat_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = couple_chat_sessions.couple_id
        AND (couples.partner_a_id = auth.uid() OR couples.partner_b_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_couple_chat_sessions_couple ON couple_chat_sessions(couple_id);


-- ─── 13. Couple Chat Messages ───────────────────────────────

CREATE TABLE IF NOT EXISTS couple_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES couple_chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE couple_chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners can read couple messages" ON couple_chat_messages;
CREATE POLICY "Partners can read couple messages"
  ON couple_chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couple_chat_sessions cs
      JOIN couples c ON c.id = cs.couple_id
      WHERE cs.id = couple_chat_messages.session_id
        AND (c.partner_a_id = auth.uid() OR c.partner_b_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Partners can insert couple messages" ON couple_chat_messages;
CREATE POLICY "Partners can insert couple messages"
  ON couple_chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couple_chat_sessions cs
      JOIN couples c ON c.id = cs.couple_id
      WHERE cs.id = couple_chat_messages.session_id
        AND (c.partner_a_id = auth.uid() OR c.partner_b_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_couple_chat_messages_session ON couple_chat_messages(session_id, created_at);


-- ─── Done! Phase 2 Schema ──────────────────────────────────
-- New tables: couple_invites, couples, user_profiles,
--             dyadic_assessments, relationship_portraits,
--             couple_chat_sessions, couple_chat_messages
