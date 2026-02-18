/**
 * Connection Matrix — Assessment dimension definitions, quadrant data,
 * cross-assessment connection relationships, and ripple effect logic.
 *
 * Supports the Interactive Assessment Matrix Visualization:
 *   Phase 1-2: Attachment scatter plot + explore mode
 *   Phase 3: Cross-assessment connections + ripple effects
 *   Phase 4: Combined profile view
 */

import type { AttachmentStyle } from '@/types';

// ─── Quadrant Definitions ──────────────────────────────────

export interface QuadrantDef {
  id: AttachmentStyle;
  label: string;
  warmLabel: string;
  color: string;
}

export const QUADRANTS: QuadrantDef[] = [
  {
    id: 'secure',
    label: 'Secure',
    warmLabel: 'Grounded Connection',
    color: '#A8D5BA',
  },
  {
    id: 'anxious-preoccupied',
    label: 'Anxious-Preoccupied',
    warmLabel: 'The Reach',
    color: '#F4C95D',
  },
  {
    id: 'dismissive-avoidant',
    label: 'Dismissive-Avoidant',
    warmLabel: 'The Retreat',
    color: '#7FB3D3',
  },
  {
    id: 'fearful-avoidant',
    label: 'Fearful-Avoidant',
    warmLabel: 'The Push-Pull',
    color: '#C4A8D1',
  },
];

/** Color for the user's dot on the scatter plot. */
export const DOT_COLOR = '#E07A5F';

/** Quadrant boundary (midpoint of 1-7 scale). */
export const QUADRANT_BOUNDARY = 4.0;

/** Derive attachment style from raw scores. */
export function getStyleFromScores(
  anxiety: number,
  avoidance: number
): AttachmentStyle {
  const highAnxiety = anxiety >= QUADRANT_BOUNDARY;
  const highAvoidance = avoidance >= QUADRANT_BOUNDARY;

  if (highAnxiety && highAvoidance) return 'fearful-avoidant';
  if (highAnxiety && !highAvoidance) return 'anxious-preoccupied';
  if (!highAnxiety && highAvoidance) return 'dismissive-avoidant';
  return 'secure';
}

/** Get quadrant definition by style. */
export function getQuadrant(style: AttachmentStyle): QuadrantDef {
  return QUADRANTS.find((q) => q.id === style) ?? QUADRANTS[0];
}

// ─── Explore Mode Insight Text ──────────────────────────────

/** Dynamic insight when user drags toward a different quadrant. */
export function getExploreInsight(
  fromStyle: AttachmentStyle,
  toStyle: AttachmentStyle
): string {
  if (fromStyle === toStyle) return '';

  const insights: Record<string, string> = {
    'anxious-preoccupied→secure':
      'Moving toward lower anxiety would shift you toward Secure. This typically involves building trust that your needs will be met without constant reassurance.',
    'anxious-preoccupied→dismissive-avoidant':
      'Moving toward higher avoidance with lower anxiety would shift you toward Dismissive-Avoidant. This might look like pulling away from the intensity of connection.',
    'anxious-preoccupied→fearful-avoidant':
      'Moving toward higher avoidance would shift you toward Fearful-Avoidant. This is what happens when anxiety meets withdrawal — wanting connection but fearing it will not be safe.',
    'dismissive-avoidant→secure':
      'Moving toward lower avoidance would shift you toward Secure. This involves building windows of openness — letting people in without losing yourself.',
    'dismissive-avoidant→anxious-preoccupied':
      'Moving toward higher anxiety with lower avoidance would shift you toward Anxious-Preoccupied. The wall comes down, but the alarm system activates.',
    'dismissive-avoidant→fearful-avoidant':
      'Moving toward higher anxiety would shift you toward Fearful-Avoidant. The independence remains, but now there is a longing underneath it.',
    'fearful-avoidant→secure':
      'Moving toward lower anxiety and avoidance would shift you toward Secure. This is the path of earned security — holding both the need and the fear, and choosing connection anyway.',
    'fearful-avoidant→anxious-preoccupied':
      'Moving toward lower avoidance would shift you toward Anxious-Preoccupied. The wall comes down, and the reaching intensifies.',
    'fearful-avoidant→dismissive-avoidant':
      'Moving toward lower anxiety would shift you toward Dismissive-Avoidant. The anxiety quiets, but the distance remains.',
    'secure→anxious-preoccupied':
      'Moving toward higher anxiety would shift you toward Anxious-Preoccupied. The groundedness gives way to monitoring and seeking reassurance.',
    'secure→dismissive-avoidant':
      'Moving toward higher avoidance would shift you toward Dismissive-Avoidant. The openness contracts into self-sufficiency.',
    'secure→fearful-avoidant':
      'Moving toward higher anxiety and avoidance would shift you toward Fearful-Avoidant. Both the reaching and retreating activate simultaneously.',
  };

  const key = `${fromStyle}→${toStyle}`;
  return insights[key] || '';
}

// ─── Cross-Assessment Connections (Phase 3) ─────────────────

export type ConnectionStrength = 'strong' | 'moderate' | 'weak';
export type ConnectionDirection = 'positive' | 'negative';

export interface AssessmentConnection {
  from: { assessment: string; dimension: string; label: string };
  to: { assessment: string; dimension: string; label: string };
  direction: ConnectionDirection;
  strength: ConnectionStrength;
  strengthValue: number; // 0-1 for calculations
  insight: string;
}

/** Human-readable assessment names. */
export const ASSESSMENT_LABELS: Record<string, string> = {
  'ecr-r': 'How You Connect',
  'ipip-neo-120': 'Who You Are',
  sseit: 'How You Feel',
  'dsi-r': 'How You Hold Your Ground',
  dutch: 'How You Fight',
  values: 'What Matters to You',
  'relational-field': 'The Space Between',
};

/** Colors per assessment for the connection map. */
export const ASSESSMENT_COLORS: Record<string, string> = {
  'ecr-r': '#C4616E',
  'ipip-neo-120': '#5B6B8A',
  sseit: '#6BA3A0',
  'dsi-r': '#6B9080',
  dutch: '#D4A843',
  values: '#D8A499',
  'relational-field': '#7294D4',
};

/** Psychologically-grounded connections between assessment dimensions. */
export const ASSESSMENT_CONNECTIONS: AssessmentConnection[] = [
  // Attachment → Conflict
  {
    from: { assessment: 'ecr-r', dimension: 'anxietyScore', label: 'Attachment Anxiety' },
    to: { assessment: 'dutch', dimension: 'yielding', label: 'Yielding' },
    direction: 'positive',
    strength: 'strong',
    strengthValue: 0.7,
    insight:
      'Higher attachment anxiety often leads to yielding in conflict — accommodating to preserve connection.',
  },
  {
    from: { assessment: 'ecr-r', dimension: 'anxietyScore', label: 'Attachment Anxiety' },
    to: { assessment: 'dutch', dimension: 'forcing', label: 'Competing' },
    direction: 'positive',
    strength: 'moderate',
    strengthValue: 0.5,
    insight:
      'Attachment anxiety can fuel competing in conflict — fighting harder to be heard and reconnect.',
  },
  {
    from: { assessment: 'ecr-r', dimension: 'avoidanceScore', label: 'Attachment Avoidance' },
    to: { assessment: 'dutch', dimension: 'avoiding', label: 'Avoiding' },
    direction: 'positive',
    strength: 'strong',
    strengthValue: 0.8,
    insight:
      'Those who avoid emotional closeness tend to also avoid conflict, creating a double withdrawal pattern.',
  },

  // Attachment → Emotional Intelligence
  {
    from: { assessment: 'ecr-r', dimension: 'anxietyScore', label: 'Attachment Anxiety' },
    to: { assessment: 'sseit', dimension: 'managingOwn', label: 'Self-Regulation' },
    direction: 'negative',
    strength: 'moderate',
    strengthValue: 0.6,
    insight:
      'Higher anxiety makes self-regulation harder — your alarm system fires more easily, leaving less bandwidth for steady responses.',
  },
  {
    from: { assessment: 'ecr-r', dimension: 'avoidanceScore', label: 'Attachment Avoidance' },
    to: { assessment: 'sseit', dimension: 'managingOthers', label: 'Social Awareness' },
    direction: 'negative',
    strength: 'moderate',
    strengthValue: 0.5,
    insight:
      'Avoidant attachment can limit awareness of others\u2019 emotions — the wall that protects you also blocks information.',
  },

  // Attachment → Differentiation
  {
    from: { assessment: 'ecr-r', dimension: 'anxietyScore', label: 'Attachment Anxiety' },
    to: { assessment: 'dsi-r', dimension: 'emotionalReactivity', label: 'Emotional Reactivity' },
    direction: 'negative',
    strength: 'strong',
    strengthValue: 0.8,
    insight:
      'Attachment anxiety intensifies emotional reactivity — your alarm system fires more easily under relational stress.',
  },
  {
    from: { assessment: 'ecr-r', dimension: 'avoidanceScore', label: 'Attachment Avoidance' },
    to: { assessment: 'dsi-r', dimension: 'emotionalCutoff', label: 'Emotional Cutoff' },
    direction: 'negative',
    strength: 'strong',
    strengthValue: 0.7,
    insight:
      'Avoidant attachment patterns and emotional cutoff reinforce each other — distance becomes the default.',
  },

  // Personality → Emotional Intelligence
  {
    from: { assessment: 'ipip-neo-120', dimension: 'neuroticism', label: 'Neuroticism' },
    to: { assessment: 'sseit', dimension: 'managingOwn', label: 'Self-Regulation' },
    direction: 'negative',
    strength: 'strong',
    strengthValue: 0.7,
    insight:
      'Higher neuroticism creates a steeper climb for emotion regulation — your system is more reactive by temperament.',
  },

  // Emotional Intelligence → Conflict
  {
    from: { assessment: 'sseit', dimension: 'managingOwn', label: 'Self-Regulation' },
    to: { assessment: 'dutch', dimension: 'problemSolving', label: 'Problem-Solving' },
    direction: 'positive',
    strength: 'moderate',
    strengthValue: 0.6,
    insight:
      'Better self-regulation enables collaborative problem-solving rather than reactive conflict patterns.',
  },

  // Personality → Attachment
  {
    from: { assessment: 'ipip-neo-120', dimension: 'agreeableness', label: 'Agreeableness' },
    to: { assessment: 'ecr-r', dimension: 'avoidanceScore', label: 'Attachment Avoidance' },
    direction: 'negative',
    strength: 'moderate',
    strengthValue: 0.5,
    insight:
      'Lower agreeableness and higher avoidance often travel together — independence as both personality trait and protective strategy.',
  },

  // Differentiation → Conflict
  {
    from: { assessment: 'dsi-r', dimension: 'iPosition', label: 'I-Position' },
    to: { assessment: 'dutch', dimension: 'problemSolving', label: 'Problem-Solving' },
    direction: 'positive',
    strength: 'strong',
    strengthValue: 0.7,
    insight:
      'A strong sense of self supports collaborative conflict resolution — you can hold your position while remaining open.',
  },

  // Values → Differentiation
  {
    from: { assessment: 'values', dimension: 'avoidanceTendency', label: 'Values Avoidance' },
    to: { assessment: 'dsi-r', dimension: 'fusionWithOthers', label: 'Fusion' },
    direction: 'positive',
    strength: 'moderate',
    strengthValue: 0.5,
    insight:
      'Values avoidance and fusion patterns share a root — difficulty holding your own ground in the face of relationship pressure.',
  },
];
