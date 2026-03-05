/**
 * L3: Breathing Circle — Guided Breathing with Expanding Circle
 *
 * Intro → 2-min guided breathing (4s in, 1s hold, 6s out = 11s cycle) → Reflect.
 * Circle expands/contracts with breath. Background color shifts warm→cool
 * over the full 2 minutes to represent calming.
 *
 * Uses RN Animated (not Reanimated) for broad compatibility.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { MC2_PALETTE } from '@/constants/mc2Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import { LeafIcon } from '@/assets/graphics/icons';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const TOTAL_SECONDS = 120; // 2 minutes
const CYCLE_LENGTH = 11; // 4s in + 1s hold + 6s out

type BreathPhase = 'in' | 'hold' | 'out';
type LessonPhase = 'intro' | 'breathing' | 'done';

interface L3BreathingCircleProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L3BreathingCircle({
  content,
  attachmentStyle,
  onComplete,
}: L3BreathingCircleProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<LessonPhase>('intro');
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('in');

  // Animations
  const circleScale = useRef(new Animated.Value(1)).current;
  const bgProgress = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const elapsedRef = useRef(0);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startBreathing = useCallback(() => {
    haptics.playLessonStart();
    setPhase('breathing');
    elapsedRef.current = 0;

    // Background color transition over full duration
    Animated.timing(bgProgress, {
      toValue: 1,
      duration: TOTAL_SECONDS * 1000,
      useNativeDriver: false,
    }).start();

    // Start breath cycle animation
    const runBreathCycle = () => {
      breathAnimRef.current = Animated.sequence([
        // Inhale: 4 seconds
        Animated.timing(circleScale, {
          toValue: 1.5,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        // Hold: 1 second
        Animated.delay(1000),
        // Exhale: 6 seconds
        Animated.timing(circleScale, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
      breathAnimRef.current.start(({ finished }) => {
        if (finished) runBreathCycle();
      });
    };
    runBreathCycle();

    // Timer tick
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      const remaining = TOTAL_SECONDS - elapsedRef.current;
      setTimeLeft(remaining);

      // Determine breath phase
      const cyclePos = elapsedRef.current % CYCLE_LENGTH;
      if (cyclePos < 4) setBreathPhase('in');
      else if (cyclePos < 5) setBreathPhase('hold');
      else setBreathPhase('out');

      // Removed periodic sound/haptic pulse — just the visual circle

      if (remaining <= 0) {
        // Done!
        if (timerRef.current) clearInterval(timerRef.current);
        if (breathAnimRef.current) breathAnimRef.current.stop();

        Animated.timing(circleScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();

        haptics.success();
        setPhase('done');
      }
    }, 1000);
  }, [haptics, circleScale, bgProgress]);

  const handleContinue = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Breathing practice',
        response: 'Completed 2-minute guided breathing (4s in, 1s hold, 6s out)',
        type: 'breathing-exercise',
      },
    ];
    onComplete(responses);
  }, [haptics, onComplete]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const breathLabel =
    breathPhase === 'in'
      ? 'BREATHE IN'
      : breathPhase === 'hold'
        ? 'HOLD'
        : 'BREATHE OUT';

  // ─── INTRO ─────────────────────────
  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.introContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>GROUNDING PRACTICE</Text>

        <View style={styles.introCard}>
          <Text style={styles.introText}>
            When your system is activated {'\u2014'} heart racing, chest tight, thoughts
            spiraling {'\u2014'} this breathing pattern brings you back.
          </Text>
          <Text style={styles.introHighlight}>
            Inhale 4 seconds. Hold 1. Exhale 6.
          </Text>
          <Text style={styles.introText}>
            The long exhale activates your calming system.
          </Text>
        </View>

        <Text style={styles.durationText}>2 minutes. That's all.</Text>

        <TouchableOpacity
          style={styles.startButton}
          onPress={startBreathing}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>BEGIN BREATHING</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── BREATHING ─────────────────────
  if (phase === 'breathing') {
    const bgColor = bgProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [MC2_PALETTE.warmCoral + '12', MC2_PALETTE.coolBlue + '15'],
    });

    return (
      <Animated.View style={[styles.breathingContainer, { backgroundColor: bgColor }]}>
        {/* Expanding/contracting circle */}
        <Animated.View
          style={[
            styles.breathCircle,
            { transform: [{ scale: circleScale }] },
          ]}
        >
          <View style={styles.breathCircleInner}>
            <Text style={styles.breathLabel}>{breathLabel}</Text>
          </View>
        </Animated.View>

        {/* Timer */}
        <View style={styles.timerSection}>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>remaining</Text>
        </View>

        {/* Breath phase indicator */}
        <View style={styles.phaseIndicator}>
          <View
            style={[
              styles.phaseDot,
              breathPhase === 'in' && styles.phaseDotActive,
            ]}
          />
          <View
            style={[
              styles.phaseDot,
              breathPhase === 'hold' && styles.phaseDotActive,
            ]}
          />
          <View
            style={[
              styles.phaseDot,
              breathPhase === 'out' && styles.phaseDotActive,
            ]}
          />
        </View>
      </Animated.View>
    );
  }

  // ─── DONE ──────────────────────────
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.doneContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.doneIconWrap}>
        <LeafIcon size={40} color={MC2_PALETTE.sage} />
      </View>
      <Text style={styles.title}>WELL DONE</Text>

      <View style={styles.insightCard}>
        <Text style={styles.insightText}>
          One physiological sigh can measurably reduce your heart rate. Two
          minutes of this resets your entire nervous system.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        activeOpacity={0.7}
      >
        <Text style={styles.continueButtonText}>Continue to Reflection</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  introContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  introCard: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.md,
    width: '100%',
  },
  introText: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    lineHeight: 24,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  introHighlight: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: MC2_PALETTE.sage,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  durationText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.lg,
  },
  startButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.text,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    ...Shadows.subtle,
  },
  startButtonText: {
    color: Colors.background,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    fontSize: FontSizes.body,
    letterSpacing: 2,
  },

  // ─── Breathing ──────────────────────
  breathingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  breathCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: MC2_PALETTE.sage + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathCircleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: MC2_PALETTE.sage + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathLabel: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 2,
    textAlign: 'center',
  },
  timerSection: {
    marginTop: Spacing.xxxl,
    alignItems: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: '200',
    color: Colors.text,
    fontVariant: ['tabular-nums'],
    fontFamily: FontFamilies.accent,
  },
  timerLabel: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: Spacing.xs,
  },
  phaseIndicator: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  phaseDotActive: {
    backgroundColor: MC2_PALETTE.sage,
    width: 20,
  },

  // ─── Done ───────────────────────────
  doneContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  doneIconWrap: {
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  insightCard: {
    marginTop: Spacing.lg,
    backgroundColor: MC2_PALETTE.sage + '15',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: MC2_PALETTE.sage,
    width: '100%',
  },
  insightText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: MC2_PALETTE.sage,
    fontStyle: 'italic',
    lineHeight: 22,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    ...Shadows.subtle,
  },
  continueButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
});
