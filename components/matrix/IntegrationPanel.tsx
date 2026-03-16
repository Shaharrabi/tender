/**
 * IntegrationPanel — Shows the integration result when 2-4 domains
 * are selected in "Integrate" mode.
 *
 * Enhanced with the 6-lens system:
 *   Lens picker → Lensed narrative → Developmental arc → Practice → Invitation
 *
 * When a Tier 1/2 pattern matches, shows full lens experience.
 * Falls back to legacy single-voice body for existing pairwise/triple/quad results.
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View, StyleSheet, Animated, LayoutAnimation, Platform, UIManager,
  TouchableOpacity,
} from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows, FontFamilies } from '@/constants/theme';
import { MATRIX_COLORS } from './constants/matrix-colors';
import LensPicker from './LensPicker';
import type { IntegrationResult, LensType } from '@/utils/integration-engine';
import { LENS_META } from '@/utils/integration-engine';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface IntegrationPanelProps {
  result: IntegrationResult | null;
  visible: boolean;
}

export default function IntegrationPanel({ result, visible }: IntegrationPanelProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeLens, setActiveLens] = useState<LensType>('soulful');
  const [showEvidence, setShowEvidence] = useState(false);

  useEffect(() => {
    if (visible && result) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, result?.title]);

  // Reset lens when result changes
  useEffect(() => {
    setActiveLens('soulful');
    setShowEvidence(false);
  }, [result?.title]);

  if (!visible || !result) return null;

  const hasLenses = !!result.lenses;
  const domainColor = result.domains[0]
    ? MATRIX_COLORS[result.domains[0] as keyof typeof MATRIX_COLORS]
    : MATRIX_COLORS.invitation;

  // Get the active narrative text
  const narrativeText = hasLenses
    ? result.lenses![activeLens]
    : result.body;

  // Get enhanced practice if available
  const practice = result.matchedPractice;
  const invitation = result.invitation || result.oneThing;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        {result.patternName && (
          <View style={[styles.patternBadge, { backgroundColor: domainColor.bg }]}>
            <TenderText variant="caption" style={[styles.patternBadgeText, { color: domainColor.text }]}>
              {result.patternName}
            </TenderText>
          </View>
        )}
        <View style={[styles.depthBadge, { backgroundColor: domainColor.bg }]}>
          <TenderText variant="caption" style={[styles.depthText, { color: domainColor.text }]}>
            {result.depth === 'pairwise' ? '2 domains' : result.depth === 'triple' ? '3 domains' : '4 domains'}
          </TenderText>
        </View>
        <View style={[styles.confidenceBadge, {
          backgroundColor: result.confidence === 'high' ? '#E3EFE5' : result.confidence === 'emerging' ? '#FDF3E0' : '#F0E6E0',
        }]}>
          <TenderText variant="caption" style={{
            color: result.confidence === 'high' ? '#4A6F50' : result.confidence === 'emerging' ? '#8B6914' : '#6B5E61',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {result.confidence === 'high' ? 'Strong signal' : result.confidence === 'emerging' ? 'Pattern emerging' : 'Needs more data'}
          </TenderText>
        </View>
      </View>

      {/* Title */}
      <TenderText variant="headingM" style={styles.title}>{result.title}</TenderText>
      <TenderText variant="caption" color={Colors.textSecondary} style={styles.subtitle}>
        {result.subtitle}
      </TenderText>

      {/* Lens Picker — only when lenses available */}
      {hasLenses && (
        <View style={styles.lensPickerContainer}>
          <LensPicker activeLens={activeLens} onLensChange={setActiveLens} />
          <TenderText variant="caption" style={styles.lensSubtitle}>
            {LENS_META[activeLens].subtitle}
          </TenderText>
        </View>
      )}

      {/* Narrative Body */}
      <TenderText variant="body" style={styles.body}>{narrativeText}</TenderText>

      {/* Developmental Arc — enhanced with optional wound */}
      <View style={styles.arcContainer}>
        <TenderText variant="caption" style={styles.arcLabel}>DEVELOPMENTAL ARC</TenderText>

        {result.arc.wound && (
          <>
            <View style={styles.arcStep}>
              <View style={[styles.arcDot, { backgroundColor: '#9B7B8B' }]} />
              <View style={styles.arcContent}>
                <TenderText variant="caption" style={styles.arcStepLabel}>Wound</TenderText>
                <TenderText variant="body" style={styles.arcText}>{result.arc.wound}</TenderText>
              </View>
            </View>
            <View style={styles.arcConnector} />
          </>
        )}

        <View style={styles.arcStep}>
          <View style={[styles.arcDot, { backgroundColor: '#C4917A' }]} />
          <View style={styles.arcContent}>
            <TenderText variant="caption" style={styles.arcStepLabel}>Protection</TenderText>
            <TenderText variant="body" style={styles.arcText}>{result.arc.protection}</TenderText>
          </View>
        </View>

        <View style={styles.arcConnector} />

        <View style={styles.arcStep}>
          <View style={[styles.arcDot, { backgroundColor: '#D4B96A' }]} />
          <View style={styles.arcContent}>
            <TenderText variant="caption" style={styles.arcStepLabel}>Cost</TenderText>
            <TenderText variant="body" style={styles.arcText}>{result.arc.cost}</TenderText>
          </View>
        </View>

        <View style={styles.arcConnector} />

        <View style={styles.arcStep}>
          <View style={[styles.arcDot, { backgroundColor: '#B5C4A8' }]} />
          <View style={styles.arcContent}>
            <TenderText variant="caption" style={styles.arcStepLabel}>Emergence</TenderText>
            <TenderText variant="body" style={styles.arcText}>{result.arc.emergence}</TenderText>
          </View>
        </View>
      </View>

      {/* Enhanced Practice Card */}
      <View style={styles.practiceContainer}>
        {practice ? (
          <>
            <View style={styles.practiceHeader}>
              <TenderText variant="caption" style={styles.practiceLabel}>THIS WEEK'S PRACTICE</TenderText>
              {practice.modality && (
                <TenderText variant="caption" style={styles.practiceModality}>
                  {practice.modality}
                </TenderText>
              )}
            </View>
            <TenderText variant="body" style={styles.practiceName}>{practice.name}</TenderText>
            <TenderText variant="body" style={styles.practiceText}>{practice.instruction}</TenderText>
            <View style={styles.practiceFooter}>
              <TenderText variant="caption" style={styles.practiceFrequency}>
                {practice.frequency}
              </TenderText>
            </View>
          </>
        ) : (
          <>
            <TenderText variant="caption" style={styles.practiceLabel}>THIS WEEK'S PRACTICE</TenderText>
            <TenderText variant="body" style={styles.practiceText}>{result.practice}</TenderText>
          </>
        )}
      </View>

      {/* Invitation — the screenshot moment */}
      {invitation && (
        <View style={styles.invitationContainer}>
          <TenderText variant="body" style={styles.invitationText}>
            {invitation}
          </TenderText>
        </View>
      )}

      {/* Evidence footer — tap to expand */}
      {result.evidenceLevel && (
        <TouchableOpacity
          style={styles.evidenceToggle}
          onPress={() => setShowEvidence(!showEvidence)}
          activeOpacity={0.7}
        >
          <TenderText variant="caption" style={styles.evidenceToggleText}>
            {showEvidence ? 'Hide evidence' : "What's this based on?"}
          </TenderText>
        </TouchableOpacity>
      )}

      {showEvidence && result.evidenceLevel && (
        <View style={styles.evidenceContainer}>
          <View style={styles.evidenceLevelRow}>
            <View style={[styles.evidenceLevelBadge, {
              backgroundColor: result.evidenceLevel === 'strong' ? '#E3EFE5'
                : result.evidenceLevel === 'moderate' ? '#FDF3E0' : '#F0EBF5',
            }]}>
              <TenderText variant="caption" style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: result.evidenceLevel === 'strong' ? '#4A6F50'
                  : result.evidenceLevel === 'moderate' ? '#8B6914' : '#5A4A7A',
              }}>
                {result.evidenceLevel} evidence
              </TenderText>
            </View>
          </View>
          {result.keyCitations && result.keyCitations.length > 0 && (
            <View style={styles.citationsContainer}>
              {result.keyCitations.map((citation, i) => (
                <TenderText key={i} variant="caption" style={styles.citationText}>
                  {citation}
                </TenderText>
              ))}
            </View>
          )}
          {result.evidenceNote && (
            <TenderText variant="caption" style={styles.evidenceNote}>
              {result.evidenceNote}
            </TenderText>
          )}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  patternBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  patternBadgeText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: FontFamilies.heading,
  },
  depthBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  depthText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: FontFamilies.heading,
  },
  confidenceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  title: {
    fontSize: 20,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  lensPickerContainer: {
    marginBottom: Spacing.md,
  },
  lensSubtitle: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.textMuted,
    marginTop: 4,
    marginLeft: 2,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  arcContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  arcLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    fontFamily: FontFamilies.heading,
  },
  arcStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  arcDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  arcContent: {
    flex: 1,
  },
  arcStepLabel: {
    fontSize: 11,
    fontFamily: FontFamilies.heading,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  arcText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.text,
  },
  arcConnector: {
    width: 1,
    height: 12,
    backgroundColor: Colors.borderLight,
    marginLeft: 4.5,
    marginVertical: 4,
  },
  practiceContainer: {
    backgroundColor: '#FDF8EE',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#D4B96A',
    marginBottom: Spacing.md,
  },
  practiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  practiceLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    fontFamily: FontFamilies.heading,
  },
  practiceModality: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.textMuted,
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  practiceName: {
    fontSize: 14,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: 6,
  },
  practiceText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.text,
  },
  practiceFooter: {
    marginTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.xs,
  },
  practiceFrequency: {
    fontSize: 11,
    fontFamily: FontFamilies.heading,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  invitationContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  invitationText: {
    fontSize: 17,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  evidenceToggle: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  evidenceToggleText: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
  evidenceContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  evidenceLevelRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  evidenceLevelBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  citationsContainer: {
    gap: 4,
  },
  citationText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  evidenceNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 18,
  },
});
