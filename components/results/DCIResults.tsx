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
import { DCIScores } from '@/types/couples';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  Typography,
  ButtonSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';

// ─── Subscale display config ──────────────────────────────

interface SubscaleConfig {
  key: string;
  label: string;
  /** Combined score from self + partner items */
  getScore: (s: DCIScores) => number;
  /** Min possible combined score */
  min: number;
  /** Max possible combined score */
  max: number;
  /** For Negative Coping, lower is better */
  lowerIsBetter?: boolean;
  getInterpretation: (score: number, max: number) => string;
}

const SUBSCALES: SubscaleConfig[] = [
  {
    key: 'stressCommunication',
    label: 'Stress Communication',
    getScore: (s) => s.stressCommunicationBySelf + s.stressCommunicationByPartner,
    min: 8,
    max: 40,
    getInterpretation: (score, max) => {
      const pct = (score - 8) / (max - 8);
      if (pct >= 0.66)
        return 'You and your partner are skilled at letting each other know when stress is present. This openness creates space for support before things build up.';
      if (pct >= 0.33)
        return 'There are moments when stress gets communicated clearly, and others when it stays hidden. Building small rituals of checking in can bridge those quiet gaps.';
      return 'Stress often goes unspoken between you, which can leave both partners feeling alone in difficult moments. Even small signals of "I\'m struggling" can open the door.';
    },
  },
  {
    key: 'supportiveCoping',
    label: 'Supportive Coping',
    getScore: (s) => s.supportiveBySelf + s.supportiveByPartner,
    min: 8,
    max: 40,
    getInterpretation: (score, max) => {
      const pct = (score - 8) / (max - 8);
      if (pct >= 0.66)
        return 'When one of you is hurting, the other shows up with empathy and care. This kind of emotional attunement is the bedrock of a resilient partnership.';
      if (pct >= 0.33)
        return 'Support is there, though it may not always land the way it\'s intended. Sometimes the most helpful thing is simply asking, "What do you need from me right now?"';
      return 'Finding ways to truly support each other under stress is still a growing edge. It\'s not about fixing\u2014it\'s about being present and saying, "I\'m here."';
    },
  },
  {
    key: 'delegatedCoping',
    label: 'Delegated Coping',
    getScore: (s) => s.delegatedBySelf + s.delegatedByPartner,
    min: 2,
    max: 10,
    getInterpretation: (score, max) => {
      const pct = (score - 2) / (max - 2);
      if (pct >= 0.66)
        return 'You\'re both willing to pick up the slack when your partner is overwhelmed. This practical generosity says "your load is my load too."';
      if (pct >= 0.33)
        return 'There\'s some willingness to step in and lighten the load, though it could happen more consistently. Small acts of taking over go a long way.';
      return 'When stress hits, tasks tend to stay on the overwhelmed partner\'s plate. Learning to say "I\'ve got this one" can be a quiet but powerful act of love.';
    },
  },
  {
    key: 'negativeCoping',
    label: 'Negative Coping',
    getScore: (s) => s.negativeBySelf + s.negativeByPartner,
    min: 8,
    max: 40,
    lowerIsBetter: true,
    getInterpretation: (score, max) => {
      const pct = (score - 8) / (max - 8);
      if (pct <= 0.33)
        return 'Very little hostility or dismissiveness shows up when stress enters the room. You\'ve learned to hold space without turning against each other.';
      if (pct <= 0.66)
        return 'Some stress responses\u2014like withdrawing, minimizing, or subtle blame\u2014creep in at times. Noticing these patterns is the first step toward softening them.';
      return 'Stress tends to bring out reactions that push you apart rather than pull you together. These patterns are protective, not personal\u2014and they can be gently reshaped.';
    },
  },
  {
    key: 'commonCoping',
    label: 'Common Coping',
    getScore: (s) => s.commonCoping,
    min: 5,
    max: 25,
    getInterpretation: (score, max) => {
      const pct = (score - 5) / (max - 5);
      if (pct >= 0.66)
        return 'When life is hard, you face it as a team. This "we\'re in it together" stance is one of the strongest predictors of relationship resilience.';
      if (pct >= 0.33)
        return 'You sometimes come together to problem-solve, but there\'s room to lean into the partnership more fully when stress arrives.';
      return 'Stress tends to be handled individually rather than as a shared challenge. Building even one small "together" ritual during hard times can shift this pattern.';
    },
  },
];

// ─── Overall quality config ─────────────────────────────

type CopingQuality = DCIScores['copingQuality'];

interface QualityConfig {
  badge: string;
  badgeColor: string;
  interpretation: string;
  fieldInsight: string;
  growthEdge: string;
}

const QUALITY_MAP: Record<CopingQuality, QualityConfig> = {
  strong: {
    badge: 'Strong Coping',
    badgeColor: Colors.success,
    interpretation:
      "You've built strong patterns of mutual support. When stress knocks on the door, you tend to open it together rather than retreating to separate rooms. This doesn't mean things are always easy\u2014it means you've developed the muscle of turning toward each other when it matters most.",
    fieldInsight:
      "The space between you has become a refuge rather than a battlefield. When one partner carries stress, the other notices and responds\u2014not perfectly, but consistently. This creates a felt sense of safety that allows both of you to be honest about what's hard.",
    growthEdge:
      "Even strong coping patterns benefit from attention. Notice which forms of support come naturally and which ones require more effort. Sometimes the growth edge for resilient couples is learning to receive help as gracefully as they give it.",
  },
  adequate: {
    badge: 'Moderate Coping',
    badgeColor: Colors.accentGold,
    interpretation:
      "Your coping patterns have both strengths and growing edges. There are moments when you show up beautifully for each other, and others where stress pulls you into separate corners. This is honest and human\u2014and it's also workable territory.",
    fieldInsight:
      "The space between you shifts depending on the weather. On calmer days, there's warmth and attunement. Under pressure, old patterns\u2014withdrawal, criticism, going it alone\u2014can surface. The good news is that you already know what connection feels like; the work is making it more available under stress.",
    growthEdge:
      "Pay attention to the moment stress enters the room. That's the choice point\u2014the instant before you default to your usual pattern. A simple \"I'm feeling overwhelmed\" or \"Can we tackle this together?\" can redirect the whole interaction.",
  },
  weak: {
    badge: 'Needs Strengthening',
    badgeColor: Colors.error,
    interpretation:
      "Stress has a way of revealing where the support system needs strengthening. Your patterns suggest that when life gets hard, you each tend to cope alone\u2014or the ways you try to help may not be landing as intended. This isn't a verdict; it's a starting place.",
    fieldInsight:
      "The space between you may feel thin or charged when stress is present. One partner's distress might go unseen, or attempts at support might feel clumsy or mismatched. This often comes from learning\u2014in earlier relationships or families\u2014that stress is something you handle on your own.",
    growthEdge:
      "Start with the smallest possible unit of togetherness under stress. Before trying to solve anything, try sitting with each other's experience for just a few minutes. \"Tell me what this is like for you\" is a sentence that can begin to change everything.",
  },
};

// ─── Component ──────────────────────────────────────────

interface Props {
  scores: DCIScores;
}

export default function DCIResults({ scores }: Props) {
  const router = useRouter();
  const quality = QUALITY_MAP[scores.copingQuality];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How You Weather Storms Together</Text>
          <Text style={styles.subtitle}>
            Your patterns of coping with stress as a couple
          </Text>
        </View>

        {/* Overall Quality Badge */}
        <View
          style={[styles.qualityBadge, { backgroundColor: quality.badgeColor + '18' }]}
        >
          <Text style={[styles.qualityBadgeLabel, { color: quality.badgeColor }]}>
            Overall Coping Quality
          </Text>
          <Text style={[styles.qualityBadgeValue, { color: quality.badgeColor }]}>
            {quality.badge}
          </Text>
        </View>

        {/* Subscale Cards */}
        <View style={styles.scoresSection}>
          {SUBSCALES.map((sub) => {
            const score = sub.getScore(scores);
            const range = sub.max - sub.min;
            const rawPct = ((score - sub.min) / range) * 100;
            // For negative coping, invert the fill so lower score = more fill (good)
            const fillPct = sub.lowerIsBetter ? 100 - rawPct : rawPct;
            const barColor = sub.lowerIsBetter
              ? rawPct <= 33
                ? Colors.success
                : rawPct <= 66
                  ? Colors.accentGold
                  : Colors.error
              : Colors.primary;

            return (
              <View key={sub.key} style={styles.scoreCard}>
                <Text style={styles.scoreLabel}>{sub.label}</Text>
                {sub.lowerIsBetter && (
                  <Text style={styles.scoreHint}>Lower is better</Text>
                )}
                <Text style={styles.scoreValue}>{score}</Text>
                <View style={styles.scoreBarBg}>
                  <View
                    style={[
                      styles.scoreBarFill,
                      { width: `${fillPct}%`, backgroundColor: barColor },
                    ]}
                  />
                </View>
                <Text style={styles.scoreRange}>
                  {sub.min} \u2014 {sub.max}
                </Text>
                <Text style={styles.scoreInterpretation}>
                  {sub.getInterpretation(score, sub.max)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Warm Interpretation */}
        <View style={styles.interpretationSection}>
          <Text style={styles.interpretationText}>{quality.interpretation}</Text>
        </View>

        {/* The Space Between You */}
        <View style={styles.insightSection}>
          <Text style={styles.insightHeader}>The Space Between You</Text>
          <Text style={styles.insightText}>{quality.fieldInsight}</Text>
        </View>

        {/* Growth Edge */}
        <View style={styles.growthSection}>
          <Text style={styles.growthHeader}>Your Growth Edge</Text>
          <Text style={styles.growthText}>{quality.growthEdge}</Text>
        </View>

        {/* Continue Button */}
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

// ─── Styles ─────────────────────────────────────────────

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

  // Quality badge
  qualityBadge: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  qualityBadgeLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  qualityBadgeValue: {
    ...Typography.serifHeading,
  },

  // Score cards
  scoresSection: { gap: Spacing.md, marginBottom: Spacing.xl },
  scoreCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  scoreLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  scoreHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  scoreValue: {
    fontFamily: FontFamilies.accent,
    fontSize: 36,
    letterSpacing: -0.5,
    color: Colors.text,
  },
  scoreBarBg: {
    height: 8,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
  },
  scoreRange: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  scoreInterpretation: {
    ...Typography.body,
    color: Colors.text,
    marginTop: Spacing.xs,
  },

  // Warm interpretation
  interpretationSection: { marginBottom: Spacing.lg },
  interpretationText: {
    ...Typography.body,
    color: Colors.text,
  },

  // Insight section
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

  // Growth section
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

  // Actions
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
