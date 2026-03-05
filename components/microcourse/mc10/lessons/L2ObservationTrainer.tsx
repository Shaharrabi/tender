/**
 * L2ObservationTrainer — MC10 Lesson 2
 *
 * Specificity exercise with progressive feedback. User writes an observation
 * about their partner. App provides feedback on specificity level (1-3).
 * Three rounds with different topics.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC10_PALETTE } from '@/constants/mc10Theme';
import { EyeIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const PROMPTS = [
  { topic: 'Something they DO', prompt: 'Write something specific your partner does that you appreciate.', example: 'Level 1: "You\'re kind" → Level 2: "You were kind yesterday" → Level 3: "You brought me tea when I was stressed without me asking"' },
  { topic: 'Something they FEEL', prompt: 'Describe a specific emotion you\'ve noticed in your partner recently.', example: 'Level 1: "You seem stressed" → Level 2: "You\'ve been stressed about work" → Level 3: "I noticed your shoulders tensing when you read that email from your boss"' },
  { topic: 'Something they DREAM', prompt: 'Write something specific about a dream or hope your partner has.', example: 'Level 1: "You want to be successful" → Level 2: "You want to change careers" → Level 3: "You light up when you talk about opening that bakery on the coast"' },
];

type Phase = 'intro' | 'train' | 'results';

interface TrainRound { topic: string; text: string; level: number }

export default function L2ObservationTrainer({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [roundIndex, setRoundIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rounds, setRounds] = useState<TrainRound[]>([]);
  const introFade = useRef(new Animated.Value(0)).current;
  const feedbackFade = useRef(new Animated.Value(0)).current;

  useEffect(() => { if (phase === 'intro') Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, [phase]);

  const startTrain = useCallback(() => { haptics.tap(); setPhase('train'); }, [haptics]);

  const evaluateSpecificity = useCallback((text: string): number => {
    const words = text.trim().split(/\s+/).length;
    if (words < 5) return 1;
    if (words < 12) return 2;
    return 3;
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputText.trim()) return;
    haptics.tap();
    const level = evaluateSpecificity(inputText);
    setCurrentLevel(level);
    setShowFeedback(true);
    feedbackFade.setValue(0);
    Animated.timing(feedbackFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    if (level >= 3) haptics.playExerciseReveal();
  }, [inputText, haptics, feedbackFade, evaluateSpecificity]);

  const handleUpgrade = useCallback(() => {
    haptics.tap();
    setShowFeedback(false);
    setInputText('');
  }, [haptics]);

  const handleAccept = useCallback(() => {
    haptics.tap();
    setRounds(prev => [...prev, { topic: PROMPTS[roundIndex].topic, text: inputText, level: currentLevel }]);
    const next = roundIndex + 1;
    if (next >= PROMPTS.length) { setPhase('results'); }
    else { setRoundIndex(next); setInputText(''); setCurrentLevel(0); setShowFeedback(false); }
  }, [roundIndex, inputText, currentLevel, haptics]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const avgLevel = rounds.reduce((sum, r) => sum + r.level, 0) / rounds.length;
    const responses: StepResponseEntry[] = [{ step: 1, prompt: 'Observation Trainer', response: JSON.stringify({ rounds, averageLevel: Math.round(avgLevel * 10) / 10 }), type: 'game' }];
    onComplete(responses);
  }, [rounds, onComplete, haptics]);

  const getFeedbackText = () => {
    if (currentLevel === 1) return "This is general. Can you make it more specific? Add when, where, or what exactly they did.";
    if (currentLevel === 2) return "Getting closer! Can you add even more detail — a specific moment, action, or sensory detail?";
    return "That's a beautifully specific observation. This is what being SEEN looks like.";
  };

  const getMeterColor = () => {
    if (currentLevel === 1) return MC10_PALETTE.specificityLow;
    if (currentLevel === 2) return MC10_PALETTE.specificityMed;
    return MC10_PALETTE.specificityHigh;
  };

  const renderIntro = () => {
    const paragraphs = content.readContent ? content.readContent.split('\n').filter((p: string) => p.trim()) : [];
    return (
      <Animated.View style={[styles.phase, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}><EyeIcon size={28} color={MC10_PALETTE.deepViolet} /><Text style={styles.introTitle}>Observation Trainer</Text></View>
          {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => <Text key={i} style={styles.bodyText}>{p.trim()}</Text>) : (
            <Text style={styles.bodyText}>Being seen starts with being specific. "You're great" is nice, but "You brought me coffee this morning without me asking, and it made me feel like you really see me" — that's being known. Let's train your observation muscle.</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startBtn} onPress={startTrain} activeOpacity={0.8}><Text style={styles.startBtnText}>Start Training</Text></TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTrain = () => {
    const prompt = PROMPTS[roundIndex];
    return (
      <View style={styles.phase}>
        <View style={styles.roundBar}>{PROMPTS.map((_, i) => <View key={i} style={[styles.roundDot, i < roundIndex && styles.roundDotDone, i === roundIndex && styles.roundDotCurrent]} />)}</View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.trainContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.topicLabel}>Round {roundIndex + 1}: {prompt.topic}</Text>
          <Text style={styles.promptText}>{prompt.prompt}</Text>

          <View style={styles.exampleBox}><Text style={styles.exampleText}>{prompt.example}</Text></View>

          <View style={styles.inputBox}>
            <TextInput style={styles.input} placeholder="Write your specific observation..." placeholderTextColor={Colors.textMuted} value={inputText} onChangeText={setInputText} multiline textAlignVertical="top" />
          </View>

          {!showFeedback ? (
            <TouchableOpacity style={[styles.submitBtn, !inputText.trim() && styles.submitBtnDisabled]} onPress={handleSubmit} activeOpacity={0.8} disabled={!inputText.trim()}>
              <Text style={styles.submitBtnText}>Check Specificity</Text>
            </TouchableOpacity>
          ) : (
            <Animated.View style={[styles.feedbackCard, { opacity: feedbackFade }]}>
              <View style={styles.meterRow}>
                <Text style={styles.meterLabel}>Specificity:</Text>
                <View style={styles.meterTrack}>
                  {[1, 2, 3].map(l => <View key={l} style={[styles.meterSegment, l <= currentLevel && { backgroundColor: getMeterColor() }]} />)}
                </View>
                <Text style={[styles.meterText, { color: getMeterColor() }]}>Level {currentLevel}</Text>
              </View>
              <Text style={styles.feedbackText}>{getFeedbackText()}</Text>
              <View style={styles.feedbackActions}>
                {currentLevel < 3 && <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade} activeOpacity={0.7}><Text style={styles.upgradeBtnText}>Try Again</Text></TouchableOpacity>}
                <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept} activeOpacity={0.8}>
                  <Text style={styles.acceptBtnText}>{currentLevel >= 3 ? 'Beautiful! Next' : 'Keep This & Continue'}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderResults = () => {
    const avgLevel = rounds.reduce((sum, r) => sum + r.level, 0) / rounds.length;
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}><SparkleIcon size={32} color={MC10_PALETTE.deepViolet} /><Text style={styles.resultsTitle}>Your Observations</Text></View>
        <Text style={styles.resultsSummary}>Average specificity: Level {Math.round(avgLevel * 10) / 10}</Text>
        <View style={styles.resultsGrid}>{rounds.map((r, i) => (
          <View key={i} style={styles.resultCard}>
            <Text style={styles.resultTopic}>{r.topic}</Text>
            <Text style={styles.resultText}>"{r.text}"</Text>
            <Text style={[styles.resultLevel, { color: r.level >= 3 ? MC10_PALETTE.specificityHigh : r.level >= 2 ? MC10_PALETTE.specificityMed : MC10_PALETTE.specificityLow }]}>Level {r.level}</Text>
          </View>
        ))}</View>
        <Text style={styles.resultsInsight}>Specific observations are the language of being seen. When you notice the small things — and name them — your partner feels truly known.</Text>
        <TouchableOpacity style={styles.continueBtn} onPress={handleFinish} activeOpacity={0.8}><Text style={styles.continueBtnText}>Continue</Text></TouchableOpacity>
      </ScrollView>
    );
  };

  return <View style={styles.container}>{phase === 'intro' && renderIntro()}{phase === 'train' && renderTrain()}{phase === 'results' && renderResults()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phase: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.scrollPadBottom, paddingHorizontal: Spacing.lg },
  trainContent: { paddingTop: Spacing.md, paddingBottom: Spacing.scrollPadBottom },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  bodyText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  roundBar: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  roundDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.borderLight },
  roundDotDone: { backgroundColor: MC10_PALETTE.deepViolet },
  roundDotCurrent: { backgroundColor: MC10_PALETTE.deepViolet, width: 16, height: 16, borderRadius: 8 },
  topicLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: MC10_PALETTE.deepViolet, fontWeight: '600', marginBottom: Spacing.xs },
  promptText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, marginBottom: Spacing.md },
  exampleBox: { backgroundColor: MC10_PALETTE.deepVioletLight + '20', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.lg, borderLeftWidth: 3, borderLeftColor: MC10_PALETTE.deepViolet },
  exampleText: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.textSecondary, lineHeight: 20 },
  inputBox: { borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: MC10_PALETTE.deepViolet + '40', backgroundColor: '#FFFFFF', overflow: 'hidden', marginBottom: Spacing.md },
  input: { padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 100, lineHeight: 24 },
  submitBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', ...Shadows.subtle },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  feedbackCard: { backgroundColor: MC10_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.lg, ...Shadows.subtle, gap: Spacing.md },
  meterRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  meterLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: Colors.textSecondary, fontWeight: '600' },
  meterTrack: { flexDirection: 'row', gap: 4, flex: 1 },
  meterSegment: { flex: 1, height: 8, borderRadius: 4, backgroundColor: Colors.borderLight },
  meterText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, fontWeight: '700' },
  feedbackText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },
  feedbackActions: { flexDirection: 'row', gap: Spacing.sm },
  upgradeBtn: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: MC10_PALETTE.deepViolet + '40', alignItems: 'center' },
  upgradeBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: MC10_PALETTE.deepViolet, fontWeight: '600' },
  acceptBtn: { flex: 2, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg, backgroundColor: MC10_PALETTE.deepViolet, alignItems: 'center' },
  acceptBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: '#FFFFFF', fontWeight: '600' },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  resultsTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  resultsSummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', marginBottom: Spacing.lg },
  resultsGrid: { gap: Spacing.sm, marginBottom: Spacing.lg },
  resultCard: { backgroundColor: MC10_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC10_PALETTE.cardBorder, gap: 4 },
  resultTopic: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC10_PALETTE.deepViolet, fontWeight: '600' },
  resultText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, fontStyle: 'italic', lineHeight: 20 },
  resultLevel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, fontWeight: '700' },
  resultsInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: Spacing.lg },
  continueBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
