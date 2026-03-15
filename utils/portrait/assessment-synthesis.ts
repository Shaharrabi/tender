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

import type { IndividualPortrait, SupplementScores, AllAssessmentScores } from '@/types/portrait';
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
  /** Cross-instrument narrative paragraphs — weaving 2-3 assessments together */
  integratedNarratives: string[];
  /** Single "one thing" invitation sentence */
  oneThingSentence: string;
}

// ─── Integrated Narratives Output ───────────────────────
export interface IntegratedNarrativesResult {
  narratives: string[];
  oneThingSentence: string;
}

/**
 * Generate cross-instrument narratives — the core of the portrait intelligence upgrade.
 * Each narrative weaves 2-3 assessment instruments together to reveal how they interact.
 *
 * Scoring conventions:
 * - ECR-R: 1–7 scale (anxietyScore, avoidanceScore)
 * - SSEIT: subscaleNormalized values are 0–100
 * - DUTCH: subscaleScores[key].mean is 1–5 scale
 * - DSI-R: subscaleScores[key].normalized is 0–100
 * - IPIP: domainPercentiles[key] is 0–100
 * - Values: domainScores[key].gap is 0–10 (importance minus accordance)
 */
export function generateIntegratedNarratives(scores: AllAssessmentScores): IntegratedNarrativesResult {
  const { ecrr, sseit, dutch, dsir, ipip, values } = scores;

  const narratives: string[] = [];

  // ── Helper accessors ──────────────────────────────────
  const ecrAnxiety = ecrr.anxietyScore ?? 4.0;
  const ecrAvoidance = ecrr.avoidanceScore ?? 4.0;

  // SSEIT: subscaleNormalized is 0-100; fall back to mean * 20 (1-5 scale → 0-100)
  const sseitPerception = sseit.subscaleNormalized?.['perception']
    ?? (sseit.subscaleScores?.['perception']?.mean != null
      ? sseit.subscaleScores['perception'].mean * 20
      : 50);
  const sseitManagingOwn = sseit.subscaleNormalized?.['managingOwn']
    ?? (sseit.subscaleScores?.['managingOwn']?.mean != null
      ? sseit.subscaleScores['managingOwn'].mean * 20
      : 50);
  const sseitManagingOthers = sseit.subscaleNormalized?.['managingOthers']
    ?? (sseit.subscaleScores?.['managingOthers']?.mean != null
      ? sseit.subscaleScores['managingOthers'].mean * 20
      : 50);

  // DUTCH: subscaleScores[key].mean is on 1-5 scale
  const dutchYielding       = dutch.subscaleScores?.['yielding']?.mean ?? 3.0;
  const dutchAvoiding       = dutch.subscaleScores?.['avoiding']?.mean ?? 3.0;
  const dutchForcing        = dutch.subscaleScores?.['forcing']?.mean ?? 3.0;
  const dutchProblemSolving = dutch.subscaleScores?.['problemSolving']?.mean ?? 3.0;
  const dutchCompromising   = dutch.subscaleScores?.['compromising']?.mean ?? 3.0;

  // DSI-R: subscaleScores[key].normalized is 0-100
  const dsirFusionWithOthers  = dsir.subscaleScores?.['fusionWithOthers']?.normalized ?? 50;
  const dsirIPosition         = dsir.subscaleScores?.['iPosition']?.normalized ?? 50;
  const dsirEmotionalCutoff   = dsir.subscaleScores?.['emotionalCutoff']?.normalized ?? 50;
  const dsirEmotionalReactivity = dsir.subscaleScores?.['emotionalReactivity']?.normalized ?? 50;

  // IPIP: domainPercentiles is 0-100
  const ipipN = ipip.domainPercentiles?.['neuroticism'] ?? 50;
  const ipipA = ipip.domainPercentiles?.['agreeableness'] ?? 50;
  const ipipC = ipip.domainPercentiles?.['conscientiousness'] ?? 50;
  const ipipO = ipip.domainPercentiles?.['openness'] ?? 50;
  const ipipE = ipip.domainPercentiles?.['extraversion'] ?? 50;

  // Values: find gap for specific domains
  const valuesHonestyGap    = values.domainScores?.['honesty']?.gap ?? 0;
  const valuesIntimacyGap   = values.domainScores?.['intimacy']?.gap ?? values.domainScores?.['connection']?.gap ?? 0;
  const valuesRespectGap    = values.domainScores?.['respect']?.gap ?? 0;
  const valuesAutonomyGap   = values.domainScores?.['autonomy']?.gap ?? values.domainScores?.['independence']?.gap ?? 0;

  // Find the largest values gap for interpolation
  const allGaps = Object.entries(values.domainScores ?? {})
    .map(([k, v]: [string, any]) => ({ domain: k, gap: v?.gap ?? 0 }))
    .sort((a, b) => b.gap - a.gap);
  const biggestGap = allGaps[0] ?? { domain: 'connection', gap: 0 };

  // ── Helper: human-readable score labels ───────────────
  const anxietyLabel = ecrAnxiety > 5.0 ? 'very high' : ecrAnxiety > 4.0 ? 'elevated' : ecrAnxiety > 3.0 ? 'moderate' : 'low';
  const avoidanceLabel = ecrAvoidance > 5.0 ? 'very high' : ecrAvoidance > 4.0 ? 'elevated' : ecrAvoidance > 3.0 ? 'moderate' : 'low';
  const perceptionLabel = sseitPerception > 80 ? 'remarkably high' : sseitPerception > 65 ? 'strong' : sseitPerception > 45 ? 'moderate' : 'developing';

  // ── PAIR 1: Attachment × EQ (ECR-R × SSEIT) ──────────

  if (ecrAnxiety > 4.0 && sseitPerception > 70) {
    narratives.push(
      `You feel everything in the relational field — your emotional perception is ${perceptionLabel}, which means your radar picks up shifts others miss. But with attachment anxiety at ${ecrAnxiety.toFixed(1)}/7, that sensitivity feeds your alarm system rather than informing it. You're often right that something shifted, but the story your anxiety tells about WHY is usually the wound talking, not the current reality.`
    );
  } else if (ecrAnxiety > 4.0 && sseitPerception > 45 && sseitPerception <= 70) {
    narratives.push(
      `Your anxiety is tuned to connection — you notice distance quickly. Your emotional perception is ${perceptionLabel}, which means you sometimes catch the shift and sometimes miss it entirely. When you miss it, the anxiety fills in the blanks with worst-case stories. The work isn't sharper radar — it's learning to pause between sensing and storytelling.`
    );
  } else if (ecrAvoidance > 4.0 && sseitPerception < 40) {
    narratives.push(
      `You create distance partly because the emotional field is overwhelming when you're close. With perception at ${Math.round(sseitPerception)}%, your system doesn't have a strong filter for emotional data — it's not that you don't care, it's that caring feels like too much information coming in at once, with no way to process it.`
    );
  } else if (ecrAvoidance > 4.0 && sseitPerception >= 40) {
    narratives.push(
      `Here's the tension: you can actually read the emotional field well (perception at ${Math.round(sseitPerception)}%), but your avoidance strategy (${avoidanceLabel}) means you often choose not to. You see what's there and step back from it — not from lack of skill, but from a learned belief that closeness costs too much.`
    );
  } else if (ecrAnxiety < 3.5 && ecrAvoidance < 3.5 && sseitPerception > 60) {
    narratives.push(
      `Your emotional radar is ${perceptionLabel} AND you can hold what you sense without flooding. This is secure functioning at work — you notice, you interpret, you respond. Not perfectly, but with enough range to stay present even when the emotional data is complex.`
    );
  } else if (ecrAnxiety < 3.5 && ecrAvoidance < 3.5 && sseitPerception <= 60) {
    narratives.push(
      `Your attachment foundation is secure — you don't get pulled into anxiety or avoidance easily. Your emotional perception is still developing (${Math.round(sseitPerception)}%), which means you may sometimes miss subtle shifts in the field between you. The good news: you have the relational stability to build that awareness without it destabilizing you.`
    );
  }

  // ── PAIR 2: Attachment × Conflict Style (ECR-R × DUTCH) ──

  if (ecrAnxiety > 4.0 && dutchYielding > 3.5) {
    narratives.push(
      `You accommodate to maintain connection — your yielding score (${dutchYielding.toFixed(1)}/5) reflects a pattern of giving ground to avoid rupture. Over time, this means your partner is in a relationship with someone who's editing themselves. They may not even know it's happening.`
    );
  } else if (ecrAvoidance > 4.0 && dutchAvoiding > 3.5) {
    narratives.push(
      `You avoid conflict AND you avoid closeness — a double withdrawal. With avoidance at ${ecrAvoidance.toFixed(1)}/7 and conflict avoidance at ${dutchAvoiding.toFixed(1)}/5, your partner may experience this as a wall. The wall isn't anger — it's protection. But protection from what? Usually from the vulnerability that real engagement requires.`
    );
  } else if (ecrAnxiety > 4.0 && dutchForcing > 3.5) {
    narratives.push(
      `You pursue AND you push — forcing at ${dutchForcing.toFixed(1)}/5 combined with attachment anxiety at ${ecrAnxiety.toFixed(1)}/7. When distance triggers your alarm, you don't retreat — you escalate. Your partner feels pressured, pulls back, which confirms your fear. The intensity of your care is real — but the delivery lands as demand.`
    );
  } else if (ecrAvoidance > 4.0 && dutchYielding > 3.5) {
    narratives.push(
      `An unexpected combination: you pull away emotionally but yield when conflict arises. This means you don't engage deeply AND you don't fight for what you need — a quiet erosion. Your partner gets compliance without connection. The accommodation isn't peace; it's disengagement wearing the mask of agreeableness.`
    );
  } else if (ecrAnxiety < 3.5 && ecrAvoidance < 3.5 && dutchProblemSolving > 3.5) {
    narratives.push(
      `Your secure attachment base gives you the safety to approach conflict as a puzzle rather than a threat. With problem-solving at ${dutchProblemSolving.toFixed(1)}/5, you naturally look for solutions — which is a real strength, as long as you remember that sometimes your partner needs to feel heard before they need a fix.`
    );
  }

  // ── PAIR 3: EQ × Differentiation (SSEIT × DSI-R) ─────

  if (sseitPerception > 70 && dsirFusionWithOthers > 70) {
    narratives.push(
      `You're a strong emotional reader (perception: ${Math.round(sseitPerception)}%), but you absorb everything — your fusion score is ${Math.round(dsirFusionWithOthers)}%. You can't always tell if the anxiety is yours, your partner's, or the relationship's. You sense the field clearly but merge with it instead of observing it.`
    );
  } else if (sseitPerception > 70 && dsirIPosition > 70) {
    narratives.push(
      `You sense the field clearly AND you can hold your own ground within it — I-position at ${Math.round(dsirIPosition)}%. This is a powerful combination: you're attuned without being consumed. Your challenge is patience — you may see things your partner isn't ready to see yet.`
    );
  } else if (sseitPerception < 45 && dsirFusionWithOthers > 65) {
    narratives.push(
      `Your emotional perception is still developing, but your boundaries are already porous — fusion at ${Math.round(dsirFusionWithOthers)}%. This means you absorb your partner's emotional state without always realizing it. You may feel overwhelmed without knowing why, because the signal is getting in but your system can't label it clearly.`
    );
  } else if (sseitPerception > 55 && dsirEmotionalCutoff > 70) {
    narratives.push(
      `You can read emotions well, but your system's response is to cut off rather than engage — emotional cutoff at ${Math.round(dsirEmotionalCutoff)}%. You perceive the field, then build a wall between you and it. This protects you from overwhelm but leaves your partner feeling shut out at exactly the moment they need you most.`
    );
  }

  // ── PAIR 4: Values × Conflict Style (Values × DUTCH) ──

  if (valuesHonestyGap > 2.0 && dutchAvoiding > 3.5) {
    narratives.push(
      `You value honesty deeply but your default in conflict is avoidance (${dutchAvoiding.toFixed(1)}/5). This creates a specific kind of suffering: you know what's true, but you can't bring yourself to say it when it matters. That gap of ${valuesHonestyGap.toFixed(1)} points between how much honesty matters and how much you practice it — that's where the growth edge lives.`
    );
  } else if (valuesIntimacyGap > 2.0 && dutchYielding > 3.5) {
    narratives.push(
      `You crave deep intimacy (gap: ${valuesIntimacyGap.toFixed(1)} points between desire and reality) but you yield to keep the peace. Yielding creates surface harmony at the cost of the depth you actually want. Every time you accommodate instead of expressing what's real, you move further from the intimacy you're seeking.`
    );
  } else if (valuesRespectGap > 2.0 && dutchForcing > 3.5) {
    narratives.push(
      `You value respect — but your dominant conflict mode is forcing (${dutchForcing.toFixed(1)}/5). When you push hard in disagreements, your partner may not feel the respect you genuinely hold. The gap isn't in your values — it's in the delivery. You care about respect and you fight hard; the work is making those two things feel congruent to the person across from you.`
    );
  } else if (biggestGap.gap > 2.5) {
    narratives.push(
      `Your biggest values gap is in ${biggestGap.domain} — a ${biggestGap.gap.toFixed(1)}-point spread between how much it matters to you and how consistently you live it. That gap creates a low-level tension that shows up in moments when you feel like the relationship isn't reflecting what you actually care about most.`
    );
  }

  // ── PAIR 5: Personality × Attachment (IPIP × ECR-R) ───

  if (ipipN > 70 && ecrAnxiety > 4.0) {
    narratives.push(
      `Your nervous system runs hot — neuroticism at the ${Math.round(ipipN)}th percentile means emotional signals arrive fast and loud. Combined with attachment anxiety at ${ecrAnxiety.toFixed(1)}/7, you rarely miss a signal. The challenge: your system also generates false alarms, and it's hard to tell 'something is wrong' from 'my system is doing what it always does.'`
    );
  } else if (ipipA > 70 && dsirFusionWithOthers > 70) {
    narratives.push(
      `You're warm, accommodating (agreeableness: ${Math.round(ipipA)}th percentile), and deeply attuned to others' needs. With fusion at ${Math.round(dsirFusionWithOthers)}%, you've learned to locate yourself through your partner rather than alongside them. Your kindness is real — but it can become a way of disappearing.`
    );
  } else if (ipipC > 70 && ipipN > 65) {
    narratives.push(
      `You're highly conscientious (${Math.round(ipipC)}th percentile) AND emotionally reactive (neuroticism: ${Math.round(ipipN)}th percentile). This means you hold yourself to exacting standards while your emotional landscape is intense. You likely feel like you should be able to manage your feelings better — and that self-judgment becomes its own source of distress.`
    );
  } else if (ipipO < 35 && ecrAvoidance > 4.0) {
    narratives.push(
      `Low openness (${Math.round(ipipO)}th percentile) combined with avoidant attachment reinforces a preference for the known over the vulnerable. New emotional territory feels unnecessary, not just uncomfortable. Your partner's invitations to go deeper may feel like disruption rather than growth — not because you're unwilling, but because your system genuinely doesn't see the value yet.`
    );
  } else if (ipipE < 35 && ecrAnxiety > 4.0) {
    narratives.push(
      `You're introverted (extraversion: ${Math.round(ipipE)}th percentile) but anxiously attached — you need connection deeply but find the social energy to pursue it exhausting. This creates a push-pull: you want closeness, but the effort to seek it depletes you, which reads as withdrawal to your partner even though it's not.`
    );
  }

  // ── TRIPLE-INSTRUMENT NARRATIVES (3 assessments woven) ──

  // Anxiety + High EQ + Low Differentiation → the empathic merger
  if (ecrAnxiety > 4.0 && sseitPerception > 65 && dsirFusionWithOthers > 65) {
    narratives.push(
      `Three patterns converge here: your anxiety draws you toward connection, your emotional intelligence lets you read the field with precision, and your low differentiation means you absorb what you sense. The result is a specific kind of relational overwhelm — you feel everything, interpret it accurately, and then lose yourself in it. You don't need less sensitivity. You need a container for it.`
    );
  }

  // Avoidant + High Conscientiousness + Problem-solving → the functional avoider
  if (ecrAvoidance > 4.0 && ipipC > 65 && dutchProblemSolving > 3.5) {
    narratives.push(
      `You've built a functional system: high conscientiousness keeps everything running, problem-solving handles conflicts efficiently, and avoidance keeps the emotional temperature low. It works — until it doesn't. What's missing isn't competence; it's access. Your partner gets your reliability, your solutions, your steadiness — but not your heart. That's the locked room in an otherwise well-organized house.`
    );
  }

  // High N + Forcing + Low I-Position → the reactive escalator
  if (ipipN > 65 && dutchForcing > 3.5 && dsirIPosition < 40) {
    narratives.push(
      `Your emotional reactivity is high, your conflict style is confrontational, and your sense of self in relationships is still forming. This means disagreements quickly become identity threats — you fight not just about the issue but about who you are. The escalation isn't really about winning; it's about not disappearing.`
    );
  }

  // Secure + High EQ + High Differentiation → the integrated partner
  if (ecrAnxiety < 3.5 && ecrAvoidance < 3.5 && sseitPerception > 60 && dsirIPosition > 60) {
    narratives.push(
      `Secure attachment, strong perception, and solid differentiation — you have the relational trifecta. You sense the field, hold your ground, and stay open. This doesn't mean conflict is easy, but it means you have the internal architecture to handle it without losing yourself or your partner. Your growth edge isn't building capacity — it's going deeper.`
    );
  }

  // Keep to 3-5 narratives max
  const trimmedNarratives = narratives.slice(0, 5);

  // ── One Thing Sentence ────────────────────────────────

  const isAnxious    = ecrAnxiety > 4.0;
  const isAvoidant   = ecrAvoidance > 4.0;
  const isHighEQ     = sseitPerception > 60;
  const isLowEQ      = sseitPerception < 45;
  const isYielding   = dutchYielding > 3.5;
  const isForcing    = dutchForcing > 3.5;
  const isAvoiding   = dutchAvoiding > 3.5;
  const isLowDiff    = dsirFusionWithOthers > 65;
  const isHighDiff   = dsirIPosition > 65;
  const isHighCutoff = dsirEmotionalCutoff > 65;
  const isHighN      = ipipN > 70;
  const isHighA      = ipipA > 70;

  let oneThingSentence: string;

  if (isAnxious && isHighEQ && isYielding && isLowDiff) {
    oneThingSentence = "Your one invitation: let what you feel become information, not instruction.";
  } else if (isAvoidant && isLowEQ && isAvoiding && isHighDiff) {
    oneThingSentence = "Your one invitation: risk being known. The wall keeps you safe AND alone.";
  } else if (isAvoidant && isHighEQ && isAvoiding) {
    oneThingSentence = "Your one invitation: you already see what's there — now stay with it instead of stepping back.";
  } else if (!isAnxious && !isAvoidant && isHighEQ && isHighDiff) {
    oneThingSentence = "Your one invitation: go from good to profound. You have the foundation — now go deeper.";
  } else if (isAnxious && isHighN && isForcing) {
    oneThingSentence = "Your one invitation: soften the approach without softening the truth.";
  } else if (isAnxious && isForcing && isLowDiff) {
    oneThingSentence = "Your one invitation: the connection you're fighting for requires the vulnerability you're fighting against.";
  } else if (isAvoidant && isHighCutoff && isYielding) {
    oneThingSentence = "Your one invitation: compliance isn't connection. Say what's actually true, even if your voice shakes.";
  } else if (isAnxious && isYielding && !isHighEQ) {
    oneThingSentence = "Your one invitation: before you say yes, check if it's love or fear doing the talking.";
  } else if (isHighA && isLowDiff) {
    oneThingSentence = "Your one invitation: kindness that costs you yourself isn't kindness — it's sacrifice. Find the difference.";
  } else if (isAvoidant && !isAvoiding && isForcing) {
    oneThingSentence = "Your one invitation: you fight to keep control, not connection. What happens if you let someone in without conditions?";
  } else if (biggestGap.gap > 3.0) {
    oneThingSentence = `Your one invitation: close the gap in ${biggestGap.domain}. You already know what matters — now live it.`;
  } else {
    oneThingSentence = "Your one invitation: stay present with what's alive between you — even when it's uncomfortable.";
  }

  return { narratives: trimmedNarratives, oneThingSentence };
}

// ─── Synthesize Function ────────────────────────────────

export function synthesizeAssessments(
  portrait: IndividualPortrait,
  supplements?: SupplementScores,
  rawScores?: AllAssessmentScores
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

  // ── Generate integrated cross-instrument narratives ──
  const integrated = rawScores
    ? generateIntegratedNarratives(rawScores)
    : { narratives: [], oneThingSentence: "Your one invitation: stay present with what's alive between you — even when it's uncomfortable." };

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
    integratedNarratives: integrated.narratives,
    oneThingSentence: integrated.oneThingSentence,
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

  // Always show at least one strength — find the highest composite score
  if (factors.length === 0) {
    const scoreMap: [string, number, string][] = [
      ['engagement', scores.engagement, 'Relational investment — you show genuine commitment to your connections. Even when relationships feel hard, you stay present and keep showing up.'],
      ['accessibility', scores.accessibility, 'Emotional openness — you have the capacity to let others in emotionally, creating space for real connection.'],
      ['responsiveness', scores.responsiveness, 'Attunement to others — you can be moved by your partner\'s experience, which is the foundation of trust and repair.'],
      ['regulationScore', scores.regulationScore, 'Emotional steadiness — you have a developing capacity to return to balance after intense moments.'],
      ['selfLeadership', scores.selfLeadership, 'Self-awareness — you can observe your patterns, which is the gateway to making different choices in the moments that matter.'],
      ['valuesCongruence', scores.valuesCongruence, 'Values clarity — you have a sense of what matters most to you, which provides direction for your growth.'],
    ];
    scoreMap.sort((a, b) => b[1] - a[1]);
    factors.push(scoreMap[0][2]);
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

  // Always show at least one growth edge — find the lowest composite score
  if (edges.length === 0) {
    const scoreMap: [string, number, string][] = [
      ['windowWidth', scores.windowWidth, 'Widening your capacity for emotional intensity — building a larger container for the full range of relational experience.'],
      ['selfLeadership', scores.selfLeadership, 'Deepening self-leadership — strengthening your ability to choose your response rather than react from old patterns.'],
      ['accessibility', scores.accessibility, 'Opening to emotional accessibility — letting your partner find you when they reach for connection.'],
      ['responsiveness', scores.responsiveness, 'Growing emotional responsiveness — letting yourself be moved by your partner\'s experience.'],
      ['regulationScore', scores.regulationScore, 'Building regulation capacity — developing your nervous system\'s ability to stay engaged during difficult moments.'],
    ];
    scoreMap.sort((a, b) => a[1] - b[1]);
    edges.push(scoreMap[0][2]);
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

  const paragraph3 = `${strengthSentence} ${edgeSentence} Every step in your relational journey builds on what is already working. Understanding your patterns is not about fixing what is broken — it is about seeing clearly so you can choose differently.`;

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
