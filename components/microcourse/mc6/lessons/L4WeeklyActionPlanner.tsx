/**
 * L4: Weekly Action Planner -- Turn values into daily actions
 *
 * Users plan value-aligned actions for each day of the week using
 * suggestion chips or custom text. Wes Anderson warm gold palette.
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

// ── Data ──────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const SUGGESTIONS = [
  'Morning check-in', 'Device-free dinner', '10-min walk together',
  'Express appreciation', 'Ask a meaningful question', 'Plan something fun',
  'Share a vulnerability',
] as const;

type Phase = 'intro' | 'planning' | 'review';

// ── Component ─────────────────────────────────────────
interface L4WeeklyActionPlannerProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L4WeeklyActionPlanner({ content, attachmentStyle, onComplete }: L4WeeklyActionPlannerProps) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedDay, setSelectedDay] = useState(0);
  const [dayPlans, setDayPlans] = useState<Record<number, string>>({});
  const introFade = useRef(new Animated.Value(1)).current;
  const planFade = useRef(new Animated.Value(0)).current;
  const reviewFade = useRef(new Animated.Value(0)).current;
  const daysPlanned = Object.values(dayPlans).filter((v) => v.trim()).length;

  // ── Phase transitions ─────────────────────────
  const handleBegin = useCallback(() => {
    haptics.tap();
    Animated.timing(introFade, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setPhase('planning');
      Animated.timing(planFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    });
  }, [haptics, introFade, planFade]);

  const handleReadyToCommit = useCallback(() => {
    haptics.tap();
    Animated.timing(planFade, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setPhase('review');
      haptics.playConfetti();
      Animated.timing(reviewFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    });
  }, [haptics, planFade, reviewFade]);

  const handleDayTap = useCallback((i: number) => { haptics.tap(); setSelectedDay(i); }, [haptics]);
  const handleSuggestionTap = useCallback((t: string) => {
    haptics.tap();
    setDayPlans((prev) => ({ ...prev, [selectedDay]: t }));
  }, [haptics, selectedDay]);
  const handleTextChange = useCallback((t: string) => {
    setDayPlans((prev) => ({ ...prev, [selectedDay]: t }));
  }, [selectedDay]);

  // ── Complete ──────────────────────────────────
  const handleComplete = useCallback(() => {
    haptics.tap();
    const plan: Record<string, string> = {};
    DAY_KEYS.forEach((key, i) => { plan[key] = dayPlans[i] || ''; });
    onComplete([{
      step: 1,
      prompt: 'Weekly Action Planner',
      response: JSON.stringify({ plan, daysPlanned }),
      type: 'interactive',
    }]);
  }, [haptics, dayPlans, daysPlanned, onComplete]);

  // ── Phase 0: Intro ────────────────────────────
  if (phase === 'intro') {
    return (
      <Animated.View style={[s.container, { opacity: introFade }]}>
        <View style={s.centered}>
          <Text style={s.title}>YOUR VALUES WEEK</Text>
          <Text style={s.description}>
            Values only matter when they show up in your actual days.
            Let{'\u2019'}s turn what matters most into small, specific actions
            across your week.
          </Text>
          <TouchableOpacity style={s.beginButton} onPress={handleBegin} activeOpacity={0.7}>
            <Text style={s.beginButtonText}>BEGIN</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ── Phase 1: Planning ─────────────────────────
  if (phase === 'planning') {
    const currentText = dayPlans[selectedDay] || '';
    return (
      <Animated.View style={[s.container, { opacity: planFade }]}>
        <ScrollView contentContainerStyle={s.planContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Day selector row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dayRow}>
            {DAYS.map((day, i) => {
              const active = selectedDay === i;
              const filled = !!(dayPlans[i] && dayPlans[i].trim());
              return (
                <TouchableOpacity key={day} onPress={() => handleDayTap(i)} activeOpacity={0.7} style={s.dayCol}>
                  <View style={[s.dayCircle, active && s.dayCircleActive]}>
                    <Text style={[s.dayText, active && s.dayTextActive]}>{day}</Text>
                  </View>
                  {filled && <View style={s.dayDot} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={s.chipLabel}>QUICK IDEAS</Text>
          <View style={s.chipWrap}>
            {SUGGESTIONS.map((sug) => (
              <TouchableOpacity key={sug} style={s.chip} onPress={() => handleSuggestionTap(sug)} activeOpacity={0.7}>
                <Text style={s.chipText}>{sug}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.inputWrap}>
            <TextInput
              style={s.input}
              placeholder={`What will you do on ${DAYS[selectedDay]}?`}
              placeholderTextColor={Colors.textMuted}
              value={currentText}
              onChangeText={handleTextChange}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Progress */}
          <View style={s.progressSection}>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: `${(daysPlanned / 7) * 100}%` }]} />
            </View>
            <Text style={s.progressLabel}>{daysPlanned} of 7 days planned</Text>
          </View>

          {daysPlanned >= 3 && (
            <TouchableOpacity style={s.commitButton} onPress={handleReadyToCommit} activeOpacity={0.7}>
              <Text style={s.commitButtonText}>Ready to commit!</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>
    );
  }

  // ── Phase 2: Review + Complete ────────────────
  return (
    <Animated.View style={[s.container, { opacity: reviewFade }]}>
      <ScrollView contentContainerStyle={s.reviewContent} showsVerticalScrollIndicator={false}>
        <Text style={s.reviewTitle}>YOUR WEEK</Text>
        {DAYS.map((day, i) => {
          const plan = dayPlans[i]?.trim();
          return (
            <View key={day} style={[s.weekCard, plan ? s.weekCardPlanned : s.weekCardEmpty]}>
              <Text style={s.weekDay}>{day}</Text>
              <Text style={[s.weekAction, !plan && s.weekActionEmpty]} numberOfLines={2}>
                {plan || '\u2014'}
              </Text>
            </View>
          );
        })}
        <TouchableOpacity style={s.completeButton} onPress={handleComplete} activeOpacity={0.7}>
          <Text style={s.completeButtonText}>COMPLETE</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

// ── Styles ──────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Intro
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
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
  beginButtonText: { color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2 },

  // Planning
  planContent: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xxxl },
  dayRow: { flexDirection: 'row', gap: 10, paddingBottom: Spacing.md, justifyContent: 'center' },
  dayCol: { alignItems: 'center' },
  dayCircle: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: MC6_PALETTE.softGold,
    justifyContent: 'center', alignItems: 'center',
  },
  dayCircleActive: { backgroundColor: MC6_PALETTE.deepGold },
  dayText: { fontSize: FontSizes.bodySmall, fontWeight: '600', color: Colors.textMuted },
  dayTextActive: { color: '#FFF' },
  dayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: MC6_PALETTE.deepGold, marginTop: 4 },

  chipLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 3, color: Colors.textMuted,
    textAlign: 'center', marginBottom: Spacing.sm, marginTop: Spacing.md,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.xs },
  chip: {
    borderWidth: 1.5, borderColor: MC6_PALETTE.warmAmber,
    borderRadius: BorderRadius.pill, paddingVertical: 8, paddingHorizontal: 14,
  },
  chipText: { fontSize: FontSizes.caption, fontWeight: '500', color: MC6_PALETTE.richGold },

  inputWrap: {
    backgroundColor: MC6_PALETTE.softGold, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: MC6_PALETTE.deepGold, marginTop: Spacing.md,
    minHeight: 80, ...Shadows.subtle,
  },
  input: {
    fontSize: FontSizes.body, fontFamily: FontFamilies.body, color: Colors.text,
    lineHeight: 24, padding: Spacing.md, minHeight: 80,
  },

  progressSection: { marginTop: Spacing.lg, alignItems: 'center' },
  progressTrack: {
    width: '100%', height: 6, borderRadius: 3,
    backgroundColor: MC6_PALETTE.softGold, overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: MC6_PALETTE.deepGold },
  progressLabel: { fontSize: FontSizes.caption, color: Colors.textMuted, marginTop: Spacing.xs, letterSpacing: 1 },

  commitButton: {
    backgroundColor: MC6_PALETTE.deepGold, paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: BorderRadius.pill, alignSelf: 'center', marginTop: Spacing.xl,
  },
  commitButtonText: { color: '#FFF', fontSize: FontSizes.bodySmall, fontWeight: '600', letterSpacing: 1 },

  // Review
  reviewContent: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl, alignItems: 'center',
  },
  reviewTitle: {
    fontSize: FontSizes.headingM, fontFamily: FontFamilies.heading, fontWeight: '800',
    color: Colors.text, letterSpacing: 2, marginBottom: Spacing.lg, textAlign: 'center',
  },
  weekCard: {
    flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: BorderRadius.md,
    paddingVertical: 12, paddingHorizontal: Spacing.md, marginBottom: Spacing.xs,
    backgroundColor: '#FFF', ...Shadows.subtle,
  },
  weekCardPlanned: { borderLeftWidth: 4, borderLeftColor: MC6_PALETTE.deepGold },
  weekCardEmpty: {
    borderLeftWidth: 4, borderLeftColor: 'transparent',
    borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.borderLight,
  },
  weekDay: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: MC6_PALETTE.richGold, width: 40 },
  weekAction: { fontSize: FontSizes.bodySmall, color: Colors.text, flex: 1 },
  weekActionEmpty: { color: Colors.textMuted },

  completeButton: {
    backgroundColor: Colors.text, paddingVertical: 16, paddingHorizontal: 44,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xl,
  },
  completeButtonText: { color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2 },
});
