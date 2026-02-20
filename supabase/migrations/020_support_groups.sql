-- ================================================================
-- 020: Support Groups — Attachment-Based Group Therapy Support
--
-- Four tables:
-- 1. support_groups         — group definitions (The Reach / The Retreat)
-- 2. support_group_members  — user registrations, consent, waitlist
-- 3. support_group_sessions — weekly session schedule
-- 4. support_group_attendance — session attendance + personal notes
-- ================================================================

-- ─── Support Groups ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS support_groups (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_type              TEXT NOT NULL CHECK (group_type IN ('anxious', 'avoidant')),
  name                    TEXT NOT NULL,
  description             TEXT,
  max_members             INTEGER NOT NULL DEFAULT 8,
  cohort_number           INTEGER NOT NULL DEFAULT 1,
  zoom_link               TEXT,
  schedule_day            TEXT,
  schedule_time           TEXT,
  schedule_timezone       TEXT NOT NULL DEFAULT 'America/New_York',
  duration_minutes        INTEGER NOT NULL DEFAULT 75,
  current_step            INTEGER NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 12),
  status                  TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'completed', 'paused')),
  is_active               BOOLEAN NOT NULL DEFAULT true,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE support_groups ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read active groups (landing page needs this)
CREATE POLICY "Authenticated users can read active groups"
  ON support_groups FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_active = true);

-- ─── Support Group Members ──────────────────────────────────

CREATE TABLE IF NOT EXISTS support_group_members (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id                UUID NOT NULL REFERENCES support_groups(id) ON DELETE CASCADE,
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_name          TEXT,
  timezone                TEXT,
  preferred_times         JSONB,
  in_therapy              BOOLEAN,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  consent_given           BOOLEAN NOT NULL DEFAULT false,
  consent_given_at        TIMESTAMPTZ,
  status                  TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'waitlisted', 'inactive')),
  waitlist_position       INTEGER,
  attachment_style        TEXT,
  anxiety_score           DECIMAL(5,2),
  avoidance_score         DECIMAL(5,2),
  registration_data       JSONB,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE support_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own membership"
  ON support_group_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own membership"
  ON support_group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own membership"
  ON support_group_members FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sg_members_group_status
  ON support_group_members(group_id, status);

CREATE INDEX IF NOT EXISTS idx_sg_members_user
  ON support_group_members(user_id);

-- ─── Support Group Sessions ─────────────────────────────────

CREATE TABLE IF NOT EXISTS support_group_sessions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id                UUID NOT NULL REFERENCES support_groups(id) ON DELETE CASCADE,
  session_number          INTEGER NOT NULL,
  step_number             INTEGER NOT NULL CHECK (step_number BETWEEN 1 AND 12),
  session_date            DATE NOT NULL,
  session_time            TEXT,
  zoom_link               TEXT,
  status                  TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  facilitator_notes       TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE support_group_sessions ENABLE ROW LEVEL SECURITY;

-- Members can read sessions for groups they belong to
CREATE POLICY "Members can read group sessions"
  ON support_group_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM support_group_members
      WHERE support_group_members.group_id = support_group_sessions.group_id
        AND support_group_members.user_id = auth.uid()
        AND support_group_members.status IN ('active', 'waitlisted')
    )
  );

CREATE INDEX IF NOT EXISTS idx_sg_sessions_group_date
  ON support_group_sessions(group_id, session_date DESC);

-- ─── Support Group Attendance ───────────────────────────────

CREATE TABLE IF NOT EXISTS support_group_attendance (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id              UUID NOT NULL REFERENCES support_group_sessions(id) ON DELETE CASCADE,
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attended                BOOLEAN NOT NULL DEFAULT false,
  personal_notes          TEXT,
  reflection              JSONB,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

ALTER TABLE support_group_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own attendance"
  ON support_group_attendance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attendance"
  ON support_group_attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attendance"
  ON support_group_attendance FOR UPDATE
  USING (auth.uid() = user_id);

-- ─── Seed Data: Two Initial Groups ──────────────────────────

INSERT INTO support_groups (group_type, name, description, schedule_day, schedule_time, schedule_timezone)
VALUES
  (
    'anxious',
    'The Reach',
    'A safe space for those who feel deeply and reach for connection. Learn to trust your sensitivity without being consumed by it.',
    'wednesday',
    '19:00',
    'America/New_York'
  ),
  (
    'avoidant',
    'The Retreat',
    'A structured space for those who protect through distance. Build connection at your own pace, without pressure.',
    'thursday',
    '19:00',
    'America/New_York'
  );
