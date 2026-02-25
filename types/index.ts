/**
 * Shared types for Tender.
 * Supports 6 individual + 3 dyadic assessment instruments.
 */

// ─── Assessment Type Enum ─────────────────────────────────

export type IndividualAssessmentType =
  | 'ecr-r'
  | 'ipip-neo-120'
  | 'values'
  | 'sseit'
  | 'dutch'
  | 'dsi-r';

export type DyadicAssessmentType =
  | 'rdas'
  | 'dci'
  | 'csi-16'
  | 'csi-4'
  | 'relational-field'
  | 'couple-field';

export type AssessmentType = IndividualAssessmentType | DyadicAssessmentType;

// ─── Question Input Types ─────────────────────────────────

export type QuestionInputType = 'likert' | 'text' | 'choice' | 'ranking';

export interface LikertOption {
  value: number;
  label: string;
}

export interface ChoiceOption {
  key: string;       // 'A', 'B', 'C', 'D'
  text: string;
  coding: string;    // e.g., 'honesty_high', 'avoidance'
}

export interface RankingItem {
  id: string;
  label: string;
  description?: string;
}

export interface GenericQuestion {
  id: number;               // 1-indexed
  text: string;
  inputType: QuestionInputType;
  subscale?: string;
  reverseScored?: boolean;
  // Likert override (per-question scale, falls back to config.likertScale):
  likertScale?: LikertOption[];
  // Text questions:
  charLimit?: number;
  placeholder?: string;
  // Choice questions:
  choices?: ChoiceOption[];
  // Ranking questions:
  rankingItems?: RankingItem[];
  rankCount?: number;
}

// ─── Assessment Sections (for breaks) ─────────────────────

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questionRange: [number, number]; // [startIndex, endIndex] inclusive, 0-based
}

// ─── Assessment Config ────────────────────────────────────

export interface AssessmentConfig {
  type: AssessmentType;
  name: string;
  shortName: string;
  description: string;
  instructions: string;
  estimatedMinutes: number;
  totalQuestions: number;
  questions: GenericQuestion[];
  likertScale?: LikertOption[];
  sections?: AssessmentSection[];
  scoringFn: (responses: (number | string | string[] | null)[]) => any;
  progressKey: string;
}

// ─── Unified DB Record ────────────────────────────────────

export interface AssessmentRecord {
  id: string;
  user_id: string;
  type: AssessmentType;
  responses: any;       // JSONB
  scores: any;          // JSONB
  completed_at: string;
  created_at: string;
}

// ─── ECR-R Specific ───────────────────────────────────────

export type AttachmentStyle =
  | 'secure'
  | 'anxious-preoccupied'
  | 'dismissive-avoidant'
  | 'fearful-avoidant';

export interface ECRRScores {
  anxietyScore: number;
  avoidanceScore: number;
  attachmentStyle: AttachmentStyle;
}

// Keep backward compat for existing code during migration
export interface ECRRAssessment {
  id: number;
  user_id: string;
  responses: number[];
  anxiety_score: number;
  avoidance_score: number;
  attachment_style: AttachmentStyle;
  completed_at: string;
  created_at: string;
}

// Legacy question type (used by old utils/questions.ts)
export interface Question {
  id: number;
  text: string;
  subscale: 'anxiety' | 'avoidance';
  reverseScored: boolean;
}

// ─── DUTCH Scores ─────────────────────────────────────────

export interface DUTCHScores {
  subscaleScores: Record<string, { sum: number; mean: number }>;
  primaryStyle: string;
  secondaryStyle: string;
}

// ─── SSEIT Scores ─────────────────────────────────────────

export interface SSEITScores {
  totalScore: number;
  totalMean: number;
  totalNormalized: number;
  subscaleScores: Record<string, { sum: number; mean: number; itemCount: number }>;
  subscaleNormalized: Record<string, number>;
}

// ─── DSI-R Scores ─────────────────────────────────────────

export interface DSIRScores {
  totalMean: number;
  totalNormalized: number;
  subscaleScores: Record<string, {
    sum: number;
    rawMean: number;
    reversedMean: number;
    normalized: number;
    itemCount: number;
  }>;
}

// ─── IPIP-NEO-120 Scores ─────────────────────────────────

export interface IPIPScores {
  domainScores: Record<string, { sum: number; mean: number }>;
  domainPercentiles: Record<string, number>;
  facetScores: Record<string, { sum: number; mean: number }>;
  facetPercentiles: Record<string, number>;
}

// ─── Values Scores ────────────────────────────────────────

export interface ValuesScores {
  domainScores: Record<string, { importance: number; accordance: number; gap: number }>;
  top5Values: string[];
  qualitativeResponses: {
    partnerIdentity: string;
    nonNegotiables: string;
    aspirationalVision: string;
  };
  actionResponses: Record<string, string>;
  avoidanceTendency: number;
  balancedTendency: number;
  highGapDomains: string[];
}

// ─── Assessment Status (for home screen) ──────────────────

export interface AssessmentStatus {
  type: AssessmentType;
  state: 'not_started' | 'in_progress' | 'completed';
  progressQuestion?: number;   // current question if in_progress
  completedAt?: string;
}

// ─── Tender Assessment (Unified Flow) ────────────────────

export interface TenderSection {
  sectionNumber: number;
  fieldName: string;
  fieldDescription: string;
  /** Assessment type — usually individual, but Section 7 (RFAS) crosses categories */
  assessmentType: AssessmentType;
  supplementGroup?: string;
  estimatedMinutes: number;
  breakAfter: boolean;
  breakMessage?: string;
}

// ─── Couple Instrument Scores ────────────────────────────

export interface RelationalFieldScores {
  totalScore: number;
  totalMean: number;
  fieldRecognition: { sum: number; mean: number };
  creativeTension: { sum: number; mean: number };
  presenceAttunement: { sum: number; mean: number };
  emergentOrientation: { sum: number; mean: number };
}

export interface CoupleFieldScores {
  patternSection: Record<string, any>;
  resourceSection: Record<string, any>;
  growingEdgeSection: Record<string, any>;
}

// ─── Portrait Types (re-export) ─────────────────────────

export type {
  CompositeScores,
  PatternCategory,
  DetectedPattern,
  PatternResult,
  AREProfile,
  EmotionalStructure,
  AttachmentLens,
  PartsLens,
  RegulationToolkit,
  CoRegulationPattern,
  RegulationLens,
  ValuesLens,
  FourLensAnalysis,
  CyclePosition,
  NegativeCycle,
  GrowthEdgeCategory,
  GrowthEdge,
  AnchorCategory,
  AnchorPoints,
  PartnerGuideState,
  PartnerGuide,
  IndividualPortrait,
  AllAssessmentScores,
} from './portrait';

// ─── Chat & Agent Types ────────────────────────────────────

export type {
  NervousSystemState,
  StateConfidence,
  StateDetectionResult,
  ConversationMode,
  MessageRole,
  ChatMessage,
  MessageMetadata,
  ChatSession,
  SafetyCheckResult,
  CrisisResource,
  AgentContext,
  ChatRequest,
  ChatResponse,
} from './chat';

// ─── Intervention & Exercise Types ───────────────────────

export type {
  InterventionCategory,
  InterventionDifficulty,
  ExerciseStepType,
  ExerciseStep,
  Intervention,
  ExerciseCompletion,
} from './intervention';

// ─── Growth & Treatment Plan Types ──────────────────────

export type {
  GrowthStage,
  GrowthEdgeProgress,
  DailyCheckIn,
  TreatmentPlan,
  TreatmentPathway,
} from './growth';

// ─── Couples & Dyadic Types ────────────────────────────

export type {
  InviteStatus,
  CoupleInvite,
  CoupleStatus,
  Couple,
  UserProfile,
  DyadicAssessmentRecord,
  RDASScores,
  DCIScores,
  CSI16Scores,
  CSI4Scores,
  RelationshipPatternType,
  RelationshipPattern,
  DiscrepancyItem,
  DiscrepancyAnalysis,
  RelationshipGrowthEdge,
  RelationshipPortrait,
  AppPhase,
  AppUnlockState,
} from './couples';

// ─── Dating Well Types ──────────────────────────────────

export type {
  GameAnswer,
  ArchetypeScores,
  ConstellationResult,
  GameScenario,
  GameOption,
  DatingPreferences,
  DatingProfile,
  DatingLetter,
  DatingRoomActivity,
  DatingJournalEntry,
  MeetingRoom,
  HotelRoom,
  HotelRoomContent,
  HotelRoomContentType,
  PreferenceField,
  PreferenceSection,
  CompatibilityDimension,
  ArchetypeDefinition,
  AttachmentPattern,
  DatingPractice,
  DateScenario,
  DateScenarioOption,
  DatingSignal,
  TransitionGuidepost,
} from './dating';

// ─── WEARE Types (Phase 4) ─────────────────────────────

export type {
  WEAREDataMode,
  WEAREMovementPhase,
  WEAREVariableScore,
  WEAREVariables,
  WEARELayers,
  WEAREVariableName,
  WEAREBottleneck,
  WEARETrendDirection,
  WEARETrend,
  WEAREWarmSummary,
  WEAREProfile,
  WeeklyCheckIn,
  WEAREInput,
  WEAREPartnerData,
  WEAREBehavioralData,
  WEAREScoreRow,
  WeeklyCheckInRow,
} from './weare';

// ─── Support Groups Types ─────────────────────────────
export type {
  SupportGroupType,
  MemberStatus,
  GroupStatus,
  SessionStatus,
  SupportGroup,
  SupportGroupMember,
  SupportGroupSession,
  SupportGroupAttendance,
  RegistrationFormData,
  AdaptedStep,
  GroupRecommendation,
} from './support-groups';

// ─── Notification Types ────────────────────────────────
export type {
  NotificationCategory,
  EngagementPrompt,
  CategoryConfig,
  NotificationInstance,
  NotificationSelectionState,
  EngagementNotificationPreferences,
} from './notifications';
