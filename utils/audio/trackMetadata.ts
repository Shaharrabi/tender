/**
 * Portrait Audio Library — Track Metadata
 *
 * 36 audio tracks across 3 tiers, selected by portrait data.
 * Audio files live at assets/audio/portrait/*.mp3.
 *
 * Tier 1: Orientation (5 tracks — everyone gets all 5)
 * Tier 2: Pattern Tracks (19 tracks — person gets 1 per category)
 * Tier 3: Couple Tracks (7 tracks — couple gets 2-3)
 */

// ─── Types ──────────────────────────────────────────────

export type TrackTier = 1 | 2 | 3;

export type TrackCategory =
  | 'orientation'
  | 'attachment'
  | 'cycle-position'
  | 'window'
  | 'parts'
  | 'detection'
  | 'couple-dance'
  | 'couple-constellation';

export interface TriggerCondition {
  /** What portrait field to check */
  field: string;
  /** Operator for comparison */
  operator: 'eq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'has-pattern' | 'always';
  /** Value to compare against */
  value?: string | number | string[];
}

export interface PortraitTrack {
  id: string;
  title: string;
  /** Duration string (e.g. "2:00") */
  duration: string;
  /** Duration in seconds for sorting/display */
  durationSeconds: number;
  /** Asset path relative to assets/audio/portrait/ */
  filePath: string;
  /** One-line description shown in the card */
  description: string;
  /** Selection tier: 1 = everyone, 2 = pattern-matched, 3 = couple */
  tier: TrackTier;
  /** Category within the tier */
  category: TrackCategory;
  /** Condition(s) that must be met for this track to be selected */
  triggerCondition: TriggerCondition;
}

// ─── Tier 1: Orientation (everyone gets all 5) ──────────

const ORIENTATION_TRACKS: PortraitTrack[] = [
  {
    id: 'O-1',
    title: 'Welcome to Your Portrait',
    duration: '2:00',
    durationSeconds: 120,
    filePath: 'O-1.mp3',
    description: 'What this portrait is — and what it is not. A map, not a verdict.',
    tier: 1,
    category: 'orientation',
    triggerCondition: { field: 'portrait', operator: 'always' },
  },
  {
    id: 'O-2',
    title: 'The Shape of You',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'O-2.mp3',
    description: 'Understanding the seven dimensions of your relational radar.',
    tier: 1,
    category: 'orientation',
    triggerCondition: { field: 'portrait', operator: 'always' },
  },
  {
    id: 'O-3',
    title: 'Your Attachment Style',
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'O-3.mp3',
    description: 'Where you land on the attachment map — and what it means.',
    tier: 1,
    category: 'orientation',
    triggerCondition: { field: 'portrait', operator: 'always' },
  },
  {
    id: 'O-4',
    title: 'Your Window of Tolerance',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'O-4.mp3',
    description: 'The band where you can feel without being hijacked.',
    tier: 1,
    category: 'orientation',
    triggerCondition: { field: 'portrait', operator: 'always' },
  },
  {
    id: 'O-5',
    title: 'Your Growth Edges',
    duration: '2:00',
    durationSeconds: 120,
    filePath: 'O-5.mp3',
    description: 'Where your relationship is asking to evolve — not where you are broken.',
    tier: 1,
    category: 'orientation',
    triggerCondition: { field: 'portrait', operator: 'always' },
  },
];

// ─── Tier 2: Attachment (person gets 1 of 4) ────────────

const ATTACHMENT_TRACKS: PortraitTrack[] = [
  {
    id: 'A-1',
    title: 'The Reaching Heart',
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'A-1.mp3',
    description: 'For the anxious-preoccupied heart — you are not too much.',
    tier: 2,
    category: 'attachment',
    triggerCondition: { field: 'attachmentQuadrant', operator: 'eq', value: 'anxious-preoccupied' },
  },
  {
    id: 'A-2',
    title: 'The Fortress',
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'A-2.mp3',
    description: 'For the dismissive-avoidant — learning to build a door in the wall.',
    tier: 2,
    category: 'attachment',
    triggerCondition: { field: 'attachmentQuadrant', operator: 'eq', value: 'dismissive-avoidant' },
  },
  {
    id: 'A-3',
    title: 'The Pendulum',
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'A-3.mp3',
    description: 'For the fearful-avoidant — wanting closeness and fearing it at once.',
    tier: 2,
    category: 'attachment',
    triggerCondition: { field: 'attachmentQuadrant', operator: 'eq', value: 'fearful-avoidant' },
  },
  {
    id: 'A-4',
    title: 'The Steady Ground',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'A-4.mp3',
    description: 'For the secure base — sharing your steadiness without taking over.',
    tier: 2,
    category: 'attachment',
    triggerCondition: { field: 'attachmentQuadrant', operator: 'eq', value: 'secure' },
  },
];

// ─── Tier 2: Cycle Position (person gets 1 of 3) ────────

const CYCLE_TRACKS: PortraitTrack[] = [
  {
    id: 'C-1',
    title: "The Pursuer's Pattern",
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'C-1.mp3',
    description: 'When stress enters, you move toward. This impulse comes from a beautiful place.',
    tier: 2,
    category: 'cycle-position',
    triggerCondition: { field: 'cyclePosition', operator: 'eq', value: 'pursuer' },
  },
  {
    id: 'C-2',
    title: "The Withdrawer's Pattern",
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'C-2.mp3',
    description: 'You move away — not because you do not care, but because you care so much.',
    tier: 2,
    category: 'cycle-position',
    triggerCondition: { field: 'cyclePosition', operator: 'eq', value: 'withdrawer' },
  },
  {
    id: 'C-3',
    title: 'The Flexible Dance',
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'C-3.mp3',
    description: 'You trade positions depending on the day. That flexibility is a genuine strength.',
    tier: 2,
    category: 'cycle-position',
    triggerCondition: { field: 'cyclePosition', operator: 'in', value: ['flexible', 'mixed'] },
  },
];

// ─── Tier 2: Window of Tolerance (person gets 1 of 3) ───

const WINDOW_TRACKS: PortraitTrack[] = [
  {
    id: 'W-1',
    title: 'The Narrow Window',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'W-1.mp3',
    description: 'Your window is narrower — emotions take over quickly. It can widen.',
    tier: 2,
    category: 'window',
    triggerCondition: { field: 'windowWidth', operator: 'lt', value: 45 },
  },
  {
    id: 'W-2',
    title: 'The Moderate Window',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'W-2.mp3',
    description: 'You can hold intensity — until something hits a nerve. The fluctuation is the key.',
    tier: 2,
    category: 'window',
    triggerCondition: { field: 'windowWidth', operator: 'gte', value: 45 },
    // Note: W-2 selected when windowWidth is 45-65; W-3 overrides when > 65
  },
  {
    id: 'W-3',
    title: 'The Wide Window',
    duration: '2:00',
    durationSeconds: 120,
    filePath: 'W-3.mp3',
    description: 'Your capacity to stay calm is a strength. The shadow side is worth naming.',
    tier: 2,
    category: 'window',
    triggerCondition: { field: 'windowWidth', operator: 'gt', value: 65 },
  },
];

// ─── Tier 2: IFS Parts (person gets 1 of 3) ─────────────

const PARTS_TRACKS: PortraitTrack[] = [
  {
    id: 'P-1',
    title: 'Meeting Your Manager Parts',
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'P-1.mp3',
    description: 'The planners, controllers, perfectionists — bodyguards running on old software.',
    tier: 2,
    category: 'parts',
    triggerCondition: { field: 'managerPartsCount', operator: 'gte', value: 3 },
  },
  {
    id: 'P-2',
    title: 'When Firefighters Take Over',
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'P-2.mp3',
    description: 'The reactive parts that take over after the alarm rings. They are not evil — they are desperate.',
    tier: 2,
    category: 'parts',
    triggerCondition: { field: 'firefighterPartsCount', operator: 'gte', value: 2 },
  },
  {
    id: 'P-3',
    title: 'Your Parts in Balance',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'P-3.mp3',
    description: 'Moderate parts activity — you have developing self-leadership.',
    tier: 2,
    category: 'parts',
    // Default: selected when neither P-1 nor P-2 conditions are met
    triggerCondition: { field: 'partsBalanced', operator: 'eq', value: 'true' },
  },
];

// ─── Tier 2: Detections (person gets 0-3 of 6) ──────────

const DETECTION_TRACKS: PortraitTrack[] = [
  {
    id: 'D-1',
    title: 'High Anxiety + High Yielding',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'D-1.mp3',
    description: 'You accommodate to maintain connection. Each accommodation erodes a little of self.',
    tier: 2,
    category: 'detection',
    triggerCondition: { field: 'patterns', operator: 'has-pattern', value: 'accommodate-to-connect' },
  },
  {
    id: 'D-2',
    title: 'Porous Boundaries',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'D-2.mp3',
    description: 'You sense everything — and absorb it instead of observing it.',
    tier: 2,
    category: 'detection',
    triggerCondition: { field: 'boundaryClarity', operator: 'lt', value: 40 },
  },
  {
    id: 'D-3',
    title: 'Body-Based Intelligence',
    duration: '2:00',
    durationSeconds: 120,
    filePath: 'D-3.mp3',
    description: 'You sense relational shifts in your body before your mind catches up.',
    tier: 2,
    category: 'detection',
    triggerCondition: { field: 'fieldSensitivity', operator: 'gt', value: 80 },
  },
  {
    id: 'D-4',
    title: 'The Values Gap',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'D-4.mp3',
    description: 'A gap between a value you hold deeply and how fully you are living it.',
    tier: 2,
    category: 'detection',
    triggerCondition: { field: 'maxValuesGap', operator: 'gte', value: 3.0 },
  },
  {
    id: 'D-5',
    title: 'Strong Cycle Awareness',
    duration: '2:00',
    durationSeconds: 120,
    filePath: 'D-5.mp3',
    description: 'You can see the dance while it is happening. That metacognitive capacity is rare.',
    tier: 2,
    category: 'detection',
    triggerCondition: { field: 'patternAwareness', operator: 'gt', value: 65 },
  },
  {
    id: 'D-6',
    title: 'The Regulation Bottleneck',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'D-6.mp3',
    description: 'High emotional intelligence, lower regulation — you feel everything and struggle to hold it.',
    tier: 2,
    category: 'detection',
    // Composite condition: checked in trackSelection.ts
    triggerCondition: { field: 'regulationBottleneck', operator: 'eq', value: 'true' },
  },
];

// ─── Tier 3: Couple Dance (couple gets 1 of 4) ──────────

const COUPLE_DANCE_TRACKS: PortraitTrack[] = [
  {
    id: 'CP-1',
    title: 'The Pursue-Withdraw Dance',
    duration: '3:30',
    durationSeconds: 210,
    filePath: 'CP-1.mp3',
    description: 'One moves toward, the other moves away. Neither position is wrong.',
    tier: 3,
    category: 'couple-dance',
    triggerCondition: { field: 'combinedCycle', operator: 'eq', value: 'pursue-withdraw' },
  },
  {
    id: 'CP-2',
    title: 'The Mutual Pursuit',
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'CP-2.mp3',
    description: 'Both of you move toward. When it works, it is passionate. When it does not, it is loud.',
    tier: 3,
    category: 'couple-dance',
    triggerCondition: { field: 'combinedCycle', operator: 'eq', value: 'mutual-pursuit' },
  },
  {
    id: 'CP-3',
    title: 'The Mutual Withdrawal',
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'CP-3.mp3',
    description: 'Both of you move away. The house goes quiet — not the warm kind.',
    tier: 3,
    category: 'couple-dance',
    triggerCondition: { field: 'combinedCycle', operator: 'eq', value: 'mutual-withdrawal' },
  },
  {
    id: 'CP-4',
    title: 'The Shifting Dance',
    duration: '3:30',
    durationSeconds: 210,
    filePath: 'CP-4.mp3',
    description: 'Your dance shifts — you trade positions. That range is a genuine strength.',
    tier: 3,
    category: 'couple-dance',
    triggerCondition: { field: 'combinedCycle', operator: 'eq', value: 'mixed-switching' },
  },
];

// ─── Tier 3: Couple Constellation (couple gets 1 of 3) ──

const COUPLE_CONSTELLATION_TRACKS: PortraitTrack[] = [
  {
    id: 'CC-1',
    title: 'Close Neighbors',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'CC-1.mp3',
    description: 'Same attachment neighborhood — deep empathy, but no anchor when both are triggered.',
    tier: 3,
    category: 'couple-constellation',
    triggerCondition: { field: 'attachmentConstellation', operator: 'eq', value: 'same' },
  },
  {
    id: 'CC-2',
    title: 'Complementary Partners',
    duration: '2:30',
    durationSeconds: 150,
    filePath: 'CC-2.mp3',
    description: 'Adjacent on the map — close enough to understand, different enough to complement.',
    tier: 3,
    category: 'couple-constellation',
    triggerCondition: { field: 'attachmentConstellation', operator: 'eq', value: 'adjacent' },
  },
  {
    id: 'CC-3',
    title: 'Across the Map',
    duration: '3:00',
    durationSeconds: 180,
    filePath: 'CC-3.mp3',
    description: 'Opposite corners — what attracted you became the problem. The reframe changes everything.',
    tier: 3,
    category: 'couple-constellation',
    triggerCondition: { field: 'attachmentConstellation', operator: 'eq', value: 'opposite' },
  },
];

// ─── Exports ────────────────────────────────────────────

export const ALL_TRACKS: PortraitTrack[] = [
  ...ORIENTATION_TRACKS,
  ...ATTACHMENT_TRACKS,
  ...CYCLE_TRACKS,
  ...WINDOW_TRACKS,
  ...PARTS_TRACKS,
  ...DETECTION_TRACKS,
  ...COUPLE_DANCE_TRACKS,
  ...COUPLE_CONSTELLATION_TRACKS,
];

export function getTrackById(id: string): PortraitTrack | undefined {
  return ALL_TRACKS.find((t) => t.id === id);
}

export function getTracksByTier(tier: TrackTier): PortraitTrack[] {
  return ALL_TRACKS.filter((t) => t.tier === tier);
}

export function getTracksByCategory(category: TrackCategory): PortraitTrack[] {
  return ALL_TRACKS.filter((t) => t.category === category);
}

/** Total estimated listening time for a set of tracks */
export function totalDuration(tracks: PortraitTrack[]): string {
  const totalSec = tracks.reduce((sum, t) => sum + t.durationSeconds, 0);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}
