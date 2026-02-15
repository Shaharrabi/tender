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
import { Colors, Spacing, FontSizes, ButtonSizes } from '@/constants/theme';

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
  scoresSection: { gap: Spacing.md, marginBottom: Spacing.xl },
  scoreCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  scoreLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: FontSizes.headingXL,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scoreBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  scoreBarFillAvoidance: { backgroundColor: Colors.warning },
  scoreRange: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  styleSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
  },
  warmLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  styleLabel: {
    fontSize: FontSizes.headingL,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  interpretationSection: { marginBottom: Spacing.lg },
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
  growthSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.lg,
  },
  growthHeader: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  growthText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 22 },
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
