/**
 * CheckInRhythm — Small visual showing check-in consistency.
 *
 * 7 dots for the last 7 days. Filled = checked in. Empty = no check-in.
 * Warm, non-judgmental language. Building rhythm, not tracking streaks.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
} from '@/constants/theme';

// ─── Helpers ────────────────────────────────────────────

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getDayLabelsForLastWeek(): string[] {
  const labels: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    labels.push(DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1]);
  }
  return labels;
}

function getRhythmMessage(count: number): string {
  if (count === 7) return 'Every day this week. Beautiful rhythm.';
  if (count >= 5) return `You\u2019ve shown up ${count} of the last 7 days.`;
  if (count >= 3) return `${count} of 7 days. Building rhythm.`;
  if (count >= 1) return `${count} of 7 days. Every moment of presence counts.`;
  return 'A new week to begin. Start with today.';
}

// ─── Component ──────────────────────────────────────────

interface CheckInRhythmProps {
  /** Boolean array, length 7. Index 0 = 6 days ago, index 6 = today. */
  weekDots: boolean[];
}

export default function CheckInRhythm({ weekDots }: CheckInRhythmProps) {
  const count = weekDots.filter(Boolean).length;
  const dayLabels = getDayLabelsForLastWeek();

  return (
    <View style={styles.container}>
      <View style={styles.dotsRow}>
        {weekDots.map((filled, i) => (
          <View key={i} style={styles.dayColumn}>
            <Text style={styles.dayLabel}>{dayLabels[i]}</Text>
            <View
              style={[
                styles.dot,
                filled ? styles.dotFilled : styles.dotEmpty,
              ]}
            />
          </View>
        ))}
      </View>
      <Text style={styles.message}>{getRhythmMessage(count)}</Text>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 4,
  },
  dayLabel: {
    fontSize: FontSizes.caption - 2,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotFilled: {
    backgroundColor: Colors.primary,
  },
  dotEmpty: {
    backgroundColor: Colors.borderLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  message: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 2,
  },
});
