/**
 * Assessment Matrix — Interactive visualization of all assessments.
 *
 * Three segments, progressively unlocked:
 * 1. Matrix — Attachment scatter plot + explore mode (ECR-R required)
 * 2. Connections — Cross-assessment connection map (3+ assessments)
 * 3. Profile — All dimensions with connection highlighting (all 6 assessments)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import HomeButton from '@/components/HomeButton';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { supabase } from '@/services/supabase';
import { getPortrait, savePortrait, fetchAllScores, extractSupplementScores } from '@/services/portrait';
import { generatePortrait } from '@/utils/portrait/portrait-generator';
import { getECRRInterpretation } from '@/utils/assessments/interpretations/ecr-r';
import type { IndividualPortrait, AllAssessmentScores } from '@/types/portrait';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { ArrowLeftIcon, LockIcon } from '@/assets/graphics/icons';
import { AttachmentMatrix } from '@/components/visualizations/AttachmentMatrix';
import { ExploreMode } from '@/components/visualizations/ExploreMode';
import { ConnectionMap } from '@/components/visualizations/ConnectionMap';
import { RippleEffectsCard } from '@/components/visualizations/RippleEffectsCard';
import { CombinedProfileView } from '@/components/visualizations/CombinedProfileView';
import { calculateRipples } from '@/utils/visualizations/rippleEffects';
import { ASSESSMENT_LABELS, ASSESSMENT_COLORS } from '@/constants/connectionMatrix';
import type { AttachmentStyle, ECRRScores } from '@/types';

// Sprint 4: New visualizations
import RadarChart from '@/components/visualizations/RadarChart';
import WaterfallChart from '@/components/visualizations/WaterfallChart';
import ConflictRose from '@/components/visualizations/ConflictRose';
import EQHeatmap from '@/components/visualizations/EQHeatmap';

type Segment = 'matrix' | 'connections' | 'profile';

/** Portrait insight for a given assessment — narrative, growth edges with descriptions, patterns */
interface PortraitInsight {
  narrative: string;
  growthEdges: Array<{ title: string; description: string }>;
}

function getPortraitInsightForAssessment(
  assessmentKey: string,
  portrait: IndividualPortrait
): PortraitInsight | null {
  const { fourLens, growthEdges, negativeCycle, compositeScores } = portrait;

  switch (assessmentKey) {
    case 'ecr-r':
      return {
        narrative: fourLens.attachment.narrative.slice(0, 500) + (fourLens.attachment.narrative.length > 500 ? '...' : ''),
        growthEdges: growthEdges
          .filter(e => e.category === 'attachment' || e.title.toLowerCase().includes('attach'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    case 'ipip-neo-120':
      return {
        narrative: fourLens.values?.narrative
          ? fourLens.values.narrative.slice(0, 500) + (fourLens.values.narrative.length > 500 ? '...' : '')
          : `Your personality profile shapes how you show up in relationships. Self-leadership: ${compositeScores.selfLeadership}/100.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'personality' || e.category === 'values')
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    case 'sseit':
      return {
        narrative: fourLens.regulation?.narrative
          ? fourLens.regulation.narrative.slice(0, 500) + (fourLens.regulation.narrative.length > 500 ? '...' : '')
          : `Your emotional intelligence shapes how you read and manage feelings in relationships. Regulation capacity: ${compositeScores.regulationScore}/100, Window width: ${compositeScores.windowWidth}/100.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'regulation' || e.title.toLowerCase().includes('emotion'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    case 'dsi-r':
      return {
        narrative: `Your differentiation reflects the balance between staying connected and maintaining your sense of self. I-Position: strong self-definition without rigidity.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'differentiation' || e.title.toLowerCase().includes('boundar'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    case 'dutch':
      return {
        narrative: `Your conflict style reveals protective patterns: "${negativeCycle.position}" position. Triggers: ${(negativeCycle.primaryTriggers || []).slice(0, 2).join(', ')}.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'conflict' || e.category === 'communication')
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    case 'values':
      return {
        narrative: fourLens.values?.narrative
          ? fourLens.values.narrative.slice(0, 500) + (fourLens.values.narrative.length > 500 ? '...' : '')
          : `Values alignment: ${compositeScores.valuesCongruence}/100. Your values guide what you prioritize in relationships.`,
        growthEdges: growthEdges
          .filter(e => e.category === 'values' || e.title.toLowerCase().includes('value'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    case 'relational-field':
      return {
        narrative: fourLens.fieldAwareness?.narrative
          ? fourLens.fieldAwareness.narrative.slice(0, 500) + (fourLens.fieldAwareness.narrative.length > 500 ? '...' : '')
          : `Your relational field awareness reflects how attuned you are to the space between you and your partner.`,
        growthEdges: growthEdges
          .filter(e => e.title.toLowerCase().includes('field') || e.title.toLowerCase().includes('presence') || e.title.toLowerCase().includes('attune'))
          .map(e => ({ title: e.title, description: e.description }))
          .slice(0, 3),
      };
    default:
      return null;
  }
}

const SEGMENTS: { key: Segment; label: string; minAssessments: number }[] = [
  { key: 'matrix', label: 'Matrix', minAssessments: 1 },
  { key: 'connections', label: 'Connections', minAssessments: 2 },
  { key: 'profile', label: 'Profile', minAssessments: 3 },
];

export default function AssessmentMatrixScreen() {
  const { user } = useAuth();
  const { isGuest } = useGuest();
  const router = useRouter();

  // Data state
  const [loading, setLoading] = useState(true);
  const [allScores, setAllScores] = useState<Record<string, { id: string; scores: any }>>({});
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [activeSegment, setActiveSegment] = useState<Segment>('matrix');

  // Explore mode state (ephemeral — never saved)
  const [isExploring, setIsExploring] = useState(false);
  const [exploredAnxiety, setExploredAnxiety] = useState<number | null>(null);
  const [exploredAvoidance, setExploredAvoidance] = useState<number | null>(null);

  // Connection map state
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  // Portrait context for enriched insights
  const [portrait, setPortrait] = useState<IndividualPortrait | null>(null);

  // ─── Load Data ──────────────────────────────────────────

  useEffect(() => {
    if (!user?.id) {
      // Guest mode or no user — stop loading, show gate message
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        // Fetch ALL assessment types (not just portrait's 6) so RFAS shows too
        const { data, error: fetchErr } = await supabase
          .from('assessments')
          .select('id, type, scores')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (fetchErr) throw fetchErr;

        // Take most recent per type
        const latest: Record<string, { id: string; scores: any }> = {};
        for (const row of data ?? []) {
          if (!latest[row.type]) {
            latest[row.type] = { id: row.id, scores: row.scores };
          }
        }
        setAllScores(latest);

        // Also load portrait for enriched context — auto-generate if missing
        try {
          let p = await getPortrait(user.id);

          // Auto-generate portrait if all 6 assessments are complete but no portrait exists
          const REQUIRED = ['ecr-r', 'dutch', 'sseit', 'dsi-r', 'ipip-neo-120', 'values'];
          const completedTypes = Object.keys(latest);
          const hasAll6 = REQUIRED.every((t) => completedTypes.includes(t));

          if (!p && hasAll6) {
            console.log('[Matrix] All 6 assessments complete, no portrait — auto-generating...');
            try {
              const latestScoresMap = await fetchAllScores(user.id);
              const scores: AllAssessmentScores = {
                ecrr: latestScoresMap['ecr-r'].scores,
                dutch: latestScoresMap['dutch'].scores,
                sseit: latestScoresMap['sseit'].scores,
                dsir: latestScoresMap['dsi-r'].scores,
                ipip: latestScoresMap['ipip-neo-120'].scores,
                values: latestScoresMap['values'].scores,
              };
              const supplements = extractSupplementScores(latestScoresMap);
              const ids = Object.values(latestScoresMap).map((r) => r.id);
              const freshPortrait = generatePortrait(user.id, ids, scores, supplements);
              const saved = await savePortrait(freshPortrait);
              p = saved;
              console.log('[Matrix] Portrait auto-generated successfully');
            } catch (genErr: any) {
              console.error('[Matrix] Portrait auto-generation failed:', genErr?.message || genErr);
            }
          }

          if (p) setPortrait(p);
        } catch (portraitErr) {
          console.error('[Matrix] Failed to load portrait:', portraitErr);
        }
      } catch (err) {
        console.error('Failed to fetch scores:', err);
        setError('Unable to load your assessment data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  // ─── Derived Data ────────────────────────────────────────

  const completedAssessments = useMemo(
    () => Object.keys(allScores),
    [allScores]
  );
  const completedCount = completedAssessments.length;

  // ECR-R scores
  const ecrScores: ECRRScores | null = useMemo(() => {
    const ecr = allScores['ecr-r']?.scores;
    if (!ecr) return null;
    return {
      anxietyScore: ecr.anxietyScore ?? 4,
      avoidanceScore: ecr.avoidanceScore ?? 4,
      attachmentStyle: ecr.attachmentStyle ?? 'secure',
    };
  }, [allScores]);

  const interpretation = useMemo(
    () => (ecrScores ? getECRRInterpretation(ecrScores.attachmentStyle) : null),
    [ecrScores]
  );

  // Ripple effects for explore mode changes
  const rippleEffects = useMemo(() => {
    if (!isExploring || !ecrScores) return [];

    const effects = [];

    // Check anxiety direction
    const anxietyVal = exploredAnxiety ?? ecrScores.anxietyScore;
    if (Math.abs(anxietyVal - ecrScores.anxietyScore) > 0.3) {
      const direction = anxietyVal > ecrScores.anxietyScore ? 'increase' : 'decrease';
      effects.push(
        ...calculateRipples('ecr-r', 'anxietyScore', direction as 'increase' | 'decrease')
      );
    }

    // Check avoidance direction
    const avoidanceVal = exploredAvoidance ?? ecrScores.avoidanceScore;
    if (Math.abs(avoidanceVal - ecrScores.avoidanceScore) > 0.3) {
      const direction = avoidanceVal > ecrScores.avoidanceScore ? 'increase' : 'decrease';
      const avoidanceEffects = calculateRipples('ecr-r', 'avoidanceScore', direction as 'increase' | 'decrease');
      // Deduplicate
      for (const eff of avoidanceEffects) {
        if (!effects.some(e => e.targetDimension === eff.targetDimension && e.targetAssessment === eff.targetAssessment)) {
          effects.push(eff);
        }
      }
    }

    return effects;
  }, [isExploring, exploredAnxiety, exploredAvoidance, ecrScores]);

  // ─── Explore Mode Handlers ────────────────────────────────

  const handleToggleExplore = useCallback((exploring: boolean) => {
    setIsExploring(exploring);
    if (!exploring) {
      setExploredAnxiety(null);
      setExploredAvoidance(null);
    }
  }, []);

  const handleReset = useCallback(() => {
    setExploredAnxiety(null);
    setExploredAvoidance(null);
  }, []);

  // ─── Render ──────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </SafeAreaView>
    );
  }

  if (error || !ecrScores) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          {error || 'Complete "How You Connect" to unlock the Matrix.'}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(app)/home' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/(app)/home' as any)}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeftIcon size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Your Matrix</Text>
          <Text style={styles.headerSubtitle}>Interactive assessment map</Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentControl}>
        {SEGMENTS.map((seg) => {
          const isActive = activeSegment === seg.key;
          const isLocked = completedCount < seg.minAssessments;

          return (
            <TouchableOpacity
              key={seg.key}
              style={[
                styles.segment,
                isActive && styles.segmentActive,
                isLocked && styles.segmentLocked,
              ]}
              onPress={() => !isLocked && setActiveSegment(seg.key)}
              activeOpacity={isLocked ? 1 : 0.7}
            >
              {isLocked && <LockIcon size={10} color={Colors.textMuted} />}
              <Text
                style={[
                  styles.segmentText,
                  isActive && styles.segmentTextActive,
                  isLocked && styles.segmentTextLocked,
                ]}
              >
                {seg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══ MATRIX SEGMENT ═══ */}
        {activeSegment === 'matrix' && (
          <View style={styles.segmentContent}>
            {/* Style header */}
            {interpretation && (
              <View style={styles.styleHeader}>
                <Text style={styles.styleWarmLabel}>{interpretation.warmLabel}</Text>
                <Text style={styles.styleLabel}>{interpretation.label}</Text>
              </View>
            )}

            {/* Attachment Matrix (scatter plot) */}
            <AttachmentMatrix
              anxietyScore={ecrScores.anxietyScore}
              avoidanceScore={ecrScores.avoidanceScore}
              attachmentStyle={ecrScores.attachmentStyle}
              exploredAnxiety={exploredAnxiety ?? undefined}
              exploredAvoidance={exploredAvoidance ?? undefined}
              isExploreMode={isExploring}
            />

            {/* Explore Mode controls */}
            <ExploreMode
              anxietyScore={ecrScores.anxietyScore}
              avoidanceScore={ecrScores.avoidanceScore}
              attachmentStyle={ecrScores.attachmentStyle}
              exploredAnxiety={exploredAnxiety}
              exploredAvoidance={exploredAvoidance}
              isExploring={isExploring}
              onToggleExplore={handleToggleExplore}
              onExploreAnxiety={setExploredAnxiety}
              onExploreAvoidance={setExploredAvoidance}
              onReset={handleReset}
            />

            {/* Ripple effects during exploration */}
            {rippleEffects.length > 0 && (
              <RippleEffectsCard
                effects={rippleEffects}
                sourceDimension="Attachment"
                changeDirection={
                  (exploredAnxiety ?? ecrScores.anxietyScore) > ecrScores.anxietyScore
                    ? 'increase'
                    : 'decrease'
                }
              />
            )}

            {/* Interpretation card */}
            {interpretation && !isExploring && (
              <View style={styles.interpretationCard}>
                <Text style={styles.interpretationTitle}>Understanding Your Pattern</Text>
                <Text style={styles.interpretationText}>{interpretation.interpretation}</Text>
                {interpretation.growthEdge && (
                  <>
                    <Text style={styles.growthEdgeTitle}>Your Growth Edge</Text>
                    <Text style={styles.growthEdgeText}>{interpretation.growthEdge}</Text>
                  </>
                )}
              </View>
            )}
          </View>
        )}

        {/* ═══ CONNECTIONS SEGMENT ═══ */}
        {activeSegment === 'connections' && (
          <View style={styles.segmentContent}>
            <Text style={styles.sectionTitle}>How Your Dimensions Connect</Text>
            <Text style={styles.sectionSubtitle}>
              Tap an assessment node to see its connections
            </Text>

            <ConnectionMap
              completedAssessments={completedAssessments}
              highlightAssessment={selectedAssessment ?? undefined}
              onSelectAssessment={setSelectedAssessment}
            />

            {/* Selected assessment detail panel */}
            {selectedAssessment && (
              <View style={styles.selectedAssessmentEffects}>
                {/* Portrait insight — what this assessment reveals */}
                {!portrait && (
                  <View style={styles.unlockHint}>
                    <Text style={styles.unlockHintText}>
                      {completedCount < 6
                        ? `Complete all 6 assessments to see deeper portrait insights for each connection.`
                        : 'Visit the home screen to generate your portrait and see deeper insights here.'}
                    </Text>
                  </View>
                )}
                {portrait && (() => {
                  const insight = getPortraitInsightForAssessment(selectedAssessment, portrait);
                  if (!insight) return null;
                  const nodeColor = ASSESSMENT_COLORS[selectedAssessment] || Colors.primary;
                  return (
                    <View style={[styles.insightCard, { borderLeftColor: nodeColor }]}>
                      <Text style={styles.insightTitle}>
                        What This Reveals
                      </Text>
                      {/* Warm label for ECR-R */}
                      {selectedAssessment === 'ecr-r' && interpretation && (
                        <Text style={styles.insightWarmLabel}>{interpretation.warmLabel}</Text>
                      )}
                      <Text style={styles.insightNarrative}>
                        {insight.narrative}
                      </Text>
                      {insight.growthEdges.length > 0 && (
                        <View style={styles.insightGrowthEdges}>
                          <Text style={styles.insightGrowthLabel}>Growth Edges</Text>
                          {insight.growthEdges.map((edge, i) => (
                            <View key={i} style={{ marginBottom: 4 }}>
                              <Text style={styles.insightGrowthText}>
                                {'\u2022'} {edge.title}
                              </Text>
                              {edge.description ? (
                                <Text style={styles.insightGrowthDescription}>
                                  {edge.description}
                                </Text>
                              ) : null}
                            </View>
                          ))}
                        </View>
                      )}
                      {/* Detected cross-assessment patterns */}
                      {(() => {
                        const categoryMap: Record<string, string[]> = {
                          'ecr-r': ['attachment-conflict'],
                          'sseit': ['regulation'],
                          'dsi-r': ['differentiation'],
                          'dutch': ['attachment-conflict'],
                          'values': ['values-behavior'],
                          'ipip-neo-120': ['values-behavior', 'differentiation'],
                          'relational-field': ['field-awareness'],
                        };
                        const cats = categoryMap[selectedAssessment] || [];
                        const relevant = (portrait.patterns || [])
                          .filter(p => cats.includes(p.category))
                          .slice(0, 2);
                        if (relevant.length === 0) return null;
                        return (
                          <View style={styles.insightPatterns}>
                            <Text style={styles.insightGrowthLabel}>Detected Patterns</Text>
                            {relevant.map((p, i) => (
                              <View key={i} style={{ marginBottom: 4 }}>
                                <Text style={styles.insightGrowthText}>{'\u2022'} {p.description}</Text>
                                {p.interpretation ? (
                                  <Text style={styles.insightGrowthDescription}>{p.interpretation}</Text>
                                ) : null}
                              </View>
                            ))}
                          </View>
                        );
                      })()}
                    </View>
                  );
                })()}

                {/* Ripple effects */}
                {(() => {
                  const effects = calculateRipples(selectedAssessment, '', 'increase');
                  if (effects.length === 0) return null;
                  return (
                    <RippleEffectsCard
                      effects={effects.slice(0, 5)}
                      sourceDimension={selectedAssessment}
                      changeDirection="increase"
                    />
                  );
                })()}
              </View>
            )}

            {completedCount < 6 && (
              <View style={styles.unlockHint}>
                <Text style={styles.unlockHintText}>
                  Complete {6 - completedCount} more assessment{6 - completedCount > 1 ? 's' : ''} to
                  see all connections.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ═══ PROFILE SEGMENT ═══ */}
        {activeSegment === 'profile' && (
          <View style={styles.segmentContent}>
            <Text style={styles.sectionTitle}>Your Complete Profile</Text>
            <Text style={styles.sectionSubtitle}>
              Tap any dimension to see how it connects across assessments
            </Text>

            {/* Radar Chart — 7-dimension profile shape */}
            {portrait && (
              <RadarChart scores={portrait.compositeScores} />
            )}

            <CombinedProfileView
              allScores={allScores}
              completedAssessments={completedAssessments}
              portrait={portrait}
            />

            {/* Waterfall Chart — How scores contribute */}
            {portrait && (
              <WaterfallChart compositeScores={portrait.compositeScores} />
            )}

            {/* EQ Heatmap — when SSEIT data available */}
            {allScores['sseit']?.scores && (
              <EQHeatmap sseitScores={allScores['sseit'].scores} />
            )}

            {/* Conflict Rose — when DUTCH data available */}
            {allScores['dutch']?.scores && (
              <ConflictRose dutchScores={allScores['dutch'].scores} />
            )}

            {/* Hint when portrait hasn't been generated yet */}
            {!portrait && (
              <View style={styles.unlockHint}>
                <Text style={styles.unlockHintText}>
                  {completedCount < 6
                    ? `Complete ${6 - completedCount} more assessment${6 - completedCount > 1 ? 's' : ''} to unlock deep portrait insights for each dimension.`
                    : 'Your portrait is being generated. Return to the home screen and come back to see integrated insights.'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <HomeButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontFamily: FontFamilies.body,
  },
  errorText: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    fontFamily: FontFamilies.body,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  backButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
  },
  backButtonText: {
    color: Colors.textOnPrimary,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    fontSize: FontSizes.bodySmall,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
  },

  // Segmented Control
  segmentControl: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.pill,
    padding: 3,
    marginBottom: Spacing.sm,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  segmentActive: {
    backgroundColor: Colors.surface,
    ...Shadows.subtle,
  },
  segmentLocked: {
    opacity: 0.5,
  },
  segmentText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  segmentTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  segmentTextLocked: {
    color: Colors.textMuted,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  segmentContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
  },

  // Style header
  styleHeader: {
    alignItems: 'center',
    gap: 2,
  },
  styleWarmLabel: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.accent,
    color: Colors.primary,
    fontWeight: '600',
  },
  styleLabel: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },

  // Section titles
  sectionTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: -Spacing.sm,
  },

  // Interpretation card
  interpretationCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  interpretationTitle: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  interpretationText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  growthEdgeTitle: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.success,
    letterSpacing: 0.5,
    marginTop: Spacing.xs,
  },
  growthEdgeText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Unlock hints
  unlockHint: {
    backgroundColor: Colors.accentCream + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  unlockHintText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Selected assessment effects
  selectedAssessmentEffects: {
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },

  // Portrait insight card
  insightCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    ...Shadows.card,
  },
  insightTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  insightNarrative: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  insightGrowthEdges: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  insightGrowthLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  insightGrowthText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
    paddingLeft: 4,
  },
  insightWarmLabel: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.body,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightGrowthDescription: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    paddingLeft: 12,
    marginTop: 1,
  },
  insightPatterns: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
