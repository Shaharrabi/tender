/**
 * PartnerActivityCard — "Your partner answered" curiosity hook.
 *
 * Shows on home screen when the partner has done something.
 * Warm, curious tone — never urgent.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { PartnerActivity } from '@/services/partner-activity';

interface PartnerActivityCardProps {
  activity: PartnerActivity;
  partnerName: string;
  onPress: () => void;
}

const ACTIVITY_MESSAGES: Record<string, { locked: string; unlocked: string }> = {
  step_reflection: {
    unlocked: 'reflected on a step. Tap to see what they shared.',
    locked: 'wrote something. Complete the same step to see it.',
  },
  practice_complete: {
    unlocked: 'completed a practice.',
    locked: 'completed a practice.',
  },
  checkin: {
    unlocked: 'checked in this week. See their reading.',
    locked: 'checked in this week. Complete your check-in to see theirs.',
  },
  assessment_complete: {
    unlocked: 'finished an assessment. Something new is waiting.',
    locked: 'finished an assessment. Something new is waiting.',
  },
  portrait_update: {
    unlocked: 'The space between you shifted. Check your couple portrait.',
    locked: 'The space between you shifted. Check your couple portrait.',
  },
};

export default function PartnerActivityCard({
  activity,
  partnerName,
  onPress,
}: PartnerActivityCardProps) {
  const messages = ACTIVITY_MESSAGES[activity.activityType] || ACTIVITY_MESSAGES.practice_complete;
  const message = activity.unlocked ? messages.unlocked : messages.locked;
  const initial = partnerName.charAt(0).toUpperCase();

  // For portrait_update, the message IS the full text
  const displayText = activity.activityType === 'portrait_update'
    ? message
    : `${partnerName} ${message}`;

  return (
    <TouchableOpacity
      style={[styles.card, !activity.unlocked && styles.cardLocked]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={displayText}
    >
      <View style={styles.row}>
        <View style={[styles.avatar, !activity.unlocked && styles.avatarLocked]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.message}>{displayText}</Text>
          {activity.activityData?.stepNumber && (
            <Text style={styles.detail}>Step {activity.activityData.stepNumber}</Text>
          )}
        </View>
        <Text style={styles.arrow}>{activity.unlocked ? '\u2192' : '\uD83D\uDD12'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  cardLocked: {
    backgroundColor: Colors.accentGoldLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  avatarLocked: {
    backgroundColor: Colors.accentGold,
  },
  avatarText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.textOnPrimary,
  },
  content: {
    flex: 1,
  },
  message: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  detail: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    marginLeft: Spacing.sm,
  },
});
