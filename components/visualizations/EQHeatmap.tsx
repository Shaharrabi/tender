/**
 * EQHeatmap — 2×2 quadrant heatmap for Emotional Intelligence (SSEIT).
 *
 * Layout (Awareness | Management axis):
 *   ┌─────────────────┬─────────────────┐
 *   │ Self-Awareness   │ Self-Regulation  │  ← SELF
 *   │ (perception)     │ (managingOwn)    │
 *   ├─────────────────┼─────────────────┤
 *   │ Social Awareness │ Relationship Mgmt│  ← OTHERS
 *   │ (managingOthers) │ (utilization)    │
 *   └─────────────────┴─────────────────┘
 *        AWARENESS          MANAGEMENT
 *
 * Color intensity driven by score: higher = deeper warm tone.
 * Insight callout below summarizes the awareness-vs-management gap.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';
import type { SSEITScores } from '@/types';

// Icons
import BrainIcon from '@/assets/graphics/icons/BrainIcon';

// ─── Types ────────────────────────────────────────────

interface EQHeatmapProps {
  sseitScores: SSEITScores;
  onQuadrantTap?: (quadrant: string, score: number) => void;
}

interface QuadrantDef {
  key: string;
  label: string;
  subscaleKey: string;
  row: 'self' | 'others';
  col: 'awareness' | 'management';
}

// ─── Quadrant Definitions ─────────────────────────────

const QUADRANTS: QuadrantDef[] = [
  { key: 'selfAwareness',   label: 'Self-Awareness',      subscaleKey: 'perception',       row: 'self',   col: 'awareness' },
  { key: 'selfRegulation',  label: 'Self-Regulation',     subscaleKey: 'managingOwn',      row: 'self',   col: 'management' },
  { key: 'socialAwareness', label: 'Social Awareness',    subscaleKey: 'managingOthers',   row: 'others', col: 'awareness' },
  { key: 'relationshipMgmt', label: 'Relationship Mgmt',  subscaleKey: 'utilization',      row: 'others', col: 'management' },
];

// ─── Helpers ──────────────────────────────────────────

interface QualityLevel {
  label: string;
  bgOpacity: number;
}

function getQualityLevel(score: number): QualityLevel {
  if (score >= 75) return { label: 'strong', bgOpacity: 0.22 };
  if (score >= 60) return { label: 'solid', bgOpacity: 0.15 };
  if (score >= 45) return { label: 'moderate', bgOpacity: 0.10 };
  return { label: 'developing', bgOpacity: 0.06 };
}

function getInsight(scores: number[]): string {
  const [selfAware, selfReg, socialAware, relMgmt] = scores;
  const awareness = (selfAware + socialAware) / 2;
  const management = (selfReg + relMgmt) / 2;
  const gap = awareness - management;

  if (gap > 12) {
    return 'You notice more than you manage — your awareness outpaces your ability to regulate. This is common and workable: the seeing is already there; now we build the steadying.';
  }
  if (gap < -12) {
    return 'You manage well but may miss subtle signals. Building perceptual awareness will give your strong management skills even better data to work with.';
  }
  if (awareness >= 65 && management >= 65) {
    return 'Your emotional intelligence is well-balanced — you notice what matters and can work with what you see. This is a genuine relational strength.';
  }
  return 'Your emotional landscape has room to grow in both awareness and management. Small improvements here create big ripple effects in relationships.';
}

// ─── Component ────────────────────────────────────────

export default function EQHeatmap({ sseitScores, onQuadrantTap }: EQHeatmapProps) {
  const scores = QUADRANTS.map(
    (q) => Math.round(sseitScores.subscaleNormalized[q.subscaleKey] ?? 50)
  );

  const insight = getInsight(scores);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.sectionLabel}>EMOTIONAL LANDSCAPE</Text>
      <Text style={styles.title}>Your Emotional Intelligence</Text>
      <Text style={styles.subtitle}>Where you notice vs. where you manage</Text>

      {/* Axis labels */}
      <View style={styles.axisRow}>
        <Text style={styles.axisLabel}>Awareness</Text>
        <Text style={styles.axisLabel}>Management</Text>
      </View>

      {/* 2×2 Grid */}
      <View style={styles.grid}>
        {/* Self row */}
        <View style={styles.rowLabelContainer}>
          <Text style={styles.rowLabel}>Self</Text>
        </View>
        <View style={styles.gridRow}>
          {QUADRANTS.filter((q) => q.row === 'self').map((q, i) => {
            const idx = QUADRANTS.indexOf(q);
            const score = scores[idx];
            const quality = getQualityLevel(score);
            return (
              <TouchableOpacity
                key={q.key}
                style={[
                  styles.cell,
                  { backgroundColor: Colors.primary + Math.round(quality.bgOpacity * 255).toString(16).padStart(2, '0') },
                  i === 0 && styles.cellTopLeft,
                  i === 1 && styles.cellTopRight,
                ]}
                onPress={() => onQuadrantTap?.(q.label, score)}
                activeOpacity={0.7}
              >
                <Text style={styles.cellScore}>{score}</Text>
                <Text style={styles.cellLabel}>{q.label}</Text>
                <Text style={styles.cellQuality}>{quality.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Others row */}
        <View style={styles.rowLabelContainer}>
          <Text style={styles.rowLabel}>Others</Text>
        </View>
        <View style={styles.gridRow}>
          {QUADRANTS.filter((q) => q.row === 'others').map((q, i) => {
            const idx = QUADRANTS.indexOf(q);
            const score = scores[idx];
            const quality = getQualityLevel(score);
            return (
              <TouchableOpacity
                key={q.key}
                style={[
                  styles.cell,
                  { backgroundColor: Colors.primary + Math.round(quality.bgOpacity * 255).toString(16).padStart(2, '0') },
                  i === 0 && styles.cellBottomLeft,
                  i === 1 && styles.cellBottomRight,
                ]}
                onPress={() => onQuadrantTap?.(q.label, score)}
                activeOpacity={0.7}
              >
                <Text style={styles.cellScore}>{score}</Text>
                <Text style={styles.cellLabel}>{q.label}</Text>
                <Text style={styles.cellQuality}>{quality.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Insight callout */}
      <View style={styles.insightBox}>
        <BrainIcon size={16} color={Colors.primary} />
        <Text style={styles.insightText}>{insight}</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────

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
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  // Axis labels
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xs,
    paddingHorizontal: 20, // offset for row labels
  },
  axisLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },

  // Grid
  grid: {
    marginBottom: Spacing.md,
  },
  rowLabelContainer: {
    marginBottom: 2,
    marginLeft: 4,
  },
  rowLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 2,
  },
  cell: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  cellTopLeft: { borderTopLeftRadius: BorderRadius.md },
  cellTopRight: { borderTopRightRadius: BorderRadius.md },
  cellBottomLeft: { borderBottomLeftRadius: BorderRadius.md },
  cellBottomRight: { borderBottomRightRadius: BorderRadius.md },
  cellScore: {
    fontFamily: FontFamilies.body,
    fontSize: 28,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  cellLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.text,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  cellQuality: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },

  // Insight callout
  insightBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  insightText: {
    ...Typography.bodySmall,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
});
