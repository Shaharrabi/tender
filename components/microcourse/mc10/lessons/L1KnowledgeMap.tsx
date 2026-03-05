/**
 * L1KnowledgeMap — MC10 Lesson 1
 *
 * 6 "Love Map" categories in a 2x3 grid. User taps each category to reveal
 * questions about their partner. Answers create a "knowledge score" shown
 * as a compass visualization.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC10_PALETTE } from '@/constants/mc10Theme';
import { CompassIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface CategoryQuestion { question: string; options: string[] }
interface Category { id: string; label: string; icon: string; questions: CategoryQuestion[] }

const CATEGORIES: Category[] = [
  { id: 'dreams', label: 'Dreams', icon: 'star', questions: [
    { question: "What is your partner's biggest dream for the next 5 years?", options: ['Career change', 'Travel adventure', 'Start a family/project', "I'm not sure"] },
    { question: "What did your partner want to be when they were a child?", options: ['Doctor/Scientist', 'Artist/Musician', 'Teacher/Helper', "I don't know"] },
  ]},
  { id: 'fears', label: 'Fears', icon: 'shield', questions: [
    { question: "What is your partner most afraid of in your relationship?", options: ['Being abandoned', 'Losing independence', 'Not being enough', "I'm not sure"] },
    { question: "What situation makes your partner most anxious?", options: ['Financial stress', 'Social situations', 'Health concerns', "I don't know"] },
  ]},
  { id: 'joys', label: 'Joys', icon: 'sparkle', questions: [
    { question: "What activity makes your partner lose track of time?", options: ['Creative projects', 'Outdoor activities', 'Reading/Learning', "I'm not sure"] },
    { question: "What's a small thing that always makes them smile?", options: ['A specific food/drink', 'Animals/Nature', 'Music/Shows', "I don't know"] },
  ]},
  { id: 'stressors', label: 'Stressors', icon: 'cloud', questions: [
    { question: "What's your partner's biggest source of stress right now?", options: ['Work pressure', 'Family dynamics', 'Financial concerns', "I'm not sure"] },
    { question: "How does your partner typically cope with stress?", options: ['Talks it out', 'Withdraws/Needs space', 'Gets busy/Active', "I don't know"] },
  ]},
  { id: 'memories', label: 'Memories', icon: 'heart', questions: [
    { question: "What's your partner's happiest childhood memory?", options: ['Family vacation', 'Achievement/Win', 'Time with friends', "I don't know"] },
    { question: "What's a memory from your relationship they bring up often?", options: ['A trip together', 'When you first met', 'A funny moment', "I'm not sure"] },
  ]},
  { id: 'hopes', label: 'Hopes', icon: 'sun', questions: [
    { question: "What does your partner hope your relationship looks like in 10 years?", options: ['Deeply connected', 'Adventure partners', 'Stable foundation', "I'm not sure"] },
    { question: "What's one thing they hope to change about themselves?", options: ['More patient', 'More confident', 'More present', "I don't know"] },
  ]},
];

type Phase = 'intro' | 'explore' | 'results';

interface CategoryProgress { categoryId: string; answered: number; total: number; responses: string[] }

export function L1KnowledgeMap({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [progress, setProgress] = useState<CategoryProgress[]>([]);
  const introFade = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { if (phase === 'intro') Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, [phase]);

  const startExplore = useCallback(() => { haptics.tap(); setPhase('explore'); }, [haptics]);

  const handleCategoryTap = useCallback((cat: Category) => {
    if (progress.find(p => p.categoryId === cat.id)) return;
    haptics.tap();
    setActiveCategory(cat);
    setQuestionIndex(0);
    flipAnim.setValue(0);
    Animated.spring(flipAnim, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }).start();
  }, [progress, haptics, flipAnim]);

  const handleAnswer = useCallback((answer: string) => {
    haptics.tap();
    if (!activeCategory) return;
    const catProg = progress.find(p => p.categoryId === activeCategory.id);
    const responses = catProg ? [...catProg.responses, answer] : [answer];
    const nextQ = questionIndex + 1;

    if (nextQ >= activeCategory.questions.length) {
      const updated = progress.filter(p => p.categoryId !== activeCategory.id);
      updated.push({ categoryId: activeCategory.id, answered: activeCategory.questions.length, total: activeCategory.questions.length, responses });
      setProgress(updated);
      setActiveCategory(null);
      haptics.playExerciseReveal();
    } else {
      const updated = progress.filter(p => p.categoryId !== activeCategory.id);
      updated.push({ categoryId: activeCategory.id, answered: nextQ, total: activeCategory.questions.length, responses });
      setProgress(updated);
      setQuestionIndex(nextQ);
    }
  }, [activeCategory, questionIndex, progress, haptics]);

  const allDone = progress.length === CATEGORIES.length && progress.every(p => p.answered === p.total);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const knewCount = progress.reduce((sum, p) => sum + p.responses.filter(r => !r.includes("not sure") && !r.includes("don't know")).length, 0);
    const totalQ = CATEGORIES.reduce((sum, c) => sum + c.questions.length, 0);
    const responses: StepResponseEntry[] = [{ step: 1, prompt: 'Knowledge Map', response: JSON.stringify({ knewCount, totalQuestions: totalQ, categories: progress.map(p => ({ category: p.categoryId, responses: p.responses })) }), type: 'game' }];
    onComplete(responses);
  }, [progress, onComplete, haptics]);

  const renderIntro = () => {
    const paragraphs = content.readContent ? content.readContent.split('\n').filter((p: string) => p.trim()) : [];
    return (
      <Animated.View style={[styles.phase, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}><CompassIcon size={28} color={MC10_PALETTE.deepViolet} /><Text style={styles.introTitle}>Knowledge Map</Text></View>
          {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => <Text key={i} style={styles.bodyText}>{p.trim()}</Text>) : (
            <Text style={styles.bodyText}>How well do you really know your partner? Dr. Gottman's "Love Maps" research shows that happy couples have a rich understanding of each other's inner world. Tap each category to test your knowledge — and discover where there's more to explore together.</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startBtn} onPress={startExplore} activeOpacity={0.8}><Text style={styles.startBtnText}>Start Mapping</Text></TouchableOpacity>
      </Animated.View>
    );
  };

  const renderExplore = () => (
    <View style={styles.phase}>
      <Text style={styles.exploreProgress}>{progress.filter(p => p.answered === p.total).length}/{CATEGORIES.length} categories explored</Text>

      {!activeCategory ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>{CATEGORIES.map(cat => {
            const done = progress.find(p => p.categoryId === cat.id && p.answered === p.total);
            return (
              <TouchableOpacity key={cat.id} style={[styles.catCard, done && styles.catCardDone]} onPress={() => handleCategoryTap(cat)} activeOpacity={0.7} disabled={!!done}>
                <Text style={[styles.catLabel, done && styles.catLabelDone]}>{cat.label}</Text>
                {done && <Text style={styles.catCheck}>{'\u2713'}</Text>}
              </TouchableOpacity>
            );
          })}</View>
          {allDone && (
            <TouchableOpacity style={styles.seeResultsBtn} onPress={() => setPhase('results')} activeOpacity={0.8}><Text style={styles.seeResultsBtnText}>See Your Map</Text></TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <Animated.View style={[styles.questionCard, { opacity: flipAnim, transform: [{ scale: flipAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }]}>
          <Text style={styles.questionCatLabel}>{activeCategory.label}</Text>
          <Text style={styles.questionText}>{activeCategory.questions[questionIndex].question}</Text>
          <View style={styles.answerOptions}>{activeCategory.questions[questionIndex].options.map((opt, i) => (
            <TouchableOpacity key={i} style={styles.answerBtn} onPress={() => handleAnswer(opt)} activeOpacity={0.7}>
              <Text style={styles.answerBtnText}>{opt}</Text>
            </TouchableOpacity>
          ))}</View>
          <Text style={styles.questionProgress}>Question {questionIndex + 1} of {activeCategory.questions.length}</Text>
        </Animated.View>
      )}
    </View>
  );

  const renderResults = () => {
    const knewCount = progress.reduce((sum, p) => sum + p.responses.filter(r => !r.includes("not sure") && !r.includes("don't know")).length, 0);
    const totalQ = CATEGORIES.reduce((sum, c) => sum + c.questions.length, 0);
    const pct = Math.round((knewCount / totalQ) * 100);

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}><SparkleIcon size={32} color={MC10_PALETTE.deepViolet} /><Text style={styles.resultsTitle}>Your Love Map</Text></View>
        <Text style={styles.resultsSummary}>You knew {knewCount} out of {totalQ} answers ({pct}%). This isn't a test — it's a compass pointing toward where to explore next.</Text>
        <View style={styles.compassGrid}>{CATEGORIES.map(cat => {
          const catProg = progress.find(p => p.categoryId === cat.id);
          const known = catProg ? catProg.responses.filter(r => !r.includes("not sure") && !r.includes("don't know")).length : 0;
          const total = cat.questions.length;
          const filled = known === total;
          return (
            <View key={cat.id} style={[styles.compassSection, filled ? styles.compassFilled : styles.compassEmpty]}>
              <Text style={[styles.compassLabel, filled && styles.compassLabelFilled]}>{cat.label}</Text>
              <Text style={styles.compassScore}>{known}/{total}</Text>
            </View>
          );
        })}</View>
        <Text style={styles.resultsInsight}>The areas where you said "I'm not sure" or "I don't know" are invitations — not failures. They're the questions that will deepen your connection when you ask them.</Text>
        <TouchableOpacity style={styles.continueBtn} onPress={handleFinish} activeOpacity={0.8}><Text style={styles.continueBtnText}>Continue</Text></TouchableOpacity>
      </ScrollView>
    );
  };

  return <View style={styles.container}>{phase === 'intro' && renderIntro()}{phase === 'explore' && renderExplore()}{phase === 'results' && renderResults()}</View>;
}

export default L1KnowledgeMap;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phase: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.scrollPadBottom, paddingHorizontal: Spacing.lg },
  gridContent: { paddingTop: Spacing.md, paddingBottom: Spacing.scrollPadBottom },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  bodyText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  exploreProgress: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC10_PALETTE.deepViolet, textAlign: 'center', fontWeight: '600', paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'center' },
  catCard: { width: '46%', backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: MC10_PALETTE.deepVioletLight, alignItems: 'center', justifyContent: 'center', minHeight: 80, ...Shadows.subtle },
  catCardDone: { borderColor: MC10_PALETTE.deepViolet, backgroundColor: MC10_PALETTE.deepVioletLight + '30' },
  catLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: Colors.text, fontWeight: '600' },
  catLabelDone: { color: MC10_PALETTE.deepViolet },
  catCheck: { fontSize: 18, color: MC10_PALETTE.deepViolet, fontWeight: '700', marginTop: 4 },
  questionCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: Spacing.xl, ...Shadows.card, borderWidth: 1, borderColor: MC10_PALETTE.cardBorder, justifyContent: 'center', gap: Spacing.lg },
  questionCatLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC10_PALETTE.deepViolet, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
  questionText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: Colors.text, textAlign: 'center', lineHeight: 28 },
  answerOptions: { gap: Spacing.sm },
  answerBtn: { backgroundColor: MC10_PALETTE.deepVioletLight + '30', borderRadius: BorderRadius.lg, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderWidth: 1, borderColor: MC10_PALETTE.deepViolet + '30', alignItems: 'center' },
  answerBtnText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text },
  questionProgress: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.textMuted, textAlign: 'center' },
  seeResultsBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginTop: Spacing.xl, ...Shadows.subtle },
  seeResultsBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  resultsTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  resultsSummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg },
  compassGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg, justifyContent: 'center' },
  compassSection: { width: '30%', borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', borderWidth: 1 },
  compassFilled: { backgroundColor: MC10_PALETTE.deepVioletLight + '40', borderColor: MC10_PALETTE.deepViolet },
  compassEmpty: { backgroundColor: MC10_PALETTE.compassEmpty + '40', borderColor: MC10_PALETTE.compassEmpty },
  compassLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: Colors.textSecondary, fontWeight: '600' },
  compassLabelFilled: { color: MC10_PALETTE.deepViolet },
  compassScore: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '700' },
  resultsInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: Spacing.lg },
  continueBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
