/**
 * L3PleasurePaletteBuilder — MC11 Lesson 3: "Your Pleasure Palette"
 * Drag-and-drop style builder where users curate 6 pleasure items
 * from categories, with option to add custom items.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { SparkleIcon, MirrorIcon } from '@/assets/graphics/icons';
import { MC11_PALETTE } from '@/constants/mc11Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface PleasureItem { id: string; label: string; category: string }

const PLEASURE_ITEMS: PleasureItem[] = [
  { id: 'warm-drink', label: 'Warm drink', category: 'Comfort' },
  { id: 'flowers', label: 'Fresh flowers', category: 'Beauty' },
  { id: 'music', label: 'Favorite music', category: 'Sound' },
  { id: 'hot-shower', label: 'Hot shower', category: 'Body' },
  { id: 'sunlight', label: 'Sunlight on skin', category: 'Body' },
  { id: 'laughter', label: 'Laughing together', category: 'Connection' },
  { id: 'cooking', label: 'Cooking a meal', category: 'Creation' },
  { id: 'walking', label: 'Gentle walk', category: 'Movement' },
  { id: 'reading', label: 'Reading in bed', category: 'Stillness' },
  { id: 'petting', label: 'Pet cuddles', category: 'Touch' },
  { id: 'stretching', label: 'Morning stretch', category: 'Body' },
  { id: 'nature', label: 'Being in nature', category: 'Beauty' },
  { id: 'dancing', label: 'Dancing freely', category: 'Movement' },
  { id: 'candle', label: 'Candlelight', category: 'Beauty' },
  { id: 'hugging', label: 'A long hug', category: 'Connection' },
  { id: 'chocolate', label: 'Dark chocolate', category: 'Taste' },
  { id: 'birdsong', label: 'Birdsong', category: 'Sound' },
  { id: 'blanket', label: 'Soft blanket', category: 'Comfort' },
];

const MAX_PALETTE = 6;

type Phase = 'intro' | 'build' | 'reflect' | 'results';

export default function L3PleasurePaletteBuilder({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [palette, setPalette] = useState<PleasureItem[]>([]);
  const [customText, setCustomText] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [reflectionText, setReflectionText] = useState('');

  const toggleItem = useCallback((item: PleasureItem) => {
    haptics.tap();
    setPalette(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) return prev.filter(p => p.id !== item.id);
      if (prev.length >= MAX_PALETTE) return prev;
      return [...prev, item];
    });
  }, [haptics]);

  const addCustomItem = useCallback(() => {
    if (!customText.trim()) return;
    haptics.tap();
    const item: PleasureItem = { id: `custom-${Date.now()}`, label: customText.trim(), category: 'Custom' };
    setPalette(prev => prev.length < MAX_PALETTE ? [...prev, item] : prev);
    setCustomText('');
    setShowCustom(false);
  }, [haptics, customText]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Your Pleasure Palette', response: JSON.stringify(palette.map(p => ({ label: p.label, category: p.category }))), type: 'interactive' as const },
      { step: 2, prompt: 'When did you last enjoy one of these?', response: reflectionText, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, palette, reflectionText, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><SparkleIcon size={28} color="#DAA520" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><SparkleIcon size={20} color={MC11_PALETTE.warmGold} /><Text style={styles.title}>Your Pleasure Palette</Text></View>
          <Text style={styles.subtitle}>Curating Your Personal Resources</Text>
          <Text style={styles.body}>In OI, pleasure isn't indulgence — it's medicine. Your nervous system needs a menu of things that feel genuinely good.</Text>
          <Text style={styles.body}>You'll pick 6 items that bring you authentic pleasure. Think small, accessible, everyday things — not grand vacations.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('build'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Build My Palette →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'build') {
    const categories = [...new Set(PLEASURE_ITEMS.map(i => i.category))];
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.progressText}>Your Palette: {palette.length} of {MAX_PALETTE}</Text>
        <View style={styles.palettePreview}>
          {Array.from({ length: MAX_PALETTE }).map((_, i) => (
            <View key={i} style={[styles.paletteSlot, palette[i] && styles.paletteSlotFilled]}>
              <Text style={styles.paletteSlotText}>{palette[i] ? palette[i].label.charAt(0).toUpperCase() : '+'}</Text>
            </View>
          ))}
        </View>

        {categories.map(cat => (
          <View key={cat} style={styles.categorySection}>
            <Text style={styles.categoryLabel}>{cat}</Text>
            <View style={styles.itemGrid}>
              {PLEASURE_ITEMS.filter(i => i.category === cat).map(item => {
                const selected = !!palette.find(p => p.id === item.id);
                const disabled = !selected && palette.length >= MAX_PALETTE;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.itemChip, selected && styles.itemChipSelected, disabled && styles.itemChipDisabled]}
                    onPress={() => toggleItem(item)}
                    activeOpacity={0.7}
                    disabled={disabled}
                  >
                    <Text style={styles.itemEmoji}>{item.label.charAt(0).toUpperCase()}</Text>
                    <Text style={[styles.itemLabel, selected && styles.itemLabelSelected]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {!showCustom ? (
          <TouchableOpacity style={styles.addCustomBtn} onPress={() => { haptics.tap(); setShowCustom(true); }} activeOpacity={0.7}>
            <Text style={styles.addCustomText}>+ Add your own</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.customRow}>
            <TextInput style={styles.customInput} placeholder="Your pleasure item..." placeholderTextColor={Colors.textMuted} value={customText} onChangeText={setCustomText} />
            <TouchableOpacity style={styles.customAddBtn} onPress={addCustomItem} activeOpacity={0.7}>
              <Text style={styles.primaryBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.primaryBtn, palette.length < 3 && styles.disabledBtn]}
          onPress={() => { haptics.tap(); setPhase('reflect'); }}
          activeOpacity={0.7}
          disabled={palette.length < 3}
        >
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
        {palette.length < 3 && <Text style={styles.hint}>Pick at least 3 items</Text>}
      </ScrollView>
    );
  }

  if (phase === 'reflect') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><MirrorIcon size={20} color={MC11_PALETTE.warmGold} /><Text style={styles.title}>Quick Reflection</Text></View>
          <View style={styles.palettePreview}>
            {palette.map((p, i) => (
              <View key={i} style={[styles.paletteSlot, styles.paletteSlotFilled]}>
                <Text style={styles.paletteSlotText}>{p.label.charAt(0).toUpperCase()}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.body}>Look at your palette. When was the last time you let yourself fully enjoy one of these — without guilt, without rushing?</Text>
          <TextInput
            style={styles.reflectionInput}
            placeholder="Write freely..."
            placeholderTextColor={Colors.textMuted}
            value={reflectionText}
            onChangeText={setReflectionText}
            multiline
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('results'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>See My Palette →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // results
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}><SparkleIcon size={20} color={MC11_PALETTE.warmGold} /><Text style={styles.title}>Your Pleasure Palette</Text></View>
        <View style={styles.resultGrid}>
          {palette.map((p, i) => (
            <View key={i} style={styles.resultItem}>
              <Text style={styles.resultEmoji}>{p.label.charAt(0).toUpperCase()}</Text>
              <Text style={styles.resultLabel}>{p.label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.insightText}>These are your orientation resources. When stress pulls you into your head, any one of these can bring you back to the present moment through pleasure.</Text>
        <Text style={styles.body}>Try accessing one item from your palette today — not as homework, but as medicine.</Text>
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
  primaryBtn: { backgroundColor: '#DAA520', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill, alignSelf: 'center', marginTop: Spacing.sm },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  disabledBtn: { opacity: 0.4 },
  progressText: { fontSize: FontSizes.caption, color: Colors.textSecondary, textAlign: 'center', fontWeight: '600', marginBottom: Spacing.sm },
  palettePreview: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  paletteSlot: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: Colors.borderLight, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDF5' },
  paletteSlotFilled: { borderStyle: 'solid', borderColor: '#DAA520', backgroundColor: '#FFF3D4' },
  paletteSlotText: { fontSize: 20 },
  categorySection: { marginBottom: Spacing.md },
  categoryLabel: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.xs, textTransform: 'uppercase', letterSpacing: 1 },
  itemGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  itemChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FFFDF5', gap: Spacing.xs },
  itemChipSelected: { borderColor: '#DAA520', backgroundColor: '#FFF3D4' },
  itemChipDisabled: { opacity: 0.35 },
  itemEmoji: { fontSize: 14, fontWeight: '700', color: '#DAA520' },
  itemLabel: { fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '500' },
  itemLabelSelected: { color: '#B8860B', fontWeight: '600' },
  addCustomBtn: { alignSelf: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: Colors.border, marginBottom: Spacing.md },
  addCustomText: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
  customRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md, alignItems: 'center' },
  customInput: { flex: 1, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.sm, fontSize: FontSizes.body, color: Colors.text, backgroundColor: '#FFFCF7' },
  customAddBtn: { backgroundColor: '#DAA520', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.pill },
  hint: { fontSize: FontSizes.caption, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center' },
  reflectionInput: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 80, backgroundColor: '#FFFCF7', textAlignVertical: 'top' },
  resultGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'center' },
  resultItem: { alignItems: 'center', gap: 4, width: 80 },
  resultEmoji: { fontSize: 24, fontWeight: '700', color: '#DAA520' },
  resultLabel: { fontSize: FontSizes.caption, color: Colors.text, textAlign: 'center', fontWeight: '500' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
