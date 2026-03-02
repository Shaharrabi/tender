/**
 * ScenarioChoiceStep — Interactive scenario with choice cards.
 *
 * Displays a scenario in a bordered card, followed by 2-4 tappable
 * choice cards. After selection, feedback is revealed with a warm
 * fade animation. If `revealAll` is true, feedback for all options
 * is shown so users learn from every path.
 *
 * Wes Anderson style: warm scenario card, elegant choice cards with
 * subtle borders, recommended badge in sage green, warm reveal animation.
 *
 * Usage inside ExerciseFlow's StepRenderer:
 *   case 'scenario_choice':
 *     return (
 *       <>
 *         {previousResponses.length > 0 && <PreviousResponses ... />}
 *         <ScenarioChoiceStep step={step} value={value} onChangeText={onChangeText} />
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
import type { ScenarioChoiceConfig, ScenarioChoice } from '@/types/interactive-step-types';
import { CheckmarkIcon } from '@/assets/graphics/icons';

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

interface ScenarioChoiceStepProps {
  step: ExerciseStep;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function ScenarioChoiceStep({
  step,
  value,
  onChangeText,
}: ScenarioChoiceStepProps) {
  const config = step.interactiveConfig as ScenarioChoiceConfig | undefined;
  const choices = config?.choices ?? [];
  const revealAll = config?.revealAll ?? false;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const feedbackFade = useRef(new Animated.Value(0)).current;
  const feedbackSlide = useRef(new Animated.Value(8)).current;

  // Restore from saved value
  useEffect(() => {
    if (value && !selectedId) {
      try {
        const parsed = JSON.parse(value);
        if (parsed.chosen) {
          setSelectedId(parsed.chosen);
          feedbackFade.setValue(1);
          feedbackSlide.setValue(0);
        }
      } catch {
        // Value is plain text — try to match by ID
        const match = choices.find((c) => c.id === value);
        if (match) {
          setSelectedId(match.id);
          feedbackFade.setValue(1);
          feedbackSlide.setValue(0);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = useCallback(
    (choice: ScenarioChoice) => {
      if (selectedId) return; // Already selected — no re-selection

      triggerHaptic('Medium');
      setSelectedId(choice.id);

      // Serialize the response
      const response = JSON.stringify({
        chosen: choice.id,
        text: choice.text,
        isRecommended: choice.isRecommended ?? false,
      });
      onChangeText?.(response);

      // Animate feedback reveal
      feedbackFade.setValue(0);
      feedbackSlide.setValue(8);
      Animated.parallel([
        Animated.timing(feedbackFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(feedbackSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [selectedId, onChangeText, feedbackFade, feedbackSlide]
  );

  const handleReset = () => {
    triggerHaptic('Light');
    setSelectedId(null);
    onChangeText?.('');
    feedbackFade.setValue(0);
    feedbackSlide.setValue(8);
  };

  // Fallback for missing config
  if (!config || choices.length === 0) {
    return (
      <View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.content}>{step.content}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>?</Text>
        </View>
        <Text style={styles.title}>{step.title}</Text>
      </View>

      {step.content ? (
        <Text style={styles.content}>{step.content}</Text>
      ) : null}

      {/* Scenario Card */}
      <View style={styles.scenarioCard}>
        <Text style={styles.scenarioText}>{config.scenario}</Text>
      </View>

      {/* Choice Cards */}
      <View style={styles.choicesContainer}>
        {choices.map((choice, index) => {
          const isSelected = selectedId === choice.id;
          const isOther = selectedId !== null && !isSelected;

          return (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choiceCard,
                isSelected && styles.choiceCardSelected,
                isOther && styles.choiceCardOther,
              ]}
              onPress={() => handleSelect(choice)}
              activeOpacity={selectedId ? 1 : 0.7}
              disabled={!!selectedId}
              accessibilityRole="button"
              accessibilityLabel={`Choice: ${choice.text}`}
              accessibilityState={{ disabled: !!selectedId, selected: isSelected }}
            >
              <View style={styles.choiceRow}>
                {/* Radio circle */}
                <View
                  style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>

                {/* Choice text */}
                <Text
                  style={[
                    styles.choiceText,
                    isSelected && styles.choiceTextSelected,
                    isOther && styles.choiceTextOther,
                  ]}
                >
                  {choice.text}
                </Text>
              </View>

              {/* Recommended badge */}
              {choice.isRecommended && isSelected && (
                <View style={styles.recommendedBadge}>
                  <CheckmarkIcon size={12} color="#4A6F50" />
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback Area */}
      {selectedId && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            {
              opacity: feedbackFade,
              transform: [{ translateY: feedbackSlide }],
            },
          ]}
        >
          {revealAll ? (
            // Show feedback for ALL choices
            choices.map((choice) => {
              const isChosen = choice.id === selectedId;
              return (
                <View
                  key={`feedback-${choice.id}`}
                  style={[
                    styles.feedbackCard,
                    isChosen && styles.feedbackCardChosen,
                  ]}
                >
                  {isChosen && (
                    <View style={styles.feedbackChosenBadge}>
                      <Text style={styles.feedbackChosenText}>
                        Your choice
                      </Text>
                    </View>
                  )}
                  <Text style={styles.feedbackLabel}>{choice.text}</Text>
                  <Text style={styles.feedbackText}>{choice.feedback}</Text>
                </View>
              );
            })
          ) : (
            // Show feedback only for selected choice
            (() => {
              const chosen = choices.find((c) => c.id === selectedId);
              if (!chosen) return null;
              return (
                <View style={[styles.feedbackCard, styles.feedbackCardChosen]}>
                  <Text style={styles.feedbackText}>
                    {chosen.feedback}
                  </Text>
                </View>
              );
            })()
          )}

          {/* Change answer button */}
          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleReset}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Change answer"
          >
            <Text style={styles.changeButtonText}>Change answer</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
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
    backgroundColor: Colors.secondary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.secondary,
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

  // Scenario card
  scenarioCard: {
    backgroundColor: '#FBF7F2',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  scenarioText: {
    fontSize: 17,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 0,
  },

  // Choices
  choicesContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  choiceCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  choiceCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  choiceCardOther: {
    opacity: 0.5,
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  // Radio button
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },

  // Choice text
  choiceText: {
    flex: 1,
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.text,
    lineHeight: 22,
  },
  choiceTextSelected: {
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.text,
  },
  choiceTextOther: {
    color: Colors.textSecondary,
  },

  // Recommended badge
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E3EFE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    marginLeft: 38, // Align with text (after radio)
  },
  recommendedText: {
    fontSize: 11,
    fontFamily: 'Jost_500Medium',
    color: '#4A6F50',
    letterSpacing: 0.5,
  },

  // Feedback area
  feedbackContainer: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  feedbackCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  feedbackCardChosen: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    backgroundColor: '#FBF7F2',
  },
  feedbackChosenBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.sm,
  },
  feedbackChosenText: {
    fontSize: 11,
    fontFamily: 'Jost_500Medium',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  feedbackLabel: {
    fontSize: 13,
    fontFamily: 'Jost_500Medium',
    color: Colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  feedbackText: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.text,
    lineHeight: 24,
  },

  // Change answer
  changeButton: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    marginTop: Spacing.xs,
  },
  changeButtonText: {
    fontSize: 13,
    fontFamily: 'Jost_500Medium',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textDecorationLine: 'underline',
  },
});
