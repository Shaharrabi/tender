/**
 * GrowthPulseCard — Visible portrait evolution at milestone steps.
 *
 * Shows ONE meaningful observation about the user's growth at
 * milestone steps (4, 7, 10, 12). Appears between the bridge
 * and the tagline.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import type { GrowthPulse } from '@/utils/steps/growth-pulse';

// ─── Types ──────────────────────────────────────────────

interface GrowthPulseCardProps {
  pulse: GrowthPulse;
  phaseColor: string;
  hasPortrait: boolean;
}

// ─── Component ──────────────────────────────────────────

function GrowthPulseCard({
  pulse,
  phaseColor,
  hasPortrait,
}: GrowthPulseCardProps) {
  const router = useRouter();

  return (
    <Animated.View entering={FadeIn.delay(480).duration(600)}>
      <View style={[styles.card, { borderLeftColor: phaseColor }]}>
        <Text style={styles.label}>{pulse.label}</Text>
        <Text style={styles.message}>{pulse.message}</Text>
        {hasPortrait && (
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push('/(app)/portrait' as any)}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: phaseColor }]}>
              See Your Full Portrait {'\u203A'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  label: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontSize: 9,
  },
  message: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 26,
  },
  linkRow: {
    marginTop: Spacing.xs,
  },
  linkText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },
});

export default React.memo(GrowthPulseCard);
