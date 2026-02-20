/**
 * NotificationBellButton — Bell icon with unread count dot.
 *
 * Compact 36x36 pressable that shows a hand-drawn BellIcon
 * with an 8x8 unread indicator dot when count > 0.
 * Taps navigate to the notification feed screen.
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { BellIcon } from '@/assets/graphics/icons';

// ─── Props ──────────────────────────────────────────

interface NotificationBellButtonProps {
  unreadCount: number;
}

// ─── Component ──────────────────────────────────────

export default function NotificationBellButton({
  unreadCount,
}: NotificationBellButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/(app)/notification-feed' as any)}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      hitSlop={8}
      accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      accessibilityRole="button"
    >
      <BellIcon size={20} color={Colors.text} />
      {unreadCount > 0 && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  unreadDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
