/**
 * AssessmentUnlockOverlay — Educational popup for the Growth page
 *
 * Two modes:
 * 1. INTRO mode (after Foundation film): Explains the assessment → step system
 *    "Your journey is personalized through assessments. Each one unlocks new steps."
 *    Shows which assessments unlock which steps. Button: "Start First Assessment"
 *
 * 2. CELEBRATION mode (after assessment completion): Celebrates the unlock
 *    "Your [assessment] results are in! Steps X-Y just became yours."
 *    Button: "See Your Steps" → scrolls to unlocked steps
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';

interface UnlockTier {
  steps: string;
  assessments: string;
  description: string;
  unlocked: boolean;
}

interface Props {
  mode: 'intro' | 'celebration';
  visible: boolean;
  onDismiss: () => void;
  /** For intro mode: navigate to first assessment */
  onStartAssessment?: () => void;
  /** For intro mode: go to home */
  onGoHome?: () => void;
  /** For celebration mode */
  celebrationTitle?: string;
  celebrationMessage?: string;
  /** Current unlock tiers */
  tiers?: UnlockTier[];
}

export default function AssessmentUnlockOverlay({
  mode,
  visible,
  onDismiss,
  onStartAssessment,
  onGoHome,
  celebrationTitle,
  celebrationMessage,
  tiers,
}: Props) {
  if (!visible) return null;

  const defaultTiers: UnlockTier[] = [
    {
      steps: 'Steps 1-2',
      assessments: 'How You Connect (attachment)',
      description: 'Reveals how you reach for connection and what happens when distance appears',
      unlocked: false,
    },
    {
      steps: 'Steps 3-4',
      assessments: '+ Who You Are + How You Feel',
      description: 'Maps your personality in love and your emotional intelligence',
      unlocked: false,
    },
    {
      steps: 'Steps 5-7',
      assessments: '+ all remaining assessments',
      description: 'Your full relational portrait — every dimension integrated',
      unlocked: false,
    },
    {
      steps: 'Steps 8-12',
      assessments: '+ a couple assessment with your partner',
      description: 'How your patterns interact with your partner\'s patterns',
      unlocked: false,
    },
  ];

  const displayTiers = tiers ?? defaultTiers;

  if (mode === 'celebration') {
    return (
      <Modal visible transparent animationType="fade" statusBarTranslucent>
        <View style={styles.backdrop}>
          <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.card}>
            <Text style={styles.celebrationTitle}>{celebrationTitle ?? 'New steps unlocked'}</Text>
            <Text style={styles.celebrationMessage}>
              {celebrationMessage ?? 'Your assessment results are in. New personalized steps are waiting for you.'}
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onDismiss}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>See Your Steps</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  }

  // INTRO mode
  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.introCard}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.introScroll}>
            <Text style={styles.introTitle}>Your journey is built for you</Text>
            <Text style={styles.introSubtitle}>
              Each assessment you complete unlocks new steps — personalized with your actual patterns, scores, and growth edges. The more we learn about you, the more precise your path becomes.
            </Text>

            <View style={styles.tierList}>
              {displayTiers.map((tier, i) => (
                <View
                  key={i}
                  style={[
                    styles.tierRow,
                    tier.unlocked && styles.tierRowUnlocked,
                  ]}
                >
                  <View style={styles.tierDot}>
                    <View style={[
                      styles.tierDotInner,
                      tier.unlocked && styles.tierDotUnlocked,
                    ]} />
                  </View>
                  <View style={styles.tierContent}>
                    <Text style={[styles.tierSteps, tier.unlocked && styles.tierStepsUnlocked]}>
                      {tier.steps}
                    </Text>
                    <Text style={styles.tierAssessments}>{tier.assessments}</Text>
                    <Text style={styles.tierDescription}>{tier.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Connector line */}
            <View style={styles.connectorLine} />

            <Text style={styles.introFooter}>
              Start with one assessment. Everything else follows from there.
            </Text>
          </ScrollView>

          <View style={styles.introButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onStartAssessment}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Start First Assessment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onGoHome ?? onDismiss}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Explore Home First</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(79, 68, 70, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },

  // ─── Celebration Mode ─────────────────
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.card,
  },
  celebrationTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  celebrationMessage: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },

  // ─── Intro Mode ───────────────────────
  introCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  introScroll: {
    flexGrow: 0,
  },
  introTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  introSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },

  // ─── Tier List ────────────────────────
  tierList: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceElevated,
  },
  tierRowUnlocked: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  tierDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  tierDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.textMuted,
  },
  tierDotUnlocked: {
    backgroundColor: Colors.primary,
  },
  tierContent: {
    flex: 1,
  },
  tierSteps: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '600',
  },
  tierStepsUnlocked: {
    color: Colors.primary,
  },
  tierAssessments: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  tierDescription: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  connectorLine: {
    width: 2,
    height: 0,
    backgroundColor: Colors.borderLight,
    alignSelf: 'center',
  },
  introFooter: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },

  // ─── Buttons ──────────────────────────
  introButtons: {
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  secondaryButtonText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
});
