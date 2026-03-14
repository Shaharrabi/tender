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
import { Colors, Spacing, FontSizes, FontFamilies, Typography, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';

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
                        { width: `${data.accordance * 10}%`, backgroundColor: Colors.success },
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
              <Text style={styles.reflectionLabel}>Your partner at their best</Text>
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
                <Text style={styles.reflectionLabel}>Your relationship in a year</Text>
                <Text style={styles.reflectionText}>{scores.qualitativeResponses.aspirationalVision}</Text>
              </View>
            ) : null}
          </View>
        )}

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
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },

  overallSection: {
    backgroundColor: Colors.primaryFaded,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    ...Shadows.subtle,
  },
  overallText: {
    ...Typography.body,
    color: Colors.text,
    textAlign: 'center',
  },

  section: { marginBottom: Spacing.xl, gap: Spacing.sm },
  sectionTitle: {
    ...Typography.headingM,
    color: Colors.text,
  },
  sectionDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },

  rankCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    ...Shadows.card,
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
    color: Colors.textOnPrimary,
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },
  rankLabel: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  rankInsight: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginLeft: 44,
  },

  domainCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 6,
    ...Shadows.card,
  },
  domainHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  domainName: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    flex: 1,
  },
  gapBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.md,
  },
  gapBadgeText: {
    color: Colors.textOnPrimary,
    fontFamily: FontFamilies.heading,
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
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: BorderRadius.sm },
  barNum: {
    width: 20,
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'right',
  },
  gapDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },

  highlightSection: {
    backgroundColor: Colors.accentCream + '30',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accentGold,
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
    ...Shadows.subtle,
  },
  highlightTitle: {
    ...Typography.label,
    color: Colors.primaryDark,
  },
  highlightDesc: {
    ...Typography.bodySmall,
    color: Colors.text,
  },
  highlightItem: {
    ...Typography.bodyMedium,
    color: Colors.text,
    paddingLeft: Spacing.sm,
  },

  tendencyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.subtle,
  },
  tendencyLabel: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
  },
  tendencyValue: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tendencyDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },

  reflectionCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  reflectionLabel: {
    ...Typography.label,
    color: Colors.primary,
  },
  reflectionText: {
    ...Typography.body,
    color: Colors.text,
  },

  actions: { marginTop: Spacing.md },
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
