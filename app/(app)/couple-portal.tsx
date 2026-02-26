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
} from '@/services/couples';
import { getPartnerSharedAssessments } from '@/services/consent';
import { getPortrait, checkCanGeneratePortrait, fetchAllScores, extractSupplementScores, savePortrait } from '@/services/portrait';
import { generatePortrait } from '@/utils/portrait/portrait-generator';
import { generateRelationshipPortrait } from '@/utils/portrait/relationship-portrait-generator';
import { generateDeepCouplePortrait } from '@/utils/portrait/couple-portrait-generator';
import { getExerciseById } from '@/utils/interventions/registry';
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

type TabKey = 'overview' | 'dance' | 'together' | 'insights' | 'growth' | 'anchors';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'dance', label: 'Your Dance' },
  { key: 'together', label: 'Together' },
  { key: 'insights', label: 'Insights' },
  { key: 'growth', label: 'Growth' },
  { key: 'anchors', label: 'Anchors' },
];

export default function CouplePortalScreen() {
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
        setPortraitError(null);
        try {
          const selfCouple = isSelfCouple(myCouple);
          const partnerId = myCouple.partner_a_id === user.id
            ? myCouple.partner_b_id : myCouple.partner_a_id;

          let myPortraitData = await getPortrait(user.id);
          let partnerPortraitData = selfCouple ? myPortraitData : await getPortrait(partnerId);

          // Auto-generate individual portraits if missing
          const autoGenPortrait = async (targetUserId: string): Promise<IndividualPortrait | null> => {
            const { canGenerate } = await checkCanGeneratePortrait(targetUserId);
            if (!canGenerate) return null;
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
            return await savePortrait(freshPortrait);
          };

          if (!myPortraitData) {
            try {
              myPortraitData = await autoGenPortrait(user.id);
              if (selfCouple && myPortraitData) partnerPortraitData = myPortraitData;
            } catch (genErr) {
              console.error('[CouplePortal] Auto-generate user portrait failed:', genErr);
            }
          }
          if (!partnerPortraitData && !selfCouple) {
            try {
              partnerPortraitData = await autoGenPortrait(partnerId);
            } catch (genErr) {
              console.error('[CouplePortal] Auto-generate partner portrait failed:', genErr);
            }
          }

          if (!myPortraitData && !partnerPortraitData) {
            setPortraitError(
              'Neither partner has an individual portrait yet. ' +
              'Go to the Home screen to generate your portrait first, then come back.'
            );
          } else {
            const effectiveMyPortrait = myPortraitData || partnerPortraitData;
            const effectivePartnerPortrait = partnerPortraitData || myPortraitData;

            // Load dyadic scores for generation
            const [rdas, dci, csi16] = await Promise.all([
              getLatestDyadicScores(myCouple.id, 'rdas'),
              getLatestDyadicScores(myCouple.id, 'dci'),
              getLatestDyadicScores(myCouple.id, 'csi-16'),
            ]);

            const genDyadicScores: any = {};
            if (rdas.partnerA && rdas.partnerB) genDyadicScores.rdas = rdas;
            if (dci.partnerA && dci.partnerB) genDyadicScores.dci = dci;
            if (csi16.partnerA && csi16.partnerB) genDyadicScores.csi16 = csi16;

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
            if (!rp) {
              setPortraitError('Portrait was generated but failed to save. Please try again.');
            }

            // Store individual portraits for deep portrait generation
            setMyPortrait(effectiveMyPortrait as unknown as IndividualPortrait);
            setPartnerPortrait(effectivePartnerPortrait as unknown as IndividualPortrait);
          }
        } catch (e: any) {
          console.error('[CouplePortal] Error generating portrait:', e);
          setPortraitError(`Portrait generation error: ${e?.message || String(e)}`);
        }
        setGenerating(false);
      }

      setPortrait(rp);

      // Load individual portraits if not already loaded
      if (!myPortrait || !partnerPortrait) {
        try {
          const selfCouple = isSelfCouple(myCouple);
          const partnerId = myCouple.partner_a_id === user.id
            ? myCouple.partner_b_id : myCouple.partner_a_id;
          const [mp, pp] = await Promise.all([
            getPortrait(user.id),
            selfCouple ? getPortrait(user.id) : getPortrait(partnerId),
          ]);
          if (mp) setMyPortrait(mp as unknown as IndividualPortrait);
          if (pp) setPartnerPortrait(pp as unknown as IndividualPortrait);
        } catch {}
      }

      // Load dyadic scores
      try {
        const [rdas, dci, csi16] = await Promise.all([
          getLatestDyadicScores(myCouple.id, 'rdas'),
          getLatestDyadicScores(myCouple.id, 'dci'),
          getLatestDyadicScores(myCouple.id, 'csi-16'),
        ]);
        setDyadicScores({ rdas, dci, csi16 });
      } catch {
        setDyadicScores(null);
      }

      // Load WEARE profile + weekly check-in
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
    } catch (e) {
      console.error('[CouplePortal] Error loading:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  // Generate deep portrait when we have the data
  const generateDeep = useCallback(() => {
    if (!couple || !myPortrait || !partnerPortrait) return null;

    const isPartnerA = couple.partner_a_id === user?.id;
    const pA = isPartnerA ? myPortrait : partnerPortrait;
    const pB = isPartnerA ? partnerPortrait : myPortrait;

    const selfCouple = isSelfCouple(couple);
    const pAName = isPartnerA
      ? 'You'
      : (partnerProfile?.display_name || (selfCouple ? 'Demo Partner' : 'Your partner'));
    const pBName = isPartnerA
      ? (partnerProfile?.display_name || (selfCouple ? 'Demo Partner' : 'Your partner'))
      : 'You';

    const dScores: any = {};
    if (dyadicScores?.rdas.partnerA && dyadicScores?.rdas.partnerB) dScores.rdas = dyadicScores.rdas;
    if (dyadicScores?.dci.partnerA && dyadicScores?.dci.partnerB) dScores.dci = dyadicScores.dci;
    if (dyadicScores?.csi16.partnerA && dyadicScores?.csi16.partnerB) dScores.csi16 = dyadicScores.csi16;

    try {
      return generateDeepCouplePortrait(
        couple.id,
        pA,
        pB,
        pAName,
        pBName,
        dScores,
        weareProfile,
      );
    } catch (e) {
      console.error('[CouplePortal] Deep portrait generation error:', e);
      return null;
    }
  }, [couple, myPortrait, partnerPortrait, dyadicScores, weareProfile, user, partnerProfile]);

  // Compute deep portrait
  const dp = deepPortrait || (myPortrait && partnerPortrait ? generateDeep() : null);

  // ─── Loading State ───────────────────────────────────

  if (loading || generating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
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
          >
            <Text style={styles.backText}>{'\u2190'} Back to Partner</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const partnerName = partnerProfile?.display_name || (couple && isSelfCouple(couple) ? 'Demo Partner' : 'Your partner');

  // ─── Tab Content Renderers ─────────────────────────────

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Twin Orbs + Field */}
      {dp && (
        <TwinOrbsField
          field={dp.relationalField}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
        />
      )}

      {/* Narrative Opening */}
      {dp && (
        <View style={styles.narrativeCard}>
          <Text style={styles.narrativeOpening}>{dp.narrative.opening}</Text>
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
      >
        <Text style={styles.coachTitle}>Talk to Your Couple Coach</Text>
        <Text style={styles.coachDesc}>
          Your AI guide now understands both of your portraits and your relationship
          patterns.
        </Text>
        <Text style={styles.coachCta}>Start Conversation {'\u2192'}</Text>
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

  const renderInsights = () => {
    if (!dp) return <Text style={styles.noDataText}>Deep portrait data is being generated...</Text>;

    return (
      <View style={styles.tabContent}>
        {/* Full Narrative */}
        <Text style={styles.sectionTitle}>Your Story</Text>
        <CoupleNarrativeBlock
          narrative={dp.narrative}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
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
        >
          <View style={styles.journeyHeader}>
            <SeedlingIcon size={22} color={Colors.primary} />
            <Text style={styles.journeyTitle}>Continue Your Healing Journey</Text>
          </View>
          <Text style={styles.journeyDesc}>
            Twelve steps of relational growth — practices, reflections, and milestones
            designed around your unique patterns.
          </Text>
          <Text style={styles.journeyCta}>View Journey {'\u2192'}</Text>
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
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'dance': return renderDance();
      case 'together': return renderTogether();
      case 'insights': return renderInsights();
      case 'growth': return renderGrowth();
      case 'anchors': return renderAnchors();
    }
  };

  // ─── Main Render ─────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>The Space Between You</Text>
        <Text style={styles.subtitle}>
          A living portrait of how you and {partnerName} move through the world together
        </Text>

        {/* Sharing Info */}
        {partnerSharedAssessments.length > 0 && (
          <View style={styles.sharingCard}>
            <Text style={styles.sharingLabel}>SHARED WITH YOU</Text>
            <Text style={styles.sharingText}>
              {partnerName} is sharing {partnerSharedAssessments.length} of 6 individual assessments with you.
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
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab Content */}
        {renderTabContent()}

        <View style={{ height: 40 }} />
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
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  narrativeOpening: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
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
});
