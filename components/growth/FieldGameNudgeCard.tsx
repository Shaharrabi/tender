/**
 * FieldGameNudgeCard — Invitation to play a Field zone game.
 *
 * Appears in the step-detail page between the teaching content and
 * practices. Each step has a corresponding "zone" in The Field —
 * a playful HTML5 game that embodies the step's therapeutic concept.
 *
 * The card shows the zone name, icon, subtitle, and estimated time.
 * Tapping opens the full-screen WebView game.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { FieldGameMeta } from '@/services/field-games/bridge';

interface FieldGameNudgeCardProps {
  game: FieldGameMeta;
  phaseColor: string;
  /** Whether the user has already completed this field game */
  isCompleted?: boolean;
}

export default function FieldGameNudgeCard({
  game,
  phaseColor,
  isCompleted = false,
}: FieldGameNudgeCardProps) {
  const router = useRouter();
  const haptics = useSoundHaptics();

  const handlePress = () => {
    haptics.tap();
    router.push({
      pathname: '/(app)/field-game' as any,
      params: { step: String(game.stepNumber) },
    });
  };

  return (
    <Animated.View entering={FadeInUp.delay(650).duration(500)}>
      <TouchableOpacity
        style={[
          styles.card,
          { borderColor: isCompleted ? Colors.border : phaseColor + '40' },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Play ${game.zoneName} field game`}
      >
        {/* Top accent */}
        <View style={[styles.accent, { backgroundColor: phaseColor }]} />

        {/* Content */}
        <View style={styles.content}>
          {/* Icon + zone label */}
          <View style={styles.header}>
            <Text style={styles.icon}>{game.zoneIcon}</Text>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>
                {isCompleted ? 'PLAY AGAIN' : 'ENTER THE FIELD'}
              </Text>
              <Text style={styles.zoneName}>{game.zoneName}</Text>
            </View>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>{game.subtitle}</Text>

          {/* CTA */}
          <View style={styles.ctaRow}>
            <View style={[styles.playButton, { backgroundColor: phaseColor }]}>
              <Text style={styles.playButtonText}>
                {isCompleted ? 'REPLAY' : 'PLAY'}
              </Text>
            </View>
            <Text style={styles.duration}>~{game.estimatedMinutes} min</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: Spacing.md,
    ...Shadows.card,
  },
  accent: {
    height: 3,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: FontSizes.caption,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    marginBottom: 2,
  },
  zoneName: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.md,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  playButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 20,
  },
  playButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.xs,
    color: '#FFFFFF',
    letterSpacing: 2,
    fontWeight: '600',
  },
  duration: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
