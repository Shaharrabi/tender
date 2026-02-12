/**
 * Community & Resources — Curated content feed
 *
 * Surfaces relationship advice, articles, and resources.
 * All content is editorially curated, not user-generated.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  ButtonSizes,
} from '@/constants/theme';

// ─── Types ──────────────────────────────────────────────

interface ContentItem {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  icon: string;
  source: string;
}

// ─── Categories ─────────────────────────────────────────

const CATEGORIES = [
  'All',
  'Attachment',
  'Communication',
  'Conflict',
  'Emotions',
  'Growth',
  'Values',
  'Intimacy',
];

// ─── Curated Content ────────────────────────────────────

const CONTENT_ITEMS: ContentItem[] = [
  {
    id: '1',
    title: '5 Signs of a Secure Relationship',
    category: 'Attachment',
    description:
      'Secure relationships share recognizable patterns. Learn the key indicators that signal a healthy, stable bond between partners.',
    readTime: '6 min read',
    icon: '🔗',
    source: 'The Gottman Institute',
  },
  {
    id: '2',
    title: 'The Soft Startup: How to Begin Difficult Conversations',
    category: 'Communication',
    description:
      'The first three minutes of a conversation predict the outcome. Discover how a gentle approach changes everything.',
    readTime: '5 min read',
    icon: '💬',
    source: 'The Gottman Institute',
  },
  {
    id: '3',
    title: 'Understanding Your Window of Tolerance',
    category: 'Emotions',
    description:
      'Your window of tolerance determines how well you handle stress. Learn to recognize when you are inside or outside your zone.',
    readTime: '7 min read',
    icon: '🧠',
    source: 'Dr. Dan Siegel',
  },
  {
    id: '4',
    title: 'The Four Horsemen and How to Counter Them',
    category: 'Conflict',
    description:
      'Criticism, contempt, defensiveness, and stonewalling predict relationship failure. Here are the antidotes that work.',
    readTime: '8 min read',
    icon: '🛡️',
    source: 'The Gottman Institute',
  },
  {
    id: '5',
    title: 'Values-Based Living in Relationships',
    category: 'Values',
    description:
      'When partners align their daily actions with their deepest values, relationships become more meaningful and resilient.',
    readTime: '6 min read',
    icon: '🧭',
    source: 'Dr. Russ Harris',
  },
  {
    id: '6',
    title: 'Why Vulnerability is Strength',
    category: 'Growth',
    description:
      'Letting your guard down with your partner is not weakness. Research shows vulnerability is the birthplace of connection.',
    readTime: '5 min read',
    icon: '🌱',
    source: 'Brene Brown',
  },
  {
    id: '7',
    title: 'The Difference Between Reacting and Responding',
    category: 'Emotions',
    description:
      'Reactions are automatic; responses are chosen. Learn practical techniques to create space between stimulus and choice.',
    readTime: '4 min read',
    icon: '⏸️',
    source: 'Dr. Viktor Frankl',
  },
  {
    id: '8',
    title: 'Turning Toward: Small Moments That Build Trust',
    category: 'Intimacy',
    description:
      'Trust is built in the smallest of moments. Discover how everyday bids for connection strengthen your bond over time.',
    readTime: '5 min read',
    icon: '🤝',
    source: 'The Gottman Institute',
  },
  {
    id: '9',
    title: 'IFS: Getting to Know Your Inner Parts',
    category: 'Growth',
    description:
      'Internal Family Systems offers a compassionate way to understand the different parts of yourself that show up in relationships.',
    readTime: '7 min read',
    icon: '🎭',
    source: 'Dr. Richard Schwartz',
  },
  {
    id: '10',
    title: 'When Conflict Triggers Your Nervous System',
    category: 'Conflict',
    description:
      'Your body keeps the score during arguments. Learn to notice flooding and use co-regulation to return to connection.',
    readTime: '6 min read',
    icon: '⚡',
    source: 'Dr. Stephen Porges',
  },
  {
    id: '11',
    title: 'The 5:1 Ratio in Happy Relationships',
    category: 'Communication',
    description:
      'Stable relationships maintain five positive interactions for every negative one. Learn how to shift your ratio intentionally.',
    readTime: '4 min read',
    icon: '📊',
    source: 'The Gottman Institute',
  },
  {
    id: '12',
    title: 'Differentiation: Being Close Without Losing Yourself',
    category: 'Growth',
    description:
      'Healthy intimacy requires holding onto yourself while staying connected. Explore the balance of togetherness and autonomy.',
    readTime: '8 min read',
    icon: '🌿',
    source: 'Dr. David Schnarch',
  },
];

// ─── Component ──────────────────────────────────────────

export default function CommunityScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems =
    activeCategory === 'All'
      ? CONTENT_ITEMS
      : CONTENT_ITEMS.filter((item) => item.category === activeCategory);

  const handleArticlePress = useCallback(() => {
    Alert.alert(
      'Coming Soon',
      'Full articles coming soon in a future update.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleRequestContent = useCallback(() => {
    Alert.alert(
      'Request Submitted',
      'Thanks for your interest! We will consider your suggestion for future content.',
      [{ text: 'OK' }]
    );
  }, []);

  // ── Render helpers ──────────────────────────

  const renderCategoryPill = (category: string) => {
    const isActive = activeCategory === category;
    return (
      <TouchableOpacity
        key={category}
        style={[s.categoryPill, isActive && s.categoryPillActive]}
        onPress={() => setActiveCategory(category)}
        activeOpacity={0.7}
      >
        <Text style={[s.categoryPillText, isActive && s.categoryPillTextActive]}>
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderContentCard = (item: ContentItem) => (
    <TouchableOpacity
      key={item.id}
      style={s.contentCard}
      onPress={handleArticlePress}
      activeOpacity={0.7}
    >
      <View style={s.contentCardHeader}>
        <Text style={s.contentCardIcon}>{item.icon}</Text>
        <View style={s.contentCardMeta}>
          <View style={s.categoryBadge}>
            <Text style={s.categoryBadgeText}>{item.category}</Text>
          </View>
        </View>
      </View>
      <Text style={s.contentCardTitle}>{item.title}</Text>
      <Text style={s.contentCardDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={s.contentCardFooter}>
        <Text style={s.contentCardReadTime}>{item.readTime}</Text>
        <Text style={s.contentCardDot}>{'·'}</Text>
        <Text style={s.contentCardSource}>{item.source}</Text>
      </View>
    </TouchableOpacity>
  );

  // ── Main render ─────────────────────────────

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────── */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={s.backText}>{'←'} Back</Text>
          </TouchableOpacity>
        </View>

        <View style={s.titleSection}>
          <Text style={s.pageTitle}>Community & Resources</Text>
          <Text style={s.pageSubtitle}>
            Curated articles and insights to support your relationship journey.
          </Text>
        </View>

        {/* ── Featured Article ────────────── */}
        <TouchableOpacity
          style={s.featuredCard}
          onPress={handleArticlePress}
          activeOpacity={0.8}
        >
          <View style={s.featuredBadge}>
            <Text style={s.featuredBadgeText}>Attachment</Text>
          </View>
          <Text style={s.featuredIcon}>{'📖'}</Text>
          <Text style={s.featuredTitle}>Understanding Your Attachment Style</Text>
          <Text style={s.featuredDescription}>
            Your attachment style shapes how you connect, communicate, and handle
            conflict. Discover the patterns that influence your closest relationships.
          </Text>
          <View style={s.featuredFooter}>
            <Text style={s.featuredReadTime}>10 min read</Text>
            <Text style={s.featuredDot}>{'·'}</Text>
            <Text style={s.featuredSource}>Dr. Sue Johnson</Text>
          </View>
          <View style={s.featuredCTA}>
            <Text style={s.featuredCTAText}>Read Article {'→'}</Text>
          </View>
        </TouchableOpacity>

        {/* ── Category Filter ────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.categoryRow}
          style={s.categoryScroll}
        >
          {CATEGORIES.map(renderCategoryPill)}
        </ScrollView>

        {/* ── Content List ───────────────── */}
        <Text style={s.sectionLabel}>
          {activeCategory === 'All' ? 'ALL ARTICLES' : activeCategory.toUpperCase()}
        </Text>

        {filteredItems.length === 0 ? (
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>{'📭'}</Text>
            <Text style={s.emptyText}>
              No articles in this category yet. Check back soon!
            </Text>
          </View>
        ) : (
          filteredItems.map(renderContentCard)
        )}

        {/* ── Request Content ────────────── */}
        <View style={s.requestCard}>
          <Text style={s.requestIcon}>{'💡'}</Text>
          <Text style={s.requestTitle}>Have a topic you'd like us to cover?</Text>
          <Text style={s.requestSubtitle}>
            Let us know what relationship topics matter most to you. We curate new
            content regularly based on community interest.
          </Text>
          <TouchableOpacity
            style={s.requestButton}
            onPress={handleRequestContent}
            activeOpacity={0.7}
          >
            <Text style={s.requestButtonText}>Request Content</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },

  // Header
  header: { marginBottom: Spacing.lg },
  backText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },

  titleSection: {
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
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

  // Featured article
  featuredCard: {
    backgroundColor: Colors.secondary + '12',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.secondary + '25',
    ...Shadows.elevated,
  },
  featuredBadge: {
    backgroundColor: Colors.secondary + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
  },
  featuredBadgeText: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.5,
  },
  featuredIcon: { fontSize: 36, marginTop: Spacing.xs },
  featuredTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  featuredDescription: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  featuredReadTime: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  featuredDot: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  featuredSource: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  featuredCTA: {
    backgroundColor: Colors.secondary,
    height: ButtonSizes.small,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  featuredCTAText: {
    color: Colors.white,
    fontSize: FontSizes.caption,
    fontWeight: '700',
  },

  // Category pills
  categoryScroll: {
    marginBottom: Spacing.md,
    marginHorizontal: -Spacing.xl,
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

  // Content cards
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
  contentCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
  contentCardReadTime: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  contentCardDot: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  contentCardSource: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 36 },
  emptyText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Request content
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
});
