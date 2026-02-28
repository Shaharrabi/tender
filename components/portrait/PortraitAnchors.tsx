import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import type { AnchorPoints, AnchorCategory } from '@/types';

interface Props {
  anchors: AnchorPoints;
}

function renderAnchorValue(value: AnchorPoints[keyof AnchorPoints]): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join('\n');
  if (value && typeof value === 'object') {
    // AnchorCategory
    if ('primary' in value) {
      const cat = value as AnchorCategory;
      return cat.primary;
    }
    // repair object
    if ('repairStarters' in value) {
      return (value as { repairStarters: string[] }).repairStarters.join('\n');
    }
    // selfCompassion object
    if ('personalizedMessage' in value) {
      return (value as { personalizedMessage: string }).personalizedMessage;
    }
  }
  return String(value);
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
          <Text style={styles.anchorText}>{renderAnchorValue(anchors[key])}</Text>
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
    ...Typography.headingL,
    color: Colors.text,
  },
  sectionSubtitle: {
    ...Typography.bodySmall,
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
    ...Typography.label,
    color: Colors.primary,
  },
  anchorText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
    fontStyle: 'italic' as const,
  },
});
