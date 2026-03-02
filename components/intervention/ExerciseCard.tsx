/**
 * ExerciseCard — Beautiful summary card for the exercise library.
 *
 * Features:
 * - Category-colored accent bar on the left edge
 * - Serif title, 2-line description preview
 * - Bottom row with duration badge, difficulty badge (color-coded),
 *   mode indicator, and step count
 * - Supports staggered entrance animation via the `delay` prop
 */

import React, { useEffect, useRef } from 'react';
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
import type {
  Intervention,
  InterventionCategory,
  ExerciseMode,
} from '@/types/intervention';
import {
  MeditationIcon,
  CoupleIcon,
  RefreshIcon,
  CheckmarkIcon,
  HourglassIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';

interface ExerciseCardProps {
  exercise: Intervention;
  onPress: () => void;
  /** Stagger delay in ms for entrance animation. Defaults to 0. */
  delay?: number;
  /** Number of times this exercise has been completed. 0 = never done. */
  completionCount?: number;
}

// ─── Category Colors ─────────────────────────────────────
export const CATEGORY_ACCENT_COLORS: Record<InterventionCategory, string> = {
  regulation: Colors.calm,          // calm / teal
  communication: Colors.secondary,  // secondary
  attachment: Colors.primary,       // primary
  values: Colors.accent,            // accent
  differentiation: Colors.depth,    // depth / indigo
};

const CATEGORY_BADGE_COLORS: Record<
  InterventionCategory,
  { bg: string; text: string }
> = {
  regulation: { bg: Colors.calmLight, text: Colors.calmDark },
  communication: { bg: Colors.accentLight, text: Colors.accentDark },
  attachment: { bg: Colors.successLight, text: Colors.successDark },
  values: { bg: Colors.warningFaded, text: Colors.warningDark },
  differentiation: { bg: Colors.depthLight, text: Colors.depthDark },
};

// ─── Difficulty Colors ───────────────────────────────────
const DIFFICULTY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  beginner: {
    label: 'Beginner',
    color: Colors.successDark,
    bg: Colors.successLight,
  },
  intermediate: {
    label: 'Intermediate',
    color: Colors.warningDark,
    bg: Colors.warningFaded,
  },
  advanced: {
    label: 'Advanced',
    color: Colors.accentDark,
    bg: Colors.accentLight,
  },
};

// ─── Mode Icons (SVG components) ─────────────────────────
const MODE_CONFIG: Record<
  ExerciseMode,
  { Icon: React.ComponentType<IconProps>; label: string; color: string; bg: string }
> = {
  solo: {
    Icon: MeditationIcon,
    label: 'Solo',
    color: Colors.calmDark,
    bg: Colors.calmLight,
  },
  together: {
    Icon: CoupleIcon,
    label: 'Together',
    color: Colors.accentDark,
    bg: Colors.accentLight,
  },
  either: {
    Icon: RefreshIcon,
    label: 'Either',
    color: Colors.depthDark,
    bg: Colors.depthLight,
  },
};

function ExerciseCard({
  exercise,
  onPress,
  delay = 0,
  completionCount = 0,
}: ExerciseCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, fadeAnim, translateY]);

  const accentColor = CATEGORY_ACCENT_COLORS[exercise.category];
  const categoryBadge = CATEGORY_BADGE_COLORS[exercise.category];
  const difficulty = DIFFICULTY_CONFIG[exercise.difficulty] ?? DIFFICULTY_CONFIG.beginner;
  const mode = MODE_CONFIG[exercise.mode] ?? MODE_CONFIG.either;

  return (
    <Animated.View
      style={[
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${exercise.title}, ${exercise.category}, ${exercise.duration} minutes, ${exercise.difficulty}${completionCount > 0 ? ', completed' : ''}`}
      >
        {/* Category accent bar */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        {/* Card body */}
        <View style={styles.cardBody}>
          {/* Top row: category badge + completion indicator */}
          <View style={styles.topRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: categoryBadge.bg },
              ]}
            >
              <Text style={[styles.categoryText, { color: categoryBadge.text }]}>
                {exercise.category}
              </Text>
            </View>
            {completionCount > 0 && (
              <View style={styles.completionBadge}>
                <CheckmarkIcon size={11} color={Colors.successDark} />
                <Text style={styles.completionText}>
                  {completionCount === 1 ? 'Done' : `${completionCount}×`}
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{exercise.title}</Text>

          {/* Description (2-line max) */}
          <Text style={styles.description} numberOfLines={2}>
            {exercise.description}
          </Text>

          {/* Bottom row: badges */}
          <View style={styles.bottomRow}>
            {/* Duration */}
            <View style={styles.badge}>
              <HourglassIcon size={11} color={Colors.textSecondary} />
              <Text style={styles.badgeText}>{exercise.duration} min</Text>
            </View>

            {/* Difficulty */}
            <View
              style={[styles.badge, { backgroundColor: difficulty.bg }]}
            >
              <Text style={[styles.badgeText, { color: difficulty.color }]}>
                {difficulty.label}
              </Text>
            </View>

            {/* Mode */}
            <View style={[styles.badge, { backgroundColor: mode.bg }]}>
              <mode.Icon size={11} color={mode.color} />
              <Text style={[styles.badgeText, { color: mode.color }]}>
                {mode.label}
              </Text>
            </View>

            {/* Spacer pushes step count right */}
            <View style={{ flex: 1 }} />

            {/* Steps */}
            <Text style={styles.stepCount}>
              {exercise.steps.length} steps
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default React.memo(ExerciseCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.card,
  },

  // Accent bar on left
  accentBar: {
    width: 5,
  },

  // Body content
  cardBody: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // Completion badge
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    gap: 3,
  },
  completionIcon: {
  },
  completionText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.successDark,
  },

  // Title & description
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginTop: 2,
  },
  description: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Bottom row
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },

  // Generic badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surface,
    gap: 4,
  },
  badgeIcon: {
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // Step count
  stepCount: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
