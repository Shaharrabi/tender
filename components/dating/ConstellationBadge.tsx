/**
 * ConstellationBadge — Visual display of user's dating constellation
 *
 * Shows the user's top 3 archetype traits from The Field game
 * in a compact, visually distinctive badge.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, FontFamilies, FontSizes, Shadows } from '@/constants/theme';
import { SparkleIcon } from '@/assets/graphics/icons';
import { ARCHETYPE_NAMES } from '@/constants/dating/gameScenarios';

interface ConstellationBadgeProps {
  topTraits: string[];
  compact?: boolean;
}

export default function ConstellationBadge({ topTraits, compact = false }: ConstellationBadgeProps) {
  if (!topTraits || topTraits.length === 0) return null;

  const traitNames = topTraits.map((t) => ARCHETYPE_NAMES[t] || t);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactLabel}>Your Constellation</Text>
        <Text style={styles.compactTraits}>{traitNames.join(' \u00B7 ')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SparkleIcon size={28} color={Colors.accentGold} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>Your Constellation</Text>
        <Text style={styles.traits}>{traitNames.join(' \u00B7 ')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: FontFamilies.heading,
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  traits: {
    fontFamily: FontFamilies.accent,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
  compactContainer: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  compactLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  compactTraits: {
    fontFamily: FontFamilies.accent,
    fontSize: 13,
    color: Colors.text,
    marginTop: 2,
  },
});
