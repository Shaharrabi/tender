/**
 * OfflineBanner — Slim top-of-screen banner when the device is offline.
 *
 * Slides in/out with Reanimated. Uses a muted, non-alarming tone:
 *   "You're offline — some features may be limited."
 *
 * Place it once in the root layout; it reads from NetworkContext
 * and renders nothing when connected.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
} from '@/constants/theme';
import { useNetwork } from '@/context/NetworkContext';

function OfflineBanner() {
  const { isOffline, isLoading } = useNetwork();

  // Don't flash the banner while the first check resolves
  if (isLoading || !isOffline) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.banner}
    >
      <Text style={styles.dot}>●</Text>
      <Text style={styles.text}>
        You're offline — some features may be limited.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.textMuted,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  dot: {
    fontSize: 8,
    color: Colors.white,
  },
  text: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.white,
    fontWeight: '500',
  },
});

export default React.memo(OfflineBanner);
