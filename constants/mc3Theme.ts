/**
 * MC3 Theme — Warm amber/coral palette for "From Rupture to Repair".
 *
 * Scenario-based learning with conflict warmth and repair tones.
 */

export const MC3_PALETTE = {
  // Shared base
  cream: '#F2F0E9',
  ink: '#2C2C2C',
  paper: '#FFFDF5',
  gold: '#D4B483',

  // MC3-specific accents
  amber: '#D4A843',        // Primary — repair warmth
  warmCoral: '#E07A5F',    // Secondary — conflict heat
  deepAmber: '#B8892E',    // Darker amber for emphasis
  softPeach: '#F5D6C3',    // Light background for cards
  coolSlate: '#7A8B99',    // Contrast for "before repair" states
  repairGreen: '#8FB89E',  // Success/repair achieved
  warningRed: '#C75B4A',   // Horsemen danger (muted, not harsh)
};

export const MC3_TIMING = {
  cardFlip: 400,
  dragSnap: 300,
  scenarioBranch: 600,
  insightReveal: 800,
  stampDrop: 500,
  mythBust: 350,
};
