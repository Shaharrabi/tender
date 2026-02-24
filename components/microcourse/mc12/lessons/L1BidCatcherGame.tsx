/**
 * L1BidCatcherGame — MC12 Lesson 1: "Can You Spot the Bid?"
 * Scenario-based game: user reads partner scenarios and
 * identifies whether each is a bid for connection.
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { ChatBubbleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface Scenario { id: number; text: string; context: string; isBid: boolean; bidType?: string; explanation: string }

const SCENARIOS: Scenario[] = [
  { id: 1, text: '"Hey, look at that sunset."', context: 'Partner glances toward the window while you\'re on your phone.', isBid: true, bidType: 'Attention', explanation: 'This is a classic bid for attention. Your partner is inviting you into a shared moment.' },
  { id: 2, text: '"I had the worst day."', context: 'Partner drops their bag loudly when walking in.', isBid: true, bidType: 'Empathy', explanation: 'This is a bid for emotional support. They\'re reaching out for comfort and understanding.' },
  { id: 3, text: '"Whatever, it\'s fine."', context: 'After you suggest a restaurant they don\'t seem excited about.', isBid: true, bidType: 'Connection', explanation: 'Even withdrawal can be a bid! They\'re signaling that something matters to them but they don\'t feel safe expressing it directly.' },
  { id: 4, text: '"Want to take a walk?"', context: 'On a quiet Sunday afternoon.', isBid: true, bidType: 'Togetherness', explanation: 'A clear bid for shared experience and physical closeness. The simplest bids are often the most important.' },
  { id: 5, text: '"Did you remember to pay the electric bill?"', context: 'During dinner, matter-of-fact tone.', isBid: false, explanation: 'This is a logistical question, not a bid for emotional connection. Though it could become one depending on the response!' },
  { id: 6, text: '"I read something interesting today..."', context: 'Partner looks up from their phone with a slight smile.', isBid: true, bidType: 'Enthusiasm', explanation: 'They want to share something that excited them. Responding to this bid says: "Your interests matter to me."' },
  { id: 7, text: '*Sighs deeply*', context: 'Partner sitting on the couch, staring at nothing.', isBid: true, bidType: 'Support', explanation: 'Non-verbal bids are the most commonly missed. That sigh is saying: "I need something from you right now."' },
  { id: 8, text: '"The trash needs to go out."', context: 'Stated while looking at the overflowing bin.', isBid: false, explanation: 'This is a task statement, not an emotional bid. Though the WAY someone responds to it can still build or erode connection.' },
];

type Phase = 'intro' | 'game' | 'results';

export function L1BidCatcherGame({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;

  const handleAnswer = useCallback((answeredYes: boolean) => {
    haptics.tap();
    const scenario = SCENARIOS[currentIdx];
    const correct = answeredYes === scenario.isBid;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, answeredYes]);
    setShowExplanation(true);
    revealAnim.setValue(0);
    Animated.spring(revealAnim, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }).start();
  }, [currentIdx, haptics, revealAnim]);

  const nextScenario = useCallback(() => {
    haptics.tap();
    setShowExplanation(false);
    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx(i => i + 1);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      setPhase('results');
    }
  }, [currentIdx, haptics, fadeAnim]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = SCENARIOS.map((s, i) => ({
      step: i + 1,
      prompt: s.text,
      response: JSON.stringify({ userSaidBid: answers[i], actuallyBid: s.isBid, correct: answers[i] === s.isBid }),
      type: 'interactive' as const,
    }));
    onComplete(steps);
  }, [haptics, answers, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><ChatBubbleIcon size={28} color="#FF6B6B" /></View>
          <Text style={styles.title}>🎯 Can You Spot the Bid?</Text>
          <Text style={styles.subtitle}>The Bid Catcher Game</Text>
          <Text style={styles.body}>Gottman found that couples who notice bids for connection stay together at much higher rates than those who miss them.</Text>
          <Text style={styles.body}>A "bid" is any attempt to connect — a look, a sigh, a question, a touch. Most bids are subtle, and most people miss them.</Text>
          <Text style={styles.body}>You'll see 8 scenarios. For each, decide: Is this a bid for connection?</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('game'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Start Catching →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'results') {
    const pct = Math.round((score / SCENARIOS.length) * 100);
    const bidCount = SCENARIOS.filter(s => s.isBid).length;
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>🎯 Results</Text>
          <Text style={styles.scoreText}>{score} of {SCENARIOS.length} correct ({pct}%)</Text>
          <Text style={styles.body}>{bidCount} of those {SCENARIOS.length} scenarios were actual bids. In real life, Gottman estimates partners make bids every few minutes.</Text>
          {pct >= 75 ? (
            <Text style={styles.insightText}>You have a keen eye for bids! The next step is noticing them in real-time with your partner.</Text>
          ) : pct >= 50 ? (
            <Text style={styles.insightText}>Good start! Many bids are disguised — a sigh, a seemingly random comment. With practice, you'll catch more.</Text>
          ) : (
            <Text style={styles.insightText}>Bids are often invisible until you know what to look for. That's exactly why this practice matters.</Text>
          )}
          <Text style={styles.body}>The most dangerous thing in a relationship isn't fighting — it's missing bids until your partner stops making them.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // game phase
  const scenario = SCENARIOS[currentIdx];
  const correct = answers[currentIdx] === scenario.isBid;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.counter}>{currentIdx + 1} of {SCENARIOS.length}</Text>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${((currentIdx + 1) / SCENARIOS.length) * 100}%` }]} /></View>

      <Animated.View style={[styles.scenarioCard, { opacity: showExplanation ? 1 : fadeAnim }]}>
        <Text style={styles.contextText}>{scenario.context}</Text>
        <Text style={styles.quoteText}>{scenario.text}</Text>

        {!showExplanation ? (
          <View style={styles.answerRow}>
            <TouchableOpacity style={[styles.answerBtn, styles.yesBtn]} onPress={() => handleAnswer(true)} activeOpacity={0.7}>
              <Text style={styles.answerBtnText}>That's a Bid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.answerBtn, styles.noBtn]} onPress={() => handleAnswer(false)} activeOpacity={0.7}>
              <Text style={styles.answerBtnText}>Not a Bid</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={[styles.explanationBox, { transform: [{ scale: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }]}>
            <Text style={[styles.resultLabel, { color: correct ? '#5A9E6F' : '#E05555' }]}>
              {correct ? '✓ Correct!' : '✗ Not quite'}
              {scenario.isBid && scenario.bidType ? ` — Bid for ${scenario.bidType}` : scenario.isBid ? ' — It IS a bid' : ' — Not a bid'}
            </Text>
            <Text style={styles.explanationText}>{scenario.explanation}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={nextScenario} activeOpacity={0.7}>
              <Text style={styles.nextBtnText}>{currentIdx < SCENARIOS.length - 1 ? 'Next →' : 'See Results →'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: { backgroundColor: '#FFF5F5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0D4D4', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF6B6B20', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#FF6B6B', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  counter: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, marginBottom: Spacing.md },
  progressFill: { height: 4, backgroundColor: '#FF6B6B', borderRadius: 2 },
  scenarioCard: { backgroundColor: '#FFFCF5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0E0E0', ...Shadows.subtle, gap: Spacing.md },
  contextText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontStyle: 'italic', textAlign: 'center' },
  quoteText: { fontSize: FontSizes.headingS, fontWeight: '600', color: Colors.text, textAlign: 'center', lineHeight: 28 },
  answerRow: { gap: Spacing.sm },
  answerBtn: { paddingVertical: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  yesBtn: { backgroundColor: '#4ECDC4' },
  noBtn: { backgroundColor: '#9E9E9E' },
  answerBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  explanationBox: { backgroundColor: '#FFF8F2', borderRadius: BorderRadius.md, padding: Spacing.lg, gap: Spacing.sm },
  resultLabel: { fontWeight: '700', fontSize: FontSizes.body, textAlign: 'center' },
  explanationText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  nextBtn: { backgroundColor: '#FF6B6B', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.pill, alignSelf: 'center', marginTop: Spacing.xs },
  nextBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: FontSizes.bodySmall },
  scoreText: { fontSize: FontSizes.headingS, fontWeight: '700', color: '#FF6B6B' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
