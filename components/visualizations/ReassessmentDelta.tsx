/**
 * ReassessmentDelta — Slope graph showing score changes between assessments.
 *
 * Visualizes "before → after" for each composite dimension when a user
 * retakes assessments. Lines slope up (improved), down (declined), or
 * stay flat (stable). Color-coded by direction.
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, {
  Line as SvgLine,
  Circle as SvgCircle,
  Text as SvgText,
} from 'react-native-svg';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { CompositeScores } from '@/types/portrait';

// ─── Types ──────────────────────────────────────────────

interface ReassessmentDeltaProps {
  previous: CompositeScores;
  current: CompositeScores;
  previousDate?: string;
  currentDate?: string;
}

interface DimensionDelta {
  key: string;
  label: string;
  shortLabel: string;
  prev: number;
  curr: number;
  delta: number;
  direction: 'up' | 'down' | 'stable';
}

// ─── Dimension Config ───────────────────────────────────

const DIMENSIONS: { key: keyof CompositeScores; label: string; shortLabel: string }[] = [
  { key: 'attachmentSecurity', label: 'Attachment Security', shortLabel: 'Attachment' },
  { key: 'emotionalIntelligence', label: 'Emotional Intelligence', shortLabel: 'EQ' },
  { key: 'differentiation', label: 'Differentiation', shortLabel: 'Diff.' },
  { key: 'conflictFlexibility', label: 'Conflict Flexibility', shortLabel: 'Conflict' },
  { key: 'valuesCongruence', label: 'Values Alignment', shortLabel: 'Values' },
  { key: 'regulationScore', label: 'Regulation Capacity', shortLabel: 'Regulation' },
  { key: 'relationalAwareness', label: 'Relational Awareness', shortLabel: 'Awareness' },
];

// ─── Direction helpers ──────────────────────────────────

function getDirection(delta: number): 'up' | 'down' | 'stable' {
  if (delta >= 3) return 'up';
  if (delta <= -3) return 'down';
  return 'stable';
}

function getDirectionColor(dir: 'up' | 'down' | 'stable'): string {
  switch (dir) {
    case 'up': return Colors.success;
    case 'down': return Colors.primary;
    case 'stable': return Colors.textMuted;
  }
}

function getDirectionLabel(dir: 'up' | 'down' | 'stable'): string {
  switch (dir) {
    case 'up': return 'Growing';
    case 'down': return 'Shifting';
    case 'stable': return 'Stable';
  }
}

// ─── Component ──────────────────────────────────────────

export function ReassessmentDelta({
  previous,
  current,
  previousDate,
  currentDate,
}: ReassessmentDeltaProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Calculate deltas
  const deltas: DimensionDelta[] = useMemo(() => {
    return DIMENSIONS.map(({ key, label, shortLabel }) => {
      const prev = previous[key] ?? 50;
      const curr = current[key] ?? 50;
      const delta = curr - prev;
      return {
        key,
        label,
        shortLabel,
        prev,
        curr,
        delta,
        direction: getDirection(delta),
      };
    });
  }, [previous, current]);

  // Summary stats
  const improved = deltas.filter(d => d.direction === 'up').length;
  const declined = deltas.filter(d => d.direction === 'down').length;
  const stable = deltas.filter(d => d.direction === 'stable').length;

  // SVG dimensions
  const svgWidth = 280;
  const svgHeight = deltas.length * 44 + 20;
  const leftX = 60;
  const rightX = 220;
  const rowHeight = 44;
  const startY = 20;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <Text style={styles.sectionLabel}>YOUR GROWTH OVER TIME</Text>
      <Text style={styles.title}>Assessment Delta</Text>
      <Text style={styles.subtitle}>
        How your profile has shifted between assessments
      </Text>

      {/* Date labels */}
      <View style={styles.dateRow}>
        <Text style={styles.dateLabel}>{previousDate || 'Previous'}</Text>
        <Text style={styles.dateLabel}>{currentDate || 'Current'}</Text>
      </View>

      {/* Slope Graph */}
      <View style={styles.chartWrapper}>
        <Svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Column lines */}
          <SvgLine
            x1={leftX} y1={10} x2={leftX} y2={svgHeight - 5}
            stroke={Colors.borderLight} strokeWidth={1} strokeDasharray="4,4"
          />
          <SvgLine
            x1={rightX} y1={10} x2={rightX} y2={svgHeight - 5}
            stroke={Colors.borderLight} strokeWidth={1} strokeDasharray="4,4"
          />

          {/* Slope lines + dots for each dimension */}
          {deltas.map((d, i) => {
            const y = startY + i * rowHeight;
            const color = getDirectionColor(d.direction);
            // Map score (0-100) to vertical offset within the row for visual clarity
            const prevYOff = y + ((100 - d.prev) / 100) * 8 - 4;
            const currYOff = y + ((100 - d.curr) / 100) * 8 - 4;

            return (
              <React.Fragment key={d.key}>
                {/* Connection line */}
                <SvgLine
                  x1={leftX} y1={prevYOff}
                  x2={rightX} y2={currYOff}
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  opacity={0.7}
                />
                {/* Left dot */}
                <SvgCircle cx={leftX} cy={prevYOff} r={5} fill={color} />
                {/* Right dot */}
                <SvgCircle cx={rightX} cy={currYOff} r={5} fill={color} />
                {/* Left score */}
                <SvgText
                  x={leftX - 8} y={prevYOff + 4}
                  textAnchor="end"
                  fontSize={10}
                  fontFamily={FontFamilies.body}
                  fill={Colors.textSecondary}
                >
                  {Math.round(d.prev)}
                </SvgText>
                {/* Right score */}
                <SvgText
                  x={rightX + 8} y={currYOff + 4}
                  textAnchor="start"
                  fontSize={10}
                  fontFamily={FontFamilies.body}
                  fill={Colors.text}
                  fontWeight="600"
                >
                  {Math.round(d.curr)}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>

        {/* Row labels (RN Text for better rendering) */}
        {deltas.map((d, i) => {
          const y = startY + i * rowHeight - 8;
          const color = getDirectionColor(d.direction);
          const sign = d.delta > 0 ? '+' : '';
          return (
            <View key={`label-${d.key}`} style={[styles.rowLabel, { top: y }]}>
              <Text style={styles.rowLabelText} numberOfLines={1}>{d.shortLabel}</Text>
              {d.direction !== 'stable' && (
                <Text style={[styles.deltaText, { color }]}>
                  {sign}{Math.round(d.delta)}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        {improved > 0 && (
          <View style={[styles.summaryPill, { backgroundColor: Colors.success + '15' }]}>
            <View style={[styles.summaryDot, { backgroundColor: Colors.success }]} />
            <Text style={[styles.summaryText, { color: Colors.success }]}>
              {improved} growing
            </Text>
          </View>
        )}
        {stable > 0 && (
          <View style={[styles.summaryPill, { backgroundColor: Colors.border + '30' }]}>
            <View style={[styles.summaryDot, { backgroundColor: Colors.textMuted }]} />
            <Text style={[styles.summaryText, { color: Colors.textMuted }]}>
              {stable} stable
            </Text>
          </View>
        )}
        {declined > 0 && (
          <View style={[styles.summaryPill, { backgroundColor: Colors.primary + '15' }]}>
            <View style={[styles.summaryDot, { backgroundColor: Colors.primary }]} />
            <Text style={[styles.summaryText, { color: Colors.primary }]}>
              {declined} shifting
            </Text>
          </View>
        )}
      </View>

      {/* Narrative insight */}
      <Text style={styles.insightText}>
        {improved > declined
          ? 'Your profile is expanding — the work you\'re doing is showing up in your relational patterns.'
          : declined > improved
          ? 'Some dimensions are shifting. This isn\'t necessarily bad — growth often involves temporary destabilization.'
          : 'Your profile is relatively stable, suggesting consistent relational patterns. Stability can be a foundation for deeper work.'}
      </Text>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: FontFamilies.body,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.heading3,
    fontFamily: FontFamilies.accent,
    fontWeight: '400',
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.accent,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  dateLabel: {
    fontSize: 10,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chartWrapper: {
    position: 'relative',
    alignSelf: 'center',
    width: 280,
    marginBottom: Spacing.md,
  },
  rowLabel: {
    position: 'absolute',
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingTop: 22,
  },
  rowLabelText: {
    fontSize: 9,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  deltaText: {
    fontSize: 9,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  summaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.pill,
  },
  summaryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  summaryText: {
    fontSize: 11,
    fontFamily: FontFamilies.body,
    fontWeight: '600',
  },
  insightText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.accent,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
