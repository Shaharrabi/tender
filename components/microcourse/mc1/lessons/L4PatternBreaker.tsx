/**
 * L4: Pattern Breaker — 90-Second Timer with Breathing Animation
 *
 * For anxious users: 90-second countdown with breathing circle.
 * For avoidant users: 60-second prompt for one-sentence share.
 * Both end with a "How does the intensity feel?" choice moment.
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
} from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { HourglassIcon, CheckmarkIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const CIRCLE_RADIUS = 90;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

type Phase = 'intro' | 'active' | 'choice' | 'done';
type IntensityChoice = 'less_intense' | 'about_same' | 'different';

interface L4PatternBreakerProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L4PatternBreaker({ content, attachmentStyle, onComplete }: L4PatternBreakerProps) {
  const haptics = useSoundHaptics();
  const isAnxious = attachmentStyle === 'anxious-preoccupied';
  const totalSeconds = isAnxious ? 90 : 60;

  const [phase, setPhase] = useState<Phase>('intro');
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [intensity, setIntensity] = useState<IntensityChoice | null>(null);
  const [shareText, setShareText] = useState(''); // For avoidant prompt

  // Timer state
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animations
  const breathScale = useRef(new Animated.Value(1)).current;
  const breathAnim = useRef<Animated.CompositeAnimation | null>(null);
  const checkScale = useRef(new Animated.Value(0)).current;

  // Progress for SVG circle (0 to 1)
  const progress = 1 - secondsLeft / totalSeconds;
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  // ─── Timer Logic ───────────────────────────────

  useEffect(() => {
    if (phase !== 'active') return;

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, totalSeconds - elapsed);
      setSecondsLeft(remaining);

      // Soft pulse every 30 seconds
      if (remaining > 0 && remaining % 30 === 0 && remaining !== totalSeconds) {
        haptics.tapSoft();
      }

      if (remaining === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        haptics.success();
        setPhase('choice');
      }
    }, 250); // Check frequently for accuracy

    // Breathing animation (4s in, 4s out)
    breathAnim.current = Animated.loop(
      Animated.sequence([
        Animated.timing(breathScale, {
          toValue: 1.08,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breathScale, {
          toValue: 0.95,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    breathAnim.current.start();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathAnim.current) breathAnim.current.stop();
    };
  }, [phase]);

  // ─── Handlers ──────────────────────────────────

  const startTimer = useCallback(() => {
    haptics.tap();
    setPhase('active');
  }, [haptics]);

  const selectIntensity = useCallback((choice: IntensityChoice) => {
    haptics.tap();
    setIntensity(choice);

    // Animate checkmark
    Animated.spring(checkScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      const responses: StepResponseEntry[] = [
        {
          step: 1,
          prompt: isAnxious ? '90-second pause' : '60-second share',
          response: JSON.stringify({
            timerCompleted: true,
            durationSeconds: totalSeconds,
            intensityAfter: choice,
            shareText: shareText.trim() || undefined,
          }),
          type: 'timer',
        },
      ];
      onComplete(responses);
    }, 800);
  }, [haptics, isAnxious, totalSeconds, shareText, onComplete]);

  // ─── Intro Phase ───────────────────────────────

  if (phase === 'intro') {
    // Split read content into paragraphs for better display
    const paragraphs = content.readContent.split('\n\n').filter(Boolean);

    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.introContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <HourglassIcon size={28} color={Colors.primary} />
        </View>

        <Text style={styles.title}>
          {isAnxious ? 'THE 90-SECOND PAUSE' : 'THE ONE-SENTENCE SHARE'}
        </Text>

        {paragraphs.slice(0, 4).map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}

        <TouchableOpacity
          style={styles.startButton}
          onPress={startTimer}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>BEGIN PRACTICE</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Active Phase ──────────────────────────────

  if (phase === 'active') {
    const minutes = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const timeDisplay = minutes > 0
      ? `${minutes}:${secs.toString().padStart(2, '0')}`
      : `${secs}`;

    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.timerContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Clock area */}
        <View style={styles.clockArea}>
          {/* Breathing background */}
          <Animated.View
            style={[
              styles.breathCircle,
              { transform: [{ scale: breathScale }] },
            ]}
          />

          {/* SVG Progress Circle */}
          <Svg
            width={220}
            height={220}
            viewBox={`0 0 ${(CIRCLE_RADIUS + 10) * 2} ${(CIRCLE_RADIUS + 10) * 2}`}
            style={styles.svgCircle}
          >
            {/* Background circle */}
            <SvgCircle
              cx={CIRCLE_RADIUS + 10}
              cy={CIRCLE_RADIUS + 10}
              r={CIRCLE_RADIUS}
              stroke={Colors.borderLight}
              strokeWidth={4}
              fill="none"
            />
            {/* Progress circle */}
            <SvgCircle
              cx={CIRCLE_RADIUS + 10}
              cy={CIRCLE_RADIUS + 10}
              r={CIRCLE_RADIUS}
              stroke={Colors.primary}
              strokeWidth={4}
              fill="none"
              strokeDasharray={`${CIRCLE_CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${CIRCLE_RADIUS + 10}, ${CIRCLE_RADIUS + 10}`}
            />
          </Svg>

          {/* Timer text */}
          <View style={styles.timerTextContainer}>
            <Text style={styles.timerNumber}>{timeDisplay}</Text>
            <Text style={styles.timerLabel}>
              {secondsLeft === 1 ? 'second' : 'seconds'}
            </Text>
          </View>
        </View>

        <Text style={styles.timerInstruction}>
          Just breathe.{'\n'}Do not act yet.
        </Text>

        {/* Avoidant: show text input for one-sentence share */}
        {!isAnxious && (
          <View style={styles.shareInputContainer}>
            <Text style={styles.shareLabel}>
              Draft one sentence about how you feel:
            </Text>
            <TextInput
              style={styles.shareInput}
              placeholder="I feel..."
              placeholderTextColor={Colors.textMuted}
              value={shareText}
              onChangeText={setShareText}
              multiline
            />
          </View>
        )}
      </ScrollView>
    );
  }

  // ─── Choice Phase ──────────────────────────────

  if (phase === 'choice') {
    const choices: { key: IntensityChoice; label: string }[] = [
      { key: 'less_intense', label: 'Less intense' },
      { key: 'about_same', label: 'About the same' },
      { key: 'different', label: 'Different somehow' },
    ];

    return (
      <View style={styles.choiceContainer}>
        <Animated.View style={[styles.doneCircle, { transform: [{ scale: checkScale }] }]}>
          <CheckmarkIcon size={36} color={Colors.textOnPrimary} />
        </Animated.View>

        <Text style={styles.choiceTitle}>PAUSE COMPLETE</Text>
        <Text style={styles.choiceQuestion}>
          How does the intensity feel now?
        </Text>

        <View style={styles.choiceButtons}>
          {choices.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[
                styles.choiceButton,
                intensity === c.key && styles.choiceButtonSelected,
              ]}
              onPress={() => selectIntensity(c.key)}
              activeOpacity={0.7}
              disabled={intensity !== null}
            >
              <Text
                style={[
                  styles.choiceButtonText,
                  intensity === c.key && styles.choiceButtonTextSelected,
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return null;
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
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
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
  paragraph: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  startButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 24,
    ...Shadows.subtle,
  },
  startButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '700',
    fontSize: FontSizes.body,
    letterSpacing: 1.5,
  },

  // ─── Timer ───────────────────────────
  timerContent: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom,
    paddingHorizontal: Spacing.lg,
  },
  clockArea: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.calm + '15',
  },
  svgCircle: {
    position: 'absolute',
  },
  timerTextContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  timerNumber: {
    fontSize: 64,
    fontWeight: '200',
    fontFamily: FontFamilies.accent,
    color: Colors.text,
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  timerInstruction: {
    marginTop: Spacing.xl,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  shareInputContainer: {
    marginTop: Spacing.lg,
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  shareLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  shareInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    backgroundColor: Colors.surfaceElevated,
    minHeight: 60,
  },

  // ─── Choice ──────────────────────────
  choiceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  doneCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.elevated,
  },
  choiceTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  choiceQuestion: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  choiceButtons: {
    width: '100%',
    gap: Spacing.sm,
  },
  choiceButton: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.lg,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  choiceButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  choiceButtonText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  choiceButtonTextSelected: {
    color: Colors.textOnPrimary,
  },
});
