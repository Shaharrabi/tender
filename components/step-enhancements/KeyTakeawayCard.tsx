/**
 * KeyTakeawayCard — Bold single sentence the user carries from each step.
 *
 * Verified: TenderText variant="serifItalic" → PlayfairDisplay_400Regular_Italic 18px
 *   TenderText variant="label" → JosefinSans_500Medium 13px uppercase
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface KeyTakeawayCardProps {
  takeaway: string;
  phaseColor: string;
}

export function KeyTakeawayCard({ takeaway, phaseColor }: KeyTakeawayCardProps) {
  return (
    <Animated.View entering={FadeIn.delay(400).duration(500)}>
      <View style={[styles.card, { borderLeftColor: phaseColor, backgroundColor: phaseColor + '10' }]}>
        <TenderText variant="label" color={phaseColor} style={styles.eyebrow}>
          KEY TAKEAWAY
        </TenderText>
        <TenderText variant="serifItalic" color={Colors.text} style={styles.text}>
          {'\u201C'}{takeaway}{'\u201D'}
        </TenderText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderLeftWidth: 4, borderRadius: BorderRadius.sm, padding: Spacing.md, gap: Spacing.xs },
  eyebrow: { fontSize: 9, letterSpacing: 2 },
  text: { fontSize: 15, lineHeight: 24 },
});
