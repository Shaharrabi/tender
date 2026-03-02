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
import type { RelationalFieldScores } from '@/types';
import { Colors, Spacing, FontSizes, FontFamilies, Typography, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';

interface Props {
  scores: RelationalFieldScores;
}

const SUBSCALE_INFO: Record<
  string,
  { label: string; description: string; color: string }
> = {
  fieldRecognition: {
    label: 'Field Recognition',
    description:
      'How well you sense the relational space between you — that something larger emerges when you are truly present together.',
    color: Colors.primary,
  },
  creativeTension: {
    label: 'Holding Creative Tension',
    description:
      'Your ability to hold differences and disagreements without forcing resolution — letting tension become a generative force.',
    color: Colors.accentGold,
  },
  presenceAttunement: {
    label: 'Presence & Attunement',
    description:
      'How present and attuned you are with your partner — noticing what is happening between you before reacting.',
    color: Colors.calm,
  },
  emergentOrientation: {
    label: 'Emergent Orientation',
    description:
      'Your openness to what the relationship is becoming — trusting that wisdom emerges when both partners show up honestly.',
    color: Colors.success,
  },
};

function getOverallInsight(totalMean: number): {
  warmLabel: string;
  interpretation: string;
  growthEdge: string;
} {
  if (totalMean >= 5.5) {
    return {
      warmLabel: 'Deep Field Awareness',
      interpretation:
        'You demonstrate a strong awareness of the relational field — the living space between you and your partner. You can sense shifts in connection, hold creative tension, stay present, and trust what emerges. This is a rare and beautiful capacity that deepens intimacy in ways that most relationship advice never touches.',
      growthEdge:
        'Your growth edge may be in sharing this awareness with your partner more explicitly. Sometimes those who sense the field most clearly carry the work of tending it alone. Consider inviting your partner into naming what you both feel between you.',
    };
  }
  if (totalMean >= 4.5) {
    return {
      warmLabel: 'Growing Field Awareness',
      interpretation:
        'You have a developing awareness of the relational field. You can often sense when the space between you shifts, and you have some capacity to hold tension and stay present. There are likely areas where this awareness is strong and others where old habits of reactivity or distraction take over.',
      growthEdge:
        'Notice which subscale scored lowest — that is where your relational field is asking for your attention. Even small shifts in awareness create ripple effects across your entire relationship.',
    };
  }
  if (totalMean >= 3.5) {
    return {
      warmLabel: 'Emerging Awareness',
      interpretation:
        'Your awareness of the relational field is emerging. You may have moments of deep connection and presence, interspersed with times when the space between you feels invisible or unimportant. This is a natural starting point — most of us were never taught to attend to what lives between us.',
      growthEdge:
        'Begin with simple practices: pause before responding in a conversation, notice the mood in the room when you are both home, or ask your partner "what is happening between us right now?" These small acts of attention build the muscle of field awareness.',
    };
  }
  return {
    warmLabel: 'Beginning the Journey',
    interpretation:
      'The concept of a relational field — a living space between you and your partner — may be new to you. This is completely fine. Most people focus on themselves or their partner as individuals, not on what exists between them. Your willingness to explore this dimension is the first step.',
    growthEdge:
      'Start by simply noticing: after a meaningful interaction with your partner, pause and ask yourself — what was the quality of the space between us? Warm? Tense? Open? Closed? Over time, this awareness naturally deepens.',
  };
}

export default function RFASResults({ scores }: Props) {
  const router = useRouter();
  const { totalScore, totalMean, fieldRecognition, creativeTension, presenceAttunement, emergentOrientation } = scores;

  const subscales = {
    fieldRecognition,
    creativeTension,
    presenceAttunement,
    emergentOrientation,
  };

  const insight = getOverallInsight(totalMean);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>The Space Between You</Text>
          <Text style={styles.subtitle}>Your relational field awareness</Text>
        </View>

        {/* Overall Score */}
        <View style={styles.overallCard}>
          <Text style={styles.overallLabel}>Overall Field Awareness</Text>
          <Text style={styles.overallScore}>{totalMean.toFixed(1)}</Text>
          <Text style={styles.overallRange}>out of 7.0</Text>
          <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBarFill, { width: `${(totalMean / 7) * 100}%` }]} />
          </View>
        </View>

        {/* Warm Label */}
        <View style={styles.warmSection}>
          <Text style={styles.warmLabel}>{insight.warmLabel}</Text>
        </View>

        {/* Subscale Cards */}
        <Text style={styles.sectionTitle}>Your Four Dimensions</Text>
        {Object.entries(subscales).map(([key, value]) => {
          const info = SUBSCALE_INFO[key];
          const percent = (value.mean / 7) * 100;
          return (
            <View key={key} style={styles.subscaleCard}>
              <View style={styles.subscaleHeader}>
                <Text style={styles.subscaleLabel}>{info.label}</Text>
                <Text style={styles.subscaleScore}>{value.mean.toFixed(1)}</Text>
              </View>
              <View style={styles.scoreBarBg}>
                <View
                  style={[
                    styles.scoreBarFill,
                    { width: `${percent}%`, backgroundColor: info.color },
                  ]}
                />
              </View>
              <Text style={styles.subscaleDesc}>{info.description}</Text>
            </View>
          );
        })}

        {/* Interpretation */}
        <View style={styles.interpretationSection}>
          <Text style={styles.interpretationText}>{insight.interpretation}</Text>
        </View>

        {/* Growth Edge */}
        <View style={styles.growthSection}>
          <Text style={styles.growthHeader}>Your Growth Edge</Text>
          <Text style={styles.growthText}>{insight.growthEdge}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(app)/couple-portal')}
            accessibilityRole="button"
            accessibilityLabel="Go to Couple Portal"
          >
            <Text style={styles.primaryButtonText}>Go to Couple Portal</Text>
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

  overallCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  overallLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  overallScore: {
    fontFamily: FontFamilies.accent,
    fontSize: 48,
    letterSpacing: -0.5,
    color: Colors.text,
  },
  overallRange: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  scoreBarBg: {
    height: 8,
    width: '100%',
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },

  warmSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  warmLabel: {
    ...Typography.serifHeading,
    color: Colors.primary,
  },

  sectionTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  subscaleCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  subscaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscaleLabel: {
    ...Typography.label,
    color: Colors.text,
    fontWeight: '600',
  },
  subscaleScore: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.headingM,
    color: Colors.text,
  },
  subscaleDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: Spacing.xs,
  },

  interpretationSection: { marginTop: Spacing.md, marginBottom: Spacing.lg },
  interpretationText: {
    ...Typography.body,
    color: Colors.text,
  },

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
