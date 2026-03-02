/**
 * GrowthTimeline — Visual timeline of growth edge progress.
 *
 * Shows each growth edge with its current stage badge,
 * practice count, last practiced date, and a progress bar
 * indicating stage progression.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { GrowthEdgeProgress, GrowthStage } from '@/types/growth';

interface GrowthTimelineProps {
  edges: GrowthEdgeProgress[];
}

// ─── Stage Config ───────────────────────────────────────

const STAGE_CONFIG: Record<GrowthStage, { label: string; color: string; bg: string; progress: number }> = {
  emerging: {
    label: 'Emerging',
    color: Colors.calm,
    bg: Colors.calmLight,
    progress: 0.25,
  },
  practicing: {
    label: 'Practicing',
    color: Colors.accent,
    bg: Colors.accentGoldLight,
    progress: 0.5,
  },
  integrating: {
    label: 'Integrating',
    color: Colors.secondary,
    bg: Colors.accentLightAlt,
    progress: 0.75,
  },
  integrated: {
    label: 'Integrated',
    color: Colors.primary,
    bg: Colors.successFaded,
    progress: 1.0,
  },
};

// ─── Helpers ────────────────────────────────────────────

function formatDate(dateString?: string): string {
  if (!dateString) return 'Not yet';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Component ──────────────────────────────────────────

export default function GrowthTimeline({ edges }: GrowthTimelineProps) {
  if (edges.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No growth edges tracked yet. Complete your assessments to discover your growth edges.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {edges.map((edge, index) => {
        const stageConfig = STAGE_CONFIG[edge.stage];
        const isLast = index === edges.length - 1;

        return (
          <View key={edge.id} style={styles.edgeRow}>
            {/* Timeline connector */}
            <View style={styles.timelineColumn}>
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: stageConfig.color },
                ]}
              />
              {!isLast && <View style={styles.timelineLine} />}
            </View>

            {/* Edge card */}
            <View style={styles.edgeCard}>
              {/* Header: title + badge */}
              <View style={styles.edgeHeader}>
                <Text style={styles.edgeTitle} numberOfLines={2}>
                  {edge.edgeId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Text>
                <View
                  style={[
                    styles.stageBadge,
                    { backgroundColor: stageConfig.bg },
                  ]}
                >
                  <Text
                    style={[styles.stageBadgeText, { color: stageConfig.color }]}
                  >
                    {stageConfig.label}
                  </Text>
                </View>
              </View>

              {/* Stats row */}
              <View style={styles.statsRow}>
                <Text style={styles.statText}>
                  {edge.practiceCount} practice{edge.practiceCount !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.statDivider}>|</Text>
                <Text style={styles.statText}>
                  Last: {formatDate(edge.lastPracticed)}
                </Text>
              </View>

              {/* Progress bar */}
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${stageConfig.progress * 100}%`,
                      backgroundColor: stageConfig.color,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  emptyContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Timeline row
  edgeRow: {
    flexDirection: 'row',
  },
  timelineColumn: {
    width: 32,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: Spacing.md,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },

  // Edge card
  edgeCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  edgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  edgeTitle: {
    flex: 1,
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  stageBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  stageBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  statDivider: {
    fontSize: FontSizes.caption,
    color: Colors.borderLight,
  },

  // Progress bar
  progressBarTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
});
