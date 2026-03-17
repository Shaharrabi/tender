/**
 * MatrixTab — Attachment matrix with explore mode, connections, and profile.
 *
 * This is the ATTACHMENT-focused matrix tab (ECR-R scatter plot).
 * The integrated cross-assessment overview lives in its own tab: "Your Key".
 *
 * Sub-segments: Attachment | Connections | Profile
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { LockIcon } from '@/assets/graphics/icons';
import { AttachmentMatrix } from '@/components/visualizations/AttachmentMatrix';
import { ExploreMode } from '@/components/visualizations/ExploreMode';
import { ConnectionMap } from '@/components/visualizations/ConnectionMap';
import { RippleEffectsCard } from '@/components/visualizations/RippleEffectsCard';
import { CombinedProfileView } from '@/components/visualizations/CombinedProfileView';
import RadarChart from '@/components/visualizations/RadarChart';
import WaterfallChart from '@/components/visualizations/WaterfallChart';
import ConflictRose from '@/components/visualizations/ConflictRose';
import EQHeatmap from '@/components/visualizations/EQHeatmap';
import { calculateRipples } from '@/utils/visualizations/rippleEffects';
import { getECRRInterpretation } from '@/utils/assessments/interpretations/ecr-r';
import { ASSESSMENT_COLORS } from '@/constants/connectionMatrix';
import type { IndividualPortrait } from '@/types';
import type { ECRRScores, AttachmentStyle } from '@/types';

// ─── Sub-segment definitions ─────────────────────────

type Segment = 'overview' | 'explore' | 'connections' | 'profile';

const SEGMENTS: { key: Segment; label: string; minAssessments: number }[] = [
  { key: 'overview', label: 'Attachment', minAssessments: 1 },
  { key: 'connections', label: 'Connections', minAssessments: 2 },
  { key: 'profile', label: 'Profile', minAssessments: 3 },
];

// ─── Portrait insight helper ─────────────────────────

interface PortraitInsight {
  narrative: string;
  growthEdges: Array<{ title: string; description: string }>;
}

function getPortraitInsightForAssessment(
  assessmentKey: string,
  portrait: IndividualPortrait,
): PortraitInsight | null {
  const { fourLens, growthEdges, negativeCycle, compositeScores } = portrait;

  switch (assessmentKey) {
    case 'ecr-r':
      return {
        narrative: fourLens.attachment.narrative.slice(0, 500) + (fourLens.attachment.narrative.length > 500 ? '\u2026' : ''),
        growthEdges: growthEdges
          .filter(e => e.category === 'attachment' || e.title.toLowerCase().includes('attach'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    case 'ipip-neo-120':
      return {
        narrative: fourLens.parts?.narrative
          ? fourLens.parts.narrative.slice(0, 500) + (fourLens.parts.narrative.length > 500 ? '\u2026' : '')
          : `Your personality profile shapes how you show up in love. Self-leadership: ${compositeScores.selfLeadership}/100. ${portrait.bigFiveReframes?.[0] ?? ''}`,
        growthEdges: growthEdges
          .filter(e => e.category === 'personality' || e.category === 'differentiation' || e.title.toLowerCase().includes('part'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    case 'sseit':
      return {
        narrative: fourLens.regulation?.narrative
          ? fourLens.regulation.narrative.slice(0, 500) + (fourLens.regulation.narrative.length > 500 ? '\u2026' : '')
          : `Emotional intelligence shapes how you read and manage feelings. Regulation: ${compositeScores.regulationScore}/100.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'regulation' || e.title.toLowerCase().includes('emotion'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    case 'dsi-r': {
      const diffScore = compositeScores.differentiation ?? 0;
      const selfLead = compositeScores.selfLeadership ?? 0;
      const diffLevel = diffScore >= 70 ? 'strong' : diffScore >= 45 ? 'moderate' : 'developing';
      return {
        narrative: `Your differentiation is ${diffLevel} (${Math.round(diffScore)}/100) \u2014 this shapes how well you hold onto yourself while staying connected. Self-leadership sits at ${Math.round(selfLead)}/100. ${diffScore < 45 ? 'When emotions run high, the line between your feelings and your partner\'s can blur. Building your I-position \u2014 knowing what you think and feel independent of the relationship \u2014 is your growth edge.' : diffScore >= 70 ? 'You can stay present in difficult conversations without losing yourself. This is a relational strength.' : 'You hold your ground in some situations but may lose yourself in others, especially when attachment anxiety rises.'}`,
        growthEdges: growthEdges
          .filter(e => e.category === 'differentiation' || e.title.toLowerCase().includes('boundar'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    }
    case 'dutch': {
      const conflictFlex = compositeScores.conflictFlexibility ?? 0;
      return {
        narrative: `Your conflict position is "${negativeCycle.position}". Primary triggers: ${(negativeCycle.primaryTriggers || []).slice(0, 3).join(', ') || 'not yet identified'}. Conflict flexibility: ${Math.round(conflictFlex)}/100. ${conflictFlex < 40 ? 'You tend to rely on one or two strategies in conflict, which can create rigid patterns your partner learns to predict.' : conflictFlex >= 65 ? 'You show good flexibility in how you approach conflict \u2014 adjusting your strategy based on what the moment needs.' : 'You have some flexibility but may default to protective patterns when stress is high.'}`,
        growthEdges: growthEdges
          .filter(e => e.category === 'conflict' || e.category === 'communication')
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    }
    case 'values':
      return {
        narrative: fourLens.values?.narrative
          ? fourLens.values.narrative.slice(0, 500) + (fourLens.values.narrative.length > 500 ? '\u2026' : '')
          : `Values alignment: ${compositeScores.valuesCongruence}/100.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'values' || e.title.toLowerCase().includes('value'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    default:
      return null;
  }
}

// ─── Props ───────────────────────────────────────────

interface MatrixTabProps {
  allScores: Record<string, { id: string; scores: any }>;
  portrait: IndividualPortrait | null;
}

// ─── Component ───────────────────────────────────────

export default function MatrixTab({ allScores, portrait }: MatrixTabProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // ── UI state ──
  const [activeSegment, setActiveSegment] = useState<Segment>('overview');
  const [isExploring, setIsExploring] = useState(false);
  const [exploredAnxiety, setExploredAnxiety] = useState<number | null>(null);
  const [exploredAvoidance, setExploredAvoidance] = useState<number | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  // ── Derived data ──
  const completedAssessments = useMemo(() => Object.keys(allScores), [allScores]);
  const completedCount = completedAssessments.length;

  const ecrScores: ECRRScores | null = useMemo(() => {
    const ecr = allScores['ecr-r']?.scores;
    if (!ecr) return null;
    return {
      anxietyScore: ecr.anxietyScore ?? 4,
      avoidanceScore: ecr.avoidanceScore ?? 4,
      attachmentStyle: (ecr.attachmentStyle ?? 'secure') as AttachmentStyle,
    };
  }, [allScores]);

  const interpretation = useMemo(
    () => (ecrScores ? getECRRInterpretation(ecrScores.attachmentStyle) : null),
    [ecrScores],
  );

  // Ripple effects for explore mode
  const rippleEffects = useMemo(() => {
    if (!isExploring || !ecrScores) return [];
    const effects: ReturnType<typeof calculateRipples> = [];

    const anxietyVal = exploredAnxiety ?? ecrScores.anxietyScore;
    if (Math.abs(anxietyVal - ecrScores.anxietyScore) > 0.3) {
      const direction = anxietyVal > ecrScores.anxietyScore ? 'increase' : 'decrease';
      effects.push(...calculateRipples('ecr-r', 'anxietyScore', direction as 'increase' | 'decrease'));
    }

    const avoidanceVal = exploredAvoidance ?? ecrScores.avoidanceScore;
    if (Math.abs(avoidanceVal - ecrScores.avoidanceScore) > 0.3) {
      const direction = avoidanceVal > ecrScores.avoidanceScore ? 'increase' : 'decrease';
      const avoidanceEffects = calculateRipples('ecr-r', 'avoidanceScore', direction as 'increase' | 'decrease');
      for (const eff of avoidanceEffects) {
        if (!effects.some(e => e.targetDimension === eff.targetDimension && e.targetAssessment === eff.targetAssessment)) {
          effects.push(eff);
        }
      }
    }
    return effects;
  }, [isExploring, exploredAnxiety, exploredAvoidance, ecrScores]);

  // ── Handlers ──
  const handleToggleExplore = useCallback((exploring: boolean) => {
    setIsExploring(exploring);
    if (!exploring) {
      setExploredAnxiety(null);
      setExploredAvoidance(null);
    }
  }, []);

  const handleReset = useCallback(() => {
    setExploredAnxiety(null);
    setExploredAvoidance(null);
  }, []);

  // ── No data at all ──
  if (completedCount < 1) {
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.emptyState}>
          <TenderText variant="body" color={Colors.textSecondary} align="center">
            Complete at least one assessment to unlock the Matrix.
          </TenderText>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Sub-segment pills */}
      <View style={styles.segmentRow}>
        {SEGMENTS.map((seg) => {
          const isActive = activeSegment === seg.key;
          const isLocked = completedCount < seg.minAssessments;
          return (
            <TouchableOpacity
              key={seg.key}
              style={[
                styles.segmentPill,
                isActive && styles.segmentPillActive,
                isLocked && styles.segmentPillLocked,
              ]}
              onPress={() => !isLocked && setActiveSegment(seg.key)}
              activeOpacity={isLocked ? 1 : 0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              {isLocked && <LockIcon size={10} color={Colors.textMuted} />}
              <TenderText
                variant="caption"
                color={isActive ? Colors.primary : isLocked ? Colors.textMuted : Colors.textSecondary}
                style={isActive ? { fontWeight: '600' } : undefined}
              >
                {seg.label}
              </TenderText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ═══ OVERVIEW — Attachment scatter plot + explore mode ═══ */}
      {(activeSegment === 'overview' || activeSegment === 'explore') && ecrScores && (
        <View style={styles.segmentContent}>
          {interpretation && (
            <View style={styles.styleHeader}>
              <TenderText variant="headingM" color={Colors.primary}>{interpretation.warmLabel}</TenderText>
              <TenderText variant="caption" color={Colors.textMuted}>{interpretation.label}</TenderText>
            </View>
          )}

          <AttachmentMatrix
            anxietyScore={ecrScores.anxietyScore}
            avoidanceScore={ecrScores.avoidanceScore}
            attachmentStyle={ecrScores.attachmentStyle}
            exploredAnxiety={exploredAnxiety ?? undefined}
            exploredAvoidance={exploredAvoidance ?? undefined}
            isExploreMode={isExploring}
          />

          <ExploreMode
            anxietyScore={ecrScores.anxietyScore}
            avoidanceScore={ecrScores.avoidanceScore}
            attachmentStyle={ecrScores.attachmentStyle}
            exploredAnxiety={exploredAnxiety}
            exploredAvoidance={exploredAvoidance}
            isExploring={isExploring}
            onToggleExplore={handleToggleExplore}
            onExploreAnxiety={setExploredAnxiety}
            onExploreAvoidance={setExploredAvoidance}
            onReset={handleReset}
          />

          {rippleEffects.length > 0 && (
            <RippleEffectsCard
              effects={rippleEffects}
              sourceDimension="Attachment"
              changeDirection={
                (exploredAnxiety ?? ecrScores.anxietyScore) > ecrScores.anxietyScore
                  ? 'increase'
                  : 'decrease'
              }
            />
          )}

          {interpretation && !isExploring && (
            <View style={styles.interpretationCard}>
              <TenderText variant="label" color={Colors.textMuted} style={styles.interpretLabel}>UNDERSTANDING YOUR PATTERN</TenderText>
              <TenderText variant="body" color={Colors.textSecondary} style={{ lineHeight: 24 }}>
                {interpretation.interpretation}
              </TenderText>
              {interpretation.growthEdge && (
                <>
                  <TenderText variant="label" color={Colors.success} style={styles.interpretLabel}>YOUR GROWTH EDGE</TenderText>
                  <TenderText variant="bodySmall" color={Colors.textSecondary} style={{ lineHeight: 22, fontStyle: 'italic' }}>
                    {interpretation.growthEdge}
                  </TenderText>
                </>
              )}
            </View>
          )}
        </View>
      )}

      {/* ═══ CONNECTIONS SEGMENT ═══ */}
      {activeSegment === 'connections' && (
        <View style={styles.segmentContent}>
          <TenderText variant="headingS" color={Colors.text} align="center">How Your Dimensions Connect</TenderText>
          <TenderText variant="bodySmall" color={Colors.textSecondary} align="center" style={{ marginTop: -Spacing.xs }}>
            Tap an assessment node to see its connections
          </TenderText>

          <ConnectionMap
            completedAssessments={completedAssessments}
            highlightAssessment={selectedAssessment ?? undefined}
            onSelectAssessment={setSelectedAssessment}
          />

          {selectedAssessment && portrait && (() => {
            const insight = getPortraitInsightForAssessment(selectedAssessment, portrait);
            if (!insight) return null;
            const nodeColor = ASSESSMENT_COLORS[selectedAssessment] || Colors.primary;
            return (
              <View style={[styles.insightCard, { borderLeftColor: nodeColor }]}>
                <TenderText variant="label" color={Colors.textMuted} style={styles.interpretLabel}>WHAT THIS REVEALS</TenderText>
                {selectedAssessment === 'ecr-r' && interpretation && (
                  <TenderText variant="headingS" color={Colors.primary}>{interpretation.warmLabel}</TenderText>
                )}
                <TenderText variant="bodySmall" color={Colors.text} style={{ lineHeight: 20 }}>
                  {insight.narrative}
                </TenderText>
                {insight.growthEdges.length > 0 && (
                  <View style={styles.insightEdges}>
                    <TenderText variant="label" color={Colors.textMuted} style={styles.interpretLabel}>GROWTH EDGES</TenderText>
                    {insight.growthEdges.map((edge, i) => (
                      <View key={i} style={{ marginBottom: 4 }}>
                        <TenderText variant="bodySmall" color={Colors.textSecondary} style={{ lineHeight: 18 }}>
                          {'\u2022'} {edge.title}
                        </TenderText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })()}

          {completedCount < 6 && (
            <View style={styles.hintBox}>
              <TenderText variant="caption" color={Colors.textSecondary} align="center">
                Complete {6 - completedCount} more assessment{6 - completedCount > 1 ? 's' : ''} to see all connections.
              </TenderText>
            </View>
          )}
        </View>
      )}

      {/* ═══ PROFILE SEGMENT ═══ */}
      {activeSegment === 'profile' && (
        <View style={styles.segmentContent}>
          <TenderText variant="headingS" color={Colors.text} align="center">Your Complete Profile</TenderText>
          <TenderText variant="bodySmall" color={Colors.textSecondary} align="center" style={{ marginTop: -Spacing.xs }}>
            Tap any dimension to see how it connects
          </TenderText>

          {portrait && <RadarChart scores={portrait.compositeScores} />}

          <CombinedProfileView
            allScores={allScores}
            completedAssessments={completedAssessments}
            portrait={portrait}
          />

          {portrait && <WaterfallChart compositeScores={portrait.compositeScores} />}

          {allScores['sseit']?.scores && (
            <EQHeatmap sseitScores={allScores['sseit'].scores} />
          )}

          {allScores['dutch']?.scores && (
            <ConflictRose dutchScores={allScores['dutch'].scores} />
          )}
        </View>
      )}
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────

const styles = StyleSheet.create({
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  segmentRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.pill,
    padding: 3,
    marginBottom: Spacing.md,
  },
  segmentPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  segmentPillActive: {
    backgroundColor: Colors.surface,
    ...Shadows.subtle,
  },
  segmentPillLocked: {
    opacity: 0.5,
  },
  segmentContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  styleHeader: {
    alignItems: 'center',
    gap: 2,
    marginBottom: Spacing.xs,
  },
  interpretationCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  interpretLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
  },
  insightCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  insightEdges: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 2,
  },
  hintBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
});
