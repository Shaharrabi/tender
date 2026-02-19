/**
 * Your Healing Journey Screen
 *
 * Redesigned to show the Twelve Steps progress, current phase,
 * daily check-in, growth edges, and treatment plan link.
 * The Steps are the transformational arc; everything else serves them.
 */

import React, { useCallback, useState } from 'react';
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
import { useAuth } from '@/context/AuthContext';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import HomeButton from '@/components/HomeButton';
import FoundationOverlay, { hasHeardFoundation } from '@/components/growth/FoundationOverlay';
import StepJourney from '@/components/growth/StepJourney';
import GrowthTimeline from '@/components/growth/GrowthTimeline';
import CheckInCard from '@/components/growth/CheckInCard';
import WindowOfTolerance from '@/components/growth/WindowOfTolerance';
import WeeklyPracticeSchedule from '@/components/growth/WeeklyPracticeSchedule';
import {
  ensureGrowthEdgesFromPortrait,
  getTodaysCheckIn,
  getRecentCheckIns,
  saveDailyCheckIn,
} from '@/services/growth';
import { ensureStepProgress } from '@/services/steps';
import { getPracticesForStep } from '@/utils/steps/twelve-steps';
import { getMyCouple } from '@/services/couples';
import { getThisWeeksCheckIn, saveWeeklyCheckIn } from '@/services/weare';
import WeeklyCheckInCard from '@/components/weare/WeeklyCheckInCard';
import type { GrowthEdgeProgress, DailyCheckIn, StepProgress } from '@/types/growth';
import type { WeeklyCheckIn } from '@/types/weare';
import type { Couple } from '@/types/couples';

export default function GrowthScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [edges, setEdges] = useState<GrowthEdgeProgress[]>([]);
  const [todaysCheckIn, setTodaysCheckIn] = useState<DailyCheckIn | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<DailyCheckIn[]>([]);
  const [stepProgress, setStepProgress] = useState<StepProgress[]>([]);
  const [currentStepNumber, setCurrentStepNumber] = useState(1);
  const [showFoundation, setShowFoundation] = useState(false);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [weeklyCheckIn, setWeeklyCheckIn] = useState<WeeklyCheckIn | null>(null);

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

      // Check if first visit — show Foundation audio
      const heard = await hasHeardFoundation();
      if (!heard) setShowFoundation(true);

      // Load couple + weekly check-in (non-blocking for individual users)
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
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home' as any);
    }
  };

  const handleViewTreatmentPlan = () => {
    router.push('/(app)/treatment-plan' as any);
  };

  const handleStepNavigate = (stepNumber: number) => {
    // Navigate to step detail for any non-locked step (current or completed)
    const progress = stepProgress.find((sp) => sp.stepNumber === stepNumber);
    if (progress && progress.status !== 'locked') {
      router.push({
        pathname: '/(app)/step-detail' as any,
        params: { step: String(stepNumber) },
      });
    }
  };

  const handlePracticeFromWoT = (practiceId: string) => {
    router.push({
      pathname: '/(app)/exercise' as any,
      params: { id: practiceId },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Healing Journey</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Twelve Steps Journey */}
        <StepJourney
          stepProgress={stepProgress}
          currentStepNumber={currentStepNumber}
          onSelectPractice={handlePracticeFromWoT}
          onStepPress={handleStepNavigate}
        />

        {/* Weekly Practice Schedule */}
        <View style={styles.section}>
          <WeeklyPracticeSchedule
            currentStepNumber={currentStepNumber}
            onSelectPractice={handlePracticeFromWoT}
          />
        </View>

        {/* Window of Tolerance Interactive */}
        <View style={styles.section}>
          <WindowOfTolerance onSelectPractice={handlePracticeFromWoT} />
        </View>

        {/* Daily Check-In */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Check-In</Text>
          <CheckInCard
            todaysCheckIn={todaysCheckIn}
            onSubmit={handleCheckInSubmit}
          />
        </View>

        {/* Weekly Check-In (shown only when user has a couple) */}
        {couple && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Check-In</Text>
            <Text style={styles.sectionSubtitle}>
              Notice the space between you and your partner this week.
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

        {/* Growth Timeline */}
        {edges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Growth Edges</Text>
            <GrowthTimeline edges={edges} />
          </View>
        )}

        {/* Recent Check-Ins Summary */}
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
                      <Text style={styles.recentStatLabel}>Mood</Text>
                      <Text style={styles.recentStatValue}>
                        {checkIn.moodRating}
                      </Text>
                    </View>
                    <View style={styles.recentStatPill}>
                      <Text style={styles.recentStatLabel}>Rel.</Text>
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

        {/* Growth Plan Link */}
        <TouchableOpacity
          style={styles.treatmentPlanLink}
          onPress={handleViewTreatmentPlan}
          activeOpacity={0.7}
        >
          <View style={styles.treatmentPlanContent}>
            <Text style={styles.treatmentPlanTitle}>
              View Growth Plan
            </Text>
            <Text style={styles.treatmentPlanSubtitle}>
              Your personalized growth pathway
            </Text>
          </View>
          <Text style={styles.treatmentPlanArrow}>{'\u203A'}</Text>
        </TouchableOpacity>
      </ScrollView>
      <HomeButton />

      {/* Foundation audio overlay — first visit only */}
      {showFoundation && (
        <FoundationOverlay onDismiss={() => setShowFoundation(false)} />
      )}
    </SafeAreaView>
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
    fontFamily: FontFamilies.body,
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
    paddingBottom: Spacing.xxxl,
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
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: -Spacing.xs,
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
    fontFamily: FontFamilies.body,
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
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  recentStatValue: {
    fontFamily: FontFamilies.accent,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },
  practicedPill: {
    backgroundColor: Colors.success + '25',
  },
  practicedText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: FontFamilies.body,
    color: Colors.success,
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
    fontFamily: FontFamilies.body,
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
