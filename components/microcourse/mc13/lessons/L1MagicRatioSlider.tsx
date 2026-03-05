/**
 * L1MagicRatioSlider — MC13 Lesson 1: "The 5:1 Magic Ratio"
 * Users rate positive vs negative interactions, see their ratio,
 * learn about Gottman's 5:1 principle.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC13_PALETTE } from '@/constants/mc13Theme';
import { ScaleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const INTERACTION_TYPES = [
  { id: 'compliment', label: 'Genuine compliment', type: 'positive' as const },
  { id: 'criticism', label: 'Criticism or complaint', type: 'negative' as const },
  { id: 'laughter', label: 'Shared laughter', type: 'positive' as const },
  { id: 'contempt', label: 'Eye roll or sarcasm', type: 'negative' as const },
  { id: 'affection', label: 'Physical affection', type: 'positive' as const },
  { id: 'stonewalling', label: 'Silent treatment', type: 'negative' as const },
  { id: 'interest', label: 'Showing genuine interest', type: 'positive' as const },
  { id: 'defensiveness', label: 'Getting defensive', type: 'negative' as const },
  { id: 'appreciation', label: 'Saying thank you', type: 'positive' as const },
  { id: 'support', label: 'Emotional support', type: 'positive' as const },
];

const FREQUENCY_OPTIONS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'];
const FREQ_VALUES = [0, 1, 2, 3, 5];

type Phase = 'intro' | 'rate' | 'results';

export default function L1MagicRatioSlider({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [ratings, setRatings] = useState<number[]>([]);

  const handleRate = useCallback((freqIdx: number) => {
    haptics.tap();
    setRatings(prev => [...prev, FREQ_VALUES[freqIdx]]);
    if (currentIdx < INTERACTION_TYPES.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setPhase('results');
    }
  }, [haptics, currentIdx]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const positiveScore = INTERACTION_TYPES.reduce((sum, item, i) => item.type === 'positive' ? sum + (ratings[i] || 0) : sum, 0);
    const negativeScore = INTERACTION_TYPES.reduce((sum, item, i) => item.type === 'negative' ? sum + (ratings[i] || 0) : sum, 0);
    const ratio = negativeScore > 0 ? (positiveScore / negativeScore).toFixed(1) : 'N/A';
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Interaction ratings', response: JSON.stringify(INTERACTION_TYPES.map((item, i) => ({ label: item.label, type: item.type, frequency: FREQUENCY_OPTIONS[FREQ_VALUES.indexOf(ratings[i])] || 'Unknown' }))), type: 'interactive' as const },
      { step: 2, prompt: 'Positive:Negative ratio', response: `${ratio}:1 (positive: ${positiveScore}, negative: ${negativeScore})`, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, ratings, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><ScaleIcon size={28} color="#E8739E" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><ScaleIcon size={20} color={MC13_PALETTE.warmRose} /><Text style={styles.title}>The 5:1 Magic Ratio</Text></View>
          <Text style={styles.subtitle}>What Keeps Relationships Thriving</Text>
          <Text style={styles.body}>Gottman found that stable, happy couples have at least 5 positive interactions for every 1 negative one.</Text>
          <Text style={styles.body}>Below 5:1, relationships start to erode. Above it, they flourish. It's not about avoiding conflict — it's about the surrounding climate.</Text>
          <Text style={styles.body}>Rate how often these interactions happen in your relationship this week.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('rate'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Check My Ratio →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'rate') {
    const item = INTERACTION_TYPES[currentIdx];
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.counter}>{currentIdx + 1} of {INTERACTION_TYPES.length}</Text>
        <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${((currentIdx + 1) / INTERACTION_TYPES.length) * 100}%` }]} /></View>
        <View style={styles.rateCard}>
          <Text style={styles.rateLabel}>{item.label}</Text>
          <View style={[styles.typeBadge, { backgroundColor: item.type === 'positive' ? '#D4F0DF' : '#FDDEDE' }]}>
            <Text style={[styles.typeText, { color: item.type === 'positive' ? '#5A9E6F' : '#E57373' }]}>{item.type === 'positive' ? <Text style={{color:'#4CAF50',fontWeight:'700'}}>+</Text> : <Text style={{color:'#F44336',fontWeight:'700'}}>-</Text>} {item.type === 'positive' ? 'Positive' : 'Negative'}</Text>
          </View>
          <Text style={styles.rateQuestion}>How often this week?</Text>
          <View style={styles.freqList}>
            {FREQUENCY_OPTIONS.map((opt, i) => (
              <TouchableOpacity key={opt} style={styles.freqBtn} onPress={() => handleRate(i)} activeOpacity={0.7}>
                <Text style={styles.freqText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  // results
  const positiveScore = INTERACTION_TYPES.reduce((sum, item, i) => item.type === 'positive' ? sum + (ratings[i] || 0) : sum, 0);
  const negativeScore = INTERACTION_TYPES.reduce((sum, item, i) => item.type === 'negative' ? sum + (ratings[i] || 0) : sum, 0);
  const ratio = negativeScore > 0 ? positiveScore / negativeScore : positiveScore > 0 ? 10 : 0;
  const ratioDisplay = negativeScore > 0 ? ratio.toFixed(1) : '∞';
  const isHealthy = ratio >= 5;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}><ScaleIcon size={20} color={MC13_PALETTE.warmRose} /><Text style={styles.title}>Your Ratio</Text></View>
        <View style={[styles.ratioCircle, { borderColor: isHealthy ? '#5A9E6F' : '#E8739E' }]}>
          <Text style={[styles.ratioNumber, { color: isHealthy ? '#5A9E6F' : '#E8739E' }]}>{ratioDisplay}:1</Text>
          <Text style={styles.ratioLabel}>{isHealthy ? 'Healthy Zone' : 'Growth Zone'}</Text>
        </View>
        <View style={styles.scoreRow}>
          <View style={styles.scoreBox}><Text style={[styles.scoreNum, { color: '#5A9E6F' }]}>{positiveScore}</Text><Text style={styles.scoreLabel}>Positive</Text></View>
          <Text style={styles.scoreDivider}>:</Text>
          <View style={styles.scoreBox}><Text style={[styles.scoreNum, { color: '#E57373' }]}>{negativeScore}</Text><Text style={styles.scoreLabel}>Negative</Text></View>
        </View>
        <View style={styles.scaleBar}>
          <View style={[styles.scaleMark, { left: '0%' }]}><Text style={styles.scaleText}>0:1</Text></View>
          <View style={[styles.scaleMark, { left: '50%' }]}><Text style={[styles.scaleText, { fontWeight: '700', color: '#E8739E' }]}>5:1</Text></View>
          <View style={[styles.scaleMark, { left: '100%' }]}><Text style={styles.scaleText}>10:1</Text></View>
          <View style={styles.scaleTrack} />
          <View style={[styles.scaleTarget, { left: '50%' }]} />
        </View>
        {isHealthy ? (
          <Text style={styles.insightText}>Your ratio is in the healthy zone! This doesn't mean there's no room for growth — the more positive interactions, the more resilient your relationship becomes.</Text>
        ) : (
          <Text style={styles.insightText}>Your ratio has room to grow. The good news: you don't need to reduce negative interactions — just increase the positive ones. That's what the rest of this course is about.</Text>
        )}
        <Text style={styles.body}>The goal of this course: give you tools to build your positive side of the equation.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.scrollPadBottom },
  card: { backgroundColor: '#FFF8F0', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0D4E0', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8739E20', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#E8739E', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  counter: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, marginBottom: Spacing.md },
  progressFill: { height: 4, backgroundColor: '#E8739E', borderRadius: 2 },
  rateCard: { backgroundColor: '#FFFCF5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0D4E0', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  rateLabel: { fontSize: FontSizes.headingS, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  typeBadge: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadius.pill },
  typeText: { fontSize: FontSizes.caption, fontWeight: '600' },
  rateQuestion: { fontSize: FontSizes.body, color: Colors.textSecondary },
  freqList: { gap: Spacing.xs, width: '100%' },
  freqBtn: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FFFDF5', alignItems: 'center' },
  freqText: { fontSize: FontSizes.body, color: Colors.text, fontWeight: '500' },
  ratioCircle: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#FFF8F0', borderWidth: 4, alignItems: 'center', justifyContent: 'center', gap: 4 },
  ratioNumber: { fontSize: 32, fontWeight: '700' },
  ratioLabel: { fontSize: FontSizes.caption, color: Colors.textSecondary, fontWeight: '600' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  scoreBox: { alignItems: 'center', gap: 2 },
  scoreNum: { fontSize: 28, fontWeight: '700' },
  scoreLabel: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  scoreDivider: { fontSize: 24, color: Colors.textMuted },
  scaleBar: { width: '100%', height: 30, position: 'relative' },
  scaleMark: { position: 'absolute', top: 0 },
  scaleText: { fontSize: FontSizes.caption, color: Colors.textMuted },
  scaleTrack: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: Colors.borderLight, borderRadius: 2 },
  scaleTarget: { position: 'absolute', bottom: -4, width: 12, height: 12, borderRadius: 6, backgroundColor: '#E8739E', marginLeft: -6 },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
