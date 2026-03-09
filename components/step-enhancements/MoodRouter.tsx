/**
 * MoodRouter — "How are you right now?" emotional state check-in.
 *
 * Curious → full content    Overwhelmed → essentials    In conflict → repair tools
 *
 * Verified: Colors.surfaceElevated='#FFF8F2', Colors.border='#E0D3CE', Shadows.subtle
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SeedlingIcon, WaveIcon, FireIcon } from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons/types';

export type MoodChoice = 'curious' | 'overwhelmed' | 'conflict';

const OPTIONS: Array<{ id: MoodChoice; Icon: React.ComponentType<IconProps>; color: string; label: string; desc: string }> = [
  { id: 'curious', Icon: SeedlingIcon, color: Colors.success, label: 'Curious', desc: 'Show me everything' },
  { id: 'overwhelmed', Icon: WaveIcon, color: Colors.calm, label: 'Overwhelmed', desc: 'Just the essentials' },
  { id: 'conflict', Icon: FireIcon, color: Colors.error, label: 'In Conflict', desc: 'I need tools right now' },
];

interface MoodRouterProps {
  onSelect: (mood: MoodChoice) => void;
  phaseColor?: string;
}

export default function MoodRouter({ onSelect, phaseColor = Colors.primary }: MoodRouterProps) {
  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <TenderText variant="label" color={Colors.textMuted} align="center" style={styles.eyebrow}>
        BEFORE WE BEGIN
      </TenderText>
      <TenderText variant="headingM" color={Colors.text} align="center">
        How are you right now?
      </TenderText>
      <View style={styles.list}>
        {OPTIONS.map((o) => (
          <TouchableOpacity key={o.id} style={styles.option} onPress={() => onSelect(o.id)} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel={`${o.label}: ${o.desc}`}>
            <View style={[styles.iconCircle, { backgroundColor: o.color + '15' }]}>
              <o.Icon size={22} color={o.color} />
            </View>
            <View style={styles.optionText}>
              <TenderText variant="bodyMedium" color={Colors.text}>{o.label}</TenderText>
              <TenderText variant="caption" color={Colors.textMuted}>{o.desc}</TenderText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TenderText variant="caption" color={Colors.textMuted} align="center">
        You can always access the full step later
      </TenderText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, gap: Spacing.lg },
  eyebrow: { letterSpacing: 3, fontSize: 10 },
  list: { width: '100%', maxWidth: 320, gap: Spacing.sm },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.border, ...Shadows.subtle,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: { flex: 1, gap: 2 },
});
