/**
 * Course icon resolver — maps CourseIconKey to existing Tender icon components.
 */

import React from 'react';
import type { CourseIconKey } from '@/constants/course-data';
import {
  MirrorIcon,
  SeedlingIcon,
  CompassIcon,
  HeartPulseIcon,
  EyeIcon,
  LeafIcon,
  WaveIcon,
  SunIcon,
  BrainIcon,
  DoveIcon,
  HeartDoubleIcon,
  SparkleIcon,
  ShieldIcon,
  MeditationIcon,
} from '@/assets/graphics/icons';

const ICON_MAP: Record<CourseIconKey, React.ComponentType<{ size?: number; color?: string }>> = {
  mirror: MirrorIcon,
  seedling: SeedlingIcon,
  compass: CompassIcon,
  heartPulse: HeartPulseIcon,
  eye: EyeIcon,
  leaf: LeafIcon,
  wave: WaveIcon,
  sun: SunIcon,
  brain: BrainIcon,
  dove: DoveIcon,
  heartDouble: HeartDoubleIcon,
  sparkle: SparkleIcon,
  shield: ShieldIcon,
  meditation: MeditationIcon,
};

export function getCourseIcon(key: CourseIconKey, size = 22, color?: string) {
  const IconComponent = ICON_MAP[key];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} />;
}

export function getCourseIconComponent(key: CourseIconKey) {
  return ICON_MAP[key] ?? null;
}
