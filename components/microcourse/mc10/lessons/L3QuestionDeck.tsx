/**
 * L3QuestionDeck — MC10 Lesson 3
 *
 * 15 deep-knowing questions. User taps through and categorizes:
 * "Already Know" / "Save for Later" / "Ask Tonight".
 * Creates a personalized conversation starter deck.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC10_PALETTE } from '@/constants/mc10Theme';
import { SearchIcon, SparkleIcon, StarIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const QUESTIONS = [
  "What's something you've been wanting to tell me but haven't found the right moment?",
  "What's a dream you've quietly given up on?",
  "When do you feel most loved by me?",
  "What's something about your childhood that still affects you today?",
  "If you could change one thing about how we communicate, what would it be?",
  "What's your biggest fear about our future together?",
  "What do you wish I noticed more about you?",
  "What's a memory of us that you never want to forget?",
  "When do you feel most like yourself?",
  "What's something you've never told anyone?",
  "What does feeling safe with me look like for you?",
  "What's a way I could better support your dreams?",
  "When was the last time you cried and why?",
  "What's a belief you've changed your mind about in the last year?",
  "What do you need more of in your life right now?",
];

type Phase = 'intro' | 'deck' | 'results';
type Action = 'know' | 'save' | 'tonight';

interface CardChoice { question: string; action: Action }

export default function L3QuestionDeck({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [cardIndex, setCardIndex] = useState(0);
  const [choices, setChoices] = useState<CardChoice[]>([]);
  const introFade = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { if (phase === 'intro') Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, [phase]);

  useEffect(() => {
    if (phase === 'deck') {
      cardAnim.setValue(0);
      Animated.spring(cardAnim, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }).start();
    }
  }, [phase, cardIndex]);

  const startDeck = useCallback(() => { haptics.tap(); setPhase('deck'); }, [haptics]);

  const handleAction = useCallback((action: Action) => {
    if (action === 'tonight') haptics.playExerciseReveal();
    else haptics.tap();

    setChoices(prev => [...prev, { question: QUESTIONS[cardIndex], action }]);
    const next = cardIndex + 1;
    if (next >= QUESTIONS.length) setPhase('results');
    else setCardIndex(next);
  }, [cardIndex, haptics]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const tonightCount = choices.filter(c => c.action === 'tonight').length;
    const saveCount = choices.filter(c => c.action === 'save').length;
    const responses: StepResponseEntry[] = [{ step: 1, prompt: 'Question Deck', response: JSON.stringify({ total: QUESTIONS.length, askTonight: tonightCount, savedForLater: saveCount, choices: choices.map(c => ({ question: c.question, action: c.action })) }), type: 'game' }];
    onComplete(responses);
  }, [choices, onComplete, haptics]);

  const renderIntro = () => {
    const paragraphs = content.readContent ? content.readContent.split('\n').filter((p: string) => p.trim()) : [];
    return (
      <Animated.View style={[styles.phase, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}><SearchIcon size={28} color={MC10_PALETTE.deepViolet} /><Text style={styles.introTitle}>Question Deck</Text></View>
          {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => <Text key={i} style={styles.bodyText}>{p.trim()}</Text>) : (
            <Text style={styles.bodyText}>Deep conversations don't happen by accident — they're sparked by the right questions. You'll see 15 powerful questions. For each one, decide: do you already know the answer, do you want to save it for later, or will you ask it tonight?</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startBtn} onPress={startDeck} activeOpacity={0.8}><Text style={styles.startBtnText}>Start Drawing Cards</Text></TouchableOpacity>
      </Animated.View>
    );
  };

  const renderDeck = () => (
    <View style={styles.phase}>
      <Text style={styles.deckCounter}>{cardIndex + 1} of {QUESTIONS.length}</Text>

      <View style={styles.cardContainer}>
        <Animated.View style={[styles.questionCard, { opacity: cardAnim, transform: [{ scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }]}>
          <Text style={styles.questionText}>{QUESTIONS[cardIndex]}</Text>
        </Animated.View>
      </View>

      <View style={styles.actionsCol}>
        <TouchableOpacity style={styles.knowBtn} onPress={() => handleAction('know')} activeOpacity={0.7}>
          <Text style={styles.knowBtnText}>Already Know</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={() => handleAction('save')} activeOpacity={0.7}>
          <Text style={styles.saveBtnText}>Save for Later</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tonightBtn} onPress={() => handleAction('tonight')} activeOpacity={0.7}>
          <StarIcon size={16} color="#FFFFFF" />
          <Text style={styles.tonightBtnText}>Ask Tonight</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderResults = () => {
    const tonightQs = choices.filter(c => c.action === 'tonight');
    const saveQs = choices.filter(c => c.action === 'save');
    const knowQs = choices.filter(c => c.action === 'know');

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}><SparkleIcon size={32} color={MC10_PALETTE.deepViolet} /><Text style={styles.resultsTitle}>Your Conversation Deck</Text></View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: MC10_PALETTE.askTonight }]}><Text style={[styles.summaryNum, { color: MC10_PALETTE.askTonight }]}>{tonightQs.length}</Text><Text style={styles.summaryLabel}>Ask Tonight</Text></View>
          <View style={[styles.summaryCard, { borderColor: MC10_PALETTE.saveGreen }]}><Text style={[styles.summaryNum, { color: MC10_PALETTE.saveGreen }]}>{saveQs.length}</Text><Text style={styles.summaryLabel}>Saved</Text></View>
          <View style={[styles.summaryCard, { borderColor: MC10_PALETTE.skipGray }]}><Text style={[styles.summaryNum, { color: MC10_PALETTE.skipGray }]}>{knowQs.length}</Text><Text style={styles.summaryLabel}>Already Know</Text></View>
        </View>

        {tonightQs.length > 0 && (
          <View style={styles.deckSection}>
            <Text style={styles.sectionTitle}>Your Questions for Tonight</Text>
            {tonightQs.map((q, i) => <View key={i} style={styles.savedCard}><StarIcon size={14} color={MC10_PALETTE.askTonight} /><Text style={styles.savedText}>{q.question}</Text></View>)}
          </View>
        )}

        {saveQs.length > 0 && (
          <View style={styles.deckSection}>
            <Text style={styles.sectionTitle}>Saved for Later</Text>
            {saveQs.map((q, i) => <View key={i} style={styles.savedCard}><Text style={styles.savedText}>{q.question}</Text></View>)}
          </View>
        )}

        <Text style={styles.resultsInsight}>The questions you chose to "Ask Tonight" are the ones that will deepen your connection most. One real conversation can change the temperature of your whole relationship.</Text>
        <TouchableOpacity style={styles.continueBtn} onPress={handleFinish} activeOpacity={0.8}><Text style={styles.continueBtnText}>Continue</Text></TouchableOpacity>
      </ScrollView>
    );
  };

  return <View style={styles.container}>{phase === 'intro' && renderIntro()}{phase === 'deck' && renderDeck()}{phase === 'results' && renderResults()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phase: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.lg },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  bodyText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  deckCounter: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC10_PALETTE.deepViolet, textAlign: 'center', fontWeight: '600', paddingTop: Spacing.md },
  cardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  questionCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: Spacing.xxl, ...Shadows.elevated, borderWidth: 2, borderColor: MC10_PALETTE.deepVioletLight, width: '100%', minHeight: 200, justifyContent: 'center' },
  questionText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: Colors.text, textAlign: 'center', lineHeight: 30 },
  actionsCol: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  knowBtn: { backgroundColor: Colors.surface, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', borderWidth: 1, borderColor: MC10_PALETTE.skipGray + '40' },
  knowBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: Colors.textSecondary, fontWeight: '600' },
  saveBtn: { backgroundColor: MC10_PALETTE.saveGreen + '15', paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', borderWidth: 1, borderColor: MC10_PALETTE.saveGreen + '40' },
  saveBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: MC10_PALETTE.saveGreen, fontWeight: '600' },
  tonightBtn: { backgroundColor: MC10_PALETTE.warmGold, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, ...Shadows.subtle },
  tonightBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  resultsTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  summaryCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', borderWidth: 2, gap: 2 },
  summaryNum: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, fontWeight: '700' },
  summaryLabel: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.textSecondary },
  deckSection: { marginBottom: Spacing.lg },
  sectionTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: MC10_PALETTE.deepViolet, fontWeight: '600', marginBottom: Spacing.sm },
  savedCard: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, backgroundColor: MC10_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.xs, borderWidth: 1, borderColor: MC10_PALETTE.cardBorder },
  savedText: { flex: 1, fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },
  resultsInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: Spacing.lg },
  continueBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
