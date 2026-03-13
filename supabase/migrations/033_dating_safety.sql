-- ──────────────────────────────────────────────────────────────
-- 033: Dating Safety — Blocking & Reporting
--
-- Tables for user blocks and content reports in Dating Well.
-- ──────────────────────────────────────────────────────────────

-- Blocks: a blocked user won't appear in discovery
CREATE TABLE IF NOT EXISTS dating_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- Reports: flag profiles or letters for review
CREATE TABLE IF NOT EXISTS dating_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  letter_id UUID REFERENCES dating_letters(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed BOOLEAN DEFAULT FALSE
);

-- RLS policies
ALTER TABLE dating_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dating_reports ENABLE ROW LEVEL SECURITY;

-- Users can manage their own blocks
CREATE POLICY "Users can insert own blocks"
  ON dating_blocks FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can read own blocks"
  ON dating_blocks FOR SELECT
  USING (auth.uid() = blocker_id);

CREATE POLICY "Users can delete own blocks"
  ON dating_blocks FOR DELETE
  USING (auth.uid() = blocker_id);

-- Users can insert reports, admins can read all
CREATE POLICY "Users can insert reports"
  ON dating_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can read own reports"
  ON dating_reports FOR SELECT
  USING (auth.uid() = reporter_id);
