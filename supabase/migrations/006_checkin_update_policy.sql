-- ============================================================
-- 006: Add UPDATE and DELETE policies for daily_check_ins
--
-- The original migration (001) only created SELECT and INSERT
-- policies, but the app uses upsert (INSERT ... ON CONFLICT UPDATE)
-- for daily check-ins. Without an UPDATE policy, the upsert fails
-- silently on subsequent saves for the same day.
--
-- DELETE policy added so the app can also use delete-then-insert
-- as a fallback strategy.
--
-- ▸ Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

DROP POLICY IF EXISTS "Users can update own check-ins" ON daily_check_ins;
CREATE POLICY "Users can update own check-ins"
  ON daily_check_ins FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own check-ins" ON daily_check_ins;
CREATE POLICY "Users can delete own check-ins"
  ON daily_check_ins FOR DELETE
  USING (auth.uid() = user_id);
