/**
 * MatrixCell — A single colored cell in the Tender Matrix.
 *
 * Shows label, score, and descriptor in the domain's color.
 * Tapping any cell in a domain opens/closes the narrative panel.
 * Soft, artsy Wes Anderson aesthetic — rounded corners, vintage warmth.
 */

import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { MATRIX_COLORS, type MatrixColorKey } from './constants/matrix-colors';
import { Spacing, BorderRadius, FontFamilies } from '@/constants/theme';

export interface MatrixCellData {
  label: string;
  score: number | string;
  descriptor: string;
  color: MatrixColorKey;
}

interface MatrixCellProps {
  cell: MatrixCellData;
  compact?: boolean;
}

export default function MatrixCell({ cell, compact }: MatrixCellProps) {
  const palette = MATRIX_COLORS[cell.color];
  const { width } = useWindowDimensions();
  const isNarrow = width < 400;
  const isTextScore = typeof cell.score === 'string' && isNaN(Number(cell.score));

  return (
    <View style={[styles.cell, { backgroundColor: palette.bg }, compact && styles.cellCompact, isNarrow && styles.cellNarrow]}>
      <TenderText
        variant="caption"
        style={[styles.label, { color: palette.label }, isNarrow && styles.labelNarrow]}
        numberOfLines={1}
      >
        {cell.label}
      </TenderText>
      <TenderText
        variant="headingS"
        style={[
          styles.score,
          { color: palette.text },
          isNarrow && styles.scoreNarrow,
          isNarrow && isTextScore && styles.scoreTextNarrow,
        ]}
        numberOfLines={isTextScore ? 2 : 1}
      >
        {typeof cell.score === 'number' ? Math.round(cell.score) : cell.score}
      </TenderText>
      {cell.descriptor ? (
        <TenderText
          variant="caption"
          style={[styles.descriptor, { color: palette.label }, isNarrow && styles.descriptorNarrow]}
          numberOfLines={2}
        >
          {cell.descriptor}
        </TenderText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
    minHeight: 72,
  },
  cellCompact: {
    minHeight: 60,
    paddingVertical: Spacing.xs + 2,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: 'JosefinSans_500Medium',
    marginBottom: 2,
  },
  score: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  descriptor: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 1,
    fontFamily: 'JosefinSans_300Light',
  },
  cellNarrow: {
    paddingHorizontal: 2,
  },
  labelNarrow: {
    fontSize: 8,
    letterSpacing: 0.5,
  },
  scoreNarrow: {
    fontSize: 14,
    lineHeight: 20,
  },
  scoreTextNarrow: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center' as const,
  },
  descriptorNarrow: {
    fontSize: 9,
    lineHeight: 12,
  },
});
