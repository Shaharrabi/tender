/**
 * StepAssessmentInsight — Mini-result card shown on step-detail screens.
 *
 * Displays an early personalized insight from a user's assessment scores
 * when they've completed a relevant assessment but don't yet have a
 * full portrait (which requires all 6 assessments).
 *
 * Lifecycle on step-detail:
 *   1. Assessment NOT done → AssessmentNudgeCard
 *   2. Assessment done, no portrait → THIS component
 *   3. Portrait exists → Portrait Bridge
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { SparkleIcon } from '@/assets/graphics/icons';
import type { EarlyInsight } from '@/utils/steps/early-insights';

// ─── Component ──────────────────────────────────────────

interface StepAssessmentInsightProps {
  insight: EarlyInsight;
  /** Phase accent color for the left border */
  phaseColor: string;
}

export default function StepAssessmentInsight({
  insight,
  phaseColor,
}: StepAssessmentInsightProps) {
  return (
    <View style={[styles.card, { borderLeftColor: phaseColor }]}>
      <View style={styles.header}>
        <SparkleIcon size={14} color={phaseColor} />
        <Text style={[styles.label, { color: phaseColor }]}>
          {insight.label.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.insightText}>{insight.text}</Text>
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
  label: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    letterSpacing: 1,
  },
  insightText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
});
