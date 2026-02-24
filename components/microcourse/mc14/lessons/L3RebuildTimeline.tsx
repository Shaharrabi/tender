/**
 * L3RebuildTimeline — MC14 Lesson 3: "The Rebuild Timeline"
 * Users learn the phases of trust rebuilding and identify
 * where they are in the process.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { CalendarIcon, WaveIcon, SearchIcon, ScaleIcon, SeedlingIcon, CompassIcon, TargetIcon } from '@/assets/graphics/icons';
import { MC14_PALETTE } from '@/constants/mc14Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const REBUILD_PHASES = [
  { id: 'crisis', label: 'Crisis', duration: 'Days to weeks', description: 'Raw emotion, shock, disbelief. The nervous system is in survival mode. Safety and stabilization are the only goals.', color: '#C44A4A' },
  { id: 'understanding', label: 'Understanding', duration: 'Weeks to months', description: 'Making sense of what happened. Asking questions. Processing the story from different angles.', color: '#C4A35A' },
  { id: 'atonement', label: 'Atonement', duration: 'Months', description: 'The betraying partner demonstrates genuine accountability through sustained behavioral change. Not words — actions.', color: '#4A6B8A' },
  { id: 'reconnection', label: 'Reconnection', duration: 'Months to a year', description: 'Cautiously rebuilding emotional and physical intimacy. Testing the new patterns. Allowing vulnerability in small doses.', color: '#5A9E6F' },
  { id: 'integration', label: 'Integration', duration: 'Ongoing', description: 'The wound becomes part of your story but not the whole story. Not "getting over it" — integrating it into who you are now.', color: '#8A8A8A' },
];

const PHASE_ICONS: Record<string, (size: number) => React.ReactNode> = {
  crisis: (size) => <WaveIcon size={size} color={MC14_PALETTE.woundRed} />,
  understanding: (size) => <SearchIcon size={size} color={MC14_PALETTE.mutedGold} />,
  atonement: (size) => <ScaleIcon size={size} color={MC14_PALETTE.slate} />,
  reconnection: (size) => <SeedlingIcon size={size} color={MC14_PALETTE.repairGreen} />,
  integration: (size) => <CompassIcon size={size} color={MC14_PALETTE.warmGray} />,
};

type Phase = 'intro' | 'timeline' | 'locate' | 'needs' | 'results';

export default function L3RebuildTimeline({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState('');
  const [needsText, setNeedsText] = useState('');

  const handleFinish = useCallback(() => {
    haptics.tap();
    const steps: StepResponseEntry[] = [
      { step: 1, prompt: 'Current rebuild phase', response: selectedPhase, type: 'interactive' as const },
      { step: 2, prompt: 'What I need in this phase', response: needsText, type: 'interactive' as const },
    ];
    onComplete(steps);
  }, [haptics, selectedPhase, needsText, onComplete]);

  if (phase === 'intro') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconCircle}><CalendarIcon size={28} color="#4A6B8A" /></View>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><CalendarIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>The Rebuild Timeline</Text></View>
          <Text style={styles.subtitle}>Where Are You in the Process?</Text>
          <Text style={styles.body}>Trust rebuilding isn't linear, but it does follow a general pattern. Understanding where you are helps set realistic expectations.</Text>
          <Text style={styles.body}>You'll learn the 5 phases, then identify where you currently are.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => { haptics.tap(); setPhase('timeline'); }} activeOpacity={0.7}>
            <Text style={styles.primaryBtnText}>See the Phases →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'timeline') {
    const p = REBUILD_PHASES[currentPhaseIdx];
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.timelineNav}>
          {REBUILD_PHASES.map((rp, i) => (
            <View key={rp.id} style={[styles.timelineDot, i === currentPhaseIdx && { backgroundColor: rp.color }, i < currentPhaseIdx && styles.timelineDotPast]} />
          ))}
        </View>
        <View style={[styles.phaseCard, { borderLeftColor: p.color }]}>
          <View style={styles.phaseIconWrap}>{PHASE_ICONS[p.id](32)}</View>
          <Text style={[styles.phaseTitle, { color: p.color }]}>{p.label}</Text>
          <Text style={styles.phaseDuration}>Typical duration: {p.duration}</Text>
          <Text style={styles.phaseDesc}>{p.description}</Text>
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            haptics.tap();
            if (currentPhaseIdx < REBUILD_PHASES.length - 1) setCurrentPhaseIdx(i => i + 1);
            else setPhase('locate');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryBtnText}>{currentPhaseIdx < REBUILD_PHASES.length - 1 ? 'Next Phase →' : 'Find My Phase →'}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (phase === 'locate') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><TargetIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>Where Are You?</Text></View>
          <Text style={styles.body}>Which phase best describes where you are right now? (There's no wrong answer — and you may be between phases.)</Text>
          <View style={styles.phaseList}>
            {REBUILD_PHASES.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[styles.phaseOption, selectedPhase === p.label && { borderColor: p.color, backgroundColor: p.color + '15' }]}
                onPress={() => { haptics.tap(); setSelectedPhase(p.label); }}
                activeOpacity={0.7}
              >
                <View>{PHASE_ICONS[p.id](20)}</View>
                <View style={styles.phaseOptionContent}>
                  <Text style={[styles.phaseOptionLabel, selectedPhase === p.label && { color: p.color, fontWeight: '700' }]}>{p.label}</Text>
                  <Text style={styles.phaseOptionDuration}>{p.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.primaryBtn, !selectedPhase && styles.disabledBtn]}
            onPress={() => { haptics.tap(); setPhase('needs'); }}
            disabled={!selectedPhase}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (phase === 'needs') {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}><TargetIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>What Do You Need?</Text></View>
          <Text style={styles.body}>In the <Text style={{ fontWeight: '700', color: '#4A6B8A' }}>{selectedPhase}</Text> phase, what do you most need right now — from yourself or from your partner?</Text>
          <TextInput
            style={styles.needsInput}
            placeholder="Right now I need..."
            placeholderTextColor={Colors.textMuted}
            value={needsText}
            onChangeText={setNeedsText}
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
        <View style={{flexDirection:'row',alignItems:'center',gap:8}}><CalendarIcon size={20} color={MC14_PALETTE.slate} /><Text style={styles.title}>Your Rebuild Map</Text></View>
        <View style={styles.resultPhaseBox}>
          <Text style={styles.resultPhaseLabel}>Current Phase</Text>
          <View style={{flexDirection:'row',alignItems:'center',gap:8}}>
            {(() => { const found = REBUILD_PHASES.find(p => p.label === selectedPhase); return found ? PHASE_ICONS[found.id](20) : null; })()}
            <Text style={styles.resultPhaseText}>{selectedPhase}</Text>
          </View>
        </View>
        <Text style={styles.insightText}>Knowing where you are means you can stop expecting yourself to be somewhere else. Healing has its own timeline — and you're exactly where you need to be.</Text>
        <Text style={styles.body}>The remaining lessons will give you specific tools for the repair and rebuilding work ahead.</Text>
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
  disabledBtn: { opacity: 0.4 },
  timelineNav: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  timelineDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, backgroundColor: 'transparent' },
  timelineDotPast: { backgroundColor: '#5A9E6F', borderColor: '#5A9E6F' },
  phaseCard: { backgroundColor: '#FAFBFD', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: '#D0D8E0', borderLeftWidth: 4, gap: Spacing.sm, alignItems: 'center', marginBottom: Spacing.md },
  phaseIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  phaseTitle: { fontSize: FontSizes.headingS, fontWeight: '700' },
  phaseDuration: { fontSize: FontSizes.caption, color: Colors.textSecondary, fontWeight: '600' },
  phaseDesc: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },
  phaseList: { gap: Spacing.sm, width: '100%' },
  phaseOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: '#FAFBFD' },
  phaseOptionContent: { flex: 1, gap: 2 },
  phaseOptionLabel: { fontSize: FontSizes.body, color: Colors.text, fontWeight: '500' },
  phaseOptionDuration: { fontSize: FontSizes.caption, color: Colors.textSecondary },
  needsInput: { width: '100%', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSizes.body, color: Colors.text, minHeight: 100, backgroundColor: '#FFFCF7', textAlignVertical: 'top' },
  resultPhaseBox: { backgroundColor: '#C4D4E420', borderRadius: BorderRadius.md, padding: Spacing.md, width: '100%', alignItems: 'center', gap: 4 },
  resultPhaseLabel: { fontSize: FontSizes.caption, fontWeight: '600', color: Colors.textSecondary },
  resultPhaseText: { fontSize: FontSizes.headingS, fontWeight: '700', color: '#4A6B8A' },
  insightText: { fontSize: FontSizes.body, color: '#5A9E6F', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
});
