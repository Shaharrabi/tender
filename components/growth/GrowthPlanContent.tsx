/**
 * GrowthPlanContent — Extracted from portrait.tsx GrowthTab
 *
 * Renders the protocol-based growth plan with:
 * - Matched intervention protocol (name, description)
 * - Growth progress bar with phase breakdown
 * - Four Movements of Growth (Recognition, Release, Resonance, Embodiment)
 * - Protocol phases with exercises and done states
 * - Contraindications / guidance
 * - Growth edges with linked exercises
 *
 * Used by both portrait.tsx (GrowthTab) and treatment-plan.tsx
 * to provide a unified growth plan experience.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
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
import { getExerciseById } from '@/utils/interventions/registry';
import { getExercisesForEdge } from '@/utils/portrait/growth-edges';
import { CATEGORY_ACCENT_COLORS } from '@/components/intervention/ExerciseCard';
import { getCompletions } from '@/services/intervention';
import {
  calculateGrowthProgress,
  boostMovementsFromProgress,
} from '@/utils/steps/intervention-protocols';
import type { GrowthProgress } from '@/utils/steps/intervention-protocols';
import SparkleIcon from '@/assets/graphics/icons/SparkleIcon';
import type { IndividualPortrait } from '@/types';

// ─── Props ───────────────────────────────────────────────

interface GrowthPlanContentProps {
  portrait: IndividualPortrait;
  router: any;
}

// ─── Component ───────────────────────────────────────────

export default function GrowthPlanContent({ portrait, router }: GrowthPlanContentProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { user } = useAuth();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // ── Completion tracking ──
  const [completionMap, setCompletionMap] = useState<Record<string, number>>({});

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      getCompletions(user.id, 500)
        .then((completions) => {
          const map: Record<string, number> = {};
          for (const c of completions) {
            map[c.exerciseId] = (map[c.exerciseId] ?? 0) + 1;
          }
          setCompletionMap(map);
        })
        .catch(() => {});
    }, [user])
  );

  // Get the intervention protocol and four movements
  let protocol: any = null;
  let movements: any = null;
  let journeyMap: any = null;
  try {
    const { matchProtocol, assessFourMovements, generateJourneyMap } = require('@/utils/steps/intervention-protocols');
    const { primary } = matchProtocol(portrait);
    protocol = primary;
    movements = assessFourMovements(portrait);
    journeyMap = generateJourneyMap(protocol, movements);
  } catch {
    // Protocol engine not available — show growth edges only
  }

  // ── Growth progress from completions ──
  const growthProgress: GrowthProgress | null = useMemo(() => {
    if (!protocol) return null;
    return calculateGrowthProgress(protocol, completionMap);
  }, [protocol, completionMap]);

  // ── Boost Four Movements with practice completions ──
  const boostedMovements = useMemo(() => {
    if (!movements) return movements;
    if (Object.keys(completionMap).length === 0) return movements;
    return boostMovementsFromProgress(movements, completionMap, getExerciseById as any);
  }, [movements, completionMap]);

  const { FOUR_MOVEMENTS_EXPLAINED } = require('@/utils/steps/twelve-steps');

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* ── Your Personalized Growth Plan ── */}
      {protocol && journeyMap && (
        <View style={s.protocolSection}>
          <Text style={s.protocolEyebrow}>YOUR GROWTH PLAN</Text>
          <Text style={s.protocolName}>{protocol.name}</Text>
          <Text style={s.protocolDescription}>{protocol.description}</Text>

          {/* Growth Progress Bar */}
          {growthProgress && (
            <View style={s.growthProgressContainer}>
              <View style={s.growthProgressHeader}>
                <Text style={s.growthProgressLabel}>Growth Progress</Text>
                <Text style={s.growthProgressPct}>{growthProgress.overall}%</Text>
              </View>
              <View style={s.growthProgressTrack}>
                <View
                  style={[
                    s.growthProgressFill,
                    { width: `${Math.max(growthProgress.overall, 2)}%` as any },
                  ]}
                />
              </View>
              {/* Mini phase bars */}
              <View style={s.phaseProgressRow}>
                {growthProgress.phaseProgress.map((p, i) => (
                  <View key={i} style={s.phaseProgressItem}>
                    <View style={s.phaseProgressMiniTrack}>
                      <View
                        style={[
                          s.phaseProgressMiniFill,
                          {
                            width: `${Math.max(p.pct, 4)}%` as any,
                            backgroundColor: p.isComplete ? Colors.successDark : Colors.secondary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={s.phaseProgressMiniLabel} numberOfLines={1}>
                      {p.isComplete ? '\u2713 ' : ''}{p.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Four Movements Visualization */}
          {boostedMovements && (
            <View style={s.movementsContainer}>
              <Text style={s.movementsSectionTitle}>Four Movements of Growth</Text>
              <Text style={s.movementsSubtitle}>
                Where you are in each dimension of relational growth
              </Text>
              {(['recognition', 'release', 'resonance', 'embodiment'] as const).map((key) => {
                const m = boostedMovements[key];
                const explained = (FOUR_MOVEMENTS_EXPLAINED as any)[key];
                return (
                  <View key={key} style={s.movementCard}>
                    <View style={s.movementCardHeader}>
                      {explained?.icon ? (
                        (() => { const IconComp = explained.icon; return <IconComp size={22} color={Colors.primary} />; })()
                      ) : null}
                      <View style={{ flex: 1 }}>
                        <Text style={s.movementName}>{m.name}</Text>
                        <Text style={s.movementQuestion}>{explained?.question || m.subtitle}</Text>
                      </View>
                      <Text style={s.movementScore}>{m.readiness}%</Text>
                    </View>
                    <View style={s.movementProgressTrack}>
                      <View
                        style={[
                          s.movementProgressFill,
                          { width: `${Math.max(m.readiness, 3)}%` as any },
                        ]}
                      />
                    </View>
                    <Text style={s.movementDescription}>
                      {explained?.howItFeels || m.description}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Your Path — Integrated into the 12-step journey */}
          <View style={s.phasesContainer}>
            <Text style={s.movementsSectionTitle}>Your Path</Text>
            <View style={s.pathIntegratedCard}>
              <Text style={s.pathIntegratedText}>
                Your 12-step journey is your path. Each step integrates the practices your protocol recommends — completing steps and exercises grows your edges and moves your portrait score.
              </Text>
            </View>
          </View>

          {/* Contraindications as gentle guidance */}
          {protocol.contraindications.length > 0 && (
            <View style={s.guidanceContainer}>
              <Text style={s.guidanceTitle}>What to keep in mind</Text>
              {protocol.contraindications.map((c: string, i: number) => (
                <Text key={i} style={s.guidanceItem}>{'\u2022'} {c}</Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ── Growth Edges ── */}
      <Text style={s.tabIntro}>
        Your growth edges — the areas where small, consistent practice creates the most transformation.
      </Text>

      {portrait.growthEdges.map((edge, i) => (
        <View key={edge.id} style={s.growthEdgeCard}>
          <View style={s.growthEdgeHeader}>
            <View style={s.growthEdgeNumber}>
              <Text style={s.growthEdgeNumberText}>{i + 1}</Text>
            </View>
            <View style={s.growthEdgeHeaderText}>
              <Text style={s.growthEdgeLabel}>GROWTH EDGE {i + 1}</Text>
              <Text style={s.growthEdgeTitle}>{edge.title}</Text>
            </View>
          </View>

          <Text style={s.growthEdgeDescription}>{edge.description}</Text>

          <View style={s.growthEdgeRationaleBox}>
            <Text style={s.growthEdgeRationale}>{edge.rationale}</Text>
          </View>

          {edge.practices.length > 0 && (
            <View style={s.practicesSection}>
              <Text style={s.practicesTitle}>Guidance</Text>
              {edge.practices.map((p: string, j: number) => (
                <View key={j} style={s.practiceItem}>
                  <View style={s.practiceCheckbox}>
                    <Text style={s.practiceCheckboxText}>{'○'}</Text>
                  </View>
                  <Text style={s.practiceText}>{p}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Linked exercises for this growth edge */}
          {(() => {
            const edgeExercises = getExercisesForEdge(edge.id)
              .map((id) => getExerciseById(id))
              .filter(Boolean)
              .slice(0, 3);
            if (edgeExercises.length === 0) return null;
            return (
              <View style={s.phaseExercises}>
                <Text style={s.phaseExercisesLabel}>Try These Exercises</Text>
                {edgeExercises.map((ex: any) => {
                  const isDone = (completionMap[ex.id] ?? 0) > 0;
                  const accentColor = isDone
                    ? Colors.successDark
                    : CATEGORY_ACCENT_COLORS[ex.category as keyof typeof CATEGORY_ACCENT_COLORS] || Colors.primary;
                  return (
                    <TouchableOpacity
                      key={ex.id}
                      style={[s.exerciseRow, isDone && s.exerciseRowDone]}
                      activeOpacity={0.7}
                      onPress={() => router.push({ pathname: '/(app)/exercise', params: { id: ex.id } } as any)}
                      accessibilityRole="link"
                      accessibilityLabel={`${ex.title}, ${isDone ? 'completed' : `${ex.duration} minutes`}`}
                    >
                      {isDone ? (
                        <View style={s.exerciseCheckmark}>
                          <Text style={s.exerciseCheckmarkText}>{'\u2713'}</Text>
                        </View>
                      ) : (
                        <View style={[s.exerciseDot, { backgroundColor: accentColor }]} />
                      )}
                      <Text
                        style={[s.exerciseRowTitle, isDone && s.exerciseRowTitleDone]}
                        numberOfLines={1}
                      >
                        {ex.title}
                      </Text>
                      <Text style={s.exerciseRowMeta}>
                        {isDone ? 'Done' : `${ex.duration} min`}
                      </Text>
                      <Text style={s.exerciseRowArrow}>{'\u203A'}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })()}
        </View>
      ))}
    </Animated.View>
  );
}

// ─── Styles (duplicated from portrait.tsx for safety — originals remain intact) ──

const s = StyleSheet.create({
  // Tab Intro
  tabIntro: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },

  // Protocol / Growth Plan
  protocolSection: {
    marginBottom: Spacing.xl,
  },
  protocolEyebrow: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  protocolName: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  protocolDescription: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },

  // Four Movements
  movementsContainer: {
    marginBottom: Spacing.lg,
  },
  movementsSectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingS,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  movementsSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  movementCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  movementCardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.sm,
  },
  movementName: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
  },
  movementQuestion: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },
  movementScore: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },
  movementProgressTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginBottom: Spacing.sm,
    overflow: 'hidden' as const,
  },
  movementProgressFill: {
    height: '100%' as any,
    backgroundColor: Colors.secondary,
    borderRadius: 3,
  },
  movementDescription: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  // Phases
  phasesContainer: {
    marginBottom: Spacing.lg,
  },
  pathIntegratedCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pathIntegratedText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  phaseCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  phaseHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.sm,
  },
  phaseIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    marginRight: Spacing.sm,
  },
  phaseName: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
  },
  phaseWeeks: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },
  phaseFocus: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    paddingLeft: Spacing.md + Spacing.sm,
  },
  phaseExercises: {
    marginTop: Spacing.sm,
    paddingLeft: Spacing.md + Spacing.sm,
  },
  phaseExercisesLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  // Exercise rows
  exerciseRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    marginBottom: 6,
  },
  exerciseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  exerciseRowTitle: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
  },
  exerciseRowMeta: {
    fontSize: 11,
    color: Colors.textMuted,
    marginRight: 8,
  },
  exerciseRowArrow: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  exerciseRowDone: {
    backgroundColor: Colors.successLight,
    opacity: 0.85,
  },
  exerciseCheckmark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.successDark,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 10,
  },
  exerciseCheckmarkText: {
    fontSize: 11,
    color: Colors.white,
  },
  exerciseRowTitleDone: {
    color: Colors.successDark,
  },

  // Guidance / Contraindications
  guidanceContainer: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  guidanceTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingS,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  guidanceItem: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.xs,
  },

  // Growth Progress
  growthProgressContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  growthProgressHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.sm,
  },
  growthProgressLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
  },
  growthProgressPct: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.textSecondary,
  },
  growthProgressTrack: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: 'hidden' as const,
    marginBottom: Spacing.md,
  },
  growthProgressFill: {
    height: '100%' as any,
    backgroundColor: Colors.secondary,
    borderRadius: 5,
  },
  phaseProgressRow: {
    flexDirection: 'row' as const,
    gap: Spacing.sm,
  },
  phaseProgressItem: {
    flex: 1,
  },
  phaseProgressMiniTrack: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden' as const,
    marginBottom: 4,
  },
  phaseProgressMiniFill: {
    height: '100%' as any,
    borderRadius: 2,
  },
  phaseProgressMiniLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 9,
    color: Colors.textMuted,
  },
  phaseProgressText: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'right' as const,
  },

  // Phase Completion Summary
  phaseCompleteSummary: {
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.successDark,
  },
  phaseCompleteIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  phaseCompleteTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.successDark,
    marginBottom: 4,
  },
  phaseCompleteText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.successMuted,
    lineHeight: 24,
  },

  // Growth Edges
  growthEdgeCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  growthEdgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  growthEdgeNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  growthEdgeNumberText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.white,
  },
  growthEdgeHeaderText: {
    flex: 1,
    gap: 2,
  },
  growthEdgeLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  growthEdgeTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.text,
  },
  growthEdgeDescription: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
  growthEdgeRationaleBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  growthEdgeRationale: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  practicesSection: {
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  practicesTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingS,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  practiceCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  practiceCheckboxText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  practiceText: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
});
