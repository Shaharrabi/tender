/**
 * CategoryPills — Horizontal scrolling filter pills for community categories.
 */

import React from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
} from '@/constants/theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';

interface CategoryPillsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export function CategoryPills({ activeCategory, onCategoryChange, categories }: CategoryPillsProps) {
  const haptics = useSoundHaptics();

  const handlePress = (cat: string) => {
    haptics.tapSoft();
    onCategoryChange(cat);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={st.row}
      style={st.scroll}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <TouchableOpacity
            key={cat}
            style={[st.pill, isActive && st.pillActive]}
            onPress={() => handlePress(cat)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${cat}`}
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[st.pillText, isActive && st.pillTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  scroll: {
    marginBottom: Spacing.md,
  },
  row: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.textOnPrimary,
  },
});
