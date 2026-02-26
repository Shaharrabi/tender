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
import { CSI16Scores } from '@/types/couples';
import { getCSI16Interpretation } from '@/utils/assessments/interpretations/csi-16';
import { Colors, Spacing, FontSizes, FontFamilies, Typography, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';

interface Props {
  scores: CSI16Scores;
}

const MAX_SCORE = 81;

const LEVEL_COLORS: Record<CSI16Scores['satisfactionLevel'], string> = {
  high: Colors.success,
  moderate: Colors.accentGold,
  low: Colors.accent,
  crisis: Colors.error,
};

const LEVEL_BG: Record<CSI16Scores['satisfactionLevel'], string> = {
  high: '#EAF3EE',
  moderate: '#FDF5E6',
  low: '#FBF0ED',
  crisis: Colors.errorLight,
};

export default function CSI16Results({ scores }: Props) {
  const router = useRouter();
  const { total, satisfactionLevel, distressed } = scores;
  const info = getCSI16Interpretation(satisfactionLevel);

  const fillPercent = Math.min((total / MAX_SCORE) * 100, 100);
  const levelColor = LEVEL_COLORS[satisfactionLevel];
  const levelBg = LEVEL_BG[satisfactionLevel];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>How Satisfied You Feel</Text>
          <Text style={styles.subtitle}>Your experience of the relationship</Text>
        </View>

        {/* Total Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Overall Satisfaction</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreValue}>{total}</Text>
            <Text style={styles.scoreMax}> / {MAX_SCORE}</Text>
          </View>
          <View style={styles.scoreBarBg}>
            <View
              style={[
                styles.scoreBarFill,
                { width: `${fillPercent}%`, backgroundColor: levelColor },
              ]}
            />
          </View>
          <Text style={styles.scoreRange}>
            {Math.round(fillPercent)}% of possible satisfaction
          </Text>
        </View>

        {/* Satisfaction Level Badge */}
        <View style={[styles.levelSection, { backgroundColor: levelBg }]}>
          <Text style={[styles.warmLabel, { color: levelColor }]}>{info.warmLabel}</Text>
          <Text style={[styles.levelLabel, { color: levelColor }]}>{info.label}</Text>
          {distressed && (
            <View style={styles.distressBadge}>
              <Text style={styles.distressBadgeText}>Below clinical cutoff</Text>
            </View>
          )}
        </View>

        {/* Main Interpretation */}
        <View style={styles.interpretationSection}>
          <Text style={styles.interpretationText}>{info.interpretation}</Text>
        </View>

        {/* The Space Between You */}
        <View style={styles.insightSection}>
          <Text style={styles.insightHeader}>The Space Between You</Text>
          <Text style={styles.insightText}>{info.fieldInsight}</Text>
        </View>

        {/* Growth Edge */}
        <View style={[styles.growthSection, { borderLeftColor: levelColor }]}>
          <Text style={[styles.growthHeader, { color: levelColor }]}>Your Growth Edge</Text>
          <Text style={styles.growthText}>{info.growthEdge}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(app)/partner')}
          >
            <Text style={styles.primaryButtonText}>Back to Partner</Text>
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

  // ─── Score Card ────────────────────────────────────────
  scoreCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  scoreLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontFamily: FontFamilies.accent,
    fontSize: 36,
    letterSpacing: -0.5,
    color: Colors.text,
  },
  scoreMax: {
    fontFamily: FontFamilies.accent,
    fontSize: 18,
    color: Colors.textMuted,
  },
  scoreBarBg: {
    height: 8,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  scoreRange: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  // ─── Satisfaction Level ────────────────────────────────
  levelSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  warmLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  levelLabel: {
    ...Typography.serifHeading,
  },
  distressBadge: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  distressBadgeText: {
    ...Typography.caption,
    color: Colors.error,
  },

  // ─── Interpretation ────────────────────────────────────
  interpretationSection: { marginBottom: Spacing.lg },
  interpretationText: {
    ...Typography.body,
    color: Colors.text,
  },

  // ─── The Space Between You ─────────────────────────────
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

  // ─── Growth Edge ───────────────────────────────────────
  growthSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.xl,
    ...Shadows.subtle,
  },
  growthHeader: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  growthText: { ...Typography.body, color: Colors.text },

  // ─── Actions ───────────────────────────────────────────
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
