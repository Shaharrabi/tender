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
import { Colors, Spacing, FontSizes, ButtonSizes } from '@/constants/theme';

interface Props {
  scores: DSIRScores;
}

const SUBSCALE_COLORS: Record<string, string> = {
  emotionalReactivity: '#EF4444',
  iPosition: '#3B82F6',
  emotionalCutoff: '#F59E0B',
  fusionWithOthers: '#8B5CF6',
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
  if (normalized >= 76) return '#10B981';
  if (normalized >= 61) return '#3B82F6';
  if (normalized >= 41) return '#6B7280';
  if (normalized >= 26) return '#F59E0B';
  return '#EF4444';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.xl, paddingBottom: 120 },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  title: {
    fontSize: FontSizes.headingL,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary },

  totalSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  totalScale: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  levelBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: Colors.white,
    fontSize: FontSizes.caption,
    fontWeight: '700',
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
    borderLeftColor: '#6B8F71',
    marginBottom: Spacing.lg,
  },
  growthHeader: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: '#6B8F71',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  growthText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 22 },

  bodySection: {
    backgroundColor: '#F5F0EB',
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#C4785B',
    marginBottom: Spacing.xl,
  },
  bodyHeader: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: '#C4785B',
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

  barsSection: { gap: Spacing.lg, marginBottom: Spacing.xl },
  sectionTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
  },
  subscaleCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    gap: 6,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
  },
  barValue: {
    fontSize: FontSizes.caption,
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
  subscaleDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
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
