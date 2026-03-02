/**
 * ArticlesSection — Blog-style article reader for the Community screen.
 *
 * Beautiful magazine-style layout:
 * - Article list with colored accent cards
 * - Expandable full article reader
 * - Pull quotes, category badges, source attribution
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { ArrowLeftIcon, SparkleIcon } from '@/assets/graphics/icons';
import { ARTICLES } from '@/constants/articles';
import type { Article } from '@/constants/articles';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Article Card (list view) ───────────────────────────────

function ArticleCard({
  article,
  index,
  onPress,
}: {
  article: Article;
  index: number;
  onPress: () => void;
}) {
  const IconComp = article.Icon;

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: article.accentColor }]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Read article: ${article.title}`}
      >
        <View style={styles.cardTop}>
          <View style={[styles.cardIconBox, { backgroundColor: article.accentColor + '18' }]}>
            <IconComp size={20} color={article.accentColor} />
          </View>
          <View style={styles.cardMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: article.accentColor + '15' }]}>
              <Text style={[styles.categoryText, { color: article.accentColor }]}>{article.category}</Text>
            </View>
            <Text style={styles.cardReadTime}>{article.readTime}</Text>
          </View>
        </View>

        <Text style={styles.cardNumber}>{article.number}</Text>
        <Text style={styles.cardTitle}>{article.title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={2}>{article.subtitle}</Text>

        <View style={styles.cardFooter}>
          <Text style={[styles.readMore, { color: article.accentColor }]}>Read article</Text>
          <View style={[styles.readMoreArrow, { backgroundColor: article.accentColor }]}>
            <Text style={styles.readMoreArrowText}>{'\u2192'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Article Reader (full article view) ─────────────────────

function ArticleReader({
  article,
  onBack,
}: {
  article: Article;
  onBack: () => void;
}) {
  const IconComp = article.Icon;
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.readerContainer}>
      {/* Back button */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.readerHeader}>
        <TouchableOpacity style={styles.readerBackBtn} onPress={onBack} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Back to articles">
          <ArrowLeftIcon size={16} color={Colors.primary} />
          <Text style={styles.readerBackText}>Back to articles</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.readerScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.readerHero}>
          <View style={[styles.readerIconCircle, { backgroundColor: article.accentColor + '18' }]}>
            <IconComp size={32} color={article.accentColor} />
          </View>
          <View style={[styles.readerCategoryBadge, { backgroundColor: article.accentColor + '15' }]}>
            <Text style={[styles.readerCategoryText, { color: article.accentColor }]}>{article.category}</Text>
          </View>
          <Text style={styles.readerNumber}>{article.number}</Text>
          <Text style={styles.readerTitle}>{article.title}</Text>
          <Text style={styles.readerSubtitle}>{article.subtitle}</Text>
          <Text style={styles.readerReadTime}>{article.readTime}</Text>
        </Animated.View>

        {/* Divider */}
        <View style={styles.readerDivider}>
          <View style={[styles.readerDividerLine, { backgroundColor: article.accentColor + '30' }]} />
          <SparkleIcon size={10} color={article.accentColor} />
          <View style={[styles.readerDividerLine, { backgroundColor: article.accentColor + '30' }]} />
        </View>

        {/* Body paragraphs with pull quote */}
        {article.paragraphs.map((paragraph, i) => {
          // Insert pull quote after 2nd paragraph
          const showQuoteAfter = i === 1;

          return (
            <Animated.View key={i} entering={FadeInDown.delay(200 + i * 100).duration(500)}>
              <Text style={styles.readerParagraph}>{paragraph}</Text>

              {showQuoteAfter && (
                <View style={[styles.pullQuoteBox, { borderLeftColor: article.accentColor }]}>
                  <Text style={[styles.pullQuoteText, { color: article.accentColor }]}>
                    {article.pullQuote}
                  </Text>
                </View>
              )}
            </Animated.View>
          );
        })}

        {/* Source attribution */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.readerSource}>
          <View style={[styles.readerSourceLine, { backgroundColor: article.accentColor + '30' }]} />
          <Text style={styles.readerSourceLabel}>Rooted in</Text>
          <Text style={styles.readerSourceText}>{article.rootedIn}</Text>
        </Animated.View>

        {/* Bottom spacer */}
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

// ─── Main Export ─────────────────────────────────────────────

export function ArticlesSection() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleOpenArticle = useCallback((article: Article) => {
    setSelectedArticle(article);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  if (selectedArticle) {
    return <ArticleReader article={selectedArticle} onBack={handleBack} />;
  }

  return (
    <View>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(600)} style={styles.listHeader}>
        <Text style={styles.listHeaderPre}>Tender</Text>
        <Text style={styles.listHeaderTitle}>The Science of Relationships</Text>
        <Text style={styles.listHeaderSub}>
          10 articles on what actually makes love work.{'\n'}
          Evidence-based. Honest. Human.
        </Text>
      </Animated.View>

      {/* Article cards */}
      <View style={styles.cardList}>
        {ARTICLES.map((article, i) => (
          <ArticleCard
            key={article.id}
            article={article}
            index={i}
            onPress={() => handleOpenArticle(article)}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── List view ──────────────────────────
  listHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  listHeaderPre: {
    fontFamily: 'Jost_500Medium',
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  listHeaderTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  listHeaderSub: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: Spacing.xs,
  },

  // ── Cards ──────────────────────────────
  cardList: {
    gap: Spacing.md,
    paddingTop: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderLeftWidth: 4,
    ...Shadows.subtle,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontFamily: 'Jost_500Medium',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardReadTime: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
  cardNumber: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 32,
    color: Colors.borderLight,
    lineHeight: 36,
  },
  cardTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  readMore: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  readMoreArrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readMoreArrowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Reader ─────────────────────────────
  readerContainer: {
    flex: 1,
  },
  readerHeader: {
    paddingBottom: Spacing.sm,
  },
  readerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.xs,
  },
  readerBackText: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  readerScroll: {
    paddingBottom: Spacing.xxxl,
  },
  readerHero: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  readerIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  readerCategoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
  },
  readerCategoryText: {
    fontFamily: 'Jost_500Medium',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  readerNumber: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 48,
    color: Colors.borderLight,
    lineHeight: 52,
  },
  readerTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 26,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: 0.3,
    paddingHorizontal: Spacing.sm,
  },
  readerSubtitle: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 480,
  },
  readerReadTime: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: Spacing.xs,
  },

  // ── Divider ────────────────────────────
  readerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  readerDividerLine: {
    flex: 1,
    height: 1,
  },

  // ── Body ───────────────────────────────
  readerParagraph: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 16,
    color: Colors.text,
    lineHeight: 28,
    marginBottom: Spacing.lg,
  },

  // ── Pull quote ─────────────────────────
  pullQuoteBox: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.lg,
    paddingVertical: Spacing.md,
    marginVertical: Spacing.lg,
    marginLeft: Spacing.sm,
  },
  pullQuoteText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 28,
  },

  // ── Source ─────────────────────────────
  readerSource: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  readerSourceLine: {
    width: 60,
    height: 1,
    marginBottom: Spacing.sm,
  },
  readerSourceLabel: {
    fontFamily: 'Jost_500Medium',
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  readerSourceText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    maxWidth: 400,
  },
});
