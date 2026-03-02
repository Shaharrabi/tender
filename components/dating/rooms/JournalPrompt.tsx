/**
 * JournalPrompt — Post-date journal entry for The Writing Desk
 *
 * Saves to dating_journal table (NOT the app's main journal)
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface JournalPromptProps {
  prompt: {
    question: string;
    hint: string;
  };
}

export default function JournalPrompt({ prompt }: JournalPromptProps) {
  const [text, setText] = useState('');

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{prompt.question}</Text>
      <Text style={styles.hint}>{prompt.hint}</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Write here..."
        placeholderTextColor={Colors.textMuted}
        multiline
        textAlignVertical="top"
        accessibilityRole="text"
        accessibilityLabel={`Journal prompt: ${prompt.question}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  question: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '700',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 4,
  },
  hint: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    padding: 14,
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
    backgroundColor: Colors.backgroundAlt,
    minHeight: 80,
  },
});
