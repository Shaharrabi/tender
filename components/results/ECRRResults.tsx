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
          <Text style={styles.title}>Your Results</Text>
          <Text style={styles.subtitle}>Understanding your attachment style</Text>
        </View>

        <View style={styles.scoresSection}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Anxiety</Text>
            <Text style={styles.scoreValue}>{anxietyScore.toFixed(2)}</Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${anxietyPercent}%` }]} />
            </View>
            <Text style={styles.scoreRange}>1.0 — 7.0</Text>
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Avoidance</Text>
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

        <View style={styles.styleSection}>
          <Text style={styles.styleLabel}>{info.label}</Text>
        </View>

        <View style={styles.interpretationSection}>
          <Text style={styles.interpretationText}>{info.interpretation}</Text>
        </View>

        <View style={styles.tipSection}>
          <Text style={styles.tipHeader}>Growth Tip</Text>
          <Text style={styles.tipText}>{info.growthTip}</Text>
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
  tipSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
    marginBottom: Spacing.xl,
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
