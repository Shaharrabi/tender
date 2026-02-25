/**
 * NotificationBanner — Dismissible engagement notification card.
 *
 * Displays a single engagement prompt as a card with a category-colored
 * left border, icon, title, body, and dismiss button. Tappable when the
 * prompt has an actionRoute. Matches the InsightCarousel aesthetic.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { CloseIcon } from '@/assets/graphics/icons';
import { CATEGORY_CONFIG } from '@/constants/engagement-prompts';
import type { EngagementPrompt } from '@/types/notifications';

// ─── Props ──────────────────────────────────────────

interface NotificationBannerProps {
  notification: EngagementPrompt;
  onDismiss: () => void;
  onTap: () => void;
}

// ─── Component ──────────────────────────────────────

export default function NotificationBanner({
  notification,
  onDismiss,
  onTap,
}: NotificationBannerProps) {
  const router = useRouter();
  const Icon = notification.icon;
  const catConfig = CATEGORY_CONFIG.find((c) => c.id === notification.category);
  const accentColor = notification.accentColor || catConfig?.accentColor || Colors.primary;

  const handlePress = useCallback(() => {
    onTap();
    if (notification.actionRoute) {
      router.push(notification.actionRoute as any);
    }
  }, [notification.actionRoute, onTap, router]);

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(200)}
      exiting={FadeOut.duration(200)}
      style={styles.wrapper}
    >
      <Pressable
        onPress={handlePress}
        disabled={!notification.actionRoute}
        style={({ pressed }) => [
          styles.card,
          { borderLeftColor: accentColor },
          notification.actionRoute ? styles.cardTappable : undefined,
          pressed ? styles.cardPressed : undefined,
        ]}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Icon size={22} color={accentColor} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Category pill */}
          <View style={[styles.categoryPill, { backgroundColor: accentColor + '1A' }]}>
            <Text style={[styles.categoryText, { color: accentColor }]}>
              {catConfig?.label || notification.category}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {notification.title}
          </Text>
          <Text style={styles.body}>
            {notification.body}
          </Text>

          {/* Source citation (science drops) */}
          {notification.source && (
            <Text style={styles.source} numberOfLines={1}>
              {notification.source}
            </Text>
          )}
        </View>

        {/* Dismiss button */}
        <Pressable
          onPress={onDismiss}
          hitSlop={12}
          style={styles.dismissButton}
        >
          <CloseIcon size={14} color={Colors.textMuted} />
        </Pressable>

        {/* Action chevron */}
        {notification.actionRoute && (
          <Text style={styles.chevron}>{'›'}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...Shadows.card,
  },
  cardTappable: {
    // Subtle cursor hint on web
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.xs,
  },
  categoryText: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
    marginBottom: 2,
  },
  body: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: FontSizes.bodySmall * 1.4,
  },
  source: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  dismissButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
  chevron: {
    fontSize: FontSizes.headingL,
    color: Colors.textMuted,
    marginLeft: Spacing.xs,
  },
});
