/**
 * ReflectionPrompt — embedded reflection questions from the agent.
 * Used when the agent suggests a pause for reflection.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius } from '@/constants/theme';

interface Props {
  question: string;
  context?: string;
}

export default function ReflectionPrompt({ question, context }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>A moment to reflect</Text>
      <Text style={styles.question}>{question}</Text>
      {context ? <Text style={styles.context}>{context}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.calm,
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.calm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  question: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  context: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
