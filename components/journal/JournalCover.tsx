/**
 * JournalCover — Online journal header for the Journal screen.
 *
 * Wes Anderson aesthetic with lobby blue accent: warm parchment,
 * geometric typography (no italics), blue accents. Feels like
 * an elegant online journal, not a physical book.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { JournalStats } from '@/services/journal';

// ─── Blue accent color for journal ─────────────────────
const JOURNAL_BLUE = Colors.secondary; // #7294D4 — Lobby Blue

interface JournalCoverProps {
  displayName: string;
  stats: JournalStats | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function JournalCover({ displayName, stats }: JournalCoverProps) {
  const name = displayName || 'Your';
  const possessive = name.endsWith('s') ? `${name}'` : `${name}'s`;

  return (
    <View style={styles.cover}>
      {/* Decorative top line — blue */}
      <View style={styles.topAccent} />

      {/* Title section */}
      <View style={styles.titleSection}>
        <Text style={styles.ownerName}>{possessive}</Text>
        <Text style={styles.journalTitle}>Relationship Journal</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>A record of growth, reflection & connection</Text>
      </View>

      {/* Stats section */}
      {stats && stats.totalEntries > 0 ? (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalDays}</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalEntries}</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          {stats.firstEntryDate && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statDate}>{formatDate(stats.firstEntryDate)}</Text>
                <Text style={styles.statLabel}>Since</Text>
              </View>
            </>
          )}
        </View>
      ) : (
        <View style={styles.emptyStats}>
          <Text style={styles.emptyStatsText}>
            Your journal begins with your first entry
          </Text>
        </View>
      )}

      {/* Decorative bottom line */}
      <View style={styles.bottomAccent} />
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Shadows.card,
  },

  topAccent: {
    width: 60,
    height: 2,
    backgroundColor: JOURNAL_BLUE,
    borderRadius: 1,
    marginBottom: Spacing.xl,
  },

  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  ownerName: {
    fontFamily: 'Jost_600SemiBold',
    fontSize: 24,
    letterSpacing: 1.2,
    lineHeight: 32,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  journalTitle: {
    fontFamily: 'Jost_400Regular',
    fontSize: 20,
    color: JOURNAL_BLUE,
    letterSpacing: 1,
    lineHeight: 28,
  },
  divider: {
    width: 40,
    height: 1.5,
    backgroundColor: JOURNAL_BLUE,
    marginVertical: Spacing.md,
    borderRadius: 1,
  },
  subtitle: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 50,
  },
  statNumber: {
    fontFamily: 'Jost_700Bold',
    fontSize: 28,
    color: JOURNAL_BLUE,
    lineHeight: 34,
  },
  statDate: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.text,
    lineHeight: 18,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.borderLight,
  },

  // Empty state
  emptyStats: {
    paddingVertical: Spacing.sm,
  },
  emptyStatsText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  bottomAccent: {
    width: 40,
    height: 1.5,
    backgroundColor: Colors.borderLight,
    borderRadius: 1,
    marginTop: Spacing.xl,
  },
});
