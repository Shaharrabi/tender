/**
 * EmptyState — Reusable empty state component.
 *
 * Friendly, encouraging messages shown when a section has no content yet.
 * Matches the existing inline empty state patterns from exercises.tsx and
 * community.tsx, but extracted into a reusable component.
 *
 * Usage:
 *   <EmptyState
 *     icon={SearchIcon}
 *     title="No exercises found"
 *     message="Try a different search term or clear the filter."
 *     ctaText="Show all exercises"
 *     ctaOnPress={() => resetFilters()}
 *   />
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from '@/constants/theme';
import { FTUEColors, FTUELayout } from '@/constants/ftue/theme';

interface EmptyStateProps {
  /** SVG icon component (receives size and color props) */
  icon?: React.ComponentType<{ size: number; color: string }>;
  /** Custom illustration (replaces icon if provided) */
  illustration?: React.ReactNode;
  /** Main heading */
  title: string;
  /** Descriptive body text */
  message: string;
  /** Primary CTA button text */
  ctaText?: string;
  /** Primary CTA action */
  ctaOnPress?: () => void;
  /** Secondary/ghost CTA text */
  secondaryCtaText?: string;
  /** Secondary CTA action */
  secondaryCtaOnPress?: () => void;
  /** Container style override */
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  illustration,
  title,
  message,
  ctaText,
  ctaOnPress,
  secondaryCtaText,
  secondaryCtaOnPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Icon or illustration */}
      {illustration ? (
        <View style={styles.illustrationContainer}>{illustration}</View>
      ) : Icon ? (
        <View style={styles.iconWrapper}>
          <Icon size={40} color={Colors.textMuted} />
        </View>
      ) : null}

      {/* Text content */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {/* Primary CTA */}
      {ctaText && ctaOnPress && (
        <AppButton
          title={ctaText}
          onPress={ctaOnPress}
          variant="primary"
          size="medium"
          style={styles.ctaButton}
        />
      )}

      {/* Secondary CTA */}
      {secondaryCtaText && secondaryCtaOnPress && (
        <AppButton
          title={secondaryCtaText}
          onPress={secondaryCtaOnPress}
          variant="ghost"
          size="small"
          style={styles.secondaryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  iconWrapper: {
    width: FTUELayout.emptyIconSize,
    height: FTUELayout.emptyIconSize,
    borderRadius: FTUELayout.emptyIconBorderRadius,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  illustrationContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.headingS,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  ctaButton: {
    marginBottom: Spacing.sm,
  },
  secondaryButton: {
    marginTop: Spacing.xs,
  },
});
