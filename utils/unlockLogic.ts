/**
 * Progressive Unlock Logic
 *
 * Determines which app features/sections are available based on
 * the user's completed assessments, portrait status, and partner link.
 */

import type { AssessmentType } from '@/types';

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
  couplesPortal: boolean;         // Partner linked + both complete
  aiCoach: boolean;               // Available after 1+ assessment
  practices: boolean;             // Always available
  treatmentPlan: boolean;         // Available after 3+ assessments
  findTherapist: boolean;         // Always available
  community: boolean;             // Available after 1+ assessment

  // Counts
  completedCount: number;
  totalRequired: number;
  progressPercent: number;
}

export type FeatureKey = keyof Omit<UnlockState, 'completedCount' | 'totalRequired' | 'progressPercent'>;

/** Assessment → result card mapping */
export const ASSESSMENT_FEATURE_MAP: Record<string, FeatureKey> = {
  'ecr-r': 'attachmentResults',
  'ipip-neo-120': 'personalityResults',
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
  'ipip-neo-120': 'Personality',
  'sseit': 'Emotional Intelligence',
  'dutch': 'Conflict Style',
  'dsi-r': 'Differentiation',
  'values': 'Values',
};

/** Feature display info */
export interface FeatureCard {
  key: FeatureKey;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  unlockHint: string;  // What's needed to unlock
  route: string;       // Where to navigate
  category: 'result' | 'feature' | 'couple';
}

export const FEATURE_CARDS: FeatureCard[] = [
  // Individual result cards
  {
    key: 'attachmentResults',
    title: 'Attachment Style',
    subtitle: 'How you connect and protect in relationships',
    icon: '💕',
    color: '#C4785B',
    unlockHint: 'Take the ECR-R assessment',
    route: '/(app)/results',
    category: 'result',
  },
  {
    key: 'personalityResults',
    title: 'Personality Profile',
    subtitle: 'Your Big Five personality traits and facets',
    icon: '🧠',
    color: '#5B6B8A',
    unlockHint: 'Take the IPIP-NEO-120 assessment',
    route: '/(app)/results',
    category: 'result',
  },
  {
    key: 'emotionalIntelligence',
    title: 'Emotional Intelligence',
    subtitle: 'How you perceive, manage, and use emotions',
    icon: '🎭',
    color: '#6BA3A0',
    unlockHint: 'Take the SSEIT assessment',
    route: '/(app)/results',
    category: 'result',
  },
  {
    key: 'conflictStyle',
    title: 'Conflict Style',
    subtitle: 'How you handle disagreements and tension',
    icon: '⚖️',
    color: '#D4A55A',
    unlockHint: 'Take the DUTCH assessment',
    route: '/(app)/results',
    category: 'result',
  },
  {
    key: 'differentiation',
    title: 'Differentiation',
    subtitle: 'Emotional maturity and boundaries in relationships',
    icon: '🌿',
    color: '#6B8F71',
    unlockHint: 'Take the DSI-R assessment',
    route: '/(app)/results',
    category: 'result',
  },
  {
    key: 'valuesProfile',
    title: 'Values Profile',
    subtitle: 'What matters most and where the gaps are',
    icon: '🧭',
    color: '#8B6914',
    unlockHint: 'Take the Values assessment',
    route: '/(app)/results',
    category: 'result',
  },

  // Composite features
  {
    key: 'fullPortrait',
    title: 'Full Relational Portrait',
    subtitle: 'Your complete pattern analysis across 4 lenses',
    icon: '✨',
    color: '#6B8F71',
    unlockHint: 'Complete all 6 assessments',
    route: '/(app)/portrait',
    category: 'feature',
  },
  {
    key: 'aiCoach',
    title: 'Talk to Sage',
    subtitle: 'Your AI relationship guide — always here',
    icon: '🌿',
    color: '#6B8F71',
    unlockHint: 'Complete 1 assessment to start',
    route: '/(app)/chat',
    category: 'feature',
  },
  {
    key: 'practices',
    title: 'Practices & Exercises',
    subtitle: '32 guided practices across 7 modalities',
    icon: '🎯',
    color: '#C4785B',
    unlockHint: '',
    route: '/(app)/exercises',
    category: 'feature',
  },
  {
    key: 'treatmentPlan',
    title: 'Growth Plan',
    subtitle: 'Your personalized growth pathway',
    icon: '📋',
    color: '#5B6B8A',
    unlockHint: 'Complete 3+ assessments',
    route: '/(app)/treatment-plan',
    category: 'feature',
  },
  {
    key: 'findTherapist',
    title: 'Find a Therapist',
    subtitle: 'Matched to your assessment patterns',
    icon: '🔍',
    color: '#6BA3A0',
    unlockHint: '',
    route: '/(app)/find-therapist',
    category: 'feature',
  },
  {
    key: 'couplesPortal',
    title: 'Couple Portal',
    subtitle: 'Shared portrait, couple assessments, and coaching',
    icon: '💑',
    color: '#C4785B',
    unlockHint: 'Both partners must complete their portraits',
    route: '/(app)/couple-portal',
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
    personalityResults: completed.has('ipip-neo-120'),
    emotionalIntelligence: completed.has('sseit'),
    conflictStyle: completed.has('dutch'),
    differentiation: completed.has('dsi-r'),
    valuesProfile: completed.has('values'),

    // Composite
    fullPortrait: hasPortrait || completedCount >= 6,
    couplesPortal: hasCoupleLinked && hasPortrait,
    aiCoach: completedCount >= 1,
    practices: true,
    treatmentPlan: completedCount >= 3,
    findTherapist: true,
    community: completedCount >= 1,

    // Counts
    completedCount,
    totalRequired: 6,
    progressPercent: Math.round((completedCount / 6) * 100),
  };
}

/**
 * Get the next recommended assessment to take.
 */
export function getNextAssessment(completedAssessments: AssessmentType[]): AssessmentType | null {
  const order: AssessmentType[] = ['ecr-r', 'dutch', 'sseit', 'dsi-r', 'values', 'ipip-neo-120'];
  const completed = new Set(completedAssessments);
  return order.find((t) => !completed.has(t)) ?? null;
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
