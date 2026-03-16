/**
 * WindowOfTolerance — Soft, organic nervous system regulation visualization.
 *
 * Three flowing zones with a gentle "you are here" marker dot.
 * Styled to match the Tender illustration language: organic curves,
 * low opacity, warm muted palette, delicate line weights.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
import Svg, {
  Path, Circle, Line, Ellipse, Rect,
  Text as SvgText, Defs, LinearGradient, Stop, G,
} from 'react-native-svg';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';
import type { CompositeScores } from '@/types';

// ─── Soft Tender Palette ──────────────────────────────
const P = {
  // Zone colors — desaturated, illustration-grade
  hyper: '#D4909A',     // blush/dusty rose (activation)
  window: '#7A9E8E',    // sage green (regulated)
  hypo: '#8BA4B8',      // dusty blue (shutdown)
  // Accents
  marker: '#D4A843',    // warm gold dot
  markerGlow: '#D4A843',
  // Surfaces
  cream: '#FAF7F2',
  linen: '#F5F0E8',
  // Text
  ink: '#3D3530',
  softInk: '#6B5E56',
  muted: '#9B8E84',
};

// ─── Helpers ──────────────────────────────────────────

function getWindowLabel(width: number): string {
  if (width >= 75) return 'Wide';
  if (width >= 55) return 'Moderate';
  if (width >= 35) return 'Moderate-Narrow';
  return 'Narrow';
}

function getWindowInsight(width: number, pattern: string): string {
  const patternText = pattern === 'hyperarousal'
    ? 'Under stress, you tend to go UP into activation: heart racing, thoughts spiraling, urgency to resolve.'
    : pattern === 'hypoarousal'
    ? 'Under stress, you tend to go DOWN into shutdown: numbness, disconnection, going quiet.'
    : pattern === 'both'
    ? 'Under stress, you oscillate between activation and shutdown — flooding then freezing.'
    : 'You generally stay within your window, with good recovery when pushed outside.';

  if (width >= 55) {
    return `Your window is ${getWindowLabel(width).toLowerCase()} — you can hold more emotional intensity before dysregulating. ${patternText}`;
  }
  return `Your window is ${getWindowLabel(width).toLowerCase()} — the zone where you can think clearly and respond (rather than react) is narrower than average. ${patternText}`;
}

// ─── Component ────────────────────────────────────────

interface WindowOfToleranceProps {
  compositeScores: CompositeScores;
  activationPattern?: 'hyperarousal' | 'hypoarousal' | 'both' | 'balanced';
  triggers?: string[];
}

export default function WindowOfTolerance({
  compositeScores,
  activationPattern = 'hyperarousal',
  triggers = [],
}: WindowOfToleranceProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const markerPulse = useRef(new Animated.Value(0.7)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  const windowWidth = compositeScores.windowWidth;
  const regulationScore = compositeScores.regulationScore;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    // Gentle breathing pulse on the marker
    Animated.loop(
      Animated.sequence([
        Animated.timing(markerPulse, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(markerPulse, { toValue: 0.7, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  // Chart dimensions
  const chartWidth = containerWidth > 0 ? containerWidth - Spacing.lg * 2 : 280;
  const chartHeight = 220;
  const margin = { top: 20, bottom: 20, left: 20, right: 64 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  // Zone heights
  const windowPct = Math.max(windowWidth / 100, 0.15);
  const remainingPct = 1 - windowPct;
  const hyperHeight = innerHeight * (remainingPct / 2);
  const windowZoneHeight = innerHeight * windowPct;
  const hypoHeight = innerHeight * (remainingPct / 2);

  // Marker Y position
  const getMarkerY = (): number => {
    const windowTop = margin.top + hyperHeight;
    const windowCenter = windowTop + windowZoneHeight / 2;
    switch (activationPattern) {
      case 'hyperarousal':
        return windowTop - hyperHeight * 0.15;
      case 'hypoarousal':
        return windowTop + windowZoneHeight + hypoHeight * 0.15;
      case 'both':
        return windowCenter;
      default:
        return windowCenter;
    }
  };

  const markerY = getMarkerY();
  const markerX = margin.left + innerWidth * 0.6;
  const windowLabel = getWindowLabel(windowWidth);
  const insight = getWindowInsight(windowWidth, activationPattern);

  // Organic wave paths for zone boundaries
  const waveTop = margin.top + hyperHeight;
  const waveBottom = waveTop + windowZoneHeight;
  const waveTopPath = `M${margin.left} ${waveTop} Q${margin.left + innerWidth * 0.25} ${waveTop - 4} ${margin.left + innerWidth * 0.5} ${waveTop + 2} Q${margin.left + innerWidth * 0.75} ${waveTop + 6} ${margin.left + innerWidth} ${waveTop}`;
  const waveBottomPath = `M${margin.left} ${waveBottom} Q${margin.left + innerWidth * 0.3} ${waveBottom + 3} ${margin.left + innerWidth * 0.5} ${waveBottom - 2} Q${margin.left + innerWidth * 0.7} ${waveBottom - 5} ${margin.left + innerWidth} ${waveBottom}`;

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]} onLayout={onLayout}>
      {/* Header */}
      <Text style={styles.sectionLabel}>NERVOUS SYSTEM</Text>
      <Text style={styles.title}>Your Window of Tolerance</Text>
      <Text style={styles.subtitle}>The zone where you can think, feel, and respond</Text>

      {/* Organic SVG Diagram */}
      {containerWidth > 0 && (
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Defs>
            <LinearGradient id="wotHyperGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={P.hyper} stopOpacity="0.18" />
              <Stop offset="1" stopColor={P.hyper} stopOpacity="0.04" />
            </LinearGradient>
            <LinearGradient id="wotHypoGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={P.hypo} stopOpacity="0.04" />
              <Stop offset="1" stopColor={P.hypo} stopOpacity="0.18" />
            </LinearGradient>
            <LinearGradient id="wotWindowGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={P.window} stopOpacity="0.12" />
              <Stop offset="0.5" stopColor={P.window} stopOpacity="0.08" />
              <Stop offset="1" stopColor={P.window} stopOpacity="0.12" />
            </LinearGradient>
          </Defs>

          {/* Hyperarousal zone — soft rounded rect */}
          <Rect
            x={margin.left} y={margin.top}
            width={innerWidth} height={hyperHeight}
            rx={12} ry={12}
            fill="url(#wotHyperGrad)"
          />

          {/* Window zone — gentle fill */}
          <Rect
            x={margin.left} y={waveTop}
            width={innerWidth} height={windowZoneHeight}
            fill="url(#wotWindowGrad)"
          />
          {/* Organic boundary lines */}
          <Path d={waveTopPath} fill="none" stroke={P.window} strokeWidth={0.8} opacity={0.5} />
          <Path d={waveBottomPath} fill="none" stroke={P.window} strokeWidth={0.8} opacity={0.5} />

          {/* Hypoarousal zone */}
          <Rect
            x={margin.left} y={waveBottom}
            width={innerWidth} height={hypoHeight}
            rx={12} ry={12}
            fill="url(#wotHypoGrad)"
          />

          {/* Dashed center line — delicate */}
          <Line
            x1={margin.left + 16} y1={waveTop + windowZoneHeight / 2}
            x2={margin.left + innerWidth - 16} y2={waveTop + windowZoneHeight / 2}
            stroke={P.window} strokeWidth={0.6} strokeDasharray="3,4" opacity={0.4}
          />

          {/* Window width label — soft serif annotation */}
          <SvgText
            x={margin.left + innerWidth / 2}
            y={waveTop + windowZoneHeight / 2 + 4}
            fill={P.window}
            fontSize={10}
            fontFamily="Georgia,serif"
            fontWeight="400"
            fontStyle="italic"
            textAnchor="middle"
            opacity={0.7}
          >
            {windowLabel} ({windowWidth})
          </SvgText>

          {/* Marker glow — soft rings */}
          <Circle cx={markerX} cy={markerY} r={14} fill={P.markerGlow} opacity={0.08} />
          <Circle cx={markerX} cy={markerY} r={10} fill={P.markerGlow} opacity={0.12} />
          {/* "You are here" dot */}
          <Circle
            cx={markerX} cy={markerY} r={5}
            fill={P.marker} opacity={0.85}
          />
          <Circle
            cx={markerX} cy={markerY} r={5}
            fill="none" stroke={Colors.white} strokeWidth={1.5} opacity={0.9}
          />

          {/* Zone labels — right side, gentle serif */}
          <SvgText
            x={margin.left + innerWidth + 10}
            y={margin.top + hyperHeight / 2 + 3}
            fill={P.hyper} fontSize={8.5}
            fontFamily="Georgia,serif" fontStyle="italic"
            textAnchor="start" opacity={0.75}
          >
            activation ↑
          </SvgText>
          <SvgText
            x={margin.left + innerWidth + 10}
            y={waveTop + windowZoneHeight / 2 + 3}
            fill={P.window} fontSize={8.5}
            fontFamily="Georgia,serif" fontStyle="italic"
            textAnchor="start" opacity={0.75}
          >
            window
          </SvgText>
          <SvgText
            x={margin.left + innerWidth + 10}
            y={waveBottom + hypoHeight / 2 + 3}
            fill={P.hypo} fontSize={8.5}
            fontFamily="Georgia,serif" fontStyle="italic"
            textAnchor="start" opacity={0.75}
          >
            shutdown ↓
          </SvgText>

          {/* Subtle texture lines inside zones — like illustration body lines */}
          <G opacity={0.08} stroke={P.hyper} strokeWidth={0.7} strokeLinecap="round">
            <Line x1={margin.left + 20} y1={margin.top + hyperHeight * 0.3} x2={margin.left + innerWidth - 20} y2={margin.top + hyperHeight * 0.3} />
            <Line x1={margin.left + 30} y1={margin.top + hyperHeight * 0.6} x2={margin.left + innerWidth - 30} y2={margin.top + hyperHeight * 0.6} />
          </G>
          <G opacity={0.08} stroke={P.hypo} strokeWidth={0.7} strokeLinecap="round">
            <Line x1={margin.left + 20} y1={waveBottom + hypoHeight * 0.4} x2={margin.left + innerWidth - 20} y2={waveBottom + hypoHeight * 0.4} />
            <Line x1={margin.left + 30} y1={waveBottom + hypoHeight * 0.7} x2={margin.left + innerWidth - 30} y2={waveBottom + hypoHeight * 0.7} />
          </G>
        </Svg>
      </View>
      )}

      {/* Summary pills — softer, rounded */}
      <View style={styles.pillRow}>
        <View style={[styles.pill, { backgroundColor: P.window + '15' }]}>
          <Text style={[styles.pillLabel, { color: P.window }]}>Window</Text>
          <Text style={[styles.pillValue, { color: P.window }]}>{windowLabel}</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: P.hyper + '12' }]}>
          <Text style={[styles.pillLabel, { color: P.hyper }]}>Pattern</Text>
          <Text style={[styles.pillValue, { color: P.hyper }]}>
            {activationPattern === 'hyperarousal' ? 'Activation (↑)' :
             activationPattern === 'hypoarousal' ? 'Shutdown (↓)' :
             activationPattern === 'both' ? 'Oscillating' : 'Balanced'}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: P.hypo + '12' }]}>
          <Text style={[styles.pillLabel, { color: P.hypo }]}>Regulation</Text>
          <Text style={[styles.pillValue, { color: P.hypo }]}>{regulationScore}</Text>
        </View>
      </View>

      {/* Insight — softer border */}
      <View style={styles.insightBox}>
        <Text style={styles.insightText}>{insight}</Text>
      </View>

      {/* Triggers */}
      {triggers.length > 0 && (
        <View style={styles.triggersContainer}>
          <Text style={styles.triggersLabel}>Known Triggers</Text>
          {triggers.map((t, i) => (
            <Text key={i} style={styles.triggerItem}>{`${i + 1}. ${t}`}</Text>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    shadowColor: '#2D2226',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionLabel: {
    ...Typography.label,
    color: P.window,
    letterSpacing: 2,
    fontSize: 9,
    marginBottom: Spacing.xs,
    opacity: 0.8,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    fontWeight: '500',
    color: P.ink,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    fontSize: 13,
    color: P.muted,
    marginBottom: Spacing.md,
  },
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
  },
  pillLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 8.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  pillValue: {
    fontFamily: 'Georgia',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  insightBox: {
    backgroundColor: P.cream,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 2.5,
    borderLeftColor: P.window,
    marginTop: Spacing.md,
    opacity: 0.9,
  },
  insightText: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: P.softInk,
    lineHeight: 20,
  },
  triggersContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: P.cream,
    borderRadius: BorderRadius.lg,
  },
  triggersLabel: {
    ...Typography.label,
    color: P.muted,
    letterSpacing: 1.5,
    fontSize: 8.5,
    marginBottom: Spacing.sm,
  },
  triggerItem: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: P.softInk,
    marginBottom: 4,
  },
});
