/*
 * constants/exerciseIllustrations.ts
 * ────────────────────────────────────────────────────────────────
 * Maps exercise tags and IDs to illustration component names.
 * Used by components/intervention/ExerciseIllustration.tsx
 * ────────────────────────────────────────────────────────────────
 */

export const EXERCISE_ILLUSTRATION_MAP: Record<string, string> = {
  // ── By tag ───────────────────────────────────────────────────
  'eft':             'IllustrationStep05',      // Vulnerability/EFT exercises
  'repair':          'IllustrationStep09',      // Repair conversation
  'breathing':       'IllustrationF20CoRegulate', // Any breathing exercise
  'grounding':       'IllustrationF20Grounding',  // 5-4-3-2-1 grounding
  'ifs':             'IllustrationIFSSelf',       // IFS parts exercises
  'ifs-protector':   'IllustrationIFSManager',    // Protector dialogue
  'ifs-firefighter': 'IllustrationIFSFirefighter',// Firefighter work
  'wot-hyper':       'IllustrationWoTHyper',      // Above-window exercises
  'wot-hypo':        'IllustrationWoTHypo',       // Below-window exercises
  'wot-regulate':    'IllustrationWoTRegulated',  // Regulation exercises
  'values':          'IllustrationAssessValues',  // Values exercises
  'co-regulation':   'IllustrationF20CoRegulate', // Partner breathing

  // ── By specific exercise ID (override tag) ───────────────────
  'grounding-5-4-3-2-1':   'IllustrationF20Grounding',
  'repair-conversation':   'IllustrationStep09',
  'hold-me-tight':         'IllustrationStep04',
  'soft-startup':          'IllustrationStep07',
  'parts-check-in':        'IllustrationIFSSelf',
  'protector-dialogue':    'IllustrationIFSManager',
  'window-check':          'IllustrationWoTDiagram',
  'co-regulation-breath':  'IllustrationF20CoRegulate',
  'values-compass':        'IllustrationAssessValues',
  'defusion':              'IllustrationStep03',
};

export function getExerciseIllustration(exerciseId: string, tags: string[]): string | null {
  // Check specific ID first
  if (EXERCISE_ILLUSTRATION_MAP[exerciseId]) return EXERCISE_ILLUSTRATION_MAP[exerciseId];
  // Then check tags in order
  for (const tag of tags) {
    if (EXERCISE_ILLUSTRATION_MAP[tag]) return EXERCISE_ILLUSTRATION_MAP[tag];
  }
  return null;
}
