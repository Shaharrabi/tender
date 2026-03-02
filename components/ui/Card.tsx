/**
 * Card — Consolidated card component for Tender
 *
 * Supports 4 visual variants, optional press interaction,
 * configurable padding/border-radius, and optional accent strips.
 *
 * Usage:
 *   <Card variant="elevated">…static content…</Card>
 *   <Card variant="surface" onPress={handleTap}>…tappable card…</Card>
 *   <Card variant="accent" accentColor={Colors.primary}>…accent strip…</Card>
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

export interface CardProps {
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'surface' | 'elevated' | 'outlined' | 'accent';
  /** Spacing token for inner padding */
  padding?: keyof typeof Spacing;
  /** Border radius override token (defaults to md) */
  radius?: keyof typeof BorderRadius;
  /** If provided, card becomes a pressable TouchableOpacity */
  onPress?: (event: GestureResponderEvent) => void;
  /** Left-side accent strip color (only visible with variant="accent") */
  accentColor?: string;
  /** Override / extend styles */
  style?: ViewStyle;
  /** Accessibility label for interactive cards */
  accessibilityLabel?: string;
}

export default function Card({
  children,
  variant = 'surface',
  padding = 'md',
  radius = 'md',
  onPress,
  accentColor = Colors.primary,
  style,
  accessibilityLabel,
}: CardProps) {
  const cardStyles: ViewStyle[] = [
    styles.base,
    { borderRadius: BorderRadius[radius], padding: Spacing[padding] },
    variant === 'surface' && styles.surface,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'accent' && styles.accent,
    variant === 'accent' && { borderLeftColor: accentColor },
    style,
  ].filter(Boolean) as ViewStyle[];

  // Interactive card
  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Static card
  return (
    <View
      style={cardStyles}
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
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
  accent: {
    backgroundColor: Colors.surfaceElevated,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    ...Shadows.card,
  },
});
