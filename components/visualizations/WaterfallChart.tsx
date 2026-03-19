/**
 * WaterfallChart — "How Your Profile Was Built"
 *
 * Shows how each assessment contributes to the overall relational profile score.
 * Responsive layout using horizontal bars (not vertical columns) so all 7
 * dimensions + overall fit comfortably on any phone width.
 *
 * Completed dimensions show colored bars with scores.
 * Missing dimensions show a muted "not yet" placeholder to encourage completion.
 *
 * Built with react-native-svg.
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
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
      shortLabel: 'Attach.',
      value: scores.attachmentSecurity ?? 0,
      color: Colors.primary,
      source: 'Connect',
    },
    {
      label: 'Emotional Intelligence',
      shortLabel: 'EQ',
      value: scores.emotionalIntelligence ?? 0,
      color: Colors.accentGold,
      source: 'Feel',
    },
    {
      label: 'Differentiation',
      shortLabel: 'Diff.',
      value: scores.differentiation ?? 0,
      color: Colors.secondary,
      source: 'Ground',
    },
    {
      label: 'Conflict Flexibility',
      shortLabel: 'Conflict',
      value: scores.conflictFlexibility ?? 0,
      color: Colors.calm,
      source: 'Conflict',
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
      shortLabel: 'Regul.',
      value: scores.regulationScore ?? 0,
      color: Colors.accent,
      source: 'Multi',
    },
    {
      label: 'Relational Awareness',
      shortLabel: 'Aware.',
      value: scores.relationalAwareness ?? 0,
      color: Colors.depth,
      source: 'Multi',
    },
  ];
}

// ─── Component ────────────────────────────────────────

export default function WaterfallChart({ compositeScores }: WaterfallChartProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const allSteps = buildAllSteps(compositeScores);
  const activeSteps = allSteps.filter((s) => s.value > 0);

  // If no active steps at all, show a placeholder message
  if (activeSteps.length === 0) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeIn }]} onLayout={onLayout}>
        <Text style={styles.sectionLabel}>SCORE DECOMPOSITION</Text>
        <Text style={styles.title}>How Your Profile Was Built</Text>
        <Text style={styles.subtitle}>
          Complete your assessments to see how each one contributes to your relational profile.
        </Text>
      </Animated.View>
    );
  }

  const overallAvg = activeSteps.length > 0
    ? Math.round(activeSteps.reduce((s, step) => s + step.value, 0) / activeSteps.length)
    : 0;

  // Horizontal bar chart — each row is a dimension
  // Layout: [Label 60px] [Bar flex] [Score 30px]
  const labelWidth = 52;
  const scoreWidth = 32;
  const barAreaWidth = containerWidth > 0
    ? containerWidth - Spacing.lg * 2 - labelWidth - scoreWidth - Spacing.sm * 2
    : 160;

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]} onLayout={onLayout}>
      {/* Header */}
      <Text style={styles.sectionLabel}>SCORE DECOMPOSITION</Text>
      <Text style={styles.title}>How Your Profile Was Built</Text>
      <Text style={styles.subtitle}>
        Each assessment adds a dimension to your profile. Complete more to deepen your portrait.
      </Text>

      {containerWidth > 0 && (
        <>
          {/* Horizontal bar rows */}
          <View style={styles.barsContainer}>
            {allSteps.map((step) => {
              const isEmpty = step.value <= 0;
              const barPct = isEmpty ? 0 : step.value;
              return (
                <View key={step.label} style={styles.barRow}>
                  {/* Label */}
                  <View style={[styles.barLabel, { width: labelWidth }]}>
                    <Text
                      style={[
                        styles.barLabelText,
                        isEmpty && { color: Colors.textMuted },
                      ]}
                      numberOfLines={1}
                    >
                      {step.shortLabel}
                    </Text>
                    <Text style={styles.barSourceText}>{step.source}</Text>
                  </View>

                  {/* Bar track */}
                  <View style={[styles.barTrack, { width: barAreaWidth }]}>
                    {isEmpty ? (
                      <View style={styles.barEmpty}>
                        <Text style={styles.barEmptyText}>not yet</Text>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${barPct}%`,
                            backgroundColor: step.color,
                          },
                        ]}
                      />
                    )}
                  </View>

                  {/* Score */}
                  <View style={[styles.barScore, { width: scoreWidth }]}>
                    <Text
                      style={[
                        styles.barScoreText,
                        { color: isEmpty ? Colors.textMuted : step.color },
                      ]}
                    >
                      {isEmpty ? '—' : step.value}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Divider */}
            <View style={styles.overallDivider} />

            {/* Overall row */}
            <View style={styles.barRow}>
              <View style={[styles.barLabel, { width: labelWidth }]}>
                <Text style={[styles.barLabelText, { fontWeight: '700', color: Colors.text }]}>
                  Overall
                </Text>
              </View>
              <View style={[styles.barTrack, { width: barAreaWidth }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${overallAvg}%`,
                      backgroundColor: Colors.text,
                      opacity: 0.25,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.barFillBorder,
                    { width: `${overallAvg}%` },
                  ]}
                />
              </View>
              <View style={[styles.barScore, { width: scoreWidth }]}>
                <Text style={[styles.barScoreText, { color: Colors.text, fontWeight: '700', fontSize: 14 }]}>
                  {overallAvg}
                </Text>
              </View>
            </View>
          </View>

          {/* Active count note */}
          <Text style={styles.activeNote}>
            {activeSteps.length} of {allSteps.length} dimensions active
          </Text>
        </>
      )}
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────

const BAR_HEIGHT = 8;

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
  barsContainer: {
    gap: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  barLabel: {
    alignItems: 'flex-end',
  },
  barLabelText: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text,
  },
  barSourceText: {
    fontFamily: FontFamilies.body,
    fontSize: 8,
    color: Colors.textMuted,
  },
  barTrack: {
    height: BAR_HEIGHT,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
  },
  barFillBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    borderWidth: 1,
    borderColor: Colors.text,
    opacity: 0.3,
  },
  barEmpty: {
    flex: 1,
    height: BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barEmptyText: {
    fontFamily: FontFamilies.body,
    fontSize: 7,
    color: Colors.textMuted,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  barScore: {
    alignItems: 'flex-start',
  },
  barScoreText: {
    fontFamily: FontFamilies.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  overallDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 2,
  },
  activeNote: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
});
