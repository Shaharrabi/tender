/**
 * FTUE Design Tokens
 *
 * FTUE-specific tokens that build on the main theme.
 * Uses existing Colors, Spacing, etc. from constants/theme.ts.
 */

import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/theme';

// ─── FTUE Colors ──────────────────────────────────────────────────────────

export const FTUEColors = {
  /** Warm gold for highlights, CTA buttons, progress fills */
  highlight: Colors.accentGold,        // #D4A843

  /** Tooltip / tour card background */
  cardBg: Colors.background,           // #FDF6F0

  /** Backdrop overlay */
  backdrop: 'rgba(45, 34, 38, 0.6)',

  /** Spotlight border around target elements */
  spotlightBorder: Colors.accentGold,  // #D4A843

  /** Text colors */
  title: Colors.text,                  // #2D2226
  body: Colors.textSecondary,          // #6B5B5E
  muted: Colors.textMuted,            // #9B8E91

  /** CTA button */
  ctaBg: Colors.accentGold,            // #D4A843
  ctaText: Colors.white,               // #FFFFFF

  /** Progress bar */
  progressTrack: Colors.progressTrack, // #F0E6E0
  progressFill: Colors.accentGold,     // #D4A843

  /** Audio player bar */
  audioBg: Colors.text,                // #2D2226 (dark bar)
  audioText: Colors.white,

  /** Highlight glow shadow */
  glowShadow: Colors.accentGold,      // #D4A843
};

// ─── FTUE Spacing & Sizing ────────────────────────────────────────────────

export const FTUELayout = {
  /** Tooltip card */
  tooltipPadding: Spacing.md,          // 16
  tooltipMaxWidth: 280,
  tooltipBorderRadius: BorderRadius.lg, // 12
  tooltipPointerSize: 12,

  /** Tour card */
  tourCardPadding: Spacing.lg,         // 24
  tourCardBorderRadius: BorderRadius.xl, // 20
  tourCardMarginH: Spacing.lg,         // 24

  /** Highlight animation */
  highlightBorderWidth: 2,
  highlightBorderRadius: BorderRadius.md, // 8

  /** Empty state */
  emptyIconSize: 80,
  emptyIconBorderRadius: 40,

  /** Audio player */
  audioBarHeight: 3,
  audioButtonSize: 44,
};

// ─── FTUE Animation Timing ────────────────────────────────────────────────

export const FTUETiming = {
  /** Highlight animation (total ~500ms — very quick flash) */
  highlightEnter: 100,
  highlightHold: 200,
  highlightExit: 100,
  highlightPulseCount: 1,
  highlightPulseDuration: 200,

  /** Tooltip */
  tooltipFadeIn: 200,
  tooltipFadeOut: 150,

  /** Tour */
  tourTransition: 200,

  /** Audio welcome */
  audioFadeIn: 250,
  audioFadeOut: 250,
  audioAutoPlayDelay: 400,

  /** General */
  measureDelay: 200, // delay before measuring (let scroll animation + layout settle)
};

// ─── FTUE Typography ──────────────────────────────────────────────────────

export const FTUETypography = {
  tooltipTitle: {
    ...Typography.headingS,
    color: FTUEColors.title,
  },
  tooltipBody: {
    ...Typography.body,
    color: FTUEColors.body,
  },
  tourTitle: {
    ...Typography.headingM,
    color: FTUEColors.title,
    textAlign: 'center' as const,
  },
  tourBody: {
    ...Typography.body,
    color: FTUEColors.body,
    textAlign: 'center' as const,
  },
  emptyTitle: {
    ...Typography.headingS,
    color: FTUEColors.title,
    textAlign: 'center' as const,
  },
  emptyBody: {
    ...Typography.body,
    color: FTUEColors.body,
    textAlign: 'center' as const,
  },
  ctaText: {
    ...Typography.button,
    color: FTUEColors.ctaText,
  },
};

// ─── FTUE Shadows ─────────────────────────────────────────────────────────

export const FTUEShadows = {
  /** Glow effect for highlight animation */
  highlightGlow: {
    shadowColor: FTUEColors.glowShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  /** Tooltip card shadow */
  tooltipCard: Shadows.elevated,
  /** Tour card shadow */
  tourCard: {
    shadowColor: '#2D2226',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};
