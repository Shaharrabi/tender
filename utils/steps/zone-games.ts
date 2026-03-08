/**
 * Zone Games Registry — Maps each step to its interactive HTML game (The Field).
 *
 * Each step in the 12-step journey has a corresponding "zone" game —
 * a playful, embodied HTML experience that lives inside the step-detail
 * learning guide section. Both partners play on their own phone; completion
 * is tracked through practice_completions.
 */

export interface ZoneGameConfig {
  /** Step number (1-12) */
  stepNumber: number;
  /** Zone number (matches the HTML file name) */
  zoneNumber: number;
  /** Display name shown in the card */
  title: string;
  /** Short subtitle / teaser */
  subtitle: string;
  /** The zone's metaphorical name */
  zoneName: string;
  /** Approximate duration in minutes */
  durationMinutes: number;
}

/**
 * One game per step. Zone number matches step number.
 */
export const ZONE_GAMES: ZoneGameConfig[] = [
  {
    stepNumber: 1,
    zoneNumber: 1,
    title: 'The Fog Field',
    subtitle: 'Walk through the fog between you',
    zoneName: 'Zone I',
    durationMinutes: 5,
  },
  {
    stepNumber: 2,
    zoneNumber: 2,
    title: 'The Window',
    subtitle: 'Find your window of tolerance',
    zoneName: 'Zone II',
    durationMinutes: 4,
  },
  {
    stepNumber: 3,
    zoneNumber: 3,
    title: 'The Story Field',
    subtitle: 'Put down the stories you carry',
    zoneName: 'Zone III',
    durationMinutes: 5,
  },
  {
    stepNumber: 4,
    zoneNumber: 4,
    title: 'The Mirror Lake',
    subtitle: 'Collect reflections in the water',
    zoneName: 'Zone IV',
    durationMinutes: 4,
  },
  {
    stepNumber: 5,
    zoneNumber: 5,
    title: 'The Cave of Echoes',
    subtitle: 'Listen to what echoes back',
    zoneName: 'Zone V',
    durationMinutes: 4,
  },
  {
    stepNumber: 6,
    zoneNumber: 6,
    title: 'The Wall',
    subtitle: 'Find what is behind the wall',
    zoneName: 'Zone VI',
    durationMinutes: 4,
  },
  {
    stepNumber: 7,
    zoneNumber: 7,
    title: 'The Garden',
    subtitle: 'Plant what you want to grow',
    zoneName: 'Zone VII',
    durationMinutes: 5,
  },
  {
    stepNumber: 8,
    zoneNumber: 8,
    title: 'The Ruins',
    subtitle: 'Rebuild from what remains',
    zoneName: 'Zone VIII',
    durationMinutes: 4,
  },
  {
    stepNumber: 9,
    zoneNumber: 9,
    title: 'The Bridge',
    subtitle: 'Build the bridge between you',
    zoneName: 'Zone IX',
    durationMinutes: 5,
  },
  {
    stepNumber: 10,
    zoneNumber: 10,
    title: 'The Watchtower',
    subtitle: 'See the whole landscape clearly',
    zoneName: 'Zone X',
    durationMinutes: 4,
  },
  {
    stepNumber: 11,
    zoneNumber: 11,
    title: 'The Observatory',
    subtitle: 'Connect the constellations',
    zoneName: 'Zone XI',
    durationMinutes: 5,
  },
  {
    stepNumber: 12,
    zoneNumber: 12,
    title: 'The Crossroads',
    subtitle: 'Choose your path forward',
    zoneName: 'Zone XII',
    durationMinutes: 5,
  },
];

/**
 * Get the zone game config for a given step number.
 */
export function getZoneGame(stepNumber: number): ZoneGameConfig | null {
  return ZONE_GAMES.find(g => g.stepNumber === stepNumber) ?? null;
}
