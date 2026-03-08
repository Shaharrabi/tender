/**
 * StepCompletionRitual — Full-screen animated overlay for step completion.
 *
 * 3 layers of celebration:
 *   1. Micro-completion (every step) — glow, question, affirmation
 *   2. Phase completion (steps 2/4/7/10) — phase badge + message
 *   3. Journey completion (step 12) — full ceremony
 *
 * Uses React Native Animated API for staged reveal sequence.
 * Matches JourneySpiral breathing aesthetic.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import TenderText from '@/components/ui/TenderText';
import CelebrationDots from '@/components/ui/CelebrationDots';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { getPhaseForStep } from '@/utils/steps/twelve-steps';
import {
  getStepCompletionContent,
  getPhaseCompletionContent,
  isPhaseEndingStep,
  isJourneyComplete,
  JOURNEY_COMPLETE_MESSAGE,
} from '@/constants/steps/completion-content';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import { saveReflection } from '@/services/steps';
import { useAuth } from '@/context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Props ──────────────────────────────────────────────

interface StepCompletionRitualProps {
  visible: boolean;
  stepNumber: number;
  onDismiss: () => void;
  onNextStep: () => void;
}

// ─── Component ──────────────────────────────────────────

export default function StepCompletionRitual({
  visible,
  stepNumber,
  onDismiss,
  onNextStep,
}: StepCompletionRitualProps) {
  const haptics = useSoundHaptics();
  const { user } = useAuth();

  // Journal reflection state
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Content
  const content = getStepCompletionContent(stepNumber);
  const phase = getPhaseForStep(stepNumber);
  const phaseContent = getPhaseCompletionContent(stepNumber);
  const isPhaseEnd = isPhaseEndingStep(stepNumber);
  const isJourneyEnd = isJourneyComplete(stepNumber);
  const phaseColor = phase?.color ?? Colors.primary;

  // Animation values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0)).current;
  const glowBreath = useRef(new Animated.Value(0.12)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const phaseOpacity = useRef(new Animated.Value(0)).current;
  const questionOpacity = useRef(new Animated.Value(0)).current;
  const questionTranslateY = useRef(new Animated.Value(15)).current;
  const affirmationOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const inputOpacity = useRef(new Animated.Value(0)).current;
  const skipOpacity = useRef(new Animated.Value(0)).current;
  const [dotsActive, setDotsActive] = useState(false);

  // Save reflection to journal
  const handleSaveReflection = async () => {
    if (!user || !reflectionText.trim()) return;
    try {
      await saveReflection(user.id, stepNumber, 99, reflectionText.trim()); // promptIndex 99 = completion reflection
      setReflectionSaved(true);
      haptics.playBadgeUnlock();
    } catch (err) {
      console.warn('[CompletionRitual] Failed to save reflection:', err);
    }
  };

  useEffect(() => {
    if (!visible) {
      // Reset all animations
      overlayOpacity.setValue(0);
      glowScale.setValue(0);
      glowBreath.setValue(0.12);
      titleOpacity.setValue(0);
      titleTranslateY.setValue(20);
      phaseOpacity.setValue(0);
      questionOpacity.setValue(0);
      questionTranslateY.setValue(15);
      affirmationOpacity.setValue(0);
      buttonOpacity.setValue(0);
      inputOpacity.setValue(0);
      skipOpacity.setValue(0);
      setDotsActive(false);
      setReflectionText('');
      setReflectionSaved(false);
      return;
    }

    // Fire haptics
    if (isJourneyEnd) {
      haptics.playConfetti();
    } else if (isPhaseEnd) {
      haptics.playLevelUp();
    } else {
      haptics.playBadgeUnlock();
    }

    // Staged animation sequence
    // 1. Overlay fades in (0-400ms)
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // 2. Glow circle springs in (100ms delay)
    setTimeout(() => {
      Animated.spring(glowScale, {
        toValue: 1,
        speed: 6,
        bounciness: 4,
        useNativeDriver: true,
      }).start();

      // Start breathing after spring settles
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowBreath, {
              toValue: 0.25,
              duration: 3000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(glowBreath, {
              toValue: 0.12,
              duration: 3000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 400);
    }, 100);

    // 3. Celebration dots (200ms delay)
    setTimeout(() => setDotsActive(true), 200);

    // 4. Title fades in + slides up (300ms delay)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // 5. Phase badge (600ms delay, only if phase ending)
    if (isPhaseEnd) {
      setTimeout(() => {
        Animated.timing(phaseOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 600);
    }

    // 6. Reflective question (900ms delay)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(questionOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(questionTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 900);

    // 7. Affirmation (1400ms delay)
    setTimeout(() => {
      Animated.timing(affirmationOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 1400);

    // 8. Reflection input (1200ms delay — appears soon after question)
    setTimeout(() => {
      Animated.timing(inputOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1200);

    // 9. Skip button (600ms — always visible early, no pressure)
    setTimeout(() => {
      Animated.timing(skipOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 600);

    // 10. Continue button (2200ms delay)
    setTimeout(() => {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 2200);
  }, [visible]);

  if (!visible) return null;

  const isLastStep = stepNumber === 12;
  const buttonLabel = isLastStep
    ? 'Return to Your Journey'
    : `Continue to Step ${stepNumber + 1} \u2192`;

  const handleContinue = () => {
    if (isLastStep) {
      onDismiss();
    } else {
      onNextStep();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        {/* Glow circle — breathing in phase color */}
        <Animated.View
          style={[
            styles.glowCircle,
            {
              backgroundColor: phaseColor,
              opacity: glowBreath,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        {/* Second glow — larger, more diffuse */}
        <Animated.View
          style={[
            styles.glowCircleOuter,
            {
              backgroundColor: phaseColor,
              opacity: Animated.multiply(glowBreath, 0.4),
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        {/* Celebration dots */}
        <View style={styles.dotsContainer}>
          <CelebrationDots active={dotsActive} />
        </View>

        {/* Content stack */}
        <View style={styles.contentContainer}>
          {/* Step Complete title */}
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            }}
          >
            <TenderText
              variant="label"
              color="rgba(255,255,255,0.6)"
              align="center"
              style={styles.stepLabel}
            >
              {isJourneyEnd ? 'JOURNEY COMPLETE' : `STEP ${stepNumber}`}
            </TenderText>
            <TenderText variant="headingM" color={Colors.white} align="center">
              {isJourneyEnd ? 'You Did It' : 'Complete'}
            </TenderText>
          </Animated.View>

          {/* Phase completion badge */}
          {isPhaseEnd && phaseContent && (
            <Animated.View style={[styles.phaseBadge, { opacity: phaseOpacity }]}>
              <View style={[styles.phasePill, { backgroundColor: phaseColor + '30' }]}>
                <TenderText variant="label" color={phaseColor} align="center">
                  {phaseContent.message}
                </TenderText>
              </View>
              {isJourneyEnd && (
                <TenderText
                  variant="caption"
                  color="rgba(255,255,255,0.7)"
                  align="center"
                  style={styles.journeyMessage}
                >
                  {JOURNEY_COMPLETE_MESSAGE}
                </TenderText>
              )}
              {!isJourneyEnd && (
                <TenderText
                  variant="caption"
                  color="rgba(255,255,255,0.6)"
                  align="center"
                  style={styles.phaseSummary}
                >
                  {phaseContent.summary}
                </TenderText>
              )}
            </Animated.View>
          )}

          {/* Reflective question */}
          <Animated.View
            style={{
              opacity: questionOpacity,
              transform: [{ translateY: questionTranslateY }],
              marginTop: Spacing.xl,
            }}
          >
            <TenderText
              variant="body"
              color="rgba(255,255,255,0.85)"
              align="center"
              style={styles.question}
            >
              {content.reflectionQuestion}
            </TenderText>
          </Animated.View>

          {/* Journal reflection input — optional, no pressure */}
          <Animated.View style={{ opacity: inputOpacity, marginTop: Spacing.md, width: '100%' }}>
            {reflectionSaved ? (
              <View style={styles.reflectionSavedBadge}>
                <TenderText variant="caption" color={phaseColor} align="center">
                  ✦ Saved to your journal
                </TenderText>
              </View>
            ) : (
              <View style={styles.reflectionInputWrap}>
                <TextInput
                  style={styles.reflectionInput}
                  placeholder="What shifted for you? (optional)"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={reflectionText}
                  onChangeText={setReflectionText}
                  multiline
                  maxLength={500}
                  returnKeyType="done"
                  blurOnSubmit
                />
                {reflectionText.trim().length > 0 && (
                  <TouchableOpacity
                    style={[styles.saveReflectionButton, { backgroundColor: phaseColor + '40' }]}
                    onPress={handleSaveReflection}
                    activeOpacity={0.7}
                  >
                    <TenderText variant="caption" color={Colors.white} align="center">
                      Save to journal
                    </TenderText>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Animated.View>

          {/* Affirmation */}
          <Animated.View style={{ opacity: affirmationOpacity, marginTop: Spacing.lg }}>
            <TenderText
              variant="body"
              color={phaseColor}
              align="center"
              style={styles.affirmation}
            >
              {content.affirmation}
            </TenderText>
          </Animated.View>

          {/* Skip / Continue buttons */}
          <Animated.View style={{ opacity: skipOpacity, marginTop: Spacing.sm }}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleContinue}
              activeOpacity={0.7}
            >
              <TenderText variant="caption" color="rgba(255,255,255,0.45)" align="center">
                Skip →
              </TenderText>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: buttonOpacity, marginTop: Spacing.md }}>
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: phaseColor }]}
              onPress={() => {
                // Auto-save any unsaved reflection before continuing
                if (reflectionText.trim() && !reflectionSaved) {
                  handleSaveReflection();
                }
                handleContinue();
              }}
              activeOpacity={0.8}
            >
              <TenderText variant="label" color={Colors.white} align="center">
                {buttonLabel}
              </TenderText>
            </TouchableOpacity>

            {/* Dismiss option (stay on current step) */}
            {!isLastStep && (
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={onDismiss}
                activeOpacity={0.7}
              >
                <TenderText
                  variant="caption"
                  color="rgba(255,255,255,0.5)"
                  align="center"
                >
                  Stay on this step
                </TenderText>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 22, 26, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  glowCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  glowCircleOuter: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  dotsContainer: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 120,
  },
  contentContainer: {
    alignItems: 'center',
    maxWidth: SCREEN_WIDTH - Spacing.xl * 2,
  },
  stepLabel: {
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  phaseBadge: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  phasePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.pill,
  },
  phaseSummary: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    lineHeight: 18,
  },
  journeyMessage: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
    lineHeight: 20,
  },
  question: {
    fontSize: 18,
    lineHeight: 26,
    paddingHorizontal: Spacing.sm,
  },
  affirmation: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  reflectionInputWrap: {
    width: '100%',
    gap: Spacing.xs,
  },
  reflectionInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    color: Colors.white,
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    minHeight: 60,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  saveReflectionButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
  },
  reflectionSavedBadge: {
    paddingVertical: Spacing.sm,
  },
  skipButton: {
    padding: Spacing.xs,
  },
  continueButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md - 2,
    borderRadius: BorderRadius.pill,
    minWidth: 220,
    alignItems: 'center',
  },
  dismissButton: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
  },
});
