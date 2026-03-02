/**
 * NotificationFeedCard — Card for the notification feed list.
 *
 * Vertical card with category pill, timestamp, title, body,
 * and optional source citation. Category-colored left border.
 * Matches InsightCarousel card aesthetic in a taller layout.
 */

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { CATEGORY_CONFIG, ENGAGEMENT_PROMPTS } from '@/constants/engagement-prompts';
import type { NotificationCategory } from '@/types/notifications';

// ─── Props ──────────────────────────────────────────

interface NotificationFeedCardProps {
  promptId: string;
  category: NotificationCategory;
  shownAt: string;
  dismissed: boolean;
  tapped: boolean;
}

// ─── Helpers ────────────────────────────────────────

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Component ──────────────────────────────────────

export default function NotificationFeedCard({
  promptId,
  category,
  shownAt,
  dismissed,
  tapped,
}: NotificationFeedCardProps) {
  const router = useRouter();

  // Look up the prompt data from the static pool
  const prompt = ENGAGEMENT_PROMPTS.find((p) => p.id === promptId);
  const catConfig = CATEGORY_CONFIG.find((c) => c.id === category);

  if (!prompt || !catConfig) return null;

  const Icon = prompt.icon;
  const accentColor = prompt.accentColor || catConfig.accentColor;
  const isRead = dismissed || tapped;
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    if (prompt.actionRoute) {
      router.push(prompt.actionRoute as any);
    } else {
      // Toggle expanded to show full text
      setExpanded((prev) => !prev);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: accentColor },
        isRead && styles.cardRead,
        pressed ? styles.cardPressed : undefined,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${catConfig.label} notification: ${prompt.title}`}
      accessibilityState={{ expanded }}
    >
      {/* Header row: icon + category pill + timestamp */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Icon size={16} color={accentColor} />
          <View style={[styles.categoryPill, { backgroundColor: accentColor + '1A' }]}>
            <Text style={[styles.categoryText, { color: accentColor }]}>
              {catConfig.label}
            </Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{formatTimestamp(shownAt)}</Text>
      </View>

      {/* Title */}
      <Text style={[styles.title, isRead && styles.titleRead]} numberOfLines={1}>
        {prompt.title}
      </Text>

      {/* Body */}
      <Text style={styles.body} numberOfLines={expanded ? undefined : 3}>
        {prompt.body}
      </Text>

      {/* Source (science drops) */}
      {prompt.source && (
        <Text style={styles.source} numberOfLines={expanded ? undefined : 1}>
          {prompt.source}
        </Text>
      )}

      {/* Action hint */}
      {prompt.actionRoute ? (
        <Text style={[styles.actionHint, { color: accentColor }]}>
          Tap to explore
        </Text>
      ) : !expanded ? (
        <Text style={[styles.actionHint, { color: Colors.textMuted }]}>
          Tap to read more
        </Text>
      ) : null}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  cardRead: {
    opacity: 0.7,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  categoryPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  categoryText: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  timestamp: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
    marginBottom: 2,
  },
  titleRead: {
    color: Colors.textSecondary,
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
  actionHint: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    marginTop: Spacing.sm,
  },
});
