/**
 * L5: Values Check-In — Progressive reflection & weekly ritual
 *
 * Final lesson in MC6. Four progressive check-in questions shown one at a
 * time with fade-in. Previous answers dimmed above the current question.
 * Review card, optional weekly ritual toggle, and a "Values Champion"
 * completion stamp. Warm gold Wes Anderson palette throughout.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC6_PALETTE } from '@/constants/mc6Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

// ─── Data ──────────────────────────────────────────────

const QUESTIONS = [
  'What value did you most honor this week in your relationship?',
  'Where did you notice yourself drifting from what matters?',
  "What's one thing your partner did that aligned with your shared values?",
  "What's one small step you can take this coming week to live more in line with your values?",
];

type Phase = 'intro' | 'questions' | 'review' | 'stamp';

// ─── Component ─────────────────────────────────────────

interface L5ValuesCheckInProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L5ValuesCheckIn({ content, attachmentStyle, onComplete }: L5ValuesCheckInProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [isRitualEnabled, setIsRitualEnabled] = useState(false);

  const introFade = useRef(new Animated.Value(1)).current;
  const questionFade = useRef(new Animated.Value(0)).current;
  const reviewFade = useRef(new Animated.Value(0)).current;
  const stampScale = useRef(new Animated.Value(0)).current;

  // ─── Helpers ──────────────────────────────────

  const updateAnswer = useCallback((text: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = text;
      return next;
    });
  }, [currentQ]);

  const canAdvance = answers[currentQ]?.length > 10;

  // ─── Phase transitions ────────────────────────

  const handleBegin = useCallback(() => {
    haptics.tap();
    Animated.timing(introFade, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setPhase('questions');
      Animated.timing(questionFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    });
  }, [haptics, introFade, questionFade]);

  const handleNext = useCallback(() => {
    if (!canAdvance) return;
    haptics.tap();
    if (currentQ < QUESTIONS.length - 1) {
      questionFade.setValue(0);
      setCurrentQ((prev) => prev + 1);
      Animated.timing(questionFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } else {
      // Move to review
      Animated.timing(questionFade, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setPhase('review');
        Animated.timing(reviewFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
    }
  }, [haptics, canAdvance, currentQ, questionFade, reviewFade]);

  const handleFinishReview = useCallback(() => {
    haptics.playConfetti();
    setPhase('stamp');
    Animated.spring(stampScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [haptics, stampScale]);

  const handleComplete = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Values Check-In',
      response: JSON.stringify({
        answers,
        weeklyRitual: isRitualEnabled,
      }),
      type: 'interactive',
    }];
    onComplete(responses);
  }, [haptics, answers, isRitualEnabled, onComplete]);

  // ─── Phase 0: Intro ──────────────────────────

  if (phase === 'intro') {
    return (
      <Animated.View style={[s.container, { opacity: introFade }]}>
        <View style={s.centered}>
          <Text style={s.title}>YOUR VALUES CHECK-IN</Text>
          <Text style={s.description}>
            Regular reflection keeps values alive. Without check-ins, even our
            deepest intentions can quietly fade into the background.
          </Text>
          <TouchableOpacity style={s.beginButton} onPress={handleBegin} activeOpacity={0.7}>
            <Text style={s.beginButtonText}>BEGIN</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ─── Phase 1: Progressive Questions ──────────

  if (phase === 'questions') {
    return (
      <Animated.View style={[s.container, { opacity: questionFade }]}>
        <ScrollView
          contentContainerStyle={s.questionsContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Previous answers (dimmed) */}
          {answers.slice(0, currentQ).map((ans, idx) => (
            <View key={idx} style={[s.questionCard, s.questionCardDimmed]}>
              <Text style={s.questionNumber}>Q{idx + 1}</Text>
              <Text style={[s.questionText, { opacity: 0.5 }]}>{QUESTIONS[idx]}</Text>
              <Text style={[s.previousAnswer, { opacity: 0.5 }]}>{ans}</Text>
            </View>
          ))}

          {/* Current question */}
          <View style={s.questionCard}>
            <Text style={s.questionNumber}>Q{currentQ + 1}</Text>
            <Text style={s.questionText}>{QUESTIONS[currentQ]}</Text>
            <View style={s.inputContainer}>
              <TextInput
                style={s.questionInput}
                multiline
                textAlignVertical="top"
                placeholder="Reflect honestly..."
                placeholderTextColor={Colors.textMuted}
                value={answers[currentQ]}
                onChangeText={updateAnswer}
              />
            </View>
          </View>

          {/* Next button */}
          {canAdvance && (
            <TouchableOpacity style={s.nextButton} onPress={handleNext} activeOpacity={0.7}>
              <Text style={s.nextButtonText}>
                {currentQ < QUESTIONS.length - 1 ? 'NEXT' : 'REVIEW'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Phase 2: Review ─────────────────────────

  if (phase === 'review') {
    return (
      <Animated.View style={[s.container, { opacity: reviewFade }]}>
        <ScrollView
          contentContainerStyle={s.reviewContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.reviewTitle}>YOUR REFLECTIONS</Text>

          <View style={s.reviewCard}>
            {QUESTIONS.map((q, idx) => (
              <View
                key={idx}
                style={[s.reviewBlock, idx === QUESTIONS.length - 1 && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}
              >
                <Text style={s.reviewQuestionNumber}>Q{idx + 1}</Text>
                <Text style={s.reviewQuestionText}>{q}</Text>
                <Text style={s.reviewAnswerText}>{answers[idx]}</Text>
              </View>
            ))}
          </View>

          {/* Weekly ritual toggle */}
          <View style={s.ritualRow}>
            <View style={s.ritualLabelWrap}>
              <Text style={s.ritualLabel}>Save as weekly ritual?</Text>
              <Text style={s.ritualSubLabel}>Set a weekly reminder to revisit these questions</Text>
            </View>
            <TouchableOpacity
              style={[s.toggle, isRitualEnabled && s.toggleOn]}
              onPress={() => { haptics.tap(); setIsRitualEnabled((v) => !v); }}
              activeOpacity={0.7}
            >
              {isRitualEnabled && <Text style={s.toggleCheck}>{'\u2713'}</Text>}
              <View style={[s.toggleThumb, isRitualEnabled && s.toggleThumbOn]} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.finishButton} onPress={handleFinishReview} activeOpacity={0.7}>
            <Text style={s.finishButtonText}>FINISH</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Phase 3: Stamp + Complete ────────────────

  return (
    <View style={s.container}>
      <View style={s.centered}>
        <Animated.View style={[s.stampBadge, { transform: [{ scale: stampScale }] }]}>
          <Text style={s.stampEmoji}>{'\u2B50'}</Text>
          <Text style={s.stampBadgeText}>Values Champion</Text>
        </Animated.View>

        <Text style={s.stampMessage}>
          You{'\u2019'}ve completed the full values course.{'\n'}
          Keep checking in {'\u2014'} that{'\u2019'}s where the real work lives.
        </Text>

        <TouchableOpacity style={s.completeButton} onPress={handleComplete} activeOpacity={0.7}>
          <Text style={s.completeButtonText}>COMPLETE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const CREAM_BG = '#FFFCF5';

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ─── Shared ──────────────────────────
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.headingL, fontFamily: FontFamilies.heading, fontWeight: '800',
    color: Colors.text, letterSpacing: 3, textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 24, marginTop: Spacing.lg, paddingHorizontal: Spacing.sm,
  },
  beginButton: {
    backgroundColor: MC6_PALETTE.deepGold, paddingVertical: 16, paddingHorizontal: 44,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xxl,
  },
  beginButtonText: {
    color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2,
  },

  // ─── Questions ────────────────────────
  questionsContent: {
    paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xxxl,
  },
  questionCard: {
    backgroundColor: MC6_PALETTE.softGold, borderRadius: BorderRadius.lg,
    borderLeftWidth: 4, borderLeftColor: MC6_PALETTE.deepGold,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  questionCardDimmed: {
    opacity: 0.5,
  },
  questionNumber: {
    fontSize: 11, fontWeight: '700', letterSpacing: 2,
    color: MC6_PALETTE.richGold, marginBottom: Spacing.xs,
  },
  questionText: {
    fontSize: FontSizes.body, fontWeight: '500', color: Colors.text, lineHeight: 22,
  },
  previousAnswer: {
    fontSize: FontSizes.bodySmall, color: Colors.textSecondary,
    marginTop: Spacing.sm, fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: CREAM_BG, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: MC6_PALETTE.warmAmber, marginTop: Spacing.sm,
    minHeight: 80, ...Shadows.subtle,
  },
  questionInput: {
    fontSize: FontSizes.body, fontFamily: FontFamilies.body, color: Colors.text,
    lineHeight: 24, padding: Spacing.md, minHeight: 80,
  },
  nextButton: {
    backgroundColor: MC6_PALETTE.deepGold, paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: BorderRadius.pill, alignSelf: 'center', marginTop: Spacing.md,
  },
  nextButtonText: {
    color: '#FFF', fontSize: FontSizes.bodySmall, fontWeight: '600', letterSpacing: 2,
  },

  // ─── Review ───────────────────────────
  reviewContent: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  reviewTitle: {
    fontSize: FontSizes.headingM, fontFamily: FontFamilies.heading, fontWeight: '800',
    color: Colors.text, letterSpacing: 2, marginBottom: Spacing.lg, textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, width: '100%', ...Shadows.elevated,
  },
  reviewBlock: {
    marginBottom: Spacing.md, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  reviewQuestionNumber: {
    fontSize: 10, fontWeight: '700', letterSpacing: 2, color: MC6_PALETTE.richGold,
    marginBottom: 2,
  },
  reviewQuestionText: {
    fontSize: FontSizes.bodySmall, color: Colors.textMuted, lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  reviewAnswerText: {
    fontSize: FontSizes.body, color: Colors.text, lineHeight: 22,
  },

  // ─── Ritual Toggle ────────────────────
  ritualRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', marginTop: Spacing.xl, paddingHorizontal: Spacing.xs,
  },
  ritualLabelWrap: { flex: 1, marginRight: Spacing.md },
  ritualLabel: {
    fontSize: FontSizes.body, fontWeight: '600', color: Colors.text,
  },
  ritualSubLabel: {
    fontSize: FontSizes.caption, color: Colors.textMuted, marginTop: 2,
  },
  toggle: {
    width: 52, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: Colors.border,
    backgroundColor: Colors.backgroundAlt,
    justifyContent: 'center', paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: MC6_PALETTE.deepGold, borderColor: MC6_PALETTE.deepGold,
  },
  toggleCheck: {
    position: 'absolute', left: 8, color: '#FFF', fontSize: 12, fontWeight: '700',
  },
  toggleThumb: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#FFF', ...Shadows.subtle,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  finishButton: {
    backgroundColor: Colors.text, paddingVertical: 16, paddingHorizontal: 44,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xl,
  },
  finishButtonText: {
    color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2,
  },

  // ─── Stamp ────────────────────────────
  stampBadge: {
    backgroundColor: MC6_PALETTE.richGold, paddingVertical: 18, paddingHorizontal: 36,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginBottom: Spacing.xl,
  },
  stampEmoji: { fontSize: 28, marginBottom: Spacing.xs },
  stampBadgeText: {
    color: '#FFF', fontSize: FontSizes.headingM, fontWeight: '800', letterSpacing: 2,
  },
  stampMessage: {
    fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 24, paddingHorizontal: Spacing.md,
  },
  completeButton: {
    backgroundColor: Colors.text, paddingVertical: 16, paddingHorizontal: 44,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xxl,
  },
  completeButtonText: {
    color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2,
  },
});
