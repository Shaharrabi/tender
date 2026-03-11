/**
 * StepProgressTracker — 5-stage tab bar for step detail.
 *
 * Read → Explore → Practice → Reflect → Complete
 *
 * Uses app SVG icons with gentle pulse animation on active tab.
 * Icons centered in small tinted circles for visual consistency.
 *
 * Acts as real tab navigation — all tabs tappable, active tab highlighted.
 */

import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
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

/** Animated icon with circle background — pulses gently when active */
function AnimatedStageIcon({
  Icon,
  isActive,
  phaseColor,
}: {
  Icon: React.ComponentType<IconProps>;
  isActive: boolean;
  phaseColor: string;
}) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.18, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false
      );
    } else {
      pulse.value = withTiming(1, { duration: 300 });
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.iconCircle,
        {
          backgroundColor: isActive ? phaseColor + '18' : 'transparent',
          borderColor: isActive ? phaseColor + '40' : Colors.borderLight,
          borderWidth: isActive ? 1.5 : 0.5,
        },
        animatedStyle,
      ]}
    >
      <Icon size={13} color={isActive ? phaseColor : Colors.textMuted} />
    </Animated.View>
  );
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
                { backgroundColor: isDone || isActive ? phaseColor : Colors.borderLight },
                !isDone && !isActive && { opacity: 0.3 },
                isActive && { height: 5 },
              ]} />
              <AnimatedStageIcon
                Icon={stage.Icon}
                isActive={isActive}
                phaseColor={phaseColor}
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
    gap: 3,
  },
  barSegment: {
    height: 4,
    width: '100%',
    borderRadius: 2,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageLabel: {
    fontSize: 9,
    letterSpacing: 0.8,
  },
  stageLabelActive: {
    fontWeight: '700',
  },
});
