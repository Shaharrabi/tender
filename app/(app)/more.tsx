/**
 * More Screen — Settings, Community, Support & Overflow Features
 *
 * Contains items moved off the home page to keep it focused:
 * - Groups & Therapy Support
 * - Community
 * - Dating Well (solo mode only)
 * - Settings (Relationship Mode, Notifications, Sharing, Privacy)
 * - Logout
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { supabase } from '@/services/supabase';
import { getAllAssessments } from '@/utils/assessments/registry';
import QuickLinksBar from '@/components/QuickLinksBar';
import { useScrollHideBar } from '@/hooks/useScrollHideBar';
import ReAnimated from 'react-native-reanimated';
import TenderButton from '@/components/ui/TenderButton';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import {
  CommunityIcon,
  HeartDoubleIcon,
  SettingsIcon,
  BellIcon,
  ShieldIcon,
  CoupleIcon,
  PersonIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SearchIcon,
} from '@/assets/graphics/icons';
import { getRelationshipModeLabel, DEMO_PARTNERS, type DemoPartnerId } from '@/constants/demoPartners';
import { SoundHaptics } from '@/services/SoundHapticsService';

// ─── Component ──────────────────────────────────────────

export default function MoreScreen() {
  const { user, signOut } = useAuth();
  const { isGuest, clearGuestData } = useGuest();
  const router = useRouter();
  const { handleScroll: handleScrollBar, animatedStyle: quickLinksAnimStyle, BAR_HEIGHT: barH } = useScrollHideBar();

  const [relationshipMode, setRelationshipMode] = useState<string>('solo');
  const [demoPartnerId, setDemoPartnerId] = useState<string | null>(null);
  const [onboardedAsPartner, setOnboardedAsPartner] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      (async () => {
        try {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('relationship_mode, demo_partner_id, relationship_status')
            .eq('user_id', user.id)
            .single();
          if (profile?.relationship_mode) setRelationshipMode(profile.relationship_mode);
          if (profile?.demo_partner_id) setDemoPartnerId(profile.demo_partner_id);
          if (profile?.relationship_status === 'in-relationship') setOnboardedAsPartner(true);
        } catch {}
      })();
    }, [user])
  );

  const handleLogout = async () => {
    const configs = getAllAssessments();
    for (const config of configs) {
      await AsyncStorage.removeItem(config.progressKey).catch(() => {});
      if (user) {
        await AsyncStorage.removeItem(`${config.progressKey}_${user.id}`).catch(() => {});
      }
    }
    if (user) {
      await AsyncStorage.removeItem(`tender_assessment_progress_${user.id}`).catch(() => {});
    }
    await AsyncStorage.removeItem('tender_assessment_progress').catch(() => {});
    await AsyncStorage.removeItem('demo_mode').catch(() => {});
    await clearGuestData();
    await signOut();
    router.replace('/(auth)/login');
  };

  // Dating Well is always visible in More for single users.
  // For non-single users, show it only if they're in solo mode (exploratory).
  const isSingleStatus = !onboardedAsPartner && (relationshipMode === 'solo' || relationshipMode === 'random_partner');
  const showDatingWell = isSingleStatus;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: barH + 20 }]} showsVerticalScrollIndicator={false} onScroll={handleScrollBar} scrollEventThrottle={16}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeftIcon size={20} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>More</Text>
        </View>

        {/* ═══ EXPLORE ══════════════════════════════════════ */}
        <Text style={styles.sectionLabel}>EXPLORE</Text>

        <View style={styles.cardGroup}>
          <MoreRow
            icon={<CommunityIcon size={20} color={Colors.secondary} />}
            title="Community"
            subtitle="Anonymous stories and support"
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/community' as any); }}
          />
          <MoreRow
            icon={<HeartDoubleIcon size={20} color={Colors.primary} />}
            title="Groups & Therapy Support"
            subtitle="Find a group or therapist near you"
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/support-groups' as any); }}
          />
          <MoreRow
            icon={<SearchIcon size={20} color={Colors.calm} />}
            title="Find a Therapist"
            subtitle="Recommended professional support"
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/find-therapist' as any); }}
            isLast={!showDatingWell}
          />
          {showDatingWell && (
            <MoreRow
              icon={<PersonIcon size={20} color={Colors.accent} />}
              title="Dating Well"
              subtitle="Navigate new relationships with awareness"
              onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/dating-well' as any); }}
              isLast
            />
          )}
        </View>

        {/* ═══ SETTINGS ═════════════════════════════════════ */}
        <Text style={styles.sectionLabel}>SETTINGS</Text>

        <View style={styles.cardGroup}>
          <MoreRow
            icon={<CoupleIcon size={20} color={Colors.primary} />}
            title="Relationship Mode"
            subtitle={getRelationshipModeLabel(relationshipMode as any)}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/relationship-mode' as any); }}
          />
          <MoreRow
            icon={<BellIcon size={20} color={Colors.secondary} />}
            title="Notifications"
            subtitle="Manage reminders and alerts"
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/notification-settings' as any); }}
          />
          <MoreRow
            icon={<ShieldIcon size={20} color={Colors.calm} />}
            title="Privacy & Sharing"
            subtitle="Data choices and partner sharing"
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/sharing-settings' as any); }}
          />
          <MoreRow
            icon={<SettingsIcon size={20} color={Colors.textMuted} />}
            title="Privacy Policy"
            subtitle="How we handle your data"
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/privacy' as any); }}
            isLast
          />
        </View>

        {/* ═══ LOGOUT ═══════════════════════════════════════ */}
        <View style={styles.logoutSection}>
          <TenderButton
            title={isGuest ? 'Sign Up' : 'Logout'}
            onPress={isGuest ? () => router.replace('/(auth)/register') : handleLogout}
            variant="outline"
            size="md"
            fullWidth
            accessibilityLabel={isGuest ? 'Sign Up' : 'Logout'}
          />
        </View>

      </ScrollView>
      <ReAnimated.View style={[{ position: 'absolute', bottom: 0, left: 0, right: 0 }, quickLinksAnimStyle]}>
        <QuickLinksBar />
      </ReAnimated.View>
    </SafeAreaView>
  );
}

// ─── MoreRow ─────────────────────────────────────────────

interface MoreRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
}

function MoreRow({ icon, title, subtitle, onPress, isLast }: MoreRowProps) {
  return (
    <TouchableOpacity
      style={[styles.moreRow, !isLast && styles.moreRowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.moreRowIcon}>{icon}</View>
      <View style={styles.moreRowContent}>
        <Text style={styles.moreRowTitle}>{title}</Text>
        <Text style={styles.moreRowSubtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
      <ArrowRightIcon size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.scrollPadBottom,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerTitle: {
    ...Typography.headingL,
    color: Colors.text,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  cardGroup: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    ...Shadows.card,
  },
  moreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  moreRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  moreRowIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreRowContent: {
    flex: 1,
    gap: 2,
  },
  moreRowTitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '500',
  },
  moreRowSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
  },
  logoutSection: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
});
