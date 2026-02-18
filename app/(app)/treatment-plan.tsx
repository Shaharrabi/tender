/**
 * Treatment Plan Screen — Redesigned
 *
 * A beautiful, infographic-style treatment plan page with
 * animations, progress visualization, and gamification elements.
 * Displays the user's personalized treatment plan generated
 * from their portrait data.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { getPortrait } from '@/services/portrait';
import { generateTreatmentPlan } from '@/utils/treatment/plan-generator';
import { getExerciseById } from '@/utils/interventions/registry';
import MilestoneCard from '@/components/growth/MilestoneCard';
import SparkleIcon from '@/assets/graphics/icons/SparkleIcon';
import TargetIcon from '@/assets/graphics/icons/TargetIcon';
import CalendarIcon from '@/assets/graphics/icons/CalendarIcon';
import CheckmarkIcon from '@/assets/graphics/icons/CheckmarkIcon';
import type { TreatmentPlan, TreatmentPathway } from '@/types/growth';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** Get a stable week identifier (ISO week year-week) for goal persistence */
function getWeekId(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// Pathway accent colors cycling
const PATHWAY_COLORS = [
  Colors.primary,
  Colors.secondary,
  Colors.accent,
  Colors.depth,
  Colors.calm,
];

const CATEGORY_COLORS: Record<string, string> = {
  regulation: Colors.calm,
  communication: Colors.primary,
  attachment: Colors.secondary,
  values: Colors.accent,
  differentiation: Colors.depth,
};

// ─── Animated Stat Card ─────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  delay,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  delay: number;
}) {
  const animValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(animValue, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 5,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: animValue,
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <View style={styles.statIconWrap}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

// ─── Progress Ring ──────────────────────────────────────

function ProgressRing({
  progress,
  size,
  strokeWidth,
}: {
  progress: number; // 0..1
  size: number;
  strokeWidth: number;
}) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // We create a "ring" using bordered Views and rotation
  // The ring is composed of two half-circles
  const halfSize = size / 2;
  const innerSize = size - strokeWidth * 2;

  const rotate1 = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '180deg'],
  });

  const rotate2 = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '0deg', '180deg'],
  });

  const opacity2 = animValue.interpolate({
    inputRange: [0, 0.499, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: halfSize,
        backgroundColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Right half clip */}
      <View
        style={{
          position: 'absolute',
          width: halfSize,
          height: size,
          right: 0,
          overflow: 'hidden',
          borderTopRightRadius: halfSize,
          borderBottomRightRadius: halfSize,
        }}
      >
        <Animated.View
          style={{
            width: halfSize,
            height: size,
            borderTopRightRadius: halfSize,
            borderBottomRightRadius: halfSize,
            borderWidth: strokeWidth,
            borderLeftWidth: 0,
            borderColor: Colors.primary,
            position: 'absolute',
            right: 0,
            transformOrigin: 'left center',
            transform: [{ rotateZ: rotate1 }],
          }}
        />
      </View>
      {/* Left half clip */}
      <View
        style={{
          position: 'absolute',
          width: halfSize,
          height: size,
          left: 0,
          overflow: 'hidden',
          borderTopLeftRadius: halfSize,
          borderBottomLeftRadius: halfSize,
        }}
      >
        <Animated.View
          style={{
            width: halfSize,
            height: size,
            borderTopLeftRadius: halfSize,
            borderBottomLeftRadius: halfSize,
            borderWidth: strokeWidth,
            borderRightWidth: 0,
            borderColor: Colors.primary,
            position: 'absolute',
            left: 0,
            opacity: opacity2,
            transformOrigin: 'right center',
            transform: [{ rotateZ: rotate2 }],
          }}
        />
      </View>
      {/* Inner circle */}
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: Colors.surfaceElevated,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={styles.ringPercentage}>
          {Math.round(progress * 100)}%
        </Text>
        <Text style={styles.ringLabel}>Progress</Text>
      </View>
    </View>
  );
}

// ─── Animated Progress Bar ──────────────────────────────

function AnimatedProgressBar({
  progress,
  color,
  delay = 0,
}: {
  progress: number;
  color: string;
  delay?: number;
}) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, [progress]);

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressBarBg}>
      <Animated.View
        style={[
          styles.progressBarFill,
          {
            width: width,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

// ─── Pathway Card ───────────────────────────────────────

function PathwayCard({
  pathway,
  index,
  onExercisePress,
  animDelay,
}: {
  pathway: TreatmentPathway;
  index: number;
  onExercisePress: (id: string) => void;
  animDelay: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const color = PATHWAY_COLORS[index % PATHWAY_COLORS.length];
  const completedMilestones = 0; // placeholder: no tracking yet
  const totalMilestones = pathway.milestones.length;
  const progress =
    totalMilestones > 0 ? completedMilestones / totalMilestones : 0;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(animDelay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
    setExpanded(!expanded);
  };

  return (
    <Animated.View
      style={[
        styles.pathwayCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Colored left accent bar */}
      <View style={[styles.pathwayAccentBar, { backgroundColor: color }]} />

      <View style={styles.pathwayContent}>
        {/* Header row */}
        <TouchableOpacity
          onPress={toggleExpand}
          activeOpacity={0.7}
          style={styles.pathwayHeader}
        >
          <View style={[styles.pathwayNumberBadge, { backgroundColor: color }]}>
            <Text style={styles.pathwayNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.pathwayHeaderTextWrap}>
            <Text style={styles.pathwayName}>{pathway.name}</Text>
            <Text style={styles.pathwayDescription} numberOfLines={2}>
              {pathway.description}
            </Text>
          </View>
          <Text style={[styles.expandChevron, { color }]}>
            {expanded ? '\u25B2' : '\u25BC'}
          </Text>
        </TouchableOpacity>

        {/* Progress area */}
        <View style={styles.pathwayProgressArea}>
          <View style={styles.pathwayProgressRow}>
            <Text style={styles.pathwayProgressLabel}>
              {completedMilestones}/{totalMilestones} milestones
            </Text>
            <View
              style={[
                styles.weeksBadge,
                { backgroundColor: color + '20' },
              ]}
            >
              <Text style={[styles.weeksBadgeText, { color }]}>
                ~{pathway.estimatedWeeks}w
              </Text>
            </View>
          </View>
          <AnimatedProgressBar
            progress={progress}
            color={color}
            delay={animDelay + 200}
          />
        </View>

        {/* Expanded content */}
        {expanded && (
          <View style={styles.pathwayExpandedContent}>
            {/* Milestones */}
            {pathway.milestones.length > 0 && (
              <View style={styles.pathwayMilestonesSection}>
                <Text style={styles.pathwaySubheading}>Milestones</Text>
                {pathway.milestones.map((milestone, mi) => (
                  <MilestoneCard
                    key={mi}
                    text={milestone}
                    achieved={false}
                    index={mi}
                    total={pathway.milestones.length}
                    accentColor={color}
                  />
                ))}
              </View>
            )}

            {/* Exercises */}
            {pathway.exercises.length > 0 && (
              <View style={styles.pathwayExercisesSection}>
                <Text style={styles.pathwaySubheading}>Exercises</Text>
                <View style={styles.exercisePillsRow}>
                  {pathway.exercises.map((exerciseId) => {
                    const exercise = getExerciseById(exerciseId);
                    if (!exercise) return null;
                    const catColor =
                      CATEGORY_COLORS[exercise.category] || Colors.primary;
                    return (
                      <TouchableOpacity
                        key={exerciseId}
                        style={[
                          styles.exercisePill,
                          { borderColor: catColor },
                        ]}
                        onPress={() => onExercisePress(exerciseId)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.exercisePillDot,
                            { backgroundColor: catColor },
                          ]}
                        />
                        <Text
                          style={[styles.exercisePillText, { color: catColor }]}
                        >
                          {exercise.title}
                        </Text>
                        <Text style={styles.exercisePillArrow}>{'\u203A'}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Horizontal Exercise Card ───────────────────────────

function ExerciseCard({
  exerciseId,
  onPress,
  delay,
}: {
  exerciseId: string;
  onPress: (id: string) => void;
  delay: number;
}) {
  const exercise = getExerciseById(exerciseId);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  if (!exercise) return null;

  const catColor = CATEGORY_COLORS[exercise.category] || Colors.primary;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={() => onPress(exerciseId)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.exerciseCardColorTop,
            { backgroundColor: catColor },
          ]}
        />
        <View style={styles.exerciseCardBody}>
          <Text style={styles.exerciseCardTitle} numberOfLines={2}>
            {exercise.title}
          </Text>
          <Text style={styles.exerciseCardCategory}>
            {exercise.category}
          </Text>
          <View style={styles.exerciseCardFooter}>
            <View
              style={[
                styles.durationBadge,
                { backgroundColor: catColor + '18' },
              ]}
            >
              <Text style={[styles.durationBadgeText, { color: catColor }]}>
                {exercise.duration} min
              </Text>
            </View>
            <View
              style={[
                styles.modeBadge,
                { backgroundColor: Colors.surface },
              ]}
            >
              <Text style={styles.modeBadgeText}>{exercise.mode}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ────────────────────────────────────────

export default function TreatmentPlanScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<TreatmentPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedGoals, setCompletedGoals] = useState<Set<number>>(new Set());

  // Section fade-in animations
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(-20)).current;
  const sectionFades = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const sectionSlides = useRef([
    new Animated.Value(40),
    new Animated.Value(40),
    new Animated.Value(40),
    new Animated.Value(40),
  ]).current;

  const loadPlan = useCallback(async () => {
    if (!user) return;
    try {
      const portrait = await getPortrait(user.id);
      if (!portrait) {
        setError(
          'No portrait found. Complete all assessments to generate your treatment plan.'
        );
        return;
      }
      const generated = generateTreatmentPlan(portrait);
      setPlan(generated);
    } catch (err) {
      console.error('Failed to load treatment plan:', err);
      setError('Something went wrong loading your treatment plan.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Weekly goal completion — persisted per week via AsyncStorage
  const weekKey = `weekly_goals_${user?.id}_${getWeekId()}`;

  useEffect(() => {
    // Load completed goals on mount
    AsyncStorage.getItem(weekKey).then((stored) => {
      if (stored) {
        try {
          const arr = JSON.parse(stored);
          if (Array.isArray(arr)) setCompletedGoals(new Set(arr));
        } catch { /* ignore */ }
      }
    });
  }, [weekKey]);

  const toggleGoal = useCallback(async (index: number) => {
    setCompletedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      // Persist asynchronously
      AsyncStorage.setItem(weekKey, JSON.stringify([...next]));
      return next;
    });
  }, [weekKey]);

  useFocusEffect(
    useCallback(() => {
      loadPlan();
    }, [loadPlan])
  );

  // Run entrance animations when plan loads
  useEffect(() => {
    if (!plan) return;

    // Hero entrance
    Animated.parallel([
      Animated.timing(heroFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(heroSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered section entrances
    sectionFades.forEach((fade, i) => {
      Animated.sequence([
        Animated.delay(300 + i * 200),
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(sectionSlides[i], {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, [plan]);

  const handleBack = () => {
    router.back();
  };

  const handleExercisePress = (exerciseId: string) => {
    router.push({
      pathname: '/(app)/exercise' as any,
      params: { id: exerciseId },
    });
  };

  // ─── Loading State ────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingPulse}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>
              Building your growth plan...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Error State ──────────────────────────────────────

  if (error || !plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Text style={styles.backText}>{'\u2190'} Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Treatment Plan</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <View style={styles.errorIconCircle}>
            <Text style={styles.errorIcon}>!</Text>
          </View>
          <Text style={styles.errorTitle}>Plan Not Available</Text>
          <Text style={styles.errorText}>
            {error ?? 'Unable to generate plan.'}
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Compute totals
  const totalMilestones = plan.pathways.reduce(
    (sum, p) => sum + p.milestones.length,
    0
  );
  const totalPathways = plan.pathways.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* ─── Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backText}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Growth Plan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero Section ───────────────────────────────── */}
        <Animated.View
          style={[
            styles.heroContainer,
            {
              opacity: heroFade,
              transform: [{ translateY: heroSlide }],
            },
          ]}
        >
          {/* Gradient-like layered background */}
          <View style={styles.heroBgLayer1} />
          <View style={styles.heroBgLayer2} />
          <View style={styles.heroBgLayer3} />

          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroEyebrow}>PRIMARY FOCUS</Text>
              <Text style={styles.heroTitle}>{plan.primaryFocus}</Text>
              <View style={styles.heroFrequencyBadge}>
                <View style={styles.heroFrequencyDot} />
                <Text style={styles.heroFrequencyText}>
                  {plan.checkInFrequency === 'daily'
                    ? 'Daily'
                    : 'Weekly'}{' '}
                  check-ins
                </Text>
              </View>
            </View>
            <View style={styles.heroRight}>
              <ProgressRing progress={0} size={90} strokeWidth={6} />
            </View>
          </View>
        </Animated.View>

        {/* ─── Stats Row ──────────────────────────────────── */}
        <Animated.View
          style={[
            styles.statsRow,
            {
              opacity: sectionFades[0],
              transform: [{ translateY: sectionSlides[0] }],
            },
          ]}
        >
          <StatCard
            label="Pathways"
            value={String(totalPathways)}
            icon={<SparkleIcon size={22} color={Colors.primary} />}
            delay={400}
          />
          <StatCard
            label="Milestones"
            value={String(totalMilestones)}
            icon={<TargetIcon size={22} color={Colors.secondary} />}
            delay={550}
          />
          <StatCard
            label="Check-ins"
            value={plan.checkInFrequency === 'daily' ? 'Daily' : 'Weekly'}
            icon={<CalendarIcon size={22} color={Colors.accent} />}
            delay={700}
          />
        </Animated.View>

        {/* ─── Growth Pathways ────────────────────────────── */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: sectionFades[1],
              transform: [{ translateY: sectionSlides[1] }],
            },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Growth Pathways</Text>
              <Text style={styles.sectionSubtitle}>
                Your personalized roadmap to relationship growth
              </Text>
            </View>
          </View>

          {plan.pathways.map((pathway, index) => (
            <PathwayCard
              key={index}
              pathway={pathway}
              index={index}
              onExercisePress={handleExercisePress}
              animDelay={600 + index * 150}
            />
          ))}
        </Animated.View>

        {/* ─── Weekly Goals ───────────────────────────────── */}
        {plan.weeklyGoals.length > 0 && (
          <Animated.View
            style={[
              styles.section,
              {
                opacity: sectionFades[2],
                transform: [{ translateY: sectionSlides[2] }],
              },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Weekly Goals</Text>
                <Text style={styles.sectionSubtitle}>
                  Small steps that lead to big changes
                </Text>
              </View>
            </View>
            <View style={styles.goalsCard}>
              {plan.weeklyGoals.map((goal, i) => {
                const isDone = completedGoals.has(i);
                return (
                  <TouchableOpacity
                    key={i}
                    style={styles.goalRow}
                    onPress={() => toggleGoal(i)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.goalCheckbox,
                      isDone && { backgroundColor: Colors.primary, borderColor: Colors.primary },
                    ]}>
                      {isDone && <CheckmarkIcon size={12} color="#FFFFFF" />}
                    </View>
                    <Text style={[
                      styles.goalText,
                      isDone && styles.goalTextDone,
                    ]}>
                      {goal}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <View style={styles.goalsFooter}>
                <Text style={styles.goalsFooterText}>
                  {completedGoals.size} of {plan.weeklyGoals.length} goals completed this week
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* ─── Recommended Exercises ─────────────────────── */}
        {plan.recommendedExercises.length > 0 && (
          <Animated.View
            style={[
              styles.section,
              {
                opacity: sectionFades[3],
                transform: [{ translateY: sectionSlides[3] }],
              },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>
                  Recommended Exercises
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Curated practices for your journey
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.exerciseScrollContent}
            >
              {plan.recommendedExercises.map((exerciseId, i) => (
                <ExerciseCard
                  key={exerciseId}
                  exerciseId={exerciseId}
                  onPress={handleExercisePress}
                  delay={900 + i * 100}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Bottom spacer */}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingPulse: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    fontFamily: FontFamilies.heading,
    fontStyle: 'italic',
  },

  // Error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  errorIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  errorIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.error,
  },
  errorTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    color: Colors.text,
  },
  errorText: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.pill,
  },
  errorButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: FontSizes.bodySmall,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  backText: {
    fontSize: FontSizes.bodySmall,
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

  // Scroll
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },

  // ─── Hero ───────────────────────────────────────────
  heroContainer: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 180,
    ...Shadows.elevated,
  },
  heroBgLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
  },
  heroBgLayer2: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryLight,
    opacity: 0.4,
  },
  heroBgLayer3: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.calm,
    opacity: 0.15,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  heroLeft: {
    flex: 1,
    gap: Spacing.sm,
  },
  heroEyebrow: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    color: Colors.textOnPrimary,
    lineHeight: 30,
  },
  heroFrequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    gap: 6,
    marginTop: Spacing.xs,
  },
  heroFrequencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  heroFrequencyText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },
  heroRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Progress Ring ──────────────────────────────────
  ringPercentage: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    color: Colors.primary,
  },
  ringLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ─── Stats Row ──────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    ...Shadows.card,
  },
  statIconWrap: {
    marginBottom: 2,
    alignItems: 'center' as const,
  },
  statValue: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // ─── Sections ───────────────────────────────────────
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ─── Pathway Card ──────────────────────────────────
  pathwayCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.card,
  },
  pathwayAccentBar: {
    width: 5,
  },
  pathwayContent: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  pathwayHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 2,
  },
  pathwayNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  pathwayNumberText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '800',
    color: Colors.textOnPrimary,
  },
  pathwayHeaderTextWrap: {
    flex: 1,
    gap: 4,
  },
  pathwayName: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 22,
  },
  pathwayDescription: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  expandChevron: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  // Pathway progress
  pathwayProgressArea: {
    gap: Spacing.xs + 2,
  },
  pathwayProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pathwayProgressLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  weeksBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  weeksBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Progress bar
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    minWidth: 6,
  },

  // Pathway expanded
  pathwayExpandedContent: {
    gap: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  pathwayMilestonesSection: {
    gap: Spacing.xs,
  },
  pathwaySubheading: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pathwayExercisesSection: {
    gap: Spacing.sm,
  },
  exercisePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  exercisePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 3,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    backgroundColor: Colors.surfaceElevated,
    gap: 6,
  },
  exercisePillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  exercisePillText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },
  exercisePillArrow: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '300',
    marginLeft: 2,
  },

  // ─── Weekly Goals ──────────────────────────────────
  goalsCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.card,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 4,
  },
  goalCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  goalText: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  goalTextDone: {
    textDecorationLine: 'line-through' as const,
    color: Colors.textMuted,
  },
  goalsFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm + 2,
    marginTop: Spacing.xs,
  },
  goalsFooterText: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '500',
    textAlign: 'center',
  },

  // ─── Recommended Exercises Horizontal ─────────────
  exerciseScrollContent: {
    paddingRight: Spacing.md,
    gap: Spacing.sm + 4,
  },
  exerciseCard: {
    width: 170,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  exerciseCardColorTop: {
    height: 6,
  },
  exerciseCardBody: {
    padding: Spacing.md,
    gap: Spacing.xs + 2,
  },
  exerciseCardTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 20,
  },
  exerciseCardCategory: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  exerciseCardFooter: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    marginTop: Spacing.xs,
  },
  durationBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  durationBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  modeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
});
