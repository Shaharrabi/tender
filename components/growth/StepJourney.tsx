/**
 * StepJourney — Twelve Steps Progress Visualization
 *
 * Shows the user's journey through the 12 Steps with:
 * - Current phase banner with color
 * - Current step with quote
 * - 12-dot step progress indicator
 * - Step goals/completion criteria
 * - Coming next preview
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { StepProgress } from '@/types/growth';
import {
  TWELVE_STEPS,
  HEALING_PHASES,
  getPhaseForStep,
  getTaglineForStep,
} from '@/utils/steps/twelve-steps';

interface Props {
  stepProgress: StepProgress[];
  currentStepNumber: number;
  onStepPress?: (stepNumber: number) => void;
}

export default function StepJourney({
  stepProgress,
  currentStepNumber,
  onStepPress,
}: Props) {
  const currentStep = TWELVE_STEPS.find((s) => s.stepNumber === currentStepNumber);
  const phase = getPhaseForStep(currentStepNumber);
  const nextStep = TWELVE_STEPS.find((s) => s.stepNumber === currentStepNumber + 1);
  const tagline = getTaglineForStep(currentStepNumber);

  // Calculate completed count
  const completedCount = stepProgress.filter((sp) => sp.status === 'completed').length;

  if (!currentStep || !phase) return null;

  return (
    <View style={styles.container}>
      {/* Phase Banner */}
      <View style={[styles.phaseBanner, { backgroundColor: phase.color + '20', borderLeftColor: phase.color }]}>
        <phase.icon size={22} color={phase.color} />
        <View style={styles.phaseInfo}>
          <Text style={[styles.phaseLabel, { color: phase.color }]}>
            PHASE: {phase.name.toUpperCase()}
          </Text>
          <Text style={styles.phaseSubtitle}>{phase.subtitle}</Text>
        </View>
      </View>

      {/* Current Step Card */}
      <View style={styles.currentStepCard}>
        <Text style={styles.currentStepLabel}>CURRENT STEP</Text>
        <Text style={styles.currentStepTitle}>
          Step {currentStep.stepNumber}: {currentStep.title}
        </Text>
        <Text style={styles.currentStepQuote}>
          &ldquo;{currentStep.quote}&rdquo;
        </Text>
        <View style={styles.taglineContainer}>
          <Text style={styles.taglineText}>{tagline}</Text>
        </View>
      </View>

      {/* Step Progress Dots */}
      <View style={styles.dotsSection}>
        <Text style={styles.dotsLabel}>YOUR TWELVE-STEP JOURNEY</Text>
        <View style={styles.dotsRow}>
          {Array.from({ length: 12 }, (_, i) => {
            const stepNum = i + 1;
            const progress = stepProgress.find((sp) => sp.stepNumber === stepNum);
            const status = progress?.status ?? 'locked';
            const isCurrent = stepNum === currentStepNumber;
            const stepPhase = getPhaseForStep(stepNum);

            return (
              <TouchableOpacity
                key={stepNum}
                onPress={() => onStepPress?.(stepNum)}
                activeOpacity={0.7}
                style={styles.dotWrapper}
              >
                <View
                  style={[
                    styles.dot,
                    status === 'completed' && [
                      styles.dotCompleted,
                      { backgroundColor: stepPhase?.color ?? Colors.primary },
                    ],
                    isCurrent && [
                      styles.dotCurrent,
                      { borderColor: stepPhase?.color ?? Colors.primary },
                    ],
                    status === 'locked' && styles.dotLocked,
                  ]}
                >
                  {status === 'completed' && (
                    <Text style={styles.dotCheck}>{'\u2713'}</Text>
                  )}
                  {isCurrent && (
                    <View style={[styles.dotInner, { backgroundColor: stepPhase?.color ?? Colors.primary }]} />
                  )}
                </View>
                <Text
                  style={[
                    styles.dotNumber,
                    isCurrent && styles.dotNumberCurrent,
                    status === 'completed' && styles.dotNumberCompleted,
                  ]}
                >
                  {stepNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.dotsProgress}>
          {completedCount} of 12 steps completed
        </Text>
      </View>

      {/* Step Goals */}
      <View style={styles.goalsSection}>
        <Text style={styles.goalsTitle}>Step {currentStep.stepNumber} Goals</Text>
        {currentStep.completionCriteria.map((criteria, i) => {
          return (
            <View key={i} style={styles.goalRow}>
              <View style={styles.goalCheckbox}>
                <Text style={styles.goalCheckboxText}>{'\u25A1'}</Text>
              </View>
              <Text style={styles.goalText}>{criteria}</Text>
            </View>
          );
        })}
      </View>

      {/* Coming Next */}
      {nextStep && (
        <View style={styles.nextSection}>
          <Text style={styles.nextLabel}>COMING NEXT: Step {nextStep.stepNumber}</Text>
          <Text style={styles.nextTitle}>&ldquo;{nextStep.title}&rdquo;</Text>
          <Text style={styles.nextHint}>
            Unlocks after completing Step {currentStep.stepNumber} goals
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },

  // Phase Banner
  phaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    gap: Spacing.md,
  },
  phaseIcon: {
    fontSize: 28,
  },
  phaseInfo: {
    flex: 1,
    gap: 2,
  },
  phaseLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    letterSpacing: 1,
  },
  phaseSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },

  // Current Step Card
  currentStepCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  currentStepLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  currentStepTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  currentStepQuote: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  taglineContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
  },
  taglineText: {
    fontSize: FontSizes.caption,
    color: Colors.secondary,
    fontWeight: '600',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Step Progress Dots
  dotsSection: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  dotsLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: 4,
  },
  dotWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    backgroundColor: Colors.primary,
  },
  dotCurrent: {
    borderWidth: 2.5,
    backgroundColor: Colors.surfaceElevated,
  },
  dotLocked: {
    backgroundColor: Colors.borderLight,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotCheck: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  dotNumber: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  dotNumberCurrent: {
    color: Colors.text,
    fontWeight: '700',
  },
  dotNumberCompleted: {
    color: Colors.primary,
    fontWeight: '700',
  },
  dotsProgress: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Step Goals
  goalsSection: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  goalsTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  goalCheckbox: {
    width: 20,
    height: 20,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCheckboxText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  goalText: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },

  // Coming Next
  nextSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
  },
  nextLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  nextTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    fontStyle: 'italic',
  },
  nextHint: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
});
