/**
 * MilestoneCard — Displays a single milestone in a vertical
 * timeline with a connecting line between milestones,
 * a styled indicator circle, and accent color support.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
} from '@/constants/theme';

interface MilestoneCardProps {
  text: string;
  achieved: boolean;
  /** Position index in the milestone list (for connecting lines) */
  index?: number;
  /** Total milestones in the list */
  total?: number;
  /** Accent color from the parent pathway */
  accentColor?: string;
}

export default function MilestoneCard({
  text,
  achieved,
  index = 0,
  total = 1,
  accentColor = Colors.primary,
}: MilestoneCardProps) {
  const isLast = index === total - 1;

  return (
    <View style={styles.container}>
      {/* Timeline column: indicator + connecting line */}
      <View style={styles.timelineColumn}>
        {/* Indicator circle */}
        <View
          style={[
            styles.indicatorOuter,
            achieved
              ? { backgroundColor: accentColor }
              : { borderColor: accentColor + '60', borderWidth: 2, backgroundColor: 'transparent' },
          ]}
        >
          {achieved ? (
            <Text style={styles.checkmark}>{'\u2713'}</Text>
          ) : (
            <View
              style={[
                styles.indicatorInnerDot,
                { backgroundColor: accentColor + '30' },
              ]}
            />
          )}
        </View>

        {/* Connecting line to next milestone */}
        {!isLast && (
          <View
            style={[
              styles.connectingLine,
              {
                backgroundColor: achieved
                  ? accentColor + '40'
                  : Colors.borderLight,
              },
            ]}
          />
        )}
      </View>

      {/* Content card */}
      <View
        style={[
          styles.contentCard,
          achieved && styles.contentCardAchieved,
        ]}
      >
        <View style={styles.contentRow}>
          <Text
            style={[
              styles.milestoneText,
              achieved && styles.milestoneTextAchieved,
            ]}
          >
            {text}
          </Text>
          {achieved && (
            <View style={[styles.completedBadge, { backgroundColor: accentColor + '18' }]}>
              <Text style={[styles.completedBadgeText, { color: accentColor }]}>
                Done
              </Text>
            </View>
          )}
        </View>
        {!achieved && (
          <View style={styles.pendingRow}>
            <View
              style={[
                styles.stepDot,
                { backgroundColor: accentColor + '40' },
              ]}
            />
            <Text style={styles.pendingText}>
              Step {index + 1} of {total}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 56,
  },

  // Timeline column
  timelineColumn: {
    width: 32,
    alignItems: 'center',
  },
  indicatorOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  checkmark: {
    fontSize: 13,
    color: Colors.textOnPrimary,
    fontWeight: '700',
    lineHeight: 16,
  },
  indicatorInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectingLine: {
    width: 2,
    flex: 1,
    minHeight: 20,
    marginVertical: 2,
    borderRadius: 1,
  },

  // Content card
  contentCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm + 4,
    marginLeft: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  contentCardAchieved: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  milestoneText: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
    fontWeight: '500',
  },
  milestoneTextAchieved: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  completedBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Pending indicator
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  stepDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  pendingText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
