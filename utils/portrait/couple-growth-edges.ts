/**
 * Couple Growth Edge Prioritization
 *
 * Builds prioritized growth edges for the couple using:
 * - WEARE bottleneck (always #1 if available)
 * - Combined cycle insights
 * - Convergence-divergence friction zones
 * - Dyadic assessment gaps
 *
 * Grounded in EFT, ACT, Gottman, Polyvagal, and IFS.
 * Anti-shame: every edge names the protection AND the cost.
 */

import type { IndividualPortrait } from '@/types/portrait';
import type {
  CoupleGrowthEdge,
  CombinedCycle,
  FrictionZone,
  AttachmentDynamic,
  RDASScores,
  DCIScores,
  CSI16Scores,
  RadarOverlap,
} from '@/types/couples';
import type { WEAREProfile, WEAREVariableName } from '@/types/weare';

interface DyadicScoreSet {
  rdas?: { partnerA: RDASScores; partnerB: RDASScores };
  dci?: { partnerA: DCIScores; partnerB: DCIScores };
  csi16?: { partnerA: CSI16Scores; partnerB: CSI16Scores };
}

// ─── WEARE Bottleneck → Growth Edge ──────────────────────

const WEARE_BOTTLENECK_MAP: Record<WEAREVariableName, {
  title: string;
  whatItIs: string;
  whyItMatters: string;
  whatItProtects: string;
  whatItCosts: string;
  theInvitation: string;
  practiceForBoth: string;
}> = {
  attunement: {
    title: 'Tuning In To Each Other',
    whatItIs: 'The ability to sense what is happening in the space between you — to notice shifts in mood, energy, or connection before they become problems.',
    whyItMatters: 'Attunement is the foundation. When partners cannot feel each other, every other relational skill operates in the dark.',
    whatItProtects: 'Not tuning in protects from the vulnerability of being affected by another person. If you do not notice, you cannot be hurt by what you see.',
    whatItCosts: 'Missed bids for connection. Small hurts that accumulate. A growing sense of "they do not really see me."',
    theInvitation: 'Practice noticing — not fixing. Start by simply observing what is happening in your partner without trying to change it.',
    practiceForBoth: 'Daily check-in: "What is alive in you right now?" Listen for 2 minutes without responding. Just receive.',
  },
  coCreation: {
    title: 'Building Together',
    whatItIs: 'How well you co-create solutions, navigate decisions, and build a shared life that reflects both partners.',
    whyItMatters: 'Couples who cannot build together feel like roommates. Co-creation is what turns two lives into a shared story.',
    whatItProtects: 'Avoiding co-creation protects autonomy. If you build alone, nobody can compromise your vision.',
    whatItCosts: 'Two separate lives under one roof. Decisions made alone breed resentment in the other.',
    theInvitation: 'Start with small shared projects. Cooking a meal together. Planning a weekend together. Notice what happens when you both hold the wheel.',
    practiceForBoth: 'Choose one area of your life to redesign together this week — not "my way" or "your way" but "our way."',
  },
  transmission: {
    title: 'Showing Up Consistently',
    whatItIs: 'Whether the insights, intentions, and commitments you share actually show up in daily behavior.',
    whyItMatters: 'Words without action erode trust faster than anything else in a relationship.',
    whatItProtects: 'The gap between intention and action protects from the discomfort of change. Talking about growth is easier than doing it.',
    whatItCosts: 'Your partner learns they cannot trust your words. The relationship runs on hope instead of evidence.',
    theInvitation: 'Pick one small commitment and follow through on it this week. One. Perfectly. Consistently.',
    practiceForBoth: 'Make one micro-commitment per week and track it together. Celebrate follow-through more than grand gestures.',
  },
  space: {
    title: 'Healthy Separateness',
    whatItIs: 'The ability to maintain individual identity while staying connected. Knowing where "I" end and "we" begins.',
    whyItMatters: 'Without healthy space, closeness becomes suffocating. Differentiation is what makes intimacy sustainable.',
    whatItProtects: 'Merging or distancing protect from the vulnerable middle ground of being close AND separate simultaneously.',
    whatItCosts: 'Either burnout from over-togetherness or loneliness from too much distance.',
    theInvitation: 'Practice holding two truths: "I love you AND I need space." Both are real. Both are okay.',
    practiceForBoth: 'Create a "sacred separate" ritual — a time each week that belongs to each of you individually, without guilt.',
  },
  time: {
    title: 'Consistency of Engagement',
    whatItIs: 'How regularly and predictably you show up for the relationship — not just in crisis, but in the ordinary days.',
    whyItMatters: 'Relationships are built in the small moments, not the grand gestures. Consistency creates safety.',
    whatItProtects: 'Inconsistency protects from the vulnerability of being reliably present. If you are unpredictable, you cannot be taken for granted.',
    whatItCosts: 'Your partner cannot relax into the relationship. They are always bracing for the next disappearance.',
    theInvitation: 'Show up in the boring moments. The Tuesday evenings. The morning routines. That is where trust lives.',
    practiceForBoth: 'Establish one daily touchpoint that is non-negotiable — a morning hug, an evening check-in, a midday text. Same time. Every day.',
  },
  individual: {
    title: 'Inner Resources',
    whatItIs: 'The personal emotional, psychological, and spiritual resources each partner brings to the relationship.',
    whyItMatters: 'You cannot pour from an empty cup. Individual wellness is the substrate on which relational wellness grows.',
    whatItProtects: 'Neglecting individual resources lets you avoid the hard work of personal growth. It is easier to focus on "us" than "me."',
    whatItCosts: 'Depleted partners create depleted relationships. Individual depletion eventually becomes couple depletion.',
    theInvitation: 'Each partner takes responsibility for their own emotional tank. Fill yours, so you have something to offer.',
    practiceForBoth: 'Each partner names one personal practice they are committed to this month — therapy, exercise, meditation, journaling. Support each other in it.',
  },
  context: {
    title: 'Life Pressures + Support',
    whatItIs: 'External stressors (work, health, family, finances) and the support systems available to buffer them.',
    whyItMatters: 'External stress is the number one predictor of relationship distress. It is not about the relationship — it is about what is happening around it.',
    whatItProtects: 'Ignoring external context lets you blame the relationship for problems that come from outside it.',
    whatItCosts: 'Stress leaks into every interaction. Without naming it, couples fight about dishes when the real issue is burnout.',
    theInvitation: 'Name the external stress explicitly: "I am stressed about work, and it has nothing to do with you."',
    practiceForBoth: 'Weekly stress inventory: each partner names their top stressor. Then ask: "What would help?" Sometimes just being heard is enough.',
  },
  change: {
    title: 'Growth Momentum',
    whatItIs: 'Whether the relationship is moving forward — learning, evolving, deepening — or has plateaued.',
    whyItMatters: 'Relationships that stop growing start dying. Not dramatically — just slowly, quietly, imperceptibly.',
    whatItProtects: 'Stagnation protects from the discomfort of change. Growth requires leaving the familiar.',
    whatItCosts: 'The relationship becomes a museum — perfectly preserved but no longer alive.',
    theInvitation: 'Take one risk this week. Share something you have never shared. Try something you have never tried.',
    practiceForBoth: 'Monthly growth check-in: "What have we learned about each other this month? What is one thing we want to explore next?"',
  },
  resistance: {
    title: 'Letting Go of What No Longer Serves You',
    whatItIs: 'The rigidity, defensiveness, and protective patterns that once kept you safe but now keep you stuck.',
    whyItMatters: 'Every protective pattern was brilliant in the context that created it. The question is whether that context still exists.',
    whatItProtects: 'Everything. That is the point. These patterns were designed to protect you from exactly this kind of vulnerability.',
    whatItCosts: 'The very closeness you are seeking. Resistance keeps the relationship safe but small.',
    theInvitation: 'Name the protection: "The part of me that does X is trying to protect me from Y." Then ask: "Is that still true?"',
    practiceForBoth: 'Each partner identifies one protective pattern they are willing to soften this month. Not eliminate — soften. 10% more openness.',
  },
};

function buildWeareBottleneckEdge(weareProfile: WEAREProfile): CoupleGrowthEdge | null {
  if (!weareProfile.bottleneck) return null;

  const variable = weareProfile.bottleneck.variable;
  const template = WEARE_BOTTLENECK_MAP[variable];
  if (!template) return null;

  return {
    id: `weare-bottleneck-${variable}`,
    title: template.title,
    whatItIs: template.whatItIs,
    whyItMatters: template.whyItMatters,
    whatItProtects: template.whatItProtects,
    whatItCosts: template.whatItCosts,
    theInvitation: template.theInvitation,
    partnerAPart: 'Notice how this shows up in YOUR protective patterns.',
    partnerBPart: 'Notice how this shows up in YOUR protective patterns.',
    practiceForBoth: template.practiceForBoth,
    confidenceLevel: 'Strong',
    priority: 1,
    relatedDyadicData: `WEARE bottleneck: ${weareProfile.bottleneck.label} (${weareProfile.bottleneck.value}/10)`,
  };
}

// ─── Cycle-Based Growth Edge ────────────────────────────

function buildCycleEdge(cycle: CombinedCycle): CoupleGrowthEdge {
  let partnerAPart: string;
  let partnerBPart: string;

  switch (cycle.dynamic) {
    case 'pursue-withdraw':
      partnerAPart = cycle.partnerAPosition === 'pursuer'
        ? 'Practice softening your approach. Lead with the need underneath the urgency.'
        : 'Practice staying present for one more minute before retreating. Say "I need a moment" instead of disappearing.';
      partnerBPart = cycle.partnerBPosition === 'pursuer'
        ? 'Practice softening your approach. Lead with the need underneath the urgency.'
        : 'Practice staying present for one more minute before retreating. Say "I need a moment" instead of disappearing.';
      break;
    case 'mutual-pursuit':
      partnerAPart = 'When you both activate simultaneously, volunteer to be the steady one first. Take turns.';
      partnerBPart = 'When you both activate simultaneously, volunteer to be the steady one first. Take turns.';
      break;
    case 'mutual-withdrawal':
      partnerAPart = 'Practice one small bid for connection per day — even when it feels unnecessary.';
      partnerBPart = 'Practice one small bid for connection per day — even when it feels unnecessary.';
      break;
    default:
      partnerAPart = 'Notice which position you are in right now and name it out loud.';
      partnerBPart = 'Notice which position you are in right now and name it out loud.';
  }

  return {
    id: 'cycle-awareness',
    title: 'Seeing Your Dance Together',
    whatItIs: `Your combined pattern is ${cycle.dynamic.replace(/-/g, ' ')}. When stress enters, you both activate predictable protective moves.`,
    whyItMatters: 'The cycle is not the problem — being caught in it without awareness IS. Once you both see it, you can choose differently.',
    whatItProtects: 'Each position in the dance protects something precious: the pursuer protects connection, the withdrawer protects autonomy.',
    whatItCosts: 'The cycle creates the very disconnection both partners fear most.',
    theInvitation: 'Name the cycle out loud when you notice it: "I think our dance is happening right now."',
    partnerAPart,
    partnerBPart,
    practiceForBoth: 'After a cycle episode, do an after-action review (no blame): "What just happened? What did each of us need underneath?"',
    confidenceLevel: 'Strong',
    priority: 2,
    relatedDyadicData: `Combined cycle: ${cycle.dynamic}`,
  };
}

// ─── Friction Zone → Growth Edge ─────────────────────────

function frictionZoneToEdge(zone: FrictionZone, index: number): CoupleGrowthEdge {
  return {
    id: `friction-${zone.area.toLowerCase().replace(/\s+/g, '-')}`,
    title: `Bridging ${zone.area}`,
    whatItIs: zone.whatHappens,
    whyItMatters: 'This gap creates recurring friction because both partners experience the same situations differently.',
    whatItProtects: 'Each style protects something real — neither is wrong.',
    whatItCosts: zone.underneathIt,
    theInvitation: zone.practiceForBoth,
    partnerAPart: zone.partnerAPull,
    partnerBPart: zone.partnerBPull,
    practiceForBoth: zone.practiceForBoth,
    confidenceLevel: 'Supported',
    priority: 3 + index,
    relatedDyadicData: `Friction zone: ${zone.area}`,
  };
}

// ─── Dyadic Data → Growth Edges ──────────────────────────

function buildDyadicEdges(
  dyadicScores: DyadicScoreSet,
  radarOverlap: RadarOverlap[],
): CoupleGrowthEdge[] {
  const edges: CoupleGrowthEdge[] = [];

  // Low satisfaction (CSI-16 avg < 52)
  if (dyadicScores.csi16) {
    const avg = (dyadicScores.csi16.partnerA.total + dyadicScores.csi16.partnerB.total) / 2;
    if (avg < 52) {
      edges.push({
        id: 'satisfaction-recovery',
        title: 'Rebuilding Satisfaction',
        whatItIs: 'Your satisfaction scores suggest the relationship is in a strained place. This does not mean it is broken — it means it needs tending.',
        whyItMatters: 'Satisfaction is the felt sense of "this is worth it." When it erodes, partners stop investing — creating a downward spiral.',
        whatItProtects: 'Low expectations protect from further disappointment.',
        whatItCosts: 'The relationship loses its felt value. Partners start looking elsewhere for fulfillment.',
        theInvitation: 'Rebuild from the ground up: small positive interactions, appreciation, fondness practices.',
        partnerAPart: 'Name one thing your partner did this week that mattered to you.',
        partnerBPart: 'Name one thing your partner did this week that mattered to you.',
        practiceForBoth: 'Daily appreciation: each partner shares one specific, genuine appreciation at the end of each day.',
        confidenceLevel: 'Strong',
        priority: 2,
        relatedDyadicData: `CSI-16 average: ${Math.round(avg)}/81 (below clinical threshold)`,
      });
    }
  }

  // High negative coping (DCI)
  if (dyadicScores.dci) {
    const avgNeg = (
      (dyadicScores.dci.partnerA.negativeByPartner || 0) +
      (dyadicScores.dci.partnerB.negativeByPartner || 0)
    ) / 2;
    if (avgNeg > 10) {
      edges.push({
        id: 'stress-coping-transformation',
        title: 'Transforming Stress Responses',
        whatItIs: 'When stress enters your relationship, negative responses (criticism, dismissiveness, stonewalling) have become habitual.',
        whyItMatters: 'Negative coping erodes the trust bank faster than positive deposits can fill it. Gottman research shows it takes 5 positive interactions to offset 1 negative.',
        whatItProtects: 'Negative responses are quick, familiar, and require less vulnerability than soft responses.',
        whatItCosts: 'Each negative interaction chips away at your partner\'s sense of safety with you.',
        theInvitation: 'Replace one negative default with a softer alternative this week.',
        partnerAPart: 'When stressed, practice: "I am overwhelmed right now. I need [specific thing]."',
        partnerBPart: 'When your partner is stressed, practice: "I see you are struggling. What would help?"',
        practiceForBoth: 'Create a stress signal — a word or gesture that means "I am flooded, not angry at you."',
        confidenceLevel: 'Strong',
        priority: 2,
        relatedDyadicData: `DCI negative coping: ${Math.round(avgNeg)}/20`,
      });
    }
  }

  // Significant radar gaps
  const significantGaps = radarOverlap.filter(r => r.gapInterpretation === 'significant_gap');
  for (const gap of significantGaps.slice(0, 2)) {
    edges.push({
      id: `radar-gap-${gap.dimension}`,
      title: `Bridging ${gap.dimensionLabel}`,
      whatItIs: gap.insight,
      whyItMatters: `A ${gap.gap}-point gap in ${gap.dimensionLabel.toLowerCase()} creates different lived experiences of the same relationship.`,
      whatItProtects: 'The stronger partner may avoid addressing the gap to avoid seeming critical.',
      whatItCosts: 'The developing partner may feel inadequate; the stronger partner may feel burdened.',
      theInvitation: `The partner with more ${gap.dimensionLabel.toLowerCase()} capacity leads gently; the developing partner brings curiosity.`,
      partnerAPart: gap.partnerAScore > gap.partnerBScore
        ? `Share how you experience ${gap.dimensionLabel.toLowerCase()} — model it, do not teach it.`
        : `Ask your partner to show you what ${gap.dimensionLabel.toLowerCase()} looks like for them.`,
      partnerBPart: gap.partnerBScore > gap.partnerAScore
        ? `Share how you experience ${gap.dimensionLabel.toLowerCase()} — model it, do not teach it.`
        : `Ask your partner to show you what ${gap.dimensionLabel.toLowerCase()} looks like for them.`,
      practiceForBoth: `Have a curious conversation about ${gap.dimensionLabel.toLowerCase()}: "What does this look like for you? How do you experience it differently than I do?"`,
      confidenceLevel: 'Supported',
      priority: 4,
      relatedDyadicData: `Radar gap: ${gap.dimensionLabel} (${gap.gap} points)`,
    });
  }

  return edges;
}

// ─── Attachment Dynamic → Growth Edge ────────────────────

function buildAttachmentEdge(dynamic: AttachmentDynamic): CoupleGrowthEdge | null {
  if (dynamic.distance < 20) return null; // close enough — not a priority

  return {
    id: 'attachment-bridge',
    title: 'Bridging Your Attachment Styles',
    whatItIs: `Your attachment dynamic is "${dynamic.dynamicLabel}." You sit in different positions on the attachment landscape, which shapes how you experience connection and disconnection.`,
    whyItMatters: 'Attachment differences are the engine of most couple cycles. Understanding them transforms conflict from personal failure to patterned response.',
    whatItProtects: 'Each attachment style developed to protect you in relationships where full safety was not available.',
    whatItCosts: 'The strategies that protected you as a child may be limiting your adult relationship.',
    theInvitation: dynamic.whatThisMeansForRepair,
    partnerAPart: `From the ${dynamic.partnerAQuadrant} position, your work is to notice when your protective strategy activates and name it.`,
    partnerBPart: `From the ${dynamic.partnerBQuadrant} position, your work is to notice when your protective strategy activates and name it.`,
    practiceForBoth: 'After conflict, ask each other: "What did your attachment system tell you was happening? What was actually happening?"',
    confidenceLevel: 'Supported',
    priority: 3,
    relatedDyadicData: `Attachment distance: ${Math.round(dynamic.distance)} (${dynamic.partnerAQuadrant} ↔ ${dynamic.partnerBQuadrant})`,
  };
}

// ─── Main Export ─────────────────────────────────────────

export function buildCoupleGrowthEdges(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  dyadicScores: DyadicScoreSet,
  combinedCycle: CombinedCycle,
  frictionZones: FrictionZone[],
  attachmentDynamic: AttachmentDynamic,
  radarOverlap: RadarOverlap[],
  weareProfile?: WEAREProfile | null,
): CoupleGrowthEdge[] {
  const edges: CoupleGrowthEdge[] = [];

  // 1. WEARE bottleneck always first (if available)
  if (weareProfile) {
    const bottleneckEdge = buildWeareBottleneckEdge(weareProfile);
    if (bottleneckEdge) edges.push(bottleneckEdge);
  }

  // 2. Cycle awareness
  edges.push(buildCycleEdge(combinedCycle));

  // 3. Attachment dynamic
  const attachmentEdge = buildAttachmentEdge(attachmentDynamic);
  if (attachmentEdge) edges.push(attachmentEdge);

  // 4. Friction zones
  for (let i = 0; i < Math.min(frictionZones.length, 2); i++) {
    edges.push(frictionZoneToEdge(frictionZones[i], i));
  }

  // 5. Dyadic data edges
  edges.push(...buildDyadicEdges(dyadicScores, radarOverlap));

  // Sort by priority, deduplicate by id, cap at 6
  const seen = new Set<string>();
  const deduped = edges.filter(e => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });

  return deduped.sort((a, b) => a.priority - b.priority).slice(0, 6);
}
