/**
 * SignalRow — Green/amber/red signal indicator for The Observatory
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface SignalRowProps {
  signal: string;
  type: 'green' | 'amber' | 'red';
  extra?: string;
}

const SIGNAL_COLORS = {
  green: Colors.success,
  amber: Colors.accentGold,
  red: Colors.error,
};

const SIGNAL_ICONS = {
  green: '○',
  amber: '◐',
  red: '●',
};

export default function SignalRow({ signal, type, extra }: SignalRowProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.icon, { color: SIGNAL_COLORS[type] }]}>
        {SIGNAL_ICONS[type]}
      </Text>
      <View style={styles.textContainer}>
        <Text style={styles.signal}>{signal}</Text>
        {extra && <Text style={styles.extra}>{extra}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 16,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  signal: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 22,
  },
  extra: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
