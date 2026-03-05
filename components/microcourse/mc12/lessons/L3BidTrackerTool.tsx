/**
 * L3BidTrackerTool — MC12 Lesson 3: "Today's Bid Log"
 * Users log bids they noticed today, categorize their responses,
 * and see their turning-toward ratio.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { SearchIcon, ClipboardIcon, ChartBarIcon } from '@/assets/graphics/icons';
import { MC12_PALETTE } from '@/constants/mc12Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface BidEntry { bid: string; response: 'toward' | 'away' | 'against'; }

const RESPONSE_COLORS = { toward: '#5A9E6F', away: '#E8A84A', against: '#E05555' };
const RESPONSE_LABELS = { toward: 'Turned Toward', away: 'Turned Away', against: 'Turned Against' };
const RESPONSE_DOT_COLORS = { toward: '#4CAF50', away: '#FFC107', against: '#F44336' };

const EXAMPLE_BIDS = [
  'They asked about my day',
  'They showed me something on their phone',
  'They sighed heavily',
  'They reached for my hand',
  'They mentioned a plan for the weekend',
  'They made a joke',
];

type Phase = 'intro' | 'log' | 'results';

export default function L3BidTrackerTool({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [entries, setEntries] = useState<BidEntry[]>([]);
  const [currentBid, setCurrentBid] = useState('');
  const [currentResponse, setCurrentResponse] = useState<'toward' | 'away' | 'against' | null>(null);

  const addEntry = useCallback(() => {
    if (!currentBid.trim() || !currentResponse) return;
    haptics.tap();
    setEntries(prev => [...prev, { bid: currentBid.trim(), response: currentResponse }]);
    setCurrentBid('');
    setCurrentResponse(null);
  }, [haptics, currentBid, currentResponse]);

  const selectExample = useCallback((text: string) => {
    haptics.tap();
    setCurrentBid(text);
  }, [haptics]);

  const handleFinish = useCallback(() => {
    haptics.tap();
    const towardCount = entries.filter(e => e.response === 'toward').length;
    const ratio = entries.length > 0 ? Math.round((towardCount / entries.length) * 100) : 0;
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Bids logged', response: JSON.stringify(entries), type: 'interactive' as const },
      { step: 2, prompt: 'Turning-toward ratio', response: `${ratio}% (${towardCount}/${entries.length})`, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, entries, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><SearchIcon size={28} color="#FF6B6B" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><ClipboardIcon size={20} color={MC12_PALETTE.coral} /><Text style={styles.title}>Today's Bid Log</Text></View>
          <Text style={styles.subtitle}>Tracking Your Connection Moments</Text>
          <Text style={styles.body}>Now it's time to look at your real life. Think about the last 24 hours with your partner. What bids happened between you?</Text>
          <Text style={styles.body}>Log as many as you can remember — even small ones. Then categorize how you responded to each.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('log'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>Start Logging →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'log') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Bids Logged: {entries.length}</Text>

        {entries.map((entry, i) => (
          <View key={i} style={styles.entryRow}>
            <View style={{width:12,height:12,borderRadius:6,backgroundColor:RESPONSE_DOT_COLORS[entry.response]}} />
            <View style={styles.entryContent}>
              <Text style={styles.entryBid}>{entry.bid}</Text>
              <Text style={[styles.entryResponse, { color: RESPONSE_COLORS[entry.response] }]}>{RESPONSE_LABELS[entry.response]}</Text>
            </View>
          </View>
        ))}

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>What bid happened?</Text>
          <TextInput
            style={styles.bidInput}
            placeholder="Describe the bid..."
            placeholderTextColor={Colors.textMuted}
            value={currentBid}
            onChangeText={setCurrentBid}
          />
          {!currentBid && (
            <View style={styles.exampleSection}>
              <Text style={styles.exampleLabel}>Or pick an example:</Text>
              <View style={styles.exampleGrid}>
                {EXAMPLE_BIDS.map(ex => (
                  <TouchableOpacity key={ex} style={styles.exampleChip} onPress={() => selectExample(ex)} activeOpacity={0.7}>
                    <Text style={styles.exampleText}>{ex}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {currentBid.trim() !== '' && (
            <>
              <Text style={styles.inputLabel}>How did you respond?</Text>
              <View style={styles.responseRow}>
                {(['toward', 'away', 'against'] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.responseChip, currentResponse === type && { borderColor: RESPONSE_COLORS[type], backgroundColor: RESPONSE_COLORS[type] + '15' }]}
                    onPress={() => { haptics.tap(); setCurrentResponse(type); }}
                    activeOpacity={0.7}
                  >
                    <View style={{width:12,height:12,borderRadius:6,backgroundColor:RESPONSE_DOT_COLORS[type]}} />
                    <Text style={[styles.responseLabel, currentResponse === type && { color: RESPONSE_COLORS[type], fontWeight: '700' }]}>{RESPONSE_LABELS[type]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.addBtn, (!currentBid.trim() || !currentResponse) && styles.disabledBtn]}
            onPress={addEntry}
            disabled={!currentBid.trim() || !currentResponse}
            activeOpacity={0.7}
          >
            <Text style={styles.addBtnText}>+ Add Entry</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, entries.length < 2 && styles.disabledBtn]}
          onPress={() => { haptics.tap(); setPhase('results'); }}
          disabled={entries.length < 2}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryBtnText}>See My Ratio →</Text>
        </TouchableOpacity>
        {entries.length < 2 && <Text style={styles.hint}>Log at least 2 bids</Text>}
      </ScrollView>
    );
  }

  // results
  const towardCount = entries.filter(e => e.response === 'toward').length;
  const awayCount = entries.filter(e => e.response === 'away').length;
  const againstCount = entries.filter(e => e.response === 'against').length;
  const ratio = entries.length > 0 ? Math.round((towardCount / entries.length) * 100) : 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}><ChartBarIcon size={20} color={MC12_PALETTE.coral} /><Text style={styles.title}>Your Bid Response Ratio</Text></View>
        <View style={styles.ratioCircle}>
          <Text style={styles.ratioNumber}>{ratio}%</Text>
          <Text style={styles.ratioLabel}>Turning Toward</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={[styles.statNum, { color: '#5A9E6F' }]}>{towardCount}</Text><Text style={styles.statLabel}>Toward</Text></View>
          <View style={styles.statBox}><Text style={[styles.statNum, { color: '#E8A84A' }]}>{awayCount}</Text><Text style={styles.statLabel}>Away</Text></View>
          <View style={styles.statBox}><Text style={[styles.statNum, { color: '#E05555' }]}>{againstCount}</Text><Text style={styles.statLabel}>Against</Text></View>
        </View>
        {ratio >= 80 ? (
          <Text style={styles.insightText}>You're in the "masters" zone! Keep it up — this ratio is what keeps relationships thriving.</Text>
        ) : ratio >= 50 ? (
          <Text style={styles.insightText}>Good awareness! Even a small increase in turning-toward moments can shift your entire relationship dynamic.</Text>
        ) : (
          <Text style={styles.insightText}>Awareness is the first step. Just by noticing these patterns, you've already started changing them.</Text>
        )}
        <Text style={styles.body}>Gottman's research: happy couples turn toward 86% of the time. Every percentage point counts.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish} activeOpacity={0.7}>
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 }, scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.scrollPadBottom },
  card: { backgroundColor: '#FFF5F5', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#F0D4D4', ...Shadows.subtle, gap: Spacing.md, alignItems: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF6B6B20', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: FontSizes.headingS, fontWeight: '700', fontFamily: FontFamilies.heading, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, fontStyle: 'italic' },
  body: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  primaryBtn: { backgroundColor: '#FF6B6B', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill, alignSelf: 'center', marginTop: Spacing.sm },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.body },
  disabledBtn: { opacity: 0.4 },
  sectionTitle: { fontSize: FontSizes.body, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  entryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm, backgroundColor: '#FFFCF5', borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.borderLight, marginBottom: Spacing.xs },
  entryEmoji: { fontSize: 18 },
  entryContent: { flex: 1, gap: 2 },
  entryBid: { fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '500' },
  entryResponse: { fontSize: FontSizes.caption, fontWeight: '600' },
  inputCard: { backgroundColor: '#FFF8F2', borderRadius: BorderRadius.lg, padding: Spacing.md, gap: Spacing.sm, marginVertical: Spacing.md, borderWidth: 1, borderColor: '#F0E0E0' },
  inputLabel: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: Colors.text },
  bidInput: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.sm, fontSize: FontSizes.body, color: Colors.text, backgroundColor: '#FFFDF5' },
  exampleSection: { gap: Spacing.xs },
  exampleLabel: { fontSize: FontSizes.caption, color: Colors.textMuted },
  exampleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  exampleChip: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.pill, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#FFFDF5' },
  exampleText: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  responseRow: { gap: Spacing.xs },
  responseChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border },
  responseEmoji: { fontSize: 16 },
  responseLabel: { fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontWeight: '500' },
  addBtn: { backgroundColor: '#4ECDC4', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.pill, alignSelf: 'center' },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSizes.bodySmall },
  hint: { fontSize: FontSizes.caption, color: Colors.textMuted, fontStyle: 'italic', textAlign: 'center' },
  ratioCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FF6B6B15', borderWidth: 3, borderColor: '#FF6B6B', alignItems: 'center', justifyContent: 'center', gap: 2 },
  ratioNumber: { fontSize: 32, fontWeight: '700', color: '#FF6B6B' },
  ratioLabel: { fontSize: FontSizes.caption, color: Colors.textSecondary, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: Spacing.lg },
  statBox: { alignItems: 'center', gap: 2 },
  statNum: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
