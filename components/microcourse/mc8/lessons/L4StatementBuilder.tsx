/**
 * L4StatementBuilder — MC8 Lesson 4
 *
 * 4-step progressive boundary statement builder:
 * (1) Pick the situation (2) Name the body signal (3) Name the need (4) Speak the boundary
 * Each step adds to a growing statement card.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC8_PALETTE } from '@/constants/mc8Theme';
import { ShieldIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const SITUATIONS = ["When plans are made without asking me", "When my feelings are dismissed", "When I'm expected to fix someone else's problem", "When my alone time is interrupted"];
const BODY_SIGNALS = ["My chest gets tight", "My stomach drops", "My jaw clenches", "My shoulders tense up"];
const NEEDS = ["I need to be consulted", "I need my feelings acknowledged", "I need to protect my energy", "I need uninterrupted personal time"];
const BOUNDARY_WORDS = ["I need us to check with each other before committing our time.", "I need you to pause and hear what I'm feeling before problem-solving.", "I care about you, but I can't take this on. Here's what I can do instead.", "I need at least an hour of quiet time each day — it helps me show up better for us."];

type Phase = 'intro' | 'build' | 'complete';
type BuildStep = 0 | 1 | 2 | 3;

export default function L4StatementBuilder({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [buildStep, setBuildStep] = useState<BuildStep>(0);
  const [situation, setSituation] = useState('');
  const [bodySignal, setBodySignal] = useState('');
  const [need, setNeed] = useState('');
  const [boundary, setBoundary] = useState('');
  const introFade = useRef(new Animated.Value(0)).current;
  const stepFade = useRef(new Animated.Value(0)).current;

  useEffect(() => { if (phase === 'intro') Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, [phase]);
  useEffect(() => { stepFade.setValue(0); Animated.timing(stepFade, { toValue: 1, duration: 300, useNativeDriver: true }).start(); }, [buildStep]);

  const startBuild = useCallback(() => { haptics.tap(); setPhase('build'); }, [haptics]);

  const handleSelect = useCallback((value: string) => {
    haptics.tap();
    if (buildStep === 0) { setSituation(value); setBuildStep(1); }
    else if (buildStep === 1) { setBodySignal(value); setBuildStep(2); }
    else if (buildStep === 2) { setNeed(value); setBuildStep(3); }
    else if (buildStep === 3) { setBoundary(value); haptics.playExerciseReveal(); setPhase('complete'); }
  }, [buildStep, haptics]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const statement = `${situation} — ${bodySignal} — ${need} — ${boundary}`;
    const responses: StepResponseEntry[] = [{ step: 1, prompt: 'Boundary Statement Builder', response: JSON.stringify({ situation, bodySignal, need, boundary, fullStatement: statement }), type: 'game' }];
    onComplete(responses);
  }, [situation, bodySignal, need, boundary, onComplete, haptics]);

  const STEP_CONFIG = [
    { title: 'Step 1: The Situation', prompt: 'What boundary situation comes up for you?', options: SITUATIONS },
    { title: 'Step 2: The Body Signal', prompt: 'What does your body do when this happens?', options: BODY_SIGNALS },
    { title: 'Step 3: The Need', prompt: 'What do you need in this situation?', options: NEEDS },
    { title: 'Step 4: The Boundary', prompt: 'How would you speak this boundary?', options: BOUNDARY_WORDS },
  ];

  const renderIntro = () => {
    const paragraphs = content.readContent ? content.readContent.split('\n').filter((p: string) => p.trim()) : [];
    return (
      <Animated.View style={[styles.phase, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}><ShieldIcon size={28} color={MC8_PALETTE.deepTeal} /><Text style={styles.introTitle}>Boundary Statement Builder</Text></View>
          {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => <Text key={i} style={styles.bodyText}>{p.trim()}</Text>) : (
            <Text style={styles.bodyText}>A powerful boundary statement has four parts: the situation, the body signal, the need, and the words. In this exercise, you'll build your own boundary statement step by step.</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startBtn} onPress={startBuild} activeOpacity={0.8}><Text style={styles.startBtnText}>Start Building</Text></TouchableOpacity>
      </Animated.View>
    );
  };

  const renderBuild = () => {
    const config = STEP_CONFIG[buildStep];
    return (
      <Animated.View style={[styles.phase, { opacity: stepFade }]}>
        {/* Growing statement card */}
        <View style={styles.statementCard}>
          <Text style={styles.statementLabel}>Your Boundary Statement</Text>
          {situation ? <Text style={styles.statementPart}><Text style={styles.partLabel}>Situation: </Text>{situation}</Text> : null}
          {bodySignal ? <Text style={styles.statementPart}><Text style={styles.partLabel}>Body: </Text>{bodySignal}</Text> : null}
          {need ? <Text style={styles.statementPart}><Text style={styles.partLabel}>Need: </Text>{need}</Text> : null}
        </View>

        {/* Step progress */}
        <View style={styles.stepRow}>
          {[0, 1, 2, 3].map(s => (
            <View key={s} style={[styles.stepDot, s < buildStep && styles.stepDotDone, s === buildStep && styles.stepDotCurrent]} />
          ))}
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.optionsContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>{config.title}</Text>
          <Text style={styles.stepPrompt}>{config.prompt}</Text>
          <View style={styles.optionsGrid}>
            {config.options.map((opt, i) => (
              <TouchableOpacity key={i} style={styles.optionCard} onPress={() => handleSelect(opt)} activeOpacity={0.7}>
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  const renderComplete = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.completeHeader}><SparkleIcon size={32} color={MC8_PALETTE.deepTeal} /><Text style={styles.completeTitle}>Your Boundary Card</Text></View>
      <View style={styles.boundaryCard}>
        <View style={styles.boundarySection}><Text style={styles.boundaryLabel}>When this happens:</Text><Text style={styles.boundaryValue}>{situation}</Text></View>
        <View style={styles.boundarySection}><Text style={styles.boundaryLabel}>My body tells me:</Text><Text style={styles.boundaryValue}>{bodySignal}</Text></View>
        <View style={styles.boundarySection}><Text style={styles.boundaryLabel}>What I need:</Text><Text style={styles.boundaryValue}>{need}</Text></View>
        <View style={[styles.boundarySection, styles.boundarySpeakSection]}><Text style={styles.boundaryLabel}>What I'll say:</Text><Text style={[styles.boundaryValue, styles.boundarySpeakText]}>{boundary}</Text></View>
      </View>
      <Text style={styles.completeInsight}>This is YOUR boundary — grounded in your body's wisdom, connected to your real needs, and spoken in your own voice. Practice saying it out loud. The more you say it, the more natural it becomes.</Text>
      <TouchableOpacity style={styles.continueBtn} onPress={handleFinish} activeOpacity={0.8}><Text style={styles.continueBtnText}>Continue</Text></TouchableOpacity>
    </ScrollView>
  );

  return <View style={styles.container}>{phase === 'intro' && renderIntro()}{phase === 'build' && renderBuild()}{phase === 'complete' && renderComplete()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phase: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.lg },
  optionsContent: { paddingTop: Spacing.md, paddingBottom: Spacing.xxxl },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  bodyText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startBtn: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  statementCard: { backgroundColor: MC8_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: MC8_PALETTE.deepTeal + '40', marginTop: Spacing.md, gap: Spacing.xs, minHeight: 80 },
  statementLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC8_PALETTE.deepTeal, fontWeight: '600', marginBottom: Spacing.xs },
  statementPart: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },
  partLabel: { fontFamily: FontFamilies.heading, fontWeight: '600', color: MC8_PALETTE.earthBrown },
  stepRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: Spacing.md },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.borderLight },
  stepDotDone: { backgroundColor: MC8_PALETTE.deepTeal },
  stepDotCurrent: { backgroundColor: MC8_PALETTE.deepTeal, width: 16, height: 16, borderRadius: 8 },
  stepTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: MC8_PALETTE.deepTeal, fontWeight: '600', marginBottom: Spacing.xs },
  stepPrompt: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, marginBottom: Spacing.lg, lineHeight: 24 },
  optionsGrid: { gap: Spacing.md },
  optionCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: MC8_PALETTE.deepTeal + '30', ...Shadows.subtle },
  optionText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },
  completeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  completeTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  boundaryCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: Spacing.xl, borderWidth: 2, borderColor: MC8_PALETTE.deepTeal, ...Shadows.elevated, marginBottom: Spacing.lg, gap: Spacing.md },
  boundarySection: { gap: 2 },
  boundarySpeakSection: { backgroundColor: MC8_PALETTE.deepTealLight + '30', borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.sm },
  boundaryLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC8_PALETTE.earthBrown, fontWeight: '600' },
  boundaryValue: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },
  boundarySpeakText: { fontFamily: FontFamilies.heading, fontWeight: '600', color: MC8_PALETTE.deepTealDark },
  completeInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: Spacing.lg },
  continueBtn: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
