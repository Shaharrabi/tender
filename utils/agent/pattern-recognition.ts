/**
 * Pattern recognition — detects relational patterns in conversation text.
 *
 * Uses the user's portrait data to match conversation content
 * against known patterns and growth edges.
 */

import type { IndividualPortrait } from '@/types/portrait';

export interface RecognizedPattern {
  id: string;
  name: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

// ─── Cycle Pattern Detection ─────────────────────────────

const PURSUING_MARKERS = [
  /\b(why\s+won't\s+(you|they|he|she))\b/i,
  /\b(need\s+(you|them)\s+to|please\s+just|talk\s+to\s+me)\b/i,
  /\b(ignoring\s+me|don't\s+you\s+care|notice\s+me)\b/i,
  /\b(reach\s+out|trying\s+to\s+connect|closer)\b/i,
  /\b(texts?\s+(and|but)\s+(no|didn't)\s+respond)\b/i,
];

const WITHDRAWING_MARKERS = [
  /\b(need\s+space|leave\s+me\s+alone|too\s+much)\b/i,
  /\b(overwhelm|can't\s+handle|shut\s+down|walk\s+away)\b/i,
  /\b(nothing\s+I\s+say|doesn't\s+matter|give\s+up)\b/i,
  /\b(went\s+quiet|stopped\s+talking|couldn't\s+respond)\b/i,
  /\b(pulled\s+away|withdrew|retreated)\b/i,
];

// ─── Four Horsemen Detection (Gottman) ───────────────────

const CRITICISM_MARKERS = [
  /\b(you\s+always|you\s+never|what's\s+wrong\s+with\s+you)\b/i,
  /\b(can't\s+believe\s+you|typical\s+of\s+you)\b/i,
];

const CONTEMPT_MARKERS = [
  /\b(pathetic|disgusting|worthless|joke|loser)\b/i,
  /\b(rolling\s+my\s+eyes|mocking|sneering)\b/i,
];

const DEFENSIVENESS_MARKERS = [
  /\b(it's\s+not\s+my\s+fault|but\s+you|what\s+about\s+when\s+you)\b/i,
  /\b(I\s+did\s+nothing\s+wrong|you\s+started\s+it)\b/i,
];

const STONEWALLING_MARKERS = [
  /\b(don't\s+want\s+to\s+talk|I'm\s+done|conversation\s+over)\b/i,
  /\b(stopped\s+listening|checked\s+out|shut\s+down|walked\s+away)\b/i,
];

// ─── Main Detection Function ─────────────────────────────

export function recognizePatterns(
  message: string,
  portrait: IndividualPortrait
): RecognizedPattern[] {
  const patterns: RecognizedPattern[] = [];

  // Cycle detection
  const pursuingCount = countMatches(message, PURSUING_MARKERS);
  const withdrawingCount = countMatches(message, WITHDRAWING_MARKERS);

  if (pursuingCount >= 2) {
    patterns.push({
      id: 'cycle_pursuing',
      name: 'Pursuing Pattern',
      description: 'Language suggests pursuing behavior — reaching for connection with intensity.',
      confidence: pursuingCount >= 3 ? 'high' : 'medium',
    });
  }

  if (withdrawingCount >= 2) {
    patterns.push({
      id: 'cycle_withdrawing',
      name: 'Withdrawing Pattern',
      description: 'Language suggests withdrawing behavior — pulling back to self-protect.',
      confidence: withdrawingCount >= 3 ? 'high' : 'medium',
    });
  }

  // Four Horsemen
  if (countMatches(message, CRITICISM_MARKERS) >= 1) {
    patterns.push({
      id: 'horseman_criticism',
      name: 'Criticism',
      description: 'Criticism detected — attacking character rather than specific behavior.',
      confidence: 'medium',
    });
  }

  if (countMatches(message, CONTEMPT_MARKERS) >= 1) {
    patterns.push({
      id: 'horseman_contempt',
      name: 'Contempt',
      description: 'Contempt detected — the most corrosive of the Four Horsemen.',
      confidence: 'high',
    });
  }

  if (countMatches(message, DEFENSIVENESS_MARKERS) >= 1) {
    patterns.push({
      id: 'horseman_defensiveness',
      name: 'Defensiveness',
      description: 'Defensive posture detected — deflecting rather than receiving.',
      confidence: 'medium',
    });
  }

  if (countMatches(message, STONEWALLING_MARKERS) >= 1) {
    patterns.push({
      id: 'horseman_stonewalling',
      name: 'Stonewalling',
      description: 'Stonewalling detected — complete withdrawal from interaction.',
      confidence: 'medium',
    });
  }

  // Growth edge moments — check if message content touches on growth edges
  for (const edge of portrait.growthEdges) {
    const edgeWords = edge.title.toLowerCase().split(/\s+/);
    const matchCount = edgeWords.filter((w) =>
      w.length > 3 && message.toLowerCase().includes(w)
    ).length;

    if (matchCount >= 2 || message.toLowerCase().includes(edge.title.toLowerCase())) {
      patterns.push({
        id: `growth_edge_${edge.id}`,
        name: `Growth Edge: ${edge.title}`,
        description: `User may be touching on their growth edge: ${edge.description}`,
        confidence: 'low',
      });
    }
  }

  // Trigger activation — check against portrait triggers
  for (const trigger of portrait.fourLens.attachment.triggers) {
    const triggerWords = trigger.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const matchCount = triggerWords.filter((w) => message.toLowerCase().includes(w)).length;

    if (matchCount >= 2) {
      patterns.push({
        id: 'trigger_activation',
        name: 'Attachment Trigger',
        description: `Possible trigger activation related to: ${trigger}`,
        confidence: 'medium',
      });
      break; // Only report first trigger match
    }
  }

  // Values-behavior conflict detection
  const valuesGaps = portrait.fourLens.values.significantGaps;
  for (const gap of valuesGaps) {
    if (message.toLowerCase().includes(gap.value.toLowerCase())) {
      patterns.push({
        id: `values_conflict_${gap.value}`,
        name: `Values Gap: ${gap.value}`,
        description: `User mentioning a value they have a significant gap in (importance: ${gap.importance}, gap: ${gap.gap.toFixed(1)}).`,
        confidence: 'low',
      });
    }
  }

  return patterns;
}

// ─── Helpers ─────────────────────────────────────────────

function countMatches(text: string, patterns: RegExp[]): number {
  let count = 0;
  for (const pattern of patterns) {
    if (pattern.test(text)) count++;
  }
  return count;
}
