/**
 * Relationship Mode Settings
 *
 * Allows users to change their relationship mode and demo partner
 * at any time. Assessment data persists across mode changes.
 */

import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/services/supabase';
import { SoundHaptics } from '@/services/SoundHapticsService';
import { setupDemoPartnerCouple, cleanupAllCouples, getMyCouple } from '@/services/couples';
import { seedDyadicAssessments } from '@/utils/demo-data';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  ArrowLeftIcon,
  SeedlingIcon,
  CoupleIcon,
  HeartDoubleIcon,
  SparkleIcon,
  BrainIcon,
  HeartPulseIcon,
  LeafIcon,
  CompassIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';
import {
  DEMO_PARTNER_LIST,
  DEMO_PARTNERS,
  getRelationshipModeLabel,
  type RelationshipMode,
  type DemoPartnerId,
} from '@/constants/demoPartners';

const MODE_ICONS: Record<RelationshipMode, React.ComponentType<IconProps>> = {
  solo: SeedlingIcon,
  demo_partner: CoupleIcon,
  real_partner: HeartDoubleIcon,
  random_partner: SparkleIcon,
};

const PARTNER_ICONS: Record<string, React.ComponentType<IconProps>> = {
  brain: BrainIcon,
  flame: HeartPulseIcon,
  leaf: LeafIcon,
  compass: CompassIcon,
};

const ALL_MODES: { mode: RelationshipMode; label: string; description: string }[] = [
  { mode: 'solo', label: 'Solo Self-Reflection', description: 'Understand your patterns and prepare for love' },
  { mode: 'demo_partner', label: 'Practice with Demo Partner', description: 'Learn with an AI partner who provides real friction' },
  { mode: 'real_partner', label: 'With My Real Partner', description: 'Invite your partner to grow together' },
  { mode: 'random_partner', label: 'Surprise Me', description: 'Get a random practice partner' },
];

export default function RelationshipModeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentMode, setCurrentMode] = useState<RelationshipMode>('solo');
  const [selectedMode, setSelectedMode] = useState<RelationshipMode>('solo');
  const [currentPartnerId, setCurrentPartnerId] = useState<DemoPartnerId | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<DemoPartnerId | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('relationship_mode, demo_partner_id')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          const mode = (profile.relationship_mode || 'solo') as RelationshipMode;
          setCurrentMode(mode);
          setSelectedMode(mode);
          if (profile.demo_partner_id) {
            setCurrentPartnerId(profile.demo_partner_id as DemoPartnerId);
            setSelectedPartnerId(profile.demo_partner_id as DemoPartnerId);
          }
        }
      } catch (err) {
        console.error('Failed to load relationship mode:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id || saving) return;
    setSaving(true);
    try {
      const updates: Record<string, any> = {
        user_id: user.id,
        relationship_mode: selectedMode,
      };

      // Set demo_partner_id based on mode
      if (selectedMode === 'demo_partner') {
        updates.demo_partner_id = selectedPartnerId;
      } else if (selectedMode === 'random_partner') {
        // Auto-assign a random partner
        const ids = Object.keys(DEMO_PARTNERS) as DemoPartnerId[];
        updates.demo_partner_id = ids[Math.floor(Math.random() * ids.length)];
      } else {
        updates.demo_partner_id = null;
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert(updates, { onConflict: 'user_id' });

      if (error) throw error;

      // Set up or tear down demo partner couple for couple portal access
      if (selectedMode === 'demo_partner' || selectedMode === 'random_partner') {
        // Create self-couple and seed dyadic assessments for demo partner
        const couple = await setupDemoPartnerCouple(user.id);
        if (couple) {
          await seedDyadicAssessments(couple.id, user.id, user.id);
        }
      } else if (
        (currentMode === 'demo_partner' || currentMode === 'random_partner') &&
        selectedMode !== 'demo_partner' &&
        selectedMode !== 'random_partner'
      ) {
        // Switching away from demo mode — clean up the self-couple
        const myCouple = await getMyCouple(user.id);
        if (myCouple && myCouple.partner_a_id === myCouple.partner_b_id) {
          await cleanupAllCouples(user.id);
        }
      }

      SoundHaptics.success();
      router.back();
    } catch (err) {
      console.error('Failed to save mode:', err);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = selectedMode !== currentMode ||
    (selectedMode === 'demo_partner' && selectedPartnerId !== currentPartnerId);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
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
        <Text style={styles.headerTitle}>Relationship Mode</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode Selection */}
        <Text style={styles.sectionLabel}>Choose Your Mode</Text>
        <View style={styles.modeList}>
          {ALL_MODES.map((item) => {
            const isSelected = selectedMode === item.mode;
            const Icon = MODE_ICONS[item.mode];
            return (
              <TouchableOpacity
                key={item.mode}
                style={[styles.modeOption, isSelected && styles.modeOptionSelected]}
                onPress={() => {
                  SoundHaptics.tap();
                  setSelectedMode(item.mode);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.modeIconWrap}>
                  <Icon size={22} color={isSelected ? Colors.primaryDark : Colors.primary} />
                </View>
                <View style={styles.modeTextWrap}>
                  <Text style={[styles.modeLabel, isSelected && styles.modeLabelSelected]}>
                    {item.label}
                  </Text>
                  <Text style={styles.modeDesc}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Partner Selection (only if demo_partner mode) */}
        {selectedMode === 'demo_partner' && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
              Choose Your Practice Partner
            </Text>
            <View style={styles.partnerList}>
              {DEMO_PARTNER_LIST.map((partner) => {
                const isSelected = selectedPartnerId === partner.id;
                const Icon = PARTNER_ICONS[partner.iconName] ?? CompassIcon;
                return (
                  <TouchableOpacity
                    key={partner.id}
                    style={[
                      styles.partnerOption,
                      isSelected && styles.partnerOptionSelected,
                      isSelected && { borderColor: partner.color },
                    ]}
                    onPress={() => {
                      SoundHaptics.tap();
                      setSelectedPartnerId(partner.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.partnerIconCircle, { backgroundColor: partner.color + '20' }]}>
                      <Icon size={24} color={partner.color} />
                    </View>
                    <View style={styles.partnerInfo}>
                      <Text style={[styles.partnerName, isSelected && { color: partner.color }]}>
                        {partner.name}
                      </Text>
                      <Text style={styles.partnerTitle}>{partner.displayName}</Text>
                      <Text style={styles.partnerDesc}>{partner.shortDescription}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Data persistence note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Changing modes keeps your assessment data. Only your practice partner context changes.
          </Text>
        </View>
      </ScrollView>

      {/* Save button */}
      {hasChanges && (
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.saveText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  sectionLabel: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  modeList: {
    gap: Spacing.sm,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  modeOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  modeIconWrap: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTextWrap: {
    flex: 1,
    gap: 2,
  },
  modeLabel: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.text,
  },
  modeLabelSelected: {
    color: Colors.primaryDark,
    fontFamily: 'JosefinSans_600SemiBold',
  },
  modeDesc: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
  },
  partnerList: {
    gap: Spacing.sm,
  },
  partnerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  partnerOptionSelected: {
    backgroundColor: Colors.surface,
    ...Shadows.subtle,
  },
  partnerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerInfo: {
    flex: 1,
    gap: 2,
  },
  partnerName: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
  },
  partnerTitle: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.accent,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  partnerDesc: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
  },
  noteCard: {
    backgroundColor: Colors.accentCream + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  noteText: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
