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
  Text,
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { TooltipManager } from '@/components/ftue/TooltipManager';
import { WelcomeAudio } from '@/components/ftue/WelcomeAudio';
import HomeButton from '@/components/HomeButton';
import { getPortrait } from '@/services/portrait';
import { getUserConsent, eraseUserData } from '@/services/consent';
import {
  Colors,
  Spacing,
  FontSizes,
  ButtonSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { IndividualPortrait } from '@/types';
import type { FieldAwarenessLens } from '@/types/portrait';

import PortraitLens from '@/components/portrait/PortraitLens';
import AppIcon from '@/components/ui/AppIcon';
import { synthesizeAssessments, type AssessmentSynthesis } from '@/utils/portrait/assessment-synthesis';
import { getStep } from '@/utils/steps/twelve-steps';
import { STAT_ICONS } from '@/constants/icons';
import type { IconComponent } from '@/constants/icons';

// ── Sprint 4: New visualization imports ──
import RadarChart from '@/components/visualizations/RadarChart';
import ThreeLayerDashboard from '@/components/portrait/ThreeLayerDashboard';
import WaterfallChart from '@/components/visualizations/WaterfallChart';
import ConflictRose from '@/components/visualizations/ConflictRose';
import EQHeatmap from '@/components/visualizations/EQHeatmap';
import ValuesAlignment from '@/components/visualizations/ValuesAlignment';
import BigFiveBars from '@/components/visualizations/BigFiveBars';
import WindowOfTolerance from '@/components/visualizations/WindowOfTolerance';
import DifferentiationSpectrum from '@/components/visualizations/DifferentiationSpectrum';
import { fetchAllScores } from '@/services/portrait';
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
} from '@/assets/graphics/icons';
import { getExerciseById } from '@/utils/interventions/registry';
import { getExercisesForEdge } from '@/utils/portrait/growth-edges';
import { CATEGORY_ACCENT_COLORS } from '@/components/intervention/ExerciseCard';
import { useFocusEffect } from '@react-navigation/native';
import { getCompletions } from '@/services/intervention';
import { calculateGrowthProgress, boostMovementsFromProgress } from '@/utils/steps/intervention-protocols';
import type { GrowthProgress } from '@/utils/steps/intervention-protocols';
import GrowthPlanContent from '@/components/growth/GrowthPlanContent';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Tab definitions ────────────────────────────────────

type TabKey = 'overview' | 'scores' | 'lenses' | 'cycle' | 'growth' | 'anchors';

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
];

// ─── Narrative generator ────────────────────────────────

function generateLandingNarrative(portrait: IndividualPortrait): string {
  const cs = portrait.compositeScores;
  const nc = portrait.negativeCycle;

  const strengths: string[] = [];
  const growth: string[] = [];

  if (cs.accessibility >= 60) strengths.push('emotional openness');
  if (cs.responsiveness >= 60) strengths.push('attunement to others');
  if (cs.engagement >= 60) strengths.push('relational investment');
  if (cs.selfLeadership >= 60) strengths.push('self-awareness');
  if (cs.valuesCongruence >= 60) strengths.push('values alignment');
  if (cs.regulationScore >= 60) strengths.push('emotional regulation');

  if (cs.regulationScore < 40) growth.push('widening your emotional window');
  if (cs.windowWidth < 40) growth.push('building tolerance for discomfort');
  if (cs.valuesCongruence < 40) growth.push('aligning your actions with your values');
  if (cs.selfLeadership < 40) growth.push('developing your inner compass');

  const strengthText = strengths.length > 0
    ? `Your profile shows real strength in ${strengths.slice(0, 3).join(', ')}`
    : 'Your profile reveals a complex, nuanced picture of how you relate';

  const growthText = growth.length > 0
    ? `, with opportunities to grow in ${growth.slice(0, 2).join(' and ')}`
    : ', with a solid foundation to build on';

  const cycleText = nc.position === 'pursuer'
    ? 'You tend to move toward connection under stress — reaching for reassurance and closeness.'
    : nc.position === 'withdrawer'
    ? 'You tend to pull inward under stress — creating space to protect yourself.'
    : nc.position === 'mixed'
    ? 'Your response to stress is nuanced — sometimes reaching toward, sometimes pulling back.'
    : 'You show flexibility in how you respond to relational stress — adapting to the moment.';

  return `${strengthText}${growthText}.\n\n${cycleText} This isn't a flaw — it's a strategy that developed for good reasons. Understanding it is the first step toward choosing something different when you're ready.`;
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
    <Animated.View style={[st.barContainer, { opacity: opacityAnim }]}>
      <View style={st.barLabelRow}>
        <Text style={st.barLabel}>{label}</Text>
        <Text style={[st.barValue, { color: tier.color }]}>{value}</Text>
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
        <Text style={[st.barInterpretation, { color: tier.color }]}>
          {interpretation}
        </Text>
      )}
    </Animated.View>
  );
}

// ─── Animated Score Circle ─────────────────────────────

function AnimatedScoreCircle({ score }: { score: number }) {
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
      <View style={[st.scoreCircleOuter, { borderColor: tier.color }]}>
        <Text style={[st.scoreCircleNumber, { color: tier.color }]}>
          {displayCount}
        </Text>
        <Text style={st.scoreCircleLabel}>overall</Text>
      </View>
      <Text style={[st.scoreCircleTier, { color: tier.color }]}>{tier.label}</Text>
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
      <Text style={st.statLabel}>{label}</Text>
      <Text style={st.statValue} numberOfLines={2}>{value}</Text>
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
      <View style={[st.areRingOuter, { borderColor: color }]}>
        {/* Background track */}
        <View style={[st.areRingTrack, { borderColor: color + '20' }]} />
        <Text style={[st.areRingValue, { color }]}>{displayCount}</Text>
      </View>
      <Text style={st.areRingLabel}>{label}</Text>
      <Text style={[st.areRingTier, { color: tier.color }]}>{tier.label}</Text>
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
  const [loading, setLoading] = useState(true);
  const initialTab = (params.tab as TabKey) || 'overview';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [exportMode, setExportMode] = useState(false);
  const [isViewAndErase, setIsViewAndErase] = useState(false);
  const viewAndEraseRef = useRef(false); // stable ref for cleanup
  const tabScrollRef = useRef<ScrollView>(null);
  const contentScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!user) return;
    // Load portrait + raw assessment scores in parallel
    Promise.all([
      getPortrait(user.id),
      fetchAllScores(user.id).catch(() => null),
    ])
      .then(([p, scoresMap]) => {
        setPortrait(p);
        if (scoresMap) {
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
      })
      .catch((err) => {
        console.error('[Portrait] Failed to load portrait:', err);
      })
      .finally(() => setLoading(false));

    // Check if consent is view-and-erase
    getUserConsent(user.id).then((consent) => {
      if (consent?.consentType === 'view_and_erase') {
        setIsViewAndErase(true);
        viewAndEraseRef.current = true;
      }
    });
  }, [user]);

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
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!portrait) {
    return (
      <SafeAreaView style={st.container}>
        <View style={st.center}>
          <Text style={st.errorText}>
            No portrait found. Complete all 6 assessments first.
          </Text>
          <TouchableOpacity
            style={st.button}
            onPress={() => router.replace('/(app)/home')}
          >
            <Text style={st.buttonText}>Back to Home</Text>
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
  const overallScore = getOverallScore(portrait.compositeScores);

  return (
    <SafeAreaView style={st.container}>
      {/* ── Header ────────────────────────────────── */}
      <View style={st.header}>
        <TouchableOpacity
          onPress={() => router.replace('/(app)/home')}
          activeOpacity={0.7}
          style={st.headerBackBtn}
        >
          <Text style={st.headerBackText}>{'<'} Back</Text>
        </TouchableOpacity>
        <View style={st.headerCenter}>
          <Text style={st.headerTitle}>Your Portrait</Text>
          <Text style={st.headerDate}>{dateStr}</Text>
        </View>
        {Platform.OS === 'web' ? (
          <TouchableOpacity
            onPress={handleExportAll}
            activeOpacity={0.7}
            style={[st.headerBackBtn, { alignItems: 'flex-end' }]}
          >
            <Text style={st.headerBackText}>{exportMode ? 'Printing...' : 'Export All'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              try {
                const { generatePortraitPDF } = await import('@/services/pdf-export');
                await generatePortraitPDF(portrait);
              } catch (err) {
                if (__DEV__) console.warn('[Export] Native PDF failed:', err);
                Alert.alert('Export Error', 'Could not generate PDF. Please try again.');
              }
            }}
            activeOpacity={0.7}
            style={[st.headerBackBtn, { alignItems: 'flex-end' }]}
          >
            <Text style={st.headerBackText}>Export PDF</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── View-and-Erase Warning ─────────────── */}
      {isViewAndErase && (
        <View style={st.viewAndEraseBanner}>
          <Text style={st.viewAndEraseBannerText}>
            One-time view — your data will be erased when you leave this screen
          </Text>
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
          {TABS.map((tab) => {
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
              >
                <View style={st.tabIcon}>
                  <tab.Icon size={14} color={isActive ? tab.color : Colors.textMuted} />
                </View>
                <Text
                  style={[
                    st.tabLabel,
                    isActive && { color: tab.color, fontWeight: '700' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
            <Text style={st.exportTitle}>Your Portrait — Full Report</Text>
            <Text style={st.exportDate}>{dateStr}</Text>
          </View>

          <View style={st.exportSection}>
            <Text style={st.exportSectionLabel}>Overview</Text>
            <OverviewTab
              portrait={portrait}
              userName={userName}
              overallScore={overallScore}
              onNavigate={() => {}}
              rawScores={rawScores}
            />
          </View>

          <View style={st.exportSection}>
            <Text style={st.exportSectionLabel}>Scores</Text>
            <ScoresTab portrait={portrait} overallScore={overallScore} rawScores={rawScores} />
          </View>

          <View style={st.exportSection}>
            <Text style={st.exportSectionLabel}>Lenses</Text>
            <LensesTab portrait={portrait} rawScores={rawScores} />
          </View>

          <View style={st.exportSection}>
            <Text style={st.exportSectionLabel}>Cycle</Text>
            <CycleTab portrait={portrait} rawScores={rawScores} />
          </View>

          <View style={st.exportSection}>
            <Text style={st.exportSectionLabel}>Growth</Text>
            <GrowthTab portrait={portrait} router={router} />
          </View>

          <View style={st.exportSection}>
            <Text style={st.exportSectionLabel}>Anchors & Partner Guide</Text>
            <AnchorsTab portrait={portrait} router={router} />
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
          {activeTab === 'overview' && (
            <OverviewTab
              portrait={portrait}
              userName={userName}
              overallScore={overallScore}
              onNavigate={handleTabChange}
              rawScores={rawScores}
            />
          )}
          {activeTab === 'scores' && (
            <ScoresTab portrait={portrait} overallScore={overallScore} rawScores={rawScores} />
          )}
          {activeTab === 'lenses' && <LensesTab portrait={portrait} rawScores={rawScores} />}
          {activeTab === 'cycle' && <CycleTab portrait={portrait} rawScores={rawScores} />}
          {activeTab === 'growth' && <GrowthTab portrait={portrait} router={router} />}
          {activeTab === 'anchors' && (
            <AnchorsTab portrait={portrait} router={router} />
          )}
        </ScrollView>
      )}

      {/* FTUE Overlays */}
      <TooltipManager screen="portrait" />
      <WelcomeAudio screenKey="portrait" />
      <HomeButton />
    </SafeAreaView>
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
}: {
  portrait: IndividualPortrait;
  userName: string;
  overallScore: number;
  onNavigate: (tab: TabKey) => void;
  rawScores: AllAssessmentScores | null;
}) {
  const narrative = generateLandingNarrative(portrait);
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
      {/* Landing hero */}
      <View style={st.heroSection}>
        <Text style={st.heroEyebrow}>YOUR RELATIONAL PORTRAIT</Text>
        <Text style={st.heroTitle}>{userName}</Text>
        {/* Three-Layer Dashboard replaces the single score circle */}
        <ThreeLayerDashboard
          compositeScores={cs}
          onSeeDetails={() => onNavigate('scores')}
        />
      </View>

      {/* Radar Chart — The Shape of You */}
      <RadarChart scores={cs} onDimensionTap={() => onNavigate('scores')} />

      {/* Narrative */}
      <View style={st.card}>
        <Text style={st.cardHeading}>Here's what we learned</Text>
        <Text style={st.cardBody}>{narrative}</Text>
      </View>

      {/* Cross-Assessment Synthesis */}
      <SynthesisCard synthesis={synthesis} />

      {/* Field Awareness — Phase 3 (only if supplement data present) */}
      {portrait.fourLens.fieldAwareness && (
        <FieldAwarenessCard fieldAwareness={portrait.fourLens.fieldAwareness} />
      )}

      {/* A.R.E. Radar / Ring Chart */}
      <View style={st.areRingsCard}>
        <Text style={st.scoreGroupLabel}>A.R.E. ATTACHMENT QUALITY</Text>
        <View style={st.scoreGroupDivider} />
        <View style={st.areRingsRow}>
          <AREScoreRing label="Accessible" value={cs.accessibility} color={Colors.calm} delay={200} />
          <AREScoreRing label="Responsive" value={cs.responsiveness} color={Colors.primary} delay={400} />
          <AREScoreRing label="Engaged" value={cs.engagement} color={Colors.secondary} delay={600} />
        </View>
      </View>

      {/* Quick Stats Grid */}
      <Text style={st.sectionLabel}>AT A GLANCE</Text>
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
      <Text style={st.sectionLabel}>EXPLORE YOUR PORTRAIT</Text>
      <View style={st.navCards}>
        {TABS.slice(1).map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={st.navCard}
            onPress={() => onNavigate(tab.key)}
            activeOpacity={0.8}
          >
            <View style={[st.navCardIcon, { backgroundColor: tab.color }]}>
              <tab.Icon size={16} color={Colors.white} />
            </View>
            <Text style={st.navCardLabel}>{tab.label}</Text>
            <Text style={st.navCardArrow}>{'>'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

// ─── FIELD AWARENESS CARD (Phase 3) ────────────────

function FieldAwarenessCard({ fieldAwareness }: { fieldAwareness: FieldAwarenessLens }) {
  const [expanded, setExpanded] = useState(false);
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
      <Text style={st.synthesisSectionLabel}>RELATIONAL FIELD AWARENESS</Text>
      <View style={st.scoreGroupDivider} />

      {/* Narrative */}
      <Text style={st.synthesisNarrative}>{fieldAwareness.narrative}</Text>

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
            <Text style={st.fieldMetaBadgeText}>Metacognitive Capacity</Text>
          </View>
          <Text style={st.fieldMetaHint}>You can observe your patterns while they unfold</Text>
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
          >
            <Text style={st.fieldExpandLabel}>
              Cross-Pattern Insights ({fieldAwareness.crossPatterns.length})
            </Text>
            <Text style={st.fieldExpandArrow}>{expanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {expanded && fieldAwareness.crossPatterns.map((insight, i) => (
            <View key={i} style={st.synthesisListItem}>
              <View style={[st.synthesisListDot, { backgroundColor: Colors.depth }]} />
              <Text style={st.synthesisListText}>{insight}</Text>
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
    <View style={st.fieldScoreItem}>
      <Text style={st.fieldScoreLabel}>{label}</Text>
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
      <Text style={st.fieldScoreValue}>{value.toFixed(1)}/{maxScale}</Text>
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
      <Text style={st.synthesisSectionLabel}>CROSS-ASSESSMENT SYNTHESIS</Text>
      <View style={st.scoreGroupDivider} />

      {/* Primary Dynamic */}
      <View style={st.synthesisPatternBox}>
        <Text style={st.synthesisPatternLabel}>Primary Dynamic</Text>
        <Text style={st.synthesisPatternText}>{synthesis.primaryPattern}</Text>
      </View>

      {/* Core Narrative */}
      <Text style={st.synthesisNarrative}>{synthesis.coreNarrative}</Text>

      {/* Reinforcing Factors */}
      {synthesis.reinforcingFactors.length > 0 && (
        <View style={st.synthesisSection}>
          <Text style={st.synthesisSectionTitle}>Converging Patterns</Text>
          {synthesis.reinforcingFactors.map((f, i) => (
            <View key={i} style={st.synthesisListItem}>
              <View style={[st.synthesisListDot, { backgroundColor: Colors.secondary }]} />
              <Text style={st.synthesisListText}>{f}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Contradictions — surfaced prominently */}
      {synthesis.contradictions.length > 0 && (
        <View style={st.synthesisSection}>
          <Text style={st.synthesisSectionTitle}>Interesting Tensions</Text>
          {synthesis.contradictions.map((c, i) => (
            <View key={i} style={st.synthesisListItem}>
              <View style={[st.synthesisListDot, { backgroundColor: Colors.depth }]} />
              <Text style={st.synthesisListText}>{c}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Protective Factors */}
      {synthesis.protectiveFactors.length > 0 && (
        <View style={st.synthesisSection}>
          <Text style={st.synthesisSectionTitle}>Your Strengths</Text>
          {synthesis.protectiveFactors.map((f, i) => (
            <View key={i} style={st.synthesisListItem}>
              <View style={[st.synthesisListDot, { backgroundColor: Colors.success }]} />
              <Text style={st.synthesisListText}>{f}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Growth Edges */}
      {synthesis.growthEdges.length > 0 && (
        <View style={st.synthesisSection}>
          <Text style={st.synthesisSectionTitle}>Growth Edges</Text>
          {synthesis.growthEdges.map((e, i) => (
            <View key={i} style={st.synthesisListItem}>
              <View style={[st.synthesisListDot, { backgroundColor: Colors.warning }]} />
              <Text style={st.synthesisListText}>{e}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Recommended Step */}
      <View style={st.synthesisStepBox}>
        <Text style={st.synthesisStepLabel}>RECOMMENDED STARTING POINT</Text>
        <Text style={st.synthesisStepName}>
          Step {synthesis.recommendedStep}
          {stepInfo ? `: ${stepInfo.title}` : ''}
        </Text>
        <Text style={st.synthesisStepRationale}>
          {synthesis.recommendedStepRationale}
        </Text>
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
        <Text style={st.scoreGroupLabel}>VALUES COMPASS</Text>
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
                <Text style={st.valuesCompassDotText}>{v.charAt(0)}</Text>
              </View>
              <Text style={st.valuesCompassLabel} numberOfLines={1}>{v}</Text>
            </View>
          );
        })}
        <View style={st.valuesCompassCenter}>
          <StarIcon size={16} color={Colors.primary} />
        </View>
      </View>

      {/* Gap bars */}
      {gaps.length > 0 && (
        <View style={st.valuesGapSection}>
          <Text style={st.valuesGapTitle}>Values-Action Gaps</Text>
          <Text style={st.valuesGapDescription}>
            The distance between how important a value is to you and how much you're currently living it. A gap of 3+ means this value matters deeply but your daily actions aren't yet matching.
          </Text>
          {gaps.map((g) => (
            <View key={g.value} style={st.valuesGapRow}>
              <Text style={st.valuesGapLabel}>{g.value}</Text>
              <View style={st.valuesGapBarTrack}>
                <View style={[st.valuesGapBarFill, {
                  width: `${Math.min(100, (g.gap / 10) * 100)}%`,
                  backgroundColor: g.gap >= 5 ? Colors.warning : g.gap >= 3 ? Colors.calm : Colors.success,
                }]} />
              </View>
              <Text style={[st.valuesGapScore, {
                color: g.gap >= 5 ? Colors.warning : Colors.calm,
              }]}>{g.gap}/10</Text>
            </View>
          ))}
          <Text style={st.valuesGapHint}>
            Importance: {gaps[0]?.importance ?? '—'}/10 · Gap shows room to align action with values
          </Text>
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
        <Text style={st.scoreGroupLabel}>INNER PARTS MAP</Text>
      </View>
      <View style={st.scoreGroupDivider} />

      {/* Self-Leadership Circle */}
      <View style={st.partsMapCenter}>
        <View style={[st.partsMapSelfCircle, { borderColor: selfTier.color }]}>
          <Text style={[st.partsMapSelfScore, { color: selfTier.color }]}>{selfScore}</Text>
          <Text style={st.partsMapSelfLabel}>Self{'\n'}Leadership</Text>
        </View>
      </View>

      {/* Manager Parts */}
      <View style={st.partsMapSection}>
        <View style={[st.partsMapSectionHeader, { backgroundColor: Colors.warning + '15' }]}>
          <View style={st.partsMapSectionIcon}><ShieldIcon size={16} color={Colors.warning} /></View>
          <Text style={st.partsMapSectionTitle}>Manager Parts</Text>
          <Text style={st.partsMapSectionHint}>Try to prevent pain</Text>
        </View>
        <View style={st.partsMapPills}>
          {parts.managerParts.map((p) => (
            <View key={p} style={[st.partsMapPill, { backgroundColor: Colors.warning + '12', borderColor: Colors.warning + '40' }]}>
              <Text style={[st.partsMapPillText, { color: Colors.warning }]}>{p}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Firefighter Parts */}
      <View style={st.partsMapSection}>
        <View style={[st.partsMapSectionHeader, { backgroundColor: Colors.error + '12' }]}>
          <View style={st.partsMapSectionIcon}><FireIcon size={16} color={Colors.error} /></View>
          <Text style={st.partsMapSectionTitle}>Firefighter Parts</Text>
          <Text style={st.partsMapSectionHint}>React when pain breaks through</Text>
        </View>
        <View style={st.partsMapPills}>
          {parts.firefighterParts.map((p) => (
            <View key={p} style={[st.partsMapPill, { backgroundColor: Colors.error + '10', borderColor: Colors.error + '30' }]}>
              <Text style={[st.partsMapPillText, { color: Colors.error }]}>{p}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Polarities */}
      {parts.polarities.length > 0 && (
        <View style={st.partsMapSection}>
          <View style={[st.partsMapSectionHeader, { backgroundColor: Colors.depth + '10' }]}>
            <View style={st.partsMapSectionIcon}><ScaleIcon size={16} color={Colors.depth} /></View>
            <Text style={st.partsMapSectionTitle}>Inner Tensions</Text>
          </View>
          {parts.polarities.map((p, i) => (
            <View key={i} style={st.partsMapPolarity}>
              <Text style={st.partsMapPolarityText}>{p}</Text>
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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <RefreshIcon size={16} color={Colors.textMuted} />
        <Text style={st.scoreGroupLabel}>YOUR CYCLE POSITION</Text>
      </View>
      <View style={st.scoreGroupDivider} />

      {/* Animated cycle diagram */}
      <View style={st.cycleDiagramVisual}>
        {/* Rotating arrows */}
        <Animated.View style={[st.cycleDiagramArrowRing, { transform: [{ rotate: spin }] }]}>
          <Text style={st.cycleDiagramArrow}>{'↻'}</Text>
        </Animated.View>

        {/* Your position */}
        <View style={[
          st.cycleDiagramYouBadge,
          { backgroundColor: isPursuer ? Colors.secondary : Colors.depth },
        ]}>
          <Text style={st.cycleDiagramYouText}>You</Text>
          <Text style={st.cycleDiagramYouRole}>
            {isPursuer ? 'Pursuer' : negativeCycle.position === 'withdrawer' ? 'Withdrawer' : 'Mixed'}
          </Text>
        </View>

        {/* Partner position */}
        <View style={[
          st.cycleDiagramPartnerBadge,
          { backgroundColor: isPursuer ? Colors.depth + '60' : Colors.secondary + '60' },
        ]}>
          <Text style={st.cycleDiagramPartnerText}>Partner</Text>
          <Text style={st.cycleDiagramPartnerRole}>
            {isPursuer ? 'Withdrawer' : 'Pursuer'}
          </Text>
        </View>

        {/* Connection lines */}
        <View style={st.cycleDiagramLineTop}>
          <Text style={st.cycleDiagramLineLabel}>
            {isPursuer ? 'You pursue →' : '← Partner pursues'}
          </Text>
        </View>
        <View style={st.cycleDiagramLineBottom}>
          <Text style={st.cycleDiagramLineLabel}>
            {isPursuer ? '← Partner withdraws' : 'You withdraw →'}
          </Text>
        </View>
      </View>

      {/* Key insight */}
      <View style={st.cycleDiagramInsight}>
        <Text style={st.cycleDiagramInsightText}>
          {isPursuer
            ? 'The more you pursue, the more they withdraw. The more they withdraw, the more you pursue.'
            : 'The more you withdraw, the more they pursue. The more they pursue, the more you withdraw.'}
        </Text>
        <Text style={st.cycleDiagramInsightSub}>
          Neither of you is "wrong" — you're both caught in the dance.
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── SCORES TAB ─────────────────────────────────────

function ScoresTab({
  portrait,
  overallScore,
  rawScores,
}: {
  portrait: IndividualPortrait;
  overallScore: number;
  rawScores: AllAssessmentScores | null;
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
            <Text style={st.legendText}>{t.label}</Text>
            <Text style={st.legendRange}>{t.range}</Text>
          </View>
        ))}
      </View>

      {/* A.R.E. Group */}
      <View style={st.scoreGroupCard}>
        <Text style={st.scoreGroupLabel}>A.R.E. — ATTACHMENT QUALITY</Text>
        <Text style={st.scoreGroupDescription}>
          Based on Emotionally Focused Therapy: Are you emotionally reachable, do you tune in to your partner's needs, and are you invested in the connection?
        </Text>
        <View style={st.scoreGroupDivider} />
        <AnimatedScoreBar label="Accessible" value={cs.accessibility} delay={100} interpretation={getInterpretation('accessibility', cs.accessibility)} />
        <AnimatedScoreBar label="Responsive" value={cs.responsiveness} delay={200} interpretation={getInterpretation('responsiveness', cs.responsiveness)} />
        <AnimatedScoreBar label="Engaged" value={cs.engagement} delay={300} interpretation={getInterpretation('engagement', cs.engagement)} />
      </View>

      {/* Capacity Group */}
      <View style={st.scoreGroupCard}>
        <Text style={st.scoreGroupLabel}>CAPACITY — INNER RESOURCES</Text>
        <Text style={st.scoreGroupDescription}>
          Your internal toolkit for staying grounded. Regulation measures how well you recover from emotional activation, window width shows how much stress you can hold, and self-leadership reflects your ability to observe your own patterns.
        </Text>
        <View style={st.scoreGroupDivider} />
        <AnimatedScoreBar label="Regulation" value={cs.regulationScore} delay={400} interpretation={getInterpretation('regulationScore', cs.regulationScore)} />
        <AnimatedScoreBar label="Window Width" value={cs.windowWidth} delay={500} interpretation={getInterpretation('windowWidth', cs.windowWidth)} />
        <AnimatedScoreBar label="Self-Leadership" value={cs.selfLeadership} delay={600} interpretation={getInterpretation('selfLeadership', cs.selfLeadership)} />
      </View>

      {/* Values Group */}
      <View style={st.scoreGroupCard}>
        <Text style={st.scoreGroupLabel}>VALUES — ALIGNMENT</Text>
        <Text style={st.scoreGroupDescription}>
          How closely your daily actions match what you say matters most to you. A high score means you're living in line with your values; a lower score points to protective patterns overriding your intentions.
        </Text>
        <View style={st.scoreGroupDivider} />
        <AnimatedScoreBar label="Values Congruence" value={cs.valuesCongruence} delay={700} interpretation={getInterpretation('valuesCongruence', cs.valuesCongruence)} />
      </View>

      {/* Window of Tolerance (SVG visualization) */}
      <WindowOfTolerance
        compositeScores={cs}
        activationPattern={
          cs.regulationScore > 60 ? 'balanced' :
          cs.windowWidth < 35 ? 'hyperarousal' : 'both'
        }
        triggers={portrait.negativeCycle.primaryTriggers.slice(0, 3)}
      />

      {/* Values Compass Infographic */}
      <ValuesCompassInfographic values={portrait.fourLens.values} />

      {/* Waterfall Chart — How your profile was built */}
      <WaterfallChart compositeScores={cs} />

      {/* Differentiation Spectrum (when DSI-R data available) */}
      {rawScores?.dsir && (
        <DifferentiationSpectrum dsirScores={rawScores.dsir} compositeScores={cs} />
      )}
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
      <Text style={st.tabIntro}>
        {hasFieldAwareness
          ? 'Five distinct perspectives that together form a complete picture of how you relate.'
          : 'Four distinct perspectives that together form a complete picture of how you relate.'}
      </Text>

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
            <Text style={[st.cardHeading, { flex: 1 }]}>Field Awareness</Text>
          </View>
          <Text style={st.cardBody}>{portrait.fourLens.fieldAwareness.narrative}</Text>
          {portrait.fourLens.fieldAwareness.crossPatterns.length > 0 && (
            <View style={{ marginTop: Spacing.sm }}>
              {portrait.fourLens.fieldAwareness.crossPatterns.map((cp, i) => (
                <View key={i} style={st.listItem}>
                  <Text style={st.listBullet}>{'•'}</Text>
                  <Text style={st.listText}>{cp}</Text>
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
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={st.card}>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(!expanded);
        }}
        activeOpacity={0.7}
      >
        <View style={st.cardHeaderRow}>
          <View style={[st.lensIconCircle, { backgroundColor: Colors.secondary + '20' }]}>
            <SearchIcon size={16} color={Colors.secondary} />
          </View>
          <Text style={[st.cardHeading, { flex: 1 }]}>Personality Reframes</Text>
          <Text style={st.fieldExpandArrow}>{expanded ? '▲' : '▼'}</Text>
        </View>
        <Text style={[st.cardBody, { marginTop: Spacing.xs }]}>
          Your Big Five personality traits through a relational lens — how they shape connection.
        </Text>
      </TouchableOpacity>
      {expanded && reframes.map((reframe, i) => (
        <View
          key={i}
          style={[st.reframeItem, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.border }]}
        >
          <Text style={st.cardBody}>{reframe}</Text>
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
        <View style={[st.cycleBadge, { backgroundColor: positionColor }]}>
          <Text style={st.cycleBadgeText}>
            {nc.position.toUpperCase()}
          </Text>
        </View>
        <Text style={st.cycleHeroTitle}>Your Negative Cycle</Text>
        <Text style={st.cycleHeroBody}>{nc.description}</Text>
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
          <Text style={st.cardHeading}>Triggers</Text>
        </View>
        {nc.primaryTriggers.map((t, i) => (
          <View key={i} style={st.listItem}>
            <Text style={st.listBullet}>{'•'}</Text>
            <Text style={st.listText}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Typical Moves */}
      <View style={st.card}>
        <View style={st.cardHeaderRow}>
          <MasksIcon size={16} color={Colors.secondary} />
          <Text style={st.cardHeading}>Typical Moves</Text>
        </View>
        {nc.typicalMoves.map((m, i) => (
          <View key={i} style={st.listItem}>
            <Text style={st.listBullet}>{'•'}</Text>
            <Text style={st.listText}>{m}</Text>
          </View>
        ))}
      </View>

      {/* De-escalators */}
      <View style={st.card}>
        <View style={st.cardHeaderRow}>
          <DoveIcon size={16} color={Colors.calm} />
          <Text style={st.cardHeading}>De-escalators</Text>
        </View>
        {nc.deEscalators.map((d, i) => (
          <View key={i} style={st.listItem}>
            <Text style={st.listBullet}>{'•'}</Text>
            <Text style={st.listText}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Patterns */}
      {portrait.patterns.length > 0 && (
        <>
          <Text style={st.sectionLabel}>DETECTED PATTERNS</Text>
          {portrait.patterns.map((pattern) => (
            <View key={pattern.id} style={st.patternCard}>
              <View style={st.patternHeader}>
                <View style={[st.patternBadge, {
                  backgroundColor: pattern.confidence === 'high' ? Colors.success + '20' : Colors.warning + '20',
                }]}>
                  <Text style={[st.patternBadgeText, {
                    color: pattern.confidence === 'high' ? Colors.success : Colors.warning,
                  }]}>
                    {pattern.confidence} confidence
                  </Text>
                </View>
                <Text style={st.patternCategory}>
                  {pattern.category.replace(/-/g, ' ')}
                </Text>
              </View>
              <Text style={st.patternDescription}>{pattern.description}</Text>
              <Text style={st.patternInterpretation}>{pattern.interpretation}</Text>
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
      <Text style={st.tabIntro}>
        Short phrases for difficult moments. Save the ones that resonate.
      </Text>

      {ANCHOR_ITEMS.map(({ key, label, Icon, color }) => (
        <View key={key} style={st.anchorCard}>
          <View style={st.anchorCardHeader}>
            <View style={[st.anchorIcon, { backgroundColor: color + '15' }]}>
              <Icon size={18} color={color} />
            </View>
            <Text style={[st.anchorLabel, { color }]}>{label}</Text>
          </View>
          <Text style={st.anchorText}>{portrait.anchorPoints[key]}</Text>
        </View>
      ))}

      {/* Partner Guide */}
      <Text style={st.sectionLabel}>FOR YOUR PARTNER</Text>
      <View style={st.card}>
        <Text style={st.cardBody}>{portrait.partnerGuide.whatToKnow}</Text>
      </View>

      <View style={st.card}>
        <Text style={st.cardHeading}>When I'm struggling, I need...</Text>
        {portrait.partnerGuide.whenStrugglingINeed.map((item, i) => (
          <View key={i} style={st.listItem}>
            <Text style={st.listBullet}>{'•'}</Text>
            <Text style={st.listText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={st.card}>
        <View style={st.twoCol}>
          <View style={st.colCard}>
            <Text style={[st.colCardTitle, { color: Colors.success }]}>What helps</Text>
            {portrait.partnerGuide.whatHelps.map((item, i) => (
              <Text key={i} style={st.colCardItem}>{'•'} {item}</Text>
            ))}
          </View>
          <View style={st.colCard}>
            <Text style={[st.colCardTitle, { color: Colors.error }]}>What doesn't</Text>
            {portrait.partnerGuide.whatDoesntHelp.map((item, i) => (
              <Text key={i} style={st.colCardItem}>{'•'} {item}</Text>
            ))}
          </View>
        </View>
      </View>

      {/* What's Next */}
      <Text style={st.sectionLabel}>WHAT'S NEXT</Text>
      <View style={st.card}>
        <Text style={st.cardBody}>
          This portrait is a starting point, not a verdict. Return to it when you
          are stuck, share it with your partner when you are ready, and use it as
          a guide for the work ahead.
        </Text>
      </View>

      <TouchableOpacity
        style={st.ctaButton}
        onPress={() => router.push('/(app)/chat' as any)}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={st.ctaButtonText}>Nuance AI</Text>
          <SparkleIcon size={14} color={Colors.white} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={st.ctaButtonOutline}
        onPress={() => router.push('/(app)/exercises' as any)}
        activeOpacity={0.8}
      >
        <Text style={st.ctaButtonOutlineText}>Practice an Exercise</Text>
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
  viewAndEraseBannerText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.warning,
    fontWeight: '600',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  errorText: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

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
  headerBackText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  headerDate: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },

  // ── Tab Bar ──
  tabBarWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surfaceElevated,
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
  tabLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // ── Content ──
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  // ── Hero ──
  heroSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  heroEyebrow: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '600',
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: FontFamilies.heading,
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
  scoreCircleNumber: {
    fontSize: 28,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    lineHeight: 32,
  },
  scoreCircleLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: -2,
  },
  scoreCircleTier: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
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
  areRingValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
  },
  areRingLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.text,
  },
  areRingTier: {
    fontSize: 10,
    fontWeight: '600',
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
  cardHeading: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  cardBody: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
  },
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
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '700',
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
  statIconText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '600',
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
  navCardIconText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
  },
  navCardLabel: {
    flex: 1,
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  navCardArrow: {
    fontSize: 20,
    color: Colors.textMuted,
    fontWeight: '300',
  },

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
  legendText: {
    fontSize: FontSizes.caption,
    color: Colors.text,
    fontWeight: '500',
  },
  legendRange: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },

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
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  scoreGroupDescription: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
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
  barLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '500',
    color: Colors.text,
  },
  barValue: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },
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
  barInterpretation: {
    fontSize: FontSizes.caption,
    fontStyle: 'italic',
  },

  // ── Tab Intro ──
  tabIntro: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },

  // ── Cycle Tab ──
  cycleHero: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  cycleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
  },
  cycleBadgeText: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 1.5,
  },
  cycleHeroTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  cycleHeroBody: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
    textAlign: 'center',
  },

  // ── Lists ──
  listItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  listBullet: {
    fontSize: FontSizes.body,
    color: Colors.textMuted,
    lineHeight: 24,
  },
  listText: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
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
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  patternCategory: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  patternDescription: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  patternInterpretation: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // ── Protocol / Growth Plan styles ──
  protocolSection: {
    marginBottom: Spacing.xl,
  },
  protocolEyebrow: {
    fontSize: FontSizes.caption,
    fontWeight: '700' as const,
    color: Colors.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  protocolName: {
    fontSize: FontSizes.headingM,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  protocolDescription: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  movementsContainer: {
    marginBottom: Spacing.lg,
  },
  movementsSectionTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  movementsSubtitle: {
    fontSize: FontSizes.bodySmall,
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
  movementIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  movementName: {
    fontSize: FontSizes.body,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  movementQuestion: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  movementScore: {
    fontSize: FontSizes.body,
    fontWeight: '700' as const,
    color: Colors.secondary,
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
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
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
  phaseName: {
    fontSize: FontSizes.body,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  phaseWeeks: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  phaseFocus: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    paddingLeft: Spacing.md + Spacing.sm,
  },
  phaseExercises: {
    marginTop: Spacing.sm,
    paddingLeft: Spacing.md + Spacing.sm,
  },
  phaseExercisesLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
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
    fontSize: FontSizes.bodySmall,
    fontWeight: '600' as const,
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
    fontWeight: '300' as const,
  },
  guidanceContainer: {
    backgroundColor: '#FFF8F0',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  guidanceTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  guidanceItem: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
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
  growthEdgeNumberText: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.white,
  },
  growthEdgeHeaderText: {
    flex: 1,
    gap: 2,
  },
  growthEdgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.warning,
    letterSpacing: 1,
  },
  growthEdgeTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  growthEdgeDescription: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  growthEdgeRationaleBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  growthEdgeRationale: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  practicesSection: {
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  practicesTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
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
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
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
  anchorIconText: {
    fontSize: 16,
  },
  anchorLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  anchorText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },

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
    fontSize: FontSizes.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  colCardItem: {
    fontSize: FontSizes.caption,
    color: Colors.text,
    lineHeight: 18,
  },


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
  valuesCompassDotText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  valuesCompassLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
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
  valuesCompassCenterText: {
    fontSize: 20,
  },
  valuesGapSection: {
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  valuesGapTitle: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  valuesGapDescription: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginBottom: 6,
  },
  valuesGapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  valuesGapLabel: {
    width: 80,
    fontSize: FontSizes.caption,
    color: Colors.text,
    fontWeight: '500',
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
    fontSize: FontSizes.caption,
    fontWeight: '700',
    textAlign: 'right',
  },
  valuesGapHint: {
    fontSize: 10,
    color: Colors.textMuted,
    fontStyle: 'italic',
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
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
    ...Shadows.elevated,
  },
  partsMapSelfScore: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
  },
  partsMapSelfLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 11,
  },
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
  partsMapSectionTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  partsMapSectionHint: {
    fontSize: 10,
    color: Colors.textMuted,
    fontStyle: 'italic',
    flex: 1,
    textAlign: 'right',
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
  partsMapPillText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },
  partsMapPolarity: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.depth + '08',
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.depth,
  },
  partsMapPolarityText: {
    fontSize: FontSizes.caption,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 18,
  },

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
    height: 140,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleDiagramArrowRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleDiagramArrow: {
    fontSize: 100,
    color: Colors.textMuted + '20',
    fontWeight: '200',
  },
  cycleDiagramYouBadge: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -24,
    width: 66,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.elevated,
  },
  cycleDiagramYouText: {
    fontSize: 8,
    color: Colors.white,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cycleDiagramYouRole: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700',
  },
  cycleDiagramPartnerBadge: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -24,
    width: 66,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleDiagramPartnerText: {
    fontSize: 8,
    color: Colors.white,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cycleDiagramPartnerRole: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700',
  },
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
  cycleDiagramLineLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  cycleDiagramInsight: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
  },
  cycleDiagramInsightText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  cycleDiagramInsightSub: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
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
  ctaButtonText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '700',
  },
  ctaButtonOutline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ctaButtonOutlineText: {
    color: Colors.primary,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

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
    fontSize: FontSizes.caption,
    color: Colors.depth,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  synthesisPatternBox: {
    backgroundColor: `${Colors.depth}15`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  synthesisPatternLabel: {
    fontSize: FontSizes.caption,
    color: Colors.depth,
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  synthesisPatternText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '500',
    lineHeight: 24,
  },
  synthesisNarrative: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  synthesisSection: {
    gap: Spacing.xs,
  },
  synthesisSectionTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
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
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
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
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  synthesisStepName: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  synthesisStepRationale: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

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
  growthProgressLabel: {
    fontSize: FontSizes.body,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  growthProgressPct: {
    fontSize: FontSizes.headingM,
    fontWeight: '700' as const,
    color: Colors.secondary,
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
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '600' as const,
  },

  // ── Exercise Done States ──
  exerciseRowDone: {
    backgroundColor: '#E3EFE5',
    opacity: 0.85,
  },
  exerciseCheckmark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4A6F50',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 10,
  },
  exerciseCheckmarkText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700' as const,
  },
  exerciseRowTitleDone: {
    color: '#4A6F50',
  },
  phaseProgressText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    marginTop: 4,
    textAlign: 'right' as const,
  },

  // ── Phase Completion Summary ──
  phaseCompleteSummary: {
    backgroundColor: '#E3EFE5',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#4A6F50',
  },
  phaseCompleteIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  phaseCompleteTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700' as const,
    color: '#4A6F50',
    marginBottom: 4,
  },
  phaseCompleteText: {
    fontSize: FontSizes.bodySmall,
    color: '#3D6B42',
    lineHeight: 20,
  },

  // ── Export Mode Styles ──
  exportSectionHeader: {
    alignItems: 'center' as const,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  exportTitle: {
    fontSize: 26,
    fontWeight: '700' as const,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  exportDate: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  exportSection: {
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exportSectionLabel: {
    fontSize: FontSizes.headingL,
    fontWeight: '700' as const,
    fontFamily: FontFamilies.heading,
    color: Colors.primary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase' as const,
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
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    width: 110,
    fontWeight: '500' as const,
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
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    width: 36,
    textAlign: 'right' as const,
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
  fieldMetaBadgeText: {
    fontSize: FontSizes.caption,
    color: Colors.depth,
    fontWeight: '600' as const,
  },
  fieldMetaHint: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  fieldExpandBtn: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: Spacing.xs,
  },
  fieldExpandLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  fieldExpandArrow: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },

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
