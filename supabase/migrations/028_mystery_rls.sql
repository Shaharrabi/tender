-- ============================================================
-- Migration 028: Enable RLS on mystery_content + add policies
--                for user_mystery_reveals
--
-- Security fixes:
--   1. mystery_content had RLS disabled — enable it with public
--      read (content definitions are not sensitive).
--   2. user_mystery_reveals had RLS enabled but ZERO policies,
--      so nobody could access it. Add SELECT/INSERT for own rows.
-- ============================================================

-- ── Fix 5: mystery_content ──────────────────────────────────
ALTER TABLE mystery_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read mystery content" ON mystery_content
  FOR SELECT USING (true);  -- public read is OK for content definitions

-- ── Fix 6: user_mystery_reveals ─────────────────────────────
CREATE POLICY "Users can read own reveals" ON user_mystery_reveals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reveals" ON user_mystery_reveals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
