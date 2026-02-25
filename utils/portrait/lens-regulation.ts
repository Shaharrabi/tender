import type {
  ECRRScores,
  IPIPScores,
  SSEITScores,
  DSIRScores,
  DUTCHScores,
  CompositeScores,
  DetectedPattern,
  RegulationLens,
  RegulationToolkit,
  CoRegulationPattern,
} from '@/types';
import { tailorNarrative, buildTailoringContext } from './attachment-tailoring';

/**
 * Lens 3: Regulation & Window
 * Theoretical foundation: Polyvagal Theory, DBT, Neuroscience
 */
export function analyzeRegulationWindow(
  ecrr: ECRRScores,
  ipip: IPIPScores,
  sseit: SSEITScores,
  dsir: DSIRScores,
  dutch: DUTCHScores,
  composite: CompositeScores,
  patterns: DetectedPattern[]
): RegulationLens {
  const rawNarrative = buildRegulationNarrative(composite, sseit);
  const ctx = buildTailoringContext(ecrr.attachmentStyle, ecrr.anxietyScore, ecrr.avoidanceScore);
  const narrative = tailorNarrative(rawNarrative, ctx, 'regulation');
  const activationPatterns = getActivationPatterns(ecrr, ipip);
  const shutdownPatterns = getShutdownPatterns(ecrr, dutch, ipip);
  const floodingMarkers = getFloodingMarkers(ecrr, ipip, sseit);
  const regulationToolkit = buildRegulationToolkit(ecrr, sseit, ipip, composite);
  const coRegulationPattern = buildCoRegulationPattern(ecrr, sseit, dsir, composite);

  return {
    narrative,
    windowWidth: composite.windowWidth,
    activationPatterns,
    shutdownPatterns,
    floodingMarkers,
    regulationToolkit,
    coRegulationPattern,
  };
}

// ─── Narrative ───────────────────────────────────────────

function buildRegulationNarrative(
  composite: CompositeScores,
  sseit: SSEITScores
): string {
  const { windowWidth, regulationScore } = composite;
  const eqPerception = sseit.subscaleNormalized.perception;
  const eqManagingOwn = sseit.subscaleNormalized.managingOwn;

  let narrative = '';

  // Window width description
  if (windowWidth >= 70) {
    narrative =
      'You have a wide window of tolerance — you can generally stay regulated ' +
      'under pressure and tolerate significant stress before leaving your window. ' +
      'This gives you more time to think before reacting.';
  } else if (windowWidth >= 55) {
    narrative =
      'Your window of tolerance is moderate. Under normal circumstances ' +
      "you manage well, but stress and conflict can narrow it. You'll want " +
      'to pay attention to early signs of dysregulation.';
  } else if (windowWidth >= 40) {
    narrative =
      'Your window of tolerance is relatively narrow. You leave your window ' +
      'fairly easily, which means emotions can hijack your responses before ' +
      'you realize what happened.';
  } else {
    narrative =
      'Your window of tolerance is quite narrow right now. You get flooded ' +
      'quickly when emotions rise, which makes staying connected during ' +
      "conflict very difficult. This isn't a character flaw — your nervous " +
      'system needs more support.';
  }

  // Awareness vs. regulation gap
  if (eqPerception > 70 && eqManagingOwn < 50) {
    narrative +=
      " Interestingly, you're quite aware of your emotions — you notice " +
      "what you're feeling. The challenge is managing those feelings once " +
      "they arrive. You know you're doing it but can't always stop.";
  } else if (eqPerception < 40) {
    narrative +=
      ' You may not always notice your emotional state changing until ' +
      "you're already flooded. Building awareness of early warning signs " +
      'is a key first step.';
  }

  // Regulation tools
  if (regulationScore >= 65) {
    narrative +=
      ' Your regulation toolkit is well-developed — you have strategies ' +
      'for calming yourself and can generally use them.';
  } else if (regulationScore < 40) {
    narrative +=
      ' Building your regulation toolkit — breathing techniques, ' +
      'body awareness, pause strategies — would make a meaningful ' +
      'difference in your relationship.';
  }

  return narrative;
}

// ─── Activation Patterns (sympathetic response) ──────────

function getActivationPatterns(
  ecrr: ECRRScores,
  ipip: IPIPScores
): string[] {
  const patterns: string[] = [];
  const neuroticism = ipip.domainPercentiles.neuroticism;

  if (ecrr.anxietyScore > 4.0) {
    patterns.push('Pursue — move toward partner seeking resolution');
    patterns.push('Escalate — increase intensity when not heard');
  }

  if (neuroticism > 60) {
    patterns.push('Racing thoughts and worst-case scenarios');
    patterns.push('Physical tension, restlessness, racing heart');
  }

  if (neuroticism > 60 && ipip.domainPercentiles.agreeableness < 45) {
    patterns.push('Snap or say things you later regret');
  }

  if (patterns.length === 0) {
    patterns.push('Mild tension that you can generally manage');
  }

  return patterns;
}

// ─── Shutdown Patterns (dorsal vagal response) ───────────

function getShutdownPatterns(
  ecrr: ECRRScores,
  dutch: DUTCHScores,
  ipip: IPIPScores
): string[] {
  const patterns: string[] = [];
  const avoiding = dutch.subscaleScores.avoiding?.mean ?? 0;

  if (ecrr.avoidanceScore > 4.0) {
    patterns.push('Go silent or emotionally check out');
    patterns.push('Need to leave the room to self-regulate');
  }

  if (avoiding > 3.5) {
    patterns.push('Change the subject or deflect');
    patterns.push('Withdraw into tasks or distractions');
  }

  if (ipip.domainPercentiles.neuroticism > 70 && ecrr.avoidanceScore > 3.0) {
    patterns.push('Collapse — feel hopeless or numb after intense emotion');
  }

  if (patterns.length === 0) {
    patterns.push('Mild withdrawal that resolves relatively quickly');
  }

  return patterns;
}

// ─── Flooding Markers ────────────────────────────────────

function getFloodingMarkers(
  ecrr: ECRRScores,
  ipip: IPIPScores,
  sseit: SSEITScores
): string[] {
  const markers: string[] = [];

  // Universal markers
  markers.push("Can't hear partner's words clearly");
  markers.push('All-or-nothing thinking ("you always", "you never")');

  // Personalized
  if (ecrr.anxietyScore > 4.5) {
    markers.push('Desperate urge to resolve things RIGHT NOW');
  }

  if (ecrr.avoidanceScore > 4.5) {
    markers.push('Sudden silence or urge to leave');
  }

  if (ipip.domainPercentiles.neuroticism > 65) {
    markers.push('Physical symptoms: racing heart, tight chest, shaking');
  }

  // Recovery estimate
  const eqManaging = sseit.subscaleNormalized.managingOwn;
  if (eqManaging >= 70) {
    markers.push('Recovery time: ~10-15 minutes');
  } else if (eqManaging >= 50) {
    markers.push('Recovery time: ~20-30 minutes');
  } else {
    markers.push('Recovery time: 30+ minutes');
  }

  return markers;
}

// ─── Regulation Toolkit (personalized strengths + practices) ──

function buildRegulationToolkit(
  ecrr: ECRRScores,
  sseit: SSEITScores,
  ipip: IPIPScores,
  composite: CompositeScores
): RegulationToolkit {
  const strengths: string[] = [];
  const buildingBlocks: string[] = [];
  const practiceSequence: string[] = [];

  const eqPerception = sseit.subscaleNormalized.perception;
  const eqManagingOwn = sseit.subscaleNormalized.managingOwn;
  const eqManagingOthers = sseit.subscaleNormalized.managingOthers;
  const eqUtilization = sseit.subscaleNormalized.utilization;
  const neuroPct = ipip.domainPercentiles.neuroticism;

  // ── Identify existing strengths ──
  if (eqPerception > 60) {
    strengths.push('Strong emotional awareness — you notice what you are feeling');
  }
  if (eqManagingOwn > 60) {
    strengths.push('Good self-regulation — you can manage your own emotional states');
  }
  if (eqManagingOthers > 60) {
    strengths.push('Attuned to others — you read and respond to partner emotions well');
  }
  if (eqUtilization > 60) {
    strengths.push('Emotional utilization — you use feelings as information for decisions');
  }
  if (neuroPct < 40) {
    strengths.push('Emotional stability — you have a naturally steady baseline');
  }
  if (composite.windowWidth > 60) {
    strengths.push('Wide window of tolerance — you can stay regulated under pressure');
  }
  if (strengths.length === 0) {
    strengths.push('You are here and doing this work — that itself is a strength');
  }

  // ── Identify building blocks (skills to develop) ──
  if (eqPerception < 50) {
    buildingBlocks.push('Emotional vocabulary — naming what you feel with more precision');
  }
  if (eqManagingOwn < 50) {
    buildingBlocks.push('Self-soothing — techniques to bring yourself back into your window');
  }
  if (eqManagingOthers < 50) {
    buildingBlocks.push('Empathic attunement — reading your partner more accurately');
  }
  if (neuroPct > 65) {
    buildingBlocks.push('Nervous system calming — your system runs hot and needs grounding');
  }
  if (composite.windowWidth < 45) {
    buildingBlocks.push('Window widening — gradually building tolerance for emotional intensity');
  }
  if (ecrr.anxietyScore > 4.5) {
    buildingBlocks.push('Anxiety down-regulation — settling the alarm system when activated');
  }
  if (ecrr.avoidanceScore > 4.5) {
    buildingBlocks.push('Staying present — tolerating emotional closeness without withdrawing');
  }

  // ── Personalized practice sequence (ordered by foundation → growth) ──
  // Always start with grounding
  practiceSequence.push('Body scan or grounding exercise (3-5 minutes daily)');

  // Then add regulation-specific practices
  if (composite.regulationScore < 40) {
    practiceSequence.push('Box breathing when you notice activation (4-4-4-4 count)');
    practiceSequence.push('Name the emotion out loud: "I am feeling ___"');
  }

  if (ecrr.anxietyScore > 4.0) {
    practiceSequence.push('Self-reassurance phrases: "I am safe. We are okay."');
    practiceSequence.push('Notice the urge to seek reassurance — pause 30 seconds before acting');
  }

  if (ecrr.avoidanceScore > 4.0) {
    practiceSequence.push('Practice staying in the room 2 minutes longer than your instinct says');
    practiceSequence.push('Name one feeling per day to your partner — even a small one');
  }

  if (neuroPct > 60) {
    practiceSequence.push('Progressive muscle relaxation before difficult conversations');
    practiceSequence.push('Physical discharge: walk, stretch, shake — move the energy through');
  }

  // Growth edge practices
  if (eqPerception < 50) {
    practiceSequence.push('Feelings check-in 3 times per day: "What am I feeling right now?"');
  }

  practiceSequence.push('Weekly reflection: "What regulated me this week? What dysregulated me?"');

  return { strengths, buildingBlocks, practiceSequence };
}

// ─── Co-Regulation Pattern ──────────────────────────────

function buildCoRegulationPattern(
  ecrr: ECRRScores,
  sseit: SSEITScores,
  dsir: DSIRScores,
  composite: CompositeScores
): CoRegulationPattern {
  const eqManagingOthers = sseit.subscaleNormalized.managingOthers;
  const eqManagingOwn = sseit.subscaleNormalized.managingOwn;
  const fusionNorm = dsir.subscaleScores.fusionWithOthers.normalized;

  // Determine co-regulation style
  let style: CoRegulationPattern['style'];
  let description: string;

  if (eqManagingOthers > 60 && eqManagingOwn > 60) {
    style = 'mutual';
    description =
      'You can both regulate yourself and help regulate your partner. ' +
      'This mutual capacity is a significant relational resource — you can be a steady ' +
      'presence for your partner while also taking care of yourself.';
  } else if (eqManagingOthers > 60 && eqManagingOwn < 50) {
    style = 'co-regulator';
    description =
      'You are naturally skilled at helping your partner regulate — soothing them, ' +
      'reading their state, offering calm. But you may struggle to receive the same support ' +
      'or to manage your own emotional storms. You give regulation more easily than you receive it.';
  } else if (eqManagingOthers < 50 && eqManagingOwn < 50) {
    style = 'needs-co-regulation';
    description =
      'Both self-regulation and co-regulation are growth areas. When either of you ' +
      'gets activated, it is easy for both systems to escalate together. Building regulation ' +
      'skills — individually and together — will create the most change.';
  } else {
    style = 'independent';
    description =
      'You regulate primarily through your own resources — self-soothing, space, internal ' +
      'processing. This independence is a strength, but your partner may sometimes wish they ' +
      'could help you or be included in your process.';
  }

  // What you offer your partner
  const whatYouOffer: string[] = [];
  if (eqManagingOthers > 55) {
    whatYouOffer.push('Your calm presence helps them settle');
  }
  if (composite.regulationScore > 55) {
    whatYouOffer.push('Your steadiness is an anchor when they are activated');
  }
  if (sseit.subscaleNormalized.perception > 60) {
    whatYouOffer.push('You notice when they are struggling — often before they say anything');
  }
  if (ecrr.attachmentStyle === 'secure' || ecrr.avoidanceScore < 3.0) {
    whatYouOffer.push('Your willingness to stay present during emotional difficulty');
  }
  if (whatYouOffer.length === 0) {
    whatYouOffer.push('Your commitment to growth — you are learning to be a steadier presence');
  }

  // What you need from your partner
  const whatYouNeed: string[] = [];
  if (ecrr.anxietyScore > 4.0) {
    whatYouNeed.push('Verbal reassurance: "I am here, we are okay"');
    whatYouNeed.push('Physical proximity — touch, presence, not distance');
  }
  if (ecrr.avoidanceScore > 4.0) {
    whatYouNeed.push('Space without withdrawal of warmth');
    whatYouNeed.push('Patient waiting without pressure to talk');
  }
  if (composite.regulationScore < 45) {
    whatYouNeed.push('A calm, non-reactive partner response when you are flooded');
  }
  if (fusionNorm < 40) {
    whatYouNeed.push('Reminders that you can be close AND be yourself');
  }
  if (whatYouNeed.length === 0) {
    whatYouNeed.push('Honest, direct communication about what is happening between you');
    whatYouNeed.push('Willingness to work through difficulty together');
  }

  return { style, description, whatYouOffer, whatYouNeed };
}
