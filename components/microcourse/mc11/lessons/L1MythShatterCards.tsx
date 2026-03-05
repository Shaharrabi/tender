/**
 * L1MythShatterCards — MC11 Lesson 1: "The Pleasure Revolution"
 * Myth vs Truth card game based on Organic Intelligence.
 * User classifies 6 statements as MYTH, TRUTH, or IT'S COMPLICATED.
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { SunIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface Card {
  id: number;
  statement: string;
  answer: 'myth' | 'truth' | 'partial';
  reveal: string;
}

const CARDS: Card[] = [
  { id: 1, statement: 'You have to process trauma to heal', answer: 'myth', reveal: 'Your biology can heal through pleasant intensity, not just painful processing.' },
  { id: 2, statement: 'Getting out of your comfort zone is always growth', answer: 'myth', reveal: "Sometimes comfort IS where growth happens. OI calls it 'the window of enjoyment.'" },
  { id: 3, statement: 'Avoiding difficult feelings keeps you stuck', answer: 'partial', reveal: 'Avoidance can be protective. The question is: can your system access pleasure without needing pain first?' },
  { id: 4, statement: 'Relaxation is the opposite of productive', answer: 'myth', reveal: 'When oriented and relaxed, your executive control network functions BETTER.' },
  { id: 5, statement: 'Your body wants to heal itself', answer: 'truth', reveal: 'This is auto-organization. Given the right conditions, your system moves toward greater capacity.' },
  { id: 6, statement: 'Pleasure pathways can be hijacked by addiction', answer: 'truth', reveal: "But they can also be reclaimed. That's what we're doing here." },
];

type Phase = 'intro' | 'game' | 'reveal' | 'insight';

export function L1MythShatterCards({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentCard, setCurrentCard] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardFlip = useRef(new Animated.Value(0)).current;

  const startGame = useCallback(() => {
    haptics.tap();
    setPhase('game');
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [haptics, fadeAnim]);

  const handleAnswer = useCallback((answer: 'myth' | 'truth' | 'partial') => {
    haptics.tap();
    const card = CARDS[currentCard];
    const correct = card.answer === answer;
    if (correct) setScore(s => s + 1);
    setUserAnswers(prev => [...prev, answer]);
    setShowReveal(true);
    cardFlip.setValue(0);
    Animated.spring(cardFlip, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }).start();
  }, [currentCard, haptics, cardFlip]);

  const nextCard = useCallback(() => {
    haptics.tap();
    setShowReveal(false);
    if (currentCard < CARDS.length - 1) {
      setCurrentCard(c => c + 1);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      setPhase('insight');
    }
  }, [currentCard, haptics, fadeAnim]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = CARDS.map((card, i) => ({
      step: i + 1,
      prompt: card.statement,
      response: JSON.stringify({ userAnswer: userAnswers[i], correctAnswer: card.answer, correct: userAnswers[i] === card.answer }),
      type: 'interactive' as const,
    }));
    onComplete(responses);
  }, [haptics, userAnswers, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <View style={styles.iconCircle}><SunIcon size={28} color="#DAA520" /></View>
          <Text style={styles.introTitle}>The Pleasure Revolution</Text>
          <Text style={styles.introSubtitle}>What if comfort isn't avoidance?</Text>
          <Text style={styles.introBody}>{content.readContent.slice(0, 400)}</Text>
          <Text style={styles.introBody}>
            Traditional therapy says: "Feel the pain to heal."{'\n'}
            Organic Intelligence says: "Feel the pleasure to grow."
          </Text>
          <Text style={styles.introBody}>
            You'll see 6 statements about healing and growth. For each one, decide: is it a MYTH, a TRUTH, or somewhere in between?
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.7}>
            <Text style={styles.startButtonText}>Start the Game →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'insight') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.insightCard}>
          <SparkleIcon size={32} color="#DAA520" />
          <Text style={styles.insightTitle}>THE CORE INSIGHT</Text>
          <Text style={styles.insightQuote}>
            "People grow and heal through support, through pleasure, through feeling better by feeling better — not through feeling worse first."
          </Text>
          <Text style={styles.insightAttribution}>— Organic Intelligence</Text>
          <Text style={styles.scoreText}>You got {score} of {CARDS.length} correct</Text>
          <TouchableOpacity style={styles.startButton} onPress={handleFinish} activeOpacity={0.7}>
            <Text style={styles.startButtonText}>This changes everything →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const card = CARDS[currentCard];
  const answerLabel = (a: string) => a === 'myth' ? 'MYTH' : a === 'truth' ? 'TRUTH' : 'PARTIAL';
  const answerColor = (a: string) => a === 'myth' ? '#C4697C' : a === 'truth' ? '#5A9E6F' : '#9E9E9E';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.cardCounter}>Card {currentCard + 1} of {CARDS.length}</Text>

      <Animated.View style={[styles.gameCard, { opacity: showReveal ? 1 : fadeAnim }]}>
        <Text style={styles.statementText}>"{card.statement}"</Text>

        {!showReveal ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.answerBtn, { backgroundColor: '#C4697C' }]} onPress={() => handleAnswer('myth')} activeOpacity={0.7}>
              <Text style={styles.answerBtnText}>MYTH</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.answerBtn, { backgroundColor: '#9E9E9E' }]} onPress={() => handleAnswer('partial')} activeOpacity={0.7}>
              <Text style={styles.answerBtnText}>IT'S COMPLICATED</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.answerBtn, { backgroundColor: '#5A9E6F' }]} onPress={() => handleAnswer('truth')} activeOpacity={0.7}>
              <Text style={styles.answerBtnText}>TRUTH</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={[styles.revealBox, { transform: [{ scale: cardFlip.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }]}>
            <Text style={[styles.revealLabel, { color: answerColor(card.answer) }]}>
              {answerLabel(card.answer)}
              {userAnswers[currentCard] === card.answer ? ' ✓' : ' — you said ' + answerLabel(userAnswers[currentCard])}
            </Text>
            <Text style={styles.revealText}>{card.reveal}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={nextCard} activeOpacity={0.7}>
              <Text style={styles.nextBtnText}>{currentCard < CARDS.length - 1 ? 'Next Card →' : 'See Insight →'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.scrollPadBottom },
  introCard: { backgroundColor: '#FFF8E7', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F5E6B8', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#DAA52020', alignItems: 'center', justifyContent: 'center' },
  introTitle: { fontSize: FontSizes.headingM, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  introSubtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic', textAlign: 'center' },
  introBody: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  startButton: { backgroundColor: '#DAA520', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill, marginTop: Spacing.sm },
  startButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  cardCounter: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.sm, fontWeight: '600' },
  gameCard: { backgroundColor: '#FFFDF5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F5E6B8', ...Shadows.subtle, gap: Spacing.lg },
  statementText: { fontSize: FontSizes.headingS, fontWeight: '600', color: Colors.text, textAlign: 'center', lineHeight: 28, fontStyle: 'italic' },
  buttonRow: { gap: Spacing.sm },
  answerBtn: { paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  answerBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  revealBox: { backgroundColor: '#FFF3D4', borderRadius: BorderRadius.md, padding: Spacing.lg, gap: Spacing.sm },
  revealLabel: { fontWeight: '700', fontSize: FontSizes.body, textAlign: 'center' },
  revealText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  nextBtn: { backgroundColor: '#DAA520', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.pill, alignSelf: 'center', marginTop: Spacing.sm },
  nextBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: FontSizes.bodySmall },
  insightCard: { backgroundColor: '#FFF8E7', borderRadius: BorderRadius.lg, padding: Spacing.xl, borderWidth: 1, borderColor: '#DAA520', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  insightTitle: { fontSize: FontSizes.headingS, fontWeight: '700', color: '#DAA520' },
  insightQuote: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, textAlign: 'center', fontStyle: 'italic' },
  insightAttribution: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary },
  scoreText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
});
