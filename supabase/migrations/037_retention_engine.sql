-- =============================================
-- TENDER RETENTION ENGINE — Database Schema
-- Migration 037
-- Skips portrait_unlocks (full access policy)
-- =============================================

-- 1. Partner Activity Feed
CREATE TABLE IF NOT EXISTS partner_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES auth.users(id),
  recipient_user_id UUID REFERENCES auth.users(id),
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}',
  requires_completion TEXT,
  unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  seen_at TIMESTAMPTZ
);

ALTER TABLE partner_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own activity (as actor or recipient)"
  ON partner_activity FOR SELECT
  USING (auth.uid() = actor_user_id OR auth.uid() = recipient_user_id);

CREATE POLICY "Users can insert activity for their couple"
  ON partner_activity FOR INSERT
  WITH CHECK (
    auth.uid() = actor_user_id
    OR actor_user_id = '00000000-0000-0000-0000-000000000000'
  );

CREATE POLICY "Users can update own received activity"
  ON partner_activity FOR UPDATE
  USING (auth.uid() = recipient_user_id);

CREATE INDEX idx_partner_activity_recipient
  ON partner_activity(recipient_user_id, unlocked, created_at DESC);

-- 2. Daily Questions
CREATE TABLE IF NOT EXISTS daily_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  category TEXT NOT NULL,
  depth_level INTEGER DEFAULT 1 CHECK (depth_level BETWEEN 1 AND 3),
  requires_both BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS daily_question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  question_id UUID REFERENCES daily_questions(id),
  user_id UUID REFERENCES auth.users(id),
  response_text TEXT NOT NULL,
  responded_at TIMESTAMPTZ DEFAULT NOW(),
  partner_seen BOOLEAN DEFAULT false,
  partner_seen_at TIMESTAMPTZ
);

ALTER TABLE daily_question_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own responses and partner responses for same question"
  ON daily_question_responses FOR SELECT
  USING (
    auth.uid() = user_id
    OR (
      couple_id IN (SELECT id FROM couples WHERE partner_a_id = auth.uid() OR partner_b_id = auth.uid())
      AND question_id IN (SELECT question_id FROM daily_question_responses WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users insert own responses"
  ON daily_question_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own responses"
  ON daily_question_responses FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. Couple Challenges
CREATE TABLE IF NOT EXISTS couple_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  challenge_text TEXT NOT NULL,
  partner1_task TEXT NOT NULL,
  partner2_task TEXT NOT NULL,
  based_on JSONB DEFAULT '{}',
  week_of DATE NOT NULL,
  partner1_completed BOOLEAN DEFAULT false,
  partner1_completed_at TIMESTAMPTZ,
  partner1_reflection TEXT,
  partner2_completed BOOLEAN DEFAULT false,
  partner2_completed_at TIMESTAMPTZ,
  partner2_reflection TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE couple_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple members see own challenges"
  ON couple_challenges FOR SELECT
  USING (couple_id IN (SELECT id FROM couples WHERE partner_a_id = auth.uid() OR partner_b_id = auth.uid()));

CREATE POLICY "Couple members update own challenges"
  ON couple_challenges FOR UPDATE
  USING (couple_id IN (SELECT id FROM couples WHERE partner_a_id = auth.uid() OR partner_b_id = auth.uid()));

CREATE POLICY "Couple members insert challenges"
  ON couple_challenges FOR INSERT
  WITH CHECK (couple_id IN (SELECT id FROM couples WHERE partner_a_id = auth.uid() OR partner_b_id = auth.uid()));

-- 4. WEARE Delta Tracking columns
ALTER TABLE weare_scores ADD COLUMN IF NOT EXISTS previous_resonance DECIMAL(4,2);
ALTER TABLE weare_scores ADD COLUMN IF NOT EXISTS previous_emergence DECIMAL(4,2);
ALTER TABLE weare_scores ADD COLUMN IF NOT EXISTS resonance_delta DECIMAL(4,2);
ALTER TABLE weare_scores ADD COLUMN IF NOT EXISTS emergence_delta DECIMAL(4,2);
ALTER TABLE weare_scores ADD COLUMN IF NOT EXISTS notable_change BOOLEAN DEFAULT false;
ALTER TABLE weare_scores ADD COLUMN IF NOT EXISTS change_narrative TEXT;

-- 5. Emotional Safety — notification budget tracking
CREATE TABLE IF NOT EXISTS notification_budget (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  relational_nudges_sent INTEGER DEFAULT 0,
  last_nudge_at TIMESTAMPTZ,
  quiet_mode_until TIMESTAMPTZ,
  quiet_reason TEXT,
  UNIQUE(user_id, date)
);

ALTER TABLE notification_budget ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own budget"
  ON notification_budget FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage own budget"
  ON notification_budget FOR ALL
  USING (auth.uid() = user_id);

-- 6. Seed daily questions
INSERT INTO daily_questions (question_text, category, depth_level) VALUES
  -- ATTUNEMENT
  ('What was your partner''s face doing the last time they were really happy?', 'attunement', 1),
  ('What is your partner most worried about right now that they haven''t said out loud?', 'attunement', 2),
  ('When did you last feel truly seen by your partner? What did they do?', 'attunement', 2),
  ('What does your partner''s body do right before a hard conversation?', 'attunement', 3),
  ('Describe the last moment you felt genuinely close — not doing anything special, just close.', 'attunement', 2),
  ('What sound does your partner make when they''re content? Can you hear it in your mind?', 'attunement', 1),
  -- CO-CREATION
  ('Name something your partner introduced you to that you now love.', 'co_creation', 1),
  ('What''s one thing you could only build together — that neither of you could create alone?', 'co_creation', 3),
  ('When was the last time a disagreement between you led to something new?', 'co_creation', 2),
  ('What''s a small ritual that belongs only to the two of you?', 'co_creation', 1),
  ('If your relationship had a creative project, what would it be building right now?', 'co_creation', 3),
  -- TRANSMISSION
  ('What''s one thing you''ve learned about relationships that you haven''t actually put into practice yet?', 'transmission', 2),
  ('Name one small thing you did differently this week because of what you''ve been learning here.', 'transmission', 1),
  ('What''s the gap between what you understand about your partner and what you actually do with that understanding?', 'transmission', 3),
  ('Did you have a moment this week where you caught yourself in an old pattern? What happened?', 'transmission', 2),
  -- SPACE
  ('What''s something you love that your partner doesn''t — and that''s perfectly fine?', 'space', 1),
  ('When did you last say ''no'' to your partner and feel okay about it?', 'space', 2),
  ('Where do you end and your partner begins? Describe that boundary in one sentence.', 'space', 3),
  ('What part of yourself do you protect most in this relationship?', 'space', 3),
  -- RESISTANCE
  ('What story about your partner are you most attached to being right about?', 'resistance', 3),
  ('What would you have to give up to let your relationship change?', 'resistance', 3),
  ('Is there something you keep bringing up that you haven''t actually let go of?', 'resistance', 2),
  ('What are you most afraid would happen if you truly softened?', 'resistance', 3),
  -- GENERAL
  ('One word for how the space between you feels right now.', 'general', 1),
  ('What made you smile about your partner today?', 'general', 1),
  ('What''s something your partner does that you''ve never thanked them for?', 'general', 1),
  ('If your relationship had a weather report today, what would it say?', 'general', 1),
  ('What are you most grateful for in this relationship right now?', 'general', 1),
  ('Describe your partner in three words that they wouldn''t expect.', 'general', 2),
  ('What''s the bravest thing your partner has done in this relationship?', 'general', 2),
  ('What do you need from your partner this week that you haven''t asked for?', 'general', 2),
  ('If you could re-live one moment from your relationship, which one?', 'general', 1),
  ('What does love look like in your relationship on a boring Tuesday?', 'general', 2);
