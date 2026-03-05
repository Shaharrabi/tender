/**
 * L4RepairConversation — MC14 Lesson 4: "The Repair Conversation"
 * Guided template for a structured trust-repair conversation.
 * Users practice with fill-in-the-blank prompts.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { ChatBubbleIcon, ClipboardIcon, HeartPulseIcon, MirrorIcon, HandshakeIcon, HourglassIcon } from '@/assets/graphics/icons';
import { MC14_PALETTE } from '@/constants/mc14Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const CONVERSATION_STEPS = [
  { id: 'acknowledge', label: 'Acknowledge', instruction: 'Name what you did without minimizing or explaining.', prompt: 'What I did was...', placeholder: 'Name the specific behavior honestly' },
  { id: 'impact', label: 'Name the Impact', instruction: 'Show that you understand how it affected your partner.', prompt: 'I understand this made you feel...', placeholder: 'Name the emotions and consequences' },
  { id: 'own', label: 'Own It Fully', instruction: 'Take full responsibility without deflection or conditions.', prompt: 'This was my choice and my responsibility because...', placeholder: 'No "but", no "if", no "because you"' },
  { id: 'change', label: 'Commit to Change', instruction: 'Name the specific, verifiable actions you will take.', prompt: 'To rebuild trust, I am committed to...', placeholder: 'Specific behaviors, not vague promises' },
  { id: 'patience', label: 'Offer Patience', instruction: 'Acknowledge that healing takes time and you won\'t rush it.', prompt: 'I understand that rebuilding trust takes time, and I...', placeholder: 'Show willingness to be patient' },
];

const STEP_ICONS: Record<string, React.ReactNode> = {
  acknowledge: <ClipboardIcon size={24} color={MC14_PALETTE.slate} />,
  impact: <HeartPulseIcon size={24} color={MC14_PALETTE.woundRed} />,
  own: <MirrorIcon size={24} color={MC14_PALETTE.mutedGold} />,
  change: <HandshakeIcon size={24} color={MC14_PALETTE.repairGreen} />,
  patience: <HourglassIcon size={24} color={MC14_PALETTE.slate} />,
};

const STEP_MINI_ICONS: Record<string, React.ReactNode> = {
  acknowledge: <ClipboardIcon size={14} color={MC14_PALETTE.slate} />,
  impact: <HeartPulseIcon size={14} color={MC14_PALETTE.woundRed} />,
  own: <MirrorIcon size={14} color={MC14_PALETTE.mutedGold} />,
  change: <HandshakeIcon size={14} color={MC14_PALETTE.repairGreen} />,
  patience: <HourglassIcon size={14} color={MC14_PALETTE.slate} />,
};

type Phase = 'intro' | 'practice' | 'review' | 'results';

export default function L4RepairConversation({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const submitStep = useCallback(() => {
    haptics.tap();
    setAnswers(prev => [...prev, currentAnswer.trim()]);
    setCurrentAnswer('');
    if (currentStepIdx < CONVERSATION_STEPS.length - 1) {
      setCurrentStepIdx(i => i + 1);
    } else {
      setPhase('review');
    }
  }, [haptics, currentAnswer, currentStepIdx]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const conversationText = CONVERSATION_STEPS.map((s, i) => `${s.prompt} ${answers[i] || ''}`).join('\n\n');
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Repair conversation draft', response: conversationText, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, answers, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><ChatBubbleIcon size={28} color="#4A6B8A" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><ChatBubbleIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>The Repair Conversation</Text></View>
          <Text style={styles.subtitle}>A Structured Path to Accountability</Text>
          <Text style={styles.body}>Most repair conversations fail because they're unstructured — emotions take over, defensiveness kicks in, and nothing gets resolved.</Text>
          <Text style={styles.body}>This template gives you a 5-step structure. You'll practice drafting each part. This isn't the actual conversation — it's preparation.</Text>
          <Text style={styles.cautionBox}>Whether you're the one who betrayed or the one who was hurt, understanding this structure helps you know what genuine repair sounds like.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('practice'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Start Practicing →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'practice') {
    const step = CONVERSATION_STEPS[currentStepIdx];
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.counter}>Step {currentStepIdx + 1} of {CONVERSATION_STEPS.length}</Text>
        <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${((currentStepIdx + 1) / CONVERSATION_STEPS.length) * 100}%` }]} /></View>
        <View style={styles.stepCard}>
          <View style={styles.stepIconWrap}>{STEP_ICONS[step.id]}</View>
          <Text style={styles.stepTitle}>{step.label}</Text>
          <Text style={styles.stepInstruction}>{step.instruction}</Text>
          <Text style={styles.stepPrompt}>{step.prompt}</Text>
          <TextInput
            style={styles.stepInput}
            placeholder={step.placeholder}
            placeholderTextColor={Colors.textMuted}
            value={currentAnswer}
            onChangeText={setCurrentAnswer}
            multiline
            autoFocus
          />
          <TouchableOpacity
            style={[styles.primaryBtn, !currentAnswer.trim() && styles.disabledBtn]}
            onPress={submitStep}
            disabled={!currentAnswer.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryBtnText}>{currentStepIdx < CONVERSATION_STEPS.length - 1 ? 'Next Step →' : 'Review →'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setAnswers(prev => [...prev, '']); setCurrentAnswer(''); if (currentStepIdx < CONVERSATION_STEPS.length - 1) setCurrentStepIdx(i => i + 1); else setPhase('review'); }}>
            <Text style={styles.skipText}>Skip this step</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'review') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.conversationCard}>
          <Text style={styles.title}>Your Repair Draft</Text>
          {CONVERSATION_STEPS.map((s, i) => (
            <View key={s.id} style={styles.draftSection}>
              <View style={{flexDirection:'row',alignItems:'center',gap:6}}>{STEP_MINI_ICONS[s.id]}<Text style={styles.draftLabel}>{s.label}</Text></View>
              <Text style={styles.draftPrompt}>{s.prompt}</Text>
              {answers[i] ? (
                <Text style={styles.draftAnswer}>{answers[i]}</Text>
              ) : (
                <Text style={styles.draftSkipped}>(skipped)</Text>
              )}
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('results'); }} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Complete →</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // results
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.resultCard}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}><ChatBubbleIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>Conversation Ready</Text></View>
        <Text style={styles.insightText}>You've drafted a structured repair conversation. This isn't something to read aloud word-for-word — it's a map for when you're ready to have the real conversation.</Text>
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>When you have this conversation:</Text>
          <Text style={styles.tip}>Pick a calm, private moment</Text>
          <Text style={styles.tip}>Start with "I want to take responsibility"</Text>
          <Text style={styles.tip}>Don't defend — just own and listen</Text>
          <Text style={styles.tip}>Let your partner respond without interrupting</Text>
          <Text style={styles.tip}>This may need to happen more than once</Text>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Continue →</Text>
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
  cautionBox: { fontSize: FontSizes.bodySmall, color: '#C4A35A', backgroundColor: '#F0E4C420', padding: Spacing.md, borderRadius: BorderRadius.md, borderLeftWidth: 3, borderLeftColor: '#C4A35A', textAlign: 'left', alignSelf: 'stretch', lineHeight: 20 },
  counter: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, marginBottom: Spacing.md },
  progressFill: { height: 4, backgroundColor: '#4A6B8A', borderRadius: 2 },
  stepCard: { backgroundColor: '#FAFBFD', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#D0D8E0', gap: Spacing.sm, alignItems: 'center' },
  stepIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  stepTitle: { fontSize: FontSizes.headingS, fontWeight: '700', color: '#4A6B8A' },
  stepInstruction: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, textAlign: 'center', fontStyle: 'italic' },
  stepPrompt: { fontSize: FontSizes.body, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  stepInput: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 80, backgroundColor: '#FFFCF7', textAlignVertical: 'top' },
  skipText: { fontSize: FontSizes.bodySmall, color: Colors.textMuted },
  conversationCard: { backgroundColor: '#F0F2F5', borderRadius: BorderRadius.lg, padding: Spacing.lg, gap: Spacing.md, marginBottom: Spacing.md },
  draftSection: { gap: 4, borderBottomWidth: 1, borderBottomColor: '#D0D8E0', paddingBottom: Spacing.sm },
  draftLabel: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: '#4A6B8A' },
  draftPrompt: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontStyle: 'italic' },
  draftAnswer: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 22 },
  draftSkipped: { fontSize: FontSizes.bodySmall, color: Colors.textMuted, fontStyle: 'italic' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
  tipBox: { backgroundColor: '#C4D4E420', borderRadius: BorderRadius.md, padding: Spacing.md, width: '100%', gap: Spacing.xs },
  tipTitle: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: '#4A6B8A' },
  tip: { fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22, paddingLeft: Spacing.xs },
});
