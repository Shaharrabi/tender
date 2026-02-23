/**
 * L2: Temperature Check — Relationship temperature timeline
 *
 * User rates their relationship "temperature" (0-100) across 4 eras:
 * Early Days, Settled In, Rough Patch, Right Now.
 * Creates a visual journey chart. Insight about where play disappeared.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { MC9_PALETTE } from '@/constants/mc9Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Phase = 'intro' | 'rating' | 'chart' | 'insight';

interface L2TemperatureCheckProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

const ERAS = [
  {
    id: 'early',
    label: 'Early Days',
    subtitle: 'The beginning of your relationship',
    prompt: 'How warm and playful were things at the start?',
  },
  {
    id: 'settled',
    label: 'Settled In',
    subtitle: 'After the honeymoon phase',
    prompt: 'Once you settled into routines, how was the warmth?',
  },
  {
    id: 'rough',
    label: 'A Rough Patch',
    subtitle: 'A difficult period (if any)',
    prompt: 'During your hardest time together, how cold did things get?',
  },
  {
    id: 'now',
    label: 'Right Now',
    subtitle: 'Where you are today',
    prompt: 'What is the temperature of your relationship right now?',
  },
];

const TEMP_LABELS = [
  { min: 0, max: 20, label: 'Frozen', color: '#64B5F6' },
  { min: 21, max: 40, label: 'Cool', color: '#81D4FA' },
  { min: 41, max: 60, label: 'Warm', color: MC9_PALETTE.sunshine },
  { min: 61, max: 80, label: 'Hot', color: '#FF8A65' },
  { min: 81, max: 100, label: 'On Fire', color: '#E57373' },
];

function getTempLabel(value: number) {
  return TEMP_LABELS.find(t => value >= t.min && value <= t.max) ?? TEMP_LABELS[2];
}

function getTempColor(value: number): string {
  if (value <= 20) return '#64B5F6';
  if (value <= 40) return '#81D4FA';
  if (value <= 60) return MC9_PALETTE.sunshine;
  if (value <= 80) return '#FF8A65';
  return '#E57373';
}

export function L2TemperatureCheck({ content, attachmentStyle, onComplete }: L2TemperatureCheckProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentEra, setCurrentEra] = useState(0);
  const [temperatures, setTemperatures] = useState<number[]>([]);
  const [sliderValue, setSliderValue] = useState(50);

  const chartFade = useRef(new Animated.Value(0)).current;
  const insightFade = useRef(new Animated.Value(0)).current;

  const paragraphs = content.readContent.split('\n\n').filter(Boolean);

  const handleStartRating = useCallback(() => {
    haptics.tap();
    setPhase('rating');
  }, [haptics]);

  const handleSetTemperature = useCallback(() => {
    haptics.tap();
    const newTemps = [...temperatures, sliderValue];
    setTemperatures(newTemps);

    if (currentEra < ERAS.length - 1) {
      setCurrentEra(prev => prev + 1);
      setSliderValue(50);
    } else {
      // All eras rated — show chart
      setPhase('chart');
      Animated.timing(chartFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [haptics, temperatures, sliderValue, currentEra, chartFade]);

  const handleShowInsight = useCallback(() => {
    haptics.playExerciseReveal();
    setPhase('insight');
    Animated.timing(insightFade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [haptics, insightFade]);

  const handleContinue = useCallback(() => {
    haptics.tap();

    const highestEra = temperatures.indexOf(Math.max(...temperatures));
    const lowestEra = temperatures.indexOf(Math.min(...temperatures));

    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Relationship temperature timeline',
        response: JSON.stringify({
          temperatures: ERAS.map((era, i) => ({
            era: era.label,
            temperature: temperatures[i],
          })),
          highestEra: ERAS[highestEra]?.label,
          lowestEra: ERAS[lowestEra]?.label,
        }),
        type: 'interactive',
      },
    ];
    onComplete(responses);
  }, [haptics, temperatures, onComplete]);

  // Slider touch handling (simple tap-based for web compat)
  const handleSliderTap = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    setSliderValue(clamped);
    haptics.tap();
  }, [haptics]);

  // ─── Intro ───────────────────────────────────

  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>RELATIONSHIP TEMPERATURE</Text>
        <Text style={styles.subtitle}>
          How warm has your relationship been at different stages?
        </Text>

        {paragraphs.slice(0, 3).map((p, i) => (
          <View key={i} style={styles.textCard}>
            <Text style={styles.textContent}>{p}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartRating}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>Start Temperature Check</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Rating Phase ────────────────────────────

  if (phase === 'rating') {
    const era = ERAS[currentEra];
    const tempInfo = getTempLabel(sliderValue);
    const fillColor = getTempColor(sliderValue);

    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress dots */}
        <View style={styles.dotsRow}>
          {ERAS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < currentEra && styles.dotComplete,
                i === currentEra && styles.dotCurrent,
              ]}
            />
          ))}
        </View>

        <Text style={styles.eraLabel}>{era.label}</Text>
        <Text style={styles.eraSubtitle}>{era.subtitle}</Text>
        <Text style={styles.eraPrompt}>{era.prompt}</Text>

        {/* Thermometer */}
        <View style={styles.thermometerContainer}>
          <View style={styles.thermometer}>
            <View
              style={[
                styles.thermometerFill,
                {
                  height: `${sliderValue}%`,
                  backgroundColor: fillColor,
                },
              ]}
            />
          </View>
          <Text style={[styles.tempValue, { color: fillColor }]}>
            {sliderValue}
          </Text>
          <Text style={[styles.tempLabel, { color: fillColor }]}>
            {tempInfo.label}
          </Text>
        </View>

        {/* Slider buttons (simple increment/decrement for cross-platform) */}
        <View style={styles.sliderControls}>
          <TouchableOpacity
            style={styles.sliderButton}
            onPress={() => handleSliderTap(Math.max(0, sliderValue - 10))}
            activeOpacity={0.7}
          >
            <Text style={styles.sliderButtonText}>- 10</Text>
          </TouchableOpacity>

          <View style={styles.quickButtons}>
            {[10, 30, 50, 70, 90].map(val => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.quickButton,
                  sliderValue === val && { backgroundColor: fillColor },
                ]}
                onPress={() => handleSliderTap(val)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.quickButtonText,
                    sliderValue === val && { color: '#FFF' },
                  ]}
                >
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.sliderButton}
            onPress={() => handleSliderTap(Math.min(100, sliderValue + 10))}
            activeOpacity={0.7}
          >
            <Text style={styles.sliderButtonText}>+ 10</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.lockButton, { backgroundColor: fillColor }]}
          onPress={handleSetTemperature}
          activeOpacity={0.7}
        >
          <Text style={styles.lockButtonText}>
            Set {era.label} Temperature
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Chart Phase ─────────────────────────────

  if (phase === 'chart') {
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);
    const chartHeight = 160;

    return (
      <Animated.View style={[styles.fullContainer, { opacity: chartFade }]}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>YOUR TEMPERATURE JOURNEY</Text>

          {/* Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {temperatures.map((temp, i) => {
                const barHeight = Math.max(8, (temp / 100) * chartHeight);
                const color = getTempColor(temp);
                return (
                  <View key={i} style={styles.chartColumn}>
                    <Text style={[styles.chartValue, { color }]}>{temp}</Text>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: barHeight,
                          backgroundColor: color,
                        },
                      ]}
                    />
                    <Text style={styles.chartLabel}>{ERAS[i].label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Era cards */}
          {temperatures.map((temp, i) => (
            <View key={i} style={styles.eraCard}>
              <View style={styles.eraCardHeader}>
                <View
                  style={[
                    styles.eraCardDot,
                    { backgroundColor: getTempColor(temp) },
                  ]}
                />
                <Text style={styles.eraCardTitle}>{ERAS[i].label}</Text>
                <Text style={[styles.eraCardTemp, { color: getTempColor(temp) }]}>
                  {temp} - {getTempLabel(temp).label}
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.insightButton}
            onPress={handleShowInsight}
            activeOpacity={0.7}
          >
            <Text style={styles.insightButtonText}>
              What does this tell me?
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Insight Phase ───────────────────────────

  const highIdx = temperatures.indexOf(Math.max(...temperatures));
  const lowIdx = temperatures.indexOf(Math.min(...temperatures));
  const currentTemp = temperatures[3] ?? 50;
  const diff = (temperatures[0] ?? 50) - currentTemp;

  return (
    <Animated.View style={[styles.fullContainer, { opacity: insightFade }]}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>WHAT YOUR JOURNEY REVEALS</Text>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Your warmest era</Text>
          <Text style={styles.insightText}>
            {ERAS[highIdx]?.label} ({temperatures[highIdx]}).
            This is where play, connection, and positive energy were highest.
            What was different then? What made warmth possible?
          </Text>
        </View>

        {diff > 15 && (
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>The temperature gap</Text>
            <Text style={styles.insightText}>
              There is a {diff}-degree difference between your early days and now.
              This is not unusual. Research shows most couples experience a
              natural cooling. The question is not "how do we go back?" but
              "what warmth is possible from here?"
            </Text>
          </View>
        )}

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Play is the thermostat</Text>
          <Text style={styles.insightText}>
            Gottman found that couples who maintain playfulness, humor, and
            fondness have higher relationship satisfaction — regardless of
            conflict levels. Play does not fix problems. But it creates the
            warmth in which problems become more solvable.
          </Text>
        </View>

        <View style={[styles.insightCard, styles.insightCardHighlight]}>
          <Text style={styles.insightTitle}>Your temperature right now: {currentTemp}</Text>
          <Text style={styles.insightText}>
            {currentTemp >= 60
              ? 'There is warmth here to build on. The next lessons will help you protect and grow it.'
              : currentTemp >= 30
                ? 'There is room to warm things up. Playfulness is not about pretending everything is fine — it is about remembering that you also like each other.'
                : 'The temperature is low. That is honest data, not a verdict. Sometimes the bravest thing is to notice the cold and choose to light a small fire anyway.'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.continueButtonText}>Continue to Reflection</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fullContainer: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // Intro text
  textCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  textContent: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  startButton: {
    marginTop: Spacing.lg,
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    ...Shadows.subtle,
  },
  startButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.body,
  },

  // Rating phase
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.borderLight,
  },
  dotComplete: {
    backgroundColor: Colors.success,
  },
  dotCurrent: {
    backgroundColor: MC9_PALETTE.sunshine,
  },
  eraLabel: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  eraSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  eraPrompt: {
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },

  // Thermometer
  thermometerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  thermometer: {
    width: 40,
    height: 160,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  thermometerFill: {
    width: '100%',
    borderRadius: 20,
  },
  tempValue: {
    fontSize: FontSizes.headingXL ?? 32,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
  },
  tempLabel: {
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

  // Slider controls
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sliderButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  quickButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickButtonText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  lockButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    ...Shadows.subtle,
  },
  lockButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.body,
  },

  // Chart
  chartContainer: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  chartValue: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },
  chartBar: {
    width: 32,
    borderRadius: 16,
    minHeight: 8,
  },
  chartLabel: {
    fontSize: FontSizes.caption - 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  // Era cards in chart view
  eraCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  eraCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  eraCardDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  eraCardTitle: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  eraCardTemp: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },

  // Insight
  insightButton: {
    marginTop: Spacing.md,
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    ...Shadows.subtle,
  },
  insightButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
  insightCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.sm,
  },
  insightCardHighlight: {
    borderLeftWidth: 3,
    borderLeftColor: MC9_PALETTE.sunshine,
  },
  insightTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: MC9_PALETTE.deepSunshine,
  },
  insightText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },

  // Continue
  continueButton: {
    marginTop: Spacing.xl,
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    ...Shadows.subtle,
  },
  continueButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
});
