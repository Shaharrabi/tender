/**
 * SectionSummaryHeader — Warm summary + estimated read time for dense tabs.
 *
 * Each portrait tab currently opens with data (bars, lens cards, patterns).
 * This component adds a warm 1-2 sentence orientation at the top:
 * "What you'll find here" + estimated read time + optional "Skip to..." links.
 *
 * Gives users a GPS before the depth.
 *
 * Verified: Colors.backgroundAlt='#FAF0E6', Typography.body, Typography.caption
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { HourglassIcon } from '@/assets/graphics/icons';

interface SectionSummaryHeaderProps {
  /** Warm summary of what this section contains */
  summary: string;
  /** Estimated time to read this section */
  readMinutes?: number;
  /** Section accent color */
  accentColor?: string;
}

export default function SectionSummaryHeader({
  summary,
  readMinutes,
  accentColor = Colors.primary,
}: SectionSummaryHeaderProps) {
  return (
    <View style={[styles.container, { borderLeftColor: accentColor }]}>
      <TenderText variant="body" color={Colors.textSecondary} style={styles.summary}>
        {summary}
      </TenderText>
      {readMinutes != null && (
        <View style={styles.readTimeRow}>
          <HourglassIcon size={11} color={Colors.textMuted} />
          <TenderText variant="caption" color={Colors.textMuted}>
            ~{readMinutes} min read
          </TenderText>
        </View>
      )}
    </View>
  );
}

/** Pre-built summaries for each portrait tab */
export const TAB_SUMMARIES: Record<string, { summary: string; readMinutes: number }> = {
  overview: {
    summary: 'The big picture \u2014 your relational score, your strengths, your growth edges, and what it all means for your daily life.',
    readMinutes: 3,
  },
  scores: {
    summary: 'Seven dimensions that shape how you connect. Each one is a dial you can adjust \u2014 not a fixed trait.',
    readMinutes: 4,
  },
  lenses: {
    summary: 'Four perspectives that together form your complete relational picture: how you attach, your inner parts, your regulation capacity, and what you value most.',
    readMinutes: 6,
  },
  cycle: {
    summary: 'Your negative cycle \u2014 the dance you fall into under stress. Seeing it clearly is the first step to choosing differently.',
    readMinutes: 4,
  },
  growth: {
    summary: 'Your personalized growth plan \u2014 prioritized edges, recommended practices, and a phased pathway forward.',
    readMinutes: 5,
  },
  anchors: {
    summary: 'Phrases for difficult moments, a guide for your partner, and the words you need when you forget everything else.',
    readMinutes: 4,
  },
  matrix: {
    summary: 'Your interactive assessment map \u2014 see how attachment, personality, regulation, conflict style, values, and differentiation all connect.',
    readMinutes: 5,
  },
};

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  summary: {
    lineHeight: 24,
    marginBottom: Spacing.xs,
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
