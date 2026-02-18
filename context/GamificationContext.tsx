/**
 * GamificationContext
 * ─────────────────────────────────────────────────────────────
 * Bridges the gamification service into React.
 *
 * Loads user XP / level / streak / badges on mount, and exposes
 * convenience methods that combine:
 *   - Data mutation (XP insert, badge award)
 *   - State refresh (so the UI updates immediately)
 *   - Sound + haptic feedback
 *
 * Usage:
 *   const { gamification, awardXP, streak } = useGamification();
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/services/supabase';
import { SoundHaptics } from '@/services/SoundHapticsService';
import {
  UserGamification,
  XPSource,
  awardXP as serviceAwardXP,
  getUserGamification,
  initializeGamification,
  updateStreak,
  getAllBadges,
  getDailyChallenges,
  completeDailyChallenge as serviceCompleteDailyChallenge,
  checkSpecialTimeBadges,
  calculateLevel,
  levelProgress,
} from '@/services/gamification';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: string;
  icon: string;
  xp_reward: number;
  isUnlocked: boolean;
  earnedAt?: string;
  isNew?: boolean;
}

export interface DailyChallenge {
  id: string;
  challenge_type: string;
  title: string;
  description: string;
  duration: string;
  xp_reward: number;
  isCompleted: boolean;
}

interface XPResult {
  success: boolean;
  xpAwarded: number;
  newLevel?: number;
  leveledUp: boolean;
  previousLevel: number;
}

interface GamificationContextType {
  /** Full gamification state (null until loaded) */
  gamification: UserGamification | null;
  /** All badges (with unlock status) */
  badges: Badge[];
  /** Today's 3 daily challenges */
  dailyChallenges: DailyChallenge[];
  /** Whether initial load is happening */
  loading: boolean;
  /** Current streak info */
  streak: { days: number; isNewDay: boolean } | null;

  // ─── Actions ───────────────────────────────────────────────────────────

  /** Award XP for an action — plays sound + haptic automatically unless silent */
  awardXP: (
    source: XPSource,
    sourceId?: string,
    description?: string,
    options?: { silent?: boolean }
  ) => Promise<XPResult>;

  /** Complete a daily challenge */
  completeChallenge: (
    challengeId: string,
    bonusEarned?: boolean
  ) => Promise<{ success: boolean; xpAwarded: number }>;

  /** Force refresh of gamification data */
  refresh: () => Promise<void>;

  /** Current level progress (0–100) */
  progress: number;
}

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined
);

// ─── Provider ──────────────────────────────────────────────────────────────

export function GamificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [gamification, setGamification] = useState<UserGamification | null>(
    null
  );
  const [badges, setBadges] = useState<Badge[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState<{
    days: number;
    isNewDay: boolean;
  } | null>(null);

  // ─── Load gamification data on user change ─────────────────────────────

  const loadData = useCallback(async () => {
    if (!user) {
      setGamification(null);
      setBadges([]);
      setDailyChallenges([]);
      setStreak(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Initialize if first time
      let gam = await getUserGamification(supabase, user.id);
      if (!gam) {
        await initializeGamification(supabase, user.id);
        gam = await getUserGamification(supabase, user.id);
      }
      setGamification(gam);

      // Update streak
      const streakResult = await updateStreak(supabase, user.id);
      setStreak({
        days: streakResult.streak,
        isNewDay: streakResult.isNewDay,
      });

      // Load badges & challenges in parallel
      const [badgesData, challengesData] = await Promise.all([
        getAllBadges(supabase, user.id),
        getDailyChallenges(supabase, user.id),
      ]);
      setBadges(badgesData);
      setDailyChallenges(challengesData);

      // Check time-based badges (non-blocking)
      checkSpecialTimeBadges(supabase, user.id).catch(() => {});
    } catch (error) {
      console.warn('[GamificationContext] Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Award XP (with sound/haptic) ─────────────────────────────────────

  const awardXPAction = useCallback(
    async (
      source: XPSource,
      sourceId?: string,
      description?: string,
      options?: { silent?: boolean }
    ): Promise<XPResult> => {
      if (!user) {
        return {
          success: false,
          xpAwarded: 0,
          leveledUp: false,
          previousLevel: 0,
        };
      }

      const previousLevel = gamification?.current_level ?? 1;

      const result = await serviceAwardXP(
        supabase,
        user.id,
        source,
        sourceId,
        description
      );

      if (result.success) {
        // Play XP sound + haptic (unless silent mode)
        if (!options?.silent) {
          SoundHaptics.playXPGain();
        }

        // Refresh gamification state
        const updated = await getUserGamification(supabase, user.id);
        setGamification(updated);

        const leveledUp =
          result.newLevel !== undefined && result.newLevel > previousLevel;

        if (leveledUp && !options?.silent) {
          // Level up celebration!
          setTimeout(() => {
            SoundHaptics.playLevelUp();
          }, 600); // Slight delay so XP sound finishes
        }

        return {
          ...result,
          leveledUp,
          previousLevel,
        };
      }

      return {
        ...result,
        leveledUp: false,
        previousLevel,
      };
    },
    [user, gamification]
  );

  // ─── Complete Daily Challenge ──────────────────────────────────────────

  const completeChallengeAction = useCallback(
    async (
      challengeId: string,
      bonusEarned: boolean = false
    ): Promise<{ success: boolean; xpAwarded: number }> => {
      if (!user) return { success: false, xpAwarded: 0 };

      const result = await serviceCompleteDailyChallenge(
        supabase,
        user.id,
        challengeId,
        bonusEarned
      );

      if (result.success) {
        SoundHaptics.playXPGain();

        // Refresh challenges and gamification
        const [updated, challenges] = await Promise.all([
          getUserGamification(supabase, user.id),
          getDailyChallenges(supabase, user.id),
        ]);
        setGamification(updated);
        setDailyChallenges(challenges);
      }

      return result;
    },
    [user]
  );

  // ─── Progress ──────────────────────────────────────────────────────────

  const progress = useMemo(() => {
    if (!gamification) return 0;
    return levelProgress(gamification.total_xp, gamification.current_level);
  }, [gamification]);

  // ─── Context Value ─────────────────────────────────────────────────────

  const value = useMemo(
    () => ({
      gamification,
      badges,
      dailyChallenges,
      loading,
      streak,
      awardXP: awardXPAction,
      completeChallenge: completeChallengeAction,
      refresh: loadData,
      progress,
    }),
    [
      gamification,
      badges,
      dailyChallenges,
      loading,
      streak,
      awardXPAction,
      completeChallengeAction,
      loadData,
      progress,
    ]
  );

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error(
      'useGamification must be used within a GamificationProvider'
    );
  }
  return context;
}
