/**
 * CommunityNudgeCard — Warm invitation to explore the community space.
 *
 * Shown on step-detail at Step 9, where the theme of repair
 * deepens when witnessed by others. Mirrors AssessmentNudgeCard
 * visual pattern (left border accent, icon, eyebrow, text, CTA).
 *
 * Rules:
 *   - NEVER blocks step progression
 *   - Warm, invitational language ("a space for witnessing")
 *   - Language rules: never say "fix", always say "the space between you"
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import { CommunityIcon } from '@/assets/graphics/icons';
import TenderButton from '@/components/ui/TenderButton';

// ─── Component ──────────────────────────────────────────

interface CommunityNudgeCardProps {
  /** Phase accent color for the left border */
  phaseColor: string;
}

export default function CommunityNudgeCard({ phaseColor }: CommunityNudgeCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push('/(app)/community' as any);
  };

  return (
    <View style={[styles.card, { borderLeftColor: Colors.secondary }]}>
      <View style={styles.header}>
        <CommunityIcon size={16} color={Colors.secondary} />
        <Text style={[styles.eyebrow, { color: Colors.secondary }]}>
          A SPACE FOR WITNESSING
        </Text>
      </View>
      <Text style={styles.nudgeText}>
        Repair deepens when it's witnessed. The community is a place where
        your growth is seen, honored, and held — at whatever pace feels right.
      </Text>
      <View style={styles.ctaRow}>
        <TenderButton
          title="Explore Community"
          onPress={handlePress}
          variant="outline"
          size="sm"
        />
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  eyebrow: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    letterSpacing: 1,
  },
  nudgeText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  ctaRow: {
    marginTop: Spacing.xs,
    alignItems: 'flex-start',
  },
});
