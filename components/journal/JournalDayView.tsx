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
  RainbowIcon,
  NotepadIcon,
  CommunityIcon,
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
    bg: Colors.accentGoldLight,
    label: 'Assessment',
    Icon: StarIcon,
  },
  chat: {
    color: Colors.calm,
    bg: Colors.calmLight,
    label: 'Chat',
    Icon: ChatBubbleIcon,
  },
  xp: {
    color: Colors.accent,
    bg: Colors.accentLight,
    label: 'XP',
    Icon: StarIcon,
  },
  minigame: {
    color: Colors.accentGold,
    bg: Colors.accentGoldLight,
    label: 'Step Exercise',
    Icon: SparkleIcon,
  },
  step_milestone: {
    color: Colors.success,
    bg: Colors.successLight,
    label: 'Step Milestone',
    Icon: StarIcon,
  },
  card_game: {
    color: Colors.accent,
    bg: Colors.accentLight,
    label: 'Card Game',
    Icon: RainbowIcon,
  },
  reflection: {
    color: Colors.primary,
    bg: Colors.primaryFaded,
    label: 'Reflection',
    Icon: NotepadIcon,
  },
  weare_checkin: {
    color: Colors.calm,
    bg: Colors.calmLight,
    label: 'Weekly Check-In',
    Icon: CommunityIcon,
  },
  course_lesson: {
    color: Colors.secondary,
    bg: Colors.secondaryLight,
    label: 'Course Lesson',
    Icon: BookOpenIcon,
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
 * Try to format ANY response string that contains JSON into readable text.
 * Works for both explicit `type: 'interactive'` and any step response
 * that happens to contain serialized JSON (checklist, scenario, etc.).
 *
 * Returns the original string if it's not JSON.
 * Returns null if the JSON can't be meaningfully displayed (skip it).
 */
function formatResponse(responseStr: string): string | null {
  // Quick check: if it doesn't start with { or [, it's plain text
  const trimmed = responseStr.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return responseStr;
  }

  try {
    const data = JSON.parse(trimmed);

    // Body scan / activation map
    if (data.zone && data.zoneName) return data.zoneName;

    // Myth busters
    if (data.mythsBusted != null) return `${data.mythsBusted} myths explored`;

    // Horseman matcher
    if (data.allMatchedCorrectly != null) {
      const acc = data.noMistakes ? 'perfect score' : `${data.totalMistakes || 0} mistake${data.totalMistakes !== 1 ? 's' : ''}`;
      return `Matching complete \u2014 ${acc}`;
    }
    if (data.myHorseman) {
      const parts: string[] = [];
      if (data.myHorseman) parts.push(`My horseman: ${data.myHorseman}`);
      if (data.partnerHorseman) parts.push(`Partner's: ${data.partnerHorseman}`);
      return parts.join(' \u2022 ');
    }

    // Repair scenario / branching
    if (data.choicesMade && Array.isArray(data.choicesMade)) {
      const ending = data.endingType ? ` \u2014 ${data.endingType} ending` : '';
      const repairs = data.repairAttemptsMade != null ? `, ${data.repairAttemptsMade} repair${data.repairAttemptsMade !== 1 ? 's' : ''} made` : '';
      return `${data.choicesMade.length} choices${repairs}${ending}`;
    }

    // Content + pattern (MC3 L1) — duplicated in the prompt text
    if (data.content && data.pattern) return null;

    // Sentence transform output
    if (data.stages && Array.isArray(data.stages)) {
      return data.stages.map((s: any) => `${s.prefix || ''} ${s.value || ''}`).join(' ').trim();
    }

    // Checklist (e.g. grounding 5-4-3-2-1)
    if (data.checkedLabels && Array.isArray(data.checkedLabels)) {
      return data.checkedLabels.join(', ');
    }
    // Checklist variant with just 'checked' array and 'count'
    if (data.checked && Array.isArray(data.checked) && data.count != null) {
      if (data.checkedLabels) return data.checkedLabels.join(', ');
      return `${data.count} selected`;
    }

    // Boundary spectrum, window of tolerance, etc. with simple label
    if (data.label) return data.label;

    // Breathing / timer completion
    if (data.completed != null) return data.completed ? 'Completed' : 'Skipped';

    // Card flip
    if (data.count != null && data.total != null) return `${data.count} of ${data.total} cards explored`;

    // Scale slider
    if (data.value != null && data.zone) return `${data.zone} (${data.value}/100)`;

    // Scenario choice
    if (data.text) return data.text;

    // Generic: if it has a 'selected' string field, show it
    if (typeof data.selected === 'string') return data.selected;

    // Generic: if it has a 'response' string, show it
    if (typeof data.response === 'string') return data.response;

    // Fallback: don't show raw JSON
    return null;
  } catch {
    // Not valid JSON — it's plain text, show as-is
    return responseStr;
  }
}

function ExerciseCard({ entry }: { entry: JournalEntry }) {
  const { reflection, rating, stepResponses } = entry.data;
  return (
    <View style={cardStyles.cardBody}>
      {rating != null && <RatingStars rating={rating} />}

      {/* Full step-by-step responses from the practice */}
      {stepResponses && Array.isArray(stepResponses) && stepResponses.length > 0 && (
        <View style={cardStyles.stepResponsesContainer}>
          {stepResponses.map((sr: any, idx: number) => {
            // Format any JSON responses into human-readable text
            const displayText = formatResponse(sr.response || '');

            // Skip entries that can't be meaningfully displayed
            if (!displayText) return null;

            return (
              <View key={idx} style={cardStyles.stepResponseBlock}>
                <Text style={cardStyles.stepPrompt}>{sr.prompt}</Text>
                <Text style={cardStyles.stepResponse}>{displayText}</Text>
              </View>
            );
          })}
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

/**
 * Format an assessment score value for display.
 * Shows primitives and simple flat objects. Skips deeply nested structures
 * (like SubscaleScores with sub-objects) to keep cards clean.
 */
function formatScoreValue(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === 'number') return value % 1 === 0 ? String(value) : value.toFixed(1);
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) {
    // Array of primitives → join
    const items = value
      .filter((v) => v != null && (typeof v === 'string' || typeof v === 'number'))
      .map((v) => typeof v === 'number' ? (v % 1 === 0 ? String(v) : v.toFixed(1)) : String(v));
    if (items.length > 0) return items.slice(0, 5).join(', ') + (value.length > 5 ? '…' : '');
    // Array of objects → skip (too detailed)
    return null;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return null;
    // Check if ANY value is a nested object/array — if so, skip entirely
    const hasNested = entries.some(([, v]) => v != null && typeof v === 'object');
    if (hasNested) return null;
    // Flat object with only primitive values → show inline
    if (entries.length <= 6) {
      return entries
        .map(([k, v]) => {
          const label = k.replace(/_/g, ' ');
          const val = typeof v === 'number' ? (v % 1 === 0 ? String(v) : v.toFixed(1)) : String(v ?? '');
          return `${label}: ${val}`;
        })
        .join(', ');
    }
    return `${entries.length} dimensions`;
  }
  return String(value);
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
          {Object.entries(scores).map(([key, value]) => {
            const displayValue = formatScoreValue(value);
            if (!displayValue) return null;
            return (
              <View key={key} style={cardStyles.scoreItem}>
                <Text style={cardStyles.scoreLabel}>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Text>
                <Text style={cardStyles.scoreValue}>
                  {displayValue}
                </Text>
              </View>
            );
          })}
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

function MiniGameCard({ entry }: { entry: JournalEntry }) {
  const { insights, stepNumber, gameId } = entry.data;
  return (
    <View style={cardStyles.cardBody}>
      {stepNumber && (
        <Text style={cardStyles.miniGameStep}>Step {stepNumber}</Text>
      )}
      {insights && Array.isArray(insights) && insights.length > 0 && (
        <View style={cardStyles.miniGameInsights}>
          {insights.map((insight: string, i: number) => (
            <Text key={i} style={cardStyles.miniGameInsightText}>
              {'\u2022'} {insight}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

function CardGameCard({ entry }: { entry: JournalEntry }) {
  const { deck, category, reflectionText, xpEarned, mode } = entry.data;
  const deckLabel = deck === 'open-heart' ? 'Open Heart' : 'Connection Builder';
  const categoryLabel = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : null;

  return (
    <View style={cardStyles.cardBody}>
      {/* Deck + category badge */}
      <View style={cardStyles.inlineRow}>
        <Text style={cardStyles.chatMode}>{deckLabel}</Text>
        {categoryLabel && (
          <Text style={cardStyles.chatMeta}>{categoryLabel}</Text>
        )}
      </View>

      {/* Reflection */}
      {reflectionText && reflectionText.trim().length > 0 ? (
        <View style={cardStyles.reflectionBlock}>
          <Text style={cardStyles.reflectionLabel}>Reflection</Text>
          <Text style={cardStyles.noteFullText}>{reflectionText}</Text>
        </View>
      ) : null}

      {/* XP earned */}
      {xpEarned != null && (
        <View style={cardStyles.inlineRow}>
          <Text style={cardStyles.inlineLabel}>XP earned:</Text>
          <Text style={[cardStyles.inlineValue, { color: Colors.accentGold }]}>
            +{xpEarned}
          </Text>
        </View>
      )}
    </View>
  );
}

function StepReflectionCard({ entry }: { entry: JournalEntry }) {
  const {
    stepNumber,
    reflections,
    prompts,
    partnerRoundResponse,
    partnerRoundPrompt,
    completedCriteria,
    totalCriteria,
  } = entry.data;

  const reflectionEntries = reflections
    ? Object.entries(reflections as Record<string, string>).filter(
        ([, v]) => v && v.trim()
      )
    : [];

  return (
    <View style={cardStyles.cardBody}>
      {/* Criteria progress */}
      {completedCriteria && totalCriteria > 0 && (
        <View style={cardStyles.inlineRow}>
          <Text style={cardStyles.inlineLabel}>Criteria met:</Text>
          <Text
            style={[
              cardStyles.inlineValue,
              {
                color:
                  completedCriteria.length >= totalCriteria
                    ? Colors.success
                    : Colors.textMuted,
              },
            ]}
          >
            {completedCriteria.length}/{totalCriteria}
          </Text>
        </View>
      )}

      {/* Reflection prompt/answer pairs */}
      {reflectionEntries.length > 0 && (
        <View style={cardStyles.stepResponsesContainer}>
          {reflectionEntries.map(([idx, text]) => {
            const promptText =
              prompts && prompts[Number(idx)]
                ? prompts[Number(idx)]
                : `Reflection ${Number(idx) + 1}`;
            return (
              <View key={idx} style={cardStyles.stepResponseBlock}>
                <Text style={cardStyles.stepPrompt}>{promptText}</Text>
                <Text style={cardStyles.stepResponse}>{text}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Partner round response */}
      {partnerRoundResponse && partnerRoundResponse.trim() ? (
        <View style={cardStyles.reflectionBlock}>
          <Text style={cardStyles.reflectionLabel}>Partner Round</Text>
          {partnerRoundPrompt ? (
            <Text style={cardStyles.stepPrompt}>{partnerRoundPrompt}</Text>
          ) : null}
          <Text style={cardStyles.noteFullText}>{partnerRoundResponse}</Text>
        </View>
      ) : null}
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
    case 'minigame':
      return <MiniGameCard entry={entry} />;
    case 'card_game':
      return <CardGameCard entry={entry} />;
    case 'reflection':
      return <StepReflectionCard entry={entry} />;
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
    backgroundColor: Colors.accentGoldLight,
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
    maxWidth: 140,
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
    textAlign: 'center',
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

  // Mini-game
  miniGameStep: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  miniGameInsights: {
    gap: 4,
  },
  miniGameInsightText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
