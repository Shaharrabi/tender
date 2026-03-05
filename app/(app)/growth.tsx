/**
 * Your Relational Journey Screen — Simplified Journey Map
 *
 * One purpose: show where you are in the 12 steps.
 * 1. Header: "Your Relational Journey"
 * 2. Tagline: "Tending the field between you — in 12 steps"
 * 3. CurrentStepFocus — simplified hero card
 * 4. StepJourney — 12-step map grouped by phases
 * 5. Treatment Plan link (bottom)
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
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import QuickLinksBar from '@/components/QuickLinksBar';
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
import FoundationOverlay, { hasHeardFoundation } from '@/components/growth/FoundationOverlay';
import { ensureStepProgress } from '@/services/steps';
import { getMyCouple, isSelfCouple } from '@/services/couples';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import type { StepProgress } from '@/types/growth';
import type { Couple } from '@/types/couples';

export default function GrowthScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stepProgress, setStepProgress] = useState<StepProgress[]>([]);
  const [currentStepNumber, setCurrentStepNumber] = useState(1);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [showFoundation, setShowFoundation] = useState(false);

  // Check if Foundation audio should auto-play on first visit
  useEffect(() => {
    hasHeardFoundation().then((heard) => {
      if (!heard) setShowFoundation(true);
    });
  }, []);

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

  const handleViewTreatmentPlan = () => {
    router.push('/(app)/treatment-plan' as any);
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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

        {/* Treatment Plan Link */}
        <TouchableOpacity
          style={styles.treatmentPlanLink}
          onPress={handleViewTreatmentPlan}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <View style={styles.treatmentPlanContent}>
            <Text style={styles.treatmentPlanTitle}>
              View Treatment Plan
            </Text>
            <Text style={styles.treatmentPlanSubtitle}>
              Your personalized pathways, goals, and exercises
            </Text>
          </View>
          <Text style={styles.treatmentPlanArrow}>{'\u203A'}</Text>
        </TouchableOpacity>
        <QuickLinksBar />
      </ScrollView>
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

  // Treatment plan link
  treatmentPlanLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    ...Shadows.subtle,
  },
  treatmentPlanContent: {
    flex: 1,
    gap: 2,
  },
  treatmentPlanTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.primary,
  },
  treatmentPlanSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  treatmentPlanArrow: {
    fontSize: FontSizes.headingL,
    color: Colors.primary,
    fontWeight: '300',
    marginLeft: Spacing.sm,
  },
});
