import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import type { CompositeScores } from '@/types';

// ─── Types ───────────────────────────────────────────────

interface Props {
  compositeScores: CompositeScores;
}

interface ScoreMeta {
  key: keyof CompositeScores;
  label: string;
  group: string;
}

interface ScoreTier {
  label: string;
  color: string;
  range: string;
}

// ─── Constants ───────────────────────────────────────────

const SCORE_META: ScoreMeta[] = [
  { key: 'accessibility', label: 'Accessible', group: 'A.R.E.' },
  { key: 'responsiveness', label: 'Responsive', group: 'A.R.E.' },
  { key: 'engagement', label: 'Engaged', group: 'A.R.E.' },
  { key: 'regulationScore', label: 'Regulation', group: 'Capacity' },
  { key: 'windowWidth', label: 'Window Width', group: 'Capacity' },
  { key: 'selfLeadership', label: 'Self-Leadership', group: 'Capacity' },
  { key: 'valuesCongruence', label: 'Values Alignment', group: 'Values' },
];

const GROUPS = ['A.R.E.', 'Capacity', 'Values'] as const;

const TIER_STRONG: ScoreTier = {
  label: 'Strength',
  color: Colors.success,
  range: '75-100',
};
const TIER_DEVELOPING: ScoreTier = {
  label: 'Developing',
  color: Colors.calm,
  range: '55-74',
};
const TIER_GROWING: ScoreTier = {
  label: 'Emerging',
  color: Colors.warning,
  range: '35-54',
};
const TIER_FOCUS: ScoreTier = {
  label: 'Focus Area',
  color: Colors.error,
  range: '0-34',
};

const TIERS: ScoreTier[] = [TIER_STRONG, TIER_DEVELOPING, TIER_GROWING, TIER_FOCUS];

/** Bar width threshold (as %) below which the score label renders outside the bar. */
const INNER_LABEL_MIN_PCT = 25;

// ─── Score Interpretation Map ────────────────────────────

const INTERPRETATIONS: Record<keyof CompositeScores, [string, string, string]> = {
  accessibility: ['Emotionally available', 'Sometimes guarded', 'Tends to withdraw'],
  responsiveness: ['Attuned to partner', 'Working on attunement', 'Needs focus'],
  engagement: ['Deeply invested', 'Moderately engaged', 'Disengaging risk'],
  regulationScore: ['Steady under stress', 'Regulation developing', 'Easily overwhelmed'],
  windowWidth: ['Wide window', 'Moderate window', 'Narrow window'],
  selfLeadership: ['Strong self-awareness', 'Building awareness', 'Self-led growth needed'],
  valuesCongruence: ['Living your values', 'Some gaps to bridge', 'Significant values gap'],
  // Radar dimensions (used by RadarChart, not displayed in Snapshot bars)
  attachmentSecurity: ['Securely attached', 'Developing security', 'Insecurity patterns'],
  emotionalIntelligence: ['High EQ', 'Growing EQ', 'EQ development needed'],
  differentiation: ['Well differentiated', 'Building differentiation', 'Fusion patterns'],
  conflictFlexibility: ['Flexible in conflict', 'Some rigidity', 'Conflict style rigid'],
  relationalAwareness: ['Deeply aware', 'Growing awareness', 'Awareness developing'],
};

// ─── Helpers ─────────────────────────────────────────────

function getTier(value: number): ScoreTier {
  if (value >= 75) return TIER_STRONG;
  if (value >= 55) return TIER_DEVELOPING;
  if (value >= 35) return TIER_GROWING;
  return TIER_FOCUS;
}

function getInterpretation(key: keyof CompositeScores, value: number): string {
  const [high, mid, low] = INTERPRETATIONS[key];
  if (value >= 65) return high;
  if (value >= 40) return mid;
  return low;
}

function computeOverallScore(scores: CompositeScores): number {
  const keys = SCORE_META.map((m) => m.key);
  const total = keys.reduce((sum, k) => sum + scores[k], 0);
  return Math.round(total / keys.length);
}

// ─── Sub-components ──────────────────────────────────────

function OverallScoreCircle({ score }: { score: number }) {
  const tier = getTier(score);

  return (
    <View style={styles.overallContainer}>
      <View style={[styles.scoreCircleOuter, { borderColor: tier.color }]}>
        <View style={styles.scoreCircleInner}>
          <Text style={[styles.scoreCircleValue, { color: tier.color }]}>{score}</Text>
          <Text style={styles.scoreCircleLabel}>overall</Text>
        </View>
      </View>
      <Text style={[styles.overallTierLabel, { color: tier.color }]}>{tier.label}</Text>
      <Text style={styles.overallDescription}>
        Composite across all dimensions
      </Text>
    </View>
  );
}

function Legend() {
  return (
    <View style={styles.legendRow}>
      {TIERS.map((tier) => (
        <View key={tier.label} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: tier.color }]} />
          <Text style={styles.legendText}>{tier.label}</Text>
          <Text style={styles.legendRange}>{tier.range}</Text>
        </View>
      ))}
    </View>
  );
}

function ScoreBar({
  meta,
  value,
}: {
  meta: ScoreMeta;
  value: number;
}) {
  const tier = getTier(value);
  const interpretation = getInterpretation(meta.key, value);
  const showInside = value >= INNER_LABEL_MIN_PCT;

  return (
    <View style={styles.scoreBarContainer}>
      {/* Label row */}
      <View style={styles.scoreBarLabelRow}>
        <Text style={styles.scoreBarLabel}>{meta.label}</Text>
        {!showInside && (
          <Text style={[styles.scoreBarValueOutside, { color: tier.color }]}>
            {value}
          </Text>
        )}
      </View>

      {/* Bar */}
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${Math.max(value, 3)}%`,
              backgroundColor: tier.color,
            },
          ]}
        >
          {showInside && (
            <Text style={styles.barValueInside}>{value}</Text>
          )}
        </View>
      </View>

      {/* Interpretation */}
      <Text style={[styles.interpretation, { color: tier.color }]}>
        {interpretation}
      </Text>
    </View>
  );
}

function GroupCard({
  group,
  scores,
}: {
  group: string;
  scores: CompositeScores;
}) {
  const items = SCORE_META.filter((m) => m.group === group);

  return (
    <View style={styles.groupCard}>
      <Text style={styles.groupLabel}>{group}</Text>
      <View style={styles.groupDivider} />
      {items.map((meta) => (
        <ScoreBar key={meta.key} meta={meta} value={scores[meta.key]} />
      ))}
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────

export default function PortraitSnapshot({ compositeScores }: Props) {
  const overallScore = computeOverallScore(compositeScores);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.sectionTitle}>Snapshot</Text>
      <Text style={styles.sectionSubtitle}>
        A visual overview of your key dimensions
      </Text>

      {/* Overall composite score */}
      <OverallScoreCircle score={overallScore} />

      {/* Legend */}
      <Legend />

      {/* Group cards */}
      {GROUPS.map((group) => (
        <GroupCard key={group} group={group} scores={compositeScores} />
      ))}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const CIRCLE_SIZE = 96;
const CIRCLE_BORDER = 6;
const BAR_HEIGHT = 14;
const BAR_RADIUS = BAR_HEIGHT / 2;

const styles = StyleSheet.create({
  // Container
  container: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },

  // Section header
  sectionTitle: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },

  // Overall score circle
  overallContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  scoreCircleOuter: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: CIRCLE_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.card,
  },
  scoreCircleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircleValue: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    lineHeight: 28,
  },
  scoreCircleLabel: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 0,
  },
  overallTierLabel: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  overallDescription: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Legend
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.text,
    fontWeight: '500',
  },
  legendRange: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
  },

  // Group card
  groupCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  groupLabel: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  groupDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.xs,
  },

  // Individual score bar
  scoreBarContainer: {
    gap: 3,
    marginBottom: Spacing.xs,
  },
  scoreBarLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreBarLabel: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.text,
    fontWeight: '500',
  },
  scoreBarValueOutside: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    fontWeight: '700',
  },

  // Bar
  barBackground: {
    height: BAR_HEIGHT,
    backgroundColor: Colors.surface,
    borderRadius: BAR_RADIUS,
    overflow: 'hidden',
  },
  barFill: {
    height: BAR_HEIGHT,
    borderRadius: BAR_RADIUS,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 6,
  },
  barValueInside: {
    fontSize: 10,
    fontFamily: FontFamilies.body,
    fontWeight: '700',
    color: Colors.white,
  },

  // Interpretation
  interpretation: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    fontStyle: 'italic',
  },
});
