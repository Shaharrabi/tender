/**
 * L5HoldingGroundSim — MC8 Lesson 5
 *
 * Partner pushback simulation. User states a boundary, then simulated partner
 * pushes back with escalating responses. User picks hold/soften/cave.
 * Boundary strength meter responds to choices.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC8_PALETTE } from '@/constants/mc8Theme';
import { FlagIcon, ShieldIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const BOUNDARY_PRESETS = [
  "I need at least one evening a week to myself.",
  "I won't lend money to family without us both agreeing.",
  "I need you to ask before making plans that involve us both.",
  "I need our private conversations to stay between us.",
];

interface PushbackRound {
  partnerSays: string;
  holdText: string;
  softenText: string;
  caveText: string;
  holdInsight: string;
  softenInsight: string;
  caveInsight: string;
}

const PUSHBACK_ROUNDS: PushbackRound[] = [
  {
    partnerSays: "Really? That seems a bit selfish, don't you think?",
    holdText: "It's not selfish — it's what I need to be my best for us.",
    softenText: "Maybe we can start with just a couple hours?",
    caveText: "Yeah, you're right. Forget I said anything.",
    holdInsight: "Naming the boundary as self-care rather than selfishness reframes the conversation. Strength +25%.",
    softenInsight: "Compromise can be healthy, but notice if you're shrinking your need to avoid discomfort.",
    caveInsight: "This is where the old pattern pulls hardest. Your body probably tensed up just reading this option.",
  },
  {
    partnerSays: "But I thought we were a team. Aren't I enough company?",
    holdText: "You are. And part of being a good team is having individual space too.",
    softenText: "Of course you are. I just sometimes need quiet to recharge.",
    caveText: "You're right, we should spend all our time together.",
    holdInsight: "Holding here means seeing through the guilt-trip and responding to the real need underneath. Strength +25%.",
    softenInsight: "Reassurance can bridge the gap, but watch for the pattern of always softening your needs.",
    caveInsight: "Giving up your boundary entirely might feel like peace — but it's actually storing up resentment.",
  },
  {
    partnerSays: "My last partner never needed 'alone time.' Maybe this means something is wrong with us.",
    holdText: "Every relationship is different. This boundary helps me show up better. It's about US.",
    softenText: "Nothing is wrong. I just need a little space — it's not about you.",
    caveText: "Maybe you're right. I'll try to not need it.",
    holdInsight: "Not taking the bait of comparison. You defined the boundary on YOUR terms. Strength +25%.",
    softenInsight: "Reassuring while softly holding. The boundary survived, but barely.",
    caveInsight: "Denying your own needs to avoid conflict is the opposite of intimacy. Your body knows this.",
  },
  {
    partnerSays: "Fine. Do whatever you want. I'll just be here alone, I guess.",
    holdText: "I hear that you're feeling lonely. Let's plan quality time together AND protect this time for me.",
    softenText: "I don't want you to feel alone. Let's find a time that works better.",
    caveText: "No, I'll stay. I don't want you to feel bad.",
    holdInsight: "The ultimate hold: empathy for their feeling WITHOUT abandoning your boundary. Master level. Strength +25%.",
    softenInsight: "Moving the boundary instead of releasing it. Better than caving, but notice the pattern.",
    caveInsight: "Your boundary just dissolved. That sinking feeling in your stomach? That's your body mourning the boundary.",
  },
];

type Phase = 'intro' | 'select' | 'sim' | 'results';
type Choice = 'hold' | 'soften' | 'cave';

export default function L5HoldingGroundSim({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedBoundary, setSelectedBoundary] = useState('');
  const [roundIndex, setRoundIndex] = useState(0);
  const [strength, setStrength] = useState(50);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [showInsight, setShowInsight] = useState(false);
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);
  const introFade = useRef(new Animated.Value(0)).current;
  const strengthAnim = useRef(new Animated.Value(50)).current;
  const insightFade = useRef(new Animated.Value(0)).current;

  useEffect(() => { if (phase === 'intro') Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, [phase]);

  const startGame = useCallback(() => { haptics.tap(); setPhase('select'); }, [haptics]);

  const handleSelectBoundary = useCallback((b: string) => {
    haptics.tap(); setSelectedBoundary(b); setPhase('sim');
  }, [haptics]);

  const handleChoice = useCallback((choice: Choice) => {
    haptics.tap();
    setLastChoice(choice);
    setChoices(prev => [...prev, choice]);

    let newStrength = strength;
    if (choice === 'hold') { newStrength = Math.min(100, strength + 25); haptics.playExerciseReveal(); }
    else if (choice === 'soften') { newStrength = Math.max(10, strength - 5); }
    else { newStrength = Math.max(10, strength - 20); }

    setStrength(newStrength);
    Animated.timing(strengthAnim, { toValue: newStrength, duration: 400, useNativeDriver: false }).start();

    setShowInsight(true);
    insightFade.setValue(0);
    Animated.timing(insightFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [strength, haptics, strengthAnim, insightFade]);

  const advanceRound = useCallback(() => {
    haptics.tap();
    setShowInsight(false);
    setLastChoice(null);
    const next = roundIndex + 1;
    if (next >= PUSHBACK_ROUNDS.length) setPhase('results');
    else setRoundIndex(next);
  }, [roundIndex, haptics]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const holdCount = choices.filter(c => c === 'hold').length;
    const responses: StepResponseEntry[] = [{ step: 1, prompt: 'Holding Ground Sim', response: JSON.stringify({ boundary: selectedBoundary, finalStrength: strength, holdCount, total: PUSHBACK_ROUNDS.length, choices }), type: 'game' }];
    onComplete(responses);
  }, [selectedBoundary, strength, choices, onComplete, haptics]);

  const round = PUSHBACK_ROUNDS[roundIndex];

  const getInsight = () => {
    if (!lastChoice || !round) return '';
    if (lastChoice === 'hold') return round.holdInsight;
    if (lastChoice === 'soften') return round.softenInsight;
    return round.caveInsight;
  };

  const renderIntro = () => {
    const paragraphs = content.readContent ? content.readContent.split('\n').filter((p: string) => p.trim()) : [];
    return (
      <Animated.View style={[styles.phase, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}><FlagIcon size={28} color={MC8_PALETTE.deepTeal} /><Text style={styles.introTitle}>Holding Ground</Text></View>
          {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => <Text key={i} style={styles.bodyText}>{p.trim()}</Text>) : (
            <Text style={styles.bodyText}>Setting a boundary is just the start. The real test comes when someone pushes back. In this simulation, you'll practice holding your ground through four rounds of increasingly persuasive pushback. No shame — just awareness.</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startBtn} onPress={startGame} activeOpacity={0.8}><Text style={styles.startBtnText}>Start Simulation</Text></TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSelect = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.selectTitle}>Pick a boundary to practice holding:</Text>
      <View style={styles.presetGrid}>{BOUNDARY_PRESETS.map((b, i) => (
        <TouchableOpacity key={i} style={styles.presetCard} onPress={() => handleSelectBoundary(b)} activeOpacity={0.7}>
          <Text style={styles.presetText}>{b}</Text>
        </TouchableOpacity>
      ))}</View>
    </ScrollView>
  );

  const renderSim = () => (
    <View style={styles.phase}>
      {/* Strength meter */}
      <View style={styles.strengthBar}>
        <Text style={styles.strengthLabel}>Boundary Strength</Text>
        <View style={styles.strengthTrack}>
          <Animated.View style={[styles.strengthFill, { width: strengthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
        </View>
        <Text style={styles.strengthValue}>{strength}%</Text>
      </View>

      {/* Boundary card */}
      <View style={[styles.boundaryCardSim, { borderWidth: Math.max(1, strength / 25) }]}>
        <ShieldIcon size={16} color={MC8_PALETTE.deepTeal} />
        <Text style={styles.boundaryCardText} numberOfLines={2}>{selectedBoundary}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.simContent} showsVerticalScrollIndicator={false}>
        {/* Round indicator */}
        <View style={styles.roundRow}>{PUSHBACK_ROUNDS.map((_, i) => <View key={i} style={[styles.roundDot, i < roundIndex && styles.roundDotDone, i === roundIndex && styles.roundDotCurrent]} />)}</View>

        {/* Partner pushback */}
        <View style={styles.partnerBubble}><Text style={styles.partnerText}>{round.partnerSays}</Text></View>

        {!showInsight ? (
          <View style={styles.choicesCol}>
            <TouchableOpacity style={styles.holdBtn} onPress={() => handleChoice('hold')} activeOpacity={0.7}>
              <Text style={styles.holdBtnText}>Hold: {round.holdText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.softenBtn} onPress={() => handleChoice('soften')} activeOpacity={0.7}>
              <Text style={styles.softenBtnText}>Soften: {round.softenText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.caveBtn} onPress={() => handleChoice('cave')} activeOpacity={0.7}>
              <Text style={styles.caveBtnText}>Cave: {round.caveText}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={[styles.insightCard, { opacity: insightFade }]}>
            <View style={[styles.insightBadge,
              lastChoice === 'hold' && { backgroundColor: MC8_PALETTE.strengthGreen },
              lastChoice === 'soften' && { backgroundColor: MC8_PALETTE.softenAmber },
              lastChoice === 'cave' && { backgroundColor: MC8_PALETTE.caveGray },
            ]}>
              <Text style={styles.insightBadgeText}>{lastChoice === 'hold' ? 'Held' : lastChoice === 'soften' ? 'Softened' : 'Gave In'}</Text>
            </View>
            <Text style={styles.insightText}>{getInsight()}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={advanceRound} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>{roundIndex + 1 < PUSHBACK_ROUNDS.length ? 'Face Next Pushback' : 'See Results'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );

  const renderResults = () => {
    const holdCount = choices.filter(c => c === 'hold').length;
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}><SparkleIcon size={32} color={MC8_PALETTE.deepTeal} /><Text style={styles.resultsTitle}>Simulation Complete</Text></View>
        <Text style={styles.resultsSummary}>You held your boundary {holdCount} out of {PUSHBACK_ROUNDS.length} times. Final strength: {strength}%</Text>
        <View style={styles.resultsGrid}>{choices.map((c, i) => (
          <View key={i} style={styles.resultRow}>
            <View style={[styles.resultDot, c === 'hold' && { backgroundColor: MC8_PALETTE.strengthGreen }, c === 'soften' && { backgroundColor: MC8_PALETTE.softenAmber }, c === 'cave' && { backgroundColor: MC8_PALETTE.caveGray }]} />
            <Text style={styles.resultLabel}>Round {i + 1}: {c === 'hold' ? 'Held firm' : c === 'soften' ? 'Softened' : 'Gave in'}</Text>
          </View>
        ))}</View>
        <Text style={styles.resultsInsight}>Every time you hold a boundary under pressure, you teach yourself (and your partner) that your needs matter. Even if you softened or gave in, the awareness you built today is the foundation for next time.</Text>
        <TouchableOpacity style={styles.continueBtn} onPress={handleFinish} activeOpacity={0.8}><Text style={styles.continueBtnText}>Continue</Text></TouchableOpacity>
      </ScrollView>
    );
  };

  return <View style={styles.container}>{phase === 'intro' && renderIntro()}{phase === 'select' && renderSelect()}{phase === 'sim' && renderSim()}{phase === 'results' && renderResults()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phase: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.scrollPadBottom, paddingHorizontal: Spacing.lg },
  simContent: { paddingBottom: Spacing.scrollPadBottom },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  bodyText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startBtn: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  selectTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: Colors.text, fontWeight: '600', marginBottom: Spacing.lg, textAlign: 'center' },
  presetGrid: { gap: Spacing.md },
  presetCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: MC8_PALETTE.deepTeal + '40', ...Shadows.subtle },
  presetText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },
  strengthBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingTop: Spacing.md },
  strengthLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC8_PALETTE.deepTeal, fontWeight: '600' },
  strengthTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: Colors.borderLight, overflow: 'hidden' },
  strengthFill: { height: '100%', backgroundColor: MC8_PALETTE.deepTeal, borderRadius: 4 },
  strengthValue: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC8_PALETTE.deepTeal, fontWeight: '700', width: 36 },
  boundaryCardSim: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: MC8_PALETTE.deepTealLight + '30', borderRadius: BorderRadius.lg, padding: Spacing.md, borderColor: MC8_PALETTE.deepTeal, marginTop: Spacing.sm, marginBottom: Spacing.sm },
  boundaryCardText: { flex: 1, fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: MC8_PALETTE.deepTealDark, fontWeight: '600' },
  roundRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingBottom: Spacing.md },
  roundDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.borderLight },
  roundDotDone: { backgroundColor: MC8_PALETTE.deepTeal },
  roundDotCurrent: { backgroundColor: MC8_PALETTE.deepTeal, width: 14, height: 14, borderRadius: 7 },
  partnerBubble: { backgroundColor: MC8_PALETTE.bodyWarmLight, borderRadius: 18, borderTopLeftRadius: 4, padding: Spacing.lg, marginBottom: Spacing.lg },
  partnerText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, fontStyle: 'italic' },
  choicesCol: { gap: Spacing.sm },
  holdBtn: { backgroundColor: MC8_PALETTE.strengthGreenLight, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC8_PALETTE.strengthGreen },
  holdBtnText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },
  softenBtn: { backgroundColor: MC8_PALETTE.softenAmber + '15', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC8_PALETTE.softenAmber + '60' },
  softenBtnText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },
  caveBtn: { backgroundColor: MC8_PALETTE.caveGray + '10', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC8_PALETTE.caveGray + '40' },
  caveBtnText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.textSecondary, lineHeight: 22 },
  insightCard: { backgroundColor: MC8_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.lg, ...Shadows.subtle, gap: Spacing.md },
  insightBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 99 },
  insightBadgeText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: '#FFFFFF', fontWeight: '600' },
  insightText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },
  nextBtn: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', ...Shadows.subtle },
  nextBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  resultsTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  resultsSummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg },
  resultsGrid: { gap: Spacing.sm, marginBottom: Spacing.lg },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: MC8_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC8_PALETTE.cardBorder },
  resultDot: { width: 12, height: 12, borderRadius: 6 },
  resultLabel: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text },
  resultsInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: Spacing.lg },
  continueBtn: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
