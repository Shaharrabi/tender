/**
 * AppIcon — Unified icon component for Tender
 *
 * Renders hand-drawn SVG icons from the centralized icon maps.
 * All icons accept size and color props for consistent theming.
 *
 * Usage:
 *   <AppIcon name="streak" size={24} />                     // from STAT_ICONS
 *   <AppIcon name="home" category="nav" size={20} />        // scoped lookup
 *   <AppIcon icon={HeartIcon} size={24} color="#C4616E" />   // direct component
 */

import React from 'react';
import { View } from 'react-native';
import { resolveIcon, type IconCategory, type IconComponent } from '@/constants/icons';
import { Colors } from '@/constants/theme';

// ─── Props ──────────────────────────────────────────────

interface AppIconProps {
  /** Icon name from constants/icons.ts (e.g., "streak", "home", "regulation") */
  name?: string;
  /** Direct icon component to render */
  icon?: IconComponent;
  /** Which icon category to look in first */
  category?: IconCategory;
  /** Icon size in points (default: 24) */
  size?: number;
  /** Icon color (default: Colors.text) */
  color?: string;
  /** Additional style for the wrapper View */
  style?: any;
}

// ─── Component ──────────────────────────────────────────

export default function AppIcon({
  name,
  icon,
  category,
  size = 24,
  color,
  style,
}: AppIconProps) {
  // Priority: direct icon > named lookup > null
  let IconComp: IconComponent | null = icon ?? null;

  if (!IconComp && name) {
    IconComp = resolveIcon(name, category);
  }

  if (!IconComp) return null;

  const iconColor = color || Colors.text;

  const label = name || 'icon';

  if (style) {
    return (
      <View
        style={style}
        accessibilityRole="image"
        accessibilityLabel={label}
      >
        <IconComp size={size} color={iconColor} />
      </View>
    );
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={label}>
      <IconComp size={size} color={iconColor} />
    </View>
  );
}
