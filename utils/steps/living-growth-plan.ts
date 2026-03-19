/**
 * Living Growth Plan — Individual
 *
 * A SMART-style treatment plan that maps growth edges to steps, courses,
 * exercises, and tracks progress over time. Updates when new data arrives.
 *
 * Each growth edge becomes a structured goal:
 *   Specific: What to build (e.g., "window of tolerance from 32 to 50+")
 *   Measurable: Which composite score to track
 *   Actionable: 3 practices from modality routing engine
 *   Relevant: Why this is #1 priority for THIS person
 *   Time-bound: Reassess in 8 weeks
 */

import type { CompositeScores } from '@/types';

// ─── Growth Edge → Step Mapping ──────────────────────────

/** Maps growth edge patterns to relevant 12-step steps */
const EDGE_STEP_MAP: Record<string, number[]> = {
  regulation: [1, 2, 4],
  'window-widening': [1, 2, 4],
  attachment: [1, 2, 5, 7],
  differentiation: [3, 6],
  'values-gap': [10],
  'conflict-flexibility': [3, 8, 9],
  'empathy-enmeshment': [5, 6],
  'perspective-taking': [5, 9],
  'truth-telling': [3, 8],
  'self-authorship': [3, 6, 8],
};

/** Maps growth edge patterns to relevant course IDs */
const EDGE_COURSE_MAP: Record<string, string[]> = {
  regulation: ['mc-window-widening', 'mc-grounding-101'],
  attachment: ['mc-attachment-101', 'mc-earned-security'],
  differentiation: ['mc-edge-between-us', 'mc-boundaries-in-love'],
  'values-gap': ['mc-values-alignment'],
  'conflict-flexibility': ['mc-conflict-as-resource', 'mc-repair-101'],
  'empathy-enmeshment': ['mc-empathy-boundaries', 'mc-edge-between-us'],
  'truth-telling': ['mc-difficult-conversations'],
};

/** Maps growth edge patterns to relevant exercise IDs */
const EDGE_EXERCISE_MAP: Record<string, string[]> = {
  regulation: ['grounding-5-4-3-2-1', 'window-check', 'self-compassion-break'],
  attachment: ['emotional-bid', 'soft-startup', 'repair-attempt'],
  differentiation: ['parts-check-in', 'values-compass'],
  'values-gap': ['values-compass'],
  'conflict-flexibility': ['soft-startup', 'repair-attempt'],
  'empathy-enmeshment': ['parts-check-in', 'window-check'],
  'perspective-taking': ['repair-attempt', 'emotional-bid'],
  'truth-telling': ['soft-startup'],
};

// ─── SMART Goal Structure ────────────────────────────────

export interface SMARTGoal {
  /** Growth edge title */
  title: string;
  /** Specific: What to build */
  specific: string;
  /** Measurable: Which score to track */
  measurable: string;
  /** Actionable: 3 practices */
  practices: string[];
  /** Relevant: Why this matters for THIS person */
  relevant: string;
  /** Time-bound: When to reassess */
  timeBound: string;
  /** Connected steps */
  connectedSteps: number[];
  /** Connected courses */
  connectedCourses: string[];
  /** Connected exercises */
  connectedExercises: string[];
  /** Current score (if available) */
  currentScore?: number;
  /** Target score */
  targetScore?: number;
  /** Priority rank (1 = highest) */
  priority: number;
}

export interface LivingGrowthPlan {
  /** SMART goals derived from growth edges */
  goals: SMARTGoal[];
  /** Overall progress note */
  progressNote: string | null;
  /** When the plan was last generated */
  generatedAt: string;
  /** Pathway name */
  pathwayName: string | null;
}

// ─── Plan Generation ─────────────────────────────────────

interface GrowthEdge {
  title: string;
  description: string;
  practices?: Array<{ title: string; description: string }>;
  category?: string;
  patternId?: string;
}

/**
 * Generate a living growth plan from portrait data.
 */
export function generateLivingGrowthPlan(
  growthEdges: GrowthEdge[],
  compositeScores: CompositeScores,
  pathwayName: string | null,
  previousScores?: CompositeScores | null,
): LivingGrowthPlan {
  const goals: SMARTGoal[] = growthEdges.map((edge, index) => {
    const category = inferCategory(edge);

    // Map to SMART structure
    const currentScore = getScoreForCategory(category, compositeScores);
    const targetScore = currentScore !== undefined ? Math.min(currentScore + 18, 85) : undefined;

    const practices = edge.practices
      ? edge.practices.slice(0, 3).map((p) => p.description || p.title)
      : getDefaultPractices(category);

    return {
      title: edge.title,
      specific: generateSpecific(edge, currentScore, targetScore),
      measurable: generateMeasurable(category),
      practices,
      relevant: generateRelevant(edge, currentScore, index),
      timeBound: 'Reassess in 8 weeks to measure progress',
      connectedSteps: EDGE_STEP_MAP[category] ?? [1, 2],
      connectedCourses: EDGE_COURSE_MAP[category] ?? [],
      connectedExercises: EDGE_EXERCISE_MAP[category] ?? [],
      currentScore,
      targetScore,
      priority: index + 1,
    };
  });

  // Generate progress note if previous scores exist
  let progressNote: string | null = null;
  if (previousScores) {
    const improvements: string[] = [];
    const cs = compositeScores as any;
    const ps = previousScores as any;

    const tracked = ['regulationScore', 'windowWidth', 'attachmentSecurity', 'differentiation', 'emotionalIntelligence'];
    for (const key of tracked) {
      if (cs[key] !== undefined && ps[key] !== undefined && cs[key] > ps[key]) {
        const delta = cs[key] - ps[key];
        const labels: Record<string, string> = {
          regulationScore: 'regulation',
          windowWidth: 'window width',
          attachmentSecurity: 'attachment security',
          differentiation: 'differentiation',
          emotionalIntelligence: 'emotional intelligence',
        };
        improvements.push(`${labels[key] ?? key} improved from ${ps[key]} to ${cs[key]} (+${delta})`);
      }
    }

    if (improvements.length > 0) {
      progressNote = `Since you started, ${improvements.join(', ')}. Your growth edges are responding to the work you're doing.`;
    }
  }

  return {
    goals,
    progressNote,
    generatedAt: new Date().toISOString(),
    pathwayName,
  };
}

// ─── Helper Functions ────────────────────────────────────

function inferCategory(edge: GrowthEdge): string {
  const title = edge.title.toLowerCase();
  const desc = edge.description.toLowerCase();
  const combined = title + ' ' + desc;

  if (combined.includes('window') || combined.includes('regulation') || combined.includes('nervous system')) return 'regulation';
  if (combined.includes('value') || combined.includes('congruence') || combined.includes('alignment')) return 'values-gap';
  if (combined.includes('honesty') || combined.includes('truth') || combined.includes('authentic')) return 'truth-telling';
  if (combined.includes('boundary') || combined.includes('differentiation') || combined.includes('fusion')) return 'differentiation';
  if (combined.includes('empathy') || combined.includes('enmeshment') || combined.includes('absorb')) return 'empathy-enmeshment';
  if (combined.includes('perspective') || combined.includes('viewpoint')) return 'perspective-taking';
  if (combined.includes('conflict') || combined.includes('flexibility')) return 'conflict-flexibility';
  if (combined.includes('attachment') || combined.includes('security') || combined.includes('connect')) return 'attachment';
  if (combined.includes('accommodate') || combined.includes('yield') || combined.includes('self-author')) return 'self-authorship';

  return edge.category ?? 'regulation';
}

function getScoreForCategory(category: string, cs: CompositeScores): number | undefined {
  const map: Record<string, keyof CompositeScores> = {
    regulation: 'regulationScore',
    'window-widening': 'windowWidth',
    attachment: 'attachmentSecurity',
    differentiation: 'differentiation',
    'values-gap': 'valuesCongruence',
    'conflict-flexibility': 'conflictFlexibility',
    'empathy-enmeshment': 'regulationScore',
    'perspective-taking': 'emotionalIntelligence',
    'truth-telling': 'valuesCongruence',
    'self-authorship': 'differentiation',
  };
  const key = map[category];
  return key ? (cs as any)[key] : undefined;
}

function generateSpecific(edge: GrowthEdge, current?: number, target?: number): string {
  if (current !== undefined && target !== undefined) {
    return `${edge.title}: Move from ${current}/100 to ${target}+/100 through consistent daily practice.`;
  }
  return `${edge.title}: Build capacity through the practices and steps connected to this edge.`;
}

function generateMeasurable(category: string): string {
  const map: Record<string, string> = {
    regulation: 'Track using your regulation composite score on reassessment',
    'window-widening': 'Track using your window width score on reassessment',
    attachment: 'Track using your attachment security composite on reassessment',
    differentiation: 'Track using your differentiation composite on reassessment',
    'values-gap': 'Track the gap between your values importance and lived expression',
    'conflict-flexibility': 'Track your conflict flexibility score on reassessment',
    'empathy-enmeshment': 'Track your regulation score and boundary clarity on reassessment',
    'perspective-taking': 'Track your perspective-taking subscale on EQ reassessment',
    'truth-telling': 'Track your honesty/authenticity values gap on reassessment',
    'self-authorship': 'Track your differentiation and I-position scores on reassessment',
  };
  return map[category] ?? 'Track progress through reassessment in 8 weeks';
}

function generateRelevant(edge: GrowthEdge, current?: number, index?: number): string {
  const priority = index === 0 ? 'your #1 growth edge' : `growth edge #${(index ?? 0) + 1}`;
  if (current !== undefined && current < 35) {
    return `This is ${priority} because your current score (${current}/100) is in the developing range. Small improvements here create the biggest impact on your relationship.`;
  }
  if (current !== undefined && current < 50) {
    return `This is ${priority} — your score of ${current}/100 shows real room for growth. The practices connected to this edge are designed for exactly where you are.`;
  }
  return `This is ${priority} based on the patterns detected in your portrait. ${edge.description.slice(0, 120)}`;
}

function getDefaultPractices(category: string): string[] {
  const defaults: Record<string, string[]> = {
    regulation: ['Daily grounding practice (box breathing, 3 minutes)', 'Notice early signs of activation before flooding', 'Practice the 3-3-3 reset three times daily'],
    attachment: ['Initiate one vulnerable share per week', 'Practice receiving care without deflecting', 'Name one need out loud this week'],
    differentiation: ['State one preference per day that is purely yours', 'Practice the boundary check: mine, theirs, or ours?', 'Spend 20 minutes doing something that is purely your interest'],
    'values-gap': ['Identify one value-aligned action per day', 'Notice when you edit yourself to keep peace', 'Practice one act of authenticity per week'],
    'conflict-flexibility': ['Try one new conflict approach this week', 'Use soft startup for one difficult topic', 'Practice repair within 24 hours of a rupture'],
    'empathy-enmeshment': ['Practice emotional sorting: mine, theirs, ours', 'After emotional conversations, return to YOUR baseline', 'Set one emotional boundary this week'],
    'perspective-taking': ['Ask your partner one genuine question about their inner world', 'Practice the Two-Sentence Check during disagreements', 'Sit in your partner\'s chair (literally) and describe what you see'],
    'truth-telling': ['Share one small truth you would normally edit out', 'Notice when you say "it\'s fine" and check: is it really?', 'Practice "Let me think about that" instead of automatic agreement'],
    'self-authorship': ['Form one opinion without checking your partner\'s first', 'State one preference per day', 'Track how many times you adjust your preference to match your partner\'s'],
  };
  return defaults[category] ?? defaults.regulation;
}
