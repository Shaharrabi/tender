/**
 * Couple Micro-Rituals — 10 daily 30-second rituals keyed to cycle dynamic.
 *
 * Each couple gets:
 *   - 2 universal rituals (every couple)
 *   - 2-3 cycle-specific rituals based on combinedCycle.dynamic
 *
 * Selection rotates by day-of-year so the couple sees a fresh ritual daily.
 *
 * Cycle dynamics (from DeepCouplePortrait.patternInterlock.combinedCycle.dynamic):
 *   - pursue-withdraw
 *   - mutual-pursuit
 *   - mutual-withdrawal
 *   - mixed-switching
 */

import type { CycleDynamic } from '@/types/couples';

// ─── Types ──────────────────────────────────────────────

export interface MicroRitual {
  id: string;
  title: string;
  /** Short instruction — one paragraph, 30-second read */
  instruction: string;
  /** Which cycle dynamics this ritual is for (empty = universal) */
  forDynamics: CycleDynamic[];
  /** Whether this is a universal ritual (shown to all couples) */
  universal: boolean;
}

export interface DailyRitualResult {
  ritual: MicroRitual;
  /** Whether the ritual is cycle-specific or universal */
  isUniversal: boolean;
}

// ─── Ritual Content ─────────────────────────────────────

const MICRO_RITUALS: MicroRitual[] = [
  // ── Universal (every couple gets these) ─────────────
  {
    id: 'MR-1',
    title: 'The One-Sentence Check-In',
    instruction:
      'Tonight before sleep, each person says one sentence: \u201CToday I felt closest to you when ___.\u201D No response required. Just receiving.',
    forDynamics: [],
    universal: true,
  },
  {
    id: 'MR-2',
    title: 'The 6-Second Kiss',
    instruction:
      'Gottman research: a 6-second kiss is long enough to feel something real. Once per day. Before parting or upon reunion. Not a peck. A deliberate pause.',
    forDynamics: [],
    universal: true,
  },

  // ── Pursue-Withdraw ─────────────────────────────────
  {
    id: 'MR-3',
    title: 'The Pursuer\u2019s Gift',
    instruction:
      'The pursuer gives their partner 30 minutes of unasked-for space today. No text. No check-in. Just space. Afterward: \u201CI gave you space today because I know you need it. I am still here.\u201D',
    forDynamics: ['pursue-withdraw'],
    universal: false,
  },
  {
    id: 'MR-4',
    title: 'The Withdrawer\u2019s Gift',
    instruction:
      'The withdrawer initiates ONE moment of connection today that they would normally skip. A question. A touch. A \u201Chow are you.\u201D Unsolicited. Afterward: notice what happens in your partner\u2019s face.',
    forDynamics: ['pursue-withdraw'],
    universal: false,
  },

  // ── Mutual Pursuit ──────────────────────────────────
  {
    id: 'MR-5',
    title: 'The Listening Round',
    instruction:
      'Set a timer for 3 minutes. One person talks. The other ONLY listens. Then switch. No interrupting. No rebutting. Just hearing. The rule: you cannot respond to what they said until tomorrow.',
    forDynamics: ['mutual-pursuit'],
    universal: false,
  },
  {
    id: 'MR-6',
    title: 'The Anchor Volunteer',
    instruction:
      'When both of you are activated at the same time, one person says: \u201CI will be the steady one for the next 10 minutes.\u201D Not a permanent role. A temporary gift.',
    forDynamics: ['mutual-pursuit'],
    universal: false,
  },

  // ── Mutual Withdrawal ───────────────────────────────
  {
    id: 'MR-7',
    title: 'The Brave Sentence',
    instruction:
      'Each person says one real thing today. Not logistical. Emotional. \u201CI felt lonely this afternoon.\u201D \u201CI was proud of you today.\u201D \u201CI noticed I missed you.\u201D One sentence. Every day.',
    forDynamics: ['mutual-withdrawal'],
    universal: false,
  },
  {
    id: 'MR-8',
    title: 'The Hand Hold',
    instruction:
      'During a moment of silence \u2014 which will happen often between two withdrawers \u2014 one partner reaches for the other\u2019s hand. No words required. Just the reach.',
    forDynamics: ['mutual-withdrawal'],
    universal: false,
  },

  // ── Mixed-Switching ─────────────────────────────────
  {
    id: 'MR-9',
    title: 'The Chair Check',
    instruction:
      'Once per day, each partner says: \u201CRight now, I am in the [pursuing/withdrawing] position.\u201D Not during conflict. Just as a check-in. Builds the naming muscle for when it matters.',
    forDynamics: ['mixed-switching'],
    universal: false,
  },
  {
    id: 'MR-10',
    title: 'The Swap Practice',
    instruction:
      'Once this week, consciously swap your usual position. If you usually pursue a topic, let it go. If you usually withdraw from a topic, bring it up. Notice what happens \u2014 in your body and in the field between you.',
    forDynamics: ['mixed-switching'],
    universal: false,
  },
];

// ─── Day-of-Year Helper ─────────────────────────────────

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ─── Selection Logic ────────────────────────────────────

/**
 * Get the pool of rituals available for this couple's dynamic.
 * Returns universal rituals + cycle-specific rituals.
 */
export function getRitualsForDynamic(dynamic: CycleDynamic | null): MicroRitual[] {
  const universal = MICRO_RITUALS.filter((r) => r.universal);
  if (!dynamic) return universal;

  const specific = MICRO_RITUALS.filter(
    (r) => !r.universal && r.forDynamics.includes(dynamic)
  );

  return [...universal, ...specific];
}

/**
 * Select today's micro-ritual based on couple's cycle dynamic.
 *
 * Rotates through the available pool by day-of-year.
 *
 * @param dynamic   The couple's CycleDynamic (from combinedCycle.dynamic)
 * @param date      The date to select for (defaults to today)
 * @returns         DailyRitualResult, or null if no rituals available
 */
export function selectDailyRitual(
  dynamic: CycleDynamic | null,
  date: Date = new Date()
): DailyRitualResult | null {
  const pool = getRitualsForDynamic(dynamic);
  if (pool.length === 0) return null;

  const doy = dayOfYear(date);
  const index = doy % pool.length;
  const ritual = pool[index];

  return {
    ritual,
    isUniversal: ritual.universal,
  };
}

/**
 * Get all rituals (for testing/debug).
 */
export function getAllRituals(): MicroRitual[] {
  return [...MICRO_RITUALS];
}

/**
 * Get a ritual by ID.
 */
export function getRitualById(id: string): MicroRitual | undefined {
  return MICRO_RITUALS.find((r) => r.id === id);
}
