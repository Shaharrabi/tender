/**
 * StepPortraitInsight — Compact portrait snapshot for a step's READ tab.
 *
 * Shows 1-2 relevant portrait audio tracks + a brief insight sentence
 * based on the step's theme. Makes the step personal by connecting
 * it to the user's actual portrait data.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import { SparkleIcon } from '@/assets/graphics/icons';
import type { IndividualPortrait } from '@/types/portrait';
import PortraitAudioCard from '@/components/audio/PortraitAudioCard';
import {
  selectTracksForPortrait,
} from '@/utils/audio/trackSelection';
import { getStepPortraitInsight } from '@/utils/steps/stepPortraitInsights';

// ─── Component ──────────────────────────────────────────

interface StepPortraitInsightProps {
  stepNumber: number;
  portrait: IndividualPortrait;
  phaseColor: string;
}

export default function StepPortraitInsight({
  stepNumber,
  portrait,
  phaseColor,
}: StepPortraitInsightProps) {
  // Get insight data for this step
  const insight = useMemo(
    () => getStepPortraitInsight(stepNumber, portrait),
    [stepNumber, portrait],
  );

  // Get matching audio tracks
  const tracks = useMemo(() => {
    if (!insight?.audioCategory) return [];
    try {
      const allTracks = selectTracksForPortrait(portrait);
      return allTracks
        .filter((t) => t.category === insight.audioCategory)
        .slice(0, 2);
    } catch {
      return [];
    }
  }, [portrait, insight?.audioCategory]);

  // Don't render if no insight
  if (!insight) return null;

  return (
    <View style={[styles.card, { borderLeftColor: phaseColor }]}>
      {/* Eyebrow */}
      <View style={styles.header}>
        <SparkleIcon size={14} color={phaseColor} />
        <Text style={[styles.eyebrow, { color: phaseColor }]}>
          {insight.eyebrow}
        </Text>
      </View>

      {/* Insight text */}
      <Text style={styles.insightText}>{insight.text}</Text>

      {/* Relevant growth edge (if any) */}
      {insight.relevantEdge && (
        <View style={styles.edgeRow}>
          <View style={[styles.edgeDot, { backgroundColor: phaseColor }]} />
          <Text style={styles.edgeTitle}>
            Growth edge: {insight.relevantEdge.title}
          </Text>
        </View>
      )}

      {/* Audio tracks */}
      {tracks.length > 0 && (
        <View style={styles.tracksSection}>
          <Text style={styles.tracksLabel}>Listen</Text>
          {tracks.map((track) => (
            <PortraitAudioCard
              key={track.id}
              track={track}
              accentColor={phaseColor}
              compact
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  eyebrow: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    letterSpacing: 1,
  },
  insightText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  edgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  edgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  edgeTitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
  tracksSection: {
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  tracksLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
