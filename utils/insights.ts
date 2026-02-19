/**
 * Insight system — contextual prompts, reminders, and motivational messages
 * that guide the user through their relationship growth journey.
 *
 * Insights are surfaced based on the user's current state (assessment progress,
 * portrait availability, check-in recency) and rotate motivational content
 * so the experience feels fresh.
 */

import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';
import {
  SeedlingIcon,
  CompassIcon,
  TargetIcon,
  CalendarIcon,
  SparkleIcon,
  EyeIcon,
  MasksIcon,
  HandshakeIcon,
  WaveIcon,
  HourglassIcon,
  LeafIcon,
  RefreshIcon,
  DoveIcon,
} from '@/assets/graphics/icons';

// ─── Types ──────────────────────────────────────────────

export type InsightType =
  | 'assessment_reminder'
  | 'practice_reminder'
  | 'check_in_reminder'
  | 'nuance_prompt'
  | 'milestone'
  | 'motivation';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  body: string;
  icon: ComponentType<IconProps>;
  actionRoute?: string;
  priority: number;
}

// ─── Motivational Quotes ────────────────────────────────
// Original wisdom inspired by relationship science themes from
// Brene Brown, Esther Perel, John Gottman, Sue Johnson, and others.
// These are NOT direct quotes — they are generic relationship wisdom.

const MOTIVATIONAL_QUOTES: { title: string; body: string }[] = [
  {
    title: 'Vulnerability is strength',
    body: 'Opening your heart to another person is one of the bravest things you can do.',
  },
  {
    title: 'Turn toward, not away',
    body: 'Every small moment of connection builds the foundation of lasting love.',
  },
  {
    title: 'Growth takes patience',
    body: 'Relationships deepen not in grand gestures, but in the quiet willingness to keep showing up.',
  },
  {
    title: 'Curiosity over judgment',
    body: 'When you approach your partner with genuine curiosity, understanding follows naturally.',
  },
  {
    title: 'Repair is a superpower',
    body: 'It is not the absence of conflict that makes a relationship strong — it is the ability to repair.',
  },
  {
    title: 'You deserve connection',
    body: 'Belonging starts when you let yourself be truly seen by someone who matters.',
  },
  {
    title: 'Listen to understand',
    body: 'The most powerful gift you can give your partner is your full, undivided attention.',
  },
  {
    title: 'Emotional safety first',
    body: 'When people feel safe, they naturally open up and become more generous with each other.',
  },
  {
    title: 'Small things often',
    body: 'Love is built in everyday moments — a kind word, a gentle touch, a shared laugh.',
  },
  {
    title: 'Name it to tame it',
    body: 'Putting words to your feelings helps your partner understand your inner world.',
  },
  {
    title: 'Courage to be imperfect',
    body: 'Letting go of who you think you should be allows you to become who you truly are.',
  },
  {
    title: 'Hold space gently',
    body: 'Sometimes the most loving thing is simply being present without trying to fix anything.',
  },
  {
    title: 'Desire needs mystery',
    body: 'Keeping a sense of wonder about your partner keeps the spark alive across the years.',
  },
  {
    title: 'Your story matters',
    body: 'The narrative you tell about your relationship shapes the relationship you live.',
  },
  {
    title: 'Boundaries are love',
    body: 'Clear boundaries create the safety that allows intimacy to flourish.',
  },
  {
    title: 'Empathy bridges distance',
    body: 'Stepping into your partner\'s shoes, even briefly, can transform a disagreement into a dialogue.',
  },
  {
    title: 'Gratitude rewires the brain',
    body: 'Noticing what is going well in your relationship trains your mind to see more of it.',
  },
  {
    title: 'Love is a practice',
    body: 'Like any skill, love deepens with intentional effort and gentle repetition.',
  },
  {
    title: 'Accept influence',
    body: 'Healthy partnerships thrive when both people are willing to be shaped by each other.',
  },
  {
    title: 'Secure base, safe haven',
    body: 'The best relationships offer both a place to rest and the courage to explore.',
  },
  {
    title: 'Feelings are messengers',
    body: 'Every emotion carries information about what you need. Listen with compassion.',
  },
  {
    title: 'Connection before correction',
    body: 'Before offering feedback, make sure your partner feels loved and understood.',
  },
  {
    title: 'Celebrate the wins',
    body: 'Actively celebrating your partner\'s good news strengthens your bond more than you think.',
  },
  {
    title: 'Slow down to speed up',
    body: 'Taking a pause during tension gives your nervous system space to return to calm.',
  },
  {
    title: 'Two whole people',
    body: 'The strongest couples are made of two individuals who maintain their own identity.',
  },
  {
    title: 'Softened start-up',
    body: 'How you begin a difficult conversation often determines how it will end.',
  },
  {
    title: 'Trust is built in drops',
    body: 'Trust accumulates through many small acts of reliability, not one grand promise.',
  },
  {
    title: 'The bid for connection',
    body: 'Pay attention to the little ways your partner reaches out — and respond with warmth.',
  },
  {
    title: 'Shared meaning',
    body: 'Couples who create rituals, dreams, and purpose together build something truly lasting.',
  },
  {
    title: 'You are enough',
    body: 'You do not have to earn love by being perfect. You are worthy exactly as you are.',
  },
  {
    title: 'Progress, not perfection',
    body: 'Every step forward in understanding yourself and your partner is a step worth celebrating.',
  },
  {
    title: 'Lean into discomfort',
    body: 'Growth happens at the edge of your comfort zone, where honesty meets tenderness.',
  },
];

// ─── WEARE-Targeted Smart Insights ──────────────────────
// When a WEARE variable is a bottleneck, these warm one-liners
// are surfaced as the primary insight.

export const WEARE_BOTTLENECK_INSIGHTS: Record<string, { title: string; body: string; icon: ComponentType<IconProps> }> = {
  attunement: {
    title: '2 minutes of seeing',
    body: 'Put everything else down. Look at your partner. What do you notice in their face right now?',
    icon: EyeIcon,
  },
  coCreation: {
    title: 'Absurdity is medicine',
    body: 'Be ridiculous together. Play is how the field remembers it is alive.',
    icon: MasksIcon,
  },
  transmission: {
    title: 'Bodies before words',
    body: 'Touch, do not talk. A hand on the shoulder. A two-second hug. Let your body say what words cannot.',
    icon: HandshakeIcon,
  },
  space: {
    title: 'Ask the relationship',
    body: 'What does the space between you need today? Not what you need. Not what they need. What does WE need?',
    icon: WaveIcon,
  },
  time: {
    title: 'Consistency over intensity',
    body: '5 minutes every day changes more than 2 hours once a week. Show up small. Show up often.',
    icon: HourglassIcon,
  },
  individual: {
    title: 'Fill your own cup',
    body: 'What would help YOU feel more grounded today? You cannot pour from an empty vessel.',
    icon: SeedlingIcon,
  },
  context: {
    title: 'Notice what is whole',
    body: 'Before you work on what is broken, notice what is working. The field needs your attention on both.',
    icon: LeafIcon,
  },
  change: {
    title: 'One small new move',
    body: 'You do not need a revolution. You need one different response to the same old trigger. Try it today.',
    icon: RefreshIcon,
  },
  resistance: {
    title: 'Not everything needs solving',
    body: 'Some things just need to be felt. Sit with what is here without fixing it. That IS the practice.',
    icon: DoveIcon,
  },
};

// ─── Insight Generator ──────────────────────────────────

/**
 * Returns an array of contextually relevant insights based on the user's
 * current state. Insights are sorted by priority (highest first).
 *
 * @param completedCount      Number of assessments the user has completed
 * @param hasPortrait         Whether the relationship portrait has been unlocked
 * @param hasCheckInToday     Whether the user has completed a check-in today
 * @param daysSinceLastAssessment  Days since the most recent assessment was completed
 * @param weareBottleneck     Optional WEARE variable that is the current bottleneck
 * @param hasWeeklyCheckIn    Whether the user has completed a weekly check-in this week
 */
export function getInsights(
  completedCount: number,
  hasPortrait: boolean,
  hasCheckInToday: boolean,
  daysSinceLastAssessment: number,
  weareBottleneck?: string,
  hasWeeklyCheckIn?: boolean,
): Insight[] {
  const insights: Insight[] = [];

  // ── First assessment prompt ───────────────────────────
  if (completedCount === 0) {
    insights.push({
      id: 'insight-first-assessment',
      type: 'assessment_reminder',
      title: 'Start The Tender Assessment',
      body: 'Begin your journey of self-discovery. Take breaks between sections and come back anytime.',
      icon: SeedlingIcon,
      actionRoute: '/(app)/tender-assessment',
      priority: 100,
    });
  }

  // ── Continue journey prompt ───────────────────────────
  if (completedCount > 0 && completedCount < 6 && daysSinceLastAssessment > 2) {
    insights.push({
      id: 'insight-continue-journey',
      type: 'assessment_reminder',
      title: 'Continue your journey',
      body: `You have completed ${completedCount} of 6 assessments. Each one adds a new layer to your relationship portrait.`,
      icon: CompassIcon,
      actionRoute: '/(app)/tender-assessment',
      priority: 90,
    });
  }

  // ── Growth Plan unlocked prompt ───────────────────────
  if (completedCount >= 3 && !hasPortrait && completedCount < 6) {
    insights.push({
      id: 'insight-growth-plan-unlocked',
      type: 'milestone',
      title: "You've unlocked the Growth Plan!",
      body: 'With 3 assessments complete, your personalized growth plan is ready to explore.',
      icon: TargetIcon,
      actionRoute: '/(app)/portrait',
      priority: 95,
    });
  }

  // ── Daily check-in reminder ───────────────────────────
  if (!hasCheckInToday && hasPortrait) {
    insights.push({
      id: 'insight-daily-check-in',
      type: 'check_in_reminder',
      title: 'Daily check-in',
      body: 'Take a moment to reflect on how you and your partner are doing today.',
      icon: CalendarIcon,
      actionRoute: '/(app)/check-in',
      priority: 85,
    });
  }

  // ── Weekly check-in reminder ──────────────────────────
  if (!hasWeeklyCheckIn && hasPortrait) {
    insights.push({
      id: 'insight-weekly-check-in',
      type: 'check_in_reminder',
      title: 'Weekly check-in',
      body: 'Reflect on the space between you this week. How alive does it feel?',
      icon: CalendarIcon,
      actionRoute: '/(app)/growth',
      priority: 75,
    });
  }

  // ── WEARE-targeted smart insight (when bottleneck is known) ─
  if (weareBottleneck && WEARE_BOTTLENECK_INSIGHTS[weareBottleneck]) {
    const bn = WEARE_BOTTLENECK_INSIGHTS[weareBottleneck];
    insights.push({
      id: `insight-weare-${weareBottleneck}`,
      type: 'practice_reminder',
      title: bn.title,
      body: bn.body,
      icon: bn.icon,
      priority: 80,
    });
  }

  // ── Motivational quote (always present, rotates daily) ─
  const dayOfYear = getDayOfYear();
  const quoteIndex = dayOfYear % MOTIVATIONAL_QUOTES.length;
  const quote = MOTIVATIONAL_QUOTES[quoteIndex];

  insights.push({
    id: `insight-motivation-${quoteIndex}`,
    type: 'motivation',
    title: quote.title,
    body: quote.body,
    icon: SparkleIcon,
    priority: 10,
  });

  // Sort by priority descending (highest first)
  insights.sort((a, b) => b.priority - a.priority);

  return insights;
}

// ─── Helpers ────────────────────────────────────────────

/** Returns the 1-based day of the year (1–366). */
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
