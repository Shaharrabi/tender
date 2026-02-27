-- ─── Fix dyadic_assessments CHECK constraint ────────────────────────
-- The original CHECK only allowed: rdas, dci, csi-16, csi-4
-- But the app also uses: relational-field, couple-field
-- This was silently preventing inserts for those types.
--
-- Also drop the constraint entirely and re-create it with all valid types.

-- Drop the old constraint (Postgres names it automatically; try both patterns)
DO $$
BEGIN
  -- Try dropping the auto-generated constraint name
  ALTER TABLE dyadic_assessments
    DROP CONSTRAINT IF EXISTS dyadic_assessments_assessment_type_check;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Re-add with all valid types
ALTER TABLE dyadic_assessments
  DROP CONSTRAINT IF EXISTS dyadic_assessments_assessment_type_check;

ALTER TABLE dyadic_assessments
  ADD CONSTRAINT dyadic_assessments_assessment_type_check
  CHECK (assessment_type IN ('rdas', 'dci', 'csi-16', 'csi-4', 'relational-field', 'couple-field'));
