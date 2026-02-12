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

interface ExerciseCardProps {
  exercise: Intervention;
  onPress: () => void;
  /** Stagger delay in ms for entrance animation. Defaults to 0. */
  delay?: number;
}

// ─── Category Colors ─────────────────────────────────────
export const CATEGORY_ACCENT_COLORS: Record<InterventionCategory, string> = {
  regulation: '#6BA3A0',   // calm / teal
  communication: '#C4785B', // secondary / terracotta
  attachment: '#6B8F71',    // primary / sage
  values: '#D4A55A',        // accent / amber
  differentiation: '#5B6B8A', // depth / indigo
};

const CATEGORY_BADGE_COLORS: Record<
  InterventionCategory,
  { bg: string; text: string }
> = {
  regulation: { bg: '#E0F0F0', text: '#3D7A77' },
  communication: { bg: '#FAEAE3', text: '#9E5B3C' },
  attachment: { bg: '#E3EFE5', text: '#4A6F50' },
  values: { bg: '#F5EDD8', text: '#8B7030' },
  differentiation: { bg: '#E3E8F0', text: '#4A5872' },
};

// ─── Difficulty Colors ───────────────────────────────────
const DIFFICULTY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  beginner: {
    label: 'Beginner',
    color: '#4A6F50',
    bg: '#E3EFE5',
  },
  intermediate: {
    label: 'Intermediate',
    color: '#8B7030',
    bg: '#F5EDD8',
  },
  advanced: {
    label: 'Advanced',
    color: '#9E5B3C',
    bg: '#FAEAE3',
  },
};

// ─── Mode Icons (text-based) ─────────────────────────────
const MODE_CONFIG: Record<
  ExerciseMode,
  { icon: string; label: string; color: string; bg: string }
> = {
  solo: {
    icon: '\u{1F9D8}',
    label: 'Solo',
    color: '#3D7A77',
    bg: '#E0F0F0',
  },
  together: {
    icon: '\u{1F491}',
    label: 'Together',
    color: '#9E5B3C',
    bg: '#FAEAE3',
  },
  either: {
    icon: '\u{1F504}',
    label: 'Either',
    color: '#4A5872',
    bg: '#E3E8F0',
  },
};

export default function ExerciseCard({
  exercise,
  onPress,
  delay = 0,
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
      >
        {/* Category accent bar */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        {/* Card body */}
        <View style={styles.cardBody}>
          {/* Top row: category badge */}
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
              <Text style={styles.badgeIcon}>{'\u23F1'}</Text>
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
              <Text style={styles.badgeIcon}>{mode.icon}</Text>
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
    fontSize: 11,
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
