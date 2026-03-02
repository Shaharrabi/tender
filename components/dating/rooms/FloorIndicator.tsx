/**
 * FloorIndicator — Hotel floor selector button
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '@/constants/theme';

interface FloorIndicatorProps {
  floor: string;
  active: boolean;
  color: string;
  onPress: () => void;
}

export default function FloorIndicator({ floor, active, color, onPress }: FloorIndicatorProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        active && { borderColor: color, backgroundColor: color },
        active && { shadowColor: color, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Floor ${floor}`}
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.text, active && styles.textActive]}>{floor}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 1,
    color: Colors.textSecondary,
  },
  textActive: {
    color: '#FFF',
  },
});
