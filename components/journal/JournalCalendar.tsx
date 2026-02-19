/**
 * JournalCalendar — Monthly calendar with activity-type colored dots.
 *
 * Navigation: left/right arrows to change months.
 * Each day shows small colored dots indicating which types of
 * activities happened (check-in, exercise, assessment, chat).
 *
 * Wes Anderson palette: warm parchment surface, dusty rose selection.
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { JournalEntryType, CalendarDayData } from '@/services/journal';

interface JournalCalendarProps {
  year: number;
  month: number; // 1-12
  selectedDate: string; // YYYY-MM-DD
  calendarData: Map<string, CalendarDayData>;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

// ─── Color mapping for activity types ───────────────────

const TYPE_COLORS: Record<JournalEntryType, string> = {
  checkin: Colors.primary,          // Dusty Rose
  exercise: Colors.secondary,       // Lobby Blue
  practice: Colors.secondary,       // Lobby Blue (same as exercise)
  assessment: Colors.accentGold,    // Concierge Gold
  chat: Colors.calm,                // Soft Teal
  xp: Colors.accent,               // Terracotta
  minigame: Colors.accentGold,     // Concierge Gold
};

// Ordered for consistent dot layout
const DOT_ORDER: JournalEntryType[] = ['checkin', 'exercise', 'assessment', 'chat'];

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ─── Helpers ────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// ─── Component ──────────────────────────────────────────

export default function JournalCalendar({
  year,
  month,
  selectedDate,
  calendarData,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: JournalCalendarProps) {
  const today = todayString();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  // Build weeks array for the grid
  const weeks = useMemo(() => {
    const cells: (number | null)[] = [];

    // Leading blanks
    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    // Day numbers
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }

    // Pad to complete final week
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    // Chunk into weeks
    const result: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  }, [year, month, firstDay, daysInMonth]);

  // Can't navigate past current month
  const isCurrentMonth = year === new Date().getFullYear() && month === new Date().getMonth() + 1;

  return (
    <View style={styles.container}>
      {/* Month header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onPrevMonth}
          style={styles.navButton}
          activeOpacity={0.6}
        >
          <Text style={styles.navArrow}>{'\u2039'}</Text>
        </TouchableOpacity>

        <Text style={styles.monthTitle}>
          {MONTH_NAMES[month - 1]} {year}
        </Text>

        <TouchableOpacity
          onPress={isCurrentMonth ? undefined : onNextMonth}
          style={[styles.navButton, isCurrentMonth && styles.navButtonDisabled]}
          activeOpacity={isCurrentMonth ? 1 : 0.6}
        >
          <Text style={[styles.navArrow, isCurrentMonth && styles.navArrowDisabled]}>
            {'\u203A'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weekday labels */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day, i) => (
          <View key={i} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((day, di) => {
            if (day === null) {
              return <View key={di} style={styles.dayCell} />;
            }

            const dateStr = `${year}-${pad2(month)}-${pad2(day)}`;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === today;
            const dayData = calendarData.get(dateStr);
            const hasActivity = dayData && dayData.types.size > 0;

            // Determine which dots to show
            const dots = hasActivity
              ? DOT_ORDER.filter((type) => {
                  if (type === 'exercise') {
                    return dayData!.types.has('exercise') || dayData!.types.has('practice');
                  }
                  return dayData!.types.has(type);
                })
              : [];

            return (
              <TouchableOpacity
                key={di}
                style={[
                  styles.dayCell,
                  isSelected && styles.dayCellSelected,
                  isToday && !isSelected && styles.dayCellToday,
                ]}
                onPress={() => onSelectDate(dateStr)}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                    isToday && !isSelected && styles.dayTextToday,
                  ]}
                >
                  {day}
                </Text>

                {/* Activity dots */}
                {dots.length > 0 && (
                  <View style={styles.dotsRow}>
                    {dots.slice(0, 3).map((type, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.dot,
                          { backgroundColor: isSelected ? Colors.white : TYPE_COLORS[type] },
                        ]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Check-in</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.secondary }]} />
          <Text style={styles.legendText}>Exercise</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.accentGold }]} />
          <Text style={styles.legendText}>Assessment</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.calm }]} />
          <Text style={styles.legendText}>Chat</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  monthTitle: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.headingM,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  navButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navArrow: {
    fontSize: 28,
    color: Colors.text,
    lineHeight: 32,
  },
  navArrowDisabled: {
    color: Colors.textMuted,
  },

  // Weekdays
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  weekdayText: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Days
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
  },
  dayCellSelected: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  dayText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.body,
    color: Colors.text,
  },
  dayTextSelected: {
    color: Colors.white,
    fontFamily: 'JosefinSans_500Medium',
  },
  dayTextToday: {
    color: Colors.primary,
    fontFamily: 'JosefinSans_500Medium',
  },

  // Activity dots
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
    height: 5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.3,
  },
});
