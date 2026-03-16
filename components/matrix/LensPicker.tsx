/**
 * LensPicker — Six viewpoint pills for the Integration Engine.
 *
 * Same data, six different doors:
 *   Therapeutic | Soulful | Practical | Developmental | Relational | Simple
 *
 * Default lens: Soulful (Tender's WEARE signature voice).
 * Arc, practice, and invitation stay the same across lenses.
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, FontFamilies } from '@/constants/theme';
import type { LensType } from '@/utils/integration-engine';
import { LENS_META } from '@/utils/integration-engine';

interface LensPickerProps {
  activeLens: LensType;
  onLensChange: (lens: LensType) => void;
}

const LENS_ORDER: LensType[] = [
  'soulful',
  'therapeutic',
  'practical',
  'developmental',
  'relational',
  'simple',
];

const LENS_COLORS: Record<LensType, { bg: string; active: string; text: string }> = {
  therapeutic: { bg: '#F0EBF5', active: '#8B7BAB', text: '#5A4A7A' },
  soulful:     { bg: '#FDF3E0', active: '#D4A843', text: '#8B6914' },
  practical:   { bg: '#E8F0E3', active: '#6B8B5E', text: '#4A6B3E' },
  developmental: { bg: '#EBF0F5', active: '#6B8BAB', text: '#4A6A8A' },
  relational:  { bg: '#F5EBF0', active: '#AB7B8B', text: '#8A4A6A' },
  simple:      { bg: '#F5F0EB', active: '#9B8B7B', text: '#6A5B4A' },
};

export default function LensPicker({ activeLens, onLensChange }: LensPickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {LENS_ORDER.map((lens) => {
        const isActive = lens === activeLens;
        const colors = LENS_COLORS[lens];
        const meta = LENS_META[lens];

        return (
          <TouchableOpacity
            key={lens}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? colors.active : colors.bg,
                borderColor: isActive ? colors.active : 'transparent',
              },
            ]}
            onPress={() => onLensChange(lens)}
            activeOpacity={0.7}
          >
            <TenderText
              variant="caption"
              style={[
                styles.pillLabel,
                { color: isActive ? '#FFFFFF' : colors.text },
              ]}
            >
              {meta.label}
            </TenderText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: Spacing.xs,
    paddingHorizontal: 2,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  pillLabel: {
    fontSize: 11,
    fontFamily: FontFamilies.heading,
    letterSpacing: 0.5,
  },
});
