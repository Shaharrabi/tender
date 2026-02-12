-- Migration 003: Consent & Sharing Preferences
-- Run in Supabase SQL Editor

-- Table A: data_consents — Records the user's waiver decision
CREATE TABLE IF NOT EXISTS data_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('store_and_share', 'view_and_erase')),
  consent_text TEXT NOT NULL,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE data_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own consents" ON data_consents
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_data_consents_user ON data_consents(user_id);

-- Table B: sharing_preferences — Per-assessment sharing toggles
CREATE TABLE IF NOT EXISTS sharing_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  shared BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, couple_id, assessment_type)
);

ALTER TABLE sharing_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sharing" ON sharing_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Partners can read shared prefs" ON sharing_preferences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = sharing_preferences.couple_id
        AND (couples.partner_a_id = auth.uid() OR couples.partner_b_id = auth.uid())
    )
  );

CREATE INDEX idx_sharing_prefs_user_couple ON sharing_preferences(user_id, couple_id);
