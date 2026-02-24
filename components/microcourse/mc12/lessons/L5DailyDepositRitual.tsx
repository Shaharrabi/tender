/**
 * L5DailyDepositRitual — MC12 Lesson 5: "The Daily Deposit"
 * Users design a daily bid-making commitment: pick 3 ways
 * to make intentional bids, schedule them, name the ritual.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { FlagIcon, HeartIcon, PenIcon, StarIcon } from '@/assets/graphics/icons';
import { MC12_PALETTE } from '@/constants/mc12Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface DepositIdea { id: string; label: string; when: string }

const DEPOSIT_IDEAS: DepositIdea[] = [
  { id: 'greeting', label: 'Enthusiastic greeting', when: 'Coming home' },
  { id: 'ask-day', label: 'Ask about their day (and listen)', when: 'Evening' },
  { id: 'touch', label: '6-second hug', when: 'Morning or night' },
  { id: 'compliment', label: 'Specific compliment', when: 'Anytime' },
  { id: 'share', label: 'Share something interesting', when: 'When you find it' },
  { id: 'coffee', label: 'Make their drink', when: 'Morning' },
  { id: 'eye-contact', label: 'Stop & make eye contact', when: 'During conversation' },
  { id: 'thank', label: 'Say thank you for something specific', when: 'Daily' },
  { id: 'goodnight', label: 'Meaningful goodnight', when: 'Bedtime' },
  { id: 'text', label: 'Mid-day "thinking of you" text', when: 'Afternoon' },
  { id: 'invite', label: 'Invite them into what you\'re doing', when: 'When engaged' },
  { id: 'recall', label: 'Bring up a shared memory', when: 'Quiet moments' },
];

const MAX_DEPOSITS = 3;

type Phase = 'intro' | 'choose' | 'commit' | 'results';

export default function L5DailyDepositRitual({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selected, setSelected] = useState<DepositIdea[]>([]);
  const [commitment, setCommitment] = useState('');

  const toggleDeposit = useCallback((item: DepositIdea) => {
    haptics.tap();
    setSelected(prev => {
      const exists = prev.find(d => d.id === item.id);
      if (exists) return prev.filter(d => d.id !== item.id);
      if (prev.length >= MAX_DEPOSITS) return prev;
      return [...prev, item];
    });
  }, [haptics]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Daily deposits chosen', response: JSON.stringify(selected.map(d => ({ label: d.label, when: d.when }))), type: 'interactive' as const },
      { step: 2, prompt: 'Commitment statement', response: commitment, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, selected, commitment, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><FlagIcon size={28} color="#FF6B6B" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><HeartIcon size={20} color={MC12_PALETTE.coral} /><Text style={styles.title}>The Daily Deposit</Text></View>
          <Text style={styles.subtitle}>Building Your Emotional Bank Account</Text>
          <Text style={styles.body}>Gottman calls it the "emotional bank account." Every bid you make — and every time you turn toward — is a deposit.</Text>
          <Text style={styles.body}>Pick 3 intentional deposits you'll make daily. These aren't grand gestures — they're small, consistent acts of connection.</Text>
          <Text style={styles.body}>Consistency beats intensity. Three small deposits daily = 1,095 connection moments per year.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('choose'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Choose My Deposits →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'choose') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.progressText}>Your Deposits: {selected.length} of {MAX_DEPOSITS}</Text>
        {selected.length > 0 && (
          <View style={styles.previewRow}>
            {selected.map((d, i) => (
              <View key={d.id} style={styles.previewChip}><HeartIcon size={18} color={MC12_PALETTE.coral} /></View>
            ))}
          </View>
        )}
        <View style={styles.depositList}>
          {DEPOSIT_IDEAS.map(item => {
            const isSelected = !!selected.find(d => d.id === item.id);
            const disabled = !isSelected && selected.length >= MAX_DEPOSITS;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.depositCard, isSelected && styles.depositCardSelected, disabled && styles.depositCardDisabled]}
                onPress={() => toggleDeposit(item)}
                activeOpacity={0.7}
                disabled={disabled}
              >
                <StarIcon size={20} color={MC12_PALETTE.coral} />
                <View style={styles.depositContent}>
                  <Text style={[styles.depositLabel, isSelected && styles.depositLabelSelected]}>{item.label}</Text>
                  <Text style={styles.depositWhen}>{item.when}</Text>
                </View>
                {isSelected && <View style={styles.checkmark}><Text style={styles.checkmarkText}>✓</Text></View>}
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, selected.length < MAX_DEPOSITS && styles.disabledBtn]}
          onPress={() => { haptics.tap(); setPhase('commit'); }}
          disabled={selected.length < MAX_DEPOSITS}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
        {selected.length < MAX_DEPOSITS && <Text style={styles.hint}>Pick exactly 3 deposits</Text>}
      </ScrollView>
    );
  }

  if (phase === 'commit') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><PenIcon size={20} color={MC12_PALETTE.coral} /><Text style={styles.title}>Your Commitment</Text></View>
          <Text style={styles.body}>Your 3 daily deposits:</Text>
          {selected.map((d, i) => (
            <View key={d.id} style={styles.commitItem}>
              <Text style={styles.commitNum}>{i + 1}.</Text>
              <Text style={styles.commitLabel}>{d.label}</Text>
              <Text style={styles.commitWhen}>({d.when})</Text>
            </View>
          ))}
          <Text style={styles.body}>Why do these 3 deposits matter to your relationship?</Text>
          <TextInput
            style={styles.commitInput}
            placeholder="These matter because..."
            placeholderTextColor={Colors.textMuted}
            value={commitment}
            onChangeText={setCommitment}
            multiline
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('results'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Complete →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // results
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.resultCard}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}><HeartIcon size={20} color={MC12_PALETTE.coral} /><Text style={styles.title}>Your Daily Deposit Plan</Text></View>
        <View style={styles.depositPlan}>
          {selected.map((d, i) => (
            <View key={d.id} style={styles.planItem}>
              <View style={styles.planNum}><Text style={styles.planNumText}>{i + 1}</Text></View>
              <View style={styles.planContent}>
                <Text style={styles.planLabel}>{d.label}</Text>
                <Text style={styles.planWhen}>When: {d.when}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.mathBox}>
          <Text style={styles.mathText}>3 deposits × 365 days = <Text style={{ fontWeight: '700', color: '#FF6B6B' }}>1,095 connection moments</Text></Text>
        </View>
        <Text style={styles.insightText}>Small, consistent bids compound into deep trust. You don't need grand gestures — you need daily ones.</Text>
        {commitment ? <Text style={styles.commitmentQuote}>"{commitment}"</Text> : null}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Finish Course →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: { backgroundColor: '#FFF5F5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0D4D4', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  resultCard: { backgroundColor: '#FFF5F5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: '#FF6B6B', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF6B6B20', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#FF6B6B', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill, marginTop: Spacing.sm },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  disabledBtn: { opacity: 0.4 },
  progressText: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600', marginBottom: Spacing.sm },
  previewRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  previewChip: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF6B6B15', borderWidth: 2, borderColor: '#FF6B6B', alignItems: 'center', justifyContent: 'center' },
  previewEmoji: { fontSize: 20 },
  depositList: { gap: Spacing.sm, marginBottom: Spacing.md },
  depositCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FFFDF5', gap: Spacing.sm },
  depositCardSelected: { borderColor: '#FF6B6B', backgroundColor: '#FFF5F5' },
  depositCardDisabled: { opacity: 0.35 },
  depositEmoji: { fontSize: 24 },
  depositContent: { flex: 1, gap: 2 },
  depositLabel: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.text },
  depositLabelSelected: { color: '#E05555' },
  depositWhen: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  checkmark: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FF6B6B', alignItems: 'center', justifyContent: 'center' },
  checkmarkText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  hint: { fontSize: FontSizes.caption, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center' },
  commitItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  commitNum: { fontSize: FontSizes.body, fontWeight: '700', color: '#FF6B6B' },
  commitLabel: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.text },
  commitWhen: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary },
  commitInput: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 80, backgroundColor: '#FFFCF7', textAlignVertical: 'top' },
  depositPlan: { width: '100%', gap: Spacing.sm },
  planItem: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  planNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF6B6B', alignItems: 'center', justifyContent: 'center' },
  planNumText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  planContent: { flex: 1, gap: 2 },
  planLabel: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.text },
  planWhen: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  mathBox: { backgroundColor: '#FFE8E8', padding: Spacing.md, borderRadius: BorderRadius.md, width: '100%' },
  mathText: { fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', lineHeight: 24 },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
  commitmentQuote: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontStyle: 'italic', textAlign: 'center' },
});
