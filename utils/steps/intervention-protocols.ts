/**
 * Intervention Protocol Engine — The "Secret Sauce" Bridge
 *
 * This module is the bridge between a user's PORTRAIT (who they are)
 * and their GROWTH PLAN (what to do about it).
 *
 * Based on "Integrated Assessment Models for Couples Over 30" research:
 * - Maps specific assessment profile combinations to clinical protocols
 * - Determines sequencing rules (regulate before intimacy, individual before conjoint)
 * - Generates personalized practice prescriptions
 * - Routes users to the right starting point in the 12-step journey
 *
 * The core insight from the research:
 *   "Match treatment elements to the MEDIATING PROCESS identified by assessment."
 *   - Poor EI / dyadic coping → EI and coping skill training first
 *   - Insecure attachment driving reactivity → Emotion regulation + attachment work
 *   - Low differentiation driving maladaptive conflict → Differentiation + negotiation
 */

import type { IndividualPortrait, CompositeScores, DetectedPattern } from '@/types/portrait';

// ─── Protocol Types ───────────────────────────────────

export type ProtocolId =
  | 'anxious_reactive'        // High neuroticism + anxious attachment + low EI
  | 'avoidant_withdrawn'      // High avoidance + low intimacy + low differentiation
  | 'low_ei_high_conflict'    // Low EI + low dyadic coping + high conflict negativity
  | 'low_diff_reactive'       // Low differentiation + high reactivity + exit/neglect
  | 'values_misaligned'       // High values gaps + pattern conflicts
  | 'regulation_foundation'   // Regulation as foundational need
  | 'balanced_growth';        // No critical deficits — general enrichment

export interface InterventionProtocol {
  id: ProtocolId;
  name: string;
  description: string;
  /** Why this protocol was selected based on their specific scores */
  rationale: string;
  /** Whether individual regulation work must come before couple work */
  regulationFirst: boolean;
  /** Recommended total sessions/weeks */
  estimatedWeeks: number;
  /** Ordered phases of the protocol */
  phases: ProtocolPhase[];
  /** Which 12-step numbers to emphasize (in recommended order) */
  stepEmphasis: number[];
  /** Specific practices to prioritize (exercise IDs) */
  priorityPractices: string[];
  /** What to avoid with this profile */
  contraindications: string[];
}

export interface ProtocolPhase {
  name: string;
  weekRange: string;
  focus: string;
  practices: string[];
  /** What Sage AI should emphasize during this phase */
  sageGuidance: string;
}

// ─── Four Movements Framework ─────────────────────────
// The research maps every therapeutic intervention to one of four
// movements. This framework helps users understand WHERE they are
// in their growth, not just WHAT step they're on.

export interface FourMovements {
  recognition: MovementStatus;
  release: MovementStatus;
  resonance: MovementStatus;
  embodiment: MovementStatus;
}

export interface MovementStatus {
  name: string;
  subtitle: string;
  description: string;
  /** 0-100: How much this movement is developed based on portrait */
  readiness: number;
  /** Which growth edges relate to this movement */
  relatedEdges: string[];
  /** Which steps primarily develop this movement */
  primarySteps: number[];
}

// ─── Protocol Matching Engine ─────────────────────────

/**
 * Determine which intervention protocol(s) best match this user's
 * assessment profile. Returns the PRIMARY protocol and up to 2 secondary.
 */
export function matchProtocol(
  portrait: IndividualPortrait
): { primary: InterventionProtocol; secondary: InterventionProtocol[] } {
  const { compositeScores, patterns, fourLens, negativeCycle } = portrait;
  const scores = compositeScores;
  const patternFlags = patterns.flatMap(p => p.flags);

  // ── Priority 1: Regulation foundation ──
  // If regulation is critically low, everything else must wait.
  if (scores.regulationScore < 35 || scores.windowWidth < 35) {
    return {
      primary: buildRegulationFoundationProtocol(scores, patterns),
      secondary: [getSecondaryProtocol(scores, patterns, patternFlags, negativeCycle)],
    };
  }

  // ── Priority 2: Anxious-Reactive profile ──
  // High neuroticism + anxious attachment + low EI → Protocol 1 from research
  if (
    scores.windowWidth < 50 &&
    scores.engagement > 55 &&
    scores.regulationScore < 50 &&
    negativeCycle.position === 'pursuer'
  ) {
    return {
      primary: buildAnxiousReactiveProtocol(scores, patterns, fourLens),
      secondary: getAdditionalProtocols(scores, patterns, patternFlags),
    };
  }

  // ── Priority 3: Avoidant-Withdrawn profile ──
  // High avoidance + low intimacy + low differentiation → Protocol 2
  if (
    scores.accessibility < 45 &&
    scores.engagement < 50 &&
    negativeCycle.position === 'withdrawer'
  ) {
    return {
      primary: buildAvoidantWithdrawnProtocol(scores, patterns, fourLens),
      secondary: getAdditionalProtocols(scores, patterns, patternFlags),
    };
  }

  // ── Priority 4: Low differentiation driving conflict ──
  // Low self-leadership + self-abandonment risk → Protocol 4
  if (
    scores.selfLeadership < 45 &&
    patternFlags.includes('self_abandonment_risk')
  ) {
    return {
      primary: buildLowDiffReactiveProtocol(scores, patterns, fourLens),
      secondary: getAdditionalProtocols(scores, patterns, patternFlags),
    };
  }

  // ── Priority 5: Values misalignment ──
  if (
    scores.valuesCongruence < 55 &&
    patternFlags.includes('core_values_conflict')
  ) {
    return {
      primary: buildValuesMisalignedProtocol(scores, patterns, fourLens),
      secondary: getAdditionalProtocols(scores, patterns, patternFlags),
    };
  }

  // ── Default: Balanced growth ──
  return {
    primary: buildBalancedGrowthProtocol(scores, patterns, fourLens),
    secondary: [],
  };
}

/**
 * Generate the Four Movements assessment — shows where the user
 * is in each dimension of growth, based on their portrait.
 */
export function assessFourMovements(
  portrait: IndividualPortrait
): FourMovements {
  const { compositeScores: s, patterns, growthEdges } = portrait;
  const edgeIds = growthEdges.map(e => e.id);

  return {
    recognition: {
      name: 'Recognition',
      subtitle: 'Seeing what\'s here',
      description:
        'The ability to see your patterns clearly — without blame, without shame. ' +
        'Recognition means you can name your cycle, your triggers, and your protective moves.',
      readiness: calculateRecognitionReadiness(s, patterns),
      relatedEdges: edgeIds.filter(id =>
        id.includes('regulation') || id.includes('window')
      ),
      primarySteps: [1, 2, 10],
    },
    release: {
      name: 'Release',
      subtitle: 'Letting go of old stories',
      description:
        'The willingness to loosen your grip on certainty — about your partner, ' +
        'about yourself, about what "should" happen. Release is not forgetting; it\'s making space.',
      readiness: calculateReleaseReadiness(s, patterns),
      relatedEdges: edgeIds.filter(id =>
        id.includes('speak') || id.includes('truth') || id.includes('values')
      ),
      primarySteps: [3, 4, 6],
    },
    resonance: {
      name: 'Resonance',
      subtitle: 'Feeling with each other',
      description:
        'The capacity to be moved by your partner\'s experience — to let their ' +
        'world touch yours. Resonance is what makes repair possible and connection real.',
      readiness: calculateResonanceReadiness(s),
      relatedEdges: edgeIds.filter(id =>
        id.includes('closeness') || id.includes('intimacy') || id.includes('approach')
      ),
      primarySteps: [2, 5, 11],
    },
    embodiment: {
      name: 'Embodiment',
      subtitle: 'Living it daily',
      description:
        'Turning insight into habit. Embodiment is when the new way of being ' +
        'becomes your default — not through willpower, but through practice.',
      readiness: calculateEmbodimentReadiness(s),
      relatedEdges: edgeIds.filter(id =>
        id.includes('differentiation') || id.includes('self') || id.includes('reclaim')
      ),
      primarySteps: [7, 9, 12],
    },
  };
}

/**
 * Generate a personalized journey map — the user-facing explanation
 * of their growth plan, in plain language.
 */
export function generateJourneyMap(
  protocol: InterventionProtocol,
  movements: FourMovements
): JourneyMap {
  // Find the movement with lowest readiness — that's where growth starts
  const movementEntries = Object.entries(movements) as [string, MovementStatus][];
  const sorted = [...movementEntries].sort((a, b) => a[1].readiness - b[1].readiness);
  const startingMovement = sorted[0];
  const strongestMovement = sorted[sorted.length - 1];

  return {
    headline: protocol.name,
    whyThisPath: protocol.rationale,
    yourStrength: `Your strongest foundation: ${strongestMovement[1].name} — ${strongestMovement[1].subtitle}. This is what you build from.`,
    yourEdge: `Your growth frontier: ${startingMovement[1].name} — ${startingMovement[1].subtitle}. This is where the new territory lives.`,
    phases: protocol.phases.map(phase => ({
      name: phase.name,
      weeks: phase.weekRange,
      whatToDo: phase.focus,
      practiceCount: phase.practices.length,
    })),
    startingStep: protocol.stepEmphasis[0],
    totalWeeks: protocol.estimatedWeeks,
    movementProfile: {
      recognition: movements.recognition.readiness,
      release: movements.release.readiness,
      resonance: movements.resonance.readiness,
      embodiment: movements.embodiment.readiness,
    },
  };
}

export interface JourneyMap {
  headline: string;
  whyThisPath: string;
  yourStrength: string;
  yourEdge: string;
  phases: Array<{
    name: string;
    weeks: string;
    whatToDo: string;
    practiceCount: number;
  }>;
  startingStep: number;
  totalWeeks: number;
  movementProfile: {
    recognition: number;
    release: number;
    resonance: number;
    embodiment: number;
  };
}

// ─── Protocol Builders ────────────────────────────────

function buildRegulationFoundationProtocol(
  scores: CompositeScores,
  patterns: DetectedPattern[]
): InterventionProtocol {
  return {
    id: 'regulation_foundation',
    name: 'Building Your Foundation',
    description:
      'Your assessments show that regulation — the ability to stay grounded under stress — ' +
      'is your foundational growth area. Everything else in your relational life gets easier ' +
      'when your window of tolerance expands.',
    rationale:
      `Your regulation score (${scores.regulationScore}/100) and window width ` +
      `(${scores.windowWidth}/100) indicate that your nervous system reaches its limit quickly. ` +
      'This means that even mild relationship stress can push you into fight/flight or shutdown. ' +
      'Building regulation capacity first creates the foundation for all other growth.',
    regulationFirst: true,
    estimatedWeeks: 10,
    phases: [
      {
        name: 'Stabilize',
        weekRange: 'Weeks 1-3',
        focus:
          'Learn to recognize early signs of activation. Build a daily grounding practice. ' +
          'Understand your window of tolerance.',
        practices: ['window-check', 'grounding-5-4-3-2-1', 'parts-check-in'],
        sageGuidance:
          'Prioritize regulation. If the user is activated or shutdown, don\'t push for insight. ' +
          'Meet them where they are. Teach the window of tolerance concept.',
      },
      {
        name: 'Expand',
        weekRange: 'Weeks 4-6',
        focus:
          'Practice staying regulated during low-stakes conversations. Build co-regulation ' +
          'skills. Start naming patterns without blame.',
        practices: ['recognize-cycle', 'stress-reducing-conversation', 'self-compassion-break'],
        sageGuidance:
          'Start gently connecting patterns to their portrait. Use "I notice" language. ' +
          'Celebrate any moment they catch themselves before flooding.',
      },
      {
        name: 'Connect',
        weekRange: 'Weeks 7-10',
        focus:
          'Now that your window is wider, begin the emotional work: sharing feelings, ' +
          'practicing repair, building new rituals.',
        practices: ['soft-startup', 'repair-attempt', 'turning-toward', 'emotional-bid'],
        sageGuidance:
          'They\'re ready for deeper work now. Connect growth edges to practices. ' +
          'Reference their values and anchors.',
      },
    ],
    stepEmphasis: [1, 7, 2, 4, 9],
    priorityPractices: [
      'window-check',
      'grounding-5-4-3-2-1',
      'parts-check-in',
      'recognize-cycle',
      'self-compassion-break',
    ],
    contraindications: [
      'Don\'t push for vulnerable disclosure early — their window is too narrow',
      'Avoid intensive conflict processing until regulation is more stable',
      'Don\'t interpret their shutting down as resistance — it\'s their nervous system protecting them',
    ],
  };
}

function buildAnxiousReactiveProtocol(
  scores: CompositeScores,
  patterns: DetectedPattern[],
  lens: IndividualPortrait['fourLens']
): InterventionProtocol {
  return {
    id: 'anxious_reactive',
    name: 'From Reactivity to Connection',
    description:
      'You feel relationships deeply and move toward connection instinctively. ' +
      'Your growth path is about channeling that attachment energy more skillfully — ' +
      'regulating first, then reaching.',
    rationale:
      `Your profile combines deep relational investment (engagement: ${scores.engagement}/100) ` +
      `with a narrow regulation window (${scores.windowWidth}/100) and reactive nervous system ` +
      `(regulation: ${scores.regulationScore}/100). The research shows this combination ` +
      'responds best to: emotion regulation training first, then attachment-focused work.',
    regulationFirst: true,
    estimatedWeeks: 12,
    phases: [
      {
        name: 'Stabilize Affect',
        weekRange: 'Weeks 1-3',
        focus:
          'Learn to slow down your nervous system before engaging. Practice recognizing ' +
          'the difference between "I need to talk about this NOW" and "my nervous system is flooded."',
        practices: ['window-check', 'grounding-5-4-3-2-1', 'parts-check-in', 'recognize-cycle'],
        sageGuidance:
          'When they come in activated, validate first then redirect to regulation. ' +
          'Use their anchor points. Don\'t analyze the content of the fight yet.',
      },
      {
        name: 'Emotion Labeling & Reappraisal',
        weekRange: 'Weeks 4-6',
        focus:
          'Build emotional vocabulary. Learn to name what\'s happening underneath the urgency. ' +
          'Practice cognitive reappraisal: "Is this a real threat, or is my alarm going off?"',
        practices: ['accessing-primary-emotions', 'protector-dialogue', 'self-compassion-break'],
        sageGuidance:
          'Help them identify primary emotions under secondary ones. ' +
          '"Underneath your frustration, what are you really feeling? Fear? Longing?"',
      },
      {
        name: 'Attachment-Focused Connection',
        weekRange: 'Weeks 7-10',
        focus:
          'Now that you can regulate, practice reaching for your partner from a grounded place. ' +
          'Express needs directly, without urgency or blame.',
        practices: ['bonding-through-vulnerability', 'hold-me-tight', 'soft-startup', 'emotional-bid'],
        sageGuidance:
          'Connect their reaching behavior to attachment needs. Help them express needs ' +
          'from their primary emotions rather than their protest behavior.',
      },
      {
        name: 'Maintenance & Relapse Prevention',
        weekRange: 'Weeks 11-12',
        focus:
          'Build sustainable daily practices. Create a personalized relapse plan for when ' +
          'old patterns resurface.',
        practices: ['rituals-of-connection', 'relationship-values-compass'],
        sageGuidance:
          'Normalize setbacks. Help them build a "when I notice the old pattern" plan. ' +
          'Celebrate growth.',
      },
    ],
    stepEmphasis: [1, 4, 5, 2, 9, 7],
    priorityPractices: [
      'window-check',
      'accessing-primary-emotions',
      'soft-startup',
      'bonding-through-vulnerability',
      'self-compassion-break',
      'recognize-cycle',
    ],
    contraindications: [
      'Don\'t encourage them to "just talk to their partner" when they\'re flooded',
      'Avoid exploring partner\'s perspective before they\'ve processed their own primary emotions',
      'Don\'t validate pursuit behavior as "just wanting connection" — name the pattern gently',
    ],
  };
}

function buildAvoidantWithdrawnProtocol(
  scores: CompositeScores,
  patterns: DetectedPattern[],
  lens: IndividualPortrait['fourLens']
): InterventionProtocol {
  return {
    id: 'avoidant_withdrawn',
    name: 'From Distance to Presence',
    description:
      'You manage relational stress by creating space — pulling inward, going quiet, ' +
      'minimizing the emotional charge. Your growth path is about learning to stay ' +
      'present in the discomfort of closeness, in gradual doses.',
    rationale:
      `Your profile shows low emotional accessibility (${scores.accessibility}/100) and ` +
      `engagement (${scores.engagement}/100) with a withdrawer position in your couple cycle. ` +
      'The research recommends: graded intimacy exposures with an autonomy-supportive approach. ' +
      'Pushing too fast toward vulnerability backfires — pacing is everything.',
    regulationFirst: false, // Avoidant profiles need engagement first, not regulation
    estimatedWeeks: 14,
    phases: [
      {
        name: 'Engagement Preparation',
        weekRange: 'Weeks 1-3',
        focus:
          'Explore (individually) your beliefs about closeness. Practice brief toleration ' +
          'of emotional arousal. Understand your avoidance not as a flaw but as a learned ' +
          'protective strategy.',
        practices: ['parts-check-in', 'protector-dialogue', 'window-check'],
        sageGuidance:
          'Use autonomy-supportive language. Don\'t push for feelings. Normalize their ' +
          'protective distance. Help them see avoidance as adaptive, then name its cost.',
      },
      {
        name: 'Graded Intimacy',
        weekRange: 'Weeks 4-8',
        focus:
          'Short timed sharing exercises. Start with factual sharing, progress to mildly ' +
          'vulnerable topics. In-session practice with homework. The goal: 10% more open, ' +
          'not 100%.',
        practices: ['stress-reducing-conversation', 'love-maps', 'turning-toward', 'emotional-bid'],
        sageGuidance:
          'Celebrate any disclosure. Don\'t ask "how do you feel?" directly — ask ' +
          '"what was that like?" Frame sharing as brave, not expected.',
      },
      {
        name: 'Differentiation Coaching',
        weekRange: 'Weeks 9-12',
        focus:
          'Build the I-Position: "I think..." "I feel..." "I want..." without reactivity. ' +
          'Practice self-soothing when closeness feels overwhelming. Maintain self while staying.',
        practices: ['values-compass', 'relationship-values-compass', 'self-compassion-break'],
        sageGuidance:
          'Help them differentiate between "I don\'t feel" and "I don\'t want to feel." ' +
          'Connect their withdrawal to what it costs the relationship and their own values.',
      },
      {
        name: 'Conflict Structure & Integration',
        weekRange: 'Weeks 13-14',
        focus:
          'Structured turn-taking. Negotiated time-outs with re-engagement commitment. ' +
          'Replace withdrawal with "I need space but I\'m coming back."',
        practices: ['repair-attempt', 'soft-startup', 'dear-man', 'rituals-of-connection'],
        sageGuidance:
          'They can handle more now. Practice repair scripts. Help them see the ' +
          'connection between showing up emotionally and getting the closeness they actually want.',
      },
    ],
    stepEmphasis: [1, 3, 6, 5, 7, 2],
    priorityPractices: [
      'protector-dialogue',
      'love-maps',
      'stress-reducing-conversation',
      'values-compass',
      'turning-toward',
      'self-compassion-break',
    ],
    contraindications: [
      'Don\'t force emotion-focused exposure too quickly — it increases withdrawal',
      'Avoid "why don\'t you just share how you feel?" — this is exactly what their system resists',
      'Don\'t interpret their distance as not caring — their distance IS their caring strategy',
      'Emphasize autonomy and choice, not obligation',
    ],
  };
}

function buildLowDiffReactiveProtocol(
  scores: CompositeScores,
  patterns: DetectedPattern[],
  lens: IndividualPortrait['fourLens']
): InterventionProtocol {
  return {
    id: 'low_diff_reactive',
    name: 'Finding Your Center',
    description:
      'You tend to lose yourself in relationships — your needs, opinions, and boundaries ' +
      'become unclear when the emotional stakes are high. Your growth is about building ' +
      'a stronger "I" that can stay connected without disappearing.',
    rationale:
      `Your self-leadership score (${scores.selfLeadership}/100) suggests your sense of self ` +
      'in relationships needs strengthening. ' +
      (patterns.some(p => p.flags.includes('self_abandonment_risk'))
        ? 'Multiple assessments flag self-abandonment risk: you accommodate to maintain connection, ' +
          'which builds resentment over time.'
        : 'Your differentiation patterns suggest difficulty maintaining your position under relational pressure.'),
    regulationFirst: scores.regulationScore < 45,
    estimatedWeeks: 12,
    phases: [
      {
        name: 'Self-Compassion Foundation',
        weekRange: 'Weeks 1-3',
        focus:
          'Before you can hold a clear position, you need self-compassion. ' +
          'Practice noticing self-critical thoughts without believing them. ' +
          'Understand that losing yourself was an adaptive strategy.',
        practices: ['self-compassion-break', 'parts-check-in', 'protector-dialogue'],
        sageGuidance:
          'Watch for shame. Their pattern of self-abandonment probably comes with ' +
          'deep self-criticism. Validate before everything.',
      },
      {
        name: 'Building the I-Position',
        weekRange: 'Weeks 4-7',
        focus:
          'Practice knowing and stating what you think, feel, want, and need — ' +
          'even when it differs from your partner. Start with low-stakes situations.',
        practices: ['values-compass', 'accessing-primary-emotions', 'defusion-from-stories'],
        sageGuidance:
          'Help them practice "I think..." statements. Celebrate any moment ' +
          'they state a preference before checking with their partner.',
      },
      {
        name: 'Negotiation Skills',
        weekRange: 'Weeks 8-10',
        focus:
          'Learn structured negotiation. Practice expressing disagreement without ' +
          'it meaning the relationship is in danger. Tolerate the tension of "we see ' +
          'this differently."',
        practices: ['soft-startup', 'dear-man', 'four-horsemen-antidotes'],
        sageGuidance:
          'Frame disagreement as healthy differentiation, not threat. ' +
          'Help them see that their partner can handle their truth.',
      },
      {
        name: 'Integration & Forgiveness',
        weekRange: 'Weeks 11-12',
        focus:
          'Consolidate the new "I" position. Practice repair for times you lost yourself. ' +
          'Build maintenance practices.',
        practices: ['repair-attempt', 'relationship-values-compass', 'rituals-of-connection'],
        sageGuidance:
          'Help them forgive themselves for the accommodating. Celebrate the ' +
          'courage of the new position. Build relapse prevention.',
      },
    ],
    stepEmphasis: [4, 3, 1, 5, 7, 9],
    priorityPractices: [
      'self-compassion-break',
      'values-compass',
      'accessing-primary-emotions',
      'soft-startup',
      'dear-man',
      'protector-dialogue',
    ],
    contraindications: [
      'Don\'t push for immediate confrontation with partner — build internal capacity first',
      'Avoid framing their accommodation as "codependency" — it\'s a learned survival strategy',
      'Don\'t let them use new assertiveness skills as a weapon — it must come from self-leadership, not reactivity',
    ],
  };
}

function buildValuesMisalignedProtocol(
  scores: CompositeScores,
  patterns: DetectedPattern[],
  lens: IndividualPortrait['fourLens']
): InterventionProtocol {
  const valueConflicts = patterns.filter(p => p.flags.includes('core_values_conflict'));

  return {
    id: 'values_misaligned',
    name: 'Aligning Heart and Action',
    description:
      'Your values are clear — you know what matters to you in relationship. ' +
      'But your behavior doesn\'t always match. This creates a quiet tension ' +
      'and self-criticism that erodes satisfaction from the inside.',
    rationale:
      `Your values congruence score (${scores.valuesCongruence}/100) reveals a gap between ` +
      'intention and action. ' +
      (valueConflicts.length > 0
        ? `Specifically: ${valueConflicts.map(v => v.description).join('; ')}.`
        : 'Your protective patterns pull you away from what you value most.'),
    regulationFirst: scores.regulationScore < 45,
    estimatedWeeks: 10,
    phases: [
      {
        name: 'Values Clarity',
        weekRange: 'Weeks 1-2',
        focus:
          'Get crystal clear on your top 3 values. Understand the gap — not to judge ' +
          'yourself, but to see clearly where your protective patterns override your values.',
        practices: ['values-compass', 'defusion-from-stories'],
        sageGuidance:
          'Use ACT-style values exploration. Don\'t moralize. Help them see the gap ' +
          'with compassion: "Your values are real. So is the pattern that overrides them."',
      },
      {
        name: 'Understanding the Protective Pattern',
        weekRange: 'Weeks 3-5',
        focus:
          'Why does the pattern win? What is it protecting you from? Understanding ' +
          'the function of the pattern without judging it.',
        practices: ['protector-dialogue', 'parts-check-in', 'accessing-primary-emotions'],
        sageGuidance:
          'IFS-style exploration. Help them have compassion for the part that ' +
          'protects by avoiding/yielding/withdrawing. Name the fear underneath.',
      },
      {
        name: 'Values-Aligned Action',
        weekRange: 'Weeks 6-8',
        focus:
          'Start taking small values-aligned actions. "What would Honesty do right now?" ' +
          'Practice tolerating the discomfort of living your values.',
        practices: ['willingness-stance', 'soft-startup', 'bonding-through-vulnerability'],
        sageGuidance:
          'Use their top value as a compass in sessions. When they describe a ' +
          'situation, ask: "What would [their top value] have you do here?"',
      },
      {
        name: 'Sustainability',
        weekRange: 'Weeks 9-10',
        focus:
          'Build sustainable practices that keep you aligned. Create value-based ' +
          'rituals. Prepare for when old patterns pull you back.',
        practices: ['relationship-values-compass', 'rituals-of-connection'],
        sageGuidance:
          'Celebrate alignment moments. Build a library of "I chose my value" stories. ' +
          'Create a simple daily check: "Did I live my values today?"',
      },
    ],
    stepEmphasis: [4, 3, 7, 5, 1],
    priorityPractices: [
      'values-compass',
      'protector-dialogue',
      'willingness-stance',
      'bonding-through-vulnerability',
      'relationship-values-compass',
    ],
    contraindications: [
      'Don\'t shame them for the gap — they already feel it deeply',
      'Avoid "just be authentic" advice — the pattern has a function they need to understand first',
      'Don\'t push for big values-aligned actions before they understand what they\'re protecting against',
    ],
  };
}

function buildBalancedGrowthProtocol(
  scores: CompositeScores,
  patterns: DetectedPattern[],
  lens: IndividualPortrait['fourLens']
): InterventionProtocol {
  return {
    id: 'balanced_growth',
    name: 'Deepening Your Connection',
    description:
      'Your assessment profile shows no critical deficits — you have a solid ' +
      'foundation to build from. Your growth path is about deepening what\'s ' +
      'already working and stretching into new relational territory.',
    rationale:
      'Your scores show adequate regulation, reasonable accessibility, and clear values. ' +
      'This is enrichment territory — not crisis management but intentional deepening.',
    regulationFirst: false,
    estimatedWeeks: 8,
    phases: [
      {
        name: 'Deepen Awareness',
        weekRange: 'Weeks 1-2',
        focus:
          'Understand your patterns, your cycle, your parts. Build the vocabulary ' +
          'for what happens between you.',
        practices: ['recognize-cycle', 'parts-check-in', 'love-maps'],
        sageGuidance: 'Explore with curiosity. Help them see nuance in their patterns.',
      },
      {
        name: 'Stretch & Grow',
        weekRange: 'Weeks 3-5',
        focus:
          'Work your growth edges. Take the 10% different action. Practice new ' +
          'relational moves.',
        practices: ['bonding-through-vulnerability', 'soft-startup', 'hold-me-tight'],
        sageGuidance:
          'Challenge gently. They can handle more depth. Push into growth edges.',
      },
      {
        name: 'Sustain & Celebrate',
        weekRange: 'Weeks 6-8',
        focus:
          'Build rituals. Create your relationship mission. Celebrate the journey.',
        practices: ['rituals-of-connection', 'relationship-values-compass', 'fondness-admiration'],
        sageGuidance: 'Help them build sustainable practices. Celebrate growth.',
      },
    ],
    stepEmphasis: [1, 4, 5, 7, 11, 12],
    priorityPractices: [
      'recognize-cycle',
      'bonding-through-vulnerability',
      'soft-startup',
      'rituals-of-connection',
      'love-maps',
    ],
    contraindications: [
      'Don\'t assume "no critical deficits" means "no problems" — stay attuned to what surfaces',
    ],
  };
}

function buildLowEIHighConflictProtocol(
  scores: CompositeScores,
  patterns: DetectedPattern[],
  lens: IndividualPortrait['fourLens']
): InterventionProtocol {
  return {
    id: 'low_ei_high_conflict',
    name: 'Building Emotional Intelligence Together',
    description:
      'Your growth area is the bridge between knowing and doing — building the ' +
      'emotional skills that turn good intentions into effective connection.',
    rationale:
      `Your responsiveness score (${scores.responsiveness}/100) and regulation ` +
      `(${scores.regulationScore}/100) suggest room to grow in emotional skill. ` +
      'The research shows that EI-focused training creates the fastest improvement ' +
      'in couple satisfaction.',
    regulationFirst: true,
    estimatedWeeks: 10,
    phases: [
      {
        name: 'Emotion Identification',
        weekRange: 'Weeks 1-3',
        focus:
          'Build emotional vocabulary. Learn to identify what you\'re feeling ' +
          'before it becomes behavior.',
        practices: ['accessing-primary-emotions', 'window-check', 'parts-check-in'],
        sageGuidance:
          'Help expand emotional vocabulary. When they say "angry" ask "is it ' +
          'more like frustrated? hurt? scared?"',
      },
      {
        name: 'Regulated Disclosure',
        weekRange: 'Weeks 4-6',
        focus:
          'Practice expressing emotions constructively. Partner listening and ' +
          'validation skills.',
        practices: ['soft-startup', 'stress-reducing-conversation', 'self-compassion-break'],
        sageGuidance:
          'Model emotional expression in your responses. Show what vulnerable ' +
          'sharing looks like.',
      },
      {
        name: 'Dyadic Problem-Solving',
        weekRange: 'Weeks 7-10',
        focus:
          'Concrete problem-solving drills. Role-plays of conflict scenarios. ' +
          'Daily 10-15 min joint coping check-ins.',
        practices: ['dear-man', 'four-horsemen-antidotes', 'repair-attempt', 'aftermath-of-fight'],
        sageGuidance:
          'Practice scripts together. Celebrate any moment of effective ' +
          'emotional communication.',
      },
    ],
    stepEmphasis: [1, 4, 9, 7, 2],
    priorityPractices: [
      'accessing-primary-emotions',
      'soft-startup',
      'stress-reducing-conversation',
      'dear-man',
      'four-horsemen-antidotes',
    ],
    contraindications: [
      'Don\'t assume inability to express = inability to feel',
      'Avoid skill-training mode when they need validation first',
    ],
  };
}

// ─── Scoring Helpers ──────────────────────────────────

function calculateRecognitionReadiness(
  scores: CompositeScores,
  patterns: DetectedPattern[]
): number {
  // Recognition = can you see the pattern?
  // Based on: self-leadership + having patterns identified + regulation
  const patternAwareness = Math.min(patterns.length * 15, 50);
  const selfAwareness = scores.selfLeadership * 0.3;
  const regulation = scores.regulationScore * 0.2;
  return Math.round(Math.min(patternAwareness + selfAwareness + regulation, 100));
}

function calculateReleaseReadiness(
  scores: CompositeScores,
  patterns: DetectedPattern[]
): number {
  // Release = can you let go of certainty?
  // Based on: values congruence + self-leadership - rigidity indicators
  const valuesClarity = scores.valuesCongruence * 0.4;
  const selfLead = scores.selfLeadership * 0.3;
  const managerPenalty = patterns.filter(p =>
    p.flags.includes('false_differentiation') || p.flags.includes('intellectual_bypass_risk')
  ).length * 10;
  return Math.round(Math.min(Math.max(valuesClarity + selfLead - managerPenalty + 20, 0), 100));
}

function calculateResonanceReadiness(scores: CompositeScores): number {
  // Resonance = can you be moved by your partner?
  return Math.round(
    scores.accessibility * 0.3 +
    scores.responsiveness * 0.4 +
    scores.engagement * 0.3
  );
}

function calculateEmbodimentReadiness(scores: CompositeScores): number {
  // Embodiment = can you live it daily?
  return Math.round(
    scores.regulationScore * 0.3 +
    scores.selfLeadership * 0.3 +
    scores.valuesCongruence * 0.4
  );
}

// ─── Helper: Secondary Protocol Selection ─────────────

function getSecondaryProtocol(
  scores: CompositeScores,
  patterns: DetectedPattern[],
  flags: string[],
  cycle: IndividualPortrait['negativeCycle']
): InterventionProtocol {
  // Return the next most relevant protocol after regulation
  if (scores.engagement > 55 && cycle.position === 'pursuer') {
    return buildAnxiousReactiveProtocol(scores, patterns, {} as any);
  }
  if (scores.accessibility < 45 && cycle.position === 'withdrawer') {
    return buildAvoidantWithdrawnProtocol(scores, patterns, {} as any);
  }
  if (flags.includes('self_abandonment_risk')) {
    return buildLowDiffReactiveProtocol(scores, patterns, {} as any);
  }
  return buildBalancedGrowthProtocol(scores, patterns, {} as any);
}

function getAdditionalProtocols(
  scores: CompositeScores,
  patterns: DetectedPattern[],
  flags: string[]
): InterventionProtocol[] {
  const additional: InterventionProtocol[] = [];

  if (scores.valuesCongruence < 55 && flags.includes('core_values_conflict')) {
    additional.push(buildValuesMisalignedProtocol(scores, patterns, {} as any));
  }
  if (scores.selfLeadership < 45 && flags.includes('self_abandonment_risk')) {
    additional.push(buildLowDiffReactiveProtocol(scores, patterns, {} as any));
  }

  return additional.slice(0, 2);
}
