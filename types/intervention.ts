/**
 * Intervention & exercise types for Tender.
 * Defines micro-course exercises, steps, and completion tracking.
 */

import type { NervousSystemState } from './chat';

// ─── Intervention Categories ────────────────────────────

export type InterventionCategory =
  | 'regulation'
  | 'communication'
  | 'attachment'
  | 'values'
  | 'differentiation';

export type InterventionDifficulty = 'beginner' | 'intermediate' | 'advanced';

// ─── Exercise Steps ─────────────────────────────────────

export type ExerciseStepType = 'instruction' | 'reflection' | 'timer' | 'prompt';

export interface ExerciseStep {
  type: ExerciseStepType;
  title: string;
  content: string;
  duration?: number; // seconds for timer steps
  promptPlaceholder?: string;
}

// ─── Four Movements ────────────────────────────────────

export type FourMovement = 'recognition' | 'release' | 'resonance' | 'embodiment';

export type VulnerabilityLevel = 'low' | 'moderate' | 'high';

// ─── Intervention ───────────────────────────────────────

export type ExerciseMode = 'solo' | 'together' | 'either';

export interface Intervention {
  id: string;
  title: string;
  description: string;
  category: InterventionCategory;
  duration: number; // minutes
  difficulty: InterventionDifficulty;
  mode: ExerciseMode; // solo, together, or either
  forStates: NervousSystemState[];
  forPatterns: string[];
  steps: ExerciseStep[];
  /** Primary Four Movement this practice cultivates */
  fourMovement?: FourMovement;
  /** How emotionally exposed / vulnerable this practice is */
  vulnerabilityLevel?: VulnerabilityLevel;
  /** Ideal nervous-system state(s) to begin this practice */
  bestEntryStates?: NervousSystemState[];
  /** One-line field-language insight shown on practice card */
  fieldInsight?: string;
}

// ─── Completion Tracking ────────────────────────────────

export interface ExerciseCompletion {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName?: string;
  completedAt: string;
  reflection?: string;
  rating?: number;
  stepResponses?: StepResponseEntry[];
}

/** A single step response within an exercise completion. */
export interface StepResponseEntry {
  step: number;
  prompt: string;
  response: string;
  type: string;
}
