/**
 * MatrixInvitation — The "one invitation" at the bottom of the Tender Matrix.
 *
 * A single sentence generated from the full integration of all instruments.
 * Unique per person. The most distilled piece of relational intelligence.
 * Displayed in Playfair Display serif for gravitas.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { MATRIX_COLORS } from './constants/matrix-colors';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface MatrixInvitationProps {
  text: string;
  label?: string;
}

export default function MatrixInvitation({ text, label = 'Your one invitation' }: MatrixInvitationProps) {
  const palette = MATRIX_COLORS.invitation;

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <TenderText
        variant="caption"
        style={[styles.label, { color: palette.label }]}
      >
        {label.toUpperCase()}
      </TenderText>
      <TenderText
        variant="headingM"
        style={[styles.text, { color: palette.text }]}
      >
        {'\u201C'}{text}{'\u201D'}
      </TenderText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  label: {
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: 'JosefinSans_500Medium',
    marginBottom: Spacing.sm,
  },
  text: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: 0,
    fontStyle: 'italic',
  },
});
