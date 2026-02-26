/**
 * Dyadic Discrepancy Alert — Shows where individual data diverges from dyadic data
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { DyadicDiscrepancy, DiscrepancyType } from '@/types/couples';

interface DyadicDiscrepancyAlertProps {
  discrepancy: DyadicDiscrepancy;
}

const TYPE_CONFIG: Record<DiscrepancyType, { label: string; color: string; icon: string }> = {
  blind_spot: { label: 'Blind Spot', color: Colors.warning, icon: '\uD83D\uDC41' },
  hidden_strength: { label: 'Hidden Strength', color: Colors.success, icon: '\u2728' },
  perception_gap: { label: 'Perception Gap', color: Colors.secondary, icon: '\uD83D\uDD0D' },
  compensating: { label: 'Compensating Pattern', color: Colors.depth, icon: '\u2696' },
};

export default function DyadicDiscrepancyAlert({ discrepancy }: DyadicDiscrepancyAlertProps) {
  const [expanded, setExpanded] = useState(false);
  const config = TYPE_CONFIG[discrepancy.type];

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: config.color }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{config.icon}</Text>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{discrepancy.title}</Text>
            <View style={[styles.typeBadge, { backgroundColor: config.color + '20' }]}>
              <Text style={[styles.typeText, { color: config.color }]}>{config.label}</Text>
            </View>
          </View>
          <Text style={styles.description}>{discrepancy.description}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          {/* Data comparison */}
          <View style={styles.dataRow}>
            <View style={styles.dataBox}>
              <Text style={styles.dataLabel}>Individual Data</Text>
              <Text style={styles.dataText}>{discrepancy.individualData}</Text>
            </View>
            <View style={styles.dataBox}>
              <Text style={styles.dataLabel}>Dyadic Data</Text>
              <Text style={styles.dataText}>{discrepancy.dyadicData}</Text>
            </View>
          </View>

          {/* What it means */}
          <View style={styles.meaningBox}>
            <Text style={styles.meaningLabel}>What This Means</Text>
            <Text style={styles.meaningText}>{discrepancy.whatItMeans}</Text>
          </View>

          {/* Exploration question */}
          <View style={styles.questionBox}>
            <Text style={styles.questionLabel}>Explore Together</Text>
            <Text style={styles.questionText}>{discrepancy.explorationQuestion}</Text>
          </View>
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
  },
  header: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 20,
    marginTop: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  title: {
    ...Typography.headingS,
    color: Colors.text,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    ...Typography.caption,
    fontSize: 10,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  dataRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dataBox: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  dataLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  dataText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  meaningBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  meaningLabel: {
    ...Typography.label,
    color: Colors.depth,
    marginBottom: 4,
  },
  meaningText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  questionBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
  },
  questionLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: 4,
  },
  questionText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});
