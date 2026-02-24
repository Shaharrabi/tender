/**
 * L2SensoryTreasureHunt — MC11 Lesson 2: "The 45-Second Reset"
 * Interactive sensory orientation game — 5 senses in sequence.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { CompassIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface Sense { id: string; label: string; emoji: string; categories: string[]; optional?: boolean }

const SENSES: Sense[] = [
  { id: 'see', label: 'SEE', emoji: '👁️', categories: ['A color', 'A shape', 'Movement', 'Light/shadow'] },
  { id: 'hear', label: 'HEAR', emoji: '👂', categories: ['A close sound', 'A distant sound', 'A rhythmic sound'] },
  { id: 'feel', label: 'FEEL', emoji: '✋', categories: ['Temperature', 'Texture', 'Your feet on the floor'] },
  { id: 'smell', label: 'SMELL', emoji: '👃', categories: ['Something pleasant', 'Something neutral'], optional: true },
  { id: 'taste', label: 'TASTE', emoji: '👅', categories: ['Anything in your mouth?'], optional: true },
];

const CHECKIN_OPTIONS = ['A little calmer', 'More present', 'Surprisingly settled', 'Not much different', 'Actually more activated'];

type Phase = 'intro' | 'hunt' | 'checkin' | 'results';

export default function L2SensoryTreasureHunt({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [senseIdx, setSenseIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [responses, setResponses] = useState<{ sense: string; category: string; note: string }[]>([]);
  const [checkinAnswer, setCheckinAnswer] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentSense = SENSES[senseIdx];

  const startHunt = useCallback(() => { haptics.tap(); setPhase('hunt'); }, [haptics]);

  const submitSense = useCallback(() => {
    haptics.tap();
    setResponses(prev => [...prev, { sense: currentSense.id, category: selectedCategory || 'skipped', note: noteText.trim() }]);
    setSelectedCategory(null);
    setNoteText('');
    if (senseIdx < SENSES.length - 1) {
      setSenseIdx(i => i + 1);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      setPhase('checkin');
    }
  }, [haptics, currentSense, selectedCategory, noteText, senseIdx, fadeAnim]);

  const skipSense = useCallback(() => {
    haptics.tap();
    setResponses(prev => [...prev, { sense: currentSense.id, category: 'skipped', note: '' }]);
    setSelectedCategory(null);
    setNoteText('');
    if (senseIdx < SENSES.length - 1) {
      setSenseIdx(i => i + 1);
    } else {
      setPhase('checkin');
    }
  }, [haptics, currentSense, senseIdx]);

  const submitCheckin = useCallback((answer: string) => {
    haptics.tap();
    setCheckinAnswer(answer);
    setPhase('results');
  }, [haptics]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = responses.map((r, i) => ({
      step: i + 1, prompt: `${SENSES[i].label}: What did you notice?`, response: JSON.stringify(r), type: 'interactive' as const,
    }));
    steps.push({ step: responses.length + 1, prompt: 'Body check-in after orienting', response: checkinAnswer, type: 'interactive' });
    onComplete(steps);
  }, [haptics, responses, checkinAnswer, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><CompassIcon size={28} color="#DAA520" /></View>
          <Text style={styles.title}>🧭 Sensory Treasure Hunt</Text>
          <Text style={styles.subtitle}>The 45-Second Reset</Text>
          <Text style={styles.body}>Look around your actual environment. You're going to find one thing for each sense — a quick orientation that brings you from your head to right here.</Text>
          <Text style={styles.body}>5 senses. About 45 seconds. Let's see what happens in your body.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={startHunt} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Begin the Hunt →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'hunt') {
    return (
      <Animated.View style={[styles.huntContainer, { opacity: fadeAnim }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.senseProgress}>{senseIdx + 1} of {SENSES.length}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((senseIdx + 1) / SENSES.length) * 100}%` }]} />
          </View>
          <View style={styles.card}>
            <Text style={styles.senseEmoji}>{currentSense.emoji}</Text>
            <Text style={styles.senseLabel}>Something you {currentSense.label}</Text>
            <Text style={styles.body}>Look around right now. Pick one:</Text>
            <View style={styles.categoryGrid}>
              {currentSense.categories.map(cat => (
                <TouchableOpacity key={cat} style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]} onPress={() => { haptics.tap(); setSelectedCategory(cat); }} activeOpacity={0.7}>
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.input} placeholder="What did you notice? (optional)" placeholderTextColor={Colors.textMuted} value={noteText} onChangeText={setNoteText} multiline />
            <View style={styles.btnRow}>
              {currentSense.optional && (
                <TouchableOpacity style={styles.skipBtn} onPress={skipSense} activeOpacity={0.7}>
                  <Text style={styles.skipBtnText}>Skip</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.primaryBtn, !selectedCategory && styles.disabledBtn]} onPress={submitSense} activeOpacity={0.7} disabled={!selectedCategory}>
                <Text style={styles.primaryBtnText}>{senseIdx < SENSES.length - 1 ? 'Next Sense →' : 'Complete →'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    );
  }

  if (phase === 'checkin') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>✨ Check In With Your Body</Text>
          <Text style={styles.body}>After orienting through your senses... how do you feel compared to when you started?</Text>
          <View style={styles.optionList}>
            {CHECKIN_OPTIONS.map(opt => (
              <TouchableOpacity key={opt} style={styles.optionBtn} onPress={() => submitCheckin(opt)} activeOpacity={0.7}>
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>Any response is valid</Text>
        </View>
      </ScrollView>
    );
  }

  // results
  const completedSenses = responses.filter(r => r.category !== 'skipped').length;
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.title}>🧭 Hunt Complete!</Text>
        <Text style={styles.body}>You oriented through {completedSenses} sense{completedSenses !== 1 ? 's' : ''} and you feel: {checkinAnswer.toLowerCase()}</Text>
        <Text style={styles.body}>This is what orientation does — it moves your attention from internal chatter to present-moment sensation. Your nervous system reads this as safety.</Text>
        <Text style={styles.insightText}>The 45-second reset is always available to you. No app needed — just your senses and your environment.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  huntContainer: { flex: 1 },
  card: { backgroundColor: '#FFF8E7', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F5E6B8', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#DAA52020', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  senseProgress: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, marginBottom: Spacing.md },
  progressFill: { height: 4, backgroundColor: '#DAA520', borderRadius: 2 },
  senseEmoji: { fontSize: 48 },
  senseLabel: { fontSize: FontSizes.headingS, fontWeight: '700', color: Colors.text },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
  categoryChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: 'transparent' },
  categoryChipActive: { borderColor: '#DAA520', backgroundColor: '#DAA52015' },
  categoryText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontWeight: '500' },
  categoryTextActive: { color: '#DAA520', fontWeight: '600' },
  input: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 60, backgroundColor: '#FFFCF7' },
  btnRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  primaryBtn: { backgroundColor: '#DAA520', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  disabledBtn: { opacity: 0.4 },
  skipBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: Colors.border },
  skipBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: FontSizes.bodySmall },
  optionList: { gap: Spacing.sm, width: '100%' },
  optionBtn: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FFFDF5' },
  optionText: { fontSize: FontSizes.body, color: Colors.text, textAlign: 'center' },
  hint: { fontSize: FontSizes.caption, color: Colors.textMuted, fontStyle: 'italic' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
