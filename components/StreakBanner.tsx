import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { StreakData } from '@/services/streaks';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

interface StreakBannerProps {
  streak: StreakData;
  /** Pass previous streak count to trigger celebration when streak increases */
  previousStreak?: number;
  /** When true, shows a celebration badge for the new day */
  isNewDay?: boolean;
}

export default function StreakBanner({ streak, previousStreak, isNewDay }: StreakBannerProps) {
  const { currentStreak, totalDays, todayRecorded, commitmentDay, streakDates } = streak;

  // Celebration animation
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const celebrationScale = useRef(new Animated.Value(0.85)).current;

  const shouldCelebrate =
    isNewDay ||
    (previousStreak !== undefined && previousStreak > 0 && currentStreak > previousStreak);

  useEffect(() => {
    if (shouldCelebrate) {
      Animated.parallel([
        Animated.timing(celebrationOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(celebrationScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      celebrationOpacity.setValue(0);
      celebrationScale.setValue(0.85);
    }
  }, [shouldCelebrate, currentStreak]);

  // Determine which days of the current week have been completed
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const weekDays = WEEKDAYS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isToday = dateStr === today.toISOString().split('T')[0];
    const isDone = streakDates.includes(dateStr);
    const isFuture = d > today;
    return { label, dateStr, isToday, isDone, isFuture };
  });

  // Progress toward 30-day commitment
  const commitProgress = Math.min(commitmentDay / 30, 1);

  // Milestone messages
  const getMessage = () => {
    if (currentStreak === 0) return 'Start your journey today';
    if (currentStreak <= 2) return 'Great start! Keep it going';
    if (currentStreak <= 6) return 'Building momentum!';
    if (currentStreak <= 13) return 'One week strong!';
    if (currentStreak <= 20) return 'Two weeks of dedication!';
    if (currentStreak <= 29) return "Almost there! You're unstoppable";
    return '30-day commitment complete!';
  };

  // Next milestone
  const getNextMilestone = () => {
    const milestones = [3, 7, 14, 21, 30];
    for (const m of milestones) {
      if (currentStreak < m) return m - currentStreak;
    }
    return 0;
  };
  const nextMilestoneDays = getNextMilestone();

  return (
    <View style={styles.container}>
      {/* Celebration badge */}
      {shouldCelebrate && (
        <Animated.View
          style={[
            styles.celebrationBadge,
            {
              opacity: celebrationOpacity,
              transform: [{ scale: celebrationScale }],
            },
          ]}
        >
          <Text style={styles.celebrationText}>
            {'\uD83C\uDF89'} Day {currentStreak} — Keep going!
          </Text>
        </Animated.View>
      )}

      {/* Streak number with laurels */}
      <View style={styles.streakHeader}>
        <Text style={styles.laurelLeft}>{'\uD83C\uDF3F'}</Text>
        <View style={styles.streakCenter}>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>consecutive days</Text>
        </View>
        <Text style={styles.laurelRight}>{'\uD83C\uDF3F'}</Text>
      </View>

      {/* Weekly dots */}
      <View style={styles.weekRow}>
        {weekDays.map((day) => (
          <View key={day.dateStr} style={styles.weekDayItem}>
            <Text style={[styles.weekDayLabel, day.isToday && styles.weekDayLabelToday]}>
              {day.label}
            </Text>
            <View
              style={[
                styles.weekDot,
                day.isDone && styles.weekDotDone,
                day.isToday && !day.isDone && styles.weekDotToday,
                day.isFuture && styles.weekDotFuture,
              ]}
            >
              {day.isDone && <Text style={styles.weekDotCheck}>{'\u2713'}</Text>}
            </View>
          </View>
        ))}
      </View>

      {/* 30-day commitment progress */}
      <View style={styles.commitSection}>
        <View style={styles.commitHeader}>
          <Text style={styles.commitLabel}>30-Day Commitment</Text>
          <Text style={styles.commitCount}>{Math.min(commitmentDay, 30)}/30</Text>
        </View>
        <View style={styles.commitTrack}>
          <View style={[styles.commitFill, { width: `${commitProgress * 100}%` }]} />
          {commitmentDay >= 30 && (
            <Text style={styles.commitStar}>{'\u2B50'}</Text>
          )}
        </View>
      </View>

      {/* Motivational message */}
      <Text style={styles.message}>{getMessage()}</Text>
      {nextMilestoneDays > 0 && currentStreak > 0 && (
        <Text style={styles.milestone}>
          Next milestone in {nextMilestoneDays} day{nextMilestoneDays !== 1 ? 's' : ''}
        </Text>
      )}

      {/* Inline stats (compact) */}
      <Text style={styles.inlineStats}>
        {totalDays} total days{streak.longestStreak > currentStreak ? ` \u00B7 Best: ${streak.longestStreak}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },

  // Celebration
  celebrationBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.primaryLight + '22',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  celebrationText: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    textAlign: 'center',
  },

  // Header
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  laurelLeft: {
    fontSize: 22,
    transform: [{ scaleX: -1 }],
  },
  laurelRight: {
    fontSize: 22,
  },
  streakCenter: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    lineHeight: 36,
  },
  streakLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: -2,
  },

  // Weekly dots
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  weekDayItem: {
    alignItems: 'center',
    gap: 3,
  },
  weekDayLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  weekDayLabelToday: {
    color: Colors.primary,
    fontWeight: '700',
  },
  weekDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDotDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  weekDotToday: {
    borderColor: Colors.primary,
    borderWidth: 2.5,
  },
  weekDotFuture: {
    borderColor: Colors.borderLight,
    opacity: 0.5,
  },
  weekDotCheck: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700',
  },

  // Commitment
  commitSection: {
    gap: Spacing.xs,
  },
  commitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commitLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  commitCount: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  commitTrack: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  commitFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  commitStar: {
    position: 'absolute',
    right: -2,
    top: -9,
    fontSize: 16,
  },

  // Message
  message: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  milestone: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: -Spacing.xs,
  },

  // Inline stats (replaces stats row)
  inlineStats: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    fontWeight: '500',
  },
});
