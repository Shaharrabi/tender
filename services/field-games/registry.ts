/**
 * Field Games Registry — Maps step numbers to zone games.
 *
 * Each of the 12 steps has a corresponding "zone" in The Field,
 * a playful HTML5 game that embodies the step's therapeutic concept.
 */

import type { FieldGameMeta } from './bridge';

// Lazy imports — each zone is a separate chunk
import { getZone1Html } from './games/zone1';
import { getZone2Html } from './games/zone2';
import { getZone3Html } from './games/zone3';
import { getZone4Html } from './games/zone4';
import { getZone5Html } from './games/zone5';
import { getZone6Html } from './games/zone6';
import { getZone7Html } from './games/zone7';
import { getZone8Html } from './games/zone8';
import { getZone9Html } from './games/zone9';
import { getZone10Html } from './games/zone10';
import { getZone11Html } from './games/zone11';
import { getZone12Html } from './games/zone12';

// ─── Metadata ────────────────────────────────────────────

export const FIELD_GAMES: FieldGameMeta[] = [
  { id: 'zone-1',  stepNumber: 1,  zoneName: 'The Fog Field',       zoneIcon: '🌫️', subtitle: 'See the pattern',              estimatedMinutes: 3 },
  { id: 'zone-2',  stepNumber: 2,  zoneName: 'The Window',          zoneIcon: '🪟', subtitle: 'Find your window',             estimatedMinutes: 3 },
  { id: 'zone-3',  stepNumber: 3,  zoneName: 'The Story Field',     zoneIcon: '📖', subtitle: 'Defuse the narrative',          estimatedMinutes: 3 },
  { id: 'zone-4',  stepNumber: 4,  zoneName: 'The Mirror Lake',     zoneIcon: '🪞', subtitle: 'Collect your reflections',      estimatedMinutes: 4 },
  { id: 'zone-5',  stepNumber: 5,  zoneName: 'The Cave of Echoes',  zoneIcon: '🕯️', subtitle: 'Rally truths together',         estimatedMinutes: 4 },
  { id: 'zone-6',  stepNumber: 6,  zoneName: 'The Wall',            zoneIcon: '🧱', subtitle: 'Break the enemy story',         estimatedMinutes: 4 },
  { id: 'zone-7',  stepNumber: 7,  zoneName: 'The Garden',          zoneIcon: '🌱', subtitle: 'Plant your practices',          estimatedMinutes: 4 },
  { id: 'zone-8',  stepNumber: 8,  zoneName: 'The Ruins',           zoneIcon: '🏚️', subtitle: 'Gather what remains',           estimatedMinutes: 4 },
  { id: 'zone-9',  stepNumber: 9,  zoneName: 'The Bridge',          zoneIcon: '🌉', subtitle: 'Build it together',             estimatedMinutes: 3 },
  { id: 'zone-10', stepNumber: 10, zoneName: 'The Watchtower',      zoneIcon: '🗼', subtitle: 'Maintain awareness',            estimatedMinutes: 3 },
  { id: 'zone-11', stepNumber: 11, zoneName: 'The Observatory',     zoneIcon: '🔭', subtitle: 'Connect the stars',             estimatedMinutes: 4 },
  { id: 'zone-12', stepNumber: 12, zoneName: 'The Crossroads',      zoneIcon: '🛤️', subtitle: 'Choose your path',              estimatedMinutes: 3 },
];

// ─── HTML Generators ─────────────────────────────────────

const HTML_GENERATORS: Record<number, () => string> = {
  1:  getZone1Html,
  2:  getZone2Html,
  3:  getZone3Html,
  4:  getZone4Html,
  5:  getZone5Html,
  6:  getZone6Html,
  7:  getZone7Html,
  8:  getZone8Html,
  9:  getZone9Html,
  10: getZone10Html,
  11: getZone11Html,
  12: getZone12Html,
};

// ─── Public API ──────────────────────────────────────────

/** Get metadata for a field game by step number. */
export function getFieldGameForStep(stepNumber: number): FieldGameMeta | undefined {
  return FIELD_GAMES.find((g) => g.stepNumber === stepNumber);
}

/** Get the complete HTML for a field game by step number. */
export function getFieldGameHtml(stepNumber: number): string | null {
  const generator = HTML_GENERATORS[stepNumber];
  return generator ? generator() : null;
}
