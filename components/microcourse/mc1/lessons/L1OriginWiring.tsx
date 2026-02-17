/**
 * L1: Origin Wiring — Tap-to-Reveal Pathway
 *
 * Vertical pathway with 5 nodes. User taps sequentially to reveal
 * paragraphs about how attachment patterns form.
 * Path draws forward with animation as nodes are revealed.
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
import {
  SeedlingIcon,
  EyeIcon,
  BrainIcon,
  HeartPulseIcon,
  LightbulbIcon,
} from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const NODE_ICONS = [SeedlingIcon, EyeIcon, BrainIcon, HeartPulseIcon, LightbulbIcon];
const NODE_LABELS = [
  'The Beginning',
  'What You Learned',
  'The Strategy',
  'The Pattern',
  'The Insight',
];

interface L1OriginWiringProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L1OriginWiring({ content, attachmentStyle, onComplete }: L1OriginWiringProps) {
  const haptics = useSoundHaptics();

  // Split read content into paragraphs (there are 5 in MC1 L1)
  const paragraphs = content.readContent.split('\n\n').filter(Boolean);

  const [revealedCount, setRevealedCount] = useState(0);
  const cardFades = useRef(paragraphs.map(() => new Animated.Value(0))).current;

  const allRevealed = revealedCount >= paragraphs.length;

  const handleTapNode = useCallback((index: number) => {
    if (index !== revealedCount) return;

    haptics.tap();

    // Fade in the content card
    Animated.timing(cardFades[index], {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const newCount = index + 1;
    setRevealedCount(newCount);

    // If last node, play special sound
    if (newCount >= paragraphs.length) {
      setTimeout(() => haptics.playExerciseReveal(), 300);
    }
  }, [revealedCount, paragraphs.length, haptics, cardFades]);

  const handleContinue = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Origin pathway',
        response: 'Completed origin pathway exploration',
        type: 'tap-reveal',
      },
    ];
    onComplete(responses);
  }, [haptics, onComplete]);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>THE SIGNAL PATH</Text>
      <Text style={styles.subtitle}>
        Tap each node to trace where your pattern came from.
      </Text>

      {/* Pathway */}
      <View style={styles.pathway}>
        {paragraphs.map((paragraph, i) => {
          const Icon = NODE_ICONS[i] || LightbulbIcon;
          const isRevealed = i < revealedCount;
          const isNext = i === revealedCount;
          const isFuture = i > revealedCount;

          return (
            <View key={i} style={styles.nodeSection}>
              {/* Connector line (above, except first) */}
              {i > 0 && (
                <View
                  style={[
                    styles.connectorLine,
                    isRevealed && styles.connectorLineActive,
                    isNext && styles.connectorLineNext,
                  ]}
                />
              )}

              {/* Node row: circle + label — entire row is tappable */}
              <TouchableOpacity
                style={styles.nodeRow}
                onPress={() => handleTapNode(i)}
                disabled={!isNext}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.nodeCircle,
                    isRevealed && styles.nodeCircleRevealed,
                    isNext && styles.nodeCircleNext,
                    isFuture && styles.nodeCircleFuture,
                  ]}
                >
                  <Icon
                    size={18}
                    color={
                      isRevealed
                        ? Colors.textOnPrimary
                        : isNext
                          ? Colors.primary
                          : Colors.textMuted
                    }
                  />
                </View>
                <View style={styles.nodeLabelWrap}>
                  <Text
                    style={[
                      styles.nodeLabel,
                      isRevealed && styles.nodeLabelRevealed,
                      isNext && styles.nodeLabelNext,
                    ]}
                  >
                    {NODE_LABELS[i] || `Step ${i + 1}`}
                  </Text>
                  {isNext && (
                    <Text style={styles.tapHint}>Tap to explore</Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Content card */}
              {(isRevealed || isNext) && (
                <Animated.View
                  style={[
                    styles.contentCard,
                    { opacity: cardFades[i] },
                    i === paragraphs.length - 1 && isRevealed && styles.contentCardFinal,
                  ]}
                >
                  <Text style={styles.contentText}>{paragraph}</Text>
                </Animated.View>
              )}
            </View>
          );
        })}
      </View>

      {/* Continue button */}
      {allRevealed && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.continueButtonText}>Continue to Reflection</Text>
        </TouchableOpacity>
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
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // ─── Pathway ─────────────────────────
  pathway: {
    paddingLeft: Spacing.md,
  },
  nodeSection: {
    marginBottom: Spacing.sm,
  },
  connectorLine: {
    width: 2,
    height: 16,
    backgroundColor: Colors.borderLight,
    marginLeft: 19, // Center of 40px node
    marginBottom: Spacing.xs,
  },
  connectorLineActive: {
    backgroundColor: Colors.success,
  },
  connectorLineNext: {
    backgroundColor: Colors.primary + '40',
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  nodeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  nodeCircleRevealed: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  nodeCircleNext: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  nodeCircleFuture: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
    opacity: 0.4,
  },
  nodeLabelWrap: {
    flex: 1,
  },
  nodeLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  nodeLabelRevealed: {
    color: Colors.text,
  },
  nodeLabelNext: {
    color: Colors.primary,
  },
  tapHint: {
    fontSize: FontSizes.caption - 1,
    color: Colors.primary,
    fontStyle: 'italic',
    marginTop: 1,
  },

  // ─── Content card ────────────────────
  contentCard: {
    marginLeft: 52, // Align with label text
    marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  contentCardFinal: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  contentText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },

  // ─── Continue ────────────────────────
  continueButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    ...Shadows.subtle,
  },
  continueButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
});
