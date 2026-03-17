-- ============================================================
-- Migration 041: Auto-maintain is_current flag on assessments
--
-- Bug: Migration 038 added is_current column but no code ever
-- sets old rows to false when a new assessment is inserted.
-- Readers recover by sorting on completed_at, but the schema
-- contract is not actually maintained.
--
-- Fix: Add a trigger that marks all previous rows for the same
-- (user_id, type) as is_current=false when a new row is inserted.
-- ============================================================

-- 1. Add is_current column if it doesn't exist (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assessments' AND column_name = 'is_current'
  ) THEN
    ALTER TABLE assessments ADD COLUMN is_current BOOLEAN NOT NULL DEFAULT true;
  END IF;
END $$;

-- 2. Create the trigger function
CREATE OR REPLACE FUNCTION fn_assessment_mark_previous_not_current()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Mark all other rows for same user+type as not current
  UPDATE assessments
    SET is_current = false
    WHERE user_id = NEW.user_id
      AND type = NEW.type
      AND id != NEW.id
      AND is_current = true;

  -- Ensure the new row is current
  NEW.is_current := true;
  RETURN NEW;
END;
$$;

-- 3. Create the trigger (drop first for idempotency)
DROP TRIGGER IF EXISTS trg_assessment_is_current ON assessments;
CREATE TRIGGER trg_assessment_is_current
  BEFORE INSERT ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION fn_assessment_mark_previous_not_current();

-- 4. Backfill: mark all existing rows correctly
-- For each (user_id, type), only the most recent row should be is_current=true
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (PARTITION BY user_id, type ORDER BY completed_at DESC) AS rn
  FROM assessments
)
UPDATE assessments
  SET is_current = (ranked.rn = 1)
  FROM ranked
  WHERE assessments.id = ranked.id;
