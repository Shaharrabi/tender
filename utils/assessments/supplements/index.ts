/**
 * Supplement registry — maps supplement group names to their questions and scoring.
 */

import type { GenericQuestion, LikertOption } from '@/types';

import {
  ECR_R_SUPPLEMENT_QUESTIONS,
  ECR_R_SUPPLEMENT_LIKERT,
  scoreECRRSupplement,
} from './ecr-r-supplement';

import {
  SSEIT_SUPPLEMENT_QUESTIONS,
  SSEIT_SUPPLEMENT_LIKERT,
  scoreSSEITSupplement,
} from './sseit-supplement';

import {
  DSI_R_SUPPLEMENT_QUESTIONS,
  DSI_R_SUPPLEMENT_LIKERT,
  scoreDSIRSupplement,
} from './dsi-r-supplement';

import {
  VALUES_SUPPLEMENT_QUESTIONS,
  scoreValuesSupplement,
} from './values-supplement';

export interface SupplementDef {
  questions: GenericQuestion[];
  scoringFn: (responses: (number | string | string[] | null)[]) => any;
  likertScale?: LikertOption[];
}

export const SUPPLEMENT_REGISTRY: Record<string, SupplementDef> = {
  'ecr-r-supplement': {
    questions: ECR_R_SUPPLEMENT_QUESTIONS,
    scoringFn: scoreECRRSupplement,
    likertScale: ECR_R_SUPPLEMENT_LIKERT,
  },
  'sseit-supplement': {
    questions: SSEIT_SUPPLEMENT_QUESTIONS,
    scoringFn: scoreSSEITSupplement,
    likertScale: SSEIT_SUPPLEMENT_LIKERT,
  },
  'dsi-r-supplement': {
    questions: DSI_R_SUPPLEMENT_QUESTIONS,
    scoringFn: scoreDSIRSupplement,
    likertScale: DSI_R_SUPPLEMENT_LIKERT,
  },
  'values-supplement': {
    questions: VALUES_SUPPLEMENT_QUESTIONS,
    scoringFn: scoreValuesSupplement,
  },
};

export function getSupplementDef(group: string): SupplementDef | undefined {
  return SUPPLEMENT_REGISTRY[group];
}

// Re-export individual modules for direct access
export { ECR_R_SUPPLEMENT_QUESTIONS, scoreECRRSupplement } from './ecr-r-supplement';
export { SSEIT_SUPPLEMENT_QUESTIONS, scoreSSEITSupplement } from './sseit-supplement';
export { DSI_R_SUPPLEMENT_QUESTIONS, scoreDSIRSupplement } from './dsi-r-supplement';
export { VALUES_SUPPLEMENT_QUESTIONS, scoreValuesSupplement } from './values-supplement';

export type { ECRRSupplementScores } from './ecr-r-supplement';
export type { SSEITSupplementScores } from './sseit-supplement';
export type { DSIRSupplementScores } from './dsi-r-supplement';
export type { ValuesSupplementScores } from './values-supplement';
