/**
 * Assessment Matrix — Interactive visualization of all assessments.
 *
 * Three segments, progressively unlocked:
 * 1. Matrix — Attachment scatter plot + explore mode (ECR-R required)
 * 2. Connections — Cross-assessment connection map (3+ assessments)
 * 3. Profile — All dimensions with connection highlighting (all 6 assessments)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { getECRRInterpretation } from '@/utils/assessments/interpretations/ecr-r';
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
import type { AttachmentStyle, ECRRScores } from '@/types';

type Segment = 'matrix' | 'connections' | 'profile';

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
          onPress={() => router.back()}
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
          onPress={() => router.back()}
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

            {/* Ripple effects for selected assessment */}
            {selectedAssessment && (
              <View style={styles.selectedAssessmentEffects}>
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

            <CombinedProfileView
              allScores={allScores}
              completedAssessments={completedAssessments}
            />
          </View>
        )}
      </ScrollView>
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
  },
});
