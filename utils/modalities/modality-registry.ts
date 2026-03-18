/**
 * Modality Registry — V2.1
 *
 * 16 therapeutic modalities organized into 4 roles.
 * Each modality has an ID, display name, role, and description.
 */

export type ModalityRole = 'insight' | 'somatic' | 'action' | 'developmental';

export interface ModalityDef {
  id: string;
  name: string;
  role: ModalityRole;
  description: string;
}

export const MODALITY_REGISTRY: ModalityDef[] = [
  // ── INSIGHT LENSES — Why this pattern exists ──
  {
    id: 'attachment',
    name: 'Attachment Theory',
    role: 'insight',
    description: 'Your relational wiring from early bonds. Secure base, protest behavior, deactivating strategies.',
  },
  {
    id: 'ifs',
    name: 'Internal Family Systems',
    role: 'insight',
    description: 'Which parts are protecting you and what they guard. Managers, firefighters, exiles, Self-energy.',
  },
  {
    id: 'bowen',
    name: 'Bowen Family Systems',
    role: 'insight',
    description: 'Your differentiation level and family-of-origin echoes. Triangulation, multigenerational transmission.',
  },
  {
    id: 'jungian',
    name: 'Jungian Archetypes',
    role: 'insight',
    description: 'The mythic pattern underneath the behavior. Shadow, anima/animus, individuation.',
  },
  {
    id: 'narrative',
    name: 'Narrative Therapy',
    role: 'insight',
    description: 'The story you have constructed about who you are in relationships. Re-authoring, externalization.',
  },

  // ── SOMATIC LENSES — How it lives in your body ──
  {
    id: 'polyvagal',
    name: 'Polyvagal / Window of Tolerance',
    role: 'somatic',
    description: 'Your nervous system capacity. Ventral vagal (safe), sympathetic (fight/flight), dorsal vagal (freeze).',
  },
  {
    id: 'organic_intelligence',
    name: 'Organic Intelligence',
    role: 'somatic',
    description: 'How trauma is held somatically. Titration, pendulation, resourcing, completion of survival responses.',
  },
  {
    id: 'ecopsychology',
    name: 'Ecopsychology / Soulful',
    role: 'somatic',
    description: 'Where your aliveness is and where you have gone numb. The underworld journey, aliveness mapping.',
  },

  // ── ACTION LENSES — What to do this week ──
  {
    id: 'dbt',
    name: 'Dialectical Behavior Therapy',
    role: 'action',
    description: 'Distress tolerance, emotion regulation, interpersonal effectiveness. STOP, TIPP, DEAR MAN.',
  },
  {
    id: 'act',
    name: 'Acceptance & Commitment Therapy',
    role: 'action',
    description: 'Defusion from thoughts, values-committed action. Willingness vs. avoidance, values compass.',
  },
  {
    id: 'mi',
    name: 'Motivational Interviewing',
    role: 'action',
    description: 'Working with ambivalence and readiness to change. Change talk, decisional balance, rolling with resistance.',
  },
  {
    id: 'cbt',
    name: 'Cognitive Behavioral Therapy',
    role: 'action',
    description: 'Cognitive restructuring for thought distortions. Thought records, behavioral experiments.',
  },

  // ── DEVELOPMENTAL LENSES — Where you are going ──
  {
    id: 'aqal',
    name: 'AQAL / Integral',
    role: 'developmental',
    description: 'Your developmental altitude and stage transition. Quadrants, levels, lines, states, types.',
  },
  {
    id: 'aca',
    name: 'ACA / Codependency Recovery',
    role: 'developmental',
    description: 'The family-of-origin wound being healed. Inner child, reparenting, breaking intergenerational cycles.',
  },
  {
    id: 'contemplative',
    name: 'Contemplative / Spiritual',
    role: 'developmental',
    description: 'Soul language instead of symptom language. Presence, surrender, the sacred in relationship.',
  },
  {
    id: 'creative_metaphoric',
    name: 'Creative / Metaphoric',
    role: 'developmental',
    description: 'Understanding through image rather than analysis. Metaphor, story, creative expression.',
  },
];

/** Lookup a modality by ID */
export function getModality(id: string): ModalityDef | undefined {
  return MODALITY_REGISTRY.find((m) => m.id === id);
}

/** Get all modalities for a given role */
export function getModalitiesByRole(role: ModalityRole): ModalityDef[] {
  return MODALITY_REGISTRY.filter((m) => m.role === role);
}
