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
import { usePartnerActivityRealtime } from '@/hooks/usePartnerActivityRealtime';
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
    markAllRead,
    loading,
  } = useEngagementNotification(userId, weareBottleneck, dayNumber);

  // Subscribe to realtime partner activity → fires local notifications
  usePartnerActivityRealtime(userId);

  // Don't render anything while loading
  if (loading) return null;

  const isMilestone = currentNotification?.category === 'milestone_streak';

  return (
    <View style={styles.container}>
      {/* Bell button — always visible, positioned for home screen header */}
      <View style={styles.bellRow}>
        <NotificationBellButton unreadCount={unreadCount} onPress={markAllRead} />
      </View>

      {/* Banner in normal flow — visible above XP bar */}
      {currentNotification && (
        <View style={styles.bannerWrap}>
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
    zIndex: 10,
  },
  bellRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  bannerWrap: {
    // In normal document flow so it stays visible above subsequent siblings
    paddingHorizontal: 12,
    marginBottom: 8,
  },
});
