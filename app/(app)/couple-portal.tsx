/**
 * Couple Portal Screen — "The Space Between You"
 *
 * Deep Couple Portrait with 6 tabs:
 * 1. Overview — Twin Orbs, narrative opening, quick stats
 * 2. Your Dance — Combined cycle, exit points, repair pathway
 * 3. Together — Dual radar, convergence/divergence, attachment matrix
 * 4. Insights — Dyadic synthesis, discrepancies
 * 5. Growth — Couple growth edges, practices
 * 6. Anchors — Couple anchors, repair starters
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
  Dimensions,
  Platform,
  Alert,
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
  isSelfCouple,
  saveDeepCouplePortrait,
  getDeepCouplePortrait,
} from '@/services/couples';
import { getPartnerSharedAssessments, INDIVIDUAL_ASSESSMENT_TYPES } from '@/services/consent';
import { getPortrait, checkCanGeneratePortrait, fetchAllScores, extractSupplementScores, savePortrait } from '@/services/portrait';
import { generatePortrait, isPortraitStale } from '@/utils/portrait/portrait-generator';
import { generateRelationshipPortrait } from '@/utils/portrait/relationship-portrait-generator';
import { generateDeepCouplePortrait } from '@/utils/portrait/couple-portrait-generator';
import {
  Colors,
  Spacing,
  Typography,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  SeedlingIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatBubbleIcon,
  HeartPulseIcon,
  LinkIcon,
  SparkleIcon,
  LightningIcon,
  CompassIcon,
  LeafIcon,
} from '@/assets/graphics/icons';
import HomeButton from '@/components/HomeButton';
import type { Couple, UserProfile, RelationshipPortrait, DeepCouplePortrait } from '@/types/couples';
import type { IndividualPortrait } from '@/types/portrait';
import type { WEAREProfile, WeeklyCheckIn } from '@/types/weare';
import { getLatestWEAREProfile, getThisWeeksCheckIn, saveWeeklyCheckIn } from '@/services/weare';
import WeeklyCheckInCard from '@/components/weare/WeeklyCheckInCard';

// Deep Couple Portrait components
import TwinOrbsField from '@/components/couple-portrait/TwinOrbsField';
import DualRadarChart from '@/components/couple-portrait/DualRadarChart';
import AttachmentMatrixPlot from '@/components/couple-portrait/AttachmentMatrixPlot';
import CombinedCycleVisualization from '@/components/couple-portrait/CombinedCycleVisualization';
import {
  SharedStrengthCard,
  ComplementaryGiftCard,
  FrictionZoneCard,
  ValuesTensionCard,
} from '@/components/couple-portrait/ConvergenceDivergenceCard';
import CoupleGrowthEdgeCard from '@/components/couple-portrait/CoupleGrowthEdgeCard';
import CoupleAnchorCard from '@/components/couple-portrait/CoupleAnchorCard';
import ExitPointCard from '@/components/couple-portrait/ExitPointCard';
import DyadicDiscrepancyAlert from '@/components/couple-portrait/DyadicDiscrepancyAlert';
import CoupleNarrativeBlock from '@/components/couple-portrait/CoupleNarrativeBlock';
import { generateOverviewSnapshot } from '@/utils/portrait/overview-snapshot';
import CouplePortalErrorBoundary from '@/components/CouplePortalErrorBoundary';

type TabKey = 'overview' | 'dance' | 'together' | 'assessments' | 'insights' | 'growth' | 'anchors';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'dance', label: 'Your Dance' },
  { key: 'together', label: 'Together' },
  { key: 'assessments', label: 'Assessments' },
  { key: 'insights', label: 'Insights' },
  { key: 'growth', label: 'Growth' },
  { key: 'anchors', label: 'Anchors' },
];

export default function CouplePortalScreenWithBoundary() {
  return (
    <CouplePortalErrorBoundary>
      <CouplePortalScreen />
    </CouplePortalErrorBoundary>
  );
}

function CouplePortalScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
  const [portrait, setPortrait] = useState<RelationshipPortrait | null>(null);
  const [deepPortrait, setDeepPortrait] = useState<DeepCouplePortrait | null>(null);
  const [portraitError, setPortraitError] = useState<string | null>(null);
  const [partnerSharedAssessments, setPartnerSharedAssessments] = useState<string[]>([]);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Individual portraits (needed for deep portrait gen)
  const [myPortrait, setMyPortrait] = useState<IndividualPortrait | null>(null);
  const [partnerPortrait, setPartnerPortrait] = useState<IndividualPortrait | null>(null);

  // Dyadic scores
  const [dyadicScores, setDyadicScores] = useState<{
    rdas: { partnerA: any | null; partnerB: any | null };
    dci: { partnerA: any | null; partnerB: any | null };
    csi16: { partnerA: any | null; partnerB: any | null };
  } | null>(null);

  // WEARE state
  const [weareProfile, setWeareProfile] = useState<WEAREProfile | null>(null);
  const [weeklyCheckIn, setWeeklyCheckIn] = useState<WeeklyCheckIn | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setPortraitError(null);
    console.log('[CouplePortal] === LOAD START ===');
    try {
      const myCouple = await getMyCouple(user.id);
      console.log('[CouplePortal] Couple:', myCouple ? myCouple.id : 'NOT FOUND');
      if (!myCouple) { setLoading(false); return; }
      setCouple(myCouple);

      const selfCouple = isSelfCouple(myCouple);
      const partnerId = myCouple.partner_a_id === user.id
        ? myCouple.partner_b_id : myCouple.partner_a_id;
      console.log('[CouplePortal] Self-couple:', selfCouple, '| partnerId:', partnerId);

      const partner = await getPartnerProfile(user.id);
      setPartnerProfile(partner);
      console.log('[CouplePortal] Partner profile:', partner?.display_name || 'none');

      // Load partner's sharing preferences
      if (partner) {
        const shared = await getPartnerSharedAssessments(partnerId, myCouple.id);
        setPartnerSharedAssessments(shared);
      }

      // ─── 1. Load Individual Portraits ────────────────────
      console.log('[CouplePortal] Loading individual portraits...');
      let mp = await getPortrait(user.id);
      let pp = selfCouple ? mp : await getPortrait(partnerId);
      console.log('[CouplePortal] Portraits from DB:', { mine: !!mp, partner: !!pp });
      if (!pp && !selfCouple) {
        console.warn(
          '[CouplePortal] ⚠️ Partner portrait returned null. Common causes:\n' +
          '  1. Partner hasn\'t generated their portrait yet (they need to complete all 6 assessments + generate from Home screen)\n' +
          '  2. RLS migration 026_couple_partner_rls_access.sql hasn\'t been applied in Supabase\n' +
          '  3. Couple status is not "active" in the couples table'
        );
      }

      // Auto-generate individual portrait helper
      const autoGenPortrait = async (targetUserId: string, label: string): Promise<IndividualPortrait | null> => {
        try {
          const { canGenerate, missingAssessments } = await checkCanGeneratePortrait(targetUserId);
          if (!canGenerate) {
            console.log(`[CouplePortal] Cannot auto-gen ${label} portrait — missing:`, missingAssessments);
            return null;
          }
          console.log(`[CouplePortal] Auto-generating ${label} portrait...`);
          const latestScoresMap = await fetchAllScores(targetUserId);
          const scores = {
            ecrr: latestScoresMap['ecr-r'].scores,
            dutch: latestScoresMap['dutch'].scores,
            sseit: latestScoresMap['sseit'].scores,
            dsir: latestScoresMap['dsi-r'].scores,
            ipip: latestScoresMap['ipip-neo-120'].scores,
            values: latestScoresMap['values'].scores,
          };
          const supplements = extractSupplementScores(latestScoresMap);
          const ids = Object.values(latestScoresMap).map((r) => r.id);
          const freshPortrait = generatePortrait(targetUserId, ids, scores, supplements);
          const saved = await savePortrait(freshPortrait);
          console.log(`[CouplePortal] ${label} portrait auto-generated:`, !!saved);
          return saved;
        } catch (genErr: any) {
          console.error(`[CouplePortal] Auto-gen ${label} portrait FAILED:`, genErr?.message || genErr);
          return null;
        }
      };

      // Auto-regenerate my portrait if stale (assessment IDs changed or code version newer)
      let individualPortraitRegenerated = false;
      if (mp) {
        try {
          const { canGenerate } = await checkCanGeneratePortrait(user.id);
          if (canGenerate) {
            const latestScoresMap = await fetchAllScores(user.id);
            const currentIds = new Set(Object.values(latestScoresMap).map((r) => r.id));
            const portraitIds = new Set(mp.assessmentIds || []);
            const idsChanged = [...currentIds].some((id) => !portraitIds.has(id));
            const versionStale = isPortraitStale(mp.version);
            if (idsChanged || versionStale) {
              console.log(`[CouplePortal] My portrait stale (ids: ${idsChanged}, version: ${versionStale}) — regenerating...`);
              mp = await autoGenPortrait(user.id, 'MY');
              if (selfCouple && mp) pp = mp;
              individualPortraitRegenerated = true;
            }
          }
        } catch (staleErr: any) {
          console.warn('[CouplePortal] Staleness check failed:', staleErr?.message);
        }
      }

      if (!mp) {
        mp = await autoGenPortrait(user.id, 'MY');
        if (selfCouple && mp) pp = mp;
      }
      // NOTE: We do NOT try to regenerate the partner's portrait here.
      // RLS prevents writing to another user's portrait row. The partner
      // must regenerate their own portrait from their device. We only READ.
      // If the portrait is stale, we still use it — a stale portrait is
      // far better than no portrait at all.
      if (pp && !selfCouple) {
        const partnerVersionStale = isPortraitStale((pp as any).version);
        if (partnerVersionStale) {
          console.log('[CouplePortal] Partner portrait is stale but still usable — partner should regenerate from their device');
        }
      }

      if (!pp && !selfCouple) {
        // Partner portrait not accessible — either:
        // 1. Partner hasn't generated their portrait yet, OR
        // 2. The RLS policy (migration 026) hasn't been applied to allow reading partner data
        console.warn(
          '[CouplePortal] Partner portrait missing — partner needs to generate it from their device. ' +
          'Also verify that migration 026_couple_partner_rls_access.sql has been applied in Supabase.'
        );
      }

      if (mp) setMyPortrait(mp as unknown as IndividualPortrait);
      if (pp) setPartnerPortrait(pp as unknown as IndividualPortrait);
      console.log('[CouplePortal] Final portraits:', { mine: !!mp, partner: !!pp });

      // ─── 2. Load/Generate Relationship Portrait ──────────
      let rp = await getRelationshipPortrait(myCouple.id);
      console.log('[CouplePortal] Relationship portrait from DB:', !!rp);

      // Detect partner portrait changes by comparing portrait IDs stored in relationship portrait
      let partnerPortraitChanged = false;
      if (pp && rp && !selfCouple) {
        const rpData = rp as any;
        const isPartnerA = myCouple.partner_a_id === user.id;
        // The partner's portrait ID stored when the relationship portrait was last generated
        const savedPartnerPortraitId = isPartnerA
          ? rpData.partner_b_portrait_id
          : rpData.partner_a_portrait_id;
        const currentPartnerPortraitId = (pp as any).id;
        if (savedPartnerPortraitId && currentPartnerPortraitId && savedPartnerPortraitId !== currentPartnerPortraitId) {
          partnerPortraitChanged = true;
          console.log('[CouplePortal] Partner portrait ID changed — will regenerate relationship portrait', {
            saved: savedPartnerPortraitId,
            current: currentPartnerPortraitId,
          });
        }
        // Also check if partner's assessment IDs are newer (portrait row ID may stay same on upsert)
        if (!partnerPortraitChanged) {
          const ppIds = new Set((pp as any).assessmentIds || []);
          const myPortraitId = isPartnerA
            ? rpData.partner_a_portrait_id
            : rpData.partner_b_portrait_id;
          const currentMyPortraitId = mp ? (mp as any).id : null;
          // If saved portrait IDs don't match current, something changed
          if (myPortraitId && currentMyPortraitId && myPortraitId !== currentMyPortraitId) {
            partnerPortraitChanged = true; // re-use flag to trigger regen
            console.log('[CouplePortal] My portrait ID changed since last relationship portrait — will regenerate');
          }
        }
      }

      // Regenerate when: no portrait exists, OR either partner's portrait changed
      const needsRelPortraitRegen = !rp || individualPortraitRegenerated || partnerPortraitChanged;
      if (needsRelPortraitRegen && (mp || pp)) {
        if (rp && (individualPortraitRegenerated || partnerPortraitChanged)) {
          console.log('[CouplePortal] Individual portrait changed — regenerating relationship portrait...', {
            myPortraitChanged: individualPortraitRegenerated,
            partnerPortraitChanged,
          });
        }
        // Only generate if BOTH partners have portraits (no mirroring)
        const hasBothPortraits = !!mp && !!pp;
        if (!hasBothPortraits && !selfCouple) {
          console.log('[CouplePortal] Only one partner has a portrait — skipping relationship portrait generation (no mirroring)');
          setPortraitError(
            !mp
              ? 'Your individual portrait is needed to generate the couple portrait. Go to the Home screen to generate it first.'
              : `Your partner hasn't generated their portrait yet. They need to complete all 6 assessments and generate their portrait from their Home screen.`
          );
          setLoading(false);
          return;
        }

        setGenerating(true);
        try {
          const effectiveMyPortrait = mp!;
          const effectivePartnerPortrait = pp!;

          const [rdas, dci, csi16] = await Promise.all([
            getLatestDyadicScores(myCouple.id, 'rdas'),
            getLatestDyadicScores(myCouple.id, 'dci'),
            getLatestDyadicScores(myCouple.id, 'csi-16'),
          ]);

          const genDyadicScores: any = {};
          if (rdas.partnerA && rdas.partnerB) genDyadicScores.rdas = rdas;
          if (dci.partnerA && dci.partnerB) genDyadicScores.dci = dci;
          if (csi16.partnerA && csi16.partnerB) genDyadicScores.csi16 = csi16;
          console.log('[CouplePortal] Dyadic scores for generation:', {
            rdas: !!(rdas.partnerA && rdas.partnerB),
            dci: !!(dci.partnerA && dci.partnerB),
            csi16: !!(csi16.partnerA && csi16.partnerB),
          });

          const isPartnerA = myCouple.partner_a_id === user.id;
          const portraitA = isPartnerA ? effectiveMyPortrait : effectivePartnerPortrait;
          const portraitB = isPartnerA ? effectivePartnerPortrait : effectiveMyPortrait;

          const generated = generateRelationshipPortrait(
            myCouple.id,
            portraitA as unknown as IndividualPortrait,
            portraitB as unknown as IndividualPortrait,
            genDyadicScores,
          );

          rp = await saveRelationshipPortrait(generated as any);
          console.log('[CouplePortal] Relationship portrait generated & saved:', !!rp);
        } catch (e: any) {
          console.error('[CouplePortal] Error generating relationship portrait:', e);
          setPortraitError(`Portrait generation error: ${e?.message || String(e)}`);
        }
        setGenerating(false);
      }

      if (!rp && !mp && !pp) {
        setPortraitError(
          'Neither partner has an individual portrait yet. ' +
          'Go to the Home screen to generate your portrait first, then come back.'
        );
      }

      setPortrait(rp);

      // ─── 3. Load or Generate Deep Couple Portrait ────────
      if (mp && pp) {
        // Validate portraits have required data for deep generation
        const mpValid = mp && (mp as any).compositeScores && (mp as any).negativeCycle;
        const ppValid = pp && (pp as any).compositeScores && (pp as any).negativeCycle;
        if (!mpValid || !ppValid) {
          console.warn('[CouplePortal] Portrait data incomplete — compositeScores or negativeCycle missing', {
            myComposite: !!(mp as any)?.compositeScores,
            myNegCycle: !!(mp as any)?.negativeCycle,
            partnerComposite: !!(pp as any)?.compositeScores,
            partnerNegCycle: !!(pp as any)?.negativeCycle,
          });
          setPortraitError('One or both portraits are missing key data (compositeScores / negativeCycle). Try regenerating the portrait from the Home screen.');
        }

        try {
          const isPartnerA = myCouple.partner_a_id === user.id;
          const pA = isPartnerA ? mp : pp;
          const pB = isPartnerA ? pp : mp;
          const pAName = isPartnerA
            ? 'You'
            : (partner?.display_name || (selfCouple ? 'Demo Partner' : 'Your partner'));
          const pBName = isPartnerA
            ? (partner?.display_name || (selfCouple ? 'Demo Partner' : 'Your partner'))
            : 'You';

          // Load dyadic scores
          const [rdas, dci, csi16] = await Promise.all([
            getLatestDyadicScores(myCouple.id, 'rdas'),
            getLatestDyadicScores(myCouple.id, 'dci'),
            getLatestDyadicScores(myCouple.id, 'csi-16'),
          ]);
          const dScores: any = {};
          if (rdas.partnerA && rdas.partnerB) dScores.rdas = rdas;
          if (dci.partnerA && dci.partnerB) dScores.dci = dci;
          if (csi16.partnerA && csi16.partnerB) dScores.csi16 = csi16;
          setDyadicScores({ rdas, dci, csi16 });

          // Load WEARE
          const wp = await getLatestWEAREProfile(myCouple.id);
          setWeareProfile(wp);

          // Try loading cached deep portrait from DB first (skip regeneration if data hasn't changed)
          const needsDeepRegen = needsRelPortraitRegen || !rp;
          let cachedDp = needsDeepRegen ? null : await getDeepCouplePortrait(myCouple.id);
          if (cachedDp && !needsDeepRegen) {
            console.log('[CouplePortal] Loaded deep portrait from DB cache');
            setDeepPortrait(cachedDp);
          } else {
            console.log('[CouplePortal] Generating deep couple portrait...', {
              dyadicAvailable: Object.keys(dScores),
              weareAvailable: !!wp,
              reason: needsDeepRegen ? 'data changed' : 'no cached version',
            });

            const dp = generateDeepCouplePortrait(
              myCouple.id,
              pA as unknown as IndividualPortrait,
              pB as unknown as IndividualPortrait,
              pAName,
              pBName,
              dScores,
              wp,
            );
            setDeepPortrait(dp);

            // Persist to database for future loads
            saveDeepCouplePortrait(myCouple.id, dp).then((saved) => {
              if (saved) console.log('[CouplePortal] Deep portrait persisted to DB');
            }).catch((e) => {
              console.warn('[CouplePortal] Failed to persist deep portrait:', e);
            });

            console.log('[CouplePortal] === Deep portrait generated! ===');
          }
        } catch (e: any) {
          console.error('[CouplePortal] Deep portrait generation FAILED:', e);
          setPortraitError(`Deep portrait error: ${e?.message || String(e)}`);
        }
      } else {
        console.log('[CouplePortal] Cannot generate deep portrait — missing individual portrait(s)');

        // Still load dyadic + WEARE for partial display
        try {
          const [rdas, dci, csi16] = await Promise.all([
            getLatestDyadicScores(myCouple.id, 'rdas'),
            getLatestDyadicScores(myCouple.id, 'dci'),
            getLatestDyadicScores(myCouple.id, 'csi-16'),
          ]);
          setDyadicScores({ rdas, dci, csi16 });
        } catch { setDyadicScores(null); }

        try {
          const [wp, wci] = await Promise.all([
            getLatestWEAREProfile(myCouple.id),
            getThisWeeksCheckIn(myCouple.id, user.id),
          ]);
          setWeareProfile(wp);
          setWeeklyCheckIn(wci);
        } catch {
          setWeareProfile(null);
          setWeeklyCheckIn(null);
        }
      }

      // Load weekly check-in if not already loaded
      if (!weeklyCheckIn) {
        try {
          const wci = await getThisWeeksCheckIn(myCouple.id, user.id);
          setWeeklyCheckIn(wci);
        } catch {}
      }
    } catch (e) {
      console.error('[CouplePortal] Error loading:', e);
    } finally {
      setLoading(false);
      console.log('[CouplePortal] === LOAD COMPLETE ===');
    }
  }, [user]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  // Deep portrait is generated during loadData and stored in state
  const dp = deepPortrait;

  // ─── Loading State ───────────────────────────────────

  if (loading || generating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} accessibilityLabel="Loading" />
          <Text style={styles.loadingText}>
            {generating ? 'Weaving your shared portrait...' : 'Loading the space between you...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!portrait) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.heading}>The Space Between You</Text>
          {portraitError ? (
            <>
              <Text style={styles.subtitle}>{portraitError}</Text>
              <TouchableOpacity
                onPress={() => { setPortrait(null); setPortraitError(null); loadData(); }}
                style={styles.retryBtn}
                accessibilityRole="button"
                accessibilityLabel="Try Again"
              >
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.subtitle}>
              To build your shared portrait, each partner needs to complete their
              6 individual assessments first.
            </Text>
          )}
          <TouchableOpacity
            onPress={() => router.replace('/(app)/partner')}
            style={styles.backBtnCenter}
            accessibilityRole="button"
            accessibilityLabel="Back to Partner"
          >
            <View style={styles.backRow}>
              <ArrowLeftIcon size={16} color={Colors.primary} />
              <Text style={styles.backText}>Back to Partner</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const partnerName = partnerProfile?.display_name || (couple && isSelfCouple(couple) ? 'Demo Partner' : 'Your partner');

  // ─── Tab Content Renderers ─────────────────────────────

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Fallback: show what's missing when deep portrait can't generate */}
      {!dp && (
        <View style={styles.synthesisCard}>
          <Text style={styles.synthesisTitle}>Your deep portrait needs more data</Text>
          <Text style={styles.synthesisNarrative}>
            {!myPortrait && !partnerPortrait
              ? 'Both individual portraits are missing. Each partner needs to complete all 6 individual assessments (ECR-R, DUTCH, SSEIT, DSI-R, IPIP-NEO, Values) and generate their portrait from the Home screen.'
              : !myPortrait
                ? 'Your individual portrait is missing. Complete all 6 assessments on the Home screen, then come back.'
                : !partnerPortrait
                  ? `${partnerName}'s individual portrait isn't available yet. They need to complete their 6 assessments and generate their portrait from the Home screen on their device. Once generated, it will appear here automatically.`
                  : portraitError || 'Something unexpected went wrong generating the deep portrait. Try tapping Refresh.'}
          </Text>
          <TouchableOpacity
            onPress={() => { setDeepPortrait(null); setPortrait(null); loadData(); }}
            style={styles.retryBtn}
            accessibilityRole="button"
            accessibilityLabel="Refresh"
          >
            <Text style={styles.retryText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Twin Orbs + Field */}
      {dp && (
        <TwinOrbsField
          field={dp.relationalField}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
        />
      )}

      {/* Literary Narrative Snapshot */}
      {dp && (
        <View style={styles.narrativeCard}>
          <Text style={styles.narrativeSummary}>
            {(() => { try { return generateOverviewSnapshot(dp); } catch { return 'Your couple portrait is being prepared...'; } })()}
          </Text>
        </View>
      )}

      {/* ─── Fallback content when deep portrait isn't available ─── */}
      {!dp && portrait && (
        <View style={styles.overviewInsights}>
          {portrait.combined_cycle && (
            <>
              <Text style={styles.insightsHeading}>Your Relational Pattern</Text>
              <View style={styles.narrativeCard}>
                <Text style={styles.narrativeSummary}>
                  {portrait.combined_cycle.cycleDescription}
                </Text>
              </View>
              {portrait.combined_cycle.triggers?.length > 0 && (
                <View style={styles.overviewInsightRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.overviewInsightLabel}>Common Triggers</Text>
                    <Text style={styles.overviewInsightText}>
                      {portrait.combined_cycle.triggers.slice(0, 3).join(' • ')}
                    </Text>
                  </View>
                </View>
              )}
              {portrait.combined_cycle.deEscalationSteps?.length > 0 && (
                <View style={styles.overviewInsightRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.overviewInsightLabel}>Steps Toward Each Other</Text>
                    <Text style={styles.overviewInsightText}>
                      {portrait.combined_cycle.deEscalationSteps.slice(0, 3).join(' • ')}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}

          {portrait.relationship_growth_edges?.length > 0 && (
            <>
              <Text style={[styles.insightsHeading, { marginTop: Spacing.md }]}>Growth Edges</Text>
              {portrait.relationship_growth_edges.slice(0, 3).map((edge: any, i: number) => (
                <View key={i} style={styles.overviewInsightRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.overviewInsightLabel}>{edge.title || edge.area}</Text>
                    <Text style={styles.overviewInsightText}>{edge.description}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      )}

      {/* Quick Stats */}
      {portrait.dyadic_scores?.csi16 && (
        <View style={styles.quickStatsRow}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{portrait.dyadic_scores.csi16.total}</Text>
            <Text style={styles.quickStatLabel}>Satisfaction</Text>
          </View>
          {portrait.dyadic_scores?.rdas && (
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{portrait.dyadic_scores.rdas.total}</Text>
              <Text style={styles.quickStatLabel}>Adjustment</Text>
            </View>
          )}
          {portrait.dyadic_scores?.dci && (
            <View style={styles.quickStat}>
              <Text style={[styles.quickStatValue, { fontSize: 16, color: Colors.calm }]}>
                {portrait.dyadic_scores.dci.copingQuality}
              </Text>
              <Text style={styles.quickStatLabel}>Coping</Text>
            </View>
          )}
        </View>
      )}

      {/* ─── Key Insights Snapshot ─── */}
      {dp && (
        <View style={styles.overviewInsights}>
          <Text style={styles.insightsHeading}>Relationship Snapshot</Text>

          {/* Your Dance */}
          <View style={styles.overviewInsightRow}>
            <View style={styles.insightIconBadge}>
              <HeartPulseIcon size={14} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.overviewInsightLabel}>Your Dance</Text>
              <Text style={styles.overviewInsightText}>
                {dp.patternInterlock.combinedCycle.dynamic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — {dp.partnerAName} tends to {dp.patternInterlock.combinedCycle.partnerAPosition}, {dp.partnerBName} tends to {dp.patternInterlock.combinedCycle.partnerBPosition}
              </Text>
            </View>
          </View>

          {/* Attachment — mini matrix plot */}
          <View style={styles.overviewInsightRow}>
            <View style={styles.insightIconBadge}>
              <LinkIcon size={14} color={Colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.overviewInsightLabel}>Attachment Landscape</Text>
            </View>
          </View>
          <View style={styles.miniMatrixContainer}>
            <AttachmentMatrixPlot
              attachmentDynamic={dp.patternInterlock.attachmentDynamic}
              partnerAName={dp.partnerAName}
              partnerBName={dp.partnerBName}
            />
            <Text style={styles.miniMatrixCaption}>
              {dp.patternInterlock.attachmentDynamic.dynamicLabel}
            </Text>
          </View>

          {/* Shared Strengths */}
          {dp.convergenceDivergence.sharedStrengths.length > 0 && (
            <View style={styles.overviewInsightRow}>
              <View style={styles.insightIconBadge}>
                <SparkleIcon size={14} color={Colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.overviewInsightLabel}>Shared Strengths</Text>
                <Text style={styles.overviewInsightText}>
                  {dp.convergenceDivergence.sharedStrengths.slice(0, 3).map(s => s.dimensionLabel).join(', ')}
                </Text>
              </View>
            </View>
          )}

          {/* Friction Zones */}
          {dp.convergenceDivergence.frictionZones.length > 0 && (
            <View style={styles.overviewInsightRow}>
              <View style={styles.insightIconBadge}>
                <LightningIcon size={14} color={Colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.overviewInsightLabel}>Friction Zones</Text>
                <Text style={styles.overviewInsightText}>
                  {dp.convergenceDivergence.frictionZones.slice(0, 3).map(z => z.area).join(', ')}
                </Text>
              </View>
            </View>
          )}

          {/* Top Growth Edge */}
          {dp.coupleGrowthEdges.length > 0 && (
            <View style={styles.overviewInsightRow}>
              <View style={styles.insightIconBadge}>
                <CompassIcon size={14} color={Colors.depth} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.overviewInsightLabel}>Growth Edge</Text>
                <Text style={styles.overviewInsightText}>
                  {dp.coupleGrowthEdges[0].title}
                </Text>
              </View>
            </View>
          )}

          {/* Field Vitality */}
          {dp.relationalField && dp.relationalField.vitality > 0 && (
            <View style={styles.overviewInsightRow}>
              <View style={styles.insightIconBadge}>
                <LeafIcon size={14} color={Colors.calm} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.overviewInsightLabel}>Field Vitality</Text>
                <Text style={styles.overviewInsightText}>
                  {dp.relationalField.qualitativeLabel || `${Math.round(dp.relationalField.vitality)}%`}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* WEARE Check-In */}
      {couple && weareProfile && (
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
      )}

      {/* Coach Entry */}
      <TouchableOpacity
        style={styles.coachCard}
        onPress={() => router.push({
          pathname: '/(app)/chat' as any,
          params: { coupleMode: 'true', coupleId: couple?.id || '' },
        })}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Talk to Your Couple Coach"
      >
        <View style={styles.journeyHeader}>
          <ChatBubbleIcon size={20} color={Colors.depth} />
          <Text style={styles.coachTitle}>Talk to Your Couple Coach</Text>
        </View>
        <Text style={styles.coachDesc}>
          Your AI guide now understands both of your portraits and your relationship
          patterns.
        </Text>
        <View style={styles.ctaRow}>
          <Text style={styles.coachCta}>Start Conversation</Text>
          <ArrowRightIcon size={14} color={Colors.depth} />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderDance = () => {
    if (!dp) return <Text style={styles.noDataText}>Deep portrait data is being generated...</Text>;

    return (
      <View style={styles.tabContent}>
        {/* Combined Cycle */}
        <CombinedCycleVisualization
          cycle={dp.patternInterlock.combinedCycle}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
        />

        {/* Exit Points */}
        <Text style={styles.sectionTitle}>Exit Points</Text>
        <Text style={styles.sectionDesc}>
          Four moments where you can interrupt the cycle and choose differently.
        </Text>
        {dp.patternInterlock.combinedCycle.exitPoints.map((ep) => (
          <ExitPointCard
            key={ep.number}
            exitPoint={ep}
            partnerAName={dp.partnerAName}
            partnerBName={dp.partnerBName}
          />
        ))}

        {/* Repair Pathway */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Repair Pathway</Text>
        {dp.patternInterlock.combinedCycle.repairPathway.map((step) => (
          <View key={step.step} style={styles.repairStep}>
            <View style={styles.repairStepNumber}>
              <Text style={styles.repairStepNumberText}>{step.step}</Text>
            </View>
            <Text style={styles.repairStepText}>{step.action}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTogether = () => {
    if (!dp) return <Text style={styles.noDataText}>Deep portrait data is being generated...</Text>;

    return (
      <View style={styles.tabContent}>
        {/* Dual Radar Chart */}
        <Text style={styles.sectionTitle}>Your Profiles Overlaid</Text>
        <DualRadarChart
          radarOverlap={dp.convergenceDivergence.radarOverlap}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
        />

        {/* Attachment Matrix */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Attachment Landscape</Text>
        <AttachmentMatrixPlot
          attachmentDynamic={dp.patternInterlock.attachmentDynamic}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
        />
        <Text style={styles.narrativeSmall}>
          {dp.patternInterlock.attachmentDynamic.narrative}
        </Text>

        {/* Shared Strengths */}
        {dp.convergenceDivergence.sharedStrengths.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Shared Strengths</Text>
            {dp.convergenceDivergence.sharedStrengths.map((s, i) => (
              <SharedStrengthCard key={i} item={s} />
            ))}
          </>
        )}

        {/* Complementary Gifts */}
        {dp.convergenceDivergence.complementaryGifts.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Complementary Gifts</Text>
            {dp.convergenceDivergence.complementaryGifts.map((g, i) => (
              <ComplementaryGiftCard
                key={i}
                item={g}
                partnerAName={dp.partnerAName}
                partnerBName={dp.partnerBName}
              />
            ))}
          </>
        )}

        {/* Friction Zones */}
        {dp.convergenceDivergence.frictionZones.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Friction Zones</Text>
            {dp.convergenceDivergence.frictionZones.map((z, i) => (
              <FrictionZoneCard
                key={i}
                item={z}
                partnerAName={dp.partnerAName}
                partnerBName={dp.partnerBName}
              />
            ))}
          </>
        )}

        {/* Values Tensions */}
        {dp.convergenceDivergence.valuesTensions.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Values Tensions</Text>
            {dp.convergenceDivergence.valuesTensions.map((t, i) => (
              <ValuesTensionCard key={i} item={t} />
            ))}
          </>
        )}
      </View>
    );
  };

  // ─── Assessments Tab ─────────────────────────────────────
  const renderAssessments = () => {
    const nameA = dp?.partnerAName || 'Partner A';
    const nameB = dp?.partnerBName || partnerName || 'Partner B';

    if (!dyadicScores) {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.noDataText}>
            Couple assessments haven't been completed yet.{'\n'}
            Go to the Assessment screen and choose a couple assessment to get started.
          </Text>
        </View>
      );
    }

    // ── Score bar helper ──
    const ScoreBar = ({ value, max, color }: { value: number; max: number; color: string }) => {
      const pct = Math.min(100, Math.max(0, (value / max) * 100));
      return (
        <View style={assessStyles.barBg}>
          <View style={[assessStyles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
        </View>
      );
    };

    // ── Partner comparison row ──
    const CompareRow = ({ label, valueA, valueB, max, color }: {
      label: string; valueA: number | null; valueB: number | null; max: number; color: string;
    }) => (
      <View style={assessStyles.compareRow}>
        <Text style={assessStyles.compareLabel}>{label}</Text>
        <View style={assessStyles.compareValues}>
          <View style={assessStyles.partnerCol}>
            <Text style={assessStyles.partnerScore}>{valueA != null ? valueA.toFixed(0) : '—'}</Text>
            <ScoreBar value={valueA ?? 0} max={max} color={color} />
          </View>
          <View style={assessStyles.partnerCol}>
            <Text style={assessStyles.partnerScore}>{valueB != null ? valueB.toFixed(0) : '—'}</Text>
            <ScoreBar value={valueB ?? 0} max={max} color={color} />
          </View>
        </View>
      </View>
    );

    // ── Assessment card wrapper ──
    const AssessmentCard = ({ title, subtitle, accentColor, children }: {
      title: string; subtitle: string; accentColor: string; children: React.ReactNode;
    }) => (
      <View style={[assessStyles.assessCard, { borderLeftColor: accentColor, borderLeftWidth: 3 }]}>
        <Text style={assessStyles.assessTitle}>{title}</Text>
        <Text style={assessStyles.assessSubtitle}>{subtitle}</Text>
        {/* Partner name headers */}
        <View style={assessStyles.partnerHeaders}>
          <View style={{ flex: 1 }} />
          <View style={assessStyles.compareValues}>
            <View style={assessStyles.partnerCol}>
              <Text style={assessStyles.partnerName}>{nameA}</Text>
            </View>
            <View style={assessStyles.partnerCol}>
              <Text style={assessStyles.partnerName}>{nameB}</Text>
            </View>
          </View>
        </View>
        {children}
      </View>
    );

    // ── Level badge ──
    const LevelBadge = ({ level, color }: { level: string; color: string }) => (
      <View style={[assessStyles.levelBadge, { backgroundColor: color + '18', borderColor: color }]}>
        <Text style={[assessStyles.levelBadgeText, { color }]}>{level}</Text>
      </View>
    );

    // CSI-16 interpretation
    const csiInterpretation = (level?: string): { text: string; color: string } => {
      switch (level) {
        case 'high': return { text: 'High satisfaction — a strong sense of happiness and connection in the relationship.', color: Colors.success };
        case 'moderate': return { text: 'Moderate satisfaction — things are generally good, with some areas that could deepen.', color: Colors.secondary };
        case 'low': return { text: 'Below-average satisfaction — there may be areas of disconnection worth exploring together.', color: Colors.warning };
        case 'crisis': return { text: 'This score falls in the clinical range — it may be time to seek support from a couples therapist.', color: Colors.error };
        default: return { text: '', color: Colors.textMuted };
      }
    };

    // RDAS interpretation
    const rdasInterpretation = (level?: string): { text: string; color: string } => {
      switch (level) {
        case 'non-distressed': return { text: 'Non-distressed — your relationship adjustment is in a healthy range, with strong alignment.', color: Colors.success };
        case 'mild': return { text: 'Mild distress — some areas of misalignment, but the foundation is solid.', color: Colors.secondary };
        case 'moderate': return { text: 'Moderate distress — meaningful gaps in consensus, satisfaction, or cohesion worth attending to.', color: Colors.warning };
        case 'severe': return { text: 'Significant distress — professional support could make a meaningful difference here.', color: Colors.error };
        default: return { text: '', color: Colors.textMuted };
      }
    };

    // DCI interpretation
    const dciInterpretation = (quality?: string): { text: string; color: string } => {
      switch (quality) {
        case 'strong': return { text: 'Strong coping together — you meet each other\'s stress with genuine support and partnership.', color: Colors.success };
        case 'adequate': return { text: 'Adequate coping — the basics are in place, with room to deepen how you support each other under stress.', color: Colors.secondary };
        case 'weak': return { text: 'Coping under strain — stress may be creating distance rather than closeness. This is a growth edge.', color: Colors.warning };
        default: return { text: '', color: Colors.textMuted };
      }
    };

    const { rdas, dci, csi16 } = dyadicScores;
    const hasAnything = (rdas.partnerA || rdas.partnerB) || (dci.partnerA || dci.partnerB) || (csi16.partnerA || csi16.partnerB);

    if (!hasAnything) {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.noDataText}>
            No couple assessment results yet.{'\n'}
            Complete a couple assessment together to see your results here.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Your Couple Assessments</Text>
        <Text style={styles.sectionDesc}>
          How you each experience the relationship — side by side. These aren't grades; they're
          a shared map of where you align and where attention is needed.
        </Text>

        {/* ── CSI-16: Couple Satisfaction ── */}
        {(csi16.partnerA || csi16.partnerB) && (
          <AssessmentCard
            title="Couple Satisfaction"
            subtitle="CSI-16 — How satisfied each partner feels in the relationship"
            accentColor={Colors.secondary}
          >
            <CompareRow
              label="Total Score"
              valueA={csi16.partnerA?.total ?? null}
              valueB={csi16.partnerB?.total ?? null}
              max={81}
              color={Colors.secondary}
            />

            {/* Level badges */}
            <View style={assessStyles.badgeRow}>
              {csi16.partnerA?.satisfactionLevel && (
                <LevelBadge
                  level={csi16.partnerA.satisfactionLevel.charAt(0).toUpperCase() + csi16.partnerA.satisfactionLevel.slice(1)}
                  color={csiInterpretation(csi16.partnerA.satisfactionLevel).color}
                />
              )}
              {csi16.partnerB?.satisfactionLevel && (
                <LevelBadge
                  level={csi16.partnerB.satisfactionLevel.charAt(0).toUpperCase() + csi16.partnerB.satisfactionLevel.slice(1)}
                  color={csiInterpretation(csi16.partnerB.satisfactionLevel).color}
                />
              )}
            </View>

            {/* Interpretation */}
            {(csi16.partnerA?.satisfactionLevel || csi16.partnerB?.satisfactionLevel) && (
              <View style={assessStyles.interpretCard}>
                <Text style={assessStyles.interpretTitle}>What This Means</Text>
                <Text style={assessStyles.interpretText}>
                  The CSI-16 measures overall relationship happiness on a 0–81 scale.
                  Scores above 51.5 are considered non-distressed.
                  {csi16.partnerA?.satisfactionLevel && `\n\n${nameA}: ${csiInterpretation(csi16.partnerA.satisfactionLevel).text}`}
                  {csi16.partnerB?.satisfactionLevel && `\n\n${nameB}: ${csiInterpretation(csi16.partnerB.satisfactionLevel).text}`}
                </Text>
              </View>
            )}
          </AssessmentCard>
        )}

        {/* ── RDAS: Relationship Adjustment ── */}
        {(rdas.partnerA || rdas.partnerB) && (
          <AssessmentCard
            title="Relationship Adjustment"
            subtitle="RDAS — Consensus, satisfaction, and cohesion in the relationship"
            accentColor={Colors.secondary}
          >
            <CompareRow label="Total Score" valueA={rdas.partnerA?.total ?? null} valueB={rdas.partnerB?.total ?? null} max={69} color={Colors.secondary} />
            <CompareRow label="Consensus" valueA={rdas.partnerA?.consensus ?? null} valueB={rdas.partnerB?.consensus ?? null} max={30} color={Colors.secondary} />
            <CompareRow label="Satisfaction" valueA={rdas.partnerA?.satisfaction ?? null} valueB={rdas.partnerB?.satisfaction ?? null} max={20} color={Colors.secondary} />
            <CompareRow label="Cohesion" valueA={rdas.partnerA?.cohesion ?? null} valueB={rdas.partnerB?.cohesion ?? null} max={20} color={Colors.success} />

            {/* Level badges */}
            <View style={assessStyles.badgeRow}>
              {rdas.partnerA?.distressLevel && (
                <LevelBadge
                  level={rdas.partnerA.distressLevel.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  color={rdasInterpretation(rdas.partnerA.distressLevel).color}
                />
              )}
              {rdas.partnerB?.distressLevel && (
                <LevelBadge
                  level={rdas.partnerB.distressLevel.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  color={rdasInterpretation(rdas.partnerB.distressLevel).color}
                />
              )}
            </View>

            {/* Interpretation */}
            <View style={assessStyles.interpretCard}>
              <Text style={assessStyles.interpretTitle}>Understanding Your Scores</Text>
              <Text style={assessStyles.interpretText}>
                The RDAS measures relationship adjustment across three areas:{'\n\n'}
                • <Text style={{ fontWeight: '600' }}>Consensus</Text> (0–30): How much you agree on important matters — finances, values, decisions{'\n'}
                • <Text style={{ fontWeight: '600' }}>Satisfaction</Text> (0–20): Day-to-day happiness and contentment in the relationship{'\n'}
                • <Text style={{ fontWeight: '600' }}>Cohesion</Text> (0–20): How much you share activities, ideas, and quality time{'\n\n'}
                Scores above 48 on the total generally indicate a non-distressed relationship.
                {rdas.partnerA?.distressLevel && `\n\n${nameA}: ${rdasInterpretation(rdas.partnerA.distressLevel).text}`}
                {rdas.partnerB?.distressLevel && `\n\n${nameB}: ${rdasInterpretation(rdas.partnerB.distressLevel).text}`}
              </Text>
            </View>
          </AssessmentCard>
        )}

        {/* ── DCI: Dyadic Coping ── */}
        {(dci.partnerA || dci.partnerB) && (
          <AssessmentCard
            title="Dyadic Coping"
            subtitle="DCI — How you support each other through stress"
            accentColor={Colors.success}
          >
            <CompareRow label="Positive Coping (Total)" valueA={dci.partnerA?.totalPositive ?? null} valueB={dci.partnerB?.totalPositive ?? null} max={90} color={Colors.success} />
            <CompareRow label="Stress Communication" valueA={dci.partnerA?.stressCommunicationBySelf ?? null} valueB={dci.partnerB?.stressCommunicationBySelf ?? null} max={20} color={Colors.secondary} />
            <CompareRow label="Supportive Coping" valueA={dci.partnerA?.supportiveBySelf ?? null} valueB={dci.partnerB?.supportiveBySelf ?? null} max={25} color={Colors.success} />
            <CompareRow label="Delegated Coping" valueA={dci.partnerA?.delegatedBySelf ?? null} valueB={dci.partnerB?.delegatedBySelf ?? null} max={10} color={Colors.secondary} />
            <CompareRow label="Common Coping" valueA={dci.partnerA?.commonCoping ?? null} valueB={dci.partnerB?.commonCoping ?? null} max={25} color={Colors.warning} />
            <CompareRow label="Negative Coping" valueA={dci.partnerA?.negativeBySelf ?? null} valueB={dci.partnerB?.negativeBySelf ?? null} max={20} color={Colors.error} />

            {/* Level badges */}
            <View style={assessStyles.badgeRow}>
              {dci.partnerA?.copingQuality && (
                <LevelBadge
                  level={dci.partnerA.copingQuality.charAt(0).toUpperCase() + dci.partnerA.copingQuality.slice(1)}
                  color={dciInterpretation(dci.partnerA.copingQuality).color}
                />
              )}
              {dci.partnerB?.copingQuality && (
                <LevelBadge
                  level={dci.partnerB.copingQuality.charAt(0).toUpperCase() + dci.partnerB.copingQuality.slice(1)}
                  color={dciInterpretation(dci.partnerB.copingQuality).color}
                />
              )}
            </View>

            {/* Interpretation */}
            <View style={assessStyles.interpretCard}>
              <Text style={assessStyles.interpretTitle}>Understanding Your Scores</Text>
              <Text style={assessStyles.interpretText}>
                The DCI measures how partners cope with stress together:{'\n\n'}
                • <Text style={{ fontWeight: '600' }}>Stress Communication</Text>: How clearly you signal stress to each other{'\n'}
                • <Text style={{ fontWeight: '600' }}>Supportive Coping</Text>: Emotional and practical support offered to your partner{'\n'}
                • <Text style={{ fontWeight: '600' }}>Delegated Coping</Text>: Taking on tasks when your partner is overwhelmed{'\n'}
                • <Text style={{ fontWeight: '600' }}>Common Coping</Text>: Facing challenges as a team, co-regulating together{'\n'}
                • <Text style={{ fontWeight: '600' }}>Negative Coping</Text>: Dismissive or hostile responses to partner's stress (lower is better)
                {dci.partnerA?.copingQuality && `\n\n${nameA}: ${dciInterpretation(dci.partnerA.copingQuality).text}`}
                {dci.partnerB?.copingQuality && `\n\n${nameB}: ${dciInterpretation(dci.partnerB.copingQuality).text}`}
              </Text>
            </View>
          </AssessmentCard>
        )}
      </View>
    );
  };

  const renderInsights = () => {
    if (!dp) return <Text style={styles.noDataText}>Deep portrait data is being generated...</Text>;

    return (
      <View style={styles.tabContent}>
        {/* Full Relationship Story — opening is shown on Overview tab, not here */}
        <Text style={styles.sectionTitle}>Your Story</Text>
        <CoupleNarrativeBlock
          narrative={dp.narrative}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
          showOpening={false}
        />

        {/* Dyadic Synthesis */}
        {dp.dyadicInsights.satisfaction && (
          <View style={[styles.synthesisCard, { marginTop: Spacing.lg }]}>
            <Text style={styles.synthesisTitle}>Relationship Adjustment</Text>
            <Text style={styles.synthesisNarrative}>{dp.dyadicInsights.satisfaction.narrative}</Text>
          </View>
        )}
        {dp.dyadicInsights.closeness && (
          <View style={styles.synthesisCard}>
            <Text style={styles.synthesisTitle}>Couple Satisfaction</Text>
            <Text style={styles.synthesisNarrative}>{dp.dyadicInsights.closeness.narrative}</Text>
          </View>
        )}
        {dp.dyadicInsights.coping && (
          <View style={styles.synthesisCard}>
            <Text style={styles.synthesisTitle}>Dyadic Coping</Text>
            <Text style={styles.synthesisNarrative}>{dp.dyadicInsights.coping.narrative}</Text>
          </View>
        )}

        {/* Discrepancies */}
        {dp.dyadicInsights.discrepancies.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Where Data Diverges</Text>
            <Text style={styles.sectionDesc}>
              Places where your individual profiles tell a different story than your dyadic assessments.
            </Text>
            {dp.dyadicInsights.discrepancies.map((d, i) => (
              <DyadicDiscrepancyAlert key={i} discrepancy={d} />
            ))}
          </>
        )}
      </View>
    );
  };

  const renderGrowth = () => {
    if (!dp) return <Text style={styles.noDataText}>Deep portrait data is being generated...</Text>;

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Your Growth Edges</Text>
        <Text style={styles.sectionDesc}>
          Prioritized areas where your relationship is asking to evolve. Each edge names
          the protection, the cost, and the invitation.
        </Text>

        {dp.coupleGrowthEdges.map((edge, i) => (
          <CoupleGrowthEdgeCard
            key={edge.id}
            edge={edge}
            partnerAName={dp.partnerAName}
            partnerBName={dp.partnerBName}
            index={i}
          />
        ))}

        {/* Healing Journey Link */}
        <TouchableOpacity
          style={styles.journeyCard}
          onPress={() => router.push('/(app)/growth' as any)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Continue Your Healing Journey"
        >
          <View style={styles.journeyHeader}>
            <SeedlingIcon size={22} color={Colors.primary} />
            <Text style={styles.journeyTitle}>Continue Your Healing Journey</Text>
          </View>
          <Text style={styles.journeyDesc}>
            Twelve steps of relational growth — practices, reflections, and milestones
            designed around your unique patterns.
          </Text>
          <View style={styles.ctaRow}>
            <Text style={styles.journeyCta}>View Journey</Text>
            <ArrowRightIcon size={14} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAnchors = () => {
    if (!dp) return <Text style={styles.noDataText}>Deep portrait data is being generated...</Text>;

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Couple Anchors</Text>
        <Text style={styles.sectionDesc}>
          Phrases to hold onto in difficult moments — personalized to your patterns, your cycle,
          and your attachment dynamics.
        </Text>

        <CoupleAnchorCard
          anchors={dp.coupleAnchors}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
        />
      </View>
    );
  };

  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'overview': return renderOverview();
        case 'dance': return renderDance();
        case 'together': return renderTogether();
        case 'assessments': return renderAssessments();
        case 'insights': return renderInsights();
        case 'growth': return renderGrowth();
        case 'anchors': return renderAnchors();
      }
    } catch (e: any) {
      console.error('[CouplePortal] Tab render error:', e);
      return (
        <View style={styles.tabContent}>
          <View style={styles.synthesisCard}>
            <Text style={styles.synthesisTitle}>Something went wrong</Text>
            <Text style={styles.synthesisNarrative}>
              This section couldn't render. Try switching tabs or refreshing.
              {__DEV__ ? `\n\nError: ${e?.message}` : ''}
            </Text>
            <TouchableOpacity
              onPress={() => { setDeepPortrait(null); setPortrait(null); loadData(); }}
              style={styles.retryBtn}
              accessibilityRole="button"
              accessibilityLabel="Refresh"
            >
              <Text style={styles.retryText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  // ─── Main Render ─────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.replace('/(app)/partner' as any)} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back">
            <View style={styles.backRow}>
              <ArrowLeftIcon size={16} color={Colors.primary} />
              <Text style={styles.backText}>Back</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              if (!dp) return;
              try {
                const { generateCouplePortraitPDF } = await import('@/services/pdf-export');
                const nameA = dp.partnerAName || 'Partner A';
                const nameB = dp.partnerBName || partnerName || 'Partner B';
                await generateCouplePortraitPDF(dp, nameA, nameB);
              } catch (err) {
                if (__DEV__) console.warn('[CouplePortal] PDF export failed:', err);
                if (Platform.OS !== 'web') {
                  Alert.alert('Export Error', 'Could not generate PDF. Please try again.');
                }
              }
            }}
            activeOpacity={0.7}
            style={styles.exportBtn}
            disabled={!dp}
            accessibilityRole="button"
            accessibilityLabel="Export PDF"
            accessibilityState={{ disabled: !dp }}
          >
            <Text style={[styles.exportBtnText, !dp && { opacity: 0.4 }]}>Export PDF</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>The Space Between You</Text>
        <Text style={styles.subtitle}>
          A living portrait of how you and {partnerName} move through the world together
        </Text>

        {/* Sharing Info */}
        {partnerSharedAssessments.length > 0 && (
          <View style={styles.sharingCard}>
            <Text style={styles.sharingLabel}>SHARED WITH YOU</Text>
            <Text style={styles.sharingText}>
              {partnerName} is sharing {Math.min(partnerSharedAssessments.length, INDIVIDUAL_ASSESSMENT_TYPES.length)} of {INDIVIDUAL_ASSESSMENT_TYPES.length} individual assessments with you.
            </Text>
          </View>
        )}

        {/* Tab Bar — scrollable horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBarScroll}
          contentContainerStyle={styles.tabBar}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab Content */}
        {renderTabContent()}

        <View style={{ height: 100 }} />
      </ScrollView>
      <HomeButton />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  loadingText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },

  // Header
  backBtn: { marginBottom: Spacing.md },
  backBtnCenter: { marginTop: Spacing.lg },
  backRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  backText: { ...Typography.body, color: Colors.primary },
  heading: {
    ...Typography.headingXL,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  retryBtn: { marginTop: Spacing.md },
  retryText: { ...Typography.body, color: Colors.secondary },

  // Sharing
  sharingCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.calm,
    marginBottom: Spacing.md,
  },
  sharingLabel: {
    ...Typography.label,
    color: Colors.calm,
    marginBottom: Spacing.xs,
  },
  sharingText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Tab Bar
  tabBarScroll: {
    marginBottom: Spacing.md,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 3,
    gap: 2,
    ...Shadows.subtle,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    ...Typography.buttonSmall,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },

  // Tab Content
  tabContent: {
    gap: Spacing.sm,
  },
  noDataText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontStyle: 'italic',
  },

  // Section headers
  sectionTitle: {
    ...Typography.headingM,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sectionDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },

  // Overview
  narrativeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  narrativeSummary: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: Colors.secondary,
  },
  quickStatLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  narrativeSmall: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },

  // Overview Key Insights
  overviewInsights: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
    gap: Spacing.sm,
  },
  overviewInsightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  insightIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 2,
  },
  insightsHeading: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  miniMatrixContainer: {
    marginVertical: Spacing.xs,
    alignItems: 'center' as const,
  },
  miniMatrixCaption: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: Spacing.xs,
  },
  overviewInsightLabel: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: 2,
  },
  overviewInsightText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Repair steps
  repairStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  repairStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repairStepNumberText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 12,
    color: Colors.white,
  },
  repairStepText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },

  // Synthesis cards
  synthesisCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  synthesisTitle: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  synthesisNarrative: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Journey Card
  journeyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  journeyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  journeyTitle: {
    ...Typography.headingS,
    color: Colors.primary,
  },
  journeyDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  journeyCta: {
    ...Typography.bodyMedium,
    color: Colors.primary,
  },
  ctaRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },

  // Coach Card
  coachCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderColor: Colors.depth,
    borderWidth: 1,
  },
  coachTitle: {
    ...Typography.headingS,
    color: Colors.depth,
    marginBottom: Spacing.xs,
  },
  coachDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  coachCta: {
    ...Typography.bodyMedium,
    color: Colors.depth,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  exportBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  exportBtnText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontFamily: FontFamilies.body,
    letterSpacing: 0.5,
  },
});

// ── Assessment Tab Styles ──────────────────────────────────
const assessStyles = StyleSheet.create({
  assessCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  assessTitle: {
    fontFamily: FontFamilies.accent,
    fontSize: 18,
    color: Colors.text,
    marginBottom: 2,
  },
  assessSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    letterSpacing: 0.3,
  },
  partnerHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  partnerName: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  compareLabel: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  compareValues: {
    flexDirection: 'row',
    flex: 1.5,
    gap: Spacing.sm,
  },
  partnerCol: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  partnerScore: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  barBg: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  levelBadgeText: {
    ...Typography.caption,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  interpretCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
  },
  interpretTitle: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  interpretText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
