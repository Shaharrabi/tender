/**
 * Icon constants — centralized emoji/icon tokens used throughout the app.
 *
 * Using emoji provides rich visual cues without needing icon libraries.
 * This file keeps them consistent across all screens.
 */

// ─── Exercise Category Icons ────────────────────────────

export const CATEGORY_ICONS: Record<string, string> = {
  regulation: '🧘',
  communication: '💬',
  attachment: '💕',
  values: '🧭',
  differentiation: '🪞',
};

// ─── Exercise Mode Icons ────────────────────────────────

export const MODE_ICONS: Record<string, string> = {
  solo: '🧘',
  together: '👥',
  either: '🤝',
};

// ─── Difficulty Icons ───────────────────────────────────

export const DIFFICULTY_ICONS: Record<string, string> = {
  beginner: '🌱',
  intermediate: '🌿',
  advanced: '🌳',
};

// ─── Score/Stats Icons ──────────────────────────────────

export const STAT_ICONS = {
  pathways: '✨',
  milestones: '🎯',
  checkIns: '📅',
  streak: '🔥',
  completed: '✅',
  progress: '📈',
  time: '⏱️',
  regulation: '🧘',
  window: '🪟',
  values: '💎',
  self: '🧠',
  partner: '💑',
  cycle: '🔄',
  growth: '🌱',
  anchor: '⚓',
  strength: '💪',
  focus: '🎯',
  lenses: '🔮',
  overview: '🏠',
  scores: '📊',
  synthesis: '🧬',
  shield: '🛡️',
  heart: '❤️',
  spark: '⚡',
  dove: '🕊️',
  compass: '🧭',
  masks: '🎭',
  scale: '⚖️',
  fire: '🔥',
  book: '📖',
  search: '🔍',
  star: '⭐',
  leaf: '🌿',
  link: '🔗',
  brain: '🧠',
  handshake: '🤝',
  pause: '⏸️',
} as const;

// ─── Navigation Icons ───────────────────────────────────

export const NAV_ICONS = {
  back: '‹',
  forward: '›',
  close: '✕',
  menu: '☰',
  home: '🏠',
  chat: '🌿',
  portrait: '📊',
  exercises: '🏋️',
  partner: '💑',
  settings: '⚙️',
} as const;

// ─── Assessment Icons ───────────────────────────────────

export const ASSESSMENT_ICONS: Record<string, string> = {
  'ecr-r': '💕',
  dutch: '🪞',
  sseit: '🧠',
  'dsi-r': '🌊',
  'ipip-neo-120': '🎭',
  values: '🧭',
  rdas: '💑',
  dci: '🤝',
  'csi-16': '❤️',
};

// ─── Nervous System State Icons ─────────────────────────

export const STATE_ICONS: Record<string, string> = {
  REGULATED: '💚',
  ACTIVATED: '🔥',
  SHUTDOWN: '🧊',
  MIXED: '🌀',
};

// ─── Therapeutic Modality Icons ─────────────────────────

export const MODALITY_ICONS: Record<string, string> = {
  EFT: '💕',
  Gottman: '🏠',
  IBCT: '🤝',
  ACT: '🧭',
  DBT: '⚖️',
  IFS: '🪞',
  PACT: '🛡️',
};
