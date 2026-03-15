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
import type { CoupleFieldScores } from '@/types';
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

interface Props {
  scores: CoupleFieldScores;
}

// ─── Helpers ──────────────────────────────────────────────

const SELF_MOVE_LABELS: Record<string, string> = {
  A: 'Move toward your partner',
  B: 'Move away',
  C: 'Freeze',
  D: 'Fight',
  pursue: 'Move toward your partner',
  withdraw: 'Move away',
  freeze: 'Freeze',
  fight: 'Fight',
};

const PARTNER_ATTRIBUTION_LABELS: Record<string, string> = {
  A: 'Pulling away',
  B: 'Attacking',
  C: 'Not caring',
  D: 'Trying to control',
  withdrawing: 'Pulling away',
  attacking: 'Attacking',
  indifferent: 'Not caring',
  controlling: 'Trying to control',
};

function getLikertLabel(value: number): string {
  if (value >= 6) return 'Strongly';
  if (value >= 5) return 'Clearly';
  if (value >= 4) return 'Somewhat';
  if (value >= 3) return 'Beginning to';
  return 'Not yet';
}

function getOverallInsight(scores: CoupleFieldScores): {
  warmLabel: string;
  interpretation: string;
  growthEdge: string;
} {
  const p = scores.patternSection;
  const r = scores.resourceSection;
  const g = scores.growingEdgeSection;

  // Average Likert scores across all sections
  const likertValues = [
    p.cycleAwareness ?? 4,
    p.patternProtection ?? 4,
    r.uniqueTogetherness ?? 4,
    r.emergentGoodness ?? 4,
    g.learningFromPartner ?? 4,
    g.willingnessToBeChanged ?? 4,
  ];
  const avg = likertValues.reduce((a, b) => a + b, 0) / likertValues.length;

  if (avg >= 5.5) {
    return {
      warmLabel: 'Deep Relational Awareness',
      interpretation:
        'You see your relationship with remarkable clarity. You can name your patterns without blame, recognize the unique resources between you, and hold the tension of growth with willingness. This awareness is itself a relational resource.',
      growthEdge:
        'Your edge may be in the gap between seeing and doing. Awareness is the foundation, but the invitation now is to act on what you see — to let your understanding change how you show up in the moments that matter most.',
    };
  }
  if (avg >= 4.5) {
    return {
      warmLabel: 'Growing Relational Awareness',
      interpretation:
        'You have real awareness of what lives between you and your partner. You can see some patterns clearly and are beginning to hold them without judgment. The resources in your relationship are visible to you, even if they sometimes get lost in the hard moments.',
      growthEdge:
        'Notice where your awareness is strongest and where it drops away. The areas where you lose sight of the pattern are where the most growth is waiting.',
    };
  }
  if (avg >= 3.5) {
    return {
      warmLabel: 'Emerging Awareness',
      interpretation:
        'You are beginning to see the space between you and your partner as its own living thing — with patterns, resources, and edges. This is a significant shift from seeing the relationship as just "me and you."',
      growthEdge:
        'Start with curiosity rather than certainty. When conflict arises, try asking "what is our pattern doing right now?" instead of "who is right?" That single question changes everything.',
    };
  }
  return {
    warmLabel: 'Beginning the Exploration',
    interpretation:
      'Looking at your relationship as a field — something that exists between you, not just in you — may be new territory. That is completely fine. The fact that you completed this assessment means you are already willing to look, and willingness is the most important ingredient.',
    growthEdge:
      'Begin with one simple practice: after your next meaningful interaction with your partner, pause and notice what quality was in the space between you. Warm? Tense? Playful? Heavy? Over time, this noticing becomes natural.',
  };
}

// ─── Component ──────────────────────────────────────────

export default function CoupleFieldResults({ scores }: Props) {
  const router = useRouter();
  const { patternSection: p, resourceSection: r, growingEdgeSection: g } = scores;
  const insight = getOverallInsight(scores);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>What Lives Between You</Text>
          <Text style={styles.subtitle}>Your couple field assessment</Text>
        </View>

        {/* Warm Label */}
        <View style={styles.warmSection}>
          <Text style={styles.warmLabel}>{insight.warmLabel}</Text>
        </View>

        {/* Section 1: Our Pattern */}
        <Text style={styles.sectionTitle}>Your Pattern</Text>
        <View style={styles.sectionCard}>
          {p.cycleDescription ? (
            <View style={styles.reflectionBlock}>
              <Text style={styles.reflectionLabel}>What happens when things go wrong:</Text>
              <Text style={styles.reflectionText}>"{p.cycleDescription}"</Text>
            </View>
          ) : null}

          <View style={styles.choiceRow}>
            <Text style={styles.choiceLabel}>When the pattern starts, you:</Text>
            <Text style={styles.choiceValue}>
              {SELF_MOVE_LABELS[p.selfMove] || p.selfMove || 'Not answered'}
            </Text>
          </View>

          <View style={styles.choiceRow}>
            <Text style={styles.choiceLabel}>You perceive your partner as:</Text>
            <Text style={styles.choiceValue}>
              {PARTNER_ATTRIBUTION_LABELS[p.partnerAttribution] || p.partnerAttribution || 'Not answered'}
            </Text>
          </View>

          <View style={styles.likertRow}>
            <Text style={styles.likertLabel}>
              Cycle awareness: {getLikertLabel(p.cycleAwareness ?? 4)} seeing it
            </Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${((p.cycleAwareness ?? 4) / 7) * 100}%` }]} />
            </View>
          </View>

          <View style={styles.likertRow}>
            <Text style={styles.likertLabel}>
              Pattern as protection: {getLikertLabel(p.patternProtection ?? 4)} understanding it
            </Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${((p.patternProtection ?? 4) / 7) * 100}%` }]} />
            </View>
          </View>
        </View>

        {/* Section 2: Our Resources */}
        <Text style={styles.sectionTitle}>Your Resources</Text>
        <View style={styles.sectionCard}>
          {r.uniqueEmergence ? (
            <View style={styles.reflectionBlock}>
              <Text style={styles.reflectionLabel}>What emerges uniquely between you:</Text>
              <Text style={styles.reflectionText}>"{r.uniqueEmergence}"</Text>
            </View>
          ) : null}

          {r.bestQualityWord ? (
            <View style={styles.reflectionBlock}>
              <Text style={styles.reflectionLabel}>At your best, the space between you is:</Text>
              <Text style={styles.qualityWord}>{r.bestQualityWord}</Text>
            </View>
          ) : null}

          {r.signatureRitual ? (
            <View style={styles.reflectionBlock}>
              <Text style={styles.reflectionLabel}>Your signature ritual:</Text>
              <Text style={styles.reflectionText}>"{r.signatureRitual}"</Text>
            </View>
          ) : null}

          <View style={styles.likertRow}>
            <Text style={styles.likertLabel}>
              Unique togetherness: {getLikertLabel(r.uniqueTogetherness ?? 4)}
            </Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${((r.uniqueTogetherness ?? 4) / 7) * 100}%`, backgroundColor: Colors.calm }]} />
            </View>
          </View>

          <View style={styles.likertRow}>
            <Text style={styles.likertLabel}>
              Emergent goodness: {getLikertLabel(r.emergentGoodness ?? 4)}
            </Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${((r.emergentGoodness ?? 4) / 7) * 100}%`, backgroundColor: Colors.calm }]} />
            </View>
          </View>
        </View>

        {/* Section 3: Our Growing Edge */}
        <Text style={styles.sectionTitle}>Your Growing Edge</Text>
        <View style={styles.sectionCard}>
          {g.enrichingDifference ? (
            <View style={styles.reflectionBlock}>
              <Text style={styles.reflectionLabel}>A difference that challenges and enriches:</Text>
              <Text style={styles.reflectionText}>"{g.enrichingDifference}"</Text>
            </View>
          ) : null}

          {g.controlFear ? (
            <View style={styles.reflectionBlock}>
              <Text style={styles.reflectionLabel}>What you fear if you let go of control:</Text>
              <Text style={styles.reflectionText}>"{g.controlFear}"</Text>
            </View>
          ) : null}

          {g.uncertainCertainty ? (
            <View style={styles.reflectionBlock}>
              <Text style={styles.reflectionLabel}>A certainty about your partner that might be wrong:</Text>
              <Text style={styles.reflectionText}>"{g.uncertainCertainty}"</Text>
            </View>
          ) : null}

          <View style={styles.likertRow}>
            <Text style={styles.likertLabel}>
              Learning from partner: {getLikertLabel(g.learningFromPartner ?? 4)}
            </Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${((g.learningFromPartner ?? 4) / 7) * 100}%`, backgroundColor: Colors.success }]} />
            </View>
          </View>

          <View style={styles.likertRow}>
            <Text style={styles.likertLabel}>
              Willingness to be changed: {getLikertLabel(g.willingnessToBeChanged ?? 4)}
            </Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, { width: `${((g.willingnessToBeChanged ?? 4) / 7) * 100}%`, backgroundColor: Colors.success }]} />
            </View>
          </View>
        </View>

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
  subtitle: { ...Typography.body, color: Colors.textSecondary },

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
    marginTop: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  sectionCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  reflectionBlock: {
    gap: Spacing.xs,
  },
  reflectionLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  reflectionText: {
    ...Typography.body,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  qualityWord: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.headingM,
    color: Colors.primary,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },

  choiceRow: {
    gap: Spacing.xs,
  },
  choiceLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  choiceValue: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },

  likertRow: {
    gap: Spacing.xs,
  },
  likertLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
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

  interpretationSection: { marginTop: Spacing.md, marginBottom: Spacing.lg },
  interpretationText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
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
