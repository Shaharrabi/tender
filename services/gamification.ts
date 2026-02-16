/**
 * Gamification Service for Tender App
 * Handles XP, Levels, Badges, Streaks, Daily Challenges
 */

// Types
export type XPSource =
  | 'lesson_complete'
  | 'scenario_complete'
  | 'daily_checkin'
  | 'reflection'
  | 'partner_exercise'
  | 'assessment_complete'
  | 'assessment_retake'
  | 'streak_bonus'
  | 'community_post'
  | 'community_reaction'
  | 'mystery_challenge'
  | 'badge_unlock'
  | 'first_time_bonus'
  | 'weekend_bonus';

export interface UserGamification {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
  current_streak: number;
  longest_streak: number;
  daily_challenges_completed: number;
  scenarios_completed: number;
  last_activity_date: string | null;
  streak_last_checked: string | null;
  leaderboard_opted_in: boolean;
  anonymous_leaderboard_id: string | null;
  created_at: string;
  updated_at: string;
}

// ─── XP Constants ───────────────────────────────────────────────────────────

export const XP_VALUES: Record<XPSource, number> = {
  lesson_complete: 50,
  scenario_complete: 100,
  daily_checkin: 25,
  reflection: 75,
  partner_exercise: 150,
  assessment_complete: 200,
  assessment_retake: 100,
  streak_bonus: 0, // Variable
  community_post: 25,
  community_reaction: 10,
  mystery_challenge: 100,
  badge_unlock: 0, // Variable
  first_time_bonus: 0, // Multiplier
  weekend_bonus: 0, // Multiplier
};

export const LEVEL_THRESHOLDS: number[] = [
  0, 100, 250, 500, 850, 1300, 1850, 2500, 3250, 4100,
  5050, 6100, 7250, 8500, 9850, 11300, 12850, 14500, 16250, 18100,
  20050, 22100, 24250, 26500, 28850, 31300, 33850, 36500, 39250, 42100,
  45050, 48100, 51250, 54500, 57850, 61300, 64850, 68500, 72250, 76100,
  80050, 84100, 88250, 92500, 96850, 101300, 105850, 110500, 115250, 120100,
];

// ─── XP System ──────────────────────────────────────────────────────────────

/**
 * Award XP to a user
 * @param supabase - Supabase client instance
 * @param userId - User's UUID
 * @param source - XP source type
 * @param sourceId - Optional ID of the source (lesson, scenario, etc.)
 * @param customDescription - Optional custom description
 */
export async function awardXP(
  supabase: any,
  userId: string,
  source: XPSource,
  sourceId?: string,
  customDescription?: string
): Promise<{ success: boolean; xpAwarded: number; newLevel?: number; error?: string }> {
  try {
    const baseXP = XP_VALUES[source] || 0;
    const multiplier = await getXPMultiplier(supabase, userId, source);
    const totalXP = Math.round(baseXP * multiplier);

    const description = customDescription || getDefaultDescription(source);

    const { error } = await supabase.from('xp_transactions').insert({
      user_id: userId,
      amount: totalXP,
      source,
      source_id: sourceId,
      multiplier,
      description,
    });

    if (error) throw error;

    // Get updated gamification state
    const gamification = await getUserGamification(supabase, userId);
    
    // Check for badge unlocks
    await checkBadgeUnlocks(supabase, userId, gamification);

    return {
      success: true,
      xpAwarded: totalXP,
      newLevel: gamification?.current_level,
    };
  } catch (error: any) {
    console.error('[Gamification] Error awarding XP:', error);
    return { success: false, xpAwarded: 0, error: error.message };
  }
}

/**
 * Get XP multiplier based on streaks, bonuses, etc.
 */
async function getXPMultiplier(supabase: any, userId: string, source: XPSource): Promise<number> {
  let multiplier = 1.0;

  // Weekend bonus
  const now = new Date();
  const dayOfWeek = now.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    multiplier *= 1.25; // 25% weekend bonus
  }

  // Streak bonus (up to 50% at 5+ day streak)
  const gamification = await getUserGamification(supabase, userId);
  if (gamification?.current_streak) {
    const streakBonus = Math.min(gamification.current_streak * 0.1, 0.5);
    multiplier *= 1 + streakBonus;
  }

  // First-time bonus for certain activities
  if (source === 'assessment_complete' || source === 'scenario_complete') {
    const isFirstTime = await checkFirstTime(supabase, userId, source);
    if (isFirstTime) {
      multiplier *= 1.5; // 50% first-time bonus
    }
  }

  return multiplier;
}

/**
 * Check if this is the user's first time doing an activity
 */
async function checkFirstTime(supabase: any, userId: string, source: XPSource): Promise<boolean> {
  const { data, error } = await supabase
    .from('xp_transactions')
    .select('id')
    .eq('user_id', userId)
    .eq('source', source)
    .limit(1);

  if (error) {
    console.error('[Gamification] Error checking first time:', error);
    return false;
  }

  return !data || data.length === 0;
}

/**
 * Get default description for XP source
 */
function getDefaultDescription(source: XPSource): string {
  const descriptions: Record<XPSource, string> = {
    lesson_complete: 'Completed a lesson',
    scenario_complete: 'Completed a practice scenario',
    daily_checkin: 'Daily check-in',
    reflection: 'Wrote a reflection',
    partner_exercise: 'Completed a partner exercise',
    assessment_complete: 'Completed an assessment',
    assessment_retake: 'Retook an assessment',
    streak_bonus: 'Streak bonus',
    community_post: 'Posted in community',
    community_reaction: 'Received a reaction',
    mystery_challenge: 'Completed a mystery challenge',
    badge_unlock: 'Unlocked a badge',
    first_time_bonus: 'First-time bonus',
    weekend_bonus: 'Weekend bonus',
  };
  return descriptions[source] || 'XP earned';
}

// ─── User Gamification ──────────────────────────────────────────────────────

/**
 * Get user's gamification state
 */
export async function getUserGamification(supabase: any, userId: string): Promise<UserGamification | null> {
  const { data, error } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[Gamification] Error fetching user gamification:', error);
    return null;
  }

  return data;
}

/**
 * Initialize gamification for new user
 */
export async function initializeGamification(supabase: any, userId: string): Promise<boolean> {
  const { error } = await supabase.from('user_gamification').insert({
    user_id: userId,
    total_xp: 0,
    current_level: 1,
    xp_to_next_level: 100,
    current_streak: 0,
    longest_streak: 0,
    daily_challenges_completed: 0,
    scenarios_completed: 0,
    last_activity_date: new Date().toISOString().split('T')[0],
    anonymous_leaderboard_id: generateAnonymousId(),
  });

  if (error && error.code !== '23505') { // Ignore duplicate key errors
    console.error('[Gamification] Error initializing gamification:', error);
    return false;
  }

  return true;
}

/**
 * Generate anonymous ID for leaderboard
 */
function generateAnonymousId(): string {
  const adjectives = ['Brave', 'Kind', 'Wise', 'Calm', 'Bold', 'Warm', 'True', 'Open'];
  const nouns = ['Heart', 'Soul', 'Mind', 'Star', 'Wave', 'Light', 'Path', 'Bond'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`;
}

// ─── Streaks ────────────────────────────────────────────────────────────────

/**
 * Update user's streak
 */
export async function updateStreak(supabase: any, userId: string): Promise<{ 
  success: boolean; 
  streak: number; 
  isNewDay: boolean;
  streakBonusXP?: number;
}> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const gamification = await getUserGamification(supabase, userId);

    if (!gamification) {
      await initializeGamification(supabase, userId);
      return { success: true, streak: 1, isNewDay: true };
    }

    const lastCheck = gamification.streak_last_checked;
    
    // Already checked in today
    if (lastCheck === today) {
      return { success: true, streak: gamification.current_streak, isNewDay: false };
    }

    // Calculate if streak continues or breaks
    let newStreak = 1;
    let streakBonusXP = 0;
    
    if (lastCheck) {
      const lastDate = new Date(lastCheck);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Continue streak
        newStreak = gamification.current_streak + 1;
        
        // Award streak bonus XP at milestones
        if (newStreak === 7) streakBonusXP = 100;
        else if (newStreak === 14) streakBonusXP = 200;
        else if (newStreak === 30) streakBonusXP = 500;
        else if (newStreak === 60) streakBonusXP = 1000;
        else if (newStreak === 90) streakBonusXP = 2000;
        else if (newStreak % 30 === 0) streakBonusXP = 500;
      }
      // else: streak broken, reset to 1
    }

    // Update gamification
    const { error } = await supabase
      .from('user_gamification')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, gamification.longest_streak),
        streak_last_checked: today,
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;

    // Award streak bonus XP if applicable
    if (streakBonusXP > 0) {
      await awardXP(supabase, userId, 'streak_bonus', undefined, `${newStreak}-day streak bonus!`);
    }

    // Check for streak badges
    await checkStreakBadges(supabase, userId, newStreak);

    return { success: true, streak: newStreak, isNewDay: true, streakBonusXP };
  } catch (error: any) {
    console.error('[Gamification] Error updating streak:', error);
    return { success: false, streak: 0, isNewDay: false };
  }
}

/**
 * Check for streak-related badge unlocks
 */
async function checkStreakBadges(supabase: any, userId: string, streak: number): Promise<void> {
  const streakBadges = [
    { id: 'week-warrior', threshold: 7 },
    { id: 'month-master', threshold: 30 },
    { id: 'quarterly-champion', threshold: 90 },
  ];

  for (const badge of streakBadges) {
    if (streak >= badge.threshold) {
      await awardBadge(supabase, userId, badge.id);
    }
  }
}

// ─── Badges ─────────────────────────────────────────────────────────────────

/**
 * Get all badges (including unlocked status for user)
 */
export async function getAllBadges(supabase: any, userId: string): Promise<any[]> {
  const { data: badges, error: badgesError } = await supabase
    .from('badges')
    .select('*');

  if (badgesError) {
    console.error('[Gamification] Error fetching badges:', badgesError);
    return [];
  }

  const { data: userBadges, error: userError } = await supabase
    .from('user_badges')
    .select('badge_id, earned_at, is_new')
    .eq('user_id', userId);

  if (userError) {
    console.error('[Gamification] Error fetching user badges:', userError);
  }

  const userBadgeMap = new Map<string, { earnedAt: string; isNew: boolean }>(
    (userBadges || []).map((ub: any) => [ub.badge_id, { earnedAt: ub.earned_at, isNew: ub.is_new }])
  );

  return (badges || [])
    .filter((badge: any) => !badge.is_hidden || userBadgeMap.has(badge.id))
    .map((badge: any) => ({
      ...badge,
      isUnlocked: userBadgeMap.has(badge.id),
      earnedAt: userBadgeMap.get(badge.id)?.earnedAt,
      isNew: userBadgeMap.get(badge.id)?.isNew,
    }));
}

/**
 * Award a badge to user
 */
export async function awardBadge(supabase: any, userId: string, badgeId: string): Promise<boolean> {
  try {
    // Check if already earned
    const { data: existing } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .single();

    if (existing) return true; // Already has badge

    // Get badge info for XP
    const { data: badge } = await supabase
      .from('badges')
      .select('xp_reward, name')
      .eq('id', badgeId)
      .single();

    // Award badge
    const { error } = await supabase.from('user_badges').insert({
      user_id: userId,
      badge_id: badgeId,
      is_new: true,
    });

    if (error && error.code !== '23505') throw error;

    // Award XP for badge
    if (badge?.xp_reward) {
      await awardXP(supabase, userId, 'badge_unlock', badgeId, `Unlocked badge: ${badge.name}`);
    }

    return true;
  } catch (error: any) {
    console.error('[Gamification] Error awarding badge:', error);
    return false;
  }
}

/**
 * Mark badge as seen (no longer new)
 */
export async function markBadgeSeen(supabase: any, userId: string, badgeId: string): Promise<void> {
  await supabase
    .from('user_badges')
    .update({ is_new: false })
    .eq('user_id', userId)
    .eq('badge_id', badgeId);
}

/**
 * Check for badge unlocks based on user state
 */
async function checkBadgeUnlocks(supabase: any, userId: string, gamification: UserGamification | null): Promise<void> {
  if (!gamification) return;
  // Badge checking is handled by individual actions
}

// ─── Daily Challenges ───────────────────────────────────────────────────────

/**
 * Get today's challenges for user
 */
export async function getDailyChallenges(supabase: any, userId: string): Promise<any[]> {
  const today = new Date().toISOString().split('T')[0];

  // Get all active challenges
  const { data: challenges, error: challengesError } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('is_active', true);

  if (challengesError) {
    console.error('[Gamification] Error fetching challenges:', challengesError);
    return [];
  }

  // Get user's completed challenges for today
  const { data: userChallenges, error: userError } = await supabase
    .from('user_daily_challenges')
    .select('challenge_id, completed_at')
    .eq('user_id', userId)
    .eq('date_assigned', today);

  if (userError) {
    console.error('[Gamification] Error fetching user challenges:', userError);
  }

  const completedMap = new Map(
    (userChallenges || []).map((uc: any) => [uc.challenge_id, uc.completed_at])
  );

  // Select 3 random challenges for today (seeded by date + userId for consistency)
  const seed = hashCode(today + userId);
  const shuffled = shuffleWithSeed(challenges || [], seed);
  const dailySelection = shuffled.slice(0, 3);

  return dailySelection.map((challenge: any) => ({
    ...challenge,
    isCompleted: completedMap.has(challenge.id),
  }));
}

/**
 * Complete a daily challenge
 */
export async function completeDailyChallenge(
  supabase: any,
  userId: string,
  challengeId: string,
  bonusEarned: boolean = false
): Promise<{ success: boolean; xpAwarded: number }> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get challenge info
    const { data: challenge } = await supabase
      .from('daily_challenges')
      .select('xp_reward, bonus_xp, title')
      .eq('id', challengeId)
      .single();

    if (!challenge) throw new Error('Challenge not found');

    const xpAwarded = challenge.xp_reward + (bonusEarned ? (challenge.bonus_xp || 0) : 0);

    // Record completion
    const { error } = await supabase.from('user_daily_challenges').upsert({
      user_id: userId,
      challenge_id: challengeId,
      date_assigned: today,
      completed_at: new Date().toISOString(),
      bonus_earned: bonusEarned,
      xp_awarded: xpAwarded,
    }, {
      onConflict: 'user_id,challenge_id,date_assigned',
    });

    if (error) throw error;

    // Award XP
    await awardXP(supabase, userId, 'lesson_complete', challengeId, `Completed challenge: ${challenge.title}`);

    return { success: true, xpAwarded };
  } catch (error: any) {
    console.error('[Gamification] Error completing challenge:', error);
    return { success: false, xpAwarded: 0 };
  }
}

// ─── Scenario Completion ────────────────────────────────────────────────────

/**
 * Record scenario completion and award XP
 */
export async function completeScenario(
  supabase: any,
  userId: string,
  scenarioId: string,
  outcomeId: string,
  xpTotal: number
): Promise<boolean> {
  try {
    // Award XP
    await awardXP(supabase, userId, 'scenario_complete', scenarioId, `Completed scenario: ${scenarioId}`);

    // Get current count
    const gamification = await getUserGamification(supabase, userId);
    const newCount = (gamification?.scenarios_completed || 0) + 1;

    // Update scenarios count
    const { error } = await supabase
      .from('user_gamification')
      .update({
        scenarios_completed: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;

    // Check for scenario badges
    if (newCount === 1) {
      await awardBadge(supabase, userId, 'first-steps');
    } else if (newCount === 25) {
      await awardBadge(supabase, userId, 'practice-makes-progress');
    } else if (newCount === 100) {
      await awardBadge(supabase, userId, 'simulation-sensei');
    }

    return true;
  } catch (error: any) {
    console.error('[Gamification] Error completing scenario:', error);
    return false;
  }
}

// ─── Leaderboard ────────────────────────────────────────────────────────────

/**
 * Get weekly leaderboard (privacy-safe)
 */
export async function getWeeklyLeaderboard(
  supabase: any,
  userId: string,
  limit: number = 10
): Promise<{ entries: any[]; userRank?: number }> {
  try {
    // Get top users by XP earned this week
    const weekStart = getWeekStart();
    
    const { data: topUsers, error } = await supabase
      .from('xp_transactions')
      .select('user_id, amount')
      .gte('created_at', weekStart.toISOString());

    if (error) throw error;

    // Aggregate XP by user
    const userXPMap = new Map<string, number>();
    for (const tx of topUsers || []) {
      userXPMap.set(tx.user_id, (userXPMap.get(tx.user_id) || 0) + tx.amount);
    }

    // Sort and rank
    const sorted = Array.from(userXPMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    // Get anonymous IDs
    const userIds = sorted.map(([id]) => id);
    const { data: gamifications } = await supabase
      .from('user_gamification')
      .select('user_id, anonymous_leaderboard_id, current_level, current_streak')
      .in('user_id', userIds)
      .eq('leaderboard_opted_in', true);

    const gamificationMap = new Map<string, any>(
      (gamifications || []).map((g: any) => [g.user_id, g])
    );

    const entries = sorted.map(([id, xp], index) => {
      const gam = gamificationMap.get(id);
      return {
        rank: index + 1,
        anonymousId: gam?.anonymous_leaderboard_id || 'Hidden',
        level: gam?.current_level || 1,
        xpThisWeek: xp,
        streakDays: gam?.current_streak || 0,
        isCurrentUser: id === userId,
      };
    });

    const userRank = entries.findIndex(e => e.isCurrentUser) + 1;

    return { entries, userRank: userRank > 0 ? userRank : undefined };
  } catch (error: any) {
    console.error('[Gamification] Error fetching leaderboard:', error);
    return { entries: [] };
  }
}

/**
 * Toggle leaderboard opt-in
 */
export async function toggleLeaderboardOptIn(supabase: any, userId: string, optIn: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_gamification')
      .update({
        leaderboard_opted_in: optIn,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('[Gamification] Error toggling leaderboard opt-in:', error);
    return false;
  }
}

// ─── Special Time-Based Badges ──────────────────────────────────────────────

/**
 * Check for special time-based badges
 */
export async function checkSpecialTimeBadges(supabase: any, userId: string): Promise<void> {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Night Owl - after midnight, before 4am
  if (hour >= 0 && hour < 4) {
    await awardBadge(supabase, userId, 'night-owl');
  }

  // Early Bird - before 6am
  if (hour >= 4 && hour < 6) {
    await awardBadge(supabase, userId, 'early-bird');
  }

  // Valentine's Day
  if (month === 2 && day === 14) {
    await awardBadge(supabase, userId, 'valentines-lover');
  }
}

// ─── Utility Functions ──────────────────────────────────────────────────────

/**
 * Simple hash function for seeding random
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Shuffle array with seed for deterministic results
 */
function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentIndex = result.length;
  let randomValue = seed;

  while (currentIndex > 0) {
    randomValue = (randomValue * 1103515245 + 12345) & 0x7fffffff;
    const randomIndex = randomValue % currentIndex;
    currentIndex--;
    [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
  }

  return result;
}

/**
 * Get start of current week (Monday)
 */
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Calculate XP needed for next level
 */
export function xpToNextLevel(currentXP: number, currentLevel: number): number {
  if (currentLevel >= 50) return 0;
  return LEVEL_THRESHOLDS[currentLevel] - currentXP;
}

/**
 * Get progress percentage to next level
 */
export function levelProgress(currentXP: number, currentLevel: number): number {
  if (currentLevel >= 50) return 100;
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1];
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel];
  const progress = ((currentXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}
