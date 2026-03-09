/**
 * StepStartHereCard — Welcome card with time estimates + "Begin Reading" CTA.
 *
 * Verified: Colors.surfaceElevated = '#FFF8F2', Colors.white = '#FFFFFF'
 *   Shadows.card = { shadowOffset: {0,2}, shadowOpacity: 0.08 }
 *   BorderRadius.lg = 16, BorderRadius.pill = 999
 *   Typography.button → Jost_600SemiBold 15px uppercase
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const STEP_SUMMARIES: Record<number, string> = {
  1: 'This step is about seeing your pattern \u2014 the dance between you \u2014 without blame.',
  2: 'This step is about trusting the space between you \u2014 the relational field that heals.',
  3: 'This step is about loosening your grip on the story \u2014 holding certainty more lightly.',
  4: 'This step is about looking inward \u2014 seeing your part in the dance without shame.',
  5: 'This step is about sharing what\u2019s underneath \u2014 letting your partner see the real you.',
  6: 'This step is about releasing the enemy story \u2014 seeing protection, not malice.',
  7: 'This step is about daily practice \u2014 building rituals of ordinary devotion.',
  8: 'This step is about embodiment \u2014 trying new moves even when they feel clumsy.',
  9: 'This step is about repair \u2014 tending ruptures while they\u2019re still fresh.',
  10: 'This step is about rituals \u2014 creating predictable moments of connection.',
  11: 'This step is about sustaining \u2014 meeting old patterns with gentleness, not shame.',
  12: 'This step is about becoming a refuge \u2014 for your partner and for yourself.',
};

interface StepStartHereCardProps {
  stepNumber: number;
  readMinutes: number;
  practiceCount: number;
  reflectionCount: number;
  phaseColor: string;
  onBeginReading: () => void;
}

export default function StepStartHereCard({
  stepNumber,
  readMinutes,
  practiceCount,
  reflectionCount,
  phaseColor,
  onBeginReading,
}: StepStartHereCardProps) {
  return (
    <Animated.View entering={FadeIn.delay(200).duration(500)}>
      <View style={[styles.card, { borderColor: phaseColor + '40' }]}>
        <TenderText variant="label" color={phaseColor} style={styles.eyebrow}>
          START HERE
        </TenderText>

        <TenderText variant="body" color={Colors.text} style={styles.summary}>
          {STEP_SUMMARIES[stepNumber] ?? ''}
        </TenderText>

        <View style={styles.metaRow}>
          <TenderText variant="caption" color={Colors.textMuted}>
            {'\uD83D\uDCD6'} {readMinutes} min read
          </TenderText>
          <TenderText variant="caption" color={Colors.textMuted}>
            {'\uD83E\uDDD8'} {practiceCount} practice{practiceCount !== 1 ? 's' : ''}
          </TenderText>
          <TenderText variant="caption" color={Colors.textMuted}>
            {'\u270D\uFE0F'} {reflectionCount} reflection{reflectionCount !== 1 ? 's' : ''}
          </TenderText>
        </View>

        <TouchableOpacity
          style={[styles.beginButton, { backgroundColor: phaseColor }]}
          onPress={onBeginReading}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Begin reading this step"
        >
          <TenderText variant="button" color={Colors.white}>
            Begin Reading
          </TenderText>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export { STEP_SUMMARIES };

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  eyebrow: { letterSpacing: 2, fontSize: 10 },
  summary: { lineHeight: 26 },
  metaRow: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap' },
  beginButton: {
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
});
