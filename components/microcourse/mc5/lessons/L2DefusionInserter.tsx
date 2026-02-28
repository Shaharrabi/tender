/**
 * L2: Defusion Inserter -- "Unhooking from the Story"
 *
 * Takes the user's painful story from L1 and applies three progressive
 * defusion prefixes with typewriter animation. Each prefix creates more
 * psychological distance: the story text shrinks, fades, and retreats
 * behind a lavender frame -- same words, different relationship.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
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

interface L2DefusionInserterProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
  storyText?: string; // From L1 via cascading
}

const DEFUSION_STEPS = [
  { prefix: 'I notice I\'m having the thought that...', button: 'Add First Prefix', scale: 0.95, opacity: 0.9, borderWidth: 0, bg: MC5_PALETTE.softLilac },
  { prefix: 'My mind is telling me the story that...', button: 'Add Second Prefix', scale: 0.85, opacity: 0.75, borderWidth: 1.5, bg: MC5_PALETTE.softLilac },
  { prefix: 'I notice my mind is producing the familiar story that...', button: 'Add Final Prefix', scale: 0.75, opacity: 0.6, borderWidth: 3, bg: MC5_PALETTE.paleCloud },
];

export function L2DefusionInserter({
  content,
  attachmentStyle,
  onComplete,
  storyText: storyTextProp,
}: L2DefusionInserterProps) {
  const haptics = useSoundHaptics();

  // ---- State ----
  const [phase, setPhase] = useState<'input' | 'intro' | 'defusion' | 'done'>(
    storyTextProp ? 'intro' : 'input',
  );
  const [fallbackText, setFallbackText] = useState('');
  const [defusionStep, setDefusionStep] = useState(0); // 0, 1, 2
  const [isTyping, setIsTyping] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [completedPrefixes, setCompletedPrefixes] = useState<string[]>([]);

  const story = storyTextProp || fallbackText;

  // ---- Animated values ----
  const storyScale = useRef(new Animated.Value(1)).current;
  const storyOpacity = useRef(new Animated.Value(1)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Blinking cursor loop
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    );
    blink.start();
    return () => blink.stop();
  }, [cursorOpacity]);

  // Cleanup typewriter on unmount
  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, []);

  // ---- Typewriter ----
  const startTypewriter = useCallback((text: string, onDone: () => void) => {
    let index = 0;
    setDisplayText('');
    setIsTyping(true);
    typewriterRef.current = setInterval(() => {
      index++;
      setDisplayText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(typewriterRef.current!);
        typewriterRef.current = null;
        setIsTyping(false);
        onDone();
      }
    }, 80);
  }, []);

  // ---- Handlers ----
  const handleBeginDefusion = useCallback(() => {
    haptics.tap();
    setPhase('defusion');
  }, [haptics]);

  const handleAddPrefix = useCallback(() => {
    if (isTyping || defusionStep >= DEFUSION_STEPS.length) return;
    haptics.tap();

    const current = DEFUSION_STEPS[defusionStep];
    const prefixText = current.prefix + ' ';

    startTypewriter(prefixText, () => {
      // Animate story visual changes
      Animated.parallel([
        Animated.timing(storyScale, {
          toValue: current.scale, duration: 600, useNativeDriver: true,
        }),
        Animated.timing(storyOpacity, {
          toValue: current.opacity, duration: 600, useNativeDriver: true,
        }),
      ]).start();

      setCompletedPrefixes(prev => [...prev, prefixText]);
      setDisplayText('');
      setDefusionStep(prev => prev + 1);
    });
  }, [isTyping, defusionStep, haptics, startTypewriter, storyScale, storyOpacity]);

  const handleComplete = useCallback(() => {
    haptics.tap();
    const finalPrefix = DEFUSION_STEPS[DEFUSION_STEPS.length - 1].prefix;
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Defusion Inserter',
      response: JSON.stringify({
        originalStory: story,
        finalDefusedText: `${finalPrefix} ${story}`,
      }),
      type: 'interactive',
    }];
    onComplete(responses);
  }, [story, haptics, onComplete]);

  // ---- Derive visual state ----
  const currentVisual = defusionStep > 0
    ? DEFUSION_STEPS[defusionStep - 1]
    : { borderWidth: 0, bg: MC5_PALETTE.softLilac };
  const allDone = defusionStep >= DEFUSION_STEPS.length && !isTyping;

  // ============================================================
  // Phase 0: Story input fallback
  // ============================================================
  if (phase === 'input') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.headerTitle}>UNHOOKING FROM THE STORY</Text>
        <Text style={styles.instruction}>
          Write a painful story your mind tells you about your relationship...
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="My mind tells me that..."
          placeholderTextColor={Colors.textMuted}
          value={fallbackText}
          onChangeText={setFallbackText}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.primaryButton, fallbackText.trim().length <= 20 && styles.buttonDisabled]}
          onPress={() => { haptics.tap(); setPhase('intro'); }}
          disabled={fallbackText.trim().length <= 20}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>CONTINUE</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ============================================================
  // Phase 1: Intro + story display
  // ============================================================
  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>UNHOOKING FROM THE STORY</Text>
        <View style={styles.storyCardIntro}>
          <Text style={styles.storyCardLabel}>YOUR STORY</Text>
          <Text style={styles.storyText}>{story}</Text>
        </View>
        <Text style={styles.instruction}>
          We are going to add three phrases that create space between you and this story.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleBeginDefusion}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>BEGIN DEFUSION</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ============================================================
  // Phase 2: Defusion steps + Phase 3: Done
  // ============================================================
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepIndicator}>
        {allDone ? 'DEFUSION COMPLETE' : `PREFIX ${defusionStep + 1} OF 3`}
      </Text>

      {/* Story card with progressive visual changes */}
      <Animated.View
        style={[
          styles.storyCard,
          {
            backgroundColor: currentVisual.bg,
            borderWidth: currentVisual.borderWidth,
            borderColor: MC5_PALETTE.lavender,
            transform: [{ scale: storyScale }],
            opacity: storyOpacity,
          },
        ]}
      >
        {/* Previously completed prefixes */}
        {completedPrefixes.map((prefix, i) => (
          <Text key={i} style={styles.prefixText}>{prefix}</Text>
        ))}

        {/* Currently typing prefix */}
        {isTyping && (
          <View style={styles.typingRow}>
            <Text style={styles.prefixText}>{displayText}</Text>
            <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>|</Animated.Text>
          </View>
        )}

        {/* The story itself */}
        <Text style={styles.storyText}>{story}</Text>
      </Animated.View>

      {/* Caption after all three */}
      {allDone && (
        <Text style={styles.closingCaption}>
          The story hasn't changed. Your relationship to it has.
        </Text>
      )}

      {/* Action button */}
      {!allDone ? (
        <TouchableOpacity
          style={[styles.primaryButton, isTyping && styles.buttonDisabled]}
          onPress={handleAddPrefix}
          disabled={isTyping}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>
            {DEFUSION_STEPS[defusionStep]?.button.toUpperCase() ?? 'ADD PREFIX'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleComplete}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>CONTINUE</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// ---- Styles ----

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: MC5_PALETTE.cream,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },

  // Header
  headerTitle: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 3,
    color: MC5_PALETTE.deepLavender,
    textAlign: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },

  // Instructions
  instruction: {
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },

  // Step indicator
  stepIndicator: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: Colors.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: Spacing.lg,
  },

  // Text input (fallback)
  textInput: {
    backgroundColor: '#FFFCF7',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: MC5_PALETTE.lavender,
    padding: 14,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 100,
    marginBottom: Spacing.md,
  },

  // Story card -- intro variant (no animation)
  storyCardIntro: {
    backgroundColor: MC5_PALETTE.softLilac,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: MC5_PALETTE.lavender,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  storyCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: MC5_PALETTE.deepLavender,
    marginBottom: Spacing.sm,
  },

  // Story card -- defusion phase (animated)
  storyCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  // Prefix text (italicized, smaller)
  prefixText: {
    fontSize: FontSizes.bodySmall,
    fontStyle: 'italic',
    color: MC5_PALETTE.deepLavender,
    lineHeight: 20,
    marginBottom: 2,
  },

  // Story body text
  storyText: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    color: Colors.text,
    lineHeight: 24,
  },

  // Typing row
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  // Blinking cursor
  cursor: {
    fontSize: FontSizes.bodySmall,
    color: MC5_PALETTE.deepLavender,
    fontWeight: '300',
    marginLeft: 1,
  },

  // Closing caption
  closingCaption: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.accent,
    fontStyle: 'italic',
    color: MC5_PALETTE.deepLavender,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },

  // Buttons
  primaryButton: {
    backgroundColor: MC5_PALETTE.deepLavender,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
