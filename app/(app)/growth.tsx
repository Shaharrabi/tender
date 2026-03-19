/**
 * Your Relational Journey Screen — Simplified Journey Map
 *
 * One purpose: show where you are in the 12 steps.
 * 1. Header: "Your Relational Journey"
 * 2. Tagline: "Tending the field between you — in 12 steps"
 * 3. CurrentStepFocus — simplified hero card
 * 4. StepJourney — 12-step map grouped by phases
 * 5. Growth Plan status card (bottom)
 *
 * Daily content (check-in, practices, nervous system) lives on home.
 */

import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import QuickLinksBar from '@/components/QuickLinksBar';
import { useScrollHideBar } from '@/hooks/useScrollHideBar';
import { useAuth } from '@/context/AuthContext';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import CurrentStepFocus from '@/components/growth/CurrentStepFocus';
import StepJourney from '@/components/growth/StepJourney';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FoundationOverlay, { hasHeardFoundation } from '@/components/growth/FoundationOverlay';
import { ensureStepProgress } from '@/services/steps';
import { getMyCouple, isSelfCouple } from '@/services/couples';
import { getPortrait } from '@/services/portrait';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import {
  IllustrationStep01, IllustrationStep02, IllustrationStep03, IllustrationStep04,
  IllustrationStep05, IllustrationStep06, IllustrationStep07, IllustrationStep08,
  IllustrationStep09, IllustrationStep10, IllustrationStep11, IllustrationStep12,
} from '@/assets/graphics/illustrations';
import type { StepProgress } from '@/types/growth';
import { getNextUnlockOpportunity } from '@/utils/steps/step-gating';
import { assignPathway, type PathwayAssignment } from '@/utils/steps/pathway-archetypes';
import { fetchAllScores } from '@/services/portrait';
import type { Couple } from '@/types/couples';
import AssessmentUnlockOverlay from '@/components/growth/AssessmentUnlockOverlay';

const STEP_ILLUSTRATIONS: Record<number, React.ComponentType<{ width?: number; height?: number; animated?: boolean }>> = {
  1: IllustrationStep01, 2: IllustrationStep02, 3: IllustrationStep03, 4: IllustrationStep04,
  5: IllustrationStep05, 6: IllustrationStep06, 7: IllustrationStep07, 8: IllustrationStep08,
  9: IllustrationStep09, 10: IllustrationStep10, 11: IllustrationStep11, 12: IllustrationStep12,
};

export default function GrowthScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { handleScroll, animatedStyle: quickLinksAnimStyle, BAR_HEIGHT } = useScrollHideBar();

  const [loading, setLoading] = useState(true);
  const [stepProgress, setStepProgress] = useState<StepProgress[]>([]);
  const [currentStepNumber, setCurrentStepNumber] = useState(1);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [hasPortrait, setHasPortrait] = useState(false);
  const [showFoundation, setShowFoundation] = useState(false);
  const [pathwayAssignment, setPathwayAssignment] = useState<PathwayAssignment | null>(null);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);
  const [completedIndividualIds, setCompletedIndividualIds] = useState<string[]>([]);
  const [completedCoupleIds, setCompletedCoupleIds] = useState<string[]>([]);
  const [showIntroOverlay, setShowIntroOverlay] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ title: string; message: string } | null>(null);

  // Mark that user has seen the journey overview (gates step 1 in home.tsx)
  useEffect(() => {
    AsyncStorage.setItem('journey_overview_seen', 'true').catch(() => {});
  }, []);

  // Check if Foundation audio should auto-play on first visit
  // Pass server hint once step data loads — if user has any step progress
  // beyond initial state, they've been here before (survives cache clears)
  const foundationCheckedRef = React.useRef(false);
  useEffect(() => {
    if (foundationCheckedRef.current) return;
    // Immediate check with local cache
    hasHeardFoundation().then((heard) => {
      if (heard) {
        foundationCheckedRef.current = true;
        return;
      }
      // Not in local cache — wait for step data to provide server hint
      // (will be checked again in loadData via serverHintRef)
    });
  }, []);

  // After step data loads, double-check with server hint
  const serverHintRef = React.useRef(false);
  useEffect(() => {
    if (foundationCheckedRef.current) return;
    if (stepProgress.length === 0) return;

    // If any step is completed or the user is beyond step 1, they've visited before
    const hasBeenHereBefore = stepProgress.some(
      (sp) => sp.status === 'completed' || (sp.status === 'active' && sp.stepNumber > 1)
    );
    if (hasBeenHereBefore) {
      foundationCheckedRef.current = true;
      serverHintRef.current = true;
      // Don't show overlay — mark it as heard for next time
      AsyncStorage.setItem('has_heard_foundation', 'true').catch(() => {});
      return;
    }

    // Truly first visit — show the overlay
    if (!serverHintRef.current) {
      setShowFoundation(true);
      foundationCheckedRef.current = true;
    }
  }, [stepProgress]);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [stepData] = await Promise.all([
        ensureStepProgress(user.id),
      ]);
      setStepProgress(stepData);

      // Find the current active step
      const activeStep = stepData.find((sp) => sp.status === 'active');
      if (activeStep) {
        setCurrentStepNumber(activeStep.stepNumber);
      } else {
        // No active step — either all completed or first visit
        const completedSteps = stepData.filter((sp) => sp.status === 'completed');
        if (completedSteps.length > 0) {
          // All steps completed — show the highest completed step
          setCurrentStepNumber(Math.max(...completedSteps.map((sp) => sp.stepNumber)));
        } else {
          setCurrentStepNumber(1);
        }
      }

      // Load couple (non-blocking)
      try {
        const myCouple = await getMyCouple(user.id);
        setCouple(myCouple);
      } catch {
        setCouple(null);
      }

      // Check portrait existence + load pathway/gating (non-blocking)
      try {
        const p = await getPortrait(user.id);
        setHasPortrait(!!p);

        // Load completed assessments for gating + pathway
        const allScores = await fetchAllScores(user.id);
        const completedIndividual = Object.keys(allScores).filter((k) =>
          ['ecr-r', 'tender-personality-60', 'ipip-neo-120', 'sseit', 'dsi-r', 'dutch', 'values'].includes(k)
        );
        const completedCouple = Object.keys(allScores).filter((k) =>
          ['rdas', 'dci', 'csi-16'].includes(k)
        );

        // Check for newly completed assessments (celebration trigger)
        const prevCount = completedIndividualIds.length + completedCoupleIds.length;
        const newCount = completedIndividual.length + completedCouple.length;
        if (prevCount > 0 && newCount > prevCount) {
          // User completed a new assessment since last visit — check for unlock
          const { getUnlockCelebration } = await import('@/utils/steps/step-gating');
          const lastAssessment = completedIndividual[completedIndividual.length - 1];
          const celebration = getUnlockCelebration(lastAssessment, completedIndividual, completedCouple);
          if (celebration) {
            setCelebrationData({ title: celebration.title, message: celebration.message });
            setShowCelebration(true);
          }
        }

        // Store completed assessment IDs for step gating
        setCompletedIndividualIds(completedIndividual);
        setCompletedCoupleIds(completedCouple);

        // Calculate next unlock opportunity
        const unlock = getNextUnlockOpportunity(completedIndividual, completedCouple);
        if (unlock) {
          setUnlockMessage(unlock.message);
        }

        // Assign pathway if we have attachment data
        if (allScores['ecr-r']?.scores) {
          const ecrr = allScores['ecr-r'].scores as any;
          const sseit = allScores['sseit']?.scores as any;
          const ipip = (allScores['tender-personality-60']?.scores ?? allScores['ipip-neo-120']?.scores) as any;
          const dsir = allScores['dsi-r']?.scores as any;
          const dutch = allScores['dutch']?.scores as any;

          const pathway = assignPathway({
            anxiety: ecrr.anxietyScore,
            avoidance: ecrr.avoidanceScore,
            empathicResonance: sseit?.subscaleNormalized?.empathicResonance,
            regulation: p?.compositeScores?.regulationScore,
            openness: ipip?.domainPercentiles?.openness,
            managingOwn: sseit?.subscaleNormalized?.managingOwn,
            dutchPrimary: dutch?.primaryStyle,
            fusion: dsir?.subscaleScores?.fusionWithOthers?.normalized,
            differentiation: p?.compositeScores?.differentiation,
            eqTotal: sseit?.totalNormalized,
            assessmentCount: completedIndividual.length,
          });
          setPathwayAssignment(pathway);
        }
      } catch {
        setHasPortrait(false);
      }
    } catch (err) {
      console.error('Failed to load growth data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleBack = () => {
    try {
      if (router.canGoBack?.()) {
        router.back();
      } else {
        router.replace('/(app)/home');
      }
    } catch {
      router.replace('/(app)/home');
    }
  };

  const handleNavigateToStep = (stepNumber: number) => {
    router.push({
      pathname: '/(app)/step-detail' as any,
      params: { step: stepNumber.toString() },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} accessibilityLabel="Loading" />
        </View>
      </SafeAreaView>
    );
  }

  const completedCount = stepProgress.filter((sp) => sp.status === 'completed').length;
  const activePhase = (() => {
    const activeStep = stepProgress.find((sp) => sp.status === 'active');
    const completedSteps = stepProgress.filter((sp) => sp.status === 'completed');
    const sn = activeStep?.stepNumber
      ?? (completedSteps.length > 0 ? Math.max(...completedSteps.map((sp) => sp.stepNumber)) : 1);
    if (sn <= 2) return 'SEEING';
    if (sn <= 4) return 'FEELING';
    if (sn <= 7) return 'SHIFTING';
    if (sn <= 10) return 'INTEGRATING';
    return 'SUSTAINING';
  })();

  return (
    <ErrorBoundary>
    <SafeAreaView style={styles.container}>
      {/* Foundation Audio Overlay — first visit only */}
      {showFoundation && (
        <FoundationOverlay onDismiss={() => {
          setShowFoundation(false);
          // Show intro overlay after Foundation film — only if no assessments done yet
          if (completedIndividualIds.length === 0) {
            setTimeout(() => setShowIntroOverlay(true), 500);
          }
        }} />
      )}

      {/* Assessment Intro Overlay — shows after Foundation film */}
      <AssessmentUnlockOverlay
        mode="intro"
        visible={showIntroOverlay}
        onDismiss={() => setShowIntroOverlay(false)}
        onStartAssessment={() => {
          setShowIntroOverlay(false);
          router.push('/(app)/tender-assessment' as any);
        }}
        onGoHome={() => {
          setShowIntroOverlay(false);
          router.replace('/(app)/home' as any);
        }}
        tiers={[
          { steps: 'Steps 1-2', assessments: 'How You Connect (attachment)', description: 'Reveals how you reach for connection and what happens when distance appears', unlocked: completedIndividualIds.includes('ecr-r') },
          { steps: 'Steps 3-4', assessments: '+ Who You Are + How You Feel', description: 'Maps your personality in love and your emotional intelligence', unlocked: completedIndividualIds.includes('tender-personality-60') && completedIndividualIds.includes('sseit') },
          { steps: 'Steps 5-7', assessments: '+ all remaining assessments', description: 'Your full relational portrait — every dimension integrated', unlocked: completedIndividualIds.length >= 6 },
          { steps: 'Steps 8-12', assessments: '+ a couple assessment with your partner', description: 'How your patterns interact with your partner\'s patterns', unlocked: completedCoupleIds.length > 0 },
        ]}
      />

      {/* Assessment Celebration Overlay — shows when new steps unlock */}
      <AssessmentUnlockOverlay
        mode="celebration"
        visible={showCelebration}
        onDismiss={() => setShowCelebration(false)}
        celebrationTitle={celebrationData?.title}
        celebrationMessage={celebrationData?.message}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Go back">
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Relational Journey</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: BAR_HEIGHT + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Current Step Illustration */}
        {(() => {
          const StepIllustration = STEP_ILLUSTRATIONS[currentStepNumber] || IllustrationStep01;
          return (
            <View style={{ alignItems: 'center', marginBottom: 4 }}>
              <StepIllustration width={Math.min(Dimensions.get('window').width - 48, 260)} animated={true} />
            </View>
          );
        })()}

        {/* Tagline + Progress Summary */}
        <View style={styles.introSection}>
          <Text style={styles.tagline}>Tending the field between you — in 12 steps</Text>
          <Text style={styles.progressSummary}>
            Step {currentStepNumber} of 12 · {activePhase} phase · {completedCount} of 12 steps completed
          </Text>
        </View>

        {/* Current Step Focus — Hero card */}
        <CurrentStepFocus
          stepProgress={stepProgress}
          currentStepNumber={currentStepNumber}
          onContinue={handleNavigateToStep}
        />

        {/* Full Step Journey Map — hidden until ECR-R is completed */}
        {completedIndividualIds.includes('ecr-r') ? (
          <StepJourney
            stepProgress={stepProgress}
            currentStepNumber={currentStepNumber}
            onNavigateToStep={handleNavigateToStep}
            isCoupled={!!(couple && !isSelfCouple(couple))}
            completedIndividual={completedIndividualIds}
            completedCouple={completedCoupleIds}
          />
        ) : !loading ? (
          <AssessmentUnlockOverlay
            mode="intro"
            visible={!showFoundation && !showIntroOverlay}
            onDismiss={() => {}}
            onStartAssessment={() => {
              router.push('/(app)/tender-assessment' as any);
            }}
            onGoHome={() => {
              router.replace('/(app)/home' as any);
            }}
            tiers={[
              { steps: 'Steps 1-2', assessments: 'How You Connect (attachment)', description: 'Reveals how you reach for connection and what happens when distance appears', unlocked: false },
              { steps: 'Steps 3-4', assessments: '+ Who You Are + How You Feel', description: 'Maps your personality in love and your emotional intelligence', unlocked: false },
              { steps: 'Steps 5-7', assessments: '+ all remaining assessments', description: 'Your full relational portrait — every dimension integrated', unlocked: false },
              { steps: 'Steps 8-12', assessments: '+ a couple assessment with your partner', description: 'How your patterns interact with your partner\'s patterns', unlocked: false },
            ]}
          />
        ) : null}

        {/* Growth Plan Status + Pathway */}
        <View style={styles.growthPlanStatus}>
          {pathwayAssignment ? (
            <>
              <Text style={styles.growthPlanStatusLabel}>YOUR PATH</Text>
              <Text style={[styles.growthPlanPathwayName, { color: pathwayAssignment.archetype.color }]}>
                {pathwayAssignment.archetype.name}
              </Text>
              <Text style={styles.growthPlanStatusText}>
                {pathwayAssignment.archetype.subtitle}
              </Text>
              {pathwayAssignment.confidence === 'preliminary' && (
                <Text style={[styles.growthPlanStatusText, { fontStyle: 'italic', marginTop: 6 }]}>
                  This is a preliminary pathway based on your first assessment. It becomes more precise as you complete more.
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.growthPlanStatusLabel}>YOUR GROWTH PLAN</Text>
          )}

          {unlockMessage && (
            <View style={styles.unlockBanner}>
              <Text style={styles.unlockBannerText}>{unlockMessage}</Text>
              <TouchableOpacity
                style={styles.unlockButton}
                onPress={() => router.push('/(app)/tender-assessment')}
                activeOpacity={0.7}
              >
                <Text style={styles.unlockButtonText}>Begin Assessment</Text>
              </TouchableOpacity>
            </View>
          )}

          {!unlockMessage && hasPortrait && (
            <Text style={[styles.growthPlanStatusText, { marginTop: 8 }]}>
              All steps are unlocked and personalized with your full portrait.
            </Text>
          )}
        </View>

        {/* Foundation Film — rewatch widget */}
        {Platform.OS === 'web' && (
          <View style={styles.rewatchSection}>
            <Text style={styles.rewatchLabel}>THE FOUNDATION</Text>
            <Text style={styles.rewatchSub}>Understanding the Relational Field</Text>
            <View style={styles.rewatchFrame}>
              <iframe
                src="/foundation-film/index.html"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: 16,
                } as any}
                title="The Foundation — Rewatch"
                allow="autoplay"
              />
            </View>
          </View>
        )}
      </ScrollView>

      <Animated.View style={[styles.quickLinksWrapper, quickLinksAnimStyle]}>
        <QuickLinksBar />
      </Animated.View>
    </SafeAreaView>
    </ErrorBoundary>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  quickLinksWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backText: {
    fontSize: FontSizes.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },

  // Scroll content
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom,
    gap: Spacing.lg,
  },

  // Intro / tagline
  introSection: {
    gap: Spacing.xs,
    alignItems: 'center',
  },
  tagline: {
    ...Typography.serifItalic,
    fontSize: 15,
    color: Colors.secondary,
    textAlign: 'center',
  },
  progressSummary: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // Growth plan status card
  growthPlanStatus: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.xs,
  },
  growthPlanStatusLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  growthPlanStatusText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  growthPlanPathwayName: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  unlockBanner: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  unlockBannerText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 10,
  },
  unlockButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start' as const,
  },
  unlockButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '600' as const,
    color: Colors.textOnPrimary,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  rewatchSection: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  rewatchLabel: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewatchSub: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  rewatchFrame: {
    width: '100%',
    maxWidth: 560,
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
});
