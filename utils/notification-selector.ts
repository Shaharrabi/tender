/**
 * Notification Selection Engine
 *
 * Weighted-random selection of engagement prompts with:
 * - Category frequency caps (per-week)
 * - 14-day cooldown per prompt (date-tracked)
 * - 1 per session, max 5 per day
 * - WEARE bottleneck targeting (2x priority boost)
 * - No same-category back-to-back within the same day
 * - Anti-shame: never guilt-trips, never compares
 * - USER-SCOPED: all state is per-user (no cross-contamination on sign-out/in)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ENGAGEMENT_PROMPTS,
  CATEGORY_CONFIG,
  PREF_TO_CATEGORY,
} from '@/constants/engagement-prompts';
import type {
  EngagementPrompt,
  NotificationCategory,
  NotificationSelectionState,
  EngagementNotificationPreferences,
} from '@/types/notifications';

// ─── Constants ──────────────────────────────────────────

const STORAGE_PREFIX = 'tender_engagement_state_';
const PREFS_PREFIX = 'tender_engagement_prefs_';
const HISTORY_PREFIX = 'tender_engagement_history_';
const COOLDOWN_DAYS = 14;
const MAX_PER_DAY = 5;

// Legacy global keys (for cleanup)
const LEGACY_STORAGE_KEY = 'tender_engagement_state';
const LEGACY_PREFS_KEY = 'tender_engagement_prefs';
const LEGACY_HISTORY_KEY = 'tender_engagement_history';

/** Track the current userId so storage functions are scoped */
let _currentUserId: string | undefined;

/** Set the active user — call when userId changes. */
export function setNotificationUserId(userId: string | undefined): void {
  _currentUserId = userId;
}

/** Get user-scoped storage key */
function stateKey(): string {
  return _currentUserId ? `${STORAGE_PREFIX}${_currentUserId}` : LEGACY_STORAGE_KEY;
}

function prefsKey(): string {
  return _currentUserId ? `${PREFS_PREFIX}${_currentUserId}` : LEGACY_PREFS_KEY;
}

function historyKey(): string {
  return _currentUserId ? `${HISTORY_PREFIX}${_currentUserId}` : LEGACY_HISTORY_KEY;
}

// ─── State Management ───────────────────────────────────

const DEFAULT_STATE: NotificationSelectionState = {
  lastShownByCategory: {},
  seenPrompts: [],
  lastCategory: undefined,
  todayShows: [],
  shownThisSession: false,
  totalShown: 0,
  lastShownAt: undefined,
};

export async function getSelectionState(): Promise<NotificationSelectionState> {
  try {
    const raw = await AsyncStorage.getItem(stateKey());
    if (!raw) return { ...DEFAULT_STATE };
    const state = JSON.parse(raw) as NotificationSelectionState;

    // Migrate old seenPromptIds (string[]) → seenPrompts ({id, at}[])
    if ((state as any).seenPromptIds && !state.seenPrompts) {
      state.seenPrompts = [];
      delete (state as any).seenPromptIds;
    }

    // Ensure seenPrompts exists
    if (!state.seenPrompts) state.seenPrompts = [];

    // Clean up todayShows from previous days
    const today = new Date().toISOString().slice(0, 10);
    state.todayShows = (state.todayShows || []).filter(
      (ts) => ts.slice(0, 10) === today
    );

    // Prune seenPrompts older than COOLDOWN_DAYS
    const cutoff = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString();
    state.seenPrompts = state.seenPrompts.filter((entry) => entry.at > cutoff);

    return state;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

async function saveSelectionState(state: NotificationSelectionState): Promise<void> {
  try {
    await AsyncStorage.setItem(stateKey(), JSON.stringify(state));
  } catch {
    // Silent fail — non-critical
  }
}

// ─── Preference Management ──────────────────────────────

export async function getEngagementPrefs(): Promise<EngagementNotificationPreferences> {
  try {
    const raw = await AsyncStorage.getItem(prefsKey());
    if (!raw) return getDefaultPrefs();
    return JSON.parse(raw);
  } catch {
    return getDefaultPrefs();
  }
}

export async function saveEngagementPrefs(prefs: EngagementNotificationPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(prefsKey(), JSON.stringify(prefs));
  } catch {
    // Silent fail
  }
}

function getDefaultPrefs(): EngagementNotificationPreferences {
  return {
    scienceDrops: true,
    microInsights: true,
    duolingoWit: true,
    practiceNudges: true,
    growthMirrors: true,
    coupleBubble: true,
    milestoneStreak: true,
    weeklyCheckin: true,
  };
}

// ─── Rate Limiting ──────────────────────────────────────

/** Check if we can show a notification right now. */
export async function shouldShowNotification(): Promise<boolean> {
  const state = await getSelectionState();

  // Max 1 per session
  if (state.shownThisSession) {
    console.log('[NotifSelector] Blocked: shownThisSession is true');
    return false;
  }

  // Max per day
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = (state.todayShows || []).filter(
    (ts) => ts.slice(0, 10) === today
  ).length;
  if (todayCount >= MAX_PER_DAY) {
    console.log('[NotifSelector] Blocked: todayCount', todayCount, '>= MAX_PER_DAY', MAX_PER_DAY);
    return false;
  }

  console.log('[NotifSelector] canShow=true (session:', state.shownThisSession, ', todayCount:', todayCount, ')');
  return true;
}

// ─── Selection Algorithm ────────────────────────────────

/**
 * Select the next engagement prompt to show.
 *
 * @param weareBottleneck - Current WEARE bottleneck variable (for targeting)
 * @param dayNumber       - Days since the user joined (for minDay filtering)
 * @param prefs           - User's category preferences
 * @returns Selected prompt, or null if nothing should be shown
 */
export async function selectNotification(
  weareBottleneck?: string,
  dayNumber: number = 1,
  prefs?: EngagementNotificationPreferences,
): Promise<EngagementPrompt | null> {
  const userPrefs = prefs || await getEngagementPrefs();
  const state = await getSelectionState();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // Build set of disabled categories
  const disabledCategories = new Set<NotificationCategory>();
  for (const [key, category] of Object.entries(PREF_TO_CATEGORY)) {
    if (!userPrefs[key as keyof EngagementNotificationPreferences]) {
      disabledCategories.add(category);
    }
  }

  console.log('[NotifSelector] Pool size:', ENGAGEMENT_PROMPTS.length,
    '| seenPrompts:', state.seenPrompts.length,
    '| disabledCategories:', [...disabledCategories],
    '| lastCategory:', state.lastCategory,
    '| dayNumber:', dayNumber);

  // Build set of recently seen prompt IDs (already pruned to 14 days in getSelectionState)
  const recentlySeenIds = new Set(state.seenPrompts.map((entry) => entry.id));

  // Build count of category shows this week from todayShows + lastShownByCategory
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const categoryCountsThisWeek: Partial<Record<NotificationCategory, number>> = {};
  // Count from seenPrompts this week
  for (const entry of state.seenPrompts) {
    if (entry.at.slice(0, 10) >= weekAgo) {
      // We need the category — look it up from the prompt pool
      const prompt = ENGAGEMENT_PROMPTS.find((p) => p.id === entry.id);
      if (prompt) {
        categoryCountsThisWeek[prompt.category] = (categoryCountsThisWeek[prompt.category] || 0) + 1;
      }
    }
  }

  // Only apply lastCategory filter within the same day (not across days)
  const lastShowDate = state.lastShownAt?.slice(0, 10);
  const applyLastCategoryFilter = lastShowDate === todayStr;

  // Filter the pool
  const eligible = ENGAGEMENT_PROMPTS.filter((prompt) => {
    // 1. Category not disabled
    if (disabledCategories.has(prompt.category)) return false;

    // 2. Not seen in cooldown window (14 days, date-tracked)
    if (recentlySeenIds.has(prompt.id)) return false;

    // 3. Meets minimum day requirement
    if (prompt.minDay && dayNumber < prompt.minDay) return false;

    // 4. Not same category as last shown (only within same day)
    if (applyLastCategoryFilter && state.lastCategory === prompt.category) return false;

    // 5. Category weekly cap not exceeded
    const catConfig = CATEGORY_CONFIG.find((c) => c.id === prompt.category);
    if (catConfig) {
      const catCount = categoryCountsThisWeek[prompt.category] || 0;
      if (catCount >= catConfig.maxPerWeek) return false;
    }

    return true;
  });

  console.log('[NotifSelector] Eligible:', eligible.length, 'of', ENGAGEMENT_PROMPTS.length);

  if (eligible.length === 0) {
    console.log('[NotifSelector] No eligible prompts! Clearing cooldowns and retrying...');
    // Fallback: if everything is on cooldown, clear cooldowns and try again
    // This prevents the "seen all prompts" dead-end
    if (recentlySeenIds.size > 0) {
      state.seenPrompts = [];
      state.lastCategory = undefined;
      await saveSelectionState(state);
      // Retry once with cleared cooldowns
      return selectNotification(weareBottleneck, dayNumber, prefs);
    }
    return null;
  }

  // Score: base priority + WEARE boost
  const scored = eligible.map((prompt) => {
    let score = prompt.priority;
    if (weareBottleneck && prompt.weareTarget === weareBottleneck) {
      score *= 2; // 2x boost for targeted prompts
    }
    return { prompt, score };
  });

  // Weighted random selection
  const totalScore = scored.reduce((sum, s) => sum + s.score, 0);
  let random = Math.random() * totalScore;
  let selected: EngagementPrompt = scored[0].prompt;

  for (const { prompt, score } of scored) {
    random -= score;
    if (random <= 0) {
      selected = prompt;
      break;
    }
  }

  // Update state
  state.seenPrompts.push({ id: selected.id, at: now.toISOString() });
  state.lastCategory = selected.category;
  state.todayShows.push(now.toISOString());
  state.shownThisSession = true;
  state.totalShown += 1;
  state.lastShownAt = now.toISOString();
  state.lastShownByCategory[selected.category] = todayStr;

  await saveSelectionState(state);

  return selected;
}

// ─── Session Reset ──────────────────────────────────────

/** Reset the session flag (call on app startup/foreground). */
export async function resetSessionFlag(): Promise<void> {
  const state = await getSelectionState();
  state.shownThisSession = false;
  await saveSelectionState(state);
}

// ─── Clear All State (call on sign-out) ─────────────────

/**
 * Clear all notification state for the current user session.
 * Also cleans up legacy global keys so old data doesn't pollute new users.
 * Call this on sign-out.
 */
export async function clearNotificationState(): Promise<void> {
  try {
    // Clear legacy global keys so new users don't inherit old data
    await AsyncStorage.multiRemove([
      LEGACY_STORAGE_KEY,
      LEGACY_PREFS_KEY,
      LEGACY_HISTORY_KEY,
      'tender_engagement_session',
    ]);

    _currentUserId = undefined;
  } catch {
    // Silent fail
  }
}

// ─── Notification History (for Feed) ────────────────────

interface StoredNotification {
  promptId: string;
  category: NotificationCategory;
  shownAt: string;
  dismissed: boolean;
  tapped: boolean;
}

const MAX_HISTORY = 100;

export async function addToHistory(
  promptId: string,
  category: NotificationCategory,
): Promise<void> {
  try {
    const key = historyKey();
    const raw = await AsyncStorage.getItem(key);
    const history: StoredNotification[] = raw ? JSON.parse(raw) : [];

    history.unshift({
      promptId,
      category,
      shownAt: new Date().toISOString(),
      dismissed: false,
      tapped: false,
    });

    // Keep only last MAX_HISTORY
    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY;
    }

    await AsyncStorage.setItem(key, JSON.stringify(history));
  } catch {
    // Silent fail
  }
}

export async function getHistory(): Promise<StoredNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(historyKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getUnreadCount(): Promise<number> {
  const history = await getHistory();
  return history.filter((n) => !n.dismissed && !n.tapped).length;
}

export async function markAllHistoryRead(): Promise<void> {
  try {
    const key = historyKey();
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return;
    const history: StoredNotification[] = JSON.parse(raw);
    for (const entry of history) {
      entry.dismissed = true;
    }
    await AsyncStorage.setItem(key, JSON.stringify(history));
  } catch {
    // Silent fail
  }
}

export async function markHistoryDismissed(promptId: string): Promise<void> {
  try {
    const key = historyKey();
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return;
    const history: StoredNotification[] = JSON.parse(raw);
    const entry = history.find((n) => n.promptId === promptId && !n.dismissed);
    if (entry) entry.dismissed = true;
    await AsyncStorage.setItem(key, JSON.stringify(history));
  } catch {
    // Silent fail
  }
}

export async function markHistoryTapped(promptId: string): Promise<void> {
  try {
    const key = historyKey();
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return;
    const history: StoredNotification[] = JSON.parse(raw);
    const entry = history.find((n) => n.promptId === promptId && !n.tapped);
    if (entry) entry.tapped = true;
    await AsyncStorage.setItem(key, JSON.stringify(history));
  } catch {
    // Silent fail
  }
}
