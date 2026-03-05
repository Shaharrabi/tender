/**
 * Dating Well — "The Art of Beginning"
 *
 * A Tender feature for single/early-dating users that applies
 * WEARE philosophy and attachment science to dating.
 *
 * 4 tabs (internal, useState-based like Portrait screen):
 * - The Field: 80s arcade game that builds your constellation
 * - My Shape: Profile builder (locked until game complete)
 * - Discover: WEARE resonance cards (locked until game complete)
 * - Rooms: Meeting rooms + hotel rooms (locked until game complete)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { getDatingProfile, saveGameResults, updateDatingProfile } from '@/services/dating';
import {
  ArrowLeftIcon,
  TargetIcon,
  SparkleIcon,
  SearchIcon,
  CommunityIcon,
} from '@/assets/graphics/icons';
import ArcadeGame from '@/components/dating/ArcadeGame';
import ProfileBuilder from '@/components/dating/ProfileBuilder';
import DiscoverView from '@/components/dating/DiscoverView';
import RoomsView from '@/components/dating/RoomsView';
import type {
  DatingProfile,
  GameAnswer,
  ConstellationResult,
  ArchetypeScores,
} from '@/types/dating';

type TabKey = 'game' | 'profile' | 'discover' | 'rooms';

const TABS: { id: TabKey; label: string; Icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: 'game', label: 'The Field', Icon: TargetIcon },
  { id: 'profile', label: 'My Shape', Icon: SparkleIcon },
  { id: 'discover', label: 'Discover', Icon: SearchIcon },
  { id: 'rooms', label: 'Rooms', Icon: CommunityIcon },
];

export default function DatingWellScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const { session } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>(
    (tab as TabKey) || 'game',
  );
  const [gameComplete, setGameComplete] = useState(false);
  const [constellation, setConstellation] = useState<string[] | null>(null);
  const [profile, setProfile] = useState<DatingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load existing profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    try {
      const existing = await getDatingProfile(session.user.id);
      if (existing) {
        setProfile(existing);
        if (existing.constellation) {
          setGameComplete(true);
          setConstellation(existing.constellation.topTraits);
          // If game already complete and we're on the game tab, show "completed" state
        }
      }
    } catch (err) {
      if (__DEV__) console.error('Failed to load dating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = useCallback(
    async (
      answers: GameAnswer[],
      constellationResult: ConstellationResult,
      archetypeScores: ArchetypeScores,
    ) => {
      setConstellation(constellationResult.topTraits);
      setGameComplete(true);
      setActiveTab('profile');

      // Save to DB
      if (session?.user?.id) {
        try {
          const savedProfile = await saveGameResults(
            session.user.id,
            answers,
            constellationResult,
            archetypeScores,
          );
          setProfile(savedProfile);
        } catch (err) {
          if (__DEV__) console.error('Failed to save game results:', err);
        }
      }
    },
    [session?.user?.id],
  );

  const handlePreferencesChange = useCallback(
    async (prefs: Record<string, any>) => {
      if (!session?.user?.id) return;
      try {
        await updateDatingProfile(session.user.id, {
          preferences: {
            genderIdentity: prefs.gender_identity,
            lookingFor: prefs.looking_for,
            ageRangeMin: prefs.age_range_min,
            ageRangeMax: prefs.age_range_max,
            locationRadius: prefs.location_radius,
            kids: prefs.kids,
            smoking: prefs.smoking,
            drinking: prefs.drinking,
            relationshipStyle: prefs.relationship_style,
            therapyStance: prefs.therapy,
            spirituality: prefs.spirituality,
            conflictStyle: prefs.conflict_style,
            loveLanguages: prefs.love_language,
          },
        });
      } catch (err) {
        if (__DEV__) console.error('Failed to update preferences:', err);
      }
    },
    [session?.user?.id],
  );

  const handleBioChange = useCallback(
    async (bio: string) => {
      if (!session?.user?.id) return;
      try {
        await updateDatingProfile(session.user.id, { bio });
      } catch (err) {
        if (__DEV__) console.error('Failed to update bio:', err);
      }
    },
    [session?.user?.id],
  );

  const handleTabPress = (tabId: TabKey) => {
    if (!gameComplete && tabId !== 'game') return;
    setActiveTab(tabId);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} accessibilityLabel="Loading" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)/home'))}
          accessibilityRole="button"
          accessibilityLabel="Tender presents"
        >
          <ArrowLeftIcon size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerPre}>Tender presents</Text>
          <Text style={styles.headerTitle}>Dating Well</Text>
          <Text style={styles.headerSub}>The Art of Beginning</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const locked = !gameComplete && t.id !== 'game';
          const active = activeTab === t.id;
          const iconColor = locked
            ? Colors.textMuted
            : active
              ? Colors.primary
              : Colors.textSecondary;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => handleTabPress(t.id)}
              disabled={locked}
              activeOpacity={locked ? 1 : 0.7}
              accessibilityRole="button"
              accessibilityState={{ disabled: locked }}
            >
              <View style={[styles.tabIconWrap, locked && styles.tabIconLocked]}>
                <t.Icon size={16} color={iconColor} />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  active && styles.tabLabelActive,
                  locked && styles.tabLabelLocked,
                ]}
              >
                {t.label}
              </Text>
              {locked && <Text style={styles.tabLock}>Play first</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'game' && (
          <Animated.View entering={FadeIn.duration(400)}>
            {!gameComplete ? (
              <ArcadeGame onComplete={handleGameComplete} />
            ) : (
              <GameCompleteView
                onGoToProfile={() => setActiveTab('profile')}
                onGoToDiscover={() => setActiveTab('discover')}
              />
            )}
          </Animated.View>
        )}

        {activeTab === 'profile' && (
          <Animated.View entering={FadeIn.duration(400)}>
            <ProfileBuilder
              constellation={constellation}
              initialPreferences={profile?.preferences}
              initialBio={profile?.bio || ''}
              onPreferencesChange={handlePreferencesChange}
              onBioChange={handleBioChange}
            />
          </Animated.View>
        )}

        {activeTab === 'discover' && (
          <Animated.View entering={FadeIn.duration(400)}>
            <DiscoverView />
          </Animated.View>
        )}

        {activeTab === 'rooms' && (
          <Animated.View entering={FadeIn.duration(400)}>
            <RoomsView />
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Game Complete State (shown in The Field tab after completion) ───

function GameCompleteView({
  onGoToProfile,
  onGoToDiscover,
}: {
  onGoToProfile: () => void;
  onGoToDiscover: () => void;
}) {
  return (
    <View style={styles.completeContainer}>
      <SparkleIcon size={40} color={Colors.accentGold} />
      <Text style={styles.completeTitle}>Your Field Has Been Mapped</Text>
      <Text style={styles.completeDesc}>
        Your constellation is alive in your profile. Now shape the practical
        details — or jump straight to discovering who resonates with your field.
      </Text>
      <View style={styles.completeActions}>
        <TouchableOpacity style={styles.primaryButton} onPress={onGoToProfile} accessibilityRole="button" accessibilityLabel="Shape My Profile">
          <Text style={styles.primaryButtonText}>Shape My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onGoToDiscover} accessibilityRole="button" accessibilityLabel="Start Discovering">
          <Text style={styles.secondaryButtonText}>Start Discovering</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────

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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerPre: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '300',
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '300',
    fontSize: 26,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: Colors.text,
  },
  headerSub: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontStyle: 'italic',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  headerSpacer: {
    width: 40,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surfaceElevated,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    backgroundColor: Colors.surface,
    borderBottomColor: Colors.primary,
  },
  tabIconWrap: {
    marginBottom: 2,
  },
  tabIconLocked: {
    opacity: 0.5,
  },
  tabLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  tabLabelLocked: {
    color: Colors.textMuted,
    opacity: 0.5,
  },
  tabLock: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 8,
    color: Colors.textMuted,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.scrollPadBottom,
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
  },

  // Game Complete
  completeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  completeTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  completeDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  completeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 1,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  secondaryButtonText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    color: Colors.secondary,
  },
});
