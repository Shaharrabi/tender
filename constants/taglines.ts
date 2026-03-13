/**
 * Nuance V2 Taglines — Rotating daily wisdom for the home screen.
 * These replace the static "The Science of Relationships" subtitle.
 */

export const NUANCE_TAGLINES = [
  "The space between you is not empty.",
  "You can't fix what you haven't felt.",
  "Presence is the first practice.",
  "Your pattern made sense once. It can change now.",
  "What you protect, you also imprison.",
  "You don't need a better argument. You need a softer question.",
  "The field between two people has its own intelligence.",
  "You're not reacting to them. You're reacting to your story about them.",
  "Something is trying to emerge. Don't rush past it.",
  "The moment before you speak is where everything changes.",
  "Repair is not weakness. It's the whole point.",
  "You are not behind. You are exactly where growth begins.",
  "What lives between you is asking to be known.",
  "Your nervous system is not your enemy.",
  "Difference is not distance. It's the raw material.",
  "The wound and the gift arrived together.",
  "You can be right, or you can be close. Sometimes both.",
  "This relationship is teaching you something you came here to learn.",
  "Being known is more intimate than being agreed with.",
  "You can't think your way into a new pattern. You have to live it.",
  "The next step is smaller than you think and more important than you know.",
  "What you resist in them is often what you haven't held in yourself.",
  "Two people growing is harder and more beautiful than one.",
  "The field between you remembers everything.",
  "Your avoidance is a door, not a wall.",
  "Your pursuit is love with nowhere to land. Let's find the landing.",
  "Safety is not the absence of conflict. It's the presence of trust.",
  "You're here. That means something.",
];

/**
 * Returns a deterministic tagline based on day of year.
 * Changes daily, consistent within a day.
 */
export function getDailyTagline(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return NUANCE_TAGLINES[dayOfYear % NUANCE_TAGLINES.length];
}
