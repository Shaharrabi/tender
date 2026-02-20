/**
 * SupportGroupsCard — Compact card displayed on the find-therapist page.
 *
 * Shows the user's recommended group (if ECR-R completed) or a prompt
 * to take the assessment. Tapping navigates to the full support-groups screen.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { CommunityIcon, StarIcon } from '@/assets/graphics/icons';
import type { GroupRecommendation } from '@/types/support-groups';

interface SupportGroupsCardProps {
  recommendation: GroupRecommendation | null;
  onPress: () => void;
}

export default function SupportGroupsCard({
  recommendation,
  onPress,
}: SupportGroupsCardProps) {
  const hasRec = recommendation?.recommendedGroup != null;
  const accentColor = recommendation?.recommendedGroup === 'avoidant'
    ? Colors.attachmentAvoidant
    : Colors.attachmentAnxious;

  const groupName = recommendation?.recommendedGroup === 'avoidant'
    ? 'The Retreat'
    : 'The Reach';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderLeftColor: hasRec ? accentColor : Colors.accentGold },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconWrap}>
        <CommunityIcon size={28} color={hasRec ? accentColor : Colors.accentGold} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Support Groups</Text>

        {hasRec ? (
          <View style={styles.recRow}>
            <StarIcon size={12} color={accentColor} />
            <Text style={[styles.recText, { color: accentColor }]}>
              Recommended: {groupName}
            </Text>
          </View>
        ) : recommendation?.attachmentStyle === 'secure' ? (
          <Text style={styles.subtitle}>
            Explore our attachment-based support groups
          </Text>
        ) : (
          <Text style={styles.subtitle}>
            Explore our attachment-based support groups
          </Text>
        )}
      </View>

      <Text style={styles.arrow}>{'\u2192'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  iconWrap: {},
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  recRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },
  subtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  arrow: {
    fontSize: 18,
    color: Colors.textMuted,
  },
});
