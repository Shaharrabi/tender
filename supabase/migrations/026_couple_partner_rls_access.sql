-- ─── Allow couple partners to read each other's portraits + assessments ──
--
-- ROOT CAUSE: The couple portal calls getPortrait(partnerId) to load the
-- partner's individual portrait, but the RLS policy on `portraits` only
-- allows auth.uid() = user_id. Supabase silently returns zero rows, so
-- the partner portrait is always null and the deep couple portrait can
-- never generate.
--
-- Same issue on `assessments` — auto-generating a partner's portrait
-- requires reading their assessment completions.
--
-- Fix: Add SELECT policies that allow a user to read their active
-- couple partner's rows.

-- 1. Portraits — partner can read
DROP POLICY IF EXISTS "Partners can read linked portrait" ON portraits;
CREATE POLICY "Partners can read linked portrait"
  ON portraits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.status = 'active'
      AND (
        (couples.partner_a_id = auth.uid() AND couples.partner_b_id = portraits.user_id)
        OR
        (couples.partner_b_id = auth.uid() AND couples.partner_a_id = portraits.user_id)
      )
    )
  );

-- 2. Assessments — partner can read
DROP POLICY IF EXISTS "Partners can read linked assessments" ON assessments;
CREATE POLICY "Partners can read linked assessments"
  ON assessments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.status = 'active'
      AND (
        (couples.partner_a_id = auth.uid() AND couples.partner_b_id = assessments.user_id)
        OR
        (couples.partner_b_id = auth.uid() AND couples.partner_a_id = assessments.user_id)
      )
    )
  );
