/**
 * L5: Lightness Ritual — Build a personalized play ritual
 *
 * 4-step ritual builder: When, What, How Long, Mood Setter.
 * Assembled into a beautiful ritual card with commitment stamp.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
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
import { SparkleIcon, CheckmarkIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'build' | 'review' | 'commit';

interface RitualOption {
  id: string;
  label: string;
  description: string;
}

interface L5LightnessRitualProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

const BUILD_STEPS = [
  {
    title: 'When?',
    subtitle: 'Pick the time that feels most natural',
    options: [
      { id: 'morning', label: 'Morning', description: 'Start the day with lightness' },
      { id: 'evening', label: 'After Dinner', description: 'Wind down together playfully' },
      { id: 'weekend', label: 'Weekend', description: 'A dedicated play window' },
      { id: 'spontaneous', label: 'Spontaneous', description: 'No schedule, just a signal' },
    ],
  },
  {
    title: 'What?',
    subtitle: 'Choose your play activity',
    options: [
      { id: 'dance', label: 'Kitchen Dance', description: 'One song, no choreography needed' },
      { id: 'game', label: 'Quick Game', description: 'Cards, word games, 20 questions' },
      { id: 'explore', label: 'Micro-Adventure', description: 'Walk somewhere new, try a new food' },
      { id: 'create', label: 'Make Something', description: 'Cook, draw, build together' },
      { id: 'story', label: 'Story Time', description: 'Share a memory, dream up a trip' },
      { id: 'silly', label: 'Be Ridiculous', description: 'Accents, impressions, pure silliness' },
    ],
  },
  {
    title: 'How Long?',
    subtitle: 'Play does not need to be long to be powerful',
    options: [
      { id: '5min', label: '5 Minutes', description: 'A micro-dose of play' },
      { id: '10min', label: '10 Minutes', description: 'Enough to shift the mood' },
      { id: '15min', label: '15 Minutes', description: 'A real play session' },
      { id: 'open', label: 'Open-ended', description: 'Let it run until it naturally ends' },
    ],
  },
  {
    title: 'Mood Setter',
    subtitle: 'What shifts you into play mode?',
    options: [
      { id: 'music', label: 'Music', description: 'Put on a favorite playlist or song' },
      { id: 'outdoors', label: 'Go Outside', description: 'Fresh air resets the nervous system' },
      { id: 'screens-off', label: 'Screens Off', description: 'The simplest signal: phones away' },
      { id: 'candles', label: 'Change the Light', description: 'Candles, dimmer, fairy lights' },
      { id: 'touch', label: 'Physical Start', description: 'A hug, a hand hold, a shoulder touch' },
    ],
  },
];

export function L5LightnessRitual({ content, attachmentStyle, onComplete }: L5LightnessRitualProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [buildStep, setBuildStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, RitualOption>>({});
  const [stamped, setStamped] = useState(false);

  const stampScale = useRef(new Animated.Value(0)).current;
  const stampOpacity = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(0)).current;

  const paragraphs = content.readContent.split('\n\n').filter(Boolean);

  const handleStartBuild = useCallback(() => {
    haptics.tap();
    setPhase('build');
  }, [haptics]);

  const handleSelectOption = useCallback((option: RitualOption) => {
    haptics.tap();
    setSelections(prev => ({ ...prev, [buildStep]: option }));

    if (buildStep < BUILD_STEPS.length - 1) {
      setBuildStep(prev => prev + 1);
    } else {
      // All steps complete — show review
      setPhase('review');
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [haptics, buildStep, cardFade]);

  const handleStamp = useCallback(() => {
    haptics.playExerciseReveal();
    setStamped(true);
    setPhase('commit');

    Animated.parallel([
      Animated.spring(stampScale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(stampOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [haptics, stampScale, stampOpacity]);

  const handleContinue = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Lightness ritual',
        response: JSON.stringify({
          when: selections[0]?.label,
          what: selections[1]?.label,
          howLong: selections[2]?.label,
          moodSetter: selections[3]?.label,
        }),
        type: 'interactive',
      },
    ];
    onComplete(responses);
  }, [haptics, selections, onComplete]);

  // ─── Intro ───────────────────────────────────

  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>BUILD YOUR PLAY RITUAL</Text>
        <Text style={styles.subtitle}>
          A ritual is a promise to come back to lightness together.
        </Text>

        {paragraphs.slice(0, 3).map((p, i) => (
          <View key={i} style={styles.textCard}>
            <Text style={styles.textContent}>{p}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartBuild}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>Build My Ritual</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Build Phase ─────────────────────────────

  if (phase === 'build') {
    const step = BUILD_STEPS[buildStep];
    if (!step) return null;

    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={styles.stepIndicator}>
          {BUILD_STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i < buildStep && styles.stepDotComplete,
                i === buildStep && styles.stepDotCurrent,
              ]}
            />
          ))}
        </View>

        {/* Ritual card preview */}
        {Object.keys(selections).length > 0 && (
          <View style={styles.previewCard}>
            {Object.entries(selections).map(([stepIdx, option]) => (
              <View key={stepIdx} style={styles.previewRow}>
                <Text style={styles.previewLabel}>
                  {BUILD_STEPS[parseInt(stepIdx)]?.title}
                </Text>
                <Text style={styles.previewValue}>{option.label}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.buildTitle}>{step.title}</Text>
        <Text style={styles.buildSubtitle}>{step.subtitle}</Text>

        <View style={styles.optionsGrid}>
          {step.options.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleSelectOption(option)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDesc}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  // ─── Review / Commit ─────────────────────────

  return (
    <Animated.View style={[styles.fullContainer, { opacity: cardFade }]}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>YOUR LIGHTNESS RITUAL</Text>

        <View style={styles.ritualCard}>
          <View style={styles.ritualHeader}>
            <SparkleIcon size={24} color={MC9_PALETTE.sunshine} />
            <Text style={styles.ritualTitle}>Play Ritual</Text>
          </View>

          <View style={styles.ritualBody}>
            <View style={styles.ritualRow}>
              <Text style={styles.ritualLabel}>When</Text>
              <Text style={styles.ritualValue}>
                {selections[0]?.label ?? '—'}
              </Text>
            </View>
            <View style={styles.ritualDivider} />
            <View style={styles.ritualRow}>
              <Text style={styles.ritualLabel}>What</Text>
              <Text style={styles.ritualValue}>
                {selections[1]?.label ?? '—'}
              </Text>
            </View>
            <View style={styles.ritualDivider} />
            <View style={styles.ritualRow}>
              <Text style={styles.ritualLabel}>Duration</Text>
              <Text style={styles.ritualValue}>
                {selections[2]?.label ?? '—'}
              </Text>
            </View>
            <View style={styles.ritualDivider} />
            <View style={styles.ritualRow}>
              <Text style={styles.ritualLabel}>Mood Setter</Text>
              <Text style={styles.ritualValue}>
                {selections[3]?.label ?? '—'}
              </Text>
            </View>
          </View>

          {/* Stamp overlay */}
          {stamped && (
            <Animated.View
              style={[
                styles.stampOverlay,
                {
                  opacity: stampOpacity,
                  transform: [{ scale: stampScale }],
                },
              ]}
            >
              <View style={styles.stampCircle}>
                <CheckmarkIcon size={32} color={MC9_PALETTE.sunshine} />
                <Text style={styles.stampText}>Committed</Text>
              </View>
            </Animated.View>
          )}
        </View>

        {!stamped ? (
          <TouchableOpacity
            style={styles.stampButton}
            onPress={handleStamp}
            activeOpacity={0.7}
          >
            <Text style={styles.stampButtonText}>
              I commit to this ritual
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.commitMessage}>
            <Text style={styles.commitText}>
              This ritual is now part of your relationship toolkit.
              It does not need to be perfect. It just needs to happen.
              Even one minute of intentional play changes the chemistry
              between you.
            </Text>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.7}
            >
              <Text style={styles.continueButtonText}>
                Continue to Reflection
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: Spacing.scrollPadBottom,
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

  // Intro
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

  // Build phase
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.borderLight,
  },
  stepDotComplete: {
    backgroundColor: Colors.success,
  },
  stepDotCurrent: {
    backgroundColor: MC9_PALETTE.sunshine,
  },

  previewCard: {
    backgroundColor: MC9_PALETTE.softPeach + '60',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: 4,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  previewValue: {
    fontSize: FontSizes.caption,
    color: MC9_PALETTE.deepSunshine,
    fontWeight: '600',
  },

  buildTitle: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  buildSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  optionsGrid: {
    gap: Spacing.sm,
  },
  optionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: MC9_PALETTE.sunshine + '30',
    ...Shadows.subtle,
    gap: 4,
  },
  optionLabel: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  optionDesc: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Ritual card
  ritualCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: MC9_PALETTE.sunshine,
    ...Shadows.subtle,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  ritualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: MC9_PALETTE.sunshine + '15',
    borderBottomWidth: 1,
    borderBottomColor: MC9_PALETTE.sunshine + '30',
  },
  ritualTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: MC9_PALETTE.deepSunshine,
  },
  ritualBody: {
    padding: Spacing.lg,
  },
  ritualRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  ritualLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  ritualValue: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  ritualDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },

  // Stamp
  stampOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  stampCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: MC9_PALETTE.sunshine,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    gap: 4,
  },
  stampText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: MC9_PALETTE.deepSunshine,
    fontFamily: FontFamilies.heading,
  },

  stampButton: {
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    ...Shadows.subtle,
  },
  stampButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.body,
  },

  // Commit
  commitMessage: {
    gap: Spacing.lg,
    alignItems: 'center',
  },
  commitText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    ...Shadows.subtle,
  },
  continueButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
});
