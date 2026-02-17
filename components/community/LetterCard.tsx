/**
 * LetterCard — Envelope-style card for received letters.
 *
 * Two states:
 * - Sealed: shows "From: Alias Name" with envelope icon, tap to open
 * - Open: shows full letter content with warm styling
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
} from '@/constants/theme';
import { CommunityColors } from '@/constants/community';
import { MailboxIcon, EyeIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { CommunityLetter } from '@/types/community';

interface LetterCardProps {
  letter: CommunityLetter;
  onOpen: (letterId: string) => void;
}

export function LetterCard({ letter, onOpen }: LetterCardProps) {
  const haptics = useSoundHaptics();
  const [isOpen, setIsOpen] = useState(letter.isRead);

  const aliasName = letter.authorAliasName || 'A fellow traveler';
  const aliasColor = letter.authorAliasColor || Colors.textMuted;

  const handleOpen = () => {
    if (!isOpen) {
      haptics.pageTurn();
      setIsOpen(true);
      onOpen(letter.id);
    }
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

  if (!isOpen) {
    // ── Sealed envelope ──
    return (
      <TouchableOpacity
        style={st.sealedCard}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <MailboxIcon size={24} color={CommunityColors.quoteAccent} />
        <View style={st.sealedContent}>
          <View style={st.sealedHeader}>
            <View style={[st.aliasDot, { backgroundColor: aliasColor }]} />
            <Text style={st.sealedFrom}>From: {aliasName}</Text>
          </View>
          <Text style={st.sealedHint}>Tap to open this letter</Text>
        </View>
        {!letter.isRead && <View style={st.unreadDot} />}
      </TouchableOpacity>
    );
  }

  // ── Open letter ──
  return (
    <View style={st.openCard}>
      {/* Header */}
      <View style={st.openHeader}>
        <View style={st.aliasRow}>
          <View style={[st.aliasDot, { backgroundColor: aliasColor }]} />
          <Text style={st.openFrom}>{aliasName}</Text>
        </View>
        <Text style={st.openTime}>
          {letter.deliveredAt ? timeAgo(letter.deliveredAt) : timeAgo(letter.createdAt)}
        </Text>
      </View>

      {/* Letter content */}
      <View style={st.letterBody}>
        <Text style={st.salutation}>Dear fellow traveler,</Text>
        <Text style={st.letterContent}>{letter.content}</Text>
      </View>

      {/* Read indicator */}
      <View style={st.readRow}>
        <EyeIcon size={12} color={Colors.textMuted} />
        <Text style={st.readText}>Read</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  // ── Sealed card ──
  sealedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: CommunityColors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: CommunityColors.cardBorder,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: CommunityColors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sealedContent: {
    flex: 1,
    gap: 2,
  },
  sealedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sealedFrom: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: CommunityColors.warmDarkBrown,
  },
  sealedHint: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  // ── Open card ──
  openCard: {
    backgroundColor: CommunityColors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: CommunityColors.cardBorder,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    shadowColor: CommunityColors.cardShadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: Spacing.md,
  },
  openHeader: {
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
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  openFrom: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  openTime: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },

  // ── Letter body ──
  letterBody: {
    borderLeftWidth: 3,
    borderLeftColor: CommunityColors.quoteAccent,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  salutation: {
    fontSize: FontSizes.bodySmall,
    color: CommunityColors.warmDarkBrown,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  letterContent: {
    fontSize: FontSizes.body,
    color: CommunityColors.warmDarkBrown,
    lineHeight: 24,
  },
  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  readText: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
});
