/**
 * Growth tracking and treatment plan types for Tender.
 * Defines growth edge progress, daily check-ins, and treatment plans.
 */

// ─── Growth Stages ──────────────────────────────────────

export type GrowthStage = 'emerging' | 'practicing' | 'integrating' | 'integrated';

// ─── Growth Edge Progress ───────────────────────────────

export interface GrowthEdgeProgress {
  id: string;
  userId: string;
  edgeId: string;
  stage: GrowthStage;
  practiceCount: number;
  lastPracticed?: string;
  insights: string[];
  milestones: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Daily Check-In ─────────────────────────────────────

export interface DailyCheckIn {
  id: string;
  userId: string;
  checkinDate: string;
  moodRating: number; // 1-10
  relationshipRating: number; // 1-10
  practicedGrowthEdge: boolean;
  note?: string;
  createdAt: string;
}

// ─── Treatment Plan ─────────────────────────────────────

export interface TreatmentPlan {
  primaryFocus: string;
  pathways: TreatmentPathway[];
  weeklyGoals: string[];
  recommendedExercises: string[];
  checkInFrequency: 'daily' | 'weekly';
}

export interface TreatmentPathway {
  name: string;
  description: string;
  milestones: string[];
  exercises: string[];
  estimatedWeeks: number;
}

// ─── Twelve Steps ──────────────────────────────────────

export type HealingPhase = 'seeing' | 'feeling' | 'shifting' | 'integrating' | 'sustaining';
export type StepStatus = 'locked' | 'active' | 'completed';

export interface HealingStep {
  stepNumber: number;
  title: string;
  /** V2 enriched subtitle — one-line field-language description */
  subtitle?: string;
  quote: string;
  therapeuticGoal: string;
  phase: HealingPhase;
  fourMovementsEmphasis: string;
  nuanceBehavior: {
    tone: string;
    focus: string;
    avoids: string[];
  };
  completionCriteria: string[];
  practices: string[]; // exercise IDs assigned to this step
  /** V3 — Warm intro text shown on the step detail screen */
  introText?: string;
  /** V3 — Mini-game identifier for this step */
  miniGameId?: string;
  /** Sprint B — Reflection prompts (3 per step) */
  reflectionPrompts?: string[];
  /** Sprint B — Async partner round prompt (couple-only) */
  partnerRoundPrompt?: string;
  /** Sprint B — Exercise IDs for together round (couple-only) */
  togetherPractices?: string[];
  /** Sprint B — Micro-course IDs unlocked at this step */
  courseGatewayIds?: string[];
}

export interface StepProgress {
  id: string;
  userId: string;
  coupleId?: string;
  stepNumber: number;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  reflectionNotes?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeCompletion {
  id: string;
  userId: string;
  coupleId?: string;
  practiceId: string;
  stepNumber?: number;
  completedBy: 'individual' | 'partner_a' | 'partner_b' | 'together';
  completionData?: Record<string, any>;
  aiCoachNotes?: string;
  completedAt: string;
  createdAt: string;
}

// ─── Mini-Game Output ──────────────────────────────────

export interface MiniGameOutput {
  id?: string;
  userId: string;
  stepNumber: number;
  gameId: string;
  title: string;
  insights: string[];
  data: Record<string, any>;
  completedAt: string;
  createdAt?: string;
}
