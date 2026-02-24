/**
 * L4ReflexTrainingGame — MC12 Lesson 4: "Reflex Training"
 * Speed-based game: bids flash on screen, user must quickly
 * tap "turn toward" before time runs out. Builds instinct.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { LightningIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface FlashBid { text: string; emoji: string }

const FLASH_BIDS: FlashBid[] = [
  { text: 'Partner looks up from their book', emoji: '📖' },
  { text: 'Partner sighs while cooking', emoji: '🍳' },
  { text: '"Hey, come look at this"', emoji: '👀' },
  { text: 'Partner reaches for your arm', emoji: '🤝' },
  { text: '"How was your meeting?"', emoji: '💼' },
  { text: 'Partner laughs at something', emoji: '😄' },
  { text: '"I\'m worried about Mom"', emoji: '💭' },
  { text: 'Partner hums your song', emoji: '🎵' },
  { text: '"Can we talk later?"', emoji: '🗣️' },
  { text: 'Partner makes you coffee', emoji: '☕' },
  { text: '"I miss us doing fun things"', emoji: '✨' },
  { text: 'Partner shows you a photo', emoji: '📱' },
];

const TURN_TOWARD_RESPONSES = [
  'Give full attention',
  'Make eye contact',
  'Ask "tell me more"',
  'Put phone down',
  'Move closer',
  'Smile and engage',
];

const TIME_PER_BID = 4000; // 4 seconds

type Phase = 'intro' | 'training' | 'results';

export default function L4ReflexTrainingGame({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_BID);
  const [responded, setResponded] = useState(false);
  const [catches, setCatches] = useState(0);
  const [misses, setMisses] = useState(0);
  const [totalRounds] = useState(8);
  const [responseIdx, setResponseIdx] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  const shuffledBids = useRef(
    [...FLASH_BIDS].sort(() => Math.random() - 0.5).slice(0, 8)
  ).current;

  const startTimer = useCallback(() => {
    setTimeLeft(TIME_PER_BID);
    setResponded(false);
    flashAnim.setValue(0);
    Animated.timing(flashAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [flashAnim]);

  useEffect(() => {
    if (phase !== 'training' || responded) return;
    if (timeLeft <= 0) {
      setMisses(m => m + 1);
      haptics.tap();
      if (round < totalRounds - 1) {
        setRound(r => r + 1);
        startTimer();
      } else {
        setPhase('results');
      }
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 100), 100);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, timeLeft, responded, round, totalRounds, haptics, startTimer]);

  useEffect(() => {
    if (phase === 'training' && !responded) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.03, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [phase, responded, pulseAnim]);

  const handleCatch = useCallback(() => {
    haptics.tap();
    setResponded(true);
    setCatches(c => c + 1);
    setResponseIdx(i => (i + 1) % TURN_TOWARD_RESPONSES.length);
    setTimeout(() => {
      if (round < totalRounds - 1) {
        setRound(r => r + 1);
        startTimer();
      } else {
        setPhase('results');
      }
    }, 800);
  }, [haptics, round, totalRounds, startTimer]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Bids caught', response: String(catches), type: 'interactive' as const },
      { step: 2, prompt: 'Bids missed', response: String(misses), type: 'interactive' as const },
      { step: 3, prompt: 'Catch rate', response: `${Math.round((catches / totalRounds) * 100)}%`, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, catches, misses, totalRounds, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><LightningIcon size={28} color="#FF6B6B" /></View>
          <Text style={styles.title}>⚡ Reflex Training</Text>
          <Text style={styles.subtitle}>Building Your Bid-Catching Instinct</Text>
          <Text style={styles.body}>In real life, bids happen fast. You need to catch them before your autopilot kicks in.</Text>
          <Text style={styles.body}>Bids will flash on screen. Tap "Turn Toward" before time runs out. Think of it as training your relationship reflexes.</Text>
          <Text style={styles.body}>8 rounds. 4 seconds each. Ready?</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('training'); startTimer(); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Start Training →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'results') {
    const pct = Math.round((catches / totalRounds) * 100);
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>⚡ Training Complete!</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{catches}/{totalRounds}</Text>
            <Text style={styles.scoreLabel}>Bids Caught</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}><Text style={[styles.statNum, { color: '#5A9E6F' }]}>{catches}</Text><Text style={styles.statLabel}>Caught</Text></View>
            <View style={styles.statBox}><Text style={[styles.statNum, { color: '#E05555' }]}>{misses}</Text><Text style={styles.statLabel}>Missed</Text></View>
            <View style={styles.statBox}><Text style={[styles.statNum, { color: '#FF6B6B' }]}>{pct}%</Text><Text style={styles.statLabel}>Rate</Text></View>
          </View>
          {pct >= 75 ? (
            <Text style={styles.insightText}>Fast reflexes! You're building the instinct to notice and respond to bids in real time.</Text>
          ) : (
            <Text style={styles.insightText}>Good practice! The more you train this awareness, the more automatic "turning toward" becomes.</Text>
          )}
          <Text style={styles.body}>In real life, you won't have a buzzer — but the instinct to pause and respond is what you're building here.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // training phase
  const bid = shuffledBids[round];
  const timerPct = (timeLeft / TIME_PER_BID) * 100;
  const timerColor = timerPct > 50 ? '#5A9E6F' : timerPct > 25 ? '#E8A84A' : '#E05555';

  return (
    <View style={styles.trainingContainer}>
      <Text style={styles.roundCounter}>Round {round + 1} of {totalRounds}</Text>
      <View style={styles.timerBar}><View style={[styles.timerFill, { width: `${timerPct}%`, backgroundColor: timerColor }]} /></View>
      <View style={styles.statsMinRow}>
        <Text style={[styles.miniStat, { color: '#5A9E6F' }]}>✓ {catches}</Text>
        <Text style={[styles.miniStat, { color: '#E05555' }]}>✗ {misses}</Text>
      </View>

      <Animated.View style={[styles.bidCard, { opacity: flashAnim, transform: [{ scale: responded ? 1 : pulseAnim }] }]}>
        <Text style={styles.bidEmoji}>{bid.emoji}</Text>
        <Text style={styles.bidText}>{bid.text}</Text>
      </Animated.View>

      {responded ? (
        <View style={styles.caughtBox}>
          <Text style={styles.caughtText}>✓ Caught! → {TURN_TOWARD_RESPONSES[responseIdx]}</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.catchBtn} onPress={handleCatch} activeOpacity={0.7}>
          <Text style={styles.catchBtnText}>🟢 Turn Toward!</Text>
        </TouchableOpacity>
      )}
    </View>
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
  trainingContainer: { flex: 1, padding: Spacing.lg, gap: Spacing.md, justifyContent: 'center' },
  roundCounter: { fontSize: FontSizes.caption, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  timerBar: { height: 6, backgroundColor: Colors.borderLight, borderRadius: 3 },
  timerFill: { height: 6, borderRadius: 3 },
  statsMinRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg },
  miniStat: { fontSize: FontSizes.bodySmall, fontWeight: '700' },
  bidCard: { backgroundColor: '#FFFCF5', borderRadius: BorderRadius.lg, padding: Spacing.xl, borderWidth: 2, borderColor: '#F0E0E0', alignItems: 'center', gap: Spacing.md },
  bidEmoji: { fontSize: 48 },
  bidText: { fontSize: FontSizes.headingS, fontWeight: '600', color: Colors.text, textAlign: 'center', lineHeight: 28 },
  catchBtn: { backgroundColor: '#5A9E6F', paddingVertical: Spacing.lg, borderRadius: BorderRadius.lg, alignItems: 'center' },
  catchBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.headingS },
  caughtBox: { backgroundColor: '#D4F0DF', paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center' },
  caughtText: { color: '#4A8A5F', fontWeight: '700', fontSize: FontSizes.body },
  scoreCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FF6B6B15', borderWidth: 3, borderColor: '#FF6B6B', alignItems: 'center', justifyContent: 'center', gap: 2 },
  scoreNumber: { fontSize: 28, fontWeight: '700', color: '#FF6B6B' },
  scoreLabel: { fontSize: FontSizes.caption, color: Colors.textSecondary, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: Spacing.lg },
  statBox: { alignItems: 'center', gap: 2 },
  statNum: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
