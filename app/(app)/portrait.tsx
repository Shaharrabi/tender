/**
 * Portrait Screen — Tabbed Report with Animated Reveals
 *
 * Tabs: Overview | Scores | Lenses | Cycle | Growth | Anchors
 *
 * Each tab is a self-contained section with smooth animated reveals,
 * color-coded visuals, and a warm, polished aesthetic.
 */

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { TooltipManager } from '@/components/ftue/TooltipManager';
import { WelcomeAudio } from '@/components/ftue/WelcomeAudio';
import QuickLinksBar from '@/components/QuickLinksBar';
import { getPortrait, savePortrait, extractSupplementScores, fetchPreviousScores } from '@/services/portrait';
import { fetchGrowthBoostData } from '@/services/growth-boost';
import { getGrowthBoostedScore, type GrowthBoostedResult } from '@/utils/portrait/growth-boost';
import type { GrowthEdgeProgress } from '@/types/growth';
import { getUserConsent, eraseUserData } from '@/services/consent';
import {
  Colors,
  Spacing,
  ButtonSizes,
  BorderRadius,
  Shadows,
  FontSizes,
} from '@/constants/theme';
import type { IndividualPortrait } from '@/types';
import type { FieldAwarenessLens } from '@/types/portrait';

import PortraitLens from '@/components/portrait/PortraitLens';
import AppIcon from '@/components/ui/AppIcon';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { synthesizeAssessments, type AssessmentSynthesis } from '@/utils/portrait/assessment-synthesis';
import { getStep } from '@/utils/steps/twelve-steps';
import { STAT_ICONS } from '@/constants/icons';
import type { IconComponent } from '@/constants/icons';

// ── Sprint 4: New visualization imports ──
import RadarChart from '@/components/visualizations/RadarChart';
import ThreeLayerDashboard from '@/components/portrait/ThreeLayerDashboard';
import YourFieldTab from '@/components/portrait/YourFieldTab';
import WaterfallChart from '@/components/visualizations/WaterfallChart';
import ConflictRose from '@/components/visualizations/ConflictRose';
import EQHeatmap from '@/components/visualizations/EQHeatmap';
import ValuesAlignment from '@/components/visualizations/ValuesAlignment';
import BigFiveBars from '@/components/visualizations/BigFiveBars';
import WindowOfTolerance from '@/components/visualizations/WindowOfTolerance';
import DifferentiationSpectrum from '@/components/visualizations/DifferentiationSpectrum';
import { fetchAllScores } from '@/services/portrait';
import { ReassessmentDelta } from '@/components/visualizations/ReassessmentDelta';
import { generatePortrait, isPortraitStale } from '@/utils/portrait/portrait-generator';
import type { AllAssessmentScores } from '@/types/portrait';
import type { SSEITScores, DUTCHScores, ValuesScores, IPIPScores, DSIRScores } from '@/types';
import {
  CompassIcon,
  MasksIcon,
  SparkleIcon,
  RefreshIcon,
  LightningIcon,
  DoveIcon,
  WaveIcon,
  SearchIcon,
  ShieldIcon,
  FireIcon,
  SnowflakeIcon,
  HourglassIcon,
  HeartIcon,
  GreenHeartIcon,
  ScaleIcon,
  StarIcon,
  LinkIcon,
  SeedlingIcon,
  LightbulbIcon,
} from '@/assets/graphics/icons';
import { getExerciseById } from '@/utils/interventions/registry';
import { getExercisesForEdge } from '@/utils/portrait/growth-edges';
import { CATEGORY_ACCENT_COLORS } from '@/components/intervention/ExerciseCard';
import { useFocusEffect } from '@react-navigation/native';
import { getCompletions } from '@/services/intervention';
import { calculateGrowthProgress, boostMovementsFromProgress } from '@/utils/steps/intervention-protocols';
import type { GrowthProgress } from '@/utils/steps/intervention-protocols';
import GrowthPlanContent from '@/components/growth/GrowthPlanContent';
import PortraitDigest from '@/components/portrait-enhancements/PortraitDigest';
import DailyLifeScenario from '@/components/portrait-enhancements/DailyLifeScenario';
import TryThisTodayCTA, { PORTRAIT_TAB_ACTIONS } from '@/components/portrait-enhancements/TryThisTodayCTA';
import { ScoreViewToggle, ScoreStoryContent } from '@/components/portrait-enhancements/ScoreStoryToggle';
import SectionSummaryHeader, { TAB_SUMMARIES } from '@/components/portrait-enhancements/SectionSummaryHeader';
import CollapsibleNarrative from '@/components/portrait-enhancements/CollapsibleNarrative';
import GrowthEdgeSummaryCard from '@/components/portrait-enhancements/GrowthEdgeSummaryCard';
import AnchorQuickAccess from '@/components/portrait-enhancements/AnchorQuickAccess';
import MatrixTab from '@/components/portrait/MatrixTab';
import AudioLibrary from '@/components/audio/AudioLibrary';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Tab definitions ────────────────────────────────────

type TabKey = 'overview' | 'scores' | 'lenses' | 'cycle' | 'growth' | 'anchors' | 'matrix' | 'field';

interface TabDef {
  key: TabKey;
  label: string;
  Icon: IconComponent;
  color: string;
}

const TABS: TabDef[] = [
  { key: 'overview', label: 'Overview', Icon: STAT_ICONS.overview, color: Colors.primary },
  { key: 'scores', label: 'Scores', Icon: STAT_ICONS.scores, color: Colors.calm },
  { key: 'lenses', label: 'Lenses', Icon: STAT_ICONS.lenses, color: Colors.depth },
  { key: 'cycle', label: 'Cycle', Icon: STAT_ICONS.cycle, color: Colors.secondary },
  { key: 'growth', label: 'Growth', Icon: STAT_ICONS.growth, color: Colors.warning },
  { key: 'anchors', label: 'Anchors', Icon: STAT_ICONS.anchor, color: Colors.calm },
  { key: 'matrix', label: 'Matrix', Icon: LinkIcon, color: Colors.depth },
  { key: 'field', label: 'Your Field', Icon: SparkleIcon, color: Colors.accentGold },
];

// ─── Narrative generator ────────────────────────────────

interface WhoYouAreSection {
  title: string;
  icon: React.ReactNode;
  body: string;
  color: string;
}

function generateWhoYouAreSections(portrait: IndividualPortrait): WhoYouAreSection[] {
  const cs = portrait.compositeScores;
  const nc = portrait.negativeCycle;
  const sections: WhoYouAreSection[] = [];

  // 1. Your Strengths
  const strengths: string[] = [];
  if (cs.accessibility >= 60) strengths.push('emotional openness');
  if (cs.responsiveness >= 60) strengths.push('attunement to others');
  if (cs.engagement >= 60) strengths.push('relational investment');
  if (cs.selfLeadership >= 60) strengths.push('self-awareness');
  if (cs.valuesCongruence >= 60) strengths.push('values alignment');
  if (cs.regulationScore >= 60) strengths.push('emotional regulation');

  sections.push({
    title: 'Your Strengths',
    icon: <SparkleIcon size={18} color={Colors.success} />,
    color: Colors.success,
    body: strengths.length > 0
      ? `You show real strength in ${strengths.slice(0, 3).join(', ')}. These are the gifts you bring to your relationships — the places where you naturally shine.`
      : 'Your profile reveals a complex, nuanced picture of how you relate. You have a solid foundation to build on.',
  });

  // 2. Under Stress
  const cycleBody = nc.position === 'pursuer'
    ? 'You tend to move toward connection under stress — reaching for reassurance and closeness. This is a natural response rooted in a deep need to feel connected.'
    : nc.position === 'withdrawer'
    ? 'You tend to pull inward under stress — creating space to protect yourself. This is a natural response rooted in a need for safety and autonomy.'
    : nc.position === 'mixed'
    ? 'Your response to stress is nuanced — sometimes reaching toward, sometimes pulling back. You adapt depending on what feels safest in the moment.'
    : 'You show flexibility in how you respond to relational stress — adapting to the moment rather than defaulting to one pattern.';

  sections.push({
    title: 'Under Stress',
    icon: <WaveIcon size={18} color={Colors.secondary} />,
    color: Colors.secondary,
    body: `${cycleBody} Understanding this pattern is the first step toward choosing something different when you're ready.`,
  });

  // 3. Growth Areas
  const growth: string[] = [];
  if (cs.regulationScore < 40) growth.push('widening your emotional window');
  if (cs.windowWidth < 40) growth.push('building tolerance for discomfort');
  if (cs.valuesCongruence < 40) growth.push('aligning your actions with your values');
  if (cs.selfLeadership < 40) growth.push('developing your inner compass');

  sections.push({
    title: 'Where You Can Grow',
    icon: <SeedlingIcon size={18} color={Colors.warning} />,
    color: Colors.warning,
    body: growth.length > 0
      ? `Your portrait points to opportunities in ${growth.slice(0, 2).join(' and ')}. These aren't weaknesses — they're the edges where meaningful change happens.`
      : 'Your scores are well-balanced across the board. Focus on deepening what you already do well and staying curious about your patterns.',
  });

  // 4. Core Values
  const coreValues = portrait.fourLens.values.coreValues.slice(0, 3);
  if (coreValues.length > 0) {
    sections.push({
      title: 'What Matters Most',
      icon: <LightbulbIcon size={18} color={Colors.primary} />,
      color: Colors.primary,
      body: `Your core values are ${coreValues.join(', ')}. These are the principles that guide your choices and shape what you need from a relationship.`,
    });
  }

  return sections;
}

// ─── Score helpers ──────────────────────────────────────

function getOverallScore(cs: IndividualPortrait['compositeScores']): number {
  const keys = ['accessibility', 'responsiveness', 'engagement', 'regulationScore', 'windowWidth', 'selfLeadership', 'valuesCongruence'] as const;
  const total = keys.reduce((sum, k) => sum + cs[k], 0);
  return Math.round(total / keys.length);
}

function getTierInfo(value: number): { label: string; color: string } {
  if (value >= 75) return { label: 'Strength', color: Colors.success };
  if (value >= 55) return { label: 'Developing', color: Colors.calm };
  if (value >= 35) return { label: 'Emerging', color: Colors.warning };
  return { label: 'Focus Area', color: Colors.error };
}

function getTopStrength(cs: IndividualPortrait['compositeScores']): string {
  const scores = [
    { label: 'Engagement', value: cs.engagement },
    { label: 'Accessibility', value: cs.accessibility },
    { label: 'Responsiveness', value: cs.responsiveness },
    { label: 'Regulation', value: cs.regulationScore },
    { label: 'Self-Leadership', value: cs.selfLeadership },
    { label: 'Values Alignment', value: cs.valuesCongruence },
  ];
  const top = scores.sort((a, b) => b.value - a.value)[0];
  return `${top.label} (${top.value}/100)`;
}

// ─── Animated Bar Component ────────────────────────────

function AnimatedScoreBar({
  label,
  value,
  delay = 0,
  interpretation,
}: {
  label: string;
  value: number;
  delay?: number;
  interpretation?: string;
}) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const tier = getTierInfo(value);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(widthAnim, {
          toValue: value,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[st.barContainer, { opacity: opacityAnim }]}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value} out of 100${interpretation ? `, ${interpretation}` : ''}`}
    >
      <View style={st.barLabelRow}>
        <TenderText variant="body">{label}</TenderText>
        <TenderText variant="body" color={tier.color}>{value}</TenderText>
      </View>
      <View style={st.barTrack}>
        <Animated.View
          style={[
            st.barFill,
            {
              width: animatedWidth,
              backgroundColor: tier.color,
            },
          ]}
        />
      </View>
      {interpretation && (
        <TenderText variant="caption" color={tier.color}>
          {interpretation}
        </TenderText>
      )}
    </Animated.View>
  );
}

// ─── Animated Score Circle ─────────────────────────────

function AnimatedScoreCircle({ score, growthBoost }: { score: number; growthBoost?: number }) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(0)).current;
  const [displayCount, setDisplayCount] = useState(0);
  const tier = getTierInfo(score);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(countAnim, {
        toValue: score,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();

    countAnim.addListener(({ value }) => {
      setDisplayCount(Math.round(value));
    });

    return () => countAnim.removeAllListeners();
  }, []);

  return (
    <Animated.View
      style={[
        st.scoreCircleContainer,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View
        style={[st.scoreCircleOuter, { borderColor: tier.color }]}
        accessibilityRole="text"
        accessibilityLabel={`Overall relational score: ${score} out of 100, ${tier.label}`}
      >
        <TenderText variant="headingXL" color={tier.color}>{displayCount}</TenderText>
        <TenderText variant="caption" color={Colors.textMuted} style={st.scoreCircleLabel}>overall</TenderText>
      </View>
      <TenderText variant="body" color={tier.color} style={st.scoreCircleTier}>{tier.label}</TenderText>
      {growthBoost != null && growthBoost > 0 && (
        <TenderText variant="caption" color={Colors.success} style={{ marginTop: 2 }}>
          +{growthBoost} from growth
        </TenderText>
      )}
    </Animated.View>
  );
}

// ─── Stat Card ──────────────────────────────────────────

function StatCard({
  icon: IconComp,
  label,
  value,
  color,
  delay = 0,
}: {
  icon: IconComponent;
  label: string;
  value: string;
  color: string;
  delay?: number;
}) {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        st.statCard,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[st.statIcon, { backgroundColor: color }]}>
        <IconComp size={16} color={Colors.white} />
      </View>
      <TenderText variant="caption" color={Colors.textMuted} style={st.statLabel}>{label}</TenderText>
      <TenderText variant="body" style={st.statValue} numberOfLines={2} accessibilityRole="text" accessibilityLabel={`${label}: ${value}`}>{value}</TenderText>
    </Animated.View>
  );
}

// ─── A.R.E. Score Ring ─────────────────────────────────

function AREScoreRing({
  label,
  value,
  color,
  delay = 0,
}: {
  label: string;
  value: number;
  color: string;
  delay?: number;
}) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(0)).current;
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(countAnim, {
          toValue: value,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    countAnim.addListener(({ value: v }) => {
      setDisplayCount(Math.round(v));
    });

    return () => countAnim.removeAllListeners();
  }, []);

  const tier = getTierInfo(value);

  return (
    <Animated.View
      style={[
        st.areRingItem,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View
        style={[st.areRingOuter, { borderColor: color }]}
        accessibilityRole="text"
        accessibilityLabel={`${label} score: ${value} out of 100, ${tier.label}`}
      >
        {/* Background track */}
        <View style={[st.areRingTrack, { borderColor: color + '20' }]} />
        <TenderText variant="headingM" color={color}>{displayCount}</TenderText>
      </View>
      <TenderText variant="caption" style={st.areRingLabel}>{label}</TenderText>
      <TenderText variant="caption" color={tier.color} style={st.areRingTier}>{tier.label}</TenderText>
    </Animated.View>
  );
}

// ─── Main Component ────────────────────────────────────

export default function PortraitScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [portrait, setPortrait] = useState<IndividualPortrait | null>(null);
  const [rawScores, setRawScores] = useState<AllAssessmentScores | null>(null);
  const [allScoresMap, setAllScoresMap] = useState<Record<string, { id: string; scores: any }>>({});
  const [previousCompositeScores, setPreviousCompositeScores] = useState<IndividualPortrait['compositeScores'] | null>(null);
  const [loading, setLoading] = useState(true);
  const initialTab = (params.tab as TabKey) || 'overview';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [exportMode, setExportMode] = useState(false);
  const [scoreViewMode, setScoreViewMode] = useState<'numbers' | 'story'>('story');
  const [isViewAndErase, setIsViewAndErase] = useState(false);
  const [growthBoostResult, setGrowthBoostResult] = useState<GrowthBoostedResult | null>(null);
  const [journeyData, setJourneyData] = useState<{
    stepsCompleted: number;
    totalSteps: number;
    edgeProgress: GrowthEdgeProgress[];
    totalPractices: number;
    currentStreak: number;
  } | null>(null);
  const viewAndEraseRef = useRef(false); // stable ref for cleanup
  const tabScrollRef = useRef<ScrollView>(null);
  const contentScrollRef = useRef<ScrollView>(null);

  const loadPortraitData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Gate: require consent before showing results
      const userConsent = await getUserConsent(user.id);
      if (!userConsent) {
        setLoading(false);
        router.replace('/(app)/consent-waiver' as any);
        return;
      }

      // Load portrait + raw assessment scores in parallel
      const [p, scoresMap] = await Promise.all([
        getPortrait(user.id),
        fetchAllScores(user.id).catch(() => null),
      ]);

      let finalPortrait = p;

      // Auto-regenerate portrait if code version is newer (e.g. missing radar dimensions)
      if (finalPortrait && scoresMap && isPortraitStale(finalPortrait.version)) {
        console.log(`[Portrait] Portrait version ${finalPortrait.version} is stale — regenerating...`);
        try {
          const required = ['ecr-r', 'dutch', 'sseit', 'dsi-r', 'ipip-neo-120', 'values'];
          const hasAll = required.every((t) => scoresMap[t]?.scores);
          if (hasAll) {
            const scores: AllAssessmentScores = {
              ecrr: scoresMap['ecr-r'].scores,
              dutch: scoresMap['dutch'].scores,
              sseit: scoresMap['sseit'].scores,
              dsir: scoresMap['dsi-r'].scores,
              ipip: scoresMap['ipip-neo-120'].scores,
              values: scoresMap['values'].scores,
            };
            const supplements = extractSupplementScores(scoresMap);
            const ids = Object.values(scoresMap).map((r) => r.id);
            const freshPortrait = generatePortrait(user.id, ids, scores, supplements);
            const saved = await savePortrait(freshPortrait);
            finalPortrait = saved;
            console.log('[Portrait] Auto-regenerated with latest composite scores');
          }
        } catch (regenErr) {
          console.error('[Portrait] Auto-regeneration failed:', regenErr);
          // Keep the old portrait rather than showing nothing
        }
      }

      setPortrait(finalPortrait);
      if (scoresMap) {
        // Store full scores map for Matrix tab
        setAllScoresMap(scoresMap);
        try {
          setRawScores({
            ecrr: scoresMap['ecr-r']?.scores,
            dutch: scoresMap['dutch']?.scores,
            sseit: scoresMap['sseit']?.scores,
            dsir: scoresMap['dsi-r']?.scores,
            ipip: scoresMap['ipip-neo-120']?.scores,
            values: scoresMap['values']?.scores,
          });
        } catch (e) {
          console.warn('[Portrait] Failed to parse raw scores:', e);
        }
      }

      // Fetch previous assessment scores for ReassessmentDelta visualization
      if (finalPortrait) {
        try {
          const prevScoresMap = await fetchPreviousScores(user.id);
          if (prevScoresMap) {
            // Generate a portrait from previous scores to get previous composite scores
            const required = ['ecr-r', 'dutch', 'sseit', 'dsi-r', 'ipip-neo-120', 'values'];
            const hasAllPrev = required.every((t) => prevScoresMap[t]?.scores);
            if (hasAllPrev) {
              const prevScores: AllAssessmentScores = {
                ecrr: prevScoresMap['ecr-r'].scores,
                dutch: prevScoresMap['dutch'].scores,
                sseit: prevScoresMap['sseit'].scores,
                dsir: prevScoresMap['dsi-r'].scores,
                ipip: prevScoresMap['ipip-neo-120'].scores,
                values: prevScoresMap['values'].scores,
              };
              const prevSupplements = extractSupplementScores(prevScoresMap);
              const prevIds = Object.values(prevScoresMap).map((r) => r.id);
              const prevPortrait = generatePortrait(user.id, prevIds, prevScores, prevSupplements);
              setPreviousCompositeScores(prevPortrait.compositeScores);
              console.log('[Portrait] Previous composite scores loaded for ReassessmentDelta');
            }
          }
        } catch (e) {
          console.warn('[Portrait] Failed to load previous scores:', e);
        }
      }

      // Fetch growth boost data for integrated score display
      if (finalPortrait) {
        try {
          const boostData = await fetchGrowthBoostData(user.id);
          const baseline = getOverallScore(finalPortrait.compositeScores);
          const result = getGrowthBoostedScore(baseline, boostData);
          setGrowthBoostResult(result);
          setJourneyData({
            stepsCompleted: boostData.stepsCompleted,
            totalSteps: 12,
            edgeProgress: boostData.edgeProgress,
            totalPractices: boostData.totalPracticeCompletions,
            currentStreak: boostData.currentStreak,
          });
        } catch (e) {
          console.warn('[Portrait] Failed to load growth boost data:', e);
        }
      }

      // Check if consent is view-and-erase
      const consent = await getUserConsent(user.id);
      if (consent?.consentType === 'view_and_erase') {
        setIsViewAndErase(true);
        viewAndEraseRef.current = true;
      }
    } catch (err) {
      console.error('[Portrait] Failed to load portrait:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refresh portrait data when screen gains focus (e.g. returning from assessment)
  useFocusEffect(useCallback(() => { loadPortraitData(); }, [loadPortraitData]));

  // View-and-erase: erase data when navigating away
  useEffect(() => {
    if (!isViewAndErase || !user) return;

    const handleBackPress = () => {
      eraseUserData(user.id).catch((err) => {
        if (__DEV__) console.warn('[ViewAndErase] Erase failed:', err);
      });
      return false; // allow default back behavior
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      sub.remove();
      // Also erase on unmount (covers all navigation-away cases)
      if (viewAndEraseRef.current && user) {
        eraseUserData(user.id).catch((err) => {
          if (__DEV__) console.warn('[ViewAndErase] Cleanup erase failed:', err);
        });
      }
    };
  }, [isViewAndErase, user]);

  const handleTabChange = (tab: TabKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
    // Scroll content to top when switching tabs
    contentScrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Full portrait export — renders all tabs and triggers browser print
  const handleExportAll = async () => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    // Guard DOM APIs for Safari / SSR safety
    if (typeof document === 'undefined') return;

    try {
      // Inject print-specific CSS (hide nav, force all content visible)
      const styleId = 'portrait-print-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @media print {
            body * { visibility: hidden; }
            #portrait-export-root, #portrait-export-root * { visibility: visible; }
            #portrait-export-root {
              position: absolute; left: 0; top: 0; width: 100%;
            }
            .no-print { display: none !important; }
            @page { margin: 0.5in; }
          }
        `;
        document.head.appendChild(style);
      }

      setExportMode(true);
      // Wait for React to render all tabs
      await new Promise((resolve) => setTimeout(resolve, 300));
      window.print();
    } catch (err) {
      if (__DEV__) console.warn('[Export] Failed:', err);
    } finally {
      setExportMode(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={st.container}>
        <View style={st.center}>
          <ActivityIndicator size="large" color={Colors.primary} accessibilityLabel="Loading" />
        </View>
      </SafeAreaView>
    );
  }

  if (!portrait) {
    return (
      <SafeAreaView style={st.container}>
        <View style={st.center}>
          <TenderText variant="body" color={Colors.textSecondary} align="center">
            No portrait found. Complete all 6 assessments first.
          </TenderText>
          <TouchableOpacity
            style={st.button}
            onPress={() => router.replace('/(app)/home')}
            accessibilityRole="button"
            accessibilityLabel="Back to Home"
          >
            <TenderText variant="button" color={Colors.white}>Back to Home</TenderText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const userName = user?.email?.split('@')[0] ?? 'You';
  const dateStr = new Date(portrait.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const overallScore = growthBoostResult?.boostedScore ?? getOverallScore(portrait.compositeScores);

  return (
    <ErrorBoundary>
    <SafeAreaView style={st.container}>
      {/* ── Header ────────────────────────────────── */}
      <View style={st.header}>
        <TouchableOpacity
          onPress={() => router.replace('/(app)/home')}
          activeOpacity={0.7}
          style={st.headerBackBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back to home"
        >
          <TenderText variant="body" color={Colors.primary}>{'<'} Back</TenderText>
        </TouchableOpacity>
        <View style={st.headerCenter}>
          <TenderText variant="headingS">Your Portrait</TenderText>
          <TenderText variant="caption" color={Colors.textMuted} style={{ marginTop: 1 }}>
            {dateStr}
          </TenderText>
        </View>
        <TouchableOpacity
          onPress={async () => {
            try {
              const { generatePortraitPDF } = await import('@/services/pdf-export');
              await generatePortraitPDF(portrait, userName);
            } catch (err) {
              if (__DEV__) console.warn('[Export] PDF failed:', err);
              if (Platform.OS !== 'web') {
                Alert.alert('Export Error', 'Could not generate PDF. Please try again.');
              }
            }
          }}
          activeOpacity={0.7}
          style={[st.headerBackBtn, { alignItems: 'flex-end' }]}
          accessibilityRole="button"
          accessibilityLabel="Export your portrait as PDF"
        >
          <TenderText variant="body" color={Colors.primary}>Export PDF</TenderText>
        </TouchableOpacity>
      </View>

      {/* ── View-and-Erase Warning ─────────────── */}
      {isViewAndErase && (
        <View style={st.viewAndEraseBanner} accessibilityRole="alert" accessibilityLabel="One-time view — your data will be erased when you leave this screen">
          <TenderText variant="body" color={Colors.warning} align="center">
            One-time view — your data will be erased when you leave this screen
          </TenderText>
        </View>
      )}

      {/* ── Tab Bar ───────────────────────────────── */}
      <View style={st.tabBarWrapper}>
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={st.tabBarContent}
        >
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  st.tabItem,
                  isActive && { backgroundColor: tab.color + '15', borderColor: tab.color },
                ]}
                onPress={() => handleTabChange(tab.key)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`View ${tab.label} tab`}
                accessibilityState={{ selected: isActive }}
              >
                <View style={st.tabIcon}>
                  <tab.Icon size={14} color={isActive ? tab.color : Colors.textMuted} />
                </View>
                <TenderText
                  variant="caption"
                  color={isActive ? tab.color : Colors.textSecondary}
                  style={{}}
                >
                  {tab.label}
                </TenderText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {/* Scroll hint — fades to show more tabs */}
        <View style={st.tabScrollHint} pointerEvents="none">
          <TenderText variant="caption" color={Colors.textMuted} style={{ fontSize: 10 }}>{'›'}</TenderText>
        </View>
      </View>

      {/* ── Tab Content ───────────────────────────── */}
      {exportMode ? (
        /* Export mode: render ALL tabs together for printing */
        <ScrollView
          style={st.contentScroll}
          contentContainerStyle={st.contentContainer}
          showsVerticalScrollIndicator={false}
          nativeID="portrait-export-root"
        >
          <View style={st.exportSectionHeader}>
            <TenderText variant="headingXL">Your Portrait — Full Report</TenderText>
            <TenderText variant="body" color={Colors.textSecondary} style={{ marginTop: 4 }}>{dateStr}</TenderText>
          </View>

          <View style={st.exportSection}>
            <TenderText variant="headingM" color={Colors.primary} style={st.exportSectionLabel}>Overview</TenderText>
            <OverviewTab
              portrait={portrait}
              userName={userName}
              overallScore={overallScore}
              onNavigate={() => {}}
              rawScores={rawScores}
              growthBoostResult={growthBoostResult}
              journeyData={journeyData}
            />
          </View>

          <View style={st.exportSection}>
            <TenderText variant="headingM" color={Colors.primary} style={st.exportSectionLabel}>Scores</TenderText>
            <ScoresTab portrait={portrait} overallScore={overallScore} rawScores={rawScores} scoreViewMode={scoreViewMode} setScoreViewMode={setScoreViewMode} />
          </View>

          <View style={st.exportSection}>
            <TenderText variant="headingM" color={Colors.primary} style={st.exportSectionLabel}>Lenses</TenderText>
            <LensesTab portrait={portrait} rawScores={rawScores} />
          </View>

          <View style={st.exportSection}>
            <TenderText variant="headingM" color={Colors.primary} style={st.exportSectionLabel}>Cycle</TenderText>
            <CycleTab portrait={portrait} rawScores={rawScores} />
          </View>

          <View style={st.exportSection}>
            <TenderText variant="headingM" color={Colors.primary} style={st.exportSectionLabel}>Growth</TenderText>
            <GrowthTab portrait={portrait} router={router} />
          </View>

          <View style={st.exportSection}>
            <TenderText variant="headingM" color={Colors.primary} style={st.exportSectionLabel}>Anchors & Partner Guide</TenderText>
            <AnchorsTab portrait={portrait} router={router} />
          </View>

          <View style={st.exportSection}>
            <TenderText variant="headingM" color={Colors.primary} style={st.exportSectionLabel}>Assessment Matrix</TenderText>
            <MatrixTab allScores={allScoresMap} portrait={portrait} />
          </View>
        </ScrollView>
      ) : (
        /* Normal mode: show active tab only */
        <ScrollView
          ref={contentScrollRef}
          style={st.contentScroll}
          contentContainerStyle={st.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Section Summary Header — shows at top of every tab */}
          {(() => {
            const tabSummary = TAB_SUMMARIES[activeTab];
            if (!tabSummary) return null;
            return (
              <SectionSummaryHeader
                summary={tabSummary.summary}
                readMinutes={tabSummary.readMinutes}
                accentColor={TABS.find(t => t.key === activeTab)?.color}
              />
            );
          })()}

          {activeTab === 'overview' && (
              <OverviewTab
                portrait={portrait}
                userName={userName}
                overallScore={overallScore}
                onNavigate={handleTabChange}
                rawScores={rawScores}
                growthBoostResult={growthBoostResult}
                journeyData={journeyData}
              />
          )}
          {activeTab === 'scores' && (
            <>
              <ScoresTab portrait={portrait} overallScore={overallScore} rawScores={rawScores} scoreViewMode={scoreViewMode} setScoreViewMode={setScoreViewMode} />
              {previousCompositeScores && (
                <ReassessmentDelta
                  previous={previousCompositeScores}
                  current={portrait.compositeScores}
                />
              )}
            </>
          )}
          {activeTab === 'lenses' && <LensesTab portrait={portrait} rawScores={rawScores} />}
          {activeTab === 'cycle' && <CycleTab portrait={portrait} rawScores={rawScores} />}
          {activeTab === 'growth' && <GrowthTab portrait={portrait} router={router} />}
          {activeTab === 'anchors' && (
            <AnchorsTab portrait={portrait} router={router} />
          )}
          {activeTab === 'matrix' && (
            <MatrixTab allScores={allScoresMap} portrait={portrait} />
          )}
          {activeTab === 'field' && (
            <YourFieldTab compositeScores={portrait.compositeScores} />
          )}

          {/* Portrait Audio Library — at bottom for non-overview tabs (overview has it inline) */}
          {activeTab !== 'overview' && <AudioLibrary portrait={portrait} />}

          {/* Try This Today CTA — shows at bottom of every tab */}
          {(() => {
            const tab = activeTab ?? 'overview';
            const action = PORTRAIT_TAB_ACTIONS[tab];
            if (!action) return null;

            // Dynamic overrides based on user progress
            let label = action.label;
            let sublabel = action.sublabel;
            let route = action.route;
            let params = action.params;

            if (tab === 'overview') {
              const nextStep = Math.min((journeyData?.stepsCompleted ?? 0) + 1, 12);
              if (nextStep > 1) {
                label = `Continue Step ${nextStep}`;
                sublabel = 'Pick up where you left off';
              }
              params = { step: String(nextStep) };
            } else if (tab === 'matrix') {
              // Don't navigate back to portrait/matrix — go to growth instead
              label = 'Explore Your Growth Edge';
              sublabel = 'Turn insight into practice';
              route = '/(app)/growth';
              params = undefined;
            }

            return (
              <TryThisTodayCTA
                Icon={action.Icon}
                label={label}
                sublabel={sublabel}
                accentColor={TABS.find(t => t.key === activeTab)?.color}
                onPress={() => router.push({
                  pathname: route as any,
                  params,
                })}
              />
            );
          })()}
        </ScrollView>
      )}

      {/* FTUE Overlays */}
      <TooltipManager screen="portrait" />
      <WelcomeAudio screenKey="portrait" />
      <QuickLinksBar />
    </SafeAreaView>
    </ErrorBoundary>
  );
}

// ═══════════════════════════════════════════════════════
// ─── TAB PANELS ──────────────────────────────────────
// ═══════════════════════════════════════════════════════

// ─── OVERVIEW TAB ───────────────────────────────────

function OverviewTab({
  portrait,
  userName,
  overallScore,
  onNavigate,
  rawScores,
  growthBoostResult: gbr,
  journeyData: jd,
}: {
  portrait: IndividualPortrait;
  userName: string;
  overallScore: number;
  onNavigate: (tab: TabKey) => void;
  rawScores: AllAssessmentScores | null;
  growthBoostResult?: GrowthBoostedResult | null;
  journeyData?: {
    stepsCompleted: number;
    totalSteps: number;
    edgeProgress: GrowthEdgeProgress[];
    totalPractices: number;
    currentStreak: number;
  } | null;
}) {
  const whoYouAre = generateWhoYouAreSections(portrait);
  const synthesis = synthesizeAssessments(portrait, portrait.supplementData);
  const cs = portrait.compositeScores;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Portrait Digest — 60 second summary */}
      <PortraitDigest portrait={portrait} />

      {/* Audio Library — expanded by default on overview */}
      <AudioLibrary portrait={portrait} defaultExpanded />

      {/* Landing hero */}
      <View style={st.heroSection}>
        <TenderText variant="label" color={Colors.primary} style={{ letterSpacing: 2 }}>YOUR RELATIONAL PORTRAIT</TenderText>
        <TenderText variant="headingXL" style={st.heroTitle}>{userName}</TenderText>
        {/* Three-Layer Dashboard replaces the single score circle */}
        <ThreeLayerDashboard
          compositeScores={cs}
          onSeeDetails={() => onNavigate('scores')}
        />
      </View>

      {/* Radar Chart — The Shape of You */}
      <RadarChart scores={cs} onDimensionTap={() => onNavigate('scores')} />

      {/* Who You Are — sectioned */}
      <TenderText variant="label" color={Colors.textMuted} style={st.sectionLabel}>WHO YOU ARE</TenderText>
      {whoYouAre.map((section, idx) => (
        <View key={section.title} style={st.card}>
          <View style={st.cardHeaderRow}>
            {section.icon}
            <TenderText variant="headingS" style={{ color: section.color }}>{section.title}</TenderText>
          </View>
          <TenderText variant="body" color={Colors.textSecondary}>{section.body}</TenderText>
        </View>
      ))}

      {/* Your Pattern in Daily Life */}
      <DailyLifeScenario portrait={portrait} />

      {/* Cross-Assessment Synthesis */}
      <SynthesisCard synthesis={synthesis} />

      {/* Field Awareness — Phase 3 (only if supplement data present) */}
      {portrait.fourLens.fieldAwareness && (
        <FieldAwarenessCard fieldAwareness={portrait.fourLens.fieldAwareness} />
      )}

      {/* A.R.E. Radar / Ring Chart */}
      <View style={st.areRingsCard}>
        <TenderText variant="label" color={Colors.primary} style={{ letterSpacing: 1.2 }}>A.R.E. ATTACHMENT QUALITY</TenderText>
        <View style={st.scoreGroupDivider} />
        <View style={st.areRingsRow}>
          <AREScoreRing label="Accessible" value={cs.accessibility} color={Colors.calm} delay={200} />
          <AREScoreRing label="Responsive" value={cs.responsiveness} color={Colors.primary} delay={400} />
          <AREScoreRing label="Engaged" value={cs.engagement} color={Colors.secondary} delay={600} />
        </View>
      </View>

      {/* Your Journey Progress */}
      {jd && (
        <View style={st.areRingsCard}>
          <TenderText variant="label" color={Colors.secondary} style={{ letterSpacing: 1.2 }}>
            YOUR JOURNEY
          </TenderText>
          <View style={st.scoreGroupDivider} />

          {/* Steps progress */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }} accessibilityRole="text" accessibilityLabel={`Steps completed: ${jd.stepsCompleted} of ${jd.totalSteps}`}>
            <TenderText variant="body" style={{ flex: 1 }}>Steps Completed</TenderText>
            <TenderText variant="body" color={Colors.secondary}>{jd.stepsCompleted}/{jd.totalSteps}</TenderText>
          </View>
          <View style={{ height: 6, backgroundColor: Colors.progressTrack, borderRadius: 3, overflow: 'hidden', marginBottom: Spacing.md }}>
            <View style={{ height: 6, borderRadius: 3, backgroundColor: Colors.primary, width: `${(jd.stepsCompleted / jd.totalSteps) * 100}%` }} />
          </View>

          {/* Growth edge pills */}
          {jd.edgeProgress.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.md }}>
              {jd.edgeProgress.map((ep) => {
                const edgeDef = portrait.growthEdges.find((e: any) => e.id === ep.edgeId);
                const stage = ep.stage ?? 'emerging';
                const stageColor = stage === 'integrated' ? Colors.success
                  : stage === 'integrating' ? Colors.primary
                  : stage === 'practicing' ? Colors.calm
                  : Colors.warning;
                return (
                  <View key={ep.edgeId} style={{
                    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
                    backgroundColor: stageColor + '15', borderWidth: 1, borderColor: stageColor + '40',
                  }}>
                    <TenderText variant="caption" color={stageColor} style={{ fontSize: FontSizes.micro }}>
                      {edgeDef?.title?.split(' ').slice(0, 3).join(' ') ?? ep.edgeId}
                    </TenderText>
                    <TenderText variant="caption" color={stageColor} style={{ fontSize: 9 }}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </TenderText>
                  </View>
                );
              })}
            </View>
          )}

          {/* Stats row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }} accessibilityRole="text" accessibilityLabel={`${jd.totalPractices} practices completed`}>
              <TenderText variant="headingM" color={Colors.primary}>{jd.totalPractices}</TenderText>
              <TenderText variant="caption" color={Colors.textMuted}>Practices</TenderText>
            </View>
            <View style={{ alignItems: 'center' }} accessibilityRole="text" accessibilityLabel={`${jd.currentStreak} day streak`}>
              <TenderText variant="headingM" color={Colors.primary}>{jd.currentStreak}</TenderText>
              <TenderText variant="caption" color={Colors.textMuted}>Day Streak</TenderText>
            </View>
            {gbr && gbr.growthBoost > 0 && (
              <View style={{ alignItems: 'center' }} accessibilityRole="text" accessibilityLabel={`Plus ${gbr.growthBoost} growth boost points`}>
                <TenderText variant="headingM" color={Colors.success}>+{gbr.growthBoost}</TenderText>
                <TenderText variant="caption" color={Colors.textMuted}>Growth Boost</TenderText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Quick Stats Grid */}
      <TenderText variant="label" color={Colors.textMuted} style={st.sectionLabel}>AT A GLANCE</TenderText>
      <View style={st.statsGrid}>
        <StatCard
          icon={STAT_ICONS.cycle}
          label="Cycle Position"
          value={portrait.negativeCycle.position.charAt(0).toUpperCase() + portrait.negativeCycle.position.slice(1)}
          color={Colors.secondary}
          delay={100}
        />
        <StatCard
          icon={STAT_ICONS.strength}
          label="Top Strength"
          value={getTopStrength(cs)}
          color={Colors.success}
          delay={200}
        />
        <StatCard
          icon={STAT_ICONS.growth}
          label="Growth Edge"
          value={portrait.growthEdges[0]?.title ?? 'Not identified'}
          color={Colors.warning}
          delay={300}
        />
        <StatCard
          icon={STAT_ICONS.values}
          label="Core Values"
          value={portrait.fourLens.values.coreValues.slice(0, 3).join(', ')}
          color={Colors.primary}
          delay={400}
        />
      </View>

      {/* Quick navigation */}
      <TenderText variant="label" color={Colors.textMuted} style={st.sectionLabel}>EXPLORE YOUR PORTRAIT</TenderText>
      <View style={st.navCards}>
        {TABS.slice(1).map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={st.navCard}
            onPress={() => onNavigate(tab.key)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Explore your ${tab.label}`}
          >
            <View style={[st.navCardIcon, { backgroundColor: tab.color }]}>
              <tab.Icon size={16} color={Colors.white} />
            </View>
            <TenderText variant="body" style={st.navCardLabel}>{tab.label}</TenderText>
            <TenderText variant="body" color={Colors.textMuted}>{'>'}</TenderText>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

// ─── FIELD AWARENESS CARD (Phase 3) ────────────────

function FieldAwarenessCard({ fieldAwareness }: { fieldAwareness: FieldAwarenessLens }) {
  const [expanded, setExpanded] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[st.synthesisCard, { opacity: fadeAnim }]}>
      <TenderText variant="label" color={Colors.depth} style={{ letterSpacing: 1.5 }}>RELATIONAL FIELD AWARENESS</TenderText>
      <View style={st.scoreGroupDivider} />

      {/* Narrative */}
      <TenderText variant="body" color={Colors.textSecondary} style={{ lineHeight: 22 }}>{fieldAwareness.narrative}</TenderText>

      {/* Score bars */}
      <View style={st.fieldScoresRow}>
        <FieldScoreBar label="Field Sensitivity" value={fieldAwareness.fieldSensitivity} color={Colors.primary} maxScale={5} />
        <FieldScoreBar label="Boundary Clarity" value={fieldAwareness.boundaryClarity} color={Colors.calm} maxScale={6} />
        <FieldScoreBar label="Pattern Awareness" value={fieldAwareness.patternAwareness} color={Colors.depth} maxScale={7} />
      </View>

      {/* Metacognitive badge */}
      {fieldAwareness.metacognitiveCapacity && (
        <View style={st.fieldBadgeRow}>
          <View style={st.fieldMetaBadge}>
            <TenderText variant="caption" color={Colors.depth}>Metacognitive Capacity</TenderText>
          </View>
          <TenderText variant="caption" color={Colors.textSecondary} style={{ flex: 1 }}>You can observe your patterns while they unfold</TenderText>
        </View>
      )}

      {/* Cross-pattern insights (expandable) */}
      {fieldAwareness.crossPatterns.length > 0 && (
        <View style={{ marginTop: Spacing.sm }}>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setExpanded(!expanded);
            }}
            style={st.fieldExpandBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Collapse cross-pattern insights' : 'Expand cross-pattern insights'}
          >
            <TenderText variant="headingS" color={Colors.primary}>
              Cross-Pattern Insights ({fieldAwareness.crossPatterns.length})
            </TenderText>
            <TenderText variant="caption" color={Colors.textSecondary}>{expanded ? '▲' : '▼'}</TenderText>
          </TouchableOpacity>
          {expanded && fieldAwareness.crossPatterns.map((insight, i) => (
            <View key={i} style={st.synthesisListItem}>
              <View style={[st.synthesisListDot, { backgroundColor: Colors.depth }]} />
              <TenderText variant="body" color={Colors.textSecondary} style={{ flex: 1, lineHeight: 20 }}>{insight}</TenderText>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

function FieldScoreBar({ label, value, color, maxScale = 7 }: { label: string; value: number; color: string; maxScale?: number }) {
  const pct = Math.max(0, Math.min(100, (value / maxScale) * 100));
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: pct,
      duration: 800,
      delay: 600,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  return (
    <View style={st.fieldScoreItem} accessibilityRole="text" accessibilityLabel={`${label}: ${value.toFixed(1)} out of ${maxScale}`}>
      <TenderText variant="caption" color={Colors.textSecondary} style={st.fieldScoreLabel}>{label}</TenderText>
      <View style={st.fieldScoreBarBg}>
        <Animated.View
          style={[
            st.fieldScoreBarFill,
            {
              backgroundColor: color,
              width: barAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <TenderText variant="caption" color={Colors.textSecondary} style={st.fieldScoreValue}>{value.toFixed(1)}/{maxScale}</TenderText>
    </View>
  );
}

// ─── SYNTHESIS CARD ─────────────────────────────────

function SynthesisCard({ synthesis }: { synthesis: AssessmentSynthesis }) {
  const stepInfo = getStep(synthesis.recommendedStep);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[st.synthesisCard, { opacity: fadeAnim }]}>
      <TenderText variant="label" color={Colors.depth} style={{ letterSpacing: 1.5 }}>CROSS-ASSESSMENT SYNTHESIS</TenderText>
      <View style={st.scoreGroupDivider} />

      {/* Primary Dynamic */}
      <View style={st.synthesisPatternBox}>
        <TenderText variant="label" color={Colors.depth}>Primary Dynamic</TenderText>
        <TenderText variant="body" style={{ lineHeight: 24 }}>{synthesis.primaryPattern}</TenderText>
      </View>

      {/* Core Narrative */}
      <CollapsibleNarrative text={synthesis.coreNarrative} previewLength={140} />

      {/* Reinforcing Factors */}
      {synthesis.reinforcingFactors.length > 0 && (
        <View style={st.synthesisSection}>
          <TenderText variant="headingS" style={st.synthesisSectionTitle}>Converging Patterns</TenderText>
          {synthesis.reinforcingFactors.map((f, i) => (
            <View key={i} style={st.synthesisListItem}>
              <View style={[st.synthesisListDot, { backgroundColor: Colors.secondary }]} />
              <TenderText variant="body" color={Colors.textSecondary} style={{ flex: 1, lineHeight: 20 }}>{f}</TenderText>
            </View>
          ))}
        </View>
      )}

      {/* Contradictions — surfaced prominently */}
      {synthesis.contradictions.length > 0 && (
        <View style={st.synthesisSection}>
          <TenderText variant="headingS" style={st.synthesisSectionTitle}>Interesting Tensions</TenderText>
          {synthesis.contradictions.map((c, i) => (
            <View key={i} style={st.synthesisListItem}>
              <View style={[st.synthesisListDot, { backgroundColor: Colors.depth }]} />
              <TenderText variant="body" color={Colors.textSecondary} style={{ flex: 1, lineHeight: 20 }}>{c}</TenderText>
            </View>
          ))}
        </View>
      )}

      {/* Protective Factors */}
      {synthesis.protectiveFactors.length > 0 && (
        <View style={st.synthesisSection}>
          <TenderText variant="headingS" style={st.synthesisSectionTitle}>Your Strengths</TenderText>
          {synthesis.protectiveFactors.map((f, i) => (
            <View key={i} style={st.synthesisListItem}>
              <View style={[st.synthesisListDot, { backgroundColor: Colors.success }]} />
              <TenderText variant="body" color={Colors.textSecondary} style={{ flex: 1, lineHeight: 20 }}>{f}</TenderText>
            </View>
          ))}
        </View>
      )}

      {/* Growth Edges */}
      {synthesis.growthEdges.length > 0 && (
        <View style={st.synthesisSection}>
          <TenderText variant="headingS" style={st.synthesisSectionTitle}>Growth Edges</TenderText>
          {synthesis.growthEdges.map((e, i) => (
            <View key={i} style={st.synthesisListItem}>
              <View style={[st.synthesisListDot, { backgroundColor: Colors.warning }]} />
              <TenderText variant="body" color={Colors.textSecondary} style={{ flex: 1, lineHeight: 20 }}>{e}</TenderText>
            </View>
          ))}
        </View>
      )}

      {/* Recommended Step */}
      <View style={st.synthesisStepBox}>
        <TenderText variant="label" color={Colors.primary} style={{ fontSize: FontSizes.micro, letterSpacing: 1.5 }}>RECOMMENDED STARTING POINT</TenderText>
        <TenderText variant="headingM">
          Step {synthesis.recommendedStep}
          {stepInfo ? `: ${stepInfo.title}` : ''}
        </TenderText>
        <TenderText variant="body" color={Colors.textSecondary} style={{ lineHeight: 20 }}>
          {synthesis.recommendedStepRationale}
        </TenderText>
      </View>
    </Animated.View>
  );
}

// ─── VALUES COMPASS INFOGRAPHIC ─────────────────────

function ValuesCompassInfographic({
  values,
}: {
  values: IndividualPortrait['fourLens']['values'];
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const topValues = values.coreValues.slice(0, 5);
  const gaps = values.significantGaps ?? [];

  return (
    <Animated.View style={[st.valuesCompassContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <CompassIcon size={16} color={Colors.textMuted} />
        <TenderText variant="label" color={Colors.primary} style={{ letterSpacing: 1.2 }}>VALUES COMPASS</TenderText>
      </View>
      <View style={st.scoreGroupDivider} />

      {/* Values ring */}
      <View style={st.valuesRing}>
        {topValues.map((v, i) => {
          const angle = (i / topValues.length) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const radius = 70;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          const gap = gaps.find((g) => g.value === v);
          const gapSize = gap?.gap ?? 0;
          const dotSize = Math.max(28, 42 - gapSize * 2);
          const dotColor = gapSize >= 5 ? Colors.warning : gapSize >= 3 ? Colors.calm : Colors.primary;

          return (
            <View
              key={v}
              style={[
                st.valuesCompassItem,
                {
                  left: 90 + x - dotSize / 2,
                  top: 90 + y - dotSize / 2,
                },
              ]}
            >
              <View style={[st.valuesCompassDot, { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: dotColor }]}>
                <TenderText variant="caption" color={Colors.white} style={{ fontSize: 13 }}>{v.charAt(0)}</TenderText>
              </View>
              <TenderText variant="caption" style={st.valuesCompassLabel} numberOfLines={1}>{v}</TenderText>
            </View>
          );
        })}
        <View style={st.valuesCompassCenter}>
          <CompassIcon size={18} color={Colors.primary} />
        </View>
      </View>

      {/* Gap bars */}
      {gaps.length > 0 && (
        <View style={st.valuesGapSection}>
          <TenderText variant="caption" style={st.valuesGapTitle}>Values-Action Gaps</TenderText>
          <TenderText variant="caption" color={Colors.textSecondary} style={st.valuesGapDescription}>
            The distance between how important a value is to you and how much you're currently living it. A gap of 3+ means this value matters deeply but your daily actions aren't yet matching.
          </TenderText>
          {gaps.map((g) => (
            <View key={g.value} style={st.valuesGapRow} accessibilityRole="text" accessibilityLabel={`${g.value}: values-action gap of ${g.gap} out of 10`}>
              <TenderText variant="caption" style={st.valuesGapLabel}>{g.value}</TenderText>
              <View style={st.valuesGapBarTrack}>
                <View style={[st.valuesGapBarFill, {
                  width: `${Math.min(100, (g.gap / 10) * 100)}%`,
                  backgroundColor: g.gap >= 5 ? Colors.warning : g.gap >= 3 ? Colors.calm : Colors.success,
                }]} />
              </View>
              <TenderText variant="caption" color={g.gap >= 5 ? Colors.warning : Colors.calm} style={st.valuesGapScore}>{g.gap}/10</TenderText>
            </View>
          ))}
          <TenderText variant="caption" color={Colors.textMuted} style={st.valuesGapHint}>
            Importance: {gaps[0]?.importance ?? '—'}/10 · Gap shows room to align action with values
          </TenderText>
        </View>
      )}
    </Animated.View>
  );
}

// ─── PARTS MAP INFOGRAPHIC ──────────────────────────

function PartsMapInfographic({
  parts,
}: {
  parts: IndividualPortrait['fourLens']['parts'];
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const selfScore = parts.selfLeadershipScore;
  const selfTier = getTierInfo(selfScore);

  return (
    <Animated.View style={[st.partsMapContainer, { opacity: fadeAnim }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <MasksIcon size={16} color={Colors.textMuted} />
        <TenderText variant="label" color={Colors.primary} style={{ letterSpacing: 1.2 }}>INNER PARTS MAP</TenderText>
      </View>
      <View style={st.scoreGroupDivider} />

      {/* Self-Leadership Circle */}
      <View style={st.partsMapCenter}>
        <View
          style={[st.partsMapSelfCircle, { borderColor: selfTier.color }]}
          accessibilityRole="text"
          accessibilityLabel={`Self-leadership score: ${selfScore} out of 100, ${selfTier.label}`}
        >
          <TenderText variant="headingM" color={selfTier.color}>{selfScore}</TenderText>
          <TenderText variant="caption" color={Colors.textMuted} align="center">Self{'\n'}Leadership</TenderText>
        </View>
      </View>

      {/* Manager Parts */}
      <View style={st.partsMapSection}>
        <View style={[st.partsMapSectionHeader, { backgroundColor: Colors.warning + '15' }]}>
          <View style={st.partsMapSectionIcon}><ShieldIcon size={16} color={Colors.warning} /></View>
          <TenderText variant="headingS">Manager Parts</TenderText>
          <TenderText variant="caption" color={Colors.textMuted} style={st.partsMapSectionHint}>Try to prevent pain</TenderText>
        </View>
        <View style={st.partsMapCards}>
          {parts.managerParts.map((p) => {
            const [title, desc] = p.includes(' — ') ? p.split(' — ') : [p, ''];
            return (
              <View key={p} style={[st.partsMapCard, { borderLeftColor: Colors.warning }]}>
                <TenderText variant="body" color={Colors.warning} style={st.partsMapCardTitle}>{title}</TenderText>
                {desc ? <TenderText variant="caption" color={Colors.textSecondary}>{desc}</TenderText> : null}
              </View>
            );
          })}
        </View>
      </View>

      {/* Firefighter Parts */}
      <View style={st.partsMapSection}>
        <View style={[st.partsMapSectionHeader, { backgroundColor: Colors.error + '12' }]}>
          <View style={st.partsMapSectionIcon}><FireIcon size={16} color={Colors.error} /></View>
          <TenderText variant="headingS">Firefighter Parts</TenderText>
          <TenderText variant="caption" color={Colors.textMuted} style={st.partsMapSectionHint}>React when pain breaks through</TenderText>
        </View>
        <View style={st.partsMapCards}>
          {parts.firefighterParts.map((p) => {
            const [title, desc] = p.includes(' — ') ? p.split(' — ') : [p, ''];
            return (
              <View key={p} style={[st.partsMapCard, { borderLeftColor: Colors.error }]}>
                <TenderText variant="body" color={Colors.error} style={st.partsMapCardTitle}>{title}</TenderText>
                {desc ? <TenderText variant="caption" color={Colors.textSecondary}>{desc}</TenderText> : null}
              </View>
            );
          })}
        </View>
      </View>

      {/* Polarities */}
      {parts.polarities.length > 0 && (
        <View style={st.partsMapSection}>
          <View style={[st.partsMapSectionHeader, { backgroundColor: Colors.depth + '10' }]}>
            <View style={st.partsMapSectionIcon}><ScaleIcon size={16} color={Colors.depth} /></View>
            <TenderText variant="headingS">Inner Tensions</TenderText>
          </View>
          {parts.polarities.map((p, i) => (
            <View key={i} style={st.partsMapPolarity}>
              <TenderText variant="caption">{p}</TenderText>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

// ─── CYCLE DIAGRAM INFOGRAPHIC ──────────────────────

function CycleDiagramInfographic({
  negativeCycle,
}: {
  negativeCycle: IndividualPortrait['negativeCycle'];
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  const isPursuer = negativeCycle.position === 'pursuer';

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[st.cycleDiagramContainer, { opacity: fadeAnim }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <RefreshIcon size={13} color={Colors.textMuted} />
        <TenderText variant="label" color={Colors.primary} style={{ fontSize: FontSizes.micro, letterSpacing: 1.0 }}>YOUR CYCLE POSITION</TenderText>
      </View>
      <View style={st.scoreGroupDivider} />

      {/* Animated cycle diagram */}
      <View style={st.cycleDiagramVisual}>
        {/* Rotating arrows */}
        <Animated.View style={[st.cycleDiagramArrowRing, { transform: [{ rotate: spin }] }]}>
          <TenderText variant="body">{'↻'}</TenderText>
        </Animated.View>

        {/* Your position */}
        <View
          style={[
            st.cycleDiagramYouBadge,
            { backgroundColor: isPursuer ? Colors.secondary : Colors.depth },
          ]}
          accessibilityRole="text"
          accessibilityLabel={`You: ${isPursuer ? 'Pursuer' : negativeCycle.position === 'withdrawer' ? 'Withdrawer' : 'Mixed'}`}
        >
          <TenderText variant="caption" color={Colors.white} style={st.cycleDiagramYouText}>You</TenderText>
          <TenderText variant="caption" color={Colors.white}>
            {isPursuer ? 'Pursuer' : negativeCycle.position === 'withdrawer' ? 'Withdrawer' : 'Mixed'}
          </TenderText>
        </View>

        {/* Partner position */}
        <View style={[
          st.cycleDiagramPartnerBadge,
          { backgroundColor: isPursuer ? Colors.depth + '60' : Colors.secondary + '60' },
        ]}>
          <TenderText variant="caption" color={Colors.white} style={st.cycleDiagramPartnerText}>Partner</TenderText>
          <TenderText variant="caption" color={Colors.white}>
            {isPursuer ? 'Withdrawer' : 'Pursuer'}
          </TenderText>
        </View>

        {/* Connection lines */}
        <View style={st.cycleDiagramLineTop}>
          <TenderText variant="caption" color={Colors.textMuted}>
            {isPursuer ? 'You pursue →' : '← Partner pursues'}
          </TenderText>
        </View>
        <View style={st.cycleDiagramLineBottom}>
          <TenderText variant="caption" color={Colors.textMuted}>
            {isPursuer ? '← Partner withdraws' : 'You withdraw →'}
          </TenderText>
        </View>
      </View>

      {/* Key insight */}
      <View style={st.cycleDiagramInsight}>
        <TenderText variant="body">
          {isPursuer
            ? 'The more you pursue, the more they withdraw. The more they withdraw, the more you pursue.'
            : 'The more you withdraw, the more they pursue. The more they pursue, the more you withdraw.'}
        </TenderText>
        <TenderText variant="caption" color={Colors.textMuted} style={{ marginTop: 4 }}>
          Neither of you is "wrong" — you're both caught in the dance.
        </TenderText>
      </View>
    </Animated.View>
  );
}

// ─── SCORES TAB ─────────────────────────────────────

function ScoresTab({
  portrait,
  overallScore,
  rawScores,
  scoreViewMode,
  setScoreViewMode,
}: {
  portrait: IndividualPortrait;
  overallScore: number;
  rawScores: AllAssessmentScores | null;
  scoreViewMode: 'numbers' | 'story';
  setScoreViewMode: (mode: 'numbers' | 'story') => void;
}) {
  const cs = portrait.compositeScores;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const SCORE_INTERPRETATIONS: Record<string, [string, string, string]> = {
    accessibility: ['Emotionally available', 'Sometimes guarded', 'Tends to withdraw'],
    responsiveness: ['Attuned to partner', 'Working on attunement', 'Needs focus'],
    engagement: ['Deeply invested', 'Moderately engaged', 'Disengaging risk'],
    regulationScore: ['Steady under stress', 'Regulation developing', 'Easily overwhelmed'],
    windowWidth: ['Wide window', 'Moderate window', 'Narrow window'],
    selfLeadership: ['Strong self-awareness', 'Building awareness', 'Self-led growth needed'],
    valuesCongruence: ['Living your values', 'Some gaps to bridge', 'Significant values gap'],
  };

  const getInterpretation = (key: string, value: number): string => {
    const [high, mid, low] = SCORE_INTERPRETATIONS[key] ?? ['Strong', 'Moderate', 'Developing'];
    if (value >= 65) return high;
    if (value >= 40) return mid;
    return low;
  };

  // Legend
  const TIERS = [
    { label: 'Strength', color: Colors.success, range: '75-100' },
    { label: 'Developing', color: Colors.calm, range: '55-74' },
    { label: 'Emerging', color: Colors.warning, range: '35-54' },
    { label: 'Focus Area', color: Colors.error, range: '0-34' },
  ];

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Overall */}
      <AnimatedScoreCircle score={overallScore} />

      {/* Legend */}
      <View style={st.legendRow}>
        {TIERS.map((t) => (
          <View key={t.label} style={st.legendItem}>
            <View style={[st.legendDot, { backgroundColor: t.color }]} />
            <TenderText variant="caption">{t.label}</TenderText>
            <TenderText variant="caption" color={Colors.textMuted}>{t.range}</TenderText>
          </View>
        ))}
      </View>

      {/* Story / Numbers toggle */}
      <ScoreViewToggle mode={scoreViewMode} onToggle={setScoreViewMode} />

      {scoreViewMode === 'story' ? (
        <ScoreStoryContent compositeScores={cs} />
      ) : (
      <>
      {/* A.R.E. Group */}
      <View style={st.scoreGroupCard}>
        <TenderText variant="label" color={Colors.primary} style={{ letterSpacing: 1.2 }}>A.R.E. — ATTACHMENT QUALITY</TenderText>
        <TenderText variant="body" color={Colors.textSecondary} style={st.scoreGroupDescription}>
          Based on Emotionally Focused Therapy: Are you emotionally reachable, do you tune in to your partner's needs, and are you invested in the connection?
        </TenderText>
        <View style={st.scoreGroupDivider} />
        <AnimatedScoreBar label="Accessible" value={cs.accessibility} delay={100} interpretation={getInterpretation('accessibility', cs.accessibility)} />
        <AnimatedScoreBar label="Responsive" value={cs.responsiveness} delay={200} interpretation={getInterpretation('responsiveness', cs.responsiveness)} />
        <AnimatedScoreBar label="Engaged" value={cs.engagement} delay={300} interpretation={getInterpretation('engagement', cs.engagement)} />
      </View>

      {/* Capacity Group */}
      <View style={st.scoreGroupCard}>
        <TenderText variant="label" color={Colors.primary} style={{ letterSpacing: 1.2 }}>CAPACITY — INNER RESOURCES</TenderText>
        <TenderText variant="body" color={Colors.textSecondary} style={st.scoreGroupDescription}>
          Your internal toolkit for staying grounded. Regulation measures how well you recover from emotional activation, window width shows how much stress you can hold, and self-leadership reflects your ability to observe your own patterns.
        </TenderText>
        <View style={st.scoreGroupDivider} />
        <AnimatedScoreBar label="Regulation" value={cs.regulationScore} delay={400} interpretation={getInterpretation('regulationScore', cs.regulationScore)} />
        <AnimatedScoreBar label="Window Width" value={cs.windowWidth} delay={500} interpretation={getInterpretation('windowWidth', cs.windowWidth)} />
        <AnimatedScoreBar label="Self-Leadership" value={cs.selfLeadership} delay={600} interpretation={getInterpretation('selfLeadership', cs.selfLeadership)} />
      </View>

      {/* Values Group */}
      <View style={st.scoreGroupCard}>
        <TenderText variant="label" color={Colors.primary} style={{ letterSpacing: 1.2 }}>VALUES — ALIGNMENT</TenderText>
        <TenderText variant="body" color={Colors.textSecondary} style={st.scoreGroupDescription}>
          How closely your daily actions match what you say matters most to you. A high score means you're living in line with your values; a lower score points to protective patterns overriding your intentions.
        </TenderText>
        <View style={st.scoreGroupDivider} />
        <AnimatedScoreBar label="Values Congruence" value={cs.valuesCongruence} delay={700} interpretation={getInterpretation('valuesCongruence', cs.valuesCongruence)} />
      </View>

      {/* Values Compass Infographic */}
      <ValuesCompassInfographic values={portrait.fourLens.values} />

      {/* Waterfall Chart — How your profile was built */}
      <WaterfallChart compositeScores={cs} />

      {/* Differentiation Spectrum (when DSI-R data available) */}
      {rawScores?.dsir && (
        <DifferentiationSpectrum dsirScores={rawScores.dsir} compositeScores={cs} />
      )}
      </>
      )}

      {/* Window of Tolerance — always visible regardless of view mode */}
      <WindowOfTolerance
        compositeScores={cs}
        activationPattern={
          cs.regulationScore > 60 ? 'balanced' :
          cs.windowWidth < 35 ? 'hyperarousal' : 'both'
        }
        triggers={portrait.negativeCycle.primaryTriggers.slice(0, 3)}
      />
    </Animated.View>
  );
}

// ─── LENSES TAB ─────────────────────────────────────

function LensesTab({ portrait, rawScores }: { portrait: IndividualPortrait; rawScores: AllAssessmentScores | null }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const hasFieldAwareness = !!portrait.fourLens.fieldAwareness;
  const hasReframes = (portrait.bigFiveReframes?.length ?? 0) > 0;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TenderText variant="body" color={Colors.textSecondary} style={st.tabIntro}>
        {hasFieldAwareness
          ? 'Five distinct perspectives that together form a complete picture of how you relate.'
          : 'Four distinct perspectives that together form a complete picture of how you relate.'}
      </TenderText>

      <PortraitLens
        title="Attachment & Protection"
        lens={portrait.fourLens.attachment}
        type="attachment"
      />
      <PortraitLens
        title="Parts & Polarities"
        lens={portrait.fourLens.parts}
        type="parts"
      />

      {/* Parts Map Infographic */}
      <PartsMapInfographic parts={portrait.fourLens.parts} />

      <PortraitLens
        title="Regulation & Window"
        lens={portrait.fourLens.regulation}
        type="regulation"
      />

      {/* EQ Heatmap — Emotional Intelligence quadrants */}
      {rawScores?.sseit && (
        <EQHeatmap sseitScores={rawScores.sseit} />
      )}

      <PortraitLens
        title="Values & Becoming"
        lens={portrait.fourLens.values}
        type="values"
      />

      {/* Values Alignment — importance vs living-it gaps */}
      {rawScores?.values && (
        <ValuesAlignment valuesScores={rawScores.values} />
      )}

      {/* Field Awareness Lens — Phase 3 (only if supplement data present) */}
      {hasFieldAwareness && portrait.fourLens.fieldAwareness && (
        <View style={st.card}>
          <View style={st.cardHeaderRow}>
            <View style={[st.lensIconCircle, { backgroundColor: Colors.depth + '20' }]}>
              <WaveIcon size={16} color={Colors.depth} />
            </View>
            <TenderText variant="headingM" style={{ flex: 1 }}>Field Awareness</TenderText>
          </View>
          <CollapsibleNarrative text={portrait.fourLens.fieldAwareness.narrative} previewLength={140} />
          {portrait.fourLens.fieldAwareness.crossPatterns.length > 0 && (
            <View style={{ marginTop: Spacing.sm }}>
              {portrait.fourLens.fieldAwareness.crossPatterns.map((cp, i) => (
                <View key={i} style={st.listItem}>
                  <TenderText variant="body" color={Colors.textMuted} style={{ lineHeight: 24 }}>{'•'}</TenderText>
                  <TenderText variant="body" style={st.listText}>{cp}</TenderText>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Big Five Relational Reframes — Phase 3 */}
      {hasReframes && (
        <BigFiveReframesSection reframes={portrait.bigFiveReframes!} />
      )}

      {/* Big Five Bars — visual personality bars with relational reframes */}
      {rawScores?.ipip && (
        <BigFiveBars ipipScores={rawScores.ipip} reframes={portrait.bigFiveReframes} />
      )}
    </Animated.View>
  );
}

// ─── BIG FIVE REFRAMES SECTION (Phase 3) ───────────

function BigFiveReframesSection({ reframes }: { reframes: string[] }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={st.card}>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(!expanded);
        }}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Collapse personality reframes' : 'Expand personality reframes'}
      >
        <View style={st.cardHeaderRow}>
          <View style={[st.lensIconCircle, { backgroundColor: Colors.secondary + '20' }]}>
            <SearchIcon size={16} color={Colors.secondary} />
          </View>
          <TenderText variant="headingM" style={{ flex: 1 }}>Personality Reframes</TenderText>
          <TenderText variant="caption" color={Colors.textSecondary}>{expanded ? '▲' : '▼'}</TenderText>
        </View>
        <TenderText variant="body" style={{ marginTop: Spacing.xs, lineHeight: 26 }}>
          Your Big Five personality traits through a relational lens — how they shape connection.
        </TenderText>
      </TouchableOpacity>
      {expanded && reframes.map((reframe, i) => (
        <View
          key={i}
          style={[st.reframeItem, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.border }]}
        >
          <TenderText variant="body" style={{ lineHeight: 26 }}>{reframe}</TenderText>
        </View>
      ))}
    </View>
  );
}

// ─── CYCLE TAB ──────────────────────────────────────

function CycleTab({ portrait, rawScores }: { portrait: IndividualPortrait; rawScores: AllAssessmentScores | null }) {
  const nc = portrait.negativeCycle;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const positionColor =
    nc.position === 'pursuer' ? Colors.secondary :
    nc.position === 'withdrawer' ? Colors.depth :
    Colors.calm;

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Position Hero */}
      <View style={[st.cycleHero, { backgroundColor: positionColor + '12' }]}>
        <View
          style={[st.cycleBadge, { backgroundColor: positionColor }]}
          accessibilityRole="text"
          accessibilityLabel={`Your cycle position: ${nc.position}`}
        >
          <TenderText variant="caption" color={Colors.white} style={st.cycleBadgeText}>
            {nc.position.toUpperCase()}
          </TenderText>
        </View>
        <TenderText variant="headingM">Your Negative Cycle</TenderText>
        <CollapsibleNarrative text={nc.description} previewLength={140} />
      </View>

      {/* Cycle Diagram */}
      <CycleDiagramInfographic negativeCycle={nc} />

      {/* Conflict Rose — 5-petal DUTCH conflict style visualization */}
      {rawScores?.dutch && (
        <ConflictRose dutchScores={rawScores.dutch} />
      )}

      {/* Triggers */}
      <View style={st.card}>
        <View style={st.cardHeaderRow}>
          <LightningIcon size={16} color={Colors.warning} />
          <TenderText variant="headingM">Triggers</TenderText>
        </View>
        {nc.primaryTriggers.map((t, i) => (
          <View key={i} style={st.listItem}>
            <TenderText variant="body" color={Colors.textMuted} style={{ lineHeight: 24 }}>{'•'}</TenderText>
            <TenderText variant="body" style={st.listText}>{t}</TenderText>
          </View>
        ))}
      </View>

      {/* Typical Moves */}
      <View style={st.card}>
        <View style={st.cardHeaderRow}>
          <MasksIcon size={16} color={Colors.secondary} />
          <TenderText variant="headingM">Typical Moves</TenderText>
        </View>
        {nc.typicalMoves.map((m, i) => (
          <View key={i} style={st.listItem}>
            <TenderText variant="body" color={Colors.textMuted} style={{ lineHeight: 24 }}>{'•'}</TenderText>
            <TenderText variant="body" style={st.listText}>{m}</TenderText>
          </View>
        ))}
      </View>

      {/* De-escalators */}
      <View style={st.card}>
        <View style={st.cardHeaderRow}>
          <DoveIcon size={16} color={Colors.calm} />
          <TenderText variant="headingM">De-escalators</TenderText>
        </View>
        {nc.deEscalators.map((d, i) => (
          <View key={i} style={st.listItem}>
            <TenderText variant="body" color={Colors.textMuted} style={{ lineHeight: 24 }}>{'•'}</TenderText>
            <TenderText variant="body" style={st.listText}>{d}</TenderText>
          </View>
        ))}
      </View>

      {/* Patterns */}
      {portrait.patterns.length > 0 && (
        <>
          <TenderText variant="label" color={Colors.textMuted} style={st.sectionLabel}>DETECTED PATTERNS</TenderText>
          {portrait.patterns.map((pattern) => (
            <View key={pattern.id} style={st.patternCard}>
              <View style={st.patternHeader}>
                <View
                  style={[st.patternBadge, {
                    backgroundColor: pattern.confidence === 'high' ? Colors.success + '20' : Colors.warning + '20',
                  }]}
                  accessibilityRole="text"
                  accessibilityLabel={`${pattern.confidence} confidence pattern`}
                >
                  <TenderText variant="caption" color={pattern.confidence === 'high' ? Colors.success : Colors.warning} style={st.patternBadgeText}>
                    {pattern.confidence} confidence
                  </TenderText>
                </View>
                <TenderText variant="caption" color={Colors.textMuted} style={{ textTransform: 'capitalize' }}>
                  {pattern.category.replace(/-/g, ' ')}
                </TenderText>
              </View>
              <TenderText variant="body" style={{ lineHeight: 22 }}>{pattern.description}</TenderText>
              <TenderText variant="body" color={Colors.textSecondary} style={{ lineHeight: 20 }}>{pattern.interpretation}</TenderText>
            </View>
          ))}
        </>
      )}
    </Animated.View>
  );
}

// ─── GROWTH TAB ─────────────────────────────────────

function GrowthTab({ portrait, router }: { portrait: IndividualPortrait; router: any }) {
  return <GrowthPlanContent portrait={portrait} router={router} />;
}

// ─── ANCHORS TAB ────────────────────────────────────

function AnchorsTab({
  portrait,
  router,
}: {
  portrait: IndividualPortrait;
  router: any;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const ANCHOR_ITEMS = [
    { key: 'whenActivated' as const, label: 'When Activated', Icon: FireIcon, color: Colors.error },
    { key: 'whenShutdown' as const, label: 'When Shutdown', Icon: SnowflakeIcon, color: Colors.depth },
    { key: 'patternInterrupt' as const, label: 'Pattern Interrupt', Icon: HourglassIcon, color: Colors.warning },
    { key: 'repair' as const, label: 'Repair', Icon: HeartIcon, color: Colors.secondary },
    { key: 'selfCompassion' as const, label: 'Self-Compassion', Icon: GreenHeartIcon, color: Colors.primary },
  ];

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TenderText variant="body" color={Colors.textSecondary} style={st.tabIntro}>
        Short phrases for difficult moments. Save the ones that resonate.
      </TenderText>

      {/* Quick access by emotional state */}
      <AnchorQuickAccess anchorPoints={portrait.anchorPoints} />

      {ANCHOR_ITEMS.slice(0, 2).map(({ key, label, Icon, color }) => {
        const anchor = portrait.anchorPoints[key];
        // Handle both old (string) and new (AnchorCategory) formats
        const isRich = typeof anchor === 'object' && anchor !== null;
        return (
          <View key={key} style={st.anchorCard}>
            <View style={st.anchorCardHeader}>
              <View style={[st.anchorIcon, { backgroundColor: color + '15' }]}>
                <Icon size={18} color={color} />
              </View>
              <TenderText variant="label" color={color}>{label}</TenderText>
            </View>
            <TenderText variant="body" style={st.anchorText}>
              {isRich ? (anchor as any).primary : anchor}
            </TenderText>
            {isRich && (
              <>
                <TenderText variant="label" color={Colors.textSecondary} style={st.anchorSubhead}>Remember</TenderText>
                {((anchor as any).whatToRemember ?? []).map((item: string, i: number) => (
                  <TenderText key={`r${i}`} variant="body" style={st.anchorListItem}>{'•'} {item}</TenderText>
                ))}
                <TenderText variant="label" color={Colors.textSecondary} style={st.anchorSubhead}>Do</TenderText>
                {((anchor as any).whatToDo ?? []).map((item: string, i: number) => (
                  <TenderText key={`d${i}`} variant="body" style={st.anchorListItem}>{'•'} {item}</TenderText>
                ))}
                <TenderText variant="label" color={Colors.textSecondary} style={st.anchorSubhead}>Don't</TenderText>
                {((anchor as any).whatNotToDo ?? []).map((item: string, i: number) => (
                  <TenderText key={`n${i}`} variant="body" style={st.anchorListItem}>{'•'} {item}</TenderText>
                ))}
              </>
            )}
          </View>
        );
      })}

      {/* Pattern Interrupts */}
      {(() => {
        const pi = portrait.anchorPoints.patternInterrupt;
        const isArr = Array.isArray(pi);
        return (
          <View style={st.anchorCard}>
            <View style={st.anchorCardHeader}>
              <View style={[st.anchorIcon, { backgroundColor: Colors.warning + '15' }]}>
                <HourglassIcon size={18} color={Colors.warning} />
              </View>
              <TenderText variant="label" color={Colors.warning}>Pattern Interrupts</TenderText>
            </View>
            {isArr ? (pi as string[]).map((item, i) => (
              <TenderText key={i} variant="body" style={st.anchorText}>"{item}"</TenderText>
            )) : (
              <TenderText variant="body" style={st.anchorText}>{pi}</TenderText>
            )}
          </View>
        );
      })()}

      {/* Repair */}
      {(() => {
        const rep = portrait.anchorPoints.repair;
        const isRich = typeof rep === 'object' && rep !== null && !Array.isArray(rep);
        return (
          <View style={st.anchorCard}>
            <View style={st.anchorCardHeader}>
              <View style={[st.anchorIcon, { backgroundColor: Colors.secondary + '15' }]}>
                <HeartIcon size={18} color={Colors.secondary} />
              </View>
              <TenderText variant="label" color={Colors.secondary}>Repair</TenderText>
            </View>
            {isRich ? (
              <>
                <TenderText variant="label" color={Colors.textSecondary} style={st.anchorSubhead}>Signs you're ready</TenderText>
                {((rep as any).signsYoureReady ?? []).map((item: string, i: number) => (
                  <TenderText key={`s${i}`} variant="body" style={st.anchorListItem}>{'•'} {item}</TenderText>
                ))}
                <TenderText variant="label" color={Colors.textSecondary} style={st.anchorSubhead}>Try saying</TenderText>
                {((rep as any).repairStarters ?? []).map((item: string, i: number) => (
                  <TenderText key={`rs${i}`} variant="body" style={st.anchorText}>"{item}"</TenderText>
                ))}
              </>
            ) : (
              <TenderText variant="body" style={st.anchorText}>{String(rep)}</TenderText>
            )}
          </View>
        );
      })()}

      {/* Self-Compassion */}
      {(() => {
        const sc = portrait.anchorPoints.selfCompassion;
        const isRich = typeof sc === 'object' && sc !== null;
        return (
          <View style={st.anchorCard}>
            <View style={st.anchorCardHeader}>
              <View style={[st.anchorIcon, { backgroundColor: Colors.primary + '15' }]}>
                <GreenHeartIcon size={18} color={Colors.primary} />
              </View>
              <TenderText variant="label" color={Colors.primary}>Self-Compassion</TenderText>
            </View>
            {isRich ? (
              <>
                {((sc as any).reminders ?? []).map((item: string, i: number) => (
                  <TenderText key={`r${i}`} variant="body" style={st.anchorListItem}>{'•'} {item}</TenderText>
                ))}
                {(sc as any).personalizedMessage && (
                  <View style={[st.insightBox, { marginTop: 8 }]}>
                    <TenderText variant="body">{(sc as any).personalizedMessage}</TenderText>
                  </View>
                )}
              </>
            ) : (
              <TenderText variant="body" style={st.anchorText}>{sc as string}</TenderText>
            )}
          </View>
        );
      })()}

      {/* Partner Guide */}
      <TenderText variant="label" color={Colors.textMuted} style={st.sectionLabel}>FOR YOUR PARTNER</TenderText>
      <View style={st.card}>
        <CollapsibleNarrative text={portrait.partnerGuide.whatToKnow} previewLength={140} />
      </View>

      {/* Deepest longing — the most therapeutically powerful sentence */}
      {portrait.partnerGuide.deepestLonging && (
        <View style={[st.card, { borderLeftWidth: 3, borderLeftColor: Colors.primary }]}>
          <TenderText variant="headingM">What I really need you to understand</TenderText>
          <TenderText variant="body" style={{ lineHeight: 26 }}>
            "{portrait.partnerGuide.deepestLonging}"
          </TenderText>
        </View>
      )}

      <View style={st.card}>
        <TenderText variant="headingM">When I'm struggling, I need...</TenderText>
        {portrait.partnerGuide.whenStrugglingINeed.map((item, i) => (
          <View key={i} style={st.listItem}>
            <TenderText variant="body" color={Colors.textMuted} style={{ lineHeight: 24 }}>{'•'}</TenderText>
            <TenderText variant="body" style={st.listText}>{item}</TenderText>
          </View>
        ))}
      </View>

      {/* State-specific guidance (new enriched fields) */}
      {portrait.partnerGuide.whenActivated && (
        <View style={st.card}>
          <TenderText variant="headingM" color={Colors.error}>When I'm activated (fight/flight)</TenderText>
          <TenderText variant="label" color={Colors.textSecondary} style={st.anchorSubhead}>What helps</TenderText>
          {portrait.partnerGuide.whenActivated.whatHelps.map((item, i) => (
            <TenderText key={`ah${i}`} variant="body" style={st.anchorListItem}>{'•'} {item}</TenderText>
          ))}
          <TenderText variant="label" color={Colors.textSecondary} style={st.anchorSubhead}>What to say</TenderText>
          {portrait.partnerGuide.whenActivated.whatToSay.map((item, i) => (
            <TenderText key={`as${i}`} variant="body" style={st.anchorText}>"{item}"</TenderText>
          ))}
        </View>
      )}

      {portrait.partnerGuide.whenShutdown && (
        <View style={st.card}>
          <TenderText variant="headingM" color={Colors.depth}>When I've shut down (freeze)</TenderText>
          <TenderText variant="label" color={Colors.textSecondary} style={st.anchorSubhead}>What helps</TenderText>
          {portrait.partnerGuide.whenShutdown.whatHelps.map((item, i) => (
            <TenderText key={`sh${i}`} variant="body" style={st.anchorListItem}>{'•'} {item}</TenderText>
          ))}
          <TenderText variant="label" color={Colors.textSecondary} style={st.anchorSubhead}>What to say</TenderText>
          {portrait.partnerGuide.whenShutdown.whatToSay.map((item, i) => (
            <TenderText key={`ss${i}`} variant="body" style={st.anchorText}>"{item}"</TenderText>
          ))}
        </View>
      )}

      {/* General helps/doesn't */}
      <View style={st.card}>
        <View style={st.twoCol}>
          <View style={st.colCard}>
            <TenderText variant="label" color={Colors.success} style={st.colCardTitle}>What helps</TenderText>
            {portrait.partnerGuide.whatHelps.map((item, i) => (
              <TenderText key={i} variant="caption">{'•'} {item}</TenderText>
            ))}
          </View>
          <View style={st.colCard}>
            <TenderText variant="label" color={Colors.error} style={st.colCardTitle}>What doesn't</TenderText>
            {portrait.partnerGuide.whatDoesntHelp.map((item, i) => (
              <TenderText key={i} variant="caption">{'•'} {item}</TenderText>
            ))}
          </View>
        </View>
      </View>

      {/* What's Next */}
      <TenderText variant="label" color={Colors.textMuted} style={st.sectionLabel}>WHAT'S NEXT</TenderText>
      <View style={st.card}>
        <TenderText variant="body" style={{ lineHeight: 26 }}>
          This portrait is a starting point, not a verdict. Return to it when you
          are stuck, share it with your partner when you are ready, and use it as
          a guide for the work ahead.
        </TenderText>
      </View>

      <TouchableOpacity
        style={st.ctaButton}
        onPress={() => router.push('/(app)/chat' as any)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Talk with Nuance AI about your portrait"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TenderText variant="button" color={Colors.white}>Nuance AI</TenderText>
          <SparkleIcon size={14} color={Colors.white} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={st.ctaButtonOutline}
        onPress={() => router.push('/(app)/exercises' as any)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Browse growth exercises to practice"
      >
        <TenderText variant="button" color={Colors.primary}>Practice an Exercise</TenderText>
      </TouchableOpacity>

      <View style={{ height: Spacing.xxl }} />
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════
// ─── STYLES ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════

const CIRCLE_SIZE = 100;
const CIRCLE_BORDER = 6;

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  viewAndEraseBanner: {
    backgroundColor: Colors.warning + '20',
    borderWidth: 1,
    borderColor: Colors.warning + '40',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  // viewAndEraseBannerText — text props moved to TenderText
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  // errorText — text props moved to TenderText
  button: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  // buttonText — text props moved to TenderText

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerBackBtn: {
    width: 70,
  },
  // headerBackText — text props moved to TenderText
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  // headerTitle — text props moved to TenderText
  // headerDate — text props moved to TenderText

  // ── Tab Bar ──
  tabBarWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surfaceElevated,
  },
  tabBarContent: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingRight: 28,
    gap: Spacing.xs,
  },
  tabScrollHint: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated + 'E0',
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
  // tabLabel — text props moved to TenderText

  // ── Content ──
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 200,
  },

  // ── Hero ──
  heroSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  // heroEyebrow — text props moved to TenderText
  heroTitle: {
    textTransform: 'capitalize',
  },

  // ── Score Circle ──
  scoreCircleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  scoreCircleOuter: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: CIRCLE_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.elevated,
  },
  // scoreCircleNumber — text props moved to TenderText
  scoreCircleLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: -2,
  },
  scoreCircleTier: {
    marginTop: Spacing.xs,
  },

  // ── A.R.E. Rings ──
  areRingsCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  areRingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
  },
  areRingItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  areRingOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.subtle,
  },
  areRingTrack: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
  },
  // areRingValue — text props moved to TenderText
  areRingLabel: {
  },
  areRingTier: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Cards ──
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  // cardHeading — text props moved to TenderText
  // cardBody — text props moved to TenderText
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardHeaderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // ── Section Label ──
  sectionLabel: {
    letterSpacing: 1.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },

  // ── Stats Grid ──
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    width: (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.subtle,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // statIconText — unused, text props moved to TenderText
  statLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
  },

  // ── Navigation Cards ──
  navCards: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  navCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // navCardIconText — unused, text props moved to TenderText
  navCardLabel: {
    flex: 1,
  },
  // navCardArrow — pure text, moved to TenderText

  // ── Legend ──
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // legendText — pure text, moved to TenderText
  // legendRange — pure text, moved to TenderText

  // ── Score Group Card ──
  scoreGroupCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  scoreGroupLabel: {
    letterSpacing: 1.2,
  },
  scoreGroupDescription: {
    marginTop: 4,
    marginBottom: 4,
  },
  scoreGroupDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.xs,
  },

  // ── Animated Score Bar ──
  barContainer: {
    gap: 3,
    marginBottom: Spacing.sm,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // barLabel — pure text, moved to TenderText
  // barValue — pure text, moved to TenderText
  barTrack: {
    height: 14,
    backgroundColor: Colors.surface,
    borderRadius: 7,
    overflow: 'hidden',
  },
  barFill: {
    height: 14,
    borderRadius: 7,
  },
  // barInterpretation — pure text, moved to TenderText

  // ── Tab Intro ──
  tabIntro: {
    marginBottom: Spacing.lg,
  },

  // ── Cycle Tab ──
  cycleHero: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  cycleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  cycleBadgeText: {
    letterSpacing: 1.0,
  },
  // cycleHeroTitle — pure text, moved to TenderText
  // cycleHeroBody — pure text, moved to TenderText

  // ── Lists ──
  listItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  // listBullet — pure text, moved to TenderText
  listText: {
    flex: 1,
  },

  // ── Patterns ──
  patternCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patternBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  patternBadgeText: {
    textTransform: 'capitalize',
  },
  patternCategory: {
    textTransform: 'capitalize',
  },
  // patternDescription — pure text, moved to TenderText
  // patternInterpretation — pure text, moved to TenderText

  // ── Protocol / Growth Plan styles ──
  protocolSection: {
    marginBottom: Spacing.xl,
  },
  protocolEyebrow: {
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  protocolName: {
    marginBottom: Spacing.sm,
  },
  protocolDescription: {
    marginBottom: Spacing.lg,
  },
  movementsContainer: {
    marginBottom: Spacing.lg,
  },
  movementsSectionTitle: {
    marginBottom: Spacing.xs,
  },
  movementsSubtitle: {
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
  movementIcon: {
    marginRight: Spacing.sm,
  },
  // movementName — pure text, moved to TenderText
  // movementQuestion — pure text, moved to TenderText
  // movementScore — pure text, moved to TenderText
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
  // movementDescription — pure text, moved to TenderText
  phasesContainer: {
    marginBottom: Spacing.lg,
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
  // phaseName — pure text, moved to TenderText
  // phaseWeeks — pure text, moved to TenderText
  phaseFocus: {
    paddingLeft: Spacing.md + Spacing.sm,
  },
  phaseExercises: {
    marginTop: Spacing.sm,
    paddingLeft: Spacing.md + Spacing.sm,
  },
  phaseExercisesLabel: {
    letterSpacing: 0.8,
    marginBottom: 6,
  },
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
  },
  exerciseRowMeta: {
    marginRight: 8,
  },
  // exerciseRowArrow — pure text, moved to TenderText
  guidanceContainer: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  guidanceTitle: {
    marginBottom: Spacing.sm,
  },
  guidanceItem: {
    marginBottom: Spacing.xs,
  },

  // ── Growth Edges ──
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
  // growthEdgeNumberText — pure text, moved to TenderText
  growthEdgeHeaderText: {
    flex: 1,
    gap: 2,
  },
  growthEdgeLabel: {
    letterSpacing: 1,
  },
  // growthEdgeTitle — pure text, moved to TenderText
  // growthEdgeDescription — pure text, moved to TenderText
  growthEdgeRationaleBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  // growthEdgeRationale — pure text, moved to TenderText
  practicesSection: {
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  practicesTitle: {
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
  // practiceCheckboxText — pure text, moved to TenderText
  practiceText: {
    flex: 1,
  },

  // ── Anchors ──
  anchorCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  anchorCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  anchorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // anchorIconText — pure text, moved to TenderText
  anchorLabel: {
    letterSpacing: 0.5,
  },
  anchorText: {
    marginBottom: 4,
  },
  anchorSubhead: {
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 4,
  },
  anchorListItem: {
    paddingLeft: 4,
    marginBottom: 2,
  },
  insightBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  // insightText — pure text, moved to TenderText

  // ── Two Column ──
  twoCol: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  colCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  colCardTitle: {
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  // colCardItem — pure text, moved to TenderText


  // ── Values Compass Infographic ──
  valuesCompassContainer: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  valuesRing: {
    width: 210,
    height: 210,
    alignSelf: 'center',
    position: 'relative',
    marginVertical: Spacing.md,
  },
  valuesCompassItem: {
    position: 'absolute',
    alignItems: 'center',
    width: 60,
  },
  valuesCompassDot: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  // valuesCompassDotText — pure text, moved to TenderText
  valuesCompassLabel: {
    marginTop: 3,
  },
  valuesCompassCenter: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    left: 83,
    top: 83,
    ...Shadows.subtle,
  },
  // valuesCompassCenterText — pure text, moved to TenderText
  valuesGapSection: {
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  valuesGapTitle: {
    marginBottom: 2,
  },
  valuesGapDescription: {
    marginBottom: 6,
  },
  valuesGapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  valuesGapLabel: {
    width: 80,
  },
  valuesGapBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  valuesGapBarFill: {
    height: 8,
    borderRadius: 4,
  },
  valuesGapScore: {
    width: 24,
  },
  valuesGapHint: {
    marginTop: 4,
  },

  // ── Parts Map Infographic ──
  partsMapContainer: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  partsMapCenter: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  partsMapSelfCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.elevated,
  },
  // partsMapSelfScore — pure text, moved to TenderText
  // partsMapSelfLabel — pure text, moved to TenderText
  partsMapSection: {
    gap: Spacing.xs,
  },
  partsMapSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  partsMapSectionIcon: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  // partsMapSectionTitle — pure text, moved to TenderText
  partsMapSectionHint: {
    flex: 1,
  },
  partsMapPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  partsMapPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  // partsMapPillText — pure text, moved to TenderText
  partsMapCards: {
    gap: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  partsMapCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs + 2,
  },
  partsMapCardTitle: {
    marginBottom: 2,
  },
  // partsMapCardDesc — pure text, moved to TenderText
  partsMapPolarity: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.depth + '08',
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.depth,
  },
  // partsMapPolarityText — pure text, moved to TenderText

  // ── Cycle Diagram Infographic ──
  cycleDiagramContainer: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  cycleDiagramVisual: {
    height: 160,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleDiagramArrowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // cycleDiagramArrow — pure text, moved to TenderText
  cycleDiagramYouBadge: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -28,
    width: 78,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.elevated,
  },
  cycleDiagramYouText: {
    letterSpacing: 0.6,
  },
  // cycleDiagramYouRole — pure text, moved to TenderText
  cycleDiagramPartnerBadge: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -28,
    width: 78,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleDiagramPartnerText: {
    letterSpacing: 0.6,
  },
  // cycleDiagramPartnerRole — pure text, moved to TenderText
  cycleDiagramLineTop: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
  },
  cycleDiagramLineBottom: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  // cycleDiagramLineLabel — pure text, moved to TenderText
  cycleDiagramInsight: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
  },
  // cycleDiagramInsightText — pure text, moved to TenderText
  cycleDiagramInsightSub: {
    marginTop: 4,
  },

  // ── CTA Buttons ──
  ctaButton: {
    backgroundColor: Colors.secondary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  // ctaButtonText — pure text, moved to TenderText
  ctaButtonOutline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  // ctaButtonOutlineText — pure text, moved to TenderText

  // ── Synthesis Card ──
  synthesisCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.depth,
    ...Shadows.card,
  },
  synthesisSectionLabel: {
    letterSpacing: 1.5,
  },
  synthesisPatternBox: {
    backgroundColor: `${Colors.depth}15`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  synthesisPatternLabel: {
    letterSpacing: 1,
  },
  // synthesisPatternText — pure text, moved to TenderText
  // synthesisNarrative — pure text, moved to TenderText
  synthesisSection: {
    gap: Spacing.xs,
  },
  synthesisSectionTitle: {
    marginBottom: 2,
  },
  synthesisListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: 2,
  },
  synthesisListDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  synthesisListText: {
    flex: 1,
  },
  synthesisStepBox: {
    backgroundColor: `${Colors.primary}12`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  synthesisStepLabel: {
    letterSpacing: 1.5,
  },
  // synthesisStepName — pure text, moved to TenderText
  // synthesisStepRationale — pure text, moved to TenderText

  // ── Growth Progress ──
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
  // growthProgressLabel — pure text, moved to TenderText
  // growthProgressPct — pure text, moved to TenderText
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
  // phaseProgressMiniLabel — pure text, moved to TenderText

  // ── Exercise Done States ──
  exerciseRowDone: {
    backgroundColor: Colors.success + '20',
    opacity: 0.85,
  },
  exerciseCheckmark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.success,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 10,
  },
  // exerciseCheckmarkText — pure text, moved to TenderText
  // exerciseRowTitleDone — pure text (color override), moved to TenderText
  phaseProgressText: {
    marginTop: 4,
  },

  // ── Phase Completion Summary ──
  phaseCompleteSummary: {
    backgroundColor: Colors.success + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  phaseCompleteIcon: {
    marginBottom: 4,
  },
  phaseCompleteTitle: {
    marginBottom: 4,
  },
  // phaseCompleteText — pure text, moved to TenderText

  // ── Export Mode Styles ──
  exportSectionHeader: {
    alignItems: 'center' as const,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  // exportTitle — pure text, moved to TenderText
  exportDate: {
    marginTop: 4,
  },
  exportSection: {
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exportSectionLabel: {
    marginBottom: Spacing.md,
    letterSpacing: 1.5,
  },

  // ── Phase 3: Field Awareness styles ──
  fieldScoresRow: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  fieldScoreItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: Spacing.xs,
  },
  fieldScoreLabel: {
    width: 110,
  },
  fieldScoreBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  fieldScoreBarFill: {
    height: 6,
    borderRadius: 3,
  },
  fieldScoreValue: {
    width: 36,
  },
  fieldBadgeRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  fieldMetaBadge: {
    backgroundColor: Colors.depth + '18',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  // fieldMetaBadgeText — pure text, moved to TenderText
  fieldMetaHint: {
    flex: 1,
  },
  fieldExpandBtn: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: Spacing.xs,
  },
  // fieldExpandLabel — pure text, moved to TenderText
  // fieldExpandArrow — pure text, moved to TenderText

  // ── Phase 3: Lens icon + Reframes styles ──
  lensIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: Spacing.xs,
  },
  reframeItem: {
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
