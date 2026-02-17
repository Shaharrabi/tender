-- ──────────────────────────────────────────────────────────
-- Migration 016: Letter Desk — anonymous letter exchange
-- Weekly prompts + letters with pattern-based matching
-- ──────────────────────────────────────────────────────────

-- ── Weekly Prompts ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.weekly_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_text TEXT NOT NULL,
  category VARCHAR(50),
  active_from DATE NOT NULL,
  active_until DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.weekly_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read prompts"
  ON public.weekly_prompts FOR SELECT
  USING (true);

-- Index for active prompt lookup
CREATE INDEX IF NOT EXISTS idx_weekly_prompts_active
  ON public.weekly_prompts (active_from, active_until);

-- ── Community Letters ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.community_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  prompt_id UUID REFERENCES public.weekly_prompts(id),
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 10 AND 500),
  author_alias_name VARCHAR(60),
  author_alias_color VARCHAR(7),
  author_pattern VARCHAR(30),
  recipient_pattern VARCHAR(30),
  is_approved BOOLEAN NOT NULL DEFAULT true,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);

ALTER TABLE public.community_letters ENABLE ROW LEVEL SECURITY;

-- Users can read letters they authored
CREATE POLICY "Users can read own authored letters"
  ON public.community_letters FOR SELECT
  USING (auth.uid() = author_id);

-- Users can read letters addressed to them
CREATE POLICY "Users can read received letters"
  ON public.community_letters FOR SELECT
  USING (auth.uid() = recipient_id);

-- Users can create letters
CREATE POLICY "Authenticated users can create letters"
  ON public.community_letters FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Users can update letters addressed to them (mark as read)
CREATE POLICY "Recipients can update received letters"
  ON public.community_letters FOR UPDATE
  USING (auth.uid() = recipient_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_letters_author
  ON public.community_letters (author_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_letters_recipient
  ON public.community_letters (recipient_id, created_at DESC)
  WHERE recipient_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_letters_unmatched
  ON public.community_letters (author_pattern, created_at ASC)
  WHERE recipient_id IS NULL AND is_approved = true;

-- ── Seed weekly prompts (12 weeks starting from current Monday) ─

INSERT INTO public.weekly_prompts (prompt_text, category, active_from, active_until)
VALUES
  ('What I wish someone had told me when I first realized my pattern...', 'attachment',
   date_trunc('week', CURRENT_DATE)::date,
   (date_trunc('week', CURRENT_DATE) + interval '6 days')::date),

  ('The moment I knew repair was possible...', 'conflict',
   (date_trunc('week', CURRENT_DATE) + interval '7 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '13 days')::date),

  ('Dear younger me, about love...', 'general',
   (date_trunc('week', CURRENT_DATE) + interval '14 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '20 days')::date),

  ('What "being brave in love" actually looks like for me...', 'vulnerability',
   (date_trunc('week', CURRENT_DATE) + interval '21 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '27 days')::date),

  ('The smallest thing my partner does that means the most...', 'appreciation',
   (date_trunc('week', CURRENT_DATE) + interval '28 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '34 days')::date),

  ('When I stopped trying to fix and started trying to feel...', 'emotional-intelligence',
   (date_trunc('week', CURRENT_DATE) + interval '35 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '41 days')::date),

  ('The boundary that changed everything...', 'boundaries',
   (date_trunc('week', CURRENT_DATE) + interval '42 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '48 days')::date),

  ('What I''m learning about the space between us...', 'field-awareness',
   (date_trunc('week', CURRENT_DATE) + interval '49 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '55 days')::date),

  ('To someone who feels like too much or not enough...', 'attachment',
   (date_trunc('week', CURRENT_DATE) + interval '56 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '62 days')::date),

  ('The practice that surprised me...', 'growth',
   (date_trunc('week', CURRENT_DATE) + interval '63 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '69 days')::date),

  ('What I want my partner to know but haven''t said yet...', 'communication',
   (date_trunc('week', CURRENT_DATE) + interval '70 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '76 days')::date),

  ('A moment of ordinary magic in my relationship...', 'appreciation',
   (date_trunc('week', CURRENT_DATE) + interval '77 days')::date,
   (date_trunc('week', CURRENT_DATE) + interval '83 days')::date);
