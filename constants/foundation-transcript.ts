/**
 * Foundation Audio — Transcript & Synced Caption Cues
 *
 * Plays on first visit to the 12-step growth page via FoundationOverlay.
 * Caption cues are timed to THE FOUNDATION.mp3 for synced subtitle display.
 */

export const relationalFieldAudioTranscript = `
Every couple has what we might call a "relational field" — an invisible space between you that's shaped by how you show up.
When both partners orient toward connection rather than self-protection, something wiser than either individual emerges.
The Twelve Steps call this the "we" that can heal what "I" cannot.
You might think of it like this: You're two musicians playing together. When you're both listening, adjusting, creating in response to each other, something beautiful emerges that neither of you could make alone. That's the relational field coming alive.
But here's what gets in the way.
The Steps identify five relational patterns that most couples fall into at some point:
The addiction to certainty — needing to be right about your partner, holding onto fixed stories about who they are.
The addiction to control — managing outcomes, avoiding the vulnerability that real intimacy requires.
The addiction to distraction — avoiding difficult conversations, numbing out instead of tuning in.
The addiction to outrage — that righteous anger that feels so justified in the moment, but fractures trust over time.
And finally, the addiction to independence — the myth that needing your partner is weakness, when in reality, healthy dependence is the foundation of secure love.
These aren't moral failures. They're protective strategies that made sense at some point. The work ahead is about recognizing them, understanding them, and gradually learning new ways of being together.
`.trim();

export interface CaptionCue {
  /** Start time in seconds */
  start: number;
  /** End time in seconds */
  end: number;
  /** Caption text to display */
  text: string;
}

export const relationalFieldCaptionCues: CaptionCue[] = [
  { start: 0.0, end: 4.2, text: "Every couple has what we might call a relational field." },
  { start: 4.8, end: 8.76, text: "An invisible space between you that's shaped by how you show up." },
  { start: 9.18, end: 15.8, text: "When both partners orient toward connection rather than self-protection, something wiser emerges." },
  { start: 18.26, end: 22.72, text: 'The Twelve Steps call this the \u201cwe\u201d that can heal what \u201cI\u201d cannot.' },
  { start: 24.6, end: 28.34, text: "You might think of it like this: you're two musicians playing together." },
  { start: 28.34, end: 36.8, text: "When you're both listening, adjusting, creating in response to each other..." },
  { start: 33.76, end: 39.94, text: "Something beautiful emerges that neither of you could make alone." },
  { start: 41.72, end: 43.34, text: "But here's what gets in the way." },
  { start: 44.18, end: 49.48, text: "The Steps identify five relational patterns that most couples fall into." },
  { start: 50.58, end: 57.9, text: "The addiction to certainty \u2014 needing to be right about your partner." },
  { start: 59.12, end: 65.92, text: "The addiction to control \u2014 managing outcomes and avoiding vulnerability." },
  { start: 67.42, end: 74.26, text: "The addiction to distraction \u2014 avoiding difficult conversations and numbing out." },
  { start: 75.26, end: 83.22, text: "The addiction to outrage \u2014 righteous anger that fractures trust over time." },
  { start: 83.22, end: 94.98, text: "The addiction to independence \u2014 the myth that needing your partner is weakness." },
  { start: 96.5, end: 101.44, text: "These aren't moral failures. They're protective strategies." },
  { start: 102.18, end: 108.54, text: "The work ahead is recognizing them and learning new ways of being together." },
];

/**
 * Get the current caption for a given playback position.
 * Returns null if no caption is active at that time.
 */
export function getCaptionAtTime(positionSeconds: number): string | null {
  const cue = relationalFieldCaptionCues.find(
    (c) => positionSeconds >= c.start && positionSeconds <= c.end,
  );
  return cue?.text ?? null;
}
