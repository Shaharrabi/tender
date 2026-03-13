/**
 * Community — Thin orchestrator for anonymous stories, reactions, and letter exchange.
 *
 * 4 tabs:
 * 1. For You  — stories filtered by attachment style (or all + gentle banner)
 * 2. All Stories — all approved posts
 * 3. Letters — anonymous letter exchange with weekly prompts
 * 4. Circle  — coming soon (locked)
 *
 * Components:
 *   CommunityHeader, CommunityTabs, CategoryPills,
 *   StoryCard, EmptyState, FAB, ComposeFlow, WelcomeModal,
 *   LetterDesk, LetterFlow
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Animated from 'react-native-reanimated';
import QuickLinksBar from '@/components/QuickLinksBar';
import { useScrollHideBar } from '@/hooks/useScrollHideBar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { useGamification } from '@/context/GamificationContext';
import { supabase } from '@/services/supabase';
import {
  getPosts,
  createPost,
  toggleReaction,
  reportPost,
  getOrCreateMembership,
  rotateAlias,
  getAlias,
} from '@/services/community';
import {
  getActivePrompt,
  createLetter,
  getReceivedLetters,
  getLetterStats,
  markLetterRead,
  matchLetterForUser,
} from '@/services/letters';
import { getPortrait } from '@/services/portrait';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import { CATEGORIES } from '@/constants/community';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius } from '@/constants/theme';
import type {
  CommunityPost,
  CommunityAlias,
  CommunityMembership,
  CommunityTab,
  PostCategory,
  ReactionType,
  CommunityLetter,
  WeeklyPrompt,
} from '@/types/community';
import type { AttachmentStyle } from '@/types';

// ─── Components ─────────────────────────────────────────
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityTabs } from '@/components/community/CommunityTabs';
import { CategoryPills } from '@/components/community/CategoryPills';
import { StoryCard } from '@/components/community/StoryCard';
import { EmptyState } from '@/components/community/EmptyState';
import { FAB } from '@/components/community/FAB';
import { ComposeFlow } from '@/components/community/ComposeFlow';
import { WelcomeModal } from '@/components/community/WelcomeModal';
import { LetterDesk } from '@/components/community/LetterDesk';
import { LetterFlow } from '@/components/community/LetterFlow';
import { ArticlesSection } from '@/components/community/ArticlesSection';
import { ARTICLES } from '@/constants/articles';
import { ThoughtBubbleIcon, LockIcon, SparkleIcon, FireIcon, PenIcon } from '@/assets/graphics/icons';

// ─── FTUE ───────────────────────────────────────────────
import { TooltipManager } from '@/components/ftue/TooltipManager';
import { WelcomeAudio } from '@/components/ftue/WelcomeAudio';

// ─── Component ──────────────────────────────────────────

export default function CommunityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isGuest } = useGuest();
  const { handleScroll: handleBarScroll, animatedStyle: quickLinksAnimStyle } = useScrollHideBar();
  const { awardXP } = useGamification();
  const haptics = useSoundHaptics();

  // ── State ──────────────────────────────────
  const [activeTab, setActiveTab] = useState<CommunityTab>('forYou');
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Alias & membership
  const [membership, setMembership] = useState<CommunityMembership | null>(null);
  const [alias, setAlias] = useState<CommunityAlias | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Compose (stories)
  const [showCompose, setShowCompose] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Letter Desk
  const [weeklyPrompt, setWeeklyPrompt] = useState<WeeklyPrompt | null>(null);
  const [receivedLetters, setReceivedLetters] = useState<CommunityLetter[]>([]);
  const [letterSentCount, setLetterSentCount] = useState(0);
  const [loadingLetters, setLoadingLetters] = useState(false);
  const [showLetterCompose, setShowLetterCompose] = useState(false);
  const [letterSubmitting, setLetterSubmitting] = useState(false);

  // Portrait / attachment style for "For You" filtering + letter matching
  const [attachmentStyle, setAttachmentStyle] = useState<AttachmentStyle | null>(null);

  // Track if initial load done (avoid showing empty states prematurely)
  const initialLoadDone = useRef(false);

  // ── Init: membership + portrait ────────────
  useEffect(() => {
    if (!user) return;

    // Load membership (alias system)
    getOrCreateMembership(user.id)
      .then((m) => {
        setMembership(m);
        setAlias(getAlias(m));

        // Show welcome modal if just joined (within last 10 seconds)
        const joinedMs = Date.now() - new Date(m.joinedAt).getTime();
        if (joinedMs < 10_000) {
          setShowWelcome(true);
        }
      })
      .catch((e) => console.error('[Community] Membership error:', e));

    // Load portrait for attachment style filtering
    getPortrait(user.id)
      .then((portrait) => {
        if (portrait?.negativeCycle?.position) {
          const pos = portrait.negativeCycle.position;
          if (pos === 'pursuer') setAttachmentStyle('anxious-preoccupied');
          else if (pos === 'withdrawer') setAttachmentStyle('dismissive-avoidant');
          else if (pos === 'mixed') setAttachmentStyle('fearful-avoidant');
          else setAttachmentStyle('secure');
        }
      })
      .catch(() => {}); // No portrait is fine — fallback to all posts

    // Load weekly prompt for letters
    getActivePrompt()
      .then(setWeeklyPrompt)
      .catch(() => {});
  }, [user]);

  // ── Load posts (supports guest browsing) ───
  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const categoryFilter = activeCategory !== 'All' ? activeCategory : undefined;

      // "For You" tab: filter by attachment style if available
      const styleFilter =
        activeTab === 'forYou' && attachmentStyle ? attachmentStyle : undefined;

      // Pass userId if available, null for guests (skips reactions query)
      const data = await getPosts(user?.id ?? null, {
        category: categoryFilter,
        attachmentStyle: styleFilter,
      });
      setPosts(data);
      initialLoadDone.current = true;
    } catch (e) {
      console.error('[Community] Failed to load posts:', e);
    } finally {
      setLoadingPosts(false);
    }
  }, [user, activeCategory, activeTab, attachmentStyle]);

  useEffect(() => {
    if (activeTab === 'forYou' || activeTab === 'allStories') {
      loadPosts();
    }
  }, [activeTab, activeCategory, attachmentStyle]);

  // ── Realtime: live-prepend new posts ────────
  useEffect(() => {
    const channel = supabase
      .channel('community-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts',
          filter: 'is_approved=eq.true',
        },
        (payload) => {
          // Only auto-prepend if we're viewing stories and the post isn't ours
          if (
            (activeTab === 'forYou' || activeTab === 'allStories') &&
            payload.new &&
            payload.new.user_id !== user?.id
          ) {
            // Reload to get properly formatted posts with reactions
            loadPosts();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab, user?.id, loadPosts]);

  // ── Load letters ───────────────────────────
  const loadLetters = useCallback(async () => {
    if (!user) return;
    setLoadingLetters(true);
    try {
      // Try to match a letter for this user first
      await matchLetterForUser(user.id, attachmentStyle).catch(() => {});

      // Then load stats + received letters
      const [stats, letters] = await Promise.all([
        getLetterStats(user.id),
        getReceivedLetters(user.id),
      ]);

      setLetterSentCount(stats.sentCount);
      setReceivedLetters(letters);
    } catch (e) {
      console.error('[Community] Failed to load letters:', e);
    } finally {
      setLoadingLetters(false);
    }
  }, [user, attachmentStyle]);

  useEffect(() => {
    if (activeTab === 'letters' && user) {
      loadLetters();
    }
  }, [activeTab, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'letters') {
      await loadLetters();
    } else {
      await loadPosts();
    }
    setRefreshing(false);
  };

  // ── Alias rotation ─────────────────────────
  const handleRotateAlias = useCallback(async () => {
    if (!user) return;
    try {
      const updated = await rotateAlias(user.id);
      setMembership(updated);
      setAlias(getAlias(updated));
      haptics.success();
    } catch (e) {
      Alert.alert('Error', 'Failed to refresh your name. Please try again.');
    }
  }, [user, haptics]);

  // ── Submit story ───────────────────────────
  const handleSubmitStory = useCallback(
    async (content: string, category: PostCategory) => {
      if (!user || !alias) return;

      setSubmitting(true);
      try {
        const newPost = await createPost(
          user.id,
          content,
          category,
          undefined, // healingPhase
          attachmentStyle ?? undefined,
          alias.name,
          alias.color
        );

        // Award XP (non-blocking)
        awardXP('community_post', newPost.id, 'Shared a story').catch(() => {});

        // Reload posts
        await loadPosts();
      } catch (e: any) {
        Alert.alert('Error', e.message || 'Failed to share your story. Please try again.');
        throw e; // Re-throw so ComposeFlow doesn't show celebration
      } finally {
        setSubmitting(false);
      }
    },
    [user, alias, attachmentStyle, awardXP, loadPosts]
  );

  // ── Submit letter ──────────────────────────
  const handleSubmitLetter = useCallback(
    async (content: string, promptId: string | null) => {
      if (!user || !alias) return;

      setLetterSubmitting(true);
      try {
        const newLetter = await createLetter(
          user.id,
          content,
          promptId,
          attachmentStyle,
          alias.name,
          alias.color
        );

        // Award XP (non-blocking)
        awardXP('community_post', newLetter.id, 'Wrote a letter').catch(() => {});

        // Reload letters
        await loadLetters();
      } catch (e: any) {
        Alert.alert('Error', e.message || 'Failed to send your letter. Please try again.');
        throw e; // Re-throw so LetterFlow doesn't show celebration
      } finally {
        setLetterSubmitting(false);
      }
    },
    [user, alias, attachmentStyle, awardXP, loadLetters]
  );

  // ── Open letter (mark as read) ─────────────
  const handleOpenLetter = useCallback(
    async (letterId: string) => {
      try {
        await markLetterRead(letterId);
        setReceivedLetters((prev) =>
          prev.map((l) =>
            l.id === letterId ? { ...l, isRead: true, readAt: new Date().toISOString() } : l
          )
        );
      } catch (e) {
        console.error('[Community] Failed to mark letter read:', e);
      }
    },
    []
  );

  // ── Toggle reaction (resonated / felt_seen / been_there) ──
  const handleReaction = useCallback(
    async (postId: string, reactionType: ReactionType) => {
      if (!user) return;
      try {
        const nowActive = await toggleReaction(postId, user.id, reactionType);

        // Map reaction type to CommunityPost field names
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

        // Award XP only when adding a reaction (non-blocking)
        if (nowActive) {
          const label =
            reactionType === 'resonated' ? 'Resonated with a story'
            : reactionType === 'felt_seen' ? 'Felt seen by a story'
            : 'Been there with a story';
          awardXP('community_reaction', postId, label).catch(() => {});
        }
      } catch (e) {
        console.error('[Community] Failed to toggle reaction:', e);
        Alert.alert('Error', 'Failed to update reaction. Please try again.');
      }
    },
    [user, awardXP]
  );

  // ── Report ────────────────────────────────
  const handleReport = useCallback(
    (postId: string) => {
      Alert.alert(
        'Report This Post',
        'Are you sure you want to report this post? It will be reviewed and may be removed.',
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

  // ── Tab change handler ─────────────────────
  const handleTabChange = useCallback((tab: CommunityTab) => {
    setActiveTab(tab);
    setActiveCategory('All'); // Reset category on tab switch
  }, []);

  // ── Derived ────────────────────────────────
  const isStoryTab = activeTab === 'forYou' || activeTab === 'allStories';
  const showFab = isStoryTab && !!user && !isGuest;

  // ── Render ─────────────────────────────────
  return (
    <SafeAreaView style={st.container}>
      {/* Header with alias chip */}
      <CommunityHeader
        alias={alias}
        onBack={() => router.canGoBack() ? router.back() : router.replace('/(app)/home' as any)}
        onRotateAlias={handleRotateAlias}
      />

      {/* Tab navigation */}
      <CommunityTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Category filters (story tabs only) */}
      {isStoryTab && (
        <CategoryPills
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={CATEGORIES}
        />
      )}

      {/* Content area */}
      <ScrollView
        style={st.scrollView}
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleBarScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* ═══ For You / All Stories ═══════════════ */}
        {isStoryTab && (
          <>
            {/* "For You" gentle banner when no portrait available */}
            {activeTab === 'forYou' && !attachmentStyle && initialLoadDone.current && (
              <EmptyState
                Icon={SparkleIcon}
                title="Personalized stories"
                subtitle="Complete your Tender Assessment to see stories matched to your attachment style. Showing all stories for now."
              />
            )}

            {loadingPosts && posts.length === 0 ? (
              <ActivityIndicator style={st.loader} color={Colors.primary} accessibilityLabel="Loading" />
            ) : posts.length === 0 && initialLoadDone.current ? (
              <EmptyState
                Icon={ThoughtBubbleIcon}
                title="No stories yet"
                subtitle="Be the first to share. Your experience might be exactly what someone else needs to hear."
                actionLabel={user && !isGuest ? 'Share a Story' : undefined}
                onAction={user && !isGuest ? () => setShowCompose(true) : undefined}
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

            {/* ── Articles Teaser ─────────────────── */}
            {posts.length > 0 && (
              <View style={st.articlesTeaserSection}>
                <View style={st.articlesTeaserDivider}>
                  <View style={st.articlesTeaserLine} />
                  <PenIcon size={12} color={Colors.textMuted} />
                  <View style={st.articlesTeaserLine} />
                </View>
                <Text style={st.articlesTeaserPre}>Tender Reads</Text>
                <Text style={st.articlesTeaserTitle}>The Science of Relationships</Text>
                <Text style={st.articlesTeaserSub}>
                  Evidence-based articles on what makes love work.
                </Text>

                {ARTICLES.slice(0, 3).map((article) => {
                  const IconComp = article.Icon;
                  return (
                    <TouchableOpacity
                      key={article.id}
                      style={[st.articleTeaser, { borderLeftColor: article.accentColor }]}
                      onPress={() => {
                        setActiveTab('articles');
                      }}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={`Read article: ${article.title}`}
                    >
                      <View style={[st.articleTeaserIcon, { backgroundColor: article.accentColor + '18' }]}>
                        <IconComp size={16} color={article.accentColor} />
                      </View>
                      <View style={st.articleTeaserBody}>
                        <Text style={st.articleTeaserTitle2} numberOfLines={1}>{article.title}</Text>
                        <View style={st.articleTeaserMeta}>
                          <View style={[st.articleTeaserBadge, { backgroundColor: article.accentColor + '15' }]}>
                            <Text style={[st.articleTeaserBadgeText, { color: article.accentColor }]}>{article.category}</Text>
                          </View>
                          <Text style={st.articleTeaserTime}>{article.readTime}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity
                  style={st.articlesTeaserCta}
                  onPress={() => setActiveTab('articles')}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="See all articles"
                >
                  <Text style={st.articlesTeaserCtaText}>See all {ARTICLES.length} articles →</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* ═══ Letters ═════════════════════════════ */}
        {activeTab === 'letters' && (
          <LetterDesk
            weeklyPrompt={weeklyPrompt}
            receivedLetters={receivedLetters}
            sentCount={letterSentCount}
            loading={loadingLetters}
            onCompose={() => setShowLetterCompose(true)}
            onOpenLetter={handleOpenLetter}
          />
        )}

        {/* ═══ Articles ═══════════════════════════ */}
        {activeTab === 'articles' && (
          <ArticlesSection />
        )}

        {/* ═══ Circle ═══════════════════════════ */}
        {activeTab === 'circle' && (
          <View style={st.circleSection}>
            <View style={st.circleHero}>
              <FireIcon size={48} color={Colors.accentGold} />
              <Text style={st.circleTitle}>The Fireplace Circle</Text>
              <Text style={st.circleSubtitle}>
                A small, time-limited space where 5-8 people gather around a shared theme for one week.
              </Text>
            </View>

            <View style={st.circleFeature}>
              <Text style={st.circleFeatureTitle}>How it works</Text>
              <Text style={st.circleFeatureBody}>
                Each circle has a theme — like "repair after conflict" or "learning to be vulnerable." You share openly and support each other, all anonymously.
              </Text>
            </View>

            <View style={st.circleFeature}>
              <Text style={st.circleFeatureTitle}>Safe by design</Text>
              <Text style={st.circleFeatureBody}>
                No DMs, no profiles. Just a group of people on a similar path, showing up for each other for one week.
              </Text>
            </View>

            <View style={st.circleFeature}>
              <Text style={st.circleFeatureTitle}>Opening soon</Text>
              <Text style={st.circleFeatureBody}>
                We're carefully designing this to feel warm and safe. The first circles will open once our community reaches enough members to match thoughtfully.
              </Text>
            </View>

            {/* Interest CTA */}
            <TouchableOpacity
              style={st.circleNotifyBtn}
              onPress={() => Alert.alert(
                'You\'re on the List',
                'We\'ll let you know as soon as the first Fireplace Circles are ready. Thank you for your interest.',
                [{ text: 'Looking Forward to It', style: 'default' }],
              )}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Get notified when Circle launches"
            >
              <FireIcon size={16} color={Colors.accentGold} />
              <Text style={st.circleNotifyText}>Notify Me When Circles Open</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <Animated.View style={[st.quickLinksWrapper, quickLinksAnimStyle]}>
        <QuickLinksBar currentScreen="community" />
      </Animated.View>

      {/* FAB (stories only) */}
      <FAB
        visible={showFab}
        onPress={() => setShowCompose(true)}
      />

      {/* Compose flow (stories) */}
      {alias && (
        <ComposeFlow
          visible={showCompose}
          alias={alias}
          onDismiss={() => setShowCompose(false)}
          onSubmit={handleSubmitStory}
          submitting={submitting}
        />
      )}

      {/* Letter compose flow */}
      {alias && (
        <LetterFlow
          visible={showLetterCompose}
          alias={alias}
          weeklyPrompt={weeklyPrompt}
          onDismiss={() => setShowLetterCompose(false)}
          onSubmit={handleSubmitLetter}
          submitting={letterSubmitting}
        />
      )}

      {/* Welcome modal (first visit) */}
      {alias && (
        <WelcomeModal
          visible={showWelcome}
          alias={alias}
          onDismiss={() => setShowWelcome(false)}
        />
      )}

      {/* FTUE Overlays */}
      <TooltipManager screen="community" />
      <WelcomeAudio screenKey="community" />
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  quickLinksWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.scrollPadBottom,
  },
  loader: {
    marginTop: Spacing.xxl,
  },

  // ─── Articles Teaser ──────────────────────
  articlesTeaserSection: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  articlesTeaserDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  articlesTeaserLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  articlesTeaserPre: {
    fontFamily: 'Jost_500Medium',
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    color: Colors.textMuted,
    textAlign: 'center' as const,
  },
  articlesTeaserTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center' as const,
    letterSpacing: 0.3,
  },
  articlesTeaserSub: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  articleTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderLeftWidth: 3,
  },
  articleTeaserIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  articleTeaserBody: {
    flex: 1,
    gap: 3,
  },
  articleTeaserTitle2: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  articleTeaserMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  articleTeaserBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  articleTeaserBadgeText: {
    fontFamily: 'Jost_500Medium',
    fontSize: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  articleTeaserTime: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 10,
    color: Colors.textMuted,
  },
  articlesTeaserCta: {
    alignItems: 'center' as const,
    paddingVertical: Spacing.md,
  },
  articlesTeaserCtaText: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ─── Circle Section ────────────────────────
  circleSection: {
    gap: Spacing.lg,
    paddingTop: Spacing.md,
  },
  circleHero: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.accentGold + '08',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.accentGold + '20',
  },
  circleTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  circleSubtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  circleFeature: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  circleFeatureTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  circleFeatureBody: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  circleNotifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.accentGold,
    backgroundColor: Colors.accentGold + '10',
  },
  circleNotifyText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.accentGold,
    letterSpacing: 0.5,
  },
});
