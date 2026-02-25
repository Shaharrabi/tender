/**
 * DifferentiationSpectrum — Visual spectrum of differentiation (DSI-R).
 *
 * Shows the 4 DSI-R subscales as a horizontal spectrum:
 *   Fusion ←──────────── Self ──────────────→ Cutoff
 *
 * Plus I-Position and Emotional Reactivity as separate indicators.
 * The overall differentiation score determines position on the main spectrum.
 *
 * Concept: Healthy differentiation is in the MIDDLE — neither fused nor cut off.
 * The spectrum makes this intuitive.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Rect, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';
import type { DSIRScores, CompositeScores } from '@/types';

// Icons
import MirrorIcon from '@/assets/graphics/icons/MirrorIcon';

// ─── Types ────────────────────────────────────────────

interface DifferentiationSpectrumProps {
  dsirScores: DSIRScores;
  compositeScores: CompositeScores;
}

// ─── Helpers ──────────────────────────────────────────

function getDiffLabel(score: number): string {
  if (score >= 70) return 'Well Differentiated';
  if (score >= 55) return 'Moderately Differentiated';
  if (score >= 40) return 'Developing Differentiation';
  return 'Low Differentiation';
}

function getInsight(fusion: number, cutoff: number, iPos: number, reactivity: number): string {
  // Low fusion + low cutoff = balanced (good)
  // Low fusion = may be fused (enmeshed)
  // Low cutoff = may be cut off (walled)
  // Pattern: reactivity high + I-position low = reactive fusion

  if (fusion < 40 && cutoff < 40) {
    return 'You may oscillate between fusion and cutoff — enmeshed in some moments, walled off in others. Building a steady middle ground is the growth edge.';
  }

  if (fusion < 40) {
    return 'You tend toward fusion in close relationships — your sense of self can blur when emotions run high. Strengthening your I-position helps you stay connected without losing yourself.';
  }

  if (cutoff < 40) {
    return 'You tend toward emotional cutoff — distancing when things feel intense. This protects you but costs you the intimacy you may want. Small steps toward staying present under stress can expand your range.';
  }

  if (iPos > 60 && reactivity > 55) {
    return 'You maintain a solid sense of self while staying emotionally present. This balance allows for genuine intimacy without self-loss — a real relational strength.';
  }

  return 'Your differentiation is developing — you have moments of clarity about who you are, and moments where the relationship pulls you off-center. This is normal and workable.';
}

// ─── Component ────────────────────────────────────────

export default function DifferentiationSpectrum({
  dsirScores,
  compositeScores,
}: DifferentiationSpectrumProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const markerAnim = useRef(new Animated.Value(0)).current;

  const fusion = dsirScores.subscaleScores.fusionWithOthers?.normalized ?? 50;
  const cutoff = dsirScores.subscaleScores.emotionalCutoff?.normalized ?? 50;
  const iPosition = dsirScores.subscaleScores.iPosition?.normalized ?? 50;
  const reactivity = dsirScores.subscaleScores.emotionalReactivity?.normalized ?? 50;
  const overall = compositeScores.differentiation;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(markerAnim, { toValue: 1, duration: 1000, delay: 300, useNativeDriver: false }),
    ]).start();
  }, []);

  const label = getDiffLabel(overall);
  const insight = getInsight(fusion, cutoff, iPosition, reactivity);

  // Chart
  const chartWidth = 280;
  const chartHeight = 90;
  const barY = 40;
  const barHeight = 12;
  const barX = 30;
  const barW = chartWidth - 60;

  // Position on spectrum: fusion side (0) ← center (50) → cutoff side (100)
  // High fusion normalized = MORE differentiated from fusion, so LOW fusion = fused
  // We want the marker to be LEFT when fused, RIGHT when cut off, CENTER when balanced
  const fusionPull = 100 - fusion; // high when fused
  const cutoffPull = 100 - cutoff; // high when cutoff
  const spectrumPosition = 50 + (cutoffPull - fusionPull) / 4; // range ~25-75
  const markerX = barX + (spectrumPosition / 100) * barW;

  // Subscale indicators
  const subscales = [
    { label: 'I-Position', value: iPosition, color: Colors.success, description: 'Ability to say "I" clearly' },
    { label: 'Emotional Reactivity', value: reactivity, color: Colors.primary, description: 'Staying calm under pressure' },
    { label: 'Fusion With Others', value: fusion, color: Colors.secondary, description: 'Maintaining boundaries' },
    { label: 'Emotional Cutoff', value: cutoff, color: Colors.calm, description: 'Staying present vs. walling off' },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      {/* Header */}
      <Text style={styles.sectionLabel}>DIFFERENTIATION</Text>
      <Text style={styles.title}>Who You Are in Relationship</Text>
      <Text style={styles.subtitle}>The balance between connection and selfhood</Text>

      {/* Main spectrum */}
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Defs>
            <LinearGradient id="diffGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={Colors.secondary} stopOpacity="0.3" />
              <Stop offset="0.5" stopColor={Colors.success} stopOpacity="0.25" />
              <Stop offset="1" stopColor={Colors.primary} stopOpacity="0.3" />
            </LinearGradient>
          </Defs>

          {/* Spectrum bar */}
          <Rect
            x={barX}
            y={barY}
            width={barW}
            height={barHeight}
            rx={barHeight / 2}
            fill="url(#diffGrad)"
          />

          {/* Center line (healthy zone) */}
          <Line
            x1={barX + barW / 2}
            y1={barY - 4}
            x2={barX + barW / 2}
            y2={barY + barHeight + 4}
            stroke={Colors.success}
            strokeWidth={1.5}
            strokeDasharray="3,3"
          />

          {/* Marker dot */}
          <Circle
            cx={markerX}
            cy={barY + barHeight / 2}
            r={8}
            fill={Colors.surface}
            stroke={Colors.text}
            strokeWidth={2.5}
          />
          <Circle
            cx={markerX}
            cy={barY + barHeight / 2}
            r={3}
            fill={Colors.text}
          />

          {/* End labels */}
          <SvgText
            x={barX - 2}
            y={barY - 8}
            fill={Colors.secondary}
            fontSize={9}
            fontFamily={FontFamilies.body}
            fontWeight="500"
            textAnchor="start"
          >
            Fusion
          </SvgText>
          <SvgText
            x={barX + barW / 2}
            y={barY - 8}
            fill={Colors.success}
            fontSize={9}
            fontFamily={FontFamilies.body}
            fontWeight="600"
            textAnchor="middle"
          >
            Balanced
          </SvgText>
          <SvgText
            x={barX + barW + 2}
            y={barY - 8}
            fill={Colors.primary}
            fontSize={9}
            fontFamily={FontFamilies.body}
            fontWeight="500"
            textAnchor="end"
          >
            Cutoff
          </SvgText>

          {/* Score */}
          <SvgText
            x={chartWidth / 2}
            y={barY + barHeight + 22}
            fill={Colors.text}
            fontSize={12}
            fontFamily={FontFamilies.accent}
            fontWeight="600"
            textAnchor="middle"
          >
            {label} ({overall})
          </SvgText>
        </Svg>
      </View>

      {/* Subscale indicators */}
      <View style={styles.subscalesContainer}>
        {subscales.map((sub) => (
          <View key={sub.label} style={styles.subscaleRow}>
            <View style={styles.subscaleHeader}>
              <Text style={styles.subscaleLabel}>{sub.label}</Text>
              <Text style={[styles.subscaleValue, { color: sub.color }]}>{sub.value}</Text>
            </View>
            <View style={styles.subscaleBarTrack}>
              <View
                style={[
                  styles.subscaleBarFill,
                  { width: `${sub.value}%`, backgroundColor: sub.color },
                ]}
              />
            </View>
            <Text style={styles.subscaleDesc}>{sub.description}</Text>
          </View>
        ))}
      </View>

      {/* Insight */}
      <View style={styles.insightBox}>
        <MirrorIcon size={16} color={Colors.secondary} />
        <Text style={styles.insightText}>{insight}</Text>
      </View>
    </Animated.View>
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
    marginBottom: Spacing.md,
  },
  subscalesContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  subscaleRow: {
    gap: 2,
  },
  subscaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscaleLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  subscaleValue: {
    fontFamily: FontFamilies.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  subscaleBarTrack: {
    height: 6,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 3,
    overflow: 'hidden',
  },
  subscaleBarFill: {
    height: 6,
    borderRadius: 3,
  },
  subscaleDesc: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  insightBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
  },
  insightText: {
    ...Typography.bodySmall,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
});
