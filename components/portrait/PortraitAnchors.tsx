import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import type { AnchorPoints } from '@/types';

interface Props {
  anchors: AnchorPoints;
}

const LABELS: Array<{ key: keyof AnchorPoints; label: string }> = [
  { key: 'whenActivated', label: 'When Activated' },
  { key: 'whenShutdown', label: 'When Shutdown' },
  { key: 'patternInterrupt', label: 'Pattern Interrupt' },
  { key: 'repair', label: 'Repair' },
  { key: 'selfCompassion', label: 'Self-Compassion' },
];

export default function PortraitAnchors({ anchors }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Anchor Points</Text>
      <Text style={styles.sectionSubtitle}>
        Short phrases for difficult moments. Save the ones that resonate.
      </Text>

      {LABELS.map(({ key, label }) => (
        <View key={key} style={styles.card}>
          <Text style={styles.anchorLabel}>{label}</Text>
          <Text style={styles.anchorText}>{anchors[key]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.md,
    gap: 4,
  },
  anchorLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  anchorText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
