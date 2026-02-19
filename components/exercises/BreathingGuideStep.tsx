/**
 * BreathingGuideStep — Animated breathing circle with co-regulation.
 *
 * Renders an expanding/contracting circle that guides the user
 * through inhale-hold-exhale cycles. The circle color shifts
 * from activated (warm) to calm (cool) over the course of all cycles.
 *
 * Response captured as JSON: { completed: true, cycles: 10 }
 *
 * Usage inside ExerciseFlow's StepRenderer:
 *   case 'breathing_guide':
 *     return (
 *       <>
 *         {previousResponses.length > 0 && <PreviousResponses ... />}
 *         <BreathingGuideStep step={step} value={value} onChangeText={onChangeText} />
 *       </>
 *     );
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { ExerciseStep } from '@/types/intervention';
import type { BreathingGuideConfig } from '@/types/interactive-step-types';
import { CheckmarkIcon } from '@/assets/graphics/icons';

// ─── Haptics ────────────────────────────────────────────
let triggerHaptic: (style?: string) => void = () => {};
try {
  const Haptics = require('expo-haptics');
  triggerHaptic = (style = 'Light') => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle[style] ?? Haptics.ImpactFeedbackStyle.Light
    );
  };
} catch {}

interface BreathingGuideStepProps {
  step: ExerciseStep;
  value?: string;
  onChangeText?: (text: string) => void;
}

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete';

// ─── Color interpolation helper ─────────────────────────
function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  const hex = (c: string) => parseInt(c, 16);
  const r1 = hex(color1.slice(1, 3));
  const g1 = hex(color1.slice(3, 5));
  const b1 = hex(color1.slice(5, 7));
  const r2 = hex(color2.slice(1, 3));
  const g2 = hex(color2.slice(3, 5));
  const b2 = hex(color2.slice(5, 7));
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function BreathingGuideStep({
  step,
  value,
  onChangeText,
}: BreathingGuideStepProps) {
  const config = step.interactiveConfig as BreathingGuideConfig | undefined;
  const pattern = config?.pattern ?? { inhale: 4, exhale: 6 };
  const totalCycles = config?.cycles ?? 6;
  const colorStart = config?.colorShift?.start ?? '#E07A5F';
  const colorEnd = config?.colorShift?.end ?? '#8F9E8B';

  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phaseTimer, setPhaseTimer] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Restore completed state
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (parsed.completed) {
          setPhase('complete');
          setCurrentCycle(totalCycles);
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serialize = useCallback(
    (completed: boolean, cycles: number) => {
      return JSON.stringify({ completed, cycles });
    },
    []
  );

  // Phase duration in seconds
  const getPhaseDuration = (p: BreathPhase): number => {
    switch (p) {
      case 'inhale':
        return pattern.inhale;
      case 'hold':
        return pattern.hold ?? 0;
      case 'exhale':
        return pattern.exhale;
      default:
        return 0;
    }
  };

  // Animate circle based on phase
  useEffect(() => {
    if (phase === 'inhale') {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: pattern.inhale * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: pattern.inhale * 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (phase === 'exhale') {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.6,
          duration: pattern.exhale * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: pattern.exhale * 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (phase === 'complete') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [phase, scaleAnim, opacityAnim, pulseAnim, pattern]);

  // Phase progression timer
  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') return;

    const duration = getPhaseDuration(phase);
    if (duration === 0 && phase === 'hold') {
      // Skip hold if not configured
      setPhase('exhale');
      setPhaseTimer(pattern.exhale);
      return;
    }

    setPhaseTimer(duration);

    const interval = setInterval(() => {
      setPhaseTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Advance phase
          if (phase === 'inhale') {
            if (pattern.hold && pattern.hold > 0) {
              setPhase('hold');
            } else {
              setPhase('exhale');
            }
          } else if (phase === 'hold') {
            setPhase('exhale');
          } else if (phase === 'exhale') {
            const nextCycle = currentCycle + 1;
            setCurrentCycle(nextCycle);
            triggerHaptic('Light');
            if (nextCycle >= totalCycles) {
              setPhase('complete');
              triggerHaptic('Medium');
              onChangeText?.(serialize(true, nextCycle));
            } else {
              setPhase('inhale');
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleStart = () => {
    triggerHaptic('Medium');
    setPhase('inhale');
    setCurrentCycle(0);
    setPhaseTimer(pattern.inhale);
    scaleAnim.setValue(0.6);
    opacityAnim.setValue(0.4);
  };

  const handleRestart = () => {
    setPhase('idle');
    setCurrentCycle(0);
    scaleAnim.setValue(0.6);
    opacityAnim.setValue(0.4);
    pulseAnim.setValue(1);
  };

  // Current color based on progress
  const progress = totalCycles > 0 ? currentCycle / totalCycles : 0;
  const currentColor = interpolateColor(colorStart, colorEnd, progress);

  const phaseLabel =
    phase === 'inhale'
      ? 'Breathe in...'
      : phase === 'hold'
        ? 'Hold...'
        : phase === 'exhale'
          ? 'Breathe out...'
          : phase === 'complete'
            ? 'Complete'
            : 'Tap to begin';

  if (!config) {
    return (
      <View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.content}>{step.content}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title + content */}
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.content}>{step.content}</Text>

      {/* Breathing circle */}
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.outerRing,
            {
              borderColor: currentColor + '30',
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.circle,
              {
                backgroundColor: currentColor,
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {phase === 'complete' ? (
              <CheckmarkIcon size={48} color={Colors.textOnPrimary} />
            ) : (
              <>
                <Text style={styles.phaseLabel}>{phaseLabel}</Text>
                {phase !== 'idle' && (
                  <Text style={styles.timerText}>{phaseTimer}</Text>
                )}
              </>
            )}
          </Animated.View>
        </Animated.View>
      </View>

      {/* Cycle counter */}
      <View style={styles.cycleRow}>
        {Array.from({ length: totalCycles }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.cycleDot,
              i < currentCycle && {
                backgroundColor: interpolateColor(
                  colorStart,
                  colorEnd,
                  i / totalCycles
                ),
              },
            ]}
          />
        ))}
      </View>
      <Text style={styles.cycleLabel}>
        {phase === 'complete'
          ? `${totalCycles} breaths complete`
          : phase === 'idle'
            ? `${totalCycles} breath cycles`
            : `Breath ${currentCycle + 1} of ${totalCycles}`}
      </Text>

      {/* Start / Restart button */}
      {phase === 'idle' && (
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: currentColor }]}
          onPress={handleStart}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>BEGIN</Text>
        </TouchableOpacity>
      )}

      {phase === 'complete' && (
        <TouchableOpacity
          style={styles.restartButton}
          onPress={handleRestart}
          activeOpacity={0.7}
        >
          <Text style={styles.restartButtonText}>Start Over</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  content: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  // Circle
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginVertical: Spacing.md,
  },
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: {
    fontSize: 16,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textOnPrimary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  timerText: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.textOnPrimary,
    marginTop: 4,
  },

  // Cycle dots
  cycleRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  cycleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.borderLight,
  },
  cycleLabel: {
    fontSize: FontSizes.caption,
    fontFamily: 'Jost_500Medium',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },

  // Buttons
  startButton: {
    paddingHorizontal: Spacing.xl + Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.sm,
  },
  startButtonText: {
    fontSize: 15,
    fontFamily: 'Jost_600SemiBold',
    color: Colors.textOnPrimary,
    letterSpacing: 2,
  },
  restartButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  restartButtonText: {
    fontSize: 13,
    fontFamily: 'Jost_500Medium',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textDecorationLine: 'underline',
  },
});
