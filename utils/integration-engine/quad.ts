/**
 * Quad Integration Functions
 * ────────────────────────────────────────────
 * When 4 domains are selected, the integration builds on
 * the strongest triple within the four, adding the fourth
 * domain as an additional lens.
 *
 * Rather than writing 35 specific quad functions,
 * we compose: find the best triple, then augment with
 * the fourth domain's contribution.
 */

import type { IntegrationScores, IntegrationResult, DomainId } from './types';
import { DOMAIN_NAMES } from './types';
import { getTripleIntegration } from './triple';
import { getPairwiseIntegration } from './pairwise';
import {
  isAnxious, isAvoidant,
  getEQTotal, getDSITotal,
  getConflictStyle, getTopValues, getAvgValueGap,
  getN,
} from './helpers';

/** Priority triples — try these first when decomposing a quad */
const PRIORITY_TRIPLES: [DomainId, DomainId, DomainId][] = [
  ['foundation', 'navigation', 'stance'],
  ['foundation', 'conflict', 'stance'],
  ['foundation', 'navigation', 'conflict'],
  ['navigation', 'stance', 'conflict'],
  ['foundation', 'stance', 'compass'],
  ['foundation', 'conflict', 'compass'],
  ['navigation', 'conflict', 'compass'],
  ['foundation', 'instrument', 'navigation'],
  ['instrument', 'navigation', 'stance'],
  ['stance', 'conflict', 'compass'],
];

/**
 * Generate a quad integration by composing the best triple
 * with the fourth domain.
 */
export function getQuadIntegration(
  domains: [DomainId, DomainId, DomainId, DomainId],
  scores: IntegrationScores,
): IntegrationResult | null {
  // Find the best triple within these four domains
  let bestTriple: IntegrationResult | null = null;
  let bestTripleDomains: [DomainId, DomainId, DomainId] | null = null;
  let fourthDomain: DomainId | null = null;

  // Try priority triples first
  for (const triple of PRIORITY_TRIPLES) {
    if (triple.every(d => domains.includes(d))) {
      const result = getTripleIntegration(triple, scores);
      if (result) {
        bestTriple = result;
        bestTripleDomains = triple;
        fourthDomain = domains.find(d => !triple.includes(d)) || null;
        break;
      }
    }
  }

  // Fallback: try all possible triples
  if (!bestTriple) {
    for (let i = 0; i < 4; i++) {
      const triple = domains.filter((_, idx) => idx !== i) as [DomainId, DomainId, DomainId];
      const result = getTripleIntegration(triple, scores);
      if (result) {
        bestTriple = result;
        bestTripleDomains = triple;
        fourthDomain = domains[i];
        break;
      }
    }
  }

  if (!bestTriple || !fourthDomain || !bestTripleDomains) return null;

  // Generate the fourth-domain augmentation
  const augmentation = generateAugmentation(fourthDomain, bestTriple, scores);

  return {
    title: bestTriple.title + ' — Deepened',
    subtitle: `${bestTriple.subtitle} + ${DOMAIN_NAMES[fourthDomain]}`,
    body: `${bestTriple.body}\n\n**Adding ${DOMAIN_NAMES[fourthDomain]}:**\n${augmentation.body}`,
    arc: {
      protection: bestTriple.arc.protection,
      cost: `${bestTriple.arc.cost}\n\n${augmentation.arcAddition}`,
      emergence: `${bestTriple.arc.emergence}\n\n${augmentation.emergenceAddition}`,
    },
    practice: augmentation.practice || bestTriple.practice,
    oneThing: bestTriple.oneThing,
    depth: 'quad',
    domains: [...domains],
    confidence: bestTriple.confidence,
  };
}

interface Augmentation {
  body: string;
  arcAddition: string;
  emergenceAddition: string;
  practice: string | null;
}

function generateAugmentation(
  domain: DomainId,
  baseResult: IntegrationResult,
  scores: IntegrationScores,
): Augmentation {
  switch (domain) {
    case 'foundation':
      return {
        body: isAnxious(scores)
          ? `Your attachment anxiety adds urgency to everything in this picture. The patterns above don't just play out — they play out under the pressure of "what if they leave?" This urgency distorts the other systems, making everything feel more high-stakes than it needs to be.`
          : isAvoidant(scores)
          ? `Your avoidant attachment adds a layer of distance to the patterns above. Everything happens at arm's length — you see it, you know it, but you don't fully enter it. The avoidance creates a buffer that both protects and isolates.`
          : `Your secure attachment provides a stable base for all of this. The patterns above play out on solid ground, which means they're more workable than they might be for someone without that security.`,
        arcAddition: isAnxious(scores)
          ? 'Anxiety amplifies every cost. Each protective pattern runs hotter because the stakes feel existential.'
          : isAvoidant(scores)
          ? 'Avoidance mutes the costs — you may not feel them as acutely, but your partner does.'
          : 'Security reduces the costs of each pattern by providing a safe base to return to.',
        emergenceAddition: isAnxious(scores)
          ? 'As you build security, every other system gets room to develop without the distortion of existential urgency.'
          : isAvoidant(scores)
          ? 'As you soften the distance, the other systems gain access to the relational information they need.'
          : 'Your security is the foundation that makes all other growth safer.',
        practice: null,
      };

    case 'instrument':
      return {
        body: getN(scores) >= 65
          ? `Your high sensitivity (N: ${Math.round(getN(scores))}th percentile) amplifies everything in this picture. Every pattern runs through a nervous system tuned to maximum volume. This isn't good or bad — it's the medium through which all your other patterns express themselves.`
          : `Your temperament shapes the texture of everything above. It's the personality-level expression of these deeper patterns — the way they feel from the inside and look from the outside.`,
        arcAddition: getN(scores) >= 65
          ? 'Sensitivity makes every cost louder and every protection more urgent.'
          : 'Your temperament provides the "flavor" of each pattern — the same structure looks different through different personality lenses.',
        emergenceAddition: 'Understanding your temperament as the medium (not the message) of your relational patterns is itself a form of growth.',
        practice: getN(scores) >= 65
          ? 'When the patterns above activate, add a sensitivity check: "Is this intensity proportional, or is my sensitivity amplifying?" Both are possible — the distinction matters.'
          : null,
      };

    case 'navigation':
      return {
        body: getEQTotal(scores) >= 65
          ? `Your strong EQ (${Math.round(getEQTotal(scores))}) means you can see all the patterns above in real time. You have the emotional perception to watch your own system operating — which is both empowering and sometimes paralyzing ("I can see what I'm doing but I can't stop").`
          : `Your developing EQ (${Math.round(getEQTotal(scores))}) means some of these patterns operate below your awareness. Growing your emotional perception will help you see — and then choose — rather than react.`,
        arcAddition: getEQTotal(scores) >= 65
          ? 'High EQ adds awareness of the costs, which can either motivate change or generate self-criticism.'
          : 'Developing EQ means some costs are invisible to you, which both protects and limits.',
        emergenceAddition: getEQTotal(scores) >= 65
          ? 'Use your emotional intelligence as a compass: it can read which of these patterns is active in any given moment.'
          : 'Each increase in EQ illuminates another pattern, giving you more choice points.',
        practice: null,
      };

    case 'stance':
      return {
        body: getDSITotal(scores) >= 60
          ? `Your strong differentiation (${Math.round(getDSITotal(scores))}) provides a container for everything above. You can observe these patterns without being consumed by them. This observing self is the platform from which change happens.`
          : `Your developing differentiation (${Math.round(getDSITotal(scores))}) means these patterns sometimes run the show. Building a stronger "I" — a self that can observe and choose — is the single highest-leverage move you can make.`,
        arcAddition: getDSITotal(scores) >= 60
          ? 'Strong differentiation reduces the cost of each pattern by providing an observer who can choose differently.'
          : 'Without strong differentiation, each pattern operates automatically. The cost is reactivity across all systems.',
        emergenceAddition: getDSITotal(scores) >= 60
          ? 'Your self-definition is the stage on which all other growth performs. Keep it steady.'
          : 'Building differentiation is the keystone — it supports every other system\'s development.',
        practice: getDSITotal(scores) < 60
          ? 'Daily: place hand on chest, take three breaths, say "I am here." This tiny practice builds the observing self that anchors everything else.'
          : null,
      };

    case 'conflict':
      return {
        body: `Your ${getConflictStyle(scores)} conflict style adds a behavioral dimension to the patterns above. When these patterns activate during disagreement — and they will — your default move is to ${getConflictStyle(scores) === 'forcing' ? 'push harder' : getConflictStyle(scores) === 'avoiding' ? 'withdraw' : getConflictStyle(scores) === 'yielding' ? 'give in' : getConflictStyle(scores) === 'problemSolving' ? 'seek solutions' : 'find middle ground'}. Whether that serves the deeper work depends on the moment.`,
        arcAddition: `Your ${getConflictStyle(scores)} style is where these patterns become visible to your partner — it's the behavioral surface of deeper dynamics.`,
        emergenceAddition: 'Growing awareness of your conflict default in relation to these patterns gives you the power to choose a different response when the default isn\'t serving.',
        practice: 'After your next disagreement, trace it back: which of these deeper patterns was driving your conflict style? Understanding the root changes the response.',
      };

    case 'compass':
      return {
        body: `Your values (${getTopValues(scores).slice(0, 3).join(', ')}) provide the "why" for everything above. ${getAvgValueGap(scores) >= 3 ? `But with a values-action gap of ${getAvgValueGap(scores).toFixed(1)}/10, the patterns above may be working against what actually matters to you.` : 'Your relatively aligned values suggest these patterns are serving something meaningful.'}`,
        arcAddition: getAvgValueGap(scores) >= 3
          ? 'The values gap adds moral weight to the costs — you\'re not just struggling relationally, you\'re struggling with integrity.'
          : 'Aligned values reduce the moral cost of relational patterns — at least you\'re moving in the right direction.',
        emergenceAddition: 'Values provide direction for growth. When you\'re not sure which pattern to work on first, choose the one most connected to your core values.',
        practice: getAvgValueGap(scores) >= 3
          ? 'Ask: "Which of these patterns most undermines my most important value?" Start there.'
          : null,
      };

    case 'field':
    default:
      return {
        body: 'The relational field is where all of these patterns live together — not in you, not in your partner, but in the space between. How these patterns show up in the field determines what your partner actually experiences, regardless of your intentions.',
        arcAddition: 'The field absorbs every cost. What you don\'t address lives in the space between you.',
        emergenceAddition: 'Changing any of these patterns changes the field. The relational space is always responding to your growth.',
        practice: 'After working on any of the patterns above, check in with the relational field: "How does the space between us feel?" The field is your growth barometer.',
      };
  }
}
