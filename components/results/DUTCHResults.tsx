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
import { Colors, Spacing, FontSizes, ButtonSizes } from '@/constants/theme';

interface Props {
  scores: DUTCHScores;
}

const SUBSCALE_COLORS: Record<string, string> = {
  yielding: '#8B5CF6',
  compromising: '#3B82F6',
  forcing: '#EF4444',
  problemSolving: '#10B981',
  avoiding: '#F59E0B',
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
    fontSize: FontSizes.headingL,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary },

  primarySection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
  },
  primaryLabel: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  primaryWarmLabel: {
    fontSize: FontSizes.headingXL,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  primaryStyle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  secondaryNote: {
    fontSize: FontSizes.bodySmall,
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
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  barLabelPrimary: { fontWeight: '700', color: Colors.primary },
  barValue: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  barBg: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5 },
  scaleNote: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },

  interpretationSection: { marginBottom: Spacing.lg },
  interpretationHeader: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  interpretationText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },

  insightSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6BA3A0',
    marginBottom: Spacing.lg,
  },
  insightHeader: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: '#6BA3A0',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  insightText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 22 },

  twoCol: { gap: Spacing.md, marginBottom: Spacing.lg },
  colCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  colHeader: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.success,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  colText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
  },

  tipSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
    marginBottom: Spacing.lg,
  },
  tipHeader: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.success,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tipText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 22 },

  bodySection: {
    backgroundColor: '#F5F0EB',
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    marginBottom: Spacing.xl,
  },
  bodyHeader: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.secondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bodyText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  actions: { gap: Spacing.md },
  primaryButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
});
