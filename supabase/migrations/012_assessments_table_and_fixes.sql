-- ============================================================
-- Migration 012: Create assessments table + fix exercise_completions
-- ============================================================
-- 1. Creates the `assessments` table with RLS (was missing entirely)
-- 2. Adds `exercise_name` and `step_responses` columns to
--    `exercise_completions` (service code writes them but they
--    didn't exist, causing silent insert failures)
-- ============================================================

-- ─── 1. Assessments Table ─────────────────────────────────

CREATE TABLE IF NOT EXISTS assessments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,                              -- e.g. 'ecr-r', 'dutch', 'tender'
  scores        JSONB,                                     -- assessment results
  raw_responses JSONB,                                     -- individual answers
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast user + type lookups
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_type ON assessments(user_id, type);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Users can only read their own assessments
CREATE POLICY "Users can read own assessments"
  ON assessments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own assessments
CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own assessments
CREATE POLICY "Users can update own assessments"
  ON assessments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own assessments
CREATE POLICY "Users can delete own assessments"
  ON assessments FOR DELETE
  USING (auth.uid() = user_id);

-- ─── 2. Fix exercise_completions — add missing columns ────

ALTER TABLE exercise_completions
  ADD COLUMN IF NOT EXISTS exercise_name TEXT,
  ADD COLUMN IF NOT EXISTS step_responses JSONB;
