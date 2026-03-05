/**
 * L4: Willingness Dial — ACT-based openness measure
 *
 * A horizontal tap-based dial (0-100 in 10% increments) that measures
 * willingness to experience uncomfortable emotions in service of
 * the relationship. Decorative arc fills with value-dependent color.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC5_PALETTE } from '@/constants/mc5Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'dial' | 'confirm';

const POSITIONS = Array.from({ length: 11 }, (_, i) => i * 10);

const DOT_SIZE = 20;
const DOT_ACTIVE = 28;

function getArcColor(v: number): string {
  if (v <= 30) return MC5_PALETTE.skyBlue;
  if (v <= 70) return MC5_PALETTE.lavender;
  return MC5_PALETTE.warmGold;
}

function getMessage(v: number): string {
  if (v <= 20) return 'Noticing where you are is the first step. There\u2019s no wrong answer here.';
  if (v <= 40) return 'A little willingness goes a long way. You\u2019re already being brave by being here.';
  if (v <= 60) return 'The middle is where growth lives. You\u2019re open to the possibility.';
  if (v <= 80) return 'You\u2019re showing real courage. Willingness isn\u2019t about liking the discomfort.';
  return 'Deep willingness. You understand that love and vulnerability are partners.';
}

interface L4WillnessDialProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L4WillingnessDial({ content, attachmentStyle, onComplete }: L4WillnessDialProps) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [value, setValue] = useState(50);

  const introFade = useRef(new Animated.Value(1)).current;
  const dialFade = useRef(new Animated.Value(0)).current;
  const confirmFade = useRef(new Animated.Value(0)).current;

  const transitionTo = useCallback((next: Phase) => {
    const fadeOut = phase === 'intro' ? introFade : dialFade;
    const fadeIn = next === 'dial' ? dialFade : confirmFade;
    Animated.timing(fadeOut, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      setPhase(next);
      Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    });
  }, [phase, introFade, dialFade, confirmFade]);

  const handleBegin = useCallback(() => {
    haptics.tap();
    transitionTo('dial');
  }, [haptics, transitionTo]);

  const handleDotPress = useCallback((v: number) => {
    haptics.tap();
    setValue(v);
  }, [haptics]);

  const handleLockIn = useCallback(() => {
    haptics.playConfetti();
    transitionTo('confirm');
  }, [haptics, transitionTo]);

  const handleComplete = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Willingness Dial',
      response: JSON.stringify({ willingness: value }),
      type: 'interactive',
    }];
    onComplete(responses);
  }, [haptics, value, onComplete]);

  // ─── Phase 0: Intro ────────────────────────
  if (phase === 'intro') {
    return (
      <Animated.View style={[s.container, { opacity: introFade }]}>
        <View style={s.centered}>
          <Text style={s.title}>YOUR WILLINGNESS DIAL</Text>
          <Text style={s.description}>
            Willingness isn{'\u2019'}t about wanting pain {'\u2014'} it{'\u2019'}s about
            measuring your openness to sit with discomfort when your
            relationship asks it of you. There are no wrong answers.
          </Text>
          <TouchableOpacity style={s.pillButton} onPress={handleBegin} activeOpacity={0.7}>
            <Text style={s.pillButtonText}>BEGIN</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ─── Phase 2: Confirm ──────────────────────
  if (phase === 'confirm') {
    return (
      <Animated.View style={[s.container, { opacity: confirmFade }]}>
        <View style={s.centered}>
          <Text style={s.valueDisplay}>{value}%</Text>
          <Text style={s.confirmLabel}>LOCKED IN</Text>
          <View style={s.messageCard}>
            <Text style={s.messageText}>
              Wherever you landed is exactly right for today. Willingness
              is a practice, not a destination {'\u2014'} and you just practiced.
            </Text>
          </View>
          <TouchableOpacity style={s.pillButton} onPress={handleComplete} activeOpacity={0.7}>
            <Text style={s.pillButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ─── Phase 1: The Dial ─────────────────────
  const fillFraction = value / 100;
  const arcColor = getArcColor(value);

  return (
    <Animated.View style={[s.container, { opacity: dialFade }]}>
      <ScrollView contentContainerStyle={s.dialContent} showsVerticalScrollIndicator={false}>
        <Text style={s.question}>
          How willing are you to feel uncomfortable emotions {'\u2014'}{' '}
          anxiety, sadness, fear {'\u2014'} in service of the relationship you want?
        </Text>

        {/* Value Display */}
        <Text style={s.valueDisplay}>{value}%</Text>

        {/* Decorative Arc / Progress Bar */}
        <View style={s.arcTrack}>
          <View style={[s.arcFill, { width: `${fillFraction * 100}%`, backgroundColor: arcColor }]} />
        </View>

        {/* Dot Slider */}
        <View style={s.sliderContainer}>
          {/* Background Track */}
          <View style={s.trackLine} />
          {/* Filled Track */}
          <View style={[s.trackFilled, { width: `${fillFraction * 100}%`, backgroundColor: arcColor }]} />

          {/* Dots */}
          <View style={s.dotRow}>
            {POSITIONS.map((pos) => {
              const active = pos === value;
              return (
                <TouchableOpacity
                  key={pos}
                  onPress={() => handleDotPress(pos)}
                  activeOpacity={0.7}
                  style={[
                    s.dot,
                    active && [s.dotActive, { backgroundColor: arcColor, borderColor: arcColor }],
                    !active && pos <= value && { backgroundColor: arcColor },
                  ]}
                >
                  {active && <Text style={s.dotLabel}>{pos}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Scale Labels */}
        <View style={s.scaleLabels}>
          <Text style={s.scaleLabelText}>0</Text>
          <Text style={s.scaleLabelText}>50</Text>
          <Text style={s.scaleLabelText}>100</Text>
        </View>

        {/* Encouraging Message */}
        <View style={s.messageCard}>
          <Text style={s.messageText}>{getMessage(value)}</Text>
        </View>

        {/* Lock In */}
        <TouchableOpacity style={s.pillButton} onPress={handleLockIn} activeOpacity={0.7}>
          <Text style={s.pillButtonText}>LOCK IN AT {value}%</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  title: {
    fontSize: FontSizes.headingL, fontFamily: FontFamilies.heading,
    fontWeight: '800', color: Colors.text, letterSpacing: 3, textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 24, marginTop: Spacing.md, paddingHorizontal: Spacing.md,
  },
  dialContent: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom, alignItems: 'center',
  },
  question: {
    fontSize: FontSizes.body, fontFamily: FontFamilies.body, color: Colors.text,
    textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg, paddingHorizontal: Spacing.sm,
  },
  valueDisplay: {
    fontSize: FontSizes.headingL, fontFamily: FontFamilies.accent,
    color: MC5_PALETTE.deepLavender, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.md,
  },
  arcTrack: {
    width: '80%', height: 6, borderRadius: 3,
    backgroundColor: MC5_PALETTE.softLilac, overflow: 'hidden', marginBottom: Spacing.xl,
  },
  arcFill: { height: 6, borderRadius: 3 },
  sliderContainer: { width: '100%', height: 52, justifyContent: 'center', marginBottom: Spacing.sm },
  trackLine: {
    position: 'absolute', left: 0, right: 0, top: 22,
    height: 4, borderRadius: 2, backgroundColor: MC5_PALETTE.softLilac,
  },
  trackFilled: { position: 'absolute', left: 0, top: 22, height: 4, borderRadius: 2 },
  dotRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 2,
  },
  dot: {
    width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2,
    backgroundColor: MC5_PALETTE.paleCloud, borderWidth: 2,
    borderColor: MC5_PALETTE.softLilac, alignItems: 'center', justifyContent: 'center',
  },
  dotActive: {
    width: DOT_ACTIVE, height: DOT_ACTIVE, borderRadius: DOT_ACTIVE / 2,
    borderWidth: 3, ...Shadows.subtle,
  },
  dotLabel: { fontSize: 9, fontWeight: '700', color: '#FFF', marginTop: 1 },
  scaleLabels: {
    width: '100%', flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 2, marginBottom: Spacing.lg,
  },
  scaleLabelText: { fontSize: FontSizes.caption, color: Colors.textMuted, fontWeight: '500' },
  messageCard: {
    backgroundColor: MC5_PALETTE.paleCloud, borderRadius: BorderRadius.lg,
    padding: Spacing.md, width: '100%', marginBottom: Spacing.md,
    borderLeftWidth: 3, borderLeftColor: MC5_PALETTE.lavender,
  },
  messageText: {
    fontSize: FontSizes.bodySmall, color: MC5_PALETTE.deepLavender,
    fontStyle: 'italic', lineHeight: 22, textAlign: 'center',
  },
  confirmLabel: {
    fontSize: FontSizes.caption, fontFamily: FontFamilies.heading,
    color: MC5_PALETTE.lavender, letterSpacing: 3, fontWeight: '700', marginBottom: Spacing.lg,
  },
  pillButton: {
    backgroundColor: MC5_PALETTE.deepLavender, paddingVertical: 16,
    paddingHorizontal: 44, borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xl,
  },
  pillButtonText: { color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2 },
});
