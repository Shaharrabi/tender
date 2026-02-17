/**
 * FirstTimeContext — First-Time User Experience (FTUE) state management.
 *
 * Tracks which highlights, tooltips, audio welcomes, and tours a user
 * has already seen. Persisted to AsyncStorage with user-scoped keys.
 *
 * Follows the GamificationContext pattern:
 *   createContext<T | undefined>, useCallback actions, useMemo value.
 *
 * Usage:
 *   const { state, markTooltipSeen } = useFirstTime();
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface FirstTimeState {
  /** Highlight IDs that have been shown */
  seenHighlights: string[];
  /** Tooltip IDs that have been dismissed */
  seenTooltips: string[];
  /** Screen keys where welcome audio has played */
  heardAudios: string[];
  /** Tour IDs that have been completed or skipped */
  completedTours: string[];
  /** True until the user completes or skips the home guided tour */
  isFirstLaunch: boolean;
}

interface FirstTimeContextType {
  /** Current FTUE state */
  state: FirstTimeState;
  /** Whether initial load is happening */
  loading: boolean;

  // ─── Actions ───────────────────────────────────────────────────────────

  /** Mark a highlight animation as seen (never replay) */
  markHighlightSeen: (highlightId: string) => void;
  /** Mark a tooltip as dismissed */
  markTooltipSeen: (tooltipId: string) => void;
  /** Mark a welcome audio as heard */
  markAudioHeard: (screenKey: string) => void;
  /** Mark a guided tour as completed or skipped */
  markTourCompleted: (tourId: string) => void;
  /** Mark first launch as complete */
  markFirstLaunchComplete: () => void;

  /** Reset all FTUE state (for testing/debugging) */
  resetAll: () => Promise<void>;
}

const DEFAULT_STATE: FirstTimeState = {
  seenHighlights: [],
  seenTooltips: [],
  heardAudios: [],
  completedTours: [],
  isFirstLaunch: true,
};

const FirstTimeContext = createContext<FirstTimeContextType | undefined>(
  undefined
);

// ─── Storage Keys ─────────────────────────────────────────────────────────

const STORAGE_PREFIX = '@ftue_';
const getKeys = (userId: string) => ({
  highlights: `${STORAGE_PREFIX}highlights_${userId}`,
  tooltips: `${STORAGE_PREFIX}tooltips_${userId}`,
  audios: `${STORAGE_PREFIX}audios_${userId}`,
  tours: `${STORAGE_PREFIX}tours_${userId}`,
  firstLaunch: `${STORAGE_PREFIX}first_launch_${userId}`,
});

// ─── Provider ──────────────────────────────────────────────────────────────

export function FirstTimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [state, setState] = useState<FirstTimeState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  // ─── Load persisted state on user change ─────────────────────────────

  const loadData = useCallback(async () => {
    if (!user) {
      setState(DEFAULT_STATE);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const keys = getKeys(user.id);

      const [highlights, tooltips, audios, tours, firstLaunch] =
        await Promise.all([
          AsyncStorage.getItem(keys.highlights),
          AsyncStorage.getItem(keys.tooltips),
          AsyncStorage.getItem(keys.audios),
          AsyncStorage.getItem(keys.tours),
          AsyncStorage.getItem(keys.firstLaunch),
        ]);

      setState({
        seenHighlights: highlights ? JSON.parse(highlights) : [],
        seenTooltips: tooltips ? JSON.parse(tooltips) : [],
        heardAudios: audios ? JSON.parse(audios) : [],
        completedTours: tours ? JSON.parse(tours) : [],
        isFirstLaunch: firstLaunch === null ? true : JSON.parse(firstLaunch),
      });
    } catch (error) {
      console.warn('[FirstTimeContext] Error loading data:', error);
      setState(DEFAULT_STATE);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Persistence helpers ─────────────────────────────────────────────

  const persistArray = useCallback(
    (key: string, arr: string[]) => {
      AsyncStorage.setItem(key, JSON.stringify(arr)).catch((e) =>
        console.warn('[FirstTimeContext] Persist error:', e)
      );
    },
    []
  );

  const persistValue = useCallback(
    (key: string, value: any) => {
      AsyncStorage.setItem(key, JSON.stringify(value)).catch((e) =>
        console.warn('[FirstTimeContext] Persist error:', e)
      );
    },
    []
  );

  // ─── Actions ─────────────────────────────────────────────────────────

  const markHighlightSeen = useCallback(
    (highlightId: string) => {
      if (!user) return;
      setState((prev) => {
        if (prev.seenHighlights.includes(highlightId)) return prev;
        const updated = [...prev.seenHighlights, highlightId];
        persistArray(getKeys(user.id).highlights, updated);
        return { ...prev, seenHighlights: updated };
      });
    },
    [user, persistArray]
  );

  const markTooltipSeen = useCallback(
    (tooltipId: string) => {
      if (!user) return;
      setState((prev) => {
        if (prev.seenTooltips.includes(tooltipId)) return prev;
        const updated = [...prev.seenTooltips, tooltipId];
        persistArray(getKeys(user.id).tooltips, updated);
        return { ...prev, seenTooltips: updated };
      });
    },
    [user, persistArray]
  );

  const markAudioHeard = useCallback(
    (screenKey: string) => {
      if (!user) return;
      setState((prev) => {
        if (prev.heardAudios.includes(screenKey)) return prev;
        const updated = [...prev.heardAudios, screenKey];
        persistArray(getKeys(user.id).audios, updated);
        return { ...prev, heardAudios: updated };
      });
    },
    [user, persistArray]
  );

  const markTourCompleted = useCallback(
    (tourId: string) => {
      if (!user) return;
      setState((prev) => {
        if (prev.completedTours.includes(tourId)) return prev;
        const updated = [...prev.completedTours, tourId];
        persistArray(getKeys(user.id).tours, updated);
        return { ...prev, completedTours: updated };
      });
    },
    [user, persistArray]
  );

  const markFirstLaunchComplete = useCallback(() => {
    if (!user) return;
    setState((prev) => {
      if (!prev.isFirstLaunch) return prev;
      persistValue(getKeys(user.id).firstLaunch, false);
      return { ...prev, isFirstLaunch: false };
    });
  }, [user, persistValue]);

  // ─── Reset (for testing) ─────────────────────────────────────────────

  const resetAll = useCallback(async () => {
    if (!user) return;
    const keys = getKeys(user.id);
    await Promise.all([
      AsyncStorage.removeItem(keys.highlights),
      AsyncStorage.removeItem(keys.tooltips),
      AsyncStorage.removeItem(keys.audios),
      AsyncStorage.removeItem(keys.tours),
      AsyncStorage.removeItem(keys.firstLaunch),
    ]);
    setState(DEFAULT_STATE);
  }, [user]);

  // ─── Context Value ───────────────────────────────────────────────────

  const value = useMemo(
    () => ({
      state,
      loading,
      markHighlightSeen,
      markTooltipSeen,
      markAudioHeard,
      markTourCompleted,
      markFirstLaunchComplete,
      resetAll,
    }),
    [
      state,
      loading,
      markHighlightSeen,
      markTooltipSeen,
      markAudioHeard,
      markTourCompleted,
      markFirstLaunchComplete,
      resetAll,
    ]
  );

  return (
    <FirstTimeContext.Provider value={value}>
      {children}
    </FirstTimeContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useFirstTime() {
  const context = useContext(FirstTimeContext);
  if (context === undefined) {
    throw new Error(
      'useFirstTime must be used within a FirstTimeProvider'
    );
  }
  return context;
}
