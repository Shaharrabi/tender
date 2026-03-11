/**
 * Journal service — Aggregates user activity across all Supabase tables
 * into a unified timeline for the Journal screen.
 *
 * Reads from: daily_check_ins, exercise_completions, practice_completions,
 *             chat_sessions, xp_transactions, assessments, step_minigame_outputs,
 *             step_progress, card_completions
 */

import { supabase } from './supabase';
import { TWELVE_STEPS } from '@/utils/steps/twelve-steps';
import { getCourseById } from '@/utils/microcourses/course-registry';

// ─── Types ──────────────────────────────────────────────

export type JournalEntryType =
  | 'checkin'
  | 'exercise'
  | 'practice'
  | 'chat'
  | 'assessment'
  | 'xp'
  | 'minigame'
  | 'step_milestone'
  | 'card_game'
  | 'reflection'
  | 'weare_checkin'
  | 'course_lesson';

export interface JournalEntry {
  id: string;
  type: JournalEntryType;
  timestamp: string; // ISO string
  title: string;
  subtitle?: string;
  data: Record<string, any>;
}

export interface JournalStats {
  totalDays: number;
  totalEntries: number;
  firstEntryDate: string | null;
}

export interface CalendarDayData {
  types: Set<JournalEntryType>;
}

// ─── Helpers ────────────────────────────────────────────

/** Return YYYY-MM-DD in the device's local timezone. */
function localDateString(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Get start of day (midnight) in ISO format for a YYYY-MM-DD string.
 * Uses 'T00:00:00' (local) instead of bare date (UTC) to avoid timezone shift.
 */
function startOfDayISO(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toISOString();
}

/**
 * Get start of next day in ISO format.
 * Parses as local midnight, adds 1 day, converts to ISO.
 */
function endOfDayISO(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  return d.toISOString();
}

/** Get first and last day of a month as YYYY-MM-DD. */
function monthRange(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  // End is first day of next month
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const end = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;
  return { start, end };
}

/** Extract YYYY-MM-DD from an ISO timestamp. */
function dateFromTimestamp(ts: string): string {
  return ts.slice(0, 10);
}

// ─── Journal Entries for a Single Day ───────────────────

export async function getJournalEntriesForDate(
  userId: string,
  date: string // YYYY-MM-DD
): Promise<JournalEntry[]> {
  const dayStart = startOfDayISO(date);
  const dayEnd = endOfDayISO(date);

  const entries: JournalEntry[] = [];

  // Run all queries in parallel
  const [
    checkInsResult,
    exercisesResult,
    practicesResult,
    chatSessionsResult,
    xpResult,
    assessmentsResult,
    minigameResult,
    stepProgressResult,
    cardGameResult,
    stepReflectionsResult,
    weareCheckInsResult,
  ] = await Promise.allSettled([
    // 1. Daily check-ins (uses DATE type — exact match)
    supabase
      .from('daily_check_ins')
      .select('*')
      .eq('user_id', userId)
      .eq('checkin_date', date),

    // 2. Exercise completions (TIMESTAMPTZ — range)
    supabase
      .from('exercise_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', dayStart)
      .lt('completed_at', dayEnd)
      .order('completed_at', { ascending: true }),

    // 3. Practice completions (TIMESTAMPTZ — range)
    supabase
      .from('practice_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', dayStart)
      .lt('completed_at', dayEnd)
      .order('completed_at', { ascending: true }),

    // 4. Chat sessions (TIMESTAMPTZ — range)
    supabase
      .from('chat_sessions')
      .select('*, chat_messages(id, content, role, created_at)')
      .eq('user_id', userId)
      .gte('created_at', dayStart)
      .lt('created_at', dayEnd)
      .order('created_at', { ascending: true }),

    // 5. XP transactions (TIMESTAMPTZ — range)
    supabase
      .from('xp_transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', dayStart)
      .lt('created_at', dayEnd)
      .order('created_at', { ascending: true }),

    // 6. Assessments (TIMESTAMPTZ — range)
    supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', dayStart)
      .lt('completed_at', dayEnd)
      .order('completed_at', { ascending: true }),

    // 7. Mini-game outputs (TIMESTAMPTZ — range)
    supabase
      .from('step_minigame_outputs')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', dayStart)
      .lt('completed_at', dayEnd)
      .order('completed_at', { ascending: true }),

    // 8. Step progress milestones (TIMESTAMPTZ — completed steps only)
    supabase
      .from('step_progress')
      .select('*')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .gte('completed_at', dayStart)
      .lt('completed_at', dayEnd)
      .order('completed_at', { ascending: true }),

    // 9. Building Bridges card completions (TIMESTAMPTZ — range)
    supabase
      .from('card_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', dayStart)
      .lt('completed_at', dayEnd)
      .order('completed_at', { ascending: true }),

    // 10. Step reflections from reflection_notes JSONB (TIMESTAMPTZ — range on updated_at)
    supabase
      .from('step_progress')
      .select('*')
      .eq('user_id', userId)
      .not('reflection_notes', 'is', null)
      .gte('updated_at', dayStart)
      .lt('updated_at', dayEnd)
      .order('updated_at', { ascending: true }),

    // 11. WEARE weekly check-ins (TIMESTAMPTZ — range)
    supabase
      .from('weekly_check_ins')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', dayStart)
      .lt('created_at', dayEnd),
  ]);

  // Process check-ins
  if (checkInsResult.status === 'fulfilled' && checkInsResult.value.data) {
    for (const row of checkInsResult.value.data) {
      entries.push({
        id: row.id,
        type: 'checkin',
        timestamp: row.created_at || `${date}T12:00:00.000Z`,
        title: 'Daily Check-In',
        subtitle: row.note || `Mood: ${row.mood_rating}/10`,
        data: {
          moodRating: row.mood_rating,
          relationshipRating: row.relationship_rating,
          note: row.note,
          practicedGrowthEdge: row.practiced_growth_edge,
        },
      });
    }
  }

  // Process exercises (+ detect micro-course lessons)
  if (exercisesResult.status === 'fulfilled' && exercisesResult.value.data) {
    for (const row of exercisesResult.value.data) {
      const exerciseId: string = row.exercise_id ?? '';
      const isCourseLesson = exerciseId.startsWith('mc-') && exerciseId.includes('-lesson-');

      if (isCourseLesson) {
        // Extract course ID and lesson number from pattern: mc-{courseName}-lesson-{N}
        const courseMatch = exerciseId.match(/^(mc-[^-]+-[^-]+)-lesson-(\d+)/);
        const courseId = courseMatch?.[1] ?? exerciseId.split('-lesson-')[0];
        const lessonNum = courseMatch?.[2] ?? '?';
        const course = getCourseById(courseId);
        const courseTitle = course?.title ?? courseId.replace(/-/g, ' ');

        entries.push({
          id: row.id,
          type: 'course_lesson',
          timestamp: row.completed_at,
          title: row.exercise_name || `Lesson ${lessonNum}`,
          subtitle: `${courseTitle} — Lesson ${lessonNum}`,
          data: {
            exerciseId,
            exerciseName: row.exercise_name,
            courseId,
            courseTitle,
            lessonNumber: lessonNum,
            reflection: row.reflection,
            rating: row.rating,
            stepResponses: row.step_responses,
          },
        });
      } else {
        const name = row.exercise_name || exerciseId.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Exercise';
        entries.push({
          id: row.id,
          type: 'exercise',
          timestamp: row.completed_at,
          title: name,
          subtitle: undefined, // Full data shown in the card body
          data: {
            exerciseId,
            exerciseName: row.exercise_name,
            reflection: row.reflection,
            rating: row.rating,
            stepResponses: row.step_responses,
          },
        });
      }
    }
  }

  // Process practices (with couple context from Fix 2 dual-write)
  if (practicesResult.status === 'fulfilled' && practicesResult.value.data) {
    for (const row of practicesResult.value.data) {
      const practiceLabel = row.practice_id?.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Practice';
      const isTogether = row.completed_by === 'together';
      const stepPart = row.step_number ? `Step ${row.step_number}` : undefined;
      const subtitle = isTogether
        ? (stepPart ? `${stepPart} · Together` : 'Together')
        : stepPart;
      entries.push({
        id: row.id,
        type: 'practice',
        timestamp: row.completed_at,
        title: practiceLabel,
        subtitle,
        data: {
          practiceId: row.practice_id,
          stepNumber: row.step_number,
          completionData: row.completion_data,
          completedBy: row.completed_by ?? null,
          coupleId: row.couple_id ?? null,
        },
      });
    }
  }

  // Process chat sessions
  if (chatSessionsResult.status === 'fulfilled' && chatSessionsResult.value.data) {
    for (const row of chatSessionsResult.value.data) {
      const messages = row.chat_messages || [];
      const userMessages = messages.filter((m: any) => m.role === 'user');
      const firstMessage = userMessages.length > 0 ? userMessages[0].content : null;
      entries.push({
        id: row.id,
        type: 'chat',
        timestamp: row.created_at,
        title: row.title || 'Chat with Nuance',
        subtitle: undefined, // Full data shown in the card body
        data: {
          messageCount: messages.length,
          firstMessage,
          allMessages: messages,
          mode: row.current_mode,
        },
      });
    }
  }

  // Process XP transactions (group small ones, show notable ones)
  if (xpResult.status === 'fulfilled' && xpResult.value.data) {
    const xpRows = xpResult.value.data;
    // Only show significant XP events (>= 20 XP) or level-ups
    const notable = xpRows.filter((row: any) => row.amount >= 20 || row.source === 'level_up');
    for (const row of notable) {
      entries.push({
        id: row.id,
        type: 'xp',
        timestamp: row.created_at,
        title: `+${row.amount} XP`,
        subtitle: row.description || row.source,
        data: {
          amount: row.amount,
          source: row.source,
          description: row.description,
        },
      });
    }
  }

  // Process assessments
  if (assessmentsResult.status === 'fulfilled' && assessmentsResult.value.data) {
    for (const row of assessmentsResult.value.data) {
      const typeLabel = row.type?.replace(/-/g, ' ').toUpperCase() || 'Assessment';
      entries.push({
        id: row.id,
        type: 'assessment',
        timestamp: row.completed_at,
        title: `Assessment: ${typeLabel}`,
        subtitle: 'Completed',
        data: {
          assessmentType: row.type,
          scores: row.scores,
        },
      });
    }
  }

  // Process mini-game outputs
  if (minigameResult.status === 'fulfilled' && minigameResult.value.data) {
    for (const row of minigameResult.value.data) {
      const output = row.output ?? {};
      entries.push({
        id: row.id,
        type: 'minigame',
        timestamp: row.completed_at,
        title: output.title || `Step ${row.step_number} Exercise`,
        subtitle: `Step ${row.step_number}`,
        data: {
          stepNumber: row.step_number,
          gameId: row.game_id,
          insights: output.insights ?? [],
          gameData: output.data ?? {},
        },
      });
    }
  }

  // Process step progress milestones
  if (stepProgressResult.status === 'fulfilled' && stepProgressResult.value.data) {
    for (const row of stepProgressResult.value.data) {
      entries.push({
        id: row.id,
        type: 'step_milestone',
        timestamp: row.completed_at,
        title: `Step ${row.step_number} Completed`,
        subtitle: 'Relational Journey Milestone',
        data: {
          stepNumber: row.step_number,
          status: row.status,
          startedAt: row.started_at,
          completedAt: row.completed_at,
        },
      });
    }
  }

  // Process Building Bridges card completions
  if (cardGameResult.status === 'fulfilled' && cardGameResult.value.data) {
    for (const row of cardGameResult.value.data) {
      const deckLabel = row.deck === 'open-heart' ? 'Open Heart' : 'Connection Builder';
      const categoryLabel = row.category
        ? row.category.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
        : undefined;
      // Format card number nicely: "cb-01" → "Card 01", "oh-12" → "Card 12"
      const cardNum = row.card_id ? row.card_id.replace(/^(cb|oh)-/, '') : '';
      const cardTitle = `Building Bridges \u2014 ${deckLabel} ${cardNum ? '#' + cardNum : ''}`.trim();
      entries.push({
        id: row.id,
        type: 'card_game',
        timestamp: row.completed_at,
        title: cardTitle,
        subtitle: categoryLabel || undefined,
        data: {
          cardId: row.card_id,
          deck: row.deck,
          category: row.category,
          mode: row.mode,
          reflectionText: row.reflection_text,
          xpEarned: row.xp_earned,
        },
      });
    }
  }

  // Process step reflections (from reflection_notes JSONB)
  if (stepReflectionsResult.status === 'fulfilled' && stepReflectionsResult.value.data) {
    for (const row of stepReflectionsResult.value.data) {
      const notes = row.reflection_notes as Record<string, any> | null;
      if (!notes) continue;

      const reflections = notes.reflections as Record<string, string> | undefined;
      const partnerResponse = notes.partnerRoundResponse as string | undefined;

      // Only create entry if there's actual written content
      const hasReflections = reflections && Object.values(reflections).some((v) => v && v.trim());
      const hasPartnerResponse = partnerResponse && partnerResponse.trim();

      if (!hasReflections && !hasPartnerResponse) continue;

      // Look up step definition for prompts
      const step = TWELVE_STEPS.find((s) => s.stepNumber === row.step_number);

      entries.push({
        id: `reflection-${row.id}`,
        type: 'reflection',
        timestamp: row.updated_at,
        title: `Step ${row.step_number} Reflection`,
        subtitle: step?.title ?? 'Relational Journey',
        data: {
          stepNumber: row.step_number,
          stepTitle: step?.title,
          reflections: reflections ?? {},
          prompts: step?.reflectionPrompts ?? [],
          partnerRoundResponse: partnerResponse ?? null,
          partnerRoundPrompt: step?.partnerRoundPrompt ?? null,
          completedCriteria: notes.completedCriteria ?? [],
          totalCriteria: step?.completionCriteria?.length ?? 0,
        },
      });
    }
  }

  // Process WEARE weekly check-ins
  if (weareCheckInsResult.status === 'fulfilled' && weareCheckInsResult.value.data) {
    for (const row of weareCheckInsResult.value.data) {
      const practiceHighlight = row.practice_highlight;
      const satisfaction = row.satisfaction_rating;
      const subtitle = practiceHighlight
        ? practiceHighlight
        : satisfaction != null
          ? `Relationship satisfaction: ${satisfaction}/10`
          : 'Weekly reflection completed';
      entries.push({
        id: row.id,
        type: 'weare_checkin',
        timestamp: row.created_at,
        title: 'Weekly Relationship Check-In',
        subtitle,
        data: {
          satisfactionRating: row.satisfaction_rating,
          communicationRating: row.communication_rating,
          intimacyRating: row.intimacy_rating,
          conflictRating: row.conflict_rating,
          growthRating: row.growth_rating,
          practiceHighlight: row.practice_highlight,
          challengeNote: row.challenge_note,
          weekNumber: row.week_number,
        },
      });
    }
  }

  // Sort by timestamp
  entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return entries;
}

// ─── Calendar Data for a Month ──────────────────────────

export async function getJournalCalendarData(
  userId: string,
  year: number,
  month: number // 1-12
): Promise<Map<string, CalendarDayData>> {
  const { start, end } = monthRange(year, month);
  const startISO = startOfDayISO(start);
  const endISO = startOfDayISO(end);

  const dayMap = new Map<string, CalendarDayData>();

  const addDay = (dateStr: string, type: JournalEntryType) => {
    const existing = dayMap.get(dateStr);
    if (existing) {
      existing.types.add(type);
    } else {
      dayMap.set(dateStr, { types: new Set([type]) });
    }
  };

  // Run all queries in parallel
  const [
    checkInsResult,
    exercisesResult,
    practicesResult,
    chatSessionsResult,
    assessmentsResult,
    minigameCalResult,
    stepProgressCalResult,
    cardGameCalResult,
    stepReflectionsCalResult,
    weareCalResult,
  ] = await Promise.allSettled([
    supabase
      .from('daily_check_ins')
      .select('checkin_date')
      .eq('user_id', userId)
      .gte('checkin_date', start)
      .lt('checkin_date', end),

    supabase
      .from('exercise_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .gte('completed_at', startISO)
      .lt('completed_at', endISO),

    supabase
      .from('practice_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .gte('completed_at', startISO)
      .lt('completed_at', endISO),

    supabase
      .from('chat_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', startISO)
      .lt('created_at', endISO),

    supabase
      .from('assessments')
      .select('completed_at')
      .eq('user_id', userId)
      .gte('completed_at', startISO)
      .lt('completed_at', endISO),

    supabase
      .from('step_minigame_outputs')
      .select('completed_at')
      .eq('user_id', userId)
      .gte('completed_at', startISO)
      .lt('completed_at', endISO),

    supabase
      .from('step_progress')
      .select('completed_at')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .gte('completed_at', startISO)
      .lt('completed_at', endISO),

    supabase
      .from('card_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .gte('completed_at', startISO)
      .lt('completed_at', endISO),

    supabase
      .from('step_progress')
      .select('updated_at, reflection_notes')
      .eq('user_id', userId)
      .not('reflection_notes', 'is', null)
      .gte('updated_at', startISO)
      .lt('updated_at', endISO),

    // 10. WEARE weekly check-ins
    supabase
      .from('weekly_check_ins')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', startISO)
      .lt('created_at', endISO),
  ]);

  // Map check-ins (DATE type)
  if (checkInsResult.status === 'fulfilled' && checkInsResult.value.data) {
    for (const row of checkInsResult.value.data) {
      addDay(row.checkin_date, 'checkin');
    }
  }

  // Map exercises (TIMESTAMPTZ)
  if (exercisesResult.status === 'fulfilled' && exercisesResult.value.data) {
    for (const row of exercisesResult.value.data) {
      addDay(dateFromTimestamp(row.completed_at), 'exercise');
    }
  }

  // Map practices
  if (practicesResult.status === 'fulfilled' && practicesResult.value.data) {
    for (const row of practicesResult.value.data) {
      addDay(dateFromTimestamp(row.completed_at), 'practice');
    }
  }

  // Map chat sessions
  if (chatSessionsResult.status === 'fulfilled' && chatSessionsResult.value.data) {
    for (const row of chatSessionsResult.value.data) {
      addDay(dateFromTimestamp(row.created_at), 'chat');
    }
  }

  // Map assessments
  if (assessmentsResult.status === 'fulfilled' && assessmentsResult.value.data) {
    for (const row of assessmentsResult.value.data) {
      addDay(dateFromTimestamp(row.completed_at), 'assessment');
    }
  }

  // Map mini-game outputs
  if (minigameCalResult.status === 'fulfilled' && minigameCalResult.value.data) {
    for (const row of minigameCalResult.value.data) {
      addDay(dateFromTimestamp(row.completed_at), 'minigame');
    }
  }

  // Map step milestones
  if (stepProgressCalResult.status === 'fulfilled' && stepProgressCalResult.value.data) {
    for (const row of stepProgressCalResult.value.data) {
      addDay(dateFromTimestamp(row.completed_at), 'step_milestone');
    }
  }

  // Map Building Bridges card completions
  if (cardGameCalResult.status === 'fulfilled' && cardGameCalResult.value.data) {
    for (const row of cardGameCalResult.value.data) {
      addDay(dateFromTimestamp(row.completed_at), 'card_game');
    }
  }

  // Map step reflections
  if (stepReflectionsCalResult.status === 'fulfilled' && stepReflectionsCalResult.value.data) {
    for (const row of stepReflectionsCalResult.value.data) {
      const notes = row.reflection_notes as Record<string, any> | null;
      if (!notes) continue;
      const reflections = notes.reflections as Record<string, string> | undefined;
      const partnerResponse = notes.partnerRoundResponse as string | undefined;
      const hasContent =
        (reflections && Object.values(reflections).some((v) => v && v.trim())) ||
        (partnerResponse && partnerResponse.trim());
      if (hasContent) {
        addDay(dateFromTimestamp(row.updated_at), 'reflection');
      }
    }
  }

  // Map WEARE weekly check-ins
  if (weareCalResult.status === 'fulfilled' && weareCalResult.value.data) {
    for (const row of weareCalResult.value.data) {
      addDay(dateFromTimestamp(row.created_at), 'weare_checkin');
    }
  }

  return dayMap;
}

// ─── Journal Stats (for Cover Page) ────────────────────

export async function getJournalStats(
  userId: string
): Promise<JournalStats> {
  // Fetch earliest entries from key tables in parallel
  const [checkInResult, exerciseResult, assessmentResult, cardGameEarliestResult] = await Promise.allSettled([
    supabase
      .from('daily_check_ins')
      .select('checkin_date')
      .eq('user_id', userId)
      .order('checkin_date', { ascending: true })
      .limit(1),

    supabase
      .from('exercise_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true })
      .limit(1),

    supabase
      .from('assessments')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true })
      .limit(1),

    supabase
      .from('card_completions')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true })
      .limit(1),
  ]);

  // Find earliest date
  const dates: string[] = [];

  if (checkInResult.status === 'fulfilled' && checkInResult.value.data?.[0]) {
    dates.push(checkInResult.value.data[0].checkin_date);
  }
  if (exerciseResult.status === 'fulfilled' && exerciseResult.value.data?.[0]) {
    dates.push(dateFromTimestamp(exerciseResult.value.data[0].completed_at));
  }
  if (assessmentResult.status === 'fulfilled' && assessmentResult.value.data?.[0]) {
    dates.push(dateFromTimestamp(assessmentResult.value.data[0].completed_at));
  }
  if (cardGameEarliestResult.status === 'fulfilled' && cardGameEarliestResult.value.data?.[0]) {
    dates.push(dateFromTimestamp(cardGameEarliestResult.value.data[0].completed_at));
  }

  const firstEntryDate = dates.length > 0
    ? dates.sort()[0]
    : null;

  // Count total active days and entries
  const [checkInCountResult, exerciseCountResult, practiceCountResult, cardGameCountResult] = await Promise.allSettled([
    supabase
      .from('daily_check_ins')
      .select('checkin_date', { count: 'exact', head: true })
      .eq('user_id', userId),

    supabase
      .from('exercise_completions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),

    supabase
      .from('practice_completions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),

    supabase
      .from('card_completions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);

  const checkInCount = checkInCountResult.status === 'fulfilled' ? (checkInCountResult.value.count ?? 0) : 0;
  const exerciseCount = exerciseCountResult.status === 'fulfilled' ? (exerciseCountResult.value.count ?? 0) : 0;
  const practiceCount = practiceCountResult.status === 'fulfilled' ? (practiceCountResult.value.count ?? 0) : 0;
  const cardGameCount = cardGameCountResult.status === 'fulfilled' ? (cardGameCountResult.value.count ?? 0) : 0;

  const totalEntries = checkInCount + exerciseCount + practiceCount + cardGameCount;

  // Total active days = count of unique check-in dates (best proxy)
  const totalDays = checkInCount;

  return {
    totalDays,
    totalEntries,
    firstEntryDate,
  };
}

// ─── Bulk Fetch for Export ───────────────────────────────

/**
 * Fetch all journal entries for a month (used by PDF export).
 * Iterates over each day in the month and aggregates.
 */
export async function getJournalEntriesForMonth(
  userId: string,
  year: number,
  month: number,
): Promise<JournalEntry[]> {
  const { start, end } = monthRange(year, month);
  const startDate = new Date(start + 'T00:00:00');
  const endDate = new Date(end + 'T00:00:00');

  const allEntries: JournalEntry[] = [];
  const cursor = new Date(startDate);

  while (cursor < endDate) {
    const dateStr = localDateString(cursor);
    try {
      const dayEntries = await getJournalEntriesForDate(userId, dateStr);
      allEntries.push(...dayEntries);
    } catch {
      // Skip failed days silently
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return allEntries;
}

/**
 * Fetch all daily reflections for a month (used by PDF export).
 */
export async function getReflectionsForMonth(
  userId: string,
  year: number,
  month: number,
): Promise<DailyReflection[]> {
  const { start, end } = monthRange(year, month);

  const { data, error } = await supabase
    .from('daily_reflections')
    .select('*')
    .eq('user_id', userId)
    .gte('reflection_date', start)
    .lt('reflection_date', end)
    .order('reflection_date', { ascending: true });

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    reflectionDate: row.reflection_date,
    questionResponses: row.question_responses || [],
    freeText: row.free_text || '',
    dayTags: row.day_tags || [],
    updatedAt: row.updated_at,
  }));
}

// ─── Daily Reflections ──────────────────────────────────

export interface QuestionResponse {
  question: string;
  answer: string;
}

export interface DailyReflection {
  id?: string;
  userId: string;
  reflectionDate: string; // YYYY-MM-DD
  questionResponses: QuestionResponse[];
  freeText: string;
  dayTags: string[];
  updatedAt?: string;
}

/**
 * WEARE-inspired daily reflection questions.
 * Rotates based on the day of the week.
 */
const REFLECTION_QUESTION_SETS: string[][] = [
  // Monday — Attunement & Connection
  [
    'What moment today made you feel most connected to your partner?',
    'How attuned were you to your own feelings today?',
    'What is one thing you noticed about your partner that you didn\'t say out loud?',
  ],
  // Tuesday — Co-Creation & Growth
  [
    'What\'s one way you and your partner created something together today?',
    'How did your differences show up today — as friction or as fuel?',
    'What small step did you take toward growth in your relationship?',
  ],
  // Wednesday — Space & Boundaries
  [
    'Did the space between you and your partner feel expansive or constricted today?',
    'How well did you honor your own needs while staying connected?',
    'What\'s one boundary you held or wished you had held today?',
  ],
  // Thursday — Letting Go & Change
  [
    'What story about your relationship are you holding onto that might not be true?',
    'How are you allowing yourself to be changed by this relationship?',
    'What would you like to release from today?',
  ],
  // Friday — Gratitude & Resonance
  [
    'What are you most grateful for about your partner today?',
    'When did the connection between you feel most alive?',
    'What made you smile about your relationship today?',
  ],
  // Saturday — Reflection & Insight
  [
    'What pattern did you notice in yourself this week?',
    'How well are your insights translating into changed behavior?',
    'What surprised you about your relationship this week?',
  ],
  // Sunday — Intention & Vision
  [
    'What intention do you want to carry into next week?',
    'How do you want to show up differently for your partner?',
    'What\'s one thing you want to nurture in the space between you?',
  ],
];

/**
 * Get today's reflection questions based on the day of the week.
 */
export function getReflectionQuestions(date: string = localDateString()): string[] {
  const d = new Date(date + 'T12:00:00');
  const dayIndex = d.getDay(); // 0=Sunday
  // Map: Sun=6, Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5
  const setIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  return REFLECTION_QUESTION_SETS[setIndex];
}

/**
 * Load a daily reflection for a specific date.
 */
export async function getDailyReflection(
  userId: string,
  date: string
): Promise<DailyReflection | null> {
  const { data, error } = await supabase
    .from('daily_reflections')
    .select('*')
    .eq('user_id', userId)
    .eq('reflection_date', date)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    reflectionDate: data.reflection_date,
    questionResponses: data.question_responses || [],
    freeText: data.free_text || '',
    dayTags: data.day_tags || [],
    updatedAt: data.updated_at,
  };
}

/**
 * Save or update a daily reflection (upsert by user + date).
 */
export async function saveDailyReflection(
  reflection: DailyReflection
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('daily_reflections')
    .upsert(
      {
        user_id: reflection.userId,
        reflection_date: reflection.reflectionDate,
        question_responses: reflection.questionResponses,
        free_text: reflection.freeText,
        day_tags: reflection.dayTags,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,reflection_date' }
    );

  if (error) {
    console.warn('[Journal] Save reflection error:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
