/**
 * TheUnsaid -- Step 5 "The Unsaid"
 *
 * A reflective writing exercise about things left unspoken
 * in the relationship. Three prompts guide the user through
 * naming what they carry silently, culminating in a
 * "Letter to Yourself" summary card.
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
  'Something I\'ve been wanting to say but haven\'t found the words for...',
  'A feeling I often hold back because...',
  'If I could speak without fear, I would say...',
];

const MIN_CHARS = 10;

type Phase = 'intro' | 'writing' | 'summary';

function generateInsights(responses: string[]): string[] {
  const insights: string[] = [];
  const combined = responses.join(' ').toLowerCase();

  if (combined.includes('afraid') || combined.includes('fear') || combined.includes('scared') || combined.includes('worry')) {
    insights.push('Fear plays a role in what you leave unspoken');
  }
  if (combined.includes('love') || combined.includes('care') || combined.includes('miss')) {
    insights.push('Your unspoken words carry tenderness and longing');
  }
  if (combined.includes('hurt') || combined.includes('pain') || combined.includes('wound')) {
    insights.push('You are carrying unspoken hurt that deserves to be heard');
  }
  if (combined.includes('need') || combined.includes('want') || combined.includes('wish')) {
    insights.push('You have unmet needs waiting to be expressed');
  }
  if (combined.includes('sorry') || combined.includes('regret') || combined.includes('guilt')) {
    insights.push('There are words of repair you have been holding onto');
  }
  if (combined.includes('judg') || combined.includes('reject') || combined.includes('laugh')) {
    insights.push('Fear of judgment holds you back from speaking freely');
  }
  if (combined.includes('vulnerab') || combined.includes('open') || combined.includes('honest')) {
    insights.push('You are carrying words about vulnerability');
  }

  if (insights.length === 0) {
    insights.push('You have given voice to something that was previously silent');
    insights.push('Naming the unsaid is the first step toward being heard');
  }

  return insights.slice(0, 3);
}

function getSnippet(text: string, maxLen: number = 60): string {
  if (text.length <= maxLen) return text;
  const trimmed = text.substring(0, maxLen);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 20 ? trimmed.substring(0, lastSpace) : trimmed) + '...';
}

export default function TheUnsaid({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
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
      title: 'The Unsaid',
      insights,
      data: { responses: trimmed },
    });
  }, [responses, onComplete]);

  // --- Intro ---
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>The Unsaid</Text>
          <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
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
              <Text style={[styles.introAccentSymbol, { color: phaseColor }]}>~</Text>
            </View>
            <Text style={styles.introHeading}>Words that wait</Text>
            <Text style={styles.introBody}>
              Every relationship holds unspoken words — things we carry silently.
              This is a safe space to name them.
            </Text>
            <Text style={styles.introBodySecondary}>
              There are no right answers here. Only honest ones.
              Take your time with each prompt.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(500)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('writing')}
              activeOpacity={0.85}
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
          <Text style={styles.headerTitle}>The Unsaid</Text>
          <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
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

            {/* Writing area — lined paper style */}
            <Animated.View
              key={`input-${currentPrompt}`}
              entering={FadeInUp.duration(500).delay(200)}
              style={styles.writingAreaOuter}
            >
              <View style={styles.writingArea}>
                <View style={styles.linedPaper}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <View key={i} style={styles.paperLine} />
                  ))}
                </View>
                <TextInput
                  style={styles.textInput}
                  value={currentText}
                  onChangeText={handleTextChange}
                  placeholder="Write here..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  textAlignVertical="top"
                  autoFocus
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
              >
                <Text style={styles.primaryButtonText}>
                  {currentPrompt < PROMPTS.length - 1 ? 'Continue' : 'See your letter'}
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
        <Text style={styles.headerTitle}>The Unsaid</Text>
        <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.summaryCard}>
          <View style={[styles.summaryCardBorder, { borderColor: phaseColor + '40' }]}>
            <Text style={styles.summaryTitle}>A Letter to Yourself</Text>
            <View style={styles.summaryDivider} />

            {responses.map((response, i) => (
              <Animated.View
                key={i}
                entering={FadeInUp.duration(500).delay(200 + i * 200)}
                style={styles.summaryEntry}
              >
                <Text style={styles.summaryPromptLabel}>{PROMPTS[i]}</Text>
                <Text style={styles.summaryResponseText}>
                  {getSnippet(response.trim(), 120)}
                </Text>
                {i < responses.length - 1 && (
                  <View style={styles.summaryEntrySeparator} />
                )}
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Insights */}
        <Animated.View entering={FadeInUp.duration(500).delay(800)} style={styles.insightsSection}>
          <Text style={styles.insightsHeading}>What we noticed</Text>
          {insights.map((insight, i) => (
            <View key={i} style={styles.insightRow}>
              <View style={[styles.insightDot, { backgroundColor: phaseColor }]} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(1100)}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: phaseColor }]}
            onPress={handleComplete}
            activeOpacity={0.85}
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
    paddingBottom: Spacing.xxxl,
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
    lineHeight: 30,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },

  // Writing area — lined paper
  writingAreaOuter: {
    marginBottom: Spacing.lg,
  },
  writingArea: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  linedPaper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Spacing.md + 20,
    paddingHorizontal: Spacing.md,
  },
  paperLine: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 27,
  },
  textInput: {
    ...Typography.body,
    color: Colors.text,
    minHeight: 180,
    padding: Spacing.md,
    lineHeight: 28,
    textAlignVertical: 'top',
  },
  validationText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    paddingLeft: Spacing.xs,
  },

  // Summary
  summaryCard: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  summaryCardBorder: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  summaryTitle: {
    ...Typography.serifHeading,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.lg,
  },
  summaryEntry: {
    marginBottom: Spacing.md,
  },
  summaryPromptLabel: {
    fontFamily: FontFamilies.accent,
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  summaryResponseText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
  summaryEntrySeparator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginTop: Spacing.md,
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
