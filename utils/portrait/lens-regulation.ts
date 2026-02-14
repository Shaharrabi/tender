import type {
  ECRRScores,
  IPIPScores,
  SSEITScores,
  DSIRScores,
  DUTCHScores,
  CompositeScores,
  DetectedPattern,
  RegulationLens,
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

  return {
    narrative,
    windowWidth: composite.windowWidth,
    activationPatterns,
    shutdownPatterns,
    floodingMarkers,
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
