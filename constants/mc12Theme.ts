/**
 * MC12 Theme — Playful/Alert palette for "Bids for Connection".
 *
 * Bright coral with awareness teal. Playful, alert, present-moment focused.
 * Designed to evoke warmth and attentiveness in partner interactions.
 */

export const MC12_PALETTE = {
  // Shared base
  cream: '#F2F0E9',
  ink: '#2C2C2C',
  paper: '#FFFDF5',
  gold: '#D4B483',

  // MC12-specific accents
  coral: '#FF6B6B',                // Primary — playful alertness
  coralLight: '#FFD4D4',           // Light coral for backgrounds
  coralDark: '#E05555',            // Dark coral for emphasis
  teal: '#4ECDC4',                 // Secondary — awareness
  tealLight: '#C4F0EC',            // Light teal background
  tealDark: '#3AA89F',             // Darker teal
  warmWhite: '#FFF8F2',            // Tertiary — soft warmth
  warmWhiteLight: '#FFFCF8',       // Lighter warm white
  bidGlow: '#FF6B6B',              // Bid highlight glow
  bidEmpty: '#F0E8E8',             // Empty bid slots

  // Response colors
  toward: '#5A9E6F',              // Turning toward (green)
  towardLight: '#D4F0DF',         // Light toward background
  away: '#E8A84A',                // Turning away (yellow/amber)
  awayLight: '#FFF3DD',           // Light away background
  against: '#E05555',             // Turning against (red)
  againstLight: '#FDDEDE',        // Light against background

  // Game/scoring
  correct: '#5A9E6F',
  correctLight: '#D4F0DF',
  incorrect: '#E57373',
  incorrectLight: '#FDDEDE',
  timerActive: '#FF6B6B',
  timerWarning: '#E8A84A',
  timerDanger: '#E05555',

  // UI
  cardBg: '#FFFCF5',
  cardBorder: '#F0E0E0',
  saveGreen: '#5A9E6F',
  skipGray: '#9E9E9E',
};

export const MC12_TIMING = {
  bidFlash: 300,
  responseReveal: 400,
  meterFill: 500,
  countdownTick: 1000,
  cardSwipe: 250,
  celebrationBurst: 500,
  phaseTransition: 350,
  timerPulse: 600,
};
