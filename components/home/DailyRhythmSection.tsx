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
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
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
}

export default function DailyRhythmSection({
  todaysCheckIn,
  onCheckInSubmit,
  hasPortrait,
  currentStepNum,
  isSolo,
  weekDots,
  journalPrompt,
}: DailyRhythmSectionProps) {
  const router = useRouter();
  // Always start collapsed — user opens when ready
  const [isExpanded, setIsExpanded] = useState(false);

  const rhythmCount = weekDots.filter(Boolean).length;

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  }, []);

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
        <ChevronDownIcon size={18} color={Colors.primary} />
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

      {/* 4. Check-in Rhythm */}
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
});
