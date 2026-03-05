/**
 * Notification Feed — History of all engagement notifications.
 *
 * Shows all past notifications grouped by date (Today, Yesterday,
 * This Week, Earlier). Each card links to its actionRoute when available.
 * Empty state shown when no notifications have been delivered yet.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Typography,
} from '@/constants/theme';
import { ArrowLeftIcon, SparkleIcon } from '@/assets/graphics/icons';
import { NotificationFeedCard } from '@/components/notifications';
import { getHistory } from '@/utils/notification-selector';
import type { NotificationCategory } from '@/types/notifications';

// ─── Types ──────────────────────────────────────────

interface HistoryEntry {
  promptId: string;
  category: NotificationCategory;
  shownAt: string;
  dismissed: boolean;
  tapped: boolean;
}

interface GroupedNotifications {
  label: string;
  entries: HistoryEntry[];
}

// ─── Helpers ────────────────────────────────────────

function groupByDate(entries: HistoryEntry[]): GroupedNotifications[] {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const today: HistoryEntry[] = [];
  const yesterdayGroup: HistoryEntry[] = [];
  const thisWeek: HistoryEntry[] = [];
  const earlier: HistoryEntry[] = [];

  for (const entry of entries) {
    const dateStr = entry.shownAt.slice(0, 10);
    const date = new Date(entry.shownAt);

    if (dateStr === todayStr) {
      today.push(entry);
    } else if (dateStr === yesterdayStr) {
      yesterdayGroup.push(entry);
    } else if (date > weekAgo) {
      thisWeek.push(entry);
    } else {
      earlier.push(entry);
    }
  }

  const groups: GroupedNotifications[] = [];
  if (today.length > 0) groups.push({ label: 'Today', entries: today });
  if (yesterdayGroup.length > 0) groups.push({ label: 'Yesterday', entries: yesterdayGroup });
  if (thisWeek.length > 0) groups.push({ label: 'This Week', entries: thisWeek });
  if (earlier.length > 0) groups.push({ label: 'Earlier', entries: earlier });

  return groups;
}

// ─── Component ──────────────────────────────────────

export default function NotificationFeedScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const data = await getHistory();
      setHistory(data as HistoryEntry[]);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const groups = groupByDate(history);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <ArrowLeftIcon size={20} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} size="small" accessibilityLabel="Loading" />
        </View>
      ) : groups.length === 0 ? (
        /* Empty state */
        <Animated.View entering={FadeIn.duration(400)} style={styles.emptyContainer}>
          <SparkleIcon size={48} color={Colors.primaryLight} />
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySubtitle}>
            Personalized tips, science drops, and celebrations will appear here as you use Tender.
          </Text>
        </Animated.View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {groups.map((group) => (
            <View key={group.label} style={styles.groupContainer}>
              <Text style={styles.groupLabel}>{group.label}</Text>
              {group.entries.map((entry, index) => (
                <NotificationFeedCard
                  key={`${entry.promptId}-${index}`}
                  promptId={entry.promptId}
                  category={entry.category as NotificationCategory}
                  shownAt={entry.shownAt}
                  dismissed={entry.dismissed}
                  tapped={entry.tapped}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.scrollPadBottom,
  },
  groupContainer: {
    marginBottom: Spacing.lg,
  },
  groupLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSizes.bodySmall * 1.5,
  },
});
