/**
 * Dual Radar Chart — SVG-based 7-axis radar with two partner overlays
 *
 * Partner A = Colors.primary (#C4616E)
 * Partner B = Colors.secondary (#7294D4)
 * Overlap fills = blended purple
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/theme';
import type { RadarOverlap } from '@/types/couples';

interface DualRadarChartProps {
  radarOverlap: RadarOverlap[];
  partnerAName: string;
  partnerBName: string;
  size?: number;
}

const OVERLAP_COLOR = Colors.overlapPurple;

export default function DualRadarChart({
  radarOverlap,
  partnerAName,
  partnerBName,
  size = 280,
}: DualRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 40;
  const n = radarOverlap.length;

  // Calculate points on the radar for a given set of scores
  const getPoints = (scores: number[]): string => {
    return scores
      .map((score, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const r = (score / 100) * radius;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      })
      .join(' ');
  };

  // Grid lines at 25%, 50%, 75%, 100%
  const gridLevels = [0.25, 0.5, 0.75, 1];

  const axisLabels = radarOverlap.map((r, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const labelR = radius + 28;
    const x = cx + labelR * Math.cos(angle);
    const y = cy + labelR * Math.sin(angle);

    // Short labels
    const shortLabels: Record<string, string> = {
      'Attachment Security': 'Attachment',
      'Emotional Intelligence': 'EQ',
      'Differentiation': 'Diff.',
      'Conflict Flexibility': 'Conflict',
      'Values Alignment': 'Values',
      'Regulation Capacity': 'Regulation',
      'Relational Awareness': 'Awareness',
    };

    return {
      x,
      y,
      label: shortLabels[r.dimensionLabel] || r.dimensionLabel,
    };
  });

  const scoresA = radarOverlap.map(r => r.partnerAScore);
  const scoresB = radarOverlap.map(r => r.partnerBScore);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid circles */}
        {gridLevels.map(level => (
          <Circle
            key={level}
            cx={cx}
            cy={cy}
            r={radius * level}
            fill="none"
            stroke={Colors.borderLight}
            strokeWidth={0.5}
          />
        ))}

        {/* Axis lines */}
        {radarOverlap.map((_, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          return (
            <Line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + radius * Math.cos(angle)}
              y2={cy + radius * Math.sin(angle)}
              stroke={Colors.borderLight}
              strokeWidth={0.5}
            />
          );
        })}

        {/* Partner B polygon (back) */}
        <Polygon
          points={getPoints(scoresB)}
          fill={Colors.secondary}
          fillOpacity={0.15}
          stroke={Colors.secondary}
          strokeWidth={2}
        />

        {/* Partner A polygon (front) */}
        <Polygon
          points={getPoints(scoresA)}
          fill={Colors.primary}
          fillOpacity={0.15}
          stroke={Colors.primary}
          strokeWidth={2}
        />

        {/* Data points - Partner A */}
        {scoresA.map((score, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const r = (score / 100) * radius;
          return (
            <Circle
              key={`a-${i}`}
              cx={cx + r * Math.cos(angle)}
              cy={cy + r * Math.sin(angle)}
              r={3}
              fill={Colors.primary}
            />
          );
        })}

        {/* Data points - Partner B */}
        {scoresB.map((score, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const r = (score / 100) * radius;
          return (
            <Circle
              key={`b-${i}`}
              cx={cx + r * Math.cos(angle)}
              cy={cy + r * Math.sin(angle)}
              r={3}
              fill={Colors.secondary}
            />
          );
        })}

        {/* Axis labels */}
        {axisLabels.map((label, i) => (
          <SvgText
            key={i}
            x={label.x}
            y={label.y}
            fontSize={10}
            fill={Colors.textMuted}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontFamily="JosefinSans_400Regular"
          >
            {label.label}
          </SvgText>
        ))}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>{partnerAName}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.secondary }]} />
          <Text style={styles.legendText}>{partnerBName}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
