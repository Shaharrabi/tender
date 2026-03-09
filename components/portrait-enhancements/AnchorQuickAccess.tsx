/**
 * AnchorQuickAccess — State-based anchor navigation.
 *
 * Uses app SVG icons instead of emojis for visual consistency.
 * 4-tab selector: Activated | Shutdown | Repair | Self-Care
 *
 * Each tab shows ONLY the relevant anchors for that emotional state.
 * User taps the state they're in → gets exactly what they need.
 *
 * All existing anchor content preserved — just organized by moment.
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { AnchorPoints } from '@/types/portrait';
import type { IconProps } from '@/assets/graphics/icons/types';
import {
  FireIcon,
  SnowflakeIcon,
  HeartPulseIcon,
  GreenHeartIcon,
  LightbulbIcon,
  CheckmarkIcon,
  CloseIcon,
  SeedlingIcon,
  ChatBubbleIcon,
  RefreshIcon,
} from '@/assets/graphics/icons';

type AnchorMode = 'activated' | 'shutdown' | 'repair' | 'compassion';

const MODES: Array<{ id: AnchorMode; Icon: React.ComponentType<IconProps>; label: string; color: string }> = [
  { id: 'activated',  Icon: FireIcon,       label: 'Activated', color: Colors.error },
  { id: 'shutdown',   Icon: SnowflakeIcon,  label: 'Shutdown',  color: Colors.depth },
  { id: 'repair',     Icon: HeartPulseIcon,  label: 'Repair',    color: Colors.accent },
  { id: 'compassion', Icon: GreenHeartIcon,  label: 'Self-Care', color: Colors.success },
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
        <AnchorList Icon={LightbulbIcon} label="REMEMBER" color={Colors.textMuted} items={a.whatToRemember} />
        <AnchorList Icon={CheckmarkIcon} label="DO" color={Colors.success} items={a.whatToDo} />
        <AnchorList Icon={CloseIcon} label="DON\u2019T" color={Colors.error} items={a.whatNotToDo} />
      </View>
    );
  };

  const renderShutdown = () => {
    const a = anchorPoints.whenShutdown;
    if (typeof a === 'string') return <TenderText variant="body" color={Colors.textSecondary} style={s.text}>{a}</TenderText>;
    return (
      <View style={s.content}>
        <TenderText variant="serifItalic" color={Colors.text} style={s.primary}>{'\u201C'}{a.primary}{'\u201D'}</TenderText>
        <AnchorList Icon={LightbulbIcon} label="REMEMBER" color={Colors.textMuted} items={a.whatToRemember} />
        <AnchorList Icon={CheckmarkIcon} label="DO" color={Colors.success} items={a.whatToDo} />
        <AnchorList Icon={CloseIcon} label="DON\u2019T" color={Colors.error} items={a.whatNotToDo} />
      </View>
    );
  };

  const renderRepair = () => {
    const r = anchorPoints.repair;
    if (typeof r === 'string') return <TenderText variant="body" color={Colors.textSecondary} style={s.text}>{r}</TenderText>;
    return (
      <View style={s.content}>
        <AnchorList Icon={SeedlingIcon} label="SIGNS YOU\u2019RE READY" color={Colors.success} items={(r as any).signsYoureReady ?? []} />
        <View style={s.listSection}>
          <View style={s.labelRow}>
            <ChatBubbleIcon size={11} color={Colors.textMuted} />
            <TenderText variant="label" color={Colors.textMuted} style={s.listLabel}>TRY SAYING</TenderText>
          </View>
          {((r as any).repairStarters ?? []).map((phrase: string, i: number) => (
            <TenderText key={i} variant="serifItalic" color={Colors.text} style={s.repairPhrase}>
              {'\u201C'}{phrase}{'\u201D'}
            </TenderText>
          ))}
        </View>
        {/* Pattern interrupts */}
        {Array.isArray(anchorPoints.patternInterrupt) && (
          <View style={s.listSection}>
            <View style={s.labelRow}>
              <RefreshIcon size={11} color={Colors.textMuted} />
              <TenderText variant="label" color={Colors.textMuted} style={s.listLabel}>PATTERN INTERRUPTS</TenderText>
            </View>
            {anchorPoints.patternInterrupt.map((phrase: string, i: number) => (
              <TenderText key={`pi${i}`} variant="serifItalic" color={Colors.text} style={s.repairPhrase}>
                {'\u201C'}{phrase}{'\u201D'}
              </TenderText>
            ))}
          </View>
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
        Tap the state you{'\u2019'}re in right now. These phrases are personalized to your pattern.
      </TenderText>

      {/* State selector pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pillRow}>
        {MODES.map((m) => {
          const isActive = mode === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[s.pill, isActive && { backgroundColor: m.color + '15', borderColor: m.color }]}
              onPress={() => setMode(m.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <View style={s.pillInner}>
                <m.Icon size={13} color={isActive ? m.color : Colors.textMuted} />
                <TenderText variant="caption" color={isActive ? m.color : Colors.textMuted} style={isActive ? { fontWeight: '600' } : undefined}>
                  {m.label}
                </TenderText>
              </View>
            </TouchableOpacity>
          );
        })}
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

function AnchorList({ Icon, label, color, items }: { Icon: React.ComponentType<IconProps>; label: string; color: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <View style={s.listSection}>
      <View style={s.labelRow}>
        <Icon size={11} color={color} />
        <TenderText variant="label" color={color} style={s.listLabel}>{label}</TenderText>
      </View>
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
  pillInner: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  stateCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    borderLeftWidth: 4, padding: Spacing.lg, ...Shadows.card,
  },
  content: { gap: Spacing.md },
  text: { lineHeight: 26 },
  primary: { fontSize: 16, lineHeight: 26, marginBottom: Spacing.xs },
  listSection: { gap: Spacing.xs },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  listLabel: { fontSize: 10, letterSpacing: 1.5 },
  listItem: { lineHeight: 22, paddingLeft: Spacing.xs },
  repairPhrase: { fontSize: 15, lineHeight: 24, marginBottom: Spacing.xs },
  reminderItem: { lineHeight: 24 },
  personalizedCard: {
    backgroundColor: Colors.backgroundAlt, borderRadius: BorderRadius.sm,
    padding: Spacing.md, borderLeftWidth: 3, borderLeftColor: Colors.primary, marginTop: Spacing.sm,
  },
  personalizedText: { lineHeight: 26 },
});
