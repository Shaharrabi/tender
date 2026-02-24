/**
 * L2ResponseSimulator — MC12 Lesson 2: "Three Ways to Respond"
 * Interactive simulator: given a bid, user picks between
 * turning toward, turning away, or turning against.
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { EyeIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface BidScenario {
  id: number; bid: string; context: string;
  responses: { label: string; type: 'toward' | 'away' | 'against'; text: string; impact: string }[];
}

const SCENARIOS: BidScenario[] = [
  {
    id: 1, bid: '"Look at this funny video!"', context: 'Your partner holds up their phone, grinning.',
    responses: [
      { label: 'Turn Toward', type: 'toward', text: '"Oh let me see!" (you put down what you\'re doing)', impact: 'Your partner feels valued. The emotional bank account gets a deposit.' },
      { label: 'Turn Away', type: 'away', text: '"Hmm, one sec..." (you keep scrolling your phone)', impact: 'Not hostile, but a missed opportunity. Your partner\'s enthusiasm deflates slightly.' },
      { label: 'Turn Against', type: 'against', text: '"I\'m busy, can you stop showing me stuff?"', impact: 'Your partner learns that sharing with you leads to rejection. Over time, they\'ll stop sharing.' },
    ],
  },
  {
    id: 2, bid: '"I\'m really stressed about tomorrow."', context: 'Partner said quietly before bed.',
    responses: [
      { label: 'Turn Toward', type: 'toward', text: '"Tell me about it. What\'s on your mind?"', impact: 'You become a safe harbor. This builds deep trust over time.' },
      { label: 'Turn Away', type: 'away', text: '"Yeah, I\'m tired too. Night."', impact: 'The bid goes unacknowledged. Your partner lies awake feeling alone — together.' },
      { label: 'Turn Against', type: 'against', text: '"You always stress about everything."', impact: 'Your partner learns vulnerability is punished. Next time they won\'t reach out.' },
    ],
  },
  {
    id: 3, bid: '"Remember that restaurant we went to on our anniversary?"', context: 'Random comment while driving.',
    responses: [
      { label: 'Turn Toward', type: 'toward', text: '"Yes! The one with the amazing pasta. That was such a good night."', impact: 'You\'re building a shared story together. This strengthens your identity as a couple.' },
      { label: 'Turn Away', type: 'away', text: '"Which one?"', impact: 'Not terrible, but you missed the emotional invitation to reminisce together.' },
      { label: 'Turn Against', type: 'against', text: '"That was so expensive. Let\'s not go back."', impact: 'The happy memory gets rewritten as a source of conflict.' },
    ],
  },
  {
    id: 4, bid: '*Reaches for your hand while watching TV*', context: 'A quiet evening at home.',
    responses: [
      { label: 'Turn Toward', type: 'toward', text: 'You take their hand and squeeze gently.', impact: 'Simple physical connection. Your partner\'s nervous system registers safety.' },
      { label: 'Turn Away', type: 'away', text: 'You don\'t notice, your hands are on your phone.', impact: 'They pull their hand back. A small wound that\'s barely perceptible — but it adds up.' },
      { label: 'Turn Against', type: 'against', text: 'You pull away — "It\'s too hot for that."', impact: 'Physical rejection. Your partner\'s body learns not to reach for you.' },
    ],
  },
  {
    id: 5, bid: '"I got the promotion!"', context: 'Partner bursts through the door, beaming.',
    responses: [
      { label: 'Turn Toward', type: 'toward', text: '"That\'s amazing! I\'m so proud of you! Tell me everything!"', impact: 'Active-constructive responding. Research shows this is the #1 predictor of relationship satisfaction.' },
      { label: 'Turn Away', type: 'away', text: '"Oh cool. What do you want for dinner?"', impact: 'Their biggest moment of the day just got minimized. The joy deflates.' },
      { label: 'Turn Against', type: 'against', text: '"Does that mean you\'ll be working even more hours?"', impact: 'You\'ve turned their joy into worry. They\'ll think twice before sharing good news.' },
    ],
  },
];

type Phase = 'intro' | 'sim' | 'results';

export default function L2ResponseSimulator({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showImpact, setShowImpact] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [userChoices, setUserChoices] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const impactAnim = useRef(new Animated.Value(0)).current;

  const handleChoice = useCallback((type: string) => {
    haptics.tap();
    setSelectedResponse(type);
    setUserChoices(prev => [...prev, type]);
    setShowImpact(true);
    impactAnim.setValue(0);
    Animated.timing(impactAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [haptics, impactAnim]);

  const nextScenario = useCallback(() => {
    haptics.tap();
    setShowImpact(false);
    setSelectedResponse(null);
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
      step: i + 1, prompt: s.bid, response: userChoices[i] || 'none', type: 'interactive' as const,
    }));
    onComplete(steps);
  }, [haptics, userChoices, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><EyeIcon size={28} color="#FF6B6B" /></View>
          <Text style={styles.title}>🔄 Three Ways to Respond</Text>
          <Text style={styles.subtitle}>The Response Simulator</Text>
          <Text style={styles.body}>When your partner makes a bid, you have three choices:</Text>
          <View style={styles.optionPreview}>
            <View style={[styles.previewChip, { backgroundColor: '#D4F0DF' }]}><Text style={styles.previewText}>🟢 Turn Toward — engage with the bid</Text></View>
            <View style={[styles.previewChip, { backgroundColor: '#FFF3DD' }]}><Text style={styles.previewText}>🟡 Turn Away — ignore or miss it</Text></View>
            <View style={[styles.previewChip, { backgroundColor: '#FDDEDE' }]}><Text style={styles.previewText}>🔴 Turn Against — reject or criticize</Text></View>
          </View>
          <Text style={styles.body}>You'll see 5 scenarios. Pick how you'd respond, and see the impact of each choice.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('sim'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Start Simulator →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'results') {
    const towardCount = userChoices.filter(c => c === 'toward').length;
    const awayCount = userChoices.filter(c => c === 'away').length;
    const againstCount = userChoices.filter(c => c === 'against').length;
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>🔄 Your Response Pattern</Text>
          <View style={styles.resultBars}>
            <View style={styles.barRow}><Text style={styles.barLabel}>Toward</Text><View style={styles.barTrack}><View style={[styles.barFill, { width: `${(towardCount / SCENARIOS.length) * 100}%`, backgroundColor: '#5A9E6F' }]} /></View><Text style={styles.barCount}>{towardCount}</Text></View>
            <View style={styles.barRow}><Text style={styles.barLabel}>Away</Text><View style={styles.barTrack}><View style={[styles.barFill, { width: `${(awayCount / SCENARIOS.length) * 100}%`, backgroundColor: '#E8A84A' }]} /></View><Text style={styles.barCount}>{awayCount}</Text></View>
            <View style={styles.barRow}><Text style={styles.barLabel}>Against</Text><View style={styles.barTrack}><View style={[styles.barFill, { width: `${(againstCount / SCENARIOS.length) * 100}%`, backgroundColor: '#E05555' }]} /></View><Text style={styles.barCount}>{againstCount}</Text></View>
          </View>
          <Text style={styles.insightText}>Masters of relationships turn toward bids 86% of the time. Disasters? Only 33%.</Text>
          <Text style={styles.body}>The goal isn't perfection — it's increasing your ratio. Every "turn toward" is a deposit in your emotional bank account.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // simulation phase
  const scenario = SCENARIOS[currentIdx];
  const chosenResp = scenario.responses.find(r => r.type === selectedResponse);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.counter}>{currentIdx + 1} of {SCENARIOS.length}</Text>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${((currentIdx + 1) / SCENARIOS.length) * 100}%` }]} /></View>

      <Animated.View style={[styles.scenarioCard, { opacity: showImpact ? 1 : fadeAnim }]}>
        <Text style={styles.contextText}>{scenario.context}</Text>
        <Text style={styles.bidText}>{scenario.bid}</Text>

        {!showImpact ? (
          <View style={styles.responseList}>
            {scenario.responses.map(r => (
              <TouchableOpacity
                key={r.type}
                style={[styles.responseBtn, { borderColor: r.type === 'toward' ? '#5A9E6F' : r.type === 'away' ? '#E8A84A' : '#E05555' }]}
                onPress={() => handleChoice(r.type)}
                activeOpacity={0.7}
              >
                <Text style={styles.responseBtnLabel}>{r.label}</Text>
                <Text style={styles.responseBtnText}>{r.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : chosenResp ? (
          <Animated.View style={[styles.impactBox, { opacity: impactAnim }]}>
            <Text style={[styles.impactLabel, { color: selectedResponse === 'toward' ? '#5A9E6F' : selectedResponse === 'away' ? '#E8A84A' : '#E05555' }]}>
              {chosenResp.label}
            </Text>
            <Text style={styles.impactText}>{chosenResp.impact}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={nextScenario} activeOpacity={0.7}>
              <Text style={styles.nextBtnText}>{currentIdx < SCENARIOS.length - 1 ? 'Next Scenario →' : 'See Results →'}</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : null}
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
  optionPreview: { gap: Spacing.xs, width: '100%' },
  previewChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md },
  previewText: { fontSize: FontSizes.bodySmall, color: Colors.text },
  counter: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, marginBottom: Spacing.md },
  progressFill: { height: 4, backgroundColor: '#FF6B6B', borderRadius: 2 },
  scenarioCard: { backgroundColor: '#FFFCF5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0E0E0', ...Shadows.subtle, gap: Spacing.md },
  contextText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontStyle: 'italic', textAlign: 'center' },
  bidText: { fontSize: FontSizes.headingS, fontWeight: '600', color: Colors.text, textAlign: 'center', lineHeight: 28 },
  responseList: { gap: Spacing.sm },
  responseBtn: { padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 2, backgroundColor: '#FFFDF5', gap: 4 },
  responseBtnLabel: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: Colors.text },
  responseBtnText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontStyle: 'italic' },
  impactBox: { backgroundColor: '#FFF8F2', borderRadius: BorderRadius.md, padding: Spacing.lg, gap: Spacing.sm, alignItems: 'center' },
  impactLabel: { fontWeight: '700', fontSize: FontSizes.body },
  impactText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  nextBtn: { backgroundColor: '#FF6B6B', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.pill, marginTop: Spacing.xs },
  nextBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: FontSizes.bodySmall },
  resultBars: { width: '100%', gap: Spacing.sm },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  barLabel: { width: 60, fontSize: FontSizes.bodySmall, fontWeight: '600', color: Colors.text },
  barTrack: { flex: 1, height: 20, backgroundColor: Colors.borderLight, borderRadius: 10, overflow: 'hidden' },
  barFill: { height: 20, borderRadius: 10 },
  barCount: { width: 20, fontSize: FontSizes.bodySmall, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
