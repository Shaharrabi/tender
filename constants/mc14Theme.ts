/**
 * MC14 Theme — Trust Repair palette.
 *
 * Deep slate blue with muted gold for rebuilding trust.
 * Serious, grounded, hopeful. Advanced sequel to MC3 (Rupture to Repair).
 */

export const MC14_PALETTE = {
  // Shared base
  cream: '#F0F2F5',
  ink: '#2C2C2C',
  paper: '#FAFBFD',
  gold: '#D4B483',

  // MC14-specific accents
  slate: '#4A6B8A',               // Primary — stability, trust
  slateLight: '#C4D4E4',         // Light slate for backgrounds
  slateDark: '#355570',          // Dark slate for emphasis
  mutedGold: '#C4A35A',          // Secondary — hope, rebuilding
  mutedGoldLight: '#F0E4C4',     // Light gold background
  mutedGoldDark: '#A08840',      // Darker gold
  warmGray: '#8A8A8A',           // Neutral gray
  warmGrayLight: '#E8E8E8',      // Light gray background
  repairGreen: '#5A9E6F',        // Positive/repair indicator
  repairGreenLight: '#D4F0DF',   // Light green
  woundRed: '#C44A4A',           // Pain/wound indicator
  woundRedLight: '#F0D4D4',      // Light red

  // Trust meter
  trustEmpty: '#E0E4E8',
  trustFilling: '#4A6B8A',
  trustComplete: '#5A9E6F',

  // UI
  cardBg: '#FAFBFD',
  cardBorder: '#D0D8E0',
  saveGreen: '#5A9E6F',
  skipGray: '#9E9E9E',
};

export const MC14_TIMING = {
  anatomyReveal: 400,
  sortDrop: 300,
  timelineStep: 500,
  conversationFade: 350,
  planCheckbox: 250,
  trustMeterFill: 600,
  phaseTransition: 350,
  celebrationBurst: 500,
};
