/**
 * CombinedProfileView — All 7 assessments as cards with mini dimension bars.
 *
 * Tap a dimension to see which other dimensions it connects to.
 * Connection lines are drawn as an SVG overlay when a dimension is tapped.
 */

import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
  ScrollView,
} from 'react-native';
import {
  ASSESSMENT_LABELS,
  ASSESSMENT_COLORS,
  ASSESSMENT_CONNECTIONS,
  type AssessmentConnection,
} from '@/constants/connectionMatrix';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { IndividualPortrait } from '@/types/portrait';

// ─── Portrait insight helper (mirrors assessment-matrix.tsx) ──

function getPortraitInsightForCard(
  assessmentKey: string,
  portrait: IndividualPortrait
): { narrative: string; growthEdges: Array<{ title: string; description: string }> } | null {
  const { fourLens, growthEdges, negativeCycle, compositeScores } = portrait;

  switch (assessmentKey) {
    case 'ecr-r':
      return {
        narrative: fourLens.attachment.narrative.slice(0, 500) + (fourLens.attachment.narrative.length > 500 ? '...' : ''),
        growthEdges: growthEdges
          .filter(e => e.category === 'attachment' || e.title.toLowerCase().includes('attach'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 2),
      };
    case 'tender-personality-60':
      return {
        narrative: fourLens.values?.narrative
          ? fourLens.values.narrative.slice(0, 500) + (fourLens.values.narrative.length > 500 ? '...' : '')
          : `Your personality profile shapes how you show up in relationships. Self-leadership: ${compositeScores.selfLeadership}/100.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'personality' || e.category === 'values')
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 2),
      };
    case 'sseit':
      return {
        narrative: fourLens.regulation?.narrative
          ? fourLens.regulation.narrative.slice(0, 500) + (fourLens.regulation.narrative.length > 500 ? '...' : '')
          : `Regulation capacity: ${compositeScores.regulationScore}/100, Window width: ${compositeScores.windowWidth}/100.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'regulation' || e.title.toLowerCase().includes('emotion'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 2),
      };
    case 'dsi-r':
      return {
        narrative: `Your differentiation reflects the balance between staying connected and maintaining your sense of self.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'differentiation' || e.title.toLowerCase().includes('boundar'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 2),
      };
    case 'dutch':
      return {
        narrative: `Your conflict style reveals protective patterns: "${negativeCycle.position}" position. Triggers: ${(negativeCycle.primaryTriggers || []).slice(0, 2).join(', ')}.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'conflict' || e.category === 'communication')
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 2),
      };
    case 'values':
      return {
        narrative: fourLens.values?.narrative
          ? fourLens.values.narrative.slice(0, 500) + (fourLens.values.narrative.length > 500 ? '...' : '')
          : `Values alignment: ${compositeScores.valuesCongruence}/100.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'values' || e.title.toLowerCase().includes('value'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 2),
      };
    case 'relational-field':
      return {
        narrative: fourLens.fieldAwareness?.narrative
          ? fourLens.fieldAwareness.narrative.slice(0, 500) + (fourLens.fieldAwareness.narrative.length > 500 ? '...' : '')
          : `Your relational field awareness reflects how attuned you are to the space between you and your partner.`,
        growthEdges: growthEdges
          .filter(e => e.title.toLowerCase().includes('field') || e.title.toLowerCase().includes('presence'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 2),
      };
    default:
      return null;
  }
}

// ─── Assessment dimension configs ──────────────────────────

interface DimensionConfig {
  key: string;
  label: string;
  min: number;
  max: number;
}

const ASSESSMENT_DIMENSIONS: Record<string, DimensionConfig[]> = {
  'ecr-r': [
    { key: 'anxietyScore', label: 'Anxiety', min: 1, max: 7 },
    { key: 'avoidanceScore', label: 'Avoidance', min: 1, max: 7 },
  ],
  'tender-personality-60': [
    { key: 'neuroticism', label: 'Neuroticism', min: 1, max: 5 },
    { key: 'extraversion', label: 'Extraversion', min: 1, max: 5 },
    { key: 'openness', label: 'Openness', min: 1, max: 5 },
    { key: 'agreeableness', label: 'Agreeableness', min: 1, max: 5 },
    { key: 'conscientiousness', label: 'Conscientiousness', min: 1, max: 5 },
  ],
  sseit: [
    { key: 'percievingOwn', label: 'Self-Awareness', min: 1, max: 5 },
    { key: 'managingOwn', label: 'Self-Regulation', min: 1, max: 5 },
    { key: 'percievingOthers', label: 'Empathy', min: 1, max: 5 },
    { key: 'managingOthers', label: 'Social Skills', min: 1, max: 5 },
  ],
  'dsi-r': [
    { key: 'emotionalReactivity', label: 'Emotional Reactivity', min: 1, max: 6 },
    { key: 'iPosition', label: 'I-Position', min: 1, max: 6 },
    { key: 'emotionalCutoff', label: 'Emotional Cutoff', min: 1, max: 6 },
    { key: 'fusionWithOthers', label: 'Fusion', min: 1, max: 6 },
  ],
  dutch: [
    { key: 'yielding', label: 'Yielding', min: 1, max: 5 },
    { key: 'compromising', label: 'Compromising', min: 1, max: 5 },
    { key: 'forcing', label: 'Competing', min: 1, max: 5 },
    { key: 'problemSolving', label: 'Problem-Solving', min: 1, max: 5 },
    { key: 'avoiding', label: 'Avoiding', min: 1, max: 5 },
  ],
  values: [
    { key: 'avoidanceTendency', label: 'Values Avoidance', min: 0, max: 100 },
  ],
  'relational-field': [
    { key: 'fieldRecognition', label: 'Field Recognition', min: 1, max: 7 },
    { key: 'creativeTension', label: 'Creative Tension', min: 1, max: 7 },
    { key: 'presenceAttunement', label: 'Presence & Attunement', min: 1, max: 7 },
    { key: 'emergentOrientation', label: 'Emergent Orientation', min: 1, max: 7 },
  ],
};

// ─── Score-aware connection deduplication ───────────────────
//
// Some connections are *conditionally* true — e.g., attachment anxiety
// can lead to EITHER yielding OR competing, depending on the person.
// When both connections exist in the static matrix, we keep only the
// one that matches the user's actual higher score.

function resolveContradictoryConnections(
  connections: AssessmentConnection[],
  scores: Record<string, { id: string; scores: any }>,
  selectedDim: { assessment: string; dimension: string },
): AssessmentConnection[] {
  // Group outgoing connections: same source → same target assessment
  // For connections where selectedDim is the FROM side
  const outgoingGroups = new Map<string, AssessmentConnection[]>();
  // For connections where selectedDim is the TO side
  const incomingGroups = new Map<string, AssessmentConnection[]>();
  const ungrouped: AssessmentConnection[] = [];

  for (const conn of connections) {
    const isFrom =
      conn.from.assessment === selectedDim.assessment &&
      conn.from.dimension === selectedDim.dimension;

    if (isFrom) {
      // Group by target assessment
      const key = conn.to.assessment;
      const group = outgoingGroups.get(key) || [];
      group.push(conn);
      outgoingGroups.set(key, group);
    } else {
      // Group by source assessment (reverse direction)
      const key = conn.from.assessment;
      const group = incomingGroups.get(key) || [];
      group.push(conn);
      incomingGroups.set(key, group);
    }
  }

  const result: AssessmentConnection[] = [];

  // Resolve outgoing groups (e.g., anxiety → [yielding, competing])
  for (const [targetAssessment, group] of outgoingGroups) {
    if (group.length <= 1) {
      result.push(...group);
      continue;
    }
    // Multiple connections to different dims in the same target assessment
    // Use actual user scores to pick the dominant one
    const targetScores = scores[targetAssessment]?.scores;
    if (!targetScores) {
      result.push(...group); // No scores — keep all
      continue;
    }

    let best = group[0];
    let bestScore = -Infinity;
    for (const conn of group) {
      const raw = targetScores[conn.to.dimension];
      const val = typeof raw === 'number' ? raw : (raw?.mean ?? 0);
      if (val > bestScore) {
        bestScore = val;
        best = conn;
      }
    }
    result.push(best);
  }

  // Resolve incoming groups (e.g., [anxiety, avoidance] → same target dim)
  for (const [sourceAssessment, group] of incomingGroups) {
    if (group.length <= 1) {
      result.push(...group);
      continue;
    }
    // Multiple connections from different dims of the same source assessment
    // Use the source dimension's actual score to pick the stronger influence
    const sourceScores = scores[sourceAssessment]?.scores;
    if (!sourceScores) {
      result.push(...group); // No scores — keep all
      continue;
    }

    let best = group[0];
    let bestScore = -Infinity;
    for (const conn of group) {
      const raw = sourceScores[conn.from.dimension];
      const val = typeof raw === 'number' ? raw : (raw?.mean ?? 0);
      if (val > bestScore) {
        bestScore = val;
        best = conn;
      }
    }
    result.push(best);
  }

  return result;
}

interface CombinedProfileViewProps {
  /** All assessment scores: { 'ecr-r': { id, scores }, ... } */
  allScores: Record<string, { id: string; scores: any }>;
  completedAssessments: string[];
  portrait?: IndividualPortrait | null;
}

// Position tracking for connection lines
interface DimensionPosition {
  assessment: string;
  dimension: string;
  x: number;
  y: number;
  width: number;
}

export function CombinedProfileView({
  allScores,
  completedAssessments,
  portrait,
}: CombinedProfileViewProps) {
  const [selectedDim, setSelectedDim] = useState<{
    assessment: string;
    dimension: string;
  } | null>(null);
  const [dimPositions, setDimPositions] = useState<Record<string, DimensionPosition>>({});
  const [containerOffset, setContainerOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<View>(null);

  // Track positions for connection lines
  const handleDimensionLayout = useCallback(
    (assessment: string, dimension: string, event: LayoutChangeEvent) => {
      const { x, y, width, height } = event.nativeEvent.layout;
      const key = `${assessment}.${dimension}`;
      setDimPositions((prev) => ({
        ...prev,
        [key]: {
          assessment,
          dimension,
          x: x + width / 2,
          y: y + height / 2,
          width,
        },
      }));
    },
    []
  );

  // Get connections for selected dimension — with score-aware filtering
  // to resolve contradictions (e.g., anxiety → yielding vs anxiety → competing)
  const activeConnections = useMemo(() => {
    if (!selectedDim) return [];

    const raw = ASSESSMENT_CONNECTIONS.filter(
      (c) =>
        (c.from.assessment === selectedDim.assessment &&
          c.from.dimension === selectedDim.dimension) ||
        (c.to.assessment === selectedDim.assessment &&
          c.to.dimension === selectedDim.dimension)
    ).filter(
      (c) =>
        completedAssessments.includes(c.from.assessment) &&
        completedAssessments.includes(c.to.assessment)
    );

    // Resolve contradictions: when the same source dimension connects to
    // multiple dimensions in the SAME target assessment (e.g., anxiety → yielding
    // AND anxiety → competing), keep only the connection whose target dimension
    // has the higher actual user score.
    return resolveContradictoryConnections(raw, allScores, selectedDim);
  }, [selectedDim, completedAssessments, allScores]);

  const handleDimPress = (assessment: string, dimension: string) => {
    if (
      selectedDim?.assessment === assessment &&
      selectedDim?.dimension === dimension
    ) {
      setSelectedDim(null);
    } else {
      setSelectedDim({ assessment, dimension });
    }
  };

  const isDimHighlighted = (assessment: string, dimension: string) => {
    if (!selectedDim) return false;
    if (selectedDim.assessment === assessment && selectedDim.dimension === dimension)
      return true;

    return activeConnections.some(
      (c) =>
        (c.from.assessment === assessment && c.from.dimension === dimension) ||
        (c.to.assessment === assessment && c.to.dimension === dimension)
    );
  };

  // Sort assessments: completed first
  const sortedAssessments = useMemo(() => {
    return Object.keys(ASSESSMENT_DIMENSIONS).sort((a, b) => {
      const aCompleted = completedAssessments.includes(a) ? 0 : 1;
      const bCompleted = completedAssessments.includes(b) ? 0 : 1;
      return aCompleted - bCompleted;
    });
  }, [completedAssessments]);

  // Determine if the selected dimension has a low score (below scale midpoint)
  // If so, connections from this dimension are less relevant for this user
  const selectedDimRelevance = useMemo(() => {
    if (!selectedDim) return { isLow: false, score: 0, label: '' };
    const dimConfig = (ASSESSMENT_DIMENSIONS[selectedDim.assessment] || [])
      .find((d) => d.key === selectedDim.dimension);
    if (!dimConfig) return { isLow: false, score: 0, label: '' };

    const scores = allScores[selectedDim.assessment]?.scores || {};
    const raw = scores[dimConfig.key];
    const val = typeof raw === 'number' ? raw : (raw?.mean ?? 0);
    const midpoint = (dimConfig.min + dimConfig.max) / 2;
    return { isLow: val < midpoint, score: val, label: dimConfig.label };
  }, [selectedDim, allScores]);

  // Render the connection info panel (reused inline after tapped card)
  const renderConnectionPanel = () => {
    if (!selectedDim || activeConnections.length === 0) return null;

    return (
      <View style={styles.connectionInfo}>
        <Text style={styles.connectionInfoTitle}>
          Connections ({activeConnections.length})
        </Text>
        {selectedDimRelevance.isLow && (
          <Text style={styles.connectionLowNote}>
            Your {selectedDimRelevance.label.toLowerCase()} is relatively low — these patterns may be less prominent for you.
          </Text>
        )}
        {activeConnections.map((conn, i) => {
          const isFrom =
            conn.from.assessment === selectedDim.assessment &&
            conn.from.dimension === selectedDim.dimension;
          const otherSide = isFrom ? conn.to : conn.from;
          const otherColor =
            ASSESSMENT_COLORS[otherSide.assessment] || Colors.textMuted;

          return (
            <View key={i} style={styles.connectionRowContainer}>
              <View style={styles.connectionRow}>
                <View
                  style={[styles.connectionDot, { backgroundColor: otherColor }]}
                />
                <View style={styles.connectionText}>
                  <Text style={styles.connectionDimLabel}>
                    {otherSide.label}
                  </Text>
                  <Text style={styles.connectionAssessment}>
                    {ASSESSMENT_LABELS[otherSide.assessment]}
                  </Text>
                </View>
                <View style={styles.connectionMeta}>
                  <Text
                    style={[
                      styles.connectionDirection,
                      {
                        color:
                          conn.direction === 'positive'
                            ? Colors.success
                            : Colors.error,
                      },
                    ]}
                  >
                    {conn.direction === 'positive' ? '+' : '\u2212'}
                  </Text>
                  <View style={styles.strengthDots}>
                    {[1, 2, 3].map((d) => (
                      <View
                        key={d}
                        style={[
                          styles.strengthDot,
                          {
                            backgroundColor:
                              d <=
                              (conn.strength === 'strong'
                                ? 3
                                : conn.strength === 'moderate'
                                ? 2
                                : 1)
                                ? otherColor
                                : Colors.progressTrack,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
              {conn.insight ? (
                <Text style={styles.connectionInsight}>{conn.insight}</Text>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container} ref={containerRef}>
      {sortedAssessments.map((assessment) => {
        const isCompleted = completedAssessments.includes(assessment);
        const scores = allScores[assessment]?.scores || {};
        const dimensions = ASSESSMENT_DIMENSIONS[assessment] || [];
        const color = ASSESSMENT_COLORS[assessment] || Colors.textMuted;
        const label = ASSESSMENT_LABELS[assessment] || assessment;
        const isCardSelected = selectedDim?.assessment === assessment;

        return (
          <React.Fragment key={assessment}>
            <View
              style={[
                styles.assessmentCard,
                !isCompleted && styles.assessmentCardLocked,
                { borderLeftColor: color },
                isCardSelected && { borderColor: color, borderWidth: 2 },
              ]}
            >
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={[styles.colorDot, { backgroundColor: color }]} />
                <Text style={styles.cardTitle}>{label}</Text>
                {!isCompleted && (
                  <Text style={styles.lockedBadge}>Not yet taken</Text>
                )}
              </View>

              {/* Dimension bars */}
              {isCompleted && (
                <View style={styles.dimensionList}>
                  {dimensions.map((dim) => {
                    const rawVal = scores[dim.key];
                    const value = typeof rawVal === 'number'
                      ? rawVal
                      : (rawVal && typeof rawVal === 'object' && typeof rawVal.mean === 'number')
                        ? rawVal.mean
                        : 0;
                    const percent = ((value - dim.min) / (dim.max - dim.min)) * 100;
                    const isHighlighted = isDimHighlighted(assessment, dim.key);
                    const isSelected =
                      selectedDim?.assessment === assessment &&
                      selectedDim?.dimension === dim.key;

                    return (
                      <TouchableOpacity
                        key={dim.key}
                        style={[
                          styles.dimensionRow,
                          isSelected && { backgroundColor: color + '10' },
                        ]}
                        onPress={() => handleDimPress(assessment, dim.key)}
                        onLayout={(e) => handleDimensionLayout(assessment, dim.key, e)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.dimensionLabel,
                            isHighlighted && { color, fontWeight: '600' },
                          ]}
                          numberOfLines={1}
                        >
                          {dim.label}
                        </Text>
                        <View style={styles.miniBar}>
                          <View
                            style={[
                              styles.miniBarFill,
                              {
                                width: `${Math.max(percent, 2)}%`,
                                backgroundColor: isHighlighted ? color : color + '60',
                              },
                            ]}
                          />
                        </View>
                        <Text
                          style={[
                            styles.dimensionValue,
                            isHighlighted && { color },
                          ]}
                        >
                          {value.toFixed(1)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Portrait context — what this assessment reveals */}
            {isCompleted && portrait && (() => {
              const insight = getPortraitInsightForCard(assessment, portrait);
              if (!insight) return null;
              return (
                <View style={[styles.portraitCard, { borderLeftColor: color }]}>
                  <Text style={styles.portraitCardTitle}>What This Reveals</Text>
                  <Text style={styles.portraitCardNarrative}>{insight.narrative}</Text>
                  {insight.growthEdges.length > 0 && (
                    <View style={styles.portraitGrowthEdges}>
                      {insight.growthEdges.map((edge, i) => (
                        <View key={i} style={{ marginBottom: 3 }}>
                          <Text style={styles.portraitGrowthText}>
                            {'\u2022'} {edge.title}
                          </Text>
                          {edge.description ? (
                            <Text style={styles.portraitGrowthDescription}>
                              {edge.description}
                            </Text>
                          ) : null}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })()}

            {/* Fallback when portrait isn't available yet */}
            {isCompleted && !portrait && (
              <View style={[styles.portraitCard, { borderLeftColor: color, opacity: 0.6 }]}>
                <Text style={styles.portraitCardTitle}>What This Reveals</Text>
                <Text style={styles.portraitCardNarrative}>
                  Complete all 6 assessments to see integrated portrait insights for this dimension.
                </Text>
              </View>
            )}

            {/* Connection info — renders directly below the tapped card */}
            {isCardSelected && renderConnectionPanel()}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  assessmentCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderLeftWidth: 3,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  assessmentCardLocked: {
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardTitle: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
  },
  lockedBadge: {
    fontSize: 10,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  dimensionList: {
    gap: Spacing.xs,
  },
  dimensionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 3,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  dimensionLabel: {
    width: 100,
    fontSize: 11,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
  },
  miniBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.progressTrack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  dimensionValue: {
    width: 30,
    fontSize: 10,
    fontFamily: FontFamilies.accent,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  // Connection info panel
  connectionInfo: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  connectionInfoTitle: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  connectionRowContainer: {
    gap: 4,
    paddingVertical: 4,
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionText: {
    flex: 1,
    gap: 1,
  },
  connectionDimLabel: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.text,
    fontWeight: '500',
  },
  connectionAssessment: {
    fontSize: 10,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
  },
  connectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectionDirection: {
    fontSize: 14,
    fontWeight: '700',
  },
  strengthDots: {
    flexDirection: 'row',
    gap: 2,
  },
  strengthDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  connectionInsight: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    lineHeight: 16,
    paddingLeft: 20,
    fontStyle: 'italic',
  },
  connectionLowNote: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: Colors.progressTrack + '40',
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  // Portrait context card per assessment
  portraitCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    ...Shadows.subtle,
  },
  portraitCardTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  portraitCardNarrative: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  portraitGrowthEdges: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 2,
  },
  portraitGrowthText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    paddingLeft: 4,
  },
  portraitGrowthDescription: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    paddingLeft: 12,
    marginTop: 1,
  },
});
