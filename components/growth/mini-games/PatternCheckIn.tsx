/**
 * PatternCheckIn -- Step 10 "Pattern Check-In"
 *
 * A self-assessment with tap-to-rate selectors (1-10) checking in on how
 * relational patterns have shifted since Step 1. Ends with a "Growth
 * Snapshot" bar chart and warm closing reflection.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows, Typography } from '@/constants/theme';
import type { MiniGameComponentProps } from '../StepMiniGame';

// ── Dimension Data ───────────────────────────────────────

interface Dimension {
  id: string;
  statement: string;
  shortLabel: string;
  description: string;
}

const DIMENSIONS: Dimension[] = [
  {
    id: 'pattern-awareness',
    statement: 'When conflict arises, I notice the pattern before reacting.',
    shortLabel: 'Awareness',
    description: 'Your ability to recognize the dance before you are swept into it.',
  },
  {
    id: 'emotional-naming',
    statement: 'I can name what I am feeling in the moment.',
    shortLabel: 'Naming',
    description: 'Putting words to feelings is one of the most powerful regulation tools you have.',
  },
  {
    id: 'reaching-toward',
    statement: 'I reach toward my partner rather than withdrawing.',
    shortLabel: 'Reaching',
    description: 'The courage to move closer when every instinct says to pull away.',
  },
  {
    id: 'perspective-holding',
    statement: 'I can hold my partner\'s perspective alongside my own.',
    shortLabel: 'Perspective',
    description: 'Seeing through two lenses at once -- your truth and theirs -- without losing either.',
  },
  {
    id: 'repair-trust',
    statement: 'I trust that repair is possible.',
    shortLabel: 'Repair Trust',
    description: 'The belief that rupture is not the end, but the beginning of something stronger.',
  },
];

// ── Component ────────────────────────────────────────────

type Phase = 'intro' | 'rating' | 'result';

export default function PatternCheckIn({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const currentDimension = DIMENSIONS[currentIndex];

  const handleRate = useCallback(
    (value: number) => {
      const dim = DIMENSIONS[currentIndex];
      setRatings((prev) => ({ ...prev, [dim.id]: value }));
    },
    [currentIndex],
  );

  const handleNext = useCallback(() => {
    if (currentIndex < DIMENSIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase('result');
    }
  }, [currentIndex]);

  const currentRating = currentDimension ? ratings[currentDimension.id] : undefined;

  // Compute results
  const results = useMemo(() => {
    const entries = DIMENSIONS.map((d) => ({
      dimension: d,
      rating: ratings[d.id] ?? 5,
    }));

    const total = entries.reduce((sum, e) => sum + e.rating, 0);
    const average = total / entries.length;

    const sorted = [...entries].sort((a, b) => b.rating - a.rating);
    const strongest = sorted[0];
    const growing = sorted[sorted.length - 1];

    return { entries, average, strongest, growing };
  }, [ratings]);

  const resultInsights = useMemo(() => {
    const { average, strongest, growing } = results;
    const insights: string[] = [];

    insights.push(
      `Your strongest area is ${strongest.dimension.shortLabel} -- this is a real foundation to build on.`
    );

    if (growing.rating < strongest.rating) {
      insights.push(
        `${growing.dimension.shortLabel} is still developing, and that is exactly how growth works -- unevenly, honestly, one dimension at a time.`
      );
    }

    if (average >= 7) {
      insights.push(
        'Your overall awareness is high. The work you have done is showing up in how you see yourself and your relationship.'
      );
    } else if (average >= 4) {
      insights.push(
        'You are in the middle of the work -- aware enough to see what is shifting, honest enough to name what has not. That takes courage.'
      );
    } else {
      insights.push(
        'Being honest about where you are is itself a profound act of growth. You are further along than these numbers suggest.'
      );
    }

    return insights;
  }, [results]);

  const handleFinish = useCallback(() => {
    const ratingData: Record<string, number> = {};
    DIMENSIONS.forEach((d) => {
      ratingData[d.id] = ratings[d.id] ?? 5;
    });

    onComplete({
      title: 'Growth Snapshot',
      insights: resultInsights,
      data: {
        ratings: ratingData,
        averageScore: Math.round(results.average * 10) / 10,
      },
    });
  }, [onComplete, resultInsights, ratings, results]);

  // ── Intro ──
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.introCard}>
            <Text style={[styles.introLabel, { color: phaseColor }]}>STEP 10</Text>
            <Text style={styles.introTitle}>Pattern Check-In</Text>
            <View style={styles.divider} />
            <Text style={styles.introBody}>
              You have come a long way since Step 1. This is a moment to pause and notice what has shifted
              -- not with judgment, but with honest curiosity.
            </Text>
            <Text style={styles.introBody}>
              You will rate yourself on {DIMENSIONS.length} dimensions of relational awareness.
              There are no right answers. Only your truth, right now.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('rating')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Begin"
            >
              <Text style={styles.primaryButtonText}>BEGIN</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ── Rating Phase ──
  if (phase === 'rating') {
    const dim = DIMENSIONS[currentIndex];

    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
            <Text style={[styles.progressText, { color: phaseColor }]}>
              {currentIndex + 1} of {DIMENSIONS.length}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: phaseColor,
                    width: `${((currentIndex + 1) / DIMENSIONS.length) * 100}%`,
                  },
                ]}
              />
            </View>
          </Animated.View>

          {/* Dimension Card */}
          <Animated.View
            key={dim.id}
            entering={FadeInDown.duration(500).delay(100)}
            style={styles.dimensionCard}
          >
            <Text style={styles.dimensionStatement}>{dim.statement}</Text>
            <View style={styles.dimensionDivider} />
            <Text style={styles.dimensionDescription}>{dim.description}</Text>
          </Animated.View>

          {/* Rating Selector */}
          <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.ratingSection}>
            <View style={styles.ratingScaleLabels}>
              <Text style={styles.ratingScaleLabel}>Rarely</Text>
              <Text style={styles.ratingScaleLabel}>Always</Text>
            </View>
            <View style={styles.ratingRow}>
              {Array.from({ length: 10 }, (_, i) => {
                const value = i + 1;
                const isSelected = currentRating === value;
                const isFilled = currentRating !== undefined && value <= currentRating;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.ratingDot,
                      isFilled && { backgroundColor: phaseColor + '30', borderColor: phaseColor },
                      isSelected && { backgroundColor: phaseColor, borderColor: phaseColor },
                    ]}
                    onPress={() => handleRate(value)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Rating ${value} of 10${isSelected ? ', selected' : ''}`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text
                      style={[
                        styles.ratingDotText,
                        isFilled && { color: phaseColor },
                        isSelected && { color: Colors.textOnPrimary },
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {currentRating !== undefined && (
              <Animated.View entering={FadeIn.duration(200)} style={styles.ratingDisplay}>
                <Text style={[styles.ratingDisplayNumber, { color: phaseColor }]}>
                  {currentRating}
                </Text>
                <Text style={styles.ratingDisplayLabel}>out of 10</Text>
              </Animated.View>
            )}
          </Animated.View>

          {/* Next Button */}
          {currentRating !== undefined && (
            <Animated.View entering={FadeInUp.duration(300).delay(100)}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: phaseColor }]}
                onPress={handleNext}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={currentIndex < DIMENSIONS.length - 1 ? 'Next' : 'See snapshot'}
              >
                <Text style={styles.primaryButtonText}>
                  {currentIndex < DIMENSIONS.length - 1 ? 'NEXT' : 'SEE SNAPSHOT'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ── Result Screen ──
  const { entries, average } = results;

  return (
    <View style={styles.container}>
      <Header onSkip={onSkip} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.resultLabelContainer}>
          <Text style={[styles.resultLabel, { color: phaseColor }]}>GROWTH SNAPSHOT</Text>
        </Animated.View>

        {/* Average Score */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.averageCard}>
          <Text style={styles.averageNumber}>
            {Math.round(average * 10) / 10}
          </Text>
          <Text style={styles.averageLabel}>average across all dimensions</Text>
        </Animated.View>

        {/* Bar Chart */}
        <Animated.View entering={FadeInUp.duration(500).delay(400)} style={styles.chartCard}>
          <Text style={styles.chartTitle}>Your Dimensions</Text>
          {entries.map((entry, i) => (
            <Animated.View
              key={entry.dimension.id}
              entering={FadeInUp.duration(400).delay(500 + i * 120)}
              style={styles.chartRow}
            >
              <Text style={styles.chartLabel}>{entry.dimension.shortLabel}</Text>
              <View style={styles.chartBarTrack}>
                <Animated.View
                  entering={FadeIn.duration(600).delay(700 + i * 120)}
                  style={[
                    styles.chartBarFill,
                    {
                      backgroundColor: phaseColor,
                      width: `${(entry.rating / 10) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.chartValue, { color: phaseColor }]}>{entry.rating}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Insights */}
        <Animated.View entering={FadeInUp.duration(500).delay(900)} style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>What We See</Text>
          {resultInsights.map((insight, i) => (
            <Animated.View
              key={i}
              entering={FadeInUp.duration(400).delay(1000 + i * 150)}
              style={styles.insightRow}
            >
              <View style={[styles.insightDot, { backgroundColor: phaseColor }]} />
              <Text style={styles.insightText}>{insight}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Closing */}
        <Animated.View entering={FadeInUp.duration(500).delay(1300)}>
          <Text style={styles.closingText}>
            Growth is not a straight line. It spirals. The fact that you are here, ten steps in,
            willing to look honestly at where you are -- that itself is the most important data point of all.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(1500)}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: phaseColor }]}
            onPress={handleFinish}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Continue"
          >
            <Text style={styles.primaryButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ── Header ───────────────────────────────────────────────

function Header({ onSkip }: { onSkip: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Pattern Check-In</Text>
      <TouchableOpacity onPress={onSkip} activeOpacity={0.7} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} accessibilityRole="button" accessibilityLabel="Skip exercise">
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.headingS,
    color: Colors.text,
  },
  skipText: {
    ...Typography.buttonSmall,
    color: Colors.textMuted,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  // Intro
  introCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  introLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  introTitle: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  introBody: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  progressText: {
    ...Typography.label,
    minWidth: 50,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.progressTrack,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Dimension Card
  dimensionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  dimensionStatement: {
    ...Typography.serifBody,
    color: Colors.text,
    lineHeight: 28,
    marginBottom: Spacing.md,
  },
  dimensionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  dimensionDescription: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  // Rating Selector
  ratingSection: {
    marginBottom: Spacing.xl,
  },
  ratingScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  ratingScaleLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  ratingDot: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: (SCREEN_WIDTH - Spacing.lg * 2 - 4 * 9) / 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  ratingDotText: {
    ...Typography.buttonSmall,
    color: Colors.textMuted,
    fontSize: 12,
  },
  ratingDisplay: {
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 2,
  },
  ratingDisplayNumber: {
    ...Typography.serifHeading,
    fontSize: 32,
  },
  ratingDisplayLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  // Result
  resultLabelContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultLabel: {
    ...Typography.label,
  },

  // Average
  averageCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  averageNumber: {
    ...Typography.serifScore,
    color: Colors.text,
  },
  averageLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },

  // Chart
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  chartTitle: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  chartLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    width: 80,
  },
  chartBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: Colors.progressTrack,
    borderRadius: 6,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 6,
    minWidth: 6,
  },
  chartValue: {
    ...Typography.headingS,
    width: 28,
    textAlign: 'right',
  },

  // Insights
  insightsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  insightsTitle: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  insightText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },

  // Closing
  closingText: {
    ...Typography.serifItalic,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },

  // Shared
  primaryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 180,
    ...Shadows.subtle,
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
});
