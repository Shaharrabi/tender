/**
 * RelationshipManifesto -- Step 12 "Your Relationship Manifesto"
 *
 * The capstone exercise of the twelve-step journey. Users fill in 6
 * sentence stems to create a personalized relationship manifesto/vision.
 * The finished manifesto is displayed as a vintage certificate -- the most
 * beautiful card in the app.
 */

import React, { useState, useCallback, useRef } from 'react';
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

// -- Prompt Data ------------------------------------------------------------

interface ManifestoPrompt {
  id: string;
  stem: string;
  placeholder: string;
}

const PROMPTS: ManifestoPrompt[] = [
  {
    id: 'coupleWho',
    stem: 'We are a couple who',
    placeholder: 'loves deeply, laughs often, fights fair...',
  },
  {
    id: 'whenHard',
    stem: 'When things get hard, we choose to',
    placeholder: 'turn toward each other, not away...',
  },
  {
    id: 'protect',
    stem: 'We protect our connection by',
    placeholder: 'making time for each other, speaking honestly...',
  },
  {
    id: 'loveBuilding',
    stem: 'The love we are building is',
    placeholder: 'patient, resilient, worth the work...',
  },
  {
    id: 'promiseAlways',
    stem: 'We promise to always',
    placeholder: 'listen before reacting, choose kindness...',
  },
  {
    id: 'matters',
    stem: 'Our relationship matters because',
    placeholder: 'it makes us braver, softer, more whole...',
  },
];

// -- Main Component ---------------------------------------------------------

type Phase = 'intro' | 'prompts' | 'manifesto';

export default function RelationshipManifesto({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentInput, setCurrentInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const currentPrompt = PROMPTS[currentPromptIndex];
  const isLastPrompt = currentPromptIndex === PROMPTS.length - 1;

  const handleSubmitPrompt = useCallback(() => {
    if (!currentInput.trim()) return;

    const newResponses = { ...responses, [currentPrompt.id]: currentInput.trim() };
    setResponses(newResponses);
    setCurrentInput('');

    if (isLastPrompt) {
      setPhase('manifesto');
    } else {
      setCurrentPromptIndex((i) => i + 1);
    }
  }, [currentInput, currentPrompt, isLastPrompt, responses]);

  const buildFullManifesto = useCallback(() => {
    const parts = PROMPTS.map((p) => {
      const response = responses[p.id] || '...';
      return `${p.stem} ${response}.`;
    });
    return parts.join(' ');
  }, [responses]);

  const handleFinish = useCallback(() => {
    const fullManifesto = buildFullManifesto();

    onComplete({
      title: 'Your Relationship Manifesto',
      insights: [
        'You have walked twelve steps, and this manifesto is the voice of everything you have learned.',
        'Read this aloud together. Let the words land. They are yours now.',
        'A manifesto is not a contract -- it is a compass. Return to it whenever you need direction.',
      ],
      data: {
        responses,
        fullManifesto,
      },
    });
  }, [onComplete, responses, buildFullManifesto]);

  // -- Intro --
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(700).delay(100)} style={styles.introCard}>
            <Text style={[styles.stepLabel, { color: phaseColor }]}>STEP 12</Text>
            <Text style={styles.introTitle}>Your Relationship Manifesto</Text>
            <View style={styles.divider} />
            <Text style={styles.introBody}>
              You have walked the twelve steps. You have named your patterns, softened your
              startups, built your rituals, and looked honestly at the dance between you.
            </Text>
            <Text style={styles.introBody}>
              Now it is time to write the next chapter -- your vision for the relationship
              you are building together. Not the one you had, not the one you wish for, but
              the one you are choosing, right now, with open eyes and open hearts.
            </Text>
            <Text style={styles.introBodyAccent}>
              Six sentences. One declaration. Yours to keep.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(500)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('prompts')}
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

  // -- Prompt Phase (one at a time) --
  if (phase === 'prompts') {
    const progress = `${currentPromptIndex + 1} of ${PROMPTS.length}`;

    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Progress */}
            <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
              <Text style={[styles.progressText, { color: phaseColor }]}>{progress}</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: phaseColor,
                      width: `${((currentPromptIndex + 1) / PROMPTS.length) * 100}%`,
                    },
                  ]}
                />
              </View>
            </Animated.View>

            {/* Completed Prompts (faded) */}
            {currentPromptIndex > 0 && (
              <Animated.View entering={FadeIn.duration(300)} style={styles.completedContainer}>
                {PROMPTS.slice(0, currentPromptIndex).map((p) => (
                  <View key={p.id} style={styles.completedItem}>
                    <Text style={styles.completedStem}>{p.stem}</Text>
                    <Text style={styles.completedResponse}>{responses[p.id]}</Text>
                  </View>
                ))}
              </Animated.View>
            )}

            {/* Current Prompt */}
            <Animated.View
              key={currentPrompt.id}
              entering={FadeInDown.duration(500).delay(100)}
              style={styles.promptCard}
            >
              <Text style={styles.promptStem}>{currentPrompt.stem}</Text>
              <View style={styles.promptUnderline} />
            </Animated.View>

            <Animated.View
              key={`input-${currentPrompt.id}`}
              entering={FadeInUp.duration(400).delay(300)}
            >
              <TextInput
                style={styles.textInput}
                placeholder={currentPrompt.placeholder}
                placeholderTextColor={Colors.textMuted}
                value={currentInput}
                onChangeText={setCurrentInput}
                multiline
                textAlignVertical="top"
                autoFocus={false}
                accessibilityRole="text"
                accessibilityLabel={`${currentPrompt.stem}`}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(400).delay(500)}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: phaseColor },
                  !currentInput.trim() && styles.buttonDisabled,
                ]}
                onPress={handleSubmitPrompt}
                activeOpacity={0.8}
                disabled={!currentInput.trim()}
                accessibilityRole="button"
                accessibilityLabel={isLastPrompt ? 'Reveal my manifesto' : 'Next'}
                accessibilityState={{ disabled: !currentInput.trim() }}
              >
                <Text style={styles.primaryButtonText}>
                  {isLastPrompt ? 'REVEAL MY MANIFESTO' : 'NEXT'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // -- Manifesto Display --
  return (
    <View style={styles.container}>
      <Header onSkip={onSkip} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.manifestoLabelContainer}>
          <Text style={[styles.manifestoLabel, { color: phaseColor }]}>
            YOUR RELATIONSHIP MANIFESTO
          </Text>
        </Animated.View>

        {/* The Manifesto Card -- vintage certificate style */}
        <Animated.View entering={FadeInDown.duration(800).delay(300)} style={styles.manifestoOuter}>
          <View style={styles.manifestoMiddle}>
            <View style={styles.manifestoInner}>
              {/* Top ornament line */}
              <Text style={[styles.ornamentLine, { color: phaseColor + '60' }]}>
                {'\u2500\u2500\u2500\u2500  \u25C7  \u2500\u2500\u2500\u2500'}
              </Text>

              <Text style={styles.manifestoHeading}>A Declaration</Text>

              <View style={styles.manifestoBodyContainer}>
                {PROMPTS.map((prompt, index) => (
                  <Animated.View
                    key={prompt.id}
                    entering={FadeIn.duration(400).delay(600 + index * 200)}
                  >
                    <Text style={styles.manifestoSentence}>
                      <Text style={styles.manifestoStemText}>{prompt.stem} </Text>
                      <Text style={styles.manifestoResponseText}>
                        {responses[prompt.id] || '...'}
                      </Text>
                      <Text style={styles.manifestoStemText}>.</Text>
                    </Text>
                  </Animated.View>
                ))}
              </View>

              {/* Bottom ornament line */}
              <Text style={[styles.ornamentLine, { color: phaseColor + '60' }]}>
                {'\u2500\u2500\u2500\u2500  \u25C7  \u2500\u2500\u2500\u2500'}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(1800)}>
          <Text style={styles.keepText}>This is yours to keep.</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(2000)}>
          <Text style={styles.closingText}>
            Read it aloud. Together. Let the words become a bridge between who you have been
            and who you are becoming.
          </Text>
        </Animated.View>

        {Platform.OS === 'web' ? (
          <View>
            <TouchableOpacity
              style={[styles.finishButton, { backgroundColor: phaseColor }]}
              onPress={handleFinish}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Complete the journey"
            >
              <Text style={styles.finishButtonText}>COMPLETE THE JOURNEY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View entering={FadeInUp.duration(400).delay(2200)}>
            <TouchableOpacity
              style={[styles.finishButton, { backgroundColor: phaseColor }]}
              onPress={handleFinish}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Complete the journey"
            >
              <Text style={styles.finishButtonText}>COMPLETE THE JOURNEY</Text>
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
      <Text style={styles.headerTitle}>Your Manifesto</Text>
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
  introBodyAccent: {
    ...Typography.serifItalic,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // Completed Prompts
  completedContainer: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  completedItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: Spacing.xs,
    opacity: 0.5,
  },
  completedStem: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  completedResponse: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontStyle: 'italic',
    marginLeft: 4,
  },

  // Prompt Card
  promptCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  promptStem: {
    fontFamily: FontFamilies.accent,
    fontSize: 22,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  promptUnderline: {
    width: 60,
    height: 2,
    backgroundColor: Colors.accentGold + '50',
    marginTop: Spacing.md,
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

  // Manifesto Display
  manifestoLabelContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  manifestoLabel: {
    ...Typography.label,
    letterSpacing: 2.5,
  },

  // Triple-bordered certificate card
  manifestoOuter: {
    borderRadius: BorderRadius.xl + 4,
    padding: 4,
    backgroundColor: Colors.accentGold + '35',
    marginBottom: Spacing.lg,
    ...Shadows.elevated,
  },
  manifestoMiddle: {
    borderRadius: BorderRadius.xl + 2,
    padding: 3,
    backgroundColor: Colors.surfaceElevated,
  },
  manifestoInner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.accentCream + '15',
    borderWidth: 1,
    borderColor: Colors.accentGold + '25',
    alignItems: 'center',
  },

  ornamentLine: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    letterSpacing: 3,
    marginVertical: Spacing.md,
  },

  manifestoHeading: {
    fontFamily: FontFamilies.accent,
    fontSize: 14,
    color: Colors.textMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: Spacing.lg,
  },

  manifestoBodyContainer: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },

  manifestoSentence: {
    textAlign: 'center',
    lineHeight: 28,
  },
  manifestoStemText: {
    fontFamily: FontFamilies.accent,
    fontSize: 17,
    color: Colors.textSecondary,
  },
  manifestoResponseText: {
    fontFamily: 'PlayfairDisplay_600SemiBold_Italic',
    fontSize: 17,
    color: Colors.text,
    fontStyle: 'italic',
  },

  // Keep / Closing
  keepText: {
    ...Typography.label,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  closingText: {
    ...Typography.serifItalic,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },

  // Finish Button (special styling for the capstone)
  finishButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 220,
    ...Shadows.card,
  },
  finishButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
    letterSpacing: 2.5,
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
