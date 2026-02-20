/**
 * Support Groups — Attachment-Based Group Healing
 *
 * 4 internal screens managed via useState:
 * - landing:       Group selection with ECR-R routing
 * - registration:  Registration form with consent
 * - confirmation:  Confirmation or waitlist status
 * - session:       Active group session view
 *
 * Route: /(app)/support-groups
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import HomeButton from '@/components/HomeButton';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
} from '@/constants/theme';
import { ArrowLeftIcon } from '@/assets/graphics/icons';

// ─── Service imports ───────────────────────────────────
import {
  getActiveGroups,
  getUserMembership,
  getRecommendedGroup,
  registerForGroup,
  getUpcomingSessions,
  getSessionHistory,
  recordAttendance,
  getGroupMemberCount,
  getECRRScores,
} from '@/services/support-groups';

// ─── Component imports ─────────────────────────────────
import GroupLandingView from '@/components/support-groups/GroupLandingView';
import GroupRegistrationForm from '@/components/support-groups/GroupRegistrationForm';
import ConfirmationView from '@/components/support-groups/ConfirmationView';
import GroupSessionView from '@/components/support-groups/GroupSessionView';

// ─── Content imports ───────────────────────────────────
import { getAdaptedStep } from '@/utils/steps/adapted-steps';

// ─── Types ─────────────────────────────────────────────
import type {
  SupportGroup,
  SupportGroupMember,
  SupportGroupSession,
  SupportGroupAttendance,
  GroupRecommendation,
  SupportGroupType,
  RegistrationFormData,
  AdaptedStep,
} from '@/types/support-groups';
import type { ECRRScores, AttachmentStyle } from '@/types';

// ─── Screen State ──────────────────────────────────────

type ScreenKey = 'landing' | 'registration' | 'confirmation' | 'session';

const ATTACHMENT_LABELS: Record<AttachmentStyle, string> = {
  'secure': 'Secure',
  'anxious-preoccupied': 'Anxious-Preoccupied',
  'dismissive-avoidant': 'Dismissive-Avoidant',
  'fearful-avoidant': 'Fearful-Avoidant',
};

// ─── Component ─────────────────────────────────────────

export default function SupportGroupsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  // Screen state
  const [screen, setScreen] = useState<ScreenKey>('landing');
  const [loading, setLoading] = useState(true);

  // Data state
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [recommendation, setRecommendation] = useState<GroupRecommendation | null>(null);
  const [membership, setMembership] = useState<SupportGroupMember | null>(null);
  const [ecrScores, setEcrScores] = useState<ECRRScores | null>(null);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});

  // Selected group for registration
  const [selectedGroupType, setSelectedGroupType] = useState<SupportGroupType | null>(null);

  // Session data (for session screen)
  const [nextSession, setNextSession] = useState<SupportGroupSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<(SupportGroupSession & { attendance?: SupportGroupAttendance })[]>([]);
  const [adaptedStep, setAdaptedStep] = useState<AdaptedStep | null>(null);

  // Registration loading
  const [submitting, setSubmitting] = useState(false);

  // ─── Initial load ──────────────────────────────────

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Load in parallel
      const [groupsData, memberData, recData, scores] = await Promise.all([
        getActiveGroups(),
        getUserMembership(user.id),
        getRecommendedGroup(user.id),
        getECRRScores(user.id),
      ]);

      setGroups(groupsData);
      setRecommendation(recData);
      setEcrScores(scores);

      // Load member counts
      const counts: Record<string, number> = {};
      for (const g of groupsData) {
        counts[g.id] = await getGroupMemberCount(g.id);
      }
      setMemberCounts(counts);

      // If already registered, navigate to appropriate screen
      if (memberData) {
        setMembership(memberData);
        const memberGroup = groupsData.find((g) => g.id === memberData.groupId);

        if (memberData.status === 'active' && memberGroup) {
          await loadSessionData(memberGroup, user.id);
          setScreen('session');
        } else if (memberData.status === 'waitlisted') {
          if (memberGroup) {
            const upcoming = await getUpcomingSessions(memberGroup.id, 1);
            setNextSession(upcoming[0] ?? null);
          }
          setScreen('confirmation');
        }
      }
    } catch (err) {
      console.warn('Support Groups: load error', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadSessionData = useCallback(
    async (group: SupportGroup, userId: string) => {
      try {
        const [upcoming, history] = await Promise.all([
          getUpcomingSessions(group.id, 1),
          getSessionHistory(group.id, userId),
        ]);
        setNextSession(upcoming[0] ?? null);
        setSessionHistory(history);

        // Get adapted step content
        const step = getAdaptedStep(group.groupType, group.currentStep);
        setAdaptedStep(step ?? null);
      } catch (err) {
        console.warn('Support Groups: session data error', err);
      }
    },
    [],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Handlers ──────────────────────────────────────

  const handleSelectGroup = (groupType: SupportGroupType) => {
    setSelectedGroupType(groupType);
    setScreen('registration');
  };

  const handleSwitchGroup = () => {
    setSelectedGroupType((prev) => (prev === 'anxious' ? 'avoidant' : 'anxious'));
  };

  const handleStartAssessment = () => {
    router.push('/(app)/assessment' as any);
  };

  const handleSubmitRegistration = async (formData: RegistrationFormData) => {
    if (!user || !selectedGroupType) return;

    const group = groups.find((g) => g.groupType === selectedGroupType);
    if (!group) return;

    setSubmitting(true);
    try {
      const member = await registerForGroup(user.id, group.id, formData, ecrScores);
      setMembership(member);

      if (member.status === 'active') {
        await loadSessionData(group, user.id);
      }

      // Load next session for confirmation view
      const upcoming = await getUpcomingSessions(group.id, 1);
      setNextSession(upcoming[0] ?? null);

      setScreen('confirmation');
    } catch (err) {
      console.warn('Registration error', err);
      const msg = 'Registration failed. Please try again.';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordAttendance = async (sessionId: string, notes?: string) => {
    if (!user) return;
    try {
      await recordAttendance(sessionId, user.id, notes);
      // Reload session history
      const group = groups.find((g) => g.id === membership?.groupId);
      if (group) {
        await loadSessionData(group, user.id);
      }
    } catch (err) {
      console.warn('Attendance error', err);
    }
  };

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  // ─── Loading ───────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ─── Derived data ──────────────────────────────────

  const selectedGroup = groups.find((g) => g.groupType === selectedGroupType);
  const memberGroup = groups.find((g) => g.id === membership?.groupId);
  const otherGroupName = selectedGroupType === 'anxious' ? 'The Retreat' : 'The Reach';
  const attachmentLabel = ecrScores?.attachmentStyle
    ? ATTACHMENT_LABELS[ecrScores.attachmentStyle]
    : null;

  // ─── Render ────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Back button for landing */}
        {screen === 'landing' && (
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={styles.backBtn}
            >
              <ArrowLeftIcon size={16} color={Colors.primary} />
              <Text style={styles.backText}>Therapy</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Landing */}
        {screen === 'landing' && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.screenWrap}>
            <GroupLandingView
              groups={groups}
              recommendation={recommendation}
              memberCounts={memberCounts}
              onSelectGroup={handleSelectGroup}
              onStartAssessment={handleStartAssessment}
            />
          </Animated.View>
        )}

        {/* Registration */}
        {screen === 'registration' && selectedGroup && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.screenWrap}>
            {submitting ? (
              <View style={styles.loadingCenter}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Registering...</Text>
              </View>
            ) : (
              <GroupRegistrationForm
                group={selectedGroup}
                userDisplayName={user?.user_metadata?.display_name ?? null}
                userEmail={user?.email ?? null}
                attachmentLabel={attachmentLabel}
                onSubmit={handleSubmitRegistration}
                onBack={() => setScreen('landing')}
                onSwitchGroup={handleSwitchGroup}
                otherGroupName={otherGroupName}
              />
            )}
          </Animated.View>
        )}

        {/* Confirmation */}
        {screen === 'confirmation' && membership && (memberGroup || selectedGroup) && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.screenWrap}>
            <ConfirmationView
              membership={membership}
              group={(memberGroup || selectedGroup)!}
              nextSession={nextSession}
              onViewSession={() => {
                if (memberGroup) {
                  loadSessionData(memberGroup, user!.id);
                }
                setScreen('session');
              }}
              onGoHome={() => router.back()}
              onNavigate={handleNavigate}
            />
          </Animated.View>
        )}

        {/* Session */}
        {screen === 'session' && membership && memberGroup && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.screenWrap}>
            {/* Back to therapy */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                style={styles.backBtn}
              >
                <ArrowLeftIcon size={16} color={Colors.primary} />
                <Text style={styles.backText}>Therapy</Text>
              </TouchableOpacity>
            </View>

            <GroupSessionView
              group={memberGroup}
              membership={membership}
              nextSession={nextSession}
              sessions={sessionHistory}
              adaptedStep={adaptedStep}
              onRecordAttendance={handleRecordAttendance}
              onNavigateToStep={() =>
                router.push('/(app)/step-detail' as any)
              }
            />
          </Animated.View>
        )}
      </View>
      <HomeButton />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  screenWrap: {
    flex: 1,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
});
