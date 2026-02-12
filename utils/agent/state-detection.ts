/**
 * State detection — analyzes message text to detect the user's
 * nervous system state (activated, shutdown, in-window, mixed).
 *
 * Based on Polyvagal-informed linguistic markers.
 */

import type { NervousSystemState, StateConfidence, StateDetectionResult } from '@/types/chat';

// ─── Marker Definitions ─────────────────────────────────

const ACTIVATION_MARKERS = [
  // Absolutist language
  /\b(always|never|every\s+time|nothing\s+ever)\b/i,
  // Urgency
  /\b(right\s+now|immediately|can't\s+wait|urgent)\b/i,
  // Intensity
  /!{2,}/,  // Multiple exclamation marks
  /\b(furious|livid|enraged|seething|screaming)\b/i,
  // Blame
  /\b(it's\s+(your|their|his|her)\s+fault|you\s+(always|never))\b/i,
  // Repetition patterns (caps)
  /[A-Z]{3,}/,
  // Catastrophizing
  /\b(everything\s+is|nothing\s+works|can't\s+(take|handle|stand)\s+(it|this))\b/i,
  // Fight response
  /\b(attack|fight|defend|argue|confronted)\b/i,
];

const SHUTDOWN_MARKERS = [
  // Dismissive
  /\b(whatever|fine|i\s+don't\s+care|doesn't\s+matter)\b/i,
  // Uncertainty/numbness
  /\b(i\s+don't\s+know|no\s+idea|not\s+sure|blank|numb)\b/i,
  // Withdrawal
  /\b(leave\s+me\s+alone|go\s+away|need\s+space|can't\s+talk)\b/i,
  // Terse (message very short — checked separately)
  // Hopelessness
  /\b(what's\s+the\s+point|nothing\s+will\s+change|give\s+up|pointless)\b/i,
  // Freeze response
  /\b(frozen|stuck|paralyzed|can't\s+move|can't\s+think)\b/i,
  // Deflection
  /\b(it's\s+fine|i'm\s+fine|no\s+big\s+deal|over\s+it)\b/i,
];

const WINDOW_MARKERS = [
  // Curiosity
  /\b(i\s+wonder|curious\s+about|what\s+if|interesting)\b/i,
  // Nuance
  /\b(on\s+one\s+hand|on\s+the\s+other|both|part\s+of\s+me)\b/i,
  // Reflection
  /\b(i\s+notice|i\s+realize|looking\s+back|reflecting|thinking\s+about)\b/i,
  // Self-awareness
  /\b(i\s+tend\s+to|my\s+pattern|i\s+usually|when\s+i\s+feel)\b/i,
  // Growth orientation
  /\b(learn|grow|practice|try|working\s+on|getting\s+better)\b/i,
  // Compassion
  /\b(understand|makes\s+sense|compassion|gentl|kind\s+to)\b/i,
];

// ─── Detection Function ─────────────────────────────────

export function detectState(message: string): StateDetectionResult {
  const activationCount = countMatches(message, ACTIVATION_MARKERS);
  const shutdownCount = countMatches(message, SHUTDOWN_MARKERS);
  const windowCount = countMatches(message, WINDOW_MARKERS);

  // Terse message detection (under 15 chars suggests shutdown)
  const isTerse = message.trim().length < 15 && message.trim().split(/\s+/).length <= 3;
  const adjustedShutdown = isTerse ? shutdownCount + 2 : shutdownCount;

  // Normalize to 0-1 scores
  const total = Math.max(activationCount + adjustedShutdown + windowCount, 1);
  const activationScore = activationCount / total;
  const shutdownScore = adjustedShutdown / total;
  const windowScore = windowCount / total;

  // Determine state
  let state: NervousSystemState;
  let confidence: StateConfidence;

  if (activationCount >= 3 && shutdownCount <= 1) {
    state = 'ACTIVATED';
    confidence = activationCount >= 4 ? 'high' : 'medium';
  } else if (adjustedShutdown >= 3 && activationCount <= 1) {
    state = 'SHUTDOWN';
    confidence = adjustedShutdown >= 4 ? 'high' : 'medium';
  } else if (activationCount >= 2 && adjustedShutdown >= 2) {
    state = 'MIXED';
    confidence = 'medium';
  } else if (windowCount >= 2 && activationCount <= 1 && adjustedShutdown <= 1) {
    state = 'IN_WINDOW';
    confidence = windowCount >= 3 ? 'high' : 'medium';
  } else if (activationCount >= 2) {
    state = 'ACTIVATED';
    confidence = 'low';
  } else if (adjustedShutdown >= 2) {
    state = 'SHUTDOWN';
    confidence = 'low';
  } else {
    state = 'IN_WINDOW';
    confidence = 'low';
  }

  return { state, confidence, activationScore, shutdownScore, windowScore };
}

// ─── Helpers ─────────────────────────────────────────────

function countMatches(text: string, patterns: RegExp[]): number {
  let count = 0;
  for (const pattern of patterns) {
    if (pattern.test(text)) count++;
  }
  return count;
}
