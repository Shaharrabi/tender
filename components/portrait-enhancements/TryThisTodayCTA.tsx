/**
 * TryThisTodayCTA — Single clear action card for each portrait tab.
 *
 * Uses app SVG icons instead of emojis.
 * Routes verified against existing app/(app)/ paths:
 *   /(app)/step-detail, /(app)/exercise, /(app)/chat, /(app)/growth
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import type { IconProps } from '@/assets/graphics/icons/types';
import {
  LeafIcon,
  MeditationIcon,
  MirrorIcon,
  SwirlyIcon,
  SeedlingIcon,
  ChatBubbleIcon,
} from '@/assets/graphics/icons';

interface TryThisTodayCTAProps {
  Icon: React.ComponentType<IconProps>;
  label: string;
  sublabel: string;
  accentColor?: string;
  onPress: () => void;
}

export default function TryThisTodayCTA({ Icon, label, sublabel, accentColor = Colors.calm, onPress }: TryThisTodayCTAProps) {
  return (
    <TouchableOpacity style={[styles.card, { borderColor: accentColor + '30', backgroundColor: accentColor + '08' }]} onPress={onPress} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={label}>
      <View style={[styles.iconBox, { backgroundColor: accentColor }]}>
        <Icon size={20} color={Colors.white} />
      </View>
      <View style={styles.content}>
        <TenderText variant="label" color={accentColor} style={styles.eyebrow}>TRY THIS TODAY</TenderText>
        <TenderText variant="bodyMedium" color={Colors.text}>{label}</TenderText>
        <TenderText variant="caption" color={Colors.textMuted}>{sublabel}</TenderText>
      </View>
    </TouchableOpacity>
  );
}

/** Pre-configured actions for each portrait tab. Routes match existing app paths. */
export const PORTRAIT_TAB_ACTIONS: Record<string, { Icon: React.ComponentType<IconProps>; label: string; sublabel: string; route: string; params?: Record<string, string> }> = {
  overview: { Icon: LeafIcon,       label: 'Start Step 1',              sublabel: 'Begin your relational journey',          route: '/(app)/step-detail', params: { step: '1' } },
  scores:   { Icon: MeditationIcon, label: 'Window of Tolerance Check', sublabel: '5 min \u00B7 Your #1 leverage point',   route: '/(app)/exercise', params: { id: 'window-check' } },
  lenses:   { Icon: MirrorIcon,     label: 'Parts Check-In',            sublabel: '8 min \u00B7 Meet your protector parts', route: '/(app)/exercise', params: { id: 'parts-check-in' } },
  stress:   { Icon: SwirlyIcon,     label: 'Recognize Your Cycle',      sublabel: '15 min \u00B7 Map the dance between you', route: '/(app)/exercise', params: { id: 'recognize-cycle' } },
  growth:   { Icon: SeedlingIcon,   label: 'Begin Your Growth Edge',    sublabel: 'Personalized to your top edge',          route: '/(app)/growth' },
  map:      { Icon: MirrorIcon,     label: 'Explore Your Map',          sublabel: 'See how all your patterns connect',       route: '/(app)/portrait', params: { tab: 'map' } },
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1.5, padding: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.md },
  iconBox: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 2 },
  eyebrow: { fontSize: 10, letterSpacing: 1.5 },
});
