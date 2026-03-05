/**
 * L2CostGainTimeline — MC8 Lesson 2
 *
 * Timeline builder showing costs of NOT holding a boundary vs gains WITH one.
 * User selects a boundary, sees 4 time markers with stacking cost/gain cards.
 * Rates "worth it?" at the end.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC8_PALETTE } from '@/constants/mc8Theme';
import { ChartBarIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface BoundaryOption {
  id: string;
  label: string;
  costs: string[];
  gains: string[];
}

const BOUNDARY_OPTIONS: BoundaryOption[] = [
  { id: 'time', label: 'Saying no to extra commitments', costs: ['Resentment builds', 'Energy depleted weekly', 'Burnout by month 3', 'Relationship suffers from exhaustion'], gains: ['Immediate relief', 'Weekly energy restored', 'Sustainable pace established', 'Present and available for partner'] },
  { id: 'emotional', label: 'Not absorbing partner\'s moods', costs: ['Mood hijacked daily', 'Walking on eggshells weekly', 'Lost sense of self by month 2', 'Codependency deepens over the year'], gains: ['Emotional clarity today', 'Stable mood week to week', 'Stronger sense of self', 'Healthier interdependence'] },
  { id: 'space', label: 'Protecting personal alone time', costs: ['Irritability grows', 'Losing hobbies and interests', 'Identity fading into "we"', 'Quiet resentment becomes distance'], gains: ['Immediate recharge', 'Hobbies and interests flourish', 'Bringing your full self to the relationship', 'Missing each other keeps spark alive'] },
  { id: 'phone', label: 'Setting phone-free couple time', costs: ['Distracted conversations', 'Missing bids for connection', 'Growing emotional distance', 'Parallel lives under one roof'], gains: ['One real conversation today', 'Noticing each other again', 'Rebuilding emotional intimacy', 'Feeling like partners, not roommates'] },
];

const TIME_MARKERS = ['Day 1', '1 Week', '1 Month', '1 Year'];

type Phase = 'intro' | 'select' | 'costs' | 'gains' | 'rate' | 'results';

export default function L2CostGainTimeline({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (responses: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedBoundary, setSelectedBoundary] = useState<BoundaryOption | null>(null);
  const [costIndex, setCostIndex] = useState(0);
  const [gainIndex, setGainIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const introFade = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'intro') {
      Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [phase]);

  const animateCard = useCallback(() => {
    cardFade.setValue(0);
    Animated.timing(cardFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [cardFade]);

  const startGame = useCallback(() => { haptics.tap(); setPhase('select'); }, [haptics]);

  const handleSelectBoundary = useCallback((b: BoundaryOption) => {
    haptics.tap();
    setSelectedBoundary(b);
    setPhase('costs');
    setTimeout(() => animateCard(), 100);
  }, [haptics, animateCard]);

  const advanceCost = useCallback(() => {
    haptics.tap();
    if (costIndex + 1 >= TIME_MARKERS.length) {
      setPhase('gains');
      setGainIndex(0);
      setTimeout(() => animateCard(), 100);
    } else {
      setCostIndex(prev => prev + 1);
      animateCard();
    }
  }, [costIndex, haptics, animateCard]);

  const advanceGain = useCallback(() => {
    haptics.tap();
    if (gainIndex + 1 >= TIME_MARKERS.length) {
      setPhase('rate');
    } else {
      setGainIndex(prev => prev + 1);
      animateCard();
    }
  }, [gainIndex, haptics, animateCard]);

  const handleRate = useCallback((r: number) => {
    haptics.playExerciseReveal();
    setRating(r);
    setPhase('results');
  }, [haptics]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const responses: StepResponseEntry[] = [{
      step: 1, prompt: 'Cost-Gain Timeline', response: JSON.stringify({ boundary: selectedBoundary?.label, worthItRating: rating }), type: 'game',
    }];
    onComplete(responses);
  }, [selectedBoundary, rating, onComplete, haptics]);

  const renderIntro = () => {
    const paragraphs = content.readContent ? content.readContent.split('\n').filter((p: string) => p.trim().length > 0) : [];
    return (
      <Animated.View style={[styles.phaseContainer, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}>
            <ChartBarIcon size={28} color={MC8_PALETTE.deepTeal} />
            <Text style={styles.introTitle}>Cost-Gain Timeline</Text>
          </View>
          {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => <Text key={i} style={styles.introParagraph}>{p.trim()}</Text>) : (
            <Text style={styles.introParagraph}>Boundaries have a cost — but so does NOT having them. In this exercise, you'll see what happens over time when you don't hold a boundary, then what happens when you do. The contrast makes the choice clear.</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Timeline</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSelect = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.selectTitle}>Choose a boundary that matters to you:</Text>
      <View style={styles.optionsGrid}>
        {BOUNDARY_OPTIONS.map(b => (
          <TouchableOpacity key={b.id} style={styles.optionCard} onPress={() => handleSelectBoundary(b)} activeOpacity={0.7}>
            <Text style={styles.optionText}>{b.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderCosts = () => {
    if (!selectedBoundary) return null;
    const darkness = 0.3 + (costIndex * 0.2);
    return (
      <View style={styles.phaseContainer}>
        <Text style={styles.timelineTitle}>WITHOUT this boundary...</Text>
        <View style={styles.timelineRow}>
          {TIME_MARKERS.map((t, i) => (
            <View key={i} style={[styles.timeMarker, i <= costIndex && styles.timeMarkerActive]}>
              <Text style={[styles.timeMarkerText, i <= costIndex && styles.timeMarkerTextActive]}>{t}</Text>
            </View>
          ))}
        </View>
        <Animated.View style={[styles.costCard, { opacity: cardFade, borderColor: `rgba(217, 107, 107, ${darkness})` }]}>
          <Text style={styles.costCardTime}>{TIME_MARKERS[costIndex]}</Text>
          <Text style={styles.costCardText}>{selectedBoundary.costs[costIndex]}</Text>
        </Animated.View>
        <View style={styles.stackPreview}>
          {selectedBoundary.costs.slice(0, costIndex).map((c, i) => (
            <Text key={i} style={[styles.stackItem, { opacity: 0.4 + (i * 0.15) }]}>{c}</Text>
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={advanceCost} activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>{costIndex + 1 < TIME_MARKERS.length ? 'Next' : 'Now see what happens WITH the boundary...'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGains = () => {
    if (!selectedBoundary) return null;
    const brightness = 0.3 + (gainIndex * 0.2);
    return (
      <View style={styles.phaseContainer}>
        <Text style={styles.timelineTitle}>WITH this boundary...</Text>
        <View style={styles.timelineRow}>
          {TIME_MARKERS.map((t, i) => (
            <View key={i} style={[styles.timeMarker, i <= gainIndex && styles.timeMarkerGainActive]}>
              <Text style={[styles.timeMarkerText, i <= gainIndex && styles.timeMarkerTextActive]}>{t}</Text>
            </View>
          ))}
        </View>
        <Animated.View style={[styles.gainCard, { opacity: cardFade, borderColor: `rgba(90, 158, 111, ${brightness})` }]}>
          <Text style={styles.gainCardTime}>{TIME_MARKERS[gainIndex]}</Text>
          <Text style={styles.gainCardText}>{selectedBoundary.gains[gainIndex]}</Text>
        </Animated.View>
        <View style={styles.stackPreview}>
          {selectedBoundary.gains.slice(0, gainIndex).map((g, i) => (
            <Text key={i} style={[styles.stackItemGain, { opacity: 0.4 + (i * 0.15) }]}>{g}</Text>
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={advanceGain} activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>{gainIndex + 1 < TIME_MARKERS.length ? 'Next' : 'Was it worth it?'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRate = () => (
    <View style={[styles.phaseContainer, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.rateTitle}>Is holding this boundary worth it?</Text>
      <Text style={styles.rateSubtitle}>"{selectedBoundary?.label}"</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(n => (
          <TouchableOpacity key={n} style={[styles.starButton, rating >= n && styles.starButtonActive]} onPress={() => handleRate(n)} activeOpacity={0.7}>
            <Text style={[styles.starText, rating >= n && styles.starTextActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.rateScale}>1 = Not sure  {'\u2022'}  5 = Absolutely</Text>
    </View>
  );

  const renderResults = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.resultsHeader}>
        <SparkleIcon size={32} color={MC8_PALETTE.deepTeal} />
        <Text style={styles.resultsTitle}>Timeline Complete</Text>
      </View>
      <Text style={styles.resultsSummary}>
        You rated "{selectedBoundary?.label}" as {rating}/5 worth holding.
      </Text>
      <Text style={styles.resultsInsight}>
        Boundaries aren't walls — they're the architecture that makes love sustainable.
        The short-term discomfort of setting a boundary is almost always outweighed by the
        long-term cost of not having one.
      </Text>
      <TouchableOpacity style={styles.continueButton} onPress={handleFinish} activeOpacity={0.8}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {phase === 'intro' && renderIntro()}
      {phase === 'select' && renderSelect()}
      {phase === 'costs' && renderCosts()}
      {phase === 'gains' && renderGains()}
      {phase === 'rate' && renderRate()}
      {phase === 'results' && renderResults()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phaseContainer: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.scrollPadBottom, paddingHorizontal: Spacing.lg },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  introParagraph: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startButton: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  selectTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: Colors.text, fontWeight: '600', marginBottom: Spacing.lg, textAlign: 'center' },
  optionsGrid: { gap: Spacing.md },
  optionCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: MC8_PALETTE.deepTeal + '40', ...Shadows.subtle },
  optionText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center' },
  timelineTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: Colors.text, fontWeight: '600', textAlign: 'center', paddingTop: Spacing.lg, marginBottom: Spacing.md },
  timelineRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg, paddingHorizontal: Spacing.sm },
  timeMarker: { alignItems: 'center', paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.md, backgroundColor: Colors.borderLight },
  timeMarkerActive: { backgroundColor: MC8_PALETTE.sensationRed + '30' },
  timeMarkerGainActive: { backgroundColor: MC8_PALETTE.strengthGreenLight },
  timeMarkerText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: Colors.textMuted, fontWeight: '600' },
  timeMarkerTextActive: { color: Colors.text },
  costCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.xl, borderWidth: 2, ...Shadows.card, marginBottom: Spacing.md, alignItems: 'center' },
  costCardTime: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC8_PALETTE.sensationRed, fontWeight: '600', marginBottom: Spacing.xs },
  costCardText: { fontFamily: FontFamilies.body, fontSize: FontSizes.headingM, color: Colors.text, textAlign: 'center', lineHeight: 28 },
  gainCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.xl, borderWidth: 2, ...Shadows.card, marginBottom: Spacing.md, alignItems: 'center' },
  gainCardTime: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC8_PALETTE.strengthGreen, fontWeight: '600', marginBottom: Spacing.xs },
  gainCardText: { fontFamily: FontFamilies.body, fontSize: FontSizes.headingM, color: Colors.text, textAlign: 'center', lineHeight: 28 },
  stackPreview: { gap: 4, marginBottom: Spacing.lg },
  stackItem: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: MC8_PALETTE.sensationRed, textAlign: 'center' },
  stackItemGain: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: MC8_PALETTE.strengthGreen, textAlign: 'center' },
  nextButton: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', ...Shadows.subtle, marginBottom: Spacing.lg },
  nextButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  rateTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: Colors.text, fontWeight: '600', marginBottom: Spacing.sm, textAlign: 'center' },
  rateSubtitle: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: MC8_PALETTE.deepTeal, fontStyle: 'italic', marginBottom: Spacing.xl, textAlign: 'center' },
  starsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  starButton: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: MC8_PALETTE.deepTeal + '40', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  starButtonActive: { backgroundColor: MC8_PALETTE.deepTeal, borderColor: MC8_PALETTE.deepTeal },
  starText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: MC8_PALETTE.deepTeal, fontWeight: '700' },
  starTextActive: { color: '#FFFFFF' },
  rateScale: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.textMuted },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  resultsTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  resultsSummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg },
  resultsInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: Spacing.lg },
  continueButton: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
