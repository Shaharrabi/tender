/**
 * StepProgressTracker — 5-stage tab bar for step detail.
 *
 * Read → Explore → Practice → Reflect → Complete
 *
 * Uses app SVG icons (not Unicode emojis) for consistent rendering.
 * Acts as real tab navigation — all tabs tappable, active tab highlighted.
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
import {
  BookOpenIcon,
  CompassIcon,
  MeditationIcon,
  PenIcon,
  SparkleIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons/types';

interface StageConfig {
  label: string;
  Icon: React.ComponentType<IconProps>;
}

const STAGES: StageConfig[] = [
  { label: 'Read', Icon: BookOpenIcon },
  { label: 'Explore', Icon: CompassIcon },
  { label: 'Practice', Icon: MeditationIcon },
  { label: 'Reflect', Icon: PenIcon },
  { label: 'Complete', Icon: SparkleIcon },
];

interface StepProgressTrackerProps {
  currentStage: number;   // progress level (0-4, based on completion)
  activeTab: number;      // which tab is currently being viewed
  phaseColor: string;
  onStagePress?: (stageIndex: number) => void;
}

export default function StepProgressTracker({
  currentStage,
  activeTab,
  phaseColor,
  onStagePress,
}: StepProgressTrackerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.trackRow}>
        {STAGES.map((stage, i) => {
          const isDone = i < currentStage;
          const isActive = i === activeTab;

          return (
            <TouchableOpacity
              key={stage.label}
              style={styles.stageItem}
              onPress={() => onStagePress?.(i)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${stage.label}${isActive ? ', selected' : isDone ? ', done' : ''}`}
            >
              <View style={[
                styles.barSegment,
                { backgroundColor: isDone || i <= currentStage ? phaseColor : Colors.borderLight },
                i > currentStage && { opacity: 0.3 },
                isActive && { height: 5 },
              ]} />
              <View style={styles.stageRow}>
                <stage.Icon
                  size={12}
                  color={isActive ? phaseColor : Colors.textMuted}
                />
                <TenderText
                  variant="caption"
                  color={isActive ? phaseColor : Colors.textMuted}
                  style={[
                    styles.stageLabel,
                    isActive && styles.stageLabelActive,
                  ]}
                >
                  {stage.label}
                </TenderText>
              </View>
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
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  stageLabel: {
    fontSize: 9,
    letterSpacing: 0.8,
  },
  stageLabelActive: {
    fontWeight: '700',
  },
});
