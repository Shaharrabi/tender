/**
 * TenderMatrix — Individual "Your Matrix" main container.
 *
 * The overview layer: all assessment results organized into a meaningful
 * relational architecture, not as separate test scores but as an integrated
 * story of who you are in love.
 *
 * Data sources (Addendum 1 — reconciled with real pipeline):
 *   - Raw assessment scores from allScores
 *   - Composite scores from portrait.compositeScores
 *   - No WEARE in individual mode (couple-only per Addendum 1)
 *
 * Confidence layer (Addendum 2):
 *   - high: 3+ source instruments converge
 *   - emerging: 2 sources
 *   - low: 1 source or derived only
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, findNodeHandle } from 'react-native';
import { useRouter } from 'expo-router';
import TenderText from '@/components/ui/TenderText';
import MatrixDomain, { type MatrixDomainData } from './MatrixDomain';
import MatrixInvitation from './MatrixInvitation';
import IntegrationPanel from './IntegrationPanel';
import { generateFoundationNarrative } from './narratives/foundation';
import { generateInstrumentNarrative } from './narratives/instrument';
import { generateNavigationNarrative } from './narratives/navigation';
import { generateStanceNarrative } from './narratives/stance';
import { generateConflictNarrative } from './narratives/conflict';
import { generateCompassNarrative } from './narratives/compass';
import { generateFieldNarrative } from './narratives/field';
import { generateOneInvitation } from './narratives/invitation';
import * as Labels from './constants/matrix-labels';
import type { ConfidenceLevel } from './constants/matrix-colors';
import { Colors, Spacing, BorderRadius, FontFamilies, Shadows } from '@/constants/theme';
import type { IndividualPortrait } from '@/types/portrait';
import type { InterventionCategory, Intervention } from '@/types/intervention';
import { generateIntegration, toIntegrationScores, type DomainId } from '@/utils/integration-engine';
import { getAllExercises } from '@/utils/interventions/registry';

// ─── Learn Mode types & constants ────────────────────

type LearnMode = 'off' | 'intro' | 'strengths' | 'growth' | 'full';

const STRENGTH_THRESHOLD = 65;
const GROWTH_THRESHOLD = 40;
const STRENGTH_COLOR = '#6B9080'; // sage green
const GROWTH_COLOR = '#B5593A';   // warm blush

/** Maps composite score keys to matrix domain IDs and which cell labels they affect. */
const COMPOSITE_TO_DOMAIN: Record<string, { domainId: string; cellLabels: string[] }> = {
  attachmentSecurity: { domainId: 'foundation', cellLabels: ['Attachment', 'Anxiety', 'Avoidance', 'Window'] },
  emotionalIntelligence: { domainId: 'navigation', cellLabels: ['Perception', 'Self-regulation', 'Other-support', 'Emotional use'] },
  relationalAwareness: { domainId: 'navigation', cellLabels: ['Perception', 'Other-support'] },
  regulationScore: { domainId: 'instrument', cellLabels: ['Sensitivity', 'Warmth'] },
  differentiation: { domainId: 'stance', cellLabels: ['Differentiation', 'Reactivity', 'I-position', 'Fusion'] },
  selfLeadership: { domainId: 'stance', cellLabels: ['Differentiation', 'I-position'] },
  conflictFlexibility: { domainId: 'conflict', cellLabels: ['Primary style', 'Secondary', 'Yielding', 'Avoiding'] },
  valuesCongruence: { domainId: 'compass', cellLabels: ['Alignment', 'Action score', 'Biggest gap'] },
  fieldAwareness: { domainId: 'field', cellLabels: ['Field awareness', 'Recognition', 'Presence', 'Emergence'] },
};

/** Exercise category mapping for composite scores */
const COMPOSITE_CATEGORIES: Record<string, { categories: InterventionCategory[]; patterns: string[] }> = {
  attachmentSecurity: { categories: ['attachment'], patterns: ['attachment', 'emotional_bids', 'disconnection'] },
  emotionalIntelligence: { categories: ['communication'], patterns: ['empathy', 'emotional_awareness', 'perception'] },
  relationalAwareness: { categories: ['communication', 'attachment'], patterns: ['attunement', 'presence', 'emotional_bids'] },
  regulationScore: { categories: ['regulation'], patterns: ['regulation', 'flooding', 'hyperactivation', 'shutdown'] },
  differentiation: { categories: ['differentiation'], patterns: ['differentiation', 'boundaries', 'fusion'] },
  selfLeadership: { categories: ['differentiation'], patterns: ['protective_patterns', 'differentiation', 'self_awareness'] },
  conflictFlexibility: { categories: ['communication'], patterns: ['conflict', 'repair', 'flooding'] },
  valuesCongruence: { categories: ['values'], patterns: ['values_gap', 'avoidance', 'values'] },
};

const ANALYZED_DOMAINS = [
  'attachmentSecurity', 'emotionalIntelligence', 'differentiation',
  'conflictFlexibility', 'relationalAwareness', 'regulationScore',
  'selfLeadership', 'valuesCongruence',
];

// ─── Props ──────────────────────────────────────────

interface TenderMatrixProps {
  allScores: Record<string, { id: string; scores: any }>;
  portrait: IndividualPortrait;
  scrollViewRef?: React.RefObject<ScrollView>;
}

// ─── Helpers ────────────────────────────────────────

function has(key: string, allScores: Record<string, any>): boolean {
  return !!allScores[key]?.scores;
}

function getConfidence(instruments: string[], allScores: Record<string, any>): ConfidenceLevel {
  const map: Record<string, string> = {
    'ECR-R': 'ecr-r',
    'IPIP Big Five': 'tender-personality-60',
    'SSEIT': 'sseit',
    'DSI-R': 'dsi-r',
    'DUTCH': 'dutch',
    'Values': 'values',
    'RFAS': 'relational-field',
  };
  let count = 0;
  for (const inst of instruments) {
    const key = map[inst];
    if (key && has(key, allScores)) count++;
  }
  // Composites always available if portrait exists
  if (instruments.includes('Window of Tolerance')) count++;
  if (count >= 3) return 'high';
  if (count >= 2) return 'emerging';
  return 'low';
}

// ─── Component ──────────────────────────────────────

export default function TenderMatrix({ allScores, portrait, scrollViewRef }: TenderMatrixProps) {
  const router = useRouter();
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [integrateMode, setIntegrateMode] = useState(false);
  const [selectedBoxes, setSelectedBoxes] = useState<string[]>([]); // "domainId:CellLabel"
  const integrationPanelRef = useRef<View>(null);
  const [learnMode, setLearnMode] = useState<LearnMode>('off');
  const learnPanelRef = useRef<View>(null);

  // Derive selected domains from selected boxes
  const selectedDomains = useMemo<DomainId[]>(() => {
    const domainSet = new Set<DomainId>();
    for (const box of selectedBoxes) {
      const domainId = box.split(':')[0] as DomainId;
      domainSet.add(domainId);
    }
    return Array.from(domainSet);
  }, [selectedBoxes]);

  const handleCellSelect = useCallback((domainId: string, cellLabel: string) => {
    const key = `${domainId}:${cellLabel}`;
    setSelectedBoxes(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      }
      if (prev.length >= 6) return prev; // max 6 cells
      return [...prev, key];
    });
  }, []);

  // Select/deselect all cells in a domain (full-row selection)
  const handleRowSelect = useCallback((domainId: string, cells: { label: string }[]) => {
    setSelectedBoxes(prev => {
      const rowKeys = cells.map(c => `${domainId}:${c.label}`);
      const allSelected = rowKeys.every(k => prev.includes(k));
      if (allSelected) {
        // Deselect entire row
        return prev.filter(k => !k.startsWith(`${domainId}:`));
      }
      // Select entire row (add any not yet selected)
      const newKeys = rowKeys.filter(k => !prev.includes(k));
      const combined = [...prev, ...newKeys];
      return combined.slice(0, 12); // generous limit for full rows
    });
  }, []);

  const handleReset = useCallback(() => {
    setSelectedBoxes([]);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setExpandedDomain(prev => prev === id ? null : id);
  }, []);

  const toggleIntegrateMode = useCallback(() => {
    setIntegrateMode(prev => {
      if (prev) {
        // Exiting integrate mode — clear selections
        setSelectedBoxes([]);
      } else {
        // Entering integrate mode — collapse any expanded domain
        setExpandedDomain(null);
      }
      return !prev;
    });
  }, []);

  // Integration scores (memoized before domains)
  const integrationScores = useMemo(() => toIntegrationScores(allScores), [allScores]);

  // ── Extract raw scores ──
  const ecrr = allScores['ecr-r']?.scores;
  const ipip = allScores['tender-personality-60']?.scores;
  const sseit = allScores['sseit']?.scores;
  const dsir = allScores['dsi-r']?.scores;
  const dutch = allScores['dutch']?.scores;
  const values = allScores['values']?.scores;
  const rfas = allScores['relational-field']?.scores;
  const cs = portrait.compositeScores;

  // ── Build domains ──
  const domains = useMemo<MatrixDomainData[]>(() => {
    const result: MatrixDomainData[] = [];

    // DOMAIN 1: THE FOUNDATION — "How you seek closeness"
    if (ecrr) {
      const narrative = generateFoundationNarrative({
        anxietyScore: ecrr.anxietyScore,
        avoidanceScore: ecrr.avoidanceScore,
        attachmentStyle: ecrr.attachmentStyle,
        windowWidth: cs.windowWidth,
      });
      result.push({
        id: 'foundation',
        title: 'How you seek closeness',
        subtitle: 'The Foundation',
        cells: [
          { label: 'Attachment', score: Labels.getAttachmentLabel(ecrr.attachmentStyle), descriptor: '', color: 'foundation' },
          { label: 'Anxiety', score: Math.round((ecrr.anxietyScore - 1) / 6 * 100), descriptor: Labels.getAnxietyLabel(ecrr.anxietyScore), color: 'foundation' },
          { label: 'Avoidance', score: Math.round((ecrr.avoidanceScore - 1) / 6 * 100), descriptor: Labels.getAvoidanceLabel(ecrr.avoidanceScore), color: 'foundation' },
          { label: 'Window', score: Math.round(cs.windowWidth), descriptor: Labels.getWindowLabel(cs.windowWidth), color: 'foundation' },
        ],
        narrative,
        color: 'foundation',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 2: THE INSTRUMENT — "Who you are in love"
    if (ipip) {
      const dp = ipip.domainPercentiles || {};
      const narrative = generateInstrumentNarrative({
        N: dp.N ?? dp.neuroticism ?? 50,
        E: dp.E ?? dp.extraversion ?? 50,
        O: dp.O ?? dp.openness ?? 50,
        A: dp.A ?? dp.agreeableness ?? 50,
        C: dp.C ?? dp.conscientiousness ?? 50,
        anxietyScore: ecrr?.anxietyScore ?? 3,
        avoidanceScore: ecrr?.avoidanceScore ?? 3,
        fusionNormalized: dsir?.subscaleScores?.fusionWithOthers?.normalized,
      });
      result.push({
        id: 'instrument',
        title: 'Who you are in love',
        subtitle: 'The Instrument',
        cells: [
          { label: 'Sensitivity', score: Math.round(dp.N ?? dp.neuroticism ?? 50), descriptor: Labels.getNeurotLabel(dp.N ?? dp.neuroticism ?? 50), color: 'instrument' },
          { label: 'Social energy', score: Math.round(dp.E ?? dp.extraversion ?? 50), descriptor: Labels.getExtraLabel(dp.E ?? dp.extraversion ?? 50), color: 'instrument' },
          { label: 'Openness', score: Math.round(dp.O ?? dp.openness ?? 50), descriptor: Labels.getOpenLabel(dp.O ?? dp.openness ?? 50), color: 'instrument' },
          { label: 'Warmth', score: Math.round(dp.A ?? dp.agreeableness ?? 50), descriptor: Labels.getAgreeLabel(dp.A ?? dp.agreeableness ?? 50), color: 'instrument' },
        ],
        narrative,
        color: 'instrument',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 3: THE NAVIGATION — "How you read the room"
    if (sseit) {
      const sn = sseit.subscaleNormalized || {};
      const dsirSub = dsir?.subscaleScores || {};
      const narrative = generateNavigationNarrative({
        perception: sn.perception ?? 50,
        managingOwn: sn.managingOwn ?? 50,
        managingOthers: sn.managingOthers ?? 50,
        utilization: sn.utilization ?? 50,
        fusionNormalized: dsirSub.fusionWithOthers?.normalized ?? 50,
        iPosition: dsirSub.iPosition?.normalized ?? 50,
        avoidingMean: dutch?.subscaleScores?.avoiding?.mean,
      });
      result.push({
        id: 'navigation',
        title: 'How you read the room',
        subtitle: 'The Navigation',
        cells: [
          { label: 'Perception', score: Math.round(sn.perception ?? 50), descriptor: Labels.getEQLabel(sn.perception ?? 50), color: 'navigation' },
          { label: 'Self-regulation', score: Math.round(sn.managingOwn ?? 50), descriptor: Labels.getEQLabel(sn.managingOwn ?? 50), color: 'navigation' },
          { label: 'Other-support', score: Math.round(sn.managingOthers ?? 50), descriptor: Labels.getEQLabel(sn.managingOthers ?? 50), color: 'navigation' },
          { label: 'Emotional use', score: Math.round(sn.utilization ?? 50), descriptor: Labels.getEQLabel(sn.utilization ?? 50), color: 'navigation' },
        ],
        narrative,
        color: 'navigation',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 4: THE STANCE — "How you hold your ground"
    if (dsir) {
      const sub = dsir.subscaleScores || {};
      const honestyGap = values?.domainScores?.honesty?.gap;
      const narrative = generateStanceNarrative({
        totalNormalized: dsir.totalNormalized ?? 50,
        emotionalReactivity: sub.emotionalReactivity?.normalized ?? 50,
        iPosition: sub.iPosition?.normalized ?? 50,
        emotionalCutoff: sub.emotionalCutoff?.normalized ?? 50,
        fusionWithOthers: sub.fusionWithOthers?.normalized ?? 50,
        anxietyScore: ecrr?.anxietyScore ?? 3,
        avoidanceScore: ecrr?.avoidanceScore ?? 3,
        honestyGap,
      });
      result.push({
        id: 'stance',
        title: 'How you hold your ground',
        subtitle: 'The Stance',
        cells: [
          { label: 'Differentiation', score: Math.round(dsir.totalNormalized ?? 50), descriptor: Labels.getDiffLabel(dsir.totalNormalized ?? 50), color: 'stance' },
          { label: 'Reactivity', score: Math.round(sub.emotionalReactivity?.normalized ?? 50), descriptor: Labels.getReactivityLabel(sub.emotionalReactivity?.normalized ?? 50), color: 'stance' },
          { label: 'I-position', score: Math.round(sub.iPosition?.normalized ?? 50), descriptor: Labels.getIPosLabel(sub.iPosition?.normalized ?? 50), color: 'stance' },
          { label: 'Fusion', score: Math.round(sub.fusionWithOthers?.normalized ?? 50), descriptor: Labels.getFusionLabel(sub.fusionWithOthers?.normalized ?? 50), color: 'stance' },
        ],
        narrative,
        color: 'stance',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 5: THE CONFLICT — "How you navigate conflict"
    if (dutch) {
      const sub = dutch.subscaleScores || {};
      const dp = ipip?.domainPercentiles || {};
      const narrative = generateConflictNarrative({
        primaryStyle: dutch.primaryStyle,
        secondaryStyle: dutch.secondaryStyle,
        yieldingMean: sub.yielding?.mean ?? 2.5,
        avoidingMean: sub.avoiding?.mean ?? 2.5,
        forcingMean: sub.forcing?.mean ?? 2.5,
        problemSolvingMean: sub.problemSolving?.mean ?? 2.5,
        compromisingMean: sub.compromising?.mean ?? 2.5,
        anxietyScore: ecrr?.anxietyScore ?? 3,
        avoidanceScore: ecrr?.avoidanceScore ?? 3,
        N: dp.N ?? dp.neuroticism,
        honestyImportance: values?.domainScores?.honesty?.importance,
      });
      result.push({
        id: 'conflict',
        title: 'How you navigate conflict',
        subtitle: 'The Conflict',
        cells: [
          { label: 'Primary style', score: Labels.getConflictStyleLabel(dutch.primaryStyle), descriptor: '', color: 'conflict' },
          { label: 'Secondary', score: Labels.getConflictStyleLabel(dutch.secondaryStyle), descriptor: '', color: 'conflict' },
          { label: 'Yielding', score: Math.round(((sub.yielding?.mean ?? 1) - 1) / 4 * 100), descriptor: Labels.getConflictMeanLabel(sub.yielding?.mean ?? 0), color: 'conflict' },
          { label: 'Avoiding', score: Math.round(((sub.avoiding?.mean ?? 1) - 1) / 4 * 100), descriptor: Labels.getConflictMeanLabel(sub.avoiding?.mean ?? 0), color: 'conflict' },
        ],
        narrative,
        color: 'conflict',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 6: THE COMPASS — "What matters most"
    if (values) {
      const ds = values.domainScores || {};
      // Find largest gap
      let largestGapDomain = '';
      let largestGap = 0;
      for (const [domain, scores] of Object.entries(ds)) {
        const s = scores as { gap: number };
        if (s.gap > largestGap) { largestGap = s.gap; largestGapDomain = domain; }
      }
      // Calculate overall alignment
      const gaps = Object.values(ds).map((s: any) => s.gap);
      const avgAlignment = gaps.length > 0
        ? ((gaps.reduce((a: number, g: number) => a + (10 - g), 0) / gaps.length) / 10) * 100
        : 50;

      const narrative = generateCompassNarrative({
        top5Values: values.top5Values || [],
        domainScores: ds,
        avoidanceTendency: values.avoidanceTendency ?? 0,
        balancedTendency: values.balancedTendency ?? 0,
        totalScenarios: (values.actionResponses?.length ?? 0) || 5,
        avoidingMean: dutch?.subscaleScores?.avoiding?.mean,
      });
      result.push({
        id: 'compass',
        title: 'What matters most',
        subtitle: 'The Compass',
        cells: [
          { label: 'Top value', score: (values.top5Values?.[0] || '\u2014'), descriptor: '', color: 'compass' },
          { label: 'Biggest gap', score: largestGapDomain || '\u2014', descriptor: largestGap > 0 ? `${Math.round(largestGap * 10)}% gap` : '', color: 'compass' },
          { label: 'Alignment', score: Math.round(avgAlignment), descriptor: Labels.getValuesAlignmentLabel(avgAlignment), color: 'compass' },
          { label: 'Action score', score: Labels.getActionLabel(values.avoidanceTendency ?? 0, (values.actionResponses?.length ?? 0) || 5), descriptor: '', color: 'compass' },
        ],
        narrative,
        color: 'compass',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 7: THE FIELD — Individual mode (RFAS only, no WEARE per Addendum 1)
    if (rfas) {
      const narrative = generateFieldNarrative({
        rfasTotalMean: rfas.totalMean,
        fieldRecognition: rfas.fieldRecognition,
        creativeTension: rfas.creativeTension,
        presenceAttunement: rfas.presenceAttunement,
        emergentOrientation: rfas.emergentOrientation,
      });
      result.push({
        id: 'field',
        title: 'The space between',
        subtitle: 'The Field',
        cells: [
          { label: 'Field awareness', score: Math.round(((rfas.totalMean ?? 1) - 1) / 6 * 100), descriptor: Labels.getEQLabel((rfas.totalMean ?? 0) / 7 * 100), color: 'field' },
          { label: 'Recognition', score: Math.round(((rfas.fieldRecognition ?? 1) - 1) / 6 * 100), descriptor: Labels.getEQLabel((rfas.fieldRecognition ?? 0) / 7 * 100), color: 'field' },
          { label: 'Presence', score: Math.round(((rfas.presenceAttunement ?? 1) - 1) / 6 * 100), descriptor: Labels.getEQLabel((rfas.presenceAttunement ?? 0) / 7 * 100), color: 'field' },
          { label: 'Emergence', score: Math.round(((rfas.emergentOrientation ?? 1) - 1) / 6 * 100), descriptor: Labels.getEQLabel((rfas.emergentOrientation ?? 0) / 7 * 100), color: 'field' },
        ],
        narrative,
        color: 'field',
        confidence: narrative.instruments.length > 0 ? 'emerging' : 'low',
      });
    }

    return result;
  }, [ecrr, ipip, sseit, dsir, dutch, values, rfas, cs, allScores]);

  // Generate integration result when 2+ boxes selected (from 2+ domains)
  const integrationResult = useMemo(() => {
    if (selectedDomains.length < 2) return null;

    // When ALL cells of every selected domain are selected (full-row selection),
    // skip box-level matching so we get the richer domain-level Tier 2/Tier 3
    // integration instead of a narrow cell-intersection narrative.
    const isFullRowSelection = selectedDomains.every(domainId => {
      const domain = domains.find(d => d.id === domainId);
      if (!domain) return false;
      const selectedInDomain = selectedBoxes.filter(k => k.startsWith(`${domainId}:`));
      return selectedInDomain.length >= domain.cells.length;
    });

    return generateIntegration(
      selectedDomains,
      integrationScores,
      isFullRowSelection ? undefined : selectedBoxes,
    );
  }, [selectedDomains, integrationScores, selectedBoxes, domains]);

  // Auto-scroll to integration panel when results appear
  useEffect(() => {
    if (integrationResult && integrationPanelRef.current && scrollViewRef?.current) {
      const timer = setTimeout(() => {
        integrationPanelRef.current?.measureInWindow((_x: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 100), animated: true });
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [integrationResult, scrollViewRef]);

  // ── Invitation ──
  const invitation = useMemo(() => {
    if (!ecrr) return null;
    const dp = ipip?.domainPercentiles || {};
    const sn = sseit?.subscaleNormalized || {};
    const dsirSub = dsir?.subscaleScores || {};
    const dutchSub = dutch?.subscaleScores || {};

    return generateOneInvitation({
      attachmentStyle: ecrr.attachmentStyle,
      anxietyScore: ecrr.anxietyScore,
      avoidanceScore: ecrr.avoidanceScore,
      N: dp.N ?? dp.neuroticism ?? 50,
      O: dp.O ?? dp.openness ?? 50,
      perception: sn.perception ?? 50,
      differentiation: dsir?.totalNormalized ?? 50,
      iPosition: dsirSub.iPosition?.normalized ?? 50,
      fusionWithOthers: dsirSub.fusionWithOthers?.normalized ?? 50,
      primaryConflict: dutch?.primaryStyle ?? 'avoiding',
      yieldingMean: dutchSub.yielding?.mean ?? 2.5,
      avoidingMean: dutchSub.avoiding?.mean ?? 2.5,
      forcingMean: dutchSub.forcing?.mean ?? 2.5,
      problemSolvingMean: dutchSub.problemSolving?.mean ?? 2.5,
      windowWidth: cs.windowWidth,
      valuesCongruence: cs.valuesCongruence,
    });
  }, [ecrr, ipip, sseit, dsir, dutch, cs]);

  // ── Fun Combo: a surprising cross-domain insight ──
  const funCombo = useMemo<{ emoji: string; title: string; body: string } | null>(() => {
    if (!ecrr || !portrait.compositeScores) return null;
    const cs = portrait.compositeScores as any;
    const dp = ipip?.domainPercentiles || {};
    const N = dp.N ?? dp.neuroticism ?? 50;
    const E = dp.E ?? dp.extraversion ?? 50;
    const O = dp.O ?? dp.openness ?? 50;
    const A = dp.A ?? dp.agreeableness ?? 50;
    const reg = cs.regulationScore ?? 50;
    const diff = cs.differentiation ?? 50;
    const valCong = cs.valuesCongruence ?? 50;
    const conflictFlex = cs.conflictFlexibility ?? 50;
    const anxiety = ecrr.anxietyScore ?? 3;
    const avoidance = ecrr.avoidanceScore ?? 3;

    // Pick the most interesting combo for this person
    if (N > 65 && O > 65 && anxiety > 3.5) {
      return {
        emoji: '\u2736',
        title: 'Your Hidden Superpower',
        body: `Your high sensitivity (${Math.round(N)}th) combined with high openness (${Math.round(O)}th) means you can sense emotional shifts others miss entirely. Your anxiety isn't just noise \u2014 it's a finely tuned antenna. The trick isn't turning it off. It's learning to trust the signal without drowning in it.`,
      };
    }
    if (A > 70 && conflictFlex < 40) {
      return {
        emoji: '\u2727',
        title: 'The Warmth Paradox',
        body: `You score in the ${Math.round(A)}th percentile for warmth, yet your conflict flexibility is just ${Math.round(conflictFlex)}/100. Translation: you're deeply caring, but when things get tense you lock into one mode. Your warmth could actually be your best conflict tool \u2014 if you let yourself stay warm while disagreeing.`,
      };
    }
    if (avoidance > 3.5 && valCong > 65) {
      return {
        emoji: '\u2662',
        title: 'The Closeness Puzzle',
        body: `Your values say intimacy matters (alignment: ${Math.round(valCong)}/100), but your attachment system pulls away (avoidance: ${avoidance.toFixed(1)}/7). This isn't hypocrisy \u2014 it's a nervous system that learned to protect what it values most by creating distance from it. The bridge? Small, repeated moments of closeness that prove safety.`,
      };
    }
    if (E < 35 && reg > 60) {
      return {
        emoji: '\u2014',
        title: 'Your Quiet Strength',
        body: `Low social energy (${Math.round(E)}th) with solid regulation (${Math.round(reg)}/100) is an underrated combo. You don't need to be the loudest person in the room because your emotional stability does the heavy lifting. In relationships, you're the calm in the storm \u2014 your partner probably relies on this more than either of you realize.`,
      };
    }
    if (diff > 65 && anxiety > 4) {
      return {
        emoji: '\u2021',
        title: 'The Inner Tug-of-War',
        body: `Strong differentiation (${Math.round(diff)}/100) means you know who you are. But attachment anxiety (${anxiety.toFixed(1)}/7) means part of you keeps checking if your partner is still there. You're simultaneously the most grounded and most anxious person in the room. The growth edge: trusting that your solidness is exactly what makes you safe to love.`,
      };
    }
    if (N < 35 && A > 60 && avoidance < 3) {
      return {
        emoji: '\u2740',
        title: 'The Steady Hearth',
        body: `Low sensitivity (${Math.round(N)}th), high warmth (${Math.round(A)}th), and secure attachment \u2014 you are the emotional safe haven that attachment theory dreams about. Your partner likely feels a calm they can't quite name when they're with you. Your growth edge isn't about becoming more \u2014 it's about making sure you're also receiving, not just giving.`,
      };
    }
    // Default fun combo
    return {
      emoji: '\u2726',
      title: 'Your Unique Mix',
      body: `Here's something interesting: your sensitivity (${Math.round(N)}th), social energy (${Math.round(E)}th), and regulation (${Math.round(reg)}/100) create a profile that's distinctly yours. No textbook describes this exact combination \u2014 which means your relationship won't look like anyone else's either. That's not a bug. It's the feature.`,
    };
  }, [ecrr, ipip, portrait.compositeScores]);

  // ── Learn Mode: determine highlighted cells ──
  const { highlightedCellMap, learnSummary, learnExercises } = useMemo(() => {
    const map: Record<string, Record<string, 'strength' | 'growth'>> = {};
    let summary = '';
    let exercises: Intervention[] = [];

    if (learnMode === 'off' || learnMode === 'intro' || !portrait.compositeScores) {
      return { highlightedCellMap: map, learnSummary: summary, learnExercises: exercises };
    }

    const cs = portrait.compositeScores as any;
    const strengthKeys: string[] = [];
    const growthKeys: string[] = [];

    for (const key of ANALYZED_DOMAINS) {
      const value = cs[key] as number | undefined;
      if (value == null) continue;
      if (value >= STRENGTH_THRESHOLD) strengthKeys.push(key);
      if (value <= GROWTH_THRESHOLD) growthKeys.push(key);
    }

    // Build highlight map based on learn mode
    const addToMap = (keys: string[], type: 'strength' | 'growth') => {
      for (const key of keys) {
        const mapping = COMPOSITE_TO_DOMAIN[key];
        if (!mapping) continue;
        if (!map[mapping.domainId]) map[mapping.domainId] = {};
        for (const label of mapping.cellLabels) {
          map[mapping.domainId][label] = type;
        }
      }
    };

    if (learnMode === 'strengths') {
      addToMap(strengthKeys, 'strength');
      summary = strengthKeys.length > 0
        ? 'These highlighted cells represent your relational superpowers \u2014 the dimensions where you naturally shine. They are the foundation you can always return to when things feel uncertain.'
        : 'Your scores are fairly balanced across dimensions. As you keep growing, some will naturally emerge as clear strengths.';
    } else if (learnMode === 'growth') {
      addToMap(growthKeys, 'growth');
      summary = growthKeys.length > 0
        ? 'These highlighted cells show where you have the most room to grow. Lower scores are not weaknesses \u2014 they are invitations to develop new relational capacities, gently and at your own pace.'
        : 'Your scores are well above the growth threshold across all dimensions. You have a solid foundation to build on.';
    } else if (learnMode === 'full') {
      addToMap(strengthKeys, 'strength');
      addToMap(growthKeys, 'growth');
      summary = 'The full picture: sage-green highlighted cells are your strengths, blush-highlighted cells are your growing edges. Together they tell the story of who you are in relationship \u2014 whole, complex, and always unfolding.';
    }

    // Pick exercises — creative rotation using day-of-year hash
    const allEx = getAllExercises();
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

    const relevantCategories = new Set<InterventionCategory>();
    const relevantPatterns = new Set<string>();

    const keysToUse = learnMode === 'strengths' ? strengthKeys
      : learnMode === 'growth' ? growthKeys
      : [...strengthKeys, ...growthKeys];

    for (const key of keysToUse) {
      const meta = COMPOSITE_CATEGORIES[key];
      if (!meta) continue;
      meta.categories.forEach(c => relevantCategories.add(c));
      meta.patterns.forEach(p => relevantPatterns.add(p));
    }

    // For growth mode, prefer portrait.growthEdges practices first
    const priorityIds: string[] = [];
    if ((learnMode === 'growth' || learnMode === 'full') && portrait.growthEdges) {
      for (const edge of portrait.growthEdges) {
        for (const pid of edge.practices) {
          if (!priorityIds.includes(pid)) priorityIds.push(pid);
        }
      }
    }

    // Score and shuffle exercises
    const scored = allEx.map(ex => {
      let score = 0;
      if (priorityIds.includes(ex.id)) score += 5;
      if (relevantCategories.has(ex.category)) score += 2;
      for (const p of ex.forPatterns) {
        if (relevantPatterns.has(p.toLowerCase())) score += 1;
      }
      return { ex, score };
    });

    // Sort by score, then rotate using day hash to ensure variety
    const eligible = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score);
    // Use day hash to pick a rotating window from eligible exercises
    const offset = dayOfYear % Math.max(1, eligible.length - 4);
    const rotated = [...eligible.slice(offset), ...eligible.slice(0, offset)];
    exercises = rotated.slice(0, 5).map(s => s.ex);

    return { highlightedCellMap: map, learnSummary: summary, learnExercises: exercises };
  }, [learnMode, portrait]);

  const isLearnActive = learnMode !== 'off' && learnMode !== 'intro';

  // Toggle learn mode — entering it exits integrate mode
  const handleLearnTap = useCallback(() => {
    if (learnMode === 'off') {
      setLearnMode('intro');
      setIntegrateMode(false);
      setSelectedBoxes([]);
      setExpandedDomain(null);
    } else {
      setLearnMode('off');
    }
  }, [learnMode]);

  const handleLearnChoice = useCallback((mode: 'strengths' | 'growth' | 'full') => {
    setLearnMode(mode);
  }, []);

  // Auto-scroll to learn panel
  useEffect(() => {
    if (isLearnActive && learnPanelRef.current && scrollViewRef?.current) {
      const timer = setTimeout(() => {
        learnPanelRef.current?.measureInWindow((_x: number, y: number) => {
          scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 80), animated: true });
        });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isLearnActive, scrollViewRef]);

  // ── Check minimum data ──
  const completedCount = Object.keys(allScores).length;
  if (completedCount < 1 || domains.length === 0) {
    return (
      <View style={styles.emptyState}>
        <TenderText variant="headingS" color={Colors.text} align="center">
          Your Matrix
        </TenderText>
        <TenderText variant="body" color={Colors.textSecondary} align="center" style={{ marginTop: Spacing.sm }}>
          Complete at least one assessment to see your relational matrix.
        </TenderText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TenderText variant="caption" style={styles.headerLabel}>
          TENDER INTEGRATED MAP
        </TenderText>
        <TenderText variant="bodySmall" color={Colors.textSecondary} align="center" style={styles.headerSubtitle}>
          {integrateMode
            ? `Tap cells across domains to discover what emerges at the intersection${selectedBoxes.length > 0 ? ` — ${selectedBoxes.length} selected from ${selectedDomains.length} domain${selectedDomains.length !== 1 ? 's' : ''}` : ''}`
            : 'All scores are 0–100. Higher means more of that quality.'}
        </TenderText>
      </View>

      {/* How it works — shown only when NOT in integrate mode */}
      {!integrateMode && (
        <View style={styles.howItWorks}>
          <TenderText variant="caption" style={styles.howItWorksText}>
            We often see assessments through a reductionist lens — one score, one label. This map is different. TENDER identifies unique combinations and interconnections across your results, helping you see the full picture and the uniqueness of how you show up in relationships — through soulful, therapeutic, developmental, practical, relational, and simple perspectives.
          </TenderText>
          <TenderText variant="caption" style={[styles.howItWorksText, { marginTop: 6 }]}>
            Tap any row to read its story. Then press{' '}
            <TenderText variant="caption" style={styles.howItWorksBold}>Integrate</TenderText> to
            select cells from 2+ rows and discover what emerges at the intersection. Play around, get curious — share with your partner or therapist!
          </TenderText>
        </View>
      )}

      {/* Action buttons row — Learn About Me + Integrate side by side */}
      {domains.length >= 2 && (
        <View style={styles.actionButtonRow}>
          {portrait.compositeScores && (
            <TouchableOpacity
              style={[
                styles.learnButton,
                (learnMode !== 'off') && styles.learnButtonActive,
              ]}
              onPress={handleLearnTap}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={learnMode !== 'off' ? 'Exit learn mode' : 'Learn about myself'}
            >
              <TenderText variant="caption" style={[
                styles.learnButtonText,
                (learnMode !== 'off') && styles.learnButtonTextActive,
              ]}>
                {learnMode !== 'off' ? 'Exit Learn' : 'Learn About Me'}
              </TenderText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.integrateButton, integrateMode && styles.integrateButtonActive]}
            onPress={() => {
              if (learnMode !== 'off') setLearnMode('off');
              toggleIntegrateMode();
            }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={integrateMode ? 'Exit integrate mode' : 'Enter integrate mode to select domains'}
          >
            <TenderText variant="caption" style={[
              styles.integrateButtonText,
              integrateMode && styles.integrateButtonTextActive,
            ]}>
              {integrateMode ? 'Exit Integrate' : 'Integrate'}
            </TenderText>
          </TouchableOpacity>
          {integrateMode && selectedBoxes.length > 0 && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Reset selections"
            >
              <TenderText variant="caption" style={styles.resetButtonText}>
                Reset
              </TenderText>
            </TouchableOpacity>
          )}
          {integrateMode && selectedBoxes.length > 0 && selectedDomains.length < 2 && (
            <TenderText variant="caption" color={Colors.textMuted} style={{ marginLeft: Spacing.sm }}>
              Select from at least 2 domains
            </TenderText>
          )}
        </View>
      )}

      {/* Learn mode intro — brief explanation + 3 pill choices */}
      {learnMode === 'intro' && (
        <View style={styles.learnIntroPanel}>
          <TenderText variant="bodySmall" color={Colors.text} style={styles.learnIntroText}>
            Discover what your map reveals about you. Choose a lens and watch the relevant cells light up in the map below.
          </TenderText>
          <View style={styles.learnPillRow}>
            <TouchableOpacity
              style={[styles.learnPill, { borderColor: STRENGTH_COLOR, backgroundColor: STRENGTH_COLOR + '15' }]}
              onPress={() => handleLearnChoice('strengths')}
              activeOpacity={0.7}
            >
              <TenderText variant="caption" style={[styles.learnPillText, { color: STRENGTH_COLOR }]}>
                Strengths
              </TenderText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.learnPill, { borderColor: GROWTH_COLOR, backgroundColor: GROWTH_COLOR + '15' }]}
              onPress={() => handleLearnChoice('growth')}
              activeOpacity={0.7}
            >
              <TenderText variant="caption" style={[styles.learnPillText, { color: GROWTH_COLOR }]}>
                Growth Edges
              </TenderText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.learnPill, { borderColor: Colors.primary, backgroundColor: Colors.primaryFaded }]}
              onPress={() => handleLearnChoice('full')}
              activeOpacity={0.7}
            >
              <TenderText variant="caption" style={[styles.learnPillText, { color: Colors.primaryDark }]}>
                Full Picture
              </TenderText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Learn mode active — pill selectors (when already viewing a lens) */}
      {isLearnActive && (
        <View style={styles.learnActivePillRow}>
          {(['strengths', 'growth', 'full'] as const).map(mode => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.learnActivePill,
                learnMode === mode && styles.learnActivePillSelected,
                learnMode === mode && {
                  backgroundColor: mode === 'strengths' ? STRENGTH_COLOR : mode === 'growth' ? GROWTH_COLOR : Colors.primary,
                },
              ]}
              onPress={() => setLearnMode(mode)}
              activeOpacity={0.7}
            >
              <TenderText variant="caption" style={[
                styles.learnActivePillText,
                learnMode === mode && { color: '#FFFFFF' },
              ]}>
                {mode === 'strengths' ? 'Strengths' : mode === 'growth' ? 'Growth Edges' : 'Full Picture'}
              </TenderText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Domain rows — integration panel renders inline after the last selected domain */}
      <View style={styles.domainList}>
        {domains.map((domain, index) => {
          const isSelected = selectedDomains.includes(domain.id as DomainId);
          // Show integration panel right after the last selected domain row
          const isLastSelectedDomain = integrateMode && isSelected &&
            !domains.slice(index + 1).some(d => selectedDomains.includes(d.id as DomainId));
          const showIntegrationHere = isLastSelectedDomain && integrationResult && selectedDomains.length >= 2;

          return (
            <React.Fragment key={domain.id}>
              <MatrixDomain
                domain={domain}
                isExpanded={expandedDomain === domain.id}
                onToggle={handleToggle}
                selectable={integrateMode}
                selected={isSelected}
                cellSelectable={integrateMode}
                selectedCells={selectedBoxes
                  .filter(k => k.startsWith(`${domain.id}:`))
                  .map(k => k.split(':')[1])}
                onCellSelect={(cellLabel) => handleCellSelect(domain.id, cellLabel)}
                onRowSelect={() => handleRowSelect(domain.id, domain.cells)}
                highlightedCells={highlightedCellMap[domain.id]}
                learnModeActive={isLearnActive}
              />
              {showIntegrationHere && (
                <View ref={integrationPanelRef}>
                  <IntegrationPanel
                    result={integrationResult}
                    visible
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Learn mode summary panel — below highlighted map */}
      {isLearnActive && (
        <View ref={learnPanelRef} style={[
          styles.learnSummaryPanel,
          {
            borderLeftColor: learnMode === 'strengths' ? STRENGTH_COLOR
              : learnMode === 'growth' ? GROWTH_COLOR : Colors.primary,
            backgroundColor: learnMode === 'strengths' ? STRENGTH_COLOR + '10'
              : learnMode === 'growth' ? GROWTH_COLOR + '10' : Colors.primaryFaded,
          },
        ]}>
          <TenderText variant="bodySmall" color={Colors.text} style={styles.learnSummaryText}>
            {learnSummary}
          </TenderText>

          {learnExercises.length > 0 && (
            <View style={styles.learnExercisesSection}>
              <TenderText variant="caption" style={styles.learnExercisesTitle}>
                {learnMode === 'strengths' ? 'DEEPEN YOUR STRENGTHS' : learnMode === 'growth' ? 'GENTLE GROWTH PRACTICES' : 'PRACTICES FOR YOUR WHOLE PICTURE'}
              </TenderText>
              {learnExercises.map(ex => (
                <TouchableOpacity
                  key={ex.id}
                  style={styles.learnExerciseCard}
                  onPress={() => router.push(`/(app)/exercise?id=${ex.id}` as any)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Open practice: ${ex.title}`}
                >
                  <View style={styles.learnExerciseHeader}>
                    <View style={[
                      styles.learnExerciseBadge,
                      {
                        backgroundColor: (learnMode === 'strengths' ? STRENGTH_COLOR
                          : learnMode === 'growth' ? GROWTH_COLOR : Colors.primary) + '18',
                      },
                    ]}>
                      <TenderText variant="caption" style={[
                        styles.learnExerciseBadgeText,
                        {
                          color: learnMode === 'strengths' ? STRENGTH_COLOR
                            : learnMode === 'growth' ? GROWTH_COLOR : Colors.primary,
                        },
                      ]}>
                        {ex.category}
                      </TenderText>
                    </View>
                    <TenderText variant="caption" color={Colors.textMuted}>
                      {ex.duration} min
                    </TenderText>
                  </View>
                  <TenderText variant="headingS" style={styles.learnExerciseTitle}>
                    {ex.title}
                  </TenderText>
                  <TenderText variant="caption" color={Colors.textSecondary} numberOfLines={2} style={{ marginTop: 2 }}>
                    {ex.description}
                  </TenderText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Fun Combo — a surprising cross-domain insight */}
      {!integrateMode && !isLearnActive && funCombo && (
        <View style={styles.funComboCard}>
          <View style={styles.funComboHeader}>
            <TenderText variant="headingS" style={styles.funComboTitle}>
              {funCombo.emoji} {funCombo.title}
            </TenderText>
            <TenderText variant="caption" color={Colors.textMuted} style={{ letterSpacing: 1.2 }}>
              CROSS-MAP DISCOVERY
            </TenderText>
          </View>
          <TenderText variant="bodySmall" color={Colors.text} style={styles.funComboBody}>
            {funCombo.body}
          </TenderText>
        </View>
      )}

      {/* The Invitation (hidden in integrate mode and learn mode) */}
      {!integrateMode && !isLearnActive && invitation && (
        <MatrixInvitation text={invitation} />
      )}

      {/* Incomplete assessments hint */}
      {completedCount < 6 && !integrateMode && !isLearnActive && (
        <View style={styles.hintBox}>
          <TenderText variant="caption" color={Colors.textSecondary} align="center">
            {6 - completedCount} more assessment{6 - completedCount > 1 ? 's' : ''} will deepen your matrix
          </TenderText>
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
    overflow: 'hidden' as const,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  howItWorks: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primaryLight,
  },
  howItWorksText: {
    fontSize: 11,
    lineHeight: 17,
    color: Colors.textSecondary,
    fontFamily: 'JosefinSans_400Regular',
  },
  howItWorksBold: {
    fontSize: 11,
    fontFamily: 'Jost_600SemiBold',
    color: Colors.primary,
  },
  headerLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: Colors.textMuted,
    fontFamily: 'Jost_500Medium',
  },
  headerSubtitle: {
    lineHeight: 20,
  },
  domainList: {
    gap: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  funComboCard: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.accentGold + '40',
    ...Shadows.card,
  },
  funComboHeader: {
    gap: 2,
    marginBottom: Spacing.sm,
  },
  funComboTitle: {
    color: Colors.text,
  },
  funComboBody: {
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  hintBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  resultReadyHint: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },

  // ── Action buttons row (Learn + Integrate side by side) ──
  actionButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  integrateButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  integrateButtonActive: {
    backgroundColor: Colors.primary,
  },
  integrateButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: Colors.primary,
  },
  integrateButtonTextActive: {
    color: Colors.textOnPrimary,
  },
  resetButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.textMuted,
    backgroundColor: 'transparent',
  },
  resetButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: 11,
    letterSpacing: 0.5,
    color: Colors.textMuted,
  },
  learnButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  learnButtonActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  learnButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: Colors.successDark,
  },
  learnButtonTextActive: {
    color: '#FFFFFF',
  },

  // ── Learn mode intro panel ──
  learnIntroPanel: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
    overflow: 'hidden' as const,
  },
  learnIntroText: {
    lineHeight: 20,
    fontFamily: 'JosefinSans_400Regular',
    marginBottom: Spacing.md,
  },
  learnPillRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  learnPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  learnPillText: {
    fontFamily: FontFamilies.heading,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },

  // ── Learn mode active pill selectors ──
  learnActivePillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  learnActivePill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  learnActivePillSelected: {
    borderColor: 'transparent',
  },
  learnActivePillText: {
    fontFamily: FontFamilies.heading,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
    color: Colors.textMuted,
  },

  // ── Learn summary panel (below highlighted map) ──
  learnSummaryPanel: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    overflow: 'hidden' as const,
  },
  learnSummaryText: {
    lineHeight: 20,
    fontFamily: 'JosefinSans_400Regular',
  },
  learnExercisesSection: {
    marginTop: Spacing.md,
  },
  learnExercisesTitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.textMuted,
    fontFamily: 'Jost_500Medium',
    textTransform: 'uppercase' as const,
    marginBottom: Spacing.sm,
  },
  learnExerciseCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  learnExerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  learnExerciseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  learnExerciseBadgeText: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  learnExerciseTitle: {
    fontSize: 15,
    marginTop: 2,
  },
});
