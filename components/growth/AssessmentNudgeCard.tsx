/**
 * AssessmentNudgeCard — Gentle invitation to take/retake assessments
 * that deepen a specific step's work.
 *
 * Shown on step-detail when relevant assessments haven't been completed
 * (or when it's a retake step like 11/12). Warm, inviting tone.
 *
 * Rules:
 *   - NEVER blocks step progression
 *   - NEVER says "you need to" or "you should"
 *   - Couple assessments hidden for solo users
 *   - Retake nudges always show (even if previously completed)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import { SparkleIcon, RefreshIcon } from '@/assets/graphics/icons';
import TenderButton from '@/components/ui/TenderButton';
import type { StepAssessmentNudge } from '@/utils/steps/twelve-steps';

// ─── Component ──────────────────────────────────────────

interface AssessmentNudgeCardProps {
  nudge: StepAssessmentNudge;
  /** Phase accent color for the left border */
  phaseColor: string;
  /** Assessment IDs already completed by the user */
  completedAssessmentIds: string[];
  /** Whether user is in solo mode (hides couple-only nudges) */
  isSolo: boolean;
}

function AssessmentNudgeCard({
  nudge,
  phaseColor,
  completedAssessmentIds,
  isSolo,
}: AssessmentNudgeCardProps) {
  const router = useRouter();

  // ── Visibility checks ──────────────────────────────────
  // Hide couple-only nudges for solo users
  if (nudge.coupleOnly && isSolo) return null;

  // For non-retake nudges: hide if ALL relevant assessments are done
  if (!nudge.isRetake) {
    const allDone = nudge.assessmentIds.every((id) =>
      completedAssessmentIds.includes(id),
    );
    if (allDone) return null;
  }

  // ── Determine which assessment to navigate to ──────────
  const handlePress = () => {
    if (nudge.isRetake) {
      // For retake, go to first assessment in the list
      router.push({
        pathname: '/(app)/assessment',
        params: { type: nudge.assessmentIds[0] },
      } as any);
    } else {
      // Navigate to the first incomplete assessment
      const nextIncomplete = nudge.assessmentIds.find(
        (id) => !completedAssessmentIds.includes(id),
      );
      if (nextIncomplete) {
        router.push({
          pathname: '/(app)/assessment',
          params: { type: nextIncomplete },
        } as any);
      }
    }
  };

  const IconComponent = nudge.isRetake ? RefreshIcon : SparkleIcon;

  return (
    <View style={[styles.card, { borderLeftColor: phaseColor }]}>
      <View style={styles.header}>
        <IconComponent size={16} color={phaseColor} />
        <Text style={[styles.eyebrow, { color: phaseColor }]}>
          {nudge.isRetake ? 'REVISIT YOUR ASSESSMENTS' : 'DEEPEN THIS STEP'}
        </Text>
      </View>
      <Text style={styles.nudgeText}>{nudge.nudgeText}</Text>
      <View style={styles.ctaRow}>
        <TenderButton
          title={nudge.ctaLabel}
          onPress={handlePress}
          variant="outline"
          size="sm"
        />
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  eyebrow: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    letterSpacing: 1,
  },
  nudgeText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  ctaRow: {
    marginTop: Spacing.xs,
    alignItems: 'flex-start',
  },
});

export default React.memo(AssessmentNudgeCard);
