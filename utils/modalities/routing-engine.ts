/**
 * Modality Routing Engine — V2.1
 *
 * Three-dimension routing:
 *   1. Pattern → Modality RELEVANCE (which modalities apply to this pattern)
 *   2. Person → Modality AFFINITY (which modalities will land for this person)
 *   3. Selection: pick top 3-4 by combining relevance × affinity
 */

import type { CompositeScores } from '@/types/portrait';
import type { ValuesScores } from '@/types';
import type { ModalityContentEntry, Severity } from './modality-content';
import { getContentForPattern } from './modality-content';

// ─── Dimension 1: Pattern → Modality Relevance ──────────

/** Maps each pattern to its relevant modality IDs, ordered by clinical fit */
const PATTERN_MODALITY_RELEVANCE: Record<string, string[]> = {
  // Empathy × Differentiation patterns
  empathic_enmeshment: ['ifs', 'bowen', 'polyvagal', 'dbt', 'aca', 'ecopsychology'],
  empathic_disconnection: ['attachment', 'polyvagal', 'mi', 'organic_intelligence'],
  healthy_deep_empathy: ['ifs', 'contemplative', 'ecopsychology'],
  avoidant_low_perspective: ['attachment', 'ifs', 'polyvagal', 'act', 'mi'],
  anxious_high_perspective: ['polyvagal', 'dbt', 'act', 'ifs', 'aqal'],

  // Regulation patterns
  regulation_capacity: ['polyvagal', 'dbt', 'organic_intelligence', 'act'],
  moderate_regulation_capacity: ['polyvagal', 'dbt', 'act', 'contemplative'],
  aware_but_cant_regulate: ['polyvagal', 'dbt', 'organic_intelligence', 'aqal'],
  eq_perception_management_gap: ['polyvagal', 'dbt', 'ifs', 'act', 'organic_intelligence'],
  eq_other_focused: ['ifs', 'bowen', 'aca', 'dbt'],
  eq_low_anxious: ['polyvagal', 'dbt', 'attachment', 'organic_intelligence'],

  // Attachment × Conflict patterns
  anxious_but_avoiding: ['attachment', 'ifs', 'polyvagal', 'act', 'narrative'],
  anxious_yielding: ['attachment', 'ifs', 'bowen', 'aca', 'dbt'],
  avoidant_avoiding: ['attachment', 'polyvagal', 'mi', 'narrative', 'contemplative'],
  avoidant_but_collaborative: ['attachment', 'ifs', 'act', 'bowen'],

  // Values × Behavior patterns
  values_honesty_avoids_conflict: ['act', 'narrative', 'mi', 'ifs', 'contemplative'],
  values_intimacy_avoids_closeness: ['attachment', 'ifs', 'polyvagal', 'act'],
  values_autonomy_but_fused: ['bowen', 'ifs', 'act', 'aca'],

  // Differentiation patterns
  differentiation_work: ['bowen', 'ifs', 'act', 'aca'],
  high_cutoff: ['bowen', 'ifs', 'polyvagal', 'organic_intelligence', 'contemplative'],
};

/** Get relevant modalities for a pattern (returns IDs in priority order) */
export function getRelevantModalities(patternId: string): string[] {
  return PATTERN_MODALITY_RELEVANCE[patternId] ?? [];
}

// ─── Dimension 2: Person → Modality Affinity ────────────

type AffinityLevel = 'high' | 'medium' | 'low';

interface PersonProfile {
  compositeScores: CompositeScores;
  values?: ValuesScores;
  openness?: number;         // personality openness percentile
  spiritualityValue?: number; // 1-10 from values assessment
  growthValue?: number;       // 1-10 from values assessment
}

/** Calculate how well each modality will resonate with this person */
export function calculateModalityAffinity(
  profile: PersonProfile,
): Record<string, AffinityLevel> {
  const affinities: Record<string, AffinityLevel> = {};
  const cs = profile.compositeScores;
  const openness = profile.openness ?? 50;
  const spirituality = profile.spiritualityValue ?? 5;
  const growth = profile.growthValue ?? 5;

  // Default everything to medium
  for (const id of Object.keys(PATTERN_MODALITY_RELEVANCE).flatMap(k => PATTERN_MODALITY_RELEVANCE[k])) {
    if (!affinities[id]) affinities[id] = 'medium';
  }

  // ── Spiritual / soulful lenses ──
  if (spirituality >= 7) {
    affinities['jungian'] = 'high';
    affinities['ecopsychology'] = 'high';
    affinities['contemplative'] = 'high';
  } else if (spirituality <= 3) {
    affinities['jungian'] = 'low';
    affinities['ecopsychology'] = 'low';
    affinities['contemplative'] = 'low';
  }

  // ── Somatic / body-oriented lenses ──
  // Use regulation as proxy for somatic awareness (low regulation → high need for somatic work)
  if (cs.regulationScore < 40) {
    affinities['polyvagal'] = 'high';
    affinities['organic_intelligence'] = 'high';
    affinities['dbt'] = 'high';
  }

  // ── Practical / action-oriented lenses ──
  if (growth >= 8) {
    affinities['dbt'] = 'high';
    affinities['act'] = 'high';
    affinities['mi'] = 'high';
  }

  // ── Cognitive / intellectual lenses ──
  if (openness > 70) {
    affinities['narrative'] = 'high';
    affinities['jungian'] = affinities['jungian'] === 'low' ? 'medium' : 'high';
    affinities['aqal'] = 'medium';
  }

  // ── Family-of-origin work ──
  if (cs.differentiation < 40) {
    affinities['bowen'] = 'high';
    affinities['aca'] = 'high';
  }

  // ── Attachment always relevant ──
  affinities['attachment'] = 'high';

  // ── IFS always relevant for internal conflict ──
  affinities['ifs'] = 'high';

  return affinities;
}

// ─── Dimension 3: Selection ──────────────────────────────

const AFFINITY_WEIGHT: Record<AffinityLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

interface RoutedContent {
  modalityId: string;
  modalityName: string;
  role: string;
  content: ModalityContentEntry['content'];
  score: number;  // relevance × affinity score (for debugging)
}

/**
 * Route a pattern through the engine to select 3-4 modality-specific content entries.
 *
 * @param patternId - The detected pattern ID
 * @param severity - Score-based severity
 * @param profile - User's assessment profile for affinity calculation
 * @returns 3-4 RoutedContent entries, or empty array if no content exists
 */
export function routePatternToModalities(
  patternId: string,
  severity: Severity,
  profile: PersonProfile,
): RoutedContent[] {
  const relevant = getRelevantModalities(patternId);
  if (relevant.length === 0) return [];

  const affinity = calculateModalityAffinity(profile);
  const contentEntries = getContentForPattern(patternId, severity);
  if (contentEntries.length === 0) return [];

  // Score each available content entry: relevance rank × affinity weight
  const scored = contentEntries
    .map((entry) => {
      const relevanceRank = relevant.indexOf(entry.modalityId);
      if (relevanceRank === -1) return null; // not relevant for this pattern
      const relevanceScore = relevant.length - relevanceRank; // higher = more relevant
      const affinityScore = AFFINITY_WEIGHT[affinity[entry.modalityId] ?? 'medium'];
      return {
        entry,
        score: relevanceScore * affinityScore,
      };
    })
    .filter(Boolean) as Array<{ entry: ModalityContentEntry; score: number }>;

  // Sort by score descending, take top 4
  scored.sort((a, b) => b.score - a.score);

  const { MODALITY_REGISTRY } = require('./modality-registry');
  return scored.slice(0, 4).map(({ entry, score }) => {
    const mod = MODALITY_REGISTRY.find((m: any) => m.id === entry.modalityId);
    return {
      modalityId: entry.modalityId,
      modalityName: mod?.name ?? entry.modalityId,
      role: mod?.role ?? 'insight',
      content: entry.content,
      score,
    };
  });
}

/**
 * Determine severity from a composite score value.
 * Used to select the right content entries.
 */
export function scoreSeverity(score: number): Severity {
  if (score >= 65) return 'low';
  if (score >= 40) return 'medium';
  return 'high';
}
