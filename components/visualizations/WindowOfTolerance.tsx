/**
 * WindowOfTolerance — Visual representation of the nervous system regulation window.
 *
 * Three horizontal zones stacked vertically:
 *   ┌──────────────────────────┐
 *   │   HYPERAROUSAL (↑)       │  Activation: racing thoughts, urgency, panic
 *   ├──────────────────────────┤
 *   │   WINDOW OF TOLERANCE    │  Optimal zone: can think, feel, respond
 *   │      ● You are here      │
 *   ├──────────────────────────┤
 *   │   HYPOAROUSAL (↓)       │  Shutdown: numbness, disconnection, collapse
 *   └──────────────────────────┘
 *
 * Window width driven by compositeScores.windowWidth (0-100).
 * Activation pattern driven by regulation lens patterns.
 * Built with react-native-svg.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
import Svg, { Rect, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';
import type { CompositeScores } from '@/types';

// Icons
import WaveIcon from '@/assets/graphics/icons/WaveIcon';

// ─── Types ────────────────────────────────────────────

interface WindowOfToleranceProps {
  compositeScores: CompositeScores;
  activationPattern?: 'hyperarousal' | 'hypoarousal' | 'both' | 'balanced';
  triggers?: string[];
}

// ─── Wes Anderson Sticker Palette ─────────────────────
const WA = {
  sage: '#A8B5A2',       // window zone (green/calm)
  terracotta: '#C4836A', // hyperarousal (warm activation)
  dustyBlue: '#8BA4B8',  // hypoarousal (cool shutdown)
  mustard: '#D4A843',    // accents
  blush: '#E8B4B8',      // markers
  cream: '#F5F0E8',      // backgrounds
  warmWhite: '#FAF7F2',  // surfaces
  ink: '#3D3530',        // text
  softInk: '#6B5E56',    // secondary text
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

export default function WindowOfTolerance({
  compositeScores,
  activationPattern = 'hyperarousal',
  triggers = [],
}: WindowOfToleranceProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const markerAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  const windowWidth = compositeScores.windowWidth;
  const regulationScore = compositeScores.regulationScore;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(markerAnim, { toValue: 1, duration: 1000, delay: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  // Chart dimensions — responsive to container
  const chartWidth = containerWidth > 0 ? containerWidth - Spacing.lg * 2 : 280;
  const chartHeight = 200;
  const margin = { top: 16, bottom: 16, left: 16, right: 70 }; // right margin for zone labels
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  // Zone heights: window zone proportional to windowWidth, zones split remaining
  const windowPct = Math.max(windowWidth / 100, 0.15); // min 15%
  const remainingPct = 1 - windowPct;
  const hyperHeight = innerHeight * (remainingPct / 2);
  const windowZoneHeight = innerHeight * windowPct;
  const hypoHeight = innerHeight * (remainingPct / 2);

  // "You are here" marker Y position
  const getMarkerY = (): number => {
    const windowTop = margin.top + hyperHeight;
    const windowCenter = windowTop + windowZoneHeight / 2;
    switch (activationPattern) {
      case 'hyperarousal':
        return windowTop - hyperHeight * 0.2; // slightly into hyper zone
      case 'hypoarousal':
        return windowTop + windowZoneHeight + hypoHeight * 0.2; // slightly into hypo
      case 'both':
        return windowCenter; // right at the edge
      default:
        return windowCenter;
    }
  };

  const markerY = getMarkerY();
  const windowLabel = getWindowLabel(windowWidth);
  const insight = getWindowInsight(windowWidth, activationPattern);

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]} onLayout={onLayout}>
      {/* Header */}
      <Text style={styles.sectionLabel}>NERVOUS SYSTEM</Text>
      <Text style={styles.title}>Your Window of Tolerance</Text>
      <Text style={styles.subtitle}>The zone where you can think, feel, and respond</Text>

      {/* Diagram with zone labels inside SVG */}
      {containerWidth > 0 && (
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Defs>
            <LinearGradient id="hyperGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={WA.terracotta} stopOpacity="0.25" />
              <Stop offset="1" stopColor={WA.terracotta} stopOpacity="0.06" />
            </LinearGradient>
            <LinearGradient id="hypoGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={WA.dustyBlue} stopOpacity="0.06" />
              <Stop offset="1" stopColor={WA.dustyBlue} stopOpacity="0.25" />
            </LinearGradient>
          </Defs>

          {/* Hyperarousal zone */}
          <Rect
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={hyperHeight}
            rx={4}
            fill="url(#hyperGrad)"
          />

          {/* Window zone */}
          <Rect
            x={margin.left}
            y={margin.top + hyperHeight}
            width={innerWidth}
            height={windowZoneHeight}
            rx={0}
            fill={WA.sage}
            fillOpacity={0.18}
            stroke={WA.sage}
            strokeWidth={1.5}
            strokeOpacity={0.5}
          />

          {/* Window width label inside */}
          <SvgText
            x={margin.left + innerWidth / 2}
            y={margin.top + hyperHeight + windowZoneHeight / 2 + 4}
            fill={WA.sage}
            fontSize={11}
            fontFamily={FontFamilies.accent}
            fontWeight="600"
            textAnchor="middle"
          >
            {windowLabel} ({windowWidth})
          </SvgText>

          {/* Hypoarousal zone */}
          <Rect
            x={margin.left}
            y={margin.top + hyperHeight + windowZoneHeight}
            width={innerWidth}
            height={hypoHeight}
            rx={4}
            fill="url(#hypoGrad)"
          />

          {/* "You are here" marker */}
          <Circle
            cx={margin.left + innerWidth * 0.65}
            cy={markerY}
            r={6}
            fill={WA.mustard}
            stroke={Colors.white}
            strokeWidth={2}
          />

          {/* Dashed center line */}
          <Line
            x1={margin.left}
            y1={margin.top + hyperHeight + windowZoneHeight / 2}
            x2={margin.left + innerWidth}
            y2={margin.top + hyperHeight + windowZoneHeight / 2}
            stroke={WA.sage}
            strokeWidth={0.5}
            strokeDasharray="4,4"
            strokeOpacity={0.5}
          />

          {/* Zone labels — right of the zones, inside SVG */}
          <SvgText
            x={margin.left + innerWidth + 8}
            y={margin.top + hyperHeight / 2 + 4}
            fill={WA.terracotta}
            fontSize={9}
            fontFamily={FontFamilies.body}
            fontWeight="500"
            textAnchor="start"
          >
            Activation ↑
          </SvgText>
          <SvgText
            x={margin.left + innerWidth + 8}
            y={margin.top + hyperHeight + windowZoneHeight / 2 + 4}
            fill={WA.sage}
            fontSize={9}
            fontFamily={FontFamilies.body}
            fontWeight="500"
            textAnchor="start"
          >
            Window
          </SvgText>
          <SvgText
            x={margin.left + innerWidth + 8}
            y={margin.top + hyperHeight + windowZoneHeight + hypoHeight / 2 + 4}
            fill={WA.dustyBlue}
            fontSize={9}
            fontFamily={FontFamilies.body}
            fontWeight="500"
            textAnchor="start"
          >
            Shutdown ↓
          </SvgText>
        </Svg>
      </View>
      )}

      {/* Summary pills */}
      <View style={styles.pillRow}>
        <View style={[styles.pill, { backgroundColor: WA.sage + '20' }]}>
          <Text style={[styles.pillLabel, { color: WA.sage }]}>Window Width</Text>
          <Text style={[styles.pillValue, { color: WA.sage }]}>{windowLabel}</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: WA.terracotta + '18' }]}>
          <Text style={[styles.pillLabel, { color: WA.terracotta }]}>Pattern</Text>
          <Text style={[styles.pillValue, { color: WA.terracotta }]}>
            {activationPattern === 'hyperarousal' ? 'Activation (↑)' :
             activationPattern === 'hypoarousal' ? 'Shutdown (↓)' :
             activationPattern === 'both' ? 'Oscillating' : 'Balanced'}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: WA.dustyBlue + '18' }]}>
          <Text style={[styles.pillLabel, { color: WA.dustyBlue }]}>Regulation</Text>
          <Text style={[styles.pillValue, { color: WA.dustyBlue }]}>{regulationScore}</Text>
        </View>
      </View>

      {/* Insight */}
      <View style={styles.insightBox}>
        <WaveIcon size={16} color={Colors.calm} />
        <Text style={styles.insightText}>{insight}</Text>
      </View>

      {/* Triggers if provided */}
      {triggers.length > 0 && (
        <View style={styles.triggersContainer}>
          <Text style={styles.triggersLabel}>Known Triggers</Text>
          {triggers.map((t, i) => (
            <Text key={i} style={styles.triggerItem}>
              {`${i + 1}. ${t}`}
            </Text>
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
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  sectionLabel: {
    ...Typography.label,
    color: WA.sage,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.headingM,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
  },
  pillLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pillValue: {
    fontFamily: FontFamilies.accent,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  insightBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.calm,
    marginTop: Spacing.md,
  },
  insightText: {
    ...Typography.bodySmall,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  triggersContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
  },
  triggersLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  triggerItem: {
    ...Typography.bodySmall,
    color: Colors.text,
    marginBottom: 4,
  },
});
