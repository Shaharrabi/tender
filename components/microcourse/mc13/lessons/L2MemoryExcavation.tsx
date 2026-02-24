/**
 * L2MemoryExcavation — MC13 Lesson 2: "Memory Excavation"
 * Guided dig into positive shared memories. Users recall and
 * describe cherished moments, rate their emotional charge.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { SearchIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const MEMORY_PROMPTS = [
  { id: 'first', label: 'A moment you first felt truly seen', emoji: '👁️' },
  { id: 'laughter', label: 'A time you couldn\'t stop laughing together', emoji: '😂' },
  { id: 'overcome', label: 'Something hard you overcame as a team', emoji: '💪' },
  { id: 'surprise', label: 'A surprise that melted your heart', emoji: '🎁' },
  { id: 'quiet', label: 'A quiet moment that felt perfect', emoji: '🤫' },
  { id: 'proud', label: 'A time you felt proud of your partner', emoji: '🌟' },
];

const WARMTH_LEVELS = [
  { value: 1, label: 'Faint warmth', emoji: '🕯️' },
  { value: 2, label: 'Gentle glow', emoji: '☀️' },
  { value: 3, label: 'Full warmth', emoji: '🔥' },
];

type Phase = 'intro' | 'choose' | 'describe' | 'warmth' | 'second' | 'describe2' | 'warmth2' | 'results';

export default function L2MemoryExcavation({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [memory1Prompt, setMemory1Prompt] = useState('');
  const [memory1Text, setMemory1Text] = useState('');
  const [memory1Warmth, setMemory1Warmth] = useState(0);
  const [memory2Prompt, setMemory2Prompt] = useState('');
  const [memory2Text, setMemory2Text] = useState('');
  const [memory2Warmth, setMemory2Warmth] = useState(0);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: memory1Prompt, response: memory1Text, type: 'interactive' as const },
      { step: 2, prompt: 'Memory 1 warmth', response: String(memory1Warmth), type: 'interactive' as const },
      { step: 3, prompt: memory2Prompt, response: memory2Text, type: 'interactive' as const },
      { step: 4, prompt: 'Memory 2 warmth', response: String(memory2Warmth), type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, memory1Prompt, memory1Text, memory1Warmth, memory2Prompt, memory2Text, memory2Warmth, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><SearchIcon size={28} color="#E8739E" /></View>
          <Text style={styles.title}>🔍 Memory Excavation</Text>
          <Text style={styles.subtitle}>Digging Up Buried Treasure</Text>
          <Text style={styles.body}>Happy couples have rich, detailed "love maps" — mental archives of positive shared experiences they can access anytime.</Text>
          <Text style={styles.body}>You'll excavate 2 cherished memories. The act of remembering together is itself a bonding experience.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('choose'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Start Digging →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'choose' || phase === 'second') {
    const isSecond = phase === 'second';
    const usedPrompt = memory1Prompt;
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>{isSecond ? '🔍 Memory #2' : '🔍 Memory #1'}</Text>
          <Text style={styles.body}>Choose a memory prompt:</Text>
          <View style={styles.promptList}>
            {MEMORY_PROMPTS.filter(p => !isSecond || p.label !== usedPrompt).map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.promptBtn}
                onPress={() => {
                  haptics.tap();
                  if (isSecond) { setMemory2Prompt(p.label); setPhase('describe2'); }
                  else { setMemory1Prompt(p.label); setPhase('describe'); }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.promptEmoji}>{p.emoji}</Text>
                <Text style={styles.promptLabel}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'describe' || phase === 'describe2') {
    const isSecond = phase === 'describe2';
    const prompt = isSecond ? memory2Prompt : memory1Prompt;
    const text = isSecond ? memory2Text : memory1Text;
    const setText = isSecond ? setMemory2Text : setMemory1Text;
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>📝 Describe It</Text>
          <Text style={styles.promptHighlight}>{prompt}</Text>
          <Text style={styles.body}>Close your eyes for a moment. Let the memory come back. Where were you? What did you see, hear, feel?</Text>
          <TextInput
            style={styles.memoryInput}
            placeholder="I remember..."
            placeholderTextColor={Colors.textMuted}
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            style={[styles.primaryBtn, !text.trim() && styles.disabledBtn]}
            onPress={() => { haptics.tap(); setPhase(isSecond ? 'warmth2' : 'warmth'); }}
            disabled={!text.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'warmth' || phase === 'warmth2') {
    const isSecond = phase === 'warmth2';
    const warmth = isSecond ? memory2Warmth : memory1Warmth;
    const setWarmth = isSecond ? setMemory2Warmth : setMemory1Warmth;
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.title}>🌡️ Warmth Check</Text>
          <Text style={styles.body}>How much warmth do you feel when you recall this memory?</Text>
          <View style={styles.warmthList}>
            {WARMTH_LEVELS.map(w => (
              <TouchableOpacity
                key={w.value}
                style={[styles.warmthBtn, warmth === w.value && styles.warmthBtnActive]}
                onPress={() => { haptics.tap(); setWarmth(w.value); }}
                activeOpacity={0.7}
              >
                <Text style={styles.warmthEmoji}>{w.emoji}</Text>
                <Text style={[styles.warmthLabel, warmth === w.value && styles.warmthLabelActive]}>{w.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.primaryBtn, warmth === 0 && styles.disabledBtn]}
            onPress={() => {
              haptics.tap();
              if (isSecond) setPhase('results');
              else setPhase('second');
            }}
            disabled={warmth === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryBtnText}>{isSecond ? 'See Results →' : 'Next Memory →'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // results
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.resultCard}>
        <Text style={styles.title}>💎 Your Excavated Treasures</Text>
        <View style={styles.treasureBox}>
          <Text style={styles.treasureLabel}>{memory1Prompt}</Text>
          <Text style={styles.treasureText}>{memory1Text.slice(0, 100)}{memory1Text.length > 100 ? '...' : ''}</Text>
          <Text style={styles.warmthIndicator}>{WARMTH_LEVELS.find(w => w.value === memory1Warmth)?.emoji} {WARMTH_LEVELS.find(w => w.value === memory1Warmth)?.label}</Text>
        </View>
        <View style={styles.treasureBox}>
          <Text style={styles.treasureLabel}>{memory2Prompt}</Text>
          <Text style={styles.treasureText}>{memory2Text.slice(0, 100)}{memory2Text.length > 100 ? '...' : ''}</Text>
          <Text style={styles.warmthIndicator}>{WARMTH_LEVELS.find(w => w.value === memory2Warmth)?.emoji} {WARMTH_LEVELS.find(w => w.value === memory2Warmth)?.label}</Text>
        </View>
        <Text style={styles.insightText}>These memories are relationship resources. When things get hard, recalling shared positive experiences literally changes your brain chemistry toward connection.</Text>
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
  promptList: { gap: Spacing.sm, width: '100%' },
  promptBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FFFDF5' },
  promptEmoji: { fontSize: 24 },
  promptLabel: { fontSize: FontSizes.body, color: Colors.text, fontWeight: '500', flex: 1 },
  promptHighlight: { fontSize: FontSizes.body, color: '#E8739E', fontWeight: '700', fontStyle: 'italic', textAlign: 'center' },
  memoryInput: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 120, backgroundColor: '#FFFCF7', textAlignVertical: 'top' },
  warmthList: { gap: Spacing.sm, width: '100%' },
  warmthBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FFFDF5' },
  warmthBtnActive: { borderColor: '#E8739E', backgroundColor: '#FFE0E8' },
  warmthEmoji: { fontSize: 24 },
  warmthLabel: { fontSize: FontSizes.body, color: Colors.text, fontWeight: '500' },
  warmthLabelActive: { color: '#C4547A', fontWeight: '700' },
  treasureBox: { width: '100%', backgroundColor: '#FFE0E8', borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.xs },
  treasureLabel: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: '#C4547A' },
  treasureText: { fontSize: FontSizes.bodySmall, color: Colors.text, fontStyle: 'italic', lineHeight: 20 },
  warmthIndicator: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
