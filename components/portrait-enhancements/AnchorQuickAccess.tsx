/**
 * AnchorQuickAccess — State-based anchor navigation.
 *
 * Instead of showing all anchor categories in one long scroll,
 * this adds a 3-tab selector at the top: 🔥 Activated | ❄️ Shutdown | 🩹 Repair
 *
 * Each tab shows ONLY the relevant anchors for that emotional state.
 * User taps the state they're in → gets exactly what they need.
 *
 * All existing anchor content preserved — just organized by moment.
 *
 * Verified: AnchorPoints type from @/types/portrait
 *   AnchorCategory = { primary, whatToRemember[], whatToDo[], whatNotToDo[] }
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { AnchorPoints } from '@/types/portrait';

type AnchorMode = 'activated' | 'shutdown' | 'repair' | 'compassion';

const MODES: Array<{ id: AnchorMode; icon: string; label: string; color: string }> = [
  { id: 'activated', icon: '\uD83D\uDD25', label: 'Activated', color: Colors.error },
  { id: 'shutdown', icon: '\u2744\uFE0F', label: 'Shutdown', color: Colors.depth },
  { id: 'repair', icon: '\uD83E\uDE79', label: 'Repair', color: Colors.accent },
  { id: 'compassion', icon: '\uD83D\uDC9A', label: 'Self-Care', color: Colors.success },
];

interface AnchorQuickAccessProps {
  anchorPoints: AnchorPoints;
}

export default function AnchorQuickAccess({ anchorPoints }: AnchorQuickAccessProps) {
  const [mode, setMode] = useState<AnchorMode>('activated');
  const currentMode = MODES.find((m) => m.id === mode)!;

  const renderActivated = () => {
    const a = anchorPoints.whenActivated;
    if (typeof a === 'string') return <TenderText variant="body" color={Colors.textSecondary} style={s.text}>{a}</TenderText>;
    return (
      <View style={s.content}>
        <TenderText variant="serifItalic" color={Colors.text} style={s.primary}>{'\u201C'}{a.primary}{'\u201D'}</TenderText>
        <AnchorList label="\uD83D\uDCA1 REMEMBER" items={a.whatToRemember} />
        <AnchorList label="\u2705 DO" items={a.whatToDo} />
        <AnchorList label="\u274C DON\u2019T" items={a.whatNotToDo} />
      </View>
    );
  };

  const renderShutdown = () => {
    const a = anchorPoints.whenShutdown;
    if (typeof a === 'string') return <TenderText variant="body" color={Colors.textSecondary} style={s.text}>{a}</TenderText>;
    return (
      <View style={s.content}>
        <TenderText variant="serifItalic" color={Colors.text} style={s.primary}>{'\u201C'}{a.primary}{'\u201D'}</TenderText>
        <AnchorList label="\uD83D\uDCA1 REMEMBER" items={a.whatToRemember} />
        <AnchorList label="\u2705 DO" items={a.whatToDo} />
        <AnchorList label="\u274C DON\u2019T" items={a.whatNotToDo} />
      </View>
    );
  };

  const renderRepair = () => {
    const r = anchorPoints.repair;
    if (typeof r === 'string') return <TenderText variant="body" color={Colors.textSecondary} style={s.text}>{r}</TenderText>;
    return (
      <View style={s.content}>
        <AnchorList label="\uD83D\uDFE2 SIGNS YOU\u2019RE READY" items={(r as any).signsYoureReady ?? []} />
        <TenderText variant="label" color={Colors.textMuted} style={s.listLabel}>{'\uD83D\uDCAC'} TRY SAYING</TenderText>
        {((r as any).repairStarters ?? []).map((phrase: string, i: number) => (
          <TenderText key={i} variant="serifItalic" color={Colors.text} style={s.repairPhrase}>
            {'\u201C'}{phrase}{'\u201D'}
          </TenderText>
        ))}
        {/* Pattern interrupts */}
        {Array.isArray(anchorPoints.patternInterrupt) && (
          <>
            <TenderText variant="label" color={Colors.textMuted} style={[s.listLabel, { marginTop: Spacing.md }]}>{'\u23F8\uFE0F'} PATTERN INTERRUPTS</TenderText>
            {anchorPoints.patternInterrupt.map((phrase: string, i: number) => (
              <TenderText key={`pi${i}`} variant="serifItalic" color={Colors.text} style={s.repairPhrase}>
                {'\u201C'}{phrase}{'\u201D'}
              </TenderText>
            ))}
          </>
        )}
      </View>
    );
  };

  const renderCompassion = () => {
    const sc = anchorPoints.selfCompassion;
    if (typeof sc === 'string') return <TenderText variant="body" color={Colors.textSecondary} style={s.text}>{sc}</TenderText>;
    return (
      <View style={s.content}>
        {((sc as any).reminders ?? []).map((item: string, i: number) => (
          <TenderText key={i} variant="body" color={Colors.textSecondary} style={s.reminderItem}>
            {'\u2022'} {item}
          </TenderText>
        ))}
        {(sc as any).personalizedMessage && (
          <View style={s.personalizedCard}>
            <TenderText variant="body" color={Colors.text} style={s.personalizedText}>
              {(sc as any).personalizedMessage}
            </TenderText>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={s.container}>
      <TenderText variant="body" color={Colors.textSecondary} style={s.intro}>
        Tap the state you\u2019re in right now. These phrases are personalized to your pattern.
      </TenderText>

      {/* State selector pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pillRow}>
        {MODES.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[s.pill, mode === m.id && { backgroundColor: m.color + '15', borderColor: m.color }]}
            onPress={() => setMode(m.id)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: mode === m.id }}
          >
            <TenderText variant="caption" color={mode === m.id ? m.color : Colors.textMuted} style={mode === m.id ? { fontWeight: '600' } : undefined}>
              {m.icon} {m.label}
            </TenderText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content for selected state */}
      <View style={[s.stateCard, { borderLeftColor: currentMode.color }]}>
        {mode === 'activated' && renderActivated()}
        {mode === 'shutdown' && renderShutdown()}
        {mode === 'repair' && renderRepair()}
        {mode === 'compassion' && renderCompassion()}
      </View>
    </View>
  );
}

// ─── Helper: Anchor List ────────────────────────────────

function AnchorList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <View style={s.listSection}>
      <TenderText variant="label" color={Colors.textMuted} style={s.listLabel}>{label}</TenderText>
      {items.map((item, i) => (
        <TenderText key={i} variant="bodySmall" color={Colors.textSecondary} style={s.listItem}>
          {'\u2022'} {item}
        </TenderText>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { gap: Spacing.md },
  intro: { lineHeight: 24, marginBottom: Spacing.xs },
  pillRow: { gap: Spacing.xs, paddingVertical: Spacing.xs },
  pill: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: 'transparent',
  },
  stateCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    borderLeftWidth: 4, padding: Spacing.lg, ...Shadows.card,
  },
  content: { gap: Spacing.md },
  text: { lineHeight: 26 },
  primary: { fontSize: 16, lineHeight: 26, marginBottom: Spacing.xs },
  listSection: { gap: Spacing.xs },
  listLabel: { fontSize: 10, letterSpacing: 1.5, marginBottom: 2 },
  listItem: { lineHeight: 22, paddingLeft: Spacing.xs },
  repairPhrase: { fontSize: 15, lineHeight: 24, marginBottom: Spacing.xs },
  reminderItem: { lineHeight: 24 },
  personalizedCard: {
    backgroundColor: Colors.backgroundAlt, borderRadius: BorderRadius.sm,
    padding: Spacing.md, borderLeftWidth: 3, borderLeftColor: Colors.primary, marginTop: Spacing.sm,
  },
  personalizedText: { lineHeight: 26 },
});
