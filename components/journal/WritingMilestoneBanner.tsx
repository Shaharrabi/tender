/**
 * WritingMilestoneBanner — Inline celebration for writing time milestones.
 *
 * Non-intrusive: slides in from top, shows for 4 seconds, auto-dismisses.
 * Designed to celebrate without breaking writing flow.
 *
 * Milestones:
 *   5 min  → confetti sound, warm encouragement
 *  10 min  → badge-unlock sound, deeper recognition
 *  20 min  → level-up sound, the big celebration
 */

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
import { SparkleIcon, PenIcon, StarIcon } from '@/assets/graphics/icons';
import { SoundHaptics } from '@/services/SoundHapticsService';
import type { WritingMilestone } from '@/utils/hooks/useWritingTimer';

// ─── Milestone Config ──────────────────────────────────

const MILESTONE_CONFIG: Record<
  WritingMilestone,
  {
    title: string;
    subtitle: string;
    sound: () => void;
    Icon: typeof SparkleIcon;
    accentColor: string;
  }
> = {
  5: {
    title: '5 minutes of reflection!',
    subtitle: 'You showed up for yourself today.',
    sound: () => SoundHaptics.playConfetti(),
    Icon: PenIcon,
    accentColor: Colors.secondary, // lobby blue
  },
  10: {
    title: "10 minutes — you're going deep!",
    subtitle: 'Real insight lives in the quiet moments.',
    sound: () => SoundHaptics.playBadgeUnlock(),
    Icon: SparkleIcon,
    accentColor: Colors.primary, // warm pink
  },
  20: {
    title: '20 minutes of writing.',
    subtitle: 'That takes real courage. Be proud.',
    sound: () => SoundHaptics.playLevelUp(),
    Icon: StarIcon,
    accentColor: Colors.accentGold, // warm gold
  },
};

const AUTO_DISMISS_MS = 4000;

// ─── Props ─────────────────────────────────────────────

interface WritingMilestoneBannerProps {
  milestone: WritingMilestone;
  onDismiss: () => void;
}

// ─── Component ─────────────────────────────────────────

export default function WritingMilestoneBanner({
  milestone,
  onDismiss,
}: WritingMilestoneBannerProps) {
  const config = MILESTONE_CONFIG[milestone];

  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Play celebration sound
    config.sound();

    // Animate in: slide down + fade + scale
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -10,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss();
      });
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [milestone]);

  const { Icon } = config;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }, { scale }],
          borderLeftColor: config.accentColor,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: config.accentColor + '20' }]}>
        <Icon size={18} color={config.accentColor} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  subtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: FontSizes.caption * 1.4,
  },
});
