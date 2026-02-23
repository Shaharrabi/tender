/**
 * L3EmbodiedScenario — MC8 Lesson 3
 *
 * Branching scenario with somatic check-ins. At each choice point, a
 * "body check" appears before the response options. Somatic data
 * influences which responses are highlighted as aligned.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC8_PALETTE } from '@/constants/mc8Theme';
import { MeditationIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface BodyOption { label: string; aligned: 'hold' | 'soften' | 'give-in' }
interface ResponseOption { text: string; type: 'hold' | 'soften' | 'give-in'; outcome: string }

interface ScenarioNode {
  situation: string;
  bodyCheck: string;
  bodyOptions: BodyOption[];
  responses: ResponseOption[];
}

const SCENARIO: ScenarioNode[] = [
  {
    situation: "Your partner wants to cancel the weekend plans you've been looking forward to, to help a friend move instead. They say: 'I already told them we'd help.'",
    bodyCheck: "Before you respond — pause. What do you notice in your body right now?",
    bodyOptions: [
      { label: 'Tight chest', aligned: 'hold' },
      { label: 'Racing heart', aligned: 'soften' },
      { label: 'Nothing much', aligned: 'give-in' },
      { label: 'Stomach dropping', aligned: 'hold' },
    ],
    responses: [
      { text: "I understand you want to help, but I need you to check with me before committing our time.", type: 'hold', outcome: "Your partner pauses, then nods. 'You're right. I should have asked first.'" },
      { text: "Could we compromise? Maybe help for a few hours but keep our evening plans?", type: 'soften', outcome: "Your partner thinks about it. 'That could work. I appreciate you meeting me halfway.'" },
      { text: "Okay, I guess we can go help.", type: 'give-in', outcome: "Your partner seems relieved but you feel a knot forming in your stomach." },
    ],
  },
  {
    situation: "At dinner with friends, your partner shares something private about your relationship. You feel exposed. On the drive home, they say: 'What? It wasn't a big deal.'",
    bodyCheck: "Check in with your body. What's happening inside?",
    bodyOptions: [
      { label: 'Jaw clenching', aligned: 'hold' },
      { label: 'Shoulders raised', aligned: 'hold' },
      { label: 'Feeling numb', aligned: 'give-in' },
      { label: 'Heart racing', aligned: 'soften' },
    ],
    responses: [
      { text: "It was a big deal to me. I need us to agree on what's private between us.", type: 'hold', outcome: "Silence. Then: 'I didn't realize it would bother you. I'm sorry. What are our ground rules?'" },
      { text: "I know you didn't mean harm, but I felt exposed. Can we talk about what feels private?", type: 'soften', outcome: "'Oh... I can see how that felt. I wouldn't want someone doing that to me either.'" },
      { text: "Yeah, I guess you're right, it's not that serious.", type: 'give-in', outcome: "You dismiss your own feeling. But it sits in your chest all night." },
    ],
  },
  {
    situation: "Your partner wants you to lend money to their sibling again — the third time this year. Last time it wasn't paid back. They say: 'Family is family.'",
    bodyCheck: "One more body check. What's your body telling you?",
    bodyOptions: [
      { label: 'Gut tightness', aligned: 'hold' },
      { label: 'Tension headache', aligned: 'hold' },
      { label: 'Feeling pressured', aligned: 'soften' },
      { label: 'Resigned', aligned: 'give-in' },
    ],
    responses: [
      { text: "I love your family, but we need to protect our finances. I can't agree to this without the previous loans being repaid.", type: 'hold', outcome: "Your partner is quiet, then says: 'That's fair. I'll talk to them about paying us back first.'" },
      { text: "What if we set a limit on how much we lend this time?", type: 'soften', outcome: "'Okay, that seems reasonable. Maybe half of what they're asking?'" },
      { text: "Fine, let's just do it.", type: 'give-in', outcome: "The money goes out. The resentment stays in." },
    ],
  },
];

type Phase = 'intro' | 'scenario' | 'results';
type ScenarioStep = 'situation' | 'bodycheck' | 'respond' | 'outcome';

interface RoundData { bodySignal: string; responseType: 'hold' | 'soften' | 'give-in'; aligned: boolean }

export default function L3EmbodiedScenario({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [nodeIndex, setNodeIndex] = useState(0);
  const [step, setStep] = useState<ScenarioStep>('situation');
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [selectedBody, setSelectedBody] = useState<BodyOption | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<ResponseOption | null>(null);
  const introFade = useRef(new Animated.Value(0)).current;
  const fadein = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'intro') Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [phase]);

  const fadeIn = useCallback(() => { fadein.setValue(0); Animated.timing(fadein, { toValue: 1, duration: 300, useNativeDriver: true }).start(); }, [fadein]);

  const startGame = useCallback(() => { haptics.tap(); setPhase('scenario'); fadeIn(); }, [haptics, fadeIn]);

  const handleBodySelect = useCallback((opt: BodyOption) => {
    haptics.tap(); setSelectedBody(opt); setStep('respond'); fadeIn();
  }, [haptics, fadeIn]);

  const handleResponseSelect = useCallback((opt: ResponseOption) => {
    haptics.tap();
    setSelectedResponse(opt);
    const aligned = selectedBody ? selectedBody.aligned === opt.type : false;
    setRounds(prev => [...prev, { bodySignal: selectedBody?.label ?? '', responseType: opt.type, aligned }]);
    setStep('outcome');
    fadeIn();
    if (opt.type === 'hold') haptics.playExerciseReveal();
  }, [selectedBody, haptics, fadeIn]);

  const advanceNode = useCallback(() => {
    haptics.tap();
    const next = nodeIndex + 1;
    if (next >= SCENARIO.length) { setPhase('results'); }
    else { setNodeIndex(next); setStep('situation'); setSelectedBody(null); setSelectedResponse(null); fadeIn(); }
  }, [nodeIndex, haptics, fadeIn]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const holdCount = rounds.filter(r => r.responseType === 'hold').length;
    const responses: StepResponseEntry[] = [{ step: 1, prompt: 'Embodied Scenario', response: JSON.stringify({ holdCount, total: SCENARIO.length, rounds }), type: 'game' }];
    onComplete(responses);
  }, [rounds, onComplete, haptics]);

  const node = SCENARIO[nodeIndex];

  const renderIntro = () => {
    const paragraphs = content.readContent ? content.readContent.split('\n').filter((p: string) => p.trim()) : [];
    return (
      <Animated.View style={[styles.phase, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}><MeditationIcon size={28} color={MC8_PALETTE.deepTeal} /><Text style={styles.introTitle}>Embodied Scenario</Text></View>
          {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => <Text key={i} style={styles.bodyText}>{p.trim()}</Text>) : (
            <Text style={styles.bodyText}>In this exercise, you'll face three boundary moments. But before choosing your response, you'll check in with your body first. Your body's wisdom will guide your choice.</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startBtn} onPress={startGame} activeOpacity={0.8}><Text style={styles.startBtnText}>Begin Scenario</Text></TouchableOpacity>
      </Animated.View>
    );
  };

  const renderScenario = () => (
    <Animated.View style={[styles.phase, { opacity: fadein }]}>
      <View style={styles.progressRow}>{SCENARIO.map((_, i) => <View key={i} style={[styles.dot, i < nodeIndex && styles.dotDone, i === nodeIndex && styles.dotCurrent]} />)}</View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 'situation' && (
          <>
            <View style={styles.situationCard}><Text style={styles.situationText}>{node.situation}</Text></View>
            <TouchableOpacity style={styles.nextBtn} onPress={() => { setStep('bodycheck'); fadeIn(); }} activeOpacity={0.8}><Text style={styles.nextBtnText}>Pause and Check In</Text></TouchableOpacity>
          </>
        )}

        {step === 'bodycheck' && (
          <>
            <Text style={styles.bodyCheckPrompt}>{node.bodyCheck}</Text>
            <View style={styles.bodyOptions}>{node.bodyOptions.map(opt => (
              <TouchableOpacity key={opt.label} style={styles.bodyChip} onPress={() => handleBodySelect(opt)} activeOpacity={0.7}>
                <Text style={styles.bodyChipText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}</View>
          </>
        )}

        {step === 'respond' && (
          <>
            <Text style={styles.respondPrompt}>You noticed: <Text style={styles.respondHighlight}>{selectedBody?.label}</Text>. Now choose your response:</Text>
            <View style={styles.responseOptions}>{node.responses.map((opt, i) => {
              const isAligned = selectedBody?.aligned === opt.type;
              return (
                <TouchableOpacity key={i} style={[styles.responseCard, isAligned && styles.responseCardHighlight]} onPress={() => handleResponseSelect(opt)} activeOpacity={0.7}>
                  <Text style={styles.responseText}>{opt.text}</Text>
                  {isAligned && <Text style={styles.alignedTag}>Aligned with your body</Text>}
                </TouchableOpacity>
              );
            })}</View>
          </>
        )}

        {step === 'outcome' && selectedResponse && (
          <>
            <View style={[styles.outcomeBadge, selectedResponse.type === 'hold' && { backgroundColor: MC8_PALETTE.strengthGreen }, selectedResponse.type === 'soften' && { backgroundColor: MC8_PALETTE.softenAmber }, selectedResponse.type === 'give-in' && { backgroundColor: MC8_PALETTE.caveGray }]}>
              <Text style={styles.outcomeBadgeText}>{selectedResponse.type === 'hold' ? 'Held Boundary' : selectedResponse.type === 'soften' ? 'Softened' : 'Gave In'}</Text>
            </View>
            <Text style={styles.outcomeText}>{selectedResponse.outcome}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={advanceNode} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>{nodeIndex + 1 < SCENARIO.length ? 'Next Scenario' : 'See Results'}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </Animated.View>
  );

  const renderResults = () => {
    const holdCount = rounds.filter(r => r.responseType === 'hold').length;
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}><SparkleIcon size={32} color={MC8_PALETTE.deepTeal} /><Text style={styles.resultsTitle}>Embodied Choices</Text></View>
        <Text style={styles.resultsSummary}>You held firm on {holdCount} out of {SCENARIO.length} boundaries.</Text>
        <View style={styles.resultsGrid}>{rounds.map((r, i) => (
          <View key={i} style={styles.resultRow}>
            <View style={[styles.resultDot, r.responseType === 'hold' && { backgroundColor: MC8_PALETTE.strengthGreen }, r.responseType === 'soften' && { backgroundColor: MC8_PALETTE.softenAmber }, r.responseType === 'give-in' && { backgroundColor: MC8_PALETTE.caveGray }]} />
            <View style={styles.resultInfo}>
              <Text style={styles.resultType}>{r.responseType === 'hold' ? 'Held' : r.responseType === 'soften' ? 'Softened' : 'Gave In'}</Text>
              <Text style={styles.resultBody}>Body signal: {r.bodySignal}</Text>
              {r.aligned && <Text style={styles.resultAligned}>Body-aligned choice</Text>}
            </View>
          </View>
        ))}</View>
        <Text style={styles.resultsInsight}>When your body says "hold," your most authentic self is speaking. Learning to listen — and then act on that signal — is the essence of embodied boundary-setting.</Text>
        <TouchableOpacity style={styles.continueBtn} onPress={handleFinish} activeOpacity={0.8}><Text style={styles.continueBtnText}>Continue</Text></TouchableOpacity>
      </ScrollView>
    );
  };

  return <View style={styles.container}>{phase === 'intro' && renderIntro()}{phase === 'scenario' && renderScenario()}{phase === 'results' && renderResults()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phase: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.sm },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  bodyText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startBtn: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.borderLight },
  dotDone: { backgroundColor: MC8_PALETTE.deepTeal },
  dotCurrent: { backgroundColor: MC8_PALETTE.deepTeal, width: 16, height: 16, borderRadius: 8 },
  situationCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.lg, ...Shadows.card, borderWidth: 1, borderColor: MC8_PALETTE.cardBorder, marginBottom: Spacing.lg },
  situationText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26 },
  bodyCheckPrompt: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: MC8_PALETTE.deepTeal, textAlign: 'center', marginBottom: Spacing.lg, lineHeight: 28 },
  bodyOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
  bodyChip: { backgroundColor: MC8_PALETTE.bodyWarmLight, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderWidth: 1, borderColor: MC8_PALETTE.bodyWarm },
  bodyChipText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: MC8_PALETTE.earthBrown, fontWeight: '600' },
  respondPrompt: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, marginBottom: Spacing.lg, textAlign: 'center', lineHeight: 24 },
  respondHighlight: { fontFamily: FontFamilies.heading, color: MC8_PALETTE.deepTeal, fontWeight: '600' },
  responseOptions: { gap: Spacing.md },
  responseCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: MC8_PALETTE.cardBorder, ...Shadows.subtle },
  responseCardHighlight: { borderColor: MC8_PALETTE.strengthGreen, backgroundColor: MC8_PALETTE.strengthGreenLight + '30' },
  responseText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },
  alignedTag: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC8_PALETTE.strengthGreen, fontWeight: '600', marginTop: Spacing.xs },
  outcomeBadge: { alignSelf: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: 99, marginBottom: Spacing.md },
  outcomeBadgeText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: '#FFFFFF', fontWeight: '600' },
  outcomeText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, textAlign: 'center', fontStyle: 'italic', marginBottom: Spacing.lg },
  nextBtn: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', ...Shadows.subtle },
  nextBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  resultsTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  resultsSummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg },
  resultsGrid: { gap: Spacing.sm, marginBottom: Spacing.lg },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: MC8_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC8_PALETTE.cardBorder },
  resultDot: { width: 12, height: 12, borderRadius: 6 },
  resultInfo: { flex: 1 },
  resultType: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '600' },
  resultBody: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.textSecondary },
  resultAligned: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: MC8_PALETTE.strengthGreen, fontWeight: '600' },
  resultsInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: Spacing.lg },
  continueBtn: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
