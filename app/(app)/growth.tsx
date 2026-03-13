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
import type { StepProgress } from '@/types/growth';
import type { Couple } from '@/types/couples';

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
      setCurrentStepNumber(activeStep?.stepNumber ?? 1);

      // Load couple (non-blocking)
      try {
        const myCouple = await getMyCouple(user.id);
        setCouple(myCouple);
      } catch {
        setCouple(null);
      }

      // Check portrait existence (non-blocking)
      try {
        const p = await getPortrait(user.id);
        setHasPortrait(!!p);
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
    router.back();
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
    const sn = activeStep?.stepNumber ?? 1;
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
        <FoundationOverlay onDismiss={() => setShowFoundation(false)} />
      )}

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

        {/* Full Step Journey Map */}
        <StepJourney
          stepProgress={stepProgress}
          currentStepNumber={currentStepNumber}
          onNavigateToStep={handleNavigateToStep}
          isCoupled={!!(couple && !isSelfCouple(couple))}
        />

        {/* Growth Plan Status */}
        <View style={styles.growthPlanStatus}>
          <Text style={styles.growthPlanStatusLabel}>YOUR GROWTH PLAN</Text>
          {hasPortrait && currentStepNumber >= 9 ? (
            <Text style={styles.growthPlanStatusText}>
              Your personalized growth plan is woven into Steps 9–12. Continue your journey to explore your pathway, phases, and practices.
            </Text>
          ) : hasPortrait ? (
            <Text style={styles.growthPlanStatusText}>
              Your growth plan is taking shape. It will appear in Step 9 as you continue your journey.
            </Text>
          ) : (
            <Text style={styles.growthPlanStatusText}>
              Complete your personal assessments to unlock your personalized growth plan within the steps.
            </Text>
          )}
        </View>
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
});
