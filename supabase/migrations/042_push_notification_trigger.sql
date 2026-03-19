-- ============================================================
-- 042: Push notification trigger on partner_activity inserts
--
-- When a new row is inserted into partner_activity, this trigger
-- calls the send-push edge function via pg_net to deliver a
-- real-time Expo push notification to the recipient.
--
-- Requires: pg_net extension (enable in Supabase dashboard → Database → Extensions)
-- ============================================================

-- Enable pg_net if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- ─── Notification copy function ─────────────────────────
-- Mirrors getPartnerActivityCopy() from services/notifications.ts
-- so push content matches what users see in-app.

CREATE OR REPLACE FUNCTION get_partner_activity_push_copy(
  p_activity_type TEXT,
  p_partner_name TEXT,
  p_details TEXT DEFAULT NULL
)
RETURNS TABLE(title TEXT, body TEXT) AS $$
DECLARE
  v_name TEXT := COALESCE(NULLIF(p_partner_name, ''), 'Your partner');
BEGIN
  CASE p_activity_type
    WHEN 'assessment_complete' THEN
      title := v_name || ' completed an assessment!';
      IF p_details IS NOT NULL THEN
        body := 'They just finished ' || p_details || '. Tap to see what''s new in your couple portal.';
      ELSE
        body := 'A new piece of the puzzle is in. Tap to see what''s new together.';
      END IF;

    WHEN 'practice_complete' THEN
      title := v_name || ' finished a practice!';
      body := 'They are putting in the work. Your shared journey just moved forward.';

    WHEN 'step_reflection' THEN
      title := v_name || ' shared a reflection';
      body := 'Something new is waiting for you in the couple portal.';

    WHEN 'checkin' THEN
      title := v_name || ' checked in';
      body := 'They are thinking about you. Tap to see how they are feeling.';

    WHEN 'portrait_update' THEN
      title := v_name || '''s portrait just updated';
      body := 'New insights have landed. See how your portraits connect.';

    ELSE
      title := v_name || ' did something new';
      body := 'Tap to see what''s happening in your couple portal.';
  END CASE;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ─── Trigger function ───────────────────────────────────

CREATE OR REPLACE FUNCTION notify_partner_on_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_partner_name TEXT;
  v_details TEXT;
  v_title TEXT;
  v_body TEXT;
  v_supabase_url TEXT;
  v_service_role_key TEXT;
  v_payload JSONB;
BEGIN
  -- Skip if no recipient
  IF NEW.recipient_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Look up the actor's display name for warm notification copy
  SELECT display_name INTO v_partner_name
  FROM users
  WHERE id = NEW.actor_user_id;

  -- Extract details from activity_data if present (e.g., assessment name)
  v_details := NEW.activity_data ->> 'assessment_name';

  -- Get the notification copy
  SELECT t.title, t.body INTO v_title, v_body
  FROM get_partner_activity_push_copy(
    NEW.activity_type,
    COALESCE(v_partner_name, 'Your partner'),
    v_details
  ) t;

  -- Build the JSON payload for the edge function
  v_payload := jsonb_build_object(
    'recipient_user_id', NEW.recipient_user_id,
    'title', v_title,
    'body', v_body,
    'data', jsonb_build_object(
      'type', 'partner_activity',
      'activityType', NEW.activity_type,
      'activityId', NEW.id
    )
  );

  -- Pull config from Supabase vault (secure, never exposed to clients).
  -- Store secrets via SQL Editor or Dashboard → Settings → Vault:
  --   SELECT vault.create_secret('supabase_url', 'https://xxx.supabase.co');
  --   SELECT vault.create_secret('service_role_key', 'eyJ...');
  SELECT decrypted_secret INTO v_supabase_url
    FROM vault.decrypted_secrets WHERE name = 'supabase_url' LIMIT 1;
  SELECT decrypted_secret INTO v_service_role_key
    FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

  -- Fallback: use project URL if vault secret not set
  IF v_supabase_url IS NULL THEN
    v_supabase_url := 'https://qwqclhzezyzeflxrtfjy.supabase.co';
  END IF;

  -- Only fire if we have the necessary config
  IF v_supabase_url IS NOT NULL AND v_service_role_key IS NOT NULL THEN
    -- Call the send-push edge function via pg_net (async HTTP)
    PERFORM net.http_post(
      url := v_supabase_url || '/functions/v1/send-push',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_service_role_key
      ),
      body := v_payload
    );
  ELSE
    RAISE WARNING '[push-trigger] Missing supabase_url or service_role_key — push notification skipped. Set them in vault: INSERT INTO vault.secrets (name, secret) VALUES (''supabase_url'', ''https://xxx.supabase.co''), (''service_role_key'', ''eyJ...'');';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Attach trigger ─────────────────────────────────────

DROP TRIGGER IF EXISTS trg_partner_activity_push ON partner_activity;

CREATE TRIGGER trg_partner_activity_push
  AFTER INSERT ON partner_activity
  FOR EACH ROW
  EXECUTE FUNCTION notify_partner_on_activity();

-- ─── Setup instructions ─────────────────────────────────
-- After running this migration, store your project config in the vault:
--
--   INSERT INTO vault.secrets (name, secret)
--   VALUES ('supabase_url', 'https://YOUR_PROJECT_REF.supabase.co')
--   ON CONFLICT (name) DO UPDATE SET secret = EXCLUDED.secret;
--
--   INSERT INTO vault.secrets (name, secret)
--   VALUES ('service_role_key', 'eyJhbGciOiJIUzI1NiIs...')
--   ON CONFLICT (name) DO UPDATE SET secret = EXCLUDED.secret;
--
-- Then deploy the edge function:
--   supabase functions deploy send-push
