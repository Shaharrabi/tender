-- ──────────────────────────────────────────────────────────────
-- 032: Dating Letter Rate Limits
--
-- Prevents spam by limiting:
--   • Max 3 letters per day per sender
--   • Max 1 letter to the same recipient per 7 days
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION check_dating_letter_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  daily_count INTEGER;
  same_recipient_count INTEGER;
BEGIN
  -- Check daily limit: max 3 letters per day
  SELECT COUNT(*) INTO daily_count
  FROM dating_letters
  WHERE sender_id = NEW.sender_id
    AND sent_at > NOW() - INTERVAL '24 hours';

  IF daily_count >= 3 THEN
    RAISE EXCEPTION 'Daily letter limit reached. You can send up to 3 letters per day.';
  END IF;

  -- Check per-recipient limit: max 1 letter to same person per 7 days
  SELECT COUNT(*) INTO same_recipient_count
  FROM dating_letters
  WHERE sender_id = NEW.sender_id
    AND recipient_id = NEW.recipient_id
    AND sent_at > NOW() - INTERVAL '7 days';

  IF same_recipient_count >= 1 THEN
    RAISE EXCEPTION 'You have already sent a letter to this person recently. Wait a few days before writing again.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
DROP TRIGGER IF EXISTS trg_dating_letter_rate_limit ON dating_letters;
CREATE TRIGGER trg_dating_letter_rate_limit
  BEFORE INSERT ON dating_letters
  FOR EACH ROW
  EXECUTE FUNCTION check_dating_letter_rate_limit();
