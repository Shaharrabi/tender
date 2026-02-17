/**
 * XPProgressBar
 * ─────────────────────────────────────────────────────────────
 * Shows user's level, XP progress, and streak.
 * Wes Anderson aesthetic — warm tones, geometric precision.
 *
 * Usage:
 *   <XPProgressBar />          // Full version (home screen)
 *   <XPProgressBar compact />  // Mini version (headers)
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useGamification } from '@/context/GamificationContext';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { xpToNextLevel, LEVEL_THRESHOLDS } from '@/services/gamification';
import { FireIcon } from '@/assets/graphics/icons';

interface XPProgressBarProps {
  compact?: boolean;
}

export function XPProgressBar({ compact = false }: XPProgressBarProps) {
  const { gamification, progress, streak } = useGamification();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  if (!gamification) return null;

  const xpNeeded = xpToNextLevel(
    gamification.total_xp,
    gamification.current_level
  );

  // ─── Compact version (for headers) ──────────────────────────────────

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactLevelBadge}>
          <Text style={styles.compactLevelText}>
            {gamification.current_level}
          </Text>
        </View>
        <View style={styles.compactTrack}>
          <Animated.View
            style={[
              styles.compactFill,
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        {streak && streak.days > 0 && (
          <View style={styles.compactStreakRow}>
            <FireIcon size={12} color={Colors.accentGold} />
            <Text style={styles.compactStreak}>{streak.days}</Text>
          </View>
        )}
      </View>
    );
  }

  // ─── Full version (home screen card) ────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Top row: Level badge + XP text + Streak */}
      <View style={styles.topRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelLabel}>LVL</Text>
          <Text style={styles.levelNumber}>{gamification.current_level}</Text>
        </View>

        <View style={styles.xpInfo}>
          <Text style={styles.xpTotal}>
            {gamification.total_xp.toLocaleString()} XP
          </Text>
          <Text style={styles.xpNeeded}>
            {xpNeeded > 0
              ? `${xpNeeded.toLocaleString()} to next level`
              : 'Max level!'}
          </Text>
        </View>

        {streak && streak.days > 0 && (
          <View style={styles.streakBadge}>
            <FireIcon size={18} color={Colors.accentGold} />
            <Text style={styles.streakNumber}>{streak.days}</Text>
            <Text style={styles.streakLabel}>
              {streak.days === 1 ? 'day' : 'days'}
            </Text>
          </View>
        )}
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Bottom: progress percentage */}
      <Text style={styles.progressText}>
        {Math.round(progress)}% to Level {gamification.current_level + 1}
      </Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Full version
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelLabel: {
    fontSize: 9,
    fontFamily: 'Jost_600SemiBold',
    color: Colors.white,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  levelNumber: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.white,
    marginTop: -2,
  },
  xpInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  xpTotal: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  xpNeeded: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
    marginTop: 1,
  },
  streakBadge: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  streakNumber: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.accentGold,
    marginTop: -2,
  },
  streakLabel: {
    fontSize: 9,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
  },
  progressText: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },

  // Compact version
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  compactLevelBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactLevelText: {
    fontSize: 12,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.white,
  },
  compactTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.pill,
    overflow: 'hidden',
  },
  compactFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
  },
  compactStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  compactStreak: {
    fontSize: 12,
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.accentGold,
  },
});
