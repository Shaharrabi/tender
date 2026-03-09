/**
 * ScoreStoryToggle — Numbers vs Story mode for the Scores tab.
 *
 * "Numbers" = existing AnimatedScoreBar visuals (unchanged)
 * "Story" = warm narrative prose generated from the same CompositeScores
 *
 * This component only renders the STORY mode. The parent (ScoresTab)
 * conditionally shows either the existing bars OR this component
 * based on the toggle state.
 *
 * Verified: Colors.backgroundAlt='#FAF0E6', Colors.surfaceElevated='#FFF8F2'
 *   Colors.accent='#D8A499' (Warm Terracotta for low scores)
 *   Colors.success='#6B9080' (Muted Sage for strengths)
 *   TenderText variant="body" → JosefinSans_300Light 16px
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { CompositeScores } from '@/types/portrait';
import { BookOpenIcon, ChartBarIcon } from '@/assets/graphics/icons';

// ─── Toggle Component ───────────────────────────────────

interface ScoreViewToggleProps {
  mode: 'numbers' | 'story';
  onToggle: (mode: 'numbers' | 'story') => void;
}

export function ScoreViewToggle({ mode, onToggle }: ScoreViewToggleProps) {
  return (
    <View style={styles.toggleContainer}>
      {(['story', 'numbers'] as const).map((m) => (
        <TouchableOpacity
          key={m}
          onPress={() => onToggle(m)}
          style={[styles.toggleOption, mode === m && styles.toggleOptionActive]}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: mode === m }}
        >
          <View style={styles.toggleInner}>
            {m === 'story'
              ? <BookOpenIcon size={13} color={mode === m ? Colors.text : Colors.textMuted} />
              : <ChartBarIcon size={13} color={mode === m ? Colors.text : Colors.textMuted} />}
            <TenderText
              variant="caption"
              color={mode === m ? Colors.text : Colors.textMuted}
              style={mode === m ? styles.toggleTextActive : undefined}
            >
              {m === 'story' ? 'Story' : 'Numbers'}
            </TenderText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Story Mode Content ─────────────────────────────────

interface ScoreStoryProps {
  compositeScores: CompositeScores;
}

function strengthPhrase(label: string, value: number): string {
  if (value >= 70) return `strong at ${label.toLowerCase()}`;
  if (value >= 55) return `solid at ${label.toLowerCase()}`;
  if (value >= 40) return `building ${label.toLowerCase()}`;
  return `growing in ${label.toLowerCase()}`;
}

function generateScoreStory(cs: CompositeScores): string[] {
  const paragraphs: string[] = [];

  // A.R.E. paragraph
  const areLabels = [
    { label: 'showing up', value: cs.engagement },
    { label: 'tuning in', value: cs.responsiveness },
    { label: 'being emotionally reachable', value: cs.accessibility },
  ].sort((a, b) => b.value - a.value);

  paragraphs.push(
    `You\u2019re ${strengthPhrase(areLabels[0].label, areLabels[0].value)} (${areLabels[0].value}), ` +
    `${strengthPhrase(areLabels[1].label, areLabels[1].value)} (${areLabels[1].value}), ` +
    `and ${strengthPhrase(areLabels[2].label, areLabels[2].value)} (${areLabels[2].value}). ` +
    `These three together form your attachment quality \u2014 how safe your partner feels with you.`
  );

  // Regulation paragraph
  if (cs.regulationScore < 50 || cs.windowWidth < 50) {
    paragraphs.push(
      `Your window of tolerance narrows under pressure (Regulation: ${cs.regulationScore}, Window: ${cs.windowWidth}). ` +
      `That narrow window is why small triggers can feel enormous \u2014 and why you might retreat or react before you mean to. ` +
      `This is your biggest leverage point. Widening it changes everything downstream.`
    );
  } else {
    paragraphs.push(
      `Your regulation capacity is a real asset (${cs.regulationScore}). You can hold complexity under stress, ` +
      `which means your partner can lean on you when things get hard. Your window (${cs.windowWidth}) gives you room to stay present.`
    );
  }

  // Self-leadership + values paragraph
  const slPhrase = cs.selfLeadership >= 60
    ? `You can observe some of your patterns while they\u2019re happening (${cs.selfLeadership})`
    : `Your protector parts still tend to hijack you under pressure (${cs.selfLeadership})`;

  const valPhrase = cs.valuesCongruence >= 60
    ? `and you\u2019re living reasonably close to what matters to you (${cs.valuesCongruence}).`
    : `and there\u2019s a gap between what you value and how you act in conflict moments (${cs.valuesCongruence}).`;

  paragraphs.push(`${slPhrase}, ${valPhrase}`);

  return paragraphs;
}

export function ScoreStoryContent({ compositeScores }: ScoreStoryProps) {
  const paragraphs = generateScoreStory(compositeScores);

  return (
    <View style={styles.storyCard}>
      {paragraphs.map((p, i) => (
        <TenderText key={i} variant="body" color={Colors.textSecondary} style={styles.storyParagraph}>
          {p}
        </TenderText>
      ))}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: Spacing.md,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  toggleOptionActive: {
    backgroundColor: Colors.white,
    ...Shadows.card,
  },
  toggleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  toggleTextActive: {
    fontWeight: '600',
  },
  storyCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  storyParagraph: {
    lineHeight: 28,
  },
});
