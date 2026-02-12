import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface DividerProps {
  spacing?: keyof typeof Spacing;
  color?: string;
  style?: ViewStyle;
}

export default function Divider({
  spacing = 'md',
  color = Colors.borderLight,
  style,
}: DividerProps) {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          marginVertical: Spacing[spacing],
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
  },
});
