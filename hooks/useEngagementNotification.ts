/**
 * useEngagementNotification — React hook for the engagement notification system.
 *
 * Orchestrates notification selection, display state, dismiss/tap tracking,
 * and unread count. Used by HomeNotificationLayer to render banners.
 *
 * Now includes session-time milestones: shows a new notification at
 * 5, 10, 15, and 20 minutes of app usage (after the initial notification
 * is dismissed).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { EngagementPrompt } from '@/types/notifications';
import {
  selectNotification,
  shouldShowNotification,
  resetSessionFlag,
  addToHistory,
  getUnreadCount,
  markHistoryDismissed,
  markHistoryTapped,
  setNotificationUserId,
} from '@/utils/notification-selector';
import {
  logNotificationShown,
  logNotificationDismissed,
  logNotificationTapped,
} from '@/services/engagement-notifications';

// Time milestones in minutes — show a new notification at each one
const MILESTONES_MINUTES = [5, 10, 15, 20];

interface UseEngagementNotificationResult {
  /** The current notification to display, or null */
  currentNotification: EngagementPrompt | null;
  /** Number of unread notifications in history */
  unreadCount: number;
  /** Dismiss the current notification */
  dismiss: () => void;
  /** Mark the current notification as tapped (navigated) */
  markTapped: () => void;
  /** Force a refresh of the notification */
  refresh: () => void;
  /** Whether the system is still loading */
  loading: boolean;
}

export function useEngagementNotification(
  userId?: string,
  weareBottleneck?: string,
  dayNumber: number = 1,
): UseEngagementNotificationResult {
  const [notification, setNotification] = useState<EngagementPrompt | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const logIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);
  // Track milestone index (which milestones have been triggered)
  const milestoneIndexRef = useRef(0);
  // Track session start for milestone timing
  const sessionStartRef = useRef(Date.now());
  // Track whether a notification is currently visible (not dismissed)
  const hasActiveNotificationRef = useRef(false);

  // Load notification on mount
  const loadNotification = useCallback(async () => {
    if (!userId) {
      console.log('[Notification] No userId — skipping');
      setLoading(false);
      return;
    }

    try {
      console.log('[Notification] Loading... userId:', userId, 'dayNumber:', dayNumber);

      // Scope all notification storage to this user
      setNotificationUserId(userId);

      // Reset session flag on mount (new screen visit)
      await resetSessionFlag();

      // Check rate limits
      const canShow = await shouldShowNotification();
      console.log('[Notification] canShow:', canShow);
      if (!canShow) {
        setNotification(null);
        setLoading(false);
        return;
      }

      // Select a notification
      const selected = await selectNotification(weareBottleneck, dayNumber);
      console.log('[Notification] Selected:', selected ? `${selected.id} (${selected.category})` : 'null');
      if (!mountedRef.current) return;

      if (selected) {
        setNotification(selected);
        hasActiveNotificationRef.current = true;

        // Log to history (AsyncStorage)
        await addToHistory(selected.id, selected.category);

        // Log to DB (non-blocking, fire-and-forget)
        logNotificationShown(
          userId,
          selected.id,
          selected.category,
          selected.weareTarget,
        ).then((id) => {
          logIdRef.current = id;
        }).catch(() => {});
      } else {
        console.log('[Notification] No eligible prompt found');
      }

      // Update unread count
      const count = await getUnreadCount();
      if (mountedRef.current) setUnreadCount(count);
    } catch (err) {
      console.warn('[Notification] Hook error:', err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [userId, weareBottleneck, dayNumber]);

  // Show a milestone notification (bypasses session limit for milestones)
  const showMilestoneNotification = useCallback(async () => {
    if (!userId || !mountedRef.current) return;
    // Don't show if there's already an active (undismissed) notification
    if (hasActiveNotificationRef.current) return;

    try {
      // Reset session flag to allow a new notification for milestone
      await resetSessionFlag();

      const selected = await selectNotification(weareBottleneck, dayNumber);
      if (!mountedRef.current || !selected) return;

      setNotification(selected);
      hasActiveNotificationRef.current = true;
      await addToHistory(selected.id, selected.category);

      logNotificationShown(
        userId,
        selected.id,
        selected.category,
        selected.weareTarget,
      ).then((id) => {
        logIdRef.current = id;
      }).catch(() => {});

      const count = await getUnreadCount();
      if (mountedRef.current) setUnreadCount(count);
    } catch (err) {
      if (__DEV__) console.warn('[Engagement] Milestone notification error:', err);
    }
  }, [userId, weareBottleneck, dayNumber]);

  useEffect(() => {
    mountedRef.current = true;
    sessionStartRef.current = Date.now();
    milestoneIndexRef.current = 0;

    loadNotification();

    // Milestone timer: check every 30 seconds if a new milestone has been reached
    const milestoneInterval = setInterval(() => {
      if (!mountedRef.current) return;
      if (milestoneIndexRef.current >= MILESTONES_MINUTES.length) return;

      const elapsedMinutes = (Date.now() - sessionStartRef.current) / (60 * 1000);
      const nextMilestone = MILESTONES_MINUTES[milestoneIndexRef.current];

      if (elapsedMinutes >= nextMilestone) {
        milestoneIndexRef.current += 1;
        showMilestoneNotification();
      }
    }, 30 * 1000); // Check every 30 seconds

    return () => {
      mountedRef.current = false;
      clearInterval(milestoneInterval);
    };
  }, [loadNotification, showMilestoneNotification]);

  // Dismiss handler
  const dismiss = useCallback(() => {
    if (!notification) return;

    setNotification(null);
    hasActiveNotificationRef.current = false;
    markHistoryDismissed(notification.id);
    setUnreadCount((c) => Math.max(c - 1, 0));

    // Log to DB
    if (logIdRef.current) {
      logNotificationDismissed(logIdRef.current).catch(() => {});
    }
  }, [notification]);

  // Tap handler
  const markTapped = useCallback(() => {
    if (!notification) return;

    hasActiveNotificationRef.current = false;
    markHistoryTapped(notification.id);
    setUnreadCount((c) => Math.max(c - 1, 0));

    // Log to DB
    if (logIdRef.current) {
      logNotificationTapped(logIdRef.current).catch(() => {});
    }
  }, [notification]);

  // Refresh handler
  const refresh = useCallback(() => {
    setLoading(true);
    setNotification(null);
    hasActiveNotificationRef.current = false;
    loadNotification();
  }, [loadNotification]);

  return {
    currentNotification: notification,
    unreadCount,
    dismiss,
    markTapped,
    refresh,
    loading,
  };
}
