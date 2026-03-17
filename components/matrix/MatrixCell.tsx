/**
 * MatrixCell — A single colored cell in the Tender Matrix.
 *
 * Shows label, score, and descriptor in the domain's color.
 * Tapping any cell in a domain opens/closes the narrative panel.
 * Soft, artsy Wes Anderson aesthetic — rounded corners, vintage warmth.
 */

import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions, Animated } from 'react-native';
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
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export default function MatrixCell({ cell, compact, selectable, selected, onSelect }: MatrixCellProps) {
  const palette = MATRIX_COLORS[cell.color] as { bg: string; text: string; label: string; accent: string };
  const { width } = useWindowDimensions();
  const isNarrow = width < 400;
  const isTextScore = typeof cell.score === 'string' && isNaN(Number(cell.score));

  // Selection animation
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (selectable) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: selected ? 0.92 : 1.04, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [selected]);

  const content = (
    <View style={[
      styles.cell,
      { backgroundColor: palette.bg },
      compact && styles.cellCompact,
      isNarrow && styles.cellNarrow,
      selectable && selected && { borderWidth: 2, borderColor: palette.accent || palette.text },
    ]}>
      <TenderText
        variant="caption"
        style={[styles.label, { color: palette.label }, isNarrow && styles.labelNarrow]}
        numberOfLines={1}
      >
        {cell.label}
      </TenderText>
      <TenderText
        variant="caption"
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
      {selectable && selected && (
        <View style={[styles.checkOverlay, { backgroundColor: palette.accent || palette.text }]}>
          <TenderText variant="caption" style={styles.checkText}>✓</TenderText>
        </View>
      )}
    </View>
  );

  if (selectable && onSelect) {
    return (
      <TouchableOpacity style={{ flex: 1 }} onPress={onSelect} activeOpacity={0.7}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {content}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
    minHeight: 60,
  },
  cellCompact: {
    minHeight: 52,
    paddingVertical: Spacing.xs,
  },
  label: {
    fontSize: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: 'JosefinSans_400Regular',
    marginBottom: 1,
    textAlign: 'center',
  },
  score: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    letterSpacing: -0.2,
    lineHeight: 17,
    textAlign: 'center',
  },
  descriptor: {
    fontSize: 8,
    lineHeight: 11,
    textAlign: 'center',
    marginTop: 1,
    fontFamily: 'JosefinSans_300Light',
  },
  cellNarrow: {
    paddingHorizontal: 1,
    paddingVertical: Spacing.xs,
    minHeight: 52,
  },
  labelNarrow: {
    fontSize: 6.5,
    letterSpacing: 0.2,
  },
  scoreNarrow: {
    fontSize: 11,
    lineHeight: 14,
  },
  scoreTextNarrow: {
    fontSize: 9,
    lineHeight: 12,
    textAlign: 'center' as const,
  },
  descriptorNarrow: {
    fontSize: 7.5,
    lineHeight: 10,
  },
  checkOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 12,
  },
});
