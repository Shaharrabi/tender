/**
 * Matrix Domain Colors — Wes Anderson palette
 *
 * Each domain gets a warm, muted color that tells the story
 * before a single word is read. Soft pastels, vintage warmth.
 */

export const MATRIX_COLORS = {
  foundation: {
    bg: '#E8C4C4',     // Blush — attachment, nervous system
    text: '#5C2828',
    label: '#7A3E3E',
    accent: '#D4A0A0',
  },
  instrument: {
    bg: '#9BB3C9',     // Dusty Blue — personality, who you are
    text: '#1E3148',
    label: '#3A5570',
    accent: '#7A96B3',
  },
  navigation: {
    bg: '#B5C4A8',     // Sage — emotional intelligence, field awareness
    text: '#2A3A1E',
    label: '#4A5E3E',
    accent: '#96AC86',
  },
  stance: {
    bg: '#C4917A',     // Terracotta — differentiation, holding ground
    text: '#3E2118',
    label: '#5E3E30',
    accent: '#A8725A',
  },
  conflict: {
    bg: '#D4B96A',     // Mustard — conflict style, how you fight
    text: '#3A2E0E',
    label: '#5A4E1E',
    accent: '#C4A44A',
  },
  compass: {
    bg: '#A88BA5',     // Plum — values, what matters
    text: '#3A1E38',
    label: '#5A3E58',
    accent: '#8E6E8B',
  },
  field: {
    bg: '#B5C4A8',     // Sage (shared with navigation) — WEARE, the space between
    text: '#2A3A1E',
    label: '#4A5E3E',
    accent: '#96AC86',
  },
  invitation: {
    bg: '#E8DFD0',     // Cream — the one invitation
    text: '#4A4236',
    label: '#6A6256',
    accent: '#D4C8B4',
  },
} as const;

export type MatrixColorKey = keyof typeof MATRIX_COLORS;

/** Confidence badge colors */
export const CONFIDENCE_COLORS = {
  high: { bg: '#E3EFE5', text: '#4A6F50', label: 'Strong signal' },
  emerging: { bg: '#FDF3E0', text: '#8B6914', label: 'Pattern emerging' },
  low: { bg: '#F0E6E0', text: '#6B5E61', label: 'Still unfolding' },
} as const;

export type ConfidenceLevel = keyof typeof CONFIDENCE_COLORS;
