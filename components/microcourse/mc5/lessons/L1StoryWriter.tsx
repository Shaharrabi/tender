/**
 * L1: Story Writer — Write a painful story, then frame & shrink it
 *
 * Two-phase ACT defusion exercise: users write the story their mind
 * tells them about their relationship, then visually "step back" from
 * it three times, watching the text shrink into a framed artifact.
 * The softest course — NO haptics during writing. Meditative feel.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC5_PALETTE } from '@/constants/mc5Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'write' | 'frame';

const SCALE_STEPS = [1.0, 0.85, 0.7, 0.55] as const;
const BORDER_WIDTHS = [0, 2, 4, 7] as const;

interface L1StoryWriterProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L1StoryWriter({ content, attachmentStyle, onComplete }: L1StoryWriterProps) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [storyText, setStoryText] = useState('');
  const [shrinkStep, setShrinkStep] = useState(0);

  const introFade = useRef(new Animated.Value(1)).current;
  const writeFade = useRef(new Animated.Value(0)).current;
  const frameFade = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const frameOpacity = useRef(new Animated.Value(0)).current;
  const captionOpacity = useRef(new Animated.Value(0)).current;

  // ─── Phase transitions ─────────────────────────

  const handleBeginWriting = useCallback(() => {
    haptics.tap();
    Animated.timing(introFade, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setPhase('write');
      Animated.timing(writeFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    });
  }, [haptics, introFade, writeFade]);

  const handleDoneWriting = useCallback(() => {
    haptics.tap();
    Animated.timing(writeFade, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setPhase('frame');
      setShrinkStep(0);
      scaleAnim.setValue(1);
      frameOpacity.setValue(0);
      captionOpacity.setValue(0);
      Animated.timing(frameFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    });
  }, [haptics, writeFade, frameFade, scaleAnim, frameOpacity, captionOpacity]);

  // ─── Shrink steps ──────────────────────────────

  const handleStepBack = useCallback(() => {
    const nextStep = shrinkStep + 1;
    if (nextStep > 3) return;

    haptics.tap();
    setShrinkStep(nextStep);

    const nextScale = SCALE_STEPS[nextStep];
    Animated.spring(scaleAnim, {
      toValue: nextScale,
      friction: 8,
      useNativeDriver: true,
    }).start();

    if (nextStep === 1) {
      Animated.timing(frameOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }

    if (nextStep === 3) {
      Animated.timing(captionOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }
  }, [shrinkStep, haptics, scaleAnim, frameOpacity, captionOpacity]);

  const handleContinue = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Story Writer',
      response: JSON.stringify({ storyText }),
      type: 'interactive',
    }];
    onComplete(responses);
  }, [haptics, storyText, onComplete]);

  // ─── Intro Phase ───────────────────────────────

  if (phase === 'intro') {
    return (
      <Animated.View style={[s.container, { opacity: introFade }]}>
        <View style={s.centered}>
          <Text style={s.title}>YOUR INNER STORY</Text>
          <Text style={s.description}>
            Our minds are storytellers. They weave narratives about our relationships
            {'\u2014'}who we are, what our partner thinks, what will happen next. Sometimes
            these stories play on repeat, feeling more like truth than thought.
          </Text>
          <Text style={s.descriptionSoft}>
            Let{'\u2019'}s begin by noticing the story.
          </Text>
          <TouchableOpacity style={s.beginButton} onPress={handleBeginWriting} activeOpacity={0.7}>
            <Text style={s.beginButtonText}>BEGIN WRITING</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ─── Write Phase ───────────────────────────────

  if (phase === 'write') {
    return (
      <Animated.View style={[s.container, { opacity: writeFade }]}>
        <ScrollView
          contentContainerStyle={s.writeContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={s.writePrompt}>
            Write the story your mind tells you about your relationship.
            The one that plays on repeat. Start with whatever comes...
          </Text>
          <View style={s.paperContainer}>
            <TextInput
              style={s.paperInput}
              multiline
              textAlignVertical="top"
              placeholder="The story my mind tells is..."
              placeholderTextColor={Colors.textMuted}
              value={storyText}
              onChangeText={setStoryText}
              autoFocus
              scrollEnabled={false}
            />
          </View>
          {storyText.length > 20 && (
            <TouchableOpacity style={s.doneButton} onPress={handleDoneWriting} activeOpacity={0.7}>
              <Text style={s.doneButtonText}>I{'\u2019'}M DONE</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Frame & Shrink Phase ──────────────────────

  const borderWidth = BORDER_WIDTHS[shrinkStep];
  const bgColor = shrinkStep >= 2 ? MC5_PALETTE.softLilac : MC5_PALETTE.paleCloud;

  return (
    <Animated.View style={[s.container, { opacity: frameFade }]}>
      <ScrollView contentContainerStyle={s.frameContent} showsVerticalScrollIndicator={false}>
        <Text style={s.frameInstruction}>
          {shrinkStep < 3 ? 'Tap to step back from your story' : 'Notice the distance'}
        </Text>

        {/* Story Frame */}
        <Animated.View
          style={[
            s.storyFrame,
            {
              backgroundColor: bgColor,
              borderWidth,
              borderColor: shrinkStep >= 2 ? MC5_PALETTE.deepLavender : MC5_PALETTE.lavender,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View style={{ opacity: frameOpacity }}>
            <View style={s.frameLabelRow}>
              <Text style={s.frameLabel}>A STORY</Text>
            </View>
          </Animated.View>
          <Text style={s.storyText} numberOfLines={12}>
            {storyText}
          </Text>
        </Animated.View>

        {/* Caption that appears on step 3 */}
        <Animated.View style={[s.captionContainer, { opacity: captionOpacity }]}>
          <Text style={s.captionText}>This is a story. Not the truth.</Text>
        </Animated.View>

        {/* Step Back or Continue button */}
        {shrinkStep < 3 ? (
          <TouchableOpacity style={s.stepBackButton} onPress={handleStepBack} activeOpacity={0.7}>
            <Text style={s.stepBackButtonText}>STEP BACK</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.continueButton} onPress={handleContinue} activeOpacity={0.7}>
            <Text style={s.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        )}

        {/* Step indicator dots */}
        <View style={s.dotRow}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[s.dot, shrinkStep > i && { backgroundColor: MC5_PALETTE.lavender }]}
            />
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ─── Intro ───────────────────────────────
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
  descriptionSoft: {
    fontSize: FontSizes.body, color: MC5_PALETTE.deepLavender, textAlign: 'center',
    lineHeight: 24, marginTop: Spacing.md, fontStyle: 'italic',
  },
  beginButton: {
    backgroundColor: MC5_PALETTE.deepLavender, paddingVertical: 16, paddingHorizontal: 44,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xxl,
  },
  beginButtonText: {
    color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2,
  },

  // ─── Write ───────────────────────────────
  writeContent: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl,
  },
  writePrompt: {
    fontSize: FontSizes.body, color: MC5_PALETTE.deepLavender, textAlign: 'center',
    lineHeight: 24, marginBottom: Spacing.lg, paddingHorizontal: Spacing.sm,
    fontStyle: 'italic',
  },
  paperContainer: {
    backgroundColor: '#FFFCF7', borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: MC5_PALETTE.softLilac,
    minHeight: 220, ...Shadows.subtle,
  },
  paperInput: {
    fontSize: FontSizes.body, fontFamily: FontFamilies.body, color: Colors.text,
    lineHeight: 26, padding: Spacing.lg, minHeight: 220,
  },
  doneButton: {
    backgroundColor: MC5_PALETTE.deepLavender, paddingVertical: 14, paddingHorizontal: 40,
    borderRadius: BorderRadius.pill, alignSelf: 'center', marginTop: Spacing.xl,
  },
  doneButtonText: {
    color: '#FFF', fontSize: FontSizes.bodySmall, fontWeight: '600', letterSpacing: 2,
  },

  // ─── Frame & Shrink ──────────────────────
  frameContent: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl, alignItems: 'center',
  },
  frameInstruction: {
    fontSize: FontSizes.bodySmall, color: Colors.textMuted, textAlign: 'center',
    letterSpacing: 1, marginBottom: Spacing.xl,
  },
  storyFrame: {
    width: '100%', borderRadius: BorderRadius.lg, padding: Spacing.lg,
    minHeight: 180,
  },
  frameLabelRow: {
    alignItems: 'center', marginBottom: Spacing.sm,
  },
  frameLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 3, color: MC5_PALETTE.lavender,
  },
  storyText: {
    fontSize: FontSizes.bodySmall, color: Colors.textSecondary, lineHeight: 22,
  },
  captionContainer: {
    marginTop: Spacing.lg, alignItems: 'center',
  },
  captionText: {
    fontSize: FontSizes.body, fontStyle: 'italic', color: MC5_PALETTE.deepLavender,
    textAlign: 'center', letterSpacing: 0.5,
  },
  stepBackButton: {
    backgroundColor: MC5_PALETTE.deepLavender, paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xl,
  },
  stepBackButtonText: {
    color: '#FFF', fontSize: FontSizes.bodySmall, fontWeight: '600', letterSpacing: 2,
  },
  continueButton: {
    backgroundColor: Colors.text, paddingVertical: 16, paddingHorizontal: 44,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xl,
  },
  continueButtonText: {
    color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2,
  },
  dotRow: {
    flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg, justifyContent: 'center',
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.borderLight,
  },
});
