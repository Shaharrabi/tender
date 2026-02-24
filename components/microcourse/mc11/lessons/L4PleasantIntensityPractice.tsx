/**
 * L4PleasantIntensityPractice — MC11 Lesson 4: "Turn Up the Volume"
 * Guided practice: pick a pleasure, amplify it through attention,
 * rate intensity before/after, notice body response.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MeditationIcon, MegaphoneIcon, SparkleIcon } from '@/assets/graphics/icons';
import { MC11_PALETTE } from '@/constants/mc11Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const PLEASURE_SUGGESTIONS = [
  { label: 'Warmth of your hands' },
  { label: 'Feel of fabric on skin' },
  { label: 'Sound of your breath' },
  { label: 'Color you can see right now' },
  { label: 'Gentle pressure on your feet' },
  { label: 'A memory that makes you smile' },
];

const INTENSITY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const BODY_RESPONSES = [
  'Shoulders dropped', 'Breath deepened', 'Jaw relaxed', 'Warmth in chest',
  'Tingling in hands', 'Felt more still', 'Eyes softened', 'Nothing noticeable',
];

type Phase = 'intro' | 'choose' | 'before' | 'amplify' | 'after' | 'body' | 'results';

export default function L4PleasantIntensityPractice({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [chosenPleasure, setChosenPleasure] = useState('');
  const [customPleasure, setCustomPleasure] = useState('');
  const [beforeIntensity, setBeforeIntensity] = useState(0);
  const [afterIntensity, setAfterIntensity] = useState(0);
  const [bodyResponse, setBodyResponse] = useState<string[]>([]);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && timerActive) {
      setTimerActive(false);
      haptics.tap();
      setPhase('after');
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timer, timerActive, haptics]);

  useEffect(() => {
    if (timerActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [timerActive, pulseAnim]);

  const selectPleasure = useCallback((label: string) => {
    haptics.tap();
    setChosenPleasure(label);
    setPhase('before');
  }, [haptics]);

  const selectBefore = useCallback((val: number) => {
    haptics.tap();
    setBeforeIntensity(val);
  }, [haptics]);

  const startAmplify = useCallback(() => {
    haptics.tap();
    setPhase('amplify');
    setTimerActive(true);
  }, [haptics]);

  const selectAfter = useCallback((val: number) => {
    haptics.tap();
    setAfterIntensity(val);
  }, [haptics]);

  const toggleBody = useCallback((item: string) => {
    haptics.tap();
    setBodyResponse(prev => prev.includes(item) ? prev.filter(b => b !== item) : [...prev, item]);
  }, [haptics]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Chosen pleasure', response: chosenPleasure, type: 'interactive' as const },
      { step: 2, prompt: 'Intensity before amplifying', response: String(beforeIntensity), type: 'interactive' as const },
      { step: 3, prompt: 'Intensity after amplifying', response: String(afterIntensity), type: 'interactive' as const },
      { step: 4, prompt: 'Body responses noticed', response: JSON.stringify(bodyResponse), type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, chosenPleasure, beforeIntensity, afterIntensity, bodyResponse, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><MeditationIcon size={28} color="#DAA520" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><MegaphoneIcon size={20} color={MC11_PALETTE.warmGold} /><Text style={styles.title}>Turn Up the Volume</Text></View>
          <Text style={styles.subtitle}>Pleasant Intensity Practice</Text>
          <Text style={styles.body}>In OI, we don't just notice pleasure — we amplify it. By giving pleasant sensations more attention, you train your nervous system to orient toward safety and aliveness.</Text>
          <Text style={styles.body}>You'll pick one pleasant sensation, rate it, spend 30 seconds amplifying it through attention, then rate it again.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('choose'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Let's Practice →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'choose') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Pick a Pleasant Sensation</Text>
          <Text style={styles.body}>Choose something you can notice right now, in this moment:</Text>
          <View style={styles.suggestionGrid}>
            {PLEASURE_SUGGESTIONS.map(s => (
              <TouchableOpacity key={s.label} style={styles.suggestionChip} onPress={() => selectPleasure(s.label)} activeOpacity={0.7}>
                <Text style={styles.suggestionEmoji}>{s.label.charAt(0).toUpperCase()}</Text>
                <Text style={styles.suggestionLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.orText}>— or type your own —</Text>
          <View style={styles.customRow}>
            <TextInput style={styles.customInput} placeholder="Your sensation..." placeholderTextColor={Colors.textMuted} value={customPleasure} onChangeText={setCustomPleasure} />
            <TouchableOpacity
              style={[styles.smallBtn, !customPleasure.trim() && styles.disabledBtn]}
              onPress={() => customPleasure.trim() && selectPleasure(customPleasure.trim())}
              disabled={!customPleasure.trim()}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryBtnText}>Go</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'before') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Rate the Pleasure</Text>
          <Text style={styles.body}>Focus on: <Text style={{ fontWeight: '700', color: '#DAA520' }}>{chosenPleasure}</Text></Text>
          <Text style={styles.body}>How pleasant does it feel right now?</Text>
          <View style={styles.ratingRow}>
            {INTENSITY_LEVELS.map(val => (
              <TouchableOpacity key={val} style={[styles.ratingCircle, beforeIntensity === val && styles.ratingCircleActive]} onPress={() => selectBefore(val)} activeOpacity={0.7}>
                <Text style={[styles.ratingText, beforeIntensity === val && styles.ratingTextActive]}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Barely there</Text>
            <Text style={styles.scaleLabel}>Very pleasant</Text>
          </View>
          <TouchableOpacity
            style={[styles.primaryBtn, beforeIntensity === 0 && styles.disabledBtn]}
            onPress={startAmplify}
            disabled={beforeIntensity === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryBtnText}>Begin Amplifying →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'amplify') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.amplifyCard, { transform: [{ scale: pulseAnim }] }]}>
          <SparkleIcon size={40} color={MC11_PALETTE.warmGold} />
          <Text style={styles.amplifyTitle}>Amplify</Text>
          <Text style={styles.amplifyBody}>Give all your attention to: <Text style={{ fontWeight: '700' }}>{chosenPleasure}</Text></Text>
          <Text style={styles.amplifyBody}>Notice everything about it. Let the sensation grow. Don't force — just attend.</Text>
          <Text style={styles.timerText}>{timer}s</Text>
          <View style={styles.timerBar}>
            <View style={[styles.timerFill, { width: `${((30 - timer) / 30) * 100}%` }]} />
          </View>
          <TouchableOpacity style={styles.skipTimerBtn} onPress={() => { setTimerActive(false); setPhase('after'); }} activeOpacity={0.7}>
            <Text style={styles.skipTimerText}>I'm ready →</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    );
  }

  if (phase === 'after') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Rate Again</Text>
          <Text style={styles.body}>After amplifying: <Text style={{ fontWeight: '700', color: '#DAA520' }}>{chosenPleasure}</Text></Text>
          <Text style={styles.body}>How pleasant does it feel now?</Text>
          <View style={styles.ratingRow}>
            {INTENSITY_LEVELS.map(val => (
              <TouchableOpacity key={val} style={[styles.ratingCircle, afterIntensity === val && styles.ratingCircleActive]} onPress={() => selectAfter(val)} activeOpacity={0.7}>
                <Text style={[styles.ratingText, afterIntensity === val && styles.ratingTextActive]}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Barely there</Text>
            <Text style={styles.scaleLabel}>Very pleasant</Text>
          </View>
          <TouchableOpacity
            style={[styles.primaryBtn, afterIntensity === 0 && styles.disabledBtn]}
            onPress={() => { haptics.tap(); setPhase('body'); }}
            disabled={afterIntensity === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'body') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>Body Check</Text>
          <Text style={styles.body}>What happened in your body during the amplification? Select all that apply:</Text>
          <View style={styles.bodyGrid}>
            {BODY_RESPONSES.map(item => (
              <TouchableOpacity key={item} style={[styles.bodyChip, bodyResponse.includes(item) && styles.bodyChipActive]} onPress={() => toggleBody(item)} activeOpacity={0.7}>
                <Text style={[styles.bodyChipText, bodyResponse.includes(item) && styles.bodyChipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('results'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>See Results →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // results
  const delta = afterIntensity - beforeIntensity;
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}><MegaphoneIcon size={20} color={MC11_PALETTE.warmGold} /><Text style={styles.title}>Results</Text></View>
        <View style={styles.resultRow}>
          <View style={styles.resultBox}>
            <Text style={styles.resultNumber}>{beforeIntensity}</Text>
            <Text style={styles.resultCaption}>Before</Text>
          </View>
          <Text style={styles.resultArrow}>→</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultNumber}>{afterIntensity}</Text>
            <Text style={styles.resultCaption}>After</Text>
          </View>
          {delta > 0 && (
            <View style={styles.deltaBox}>
              <Text style={styles.deltaText}>+{delta}</Text>
            </View>
          )}
        </View>
        {delta > 0 ? (
          <Text style={styles.insightText}>Your attention literally increased the pleasure signal. This is the OI principle: what you attend to, grows.</Text>
        ) : delta === 0 ? (
          <Text style={styles.insightText}>Same intensity — that's okay. The practice of attending to pleasure is what matters, not the score.</Text>
        ) : (
          <Text style={styles.insightText}>Sometimes attention shifts the sensation. There's no wrong answer — just noticing teaches your nervous system.</Text>
        )}
        <Text style={styles.body}>You can do this anytime, anywhere. 30 seconds of amplified pleasant attention is a mini-reset for your entire system.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: { backgroundColor: '#FFF8E7', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F5E6B8', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#DAA52020', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#DAA520', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill, marginTop: Spacing.sm },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  disabledBtn: { opacity: 0.4 },
  suggestionGrid: { gap: Spacing.sm, width: '100%' },
  suggestionChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FFFDF5', gap: Spacing.sm },
  suggestionEmoji: { fontSize: 16, fontWeight: '700', color: '#DAA520', width: 24, textAlign: 'center' as const },
  suggestionLabel: { fontSize: FontSizes.body, color: Colors.text, fontWeight: '500' },
  orText: { fontSize: FontSizes.caption, color: Colors.textMuted, fontStyle: 'italic' },
  customRow: { flexDirection: 'row', gap: Spacing.sm, width: '100%' },
  customInput: { flex: 1, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.sm, fontSize: FontSizes.body, color: Colors.text, backgroundColor: '#FFFCF7' },
  smallBtn: { backgroundColor: '#DAA520', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.pill, justifyContent: 'center' },
  ratingRow: { flexDirection: 'row', gap: 6, justifyContent: 'center', flexWrap: 'wrap' },
  ratingCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDF5' },
  ratingCircleActive: { borderColor: '#DAA520', backgroundColor: '#FFF3D4' },
  ratingText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
  ratingTextActive: { color: '#B8860B' },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: Spacing.xs },
  scaleLabel: { fontSize: FontSizes.caption, color: Colors.textMuted },
  amplifyCard: { backgroundColor: '#FFF3D4', borderRadius: BorderRadius.lg, padding: Spacing.xl, borderWidth: 2, borderColor: '#DAA520', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  amplifyEmoji: { fontSize: 40, fontWeight: '700', color: '#DAA520' },
  amplifyTitle: { fontSize: FontSizes.headingM, fontWeight: '700', color: '#B8860B' },
  amplifyBody: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  timerText: { fontSize: 40, fontWeight: '700', color: '#DAA520' },
  timerBar: { height: 4, width: '100%', backgroundColor: Colors.borderLight, borderRadius: 2 },
  timerFill: { height: 4, backgroundColor: '#DAA520', borderRadius: 2 },
  skipTimerBtn: { paddingVertical: Spacing.sm },
  skipTimerText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
  bodyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
  bodyChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FFFDF5' },
  bodyChipActive: { borderColor: '#5A9E6F', backgroundColor: '#D4EDDA' },
  bodyChipText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontWeight: '500' },
  bodyChipTextActive: { color: '#4A8A5F', fontWeight: '600' },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  resultBox: { alignItems: 'center', gap: 2 },
  resultNumber: { fontSize: 32, fontWeight: '700', color: '#DAA520' },
  resultCaption: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  resultArrow: { fontSize: 24, color: Colors.textMuted },
  deltaBox: { backgroundColor: '#D4EDDA', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.pill },
  deltaText: { fontSize: FontSizes.body, fontWeight: '700', color: '#5A9E6F' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
