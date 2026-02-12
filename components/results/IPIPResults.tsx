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
  getIPIPDomainDescription,
} from '@/utils/assessments/interpretations/ipip-neo-120';
import { Colors, Spacing, FontSizes, ButtonSizes } from '@/constants/theme';

interface Props {
  scores: IPIPScores;
}

const DOMAIN_COLORS: Record<string, string> = {
  neuroticism: '#EF4444',
  extraversion: '#F59E0B',
  openness: '#8B5CF6',
  agreeableness: '#10B981',
  conscientiousness: '#3B82F6',
};

export default function IPIPResults({ scores }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Results</Text>
          <Text style={styles.subtitle}>Big Five Personality Profile</Text>
        </View>

        {DOMAINS.map((domain) => {
          const percentile = scores.domainPercentiles[domain] ?? 50;
          const color = DOMAIN_COLORS[domain] || Colors.primary;
          const label = getIPIPPercentileLabel(percentile);
          const isExpanded = expanded === domain;
          const domainFacets = FACETS.filter((f) => f.domain === domain);

          return (
            <View key={domain} style={styles.domainCard}>
              <TouchableOpacity
                style={styles.domainHeader}
                onPress={() => setExpanded(isExpanded ? null : domain)}
                activeOpacity={0.7}
              >
                <View style={styles.domainTitleRow}>
                  <Text style={styles.domainTitle}>
                    {DOMAIN_LABELS[domain]}
                  </Text>
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
                    {percentile}th — {label}
                  </Text>
                </View>
                <Text style={styles.domainDesc}>
                  {getIPIPDomainDescription(domain, percentile)}
                </Text>
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
                            {fp}th — {fl}
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

  domainCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  domainHeader: { padding: Spacing.md },
  domainTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  domainTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    color: Colors.text,
  },
  expandIcon: {
    fontSize: FontSizes.headingM,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  percentileRow: { gap: 4, marginBottom: Spacing.sm },
  barBg: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5 },
  percentileText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    textAlign: 'right',
  },
  domainDesc: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  facetsSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  facetRow: { gap: 2 },
  facetLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facetLabel: {
    fontSize: FontSizes.caption,
    color: Colors.text,
    fontWeight: '500',
  },
  facetValue: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  facetBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  facetBarFill: { height: '100%', borderRadius: 3 },

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
