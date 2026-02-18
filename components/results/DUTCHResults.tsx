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
import { DUTCHScores } from '@/types';
import {
  getDUTCHInterpretation,
  getDUTCHSubscaleLabel,
  getDUTCHSubscaleWarmLabel,
} from '@/utils/assessments/interpretations/dutch';
import { Colors, Spacing, FontSizes, FontFamilies, Typography, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';

interface Props {
  scores: DUTCHScores;
}

const SUBSCALE_COLORS: Record<string, string> = {
  yielding: Colors.depth,
  compromising: Colors.secondary,
  forcing: Colors.primary,
  problemSolving: Colors.success,
  avoiding: Colors.accentGold,
};

const SUBSCALE_ORDER = ['problemSolving', 'compromising', 'yielding', 'avoiding', 'forcing'];

export default function DUTCHResults({ scores }: Props) {
  const router = useRouter();
  const primaryInfo = getDUTCHInterpretation(scores.primaryStyle);
  const secondaryInfo = getDUTCHInterpretation(scores.secondaryStyle);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>How You Keep the Space Safe</Text>
          <Text style={styles.subtitle}>Your protective patterns in conflict</Text>
        </View>

        {/* Primary Style */}
        <View style={styles.primarySection}>
          <Text style={styles.primaryLabel}>Primary Pattern</Text>
          <Text style={styles.primaryWarmLabel}>{primaryInfo.warmLabel}</Text>
          <Text style={styles.primaryStyle}>{primaryInfo.label}</Text>
          <Text style={styles.secondaryNote}>
            Secondary: {secondaryInfo.warmLabel} ({secondaryInfo.label})
          </Text>
        </View>

        {/* Subscale Bars */}
        <View style={styles.barsSection}>
          {SUBSCALE_ORDER.map((key) => {
            const data = scores.subscaleScores[key];
            if (!data) return null;
            const percent = ((data.mean - 1) / 4) * 100;
            const color = SUBSCALE_COLORS[key] || Colors.primary;
            const isPrimary = key === scores.primaryStyle;
            return (
              <View key={key} style={styles.barRow}>
                <View style={styles.barLabelRow}>
                  <Text style={[styles.barLabel, isPrimary && styles.barLabelPrimary]}>
                    {getDUTCHSubscaleWarmLabel(key)}
                  </Text>
                  <Text style={styles.barValue}>{data.mean.toFixed(2)}</Text>
                </View>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${percent}%`, backgroundColor: color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
          <Text style={styles.scaleNote}>1.0 (Never) — 5.0 (Always)</Text>
        </View>

        {/* Primary Style Interpretation */}
        <View style={styles.interpretationSection}>
          <Text style={styles.interpretationHeader}>
            Your Protective Pattern
          </Text>
          <Text style={styles.interpretationText}>{primaryInfo.description}</Text>
        </View>

        {/* Field Insight */}
        <View style={styles.insightSection}>
          <Text style={styles.insightHeader}>The Space Between You</Text>
          <Text style={styles.insightText}>{primaryInfo.fieldInsight}</Text>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.colCard}>
            <Text style={styles.colHeader}>Strengths</Text>
            <Text style={styles.colText}>{primaryInfo.strengths}</Text>
          </View>
          <View style={styles.colCard}>
            <Text style={[styles.colHeader, { color: Colors.warning }]}>
              The Pattern to Notice
            </Text>
            <Text style={styles.colText}>{primaryInfo.watchOut}</Text>
          </View>
        </View>

        {/* Growth Tip */}
        <View style={styles.tipSection}>
          <Text style={styles.tipHeader}>This Week's Practice</Text>
          <Text style={styles.tipText}>{primaryInfo.growthTip}</Text>
        </View>

        {/* Body Prompt */}
        <View style={styles.bodySection}>
          <Text style={styles.bodyHeader}>Body Check-In</Text>
          <Text style={styles.bodyText}>{primaryInfo.bodyPrompt}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(app)/home')}
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

  primarySection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  primaryLabel: {
    ...Typography.label,
    color: Colors.primary,
  },
  primaryWarmLabel: {
    ...Typography.serifHeading,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  primaryStyle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  secondaryNote: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  barsSection: { gap: Spacing.md, marginBottom: Spacing.xl },
  barRow: { gap: 4 },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
  },
  barLabelPrimary: { fontWeight: '700', color: Colors.primary },
  barValue: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  barBg: {
    height: 10,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.sm + 1,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: BorderRadius.sm + 1 },
  scaleNote: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },

  interpretationSection: { marginBottom: Spacing.lg },
  interpretationHeader: {
    ...Typography.headingM,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
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

  twoCol: { gap: Spacing.md, marginBottom: Spacing.lg },
  colCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  colHeader: {
    ...Typography.label,
    color: Colors.success,
  },
  colText: {
    ...Typography.body,
    color: Colors.text,
  },

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
