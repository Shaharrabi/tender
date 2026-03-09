/**
 * PortraitDigest — "Your Portrait in 60 Seconds" top-of-overview summary.
 *
 * Verified types: IndividualPortrait, CyclePosition from @/types/portrait
 *   Colors.success='#6B9080', Colors.warning='#D4A843', Colors.accent='#D8A499'
 *   Colors.primary='#6B7B9B', Colors.depth='#5B6B8A', Colors.calm='#6BA3A0'
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { IndividualPortrait, CyclePosition } from '@/types/portrait';
import {
  SwirlyIcon,
  StarIcon,
  SeedlingIcon,
  CompassIcon,
  HeartIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons/types';

interface PortraitDigestProps {
  portrait: IndividualPortrait;
}

function cycleDesc(pos: CyclePosition): string {
  switch (pos) {
    case 'pursuer': return 'Pursuer \u2014 you move toward connection when stressed, sometimes too urgently';
    case 'withdrawer': return 'Withdrawer \u2014 you pull inward under stress to protect yourself';
    case 'mixed': return 'Mixed \u2014 you shift between reaching and withdrawing depending on the moment';
    case 'flexible': return 'Flexible \u2014 you adapt your response to what the situation needs';
    default: return 'Your pattern shapes how you respond under stress';
  }
}

function topStrength(cs: IndividualPortrait['compositeScores']): { label: string; value: number } {
  const s = [
    { label: 'Engagement', value: cs.engagement },
    { label: 'Accessibility', value: cs.accessibility },
    { label: 'Responsiveness', value: cs.responsiveness },
    { label: 'Regulation', value: cs.regulationScore },
    { label: 'Self-Leadership', value: cs.selfLeadership },
    { label: 'Values Alignment', value: cs.valuesCongruence },
  ];
  return s.sort((a, b) => b.value - a.value)[0];
}

const STRENGTH_MEANINGS: Record<string, string> = {
  'Engagement': 'you don\u2019t check out, even when it\u2019s hard',
  'Accessibility': 'your partner can usually find you emotionally',
  'Responsiveness': 'you tune in to what your partner needs',
  'Regulation': 'you stay grounded under pressure',
  'Self-Leadership': 'you can observe your patterns while they\u2019re happening',
  'Values Alignment': 'you live in line with what matters to you',
};

function partnerNeed(pos: CyclePosition): string {
  switch (pos) {
    case 'pursuer': return 'Pause before pursuing. Ask \u201CWhat do you need right now?\u201D instead of reaching';
    case 'withdrawer': return 'Stay 30 seconds longer before retreating. Say \u201CI\u2019m here\u201D first';
    case 'mixed': return 'Name which mode you\u2019re in: \u201CI\u2019m reaching\u201D or \u201CI need a moment\u201D';
    case 'flexible': return 'Keep checking in \u2014 your adaptability is a gift, but your partner needs consistency too';
    default: return 'Name what\u2019s happening before reacting';
  }
}

export default function PortraitDigest({ portrait }: PortraitDigestProps) {
  const cs = portrait.compositeScores;
  const strength = topStrength(cs);
  const edge = portrait.growthEdges?.[0];
  const pos = portrait.negativeCycle.position;
  const values = portrait.fourLens?.values?.coreValues?.slice(0, 3).join(', ') ?? '';

  const items: Array<{ label: string; text: string; color: string; Icon: React.ComponentType<IconProps> }> = [
    { label: 'Cycle', text: cycleDesc(pos), color: Colors.accent, Icon: SwirlyIcon },
    { label: 'Strength', text: `${strength.label} (${strength.value}) \u2014 ${STRENGTH_MEANINGS[strength.label] ?? 'a real strength'}`, color: Colors.success, Icon: StarIcon },
    { label: 'Growth Edge', text: edge ? edge.title : 'Not yet identified', color: Colors.warning, Icon: SeedlingIcon },
    { label: 'Values', text: values ? `${values} \u2014 the compass underneath your decisions` : 'Complete your values assessment to see this', color: Colors.primary, Icon: CompassIcon },
    { label: 'Partner Needs', text: partnerNeed(pos), color: Colors.depth, Icon: HeartIcon },
  ];

  return (
    <Animated.View entering={FadeIn.delay(200).duration(500)}>
      <View style={styles.card}>
        <TenderText variant="label" color={Colors.calm} style={styles.eyebrow}>
          YOUR PORTRAIT IN 60 SECONDS
        </TenderText>
        {items.map((item) => (
          <View key={item.label} style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
              <item.Icon size={13} color={item.color} />
            </View>
            <View style={styles.rowContent}>
              <TenderText variant="label" color={Colors.text} style={styles.itemLabel}>{item.label}</TenderText>
              <TenderText variant="body" color={Colors.textSecondary} style={styles.itemText}>{item.text}</TenderText>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  eyebrow: { letterSpacing: 2.5, fontSize: 10, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  iconCircle: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2,
  },
  rowContent: { flex: 1, gap: 2 },
  itemLabel: { fontSize: 11, letterSpacing: 0.8, fontWeight: '700' },
  itemText: { lineHeight: 22, fontSize: 14 },
});
