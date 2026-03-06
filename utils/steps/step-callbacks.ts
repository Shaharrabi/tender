/**
 * Step Callbacks — Short references to the previous step's work.
 *
 * Each entry (Steps 2–12) is 1–2 sentences that bridge
 * the previous step's theme into the current one.
 * Rendered as a small italic card between the teaching
 * and the portrait bridge in step-detail.tsx.
 *
 * When step-context data is available (the user actually wrote
 * something in the previous step), the callback can be enhanced
 * with their own words. This file provides the GENERIC fallbacks.
 */

// ─── Static Callbacks ───────────────────────────────────

export const STEP_CALLBACKS: Record<number, string> = {
  2: 'In Step 1, you named the strain. Now you\'re learning WHERE that strain lives — not inside either of you, but in the space between.',
  3: 'You\'ve been sensing the field (Step 2). Now notice: some of what you sense is filtered through a STORY. This step is about seeing the filter.',
  4: 'You loosened your grip on the story about your partner (Step 3). Now comes the harder question: what\'s YOUR part in this dance?',
  5: 'You examined your part in the pattern (Step 4). You saw the protective moves. Now comes the question: can you show your partner what those moves are protecting?',
  6: 'You shared your truth (Step 5). That took courage. Now notice: is there still a part of you that sees your partner as the problem? That\'s the enemy story.',
  7: 'You released the enemy story (Step 6). For possibly the first time in a while, you can look at your partner without blame. What do you want to invite them into?',
  8: 'You invited your partner in (Step 7). Now you have the goodwill to try something new together. New patterns feel awkward — that\'s how you know they\'re real.',
  9: 'You tried new patterns (Step 8). Some worked. Some created new ruptures. THAT\'S the material for this step. Repair the fresh ones.',
  10: 'You can repair now (Step 9). That means when rituals get disrupted (and they will), you have the tools to reconnect. Build the rituals knowing repair is your safety net.',
  11: 'Your rituals are in place (Step 10). Now sustaining isn\'t about willpower — it\'s about noticing when you drift and gently returning. The spiral, not the line.',
  12: 'Everything before this was preparation. Seeing, feeling, shifting, integrating. Now you live it. Not as a destination — as a daily practice.',
};

// ─── API ─────────────────────────────────────────────────

/** Get the callback text for a step, or null if step 1 or not found. */
export function getStepCallback(stepNumber: number): string | null {
  return STEP_CALLBACKS[stepNumber] ?? null;
}
