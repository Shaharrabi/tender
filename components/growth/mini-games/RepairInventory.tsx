/**
 * RepairInventory -- Step 8 "The Repair Inventory"
 *
 * A reflective checklist of repair strategies. The user rates each
 * strategy as "I do this", "I want to try this", or "This is hard
 * for me", producing a categorized repair toolkit summary.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import type { MiniGameComponentProps } from '../StepMiniGame';

const STRATEGIES = [
  'I take a break when things get too heated',
  'I use humor to lighten the tension',
  'I say "I\'m sorry" even when it\'s hard',
  'I reach out with physical touch during conflict',
  'I ask "Can we start over?"',
  'I acknowledge my partner\'s feelings before stating mine',
  'I take responsibility for my part',
  'I express appreciation after a difficult conversation',
  'I check in the next day about unresolved issues',
  'I name the cycle we\'re in instead of blaming',
];

type Rating = 'doThis' | 'wantToTry' | 'hardForMe';
type Phase = 'intro' | 'rating' | 'summary';

const RATING_OPTIONS: { key: Rating; label: string }[] = [
  { key: 'doThis', label: 'I do this' },
  { key: 'wantToTry', label: 'I want to try' },
  { key: 'hardForMe', label: 'Hard for me' },
];

function generateInsights(
  doThis: string[],
  wantToTry: string[],
  hardForMe: string[]
): string[] {
  const insights: string[] = [];

  if (doThis.length >= 5) {
    insights.push('You already have a strong repair toolkit -- this is a real strength');
  } else if (doThis.length >= 3) {
    insights.push('You have several repair strategies in your repertoire');
  } else if (doThis.length <= 1) {
    insights.push('Building repair skills is a journey -- you are at the beginning of something important');
  }

  if (wantToTry.length >= 3) {
    insights.push('Your openness to new repair strategies shows growth-mindedness');
  }

  if (hardForMe.length >= 4) {
    insights.push('Many repair strategies feel difficult -- this honesty is itself a form of repair');
  }

  // Specific insights based on content
  const allHard = hardForMe.join(' ').toLowerCase();
  const allDo = doThis.join(' ').toLowerCase();

  if (allHard.includes('sorry') || allHard.includes('responsibility')) {
    insights.push('Accountability in conflict is one of the hardest but most powerful repair tools');
  }
  if (allDo.includes('humor') || allDo.includes('touch')) {
    insights.push('You use warmth and connection as a bridge during difficult moments');
  }
  if (allHard.includes('break') || allHard.includes('heated')) {
    insights.push('Learning to pause during intensity is a skill worth developing');
  }
  if (allDo.includes('acknowledge') || allDo.includes('feelings')) {
    insights.push('Your ability to validate your partner is a cornerstone of secure connection');
  }

  if (insights.length === 0) {
    insights.push('Knowing your repair patterns is the first step toward strengthening them');
  }

  return insights.slice(0, 3);
}

export default function RepairInventory({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<number, Rating>>({});
  const scrollRef = useRef<ScrollView>(null);

  const handleRate = useCallback((index: number, rating: Rating) => {
    setRatings(prev => ({ ...prev, [index]: rating }));
  }, []);

  const handleNext = useCallback(() => {
    if (ratings[currentIndex] === undefined) return;
    if (currentIndex < STRATEGIES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setPhase('summary');
    }
  }, [currentIndex, ratings]);

  const handleComplete = useCallback(() => {
    const doThis: string[] = [];
    const wantToTry: string[] = [];
    const hardForMe: string[] = [];

    Object.entries(ratings).forEach(([i, rating]) => {
      const strategy = STRATEGIES[parseInt(i, 10)];
      if (rating === 'doThis') doThis.push(strategy);
      if (rating === 'wantToTry') wantToTry.push(strategy);
      if (rating === 'hardForMe') hardForMe.push(strategy);
    });

    const insights = generateInsights(doThis, wantToTry, hardForMe);

    onComplete({
      title: 'Your Repair Toolkit',
      insights,
      data: { doThis, wantToTry, hardForMe },
    });
  }, [ratings, onComplete]);

  // Categorize for summary
  const categorized = {
    doThis: [] as string[],
    wantToTry: [] as string[],
    hardForMe: [] as string[],
  };
  Object.entries(ratings).forEach(([i, rating]) => {
    categorized[rating].push(STRATEGIES[parseInt(i, 10)]);
  });

  // --- Intro ---
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Repair Inventory</Text>
          <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.introCard}>
            <View style={[styles.introAccent, { backgroundColor: phaseColor + '20' }]}>
              <Text style={[styles.introAccentSymbol, { color: phaseColor }]}>+</Text>
            </View>
            <Text style={styles.introHeading}>Your repair toolkit</Text>
            <Text style={styles.introBody}>
              Repair attempts are the secret weapon of healthy relationships.
              Let's take inventory of yours.
            </Text>
            <Text style={styles.introBodySecondary}>
              For each strategy, simply note whether it is something you already do,
              something you would like to try, or something that feels difficult.
              There is no judgment here.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(500)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('rating')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Begin Inventory</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // --- Rating ---
  if (phase === 'rating') {
    const currentRating = ratings[currentIndex];
    const hasRated = currentRating !== undefined;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Repair Inventory</Text>
          <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress bar */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressBarContainer}>
            <View style={styles.progressBarTrack}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: phaseColor,
                    width: `${((currentIndex + 1) / STRATEGIES.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressCounter}>
              {currentIndex + 1} / {STRATEGIES.length}
            </Text>
          </Animated.View>

          {/* Strategy card */}
          <Animated.View
            key={`strategy-${currentIndex}`}
            entering={FadeInDown.duration(500)}
            style={styles.strategyCard}
          >
            <Text style={styles.strategyNumber}>Strategy {currentIndex + 1}</Text>
            <Text style={styles.strategyText}>{STRATEGIES[currentIndex]}</Text>
          </Animated.View>

          {/* Rating buttons */}
          <Animated.View
            key={`rating-${currentIndex}`}
            entering={FadeInUp.duration(500).delay(200)}
            style={styles.ratingGroup}
          >
            {RATING_OPTIONS.map(({ key, label }) => {
              const selected = currentRating === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.ratingButton,
                    selected && {
                      backgroundColor: phaseColor + '15',
                      borderColor: phaseColor,
                    },
                  ]}
                  onPress={() => handleRate(currentIndex, key)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.ratingRadio,
                    selected && { borderColor: phaseColor },
                  ]}>
                    {selected && (
                      <View style={[styles.ratingRadioInner, { backgroundColor: phaseColor }]} />
                    )}
                  </View>
                  <Text style={[
                    styles.ratingLabel,
                    selected && { color: phaseColor },
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* Continue */}
          <Animated.View entering={FadeInUp.duration(400).delay(400)}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: phaseColor },
                !hasRated && styles.buttonDimmed,
              ]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>
                {currentIndex < STRATEGIES.length - 1 ? 'Next' : 'See your toolkit'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // --- Summary ---
  const insights = generateInsights(categorized.doThis, categorized.wantToTry, categorized.hardForMe);

  const SUMMARY_SECTIONS: { key: Rating; title: string; subtitle: string; accentMod: string }[] = [
    { key: 'doThis', title: 'Your Strengths', subtitle: 'Strategies you already use', accentMod: '' },
    { key: 'wantToTry', title: 'Growing', subtitle: 'Strategies you want to explore', accentMod: '80' },
    { key: 'hardForMe', title: 'Needs Attention', subtitle: 'Strategies that feel difficult', accentMod: '50' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Repair Inventory</Text>
        <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Your Repair Toolkit</Text>
          <Text style={styles.summarySubtitle}>
            {categorized.doThis.length} strong  --  {categorized.wantToTry.length} growing  --  {categorized.hardForMe.length} developing
          </Text>
        </Animated.View>

        {SUMMARY_SECTIONS.map(({ key, title, subtitle, accentMod }, sectionIdx) => {
          const items = categorized[key];
          if (items.length === 0) return null;

          return (
            <Animated.View
              key={key}
              entering={FadeInUp.duration(500).delay(200 + sectionIdx * 200)}
              style={styles.summarySection}
            >
              <View style={[styles.summarySectionHeader, { borderLeftColor: phaseColor + accentMod || phaseColor }]}>
                <Text style={styles.summarySectionTitle}>{title}</Text>
                <Text style={styles.summarySectionSubtitle}>{subtitle}</Text>
              </View>
              {items.map((item, i) => (
                <View key={i} style={styles.summaryItem}>
                  <View style={[
                    styles.summaryItemDot,
                    { backgroundColor: phaseColor + (accentMod || 'FF') },
                  ]} />
                  <Text style={styles.summaryItemText}>{item}</Text>
                </View>
              ))}
            </Animated.View>
          );
        })}

        {/* Insights */}
        <Animated.View entering={FadeInUp.duration(500).delay(900)} style={styles.insightsSection}>
          <Text style={styles.insightsHeading}>What we noticed</Text>
          {insights.map((insight, i) => (
            <View key={i} style={styles.insightRow}>
              <View style={[styles.insightDot, { backgroundColor: phaseColor }]} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(1200)}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: phaseColor }]}
            onPress={handleComplete}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Save to Journal</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.headingM,
    color: Colors.text,
  },
  skipText: {
    ...Typography.buttonSmall,
    color: Colors.textMuted,
  },

  // Scroll
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  // Intro
  introCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  introAccent: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  introAccentSymbol: {
    fontFamily: FontFamilies.accent,
    fontSize: 22,
  },
  introHeading: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  introBody: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 26,
  },
  introBodySecondary: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Primary button
  primaryButton: {
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    ...Shadows.subtle,
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  buttonDimmed: {
    opacity: 0.6,
  },

  // Progress bar
  progressBarContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressCounter: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'right',
  },

  // Strategy card
  strategyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  strategyNumber: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  strategyText: {
    fontFamily: FontFamilies.accent,
    fontSize: 19,
    lineHeight: 28,
    color: Colors.text,
  },

  // Rating group
  ratingGroup: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  ratingRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  ratingLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },

  // Summary
  summaryHeader: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  summaryTitle: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  summarySubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  summarySection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  summarySectionHeader: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    marginBottom: Spacing.md,
  },
  summarySectionTitle: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: 2,
  },
  summarySectionSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.md,
  },
  summaryItemDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 8,
  },
  summaryItemText: {
    ...Typography.bodySmall,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },

  // Insights
  insightsSection: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  insightsHeading: {
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
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
});
