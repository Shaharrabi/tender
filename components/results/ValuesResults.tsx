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
import { ValuesScores } from '@/types';
import {
  getGapLabel,
  getGapColor,
  getGapDescription,
  getAvoidanceLabel,
  getAvoidanceDescription,
  getDomainLabel,
  getDomainFieldInsight,
  getValuesProfileInsight,
} from '@/utils/assessments/interpretations/values';
import { Colors, Spacing, FontSizes, ButtonSizes } from '@/constants/theme';

interface Props {
  scores: ValuesScores;
}

export default function ValuesResults({ scores }: Props) {
  const router = useRouter();
  const sortedDomains = Object.entries(scores.domainScores).sort(
    (a, b) => b[1].importance - a[1].importance
  );

  // Calculate average gap for overall insight
  const allGaps = Object.values(scores.domainScores).map((d) => Math.abs(d.gap));
  const avgGap = allGaps.length > 0 ? allGaps.reduce((a, b) => a + b, 0) / allGaps.length : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>What's Calling You Forward</Text>
          <Text style={styles.subtitle}>Your values and where they live in your relationship</Text>
        </View>

        {/* Overall Insight */}
        <View style={styles.overallSection}>
          <Text style={styles.overallText}>
            {getValuesProfileInsight(avgGap, scores.highGapDomains)}
          </Text>
        </View>

        {/* Top 5 Ranked Values */}
        {scores.top5Values.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What Matters Most</Text>
            {scores.top5Values.map((id, i) => {
              const fieldInsight = getDomainFieldInsight(id);
              return (
                <View key={id} style={styles.rankCard}>
                  <View style={styles.rankRow}>
                    <View style={styles.rankCircle}>
                      <Text style={styles.rankNum}>{i + 1}</Text>
                    </View>
                    <Text style={styles.rankLabel}>{getDomainLabel(id)}</Text>
                  </View>
                  {fieldInsight ? (
                    <Text style={styles.rankInsight}>{fieldInsight}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}

        {/* Domain Bars: Importance vs Accordance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Values Alignment</Text>
          <Text style={styles.sectionDesc}>
            How important each value is vs. how fully you are living it
          </Text>
          {sortedDomains.map(([id, data]) => {
            const absGap = Math.abs(data.gap);
            const gapColor = getGapColor(absGap);
            const gapLabel = getGapLabel(absGap);
            return (
              <View key={id} style={styles.domainCard}>
                <View style={styles.domainHeaderRow}>
                  <Text style={styles.domainName}>{getDomainLabel(id)}</Text>
                  <View style={[styles.gapBadge, { backgroundColor: gapColor }]}>
                    <Text style={styles.gapBadgeText}>{gapLabel}</Text>
                  </View>
                </View>
                {/* Importance bar */}
                <View style={styles.barRow}>
                  <Text style={styles.barLabel}>Importance</Text>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${data.importance * 10}%`, backgroundColor: Colors.primary },
                      ]}
                    />
                  </View>
                  <Text style={styles.barNum}>{data.importance}</Text>
                </View>
                {/* Accordance bar */}
                <View style={styles.barRow}>
                  <Text style={styles.barLabel}>Living it</Text>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${data.accordance * 10}%`, backgroundColor: '#10B981' },
                      ]}
                    />
                  </View>
                  <Text style={styles.barNum}>{data.accordance}</Text>
                </View>
                {/* Gap description for significant gaps */}
                {absGap >= 3 && (
                  <Text style={styles.gapDesc}>{getGapDescription(absGap)}</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* High-Gap Domains */}
        {scores.highGapDomains.length > 0 && (
          <View style={styles.highlightSection}>
            <Text style={styles.highlightTitle}>Where Growth is Calling</Text>
            <Text style={styles.highlightDesc}>
              These values matter deeply to you but have the largest gap between importance and how you are currently living them.
            </Text>
            {scores.highGapDomains.map((id) => (
              <Text key={id} style={styles.highlightItem}>
                {getDomainLabel(id)}
              </Text>
            ))}
          </View>
        )}

        {/* Behavioral Tendencies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Relationship with Your Values</Text>
          <View style={styles.tendencyCard}>
            <Text style={styles.tendencyLabel}>Avoidance pattern:</Text>
            <Text style={styles.tendencyValue}>
              {getAvoidanceLabel(scores.avoidanceTendency)}
            </Text>
          </View>
          <Text style={styles.tendencyDesc}>
            {getAvoidanceDescription(scores.avoidanceTendency)}
          </Text>
        </View>

        {/* Qualitative Responses */}
        {scores.qualitativeResponses.partnerIdentity && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Reflections</Text>
            <View style={styles.reflectionCard}>
              <Text style={styles.reflectionLabel}>The partner you want to be</Text>
              <Text style={styles.reflectionText}>{scores.qualitativeResponses.partnerIdentity}</Text>
            </View>
            {scores.qualitativeResponses.nonNegotiables ? (
              <View style={styles.reflectionCard}>
                <Text style={styles.reflectionLabel}>What you will not compromise</Text>
                <Text style={styles.reflectionText}>{scores.qualitativeResponses.nonNegotiables}</Text>
              </View>
            ) : null}
            {scores.qualitativeResponses.aspirationalVision ? (
              <View style={styles.reflectionCard}>
                <Text style={styles.reflectionLabel}>Where you are headed</Text>
                <Text style={styles.reflectionText}>{scores.qualitativeResponses.aspirationalVision}</Text>
              </View>
            ) : null}
          </View>
        )}

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
  subtitle: { fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center' },

  overallSection: {
    backgroundColor: '#EEF2FF',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.xl,
  },
  overallText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
    textAlign: 'center',
  },

  section: { marginBottom: Spacing.xl, gap: Spacing.sm },
  sectionTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionDesc: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  rankCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNum: {
    color: Colors.white,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },
  rankLabel: {
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '500',
  },
  rankInsight: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
    marginLeft: 44,
  },

  domainCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    gap: 6,
  },
  domainHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  domainName: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  gapBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gapBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barLabel: {
    width: 70,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },
  barNum: {
    width: 20,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'right',
  },
  gapDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 4,
  },

  highlightSection: {
    backgroundColor: '#FEF3C7',
    padding: Spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  highlightTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: '#92400E',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  highlightDesc: {
    fontSize: FontSizes.bodySmall,
    color: '#78350F',
    lineHeight: 20,
  },
  highlightItem: {
    fontSize: FontSizes.body,
    color: '#78350F',
    fontWeight: '600',
    paddingLeft: Spacing.sm,
  },

  tendencyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 8,
  },
  tendencyLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  tendencyValue: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tendencyDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  reflectionCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  reflectionLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reflectionText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
  },

  actions: { marginTop: Spacing.md },
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
