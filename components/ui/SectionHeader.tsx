import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSizes, FontFamilies, Spacing } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  size?: 'large' | 'medium' | 'small';
  style?: ViewStyle;
}

export default function SectionHeader({
  title,
  subtitle,
  size = 'medium',
  style,
}: SectionHeaderProps) {
  const titleSize =
    size === 'large'
      ? FontSizes.headingXL
      : size === 'medium'
      ? FontSizes.headingL
      : FontSizes.headingM;

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="header"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
    >
      <Text style={[styles.title, { fontSize: titleSize }]}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
