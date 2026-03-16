/**
 * DailyQuestionCard — Home screen card for today's micro-moment question.
 *
 * Shows the question in Playfair italic, with status:
 * - Not answered: "Answer today's question"
 * - Answered, partner hasn't: "Waiting for [partner]..."
 * - Both answered: "See [partner]'s answer"
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
  Typography,
} from '@/constants/theme';

interface DailyQuestionCardProps {
  questionText: string;
  hasAnswered: boolean;
  partnerHasAnswered: boolean;
  partnerName: string;
  onPress: () => void;
}

export default function DailyQuestionCard({
  questionText,
  hasAnswered,
  partnerHasAnswered,
  partnerName,
  onPress,
}: DailyQuestionCardProps) {
  const getStatus = () => {
    if (!hasAnswered) return { text: 'Answer today\u2019s question', color: Colors.primary };
    if (!partnerHasAnswered) return { text: `Waiting for ${partnerName}\u2026`, color: Colors.textMuted };
    return { text: `See ${partnerName}\u2019s answer \u2192`, color: Colors.success };
  };

  const status = getStatus();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Daily question: ${questionText}`}
    >
      <Text style={styles.eyebrow}>TODAY'S QUESTION</Text>
      <Text style={styles.question} numberOfLines={3}>
        {questionText}
      </Text>
      <View style={styles.statusRow}>
        <View style={[styles.dot, { backgroundColor: status.color }]} />
        <Text style={[styles.statusText, { color: status.color }]}>
          {status.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.calm,
    ...Shadows.subtle,
  },
  eyebrow: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.micro,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  question: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  statusText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
  },
});
