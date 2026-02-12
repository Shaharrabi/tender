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
import { SSEITScores } from '@/types';
import {
  getSSEITLevel,
  getSSEITSubscaleLabel,
  getSSEITSubscaleDescription,
} from '@/utils/assessments/interpretations/sseit';
import { Colors, Spacing, FontSizes, ButtonSizes } from '@/constants/theme';

interface Props {
  scores: SSEITScores;
}

const SUBSCALE_COLORS: Record<string, string> = {
  perception: '#8B5CF6',
  managingOwn: '#3B82F6',
  managingOthers: '#10B981',
  utilization: '#F59E0B',
};

const SUBSCALE_ORDER = ['perception', 'managingOwn', 'managingOthers', 'utilization'];

export default function SSEITResults({ scores }: Props) {
  const router = useRouter();
  const totalInfo = getSSEITLevel(scores.totalNormalized);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Results</Text>
          <Text style={styles.subtitle}>Emotional Intelligence</Text>
        </View>

        {/* Total Score */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Overall Emotional Intelligence</Text>
          <Text style={styles.totalScore}>{scores.totalNormalized}</Text>
          <Text style={styles.totalScale}>out of 100</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(totalInfo.level) }]}>
            <Text style={styles.levelText}>{totalInfo.level}</Text>
          </View>
        </View>

        <View style={styles.interpretationSection}>
          <Text style={styles.interpretationText}>{totalInfo.description}</Text>
        </View>

        {/* Subscale Bars */}
        <View style={styles.barsSection}>
          <Text style={styles.sectionTitle}>Subscale Breakdown</Text>
          {SUBSCALE_ORDER.map((key) => {
            const normalized = scores.subscaleNormalized[key] ?? 0;
            const color = SUBSCALE_COLORS[key] || Colors.primary;
            const levelInfo = getSSEITLevel(normalized);
            return (
              <View key={key} style={styles.subscaleCard}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>
                    {getSSEITSubscaleLabel(key)}
                  </Text>
                  <Text style={styles.barValue}>
                    {normalized}% — {levelInfo.level}
                  </Text>
                </View>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${normalized}%`, backgroundColor: color },
                    ]}
                  />
                </View>
                <Text style={styles.subscaleDesc}>
                  {getSSEITSubscaleDescription(key)}
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

function getLevelColor(level: string): string {
  switch (level) {
    case 'High':
      return '#10B981';
    case 'Above Average':
      return '#3B82F6';
    case 'Average':
      return '#6B7280';
    case 'Below Average':
      return '#F59E0B';
    case 'Low':
      return '#EF4444';
    default:
      return Colors.primary;
  }
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

  totalSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: FontSizes.caption,
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

  interpretationSection: { marginBottom: Spacing.xl },
  interpretationText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
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
