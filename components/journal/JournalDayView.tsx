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
  const { moodRating, relationshipRating, note, practicedGrowthEdge } = entry.data;
  return (
    <View style={cardStyles.cardBody}>
      <MoodBar label="Inner State" value={moodRating} color={Colors.primary} />
      <MoodBar label="Connection" value={relationshipRating} color={Colors.secondary} />
      {practicedGrowthEdge != null && (
        <View style={cardStyles.inlineRow}>
          <Text style={cardStyles.inlineLabel}>Practiced growth edge:</Text>
          <Text style={[cardStyles.inlineValue, { color: practicedGrowthEdge ? Colors.success : Colors.textMuted }]}>
            {practicedGrowthEdge ? 'Yes' : 'No'}
          </Text>
        </View>
      )}
      {note ? <Text style={cardStyles.noteFullText}>{note}</Text> : null}
    </View>
  );
}

/**
 * Format a step response for display. Lesson components store structured
 * data as JSON.stringify(). We parse it and render a human-readable summary
 * instead of raw JSON text.
 */
function formatStepResponse(response: string): string {
  // If it's not JSON, return as-is (plain text responses)
  let parsed: any;
  try {
    parsed = JSON.parse(response);
  } catch {
    return response;
  }

  // Not an object — just return the string representation
  if (typeof parsed !== 'object' || parsed === null) {
    return String(parsed);
  }

  const parts: string[] = [];

  // ─── MC1 L2: Body sensations (somatic heatmap) ───
  if (parsed.regions && Array.isArray(parsed.regions)) {
    const names = parsed.regions.map((r: any) => r.label || r.region).filter(Boolean);
    if (names.length > 0) parts.push(`Sensations: ${names.join(', ')}`);
  }

  // ─── MC1 L3: Cycle awareness ───
  if (parsed.cycleViewed != null) {
    parts.push(`Cycle explored: ${parsed.variant || 'default'} pattern`);
  }

  // ─── MC1 L4: Timer practice ───
  if (parsed.timerCompleted != null) {
    const mins = parsed.durationSeconds ? Math.round(parsed.durationSeconds / 60) : null;
    parts.push(
      parsed.timerCompleted
        ? `Practice completed${mins ? ` (${mins} min)` : ''}`
        : 'Practice started'
    );
  }

  // ─── MC1 L5: Commitment contract ───
  if (parsed.signed != null && parsed.commitmentCount != null) {
    parts.push(`Signed commitment: ${parsed.commitmentCount}x per week`);
  }

  // ─── MC2 L5: Co-regulation ───
  if (parsed.mode && response.includes('co-regulation')) {
    // Plain text responses are already handled above; this is a fallback
  }

  // ─── MC3 L1: Myth Buster ───
  if (parsed.mythsBusted != null) {
    parts.push(
      parsed.allFlipped
        ? `All ${parsed.mythsBusted} myths busted!`
        : `${parsed.mythsBusted} myths explored`
    );
  }

  // ─── MC3 L1: Content vs. Pattern reflection ───
  if (parsed.content != null && parsed.pattern != null) {
    if (parsed.content) parts.push(`Content: ${parsed.content}`);
    if (parsed.pattern) parts.push(`Pattern: ${parsed.pattern}`);
  }

  // ─── MC3 L2: Horseman Matcher ───
  if (parsed.allMatchedCorrectly != null) {
    parts.push(
      parsed.noMistakes
        ? 'All horsemen matched correctly — no mistakes!'
        : `All horsemen matched (${parsed.totalMistakes || 0} retries)`
    );
  }

  // ─── MC3 L2: Horseman identification ───
  if (parsed.myHorseman != null && parsed.partnerHorseman != null) {
    const fmt = (s: string) => s.replace(/([A-Z])/g, ' $1').trim();
    parts.push(`My horseman: ${fmt(parsed.myHorseman)}`);
    parts.push(`Partner's horseman: ${fmt(parsed.partnerHorseman)}`);
  }

  // ─── MC3 L3: Repair Scenario ───
  if (parsed.endingType != null) {
    const ending = parsed.endingType === 'repaired'
      ? 'Repair achieved'
      : parsed.endingType === 'partial'
        ? 'Partial repair'
        : 'Unrepaired ending';
    parts.push(`${ending} (${parsed.repairAttemptsMade || 0} repair attempts)`);
  }

  // ─── MC3 L4: Repair Sentence Builder ───
  if (parsed.templates && Array.isArray(parsed.templates)) {
    const completedCount = parsed.templates.filter((t: any) => t.completed).length;
    parts.push(`Completed ${completedCount}/${parsed.templates.length} repair sentences`);
  }

  // ─── MC3 L5: Ritual Designer ───
  if (parsed.ritual && typeof parsed.ritual === 'object') {
    const ritualLabels: string[] = [];
    if (parsed.ritual.timing) ritualLabels.push(`When: ${parsed.ritual.timing.replace(/_/g, ' ')}`);
    if (parsed.ritual.location) ritualLabels.push(`Where: ${parsed.ritual.location}`);
    if (parsed.ritual.opening) ritualLabels.push(`Opening: ${parsed.ritual.opening.replace(/_/g, ' ')}`);
    if (parsed.ritual.gesture) ritualLabels.push(`Gesture: ${parsed.ritual.gesture.replace(/_/g, ' ')}`);
    if (ritualLabels.length > 0) parts.push(ritualLabels.join('\n'));
    if (parsed.commitment) parts.push(`Commitment: ${parsed.commitment}`);
  }

  // If we matched nothing, format key-value pairs generically
  if (parts.length === 0) {
    for (const [key, value] of Object.entries(parsed)) {
      if (value == null || value === '' || value === false) continue;
      const label = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
      const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);
      if (typeof value === 'object') {
        parts.push(`${displayLabel}: ${JSON.stringify(value)}`);
      } else {
        parts.push(`${displayLabel}: ${value}`);
      }
    }
  }

  return parts.join('\n') || response;
}

function ExerciseCard({ entry }: { entry: JournalEntry }) {
  const { reflection, rating, stepResponses } = entry.data;
  return (
    <View style={cardStyles.cardBody}>
      {rating != null && <RatingStars rating={rating} />}

      {/* Full step-by-step responses from the practice */}
      {stepResponses && Array.isArray(stepResponses) && stepResponses.length > 0 && (
        <View style={cardStyles.stepResponsesContainer}>
          {stepResponses.map((sr: any, idx: number) => (
            <View key={idx} style={cardStyles.stepResponseBlock}>
              <Text style={cardStyles.stepPrompt}>{sr.prompt}</Text>
              <Text style={cardStyles.stepResponse}>
                {formatStepResponse(sr.response)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {reflection ? (
        <View style={cardStyles.reflectionBlock}>
          <Text style={cardStyles.reflectionLabel}>Reflection</Text>
          <Text style={cardStyles.noteFullText}>{reflection}</Text>
        </View>
      ) : null}
    </View>
  );
}

function AssessmentCard({ entry }: { entry: JournalEntry }) {
  const scores = entry.data.scores;
  return (
    <View style={cardStyles.cardBody}>
      <View style={cardStyles.assessmentBadge}>
        <Text style={cardStyles.assessmentBadgeText}>
          {entry.data.assessmentType?.toUpperCase() || 'ASSESSMENT'}
        </Text>
      </View>
      {/* Show all score dimensions */}
      {scores && typeof scores === 'object' && (
        <View style={cardStyles.scoresGrid}>
          {Object.entries(scores).map(([key, value]) => (
            <View key={key} style={cardStyles.scoreItem}>
              <Text style={cardStyles.scoreLabel}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
              <Text style={cardStyles.scoreValue}>
                {typeof value === 'number' ? (value % 1 === 0 ? value : value.toFixed(1)) : String(value)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function ChatCard({ entry }: { entry: JournalEntry }) {
  const { messageCount, allMessages, mode } = entry.data;
  return (
    <View style={cardStyles.cardBody}>
      <View style={cardStyles.inlineRow}>
        <Text style={cardStyles.chatMeta}>
          {messageCount} message{messageCount !== 1 ? 's' : ''}
        </Text>
        {mode ? (
          <Text style={cardStyles.chatMode}>
            {mode.replace(/_/g, ' ')}
          </Text>
        ) : null}
      </View>
      {/* Full chat transcript for print */}
      {allMessages && Array.isArray(allMessages) && allMessages.length > 0 && (
        <View style={cardStyles.chatTranscript}>
          {allMessages.map((msg: any, idx: number) => (
            <View key={msg.id || idx} style={cardStyles.chatMessage}>
              <Text style={[
                cardStyles.chatRole,
                { color: msg.role === 'user' ? Colors.primary : Colors.secondary },
              ]}>
                {msg.role === 'user' ? 'You' : 'Nuance'}
              </Text>
              <Text style={cardStyles.chatContent}>{msg.content}</Text>
            </View>
          ))}
        </View>
      )}
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
              <Text style={styles.entryTitle}>
                {entry.title}
              </Text>

              {/* Subtitle / preview — full text for print */}
              {entry.subtitle && entry.type !== 'xp' ? (
                <Text style={styles.entrySubtitle}>
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

  // Note (full text, no truncation)
  noteFullText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Inline row (label + value)
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  inlineLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  inlineValue: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.caption,
  },

  // Stars
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },

  // Step-by-step responses from exercises/practices
  stepResponsesContainer: {
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  stepResponseBlock: {
    gap: 2,
  },
  stepPrompt: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  stepResponse: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },

  // Reflection block
  reflectionBlock: {
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 2,
  },
  reflectionLabel: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: FontSizes.caption,
    color: Colors.secondary,
    letterSpacing: 0.3,
  },

  // Assessment badge + scores
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
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  scoreItem: {
    alignItems: 'center',
    minWidth: 70,
    gap: 2,
  },
  scoreLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  scoreValue: {
    fontFamily: 'Jost_600SemiBold',
    fontSize: FontSizes.body,
    color: Colors.text,
  },

  // Chat
  chatMeta: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  chatMode: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.secondary,
    textTransform: 'capitalize',
  },
  chatTranscript: {
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  chatMessage: {
    gap: 2,
  },
  chatRole: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.caption,
    letterSpacing: 0.3,
  },
  chatContent: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },

  // XP
  xpAmount: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSizes.headingM,
    color: Colors.accent,
  },
});
