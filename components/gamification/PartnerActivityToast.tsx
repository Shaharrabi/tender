/**
 * PartnerActivityToast — Soft popup that slides in from the top
 * when the partner has done something.
 *
 * Small, dismissible, warm colors, our emoji style.
 * Shows at most one activity at a time; auto-dismisses after 6s.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getPendingActivities, markActivitySeen, type PartnerActivity } from '@/services/partner-activity';
import { Colors, Spacing, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';

const ACTIVITY_MESSAGES: Record<string, { emoji: string; text: (data: any) => string }> = {
  step_reflection: {
    emoji: '🌱',
    text: (d) => `Your partner completed Step ${d.stepNumber ?? ''}`,
  },
  practice_complete: {
    emoji: '✨',
    text: () => 'Your partner finished a practice',
  },
  checkin: {
    emoji: '💛',
    text: () => 'Your partner submitted their weekly check-in',
  },
  assessment_complete: {
    emoji: '🔮',
    text: (d) => `Your partner completed an assessment`,
  },
  portrait_update: {
    emoji: '🎨',
    text: () => 'Your partner\'s portrait was updated',
  },
};

export function PartnerActivityToast() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [activity, setActivity] = useState<PartnerActivity | null>(null);
  const slideAnim = useRef(new Animated.Value(-120)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -120, duration: 300, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      if (activity) {
        markActivitySeen(activity.id).catch(() => {});
      }
      setActivity(null);
    });
  }, [activity]);

  // Poll for activities every 30s
  useEffect(() => {
    if (!userId) return;

    const check = async () => {
      try {
        const pending = await getPendingActivities(userId);
        if (pending.length > 0 && !activity) {
          setActivity(pending[0]);
        }
      } catch {}
    };

    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [userId, activity]);

  // Animate in when activity appears
  useEffect(() => {
    if (!activity) return;

    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 40, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    // Auto-dismiss after 6 seconds
    dismissTimer.current = setTimeout(dismiss, 6000);
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [activity]);

  if (!activity) return null;

  const msg = ACTIVITY_MESSAGES[activity.activityType];
  if (!msg) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toast}
        onPress={dismiss}
        activeOpacity={0.9}
        accessibilityRole="alert"
        accessibilityLabel={`${msg.text(activity.activityData)}. Tap to dismiss.`}
      >
        <Text style={styles.emoji}>{msg.emoji}</Text>
        <Text style={styles.text} numberOfLines={2}>
          {msg.text(activity.activityData)}
        </Text>
        <TouchableOpacity onPress={dismiss} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  emoji: {
    fontSize: 20,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontFamily: FontFamilies.body,
    color: Colors.text,
    lineHeight: 18,
  },
  close: {
    fontSize: 14,
    color: Colors.textMuted,
    paddingLeft: Spacing.sm,
  },
});
