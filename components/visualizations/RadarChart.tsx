/**
 * RadarChart — 7-axis heptagonal radar for the relational profile.
 *
 * Dimensions:
 *   1. Attachment Security   (HeartDoubleIcon)
 *   2. Emotional Intelligence (BrainIcon)
 *   3. Differentiation        (MirrorIcon)
 *   4. Conflict Flexibility   (ScaleIcon)
 *   5. Values Alignment       (CompassIcon)
 *   6. Regulation Capacity    (MeditationIcon)
 *   7. Relational Awareness   (SearchIcon)
 *
 * Built with react-native-svg. Animated draw-in from center.
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated as RNAnimated, TouchableOpacity } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';
import type { CompositeScores } from '@/types';

// Icon imports
import HeartDoubleIcon from '@/assets/graphics/icons/HeartDoubleIcon';
import BrainIcon from '@/assets/graphics/icons/BrainIcon';
import MirrorIcon from '@/assets/graphics/icons/MirrorIcon';
import ScaleIcon from '@/assets/graphics/icons/ScaleIcon';
import CompassIcon from '@/assets/graphics/icons/CompassIcon';
import MeditationIcon from '@/assets/graphics/icons/MeditationIcon';
import SearchIcon from '@/assets/graphics/icons/SearchIcon';

// ─── Types ────────────────────────────────────────────

interface RadarChartProps {
  scores: CompositeScores;
  size?: number;
  showAverage?: boolean;
  onDimensionTap?: (dimension: string, score: number) => void;
}

interface DimensionDef {
  key: keyof CompositeScores;
  label: string;
  shortLabel: string;
  Icon: React.FC<{ size: number; color: string }>;
}

// ─── Dimension Definitions ────────────────────────────

const DIMENSIONS: DimensionDef[] = [
  { key: 'attachmentSecurity',    label: 'Attachment\nSecurity',      shortLabel: 'Attachment',    Icon: HeartDoubleIcon },
  { key: 'emotionalIntelligence', label: 'Emotional\nIntelligence',   shortLabel: 'EQ',            Icon: BrainIcon },
  { key: 'differentiation',       label: 'Differentiation',           shortLabel: 'Differentiation', Icon: MirrorIcon },
  { key: 'conflictFlexibility',   label: 'Conflict\nFlexibility',     shortLabel: 'Conflict',      Icon: ScaleIcon },
  { key: 'valuesCongruence',      label: 'Values\nAlignment',         shortLabel: 'Values',        Icon: CompassIcon },
  { key: 'regulationScore',       label: 'Regulation\nCapacity',      shortLabel: 'Regulation',    Icon: MeditationIcon },
  { key: 'relationalAwareness',   label: 'Relational\nAwareness',     shortLabel: 'Awareness',     Icon: SearchIcon },
];

const N = DIMENSIONS.length; // 7

// ─── Geometry Helpers ─────────────────────────────────

function getVertex(index: number, radius: number, cx: number, cy: number): [number, number] {
  // Start at top (12 o'clock), go clockwise
  const angle = (2 * Math.PI * index) / N - Math.PI / 2;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

function polygonPoints(values: number[], maxRadius: number, cx: number, cy: number): string {
  return values
    .map((v, i) => {
      const r = (v / 100) * maxRadius;
      const [x, y] = getVertex(i, r, cx, cy);
      return `${x},${y}`;
    })
    .join(' ');
}

// ─── Animated SVG wrapper ─────────────────────────────

const AnimatedSvg = RNAnimated.createAnimatedComponent(Svg);

// ─── Component ────────────────────────────────────────

export default function RadarChart({
  scores,
  size: sizeProp,
  showAverage = true,
  onDimensionTap,
}: RadarChartProps) {
  const size = sizeProp ?? 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38; // leave room for labels
  const padding = size * 0.12;

  const scaleAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    scaleAnim.setValue(0);
    RNAnimated.timing(scaleAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [scores]);

  const scoreValues = useMemo(
    () => DIMENSIONS.map((d) => scores[d.key] ?? 50),
    [scores]
  );

  // Grid rings at 25%, 50%, 75%, 100%
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Average band (35th - 65th percentile)
  const avgLow = 35;
  const avgHigh = 65;
  const avgLowPoints = polygonPoints(Array(N).fill(avgLow), maxRadius, cx, cy);
  const avgHighPoints = polygonPoints(Array(N).fill(avgHigh), maxRadius, cx, cy);

  // Data polygon
  const dataPoints = polygonPoints(scoreValues, maxRadius, cx, cy);

  return (
    <View style={styles.container}>
      {/* Section header */}
      <Text style={styles.sectionLabel}>YOUR RELATIONAL PROFILE</Text>
      <Text style={styles.title}>The Shape of You</Text>
      <Text style={styles.subtitle}>7 dimensions that define how you relate</Text>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <AnimatedSvg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: [{ scale: scaleAnim }] }}
        >
          {/* Grid rings */}
          {rings.map((pct) => {
            const ringPoints = Array(N)
              .fill(0)
              .map((_, i) => {
                const [x, y] = getVertex(i, maxRadius * pct, cx, cy);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <Polygon
                key={`ring-${pct}`}
                points={ringPoints}
                fill="none"
                stroke={Colors.borderLight}
                strokeWidth={1}
              />
            );
          })}

          {/* Axis lines */}
          {DIMENSIONS.map((_, i) => {
            const [x, y] = getVertex(i, maxRadius, cx, cy);
            return (
              <Line
                key={`axis-${i}`}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke={Colors.borderLight}
                strokeWidth={0.5}
              />
            );
          })}

          {/* Average range band */}
          {showAverage && (
            <>
              <Polygon
                points={avgHighPoints}
                fill={Colors.border}
                fillOpacity={0.12}
                stroke="none"
              />
              <Polygon
                points={avgLowPoints}
                fill={Colors.background}
                fillOpacity={1}
                stroke="none"
              />
            </>
          )}

          {/* Data polygon */}
          <Polygon
            points={dataPoints}
            fill={Colors.primaryLight}
            fillOpacity={0.3}
            stroke={Colors.primary}
            strokeWidth={2}
          />

          {/* Data point dots */}
          {scoreValues.map((val, i) => {
            const r = (val / 100) * maxRadius;
            const [x, y] = getVertex(i, r, cx, cy);
            return (
              <Circle
                key={`dot-${i}`}
                cx={x}
                cy={y}
                r={4}
                fill={Colors.primary}
                stroke={Colors.white}
                strokeWidth={1.5}
              />
            );
          })}

          {/* Score numbers near vertices */}
          {scoreValues.map((val, i) => {
            const r = (val / 100) * maxRadius - 14;
            const [x, y] = getVertex(i, Math.max(r, 12), cx, cy);
            return (
              <SvgText
                key={`score-${i}`}
                x={x}
                y={y + 4}
                fill={Colors.text}
                fontSize={11}
                fontFamily={FontFamilies.accent}
                fontWeight="700"
                textAnchor="middle"
              >
                {val}
              </SvgText>
            );
          })}

          {/* Dimension labels outside chart */}
          {DIMENSIONS.map((dim, i) => {
            const labelR = maxRadius + 28;
            const [x, y] = getVertex(i, labelR, cx, cy);
            const lines = dim.label.split('\n');
            return (
              <G key={`label-${i}`}>
                {lines.map((line, li) => (
                  <SvgText
                    key={`label-${i}-${li}`}
                    x={x}
                    y={y + li * 12 - ((lines.length - 1) * 6)}
                    fill={Colors.textSecondary}
                    fontSize={9}
                    fontFamily={FontFamilies.body}
                    textAnchor="middle"
                  >
                    {line}
                  </SvgText>
                ))}
              </G>
            );
          })}
        </AnimatedSvg>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Your profile</Text>
        </View>
        {showAverage && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.border }]} />
            <Text style={styles.legendText}>Average range</Text>
          </View>
        )}
      </View>

      {/* Dimension chips */}
      <View style={styles.chipsContainer}>
        {DIMENSIONS.map((dim, i) => {
          const val = scoreValues[i];
          const IconComp = dim.Icon;
          return (
            <TouchableOpacity
              key={dim.key}
              style={styles.chip}
              onPress={() => onDimensionTap?.(dim.shortLabel, val)}
              activeOpacity={0.7}
            >
              <IconComp size={14} color={Colors.primary} />
              <Text style={styles.chipLabel}>{dim.shortLabel}</Text>
              <Text style={styles.chipScore}>{val}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipLabel: {
    ...Typography.caption,
    color: Colors.text,
  },
  chipScore: {
    fontFamily: FontFamilies.accent,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});
