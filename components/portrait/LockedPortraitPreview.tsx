/**
 * LockedPortraitPreview — A frosted-glass teaser card that shows
 * on the home screen before the portrait is generated, giving
 * users a glimpse of what they're working toward.
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import TenderText from '@/components/ui/TenderText';
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
  'tender-personality-60': 'Who You Are',
  'values': 'What Matters to You',
};

const ALL_ASSESSMENT_TYPES = ['ecr-r', 'dutch', 'sseit', 'dsi-r', 'tender-personality-60', 'values'];

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
        <TenderText variant="headingS">
          Your Relational Portrait
        </TenderText>
      </View>

      <TenderText
        variant="body"
        color={Colors.textSecondary}
        style={{ marginBottom: Spacing.md, lineHeight: 20 }}
      >
        Complete all 6 sections to unlock your full portrait
      </TenderText>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <TenderText
        variant="caption"
        color={Colors.textMuted}
        style={{ fontSize: 11, marginBottom: Spacing.md }}
      >
        {completedCount} of {totalRequired} sections complete
      </TenderText>

      {/* Portrait tab previews — frosted */}
      <View style={styles.tabsGrid}>
        {PORTRAIT_TABS.map(({ key, label, Icon, color }) => (
          <View key={key} style={styles.tabPreview}>
            <View style={[styles.tabIconCircle, { backgroundColor: color + '15' }]}>
              <Icon size={16} color={color + '60'} />
            </View>
            <TenderText
              variant="caption"
              color={Colors.textMuted}
              style={{ fontSize: 10, letterSpacing: 0.3 }}
            >
              {label}
            </TenderText>
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
        <TenderText variant="body" color={Colors.primary}>
          {expanded ? 'Hide details' : 'See what\u2019s remaining'}
        </TenderText>
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
                <TenderText
                  variant="body"
                  color={isDone ? Colors.textSecondary : Colors.text}
                  style={[
                    isDone && { textDecorationLine: 'line-through' },
                  ]}
                >
                  {ASSESSMENT_LABELS[type] || type}
                </TenderText>
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
  expandButton: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
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
});
