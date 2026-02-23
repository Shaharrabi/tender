/**
 * MC9 Theme — Sunshine/Playful palette for "The Lightness Lab".
 *
 * The most joyful, energetic course. Play-as-medicine approach.
 * Bright, warm tones. Quicker animations. Confetti-style micro-celebrations.
 */

export const MC9_PALETTE = {
  // Shared base
  cream: '#F2F0E9',
  ink: '#2C2C2C',
  paper: '#FFFDF5',
  gold: '#D4B483',

  // MC9-specific accents
  sunshine: '#FFB74D',        // Primary — warm playful energy
  sunshineLight: '#FFE0B2',   // Light sunshine for backgrounds
  sunshineDark: '#F09C30',    // Darker sunshine for emphasis
  playPink: '#F48FB1',        // Secondary — fun/sweet
  pinkLight: '#F9C4D8',       // Light pink background
  pinkDark: '#C44D76',        // Dark pink for text on pink bg
  sky: '#81D4FA',             // Tertiary — open lightness
  deepSunshine: '#F09C30',    // Alias for sunshineDark
  softPeach: '#FFE0B2',       // Alias for sunshineLight
  coral: '#F28B6D',           // Warm coral for urgency/timer
  coralLight: '#FBBDA8',      // Light coral
  lavender: '#B8A9E8',        // Soft lavender accent
  lavenderLight: '#DDD5F5',   // Light lavender
  confettiGreen: '#81C784',   // Score / celebration green
  confettiPurple: '#BA68C8',  // Variety confetti color
  warmRose: '#E57373',        // Temperature warm
  coolBlue: '#64B5F6',        // Temperature cool
  correct: '#81C784',         // Alias for confettiGreen
  correctLight: '#D4F0DF',    // Light correct background
  incorrect: '#E57373',       // Alias for warmRose
  incorrectLight: '#FDDEDE',  // Light incorrect background
  cardBg: '#FFFCF5',          // Warm card background
  cardBorder: '#F0E6D8',      // Warm card border
};

export const MC9_TIMING = {
  cardBounce: 300,
  bidReveal: 400,
  confettiBurst: 200,
  thermometerFill: 600,
  chartDraw: 500,
  cardSnap: 250,
  timerTick: 1000,
  gameTransition: 400,
  ritualStamp: 500,
};
