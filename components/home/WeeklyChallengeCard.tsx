/**
 * WeeklyChallengeCard — Assessment-informed couple challenge on home screen.
 *
 * Shows this week's challenge with completion status for both partners.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { CoupleChallenge } from '@/services/couple-challenges';

interface WeeklyChallengeCardProps {
  challenge: CoupleChallenge;
  isPartner1: boolean;
  partnerName: string;
  onPress: () => void;
}

export default function WeeklyChallengeCard({
  challenge,
  isPartner1,
  partnerName,
  onPress,
}: WeeklyChallengeCardProps) {
  const myCompleted = isPartner1 ? challenge.partner1Completed : challenge.partner2Completed;
  const partnerCompleted = isPartner1 ? challenge.partner2Completed : challenge.partner1Completed;
  const myTask = isPartner1 ? challenge.partner1Task : challenge.partner2Task;

  const getStatusText = () => {
    if (myCompleted && partnerCompleted) return 'Both completed!';
    if (myCompleted) return `${partnerName} hasn\u2019t completed yet`;
    if (partnerCompleted) return `${partnerName} completed theirs`;
    return 'This week\u2019s challenge';
  };

  return (
    <TouchableOpacity
      style={[styles.card, myCompleted && partnerCompleted && styles.cardComplete]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Weekly challenge: ${challenge.challengeText}`}
    >
      <Text style={styles.eyebrow}>COUPLE CHALLENGE</Text>
      <Text style={styles.theme}>{challenge.challengeText}</Text>
      <Text style={styles.task} numberOfLines={3}>{myTask}</Text>

      <View style={styles.statusRow}>
        <View style={styles.dots}>
          <View style={[styles.dot, myCompleted && styles.dotFilled]} />
          <View style={[styles.dot, partnerCompleted && styles.dotFilled]} />
        </View>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      {!myCompleted && (
        <Text style={styles.cta}>Mark as complete {'\u2192'}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.accentGoldLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentGold,
    ...Shadows.subtle,
  },
  cardComplete: {
    backgroundColor: Colors.successLight,
    borderLeftColor: Colors.success,
  },
  eyebrow: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.micro,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  theme: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  task: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    marginRight: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.borderLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dotFilled: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  statusText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  cta: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    color: Colors.accentGold,
    marginTop: Spacing.xs,
  },
});
