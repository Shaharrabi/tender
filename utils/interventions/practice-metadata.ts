/**
 * Practice Metadata — Four Movements, Vulnerability, Entry States
 *
 * Centralized metadata for all 32 exercises, mapping each practice to:
 *   - fourMovement: which of the Four Movements it primarily cultivates
 *   - vulnerabilityLevel: how emotionally exposed the practice is
 *   - bestEntryStates: ideal nervous-system states to begin
 *
 * These are applied at registry time so every Intervention object
 * carries its full metadata without modifying individual exercise files.
 */

import type { FourMovement, VulnerabilityLevel } from '@/types/intervention';
import type { NervousSystemState } from '@/types/chat';

export interface PracticeMetadataEntry {
  fourMovement: FourMovement;
  vulnerabilityLevel: VulnerabilityLevel;
  bestEntryStates: NervousSystemState[];
}

/**
 * Metadata keyed by exercise ID.
 *
 * Four Movements:
 *   recognition  — seeing patterns, naming what's happening
 *   release      — letting go of fixed stories, defusing
 *   resonance    — attuning, connecting, co-regulating
 *   embodiment   — turning insight into sustained action
 *
 * Vulnerability:
 *   low      — cognitive, observational, no emotional exposure
 *   moderate — some emotional exposure, manageable risk
 *   high     — deep emotional sharing, attachment vulnerability
 */
export const PRACTICE_METADATA: Record<string, PracticeMetadataEntry> = {
  // ─── Regulation (6) ─────────────────────────────────────
  'grounding-5-4-3-2-1': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['ACTIVATED', 'MIXED'],
  },
  'window-of-tolerance-check': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['ACTIVATED', 'IN_WINDOW', 'SHUTDOWN', 'MIXED'],
  },
  'self-compassion-break': {
    fourMovement: 'release',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'ACTIVATED'],
  },
  'distress-tolerance-together': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['ACTIVATED', 'MIXED'],
  },
  'opposite-action': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'ACTIVATED'],
  },
  'radical-acceptance': {
    fourMovement: 'release',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },

  // ─── Communication (10) ─────────────────────────────────
  'soft-startup': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
  },
  'repair-attempt': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
  },
  'turning-toward': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },
  'dreams-within-conflict': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
  },
  'aftermath-of-fight': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
  },
  'unified-detachment': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },
  'empathic-joining': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
  },
  'dear-man': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
  },
  'stress-reducing-conversation': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },
  'four-horsemen-antidotes': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
  },

  // ─── Attachment (10) ────────────────────────────────────
  'emotional-bid': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },
  'love-maps': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },
  'fondness-admiration': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
  },
  'recognize-cycle': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },
  'hold-me-tight': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
  },
  'couple-bubble': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
  },
  'accessing-primary-emotions': {
    fourMovement: 'release',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
  },
  'bonding-through-vulnerability': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
  },
  'protest-polka': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },
  'rituals-of-connection': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },

  // ─── Values (4) ─────────────────────────────────────────
  'values-compass': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
  },
  'relationship-values-compass': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
  },
  'willingness-stance': {
    fourMovement: 'release',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },
  'relationship-mission-statement': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
  },

  // ─── Differentiation (3) ────────────────────────────────
  'parts-check-in': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'ACTIVATED', 'MIXED'],
  },
  'defusion-from-stories': {
    fourMovement: 'release',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
  },
  'protector-dialogue': {
    fourMovement: 'release',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
  },
};

/**
 * Enriches an Intervention with metadata from PRACTICE_METADATA.
 * Returns the same object with added fields (mutates in place for perf).
 */
export function enrichWithMetadata<T extends { id: string }>(exercise: T): T {
  const meta = PRACTICE_METADATA[exercise.id];
  if (meta) {
    Object.assign(exercise, {
      fourMovement: meta.fourMovement,
      vulnerabilityLevel: meta.vulnerabilityLevel,
      bestEntryStates: meta.bestEntryStates,
    });
  }
  return exercise;
}
