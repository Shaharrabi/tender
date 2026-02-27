/**
 * Couple Anchor Card — Displays anchor phrases organized by context
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { CoupleAnchor } from '@/types/couples';

interface AnchorSectionProps {
  title: string;
  anchors: CoupleAnchor[];
  accentColor: string;
}

function AnchorSection({ title, anchors, accentColor }: AnchorSectionProps) {
  if (anchors.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: accentColor }]}>{title}</Text>
      {anchors.map((anchor, i) => (
        <View key={i} style={styles.anchorRow}>
          <View style={[styles.anchorDot, { backgroundColor: accentColor }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.anchorText}>{anchor.text}</Text>
            {anchor.context ? (
              <Text style={styles.contextText}>{anchor.context}</Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

interface RepairStarterSectionProps {
  starters: string[];
}

function RepairStarterSection({ starters }: RepairStarterSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: Colors.success }]}>Repair Starters</Text>
      {starters.map((starter, i) => (
        <View key={i} style={styles.repairCard}>
          <Text style={styles.repairQuote}>"{starter}"</Text>
        </View>
      ))}
    </View>
  );
}

interface CoupleAnchorCardProps {
  anchors: {
    whenInTheCycle: CoupleAnchor[];
    forPartnerA: CoupleAnchor[];
    forPartnerB: CoupleAnchor[];
    sharedTruths: CoupleAnchor[];
    repairStarters: string[];
  };
  partnerAName: string;
  partnerBName: string;
}

export default function CoupleAnchorCard({
  anchors,
  partnerAName,
  partnerBName,
}: CoupleAnchorCardProps) {
  return (
    <View style={styles.container}>
      <AnchorSection
        title="When You Are In The Cycle"
        anchors={anchors.whenInTheCycle}
        accentColor={Colors.warning}
      />
      <AnchorSection
        title={`For ${partnerAName}`}
        anchors={anchors.forPartnerA}
        accentColor={Colors.primary}
      />
      <AnchorSection
        title={`For ${partnerBName}`}
        anchors={anchors.forPartnerB}
        accentColor={Colors.secondary}
      />
      <AnchorSection
        title="Shared Truths"
        anchors={anchors.sharedTruths}
        accentColor={Colors.depth}
      />
      <RepairStarterSection starters={anchors.repairStarters} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  anchorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  anchorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  anchorText: {
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  contextText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  repairCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.success,
  },
  repairQuote: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontStyle: 'italic' as const,
    lineHeight: 20,
  },
});
