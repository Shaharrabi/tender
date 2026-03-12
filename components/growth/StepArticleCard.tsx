/**
 * StepArticleCard — Inline collapsible article reader for the step-detail Reflect tab.
 *
 * Collapsed: compact card with title, category badge, read time.
 * Expanded: full article body with pull quote and source attribution.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { ChevronDownIcon, ChevronUpIcon, SparkleIcon } from '@/assets/graphics/icons';
import type { Article } from '@/constants/articles';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface StepArticleCardProps {
  article: Article;
  phaseColor: string;
}

export function StepArticleCard({ article, phaseColor }: StepArticleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const IconComp = article.Icon;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={[styles.card, { borderLeftColor: article.accentColor }]}>
      {/* Header — always visible */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`Article: ${article.title}, ${expanded ? 'expanded' : 'tap to read'}`}
      >
        <View style={[styles.iconCircle, { backgroundColor: article.accentColor + '18' }]}>
          <IconComp size={16} color={article.accentColor} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={expanded ? undefined : 1}>{article.title}</Text>
          <View style={styles.meta}>
            <View style={[styles.categoryBadge, { backgroundColor: article.accentColor + '15' }]}>
              <Text style={[styles.categoryText, { color: article.accentColor }]}>{article.category}</Text>
            </View>
            <Text style={styles.readTime}>{article.readTime}</Text>
          </View>
        </View>
        {expanded ? (
          <ChevronUpIcon size={16} color={phaseColor} />
        ) : (
          <ChevronDownIcon size={16} color={phaseColor} />
        )}
      </TouchableOpacity>

      {/* Body — shown when expanded */}
      {expanded && (
        <View style={styles.body}>
          {/* Subtitle */}
          <Text style={styles.subtitle}>{article.subtitle}</Text>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: article.accentColor + '30' }]} />
            <SparkleIcon size={8} color={article.accentColor} />
            <View style={[styles.dividerLine, { backgroundColor: article.accentColor + '30' }]} />
          </View>

          {/* Paragraphs with pull quote after 2nd */}
          {article.paragraphs.map((paragraph, i) => (
            <View key={i}>
              <Text style={styles.paragraph}>{paragraph}</Text>
              {i === 1 && (
                <View style={[styles.pullQuoteBox, { borderLeftColor: article.accentColor }]}>
                  <Text style={[styles.pullQuoteText, { color: article.accentColor }]}>
                    {article.pullQuote}
                  </Text>
                </View>
              )}
            </View>
          ))}

          {/* Source attribution */}
          <View style={styles.source}>
            <View style={[styles.sourceLine, { backgroundColor: article.accentColor + '30' }]} />
            <Text style={styles.sourceLabel}>ROOTED IN</Text>
            <Text style={styles.sourceText}>{article.rootedIn}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderLeftWidth: 3,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    fontFamily: 'Jost_500Medium',
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  readTime: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 10,
    color: Colors.textMuted,
  },

  // Body
  body: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  subtitle: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  paragraph: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 15,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  pullQuoteBox: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
    marginVertical: Spacing.md,
    marginLeft: Spacing.xs,
  },
  pullQuoteText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  source: {
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
  },
  sourceLine: {
    width: 50,
    height: 1,
    marginBottom: Spacing.xs,
  },
  sourceLabel: {
    fontFamily: 'Jost_500Medium',
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  sourceText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    maxWidth: 360,
  },
});
