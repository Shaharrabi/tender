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

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { SlideInUp, FadeOut } from 'react-native-reanimated';
import { useEngagementNotification } from '@/hooks/useEngagementNotification';
import { usePartnerActivityRealtime, type PartnerActivityEvent } from '@/hooks/usePartnerActivityRealtime';
import NotificationBanner from './NotificationBanner';
import NotificationToast from './NotificationToast';
import NotificationBellButton from './NotificationBellButton';
import { HeartIcon } from '@/assets/graphics/icons';
import { Colors, Spacing, FontFamilies, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

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

  // ─── Partner Activity Toast State ──────────────────
  const [partnerToast, setPartnerToast] = useState<{ title: string; body: string } | null>(null);

  const handlePartnerActivity = useCallback((event: PartnerActivityEvent) => {
    const name = event.partnerName || 'Your partner';
    let title = '';
    let body = '';
    switch (event.activityType) {
      case 'assessment_complete':
        title = `${name} completed an assessment!`;
        body = event.details
          ? `They just finished ${event.details}. Tap to see what's new together.`
          : 'A new piece of the puzzle is in.';
        break;
      case 'practice_complete':
        title = `${name} finished a practice!`;
        body = 'They are putting in the work. Your shared journey just moved forward.';
        break;
      case 'step_reflection':
        title = `${name} shared a reflection`;
        body = 'Something new is waiting for you in the couple portal.';
        break;
      case 'checkin':
        title = `${name} checked in`;
        body = 'They are thinking about you.';
        break;
      case 'course_started':
        title = `${name} wants to play!`;
        body = event.details ? `They started "${event.details}".` : 'A couple course is waiting for you.';
        break;
      case 'course_completed':
        title = `${name} finished a course!`;
        body = event.details ? `"${event.details}" — complete.` : 'Another milestone together.';
        break;
      default:
        title = `${name} did something new`;
        body = "Tap to see what's happening.";
    }
    setPartnerToast({ title, body });
  }, []);

  // Auto-dismiss partner toast after 4 seconds
  useEffect(() => {
    if (!partnerToast) return;
    const timer = setTimeout(() => setPartnerToast(null), 4000);
    return () => clearTimeout(timer);
  }, [partnerToast]);

  // Subscribe to realtime partner activity → fires local notifications + toast
  usePartnerActivityRealtime(userId, handlePartnerActivity);

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

      {/* Partner Activity Toast — Duolingo-style in-app notification */}
      {partnerToast && (
        <Animated.View
          entering={SlideInUp.duration(300).springify().damping(15)}
          exiting={FadeOut.duration(200)}
          style={styles.partnerToastWrap}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPartnerToast(null)}
            style={styles.partnerToast}
          >
            <View style={styles.partnerToastIcon}>
              <HeartIcon size={18} color="#C4836A" />
            </View>
            <View style={styles.partnerToastText}>
              <Text style={styles.partnerToastTitle} numberOfLines={1}>{partnerToast.title}</Text>
              <Text style={styles.partnerToastBody} numberOfLines={2}>{partnerToast.body}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
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
  partnerToastWrap: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1100,
    alignItems: 'center',
  },
  partnerToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: '#C4836A',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    ...Shadows.elevated,
    maxWidth: 360,
    width: '100%',
  },
  partnerToastIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C4836A' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  partnerToastText: {
    flex: 1,
  },
  partnerToastTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    marginBottom: 2,
  },
  partnerToastBody: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: FontSizes.caption * 1.4,
  },
});
