/**
 * L5RebuildPlan — MC14 Lesson 5: "Your 90-Day Rebuild Plan"
 * Users create a concrete plan with weekly goals across
 * three 30-day phases: stabilize, reconnect, rebuild.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { FlagIcon, PenIcon, EyeIcon, ChatBubbleIcon, LightningIcon, NotepadIcon, CalendarIcon, HeartIcon, HandshakeIcon, SparkleIcon, BookOpenIcon, LightbulbIcon, ClipboardIcon, StarIcon, DoveIcon } from '@/assets/graphics/icons';
import { MC14_PALETTE } from '@/constants/mc14Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface PlanAction { id: string; label: string; phase: string }

const PLAN_ACTIONS: Record<string, PlanAction[]> = {
  stabilize: [
    { id: 'transparency', label: 'Full transparency (open phone, schedule, etc.)', phase: 'stabilize' },
    { id: 'check-ins', label: 'Daily emotional check-ins (5 min)', phase: 'stabilize' },
    { id: 'therapy', label: 'Start or continue couples therapy', phase: 'stabilize' },
    { id: 'triggers', label: 'Learn and respect trigger situations', phase: 'stabilize' },
    { id: 'individual', label: 'Individual therapy or journaling', phase: 'stabilize' },
  ],
  reconnect: [
    { id: 'dates', label: 'Weekly dedicated together time', phase: 'reconnect' },
    { id: 'appreciate', label: 'Daily specific appreciation', phase: 'reconnect' },
    { id: 'physical', label: 'Rebuild physical closeness (non-sexual first)', phase: 'reconnect' },
    { id: 'fun', label: 'Do something new and fun together', phase: 'reconnect' },
    { id: 'stories', label: 'Share positive memories regularly', phase: 'reconnect' },
  ],
  rebuild: [
    { id: 'future', label: 'Create a shared vision for the future', phase: 'rebuild' },
    { id: 'boundaries', label: 'Establish new relationship agreements', phase: 'rebuild' },
    { id: 'celebrate', label: 'Celebrate progress milestones', phase: 'rebuild' },
    { id: 'forgiveness', label: 'Explore forgiveness (when ready)', phase: 'rebuild' },
    { id: 'narrative', label: 'Co-author your "comeback story"', phase: 'rebuild' },
  ],
};

const ACTION_ICONS: Record<string, React.ReactNode> = {
  transparency: <EyeIcon size={18} color={MC14_PALETTE.woundRed} />,
  'check-ins': <ChatBubbleIcon size={18} color={MC14_PALETTE.woundRed} />,
  therapy: <HandshakeIcon size={18} color={MC14_PALETTE.woundRed} />,
  triggers: <LightningIcon size={18} color={MC14_PALETTE.woundRed} />,
  individual: <NotepadIcon size={18} color={MC14_PALETTE.woundRed} />,
  dates: <CalendarIcon size={18} color={MC14_PALETTE.mutedGold} />,
  appreciate: <HeartIcon size={18} color={MC14_PALETTE.mutedGold} />,
  physical: <HandshakeIcon size={18} color={MC14_PALETTE.mutedGold} />,
  fun: <SparkleIcon size={18} color={MC14_PALETTE.mutedGold} />,
  stories: <BookOpenIcon size={18} color={MC14_PALETTE.mutedGold} />,
  future: <LightbulbIcon size={18} color={MC14_PALETTE.repairGreen} />,
  boundaries: <ClipboardIcon size={18} color={MC14_PALETTE.repairGreen} />,
  celebrate: <StarIcon size={18} color={MC14_PALETTE.repairGreen} />,
  forgiveness: <DoveIcon size={18} color={MC14_PALETTE.repairGreen} />,
  narrative: <BookOpenIcon size={18} color={MC14_PALETTE.repairGreen} />,
};

const PHASES = [
  { key: 'stabilize', label: 'Days 1-30: Stabilize', description: 'Create safety, transparency, and routine.', color: '#C44A4A' },
  { key: 'reconnect', label: 'Days 31-60: Reconnect', description: 'Cautiously rebuild emotional closeness.', color: '#C4A35A' },
  { key: 'rebuild', label: 'Days 61-90: Rebuild', description: 'Create new patterns and shared meaning.', color: '#5A9E6F' },
];

type Phase = 'intro' | 'plan' | 'commitment' | 'results';

export default function L5RebuildPlan({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, string[]>>({ stabilize: [], reconnect: [], rebuild: [] });
  const [commitment, setCommitment] = useState('');

  const toggleAction = useCallback((phaseKey: string, actionId: string) => {
    haptics.tap();
    setSelected(prev => {
      const current = prev[phaseKey] || [];
      const exists = current.includes(actionId);
      if (exists) return { ...prev, [phaseKey]: current.filter(id => id !== actionId) };
      if (current.length >= 3) return prev;
      return { ...prev, [phaseKey]: [...current, actionId] };
    });
  }, [haptics]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const planDetails = PHASES.map(p => ({
      phase: p.label,
      actions: (selected[p.key] || []).map(id => {
        const action = PLAN_ACTIONS[p.key].find(a => a.id === id);
        return action?.label || '';
      }),
    }));
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: '90-day rebuild plan', response: JSON.stringify(planDetails), type: 'interactive' as const },
      { step: 2, prompt: 'Commitment statement', response: commitment, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, selected, commitment, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><FlagIcon size={28} color="#4A6B8A" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><FlagIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>Your 90-Day Rebuild Plan</Text></View>
          <Text style={styles.subtitle}>From Intention to Action</Text>
          <Text style={styles.body}>Trust isn't rebuilt by promises — it's rebuilt by sustained, observable behavior over time.</Text>
          <Text style={styles.body}>You'll create a concrete plan across three 30-day phases. Pick 2-3 actions per phase that feel realistic and meaningful.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('plan'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Build My Plan →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'plan') {
    const currentPhase = PHASES[currentPhaseIdx];
    const actions = PLAN_ACTIONS[currentPhase.key];
    const selectedActions = selected[currentPhase.key] || [];

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.phaseNav}>
          {PHASES.map((p, i) => (
            <View key={p.key} style={[styles.phaseDot, i === currentPhaseIdx && { backgroundColor: p.color }, i < currentPhaseIdx && styles.phaseDotDone]} />
          ))}
        </View>
        <View style={[styles.phaseHeader, { borderLeftColor: currentPhase.color }]}>
          <Text style={[styles.phaseTitle, { color: currentPhase.color }]}>{currentPhase.label}</Text>
          <Text style={styles.phaseDesc}>{currentPhase.description}</Text>
        </View>
        <Text style={styles.selectText}>Pick 2-3 actions ({selectedActions.length} selected):</Text>
        <View style={styles.actionList}>
          {actions.map(action => {
            const isSelected = selectedActions.includes(action.id);
            const disabled = !isSelected && selectedActions.length >= 3;
            return (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, isSelected && { borderColor: currentPhase.color, backgroundColor: currentPhase.color + '10' }, disabled && styles.actionDisabled]}
                onPress={() => toggleAction(currentPhase.key, action.id)}
                activeOpacity={0.7}
                disabled={disabled}
              >
                <View>{ACTION_ICONS[action.id]}</View>
                <Text style={[styles.actionLabel, isSelected && { color: currentPhase.color, fontWeight: '700' }]}>{action.label}</Text>
                {isSelected && <Text style={[styles.checkmark, { color: currentPhase.color }]}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, selectedActions.length < 2 && styles.disabledBtn]}
          onPress={() => {
            haptics.tap();
            if (currentPhaseIdx < PHASES.length - 1) setCurrentPhaseIdx(i => i + 1);
            else setPhase('commitment');
          }}
          disabled={selectedActions.length < 2}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryBtnText}>{currentPhaseIdx < PHASES.length - 1 ? 'Next Phase →' : 'Write Commitment →'}</Text>
        </TouchableOpacity>
        {selectedActions.length < 2 && <Text style={styles.hint}>Pick at least 2 actions</Text>}
      </ScrollView>
    );
  }

  if (phase === 'commitment') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><PenIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>Your Commitment</Text></View>
          <Text style={styles.body}>Why are you choosing to rebuild? What gives you hope that this work is worth it?</Text>
          <TextInput
            style={styles.commitInput}
            placeholder="I'm choosing to rebuild because..."
            placeholderTextColor={Colors.textMuted}
            value={commitment}
            onChangeText={setCommitment}
            multiline
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('results'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>See My Plan →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // results
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.resultCard}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}><FlagIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>Your 90-Day Rebuild Plan</Text></View>
        {PHASES.map(p => {
          const actions = (selected[p.key] || []).map(id => PLAN_ACTIONS[p.key].find(a => a.id === id)).filter(Boolean);
          return (
            <View key={p.key} style={[styles.planPhase, { borderLeftColor: p.color }]}>
              <Text style={[styles.planPhaseTitle, { color: p.color }]}>{p.label}</Text>
              {actions.map(a => a && (
                <View key={a.id} style={{flexDirection:'row',alignItems:'center',gap:6}}>{ACTION_ICONS[a.id]}<Text style={styles.planAction}>{a.label}</Text></View>
              ))}
            </View>
          );
        })}
        <Text style={styles.insightText}>This plan is your roadmap, not a rigid schedule. Some weeks you'll progress fast, others you'll need to pause. That's normal — and it's okay.</Text>
        {commitment ? <Text style={styles.commitQuote}>"{commitment}"</Text> : null}
        <Text style={styles.body}>You've completed the Trust Repair course. The real work happens one day at a time, starting now.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Finish Course →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.scrollPadBottom },
  card: { backgroundColor: '#FAFBFD', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#D0D8E0', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  resultCard: { backgroundColor: '#FAFBFD', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: '#4A6B8A', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#4A6B8A20', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#4A6B8A', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill, alignSelf: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  disabledBtn: { opacity: 0.4 },
  phaseNav: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  phaseDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, backgroundColor: 'transparent' },
  phaseDotDone: { backgroundColor: '#5A9E6F', borderColor: '#5A9E6F' },
  phaseHeader: { borderLeftWidth: 4, paddingLeft: Spacing.md, marginBottom: Spacing.md, gap: 4 },
  phaseTitle: { fontSize: FontSizes.headingS, fontWeight: '700' },
  phaseDesc: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary },
  selectText: { fontSize: FontSizes.bodySmall, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  actionList: { gap: Spacing.xs, marginBottom: Spacing.md },
  actionCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FAFBFD' },
  actionDisabled: { opacity: 0.35 },
  actionLabel: { fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '500', flex: 1 },
  checkmark: { fontSize: 18, fontWeight: '700' },
  hint: { fontSize: FontSizes.caption, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center' },
  commitInput: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 80, backgroundColor: '#FFFCF7', textAlignVertical: 'top' },
  planPhase: { width: '100%', borderLeftWidth: 4, paddingLeft: Spacing.md, gap: Spacing.xs, paddingVertical: Spacing.xs },
  planPhaseTitle: { fontSize: FontSizes.body, fontWeight: '700' },
  planAction: { fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
  commitQuote: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontStyle: 'italic', textAlign: 'center' },
});
