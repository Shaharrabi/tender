/**
 * SuccessCard — Replaces XP bar on home screen.
 *
 * Default: Centered animated timer counting up (time invested in relationship growth).
 * On tap: Expands to reveal stats with rolling number animations — dopamine hit!
 *
 * Wes Anderson aesthetic — warm tones, geometric precision.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useGamification } from '@/context/GamificationContext';
import { xpToNextLevel } from '@/services/gamification';
import { getTotalTimeMinutes, formatTimeSpent } from '@/services/session-time';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { FireIcon, SparkleIcon } from '@/assets/graphics/icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SuccessCardProps {
  currentStep: number;
  totalSteps?: number;
  streakDays?: number;
  totalDaysEngaged?: number;
}

/** Animated number that rolls up from 0 to target value. */
function AnimatedNumber({
  target,
  suffix = '',
  prefix = '',
  accent,
  duration = 1200,
  style,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  accent: string;
  duration?: number;
  style?: any;
}) {
  const animValue = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    animValue.setValue(0);
    const listener = animValue.addListener(({ value }) => {
      setDisplay(Math.round(value).toLocaleString());
    });

    Animated.timing(animValue, {
      toValue: target,
      duration,
      useNativeDriver: false,
    }).start();

    return () => animValue.removeListener(listener);
  }, [target]);

  return (
    <Text style={[styles.statValue, { color: accent }, style]}>
      {prefix}{display}{suffix}
    </Text>
  );
}

export function SuccessCard({
  currentStep,
  totalSteps = 12,
  streakDays,
  totalDaysEngaged,
}: SuccessCardProps) {
  const { gamification, progress, streak } = useGamification();
  const [isExpanded, setIsExpanded] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const expandAnim = useRef(new Animated.Value(1)).current;
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load time on mount and start a live counter
  useEffect(() => {
    getTotalTimeMinutes().then(setTimeSpent);

    // Update the timer every 60 seconds so it ticks up live
    timerInterval.current = setInterval(() => {
      getTotalTimeMinutes().then(setTimeSpent);
    }, 60_000);

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const handleToggle = useCallback(() => {
    const expanding = !isExpanded;
    setIsExpanded(expanding);

    // Refresh time when expanding
    if (expanding) getTotalTimeMinutes().then(setTimeSpent);

    Animated.spring(expandAnim, {
      toValue: expanding ? 1 : 0,
      friction: 8,
      tension: 50,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  if (!gamification) return null;

  const level = gamification.current_level;
  const xp = gamification.total_xp;
  const xpNeeded = xpToNextLevel(xp, level);
  const days = streakDays ?? streak?.days ?? 0;

  // Interpolate expanded height
  const containerHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [56, 160],
  });
  const statsOpacity = expandAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
  });
  const statsTranslateY = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleToggle}
      accessibilityRole="button"
      accessibilityLabel={isExpanded ? 'Your growth stats. Tap to close.' : 'Tap to see your growth stats'}
    >
      <Animated.View style={[styles.container, { height: containerHeight }]}>
        {/* ─── FRONT: Centered timer + minimal stats ─── */}
        <View style={styles.frontRow}>
          <SparkleIcon size={14} color={Colors.accentGold} />
          <Text style={styles.timerText}>
            {formatTimeSpent(timeSpent)}
          </Text>
          <Text style={styles.timerLabel}>invested in your growth today</Text>
          <View style={styles.frontDivider} />
          <FireIcon size={14} color={Colors.accentGold} />
          <Text style={styles.frontStreakText}>{days}</Text>
        </View>

        {/* ─── EXPANDED: Stats with animated numbers ─── */}
        <Animated.View
          style={[
            styles.expandedSection,
            {
              opacity: statsOpacity,
              transform: [{ translateY: statsTranslateY }],
            },
          ]}
          pointerEvents={isExpanded ? 'auto' : 'none'}
        >
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              {isExpanded && (
                <AnimatedNumber
                  target={xp}
                  accent={Colors.secondary}
                  duration={1400}
                />
              )}
              <Text style={styles.statLabel}>Total XP</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.levelPill}>
                <Text style={styles.levelPillText}>LVL {level}</Text>
              </View>
              <Text style={styles.statLabel}>
                {xpNeeded > 0 ? `${xpNeeded.toLocaleString()} to next` : 'Max!'}
              </Text>
            </View>

            <View style={styles.statItem}>
              {isExpanded && (
                <AnimatedNumber
                  target={days}
                  suffix={days === 1 ? ' day' : ' days'}
                  accent={Colors.accentGold}
                  duration={800}
                />
              )}
              <Text style={styles.statLabel}>Streak</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.primary }]}>
                Step {currentStep}/{totalSteps}
              </Text>
              <Text style={styles.statLabel}>Journey</Text>
            </View>

            <View style={styles.statItem}>
              {isExpanded && totalDaysEngaged != null && (
                <AnimatedNumber
                  target={totalDaysEngaged}
                  accent={Colors.success}
                  duration={1000}
                />
              )}
              <Text style={styles.statLabel}>Days Active</Text>
            </View>

            <View style={styles.statItem}>
              {isExpanded && (
                <AnimatedNumber
                  target={timeSpent}
                  suffix=" min"
                  accent={Colors.primary}
                  duration={1000}
                />
              )}
              <Text style={styles.statLabel}>Time Invested</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
    overflow: 'hidden',
  },
  // Front row — centered timer
  frontRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  timerText: {
    fontSize: 15,
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.text,
  },
  timerLabel: {
    fontSize: 11,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  frontDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 4,
  },
  frontStreakText: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.accentGold,
  },
  // Expanded section
  expandedSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
    letterSpacing: 0.3,
    marginTop: 1,
  },
  levelPill: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  levelPillText: {
    fontSize: 12,
    fontFamily: 'Jost_600SemiBold',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});
