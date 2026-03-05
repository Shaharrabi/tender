/**
 * TheThirdVoice -- Step 11 "The Third Voice"
 *
 * A reflective dialogue writing exercise where the user imagines
 * a wise "third voice" -- the relationship itself -- speaking about
 * what it needs, knows, and wants to say. The summary is rendered
 * as an elegant letter from the relationship to both partners.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import type { MiniGameComponentProps } from '../StepMiniGame';

const PROMPTS = [
  'If our relationship could speak, it would say it needs...',
  'The wisest part of our connection knows that...',
  'A message from our relationship to both of us would be...',
];

const PROMPT_LABELS = [
  'What it needs',
  'What it knows',
  'Its message to you both',
];

const MIN_CHARS = 10;

type Phase = 'intro' | 'writing' | 'summary';

function generateInsights(responses: string[]): string[] {
  const insights: string[] = [];
  const combined = responses.join(' ').toLowerCase();

  if (combined.includes('time') || combined.includes('patience') || combined.includes('slow')) {
    insights.push('Your relationship is asking for patience and unhurried attention');
  }
  if (combined.includes('trust') || combined.includes('safe') || combined.includes('security')) {
    insights.push('Safety and trust are at the heart of what your relationship needs');
  }
  if (combined.includes('listen') || combined.includes('hear') || combined.includes('understand')) {
    insights.push('Your relationship craves deeper listening and mutual understanding');
  }
  if (combined.includes('love') || combined.includes('care') || combined.includes('tender')) {
    insights.push('Love is the foundation your relationship wants to grow from');
  }
  if (combined.includes('forgive') || combined.includes('let go') || combined.includes('move')) {
    insights.push('Your relationship holds wisdom about forgiveness and release');
  }
  if (combined.includes('together') || combined.includes('team') || combined.includes('we')) {
    insights.push('Your relationship speaks in the language of "we" -- partnership is its nature');
  }
  if (combined.includes('grow') || combined.includes('change') || combined.includes('become')) {
    insights.push('Your relationship sees itself as a living, evolving thing');
  }
  if (combined.includes('joy') || combined.includes('play') || combined.includes('laugh') || combined.includes('fun')) {
    insights.push('Your relationship remembers the importance of lightness and play');
  }

  if (insights.length === 0) {
    insights.push('You have given your relationship a voice -- that alone is an act of care');
    insights.push('The third voice holds wisdom that neither partner carries alone');
  }

  return insights.slice(0, 3);
}

export default function TheThirdVoice({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState<string[]>(['', '', '']);
  const [showValidation, setShowValidation] = useState(false);

  const currentText = responses[currentPrompt] || '';
  const isValid = currentText.trim().length >= MIN_CHARS;

  const handleTextChange = useCallback((text: string) => {
    setShowValidation(false);
    setResponses(prev => {
      const updated = [...prev];
      updated[currentPrompt] = text;
      return updated;
    });
  }, [currentPrompt]);

  const handleContinue = useCallback(() => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }
    if (currentPrompt < PROMPTS.length - 1) {
      setCurrentPrompt(prev => prev + 1);
      setShowValidation(false);
    } else {
      setPhase('summary');
    }
  }, [isValid, currentPrompt]);

  const handleComplete = useCallback(() => {
    const trimmed = responses.map(r => r.trim());
    const insights = generateInsights(trimmed);
    onComplete({
      title: 'The Third Voice',
      insights,
      data: { responses: trimmed },
    });
  }, [responses, onComplete]);

  // --- Intro ---
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>The Third Voice</Text>
          <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} accessibilityRole="button" accessibilityLabel="Skip exercise">
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.introCard}>
            <View style={[styles.introAccent, { backgroundColor: phaseColor + '20' }]}>
              <Text style={[styles.introAccentSymbol, { color: phaseColor }]}>&</Text>
            </View>
            <Text style={styles.introHeading}>A voice between you</Text>
            <Text style={styles.introBody}>
              In every couple, there is a third presence -- the relationship itself.
              If your relationship could speak, what would it say?
            </Text>
            <Text style={styles.introBodySecondary}>
              This is an invitation to listen to the wisdom that lives between
              you and your partner. Let the words come without judgment.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(500)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('writing')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Begin"
            >
              <Text style={styles.primaryButtonText}>Begin</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // --- Writing ---
  if (phase === 'writing') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>The Third Voice</Text>
          <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} accessibilityRole="button" accessibilityLabel="Skip exercise">
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Progress dots */}
            <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
              {PROMPTS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i === currentPrompt && { backgroundColor: phaseColor },
                    i < currentPrompt && { backgroundColor: phaseColor + '60' },
                  ]}
                />
              ))}
            </Animated.View>

            {/* Prompt */}
            <Animated.View
              key={`prompt-${currentPrompt}`}
              entering={FadeInDown.duration(500)}
            >
              <Text style={styles.promptLabel}>
                Prompt {currentPrompt + 1} of {PROMPTS.length}
              </Text>
              <Text style={styles.promptText}>{PROMPTS[currentPrompt]}</Text>
            </Animated.View>

            {/* Sacred writing area */}
            <Animated.View
              key={`input-${currentPrompt}`}
              entering={FadeInUp.duration(500).delay(200)}
              style={styles.writingAreaOuter}
            >
              <View style={styles.writingArea}>
                {/* Subtle lined paper effect */}
                <View style={styles.linedPaper} pointerEvents="none">
                  {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <View key={i} style={styles.paperLine} />
                  ))}
                </View>
                <TextInput
                  style={styles.textInput}
                  value={currentText}
                  onChangeText={handleTextChange}
                  placeholder="Let the relationship speak..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  textAlignVertical="top"
                  autoFocus
                  accessibilityRole="text"
                  accessibilityLabel={`Prompt ${currentPrompt + 1}: ${PROMPTS[currentPrompt]}`}
                />
              </View>
              {showValidation && !isValid && (
                <Animated.View entering={FadeIn.duration(300)}>
                  <Text style={styles.validationText}>Write a bit more...</Text>
                </Animated.View>
              )}
            </Animated.View>

            {/* Continue button */}
            <Animated.View entering={FadeInUp.duration(400).delay(400)}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: phaseColor },
                  !isValid && styles.buttonDimmed,
                ]}
                onPress={handleContinue}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={currentPrompt < PROMPTS.length - 1 ? 'Continue' : 'Hear the voice'}
              >
                <Text style={styles.primaryButtonText}>
                  {currentPrompt < PROMPTS.length - 1 ? 'Continue' : 'Hear the voice'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // --- Summary ---
  const insights = generateInsights(responses.map(r => r.trim()));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>The Third Voice</Text>
        <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Elegant letter card */}
        <Animated.View entering={FadeInDown.duration(700)} style={styles.letterCard}>
          <View style={[styles.letterBorder, { borderColor: phaseColor + '30' }]}>
            <View style={[styles.letterCornerTL, { borderColor: phaseColor + '25' }]} />
            <View style={[styles.letterCornerBR, { borderColor: phaseColor + '25' }]} />

            <Text style={styles.letterTitle}>The Third Voice Speaks</Text>
            <View style={[styles.letterTitleRule, { backgroundColor: phaseColor + '30' }]} />

            {responses.map((response, i) => (
              <Animated.View
                key={i}
                entering={FadeInUp.duration(600).delay(300 + i * 250)}
                style={styles.letterSection}
              >
                <Text style={styles.letterSectionLabel}>{PROMPT_LABELS[i]}</Text>
                <Text style={styles.letterQuote}>"{response.trim()}"</Text>
                {i < responses.length - 1 && (
                  <View style={styles.letterSectionDivider}>
                    <Text style={[styles.letterDividerSymbol, { color: phaseColor + '40' }]}>*</Text>
                  </View>
                )}
              </Animated.View>
            ))}

            <View style={[styles.letterClosingRule, { backgroundColor: phaseColor + '30' }]} />
            <Text style={styles.letterClosing}>
              -- Your relationship, speaking
            </Text>
          </View>
        </Animated.View>

        {/* Insights */}
        <Animated.View entering={FadeInUp.duration(500).delay(1100)} style={styles.insightsSection}>
          <Text style={styles.insightsHeading}>What we noticed</Text>
          {insights.map((insight, i) => (
            <View key={i} style={styles.insightRow}>
              <View style={[styles.insightDot, { backgroundColor: phaseColor }]} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(1400)}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: phaseColor }]}
            onPress={handleComplete}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Save to Journal"
          >
            <Text style={styles.primaryButtonText}>Save to Journal</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.headingM,
    color: Colors.text,
  },
  skipText: {
    ...Typography.buttonSmall,
    color: Colors.textMuted,
  },

  // Scroll
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
  },

  // Intro
  introCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  introAccent: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  introAccentSymbol: {
    fontFamily: FontFamilies.accent,
    fontSize: 22,
  },
  introHeading: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  introBody: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 26,
  },
  introBodySecondary: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Primary button
  primaryButton: {
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    ...Shadows.subtle,
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  buttonDimmed: {
    opacity: 0.6,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },

  // Prompt
  promptLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  promptText: {
    fontFamily: FontFamilies.accent,
    fontSize: 20,
    lineHeight: 32,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },

  // Writing area -- sacred / elevated feel
  writingAreaOuter: {
    marginBottom: Spacing.lg,
  },
  writingArea: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  linedPaper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Spacing.md + 24,
    paddingHorizontal: Spacing.md,
  },
  paperLine: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 29,
  },
  textInput: {
    fontFamily: FontFamilies.body,
    fontSize: 16,
    color: Colors.text,
    minHeight: 200,
    padding: Spacing.md,
    lineHeight: 30,
    letterSpacing: 0.3,
    textAlignVertical: 'top',
  },
  validationText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    paddingLeft: Spacing.xs,
  },

  // Letter card -- elegant bordered presentation
  letterCard: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  letterBorder: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    ...Shadows.card,
    overflow: 'hidden',
  },
  letterCornerTL: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  letterCornerBR: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  letterTitle: {
    ...Typography.serifHeading,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  letterTitleRule: {
    height: 1,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  letterSection: {
    marginBottom: Spacing.md,
  },
  letterSectionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  letterQuote: {
    fontFamily: FontFamilies.accent,
    fontSize: 17,
    lineHeight: 28,
    color: Colors.text,
    fontStyle: 'italic',
  },
  letterSectionDivider: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  letterDividerSymbol: {
    fontFamily: FontFamilies.accent,
    fontSize: 16,
    letterSpacing: 4,
  },
  letterClosingRule: {
    height: 1,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  letterClosing: {
    ...Typography.serifItalic,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
  },

  // Insights
  insightsSection: {
    marginBottom: Spacing.lg,
  },
  insightsHeading: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  insightText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
});
