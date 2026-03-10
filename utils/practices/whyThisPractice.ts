/**
 * "Why This Practice" — Personalized sentence generator.
 *
 * Takes portrait data + exercise metadata and returns a single
 * personalized sentence explaining why this practice was recommended.
 *
 * Template: "This practice was chosen because your portrait shows
 *            {pattern_description}. {practice_connection}."
 *
 * Matching priority:
 *   1. Cycle position + exercise category
 *   2. Window width + exercise category
 *   3. Attachment anxiety/avoidance + exercise category
 *   4. Composite score thresholds (differentiation, EQ, etc.)
 *   5. Detected patterns (accommodate-to-connect, regulation bottleneck)
 *   6. Generic fallback by category
 */

import type { IndividualPortrait } from '@/types/portrait';
import type { Intervention, InterventionCategory } from '@/types/intervention';

// ─── Template Entries ───────────────────────────────────

interface WhyTemplate {
  /** Check function — returns true if this template applies */
  match: (portrait: IndividualPortrait, exercise: Intervention) => boolean;
  /** The sentence to display */
  sentence: string;
  /** Priority — higher number = checked first */
  priority: number;
}

const TEMPLATES: WhyTemplate[] = [
  // ── Cycle position matches ────────────────────────────
  {
    match: (p, e) =>
      p.negativeCycle?.position === 'pursuer' &&
      e.category === 'regulation',
    sentence:
      'This practice was chosen because your portrait shows a pursuer pattern \u2014 you move toward connection under stress. This builds the pause between the impulse and the reach, so it lands with clarity instead of urgency.',
    priority: 10,
  },
  {
    match: (p, e) =>
      p.negativeCycle?.position === 'withdrawer' &&
      (e.category === 'communication' || e.category === 'attachment'),
    sentence:
      'This practice was chosen because your portrait shows a withdrawer pattern \u2014 you move toward space under stress. This builds the bridge back, so your partner knows the silence is processing, not abandonment.',
    priority: 10,
  },
  {
    match: (p, e) =>
      p.negativeCycle?.position === 'pursuer' &&
      e.category === 'communication',
    sentence:
      'This practice was chosen because your pursuer pattern means you want to resolve things immediately. This builds the skill of expressing needs without the urgency that can overwhelm your partner.',
    priority: 9,
  },
  {
    match: (p, e) =>
      p.negativeCycle?.position === 'withdrawer' &&
      e.category === 'regulation',
    sentence:
      'This practice was chosen because your withdrawer pattern uses shutdown as protection. This builds awareness of the shutdown signal so you can choose to stay present a little longer.',
    priority: 9,
  },

  // ── Window of tolerance matches ───────────────────────
  {
    match: (p, e) =>
      (p.compositeScores.windowWidth ?? 50) < 45 &&
      e.category === 'regulation',
    sentence:
      'This practice was chosen because your window of tolerance is narrow \u2014 big emotions take over before your thinking brain catches up. This widens the window by one breath, one pause at a time.',
    priority: 8,
  },
  {
    match: (p, e) =>
      (p.compositeScores.windowWidth ?? 50) >= 45 &&
      (p.compositeScores.windowWidth ?? 50) <= 65 &&
      e.category === 'regulation',
    sentence:
      'This practice was chosen because your window is moderate \u2014 you can hold a lot, but the edge is closer than you think under stress. This helps you sense the edge before you cross it.',
    priority: 7,
  },
  {
    match: (p, e) =>
      (p.compositeScores.windowWidth ?? 50) > 65 &&
      (e.category === 'communication' || e.category === 'attachment'),
    sentence:
      'This practice was chosen because your window is wide \u2014 you stay regulated when others might not. This builds your willingness to let your partner see your emotions instead of only your composure.',
    priority: 7,
  },

  // ── Attachment anxiety/avoidance ──────────────────────
  {
    match: (p, e) =>
      (p.compositeScores.anxietyNorm ?? 50) > 60 &&
      e.category === 'regulation',
    sentence:
      'This practice was chosen because your attachment anxiety is elevated \u2014 your system scans for threat in connection. This teaches your nervous system that safety can come from within, not only from reassurance.',
    priority: 6,
  },
  {
    match: (p, e) =>
      (p.compositeScores.avoidanceNorm ?? 50) > 60 &&
      (e.category === 'communication' || e.category === 'attachment'),
    sentence:
      'This practice was chosen because your avoidance is elevated \u2014 closeness can feel like a threat to your autonomy. This stretches your tolerance for intimacy without overwhelming your system.',
    priority: 6,
  },

  // ── Composite score thresholds ────────────────────────
  {
    match: (p, e) =>
      (p.compositeScores.differentiation ?? 50) < 50 &&
      e.category === 'differentiation',
    sentence:
      'This practice was chosen because your differentiation score is below midpoint \u2014 it can be hard to hold your own position in the presence of strong emotion. This builds the muscle of self in relationship.',
    priority: 5,
  },
  {
    match: (p, e) =>
      (p.compositeScores.valuesCongruence ?? 50) < 50 &&
      e.category === 'values',
    sentence:
      'This practice was chosen because there is a gap between what you value and how you are living it. This closes the gap by one small action \u2014 because alignment is built daily, not declared once.',
    priority: 5,
  },
  {
    match: (p, e) =>
      (p.compositeScores.emotionalIntelligence ?? 50) > 65 &&
      (p.compositeScores.regulationScore ?? 50) < 50 &&
      e.category === 'regulation',
    sentence:
      'This practice was chosen because you feel everything deeply but your regulation has not caught up to your awareness. This builds the container to hold what you already perceive.',
    priority: 5,
  },
  {
    match: (p, e) =>
      (p.compositeScores.conflictFlexibility ?? 50) < 45 &&
      e.category === 'communication',
    sentence:
      'This practice was chosen because you tend to rely on one conflict strategy. This builds your capacity to enter difficult conversations \u2014 not to fight, but to stay present when things get real.',
    priority: 5,
  },

  // ── Detected patterns ─────────────────────────────────
  {
    match: (p, e) =>
      (p.patterns?.some((pt: any) =>
        typeof pt === 'string'
          ? pt.includes('accommodate')
          : pt?.name?.includes('accommodate')
      ) ?? false) &&
      e.category === 'differentiation',
    sentence:
      'This practice was chosen because your portrait shows you accommodate to maintain connection \u2014 you yield when you could hold. This builds the ability to hold your ground and stay close.',
    priority: 4,
  },
  {
    match: (p, e) =>
      (p.compositeScores.relationalAwareness ?? 50) > 65 &&
      (e.category === 'differentiation' || e.category === 'values'),
    sentence:
      'This practice was chosen because you can see the pattern while it is happening. This turns that awareness into action \u2014 so seeing the dance becomes choosing a different step.',
    priority: 4,
  },

  // ── Generic fallbacks by category ─────────────────────
  {
    match: (_p, e) => e.category === 'regulation',
    sentence:
      'This practice builds your capacity to stay present when emotions intensify \u2014 so you can respond from choice, not from reflex.',
    priority: 0,
  },
  {
    match: (_p, e) => e.category === 'communication',
    sentence:
      'This practice strengthens the bridge between feeling something and expressing it clearly \u2014 so your words carry what you actually mean.',
    priority: 0,
  },
  {
    match: (_p, e) => e.category === 'attachment',
    sentence:
      'This practice works directly with your attachment system \u2014 building the kind of safety that lets connection deepen.',
    priority: 0,
  },
  {
    match: (_p, e) => e.category === 'values',
    sentence:
      'This practice closes the gap between what matters to you and how you live it \u2014 one small alignment at a time.',
    priority: 0,
  },
  {
    match: (_p, e) => e.category === 'differentiation',
    sentence:
      'This practice builds your capacity to stay yourself while staying close \u2014 the art of being two people in one relationship.',
    priority: 0,
  },
];

// ─── Public API ─────────────────────────────────────────

/**
 * Generate a personalized "why this practice" sentence.
 *
 * @param portrait  The user's individual portrait
 * @param exercise  The exercise/intervention being recommended
 * @returns         A personalized sentence, or null if no portrait
 */
export function generateWhySentence(
  portrait: IndividualPortrait | null,
  exercise: Intervention | null | undefined
): string | null {
  if (!portrait || !exercise) return null;

  // Sort templates by priority (highest first), find first match
  const sorted = [...TEMPLATES].sort((a, b) => b.priority - a.priority);

  for (const template of sorted) {
    try {
      if (template.match(portrait, exercise)) {
        return template.sentence;
      }
    } catch {
      // Skip templates that fail on missing data
      continue;
    }
  }

  return null;
}
