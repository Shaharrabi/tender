-- Migration 036: Portrait history table
-- Preserves old portraits before each overwrite for research integrity

CREATE TABLE IF NOT EXISTS public.portraits_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portrait_snapshot jsonb NOT NULL,  -- full portrait row at time of snapshot
  archived_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,  -- portrait version number at time of snapshot
  reason varchar(50) DEFAULT 'retake'  -- 'retake', 'manual_regenerate', 'migration'
);

ALTER TABLE public.portraits_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own portrait history"
  ON public.portraits_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert portrait history"
  ON public.portraits_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_portraits_history_user
  ON public.portraits_history (user_id, archived_at DESC);
