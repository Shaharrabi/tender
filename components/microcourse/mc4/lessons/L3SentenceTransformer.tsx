/**
 * L3: Sentence Transformer — "You always..." to I-statement builder
 *
 * A 4-step progressive exercise that guides the user from a raw
 * complaint ("You always/never...") into a healthy I-statement:
 *   "When [situation], I feel [emotion]. I need [need]."
 *
 * Previous steps are shown dimmed above the current step so the
 * user can see their journey from blame to connection.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC4_PALETTE } from '@/constants/mc4Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface L3SentenceTransformerProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

const EMOTIONS = [
  'Hurt', 'Anxious', 'Frustrated', 'Lonely', 'Overwhelmed',
  'Invisible', 'Angry', 'Scared', 'Sad', 'Dismissed',
  'Exhausted', 'Confused', 'Ashamed', 'Vulnerable', 'Resentful',
  'Unappreciated', 'Hopeless', 'Disconnected', 'Betrayed', 'Numb',
];

const NEEDS = [
  'Reassurance', 'Space', 'Appreciation', 'Honesty',
  'Patience', 'Presence', 'Understanding', 'Support',
];

export function L3SentenceTransformer({
  content,
  attachmentStyle,
  onComplete,
}: L3SentenceTransformerProps) {
  const haptics = useSoundHaptics();

  const [step, setStep] = useState(0);
  const [rawComplaint, setRawComplaint] = useState('');
  const [situation, setSituation] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [customEmotion, setCustomEmotion] = useState('');
  const [selectedNeed, setSelectedNeed] = useState('');
  const [customNeed, setCustomNeed] = useState('');
  const [showReveal, setShowReveal] = useState(false);

  const revealAnim = useRef(new Animated.Value(0)).current;

  const emotion = selectedEmotion || customEmotion;
  const need = selectedNeed || customNeed;

  const advanceStep = useCallback((nextStep: number) => {
    haptics.tap();
    setStep(nextStep);
  }, [haptics]);

  const handleSelectNeed = useCallback((n: string) => {
    haptics.tap();
    setSelectedNeed(n);
    setCustomNeed('');
    // Show reveal after short delay
    setTimeout(() => {
      setShowReveal(true);
      Animated.timing(revealAnim, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }).start();
    }, 300);
  }, [haptics, revealAnim]);

  const handleCustomNeed = useCallback((text: string) => {
    setCustomNeed(text);
    setSelectedNeed('');
    if (text.trim().length > 0) {
      if (!showReveal) {
        setTimeout(() => {
          setShowReveal(true);
          Animated.timing(revealAnim, {
            toValue: 1, duration: 500, useNativeDriver: true,
          }).start();
        }, 300);
      }
    } else {
      // If user clears text, hide reveal
      setShowReveal(false);
      revealAnim.setValue(0);
    }
  }, [showReveal, revealAnim]);

  const handleComplete = useCallback(() => {
    haptics.playConfetti();
    const fullStatement = `When ${situation}, I feel ${emotion.toLowerCase()}. I need ${need.toLowerCase()}.`;
    const stepResponses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Sentence Transformer',
      response: JSON.stringify({
        original: rawComplaint,
        situation,
        emotion,
        need,
        fullStatement,
      }),
      type: 'interactive',
    }];
    onComplete(stepResponses);
  }, [rawComplaint, situation, emotion, need, haptics, onComplete]);

  // ─── Render helpers ─────────────────────────────────────

  const renderDimmedPrevious = (label: string, value: string) => (
    <View style={styles.dimmedBlock}>
      <Text style={styles.dimmedLabel}>{label}</Text>
      <Text style={styles.dimmedValue}>{value}</Text>
    </View>
  );

  // ─── Step 0: Intro ─────────────────────────────────────

  if (step === 0) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>TRANSFORM YOUR WORDS</Text>
        <Text style={styles.introDescription}>
          Most arguments start with blame. In four steps, you will transform
          a complaint into an I-statement that invites connection instead of defense.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => advanceStep(1)}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>BEGIN</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Steps 1-4 ─────────────────────────────────────────

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepIndicator}>Step {step} of 4</Text>

      {/* ── Step 1: Raw Complaint ── */}
      {step >= 2 && renderDimmedPrevious('Your complaint:', rawComplaint)}

      {step === 1 && (
        <View>
          <Text style={styles.stepPrompt}>
            Write something your partner does that frustrates you, starting
            with "You always..." or "You never..."
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder='You always...'
            placeholderTextColor={Colors.textMuted}
            value={rawComplaint}
            onChangeText={setRawComplaint}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.primaryButton, rawComplaint.trim().length <= 10 && styles.buttonDisabled]}
            onPress={() => advanceStep(2)}
            disabled={rawComplaint.trim().length <= 10}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Step 2: Situation ── */}
      {step >= 3 && renderDimmedPrevious('Situation:', `When ${situation}`)}

      {step === 2 && (
        <View>
          <Text style={styles.stepPrompt}>
            Now describe the specific situation. When does this happen?
          </Text>
          <Text style={styles.templateHint}>When [___]...</Text>
          <TextInput
            style={styles.textInput}
            placeholder='e.g. I come home after a long day and...'
            placeholderTextColor={Colors.textMuted}
            value={situation}
            onChangeText={setSituation}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.primaryButton, situation.trim().length <= 5 && styles.buttonDisabled]}
            onPress={() => advanceStep(3)}
            disabled={situation.trim().length <= 5}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Step 3: Emotion Picker ── */}
      {step >= 4 && renderDimmedPrevious('Emotion:', emotion)}

      {step === 3 && (
        <View>
          <Text style={styles.stepPrompt}>How does this make you feel?</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipScrollContent}
          >
            {EMOTIONS.map(e => (
              <TouchableOpacity
                key={e}
                style={[
                  styles.emotionChip,
                  selectedEmotion === e && styles.emotionChipSelected,
                ]}
                onPress={() => {
                  haptics.tap();
                  setSelectedEmotion(e);
                  setCustomEmotion('');
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.emotionChipText,
                  selectedEmotion === e && styles.emotionChipTextSelected,
                ]}>
                  {e}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            style={[styles.textInput, styles.smallInput]}
            placeholder='Or type your own emotion...'
            placeholderTextColor={Colors.textMuted}
            value={customEmotion}
            onChangeText={(text) => {
              setCustomEmotion(text);
              if (text.trim()) setSelectedEmotion('');
            }}
          />

          <TouchableOpacity
            style={[styles.primaryButton, !emotion && styles.buttonDisabled]}
            onPress={() => advanceStep(4)}
            disabled={!emotion}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Step 4: Need + Reveal ── */}
      {step === 4 && (
        <View>
          <Text style={styles.stepPrompt}>What do you need from your partner?</Text>

          <View style={styles.needChipsWrap}>
            {NEEDS.map(n => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.needChip,
                  selectedNeed === n && styles.needChipSelected,
                ]}
                onPress={() => handleSelectNeed(n)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.needChipText,
                  selectedNeed === n && styles.needChipTextSelected,
                ]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.textInput, styles.smallInput]}
            placeholder='Or type your own need...'
            placeholderTextColor={Colors.textMuted}
            value={customNeed}
            onChangeText={handleCustomNeed}
          />

          {/* ── Reveal Card ── */}
          {showReveal && need && (
            <Animated.View style={[styles.revealCard, { opacity: revealAnim }]}>
              <Text style={styles.revealLabel}>YOUR I-STATEMENT</Text>
              <Text style={styles.revealText}>
                When {situation}, I feel {emotion.toLowerCase()}.
                {'\n'}I need {need.toLowerCase()}.
              </Text>
            </Animated.View>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, !need && styles.buttonDisabled]}
            onPress={handleComplete}
            disabled={!need}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>COMPLETE</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: MC4_PALETTE.cream,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },

  // ─── Intro ──────────────────────
  headerTitle: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 3,
    color: MC4_PALETTE.deepTeal,
    textAlign: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  introDescription: {
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },

  // ─── Step indicator ─────────────
  stepIndicator: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: Colors.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: Spacing.lg,
  },

  // ─── Prompts ────────────────────
  stepPrompt: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 28,
  },
  templateHint: {
    fontSize: FontSizes.bodySmall,
    fontStyle: 'italic',
    color: MC4_PALETTE.teal,
    marginBottom: Spacing.sm,
  },

  // ─── Dimmed previous ────────────
  dimmedBlock: {
    opacity: 0.4,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.xs,
    borderLeftWidth: 2,
    borderLeftColor: MC4_PALETTE.teal,
    paddingLeft: Spacing.sm,
  },
  dimmedLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dimmedValue: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontStyle: 'italic',
  },

  // ─── Text inputs ────────────────
  textInput: {
    backgroundColor: '#FFFCF7',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: MC4_PALETTE.teal,
    padding: 14,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 80,
    marginBottom: Spacing.md,
  },
  smallInput: {
    minHeight: 44,
    marginTop: Spacing.sm,
  },

  // ─── Emotion chips ──────────────
  chipScroll: {
    marginBottom: Spacing.xs,
  },
  chipScrollContent: {
    paddingRight: Spacing.lg,
    gap: Spacing.xs,
  },
  emotionChip: {
    borderWidth: 1.5,
    borderColor: MC4_PALETTE.teal,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  emotionChipSelected: {
    backgroundColor: MC4_PALETTE.teal,
  },
  emotionChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: MC4_PALETTE.teal,
  },
  emotionChipTextSelected: {
    color: '#FFF',
  },

  // ─── Need chips ─────────────────
  needChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  needChip: {
    borderWidth: 1.5,
    borderColor: MC4_PALETTE.warmAmber,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  needChipSelected: {
    backgroundColor: MC4_PALETTE.warmAmber,
  },
  needChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: MC4_PALETTE.warmAmber,
  },
  needChipTextSelected: {
    color: '#FFF',
  },

  // ─── Reveal card ────────────────
  revealCard: {
    backgroundColor: MC4_PALETTE.softMint,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: MC4_PALETTE.teal,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  revealLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: MC4_PALETTE.deepTeal,
    marginBottom: Spacing.sm,
  },
  revealText: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.accent,
    color: MC4_PALETTE.deepTeal,
    lineHeight: 30,
  },

  // ─── Buttons ────────────────────
  primaryButton: {
    backgroundColor: MC4_PALETTE.deepTeal,
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
