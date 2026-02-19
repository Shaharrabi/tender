/**
 * CompatibilityBars — WEARE dimension bars
 *
 * Displays WEARE compatibility across 5 dimensions
 * as horizontal progress bars.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { COMPATIBILITY_DIMS } from '@/constants/dating/rooms';

interface CompatibilityBarsProps {
  bars: Record<string, number>;
  compact?: boolean;
}

export default function CompatibilityBars({ bars, compact = false }: CompatibilityBarsProps) {
  const dims = compact ? COMPATIBILITY_DIMS.slice(0, 3) : COMPATIBILITY_DIMS;

  return (
    <View style={styles.container}>
      {dims.map((dim) => {
        const value = bars[dim.key] ?? 50;
        return (
          <View key={dim.key} style={styles.row}>
            <Text style={styles.label}>{dim.label}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${value}%`, backgroundColor: dim.color },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
    minWidth: 80,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
