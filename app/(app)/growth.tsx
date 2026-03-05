/**
 * Your Healing Journey Screen — Sprint C Enhancement
 *
 * Reorganized layout:
 * 1. CurrentStepFocus — Hero card showing where you are
 * 2. Daily Check-In — Daily touchpoint (moved up)
 * 3. WeeklyPracticeSchedule — What to do this week
 * 4. WindowOfTolerance — Nervous system check
 * 5. StepJourney — Full 12-step map (enriched with courses, criteria)
 * 6. Weekly Check-In — Couple-only weekly reflection
 * 7. Growth Edges — Portrait-derived edges
 * 8. Recent Check-Ins — Last 5 entries
 * 9. Treatment Plan link
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
} from '@/constants/theme';
import CurrentStepFocus from '@/components/growth/CurrentStepFocus';
import StepJourney from '@/components/growth/StepJourney';
import GrowthTimeline from '@/components/growth/GrowthTimeline';
import CheckInCard from '@/components/growth/CheckInCard';
import WindowOfTolerance from '@/components/growth/WindowOfTolerance';
import WeeklyPracticeSchedule from '@/components/growth/WeeklyPracticeSchedule';
import FoundationOverlay, { hasHeardFoundation } from '@/components/growth/FoundationOverlay';
import {
  ensureGrowthEdgesFromPortrait,
  getTodaysCheckIn,
  getRecentCheckIns,
  saveDailyCheckIn,
} from '@/services/growth';
import { ensureStepProgress } from '@/services/steps';
import { getMyCouple, isSelfCouple } from '@/services/couples';
import { getThisWeeksCheckIn, saveWeeklyCheckIn } from '@/services/weare';
import WeeklyCheckInCard from '@/components/weare/WeeklyCheckInCard';
import { getPracticesForStep } from '@/utils/steps/twelve-steps';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import type { GrowthEdgeProgress, DailyCheckIn, StepProgress } from '@/types/growth';
import type { Couple } from '@/types/couples';
import type { WeeklyCheckIn } from '@/types/weare';

export default function GrowthScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [edges, setEdges] = useState<GrowthEdgeProgress[]>([]);
  const [todaysCheckIn, setTodaysCheckIn] = useState<DailyCheckIn | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<DailyCheckIn[]>([]);
  const [stepProgress, setStepProgress] = useState<StepProgress[]>([]);
  const [currentStepNumber, setCurrentStepNumber] = useState(1);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [weeklyCheckIn, setWeeklyCheckIn] = useState<WeeklyCheckIn | null>(null);
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
      const [edgeData, todayData, recentData, stepData] = await Promise.all([
        ensureGrowthEdgesFromPortrait(user.id),
        getTodaysCheckIn(user.id),
        getRecentCheckIns(user.id, 7),
        ensureStepProgress(user.id),
      ]);
      setEdges(edgeData);
      setTodaysCheckIn(todayData);
      setRecentCheckIns(recentData);
      setStepProgress(stepData);

      // Find the current active step
      const activeStep = stepData.find((sp) => sp.status === 'active');
      setCurrentStepNumber(activeStep?.stepNumber ?? 1);

      // Load couple + weekly check-in (non-blocking)
      try {
        const myCouple = await getMyCouple(user.id);
        setCouple(myCouple);
        if (myCouple) {
          const wci = await getThisWeeksCheckIn(myCouple.id, user.id);
          setWeeklyCheckIn(wci);
        }
      } catch {
        setCouple(null);
        setWeeklyCheckIn(null);
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

  const handleCheckInSubmit = async (
    mood: number,
    relationship: number,
    practiced: boolean,
    note?: string
  ) => {
    if (!user) return;
    const checkIn = await saveDailyCheckIn(user.id, mood, relationship, practiced, note);
    setTodaysCheckIn(checkIn);
    const recent = await getRecentCheckIns(user.id, 7);
    setRecentCheckIns(recent);
  };

  const handleBack = () => {
    router.back();
  };

  const handleViewTreatmentPlan = () => {
    router.push('/(app)/treatment-plan' as any);
  };

  const handleSelectPractice = (practiceId: string) => {
    router.push({
      pathname: '/(app)/exercise' as any,
      params: { id: practiceId },
    });
  };

  const handleNavigateToStep = (stepNumber: number) => {
    router.push({
      pathname: '/(app)/step-detail' as any,
      params: { step: stepNumber.toString() },
    });
  };

  const handleNavigateToCourse = (courseId: string) => {
    router.push({
      pathname: '/(app)/microcourse' as any,
      params: { courseId },
    });
  };

  const handleStepPress = (stepNumber: number) => {
    // Tapping a step in the journey just expands/collapses it —
    // navigation happens via the "Continue This Step" button inside.
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
        <Text style={styles.headerTitle}>Your Healing Journey</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Current Step Focus — Hero card */}
        <CurrentStepFocus
          stepProgress={stepProgress}
          currentStepNumber={currentStepNumber}
          onContinue={handleNavigateToStep}
        />

        {/* 2. Daily Check-In — Daily touchpoint */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Check-In</Text>
          <CheckInCard
            todaysCheckIn={todaysCheckIn}
            onSubmit={handleCheckInSubmit}
          />
        </View>

        {/* 3. Weekly Practice Schedule */}
        <View style={styles.section}>
          <WeeklyPracticeSchedule
            currentStepNumber={currentStepNumber}
            onSelectPractice={handleSelectPractice}
          />
        </View>

        {/* 4. Window of Tolerance Interactive */}
        <View style={styles.section}>
          <WindowOfTolerance onSelectPractice={handleSelectPractice} />
        </View>

        {/* 5. Full Step Journey Map — enriched */}
        <StepJourney
          stepProgress={stepProgress}
          currentStepNumber={currentStepNumber}
          onStepPress={handleStepPress}
          onSelectPractice={handleSelectPractice}
          onNavigateToStep={handleNavigateToStep}
          onNavigateToCourse={handleNavigateToCourse}
          isCoupled={!!(couple && !isSelfCouple(couple))}
        />

        {/* 6. Weekly Check-In — couple only */}
        {couple && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Check-In</Text>
            <Text style={styles.sectionSubtitle}>
              Reflect on the space between you this week
            </Text>
            <WeeklyCheckInCard
              existingCheckIn={weeklyCheckIn}
              onSubmit={async (stress, support, satisfaction, highlight) => {
                if (!user || !couple) return;
                const saved = await saveWeeklyCheckIn(
                  user.id, couple.id, stress, support, satisfaction, highlight
                );
                setWeeklyCheckIn(saved);
              }}
            />
          </View>
        )}

        {/* 7. Growth Timeline */}
        {edges.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Growth Edges</Text>
            <GrowthTimeline edges={edges} />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Growth Edges</Text>
            <View style={styles.emptyEdgesCard}>
              <Text style={styles.emptyEdgesText}>
                Complete all 6 assessments to generate your relational portrait and unlock personalized growth edges.
              </Text>
            </View>
          </View>
        )}

        {/* 8. Recent Check-Ins Summary */}
        {recentCheckIns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Check-Ins</Text>
            <View style={styles.recentList}>
              {recentCheckIns.slice(0, 5).map((checkIn) => (
                <View key={checkIn.id} style={styles.recentRow}>
                  <Text style={styles.recentDate}>
                    {formatCheckInDate(checkIn.checkinDate)}
                  </Text>
                  <View style={styles.recentStats}>
                    <View style={styles.recentStatPill}>
                      <Text style={styles.recentStatLabel}>Inner</Text>
                      <Text style={styles.recentStatValue}>
                        {checkIn.moodRating}
                      </Text>
                    </View>
                    <View style={styles.recentStatPill}>
                      <Text style={styles.recentStatLabel}>Connection</Text>
                      <Text style={styles.recentStatValue}>
                        {checkIn.relationshipRating}
                      </Text>
                    </View>
                    {checkIn.practicedGrowthEdge && (
                      <View style={[styles.recentStatPill, styles.practicedPill]}>
                        <Text style={styles.practicedText}>Practiced</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 9. Treatment Plan Link */}
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

// ─── Helpers ────────────────────────────────────────────

function formatCheckInDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = today.getTime() - date.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
    gap: Spacing.xl,
  },

  // Sections
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    marginTop: -Spacing.sm,
    lineHeight: 20,
  },

  // Recent check-ins
  recentList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  recentDate: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
    minWidth: 80,
  },
  recentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  recentStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.borderLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  recentStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  recentStatValue: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },
  practicedPill: {
    backgroundColor: Colors.successFaded,
  },
  practicedText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.successDarkText,
  },

  // Empty growth edges fallback
  emptyEdgesCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  emptyEdgesText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 22,
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
