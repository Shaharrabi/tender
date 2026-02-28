/**
 * L4AppreciationSprint — MC13 Lesson 4: "Appreciation Sprint"
 * Timed challenge: write as many specific appreciations as possible
 * in 90 seconds. Builds the appreciation muscle.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC13_PALETTE } from '@/constants/mc13Theme';
import { LightningIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const SPRINT_TIME = 90; // seconds
const STARTER_PROMPTS = [
  'I appreciate how you...',
  'I noticed when you...',
  'It meant a lot when...',
  'I love that you always...',
  'Thank you for...',
];

type Phase = 'intro' | 'sprint' | 'results';

export default function L4AppreciationSprint({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [timer, setTimer] = useState(SPRINT_TIME);
  const [timerActive, setTimerActive] = useState(false);
  const [appreciations, setAppreciations] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (timerActive && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && timerActive) {
      setTimerActive(false);
      haptics.tap();
      if (currentText.trim()) {
        setAppreciations(prev => [...prev, currentText.trim()]);
      }
      setPhase('results');
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timer, timerActive, haptics, currentText]);

  useEffect(() => {
    if (timerActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.02, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [timerActive, pulseAnim]);

  const addAppreciation = useCallback(() => {
    if (!currentText.trim()) return;
    haptics.tap();
    setAppreciations(prev => [...prev, currentText.trim()]);
    setCurrentText('');
  }, [haptics, currentText]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Appreciations written', response: JSON.stringify(appreciations), type: 'interactive' as const },
      { step: 2, prompt: 'Count', response: String(appreciations.length), type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, appreciations, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><LightningIcon size={28} color="#E8739E" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><LightningIcon size={20} color={MC13_PALETTE.warmRose} /><Text style={styles.title}>Appreciation Sprint</Text></View>
          <Text style={styles.subtitle}>90 Seconds of Gratitude</Text>
          <Text style={styles.body}>Gratitude is a muscle. The more you use it, the stronger it gets.</Text>
          <Text style={styles.body}>You have 90 seconds. Write as many specific appreciations about your partner as you can. Use the formula: I noticed + [action] + it made me feel + [emotion].</Text>
          <Text style={styles.body}>Don't overthink — just write. Speed builds the habit.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('sprint'); setTimerActive(true); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Start Sprint →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'sprint') {
    const timerPct = (timer / SPRINT_TIME) * 100;
    const timerColor = timer > 30 ? '#5A9E6F' : timer > 10 ? '#E8A84A' : '#E05555';
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    return (
      <Animated.View style={[styles.sprintContainer, { transform: [{ scale: pulseAnim }] }]}>
        <View style={styles.timerSection}>
          <Text style={[styles.timerText, { color: timerColor }]}>{minutes}:{seconds.toString().padStart(2, '0')}</Text>
          <View style={styles.timerBar}><View style={[styles.timerFill, { width: `${timerPct}%`, backgroundColor: timerColor }]} /></View>
        </View>

        <Text style={styles.countText}>{appreciations.length} written</Text>

        <ScrollView style={styles.appreciationList} showsVerticalScrollIndicator={false}>
          {appreciations.map((a, i) => (
            <View key={i} style={styles.appreciationChip}>
              <Text style={styles.appreciationNum}>{i + 1}.</Text>
              <Text style={styles.appreciationText}>{a}</Text>
            </View>
          ))}
        </ScrollView>

        {!currentText && (
          <View style={styles.starterRow}>
            {STARTER_PROMPTS.slice(0, 3).map(p => (
              <TouchableOpacity key={p} style={styles.starterChip} onPress={() => setCurrentText(p)} activeOpacity={0.7}>
                <Text style={styles.starterText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.sprintInput}
            placeholder="Write an appreciation..."
            placeholderTextColor={Colors.textMuted}
            value={currentText}
            onChangeText={setCurrentText}
            onSubmitEditing={addAppreciation}
            returnKeyType="done"
            autoFocus
          />
          <TouchableOpacity
            style={[styles.addBtn, !currentText.trim() && styles.disabledBtn]}
            onPress={addAppreciation}
            disabled={!currentText.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.endEarlyBtn} onPress={() => { setTimerActive(false); if (currentText.trim()) setAppreciations(prev => [...prev, currentText.trim()]); setPhase('results'); }} activeOpacity={0.7}>
          <Text style={styles.endEarlyText}>End Sprint →</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // results
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.resultCard}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}><LightningIcon size={20} color={MC13_PALETTE.warmRose} /><Text style={styles.title}>Sprint Results</Text></View>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{appreciations.length}</Text>
          <Text style={styles.scoreLabel}>Appreciations</Text>
        </View>
        {appreciations.length >= 5 ? (
          <Text style={styles.insightText}>Impressive! You just proved your appreciation muscle is strong. Imagine if your partner heard even one of these today.</Text>
        ) : appreciations.length >= 3 ? (
          <Text style={styles.insightText}>Good start! Quality over quantity. Each specific appreciation you wrote could make your partner's entire day.</Text>
        ) : (
          <Text style={styles.insightText}>Even one heartfelt appreciation matters more than a hundred generic ones. You've started building the habit.</Text>
        )}
        <View style={styles.appreciationResults}>
          {appreciations.map((a, i) => (
            <View key={i} style={styles.resultItem}>
              <Text style={styles.resultNum}>{i + 1}.</Text>
              <Text style={styles.resultText}>{a}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.body}>Challenge: share one of these with your partner today. Not as homework — as a gift.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: { backgroundColor: '#FFF8F0', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0D4E0', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  resultCard: { backgroundColor: '#FFF8F0', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: '#E8739E', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8739E20', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#E8739E', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  disabledBtn: { opacity: 0.4 },
  sprintContainer: { flex: 1, padding: Spacing.lg, gap: Spacing.sm },
  timerSection: { alignItems: 'center', gap: Spacing.xs },
  timerText: { fontSize: 36, fontWeight: '700' },
  timerBar: { height: 4, width: '100%', backgroundColor: Colors.borderLight, borderRadius: 2 },
  timerFill: { height: 4, borderRadius: 2 },
  countText: { fontSize: FontSizes.body, fontWeight: '600', color: '#E8739E', textAlign: 'center' },
  appreciationList: { flex: 1, maxHeight: 200 },
  appreciationChip: { flexDirection: 'row', gap: Spacing.xs, paddingVertical: 4 },
  appreciationNum: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: '#E8739E' },
  appreciationText: { fontSize: FontSizes.bodySmall, color: Colors.text, flex: 1, lineHeight: 20 },
  starterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, justifyContent: 'center' },
  starterChip: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.pill, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#FFFDF5' },
  starterText: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  inputRow: { flexDirection: 'row', gap: Spacing.sm },
  sprintInput: { flex: 1, borderWidth: 1.5, borderColor: '#E8739E60', borderRadius: BorderRadius.md, padding: Spacing.sm, fontSize: FontSizes.body, color: Colors.text, backgroundColor: '#FFFCF7' },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8739E', alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#FFFFFF', fontSize: 24, fontWeight: '700' },
  endEarlyBtn: { alignSelf: 'center', paddingVertical: Spacing.xs },
  endEarlyText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
  scoreCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#E8739E15', borderWidth: 3, borderColor: '#E8739E', alignItems: 'center', justifyContent: 'center', gap: 2 },
  scoreNumber: { fontSize: 36, fontWeight: '700', color: '#E8739E' },
  scoreLabel: { fontSize: FontSizes.caption, color: Colors.textSecondary, fontWeight: '600' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
  appreciationResults: { width: '100%', gap: Spacing.xs },
  resultItem: { flexDirection: 'row', gap: Spacing.xs, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  resultNum: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: '#E8739E' },
  resultText: { fontSize: FontSizes.bodySmall, color: Colors.text, flex: 1, lineHeight: 20 },
});
