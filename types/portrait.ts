/**
 * Portrait types for Tender.
 * Defines the complete Individual Portrait data structure.
 */

// ─── Composite Scores ────────────────────────────────────

export interface CompositeScores {
  regulationScore: number;    // 0-100: emotional regulation capacity
  windowWidth: number;        // 0-100: window of tolerance width
  accessibility: number;      // 0-100: emotional accessibility to partner
  responsiveness: number;     // 0-100: attunement to partner's needs
  engagement: number;         // 0-100: investment in connection
  selfLeadership: number;     // 0-100: differentiation / self-awareness
  valuesCongruence: number;   // 0-100: values-behavior alignment

  // ── Radar chart dimensions (Sprint 1 enhancement) ──
  attachmentSecurity: number;    // 0-100: inverse of ECR-R anxiety + avoidance
  emotionalIntelligence: number; // 0-100: SSEIT total normalized
  differentiation: number;       // 0-100: DSI-R total normalized
  conflictFlexibility: number;   // 0-100: entropy of DUTCH conflict modes
  relationalAwareness: number;   // 0-100: EQ social awareness + perception + agreeableness

  // ── Raw ECR-R subscales (for couple portrait attachment plotting) ──
  anxietyNorm?: number;          // 0-100: ECR-R anxiety subscale normalized
  avoidanceNorm?: number;        // 0-100: ECR-R avoidance subscale normalized

  // ── EQ expansion: perspective-taking & empathic resonance ──
  perspectiveTaking?: number;    // 0-100: capacity to see partner's viewpoint
  empathicResonance?: number;    // 0-100: capacity to feel partner's experience
}

/** Non-numeric metadata stored alongside composite scores in the portrait. */
export interface PortraitMetadata {
  validityFlag?: 'VALID' | 'POSSIBLE_BIAS';
  relationalPersonality?: Record<string, number>; // N_rel, E_rel, A_rel, C_rel, O_rel
}

// ─── Pattern Detection ───────────────────────────────────

export type PatternCategory =
  | 'attachment-conflict'
  | 'regulation'
  | 'values-behavior'
  | 'differentiation'
  | 'field-awareness';

export interface DetectedPattern {
  id: string;
  category: PatternCategory;
  description: string;
  interpretation: string;
  confidence: 'high' | 'medium' | 'low';
  flags: string[];
}

export interface PatternResult {
  patterns: DetectedPattern[];
  flagCounts: Record<string, number>;
  priorityFlags: string[];
  hasRegulationPriority: boolean;
  hasGrowthEdgeCandidates: boolean;
}

// ─── Four-Lens Analysis ──────────────────────────────────

export interface AREProfile {
  accessible: number;   // 0-100
  responsive: number;   // 0-100
  engaged: number;      // 0-100
}

/** The emotional layers underneath reactive behavior (EFT concept). */
export interface EmotionalStructure {
  primary: string;      // Primary emotion driving behavior (e.g., "fear of abandonment")
  secondary: string;    // Surface emotion that shows (e.g., "anger or criticism")
  longing: string;      // Deepest need underneath (e.g., "reassurance that I matter")
}

export interface AttachmentLens {
  narrative: string;
  protectiveStrategy: string;
  triggers: string[];
  areProfile: AREProfile;
  emotionalStructure: EmotionalStructure;  // EFT primary/secondary/longing
}

export interface PartsLens {
  narrative: string;
  managerParts: string[];
  firefighterParts: string[];
  polarities: string[];
  selfLeadershipScore: number;   // 0-100
}

export interface RegulationToolkit {
  strengths: string[];           // What's already working
  buildingBlocks: string[];      // Skills to develop
  practiceSequence: string[];    // Ordered sequence of practices
}

export interface CoRegulationPattern {
  style: 'co-regulator' | 'needs-co-regulation' | 'mutual' | 'independent';
  description: string;
  whatYouOffer: string[];        // How you help your partner regulate
  whatYouNeed: string[];         // How your partner can help you regulate
}

export interface RegulationLens {
  narrative: string;
  windowWidth: number;           // 0-100
  activationPatterns: string[];
  shutdownPatterns: string[];
  floodingMarkers: string[];
  regulationToolkit?: RegulationToolkit;     // Personalized tools
  coRegulationPattern?: CoRegulationPattern; // How you co-regulate with partner
}

export interface QualitativeInsights {
  partnerIdentity: string;        // who you are as a partner (values-based)
  nonNegotiables: string[];       // values you will not compromise on
  aspirationalVision: string;     // who you are becoming
}

export interface ValuesLens {
  narrative: string;
  coreValues: string[];
  significantGaps: Array<{ value: string; gap: number; importance: number }>;
  developmentalInvitations: string[];
  willingnessRequirements?: string[];     // discomfort required for growth
  qualitativeInsights?: QualitativeInsights; // who you are as a partner
}

// ─── Field Awareness Lens (Phase 3) ─────────────────────

export interface FieldAwarenessLens {
  narrative: string;           // 2-3 paragraph attachment-tailored story
  fieldSensitivity: number;    // 1-5 mean from SSEIT supplement (5-point scale)
  boundaryClarity: number;     // 1-6 mean from DSI-R supplement (6-point scale)
  patternAwareness: number;    // 1-7 mean from ECR-R supplement (7-point scale)
  metacognitiveCapacity: boolean; // ECR-R cycle awareness ≥ 5
  crossPatterns: string[];     // Supplement cross-reference insights
}

export interface FourLensAnalysis {
  attachment: AttachmentLens;
  parts: PartsLens;
  regulation: RegulationLens;
  values: ValuesLens;
  fieldAwareness?: FieldAwarenessLens; // Phase 3: present when supplement data available
}

// ─── Negative Cycle ──────────────────────────────────────

export type CyclePosition = 'pursuer' | 'withdrawer' | 'mixed' | 'flexible';

export interface RepairReadiness {
  canMakeRepair: number;      // 0-100: ability to initiate repair
  canReceiveRepair: number;   // 0-100: ability to receive repair attempts
  repairStyle: string;        // description of how they repair
  barriers: string[];         // what gets in the way of repair
}

export interface NegativeCycle {
  position: CyclePosition;
  positionConfidence: 'high' | 'medium';  // how distinct the position is
  description: string;
  primaryTriggers: string[];
  typicalMoves: string[];
  deEscalators: string[];
  repairReadiness?: RepairReadiness;       // how ready they are for repair
}

// ─── Growth Edges ────────────────────────────────────────

export type GrowthEdgeCategory =
  | 'regulation'
  | 'attachment'
  | 'values'
  | 'differentiation'
  | 'conflict'
  | 'communication'
  | 'personality';

export interface GrowthEdge {
  id: string;
  title: string;
  description: string;
  rationale: string;
  practices: string[];
  category?: GrowthEdgeCategory;  // For filtering in CombinedProfileView
}

// ─── Anchor Points ───────────────────────────────────────

export interface AnchorCategory {
  primary: string;           // Main anchor phrase
  whatToRemember: string[];  // 2-3 things to remember in this state
  whatToDo: string[];        // 2-3 concrete actions
  whatNotToDo: string[];     // 1-2 things to avoid
}

export interface AnchorPoints {
  whenActivated: AnchorCategory;
  whenShutdown: AnchorCategory;
  patternInterrupt: string[];    // 3-4 personalized interrupt phrases
  repair: {
    signsYoureReady: string[];   // Signs you're ready to repair
    repairStarters: string[];    // Phrases to start repair
  };
  selfCompassion: {
    reminders: string[];          // 2-3 self-compassion phrases
    personalizedMessage: string;  // One deeply personal message
  };
}

// ─── Partner Guide ───────────────────────────────────────

export interface PartnerGuideState {
  whatHelps: string[];
  whatDoesntHelp: string[];
  whatToSay: string[];         // Actual phrases a partner can say
}

export interface PartnerGuide {
  whatToKnow: string;
  whenStrugglingINeed: string[];
  whatHelps: string[];          // General - kept for backward compat
  whatDoesntHelp: string[];     // General - kept for backward compat
  whenActivated?: PartnerGuideState;  // State-specific guidance
  whenShutdown?: PartnerGuideState;   // State-specific guidance
  whatToSay?: string[];              // Key phrases a partner should know
  deepestLonging?: string;           // "What I really need you to understand"
}

// ─── Supplement Scores (Phase 3 — aggregated from 4 supplements) ──

export interface SupplementScores {
  ecrr?: import('../utils/assessments/supplements/ecr-r-supplement').ECRRSupplementScores;
  sseit?: import('../utils/assessments/supplements/sseit-supplement').SSEITSupplementScores;
  dsir?: import('../utils/assessments/supplements/dsi-r-supplement').DSIRSupplementScores;
  values?: import('../utils/assessments/supplements/values-supplement').ValuesSupplementScores;
}

// ─── Score Provenance ────────────────────────────────────
// Classifies each output so the UI can label it honestly.
//
//   raw_assessment   — Direct instrument score (e.g. ECR-R anxiety mean)
//   derived_composite — Weighted blend of multiple instruments (e.g. Regulation Score)
//   interpretive      — Narrative text generated from score patterns
//   growth_adjusted   — Display value with growth boost layered on top

export type ScoreProvenanceType =
  | 'raw_assessment'
  | 'derived_composite'
  | 'interpretive'
  | 'growth_adjusted';

export interface ScoreProvenance {
  type: ScoreProvenanceType;
  /** Human-readable explanation shown in info tooltips */
  label: string;
}

// ─── Individual Portrait ─────────────────────────────────

export interface IndividualPortrait {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  assessmentIds: string[];
  compositeScores: CompositeScores;
  patterns: DetectedPattern[];
  fourLens: FourLensAnalysis;
  negativeCycle: NegativeCycle;
  growthEdges: GrowthEdge[];
  anchorPoints: AnchorPoints;
  partnerGuide: PartnerGuide;
  version: string;
  // Phase 3 additions (optional — backward compatible)
  bigFiveReframes?: string[];
  supplementData?: SupplementScores;
  // Portrait Intelligence Upgrade — cross-instrument narratives
  integratedNarratives?: string[];
  oneThingSentence?: string;
  // Provenance map — tells the UI what kind of data each output is
  provenanceMap?: Record<string, ScoreProvenance>;
  // Non-numeric metadata from personality assessment
  portraitMetadata?: PortraitMetadata;
}

// ─── Helper: All assessment scores grouped ───────────────

export interface AllAssessmentScores {
  ecrr: import('./index').ECRRScores;
  dutch: import('./index').DUTCHScores;
  sseit: import('./index').SSEITScores;
  dsir: import('./index').DSIRScores;
  ipip: import('./index').IPIPScores;
  values: import('./index').ValuesScores;
  supplements?: SupplementScores; // Phase 3: optional supplement data
}
