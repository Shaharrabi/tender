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
import { RDASScores } from '@/types/couples';
import { Colors, Spacing, FontSizes, FontFamilies, Typography, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';

interface Props {
  scores: RDASScores;
}

const DISTRESS_INFO: Record<
  RDASScores['distressLevel'],
  {
    warmLabel: string;
    interpretation: string;
    fieldInsight: string;
    growthEdge: string;
  }
> = {
  'non-distressed': {
    warmLabel: 'Your Relationship Has Solid Ground',
    interpretation:
      'Your responses suggest a relationship where both of you tend to find common ground, feel satisfied with how things are going, and stay connected through shared activities and conversation. This doesn\'t mean everything is perfect \u2014 no relationship is \u2014 but it does mean you\'ve built real strengths together. The way you navigate disagreements, lean on each other, and make time to connect reflects a partnership that has learned to hold both closeness and difference with care.',
    fieldInsight:
      'Couples with strong adjustment scores often share something subtle: the ability to repair quickly after small disconnections. You may not even notice it \u2014 a gentle touch after a tense moment, circling back to a topic that was left unfinished, or simply choosing to stay curious about each other even when it would be easier to disengage. These micro-moments of turning toward each other are the invisible architecture of your bond.',
    growthEdge:
      'Even in well-adjusted relationships, there are quiet places where growth waits. Consider where you might be coasting on comfortable patterns rather than deepening. Are there conversations you\'ve been putting off because things are "fine"? Sometimes the next level of intimacy lives just past the edge of what feels safe to say.',
  },
  mild: {
    warmLabel: 'There Are Places That Need Tending',
    interpretation:
      'Your scores point to a relationship that has genuine strengths but is also carrying some strain. Maybe certain topics have become harder to talk about, or the rhythm of daily life has quietly pulled you into parallel tracks rather than shared ones. This is more common than you might think \u2014 and naming it is the first step toward something different. The fact that you\'re here, looking honestly at your relationship, says something important about what you want for it.',
    fieldInsight:
      'When couples experience mild distress, it often shows up first in the small moments: fewer spontaneous conversations, a slight pulling back from physical affection, or the feeling that disagreements circle without resolving. These aren\'t signs of failure \u2014 they\'re signals. Your relationship is asking for attention in specific places, and those places are reachable.',
    growthEdge:
      'Start with the gap between your consensus and cohesion scores. Where you agree on important matters but spend less time truly engaging together, the relationship can begin to feel like a well-run partnership rather than an intimate bond. Try reintroducing small moments of genuine curiosity \u2014 ask a question you don\'t know the answer to, or share something you haven\'t said out loud yet.',
  },
  moderate: {
    warmLabel: 'There Are Places That Need Tending',
    interpretation:
      'Your responses reflect a relationship that is under meaningful stress. This doesn\'t mean your relationship is broken \u2014 it means something important needs attention. Perhaps conflict has become frequent or hard to resolve, perhaps one or both of you has started to withdraw, or perhaps the sense of being truly "together" has faded under the weight of life\'s demands. Whatever the shape of it, this is a moment of honesty, and honesty is where change begins.',
    fieldInsight:
      'Moderate distress often develops when small disconnections accumulate without repair. Over time, unresolved disagreements can harden into positions, and the space between partners fills with assumptions rather than understanding. But here\'s what matters: the patterns that created this distance are patterns \u2014 and patterns can be changed. Beneath the frustration and fatigue, there is usually still a longing to be known and held by the person you chose.',
    growthEdge:
      'Right now, the most powerful thing you can do is slow down and listen \u2014 not to fix, not to defend, but to understand. Consider working with a couples therapist or structured program that can help you both feel safe enough to be honest. Your relationship isn\'t asking for perfection; it\'s asking for presence.',
  },
  severe: {
    warmLabel: 'There Are Places That Need Tending',
    interpretation:
      'Your scores suggest your relationship is experiencing significant strain across multiple areas \u2014 in how you find agreement, how satisfied you feel, and how connected you are day to day. This can feel overwhelming, and it\'s important to hear this: seeking clarity about where you are is an act of courage, not defeat. Many couples who have felt this level of distress have found their way back to each other with the right support.',
    fieldInsight:
      'When distress reaches this level, it often means the relationship has been under pressure for a while. You may be caught in cycles \u2014 pursuit and withdrawal, criticism and defensiveness \u2014 that neither of you chose but both of you feel trapped in. These cycles are not who you are; they are what happens when two people stop feeling safe enough to be vulnerable with each other. Understanding this distinction is the doorway to something new.',
    growthEdge:
      'At this stage, self-guided work alone may not be enough. Consider reaching out to a licensed couples therapist, particularly one trained in Emotionally Focused Therapy (EFT) or the Gottman Method. Having a skilled third person in the room can help you both feel heard in ways that may have become impossible on your own. You deserve support \u2014 and asking for it is a sign of strength.',
  },
};

export default function RDASResults({ scores }: Props) {
  const router = useRouter();
  const { total, consensus, satisfaction, cohesion, distressLevel } = scores;
  const info = DISTRESS_INFO[distressLevel];

  const totalPercent = (total / 69) * 100;
  const consensusPercent = (consensus / 30) * 100;
  const satisfactionPercent = (satisfaction / 20) * 100;
  const cohesionPercent = (cohesion / 20) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>How You Navigate Together</Text>
          <Text style={styles.subtitle}>Your relationship adjustment and consensus</Text>
        </View>

        {/* Total Score Card */}
        <View style={styles.scoresSection}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Overall Adjustment</Text>
            <Text style={styles.scoreValue}>{total}</Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${totalPercent}%` }]} />
            </View>
            <Text style={styles.scoreRange}>0 — 69</Text>
          </View>

          {/* Subscale Cards */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Consensus</Text>
            <Text style={styles.scoreValue}>{consensus}</Text>
            <View style={styles.scoreBarBg}>
              <View
                style={[
                  styles.scoreBarFill,
                  styles.scoreBarFillConsensus,
                  { width: `${consensusPercent}%` },
                ]}
              />
            </View>
            <Text style={styles.scoreRange}>0 — 30</Text>
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Satisfaction</Text>
            <Text style={styles.scoreValue}>{satisfaction}</Text>
            <View style={styles.scoreBarBg}>
              <View
                style={[
                  styles.scoreBarFill,
                  styles.scoreBarFillSatisfaction,
                  { width: `${satisfactionPercent}%` },
                ]}
              />
            </View>
            <Text style={styles.scoreRange}>0 — 20</Text>
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Cohesion</Text>
            <Text style={styles.scoreValue}>{cohesion}</Text>
            <View style={styles.scoreBarBg}>
              <View
                style={[
                  styles.scoreBarFill,
                  styles.scoreBarFillCohesion,
                  { width: `${cohesionPercent}%` },
                ]}
              />
            </View>
            <Text style={styles.scoreRange}>0 — 20</Text>
          </View>
        </View>

        {/* Warm Label + Distress Classification */}
        <View style={styles.styleSection}>
          <Text style={styles.warmLabel}>{info.warmLabel}</Text>
          <Text style={styles.styleLabel}>
            {distressLevel === 'non-distressed'
              ? 'Well-Adjusted'
              : distressLevel === 'mild'
                ? 'Mildly Strained'
                : distressLevel === 'moderate'
                  ? 'Under Pressure'
                  : 'Significantly Strained'}
          </Text>
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

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(app)/partner')}
          >
            <Text style={styles.primaryButtonText}>Back to Partner</Text>
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
  scoreBarFillConsensus: { backgroundColor: Colors.accentGold },
  scoreBarFillSatisfaction: { backgroundColor: Colors.calm },
  scoreBarFillCohesion: { backgroundColor: Colors.success },
  scoreRange: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  styleSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  warmLabel: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  styleLabel: {
    ...Typography.serifHeading,
    color: Colors.primary,
  },
  interpretationSection: { marginBottom: Spacing.lg },
  interpretationText: {
    ...Typography.body,
    color: Colors.text,
  },
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
