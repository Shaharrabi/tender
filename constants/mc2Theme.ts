/**
 * MC2 Theme Constants — "Your Nervous System in Love"
 *
 * Somatic, breath-focused aesthetic with sage greens and body-awareness colors.
 * Inherits from the shared Wes Anderson theme but adds MC2-specific accents.
 */

import { Colors } from './theme';

export const MC2_PALETTE = {
  // Inherited from shared theme
  cream: Colors.background,       // '#F2F0E9'
  ink: Colors.text,               // '#2C2C2C'
  paper: Colors.surfaceElevated,  // '#FFFDF5'
  gold: Colors.accentGold,        // '#D4A843'

  // MC2-specific
  sage: '#8F9E8B',               // Primary accent — calm, regulated
  softGreen: '#A8C5A0',          // Secondary — growth, safety
  warmCoral: '#E07A5F',          // Hyperarousal zone
  coolBlue: '#87CEEB',           // Hypoarousal zone
  windowGreen: '#6B9E7E',       // "In the window" zone
  dimOverlay: 'rgba(0,0,0,0.6)', // Lesson 4 starting dim state
};

/**
 * MC2 XP Awards — awarded upstream by microcourse.tsx handleComplete,
 * NOT inside lesson components. Kept here for reference / documentation.
 */
export const MC2_XP = {
  lesson_complete: 50, // Standard lesson XP (from gamification service XP_VALUES)
  course_complete: 100,
};
