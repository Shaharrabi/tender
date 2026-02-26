/**
 * Dyadic Discrepancy Detection
 *
 * Compares individual portrait data against dyadic assessment data
 * to detect blind spots, hidden strengths, perception gaps, and
 * compensating patterns.
 *
 * These are places where "what I think of myself" diverges from
 * "how the relationship actually shows up."
 */

import type { IndividualPortrait, CompositeScores } from '@/types/portrait';
import type {
  DyadicDiscrepancy,
  DiscrepancyType,
  RDASScores,
  DCIScores,
  CSI16Scores,
} from '@/types/couples';

interface DyadicScoreSet {
  rdas?: { partnerA: RDASScores; partnerB: RDASScores };
  dci?: { partnerA: DCIScores; partnerB: DCIScores };
  csi16?: { partnerA: CSI16Scores; partnerB: CSI16Scores };
}

// ─── Detection Logic ────────────────────────────────────

/**
 * Detect discrepancies between individual portraits and dyadic data.
 *
 * Types of discrepancies:
 * - blind_spot: high individual score but low dyadic score (thinks they're good but relationship says otherwise)
 * - hidden_strength: low individual score but high dyadic score (undersells themselves)
 * - perception_gap: partners rate the same domain very differently
 * - compensating: one partner's strength masks the other's developing area
 */
export function detectDyadicDiscrepancies(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  dyadicScores: DyadicScoreSet,
): DyadicDiscrepancy[] {
  const discrepancies: DyadicDiscrepancy[] = [];

  // ── Regulation vs. Negative Coping ──────────────────
  // If both have high regulation scores but DCI shows high negative coping,
  // there's a blind spot: they think they regulate well but under relational stress, they don't
  if (dyadicScores.dci) {
    const avgReg = ((portraitA.compositeScores.regulationScore ?? 50) + (portraitB.compositeScores.regulationScore ?? 50)) / 2;
    const avgNeg = ((dyadicScores.dci.partnerA.negativeByPartner ?? 0) + (dyadicScores.dci.partnerB.negativeByPartner ?? 0)) / 2;

    if (avgReg > 60 && avgNeg > 10) {
      discrepancies.push({
        type: 'blind_spot',
        title: 'Regulation Under Relational Stress',
        description: 'Both of you show strong individual emotional regulation capacity — but when stress enters the relationship, negative coping patterns still emerge.',
        individualData: `Average regulation capacity: ${Math.round(avgReg)}/100`,
        dyadicData: `Average negative coping perception: ${Math.round(avgNeg)}/20`,
        whatItMeans: 'You may regulate well individually but struggle to hold that regulation when your attachment system is activated. This is extremely common — individual regulation and relational regulation are different skills.',
        explorationQuestion: 'What happens to your regulation capacity when your partner is upset with you? Is it different from when you are stressed alone?',
      });
    }

    // ── Support Perception Gap ─────────────────────
    // Partner A thinks they give a lot of support; Partner B doesn't experience it
    const aGives = dyadicScores.dci.partnerA.supportiveBySelf ?? 0;
    const bReceives = dyadicScores.dci.partnerB.supportiveByPartner ?? 0;
    const supportGapAB = aGives - bReceives;

    if (supportGapAB > 5) {
      discrepancies.push({
        type: 'perception_gap',
        title: 'Support Lost in Translation',
        description: 'One partner believes they are providing significant support — but their partner does not experience it that way.',
        individualData: `Partner A rates their support-giving: ${aGives}/25`,
        dyadicData: `Partner B rates received support from Partner A: ${bReceives}/25`,
        whatItMeans: 'This is not about effort — it is about translation. The support being offered may not match the support being needed. Love languages matter here: what feels supportive to one may not register for the other.',
        explorationQuestion: 'When you try to support your partner, what does it look like? Ask your partner: "What does support look like for you?"',
      });
    }

    const bGives = dyadicScores.dci.partnerB.supportiveBySelf ?? 0;
    const aReceives = dyadicScores.dci.partnerA.supportiveByPartner ?? 0;
    const supportGapBA = bGives - aReceives;

    if (supportGapBA > 5) {
      discrepancies.push({
        type: 'perception_gap',
        title: 'Support Lost in Translation',
        description: 'One partner believes they are providing significant support — but their partner does not experience it that way.',
        individualData: `Partner B rates their support-giving: ${bGives}/25`,
        dyadicData: `Partner A rates received support from Partner B: ${aReceives}/25`,
        whatItMeans: 'Support that is not received in the way it was intended is not effective support — even if the intention was genuine. The gap is in translation, not in caring.',
        explorationQuestion: 'What does support feel like to you? Share a specific example of when you felt truly supported.',
      });
    }

    // ── Strong Common Coping Despite Individual Differences ──
    const commonCoping = (dyadicScores.dci.partnerA.commonCoping + dyadicScores.dci.partnerB.commonCoping) / 2;
    const eiGap = Math.abs((portraitA.compositeScores.emotionalIntelligence ?? 50) - (portraitB.compositeScores.emotionalIntelligence ?? 50));

    if (commonCoping > 18 && eiGap > 20) {
      discrepancies.push({
        type: 'hidden_strength',
        title: 'Stronger Together Than Apart',
        description: 'Your emotional intelligence levels are quite different individually, yet your common coping is remarkably strong.',
        individualData: `EI gap: ${Math.round(eiGap)} points between partners`,
        dyadicData: `Common coping average: ${Math.round(commonCoping)}/25`,
        whatItMeans: 'The relationship itself has developed a capacity that neither partner has alone. This is the relational field at work — the "us" compensates for individual differences. This is a genuine strength.',
        explorationQuestion: 'What do you do well TOGETHER that neither of you does as well alone? Name three things.',
      });
    }
  }

  // ── Satisfaction Gap ──────────────────────────────────
  if (dyadicScores.csi16) {
    const diff = Math.abs(dyadicScores.csi16.partnerA.total - dyadicScores.csi16.partnerB.total);
    if (diff > 15) {
      const moreContent = dyadicScores.csi16.partnerA.total > dyadicScores.csi16.partnerB.total ? 'A' : 'B';
      discrepancies.push({
        type: 'perception_gap',
        title: 'Living in Different Relationships',
        description: 'Your satisfaction levels are significantly different — which means you are experiencing the same relationship very differently.',
        individualData: `Partner A satisfaction: ${dyadicScores.csi16.partnerA.total}/81, Partner B: ${dyadicScores.csi16.partnerB.total}/81`,
        dyadicData: `Gap: ${diff} points`,
        whatItMeans: `Partner ${moreContent} is more content with how things are. This does not mean one is right — it means there are unspoken needs in the system. The less satisfied partner may be holding unexpressed frustrations; the more satisfied partner may not be aware of them.`,
        explorationQuestion: 'If you could change one thing about how your relationship feels day-to-day, what would it be? Share openly, without defending.',
      });
    }
  }

  // ── Attachment Security vs. Relationship Distress ─────
  if (dyadicScores.rdas) {
    const avgSecurity = ((portraitA.compositeScores.attachmentSecurity ?? 50) + (portraitB.compositeScores.attachmentSecurity ?? 50)) / 2;
    const avgRDAS = (dyadicScores.rdas.partnerA.total + dyadicScores.rdas.partnerB.total) / 2;
    const isDistressed = avgRDAS < 48;

    if (avgSecurity > 60 && isDistressed) {
      discrepancies.push({
        type: 'blind_spot',
        title: 'Secure Individuals, Strained Relationship',
        description: 'Both partners carry relatively secure attachment styles, yet the relationship shows signs of distress.',
        individualData: `Average attachment security: ${Math.round(avgSecurity)}/100`,
        dyadicData: `Average RDAS: ${Math.round(avgRDAS)}/69 (distressed range)`,
        whatItMeans: 'Individual security does not guarantee relational health. External stressors, life transitions, or accumulated hurt can strain even securely attached couples. The good news: your secure base gives you better tools for repair.',
        explorationQuestion: 'What changed in your lives recently that might be affecting your relationship? Sometimes the issue is not between you — it is around you.',
      });
    }

    // ── Low Individual Scores + High Relationship Satisfaction ──
    if (avgSecurity < 45 && !isDistressed) {
      discrepancies.push({
        type: 'hidden_strength',
        title: 'The Relationship Heals What It Finds',
        description: 'Despite lower individual attachment security, your relationship adjustment is in the healthy range.',
        individualData: `Average attachment security: ${Math.round(avgSecurity)}/100`,
        dyadicData: `Average RDAS: ${Math.round(avgRDAS)}/69 (non-distressed)`,
        whatItMeans: 'Your relationship is functioning as a corrective emotional experience — helping both of you develop security you may not have had before. This is beautiful and worth protecting.',
        explorationQuestion: 'What does this relationship give you that previous relationships did not? Name it, celebrate it, and let it teach you what safety feels like.',
      });
    }
  }

  // ── Values Congruence vs. Consensus ───────────────────
  if (dyadicScores.rdas) {
    const avgValues = ((portraitA.compositeScores.valuesCongruence ?? 50) + (portraitB.compositeScores.valuesCongruence ?? 50)) / 2;
    const avgConsensus = (dyadicScores.rdas.partnerA.consensus + dyadicScores.rdas.partnerB.consensus) / 2;

    // High individual values alignment but low dyadic consensus
    if (avgValues > 65 && avgConsensus < 18) {
      discrepancies.push({
        type: 'compensating',
        title: 'Aligned Values, Different Expressions',
        description: 'Both partners rate their own values alignment highly, yet consensus on practical matters is low.',
        individualData: `Average values congruence: ${Math.round(avgValues)}/100`,
        dyadicData: `Average consensus: ${Math.round(avgConsensus)}/30`,
        whatItMeans: 'You may share deep values but disagree on how to live them out. One might value family but disagree on HOW to prioritize family. The values are aligned — the expressions need negotiation.',
        explorationQuestion: 'Name a value you share, then explore: "How do I want to live this value? How do you?" Notice where the expressions diverge.',
      });
    }
  }

  // Deduplicate by title (same perception gap from both directions gets merged)
  const seen = new Set<string>();
  return discrepancies.filter(d => {
    const key = `${d.type}-${d.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
