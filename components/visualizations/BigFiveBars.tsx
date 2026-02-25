/**
 * BigFiveBars — Big Five personality traits with relational reframes.
 *
 * Instead of raw trait names, each trait is reframed relationally:
 *   Neuroticism  → "Emotional Sensitivity"     (high = deeply feeling)
 *   Extraversion → "Relational Energy"          (high = energized by connection)
 *   Openness     → "Relational Curiosity"       (high = open to new ways)
 *   Agreeableness→ "Relational Warmth"          (high = naturally accommodating)
 *   Conscientiousness → "Relational Reliability" (high = structured, dependable)
 *
 * Each bar shows percentile (0-100) with bidirectional framing:
 *   low end label ← bar → high end label
 * Plus a one-line relational insight below each.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';
import type { IPIPScores } from '@/types';

// ─── Types ────────────────────────────────────────────

interface BigFiveBarsProps {
  ipipScores: IPIPScores;
  reframes?: string[]; // from big-five-reframes.ts
}

interface TraitDef {
  key: string;
  relationalName: string;
  lowLabel: string;
  highLabel: string;
  color: string;
  getInsight: (pct: number) => string;
}

// ─── Trait Definitions ────────────────────────────────

const TRAITS: TraitDef[] = [
  {
    key: 'neuroticism',
    relationalName: 'Emotional Sensitivity',
    lowLabel: 'Steady',
    highLabel: 'Deeply Feeling',
    color: Colors.primary,
    getInsight: (pct) =>
      pct >= 65
        ? 'You feel the emotional weather intensely — a gift for empathy, a challenge for regulation'
        : pct >= 35
        ? 'You navigate emotions with moderate ease, occasionally caught off-guard by intensity'
        : 'You move through emotional storms with unusual steadiness — a stabilizing presence',
  },
  {
    key: 'extraversion',
    relationalName: 'Relational Energy',
    lowLabel: 'Reflective',
    highLabel: 'Energized',
    color: Colors.accentGold,
    getInsight: (pct) =>
      pct >= 65
        ? 'Connection charges your batteries — you seek engagement and thrive in togetherness'
        : pct >= 35
        ? 'You balance social connection with solitude, drawing energy from both'
        : 'You recharge in solitude — depth over breadth in your closest relationships',
  },
  {
    key: 'openness',
    relationalName: 'Relational Curiosity',
    lowLabel: 'Grounded',
    highLabel: 'Exploratory',
    color: Colors.secondary,
    getInsight: (pct) =>
      pct >= 65
        ? 'You bring curiosity and imagination to relationships — open to new ways of connecting'
        : pct >= 35
        ? 'You appreciate both tradition and novelty in how you approach relationships'
        : 'You value the familiar and proven — consistency is how you show love',
  },
  {
    key: 'agreeableness',
    relationalName: 'Relational Warmth',
    lowLabel: 'Boundaried',
    highLabel: 'Harmonizing',
    color: Colors.success,
    getInsight: (pct) =>
      pct >= 65
        ? 'Your natural warmth creates safety — watch that it doesn\'t come at the cost of your own voice'
        : pct >= 35
        ? 'You balance warmth with directness — able to hold both care and honest challenge'
        : 'You lead with authenticity over appeasement — your directness is a form of respect',
  },
  {
    key: 'conscientiousness',
    relationalName: 'Relational Reliability',
    lowLabel: 'Flexible',
    highLabel: 'Structured',
    color: Colors.calm,
    getInsight: (pct) =>
      pct >= 65
        ? 'Your dependability creates relational trust — your partner knows what to expect from you'
        : pct >= 35
        ? 'You balance structure with spontaneity — reliable without being rigid'
        : 'Your flexibility keeps things fresh — just ensure follow-through matches your intentions',
  },
];

// ─── Trait Bar ────────────────────────────────────────

function TraitBar({ trait, percentile }: { trait: TraitDef; percentile: number }) {
  const pct = Math.min(Math.max(percentile, 2), 98);

  return (
    <View style={styles.traitContainer}>
      {/* Relational name + percentile */}
      <View style={styles.traitHeader}>
        <Text style={styles.traitName}>{trait.relationalName}</Text>
        <Text style={[styles.traitPct, { color: trait.color }]}>{Math.round(percentile)}</Text>
      </View>

      {/* Bar with bidirectional labels */}
      <View style={styles.barRow}>
        <Text style={styles.endLabel}>{trait.lowLabel}</Text>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${pct}%`, backgroundColor: trait.color },
            ]}
          />
          {/* Marker dot */}
          <View style={[styles.markerDot, { left: `${pct}%`, borderColor: trait.color }]} />
        </View>
        <Text style={styles.endLabel}>{trait.highLabel}</Text>
      </View>

      {/* Relational insight */}
      <Text style={styles.traitInsight}>{trait.getInsight(percentile)}</Text>
    </View>
  );
}

// ─── Component ────────────────────────────────────────

export default function BigFiveBars({ ipipScores, reframes }: BigFiveBarsProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.sectionLabel}>PERSONALITY IN RELATIONSHIPS</Text>
      <Text style={styles.title}>Your Relational Wiring</Text>
      <Text style={styles.subtitle}>
        How your personality shapes your relationship patterns
      </Text>

      {/* Trait bars */}
      <View style={styles.traitsContainer}>
        {TRAITS.map((trait) => (
          <TraitBar
            key={trait.key}
            trait={trait}
            percentile={ipipScores.domainPercentiles[trait.key] ?? 50}
          />
        ))}
      </View>

      {/* Narrative reframes (from portrait generator) */}
      {reframes && reframes.length > 0 && (
        <View style={styles.reframesContainer}>
          <Text style={styles.reframesHeading}>What This Means Together</Text>
          {reframes.map((para, i) => (
            <Text key={i} style={styles.reframeParagraph}>{para}</Text>
          ))}
        </View>
      )}
    </View>
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
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  traitsContainer: {
    gap: Spacing.md,
  },

  // Individual trait
  traitContainer: {
    gap: 4,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  traitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  traitName: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  traitPct: {
    fontFamily: FontFamilies.accent,
    fontSize: 14,
    fontWeight: '700',
  },

  // Bar
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  endLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 0.3,
    width: 56,
    textAlign: 'center',
  },
  barTrack: {
    flex: 1,
    height: BAR_HEIGHT,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'visible',
    position: 'relative',
  },
  barFill: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
  },
  markerDot: {
    position: 'absolute',
    top: -3,
    marginLeft: -7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.white,
    borderWidth: 2.5,
    ...Shadows.subtle,
  },
  traitInsight: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 17,
    marginTop: 2,
  },

  // Reframes
  reframesContainer: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
  },
  reframesHeading: {
    ...Typography.label,
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  reframeParagraph: {
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
});
