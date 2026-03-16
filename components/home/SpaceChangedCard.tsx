/**
 * SpaceChangedCard — "The space between you shifted this week."
 *
 * Shows on home screen when WEARE notable_change = true.
 * Sage green background, warm narrative, taps to couple portal.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';

interface SpaceChangedCardProps {
  narrative: string;
  resonanceDelta: number;
  onPress: () => void;
}

export default function SpaceChangedCard({
  narrative,
  resonanceDelta,
  onPress,
}: SpaceChangedCardProps) {
  const direction = resonanceDelta > 0 ? 'grew' : resonanceDelta < 0 ? 'quieted' : 'shifted';
  const indicator = resonanceDelta > 0 ? '\u2197' : resonanceDelta < 0 ? '\u2198' : '\u2194';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="The space between you changed"
    >
      <View style={styles.header}>
        <Text style={styles.indicator}>{indicator}</Text>
        <Text style={styles.title}>The space between you {direction}</Text>
      </View>
      <Text style={styles.narrative}>{narrative}</Text>
      <Text style={styles.cta}>Check in to see what moved {'\u2192'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  indicator: {
    fontSize: 20,
    marginRight: Spacing.xs,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.sm,
    color: Colors.successDarkText,
    letterSpacing: 0.5,
  },
  narrative: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  cta: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    color: Colors.success,
  },
});
