/**
 * ValuesAlignment — Importance vs. Living dual-bar chart for each value domain.
 *
 * For each domain: two horizontal bars (importance in sage, living/accordance in gold),
 * with gap badge showing alignment status (Integrated / Aligned / Growth Edge).
 * Sorted by gap descending — biggest gaps first.
 *
 * Insight callout below summarizes the key tension.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';
import type { ValuesScores } from '@/types';

// Icons
import CompassIcon from '@/assets/graphics/icons/CompassIcon';

// ─── Types ────────────────────────────────────────────

interface ValuesAlignmentProps {
  valuesScores: ValuesScores;
  maxDomains?: number; // how many to show (default: all with importance > 5)
}

interface DomainRow {
  name: string;
  displayName: string;
  importance: number;
  accordance: number;
  gap: number;
}

// ─── Name Formatting ──────────────────────────────────

const DOMAIN_DISPLAY_NAMES: Record<string, string> = {
  honesty: 'Honesty & Authenticity',
  intimacy: 'Intimacy & Connection',
  security: 'Security & Stability',
  growth: 'Personal Growth',
  autonomy: 'Autonomy & Independence',
  adventure: 'Adventure & Novelty',
  family: 'Family & Tradition',
  spirituality: 'Spirituality & Meaning',
  service: 'Service & Community',
  pleasure: 'Pleasure & Enjoyment',
};

// ─── Gap Badge ────────────────────────────────────────

function GapBadge({ gap }: { gap: number }) {
  let label: string;
  let color: string;
  let bgColor: string;

  if (gap <= 1) {
    label = `Gap ${gap.toFixed(1)} — Integrated`;
    color = Colors.success;
    bgColor = Colors.success + '15';
  } else if (gap <= 2) {
    label = `Gap ${gap.toFixed(1)} — Aligned`;
    color = Colors.accentGold;
    bgColor = Colors.accentGold + '15';
  } else {
    label = `Gap ${gap.toFixed(1)} — Growth edge`;
    color = Colors.primary;
    bgColor = Colors.primary + '15';
  }

  return (
    <View style={[styles.gapBadge, { backgroundColor: bgColor }]}>
      <Text style={[styles.gapBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Value Bar Row ────────────────────────────────────

function ValueBarRow({ domain }: { domain: DomainRow }) {
  const importancePct = Math.min((domain.importance / 10) * 100, 100);
  const accordancePct = Math.min((domain.accordance / 10) * 100, 100);

  return (
    <View style={styles.valueBarContainer}>
      <Text style={styles.valueBarLabel}>{domain.displayName}</Text>

      {/* Importance bar (sage) */}
      <View style={styles.barTrack}>
        <View
          style={[styles.barFill, styles.barImportance, { width: `${importancePct}%` }]}
        />
      </View>

      {/* Accordance bar (gold) */}
      <View style={styles.barTrack}>
        <View
          style={[styles.barFill, styles.barLiving, { width: `${accordancePct}%` }]}
        />
      </View>

      {/* Meta row: legend + gap badge */}
      <View style={styles.metaRow}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.legendText}>Importance {domain.importance.toFixed(1)}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.accentGold }]} />
            <Text style={styles.legendText}>Living it {domain.accordance.toFixed(1)}</Text>
          </View>
        </View>
        <GapBadge gap={domain.gap} />
      </View>
    </View>
  );
}

// ─── Component ────────────────────────────────────────

export default function ValuesAlignment({ valuesScores, maxDomains }: ValuesAlignmentProps) {
  const domains = useMemo(() => {
    const rows: DomainRow[] = Object.entries(valuesScores.domainScores)
      .map(([name, data]) => ({
        name,
        displayName: DOMAIN_DISPLAY_NAMES[name] ?? name.charAt(0).toUpperCase() + name.slice(1),
        importance: data.importance,
        accordance: data.accordance,
        gap: data.gap,
      }))
      .filter((d) => d.importance >= 5) // only show values they care about
      .sort((a, b) => b.gap - a.gap); // biggest gaps first

    return maxDomains ? rows.slice(0, maxDomains) : rows;
  }, [valuesScores, maxDomains]);

  // Find biggest gap for the insight
  const biggestGap = domains[0];
  const insight = biggestGap
    ? biggestGap.gap > 2
      ? `Your biggest gap is in ${biggestGap.displayName.toLowerCase()}. This isn't failure — it's where your protective patterns are most active. Under stress, what matters most to you gets sacrificed precisely when it matters most.`
      : `Your values and actions are largely aligned — this coherence is a genuine strength. The smallest gaps are still worth noticing, as they hold seeds of deeper growth.`
    : '';

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.sectionLabel}>VALUES ALIGNMENT</Text>
      <Text style={styles.title}>What You Reach For vs. What You Live</Text>
      <Text style={styles.subtitle}>Where your values and actions converge — and where they don't</Text>

      {/* Value bars */}
      <View style={styles.barsContainer}>
        {domains.map((domain) => (
          <ValueBarRow key={domain.name} domain={domain} />
        ))}
      </View>

      {/* Insight */}
      {insight ? (
        <View style={styles.insightBox}>
          <CompassIcon size={16} color={Colors.primary} />
          <Text style={styles.insightText}>{insight}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────

const BAR_HEIGHT = 8;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.headingM,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  barsContainer: {
    gap: Spacing.md,
  },

  // Individual value bar
  valueBarContainer: {
    gap: 4,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  valueBarLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  barTrack: {
    height: BAR_HEIGHT,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  barFill: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
  },
  barImportance: {
    backgroundColor: Colors.success,
  },
  barLiving: {
    backgroundColor: Colors.accentGold,
  },

  // Meta row
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.textSecondary,
  },

  // Gap badge
  gapBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  gapBadgeText: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Insight
  insightBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    marginTop: Spacing.md,
  },
  insightText: {
    ...Typography.bodySmall,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
});
