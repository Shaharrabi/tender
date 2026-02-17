-- ──────────────────────────────────────────────────────────
-- Migration 015: Enhanced community reactions
-- Three reaction types: resonated, felt_seen, been_there
-- ──────────────────────────────────────────────────────────

-- ── Add constraint to limit reaction types ──────────────────

ALTER TABLE public.community_reactions
  DROP CONSTRAINT IF EXISTS community_reactions_reaction_type_check;

ALTER TABLE public.community_reactions
  ADD CONSTRAINT community_reactions_reaction_type_check
  CHECK (reaction_type IN ('resonated', 'felt_seen', 'been_there'));

-- ── Add count columns to community_posts ────────────────────

ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS felt_seen_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS been_there_count INTEGER NOT NULL DEFAULT 0;

-- ── Replace trigger: update counts for all 3 reaction types ─

CREATE OR REPLACE FUNCTION public.update_reaction_counts()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.reaction_type = 'resonated' THEN
      UPDATE public.community_posts
        SET resonated_count = resonated_count + 1
        WHERE id = NEW.post_id;
    ELSIF NEW.reaction_type = 'felt_seen' THEN
      UPDATE public.community_posts
        SET felt_seen_count = felt_seen_count + 1
        WHERE id = NEW.post_id;
    ELSIF NEW.reaction_type = 'been_there' THEN
      UPDATE public.community_posts
        SET been_there_count = been_there_count + 1
        WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.reaction_type = 'resonated' THEN
      UPDATE public.community_posts
        SET resonated_count = GREATEST(resonated_count - 1, 0)
        WHERE id = OLD.post_id;
    ELSIF OLD.reaction_type = 'felt_seen' THEN
      UPDATE public.community_posts
        SET felt_seen_count = GREATEST(felt_seen_count - 1, 0)
        WHERE id = OLD.post_id;
    ELSIF OLD.reaction_type = 'been_there' THEN
      UPDATE public.community_posts
        SET been_there_count = GREATEST(been_there_count - 1, 0)
        WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger and create new one
DROP TRIGGER IF EXISTS trg_update_resonated_count ON public.community_reactions;

CREATE TRIGGER trg_update_reaction_counts
  AFTER INSERT OR DELETE ON public.community_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reaction_counts();
