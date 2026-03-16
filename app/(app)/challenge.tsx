/**
 * Challenge Screen — Weekly couple challenge detail + completion.
 *
 * Shows the challenge theme, each partner's task, and completion status.
 * Partners can mark their task complete and add a reflection.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { getMyCouple, getPartnerProfile } from '@/services/couples';
import {
  getThisWeeksChallenge,
  generateWeeklyChallenge,
  completeChallenge,
  getChallengeHistory,
  type CoupleChallenge,
} from '@/services/couple-challenges';
import TenderButton from '@/components/ui/TenderButton';
import { SoundHaptics } from '@/services/SoundHapticsService';

export default function ChallengeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<CoupleChallenge | null>(null);
  const [pastChallenges, setPastChallenges] = useState<CoupleChallenge[]>([]);
  const [isPartner1, setIsPartner1] = useState(true);
  const [partnerName, setPartnerName] = useState('your partner');
  const [reflection, setReflection] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const couple = await getMyCouple(user.id);
      if (!couple) { setLoading(false); return; }

      setIsPartner1(couple.partner_a_id === user.id);

      const partner = await getPartnerProfile(user.id);
      if (partner?.display_name) setPartnerName(partner.display_name);

      // Get or generate this week's challenge
      let thisWeek = await getThisWeeksChallenge(couple.id);
      if (!thisWeek) {
        const partnerId = couple.partner_a_id === user.id
          ? couple.partner_b_id
          : couple.partner_a_id;
        thisWeek = await generateWeeklyChallenge(couple.id, couple.partner_a_id, partnerId);
      }
      setChallenge(thisWeek);

      const history = await getChallengeHistory(couple.id, 5);
      // Exclude current week from history
      setPastChallenges(history.filter(c => c.id !== thisWeek?.id));
    } catch (err) {
      console.warn('[Challenge] load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!challenge) return;
    setSubmitting(true);
    try {
      await completeChallenge(
        challenge.id,
        isPartner1 ? 1 : 2,
        reflection.trim() || undefined,
      );
      SoundHaptics.success();
      await loadData(); // Refresh
    } catch (err) {
      console.warn('[Challenge] complete error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const myCompleted = challenge
    ? (isPartner1 ? challenge.partner1Completed : challenge.partner2Completed)
    : false;
  const partnerCompleted = challenge
    ? (isPartner1 ? challenge.partner2Completed : challenge.partner1Completed)
    : false;
  const myTask = challenge
    ? (isPartner1 ? challenge.partner1Task : challenge.partner2Task)
    : '';
  const partnerReflection = challenge
    ? (isPartner1 ? challenge.partner2Reflection : challenge.partner1Reflection)
    : null;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'\u2190'} Home</Text>
        </TouchableOpacity>

        {challenge ? (
          <>
            <Text style={styles.eyebrow}>THIS WEEK'S CHALLENGE</Text>
            <Text style={styles.theme}>{challenge.challengeText}</Text>

            {/* My Task */}
            <View style={styles.taskCard}>
              <Text style={styles.taskLabel}>YOUR TASK</Text>
              <Text style={styles.taskText}>{myTask}</Text>

              {myCompleted ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              ) : (
                <View style={styles.completeSection}>
                  <TextInput
                    style={styles.input}
                    value={reflection}
                    onChangeText={setReflection}
                    placeholder="How did it go? (optional)"
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                  <TenderButton
                    title={submitting ? 'Saving...' : 'Mark as complete'}
                    onPress={handleComplete}
                    disabled={submitting}
                  />
                </View>
              )}
            </View>

            {/* Partner Status */}
            <View style={[styles.taskCard, styles.partnerCard]}>
              <Text style={styles.taskLabel}>{partnerName.toUpperCase()}'S STATUS</Text>
              {partnerCompleted ? (
                <>
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                  {partnerReflection && (
                    <Text style={styles.reflectionText}>"{partnerReflection}"</Text>
                  )}
                </>
              ) : (
                <Text style={styles.waitingText}>Hasn't completed yet</Text>
              )}
            </View>

            {/* Based On */}
            {challenge.basedOn && Object.keys(challenge.basedOn).length > 0 && (
              <Text style={styles.basedOnText}>
                This challenge was personalized based on your {
                  challenge.basedOn.bottleneck ? `${challenge.basedOn.bottleneck} bottleneck` :
                  challenge.basedOn.attachment_pairing ? `${challenge.basedOn.attachment_pairing} dynamic` :
                  challenge.basedOn.conflict_pairing ? `${challenge.basedOn.conflict_pairing} conflict style` :
                  challenge.basedOn.shared_strength ? 'shared strengths' :
                  'assessment data'
                }.
              </Text>
            )}

            {/* Past Challenges */}
            {pastChallenges.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.historyTitle}>PAST CHALLENGES</Text>
                {pastChallenges.map(past => (
                  <View key={past.id} style={styles.historyCard}>
                    <Text style={styles.historyWeek}>Week of {past.weekOf}</Text>
                    <Text style={styles.historyTheme}>{past.challengeText}</Text>
                    <View style={styles.historyDots}>
                      <View style={[styles.historyDot, past.partner1Completed && styles.historyDotFilled]} />
                      <View style={[styles.historyDot, past.partner2Completed && styles.historyDotFilled]} />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Link with a partner and complete assessments to unlock couple challenges.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  backButton: {
    marginBottom: Spacing.lg,
  },
  backText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  eyebrow: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  theme: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: FontSizes.headingM,
    color: Colors.text,
    lineHeight: 28,
    marginBottom: Spacing.lg,
  },
  taskCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  partnerCard: {
    backgroundColor: Colors.backgroundAlt,
  },
  taskLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.micro,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  taskText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  completeSection: {
    gap: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    minHeight: 80,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  completedBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
  },
  completedText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.xs,
    color: Colors.successDarkText,
  },
  waitingText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  reflectionText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  basedOnText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
  historySection: {
    marginTop: Spacing.xl,
  },
  historyTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  historyCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  historyWeek: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  historyTheme: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  historyDots: {
    flexDirection: 'row',
    gap: 4,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyDotFilled: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xxxl,
  },
  emptyText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
