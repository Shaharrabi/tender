import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IPIPScores } from '@/types';
import {
  FACETS,
  DOMAINS,
  DOMAIN_LABELS,
} from '@/utils/assessments/configs/ipip-neo-120';
import {
  getIPIPPercentileLabel,
  getIPIPDomainInterpretation,
} from '@/utils/assessments/interpretations/ipip-neo-120';
import { Colors, Spacing, FontSizes, FontFamilies, Typography, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';

interface Props {
  scores: IPIPScores;
}

const DOMAIN_COLORS: Record<string, string> = {
  neuroticism: Colors.primary,
  extraversion: Colors.accentGold,
  openness: Colors.depth,
  agreeableness: Colors.success,
  conscientiousness: Colors.secondary,
};

export default function IPIPResults({ scores }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Who You Are in Relationships</Text>
          <Text style={styles.subtitle}>Your personality through a relational lens</Text>
        </View>

        {DOMAINS.map((domain) => {
          const percentile = scores.domainPercentiles[domain] ?? 50;
          const color = DOMAIN_COLORS[domain] || Colors.primary;
          const label = getIPIPPercentileLabel(percentile);
          const interpretation = getIPIPDomainInterpretation(domain, percentile);
          const isExpanded = expanded === domain;
          const domainFacets = FACETS.filter((f) => f.domain === domain);

          return (
            <View key={domain} style={styles.domainCard}>
              <TouchableOpacity
                style={styles.domainHeader}
                onPress={() => setExpanded(isExpanded ? null : domain)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${interpretation.warmLabel}: ${interpretation.label}. ${isExpanded ? 'Collapse' : 'Expand'} details`}
                accessibilityState={{ expanded: isExpanded }}
              >
                <View style={styles.domainTitleRow}>
                  <View>
                    <Text style={styles.domainWarmLabel}>{interpretation.warmLabel}</Text>
                    <Text style={styles.domainTitle}>
                      {interpretation.label}
                    </Text>
                  </View>
                  <Text style={styles.expandIcon}>
                    {isExpanded ? '−' : '+'}
                  </Text>
                </View>
                <View style={styles.percentileRow}>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${percentile}%`, backgroundColor: color },
                      ]}
                    />
                  </View>
                  <Text style={[styles.percentileText, { color }]}>
                    {percentile} — {label}
                  </Text>
                </View>
                <Text style={styles.domainDesc}>
                  {interpretation.description}
                </Text>

                {/* Field Insight */}
                <View style={styles.domainInsight}>
                  <Text style={styles.domainInsightText}>{interpretation.fieldInsight}</Text>
                </View>

                {/* Growth Edge */}
                <View style={styles.domainGrowth}>
                  <Text style={styles.domainGrowthLabel}>Growth Edge</Text>
                  <Text style={styles.domainGrowthText}>{interpretation.growthEdge}</Text>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.facetsSection}>
                  {domainFacets.map((facet) => {
                    const fp = scores.facetPercentiles[facet.key] ?? 50;
                    const fl = getIPIPPercentileLabel(fp);
                    return (
                      <View key={facet.key} style={styles.facetRow}>
                        <View style={styles.facetLabelRow}>
                          <Text style={styles.facetLabel}>{facet.label}</Text>
                          <Text style={styles.facetValue}>
                            {fp} — {fl}
                          </Text>
                        </View>
                        <View style={styles.facetBarBg}>
                          <View
                            style={[
                              styles.facetBarFill,
                              {
                                width: `${fp}%`,
                                backgroundColor: color,
                                opacity: 0.7,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

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
  subtitle: { ...Typography.body, color: Colors.textSecondary },

  domainCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  domainHeader: { padding: Spacing.md },
  domainTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  domainWarmLabel: {
    ...Typography.label,
    fontSize: FontSizes.caption,
    color: Colors.primary,
    marginBottom: 2,
  },
  domainTitle: {
    ...Typography.headingM,
    color: Colors.text,
  },
  expandIcon: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 4,
  },
  percentileRow: { gap: 4, marginBottom: Spacing.sm },
  barBg: {
    height: 10,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.sm + 1,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: BorderRadius.sm + 1 },
  percentileText: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.caption,
    fontWeight: '600',
    textAlign: 'right',
  },
  domainDesc: {
    ...Typography.bodySmall,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  domainInsight: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.calm,
    marginBottom: Spacing.sm,
  },
  domainInsightText: {
    ...Typography.caption,
    color: Colors.calm,
    fontStyle: 'italic',
  },
  domainGrowth: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  domainGrowthLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  domainGrowthText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  facetsSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
  },
  facetRow: { gap: 2 },
  facetLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facetLabel: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '500',
  },
  facetValue: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  facetBarBg: {
    height: 6,
    backgroundColor: Colors.progressTrack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  facetBarFill: { height: '100%', borderRadius: 3 },

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
