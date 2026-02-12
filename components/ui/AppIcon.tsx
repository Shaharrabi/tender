/**
 * AppIcon — Unified icon component for Tender
 *
 * Renders either emoji icons (from the centralized constants)
 * or falls back to Text-based rendering. All icons in the app
 * should go through this component for consistency.
 *
 * Usage:
 *   <AppIcon name="streak" size={24} />          // emoji from STAT_ICONS
 *   <AppIcon emoji="🔥" size={24} />             // direct emoji
 *   <AppIcon name="back" category="nav" size={20} />  // nav icon
 */

import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import {
  CATEGORY_ICONS,
  MODE_ICONS,
  DIFFICULTY_ICONS,
  STAT_ICONS,
  NAV_ICONS,
  ASSESSMENT_ICONS,
  STATE_ICONS,
  MODALITY_ICONS,
} from '@/constants/icons';

// ─── Icon Category Maps ─────────────────────────────────

type IconCategory =
  | 'category'
  | 'mode'
  | 'difficulty'
  | 'stat'
  | 'nav'
  | 'assessment'
  | 'state'
  | 'modality';

const ICON_MAPS: Record<IconCategory, Record<string, string>> = {
  category: CATEGORY_ICONS,
  mode: MODE_ICONS,
  difficulty: DIFFICULTY_ICONS,
  stat: STAT_ICONS as Record<string, string>,
  nav: NAV_ICONS as Record<string, string>,
  assessment: ASSESSMENT_ICONS,
  state: STATE_ICONS,
  modality: MODALITY_ICONS,
};

// Flat lookup across all maps
function resolveIcon(name: string, category?: IconCategory): string | null {
  // If category is specified, look there first
  if (category && ICON_MAPS[category]) {
    const found = ICON_MAPS[category][name];
    if (found) return found;
  }

  // Otherwise search all maps
  for (const map of Object.values(ICON_MAPS)) {
    if (map[name]) return map[name];
  }

  return null;
}

// ─── Props ──────────────────────────────────────────────

interface AppIconProps {
  /** Icon name from constants/icons.ts (e.g., "streak", "home", "regulation") */
  name?: string;
  /** Direct emoji character to render */
  emoji?: string;
  /** Which icon category to look in first */
  category?: IconCategory;
  /** Icon size in points (default: 24) */
  size?: number;
  /** Text color (only applies to text-based icons like ‹ › ✕) */
  color?: string;
  /** Additional text styles */
  style?: TextStyle;
}

// ─── Component ──────────────────────────────────────────

export default function AppIcon({
  name,
  emoji,
  category,
  size = 24,
  color,
  style,
}: AppIconProps) {
  // Priority: direct emoji > named lookup > null
  let icon = emoji ?? null;

  if (!icon && name) {
    icon = resolveIcon(name, category);
  }

  if (!icon) return null;

  return (
    <Text
      style={[
        styles.icon,
        { fontSize: size, lineHeight: size * 1.2 },
        color ? { color } : undefined,
        style,
      ]}
      accessibilityLabel={name || 'icon'}
    >
      {icon}
    </Text>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
