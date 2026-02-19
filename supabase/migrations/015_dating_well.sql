-- ═══════════════════════════════════════════════════════════════
-- 015: Dating Well — "The Art of Beginning"
--
-- Four tables for the Dating Well feature:
-- 1. dating_profiles — user's constellation, preferences, bio
-- 2. dating_letters — slow communication between users
-- 3. dating_room_activity — room participation tracking
-- 4. dating_journal — private post-date reflections
-- ═══════════════════════════════════════════════════════════════

-- ─── Dating Profile ──────────────────────────────────────────
-- Built from The Field game + profile preferences

CREATE TABLE IF NOT EXISTS dating_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- From The Field game
  constellation JSONB,          -- top 3 archetype traits
  game_answers JSONB,           -- full answer history
  archetype_scores JSONB,       -- all trait point totals

  -- Profile preferences
  gender_identity TEXT[],
  looking_for TEXT[],
  age_range_min INTEGER DEFAULT 18,
  age_range_max INTEGER DEFAULT 80,
  location_radius TEXT,
  kids TEXT,
  smoking TEXT,
  drinking TEXT,
  relationship_style TEXT,
  therapy_stance TEXT,
  spirituality TEXT,
  conflict_style TEXT,
  love_languages TEXT[],

  -- The Letter (bio)
  bio TEXT,

  -- Visibility
  is_active BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true
);

ALTER TABLE dating_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own dating profile"
  ON dating_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dating profile"
  ON dating_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dating profile"
  ON dating_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Other users can see visible active profiles (for Discover)
CREATE POLICY "Users can see active visible profiles"
  ON dating_profiles FOR SELECT
  USING (is_active = true AND is_visible = true);


-- ─── Dating Letters ──────────────────────────────────────────
-- Slow communication — not instant messages

CREATE TABLE IF NOT EXISTS dating_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  reply_deadline TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
  expired BOOLEAN DEFAULT false,
  CONSTRAINT no_self_letters CHECK (sender_id != recipient_id)
);

ALTER TABLE dating_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Senders can insert letters"
  ON dating_letters FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Senders and recipients can read letters"
  ON dating_letters FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Recipients can update letter read status"
  ON dating_letters FOR UPDATE
  USING (auth.uid() = recipient_id);


-- ─── Dating Room Activity ────────────────────────────────────
-- Tracks participation in meeting rooms

CREATE TABLE IF NOT EXISTS dating_room_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_type TEXT NOT NULL,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dating_room_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own room activity"
  ON dating_room_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own room activity"
  ON dating_room_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ─── Dating Journal ──────────────────────────────────────────
-- Private post-date reflections (NOT connected to main journal)

CREATE TABLE IF NOT EXISTS dating_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  body_told_me TEXT,
  surprised_me TEXT,
  carry_forward TEXT,
  date_context TEXT
);

ALTER TABLE dating_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own dating journal"
  ON dating_journal FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dating journal"
  ON dating_journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dating journal"
  ON dating_journal FOR UPDATE
  USING (auth.uid() = user_id);
