/**
 * GroupCommunityRoom — Private community feed scoped to a support group.
 *
 * Reuses StoryCard, ComposeFlow, FAB, and EmptyState from the community
 * system. Posts are filtered by group_id via RLS — only active group
 * members can read or write.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
} from '@/constants/theme';
import { CommunityIcon, LockIcon, SparkleIcon } from '@/assets/graphics/icons';
import { StoryCard } from '@/components/community/StoryCard';
import { EmptyState } from '@/components/community/EmptyState';
import { FAB } from '@/components/community/FAB';
import { ComposeFlow } from '@/components/community/ComposeFlow';
import {
  getOrCreateMembership,
  getAlias,
} from '@/services/community';
import {
  getGroupPosts,
  createGroupPost,
} from '@/services/support-groups';
import { toggleReaction, reportPost } from '@/services/community';
import type { CommunityPost, CommunityAlias, CommunityMembership, ReactionType, PostCategory } from '@/types/community';
import type { SupportGroup } from '@/types/support-groups';

// ─── Props ─────────────────────────────────────────────

interface GroupCommunityRoomProps {
  group: SupportGroup;
  userId: string;
}

// ─── Component ─────────────────────────────────────────

export default function GroupCommunityRoom({
  group,
  userId,
}: GroupCommunityRoomProps) {
  // State
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Alias
  const [membership, setMembership] = useState<CommunityMembership | null>(null);
  const [alias, setAlias] = useState<CommunityAlias | null>(null);

  const initialLoadDone = useRef(false);

  const accentColor = group.groupType === 'avoidant'
    ? Colors.attachmentAvoidant
    : Colors.attachmentAnxious;

  // ── Init: load alias ──────────────────────
  useEffect(() => {
    getOrCreateMembership(userId)
      .then((m) => {
        setMembership(m);
        setAlias(getAlias(m));
      })
      .catch((e) => console.error('[GroupRoom] Membership error:', e));
  }, [userId]);

  // ── Load posts ────────────────────────────
  const loadPosts = useCallback(async () => {
    try {
      const data = await getGroupPosts(userId, group.id);
      setPosts(data as CommunityPost[]);
      initialLoadDone.current = true;
    } catch (e) {
      console.error('[GroupRoom] Failed to load posts:', e);
    }
  }, [userId, group.id]);

  useEffect(() => {
    setLoading(true);
    loadPosts().finally(() => setLoading(false));
  }, [loadPosts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  // ── Submit post ───────────────────────────
  const handleSubmit = useCallback(
    async (content: string, category: PostCategory) => {
      if (!alias) return;
      setSubmitting(true);
      try {
        await createGroupPost(
          userId,
          group.id,
          content,
          category,
          alias.name,
          alias.color
        );
        await loadPosts();
      } catch (e: any) {
        Alert.alert('Error', e.message || 'Failed to share. Please try again.');
        throw e;
      } finally {
        setSubmitting(false);
      }
    },
    [userId, group.id, alias, loadPosts]
  );

  // ── Reactions ─────────────────────────────
  const handleReaction = useCallback(
    async (postId: string, reactionType: ReactionType) => {
      try {
        const nowActive = await toggleReaction(postId, userId, reactionType);

        const countKeyMap: Record<ReactionType, 'resonatedCount' | 'feltSeenCount' | 'beenThereCount'> = {
          resonated: 'resonatedCount',
          felt_seen: 'feltSeenCount',
          been_there: 'beenThereCount',
        };
        const hasKeyMap: Record<ReactionType, 'hasResonated' | 'hasFeltSeen' | 'hasBeenThere'> = {
          resonated: 'hasResonated',
          felt_seen: 'hasFeltSeen',
          been_there: 'hasBeenThere',
        };

        const countKey = countKeyMap[reactionType];
        const hasKey = hasKeyMap[reactionType];

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  [hasKey]: nowActive,
                  [countKey]: nowActive
                    ? p[countKey] + 1
                    : Math.max(p[countKey] - 1, 0),
                }
              : p
          )
        );
      } catch (e) {
        console.error('[GroupRoom] Reaction error:', e);
      }
    },
    [userId]
  );

  // ── Report ────────────────────────────────
  const handleReport = useCallback(
    (postId: string) => {
      Alert.alert(
        'Report This Post',
        'This post will be reviewed and may be removed.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Report',
            style: 'destructive',
            onPress: async () => {
              try {
                await reportPost(postId);
                setPosts((prev) => prev.filter((p) => p.id !== postId));
                Alert.alert('Reported', 'Thank you. We will review this post.');
              } catch {
                Alert.alert('Error', 'Failed to report. Please try again.');
              }
            },
          },
        ]
      );
    },
    []
  );

  // ── Render ────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <CommunityIcon size={20} color={accentColor} />
          <Text style={styles.headerTitle}>{group.name} Room</Text>
        </View>
        <View style={styles.privateBadge}>
          <LockIcon size={10} color={Colors.textMuted} />
          <Text style={styles.privateBadgeText}>Members Only</Text>
        </View>
      </View>

      {/* Posts */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading && posts.length === 0 ? (
          <ActivityIndicator style={styles.loader} color={Colors.primary} />
        ) : posts.length === 0 && initialLoadDone.current ? (
          <EmptyState
            Icon={SparkleIcon}
            title="Your group room"
            subtitle="This is a private space for your group. Share what's on your mind — only members can see it."
            actionLabel="Share Something"
            onAction={() => setShowCompose(true)}
          />
        ) : (
          posts.map((post) => (
            <StoryCard
              key={post.id}
              post={post}
              onReaction={handleReaction}
              onReport={handleReport}
            />
          ))
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* FAB */}
      <FAB
        visible={!showCompose}
        onPress={() => setShowCompose(true)}
      />

      {/* Compose */}
      {alias && (
        <ComposeFlow
          visible={showCompose}
          alias={alias}
          onDismiss={() => setShowCompose(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.backgroundAlt || Colors.background,
    borderRadius: BorderRadius.pill,
  },
  privateBadgeText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  loader: {
    marginTop: Spacing.xxl,
  },
});
