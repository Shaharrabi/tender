/**
 * LetterInbox — Received and sent dating letters.
 *
 * Shows letters split into Received / Sent tabs.
 * Marks letters as read on open. Displays sender alias
 * from their dating profile constellation.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, FontSizes } from '@/constants/theme';
import { ARCHETYPE_MAP } from '@/constants/dating/archetypes';
import { supabase } from '@/services/supabase';
import { getLettersForUser, markLetterRead, getProfilesByUserIds } from '@/services/dating';
import type { DatingLetter, DatingProfile } from '@/types/dating';

interface LetterInboxProps {
  userId: string;
  onBack: () => void;
}

type InboxTab = 'received' | 'sent';

export default function LetterInbox({ userId, onBack }: LetterInboxProps) {
  const [tab, setTab] = useState<InboxTab>('received');
  const [letters, setLetters] = useState<DatingLetter[]>([]);
  const [profileMap, setProfileMap] = useState<Record<string, DatingProfile>>({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadLetters = useCallback(async () => {
    try {
      const allLetters = await getLettersForUser(userId);
      setLetters(allLetters);

      // Fetch profiles for all senders/recipients to get aliases
      const otherUserIds = new Set<string>();
      allLetters.forEach((l) => {
        if (l.senderId !== userId) otherUserIds.add(l.senderId);
        if (l.recipientId !== userId) otherUserIds.add(l.recipientId);
      });

      if (otherUserIds.size > 0) {
        const profiles = await getProfilesByUserIds(Array.from(otherUserIds));
        const map: Record<string, DatingProfile> = {};
        profiles.forEach((p) => { map[p.userId] = p; });
        setProfileMap(map);
      }
    } catch (err) {
      console.error('Failed to load letters:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadLetters();
  }, [loadLetters]);

  // Realtime: listen for new incoming letters
  useEffect(() => {
    const channel = supabase
      .channel('dating-letters-inbox')
      .on(
        'postgres_changes' as any,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dating_letters',
          filter: `recipient_id=eq.${userId}`,
        },
        () => {
          // Reload letters when a new one arrives
          loadLetters();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadLetters]);

  const received = letters.filter((l) => l.recipientId === userId);
  const sent = letters.filter((l) => l.senderId === userId);
  const displayLetters = tab === 'received' ? received : sent;
  const unreadCount = received.filter((l) => !l.isRead).length;

  const getAlias = useCallback((otherUserId: string): string => {
    const profile = profileMap[otherUserId];
    if (!profile?.constellation?.topTraits?.[0]) return 'A Stranger';
    const topTrait = profile.constellation.topTraits[0];
    return ARCHETYPE_MAP[topTrait]?.name || 'A Traveler';
  }, [profileMap]);

  const handleExpand = useCallback(async (letter: DatingLetter) => {
    if (expandedId === letter.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(letter.id);

    // Mark as read if it's a received unread letter
    if (letter.recipientId === userId && !letter.isRead) {
      try {
        await markLetterRead(letter.id);
        setLetters((prev) =>
          prev.map((l) => (l.id === letter.id ? { ...l, isRead: true } : l)),
        );
      } catch (err) {
        console.error('Failed to mark letter read:', err);
      }
    }
  }, [expandedId, userId]);

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your letters...</Text>
      </View>
    );
  }

  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} accessibilityRole="button" accessibilityLabel="Back to discover">
          <Text style={styles.backText}>{'\u2190'} Discover</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Letters</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'received' && styles.tabButtonActive]}
          onPress={() => setTab('received')}
          accessibilityRole="button"
          accessibilityState={{ selected: tab === 'received' }}
        >
          <Text style={[styles.tabLabel, tab === 'received' && styles.tabLabelActive]}>
            Received
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'sent' && styles.tabButtonActive]}
          onPress={() => setTab('sent')}
          accessibilityRole="button"
          accessibilityState={{ selected: tab === 'sent' }}
        >
          <Text style={[styles.tabLabel, tab === 'sent' && styles.tabLabelActive]}>
            Sent
          </Text>
        </TouchableOpacity>
      </View>

      {/* Letters List */}
      {displayLetters.length === 0 ? (
        <Animated.View entering={FadeIn.duration(400)} style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {tab === 'received' ? 'No Letters Yet' : 'No Sent Letters'}
          </Text>
          <Text style={styles.emptyDesc}>
            {tab === 'received'
              ? 'When someone resonates with your constellation, their letter will arrive here.'
              : 'Discover profiles and send your first letter. Say something real.'}
          </Text>
        </Animated.View>
      ) : (
        <View style={styles.lettersList}>
          {displayLetters.map((letter, i) => {
            const otherUserId = tab === 'received' ? letter.senderId : letter.recipientId;
            const alias = getAlias(otherUserId);
            const isExpanded = expandedId === letter.id;
            const isUnread = tab === 'received' && !letter.isRead;

            return (
              <Animated.View key={letter.id} entering={FadeInDown.delay(i * 80).duration(300)}>
                <TouchableOpacity
                  style={[styles.letterCard, isUnread && styles.letterCardUnread]}
                  onPress={() => handleExpand(letter)}
                  accessibilityRole="button"
                  accessibilityLabel={`Letter ${tab === 'received' ? 'from' : 'to'} ${alias}`}
                >
                  <View style={styles.letterHeader}>
                    <View>
                      <Text style={[styles.letterAlias, isUnread && styles.letterAliasUnread]}>
                        {tab === 'received' ? `From ${alias}` : `To ${alias}`}
                      </Text>
                      <Text style={styles.letterDate}>{formatDate(letter.sentAt)}</Text>
                    </View>
                    {isUnread && <View style={styles.unreadDot} />}
                  </View>

                  {isExpanded ? (
                    <Animated.View entering={FadeIn.duration(200)}>
                      <Text style={styles.letterContent}>{letter.content}</Text>
                      {letter.expired && (
                        <Text style={styles.expiredNote}>Reply window has closed</Text>
                      )}
                    </Animated.View>
                  ) : (
                    <Text style={styles.letterPreview} numberOfLines={2}>
                      {letter.content}
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 14,
    color: Colors.primary,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: '#3D3530',
  },
  headerSpacer: {
    width: 70,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  tabButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  tabLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.primary,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: 'Jost_500Medium',
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: Colors.text,
  },
  emptyDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  lettersList: {
    gap: Spacing.sm,
  },
  letterCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
  },
  letterCardUnread: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: Colors.primaryFaded,
  },
  letterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  letterAlias: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 14,
    color: '#3D3530',
  },
  letterAliasUnread: {
    fontFamily: 'JosefinSans_600SemiBold',
    color: Colors.primaryDark,
  },
  letterDate: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  letterPreview: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  letterContent: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 14,
    color: '#3D3530',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  expiredNote: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: 11,
    color: '#C4836A',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
