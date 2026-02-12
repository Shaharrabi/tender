import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'surface' | 'elevated' | 'outlined';
  padding?: keyof typeof Spacing;
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = 'surface',
  padding = 'md',
  style,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'surface' && styles.surface,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        { padding: Spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
  },
  surface: {
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
  elevated: {
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.elevated,
  },
  outlined: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
