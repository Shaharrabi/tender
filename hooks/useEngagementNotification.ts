/**
 * useEngagementNotification — React hook for the engagement notification system.
 *
 * Orchestrates notification selection, display state, dismiss/tap tracking,
 * and unread count. Used by HomeNotificationLayer to render banners.
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
} from '@/utils/notification-selector';
import {
  logNotificationShown,
  logNotificationDismissed,
  logNotificationTapped,
} from '@/services/engagement-notifications';

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

  // Load notification on mount
  const loadNotification = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Reset session flag on mount (new screen visit)
      await resetSessionFlag();

      // Check rate limits
      const canShow = await shouldShowNotification();
      if (!canShow) {
        setNotification(null);
        setLoading(false);
        return;
      }

      // Select a notification
      const selected = await selectNotification(weareBottleneck, dayNumber);
      if (!mountedRef.current) return;

      if (selected) {
        setNotification(selected);

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
      }

      // Update unread count
      const count = await getUnreadCount();
      if (mountedRef.current) setUnreadCount(count);
    } catch (err) {
      if (__DEV__) console.warn('[Engagement] Hook error:', err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [userId, weareBottleneck, dayNumber]);

  useEffect(() => {
    mountedRef.current = true;
    loadNotification();

    // Delayed retry: if no notification was shown on mount,
    // try again after 5 minutes for users who stay on the app.
    const retryTimer = setTimeout(async () => {
      if (!mountedRef.current) return;
      // Only retry if we didn't already show a notification
      if (notification) return;
      if (!userId) return;

      try {
        const canShow = await shouldShowNotification();
        if (!canShow || !mountedRef.current) return;

        const selected = await selectNotification(weareBottleneck, dayNumber);
        if (!mountedRef.current || !selected) return;

        setNotification(selected);
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
        if (__DEV__) console.warn('[Engagement] Retry error:', err);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      mountedRef.current = false;
      clearTimeout(retryTimer);
    };
  }, [loadNotification]);

  // Dismiss handler
  const dismiss = useCallback(() => {
    if (!notification) return;

    setNotification(null);
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
