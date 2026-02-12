-- ============================================================
-- Couples App — Complete Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- Safe to re-run: uses IF NOT EXISTS and DROP POLICY IF EXISTS
-- ============================================================

-- ─── 1. Portraits ─────────────────────────────────────────
-- Stores the generated Individual Portrait per user.
-- Created by portrait-generator, consumed by chat edge function.

CREATE TABLE IF NOT EXISTS portraits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_ids JSONB NOT NULL DEFAULT '[]',
  composite_scores JSONB NOT NULL DEFAULT '{}',
  patterns JSONB NOT NULL DEFAULT '[]',
  four_lens JSONB NOT NULL DEFAULT '{}',
  negative_cycle JSONB NOT NULL DEFAULT '{}',
  growth_edges JSONB NOT NULL DEFAULT '[]',
  anchor_points JSONB NOT NULL DEFAULT '{}',
  partner_guide JSONB NOT NULL DEFAULT '{}',
  version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE portraits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own portrait" ON portraits;
CREATE POLICY "Users can read own portrait"
  ON portraits FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own portrait" ON portraits;
CREATE POLICY "Users can insert own portrait"
  ON portraits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own portrait" ON portraits;
CREATE POLICY "Users can update own portrait"
  ON portraits FOR UPDATE
  USING (auth.uid() = user_id);


-- ─── 2. Chat Sessions ────────────────────────────────────
-- One session per conversation thread.

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  current_mode TEXT DEFAULT 'EXPLORATION',
  message_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own sessions" ON chat_sessions;
CREATE POLICY "Users can read own sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON chat_sessions;
CREATE POLICY "Users can insert own sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON chat_sessions;
CREATE POLICY "Users can update own sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id, created_at DESC);


-- ─── 3. Chat Messages ────────────────────────────────────
-- Individual messages within a session.
-- The edge function uses the service role key, so RLS is
-- more permissive here (the function inserts on behalf of users).

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages from their own sessions
DROP POLICY IF EXISTS "Users can read own messages" ON chat_messages;
CREATE POLICY "Users can read own messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Users can insert messages into their own sessions
DROP POLICY IF EXISTS "Users can insert own messages" ON chat_messages;
CREATE POLICY "Users can insert own messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Service role can insert (edge function uses service role)
-- This is handled automatically since service role bypasses RLS

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, created_at);


-- ─── 4. Exercise Completions ─────────────────────────────
-- Tracks every time a user completes an exercise.

CREATE TABLE IF NOT EXISTS exercise_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  reflection TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE exercise_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own completions" ON exercise_completions;
CREATE POLICY "Users can read own completions"
  ON exercise_completions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own completions" ON exercise_completions;
CREATE POLICY "Users can insert own completions"
  ON exercise_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_exercise_completions_user ON exercise_completions(user_id, completed_at DESC);


-- ─── 5. Growth Edge Progress ─────────────────────────────
-- Tracks progress on each growth edge over time.

CREATE TABLE IF NOT EXISTS growth_edge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  edge_id TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'emerging'
    CHECK (stage IN ('emerging', 'practicing', 'integrating', 'integrated')),
  practice_count INT NOT NULL DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  insights JSONB NOT NULL DEFAULT '[]',
  milestones JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, edge_id)
);

ALTER TABLE growth_edge_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own growth" ON growth_edge_progress;
CREATE POLICY "Users can read own growth"
  ON growth_edge_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own growth" ON growth_edge_progress;
CREATE POLICY "Users can insert own growth"
  ON growth_edge_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own growth" ON growth_edge_progress;
CREATE POLICY "Users can update own growth"
  ON growth_edge_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_growth_edge_user ON growth_edge_progress(user_id);


-- ─── 6. Daily Check-Ins ──────────────────────────────────
-- One check-in per user per day.

CREATE TABLE IF NOT EXISTS daily_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood_rating INT NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 10),
  relationship_rating INT NOT NULL CHECK (relationship_rating >= 1 AND relationship_rating <= 10),
  practiced_growth_edge BOOLEAN NOT NULL DEFAULT false,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, checkin_date)
);

ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own check-ins" ON daily_check_ins;
CREATE POLICY "Users can read own check-ins"
  ON daily_check_ins FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own check-ins" ON daily_check_ins;
CREATE POLICY "Users can insert own check-ins"
  ON daily_check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own check-ins" ON daily_check_ins;
CREATE POLICY "Users can update own check-ins"
  ON daily_check_ins FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own check-ins" ON daily_check_ins;
CREATE POLICY "Users can delete own check-ins"
  ON daily_check_ins FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_checkins_user ON daily_check_ins(user_id, checkin_date DESC);


-- ─── Done! ───────────────────────────────────────────────
-- All 6 tables created with Row Level Security enabled.
-- Tables: portraits, chat_sessions, chat_messages,
--         exercise_completions, growth_edge_progress, daily_check_ins
