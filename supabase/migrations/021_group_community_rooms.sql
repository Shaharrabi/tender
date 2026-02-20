-- ============================================================
-- 021 — Group Community Rooms
-- ============================================================
-- Extends community_posts with a nullable group_id column so each
-- support group gets a private community feed. Only active group
-- members can read/write group-scoped posts. Public community
-- posts (group_id IS NULL) remain unchanged.
-- ============================================================

-- 1. Add group_id column (nullable — null = public community post)
ALTER TABLE community_posts
  ADD COLUMN group_id uuid REFERENCES support_groups(id) ON DELETE CASCADE;

-- 2. Replace the existing global SELECT policy with a public-only policy
DROP POLICY IF EXISTS "Anyone can read approved non-flagged posts" ON community_posts;

CREATE POLICY "Anyone can read public approved posts"
  ON community_posts FOR SELECT
  USING (
    is_approved = true
    AND is_flagged = false
    AND group_id IS NULL
  );

-- 3. New policy: active group members can read their group's posts
CREATE POLICY "Group members can read group posts"
  ON community_posts FOR SELECT
  USING (
    group_id IS NOT NULL
    AND is_approved = true
    AND is_flagged = false
    AND EXISTS (
      SELECT 1 FROM support_group_members
      WHERE support_group_members.group_id = community_posts.group_id
        AND support_group_members.user_id = auth.uid()
        AND support_group_members.status = 'active'
    )
  );

-- 4. Replace INSERT policy to enforce group membership for group posts
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;

CREATE POLICY "Authenticated users can create posts"
  ON community_posts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND (
      group_id IS NULL
      OR EXISTS (
        SELECT 1 FROM support_group_members
        WHERE support_group_members.group_id = community_posts.group_id
          AND support_group_members.user_id = auth.uid()
          AND support_group_members.status = 'active'
      )
    )
  );

-- 5. Index for efficient group post lookups
CREATE INDEX IF NOT EXISTS idx_community_posts_group_id
  ON community_posts (group_id)
  WHERE group_id IS NOT NULL;
