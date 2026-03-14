-- Migration 035: Add instrument_version to assessments table
--
-- Tracks which version of an assessment instrument was used.
-- Important for distinguishing pre-migration results (original published
-- instruments) from post-migration results (Tender-original or trimmed).
--
-- Version values:
--   'original'       — ECR-R (36 items), RFAS (20 items)
--   'tender-ip-v1'   — DUTCH (15 items), SSEIT (16 items), VALUES (28 items)
--   'trimmed-v1'     — IPIP (60 items), DSI-R (20 items)
--   NULL             — Legacy rows created before this migration

ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS instrument_version TEXT;

COMMENT ON COLUMN assessments.instrument_version IS
  'Assessment instrument version: original, tender-ip-v1, trimmed-v1, or NULL for legacy';
