/**
 * Design tokens for Tender — "Warm Analytic Minimalism"
 *
 * Warm neutrals as the foundation, with sage green (growth),
 * terracotta (warmth/connection), soft amber (highlights),
 * muted indigo (depth/reflection), and soft teal (calm/regulation).
 */

import { Platform } from 'react-native';

// ─── Colors ──────────────────────────────────────────────

export const Colors = {
  // Primary & secondary
  primary: '#6B8F71',        // Sage green — growth, positive actions
  primaryLight: '#8BAF91',
  primaryDark: '#567358',
  secondary: '#C4785B',      // Terracotta — warmth, connection
  secondaryLight: '#D4926F',
  accent: '#D4A55A',         // Soft amber — highlights, accents
  depth: '#5B6B8A',          // Muted indigo — depth, reflection
  calm: '#6BA3A0',           // Soft teal — calm, regulation

  // Surfaces
  background: '#FAF8F5',     // Warm white
  surface: '#F2EDE7',        // Linen — cards, panels
  surfaceElevated: '#FFFFFF', // Pure white for elevated cards
  overlay: 'rgba(45, 45, 45, 0.4)',

  // Text
  text: '#2D2D2D',          // Charcoal
  textSecondary: '#8A8578',  // Warm gray
  textMuted: '#B5AFA6',      // Light warm gray
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',

  // Borders
  border: '#E8E2DA',         // Warm border
  borderLight: '#F0EBE4',    // Very subtle border

  // Semantic
  success: '#6B8F71',        // Sage green (reuse primary)
  warning: '#D4A55A',        // Soft amber (reuse accent)
  error: '#C4585B',          // Warm red
  errorLight: '#F5E0E0',

  // Utility
  white: '#FFFFFF',
  black: '#2D2D2D',
};

// ─── Typography ──────────────────────────────────────────

export const FontFamilies = {
  heading: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'Georgia, serif',
  }) as string,
  body: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'system-ui, -apple-system, sans-serif',
  }) as string,
};

export const FontSizes = {
  headingXL: 32,
  headingL: 24,
  headingM: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

// ─── Shadows ─────────────────────────────────────────────

export const Shadows = {
  subtle: {
    shadowColor: '#8A8578',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    shadowColor: '#8A8578',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#8A8578',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
};
