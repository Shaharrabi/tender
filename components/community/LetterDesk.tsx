/**
 * LetterDesk — Main content view for the Letters tab.
 *
 * Two sections:
 * 1. Write a Letter (top) — shows weekly prompt, CTA to compose
 * 2. Your Letters (bottom) — received letters as sealed/open LetterCards
 *
 * Reciprocity: user must write a letter before receiving one.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  ButtonSizes,
} from '@/constants/theme';
import { CommunityColors } from '@/constants/community';
import { MailboxIcon, PenIcon } from '@/assets/graphics/icons';
import { LetterCard } from './LetterCard';
import { EmptyState } from './EmptyState';
import type { CommunityLetter, WeeklyPrompt } from '@/types/community';

interface LetterDeskProps {
  weeklyPrompt: WeeklyPrompt | null;
  receivedLetters: CommunityLetter[];
  sentCount: number;
  loading: boolean;
  onCompose: () => void;
  onOpenLetter: (letterId: string) => void;
}

export function LetterDesk({
  weeklyPrompt,
  receivedLetters,
  sentCount,
  loading,
  onCompose,
  onOpenLetter,
}: LetterDeskProps) {
  const unreadCount = receivedLetters.filter((l) => !l.isRead).length;
  const hasWritten = sentCount > 0;

  return (
    <View style={st.container}>
      {/* ── Write Section ─────────────────────── */}
      <View style={st.writeSection}>
        <MailboxIcon size={28} color={CommunityColors.quoteAccent} />
        <Text style={st.writeTitle}>The Letter Desk</Text>
        <Text style={st.writeSubtitle}>
          Write a letter to someone who might need to hear it today.
        </Text>

        {weeklyPrompt && (
          <View style={st.promptPreview}>
            <Text style={st.promptLabel}>This week's prompt</Text>
            <Text style={st.promptText}>{`"${weeklyPrompt.promptText}"`}</Text>
          </View>
        )}

        <TouchableOpacity
          style={st.composeBtn}
          onPress={onCompose}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Write a letter"
        >
          <PenIcon size={16} color={Colors.textOnPrimary} />
          <Text style={st.composeBtnText}>Write a Letter</Text>
        </TouchableOpacity>
      </View>

      {/* ── Divider ──────────────────────────── */}
      <View style={st.divider} />

      {/* ── Received Letters Section ──────────── */}
      <View style={st.receivedSection}>
        <Text style={st.sectionTitle}>
          Your Letters
          {unreadCount > 0 && (
            <Text style={st.unreadBadge}> ({unreadCount} new)</Text>
          )}
        </Text>

        {loading ? (
          <ActivityIndicator style={st.loader} color={Colors.primary} />
        ) : !hasWritten ? (
          // Reciprocity gate: must write first
          <View style={st.reciprocityCard}>
            <MailboxIcon size={24} color={Colors.textMuted} />
            <Text style={st.reciprocityTitle}>Write one, receive one</Text>
            <Text style={st.reciprocityText}>
              Write your first letter to start receiving letters from the community.
              Each letter you write helps someone feel less alone.
            </Text>
          </View>
        ) : receivedLetters.length === 0 ? (
          <EmptyState
            Icon={MailboxIcon}
            title="No letters yet"
            subtitle="Your letter is finding its way to someone special. New letters arrive when they are ready."
          />
        ) : (
          receivedLetters.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              onOpen={onOpenLetter}
            />
          ))
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },

  // ── Write section ──
  writeSection: {
    backgroundColor: CommunityColors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: CommunityColors.cardBorder,
    padding: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
  },
  writeTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
  },
  writeSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  promptPreview: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    width: '100%',
  },
  promptLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  promptText: {
    fontSize: FontSizes.bodySmall,
    color: CommunityColors.warmDarkBrown,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  composeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    height: ButtonSizes.medium,
    borderRadius: 24,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    width: '100%',
  },
  composeBtnText: {
    color: Colors.textOnPrimary,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

  // ── Divider ──
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },

  // ── Received section ──
  receivedSection: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  unreadBadge: {
    color: Colors.primary,
    fontWeight: '600',
  },
  loader: {
    marginTop: Spacing.lg,
  },

  // ── Reciprocity card ──
  reciprocityCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  reciprocityTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  reciprocityText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
