/**
 * CardFlipStep — Tap-to-reveal flip cards.
 *
 * Renders a grid of cards with front/back content. Tapping a card
 * flips it to reveal the back with a rotation animation.
 * Tracks which cards have been revealed.
 *
 * Response captured as JSON: { revealed: ["card1", "card2"], count: 2 }
 *
 * Usage inside ExerciseFlow's StepRenderer:
 *   case 'card_flip':
 *     return (
 *       <>
 *         {previousResponses.length > 0 && <PreviousResponses ... />}
 *         <CardFlipStep step={step} value={value} onChangeText={onChangeText} />
 *       </>
 *     );
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
import type { ExerciseStep } from '@/types/intervention';
import type { CardFlipConfig } from '@/types/interactive-step-types';

// ─── Haptics ────────────────────────────────────────────
let triggerHaptic: (style?: string) => void = () => {};
try {
  const Haptics = require('expo-haptics');
  triggerHaptic = (style = 'Light') => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle[style] ?? Haptics.ImpactFeedbackStyle.Light
    );
  };
} catch {}

interface CardFlipStepProps {
  step: ExerciseStep;
  value?: string;
  onChangeText?: (text: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 80; // Full width minus padding

export default function CardFlipStep({
  step,
  value,
  onChangeText,
}: CardFlipStepProps) {
  const config = step.interactiveConfig as CardFlipConfig | undefined;
  const cards = config?.cards ?? [];

  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  // Restore from saved value
  useEffect(() => {
    if (value && revealed.size === 0) {
      try {
        const parsed = JSON.parse(value);
        if (parsed.revealed && Array.isArray(parsed.revealed)) {
          setRevealed(new Set(parsed.revealed));
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serialize = useCallback(
    (ids: Set<string>) => {
      return JSON.stringify({
        revealed: Array.from(ids),
        count: ids.size,
        total: cards.length,
      });
    },
    [cards.length]
  );

  const handleFlip = (id: string) => {
    if (revealed.has(id)) return;
    triggerHaptic('Medium');
    setRevealed((prev) => {
      const next = new Set(prev);
      next.add(id);
      onChangeText?.(serialize(next));
      return next;
    });
  };

  if (!config || cards.length === 0) {
    return (
      <View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.content}>{step.content}</Text>
      </View>
    );
  }

  const allRevealed = revealed.size === cards.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>↻</Text>
        </View>
        <Text style={styles.title}>{step.title}</Text>
      </View>

      {step.content ? (
        <Text style={styles.content}>{step.content}</Text>
      ) : null}

      {/* Progress */}
      <Text style={styles.progress}>
        {revealed.size} of {cards.length} revealed
        {allRevealed ? ' ✓' : ''}
      </Text>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {cards.map((card) => (
          <FlipCard
            key={card.id}
            card={card}
            isFlipped={revealed.has(card.id)}
            onFlip={() => handleFlip(card.id)}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Individual Flip Card ───────────────────────────────

function FlipCard({
  card,
  isFlipped,
  onFlip,
}: {
  card: { id: string; front: string; back: string };
  isFlipped: boolean;
  onFlip: () => void;
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, flipAnim]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '270deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <TouchableOpacity
      onPress={onFlip}
      activeOpacity={isFlipped ? 1 : 0.8}
      disabled={isFlipped}
      style={styles.cardWrapper}
    >
      {/* Front */}
      <Animated.View
        style={[
          styles.cardFace,
          styles.cardFront,
          {
            opacity: frontOpacity,
            transform: [{ rotateY: frontInterpolate }],
          },
        ]}
      >
        <Text style={styles.cardFrontText}>{card.front}</Text>
        <Text style={styles.tapHint}>tap to reveal</Text>
      </Animated.View>

      {/* Back */}
      <Animated.View
        style={[
          styles.cardFace,
          styles.cardBack,
          {
            opacity: backOpacity,
            transform: [{ rotateY: backInterpolate }],
          },
        ]}
      >
        <View style={styles.antidoteBadge}>
          <Text style={styles.antidoteBadgeText}>ANTIDOTE</Text>
        </View>
        <Text style={styles.cardBackText}>{card.back}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    color: Colors.accent,
    fontWeight: '600',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  content: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.xs,
  },

  // Progress
  progress: {
    fontSize: 12,
    fontFamily: 'Jost_500Medium',
    color: Colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },

  // Cards container
  cardsContainer: {
    gap: Spacing.md,
  },

  // Card wrapper
  cardWrapper: {
    height: 160,
    position: 'relative',
  },

  // Card face (shared)
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    ...Shadows.card,
  },

  // Front
  cardFront: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  cardFrontText: {
    fontSize: 15,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  tapHint: {
    fontSize: 11,
    fontFamily: 'JosefinSans_300Light',
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },

  // Back
  cardBack: {
    backgroundColor: '#FBF7F2',
    borderWidth: 2,
    borderColor: '#4A6F50' + '40',
    borderLeftWidth: 4,
    borderLeftColor: '#4A6F50',
  },
  antidoteBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#E3EFE5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  antidoteBadgeText: {
    fontSize: 10,
    fontFamily: 'Jost_600SemiBold',
    color: '#4A6F50',
    letterSpacing: 1,
  },
  cardBackText: {
    fontSize: 14,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
    paddingTop: Spacing.sm,
  },
});
