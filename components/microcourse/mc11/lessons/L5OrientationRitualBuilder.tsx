/**
 * L5OrientationRitualBuilder — MC11 Lesson 5: "Your Daily Orientation Ritual"
 * Users design a personal 2-minute orientation ritual combining
 * elements from previous lessons: senses, pleasure, amplification.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { FlagIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface RitualStep { id: string; label: string; emoji: string; description: string }

const RITUAL_ELEMENTS: RitualStep[] = [
  { id: 'orient-see', label: 'Visual scan', emoji: '👁️', description: 'Look around slowly. Find something pleasant to rest your eyes on.' },
  { id: 'orient-hear', label: 'Sound check', emoji: '👂', description: 'Close your eyes. Notice 3 sounds around you.' },
  { id: 'orient-feel', label: 'Body scan', emoji: '✋', description: 'Feel your feet, your seat, your hands. Notice temperature and texture.' },
  { id: 'amplify', label: 'Amplify pleasure', emoji: '🔊', description: 'Pick the most pleasant sensation. Give it 15 seconds of pure attention.' },
  { id: 'breath', label: 'Soft exhale', emoji: '🌬️', description: 'Three slow exhales. Let your jaw and shoulders soften.' },
  { id: 'gratitude', label: 'One gratitude', emoji: '🙏', description: 'Name one thing you genuinely appreciate right now.' },
  { id: 'smile', label: 'Micro-smile', emoji: '😊', description: 'Let the corners of your mouth lift slightly. Just that.' },
  { id: 'intention', label: 'Set intention', emoji: '🎯', description: 'Choose one word for how you want to show up today.' },
];

const WHEN_OPTIONS = ['Morning (first thing)', 'Before work', 'Mid-day reset', 'Before seeing partner', 'Evening wind-down', 'When stressed'];
const MAX_STEPS = 5;

type Phase = 'intro' | 'build' | 'when' | 'name' | 'results';

export default function L5OrientationRitualBuilder({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedSteps, setSelectedSteps] = useState<RitualStep[]>([]);
  const [whenToUse, setWhenToUse] = useState('');
  const [ritualName, setRitualName] = useState('');
  const [commitment, setCommitment] = useState('');

  const toggleStep = useCallback((step: RitualStep) => {
    haptics.tap();
    setSelectedSteps(prev => {
      const exists = prev.find(s => s.id === step.id);
      if (exists) return prev.filter(s => s.id !== step.id);
      if (prev.length >= MAX_STEPS) return prev;
      return [...prev, step];
    });
  }, [haptics]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Orientation ritual steps', response: JSON.stringify(selectedSteps.map(s => s.label)), type: 'interactive' as const },
      { step: 2, prompt: 'When to use ritual', response: whenToUse, type: 'interactive' as const },
      { step: 3, prompt: 'Ritual name', response: ritualName || 'My Orientation Ritual', type: 'interactive' as const },
      { step: 4, prompt: 'Commitment', response: commitment, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, selectedSteps, whenToUse, ritualName, commitment, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><FlagIcon size={28} color="#DAA520" /></View>
          <Text style={styles.title}>🏁 Your Orientation Ritual</Text>
          <Text style={styles.subtitle}>Making It Yours</Text>
          <Text style={styles.body}>You've learned the science. You've felt the shift. Now it's time to design a 2-minute ritual you'll actually use.</Text>
          <Text style={styles.body}>Pick 3-5 elements that resonated with you. Order matters — you'll do them in sequence.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('build'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Design My Ritual →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'build') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.progressText}>Your Ritual: {selectedSteps.length} of {MAX_STEPS} steps</Text>

        {selectedSteps.length > 0 && (
          <View style={styles.previewSection}>
            {selectedSteps.map((s, i) => (
              <View key={s.id} style={styles.previewStep}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{i + 1}</Text></View>
                <Text style={styles.previewStepLabel}>{s.emoji} {s.label}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.elementList}>
          {RITUAL_ELEMENTS.map(el => {
            const selected = !!selectedSteps.find(s => s.id === el.id);
            const disabled = !selected && selectedSteps.length >= MAX_STEPS;
            const stepNum = selectedSteps.findIndex(s => s.id === el.id) + 1;
            return (
              <TouchableOpacity
                key={el.id}
                style={[styles.elementCard, selected && styles.elementCardSelected, disabled && styles.elementCardDisabled]}
                onPress={() => toggleStep(el)}
                activeOpacity={0.7}
                disabled={disabled}
              >
                <View style={styles.elementHeader}>
                  <Text style={styles.elementEmoji}>{el.emoji}</Text>
                  <Text style={[styles.elementLabel, selected && styles.elementLabelSelected]}>{el.label}</Text>
                  {selected && <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>{stepNum}</Text></View>}
                </View>
                <Text style={styles.elementDesc}>{el.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, selectedSteps.length < 3 && styles.disabledBtn]}
          onPress={() => { haptics.tap(); setPhase('when'); }}
          disabled={selectedSteps.length < 3}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
        {selectedSteps.length < 3 && <Text style={styles.hint}>Pick at least 3 elements</Text>}
      </ScrollView>
    );
  }

  if (phase === 'when') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>⏰ When Will You Use It?</Text>
          <Text style={styles.body}>Rituals work best when anchored to a specific moment. When will you practice your orientation?</Text>
          <View style={styles.optionList}>
            {WHEN_OPTIONS.map(opt => (
              <TouchableOpacity key={opt} style={[styles.optionBtn, whenToUse === opt && styles.optionBtnActive]} onPress={() => { haptics.tap(); setWhenToUse(opt); }} activeOpacity={0.7}>
                <Text style={[styles.optionText, whenToUse === opt && styles.optionTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.primaryBtn, !whenToUse && styles.disabledBtn]}
            onPress={() => { haptics.tap(); setPhase('name'); }}
            disabled={!whenToUse}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'name') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>✨ Name Your Ritual</Text>
          <Text style={styles.body}>Give it a name that feels right. Something you'd tell yourself: "Time for my ___."</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="e.g. Morning Reset, Safety Scan, My 2 Minutes..."
            placeholderTextColor={Colors.textMuted}
            value={ritualName}
            onChangeText={setRitualName}
          />
          <Text style={styles.body}>One sentence about why this matters to you:</Text>
          <TextInput
            style={styles.reflectionInput}
            placeholder="I'm committing to this because..."
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
        <Text style={styles.title}>🏁 {ritualName || 'My Orientation Ritual'}</Text>
        <Text style={styles.whenBadge}>{whenToUse}</Text>
        <View style={styles.ritualSteps}>
          {selectedSteps.map((s, i) => (
            <View key={s.id} style={styles.ritualStep}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{i + 1}</Text></View>
              <View style={styles.ritualStepContent}>
                <Text style={styles.ritualStepLabel}>{s.emoji} {s.label}</Text>
                <Text style={styles.ritualStepDesc}>{s.description}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.insightText}>This is your portable nervous system toolkit. No app needed, no equipment — just 2 minutes and your own senses.</Text>
        {commitment ? <Text style={styles.commitmentText}>"{commitment}"</Text> : null}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Finish Course →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: { backgroundColor: '#FFF8E7', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F5E6B8', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  resultCard: { backgroundColor: '#FFF8E7', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: '#DAA520', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#DAA52020', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#DAA520', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill, marginTop: Spacing.sm },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  disabledBtn: { opacity: 0.4 },
  progressText: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600', marginBottom: Spacing.sm },
  previewSection: { backgroundColor: '#FFF3D4', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, gap: Spacing.xs },
  previewStep: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  previewStepLabel: { fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '500' },
  elementList: { gap: Spacing.sm, marginBottom: Spacing.md },
  elementCard: { borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FFFDF5', gap: Spacing.xs },
  elementCardSelected: { borderColor: '#DAA520', backgroundColor: '#FFF8E7' },
  elementCardDisabled: { opacity: 0.35 },
  elementHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  elementEmoji: { fontSize: 20 },
  elementLabel: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.text, flex: 1 },
  elementLabelSelected: { color: '#B8860B' },
  elementDesc: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, lineHeight: 20 },
  stepBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#DAA520', alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  hint: { fontSize: FontSizes.caption, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center' },
  optionList: { gap: Spacing.sm, width: '100%' },
  optionBtn: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FFFDF5' },
  optionBtnActive: { borderColor: '#DAA520', backgroundColor: '#FFF3D4' },
  optionText: { fontSize: FontSizes.body, color: Colors.text, textAlign: 'center' },
  optionTextActive: { color: '#B8860B', fontWeight: '600' },
  nameInput: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, backgroundColor: '#FFFCF7', textAlign: 'center' },
  reflectionInput: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 60, backgroundColor: '#FFFCF7', textAlignVertical: 'top' },
  whenBadge: { backgroundColor: '#DAA52020', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.pill, fontSize: FontSizes.bodySmall, color: '#B8860B', fontWeight: '600', overflow: 'hidden' },
  ritualSteps: { width: '100%', gap: Spacing.sm },
  ritualStep: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#DAA520', alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  ritualStepContent: { flex: 1, gap: 2 },
  ritualStepLabel: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.text },
  ritualStepDesc: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, lineHeight: 18 },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
  commitmentText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontStyle: 'italic', textAlign: 'center' },
});
