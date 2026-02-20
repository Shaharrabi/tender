/**
 * NotificationToast — Auto-dismissing milestone celebration toast.
 *
 * Slides in from the top, shows for 4 seconds, then fades out.
 * Used for milestone/streak celebrations that don't need user action.
 * Matches the Wes Anderson warm-white elevated aesthetic.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { SlideInUp, FadeOut } from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { EngagementPrompt } from '@/types/notifications';

// ─── Constants ──────────────────────────────────────

const AUTO_DISMISS_MS = 4000;

// ─── Props ──────────────────────────────────────────

interface NotificationToastProps {
  notification: EngagementPrompt;
  onDismiss: () => void;
}

// ─── Component ──────────────────────────────────────

export default function NotificationToast({
  notification,
  onDismiss,
}: NotificationToastProps) {
  const Icon = notification.icon;

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <Animated.View
      entering={SlideInUp.duration(300).springify().damping(15)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <View style={[styles.toast, { borderLeftColor: notification.accentColor }]}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={notification.accentColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {notification.body}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl, // safe area offset
  },
  toast: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentCream,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.elevated,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    marginBottom: 2,
  },
  body: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: FontSizes.caption * 1.4,
  },
});
