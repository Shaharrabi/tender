/**
 * Couple Portal Screen — "The Space Between You"
 *
 * Deep Couple Portrait with 6 tabs:
 * 1. Overview — Twin Orbs, narrative opening, quick stats
 * 2. Your Pattern — Combined cycle, exit points, repair pathway + Anchors
 * 3. Connection Map — Dual radar, convergence/divergence + Our Matrix
 * 4. Insights — Dyadic synthesis, discrepancies + Assessments
 * 5. Growth — Couple growth edges, practices
 * 6. Field — Relational field
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
  Alert,
  Animated,
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
import { getPortrait, checkCanGeneratePortrait, fetchAllScores, fetchSharedScores, extractSupplementScores, savePortrait } from '@/services/portrait';
import { generatePortrait, isPortraitStale } from '@/utils/portrait/portrait-generator';
import { generateRelationshipPortrait } from '@/utils/portrait/relationship-portrait-generator';
import { generateDeepCouplePortrait } from '@/utils/portrait/couple-portrait-generator';
import {
  classifyAttachmentCategory,
  generateCoupleOpeningParagraph,
  generateSharedStrengthNarrative,
  generateCoupleOneThingSentence,
  generateConflictInteraction,
} from '@/utils/portrait/couple-narrative';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
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
  RefreshIcon,
  BookOpenIcon,
  SettingsIcon,
} from '@/assets/graphics/icons';
import QuickLinksBar from '@/components/QuickLinksBar';
import { useScrollHideBar } from '@/hooks/useScrollHideBar';
import ReAnimated from 'react-native-reanimated';
import TenderText from '@/components/ui/TenderText';
import type { IconComponent } from '@/constants/icons';
import type { Couple, UserProfile, RelationshipPortrait, DeepCouplePortrait } from '@/types/couples';
import type { IndividualPortrait } from '@/types/portrait';
import type { WEAREProfile, WeeklyCheckIn } from '@/types/weare';
import { getLatestWEAREProfile, getThisWeeksCheckIn, saveWeeklyCheckIn } from '@/services/weare';
import { supabase } from '@/services/supabase';
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
import OurFieldTab from '@/components/couple-portrait/OurFieldTab';
import { generateOverviewSnapshot } from '@/utils/portrait/overview-snapshot';
import CouplePortalErrorBoundary from '@/components/CouplePortalErrorBoundary';
import { TonightTryThis, ConversationPrompts, AnchorSOSButton } from '@/components/couple-enhancements/CoupleEnhancements';
import { ScoreViewToggle } from '@/components/portrait-enhancements/ScoreStoryToggle';
import SectionSummaryHeader from '@/components/portrait-enhancements/SectionSummaryHeader';
import AudioLibrary from '@/components/audio/AudioLibrary';
import ResetLibrary from '@/components/emergency/ResetLibrary';
import CoupleMatrix from '@/components/matrix/CoupleMatrix';
import CoursesTab from '@/components/courses/CoursesTab';
import { HourglassIcon } from '@/assets/graphics/icons';
import {
  IllustrationPairing01,
  IllustrationPairing06,
  IllustrationPairing10,
  IllustrationPortalConflict,
  IllustrationPortalSnapshot,
  IllustrationPortalHero,
  IllustrationF20CoRegulate,
  IllustrationAttachSecure,
} from '@/assets/graphics/illustrations';

type TabKey = 'overview' | 'pattern' | 'connection' | 'insights' | 'growth' | 'field' | 'courses';

interface CoupleTabDef {
  key: TabKey;
  label: string;
  Icon: IconComponent;
  color: string;
}

const TABS: CoupleTabDef[] = [
  { key: 'overview',    label: 'Overview',        Icon: HeartPulseIcon, color: Colors.couplePartnerA },
  { key: 'pattern',     label: 'Your Pattern',    Icon: LightningIcon,  color: Colors.couplePartnerB },
  { key: 'connection',  label: 'Connection Map',  Icon: LinkIcon,       color: Colors.calm },
  { key: 'insights',    label: 'Insights',        Icon: SparkleIcon,    color: Colors.accent },
  { key: 'growth',      label: 'Growth',          Icon: SeedlingIcon,   color: Colors.warning },
  { key: 'field',       label: 'Field',           Icon: SparkleIcon,    color: Colors.accentGold },
  { key: 'courses',     label: 'Courses',         Icon: BookOpenIcon,   color: Colors.calm },
];

export default function CouplePortalScreenWithBoundary() {
  return (
    <CouplePortalErrorBoundary>
      <CouplePortalScreen />
    </CouplePortalErrorBoundary>
  );
}

/**
 * Swap the current user's real name → "You" in the deep portrait for display.
 * The cached portrait uses real names so it's viewer-independent; we localise
 * at render time.
 */
function localiseNamesForViewer(
  dp: DeepCouplePortrait,
  myRealName: string,
): DeepCouplePortrait {
  if (!myRealName || myRealName === 'You') return dp;

  // Deep-clone so we don't mutate the cache
  const clone: DeepCouplePortrait = JSON.parse(JSON.stringify(dp));

  // Determine if viewer is partner B — if so, swap ALL partner-specific data first
  const viewerIsB = clone.partnerBName?.toLowerCase() === myRealName.toLowerCase();

  if (viewerIsB) {
    // ── Swap partner names ──
    const tmpName = clone.partnerAName;
    clone.partnerAName = clone.partnerBName;
    clone.partnerBName = tmpName;

    // ── Swap pattern interlock data ──
    if (clone.patternInterlock) {
      const pi = clone.patternInterlock;
      if (pi.combinedCycle) {
        const tmpPos = pi.combinedCycle.partnerAPosition;
        pi.combinedCycle.partnerAPosition = pi.combinedCycle.partnerBPosition;
        pi.combinedCycle.partnerBPosition = tmpPos;
        // Swap exit points partner labels
        if (pi.combinedCycle.exitPoints) {
          pi.combinedCycle.exitPoints.forEach((ep: any) => {
            if (ep.partnerA && ep.partnerB) {
              const tmpEp = ep.partnerA;
              ep.partnerA = ep.partnerB;
              ep.partnerB = tmpEp;
            }
          });
        }
      }
      if (pi.attachmentDynamic) {
        const ad = pi.attachmentDynamic;
        // Swap anxiety/avoidance scores
        let tmp = ad.partnerAAnxiety; ad.partnerAAnxiety = ad.partnerBAnxiety; ad.partnerBAnxiety = tmp;
        tmp = ad.partnerAAvoidance; ad.partnerAAvoidance = ad.partnerBAvoidance; ad.partnerBAvoidance = tmp;
        tmp = ad.partnerASecureDistance; ad.partnerASecureDistance = ad.partnerBSecureDistance; ad.partnerBSecureDistance = tmp;
        const tmpQ = ad.partnerAQuadrant; ad.partnerAQuadrant = ad.partnerBQuadrant; ad.partnerBQuadrant = tmpQ;
      }
    }

    // ── Swap convergence/divergence data ──
    if (clone.convergenceDivergence) {
      const cd = clone.convergenceDivergence;
      if (cd.radarOverlap) {
        cd.radarOverlap.forEach((r: any) => {
          const tmpS = r.partnerAScore; r.partnerAScore = r.partnerBScore; r.partnerBScore = tmpS;
        });
      }
      if (cd.frictionZones) {
        cd.frictionZones.forEach((fz: any) => {
          if (fz.partnerAPull && fz.partnerBPull) {
            const tmpP = fz.partnerAPull; fz.partnerAPull = fz.partnerBPull; fz.partnerBPull = tmpP;
          }
        });
      }
      if (cd.valuesTensions) {
        cd.valuesTensions.forEach((vt: any) => {
          if (vt.partnerAImportance !== undefined && vt.partnerBImportance !== undefined) {
            const tmpI = vt.partnerAImportance; vt.partnerAImportance = vt.partnerBImportance; vt.partnerBImportance = tmpI;
          }
        });
      }
    }

    // ── Swap couple growth edges ──
    if (clone.coupleGrowthEdges) {
      clone.coupleGrowthEdges.forEach((edge: any) => {
        if (edge.partnerAPart && edge.partnerBPart) {
          const tmpPart = edge.partnerAPart; edge.partnerAPart = edge.partnerBPart; edge.partnerBPart = tmpPart;
        }
        if (edge.who === 'partnerA') edge.who = 'partnerB';
        else if (edge.who === 'partnerB') edge.who = 'partnerA';
      });
    }

    // ── Swap couple anchors ──
    if (clone.coupleAnchors) {
      const tmpAnchors = clone.coupleAnchors.forPartnerA;
      clone.coupleAnchors.forPartnerA = clone.coupleAnchors.forPartnerB;
      clone.coupleAnchors.forPartnerB = tmpAnchors;
    }
  }

  // Now replace the viewer's real name with "You" throughout all string values
  // (after swapping, partnerAName is the viewer's name)
  const nameToReplace = viewerIsB ? myRealName : myRealName;
  const nameRegex = new RegExp(nameToReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const replaceInObj = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(nameRegex, 'You');
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item: any, i: number) => {
          if (typeof item === 'string') {
            obj[key][i] = item.replace(nameRegex, 'You');
          } else {
            replaceInObj(item);
          }
        });
      } else if (typeof obj[key] === 'object') {
        replaceInObj(obj[key]);
      }
    }
  };

  // Set the viewer's name label to "You"
  clone.partnerAName = 'You';

  // Swap in narrative text
  replaceInObj(clone.narrative);
  replaceInObj(clone.coupleAnchors);
  replaceInObj(clone.patternInterlock);
  replaceInObj(clone.convergenceDivergence);
  replaceInObj(clone.coupleGrowthEdges);
  replaceInObj(clone.dyadicInsights);
  if (clone.relationalField) replaceInObj(clone.relationalField);

  return clone;
}

function CouplePortalScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { handleScroll: handleScrollBar, animatedStyle: quickLinksAnimStyle, BAR_HEIGHT: barH } = useScrollHideBar();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
  const [portrait, setPortrait] = useState<RelationshipPortrait | null>(null);
  const [deepPortrait, setDeepPortrait] = useState<DeepCouplePortrait | null>(null);
  const [portraitError, setPortraitError] = useState<string | null>(null);
  const [partnerSharedAssessments, setPartnerSharedAssessments] = useState<string[]>([]);

  // Tab state — shows one section at a time, like personal portrait
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const scrollRef = useRef<ScrollView>(null);

  const handleTabChange = useCallback((key: TabKey) => {
    setActiveTab(key);
    // Scroll to top when switching tabs
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  // Individual portraits (needed for deep portrait gen)
  const [myPortrait, setMyPortrait] = useState<IndividualPortrait | null>(null);
  const [partnerPortrait, setPartnerPortrait] = useState<IndividualPortrait | null>(null);
  const [partnerPortraitStale, setPartnerPortraitStale] = useState(false);

  // Partner journey progress
  const [partnerStepData, setPartnerStepData] = useState<{
    currentStep: number;
    completedSteps: number;
    totalPractices: number;
  } | null>(null);

  // Dyadic scores
  const [dyadicScores, setDyadicScores] = useState<{
    rdas: { partnerA: any | null; partnerB: any | null };
    dci: { partnerA: any | null; partnerB: any | null };
    csi16: { partnerA: any | null; partnerB: any | null };
  } | null>(null);

  // Raw individual scores for CoupleMatrix
  const [myRawScores, setMyRawScores] = useState<Record<string, { id: string; scores: any }> | null>(null);
  const [partnerRawScores, setPartnerRawScores] = useState<Record<string, { id: string; scores: any }> | null>(null);

  // WEARE state
  const [weareProfile, setWeareProfile] = useState<WEAREProfile | null>(null);
  const [weeklyCheckIn, setWeeklyCheckIn] = useState<WeeklyCheckIn | null>(null);
  const [assessViewMode, setAssessViewMode] = useState<'numbers' | 'story'>('numbers');
  const [showCheckInCelebration, setShowCheckInCelebration] = useState(false);
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const checkInCardRef = useRef<View>(null);

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

      // ─── 0.5. Load partner step progress ────────────────
      try {
        const { data: partnerSteps } = await supabase
          .from('step_progress')
          .select('step_number, status')
          .eq('user_id', partnerId);
        if (partnerSteps && partnerSteps.length > 0) {
          const completed = partnerSteps.filter((s: any) => s.status === 'completed').length;
          const active = partnerSteps.find((s: any) => s.status === 'active');
          const currentStep = active?.step_number ?? (completed > 0 ? Math.max(...partnerSteps.filter((s: any) => s.status === 'completed').map((s: any) => s.step_number)) : 1);
          // Count partner's practice completions
          const { count: practiceCount } = await supabase
            .from('practice_completions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', partnerId);
          setPartnerStepData({
            currentStep,
            completedSteps: completed,
            totalPractices: practiceCount ?? 0,
          });
        }
      } catch (e) {
        console.warn('[CouplePortal] Could not load partner step progress:', e);
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
            ipip: latestScoresMap['tender-personality-60'].scores,
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
          setPartnerPortraitStale(true);
        } else {
          setPartnerPortraitStale(false);
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

      // ─── 1b. Load Raw Individual Scores for Our Matrix ──
      // Only load partner scores that they have explicitly shared (privacy/consent)
      try {
        const sharedTypes = partner ? await getPartnerSharedAssessments(partnerId, myCouple.id) : [];
        const [myScoresMap, partnerScoresMap] = await Promise.all([
          fetchAllScores(user.id).catch(() => null),
          selfCouple ? Promise.resolve(null) : fetchSharedScores(partnerId, sharedTypes).catch(() => null),
        ]);
        if (myScoresMap) setMyRawScores(myScoresMap);
        if (partnerScoresMap) setPartnerRawScores(partnerScoresMap);
        else if (selfCouple && myScoresMap) setPartnerRawScores(myScoresMap);
      } catch (rawErr) {
        console.warn('[CouplePortal] Raw scores fetch failed (non-critical):', rawErr);
      }

      // ─── 2. Load/Generate Relationship Portrait ──────────
      let rp = await getRelationshipPortrait(myCouple.id);
      console.log('[CouplePortal] Relationship portrait from DB:', !!rp);

      // Detect if individual portraits have changed since last relationship portrait generation.
      // Compares both portrait IDs AND updated_at timestamps (upsert keeps same row ID).
      let partnerPortraitChanged = false;
      if (rp && (mp || pp) && !selfCouple) {
        const rpData = rp as any;
        const rpUpdatedAt = rpData.updated_at ? new Date(rpData.updated_at).getTime() : 0;

        // Check if either individual portrait was updated AFTER the relationship portrait
        const mpTyped = mp as unknown as IndividualPortrait;
        const ppTyped = pp as unknown as IndividualPortrait;
        const myUpdatedAt = mpTyped?.updatedAt
          ? new Date(mpTyped.updatedAt).getTime() : 0;
        const partnerUpdatedAt = ppTyped?.updatedAt
          ? new Date(ppTyped.updatedAt).getTime() : 0;

        if (myUpdatedAt > rpUpdatedAt) {
          partnerPortraitChanged = true;
          console.log('[CouplePortal] My portrait updated after relationship portrait — will regenerate');
        }
        if (partnerUpdatedAt > rpUpdatedAt) {
          partnerPortraitChanged = true;
          console.log('[CouplePortal] Partner portrait updated after relationship portrait — will regenerate');
        }

        // Also check portrait IDs as fallback
        if (!partnerPortraitChanged) {
          const isPartnerA = myCouple.partner_a_id === user.id;
          const savedPartnerPortraitId = isPartnerA
            ? rpData.partner_b_portrait_id
            : rpData.partner_a_portrait_id;
          const currentPartnerPortraitId = (pp as any)?.id;
          if (savedPartnerPortraitId && currentPartnerPortraitId && savedPartnerPortraitId !== currentPartnerPortraitId) {
            partnerPortraitChanged = true;
            console.log('[CouplePortal] Partner portrait ID changed — will regenerate relationship portrait');
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

          // Use REAL names (not "You") for generation & caching so the cached
          // portrait is correct regardless of which partner loads it later.
          const partnerDisplayName = partner?.display_name || (selfCouple ? 'Demo Partner' : 'Your partner');
          let myDisplayName = 'You';
          try {
            const { data: myProfile } = await supabase
              .from('user_profiles')
              .select('display_name')
              .eq('user_id', user.id)
              .maybeSingle();
            if (myProfile?.display_name) myDisplayName = myProfile.display_name;
          } catch { /* fallback to 'You' */ }

          // pAName/pBName now use real names for the generation/cache
          const pAName = isPartnerA ? myDisplayName : partnerDisplayName;
          const pBName = isPartnerA ? partnerDisplayName : myDisplayName;

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
          // Invalidate cache if it has "You" baked in (old bug: name not viewer-independent)
          if (cachedDp && (cachedDp.partnerAName === 'You' || cachedDp.partnerBName === 'You')) {
            console.log('[CouplePortal] Cached portrait has "You" baked in — regenerating with real names');
            cachedDp = null;
          }
          if (cachedDp && !needsDeepRegen) {
            console.log('[CouplePortal] Loaded deep portrait from DB cache');
            setDeepPortrait(localiseNamesForViewer(cachedDp, myDisplayName));
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
            // Display with "You" for current viewer
            setDeepPortrait(localiseNamesForViewer(dp, myDisplayName));

            // Persist with REAL names (not "You") so both partners see correct data
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

  // ─── Celebration animation ────────────────────────────
  useEffect(() => {
    if (showCheckInCelebration) {
      celebrationOpacity.setValue(0);
      Animated.sequence([
        Animated.timing(celebrationOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(2500),
        Animated.timing(celebrationOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start(() => setShowCheckInCelebration(false));
    }
  }, [showCheckInCelebration]);

  // ─── Next Monday helper ───────────────────────────────
  function getNextMonday(): string {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday
    const daysUntilMonday = day === 0 ? 1 : 8 - day;
    const next = new Date(today);
    next.setDate(today.getDate() + daysUntilMonday);
    return next.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  // Deep portrait is generated during loadData and stored in state
  const dp = deepPortrait;

  // ─── Loading State ───────────────────────────────────

  if (loading || generating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} accessibilityLabel="Loading" />
          <TenderText variant="body" color={Colors.textSecondary} align="center" style={styles.loadingText}>
            {generating ? 'Weaving your shared portrait...' : 'Loading the space between you...'}
          </TenderText>
        </View>
      </SafeAreaView>
    );
  }

  if (!portrait) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <TenderText variant="headingXL" style={styles.heading}>Your Couple Portal</TenderText>
          {portraitError ? (
            <>
              <TenderText variant="body" color={Colors.textSecondary} style={styles.subtitle}>{portraitError}</TenderText>
              <TouchableOpacity
                onPress={() => { setPortrait(null); setPortraitError(null); loadData(); }}
                style={styles.retryBtn}
                accessibilityRole="button"
                accessibilityLabel="Try loading your couple portrait again"
              >
                <TenderText variant="body" color={Colors.secondary}>Try Again</TenderText>
              </TouchableOpacity>
            </>
          ) : (
            <TenderText variant="body" color={Colors.textSecondary} style={styles.subtitle}>
              To build your shared portrait, each partner needs to complete their
              6 individual assessments first.
            </TenderText>
          )}
          <TouchableOpacity
            onPress={() => router.replace('/(app)/partner')}
            style={styles.backBtnCenter}
            accessibilityRole="button"
            accessibilityLabel="Return to partner screen"
          >
            <View style={styles.backRow}>
              <ArrowLeftIcon size={16} color={Colors.primary} />
              <TenderText variant="body" color={Colors.primary}>Back to Partner</TenderText>
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
      {/* Hero illustration */}
      <View style={{ alignItems: 'center', marginBottom: Spacing.md }}>
        <IllustrationPortalHero width={Math.min(Dimensions.get('window').width - 32, 380)} animated />
      </View>

      {/* How the couple portal works */}
      <View style={styles.assessmentExplainerCard}>
        <TenderText variant="label" style={styles.assessmentExplainerTitle}>
          How This Works
        </TenderText>
        <TenderText variant="bodySmall" color={Colors.textSecondary} style={styles.assessmentExplainerBody}>
          Your couple portrait is built from both partners' individual assessments — the same 6 sections you each completed on your own. Tender reads across all your domains to find what happens when your patterns meet.
        </TenderText>
        <TenderText variant="bodySmall" color={Colors.textSecondary} style={styles.assessmentExplainerBody}>
          The three couple assessments are optional. They add texture — relationship satisfaction, stress coping, and how you navigate conflict as a pair — but they're not required for your portrait.
        </TenderText>
        <TenderText variant="bodySmall" color={Colors.textMuted} style={styles.assessmentExplainerNote}>
          ✦ Each tab below explores a different layer of your relationship{'\n'}
          ✦ Courses and practices deepen your growth together{'\n'}
          ✦ Your portrait updates as you both grow
        </TenderText>
        <TouchableOpacity
          style={styles.assessmentExplainerLink}
          onPress={() => router.push('/(app)/partner' as any)}
          activeOpacity={0.7}
        >
          <TenderText variant="bodySmall" color={Colors.primary} style={{ textAlign: 'center' }}>
            Take couple assessments to enrich your portrait →
          </TenderText>
        </TouchableOpacity>
      </View>

      {/* Stale partner portrait nudge */}
      {partnerPortraitStale && (
        <View style={styles.staleBanner}>
          <RefreshIcon size={14} color={Colors.accentGold} />
          <TenderText variant="bodySmall" color={Colors.textSecondary} style={{ flex: 1 }}>
            {partnerName}'s portrait was built with an earlier version. Their insights still work — they'll get even richer once they regenerate from their device.
          </TenderText>
        </View>
      )}

      {/* Partner Journey Progress */}
      {partnerStepData && (
        <View style={{
          backgroundColor: Colors.surface,
          borderRadius: BorderRadius.lg,
          padding: Spacing.md,
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: Colors.borderLight,
        }}>
          <TenderText variant="label" color={Colors.primary} style={{ letterSpacing: 1.5, fontSize: FontSizes.micro, marginBottom: Spacing.xs }}>
            {partnerName?.toUpperCase()}'S JOURNEY
          </TenderText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <TenderText variant="headingM" color={Colors.text}>{partnerStepData.currentStep}</TenderText>
              <TenderText variant="caption" color={Colors.textMuted}>Current Step</TenderText>
            </View>
            <View style={{ width: 1, height: 30, backgroundColor: Colors.borderLight }} />
            <View style={{ alignItems: 'center', flex: 1 }}>
              <TenderText variant="headingM" color={Colors.text}>{partnerStepData.completedSteps}</TenderText>
              <TenderText variant="caption" color={Colors.textMuted}>Steps Done</TenderText>
            </View>
            <View style={{ width: 1, height: 30, backgroundColor: Colors.borderLight }} />
            <View style={{ alignItems: 'center', flex: 1 }}>
              <TenderText variant="headingM" color={Colors.text}>{partnerStepData.totalPractices}</TenderText>
              <TenderText variant="caption" color={Colors.textMuted}>Practices</TenderText>
            </View>
          </View>
          {/* Step progress bar */}
          <View style={{ flexDirection: 'row', gap: 2, height: 6, borderRadius: 3, overflow: 'hidden' }}>
            {Array.from({ length: 12 }, (_, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: i < partnerStepData.completedSteps
                    ? Colors.primary
                    : i === partnerStepData.currentStep - 1
                      ? Colors.primary + '60'
                      : Colors.progressTrack,
                  borderRadius: 3,
                }}
              />
            ))}
          </View>
          <TenderText variant="caption" color={Colors.textMuted} style={{ marginTop: Spacing.xs, textAlign: 'center' }}>
            {partnerStepData.completedSteps === 0
              ? `${partnerName} is just getting started`
              : partnerStepData.completedSteps >= 10
                ? `${partnerName} is in the home stretch`
                : `${partnerName} is putting in the work`}
          </TenderText>
        </View>
      )}

      {/* 60-second digest */}
      {dp && (() => {
        const digest = generateCoupleDigest();
        if (!digest) return null;
        return (
          <View style={styles.digestCard}>
            <View style={styles.digestHeader}>
              <HourglassIcon size={14} color={Colors.accent} />
              <TenderText variant="label" color={Colors.accent} style={{ letterSpacing: 1.5, fontSize: FontSizes.micro }}>
                YOUR RELATIONSHIP IN 60 SECONDS
              </TenderText>
            </View>
            <TenderText variant="body" color={Colors.textSecondary} style={{ lineHeight: 24 }}>
              {digest}
            </TenderText>
          </View>
        );
      })()}

      {/* Couple Integrated Map — cross-assessment overview */}
      {dp && myRawScores && partnerRawScores && (() => {
        const toScores = (raw: Record<string, { id: string; scores: any }>) => ({
          ecrr: raw?.['ecr-r']?.scores,
          ipip: raw?.['tender-personality-60']?.scores,
          sseit: raw?.['sseit']?.scores,
          dsir: raw?.['dsi-r']?.scores,
          dutch: raw?.['dutch']?.scores,
          values: raw?.['values']?.scores,
        });
        const nameA = dp.partnerAName || 'You';
        const nameB = dp.partnerBName || partnerName || 'Partner';
        const weare = weareProfile ? {
          resonance: weareProfile.layers?.resonancePulse,
          emergenceDirection: weareProfile.layers?.emergenceDirection,
          bottleneck: (weareProfile.bottleneck as unknown as string) ?? null,
          movementPhase: weareProfile.movementPhase as string,
        } : undefined;
        return (
          <View style={{ marginTop: Spacing.md }}>
            <CoupleMatrix
              partner1={toScores(myRawScores)}
              partner2={toScores(partnerRawScores)}
              partner1Name={nameA}
              partner2Name={nameB}
              weareData={weare}
              dyadicScores={dyadicScores}
            />
          </View>
        );
      })()}

      {/* Fallback: show what's missing when deep portrait can't generate */}
      {!dp && (
        <View style={styles.synthesisCard}>
          <TenderText variant="headingS" style={styles.synthesisTitle}>Your deep portrait needs more data</TenderText>
          <TenderText variant="body" color={Colors.textSecondary}>
            {!myPortrait && !partnerPortrait
              ? 'Both individual portraits are missing. Each partner needs to complete all 6 individual assessments (Attachment, Conflict, Emotional Intelligence, Differentiation, Personality, Values) and generate their portrait from the Home screen.'
              : !myPortrait
                ? 'Your individual portrait is missing. Complete all 6 assessments on the Home screen, then come back.'
                : !partnerPortrait
                  ? `${partnerName}'s individual portrait isn't available yet. They need to complete their 6 assessments and generate their portrait from the Home screen on their device. Once generated, it will appear here automatically.`
                  : portraitError || 'Something unexpected went wrong generating the deep portrait. Try tapping Refresh.'}
          </TenderText>
          <TouchableOpacity
            onPress={() => { setDeepPortrait(null); setPortrait(null); loadData(); }}
            style={styles.retryBtn}
            accessibilityRole="button"
            accessibilityLabel="Refresh your couple portrait data"
          >
            <TenderText variant="body" color={Colors.secondary}>Refresh</TenderText>
          </TouchableOpacity>
        </View>
      )}

      {/* The Space Between You — co-regulation illustration */}
      {dp && (
        <View style={{ alignItems: 'center', marginVertical: Spacing.md }}>
          <IllustrationF20CoRegulate width={Math.min(Dimensions.get('window').width - 48, 260)} animated />
        </View>
      )}

      {/* Literary Narrative Snapshot */}
      {dp && (
        <View style={styles.narrativeCard}>
          <TenderText variant="body" color={Colors.textSecondary} style={styles.narrativeSummary}>
            {(() => { try { return generateOverviewSnapshot(dp); } catch { return 'Your couple portrait is being prepared...'; } })()}
          </TenderText>
        </View>
      )}

      {/* Your Story Together — attachment-based couple narrative */}
      {myPortrait && partnerPortrait && (() => {
        const p1Style = classifyAttachmentCategory(myPortrait);
        const p2Style = classifyAttachmentCategory(partnerPortrait);
        const opening = generateCoupleOpeningParagraph(myPortrait, partnerPortrait);
        const oneThingSentence = generateCoupleOneThingSentence(p1Style, p2Style);
        return (
          <View style={styles.synthesisCard}>
            <View style={{ alignItems: 'center', marginBottom: Spacing.sm }}>
              <IllustrationPairing01 width={200} animated />
            </View>
            <TenderText variant="label" color={Colors.depth} style={{ letterSpacing: 1.5, marginBottom: Spacing.sm }}>YOUR STORY TOGETHER</TenderText>
            <TenderText variant="body" color={Colors.textSecondary} style={{ lineHeight: 24, marginBottom: Spacing.lg }}>
              {opening}
            </TenderText>
            <TenderText
              variant="headingS"
              color={Colors.primary}
              align="center"
              style={{ lineHeight: 26 }}
            >
              {oneThingSentence}
            </TenderText>
          </View>
        );
      })()}

      {/* How You Navigate Conflict — DUTCH interaction */}
      {myPortrait && partnerPortrait && dp && (() => {
        const cycleA = dp.patternInterlock.combinedCycle.partnerAPosition;
        const cycleB = dp.patternInterlock.combinedCycle.partnerBPosition;
        const dutchA = cycleA === 'pursuer' ? 'forcing' : cycleA === 'withdrawer' ? 'avoiding' : 'compromising';
        const dutchB = cycleB === 'pursuer' ? 'forcing' : cycleB === 'withdrawer' ? 'avoiding' : 'compromising';
        const conflict = generateConflictInteraction(dutchA, dutchB);
        return (
          <View style={styles.synthesisCard}>
            <TenderText variant="label" color={Colors.depth} style={{ letterSpacing: 1.5, marginBottom: Spacing.sm }}>HOW YOU NAVIGATE CONFLICT</TenderText>
            <TenderText variant="headingS" color={Colors.secondary} style={{ marginBottom: Spacing.sm }}>
              {conflict.type}
            </TenderText>
            <TenderText variant="body" color={Colors.textSecondary} style={{ lineHeight: 24, marginBottom: Spacing.lg }}>
              {conflict.narrative}
            </TenderText>
            <View style={{ backgroundColor: Colors.primaryFaded, borderRadius: 10, padding: Spacing.md }}>
              <TenderText variant="label" color={Colors.primary} style={{ marginBottom: 4 }}>TRY THIS</TenderText>
              <TenderText variant="body" color={Colors.textSecondary} style={{ lineHeight: 22 }}>
                {conflict.practice}
              </TenderText>
            </View>
          </View>
        );
      })()}

      {/* ─── Fallback content when deep portrait isn't available ─── */}
      {!dp && portrait && (
        <View style={styles.overviewInsights}>
          {portrait.combined_cycle && (
            <>
              <TenderText variant="headingS" style={styles.insightsHeading}>Your Relational Pattern</TenderText>
              <View style={styles.narrativeCard}>
                <TenderText variant="body" color={Colors.textSecondary} style={styles.narrativeSummary}>
                  {portrait.combined_cycle.cycleDescription}
                </TenderText>
              </View>
              {portrait.combined_cycle.triggers?.length > 0 && (
                <View style={styles.overviewInsightRow}>
                  <View style={{ flex: 1 }}>
                    <TenderText variant="label" style={styles.overviewInsightLabel}>Common Triggers</TenderText>
                    <TenderText variant="body" color={Colors.textSecondary}>
                      {portrait.combined_cycle.triggers.slice(0, 3).join(' • ')}
                    </TenderText>
                  </View>
                </View>
              )}
              {portrait.combined_cycle.deEscalationSteps?.length > 0 && (
                <View style={styles.overviewInsightRow}>
                  <View style={{ flex: 1 }}>
                    <TenderText variant="label" style={styles.overviewInsightLabel}>Steps Toward Each Other</TenderText>
                    <TenderText variant="body" color={Colors.textSecondary}>
                      {portrait.combined_cycle.deEscalationSteps.slice(0, 3).join(' • ')}
                    </TenderText>
                  </View>
                </View>
              )}
            </>
          )}

          {portrait.relationship_growth_edges?.length > 0 && (
            <>
              <TenderText variant="headingS" style={[styles.insightsHeading, { marginTop: Spacing.md }]}>Growth Edges</TenderText>
              {portrait.relationship_growth_edges.slice(0, 3).map((edge: any, i: number) => (
                <View key={i} style={styles.overviewInsightRow}>
                  <View style={{ flex: 1 }}>
                    <TenderText variant="label" style={styles.overviewInsightLabel}>{edge.title || edge.area}</TenderText>
                    <TenderText variant="body" color={Colors.textSecondary}>{edge.description}</TenderText>
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
            <TenderText variant="headingS" color={Colors.secondary} style={styles.quickStatValue}>{portrait.dyadic_scores.csi16.total}</TenderText>
            <TenderText variant="caption" color={Colors.textSecondary} style={styles.quickStatLabel}>Satisfaction</TenderText>
          </View>
          {portrait.dyadic_scores?.rdas && (
            <View style={styles.quickStat}>
              <TenderText variant="headingS" color={Colors.secondary} style={styles.quickStatValue}>{portrait.dyadic_scores.rdas.total}</TenderText>
              <TenderText variant="caption" color={Colors.textSecondary} style={styles.quickStatLabel}>Adjustment</TenderText>
            </View>
          )}
          {portrait.dyadic_scores?.dci && (
            <View style={styles.quickStat}>
              <TenderText variant="body" color={Colors.calm}>
                {portrait.dyadic_scores.dci.copingQuality}
              </TenderText>
              <TenderText variant="caption" color={Colors.textSecondary} style={styles.quickStatLabel}>Coping</TenderText>
            </View>
          )}
        </View>
      )}

      {/* ─── Key Insights Snapshot ─── */}
      {dp && (
        <View style={styles.overviewInsights}>
          <View style={{ alignItems: 'center', marginBottom: Spacing.sm }}>
            <IllustrationPortalSnapshot width={Math.min(Dimensions.get('window').width - 64, 320)} animated />
          </View>
          <TenderText variant="headingS" style={styles.insightsHeading}>Relationship Snapshot</TenderText>

          {/* Your Dance */}
          <View style={styles.overviewInsightRow}>
            <View style={styles.insightIconBadge}>
              <HeartPulseIcon size={14} color={Colors.couplePartnerA} />
            </View>
            <View style={{ flex: 1 }}>
              <TenderText variant="label" style={styles.overviewInsightLabel}>Your Dance</TenderText>
              <TenderText variant="body" color={Colors.textSecondary}>
                {dp.patternInterlock.combinedCycle.dynamic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — {dp.partnerAName} tends to {dp.patternInterlock.combinedCycle.partnerAPosition}, {dp.partnerBName} tends to {dp.patternInterlock.combinedCycle.partnerBPosition}
              </TenderText>
            </View>
          </View>

          {/* Attachment — mini matrix plot */}
          <View style={styles.overviewInsightRow}>
            <View style={styles.insightIconBadge}>
              <LinkIcon size={14} color={Colors.couplePartnerB} />
            </View>
            <View style={{ flex: 1 }}>
              <TenderText variant="label" style={styles.overviewInsightLabel}>Attachment Landscape</TenderText>
            </View>
          </View>
          <View style={styles.miniMatrixContainer}>
            <View style={{ alignItems: 'center', marginBottom: Spacing.xs }}>
              <IllustrationAttachSecure width={180} animated />
            </View>
            <TenderText variant="caption" color={Colors.textSecondary} align="center" style={styles.miniMatrixCaption}>
              {dp.patternInterlock.attachmentDynamic.dynamicLabel}
            </TenderText>
            <TenderText variant="bodySmall" color={Colors.textSecondary} align="center" style={{ marginTop: 4, lineHeight: 18 }}>
              {dp.patternInterlock.attachmentDynamic.narrative?.substring(0, 120)}...
            </TenderText>
          </View>

          {/* Shared Strengths */}
          {dp.convergenceDivergence.sharedStrengths.length > 0 && (
            <View style={styles.overviewInsightRow}>
              <View style={styles.insightIconBadge}>
                <SparkleIcon size={14} color={Colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <TenderText variant="label" style={styles.overviewInsightLabel}>Shared Strengths</TenderText>
                <TenderText variant="body" color={Colors.textSecondary}>
                  {dp.convergenceDivergence.sharedStrengths.slice(0, 3).map(s => s.dimensionLabel).join(', ')}
                </TenderText>
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
                <TenderText variant="label" style={styles.overviewInsightLabel}>Friction Zones</TenderText>
                <TenderText variant="body" color={Colors.textSecondary}>
                  {dp.convergenceDivergence.frictionZones.slice(0, 3).map(z => z.area).join(', ')}
                </TenderText>
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
                <TenderText variant="label" style={styles.overviewInsightLabel}>Growth Edge</TenderText>
                <TenderText variant="body" color={Colors.textSecondary}>
                  {dp.coupleGrowthEdges[0].title}
                </TenderText>
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
                <TenderText variant="label" style={styles.overviewInsightLabel}>Field Vitality</TenderText>
                <TenderText variant="body" color={Colors.textSecondary}>
                  {dp.relationalField.qualitativeLabel || `${Math.round(dp.relationalField.vitality)}%`}
                </TenderText>
              </View>
            </View>
          )}
        </View>
      )}

      {/* WEARE Check-In — hidden for demo/self-couple since it's meaningless */}
      {couple && weareProfile && !isSelfCouple(couple) && (
        <>
          {/* Reminder banner — shown when check-in not done this week */}
          {weeklyCheckIn === null && (
            <View style={styles.weareBanner}>
              <TenderText variant="body" color={Colors.calmDark} style={{ lineHeight: 20 }}>
                {'📊 Your weekly check-in feeds the WEARE engine — it\'s how your couple score updates. Takes 2 minutes.'}
              </TenderText>
            </View>
          )}

          {/* Celebration banner — shown briefly after submission */}
          {showCheckInCelebration && (
            <Animated.View style={[styles.weareCelebration, { opacity: celebrationOpacity }]}>
              <TenderText variant="body" color={Colors.successDark}>
                {'✓ Check-in saved — your WEARE score will update shortly.'}
              </TenderText>
            </Animated.View>
          )}

          <View ref={checkInCardRef}>
            <WeeklyCheckInCard
              existingCheckIn={weeklyCheckIn}
              onSubmit={async (stress, support, satisfaction, highlight) => {
                if (!user || !couple) return;
                const saved = await saveWeeklyCheckIn(
                  user.id, couple.id, stress, support, satisfaction, highlight
                );
                setWeeklyCheckIn(saved);
                setShowCheckInCelebration(true);
              }}
            />
          </View>

          {/* Next check-in date — shown after completing this week's check-in */}
          {weeklyCheckIn !== null && (
            <TenderText variant="caption" color={Colors.textMuted} align="center" style={{ marginTop: 6 }}>
              {`Next check-in: Monday, ${getNextMonday()}`}
            </TenderText>
          )}
        </>
      )}

      {/* Tonight, Try This — daily micro-action */}
      {dp && <TonightTryThis deepPortrait={dp} />}

      {/* Coach Entry */}
      <TouchableOpacity
        style={styles.coachCard}
        onPress={() => router.push({
          pathname: '/(app)/chat' as any,
          params: { coupleMode: 'true', coupleId: couple?.id || '' },
        })}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Start a conversation with your couple coach"
      >
        <View style={styles.journeyHeader}>
          <ChatBubbleIcon size={20} color={Colors.depth} />
          <TenderText variant="headingS" color={Colors.depth} style={styles.coachTitle}>Talk to Your Couple Coach</TenderText>
        </View>
        <TenderText variant="body" color={Colors.textSecondary} style={styles.coachDesc}>
          Your AI guide now understands both of your portraits and your relationship
          patterns.
        </TenderText>
        <View style={styles.ctaRow}>
          <TenderText variant="body" color={Colors.depth}>Start Conversation</TenderText>
          <ArrowRightIcon size={14} color={Colors.depth} />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderDance = () => {
    if (!dp) return <TenderText variant="body" color={Colors.textMuted} align="center" style={styles.noDataText}>Deep portrait data is being generated...</TenderText>;

    return (
      <View style={styles.tabContent}>
        {/* Conflict illustration */}
        <View style={{ alignItems: 'center', marginBottom: Spacing.md }}>
          <IllustrationPortalConflict width={240} animated />
        </View>

        {/* Combined Cycle */}
        <CombinedCycleVisualization
          cycle={dp.patternInterlock.combinedCycle}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
        />

        {/* Exit Points */}
        <TenderText variant="headingM" style={styles.sectionTitle}>Exit Points</TenderText>
        <TenderText variant="body" color={Colors.textSecondary} style={styles.sectionDesc}>
          Four moments where you can interrupt the cycle and choose differently.
        </TenderText>
        {dp.patternInterlock.combinedCycle.exitPoints.map((ep) => (
          <ExitPointCard
            key={ep.number}
            exitPoint={ep}
            partnerAName={dp.partnerAName}
            partnerBName={dp.partnerBName}
          />
        ))}

        {/* Repair Pathway */}
        <TenderText variant="headingM" style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Repair Pathway</TenderText>
        {dp.patternInterlock.combinedCycle.repairPathway.map((step) => (
          <View key={step.step} style={styles.repairStep}>
            <View style={styles.repairStepNumber}>
              <TenderText variant="caption" color={Colors.white} style={styles.repairStepNumberText}>{step.step}</TenderText>
            </View>
            <TenderText variant="body" color={Colors.textSecondary} style={styles.repairStepText}>{step.action}</TenderText>
          </View>
        ))}
      </View>
    );
  };

  const renderTogether = () => {
    if (!dp) return <TenderText variant="body" color={Colors.textMuted} align="center" style={styles.noDataText}>Deep portrait data is being generated...</TenderText>;

    return (
      <View style={styles.tabContent}>
        {/* Dual Radar Chart */}
        <TenderText variant="headingM" style={styles.sectionTitle}>Your Profiles Overlaid</TenderText>
        <DualRadarChart
          radarOverlap={dp.convergenceDivergence.radarOverlap}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
        />

        {/* Attachment Landscape — softened with illustration */}
        <TenderText variant="headingM" style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Attachment Landscape</TenderText>
        <View style={{ alignItems: 'center', marginBottom: Spacing.sm }}>
          <IllustrationAttachSecure width={160} animated />
        </View>
        <TenderText variant="headingS" color={Colors.couplePartnerB} align="center" style={{ marginBottom: Spacing.xs }}>
          {dp.patternInterlock.attachmentDynamic.dynamicLabel}
        </TenderText>
        <TenderText variant="body" color={Colors.textSecondary} style={styles.narrativeSmall}>
          {dp.patternInterlock.attachmentDynamic.narrative}
        </TenderText>

        {/* Shared Strengths — with richer narratives */}
        {dp.convergenceDivergence.sharedStrengths.length > 0 && (
          <>
            <View style={{ alignItems: 'center', marginTop: Spacing.lg, marginBottom: Spacing.sm }}>
              <IllustrationPairing06 width={200} animated />
            </View>
            <TenderText variant="headingM" style={styles.sectionTitle}>Shared Strengths</TenderText>
            {dp.convergenceDivergence.sharedStrengths.map((s, i) => {
              const richNarrative = generateSharedStrengthNarrative(s.dimensionLabel);
              return (
                <View key={i} style={styles.synthesisCard}>
                  <TenderText variant="headingS" color={Colors.success} style={{ marginBottom: Spacing.sm }}>
                    {s.dimensionLabel}
                  </TenderText>
                  <TenderText variant="body" color={Colors.textSecondary} style={{ lineHeight: 22 }}>
                    {richNarrative}
                  </TenderText>
                </View>
              );
            })}
          </>
        )}

        {/* Complementary Gifts */}
        {dp.convergenceDivergence.complementaryGifts.length > 0 && (
          <>
            <TenderText variant="headingM" style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Complementary Gifts</TenderText>
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
            <TenderText variant="headingM" style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Friction Zones</TenderText>
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
            <TenderText variant="headingM" style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Values Tensions</TenderText>
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
          <TenderText variant="body" color={Colors.textMuted} align="center" style={styles.noDataText}>
            Couple assessments haven't been completed yet.{'\n'}
            Go to the Assessment screen and choose a couple assessment to get started.
          </TenderText>
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
        <TenderText variant="body" style={assessStyles.compareLabel}>{label}</TenderText>
        <View style={assessStyles.compareValues}>
          <View style={assessStyles.partnerCol}>
            <TenderText variant="headingS" style={assessStyles.partnerScore}>{valueA != null ? valueA.toFixed(0) : '—'}</TenderText>
            <ScoreBar value={valueA ?? 0} max={max} color={color} />
          </View>
          <View style={assessStyles.partnerCol}>
            <TenderText variant="headingS" style={assessStyles.partnerScore}>{valueB != null ? valueB.toFixed(0) : '—'}</TenderText>
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
        <TenderText variant="body" style={assessStyles.assessTitle}>{title}</TenderText>
        <TenderText variant="caption" color={Colors.textMuted} style={assessStyles.assessSubtitle}>{subtitle}</TenderText>
        {/* Partner name headers */}
        <View style={assessStyles.partnerHeaders}>
          <View style={{ flex: 1 }} />
          <View style={assessStyles.compareValues}>
            <View style={assessStyles.partnerCol}>
              <TenderText variant="caption" color={Colors.couplePartnerA} align="center" style={assessStyles.partnerName}>{nameA}</TenderText>
            </View>
            <View style={assessStyles.partnerCol}>
              <TenderText variant="caption" color={Colors.couplePartnerB} align="center" style={assessStyles.partnerName}>{nameB}</TenderText>
            </View>
          </View>
        </View>
        {children}
      </View>
    );

    // ── Level badge ──
    const LevelBadge = ({ level, color }: { level: string; color: string }) => (
      <View style={[assessStyles.levelBadge, { backgroundColor: color + '18', borderColor: color }]}>
        <TenderText variant="caption" color={color} style={assessStyles.levelBadgeText}>{level}</TenderText>
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
          <TenderText variant="body" color={Colors.textMuted} align="center" style={styles.noDataText}>
            No couple assessment results yet.{'\n'}
            Complete a couple assessment together to see your results here.
          </TenderText>
        </View>
      );
    }

    // ── Narrative generation helpers ──
    const generateCSINarrative = (): string[] => {
      const paras: string[] = [];
      const scoreA = csi16.partnerA?.total;
      const scoreB = csi16.partnerB?.total;
      if (scoreA != null && scoreB != null) {
        const gap = Math.abs(scoreA - scoreB);
        const avg = (scoreA + scoreB) / 2;
        if (avg > 60) {
          paras.push(`Both of you report meaningful satisfaction in this relationship. ${nameA} scored ${scoreA} and ${nameB} scored ${scoreB} out of 81 \u2014 this tells us the emotional ground between you feels stable. That\u2019s not nothing. It\u2019s the foundation everything else builds on.`);
        } else if (avg > 45) {
          paras.push(`Your satisfaction sits in the moderate range \u2014 ${nameA} at ${scoreA} and ${nameB} at ${scoreB}. There\u2019s warmth here, and also room to deepen what\u2019s working. The question isn\u2019t whether your relationship is \u201Cgood enough\u201D \u2014 it\u2019s whether you\u2019re both getting what you need.`);
        } else {
          paras.push(`Satisfaction is running low right now \u2014 ${nameA} at ${scoreA}, ${nameB} at ${scoreB}. This isn\u2019t a verdict on your relationship. It\u2019s a signal that something needs attention \u2014 and the fact that you\u2019re both here looking at this together is already a step.`);
        }
        if (gap > 15) {
          paras.push(`There\u2019s a ${gap}-point gap between you. That means one partner may be experiencing something the other doesn\u2019t yet see. This gap itself is worth a conversation \u2014 not to assign blame, but to understand what each of you is carrying.`);
        } else if (gap > 5) {
          paras.push(`You\u2019re within ${gap} points of each other \u2014 close enough to share a general sense of how things are, even if the details feel different day to day.`);
        } else {
          paras.push(`You\u2019re remarkably aligned in how you experience satisfaction right now \u2014 that shared perception is a quiet strength.`);
        }
      } else if (scoreA != null || scoreB != null) {
        const who = scoreA != null ? nameA : nameB;
        const score = scoreA ?? scoreB;
        paras.push(`Only ${who} has completed this assessment so far (${score} out of 81). When both partners share their perspective, the comparison becomes a powerful conversation starter.`);
      }
      return paras;
    };

    const generateRDASNarrative = (): string[] => {
      const paras: string[] = [];
      const a = rdas.partnerA;
      const b = rdas.partnerB;
      if (a && b) {
        const avgTotal = ((a.total ?? 0) + (b.total ?? 0)) / 2;
        if (avgTotal > 52) {
          paras.push(`Your relationship adjustment is in a healthy range. ${nameA} scored ${a.total} and ${nameB} scored ${b.total} out of 69. This means you\u2019re generally aligned on the decisions, rhythms, and emotional temperature of your life together.`);
        } else if (avgTotal > 40) {
          paras.push(`Your adjustment scores suggest some areas of friction \u2014 ${nameA} at ${a.total}, ${nameB} at ${b.total}. This doesn\u2019t mean your relationship is broken. It means there are places where your expectations or experiences don\u2019t quite match yet.`);
        } else {
          paras.push(`The adjustment scores are in a range where daily life may feel harder than it should \u2014 ${nameA} at ${a.total}, ${nameB} at ${b.total}. When consensus, satisfaction, and togetherness all run low, even small moments can feel heavy. A couples therapist can help lighten that load.`);
        }
        // Sub-score narrative
        const conGap = Math.abs((a.consensus ?? 0) - (b.consensus ?? 0));
        const satGap = Math.abs((a.satisfaction ?? 0) - (b.satisfaction ?? 0));
        const cohGap = Math.abs((a.cohesion ?? 0) - (b.cohesion ?? 0));
        const biggest = Math.max(conGap, satGap, cohGap);
        if (biggest > 5) {
          const area = biggest === conGap ? 'consensus \u2014 how you make decisions and handle values' : biggest === satGap ? 'day-to-day satisfaction' : 'cohesion \u2014 how much shared life you experience';
          paras.push(`The biggest gap between you is in ${area}. That\u2019s a natural place to start a conversation. Not to fix, just to understand what each partner sees.`);
        }
      } else {
        const who = a ? nameA : nameB;
        paras.push(`Only ${who} has completed this assessment. This measure is most powerful when both partners share their experience side by side.`);
      }
      return paras;
    };

    const generateDCINarrative = (): string[] => {
      const paras: string[] = [];
      const a = dci.partnerA;
      const b = dci.partnerB;
      if (a && b) {
        const avgPositive = ((a.totalPositive ?? 0) + (b.totalPositive ?? 0)) / 2;
        if (avgPositive > 60) {
          paras.push(`You both show strong capacity to support each other through stress \u2014 ${nameA} at ${a.totalPositive}, ${nameB} at ${b.totalPositive}. When life gets hard, you lean toward each other rather than away. That\u2019s your couple\u2019s superpower.`);
        } else if (avgPositive > 40) {
          paras.push(`Your coping together has a solid foundation \u2014 ${nameA} at ${a.totalPositive}, ${nameB} at ${b.totalPositive} \u2014 with room to grow. The building blocks of support are there; it\u2019s about making them more consistent and more attuned.`);
        } else {
          paras.push(`Stress may be creating distance between you rather than bringing you closer \u2014 ${nameA} at ${a.totalPositive}, ${nameB} at ${b.totalPositive}. This is one of the most common and most fixable patterns in relationships. Learning to co-regulate changes everything.`);
        }
        // Highlight strongest and weakest areas
        const supportAvg = ((a.supportiveBySelf ?? 0) + (b.supportiveBySelf ?? 0)) / 2;
        const commAvg = ((a.stressCommunicationBySelf ?? 0) + (b.stressCommunicationBySelf ?? 0)) / 2;
        const negAvg = ((a.negativeBySelf ?? 0) + (b.negativeBySelf ?? 0)) / 2;
        if (negAvg > 12) {
          paras.push(`Your negative coping scores are elevated (${a.negativeBySelf ?? 0} and ${b.negativeBySelf ?? 0}). This often means stress brings out dismissiveness or criticism \u2014 not because you don\u2019t care, but because your nervous system is overwhelmed. This is the first place to intervene.`);
        } else if (supportAvg > 15) {
          paras.push(`Your supportive coping is a real asset. When one of you signals stress, the other tends to show up with genuine care. Protect this \u2014 it\u2019s rarer than you think.`);
        }
        if (commAvg < 10) {
          paras.push(`Stress communication could use attention. Neither partner is signaling stress very clearly, which means support may arrive late or not at all. A simple \u201CI\u2019m having a hard day\u201D can change the entire dynamic.`);
        }
      } else {
        const who = a ? nameA : nameB;
        paras.push(`Only ${who} has completed this assessment. This measure reveals its deepest insights when both partners share how they experience coping together.`);
      }
      return paras;
    };

    // ── Story mode narrative card renderer ──
    const NarrativeCard = ({ title, accentColor, paragraphs, children }: {
      title: string; accentColor: string; paragraphs: string[]; children?: React.ReactNode;
    }) => (
      <View style={[assessStyles.narrativeCard, { borderLeftColor: accentColor, borderLeftWidth: 3 }]}>
        <TenderText variant="headingS" color={Colors.text} style={{ marginBottom: Spacing.xs }}>{title}</TenderText>
        {paragraphs.map((p, i) => (
          <TenderText key={i} variant="body" color={Colors.textSecondary} style={assessStyles.narrativeParagraph}>
            {p}
          </TenderText>
        ))}
        {children}
      </View>
    );

    return (
      <View style={styles.tabContent}>
        <TenderText variant="headingM" style={styles.sectionTitle}>Your Couple Assessments</TenderText>
        <TenderText variant="body" color={Colors.textSecondary} style={styles.sectionDesc}>
          How you each experience the relationship — side by side. These aren't grades; they're
          a shared map of where you align and where attention is needed.
        </TenderText>

        <ScoreViewToggle mode={assessViewMode} onToggle={setAssessViewMode} />

        {assessViewMode === 'story' ? (
          <>
            {/* ── CSI-16 Narrative ── */}
            {(csi16.partnerA || csi16.partnerB) && (
              <>
                <NarrativeCard title="Relationship Satisfaction" accentColor={Colors.secondary} paragraphs={generateCSINarrative()} />
                <ConversationPrompts assessmentType="csi16" hasGap={Math.abs((csi16.partnerA?.total ?? 0) - (csi16.partnerB?.total ?? 0)) > 10} />
              </>
            )}
            {/* ── RDAS Narrative ── */}
            {(rdas.partnerA || rdas.partnerB) && (
              <>
                <NarrativeCard title="Relationship Adjustment" accentColor={Colors.secondary} paragraphs={generateRDASNarrative()} />
                <ConversationPrompts assessmentType="rdas" hasGap={Math.abs((rdas.partnerA?.total ?? 0) - (rdas.partnerB?.total ?? 0)) > 10} />
              </>
            )}
            {/* ── DCI Narrative ── */}
            {(dci.partnerA || dci.partnerB) && (
              <>
                <NarrativeCard title="How You Cope Together" accentColor={Colors.success} paragraphs={generateDCINarrative()} />
                <ConversationPrompts assessmentType="dci" hasGap={Math.abs((dci.partnerA?.totalPositive ?? 0) - (dci.partnerB?.totalPositive ?? 0)) > 15} />
              </>
            )}
          </>
        ) : (
          <>
            {/* ── CSI-16: Couple Satisfaction ── */}
            {(csi16.partnerA || csi16.partnerB) && (
              <>
              <AssessmentCard
                title="Couple Satisfaction"
                subtitle="How satisfied each partner feels in the relationship"
                accentColor={Colors.secondary}
              >
                <CompareRow
                  label="Total Score"
                  valueA={csi16.partnerA?.total ?? null}
                  valueB={csi16.partnerB?.total ?? null}
                  max={81}
                  color={Colors.secondary}
                />
                <View style={assessStyles.badgeRow}>
                  {csi16.partnerA?.satisfactionLevel && (
                    <LevelBadge level={csi16.partnerA.satisfactionLevel.charAt(0).toUpperCase() + csi16.partnerA.satisfactionLevel.slice(1)} color={csiInterpretation(csi16.partnerA.satisfactionLevel).color} />
                  )}
                  {csi16.partnerB?.satisfactionLevel && (
                    <LevelBadge level={csi16.partnerB.satisfactionLevel.charAt(0).toUpperCase() + csi16.partnerB.satisfactionLevel.slice(1)} color={csiInterpretation(csi16.partnerB.satisfactionLevel).color} />
                  )}
                </View>
                {(csi16.partnerA?.satisfactionLevel || csi16.partnerB?.satisfactionLevel) && (
                  <View style={assessStyles.interpretCard}>
                    <TenderText variant="label" style={assessStyles.interpretTitle}>What This Means</TenderText>
                    <TenderText variant="body" color={Colors.textSecondary}>
                      This measures overall relationship happiness on a 0–81 scale. Scores above 51.5 are considered non-distressed.
                      {csi16.partnerA?.satisfactionLevel && `\n\n${nameA}: ${csiInterpretation(csi16.partnerA.satisfactionLevel).text}`}
                      {csi16.partnerB?.satisfactionLevel && `\n\n${nameB}: ${csiInterpretation(csi16.partnerB.satisfactionLevel).text}`}
                    </TenderText>
                  </View>
                )}
              </AssessmentCard>
              <ConversationPrompts assessmentType="csi16" hasGap={Math.abs((csi16.partnerA?.total ?? 0) - (csi16.partnerB?.total ?? 0)) > 10} />
              </>
            )}

            {/* ── RDAS: Relationship Adjustment ── */}
            {(rdas.partnerA || rdas.partnerB) && (
              <>
              <AssessmentCard
                title="Relationship Adjustment"
                subtitle="Consensus, satisfaction, and cohesion in the relationship"
                accentColor={Colors.secondary}
              >
                <CompareRow label="Total Score" valueA={rdas.partnerA?.total ?? null} valueB={rdas.partnerB?.total ?? null} max={69} color={Colors.secondary} />
                <CompareRow label="Consensus" valueA={rdas.partnerA?.consensus ?? null} valueB={rdas.partnerB?.consensus ?? null} max={30} color={Colors.secondary} />
                <CompareRow label="Satisfaction" valueA={rdas.partnerA?.satisfaction ?? null} valueB={rdas.partnerB?.satisfaction ?? null} max={20} color={Colors.secondary} />
                <CompareRow label="Cohesion" valueA={rdas.partnerA?.cohesion ?? null} valueB={rdas.partnerB?.cohesion ?? null} max={20} color={Colors.success} />
                <View style={assessStyles.badgeRow}>
                  {rdas.partnerA?.distressLevel && (
                    <LevelBadge level={rdas.partnerA.distressLevel.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())} color={rdasInterpretation(rdas.partnerA.distressLevel).color} />
                  )}
                  {rdas.partnerB?.distressLevel && (
                    <LevelBadge level={rdas.partnerB.distressLevel.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())} color={rdasInterpretation(rdas.partnerB.distressLevel).color} />
                  )}
                </View>
                <View style={assessStyles.interpretCard}>
                  <TenderText variant="label" style={assessStyles.interpretTitle}>Understanding Your Scores</TenderText>
                  <TenderText variant="body" color={Colors.textSecondary}>
                    This measures relationship adjustment across three areas:{'\n\n'}
                    {'\u2022'} Consensus (0–30): How much you agree on important matters{'\n'}
                    {'\u2022'} Satisfaction (0–20): Day-to-day happiness and contentment{'\n'}
                    {'\u2022'} Cohesion (0–20): How much you share activities and quality time{'\n\n'}
                    Scores above 48 on the total generally indicate a non-distressed relationship.
                    {rdas.partnerA?.distressLevel && `\n\n${nameA}: ${rdasInterpretation(rdas.partnerA.distressLevel).text}`}
                    {rdas.partnerB?.distressLevel && `\n\n${nameB}: ${rdasInterpretation(rdas.partnerB.distressLevel).text}`}
                  </TenderText>
                </View>
              </AssessmentCard>
              <ConversationPrompts assessmentType="rdas" hasGap={Math.abs((rdas.partnerA?.total ?? 0) - (rdas.partnerB?.total ?? 0)) > 10} />
              </>
            )}

            {/* ── DCI: Dyadic Coping ── */}
            {(dci.partnerA || dci.partnerB) && (
              <>
              <AssessmentCard
                title="Dyadic Coping"
                subtitle="How you support each other through stress"
                accentColor={Colors.success}
              >
                <CompareRow label="Positive Coping (Total)" valueA={dci.partnerA?.totalPositive ?? null} valueB={dci.partnerB?.totalPositive ?? null} max={90} color={Colors.success} />
                <CompareRow label="Stress Communication" valueA={dci.partnerA?.stressCommunicationBySelf ?? null} valueB={dci.partnerB?.stressCommunicationBySelf ?? null} max={20} color={Colors.secondary} />
                <CompareRow label="Supportive Coping" valueA={dci.partnerA?.supportiveBySelf ?? null} valueB={dci.partnerB?.supportiveBySelf ?? null} max={25} color={Colors.success} />
                <CompareRow label="Delegated Coping" valueA={dci.partnerA?.delegatedBySelf ?? null} valueB={dci.partnerB?.delegatedBySelf ?? null} max={10} color={Colors.secondary} />
                <CompareRow label="Common Coping" valueA={dci.partnerA?.commonCoping ?? null} valueB={dci.partnerB?.commonCoping ?? null} max={25} color={Colors.warning} />
                <CompareRow label="Negative Coping" valueA={dci.partnerA?.negativeBySelf ?? null} valueB={dci.partnerB?.negativeBySelf ?? null} max={20} color={Colors.error} />
                <View style={assessStyles.badgeRow}>
                  {dci.partnerA?.copingQuality && (
                    <LevelBadge level={dci.partnerA.copingQuality.charAt(0).toUpperCase() + dci.partnerA.copingQuality.slice(1)} color={dciInterpretation(dci.partnerA.copingQuality).color} />
                  )}
                  {dci.partnerB?.copingQuality && (
                    <LevelBadge level={dci.partnerB.copingQuality.charAt(0).toUpperCase() + dci.partnerB.copingQuality.slice(1)} color={dciInterpretation(dci.partnerB.copingQuality).color} />
                  )}
                </View>
                <View style={assessStyles.interpretCard}>
                  <TenderText variant="label" style={assessStyles.interpretTitle}>Understanding Your Scores</TenderText>
                  <TenderText variant="body" color={Colors.textSecondary}>
                    This measures how partners cope with stress together:{'\n\n'}
                    {'\u2022'} Stress Communication: How clearly you signal stress{'\n'}
                    {'\u2022'} Supportive Coping: Emotional and practical support offered{'\n'}
                    {'\u2022'} Delegated Coping: Taking on tasks when overwhelmed{'\n'}
                    {'\u2022'} Common Coping: Facing challenges as a team{'\n'}
                    {'\u2022'} Negative Coping: Dismissive responses (lower is better)
                    {dci.partnerA?.copingQuality && `\n\n${nameA}: ${dciInterpretation(dci.partnerA.copingQuality).text}`}
                    {dci.partnerB?.copingQuality && `\n\n${nameB}: ${dciInterpretation(dci.partnerB.copingQuality).text}`}
                  </TenderText>
                </View>
              </AssessmentCard>
              <ConversationPrompts assessmentType="dci" hasGap={Math.abs((dci.partnerA?.totalPositive ?? 0) - (dci.partnerB?.totalPositive ?? 0)) > 15} />
              </>
            )}
          </>
        )}
      </View>
    );
  };

  const renderInsights = () => {
    if (!dp) return <TenderText variant="body" color={Colors.textMuted} align="center" style={styles.noDataText}>Deep portrait data is being generated...</TenderText>;

    return (
      <View style={styles.tabContent}>
        {/* Full Relationship Story — opening is shown on Overview tab, not here */}
        <TenderText variant="headingM" style={styles.sectionTitle}>Your Story</TenderText>
        <CoupleNarrativeBlock
          narrative={dp.narrative}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
          showOpening={false}
        />

        {/* Dyadic Synthesis */}
        {dp.dyadicInsights.satisfaction && (
          <View style={[styles.synthesisCard, { marginTop: Spacing.lg }]}>
            <TenderText variant="headingS" style={styles.synthesisTitle}>Relationship Adjustment</TenderText>
            <TenderText variant="body" color={Colors.textSecondary}>{dp.dyadicInsights.satisfaction.narrative}</TenderText>
          </View>
        )}
        {dp.dyadicInsights.closeness && (
          <View style={styles.synthesisCard}>
            <TenderText variant="headingS" style={styles.synthesisTitle}>Couple Satisfaction</TenderText>
            <TenderText variant="body" color={Colors.textSecondary}>{dp.dyadicInsights.closeness.narrative}</TenderText>
          </View>
        )}
        {dp.dyadicInsights.coping && (
          <View style={styles.synthesisCard}>
            <TenderText variant="headingS" style={styles.synthesisTitle}>Dyadic Coping</TenderText>
            <TenderText variant="body" color={Colors.textSecondary}>{dp.dyadicInsights.coping.narrative}</TenderText>
          </View>
        )}

        {/* Discrepancies */}
        {dp.dyadicInsights.discrepancies.length > 0 && (
          <>
            <TenderText variant="headingM" style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Where Data Diverges</TenderText>
            <TenderText variant="body" color={Colors.textSecondary} style={styles.sectionDesc}>
              Places where your individual profiles tell a different story than your dyadic assessments.
            </TenderText>
            {dp.dyadicInsights.discrepancies.map((d, i) => (
              <DyadicDiscrepancyAlert key={i} discrepancy={d} />
            ))}
          </>
        )}
      </View>
    );
  };

  const renderGrowth = () => {
    if (!dp) return <TenderText variant="body" color={Colors.textMuted} align="center" style={styles.noDataText}>Deep portrait data is being generated...</TenderText>;

    return (
      <View style={styles.tabContent}>
        <View style={{ alignItems: 'center', marginBottom: Spacing.md }}>
          <IllustrationPairing10 width={220} animated />
        </View>
        <TenderText variant="headingM" style={styles.sectionTitle}>Your Growth Edges</TenderText>
        <TenderText variant="body" color={Colors.textSecondary} style={styles.sectionDesc}>
          Prioritized areas where your relationship is asking to evolve. Each edge names
          the protection, the cost, and the invitation.
        </TenderText>

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
          accessibilityLabel="Explore your twelve-step relational growth journey"
        >
          <View style={styles.journeyHeader}>
            <SeedlingIcon size={22} color={Colors.primary} />
            <TenderText variant="headingS" color={Colors.primary}>Continue Your Relational Journey</TenderText>
          </View>
          <TenderText variant="body" color={Colors.textSecondary} style={styles.journeyDesc}>
            Twelve steps of relational growth — practices, reflections, and milestones
            designed around your unique patterns.
          </TenderText>
          <View style={styles.ctaRow}>
            <TenderText variant="body" color={Colors.primary}>View Journey</TenderText>
            <ArrowRightIcon size={14} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAnchors = () => {
    if (!dp) return <TenderText variant="body" color={Colors.textMuted} align="center" style={styles.noDataText}>Deep portrait data is being generated...</TenderText>;

    return (
      <View style={styles.tabContent}>
        <TenderText variant="headingM" style={styles.sectionTitle}>Couple Anchors</TenderText>
        <TenderText variant="body" color={Colors.textSecondary} style={styles.sectionDesc}>
          Phrases to hold onto in difficult moments — personalized to your patterns, your cycle,
          and your attachment dynamics.
        </TenderText>

        <CoupleAnchorCard
          anchors={dp.coupleAnchors}
          partnerAName={dp.partnerAName}
          partnerBName={dp.partnerBName}
        />
      </View>
    );
  };

  /** Section summary content for each couple portrait section */
  const COUPLE_SECTION_SUMMARIES: Record<string, { summary: string; readMinutes: number; color: string }> = {
    overview: {
      summary: 'Your relationship at a glance \u2014 patterns, strengths, attachment dynamics, and the story between you.',
      readMinutes: 3,
      color: Colors.couplePartnerA,
    },
    pattern: {
      summary: 'Your combined cycle \u2014 the dance you fall into under stress, with exit points, repair steps, and anchor phrases.',
      readMinutes: 5,
      color: Colors.couplePartnerB,
    },
    connection: {
      summary: 'Profiles overlaid \u2014 where you converge, complement, and create friction, plus your integrated couple matrix.',
      readMinutes: 6,
      color: Colors.calm,
    },
    insights: {
      summary: 'The deeper story \u2014 narrative synthesis, assessment scores, and where data tells a different tale.',
      readMinutes: 6,
      color: Colors.accent,
    },
    growth: {
      summary: 'Where your relationship is asking to evolve \u2014 protection, cost, and invitation.',
      readMinutes: 4,
      color: Colors.warning,
    },
    field: {
      summary: 'Your relational field \u2014 what you\u2019re creating together, what needs care, and what to try next.',
      readMinutes: 3,
      color: Colors.accentGold,
    },
    courses: {
      summary: 'Four live courses to play together \u2014 family patterns, nervous systems, boundaries, and bids.',
      readMinutes: 15,
      color: Colors.calm,
    },
  };

  /** Generate a 60-second digest of the couple portrait */
  const generateCoupleDigest = (): string => {
    if (!dp) return '';
    const parts: string[] = [];

    // Dynamic
    const dynamic = dp.patternInterlock.combinedCycle.dynamic.replace(/-/g, ' ');
    parts.push(`Your relational dance is a ${dynamic} pattern \u2014 ${dp.partnerAName} tends to ${dp.patternInterlock.combinedCycle.partnerAPosition}, while ${dp.partnerBName} tends to ${dp.patternInterlock.combinedCycle.partnerBPosition}.`);

    // Attachment
    parts.push(`In the attachment landscape, you\u2019re a ${dp.patternInterlock.attachmentDynamic.dynamicLabel} pairing.`);

    // Strengths
    if (dp.convergenceDivergence.sharedStrengths.length > 0) {
      const top = dp.convergenceDivergence.sharedStrengths.slice(0, 2).map(s => s.dimensionLabel).join(' and ');
      parts.push(`Your shared strengths include ${top}.`);
    }

    // Growth
    if (dp.coupleGrowthEdges.length > 0) {
      parts.push(`Your top growth edge: ${dp.coupleGrowthEdges[0].title}.`);
    }

    // Vitality
    if (dp.relationalField?.vitality > 0) {
      const vLabel = dp.relationalField.qualitativeLabel || `${Math.round(dp.relationalField.vitality)}%`;
      parts.push(`Field vitality: ${vLabel}.`);
    }

    return parts.join(' ');
  };

  // ─── Our Matrix Tab ──────────────────────────────────
  const renderOurMatrix = () => {
    const nameA = dp?.partnerAName || 'You';
    const nameB = dp?.partnerBName || partnerName || 'Partner';

    // Build partner scores from raw fetched data
    const toPartnerScores = (raw: Record<string, { id: string; scores: any }> | null) => ({
      ecrr: raw?.['ecr-r']?.scores,
      ipip: raw?.['tender-personality-60']?.scores,
      sseit: raw?.['sseit']?.scores,
      dsir: raw?.['dsi-r']?.scores,
      dutch: raw?.['dutch']?.scores,
      values: raw?.['values']?.scores,
    });

    const p1 = toPartnerScores(myRawScores);
    const p2 = toPartnerScores(partnerRawScores);

    // WEARE data from the profile
    const weare = weareProfile ? {
      resonance: weareProfile.layers?.resonancePulse,
      emergenceDirection: weareProfile.layers?.emergenceDirection,
      bottleneck: (weareProfile.bottleneck as unknown as string) ?? null,
      movementPhase: weareProfile.movementPhase as string,
    } : undefined;

    return (
      <View style={styles.tabContent}>
        <CoupleMatrix
          partner1={p1}
          partner2={p2}
          partner1Name={nameA}
          partner2Name={nameB}
          weareData={weare}
          dyadicScores={dyadicScores}
        />
      </View>
    );
  };

  /** Render the active tab content — one section at a time, like personal portrait */
  /** Merged render: Dance + Anchors */
  const renderPattern = () => (
    <>
      {renderDance()}
      <View style={{ marginTop: Spacing.lg }}>
        {renderAnchors()}
      </View>
    </>
  );

  /** Merged render: Together + Our Matrix */
  const renderConnection = () => (
    <>
      {renderTogether()}
      <View style={{ marginTop: Spacing.lg }}>
        {renderOurMatrix()}
      </View>
    </>
  );

  /** Merged render: Insights + Assessments */
  const renderCombinedInsights = () => (
    <>
      {renderInsights()}
      <View style={{ marginTop: Spacing.lg }}>
        {renderAssessments()}
      </View>
    </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':   return renderOverview();
      case 'pattern':    return renderPattern();
      case 'connection': return renderConnection();
      case 'insights':   return renderCombinedInsights();
      case 'growth':     return renderGrowth();
      case 'field':      return <OurFieldTab coupleId={couple!.id} userId={user!.id} compositeScores={myPortrait?.compositeScores} />;
      case 'courses':    return <CoursesTab coupleId={couple!.id} userId={user!.id} />;
      default:           return renderOverview();
    }
  };

  // ─── Main Render ─────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollRef} contentContainerStyle={[styles.scroll, { paddingBottom: barH + 20 }]} onScroll={handleScrollBar} scrollEventThrottle={16} stickyHeaderIndices={[1]}>
        {/* Header content — wraps into single child so tab bar is at index 1 for stickyHeaderIndices */}
        <View>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.replace('/(app)/partner' as any)} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Return to partner screen">
              <View style={styles.backRow}>
                <ArrowLeftIcon size={16} color={Colors.primary} />
                <TenderText variant="body" color={Colors.primary}>Back</TenderText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (!dp) return;
                try {
                  const { generateCouplePortraitPDF } = await import('@/services/pdf-export');
                  const nameA = dp.partnerAName || 'Partner A';
                  const nameB = dp.partnerBName || partnerName || 'Partner B';
                  const rawScores = myRawScores && partnerRawScores ? {
                    partner1: myRawScores,
                    partner2: partnerRawScores,
                  } : undefined;
                  await generateCouplePortraitPDF(dp, nameA, nameB, rawScores);
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
              accessibilityLabel="Export your couple portrait as PDF"
              accessibilityState={{ disabled: !dp }}
            >
              <TenderText variant="body" color={Colors.primary} style={[styles.exportBtnText, !dp && { opacity: 0.4 }]}>Export PDF</TenderText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(app)/sharing-settings' as any)}
              activeOpacity={0.7}
              style={styles.settingsBtn}
              accessibilityRole="button"
              accessibilityLabel="Settings"
            >
              <SettingsIcon size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <TenderText variant="headingXL" style={styles.heading}>Your Couple Portal</TenderText>
          <TenderText variant="headingS" color={Colors.textSecondary} style={[styles.subtitle, { marginBottom: 4 }]}>
            The Space Between You
          </TenderText>
          <TenderText variant="bodySmall" color={Colors.textMuted} style={styles.subtitle}>
            A living portrait of how you and {partnerName} move through the world together
          </TenderText>

          {/* Sharing Info */}
          {partnerSharedAssessments.length > 0 && (
            <View style={styles.sharingCard}>
              <TenderText variant="label" color={Colors.calm} style={styles.sharingLabel}>SHARED WITH YOU</TenderText>
              <TenderText variant="body" color={Colors.textSecondary}>
                {partnerName} is sharing {Math.min(partnerSharedAssessments.length, INDIVIDUAL_ASSESSMENT_TYPES.length)} of {INDIVIDUAL_ASSESSMENT_TYPES.length} individual assessments with you.
              </TenderText>
            </View>
          )}
        </View>

        {/* Tab Bar — sticky (index 1 via stickyHeaderIndices) */}
        <View style={styles.tabBarWrapper} accessibilityRole="tablist" accessibilityLabel="Couple portrait sections">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tabItem,
                    { backgroundColor: tab.color + (isActive ? '20' : '08'), borderColor: tab.color + (isActive ? '60' : '25') },
                  ]}
                  onPress={() => handleTabChange(tab.key)}
                  activeOpacity={0.7}
                  accessibilityRole="tab"
                  accessibilityLabel={`View ${tab.label} section`}
                  accessibilityState={{ selected: isActive }}
                >
                  <View style={styles.tabIcon}>
                    <tab.Icon size={14} color={isActive ? tab.color : Colors.textMuted} />
                  </View>
                  <TenderText variant="caption" color={isActive ? tab.color : Colors.textSecondary}>{tab.label}</TenderText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Section summary header */}
        {(() => {
          const info = COUPLE_SECTION_SUMMARIES[activeTab];
          if (!info) return null;
          return (
            <SectionSummaryHeader
              summary={info.summary}
              readMinutes={info.readMinutes}
              accentColor={info.color}
            />
          );
        })()}

        {/* Active tab content — one section at a time */}
        {renderTabContent()}

        {/* Reset Library — collapsible, above audio library */}
        <ResetLibrary />

        {/* Audio Library — at bottom of every tab */}
        {myPortrait && <AudioLibrary portrait={myPortrait} couplePortrait={dp} />}

        <View style={{ height: 160 }} />
      </ScrollView>
      {dp?.coupleAnchors && <AnchorSOSButton anchors={dp.coupleAnchors} />}
      <ReAnimated.View style={[{ position: 'absolute', bottom: 0, left: 0, right: 0 }, quickLinksAnimStyle]}>
        <QuickLinksBar />
      </ReAnimated.View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  loadingText: {
    marginTop: Spacing.md,
  },

  // Header
  backBtn: { marginBottom: Spacing.md },
  backBtnCenter: { marginTop: Spacing.lg },
  backRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  heading: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.lg,
  },
  retryBtn: { marginTop: Spacing.md },

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
    marginBottom: Spacing.xs,
  },

  // Tab Bar — portrait-style icon pills
  tabBarWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surfaceElevated,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  tabBarContent: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabIcon: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  // Tab Content
  tabContent: {
    gap: Spacing.sm,
  },

  // Couple Digest
  digestCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  digestHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },

  assessmentExplainerCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  assessmentExplainerTitle: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: Colors.textMuted,
    marginBottom: 10,
    textAlign: 'center' as const,
  },
  assessmentExplainerBody: {
    lineHeight: 20,
    marginBottom: 8,
    fontSize: 13,
  },
  assessmentExplainerNote: {
    fontSize: 12,
    lineHeight: 20,
    marginTop: 4,
  },
  assessmentExplainerLink: {
    marginTop: 10,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  staleBanner: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: Spacing.sm,
    backgroundColor: Colors.accentGold + '12',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentGold,
  },

  noDataText: {
    marginTop: Spacing.xl,
  },

  // Section headers
  sectionTitle: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sectionDesc: {
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
    fontSize: FontSizes.hero,
  },
  quickStatLabel: {
    marginTop: 2,
  },
  narrativeSmall: {
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
    marginBottom: Spacing.xs,
  },
  miniMatrixContainer: {
    marginVertical: Spacing.xs,
    alignItems: 'center' as const,
  },
  miniMatrixCaption: {
    marginTop: Spacing.xs,
  },
  overviewInsightLabel: {
    marginBottom: 2,
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
    fontSize: FontSizes.caption,
  },
  repairStepText: {
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
    marginBottom: Spacing.xs,
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
  journeyDesc: {
    marginBottom: Spacing.md,
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
    marginBottom: Spacing.xs,
  },
  coachDesc: {
    marginBottom: Spacing.md,
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
    letterSpacing: 0.5,
  },
  settingsBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },

  // ── WEARE enhancements ────────────────────────────────
  weareBanner: {
    backgroundColor: Colors.calm + '26',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.calm + '40',
    padding: Spacing.sm + 2,
    marginBottom: Spacing.sm,
  },
  weareCelebration: {
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.success + '40',
    padding: Spacing.sm + 2,
    marginBottom: Spacing.sm,
    alignItems: 'center' as const,
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
    marginBottom: 2,
  },
  assessSubtitle: {
    marginBottom: Spacing.md,
  },
  partnerHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  partnerName: {
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  compareLabel: {
    flex: 1,
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
    fontSize: FontSizes.body,
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
    letterSpacing: 0.5,
  },
  interpretCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
  },
  interpretTitle: {
    marginBottom: Spacing.xs,
  },
  narrativeCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  narrativeParagraph: {
    lineHeight: 28,
  },
});
