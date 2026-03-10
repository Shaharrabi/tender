/**
 * Portrait Audio Track Selection
 *
 * Given an IndividualPortrait (and optionally a DeepCouplePortrait),
 * returns the set of audio tracks the user should hear.
 *
 * Selection rules from TENDER_PORTRAIT_AUDIO_LIBRARY_COMPLETE.md:
 * - Tier 1: All 5 orientation tracks (everyone)
 * - Tier 2: 1 attachment + 1 cycle + 1 window + 1 parts + 0-3 detections
 * - Tier 3: 1 couple dance + 1 couple constellation (if coupled)
 */

import type { IndividualPortrait } from '@/types/portrait';
import type { DeepCouplePortrait } from '@/types/couples';
import {
  ALL_TRACKS,
  getTracksByTier,
  getTracksByCategory,
  type PortraitTrack,
  type TrackCategory,
} from './trackMetadata';

// ─── Attachment Quadrant Derivation ─────────────────────

type AttachmentQuadrant = 'secure' | 'anxious-preoccupied' | 'dismissive-avoidant' | 'fearful-avoidant';

function getAttachmentQuadrant(portrait: IndividualPortrait): AttachmentQuadrant {
  const anxiety = portrait.compositeScores.anxietyNorm ?? 50;
  const avoidance = portrait.compositeScores.avoidanceNorm ?? 50;

  if (anxiety >= 50 && avoidance >= 50) return 'fearful-avoidant';
  if (anxiety >= 50 && avoidance < 50) return 'anxious-preoccupied';
  if (anxiety < 50 && avoidance >= 50) return 'dismissive-avoidant';
  return 'secure';
}

// ─── Portrait Data Extraction ───────────────────────────

interface ExtractedPortraitData {
  attachmentQuadrant: AttachmentQuadrant;
  cyclePosition: string;
  windowWidth: number;
  managerPartsCount: number;
  firefighterPartsCount: number;
  boundaryClarity: number;
  fieldSensitivity: number;
  patternAwareness: number;
  maxValuesGap: number;
  regulationScore: number;
  eqScore: number;
  patternIds: string[];
}

function extractPortraitData(portrait: IndividualPortrait): ExtractedPortraitData {
  const cs = portrait.compositeScores;
  const fl = portrait.fourLens;

  // Find max values gap
  const valuesGaps = fl.values?.significantGaps ?? [];
  const maxValuesGap = valuesGaps.reduce((max, g) => Math.max(max, g.gap), 0);

  // Field awareness data (may not exist)
  const fa = fl.fieldAwareness;
  // Normalize field sensitivity from 1-5 scale to 0-100
  const fieldSensitivity = fa ? (fa.fieldSensitivity / 5) * 100 : 50;
  // Normalize boundary clarity from 1-6 scale to 0-100
  const boundaryClarity = fa ? (fa.boundaryClarity / 6) * 100 : 50;
  // Normalize pattern awareness from 1-7 scale to 0-100
  const patternAwareness = fa ? (fa.patternAwareness / 7) * 100 : 50;

  return {
    attachmentQuadrant: getAttachmentQuadrant(portrait),
    cyclePosition: portrait.negativeCycle.position,
    windowWidth: cs.windowWidth,
    managerPartsCount: fl.parts.managerParts.length,
    firefighterPartsCount: fl.parts.firefighterParts.length,
    boundaryClarity,
    fieldSensitivity,
    patternAwareness,
    maxValuesGap,
    regulationScore: cs.regulationScore,
    eqScore: cs.emotionalIntelligence,
    patternIds: portrait.patterns.map((p) => p.id),
  };
}

// ─── Individual Track Selection ─────────────────────────

/**
 * Select all tracks this individual should hear, based on their portrait.
 *
 * Returns tracks grouped by category for display in the AudioLibrary.
 */
export function selectTracksForPortrait(portrait: IndividualPortrait): PortraitTrack[] {
  const data = extractPortraitData(portrait);
  const selected: PortraitTrack[] = [];

  // ── Tier 1: All orientation tracks ──
  selected.push(...getTracksByTier(1));

  // ── Tier 2: Attachment (1 of 4) ──
  const attachmentTracks = getTracksByCategory('attachment');
  const attachmentMatch = attachmentTracks.find(
    (t) => t.triggerCondition.value === data.attachmentQuadrant
  );
  if (attachmentMatch) selected.push(attachmentMatch);

  // ── Tier 2: Cycle Position (1 of 3) ──
  const cycleTracks = getTracksByCategory('cycle-position');
  const cycleMatch = cycleTracks.find((t) => {
    const cond = t.triggerCondition;
    if (cond.operator === 'eq') return cond.value === data.cyclePosition;
    if (cond.operator === 'in' && Array.isArray(cond.value)) {
      return cond.value.includes(data.cyclePosition);
    }
    return false;
  });
  if (cycleMatch) selected.push(cycleMatch);

  // ── Tier 2: Window of Tolerance (1 of 3) ──
  // Priority: W-3 (> 65), then W-1 (< 45), else W-2 (45-65)
  const windowTracks = getTracksByCategory('window');
  let windowMatch: PortraitTrack | undefined;
  if (data.windowWidth > 65) {
    windowMatch = windowTracks.find((t) => t.id === 'W-3');
  } else if (data.windowWidth < 45) {
    windowMatch = windowTracks.find((t) => t.id === 'W-1');
  } else {
    windowMatch = windowTracks.find((t) => t.id === 'W-2');
  }
  if (windowMatch) selected.push(windowMatch);

  // ── Tier 2: IFS Parts (1 of 3) ──
  // P-1 if managerParts >= 3, P-2 if firefighterParts >= 2, else P-3
  const partsTracks = getTracksByCategory('parts');
  let partsMatch: PortraitTrack | undefined;
  if (data.managerPartsCount >= 3) {
    partsMatch = partsTracks.find((t) => t.id === 'P-1');
  } else if (data.firefighterPartsCount >= 2) {
    partsMatch = partsTracks.find((t) => t.id === 'P-2');
  } else {
    partsMatch = partsTracks.find((t) => t.id === 'P-3');
  }
  if (partsMatch) selected.push(partsMatch);

  // ── Tier 2: Detections (0-3 of 6) ──
  const detectionTracks = getTracksByCategory('detection');
  for (const track of detectionTracks) {
    if (matchesDetection(track, data)) {
      selected.push(track);
    }
  }

  return selected;
}

function matchesDetection(track: PortraitTrack, data: ExtractedPortraitData): boolean {
  switch (track.id) {
    case 'D-1': // accommodate-to-connect pattern
      return data.patternIds.some((id) =>
        id.includes('accommodate') || id.includes('yield') || id.includes('accommodate-to-connect')
      );
    case 'D-2': // boundaryClarity < 40
      return data.boundaryClarity < 40;
    case 'D-3': // fieldSensitivity > 80
      return data.fieldSensitivity > 80;
    case 'D-4': // values gap >= 3.0
      return data.maxValuesGap >= 3.0;
    case 'D-5': // patternAwareness > 65
      return data.patternAwareness > 65;
    case 'D-6': // regulation < 50 AND EQ > 70
      return data.regulationScore < 50 && data.eqScore > 70;
    default:
      return false;
  }
}

// ─── Couple Track Selection ─────────────────────────────

/**
 * Select couple-specific tracks based on the DeepCouplePortrait.
 * Returns 2-3 tracks: 1 dance + 1 constellation.
 */
export function selectTracksForCouplePortrait(
  couplePortrait: DeepCouplePortrait
): PortraitTrack[] {
  const selected: PortraitTrack[] = [];
  const interlock = couplePortrait.patternInterlock;

  // ── Couple Dance (1 of 4) ──
  const danceTracks = getTracksByCategory('couple-dance');
  const cycleDynamic = interlock.combinedCycle.dynamic;
  const danceMatch = danceTracks.find((t) => t.triggerCondition.value === cycleDynamic);
  if (danceMatch) selected.push(danceMatch);

  // ── Couple Constellation (1 of 3) ──
  const constellationTracks = getTracksByCategory('couple-constellation');
  const attachDynamic = interlock.attachmentDynamic;
  const constellation = deriveConstellation(attachDynamic.dynamicLabel);
  const constellationMatch = constellationTracks.find(
    (t) => t.triggerCondition.value === constellation
  );
  if (constellationMatch) selected.push(constellationMatch);

  return selected;
}

/**
 * Derive constellation type from attachment dynamic label.
 * Maps dynamic labels to same/adjacent/opposite.
 */
function deriveConstellation(dynamicLabel: string): 'same' | 'adjacent' | 'opposite' {
  const lower = dynamicLabel.toLowerCase();
  if (lower.includes('same') || lower.includes('mirror') || lower.includes('neighbor')) {
    return 'same';
  }
  if (lower.includes('opposite') || lower.includes('across') || lower.includes('polar')) {
    return 'opposite';
  }
  return 'adjacent'; // default for complementary/neighboring
}

// ─── Grouped Output for UI ──────────────────────────────

export interface TrackGroup {
  label: string;
  subtitle: string;
  tracks: PortraitTrack[];
}

/**
 * Group selected tracks by category for display in AudioLibrary.
 */
export function groupTracksBySection(tracks: PortraitTrack[]): TrackGroup[] {
  const groups: TrackGroup[] = [];

  const orientation = tracks.filter((t) => t.category === 'orientation');
  if (orientation.length > 0) {
    groups.push({
      label: 'Getting Started',
      subtitle: 'Listen to these first — they introduce your portrait',
      tracks: orientation,
    });
  }

  const patterns = tracks.filter((t) =>
    ['attachment', 'cycle-position', 'window', 'parts'].includes(t.category)
  );
  if (patterns.length > 0) {
    groups.push({
      label: 'Your Patterns',
      subtitle: 'Tracks selected for your specific attachment, cycle, and regulation style',
      tracks: patterns,
    });
  }

  const detections = tracks.filter((t) => t.category === 'detection');
  if (detections.length > 0) {
    groups.push({
      label: 'What We Noticed',
      subtitle: 'Additional patterns detected in your portrait data',
      tracks: detections,
    });
  }

  const couple = tracks.filter((t) =>
    ['couple-dance', 'couple-constellation'].includes(t.category)
  );
  if (couple.length > 0) {
    groups.push({
      label: 'Your Dance Together',
      subtitle: 'How your patterns interact as a couple',
      tracks: couple,
    });
  }

  return groups;
}
