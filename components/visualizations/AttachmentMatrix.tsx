/**
 * AttachmentMatrix — SVG scatter plot showing user's position
 * on the Anxiety (Y) × Avoidance (X) attachment grid.
 *
 * Four colored quadrants, axis labels, and an animated user dot.
 * In explore mode, the dot tracks explored values smoothly.
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, {
  Rect,
  Circle as SvgCircle,
  Line as SvgLine,
  Defs,
} from 'react-native-svg';
import {
  QUADRANTS,
  QUADRANT_BOUNDARY,
  DOT_COLOR,
  getQuadrant,
  getStyleFromScores,
} from '@/constants/connectionMatrix';
import { Colors, FontSizes, FontFamilies, Spacing } from '@/constants/theme';
import type { AttachmentStyle } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRAPH_SIZE = Math.min(SCREEN_WIDTH - Spacing.lg * 2, 320);
const PADDING = 36;
const PLOT_SIZE = GRAPH_SIZE - PADDING * 2;
const SCORE_MIN = 1;
const SCORE_MAX = 7;

function scoreToX(avoidance: number): number {
  return PADDING + ((avoidance - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * PLOT_SIZE;
}

function scoreToY(anxiety: number): number {
  // Y inverted: high anxiety = top of graph = low Y value
  return PADDING + PLOT_SIZE - ((anxiety - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * PLOT_SIZE;
}

interface AttachmentMatrixProps {
  anxietyScore: number;
  avoidanceScore: number;
  attachmentStyle: AttachmentStyle;
  /** Explore mode: if provided, shows a second dot at the explored position. */
  exploredAnxiety?: number;
  exploredAvoidance?: number;
  isExploreMode?: boolean;
}

export function AttachmentMatrix({
  anxietyScore,
  avoidanceScore,
  attachmentStyle,
  exploredAnxiety,
  exploredAvoidance,
  isExploreMode = false,
}: AttachmentMatrixProps) {
  // Animated dot position
  const dotX = useRef(new Animated.Value(scoreToX(avoidanceScore))).current;
  const dotY = useRef(new Animated.Value(scoreToY(anxietyScore))).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    Animated.spring(dotScale, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, []);

  // Update dot position when explored values change
  useEffect(() => {
    const targetAvoidance = isExploreMode && exploredAvoidance != null ? exploredAvoidance : avoidanceScore;
    const targetAnxiety = isExploreMode && exploredAnxiety != null ? exploredAnxiety : anxietyScore;

    Animated.parallel([
      Animated.spring(dotX, {
        toValue: scoreToX(targetAvoidance),
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(dotY, {
        toValue: scoreToY(targetAnxiety),
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [exploredAnxiety, exploredAvoidance, isExploreMode, anxietyScore, avoidanceScore]);

  // Current display style
  const displayStyle = useMemo(() => {
    if (isExploreMode && exploredAnxiety != null && exploredAvoidance != null) {
      return getStyleFromScores(exploredAnxiety, exploredAvoidance);
    }
    return attachmentStyle;
  }, [isExploreMode, exploredAnxiety, exploredAvoidance, attachmentStyle]);

  const currentQuadrant = getQuadrant(displayStyle);

  // Quadrant boundary in graph coordinates
  const midX = scoreToX(QUADRANT_BOUNDARY);
  const midY = scoreToY(QUADRANT_BOUNDARY);

  return (
    <View style={styles.container}>
      {/* SVG Graph */}
      <View style={[styles.svgWrapper, { width: GRAPH_SIZE, height: GRAPH_SIZE }]}>
        <Svg width={GRAPH_SIZE} height={GRAPH_SIZE} viewBox={`0 0 ${GRAPH_SIZE} ${GRAPH_SIZE}`}>
          {/* Quadrant backgrounds */}
          {/* Secure: bottom-left (low avoidance, low anxiety) */}
          <Rect
            x={PADDING}
            y={midY}
            width={midX - PADDING}
            height={PADDING + PLOT_SIZE - midY}
            fill="#A8D5BA"
            opacity={displayStyle === 'secure' ? 0.25 : 0.12}
          />
          {/* Anxious-Preoccupied: top-left (low avoidance, high anxiety) */}
          <Rect
            x={PADDING}
            y={PADDING}
            width={midX - PADDING}
            height={midY - PADDING}
            fill="#F4C95D"
            opacity={displayStyle === 'anxious-preoccupied' ? 0.25 : 0.12}
          />
          {/* Dismissive-Avoidant: bottom-right (high avoidance, low anxiety) */}
          <Rect
            x={midX}
            y={midY}
            width={PADDING + PLOT_SIZE - midX}
            height={PADDING + PLOT_SIZE - midY}
            fill="#7FB3D3"
            opacity={displayStyle === 'dismissive-avoidant' ? 0.25 : 0.12}
          />
          {/* Fearful-Avoidant: top-right (high avoidance, high anxiety) */}
          <Rect
            x={midX}
            y={PADDING}
            width={PADDING + PLOT_SIZE - midX}
            height={midY - PADDING}
            fill="#C4A8D1"
            opacity={displayStyle === 'fearful-avoidant' ? 0.25 : 0.12}
          />

          {/* Grid lines at boundary */}
          <SvgLine
            x1={midX} y1={PADDING} x2={midX} y2={PADDING + PLOT_SIZE}
            stroke={Colors.border} strokeWidth={1} strokeDasharray="4,4"
          />
          <SvgLine
            x1={PADDING} y1={midY} x2={PADDING + PLOT_SIZE} y2={midY}
            stroke={Colors.border} strokeWidth={1} strokeDasharray="4,4"
          />

          {/* Axis lines */}
          <SvgLine
            x1={PADDING} y1={PADDING} x2={PADDING} y2={PADDING + PLOT_SIZE}
            stroke={Colors.text} strokeWidth={1.5} opacity={0.3}
          />
          <SvgLine
            x1={PADDING} y1={PADDING + PLOT_SIZE} x2={PADDING + PLOT_SIZE} y2={PADDING + PLOT_SIZE}
            stroke={Colors.text} strokeWidth={1.5} opacity={0.3}
          />

          {/* Ghost dot: original position when exploring */}
          {isExploreMode && (
            <SvgCircle
              cx={scoreToX(avoidanceScore)}
              cy={scoreToY(anxietyScore)}
              r={6}
              fill={DOT_COLOR}
              opacity={0.25}
              strokeWidth={1}
              stroke={DOT_COLOR}
              strokeDasharray="2,2"
            />
          )}
        </Svg>

        {/* Animated user dot (RN Animated for transform support) */}
        <Animated.View
          style={[
            styles.dot,
            {
              transform: [
                { translateX: Animated.subtract(dotX, 10) },
                { translateY: Animated.subtract(dotY, 10) },
                { scale: dotScale },
              ],
            },
          ]}
        >
          <View style={styles.dotInner} />
        </Animated.View>

        {/* Quadrant labels — positioned with RN Text for Android compat */}
        <Text style={[styles.quadrantLabel, {
          top: midY + (PADDING + PLOT_SIZE - midY) / 2 - 6,
          left: PADDING + (midX - PADDING) / 2 - 30,
        }]}>
          Secure
        </Text>
        <Text style={[styles.quadrantLabel, {
          top: PADDING + (midY - PADDING) / 2 - 6,
          left: PADDING + (midX - PADDING) / 2 - 30,
        }]}>
          Anxious
        </Text>
        <Text style={[styles.quadrantLabel, {
          top: midY + (PADDING + PLOT_SIZE - midY) / 2 - 6,
          left: midX + (PADDING + PLOT_SIZE - midX) / 2 - 30,
        }]}>
          Avoidant
        </Text>
        <Text style={[styles.quadrantLabel, {
          top: PADDING + (midY - PADDING) / 2 - 6,
          left: midX + (PADDING + PLOT_SIZE - midX) / 2 - 30,
        }]}>
          Fearful
        </Text>

        {/* Axis labels */}
        <Text style={[styles.axisLabel, { bottom: 2, left: GRAPH_SIZE / 2 - 30 }]}>
          AVOIDANCE {'\u2192'}
        </Text>
        <Text style={[styles.axisLabelVertical, { top: GRAPH_SIZE / 2 - 30, left: 2 }]}>
          {'\u2191'} ANXIETY
        </Text>

        {/* Scale context — Low/High instead of confusing endpoint numbers */}
      </View>

      {/* Current position badge */}
      <View style={[styles.positionBadge, { backgroundColor: currentQuadrant.color + '25' }]}>
        <Text style={[styles.positionWarmLabel, { color: currentQuadrant.color }]}>
          {currentQuadrant.warmLabel}
        </Text>
        <Text style={styles.positionCoords}>
          Anxiety: {(isExploreMode && exploredAnxiety != null ? exploredAnxiety : anxietyScore).toFixed(1)}
          {'  \u2022  '}
          Avoidance: {(isExploreMode && exploredAvoidance != null ? exploredAvoidance : avoidanceScore).toFixed(1)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  svgWrapper: {
    position: 'relative',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: DOT_COLOR,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: DOT_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  quadrantLabel: {
    position: 'absolute',
    fontSize: 10,
    fontFamily: FontFamilies.heading,
    fontWeight: '500',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    width: 60,
    textAlign: 'center',
  },
  axisLabel: {
    position: 'absolute',
    fontSize: 9,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  axisLabelVertical: {
    position: 'absolute',
    fontSize: 9,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    transform: [{ rotate: '-90deg' }],
    width: 80,
  },
  positionBadge: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    gap: 2,
  },
  positionWarmLabel: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
  },
  positionCoords: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.accent,
    color: Colors.textSecondary,
  },
});
