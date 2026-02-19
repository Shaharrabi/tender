/**
 * RitualBuilder -- Step 7 "Ritual Builder"
 *
 * An interactive tool for creating a daily connection ritual.
 * Users pick a time of day, choose or create a ritual, then seal
 * their commitment. Summary produces a vintage "ritual card" keepsake.
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

// -- Moment & Ritual Data ---------------------------------------------------

interface Moment {
  id: string;
  label: string;
  description: string;
  symbol: string;       // simple text symbol for the card
  rituals: string[];
}

const MOMENTS: Moment[] = [
  {
    id: 'morning',
    label: 'Morning',
    description: 'The first minutes of the day',
    symbol: '\u25CB',   // circle (sun)
    rituals: [
      '2-minute coffee together, no phones',
      'A question to start the day',
      'One gratitude about each other',
      '6-second hug before anything else',
      'Read one sentence aloud together',
    ],
  },
  {
    id: 'departure',
    label: 'Before Departure',
    description: 'The moment before parting ways',
    symbol: '\u2192',   // arrow
    rituals: [
      'A real kiss goodbye, not a rushed one',
      'Tell each other one thing you are looking forward to',
      'A brief hand squeeze and eye contact',
      'Share one intention for the day',
    ],
  },
  {
    id: 'reunion',
    label: 'Reunion',
    description: 'Coming back together',
    symbol: '\u2229',   // intersection (meeting)
    rituals: [
      'Greeting at the door',
      '"How was your day -- really?"',
      '3 appreciations from today',
      'A 20-second hug before anything else',
    ],
  },
  {
    id: 'evening',
    label: 'Evening Wind-Down',
    description: 'The quiet transition into rest',
    symbol: '\u223D',   // tilde (wave)
    rituals: [
      'Phones down for the last hour together',
      'A walk around the block, just you two',
      'Cook or clean up together with music on',
      'Share the best and hardest part of the day',
    ],
  },
  {
    id: 'bedtime',
    label: 'Bedtime',
    description: 'The last moments of the day',
    symbol: '\u263E',   // crescent moon
    rituals: [
      'One thing I loved about today with you',
      'A small prayer or intention together',
      'Physical closeness ritual',
      'Three breaths together before sleep',
    ],
  },
];

// -- Main Component ---------------------------------------------------------

type Phase = 'intro' | 'pickMoment' | 'pickRitual' | 'commitment' | 'summary';

export default function RitualBuilder({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [selectedRitual, setSelectedRitual] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [customRitual, setCustomRitual] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const activeRitual = isCustom ? customRitual : selectedRitual;

  const handleSelectRitual = useCallback((ritual: string) => {
    setSelectedRitual(ritual);
    setIsCustom(false);
    setShowCustomInput(false);
  }, []);

  const handleCustomToggle = useCallback(() => {
    setShowCustomInput(true);
    setIsCustom(true);
    setSelectedRitual('');
  }, []);

  const handleSeal = useCallback(() => {
    setPhase('summary');
  }, []);

  const handleFinish = useCallback(() => {
    onComplete({
      title: 'Your Connection Ritual',
      insights: [
        'Research shows that small, consistent rituals of connection are more powerful than grand gestures.',
        'The ritual itself matters less than the intention behind it -- showing up, every day, on purpose.',
        'It takes about 7 days for a new ritual to start feeling natural. Be patient with the awkwardness.',
      ],
      data: {
        moment: selectedMoment?.label ?? '',
        ritual: activeRitual,
        isCustom,
      },
    });
  }, [onComplete, selectedMoment, activeRitual, isCustom]);

  // -- Intro --
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.introCard}>
            <Text style={[styles.stepLabel, { color: phaseColor }]}>STEP 7</Text>
            <Text style={styles.introTitle}>Ritual Builder</Text>
            <View style={styles.divider} />
            <Text style={styles.introBody}>
              The happiest couples don't leave connection to chance. They build tiny rituals
              into their days -- small, sacred moments that say "you matter to me" without
              needing a single word.
            </Text>
            <Text style={styles.introBody}>
              In this exercise, you will design one daily ritual of connection. Something
              small enough to sustain, meaningful enough to notice.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('pickMoment')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>BEGIN</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // -- Step 1: Pick Moment --
  if (phase === 'pickMoment') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
            <Text style={[styles.progressText, { color: phaseColor }]}>1 of 3</Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { backgroundColor: phaseColor, width: '33%' }]}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(100)}>
            <Text style={styles.sectionTitle}>Pick your moment</Text>
            <Text style={styles.sectionSubtitle}>
              When in your day would you like this ritual to live?
            </Text>
          </Animated.View>

          <View style={styles.momentGrid}>
            {MOMENTS.map((moment, index) => {
              const isSelected = selectedMoment?.id === moment.id;
              return (
                <Animated.View
                  key={moment.id}
                  entering={FadeInUp.duration(400).delay(200 + index * 100)}
                >
                  <TouchableOpacity
                    style={[
                      styles.momentCard,
                      isSelected && { borderColor: phaseColor, backgroundColor: phaseColor + '10' },
                    ]}
                    onPress={() => setSelectedMoment(moment)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.momentSymbol,
                        isSelected && { color: phaseColor },
                      ]}
                    >
                      {moment.symbol}
                    </Text>
                    <View style={styles.momentTextContainer}>
                      <Text
                        style={[
                          styles.momentLabel,
                          isSelected && { color: phaseColor },
                        ]}
                      >
                        {moment.label}
                      </Text>
                      <Text style={styles.momentDescription}>{moment.description}</Text>
                    </View>
                    {isSelected && (
                      <View style={[styles.momentIndicator, { backgroundColor: phaseColor }]} />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {selectedMoment && (
            <Animated.View entering={FadeInUp.duration(400)}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: phaseColor }]}
                onPress={() => setPhase('pickRitual')}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>NEXT</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    );
  }

  // -- Step 2: Pick Ritual --
  if (phase === 'pickRitual') {
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
              <Text style={[styles.progressText, { color: phaseColor }]}>2 of 3</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { backgroundColor: phaseColor, width: '66%' }]}
                />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(500).delay(100)}>
              <Text style={styles.sectionTitle}>Choose your ritual</Text>
              <Text style={styles.sectionSubtitle}>
                For your {selectedMoment?.label.toLowerCase()} moment, which feels right?
              </Text>
            </Animated.View>

            <View style={styles.ritualList}>
              {selectedMoment?.rituals.map((ritual, index) => {
                const isSelected = selectedRitual === ritual && !isCustom;
                return (
                  <Animated.View
                    key={index}
                    entering={FadeInUp.duration(400).delay(200 + index * 80)}
                  >
                    <TouchableOpacity
                      style={[
                        styles.ritualOption,
                        isSelected && { borderColor: phaseColor, backgroundColor: phaseColor + '10' },
                      ]}
                      onPress={() => handleSelectRitual(ritual)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.ritualRadio,
                          isSelected && { borderColor: phaseColor },
                        ]}
                      >
                        {isSelected && (
                          <View style={[styles.ritualRadioFill, { backgroundColor: phaseColor }]} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.ritualText,
                          isSelected && { color: Colors.text },
                        ]}
                      >
                        {ritual}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}

              <Animated.View
                entering={FadeInUp.duration(400).delay(200 + (selectedMoment?.rituals.length ?? 0) * 80)}
              >
                <TouchableOpacity
                  style={[
                    styles.ritualOption,
                    styles.customOption,
                    showCustomInput && { borderColor: phaseColor, backgroundColor: phaseColor + '10' },
                  ]}
                  onPress={handleCustomToggle}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.ritualRadio,
                      showCustomInput && { borderColor: phaseColor },
                    ]}
                  >
                    {showCustomInput && (
                      <View style={[styles.ritualRadioFill, { backgroundColor: phaseColor }]} />
                    )}
                  </View>
                  <Text style={[styles.ritualText, { fontStyle: 'italic' }]}>
                    Create my own...
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {showCustomInput && (
                <Animated.View entering={FadeIn.duration(300)}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Describe your ritual..."
                    placeholderTextColor={Colors.textMuted}
                    value={customRitual}
                    onChangeText={setCustomRitual}
                    multiline
                    textAlignVertical="top"
                    autoFocus
                  />
                </Animated.View>
              )}
            </View>

            {activeRitual.trim() && (
              <Animated.View entering={FadeInUp.duration(400)}>
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: phaseColor }]}
                  onPress={() => setPhase('commitment')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>NEXT</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // -- Step 3: Commitment Pledge --
  if (phase === 'commitment') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
            <Text style={[styles.progressText, { color: phaseColor }]}>3 of 3</Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { backgroundColor: phaseColor, width: '100%' }]}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.pledgeCard}>
            <Text style={[styles.pledgeLabel, { color: phaseColor }]}>YOUR PLEDGE</Text>
            <View style={styles.pledgeDividerTop} />
            <Text style={styles.pledgeText}>
              I commit to
            </Text>
            <Text style={styles.pledgeRitual}>
              "{activeRitual}"
            </Text>
            <Text style={styles.pledgeText}>
              at {selectedMoment?.label.toLowerCase()}
            </Text>
            <Text style={styles.pledgeText}>
              for the next 7 days.
            </Text>
            <View style={styles.pledgeDividerBottom} />
            <Text style={styles.pledgeNote}>
              It does not have to be perfect. It just has to happen.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(500)}>
            <TouchableOpacity
              style={[styles.sealButton, { backgroundColor: phaseColor }]}
              onPress={handleSeal}
              activeOpacity={0.8}
            >
              <Text style={styles.sealButtonText}>SEAL THIS RITUAL</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // -- Summary: Ritual Card Keepsake --
  return (
    <View style={styles.container}>
      <Header onSkip={onSkip} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.summaryLabelContainer}>
          <Text style={[styles.summaryLabel, { color: phaseColor }]}>YOUR RITUAL</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(700).delay(200)} style={styles.ritualCard}>
          <View style={styles.ritualCardInner}>
            {/* Top ornament */}
            <Text style={[styles.cardOrnament, { color: phaseColor }]}>
              {'\u2500\u2500\u2500  \u25C7  \u2500\u2500\u2500'}
            </Text>

            <Text style={styles.cardMomentLabel}>
              {selectedMoment?.symbol}  {selectedMoment?.label.toUpperCase()}
            </Text>

            <View style={styles.cardDivider} />

            <Text style={styles.cardRitualText}>
              {activeRitual}
            </Text>

            <View style={styles.cardDivider} />

            <Text style={styles.cardCommitment}>
              Sealed for seven days
            </Text>

            {/* Bottom ornament */}
            <Text style={[styles.cardOrnament, { color: phaseColor }]}>
              {'\u2500\u2500\u2500  \u25C7  \u2500\u2500\u2500'}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(600)}>
          <Text style={styles.keepText}>
            This is yours to keep.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(700)}>
          <Text style={styles.closingText}>
            The smallest rituals carry the most meaning -- because they say,
            every single day, "I choose us."
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(900)}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: phaseColor }]}
            onPress={handleFinish}
            activeOpacity={0.8}
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
      <Text style={styles.headerTitle}>Ritual Builder</Text>
      <TouchableOpacity onPress={onSkip} activeOpacity={0.7} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
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

  // Section Headings
  sectionTitle: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },

  // Moment Cards
  momentGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  momentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  momentSymbol: {
    fontFamily: FontFamilies.accent,
    fontSize: 24,
    color: Colors.textMuted,
    width: 36,
    textAlign: 'center',
  },
  momentTextContainer: {
    flex: 1,
    gap: 2,
  },
  momentLabel: {
    ...Typography.headingS,
    color: Colors.text,
    fontSize: 16,
  },
  momentDescription: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  momentIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Ritual Options
  ritualList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  ritualOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  customOption: {
    borderStyle: 'dashed',
  },
  ritualRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualRadioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  ritualText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },

  // Text Input
  textInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    minHeight: 80,
    ...Typography.inputText,
    color: Colors.text,
    textAlignVertical: 'top',
  },

  // Pledge Card
  pledgeCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  pledgeLabel: {
    ...Typography.label,
    marginBottom: Spacing.md,
  },
  pledgeDividerTop: {
    width: 50,
    height: 1.5,
    backgroundColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  pledgeText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  pledgeRitual: {
    ...Typography.serifHeading,
    color: Colors.text,
    textAlign: 'center',
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  pledgeDividerBottom: {
    width: 50,
    height: 1.5,
    backgroundColor: Colors.border,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  pledgeNote: {
    ...Typography.serifItalic,
    color: Colors.textMuted,
    textAlign: 'center',
    fontSize: 15,
  },

  // Seal Button
  sealButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 200,
    ...Shadows.card,
  },
  sealButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
    letterSpacing: 2.5,
  },

  // Summary - Ritual Card Keepsake
  summaryLabelContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  summaryLabel: {
    ...Typography.label,
  },
  ritualCard: {
    backgroundColor: Colors.accentCream + '30',
    borderRadius: BorderRadius.xl,
    padding: 3,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.accentGold + '50',
    ...Shadows.elevated,
  },
  ritualCardInner: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl - 2,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accentGold + '30',
  },
  cardOrnament: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    letterSpacing: 2,
    marginVertical: Spacing.sm,
  },
  cardMomentLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  cardDivider: {
    width: 40,
    height: 1,
    backgroundColor: Colors.accentGold + '40',
    marginVertical: Spacing.md,
  },
  cardRitualText: {
    fontFamily: FontFamilies.accent,
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: Spacing.sm,
  },
  cardCommitment: {
    ...Typography.serifItalic,
    color: Colors.textSecondary,
    fontSize: 15,
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
});
