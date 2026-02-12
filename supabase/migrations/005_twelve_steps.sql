-- ============================================================
-- Migration 005: Twelve Steps of Relational Healing
-- Adds step tracking, practice completion with step context,
-- and step definitions seed data.
-- Safe to re-run: uses IF NOT EXISTS and DROP POLICY IF EXISTS
-- ============================================================

-- ─── 1. Steps — Seed Data Table ─────────────────────────
-- Defines the 12 Steps with metadata for UI and Sage context.

CREATE TABLE IF NOT EXISTS steps (
  id SERIAL PRIMARY KEY,
  step_number INT UNIQUE NOT NULL CHECK (step_number BETWEEN 1 AND 12),
  title VARCHAR NOT NULL,
  quote TEXT,
  therapeutic_goal TEXT,
  phase VARCHAR NOT NULL CHECK (phase IN ('seeing', 'feeling', 'shifting', 'integrating', 'sustaining')),
  completion_criteria JSONB DEFAULT '[]',
  sage_behavior JSONB DEFAULT '{}',
  four_movements_emphasis VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

-- Steps are read-only public data
DROP POLICY IF EXISTS "Anyone can read steps" ON steps;
CREATE POLICY "Anyone can read steps"
  ON steps FOR SELECT
  USING (true);


-- ─── 2. Step Progress — User Journey Tracking ──────────
-- Tracks each user's progress through the 12 Steps.

CREATE TABLE IF NOT EXISTS step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id UUID, -- null if individual journey
  step_number INT NOT NULL CHECK (step_number BETWEEN 1 AND 12),
  status VARCHAR NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'active', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  reflection_notes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, step_number)
);

ALTER TABLE step_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own step progress" ON step_progress;
CREATE POLICY "Users can read own step progress"
  ON step_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own step progress" ON step_progress;
CREATE POLICY "Users can insert own step progress"
  ON step_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own step progress" ON step_progress;
CREATE POLICY "Users can update own step progress"
  ON step_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_step_progress_user ON step_progress(user_id, step_number);


-- ─── 3. Practice Completions — With Step Context ────────
-- Tracks practice completions with which Step they were done under.
-- This extends the existing exercise_completions with step context.

CREATE TABLE IF NOT EXISTS practice_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id UUID,
  practice_id VARCHAR NOT NULL,
  step_number INT, -- which Step this was done under
  completed_by VARCHAR DEFAULT 'individual'
    CHECK (completed_by IN ('individual', 'partner_a', 'partner_b', 'together')),
  completion_data JSONB DEFAULT '{}',
  ai_coach_notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE practice_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own practice completions" ON practice_completions;
CREATE POLICY "Users can read own practice completions"
  ON practice_completions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own practice completions" ON practice_completions;
CREATE POLICY "Users can insert own practice completions"
  ON practice_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_practice_completions_user ON practice_completions(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_practice_completions_step ON practice_completions(user_id, step_number);


-- ─── 4. Seed the 12 Steps ──────────────────────────────

INSERT INTO steps (step_number, title, quote, therapeutic_goal, phase, four_movements_emphasis, sage_behavior, completion_criteria)
VALUES
  (1, 'Acknowledge the Strain',
   'We admit that patterns of disconnection have taken hold in our relationship — patterns we didn''t choose but now must face together.',
   'Create shared awareness of disconnection without blame. Move from "you''re the problem" to "we have a pattern."',
   'seeing', 'Recognition',
   '{"tone": "curious, gentle, normalizing", "focus": "seeing patterns without blame", "avoids": ["pushing for change too fast", "assigning blame", "rushing past acknowledgment"]}',
   '["Both partners complete Window of Tolerance Check (3x each)", "Both partners complete Parts Check-In (2x each)", "Couple completes Recognizing Your Negative Cycle together", "Couple can name their cycle without blaming"]'),

  (2, 'Trust the Relational Field',
   'We come to believe that something wiser than either of us emerges when we meet with openness — a ''we'' that can heal what ''I'' cannot.',
   'Shift from adversarial orientation to collaborative orientation. Build faith in the relationship itself as an entity worth tending.',
   'seeing', 'Recognition → Resonance',
   '{"tone": "warm, inviting, hopeful", "focus": "building faith in the we", "avoids": ["cynicism", "skepticism about repair", "focusing only on individual growth"]}',
   '["Couple Bubble exercise completed", "7-day streak of Stress-Reducing Conversations", "Both partners can identify 3+ types of bids they make", "At least one repair after missing a bid moment acknowledged"]'),

  (3, 'Release Certainty',
   'We let go of our fixed stories about each other and our relationship. We choose presence over prediction.',
   'Soften rigid narratives. Create space for partner to be more than the story you''ve told yourself about them.',
   'feeling', 'Release',
   '{"tone": "gentle, curious, destabilizing (in a safe way)", "focus": "loosening grip on certainty", "avoids": ["reinforcing fixed stories", "agreeing with black-and-white thinking"]}',
   '["Both partners complete Defusion from Relationship Stories", "Love Maps exercise completed with at least 15 new learnings noted", "Each partner identifies one story they''ve held that may not be the whole truth"]'),

  (4, 'Examine Our Part',
   'We look honestly at how our own patterns contribute to disconnection — not to blame ourselves, but to reclaim our power to change.',
   'Move from victim to agent. Own contribution to the cycle without collapsing into shame.',
   'feeling', 'Release',
   '{"tone": "honest, compassionate, direct", "focus": "owning without shaming", "avoids": ["enabling blame of partner", "collapsing into shame", "bypassing accountability"]}',
   '["Both partners complete Accessing Primary Emotions", "Both partners complete Dialogue with a Protector", "Four Horsemen Antidotes completed — each partner identifies their primary horseman", "Both partners can articulate their top 3 relationship values"]'),

  (5, 'Share Our Truths',
   'We speak what has been hidden — our fears, our longings, our disappointments — trusting that truth told with care strengthens the bond.',
   'Practice vulnerable disclosure. Build trust through witnessing and being witnessed.',
   'shifting', 'Resonance',
   '{"tone": "tender, reverent, holding", "focus": "creating safety for disclosure", "avoids": ["rushing", "intellectualizing", "minimizing vulnerability"]}',
   '["Bonding Through Vulnerability completed at least once", "Hold Me Tight Conversation completed", "Both partners can name one fear they hadn''t shared before this step"]'),

  (6, 'Release the Enemy Story',
   'We let go of seeing each other as adversaries. We recognize that the walls between us came from protection, not malice.',
   'Soften contempt. See partner''s behavior through attachment lens rather than character lens.',
   'shifting', 'Release → Resonance',
   '{"tone": "compassionate, reframing, curious about partner", "focus": "dissolving the enemy image", "avoids": ["enabling contempt", "agreeing with demonization"]}',
   '["Unified Detachment completed — both can describe cycle in we language", "Fondness & Admiration completed — 21-day appreciation practice", "Each partner can articulate one way their partner''s difficult behavior makes sense given their history"]'),

  (7, 'Commit to Relational Practices',
   'We ask for the humility and courage to approach each encounter with curiosity and kindness, making our relationship a daily practice.',
   'Move from insight to consistent action. Build sustainable rituals.',
   'shifting', 'Embodiment',
   '{"tone": "practical, encouraging, coach-like", "focus": "building sustainable habits", "avoids": ["perfectionism", "overwhelming with too many practices"]}',
   '["At least 3 Rituals of Connection established and practiced for 2+ weeks", "Relationship Values Compass completed — shared values articulated", "Both partners can name their willingness edges"]'),

  (8, 'Prepare to Repair Harm',
   'We bring our attention to the ruptures — the moments of betrayal, withdrawal, or harm — and prepare to face them together.',
   'Surface unresolved wounds without re-traumatizing. Create readiness for repair.',
   'shifting', 'Recognition',
   '{"tone": "grounded, careful, boundaried", "focus": "preparing safely for difficult repair work", "avoids": ["forcing repair before readiness", "re-traumatizing", "minimizing harm"]}',
   '["TIPP Skills practiced together at least twice", "At least one Regrettable Incident processed", "Both partners identify 1-2 repair-worthy moments not yet addressed"]'),

  (9, 'Act to Rebuild Trust',
   'We move from intention to action — listening where we once dismissed, reaching where we once retreated, showing up where we once stayed silent.',
   'Take concrete repair actions. Demonstrate change through behavior, not just words.',
   'integrating', 'Embodiment',
   '{"tone": "action-oriented, accountable, celebrating effort", "focus": "supporting follow-through", "avoids": ["accepting words without action", "enabling empty apologies"]}',
   '["Repair Conversation Guide used for at least 2 past ruptures", "Soft Startup practiced in at least 3 real conversations", "DEAR MAN used by each partner at least once", "Both partners can name one concrete behavioral change they''ve made"]'),

  (10, 'Maintain Ongoing Awareness',
   'We recognize that old patterns will resurface. When they do, we meet them with honesty and gentle recalibration, not shame.',
   'Normalize setbacks. Build sustainable maintenance practices. Prevent relapse into old cycles.',
   'integrating', 'Recognition → Embodiment',
   '{"tone": "steady, normalizing, non-judgmental", "focus": "supporting ongoing awareness without perfectionism", "avoids": ["shame about setbacks", "complacency", "all-or-nothing thinking"]}',
   '["30-day maintenance tracking established", "At least one we caught ourselves in the old pattern moment processed", "Both partners have a personal regulation practice they do 3x/week"]'),

  (11, 'Seek Shared Insight',
   'We create spaces for the relationship itself to speak — through reflection, dialogue, and quiet presence together.',
   'Develop couple''s capacity for metacognition. Learn to check in with the relationship as an entity.',
   'sustaining', 'Resonance',
   '{"tone": "spacious, reflective, attuned to something larger", "focus": "listening to the relationship itself", "avoids": ["rushing to solutions", "staying on surface level"]}',
   '["Dreams Within Conflict completed for at least one persistent disagreement", "Couple has established a regular relationship check-in ritual", "Both partners can describe what they sense the relationship needs right now"]'),

  (12, 'Carry the Message of Connection',
   'Having experienced how openness and presence transform us, we embody these values in all our relationships — not by demanding others change, but by living as examples.',
   'Integration and expansion. The couple becomes a source of relational health in their community.',
   'sustaining', 'Embodiment → Transmission',
   '{"tone": "celebratory, humble, looking outward", "focus": "integration and service", "avoids": ["false completion", "ignoring ongoing work"]}',
   '["Relationship review completed — couple reflects on full journey", "Each partner identifies how the journey has changed other relationships", "Couple creates a relationship mission statement or commitment"]')
ON CONFLICT (step_number) DO NOTHING;


-- ─── Done! ──────────────────────────────────────────────
-- Tables: steps (seed data), step_progress, practice_completions
-- Run this in Supabase SQL Editor
