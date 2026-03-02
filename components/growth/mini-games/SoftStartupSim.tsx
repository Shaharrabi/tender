/**
 * SoftStartupSim -- Step 9 "Soft Startup Simulator"
 *
 * Practice converting harsh startups into soft ones.
 * Users read harsh examples, pick the best soft alternative from 3 options,
 * get feedback, then write their own soft startup. Summary shows score
 * and their custom attempt.
 */

import React, { useState, useCallback, useMemo } from 'react';
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

// -- Scenario Data ----------------------------------------------------------

interface StartupOption {
  text: string;
  quality: 'best' | 'good' | 'close';
  feedback: string;
}

interface Scenario {
  id: string;
  harsh: string;
  context: string;
  options: StartupOption[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'dishes',
    harsh: 'You never help with the dishes. I do everything around here!',
    context: 'The kitchen is a mess after dinner, and the frustration has been building.',
    options: [
      {
        text: 'I feel overwhelmed when the dishes pile up. Could we figure out a way to share that together?',
        quality: 'best',
        feedback: 'This names the feeling, describes the situation without blame, and makes a clear, gentle request.',
      },
      {
        text: 'I need more help with the kitchen. It would mean a lot if you could do the dishes tonight.',
        quality: 'good',
        feedback: 'This is a good start -- it makes a specific request. Adding the "I feel" would make it even softer.',
      },
      {
        text: 'You could at least try to notice that the dishes need doing without me having to ask.',
        quality: 'close',
        feedback: 'This still carries a "you should" tone. Softening it with your own feeling removes the sting.',
      },
    ],
  },
  {
    id: 'phone',
    harsh: 'You are always on your phone. You care more about your screen than about me.',
    context: 'You have been trying to talk, but your partner keeps scrolling.',
    options: [
      {
        text: 'When you are on your phone while we are talking, I feel invisible. I need some of your undivided attention tonight.',
        quality: 'best',
        feedback: 'Perfect structure: names the specific situation, the feeling, and the need. No accusations.',
      },
      {
        text: 'I feel lonely when we are in the same room but not really together. Can we put phones away for a bit?',
        quality: 'good',
        feedback: 'Beautiful and honest. Adding the specific trigger ("when you are on your phone") makes it even clearer.',
      },
      {
        text: 'I just wish you would put the phone down when I am talking to you.',
        quality: 'close',
        feedback: 'The wish is there, but it reads as a demand. Leading with your feeling softens the landing.',
      },
    ],
  },
  {
    id: 'plans',
    harsh: 'You always make plans without asking me. My opinion clearly doesn\'t matter.',
    context: 'Your partner committed to weekend plans without checking with you first.',
    options: [
      {
        text: 'I felt left out when I heard about the weekend plans. I need us to check in with each other before committing our time.',
        quality: 'best',
        feedback: 'This shares the hurt without attacking. The request is specific and forward-looking.',
      },
      {
        text: 'It hurt my feelings when plans were made without me. Can we talk about how to decide things together?',
        quality: 'good',
        feedback: 'Honest and vulnerable. Naming the specific situation ("the weekend plans") would add clarity.',
      },
      {
        text: 'Next time, can you at least ask me before making plans for both of us?',
        quality: 'close',
        feedback: '"At least" carries some edge. Sharing why it matters to you invites cooperation instead of compliance.',
      },
    ],
  },
  {
    id: 'late',
    harsh: 'You are late again. You clearly have no respect for my time.',
    context: 'Your partner arrived 30 minutes late to something important to you.',
    options: [
      {
        text: 'When you arrived late tonight, I felt unimportant. I need to know that my time matters to you.',
        quality: 'best',
        feedback: 'Clean and direct. Names the event, the feeling, and the need without any global accusations.',
      },
      {
        text: 'I was really looking forward to tonight and felt disappointed when the timing didn\'t work out. Can we talk about it?',
        quality: 'good',
        feedback: 'Gentle and non-blaming. Being slightly more direct about what happened can add helpful clarity.',
      },
      {
        text: 'I need you to be on time when something is important to me.',
        quality: 'close',
        feedback: 'The need is clear, but it sounds like a command. Leading with your feeling turns it into an invitation.',
      },
    ],
  },
];

// -- Main Component ---------------------------------------------------------

type Phase = 'intro' | 'scenarios' | 'buildOwn' | 'summary';

interface ScenarioResult {
  scenarioId: string;
  selectedQuality: string;
  selectedText: string;
}

export default function SoftStartupSim({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [customStartup, setCustomStartup] = useState('');

  const score = useMemo(() => {
    return results.filter((r) => r.selectedQuality === 'best').length;
  }, [results]);

  const handleSelectOption = useCallback((index: number) => {
    if (showFeedback) return; // prevent re-selection
    setSelectedOption(index);
    setShowFeedback(true);
  }, [showFeedback]);

  const handleNextScenario = useCallback(() => {
    const scenario = SCENARIOS[currentIndex];
    const option = scenario.options[selectedOption!];

    const newResults = [
      ...results,
      {
        scenarioId: scenario.id,
        selectedQuality: option.quality,
        selectedText: option.text,
      },
    ];
    setResults(newResults);

    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setPhase('buildOwn');
    }
  }, [currentIndex, selectedOption, results]);

  const handleFinish = useCallback(() => {
    const totalBest = results.filter((r) => r.selectedQuality === 'best').length;

    const insights: string[] = [];

    if (totalBest === SCENARIOS.length) {
      insights.push(
        'You have a natural ear for soft startups. This skill will transform difficult conversations.'
      );
    } else if (totalBest >= SCENARIOS.length / 2) {
      insights.push(
        'You are developing a strong sense for gentle beginnings. Practice will sharpen it further.'
      );
    } else {
      insights.push(
        'Soft startups take practice. The fact that you are here, learning this, is what matters most.'
      );
    }

    insights.push(
      'Research shows that how a conversation begins predicts how it ends 96% of the time.'
    );
    insights.push(
      'The formula is simple: "I feel [feeling] about [specific situation]. I need [request]."'
    );

    onComplete({
      title: 'Soft Startup Practice',
      insights,
      data: {
        score: totalBest,
        totalScenarios: SCENARIOS.length,
        customStartup,
        responses: results.map((r) => r.selectedText),
      },
    });
  }, [onComplete, results, customStartup]);

  // -- Intro --
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.introCard}>
            <Text style={[styles.stepLabel, { color: phaseColor }]}>STEP 9</Text>
            <Text style={styles.introTitle}>Soft Startup Simulator</Text>
            <View style={styles.divider} />
            <Text style={styles.introBody}>
              How a conversation begins determines how it ends. 96% of the time. The
              difference between a harsh startup and a soft one is often just a few words --
              but those words change everything.
            </Text>
            <Text style={styles.introBody}>
              In this exercise, you will practice spotting the gentlest way to start a
              difficult conversation. Then you will write one of your own.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('scenarios')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Begin"
            >
              <Text style={styles.primaryButtonText}>BEGIN</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // -- Scenario Phase --
  if (phase === 'scenarios') {
    const scenario = SCENARIOS[currentIndex];
    const progress = `${currentIndex + 1} of ${SCENARIOS.length}`;

    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
            <Text style={[styles.progressText, { color: phaseColor }]}>{progress}</Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: phaseColor, width: `${((currentIndex + 1) / SCENARIOS.length) * 100}%` },
                ]}
              />
            </View>
          </Animated.View>

          {/* Harsh Startup */}
          <Animated.View
            key={scenario.id}
            entering={FadeInDown.duration(500).delay(100)}
            style={styles.harshCard}
          >
            <Text style={styles.harshLabel}>HARSH STARTUP</Text>
            <Text style={styles.harshText}>"{scenario.harsh}"</Text>
            <Text style={styles.contextText}>{scenario.context}</Text>
          </Animated.View>

          {/* Options */}
          <Animated.View entering={FadeInUp.duration(400).delay(300)}>
            <Text style={styles.pickPrompt}>Which is the softest way to say this?</Text>
          </Animated.View>

          {scenario.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isBest = option.quality === 'best';
            const showResult = showFeedback;

            let borderColor = Colors.borderLight;
            let bgColor = Colors.surface;

            if (showResult) {
              if (isBest) {
                borderColor = Colors.success;
                bgColor = Colors.success + '10';
              } else if (isSelected) {
                borderColor = Colors.accentGold;
                bgColor = Colors.accentGold + '10';
              }
            } else if (isSelected) {
              borderColor = phaseColor;
              bgColor = phaseColor + '10';
            }

            return (
              <Animated.View
                key={index}
                entering={FadeInUp.duration(400).delay(400 + index * 100)}
              >
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    { borderColor, backgroundColor: bgColor },
                  ]}
                  onPress={() => handleSelectOption(index)}
                  activeOpacity={0.7}
                  disabled={showFeedback}
                  accessibilityRole="button"
                  accessibilityLabel={`Option ${index + 1}: ${option.text}`}
                  accessibilityState={{ disabled: showFeedback }}
                >
                  <Text style={styles.optionText}>{option.text}</Text>

                  {showResult && isBest && (
                    <View style={styles.feedbackRow}>
                      <Text style={[styles.feedbackIcon, { color: Colors.success }]}>
                        {'\u2713'}
                      </Text>
                      <Text style={[styles.feedbackLabel, { color: Colors.success }]}>
                        Ideal
                      </Text>
                    </View>
                  )}

                  {showResult && !isBest && isSelected && (
                    <View style={styles.feedbackRow}>
                      <Text style={[styles.feedbackIcon, { color: Colors.accentGold }]}>
                        {'\u223C'}
                      </Text>
                      <Text style={[styles.feedbackLabel, { color: Colors.accentGold }]}>
                        Close, but...
                      </Text>
                    </View>
                  )}

                  {showResult && (isSelected || isBest) && (
                    <Text style={styles.feedbackText}>{option.feedback}</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {/* Next Button */}
          {showFeedback && (
            <Animated.View entering={FadeInUp.duration(400).delay(200)}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: phaseColor, marginTop: Spacing.md }]}
                onPress={handleNextScenario}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={currentIndex < SCENARIOS.length - 1 ? 'Next' : 'Build your own'}
              >
                <Text style={styles.primaryButtonText}>
                  {currentIndex < SCENARIOS.length - 1 ? 'NEXT' : 'BUILD YOUR OWN'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    );
  }

  // -- Build Your Own --
  if (phase === 'buildOwn') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.buildCard}>
              <Text style={styles.buildTitle}>Your Turn</Text>
              <View style={styles.buildDivider} />
              <Text style={styles.buildText}>
                Think of a complaint or frustration you have been carrying.
                Now write it as a soft startup.
              </Text>
              <View style={styles.guideBox}>
                <Text style={styles.guideLabel}>THE FORMULA</Text>
                <Text style={styles.guideText}>
                  "I feel..." {'\u2192'} about "a specific situation..." {'\u2192'} "I need..."
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(400).delay(300)}>
              <TextInput
                style={styles.textInput}
                placeholder="I feel... about... I need..."
                placeholderTextColor={Colors.textMuted}
                value={customStartup}
                onChangeText={setCustomStartup}
                multiline
                textAlignVertical="top"
                autoFocus={false}
                accessibilityRole="text"
                accessibilityLabel="Write your own soft startup"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(400).delay(500)}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: phaseColor },
                  !customStartup.trim() && styles.buttonDisabled,
                ]}
                onPress={() => customStartup.trim() && setPhase('summary')}
                activeOpacity={0.8}
                disabled={!customStartup.trim()}
                accessibilityRole="button"
                accessibilityLabel="See my results"
                accessibilityState={{ disabled: !customStartup.trim() }}
              >
                <Text style={styles.primaryButtonText}>SEE MY RESULTS</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // -- Summary --
  const totalBest = results.filter((r) => r.selectedQuality === 'best').length;

  return (
    <View style={styles.container}>
      <Header onSkip={onSkip} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.summaryLabelContainer}>
          <Text style={[styles.summaryLabel, { color: phaseColor }]}>YOUR RESULTS</Text>
        </Animated.View>

        {/* Score Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>SOFT STARTUP SCORE</Text>
          <Text style={[styles.scoreNumber, { color: phaseColor }]}>
            {totalBest}/{SCENARIOS.length}
          </Text>
          <Text style={styles.scoreSubtext}>
            {totalBest === SCENARIOS.length
              ? 'Every one, perfectly soft.'
              : totalBest >= SCENARIOS.length / 2
              ? 'A strong foundation to build on.'
              : 'Every attempt at softness is a step forward.'}
          </Text>
        </Animated.View>

        {/* Custom Startup Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.customCard}>
          <Text style={styles.customLabel}>YOUR SOFT STARTUP</Text>
          <View style={styles.customDivider} />
          <Text style={styles.customText}>{customStartup}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(600)}>
          <Text style={styles.closingText}>
            Softness is not weakness. It is the choice to lead with vulnerability instead of
            armor. That takes more courage than any harsh word ever could.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(800)}>
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
      </ScrollView>
    </View>
  );
}

// -- Header Sub-Component ---------------------------------------------------

function Header({ onSkip }: { onSkip: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Soft Startup Simulator</Text>
      <TouchableOpacity onPress={onSkip} activeOpacity={0.7} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} accessibilityRole="button" accessibilityLabel="Skip exercise">
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
    paddingBottom: Spacing.xxxl,
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

  // Harsh Card
  harshCard: {
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.error + '20',
  },
  harshLabel: {
    ...Typography.label,
    color: Colors.error,
    marginBottom: Spacing.sm,
    fontSize: 11,
  },
  harshText: {
    fontFamily: FontFamilies.accent,
    fontSize: 17,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.sm,
  },
  contextText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  // Pick Prompt
  pickPrompt: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: Spacing.md,
    fontSize: 16,
  },

  // Option Cards
  optionCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    ...Shadows.subtle,
  },
  optionText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  feedbackIcon: {
    fontFamily: FontFamilies.heading,
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackLabel: {
    ...Typography.label,
    fontSize: 12,
  },
  feedbackText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
    lineHeight: 20,
  },

  // Build Your Own
  buildCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  buildTitle: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  buildDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  buildText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  guideBox: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentGold,
  },
  guideLabel: {
    ...Typography.label,
    color: Colors.accentGold,
    marginBottom: Spacing.xs,
    fontSize: 11,
  },
  guideText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
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

  // Summary
  summaryLabelContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  summaryLabel: {
    ...Typography.label,
  },

  // Score Card
  scoreCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  scoreLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  scoreNumber: {
    fontFamily: FontFamilies.accent,
    fontSize: 48,
    lineHeight: 56,
    marginBottom: Spacing.sm,
  },
  scoreSubtext: {
    ...Typography.serifItalic,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
  },

  // Custom Startup Card
  customCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
    ...Shadows.card,
  },
  customLabel: {
    ...Typography.label,
    color: Colors.success,
    marginBottom: Spacing.sm,
    fontSize: 11,
  },
  customDivider: {
    width: 30,
    height: 1.5,
    backgroundColor: Colors.success + '40',
    marginBottom: Spacing.md,
  },
  customText: {
    fontFamily: FontFamilies.accent,
    fontSize: 17,
    color: Colors.text,
    lineHeight: 26,
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
