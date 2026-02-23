/**
 * L4GratitudeLetter — MC10 Lesson 4
 *
 * 5-section guided gratitude letter. Each prompt appears one at a time.
 * User writes. Assembled into a beautiful letter card.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC10_PALETTE } from '@/constants/mc10Theme';
import { PenIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const LETTER_SECTIONS = [
  { id: 'noticed', prompt: 'What I noticed about you this week...', placeholder: 'Something specific you observed about your partner recently...' },
  { id: 'feel', prompt: 'The way you make me feel when...', placeholder: 'A specific moment and the feeling it created...' },
  { id: 'appreciate', prompt: "Something you don't know I appreciate...", placeholder: 'A hidden gratitude you haven\'t shared yet...' },
  { id: 'memory', prompt: 'A memory of us that I carry...', placeholder: 'A cherished memory that stays with you...' },
  { id: 'know', prompt: 'What I want you to know is...', placeholder: 'The deepest thing you want them to understand...' },
];

type Phase = 'intro' | 'write' | 'letter' | 'done';

export default function L4GratitudeLetter({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [texts, setTexts] = useState<string[]>(Array(LETTER_SECTIONS.length).fill(''));
  const [currentText, setCurrentText] = useState('');
  const introFade = useRef(new Animated.Value(0)).current;
  const sectionFade = useRef(new Animated.Value(0)).current;
  const letterFadeAnims = useRef(LETTER_SECTIONS.map(() => new Animated.Value(0))).current;

  useEffect(() => { if (phase === 'intro') Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, [phase]);
  useEffect(() => { if (phase === 'write') { sectionFade.setValue(0); Animated.timing(sectionFade, { toValue: 1, duration: 300, useNativeDriver: true }).start(); } }, [phase, sectionIndex]);

  useEffect(() => {
    if (phase === 'letter') {
      letterFadeAnims.forEach((anim, i) => {
        setTimeout(() => Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }).start(), i * 200);
      });
    }
  }, [phase]);

  const startWrite = useCallback(() => { haptics.tap(); setPhase('write'); }, [haptics]);

  const handleNextSection = useCallback(() => {
    if (!currentText.trim()) return;
    haptics.tap();
    const updated = [...texts];
    updated[sectionIndex] = currentText.trim();
    setTexts(updated);

    const next = sectionIndex + 1;
    if (next >= LETTER_SECTIONS.length) {
      haptics.playExerciseReveal();
      setPhase('letter');
    } else {
      setSectionIndex(next);
      setCurrentText('');
    }
  }, [sectionIndex, currentText, texts, haptics]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const letter = LETTER_SECTIONS.map((s, i) => `${s.prompt}\n${texts[i]}`).join('\n\n');
    const responses: StepResponseEntry[] = [{ step: 1, prompt: 'Gratitude Letter', response: JSON.stringify({ sections: LETTER_SECTIONS.map((s, i) => ({ prompt: s.prompt, text: texts[i] })), fullLetter: letter }), type: 'game' }];
    onComplete(responses);
  }, [texts, onComplete, haptics]);

  const renderIntro = () => {
    const paragraphs = content.readContent ? content.readContent.split('\n').filter((p: string) => p.trim()) : [];
    return (
      <Animated.View style={[styles.phase, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}><PenIcon size={28} color={MC10_PALETTE.deepViolet} /><Text style={styles.introTitle}>Gratitude Letter</Text></View>
          {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => <Text key={i} style={styles.bodyText}>{p.trim()}</Text>) : (
            <Text style={styles.bodyText}>One of the most powerful ways to make your partner feel seen is to tell them — specifically — what you notice, appreciate, and cherish about them. You'll write a guided gratitude letter, one section at a time.</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startBtn} onPress={startWrite} activeOpacity={0.8}><Text style={styles.startBtnText}>Start Writing</Text></TouchableOpacity>
      </Animated.View>
    );
  };

  const renderWrite = () => {
    const section = LETTER_SECTIONS[sectionIndex];
    return (
      <Animated.View style={[styles.phase, { opacity: sectionFade }]}>
        <View style={styles.progressRow}>{LETTER_SECTIONS.map((_, i) => <View key={i} style={[styles.dot, i < sectionIndex && styles.dotDone, i === sectionIndex && styles.dotCurrent]} />)}</View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.writeContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionPrompt}>{section.prompt}</Text>
          <View style={styles.inputBox}>
            <TextInput style={styles.input} placeholder={section.placeholder} placeholderTextColor={Colors.textMuted} value={currentText} onChangeText={setCurrentText} multiline textAlignVertical="top" />
          </View>
        </ScrollView>

        <TouchableOpacity style={[styles.nextBtn, !currentText.trim() && styles.nextBtnDisabled]} onPress={handleNextSection} activeOpacity={0.8} disabled={!currentText.trim()}>
          <Text style={styles.nextBtnText}>{sectionIndex + 1 < LETTER_SECTIONS.length ? 'Next Section' : 'See Your Letter'}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderLetter = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.letterHeader}><SparkleIcon size={32} color={MC10_PALETTE.warmGold} /><Text style={styles.letterTitle}>Your Gratitude Letter</Text></View>

      <View style={styles.letterCard}>
        {LETTER_SECTIONS.map((s, i) => (
          <Animated.View key={s.id} style={[styles.letterSection, { opacity: letterFadeAnims[i] }]}>
            <Text style={styles.letterPrompt}>{s.prompt}</Text>
            <Text style={styles.letterText}>{texts[i]}</Text>
          </Animated.View>
        ))}
      </View>

      <Text style={styles.letterInsight}>This letter captures how you truly see your partner. Consider sharing it with them — or keeping it as a reminder of why you chose each other.</Text>
      <TouchableOpacity style={styles.continueBtn} onPress={handleFinish} activeOpacity={0.8}><Text style={styles.continueBtnText}>Continue</Text></TouchableOpacity>
    </ScrollView>
  );

  return <View style={styles.container}>{phase === 'intro' && renderIntro()}{phase === 'write' && renderWrite()}{(phase === 'letter' || phase === 'done') && renderLetter()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phase: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.lg },
  writeContent: { paddingTop: Spacing.md, paddingBottom: Spacing.xxxl },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  bodyText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.borderLight },
  dotDone: { backgroundColor: MC10_PALETTE.deepViolet },
  dotCurrent: { backgroundColor: MC10_PALETTE.warmGold, width: 14, height: 14, borderRadius: 7 },
  sectionPrompt: { fontFamily: FontFamilies.accent, fontSize: FontSizes.headingM, color: MC10_PALETTE.deepVioletDark, marginBottom: Spacing.lg, lineHeight: 28 },
  inputBox: { borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: MC10_PALETTE.warmGold + '60', backgroundColor: MC10_PALETTE.letterBg, overflow: 'hidden' },
  input: { padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 140, lineHeight: 24 },
  nextBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.lg, ...Shadows.subtle },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  letterHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  letterTitle: { fontFamily: FontFamilies.accent, fontSize: FontSizes.headingL, color: MC10_PALETTE.warmGoldDark, fontWeight: '600' },
  letterCard: { backgroundColor: MC10_PALETTE.letterBg, borderRadius: BorderRadius.xl, padding: Spacing.xl, borderWidth: 2, borderColor: MC10_PALETTE.warmGold, ...Shadows.elevated, gap: Spacing.lg, marginBottom: Spacing.lg },
  letterSection: { gap: 4 },
  letterPrompt: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: MC10_PALETTE.warmGoldDark, fontWeight: '600', fontStyle: 'italic' },
  letterText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26 },
  letterInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: Spacing.lg },
  continueBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
