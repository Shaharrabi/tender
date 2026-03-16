/**
 * IntegrationPanel — Shows the integration result when 2-4 domains
 * are selected in "Integrate" mode.
 *
 * Displays: title, body text, developmental arc (protection → cost → emergence),
 * practice, and optional "one thing" sentence.
 *
 * Appears with a slide-in animation below the domain selection area.
 */

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows, FontFamilies } from '@/constants/theme';
import { MATRIX_COLORS } from './constants/matrix-colors';
import type { IntegrationResult } from '@/utils/integration-engine';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface IntegrationPanelProps {
  result: IntegrationResult | null;
  visible: boolean;
}

export default function IntegrationPanel({ result, visible }: IntegrationPanelProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && result) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, result?.title]);

  if (!visible || !result) return null;

  // Pick a warm accent color based on the first domain
  const domainColor = result.domains[0]
    ? MATRIX_COLORS[result.domains[0] as keyof typeof MATRIX_COLORS]
    : MATRIX_COLORS.invitation;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.depthBadge, { backgroundColor: domainColor.bg }]}>
          <TenderText variant="caption" style={[styles.depthText, { color: domainColor.text }]}>
            {result.depth === 'pairwise' ? '2 domains' : result.depth === 'triple' ? '3 domains' : '4 domains'}
          </TenderText>
        </View>
        <View style={[styles.confidenceBadge, {
          backgroundColor: result.confidence === 'high' ? '#E3EFE5' : result.confidence === 'emerging' ? '#FDF3E0' : '#F0E6E0',
        }]}>
          <TenderText variant="caption" style={{
            color: result.confidence === 'high' ? '#4A6F50' : result.confidence === 'emerging' ? '#8B6914' : '#6B5E61',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {result.confidence === 'high' ? 'Strong signal' : result.confidence === 'emerging' ? 'Pattern emerging' : 'Needs more data'}
          </TenderText>
        </View>
      </View>

      {/* Title */}
      <TenderText variant="heading" style={styles.title}>{result.title}</TenderText>
      <TenderText variant="caption" color={Colors.textSecondary} style={styles.subtitle}>
        {result.subtitle}
      </TenderText>

      {/* Body */}
      <TenderText variant="body" style={styles.body}>{result.body}</TenderText>

      {/* Developmental Arc */}
      <View style={styles.arcContainer}>
        <TenderText variant="caption" style={styles.arcLabel}>DEVELOPMENTAL ARC</TenderText>

        <View style={styles.arcStep}>
          <View style={[styles.arcDot, { backgroundColor: '#C4917A' }]} />
          <View style={styles.arcContent}>
            <TenderText variant="caption" style={styles.arcStepLabel}>Protection</TenderText>
            <TenderText variant="body" style={styles.arcText}>{result.arc.protection}</TenderText>
          </View>
        </View>

        <View style={styles.arcConnector} />

        <View style={styles.arcStep}>
          <View style={[styles.arcDot, { backgroundColor: '#D4B96A' }]} />
          <View style={styles.arcContent}>
            <TenderText variant="caption" style={styles.arcStepLabel}>Cost</TenderText>
            <TenderText variant="body" style={styles.arcText}>{result.arc.cost}</TenderText>
          </View>
        </View>

        <View style={styles.arcConnector} />

        <View style={styles.arcStep}>
          <View style={[styles.arcDot, { backgroundColor: '#B5C4A8' }]} />
          <View style={styles.arcContent}>
            <TenderText variant="caption" style={styles.arcStepLabel}>Emergence</TenderText>
            <TenderText variant="body" style={styles.arcText}>{result.arc.emergence}</TenderText>
          </View>
        </View>
      </View>

      {/* Practice */}
      <View style={styles.practiceContainer}>
        <TenderText variant="caption" style={styles.practiceLabel}>THIS WEEK'S PRACTICE</TenderText>
        <TenderText variant="body" style={styles.practiceText}>{result.practice}</TenderText>
      </View>

      {/* One Thing */}
      {result.oneThing && (
        <View style={styles.oneThingContainer}>
          <TenderText variant="body" style={styles.oneThingText}>
            {result.oneThing}
          </TenderText>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  depthBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  depthText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: FontFamilies.heading,
  },
  confidenceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  title: {
    fontSize: 20,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  arcContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  arcLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    fontFamily: FontFamilies.heading,
  },
  arcStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  arcDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  arcContent: {
    flex: 1,
  },
  arcStepLabel: {
    fontSize: 11,
    fontFamily: FontFamilies.heading,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  arcText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.text,
  },
  arcConnector: {
    width: 1,
    height: 12,
    backgroundColor: Colors.borderLight,
    marginLeft: 4.5,
    marginVertical: 4,
  },
  practiceContainer: {
    backgroundColor: '#FDF8EE',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#D4B96A',
    marginBottom: Spacing.md,
  },
  practiceLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    fontFamily: FontFamilies.heading,
  },
  practiceText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.text,
  },
  oneThingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  oneThingText: {
    fontSize: 15,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
});
