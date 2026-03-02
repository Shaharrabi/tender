import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AttachmentStyle, ECRRScores } from '@/types';
import { getECRRInterpretation } from '@/utils/assessments/interpretations/ecr-r';
import { Colors, Spacing, FontSizes, FontFamilies, Typography, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';

interface Props {
  scores: ECRRScores;
}

export default function ECRRResults({ scores }: Props) {
  const router = useRouter();
  const { anxietyScore, avoidanceScore, attachmentStyle } = scores;
  const info = getECRRInterpretation(attachmentStyle);

  const anxietyPercent = ((anxietyScore - 1) / 6) * 100;
  const avoidancePercent = ((avoidanceScore - 1) / 6) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>How You Connect & Protect</Text>
          <Text style={styles.subtitle}>Your attachment pattern in relationships</Text>
        </View>

        <View style={styles.scoresSection}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Attachment Anxiety</Text>
            <Text style={styles.scoreValue}>{anxietyScore.toFixed(2)}</Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${anxietyPercent}%` }]} />
            </View>
            <Text style={styles.scoreRange}>1.0 — 7.0</Text>
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Attachment Avoidance</Text>
            <Text style={styles.scoreValue}>{avoidanceScore.toFixed(2)}</Text>
            <View style={styles.scoreBarBg}>
              <View
                style={[
                  styles.scoreBarFill,
                  styles.scoreBarFillAvoidance,
                  { width: `${avoidancePercent}%` },
                ]}
              />
            </View>
            <Text style={styles.scoreRange}>1.0 — 7.0</Text>
          </View>
        </View>

        {/* Warm Label + Style */}
        <View style={styles.styleSection}>
          <Text style={styles.warmLabel}>{info.warmLabel}</Text>
          <Text style={styles.styleLabel}>{info.label}</Text>
        </View>

        {/* Main Interpretation */}
        <View style={styles.interpretationSection}>
          <Text style={styles.interpretationText}>{info.interpretation}</Text>
        </View>

        {/* Field Insight */}
        <View style={styles.insightSection}>
          <Text style={styles.insightHeader}>The Space Between You</Text>
          <Text style={styles.insightText}>{info.fieldInsight}</Text>
        </View>

        {/* Growth Edge */}
        <View style={styles.growthSection}>
          <Text style={styles.growthHeader}>Your Growth Edge</Text>
          <Text style={styles.growthText}>{info.growthEdge}</Text>
        </View>

        {/* Growth Tip */}
        <View style={styles.tipSection}>
          <Text style={styles.tipHeader}>This Week's Practice</Text>
          <Text style={styles.tipText}>{info.growthTip}</Text>
        </View>

        {/* Body Prompt */}
        <View style={styles.bodySection}>
          <Text style={styles.bodyHeader}>Body Check-In</Text>
          <Text style={styles.bodyText}>{info.bodyPrompt}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(app)/home')}
            accessibilityRole="button"
            accessibilityLabel="Back to Home"
          >
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.xl, paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  title: {
    ...Typography.headingL,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: { ...Typography.body, color: Colors.textSecondary },
  scoresSection: { gap: Spacing.md, marginBottom: Spacing.xl },
  scoreCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  scoreLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  scoreValue: {
    fontFamily: FontFamilies.accent,
    fontSize: 36,
    letterSpacing: -0.5,
    color: Colors.text,
  },
  scoreBarBg: {
    height: 8,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  scoreBarFillAvoidance: { backgroundColor: Colors.accentGold },
  scoreRange: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  styleSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  warmLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  styleLabel: {
    ...Typography.serifHeading,
    color: Colors.primary,
  },
  interpretationSection: { marginBottom: Spacing.lg },
  interpretationText: {
    ...Typography.body,
    color: Colors.text,
  },
  insightSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.calm,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  insightHeader: {
    ...Typography.label,
    color: Colors.calm,
    marginBottom: Spacing.xs,
  },
  insightText: { ...Typography.body, color: Colors.text },
  growthSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  growthHeader: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  growthText: { ...Typography.body, color: Colors.text },
  tipSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  tipHeader: {
    ...Typography.label,
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  tipText: { ...Typography.body, color: Colors.text },
  bodySection: {
    backgroundColor: Colors.backgroundAlt,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    marginBottom: Spacing.xl,
    ...Shadows.subtle,
  },
  bodyHeader: {
    ...Typography.label,
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  bodyText: {
    ...Typography.serifItalic,
    fontSize: FontSizes.body,
    color: Colors.text,
  },
  actions: { gap: Spacing.md },
  primaryButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
});
