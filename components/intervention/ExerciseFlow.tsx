/**
 * ExerciseFlow — Enhanced step-by-step exercise runner with cascading data.
 *
 * Phase 3 enhancements:
 * - Previous responses cascade into subsequent steps (visible above input)
 * - Summary screen shows all responses before rating
 * - onComplete passes step_responses JSONB for database persistence
 * - "Save to Journal" flow integrated into completion
 *
 * Original features:
 * - Animated color-coded progress bar with "Step X of Y"
 * - Smooth slide-left transitions between steps
 * - Step-specific rendering:
 *     instruction: warm card with icon
 *     reflection: journaling card with styled text area
 *     timer: circular countdown with animated ring
 *     prompt: prominent question with text area
 * - Completion celebration with animated checkmark, star rating,
 *   optional reflection, and "Save & Close"
 * - Warm pill-shaped navigation buttons
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  ButtonSizes,
  Shadows,
} from '@/constants/theme';
import type { Intervention, ExerciseStep } from '@/types/intervention';
import {
  BookOpenIcon,
  PenIcon,
  CheckmarkIcon,
  QuestionIcon,
  NotepadIcon,
  StarIcon,
} from '@/assets/graphics/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Timer ring constants ────────────────────────────────
const RING_SIZE = 180;
const RING_STROKE = 8;

// ─── Exported types for step responses ───────────────────

export interface StepResponse {
  step: number;
  prompt: string;
  response: string;
  type: string;
}

interface ExerciseFlowProps {
  exercise: Intervention;
  onComplete: (
    reflection?: string,
    rating?: number,
    stepResponses?: StepResponse[]
  ) => void;
  onExit: () => void;
}

export default function ExerciseFlow({
  exercise,
  onComplete,
  onExit,
}: ExerciseFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [phase, setPhase] = useState<'steps' | 'summary' | 'complete'>('steps');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [finalReflection, setFinalReflection] = useState('');

  // Transition animations
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Completion animations
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const celebrationFade = useRef(new Animated.Value(0)).current;

  const totalSteps = exercise.steps.length;
  const isLastStep = currentIndex === totalSteps - 1;

  // ─── Build previous responses for cascading display ────
  const getPreviousResponses = useCallback(
    (upToIndex: number): StepResponse[] => {
      const result: StepResponse[] = [];
      for (let i = 0; i < upToIndex; i++) {
        const step = exercise.steps[i];
        const text = responses[i];
        // Only include steps that have text responses (prompts/reflections)
        if (text && text.trim().length > 0) {
          result.push({
            step: i + 1,
            prompt: step.title,
            response: text.trim(),
            type: step.type,
          });
        }
      }
      return result;
    },
    [exercise.steps, responses]
  );

  // ─── Build all step responses for saving ───────────────
  const getAllStepResponses = useCallback((): StepResponse[] => {
    const result: StepResponse[] = [];
    for (let i = 0; i < exercise.steps.length; i++) {
      const step = exercise.steps[i];
      const text = responses[i];
      if (text && text.trim().length > 0) {
        result.push({
          step: i + 1,
          prompt: step.title,
          response: text.trim(),
          type: step.type,
        });
      }
    }
    return result;
  }, [exercise.steps, responses]);

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / totalSteps,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, totalSteps, progressAnim]);

  // Animate entrance on mount
  useEffect(() => {
    slideAnim.setValue(0);
    fadeAnim.setValue(1);
  }, [slideAnim, fadeAnim]);

  // Completion celebration animation
  useEffect(() => {
    if (phase === 'complete') {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(checkScale, {
            toValue: 1,
            friction: 4,
            tension: 60,
            useNativeDriver: true,
          }),
          Animated.timing(checkOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(celebrationFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [phase, checkScale, checkOpacity, celebrationFade]);

  const animateTransition = useCallback(
    (direction: 'forward' | 'back', cb: () => void) => {
      const exitValue = direction === 'forward' ? -SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.3;
      const enterValue = direction === 'forward' ? SCREEN_WIDTH * 0.3 : -SCREEN_WIDTH * 0.3;

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: exitValue,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        cb();
        slideAnim.setValue(enterValue);
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [slideAnim, fadeAnim]
  );

  const handleNext = () => {
    if (isLastStep) {
      // Go to summary screen instead of directly to completion
      animateTransition('forward', () => setPhase('summary'));
    } else {
      animateTransition('forward', () =>
        setCurrentIndex((prev) => prev + 1)
      );
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      animateTransition('back', () =>
        setCurrentIndex((prev) => prev - 1)
      );
    }
  };

  const handleResponseChange = (index: number, text: string) => {
    setResponses((prev) => ({ ...prev, [index]: text }));
  };

  const handleSummaryBack = () => {
    animateTransition('back', () => {
      setPhase('steps');
      // Go back to last step
      setCurrentIndex(totalSteps - 1);
    });
  };

  const handleSummaryContinue = () => {
    animateTransition('forward', () => setPhase('complete'));
  };

  const handleFinish = () => {
    const stepResponses = getAllStepResponses();
    onComplete(
      finalReflection || undefined,
      rating,
      stepResponses.length > 0 ? stepResponses : undefined
    );
  };

  // ═══════════════════════════════════════════════════════
  //  SUMMARY SCREEN (Phase 3 — between steps and completion)
  // ═══════════════════════════════════════════════════════

  if (phase === 'summary') {
    const allResponses = getAllStepResponses();
    const hasResponses = allResponses.length > 0;

    return (
      <View style={styles.container}>
        {/* Progress header */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Your Responses</Text>
            <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        <Animated.View
          style={[
            styles.stepContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <ScrollView
            style={styles.stepScroll}
            contentContainerStyle={styles.stepContent}
            showsVerticalScrollIndicator={false}
          >
            {hasResponses ? (
              <>
                <Text style={summaryStyles.summaryTitle}>
                  Here's what you shared
                </Text>
                <Text style={summaryStyles.summarySubtitle}>
                  Take a moment to read through your responses.
                </Text>

                {allResponses.map((item, idx) => (
                  <View key={idx} style={summaryStyles.responseCard}>
                    <View style={summaryStyles.responseHeader}>
                      <View style={summaryStyles.stepBadge}>
                        <Text style={summaryStyles.stepBadgeText}>
                          {item.step}
                        </Text>
                      </View>
                      <Text style={summaryStyles.responsePrompt}>
                        {item.prompt}
                      </Text>
                    </View>
                    <Text style={summaryStyles.responseText}>
                      {item.response}
                    </Text>
                  </View>
                ))}

                <View style={summaryStyles.editHint}>
                  <Text style={summaryStyles.editHintText}>
                    Want to change something? Tap "Back" to edit your responses.
                  </Text>
                </View>
              </>
            ) : (
              <View style={summaryStyles.emptyState}>
                <NotepadIcon size={48} color={Colors.textMuted} />
                <Text style={summaryStyles.emptyTitle}>No written responses</Text>
                <Text style={summaryStyles.emptyText}>
                  This exercise focused on experiential practice.
                  You can still add a reflection on the next screen.
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleSummaryBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>{'\u2039'} Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleSummaryContinue}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>
              Continue {'\u203A'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════
  //  COMPLETION SCREEN
  // ═══════════════════════════════════════════════════════

  if (phase === 'complete') {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.completionScroll}
      >
        {/* Animated checkmark circle */}
        <Animated.View
          style={[
            styles.checkCircle,
            {
              opacity: checkOpacity,
              transform: [{ scale: checkScale }],
            },
          ]}
        >
          <CheckmarkIcon size={48} color={Colors.textOnPrimary} />
        </Animated.View>

        <Animated.View
          style={[styles.celebrationContent, { opacity: celebrationFade }]}
        >
          <Text style={styles.completionTitle}>Exercise Complete!</Text>
          <Text style={styles.completionSubtitle}>
            Well done. You completed{' '}
            <Text style={{ fontFamily: FontFamilies.heading, fontWeight: '600' }}>
              {exercise.title}
            </Text>
            .
          </Text>

          {/* Star Rating */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>How was this exercise?</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = rating != null && star <= rating;
                return (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.6}
                    style={styles.starButton}
                  >
                    <StarIcon
                      size={36}
                      color={isFilled ? Colors.accent : Colors.borderLight}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            {rating != null && (
              <Text style={styles.ratingFeedback}>
                {rating <= 2
                  ? 'Thank you for your honesty.'
                  : rating <= 4
                    ? 'Great, glad it was helpful!'
                    : 'Wonderful! So glad you loved it.'}
              </Text>
            )}
          </View>

          {/* Final Reflection */}
          <View style={styles.reflectionSection}>
            <Text style={styles.reflectionLabel}>
              Any final thoughts? (optional)
            </Text>
            <View style={styles.reflectionInputWrapper}>
              <TextInput
                style={styles.reflectionInput}
                placeholder="What are you taking away from this exercise?"
                placeholderTextColor={Colors.textMuted}
                value={finalReflection}
                onChangeText={setFinalReflection}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleFinish}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>Save & Close</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => onComplete(undefined, undefined)}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip & Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    );
  }

  // ═══════════════════════════════════════════════════════
  //  STEP SCREEN
  // ═══════════════════════════════════════════════════════

  const step = exercise.steps[currentIndex];
  const previousResponses = getPreviousResponses(currentIndex);

  return (
    <View style={styles.container}>
      {/* ─── Progress Bar ───────────────────────────────── */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            Step {currentIndex + 1} of {totalSteps}
          </Text>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* ─── Step Content (animated) ────────────────────── */}
      <Animated.View
        style={[
          styles.stepContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.stepScroll}
          contentContainerStyle={styles.stepContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <StepRenderer
            key={`step-${currentIndex}`}
            step={step}
            value={responses[currentIndex]}
            onChangeText={(text) => handleResponseChange(currentIndex, text)}
            previousResponses={previousResponses}
          />
        </ScrollView>
      </Animated.View>

      {/* ─── Navigation ─────────────────────────────────── */}
      <View style={styles.navigation}>
        {currentIndex > 0 ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePrevious}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>{'\u2039'} Back</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onExit}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>{'\u2715'} Exit</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>
            {isLastStep ? 'Review \u203A' : 'Next \u203A'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
//  PreviousResponses — cascading display of earlier answers
// ═══════════════════════════════════════════════════════════

function PreviousResponses({ responses }: { responses: StepResponse[] }) {
  if (responses.length === 0) return null;

  return (
    <View style={cascadeStyles.container}>
      <View style={cascadeStyles.header}>
        <View style={cascadeStyles.headerLine} />
        <Text style={cascadeStyles.headerText}>Your earlier responses</Text>
        <View style={cascadeStyles.headerLine} />
      </View>

      {responses.map((item, idx) => (
        <View key={idx} style={cascadeStyles.responseItem}>
          <View style={cascadeStyles.dotColumn}>
            <View style={cascadeStyles.dot} />
            {idx < responses.length - 1 && (
              <View style={cascadeStyles.connector} />
            )}
          </View>
          <View style={cascadeStyles.responseContent}>
            <Text style={cascadeStyles.promptLabel}>{item.prompt}</Text>
            <Text style={cascadeStyles.responseText}>{item.response}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const cascadeStyles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  headerText: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  responseItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  dotColumn: {
    width: 20,
    alignItems: 'center',
    paddingTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryLight,
  },
  connector: {
    flex: 1,
    width: 1.5,
    backgroundColor: Colors.borderLight,
    marginTop: 4,
  },
  responseContent: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  promptLabel: {
    fontSize: FontSizes.caption,
    fontFamily: 'Jost_500Medium',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  responseText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.text,
    lineHeight: 20,
  },
});

// ═══════════════════════════════════════════════════════════
//  StepRenderer — renders each step type with unique styling
// ═══════════════════════════════════════════════════════════

function StepRenderer({
  step,
  value,
  onChangeText,
  previousResponses,
}: {
  step: ExerciseStep;
  value?: string;
  onChangeText?: (text: string) => void;
  previousResponses: StepResponse[];
}) {
  switch (step.type) {
    case 'instruction':
      return (
        <>
          {previousResponses.length > 0 && (
            <PreviousResponses responses={previousResponses} />
          )}
          <InstructionStep step={step} />
        </>
      );
    case 'reflection':
      return (
        <>
          {previousResponses.length > 0 && (
            <PreviousResponses responses={previousResponses} />
          )}
          <ReflectionStep step={step} value={value} onChangeText={onChangeText} />
        </>
      );
    case 'timer':
      return (
        <>
          {previousResponses.length > 0 && (
            <PreviousResponses responses={previousResponses} />
          )}
          <TimerStep step={step} />
        </>
      );
    case 'prompt':
      return (
        <>
          {previousResponses.length > 0 && (
            <PreviousResponses responses={previousResponses} />
          )}
          <PromptStep step={step} value={value} onChangeText={onChangeText} />
        </>
      );
    default:
      return <InstructionStep step={step} />;
  }
}

// ─── Instruction Step ────────────────────────────────────

function InstructionStep({ step }: { step: ExerciseStep }) {
  return (
    <View style={stepStyles.instructionCard}>
      <View style={stepStyles.instructionIconCircle}>
        <BookOpenIcon size={22} color={Colors.primary} />
      </View>
      <Text style={stepStyles.stepTitle}>{step.title}</Text>
      <Text style={stepStyles.stepContent}>{step.content}</Text>
    </View>
  );
}

// ─── Reflection Step ─────────────────────────────────────

function ReflectionStep({
  step,
  value,
  onChangeText,
}: {
  step: ExerciseStep;
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={stepStyles.reflectionCard}>
      <View style={stepStyles.reflectionHeader}>
        <PenIcon size={20} color={Colors.text} />
        <Text style={stepStyles.stepTitle}>{step.title}</Text>
      </View>
      <Text style={stepStyles.stepContent}>{step.content}</Text>
      <View style={stepStyles.journalWrapper}>
        <TextInput
          style={stepStyles.journalInput}
          placeholder={step.promptPlaceholder ?? 'Write your reflections...'}
          placeholderTextColor={Colors.textMuted}
          value={value ?? ''}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

// ─── Timer Step ──────────────────────────────────────────

function TimerStep({ step }: { step: ExerciseStep }) {
  const duration = step.duration ?? 60;
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const ringAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Countdown logic
  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  // Animate ring progress
  useEffect(() => {
    const progress = 1 - remaining / duration;
    Animated.timing(ringAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [remaining, duration, ringAnim]);

  // Pulse when done
  useEffect(() => {
    if (remaining === 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
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
  }, [remaining, pulseAnim]);

  const handleStartPause = () => {
    if (remaining === 0) {
      setRemaining(duration);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  // The ring is built using two half-circle clip + rotate approach
  const ringProgress = 1 - remaining / duration;

  return (
    <View style={stepStyles.timerCard}>
      <Text style={stepStyles.stepTitle}>{step.title}</Text>
      <Text style={stepStyles.stepContent}>{step.content}</Text>

      <Animated.View
        style={[
          stepStyles.timerRingOuter,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        {/* Background ring */}
        <View style={stepStyles.timerRingBg} />

        {/* Progress ring — we use four quarter-arc views with clip */}
        <TimerRing progress={ringProgress} />

        {/* Center content */}
        <View style={stepStyles.timerCenter}>
          {remaining === 0 ? (
            <CheckmarkIcon size={42} color={Colors.success} />
          ) : (
            <Text style={stepStyles.timerTime}>
              {timeStr}
            </Text>
          )}
          {remaining > 0 && (
            <Text style={stepStyles.timerSubtitle}>
              {isRunning ? 'breathing...' : 'tap to start'}
            </Text>
          )}
          {remaining === 0 && (
            <Text style={stepStyles.timerSubtitle}>complete</Text>
          )}
        </View>
      </Animated.View>

      <TouchableOpacity
        style={[
          stepStyles.timerButton,
          remaining === 0 && { backgroundColor: Colors.calm },
        ]}
        onPress={handleStartPause}
        activeOpacity={0.7}
      >
        <Text style={stepStyles.timerButtonText}>
          {remaining === 0
            ? 'Restart'
            : isRunning
              ? 'Pause'
              : 'Start'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * TimerRing — renders a circular progress ring using two clipped half-circles
 * that rotate based on progress (0..1). Pure RN Animated, no SVG needed.
 */
function TimerRing({ progress }: { progress: number }) {
  // Clamp
  const p = Math.min(Math.max(progress, 0), 1);

  // First half rotates 0..180 deg for progress 0..0.5
  // Second half rotates 0..180 deg for progress 0.5..1
  const firstHalfDeg = Math.min(p * 360, 180);
  const secondHalfDeg = Math.max((p - 0.5) * 360, 0);

  return (
    <>
      {/* Right half (first 0-50%) */}
      <View style={timerRingStyles.halfClip}>
        <View
          style={[
            timerRingStyles.halfCircle,
            timerRingStyles.rightHalf,
            { transform: [{ rotate: `${firstHalfDeg}deg` }] },
          ]}
        />
      </View>

      {/* Left half (50-100%) */}
      <View style={[timerRingStyles.halfClip, timerRingStyles.leftClip]}>
        <View
          style={[
            timerRingStyles.halfCircle,
            timerRingStyles.leftHalf,
            {
              transform: [{ rotate: `${secondHalfDeg}deg` }],
              opacity: p > 0.5 ? 1 : 0,
            },
          ]}
        />
      </View>
    </>
  );
}

const timerRingStyles = StyleSheet.create({
  halfClip: {
    position: 'absolute',
    width: RING_SIZE / 2,
    height: RING_SIZE,
    right: 0,
    overflow: 'hidden',
  },
  leftClip: {
    right: undefined,
    left: 0,
  },
  halfCircle: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
    borderColor: Colors.calm,
    position: 'absolute',
  },
  rightHalf: {
    right: 0,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transformOrigin: 'center',
  },
  leftHalf: {
    left: 0,
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    transformOrigin: 'center',
  },
});

// ─── Prompt Step ─────────────────────────────────────────

function PromptStep({
  step,
  value,
  onChangeText,
}: {
  step: ExerciseStep;
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={stepStyles.promptCard}>
      <View style={stepStyles.promptQuestionWrapper}>
        <QuestionIcon size={20} color={Colors.text} />
        <Text style={stepStyles.promptQuestion}>{step.title}</Text>
      </View>
      <Text style={stepStyles.stepContent}>{step.content}</Text>
      <View style={stepStyles.journalWrapper}>
        <TextInput
          style={stepStyles.journalInput}
          placeholder={step.promptPlaceholder ?? 'Share your thoughts...'}
          placeholderTextColor={Colors.textMuted}
          value={value ?? ''}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
//  Summary screen styles
// ═══════════════════════════════════════════════════════════

const summaryStyles = StyleSheet.create({
  summaryTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  summarySubtitle: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_300Light',
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  responseCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 13,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.white,
  },
  responsePrompt: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    fontFamily: 'Jost_500Medium',
    color: Colors.textSecondary,
  },
  responseText: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.text,
    lineHeight: 24,
    paddingLeft: 28 + Spacing.sm, // Align with text after badge
  },
  editHint: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  editHintText: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyIcon: {
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyText: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
  },
});

// ═══════════════════════════════════════════════════════════
//  Step-type styles
// ═══════════════════════════════════════════════════════════

const stepStyles = StyleSheet.create({
  // ─── Shared ──────────────────────────────
  stepTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  stepContent: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },

  // ─── Instruction ─────────────────────────
  instructionCard: {
    backgroundColor: '#FBF7F2',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  instructionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  instructionIcon: {
  },

  // ─── Reflection ──────────────────────────
  reflectionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  reflectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  reflectionIcon: {
  },
  journalWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.accent + '60',
    backgroundColor: '#FFFCF7',
    overflow: 'hidden',
  },
  journalInput: {
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 140,
    lineHeight: 24,
  },

  // ─── Timer ───────────────────────────────
  timerCard: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  timerRingOuter: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.lg,
  },
  timerRingBg: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_STROKE,
    borderColor: Colors.borderLight,
  },
  timerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerTime: {
    fontSize: 42,
    fontWeight: '200',
    fontFamily: FontFamilies.heading,
    color: Colors.calm,
    letterSpacing: 2,
  },
  timerSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  timerButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.sm,
  },
  timerButtonText: {
    fontSize: FontSizes.body,
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },

  // ─── Prompt ──────────────────────────────
  promptCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  promptQuestionWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  promptIcon: {
    marginTop: 2,
  },
  promptQuestion: {
    flex: 1,
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    lineHeight: 28,
  },
});

// ═══════════════════════════════════════════════════════════
//  Main ExerciseFlow styles
// ═══════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ─── Progress ──────────────────────────────
  progressSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
  exerciseTitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontFamily: FontFamilies.heading,
    fontWeight: '500',
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },

  // ─── Step ──────────────────────────────────
  stepContainer: {
    flex: 1,
  },
  stepScroll: {
    flex: 1,
  },
  stepContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  // ─── Navigation ────────────────────────────
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.surfaceElevated,
    gap: Spacing.sm,
  },
  backButton: {
    height: ButtonSizes.medium,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backButtonText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    height: ButtonSizes.medium,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: FontSizes.body,
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },

  // ─── Completion ────────────────────────────
  completionScroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.elevated,
  },
  checkMark: {
  },
  celebrationContent: {
    width: '100%',
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  completionSubtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },

  // ─── Rating ────────────────────────────────
  ratingSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    width: '100%',
  },
  ratingLabel: {
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '600',
  },
  stars: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  starButton: {
    padding: Spacing.xs,
  },
  starText: {
  },
  starActive: {
  },
  ratingFeedback: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },

  // ─── Reflection ────────────────────────────
  reflectionSection: {
    width: '100%',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  reflectionLabel: {
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '500',
  },
  reflectionInputWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.accent + '50',
    backgroundColor: '#FFFCF7',
    overflow: 'hidden',
  },
  reflectionInput: {
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 110,
    lineHeight: 24,
  },

  // ─── Buttons ───────────────────────────────
  saveButton: {
    width: '100%',
    height: ButtonSizes.large,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  saveButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSizes.body,
    fontWeight: '700',
  },
  skipButton: {
    height: ButtonSizes.medium,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  skipButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.bodySmall,
    fontWeight: '500',
  },
});
