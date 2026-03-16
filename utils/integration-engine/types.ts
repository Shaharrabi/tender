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

/** The developmental arc: protection → cost → emergence */
export interface DevelopmentalArc {
  protection: string;   // What you built to stay safe
  cost: string;         // What that protection costs in relationships
  emergence: string;    // What wants to happen if you can hold the tension
}

/** Full integration result for display */
export interface IntegrationResult {
  title: string;                // e.g., "When Reach Meets Read"
  subtitle: string;             // e.g., "Your attachment × emotional intelligence"
  body: string;                 // 2-3 paragraphs about the intersection
  arc: DevelopmentalArc;        // Protection → Cost → Emergence
  practice: string;             // A specific exercise for this intersection
  oneThing: string | null;      // Distilled one-line invitation (optional)
  depth: IntegrationDepth;
  domains: DomainId[];          // Which domains are involved
  confidence: 'high' | 'emerging' | 'low';
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
