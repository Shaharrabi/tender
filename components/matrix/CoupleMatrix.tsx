/**
 * CoupleMatrix — "Our Matrix" for the couple portal.
 *
 * Side-by-side comparison of both partners' matrix data with
 * a center column showing the relationship dynamic.
 * Full WEARE data shows here (not in individual mode per Addendum 1).
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
import { MATRIX_COLORS, CONFIDENCE_COLORS, type MatrixColorKey, type ConfidenceLevel } from './constants/matrix-colors';
import * as Labels from './constants/matrix-labels';
import {
  generateAttachmentPairing,
  generateConflictPairing,
  generateCoupleInvitation,
} from './narratives/couple-narratives';
import { generateFieldNarrative } from './narratives/field';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

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
}

// ─── Component ──────────────────────────────────────

export default function CoupleMatrix({
  partner1,
  partner2,
  partner1Name = 'You',
  partner2Name = 'Partner',
  weareData,
  rfasData,
}: CoupleMatrixProps) {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDomain(prev => prev === id ? null : id);
  }, []);

  const domains = useMemo<CoupleDomain[]>(() => {
    const result: CoupleDomain[] = [];
    const a = partner1;
    const b = partner2;

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
      });
    }

    // DOMAIN 2: Personality
    if (a.ipip && b.ipip) {
      const adp = a.ipip.domainPercentiles || {};
      const bdp = b.ipip.domainPercentiles || {};
      // Find shared trait or biggest difference
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
      });
    }

    // DOMAIN 6: Values
    if (a.values && b.values) {
      const aTop = a.values.top5Values?.[0] ?? '\u2014';
      const bTop = b.values.top5Values?.[0] ?? '\u2014';
      const sharedValues = (a.values.top5Values || []).filter(
        (v: string) => (b.values.top5Values || []).includes(v)
      );

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

    return result;
  }, [partner1, partner2, weareData, rfasData]);

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
                  {domain.centerLabel}
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

            {/* Expanded narrative */}
            {isExpanded && (
              <View style={[styles.narrativePanel, { backgroundColor: palette.bg + '20', borderTopColor: palette.accent + '30' }]}>
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
