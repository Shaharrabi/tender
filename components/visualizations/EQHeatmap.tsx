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

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
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

// New empathy subscales from EQ expansion (Phase 3)
const EMPATHY_CELLS: QuadrantDef[] = [
  { key: 'perspectiveTaking', label: 'Perspective Taking', subscaleKey: 'perspectiveTaking', row: 'others', col: 'awareness' },
  { key: 'empathicResonance', label: 'Empathic Resonance', subscaleKey: 'empathicResonance', row: 'others', col: 'management' },
];

function getQuadrantDetail(key: string, score: number): { title: string; description: string; practice: string } {
  const details: Record<string, { title: string; description: string; practice: string }> = {
    selfAwareness: {
      title: 'Perceiving Your Own Emotions',
      description: score >= 65
        ? 'You have a strong ability to identify and name your own emotional states. This clarity helps you respond rather than react in relationships.'
        : 'You may sometimes struggle to identify what you\'re feeling in the moment. Building this skill gives you more choice in how you respond to relational triggers.',
      practice: 'Try naming your emotion 3 times a day: "Right now I feel..."',
    },
    selfRegulation: {
      title: 'Managing Your Emotional Responses',
      description: score >= 65
        ? 'You can effectively manage your emotional intensity — staying present without being overwhelmed. This is a core relational strength.'
        : 'When emotions run high, you may find it hard to stay regulated. This is where relational patterns get activated most strongly.',
      practice: 'When activated, try the 5-4-3-2-1 grounding technique before responding.',
    },
    socialAwareness: {
      title: 'Reading Others\' Emotions',
      description: score >= 65
        ? 'You pick up on others\' emotional cues with sensitivity. Your partner likely feels seen and understood by you.'
        : 'You may sometimes miss emotional signals from others. Building this attunement creates deeper relational safety.',
      practice: 'Practice noticing your partner\'s emotional tone before their words.',
    },
    relationshipMgmt: {
      title: 'Navigating Relational Dynamics',
      description: score >= 65
        ? 'You can influence emotional dynamics in relationships constructively — de-escalating tension and fostering connection.'
        : 'Managing the emotional flow between people is your growth edge. This is where EQ translates directly into relational quality.',
      practice: 'After your next difficult conversation, reflect: "What did I do that helped or hurt the emotional flow?"',
    },
    perspectiveTaking: {
      title: 'Seeing Through Your Partner\'s Eyes',
      description: score >= 65
        ? 'You can step into your partner\'s perspective — even during conflict. This is a powerful repair tool: understanding their view doesn\'t mean agreeing, but it opens the door.'
        : 'Taking your partner\'s perspective during disagreements is challenging for you. This doesn\'t mean you lack empathy — it means the skill of shifting viewpoints under stress needs building.',
      practice: 'Before responding in your next disagreement, pause and say: "Help me understand what this looks like from where you\'re standing."',
    },
    empathicResonance: {
      title: 'Feeling What Your Partner Feels',
      description: score >= 65
        ? 'You feel your partner\'s emotional states deeply — their joy lifts you, their pain moves you. This resonance is a gift, but watch for enmeshment: their feelings are information, not instructions.'
        : 'You may not always feel the emotional echo of your partner\'s experience. This can create distance but also protects you from overwhelm. The growth edge is opening to their experience without losing yourself.',
      practice: 'Try sitting quietly with your partner for 2 minutes. Notice what you feel in your body — not what you think, what you feel.',
    },
  };
  return details[key] ?? { title: '', description: '', practice: '' };
}

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
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const scores = QUADRANTS.map(
    (q) => Math.round(sseitScores.subscaleNormalized[q.subscaleKey] ?? 50)
  );

  const insight = getInsight(scores);

  const handleQuadrantTap = (q: QuadrantDef, score: number) => {
    setExpandedKey(expandedKey === q.key ? null : q.key);
    onQuadrantTap?.(q.label, score);
  };

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
                onPress={() => handleQuadrantTap(q, score)}
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
                onPress={() => handleQuadrantTap(q, score)}
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

      {/* Empathy row (PT + ER from EQ expansion) */}
      {(sseitScores.subscaleNormalized?.perspectiveTaking != null ||
        sseitScores.subscaleNormalized?.empathicResonance != null) && (
        <>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>Empathy</Text>
          </View>
          <View style={styles.gridRow}>
            {EMPATHY_CELLS.map((q, i) => {
              const score = Math.round(sseitScores.subscaleNormalized[q.subscaleKey] ?? 50);
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
                  onPress={() => handleQuadrantTap(q, score)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cellScore}>{score}</Text>
                  <Text style={styles.cellLabel}>{q.label}</Text>
                  <Text style={styles.cellQuality}>{quality.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* Expanded detail card — shows when a quadrant is tapped */}
      {expandedKey && (() => {
        const allCells = [...QUADRANTS, ...EMPATHY_CELLS];
        const q = allCells.find(qd => qd.key === expandedKey);
        if (!q) return null;
        const score = Math.round(sseitScores.subscaleNormalized[q.subscaleKey] ?? 50);
        const detail = getQuadrantDetail(q.key, score);
        return (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{detail.title}</Text>
              <View style={[styles.detailScoreBadge, { backgroundColor: Colors.primary + '18' }]}>
                <Text style={[styles.detailScoreText, { color: Colors.primary }]}>{score}</Text>
              </View>
            </View>
            <Text style={styles.detailDesc}>{detail.description}</Text>
            <View style={styles.detailPractice}>
              <Text style={styles.detailPracticeLabel}>TRY THIS</Text>
              <Text style={styles.detailPracticeText}>{detail.practice}</Text>
            </View>
            <TouchableOpacity onPress={() => setExpandedKey(null)} style={styles.detailClose}>
              <Text style={styles.detailCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      })()}

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
    fontFamily: FontFamilies.heading,
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

  // Detail card (expanded on quadrant tap)
  detailCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  detailTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  detailScoreBadge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  detailScoreText: {
    fontFamily: FontFamilies.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  detailDesc: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  detailPractice: {
    backgroundColor: Colors.success + '12',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.success,
    marginBottom: Spacing.sm,
  },
  detailPracticeLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.success,
    marginBottom: 4,
  },
  detailPracticeText: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  detailClose: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
  detailCloseText: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
