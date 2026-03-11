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
import {
  ChevronUpIcon,
  ChevronDownIcon,
  SeedlingIcon,
  WaveIcon,
  MirrorIcon,
  CompassIcon,
  ChatBubbleIcon,
  HandshakeIcon,
  MeditationIcon,
  SparkleIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons/types';

// ─── Wes Anderson Palette ────────────────────────────────
const WA = {
  sage: '#A8B5A2',
  terracotta: '#C4836A',
  dustyBlue: '#8BA4B8',
  mustard: '#D4A843',
  plum: '#8B6B7B',
};

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

/** Pick a relevant icon + color for the edge category */
function getEdgeVisual(edge: GrowthEdge): { Icon: React.ComponentType<IconProps>; color: string } {
  const title = edge.title.toLowerCase();
  if (title.includes('regulation')) return { Icon: WaveIcon, color: WA.dustyBlue };
  if (title.includes('access')) return { Icon: HandshakeIcon, color: WA.terracotta };
  if (title.includes('values')) return { Icon: CompassIcon, color: WA.mustard };
  if (title.includes('differentiation') || title.includes('self-leadership')) return { Icon: MirrorIcon, color: WA.plum };
  if (title.includes('conflict')) return { Icon: ChatBubbleIcon, color: WA.terracotta };
  if (title.includes('communication')) return { Icon: ChatBubbleIcon, color: WA.sage };
  return { Icon: SeedlingIcon, color: WA.sage };
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

  const { Icon: EdgeIcon, color: edgeColor } = getEdgeVisual(edge);

  return (
    <View style={styles.card}>
      {/* Always visible: icon + number + title + one-liner */}
      <TouchableOpacity onPress={toggle} activeOpacity={0.7} accessibilityRole="button" accessibilityState={{ expanded }}>
        <View style={styles.header}>
          <View style={[styles.numberBadge, { backgroundColor: edgeColor + '18' }]}>
            <EdgeIcon size={16} color={edgeColor} />
          </View>
          <View style={styles.headerText}>
            <View style={styles.titleRow}>
              <TenderText variant="label" color={edgeColor} style={styles.priorityLabel}>PRIORITY {index + 1}</TenderText>
            </View>
            <TenderText variant="headingS" color={Colors.text}>{edge.title}</TenderText>
            <TenderText variant="bodySmall" color={Colors.textSecondary} style={styles.preview}>
              {practicePreview(edge)}
            </TenderText>
          </View>
          {expanded
            ? <ChevronUpIcon size={14} color={Colors.textMuted} />
            : <ChevronDownIcon size={14} color={Colors.textMuted} />}
        </View>
      </TouchableOpacity>

      {/* Expanded: full description + rationale + practices */}
      {expanded && (
        <View style={styles.expandedContent}>
          <TenderText variant="body" color={Colors.textSecondary} style={styles.description}>
            {edge.description}
          </TenderText>

          {edge.rationale && (
            <View style={[styles.rationaleBox, { borderLeftColor: edgeColor }]}>
              <TenderText variant="label" color={edgeColor} style={styles.rationaleLabel}>WHY THIS MATTERS</TenderText>
              <TenderText variant="bodySmall" color={Colors.textSecondary} style={styles.rationaleText}>
                {edge.rationale}
              </TenderText>
            </View>
          )}

          {edge.practices.length > 0 && (
            <View style={styles.practicesSection}>
              <TenderText variant="label" color={Colors.textMuted} style={styles.practicesLabel}>PRACTICES</TenderText>
              {edge.practices.map((practice, i) => (
                <View key={i} style={styles.practiceRow}>
                  <View style={[styles.practiceIconCircle, { backgroundColor: edgeColor + '12' }]}>
                    <MeditationIcon size={11} color={edgeColor} />
                  </View>
                  <TenderText variant="bodySmall" color={Colors.text} style={styles.practiceText}>
                    {practice}
                  </TenderText>
                </View>
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
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  titleRow: {
    marginBottom: 2,
  },
  priorityLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
  },
  headerText: {
    flex: 1,
    gap: 3,
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
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  practiceIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceText: {
    flex: 1,
  },
});
