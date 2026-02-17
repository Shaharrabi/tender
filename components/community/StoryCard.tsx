/**
 * StoryCard — Wes Anderson-styled community post card.
 *
 * Shows alias color dot + name, post content with warm quote styling,
 * category/phase badges, and three reaction buttons + report.
 *
 * Reactions:
 * - ♡ I resonate  (HeartIcon, toggle haptic)
 * - ✦ I feel seen (SparkleIcon, success haptic)
 * - ◈ I've been there (HandshakeIcon, tap haptic)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
} from '@/constants/theme';
import { CommunityColors, HEALING_PHASES } from '@/constants/community';
import { HeartIcon, SparkleIcon, HandshakeIcon, FlagIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { CommunityPost, ReactionType } from '@/types/community';

interface StoryCardProps {
  post: CommunityPost;
  onReaction: (postId: string, reactionType: ReactionType) => void;
  onReport: (postId: string) => void;
}

const REACTION_CONFIG = [
  {
    type: 'resonated' as ReactionType,
    label: 'Resonate',
    Icon: HeartIcon,
    activeColor: Colors.primary,
    countKey: 'resonatedCount' as const,
    hasKey: 'hasResonated' as const,
    hapticMethod: 'toggle' as const,
  },
  {
    type: 'felt_seen' as ReactionType,
    label: 'Seen',
    Icon: SparkleIcon,
    activeColor: '#D4A843', // warm gold
    countKey: 'feltSeenCount' as const,
    hasKey: 'hasFeltSeen' as const,
    hapticMethod: 'success' as const,
  },
  {
    type: 'been_there' as ReactionType,
    label: 'Been there',
    Icon: HandshakeIcon,
    activeColor: '#6BA3A0', // calm teal
    countKey: 'beenThereCount' as const,
    hasKey: 'hasBeenThere' as const,
    hapticMethod: 'tap' as const,
  },
] as const;

export function StoryCard({ post, onReaction, onReport }: StoryCardProps) {
  const haptics = useSoundHaptics();

  const handleReport = () => {
    haptics.tap();
    onReport(post.id);
  };

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  const aliasName = post.aliasName || 'Anonymous';
  const aliasColor = post.aliasColor || Colors.textMuted;

  return (
    <View style={st.card}>
      {/* Header: alias + time */}
      <View style={st.header}>
        <View style={st.aliasRow}>
          <View style={[st.aliasDot, { backgroundColor: aliasColor }]} />
          <Text style={st.aliasName}>{aliasName}</Text>
        </View>
        <Text style={st.time}>{timeAgo(post.createdAt)}</Text>
      </View>

      {/* Content with quote styling */}
      <View style={st.quoteBlock}>
        <Text style={st.content}>{post.content}</Text>
      </View>

      {/* Badges */}
      <View style={st.badgeRow}>
        <View style={st.categoryBadge}>
          <Text style={st.categoryBadgeText}>{post.category}</Text>
        </View>
        {post.healingPhase && (
          <View style={st.phaseBadge}>
            <Text style={st.phaseBadgeText}>
              {HEALING_PHASES.find((h) => h.key === post.healingPhase)?.label ?? post.healingPhase}
            </Text>
          </View>
        )}
      </View>

      {/* Footer: 3 reaction buttons + report */}
      <View style={st.footer}>
        <View style={st.reactionRow}>
          {REACTION_CONFIG.map((reaction) => {
            const isActive = post[reaction.hasKey] ?? false;
            const count = post[reaction.countKey] ?? 0;

            return (
              <TouchableOpacity
                key={reaction.type}
                style={[st.reactionBtn, isActive && { backgroundColor: reaction.activeColor + '15' }]}
                onPress={() => {
                  haptics[reaction.hapticMethod]();
                  onReaction(post.id, reaction.type);
                }}
                activeOpacity={0.7}
              >
                <reaction.Icon
                  size={13}
                  color={isActive ? reaction.activeColor : Colors.textMuted}
                />
                <Text
                  style={[
                    st.reactionText,
                    isActive && { color: reaction.activeColor, fontWeight: '600' },
                  ]}
                >
                  {count > 0 ? `${count}` : ''}{count > 0 ? ' ' : ''}{reaction.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleReport}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FlagIcon size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  card: {
    backgroundColor: CommunityColors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: CommunityColors.cardBorder,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: CommunityColors.cardShadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aliasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  aliasDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  aliasName: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  time: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  quoteBlock: {
    borderLeftWidth: 3,
    borderLeftColor: CommunityColors.quoteAccent,
    borderRadius: BorderRadius.sm,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: CommunityColors.cardBackground,
  },
  content: {
    fontSize: FontSizes.body,
    color: CommunityColors.warmDarkBrown,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  phaseBadge: {
    backgroundColor: Colors.secondary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  phaseBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  reactionRow: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: Colors.surface,
  },
  reactionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
