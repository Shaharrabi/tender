/**
 * PracticeCard — Accordion card for The Parlor's Seven Practices
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface PracticeCardProps {
  practice: {
    principle: string;
    name: string;
    time: string;
    instruction: string;
    why: string;
    weare: string;
  };
  index: number;
}

export default function PracticeCard({ practice, index }: PracticeCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => setRevealed(!revealed)}
        style={styles.header}
        activeOpacity={0.7}
      >
        <View style={styles.numberCircle}>
          <Text style={styles.number}>{index + 1}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{practice.name}</Text>
          <Text style={styles.meta}>
            {practice.principle} · {practice.time}
          </Text>
        </View>
        <Text style={[styles.chevron, revealed && styles.chevronOpen]}>▼</Text>
      </TouchableOpacity>

      {revealed && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.body}>
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>{practice.instruction}</Text>
          </View>
          <View style={styles.whyBox}>
            <Text style={styles.whyText}>{practice.why}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  header: {
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}11`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '700',
    fontSize: 16,
    color: Colors.primary,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '700',
    fontSize: 17,
    color: Colors.text,
  },
  meta: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  chevron: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  body: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: 12,
  },
  instructionBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  instructionText: {
    ...Typography.bodyLarge,
    lineHeight: 26,
    color: Colors.text,
  },
  whyBox: {
    borderLeftWidth: 3,
    borderLeftColor: `${Colors.primary}33`,
    paddingLeft: Spacing.md,
  },
  whyText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
