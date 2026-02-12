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
}

// ─── Pattern Detection ───────────────────────────────────

export type PatternCategory =
  | 'attachment-conflict'
  | 'regulation'
  | 'values-behavior'
  | 'differentiation';

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

export interface AttachmentLens {
  narrative: string;
  protectiveStrategy: string;
  triggers: string[];
  areProfile: AREProfile;
}

export interface PartsLens {
  narrative: string;
  managerParts: string[];
  firefighterParts: string[];
  polarities: string[];
  selfLeadershipScore: number;   // 0-100
}

export interface RegulationLens {
  narrative: string;
  windowWidth: number;           // 0-100
  activationPatterns: string[];
  shutdownPatterns: string[];
  floodingMarkers: string[];
}

export interface ValuesLens {
  narrative: string;
  coreValues: string[];
  significantGaps: Array<{ value: string; gap: number; importance: number }>;
  developmentalInvitations: string[];
}

export interface FourLensAnalysis {
  attachment: AttachmentLens;
  parts: PartsLens;
  regulation: RegulationLens;
  values: ValuesLens;
}

// ─── Negative Cycle ──────────────────────────────────────

export type CyclePosition = 'pursuer' | 'withdrawer' | 'mixed' | 'flexible';

export interface NegativeCycle {
  position: CyclePosition;
  description: string;
  primaryTriggers: string[];
  typicalMoves: string[];
  deEscalators: string[];
}

// ─── Growth Edges ────────────────────────────────────────

export interface GrowthEdge {
  id: string;
  title: string;
  description: string;
  rationale: string;
  practices: string[];
}

// ─── Anchor Points ───────────────────────────────────────

export interface AnchorPoints {
  whenActivated: string;
  whenShutdown: string;
  patternInterrupt: string;
  repair: string;
  selfCompassion: string;
}

// ─── Partner Guide ───────────────────────────────────────

export interface PartnerGuide {
  whatToKnow: string;
  whenStrugglingINeed: string[];
  whatHelps: string[];
  whatDoesntHelp: string[];
}

// ─── Individual Portrait ─────────────────────────────────

export interface IndividualPortrait {
  id: string;
  userId: string;
  createdAt: string;
  assessmentIds: string[];
  compositeScores: CompositeScores;
  patterns: DetectedPattern[];
  fourLens: FourLensAnalysis;
  negativeCycle: NegativeCycle;
  growthEdges: GrowthEdge[];
  anchorPoints: AnchorPoints;
  partnerGuide: PartnerGuide;
  version: string;
}

// ─── Helper: All assessment scores grouped ───────────────

export interface AllAssessmentScores {
  ecrr: import('./index').ECRRScores;
  dutch: import('./index').DUTCHScores;
  sseit: import('./index').SSEITScores;
  dsir: import('./index').DSIRScores;
  ipip: import('./index').IPIPScores;
  values: import('./index').ValuesScores;
}
