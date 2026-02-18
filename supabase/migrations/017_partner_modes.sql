-- ──────────────────────────────────────────────────────────
-- Migration 017: Partner Modes
-- Adds relationship_mode and demo_partner support to user_profiles.
-- Also creates demo_partner_conversations for Nuance roleplay continuity.
-- ──────────────────────────────────────────────────────────

-- Add relationship mode columns to user_profiles
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS relationship_mode VARCHAR(20) DEFAULT 'solo',
  ADD COLUMN IF NOT EXISTS demo_partner_id VARCHAR(50) DEFAULT NULL;

-- COMMENT: relationship_mode values:
--   'solo'           — Individual self-reflection
--   'demo_partner'   — Practice with an AI archetype
--   'real_partner'   — Current couple mode (partner invited)
--   'random_partner' — Surprise archetype assignment

-- Demo partner conversation history (for Nuance roleplay continuity)
CREATE TABLE IF NOT EXISTS public.demo_partner_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  demo_partner_id VARCHAR(50) NOT NULL,
  practice_id VARCHAR(100),
  step_id VARCHAR(50),
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for demo_partner_conversations
ALTER TABLE public.demo_partner_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own demo conversations"
  ON public.demo_partner_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own demo conversations"
  ON public.demo_partner_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own demo conversations"
  ON public.demo_partner_conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_demo_conversations_user
  ON public.demo_partner_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_demo_conversations_partner
  ON public.demo_partner_conversations(demo_partner_id);
