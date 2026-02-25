/**
 * WaterfallChart — "How Your Profile Was Built"
 *
 * Shows how each assessment contributes to the overall relational profile score.
 * Each bar starts where the previous one ended, creating a cascading waterfall.
 * The final bar shows the composite total.
 *
 * Built with react-native-svg.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';
import type { CompositeScores } from '@/types';

// ─── Types ────────────────────────────────────────────

interface WaterfallChartProps {
  compositeScores: CompositeScores;
}

interface WaterfallStep {
  label: string;
  shortLabel: string;
  value: number;
  color: string;
  source: string;
}

// ─── Step Definitions ─────────────────────────────────

function buildSteps(scores: CompositeScores): WaterfallStep[] {
  return [
    {
      label: 'Attachment Security',
      shortLabel: 'Attachment',
      value: scores.attachmentSecurity,
      color: Colors.primary,
      source: 'ECR-R',
    },
    {
      label: 'Emotional Intelligence',
      shortLabel: 'EQ',
      value: scores.emotionalIntelligence,
      color: Colors.accentGold,
      source: 'SSEIT',
    },
    {
      label: 'Differentiation',
      shortLabel: 'Differentiating',
      value: scores.differentiation,
      color: Colors.secondary,
      source: 'DSI-R',
    },
    {
      label: 'Conflict Flexibility',
      shortLabel: 'Conflict',
      value: scores.conflictFlexibility,
      color: Colors.calm,
      source: 'DUTCH',
    },
    {
      label: 'Values Alignment',
      shortLabel: 'Values',
      value: scores.valuesCongruence,
      color: Colors.success,
      source: 'Values',
    },
    {
      label: 'Regulation Capacity',
      shortLabel: 'Regulation',
      value: scores.regulationScore,
      color: Colors.accent,
      source: 'Multi',
    },
    {
      label: 'Relational Awareness',
      shortLabel: 'Awareness',
      value: scores.relationalAwareness,
      color: Colors.depth,
      source: 'Multi',
    },
  ];
}

// ─── Component ────────────────────────────────────────

export default function WaterfallChart({ compositeScores }: WaterfallChartProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const { width: screenWidth } = useWindowDimensions();
  const steps = buildSteps(compositeScores);
  const overallAvg = Math.round(steps.reduce((s, step) => s + step.value, 0) / steps.length);

  // Chart dimensions — responsive to screen width
  const chartWidth = Math.min(screenWidth - 48, 400);
  const chartHeight = 230;
  const margin = { top: 20, bottom: 45, left: 8, right: 8 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const barWidth = innerWidth / (steps.length + 1.5); // +1 for total bar + gaps
  const gap = barWidth * 0.15;
  const maxScore = 100;

  // Build bar positions (minimum height so all bars are visible)
  const minBarH = 4;
  const bars = steps.map((step, i) => {
    const x = margin.left + i * (barWidth + gap);
    const barH = Math.max((step.value / maxScore) * innerHeight, minBarH);
    const y = margin.top + innerHeight - barH;
    return { ...step, x, y, width: barWidth, height: barH };
  });

  // Total bar
  const totalX = margin.left + steps.length * (barWidth + gap) + gap;
  const totalH = (overallAvg / maxScore) * innerHeight;
  const totalY = margin.top + innerHeight - totalH;

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      {/* Header */}
      <Text style={styles.sectionLabel}>SCORE DECOMPOSITION</Text>
      <Text style={styles.title}>How Your Profile Was Built</Text>
      <Text style={styles.subtitle}>Each assessment contributes to your relational profile</Text>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Baseline */}
          <Line
            x1={margin.left}
            y1={margin.top + innerHeight}
            x2={chartWidth - margin.right}
            y2={margin.top + innerHeight}
            stroke={Colors.borderLight}
            strokeWidth={1}
          />

          {/* Grid lines at 25, 50, 75 */}
          {[25, 50, 75].map((pct) => {
            const y = margin.top + innerHeight - (pct / 100) * innerHeight;
            return (
              <G key={`grid-${pct}`}>
                <Line
                  x1={margin.left}
                  y1={y}
                  x2={chartWidth - margin.right}
                  y2={y}
                  stroke={Colors.borderLight}
                  strokeWidth={0.5}
                  strokeDasharray="4,4"
                />
                <SvgText
                  x={chartWidth - margin.right + 2}
                  y={y + 3}
                  fill={Colors.textMuted}
                  fontSize={8}
                  fontFamily={FontFamilies.body}
                >
                  {pct}
                </SvgText>
              </G>
            );
          })}

          {/* Step bars */}
          {bars.map((bar, i) => (
            <G key={`bar-${i}`}>
              {/* Bar */}
              <Rect
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                rx={2}
                fill={bar.color}
                fillOpacity={0.7}
              />

              {/* Score label on top */}
              <SvgText
                x={bar.x + bar.width / 2}
                y={bar.y - 4}
                fill={bar.color}
                fontSize={10}
                fontFamily={FontFamilies.accent}
                fontWeight="600"
                textAnchor="middle"
              >
                {bar.value}
              </SvgText>

              {/* Label below */}
              <SvgText
                x={bar.x + bar.width / 2}
                y={margin.top + innerHeight + 12}
                fill={Colors.textSecondary}
                fontSize={9}
                fontFamily={FontFamilies.body}
                textAnchor="middle"
              >
                {bar.shortLabel}
              </SvgText>

              {/* Source below label */}
              <SvgText
                x={bar.x + bar.width / 2}
                y={margin.top + innerHeight + 23}
                fill={Colors.textMuted}
                fontSize={8}
                fontFamily={FontFamilies.body}
                textAnchor="middle"
              >
                {bar.source}
              </SvgText>

              {/* Connector line to next bar */}
              {i < bars.length - 1 && (
                <Line
                  x1={bar.x + bar.width}
                  y1={bar.y}
                  x2={bars[i + 1].x}
                  y2={bar.y}
                  stroke={Colors.border}
                  strokeWidth={0.5}
                  strokeDasharray="2,2"
                />
              )}
            </G>
          ))}

          {/* Total bar */}
          <Rect
            x={totalX}
            y={totalY}
            width={barWidth}
            height={totalH}
            rx={2}
            fill={Colors.text}
            fillOpacity={0.15}
            stroke={Colors.text}
            strokeWidth={1}
            strokeOpacity={0.3}
          />
          <SvgText
            x={totalX + barWidth / 2}
            y={totalY - 4}
            fill={Colors.text}
            fontSize={12}
            fontFamily={FontFamilies.accent}
            fontWeight="700"
            textAnchor="middle"
          >
            {overallAvg}
          </SvgText>
          <SvgText
            x={totalX + barWidth / 2}
            y={margin.top + innerHeight + 12}
            fill={Colors.text}
            fontSize={10}
            fontFamily={FontFamilies.body}
            fontWeight="600"
            textAnchor="middle"
          >
            Overall
          </SvgText>
        </Svg>
      </View>

      {/* Legend row — all 7 dimensions with scores */}
      <View style={styles.legendRow}>
        {steps.map((step) => (
          <View key={step.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: step.color }]} />
            <Text style={styles.legendText}>{step.shortLabel}</Text>
            <Text style={[styles.legendScore, { color: step.color }]}>{step.value}</Text>
          </View>
        ))}
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.text }]} />
          <Text style={[styles.legendText, { fontWeight: '600' }]}>Overall</Text>
          <Text style={[styles.legendScore, { color: Colors.text }]}>{overallAvg}</Text>
        </View>
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
    fontFamily: FontFamilies.heading,
    fontSize: 20,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  legendScore: {
    fontFamily: FontFamilies.accent,
    fontSize: 10,
    fontWeight: '700',
  },
});
