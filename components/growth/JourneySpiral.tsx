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
  // Breathing animation for center orb
  const breatheAnim = useRef(new Animated.Value(0.85)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;
  // Pulse for active step node
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Center breathing
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, { toValue: 1.05, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breatheAnim, { toValue: 0.85, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.45, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.2, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    // Active node pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    breathe.start();
    glow.start();
    pulse.start();
    return () => { breathe.stop(); glow.stop(); pulse.stop(); };
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

        {/* Center breathing orb — absolute positioned over SVG */}
        <Animated.View
          style={[
            styles.centerOrb,
            { transform: [{ scale: breatheAnim }], opacity: glowAnim },
          ]}
        />
        <View style={styles.centerContent}>
          <TenderText variant="label" color={Colors.textMuted} align="center">
            YOUR JOURNEY
          </TenderText>
          {currentPhase && (
            <TenderText
              variant="caption"
              color={currentPhase.color}
              align="center"
              style={{ marginTop: 2 }}
            >
              {currentPhase.name}
            </TenderText>
          )}
          <TenderText
            variant="body"
            color={Colors.text}
            align="center"
            style={{ marginTop: 2 }}
            numberOfLines={2}
          >
            Step {currentStep}
          </TenderText>
        </View>

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
  // Center orb (breathing glow)
  centerOrb: {
    position: 'absolute',
    left: CENTER - 42,
    top: CENTER - 42,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primaryFaded,
  },
  centerContent: {
    position: 'absolute',
    left: CENTER - 50,
    top: CENTER - 30,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
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
