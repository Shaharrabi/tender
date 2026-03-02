/**
 * Design tokens for Tender — "Wes Anderson"
 *
 * Grand Budapest Hotel meets Moonrise Kingdom.
 * Dusty rose primary, lobby blue secondary, warm parchment backgrounds,
 * curated Google Fonts (Jost, Josefin Sans, Playfair Display),
 * precise geometry, and vintage warmth.
 */

// ─── Colors ──────────────────────────────────────────────

export const Colors = {
  // Primary — Dusty Rose (darkened for WCAG AA: #A84D59 on white ≥ 4.5:1)
  primary: '#A84D59',
  primaryLight: '#E6A0C4',    // Mendl's Pink
  primaryDark: '#8B3A4A',     // Deep Rose
  primaryFaded: '#F4D5D0',    // Blush Whisper — subtle backgrounds, cards

  // Secondary — Lobby Blue (darkened for WCAG AA: #4A6FA8 on white ≥ 4.5:1)
  secondary: '#4A6FA8',
  secondaryLight: '#C6CDF7',  // Lavender Haze
  secondaryDark: '#4A6699',   // Twilight Blue

  // Accent
  accent: '#D8A499',          // Warm Terracotta
  accentGold: '#D4A843',      // Concierge Gold — premium feel, star ratings
  accentCream: '#F1BB7B',     // Budapest Cream — warm highlight backgrounds

  // Semantic role colors (unchanged — revisit Phase 2)
  depth: '#5B6B8A',           // Muted indigo — depth, reflection
  calm: '#6BA3A0',            // Soft teal — calm, regulation

  // Surfaces
  background: '#FDF6F0',      // Warm Parchment — main app background
  backgroundAlt: '#FAF0E6',   // Linen — alternate sections, card backgrounds
  surface: '#FFFFFF',          // White — card surfaces, input fields
  surfaceElevated: '#FFF8F2', // Warm White — elevated cards, modals
  overlay: 'rgba(45, 34, 38, 0.4)',

  // Text
  text: '#2D2226',            // Warm Almost-Black
  textSecondary: '#6B5B5E',   // Warm Gray
  textMuted: '#6B5E61',       // Muted Mauve (darkened for WCAG AA: ≥ 4.5:1 on #FDF6F0)
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',

  // Borders
  border: '#E0D3CE',          // Warm Sand
  borderLight: '#F0E6E0',     // Faint Blush
  borderFocus: '#A84D59',     // Dusty Rose — focused inputs (matches primary)

  // Semantic
  success: '#6B9080',         // Muted Sage
  warning: '#D4A843',         // Concierge Gold
  error: '#C93312',           // Anderson Red
  errorLight: '#FDEAE5',      // Pale Rose

  // Attachment style quadrants
  attachmentSecure: '#6B9080',   // Muted Sage — calm, grounded
  attachmentAnxious: '#A84D59',  // Dusty Rose — conflicted, tender (matches primary)
  attachmentAvoidant: '#4A6FA8', // Lobby Blue — distant, cool (matches secondary)
  attachmentFearful: '#D8A499',  // Warm Terracotta — seeking, alert

  // Assessment progress
  progressTrack: '#F0E6E0',     // Faint Blush — unfilled
  progressFill: '#A84D59',      // Dusty Rose — filled (matches primary)
  progressComplete: '#6B9080',  // Muted Sage — completed

  // Aliases & extensions
  pink: '#E6A0C4',              // Alias for primaryLight (Mendl's Pink)
  focus: '#4A6FA8',             // Alias for secondary — focus states (matches secondary)

  // Utility
  white: '#FFFFFF',
  black: '#2D2226',
};

// ─── Typography ──────────────────────────────────────────

export const FontFamilies = {
  heading: 'Jost_500Medium',              // Futura-inspired geometric — display & headings
  body: 'JosefinSans_400Regular',         // Geometric elegance — body & UI text
  accent: 'PlayfairDisplay_600SemiBold',  // Sophisticated serif — scores, quotes, special moments
};

export const FontSizes = {
  headingXL: 32,
  headingL: 24,
  headingM: 20,
  headingS: 17,
  xl: 32,
  lg: 24,
  md: 20,
  body: 16,
  sm: 14,
  bodySmall: 14,
  xs: 12,
  caption: 12,
};

// ─── Typography Presets (composite styles for gradual adoption) ──

export const Typography = {
  // Display — Jost (Futura-inspired)
  displayLarge: {
    fontFamily: 'Jost_300Light',
    fontSize: 36,
    letterSpacing: 3,
    lineHeight: 44,
    textTransform: 'uppercase' as const,
  },
  displayMedium: {
    fontFamily: 'Jost_400Regular',
    fontSize: 28,
    letterSpacing: 2.5,
    lineHeight: 36,
    textTransform: 'uppercase' as const,
  },

  // Headings — Jost
  headingXL: {
    fontFamily: 'Jost_700Bold',
    fontSize: 28,
    letterSpacing: 1.5,
    lineHeight: 36,
  },
  headingL: {
    fontFamily: 'Jost_600SemiBold',
    fontSize: 24,
    letterSpacing: 1.2,
    lineHeight: 32,
  },
  headingM: {
    fontFamily: 'Jost_500Medium',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 28,
  },
  headingS: {
    fontFamily: 'Jost_500Medium',
    fontSize: 17,
    letterSpacing: 0.8,
    lineHeight: 24,
  },

  // Body — Josefin Sans
  bodyLarge: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 17,
    letterSpacing: 0.3,
    lineHeight: 26,
  },
  body: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 16,
    letterSpacing: 0.2,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  bodyMedium: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 16,
    letterSpacing: 0.2,
    lineHeight: 24,
  },

  // UI Elements
  button: {
    fontFamily: 'Jost_600SemiBold',
    fontSize: 15,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  buttonSmall: {
    fontFamily: 'Jost_500Medium',
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: 12,
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  inputText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 16,
    letterSpacing: 0.2,
  },

  // Accent / Serif — Playfair Display (use sparingly)
  serifDisplay: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 48,
    letterSpacing: -0.5,
    lineHeight: 56,
  },
  serifHeading: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 32,
  },
  serifBody: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 28,
  },
  serifItalic: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 28,
    fontStyle: 'italic' as const,
  },
  serifScore: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 56,
    letterSpacing: -1,
    lineHeight: 64,
  },
};

// ─── Spacing ─────────────────────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ─── Sizes ───────────────────────────────────────────────

export const ButtonSizes = {
  large: 48,
  medium: 40,
  small: 32,
};

export const BorderRadius = {
  sm: 4,       // Crisp — Anderson geometric precision
  md: 8,       // Standard cards
  lg: 12,      // Buttons, prominent cards
  xl: 20,      // Modal containers
  pill: 999,
  round: 999,  // Alias for pill — fully round
};

// ─── Shadows ─────────────────────────────────────────────
// Warm shadow color (#2D2226), not cool gray

export const Shadows = {
  sm: {
    shadowColor: '#2D2226',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  subtle: {
    shadowColor: '#2D2226',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#2D2226',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#2D2226',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 5,
  },
};
