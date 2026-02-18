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
import { DSIRScores } from '@/types';
import {
  getDSIRLevel,
  getDSIRSubscaleLabel,
  getDSIRSubscaleDescription,
} from '@/utils/assessments/interpretations/dsi-r';
import { Colors, Spacing, FontSizes, FontFamilies, Typography, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';

interface Props {
  scores: DSIRScores;
}

const SUBSCALE_COLORS: Record<string, string> = {
  emotionalReactivity: Colors.primary,
  iPosition: Colors.secondary,
  emotionalCutoff: Colors.accentGold,
  fusionWithOthers: Colors.depth,
};

const SUBSCALE_ORDER = ['emotionalReactivity', 'iPosition', 'emotionalCutoff', 'fusionWithOthers'];

export default function DSIRResults({ scores }: Props) {
  const router = useRouter();
  const totalInfo = getDSIRLevel(scores.totalNormalized);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Staying You While Staying Close</Text>
          <Text style={styles.subtitle}>Your capacity for self and connection</Text>
        </View>

        {/* Total Score */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>{totalInfo.warmLabel}</Text>
          <Text style={styles.totalScore}>{scores.totalNormalized}</Text>
          <Text style={styles.totalScale}>out of 100</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(scores.totalNormalized) }]}>
            <Text style={styles.levelText}>{totalInfo.level}</Text>
          </View>
        </View>

        {/* Main Interpretation */}
        <View style={styles.interpretationSection}>
          <Text style={styles.interpretationText}>{totalInfo.description}</Text>
        </View>

        {/* Field Insight */}
        <View style={styles.insightSection}>
          <Text style={styles.insightHeader}>The Space Between You</Text>
          <Text style={styles.insightText}>{totalInfo.fieldInsight}</Text>
        </View>

        {/* Growth Edge */}
        <View style={styles.growthSection}>
          <Text style={styles.growthHeader}>Your Growth Edge</Text>
          <Text style={styles.growthText}>{totalInfo.growthEdge}</Text>
        </View>

        {/* Body Prompt */}
        <View style={styles.bodySection}>
          <Text style={styles.bodyHeader}>Body Check-In</Text>
          <Text style={styles.bodyText}>{totalInfo.bodyPrompt}</Text>
        </View>

        {/* Subscale Bars */}
        <View style={styles.barsSection}>
          <Text style={styles.sectionTitle}>Your Four Dimensions</Text>
          {SUBSCALE_ORDER.map((key) => {
            const data = scores.subscaleScores[key];
            if (!data) return null;
            const color = SUBSCALE_COLORS[key] || Colors.primary;
            return (
              <View key={key} style={styles.subscaleCard}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>
                    {getDSIRSubscaleLabel(key)}
                  </Text>
                  <Text style={styles.barValue}>
                    {data.normalized}%
                  </Text>
                </View>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${data.normalized}%`, backgroundColor: color },
                    ]}
                  />
                </View>
                <Text style={styles.subscaleDesc}>
                  {getDSIRSubscaleDescription(key)}
                </Text>
              </View>
            );
          })}
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

function getLevelColor(normalized: number): string {
  if (normalized >= 76) return Colors.success;
  if (normalized >= 61) return Colors.secondary;
  if (normalized >= 41) return Colors.textSecondary;
  if (normalized >= 26) return Colors.accentGold;
  return Colors.error;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.xl, paddingBottom: 120 },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  title: {
    ...Typography.headingL,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: { ...Typography.body, color: Colors.textSecondary },

  totalSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  totalLabel: {
    ...Typography.label,
    color: Colors.primary,
  },
  totalScore: {
    ...Typography.serifDisplay,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  totalScale: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  levelBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.lg,
  },
  levelText: {
    color: Colors.textOnPrimary,
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '700',
    letterSpacing: 1,
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

  barsSection: { gap: Spacing.lg, marginBottom: Spacing.xl },
  sectionTitle: {
    ...Typography.headingM,
    color: Colors.text,
  },
  subscaleCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 6,
    ...Shadows.card,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    flex: 1,
  },
  barValue: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.caption,
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
  subscaleDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
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
