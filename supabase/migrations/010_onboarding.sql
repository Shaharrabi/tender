-- Add onboarding fields to user_profiles
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS relationship_status TEXT,
  ADD COLUMN IF NOT EXISTS relationship_duration TEXT,
  ADD COLUMN IF NOT EXISTS goals TEXT[],
  ADD COLUMN IF NOT EXISTS time_commitment TEXT;
