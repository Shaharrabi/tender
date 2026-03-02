/**
 * PatternCard — Attachment pattern card for The Reading Room
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface PatternCardProps {
  pattern: {
    style: string;
    attachment: string;
    color: string;
    icon: string;
    tendency: string;
    gift: string;
    edge: string;
    practice: string;
  };
  expanded: boolean;
  onToggle: () => void;
}

export default function PatternCard({ pattern, expanded, onToggle }: PatternCardProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${pattern.style} pattern. ${expanded ? 'Collapse' : 'Expand'} details`}
      accessibilityState={{ expanded }}
      style={[
        styles.card,
        { borderLeftColor: pattern.color },
        expanded && { borderColor: pattern.color, shadowColor: pattern.color, shadowOpacity: 0.15, shadowRadius: 10 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{pattern.icon}</Text>
        <View>
          <Text style={[styles.styleName, { color: pattern.color }]}>{pattern.style}</Text>
          <Text style={styles.attachment}>{pattern.attachment} attachment</Text>
        </View>
      </View>

      {expanded && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.expandedContent}>
          <Text style={styles.tendency}>{pattern.tendency}</Text>

          <View style={[styles.section, { backgroundColor: `${pattern.color}11` }]}>
            <Text style={[styles.sectionLabel, { color: pattern.color }]}>Your Gift</Text>
            <Text style={styles.sectionText}>{pattern.gift}</Text>
          </View>

          <View style={[styles.section, { backgroundColor: Colors.backgroundAlt }]}>
            <Text style={styles.sectionLabelMuted}>Your Growing Edge</Text>
            <Text style={styles.sectionTextItalic}>{pattern.edge}</Text>
          </View>

          <View style={[styles.section, { backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderStyle: 'dashed', borderColor: `${pattern.color}44` }]}>
            <Text style={[styles.sectionLabel, { color: pattern.color }]}>Try This</Text>
            <Text style={styles.sectionText}>{pattern.practice}</Text>
          </View>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 24,
  },
  styleName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1,
  },
  attachment: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  expandedContent: {
    marginTop: Spacing.md,
    gap: 12,
  },
  tendency: {
    ...Typography.bodyLarge,
    lineHeight: 26,
    color: Colors.text,
  },
  section: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  sectionLabel: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sectionLabelMuted: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '600',
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sectionText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 22,
  },
  sectionTextItalic: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
