/**
 * Integration Engine Types
 * ────────────────────────────────────────────
 * Types for the cross-domain integration system.
 * Users select 2-4 domains in the matrix and see what emerges
 * at the intersection — the developmental arc of their patterns.
 */

/** Domain IDs matching the 7 matrix domains */
export type DomainId =
  | 'foundation'   // Attachment (ECR-R)
  | 'instrument'   // Personality (IPIP)
  | 'navigation'   // EQ (SSEIT)
  | 'stance'       // Differentiation (DSI-R)
  | 'conflict'     // Conflict style (DUTCH)
  | 'compass'      // Values
  | 'field';       // Relational field (RFAS)

/** The depth of the integration — how many domains are woven together */
export type IntegrationDepth = 'pairwise' | 'triple' | 'quad';

/** The six viewpoint lenses — same data, six different doors */
export type LensType = 'therapeutic' | 'soulful' | 'practical' | 'developmental' | 'relational' | 'simple';

/** All six lens narratives for a single integration */
export interface LensedNarrative {
  therapeutic: string;     // Clinical warmth — EFT, IFS, Gottman, ACT, DBT, Polyvagal
  soulful: string;         // The WEARE voice — embodied, cultural, whole, field-aware, spiral
  practical: string;       // Direct action, no theory — "do this, this week"
  developmental: string;   // Erikson + Kegan + spiral dynamics framing
  relational: string;      // What your partner experiences
  simple: string;          // 2-4 lines, distilled essence
}

/** Lens display metadata */
export const LENS_META: Record<LensType, { label: string; subtitle: string; emoji: string }> = {
  therapeutic: { label: 'Therapeutic', subtitle: 'What the research sees', emoji: '🧠' },
  soulful: { label: 'Soulful', subtitle: 'What the field sees', emoji: '🔮' },
  practical: { label: 'Practical', subtitle: 'What to do this week', emoji: '🔧' },
  developmental: { label: 'Developmental', subtitle: 'Where you are on the journey', emoji: '📈' },
  relational: { label: 'Relational', subtitle: "What your partner experiences", emoji: '💑' },
  simple: { label: 'Simple', subtitle: 'In one breath', emoji: '💡' },
};

/** The developmental arc: wound → protection → cost → emergence */
export interface DevelopmentalArc {
  wound?: string;         // Where this began — in the body, in the family, in the culture
  protection: string;     // What you built to stay safe
  cost: string;           // What that protection costs in relationships
  emergence: string;      // What wants to happen if you can hold the tension
}

/** Enhanced practice with structured metadata */
export interface MatchedPractice {
  name: string;
  instruction: string;       // 3-5 sentences, step by step
  whyThisOne: string;        // 1 sentence connecting to the combination
  linkedExerciseId?: string; // e.g., "eft_hold_me_tight"
  frequency: string;         // "Once this week" / "Daily for 5 minutes" / etc.
  modality?: string;         // e.g., "EFT", "ACT", "Gottman"
}

/** Full integration result for display */
export interface IntegrationResult {
  title: string;                // e.g., "When Reach Meets Read"
  subtitle: string;             // e.g., "Your attachment × emotional intelligence"
  body: string;                 // 2-3 paragraphs (legacy single-voice fallback)
  arc: DevelopmentalArc;        // Wound → Protection → Cost → Emergence
  practice: string;             // Legacy single-string practice
  oneThing: string | null;      // Distilled one-line invitation (optional)
  depth: IntegrationDepth;
  domains: DomainId[];          // Which domains are involved
  confidence: 'high' | 'emerging' | 'low';

  // ─── Enhanced Lens System (optional — present when Tier 1/2 pattern matches) ───
  patternId?: string;                          // e.g., 'invisible_partner'
  patternName?: string;                        // e.g., 'The Invisible Partner'
  lenses?: LensedNarrative;                    // All six lens narratives
  matchedPractice?: MatchedPractice;           // Structured practice
  invitation?: string;                         // The "one invitation" — large type, the screenshot moment
  evidenceLevel?: 'strong' | 'moderate' | 'theoretical';
  keyCitations?: string[];                     // e.g., ["Bazyari et al., 2024"]
  evidenceNote?: string;                       // Shown when user taps "What's this based on?"
}

/** Raw assessment scores passed to integration functions */
export interface IntegrationScores {
  ecrr?: {
    anxietyScore: number;       // 1-7
    avoidanceScore: number;     // 1-7
    attachmentStyle: string;
  };
  ipip?: {
    domainPercentiles: Record<string, number>;  // 0-100 (N, E, O, A, C)
  };
  sseit?: {
    totalNormalized: number;    // 0-100
    subscaleNormalized: Record<string, number>; // 0-100
  };
  dsir?: {
    totalNormalized: number;    // 0-100
    subscaleScores: Record<string, { normalized: number }>;
  };
  dutch?: {
    subscaleScores: Record<string, { mean: number }>;
    primaryStyle: string;
    secondaryStyle: string;
  };
  values?: {
    domainScores: Record<string, { importance: number; accordance: number; gap: number }>;
    top5Values: string[];
  };
  rfas?: {
    totalMean?: number;
    subscales?: Record<string, number>;
  };
}

/** Map of domain ID → required score key */
export const DOMAIN_SCORE_KEY: Record<DomainId, keyof IntegrationScores> = {
  foundation: 'ecrr',
  instrument: 'ipip',
  navigation: 'sseit',
  stance: 'dsir',
  conflict: 'dutch',
  compass: 'values',
  field: 'rfas',
};

/** Human-readable domain names */
export const DOMAIN_NAMES: Record<DomainId, string> = {
  foundation: 'Attachment',
  instrument: 'Personality',
  navigation: 'Emotional Intelligence',
  stance: 'Differentiation',
  conflict: 'Conflict Style',
  compass: 'Values',
  field: 'Relational Field',
};
