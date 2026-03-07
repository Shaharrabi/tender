/**
 * JourneySpiral — Circular 12-step journey visualization.
 *
 * Renders 12 step nodes arranged in a circle with phase-colored arcs,
 * a breathing center orb, and the current step info.
 * Tapping a node navigates to that step's detail page.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, FontFamilies, FontSizes, Shadows, BorderRadius } from '@/constants/theme';
import { HEALING_PHASES, getStep, getPhaseForStep } from '@/utils/steps/twelve-steps';
import { CheckmarkIcon } from '@/assets/graphics/icons';

// ─── Layout constants ────────────────────────────────────

const SIZE = 260;                   // SVG canvas
const CENTER = SIZE / 2;            // 130
const RING_RADIUS = 100;            // Where nodes sit
const NODE_R = 14;                  // Completed/active node radius
const NODE_R_SMALL = 8;             // Locked node radius
const ARC_WIDTH = 4;                // Phase arc stroke width

// Each step sits at (360/12 * i) degrees, starting from top (-90°)
function nodePosition(index: number) {
  const angle = ((index * 30) - 90) * (Math.PI / 180);
  return {
    x: CENTER + RING_RADIUS * Math.cos(angle),
    y: CENTER + RING_RADIUS * Math.sin(angle),
  };
}

// SVG arc path between two angles on the ring
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

// ─── Props ───────────────────────────────────────────────

interface JourneySpiralProps {
  /** Current active step number (1-based) */
  currentStep: number;
  /** Called when user taps an unlocked step node */
  onStepPress: (stepNumber: number) => void;
}

// ─── Component ───────────────────────────────────────────

export default function JourneySpiral({ currentStep, onStepPress }: JourneySpiralProps) {
  // ── Breathing animations ──
  // Center orb scale — slow, organic breathing
  const breatheScale = useRef(new Animated.Value(0.92)).current;
  // Center orb glow opacity
  const glowOpacity = useRef(new Animated.Value(0.15)).current;
  // Ring guide opacity — subtle pulse
  const ringPulse = useRef(new Animated.Value(0.3)).current;
  // Active step node pulse
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Center text fade-breathe
  const textBreathe = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Center orb — slow inhale/exhale (4s cycle like real breathing)
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

    // Glow opacity — breathes with the orb but slightly offset
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

    // Ring guide — very subtle opacity pulse (slower, 6s)
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

    // Active node — gentle pulse (2.5s)
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

    // Center text — subtle opacity breathe synced with orb
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

    breathe.start();
    glow.start();
    ring.start();
    pulse.start();
    textBreath.start();

    return () => {
      breathe.stop();
      glow.stop();
      ring.stop();
      pulse.stop();
      textBreath.stop();
    };
  }, []);

  const currentStepData = getStep(currentStep);
  const currentPhase = getPhaseForStep(currentStep);

  return (
    <View style={styles.wrapper}>
      {/* SVG Ring — phase arcs behind nodes */}
      <View style={styles.svgContainer}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* Phase arcs — subtle colored rings behind each phase group */}
          {HEALING_PHASES.map((phase) => {
            const startDeg = (phase.stepRange[0] - 1) * 30;
            const endDeg = (phase.stepRange[1]) * 30;
            return (
              <Path
                key={phase.id}
                d={arcPath(startDeg, endDeg, RING_RADIUS)}
                fill="none"
                stroke={phase.color + '30'}
                strokeWidth={ARC_WIDTH}
                strokeLinecap="round"
              />
            );
          })}

          {/* Subtle ring guide */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RING_RADIUS}
            fill="none"
            stroke={Colors.primaryFaded}
            strokeWidth={1}
            opacity={0.4}
          />
        </Svg>

        {/* Breathing ring overlay — animates with the orb */}
        <Animated.View
          style={[
            styles.ringOverlay,
            { opacity: ringPulse },
          ]}
        />

        {/* Center breathing orb — absolute positioned over SVG */}
        <Animated.View
          style={[
            styles.centerOrb,
            {
              transform: [{ scale: breatheScale }],
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Second glow layer — larger, more diffuse */}
        <Animated.View
          style={[
            styles.centerOrbOuter,
            {
              transform: [{ scale: breatheScale }],
              opacity: Animated.multiply(glowOpacity, 0.4),
            },
          ]}
        />

        {/* Center text — breathes with the orb */}
        <Animated.View style={[styles.centerContent, { opacity: textBreathe }]}>
          <TenderText
            variant="label"
            color={Colors.textMuted}
            align="center"
            style={styles.centerLabel}
          >
            YOUR JOURNEY
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

        {/* Step nodes — absolute positioned */}
        {Array.from({ length: 12 }, (_, i) => {
          const stepNum = i + 1;
          const pos = nodePosition(i);
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
  // Breathing ring overlay
  ringOverlay: {
    position: 'absolute',
    left: CENTER - RING_RADIUS - 2,
    top: CENTER - RING_RADIUS - 2,
    width: (RING_RADIUS + 2) * 2,
    height: (RING_RADIUS + 2) * 2,
    borderRadius: RING_RADIUS + 2,
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
    backgroundColor: Colors.primaryFaded,
  },
  // Center orb — outer diffuse glow
  centerOrbOuter: {
    position: 'absolute',
    left: CENTER - 52,
    top: CENTER - 52,
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.primaryFaded,
  },
  // Center text — smaller, tighter
  centerContent: {
    position: 'absolute',
    left: CENTER - 42,
    top: CENTER - 22,
    width: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
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
