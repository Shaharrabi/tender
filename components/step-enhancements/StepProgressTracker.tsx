/**
 * StepProgressTracker — 5-stage sticky progress bar.
 *
 * Read → Explore → Practice → Reflect → Complete
 *
 * Verified:
 *   Colors.background = '#FDF6F0', Colors.borderLight = '#F0E6E0'
 *   Colors.textMuted = '#6B5E61'
 *   Spacing.sm = 8, Spacing.md = 16
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing } from '@/constants/theme';

const STAGES = ['Read', 'Explore', 'Practice', 'Reflect', 'Complete'] as const;

interface StepProgressTrackerProps {
  currentStage: number;
  phaseColor: string;
  onStagePress?: (stageIndex: number) => void;
}

export default function StepProgressTracker({
  currentStage,
  phaseColor,
  onStagePress,
}: StepProgressTrackerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.trackRow}>
        {STAGES.map((label, i) => {
          const isDone = i < currentStage;
          const isCurrent = i === currentStage;
          const isFuture = i > currentStage;

          return (
            <TouchableOpacity
              key={label}
              style={styles.stageItem}
              onPress={() => !isFuture && onStagePress?.(i)}
              activeOpacity={isFuture ? 1 : 0.7}
              disabled={isFuture}
              accessibilityRole="button"
              accessibilityLabel={`${label}${isCurrent ? ', current' : isDone ? ', done' : ''}`}
            >
              <View style={[
                styles.barSegment,
                { backgroundColor: isDone || isCurrent ? phaseColor : Colors.borderLight },
                isFuture && { opacity: 0.4 },
              ]} />
              <TenderText
                variant="caption"
                color={isCurrent ? phaseColor : Colors.textMuted}
                style={[
                  styles.stageLabel,
                  isCurrent && styles.stageLabelActive,
                  isFuture && { opacity: 0.4 },
                ]}
              >
                {label}
              </TenderText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/** Compute current stage from step-detail state. */
export function computeStepStage(opts: {
  hasScrolledTeaching: boolean;
  hasMiniGameOutput: boolean;
  hasCompletedPractice: boolean;
  hasReflection: boolean;
  isStepCompleted: boolean;
}): number {
  if (opts.isStepCompleted) return 4;
  if (opts.hasReflection) return 3;
  if (opts.hasCompletedPractice) return 2;
  if (opts.hasMiniGameOutput || opts.hasScrolledTeaching) return 1;
  return 0;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  trackRow: {
    flexDirection: 'row',
    gap: 4,
  },
  stageItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barSegment: {
    height: 4,
    width: '100%',
    borderRadius: 2,
  },
  stageLabel: {
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  stageLabelActive: {
    fontWeight: '700',
  },
});
