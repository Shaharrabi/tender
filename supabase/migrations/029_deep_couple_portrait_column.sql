-- ============================================================
-- Migration 029: Add deep_portrait JSONB column to relationship_portraits
--
-- The deep couple portrait is a structured analysis generated after
-- both partners have individual portraits. Stored as JSONB for
-- flexible schema evolution.
-- ============================================================

ALTER TABLE relationship_portraits
  ADD COLUMN IF NOT EXISTS deep_portrait JSONB;

COMMENT ON COLUMN relationship_portraits.deep_portrait IS
  'Deep couple portrait — generated from both partners individual portraits. Contains convergence zones, growth edges, and shared dynamics.';
