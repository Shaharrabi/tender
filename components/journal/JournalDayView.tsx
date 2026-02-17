/**
 * JournalDayView — Scrollable timeline of a single day's journal entries.
 *
 * Uses the dot + vertical line + card pattern from GrowthTimeline.
 * Each entry card varies by type: check-in, exercise, assessment, chat, XP.
 *
 * Wes Anderson aesthetic: warm surfaces, serif accents, geometric precision.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { JournalEntry, JournalEntryType } from '@/services/journal';
import {
  HeartIcon,
  PenIcon,
  SparkleIcon,
  StarIcon,
  ChatBubbleIcon,
  BookOpenIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';

interface JournalDayViewProps {
  date: string; // YYYY-MM-DD
  entries: JournalEntry[];
  loading?: boolean;
}

// ─── Type Config ────────────────────────────────────────

const TYPE_CONFIG: Record<JournalEntryType, {
  color: string;
  bg: string;
  label: string;
  Icon: React.ComponentType<IconProps>;
}> = {
  checkin: {
    color: Colors.primary,
    bg: Colors.primaryFaded,
    label: 'Check-In',
    Icon: HeartIcon,
  },
  exercise: {
    color: Colors.secondary,
    bg: Colors.secondaryLight,
    label: 'Exercise',
    Icon: PenIcon,
  },
  practice: {
    color: Colors.secondary,
    bg: Colors.secondaryLight,
    label: 'Practice',
    Icon: SparkleIcon,
  },
  assessment: {
    color: Colors.accentGold,
    bg: '#FDF3E0',
    label: 'Assessment',
    Icon: StarIcon,
  },
  chat: {
    color: Colors.calm,
    bg: '#E0F0F0',
    label: 'Chat',
    Icon: ChatBubbleIcon,
  },
  xp: {
    color: Colors.accent,
    bg: '#FDF0E6',
    label: 'XP',
    Icon: StarIcon,
  },
};

// ─── Helpers ────────────────────────────────────────────

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
}

function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  if (dateStr === todayStr) return 'Today';

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  if (dateStr === yesterdayStr) return 'Yesterday';

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Rating Stars ───────────────────────────────────────

function RatingStars({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <View style={cardStyles.starsRow}>
      {Array.from({ length: max }, (_, i) => (
        <StarIcon
          key={i}
          size={14}
          color={i < rating ? Colors.accentGold : Colors.borderLight}
        />
      ))}
    </View>
  );
}

// ─── Mood Bar ───────────────────────────────────────────

function MoodBar({ label, value, max = 10, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.min(value / max, 1);
  return (
    <View style={cardStyles.moodBarContainer}>
      <Text style={cardStyles.moodBarLabel}>{label}</Text>
      <View style={cardStyles.moodBarTrack}>
        <View
          style={[
            cardStyles.moodBarFill,
            { width: `${pct * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={cardStyles.moodBarValue}>{value}/{max}</Text>
    </View>
  );
}

// ─── Entry Cards ────────────────────────────────────────

function CheckInCard({ entry }: { entry: JournalEntry }) {
  const { moodRating, relationshipRating, note } = entry.data;
  return (
    <View style={cardStyles.cardBody}>
      <MoodBar label="Mood" value={moodRating} color={Colors.primary} />
      <MoodBar label="Relationship" value={relationshipRating} color={Colors.secondary} />
      {note ? <Text style={cardStyles.note} numberOfLines={3}>{note}</Text> : null}
    </View>
  );
}

function ExerciseCard({ entry }: { entry: JournalEntry }) {
  const { reflection, rating } = entry.data;
  return (
    <View style={cardStyles.cardBody}>
      {rating != null && <RatingStars rating={rating} />}
      {reflection ? (
        <Text style={cardStyles.note} numberOfLines={3}>
          {reflection}
        </Text>
      ) : null}
    </View>
  );
}

function AssessmentCard({ entry }: { entry: JournalEntry }) {
  return (
    <View style={cardStyles.cardBody}>
      <View style={cardStyles.assessmentBadge}>
        <Text style={cardStyles.assessmentBadgeText}>
          {entry.data.assessmentType?.toUpperCase() || 'ASSESSMENT'}
        </Text>
      </View>
    </View>
  );
}

function ChatCard({ entry }: { entry: JournalEntry }) {
  const { messageCount, firstMessage } = entry.data;
  return (
    <View style={cardStyles.cardBody}>
      <Text style={cardStyles.chatMeta}>
        {messageCount} message{messageCount !== 1 ? 's' : ''}
      </Text>
      {firstMessage ? (
        <Text style={cardStyles.note} numberOfLines={2}>
          "{firstMessage}"
        </Text>
      ) : null}
    </View>
  );
}

function XPCard({ entry }: { entry: JournalEntry }) {
  return (
    <View style={cardStyles.cardBody}>
      <Text style={cardStyles.xpAmount}>{entry.title}</Text>
    </View>
  );
}

// ─── Entry Card Router ──────────────────────────────────

function EntryCardContent({ entry }: { entry: JournalEntry }) {
  switch (entry.type) {
    case 'checkin':
      return <CheckInCard entry={entry} />;
    case 'exercise':
    case 'practice':
      return <ExerciseCard entry={entry} />;
    case 'assessment':
      return <AssessmentCard entry={entry} />;
    case 'chat':
      return <ChatCard entry={entry} />;
    case 'xp':
      return <XPCard entry={entry} />;
    default:
      return null;
  }
}

// ─── Main Component ─────────────────────────────────────

export default function JournalDayView({ date, entries, loading }: JournalDayViewProps) {
  const dateLabel = formatDateDisplay(date);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.dateHeader}>{dateLabel}</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading entries...</Text>
        </View>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.dateHeader}>{dateLabel}</Text>
        <View style={styles.emptyContainer}>
          <BookOpenIcon size={36} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No entries yet</Text>
          <Text style={styles.emptySubtext}>
            Complete a check-in, exercise, or assessment{'\n'}to see it appear here.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.dateHeader}>{dateLabel}</Text>

      {entries.map((entry, index) => {
        const config = TYPE_CONFIG[entry.type];
        const isLast = index === entries.length - 1;

        return (
          <View key={entry.id} style={styles.entryRow}>
            {/* Timeline column */}
            <View style={styles.timelineColumn}>
              <View style={[styles.timelineDot, { backgroundColor: config.color }]} />
              {!isLast && <View style={styles.timelineLine} />}
            </View>

            {/* Entry card */}
            <View style={styles.entryCard}>
              {/* Card header */}
              <View style={styles.entryHeader}>
                <View style={[styles.typeBadge, { backgroundColor: config.bg }]}>
                  <config.Icon size={11} color={config.color} />
                  <Text style={[styles.typeLabel, { color: config.color }]}>
                    {config.label}
                  </Text>
                </View>
                <Text style={styles.timeText}>{formatTime(entry.timestamp)}</Text>
              </View>

              {/* Entry title */}
              <Text style={styles.entryTitle} numberOfLines={2}>
                {entry.title}
              </Text>

              {/* Subtitle / preview */}
              {entry.subtitle && entry.type !== 'xp' ? (
                <Text style={styles.entrySubtitle} numberOfLines={2}>
                  {entry.subtitle}
                </Text>
              ) : null}

              {/* Type-specific content */}
              <EntryCardContent entry={entry} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Main Styles ────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
  },

  dateHeader: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.headingM,
    color: Colors.text,
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },

  // Timeline
  entryRow: {
    flexDirection: 'row',
  },
  timelineColumn: {
    width: 28,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: Spacing.md,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },

  // Entry card
  entryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    gap: Spacing.xs,
    ...Shadows.subtle,
  },

  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  typeIcon: {
  },
  typeLabel: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  timeText: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },

  entryTitle: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
  },
  entrySubtitle: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Loading
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.body,
    color: Colors.textMuted,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyIcon: {
    marginBottom: Spacing.xs,
  },
  emptyTitle: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.headingM,
    color: Colors.text,
  },
  emptySubtext: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

// ─── Card Content Styles ────────────────────────────────

const cardStyles = StyleSheet.create({
  cardBody: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },

  // Mood bars
  moodBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  moodBarLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    width: 80,
  },
  moodBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.progressTrack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  moodBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  moodBarValue: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    width: 30,
    textAlign: 'right',
  },

  // Note
  note: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // Stars
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
  },
  starFilled: {
  },

  // Assessment badge
  assessmentBadge: {
    backgroundColor: '#FDF3E0',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
  },
  assessmentBadgeText: {
    fontFamily: 'Jost_500Medium',
    fontSize: 11,
    color: Colors.accentGold,
    letterSpacing: 0.8,
  },

  // Chat
  chatMeta: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },

  // XP
  xpAmount: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSizes.headingM,
    color: Colors.accent,
  },
});
