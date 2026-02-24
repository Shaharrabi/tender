/**
 * L1BetrayalAnatomy — MC14 Lesson 1: "Understanding the Wound"
 * Explore the layers of betrayal: the act, the meaning, the impact.
 * Educational + personal assessment.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { SearchIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const BETRAYAL_LAYERS = [
  { id: 'act', label: 'The Act', description: 'What specifically happened — the concrete event or behavior.', emoji: '📋', color: '#C44A4A' },
  { id: 'meaning', label: 'The Meaning', description: 'What it meant to you — what story it told about your worth, your safety, your relationship.', emoji: '💭', color: '#4A6B8A' },
  { id: 'identity', label: 'The Identity Wound', description: 'How it changed how you see yourself — "Am I not enough? Am I a fool for trusting?"', emoji: '🪞', color: '#C4A35A' },
  { id: 'worldview', label: 'The Worldview Shift', description: 'How it changed how you see relationships, trust, and safety in general.', emoji: '🌍', color: '#8A8A8A' },
];

const IMPACT_AREAS = [
  'I feel hypervigilant / always watching',
  'I struggle to believe what they say',
  'I feel less confident in myself',
  'I find it hard to be vulnerable',
  'I question my judgment',
  'I feel anger that comes in waves',
  'I feel sad about what we lost',
  'I avoid certain conversations',
];

type Phase = 'intro' | 'layers' | 'personal' | 'impact' | 'results';

export default function L1BetrayalAnatomy({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentLayer, setCurrentLayer] = useState(0);
  const [personalNote, setPersonalNote] = useState('');
  const [selectedImpacts, setSelectedImpacts] = useState<string[]>([]);

  const toggleImpact = useCallback((item: string) => {
    haptics.tap();
    setSelectedImpacts(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }, [haptics]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Personal betrayal reflection', response: personalNote, type: 'interactive' as const },
      { step: 2, prompt: 'Impact areas identified', response: JSON.stringify(selectedImpacts), type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, personalNote, selectedImpacts, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><SearchIcon size={28} color="#4A6B8A" /></View>
          <Text style={styles.title}>🔍 Understanding the Wound</Text>
          <Text style={styles.subtitle}>The Anatomy of Betrayal</Text>
          <Text style={styles.body}>Trust repair starts with understanding. Not excusing, not minimizing — understanding the full shape of what happened.</Text>
          <Text style={styles.body}>Betrayal has layers. Most people only see the surface — the act itself. But healing requires seeing all four layers.</Text>
          <Text style={styles.cautionBox}>This lesson deals with trust violations. Go at your own pace. You can skip any part that feels too much right now.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('layers'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Explore the Layers →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'layers') {
    const layer = BETRAYAL_LAYERS[currentLayer];
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.counter}>Layer {currentLayer + 1} of {BETRAYAL_LAYERS.length}</Text>
        <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${((currentLayer + 1) / BETRAYAL_LAYERS.length) * 100}%` }]} /></View>
        <View style={[styles.layerCard, { borderLeftColor: layer.color }]}>
          <Text style={styles.layerEmoji}>{layer.emoji}</Text>
          <Text style={[styles.layerTitle, { color: layer.color }]}>{layer.label}</Text>
          <Text style={styles.layerDesc}>{layer.description}</Text>
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            haptics.tap();
            if (currentLayer < BETRAYAL_LAYERS.length - 1) setCurrentLayer(i => i + 1);
            else setPhase('personal');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryBtnText}>{currentLayer < BETRAYAL_LAYERS.length - 1 ? 'Next Layer →' : 'Personalize →'}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (phase === 'personal') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>📝 Your Experience</Text>
          <Text style={styles.body}>Without needing to share details, which layer resonates most with your experience? What part of the wound feels most unhealed?</Text>
          <TextInput
            style={styles.personalInput}
            placeholder="The part that hurts most is..."
            placeholderTextColor={Colors.textMuted}
            value={personalNote}
            onChangeText={setPersonalNote}
            multiline
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('impact'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { haptics.tap(); setPhase('impact'); }} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip this step</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'impact') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>🎯 Current Impact</Text>
          <Text style={styles.body}>Which of these describe your experience right now? Select all that apply:</Text>
          <View style={styles.impactList}>
            {IMPACT_AREAS.map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.impactChip, selectedImpacts.includes(item) && styles.impactChipActive]}
                onPress={() => toggleImpact(item)}
                activeOpacity={0.7}
              >
                <Text style={[styles.impactText, selectedImpacts.includes(item) && styles.impactTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('results'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>See Summary →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // results
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.resultCard}>
        <Text style={styles.title}>🔍 What You've Mapped</Text>
        <Text style={styles.body}>You've identified {selectedImpacts.length} active impact area{selectedImpacts.length !== 1 ? 's' : ''}. This isn't a diagnosis — it's a map.</Text>
        <Text style={styles.insightText}>Understanding the wound is the first step to healing it. You can't repair what you can't see.</Text>
        <View style={styles.layerSummary}>
          {BETRAYAL_LAYERS.map(l => (
            <View key={l.id} style={styles.layerMiniRow}>
              <Text style={styles.layerMiniEmoji}>{l.emoji}</Text>
              <Text style={styles.layerMiniLabel}>{l.label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.body}>In the next lessons, you'll learn specific tools to address each layer — from atonement to rebuilding.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: { backgroundColor: '#FAFBFD', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#D0D8E0', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  resultCard: { backgroundColor: '#FAFBFD', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: '#4A6B8A', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#4A6B8A20', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#4A6B8A', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  cautionBox: { fontSize: FontSizes.bodySmall, color: '#C4A35A', backgroundColor: '#F0E4C420', padding: Spacing.md, borderRadius: BorderRadius.md, borderLeftWidth: 3, borderLeftColor: '#C4A35A', textAlign: 'left', alignSelf: 'stretch', lineHeight: 20 },
  counter: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  progressBar: { height: 4, backgroundColor: Colors.borderLight, borderRadius: 2, marginBottom: Spacing.md },
  progressFill: { height: 4, backgroundColor: '#4A6B8A', borderRadius: 2 },
  layerCard: { backgroundColor: '#FAFBFD', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#D0D8E0', borderLeftWidth: 4, gap: Spacing.md, alignItems: 'center', marginBottom: Spacing.md },
  layerEmoji: { fontSize: 40 },
  layerTitle: { fontSize: FontSizes.headingS, fontWeight: '700' },
  layerDesc: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  personalInput: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 100, backgroundColor: '#FFFCF7', textAlignVertical: 'top' },
  skipText: { fontSize: FontSizes.bodySmall, color: Colors.textMuted, fontWeight: '500' },
  impactList: { gap: Spacing.xs, width: '100%' },
  impactChip: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FAFBFD' },
  impactChipActive: { borderColor: '#4A6B8A', backgroundColor: '#C4D4E4' },
  impactText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary },
  impactTextActive: { color: '#355570', fontWeight: '600' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
  layerSummary: { gap: Spacing.xs },
  layerMiniRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  layerMiniEmoji: { fontSize: 18 },
  layerMiniLabel: { fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '500' },
});
