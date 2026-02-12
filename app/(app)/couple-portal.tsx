/**
 * Couple Portal Screen
 *
 * The shared space for the couple after both complete dyadic assessments.
 * Shows:
 * 1. Relationship summary / combined portrait
 * 2. Relationship patterns
 * 3. Discrepancy analysis
 * 4. Relationship growth edges
 * 5. Couple exercises (recommended)
 * 6. Couple anchor points
 * 7. Entry to couple's AI coaching chat
 */

import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import {
  getMyCouple,
  getPartnerProfile,
  getRelationshipPortrait,
  saveRelationshipPortrait,
  getLatestDyadicScores,
} from '@/services/couples';
import { getPartnerSharedAssessments } from '@/services/consent';
import { getPortrait } from '@/services/portrait';
import { generateRelationshipPortrait } from '@/utils/portrait/relationship-portrait-generator';
import { getExerciseById } from '@/utils/interventions/registry';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { Couple, UserProfile, RelationshipPortrait } from '@/types/couples';
import type { IndividualPortrait } from '@/types/portrait';

export default function CouplePortalScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
  const [portrait, setPortrait] = useState<RelationshipPortrait | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('patterns');
  const [partnerSharedAssessments, setPartnerSharedAssessments] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const myCouple = await getMyCouple(user.id);
      if (!myCouple) { setLoading(false); return; }
      setCouple(myCouple);

      const partner = await getPartnerProfile(user.id);
      setPartnerProfile(partner);

      // Load partner's sharing preferences
      if (partner) {
        const partnerId = myCouple.partner_a_id === user.id
          ? myCouple.partner_b_id : myCouple.partner_a_id;
        const shared = await getPartnerSharedAssessments(partnerId, myCouple.id);
        setPartnerSharedAssessments(shared);
      }

      // Try to load existing relationship portrait
      let rp = await getRelationshipPortrait(myCouple.id);

      // If no portrait exists, generate one
      if (!rp) {
        setGenerating(true);
        try {
          // Load both individual portraits
          const partnerId = myCouple.partner_a_id === user.id
            ? myCouple.partner_b_id : myCouple.partner_a_id;

          const [myPortraitData, partnerPortraitData] = await Promise.all([
            getPortrait(user.id),
            getPortrait(partnerId),
          ]);

          if (myPortraitData && partnerPortraitData) {
            // Load dyadic scores
            const [rdas, dci, csi16] = await Promise.all([
              getLatestDyadicScores(myCouple.id, 'rdas'),
              getLatestDyadicScores(myCouple.id, 'dci'),
              getLatestDyadicScores(myCouple.id, 'csi-16'),
            ]);

            const dyadicScores: any = {};
            if (rdas.partnerA && rdas.partnerB) dyadicScores.rdas = rdas;
            if (dci.partnerA && dci.partnerB) dyadicScores.dci = dci;
            if (csi16.partnerA && csi16.partnerB) dyadicScores.csi16 = csi16;

            // Determine which portrait is A and B
            const isPartnerA = myCouple.partner_a_id === user.id;
            const portraitA = isPartnerA ? myPortraitData : partnerPortraitData;
            const portraitB = isPartnerA ? partnerPortraitData : myPortraitData;

            const generated = generateRelationshipPortrait(
              myCouple.id,
              portraitA as unknown as IndividualPortrait,
              portraitB as unknown as IndividualPortrait,
              dyadicScores,
            );

            rp = await saveRelationshipPortrait(generated as any);
          }
        } catch (e) {
          console.error('[CouplePortal] Error generating portrait:', e);
        }
        setGenerating(false);
      }

      setPortrait(rp);
    } catch (e) {
      console.error('[CouplePortal] Error loading:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const toggle = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // ─── Loading State ───────────────────────────────────

  if (loading || generating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <Text style={styles.loadingText}>
            {generating ? 'Creating your relationship portrait...' : 'Loading...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!portrait) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.heading}>Couple Portal</Text>
          <Text style={styles.subtitle}>
            Complete all relationship assessments (both partners) to generate your
            combined portrait.
          </Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtnCenter}>
            <Text style={styles.backText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main Render ─────────────────────────────────────

  const partnerName = partnerProfile?.display_name || 'Your partner';
  const patterns = portrait.relationship_patterns || [];
  const discrepancy = portrait.discrepancy_analysis;
  const growthEdges = portrait.relationship_growth_edges || [];
  const anchors = portrait.couple_anchor_points;
  const priorities = portrait.intervention_priorities;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Your Relationship Portrait</Text>
        <Text style={styles.subtitle}>
          A living picture of how you and {partnerName} work together
        </Text>

        {/* Sharing Info */}
        {partnerSharedAssessments.length > 0 && (
          <View style={[styles.card, { borderColor: Colors.calm, borderWidth: 1, marginBottom: Spacing.md }]}>
            <Text style={{ fontSize: FontSizes.caption, color: Colors.calm, fontWeight: '700', letterSpacing: 1, marginBottom: Spacing.xs }}>
              SHARED WITH YOU
            </Text>
            <Text style={{ fontSize: FontSizes.bodySmall, color: Colors.textSecondary, lineHeight: 20 }}>
              {partnerName} is sharing {partnerSharedAssessments.length} of 6 individual assessments with you.
              Their portrait data reflects only the assessments they've chosen to share.
            </Text>
          </View>
        )}

        {/* Summary Card */}
        <View style={[styles.card, styles.summaryCard]}>
          <View style={styles.scoreRow}>
            {portrait.dyadic_scores?.csi16 && (
              <View style={styles.scoreItem}>
                <Text style={styles.scoreValue}>{portrait.dyadic_scores.csi16.total}</Text>
                <Text style={styles.scoreLabel}>Satisfaction</Text>
              </View>
            )}
            {portrait.dyadic_scores?.rdas && (
              <View style={styles.scoreItem}>
                <Text style={styles.scoreValue}>{portrait.dyadic_scores.rdas.total}</Text>
                <Text style={styles.scoreLabel}>Adjustment</Text>
              </View>
            )}
            {portrait.dyadic_scores?.dci && (
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreValue, { color: Colors.calm }]}>
                  {portrait.dyadic_scores.dci.copingQuality}
                </Text>
                <Text style={styles.scoreLabel}>Coping</Text>
              </View>
            )}
          </View>
          {discrepancy && (
            <Text style={styles.alignmentText}>{discrepancy.summary}</Text>
          )}
        </View>

        {/* Relationship Patterns */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggle('patterns')}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>Relationship Patterns</Text>
          <Text style={styles.chevron}>{expandedSection === 'patterns' ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        {expandedSection === 'patterns' && patterns.map((p, i) => (
          <View key={i} style={[styles.card, styles.patternCard]}>
            <View style={styles.patternHeader}>
              <Text style={styles.patternType}>
                {p.type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
              {p.confidence > 0 && (
                <View style={[styles.confidenceBadge, p.confidence > 70 && styles.highConfidence]}>
                  <Text style={styles.confidenceText}>{p.confidence}%</Text>
                </View>
              )}
            </View>
            <Text style={styles.patternDesc}>{p.description}</Text>
            {p.confidence > 0 && (
              <View style={styles.roleRow}>
                <View style={styles.roleChip}>
                  <Text style={styles.roleLabel}>You: {p.partnerARoleLabel}</Text>
                </View>
                <View style={[styles.roleChip, styles.roleChipB]}>
                  <Text style={styles.roleLabel}>{partnerName}: {p.partnerBRoleLabel}</Text>
                </View>
              </View>
            )}
          </View>
        ))}

        {/* Growth Edges */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggle('growth')}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>Relationship Growth Edges</Text>
          <Text style={styles.chevron}>{expandedSection === 'growth' ? '▼' : '▶'}</Text>
        </TouchableOpacity>
        {expandedSection === 'growth' && growthEdges.map((edge, i) => (
          <View key={i} style={[styles.card, styles.growthCard]}>
            <View style={styles.growthHeader}>
              <Text style={styles.growthTitle}>{edge.title}</Text>
              <View style={[styles.priorityBadge,
                edge.priority === 'high' && styles.priorityHigh,
                edge.priority === 'medium' && styles.priorityMedium,
              ]}>
                <Text style={styles.priorityText}>{edge.priority}</Text>
              </View>
            </View>
            <Text style={styles.growthPattern}>{edge.pattern}</Text>
            <View style={styles.growthDetail}>
              <Text style={styles.growthDetailLabel}>The protection:</Text>
              <Text style={styles.growthDetailText}>{edge.protection}</Text>
            </View>
            <View style={styles.growthDetail}>
              <Text style={styles.growthDetailLabel}>The invitation:</Text>
              <Text style={styles.growthDetailText}>{edge.invitation}</Text>
            </View>
            <View style={styles.practiceBox}>
              <Text style={styles.practiceLabel}>Practice Together:</Text>
              <Text style={styles.practiceText}>{edge.practice}</Text>
            </View>
            <View style={styles.anchorBox}>
              <Text style={styles.anchorQuote}>"{edge.anchor}"</Text>
            </View>
          </View>
        ))}

        {/* Discrepancy Analysis */}
        {discrepancy && discrepancy.items.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggle('discrepancy')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>How You See Things Differently</Text>
              <Text style={styles.chevron}>{expandedSection === 'discrepancy' ? '▼' : '▶'}</Text>
            </TouchableOpacity>
            {expandedSection === 'discrepancy' && discrepancy.items.map((item, i) => (
              <View key={i} style={[styles.card, item.isSignificant && styles.significantCard]}>
                <Text style={styles.discDomain}>{item.domain}</Text>
                <View style={styles.discScoreRow}>
                  <Text style={styles.discScore}>You: {item.partnerAScore}</Text>
                  <Text style={styles.discScore}>{partnerName}: {item.partnerBScore}</Text>
                </View>
                <Text style={styles.discInsight}>{item.insight}</Text>
              </View>
            ))}
          </>
        )}

        {/* Couple Anchors */}
        {anchors && (
          <>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggle('anchors')}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>Couple Anchor Points</Text>
              <Text style={styles.chevron}>{expandedSection === 'anchors' ? '▼' : '▶'}</Text>
            </TouchableOpacity>
            {expandedSection === 'anchors' && (
              <View style={styles.card}>
                {[
                  { label: 'When Activated', items: anchors.whenActivated, color: Colors.secondary },
                  { label: 'When Disconnected', items: anchors.whenDisconnected, color: Colors.depth },
                  { label: 'For Repair', items: anchors.forRepair, color: Colors.primary },
                  { label: 'For Connection', items: anchors.forConnection, color: Colors.calm },
                ].map((group, gi) => (
                  <View key={gi} style={styles.anchorGroup}>
                    <Text style={[styles.anchorGroupLabel, { color: group.color }]}>
                      {group.label}
                    </Text>
                    {group.items.map((item, ii) => (
                      <Text key={ii} style={styles.anchorItem}>• {item}</Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Recommended Exercises */}
        {priorities && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>
              Recommended Practices
            </Text>
            <Text style={styles.sectionDesc}>
              Evidence-based exercises tailored to your relationship patterns.
            </Text>
            {[
              ...(priorities.immediate || []),
              ...(priorities.shortTerm || []),
            ].slice(0, 4).map((exerciseId, i) => {
              const exercise = getExerciseById(exerciseId);
              if (!exercise) return null;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.card, styles.exerciseCard]}
                  onPress={() => router.push(`/(app)/exercise?id=${exercise.id}` as any)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.exerciseName}>{exercise.title}</Text>
                  <Text style={styles.exerciseDesc}>{exercise.description}</Text>
                  <View style={styles.exerciseMeta}>
                    <Text style={styles.exerciseMetaText}>{exercise.duration} min</Text>
                    <Text style={styles.exerciseMetaText}>•</Text>
                    <Text style={styles.exerciseMetaText}>{exercise.mode === 'together' ? '👥 Together' : '🧘 Solo'}</Text>
                    <Text style={styles.exerciseMetaText}>•</Text>
                    <Text style={styles.exerciseMetaText}>{exercise.difficulty}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Couple Coach Chat Entry */}
        <TouchableOpacity
          style={[styles.card, styles.coachCard]}
          onPress={() => router.push('/(app)/chat' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.coachTitle}>Talk to Your Couple Coach</Text>
          <Text style={styles.coachDesc}>
            Your AI guide now understands both of your portraits and your relationship
            patterns. Get personalized coaching for your journey together.
          </Text>
          <Text style={styles.coachCta}>Start Conversation →</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  loadingText: { marginTop: Spacing.md, color: Colors.textSecondary, fontFamily: FontFamilies.body },
  backBtn: { marginBottom: Spacing.md },
  backBtnCenter: { marginTop: Spacing.lg },
  backText: { color: Colors.primary, fontSize: FontSizes.body, fontFamily: FontFamilies.body },
  heading: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },

  // Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },

  // Summary
  summaryCard: { borderColor: Colors.secondary, borderWidth: 1 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.md },
  scoreItem: { alignItems: 'center' },
  scoreValue: { fontSize: 28, fontFamily: FontFamilies.heading, color: Colors.secondary, fontWeight: '700' },
  scoreLabel: { fontSize: FontSizes.caption, fontFamily: FontFamilies.body, color: Colors.textSecondary, marginTop: 2 },
  alignmentText: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.textSecondary, lineHeight: 20, textAlign: 'center' },

  // Section headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md, marginTop: Spacing.sm },
  sectionTitle: { fontSize: FontSizes.headingM, fontFamily: FontFamilies.heading, color: Colors.text },
  sectionDesc: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.textSecondary, marginBottom: Spacing.md, lineHeight: 20 },
  chevron: { fontSize: FontSizes.body, color: Colors.textMuted },

  // Patterns
  patternCard: {},
  patternHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  patternType: { fontSize: FontSizes.body, fontFamily: FontFamilies.heading, color: Colors.depth, fontWeight: '600' },
  confidenceBadge: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 },
  highConfidence: { borderColor: Colors.secondary, backgroundColor: Colors.background },
  confidenceText: { fontSize: FontSizes.caption, fontFamily: FontFamilies.body, color: Colors.textSecondary },
  patternDesc: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
  roleRow: { flexDirection: 'row', gap: Spacing.sm },
  roleChip: { backgroundColor: Colors.primaryLight + '20', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 },
  roleChipB: { backgroundColor: Colors.secondary + '20' },
  roleLabel: { fontSize: FontSizes.caption, fontFamily: FontFamilies.body, color: Colors.text },

  // Growth
  growthCard: {},
  growthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  growthTitle: { fontSize: FontSizes.body, fontFamily: FontFamilies.heading, color: Colors.text, fontWeight: '600', flex: 1 },
  priorityBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2, backgroundColor: Colors.borderLight },
  priorityHigh: { backgroundColor: Colors.secondary + '20' },
  priorityMedium: { backgroundColor: Colors.accent + '20' },
  priorityText: { fontSize: FontSizes.caption, fontFamily: FontFamilies.body, color: Colors.textSecondary, textTransform: 'capitalize' },
  growthPattern: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
  growthDetail: { marginBottom: Spacing.sm },
  growthDetailLabel: { fontSize: FontSizes.caption, fontFamily: FontFamilies.body, color: Colors.depth, fontWeight: '600', marginBottom: 2 },
  growthDetailText: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.textSecondary, lineHeight: 20 },
  practiceBox: { backgroundColor: Colors.primary + '10', borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.sm, marginBottom: Spacing.sm },
  practiceLabel: { fontSize: FontSizes.caption, fontFamily: FontFamilies.body, color: Colors.primary, fontWeight: '600', marginBottom: 4 },
  practiceText: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.text, lineHeight: 20 },
  anchorBox: { backgroundColor: Colors.depth + '10', borderRadius: BorderRadius.md, padding: Spacing.md },
  anchorQuote: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.heading, color: Colors.depth, fontStyle: 'italic', lineHeight: 22, textAlign: 'center' },

  // Discrepancy
  significantCard: { borderLeftWidth: 3, borderLeftColor: Colors.accent },
  discDomain: { fontSize: FontSizes.body, fontFamily: FontFamilies.heading, color: Colors.text, fontWeight: '600', marginBottom: Spacing.xs },
  discScoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  discScore: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.textSecondary },
  discInsight: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.textSecondary, lineHeight: 20 },

  // Anchors
  anchorGroup: { marginBottom: Spacing.lg },
  anchorGroupLabel: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.heading, fontWeight: '600', marginBottom: Spacing.xs },
  anchorItem: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.textSecondary, lineHeight: 22, marginBottom: 4 },

  // Exercises
  exerciseCard: {},
  exerciseName: { fontSize: FontSizes.body, fontFamily: FontFamilies.heading, color: Colors.text, fontWeight: '600', marginBottom: 4 },
  exerciseDesc: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.sm },
  exerciseMeta: { flexDirection: 'row', gap: Spacing.sm },
  exerciseMetaText: { fontSize: FontSizes.caption, fontFamily: FontFamilies.body, color: Colors.textMuted },

  // Coach
  coachCard: { borderColor: Colors.depth, borderWidth: 1, marginTop: Spacing.lg },
  coachTitle: { fontSize: FontSizes.headingM, fontFamily: FontFamilies.heading, color: Colors.depth, marginBottom: Spacing.xs },
  coachDesc: { fontSize: FontSizes.bodySmall, fontFamily: FontFamilies.body, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
  coachCta: { fontSize: FontSizes.body, fontFamily: FontFamilies.body, color: Colors.depth, fontWeight: '600' },
});
