/**
 * MC5 Theme — Lavender/Sky palette for "Unhooking from the Story".
 *
 * The softest course. ACT-based defusion with gentle, meditative tones.
 * Slower animations (800ms default). NO haptics during writing/meditation.
 */

export const MC5_PALETTE = {
  // Shared base
  cream: '#F2F0E9',
  ink: '#2C2C2C',
  paper: '#FFFDF5',
  gold: '#D4B483',

  // MC5-specific accents
  lavender: '#9B8EC4',       // Primary — calm defusion
  skyBlue: '#87CEEB',        // Secondary — spaciousness
  deepLavender: '#7B6EA4',   // Darker lavender for emphasis
  softLilac: '#E8E0F0',      // Light background for cards
  mistBlue: '#B8D4E8',       // Stream / flowing water
  leafGreen: '#8FB89E',      // Leaves on stream
  warmGold: '#D4B483',       // Commitment warmth
  paleCloud: '#F0EBF5',      // Meditation background
};

export const MC5_TIMING = {
  storyReveal: 800,
  defusionPrefix: 600,
  leafFloat: 15000,          // 15s for leaf to cross screen
  leafBob: 3000,             // 3s gentle vertical bobbing
  typewriter: 80,            // 80ms per character
  meditationBell: 500,
  dialSnap: 300,
  connectionDraw: 400,
  stampDrop: 500,
};
