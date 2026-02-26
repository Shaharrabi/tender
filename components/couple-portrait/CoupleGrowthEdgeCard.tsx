/**
 * Couple Growth Edge Card
 *
 * Expandable card showing a couple's growth edge with:
 * - Title + confidence badge
 * - What it is, why it matters, what it protects, what it costs
 * - Partner A part + Partner B part
 * - Practice for both
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { CoupleGrowthEdge } from '@/types/couples';

interface CoupleGrowthEdgeCardProps {
  edge: CoupleGrowthEdge;
  partnerAName: string;
  partnerBName: string;
  index: number;
}

const CONFIDENCE_COLORS: Record<string, string> = {
  Strong: Colors.success,
  Supported: Colors.secondary,
  Emerging: Colors.warning,
};

export default function CoupleGrowthEdgeCard({
  edge,
  partnerAName,
  partnerBName,
  index,
}: CoupleGrowthEdgeCardProps) {
  const [expanded, setExpanded] = useState(index === 0);

  const confColor = CONFIDENCE_COLORS[edge.confidenceLevel] || Colors.textMuted;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{edge.title}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.confidenceBadge, { backgroundColor: confColor + '20' }]}>
              <Text style={[styles.confidenceText, { color: confColor }]}>{edge.confidenceLevel}</Text>
            </View>
            {edge.relatedDyadicData ? (
              <Text style={styles.dataSource}>{edge.relatedDyadicData}</Text>
            ) : null}
          </View>
        </View>
        <Text style={styles.expandIcon}>{expanded ? '\u25B2' : '\u25BC'}</Text>
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          {/* What It Is */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>What It Is</Text>
            <Text style={styles.sectionText}>{edge.whatItIs}</Text>
          </View>

          {/* Why It Matters */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Why It Matters</Text>
            <Text style={styles.sectionText}>{edge.whyItMatters}</Text>
          </View>

          {/* Protection & Cost */}
          <View style={styles.dualRow}>
            <View style={[styles.dualColumn, styles.protectionColumn]}>
              <Text style={[styles.dualLabel, { color: Colors.calm }]}>What It Protects</Text>
              <Text style={styles.dualText}>{edge.whatItProtects}</Text>
            </View>
            <View style={[styles.dualColumn, styles.costColumn]}>
              <Text style={[styles.dualLabel, { color: Colors.warning }]}>What It Costs</Text>
              <Text style={styles.dualText}>{edge.whatItCosts}</Text>
            </View>
          </View>

          {/* The Invitation */}
          <View style={styles.invitationBox}>
            <Text style={styles.invitationLabel}>The Invitation</Text>
            <Text style={styles.invitationText}>{edge.theInvitation}</Text>
          </View>

          {/* Partner Parts */}
          <View style={styles.partnerPartsRow}>
            <View style={[styles.partnerPart, { borderLeftColor: Colors.primary }]}>
              <Text style={[styles.partnerPartLabel, { color: Colors.primary }]}>
                {partnerAName}'s Part
              </Text>
              <Text style={styles.partnerPartText}>{edge.partnerAPart}</Text>
            </View>
            <View style={[styles.partnerPart, { borderLeftColor: Colors.secondary }]}>
              <Text style={[styles.partnerPartLabel, { color: Colors.secondary }]}>
                {partnerBName}'s Part
              </Text>
              <Text style={styles.partnerPartText}>{edge.partnerBPart}</Text>
            </View>
          </View>

          {/* Practice */}
          <View style={styles.practiceBox}>
            <Text style={styles.practiceLabel}>Practice for Both</Text>
            <Text style={styles.practiceText}>{edge.practiceForBoth}</Text>
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
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    color: Colors.primary,
  },
  title: {
    ...Typography.headingS,
    color: Colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 4,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confidenceText: {
    ...Typography.caption,
    fontSize: 10,
  },
  dataSource: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    flex: 1,
  },
  expandIcon: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  expandedContent: {
    marginTop: Spacing.md,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  sectionText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  dualRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  dualColumn: {
    flex: 1,
    borderLeftWidth: 2,
    paddingLeft: Spacing.sm,
  },
  protectionColumn: {
    borderLeftColor: Colors.calm,
  },
  costColumn: {
    borderLeftColor: Colors.warning,
  },
  dualLabel: {
    ...Typography.label,
    marginBottom: 4,
  },
  dualText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  invitationBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  invitationLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: 4,
  },
  invitationText: {
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  partnerPartsRow: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  partnerPart: {
    borderLeftWidth: 2,
    paddingLeft: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  partnerPartLabel: {
    ...Typography.label,
    marginBottom: 4,
  },
  partnerPartText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  practiceBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  practiceLabel: {
    ...Typography.label,
    color: Colors.success,
    marginBottom: 4,
  },
  practiceText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
