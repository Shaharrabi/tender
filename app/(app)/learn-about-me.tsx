/**
 * Learn About Myself — Guided Self-Discovery Screen
 *
 * A warm, carousel-style walkthrough of the user's Integrated Map results.
 * Auto-detects strengths (high composite scores) and growing areas (low scores),
 * then presents matched practices from the exercise registry.
 *
 * Steps:
 *   1. Your Strengths — highlighted domains with scores
 *   2. Strength Practices — exercises that build on strong domains
 *   3. Growing Areas — gentle growth-oriented view of lower scores
 *   4. Growth Practices — exercises matched to growth edges
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontFamilies, BorderRadius, Shadows, Typography } from '@/constants/theme';
import TenderText from '@/components/ui/TenderText';
import TenderButton from '@/components/ui/TenderButton';
import { getAllExercises } from '@/utils/interventions/registry';
import { useAuth } from '@/context/AuthContext';
import { getPortrait } from '@/services/portrait';
import type { IndividualPortrait, CompositeScores, GrowthEdge } from '@/types/portrait';
import type { Intervention, InterventionCategory } from '@/types/intervention';

// ─── Constants ──────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STRENGTH_THRESHOLD = 65;
const GROWTH_THRESHOLD = 40;

const STRENGTH_BG = '#E8F0E6';
const STRENGTH_ACCENT = '#6B8F71';
const GROWTH_BG = '#F5EBE8';
const GROWTH_ACCENT = '#B5593A';

/** Maps composite score keys to human-readable labels and exercise categories/patterns. */
const DOMAIN_MAP: Record<
  string,
  { label: string; description: string; categories: InterventionCategory[]; patterns: string[] }
> = {
  attachmentSecurity: {
    label: 'Attachment Security',
    description: 'Your capacity for secure, trusting connection',
    categories: ['attachment'],
    patterns: ['attachment', 'emotional_bids', 'disconnection'],
  },
  emotionalIntelligence: {
    label: 'Emotional Intelligence',
    description: 'Your ability to perceive, understand, and navigate emotions',
    categories: ['communication'],
    patterns: ['empathy', 'emotional_awareness', 'perception'],
  },
  differentiation: {
    label: 'Differentiation',
    description: 'Your balance between closeness and individuality',
    categories: ['differentiation'],
    patterns: ['differentiation', 'boundaries', 'fusion'],
  },
  conflictFlexibility: {
    label: 'Conflict Flexibility',
    description: 'Your adaptability when navigating disagreements',
    categories: ['communication'],
    patterns: ['conflict', 'repair', 'flooding'],
  },
  relationalAwareness: {
    label: 'Relational Awareness',
    description: 'Your attunement to the relationship space between you and others',
    categories: ['communication', 'attachment'],
    patterns: ['attunement', 'presence', 'emotional_bids'],
  },
  regulationScore: {
    label: 'Emotional Regulation',
    description: 'Your capacity to stay grounded when emotions run high',
    categories: ['regulation'],
    patterns: ['regulation', 'flooding', 'hyperactivation', 'shutdown'],
  },
  windowWidth: {
    label: 'Window of Tolerance',
    description: 'The bandwidth within which you can stay present and engaged',
    categories: ['regulation'],
    patterns: ['window_of_tolerance', 'regulation', 'flooding'],
  },
  accessibility: {
    label: 'Emotional Accessibility',
    description: 'How open and reachable you are to your partner emotionally',
    categories: ['attachment'],
    patterns: ['emotional_walls', 'avoidance', 'attachment'],
  },
  responsiveness: {
    label: 'Responsiveness',
    description: 'How attuned you are to your partner\'s emotional needs',
    categories: ['communication', 'attachment'],
    patterns: ['attunement', 'empathy', 'emotional_bids'],
  },
  engagement: {
    label: 'Engagement',
    description: 'Your active investment in the relationship',
    categories: ['attachment'],
    patterns: ['disconnection', 'low_engagement', 'emotional_neglect'],
  },
  selfLeadership: {
    label: 'Self-Leadership',
    description: 'Your ability to lead from a centered, grounded place',
    categories: ['differentiation'],
    patterns: ['protective_patterns', 'differentiation', 'self_awareness'],
  },
  valuesCongruence: {
    label: 'Values Congruence',
    description: 'The alignment between what you value and how you act',
    categories: ['values'],
    patterns: ['values_gap', 'avoidance', 'values'],
  },
};

// Subset of domains to analyze (the radar-chart dimensions + key composites)
const ANALYZED_DOMAINS = [
  'attachmentSecurity',
  'emotionalIntelligence',
  'differentiation',
  'conflictFlexibility',
  'relationalAwareness',
  'regulationScore',
  'selfLeadership',
  'valuesCongruence',
];

interface DomainScore {
  key: string;
  label: string;
  description: string;
  score: number;
  categories: InterventionCategory[];
  patterns: string[];
}

// ─── Step Indicator ──────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={indicatorStyles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            indicatorStyles.dot,
            i === current && indicatorStyles.dotActive,
          ]}
        />
      ))}
    </View>
  );
}

const indicatorStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
    borderRadius: 4,
  },
});

// ─── Score Bar ───────────────────────────────────────────

function ScoreBar({
  domain,
  accent,
}: {
  domain: DomainScore;
  accent: string;
}) {
  return (
    <View style={scoreBarStyles.container}>
      <View style={scoreBarStyles.labelRow}>
        <TenderText variant="bodySmall" style={{ fontFamily: 'JosefinSans_500Medium' }}>
          {domain.label}
        </TenderText>
        <TenderText
          variant="bodySmall"
          style={{ fontFamily: 'PlayfairDisplay_600SemiBold', color: accent }}
        >
          {Math.round(domain.score)}
        </TenderText>
      </View>
      <View style={scoreBarStyles.track}>
        <View
          style={[
            scoreBarStyles.fill,
            { width: `${Math.min(100, Math.max(0, domain.score))}%`, backgroundColor: accent },
          ]}
        />
      </View>
      <TenderText variant="caption" color={Colors.textSecondary} style={{ marginTop: 2 }}>
        {domain.description}
      </TenderText>
    </View>
  );
}

const scoreBarStyles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
});

// ─── Practice Card ───────────────────────────────────────

function PracticeCard({
  exercise,
  onPress,
  accent,
}: {
  exercise: Intervention;
  onPress: () => void;
  accent: string;
}) {
  return (
    <TouchableOpacity
      style={practiceCardStyles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Open practice: ${exercise.title}`}
    >
      <View style={practiceCardStyles.header}>
        <View style={[practiceCardStyles.categoryBadge, { backgroundColor: accent + '20' }]}>
          <TenderText
            variant="caption"
            style={{ color: accent, fontFamily: 'JosefinSans_500Medium', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}
          >
            {exercise.category}
          </TenderText>
        </View>
        <TenderText variant="caption" color={Colors.textMuted}>
          {exercise.duration} min
        </TenderText>
      </View>
      <TenderText variant="headingS" style={{ marginTop: 6 }}>
        {exercise.title}
      </TenderText>
      <TenderText
        variant="bodySmall"
        color={Colors.textSecondary}
        style={{ marginTop: 4 }}
        numberOfLines={2}
      >
        {exercise.description}
      </TenderText>
      {exercise.fieldInsight && (
        <TenderText
          variant="caption"
          color={accent}
          style={{ marginTop: 8, fontStyle: 'italic' }}
          numberOfLines={1}
        >
          {exercise.fieldInsight}
        </TenderText>
      )}
    </TouchableOpacity>
  );
}

const practiceCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
});

// ─── Main Component ──────────────────────────────────────

export default function LearnAboutMeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [portrait, setPortrait] = useState<IndividualPortrait | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const TOTAL_STEPS = 4;

  // ── Load portrait ──
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        const p = await getPortrait(user.id);
        if (!cancelled) setPortrait(p);
      } catch (err) {
        console.warn('[LearnAboutMe] Error loading portrait:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  // ── Derive strengths and growth areas from composite scores ──
  const { strengths, growthAreas } = useMemo(() => {
    if (!portrait?.compositeScores) return { strengths: [], growthAreas: [] };

    const cs = portrait.compositeScores;
    const s: DomainScore[] = [];
    const g: DomainScore[] = [];

    for (const key of ANALYZED_DOMAINS) {
      const value = (cs as any)[key] as number | undefined;
      if (value == null) continue;

      const meta = DOMAIN_MAP[key];
      if (!meta) continue;

      const domain: DomainScore = {
        key,
        label: meta.label,
        description: meta.description,
        score: value,
        categories: meta.categories,
        patterns: meta.patterns,
      };

      if (value >= STRENGTH_THRESHOLD) s.push(domain);
      if (value <= GROWTH_THRESHOLD) g.push(domain);
    }

    // Sort strengths descending, growth areas ascending
    s.sort((a, b) => b.score - a.score);
    g.sort((a, b) => a.score - b.score);

    return { strengths: s, growthAreas: g };
  }, [portrait]);

  // ── Find matching exercises ──
  const allExercises = useMemo(() => getAllExercises(), []);

  const strengthExercises = useMemo(() => {
    if (strengths.length === 0) return [];

    const relevantCategories = new Set<InterventionCategory>();
    const relevantPatterns = new Set<string>();
    for (const d of strengths) {
      d.categories.forEach(c => relevantCategories.add(c));
      d.patterns.forEach(p => relevantPatterns.add(p));
    }

    // Score each exercise by how many strength categories/patterns it matches
    const scored = allExercises.map(ex => {
      let score = 0;
      if (relevantCategories.has(ex.category)) score += 2;
      for (const p of ex.forPatterns) {
        if (relevantPatterns.has(p.toLowerCase())) score += 1;
      }
      return { ex, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.ex);
  }, [strengths, allExercises]);

  const growthExercises = useMemo(() => {
    // Prefer exercises from growth edges in portrait, then fall back to domain matching
    const fromGrowthEdges: Intervention[] = [];
    if (portrait?.growthEdges) {
      for (const edge of portrait.growthEdges) {
        for (const practiceId of edge.practices) {
          const ex = allExercises.find(e => e.id === practiceId);
          if (ex && !fromGrowthEdges.includes(ex)) fromGrowthEdges.push(ex);
        }
      }
    }

    if (fromGrowthEdges.length >= 5) return fromGrowthEdges.slice(0, 5);

    // Fill remaining from growth area domain matching
    const relevantCategories = new Set<InterventionCategory>();
    const relevantPatterns = new Set<string>();
    for (const d of growthAreas) {
      d.categories.forEach(c => relevantCategories.add(c));
      d.patterns.forEach(p => relevantPatterns.add(p));
    }

    const alreadyIds = new Set(fromGrowthEdges.map(e => e.id));
    const scored = allExercises
      .filter(ex => !alreadyIds.has(ex.id))
      .map(ex => {
        let score = 0;
        if (relevantCategories.has(ex.category)) score += 2;
        for (const p of ex.forPatterns) {
          if (relevantPatterns.has(p.toLowerCase())) score += 1;
        }
        return { ex, score };
      });

    const additional = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5 - fromGrowthEdges.length)
      .map(s => s.ex);

    return [...fromGrowthEdges, ...additional].slice(0, 5);
  }, [growthAreas, portrait, allExercises]);

  // ── Navigation ──
  const goNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) setCurrentStep(s => s + 1);
  }, [currentStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  }, [currentStep]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleOpenExercise = useCallback((exerciseId: string) => {
    router.push(`/(app)/exercise?id=${exerciseId}`);
  }, [router]);

  // ── Loading state ──
  if (loading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <TenderText variant="body" color={Colors.textSecondary} style={{ marginTop: Spacing.md }}>
          Loading your results...
        </TenderText>
      </View>
    );
  }

  // ── No portrait ──
  if (!portrait) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <TenderText variant="headingM" align="center">
          Your Portrait Is Waiting
        </TenderText>
        <TenderText
          variant="body"
          color={Colors.textSecondary}
          align="center"
          style={{ marginTop: Spacing.md, paddingHorizontal: Spacing.xl }}
        >
          Complete all 6 assessments and generate your portrait to unlock this guided experience.
        </TenderText>
        <View style={{ marginTop: Spacing.lg }}>
          <TenderButton title="Go Back" variant="outline" onPress={handleClose} />
        </View>
      </View>
    );
  }

  // ── Render step content ──
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Animated.View key="strengths" entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
            <View style={[styles.sectionHeader, { backgroundColor: STRENGTH_BG }]}>
              <TenderText variant="caption" style={styles.sectionEyebrow}>
                STEP 1 OF 4
              </TenderText>
              <TenderText variant="headingL" style={{ color: STRENGTH_ACCENT }}>
                Your Strengths
              </TenderText>
              <TenderText variant="body" color={Colors.textSecondary} style={{ marginTop: Spacing.sm }}>
                {strengths.length > 0
                  ? 'These are the dimensions where you naturally shine. They are your relational superpowers \u2014 the foundation you can always return to.'
                  : 'Your scores are fairly balanced across dimensions. As you continue growing, some will naturally emerge as clear strengths.'}
              </TenderText>
            </View>

            <View style={styles.contentPadding}>
              {strengths.length > 0 ? (
                strengths.map(d => (
                  <ScoreBar key={d.key} domain={d} accent={STRENGTH_ACCENT} />
                ))
              ) : (
                <View style={styles.emptyNote}>
                  <TenderText variant="bodySmall" color={Colors.textSecondary} align="center">
                    No domains scored above {STRENGTH_THRESHOLD} yet. Every dimension has room to become a strength with practice.
                  </TenderText>
                </View>
              )}
            </View>
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View key="strength-practices" entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
            <View style={[styles.sectionHeader, { backgroundColor: STRENGTH_BG }]}>
              <TenderText variant="caption" style={styles.sectionEyebrow}>
                STEP 2 OF 4
              </TenderText>
              <TenderText variant="headingL" style={{ color: STRENGTH_ACCENT }}>
                Strength Practices
              </TenderText>
              <TenderText variant="body" color={Colors.textSecondary} style={{ marginTop: Spacing.sm }}>
                Practices that deepen what you already do well. Building on strengths is one of the most effective paths to growth.
              </TenderText>
            </View>

            <View style={styles.contentPadding}>
              {strengthExercises.length > 0 ? (
                strengthExercises.map(ex => (
                  <PracticeCard
                    key={ex.id}
                    exercise={ex}
                    accent={STRENGTH_ACCENT}
                    onPress={() => handleOpenExercise(ex.id)}
                  />
                ))
              ) : (
                <View style={styles.emptyNote}>
                  <TenderText variant="bodySmall" color={Colors.textSecondary} align="center">
                    Complete more assessments to unlock personalized strength practices.
                  </TenderText>
                </View>
              )}
            </View>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View key="growth-areas" entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
            <View style={[styles.sectionHeader, { backgroundColor: GROWTH_BG }]}>
              <TenderText variant="caption" style={styles.sectionEyebrow}>
                STEP 3 OF 4
              </TenderText>
              <TenderText variant="headingL" style={{ color: GROWTH_ACCENT }}>
                Growing Areas
              </TenderText>
              <TenderText variant="body" color={Colors.textSecondary} style={{ marginTop: Spacing.sm }}>
                {growthAreas.length > 0
                  ? 'These are the dimensions with the most room to grow. Lower scores aren\'t weaknesses \u2014 they\'re invitations to develop new relational capacities.'
                  : 'Your scores are well above the growth threshold across all dimensions. You have a solid foundation to build on.'}
              </TenderText>
            </View>

            <View style={styles.contentPadding}>
              {growthAreas.length > 0 ? (
                growthAreas.map(d => (
                  <ScoreBar key={d.key} domain={d} accent={GROWTH_ACCENT} />
                ))
              ) : (
                <View style={styles.emptyNote}>
                  <TenderText variant="bodySmall" color={Colors.textSecondary} align="center">
                    No domains scored below {GROWTH_THRESHOLD}. Keep nurturing all dimensions \u2014 even strong areas benefit from continued attention.
                  </TenderText>
                </View>
              )}
            </View>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View key="growth-practices" entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
            <View style={[styles.sectionHeader, { backgroundColor: GROWTH_BG }]}>
              <TenderText variant="caption" style={styles.sectionEyebrow}>
                STEP 4 OF 4
              </TenderText>
              <TenderText variant="headingL" style={{ color: GROWTH_ACCENT }}>
                Growth Practices
              </TenderText>
              <TenderText variant="body" color={Colors.textSecondary} style={{ marginTop: Spacing.sm }}>
                Gentle exercises designed to meet you exactly where you are and help you grow at your own pace.
              </TenderText>
            </View>

            <View style={styles.contentPadding}>
              {growthExercises.length > 0 ? (
                growthExercises.map(ex => (
                  <PracticeCard
                    key={ex.id}
                    exercise={ex}
                    accent={GROWTH_ACCENT}
                    onPress={() => handleOpenExercise(ex.id)}
                  />
                ))
              ) : (
                <View style={styles.emptyNote}>
                  <TenderText variant="bodySmall" color={Colors.textSecondary} align="center">
                    Complete more assessments to unlock personalized growth practices.
                  </TenderText>
                </View>
              )}
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  const isStrengthStep = currentStep <= 1;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Close button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <TenderText variant="headingM" color={Colors.textSecondary}>
          {'\u2715'}
        </TenderText>
      </TouchableOpacity>

      {/* Step indicator */}
      <StepIndicator current={currentStep} total={TOTAL_STEPS} />

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={[styles.navRow, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
        {currentStep > 0 ? (
          <TenderButton
            title="Back"
            variant="ghost"
            size="md"
            onPress={goPrev}
          />
        ) : (
          <View style={{ width: 80 }} />
        )}

        {currentStep < TOTAL_STEPS - 1 ? (
          <TenderButton
            title="Next"
            variant="primary"
            size="md"
            onPress={goNext}
          />
        ) : (
          <TenderButton
            title="Done"
            variant="primary"
            size="md"
            onPress={handleClose}
          />
        )}
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 52,
    right: Spacing.md,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  sectionEyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: Colors.textMuted,
    fontFamily: 'Jost_500Medium',
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  contentPadding: {
    paddingHorizontal: Spacing.lg,
  },
  emptyNote: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
});
