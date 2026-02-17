-- ============================================================
-- 014: Community Upgrade — Alias System + Post Snapshots
-- ============================================================

-- ─── Community Memberships (Alias System) ────────────────────

CREATE TABLE IF NOT EXISTS public.community_memberships (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alias_adjective  VARCHAR(30) NOT NULL,
  alias_noun       VARCHAR(30) NOT NULL,
  alias_color      VARCHAR(7)  NOT NULL,  -- hex like '#6BA3A0'
  alias_rotated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  joined_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT community_memberships_user_unique UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.community_memberships ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see/create/update their own membership
CREATE POLICY "Users can view own membership"
  ON public.community_memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own membership"
  ON public.community_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own membership"
  ON public.community_memberships FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for fast lookup by user_id (already unique, but explicit)
CREATE INDEX IF NOT EXISTS idx_community_memberships_user
  ON public.community_memberships (user_id);

-- ─── Add Alias Snapshot Columns to Posts ──────────────────────

-- Alias is snapshotted at post time so rotation doesn't change old posts
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS alias_name  VARCHAR(60),
  ADD COLUMN IF NOT EXISTS alias_color VARCHAR(7);
