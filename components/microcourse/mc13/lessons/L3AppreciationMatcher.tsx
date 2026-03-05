/**
 * L3AppreciationMatcher — MC13 Lesson 3: "Appreciation Matcher"
 * Users match generic appreciations to specific, meaningful ones.
 * Teaches the power of specific vs vague gratitude.
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC13_PALETTE } from '@/constants/mc13Theme';
import { HeartIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface MatchPair {
  id: number;
  generic: string;
  specific: string;
  why: string;
}

const MATCH_PAIRS: MatchPair[] = [
  { id: 1, generic: '"Thanks for dinner."', specific: '"I noticed you made my favorite pasta tonight even though you were tired. That meant a lot."', why: 'Specific appreciation names the effort, the sacrifice, and the impact. It says: "I see you."' },
  { id: 2, generic: '"You\'re a good parent."', specific: '"The way you sat with Ella when she was upset — you didn\'t try to fix it, you just listened. She needed that."', why: 'Naming the exact behavior tells your partner what they\'re doing right, so they can do more of it.' },
  { id: 3, generic: '"Thanks for helping."', specific: '"You noticed I was overwhelmed and just started folding laundry without me asking. That made me feel like we\'re a real team."', why: 'Specific gratitude reveals what made the act meaningful — it\'s the difference between a receipt and a love letter.' },
  { id: 4, generic: '"I love you."', specific: '"I love how you always check if I\'ve eaten. It\'s small but it makes me feel cared for every single day."', why: '"I love you" is beautiful. But naming WHY makes it land in a completely different way.' },
  { id: 5, generic: '"You look nice."', specific: '"That color makes your eyes look incredible. I couldn\'t stop looking at you across the table."', why: 'Vague compliments bounce off. Specific ones sink in and get remembered for years.' },
];

type Phase = 'intro' | 'match' | 'results';

export default function L3AppreciationMatcher({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [userPicked, setUserPicked] = useState<('generic' | 'specific')[]>([]);
  const revealAnim = useRef(new Animated.Value(0)).current;

  const handlePick = useCallback((choice: 'generic' | 'specific') => {
    haptics.tap();
    setUserPicked(prev => [...prev, choice]);
    setShowReveal(true);
    revealAnim.setValue(0);
    Animated.spring(revealAnim, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }).start();
  }, [haptics, revealAnim]);

  const nextPair = useCallback(() => {
    haptics.tap();
    setShowReveal(false);
    if (currentIdx < MATCH_PAIRS.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setPhase('results');
    }
  }, [haptics, currentIdx]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const specificCount = userPicked.filter(p => p === 'specific').length;
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Chose specific appreciation', response: `${specificCount} of ${MATCH_PAIRS.length} times`, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, userPicked, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><HeartIcon size={28} color="#E8739E" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><HeartIcon size={20} color={MC13_PALETTE.warmRose} /><Text style={styles.title}>Appreciation Matcher</Text></View>
          <Text style={styles.subtitle}>Generic vs. Specific Gratitude</Text>
          <Text style={styles.body}>Research shows that specific appreciation is 3x more impactful than generic praise. It tells your partner: "I notice the details of who you are."</Text>
          <Text style={styles.body}>You'll see 5 pairs. For each, pick which appreciation would land more powerfully — then see why.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('match'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Start Matching →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'results') {
    const specificCount = userPicked.filter(p => p === 'specific').length;
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><HeartIcon size={20} color={MC13_PALETTE.warmRose} /><Text style={styles.title}>Results</Text></View>
          <Text style={styles.scoreText}>You chose specific {specificCount} of {MATCH_PAIRS.length} times</Text>
          <Text style={styles.insightText}>The secret isn't just saying "thank you" more — it's saying it with enough detail that your partner feels truly seen.</Text>
          <View style={styles.formulaBox}>
            <Text style={styles.formulaTitle}>The Formula:</Text>
            <Text style={styles.formulaText}>I noticed + [specific action] + it made me feel + [emotion]</Text>
          </View>
          <Text style={styles.body}>In the next lesson, you'll practice creating your own specific appreciations in real-time.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // match phase
  const pair = MATCH_PAIRS[currentIdx];
  const correct = userPicked[currentIdx] === 'specific';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.counter}>{currentIdx + 1} of {MATCH_PAIRS.length}</Text>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${((currentIdx + 1) / MATCH_PAIRS.length) * 100}%` }]} /></View>
      <Text style={styles.questionText}>Which appreciation would land more powerfully?</Text>

      {!showReveal ? (
        <View style={styles.optionsColumn}>
          <TouchableOpacity style={styles.optionCard} onPress={() => handlePick('generic')} activeOpacity={0.7}>
            <Text style={styles.optionLabel}>Option A</Text>
            <Text style={styles.optionText}>{pair.generic}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard} onPress={() => handlePick('specific')} activeOpacity={0.7}>
            <Text style={styles.optionLabel}>Option B</Text>
            <Text style={styles.optionText}>{pair.specific}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={[styles.revealCard, { transform: [{ scale: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }]}>
          <Text style={[styles.resultLabel, { color: correct ? '#5A9E6F' : '#E8739E' }]}>
            {correct ? '✓ You got it!' : '✗ The specific one lands deeper'}
          </Text>
          <View style={styles.comparisonBox}>
            <View style={styles.comparisonSide}>
              <Text style={styles.comparisonLabel}>Generic</Text>
              <Text style={styles.comparisonText}>{pair.generic}</Text>
            </View>
            <View style={[styles.comparisonSide, styles.comparisonSpecific]}>
              <View style={{flexDirection:'row',alignItems:'center',gap:4}}><Text style={styles.comparisonLabel}>Specific</Text><SparkleIcon size={14} color={MC13_PALETTE.softGold} /></View>
              <Text style={styles.comparisonText}>{pair.specific}</Text>
            </View>
          </View>
          <Text style={styles.whyText}>{pair.why}</Text>
          <TouchableOpacity style={styles.nextBtn} onPress={nextPair} activeOpacity={0.7}>
            <Text style={styles.nextBtnText}>{currentIdx < MATCH_PAIRS.length - 1 ? 'Next Pair →' : 'See Results →'}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.scrollPadBottom },
  card: { backgroundColor: '#FFF8F0', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0D4E0', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8739E20', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#E8739E', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  counter: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, marginBottom: Spacing.md },
  progressFill: { height: 4, backgroundColor: '#E8739E', borderRadius: 2 },
  questionText: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm },
  optionsColumn: { gap: Spacing.md },
  optionCard: { backgroundColor: '#FFFCF5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.border, gap: Spacing.xs },
  optionLabel: { fontSize: FontSizes.caption, fontWeight: '700', color: '#E8739E' },
  optionText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, fontStyle: 'italic' },
  revealCard: { backgroundColor: '#FFF8F0', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0D4E0', gap: Spacing.md, alignItems: 'center' },
  resultLabel: { fontWeight: '700', fontSize: FontSizes.body },
  comparisonBox: { width: '100%', gap: Spacing.sm },
  comparisonSide: { padding: Spacing.sm, borderRadius: BorderRadius.md, backgroundColor: '#FFF0F0' },
  comparisonSpecific: { backgroundColor: '#F0FFF0', borderWidth: 1, borderColor: '#5A9E6F40' },
  comparisonLabel: { fontSize: FontSizes.caption, fontWeight: '700', color: Colors.textSecondary, marginBottom: 2 },
  comparisonText: { fontSize: FontSizes.bodySmall, color: Colors.text, fontStyle: 'italic', lineHeight: 20 },
  whyText: { fontSize: FontSizes.body, color: '#5A9E6F', lineHeight: 24, textAlign: 'center', fontWeight: '500' },
  nextBtn: { backgroundColor: '#E8739E', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.pill },
  nextBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: FontSizes.bodySmall },
  scoreText: { fontSize: FontSizes.headingS, fontWeight: '700', color: '#E8739E' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
  formulaBox: { backgroundColor: '#FFE0E8', borderRadius: BorderRadius.md, padding: Spacing.md, width: '100%', gap: Spacing.xs },
  formulaTitle: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: '#C4547A' },
  formulaText: { fontSize: FontSizes.body, color: Colors.text, fontStyle: 'italic', textAlign: 'center' },
});
