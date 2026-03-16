/**
 * DailyRhythmSection — Collapsible daily tools hub on the home screen.
 *
 * Bundles all daily touchpoints into one organized section:
 *   1. Check-In Card (mood + connection sliders)
 *   2. Window of Tolerance (nervous system awareness)
 *   3. Journal Prompt (step-specific reflection)
 *   4. Check-in Rhythm dots (7-day consistency)
 *
 * Collapsed state: Summary row with check status + rhythm count.
 * Expanded state: All four tools stacked vertically.
 *
 * Default: Expanded if user hasn't checked in today, collapsed if they have.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import { CheckmarkIcon, PenIcon, ChevronUpIcon, ChevronDownIcon } from '@/assets/graphics/icons';
import CheckInCard from '@/components/growth/CheckInCard';
import WindowOfTolerance from '@/components/growth/WindowOfTolerance';
import CheckInRhythm from '@/components/home/CheckInRhythm';
import { SoundHaptics } from '@/services/SoundHapticsService';
import type { DailyCheckIn } from '@/types/growth';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Component ──────────────────────────────────────────

interface DailyRhythmSectionProps {
  todaysCheckIn: DailyCheckIn | null;
  onCheckInSubmit: (
    mood: number,
    relationship: number,
    practiced: boolean,
    note?: string,
  ) => Promise<void>;
  hasPortrait: boolean;
  currentStepNum: number;
  isSolo: boolean;
  /** Boolean array, length 7. Index 0 = 6 days ago, index 6 = today. */
  weekDots: boolean[];
  /** Step-specific journal prompt text */
  journalPrompt: string;
  /** Daily question — inline micro-moment for couples */
  dailyQuestion?: { questionText: string } | null;
  hasAnsweredDaily?: boolean;
  partnerAnsweredDaily?: boolean;
  partnerName?: string;
  myResponseText?: string;
  partnerResponseText?: string;
  onSubmitDailyAnswer?: (text: string) => Promise<void>;
}

export default function DailyRhythmSection({
  todaysCheckIn,
  onCheckInSubmit,
  hasPortrait,
  currentStepNum,
  isSolo,
  weekDots,
  journalPrompt,
  dailyQuestion,
  hasAnsweredDaily = false,
  partnerAnsweredDaily = false,
  partnerName = 'your partner',
  myResponseText,
  partnerResponseText,
  onSubmitDailyAnswer,
}: DailyRhythmSectionProps) {
  const router = useRouter();
  // Always start collapsed — user opens when ready
  const [isExpanded, setIsExpanded] = useState(false);
  const [dailyAnswerText, setDailyAnswerText] = useState('');
  const [dailySubmitting, setDailySubmitting] = useState(false);

  const rhythmCount = weekDots.filter(Boolean).length;

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  }, []);

  const handleDailySubmit = useCallback(async () => {
    if (!dailyAnswerText.trim() || !onSubmitDailyAnswer) return;
    setDailySubmitting(true);
    try {
      await onSubmitDailyAnswer(dailyAnswerText.trim());
      setDailyAnswerText('');
      SoundHaptics.success();
    } catch (err) {
      console.warn('[DailyRhythm] daily answer submit error:', err);
    } finally {
      setDailySubmitting(false);
    }
  }, [dailyAnswerText, onSubmitDailyAnswer]);

  const handlePracticeFromWoT = useCallback((practiceId: string) => {
    SoundHaptics.tapSoft();
    router.push({ pathname: '/(app)/exercise', params: { id: practiceId } } as any);
  }, [router]);

  // ── Collapsed summary ──────────────────────────────────
  if (!isExpanded) {
    return (
      <TouchableOpacity
        style={styles.collapsedContainer}
        onPress={toggleExpanded}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: false }}
        accessibilityLabel="Your Daily Rhythm, collapsed. Tap to expand."
      >
        <View style={styles.collapsedLeft}>
          <Text style={styles.sectionLabel}>YOUR DAILY RHYTHM</Text>
          <View style={styles.collapsedSummary}>
            {todaysCheckIn ? (
              <>
                <View style={styles.checkCircleMini}>
                  <CheckmarkIcon size={10} color={Colors.textOnPrimary} />
                </View>
                <Text style={styles.collapsedText}>
                  Checked in today {'\u00B7'} {rhythmCount} of 7 days
                </Text>
              </>
            ) : (
              <Text style={styles.collapsedTextInvite}>
                How are you today?
              </Text>
            )}
          </View>
        </View>
        <View style={styles.expandHint}>
          <Text style={styles.expandHintText}>Open</Text>
          <ChevronDownIcon size={14} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    );
  }

  // ── Expanded state ─────────────────────────────────────
  return (
    <View style={styles.expandedContainer}>
      {/* Section header — tap to collapse */}
      <TouchableOpacity
        style={styles.expandedHeader}
        onPress={toggleExpanded}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: true }}
        accessibilityLabel="Your Daily Rhythm, expanded. Tap to collapse."
      >
        <Text style={styles.sectionLabel}>YOUR DAILY RHYTHM</Text>
        <ChevronUpIcon size={18} color={Colors.primary} />
      </TouchableOpacity>

      {/* 1. Check-In Card */}
      <View style={styles.toolSection}>
        <CheckInCard
          todaysCheckIn={todaysCheckIn}
          onSubmit={onCheckInSubmit}
        />
      </View>

      {/* 2. Window of Tolerance — only when portrait exists */}
      {hasPortrait && (
        <View style={styles.toolSection}>
          <WindowOfTolerance onSelectPractice={handlePracticeFromWoT} />
        </View>
      )}

      {/* 3. Journal Prompt — only when portrait exists */}
      {hasPortrait && (
        <View style={styles.toolSection}>
          <TouchableOpacity
            style={styles.journalCard}
            onPress={() => {
              SoundHaptics.tapSoft();
              router.push('/(app)/journal' as any);
            }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open journal"
          >
            <View style={styles.journalHeader}>
              <PenIcon size={16} color={Colors.primary} />
              <Text style={styles.journalEyebrow}>JOURNAL</Text>
            </View>
            <Text style={styles.journalText}>
              {journalPrompt}
            </Text>
            <Text style={styles.journalCta}>
              Open Journal {'\u2192'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. Daily Question — inline micro-moment */}
      {dailyQuestion && (
        <View style={styles.toolSection}>
          <View style={styles.dailyQuestionCard}>
            <Text style={styles.dailyQuestionEyebrow}>TODAY'S QUESTION</Text>
            <Text style={styles.dailyQuestionText}>
              {dailyQuestion.questionText}
            </Text>

            {/* Not yet answered — show input */}
            {!hasAnsweredDaily && (
              <View style={styles.dailyAnswerSection}>
                <TextInput
                  style={styles.dailyInput}
                  value={dailyAnswerText}
                  onChangeText={setDailyAnswerText}
                  placeholder="Your answer..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[
                    styles.dailySubmitButton,
                    (!dailyAnswerText.trim() || dailySubmitting) && styles.dailySubmitDisabled,
                  ]}
                  onPress={handleDailySubmit}
                  disabled={!dailyAnswerText.trim() || dailySubmitting}
                  activeOpacity={0.7}
                >
                  {dailySubmitting ? (
                    <ActivityIndicator size="small" color={Colors.textOnPrimary} />
                  ) : (
                    <Text style={styles.dailySubmitText}>Share</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Answered — show my response */}
            {hasAnsweredDaily && myResponseText && (
              <View style={styles.dailyResponseSection}>
                <View style={styles.dailyResponseCard}>
                  <Text style={styles.dailyResponseLabel}>You</Text>
                  <Text style={styles.dailyResponseText}>{myResponseText}</Text>
                </View>

                {/* Both answered — show partner too */}
                {partnerAnsweredDaily && partnerResponseText ? (
                  <View style={[styles.dailyResponseCard, styles.dailyPartnerCard]}>
                    <Text style={styles.dailyResponseLabel}>{partnerName}</Text>
                    <Text style={styles.dailyResponseText}>{partnerResponseText}</Text>
                  </View>
                ) : (
                  <View style={styles.dailyWaitingRow}>
                    <View style={styles.dailyWaitingDot} />
                    <Text style={styles.dailyWaitingText}>
                      Waiting for {partnerName} to answer...
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      )}

      {/* 5. Check-in Rhythm */}
      <CheckInRhythm weekDots={weekDots} />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  // Collapsed state
  collapsedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.subtle,
  },
  collapsedLeft: {
    flex: 1,
    gap: 4,
  },
  collapsedSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  checkCircleMini: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapsedText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  collapsedTextInvite: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  expandHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '12',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
  },
  expandHintText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.3,
  },

  // Expanded state
  expandedContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Shared
  sectionLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.primary,
    letterSpacing: 1,
  },

  // Tool sections
  toolSection: {
    // just a wrapper for consistent spacing via gap
  },

  // Journal card (matches home.tsx style)
  journalCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  journalEyebrow: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  journalText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  journalCta: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },

  // Daily Question inline
  dailyQuestionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.calm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dailyQuestionEyebrow: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.micro,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  dailyQuestionText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
  dailyAnswerSection: {
    gap: Spacing.sm,
  },
  dailyInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    minHeight: 80,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dailySubmitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
  dailySubmitDisabled: {
    opacity: 0.4,
  },
  dailySubmitText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
  dailyResponseSection: {
    gap: Spacing.sm,
  },
  dailyResponseCard: {
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  dailyPartnerCard: {
    backgroundColor: Colors.secondaryLight,
  },
  dailyResponseLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.micro,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dailyResponseText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  dailyWaitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingTop: 2,
  },
  dailyWaitingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  dailyWaitingText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
