/**
 * Types for the Couples/Dyadic phase of the app.
 * Covers partner matching, dyadic assessments,
 * relationship portraits, and couple portal.
 */

// ─── Partner Invitation ─────────────────────────────────

export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface CoupleInvite {
  id: string;
  inviter_id: string;
  invite_code: string;
  inviter_name?: string;
  status: InviteStatus;
  accepted_by?: string;
  expires_at: string;
  created_at: string;
}

// ─── Couple ─────────────────────────────────────────────

export type CoupleStatus = 'active' | 'paused' | 'disconnected';

export interface Couple {
  id: string;
  partner_a_id: string;
  partner_b_id: string;
  invite_id?: string;
  status: CoupleStatus;
  created_at: string;
}

// ─── User Profile ───────────────────────────────────────

export type RelationshipMode = 'solo' | 'demo_partner' | 'real_partner' | 'random_partner';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  individual_assessments_complete: boolean;
  dyadic_assessments_complete: boolean;
  relationship_mode?: RelationshipMode;
  demo_partner_id?: string;
  created_at: string;
}

// ─── Dyadic Assessment Types ────────────────────────────

export type DyadicAssessmentType = 'rdas' | 'dci' | 'csi-16' | 'csi-4';

export interface DyadicAssessmentRecord {
  id: string;
  user_id: string;
  couple_id: string;
  assessment_type: DyadicAssessmentType;
  responses: any;
  scores: any;
  completed_at: string;
  created_at: string;
}

// ─── RDAS Scores ────────────────────────────────────────

export interface RDASScores {
  total: number;             // 0-69
  consensus: number;         // 0-30
  satisfaction: number;      // 0-20
  cohesion: number;          // 0-20
  distressLevel: 'non-distressed' | 'mild' | 'moderate' | 'severe';
}

// ─── DCI Scores ─────────────────────────────────────────

export interface DCIScores {
  totalPositive: number;
  stressCommunicationBySelf: number;    // 4-20
  stressCommunicationByPartner: number; // 4-20
  supportiveBySelf: number;             // 5-25
  supportiveByPartner: number;          // 5-25
  delegatedBySelf: number;              // 2-10
  delegatedByPartner: number;           // 2-10
  negativeBySelf: number;               // 4-20
  negativeByPartner: number;            // 4-20
  commonCoping: number;                 // 5-25
  evaluationBySelf: number;             // 2-10
  evaluationByPartner: number;          // 2-10
  copingQuality: 'strong' | 'adequate' | 'weak';
}

// ─── CSI-16 Scores ──────────────────────────────────────

export interface CSI16Scores {
  total: number;             // 0-81 (item 1 scored 0-6, items 2-16 scored 0-5)
  satisfactionLevel: 'high' | 'moderate' | 'low' | 'crisis';
  distressed: boolean;       // below 51.5 clinical cutoff
}

// ─── CSI-4 Scores (quick check-in) ─────────────────────

export interface CSI4Scores {
  total: number;             // 0-21
  distressed: boolean;
}

// ─── Relationship Pattern Detection ─────────────────────

export type RelationshipPatternType =
  | 'pursue-withdraw'
  | 'demand-distance'
  | 'caretaker-dependent'
  | 'high-conflict-high-passion'
  | 'parallel-lives'
  | 'mutual-avoidance'
  | 'anxious-anxious';

export interface RelationshipPattern {
  type: RelationshipPatternType;
  confidence: number;         // 0-100
  description: string;
  partnerARoleLabel: string;  // e.g., "Pursuer"
  partnerBRoleLabel: string;  // e.g., "Withdrawer"
  interventionFocus: string[];
}

// ─── Discrepancy Analysis ───────────────────────────────

export interface DiscrepancyItem {
  domain: string;             // e.g., "satisfaction", "supportive_coping"
  partnerAScore: number;
  partnerBScore: number;
  difference: number;
  isSignificant: boolean;
  insight: string;
}

export interface DiscrepancyAnalysis {
  items: DiscrepancyItem[];
  overallAlignment: 'aligned' | 'some-gaps' | 'significant-gaps';
  summary: string;
}

// ─── Relationship Growth Edge ───────────────────────────

export interface RelationshipGrowthEdge {
  id: string;
  title: string;
  pattern: string;
  protection: string;
  cost: string;
  invitation: string;
  practice: string;
  anchor: string;
  relatedAssessments: string[];
  priority: 'high' | 'medium' | 'low';
}

// ─── Relationship Portrait ──────────────────────────────

export interface RelationshipPortrait {
  id: string;
  couple_id: string;
  partner_a_portrait_id?: string;
  partner_b_portrait_id?: string;
  dyadic_scores: {
    rdas?: RDASScores;
    dci?: DCIScores;
    csi16?: CSI16Scores;
  };
  relationship_patterns: RelationshipPattern[];
  combined_cycle: {
    partnerAPosition: string;
    partnerBPosition: string;
    cycleDescription: string;
    triggers: string[];
    deEscalationSteps: string[];
  };
  discrepancy_analysis: DiscrepancyAnalysis;
  relationship_growth_edges: RelationshipGrowthEdge[];
  couple_anchor_points: {
    whenActivated: string[];
    whenDisconnected: string[];
    forRepair: string[];
    forConnection: string[];
  };
  intervention_priorities: {
    immediate: string[];
    shortTerm: string[];
    mediumTerm: string[];
    maintenance: string[];
  };
  version: string;
  created_at: string;
  updated_at: string;
}

// ─── Progressive Unlock State ───────────────────────────

export type AppPhase =
  | 'onboarding'          // Just registered, no assessments
  | 'individual-assessments'  // In progress with individual assessments
  | 'individual-complete'     // All 6 individual assessments done, portrait generated
  | 'partner-invited'         // Invite sent, waiting for partner
  | 'partner-linked'          // Both linked, can start dyadic assessments
  | 'dyadic-assessments'      // In progress with dyadic assessments
  | 'dyadic-complete'         // All dyadic assessments done by both
  | 'couple-portal';          // Full couple portal unlocked

export interface AppUnlockState {
  phase: AppPhase;
  individualAssessmentsCompleted: number;   // 0-6
  individualAssessmentsTotal: number;       // 6
  hasPortrait: boolean;
  coupleId?: string;
  partnerName?: string;
  dyadicAssessmentsCompleted: number;       // 0-3 (per user)
  dyadicAssessmentsTotal: number;           // 3
  partnerDyadicComplete: boolean;
  hasRelationshipPortrait: boolean;
}
