/**
 * Progressive Unlock Logic
 *
 * Determines which app features/sections are available based on
 * the user's completed assessments, portrait status, and partner link.
 */

import type { AssessmentType, DyadicAssessmentType } from '@/types';
import { Colors } from '@/constants/theme';
import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';
import {
  HeartDoubleIcon,
  BrainIcon,
  MasksIcon,
  ScaleIcon,
  LeafIcon,
  CompassIcon,
  SparkleIcon,
  ChatBubbleIcon,
  TargetIcon,
  BookOpenIcon,
  ClipboardIcon,
  SearchIcon,
  HandshakeIcon,
  CoupleIcon,
  HeartIcon,
  SeedlingIcon,
  RainbowIcon,
} from '@/assets/graphics/icons';

export interface UnlockState {
  // Individual assessment result cards
  attachmentResults: boolean;     // ECR-R completed
  personalityResults: boolean;    // IPIP-NEO-120 completed
  emotionalIntelligence: boolean; // SSEIT completed
  conflictStyle: boolean;         // DUTCH completed
  differentiation: boolean;       // DSI-R completed
  valuesProfile: boolean;         // Values completed

  // Composite features
  fullPortrait: boolean;          // All 6 individual assessments done
  couplesPortal: boolean;         // Available after 4+ assessments
  aiCoach: boolean;               // Available after 1+ assessment
  practices: boolean;             // Always available
  courses: boolean;               // Available after 1+ assessment
  treatmentPlan: boolean;         // Available after 3+ assessments
  findTherapist: boolean;         // Always available
  community: boolean;             // Always available

  // Growth
  healingJourney: boolean;      // Available after 1+ assessment

  // Dating
  datingWell: boolean;          // Always available

  // Card Game
  buildingBridges: boolean;     // Always available

  // Counts
  completedCount: number;
  totalRequired: number;
  progressPercent: number;
}

export type FeatureKey = keyof Omit<UnlockState, 'completedCount' | 'totalRequired' | 'progressPercent'>;

/** Assessment → result card mapping */
export const ASSESSMENT_FEATURE_MAP: Record<string, FeatureKey> = {
  'ecr-r': 'attachmentResults',
  'tender-personality-60': 'personalityResults',
  'sseit': 'emotionalIntelligence',
  'dutch': 'conflictStyle',
  'dsi-r': 'differentiation',
  'values': 'valuesProfile',
};

/** Reverse mapping: feature key → assessment type */
export const FEATURE_KEY_TO_ASSESSMENT_TYPE: Record<string, string> = Object.fromEntries(
  Object.entries(ASSESSMENT_FEATURE_MAP).map(([assessmentType, featureKey]) => [featureKey, assessmentType])
);

/** Human-readable names for each assessment */
export const ASSESSMENT_DISPLAY_NAMES: Record<string, string> = {
  'ecr-r': 'Attachment Style',
  'tender-personality-60': 'Personality',
  'sseit': 'Emotional Intelligence',
  'dutch': 'Conflict Style',
  'dsi-r': 'Differentiation',
  'values': 'Values',
  'rdas': 'Relationship Satisfaction',
  'dci': 'Dyadic Coping',
  'csi-16': 'Couple Satisfaction',
};

/** Feature display info */
export interface FeatureCard {
  key: FeatureKey;
  title: string;
  subtitle: string;
  icon: ComponentType<IconProps>;
  color: string;
  unlockHint: string;  // What's needed to unlock
  route: string;       // Where to navigate
  category: 'result' | 'feature' | 'couple';
}

export const FEATURE_CARDS: FeatureCard[] = [
  // Individual result cards
  {
    key: 'attachmentResults',
    title: 'How You Connect',
    subtitle: 'Your attachment patterns and how you reach for closeness or create distance',
    icon: HeartDoubleIcon,
    color: Colors.secondary,
    unlockHint: 'Complete the assessment',
    route: '/(app)/results',
    category: 'result',
  },
  {
    key: 'personalityResults',
    title: 'Who You Are',
    subtitle: 'Your personality and how it shapes the way you show up',
    icon: BrainIcon,
    color: '#5B6B8A',
    unlockHint: 'Complete the assessment',
    route: '/(app)/results',
    category: 'result',
  },
  {
    key: 'emotionalIntelligence',
    title: 'How You Feel',
    subtitle: 'How you sense, name, and navigate what you feel',
    icon: MasksIcon,
    color: '#6BA3A0',
    unlockHint: 'Complete the assessment',
    route: '/(app)/results',
    category: 'result',
  },
  {
    key: 'conflictStyle',
    title: 'How You Fight',
    subtitle: 'Your approach to conflict and what you do when things get hard',
    icon: ScaleIcon,
    color: Colors.accent,
    unlockHint: 'Complete the assessment',
    route: '/(app)/results',
    category: 'result',
  },
  {
    key: 'differentiation',
    title: 'How You Hold Your Ground',
    subtitle: 'Your boundaries and ability to stay yourself while staying close',
    icon: LeafIcon,
    color: Colors.primary,
    unlockHint: 'Complete the assessment',
    route: '/(app)/results',
    category: 'result',
  },
  {
    key: 'valuesProfile',
    title: 'What Matters to You',
    subtitle: 'Your values and what you want to move toward together',
    icon: CompassIcon,
    color: '#8B6914',
    unlockHint: 'Complete the assessment',
    route: '/(app)/results',
    category: 'result',
  },

  // Composite features
  {
    key: 'fullPortrait',
    title: 'Full Relational Portrait',
    subtitle: 'Your complete pattern analysis across 4 lenses',
    icon: SparkleIcon,
    color: Colors.primary,
    unlockHint: 'All 6 sections reveal your complete relational portrait',
    route: '/(app)/portrait',
    category: 'feature',
  },
  {
    key: 'aiCoach',
    title: 'Nuance AI',
    subtitle: 'Your AI relationship guide — always here',
    icon: ChatBubbleIcon,
    color: Colors.primary,
    unlockHint: 'Complete 1 section to start your AI coaching journey',
    route: '/(app)/chat',
    category: 'feature',
  },
  {
    key: 'practices',
    title: 'Practices & Exercises',
    subtitle: '32 guided practices across 7 modalities',
    icon: TargetIcon,
    color: Colors.secondary,
    unlockHint: '',
    route: '/(app)/exercises',
    category: 'feature',
  },
  {
    key: 'courses',
    title: 'Learning Courses',
    subtitle: '6 micro-courses to deepen your understanding',
    icon: BookOpenIcon,
    color: '#6B5B8A',
    unlockHint: 'Complete 1 section to access guided learning courses',
    route: '/(app)/courses',
    category: 'feature',
  },
  {
    key: 'treatmentPlan',
    title: 'Growth Plan',
    subtitle: 'Your personalized growth pathway',
    icon: ClipboardIcon,
    color: '#5B6B8A',
    unlockHint: 'Complete 3+ sections to unlock your personalized growth roadmap',
    route: '/(app)/treatment-plan',
    category: 'feature',
  },
  {
    key: 'findTherapist',
    title: 'Group Support & Therapy',
    subtitle: 'Support groups and therapy matched to you',
    icon: SearchIcon,
    color: '#6BA3A0',
    unlockHint: '',
    route: '/(app)/find-therapist',
    category: 'feature',
  },
  {
    key: 'community',
    title: 'Community',
    subtitle: 'Anonymous stories and curated resources',
    icon: HandshakeIcon,
    color: '#7B8F6B',
    unlockHint: '',
    route: '/(app)/community',
    category: 'feature',
  },
  {
    key: 'healingJourney',
    title: 'Your Relational Journey',
    subtitle: 'Twelve steps, practices, and your growth arc',
    icon: SeedlingIcon,
    color: Colors.primary,
    unlockHint: 'Complete 1 assessment to unlock',
    route: '/(app)/growth',
    category: 'feature',
  },
  {
    key: 'datingWell',
    title: 'Dating Well',
    subtitle: 'The Art of Beginning',
    icon: HeartIcon,
    color: Colors.primaryLight,
    unlockHint: '',
    route: '/(app)/dating-well',
    category: 'feature',
  },
  {
    key: 'buildingBridges',
    title: 'Building Bridges',
    subtitle: 'Card game for deeper connection',
    icon: RainbowIcon,
    color: Colors.accent,
    unlockHint: '',
    route: '/(app)/building-bridges',
    category: 'feature',
  },
  {
    key: 'couplesPortal',
    title: 'Couple Portal',
    subtitle: 'Shared portrait, couple assessments, and coaching',
    icon: CoupleIcon,
    color: Colors.secondary,
    unlockHint: 'Complete 4+ sections to explore your relationship together',
    route: '/(app)/partner',
    category: 'couple',
  },
];

/**
 * Given a list of completed assessment types, compute unlock state.
 */
export function getUnlockState(
  completedAssessments: AssessmentType[],
  hasPortrait: boolean = false,
  hasCoupleLinked: boolean = false,
): UnlockState {
  const completed = new Set(completedAssessments);
  const completedCount = completed.size;

  return {
    // Individual results
    attachmentResults: completed.has('ecr-r'),
    personalityResults: completed.has('tender-personality-60'),
    emotionalIntelligence: completed.has('sseit'),
    conflictStyle: completed.has('dutch'),
    differentiation: completed.has('dsi-r'),
    valuesProfile: completed.has('values'),

    // Composite
    fullPortrait: hasPortrait || completedCount >= 7,
    couplesPortal: completedCount >= 4,
    aiCoach: completedCount >= 1,
    practices: true,
    courses: completedCount >= 1,
    treatmentPlan: completedCount >= 3,
    findTherapist: true,
    community: true,
    healingJourney: completedCount >= 1,
    datingWell: true,
    buildingBridges: true,

    // Counts
    completedCount,
    totalRequired: 7,
    progressPercent: Math.round((completedCount / 7) * 100),
  };
}

/**
 * Get the next recommended assessment to take.
 */
export function getNextAssessment(completedAssessments: AssessmentType[]): AssessmentType | null {
  const order: AssessmentType[] = ['ecr-r', 'dutch', 'sseit', 'dsi-r', 'values', 'tender-personality-60', 'relational-field'];
  const completed = new Set(completedAssessments);
  return order.find((t) => !completed.has(t)) ?? null;
}

// ─── Dyadic Assessment Timing Gates ─────────────────────

/**
 * Relationship-duration values stored in user profiles.
 * 'less-than-1' means < 1 year together.
 */
type RelationshipDuration = string | null | undefined;

/**
 * CSI-16 (Couple Satisfaction Index) should only be available for
 * couples who have been together at least one year.
 * Satisfaction measurement is less meaningful for very new relationships.
 */
export function canTakeCSI16(relationshipDuration: RelationshipDuration): boolean {
  return relationshipDuration !== 'less-than-1';
}

/**
 * Filter dyadic assessment types based on timing gates.
 * Currently only CSI-16 has a gate; extend here as more gates are added.
 */
export function getGatedDyadicTypes(
  allTypes: DyadicAssessmentType[],
  relationshipDuration: RelationshipDuration,
): DyadicAssessmentType[] {
  return allTypes.filter((type) => {
    if (type === 'csi-16') return canTakeCSI16(relationshipDuration);
    return true;
  });
}

/**
 * Get a motivational message based on progress.
 */
export function getProgressMessage(completedCount: number): string {
  if (completedCount === 0) {
    return 'Take your first assessment to begin discovering your relational patterns.';
  }
  if (completedCount === 1) {
    return 'Great start! Each assessment adds a new dimension to your portrait.';
  }
  if (completedCount === 2) {
    return 'You\'re building momentum. One more unlocks your Growth Plan.';
  }
  if (completedCount === 3) {
    return 'Halfway there! Your Growth Plan is now available.';
  }
  if (completedCount === 4) {
    return 'Almost there — two more assessments unlock your full portrait.';
  }
  if (completedCount === 5) {
    return 'One more assessment and your full relational portrait will be ready!';
  }
  return 'All assessments complete. Your full portrait is ready to explore.';
}
