-- Phase 3 additions: Big Five reframes + supplement data columns for portraits
-- These store the enhanced portrait data from cross-assessment synthesis

ALTER TABLE portraits
  ADD COLUMN IF NOT EXISTS big_five_reframes JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS supplement_data JSONB DEFAULT NULL;
