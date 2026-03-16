/**
 * Daily Question Screen
 *
 * Flow:
 * 1. Show today's question (same for both partners)
 * 2. User types their answer
 * 3. User submits
 * 4. If partner hasn't answered: warm waiting state
 * 5. If partner HAS answered: reveal both responses side by side
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
  Typography,
} from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { getMyCouple, getPartnerProfile } from '@/services/couples';
import {
  getTodaysQuestion,
  submitDailyResponse,
  getMyResponseToday,
  getPartnerResponse,
  type DailyQuestion,
  type DailyQuestionResponse,
} from '@/services/daily-questions';
import TenderButton from '@/components/ui/TenderButton';
import { SoundHaptics } from '@/services/SoundHapticsService';

const CATEGORY_REASONS: Record<string, string> = {
  attunement: 'your field is asking for more attunement right now.',
  co_creation: 'co-creation is where your growth edge lives.',
  transmission: 'the gap between knowing and doing wants attention.',
  space: 'healthy boundaries are part of your journey right now.',
  resistance: 'softening is the invitation this week.',
  general: 'this felt right for where you are today.',
};

export default function DailyQuestionScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [myResponse, setMyResponse] = useState<DailyQuestionResponse | null>(null);
  const [partnerResponse, setPartnerResponse] = useState<DailyQuestionResponse | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [partnerName, setPartnerName] = useState('your partner');
  const [coupleId, setCoupleId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const couple = await getMyCouple(user.id);
      if (!couple) {
        setLoading(false);
        return;
      }
      setCoupleId(couple.id);

      const partner = await getPartnerProfile(user.id);
      if (partner?.display_name) setPartnerName(partner.display_name);

      const q = await getTodaysQuestion(couple.id);
      setQuestion(q);

      if (q) {
        const existing = await getMyResponseToday(couple.id, q.id, user.id);
        setMyResponse(existing);

        if (existing) {
          const { data: partnerResp } = await getPartnerResponse(couple.id, q.id, user.id);
          setPartnerResponse(partnerResp);
        }
      }
    } catch (err) {
      console.warn('[DailyQuestion] load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !coupleId || !question || !answerText.trim()) return;

    setSubmitting(true);
    try {
      const response = await submitDailyResponse(coupleId, question.id, user.id, answerText.trim());
      if (response) {
        setMyResponse(response);
        SoundHaptics.success();

        // Check if partner already answered
        const { data: partnerResp } = await getPartnerResponse(coupleId, question.id, user.id);
        setPartnerResponse(partnerResp);
      }
    } catch (err) {
      console.warn('[DailyQuestion] submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  if (!question) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No question for today. Check back tomorrow.</Text>
          <TenderButton title="Go Home" onPress={() => router.back()} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>{'\u2190'} Home</Text>
          </TouchableOpacity>

          {/* Question */}
          <View style={styles.questionCard}>
            <Text style={styles.eyebrow}>TODAY'S QUESTION</Text>
            <Text style={styles.questionText}>{question.questionText}</Text>
            <Text style={styles.reason}>
              This question was chosen because {CATEGORY_REASONS[question.category] || CATEGORY_REASONS.general}
            </Text>
          </View>

          {/* Answer Input (if not yet answered) */}
          {!myResponse && (
            <View style={styles.answerSection}>
              <TextInput
                style={styles.input}
                value={answerText}
                onChangeText={setAnswerText}
                placeholder="Your answer..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TenderButton
                title={submitting ? 'Saving...' : 'Share your answer'}
                onPress={handleSubmit}
                disabled={!answerText.trim() || submitting}
              />
            </View>
          )}

          {/* My response (after submitting) */}
          {myResponse && (
            <View style={styles.responseSection}>
              <View style={styles.responseCard}>
                <Text style={styles.responseLabel}>You</Text>
                <Text style={styles.responseText}>{myResponse.responseText}</Text>
              </View>

              {/* Partner's response OR waiting state */}
              {partnerResponse ? (
                <View style={[styles.responseCard, styles.partnerCard]}>
                  <Text style={styles.responseLabel}>{partnerName}</Text>
                  <Text style={styles.responseText}>{partnerResponse.responseText}</Text>
                </View>
              ) : (
                <View style={styles.waitingCard}>
                  <View style={styles.waitingAvatar}>
                    <Text style={styles.waitingInitial}>
                      {partnerName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.waitingText}>
                    Your answer is saved. When {partnerName} answers, you'll both see each other's response.
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  questionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  eyebrow: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  questionText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: FontSizes.headingM,
    color: Colors.text,
    lineHeight: 30,
    marginBottom: Spacing.md,
  },
  reason: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  answerSection: {
    gap: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 120,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  responseSection: {
    gap: Spacing.md,
  },
  responseCard: {
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  partnerCard: {
    backgroundColor: Colors.secondaryLight,
  },
  responseLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  responseText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
  waitingCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
  },
  waitingAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  waitingInitial: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.textOnPrimary,
  },
  waitingText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  emptyText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
