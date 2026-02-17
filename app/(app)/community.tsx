/**
 * Community — Anonymous stories + curated resources.
 *
 * Two tabs:
 * 1. Stories — anonymous posts with "resonated" reactions, category filters
 * 2. Resources — curated articles (editorial content)
 *
 * Design principles:
 * - No usernames, no profiles, no DMs — fully anonymous
 * - "Resonated" (not "like") — validates shared experience
 * - Report button on every post
 * - AI safety pre-screen on new posts
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { getPosts, createPost, toggleResonated, reportPost } from '@/services/community';
import { checkSafety } from '@/utils/agent/safety-check';
import { sanitizeTextInput } from '@/utils/security/validation';
import type { CommunityPost, ContentItem, PostCategory, HealingPhase } from '@/types/community';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  ButtonSizes,
} from '@/constants/theme';
import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';
import {
  EyeIcon,
  HeartIcon,
  RefreshIcon,
  PuzzleIcon,
  SeedlingIcon,
  LinkIcon,
  ChatBubbleIcon,
  BrainIcon,
  ShieldIcon,
  CompassIcon,
  LeafIcon,
  HandshakeIcon,
  MasksIcon,
  LightningIcon,
  ChartBarIcon,
  SearchIcon,
  LightbulbIcon,
  ThoughtBubbleIcon,
  MailboxIcon,
  FlagIcon,
  WhiteHeartIcon,
  ArrowLeftIcon,
  PenIcon,
  SparkleIcon,
} from '@/assets/graphics/icons';

// ─── Constants ──────────────────────────────────────────

const CATEGORIES: string[] = [
  'All',
  'Attachment',
  'Communication',
  'Conflict',
  'Emotions',
  'Growth',
  'Values',
  'Intimacy',
];

const POST_CATEGORIES: PostCategory[] = [
  'Attachment',
  'Communication',
  'Conflict',
  'Emotions',
  'Growth',
  'Values',
  'Intimacy',
];

const HEALING_PHASES: { key: HealingPhase; label: string; Icon: ComponentType<IconProps> }[] = [
  { key: 'seeing', label: 'Seeing', Icon: EyeIcon },
  { key: 'feeling', label: 'Feeling', Icon: HeartIcon },
  { key: 'shifting', label: 'Shifting', Icon: RefreshIcon },
  { key: 'integrating', label: 'Integrating', Icon: PuzzleIcon },
  { key: 'sustaining', label: 'Sustaining', Icon: SeedlingIcon },
];

// ─── Curated Resources ──────────────────────────────────

interface CuratedResource extends Omit<ContentItem, 'icon'> {
  Icon: ComponentType<IconProps>;
  iconColor: string;
}

const CURATED_RESOURCES: CuratedResource[] = [
  {
    id: '1',
    title: '5 Signs of a Secure Relationship',
    category: 'Attachment',
    description: 'Secure relationships share recognizable patterns. Learn the key indicators that signal a healthy, stable bond between partners.',
    readTime: '6 min read',
    Icon: LinkIcon,
    iconColor: Colors.primary,
    source: 'The Gottman Institute',
  },
  {
    id: '2',
    title: 'The Soft Startup: How to Begin Difficult Conversations',
    category: 'Communication',
    description: 'The first three minutes of a conversation predict the outcome. Discover how a gentle approach changes everything.',
    readTime: '5 min read',
    Icon: ChatBubbleIcon,
    iconColor: Colors.primary,
    source: 'The Gottman Institute',
  },
  {
    id: '3',
    title: 'Understanding Your Window of Tolerance',
    category: 'Emotions',
    description: 'Your window of tolerance determines how well you handle stress. Learn to recognize when you are inside or outside your zone.',
    readTime: '7 min read',
    Icon: BrainIcon,
    iconColor: '#5B6B8A',
    source: 'Dr. Dan Siegel',
  },
  {
    id: '4',
    title: 'The Four Horsemen and How to Counter Them',
    category: 'Conflict',
    description: 'Criticism, contempt, defensiveness, and stonewalling predict relationship failure. Here are the antidotes that work.',
    readTime: '8 min read',
    Icon: ShieldIcon,
    iconColor: Colors.secondary,
    source: 'The Gottman Institute',
  },
  {
    id: '5',
    title: 'Values-Based Living in Relationships',
    category: 'Values',
    description: 'When partners align their daily actions with their deepest values, relationships become more meaningful and resilient.',
    readTime: '6 min read',
    Icon: CompassIcon,
    iconColor: '#8B6914',
    source: 'Dr. Russ Harris',
  },
  {
    id: '6',
    title: 'Why Vulnerability is Strength',
    category: 'Growth',
    description: 'Letting your guard down with your partner is not weakness. Research shows vulnerability is the birthplace of connection.',
    readTime: '5 min read',
    Icon: SeedlingIcon,
    iconColor: Colors.primary,
    source: 'Brene Brown',
  },
  {
    id: '7',
    title: 'The Difference Between Reacting and Responding',
    category: 'Emotions',
    description: 'Reactions are automatic; responses are chosen. Learn practical techniques to create space between stimulus and choice.',
    readTime: '4 min read',
    Icon: SparkleIcon,
    iconColor: Colors.calm,
    source: 'Dr. Viktor Frankl',
  },
  {
    id: '8',
    title: 'Turning Toward: Small Moments That Build Trust',
    category: 'Intimacy',
    description: 'Trust is built in the smallest of moments. Discover how everyday bids for connection strengthen your bond over time.',
    readTime: '5 min read',
    Icon: HandshakeIcon,
    iconColor: Colors.primary,
    source: 'The Gottman Institute',
  },
  {
    id: '9',
    title: 'IFS: Getting to Know Your Inner Parts',
    category: 'Growth',
    description: 'Internal Family Systems offers a compassionate way to understand the different parts of yourself that show up in relationships.',
    readTime: '7 min read',
    Icon: MasksIcon,
    iconColor: '#6BA3A0',
    source: 'Dr. Richard Schwartz',
  },
  {
    id: '10',
    title: 'When Conflict Triggers Your Nervous System',
    category: 'Conflict',
    description: 'Your body keeps the score during arguments. Learn to notice flooding and use co-regulation to return to connection.',
    readTime: '6 min read',
    Icon: LightningIcon,
    iconColor: Colors.accent,
    source: 'Dr. Stephen Porges',
  },
  {
    id: '11',
    title: 'The 5:1 Ratio in Happy Relationships',
    category: 'Communication',
    description: 'Stable relationships maintain five positive interactions for every negative one. Learn how to shift your ratio intentionally.',
    readTime: '4 min read',
    Icon: ChartBarIcon,
    iconColor: Colors.secondary,
    source: 'The Gottman Institute',
  },
  {
    id: '12',
    title: 'Differentiation: Being Close Without Losing Yourself',
    category: 'Growth',
    description: 'Healthy intimacy requires holding onto yourself while staying connected. Explore the balance of togetherness and autonomy.',
    readTime: '8 min read',
    Icon: LeafIcon,
    iconColor: Colors.primary,
    source: 'Dr. David Schnarch',
  },
];

// ─── Component ──────────────────────────────────────────

export default function CommunityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isGuest } = useGuest();

  // Tab state
  const [activeTab, setActiveTab] = useState<'stories' | 'resources'>('stories');
  const [activeCategory, setActiveCategory] = useState('All');

  // Stories state
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Compose modal
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [composeCategory, setComposeCategory] = useState<PostCategory>('Growth');
  const [submitting, setSubmitting] = useState(false);

  // ── Load posts ──────────────────────────────

  const loadPosts = useCallback(async () => {
    if (!user) return;
    setLoadingPosts(true);
    try {
      const data = await getPosts(user.id, {
        category: activeCategory !== 'All' ? activeCategory : undefined,
      });
      setPosts(data);
    } catch (e) {
      console.error('[Community] Failed to load posts:', e);
    } finally {
      setLoadingPosts(false);
    }
  }, [user, activeCategory]);

  useEffect(() => {
    if (activeTab === 'stories' && user) {
      loadPosts();
    }
  }, [activeTab, user, activeCategory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  // ── Submit story ────────────────────────────

  const handleSubmitStory = async () => {
    if (!user) return;

    const sanitized = sanitizeTextInput(composeText);
    if (!sanitized || sanitized.length < 10) {
      Alert.alert('Too Short', 'Please share a bit more \u2014 at least a sentence or two.');
      return;
    }
    if (sanitized.length > 1000) {
      Alert.alert('Too Long', 'Please keep your story under 1000 characters.');
      return;
    }

    // Safety pre-screen
    const safety = checkSafety(sanitized);
    if (!safety.safe && safety.category === 'self_harm') {
      Alert.alert(
        'We Care About You',
        'If you or someone you know is in crisis, please reach out:\n\n' +
          'National Suicide Prevention Lifeline: 988\n' +
          'Crisis Text Line: Text HOME to 741741\n\n' +
          'Your story was not posted, but help is available.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSubmitting(true);
    try {
      await createPost(user.id, sanitized, composeCategory);
      setComposeText('');
      setShowCompose(false);
      await loadPosts();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to share your story. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Toggle resonated ───────────────────────

  const handleResonated = async (postId: string) => {
    if (!user) return;
    try {
      const nowResonated = await toggleResonated(postId, user.id);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                hasResonated: nowResonated,
                resonatedCount: nowResonated
                  ? p.resonatedCount + 1
                  : Math.max(p.resonatedCount - 1, 0),
              }
            : p
        )
      );
    } catch (e) {
      console.error('[Community] Failed to toggle resonated:', e);
    }
  };

  // ── Report ─────────────────────────────────

  const handleReport = (postId: string) => {
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
  };

  // ── Time ago helper ────────────────────────

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  // ── Filter resources ───────────────────────

  const filteredResources: CuratedResource[] =
    activeCategory === 'All'
      ? CURATED_RESOURCES
      : CURATED_RESOURCES.filter((item) => item.category === activeCategory);

  // ── Render: Tab bar ────────────────────────

  const renderTabBar = () => (
    <View style={st.tabBar}>
      <TouchableOpacity
        style={[st.tab, activeTab === 'stories' && st.tabActive]}
        onPress={() => setActiveTab('stories')}
        activeOpacity={0.7}
      >
        <Text style={[st.tabText, activeTab === 'stories' && st.tabTextActive]}>
          Stories
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[st.tab, activeTab === 'resources' && st.tabActive]}
        onPress={() => setActiveTab('resources')}
        activeOpacity={0.7}
      >
        <Text style={[st.tabText, activeTab === 'resources' && st.tabTextActive]}>
          Resources
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ── Render: Category pills ─────────────────

  const renderCategoryPills = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={st.categoryRow}
      style={st.categoryScroll}
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <TouchableOpacity
            key={cat}
            style={[st.categoryPill, isActive && st.categoryPillActive]}
            onPress={() => setActiveCategory(cat)}
            activeOpacity={0.7}
          >
            <Text style={[st.categoryPillText, isActive && st.categoryPillTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  // ── Render: Post card ──────────────────────

  const renderPostCard = (post: CommunityPost) => (
    <View key={post.id} style={st.postCard}>
      {/* Category + phase badges */}
      <View style={st.postBadgeRow}>
        <View style={st.categoryBadge}>
          <Text style={st.categoryBadgeText}>{post.category}</Text>
        </View>
        {post.healingPhase && (
          <View style={st.phaseBadge}>
            <Text style={st.phaseBadgeText}>
              {HEALING_PHASES.find((h) => h.key === post.healingPhase)?.label ?? post.healingPhase}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <Text style={st.postContent}>{post.content}</Text>

      {/* Footer: resonated + time + report */}
      <View style={st.postFooter}>
        <TouchableOpacity
          style={[st.resonatedButton, post.hasResonated && st.resonatedButtonActive]}
          onPress={() => handleResonated(post.id)}
          activeOpacity={0.7}
        >
          <HeartIcon size={14} color={post.hasResonated ? Colors.primary : Colors.textMuted} />
          <Text style={[st.resonatedText, post.hasResonated && st.resonatedTextActive]}>
            {post.resonatedCount > 0 ? post.resonatedCount : ''} Resonated
          </Text>
        </TouchableOpacity>

        <Text style={st.postTime}>{timeAgo(post.createdAt)}</Text>

        <TouchableOpacity
          onPress={() => handleReport(post.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FlagIcon size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ── Render: Resource card ──────────────────

  const renderResourceCard = (item: CuratedResource) => (
    <TouchableOpacity
      key={item.id}
      style={st.contentCard}
      onPress={() =>
        Alert.alert('Coming Soon', 'Full articles coming soon in a future update.')
      }
      activeOpacity={0.7}
    >
      <View style={st.contentCardHeader}>
        <item.Icon size={24} color={item.iconColor} />
        <View style={st.categoryBadge}>
          <Text style={st.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>
      <Text style={st.contentCardTitle}>{item.title}</Text>
      <Text style={st.contentCardDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={st.contentCardFooter}>
        <Text style={st.contentCardMeta}>{item.readTime}</Text>
        <Text style={st.contentCardDot}>{'\u00B7'}</Text>
        <Text style={st.contentCardMeta}>{item.source}</Text>
      </View>
    </TouchableOpacity>
  );

  // ── Render: Compose modal ──────────────────

  const renderComposeModal = () => (
    <Modal visible={showCompose} animationType="slide" transparent>
      <View style={st.modalOverlay}>
        <View style={st.modalContent}>
          <View style={st.modalHeader}>
            <Text style={st.modalTitle}>Share Your Story</Text>
            <TouchableOpacity onPress={() => setShowCompose(false)}>
              <Text style={st.modalClose}>{'\u2715'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={st.modalHint}>
            Share anonymously. No one will know who wrote this {'\u2014'} just that someone else gets it.
          </Text>

          <TextInput
            style={st.composeInput}
            placeholder="What's alive in your relationship right now?"
            placeholderTextColor={Colors.textMuted}
            value={composeText}
            onChangeText={setComposeText}
            multiline
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={st.charCount}>{composeText.length}/1000</Text>

          {/* Category picker */}
          <Text style={st.pickerLabel}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={st.composeCategoryRow}
          >
            {POST_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  st.composeCategoryPill,
                  composeCategory === cat && st.composeCategoryPillActive,
                ]}
                onPress={() => setComposeCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    st.composeCategoryText,
                    composeCategory === cat && st.composeCategoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[st.submitButton, submitting && st.submitButtonDisabled]}
            onPress={handleSubmitStory}
            disabled={submitting || composeText.trim().length < 10}
            activeOpacity={0.7}
          >
            {submitting ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={st.submitButtonText}>Share Anonymously</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // ── Guest banner ───────────────────────────

  const renderGuestBanner = () => (
    <View style={st.guestBanner}>
      <Text style={st.guestBannerText}>
        Create an account to share your story and resonate with others.
      </Text>
      <TouchableOpacity
        onPress={() => router.replace('/(auth)/login' as any)}
        activeOpacity={0.7}
      >
        <Text style={st.guestBannerLink}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Main render ────────────────────────────

  return (
    <SafeAreaView style={st.container}>
      {/* Header */}
      <View style={st.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <ArrowLeftIcon size={16} color={Colors.primary} />
          <Text style={st.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={st.titleSection}>
        <Text style={st.pageTitle}>Community</Text>
        <Text style={st.pageSubtitle}>
          Anonymous stories and curated resources for your journey.
        </Text>
      </View>

      {/* Tab bar */}
      {renderTabBar()}

      {/* Category filter */}
      {renderCategoryPills()}

      <ScrollView
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          activeTab === 'stories' ? (
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          ) : undefined
        }
      >
        {/* ═══ Stories Tab ═══════════════════════ */}
        {activeTab === 'stories' && (
          <>
            {isGuest && !user && renderGuestBanner()}

            {loadingPosts && posts.length === 0 ? (
              <ActivityIndicator style={st.loader} color={Colors.primary} />
            ) : posts.length === 0 ? (
              <View style={st.emptyState}>
                <ThoughtBubbleIcon size={40} color={Colors.textMuted} />
                <Text style={st.emptyTitle}>No stories yet</Text>
                <Text style={st.emptyText}>
                  Be the first to share. Your experience might be exactly what someone
                  else needs to hear.
                </Text>
              </View>
            ) : (
              posts.map(renderPostCard)
            )}
          </>
        )}

        {/* ═══ Resources Tab ════════════════════ */}
        {activeTab === 'resources' && (
          <>
            <Text style={st.sectionLabel}>
              {activeCategory === 'All'
                ? 'ALL ARTICLES'
                : activeCategory.toUpperCase()}
            </Text>

            {filteredResources.length === 0 ? (
              <View style={st.emptyState}>
                <MailboxIcon size={40} color={Colors.textMuted} />
                <Text style={st.emptyText}>
                  No articles in this category yet. Check back soon!
                </Text>
              </View>
            ) : (
              filteredResources.map(renderResourceCard)
            )}

            {/* Request Content card */}
            <View style={st.requestCard}>
              <LightbulbIcon size={32} color={Colors.depth} />
              <Text style={st.requestTitle}>
                Have a topic you'd like us to cover?
              </Text>
              <Text style={st.requestSubtitle}>
                Let us know what relationship topics matter most to you.
              </Text>
              <TouchableOpacity
                style={st.requestButton}
                onPress={() =>
                  Alert.alert(
                    'Request Submitted',
                    'Thanks for your interest! We will consider your suggestion.',
                    [{ text: 'OK' }]
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={st.requestButtonText}>Request Content</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* Compose FAB (stories tab only, authenticated only) */}
      {activeTab === 'stories' && user && !isGuest && (
        <TouchableOpacity
          style={st.fab}
          onPress={() => setShowCompose(true)}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <PenIcon size={16} color={Colors.white} />
            <Text style={st.fabText}>Share</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Compose modal */}
      {renderComposeModal()}
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl },

  // Header
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, marginBottom: Spacing.sm },
  backText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  titleSection: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  pageTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  pageSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },

  // Category pills
  categoryScroll: {
    marginBottom: Spacing.md,
  },
  categoryRow: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    flexDirection: 'row',
  },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryPillText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryPillTextActive: {
    color: Colors.white,
  },

  // Section label
  sectionLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },

  // ── Post cards (Stories) ──────────────────
  postCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  postBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  phaseBadge: {
    backgroundColor: Colors.secondary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  phaseBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.3,
  },
  postContent: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  resonatedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surface,
  },
  resonatedButtonActive: {
    backgroundColor: Colors.secondary + '15',
  },
  resonatedIcon: {
    fontSize: 14,
  },
  resonatedText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  resonatedTextActive: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  postTime: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  reportText: {
    fontSize: 14,
    opacity: 0.5,
  },

  // ── Content cards (Resources) ─────────────
  contentCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  contentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentCardIcon: { fontSize: 24 },
  contentCardTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    lineHeight: 22,
  },
  contentCardDescription: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  contentCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  contentCardMeta: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  contentCardDot: {
    fontSize: 11,
    color: Colors.textMuted,
  },

  // ── Empty state ───────────────────────────
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 40 },
  emptyTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Guest banner ──────────────────────────
  guestBanner: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  guestBannerText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  guestBannerLink: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '700',
  },

  // ── Request content ───────────────────────
  requestCard: {
    backgroundColor: Colors.depth + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.depth + '20',
  },
  requestIcon: { fontSize: 32 },
  requestTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
  },
  requestSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  requestButton: {
    borderWidth: 1,
    borderColor: Colors.depth,
    height: ButtonSizes.small,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
  },
  requestButtonText: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.depth,
  },

  // ── FAB ───────────────────────────────────
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Shadows.elevated,
  },
  fabText: {
    color: Colors.white,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },

  // ── Compose modal ─────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  modalClose: {
    fontSize: FontSizes.headingM,
    color: Colors.textMuted,
    padding: Spacing.xs,
  },
  modalHint: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  composeInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    lineHeight: 22,
  },
  charCount: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  pickerLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  composeCategoryRow: {
    gap: Spacing.xs,
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  composeCategoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  composeCategoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  composeCategoryText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  composeCategoryTextActive: {
    color: Colors.white,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.medium,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

  // ── Loader ────────────────────────────────
  loader: {
    marginTop: Spacing.xxl,
  },
});
