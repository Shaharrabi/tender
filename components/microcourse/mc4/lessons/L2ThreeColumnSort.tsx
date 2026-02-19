/**
 * L2: Three Column Sort — Tap-to-sort card game
 *
 * Users sort 10 relationship behaviors into three columns:
 * Enmeshment (Fusion), Healthy Connection, and Disconnection (Distance).
 * Tracks first-try accuracy and provides corrective feedback.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC4_PALETTE } from '@/constants/mc4Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'sorting' | 'results';
type ColumnKey = 'enmeshment' | 'connection' | 'distance';

interface BehaviorCard {
  id: number;
  text: string;
  correct: ColumnKey;
  explanation: string;
}

interface SortedEntry {
  cardId: number;
  userChoice: ColumnKey;
  correct: ColumnKey;
  firstTry: boolean;
}

interface L2ThreeColumnSortProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

const BEHAVIOR_CARDS: BehaviorCard[] = [
  { id: 1, text: "Checking your partner\u2019s phone without asking", correct: 'enmeshment', explanation: "This crosses a privacy boundary \u2014 it\u2019s fusion, not connection." },
  { id: 2, text: "Sharing how your day went over dinner", correct: 'connection', explanation: "Sharing daily experiences builds healthy connection." },
  { id: 3, text: "Never talking about what bothers you", correct: 'distance', explanation: "Withholding feelings creates emotional distance." },
  { id: 4, text: "Making all decisions together, even small ones", correct: 'enmeshment', explanation: "Needing approval for everything suggests enmeshment." },
  { id: 5, text: "Having separate hobbies and time with friends", correct: 'connection', explanation: "Healthy connection includes maintaining individuality." },
  { id: 6, text: "Walking away during arguments without returning", correct: 'distance', explanation: "Stonewalling creates harmful disconnection." },
  { id: 7, text: "Finishing your partner\u2019s sentences constantly", correct: 'enmeshment', explanation: "Assuming you know their thoughts blurs boundaries." },
  { id: 8, text: "Expressing a need even when it might cause discomfort", correct: 'connection', explanation: "Voicing needs respectfully is healthy differentiation." },
  { id: 9, text: "Keeping a major life change secret", correct: 'distance', explanation: "Hiding significant events creates unhealthy distance." },
  { id: 10, text: "Asking about your partner\u2019s boundaries before acting", correct: 'connection', explanation: "Respecting boundaries strengthens connection." },
];

const COLUMNS: { key: ColumnKey; label: string; color: string }[] = [
  { key: 'enmeshment', label: 'Enmeshment', color: MC4_PALETTE.porousRose },
  { key: 'connection', label: 'Connection', color: MC4_PALETTE.teal },
  { key: 'distance', label: 'Distance', color: MC4_PALETTE.rigidBlue },
];

export function L2ThreeColumnSort({ content, attachmentStyle, onComplete }: L2ThreeColumnSortProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sorted, setSorted] = useState<SortedEntry[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<ColumnKey | null>(null);
  const [correctFlash, setCorrectFlash] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Shuffle cards once on mount
  const [shuffledCards] = useState(() =>
    [...BEHAVIOR_CARDS].sort(() => Math.random() - 0.5)
  );

  const currentCard = shuffledCards[currentIndex];
  const correctOnFirstTry = sorted.filter(s => s.firstTry).length;
  const alreadyTriedWrong = useRef(false);

  const shakeCard = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const advanceCard = useCallback(() => {
    setShowExplanation(false);
    setWrongChoice(null);
    setCorrectFlash(false);
    alreadyTriedWrong.current = false;

    if (currentIndex + 1 >= shuffledCards.length) {
      setPhase('results');
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, shuffledCards.length, fadeAnim]);

  const handleColumnTap = useCallback((column: ColumnKey) => {
    if (showExplanation) return; // locked during explanation

    const isCorrect = currentCard.correct === column;

    if (isCorrect) {
      haptics.playConfetti();
      setCorrectFlash(true);
      const entry: SortedEntry = {
        cardId: currentCard.id,
        userChoice: column,
        correct: currentCard.correct,
        firstTry: !alreadyTriedWrong.current,
      };
      setSorted(prev => [...prev, entry]);
      setTimeout(advanceCard, 600);
    } else {
      haptics.tap();
      shakeCard();
      alreadyTriedWrong.current = true;
      setWrongChoice(column);
      setShowExplanation(true);

      // Auto-move to correct column after 1.5s
      setTimeout(() => {
        const entry: SortedEntry = {
          cardId: currentCard.id,
          userChoice: column,
          correct: currentCard.correct,
          firstTry: false,
        };
        setSorted(prev => [...prev, entry]);
        advanceCard();
      }, 1500);
    }
  }, [currentCard, showExplanation, haptics, shakeCard, advanceCard]);

  const handleFinish = useCallback(() => {
    haptics.playConfetti();
    const firstTryCount = sorted.filter(s => s.firstTry).length;
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Three Column Sort',
      response: JSON.stringify({
        sorted: sorted.map(s => ({
          cardId: s.cardId,
          userChoice: s.userChoice,
          correct: s.correct,
          firstTry: s.firstTry,
        })),
        firstTryAccuracy: firstTryCount / 10,
        score: `${firstTryCount}/10`,
      }),
      type: 'interactive',
    }];
    onComplete(responses);
  }, [sorted, haptics, onComplete]);

  // ─── Intro Phase ───────────────────────────────

  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.introContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>BOUNDARIES IN ACTION</Text>
        <Text style={styles.subtitle}>
          Every relationship behavior lands somewhere on the spectrum between
          too close, just right, and too far.
        </Text>
        <Text style={styles.body}>
          Sort each behavior into one of three columns: Enmeshment (too fused),
          Connection (healthy), or Distance (too withdrawn).
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => { haptics.tap(); setPhase('sorting'); }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>START SORTING</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Results Phase ─────────────────────────────

  if (phase === 'results') {
    const firstTryCount = sorted.filter(s => s.firstTry).length;
    const pct = Math.round((firstTryCount / 10) * 100);
    return (
      <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>SORTING COMPLETE</Text>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreNumber}>{firstTryCount}/10</Text>
            <Text style={styles.scoreLabel}>correct on first try</Text>
          </View>
          <Text style={styles.scoreMessage}>
            {pct >= 80
              ? 'Excellent boundary awareness! You can clearly distinguish fusion from healthy connection.'
              : pct >= 50
                ? 'Good instincts. Some boundaries can be tricky \u2014 the nuance is what matters.'
                : 'Boundaries are nuanced. This practice helps build awareness over time.'}
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFinish}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Sorting Phase ─────────────────────────────

  const correctCol = COLUMNS.find(c => c.key === currentCard.correct);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.sortingContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.progress}>
        Card {currentIndex + 1} of {shuffledCards.length}
      </Text>

      {/* Current behavior card */}
      <Animated.View
        style={[
          styles.behaviorCard,
          correctFlash && { borderLeftColor: MC4_PALETTE.successGreen },
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <Text style={styles.behaviorText}>{currentCard.text}</Text>
      </Animated.View>

      {/* Explanation tooltip (wrong answer) */}
      {showExplanation && (
        <View style={[styles.explanationBox, { borderLeftColor: correctCol?.color }]}>
          <Text style={styles.explanationLabel}>
            {'\u2192'} {correctCol?.label}
          </Text>
          <Text style={styles.explanationText}>{currentCard.explanation}</Text>
        </View>
      )}

      {/* Column buttons */}
      <Text style={styles.sortLabel}>SORT INTO</Text>
      <View style={styles.columnsRow}>
        {COLUMNS.map(col => {
          const isWrong = wrongChoice === col.key;
          const isCorrectCol = correctFlash && col.key === currentCard.correct;
          return (
            <TouchableOpacity
              key={col.key}
              style={[
                styles.columnButton,
                { borderColor: col.color },
                isCorrectCol && { backgroundColor: col.color },
                isWrong && styles.columnButtonWrong,
              ]}
              onPress={() => handleColumnTap(col.key)}
              disabled={showExplanation || correctFlash}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.columnButtonText,
                  { color: col.color },
                  isCorrectCol && { color: '#FFF' },
                  isWrong && { color: Colors.textMuted },
                ]}
              >
                {col.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  introContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
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
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  body: {
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
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

  // ─── Sorting ──────────────────────
  sortingContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },
  progress: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  behaviorCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: MC4_PALETTE.teal,
    ...Shadows.card,
  },
  behaviorText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 24,
  },
  explanationBox: {
    marginTop: Spacing.sm,
    backgroundColor: MC4_PALETTE.softMint,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: MC4_PALETTE.teal,
  },
  explanationLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: MC4_PALETTE.deepTeal,
    marginBottom: 4,
  },
  explanationText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  columnsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  columnButton: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    borderWidth: 2,
    alignItems: 'center',
  },
  columnButtonWrong: {
    opacity: 0.4,
  },
  columnButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ─── Results ──────────────────────
  resultsContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  resultsContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  scoreCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadows.card,
  },
  scoreNumber: {
    fontSize: 48,
    fontFamily: FontFamilies.accent,
    fontWeight: '700',
    color: MC4_PALETTE.teal,
  },
  scoreLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  scoreMessage: {
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
});
