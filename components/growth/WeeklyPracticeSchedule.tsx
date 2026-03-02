/**
 * WeeklyPracticeSchedule — Shows the current week's recommended practices
 * based on the user's active step in the Twelve Steps of Relational Healing.
 *
 * Displays a 7-day row with practice assignments, completion status,
 * and quick-launch buttons for each practice.
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { getPracticesForStep, getStep } from '@/utils/steps/twelve-steps';
import CheckmarkIcon from '@/assets/graphics/icons/CheckmarkIcon';
import { getExerciseById } from '@/utils/interventions/registry';
import type { Intervention, FourMovement } from '@/types/intervention';

// ─── Helpers ─────────────────────────────────────────────

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MOVEMENT_COLORS: Record<FourMovement, string> = {
  recognition: Colors.calm,
  release: Colors.secondary,
  resonance: Colors.primary,
  embodiment: Colors.success,
};

const MOVEMENT_LABELS: Record<FourMovement, string> = {
  recognition: 'Recognition',
  release: 'Release',
  resonance: 'Resonance',
  embodiment: 'Embodiment',
};

function getDayOfWeek(): number {
  const day = new Date().getDay();
  // Convert Sunday=0 to Monday=0 based week
  return day === 0 ? 6 : day - 1;
}

function getDayLabel(daysFromNow: number): string {
  if (daysFromNow === 0) return 'Today';
  if (daysFromNow === -1) return 'Yesterday';
  if (daysFromNow === 1) return 'Tomorrow';
  return '';
}

interface DayAssignment {
  dayIndex: number;
  label: string;
  subLabel: string;
  practice: Intervention | null;
  isPast: boolean;
  isToday: boolean;
}

/**
 * Distribute practices across the 7-day week.
 * Puts the most grounding/recognition exercises early,
 * builds toward deeper resonance/embodiment later.
 */
function assignPracticesToWeek(
  practices: Intervention[],
  completedIds: Set<string>
): DayAssignment[] {
  const today = getDayOfWeek();

  // Sort by movement progression: recognition → release → resonance → embodiment
  const movementOrder: FourMovement[] = ['recognition', 'release', 'resonance', 'embodiment'];
  const sorted = [...practices].sort((a, b) => {
    const aIdx = a.fourMovement ? movementOrder.indexOf(a.fourMovement) : 0;
    const bIdx = b.fourMovement ? movementOrder.indexOf(b.fourMovement) : 0;
    return aIdx - bIdx;
  });

  return DAY_LABELS.map((label, i) => {
    // Distribute practices evenly across the week
    const practiceIndex = sorted.length > 0 ? i % sorted.length : -1;
    const practice = practiceIndex >= 0 ? sorted[practiceIndex] : null;

    return {
      dayIndex: i,
      label,
      subLabel: getDayLabel(i - today),
      practice,
      isPast: i < today,
      isToday: i === today,
    };
  });
}

// ─── Props ───────────────────────────────────────────────

interface WeeklyPracticeScheduleProps {
  currentStepNumber: number;
  completedPracticeIds?: string[];
  onSelectPractice: (practiceId: string) => void;
}

// ─── Component ───────────────────────────────────────────

export default function WeeklyPracticeSchedule({
  currentStepNumber,
  completedPracticeIds = [],
  onSelectPractice,
}: WeeklyPracticeScheduleProps) {
  const stepInfo = getStep(currentStepNumber);
  const completedSet = useMemo(
    () => new Set(completedPracticeIds),
    [completedPracticeIds]
  );

  const practices = useMemo(() => {
    const ids = getPracticesForStep(currentStepNumber);
    return ids
      .map((id) => getExerciseById(id))
      .filter((ex): ex is Intervention => ex != null);
  }, [currentStepNumber]);

  const weekAssignments = useMemo(
    () => assignPracticesToWeek(practices, completedSet),
    [practices, completedSet]
  );

  const todayIdx = getDayOfWeek();
  const todayPractice = weekAssignments[todayIdx]?.practice;

  if (practices.length === 0) {
    return null; // No practices for this step yet
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>This Week's Practices</Text>
        <Text style={styles.subtitle}>
          Step {currentStepNumber}
          {stepInfo ? `: ${stepInfo.title}` : ''}
        </Text>
      </View>

      {/* Day row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayRow}
      >
        {weekAssignments.map((day) => {
          const isCompleted = day.practice
            ? completedSet.has(day.practice.id)
            : false;
          const movementColor = day.practice?.fourMovement
            ? MOVEMENT_COLORS[day.practice.fourMovement]
            : Colors.borderLight;

          return (
            <TouchableOpacity
              key={day.dayIndex}
              style={[
                styles.dayCell,
                day.isToday && styles.dayCellToday,
                day.isPast && !isCompleted && styles.dayCellPastMissed,
              ]}
              onPress={() => day.practice && onSelectPractice(day.practice.id)}
              activeOpacity={day.practice ? 0.7 : 1}
              disabled={!day.practice}
              accessibilityRole="button"
              accessibilityLabel={`${day.subLabel || day.label}${day.practice ? `, ${day.practice.title}` : ', no practice'}${isCompleted ? ', completed' : ''}`}
              accessibilityState={{ disabled: !day.practice }}
            >
              <Text
                style={[
                  styles.dayLabel,
                  day.isToday && styles.dayLabelToday,
                ]}
              >
                {day.subLabel || day.label}
              </Text>

              <View
                style={[
                  styles.dayDot,
                  { borderColor: movementColor },
                  isCompleted && {
                    backgroundColor: movementColor,
                    borderColor: movementColor,
                  },
                  day.isToday &&
                    !isCompleted && {
                      borderColor: Colors.primary,
                      borderWidth: 2.5,
                    },
                ]}
              >
                {isCompleted && (
                  <CheckmarkIcon size={11} color={Colors.white} />
                )}
              </View>

              {day.practice && (
                <Text
                  style={styles.dayPracticeHint}
                  numberOfLines={2}
                >
                  {day.practice.title}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Today's Featured Practice */}
      {todayPractice && (
        <TouchableOpacity
          style={styles.todayCard}
          onPress={() => onSelectPractice(todayPractice.id)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Today's practice: ${todayPractice.title}, ${todayPractice.duration} minutes`}
        >
          <View style={styles.todayCardHeader}>
            {todayPractice.fourMovement && (
              <View
                style={[
                  styles.movementBadge,
                  {
                    backgroundColor: `${MOVEMENT_COLORS[todayPractice.fourMovement]}20`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.movementBadgeText,
                    { color: MOVEMENT_COLORS[todayPractice.fourMovement] },
                  ]}
                >
                  {MOVEMENT_LABELS[todayPractice.fourMovement]}
                </Text>
              </View>
            )}
            <Text style={styles.todayDuration}>
              {todayPractice.duration} min
            </Text>
          </View>

          <Text style={styles.todayTitle}>{todayPractice.title}</Text>
          <Text style={styles.todayDescription} numberOfLines={2}>
            {todayPractice.description}
          </Text>

          <View style={styles.todayAction}>
            <Text style={styles.todayActionText}>
              {completedSet.has(todayPractice.id)
                ? 'Practice Again'
                : 'Start Practice'}
            </Text>
            <Text style={styles.todayActionArrow}>{'\u203A'}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Practice List (all step practices) */}
      {practices.length > 1 && (
        <View style={styles.allPracticesSection}>
          <Text style={styles.allPracticesLabel}>
            ALL STEP {currentStepNumber} PRACTICES
          </Text>
          {practices.map((practice) => {
            const done = completedSet.has(practice.id);
            return (
              <TouchableOpacity
                key={practice.id}
                style={styles.practiceRow}
                onPress={() => onSelectPractice(practice.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${practice.title}, ${practice.duration} minutes${done ? ', completed' : ''}`}
              >
                <View
                  style={[
                    styles.practiceRowDot,
                    done && styles.practiceRowDotDone,
                    practice.fourMovement && {
                      borderColor: MOVEMENT_COLORS[practice.fourMovement],
                    },
                    done &&
                      practice.fourMovement && {
                        backgroundColor: MOVEMENT_COLORS[practice.fourMovement],
                      },
                  ]}
                >
                  {done && (
                    <CheckmarkIcon size={11} color={Colors.white} />
                  )}
                </View>
                <View style={styles.practiceRowInfo}>
                  <Text
                    style={[
                      styles.practiceRowTitle,
                      done && styles.practiceRowTitleDone,
                    ]}
                  >
                    {practice.title}
                  </Text>
                  <Text style={styles.practiceRowMeta}>
                    {practice.duration} min
                    {practice.mode !== 'solo'
                      ? ` \u00B7 ${practice.mode}`
                      : ''}
                  </Text>
                </View>
                <Text style={styles.practiceRowArrow}>{'\u203A'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },

  // Header
  header: {
    gap: 2,
  },
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },

  // Day row
  dayRow: {
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  dayCell: {
    width: 72,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  dayCellToday: {
    backgroundColor: `${Colors.primary}10`,
  },
  dayCellPastMissed: {
    opacity: 0.5,
  },
  dayLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  dayLabelToday: {
    color: Colors.primary,
    fontWeight: '700',
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  dayDotCheck: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '700',
  },
  dayPracticeHint: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 12,
  },

  // Today card
  todayCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    ...Shadows.card,
  },
  todayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movementBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  movementBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  todayDuration: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  todayTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  todayDescription: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  todayAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  todayActionText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  todayActionArrow: {
    fontSize: FontSizes.headingM,
    color: Colors.primary,
    fontWeight: '600',
  },

  // All practices list
  allPracticesSection: {
    gap: Spacing.sm,
  },
  allPracticesLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: Spacing.xs,
  },
  practiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  practiceRowDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceRowDotDone: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  practiceRowCheck: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '700',
  },
  practiceRowInfo: {
    flex: 1,
    gap: 2,
  },
  practiceRowTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  practiceRowTitleDone: {
    color: Colors.textSecondary,
  },
  practiceRowMeta: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  practiceRowArrow: {
    fontSize: FontSizes.headingM,
    color: Colors.textMuted,
  },
});
