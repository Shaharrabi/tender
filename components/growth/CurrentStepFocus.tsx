/**
 * CurrentStepFocus — Hero card for the journey screen.
 *
 * Shows the user's active step with:
 * - Phase badge + step number + title
 * - Days on step / minimum duration
 * - Transition criteria progress ring
 * - Reflection count
 * - "Continue Your Step" CTA
 *
 * This is the first thing the user sees on the journey screen,
 * giving immediate context and a clear next action.
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
  TWELVE_STEPS,
  HEALING_PHASES,
  getPhaseForStep,
} from '@/utils/steps/twelve-steps';
import CheckmarkIcon from '@/assets/graphics/icons/CheckmarkIcon';
import { StepSticker } from '@/components/growth/stickers';
import type { StepProgress } from '@/types/growth';

interface CurrentStepFocusProps {
  stepProgress: StepProgress[];
  currentStepNumber: number;
  onContinue: (stepNumber: number) => void;
}

export default function CurrentStepFocus({
  stepProgress,
  currentStepNumber,
  onContinue,
}: CurrentStepFocusProps) {
  const step = TWELVE_STEPS.find((s) => s.stepNumber === currentStepNumber);
  const phase = getPhaseForStep(currentStepNumber);
  const progress = stepProgress.find((sp) => sp.stepNumber === currentStepNumber);

  // Calculate days on this step
  const daysOnStep = useMemo(() => {
    if (!progress?.startedAt) return 0;
    const started = new Date(progress.startedAt);
    const now = new Date();
    return Math.floor((now.getTime() - started.getTime()) / (1000 * 60 * 60 * 24));
  }, [progress?.startedAt]);

  // Calculate transition criteria completion
  const criteriaProgress = useMemo(() => {
    if (!step) return { completed: 0, total: 0 };
    const notes = progress?.reflectionNotes as Record<string, any> | undefined;
    const completedCriteria: number[] = notes?.completedCriteria ?? [];
    return {
      completed: completedCriteria.length,
      total: step.completionCriteria.length,
    };
  }, [step, progress?.reflectionNotes]);

  // Reflection count
  const reflectionCount = useMemo(() => {
    const notes = progress?.reflectionNotes as Record<string, any> | undefined;
    const reflections = notes?.reflections ?? {};
    return Object.values(reflections).filter((v) => typeof v === 'string' && v.trim().length > 0).length;
  }, [progress?.reflectionNotes]);

  const totalReflections = step?.reflectionPrompts?.length ?? 0;

  if (!step || !phase) return null;

  // All 12 steps completed
  const allCompleted = stepProgress.filter((sp) => sp.status === 'completed').length === 12;
  if (allCompleted) {
    return (
      <View style={[styles.card, { borderLeftColor: Colors.success }]}>
        <View style={styles.completedHeader}>
          <View style={[styles.completedBadge, { backgroundColor: Colors.success }]}>
            <CheckmarkIcon size={16} color={Colors.white} />
          </View>
          <View style={styles.completedTextWrap}>
            <Text style={styles.completedTitle}>Journey Complete</Text>
            <Text style={styles.completedSubtitle}>
              All 12 steps completed. Your relationship is a refuge.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: Colors.success }]}
          onPress={() => onContinue(12)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Review Step 12: Become a Refuge"
        >
          <Text style={styles.ctaText}>Review Your Journey</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const phaseColor = phase.color;
  const progressPercent = criteriaProgress.total > 0
    ? Math.round((criteriaProgress.completed / criteriaProgress.total) * 100)
    : 0;

  return (
    <View style={[styles.card, { borderLeftColor: phaseColor }]}>
      {/* Phase badge */}
      <View style={styles.topRow}>
        <View style={[styles.phaseBadge, { backgroundColor: phaseColor + '18' }]}>
          <phase.icon size={14} color={phaseColor} />
          <Text style={[styles.phaseBadgeText, { color: phaseColor }]}>
            {phase.name.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.daysText}>
          Day {daysOnStep + 1}
        </Text>
      </View>

      {/* Step title + sticker */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <View style={styles.titleTextWrap}>
            <Text style={styles.stepLabel}>Step {currentStepNumber}</Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            {step.subtitle && (
              <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            )}
          </View>
          <StepSticker stepNumber={currentStepNumber} size={64} showLabel={false} />
        </View>
      </View>

      {/* Progress stats row */}
      <View style={styles.statsRow}>
        {/* Criteria progress */}
        <View style={styles.statItem}>
          <View style={[styles.progressRing, { borderColor: phaseColor + '30' }]}>
            <Text style={[styles.progressNumber, { color: phaseColor }]}>
              {criteriaProgress.completed}
            </Text>
          </View>
          <Text style={styles.statLabel}>
            of {criteriaProgress.total} milestones
          </Text>
        </View>

        {/* Reflections */}
        <View style={styles.statItem}>
          <View style={[styles.progressRing, { borderColor: Colors.secondary + '30' }]}>
            <Text style={[styles.progressNumber, { color: Colors.secondary }]}>
              {reflectionCount}
            </Text>
          </View>
          <Text style={styles.statLabel}>
            of {totalReflections} reflections
          </Text>
        </View>

        {/* Progress percentage */}
        <View style={styles.statItem}>
          <View style={[styles.progressRing, { borderColor: Colors.calm + '30' }]}>
            <Text style={[styles.progressNumber, { color: Colors.calm }]}>
              {progressPercent}%
            </Text>
          </View>
          <Text style={styles.statLabel}>
            complete
          </Text>
        </View>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.ctaButton, { backgroundColor: phaseColor }]}
        onPress={() => onContinue(currentStepNumber)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Continue Step ${currentStepNumber}: ${step.title}`}
      >
        <Text style={styles.ctaText}>Continue Your Step</Text>
        <Text style={styles.ctaArrow}>{'\u203A'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    gap: Spacing.md,
    ...Shadows.card,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  phaseBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  daysText: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // Title
  titleSection: {
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  titleTextWrap: {
    flex: 1,
    gap: 3,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  stepSubtitle: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xs,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  progressRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  progressNumber: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
    textAlign: 'center',
  },

  // CTA
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.pill,
    gap: Spacing.xs,
  },
  ctaText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },
  ctaArrow: {
    fontSize: FontSizes.headingM,
    color: Colors.textOnPrimary,
    fontWeight: '400',
  },

  // Completed state
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  completedBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedTextWrap: {
    flex: 1,
    gap: 2,
  },
  completedTitle: {
    fontSize: FontSizes.headingS,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  completedSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
