/**
 * StepJourney — Twelve Steps Expandable Journey View
 *
 * Redesigned to let users explore all 12 steps:
 * - Intro section explaining the healing journey
 * - Steps grouped by healing phase with phase headers
 * - Each step is tappable to expand/collapse
 * - Expanded view shows: subtitle, quote, goals, practices
 * - Active step auto-expanded, locked steps dimmed but readable
 * - Practice cards are tappable to launch exercises
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import CheckmarkIcon from '@/assets/graphics/icons/CheckmarkIcon';
import type { StepProgress } from '@/types/growth';
import {
  TWELVE_STEPS,
  HEALING_PHASES,
  getPhaseForStep,
} from '@/utils/steps/twelve-steps';
import { getExerciseById } from '@/utils/interventions/registry';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  stepProgress: StepProgress[];
  currentStepNumber: number;
  onStepPress?: (stepNumber: number) => void;
  onSelectPractice?: (practiceId: string) => void;
  /** Called when a criteria checkbox is toggled. Returns the criteria index and new checked state. */
  onCriteriaToggle?: (stepNumber: number, criteriaIndex: number, checked: boolean) => void;
  /** Map of stepNumber -> array of checked criteria indices */
  checkedCriteria?: Record<number, number[]>;
}

export default function StepJourney({
  stepProgress,
  currentStepNumber,
  onStepPress,
  onSelectPractice,
  onCriteriaToggle,
  checkedCriteria = {},
}: Props) {
  const [expandedStep, setExpandedStep] = useState<number | null>(
    currentStepNumber
  );

  const completedCount = stepProgress.filter(
    (sp) => sp.status === 'completed'
  ).length;

  const handleStepToggle = (stepNumber: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedStep((prev) => (prev === stepNumber ? null : stepNumber));
    onStepPress?.(stepNumber);
  };

  const getStepStatus = (stepNumber: number) => {
    const progress = stepProgress.find((sp) => sp.stepNumber === stepNumber);
    return progress?.status ?? 'locked';
  };

  return (
    <View style={styles.container}>
      {/* Intro Section */}
      <View style={styles.introSection}>
        <Text style={styles.introTitle}>Your Healing Journey</Text>
        <Text style={styles.introText}>
          Twelve steps of relational growth — from seeing your patterns to
          living with connection. Each step includes practices, reflections,
          and milestones. Some work happens here in the app; some happens in
          your daily life together.
        </Text>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>
            {completedCount} of 12 steps completed
          </Text>
        </View>
      </View>

      {/* Phase-Grouped Steps */}
      {HEALING_PHASES.map((phase) => {
        const phaseSteps = TWELVE_STEPS.filter(
          (s) =>
            s.stepNumber >= phase.stepRange[0] &&
            s.stepNumber <= phase.stepRange[1]
        );

        if (phaseSteps.length === 0) return null;

        return (
          <View key={phase.id} style={styles.phaseGroup}>
            {/* Phase Header */}
            <View
              style={[
                styles.phaseHeader,
                { borderLeftColor: phase.color, backgroundColor: phase.color + '12' },
              ]}
            >
              <phase.icon size={18} color={phase.color} />
              <View style={styles.phaseHeaderInfo}>
                <Text style={[styles.phaseLabel, { color: phase.color }]}>
                  {phase.name.toUpperCase()}
                </Text>
                <Text style={styles.phaseSubtitle}>{phase.subtitle}</Text>
              </View>
            </View>

            {/* Steps in this phase */}
            {phaseSteps.map((step) => {
              const status = getStepStatus(step.stepNumber);
              const isExpanded = expandedStep === step.stepNumber;
              const isCurrent = step.stepNumber === currentStepNumber;
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';
              const stepPhase = getPhaseForStep(step.stepNumber);
              const phaseColor = stepPhase?.color ?? Colors.primary;

              return (
                <View key={step.stepNumber} style={styles.stepContainer}>
                  {/* Step Row — tappable header */}
                  <TouchableOpacity
                    onPress={() => handleStepToggle(step.stepNumber)}
                    activeOpacity={0.7}
                    style={[
                      styles.stepRow,
                      isCurrent && [
                        styles.stepRowCurrent,
                        { borderLeftColor: phaseColor },
                      ],
                      isCompleted && styles.stepRowCompleted,
                      isLocked && styles.stepRowLocked,
                    ]}
                  >
                    {/* Status indicator */}
                    <View
                      style={[
                        styles.stepDot,
                        isCompleted && [
                          styles.stepDotCompleted,
                          { backgroundColor: phaseColor },
                        ],
                        isCurrent && [
                          styles.stepDotCurrent,
                          { borderColor: phaseColor },
                        ],
                        isLocked && styles.stepDotLocked,
                      ]}
                    >
                      {isCompleted && (
                        <CheckmarkIcon size={10} color="#FFFFFF" />
                      )}
                      {isCurrent && (
                        <View
                          style={[
                            styles.stepDotInner,
                            { backgroundColor: phaseColor },
                          ]}
                        />
                      )}
                    </View>

                    {/* Step title */}
                    <View style={styles.stepTitleContainer}>
                      <Text
                        style={[
                          styles.stepNumber,
                          isLocked && styles.textDimmed,
                        ]}
                      >
                        Step {step.stepNumber}
                      </Text>
                      <Text
                        style={[
                          styles.stepTitle,
                          isCurrent && styles.stepTitleCurrent,
                          isLocked && styles.textDimmed,
                        ]}
                        numberOfLines={isExpanded ? undefined : 1}
                      >
                        {step.title}
                      </Text>
                    </View>

                    {/* Chevron */}
                    <Text
                      style={[
                        styles.chevron,
                        isLocked && styles.textDimmed,
                      ]}
                    >
                      {isExpanded ? '\u2303' : '\u2304'}
                    </Text>
                  </TouchableOpacity>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <View
                      style={[
                        styles.stepDetail,
                        isLocked && styles.stepDetailLocked,
                      ]}
                    >
                      {/* Subtitle */}
                      {step.subtitle && (
                        <Text
                          style={[
                            styles.stepSubtitle,
                            isLocked && styles.textDimmed,
                          ]}
                        >
                          {step.subtitle}
                        </Text>
                      )}

                      {/* Quote */}
                      <Text
                        style={[
                          styles.stepQuote,
                          isLocked && styles.textDimmed,
                        ]}
                      >
                        &ldquo;{step.quote}&rdquo;
                      </Text>

                      {/* Therapeutic Goal */}
                      <View style={styles.goalSection}>
                        <Text style={styles.detailLabel}>THERAPEUTIC GOAL</Text>
                        <Text
                          style={[
                            styles.goalText,
                            isLocked && styles.textDimmed,
                          ]}
                        >
                          {step.therapeuticGoal}
                        </Text>
                      </View>

                      {/* Completion Criteria */}
                      {step.completionCriteria.length > 0 && (
                        <View style={styles.criteriaSection}>
                          <Text style={styles.detailLabel}>
                            GOALS FOR THIS STEP
                          </Text>
                          {step.completionCriteria.map((criteria, i) => {
                            const isChecked = (checkedCriteria[step.stepNumber] ?? []).includes(i);
                            const canToggle = isCurrent || isCompleted;
                            return (
                              <TouchableOpacity
                                key={i}
                                style={styles.criteriaRow}
                                activeOpacity={canToggle ? 0.6 : 1}
                                disabled={!canToggle}
                                onPress={() => {
                                  if (canToggle && onCriteriaToggle) {
                                    onCriteriaToggle(step.stepNumber, i, !isChecked);
                                  }
                                }}
                              >
                                <View style={styles.criteriaCheckbox}>
                                  <View
                                    style={[
                                      styles.criteriaSquare,
                                      isChecked && styles.criteriaSquareChecked,
                                    ]}
                                  >
                                    {isChecked && (
                                      <CheckmarkIcon size={9} color={Colors.textOnPrimary} />
                                    )}
                                  </View>
                                </View>
                                <Text
                                  style={[
                                    styles.criteriaText,
                                    isLocked && styles.textDimmed,
                                    isChecked && styles.criteriaTextChecked,
                                  ]}
                                >
                                  {criteria}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                          {!isCurrent && !isCompleted && (
                            <Text style={styles.criteriaHint}>
                              These goals become active when you reach this step
                            </Text>
                          )}
                        </View>
                      )}

                      {/* Practices */}
                      {step.practices.length > 0 && (
                        <View style={styles.practicesSection}>
                          <Text style={styles.detailLabel}>PRACTICES</Text>
                          <View style={styles.practicesList}>
                            {step.practices.map((practiceId) => {
                              const exercise = getExerciseById(practiceId);
                              if (!exercise) return null;

                              return (
                                <TouchableOpacity
                                  key={practiceId}
                                  style={styles.practiceCard}
                                  onPress={() =>
                                    onSelectPractice?.(practiceId)
                                  }
                                  activeOpacity={0.7}
                                >
                                  <View style={styles.practiceCardContent}>
                                    <Text
                                      style={styles.practiceTitle}
                                      numberOfLines={1}
                                    >
                                      {exercise.title}
                                    </Text>
                                    <Text style={styles.practiceMeta}>
                                      {exercise.duration} min
                                      {' \u00B7 '}
                                      {exercise.mode === 'solo'
                                        ? 'Solo'
                                        : exercise.mode === 'together'
                                        ? 'Together'
                                        : 'Either'}
                                    </Text>
                                  </View>
                                  <Text style={styles.practiceArrow}>
                                    {'\u203A'}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      )}

                      {/* Current step callout */}
                      {isCurrent && (
                        <View
                          style={[
                            styles.currentBadge,
                            { backgroundColor: phaseColor + '18' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.currentBadgeText,
                              { color: phaseColor },
                            ]}
                          >
                            You are here
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },

  // Intro
  introSection: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  introTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  introText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  progressPill: {
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  progressText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    fontFamily: FontFamilies.body,
    color: Colors.primary,
  },

  // Phase Group
  phaseGroup: {
    gap: 2,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    gap: Spacing.sm,
    marginBottom: 4,
  },
  phaseHeaderInfo: {
    flex: 1,
    gap: 1,
  },
  phaseLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  phaseSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontFamily: FontFamilies.body,
  },

  // Step Row
  stepContainer: {
    marginBottom: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    ...Shadows.subtle,
  },
  stepRowCurrent: {
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.card,
  },
  stepRowCompleted: {
    backgroundColor: Colors.surfaceElevated,
    opacity: 0.95,
  },
  stepRowLocked: {
    backgroundColor: Colors.surface,
    opacity: 0.7,
  },

  // Step Dot
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotCompleted: {
    backgroundColor: Colors.primary,
  },
  stepDotCurrent: {
    borderWidth: 2.5,
    backgroundColor: Colors.surfaceElevated,
  },
  stepDotLocked: {
    backgroundColor: Colors.borderLight,
  },
  stepDotInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  // Step Title
  stepTitleContainer: {
    flex: 1,
    gap: 1,
  },
  stepNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  stepTitleCurrent: {
    fontWeight: '700',
  },
  textDimmed: {
    opacity: 0.55,
  },

  // Chevron
  chevron: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: '300',
    width: 24,
    textAlign: 'center',
  },

  // Step Detail (expanded)
  stepDetail: {
    backgroundColor: Colors.surfaceElevated,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
    marginTop: -2,
    padding: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  stepDetailLocked: {
    opacity: 0.6,
  },

  // Subtitle
  stepSubtitle: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Quote
  stepQuote: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.accent,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 22,
    paddingLeft: Spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primaryLight,
  },

  // Detail sections
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: Spacing.xs,
  },

  // Goal
  goalSection: {
    gap: 0,
  },
  goalText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.text,
    lineHeight: 20,
  },

  // Criteria
  criteriaSection: {
    gap: Spacing.xs,
  },
  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  criteriaCheckbox: {
    width: 16,
    height: 16,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  criteriaSquare: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  criteriaSquareChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  criteriaText: {
    flex: 1,
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.text,
    lineHeight: 18,
  },
  criteriaTextChecked: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through' as const,
  },
  criteriaHint: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },

  // Practices
  practicesSection: {
    gap: 0,
  },
  practicesList: {
    gap: Spacing.xs,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  practiceCardContent: {
    flex: 1,
    gap: 2,
  },
  practiceTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.primary,
  },
  practiceMeta: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
  },
  practiceArrow: {
    fontSize: FontSizes.headingM,
    color: Colors.primary,
    fontWeight: '300',
    marginLeft: Spacing.sm,
  },

  // Current badge
  currentBadge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignSelf: 'center',
  },
  currentBadgeText: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
