/**
 * L2: Tension Explorer — Rate non-overlapping values
 *
 * Users categorize values that don't overlap between partners as
 * Dealbreaker / Growth Edge / Beautiful Difference.
 * Consumes L1 DualCardSort data for personalized values.
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC6_PALETTE } from '@/constants/mc6Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'rating' | 'summary';
type Rating = 'dealbreaker' | 'growth_edge' | 'beautiful_difference';

interface RatedValue {
  value: string;
  rating: Rating;
  reframe?: string;
}

interface L2TensionExplorerProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
  l1SortData?: string;
}

const RATING_OPTIONS: { key: Rating; label: string; color: string; desc: string }[] = [
  { key: 'dealbreaker', label: 'Dealbreaker', color: MC6_PALETTE.tensionRed, desc: 'This difference causes real conflict' },
  { key: 'growth_edge', label: 'Growth Edge', color: MC6_PALETTE.deepGold, desc: 'This difference stretches us to grow' },
  { key: 'beautiful_difference', label: 'Beautiful Difference', color: MC6_PALETTE.beautyBlue, desc: 'This difference enriches our relationship' },
];

const FALLBACK_VALUES = ['Adventure', 'Stability', 'Freedom', 'Loyalty', 'Independence', 'Family'];

export function L2TensionExplorer({ content, attachmentStyle, onComplete, l1SortData }: L2TensionExplorerProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratedValues, setRatedValues] = useState<RatedValue[]>([]);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [reframeText, setReframeText] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(1)).current;

  // Parse non-overlapping values from L1 data
  const tensionValues = useMemo(() => {
    if (l1SortData) {
      try {
        const parsed = JSON.parse(l1SortData);
        const overlap = parsed.overlap;
        return [...(overlap.yoursOnly || []), ...(overlap.theirsOnly || [])].slice(0, 6);
      } catch {}
    }
    return FALLBACK_VALUES;
  }, [l1SortData]);

  const currentValue = tensionValues[currentIndex];

  const advanceToNext = useCallback(() => {
    if (currentIndex + 1 >= tensionValues.length) {
      setPhase('summary');
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } else {
      // Fade out, switch, fade in
      Animated.timing(cardAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setCurrentIndex(prev => prev + 1);
        setSelectedRating(null);
        setReframeText('');
        Animated.timing(cardAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      });
    }
  }, [currentIndex, tensionValues.length, fadeAnim, cardAnim]);

  const handleRate = useCallback((rating: Rating) => {
    haptics.tap();
    setSelectedRating(rating);

    const entry: RatedValue = { value: currentValue, rating };

    if (rating !== 'beautiful_difference') {
      // Auto-advance after brief pause
      setRatedValues(prev => [...prev, entry]);
      setTimeout(advanceToNext, 600);
    }
    // For beautiful_difference, wait for reframe submission
  }, [currentValue, haptics, advanceToNext]);

  const handleReframeSubmit = useCallback(() => {
    haptics.tap();
    const entry: RatedValue = {
      value: currentValue,
      rating: 'beautiful_difference',
      reframe: reframeText.trim() || undefined,
    };
    setRatedValues(prev => [...prev, entry]);
    setTimeout(advanceToNext, 400);
  }, [currentValue, reframeText, haptics, advanceToNext]);

  const handleFinish = useCallback(() => {
    haptics.playConfetti();
    const dealbreakers = ratedValues.filter(v => v.rating === 'dealbreaker').map(v => v.value);
    const growthEdges = ratedValues.filter(v => v.rating === 'growth_edge').map(v => v.value);
    const beautifulDifferences = ratedValues.filter(v => v.rating === 'beautiful_difference').map(v => v.value);

    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Tension Explorer',
      response: JSON.stringify({
        ratings: ratedValues,
        dealbreakers,
        growthEdges,
        beautifulDifferences,
      }),
      type: 'interactive',
    }];
    onComplete(responses);
  }, [ratedValues, haptics, onComplete]);

  // ─── Intro Phase ────────────────────────────────

  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.introContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>EXPLORING TENSIONS</Text>
        <Text style={styles.subtitle}>
          Not every value will overlap with your partner's {'\u2014'} and that's okay.
        </Text>
        <Text style={styles.body}>
          Differences don't have to be problems. Some stretch us to grow,
          some enrich our world, and some need honest conversation.
          Let's explore what each difference means to you.
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => { haptics.tap(); setPhase('rating'); }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>BEGIN</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Summary Phase ──────────────────────────────

  if (phase === 'summary') {
    const dealbreakers = ratedValues.filter(v => v.rating === 'dealbreaker');
    const growthEdges = ratedValues.filter(v => v.rating === 'growth_edge');
    const beautifulDiffs = ratedValues.filter(v => v.rating === 'beautiful_difference');

    return (
      <Animated.View style={[styles.summaryContainer, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.summaryContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>YOUR TENSION MAP</Text>

          {dealbreakers.length > 0 && (
            <View style={styles.groupSection}>
              <Text style={[styles.groupLabel, { color: MC6_PALETTE.tensionRed }]}>
                Dealbreakers
              </Text>
              {dealbreakers.map(v => (
                <View key={v.value} style={[styles.summaryCard, { borderLeftColor: MC6_PALETTE.tensionRed }]}>
                  <Text style={styles.summaryCardText}>{v.value}</Text>
                </View>
              ))}
            </View>
          )}

          {growthEdges.length > 0 && (
            <View style={styles.groupSection}>
              <Text style={[styles.groupLabel, { color: MC6_PALETTE.deepGold }]}>
                Growth Edges
              </Text>
              {growthEdges.map(v => (
                <View key={v.value} style={[styles.summaryCard, { borderLeftColor: MC6_PALETTE.deepGold }]}>
                  <Text style={styles.summaryCardText}>{v.value}</Text>
                </View>
              ))}
            </View>
          )}

          {beautifulDiffs.length > 0 && (
            <View style={styles.groupSection}>
              <Text style={[styles.groupLabel, { color: MC6_PALETTE.beautyBlue }]}>
                Beautiful Differences
              </Text>
              {beautifulDiffs.map(v => (
                <View key={v.value} style={[styles.summaryCard, { borderLeftColor: MC6_PALETTE.beautyBlue }]}>
                  <Text style={styles.summaryCardText}>{v.value}</Text>
                  {v.reframe ? (
                    <Text style={styles.reframePreview}>{v.reframe}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          <Text style={styles.encouragement}>
            {dealbreakers.length === 0
              ? 'You see your differences as opportunities. That takes real maturity.'
              : dealbreakers.length <= 2
                ? 'Naming dealbreakers honestly is the first step toward addressing them together.'
                : 'It takes courage to be honest about friction points. This clarity is a gift to your relationship.'}
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFinish}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Rating Phase ───────────────────────────────

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.ratingContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.progress}>
        Value {currentIndex + 1} of {tensionValues.length}
      </Text>

      {/* Value card */}
      <Animated.View style={[styles.valueCard, { opacity: cardAnim }]}>
        <Text style={styles.valueText}>{currentValue}</Text>
      </Animated.View>

      {/* Rating buttons */}
      <View style={styles.ratingsContainer}>
        {RATING_OPTIONS.map(opt => {
          const isSelected = selectedRating === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.ratingButton,
                { borderColor: opt.color },
                isSelected && { backgroundColor: opt.color },
              ]}
              onPress={() => handleRate(opt.key)}
              disabled={selectedRating !== null}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.ratingLabel,
                { color: opt.color },
                isSelected && { color: '#FFF' },
              ]}>
                {opt.label}
              </Text>
              <Text style={[
                styles.ratingDesc,
                isSelected && { color: 'rgba(255,255,255,0.85)' },
              ]}>
                {opt.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Reframe input for Beautiful Difference */}
      {selectedRating === 'beautiful_difference' && (
        <View style={styles.reframeSection}>
          <Text style={styles.reframePrompt}>
            How does this difference enrich your relationship?
          </Text>
          <View style={styles.reframeInputWrapper}>
            <TextInput
              style={styles.reframeInput}
              placeholder="Optional: describe the beauty in this difference..."
              placeholderTextColor={Colors.textMuted}
              value={reframeText}
              onChangeText={setReframeText}
              multiline
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity
            style={styles.reframeDoneButton}
            onPress={handleReframeSubmit}
            activeOpacity={0.7}
          >
            <Text style={styles.reframeDoneText}>
              {reframeText.trim() ? 'Save & Next' : 'Skip & Next'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  introContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  body: {
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // ─── Rating Phase ──────────────────
  ratingContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },
  progress: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  valueCard: {
    backgroundColor: MC6_PALETTE.softGold,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: MC6_PALETTE.deepGold,
    alignItems: 'center',
    ...Shadows.card,
  },
  valueText: {
    fontSize: 28,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: MC6_PALETTE.richGold,
    textAlign: 'center',
  },
  ratingsContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  ratingButton: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ratingDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // ─── Reframe Input ─────────────────
  reframeSection: {
    marginTop: Spacing.md,
  },
  reframePrompt: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: MC6_PALETTE.beautyBlue,
    marginBottom: Spacing.sm,
  },
  reframeInputWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: MC6_PALETTE.beautyBlue,
    backgroundColor: '#FFFCF7',
    overflow: 'hidden',
  },
  reframeInput: {
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 80,
    lineHeight: 22,
  },
  reframeDoneButton: {
    alignSelf: 'flex-end',
    backgroundColor: MC6_PALETTE.beautyBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.sm,
  },
  reframeDoneText: {
    color: '#FFF',
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
  },

  // ─── Summary Phase ─────────────────
  summaryContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  summaryContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  groupSection: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  groupLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  summaryCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    marginBottom: Spacing.xs,
    ...Shadows.subtle,
  },
  summaryCardText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  reframePreview: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 20,
  },
  encouragement: {
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 22,
  },
});
