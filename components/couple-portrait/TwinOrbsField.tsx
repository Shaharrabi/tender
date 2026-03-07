/**
 * Twin Orbs Field — Animated relational field visualization
 *
 * Two breathing circles (Partner A = primary, Partner B = secondary)
 * with an overlap zone that pulses with the resonance value.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { ArrowRightIcon } from '@/assets/graphics/icons';
import type { RelationalFieldLayer } from '@/types/couples';

interface TwinOrbsFieldProps {
  field: RelationalFieldLayer;
  partnerAName: string;
  partnerBName: string;
}

const OVERLAP_COLOR = Colors.overlapPurple; // Blend of primary + secondary

export default function TwinOrbsField({ field, partnerAName, partnerBName }: TwinOrbsFieldProps) {
  const pulseA = useRef(new Animated.Value(0.8)).current;
  const pulseB = useRef(new Animated.Value(0.8)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Breathing animation for orb A
    const animA = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseA, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseA, { toValue: 0.8, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    // Breathing animation for orb B — slightly offset
    const animB = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseB, { toValue: 1, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseB, { toValue: 0.8, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    // Glow pulse based on resonance
    const glowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.6, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.2, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    animA.start();
    setTimeout(() => animB.start(), 500); // offset
    glowAnim.start();

    return () => {
      animA.stop();
      animB.stop();
      glowAnim.stop();
    };
  }, []);

  const vitalityPct = Math.round(field.vitality);
  // Direction icon: up = growing, down = declining, right = stable
  const directionLabel = field.direction > 3 ? 'Growing' : field.direction < -3 ? 'Declining' : 'Stable';
  const directionRotation = field.direction > 3 ? -90 : field.direction < -3 ? 90 : 0;
  const directionColor = field.direction > 3 ? Colors.success : field.direction < -3 ? Colors.warning : Colors.textMuted;

  return (
    <View style={styles.container}>
      {/* SVG Orbs */}
      <View style={styles.orbContainer}>
        <Svg width={260} height={160} viewBox="0 0 260 160">
          <Defs>
            <RadialGradient id="gradA" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={Colors.couplePartnerA} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={Colors.couplePartnerA} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="gradB" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={Colors.couplePartnerB} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={Colors.couplePartnerB} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="gradOverlap" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={OVERLAP_COLOR} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={OVERLAP_COLOR} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Overlap glow */}
          <Circle cx={130} cy={80} r={35} fill="url(#gradOverlap)" />

          {/* Partner A orb */}
          <Circle cx={95} cy={80} r={55} fill="url(#gradA)" />
          <Circle cx={95} cy={80} r={30} fill={Colors.couplePartnerA} opacity={0.25} />
          <Circle cx={95} cy={80} r={12} fill={Colors.couplePartnerA} opacity={0.6} />

          {/* Partner B orb */}
          <Circle cx={165} cy={80} r={55} fill="url(#gradB)" />
          <Circle cx={165} cy={80} r={30} fill={Colors.couplePartnerB} opacity={0.25} />
          <Circle cx={165} cy={80} r={12} fill={Colors.couplePartnerB} opacity={0.6} />
        </Svg>

        {/* Labels */}
        <View style={[styles.nameLabel, { left: 50 }]}>
          <Text style={styles.nameLabelText}>{partnerAName}</Text>
        </View>
        <View style={[styles.nameLabel, { right: 50 }]}>
          <Text style={styles.nameLabelText}>{partnerBName}</Text>
        </View>
      </View>

      {/* Field Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{vitalityPct}</Text>
          <Text style={styles.statLabel}>Vitality</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{Math.round(field.resonance)}</Text>
          <Text style={styles.statLabel}>Resonance</Text>
        </View>
        <View style={styles.stat}>
          <View style={{ transform: [{ rotate: `${directionRotation}deg` }] }}>
            <ArrowRightIcon size={22} color={directionColor} />
          </View>
          <Text style={styles.statLabel}>{directionLabel}</Text>
        </View>
      </View>

      {/* Qualitative Label */}
      <Text style={styles.qualitativeLabel}>{field.qualitativeLabel}</Text>

      {/* Field Narrative */}
      {field.fieldNarrative ? (
        <Text style={styles.fieldNarrative}>{field.fieldNarrative}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  orbContainer: {
    position: 'relative',
    width: 260,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameLabel: {
    position: 'absolute',
    bottom: 4,
  },
  nameLabelText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: Colors.text,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  qualitativeLabel: {
    ...Typography.headingS,
    color: Colors.primary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  fieldNarrative: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    lineHeight: 20,
  },
});
