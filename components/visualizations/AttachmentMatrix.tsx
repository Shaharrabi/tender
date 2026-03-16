/**
 * AttachmentMatrix — Soft, organic attachment style quadrant visualization.
 *
 * Four gentle watercolor-like quadrants with flowing boundary lines,
 * a warm dot with glow rings, and serif annotations.
 * Matches the Tender illustration language.
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, {
  Rect,
  Circle as SvgCircle,
  Line as SvgLine,
  Path,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import {
  QUADRANTS,
  QUADRANT_BOUNDARY,
  DOT_COLOR,
  getQuadrant,
  getStyleFromScores,
} from '@/constants/connectionMatrix';
import { Colors, FontSizes, FontFamilies, Spacing, BorderRadius } from '@/constants/theme';
import type { AttachmentStyle } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRAPH_SIZE = Math.min(SCREEN_WIDTH - Spacing.lg * 2, 320);
const PADDING = 40;
const PLOT_SIZE = GRAPH_SIZE - PADDING * 2;
const SCORE_MIN = 1;
const SCORE_MAX = 7;

// Soft Tender-style quadrant colors (more muted than originals)
const Q_COLORS = {
  secure: '#8BB5A2',       // sage green
  anxious: '#E8C47A',      // warm gold (not bright yellow)
  avoidant: '#8BADC4',     // dusty blue
  fearful: '#C4A8C8',      // soft lavender
};

const MARKER_COLOR = '#C4836A';  // terracotta, matching illustrations
const INK = '#3D3530';
const SOFT_INK = '#6B5E56';
const MUTED = '#9B8E84';

function scoreToX(avoidance: number): number {
  return PADDING + ((avoidance - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * PLOT_SIZE;
}

function scoreToY(anxiety: number): number {
  return PADDING + PLOT_SIZE - ((anxiety - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * PLOT_SIZE;
}

interface AttachmentMatrixProps {
  anxietyScore: number;
  avoidanceScore: number;
  attachmentStyle: AttachmentStyle;
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
  const dotX = useRef(new Animated.Value(scoreToX(avoidanceScore))).current;
  const dotY = useRef(new Animated.Value(scoreToY(anxietyScore))).current;
  const dotScale = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.spring(dotScale, {
      toValue: 1, friction: 6, tension: 50, useNativeDriver: true,
    }).start();
    // Gentle glow breathing
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 0.8, duration: 2800, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.4, duration: 2800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const targetAvoidance = isExploreMode && exploredAvoidance != null ? exploredAvoidance : avoidanceScore;
    const targetAnxiety = isExploreMode && exploredAnxiety != null ? exploredAnxiety : anxietyScore;
    Animated.parallel([
      Animated.spring(dotX, { toValue: scoreToX(targetAvoidance), friction: 8, tension: 80, useNativeDriver: true }),
      Animated.spring(dotY, { toValue: scoreToY(targetAnxiety), friction: 8, tension: 80, useNativeDriver: true }),
    ]).start();
  }, [exploredAnxiety, exploredAvoidance, isExploreMode, anxietyScore, avoidanceScore]);

  const displayStyle = useMemo(() => {
    if (isExploreMode && exploredAnxiety != null && exploredAvoidance != null) {
      return getStyleFromScores(exploredAnxiety, exploredAvoidance);
    }
    return attachmentStyle;
  }, [isExploreMode, exploredAnxiety, exploredAvoidance, attachmentStyle]);

  const currentQuadrant = getQuadrant(displayStyle);
  const midX = scoreToX(QUADRANT_BOUNDARY);
  const midY = scoreToY(QUADRANT_BOUNDARY);

  // Organic boundary wave paths
  const vWave = `M${midX} ${PADDING} Q${midX + 3} ${PADDING + PLOT_SIZE * 0.25} ${midX - 2} ${PADDING + PLOT_SIZE * 0.5} Q${midX + 2} ${PADDING + PLOT_SIZE * 0.75} ${midX} ${PADDING + PLOT_SIZE}`;
  const hWave = `M${PADDING} ${midY} Q${PADDING + PLOT_SIZE * 0.25} ${midY - 2} ${PADDING + PLOT_SIZE * 0.5} ${midY + 3} Q${PADDING + PLOT_SIZE * 0.75} ${midY - 1} ${PADDING + PLOT_SIZE} ${midY}`;

  return (
    <View style={styles.container}>
      {/* SVG Graph */}
      <View style={[styles.svgWrapper, { width: GRAPH_SIZE, height: GRAPH_SIZE }]}>
        <Svg width={GRAPH_SIZE} height={GRAPH_SIZE} viewBox={`0 0 ${GRAPH_SIZE} ${GRAPH_SIZE}`}>
          <Defs>
            <LinearGradient id="amSecureGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={Q_COLORS.secure} stopOpacity="0.18" />
              <Stop offset="1" stopColor={Q_COLORS.secure} stopOpacity="0.08" />
            </LinearGradient>
            <LinearGradient id="amAnxiousGrad" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor={Q_COLORS.anxious} stopOpacity="0.18" />
              <Stop offset="1" stopColor={Q_COLORS.anxious} stopOpacity="0.08" />
            </LinearGradient>
            <LinearGradient id="amAvoidantGrad" x1="1" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Q_COLORS.avoidant} stopOpacity="0.18" />
              <Stop offset="1" stopColor={Q_COLORS.avoidant} stopOpacity="0.08" />
            </LinearGradient>
            <LinearGradient id="amFearfulGrad" x1="1" y1="1" x2="0" y2="0">
              <Stop offset="0" stopColor={Q_COLORS.fearful} stopOpacity="0.18" />
              <Stop offset="1" stopColor={Q_COLORS.fearful} stopOpacity="0.08" />
            </LinearGradient>
          </Defs>

          {/* Quadrant fills — soft gradients with rounded corners on outer edges */}
          {/* Secure: bottom-left */}
          <Rect
            x={PADDING} y={midY}
            width={midX - PADDING} height={PADDING + PLOT_SIZE - midY}
            fill={displayStyle === 'secure' ? Q_COLORS.secure : 'url(#amSecureGrad)'}
            opacity={displayStyle === 'secure' ? 0.22 : 1}
            rx={displayStyle === 'secure' ? 8 : 0}
          />
          {/* Anxious: top-left */}
          <Rect
            x={PADDING} y={PADDING}
            width={midX - PADDING} height={midY - PADDING}
            fill={displayStyle === 'anxious-preoccupied' ? Q_COLORS.anxious : 'url(#amAnxiousGrad)'}
            opacity={displayStyle === 'anxious-preoccupied' ? 0.22 : 1}
            rx={displayStyle === 'anxious-preoccupied' ? 8 : 0}
          />
          {/* Avoidant: bottom-right */}
          <Rect
            x={midX} y={midY}
            width={PADDING + PLOT_SIZE - midX} height={PADDING + PLOT_SIZE - midY}
            fill={displayStyle === 'dismissive-avoidant' ? Q_COLORS.avoidant : 'url(#amAvoidantGrad)'}
            opacity={displayStyle === 'dismissive-avoidant' ? 0.22 : 1}
            rx={displayStyle === 'dismissive-avoidant' ? 8 : 0}
          />
          {/* Fearful: top-right */}
          <Rect
            x={midX} y={PADDING}
            width={PADDING + PLOT_SIZE - midX} height={midY - PADDING}
            fill={displayStyle === 'fearful-avoidant' ? Q_COLORS.fearful : 'url(#amFearfulGrad)'}
            opacity={displayStyle === 'fearful-avoidant' ? 0.22 : 1}
            rx={displayStyle === 'fearful-avoidant' ? 8 : 0}
          />

          {/* Organic boundary lines — gentle curves instead of straight */}
          <Path d={vWave} fill="none" stroke={MUTED} strokeWidth={0.6} strokeDasharray="3,4" opacity={0.4} />
          <Path d={hWave} fill="none" stroke={MUTED} strokeWidth={0.6} strokeDasharray="3,4" opacity={0.4} />

          {/* Outer border — very subtle rounded rect */}
          <Rect
            x={PADDING} y={PADDING}
            width={PLOT_SIZE} height={PLOT_SIZE}
            fill="none" stroke={MUTED} strokeWidth={0.5} opacity={0.25} rx={8}
          />

          {/* Quadrant labels — Georgia serif, gentle */}
          <SvgText
            x={PADDING + (midX - PADDING) / 2}
            y={midY + (PADDING + PLOT_SIZE - midY) / 2 + 4}
            fill={Q_COLORS.secure} fontSize={10}
            fontFamily="Georgia,serif" fontWeight="400"
            textAnchor="middle" opacity={0.65}
          >
            SECURE
          </SvgText>
          <SvgText
            x={PADDING + (midX - PADDING) / 2}
            y={PADDING + (midY - PADDING) / 2 + 4}
            fill={Q_COLORS.anxious} fontSize={10}
            fontFamily="Georgia,serif" fontWeight="400"
            textAnchor="middle" opacity={0.65}
          >
            ANXIOUS
          </SvgText>
          <SvgText
            x={midX + (PADDING + PLOT_SIZE - midX) / 2}
            y={midY + (PADDING + PLOT_SIZE - midY) / 2 + 4}
            fill={Q_COLORS.avoidant} fontSize={10}
            fontFamily="Georgia,serif" fontWeight="400"
            textAnchor="middle" opacity={0.65}
          >
            AVOIDANT
          </SvgText>
          <SvgText
            x={midX + (PADDING + PLOT_SIZE - midX) / 2}
            y={PADDING + (midY - PADDING) / 2 + 4}
            fill={Q_COLORS.fearful} fontSize={10}
            fontFamily="Georgia,serif" fontWeight="400"
            textAnchor="middle" opacity={0.65}
          >
            FEARFUL
          </SvgText>

          {/* Marker glow rings — soft concentric circles */}
          <SvgCircle cx={scoreToX(avoidanceScore)} cy={scoreToY(anxietyScore)} r={18} fill={MARKER_COLOR} opacity={0.06} />
          <SvgCircle cx={scoreToX(avoidanceScore)} cy={scoreToY(anxietyScore)} r={12} fill={MARKER_COLOR} opacity={0.1} />

          {/* Ghost dot in explore mode */}
          {isExploreMode && (
            <SvgCircle
              cx={scoreToX(avoidanceScore)} cy={scoreToY(anxietyScore)}
              r={5} fill={MARKER_COLOR} opacity={0.2}
              strokeWidth={0.5} stroke={MARKER_COLOR} strokeDasharray="2,2"
            />
          )}
        </Svg>

        {/* Animated user dot */}
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
          <Animated.View style={[styles.dotGlow, { opacity: glowPulse }]} />
          <View style={styles.dotInner} />
        </Animated.View>

        {/* Axis labels (RN Text for cross-platform) */}
        <Text style={[styles.axisLabel, { bottom: 4, left: GRAPH_SIZE / 2 - 25 }]}>
          avoidance {'\u2192'}
        </Text>
        <Text style={[styles.axisLabelVertical, { top: GRAPH_SIZE / 2 - 25, left: 4 }]}>
          {'\u2191'} anxiety
        </Text>
      </View>

      {/* Position badge — warm, soft */}
      <View style={[styles.positionBadge, { backgroundColor: currentQuadrant.color + '18' }]}>
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
    backgroundColor: '#FAF7F2',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    shadowColor: '#2D2226',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: MARKER_COLOR,
  },
  dotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: MARKER_COLOR,
    borderWidth: 1.5,
    borderColor: '#FAF7F2',
    shadowColor: MARKER_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  quadrantLabel: {
    position: 'absolute',
    fontSize: 9.5,
    fontFamily: 'Georgia',
    fontWeight: '400',
    color: MUTED,
    width: 60,
    textAlign: 'center',
  },
  axisLabel: {
    position: 'absolute',
    fontSize: 8,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    color: MUTED,
    opacity: 0.5,
  },
  axisLabelVertical: {
    position: 'absolute',
    fontSize: 8,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    color: MUTED,
    opacity: 0.5,
    transform: [{ rotate: '-90deg' }],
    width: 60,
  },
  positionBadge: {
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.pill,
    gap: 3,
  },
  positionWarmLabel: {
    fontSize: 15,
    fontFamily: FontFamilies.heading,
    fontWeight: '500',
  },
  positionCoords: {
    fontSize: 11,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    color: SOFT_INK,
    opacity: 0.7,
  },
});
