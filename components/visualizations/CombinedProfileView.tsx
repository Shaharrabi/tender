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
} from '@/constants/connectionMatrix';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';

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
  'ipip-neo-120': [
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

interface CombinedProfileViewProps {
  /** All assessment scores: { 'ecr-r': { id, scores }, ... } */
  allScores: Record<string, { id: string; scores: any }>;
  completedAssessments: string[];
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

  // Get connections for selected dimension
  const activeConnections = useMemo(() => {
    if (!selectedDim) return [];

    return ASSESSMENT_CONNECTIONS.filter(
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
  }, [selectedDim, completedAssessments]);

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

  // Render the connection info panel (reused inline after tapped card)
  const renderConnectionPanel = () => {
    if (!selectedDim || activeConnections.length === 0) return null;

    return (
      <View style={styles.connectionInfo}>
        <Text style={styles.connectionInfoTitle}>
          Connections ({activeConnections.length})
        </Text>
        {activeConnections.map((conn, i) => {
          const isFrom =
            conn.from.assessment === selectedDim.assessment &&
            conn.from.dimension === selectedDim.dimension;
          const otherSide = isFrom ? conn.to : conn.from;
          const otherColor =
            ASSESSMENT_COLORS[otherSide.assessment] || Colors.textMuted;

          return (
            <View key={i} style={styles.connectionRow}>
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
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 4,
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
});
