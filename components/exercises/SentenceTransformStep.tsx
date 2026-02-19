/**
 * SentenceTransformStep — Progressive text transformation.
 *
 * Renders a multi-stage sentence builder where users complete
 * one stage at a time. Each stage has a bold non-editable prefix
 * followed by a text input. Completed stages dim and remain visible
 * above the active stage, creating a "building" effect.
 *
 * The component captures all stages as a single concatenated string
 * in the parent's response state via onChangeText.
 *
 * Wes Anderson style: warm cards, centered composition, Jost headers,
 * Josefin Sans body, Playfair for the final composed sentence.
 *
 * Usage inside ExerciseFlow's StepRenderer:
 *   case 'sentence_transform':
 *     return (
 *       <>
 *         {previousResponses.length > 0 && <PreviousResponses ... />}
 *         <SentenceTransformStep step={step} value={value} onChangeText={onChangeText} />
 *       </>
 *     );
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
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
import type { SentenceTransformConfig } from '@/types/interactive-step-types';
import { CheckmarkIcon } from '@/assets/graphics/icons';

// ─── Haptics (safe import — no crash if unavailable) ────
let triggerHaptic: (style?: string) => void = () => {};
try {
  const Haptics = require('expo-haptics');
  triggerHaptic = (style = 'Light') => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle[style] ?? Haptics.ImpactFeedbackStyle.Light
    );
  };
} catch {}

interface SentenceTransformStepProps {
  step: ExerciseStep;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function SentenceTransformStep({
  step,
  value,
  onChangeText,
}: SentenceTransformStepProps) {
  const config = step.interactiveConfig as SentenceTransformConfig | undefined;
  const stages = config?.stages ?? [];

  // Track the text for each stage independently
  const [stageTexts, setStageTexts] = useState<string[]>(
    () => stages.map(() => '')
  );
  const [activeStage, setActiveStage] = useState(0);
  const [allComplete, setAllComplete] = useState(false);

  // Animation for the active stage entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  // Animate stage entrance
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(12);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeStage, fadeAnim, slideAnim]);

  // Serialize all stages into a single response string
  const serializeResponse = useCallback(
    (texts: string[]) => {
      const parts = stages.map((stage, i) => {
        const text = texts[i]?.trim() || '';
        if (!text) return '';
        return `${stage.prefix} ${text}`;
      });
      return parts.filter(Boolean).join('\n');
    },
    [stages]
  );

  // Initialize from existing value (if navigating back)
  useEffect(() => {
    if (value && stageTexts.every((t) => !t)) {
      // Try to parse the value back into stages
      const lines = value.split('\n');
      const restored = stages.map((stage, i) => {
        const line = lines[i] || '';
        // Strip the prefix to get just the user's text
        if (line.startsWith(stage.prefix)) {
          return line.slice(stage.prefix.length).trim();
        }
        return line;
      });
      setStageTexts(restored);
      // If all have text, mark all complete
      if (restored.every((t) => t.trim().length > 0)) {
        setActiveStage(stages.length);
        setAllComplete(true);
      }
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStageTextChange = (index: number, text: string) => {
    const updated = [...stageTexts];
    updated[index] = text;
    setStageTexts(updated);
    onChangeText?.(serializeResponse(updated));
  };

  const handleAdvanceStage = () => {
    if (activeStage < stages.length - 1) {
      triggerHaptic('Light');
      setActiveStage((prev) => prev + 1);
    } else {
      // Final stage completed
      triggerHaptic('Medium');
      setAllComplete(true);
      setActiveStage(stages.length);
    }
  };

  const handleEditStage = (index: number) => {
    if (allComplete || index < activeStage) {
      setAllComplete(false);
      setActiveStage(index);
    }
  };

  const currentStageHasText = stageTexts[activeStage]?.trim().length > 0;

  // If no config, fall back to a simple prompt
  if (!config || stages.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.content}>{step.content}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={value ?? ''}
            onChangeText={onChangeText}
            placeholder={step.promptPlaceholder ?? 'Write here...'}
            placeholderTextColor={Colors.textMuted}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Title + instruction */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✦</Text>
        </View>
        <Text style={styles.title}>{step.title}</Text>
      </View>
      <Text style={styles.content}>{step.content}</Text>

      {/* Stage counter */}
      <View style={styles.stageCounter}>
        {stages.map((_, i) => (
          <View
            key={i}
            style={[
              styles.stageDot,
              i < activeStage && styles.stageDotComplete,
              i === activeStage && !allComplete && styles.stageDotActive,
              allComplete && styles.stageDotComplete,
            ]}
          />
        ))}
      </View>

      {/* Completed stages (dimmed, tappable to edit) */}
      {stages.map((stage, i) => {
        if (i >= activeStage && !allComplete) return null;

        return (
          <TouchableOpacity
            key={`complete-${i}`}
            style={styles.completedStage}
            onPress={() => handleEditStage(i)}
            activeOpacity={0.7}
          >
            <Text style={styles.completedPrefix}>{stage.prefix}</Text>
            <Text style={styles.completedText}>
              {stageTexts[i] || '(empty)'}
            </Text>
            {!allComplete && (
              <Text style={styles.editHint}>tap to edit</Text>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Active stage (animated entrance) */}
      {!allComplete && activeStage < stages.length && (
        <Animated.View
          style={[
            styles.activeStage,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.stageHeader}>
            <Text style={styles.stageBadge}>
              {activeStage + 1} of {stages.length}
            </Text>
          </View>

          <Text style={styles.activePrefix}>
            {stages[activeStage].prefix}
          </Text>

          <View style={styles.activeInputWrapper}>
            <TextInput
              style={styles.activeInput}
              value={stageTexts[activeStage] ?? ''}
              onChangeText={(text) =>
                handleStageTextChange(activeStage, text)
              }
              placeholder={stages[activeStage].placeholder}
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
              autoFocus={activeStage > 0}
            />
          </View>

          <Text style={styles.explanation}>
            {stages[activeStage].explanation}
          </Text>

          {/* Advance button */}
          <TouchableOpacity
            style={[
              styles.advanceButton,
              !currentStageHasText && styles.advanceButtonDisabled,
            ]}
            onPress={handleAdvanceStage}
            disabled={!currentStageHasText}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.advanceButtonText,
                !currentStageHasText && styles.advanceButtonTextDisabled,
              ]}
            >
              {activeStage === stages.length - 1
                ? 'Complete ✓'
                : 'Next Stage ›'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* All complete — show composed result */}
      {allComplete && (
        <View style={styles.composedCard}>
          <View style={styles.composedHeader}>
            <CheckmarkIcon size={18} color={Colors.success} />
            <Text style={styles.composedLabel}>YOUR TRANSFORMATION</Text>
          </View>
          <Text style={styles.composedText}>
            {stages.map((stage, i) => {
              const text = stageTexts[i]?.trim();
              if (!text) return '';
              return `${stage.prefix} ${text}`;
            }).filter(Boolean).join('\n\n')}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditStage(0)}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
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
    fontSize: 16,
    color: Colors.accent,
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
    marginBottom: Spacing.sm,
  },

  // Stage counter dots
  stageCounter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  stageDotActive: {
    backgroundColor: Colors.primary,
    width: 20,
    borderRadius: 4,
  },
  stageDotComplete: {
    backgroundColor: Colors.success,
  },

  // Completed stage (dimmed)
  completedStage: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.sm,
    opacity: 0.7,
  },
  completedPrefix: {
    fontSize: 13,
    fontFamily: 'Jost_500Medium',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  completedText: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.text,
    lineHeight: 22,
  },
  editHint: {
    fontSize: 11,
    fontFamily: 'JosefinSans_300Light',
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'right',
    fontStyle: 'italic',
  },

  // Active stage
  activeStage: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary + '30',
    ...Shadows.subtle,
    gap: Spacing.sm,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  stageBadge: {
    fontSize: 11,
    fontFamily: 'Jost_500Medium',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  activePrefix: {
    fontSize: FontSizes.headingS ?? 17,
    fontFamily: 'Jost_600SemiBold',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  activeInputWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.accent + '50',
    backgroundColor: '#FFFCF7',
    overflow: 'hidden',
  },
  activeInput: {
    padding: Spacing.md,
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.text,
    minHeight: 80,
    lineHeight: 24,
  },
  explanation: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_300Light',
    color: Colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Advance button
  advanceButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.xs,
  },
  advanceButtonDisabled: {
    backgroundColor: Colors.borderLight,
  },
  advanceButtonText: {
    fontSize: 14,
    fontFamily: 'Jost_600SemiBold',
    color: Colors.textOnPrimary,
    letterSpacing: 1,
  },
  advanceButtonTextDisabled: {
    color: Colors.textMuted,
  },

  // Composed result card
  composedCard: {
    backgroundColor: '#FBF7F2',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.success + '30',
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
    marginTop: Spacing.sm,
  },
  composedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  composedLabel: {
    fontSize: 12,
    fontFamily: 'Jost_500Medium',
    color: Colors.success,
    letterSpacing: 1.5,
  },
  composedText: {
    fontSize: FontSizes.body,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: Colors.text,
    lineHeight: 28,
    letterSpacing: 0,
  },
  editButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginTop: Spacing.md,
  },
  editButtonText: {
    fontSize: 13,
    fontFamily: 'Jost_500Medium',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },

  // Fallback input
  inputWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.accent + '60',
    backgroundColor: '#FFFCF7',
    overflow: 'hidden',
  },
  textInput: {
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 140,
    lineHeight: 24,
  },
});
