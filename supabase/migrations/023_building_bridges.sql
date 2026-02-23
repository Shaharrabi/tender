-- Building Bridges Card Game — card_completions table
-- Tracks which cards users complete, their reflections, and XP earned.

CREATE TABLE IF NOT EXISTS card_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  card_id VARCHAR(20) NOT NULL,
  deck VARCHAR(30) NOT NULL,
  category VARCHAR(50),
  mode VARCHAR(20) DEFAULT 'draw',
  reflection_text TEXT,
  xp_earned INTEGER DEFAULT 25,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_card_completions_user ON card_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_card_completions_card ON card_completions(card_id);

-- Row Level Security
ALTER TABLE card_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own completions" ON card_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own completions" ON card_completions
  FOR SELECT USING (auth.uid() = user_id);
