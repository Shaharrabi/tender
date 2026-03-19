/**
 * CoupleMatrix — "Our Matrix" for the couple portal.
 *
 * Side-by-side comparison of both partners' matrix data with
 * a center column showing the relationship dynamic.
 * Full WEARE data shows here (not in individual mode per Addendum 1).
 *
 * Tier 3 support: when a domain has `tier3` data, the expanded panel
 * renders a LensPicker + lens narrative + couple arc (4-step flow) +
 * structured practice card + pull-quote invitation.
 * Non-Tier-3 domains fall back to the original narrative + practice display.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import TenderText from '@/components/ui/TenderText';
import MatrixInvitation from './MatrixInvitation';
import LensPicker from './LensPicker';
import { MATRIX_COLORS, CONFIDENCE_COLORS, type MatrixColorKey, type ConfidenceLevel } from './constants/matrix-colors';
import * as Labels from './constants/matrix-labels';
import {
  generateAttachmentPairing,
  generateConflictPairing,
  generateCoupleInvitation,
} from './narratives/couple-narratives';
import { generateFieldNarrative } from './narratives/field';
import {
  routeAttachmentDynamic,
  routeConflictDynamic,
  routeValuesDynamic,
  interpolateCouple,
  type CoupleNarrativeEntry,
  type CoupleRouteResult,
} from '@/utils/integration-engine/narratives/tier3-couple-dynamics';
import { Colors, Spacing, BorderRadius, Shadows, FontFamilies } from '@/constants/theme';
import type { LensType } from '@/utils/integration-engine';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Types ──────────────────────────────────────────

interface PartnerScores {
  ecrr?: any;
  ipip?: any;
  sseit?: any;
  dsir?: any;
  dutch?: any;
  values?: any;
}

interface DyadicScoresPair {
  partnerA: any | null;
  partnerB: any | null;
}

interface CoupleMatrixProps {
  partner1: PartnerScores;
  partner2: PartnerScores;
  partner1Name?: string;
  partner2Name?: string;
  weareData?: {
    resonance?: number;
    emergenceDirection?: number;
    bottleneck?: string | null;
    movementPhase?: string;
  };
  rfasData?: {
    totalMean?: number;
    fieldRecognition?: number;
    creativeTension?: number;
    presenceAttunement?: number;
    emergentOrientation?: number;
  };
  dyadicScores?: {
    rdas: DyadicScoresPair;
    dci: DyadicScoresPair;
    csi16: DyadicScoresPair;
  } | null;
}

/** Tier 3 couple arc — four universal steps shown as a visual flow */
interface CoupleArc {
  pattern: string;
  eachPartnersWound: string;
  theCost: string;
  theInvitation: string;
}

/** Structured practice card — supports solo (bothPartners: true) or split-task layout */
interface CouplePractice {
  name: string;
  description: string;
  frequency: string;
  bothPartners: boolean;
  partnerATask?: string;
  partnerBTask?: string;
}

/** Full Tier 3 payload for a domain — injected by the couple router */
interface Tier3DomainData {
  dynamicName: string;
  lenses: Record<string, string>; // LensType → narrative string
  coupleArc: CoupleArc;
  couplePractice: CouplePractice;
  coupleInvitation: string;
}

interface CoupleDomain {
  id: string;
  title: string;
  color: MatrixColorKey;
  confidence: ConfidenceLevel;
  partner1Cells: Array<{ label: string; value: string }>;
  partner2Cells: Array<{ label: string; value: string }>;
  centerLabel: string;
  narrative: string;
  practice?: string;
  instruments: string[];
  tier3?: Tier3DomainData;
}

// ─── Arc step definitions ────────────────────────────

const ARC_STEPS: Array<{ key: keyof CoupleArc; label: string; color: string }> = [
  { key: 'pattern',           label: 'Pattern',    color: Colors.primary },
  { key: 'eachPartnersWound', label: 'History',    color: Colors.accent },
  { key: 'theCost',           label: 'Cost',       color: Colors.error },
  { key: 'theInvitation',     label: 'Invitation', color: Colors.calm },
];

// ─── Sub-components ──────────────────────────────────

interface CoupleArcFlowProps {
  arc: CoupleArc;
  palette: { bg: string; text: string; accent: string; label: string };
}

function CoupleArcFlow({ arc, palette }: CoupleArcFlowProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <View style={arcStyles.wrapper}>
      {/* Step selector row */}
      <View style={arcStyles.stepRow}>
        {ARC_STEPS.map((step, idx) => {
          const isActive = idx === activeStep;
          return (
            <React.Fragment key={step.key}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveStep(idx)}
                style={arcStyles.stepButton}
              >
                <View
                  style={[
                    arcStyles.stepDot,
                    {
                      backgroundColor: isActive ? step.color : step.color + '30',
                      borderColor: isActive ? step.color : step.color + '60',
                    },
                  ]}
                />
                <TenderText
                  variant="caption"
                  style={[
                    arcStyles.stepLabel,
                    { color: isActive ? step.color : Colors.textMuted },
                  ]}
                >
                  {step.label}
                </TenderText>
              </TouchableOpacity>
              {idx < ARC_STEPS.length - 1 && (
                <View
                  style={[
                    arcStyles.connector,
                    { backgroundColor: Colors.primary + '25' },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Active step content */}
      <View
        style={[
          arcStyles.stepContent,
          { backgroundColor: ARC_STEPS[activeStep].color + '10', borderColor: ARC_STEPS[activeStep].color + '30' },
        ]}
      >
        <View style={arcStyles.stepContentHeader}>
          <View
            style={[
              arcStyles.stepContentDot,
              { backgroundColor: ARC_STEPS[activeStep].color },
            ]}
          />
          <TenderText
            variant="caption"
            style={[arcStyles.stepContentLabel, { color: ARC_STEPS[activeStep].color }]}
          >
            {ARC_STEPS[activeStep].label.toUpperCase()}
          </TenderText>
        </View>
        <TenderText variant="body" style={arcStyles.stepContentText}>
          {arc[ARC_STEPS[activeStep].key]}
        </TenderText>
      </View>
    </View>
  );
}

interface PracticeCardProps {
  practice: CouplePractice;
  partner1Name: string;
  partner2Name: string;
  palette: { bg: string; text: string; accent: string; label: string };
}

function PracticeCard({ practice, partner1Name, partner2Name, palette }: PracticeCardProps) {
  return (
    <View style={[practiceStyles.card, { backgroundColor: palette.bg + '30', borderColor: palette.accent + '30' }]}>
      {/* Header */}
      <View style={practiceStyles.header}>
        <TenderText variant="caption" style={[practiceStyles.eyebrow, { color: palette.label }]}>
          PRACTICE
        </TenderText>
        <TenderText variant="headingS" style={[practiceStyles.name, { color: palette.text }]}>
          {practice.name}
        </TenderText>
        <TenderText variant="caption" style={practiceStyles.frequency}>
          {practice.frequency}
        </TenderText>
      </View>

      {practice.bothPartners ? (
        /* Shared practice — single centered description */
        <TenderText variant="bodySmall" style={practiceStyles.sharedDescription}>
          {practice.description}
        </TenderText>
      ) : (
        /* Split tasks — two columns with partner names as headers */
        <View>
          <TenderText variant="bodySmall" style={practiceStyles.sharedDescription}>
            {practice.description}
          </TenderText>
          <View style={practiceStyles.splitRow}>
            <View style={[practiceStyles.splitCol, { backgroundColor: Colors.couplePartnerALight + '60', borderColor: Colors.couplePartnerA + '30' }]}>
              <TenderText variant="caption" style={[practiceStyles.splitHeader, { color: Colors.couplePartnerA }]}>
                {partner1Name.toUpperCase()}
              </TenderText>
              <TenderText variant="bodySmall" style={practiceStyles.splitTask}>
                {practice.partnerATask ?? ''}
              </TenderText>
            </View>
            <View style={[practiceStyles.splitCol, { backgroundColor: Colors.couplePartnerBLight + '60', borderColor: Colors.couplePartnerB + '30' }]}>
              <TenderText variant="caption" style={[practiceStyles.splitHeader, { color: Colors.couplePartnerB }]}>
                {partner2Name.toUpperCase()}
              </TenderText>
              <TenderText variant="bodySmall" style={practiceStyles.splitTask}>
                {practice.partnerBTask ?? ''}
              </TenderText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

interface PullQuoteProps {
  text: string;
  accentColor: string;
}

function PullQuote({ text, accentColor }: PullQuoteProps) {
  return (
    <View style={[pullQuoteStyles.wrapper, { borderLeftColor: accentColor }]}>
      <TenderText style={[pullQuoteStyles.text, { color: Colors.text }]}>
        {text}
      </TenderText>
    </View>
  );
}

// ─── Tier 3 helper ──────────────────────────────────

/** Convert a CoupleRouteResult into a Tier3DomainData, interpolating partner names.
 *  Handles swap (flips A/B names) and extras (template variables like {shared_values_count}). */
function toTier3(route: CoupleRouteResult, aName: string, bName: string): Tier3DomainData {
  const entry = route.entry;
  // When swap is true, the narrative's {A_name} should map to partner B and vice versa
  const effectiveA = route.swap ? bName : aName;
  const effectiveB = route.swap ? aName : bName;
  const interp = (s: string) => interpolateCouple(s, effectiveA, effectiveB, route.extras);
  return {
    dynamicName: entry.dynamicName,
    lenses: Object.fromEntries(
      Object.entries(entry.lenses).map(([k, v]) => [k, interp(v)])
    ) as Record<string, string>,
    coupleArc: {
      pattern:             interp(entry.coupleArc.pattern),
      eachPartnersWound:   interp(entry.coupleArc.eachPartnersWound),
      theCost:             interp(entry.coupleArc.theCost),
      theInvitation:       interp(entry.coupleArc.theInvitation),
    },
    couplePractice: {
      name:         entry.couplePractice.name,
      description:  interp(entry.couplePractice.description),
      frequency:    entry.couplePractice.frequency,
      bothPartners: entry.couplePractice.bothPartners,
      // When swapped, partner A's task should show under partner B's name and vice versa
      partnerATask: (route.swap ? entry.couplePractice.partnerBTask : entry.couplePractice.partnerATask)
        ? interp((route.swap ? entry.couplePractice.partnerBTask : entry.couplePractice.partnerATask)!)
        : undefined,
      partnerBTask: (route.swap ? entry.couplePractice.partnerATask : entry.couplePractice.partnerBTask)
        ? interp((route.swap ? entry.couplePractice.partnerATask : entry.couplePractice.partnerBTask)!)
        : undefined,
    },
    coupleInvitation: interp(entry.coupleInvitation),
  };
}

// ─── Component ──────────────────────────────────────

export default function CoupleMatrix({
  partner1,
  partner2,
  partner1Name = 'You',
  partner2Name = 'Partner',
  weareData,
  rfasData,
  dyadicScores,
}: CoupleMatrixProps) {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [activeLens, setActiveLens] = useState<LensType>('soulful');

  const handleToggle = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDomain(prev => {
      if (prev === id) return null;
      // Reset lens to soulful when opening a new domain
      setActiveLens('soulful');
      return id;
    });
  }, []);

  const domains = useMemo<CoupleDomain[]>(() => {
    const result: CoupleDomain[] = [];
    const a = partner1;
    const b = partner2;
    const aName = partner1Name;
    const bName = partner2Name;

    // DOMAIN 1: Attachment
    if (a.ecrr && b.ecrr) {
      const pairing = generateAttachmentPairing({
        aStyle: a.ecrr.attachmentStyle,
        bStyle: b.ecrr.attachmentStyle,
        aAnxiety: a.ecrr.anxietyScore,
        bAnxiety: b.ecrr.anxietyScore,
        aAvoidance: a.ecrr.avoidanceScore,
        bAvoidance: b.ecrr.avoidanceScore,
      });
      const attachRoute = routeAttachmentDynamic(a, b);
      result.push({
        id: 'attachment',
        title: 'How you seek closeness \u2014 together',
        color: 'foundation',
        confidence: 'high',
        partner1Cells: [
          { label: 'Style', value: Labels.getAttachmentLabel(a.ecrr.attachmentStyle) },
          { label: 'Anxiety', value: a.ecrr.anxietyScore.toFixed(1) },
        ],
        partner2Cells: [
          { label: 'Style', value: Labels.getAttachmentLabel(b.ecrr.attachmentStyle) },
          { label: 'Anxiety', value: b.ecrr.anxietyScore.toFixed(1) },
        ],
        centerLabel: pairing.centerLabel,
        narrative: pairing.narrative,
        practice: pairing.practice,
        instruments: ['ECR-R'],
        tier3: attachRoute ? toTier3(attachRoute, aName, bName) : undefined,
      });
    }

    // DOMAIN 2: Personality
    if (a.ipip && b.ipip) {
      const adp = a.ipip.domainPercentiles || {};
      const bdp = b.ipip.domainPercentiles || {};
      const traits = ['N', 'E', 'O', 'A', 'C'];
      const traitNames: Record<string, string> = { N: 'Sensitivity', E: 'Social energy', O: 'Openness', A: 'Warmth', C: 'Structure' };
      let biggestDiff = 0;
      let diffTrait = 'E';
      for (const t of traits) {
        const diff = Math.abs((adp[t] ?? 50) - (bdp[t] ?? 50));
        if (diff > biggestDiff) { biggestDiff = diff; diffTrait = t; }
      }

      result.push({
        id: 'personality',
        title: 'Who you are in love \u2014 together',
        color: 'instrument',
        confidence: 'high',
        partner1Cells: [
          { label: 'Top trait', value: Labels.getPercentileLabel(Math.max(adp.E ?? 50, adp.A ?? 50)) },
          { label: 'Sensitivity', value: `${Math.round(adp.N ?? 50)}th` },
        ],
        partner2Cells: [
          { label: 'Top trait', value: Labels.getPercentileLabel(Math.max(bdp.E ?? 50, bdp.A ?? 50)) },
          { label: 'Sensitivity', value: `${Math.round(bdp.N ?? 50)}th` },
        ],
        centerLabel: biggestDiff > 30 ? `${traitNames[diffTrait]}: ${Math.round(biggestDiff)}pt gap` : 'Similar profiles',
        narrative: biggestDiff > 30
          ? `Your biggest personality difference is in ${traitNames[diffTrait].toLowerCase()} (${Math.round(biggestDiff)} percentile points apart). This isn't a flaw \u2014 it's where the creative tension lives. Differences in ${traitNames[diffTrait].toLowerCase()} mean you see the world differently at a fundamental level.`
          : `Your personality profiles are remarkably similar. You likely understand each other intuitively. The risk: shared blind spots. What neither of you sees, nobody catches.`,
        instruments: ['IPIP Big Five'],
      });
    }

    // DOMAIN 3: Emotional Intelligence
    if (a.sseit && b.sseit) {
      const asn = a.sseit.subscaleNormalized || {};
      const bsn = b.sseit.subscaleNormalized || {};
      const aPerc = asn.perception ?? 50;
      const bPerc = bsn.perception ?? 50;
      const bothHigh = aPerc >= 70 && bPerc >= 70;
      const oneHigh = (aPerc >= 70) !== (bPerc >= 70);

      result.push({
        id: 'eq',
        title: 'How you read the room \u2014 together',
        color: 'navigation',
        confidence: a.dsir ? 'high' : 'emerging',
        partner1Cells: [
          { label: 'EQ Total', value: `${Math.round(a.sseit.totalNormalized ?? 50)}` },
          { label: 'Perception', value: `${Math.round(aPerc)}` },
        ],
        partner2Cells: [
          { label: 'EQ Total', value: `${Math.round(b.sseit.totalNormalized ?? 50)}` },
          { label: 'Perception', value: `${Math.round(bPerc)}` },
        ],
        centerLabel: bothHigh ? 'Shared strength' : oneHigh ? 'One reads, one acts' : 'Building together',
        narrative: bothHigh
          ? 'You both have strong emotional perception. You sense shifts in each other before words arrive. The gift: deep attunement. The risk: two highly perceptive people can create a feedback loop where every micro-expression gets interpreted and responded to.'
          : oneHigh
            ? 'One of you reads the emotional field more naturally than the other. This creates an asymmetry: the reader often carries the emotional labor, while the other may not even know there\'s something to read.'
            : 'You\'re both building your emotional intelligence together. This means you have room to grow in the same direction \u2014 which is actually easier than one person being far ahead of the other.',
        instruments: ['SSEIT', 'DSI-R'],
      });
    }

    // DOMAIN 4: Differentiation
    if (a.dsir && b.dsir) {
      const aDiff = a.dsir.totalNormalized ?? 50;
      const bDiff = b.dsir.totalNormalized ?? 50;
      const aFusion = a.dsir.subscaleScores?.fusionWithOthers?.normalized ?? 50;
      const bFusion = b.dsir.subscaleScores?.fusionWithOthers?.normalized ?? 50;
      const bothHighFusion = aFusion < 40 && bFusion < 40;

      result.push({
        id: 'differentiation',
        title: 'How you hold your ground \u2014 together',
        color: 'stance',
        confidence: 'high',
        partner1Cells: [
          { label: 'Differentiation', value: `${Math.round(aDiff)}` },
          { label: 'Fusion', value: Labels.getFusionLabel(aFusion) },
        ],
        partner2Cells: [
          { label: 'Differentiation', value: `${Math.round(bDiff)}` },
          { label: 'Fusion', value: Labels.getFusionLabel(bFusion) },
        ],
        centerLabel: bothHighFusion ? 'Enmeshment risk' : Math.abs(aDiff - bDiff) > 20 ? 'Asymmetric' : 'Balanced',
        narrative: bothHighFusion
          ? 'Both of you tend to merge in closeness. The love is intense but the boundaries blur. When both partners lose themselves in the relationship, there\'s no one left to hold the frame.'
          : Math.abs(aDiff - bDiff) > 20
            ? `One of you holds stronger boundaries (${Math.round(Math.max(aDiff, bDiff))}) while the other tends to merge more (${Math.round(Math.min(aDiff, bDiff))}). This asymmetry creates a specific dynamic: the more differentiated partner can feel distant, the less differentiated partner can feel abandoned.`
            : 'Your differentiation levels are similar, which means you\'re working from the same relational foundation. You can grow this capacity together.',
        instruments: ['DSI-R', 'ECR-R'],
      });
    }

    // DOMAIN 5: Conflict
    if (a.dutch && b.dutch) {
      const aSub = a.dutch.subscaleScores || {};
      const bSub = b.dutch.subscaleScores || {};
      const pairing = generateConflictPairing({
        aPrimary: a.dutch.primaryStyle,
        bPrimary: b.dutch.primaryStyle,
        aForcing: aSub.forcing?.mean ?? 2.5,
        bForcing: bSub.forcing?.mean ?? 2.5,
        aAvoiding: aSub.avoiding?.mean ?? 2.5,
        bAvoiding: bSub.avoiding?.mean ?? 2.5,
        aYielding: aSub.yielding?.mean ?? 2.5,
        bYielding: bSub.yielding?.mean ?? 2.5,
        aProblemSolving: aSub.problemSolving?.mean ?? 2.5,
        bProblemSolving: bSub.problemSolving?.mean ?? 2.5,
      });
      const conflictRoute = routeConflictDynamic(a, b);
      result.push({
        id: 'conflict',
        title: 'How you navigate conflict \u2014 together',
        color: 'conflict',
        confidence: 'high',
        partner1Cells: [
          { label: 'Primary', value: Labels.getConflictStyleLabel(a.dutch.primaryStyle) },
          { label: 'Secondary', value: Labels.getConflictStyleLabel(a.dutch.secondaryStyle) },
        ],
        partner2Cells: [
          { label: 'Primary', value: Labels.getConflictStyleLabel(b.dutch.primaryStyle) },
          { label: 'Secondary', value: Labels.getConflictStyleLabel(b.dutch.secondaryStyle) },
        ],
        centerLabel: pairing.interactionType,
        narrative: pairing.narrative,
        practice: pairing.practice,
        instruments: ['DUTCH'],
        tier3: conflictRoute ? toTier3(conflictRoute, aName, bName) : undefined,
      });
    }

    // DOMAIN 6: Values
    if (a.values && b.values) {
      const aTop = a.values.top5Values?.[0] ?? '\u2014';
      const bTop = b.values.top5Values?.[0] ?? '\u2014';
      const sharedValues = (a.values.top5Values || []).filter(
        (v: string) => (b.values.top5Values || []).includes(v)
      );

      const valuesRoute = routeValuesDynamic(a, b);
      result.push({
        id: 'values',
        title: 'What matters most \u2014 together',
        color: 'compass',
        confidence: 'high',
        partner1Cells: [
          { label: 'Top value', value: aTop },
          { label: '#2', value: a.values.top5Values?.[1] ?? '\u2014' },
        ],
        partner2Cells: [
          { label: 'Top value', value: bTop },
          { label: '#2', value: b.values.top5Values?.[1] ?? '\u2014' },
        ],
        centerLabel: sharedValues.length > 0 ? `Shared: ${sharedValues[0]}` : 'Different priorities',
        narrative: sharedValues.length >= 2
          ? `You share ${sharedValues.length} core values: ${sharedValues.join(', ')}. This alignment is powerful \u2014 it means you're rowing in the same direction. The growth edge is in the values you don't share: that's where the interesting conversations live.`
          : sharedValues.length === 1
            ? `You share one core value: ${sharedValues[0]}. This is your common ground. The differences aren't problems \u2014 they're invitations to understand what makes your partner tick at the deepest level.`
            : 'Your top values are different. This isn\'t incompatibility \u2014 it\'s creative tension. The question isn\'t "do we value the same things?" but "can we honor what each of us values?"',
        instruments: ['Values'],
        tier3: valuesRoute ? toTier3(valuesRoute, aName, bName) : undefined,
      });
    }

    // DOMAIN 7: The Field (WEARE data — couple only)
    if (weareData || rfasData) {
      const fieldNarrative = generateFieldNarrative({
        rfasTotalMean: rfasData?.totalMean,
        fieldRecognition: rfasData?.fieldRecognition,
        creativeTension: rfasData?.creativeTension,
        presenceAttunement: rfasData?.presenceAttunement,
        emergentOrientation: rfasData?.emergentOrientation,
        resonance: weareData?.resonance,
        emergenceDirection: weareData?.emergenceDirection,
        bottleneck: weareData?.bottleneck,
        movementPhase: weareData?.movementPhase,
      });
      result.push({
        id: 'field',
        title: 'The space between you',
        color: 'field',
        confidence: weareData ? 'high' : 'emerging',
        partner1Cells: [
          { label: 'Resonance', value: weareData?.resonance != null ? `${Math.round(weareData.resonance)}` : '\u2014' },
          { label: 'Direction', value: weareData?.emergenceDirection != null ? `${weareData.emergenceDirection > 0 ? '+' : ''}${weareData.emergenceDirection.toFixed(1)}` : '\u2014' },
        ],
        partner2Cells: [
          { label: 'Bottleneck', value: weareData?.bottleneck ?? 'None' },
          { label: 'Phase', value: weareData?.movementPhase ?? '\u2014' },
        ],
        centerLabel: weareData?.movementPhase ?? 'Sensing',
        narrative: fieldNarrative.body,
        instruments: fieldNarrative.instruments,
      });
    }

    // ─── COUPLE ASSESSMENTS (RDAS, CSI-16, DCI) ─────────
    // These show real data if completed, or placeholder rows if not.

    const hasRDAS = dyadicScores?.rdas?.partnerA && dyadicScores?.rdas?.partnerB;
    const hasCSI = dyadicScores?.csi16?.partnerA && dyadicScores?.csi16?.partnerB;
    const hasDCI = dyadicScores?.dci?.partnerA && dyadicScores?.dci?.partnerB;

    // DOMAIN 8: Relationship Satisfaction (CSI-16)
    if (hasCSI) {
      const csiA = dyadicScores!.csi16.partnerA;
      const csiB = dyadicScores!.csi16.partnerB;
      result.push({
        id: 'satisfaction',
        title: 'How satisfied you each feel',
        color: 'foundation',
        confidence: 'high',
        partner1Cells: [
          { label: 'Satisfaction', value: `${csiA.total ?? '\u2014'}` },
          { label: 'Level', value: csiA.satisfactionLevel ?? '\u2014' },
        ],
        partner2Cells: [
          { label: 'Satisfaction', value: `${csiB.total ?? '\u2014'}` },
          { label: 'Level', value: csiB.satisfactionLevel ?? '\u2014' },
        ],
        centerLabel: csiA.distressed || csiB.distressed ? 'Needs care' : 'Thriving',
        narrative: `Your satisfaction scores reveal how each of you experiences the relationship right now. ${aName} scores ${csiA.total} and ${bName} scores ${csiB.total}. ${csiA.distressed || csiB.distressed ? 'One or both of you may be feeling strain \u2014 this is an invitation to tend to the space between you.' : 'You both feel a sense of warmth and contentment in the relationship.'}`,
        instruments: ['CSI-16'],
      });
    } else {
      result.push({
        id: 'satisfaction',
        title: 'How satisfied you each feel',
        color: 'foundation',
        confidence: 'low',
        partner1Cells: [
          { label: 'Satisfaction', value: '\u2014' },
          { label: 'Level', value: '\u2014' },
        ],
        partner2Cells: [
          { label: 'Satisfaction', value: '\u2014' },
          { label: 'Level', value: '\u2014' },
        ],
        centerLabel: 'Awaiting',
        narrative: 'Complete the Relationship Closeness assessment together to see how satisfied each of you feels in the relationship. This unlocks insights about your shared contentment and areas that may need tending.',
        instruments: ['CSI-16'],
      });
    }

    // DOMAIN 9: Dyadic Adjustment (RDAS)
    if (hasRDAS) {
      const rdA = dyadicScores!.rdas.partnerA;
      const rdB = dyadicScores!.rdas.partnerB;
      result.push({
        id: 'adjustment',
        title: 'How well you adjust together',
        color: 'compass',
        confidence: 'high',
        partner1Cells: [
          { label: 'Total', value: `${rdA.total ?? '\u2014'}` },
          { label: 'Consensus', value: `${rdA.consensus ?? '\u2014'}` },
        ],
        partner2Cells: [
          { label: 'Total', value: `${rdB.total ?? '\u2014'}` },
          { label: 'Consensus', value: `${rdB.consensus ?? '\u2014'}` },
        ],
        centerLabel: rdA.distressLevel === 'low' && rdB.distressLevel === 'low' ? 'Well-adjusted' : 'Growing',
        narrative: `The Revised Dyadic Adjustment Scale maps how you navigate consensus, satisfaction, and cohesion as a couple. ${aName} scores ${rdA.total} overall while ${bName} scores ${rdB.total}. ${rdA.distressLevel !== 'low' || rdB.distressLevel !== 'low' ? 'Some areas show room for growth \u2014 which is completely normal and healthy.' : 'You show strong alignment across the key dimensions of partnership.'}`,
        instruments: ['RDAS'],
      });
    } else {
      result.push({
        id: 'adjustment',
        title: 'How well you adjust together',
        color: 'compass',
        confidence: 'low',
        partner1Cells: [
          { label: 'Total', value: '\u2014' },
          { label: 'Consensus', value: '\u2014' },
        ],
        partner2Cells: [
          { label: 'Total', value: '\u2014' },
          { label: 'Consensus', value: '\u2014' },
        ],
        centerLabel: 'Awaiting',
        narrative: 'Complete the Relationship Quality assessment together to see how you navigate consensus, satisfaction, and cohesion as a couple. This assessment reveals the structural health of your partnership.',
        instruments: ['RDAS'],
      });
    }

    // DOMAIN 10: Dyadic Coping (DCI)
    if (hasDCI) {
      const dcA = dyadicScores!.dci.partnerA;
      const dcB = dyadicScores!.dci.partnerB;
      result.push({
        id: 'coping',
        title: 'How you cope with stress together',
        color: 'navigation',
        confidence: 'high',
        partner1Cells: [
          { label: 'Supportive', value: `${dcA.supportiveBySelf ?? '\u2014'}` },
          { label: 'Stress comm.', value: `${dcA.stressCommunicationBySelf ?? '\u2014'}` },
        ],
        partner2Cells: [
          { label: 'Supportive', value: `${dcB.supportiveBySelf ?? '\u2014'}` },
          { label: 'Stress comm.', value: `${dcB.stressCommunicationBySelf ?? '\u2014'}` },
        ],
        centerLabel: (dcA.totalPositive ?? 0) > 3 && (dcB.totalPositive ?? 0) > 3 ? 'Strong team' : 'Building',
        narrative: `The Dyadic Coping Inventory reveals how you support each other under stress. ${aName}'s supportive coping is ${dcA.supportiveBySelf ?? 'unknown'} while ${bName}'s is ${dcB.supportiveBySelf ?? 'unknown'}. ${(dcA.negativeBySelf ?? 0) > 2.5 || (dcB.negativeBySelf ?? 0) > 2.5 ? 'Watch for negative coping patterns \u2014 they can erode trust over time.' : 'Your coping patterns show care and mutual support.'}`,
        instruments: ['DCI'],
      });
    } else {
      result.push({
        id: 'coping',
        title: 'How you cope with stress together',
        color: 'navigation',
        confidence: 'low',
        partner1Cells: [
          { label: 'Supportive', value: '\u2014' },
          { label: 'Stress comm.', value: '\u2014' },
        ],
        partner2Cells: [
          { label: 'Supportive', value: '\u2014' },
          { label: 'Stress comm.', value: '\u2014' },
        ],
        centerLabel: 'Awaiting',
        narrative: 'Complete the Stress & Coping assessment together to understand how you support each other under stress. This reveals your shared coping strengths and blind spots.',
        instruments: ['DCI'],
      });
    }

    return result;
  }, [partner1, partner2, partner1Name, partner2Name, weareData, rfasData, dyadicScores]);

  // Couple invitation
  const invitation = useMemo(() => {
    if (!partner1.ecrr || !partner2.ecrr) return null;
    return generateCoupleInvitation({
      aStyle: partner1.ecrr.attachmentStyle,
      bStyle: partner2.ecrr.attachmentStyle,
      aAnxiety: partner1.ecrr.anxietyScore,
      bAnxiety: partner2.ecrr.anxietyScore,
      aAvoidance: partner1.ecrr.avoidanceScore,
      bAvoidance: partner2.ecrr.avoidanceScore,
    });
  }, [partner1.ecrr, partner2.ecrr]);

  if (domains.length === 0) {
    return (
      <View style={styles.emptyState}>
        <TenderText variant="headingS" color={Colors.text} align="center">
          Our Matrix
        </TenderText>
        <TenderText variant="body" color={Colors.textSecondary} align="center" style={{ marginTop: Spacing.sm }}>
          Both partners need at least one shared assessment to see the couple matrix.
        </TenderText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TenderText variant="caption" style={styles.headerLabel}>
          YOUR COUPLE MATRIX
        </TenderText>
        <TenderText variant="bodySmall" color={Colors.textSecondary} align="center">
          How your two profiles create the dance between you
        </TenderText>
      </View>

      {/* Partner labels */}
      <View style={styles.partnerLabelRow}>
        <View style={[styles.partnerLabel, { backgroundColor: Colors.couplePartnerALight }]}>
          <TenderText variant="caption" style={{ color: Colors.couplePartnerA, fontSize: 10 }}>
            {partner1Name.toUpperCase()}
          </TenderText>
        </View>
        <View style={[styles.partnerLabel, { backgroundColor: Colors.couplePartnerBLight }]}>
          <TenderText variant="caption" style={{ color: Colors.couplePartnerB, fontSize: 10 }}>
            {partner2Name.toUpperCase()}
          </TenderText>
        </View>
      </View>

      {/* Domain rows */}
      {domains.map((domain) => {
        const palette = MATRIX_COLORS[domain.color];
        const isExpanded = expandedDomain === domain.id;
        const confStyle = CONFIDENCE_COLORS[domain.confidence];
        const hasTier3 = Boolean(domain.tier3);

        return (
          <TouchableOpacity
            key={domain.id}
            activeOpacity={0.7}
            onPress={() => handleToggle(domain.id)}
            style={[styles.domainCard, { borderColor: palette.accent + '40' }]}
          >
            {/* Title row */}
            <View style={styles.domainHeader}>
              <View style={[styles.colorDot, { backgroundColor: palette.bg }]} />
              <TenderText variant="headingS" style={{ color: palette.text, flex: 1 }}>
                {domain.title}
              </TenderText>
              {hasTier3 && (
                <View style={[styles.tier3Badge, { backgroundColor: Colors.accentGold + '20', borderColor: Colors.accentGold + '50' }]}>
                  <TenderText variant="caption" style={{ color: Colors.accentGold, fontSize: 8, letterSpacing: 1 }}>
                    DEEP
                  </TenderText>
                </View>
              )}
              <View style={[styles.confBadge, { backgroundColor: confStyle.bg }]}>
                <TenderText variant="caption" style={{ color: confStyle.text, fontSize: 9 }}>
                  {confStyle.label}
                </TenderText>
              </View>
            </View>

            {/* Side-by-side cells */}
            <View style={styles.sideRow}>
              {/* Partner A cells */}
              <View style={styles.partnerCol}>
                {domain.partner1Cells.map((c, i) => (
                  <View key={i} style={[styles.miniCell, { backgroundColor: Colors.couplePartnerALight + '80' }]}>
                    <TenderText variant="caption" style={styles.miniLabel}>{c.label}</TenderText>
                    <TenderText variant="headingS" style={[styles.miniScore, { color: Colors.couplePartnerA }]}>
                      {c.value}
                    </TenderText>
                  </View>
                ))}
              </View>

              {/* Center dynamic label */}
              <View style={[styles.centerCol, { backgroundColor: palette.bg + '40' }]}>
                <TenderText variant="caption" style={[styles.centerText, { color: palette.text }]}>
                  {hasTier3 ? domain.tier3!.dynamicName : domain.centerLabel}
                </TenderText>
              </View>

              {/* Partner B cells */}
              <View style={styles.partnerCol}>
                {domain.partner2Cells.map((c, i) => (
                  <View key={i} style={[styles.miniCell, { backgroundColor: Colors.couplePartnerBLight + '80' }]}>
                    <TenderText variant="caption" style={styles.miniLabel}>{c.label}</TenderText>
                    <TenderText variant="headingS" style={[styles.miniScore, { color: Colors.couplePartnerB }]}>
                      {c.value}
                    </TenderText>
                  </View>
                ))}
              </View>
            </View>

            {/* ── Expanded panel ── */}
            {isExpanded && (
              <View style={[styles.narrativePanel, { backgroundColor: palette.bg + '20', borderTopColor: palette.accent + '30' }]}>

                {hasTier3 ? (
                  /* ── Tier 3 expanded content ── */
                  <Tier3Panel
                    tier3={domain.tier3!}
                    palette={palette}
                    activeLens={activeLens}
                    onLensChange={setActiveLens}
                    partner1Name={partner1Name}
                    partner2Name={partner2Name}
                    instruments={domain.instruments}
                  />
                ) : (
                  /* ── Legacy narrative + optional practice ── */
                  <>
                    <TenderText variant="body" style={{ color: Colors.text, lineHeight: 24 }}>
                      {domain.narrative}
                    </TenderText>
                    {domain.practice && (
                      <View style={[styles.practiceBox, { backgroundColor: palette.bg + '50' }]}>
                        <TenderText variant="caption" style={{ color: palette.label, fontSize: 9, letterSpacing: 1.5 }}>
                          PRACTICE
                        </TenderText>
                        <TenderText variant="bodySmall" style={{ color: palette.text, fontStyle: 'italic', lineHeight: 20 }}>
                          {domain.practice}
                        </TenderText>
                      </View>
                    )}
                    <View style={styles.instRow}>
                      {domain.instruments.map((inst, i) => (
                        <View key={i} style={[styles.instChip, { backgroundColor: palette.bg + '60' }]}>
                          <TenderText variant="caption" style={{ color: palette.text, fontSize: 9 }}>{inst}</TenderText>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Couple Invitation */}
      {invitation && (
        <MatrixInvitation text={invitation} label="Your couple invitation" />
      )}
    </View>
  );
}

// ─── Tier3Panel ──────────────────────────────────────

interface Tier3PanelProps {
  tier3: Tier3DomainData;
  palette: { bg: string; text: string; accent: string; label: string };
  activeLens: LensType;
  onLensChange: (lens: LensType) => void;
  partner1Name: string;
  partner2Name: string;
  instruments: string[];
}

function Tier3Panel({
  tier3,
  palette,
  activeLens,
  onLensChange,
  partner1Name,
  partner2Name,
  instruments,
}: Tier3PanelProps) {
  const lensNarrative = tier3.lenses[activeLens] ?? tier3.lenses['soulful'] ?? '';

  return (
    <View style={tier3Styles.container}>

      {/* Lens picker */}
      <View style={tier3Styles.lensSection}>
        <TenderText variant="caption" style={[tier3Styles.sectionEyebrow, { color: palette.label }]}>
          VIEW THROUGH A LENS
        </TenderText>
        <LensPicker activeLens={activeLens} onLensChange={onLensChange} />
      </View>

      {/* Lens narrative */}
      <TenderText variant="body" style={tier3Styles.lensNarrative}>
        {lensNarrative}
      </TenderText>

      {/* Divider */}
      <View style={[tier3Styles.divider, { backgroundColor: palette.accent + '25' }]} />

      {/* Couple arc */}
      <View style={tier3Styles.section}>
        <TenderText variant="caption" style={[tier3Styles.sectionEyebrow, { color: palette.label }]}>
          THE ARC
        </TenderText>
        <CoupleArcFlow arc={tier3.coupleArc} palette={palette} />
      </View>

      {/* Divider */}
      <View style={[tier3Styles.divider, { backgroundColor: palette.accent + '25' }]} />

      {/* Practice card */}
      <View style={tier3Styles.section}>
        <PracticeCard
          practice={tier3.couplePractice}
          partner1Name={partner1Name}
          partner2Name={partner2Name}
          palette={palette}
        />
      </View>

      {/* Divider */}
      <View style={[tier3Styles.divider, { backgroundColor: palette.accent + '25' }]} />

      {/* Invitation pull quote */}
      <View style={tier3Styles.section}>
        <TenderText variant="caption" style={[tier3Styles.sectionEyebrow, { color: palette.label }]}>
          YOUR INVITATION
        </TenderText>
        <PullQuote text={tier3.coupleInvitation} accentColor={palette.accent} />
      </View>

      {/* Instruments */}
      <View style={styles.instRow}>
        {instruments.map((inst, i) => (
          <View key={i} style={[styles.instChip, { backgroundColor: palette.bg + '60' }]}>
            <TenderText variant="caption" style={{ color: palette.text, fontSize: 9 }}>{inst}</TenderText>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  headerLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: Colors.textMuted,
    fontFamily: 'JosefinSans_500Medium',
  },
  partnerLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  partnerLabel: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  domainCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    ...Shadows.subtle,
  },
  domainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tier3Badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  confBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  sideRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: 4,
  },
  partnerCol: {
    flex: 2,
    gap: 4,
  },
  miniCell: {
    borderRadius: BorderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
  },
  miniLabel: {
    fontSize: 9,
    letterSpacing: 0.5,
    color: Colors.textMuted,
    fontFamily: 'JosefinSans_500Medium',
  },
  miniScore: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 14,
  },
  centerCol: {
    flex: 2,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  centerText: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'JosefinSans_500Medium',
    letterSpacing: 0.3,
  },
  narrativePanel: {
    padding: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  practiceBox: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  instRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  instChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
});

// ─── Tier 3 panel styles ─────────────────────────────

const tier3Styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  lensSection: {
    gap: Spacing.xs,
  },
  sectionEyebrow: {
    fontSize: 9,
    letterSpacing: 1.8,
    fontFamily: 'JosefinSans_500Medium',
  },
  lensNarrative: {
    color: Colors.text,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    marginHorizontal: -Spacing.md,
  },
  section: {
    gap: Spacing.sm,
  },
});

// ─── Arc flow styles ─────────────────────────────────

const arcStyles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepButton: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  stepLabel: {
    fontSize: 9,
    fontFamily: 'JosefinSans_500Medium',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  connector: {
    height: 1.5,
    width: 16,
    marginBottom: 14, // vertically align with dot center
  },
  stepContent: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  stepContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepContentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepContentLabel: {
    fontSize: 9,
    fontFamily: 'JosefinSans_500Medium',
    letterSpacing: 1.5,
  },
  stepContentText: {
    color: Colors.text,
    lineHeight: 22,
  },
});

// ─── Practice card styles ────────────────────────────

const practiceStyles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  header: {
    gap: 3,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 1.8,
    fontFamily: 'JosefinSans_500Medium',
  },
  name: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 16,
  },
  frequency: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'JosefinSans_300Light',
    letterSpacing: 0.3,
  },
  sharedDescription: {
    color: Colors.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  splitRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  splitCol: {
    flex: 1,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: Spacing.sm,
    gap: 4,
  },
  splitHeader: {
    fontSize: 9,
    fontFamily: 'JosefinSans_500Medium',
    letterSpacing: 1,
  },
  splitTask: {
    color: Colors.text,
    lineHeight: 18,
  },
});

// ─── Pull quote styles ───────────────────────────────

const pullQuoteStyles = StyleSheet.create({
  wrapper: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 17,
    lineHeight: 26,
    fontStyle: 'italic',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
