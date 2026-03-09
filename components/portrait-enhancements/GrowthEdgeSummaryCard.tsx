/**
 * GrowthEdgeSummaryCard — Digestible growth edge card.
 *
 * The existing growth edge display shows title + description + rationale
 * + practices all at once. This wraps each edge in a card that shows:
 *   - Priority number + title (always visible)
 *   - One-sentence "what this means in practice" (always visible)
 *   - Full description + rationale + practices (collapsed, tap to expand)
 *
 * All content preserved — just layered for readability.
 *
 * Verified: Colors.warning='#D4A843', Colors.surface='#FFFFFF'
 *   BorderRadius.lg=16, Shadows.card
 */

import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, LayoutAnimation, StyleSheet, Platform, UIManager } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { GrowthEdge } from '@/types/portrait';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface GrowthEdgeSummaryCardProps {
  edge: GrowthEdge;
  index: number;
  phaseColor?: string;
  /** Called when user taps a practice to navigate to it */
  onPracticePress?: (practiceId: string) => void;
}

/** Generate a one-sentence "what this looks like in practice" from the edge */
function practicePreview(edge: GrowthEdge): string {
  const title = edge.title.toLowerCase();
  if (title.includes('regulation')) return 'When stress hits, your window narrows fast. Building regulation means the same trigger feels smaller over time.';
  if (title.includes('access')) return 'Staying emotionally reachable when your instinct says retreat. Your partner needs to find you there.';
  if (title.includes('values')) return 'Your actions in conflict don\u2019t match what you say matters. Closing that gap changes how you show up.';
  if (title.includes('differentiation') || title.includes('self-leadership')) return 'Holding your own ground while staying connected. Not collapsing into their needs, not walling off into yours.';
  if (title.includes('conflict')) return 'How you fight matters more than whether you fight. Softening the entry point changes the whole conversation.';
  if (title.includes('communication')) return 'Saying the underneath thing \u2014 the need, not the criticism. Your partner can hear the first; they defend against the second.';
  return 'This is where your growth wants to happen. Small moves here create the biggest shifts.';
}

export default function GrowthEdgeSummaryCard({
  edge,
  index,
  phaseColor = Colors.warning,
  onPracticePress,
}: GrowthEdgeSummaryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }, []);

  return (
    <View style={styles.card}>
      {/* Always visible: number + title + one-liner */}
      <TouchableOpacity onPress={toggle} activeOpacity={0.7} accessibilityRole="button" accessibilityState={{ expanded }}>
        <View style={styles.header}>
          <View style={[styles.numberBadge, { backgroundColor: phaseColor }]}>
            <TenderText variant="caption" color={Colors.white} style={styles.numberText}>{index + 1}</TenderText>
          </View>
          <View style={styles.headerText}>
            <TenderText variant="headingS" color={Colors.text}>{edge.title}</TenderText>
            <TenderText variant="bodySmall" color={Colors.textSecondary} style={styles.preview}>
              {practicePreview(edge)}
            </TenderText>
          </View>
          <TenderText variant="caption" color={Colors.textMuted}>{expanded ? '\u25B4' : '\u25BE'}</TenderText>
        </View>
      </TouchableOpacity>

      {/* Expanded: full description + rationale + practices */}
      {expanded && (
        <View style={styles.expandedContent}>
          <TenderText variant="body" color={Colors.textSecondary} style={styles.description}>
            {edge.description}
          </TenderText>

          {edge.rationale && (
            <View style={[styles.rationaleBox, { borderLeftColor: phaseColor }]}>
              <TenderText variant="label" color={phaseColor} style={styles.rationaleLabel}>WHY THIS MATTERS</TenderText>
              <TenderText variant="bodySmall" color={Colors.textSecondary} style={styles.rationaleText}>
                {edge.rationale}
              </TenderText>
            </View>
          )}

          {edge.practices.length > 0 && (
            <View style={styles.practicesSection}>
              <TenderText variant="label" color={Colors.textMuted} style={styles.practicesLabel}>PRACTICES</TenderText>
              {edge.practices.map((practiceId) => (
                <TouchableOpacity
                  key={practiceId}
                  style={styles.practiceRow}
                  onPress={() => onPracticePress?.(practiceId)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <TenderText variant="bodySmall" color={Colors.text}>
                    {practiceId.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </TenderText>
                  <TenderText variant="caption" color={phaseColor}>{'\u203A'}</TenderText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  numberText: {
    fontWeight: '700',
    fontSize: 13,
  },
  headerText: {
    flex: 1,
    gap: Spacing.xs,
  },
  preview: {
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: Spacing.md,
    gap: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  description: {
    lineHeight: 26,
  },
  rationaleBox: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
  },
  rationaleLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  rationaleText: {
    lineHeight: 22,
  },
  practicesSection: {
    gap: Spacing.xs,
  },
  practicesLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  practiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
});
