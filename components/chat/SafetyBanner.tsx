/**
 * SafetyBanner — displays crisis resources when safety is triggered.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius } from '@/constants/theme';
import type { SafetyCheckResult } from '@/types/chat';

interface Props {
  safetyResult: SafetyCheckResult;
  onDismiss: () => void;
}

export default function SafetyBanner({ safetyResult, onDismiss }: Props) {
  if (safetyResult.safe) return null;

  return (
    <View
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLabel="Crisis support resources available"
      accessibilityLiveRegion="assertive"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Support is available</Text>
        <TouchableOpacity
          onPress={onDismiss}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Dismiss safety banner"
        >
          <Text style={styles.dismiss}>Dismiss</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.message}>
        If you or someone you know is in crisis, please reach out to one of these resources.
        You don't have to go through this alone.
      </Text>

      {safetyResult.resources.map((resource, i) => (
        <TouchableOpacity
          key={i}
          style={styles.resourceCard}
          onPress={() => {
            // Try to open phone link for phone numbers
            const phone = resource.contact.match(/[\d-]+/);
            if (phone) {
              Linking.openURL(`tel:${phone[0].replace(/-/g, '')}`).catch(() => {});
            }
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Call ${resource.name}: ${resource.contact}. ${resource.description}`}
        >
          <Text style={styles.resourceName}>{resource.name}</Text>
          <Text style={styles.resourceContact}>{resource.contact}</Text>
          <Text style={styles.resourceDesc}>{resource.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.errorLight,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.error,
  },
  dismiss: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  message: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  resourceCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 2,
  },
  resourceName: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  resourceContact: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.primary,
  },
  resourceDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
