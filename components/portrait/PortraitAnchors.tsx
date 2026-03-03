import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import TenderText from '@/components/ui/TenderText';
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
      <TenderText variant="headingL">Anchor Points</TenderText>
      <TenderText
        variant="bodySmall"
        color={Colors.textSecondary}
        style={{ marginBottom: Spacing.sm }}
      >
        Short phrases for difficult moments. Save the ones that resonate.
      </TenderText>

      {LABELS.map(({ key, label }) => (
        <View key={key} style={styles.card}>
          <TenderText variant="label" color={Colors.primary}>
            {label}
          </TenderText>
          <TenderText variant="body" style={{ lineHeight: 24, fontStyle: 'italic' }}>
            {renderAnchorValue(anchors[key])}
          </TenderText>
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    gap: 4,
  },
});
