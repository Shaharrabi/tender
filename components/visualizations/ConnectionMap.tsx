/**
 * ConnectionMap — SVG node graph showing assessment interconnections.
 *
 * Renders assessment nodes as colored circles in a circular layout.
 * Connection lines between nodes vary in opacity by strength.
 * Tap a node to highlight its connections.
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Circle as SvgCircle,
  Line as SvgLine,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import {
  ASSESSMENT_LABELS,
  ASSESSMENT_COLORS,
  ASSESSMENT_CONNECTIONS,
} from '@/constants/connectionMatrix';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAP_SIZE = Math.min(SCREEN_WIDTH - Spacing.lg * 2, 320);
const CENTER = MAP_SIZE / 2;
const RADIUS = MAP_SIZE * 0.35; // Node orbit radius
const NODE_RADIUS = 22;

// Assessments to show (only those with connections)
const CONNECTED_ASSESSMENTS = [
  'ecr-r',
  'tender-personality-60',
  'sseit',
  'dsi-r',
  'dutch',
  'values',
  'relational-field',
];

interface ConnectionMapProps {
  /** Which assessments the user has completed */
  completedAssessments: string[];
  /** Assessment to highlight (optional) */
  highlightAssessment?: string;
  onSelectAssessment?: (assessment: string | null) => void;
}

export function ConnectionMap({
  completedAssessments,
  highlightAssessment,
  onSelectAssessment,
}: ConnectionMapProps) {
  const [selected, setSelected] = useState<string | null>(highlightAssessment || null);

  // Position nodes in a circle
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const count = CONNECTED_ASSESSMENTS.length;

    CONNECTED_ASSESSMENTS.forEach((assessment, i) => {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2; // Start at top
      positions[assessment] = {
        x: CENTER + RADIUS * Math.cos(angle),
        y: CENTER + RADIUS * Math.sin(angle),
      };
    });

    return positions;
  }, []);

  // Filter connections to show (both sides must be completed)
  const visibleConnections = useMemo(() => {
    return ASSESSMENT_CONNECTIONS.filter(
      (c) =>
        completedAssessments.includes(c.from.assessment) &&
        completedAssessments.includes(c.to.assessment)
    );
  }, [completedAssessments]);

  const handleNodePress = (assessment: string) => {
    const next = selected === assessment ? null : assessment;
    setSelected(next);
    onSelectAssessment?.(next);
  };

  // Check if a connection involves the selected assessment
  const isConnectionHighlighted = (from: string, to: string) => {
    if (!selected) return true;
    return from === selected || to === selected;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mapWrapper, { width: MAP_SIZE, height: MAP_SIZE }]}>
        <Svg width={MAP_SIZE} height={MAP_SIZE} viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}>
          <Defs>
            {/* Gradients for connection lines */}
            {visibleConnections.map((conn, i) => {
              const fromColor = ASSESSMENT_COLORS[conn.from.assessment] || Colors.textMuted;
              const toColor = ASSESSMENT_COLORS[conn.to.assessment] || Colors.textMuted;
              return (
                <LinearGradient
                  key={`grad-${i}`}
                  id={`conn-grad-${i}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <Stop offset="0%" stopColor={fromColor} stopOpacity={0.6} />
                  <Stop offset="100%" stopColor={toColor} stopOpacity={0.6} />
                </LinearGradient>
              );
            })}
          </Defs>

          {/* Connection lines */}
          {visibleConnections.map((conn, i) => {
            const from = nodePositions[conn.from.assessment];
            const to = nodePositions[conn.to.assessment];
            if (!from || !to) return null;

            const highlighted = isConnectionHighlighted(
              conn.from.assessment,
              conn.to.assessment
            );
            const opacity = highlighted ? conn.strengthValue * 0.8 : 0.08;
            const strokeWidth = conn.strength === 'strong' ? 3 : conn.strength === 'moderate' ? 2 : 1;

            return (
              <SvgLine
                key={`line-${i}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={`url(#conn-grad-${i})`}
                strokeWidth={highlighted ? strokeWidth : 1}
                opacity={opacity}
                strokeLinecap="round"
              />
            );
          })}

          {/* Assessment nodes */}
          {CONNECTED_ASSESSMENTS.map((assessment) => {
            const pos = nodePositions[assessment];
            const isCompleted = completedAssessments.includes(assessment);
            const isActive = selected === assessment;
            const color = isCompleted
              ? ASSESSMENT_COLORS[assessment] || Colors.textMuted
              : Colors.border;

            return (
              <SvgCircle
                key={assessment}
                cx={pos.x}
                cy={pos.y}
                r={isActive ? NODE_RADIUS + 3 : NODE_RADIUS}
                fill={isActive ? color : color + '25'}
                stroke={color}
                strokeWidth={isActive ? 3 : 1.5}
                opacity={isCompleted ? 1 : 0.4}
                onPress={() => isCompleted && handleNodePress(assessment)}
              />
            );
          })}
        </Svg>

        {/* Node labels (RN Text for Android) */}
        {CONNECTED_ASSESSMENTS.map((assessment) => {
          const pos = nodePositions[assessment];
          const isCompleted = completedAssessments.includes(assessment);
          const isActive = selected === assessment;
          const label = ASSESSMENT_LABELS[assessment] || assessment;
          // Short label: first word only for tight space
          const shortLabel = label.split(' ').slice(-1)[0];

          return (
            <TouchableOpacity
              key={`label-${assessment}`}
              style={[
                styles.nodeLabel,
                {
                  left: pos.x - 28,
                  top: pos.y - 8,
                  width: 56,
                },
              ]}
              onPress={() => isCompleted && handleNodePress(assessment)}
              activeOpacity={0.7}
              disabled={!isCompleted}
            >
              <Text
                style={[
                  styles.nodeLabelText,
                  isActive && styles.nodeLabelTextActive,
                  !isCompleted && styles.nodeLabelTextDisabled,
                ]}
                numberOfLines={1}
              >
                {shortLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {CONNECTED_ASSESSMENTS.map((assessment) => {
          const isCompleted = completedAssessments.includes(assessment);
          const isActive = selected === assessment;
          const color = ASSESSMENT_COLORS[assessment] || Colors.textMuted;

          return (
            <TouchableOpacity
              key={`legend-${assessment}`}
              style={[
                styles.legendItem,
                isActive && { backgroundColor: color + '15', borderColor: color },
              ]}
              onPress={() => isCompleted && handleNodePress(assessment)}
              activeOpacity={0.7}
              disabled={!isCompleted}
            >
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: isCompleted ? color : Colors.border },
                ]}
              />
              <Text
                style={[
                  styles.legendText,
                  !isCompleted && { color: Colors.textMuted },
                ]}
                numberOfLines={1}
              >
                {ASSESSMENT_LABELS[assessment] || assessment}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  mapWrapper: {
    position: 'relative',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  nodeLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLabelText: {
    fontSize: 8,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  nodeLabelTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  nodeLabelTextDisabled: {
    color: Colors.textMuted,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
  },
});
