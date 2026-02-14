/**
 * Cross-Assessment Synthesis — The "Secret Sauce"
 *
 * Instead of treating 6 assessments as separate results, this module
 * identifies patterns ACROSS assessments — how they reinforce, contradict,
 * or explain each other — and weaves them into a unified relational narrative.
 *
 * Outputs:
 * - Core narrative (2-3 paragraphs synthesizing WHO this person is relationally)
 * - Primary dynamic (the dominant interaction across all assessments)
 * - Reinforcing factors (where assessments converge on the same theme)
 * - Protective factors (strengths across assessments)
 * - Growth edges (where multiple assessments point to the same opportunity)
 * - Contradictions (where assessments seem to conflict — often the most interesting)
 * - Recommended starting step based on full assessment profile
 * - Intervention protocol match (links to growth plan)
 * - Four Movements profile (shows growth dimensions)
 *
 * THE BRIDGE: This module connects Portrait → Protocol → Growth Plan
 * See: utils/steps/intervention-protocols.ts for the protocol engine
 * See: utils/steps/twelve-steps.ts for step definitions
 */

import type { IndividualPortrait } from '@/types/portrait';
import type { SupplementScores } from '@/types/portrait';
import { matchProtocol, assessFourMovements, generateJourneyMap } from '@/utils/steps/intervention-protocols';
import type { InterventionProtocol, JourneyMap, FourMovements } from '@/utils/steps/intervention-protocols';
import {
  buildTailoringContext,
  getValidationOpener,
  tailorGrowthEdge,
  type TailoringContext,
} from './attachment-tailoring';

// ─── Synthesis Output ───────────────────────────────────

export interface AssessmentSynthesis {
  coreNarrative: string;
  primaryPattern: string;
  reinforcingFactors: string[];
  protectiveFactors: string[];
  growthEdges: string[];
  contradictions: string[];
  recommendedStep: number;
  recommendedStepRationale: string;
  /** The matched intervention protocol — the personalized growth plan */
  protocol: InterventionProtocol;
  /** Four Movements profile — shows growth dimension readiness */
  movements: FourMovements;
  /** User-facing journey map — plain language growth plan */
  journeyMap: JourneyMap;
}

// ─── Synthesize Function ────────────────────────────────

export function synthesizeAssessments(
  portrait: IndividualPortrait,
  supplements?: SupplementScores
): AssessmentSynthesis {
  const { compositeScores, fourLens, patterns, growthEdges, negativeCycle } = portrait;

  // Build tailoring context from attachment lens data
  const tailoring = buildTailoringContext(
    fourLens.attachment.areProfile.accessible > 50 &&
    fourLens.attachment.areProfile.responsive > 50
      ? 'secure'
      : portrait.fourLens.attachment.protectiveStrategy.includes('Pursue')
        ? 'anxious-preoccupied'
        : portrait.fourLens.attachment.protectiveStrategy.includes('Withdraw')
          ? 'dismissive-avoidant'
          : portrait.fourLens.attachment.protectiveStrategy.includes('Oscillate')
            ? 'fearful-avoidant'
            : 'secure',
    // Use accessibility as proxy for anxiety (inverted), engagement for attachment investment
    compositeScores.accessibility > 55 ? 5.0 : 3.0,
    compositeScores.accessibility < 45 ? 5.0 : 3.0
  );

  // ── Determine primary dynamic ────────────────────────
  const primaryPattern = determinePrimaryDynamic(compositeScores, fourLens, negativeCycle, patterns, supplements);

  // ── Identify reinforcing factors ─────────────────────
  const reinforcingFactors = findReinforcingFactors(compositeScores, fourLens, negativeCycle, patterns, supplements);

  // ── Identify protective factors ──────────────────────
  const protectiveFactors = findProtectiveFactors(compositeScores, fourLens, patterns, supplements);

  // ── Identify growth edges from synthesis ──────────────
  const synthesizedEdges = findGrowthEdges(compositeScores, fourLens, growthEdges, patterns, tailoring);

  // ── Identify contradictions ──────────────────────────
  const contradictions = findContradictions(compositeScores, fourLens, patterns, negativeCycle, supplements);

  // ── Determine recommended step ───────────────────────
  const { step, rationale } = recommendStartingStep(compositeScores, fourLens, patterns);

  // ── Match intervention protocol ─────────────────────
  const { primary: protocol } = matchProtocol(portrait);

  // ── Assess Four Movements ─────────────────────────
  const movements = assessFourMovements(portrait);

  // ── Generate journey map ──────────────────────────
  const journeyMap = generateJourneyMap(protocol, movements);

  // ── Override step recommendation from protocol ────
  // The protocol's step emphasis is more research-informed than the simple heuristic
  const protocolStep = protocol.stepEmphasis[0] || step;
  const protocolRationale = protocol.rationale || rationale;

  // ── Build core narrative ─────────────────────────────
  const coreNarrative = buildCoreNarrative(
    compositeScores,
    fourLens,
    negativeCycle,
    primaryPattern,
    reinforcingFactors,
    protectiveFactors,
    contradictions,
    patterns,
    tailoring,
    supplements
  );

  return {
    coreNarrative,
    primaryPattern,
    reinforcingFactors,
    protectiveFactors,
    growthEdges: synthesizedEdges,
    contradictions,
    recommendedStep: protocolStep,
    recommendedStepRationale: protocolRationale,
    protocol,
    movements,
    journeyMap,
  };
}

// ─── Internal Helpers ───────────────────────────────────

/**
 * Determine the PRIMARY DYNAMIC — the dominant relational pattern
 * that emerges when you look across ALL assessments together.
 */
function determinePrimaryDynamic(
  scores: IndividualPortrait['compositeScores'],
  lens: IndividualPortrait['fourLens'],
  cycle: IndividualPortrait['negativeCycle'],
  patterns: IndividualPortrait['patterns'],
  supplements?: SupplementScores
): string {
  const { regulationScore, windowWidth, accessibility, responsiveness, engagement, selfLeadership, valuesCongruence } = scores;

  // ── Sensing without grounding (Phase 3 — supplement-aware) ──
  // High field sensitivity + low regulation = strong antenna, weak filter
  if (
    supplements?.sseit &&
    supplements.sseit.fieldSensitivityMean > 5.0 &&
    regulationScore < 45 &&
    windowWidth < 50
  ) {
    return 'Sensing without grounding — you are highly attuned to the relational field between you and your partner. You sense shifts in mood, connection, and emotional atmosphere before most people would. But your regulation capacity cannot keep pace with your sensitivity. Strong antenna, weak filter — the signals flood rather than inform. Your foundational work is building the regulation to match your perception.';
  }

  // ── Heightened sensitivity to relational threat ──
  // ECR anxiety (via high accessibility/engagement + low window) + neuroticism + emotional reactivity
  if (
    engagement > 60 &&
    windowWidth < 50 &&
    selfLeadership < 50 &&
    cycle.position === 'pursuer'
  ) {
    return 'Heightened sensitivity to relational threat — your deep investment in connection combines with a narrow regulation window and reactive nervous system. You feel relationship disruptions intensely and move quickly to repair, sometimes before you can regulate.';
  }

  // ── Protective distancing from emotional intensity ──
  // ECR avoidance + low emotional expressiveness + emotional cutoff
  if (
    accessibility < 45 &&
    responsiveness < 50 &&
    selfLeadership > 45 &&
    cycle.position === 'withdrawer'
  ) {
    return 'Protective distancing from emotional intensity — your system manages relational stress by creating space, pulling inward, and maintaining emotional control. You appear steady on the surface but may be more affected underneath than you let on.';
  }

  // ── Anxious pursuit with narrow regulation ──
  if (
    accessibility > 60 &&
    engagement > 60 &&
    windowWidth < 55 &&
    regulationScore < 50
  ) {
    return 'Anxious pursuit with a narrow regulation window — you reach for connection intensely but your nervous system floods under stress. The urgency of your attachment needs can outpace your capacity to self-regulate, creating cycles of intense pursuit followed by overwhelm.';
  }

  // ── Values-driven internal conflict ──
  // High values importance but avoidant behavior patterns
  if (
    valuesCongruence < 55 &&
    lens.values.significantGaps.length >= 2 &&
    patterns.some(p => p.flags.includes('core_values_conflict'))
  ) {
    return 'Values-driven internal conflict — what matters most to you relationally is not consistently reflected in how you show up. This gap creates quiet tension and self-criticism. Your heart knows what it wants, but protective patterns keep pulling you in a different direction.';
  }

  // ── Regulation overwhelm ──
  if (windowWidth < 45 && regulationScore < 45) {
    return 'Regulation as the central challenge — your window of tolerance is narrow, meaning everyday relationship stressors can push you into fight/flight or shutdown. Everything else in your relational life is downstream of this — when regulated, you have real strengths; when dysregulated, those strengths go offline.';
  }

  // ── Self-abandonment pattern ──
  // Low differentiation + conflict avoidance + fusion
  if (
    selfLeadership < 45 &&
    lens.parts.managerParts.length >= 2 &&
    patterns.some(p => p.flags.includes('self_abandonment_risk'))
  ) {
    return 'Self-abandonment in service of connection — you tend to lose track of your own needs, opinions, and boundaries when relationship security feels at stake. Keeping the peace takes priority over keeping yourself, which builds resentment over time.';
  }

  // ── Approach-avoidance oscillation ──
  if (cycle.position === 'mixed' && windowWidth < 55) {
    return 'Approach-avoidance oscillation — you are pulled toward connection and away from it in unpredictable ways. Closeness triggers retreat, and distance triggers longing. This push-pull reflects competing attachment needs, not confusion or instability.';
  }

  // ── Intellectual engagement without emotional depth ──
  if (
    responsiveness > 55 &&
    accessibility < 45 &&
    selfLeadership > 50
  ) {
    return 'Cognitive engagement without emotional availability — you can think about relationships skillfully and respond helpfully, but accessing your own emotional vulnerability remains difficult. Partners may feel cared for but not truly known by you.';
  }

  // Default: Complex, multi-layered
  return 'A complex, multi-layered relational profile — your assessments reveal a person who doesn\'t fit neatly into one pattern. You carry both real strengths and genuine growth areas, and the interaction between them is what makes your relational style uniquely yours.';
}

/**
 * Find REINFORCING FACTORS — where multiple assessments converge
 * on the same theme, making the pattern stronger.
 */
function findReinforcingFactors(
  scores: IndividualPortrait['compositeScores'],
  lens: IndividualPortrait['fourLens'],
  cycle: IndividualPortrait['negativeCycle'],
  patterns: IndividualPortrait['patterns'],
  supplements?: SupplementScores
): string[] {
  const factors: string[] = [];

  // ── Anxiety + narrow window + reactivity → amplified threat response ──
  if (scores.windowWidth < 55 && scores.accessibility > 55 && scores.regulationScore < 55) {
    factors.push(
      'Attachment anxiety narrows your regulation window, which heightens reactivity, which amplifies the sense of threat — a self-reinforcing cycle where the fear of disconnection becomes the thing that drives disconnection.'
    );
  }

  // ── Avoidance + cutoff + low engagement → compounding distance ──
  if (scores.accessibility < 50 && scores.engagement < 50 && cycle.position === 'withdrawer') {
    factors.push(
      'Attachment avoidance, emotional cutoff, and withdrawal in conflict all point the same direction — toward distance. Each reinforces the others, creating a well-practiced pattern of self-protection that your partner may experience as abandonment.'
    );
  }

  // ── Low self-leadership + flooding markers → protector hijacking ──
  if (
    scores.selfLeadership < 50 &&
    lens.regulation.floodingMarkers.length > 0
  ) {
    factors.push(
      'When protector parts take over, your regulation capacity drops further, making it even harder to access your grounded Self. This creates a cycle where the less regulated you are, the more your protectors run the show.'
    );
  }

  // ── Values gap + pursuit → urgency-driven pursuit ──
  if (
    scores.valuesCongruence < 60 &&
    lens.values.significantGaps.some((g) => g.value.toLowerCase().includes('connection') || g.value.toLowerCase().includes('intimacy'))
  ) {
    factors.push(
      'The gap between how deeply you value connection and how consistently you experience it fuels urgency and pursuit — your longing for closeness is real, but the intensity of that longing can push it further away.'
    );
  }

  // ── Low differentiation + conflict avoidance → erosion of self ──
  if (
    scores.selfLeadership < 50 &&
    patterns.some(p => p.id === 'anxious_yielding' || p.flags.includes('self_abandonment_risk'))
  ) {
    factors.push(
      'Weak I-Position combined with yielding in conflict creates a pattern where you gradually lose yourself in the relationship. Each accommodation feels small, but they accumulate into resentment and loss of identity.'
    );
  }

  // ── High neuroticism + narrow window + pursuer → escalation cascade ──
  if (
    scores.regulationScore < 50 &&
    scores.windowWidth < 50 &&
    cycle.position === 'pursuer'
  ) {
    factors.push(
      'Your pursuit strategy activates at the same time your regulation is most compromised — meaning you reach for your partner when you are least able to do so skillfully. The result is often escalation rather than the reassurance you are seeking.'
    );
  }

  // ── Phase 3: Supplement-aware reinforcing factors ──

  // Somatic wisdom reinforces attunement
  if (
    supplements?.ecrr &&
    supplements.ecrr.somaticAwareness >= 5 &&
    scores.responsiveness > 55
  ) {
    factors.push(
      'Your body-based relational awareness reinforces your emotional responsiveness — you detect shifts somatically and respond with genuine attunement. This somatic wisdom is a powerful relational resource.'
    );
  }

  // Fixed narrative deepens the cycle
  if (
    supplements?.ecrr &&
    supplements.ecrr.fixedStory < 4 && // reverse-scored: low = high fixed story
    (cycle.position === 'pursuer' || cycle.position === 'withdrawer')
  ) {
    factors.push(
      'A fixed narrative about your partner — "they always..." or "they never..." — deepens your negative cycle. The story confirms the pattern, and the pattern confirms the story. Breaking the narrative is as important as breaking the cycle.'
    );
  }

  return factors;
}

/**
 * Find PROTECTIVE FACTORS — strengths across assessments
 * that serve as resources for healing.
 */
function findProtectiveFactors(
  scores: IndividualPortrait['compositeScores'],
  lens: IndividualPortrait['fourLens'],
  patterns: IndividualPortrait['patterns'],
  supplements?: SupplementScores
): string[] {
  const factors: string[] = [];

  if (scores.engagement > 65) {
    factors.push(
      'Deep relational investment — you are genuinely committed to connection. This willingness to show up, even when it\'s hard, is the most powerful resource for change.'
    );
  }

  if (scores.regulationScore > 60) {
    factors.push(
      'Solid regulation foundation — your nervous system has real capacity to return to baseline after activation. This means you can hold difficult conversations longer and repair more effectively.'
    );
  }

  if (scores.selfLeadership > 55) {
    factors.push(
      'Developing self-leadership — you can observe your patterns without being hijacked by them. This awareness is the gateway to choosing differently in the moments that matter.'
    );
  }

  if (scores.responsiveness > 60) {
    factors.push(
      'Emotional responsiveness — you can be moved by your partner\'s experience, which builds trust and makes repair possible. Your partner feels felt by you.'
    );
  }

  if (scores.valuesCongruence > 65) {
    factors.push(
      'Strong values alignment — you are living consistently with what matters to you. This integrity creates a stable foundation that your relationship can depend on.'
    );
  }

  if (lens.values.coreValues.length >= 3) {
    factors.push(
      'Clear value orientation — you know what matters to you relationally. This clarity provides a compass for navigating difficult decisions and growth edges.'
    );
  }

  if (scores.accessibility > 60 && scores.responsiveness > 60) {
    factors.push(
      'Emotional availability — you are both accessible and responsive, the two pillars of secure-functioning connection. Your partner can reach you when they need you.'
    );
  }

  // Phase 3: Supplement-aware protective factors
  if (
    supplements?.ecrr &&
    supplements.ecrr.cycleAwareness >= 5 &&
    scores.selfLeadership > 50
  ) {
    factors.push(
      'Metacognitive capacity — you can step back and observe the pattern between you and your partner while it is happening. This ability to see the cycle from above is one of the most powerful resources for change.'
    );
  }

  if (
    supplements?.ecrr &&
    supplements.ecrr.needsAsInformation >= 5
  ) {
    factors.push(
      'Needs-as-information stance — you treat your relational needs as valid data rather than flaws to overcome. This is a secure relational posture that supports healthy advocacy.'
    );
  }

  // Return top 4 to avoid overwhelming
  return factors.slice(0, 4);
}

/**
 * Find GROWTH EDGES from the cross-assessment synthesis —
 * where multiple assessments point to the same opportunity.
 */
function findGrowthEdges(
  scores: IndividualPortrait['compositeScores'],
  lens: IndividualPortrait['fourLens'],
  existingEdges: IndividualPortrait['growthEdges'],
  patterns: IndividualPortrait['patterns'],
  tailoring?: TailoringContext
): string[] {
  const edges: string[] = [];

  if (scores.windowWidth < 55) {
    edges.push(
      'Widening your window of tolerance — multiple assessments converge here: regulation capacity, emotional reactivity, and conflict patterns all improve when your window expands.'
    );
  }

  if (scores.selfLeadership < 55) {
    edges.push(
      'Strengthening Self-leadership — when protector parts run the show during conflict, your best relational skills go offline. Building internal leadership changes everything downstream.'
    );
  }

  if (lens.values.significantGaps.length > 0) {
    const topGap = lens.values.significantGaps[0];
    edges.push(
      `Closing the gap on "${topGap.value}" — importance ${topGap.importance}/10 but living at ${(topGap.importance - topGap.gap).toFixed(0)}/10. This tension is a daily source of quiet friction.`
    );
  }

  if (scores.accessibility < 50 || scores.responsiveness < 50) {
    edges.push(
      'Building emotional accessibility and responsiveness — the A.R.E. of secure connection. When your partner reaches for you, can they find you? When they share pain, do they feel felt?'
    );
  }

  // Pattern-specific edges
  if (patterns.some(p => p.flags.includes('self_abandonment_risk'))) {
    edges.push(
      'Reclaiming your voice in relationship — multiple assessments suggest you lose yourself to maintain peace. The cost is invisible but cumulative.'
    );
  }

  // Apply attachment tailoring to all growth edges
  if (tailoring) {
    return edges.slice(0, 4).map(edge => tailorGrowthEdge(edge, tailoring));
  }

  return edges.slice(0, 4);
}

/**
 * Find CONTRADICTIONS — where assessments seem to conflict.
 * These are often the most interesting and therapeutically rich insights.
 */
function findContradictions(
  scores: IndividualPortrait['compositeScores'],
  lens: IndividualPortrait['fourLens'],
  patterns: IndividualPortrait['patterns'],
  cycle: IndividualPortrait['negativeCycle'],
  supplements?: SupplementScores
): string[] {
  const contradictions: string[] = [];

  // ── High engagement but low accessibility ──
  // Values intimacy deeply but can't let partner in
  if (scores.engagement > 60 && scores.accessibility < 45) {
    contradictions.push(
      'Your heart is fully in this — but your walls come up. You are deeply invested in connection (engagement: ' +
      scores.engagement + ') yet emotionally guarded (accessibility: ' + scores.accessibility +
      '). This is the approach-avoidance tension: you want to be close but your protective system says "not safe."'
    );
  }

  // ── High values congruence but narrow window ──
  // Knows what to do but can't do it under stress
  if (scores.valuesCongruence > 60 && scores.windowWidth < 45) {
    contradictions.push(
      'You know exactly who you want to be in your relationship — and you are that person when things are calm. But stress shrinks your window (width: ' +
      scores.windowWidth + '), and the person who shows up under pressure isn\'t the one you recognize. The gap isn\'t knowledge, it\'s regulation.'
    );
  }

  // ── High self-leadership but flooding ──
  // Aware but overwhelmed
  if (
    scores.selfLeadership > 55 &&
    lens.regulation.floodingMarkers.length >= 2
  ) {
    contradictions.push(
      'You have real self-awareness — you can name your patterns, see your parts, understand your cycle. But insight alone doesn\'t prevent flooding. "I know I\'m doing it but I can\'t stop" is your lived experience. The bridge from awareness to regulation is your next frontier.'
    );
  }

  // ── Values intimacy + avoidant attachment ──
  // The classic approach-avoidance contradiction
  if (
    patterns.some(p => p.id === 'values_intimacy_avoids_closeness')
  ) {
    contradictions.push(
      'You long for deep intimacy (it\'s a core value) yet your attachment system reads closeness as danger. Your values pull you toward connection while your nervous system pulls you away. This isn\'t hypocrisy — it\'s the most human of tensions, and it\'s your most powerful growth edge.'
    );
  }

  // ── Values honesty + conflict avoidance ──
  if (
    patterns.some(p => p.id === 'values_honesty_avoids_conflict')
  ) {
    contradictions.push(
      'Authenticity matters deeply to you, yet you avoid the conversations where authenticity is most needed. The truth you hold back to keep the peace is the same truth your relationship needs to grow. This contradiction is where your deepest work lives.'
    );
  }

  // ── Strong responsiveness but pursuer position ──
  // Attentive to partner but in pursuit mode
  if (scores.responsiveness > 60 && cycle.position === 'pursuer') {
    contradictions.push(
      'You are attentive and responsive to your partner\'s emotional world — yet in your cycle, you pursue in ways that can overwhelm them. Your responsiveness is a genuine strength, but under attachment threat it gets hijacked into pursuit rather than attunement.'
    );
  }

  // ── High independence values but fused ──
  if (
    patterns.some(p => p.id === 'values_autonomy_but_fused')
  ) {
    contradictions.push(
      'You value your independence — yet in practice, you tend to merge with your partner, losing track of where you end and they begin. You may resent them for "making" you lose yourself, but the pattern lives in you, not in them.'
    );
  }

  // ── Phase 3: Supplement-aware contradictions ──

  // High boundary clarity but absorbs partner's emotions
  if (
    supplements?.dsir &&
    supplements.dsir.boundaryAwarenessMean >= 5 &&
    supplements?.sseit &&
    supplements.sseit.emotionDifferentiation < 4
  ) {
    contradictions.push(
      'You have intellectual clarity about boundaries — you can articulate where you end and your partner begins. But emotionally, you still absorb their feelings as if they were your own. The concept is there; the lived experience has not caught up.'
    );
  }

  // Values growth but resists being changed
  if (
    supplements?.values &&
    supplements.values.willingnessToChange <= 3 &&
    patterns.some(p => p.id === 'values_growth_resists_change')
  ) {
    contradictions.push(
      'You value growth deeply — yet your supplement responses reveal resistance to being changed by the relationship. You want to grow, but on your own terms and at your own pace. The tension: relational growth requires being affected by your partner.'
    );
  }

  return contradictions.slice(0, 3);
}

function recommendStartingStep(
  scores: IndividualPortrait['compositeScores'],
  lens: IndividualPortrait['fourLens'],
  patterns: IndividualPortrait['patterns']
): { step: number; rationale: string } {
  // Step 1 if they can't name their cycle
  if (patterns.length === 0 || scores.regulationScore < 40) {
    return {
      step: 1,
      rationale:
        'Starting at Step 1 (Acknowledge the Strain) to build shared awareness of disconnection patterns before moving deeper.',
    };
  }

  // Step 3 if they have strong fixed narratives
  if (scores.selfLeadership < 40 && lens.parts.managerParts.length >= 3) {
    return {
      step: 3,
      rationale:
        'Step 3 (Release Certainty) recommended because strong protector parts suggest rigid stories that need softening.',
    };
  }

  // Step 5 if regulation is strong but connection is low
  if (
    scores.regulationScore > 55 &&
    scores.windowWidth > 50 &&
    scores.accessibility < 50
  ) {
    return {
      step: 5,
      rationale:
        'Step 5 (Share Our Truths) recommended because your regulation is solid enough for vulnerable disclosure — the missing piece is emotional openness.',
    };
  }

  // Step 4 if they have clear patterns but need to own their part
  if (patterns.length >= 2 && scores.selfLeadership > 40) {
    return {
      step: 4,
      rationale:
        'Step 4 (Examine Our Part) recommended because you can see patterns clearly — now it\'s time to explore your own contribution to the cycle.',
    };
  }

  // Default: Step 1
  return {
    step: 1,
    rationale:
      'Starting at Step 1 (Acknowledge the Strain) to build a strong foundation of pattern awareness.',
  };
}

/**
 * Build the CORE NARRATIVE — 2-3 paragraphs that synthesize WHO this
 * person is relationally. This is not a summary of assessments — it's
 * a story of how those assessments interact.
 */
function buildCoreNarrative(
  scores: IndividualPortrait['compositeScores'],
  lens: IndividualPortrait['fourLens'],
  cycle: IndividualPortrait['negativeCycle'],
  primaryDynamic: string,
  reinforcing: string[],
  protective: string[],
  contradictions: string[],
  patterns: IndividualPortrait['patterns'],
  tailoring?: TailoringContext,
  supplements?: SupplementScores
): string {
  // ── Attachment-tailored opening (Phase 3) ──
  const opener = tailoring ? getValidationOpener(tailoring) : '';

  // ── Paragraph 1: Who you are relationally ──
  const regulationDesc =
    scores.regulationScore > 60 ? 'a solid capacity for emotional regulation'
    : scores.regulationScore > 40 ? 'a developing but sometimes strained capacity for regulation'
    : 'a nervous system that gets overwhelmed quickly — regulation is your foundational growth area';

  const windowDesc =
    scores.windowWidth > 60 ? 'can hold difficult conversations without shutting down or flooding'
    : scores.windowWidth > 40 ? 'manages everyday stress but narrows under pressure'
    : 'is narrow, meaning even moderate conflict can push you out of your window of tolerance';

  const attachmentDesc = buildAttachmentSentence(lens.attachment, cycle);

  const paragraph1 = opener
    ? `${opener}\n\nYour relational portrait reveals someone with ${regulationDesc}. Your window of tolerance ${windowDesc}. ${attachmentDesc}`
    : `Your relational portrait reveals someone with ${regulationDesc}. Your window of tolerance ${windowDesc}. ${attachmentDesc}`;

  // ── Paragraph 2: The cross-assessment story ──
  const crossAssessmentInsight = buildCrossAssessmentParagraph(
    scores, lens, cycle, contradictions, reinforcing, patterns, supplements
  );

  // ── Paragraph 3: Strengths and path forward ──
  const strengthSentence = protective.length > 0
    ? `What anchors you: ${protective[0].split(' — ')[0].toLowerCase()}.`
    : 'You are showing up for this work, which itself is a profound strength.';

  const edgeSentence = contradictions.length > 0
    ? 'And perhaps the most interesting insight from your assessments is a tension that lives inside you: ' +
      simplifyContradiction(contradictions[0]) + '.'
    : '';

  const paragraph3 = `${strengthSentence} ${edgeSentence} Every step in your healing journey builds on what is already working. Understanding your patterns is not about fixing what is broken — it is about seeing clearly so you can choose differently.`;

  return `${paragraph1}\n\n${crossAssessmentInsight}\n\n${paragraph3}`;
}

function buildAttachmentSentence(
  attachment: IndividualPortrait['fourLens']['attachment'],
  cycle: IndividualPortrait['negativeCycle']
): string {
  const strategy = attachment.protectiveStrategy;
  const cycleDesc =
    cycle.position === 'pursuer'
      ? 'Under relational stress, you move toward — reaching for connection, seeking reassurance, wanting resolution.'
    : cycle.position === 'withdrawer'
      ? 'Under relational stress, you pull inward — seeking calm through space, managing emotion through distance.'
    : cycle.position === 'mixed'
      ? 'Under relational stress, you oscillate — sometimes reaching toward, sometimes pulling back, depending on what feels safest.'
    : 'Under relational stress, you show flexibility — adapting your response to what the moment requires.';

  return `${cycleDesc} Your protective strategy: ${strategy.charAt(0).toLowerCase()}${strategy.slice(1)}`;
}

function buildCrossAssessmentParagraph(
  scores: IndividualPortrait['compositeScores'],
  lens: IndividualPortrait['fourLens'],
  cycle: IndividualPortrait['negativeCycle'],
  contradictions: string[],
  reinforcing: string[],
  patterns: IndividualPortrait['patterns'],
  supplements?: SupplementScores
): string {
  const parts: string[] = [];

  // Lead with the cross-assessment convergence
  if (reinforcing.length > 0) {
    // Extract the key insight from the first reinforcing factor
    parts.push('Across your six assessments, a convergent theme emerges: ' +
      reinforcing[0].split(' — ')[0].toLowerCase() + '.'
    );
  } else {
    parts.push('Your six assessments paint a nuanced picture that doesn\'t reduce to a single pattern.');
  }

  // Add the interaction between parts and regulation
  if (lens.parts.managerParts.length >= 2 && scores.regulationScore < 55) {
    parts.push(
      'Your internal parts system activates protective managers — ' +
      lens.parts.managerParts.slice(0, 2).join(' and ') +
      ' — when your regulation is strained, creating a feedback loop between internal overwhelm and external reactivity.'
    );
  }

  // Add values-behavior dynamic if present
  if (lens.values.significantGaps.length > 0 && scores.valuesCongruence < 60) {
    const topGap = lens.values.significantGaps[0];
    parts.push(
      `Your values are clear — especially around ${topGap.value.toLowerCase()} — but protective patterns create a gap between intention and action.`
    );
  }

  // Phase 3: Integrate supplement insights into paragraph 2 when available
  if (supplements) {
    // Field sensitivity insight
    if (supplements.sseit && supplements.sseit.fieldSensitivityMean > 4.5) {
      parts.push(
        'Your supplement data reveals strong relational field sensitivity — you read the emotional atmosphere between you and your partner with precision. How you use that information is the next growth step.'
      );
    }

    // Cycle awareness insight
    if (supplements.ecrr && supplements.ecrr.cycleAwareness >= 5 && scores.selfLeadership > 45) {
      parts.push(
        'You show the ability to observe your relational patterns while they are unfolding — a metacognitive capacity that accelerates growth.'
      );
    }
  }

  // If we have few specific patterns, add a general integration note
  if (parts.length === 1) {
    if (scores.selfLeadership > 55) {
      parts.push(
        'Your self-awareness is a genuine resource — you can observe your patterns even in the middle of them. The work ahead is less about insight and more about building new habits that match what you already understand.'
      );
    } else {
      parts.push(
        'The patterns your assessments reveal may not be fully visible to you yet. That is normal. Healing begins with seeing, and your portrait gives you a map of what your relational system is doing — often without your conscious awareness.'
      );
    }
  }

  return parts.join(' ');
}

/**
 * Simplify a contradiction to a short phrase for inline use in narrative.
 */
function simplifyContradiction(contradiction: string): string {
  // Take just the first sentence-ish portion
  const firstSentence = contradiction.split('.')[0];
  // If it has a dash explanation, take up to the dash
  if (firstSentence.includes(' — ')) {
    return firstSentence.split(' — ')[0].toLowerCase();
  }
  return firstSentence.toLowerCase();
}
