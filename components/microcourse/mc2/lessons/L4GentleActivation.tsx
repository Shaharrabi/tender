/**
 * L4: Gentle Activation — Screen Brightening + 7-Step Sequence
 *
 * For hypoarousal (shutdown). The screen starts dim and brightens with
 * each activation step completed. 7 steps working from extremities inward.
 *
 * Uses an overlay opacity that decreases as the user completes steps,
 * creating the effect of "waking up" and coming back online.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
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
import { MC2_PALETTE } from '@/constants/mc2Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface ActivationStep {
  id: number;
  instruction: string;
  emoji: string;
  bodyPart: string;
}

const STEPS: ActivationStep[] = [
  { id: 1, instruction: 'Wiggle your toes. Press your feet into the floor.', emoji: '🦶', bodyPart: 'Feet' },
  { id: 2, instruction: 'Squeeze your calves gently, then release.', emoji: '🦵', bodyPart: 'Calves' },
  { id: 3, instruction: 'Press your thighs against your chair.', emoji: '🪑', bodyPart: 'Thighs' },
  { id: 4, instruction: 'Squeeze your hands into fists. Hold 5 seconds. Release.', emoji: '✊', bodyPart: 'Hands' },
  { id: 5, instruction: 'Roll your shoulders up, back, and down.', emoji: '💪', bodyPart: 'Shoulders' },
  { id: 6, instruction: 'Gently turn your head left and right, slowly.', emoji: '🔄', bodyPart: 'Neck' },
  { id: 7, instruction: 'Take one deep breath with a long, audible exhale.', emoji: '💨', bodyPart: 'Breath' },
];

type LessonPhase = 'intro' | 'active' | 'done';

interface L4GentleActivationProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L4GentleActivation({
  content,
  attachmentStyle,
  onComplete,
}: L4GentleActivationProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<LessonPhase>('intro');
  const [currentStep, setCurrentStep] = useState(0);

  // Overlay opacity: starts at 0.4, decreases to 0 as steps are completed
  const overlayOpacity = useRef(new Animated.Value(0.4)).current;
  // Card fade for each step
  const stepFade = useRef(new Animated.Value(0)).current;

  const handleStart = useCallback(() => {
    haptics.playLessonStart();
    setPhase('active');
    // Fade in first step
    stepFade.setValue(0);
    Animated.timing(stepFade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [haptics, stepFade]);

  const handleStepDone = useCallback(() => {
    haptics.tap();

    const nextStep = currentStep + 1;

    // Brighten screen (reduce overlay)
    Animated.timing(overlayOpacity, {
      toValue: Math.max(0, 0.4 - (nextStep / STEPS.length) * 0.4),
      duration: 500,
      useNativeDriver: true,
    }).start();

    if (nextStep >= STEPS.length) {
      // All steps done
      haptics.success();
      setPhase('done');
    } else {
      setCurrentStep(nextStep);
      // Fade in new step card
      stepFade.setValue(0);
      Animated.timing(stepFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [currentStep, haptics, overlayOpacity, stepFade]);

  const handleContinue = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Gentle activation sequence',
        response: `Completed ${currentStep >= STEPS.length ? 'all 7' : `${currentStep} of 7`} activation steps`,
        type: 'activation-sequence',
      },
    ];
    onComplete(responses);
  }, [haptics, currentStep, onComplete]);

  // ─── INTRO ─────────────────────────
  if (phase === 'intro') {
    return (
      <View style={styles.dimContainer}>
        <Animated.View
          style={[styles.dimOverlay, { opacity: overlayOpacity }]}
        />
        <View style={styles.introInner}>
          <Text style={styles.title}>WAKING UP</Text>

          <View style={styles.introCard}>
            <Text style={styles.introText}>
              When your system has gone offline {'\u2014'} numb, foggy, flat {'\u2014'}{' '}
              calming won't help. You need gentle activation.
            </Text>
            <Text style={styles.introHighlight}>
              Start from your extremities. Work inward.
            </Text>
            <Text style={styles.introText}>
              Each step brings you back a little more.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.7}
          >
            <Text style={styles.startButtonText}>BEGIN SEQUENCE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── ACTIVE ────────────────────────
  if (phase === 'active') {
    const step = STEPS[currentStep];
    return (
      <View style={styles.dimContainer}>
        <Animated.View
          style={[styles.dimOverlay, { opacity: overlayOpacity }]}
        />
        <View style={styles.activeInner}>
          {/* Progress dots */}
          <View style={styles.progressDots}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < currentStep && styles.dotDone,
                  i === currentStep && styles.dotCurrent,
                ]}
              />
            ))}
          </View>

          {/* Step card */}
          <Animated.View style={[styles.stepCard, { opacity: stepFade }]}>
            <Text style={styles.stepEmoji}>{step.emoji}</Text>
            <Text style={styles.stepBodyPart}>{step.bodyPart.toUpperCase()}</Text>
            <Text style={styles.stepInstruction}>{step.instruction}</Text>
          </Animated.View>

          {/* Done button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleStepDone}
            activeOpacity={0.7}
          >
            <Text style={styles.doneButtonText}>
              {currentStep < STEPS.length - 1 ? 'DONE \u2014 NEXT' : 'DONE'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.counter}>
            {currentStep + 1} of {STEPS.length}
          </Text>
        </View>
      </View>
    );
  }

  // ─── DONE ──────────────────────────
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.doneContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.doneEmoji}>{'☀️'}</Text>
      <Text style={styles.title}>BACK ONLINE</Text>

      <View style={styles.insightCard}>
        <Text style={styles.insightText}>
          You are not forcing yourself to feel.{'\n'}
          You are inviting your body to come back.{'\n'}
          Gently. At its own pace.
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
  dimContainer: {
    flex: 1,
    backgroundColor: '#E8E6E1',
    position: 'relative',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  introInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    zIndex: 1,
  },
  activeInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    zIndex: 1,
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

  // ─── Progress dots ──────────────────
  progressDots: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xxxl,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotDone: {
    backgroundColor: MC2_PALETTE.sage,
  },
  dotCurrent: {
    backgroundColor: MC2_PALETTE.gold,
    width: 20,
  },

  // ─── Step card ──────────────────────
  stepCard: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    width: '100%',
    alignItems: 'center',
    ...Shadows.subtle,
    gap: Spacing.sm,
  },
  stepEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  stepBodyPart: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.textMuted,
  },
  stepInstruction: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    lineHeight: 26,
    color: Colors.text,
    textAlign: 'center',
  },

  // ─── Done button ────────────────────
  doneButton: {
    marginTop: Spacing.lg,
    backgroundColor: MC2_PALETTE.sage,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    ...Shadows.subtle,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    fontSize: FontSizes.bodySmall,
    letterSpacing: 2,
  },
  counter: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },

  // ─── Done screen ────────────────────
  doneContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  doneEmoji: {
    fontSize: 48,
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
