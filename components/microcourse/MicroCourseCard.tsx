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
import {
  HeartPulseIcon,
  BrainIcon,
  RefreshIcon,
  ShieldIcon,
  WindIcon,
  CompassIcon,
  PhoneIcon,
  MeditationIcon,
  SparkleIcon,
  EyeIcon,
  BookOpenIcon,
  LockIcon,
  CheckmarkIcon,
  SunIcon,
  ChatBubbleIcon,
  HeartIcon,
  FlagIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';

// ─── Icons (SVG components) ─────────────────────────────

const COURSE_ICONS: Record<string, React.ComponentType<IconProps>> = {
  'heart-pulse': HeartPulseIcon,
  'brain': BrainIcon,
  'refresh-cw': RefreshIcon,
  'shield': ShieldIcon,
  'wind': WindIcon,
  'compass': CompassIcon,
  'phone': PhoneIcon,
  'meditation': MeditationIcon,
  'sparkle': SparkleIcon,
  'eye': EyeIcon,
  'sun': SunIcon,
  'chat-bubble': ChatBubbleIcon,
  'heart': HeartIcon,
  'flag': FlagIcon,
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

  const IconComponent = COURSE_ICONS[course.icon] ?? BookOpenIcon;

  // ─── Compact mode (home screen) ──────────────────

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, isLocked && styles.lockedCard]}
        onPress={onPress}
        activeOpacity={isLocked ? 1 : 0.7}
        disabled={isLocked}
        accessibilityRole="button"
        accessibilityLabel={`${course.title}. ${isCompleted ? 'Completed' : `Lesson ${progress.lessonsCompleted + 1} of ${course.totalLessons}`}${isLocked ? '. Locked' : ''}`}
        accessibilityState={{ disabled: isLocked }}
      >
        <View style={styles.compactLeft}>
          <View style={styles.compactIcon}>
            <IconComponent size={20} color={Colors.primary} />
          </View>
          <View style={styles.compactText}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {course.title}
            </Text>
            {isCompleted ? (
              <View style={styles.completedRow}>
                <Text style={styles.compactSub}>Completed</Text>
                <CheckmarkIcon size={12} color={Colors.success} />
              </View>
            ) : (
              <Text style={styles.compactSub}>
                {`Lesson ${progress.lessonsCompleted + 1} of ${course.totalLessons}`}
              </Text>
            )}
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
      accessibilityRole="button"
      accessibilityLabel={`${course.title}. ${isCompleted ? 'Completed' : isStarted ? `${progress.lessonsCompleted} of ${course.totalLessons} lessons` : `${course.totalLessons} lessons, approximately ${course.estimatedMinutes} minutes`}${isLocked ? '. Locked, complete prerequisites to unlock' : ''}`}
      accessibilityState={{ disabled: isLocked }}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={[styles.iconCircle, isLocked && styles.iconCircleLocked]}>
          {isLocked ? (
            <LockIcon size={22} color={Colors.textMuted} />
          ) : (
            <IconComponent size={22} color={Colors.primary} />
          )}
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
          <View style={styles.progressTextRow}>
            {isCompleted ? (
              <>
                <Text style={[styles.progressText, isLocked && styles.lockedText]}>Completed</Text>
                <CheckmarkIcon size={12} color={Colors.success} />
              </>
            ) : (
              <Text style={[styles.progressText, isLocked && styles.lockedText]}>
                {isStarted
                  ? `${progress.lessonsCompleted}/${course.totalLessons} lessons`
                  : `${course.totalLessons} lessons`}
              </Text>
            )}
          </View>
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
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
