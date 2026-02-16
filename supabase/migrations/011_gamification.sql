-- Migration: Gamification System
-- Description: XP, Levels, Badges, Streaks, Daily Challenges
-- Created: 2026-02-14

-- ═══════════════════════════════════════════════════════════════════════════
-- USER GAMIFICATION (Main progress table)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_xp INT DEFAULT 0,
  current_level INT DEFAULT 1,
  xp_to_next_level INT DEFAULT 100,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  daily_challenges_completed INT DEFAULT 0,
  scenarios_completed INT DEFAULT 0,
  last_activity_date DATE,
  streak_last_checked DATE,
  leaderboard_opted_in BOOLEAN DEFAULT false,
  anonymous_leaderboard_id VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_user_gamification_user_id ON user_gamification(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gamification_level ON user_gamification(current_level);
CREATE INDEX IF NOT EXISTS idx_user_gamification_xp ON user_gamification(total_xp);

-- ═══════════════════════════════════════════════════════════════════════════
-- XP TRANSACTIONS (Audit trail of all XP earned)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  source VARCHAR(50) NOT NULL,
  source_id VARCHAR(100), -- ID of lesson, scenario, etc.
  multiplier DECIMAL(3,2) DEFAULT 1.0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_source ON xp_transactions(source);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON xp_transactions(created_at);

-- ═══════════════════════════════════════════════════════════════════════════
-- BADGES (Badge definitions - static reference)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS badges (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(30) NOT NULL, -- journey, consistency, learning, practice, community, special
  rarity VARCHAR(20) NOT NULL, -- common, uncommon, rare, epic, legendary
  icon VARCHAR(10) NOT NULL, -- Emoji
  xp_reward INT DEFAULT 0,
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INT NOT NULL,
  requirement_specific_id VARCHAR(100),
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- USER BADGES (Earned badges per user)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id VARCHAR(50) NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_new BOOLEAN DEFAULT true,
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- DAILY CHALLENGES (Challenge definitions)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS daily_challenges (
  id VARCHAR(50) PRIMARY KEY,
  challenge_type VARCHAR(30) NOT NULL, -- micro-lesson, reflection, partner-prompt, practice-scenario, community-engage, mystery
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  duration VARCHAR(10) NOT NULL, -- 2min, 5min, 10min, 15min
  xp_reward INT NOT NULL,
  content_id VARCHAR(100), -- Link to actual content
  bonus_type VARCHAR(50),
  bonus_xp INT DEFAULT 0,
  bonus_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- USER DAILY CHALLENGES (Assigned and completed challenges)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id VARCHAR(50) NOT NULL REFERENCES daily_challenges(id),
  date_assigned DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  bonus_earned BOOLEAN DEFAULT false,
  xp_awarded INT DEFAULT 0,
  UNIQUE(user_id, challenge_id, date_assigned)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_challenges_user_id ON user_daily_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_challenges_date ON user_daily_challenges(date_assigned);

-- ═══════════════════════════════════════════════════════════════════════════
-- MYSTERY CONTENT (Hidden/surprise elements)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS mystery_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(30) NOT NULL, -- challenge, badge, content, surprise
  reveal_condition JSONB NOT NULL,
  content JSONB NOT NULL,
  xp_bonus INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- USER MYSTERY REVEALS (Track what users have discovered)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_mystery_reveals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mystery_id UUID NOT NULL REFERENCES mystery_content(id),
  revealed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mystery_id)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mystery_reveals ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own gamification" ON user_gamification
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification" ON user_gamification
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification" ON user_gamification
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own xp_transactions" ON xp_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own xp_transactions" ON xp_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own daily_challenges" ON user_daily_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own daily_challenges" ON user_daily_challenges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily_challenges" ON user_daily_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badge definitions are public
CREATE POLICY "Anyone can view badges" ON badges
  FOR SELECT USING (true);

-- Daily challenge definitions are public
CREATE POLICY "Anyone can view daily_challenges" ON daily_challenges
  FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════

-- Function to update user level based on XP
CREATE OR REPLACE FUNCTION calculate_level(xp INT)
RETURNS INT AS $$
DECLARE
  level INT := 1;
  thresholds INT[] := ARRAY[0, 100, 250, 500, 850, 1300, 1850, 2500, 3250, 4100, 
    5050, 6100, 7250, 8500, 9850, 11300, 12850, 14500, 16250, 18100,
    20050, 22100, 24250, 26500, 28850, 31300, 33850, 36500, 39250, 42100,
    45050, 48100, 51250, 54500, 57850, 61300, 64850, 68500, 72250, 76100,
    80050, 84100, 88250, 92500, 96850, 101300, 105850, 110500, 115250, 120100];
BEGIN
  FOR i IN 1..50 LOOP
    IF xp >= thresholds[i] THEN
      level := i;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  RETURN level;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate XP to next level
CREATE OR REPLACE FUNCTION xp_to_next_level(current_xp INT, current_level INT)
RETURNS INT AS $$
DECLARE
  thresholds INT[] := ARRAY[0, 100, 250, 500, 850, 1300, 1850, 2500, 3250, 4100, 
    5050, 6100, 7250, 8500, 9850, 11300, 12850, 14500, 16250, 18100,
    20050, 22100, 24250, 26500, 28850, 31300, 33850, 36500, 39250, 42100,
    45050, 48100, 51250, 54500, 57850, 61300, 64850, 68500, 72250, 76100,
    80050, 84100, 88250, 92500, 96850, 101300, 105850, 110500, 115250, 120100];
BEGIN
  IF current_level >= 50 THEN
    RETURN 0;
  END IF;
  RETURN thresholds[current_level + 1] - current_xp;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update gamification on XP transaction
CREATE OR REPLACE FUNCTION update_gamification_on_xp()
RETURNS TRIGGER AS $$
DECLARE
  new_total_xp INT;
  new_level INT;
  new_xp_to_next INT;
BEGIN
  -- Get current total and add new XP
  SELECT total_xp + NEW.amount INTO new_total_xp
  FROM user_gamification
  WHERE user_id = NEW.user_id;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_gamification (user_id, total_xp, current_level, xp_to_next_level, last_activity_date)
    VALUES (NEW.user_id, NEW.amount, calculate_level(NEW.amount), xp_to_next_level(NEW.amount, calculate_level(NEW.amount)), CURRENT_DATE);
    RETURN NEW;
  END IF;
  
  -- Calculate new level
  new_level := calculate_level(new_total_xp);
  new_xp_to_next := xp_to_next_level(new_total_xp, new_level);
  
  -- Update gamification record
  UPDATE user_gamification
  SET 
    total_xp = new_total_xp,
    current_level = new_level,
    xp_to_next_level = new_xp_to_next,
    last_activity_date = CURRENT_DATE,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_gamification_on_xp ON xp_transactions;
CREATE TRIGGER trigger_update_gamification_on_xp
  AFTER INSERT ON xp_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_gamification_on_xp();

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  last_check DATE;
  current_streak_val INT;
  today DATE := CURRENT_DATE;
BEGIN
  SELECT streak_last_checked, current_streak INTO last_check, current_streak_val
  FROM user_gamification
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    -- Create new record with streak of 1
    INSERT INTO user_gamification (user_id, current_streak, longest_streak, streak_last_checked, last_activity_date)
    VALUES (p_user_id, 1, 1, today, today);
    RETURN;
  END IF;
  
  IF last_check IS NULL OR last_check < today - INTERVAL '1 day' THEN
    -- Streak broken, reset to 1
    UPDATE user_gamification
    SET current_streak = 1, streak_last_checked = today, last_activity_date = today, updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSIF last_check = today - INTERVAL '1 day' THEN
    -- Continue streak
    UPDATE user_gamification
    SET 
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      streak_last_checked = today,
      last_activity_date = today,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  -- If last_check = today, do nothing (already checked in today)
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA: Default Badges
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO badges (id, name, description, category, rarity, icon, xp_reward, requirement_type, requirement_value, requirement_specific_id, is_hidden) VALUES
-- Journey Badges
('self-explorer', 'Self-Explorer', 'Complete your first assessment', 'journey', 'common', '🔍', 50, 'assessment_count', 1, NULL, false),
('deep-diver', 'Deep Diver', 'Complete all 6 assessments', 'journey', 'rare', '🤿', 300, 'assessment_count', 6, NULL, false),
('growth-seeker', 'Growth Seeker', 'Re-take an assessment and show improvement', 'journey', 'epic', '🌱', 200, 'assessment_count', 7, NULL, false),

-- Consistency Badges
('week-warrior', 'Week Warrior', 'Maintain a 7-day streak', 'consistency', 'uncommon', '🔥', 100, 'streak_days', 7, NULL, false),
('month-master', 'Month Master', 'Maintain a 30-day streak', 'consistency', 'rare', '🏆', 500, 'streak_days', 30, NULL, false),
('quarterly-champion', 'Quarterly Champion', 'Maintain a 90-day streak', 'consistency', 'legendary', '👑', 2000, 'streak_days', 90, NULL, false),

-- Learning Badges
('attachment-aware', 'Attachment Aware', 'Complete the attachment module', 'learning', 'uncommon', '🔗', 150, 'specific_course', 1, 'attachment', false),
('boundary-builder', 'Boundary Builder', 'Complete the boundaries module', 'learning', 'uncommon', '🛡️', 150, 'specific_course', 1, 'boundaries', false),
('conflict-converter', 'Conflict Converter', 'Complete the conflict resolution module', 'learning', 'uncommon', '⚖️', 150, 'specific_course', 1, 'conflict', false),
('emotional-expert', 'Emotional Expert', 'Complete the emotional intelligence module', 'learning', 'uncommon', '💗', 150, 'specific_course', 1, 'emotional-intelligence', false),
('values-voyager', 'Values Voyager', 'Complete the values alignment module', 'learning', 'uncommon', '🧭', 150, 'specific_course', 1, 'values', false),

-- Practice Badges
('first-steps', 'First Steps', 'Complete your first practice scenario', 'practice', 'common', '👣', 25, 'scenario_count', 1, NULL, false),
('practice-makes-progress', 'Practice Makes Progress', 'Complete 25 practice scenarios', 'practice', 'rare', '📈', 250, 'scenario_count', 25, NULL, false),
('simulation-sensei', 'Simulation Sensei', 'Complete 100 practice scenarios', 'practice', 'legendary', '🥋', 1000, 'scenario_count', 100, NULL, false),

-- Community Badges
('first-share', 'First Share', 'Make your first community post', 'community', 'common', '💬', 25, 'community_posts', 1, NULL, false),
('helpful-heart', 'Helpful Heart', 'Receive 10 reactions on your posts', 'community', 'uncommon', '❤️', 100, 'community_reactions_received', 10, NULL, false),
('community-pillar', 'Community Pillar', 'Receive 50 reactions on your posts', 'community', 'rare', '🌟', 300, 'community_reactions_received', 50, NULL, false),

-- Special/Hidden Badges
('night-owl', 'Night Owl', 'Complete an activity after midnight', 'special', 'rare', '🦉', 50, 'special_time', 1, 'after_midnight', true),
('early-bird', 'Early Bird', 'Complete an activity before 6am', 'special', 'rare', '🐦', 50, 'special_time', 1, 'before_6am', true),
('valentines-lover', 'Valentine''s Lover', 'Use the app on Valentine''s Day', 'special', 'epic', '💕', 100, 'special_date', 1, '02-14', true),
('anniversary-ace', 'Anniversary Ace', 'Use the app on your anniversary', 'special', 'epic', '💍', 100, 'special_date', 1, 'anniversary', true)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA: Sample Daily Challenges
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO daily_challenges (id, challenge_type, title, description, duration, xp_reward, content_id, bonus_type, bonus_xp, bonus_description, is_active) VALUES
('dc-5to1', 'micro-lesson', 'The 5:1 Ratio', 'Learn the research-backed ratio of positive to negative interactions', '2min', 50, 'lesson-5to1', 'share_with_partner', 25, 'Share this insight with your partner', true),
('dc-repair', 'practice-scenario', 'Repair Attempt', 'Practice making a repair attempt after a disagreement', '5min', 100, 'scenario-repair-001', NULL, 0, NULL, true),
('dc-gratitude', 'reflection', 'Gratitude Moment', 'Write about something you appreciate about your partner', '3min', 75, NULL, 'consecutive_days', 50, 'Complete 3 days in a row', true),
('dc-boundary-check', 'reflection', 'Boundary Check-In', 'Reflect on how your boundaries are serving you', '5min', 75, NULL, NULL, 0, NULL, true),
('dc-bid-for-connection', 'partner-prompt', 'Make a Bid', 'Intentionally make a bid for connection with your partner', '2min', 50, NULL, 'partner_responds', 50, 'If your partner responds', true),
('dc-mystery-001', 'mystery', '???', 'A surprise challenge awaits...', '5min', 100, NULL, NULL, 0, NULL, true),
('dc-attachment-reflect', 'reflection', 'Attachment Awareness', 'Notice one attachment pattern in yourself today', '3min', 75, NULL, NULL, 0, NULL, true),
('dc-conflict-style', 'micro-lesson', 'Know Your Style', 'Quick refresher on the 5 conflict resolution styles', '2min', 50, 'lesson-conflict-styles', NULL, 0, NULL, true),
('dc-de-escalate', 'practice-scenario', 'Cool Down', 'Practice de-escalation techniques in a simulated argument', '7min', 120, 'scenario-deescalate-001', 'complete_fast', 30, 'Complete in under 5 minutes', true),
('dc-values-align', 'partner-prompt', 'Values Check', 'Discuss one shared value with your partner', '5min', 80, NULL, 'both_complete', 80, 'Both partners complete this', true)
ON CONFLICT (id) DO NOTHING;
