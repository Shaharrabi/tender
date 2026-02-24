/**
 * L5AppreciationLetter — MC13 Lesson 5: "The Appreciation Letter"
 * Users compose a short appreciation letter to their partner
 * using guided prompts and the skills from previous lessons.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { PenIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const LETTER_PROMPTS = [
  { id: 'quality', label: 'A quality I admire about you:', placeholder: 'What character trait do you genuinely admire?' },
  { id: 'moment', label: 'A recent moment that touched me:', placeholder: 'Something they did recently that mattered to you' },
  { id: 'growth', label: 'Something I\'ve watched you grow in:', placeholder: 'A way they\'ve changed or evolved that inspires you' },
  { id: 'grateful', label: 'What I\'m most grateful for:', placeholder: 'The deepest thing you appreciate about having them' },
];

type Phase = 'intro' | 'write' | 'preview' | 'results';

export default function L5AppreciationLetter({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [closingLine, setClosingLine] = useState('');

  const submitAnswer = useCallback(() => {
    if (!currentAnswer.trim()) return;
    haptics.tap();
    setAnswers(prev => [...prev, currentAnswer.trim()]);
    setCurrentAnswer('');
    if (currentPromptIdx < LETTER_PROMPTS.length - 1) {
      setCurrentPromptIdx(i => i + 1);
    } else {
      setPhase('preview');
    }
  }, [haptics, currentAnswer, currentPromptIdx]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const letterText = LETTER_PROMPTS.map((p, i) => `${p.label}\n${answers[i]}`).join('\n\n') + (closingLine ? `\n\n${closingLine}` : '');
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Appreciation letter', response: letterText, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, answers, closingLine, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><PenIcon size={28} color="#E8739E" /></View>
          <Text style={styles.title}>💌 The Appreciation Letter</Text>
          <Text style={styles.subtitle}>Your Capstone Gift</Text>
          <Text style={styles.body}>Research shows that writing appreciation letters increases both the writer's and receiver's happiness for weeks afterward.</Text>
          <Text style={styles.body}>You'll answer 4 prompts, and they'll weave together into a short appreciation letter you can share with your partner — if you choose to.</Text>
          <Text style={styles.body}>This isn't homework. It's a love offering.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('write'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Begin Writing →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'write') {
    const prompt = LETTER_PROMPTS[currentPromptIdx];
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.counter}>{currentPromptIdx + 1} of {LETTER_PROMPTS.length}</Text>
        <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${((currentPromptIdx + 1) / LETTER_PROMPTS.length) * 100}%` }]} /></View>
        <View style={styles.writeCard}>
          <Text style={styles.promptLabel}>{prompt.label}</Text>
          <TextInput
            style={styles.writeInput}
            placeholder={prompt.placeholder}
            placeholderTextColor={Colors.textMuted}
            value={currentAnswer}
            onChangeText={setCurrentAnswer}
            multiline
            autoFocus
          />
          <TouchableOpacity
            style={[styles.primaryBtn, !currentAnswer.trim() && styles.disabledBtn]}
            onPress={submitAnswer}
            disabled={!currentAnswer.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryBtnText}>{currentPromptIdx < LETTER_PROMPTS.length - 1 ? 'Next →' : 'Preview Letter →'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'preview') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.letterCard}>
          <Text style={styles.letterTitle}>Dear Partner,</Text>
          {LETTER_PROMPTS.map((p, i) => (
            <View key={p.id} style={styles.letterSection}>
              <Text style={styles.letterPrompt}>{p.label}</Text>
              <Text style={styles.letterText}>{answers[i]}</Text>
            </View>
          ))}
          <View style={styles.closingSection}>
            <Text style={styles.letterPrompt}>Closing thought (optional):</Text>
            <TextInput
              style={styles.closingInput}
              placeholder="With love, gratitude, appreciation..."
              placeholderTextColor={Colors.textMuted}
              value={closingLine}
              onChangeText={setClosingLine}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('results'); }} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Complete →</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // results
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.resultCard}>
        <Text style={styles.title}>💌 Letter Complete</Text>
        <Text style={styles.insightText}>You just created something your partner would treasure. Studies show appreciation letters boost relationship satisfaction for both the writer and reader.</Text>
        <View style={styles.optionList}>
          <Text style={styles.optionTitle}>What to do with your letter:</Text>
          <View style={styles.optionItem}><Text style={styles.optionEmoji}>💬</Text><Text style={styles.optionText}>Read it aloud to your partner tonight</Text></View>
          <View style={styles.optionItem}><Text style={styles.optionEmoji}>📱</Text><Text style={styles.optionText}>Screenshot and text it to them</Text></View>
          <View style={styles.optionItem}><Text style={styles.optionEmoji}>✍️</Text><Text style={styles.optionText}>Handwrite it and leave it where they'll find it</Text></View>
          <View style={styles.optionItem}><Text style={styles.optionEmoji}>🤫</Text><Text style={styles.optionText}>Keep it for yourself — the writing itself matters</Text></View>
        </View>
        <Text style={styles.body}>The habit of appreciation changes everything. Not because it solves problems — but because it reminds you both why you chose each other.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Finish Course →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: { backgroundColor: '#FFF8F0', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0D4E0', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  resultCard: { backgroundColor: '#FFF8F0', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: '#E8739E', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8739E20', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#E8739E', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill, alignSelf: 'center', marginTop: Spacing.sm },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  disabledBtn: { opacity: 0.4 },
  counter: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, marginBottom: Spacing.md },
  progressFill: { height: 4, backgroundColor: '#E8739E', borderRadius: 2 },
  writeCard: { backgroundColor: '#FFFCF5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0D4E0', gap: Spacing.md, alignItems: 'center' },
  promptLabel: { fontSize: FontSizes.body, fontWeight: '700', color: '#C4547A', textAlign: 'center' },
  writeInput: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 100, backgroundColor: '#FFFCF7', textAlignVertical: 'top' },
  letterCard: { backgroundColor: '#FFF8F0', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: '#E8739E60', gap: Spacing.md, marginBottom: Spacing.md },
  letterTitle: { fontSize: FontSizes.headingS, fontWeight: '600', color: '#C4547A', fontStyle: 'italic' },
  letterSection: { gap: 4 },
  letterPrompt: { fontSize: FontSizes.caption, fontWeight: '700', color: '#E8739E' },
  letterText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, fontStyle: 'italic' },
  closingSection: { gap: Spacing.xs, borderTopWidth: 1, borderTopColor: '#F0D4E0', paddingTop: Spacing.sm },
  closingInput: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.sm, fontSize: FontSizes.body, color: Colors.text, backgroundColor: '#FFFCF7' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
  optionList: { width: '100%', gap: Spacing.sm },
  optionTitle: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: Colors.text },
  optionItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  optionEmoji: { fontSize: 18 },
  optionText: { fontSize: FontSizes.bodySmall, color: Colors.text, flex: 1, lineHeight: 20 },
});
