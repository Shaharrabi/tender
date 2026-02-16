import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Constants ──────────────────────────────────────────
const GUEST_MODE_KEY = 'guest_mode';
const GUEST_SCORE_PREFIX = 'guest_scores_';

// ─── Types ──────────────────────────────────────────────
interface GuestContextType {
  isGuest: boolean;
  setGuestMode: (on: boolean) => Promise<void>;
  guestScores: Record<string, any>;
  saveGuestScore: (type: string, scores: any) => Promise<void>;
  clearGuestData: () => Promise<void>;
  getGuestCompletedTypes: () => string[];
}

// ─── Context ────────────────────────────────────────────
const GuestContext = createContext<GuestContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────
export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);
  const [guestScores, setGuestScores] = useState<Record<string, any>>({});

  // Hydrate guest mode flag and any persisted scores on mount
  // Wrapped in a timeout so Safari/private-browsing AsyncStorage stalls
  // don't block the app indefinitely.
  useEffect(() => {
    const hydrate = async () => {
      try {
        const timeoutGuard = new Promise<void>((resolve) => setTimeout(resolve, 2000));
        const load = async () => {
          const stored = await AsyncStorage.getItem(GUEST_MODE_KEY);
          if (stored === 'true') {
            setIsGuest(true);
            await loadAllScores();
          }
        };
        await Promise.race([load(), timeoutGuard]);
      } catch {
        // Storage unavailable — stay non-guest
      }
    };
    hydrate();
  }, []);

  // Load all guest_scores_* keys from AsyncStorage into state
  const loadAllScores = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const scoreKeys = allKeys.filter((k) => k.startsWith(GUEST_SCORE_PREFIX));
      if (scoreKeys.length === 0) return;

      const pairs = await AsyncStorage.multiGet(scoreKeys);
      const scores: Record<string, any> = {};
      for (const [key, value] of pairs) {
        if (value) {
          const type = key.replace(GUEST_SCORE_PREFIX, '');
          scores[type] = JSON.parse(value);
        }
      }
      setGuestScores(scores);
    } catch {
      // Silently fail — scores will be empty
    }
  };

  // Toggle guest mode on/off and persist the flag
  const setGuestMode = useCallback(async (on: boolean): Promise<void> => {
    setIsGuest(on);
    await AsyncStorage.setItem(GUEST_MODE_KEY, on ? 'true' : 'false').catch(() => {});
  }, []);

  // Save a single assessment score by type
  const saveGuestScore = useCallback(async (type: string, scores: any) => {
    const key = `${GUEST_SCORE_PREFIX}${type}`;
    const serialized = JSON.stringify(scores);
    await AsyncStorage.setItem(key, serialized);
    setGuestScores((prev) => ({ ...prev, [type]: scores }));
  }, []);

  // Wipe all guest data (scores + mode flag)
  const clearGuestData = useCallback(async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const guestKeys = allKeys.filter(
        (k) => k.startsWith(GUEST_SCORE_PREFIX) || k === GUEST_MODE_KEY,
      );
      if (guestKeys.length > 0) {
        await AsyncStorage.multiRemove(guestKeys);
      }
    } catch {
      // Best-effort removal
    }
    setGuestScores({});
    setIsGuest(false);
  }, []);

  // Derive which assessment types have been completed
  const getGuestCompletedTypes = useCallback(() => {
    return Object.keys(guestScores);
  }, [guestScores]);

  return (
    <GuestContext.Provider
      value={{
        isGuest,
        setGuestMode,
        guestScores,
        saveGuestScore,
        clearGuestData,
        getGuestCompletedTypes,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────
export function useGuest() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
}
