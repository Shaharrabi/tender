/**
 * HomeNotificationLayer — Orchestrator for home screen notifications.
 *
 * Self-contained component that manages notification display on the home
 * screen. Renders a NotificationBanner for standard categories and a
 * NotificationToast for milestone celebrations. Also exposes a
 * NotificationBellButton for navigating to the feed.
 *
 * Drop this as a single line in home.tsx — no other wiring needed.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useEngagementNotification } from '@/hooks/useEngagementNotification';
import NotificationBanner from './NotificationBanner';
import NotificationToast from './NotificationToast';
import NotificationBellButton from './NotificationBellButton';

// ─── Props ──────────────────────────────────────────

interface HomeNotificationLayerProps {
  userId?: string;
  weareBottleneck?: string;
  dayNumber?: number;
}

// ─── Component ──────────────────────────────────────

export default function HomeNotificationLayer({
  userId,
  weareBottleneck,
  dayNumber = 1,
}: HomeNotificationLayerProps) {
  const {
    currentNotification,
    unreadCount,
    dismiss,
    markTapped,
    loading,
  } = useEngagementNotification(userId, weareBottleneck, dayNumber);

  // Don't render anything while loading
  if (loading) return null;

  const isMilestone = currentNotification?.category === 'milestone_streak';

  return (
    <View style={styles.container}>
      {/* Bell button — always visible, positioned for home screen header */}
      <View style={styles.bellRow}>
        <NotificationBellButton unreadCount={unreadCount} />
      </View>

      {/* Banner overlays content — does NOT push layout down */}
      {currentNotification && (
        <View style={styles.bannerOverlay}>
          {isMilestone ? (
            <NotificationToast
              notification={currentNotification}
              onDismiss={dismiss}
            />
          ) : (
            <NotificationBanner
              notification={currentNotification}
              onDismiss={dismiss}
              onTap={markTapped}
            />
          )}
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    // Bell row stays in-flow; banner overlays below it via zIndex
  },
  bellRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  bannerOverlay: {
    // Overlay so the banner doesn't push content down
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
