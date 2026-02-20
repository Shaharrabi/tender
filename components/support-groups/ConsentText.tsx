/**
 * ConsentText — Full group agreement text for support group registration.
 *
 * Pure presentational component. Renders the 6-point consent agreement
 * from the spec in a scrollable, readable format.
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

const CONSENT_POINTS = [
  'This is a peer support group facilitated through the Tender app. It is not therapy and does not replace professional mental health treatment.',
  'Everything shared in group stays in group. I will maintain confidentiality about other members\u2019 identities and disclosures.',
  'I will treat all members with respect, even when our experiences differ.',
  'I can leave the group at any time without explanation.',
  'If I am in crisis, I will contact emergency services (911) or the 988 Suicide & Crisis Lifeline rather than relying solely on this group.',
  'The facilitator may reach out to my emergency contact if they have serious concerns about my safety.',
];

export default function ConsentText() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Group Agreement</Text>
      <Text style={styles.intro}>
        By joining this support group, I understand and agree that:
      </Text>
      {CONSENT_POINTS.map((point, i) => (
        <View key={i} style={styles.pointRow}>
          <Text style={styles.pointNumber}>{i + 1}.</Text>
          <Text style={styles.pointText}>{point}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundAlt || Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  heading: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  intro: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: FontSizes.caption * 1.5,
  },
  pointRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingLeft: Spacing.xs,
  },
  pointNumber: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    lineHeight: FontSizes.caption * 1.5,
    width: 16,
  },
  pointText: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: FontSizes.caption * 1.5,
  },
});
