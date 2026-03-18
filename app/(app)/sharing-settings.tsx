/**
 * Sharing Settings Screen
 *
 * Lets the user toggle which individual assessments (and portrait)
 * are visible to their connected partner. Changes are optimistic
 * and persisted immediately via the consent service.
 */

import React, { useEffect, useState, useCallback } from 'react';
import Animated from 'react-native-reanimated';
import { useScrollHideBar } from '@/hooks/useScrollHideBar';
import QuickLinksBar from '@/components/QuickLinksBar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getMyCouple, getPartnerProfile } from '@/services/couples';
import {
  getSharingPreferences,
  updateSharingPreference,
  initializeSharingDefaults,
} from '@/services/consent';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { Couple } from '@/types/couples';
import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';
import {
  HeartDoubleIcon,
  BrainIcon,
  MasksIcon,
  ScaleIcon,
  LeafIcon,
  CompassIcon,
  SparkleIcon,
  HandshakeIcon,
  CommunityIcon,
  LinkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@/assets/graphics/icons';

// ─── Sharing Item Definitions ──────────────────────────

interface SharingItem {
  type: string;
  Icon: ComponentType<IconProps>;
  iconColor: string;
  name: string;
  desc: string;
}

const SHARING_ITEMS: SharingItem[] = [
  {
    type: 'ecr-r',
    Icon: HeartDoubleIcon,
    iconColor: Colors.secondary,
    name: 'Attachment Style',
    desc: 'Your attachment pattern, anxiety and avoidance dimensions',
  },
  {
    type: 'tender-personality-60',
    Icon: BrainIcon,
    iconColor: Colors.depth,
    name: 'Personality Profile',
    desc: 'Big Five personality traits and facets',
  },
  {
    type: 'sseit',
    Icon: MasksIcon,
    iconColor: Colors.calm,
    name: 'Emotional Intelligence',
    desc: 'How you perceive and manage emotions',
  },
  {
    type: 'dutch',
    Icon: ScaleIcon,
    iconColor: Colors.accent,
    name: 'Conflict Style',
    desc: 'Your conflict handling approach',
  },
  {
    type: 'dsi-r',
    Icon: LeafIcon,
    iconColor: Colors.primary,
    name: 'Differentiation',
    desc: 'Emotional boundaries and self-regulation',
  },
  {
    type: 'values',
    Icon: CompassIcon,
    iconColor: Colors.warningDark,
    name: 'Values Profile',
    desc: 'Core values, priorities, and aspirational vision',
  },
];

const PORTRAIT_ITEM: SharingItem = {
  type: 'portrait',
  Icon: SparkleIcon,
  iconColor: Colors.primary,
  name: 'Full Relational Portrait',
  desc: 'Your complete 4-lens analysis',
};

// ─── Component ────────────────────────────────────────

export default function SharingSettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { handleScroll, animatedStyle: quickLinksAnimStyle, BAR_HEIGHT } = useScrollHideBar();

  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // ── Load data on mount ────────────────────────

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const coupleData = await getMyCouple(user.id);
      setCouple(coupleData);

      if (coupleData) {
        // Load partner display name (returns null for self-couples)
        const partner = await getPartnerProfile(user.id);
        const isSelf = coupleData.partner_a_id === coupleData.partner_b_id;
        setPartnerName(partner?.display_name || (isSelf ? 'Demo Partner' : 'Your Partner'));

        // Load sharing preferences
        let prefs = await getSharingPreferences(user.id, coupleData.id);

        // Initialize defaults if none exist
        if (prefs.length === 0) {
          await initializeSharingDefaults(user.id, coupleData.id);
          prefs = await getSharingPreferences(user.id, coupleData.id);
        }

        // Build preferences map
        const map: Record<string, boolean> = {};
        prefs.forEach((p) => {
          map[p.assessmentType] = p.shared;
        });
        setPreferences(map);
      }
    } catch (e) {
      console.error('[SharingSettings] Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ── Toggle handler ────────────────────────────

  const handleToggle = useCallback(
    async (assessmentType: string, newValue: boolean) => {
      if (!user || !couple) return;

      // Optimistic update
      setPreferences((prev) => ({ ...prev, [assessmentType]: newValue }));
      setSaving((prev) => ({ ...prev, [assessmentType]: true }));

      try {
        await updateSharingPreference(user.id, couple.id, assessmentType, newValue);
      } catch (e) {
        // Revert on failure
        console.error('[SharingSettings] Failed to update:', e);
        setPreferences((prev) => ({ ...prev, [assessmentType]: !newValue }));
      } finally {
        setSaving((prev) => ({ ...prev, [assessmentType]: false }));
      }
    },
    [user, couple],
  );

  // ── Shared items list for summary ─────────────

  const sharedNames = [...SHARING_ITEMS, PORTRAIT_ITEM]
    .filter((item) => preferences[item.type])
    .map((item) => item.name);

  // ── Loading state ─────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} accessibilityLabel="Loading" />
          <Text style={s.loadingText}>Loading sharing settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render ────────────────────────────────────

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        contentContainerStyle={[s.scrollContent, { paddingBottom: BAR_HEIGHT + 20 }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* ── Header ──────────────────── */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} accessibilityRole="button" accessibilityLabel="Back">
            <ArrowLeftIcon size={16} color={Colors.primary} />
            <Text style={s.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Sharing Controls</Text>
          <View style={{ width: 48 }} />
        </View>

        {/* ── Hero ────────────────────── */}
        <View style={s.heroSection}>
          <HandshakeIcon size={48} color={Colors.primary} />
          <Text style={s.heroTitle}>What You Share</Text>
          <Text style={s.heroSubtitle}>
            Control exactly which parts of your results your partner can see.
            Changes take effect immediately.
          </Text>
        </View>

        {/* ── Partner Info ────────────── */}
        {couple ? (
          <View style={s.partnerCard}>
            <CommunityIcon size={22} color={Colors.secondary} />
            <Text style={s.partnerText}>
              Sharing with: <Text style={s.partnerName}>{partnerName}</Text>
            </Text>
          </View>
        ) : (
          <View style={s.partnerCardDisconnected}>
            <LinkIcon size={22} color={Colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={s.partnerDisconnectedText}>
                Connect with a partner to manage sharing settings
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(app)/partner')}
                activeOpacity={0.7}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.xs }}
                accessibilityRole="button"
                accessibilityLabel="Go to Partner Settings"
              >
                <Text style={[s.partnerLink, { marginTop: 0 }]}>Go to Partner Settings</Text>
                <ArrowRightIcon size={14} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Individual Assessments ──── */}
        <Text style={s.sectionLabel}>INDIVIDUAL ASSESSMENTS</Text>

        {SHARING_ITEMS.map((item) => (
          <View key={item.type} style={s.toggleCard}>
            <View style={s.toggleLeft}>
              <item.Icon size={24} color={item.iconColor} />
              <View style={s.toggleInfo}>
                <Text style={s.toggleName}>{item.name}</Text>
                <Text style={s.toggleDesc}>{item.desc}</Text>
              </View>
            </View>
            <View style={s.toggleRight}>
              {saving[item.type] && (
                <ActivityIndicator
                  size="small"
                  color={Colors.primary}
                  style={{ marginRight: Spacing.sm }}
                                  accessibilityLabel="Loading"
                />
              )}
              <Switch
                value={!!preferences[item.type]}
                onValueChange={(val) => handleToggle(item.type, val)}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={
                  preferences[item.type] ? Colors.primary : Colors.textMuted
                }
                disabled={!couple}
              />
            </View>
          </View>
        ))}

        {/* ── Portrait Toggle ─────────── */}
        <Text style={s.sectionLabel}>RELATIONAL PORTRAIT</Text>

        <View style={s.toggleCard}>
          <View style={s.toggleLeft}>
            <PORTRAIT_ITEM.Icon size={24} color={PORTRAIT_ITEM.iconColor} />
            <View style={s.toggleInfo}>
              <Text style={s.toggleName}>{PORTRAIT_ITEM.name}</Text>
              <Text style={s.toggleDesc}>{PORTRAIT_ITEM.desc}</Text>
            </View>
          </View>
          <View style={s.toggleRight}>
            {saving[PORTRAIT_ITEM.type] && (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginRight: Spacing.sm }}
                              accessibilityLabel="Loading"
              />
            )}
            <Switch
              value={!!preferences[PORTRAIT_ITEM.type]}
              onValueChange={(val) => handleToggle(PORTRAIT_ITEM.type, val)}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={
                preferences[PORTRAIT_ITEM.type] ? Colors.primary : Colors.textMuted
              }
              disabled={!couple}
            />
          </View>
        </View>

        <View style={s.portraitNote}>
          <Text style={s.portraitNoteText}>
            Your Partner Guide is always visible to your partner when connected
            {' \u2014 '}that's how they learn to support you best.
          </Text>
        </View>

        {/* ── Summary Card ────────────── */}
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>What Your Partner Currently Sees</Text>
          {sharedNames.length > 0 ? (
            <Text style={s.summaryList}>{sharedNames.join(', ')}</Text>
          ) : (
            <Text style={s.summaryEmpty}>
              You haven't shared any assessments yet.
            </Text>
          )}
        </View>

        {/* ── Footer ──────────────────── */}
        <View style={s.footer}>
          <Text style={s.footerNote}>
            Your partner is not notified when you change sharing settings.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(app)/privacy')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="View full privacy policy"
          >
            <Text style={s.footerLink}>View full privacy policy</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
      <Animated.View style={[s.quickLinksWrapper, quickLinksAnimStyle]}>
        <QuickLinksBar />
      </Animated.View>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  quickLinksWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  backText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  heroIcon: {
    fontSize: 48,
  },
  heroTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  heroSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },

  // Partner info
  partnerCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    ...Shadows.subtle,
  },
  partnerIcon: {
    fontSize: 22,
  },
  partnerText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    flex: 1,
  },
  partnerName: {
    fontWeight: '700',
    color: Colors.secondary,
  },
  partnerCardDisconnected: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
  },
  partnerDisconnectedText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  partnerLink: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },

  // Section label
  sectionLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },

  // Toggle cards
  toggleCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
    marginRight: Spacing.sm,
  },
  toggleIcon: {
    fontSize: 24,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleName: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  toggleDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  toggleRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Portrait note
  portraitNote: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    marginTop: Spacing.xs,
  },
  portraitNoteText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  summaryTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  summaryList: {
    fontSize: FontSizes.bodySmall,
    color: Colors.secondary,
    lineHeight: 22,
    fontWeight: '500',
  },
  summaryEmpty: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  footerNote: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
});
