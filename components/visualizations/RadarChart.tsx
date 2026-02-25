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

import React, { useEffect, useRef, useMemo, useState } from 'react';
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

function getDimensionDetail(key: string, score: number): { description: string; source: string; strength: string } {
  const details: Record<string, (s: number) => { description: string; source: string; strength: string }> = {
    attachmentSecurity: (s) => ({
      description: s >= 65
        ? 'You have a solid foundation of relational security. You can tolerate closeness and separateness without excessive anxiety or withdrawal.'
        : 'Your attachment system is somewhat activated — you may swing between seeking reassurance and pulling away when closeness feels unsafe.',
      source: 'Based on your ECR-R attachment assessment (anxiety + avoidance dimensions)',
      strength: s >= 65 ? 'Secure base for deeper work' : 'Building safety is the priority',
    }),
    emotionalIntelligence: (s) => ({
      description: s >= 65
        ? 'You have strong emotional intelligence — you perceive, understand, and manage emotions effectively in yourself and others.'
        : 'There\'s room to grow in perceiving and managing emotions. This directly affects how you navigate difficult relational moments.',
      source: 'Based on your SSEIT emotional intelligence assessment (4 subscales)',
      strength: s >= 65 ? 'Natural empathy and attunement' : 'Growth in EQ transforms relationships',
    }),
    differentiation: (s) => ({
      description: s >= 65
        ? 'You maintain a healthy sense of self within relationships — able to stay connected without losing your own perspective.'
        : 'Holding your own position while staying connected to others is your growth edge. This is about being a "self" while in a "we."',
      source: 'Based on your DSI-R differentiation assessment (reactivity, I-position, cutoff, fusion)',
      strength: s >= 65 ? 'Strong relational backbone' : 'I-position work is key',
    }),
    conflictFlexibility: (s) => ({
      description: s >= 65
        ? 'You have a flexible conflict repertoire — able to adapt your style based on the situation rather than defaulting to one pattern.'
        : 'You tend to rely on one or two conflict styles, which can create predictable (and stuck) patterns in disagreements.',
      source: 'Based on your DUTCH conflict styles assessment (5 modes)',
      strength: s >= 65 ? 'Adaptive and versatile under pressure' : 'Expanding your conflict toolkit',
    }),
    valuesCongruence: (s) => ({
      description: s >= 65
        ? 'You\'re living in alignment with what you value most. This congruence creates authenticity and reduces inner conflict.'
        : 'There\'s a gap between what you value and how you\'re living. These gaps are where your protective patterns show up most.',
      source: 'Based on your Values assessment (importance vs. living-it ratings across 10 domains)',
      strength: s >= 65 ? 'Deeply integrated values' : 'Closing the gap is the path',
    }),
    regulationScore: (s) => ({
      description: s >= 65
        ? 'You have strong regulation capacity — your nervous system can handle intensity without flooding or shutting down.'
        : 'When things get emotionally intense, your system may struggle to stay regulated. This affects every other dimension.',
      source: 'Composite: Big Five neuroticism (inverse), EQ self-management, DSI-R emotional reactivity',
      strength: s >= 65 ? 'Solid emotional foundation' : 'Regulation comes before communication',
    }),
    relationalAwareness: (s) => ({
      description: s >= 65
        ? 'You have a keen awareness of relational dynamics — you notice patterns, read the room, and sense what\'s happening between people.'
        : 'Developing awareness of the relational field — the space between you and others — will unlock deeper connection.',
      source: 'Composite: EQ social awareness + perception + agreeableness',
      strength: s >= 65 ? 'Deep relational attunement' : 'Building relational vision',
    }),
  };
  const fn = details[key];
  return fn ? fn(score) : { description: '', source: '', strength: '' };
}

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
  const [expandedDim, setExpandedDim] = useState<string | null>(null);
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

      {/* Dimension chips — tap to explore */}
      <View style={styles.chipsContainer}>
        {DIMENSIONS.map((dim, i) => {
          const val = scoreValues[i];
          const IconComp = dim.Icon;
          const isActive = expandedDim === dim.key;
          return (
            <TouchableOpacity
              key={dim.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => {
                setExpandedDim(isActive ? null : dim.key);
                onDimensionTap?.(dim.shortLabel, val);
              }}
              activeOpacity={0.7}
            >
              <IconComp size={14} color={isActive ? Colors.white : Colors.primary} />
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{dim.shortLabel}</Text>
              <Text style={[styles.chipScore, isActive && styles.chipScoreActive]}>{val}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Expanded dimension detail card */}
      {expandedDim && (() => {
        const dimDef = DIMENSIONS.find(d => d.key === expandedDim);
        if (!dimDef) return null;
        const idx = DIMENSIONS.indexOf(dimDef);
        const val = scoreValues[idx];
        const detail = getDimensionDetail(dimDef.key, val);
        const IconComp = dimDef.Icon;
        return (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <IconComp size={18} color={Colors.primary} />
              <Text style={styles.detailTitle}>{dimDef.shortLabel}</Text>
              <View style={[styles.detailScoreBadge, { backgroundColor: val >= 65 ? Colors.success + '20' : Colors.accentGold + '20' }]}>
                <Text style={[styles.detailScoreNum, { color: val >= 65 ? Colors.success : Colors.accentGold }]}>{val}</Text>
              </View>
            </View>
            <Text style={styles.detailDesc}>{detail.description}</Text>
            <View style={styles.detailMeta}>
              <Text style={styles.detailMetaLabel}>STRENGTH</Text>
              <Text style={styles.detailMetaText}>{detail.strength}</Text>
            </View>
            <Text style={styles.detailSource}>{detail.source}</Text>
            <TouchableOpacity onPress={() => setExpandedDim(null)} style={styles.detailClose}>
              <Text style={styles.detailCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      })()}
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
    fontFamily: FontFamilies.heading,
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
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipLabelActive: {
    color: Colors.white,
  },
  chipScoreActive: {
    color: Colors.white,
  },

  // Dimension detail card
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  detailTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  detailScoreBadge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  detailScoreNum: {
    fontFamily: FontFamilies.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  detailDesc: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  detailMeta: {
    backgroundColor: Colors.success + '10',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.success,
    marginBottom: Spacing.sm,
  },
  detailMetaLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.success,
    marginBottom: 3,
  },
  detailMetaText: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.text,
  },
  detailSource: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  detailClose: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
  detailCloseText: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
