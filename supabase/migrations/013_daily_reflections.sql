-- ────────────────────────────────────────────────────────
-- 013 · Daily reflections table for journal
--
-- Stores daily free-form reflections, WEARE-based question
-- responses, and quick-tap mood/summary tags.
-- ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS daily_reflections (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reflection_date DATE NOT NULL,

  -- WEARE reflection questions (3 daily prompts)
  question_responses JSONB DEFAULT '[]'::jsonb,
  -- e.g. [{ "question": "...", "answer": "..." }, ...]

  -- Free-form journal note
  free_text     TEXT DEFAULT '',

  -- Quick-tap mood/summary tags
  -- e.g. ["grateful", "connected", "tired", "hopeful"]
  day_tags      TEXT[] DEFAULT '{}',

  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  -- One reflection per user per date
  UNIQUE(user_id, reflection_date)
);

-- Enable RLS
ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;

-- Users can only see their own reflections
CREATE POLICY "Users can view own reflections"
  ON daily_reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON daily_reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
  ON daily_reflections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections"
  ON daily_reflections FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups by user + date
CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_date
  ON daily_reflections(user_id, reflection_date);
