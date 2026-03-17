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
import TenderText from '@/components/ui/TenderText';
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
import SeedlingIcon from '@/assets/graphics/icons/SeedlingIcon';
import GrowthEdgeSummaryCard from '@/components/portrait-enhancements/GrowthEdgeSummaryCard';

// ─── Wes Anderson Palette ────────────────────────────────
const WA = {
  sage: '#A8B5A2',
  terracotta: '#C4836A',
  dustyBlue: '#8BA4B8',
  mustard: '#D4A843',
  blush: '#E8B4B8',
  plum: '#8B6B7B',
  cream: '#F5F0E8',
};
import type { IndividualPortrait } from '@/types';

// ─── Props ───────────────────────────────────────────────

interface GrowthPlanContentProps {
  portrait: IndividualPortrait;
  router: any;
  phaseColor?: string;
}

// ─── Component ───────────────────────────────────────────

export default function GrowthPlanContent({ portrait, router, phaseColor }: GrowthPlanContentProps) {
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
          <TenderText variant="label" color={WA.sage} style={s.protocolEyebrow}>YOUR GROWTH PLAN</TenderText>
          <TenderText variant="headingM" color={Colors.text} style={s.protocolName}>{protocol.name}</TenderText>
          <TenderText variant="body" color={Colors.textSecondary} style={s.protocolDescription}>{protocol.description}</TenderText>

          {/* Growth Progress Bar */}
          {growthProgress && (
            <View style={s.growthProgressContainer}>
              <View style={s.growthProgressHeader}>
                <View style={s.growthProgressLabelRow}>
                  <SeedlingIcon size={14} color={WA.sage} />
                  <TenderText variant="headingS" color={Colors.text}>Growth Progress</TenderText>
                </View>
                <TenderText variant="headingM" color={WA.sage} style={s.growthProgressPct}>{growthProgress.overall}%</TenderText>
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
                            backgroundColor: p.isComplete ? WA.sage : WA.terracotta,
                          },
                        ]}
                      />
                    </View>
                    <TenderText variant="caption" color={Colors.textMuted} style={s.phaseProgressMiniLabel} numberOfLines={1}>
                      {p.isComplete ? '\u2713 ' : ''}{p.name}
                    </TenderText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Four Movements Visualization */}
          {boostedMovements && (
            <View style={s.movementsContainer}>
              <TenderText variant="headingS" color={phaseColor || WA.terracotta}>Four Movements of Growth</TenderText>
              <TenderText variant="body" color={Colors.textSecondary} style={s.movementsSubtitle}>
                Where you are in each dimension of relational growth
              </TenderText>
              {(['recognition', 'release', 'resonance', 'embodiment'] as const).map((key, idx) => {
                const m = boostedMovements[key];
                const explained = (FOUR_MOVEMENTS_EXPLAINED as any)[key];
                const movementColors = [WA.terracotta, WA.plum, WA.dustyBlue, WA.sage];
                const mColor = movementColors[idx];
                return (
                  <View key={key} style={s.movementCard}>
                    <View style={s.movementCardHeader}>
                      {explained?.icon ? (
                        (() => { const IconComp = explained.icon; return <View style={[s.movementIconCircle, { backgroundColor: mColor + '15' }]}><IconComp size={18} color={mColor} /></View>; })()
                      ) : null}
                      <View style={{ flex: 1 }}>
                        <TenderText variant="headingS" color={Colors.text}>{m.name}</TenderText>
                        <TenderText variant="bodySmall" color={Colors.textSecondary}>{explained?.question || m.subtitle}</TenderText>
                      </View>
                      <TenderText variant="headingS" color={mColor}>{m.readiness}%</TenderText>
                    </View>
                    <View style={s.movementProgressTrack}>
                      <View
                        style={[
                          s.movementProgressFill,
                          { width: `${Math.max(m.readiness, 3)}%` as any, backgroundColor: mColor },
                        ]}
                      />
                    </View>
                    <TenderText variant="body" color={Colors.textSecondary} style={s.movementDescription}>
                      {explained?.howItFeels || m.description}
                    </TenderText>
                  </View>
                );
              })}
            </View>
          )}

          {/* Your Path — Integrated into the 12-step journey */}
          <View style={s.phasesContainer}>
            <TenderText variant="headingS" color={Colors.text}>Your Path</TenderText>
            <TouchableOpacity
              style={s.pathIntegratedCard}
              activeOpacity={0.7}
              onPress={() => router.push('/(app)/building-bridges' as any)}
            >
              <TenderText variant="body" color={Colors.textSecondary} style={s.pathIntegratedText}>
                Your 12-step journey is your path. Each step integrates the practices your protocol recommends — completing steps and exercises grows your edges and moves your portrait score.
              </TenderText>
              <TenderText variant="bodySmall" color={Colors.primary} style={{ marginTop: 6, textDecorationLine: 'underline' }}>
                View your 12-step journey →
              </TenderText>
            </TouchableOpacity>
          </View>

          {/* Contraindications as gentle guidance */}
          {protocol.contraindications.length > 0 && (
            <View style={s.guidanceContainer}>
              <TenderText variant="headingS" color={Colors.text} style={s.guidanceTitle}>What to keep in mind</TenderText>
              {protocol.contraindications.map((c: string, i: number) => (
                <TenderText key={i} variant="body" color={Colors.textSecondary} style={s.guidanceItem}>{'\u2022'} {c}</TenderText>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ── Growth Edges ── */}
      <TenderText variant="body" color={Colors.textSecondary} style={s.tabIntro}>
        Your growth edges — the areas where small, consistent practice creates the most transformation.
      </TenderText>

      {portrait.growthEdges.map((edge, i) => (
        <GrowthEdgeSummaryCard
          key={edge.id}
          edge={edge}
          index={i}
          onPracticePress={(id) => router.push({ pathname: '/(app)/exercise', params: { id } } as any)}
        />
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
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  protocolName: {
    marginBottom: Spacing.sm,
  },
  protocolDescription: {
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },

  // Four Movements
  movementsContainer: {
    marginBottom: Spacing.lg,
  },
  movementsSubtitle: {
    marginBottom: Spacing.md,
  },
  movementCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  movementCardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  movementIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  movementProgressTrack: {
    height: 5,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    marginBottom: Spacing.sm,
    overflow: 'hidden' as const,
  },
  movementProgressFill: {
    height: '100%' as any,
    borderRadius: 3,
  },
  movementDescription: {
    lineHeight: 24,
  },

  // Phases
  phasesContainer: {
    marginBottom: Spacing.lg,
  },
  pathIntegratedCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
    marginTop: Spacing.xs,
  },
  pathIntegratedText: {
    lineHeight: 22,
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
    backgroundColor: WA.sage,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 10,
  },
  exerciseCheckmarkText: {
    fontSize: 11,
    color: Colors.white,
  },
  exerciseRowTitleDone: {
    color: WA.sage,
  },

  // Guidance / Contraindications
  guidanceContainer: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: WA.dustyBlue,
  },
  guidanceTitle: {
    marginBottom: Spacing.sm,
  },
  guidanceItem: {
    lineHeight: 24,
    marginBottom: Spacing.xs,
  },

  // Growth Progress
  growthProgressContainer: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  growthProgressHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.sm,
  },
  growthProgressLabelRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  growthProgressPct: {
    fontFamily: FontFamilies.accent,
  },
  growthProgressTrack: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden' as const,
    marginBottom: Spacing.md,
  },
  growthProgressFill: {
    height: '100%' as any,
    backgroundColor: WA.sage,
    borderRadius: 4,
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
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden' as const,
    marginBottom: 4,
  },
  phaseProgressMiniFill: {
    height: '100%' as any,
    borderRadius: 2,
  },
  phaseProgressMiniLabel: {
    fontSize: 9,
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
    backgroundColor: WA.sage + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: WA.sage,
  },
  phaseCompleteIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  phaseCompleteTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: WA.sage,
    marginBottom: 4,
  },
  phaseCompleteText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: WA.mustard,
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
