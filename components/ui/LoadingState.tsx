/**
 * LoadingState — Reusable loading indicator for the Tender app.
 *
 * Variants:
 *   - inline (default): centered spinner + optional message, takes space of its parent
 *   - fullscreen: absolute overlay covering the full screen
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/theme';

interface LoadingStateProps {
  message?: string;
  fullscreen?: boolean;
}

export default function LoadingState({
  message = 'Loading...',
  fullscreen = false,
}: LoadingStateProps) {
  return (
    <View
      style={fullscreen ? styles.fullscreen : styles.inline}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size="large" color={Colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inline: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 246, 240, 0.85)',
    zIndex: 999,
  },
  message: {
    marginTop: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },
});
