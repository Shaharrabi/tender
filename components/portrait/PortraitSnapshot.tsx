import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import TenderText from '@/components/ui/TenderText';
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

const INTERPRETATIONS: Record<string, [string, string, string]> = {
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
  anxietyNorm: ['Low attachment anxiety', 'Moderate anxiety', 'High attachment anxiety'],
  avoidanceNorm: ['Low avoidance', 'Moderate avoidance', 'High avoidance'],
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
  const total = keys.reduce((sum, k) => sum + (scores[k] ?? 0), 0);
  return Math.round(total / keys.length);
}

// ─── Sub-components ──────────────────────────────────────

function OverallScoreCircle({ score }: { score: number }) {
  const tier = getTier(score);

  return (
    <View style={styles.overallContainer}>
      <View style={[styles.scoreCircleOuter, { borderColor: tier.color }]}>
        <View style={styles.scoreCircleInner}>
          <TenderText
            variant="headingL"
            color={tier.color}
            style={{ lineHeight: 28 }}
          >
            {score}
          </TenderText>
          <TenderText
            variant="label"
            color={Colors.textSecondary}
            style={{ marginTop: 0 }}
          >
            overall
          </TenderText>
        </View>
      </View>
      <TenderText
        variant="body"
        color={tier.color}
        style={{ marginTop: Spacing.sm }}
      >
        {tier.label}
      </TenderText>
      <TenderText variant="caption" color={Colors.textMuted} style={{ marginTop: 2 }}>
        Composite across all dimensions
      </TenderText>
    </View>
  );
}

function Legend() {
  return (
    <View style={styles.legendRow}>
      {TIERS.map((tier) => (
        <View key={tier.label} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: tier.color }]} />
          <TenderText variant="caption">
            {tier.label}
          </TenderText>
          <TenderText variant="caption" color={Colors.textMuted}>
            {tier.range}
          </TenderText>
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
        <TenderText variant="body">
          {meta.label}
        </TenderText>
        {!showInside && (
          <TenderText variant="caption" color={tier.color}>
            {value}
          </TenderText>
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
            <TenderText
              variant="caption"
              color={Colors.white}
              style={{ fontSize: 10 }}
            >
              {value}
            </TenderText>
          )}
        </View>
      </View>

      {/* Interpretation */}
      <TenderText variant="caption" color={tier.color}>
        {interpretation}
      </TenderText>
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
      <TenderText variant="label" color={Colors.primary} style={{ letterSpacing: 1.2 }}>
        {group}
      </TenderText>
      <View style={styles.groupDivider} />
      {items.map((meta) => (
        <ScoreBar key={meta.key} meta={meta} value={scores[meta.key] ?? 0} />
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
      <TenderText variant="headingM">Snapshot</TenderText>
      <TenderText
        variant="body"
        color={Colors.textSecondary}
        style={{ marginBottom: Spacing.sm }}
      >
        A visual overview of your key dimensions
      </TenderText>

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

  // Group card
  groupCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
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
});
