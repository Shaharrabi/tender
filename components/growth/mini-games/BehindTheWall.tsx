/**
 * BehindTheWall -- Step 6 "Behind the Wall"
 *
 * A perspective-taking exercise that asks the user to imagine
 * their partner's inner experience during moments of distance
 * or defensiveness. Combines emotion/need chip selection with
 * reflective free writing.
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

const EMOTIONS = ['Hurt', 'Scared', 'Overwhelmed', 'Lonely', 'Ashamed', 'Exhausted'];
const NEEDS = ['Safety', 'Understanding', 'Space', 'Reassurance', 'Patience', 'To be seen'];

type Phase = 'intro' | 'scenario' | 'emotions' | 'needs' | 'message' | 'summary';

function generateInsights(emotions: string[], needs: string[], message: string): string[] {
  const insights: string[] = [];

  if (emotions.length > 0) {
    if (emotions.includes('Hurt') || emotions.includes('Lonely')) {
      insights.push('You can see that distance may mask deeper pain or loneliness');
    }
    if (emotions.includes('Scared') || emotions.includes('Ashamed')) {
      insights.push('You recognize that vulnerability often hides behind defensiveness');
    }
    if (emotions.includes('Overwhelmed') || emotions.includes('Exhausted')) {
      insights.push('You understand that withdrawal can be a sign of emotional overload');
    }
  }

  if (needs.length > 0) {
    if (needs.includes('Safety') || needs.includes('Reassurance')) {
      insights.push('Your partner may need reassurance that the relationship is safe');
    }
    if (needs.includes('To be seen') || needs.includes('Understanding')) {
      insights.push('Being truly seen and understood is a deep relational need');
    }
    if (needs.includes('Space') || needs.includes('Patience')) {
      insights.push('Sometimes the most loving response is patient space');
    }
  }

  if (message.toLowerCase().includes('sorry') || message.toLowerCase().includes('forgive')) {
    insights.push('Your words carry repair and compassion');
  }

  if (insights.length === 0) {
    insights.push('You are building the muscle of empathic imagination');
    insights.push('Seeing behind the wall is the beginning of true connection');
  }

  return insights.slice(0, 3);
}

export default function BehindTheWall({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const toggleChip = useCallback((item: string, list: string[], setter: (v: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(x => x !== item));
    } else {
      setter([...list, item]);
    }
  }, []);

  const handleComplete = useCallback(() => {
    const trimmedMessage = message.trim();
    const insights = generateInsights(selectedEmotions, selectedNeeds, trimmedMessage);
    onComplete({
      title: 'Behind the Wall',
      insights,
      data: {
        emotions: selectedEmotions,
        needs: selectedNeeds,
        message: trimmedMessage,
      },
    });
  }, [selectedEmotions, selectedNeeds, message, onComplete]);

  // --- Intro ---
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Behind the Wall</Text>
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
              <Text style={[styles.introAccentSymbol, { color: phaseColor }]}>||</Text>
            </View>
            <Text style={styles.introHeading}>What lies beneath</Text>
            <Text style={styles.introBody}>
              When we pull away, we build walls. But behind every wall is a feeling
              trying to protect itself.
            </Text>
            <Text style={styles.introBodySecondary}>
              This exercise invites you to look through your partner's eyes -- to
              imagine what they might be feeling when they seem most distant.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(500)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('scenario')}
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

  // --- Scenario prompt ---
  if (phase === 'scenario') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Behind the Wall</Text>
          <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} accessibilityRole="button" accessibilityLabel="Skip exercise">
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600)} style={styles.scenarioCard}>
            <Text style={styles.scenarioLabel}>Bring to mind</Text>
            <Text style={styles.scenarioText}>
              Think of a recent time your partner seemed distant, shut down, or defensive.
            </Text>
            <Text style={styles.scenarioSubtext}>
              Hold that moment gently. There is no blame here -- only curiosity.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('emotions')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="I have a moment in mind"
            >
              <Text style={styles.primaryButtonText}>I have a moment in mind</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // --- Emotions ---
  if (phase === 'emotions') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Behind the Wall</Text>
          <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} accessibilityRole="button" accessibilityLabel="Skip exercise">
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
            {[0, 1, 2].map(i => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i === 0 && { backgroundColor: phaseColor },
                ]}
              />
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.questionLabel}>Question 1 of 3</Text>
            <Text style={styles.questionText}>
              What might they have been feeling underneath?
            </Text>
            <Text style={styles.questionHint}>Select all that resonate</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.chipGrid}>
            {EMOTIONS.map((emotion, i) => {
              const selected = selectedEmotions.includes(emotion);
              return (
                <TouchableOpacity
                  key={emotion}
                  style={[
                    styles.chip,
                    selected && { backgroundColor: phaseColor + '18', borderColor: phaseColor },
                  ]}
                  onPress={() => toggleChip(emotion, selectedEmotions, setSelectedEmotions)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${emotion}${selected ? ', selected' : ''}`}
                  accessibilityState={{ selected }}
                >
                  <Text style={[
                    styles.chipText,
                    selected && { color: phaseColor },
                  ]}>
                    {emotion}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {showValidation && selectedEmotions.length === 0 && (
            <Animated.View entering={FadeIn.duration(300)}>
              <Text style={styles.validationText}>Select at least one feeling</Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.duration(400).delay(400)}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: phaseColor },
                selectedEmotions.length === 0 && styles.buttonDimmed,
              ]}
              onPress={() => {
                if (selectedEmotions.length === 0) {
                  setShowValidation(true);
                  return;
                }
                setShowValidation(false);
                setPhase('needs');
              }}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // --- Needs ---
  if (phase === 'needs') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Behind the Wall</Text>
          <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} accessibilityRole="button" accessibilityLabel="Skip exercise">
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
            {[0, 1, 2].map(i => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i <= 1 && { backgroundColor: i < 1 ? phaseColor + '60' : phaseColor },
                ]}
              />
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.questionLabel}>Question 2 of 3</Text>
            <Text style={styles.questionText}>
              What might they have needed in that moment?
            </Text>
            <Text style={styles.questionHint}>Select all that feel true</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.chipGrid}>
            {NEEDS.map((need) => {
              const selected = selectedNeeds.includes(need);
              return (
                <TouchableOpacity
                  key={need}
                  style={[
                    styles.chip,
                    selected && { backgroundColor: phaseColor + '18', borderColor: phaseColor },
                  ]}
                  onPress={() => toggleChip(need, selectedNeeds, setSelectedNeeds)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${need}${selected ? ', selected' : ''}`}
                  accessibilityState={{ selected }}
                >
                  <Text style={[
                    styles.chipText,
                    selected && { color: phaseColor },
                  ]}>
                    {need}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {showValidation && selectedNeeds.length === 0 && (
            <Animated.View entering={FadeIn.duration(300)}>
              <Text style={styles.validationText}>Select at least one need</Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.duration(400).delay(400)}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: phaseColor },
                selectedNeeds.length === 0 && styles.buttonDimmed,
              ]}
              onPress={() => {
                if (selectedNeeds.length === 0) {
                  setShowValidation(true);
                  return;
                }
                setShowValidation(false);
                setPhase('message');
              }}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // --- Message ---
  if (phase === 'message') {
    const isMessageValid = message.trim().length >= 10;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Behind the Wall</Text>
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
            {/* Progress */}
            <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
              {[0, 1, 2].map(i => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i <= 2 && { backgroundColor: i < 2 ? phaseColor + '60' : phaseColor },
                  ]}
                />
              ))}
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(500)}>
              <Text style={styles.questionLabel}>Question 3 of 3</Text>
              <Text style={styles.questionText}>
                What do you wish you could say to them about that moment?
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(500).delay(200)}>
              <View style={styles.writingArea}>
                <TextInput
                  style={styles.textInput}
                  value={message}
                  onChangeText={(t) => { setShowValidation(false); setMessage(t); }}
                  placeholder="Write to your partner..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  textAlignVertical="top"
                  autoFocus
                  accessibilityRole="text"
                  accessibilityLabel="Write a message to your partner about that moment"
                />
              </View>
              {showValidation && !isMessageValid && (
                <Animated.View entering={FadeIn.duration(300)}>
                  <Text style={styles.validationText}>Write a bit more...</Text>
                </Animated.View>
              )}
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(400).delay(400)}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: phaseColor },
                  !isMessageValid && styles.buttonDimmed,
                ]}
                onPress={() => {
                  if (!isMessageValid) {
                    setShowValidation(true);
                    return;
                  }
                  setPhase('summary');
                }}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="See what you discovered"
              >
                <Text style={styles.primaryButtonText}>See what you discovered</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // --- Summary ---
  const insights = generateInsights(selectedEmotions, selectedNeeds, message.trim());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Behind the Wall</Text>
        <TouchableOpacity onPress={onSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} accessibilityRole="button" accessibilityLabel="Skip exercise">
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
            <Text style={styles.summaryTitle}>Behind Their Wall</Text>
            <View style={styles.summaryDivider} />

            {/* Emotions */}
            <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.summarySection}>
              <Text style={styles.summarySectionLabel}>What they may have felt</Text>
              <View style={styles.summaryChipRow}>
                {selectedEmotions.map(emotion => (
                  <View
                    key={emotion}
                    style={[styles.summaryChip, { backgroundColor: phaseColor + '15', borderColor: phaseColor + '30' }]}
                  >
                    <Text style={[styles.summaryChipText, { color: phaseColor }]}>{emotion}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Needs */}
            <Animated.View entering={FadeInUp.duration(500).delay(400)} style={styles.summarySection}>
              <Text style={styles.summarySectionLabel}>What they may have needed</Text>
              <View style={styles.summaryChipRow}>
                {selectedNeeds.map(need => (
                  <View
                    key={need}
                    style={[styles.summaryChip, { backgroundColor: phaseColor + '15', borderColor: phaseColor + '30' }]}
                  >
                    <Text style={[styles.summaryChipText, { color: phaseColor }]}>{need}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Message */}
            <Animated.View entering={FadeInUp.duration(500).delay(600)} style={styles.summarySection}>
              <Text style={styles.summarySectionLabel}>Your words to them</Text>
              <View style={styles.messageQuoteCard}>
                <View style={[styles.quoteBar, { backgroundColor: phaseColor + '40' }]} />
                <Text style={styles.messageQuoteText}>{message.trim()}</Text>
              </View>
            </Animated.View>
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
    fontSize: 18,
    letterSpacing: -2,
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

  // Scenario
  scenarioCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  scenarioLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  scenarioText: {
    fontFamily: FontFamilies.accent,
    fontSize: 20,
    lineHeight: 30,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  scenarioSubtext: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // Questions
  questionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  questionText: {
    fontFamily: FontFamilies.accent,
    fontSize: 20,
    lineHeight: 30,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  questionHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },

  // Chip grid
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontFamily: FontFamilies.body,
  },

  // Writing area
  writingArea: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  textInput: {
    ...Typography.body,
    color: Colors.text,
    minHeight: 140,
    padding: Spacing.md,
    lineHeight: 28,
    textAlignVertical: 'top',
  },
  validationText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
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
  summarySection: {
    marginBottom: Spacing.lg,
  },
  summarySectionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  summaryChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  summaryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
  },
  summaryChipText: {
    ...Typography.bodySmall,
    fontFamily: FontFamilies.body,
  },
  messageQuoteCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  quoteBar: {
    width: 3,
    borderRadius: 2,
  },
  messageQuoteText: {
    ...Typography.serifItalic,
    color: Colors.text,
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
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
