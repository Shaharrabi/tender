/**
 * Icon constants — centralized SVG icon mapping for Tender.
 *
 * Each map value is a React component from assets/graphics/icons.
 * All icons accept { size, color } props for consistent rendering.
 *
 * Previously used emoji strings; now uses hand-drawn line-art SVGs
 * for a cohesive Wes Anderson aesthetic across all platforms.
 */

import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';

import {
  MeditationIcon,
  ChatBubbleIcon,
  HeartDoubleIcon,
  CompassIcon,
  MirrorIcon,
  CommunityIcon,
  HandshakeIcon,
  SeedlingIcon,
  LeafIcon,
  TreeIcon,
  SparkleIcon,
  TargetIcon,
  CalendarIcon,
  FireIcon,
  CheckmarkIcon,
  ChartBarIcon,
  HourglassIcon,
  BrainIcon,
  CoupleIcon,
  RefreshIcon,
  AnchorIcon,
  LightningIcon,
  HomeIcon,
  ShieldIcon,
  HeartIcon,
  DoveIcon,
  MasksIcon,
  ScaleIcon,
  BookOpenIcon,
  SearchIcon,
  StarIcon,
  LinkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
  MenuIcon,
  SettingsIcon,
  WaveIcon,
  GreenHeartIcon,
  SnowflakeIcon,
  SwirlyIcon,
  PersonIcon,
} from '@/assets/graphics/icons';

// ─── Shared type for all icon maps ─────────────────────

export type IconComponent = ComponentType<IconProps>;

// ─── Exercise Category Icons ────────────────────────────

export const CATEGORY_ICONS: Record<string, IconComponent> = {
  regulation: MeditationIcon,
  communication: ChatBubbleIcon,
  attachment: HeartDoubleIcon,
  values: CompassIcon,
  differentiation: MirrorIcon,
};

// ─── Exercise Mode Icons ────────────────────────────────

export const MODE_ICONS: Record<string, IconComponent> = {
  solo: MeditationIcon,
  together: CommunityIcon,
  either: HandshakeIcon,
};

// ─── Difficulty Icons ───────────────────────────────────

export const DIFFICULTY_ICONS: Record<string, IconComponent> = {
  beginner: SeedlingIcon,
  intermediate: LeafIcon,
  advanced: TreeIcon,
};

// ─── Score/Stats Icons ──────────────────────────────────

export const STAT_ICONS: Record<string, IconComponent> = {
  pathways: SparkleIcon,
  milestones: TargetIcon,
  checkIns: CalendarIcon,
  streak: FireIcon,
  completed: CheckmarkIcon,
  progress: ChartBarIcon,
  time: HourglassIcon,
  regulation: MeditationIcon,
  window: MeditationIcon,
  values: StarIcon,
  self: BrainIcon,
  partner: CoupleIcon,
  cycle: RefreshIcon,
  growth: SeedlingIcon,
  anchor: AnchorIcon,
  strength: LightningIcon,
  focus: TargetIcon,
  lenses: SearchIcon,
  overview: HomeIcon,
  scores: ChartBarIcon,
  synthesis: LinkIcon,
  shield: ShieldIcon,
  heart: HeartIcon,
  spark: LightningIcon,
  dove: DoveIcon,
  compass: CompassIcon,
  masks: MasksIcon,
  scale: ScaleIcon,
  fire: FireIcon,
  book: BookOpenIcon,
  search: SearchIcon,
  star: StarIcon,
  leaf: LeafIcon,
  link: LinkIcon,
  brain: BrainIcon,
  handshake: HandshakeIcon,
  pause: HourglassIcon,
};

// ─── Navigation Icons ───────────────────────────────────

export const NAV_ICONS: Record<string, IconComponent> = {
  back: ArrowLeftIcon,
  forward: ArrowRightIcon,
  close: CloseIcon,
  menu: MenuIcon,
  home: HomeIcon,
  chat: LeafIcon,
  portrait: ChartBarIcon,
  exercises: TargetIcon,
  partner: CoupleIcon,
  settings: SettingsIcon,
};

// ─── Assessment Icons ───────────────────────────────────

export const ASSESSMENT_ICONS: Record<string, IconComponent> = {
  'ecr-r': HeartDoubleIcon,
  dutch: MirrorIcon,
  sseit: BrainIcon,
  'dsi-r': WaveIcon,
  'ipip-neo-120': MasksIcon,
  values: CompassIcon,
  rdas: CoupleIcon,
  dci: HandshakeIcon,
  'csi-16': HeartIcon,
};

// ─── Nervous System State Icons ─────────────────────────

export const STATE_ICONS: Record<string, IconComponent> = {
  REGULATED: GreenHeartIcon,
  ACTIVATED: FireIcon,
  SHUTDOWN: SnowflakeIcon,
  MIXED: SwirlyIcon,
};

// ─── Therapeutic Modality Icons ─────────────────────────

export const MODALITY_ICONS: Record<string, IconComponent> = {
  EFT: HeartDoubleIcon,
  Gottman: HomeIcon,
  IBCT: HandshakeIcon,
  ACT: CompassIcon,
  DBT: ScaleIcon,
  IFS: MirrorIcon,
  PACT: ShieldIcon,
};

// ─── Flat lookup for all icon maps ──────────────────────

const ALL_ICON_MAPS: Record<string, Record<string, IconComponent>> = {
  category: CATEGORY_ICONS,
  mode: MODE_ICONS,
  difficulty: DIFFICULTY_ICONS,
  stat: STAT_ICONS,
  nav: NAV_ICONS,
  assessment: ASSESSMENT_ICONS,
  state: STATE_ICONS,
  modality: MODALITY_ICONS,
};

export type IconCategory = keyof typeof ALL_ICON_MAPS;

/**
 * Resolve an icon by name, optionally scoped to a category.
 * Returns the icon component or null if not found.
 */
export function resolveIcon(
  name: string,
  category?: IconCategory
): IconComponent | null {
  if (category && ALL_ICON_MAPS[category]) {
    const found = ALL_ICON_MAPS[category][name];
    if (found) return found;
  }

  // Search all maps
  for (const map of Object.values(ALL_ICON_MAPS)) {
    if (map[name]) return map[name];
  }

  return null;
}
