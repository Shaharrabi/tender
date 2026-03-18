import type {
  ECRRScores,
  DUTCHScores,
  DSIRScores,
  IPIPScores,
  ValuesScores,
  CompositeScores,
  PartsLens,
} from '@/types';
import { tailorNarrative, buildTailoringContext } from './attachment-tailoring';

/**
 * Lens 2: Parts & Polarities
 * Theoretical foundation: IFS, Internal Systems Thinking
 */
export function analyzePartsPolarities(
  ecrr: ECRRScores,
  dutch: DUTCHScores,
  dsir: DSIRScores,
  ipip: IPIPScores,
  values: ValuesScores,
  composite: CompositeScores
): PartsLens {
  const managerParts = identifyManagers(ecrr, dutch, ipip);
  const firefighterParts = identifyFirefighters(ecrr, ipip);
  const polarities = identifyPolarities(ecrr, dutch, values);
  const rawNarrative = buildPartsNarrative(managerParts, firefighterParts, polarities, composite);

  // Add relational personality contrast if data exists
  const relationalContrast = buildRelationalPersonalityContrast(ipip);
  const fullNarrative = relationalContrast
    ? rawNarrative + ' ' + relationalContrast
    : rawNarrative;

  const ctx = buildTailoringContext(ecrr.attachmentStyle, ecrr.anxietyScore, ecrr.avoidanceScore);
  const narrative = tailorNarrative(fullNarrative, ctx, 'parts');

  return {
    narrative,
    managerParts,
    firefighterParts,
    polarities,
    selfLeadershipScore: composite.selfLeadership,
  };
}

// ─── Relational Personality Contrast ─────────────────────

const DOMAIN_CONTRAST: Record<string, { higher: string; lower: string }> = {
  neuroticism: {
    higher: 'Your emotional sensitivity amplifies in your relationship — your partner\'s mood has more power over your nervous system than anyone else\'s.',
    lower: 'Your relationship steadies your emotional intensity — your partner\'s presence calms something that otherwise stays activated.',
  },
  extraversion: {
    higher: 'You come alive as the social initiator in your relationship — your partner draws out an energy the world rarely sees.',
    lower: 'You go quiet in your relationship — the intimacy zone is where your social energy rests.',
  },
  agreeableness: {
    higher: 'You soften with your partner — the relationship feels safe enough to give more freely.',
    lower: 'You hold a firmer line with your partner than with anyone else — the intimacy gives you permission to have edges.',
  },
  conscientiousness: {
    higher: 'You step up on follow-through in your relationship — the commitment matters enough to organize around.',
    lower: 'You let things slide in your relationship that you would never let slide elsewhere — the intimacy zone is where your discipline relaxes.',
  },
  openness: {
    higher: 'Your relationship opens you to experiences you would not seek alone — your partner expands your world.',
    lower: 'You resist novelty in your relationship — familiar patterns feel safer when the stakes are this high.',
  },
};

function buildRelationalPersonalityContrast(ipip: IPIPScores): string | null {
  const relPers = (ipip as any)?.relationalPersonality as Record<string, number> | undefined;
  const domainPcts = ipip?.domainPercentiles;
  if (!relPers || !domainPcts) return null;

  const THRESHOLD = 15;
  const MAP: Record<string, string> = {
    N_rel: 'neuroticism', E_rel: 'extraversion', A_rel: 'agreeableness',
    C_rel: 'conscientiousness', O_rel: 'openness',
  };

  const contrasts: string[] = [];
  for (const [relKey, domain] of Object.entries(MAP)) {
    const backbone = domainPcts[domain];
    const relational = relPers[relKey];
    if (backbone == null || relational == null) continue;
    const delta = relational - backbone;
    if (Math.abs(delta) <= THRESHOLD) continue;
    const template = DOMAIN_CONTRAST[domain];
    if (!template) continue;
    contrasts.push(delta > 0 ? template.higher : template.lower);
  }

  if (contrasts.length === 0) return null;

  return 'Something interesting emerges when we compare how you are in general with how you show up in your relationship: ' +
    contrasts.join(' ') +
    ' These shifts reveal the relationship\'s unique pull on your personality.';
}

// ─── Manager Parts (proactive protection) ────────────────

function identifyManagers(
  ecrr: ECRRScores,
  dutch: DUTCHScores,
  ipip: IPIPScores
): string[] {
  const parts: string[] = [];
  const conscientiousness = ipip.domainPercentiles.conscientiousness;
  const neuroticism = ipip.domainPercentiles.neuroticism;

  if (conscientiousness > 70) {
    parts.push(
      'The Achiever — maintains high standards and prevents failure. ' +
      'Shows up as self-criticism and difficulty relaxing.'
    );
  }

  if (neuroticism > 65) {
    parts.push(
      'The Worrier — scans for threats and anticipates problems. ' +
      'Shows up as hypervigilance and worst-case thinking.'
    );
  }

  if (ecrr.avoidanceScore > 4.5) {
    parts.push(
      'The Self-Reliant One — maintains independence and avoids dependence. ' +
      'Shows up as not asking for help and minimizing needs.'
    );
  }

  const yielding = dutch.subscaleScores.yielding?.mean ?? 0;
  const avoiding = dutch.subscaleScores.avoiding?.mean ?? 0;
  if (yielding > 3.5 || dutch.primaryStyle === 'yielding') {
    parts.push(
      'The Peacekeeper — maintains harmony and avoids conflict. ' +
      'Shows up as accommodating and not expressing needs.'
    );
  }

  if (avoiding > 3.5 || dutch.primaryStyle === 'avoiding') {
    parts.push(
      'The Disappearer — removes self from conflict. ' +
      'Shows up as topic-changing, withdrawing, or going silent.'
    );
  }

  if (ecrr.anxietyScore > 4.5) {
    parts.push(
      'The Pursuer — monitors connection and moves toward partner. ' +
      'Shows up as seeking reassurance and checking in frequently.'
    );
  }

  return parts;
}

// ─── Firefighter Parts (reactive protection) ─────────────

function identifyFirefighters(
  ecrr: ECRRScores,
  ipip: IPIPScores
): string[] {
  const parts: string[] = [];
  const neuroticism = ipip.domainPercentiles.neuroticism;
  const agreeableness = ipip.domainPercentiles.agreeableness;

  if (neuroticism > 65 && agreeableness < 40) {
    parts.push(
      'The Defender — protects through anger when threatened. ' +
      'Shows up as quick defensiveness and counterattacking.'
    );
  }

  if (ecrr.avoidanceScore > 4.0 && neuroticism > 50) {
    parts.push(
      'The Escape Artist — numbs or distracts from overwhelming feelings. ' +
      'Shows up as checking out, overindulgence, or avoidance behaviors.'
    );
  }

  if (ecrr.anxietyScore > 5.0) {
    parts.push(
      'The Escalator — ramps up intensity when not heard. ' +
      'Shows up as raising the stakes or making ultimatums.'
    );
  }

  return parts;
}

// ─── Polarities (parts in conflict) ──────────────────────

function identifyPolarities(
  ecrr: ECRRScores,
  dutch: DUTCHScores,
  values: ValuesScores
): string[] {
  const polarities: string[] = [];

  // Intimacy vs. protection
  const intimacyImp = values.domainScores.intimacy?.importance ?? 0;
  if (intimacyImp >= 7 && ecrr.avoidanceScore > 3.5) {
    polarities.push(
      'Closeness vs. Safety — part of you wants deep connection, ' +
      'another part fears being hurt or engulfed.'
    );
  }

  // Authenticity vs. harmony
  const honestyImp = values.domainScores.honesty?.importance ?? 0;
  const primaryStyle = dutch.primaryStyle;
  if (honestyImp >= 7 && (primaryStyle === 'avoiding' || primaryStyle === 'yielding')) {
    polarities.push(
      'Truth vs. Peace — part of you values authenticity, ' +
      'another part fears conflict and rejection.'
    );
  }

  // Autonomy vs. connection
  const independenceImp = values.domainScores.independence?.importance ?? 0;
  if (independenceImp >= 6 && intimacyImp >= 6) {
    polarities.push(
      'Me vs. Us — part of you needs independence, ' +
      'another part needs closeness and togetherness.'
    );
  }

  // Control vs. spontaneity
  const adventureImp = values.domainScores.adventure?.importance ?? 0;
  const securityImp = values.domainScores.security?.importance ?? 0;
  if (adventureImp >= 7 && securityImp >= 7) {
    polarities.push(
      'Adventure vs. Stability — part of you craves novelty, ' +
      'another part needs predictability and safety.'
    );
  }

  return polarities;
}

// ─── Narrative ───────────────────────────────────────────

function buildPartsNarrative(
  managers: string[],
  firefighters: string[],
  polarities: string[],
  composite: CompositeScores
): string {
  const { selfLeadership } = composite;

  let narrative =
    'Like everyone, you have different parts that show up in relationships — ' +
    'some try to protect you proactively, others react when things get intense.';

  if (managers.length > 0) {
    narrative +=
      ` You have ${managers.length} protective part${managers.length > 1 ? 's' : ''} ` +
      'that actively manage your emotional life.';
  }

  if (firefighters.length > 0) {
    narrative +=
      ` When those protections fail, ${firefighters.length} reactive part${firefighters.length > 1 ? 's' : ''} ` +
      'can take over.';
  }

  if (polarities.length > 0) {
    narrative +=
      ' Some of these parts pull you in opposite directions, ' +
      'creating internal tension.';
  }

  if (selfLeadership >= 70) {
    narrative +=
      ' Your capacity for self-leadership is strong — you can generally ' +
      'notice when a part has taken over and choose a different response.';
  } else if (selfLeadership >= 50) {
    narrative +=
      ' Your self-leadership is developing — you can sometimes catch yourself ' +
      'mid-pattern, though it gets harder under stress.';
  } else {
    narrative +=
      ' Strengthening your self-leadership — the ability to notice ' +
      'which part is driving and choose differently — is a key growth area.';
  }

  return narrative;
}
