/**
 * MC13 Theme — Fondness & Gratitude palette.
 *
 * Warm rose pink with soft gold. Nostalgic, memory-rich, heartfelt.
 * Designed to evoke warmth, appreciation, and cherished connection.
 */

export const MC13_PALETTE = {
  // Shared base
  cream: '#FFF8F0',
  ink: '#2C2C2C',
  paper: '#FFFDF5',
  gold: '#DAA520',

  // MC13-specific accents
  warmRose: '#E8739E',             // Primary — fondness, love
  warmRoseLight: '#F5C2D4',        // Light rose for backgrounds
  warmRoseDark: '#C4547A',         // Dark rose for emphasis
  softGold: '#DAA520',             // Secondary — gratitude, warmth
  softGoldLight: '#F5E6B8',        // Light gold background
  softGoldDark: '#B8860B',         // Darker gold
  blushPink: '#FFB6C1',            // Tertiary — tenderness
  blushPinkLight: '#FFE0E8',       // Light blush
  treasureGold: '#FFD700',         // Treasure/gem fill
  treasureEmpty: '#F0E0C8',        // Unfound treasure
  ratioPositive: '#5A9E6F',        // Positive ratio indicator
  ratioNegative: '#E57373',        // Negative ratio indicator
  ratioNeutral: '#DAA520',         // Neutral ratio
  saveGreen: '#5A9E6F',            // Save action
  skipGray: '#9E9E9E',             // Skip action
  reminderGold: '#DAA520',         // Reminder action
  correct: '#5A9E6F',
  correctLight: '#D4F0DF',
  incorrect: '#E57373',
  incorrectLight: '#FDDEDE',
  cardBg: '#FFFCF5',
  cardBorder: '#F0D4E0',
  letterBg: '#FFF8F0',             // Letter background
};

export const MC13_TIMING = {
  sliderSnap: 200,
  ratioReveal: 500,
  digReveal: 400,
  matchFlip: 350,
  treasureOpen: 500,
  dayCardFlip: 300,
  letterFade: 400,
  heartPulse: 600,
  celebrationBurst: 500,
};
