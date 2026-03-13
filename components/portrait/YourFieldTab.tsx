/**
 * YourFieldTab — "Your Field" tab in the individual portrait screen.
 *
 * Shows the user's individual WEARE contribution with warm language.
 * Never says "WEARE" — uses "Your Field", "the space between you", etc.
 *
 * Displays:
 * 1. Resonance Pulse visual
 * 2. Strongest variable + variable that needs care
 * 3. Emergence direction narrative
 * 4. Bottleneck-targeted practice recommendation
 *
 * Falls back gracefully when no WEARE data exists yet.
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import ThreeLayerDashboard from './ThreeLayerDashboard';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { getLatestWEAREProfile } from '@/services/weare';
import { getMyCouple } from '@/services/couples';
import type { WEAREProfile, WEAREVariableName } from '@/types/weare';
import type { CompositeScores } from '@/types';

// ─── Variable Display Names ──────────────────────────────

const VARIABLE_DISPLAY_NAMES: Record<WEAREVariableName, string> = {
  attunement: 'Sensing the field',
  coCreation: 'Building together',
  transmission: 'Living what you know',
  space: 'Room to breathe',
  time: 'Showing up',
  individual: 'Inner clarity',
  context: 'Life conditions',
  change: 'Openness to growth',
  resistance: 'What\'s holding',
};

// ─── Bottleneck Practice Recommendations ─────────────────

const BOTTLENECK_PRACTICES: Record<string, { title: string; instruction: string }> = {
  attunement: {
    title: 'The 2-Minute Arrival',
    instruction: 'Before your next conversation that matters, sit for 2 minutes. No phones. No agenda. Just notice: what\'s the temperature in the room?',
  },
  coCreation: {
    title: 'The Difference Prompt',
    instruction: 'Finish this sentence: "Something I see about us that I don\'t think you see yet is..." Don\'t debate. Just receive.',
  },
  transmission: {
    title: 'One Small Commitment',
    instruction: 'Name one thing you\'ve understood for weeks but haven\'t changed. Something small. Do it differently once this week.',
  },
  space: {
    title: 'The Separate Walk',
    instruction: 'Take a walk alone this week. Don\'t think about the relationship. Come back and notice one thing about yourself.',
  },
  resistance: {
    title: 'Dropping the Rope',
    instruction: 'Find the place where you\'re most certain you\'re right. Sit with this: "What if they\'re not wrong — what if they\'re just different?"',
  },
  time: {
    title: 'The Consistent 5',
    instruction: 'Pick 5 minutes at the same time every day this week. That\'s your relationship time. Consistency matters more than duration.',
  },
  individual: {
    title: 'Inner Check-In',
    instruction: 'Before your next interaction, pause and ask yourself: "What am I feeling right now?" Name it before engaging.',
  },
  context: {
    title: 'Name the Weather',
    instruction: 'Tell your partner: "Here\'s what\'s weighing on me from outside us." External stress isn\'t a relationship problem — but it affects the field.',
  },
  change: {
    title: 'The Growth Edge',
    instruction: 'Ask yourself: "What would I do differently if I weren\'t afraid of getting it wrong?" Try it once, gently.',
  },
};

// ─── Helpers ─────────────────────────────────────────────

function findStrongestAndWeakest(profile: WEAREProfile) {
  const vars = profile.variables;
  let strongest: { name: WEAREVariableName; value: number } = { name: 'attunement', value: 0 };
  let weakest: { name: WEAREVariableName; value: number } = { name: 'attunement', value: 11 };

  for (const [key, val] of Object.entries(vars) as [WEAREVariableName, { raw: number }][]) {
    if (key === 'resistance') continue; // resistance is inverted
    if (val.raw > strongest.value) strongest = { name: key, value: val.raw };
    if (val.raw < weakest.value) weakest = { name: key, value: val.raw };
  }

  return { strongest, weakest };
}

// ─── Component ───────────────────────────────────────────

interface YourFieldTabProps {
  compositeScores: CompositeScores;
}

export default function YourFieldTab({ compositeScores }: YourFieldTabProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<WEAREProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  async function loadProfile() {
    if (!user?.id) { setLoading(false); return; }
    try {
      // WEARE profiles are stored per couple — look up the user's couple first
      const couple = await getMyCouple(user.id);
      if (!couple) { setLoading(false); return; }
      const result = await getLatestWEAREProfile(couple.id);
      if (result) {
        setProfile(result);
      }
    } catch (e) {
      // Silently fall back to no WEARE data
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

  // No WEARE data yet — show invitation
  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyCard}>
          <TenderText variant="headingS" color={Colors.primary} align="center" style={{ marginBottom: Spacing.sm }}>
            Your Field
          </TenderText>
          <TenderText variant="body" color={Colors.textSecondary} align="center">
            Complete your first weekly check-in to see your field reading.
          </TenderText>
          <TenderText variant="caption" color={Colors.textMuted} align="center" style={{ marginTop: Spacing.md }}>
            The field between two people has its own intelligence — this tab will show you what you bring to it.
          </TenderText>
        </View>
      </View>
    );
  }

  const { strongest, weakest } = findStrongestAndWeakest(profile);
  const bottleneckKey = profile.bottleneck.variable;
  const practice = BOTTLENECK_PRACTICES[bottleneckKey] ?? BOTTLENECK_PRACTICES.attunement;

  return (
    <View style={styles.container}>
      {/* Header */}
      <TenderText variant="label" color={Colors.textMuted} align="center" style={{ marginBottom: 4 }}>
        YOUR FIELD
      </TenderText>
      <TenderText variant="body" color={Colors.textSecondary} align="center" style={{ marginBottom: Spacing.lg }}>
        What you bring to the space between you
      </TenderText>

      {/* Three-layer dashboard with real WEARE data */}
      <ThreeLayerDashboard
        compositeScores={compositeScores}
        weareData={profile.layers}
      />

      {/* Strongest + Needs Care */}
      <View style={styles.strengthsRow}>
        <View style={styles.strengthCard}>
          <TenderText variant="label" color={Colors.success} style={{ marginBottom: 4 }}>
            WHAT'S STRONGEST
          </TenderText>
          <TenderText variant="body" style={{ marginBottom: 2 }}>
            {VARIABLE_DISPLAY_NAMES[strongest.name]}
          </TenderText>
          <TenderText variant="caption" color={Colors.textMuted}>
            {strongest.value.toFixed(1)} / 10
          </TenderText>
        </View>
        <View style={styles.strengthCard}>
          <TenderText variant="label" color={Colors.secondary} style={{ marginBottom: 4 }}>
            WHAT NEEDS CARE
          </TenderText>
          <TenderText variant="body" style={{ marginBottom: 2 }}>
            {VARIABLE_DISPLAY_NAMES[weakest.name]}
          </TenderText>
          <TenderText variant="caption" color={Colors.textMuted}>
            {weakest.value.toFixed(1)} / 10
          </TenderText>
        </View>
      </View>

      {/* Movement narrative */}
      {profile.movementNarrative ? (
        <View style={styles.narrativeCard}>
          <TenderText variant="label" color={Colors.textMuted} style={{ marginBottom: Spacing.sm }}>
            DIRECTION RIGHT NOW
          </TenderText>
          <TenderText variant="body" color={Colors.textSecondary}>
            {profile.movementNarrative}
          </TenderText>
        </View>
      ) : null}

      {/* What to focus on — bottleneck practice */}
      <View style={styles.practiceCard}>
        <TenderText variant="label" color={Colors.primary} style={{ marginBottom: Spacing.sm }}>
          WHAT TO FOCUS ON
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
  strengthsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  strengthCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
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
