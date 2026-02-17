/**
 * JournalActivitySummary — Shows today's activities below the calendar.
 *
 * Displays three sections in the journal's blue-accent style:
 *   1. Daily Check-In status (compact summary or "not yet" prompt)
 *   2. Today's Practice (from weekly practice schedule)
 *   3. Active Micro-Course (compact progress card)
 *
 * Wes Anderson aesthetic with lobby blue accents, straight (non-italic) text.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  HeartIcon,
  SparkleIcon,
  BookOpenIcon,
  CheckmarkIcon,
} from '@/assets/graphics/icons';
import type { DailyCheckIn } from '@/types/growth';
import type { Intervention } from '@/types/intervention';
import type { MicroCourse, CourseProgress } from '@/utils/microcourses/course-registry';

// ─── Blue accent for journal ────────────────────────────
const JOURNAL_BLUE = Colors.secondary; // #7294D4

// ─── Props ──────────────────────────────────────────────

interface JournalActivitySummaryProps {
  todaysCheckIn: DailyCheckIn | null;
  todaysPractice: Intervention | null;
  activeCourse: { course: MicroCourse; progress: CourseProgress } | null;
  onPressPractice?: () => void;
  onPressCourse?: () => void;
}

// ─── Component ──────────────────────────────────────────

export default function JournalActivitySummary({
  todaysCheckIn,
  todaysPractice,
  activeCourse,
  onPressPractice,
  onPressCourse,
}: JournalActivitySummaryProps) {
  const hasAnyContent = todaysCheckIn || todaysPractice || activeCourse;

  if (!hasAnyContent) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Today's Activity</Text>

      {/* ── Daily Check-In ──────────────────────────── */}
      {todaysCheckIn && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBadge}>
              <HeartIcon size={12} color={JOURNAL_BLUE} />
            </View>
            <Text style={styles.cardTitle}>Daily Check-In</Text>
            <View style={styles.doneBadge}>
              <CheckmarkIcon size={10} color={Colors.success} />
              <Text style={styles.doneText}>Done</Text>
            </View>
          </View>
          <View style={styles.checkInRow}>
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>Inner State</Text>
              <Text style={styles.checkInValue}>{todaysCheckIn.moodRating}/10</Text>
            </View>
            <View style={styles.checkInDivider} />
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>Connection</Text>
              <Text style={styles.checkInValue}>{todaysCheckIn.relationshipRating}/10</Text>
            </View>
            <View style={styles.checkInDivider} />
            <View style={styles.checkInItem}>
              <Text style={styles.checkInLabel}>Practiced</Text>
              <Text style={styles.checkInValue}>
                {todaysCheckIn.practicedGrowthEdge ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
          {todaysCheckIn.note ? (
            <Text style={styles.checkInNote} numberOfLines={3}>
              {todaysCheckIn.note}
            </Text>
          ) : null}
        </View>
      )}

      {/* ── Today's Practice ─────────────────────────── */}
      {todaysPractice && (
        <TouchableOpacity
          style={styles.card}
          onPress={onPressPractice}
          activeOpacity={onPressPractice ? 0.7 : 1}
          disabled={!onPressPractice}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconBadge}>
              <SparkleIcon size={12} color={JOURNAL_BLUE} />
            </View>
            <Text style={styles.cardTitle}>Today's Practice</Text>
            {todaysPractice.duration ? (
              <Text style={styles.metaText}>{todaysPractice.duration} min</Text>
            ) : null}
          </View>
          <Text style={styles.practiceTitle}>{todaysPractice.title}</Text>
          {todaysPractice.description ? (
            <Text style={styles.practiceDesc} numberOfLines={2}>
              {todaysPractice.description}
            </Text>
          ) : null}
        </TouchableOpacity>
      )}

      {/* ── Active Micro-Course ──────────────────────── */}
      {activeCourse && (
        <TouchableOpacity
          style={styles.card}
          onPress={onPressCourse}
          activeOpacity={onPressCourse ? 0.7 : 1}
          disabled={!onPressCourse}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconBadge}>
              <BookOpenIcon size={12} color={JOURNAL_BLUE} />
            </View>
            <Text style={styles.cardTitle}>Mini Course</Text>
            <Text style={styles.metaText}>
              {activeCourse.progress.lessonsCompleted}/{activeCourse.progress.totalLessons} lessons
            </Text>
          </View>
          <Text style={styles.practiceTitle}>{activeCourse.course.title}</Text>
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(activeCourse.progress.lessonsCompleted / activeCourse.progress.totalLessons) * 100}%`,
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  sectionHeader: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.headingM,
    color: Colors.text,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },

  // Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: JOURNAL_BLUE,
    ...Shadows.subtle,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${JOURNAL_BLUE}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    letterSpacing: 0.3,
    flex: 1,
  },

  // Done badge
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    backgroundColor: `${Colors.success}12`,
    borderRadius: BorderRadius.pill,
  },
  doneText: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 11,
    color: Colors.success,
    letterSpacing: 0.3,
  },

  metaText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },

  // Check-in summary
  checkInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  checkInItem: {
    alignItems: 'center',
    gap: 2,
  },
  checkInLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  checkInValue: {
    fontFamily: 'Jost_600SemiBold',
    fontSize: FontSizes.body,
    color: Colors.text,
  },
  checkInDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.borderLight,
  },
  checkInNote: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },

  // Practice
  practiceTitle: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
  },
  practiceDesc: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Course progress
  progressTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: JOURNAL_BLUE,
    borderRadius: 2,
  },
});
