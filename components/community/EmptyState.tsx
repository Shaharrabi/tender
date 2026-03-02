/**
 * EmptyState — Reusable centered empty state with icon, title, subtitle, and optional CTA.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ComponentType } from 'react';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
} from '@/constants/theme';
import type { IconProps } from '@/assets/graphics/icons';

interface EmptyStateProps {
  Icon: ComponentType<IconProps>;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ Icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={st.container}>
      <Icon size={40} color={Colors.textMuted} />
      <Text style={st.title}>{title}</Text>
      <Text style={st.subtitle}>{subtitle}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={st.actionBtn} onPress={onAction} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel={actionLabel}>
          <Text style={st.actionBtnText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.xxl,
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionBtn: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionBtnText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
});
