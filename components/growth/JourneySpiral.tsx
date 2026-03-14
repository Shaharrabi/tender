/**
 * JourneySpiral — "The Field" concentric rings visualization.
 *
 * Renders 12 step nodes arranged in a circle with three concentric rings,
 * phase-colored arcs, sequential zone dot lighting, and a breathing
 * center orb. Inspired by the Tender Sticker System "Field" design.
 *
 * Visual design:
 * - 3 concentric rings (outer=guide, mid=faded, inner=glow)
 * - 12 zone dots on the outer ring that light up sequentially
 * - Phase arcs color the ring segments
 * - Breathing center with pulsing field energy
 * - Completed nodes bloom with phase color
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Circle, Path, Line, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, FontFamilies, FontSizes, Shadows, BorderRadius } from '@/constants/theme';
import { HEALING_PHASES, getStep, getPhaseForStep } from '@/utils/steps/twelve-steps';
import { CheckmarkIcon } from '@/assets/graphics/icons';

// ─── Sticker palette ─────────────────────────────────────
const STICKER = {
  blush: '#E8B4B8',
  sage: '#A8B5A2',
  mustard: '#D4A843',
  cream: '#F5F0E8',
  dustyBlue: '#8BA4B8',
  terracotta: '#C4836A',
  plum: '#8B6B7B',
  ink: '#3D3530',
  softInk: '#6B5E56',
};

// ─── Layout constants ────────────────────────────────────

const SIZE = 280;                   // SVG canvas (slightly larger for rings)
const CENTER = SIZE / 2;            // 140
const RING_OUTER = 110;             // Outer ring — where nodes sit
const RING_MID = 82;                // Middle ring — decorative
const RING_INNER = 54;              // Inner ring — closest to center
const NODE_R = 15;                  // Completed/active node radius
const NODE_R_SMALL = 8;             // Locked node radius
const ARC_WIDTH = 5;                // Phase arc stroke width

// Each step sits at (360/12 * i) degrees, starting from top (-90°)
function nodePosition(index: number, radius: number = RING_OUTER) {
  const angle = ((index * 30) - 90) * (Math.PI / 180);
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

// SVG arc path between two angles on a ring
function arcPath(startDeg: number, endDeg: number, r: number): string {
  const startRad = (startDeg - 90) * (Math.PI / 180);
  const endRad = (endDeg - 90) * (Math.PI / 180);
  const x1 = CENTER + r * Math.cos(startRad);
  const y1 = CENTER + r * Math.sin(startRad);
  const x2 = CENTER + r * Math.cos(endRad);
  const y2 = CENTER + r * Math.sin(endRad);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

// Get phase color for a step number (1-based)
function getPhaseColor(stepNum: number): string {
  const phase = getPhaseForStep(stepNum);
  return phase?.color ?? Colors.textMuted;
}

// Zone dot colors — each step gets a unique accent from the palette
const ZONE_COLORS = [
  STICKER.blush,      // Step 1
  STICKER.sage,       // Step 2
  STICKER.dustyBlue,  // Step 3
  STICKER.mustard,    // Step 4
  STICKER.terracotta, // Step 5
  STICKER.plum,       // Step 6
  STICKER.blush,      // Step 7
  STICKER.sage,       // Step 8
  STICKER.dustyBlue,  // Step 9
  STICKER.mustard,    // Step 10
  STICKER.terracotta, // Step 11
  STICKER.plum,       // Step 12
];

// ─── Props ───────────────────────────────────────────────

interface JourneySpiralProps {
  /** Current active step number (1-based) */
  currentStep: number;
  /** Called when user taps an unlocked step node */
  onStepPress: (stepNumber: number) => void;
  /** Called when user taps the center of the circle */
  onCenterPress?: () => void;
}

// ─── Component ───────────────────────────────────────────

export default function JourneySpiral({ currentStep, onStepPress, onCenterPress }: JourneySpiralProps) {
  // ── Sequential zone dot animations ──
  // Each of 12 dots pulses in sequence (staggered by 250ms)
  const zoneDots = useRef(
    Array.from({ length: 12 }, () => new Animated.Value(0.2))
  ).current;

  // ── Breathing animations ──
  const breatheScale = useRef(new Animated.Value(0.92)).current;
  const glowOpacity = useRef(new Animated.Value(0.15)).current;
  const ringPulse = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textBreathe = useRef(new Animated.Value(0.7)).current;
  // Inner rings rotation-like pulse
  const ringRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ── Sequential zone dot lighting ──
    // Each dot fades in/out sequentially around the ring (3s total cycle)
    const dotAnimations = zoneDots.map((dot, i) => {
      return Animated.loop(
        Animated.sequence([
          // Wait for this dot's turn
          Animated.delay(i * 250),
          // Light up
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          // Fade back
          Animated.timing(dot, {
            toValue: 0.2,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          // Wait for full cycle to restart
          Animated.delay((11 - i) * 250),
        ])
      );
    });

    // Center orb — slow inhale/exhale
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheScale, {
          toValue: 1.12,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheScale, {
          toValue: 0.92,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Glow opacity
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.15,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Ring guide pulse
    const ring = Animated.loop(
      Animated.sequence([
        Animated.timing(ringPulse, {
          toValue: 0.55,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(ringPulse, {
          toValue: 0.3,
          duration: 6000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Active node pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Center text breathe
    const textBreath = Animated.loop(
      Animated.sequence([
        Animated.timing(textBreathe, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(textBreathe, {
          toValue: 0.7,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Inner ring slow rotation feel (opacity cycle offset)
    const ringRot = Animated.loop(
      Animated.sequence([
        Animated.timing(ringRotate, {
          toValue: 1,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(ringRotate, {
          toValue: 0,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    breathe.start();
    glow.start();
    ring.start();
    pulse.start();
    textBreath.start();
    ringRot.start();
    dotAnimations.forEach((a) => a.start());

    return () => {
      breathe.stop();
      glow.stop();
      ring.stop();
      pulse.stop();
      textBreath.stop();
      ringRot.stop();
      dotAnimations.forEach((a) => a.stop());
    };
  }, []);

  const currentStepData = getStep(currentStep);
  const currentPhase = getPhaseForStep(currentStep);

  // Inner ring opacity derived from ringRotate
  const innerRingOpacity = ringRotate.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.12, 0.25, 0.12],
  });
  const midRingOpacity = ringRotate.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.08, 0.2],
  });

  return (
    <View style={styles.wrapper}>
      {/* SVG Concentric Rings + Phase Arcs */}
      <View style={styles.svgContainer}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Defs>
            <RadialGradient id="centerGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={STICKER.mustard} stopOpacity={0.15} />
              <Stop offset="100%" stopColor={STICKER.mustard} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* Center glow gradient */}
          <Circle cx={CENTER} cy={CENTER} r={RING_INNER - 10} fill="url(#centerGlow)" />

          {/* Inner ring — closest to center, subtle */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RING_INNER}
            fill="none"
            stroke={STICKER.sage}
            strokeWidth={0.6}
            opacity={0.15}
          />

          {/* Middle ring — decorative */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RING_MID}
            fill="none"
            stroke={STICKER.sage}
            strokeWidth={0.8}
            opacity={0.12}
          />

          {/* Outer ring — where nodes sit */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RING_OUTER}
            fill="none"
            stroke={Colors.primaryFaded}
            strokeWidth={1}
            opacity={0.35}
          />

          {/* Phase arcs on the outer ring */}
          {HEALING_PHASES.map((phase) => {
            const startDeg = (phase.stepRange[0] - 1) * 30;
            const endDeg = (phase.stepRange[1]) * 30;
            return (
              <Path
                key={phase.id}
                d={arcPath(startDeg, endDeg, RING_OUTER)}
                fill="none"
                stroke={phase.color + '35'}
                strokeWidth={ARC_WIDTH}
                strokeLinecap="round"
              />
            );
          })}

          {/* Phase arcs mirrored on middle ring (fainter) */}
          {HEALING_PHASES.map((phase) => {
            const startDeg = (phase.stepRange[0] - 1) * 30;
            const endDeg = (phase.stepRange[1]) * 30;
            return (
              <Path
                key={`mid-${phase.id}`}
                d={arcPath(startDeg, endDeg, RING_MID)}
                fill="none"
                stroke={phase.color + '18'}
                strokeWidth={2}
                strokeLinecap="round"
              />
            );
          })}

          {/* Connecting radial lines — subtle spokes from inner to outer */}
          {Array.from({ length: 12 }, (_, i) => {
            const innerPos = nodePosition(i, RING_INNER + 8);
            const outerPos = nodePosition(i, RING_OUTER - 18);
            const phaseColor = getPhaseColor(i + 1);
            const isCompleted = (i + 1) < currentStep;
            return (
              <Line
                key={`spoke-${i}`}
                x1={innerPos.x}
                y1={innerPos.y}
                x2={outerPos.x}
                y2={outerPos.y}
                stroke={isCompleted ? phaseColor : STICKER.softInk}
                strokeWidth={0.4}
                opacity={isCompleted ? 0.25 : 0.08}
              />
            );
          })}

          {/* Accent dots on middle ring — decorative zone markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const pos = nodePosition(i, RING_MID);
            const isCompleted = (i + 1) < currentStep;
            const phaseColor = getPhaseColor(i + 1);
            return (
              <Circle
                key={`mid-dot-${i}`}
                cx={pos.x}
                cy={pos.y}
                r={isCompleted ? 3 : 2}
                fill={isCompleted ? phaseColor : STICKER.softInk}
                opacity={isCompleted ? 0.4 : 0.12}
              />
            );
          })}
        </Svg>

        {/* Sequential zone dots on outer ring — RN Animated for sequential glow */}
        {Array.from({ length: 12 }, (_, i) => {
          const pos = nodePosition(i, RING_OUTER);
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          if (isCompleted || stepNum === currentStep) return null; // Handled by node

          return (
            <Animated.View
              key={`zone-${i}`}
              style={[
                styles.zoneDot,
                {
                  left: pos.x - 4,
                  top: pos.y - 4,
                  opacity: zoneDots[i],
                  backgroundColor: ZONE_COLORS[i],
                },
              ]}
            />
          );
        })}

        {/* Inner ring decorative pulse */}
        <Animated.View
          style={[
            styles.innerRingOverlay,
            { opacity: innerRingOpacity },
          ]}
        />

        {/* Middle ring decorative pulse */}
        <Animated.View
          style={[
            styles.midRingOverlay,
            { opacity: midRingOpacity },
          ]}
        />

        {/* Breathing ring overlay on outer */}
        <Animated.View
          style={[
            styles.ringOverlay,
            { opacity: ringPulse },
          ]}
        />

        {/* Center breathing orb — inner */}
        <Animated.View
          style={[
            styles.centerOrb,
            {
              transform: [{ scale: breatheScale }],
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Center orb — outer diffuse glow */}
        <Animated.View
          style={[
            styles.centerOrbOuter,
            {
              transform: [{ scale: breatheScale }],
              opacity: Animated.multiply(glowOpacity, 0.4),
            },
          ]}
        />

        {/* Center text — breathes with the orb, tappable to open growth page */}
        <TouchableOpacity
          onPress={() => onCenterPress ? onCenterPress() : onStepPress(currentStep)}
          activeOpacity={0.7}
          style={styles.centerTouchable}
          accessibilityRole="button"
          accessibilityLabel="Open your 12-step journey"
        >
          <Animated.View style={[styles.centerContent, { opacity: textBreathe }]}>
            <TenderText
              variant="label"
              color={Colors.textMuted}
              align="center"
              style={styles.centerLabel}
            >
              THE FIELD
            </TenderText>
            {currentPhase && (
              <TenderText
                variant="label"
                color={currentPhase.color}
                align="center"
                style={styles.centerPhase}
              >
                {currentPhase.name}
              </TenderText>
            )}
            <TenderText
              variant="caption"
              color={Colors.text}
              align="center"
              style={styles.centerStep}
              numberOfLines={1}
            >
              Step {currentStep}
            </TenderText>
          </Animated.View>
        </TouchableOpacity>

        {/* Step nodes — absolute positioned on outer ring */}
        {Array.from({ length: 12 }, (_, i) => {
          const stepNum = i + 1;
          const pos = nodePosition(i, RING_OUTER);
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isLocked = stepNum > currentStep;
          const phaseColor = getPhaseColor(stepNum);

          return (
            <React.Fragment key={stepNum}>
              {/* Active node pulse ring */}
              {isActive && (
                <Animated.View
                  style={[
                    styles.nodeBase,
                    styles.activePulseRing,
                    {
                      left: pos.x - NODE_R - 4,
                      top: pos.y - NODE_R - 4,
                      width: (NODE_R + 4) * 2,
                      height: (NODE_R + 4) * 2,
                      borderRadius: NODE_R + 4,
                      borderColor: phaseColor + '50',
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
              )}

              <TouchableOpacity
                style={[
                  styles.nodeBase,
                  isCompleted && [styles.nodeCompleted, { backgroundColor: phaseColor }],
                  isActive && [styles.nodeActive, { borderColor: phaseColor, backgroundColor: phaseColor + '15' }],
                  isLocked && styles.nodeLocked,
                  {
                    left: pos.x - (isLocked ? NODE_R_SMALL : NODE_R),
                    top: pos.y - (isLocked ? NODE_R_SMALL : NODE_R),
                    width: (isLocked ? NODE_R_SMALL : NODE_R) * 2,
                    height: (isLocked ? NODE_R_SMALL : NODE_R) * 2,
                    borderRadius: isLocked ? NODE_R_SMALL : NODE_R,
                  },
                ]}
                onPress={() => !isLocked && onStepPress(stepNum)}
                disabled={isLocked}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Step ${stepNum}: ${getStep(stepNum)?.title ?? ''}, ${
                  isCompleted ? 'completed' : isActive ? 'current step' : 'locked'
                }`}
              >
                {isCompleted && (
                  <CheckmarkIcon size={10} color={Colors.white} />
                )}
                {isActive && (
                  <View style={[styles.activeInnerDot, { backgroundColor: phaseColor }]} />
                )}
                {!isLocked && (
                  <TenderText
                    variant="label"
                    color={isCompleted ? Colors.white : phaseColor}
                    align="center"
                    style={styles.nodeLabel}
                  >
                    {stepNum}
                  </TenderText>
                )}
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>

      {/* Current step title — below the circle */}
      {currentStepData && (
        <TouchableOpacity
          style={styles.currentStepRow}
          onPress={() => onStepPress(currentStep)}
          activeOpacity={0.7}
        >
          <TenderText variant="headingS" color={Colors.text} align="center">
            {currentStepData.title}
          </TenderText>
          <TenderText variant="caption" color={Colors.textSecondary} align="center" style={{ marginTop: 2 }}>
            Tap to continue {'\u2192'}
          </TenderText>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  svgContainer: {
    width: SIZE,
    height: SIZE,
    position: 'relative',
  },
  // Sequential zone dots on outer ring
  zoneDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Inner ring decorative overlay
  innerRingOverlay: {
    position: 'absolute',
    left: CENTER - RING_INNER - 1,
    top: CENTER - RING_INNER - 1,
    width: (RING_INNER + 1) * 2,
    height: (RING_INNER + 1) * 2,
    borderRadius: RING_INNER + 1,
    borderWidth: 0.8,
    borderColor: STICKER.sage,
  },
  // Middle ring decorative overlay
  midRingOverlay: {
    position: 'absolute',
    left: CENTER - RING_MID - 1,
    top: CENTER - RING_MID - 1,
    width: (RING_MID + 1) * 2,
    height: (RING_MID + 1) * 2,
    borderRadius: RING_MID + 1,
    borderWidth: 0.8,
    borderColor: STICKER.sage,
  },
  // Outer breathing ring overlay
  ringOverlay: {
    position: 'absolute',
    left: CENTER - RING_OUTER - 2,
    top: CENTER - RING_OUTER - 2,
    width: (RING_OUTER + 2) * 2,
    height: (RING_OUTER + 2) * 2,
    borderRadius: RING_OUTER + 2,
    borderWidth: 1,
    borderColor: Colors.primaryFaded,
  },
  // Center orb (breathing glow) — inner
  centerOrb: {
    position: 'absolute',
    left: CENTER - 38,
    top: CENTER - 38,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: STICKER.cream,
  },
  // Center orb — outer diffuse glow
  centerOrbOuter: {
    position: 'absolute',
    left: CENTER - 52,
    top: CENTER - 52,
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: STICKER.cream,
  },
  // Center touchable area
  centerTouchable: {
    position: 'absolute',
    left: CENTER - 42,
    top: CENTER - 42,
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  // Center text
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 8,
    letterSpacing: 2,
  },
  centerPhase: {
    fontSize: 10,
    marginTop: 1,
  },
  centerStep: {
    fontSize: 11,
    marginTop: 1,
  },
  // Node positioning base
  nodeBase: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCompleted: {
    ...Shadows.sm,
  },
  nodeActive: {
    borderWidth: 2.5,
    ...Shadows.subtle,
  },
  nodeLocked: {
    backgroundColor: Colors.primaryFaded,
    opacity: 0.5,
  },
  activePulseRing: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  activeInnerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nodeLabel: {
    position: 'absolute',
    bottom: -16,
    width: 30,
    textAlign: 'center',
  },
  currentStepRow: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
});
