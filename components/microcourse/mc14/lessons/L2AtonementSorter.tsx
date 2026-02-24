/**
 * L2AtonementSorter — MC14 Lesson 2: "Atonement vs. Apology"
 * Sort statements into genuine atonement vs hollow apology.
 * Learn what real accountability looks like.
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { ScaleIcon } from '@/assets/graphics/icons';
import { MC14_PALETTE } from '@/constants/mc14Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface SortItem { id: number; text: string; type: 'atonement' | 'hollow'; explanation: string }

const SORT_ITEMS: SortItem[] = [
  { id: 1, text: '"I\'m sorry if you felt hurt."', type: 'hollow', explanation: '"If you felt" puts the problem on the other person\'s reaction, not the action. Genuine atonement owns the impact without conditions.' },
  { id: 2, text: '"What I did was wrong. I understand why you can\'t trust me right now."', type: 'atonement', explanation: 'This names the behavior, validates the impact, and accepts the natural consequence (lost trust) without rushing the timeline.' },
  { id: 3, text: '"I said I\'m sorry, what more do you want?"', type: 'hollow', explanation: 'This makes the hurt person feel like a burden for still being in pain. Real atonement is patient with the healing process.' },
  { id: 4, text: '"I\'m taking concrete steps to change. Here\'s what I\'m doing."', type: 'atonement', explanation: 'Words without actions are empty. Genuine atonement includes specific, verifiable behavioral change.' },
  { id: 5, text: '"Everyone makes mistakes. Can we just move on?"', type: 'hollow', explanation: 'Minimizing the wound and rushing past it prevents healing. The betrayed person gets to set the pace.' },
  { id: 6, text: '"I know I can\'t undo this. I\'m committed to earning your trust back, however long it takes."', type: 'atonement', explanation: 'This accepts the permanence of the wound while committing to the slow work of rebuilding. No rushing, no deadline.' },
  { id: 7, text: '"You\'ve done things too, you know."', type: 'hollow', explanation: 'Deflection and whataboutism destroy any possibility of repair. Atonement focuses entirely on one\'s own behavior.' },
  { id: 8, text: '"I understand if you need to talk about this again. I won\'t get frustrated."', type: 'atonement', explanation: 'Betrayal needs to be processed multiple times. Genuine atonement creates space for revisiting without punishment.' },
];

type Phase = 'intro' | 'sort' | 'results';

export default function L2AtonementSorter({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const revealAnim = useRef(new Animated.Value(0)).current;

  const handleSort = useCallback((choice: 'atonement' | 'hollow') => {
    haptics.tap();
    const item = SORT_ITEMS[currentIdx];
    const correct = choice === item.type;
    if (correct) setScore(s => s + 1);
    setUserAnswers(prev => [...prev, choice]);
    setShowExplanation(true);
    revealAnim.setValue(0);
    Animated.spring(revealAnim, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }).start();
  }, [currentIdx, haptics, revealAnim]);

  const nextItem = useCallback(() => {
    haptics.tap();
    setShowExplanation(false);
    if (currentIdx < SORT_ITEMS.length - 1) setCurrentIdx(i => i + 1);
    else setPhase('results');
  }, [haptics, currentIdx]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Atonement sorting score', response: `${score}/${SORT_ITEMS.length}`, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, score, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><ScaleIcon size={28} color="#4A6B8A" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><ScaleIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>Atonement vs. Apology</Text></View>
          <Text style={styles.subtitle}>Learning Real Accountability</Text>
          <Text style={styles.body}>An apology is words. Atonement is a process. Most people confuse the two — and wonder why their partner doesn't "just forgive."</Text>
          <Text style={styles.body}>You'll see 8 statements. Sort each one: is it genuine atonement, or a hollow apology?</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('sort'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Start Sorting →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'results') {
    const pct = Math.round((score / SORT_ITEMS.length) * 100);
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><ScaleIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>Results</Text></View>
          <Text style={styles.scoreText}>{score} of {SORT_ITEMS.length} correct ({pct}%)</Text>
          <View style={styles.keyPrinciples}>
            <Text style={styles.principleTitle}>The 4 Pillars of Genuine Atonement:</Text>
            <Text style={styles.principle}>1. Own the behavior without conditions</Text>
            <Text style={styles.principle}>2. Validate the other person's pain</Text>
            <Text style={styles.principle}>3. Take concrete, verifiable action</Text>
            <Text style={styles.principle}>4. Be patient with the healing timeline</Text>
          </View>
          <Text style={styles.insightText}>Whether you're the one who needs to atone or the one deciding whether atonement is genuine — these pillars are your guide.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // sort phase
  const item = SORT_ITEMS[currentIdx];
  const correct = userAnswers[currentIdx] === item.type;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.counter}>{currentIdx + 1} of {SORT_ITEMS.length}</Text>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${((currentIdx + 1) / SORT_ITEMS.length) * 100}%` }]} /></View>
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>{item.text}</Text>
      </View>

      {!showExplanation ? (
        <View style={styles.sortRow}>
          <TouchableOpacity style={[styles.sortBtn, styles.atonementBtn]} onPress={() => handleSort('atonement')} activeOpacity={0.7}>
            <Text style={styles.sortBtnText}>✓ Genuine Atonement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sortBtn, styles.hollowBtn]} onPress={() => handleSort('hollow')} activeOpacity={0.7}>
            <Text style={styles.sortBtnText}>✗ Hollow Apology</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={[styles.explanationBox, { transform: [{ scale: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }]}>
          <Text style={[styles.resultLabel, { color: correct ? '#5A9E6F' : '#C44A4A' }]}>
            {correct ? '✓ Correct!' : '✗ Not quite'} — {item.type === 'atonement' ? 'Genuine Atonement' : 'Hollow Apology'}
          </Text>
          <Text style={styles.explanationText}>{item.explanation}</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={nextItem} activeOpacity={0.7}>
            <Text style={styles.nextBtnText}>{currentIdx < SORT_ITEMS.length - 1 ? 'Next →' : 'See Results →'}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: { backgroundColor: '#FAFBFD', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#D0D8E0', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#4A6B8A20', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#4A6B8A', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  counter: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, marginBottom: Spacing.md },
  progressFill: { height: 4, backgroundColor: '#4A6B8A', borderRadius: 2 },
  quoteCard: { backgroundColor: '#F0F2F5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#D0D8E0', marginBottom: Spacing.md },
  quoteText: { fontSize: FontSizes.headingS, fontWeight: '500', color: Colors.text, textAlign: 'center', lineHeight: 28, fontStyle: 'italic' },
  sortRow: { gap: Spacing.sm },
  sortBtn: { paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  atonementBtn: { backgroundColor: '#5A9E6F' },
  hollowBtn: { backgroundColor: '#C44A4A' },
  sortBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  explanationBox: { backgroundColor: '#F0F2F5', borderRadius: BorderRadius.md, padding: Spacing.lg, gap: Spacing.sm, alignItems: 'center' },
  resultLabel: { fontWeight: '700', fontSize: FontSizes.body, textAlign: 'center' },
  explanationText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  nextBtn: { backgroundColor: '#4A6B8A', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.pill, marginTop: Spacing.xs },
  nextBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: FontSizes.bodySmall },
  scoreText: { fontSize: FontSizes.headingS, fontWeight: '700', color: '#4A6B8A' },
  keyPrinciples: { backgroundColor: '#C4D4E420', borderRadius: BorderRadius.md, padding: Spacing.md, width: '100%', gap: Spacing.xs },
  principleTitle: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: '#4A6B8A' },
  principle: { fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22, paddingLeft: Spacing.xs },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
