-- ============================================================
-- 022 — Engagement Notification Log
-- ============================================================
-- Tracks which engagement notifications were shown to users,
-- whether they were dismissed/tapped, and any resulting action.
-- Used for analytics and cross-device persistence.
-- ============================================================

CREATE TABLE IF NOT EXISTS engagement_notification_log (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id     TEXT NOT NULL,
  category      TEXT NOT NULL,
  shown_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  dismissed_at  TIMESTAMPTZ,
  tapped_at     TIMESTAMPTZ,
  action_taken  BOOLEAN NOT NULL DEFAULT false,
  weare_target  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE engagement_notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notification log"
  ON engagement_notification_log
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_engagement_notif_user_date
  ON engagement_notification_log (user_id, shown_at DESC);

CREATE INDEX idx_engagement_notif_prompt
  ON engagement_notification_log (prompt_id);
