/**
 * Attachment Matrix Plot — 2D scatter of both partners' attachment positions
 *
 * X-axis: Avoidance (0-100, left=low, right=high)
 * Y-axis: Anxiety (0-100, bottom=low, top=high)
 * Quadrants: Secure, Anxious-Preoccupied, Dismissive-Avoidant, Fearful-Avoidant
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle, Text as SvgText } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/theme';
import type { AttachmentDynamic } from '@/types/couples';

interface AttachmentMatrixPlotProps {
  attachmentDynamic: AttachmentDynamic;
  partnerAName: string;
  partnerBName: string;
}

export default function AttachmentMatrixPlot({
  attachmentDynamic,
  partnerAName,
  partnerBName,
}: AttachmentMatrixPlotProps) {
  const size = 260;
  const padding = 40;
  const plotSize = size - padding * 2;

  // Derive anxiety/avoidance from secure distance + quadrant
  // We reverse-engineer from the quadrant labels
  const getPosition = (quadrant: string, secureDist: number) => {
    const normalizedDist = Math.min(secureDist, 100);
    switch (quadrant) {
      case 'Secure':
        return { x: 25, y: plotSize - 25 }; // low avoidance, low anxiety (bottom-left)
      case 'Anxious-Preoccupied':
        return { x: 25 + normalizedDist * 0.2, y: plotSize - 25 - normalizedDist * 0.7 }; // low avoidance, high anxiety (top-left)
      case 'Dismissive-Avoidant':
        return { x: 25 + normalizedDist * 0.7, y: plotSize - 25 - normalizedDist * 0.2 }; // high avoidance, low anxiety (bottom-right)
      case 'Fearful-Avoidant':
        return { x: 25 + normalizedDist * 0.5, y: plotSize - 25 - normalizedDist * 0.5 }; // high both (top-right)
      default:
        return { x: plotSize / 2, y: plotSize / 2 };
    }
  };

  const posA = getPosition(attachmentDynamic.partnerAQuadrant, attachmentDynamic.partnerASecureDistance);
  const posB = getPosition(attachmentDynamic.partnerBQuadrant, attachmentDynamic.partnerBSecureDistance);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background quadrants */}
        <Rect x={padding} y={padding} width={plotSize / 2} height={plotSize / 2}
          fill={Colors.attachmentFearful} opacity={0.08} />
        <Rect x={padding + plotSize / 2} y={padding} width={plotSize / 2} height={plotSize / 2}
          fill={Colors.attachmentFearful} opacity={0.06} />
        <Rect x={padding} y={padding + plotSize / 2} width={plotSize / 2} height={plotSize / 2}
          fill={Colors.attachmentSecure} opacity={0.1} />
        <Rect x={padding + plotSize / 2} y={padding + plotSize / 2} width={plotSize / 2} height={plotSize / 2}
          fill={Colors.attachmentAvoidant} opacity={0.08} />

        {/* Grid lines */}
        <Line x1={padding} y1={padding + plotSize / 2} x2={padding + plotSize} y2={padding + plotSize / 2}
          stroke={Colors.borderLight} strokeWidth={1} strokeDasharray="4,4" />
        <Line x1={padding + plotSize / 2} y1={padding} x2={padding + plotSize / 2} y2={padding + plotSize}
          stroke={Colors.borderLight} strokeWidth={1} strokeDasharray="4,4" />

        {/* Border */}
        <Rect x={padding} y={padding} width={plotSize} height={plotSize}
          fill="none" stroke={Colors.border} strokeWidth={1} />

        {/* Quadrant labels */}
        <SvgText x={padding + plotSize * 0.25} y={padding + plotSize * 0.25} fontSize={9}
          fill={Colors.textMuted} textAnchor="middle" fontFamily="JosefinSans_400Regular">
          Anxious
        </SvgText>
        <SvgText x={padding + plotSize * 0.75} y={padding + plotSize * 0.25} fontSize={9}
          fill={Colors.textMuted} textAnchor="middle" fontFamily="JosefinSans_400Regular">
          Fearful
        </SvgText>
        <SvgText x={padding + plotSize * 0.25} y={padding + plotSize * 0.75} fontSize={9}
          fill={Colors.textMuted} textAnchor="middle" fontFamily="JosefinSans_400Regular">
          Secure
        </SvgText>
        <SvgText x={padding + plotSize * 0.75} y={padding + plotSize * 0.75} fontSize={9}
          fill={Colors.textMuted} textAnchor="middle" fontFamily="JosefinSans_400Regular">
          Avoidant
        </SvgText>

        {/* Partner A dot */}
        <Circle cx={padding + posA.x} cy={padding + posA.y} r={10}
          fill={Colors.primary} opacity={0.8} />
        <SvgText x={padding + posA.x} y={padding + posA.y + 4} fontSize={10}
          fill={Colors.white} textAnchor="middle" fontWeight="bold">
          A
        </SvgText>

        {/* Partner B dot */}
        <Circle cx={padding + posB.x} cy={padding + posB.y} r={10}
          fill={Colors.secondary} opacity={0.8} />
        <SvgText x={padding + posB.x} y={padding + posB.y + 4} fontSize={10}
          fill={Colors.white} textAnchor="middle" fontWeight="bold">
          B
        </SvgText>

        {/* Connection line */}
        <Line
          x1={padding + posA.x} y1={padding + posA.y}
          x2={padding + posB.x} y2={padding + posB.y}
          stroke={Colors.textMuted} strokeWidth={1} strokeDasharray="3,3" opacity={0.5}
        />

        {/* Axis labels */}
        <SvgText x={size / 2} y={size - 8} fontSize={10}
          fill={Colors.textMuted} textAnchor="middle" fontFamily="JosefinSans_400Regular">
          Avoidance \u2192
        </SvgText>
        <SvgText x={12} y={size / 2} fontSize={10}
          fill={Colors.textMuted} textAnchor="middle" fontFamily="JosefinSans_400Regular"
          transform={`rotate(-90, 12, ${size / 2})`}>
          Anxiety \u2192
        </SvgText>
      </Svg>

      {/* Dynamic label */}
      <Text style={styles.dynamicLabel}>{attachmentDynamic.dynamicLabel}</Text>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>
            {partnerAName} ({attachmentDynamic.partnerAQuadrant})
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.secondary }]} />
          <Text style={styles.legendText}>
            {partnerBName} ({attachmentDynamic.partnerBQuadrant})
          </Text>
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
  dynamicLabel: {
    ...Typography.headingS,
    color: Colors.primary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  legend: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
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
