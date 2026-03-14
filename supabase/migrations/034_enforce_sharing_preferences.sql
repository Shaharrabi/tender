-- Migration 034: Enforce sharing preferences on partner RLS policies
--
-- FIXES CRITICAL PRIVACY BUG: Migration 026 allowed partners to read
-- ALL assessments and portraits once linked, ignoring the
-- sharing_preferences table entirely. Users who toggled sharing OFF
-- were still fully visible to their partner.
--
-- This migration replaces the open partner-access policies with ones
-- that require `sharing_preferences.shared = true` for each assessment.
-- Portraits remain accessible to partners (they contain composite scores
-- needed for couple features), but individual assessment details are gated.

-- ──────────────────────────────────────────────────────────────────────
-- 1. Replace assessments partner-read policy with sharing-aware version
-- ──────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Partners can read linked assessments" ON assessments;

CREATE POLICY "Partners can read shared assessments"
  ON assessments FOR SELECT
  USING (
    -- Owner can always read their own
    auth.uid() = user_id
    OR
    -- Partner can read ONLY if the assessment type is explicitly shared
    EXISTS (
      SELECT 1
      FROM couples c
      JOIN sharing_preferences sp
        ON sp.couple_id = c.id
        AND sp.user_id = assessments.user_id
        AND sp.assessment_type = assessments.type
        AND sp.shared = true
      WHERE c.status = 'active'
      AND (
        (c.partner_a_id = auth.uid() AND c.partner_b_id = assessments.user_id)
        OR
        (c.partner_b_id = auth.uid() AND c.partner_a_id = assessments.user_id)
      )
    )
  );

-- ──────────────────────────────────────────────────────────────────────
-- 2. Portraits: keep partner access (needed for couple portal composite
--    scores) but this is portrait-level, not raw assessment data.
--    No change needed — portraits contain only processed/composite data.
-- ──────────────────────────────────────────────────────────────────────
-- (Migration 026 portrait policy remains as-is — acceptable because
--  portraits contain aggregated composite scores, not raw responses.)
