/**
 * Interactive Step Type Extensions
 *
 * Defines config interfaces for all interactive exercise step types.
 * Used by ExerciseFlow.tsx and individual step components.
 */

// ─── Phase 1: sentence_transform ────────────────────────

export interface SentenceTransformConfig {
  kind: 'sentence_transform';
  stages: SentenceTransformStage[];
}

export interface SentenceTransformStage {
  prefix: string;
  placeholder: string;
  explanation: string;
}

// ─── Phase 1: scenario_choice ───────────────────────────

export interface ScenarioChoiceConfig {
  kind: 'scenario_choice';
  scenario: string;
  choices: ScenarioChoice[];
  revealAll?: boolean;
}

export interface ScenarioChoice {
  id: string;
  text: string;
  feedback: string;
  isRecommended?: boolean;
}

// ─── Phase 2: checklist ─────────────────────────────────

export interface ChecklistConfig {
  kind: 'checklist';
  items: ChecklistItem[];
  minRequired?: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  subtext?: string;
}

// ─── Phase 2: scale_slider ──────────────────────────────

export interface ScaleSliderConfig {
  kind: 'scale_slider';
  labels: {
    low: string;
    mid?: string;
    high: string;
  };
  zones?: ScaleZone[];
  initialValue?: number;
}

export interface ScaleZone {
  range: [number, number];
  label: string;
  content: string;
}

// ─── Phase 2: breathing_guide ───────────────────────────

export interface BreathingGuideConfig {
  kind: 'breathing_guide';
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
  };
  cycles: number;
  colorShift?: {
    start: string;
    end: string;
  };
}

// ─── Phase 2: card_flip ─────────────────────────────────

export interface CardFlipConfig {
  kind: 'card_flip';
  cards: FlipCard[];
  mode: 'flip' | 'match';
}

export interface FlipCard {
  id: string;
  front: string;
  back: string;
  isTrue?: boolean;
}

// ─── Phase 3 (future): body_scan ────────────────────────

export interface BodyScanConfig {
  kind: 'body_scan';
  zones: BodyZone[];
  showThermometer?: boolean;
}

export interface BodyZone {
  id: string;
  label: string;
  revealText: string;
}

// ─── Phase 3 (future): card_sort ────────────────────────

export interface CardSortConfig {
  kind: 'card_sort';
  cards: Array<{
    id: string;
    text: string;
  }>;
  columns: Array<{
    id: string;
    label: string;
  }>;
  feedback?: Record<string, string>;
}

// ─── Union type ─────────────────────────────────────────

export type InteractiveStepConfig =
  | SentenceTransformConfig
  | ScenarioChoiceConfig
  | ChecklistConfig
  | ScaleSliderConfig
  | BreathingGuideConfig
  | CardFlipConfig
  | BodyScanConfig
  | CardSortConfig;
