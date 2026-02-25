/**
 * WaterfallChart — "How Your Profile Was Built"
 *
 * Shows how each assessment contributes to the overall relational profile score.
 * Only shows dimensions that have actual scores (> 0).
 * Missing assessments are listed separately so the user understands gaps.
 *
 * Built with react-native-svg.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
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

function buildAllSteps(scores: CompositeScores): WaterfallStep[] {
  return [
    {
      label: 'Attachment Security',
      shortLabel: 'Attachment',
      value: scores.attachmentSecurity ?? 0,
      color: Colors.primary,
      source: 'ECR-R',
    },
    {
      label: 'Emotional Intelligence',
      shortLabel: 'EQ',
      value: scores.emotionalIntelligence ?? 0,
      color: Colors.accentGold,
      source: 'SSEIT',
    },
    {
      label: 'Differentiation',
      shortLabel: 'Differentiating',
      value: scores.differentiation ?? 0,
      color: Colors.secondary,
      source: 'DSI-R',
    },
    {
      label: 'Conflict Flexibility',
      shortLabel: 'Conflict',
      value: scores.conflictFlexibility ?? 0,
      color: Colors.calm,
      source: 'DUTCH',
    },
    {
      label: 'Values Alignment',
      shortLabel: 'Values',
      value: scores.valuesCongruence ?? 0,
      color: Colors.success,
      source: 'Values',
    },
    {
      label: 'Regulation Capacity',
      shortLabel: 'Regulation',
      value: scores.regulationScore ?? 0,
      color: Colors.accent,
      source: 'Multi',
    },
    {
      label: 'Relational Awareness',
      shortLabel: 'Awareness',
      value: scores.relationalAwareness ?? 0,
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

  const allSteps = buildAllSteps(compositeScores);
  const activeSteps = allSteps.filter((s) => s.value > 0);

  // If no active steps at all, show a placeholder message
  if (activeSteps.length === 0) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeIn }]}>
        <Text style={styles.sectionLabel}>SCORE DECOMPOSITION</Text>
        <Text style={styles.title}>How Your Profile Was Built</Text>
        <Text style={styles.subtitle}>
          Complete your assessments to see how each one contributes to your relational profile.
        </Text>
      </Animated.View>
    );
  }

  // Show ALL dimensions always — zero ones show as empty bars
  const displaySteps = allSteps;
  const overallAvg = activeSteps.length > 0
    ? Math.round(activeSteps.reduce((s, step) => s + step.value, 0) / activeSteps.length)
    : 0;

  // Chart dimensions
  const chartWidth = 300;
  const chartHeight = 220;
  const margin = { top: 20, bottom: 40, left: 8, right: 8 };
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const barWidth = innerWidth / (displaySteps.length + 1.5); // +1 for total bar + gaps
  const gap = barWidth * 0.15;
  const maxScore = 100;

  // Build bar positions for ALL dimensions
  const bars = displaySteps.map((step, i) => {
    const x = margin.left + i * (barWidth + gap);
    const barH = step.value > 0 ? (step.value / maxScore) * innerHeight : 3; // min 3px for empty
    const y = margin.top + innerHeight - barH;
    return { ...step, x, y, width: barWidth, height: barH, isEmpty: step.value <= 0 };
  });

  // Total bar
  const totalX = margin.left + displaySteps.length * (barWidth + gap) + gap;
  const totalH = (overallAvg / maxScore) * innerHeight;
  const totalY = margin.top + innerHeight - totalH;

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      {/* Header */}
      <Text style={styles.sectionLabel}>SCORE DECOMPOSITION</Text>
      <Text style={styles.title}>How Your Profile Was Built</Text>
      <Text style={styles.subtitle}>
        Each completed assessment contributes a dimension to your relational profile. The overall score averages across all active dimensions.
      </Text>

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
                fill={bar.isEmpty ? Colors.borderLight : bar.color}
                fillOpacity={bar.isEmpty ? 0.5 : 0.7}
                stroke={bar.isEmpty ? Colors.border : 'none'}
                strokeWidth={bar.isEmpty ? 0.5 : 0}
                strokeDasharray={bar.isEmpty ? '3,2' : ''}
              />

              {/* Score label on top */}
              <SvgText
                x={bar.x + bar.width / 2}
                y={bar.y - 4}
                fill={bar.isEmpty ? Colors.textMuted : bar.color}
                fontSize={bar.isEmpty ? 8 : 10}
                fontFamily={FontFamilies.accent}
                fontWeight="600"
                textAnchor="middle"
              >
                {bar.isEmpty ? '—' : bar.value}
              </SvgText>

              {/* Label below */}
              <SvgText
                x={bar.x + bar.width / 2}
                y={margin.top + innerHeight + 12}
                fill={bar.isEmpty ? Colors.textMuted : Colors.textSecondary}
                fontSize={7}
                fontFamily={FontFamilies.body}
                textAnchor="middle"
              >
                {bar.shortLabel}
              </SvgText>

              {/* Source below label */}
              <SvgText
                x={bar.x + bar.width / 2}
                y={margin.top + innerHeight + 22}
                fill={Colors.textMuted}
                fontSize={6}
                fontFamily={FontFamilies.body}
                textAnchor="middle"
              >
                {bar.source}
              </SvgText>

              {/* Connector line to next bar */}
              {i < bars.length - 1 && !bar.isEmpty && (
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
            fontSize={8}
            fontFamily={FontFamilies.body}
            fontWeight="600"
            textAnchor="middle"
          >
            Overall
          </SvgText>
        </Svg>
      </View>

      {/* Legend row */}
      <View style={styles.legendRow}>
        {displaySteps.map((step) => (
          <View key={step.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: step.value > 0 ? step.color : Colors.borderLight }]} />
            <Text style={[styles.legendText, step.value <= 0 && { color: Colors.textMuted }]}>{step.shortLabel}</Text>
          </View>
        ))}
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
    fontSize: 9,
    color: Colors.textSecondary,
  },
});
