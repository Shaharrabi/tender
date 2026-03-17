/**
 * MatrixCell — A single colored cell in the Tender Matrix.
 *
 * Shows label, score, and descriptor in the domain's color.
 * Tapping any cell in a domain opens/closes the narrative panel.
 * Soft, artsy Wes Anderson aesthetic — rounded corners, vintage warmth.
 */

import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions, Animated, Alert, Platform } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { MATRIX_COLORS, type MatrixColorKey } from './constants/matrix-colors';
import { Spacing, BorderRadius, FontFamilies } from '@/constants/theme';

/** Brief explainer for each score label — shown when user taps ⓘ */
const SCORE_EXPLAINERS: Record<string, string> = {
  'Sensitivity': 'How easily your nervous system responds to emotional signals. Higher = more reactive to feelings (not "caring more"). Lower = emotionally steady, not easily triggered.',
  'Anxiety': 'How much you worry about closeness and abandonment in relationships. Higher = more vigilant about connection. Lower = more relaxed about attachment.',
  'Avoidance': 'How much you pull away from emotional closeness. Higher = more distance-seeking. Lower = more comfortable with intimacy.',
  'Warmth': 'Your natural tendency toward kindness and cooperation. Higher = deeply warm and empathic. Lower = more direct and straightforward.',
  'Openness': 'How curious and open you are to new experiences and ideas. Higher = loves exploring. Lower = values stability and the familiar.',
  'Extraversion': 'How much energy you get from others. Higher = energized by people. Lower = prefers quiet depth and solitude.',
  'Conscientiousness': 'How organized and disciplined you are. Higher = structured and reliable. Lower = more spontaneous and flexible.',
  'Perception': 'How accurately you read others\' emotions. Higher = strong emotional radar. Lower = may miss emotional signals.',
  'Managing self': 'How well you regulate your own emotions. Higher = can calm yourself down. Lower = emotions can overwhelm you.',
  'Managing others': 'How well you influence others\' emotions. Higher = naturally soothing. Lower = still developing this skill.',
  'Utilization': 'How well you use emotions as information. Higher = emotions guide decisions wisely. Lower = still learning to listen to feelings.',
  'Reactivity': 'How calm you stay under pressure. Higher = calm and grounded. Lower = emotions take over quickly.',
  'I-Position': 'How clearly you can state your own views. Higher = clear voice, strong boundaries. Lower = may lose your position in closeness.',
  'Fusion': 'How well you maintain yourself in relationships. Higher = clear boundaries. Lower = may merge with your partner\'s emotions.',
  'Cutoff': 'How connected you stay during conflict. Higher = stays engaged. Lower = may shut down or disconnect.',
  'Yielding': 'How much you give in during disagreements. Higher = tends to accommodate. Lower = holds ground.',
  'Compromising': 'How much you seek middle ground. Higher = natural negotiator. Lower = prefers clear win/lose.',
  'Forcing': 'How much you push your position in conflict. Higher = drives hard. Lower = avoids pushing.',
  'Problem-solving': 'How much you work to find solutions. Higher = creative problem-solver. Lower = may avoid engagement.',
  'Avoiding': 'How much you sidestep conflict entirely. Higher = conflict-avoidant. Lower = faces disagreements directly.',
  'Field awareness': 'How attuned you are to the relational space between you and your partner. Higher = deeply present. Lower = still developing this sense.',
};

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
      {SCORE_EXPLAINERS[cell.label] && (
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert(`${cell.label}: ${cell.descriptor}\n\n${SCORE_EXPLAINERS[cell.label]}`);
            } else {
              Alert.alert(
                cell.label,
                `${cell.descriptor}\n\n${SCORE_EXPLAINERS[cell.label]}`,
                [{ text: 'Got it' }],
              );
            }
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Info about ${cell.label}`}
        >
          <TenderText variant="caption" style={[styles.infoIcon, { color: palette.label }]}>ⓘ</TenderText>
        </TouchableOpacity>
      )}
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
  infoButton: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  infoIcon: {
    fontSize: 11,
    opacity: 0.85,
    lineHeight: 13,
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
