/**
 * ConflictRose — 5-petal rose chart for DUTCH conflict styles.
 *
 * Petals (clockwise from top):
 *   1. Problem Solving  (collaborative)
 *   2. Compromising     (middle-ground)
 *   3. Yielding         (accommodating)
 *   4. Avoiding         (withdrawing)
 *   5. Forcing          (competitive)
 *
 * Each petal length = that style's mean score / max across all.
 * Primary style gets highlighted fill; others get muted.
 * Built with react-native-svg.
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated as RNAnimated } from 'react-native';
import Svg, { Path, Circle, Text as SvgText, G } from 'react-native-svg';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';
import type { DUTCHScores } from '@/types';

// Icons
import ScaleIcon from '@/assets/graphics/icons/ScaleIcon';
import HandshakeIcon from '@/assets/graphics/icons/HandshakeIcon';
import DoveIcon from '@/assets/graphics/icons/DoveIcon';
import ShieldIcon from '@/assets/graphics/icons/ShieldIcon';
import FireIcon from '@/assets/graphics/icons/FireIcon';

// ─── Types ────────────────────────────────────────────

interface ConflictRoseProps {
  dutchScores: DUTCHScores;
  size?: number;
}

interface PetalDef {
  key: string;
  label: string;
  relationalLabel: string; // what it means relationally
  color: string;
  Icon: React.FC<{ size: number; color: string }>;
}

// ─── Petal Definitions ────────────────────────────────

const PETALS: PetalDef[] = [
  { key: 'problemSolving', label: 'Problem Solving', relationalLabel: 'Collaborative',   color: Colors.success,       Icon: HandshakeIcon },
  { key: 'compromising',   label: 'Compromising',    relationalLabel: 'Middle-Ground',   color: Colors.accentGold,    Icon: ScaleIcon },
  { key: 'yielding',       label: 'Yielding',        relationalLabel: 'Accommodating',   color: Colors.secondary,     Icon: DoveIcon },
  { key: 'avoiding',       label: 'Avoiding',        relationalLabel: 'Withdrawing',     color: Colors.calm,          Icon: ShieldIcon },
  { key: 'forcing',        label: 'Forcing',          relationalLabel: 'Competitive',     color: Colors.primary,       Icon: FireIcon },
];

const N = PETALS.length; // 5

// ─── Geometry Helpers ─────────────────────────────────

function petalPath(
  index: number,
  value: number, // 0–1 normalized
  maxRadius: number,
  cx: number,
  cy: number
): string {
  // Each petal is a sector arc with a rounded tip
  const angleSpread = (2 * Math.PI) / N;
  const centerAngle = (2 * Math.PI * index) / N - Math.PI / 2;
  const halfSpread = angleSpread * 0.35; // petal width

  const r = value * maxRadius;
  const rMin = maxRadius * 0.08; // small base circle

  // Petal control points
  const startAngle = centerAngle - halfSpread;
  const endAngle = centerAngle + halfSpread;

  const x1 = cx + rMin * Math.cos(startAngle);
  const y1 = cy + rMin * Math.sin(startAngle);

  const tipX = cx + r * Math.cos(centerAngle);
  const tipY = cy + r * Math.sin(centerAngle);

  const x2 = cx + rMin * Math.cos(endAngle);
  const y2 = cy + rMin * Math.sin(endAngle);

  // Control points for bezier curves (make petals organic/rounded)
  const cp1x = cx + (r * 0.6) * Math.cos(startAngle);
  const cp1y = cy + (r * 0.6) * Math.sin(startAngle);
  const cp2x = cx + (r * 0.6) * Math.cos(endAngle);
  const cp2y = cy + (r * 0.6) * Math.sin(endAngle);

  return `M ${x1} ${y1} Q ${cp1x} ${cp1y} ${tipX} ${tipY} Q ${cp2x} ${cp2y} ${x2} ${y2} Z`;
}

// ─── Component ────────────────────────────────────────

const AnimatedSvg = RNAnimated.createAnimatedComponent(Svg);

export default function ConflictRose({ dutchScores, size: sizeProp }: ConflictRoseProps) {
  const size = sizeProp ?? 200;
  const padding = 40; // padding for labels outside petals
  const svgSize = size + padding * 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const maxRadius = size * 0.36;

  const scaleAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.timing(scaleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Normalize scores: each petal length proportional to its mean / max mean
  const means = useMemo(() => {
    return PETALS.map((p) => dutchScores.subscaleScores[p.key]?.mean ?? 0);
  }, [dutchScores]);

  const maxMean = Math.max(...means, 1);
  const normalized = means.map((m) => Math.max(m / maxMean, 0.12)); // min visible size

  const primaryStyle = dutchScores.primaryStyle;
  const secondaryStyle = dutchScores.secondaryStyle;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.sectionLabel}>CONFLICT LANDSCAPE</Text>
      <Text style={styles.title}>Your Conflict Style Rose</Text>
      <Text style={styles.subtitle}>How you navigate disagreement — which petals grow largest</Text>

      {/* Rose chart */}
      <View style={styles.chartWrapper}>
        <AnimatedSvg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          style={{ transform: [{ scale: scaleAnim }] }}
        >
          {/* Background circle */}
          <Circle cx={cx} cy={cy} r={maxRadius} fill={Colors.backgroundAlt} fillOpacity={0.5} stroke={Colors.borderLight} strokeWidth={1} />
          <Circle cx={cx} cy={cy} r={maxRadius * 0.5} fill="none" stroke={Colors.borderLight} strokeWidth={0.5} />

          {/* Petals */}
          {PETALS.map((petal, i) => {
            const isPrimary = petal.key === primaryStyle;
            const isSecondary = petal.key === secondaryStyle;
            const opacity = isPrimary ? 0.45 : isSecondary ? 0.3 : 0.18;
            const strokeW = isPrimary ? 2 : 1;

            return (
              <Path
                key={petal.key}
                d={petalPath(i, normalized[i], maxRadius, cx, cy)}
                fill={petal.color}
                fillOpacity={opacity}
                stroke={petal.color}
                strokeWidth={strokeW}
                strokeOpacity={isPrimary ? 0.8 : 0.4}
              />
            );
          })}

          {/* Center dot */}
          <Circle cx={cx} cy={cy} r={4} fill={Colors.text} fillOpacity={0.2} />

          {/* Petal labels */}
          {PETALS.map((petal, i) => {
            const angle = (2 * Math.PI * i) / N - Math.PI / 2;
            const labelR = maxRadius + 24;
            const x = cx + labelR * Math.cos(angle);
            const y = cy + labelR * Math.sin(angle);
            return (
              <SvgText
                key={`label-${i}`}
                x={x}
                y={y + 4}
                fill={Colors.textSecondary}
                fontSize={10}
                fontFamily={FontFamilies.body}
                fontWeight="500"
                textAnchor="middle"
              >
                {petal.relationalLabel}
              </SvgText>
            );
          })}
        </AnimatedSvg>
      </View>

      {/* Style summary chips */}
      <View style={styles.chipRow}>
        {PETALS.map((petal, i) => {
          const score = means[i].toFixed(1);
          const isPrimary = petal.key === primaryStyle;
          const IconComp = petal.Icon;
          return (
            <View
              key={petal.key}
              style={[
                styles.chip,
                isPrimary && { borderColor: petal.color, backgroundColor: petal.color + '12' },
              ]}
            >
              <IconComp size={12} color={petal.color} />
              <Text style={[styles.chipLabel, isPrimary && { fontWeight: '600' }]}>
                {petal.label}
              </Text>
              <Text style={[styles.chipScore, { color: petal.color }]}>{score}</Text>
            </View>
          );
        })}
      </View>

      {/* Primary / Secondary callout */}
      <View style={styles.callout}>
        <Text style={styles.calloutText}>
          <Text style={styles.calloutBold}>Primary: </Text>
          {dutchScores.primaryStyle?.replace(/([A-Z])/g, ' $1').trim() ?? 'Unknown'}
          {'  ·  '}
          <Text style={styles.calloutBold}>Secondary: </Text>
          {dutchScores.secondaryStyle?.replace(/([A-Z])/g, ' $1').trim() ?? 'Unknown'}
        </Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
    overflow: 'visible',
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.primary,
    fontSize: 10,
    letterSpacing: 1.0,
    marginBottom: 2,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: Spacing.sm,
  },
  chartWrapper: {
    alignItems: 'center',
    overflow: 'visible',
    paddingVertical: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.text,
    letterSpacing: 0.2,
  },
  chipScore: {
    fontFamily: FontFamilies.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  callout: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  calloutText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  calloutBold: {
    fontWeight: '600',
    color: Colors.text,
  },
});
