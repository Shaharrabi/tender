/**
 * usePartnerActivityRealtime — Supabase Realtime subscription for partner activity.
 *
 * Subscribes to INSERT events on the `partner_activity` table filtered to
 * the current user as recipient. When a new row arrives (meaning the partner
 * did something), fires a local notification via expo-notifications so the
 * user gets a timely heads-up even if the app is in the background.
 *
 * Mount this once in HomeNotificationLayer or the app layout — it manages
 * its own lifecycle and cleans up on unmount.
 */

import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { supabase } from '@/services/supabase';
import { getPartnerProfile } from '@/services/couples';
import { schedulePartnerActivityNotification } from '@/services/notifications';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribe to partner_activity inserts for the given user.
 * @param userId — the authenticated user's ID (recipient side).
 */
export function usePartnerActivityRealtime(userId: string | undefined): void {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const partnerNameRef = useRef<string | null>(null);

  // Pre-fetch partner name so we have it ready for notifications
  useEffect(() => {
    if (!userId) return;

    getPartnerProfile(userId)
      .then((profile) => {
        partnerNameRef.current = profile?.display_name ?? null;
      })
      .catch(() => {
        // Best-effort — fallback to "Your partner"
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const channelName = `partner-activity:${userId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'partner_activity',
          filter: `recipient_user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as Record<string, any>;

          const partnerName = partnerNameRef.current ?? 'Your partner';
          const activityType: string = row.activity_type ?? 'unknown';
          const activityData: Record<string, any> = row.activity_data ?? {};

          // Fire local notification (best-effort, non-blocking)
          schedulePartnerActivityNotification({
            type: activityType,
            partnerName,
            details: activityData.assessmentName ?? activityData.name ?? undefined,
          }).catch(() => {
            // Notification failure should never propagate
          });

          if (__DEV__) {
            console.log(
              `[PartnerActivityRealtime] New activity: ${activityType} from partner`,
            );
          }
        },
      )
      .subscribe((status) => {
        if (__DEV__) {
          console.log(`[PartnerActivityRealtime] Subscription status: ${status}`);
        }
      });

    channelRef.current = channel;

    // Re-subscribe when app comes back to foreground
    const handleAppState = (state: AppStateStatus) => {
      if (state === 'active' && channelRef.current) {
        // Supabase client auto-reconnects, but we log for debug visibility
        if (__DEV__) {
          console.log('[PartnerActivityRealtime] App foregrounded — channel active');
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppState);

    return () => {
      subscription.remove();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId]);
}
