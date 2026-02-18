/**
 * Partner Connection Screen
 *
 * Two modes:
 * 1. No couple yet → Show invite/accept interface
 * 2. Coupled → Show partner status and dyadic assessment progress
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import {
  createInvite,
  getInviteByCode,
  acceptInvite,
  getMyCouple,
  getMyInvites,
  getPartnerProfile,
  getOrCreateProfile,
  checkDyadicCompletion,
} from '@/services/couples';
import { getDyadicAssessments } from '@/utils/assessments/registry';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { Couple, CoupleInvite, UserProfile } from '@/types/couples';

export default function PartnerScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
  const [myInvites, setMyInvites] = useState<CoupleInvite[]>([]);
  const [dyadicStatus, setDyadicStatus] = useState<{
    userComplete: string[];
    partnerComplete: string[];
    allDone: boolean;
  }>({ userComplete: [], partnerComplete: [], allDone: false });

  // Invite flow state
  const [activeInvite, setActiveInvite] = useState<CoupleInvite | null>(null);
  const [acceptCode, setAcceptCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Ensure profile exists
      await getOrCreateProfile(user.id);

      // Check if already coupled
      const existingCouple = await getMyCouple(user.id);
      setCouple(existingCouple);

      if (existingCouple) {
        const partner = await getPartnerProfile(user.id);
        setPartnerProfile(partner);
        const status = await checkDyadicCompletion(existingCouple.id, user.id);
        setDyadicStatus(status);
      } else {
        // Load existing invites
        const invites = await getMyInvites(user.id);
        setMyInvites(invites);
        const pending = invites.find((i) => i.status === 'pending');
        if (pending) setActiveInvite(pending);
      }
    } catch (e) {
      console.error('[Partner] Error loading data:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // ─── Create Invite ──────────────────────────────────

  const handleCreateInvite = async () => {
    if (!user) return;
    if (!displayName.trim()) {
      setShowNameInput(true);
      return;
    }
    setProcessing(true);
    try {
      await getOrCreateProfile(user.id, displayName.trim());
      const invite = await createInvite(user.id, displayName.trim());
      if (invite) {
        setActiveInvite(invite);
        // Share the code
        if (Platform.OS !== 'web') {
          await Share.share({
            message: `Join me on our couples journey! Enter this code: ${invite.invite_code}\n\nDownload the app and enter this code in the Partner section.`,
          });
        }
      }
    } catch (e) {
      console.error('[Partner] Error creating invite:', e);
    } finally {
      setProcessing(false);
    }
  };

  // ─── Accept Invite ──────────────────────────────────

  const handleAcceptInvite = async () => {
    if (!user || !acceptCode.trim()) return;
    setProcessing(true);
    try {
      const invite = await getInviteByCode(acceptCode.trim());
      if (!invite) {
        Alert.alert('Invalid Code', 'This invite code is invalid or has expired. Please check and try again.');
        setProcessing(false);
        return;
      }

      if (invite.inviter_id === user.id) {
        Alert.alert('Oops', "You can't accept your own invite!");
        setProcessing(false);
        return;
      }

      // Show consent before accepting
      Alert.alert(
        'Connect with Partner',
        `${invite.inviter_name || 'Your partner'} wants to connect with you. This will share your assessment data to create a combined relationship portrait.\n\nYou can disconnect at any time.`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setProcessing(false) },
          {
            text: 'Connect',
            onPress: async () => {
              const newCouple = await acceptInvite(invite.id, user.id);
              if (newCouple) {
                setCouple(newCouple);
                await loadData();
              } else {
                Alert.alert('Error', 'Failed to connect. Please try again.');
              }
              setProcessing(false);
            },
          },
        ]
      );
    } catch (e) {
      console.error('[Partner] Error accepting invite:', e);
      setProcessing(false);
    }
  };

  // ─── Render: Loading ─────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Render: Connected (Couple Exists) ───────────────

  if (couple) {
    const dyadicAssessments = getDyadicAssessments();
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'< Back'}</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Your Partnership</Text>
          <Text style={styles.subtitle}>
            Connected with {partnerProfile?.display_name || 'your partner'}
          </Text>

          {/* Connection Status Card */}
          <View style={[styles.card, styles.connectedCard]}>
            <View style={styles.partnerRow}>
              <View style={styles.partnerAvatar}>
                <Text style={styles.avatarText}>You</Text>
              </View>
              <View style={styles.connectionLine} />
              <View style={[styles.partnerAvatar, styles.partnerAvatarB]}>
                <Text style={styles.avatarText}>
                  {(partnerProfile?.display_name || 'P')[0]}
                </Text>
              </View>
            </View>
            <Text style={styles.connectedLabel}>Connected</Text>
          </View>

          {/* Sharing Settings */}
          <TouchableOpacity
            style={[styles.card, styles.sharingCard]}
            onPress={() => router.push('/(app)/sharing-settings' as any)}
            activeOpacity={0.7}
          >
            <View style={styles.sharingRow}>
              <Text style={styles.sharingIcon}>{'🔄'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.sharingTitle}>Sharing Settings</Text>
                <Text style={styles.sharingSubtitle}>
                  Control which assessments {partnerProfile?.display_name || 'your partner'} can see
                </Text>
              </View>
              <Text style={styles.sharingArrow}>{'→'}</Text>
            </View>
          </TouchableOpacity>

          {/* Dyadic Assessments Progress */}
          <Text style={styles.sectionTitle}>Relationship Assessments</Text>
          <Text style={styles.sectionDesc}>
            Both partners complete these about your relationship together.
          </Text>

          {dyadicAssessments.map((assessment) => {
            const myDone = dyadicStatus.userComplete.includes(assessment.type);
            const partnerDone = dyadicStatus.partnerComplete.includes(assessment.type);
            return (
              <TouchableOpacity
                key={assessment.type}
                style={[styles.card, styles.assessmentCard]}
                onPress={() => {
                  if (!myDone) {
                    router.push(`/(app)/assessment?type=${assessment.type}` as any);
                  }
                }}
                activeOpacity={myDone ? 1 : 0.7}
              >
                <View style={styles.assessmentHeader}>
                  <Text style={styles.assessmentName}>{assessment.shortName}</Text>
                  <Text style={styles.assessmentTime}>{assessment.estimatedMinutes} min</Text>
                </View>
                <Text style={styles.assessmentDesc}>{assessment.description}</Text>
                <View style={styles.completionRow}>
                  <View style={styles.completionItem}>
                    <View style={[styles.dot, myDone && styles.dotDone]} />
                    <Text style={styles.completionText}>
                      You: {myDone ? 'Done' : 'Not started'}
                    </Text>
                  </View>
                  <View style={styles.completionItem}>
                    <View style={[styles.dot, partnerDone && styles.dotDone]} />
                    <Text style={styles.completionText}>
                      Partner: {partnerDone ? 'Done' : 'Not started'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Couple Portal Entry */}
          {dyadicStatus.allDone ? (
            <TouchableOpacity
              style={[styles.card, styles.portalCard]}
              onPress={() => router.push('/(app)/couple-portal' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.portalTitle}>🌟 Couple Portal</Text>
              <Text style={styles.portalDesc}>
                Your combined relationship portrait is ready. Explore your patterns,
                strengths, and growth edges together.
              </Text>
              <Text style={styles.portalCta}>Enter Portal →</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.card, styles.portalLocked]}>
              <Text style={styles.portalLockedTitle}>Couple Portal</Text>
              <Text style={styles.portalLockedDesc}>
                Complete at least 1 relationship assessment together to unlock your
                couple portal. More assessments unlock deeper insights.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Render: Not Connected (Invite Flow) ─────────────

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Connect with Partner</Text>
        <Text style={styles.subtitle}>
          Link your accounts to begin your relationship journey together.
          Both partners need to complete their individual assessments first.
        </Text>

        {/* Active invite display */}
        {activeInvite ? (
          <View style={[styles.card, styles.inviteCard]}>
            <Text style={styles.inviteLabel}>Your Invite Code</Text>
            <Text style={styles.inviteCode}>{activeInvite.invite_code}</Text>
            <Text style={styles.inviteHint}>
              Share this code with your partner. They'll enter it below to connect.
            </Text>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => {
                if (Platform.OS === 'web') {
                  navigator.clipboard?.writeText(activeInvite.invite_code);
                  Alert.alert('Copied!', 'Code copied to clipboard.');
                } else {
                  Share.share({
                    message: `Join me on our couples journey! Enter this code: ${activeInvite.invite_code}`,
                  });
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.shareButtonText}>
                {Platform.OS === 'web' ? 'Copy Code' : 'Share Code'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.card, styles.createInviteCard]}>
            <Text style={styles.createInviteTitle}>Invite Your Partner</Text>
            <Text style={styles.createInviteDesc}>
              Generate a unique code to share with your partner.
            </Text>

            {showNameInput && (
              <TextInput
                style={styles.nameInput}
                placeholder="Your first name (shown to partner)"
                placeholderTextColor={Colors.textMuted}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            )}

            <TouchableOpacity
              style={[styles.primaryBtn, processing && styles.btnDisabled]}
              onPress={handleCreateInvite}
              disabled={processing}
              activeOpacity={0.7}
            >
              {processing ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryBtnText}>
                  {showNameInput ? 'Generate Invite Code' : 'Create Invite'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Accept invite */}
        <View style={[styles.card, styles.acceptCard]}>
          <Text style={styles.acceptTitle}>Have a Code?</Text>
          <Text style={styles.acceptDesc}>
            Enter the invite code your partner shared with you.
          </Text>
          <TextInput
            style={styles.codeInput}
            placeholder="XXXX-XXXX"
            placeholderTextColor={Colors.textMuted}
            value={acceptCode}
            onChangeText={setAcceptCode}
            autoCapitalize="characters"
            maxLength={9}
          />
          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              (!acceptCode.trim() || processing) && styles.btnDisabled,
            ]}
            onPress={handleAcceptInvite}
            disabled={!acceptCode.trim() || processing}
            activeOpacity={0.7}
          >
            {processing ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <Text style={styles.secondaryBtnText}>Connect</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            🔒 Your individual assessment results remain private until you both
            complete the relationship assessments. You can disconnect at any time.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontFamily: FontFamilies.body,
  },
  backBtn: {
    marginBottom: Spacing.md,
  },
  backText: {
    color: Colors.primary,
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
  },
  heading: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },

  // Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },

  // Connected state
  connectedCard: {
    alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  partnerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerAvatarB: {
    backgroundColor: Colors.secondary,
  },
  avatarText: {
    color: Colors.white,
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
  },
  connectionLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.md,
  },
  connectedLabel: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Section headers
  sectionTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  sectionDesc: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },

  // Assessment cards
  assessmentCard: {},
  assessmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  assessmentName: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    fontWeight: '600',
  },
  assessmentTime: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
  },
  assessmentDesc: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  completionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.borderLight,
    marginRight: Spacing.xs,
  },
  dotDone: {
    backgroundColor: Colors.primary,
  },
  completionText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
  },

  // Portal
  portalCard: {
    borderColor: Colors.secondary,
    borderWidth: 1.5,
    marginTop: Spacing.lg,
  },
  portalTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    color: Colors.secondary,
    marginBottom: Spacing.xs,
  },
  portalDesc: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  portalCta: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    color: Colors.secondary,
    fontWeight: '600',
  },
  portalLocked: {
    marginTop: Spacing.lg,
    opacity: 0.6,
  },
  portalLockedTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  portalLockedDesc: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    lineHeight: 20,
  },

  // Invite flow
  inviteCard: {
    alignItems: 'center',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  inviteLabel: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  inviteCode: {
    fontSize: 32,
    fontFamily: FontFamilies.heading,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: Spacing.sm,
  },
  inviteHint: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  shareButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  shareButtonText: {
    color: Colors.white,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

  // Create invite
  createInviteCard: {},
  createInviteTitle: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  createInviteDesc: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  nameInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    color: Colors.text,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.white,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.5,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
  },

  // Accept
  acceptCard: {},
  acceptTitle: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  acceptDesc: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  codeInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 24,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryBtn: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

  // Sharing settings
  sharingCard: {
    borderColor: Colors.calm,
    borderWidth: 1,
  },
  sharingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sharingIcon: {
    fontSize: 24,
  },
  sharingTitle: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    fontWeight: '600',
  },
  sharingSubtitle: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sharingArrow: {
    fontSize: 18,
    color: Colors.textMuted,
  },

  // Privacy
  privacyNote: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
  },
  privacyText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
});
