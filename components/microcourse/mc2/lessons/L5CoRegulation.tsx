/**
 * L5: Co-Regulation — Your Partner as Home Base
 *
 * Intro → Mode select (partner/solo) → 2-min guided practice with
 * visual heartbeat pulse + expanding safety glow → Done.
 *
 * Dark background for the active practice to feel intimate/meditative.
 * Heart pulses at ~60 BPM. Safety glow slowly expands over 2 minutes.
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
import {
  HeartPulseIcon,
  CoupleIcon,
  PersonIcon,
} from '@/assets/graphics/icons';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const CO_REG_DURATION = 120; // 2 minutes

type PracticeMode = 'partner' | 'solo';
type LessonPhase = 'intro' | 'mode_select' | 'active' | 'done';

interface L5CoRegulationProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L5CoRegulation({
  content,
  attachmentStyle,
  onComplete,
}: L5CoRegulationProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<LessonPhase>('intro');
  const [mode, setMode] = useState<PracticeMode | null>(null);
  const [timeLeft, setTimeLeft] = useState(CO_REG_DURATION);

  // Animations
  const heartScale = useRef(new Animated.Value(1)).current;
  const glowSize = useRef(new Animated.Value(100)).current;
  const glowOpacity = useRef(new Animated.Value(0.15)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const elapsedRef = useRef(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleShowModes = useCallback(() => {
    haptics.tap();
    setPhase('mode_select');
    fadeIn.setValue(0);
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [haptics, fadeIn]);

  const startPractice = useCallback(
    (selectedMode: PracticeMode) => {
      setMode(selectedMode);
      haptics.playLessonStart();
      setPhase('active');
      elapsedRef.current = 0;

      // Heart pulse animation (~60 BPM = 1 beat per second)
      const runHeartbeat = () => {
        heartAnimRef.current = Animated.sequence([
          Animated.timing(heartScale, {
            toValue: 1.15,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(heartScale, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]);
        heartAnimRef.current.start(({ finished }) => {
          if (finished) runHeartbeat();
        });
      };
      runHeartbeat();

      // Safety glow slowly expands
      Animated.parallel([
        Animated.timing(glowSize, {
          toValue: 280,
          duration: CO_REG_DURATION * 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.4,
          duration: CO_REG_DURATION * 1000,
          useNativeDriver: false,
        }),
      ]).start();

      // Timer
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        const remaining = CO_REG_DURATION - elapsedRef.current;
        setTimeLeft(remaining);

        // Heartbeat haptic every 3 seconds
        if (elapsedRef.current % 3 === 0) {
          haptics.tapSoft();
        }

        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (heartAnimRef.current) heartAnimRef.current.stop();

          Animated.timing(heartScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();

          haptics.success();
          setPhase('done');
        }
      }, 1000);
    },
    [haptics, heartScale, glowSize, glowOpacity]
  );

  const handleContinue = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Co-regulation practice',
        response: `Completed 2-minute co-regulation practice (${mode || 'solo'} mode)`,
        type: 'co-regulation',
      },
      {
        step: 2,
        prompt: 'Practice mode',
        response: mode === 'partner' ? 'With partner' : 'Solo practice',
        type: 'mode-selection',
      },
    ];
    onComplete(responses);
  }, [haptics, mode, onComplete]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ─── INTRO ─────────────────────────
  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.centeredContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>CO-REGULATION</Text>

        <View style={styles.introCard}>
          <Text style={styles.introText}>
            You are wired to regulate through connection. When your partner is
            calm and present, their nervous system sends signals to yours: safe,
            safe, safe.
          </Text>
          <Text style={styles.introHighlight}>
            This is the couple bubble. Not a metaphor — a physiological reality.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleShowModes}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>LET'S PRACTICE</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── MODE SELECT ───────────────────
  if (phase === 'mode_select') {
    return (
      <Animated.View style={[styles.centeredFull, { opacity: fadeIn }]}>
        <Text style={styles.title}>CHOOSE YOUR MODE</Text>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => startPractice('partner')}
          activeOpacity={0.7}
        >
          <View style={styles.modeIconWrap}>
            <CoupleIcon size={40} color={Colors.primary} />
          </View>
          <Text style={styles.modeTitle}>With Partner</Text>
          <Text style={styles.modeDesc}>
            Sit facing each other. Hand on heart. Breathe together.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => startPractice('solo')}
          activeOpacity={0.7}
        >
          <View style={styles.modeIconWrap}>
            <PersonIcon size={40} color={Colors.primary} />
          </View>
          <Text style={styles.modeTitle}>Solo Practice</Text>
          <Text style={styles.modeDesc}>
            Hand on your own chest. Breathe slowly. Imagine safety.
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // ─── ACTIVE ────────────────────────
  if (phase === 'active') {
    return (
      <View style={styles.darkContainer}>
        {/* Expanding safety glow */}
        <Animated.View
          style={[
            styles.glow,
            {
              width: glowSize,
              height: glowSize,
              borderRadius: Animated.divide(glowSize, 2),
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Heart pulse */}
        <Animated.View
          style={[styles.heartContainer, { transform: [{ scale: heartScale }] }]}
        >
          <HeartPulseIcon size={72} color="rgba(255,255,255,0.85)" />
        </Animated.View>

        <View style={styles.activeTextBlock}>
          <Text style={styles.activeInstruction}>
            {mode === 'partner'
              ? 'Breathe together.\nNo talking. Just presence.'
              : 'Hand on your chest.\nBreathe slowly. You are here.'}
          </Text>

          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        </View>
      </View>
    );
  }

  // ─── DONE ──────────────────────────
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.centeredContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.doneIconWrap}>
        <HeartPulseIcon size={48} color={Colors.primary} />
      </View>
      <Text style={styles.title}>BEAUTIFUL</Text>

      <View style={styles.insightCard}>
        <Text style={styles.insightText}>
          Bodies before words. This practice does more for your nervous system
          in two minutes than twenty minutes of talking about the problem.
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
  centeredContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  centeredFull: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  startButton: {
    marginTop: Spacing.xl,
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

  // ─── Mode cards ─────────────────────
  modeCard: {
    width: '100%',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.xs,
  },
  modeIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  modeTitle: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
  },
  modeDesc: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ─── Active (dark) ──────────────────
  darkContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.depth,
  },
  glow: {
    position: 'absolute',
    backgroundColor: MC2_PALETTE.sage,
  },
  heartContainer: {
    zIndex: 1,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTextBlock: {
    zIndex: 1,
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  activeInstruction: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
  },
  timer: {
    fontSize: 36,
    fontWeight: '200',
    fontFamily: FontFamilies.accent,
    color: 'rgba(255,255,255,0.45)',
    marginTop: Spacing.lg,
    fontVariant: ['tabular-nums'],
  },

  // ─── Done ───────────────────────────
  doneIconWrap: {
    marginBottom: Spacing.md,
  },
  insightCard: {
    marginTop: Spacing.md,
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
