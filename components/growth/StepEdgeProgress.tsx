/**
 * StepEdgeProgress — Shows growth edge progress bars inside step-detail.
 *
 * For each practice in the current step, shows which growth edges it
 * supports and the user's progress toward the next stage threshold.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { getEdgesForPractices } from '@/utils/portrait/growth-edges';
import type { IndividualPortrait } from '@/types';
import type { GrowthEdgeProgress, GrowthStage } from '@/types/growth';

// ─── Constants ────────────────────────────────────────────

const STAGE_COLORS: Record<GrowthStage, string> = {
  emerging: Colors.warning,
  practicing: Colors.calm,
  integrating: Colors.primary,
  integrated: Colors.success,
};

const STAGE_THRESHOLDS: Record<GrowthStage, number> = {
  emerging: 3,
  practicing: 8,
  integrating: 15,
  integrated: 15, // already done
};

// ─── Props ────────────────────────────────────────────────

interface StepEdgeProgressProps {
  stepPracticeIds: string[];
  portrait: IndividualPortrait;
  edgeProgressMap: Record<string, GrowthEdgeProgress>;
}

// ─── Component ────────────────────────────────────────────

export default function StepEdgeProgress({
  stepPracticeIds,
  portrait,
  edgeProgressMap,
}: StepEdgeProgressProps) {
  // 1. Find which edges the step's practices map to
  const edgeMatches = getEdgesForPractices(stepPracticeIds);

  // 2. Filter to edges that exist in this user's portrait
  const userEdgeIds = new Set(portrait.growthEdges.map((e) => e.id));
  const relevantEdges: Array<{
    edgeId: string;
    matchingPractices: string[];
    edgeDef: (typeof portrait.growthEdges)[0];
  }> = [];

  for (const match of edgeMatches) {
    // Direct match
    if (userEdgeIds.has(match.edgeId)) {
      const edgeDef = portrait.growthEdges.find((e) => e.id === match.edgeId);
      if (edgeDef) {
        relevantEdges.push({ ...match, edgeDef });
      }
    }
    // values_gap generic marker — match any values_gap_* in portrait
    if (match.edgeId === 'values_gap') {
      for (const edge of portrait.growthEdges) {
        if (
          edge.id.startsWith('values_gap_') &&
          !relevantEdges.some((r) => r.edgeId === edge.id)
        ) {
          relevantEdges.push({
            edgeId: edge.id,
            matchingPractices: match.matchingPractices,
            edgeDef: edge,
          });
        }
      }
    }
  }

  if (relevantEdges.length === 0) return null;

  return (
    <View style={s.container}>
      <TenderText
        variant="bodySmall"
        style={s.sectionLabel}
        color={Colors.textMuted}
      >
        GROWTH EDGES THIS STEP SUPPORTS
      </TenderText>

      {relevantEdges.map(({ edgeId, matchingPractices, edgeDef }) => {
        const progress = edgeProgressMap[edgeId];
        const stage: GrowthStage = (progress?.stage as GrowthStage) ?? 'emerging';
        const count = progress?.practiceCount ?? 0;
        const threshold = STAGE_THRESHOLDS[stage];
        const color = STAGE_COLORS[stage];
        const fillPct = Math.min(100, (count / threshold) * 100);

        return (
          <View key={edgeId} style={s.edgeCard}>
            <View style={s.edgeHeader}>
              <TenderText variant="bodySmall" style={s.edgeTitle}>
                {edgeDef.title}
              </TenderText>
              <View
                style={[
                  s.stagePill,
                  { backgroundColor: color + '18', borderColor: color + '40' },
                ]}
              >
                <TenderText
                  variant="caption"
                  color={color}
                  style={s.stageText}
                >
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </TenderText>
              </View>
            </View>

            {/* Progress bar */}
            <View style={s.track}>
              <View
                style={[s.trackFill, { width: `${fillPct}%`, backgroundColor: color }]}
              />
            </View>

            <TenderText variant="caption" color={Colors.textMuted} style={s.countLabel}>
              {count}/{threshold} practices
              {stage === 'integrated' ? ' · Integrated ✓' : ''}
              {matchingPractices.length > 0
                ? ` · ${matchingPractices.length} in this step`
                : ''}
            </TenderText>
          </View>
        );
      })}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  sectionLabel: {
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontSize: 10,
    marginBottom: Spacing.sm,
  },
  edgeCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.sm + 4,
    marginBottom: Spacing.sm,
  },
  edgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  edgeTitle: {
    fontWeight: '600',
    flex: 1,
    marginRight: Spacing.sm,
  },
  stagePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  stageText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  track: {
    height: 4,
    backgroundColor: Colors.progressTrack,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  trackFill: {
    height: 4,
    borderRadius: 2,
  },
  countLabel: {
    fontSize: 11,
  },
});
