/**
 * StepJourney — Twelve Steps Journey Map
 *
 * Clean, single-purpose component:
 * - Steps grouped by 5 healing phases with WEARE descriptions
 * - Each step: status dot, title, tap → navigates to step-detail
 * - Active step highlighted, locked steps dimmed
 * - No inline expanded content — all detail lives in step-detail.tsx
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import { StepSticker } from '@/components/growth/stickers';
import type { StepProgress } from '@/types/growth';
import {
  TWELVE_STEPS,
  HEALING_PHASES,
  getPhaseForStep,
} from '@/utils/steps/twelve-steps';
import { getStepAccess } from '@/utils/steps/step-gating';

/** WEARE-phase descriptions — what each phase develops */
const PHASE_WEARE_DESCRIPTIONS: Record<string, string> = {
  seeing: 'This phase develops your capacity to sense what\'s here — in yourself and in the space between you.',
  feeling: 'This phase develops your capacity to make contact with what\'s underneath — openness and willingness to grow.',
  shifting: 'This phase develops your capacity to create something new together — from understanding to action.',
  integrating: 'This phase develops your capacity to practice consistently — investing time in a supportive environment.',
  sustaining: 'This phase develops your capacity for flexibility — reducing rigidity and maintaining what you\'ve built.',
};

interface Props {
  stepProgress: StepProgress[];
  currentStepNumber: number;
  /** Navigate to the step-detail screen */
  onNavigateToStep?: (stepNumber: number) => void;
  /** Whether user is in a couple */
  isCoupled?: boolean;
  /** Completed individual assessment type IDs */
  completedIndividual?: string[];
  /** Completed couple assessment type IDs */
  completedCouple?: string[];
}

export default function StepJourney({
  stepProgress,
  currentStepNumber,
  onNavigateToStep,
  isCoupled = false,
  completedIndividual = [],
  completedCouple = [],
}: Props) {
  const getStepStatus = (stepNumber: number) => {
    // Check assessment gate FIRST
    const access = getStepAccess(stepNumber, completedIndividual, completedCouple);
    if (!access.isAccessible) return 'locked';

    // Then check DB progress status
    const progress = stepProgress.find((sp) => sp.stepNumber === stepNumber);
    return progress?.status ?? 'locked';
  };

  return (
    <View style={styles.container}>
      {/* Phase-Grouped Steps */}
      {HEALING_PHASES.map((phase) => {
        const phaseSteps = TWELVE_STEPS.filter(
          (s) =>
            s.stepNumber >= phase.stepRange[0] &&
            s.stepNumber <= phase.stepRange[1]
        );

        if (phaseSteps.length === 0) return null;

        const weareDesc = PHASE_WEARE_DESCRIPTIONS[phase.id];

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
                {weareDesc && (
                  <Text style={styles.phaseWeareDesc}>{weareDesc}</Text>
                )}
              </View>
            </View>

            {/* Steps in this phase */}
            {phaseSteps.map((step) => {
              const status = getStepStatus(step.stepNumber);
              const isCurrent = step.stepNumber === currentStepNumber;
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';
              const stepPhase = getPhaseForStep(step.stepNumber);
              const phaseColor = stepPhase?.color ?? Colors.primary;

              // Get unlock info for locked steps
              const unlockInfo = isLocked
                ? getStepAccess(step.stepNumber, completedIndividual, completedCouple)
                : null;

              return (
                <TouchableOpacity
                  key={step.stepNumber}
                  onPress={() => {
                    if (!isLocked && onNavigateToStep) {
                      onNavigateToStep(step.stepNumber);
                    }
                  }}
                  activeOpacity={isLocked ? 1 : 0.7}
                  disabled={isLocked}
                  accessibilityRole="button"
                  accessibilityLabel={`Step ${step.stepNumber}, ${step.title}${isLocked ? ', locked' : isCurrent ? ', active' : isCompleted ? ', completed' : ''}`}
                  accessibilityState={{ disabled: isLocked }}
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
                  {/* Status indicator — sticker for active/completed, dot for locked */}
                  {isLocked ? (
                    <View style={[styles.stepDot, styles.stepDotLocked]} />
                  ) : (
                    <View style={[styles.stepStickerWrap, isCompleted && { opacity: 0.6 }]}>
                      <StepSticker stepNumber={step.stepNumber} size={36} showLabel={false} animated={false} />
                      {isCompleted && (
                        <View style={[styles.stepStickerCheck, { backgroundColor: phaseColor }]}>
                          <CheckmarkIcon size={8} color={Colors.white} />
                        </View>
                      )}
                    </View>
                  )}

                  {/* Step title + hint */}
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
                      numberOfLines={1}
                    >
                      {step.title}
                    </Text>
                    {isCurrent && (
                      <Text style={[styles.stepHint, { color: phaseColor }]}>
                        Tap to continue
                      </Text>
                    )}
                    {isLocked && unlockInfo?.nextAssessmentName && (
                      <Text style={[styles.stepHint, { color: Colors.textMuted }]}>
                        Unlocks with: {unlockInfo.nextAssessmentName}
                      </Text>
                    )}
                  </View>

                  {/* Arrow for navigable steps */}
                  {!isLocked && (
                    <Text style={[styles.arrow, { color: phaseColor }]}>
                      {'\u203A'}
                    </Text>
                  )}
                </TouchableOpacity>
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

  // Phase Group
  phaseGroup: {
    gap: 2,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    gap: Spacing.sm,
    marginBottom: 4,
  },
  phaseHeaderInfo: {
    flex: 1,
    gap: 2,
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
  phaseWeareDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontFamily: FontFamilies.body,
    fontStyle: 'italic',
    lineHeight: 18,
    marginTop: 2,
  },

  // Step Row
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    marginBottom: 2,
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

  // Step sticker (replaces dot for active/completed)
  stepStickerWrap: {
    width: 36,
    height: 36,
    borderRadius: 6,
    overflow: 'hidden' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  stepStickerCheck: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  // Step Dot (locked only)
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
  stepHint: {
    fontSize: FontSizes.caption,
    fontWeight: '500',
    marginTop: 1,
  },
  textDimmed: {
    opacity: 0.55,
  },

  // Arrow
  arrow: {
    fontSize: FontSizes.headingL,
    fontWeight: '300',
  },
});
