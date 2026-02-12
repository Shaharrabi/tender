-- Migration 004: Streak & Commitment Tracking
-- Tracks daily engagement for streak calculation and 30-day commitment challenges.

CREATE TABLE IF NOT EXISTS engagement_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_type TEXT NOT NULL DEFAULT 'app_open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, activity_type)
);

ALTER TABLE engagement_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own streaks" ON engagement_streaks
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_streaks_user_date ON engagement_streaks(user_id, date DESC);
