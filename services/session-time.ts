/**
 * Session Time Tracker
 * ────────────────────────────────────────────────────────────
 * Tracks cumulative time the user spends in the app.
 * Uses AsyncStorage for persistence (no DB needed — this is device-local).
 *
 * Call `startSession()` when app enters foreground.
 * Call `endSession()` when app goes to background.
 * Call `getTotalTimeMinutes()` to read cumulative time.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'tender_total_session_ms';
const SESSION_START_KEY = 'tender_session_start';

/** Mark the start of a session (app enters foreground). */
export async function startSession(): Promise<void> {
  await AsyncStorage.setItem(SESSION_START_KEY, Date.now().toString());
}

/** Mark the end of a session (app goes to background). Adds elapsed time. */
export async function endSession(): Promise<void> {
  try {
    const startStr = await AsyncStorage.getItem(SESSION_START_KEY);
    if (!startStr) return;

    const elapsed = Date.now() - parseInt(startStr, 10);
    // Ignore sessions > 4 hours (likely forgot to close) or < 1 second
    if (elapsed < 1000 || elapsed > 4 * 60 * 60 * 1000) {
      await AsyncStorage.removeItem(SESSION_START_KEY);
      return;
    }

    const existingStr = await AsyncStorage.getItem(STORAGE_KEY);
    const existing = existingStr ? parseInt(existingStr, 10) : 0;
    await AsyncStorage.setItem(STORAGE_KEY, (existing + elapsed).toString());

    // Also track today's time
    const todayKey = `tender_session_today_${new Date().toISOString().slice(0, 10)}`;
    const todayStr = await AsyncStorage.getItem(todayKey);
    const todayTotal = todayStr ? parseInt(todayStr, 10) : 0;
    await AsyncStorage.setItem(todayKey, (todayTotal + elapsed).toString());

    await AsyncStorage.removeItem(SESSION_START_KEY);
  } catch {
    // Silently fail — time tracking is best-effort
  }
}

/** Get total cumulative time in minutes (includes current active session). */
export async function getTotalTimeMinutes(): Promise<number> {
  try {
    const storedStr = await AsyncStorage.getItem(STORAGE_KEY);
    const stored = storedStr ? parseInt(storedStr, 10) : 0;

    // Add current session if one is active
    const startStr = await AsyncStorage.getItem(SESSION_START_KEY);
    const currentSession = startStr ? Date.now() - parseInt(startStr, 10) : 0;

    return Math.floor((stored + currentSession) / 60_000);
  } catch {
    return 0;
  }
}

/** Get today's session time in minutes only. */
export async function getTodayTimeMinutes(): Promise<number> {
  try {
    const todayKey = `tender_session_today_${new Date().toISOString().slice(0, 10)}`;
    const storedStr = await AsyncStorage.getItem(todayKey);
    const stored = storedStr ? parseInt(storedStr, 10) : 0;

    // Add current session if active
    const startStr = await AsyncStorage.getItem(SESSION_START_KEY);
    const currentSession = startStr ? Date.now() - parseInt(startStr, 10) : 0;

    return Math.floor((stored + currentSession) / 60_000);
  } catch {
    return 0;
  }
}

/** Format minutes into a human-friendly string. */
export function formatTimeSpent(totalMinutes: number): string {
  if (totalMinutes < 1) return 'Just started';
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours < 24) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainHours = hours % 24;
  return remainHours > 0 ? `${days}d ${remainHours}h` : `${days}d`;
}
