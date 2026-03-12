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
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, BorderRadius, Typography, Shadows, FontSizes } from '@/constants/theme';
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
import LetterInbox from '@/components/dating/LetterInbox';
import { MailboxIcon } from '@/assets/graphics/icons';
import type {
  DatingProfile,
  GameAnswer,
  ConstellationResult,
  ArchetypeScores,
} from '@/types/dating';

type TabKey = 'game' | 'profile' | 'discover' | 'letters' | 'rooms';

const TABS: { id: TabKey; label: string; Icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: 'game', label: 'The Field', Icon: TargetIcon },
  { id: 'profile', label: 'My Shape', Icon: SparkleIcon },
  { id: 'discover', label: 'Discover', Icon: SearchIcon },
  { id: 'letters', label: 'Letters', Icon: MailboxIcon },
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
        const updated = await updateDatingProfile(session.user.id, {
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
        setProfile(updated);
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
        const updated = await updateDatingProfile(session.user.id, { bio });
        setProfile(updated);
      } catch (err) {
        if (__DEV__) console.error('Failed to update bio:', err);
      }
    },
    [session?.user?.id],
  );

  const handleVisibilityChange = useCallback(
    async (isVisible: boolean, isActive: boolean) => {
      if (!session?.user?.id) return;
      try {
        const updated = await updateDatingProfile(session.user.id, { isVisible, isActive });
        setProfile(updated);
      } catch (err) {
        if (__DEV__) console.error('Failed to update visibility:', err);
      }
    },
    [session?.user?.id],
  );

  const handleTabPress = (tabId: TabKey) => {
    if (!gameComplete && tabId !== 'game') {
      Alert.alert(
        'Play The Field First',
        'Complete the constellation game to unlock your profile, discovery, and rooms.',
        [{ text: 'Got it', style: 'default' }],
      );
      return;
    }
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
          <Text style={styles.headerPre}>TENDER PRESENTS</Text>
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
            ? '#6B5E56'
            : active
              ? '#D4A843'
              : '#6B5E56';
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
              initialIsVisible={profile?.isVisible ?? true}
              initialIsActive={profile?.isActive ?? true}
              onPreferencesChange={handlePreferencesChange}
              onBioChange={handleBioChange}
              onVisibilityChange={handleVisibilityChange}
            />
          </Animated.View>
        )}

        {activeTab === 'discover' && (
          <Animated.View entering={FadeIn.duration(400)}>
            <DiscoverView userId={session?.user?.id || ''} userProfile={profile} />
          </Animated.View>
        )}

        {activeTab === 'letters' && (
          <Animated.View entering={FadeIn.duration(400)}>
            <LetterInbox
              userId={session?.user?.id || ''}
              onBack={() => setActiveTab('discover')}
            />
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
    backgroundColor: '#FAF7F2',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Header — warm parchment, editorial feel
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1.5,
    borderBottomColor: '#e8e3db',
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e8e3db',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerPre: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#6B5E56',
    marginBottom: 2,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: FontSizes.headingL,
    letterSpacing: 1,
    color: '#3D3530',
  },
  headerSub: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: '#6B5E56',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },

  // Tab Bar — vintage catalog tabs
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e3db',
    backgroundColor: '#FAF7F2',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    backgroundColor: Colors.surface,
    borderBottomColor: '#D4A843',
  },
  tabIconWrap: {
    marginBottom: 4,
  },
  tabIconLocked: {
    opacity: 0.4,
  },
  tabLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.tiny,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#6B5E56',
  },
  tabLabelActive: {
    color: '#3D3530',
    fontFamily: 'JosefinSans_500Medium',
  },
  tabLabelLocked: {
    color: '#6B5E56',
    opacity: 0.4,
  },
  tabLock: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#C4836A',
    marginTop: 2,
  },

  // Content
  scrollView: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
    maxWidth: 560,
    alignSelf: 'center',
    width: '100%',
  },

  // Game Complete — warm, celebratory
  completeContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  completeTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    color: '#3D3530',
    textAlign: 'center',
    marginBottom: 4,
  },
  completeDesc: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.body,
    color: '#6B5E56',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  completeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.pill,
    backgroundColor: '#E8B4B8',
  },
  primaryButtonText: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 13,
    color: '#3D3530',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    borderColor: '#8BA4B8',
  },
  secondaryButtonText: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 13,
    color: '#8BA4B8',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
