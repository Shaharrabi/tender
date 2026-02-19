/**
 * L5: Values-Action Mapper — Connect what matters to what you DO
 *
 * Two-column ACT exercise: users tap a value, then tap an action to
 * form connection pairs. Ends with a specific commitment and a stamp
 * animation. Wes Anderson soft lavender palette throughout.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC5_PALETTE } from '@/constants/mc5Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const VALUES = [
  'Presence', 'Compassion', 'Growth', 'Honesty', 'Playfulness', 'Courage',
] as const;

const ACTIONS = [
  'Put my phone away during dinner',
  'Ask \u2018How are you really?\u2019 and listen',
  'Try something new together monthly',
  'Share one hard truth gently this week',
  'Create a silly inside joke',
  'Have the conversation I\u2019ve been avoiding',
] as const;

type Phase = 'intro' | 'mapping' | 'commitment';
interface ConnectionPair { value: string; action: string }

interface L5ValuesActionMapperProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L5ValuesActionMapper({ content, attachmentStyle, onComplete }: L5ValuesActionMapperProps) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [pairs, setPairs] = useState<ConnectionPair[]>([]);
  const [commitmentText, setCommitmentText] = useState('');
  const [stamped, setStamped] = useState(false);

  const introFade = useRef(new Animated.Value(1)).current;
  const mapFade = useRef(new Animated.Value(0)).current;
  const commitFade = useRef(new Animated.Value(0)).current;
  const stampScale = useRef(new Animated.Value(0)).current;

  const usedValues = pairs.map((p) => p.value);
  const usedActions = pairs.map((p) => p.action);

  // ─── Phase transitions ─────────────────────────

  const handleBegin = useCallback(() => {
    haptics.tap();
    Animated.timing(introFade, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setPhase('mapping');
      Animated.timing(mapFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    });
  }, [haptics, introFade, mapFade]);

  const handleReadyToCommit = useCallback(() => {
    haptics.tap();
    Animated.timing(mapFade, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setPhase('commitment');
      Animated.timing(commitFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    });
  }, [haptics, mapFade, commitFade]);

  // ─── Mapping logic ─────────────────────────────

  const handleValueTap = useCallback((value: string) => {
    if (usedValues.includes(value)) return;
    haptics.tap();
    setSelectedValue((prev) => (prev === value ? null : value));
  }, [haptics, usedValues]);

  const handleActionTap = useCallback((action: string) => {
    if (usedActions.includes(action) || !selectedValue) return;
    haptics.tap();
    setPairs((prev) => [...prev, { value: selectedValue, action }]);
    setSelectedValue(null);
  }, [haptics, usedActions, selectedValue]);

  // ─── Commitment logic ──────────────────────────

  const handleStamp = useCallback(() => {
    if (commitmentText.trim().length < 5) return;
    haptics.playConfetti();
    setStamped(true);
    Animated.spring(stampScale, {
      toValue: 1, friction: 5, tension: 80, useNativeDriver: true,
    }).start();
  }, [haptics, commitmentText, stampScale]);

  const handleComplete = useCallback(() => {
    haptics.tap();
    onComplete([
      {
        step: 1,
        prompt: 'Values-Action Mapper',
        response: JSON.stringify({ connections: pairs, connectionCount: pairs.length }),
        type: 'interactive',
      },
      { step: 2, prompt: 'Action Commitment', response: commitmentText, type: 'commitment' },
    ]);
  }, [haptics, pairs, commitmentText, onComplete]);

  // ─── Shared pair card renderer ─────────────────

  const renderPairCard = (pair: ConnectionPair, i: number, wide = false) => (
    <View key={i} style={[s.pairCard, wide && { width: '100%' as any }]}>
      <Text style={s.pairValue}>{pair.value}</Text>
      <Text style={s.pairArrow}>{'\u2192'}</Text>
      <Text style={s.pairAction}>{pair.action}</Text>
    </View>
  );

  // ─── Phase 0: Intro ────────────────────────────

  if (phase === 'intro') {
    return (
      <Animated.View style={[s.container, { opacity: introFade }]}>
        <View style={s.centered}>
          <Text style={s.title}>VALUES IN ACTION</Text>
          <Text style={s.description}>
            Values without action are just nice ideas. Let{'\u2019'}s connect what matters
            most to you with something concrete you can actually do.
          </Text>
          <Text style={s.descriptionSoft}>
            Tap a value, then tap the action it lives through.
          </Text>
          <TouchableOpacity style={s.primaryBtn} onPress={handleBegin} activeOpacity={0.7}>
            <Text style={s.primaryBtnText}>BEGIN</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ─── Phase 1: Mapping ──────────────────────────

  if (phase === 'mapping') {
    return (
      <Animated.View style={[s.container, { opacity: mapFade }]}>
        <ScrollView contentContainerStyle={s.mapContent} showsVerticalScrollIndicator={false}>
          <Text style={s.instruction}>Tap a value, then tap the action it connects to.</Text>
          <View style={s.columnsRow}>
            <View style={s.column}>
              <Text style={s.columnLabel}>VALUES</Text>
              {VALUES.map((v) => {
                const used = usedValues.includes(v);
                const sel = selectedValue === v;
                return (
                  <TouchableOpacity
                    key={v}
                    style={[s.valueChip, sel && s.valueChipSel, used && s.chipUsed]}
                    onPress={() => handleValueTap(v)}
                    activeOpacity={used ? 1 : 0.7}
                    disabled={used}
                  >
                    <Text style={[s.valueChipText, sel && s.selText, used && s.dimText]}>{v}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={s.column}>
              <Text style={s.columnLabel}>ACTIONS</Text>
              {ACTIONS.map((a) => {
                const used = usedActions.includes(a);
                const ready = selectedValue !== null && !used;
                return (
                  <TouchableOpacity
                    key={a}
                    style={[s.actionChip, ready && s.actionChipReady, used && s.chipUsed]}
                    onPress={() => handleActionTap(a)}
                    activeOpacity={used || !selectedValue ? 1 : 0.7}
                    disabled={used || !selectedValue}
                  >
                    <Text style={[s.actionChipText, used && s.dimText]} numberOfLines={2}>{a}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          {pairs.length > 0 && (
            <View style={s.pairsSection}>
              <Text style={s.columnLabel}>YOUR CONNECTIONS</Text>
              {pairs.map((p, i) => renderPairCard(p, i))}
            </View>
          )}
          {pairs.length >= 2 && (
            <TouchableOpacity style={s.goldBtn} onPress={handleReadyToCommit} activeOpacity={0.7}>
              <Text style={s.goldBtnText}>READY TO COMMIT?</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Phase 2: Commitment ───────────────────────

  return (
    <Animated.View style={[s.container, { opacity: commitFade }]}>
      <ScrollView contentContainerStyle={s.commitContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={s.commitTitle}>YOUR VALUE MAP</Text>
        {pairs.map((p, i) => renderPairCard(p, i, true))}
        <Text style={s.descriptionSoft}>When will you do the first one? Be specific.</Text>
        <View style={s.inputWrap}>
          <TextInput
            style={s.commitInput}
            multiline
            textAlignVertical="top"
            placeholder="This week, I will..."
            placeholderTextColor={Colors.textMuted}
            value={commitmentText}
            onChangeText={setCommitmentText}
          />
        </View>
        {commitmentText.trim().length >= 5 && !stamped && (
          <TouchableOpacity style={s.primaryBtn} onPress={handleStamp} activeOpacity={0.7}>
            <Text style={s.primaryBtnText}>SEAL IT</Text>
          </TouchableOpacity>
        )}
        {stamped && (
          <Animated.View style={[s.stampBadge, { transform: [{ scale: stampScale }] }]}>
            <Text style={s.stampBadgeText}>Committed</Text>
          </Animated.View>
        )}
        {stamped && (
          <TouchableOpacity style={s.darkBtn} onPress={handleComplete} activeOpacity={0.7}>
            <Text style={s.darkBtnText}>COMPLETE</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const PALE_GOLD = '#F5EDE0';
const ACTION_INK = '#6B5A3E';

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  title: {
    fontSize: FontSizes.headingL, fontFamily: FontFamilies.heading, fontWeight: '800',
    color: Colors.text, letterSpacing: 3, textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 24, marginTop: Spacing.lg, paddingHorizontal: Spacing.sm,
  },
  descriptionSoft: {
    fontSize: FontSizes.body, color: MC5_PALETTE.deepLavender, textAlign: 'center',
    lineHeight: 24, marginTop: Spacing.md, fontStyle: 'italic',
  },
  instruction: {
    fontSize: FontSizes.bodySmall, color: Colors.textMuted, textAlign: 'center',
    letterSpacing: 1, marginBottom: Spacing.lg,
  },

  // Buttons
  primaryBtn: {
    backgroundColor: MC5_PALETTE.deepLavender, paddingVertical: 16, paddingHorizontal: 44,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xl,
  },
  primaryBtnText: { color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2 },
  goldBtn: {
    backgroundColor: MC5_PALETTE.warmGold, paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: BorderRadius.pill, alignSelf: 'center', marginTop: Spacing.xl,
  },
  goldBtnText: { color: '#FFF', fontSize: FontSizes.bodySmall, fontWeight: '600', letterSpacing: 2 },
  darkBtn: {
    backgroundColor: Colors.text, paddingVertical: 16, paddingHorizontal: 44,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xl,
  },
  darkBtnText: { color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2 },

  // Mapping layout
  mapContent: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg, paddingBottom: Spacing.xxxl },
  columnsRow: { flexDirection: 'row', gap: Spacing.sm },
  column: { flex: 1 },
  columnLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 3, color: Colors.textMuted,
    textAlign: 'center', marginBottom: Spacing.sm,
  },

  // Value chips
  valueChip: {
    backgroundColor: MC5_PALETTE.softLilac, borderWidth: 1.5, borderColor: MC5_PALETTE.lavender,
    borderRadius: BorderRadius.md, paddingVertical: 10, paddingHorizontal: 8,
    alignItems: 'center', marginBottom: Spacing.xs,
  },
  valueChipSel: { backgroundColor: MC5_PALETTE.lavender, borderColor: MC5_PALETTE.deepLavender },
  valueChipText: { fontSize: FontSizes.bodySmall, fontWeight: '600', color: MC5_PALETTE.deepLavender },
  selText: { color: '#FFF' },

  // Action chips
  actionChip: {
    backgroundColor: PALE_GOLD, borderWidth: 1.5, borderColor: MC5_PALETTE.warmGold,
    borderRadius: BorderRadius.md, paddingVertical: 10, paddingHorizontal: 8,
    alignItems: 'center', marginBottom: Spacing.xs,
  },
  actionChipReady: { borderWidth: 2 },
  actionChipText: { fontSize: 12, fontWeight: '500', color: ACTION_INK, textAlign: 'center' },

  // Shared states
  chipUsed: { opacity: 0.4 },
  dimText: { opacity: 0.6 },

  // Pair cards
  pairsSection: { marginTop: Spacing.xl },
  pairCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: BorderRadius.md, paddingVertical: 12, paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs, ...Shadows.subtle,
  },
  pairValue: { fontSize: FontSizes.bodySmall, fontWeight: '700', color: MC5_PALETTE.deepLavender },
  pairArrow: { fontSize: FontSizes.body, color: Colors.textMuted, marginHorizontal: Spacing.xs },
  pairAction: { fontSize: FontSizes.bodySmall, color: ACTION_INK, flex: 1 },

  // Commitment
  commitContent: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  commitTitle: {
    fontSize: FontSizes.headingM, fontFamily: FontFamilies.heading, fontWeight: '800',
    color: Colors.text, letterSpacing: 2, marginBottom: Spacing.lg, textAlign: 'center',
  },
  inputWrap: {
    width: '100%', backgroundColor: '#FFFCF7', borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: MC5_PALETTE.softLilac, marginTop: Spacing.md,
    minHeight: 100, ...Shadows.subtle,
  },
  commitInput: {
    fontSize: FontSizes.body, fontFamily: FontFamilies.body, color: Colors.text,
    lineHeight: 26, padding: Spacing.lg, minHeight: 100,
  },
  stampBadge: {
    backgroundColor: MC5_PALETTE.deepLavender, paddingVertical: 10, paddingHorizontal: 28,
    borderRadius: BorderRadius.pill, marginTop: Spacing.lg,
  },
  stampBadgeText: { color: '#FFF', fontSize: FontSizes.body, fontWeight: '700', letterSpacing: 1 },
});
