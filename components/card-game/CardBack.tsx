/**
 * CardBack — Back face of a Building Bridges game card
 *
 * Displays structured content: instructions, example, and discussion prompt.
 * Cream/linen background, Wes Anderson aesthetic with diamond dividers.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius, FontFamilies, FontSizes } from '@/constants/theme';
import type { GameCard } from '@/constants/card-game/cards';
import { getCategoryById, OPEN_HEART_DECK } from '@/constants/card-game/categories';

interface CardBackProps {
  card: GameCard;
  width?: number;
  height?: number;
}

export default function CardBack({ card, width = 300, height = 440 }: CardBackProps) {
  const isOpenHeart = card.deck === 'open-heart';
  const category = card.category ? getCategoryById(card.category) : undefined;
  const color = isOpenHeart ? OPEN_HEART_DECK.color : (category?.color ?? Colors.accent);

  return (
    <View style={[styles.card, { width, height }]}>
      {/* Top accent bar */}
      <View style={[styles.accentBar, { backgroundColor: color }]} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Card title */}
        <Text style={[styles.cardTitle, { color }]}>{card.title}</Text>
        <View style={[styles.titleDivider, { backgroundColor: color }]} />

        {/* Instructions section */}
        <Text style={styles.sectionLabel}>HOW TO PLAY</Text>
        <Text style={styles.instructions}>{card.backContent.instructions}</Text>

        {/* Diamond divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: Colors.borderLight }]} />
          <Text style={[styles.diamond, { color }]}>{'\u25C6'}</Text>
          <View style={[styles.dividerLine, { backgroundColor: Colors.borderLight }]} />
        </View>

        {/* Example section */}
        {card.backContent.example && (
          <>
            <Text style={styles.sectionLabel}>EXAMPLE</Text>
            <Text style={styles.example}>"{card.backContent.example}"</Text>
          </>
        )}

        {/* Discussion section */}
        <Text style={styles.sectionLabel}>DISCUSS</Text>
        <Text style={styles.discussion}>{card.backContent.discussionPrompt}</Text>

        {/* Time estimate */}
        {card.timeEstimate && (
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>{card.timeEstimate}</Text>
          </View>
        )}

        {/* Timer note */}
        {card.requiresTimer && (
          <View style={[styles.timerNote, { backgroundColor: color + '15' }]}>
            <Text style={[styles.timerText, { color }]}>
              This card includes a {Math.floor((card.timerDuration ?? 180) / 60)}-minute timer
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  accentBar: {
    height: 4,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  cardTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  titleDivider: {
    height: 1.5,
    marginBottom: Spacing.md,
    opacity: 0.4,
  },
  sectionLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  instructions: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: Spacing.xs,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  diamond: {
    fontSize: 8,
  },
  example: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  discussion: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  timeContainer: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  timeLabel: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  timerNote: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  timerText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    fontWeight: '500',
  },
});
