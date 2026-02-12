/**
 * ExerciseStep — Standalone step renderer.
 *
 * This component is kept for backward-compatibility and potential
 * reuse outside of ExerciseFlow. ExerciseFlow now renders steps
 * inline with its own step-specific sub-components, so this file
 * is no longer imported there.
 *
 * Renders differently based on step type:
 *   - instruction: warm card with icon and text
 *   - reflection: journaling card with styled text area
 *   - timer: centered countdown display with start/pause
 *   - prompt: prominent question card with text area
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
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
import type { ExerciseStep as ExerciseStepType } from '@/types/intervention';

interface ExerciseStepProps {
  step: ExerciseStepType;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function ExerciseStep({
  step,
  value,
  onChangeText,
}: ExerciseStepProps) {
  switch (step.type) {
    case 'instruction':
      return <InstructionView step={step} />;
    case 'reflection':
      return (
        <ReflectionView step={step} value={value} onChangeText={onChangeText} />
      );
    case 'timer':
      return <TimerView step={step} />;
    case 'prompt':
      return (
        <PromptView step={step} value={value} onChangeText={onChangeText} />
      );
    default:
      return <InstructionView step={step} />;
  }
}

// ─── Instruction ─────────────────────────────────────────

function InstructionView({ step }: { step: ExerciseStepType }) {
  return (
    <View style={styles.instructionCard}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{'\u{1F4D6}'}</Text>
      </View>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.content}>{step.content}</Text>
    </View>
  );
}

// ─── Reflection ──────────────────────────────────────────

function ReflectionView({
  step,
  value,
  onChangeText,
}: {
  step: ExerciseStepType;
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={styles.reflectionCard}>
      <View style={styles.reflectionHeader}>
        <Text style={styles.icon}>{'\u{270D}\uFE0F'}</Text>
        <Text style={styles.title}>{step.title}</Text>
      </View>
      <Text style={styles.content}>{step.content}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder={step.promptPlaceholder ?? 'Write your reflections...'}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

// ─── Timer ───────────────────────────────────────────────

function TimerView({ step }: { step: ExerciseStepType }) {
  const duration = step.duration ?? 60;
  const [remaining, setRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    if (remaining === 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [remaining, pulseAnim]);

  const handleToggle = () => {
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

  return (
    <View style={styles.timerCard}>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.content}>{step.content}</Text>

      <Animated.View
        style={[
          styles.timerCircle,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Text
          style={[
            styles.timerTime,
            remaining === 0 && { color: Colors.success },
          ]}
        >
          {remaining === 0 ? '\u2713' : timeStr}
        </Text>
        <Text style={styles.timerHint}>
          {remaining === 0
            ? 'complete'
            : isRunning
              ? 'breathing...'
              : 'tap start'}
        </Text>
      </Animated.View>

      <TouchableOpacity
        style={[
          styles.timerButton,
          remaining === 0 && { backgroundColor: Colors.calm },
        ]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.timerButtonText}>
          {remaining === 0 ? 'Restart' : isRunning ? 'Pause' : 'Start'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Prompt ──────────────────────────────────────────────

function PromptView({
  step,
  value,
  onChangeText,
}: {
  step: ExerciseStepType;
  value?: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <View style={styles.promptCard}>
      <View style={styles.promptRow}>
        <Text style={styles.icon}>{'\u{2753}'}</Text>
        <Text style={[styles.title, { flex: 1 }]}>{step.title}</Text>
      </View>
      <Text style={styles.content}>{step.content}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder={step.promptPlaceholder ?? 'Share your thoughts...'}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  // Shared
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  content: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 22,
  },

  // Instruction
  instructionCard: {
    backgroundColor: '#FBF7F2',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },

  // Reflection
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

  // Text input (reflection + prompt)
  inputWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.accent + '60',
    backgroundColor: '#FFFCF7',
    overflow: 'hidden',
  },
  textInput: {
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 140,
    lineHeight: 24,
  },

  // Timer
  timerCard: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  timerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.surface,
    borderWidth: 6,
    borderColor: Colors.calm + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.lg,
  },
  timerTime: {
    fontSize: 40,
    fontWeight: '200',
    fontFamily: FontFamilies.heading,
    color: Colors.calm,
    letterSpacing: 2,
  },
  timerHint: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  timerButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
  },
  timerButtonText: {
    fontSize: FontSizes.body,
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },

  // Prompt
  promptCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
});
