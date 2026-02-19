-- ────────────────────────────────────────────────────────
-- 014 · Step minigame outputs table
--
-- Stores outputs from interactive minigames embedded
-- within steps (e.g. quizzes, drag-and-drop, matching).
-- ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS step_minigame_outputs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_number   INTEGER NOT NULL,
  game_id       TEXT NOT NULL,
  output        JSONB NOT NULL DEFAULT '{}',
  completed_at  TIMESTAMPTZ DEFAULT now(),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by user + step
CREATE INDEX IF NOT EXISTS idx_minigame_user_step
  ON step_minigame_outputs(user_id, step_number);

-- Enable RLS
ALTER TABLE step_minigame_outputs ENABLE ROW LEVEL SECURITY;

-- Users can only read their own minigame outputs
CREATE POLICY "Users can view own minigame outputs"
  ON step_minigame_outputs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own minigame outputs"
  ON step_minigame_outputs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own minigame outputs"
  ON step_minigame_outputs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own minigame outputs"
  ON step_minigame_outputs FOR DELETE
  USING (auth.uid() = user_id);
