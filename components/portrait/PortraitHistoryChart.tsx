/**
 * PortraitHistoryChart — "Your Scores Over Time"
 *
 * Shows a compact SVG line chart of a chosen composite score across
 * historical portrait snapshots + the current live score.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, Circle, Path, Text as SvgText } from 'react-native-svg';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import type { CompositeScores } from '@/types/portrait';
import type { PortraitHistoryEntry } from '@/services/portrait';

// ─── Props ───────────────────────────────────────────────

interface PortraitHistoryChartProps {
  history: PortraitHistoryEntry[];
  currentScores: CompositeScores;
  scoreKey: keyof CompositeScores;
}

// ─── Chart constants ─────────────────────────────────────

const CHART_HEIGHT = 120;
const CHART_PADDING_TOP = 16;
const CHART_PADDING_BOTTOM = 24;
const CHART_PADDING_LEFT = 28;
const CHART_PADDING_RIGHT = 16;
const PLOT_HEIGHT = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

// ─── Helpers ─────────────────────────────────────────────

function formatShortDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  } catch {
    return '';
  }
}

// ─── Component ───────────────────────────────────────────

export default function PortraitHistoryChart({
  history,
  currentScores,
  scoreKey,
}: PortraitHistoryChartProps) {
  // Build data points: history entries + current
  const historyPoints = history
    .filter((h) => h.compositeScores && typeof h.compositeScores[scoreKey] === 'number')
    .map((h) => ({
      value: h.compositeScores[scoreKey] as number,
      label: formatShortDate(h.archivedAt),
    }));

  const currentValue = typeof currentScores[scoreKey] === 'number'
    ? (currentScores[scoreKey] as number)
    : null;

  const allPoints = [
    ...historyPoints,
    ...(currentValue !== null ? [{ value: currentValue, label: 'Now' }] : []),
  ];

  // Need at least 2 points to draw a line
  if (allPoints.length < 2) {
    return (
      <View style={styles.emptyContainer}>
        <TenderText variant="body" color={Colors.textMuted} align="center">
          Take your first retake to see progress
        </TenderText>
      </View>
    );
  }

  // We need a width — use a fixed width and let the parent constrain it
  const CHART_WIDTH = 320;
  const PLOT_WIDTH = CHART_WIDTH - CHART_PADDING_LEFT - CHART_PADDING_RIGHT;

  const n = allPoints.length;
  const xStep = n > 1 ? PLOT_WIDTH / (n - 1) : 0;

  const toX = (i: number) => CHART_PADDING_LEFT + i * xStep;
  const toY = (v: number) => {
    const clamped = Math.max(0, Math.min(100, v));
    return CHART_PADDING_TOP + PLOT_HEIGHT * (1 - clamped / 100);
  };

  // Build path string
  const pathParts = allPoints.map((pt, i) => {
    const x = toX(i);
    const y = toY(pt.value);
    return i === 0 ? `M${x},${y}` : `L${x},${y}`;
  });
  const pathD = pathParts.join(' ');

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Y-axis guide lines at 25, 50, 75 */}
        {[25, 50, 75].map((v) => (
          <Line
            key={v}
            x1={CHART_PADDING_LEFT}
            y1={toY(v)}
            x2={CHART_WIDTH - CHART_PADDING_RIGHT}
            y2={toY(v)}
            stroke={Colors.borderLight}
            strokeWidth={1}
            strokeDasharray="3,3"
          />
        ))}

        {/* Y-axis labels */}
        {[25, 50, 75].map((v) => (
          <SvgText
            key={`label-${v}`}
            x={CHART_PADDING_LEFT - 4}
            y={toY(v) + 4}
            fontSize={8}
            fill={Colors.textMuted}
            textAnchor="end"
          >
            {v}
          </SvgText>
        ))}

        {/* Line connecting dots */}
        <Path
          d={pathD}
          stroke={Colors.primary}
          strokeWidth={2}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* History dots */}
        {historyPoints.map((pt, i) => (
          <Circle
            key={`hist-${i}`}
            cx={toX(i)}
            cy={toY(pt.value)}
            r={4}
            fill={Colors.primaryLight}
            stroke={Colors.primary}
            strokeWidth={1.5}
          />
        ))}

        {/* X-axis date labels for history */}
        {historyPoints.map((pt, i) => (
          <SvgText
            key={`xlabel-${i}`}
            x={toX(i)}
            y={CHART_HEIGHT - 4}
            fontSize={8}
            fill={Colors.textMuted}
            textAnchor="middle"
          >
            {pt.label}
          </SvgText>
        ))}

        {/* Current score dot — larger and labeled */}
        {currentValue !== null && (
          <>
            <Circle
              cx={toX(n - 1)}
              cy={toY(currentValue)}
              r={7}
              fill={Colors.primary}
              stroke={Colors.surface}
              strokeWidth={2}
            />
            <SvgText
              x={toX(n - 1)}
              y={toY(currentValue) - 12}
              fontSize={9}
              fontWeight="700"
              fill={Colors.primary}
              textAnchor="middle"
            >
              {Math.round(currentValue)}
            </SvgText>
            <SvgText
              x={toX(n - 1)}
              y={CHART_HEIGHT - 4}
              fontSize={8}
              fontWeight="600"
              fill={Colors.primary}
              textAnchor="middle"
            >
              Now
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  emptyContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
});
