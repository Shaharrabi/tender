/**
 * WEARE Scoring Engine types.
 * "The Space Between You" — couple relational field intelligence.
 *
 * Language rule: NEVER say "WEARE score" in user-facing text.
 * Use: "the space between you", "resonance pulse", "how alive the connection feels".
 */

// ─── Data Mode (graceful degradation) ────────────────────

/** How much data backed this calculation */
export type WEAREDataMode = 'full' | 'single-partner' | 'preliminary';

// ─── Movement Phase ──────────────────────────────────────

/** The couple's current phase in the growth journey */
export type WEAREMovementPhase = 'recognition' | 'release' | 'resonance' | 'embodiment';

// ─── Variable Score ──────────────────────────────────────

/** A single WEARE variable with raw value, confidence, and source tracking */
export interface WEAREVariableScore {
  raw: number;             // 1-10 normalized
  confidence: number;      // 0-1 (how much real data backed this)
  sources: string[];       // which data sources contributed
}

// ─── 9 Variables ────────────────────────────────────────

export interface WEAREVariables {
  attunement: WEAREVariableScore;       // A — sensing and responding to the field
  coCreation: WEAREVariableScore;       // C — building together
  transmission: WEAREVariableScore;     // Tr — showing up (behavioral follow-through)
  space: WEAREVariableScore;            // S — healthy separateness / differentiation
  time: WEAREVariableScore;             // T — consistency of engagement
  individual: WEAREVariableScore;       // I — each partner's inner resources
  context: WEAREVariableScore;          // CE — external life pressures + support
  change: WEAREVariableScore;           // Delta — growth momentum
  resistance: WEAREVariableScore;       // R — rigidity / letting go difficulty
}

// ─── Three Layers ───────────────────────────────────────

export interface WEARELayers {
  /** How alive the core connection feels (A + C + Tr) / 30 * 100 → 0-100 */
  resonancePulse: number;
  /** Direction of growth vs rigidity (Delta - R) → -9 to +9 */
  emergenceDirection: number;
  /** Overall relational field health → 0-100 (log-normalized) */
  overall: number;
}

// ─── Bottleneck ─────────────────────────────────────────

export type WEAREVariableName = keyof WEAREVariables;

export interface WEAREBottleneck {
  variable: WEAREVariableName;
  label: string;              // warm name e.g. "Feeling Each Other"
  value: number;              // 1-10
  description: string;        // warm narrative about what this means
  recommendedPractices: string[];  // exercise IDs from intervention registry
}

// ─── Trend ──────────────────────────────────────────────

export type WEARETrendDirection = 'growing' | 'steady' | 'contracting';

export interface WEARETrend {
  direction: WEARETrendDirection;
  overallDelta: number;       // change since last calculation
  resonanceDelta: number;     // change in resonance pulse
  periodLabel: string;        // "Since last week", "Since 2 weeks ago", etc.
}

// ─── Warm Summary Tier ──────────────────────────────────

/** User-facing phrase for overall health — NEVER show raw numbers */
export type WEAREWarmSummary =
  | 'Deeply alive'
  | 'Growing stronger'
  | 'Finding its way'
  | 'Needs tending';

// ─── Full Profile ───────────────────────────────────────

export interface WEAREProfile {
  variables: WEAREVariables;
  layers: WEARELayers;
  bottleneck: WEAREBottleneck;
  movementPhase: WEAREMovementPhase;
  movementNarrative: string;       // warm description of the phase
  warmSummary: WEAREWarmSummary;
  dataMode: WEAREDataMode;
  trend?: WEARETrend;              // present after 2+ calculations
  calculatedAt: string;            // ISO timestamp
}

// ─── Weekly Check-In ────────────────────────────────────

export interface WeeklyCheckIn {
  id: string;
  userId: string;
  coupleId: string;
  weekOf: string;                    // ISO date (start of week)
  externalStressLevel: number;       // 1-10
  supportSystemRating: number;       // 1-10
  relationshipSatisfaction: number;  // 1-10
  practiceHighlight?: string;        // optional free text
  createdAt: string;
}

// ─── Engine Input ───────────────────────────────────────

/** All data sources gathered by weare-data-collector for the engine */
export interface WEAREInput {
  // Individual portrait data (always available)
  partnerA: WEAREPartnerData;
  partnerB?: WEAREPartnerData;       // null in single-partner / preliminary mode

  // Couple instrument scores (available after dyadic phase)
  relationalField?: import('./index').RelationalFieldScores;
  coupleField?: import('./index').CoupleFieldScores;

  // Weekly check-in (available after first check-in)
  weeklyCheckIn?: {
    partnerA?: WeeklyCheckIn;
    partnerB?: WeeklyCheckIn;
  };

  // Behavioral data
  behavioral?: WEAREBehavioralData;

  // Previous profile (for trend calculation)
  previousProfile?: WEAREProfile;
}

/** Per-partner data extracted from their portrait + supplements */
export interface WEAREPartnerData {
  compositeScores: import('./portrait').CompositeScores;
  ecrr: import('./index').ECRRScores;
  ipip: import('./index').IPIPScores;
  sseit: import('./index').SSEITScores;
  dsir: import('./index').DSIRScores;
  dutch: import('./index').DUTCHScores;
  values: import('./index').ValuesScores;
  supplements?: import('./portrait').SupplementScores;
}

/** Behavioral engagement data from the app */
export interface WEAREBehavioralData {
  practiceCompletionRate: number;   // 0-1 (completed / assigned)
  practiceRepetitionRate: number;   // 0-1 (repeated / completed)
  currentStreak: number;           // days of consecutive engagement
  sessionConsistency: number;      // 0-1 (sessions this week / expected)
  stepProgression: number;         // 0-12 (current step in 12-step model)
  totalPracticesCompleted: number;
}

// ─── DB Row Shape ───────────────────────────────────────

/** Shape of the weare_scores table row (snake_case for Supabase) */
export interface WEAREScoreRow {
  id: string;
  couple_id: string;
  calculated_by: string;           // user_id who triggered the calc
  data_mode: WEAREDataMode;
  variables: WEAREVariables;       // JSONB
  layers: WEARELayers;             // JSONB
  bottleneck: WEAREBottleneck;     // JSONB
  movement_phase: WEAREMovementPhase;
  movement_narrative: string;
  warm_summary: WEAREWarmSummary;
  calculated_at: string;
}

/** Shape of the weekly_check_ins table row (snake_case for Supabase) */
export interface WeeklyCheckInRow {
  id: string;
  user_id: string;
  couple_id: string;
  week_of: string;
  external_stress_level: number;
  support_system_rating: number;
  relationship_satisfaction: number;
  practice_highlight?: string;
  created_at: string;
}
