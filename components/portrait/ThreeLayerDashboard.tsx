/**
 * ThreeLayerDashboard — Replaces the "65 Overall" circle with three layers:
 *
 * Layer 1: Resonance Pulse — Animated breathing orb with warm gradient,
 *          color temperature shifts from cool blue → warm amber → deep rose.
 * Layer 2: Emergence Direction — Arrow/compass showing movement vs resistance.
 * Layer 3: Relational Vitality — Horizontal gradient spectrum with position marker
 *          and qualitative band label (Constrained → Potential → Generative → Resonant).
 *
 * Data source: CompositeScores (overall mean drives all three layers).
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';
import type { CompositeScores } from '@/types';

// Icons
import SparkleIcon from '@/assets/graphics/icons/SparkleIcon';
import CompassIcon from '@/assets/graphics/icons/CompassIcon';
import LeafIcon from '@/assets/graphics/icons/LeafIcon';

// ─── Types ────────────────────────────────────────────

interface ThreeLayerDashboardProps {
  compositeScores: CompositeScores;
  onSeeDetails?: () => void;
}

// ─── Band Definitions ─────────────────────────────────

interface VitalityBand {
  label: string;
  min: number;
  max: number;
  color: string;
  description: string;
}

const VITALITY_BANDS: VitalityBand[] = [
  { label: 'Constrained', min: 0,  max: 25,  color: Colors.secondaryDark,  description: 'There are real barriers — and also real potential' },
  { label: 'Potential',    min: 25, max: 50,  color: Colors.secondary,      description: 'The foundation is here — waiting to be built upon' },
  { label: 'Generative',  min: 50, max: 75,  color: Colors.accentGold,     description: "You're creating conditions for growth" },
  { label: 'Resonant',    min: 75, max: 100, color: Colors.success,        description: 'Deep connection is alive in your patterns' },
];

// ─── Resonance Status Lines ───────────────────────────

interface ResonanceStatus {
  status: string;
  subtitle: string;
}

function getResonanceStatus(score: number): ResonanceStatus {
  if (score >= 75) return { status: 'Your relational field is resonating', subtitle: 'Something beautiful is happening here' };
  if (score >= 55) return { status: 'Your relational field is alive', subtitle: 'Keep feeding it — something is growing here' };
  if (score >= 35) return { status: 'Your relational field is stirring', subtitle: 'The seeds are planted — they need tending' };
  return { status: 'Your relational field is resting', subtitle: 'Even rest is part of the cycle — be gentle here' };
}

// ─── Direction Status ─────────────────────────────────

interface DirectionStatus {
  label: string;
  description: string;
  rotation: number; // degrees for arrow
}

function getDirectionStatus(score: number): DirectionStatus {
  if (score >= 75) return { label: 'Flourishing', description: 'Strong momentum — you\'re growing in multiple dimensions', rotation: -45 };
  if (score >= 55) return { label: 'Moving', description: 'You\'re moving — new possibilities are opening', rotation: -30 };
  if (score >= 35) return { label: 'Emerging', description: 'Early signs of movement — stay curious', rotation: 0 };
  return { label: 'Gathering', description: 'Gathering strength — this is where growth begins', rotation: 15 };
}

// ─── Helpers ──────────────────────────────────────────

function getOverallScore(scores: CompositeScores): number {
  const keys: (keyof CompositeScores)[] = [
    'regulationScore', 'windowWidth', 'accessibility',
    'responsiveness', 'engagement', 'selfLeadership', 'valuesCongruence',
  ];
  const total = keys.reduce((sum, k) => sum + (scores[k] ?? 0), 0);
  return Math.round(total / keys.length);
}

function getVitalityBand(score: number): VitalityBand {
  return VITALITY_BANDS.find(b => score >= b.min && score < b.max)
    ?? VITALITY_BANDS[VITALITY_BANDS.length - 1];
}

// ─── Layer 1: Resonance Pulse ─────────────────────────

function ResonancePulse({ score }: { score: number }) {
  const breathe = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const status = getResonanceStatus(score);

  useEffect(() => {
    // Fade in
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Breathing loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const orbScale = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const orbOpacity = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  // Color temperature: cool → warm → deep rose based on score
  const getOrbColors = () => {
    if (score >= 75) return { outer: Colors.primary, inner: Colors.primaryLight };
    if (score >= 55) return { outer: Colors.accentGold, inner: Colors.accentCream };
    if (score >= 35) return { outer: Colors.accent, inner: Colors.primaryFaded };
    return { outer: Colors.secondary, inner: Colors.secondaryLight };
  };

  const orbColors = getOrbColors();

  return (
    <Animated.View style={[styles.resonanceContainer, { opacity: fadeIn }]}>
      <Animated.View
        style={[
          styles.orbOuter,
          {
            transform: [{ scale: orbScale }],
            opacity: orbOpacity,
            borderColor: orbColors.outer + '20',
          },
        ]}
      >
        <View style={[styles.orbMiddle, { backgroundColor: orbColors.outer + '15' }]}>
          <View style={[styles.orbInner, { backgroundColor: orbColors.inner + '25' }]}>
            <SparkleIcon size={28} color={orbColors.outer} />
          </View>
        </View>
      </Animated.View>

      <View style={styles.resonanceTextContainer}>
        <Text style={[styles.resonanceStatus, { color: orbColors.outer }]}>
          {status.status}
        </Text>
        <Text style={styles.resonanceSubtitle}>{status.subtitle}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Layer 2: Emergence Direction ─────────────────────

function EmergenceDirection({ score }: { score: number }) {
  const tilt = useRef(new Animated.Value(0)).current;
  const direction = getDirectionStatus(score);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(tilt, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(tilt, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const arrowRotate = tilt.interpolate({
    inputRange: [0, 1],
    outputRange: [`${direction.rotation}deg`, `${direction.rotation - 5}deg`],
  });

  return (
    <View style={styles.directionContainer}>
      <Animated.View
        style={[
          styles.directionArrowCircle,
          { transform: [{ rotate: arrowRotate }] },
        ]}
      >
        <CompassIcon size={22} color={Colors.success} />
      </Animated.View>
      <View style={styles.directionTextContainer}>
        <Text style={styles.directionLabel}>Emergence Direction</Text>
        <Text style={styles.directionDescription}>{direction.description}</Text>
      </View>
    </View>
  );
}

// ─── Layer 3: Relational Vitality ─────────────────────

function RelationalVitality({
  score,
  onSeeDetails,
}: {
  score: number;
  onSeeDetails?: () => void;
}) {
  const markerAnim = useRef(new Animated.Value(0)).current;
  const band = getVitalityBand(score);
  const markerPosition = Math.min(Math.max(score, 2), 98); // keep within bar

  useEffect(() => {
    Animated.timing(markerAnim, {
      toValue: 1,
      duration: 1000,
      delay: 300,
      useNativeDriver: false, // need layout animation
    }).start();
  }, [score]);

  const markerLeft = markerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${markerPosition}%`],
  });

  return (
    <View style={styles.vitalityContainer}>
      <Text style={styles.vitalityLabel}>Relational Vitality</Text>

      {/* Gradient spectrum bar */}
      <View style={styles.spectrumBar}>
        {/* Colored segments */}
        <View style={styles.spectrumGradient}>
          <View style={[styles.spectrumSegment, { flex: 1, backgroundColor: Colors.secondaryDark + '60' }]} />
          <View style={[styles.spectrumSegment, { flex: 1, backgroundColor: Colors.secondary + '50' }]} />
          <View style={[styles.spectrumSegment, { flex: 1, backgroundColor: Colors.accentGold + '60' }]} />
          <View style={[styles.spectrumSegment, { flex: 1, backgroundColor: Colors.success + '60' }]} />
        </View>

        {/* Position marker */}
        <Animated.View style={[styles.spectrumMarker, { left: markerLeft }]}>
          <View style={[styles.spectrumMarkerDot, { borderColor: band.color }]} />
        </Animated.View>
      </View>

      {/* Band labels */}
      <View style={styles.spectrumLabels}>
        {VITALITY_BANDS.map((b) => (
          <Text
            key={b.label}
            style={[
              styles.spectrumLabelText,
              b.label === band.label && { color: band.color, fontWeight: '600' },
            ]}
          >
            {b.label}
          </Text>
        ))}
      </View>

      {/* Current band result */}
      <View style={styles.vitalityResult}>
        <Text style={[styles.vitalityBandName, { color: band.color }]}>
          {band.label}
        </Text>
        <Text style={styles.vitalityDescription}>{band.description}</Text>
      </View>

      {/* See details link */}
      {onSeeDetails && (
        <TouchableOpacity
          onPress={onSeeDetails}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="See what is underneath"
        >
          <Text style={styles.seeDetails}>See what's underneath</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────

export default function ThreeLayerDashboard({
  compositeScores,
  onSeeDetails,
}: ThreeLayerDashboardProps) {
  const overallScore = useMemo(() => getOverallScore(compositeScores), [compositeScores]);

  return (
    <View style={styles.container}>
      <ResonancePulse score={overallScore} />
      <EmergenceDirection score={overallScore} />
      <RelationalVitality score={overallScore} onSeeDetails={onSeeDetails} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────

const ORB_SIZE = 140;
const ORB_MIDDLE = 100;
const ORB_INNER = 64;
const SPECTRUM_HEIGHT = 10;

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },

  // Layer 1: Resonance Pulse
  resonanceContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  orbOuter: {
    width: ORB_SIZE + 40,
    height: ORB_SIZE + 40,
    borderRadius: (ORB_SIZE + 40) / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbMiddle: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbInner: {
    width: ORB_INNER,
    height: ORB_INNER,
    borderRadius: ORB_INNER / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resonanceTextContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  resonanceStatus: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 4,
  },
  resonanceSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Layer 2: Emergence Direction
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  directionArrowCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.success + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionTextContainer: {
    flex: 1,
  },
  directionLabel: {
    ...Typography.label,
    color: Colors.success,
    marginBottom: 2,
  },
  directionDescription: {
    ...Typography.bodySmall,
    color: Colors.text,
  },

  // Layer 3: Relational Vitality
  vitalityContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  vitalityLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  spectrumBar: {
    height: SPECTRUM_HEIGHT,
    borderRadius: SPECTRUM_HEIGHT / 2,
    overflow: 'visible',
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  spectrumGradient: {
    flexDirection: 'row',
    height: SPECTRUM_HEIGHT,
    borderRadius: SPECTRUM_HEIGHT / 2,
    overflow: 'hidden',
  },
  spectrumSegment: {
    height: SPECTRUM_HEIGHT,
  },
  spectrumMarker: {
    position: 'absolute',
    top: -(10 - SPECTRUM_HEIGHT / 2),
    marginLeft: -10,
  },
  spectrumMarkerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 3,
    ...Shadows.subtle,
  },
  spectrumLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  spectrumLabelText: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  vitalityResult: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  vitalityBandName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
  },
  vitalityDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  seeDetails: {
    ...Typography.caption,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    letterSpacing: 0.5,
  },
});
