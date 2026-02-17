/**
 * L3: Cycle Builder — ME/THEM Card Sequence
 *
 * Shows the pursue-withdraw cycle as 4 cards that reveal sequentially.
 * Card 1 (ME feeling) is pre-revealed; the rest tap to unlock.
 * After all revealed, shows the cycle loop insight.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { CoupleIcon, ArrowRightIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface CycleCard {
  side: 'me' | 'them';
  label: string;
  value: string;
}

// Cycle content per attachment style
const ANXIOUS_CYCLE: CycleCard[] = [
  { side: 'me', label: 'I feel...', value: 'Anxious, lonely, unheard' },
  { side: 'me', label: 'So I...', value: 'Pursue, ask questions, seek reassurance' },
  { side: 'them', label: 'They feel...', value: 'Pressured, overwhelmed, not enough' },
  { side: 'them', label: 'So they...', value: 'Withdraw, get quiet, pull away' },
];

const AVOIDANT_CYCLE: CycleCard[] = [
  { side: 'me', label: 'I feel...', value: 'Overwhelmed, crowded, pressured' },
  { side: 'me', label: 'So I...', value: 'Withdraw, shut down, get busy' },
  { side: 'them', label: 'They feel...', value: 'Abandoned, unimportant, invisible' },
  { side: 'them', label: 'So they...', value: 'Pursue harder, criticize, demand' },
];

const DEFAULT_CYCLE: CycleCard[] = [
  { side: 'me', label: 'I feel...', value: 'Disconnected, uncertain' },
  { side: 'me', label: 'So I...', value: 'React from my pattern' },
  { side: 'them', label: 'They feel...', value: 'Triggered by my reaction' },
  { side: 'them', label: 'So they...', value: 'React from their pattern' },
];

interface L3CycleBuilderProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L3CycleBuilder({ content, attachmentStyle, onComplete }: L3CycleBuilderProps) {
  const haptics = useSoundHaptics();

  const cycle = attachmentStyle === 'anxious-preoccupied'
    ? ANXIOUS_CYCLE
    : attachmentStyle === 'dismissive-avoidant'
      ? AVOIDANT_CYCLE
      : DEFAULT_CYCLE;

  // Card 0 is pre-revealed, cards 1-3 require tapping
  const [revealedCount, setRevealedCount] = useState(1);
  const [showInsight, setShowInsight] = useState(false);

  // Fade animations for each card (card 0 starts visible)
  const cardFades = useRef(
    cycle.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;

  const insightFade = useRef(new Animated.Value(0)).current;

  const handleRevealNext = useCallback(() => {
    const nextIdx = revealedCount;
    if (nextIdx >= cycle.length) return;

    haptics.pageTurn();

    Animated.timing(cardFades[nextIdx], {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const newCount = revealedCount + 1;
    setRevealedCount(newCount);

    // All revealed — show insight
    if (newCount >= cycle.length) {
      setTimeout(() => {
        haptics.playExerciseReveal();
        setShowInsight(true);
        Animated.timing(insightFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 600);
    }
  }, [revealedCount, cycle.length, haptics, cardFades, insightFade]);

  const handleContinue = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Cycle awareness',
        response: JSON.stringify({
          cycleViewed: true,
          variant: attachmentStyle || 'default',
        }),
        type: 'cycle-builder',
      },
    ];
    onComplete(responses);
  }, [haptics, attachmentStyle, onComplete]);

  const allRevealed = revealedCount >= cycle.length;

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.iconCircle}>
        <CoupleIcon size={28} color={Colors.primary} />
      </View>

      <Text style={styles.title}>THE CYCLE</Text>
      <Text style={styles.subtitle}>
        Tap to reveal how it unfolds between you.
      </Text>

      {/* Cycle cards */}
      <View style={styles.cycleContainer}>
        {cycle.map((card, i) => {
          const isRevealed = i < revealedCount;
          const isNext = i === revealedCount;
          const isMeCard = card.side === 'me';

          return (
            <React.Fragment key={i}>
              {/* Arrow between cards */}
              {i > 0 && (
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrowText}>
                    {i === 2 ? '\u21e2 which makes...' : '\u2193 so...'}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                activeOpacity={isNext ? 0.7 : 1}
                onPress={isNext ? handleRevealNext : undefined}
                disabled={!isNext}
              >
                <Animated.View
                  style={[
                    styles.card,
                    isMeCard ? styles.cardMe : styles.cardThem,
                    { opacity: isRevealed ? cardFades[i] : isNext ? 1 : 0.3 },
                  ]}
                >
                  <Text style={styles.cardSideLabel}>
                    {isMeCard ? 'ME' : 'THEM'}
                  </Text>
                  <Text style={[styles.cardLabel, isMeCard ? styles.cardLabelMe : styles.cardLabelThem]}>
                    {card.label}
                  </Text>
                  {isRevealed ? (
                    <Text style={styles.cardValue}>{card.value}</Text>
                  ) : (
                    <Text style={styles.cardPlaceholder}>
                      {isNext ? 'TAP TO REVEAL' : '?'}
                    </Text>
                  )}
                </Animated.View>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}

        {/* Loop arrow: card 4 → card 1 */}
        {allRevealed && (
          <View style={styles.loopArrow}>
            <Text style={styles.loopArrowText}>
              \u21bb ...which makes me feel {cycle[0].value.toLowerCase()} again.
            </Text>
          </View>
        )}
      </View>

      {/* Insight card */}
      {showInsight && (
        <Animated.View style={[styles.insightCard, { opacity: insightFade }]}>
          <Text style={styles.insightText}>
            This is the loop. Your move triggers their move.
            Their move confirms your fear. Round and round.
          </Text>
          <Text style={styles.hopefulText}>
            But now you can <Text style={{ fontWeight: 'bold' }}>see</Text> it.
          </Text>
        </Animated.View>
      )}

      {/* Continue button */}
      {showInsight && (
        <Animated.View style={{ opacity: insightFade }}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.7}
          >
            <Text style={styles.continueButtonText}>Continue to Reflection</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },

  // ─── Cycle ───────────────────────────
  cycleContainer: {
    width: '100%',
    gap: 0,
  },
  arrowContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  arrowText: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  card: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    ...Shadows.subtle,
    minHeight: 80,
  },
  cardMe: {
    backgroundColor: Colors.primary + '08',
    borderColor: Colors.primary + '40',
  },
  cardThem: {
    backgroundColor: Colors.secondary + '08',
    borderColor: Colors.secondary + '40',
  },
  cardSideLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardLabelMe: {
    color: Colors.primary,
  },
  cardLabelThem: {
    color: Colors.secondary,
  },
  cardValue: {
    fontSize: FontSizes.body,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 22,
  },
  cardPlaceholder: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  loopArrow: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.sm,
  },
  loopArrowText: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // ─── Insight ─────────────────────────
  insightCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#D4B483',
    width: '100%',
    ...Shadows.subtle,
  },
  insightText: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    color: Colors.text,
  },
  hopefulText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.body,
    color: Colors.success,
    fontStyle: 'italic',
  },

  // ─── Continue ────────────────────────
  continueButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    ...Shadows.subtle,
  },
  continueButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
});
