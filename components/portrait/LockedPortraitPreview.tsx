/**
 * LockedPortraitPreview — A frosted-glass teaser card that shows
 * on the home screen before the portrait is generated, giving
 * users a glimpse of what they're working toward.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  LockIcon,
  SparkleIcon,
  ChartBarIcon,
  EyeIcon,
  RefreshIcon,
  SeedlingIcon,
  AnchorIcon,
  CheckmarkIcon,
} from '@/assets/graphics/icons';
import type { AssessmentType } from '@/types';

const PORTRAIT_TABS = [
  { key: 'overview', label: 'Overview', Icon: SparkleIcon, color: Colors.primary },
  { key: 'scores', label: 'Scores', Icon: ChartBarIcon, color: Colors.calm },
  { key: 'lenses', label: 'Lenses', Icon: EyeIcon, color: Colors.depth },
  { key: 'cycle', label: 'Cycle', Icon: RefreshIcon, color: Colors.secondary },
  { key: 'growth', label: 'Growth', Icon: SeedlingIcon, color: Colors.warning },
  { key: 'anchors', label: 'Anchors', Icon: AnchorIcon, color: Colors.calm },
];

const ASSESSMENT_LABELS: Record<string, string> = {
  'ecr-r': 'How You Connect',
  'dutch': 'How You Fight',
  'sseit': 'How You Feel',
  'dsi-r': 'How You Hold Your Ground',
  'ipip-neo-120': 'Who You Are',
  'values': 'What Matters to You',
};

const ALL_ASSESSMENT_TYPES = ['ecr-r', 'dutch', 'sseit', 'dsi-r', 'ipip-neo-120', 'values'];

interface LockedPortraitPreviewProps {
  completedCount: number;
  completedTypes: AssessmentType[];
}

export default function LockedPortraitPreview({
  completedCount,
  completedTypes,
}: LockedPortraitPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const totalRequired = 6;
  const progress = completedCount / totalRequired;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LockIcon size={16} color={Colors.primary} />
        <Text style={styles.headerTitle}>Your Relational Portrait</Text>
      </View>

      <Text style={styles.headerSubtitle}>
        Complete all 6 sections to unlock your full portrait
      </Text>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {completedCount} of {totalRequired} sections complete
      </Text>

      {/* Portrait tab previews — frosted */}
      <View style={styles.tabsGrid}>
        {PORTRAIT_TABS.map(({ key, label, Icon, color }) => (
          <View key={key} style={styles.tabPreview}>
            <View style={[styles.tabIconCircle, { backgroundColor: color + '15' }]}>
              <Icon size={16} color={color + '60'} />
            </View>
            <Text style={styles.tabLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Expand to see checklist */}
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Hide details' : 'See what is remaining'}
      >
        <Text style={styles.expandButtonText}>
          {expanded ? 'Hide details' : 'See what\u2019s remaining'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.checklist}>
          {ALL_ASSESSMENT_TYPES.map((type) => {
            const isDone = completedTypes.includes(type as AssessmentType);
            return (
              <View key={type} style={styles.checklistRow}>
                {isDone ? (
                  <View style={styles.checkCircleDone}>
                    <CheckmarkIcon size={10} color={Colors.white} />
                  </View>
                ) : (
                  <View style={styles.checkCirclePending} />
                )}
                <Text style={[styles.checklistLabel, isDone && styles.checklistLabelDone]}>
                  {ASSESSMENT_LABELS[type] || type}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  tabsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    opacity: 0.45,
  },
  tabPreview: {
    width: '30%',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  tabIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
  expandButton: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
  },
  expandButtonText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  checklist: {
    marginTop: Spacing.sm,
    gap: 8,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkCircleDone: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCirclePending: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  checklistLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  checklistLabelDone: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
});
