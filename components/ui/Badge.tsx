import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSizes, BorderRadius, Spacing } from '@/constants/theme';

type BadgeVariant = 'completed' | 'inProgress' | 'notStarted' | 'info' | 'warning';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export default function Badge({ label, variant = 'info', style }: BadgeProps) {
  const config = variantConfig[variant];
  return (
    <View
      style={[styles.badge, { backgroundColor: config.bg }, style]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text style={[styles.text, { color: config.text }]}>{label}</Text>
    </View>
  );
}

const variantConfig: Record<BadgeVariant, { bg: string; text: string }> = {
  completed: { bg: '#DFF0E0', text: '#2D5F34' },
  inProgress: { bg: '#FDF3E0', text: '#8B6914' },
  notStarted: { bg: Colors.surface, text: Colors.textSecondary },
  info: { bg: '#E0EDF5', text: Colors.depth },
  warning: { bg: '#FDF3E0', text: '#8B6914' },
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
