/**
 * Exit Point Card — Shows cycle exit points with partner-specific guidance
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { ExitPoint } from '@/types/couples';

interface ExitPointCardProps {
  exitPoint: ExitPoint;
  partnerAName: string;
  partnerBName: string;
}

export default function ExitPointCard({ exitPoint, partnerAName, partnerBName }: ExitPointCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>{exitPoint.number}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.stageLabel}>Exit at {exitPoint.stage.replace(/_/g, ' ')}</Text>
          <Text style={styles.bothText}>{exitPoint.forBoth}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={[styles.partnerBox, { borderLeftColor: Colors.primary }]}>
            <Text style={[styles.partnerLabel, { color: Colors.primary }]}>{partnerAName}</Text>
            <Text style={styles.partnerText}>{exitPoint.forPartnerA}</Text>
          </View>
          <View style={[styles.partnerBox, { borderLeftColor: Colors.secondary }]}>
            <Text style={[styles.partnerLabel, { color: Colors.secondary }]}>{partnerBName}</Text>
            <Text style={styles.partnerText}>{exitPoint.forPartnerB}</Text>
          </View>
          <Text style={styles.modalityText}>{exitPoint.modality}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
    borderLeftWidth: 3,
    borderLeftColor: Colors.calm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  numberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.calm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 12,
    color: Colors.white,
  },
  stageLabel: {
    ...Typography.label,
    color: Colors.calm,
    textTransform: 'capitalize',
  },
  bothText: {
    ...Typography.bodySmall,
    color: Colors.text,
    marginTop: 4,
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  partnerBox: {
    borderLeftWidth: 2,
    paddingLeft: Spacing.sm,
  },
  partnerLabel: {
    ...Typography.label,
    marginBottom: 2,
  },
  partnerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalityText: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
