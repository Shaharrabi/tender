/**
 * TryThisTodayCTA — Single clear action card for each portrait tab.
 *
 * Routes verified against existing app/(app)/ paths:
 *   /(app)/step-detail, /(app)/exercise, /(app)/chat, /(app)/growth
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface TryThisTodayCTAProps {
  icon: string;
  label: string;
  sublabel: string;
  accentColor?: string;
  onPress: () => void;
}

export default function TryThisTodayCTA({ icon, label, sublabel, accentColor = Colors.calm, onPress }: TryThisTodayCTAProps) {
  return (
    <TouchableOpacity style={[styles.card, { borderColor: accentColor + '30', backgroundColor: accentColor + '08' }]} onPress={onPress} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={label}>
      <View style={[styles.iconBox, { backgroundColor: accentColor }]}>
        <TenderText variant="headingS" color={Colors.white} style={{ fontSize: 18 }}>{icon}</TenderText>
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
export const PORTRAIT_TAB_ACTIONS: Record<string, { icon: string; label: string; sublabel: string; route: string; params?: Record<string, string> }> = {
  overview: { icon: '\uD83C\uDF3F', label: 'Start Step 1', sublabel: 'Begin your relational journey', route: '/(app)/step-detail', params: { step: '1' } },
  scores:   { icon: '\uD83E\uDDD8', label: 'Window of Tolerance Check', sublabel: '5 min \u00B7 Your #1 leverage point', route: '/(app)/exercise', params: { id: 'window-check' } },
  lenses:   { icon: '\uD83E\uDE9E', label: 'Parts Check-In', sublabel: '8 min \u00B7 Meet your protector parts', route: '/(app)/exercise', params: { id: 'parts-check-in' } },
  cycle:    { icon: '\uD83C\uDF00', label: 'Recognize Your Cycle', sublabel: '15 min \u00B7 Map the dance between you', route: '/(app)/exercise', params: { id: 'recognize-cycle' } },
  growth:   { icon: '\uD83C\uDF31', label: 'Begin Your Growth Edge', sublabel: 'Personalized to your top edge', route: '/(app)/growth' },
  anchors:  { icon: '\uD83D\uDCAC', label: 'Talk to Nuance AI', sublabel: 'Explore your portrait with your AI guide', route: '/(app)/chat' },
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 1.5, padding: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.md },
  iconBox: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 2 },
  eyebrow: { fontSize: 10, letterSpacing: 1.5 },
});
