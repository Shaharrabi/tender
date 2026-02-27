/**
 * Convergence-Divergence Card
 *
 * Displays shared strengths, complementary gifts, friction zones,
 * and values tensions as expandable cards.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SparkleIcon, PuzzleIcon, LightningIcon, ScaleIcon } from '@/assets/graphics/icons';
import type {
  ConvergencePoint,
  ComplementaryPair,
  FrictionZone,
  ValuesTension,
} from '@/types/couples';

// ─── Shared Strength Card ────────────────────────────────

export function SharedStrengthCard({ item }: { item: ConvergencePoint }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, styles.strengthCard]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconBadge}>
          <SparkleIcon size={16} color={Colors.success} />
        </View>
        <Text style={styles.cardTitle}>{item.dimensionLabel}</Text>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreBadge, { backgroundColor: Colors.primaryFaded, color: Colors.primary }]}>
            {Math.round(item.scoreA)}
          </Text>
          <Text style={[styles.scoreBadge, { backgroundColor: Colors.secondaryLight, color: Colors.secondaryDark }]}>
            {Math.round(item.scoreB)}
          </Text>
        </View>
      </View>
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.narrativeText}>{item.narrative}</Text>
          <View style={styles.practiceBox}>
            <Text style={styles.practiceLabel}>Practice to Deepen</Text>
            <Text style={styles.practiceText}>{item.practiceToDeepen}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Complementary Gift Card ─────────────────────────────

export function ComplementaryGiftCard({
  item,
  partnerAName,
  partnerBName,
}: {
  item: ComplementaryPair;
  partnerAName: string;
  partnerBName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const strongerName = item.strongerPartner === 'A' ? partnerAName : partnerBName;

  return (
    <TouchableOpacity
      style={[styles.card, styles.giftCard]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconBadge, { backgroundColor: '#F0E6FF' }]}>
          <PuzzleIcon size={16} color="#9B7BA7" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.dimensionLabel}</Text>
          <Text style={styles.cardSubtitle}>{strongerName} leads here (gap: {Math.round(item.gap)})</Text>
        </View>
      </View>
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.narrativeText}>{item.giftNarrative}</Text>
          <View style={[styles.warningBox]}>
            <Text style={styles.warningLabel}>Watch For</Text>
            <Text style={styles.warningText}>{item.riskNarrative}</Text>
          </View>
          <Text style={[styles.practiceText, { marginTop: Spacing.sm }]}>{item.growthOpportunity}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Friction Zone Card ──────────────────────────────────

export function FrictionZoneCard({
  item,
  partnerAName,
  partnerBName,
}: {
  item: FrictionZone;
  partnerAName: string;
  partnerBName: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, styles.frictionCard]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconBadge, { backgroundColor: Colors.errorLight }]}>
          <LightningIcon size={16} color={Colors.warning} />
        </View>
        <Text style={styles.cardTitle}>{item.area}</Text>
      </View>
      {expanded && (
        <View style={styles.expandedContent}>
          {/* Partner pulls */}
          <View style={styles.pullRow}>
            <View style={[styles.pullColumn, { borderLeftColor: Colors.primary }]}>
              <Text style={[styles.pullLabel, { color: Colors.primary }]}>{partnerAName}</Text>
              <Text style={styles.pullText}>{item.partnerAPull}</Text>
            </View>
            <View style={[styles.pullColumn, { borderLeftColor: Colors.secondary }]}>
              <Text style={[styles.pullLabel, { color: Colors.secondary }]}>{partnerBName}</Text>
              <Text style={styles.pullText}>{item.partnerBPull}</Text>
            </View>
          </View>

          <Text style={[styles.narrativeText, { marginTop: Spacing.sm }]}>{item.whatHappens}</Text>

          <View style={styles.underneathBox}>
            <Text style={styles.underneathLabel}>Underneath It</Text>
            <Text style={styles.underneathText}>{item.underneathIt}</Text>
          </View>

          <View style={styles.practiceBox}>
            <Text style={styles.practiceLabel}>Practice for Both</Text>
            <Text style={styles.practiceText}>{item.practiceForBoth}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Values Tension Card ─────────────────────────────────

export function ValuesTensionCard({ item }: { item: ValuesTension }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, styles.tensionCard]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconBadge, { backgroundColor: '#FFF3E0' }]}>
          <ScaleIcon size={16} color={Colors.accent} />
        </View>
        <Text style={styles.cardTitle}>{item.valueA} vs. {item.valueB}</Text>
      </View>
      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.narrativeText}>{item.description}</Text>
          <View style={styles.practiceBox}>
            <Text style={styles.practiceLabel}>Integration Practice</Text>
            <Text style={styles.practiceText}>{item.integrationPractice}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  strengthCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  giftCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#9B7BA7',
  },
  frictionCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  tensionCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.headingS,
    color: Colors.text,
    flex: 1,
  },
  cardSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 4,
  },
  scoreBadge: {
    fontSize: 12,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  expandedContent: {
    marginTop: Spacing.md,
  },
  narrativeText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  practiceBox: {
    marginTop: Spacing.sm,
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
  warningBox: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  warningLabel: {
    ...Typography.label,
    color: Colors.error,
    marginBottom: 4,
  },
  warningText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  underneathBox: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.depth,
  },
  underneathLabel: {
    ...Typography.label,
    color: Colors.depth,
    marginBottom: 4,
  },
  underneathText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  pullRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pullColumn: {
    flex: 1,
    borderLeftWidth: 2,
    paddingLeft: Spacing.sm,
  },
  pullLabel: {
    ...Typography.label,
    marginBottom: 4,
  },
  pullText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
