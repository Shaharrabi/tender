/**
 * OurFieldTab — "The Space Between You" tab in the couple portal.
 *
 * The crown jewel: two people's WEARE data synthesized into
 * relationship intelligence. Shows side-by-side variables,
 * couple narrative from bottleneck + movement phase,
 * and a targeted practice recommendation.
 *
 * Never says "WEARE" — uses warm field language throughout.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import ThreeLayerDashboard from '@/components/portrait/ThreeLayerDashboard';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { getLatestWEAREProfile } from '@/services/weare';
import type { WEAREProfile, WEAREVariableName, WEAREScoreRow } from '@/types/weare';
import type { CompositeScores } from '@/types';

// ─── Variable Display Names ──────────────────────────────

const VAR_NAMES: Record<WEAREVariableName, string> = {
  attunement: 'Sensing',
  coCreation: 'Building',
  transmission: 'Living it',
  space: 'Breathing room',
  time: 'Showing up',
  individual: 'Inner clarity',
  context: 'Life conditions',
  change: 'Growth openness',
  resistance: 'Holding on',
};

// ─── Movement Phase Narratives ───────────────────────────

const MOVEMENT_TEXT: Record<string, string> = {
  recognition: "You're in a seeing phase — something is coming into focus. Don't try to fix it yet. Let it be seen.",
  release: "Something is softening between you. This is a delicate moment — move gently.",
  resonance: "The field between you is alive. You're creating something together.",
  embodiment: "What you've been learning is becoming who you are. This is rare. Protect it.",
};

// ─── Bottleneck Narratives ──────────────────────────────

const BOTTLENECK_TEXT: Record<string, string> = {
  attunement: "The main growing edge right now is presence — sensing each other before responding.",
  coCreation: "Your differences have energy in them. The invitation is to let that tension create something instead of consuming it.",
  transmission: "You understand more than you're living. The bridge between insight and behavior is the work.",
  space: "There may not be enough room for both of you to be fully yourselves right now. Differentiation is the path.",
  resistance: "Something is holding on. The protective pattern is working overtime. Softening here would change everything.",
  time: "Consistency is the missing ingredient. The field needs regular tending.",
  individual: "Inner resources are stretched thin. Tend to yourself so you can tend to each other.",
  context: "External pressures are weighing heavily. Acknowledging that together changes the conversation.",
  change: "There's an invitation to grow that isn't being taken up yet. Curiosity is the door.",
};

// ─── Bottleneck Practice Recommendations ─────────────────

const BOTTLENECK_PRACTICES: Record<string, { title: string; instruction: string }> = {
  attunement: {
    title: 'The 2-Minute Arrival',
    instruction: 'Before your next conversation that matters, sit together for 2 minutes. No phones. No agenda. Just notice: what does your partner\'s body say before they speak a word?',
  },
  coCreation: {
    title: 'The Difference Prompt',
    instruction: 'Take turns finishing this sentence: "Something I see about us that I don\'t think you see yet is..." Don\'t debate. Just receive.',
  },
  transmission: {
    title: 'One Small Commitment',
    instruction: 'Name one thing you\'ve understood for weeks but haven\'t changed. Not a big thing. Something small. Do it differently once this week.',
  },
  space: {
    title: 'The Separate Walk',
    instruction: 'Take separate walks this week. Don\'t talk about the relationship. Come back and each share one thing you noticed about yourself while alone.',
  },
  resistance: {
    title: 'Dropping the Rope',
    instruction: 'Find the place where you\'re most certain you\'re right about your partner. Sit with this prompt: "What if they\'re not wrong — what if they\'re just different?" Don\'t answer out loud. Just hold the question.',
  },
  time: {
    title: 'The Consistent 5',
    instruction: 'Five minutes, same time, every day this week. Just check in. Consistency matters more than duration.',
  },
  individual: {
    title: 'Inner Check-In First',
    instruction: 'Before your next hard conversation, each of you names one feeling you\'re carrying that has nothing to do with your partner.',
  },
  context: {
    title: 'Name the Weather',
    instruction: 'Tell each other: "Here\'s what\'s weighing on me from outside us." External stress isn\'t a relationship problem — but it affects the field.',
  },
  change: {
    title: 'The Growth Edge',
    instruction: 'Ask each other: "What would you do differently if you weren\'t afraid of getting it wrong?" Listen with curiosity.',
  },
};

// ─── Component ───────────────────────────────────────────

interface OurFieldTabProps {
  coupleId: string;
  userId: string;
  compositeScores?: CompositeScores;
}

export default function OurFieldTab({ coupleId, userId, compositeScores }: OurFieldTabProps) {
  const [profile, setProfile] = useState<WEAREProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [coupleId]);

  async function loadProfile() {
    if (!coupleId) { setLoading(false); return; }
    try {
      const result = await getLatestWEAREProfile(coupleId);
      if (result) {
        setProfile(result);
      }
    } catch (e) {
      // Silently fall back
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCard}>
          <TenderText variant="headingS" color={Colors.primary} align="center" style={{ marginBottom: Spacing.sm }}>
            The Space Between You
          </TenderText>
          <TenderText variant="body" color={Colors.textSecondary} align="center">
            Complete your first weekly check-in together to see what lives in your relational field.
          </TenderText>
        </View>
      </View>
    );
  }

  const bottleneckKey = profile.bottleneck.variable;
  const practice = BOTTLENECK_PRACTICES[bottleneckKey] ?? BOTTLENECK_PRACTICES.attunement;
  const movementNarrative = MOVEMENT_TEXT[profile.movementPhase] ?? '';
  const bottleneckNarrative = BOTTLENECK_TEXT[bottleneckKey] ?? '';

  // Show top 5 variables as bars
  const coreVars: WEAREVariableName[] = ['attunement', 'coCreation', 'transmission', 'space', 'individual'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <TenderText variant="label" color={Colors.textMuted} align="center" style={{ marginBottom: 4 }}>
        THE SPACE BETWEEN YOU
      </TenderText>
      <TenderText variant="body" color={Colors.textSecondary} align="center" style={{ marginBottom: Spacing.lg }}>
        Your relational field — what you're creating together
      </TenderText>

      {/* Section 1: Variable Bars */}
      <View style={styles.variablesCard}>
        {coreVars.map((varName) => {
          const val = profile.variables[varName];
          const pct = Math.min(Math.max((val.raw / 10) * 100, 5), 100);
          return (
            <View key={varName} style={styles.varRow}>
              <TenderText variant="caption" color={Colors.textSecondary} style={styles.varLabel}>
                {VAR_NAMES[varName]}
              </TenderText>
              <View style={styles.varBarTrack}>
                <View style={[styles.varBarFill, { width: `${pct}%`, backgroundColor: pct > 60 ? Colors.success : pct > 35 ? Colors.accentGold : Colors.secondary }]} />
              </View>
              <TenderText variant="caption" color={Colors.textMuted} style={styles.varValue}>
                {val.raw.toFixed(1)}
              </TenderText>
            </View>
          );
        })}
      </View>

      {/* Attunement gap flag — when attunement is notably low */}
      {profile.variables.attunement.raw < 4 && (
        <View style={styles.gapFlag}>
          <TenderText variant="body" color={Colors.secondary}>
            Your sensing of the field is quite different — that gap is worth exploring together.
          </TenderText>
        </View>
      )}

      {/* Section 2: The Narrative */}
      <View style={styles.narrativeCard}>
        <TenderText variant="label" color={Colors.textMuted} style={{ marginBottom: Spacing.sm }}>
          WHAT THIS MEANS
        </TenderText>
        {movementNarrative ? (
          <TenderText variant="body" color={Colors.textSecondary} style={{ marginBottom: Spacing.md }}>
            {movementNarrative}
          </TenderText>
        ) : null}
        {bottleneckNarrative ? (
          <TenderText variant="body" color={Colors.textSecondary}>
            {bottleneckNarrative}
          </TenderText>
        ) : null}
      </View>

      {/* Section 3: Now What */}
      <View style={styles.practiceCard}>
        <TenderText variant="label" color={Colors.primary} style={{ marginBottom: Spacing.sm }}>
          NOW WHAT
        </TenderText>
        <TenderText variant="headingS" style={{ marginBottom: Spacing.sm }}>
          {practice.title}
        </TenderText>
        <TenderText variant="body" color={Colors.textSecondary}>
          {practice.instruction}
        </TenderText>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  variablesCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  varRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  varLabel: {
    width: 90,
  },
  varBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  varBarFill: {
    height: 8,
    borderRadius: 4,
  },
  varValue: {
    width: 30,
    textAlign: 'right',
  },
  gapFlag: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
  },
  narrativeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  practiceCard: {
    backgroundColor: Colors.primaryFaded ?? Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
});
