/**
 * RetakeDelta — Shows before/after comparison after an assessment retake.
 *
 * Displays 2-4 key subscale changes with direction indicators:
 *   ↑ growing   → stable   ↓ shifting
 *
 * Warm language — change in any direction is framed as information,
 * never as failure. "Your pattern is evolving."
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { SparkleIcon } from '@/assets/graphics/icons';
import TenderButton from '@/components/ui/TenderButton';

// ─── Types ──────────────────────────────────────────────

export interface RetakeDeltaData {
  sectionName: string;
  dimensions: DeltaDimension[];
}

export interface DeltaDimension {
  label: string;
  previous: number;
  current: number;
  /** Direction: 'up' | 'stable' | 'down' */
  direction: 'up' | 'stable' | 'down';
}

interface RetakeDeltaProps {
  delta: RetakeDeltaData;
  onContinue: () => void;
}

// ─── Helpers ────────────────────────────────────────────

const DIRECTION_SYMBOLS: Record<string, string> = {
  up: '\u2191',
  stable: '\u2192',
  down: '\u2193',
};

const DIRECTION_LABELS: Record<string, string> = {
  up: 'growing',
  stable: 'stable',
  down: 'shifting',
};

function directionColor(direction: string): string {
  switch (direction) {
    case 'up': return Colors.calm;
    case 'down': return Colors.primary;
    default: return Colors.textMuted;
  }
}

// ─── Component ──────────────────────────────────────────

export default function RetakeDelta({ delta, onContinue }: RetakeDeltaProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconRow}>
        <SparkleIcon size={32} color={Colors.secondary} />
      </View>

      <Text style={styles.title}>How You\u2019ve Shifted</Text>
      <Text style={styles.sectionName}>{delta.sectionName}</Text>

      <View style={styles.dimensionsCard}>
        {delta.dimensions.map((dim, i) => (
          <View key={i} style={[styles.dimensionRow, i > 0 && styles.dimensionBorder]}>
            <View style={styles.dimensionInfo}>
              <Text style={styles.dimensionLabel}>{dim.label}</Text>
              <Text style={[styles.directionLabel, { color: directionColor(dim.direction) }]}>
                {DIRECTION_LABELS[dim.direction]}
              </Text>
            </View>
            <Text style={[styles.directionSymbol, { color: directionColor(dim.direction) }]}>
              {DIRECTION_SYMBOLS[dim.direction]}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.message}>
        Your pattern is evolving. This is what growth looks like {'\u2014'}{' '}
        not perfection, but movement.
      </Text>

      <TenderButton
        title="Continue"
        onPress={onContinue}
        variant="primary"
        size="lg"
        style={{ marginTop: Spacing.md }}
      />
    </View>
  );
}

// ─── Delta Computation ──────────────────────────────────

/**
 * Compute the delta between previous and current scores for a given
 * assessment type. Returns null if comparison isn't possible.
 */
export function computeRetakeDelta(
  assessmentType: string,
  previousScores: any,
  currentScores: any,
  sectionName: string,
): RetakeDeltaData | null {
  if (!previousScores || !currentScores) return null;

  const extractor = DELTA_EXTRACTORS[assessmentType];
  if (!extractor) return null;

  const dimensions = extractor(previousScores, currentScores);
  if (!dimensions || dimensions.length === 0) return null;

  return { sectionName, dimensions };
}

// ─── Per-Assessment Delta Extractors ────────────────────

type DeltaExtractor = (prev: any, curr: any) => DeltaDimension[];

const THRESHOLD = 0.3; // Change must exceed this to be directional

function direction(prev: number, curr: number): 'up' | 'stable' | 'down' {
  const diff = curr - prev;
  if (Math.abs(diff) < THRESHOLD) return 'stable';
  return diff > 0 ? 'up' : 'down';
}

const DELTA_EXTRACTORS: Record<string, DeltaExtractor> = {
  'ecr-r': (prev, curr) => [
    {
      label: 'Attachment Anxiety',
      previous: prev.anxietyScore,
      current: curr.anxietyScore,
      // For anxiety, LOWER is healthier, so invert direction label
      direction: direction(curr.anxietyScore, prev.anxietyScore),
    },
    {
      label: 'Attachment Avoidance',
      previous: prev.avoidanceScore,
      current: curr.avoidanceScore,
      // For avoidance, LOWER is healthier, so invert direction label
      direction: direction(curr.avoidanceScore, prev.avoidanceScore),
    },
  ],

  'ipip-neo-120': (prev, curr) => {
    const domains = ['Neuroticism', 'Extraversion', 'Openness to Experience', 'Agreeableness', 'Conscientiousness'];
    const prevP = prev.domainPercentiles ?? {};
    const currP = curr.domainPercentiles ?? {};

    // Find the 3 domains with biggest change
    const changes = domains
      .filter((d) => prevP[d] !== undefined && currP[d] !== undefined)
      .map((d) => ({
        label: d === 'Openness to Experience' ? 'Openness' : d,
        previous: prevP[d],
        current: currP[d],
        change: Math.abs(currP[d] - prevP[d]),
        direction: direction(prevP[d], currP[d]) as 'up' | 'stable' | 'down',
      }))
      .sort((a, b) => b.change - a.change)
      .slice(0, 3);

    return changes;
  },

  'sseit': (prev, curr) => {
    const dims: DeltaDimension[] = [
      {
        label: 'Overall Emotional Intelligence',
        previous: prev.totalNormalized ?? 0,
        current: curr.totalNormalized ?? 0,
        direction: direction(prev.totalNormalized ?? 0, curr.totalNormalized ?? 0),
      },
    ];

    // Add top subscale change
    const prevSub = prev.subscaleNormalized ?? {};
    const currSub = curr.subscaleNormalized ?? {};
    const subKeys = Object.keys(currSub).filter((k) => prevSub[k] !== undefined);

    if (subKeys.length > 0) {
      const topChange = subKeys
        .map((k) => ({
          key: k,
          change: Math.abs(currSub[k] - prevSub[k]),
        }))
        .sort((a, b) => b.change - a.change)[0];

      if (topChange) {
        dims.push({
          label: formatSubscaleName(topChange.key),
          previous: prevSub[topChange.key],
          current: currSub[topChange.key],
          direction: direction(prevSub[topChange.key], currSub[topChange.key]),
        });
      }
    }

    return dims;
  },

  'dsi-r': (prev, curr) => {
    const dims: DeltaDimension[] = [
      {
        label: 'Overall Differentiation',
        previous: prev.totalNormalized ?? 0,
        current: curr.totalNormalized ?? 0,
        direction: direction(prev.totalNormalized ?? 0, curr.totalNormalized ?? 0),
      },
    ];

    const prevSub = prev.subscaleScores ?? {};
    const currSub = curr.subscaleScores ?? {};
    const subKeys = Object.keys(currSub).filter((k) => prevSub[k]?.normalized !== undefined);

    // Pick top 2 changing subscales
    const changes = subKeys
      .map((k) => ({
        key: k,
        prev: prevSub[k].normalized,
        curr: currSub[k].normalized,
        change: Math.abs(currSub[k].normalized - prevSub[k].normalized),
      }))
      .sort((a, b) => b.change - a.change)
      .slice(0, 2);

    for (const c of changes) {
      dims.push({
        label: formatSubscaleName(c.key),
        previous: c.prev,
        current: c.curr,
        direction: direction(c.prev, c.curr),
      });
    }

    return dims;
  },

  'dutch': (prev, curr) => {
    const prevSub = prev.subscaleScores ?? {};
    const currSub = curr.subscaleScores ?? {};
    const styles = ['Yielding', 'Compromising', 'Forcing', 'Problem-Solving', 'Avoiding'];

    return styles
      .filter((s) => prevSub[s]?.mean !== undefined && currSub[s]?.mean !== undefined)
      .map((s) => ({
        label: s,
        previous: prevSub[s].mean,
        current: currSub[s].mean,
        direction: direction(prevSub[s].mean, currSub[s].mean) as 'up' | 'stable' | 'down',
      }))
      .filter((d) => d.direction !== 'stable')
      .slice(0, 3);
  },

  'values': (prev, curr) => {
    const prevDomains = prev.domainScores ?? {};
    const currDomains = curr.domainScores ?? {};
    const domainKeys = Object.keys(currDomains).filter((k) => prevDomains[k]);

    // Track gap changes (smaller gap = growing)
    const gapChanges = domainKeys
      .map((k) => ({
        key: k,
        prevGap: prevDomains[k].gap ?? 0,
        currGap: currDomains[k].gap ?? 0,
        change: Math.abs((prevDomains[k].gap ?? 0) - (currDomains[k].gap ?? 0)),
      }))
      .filter((g) => g.change > 0.5)
      .sort((a, b) => b.change - a.change)
      .slice(0, 3);

    return gapChanges.map((g) => ({
      label: formatValueDomain(g.key),
      previous: g.prevGap,
      current: g.currGap,
      // Smaller gap = growing
      direction: direction(g.prevGap, g.currGap) === 'down' ? 'up' as const : direction(g.prevGap, g.currGap),
    }));
  },
};

// ─── Formatting Helpers ─────────────────────────────────

function formatSubscaleName(key: string): string {
  return key
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValueDomain(key: string): string {
  const MAP: Record<string, string> = {
    'intimacy-connection': 'Intimacy & Connection',
    'honesty-authenticity': 'Honesty & Authenticity',
    'growth-learning': 'Growth & Learning',
    'security-stability': 'Security & Stability',
    'adventure-novelty': 'Adventure & Novelty',
    'independence-autonomy': 'Independence & Autonomy',
    'family-legacy': 'Family & Legacy',
    'service-contribution': 'Service & Contribution',
    'playfulness-humor': 'Playfulness & Humor',
    'spirituality-meaning': 'Spirituality & Meaning',
  };
  return MAP[key] ?? formatSubscaleName(key);
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  iconRow: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.headingS,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
  },
  sectionName: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  dimensionsCard: {
    width: '100%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  dimensionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  dimensionBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  dimensionInfo: {
    flex: 1,
    gap: 2,
  },
  dimensionLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  directionLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '500',
  },
  directionSymbol: {
    fontSize: FontSizes.headingS,
    fontWeight: '700',
    marginLeft: Spacing.md,
  },
  message: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
});
