/**
 * StoryVsTruth -- Step 3 "Story vs. Truth"
 *
 * A reframe exercise where users separate the "story" their mind tells
 * from what is actually true. Guides through writing a recurring thought,
 * examining it with slider questions, then rewriting from the partner's
 * perspective. Summary shows both narratives side by side.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows, Typography } from '@/constants/theme';
import type { MiniGameComponentProps } from '../StepMiniGame';

// -- Slider Question Data ---------------------------------------------------

interface SliderQuestion {
  id: string;
  question: string;
  lowLabel: string;
  highLabel: string;
}

const SLIDER_QUESTIONS: SliderQuestion[] = [
  {
    id: 'certainty',
    question: 'How certain am I this is the full truth?',
    lowLabel: 'Not at all',
    highLabel: 'Completely',
  },
  {
    id: 'frequency',
    question: 'How often does this thought show up?',
    lowLabel: 'Rarely',
    highLabel: 'Constantly',
  },
  {
    id: 'closingOff',
    question: 'How much does this thought close me off from my partner?',
    lowLabel: 'Not much',
    highLabel: 'A lot',
  },
];

// -- Custom Slider Component ------------------------------------------------

function TappableSlider({
  value,
  onChange,
  phaseColor,
  lowLabel,
  highLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  phaseColor: string;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <View style={sliderStyles.container}>
      <Text style={[sliderStyles.valueDisplay, { color: phaseColor }]}>
        {value > 0 ? value : '--'}
      </Text>
      <View style={sliderStyles.segmentRow}>
        {Array.from({ length: 10 }, (_, i) => {
          const segmentValue = i + 1;
          const isFilled = value >= segmentValue;
          return (
            <TouchableOpacity
              key={segmentValue}
              onPress={() => onChange(segmentValue)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Rating ${segmentValue} of 10`}
              style={[
                sliderStyles.segment,
                isFilled && { backgroundColor: phaseColor },
                !isFilled && sliderStyles.segmentEmpty,
              ]}
            >
              <Text
                style={[
                  sliderStyles.segmentText,
                  isFilled && { color: Colors.textOnPrimary },
                ]}
              >
                {segmentValue}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={sliderStyles.labelRow}>
        <Text style={sliderStyles.label}>{lowLabel}</Text>
        <Text style={sliderStyles.label}>{highLabel}</Text>
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  valueDisplay: {
    ...Typography.serifHeading,
    textAlign: 'center',
    fontSize: 28,
  },
  segmentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  segment: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentEmpty: {
    backgroundColor: Colors.borderLight,
  },
  segmentText: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textMuted,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});

// -- Main Component ---------------------------------------------------------

type Phase = 'intro' | 'writeStory' | 'examine' | 'partnerView' | 'summary';

export default function StoryVsTruth({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [story, setStory] = useState('');
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({
    certainty: 0,
    frequency: 0,
    closingOff: 0,
  });
  const [partnerPerspective, setPartnerPerspective] = useState('');

  const updateSlider = useCallback((id: string, value: number) => {
    setSliderValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const allSlidersAnswered = Object.values(sliderValues).every((v) => v > 0);

  const handleFinish = useCallback(() => {
    const certaintyScore = sliderValues.certainty;
    const frequencyScore = sliderValues.frequency;
    const closingOffScore = sliderValues.closingOff;

    const insights: string[] = [];

    if (certaintyScore <= 4) {
      insights.push(
        'You already sense this story may not be the full picture. That awareness is the beginning of freedom.'
      );
    } else if (certaintyScore <= 7) {
      insights.push(
        'There is some room for doubt in this story. Curiosity about your partner\'s experience can widen that space.'
      );
    } else {
      insights.push(
        'This story feels very real to you. The strongest stories often protect the deepest hurts beneath them.'
      );
    }

    if (closingOffScore >= 6) {
      insights.push(
        'This thought is creating distance. Naming it is the first step toward choosing closeness instead.'
      );
    }

    if (partnerPerspective.trim().length > 0) {
      insights.push(
        'Writing from your partner\'s perspective opens a door that the story tries to keep shut.'
      );
    }

    insights.push(
      'A story is not the truth. It is one interpretation among many. You can hold it gently without letting it drive.'
    );

    onComplete({
      title: 'Story vs. Truth',
      insights,
      data: {
        story,
        partnerPerspective,
        certaintyScore,
        frequencyScore,
        closingOffScore,
      },
    });
  }, [onComplete, story, partnerPerspective, sliderValues]);

  // -- Intro Screen --
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.introCard}>
            <Text style={[styles.stepLabel, { color: phaseColor }]}>STEP 3</Text>
            <Text style={styles.introTitle}>Story vs. Truth</Text>
            <View style={styles.divider} />
            <Text style={styles.introBody}>
              Our minds are storytellers. Sometimes the stories we tell ourselves about our
              partner are just that -- stories. Not lies, not delusions. Just one version of
              events, told through the lens of our own fears and wounds.
            </Text>
            <Text style={styles.introBody}>
              In this exercise, you will write down a recurring thought, examine it with
              gentle curiosity, and then try on a different perspective. There is no right
              answer -- only awareness.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('writeStory')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Begin exercise"
            >
              <Text style={styles.primaryButtonText}>BEGIN</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // -- Step 1: Write Story --
  if (phase === 'writeStory') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
              <Text style={[styles.progressText, { color: phaseColor }]}>1 of 3</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { backgroundColor: phaseColor, width: '33%' }]}
                />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.promptCard}>
              <Text style={styles.promptTitle}>The Story</Text>
              <View style={styles.promptLine} />
              <Text style={styles.promptText}>
                Think of a recurring thought about your partner or relationship that causes
                tension. It might start with "they always..." or "they never..." or "this
                means that..."
              </Text>
              <Text style={styles.promptHint}>
                Write it down exactly as it sounds in your mind.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(400).delay(300)}>
              <TextInput
                style={styles.textInput}
                placeholder="The story my mind tells..."
                placeholderTextColor={Colors.textMuted}
                value={story}
                onChangeText={setStory}
                multiline
                textAlignVertical="top"
                autoFocus={false}
                accessibilityRole="text"
                accessibilityLabel="Write the story your mind tells"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(400).delay(500)}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: phaseColor },
                  !story.trim() && styles.buttonDisabled,
                ]}
                onPress={() => story.trim() && setPhase('examine')}
                activeOpacity={0.8}
                disabled={!story.trim()}
                accessibilityRole="button"
                accessibilityLabel="Next"
                accessibilityState={{ disabled: !story.trim() }}
              >
                <Text style={styles.primaryButtonText}>NEXT</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // -- Step 2: Examine with Sliders --
  if (phase === 'examine') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
            <Text style={[styles.progressText, { color: phaseColor }]}>2 of 3</Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { backgroundColor: phaseColor, width: '66%' }]}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(100)}>
            <Text style={styles.examineIntro}>
              Now let's gently examine it.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.storyEcho}>
            <Text style={styles.storyEchoLabel}>YOUR STORY</Text>
            <Text style={styles.storyEchoText}>{story}</Text>
          </Animated.View>

          {SLIDER_QUESTIONS.map((q, index) => (
            <Animated.View
              key={q.id}
              entering={FadeInUp.duration(400).delay(400 + index * 200)}
              style={styles.sliderCard}
            >
              <Text style={styles.sliderQuestion}>{q.question}</Text>
              <TappableSlider
                value={sliderValues[q.id]}
                onChange={(v) => updateSlider(q.id, v)}
                phaseColor={phaseColor}
                lowLabel={q.lowLabel}
                highLabel={q.highLabel}
              />
            </Animated.View>
          ))}

          <Animated.View entering={FadeInUp.duration(400).delay(1000)}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: phaseColor },
                !allSlidersAnswered && styles.buttonDisabled,
              ]}
              onPress={() => allSlidersAnswered && setPhase('partnerView')}
              activeOpacity={0.8}
              disabled={!allSlidersAnswered}
              accessibilityRole="button"
              accessibilityLabel="Next"
              accessibilityState={{ disabled: !allSlidersAnswered }}
            >
              <Text style={styles.primaryButtonText}>NEXT</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // -- Step 3: Partner's Perspective --
  if (phase === 'partnerView') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
              <Text style={[styles.progressText, { color: phaseColor }]}>3 of 3</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { backgroundColor: phaseColor, width: '100%' }]}
                />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.promptCard}>
              <Text style={styles.promptTitle}>Another Truth</Text>
              <View style={styles.promptLine} />
              <Text style={styles.promptText}>
                Write the same situation, but from your partner's perspective. What might they
                be feeling? What might their version of this story sound like?
              </Text>
              <Text style={styles.promptHint}>
                You do not have to get it right. Just try it on.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(400).delay(300)}>
              <TextInput
                style={styles.textInput}
                placeholder="From my partner's perspective..."
                placeholderTextColor={Colors.textMuted}
                value={partnerPerspective}
                onChangeText={setPartnerPerspective}
                multiline
                textAlignVertical="top"
                autoFocus={false}
                accessibilityRole="text"
                accessibilityLabel="Write from your partner's perspective"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(400).delay(500)}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: phaseColor },
                  !partnerPerspective.trim() && styles.buttonDisabled,
                ]}
                onPress={() => partnerPerspective.trim() && setPhase('summary')}
                activeOpacity={0.8}
                disabled={!partnerPerspective.trim()}
                accessibilityRole="button"
                accessibilityLabel="See both sides"
                accessibilityState={{ disabled: !partnerPerspective.trim() }}
              >
                <Text style={styles.primaryButtonText}>SEE BOTH SIDES</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // -- Summary Screen --
  return (
    <View style={styles.container}>
      <Header onSkip={onSkip} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.summaryLabelContainer}>
          <Text style={[styles.summaryLabel, { color: phaseColor }]}>TWO PERSPECTIVES</Text>
        </Animated.View>

        {/* Side by side cards */}
        <View style={styles.sideBySide}>
          <Animated.View
            entering={FadeInDown.duration(500).delay(200)}
            style={[styles.perspectiveCard, styles.storyCard]}
          >
            <Text style={[styles.perspectiveLabel, { color: Colors.primary }]}>
              THE STORY I TELL
            </Text>
            <View style={styles.perspectiveDivider} />
            <Text style={styles.perspectiveText}>{story}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: Colors.primaryFaded }]}>
                <Text style={[styles.badgeText, { color: Colors.primary }]}>
                  Certainty: {sliderValues.certainty}/10
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: Colors.primaryFaded }]}>
                <Text style={[styles.badgeText, { color: Colors.primary }]}>
                  Frequency: {sliderValues.frequency}/10
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(500).delay(400)}
            style={[styles.perspectiveCard, styles.truthCard]}
          >
            <Text style={[styles.perspectiveLabel, { color: phaseColor }]}>
              ANOTHER TRUTH
            </Text>
            <View style={styles.perspectiveDivider} />
            <Text style={styles.perspectiveText}>{partnerPerspective}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: phaseColor + '20' }]}>
                <Text style={[styles.badgeText, { color: phaseColor }]}>
                  Closing off: {sliderValues.closingOff}/10
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.duration(400).delay(700)}>
          <Text style={styles.closingText}>
            Two stories. Neither is the whole truth. But noticing the gap between them --
            that is where understanding begins.
          </Text>
        </Animated.View>

        {Platform.OS === 'web' ? (
          <View>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={handleFinish}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={styles.primaryButtonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View entering={FadeInUp.duration(400).delay(900)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={handleFinish}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={styles.primaryButtonText}>CONTINUE</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

// -- Header Sub-Component ---------------------------------------------------

function Header({ onSkip }: { onSkip: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Story vs. Truth</Text>
      <TouchableOpacity
        onPress={onSkip}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Skip exercise"
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

// -- Styles -----------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.headingS,
    color: Colors.text,
  },
  skipText: {
    ...Typography.buttonSmall,
    color: Colors.textMuted,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  progressText: {
    ...Typography.label,
    minWidth: 50,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.progressTrack,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Intro
  introCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  stepLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  introTitle: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  introBody: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  // Prompt Cards
  promptCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  promptTitle: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  promptLine: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  promptText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  promptHint: {
    ...Typography.serifItalic,
    color: Colors.textMuted,
    fontSize: 15,
  },

  // Text Input
  textInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    minHeight: 100,
    ...Typography.inputText,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlignVertical: 'top',
  },

  // Examine
  examineIntro: {
    ...Typography.serifHeading,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  storyEcho: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primaryLight,
  },
  storyEchoLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    fontSize: 11,
  },
  storyEchoText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },

  // Slider Cards
  sliderCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  sliderQuestion: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
    fontSize: 16,
  },

  // Summary
  summaryLabelContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  summaryLabel: {
    ...Typography.label,
  },
  sideBySide: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  perspectiveCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  storyCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primaryFaded,
  },
  truthCard: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  perspectiveLabel: {
    ...Typography.label,
    marginBottom: Spacing.sm,
    fontSize: 12,
  },
  perspectiveDivider: {
    width: 30,
    height: 1.5,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  perspectiveText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    ...Typography.caption,
    fontFamily: FontFamilies.body,
    fontSize: 11,
  },

  // Closing
  closingText: {
    ...Typography.serifItalic,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },

  // Shared
  primaryButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 180,
    ...Shadows.subtle,
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
