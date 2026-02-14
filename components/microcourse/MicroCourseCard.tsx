/**
 * MicroCourseCard — Course discovery and progress card.
 *
 * Shows course title, subtitle, progress bar, estimated time,
 * and handles locked/in-progress/completed states.
 */

import React from 'react';
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
import type { MicroCourse, CourseProgress } from '@/utils/microcourses/course-registry';

// ─── Icons (emoji-based for simplicity) ─────────────────

const COURSE_ICONS: Record<string, string> = {
  'heart-pulse': '\u{1F493}',
  'brain': '\u{1F9E0}',
  'refresh-cw': '\u{1F504}',
  'shield': '\u{1F6E1}\uFE0F',
  'wind': '\u{1F32C}\uFE0F',
  'compass': '\u{1F9ED}',
};

// ─── Props ──────────────────────────────────────────────

interface MicroCourseCardProps {
  course: MicroCourse;
  progress: CourseProgress;
  isLocked: boolean;
  onPress: () => void;
  /** Compact mode for home screen embedding */
  compact?: boolean;
}

// ─── Component ──────────────────────────────────────────

export default function MicroCourseCard({
  course,
  progress,
  isLocked,
  onPress,
  compact = false,
}: MicroCourseCardProps) {
  const isCompleted = progress.lessonsCompleted >= course.totalLessons;
  const isStarted = progress.lessonsCompleted > 0;
  const progressPercent = progress.lessonsCompleted / course.totalLessons;
  const minutesRemaining = Math.round(
    (course.totalLessons - progress.lessonsCompleted) *
      (course.estimatedMinutes / course.totalLessons)
  );

  const icon = COURSE_ICONS[course.icon] ?? '\u{1F4D6}';

  // ─── Compact mode (home screen) ──────────────────

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, isLocked && styles.lockedCard]}
        onPress={onPress}
        activeOpacity={isLocked ? 1 : 0.7}
        disabled={isLocked}
      >
        <View style={styles.compactLeft}>
          <Text style={styles.compactIcon}>{icon}</Text>
          <View style={styles.compactText}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {course.title}
            </Text>
            <Text style={styles.compactSub}>
              {isCompleted
                ? 'Completed \u2713'
                : `Lesson ${progress.lessonsCompleted + 1} of ${course.totalLessons}`}
            </Text>
          </View>
        </View>

        {/* Mini progress bar */}
        <View style={styles.compactProgressTrack}>
          <View
            style={[
              styles.compactProgressFill,
              { width: `${progressPercent * 100}%` },
              isCompleted && styles.completedFill,
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  }

  // ─── Full mode ───────────────────────────────────

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isLocked && styles.lockedCard,
        isCompleted && styles.completedCard,
      ]}
      onPress={onPress}
      activeOpacity={isLocked ? 1 : 0.7}
      disabled={isLocked}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={[styles.iconCircle, isLocked && styles.iconCircleLocked]}>
          <Text style={styles.iconText}>
            {isLocked ? '\u{1F512}' : icon}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text
            style={[styles.title, isLocked && styles.lockedText]}
            numberOfLines={2}
          >
            {course.title}
          </Text>
          <Text
            style={[styles.subtitle, isLocked && styles.lockedText]}
            numberOfLines={2}
          >
            {course.subtitle}
          </Text>
        </View>
      </View>

      {/* Progress section */}
      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent * 100}%` },
              isCompleted && styles.completedFill,
            ]}
          />
        </View>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, isLocked && styles.lockedText]}>
            {isCompleted
              ? 'Completed \u2713'
              : isStarted
                ? `${progress.lessonsCompleted}/${course.totalLessons} lessons`
                : `${course.totalLessons} lessons`}
          </Text>
          <Text style={[styles.timeText, isLocked && styles.lockedText]}>
            {isCompleted
              ? ''
              : isStarted
                ? `~${minutesRemaining} min left`
                : `~${course.estimatedMinutes} min`}
          </Text>
        </View>
      </View>

      {/* Action button */}
      {!isLocked && (
        <View style={styles.buttonRow}>
          <View
            style={[
              styles.actionButton,
              isCompleted && styles.completedButton,
            ]}
          >
            <Text
              style={[
                styles.actionButtonText,
                isCompleted && styles.completedButtonText,
              ]}
            >
              {isCompleted
                ? 'Review'
                : isStarted
                  ? 'Continue'
                  : 'Start Course'}
            </Text>
          </View>
        </View>
      )}

      {/* Locked message */}
      {isLocked && (
        <Text style={styles.lockedMessage}>
          Complete prerequisites to unlock
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  // ─── Full card ──────────────────────────────
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.md,
  },
  completedCard: {
    borderColor: Colors.success + '40',
    backgroundColor: Colors.success + '08',
  },
  lockedCard: {
    opacity: 0.6,
  },

  // ─── Header ─────────────────────────────────
  header: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleLocked: {
    backgroundColor: Colors.border,
  },
  iconText: {
    fontSize: 22,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // ─── Progress ───────────────────────────────
  progressSection: {
    gap: Spacing.xs,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  completedFill: {
    backgroundColor: Colors.success,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.primary,
  },
  timeText: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },

  // ─── Button ─────────────────────────────────
  buttonRow: {
    alignItems: 'flex-start',
  },
  actionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
  },
  completedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.success,
  },
  actionButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },
  completedButtonText: {
    color: Colors.success,
  },

  // ─── Locked ─────────────────────────────────
  lockedText: {
    color: Colors.textMuted,
  },
  lockedMessage: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  // ─── Compact card ───────────────────────────
  compactCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.sm,
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  compactIcon: {
    fontSize: 20,
  },
  compactText: {
    flex: 1,
  },
  compactTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  compactSub: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  compactProgressTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  compactProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
