/**
 * FirstTimeContext — First-Time User Experience (FTUE) state management.
 *
 * Tracks which highlights, tooltips, audio welcomes, and tours a user
 * has already seen. Persisted to AsyncStorage with user-scoped keys.
 * Works for both authenticated users AND guests.
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

  /** Mark all known tooltips as seen (for returning users after storage wipe) */
  markAllTooltipsSeen: (tooltipIds: string[]) => void;
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
/** Global (non-scoped) key for tour completion — survives guest-to-user transitions */
const GLOBAL_TOUR_KEY = `${STORAGE_PREFIX}tours_global`;
const GLOBAL_FIRST_LAUNCH_KEY = `${STORAGE_PREFIX}first_launch_global`;
const getKeys = (scopeId: string) => ({
  highlights: `${STORAGE_PREFIX}highlights_${scopeId}`,
  tooltips: `${STORAGE_PREFIX}tooltips_${scopeId}`,
  audios: `${STORAGE_PREFIX}audios_${scopeId}`,
  tours: `${STORAGE_PREFIX}tours_${scopeId}`,
  firstLaunch: `${STORAGE_PREFIX}first_launch_${scopeId}`,
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

  // Use user.id if authenticated, or 'guest' for guest mode
  const scopeId = user?.id ?? 'guest';

  // Track previous scope to detect guest→user transitions.
  // Keep loading=true while the scope is still 'guest' (auth resolving)
  // to prevent stale guest defaults from triggering the tour.
  const prevScopeRef = React.useRef<string>(scopeId);

  // ─── Load persisted state ──────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const keys = getKeys(scopeId);

      const [highlights, tooltips, audios, tours, firstLaunch, globalTours, globalFirstLaunch] =
        await Promise.all([
          AsyncStorage.getItem(keys.highlights),
          AsyncStorage.getItem(keys.tooltips),
          AsyncStorage.getItem(keys.audios),
          AsyncStorage.getItem(keys.tours),
          AsyncStorage.getItem(keys.firstLaunch),
          AsyncStorage.getItem(GLOBAL_TOUR_KEY),
          AsyncStorage.getItem(GLOBAL_FIRST_LAUNCH_KEY),
        ]);

      // Merge scoped and global tour completions so tours completed as
      // guest are recognized after the user authenticates (scope change).
      const scopedTours: string[] = tours ? JSON.parse(tours) : [];
      const globalToursArr: string[] = globalTours ? JSON.parse(globalTours) : [];
      const mergedTours = Array.from(new Set([...scopedTours, ...globalToursArr]));

      // isFirstLaunch is false if EITHER scoped or global says false
      const scopedFirst = firstLaunch === null ? true : JSON.parse(firstLaunch);
      const globalFirst = globalFirstLaunch === null ? true : JSON.parse(globalFirstLaunch);
      const isFirst = scopedFirst && globalFirst;

      setState({
        seenHighlights: highlights ? JSON.parse(highlights) : [],
        seenTooltips: tooltips ? JSON.parse(tooltips) : [],
        heardAudios: audios ? JSON.parse(audios) : [],
        completedTours: mergedTours,
        isFirstLaunch: isFirst,
      });
    } catch (error) {
      console.warn('[FirstTimeContext] Error loading data:', error);
      setState(DEFAULT_STATE);
    } finally {
      // Only clear loading if we're in the user-scoped state
      // (i.e., don't clear loading for 'guest' if the user is about to auth)
      prevScopeRef.current = scopeId;
      setLoading(false);
    }
  }, [scopeId]);

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
      setState((prev) => {
        if (prev.seenHighlights.includes(highlightId)) return prev;
        const updated = [...prev.seenHighlights, highlightId];
        persistArray(getKeys(scopeId).highlights, updated);
        return { ...prev, seenHighlights: updated };
      });
    },
    [scopeId, persistArray]
  );

  const markTooltipSeen = useCallback(
    (tooltipId: string) => {
      setState((prev) => {
        if (prev.seenTooltips.includes(tooltipId)) return prev;
        const updated = [...prev.seenTooltips, tooltipId];
        persistArray(getKeys(scopeId).tooltips, updated);
        return { ...prev, seenTooltips: updated };
      });
    },
    [scopeId, persistArray]
  );

  const markAudioHeard = useCallback(
    (screenKey: string) => {
      setState((prev) => {
        if (prev.heardAudios.includes(screenKey)) return prev;
        const updated = [...prev.heardAudios, screenKey];
        persistArray(getKeys(scopeId).audios, updated);
        return { ...prev, heardAudios: updated };
      });
    },
    [scopeId, persistArray]
  );

  const markTourCompleted = useCallback(
    (tourId: string) => {
      setState((prev) => {
        if (prev.completedTours.includes(tourId)) return prev;
        const updated = [...prev.completedTours, tourId];
        persistArray(getKeys(scopeId).tours, updated);
        // Also persist to global (non-scoped) key so the tour stays
        // dismissed across guest-to-user transitions and storage resets.
        persistArray(GLOBAL_TOUR_KEY, updated);
        return { ...prev, completedTours: updated };
      });
    },
    [scopeId, persistArray]
  );

  const markFirstLaunchComplete = useCallback(() => {
    setState((prev) => {
      if (!prev.isFirstLaunch) return prev;
      persistValue(getKeys(scopeId).firstLaunch, false);
      // Also persist globally so first-launch stays false after scope changes
      persistValue(GLOBAL_FIRST_LAUNCH_KEY, false);
      return { ...prev, isFirstLaunch: false };
    });
  }, [scopeId, persistValue]);

  // ─── Bulk mark all tooltips seen (returning users after storage wipe) ──

  const markAllTooltipsSeen = useCallback(
    (tooltipIds: string[]) => {
      setState((prev) => {
        const merged = Array.from(new Set([...prev.seenTooltips, ...tooltipIds]));
        if (merged.length === prev.seenTooltips.length) return prev;
        persistArray(getKeys(scopeId).tooltips, merged);
        return { ...prev, seenTooltips: merged };
      });
    },
    [scopeId, persistArray]
  );

  // ─── Reset (for testing) ─────────────────────────────────────────────

  const resetAll = useCallback(async () => {
    const keys = getKeys(scopeId);
    await Promise.all([
      AsyncStorage.removeItem(keys.highlights),
      AsyncStorage.removeItem(keys.tooltips),
      AsyncStorage.removeItem(keys.audios),
      AsyncStorage.removeItem(keys.tours),
      AsyncStorage.removeItem(keys.firstLaunch),
    ]);
    setState(DEFAULT_STATE);
  }, [scopeId]);

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
      markAllTooltipsSeen,
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
      markAllTooltipsSeen,
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
