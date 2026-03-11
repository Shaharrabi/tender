-- ──────────────────────────────────────────────────────────
-- Migration 031: Letter matching RPC
--
-- Fixes: RLS policies on community_letters block the letter
-- matching query. The SELECT policies only allow author_id
-- or recipient_id = auth.uid(), but during matching the user
-- is neither. This SECURITY DEFINER function bypasses RLS
-- to atomically find + deliver an unmatched letter.
-- ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.match_letter_for_user(
  p_recipient_id UUID,
  p_user_pattern TEXT DEFAULT NULL
)
RETURNS SETOF public.community_letters
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_letter public.community_letters;
BEGIN
  -- Step 1: Try same-pattern match first (they understand each other)
  IF p_user_pattern IS NOT NULL THEN
    SELECT * INTO matched_letter
    FROM public.community_letters
    WHERE recipient_id IS NULL
      AND is_approved = true
      AND author_id != p_recipient_id
      AND author_pattern = p_user_pattern
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    IF FOUND THEN
      UPDATE public.community_letters
      SET recipient_id = p_recipient_id,
          delivered_at = NOW()
      WHERE id = matched_letter.id
        AND recipient_id IS NULL;  -- race condition guard

      IF FOUND THEN
        -- Re-read the updated row to return current state
        RETURN QUERY
          SELECT * FROM public.community_letters WHERE id = matched_letter.id;
        RETURN;
      END IF;
    END IF;
  END IF;

  -- Step 2: Fallback — any undelivered letter (cross-pattern)
  SELECT * INTO matched_letter
  FROM public.community_letters
  WHERE recipient_id IS NULL
    AND is_approved = true
    AND author_id != p_recipient_id
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF NOT FOUND THEN
    RETURN;  -- no letters available
  END IF;

  UPDATE public.community_letters
  SET recipient_id = p_recipient_id,
      delivered_at = NOW()
  WHERE id = matched_letter.id
    AND recipient_id IS NULL;  -- race condition guard

  IF FOUND THEN
    RETURN QUERY
      SELECT * FROM public.community_letters WHERE id = matched_letter.id;
  END IF;

  RETURN;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.match_letter_for_user(UUID, TEXT)
  TO authenticated;
