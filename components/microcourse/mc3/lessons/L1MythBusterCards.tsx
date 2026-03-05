/**
 * L1: Myth Buster Cards — Flip-to-reveal True/False cards
 *
 * Five myth cards about conflict. User taps to flip and reveal
 * the research-backed truth. "69%" statistic gets a special reveal.
 * Ends with a reflection on content vs. pattern.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { MC3_PALETTE, MC3_TIMING } from '@/constants/mc3Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

type Phase = 'cards' | 'insight' | 'reflection';

interface L1MythBusterCardsProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

const CONFLICT_MYTHS = [
  {
    id: 'myth1',
    myth: "Happy couples don't fight.",
    truth: 'Happy and unhappy couples have roughly the same number of unsolvable problems. The difference is how they handle them.',
    source: 'Gottman, 1999',
  },
  {
    id: 'myth2',
    myth: "If you have to work at your relationship, it's not the right one.",
    truth: 'All lasting relationships require ongoing effort. The strongest couples are not conflict-free \u2014 they are repair-rich.',
    source: 'Gottman & Silver, 2015',
  },
  {
    id: 'myth3',
    myth: 'Good communication means resolving every disagreement.',
    truth: '69% of all relationship conflicts are perpetual \u2014 they never get resolved. Successful couples learn to dialogue about them, not solve them.',
    source: 'Gottman, 1999',
    isKeyInsight: true,
  },
  {
    id: 'myth4',
    myth: 'Conflict means your relationship is failing.',
    truth: 'Conflict itself is not the enemy. Contempt is. Conflict without repair is. But friction between two different people is not just normal \u2014 it is necessary.',
    source: 'Gottman & Levenson, 2000',
  },
  {
    id: 'myth5',
    myth: 'The content of the argument is what matters most.',
    truth: 'The PATTERN matters more than the CONTENT. Content changes, but your cycle \u2014 the dance between you when things go wrong \u2014 stays the same.',
    source: 'Johnson, 2008',
  },
];

export function L1MythBusterCards({ content, attachmentStyle, onComplete }: L1MythBusterCardsProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('cards');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [showKeyInsight, setShowKeyInsight] = useState(false);
  const [contentInput, setContentInput] = useState('');
  const [patternInput, setPatternInput] = useState('');

  // Card flip animation (0 = front, 1 = flipped)
  const flipAnim = useRef(new Animated.Value(0)).current;
  // Key insight stat animation
  const statScale = useRef(new Animated.Value(0)).current;
  const statOpacity = useRef(new Animated.Value(0)).current;
  // Fade for reflection
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentMyth = CONFLICT_MYTHS[currentIndex];

  const flipCard = useCallback(() => {
    if (flippedCards.has(currentMyth.id)) return;

    haptics.tap();

    // Animate flip
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: MC3_TIMING.cardFlip,
      useNativeDriver: true,
    }).start();

    // Mark as flipped
    const newFlipped = new Set(flippedCards);
    newFlipped.add(currentMyth.id);
    setFlippedCards(newFlipped);

    // Key insight special animation (69% stat)
    if (currentMyth.isKeyInsight) {
      setTimeout(() => {
        setShowKeyInsight(true);
        haptics.playConfetti();
        Animated.parallel([
          Animated.sequence([
            Animated.timing(statScale, { toValue: 1.3, duration: 400, useNativeDriver: true }),
            Animated.timing(statScale, { toValue: 1, duration: 200, useNativeDriver: true }),
          ]),
          Animated.timing(statOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]).start();
      }, 800);
    }
  }, [currentMyth, flippedCards, flipAnim, haptics, statScale, statOpacity]);

  const nextCard = useCallback(() => {
    if (currentIndex < CONFLICT_MYTHS.length - 1) {
      flipAnim.setValue(0); // Reset flip
      setShowKeyInsight(false);
      statScale.setValue(0);
      statOpacity.setValue(0);
      setCurrentIndex(currentIndex + 1);
      haptics.tap();
    } else {
      // All cards seen — move to reflection
      setPhase('reflection');
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [currentIndex, flipAnim, haptics, fadeAnim, statScale, statOpacity]);

  const handleFinish = useCallback(() => {
    haptics.playConfetti();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Myth Buster Cards',
        response: JSON.stringify({
          mythsBusted: flippedCards.size,
          allFlipped: flippedCards.size === CONFLICT_MYTHS.length,
        }),
        type: 'interactive',
      },
      {
        step: 2,
        prompt: 'Content vs. Pattern',
        response: JSON.stringify({
          content: contentInput.trim(),
          pattern: patternInput.trim(),
        }),
        type: 'reflection',
      },
    ];
    onComplete(responses);
  }, [flippedCards, contentInput, patternInput, haptics, onComplete]);

  // Flip interpolations
  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  // ─── Reflection Phase ──────────────────────────

  if (phase === 'reflection') {
    return (
      <Animated.View style={[styles.reflectionContainer, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.reflectionContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.reflectionTitle}>YOUR PATTERN</Text>
          <Text style={styles.reflectionBody}>
            Think about your last argument. Separate the CONTENT from the PATTERN.
          </Text>

          <Text style={styles.inputLabel}>We argued about:</Text>
          <TextInput
            style={styles.reflectionInput}
            placeholder="The content..."
            placeholderTextColor={MC3_PALETTE.coolSlate + '80'}
            value={contentInput}
            onChangeText={setContentInput}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.inputLabel}>The pattern was:</Text>
          <TextInput
            style={styles.reflectionInput}
            placeholder="When it started, I did ___ and they did ___..."
            placeholderTextColor={MC3_PALETTE.coolSlate + '80'}
            value={patternInput}
            onChangeText={setPatternInput}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.actionButton,
              (!contentInput.trim() || !patternInput.trim()) && styles.actionButtonDisabled,
            ]}
            onPress={handleFinish}
            disabled={!contentInput.trim() || !patternInput.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>COMPLETE</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Cards Phase ───────────────────────────────

  const isFlipped = flippedCards.has(currentMyth.id);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.cardsContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>MYTH OR TRUTH?</Text>
      <Text style={styles.subtitle}>
        Tap each card to discover what research actually says about conflict
      </Text>

      {/* Myths Busted Counter */}
      <View style={styles.counterRow}>
        <Text style={styles.counterLabel}>MYTHS BUSTED</Text>
        <View style={styles.counterBadge}>
          <Text style={styles.counterNumber}>
            {flippedCards.size}/{CONFLICT_MYTHS.length}
          </Text>
        </View>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        {/* Front — The Myth */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            {
              opacity: frontOpacity,
              transform: [{ perspective: 1000 }, { rotateY: frontRotateY }],
            },
          ]}
        >
          <Text style={styles.mythLabel}>MYTH</Text>
          <Text style={styles.mythText}>{'\u201C'}{currentMyth.myth}{'\u201D'}</Text>
          <Text style={styles.tapHint}>Tap to reveal the truth</Text>
        </Animated.View>

        {/* Back — The Truth */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              opacity: backOpacity,
              transform: [{ perspective: 1000 }, { rotateY: backRotateY }],
            },
          ]}
        >
          <Text style={styles.truthLabel}>ACTUALLY...</Text>
          <Text style={styles.truthText}>{currentMyth.truth}</Text>
          <Text style={styles.sourceText}>{'\u2014'} {currentMyth.source}</Text>

          {/* Key Insight: 69% Stat */}
          {showKeyInsight && currentMyth.isKeyInsight && (
            <Animated.View
              style={[
                styles.keyInsight,
                {
                  opacity: statOpacity,
                  transform: [{ scale: statScale }],
                },
              ]}
            >
              <Text style={styles.keyStatNumber}>69%</Text>
              <Text style={styles.keyStatLabel}>of conflicts are perpetual</Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {CONFLICT_MYTHS.map((myth, idx) => (
          <View
            key={myth.id}
            style={[
              styles.dot,
              idx === currentIndex && styles.dotActive,
              flippedCards.has(myth.id) && styles.dotFlipped,
            ]}
          />
        ))}
      </View>

      {/* Navigation */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={isFlipped ? nextCard : flipCard}
        activeOpacity={0.7}
      >
        <Text style={styles.actionButtonText}>
          {isFlipped
            ? currentIndex < CONFLICT_MYTHS.length - 1
              ? 'NEXT MYTH'
              : 'CONTINUE'
            : 'FLIP CARD'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  cardsContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  counterLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: Colors.textMuted,
  },
  counterBadge: {
    backgroundColor: MC3_PALETTE.amber,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterNumber: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: '#FFF',
  },

  // ─── Card ──────────────────────────
  cardContainer: {
    width: CARD_WIDTH,
    height: 280,
    marginTop: Spacing.lg,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.elevated,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: MC3_PALETTE.paper,
  },
  cardBack: {
    backgroundColor: MC3_PALETTE.softPeach,
  },
  mythLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: MC3_PALETTE.warningRed,
    marginBottom: Spacing.md,
  },
  mythText: {
    fontSize: FontSizes.body + 2,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 26,
    fontStyle: 'italic',
  },
  tapHint: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
    fontStyle: 'italic',
  },
  truthLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: MC3_PALETTE.repairGreen,
    marginBottom: Spacing.sm,
  },
  truthText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  sourceText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  keyInsight: {
    marginTop: Spacing.md,
    alignItems: 'center',
    backgroundColor: MC3_PALETTE.amber,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.pill,
  },
  keyStatNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
  },
  keyStatLabel: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
    letterSpacing: 1,
  },

  // ─── Dots ──────────────────────────
  dotsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  dotActive: {
    backgroundColor: MC3_PALETTE.amber,
    width: 20,
  },
  dotFlipped: {
    backgroundColor: MC3_PALETTE.repairGreen,
  },

  // ─── Action ────────────────────────
  actionButton: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 1,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },

  // ─── Reflection ────────────────────
  reflectionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  reflectionContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom,
  },
  reflectionTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 3,
    color: Colors.text,
    textAlign: 'center',
  },
  reflectionBody: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  reflectionInput: {
    backgroundColor: MC3_PALETTE.paper,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 80,
  },
});
