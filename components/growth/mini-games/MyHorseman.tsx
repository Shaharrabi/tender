/**
 * MyHorseman -- Step 4 "My Horseman"
 *
 * Identifies which of Gottman's Four Horsemen the user tends toward
 * under stress, then reveals the corresponding antidote. Presented
 * with warmth and zero judgment -- a vintage postcard aesthetic.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows, Typography } from '@/constants/theme';
import type { MiniGameComponentProps } from '../StepMiniGame';

// ── Horseman Types ───────────────────────────────────────

type Horseman = 'criticism' | 'contempt' | 'defensiveness' | 'stonewalling';

interface HorsemanInfo {
  name: string;
  description: string;
  antidote: string;
  antidoteDescription: string;
  reframe: string;
}

const HORSEMAN_DATA: Record<Horseman, HorsemanInfo> = {
  criticism: {
    name: 'Criticism',
    description:
      'When you are hurt, you tend to name what is wrong with your partner rather than what you need from them. The frustration is real -- but it lands as an attack on who they are, not what happened.',
    antidote: 'Gentle Start-Up',
    antidoteDescription:
      'Begin with "I" instead of "You." Name what you feel and what you need, without diagnosing your partner. "I felt overlooked when..." instead of "You never..."',
    reframe:
      'Behind every criticism is an unmet need trying to be heard. You are not a critic by nature -- you are someone who cares deeply and has not yet found the softer words.',
  },
  contempt: {
    name: 'Contempt',
    description:
      'Under pressure, a part of you pulls rank -- through sarcasm, eye-rolling, or a tone that says "I am above this." It is the most corrosive horseman, and it often masks deep disappointment.',
    antidote: 'Building a Culture of Appreciation',
    antidoteDescription:
      'Actively name what your partner does well. Express gratitude for small things. Contempt dissolves in an atmosphere where both people feel valued and respected.',
    reframe:
      'Contempt usually grows where admiration once lived. The fact that you feel this strongly means something mattered to you deeply. The way back is through remembering what you once admired.',
  },
  defensiveness: {
    name: 'Defensiveness',
    description:
      'When something lands as blame, you reflexively explain, justify, or counter-attack. It is a shield -- but it blocks your partner from feeling heard, even when their delivery was imperfect.',
    antidote: 'Taking Responsibility',
    antidoteDescription:
      'Accept even a small part of the complaint. "You are right, I did forget." This does not mean accepting all blame -- it means showing your partner that their experience matters to you.',
    reframe:
      'Defensiveness is a survival instinct. You are not avoiding responsibility -- you are protecting yourself from a threat your nervous system perceives. Learning to lower the shield, even slightly, changes everything.',
  },
  stonewalling: {
    name: 'Stonewalling',
    description:
      'When things get intense, you shut down. You go quiet, look away, or leave the room. It is not indifference -- it is overwhelm. Your system floods and you lose access to words.',
    antidote: 'Physiological Self-Soothing',
    antidoteDescription:
      'Learn to recognize when you are flooding and ask for a break -- with a promise to return. "I need 20 minutes to calm down, and then I want to come back to this."',
    reframe:
      'Stonewalling is not coldness. It is your body saying "I cannot process any more right now." The antidote is not to force yourself to stay, but to learn to pause with intention and return with presence.',
  },
};

// ── Scenario Data ────────────────────────────────────────

interface ScenarioOption {
  text: string;
  horseman: Horseman;
}

interface QuizScenario {
  id: string;
  situation: string;
  options: ScenarioOption[];
}

const SCENARIOS: QuizScenario[] = [
  {
    id: 's1',
    situation:
      'Your partner forgets an important date you had planned together. You feel hurt and disappointed.',
    options: [
      { text: '"You always forget what matters to me. You just don\'t care."', horseman: 'criticism' },
      { text: '"Honestly, I don\'t know why I even bother planning things with you."', horseman: 'contempt' },
      { text: '"Well, you forgot my birthday last year too, so we\'re even."', horseman: 'defensiveness' },
      { text: 'You say nothing. You go to another room and close the door.', horseman: 'stonewalling' },
    ],
  },
  {
    id: 's2',
    situation:
      'During a disagreement about finances, your partner says you spend too freely.',
    options: [
      { text: '"You\'re one to talk -- you bought that expensive thing last month."', horseman: 'defensiveness' },
      { text: '"You are so controlling about money. You always have been."', horseman: 'criticism' },
      { text: 'You tune out, nod blankly, and wait for it to be over.', horseman: 'stonewalling' },
      { text: '"Right, because your spending habits are so perfect."', horseman: 'contempt' },
    ],
  },
  {
    id: 's3',
    situation:
      'Your partner is upset that you have been working late and missing dinner.',
    options: [
      { text: '"Someone has to pay the bills. What do you want me to do?"', horseman: 'defensiveness' },
      { text: '"You never appreciate how hard I work for this family."', horseman: 'criticism' },
      { text: 'You sigh heavily, turn away, and stop engaging.', horseman: 'stonewalling' },
      { text: '"If you had a real job, maybe you\'d understand."', horseman: 'contempt' },
    ],
  },
  {
    id: 's4',
    situation:
      'You ask your partner to help more around the house. They get defensive.',
    options: [
      { text: '"You never do your fair share. I have to do everything."', horseman: 'criticism' },
      { text: '"Must be nice to just sit there while I run the household."', horseman: 'contempt' },
      { text: '"I already took the trash out yesterday, what more do you want?"', horseman: 'defensiveness' },
      { text: 'You decide it is not worth the argument and just do it yourself, silently.', horseman: 'stonewalling' },
    ],
  },
  {
    id: 's5',
    situation:
      'Your partner raises their voice during an argument. You feel overwhelmed.',
    options: [
      { text: '"You always yell. You can never have a normal conversation."', horseman: 'criticism' },
      { text: 'Your mind goes blank. You stare at the floor and wait.', horseman: 'stonewalling' },
      { text: '"You\'re yelling because you know I\'m right."', horseman: 'defensiveness' },
      { text: 'You roll your eyes and mutter something under your breath.', horseman: 'contempt' },
    ],
  },
  {
    id: 's6',
    situation:
      'Your partner says they feel lonely in the relationship, even though you are together every day.',
    options: [
      { text: '"That makes no sense. We spend every evening together."', horseman: 'defensiveness' },
      { text: '"If you feel lonely, maybe the problem is you, not us."', horseman: 'criticism' },
      { text: 'You feel a wave of panic and change the subject quickly.', horseman: 'stonewalling' },
      { text: '"Oh, lonely? I\'d love the luxury of being bored."', horseman: 'contempt' },
    ],
  },
  {
    id: 's7',
    situation:
      'You discover your partner told a friend something you shared in confidence.',
    options: [
      { text: '"You have no respect for my privacy. You never have."', horseman: 'criticism' },
      { text: '"I can\'t believe I trusted you. That was naive of me."', horseman: 'contempt' },
      { text: '"You\'ve told your friends things too, so don\'t act innocent."', horseman: 'defensiveness' },
      { text: 'You feel betrayed but say nothing. You pull away for days.', horseman: 'stonewalling' },
    ],
  },
  {
    id: 's8',
    situation:
      'Your partner wants to talk about something that happened between you, but you are tired and not in the mood.',
    options: [
      { text: '"Why do we always have to talk about everything? Can\'t you just let things go?"', horseman: 'criticism' },
      { text: '"Oh great, another processing session. My favorite."', horseman: 'contempt' },
      { text: '"I didn\'t do anything wrong, so I don\'t know what there is to discuss."', horseman: 'defensiveness' },
      { text: 'You nod along but are completely checked out. Your mind is elsewhere.', horseman: 'stonewalling' },
    ],
  },
];

// ── Component ────────────────────────────────────────────

type Phase = 'intro' | 'quiz' | 'result';

export default function MyHorseman({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Horseman[]>([]);

  const handleSelect = useCallback(
    (horseman: Horseman) => {
      const next = [...responses, horseman];
      setResponses(next);

      if (currentIndex < SCENARIOS.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setPhase('result');
      }
    },
    [currentIndex, responses],
  );

  // Tally results
  const result = useMemo(() => {
    const tally: Record<Horseman, number> = {
      criticism: 0,
      contempt: 0,
      defensiveness: 0,
      stonewalling: 0,
    };
    responses.forEach((h) => { tally[h]++; });

    const sorted = (Object.entries(tally) as [Horseman, number][]).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0][0];
    const info = HORSEMAN_DATA[primary];

    return { primary, info, tally, sorted };
  }, [responses]);

  const handleFinish = useCallback(() => {
    const { primary, info, tally } = result;
    onComplete({
      title: `Horseman: ${info.name}`,
      insights: [
        `Your primary horseman is ${info.name}.`,
        `Your antidote is ${info.antidote}: ${info.antidoteDescription}`,
        info.reframe,
      ],
      data: {
        horseman: primary,
        antidote: info.antidote,
        responses: responses.map((r, i) => ({ scenario: SCENARIOS[i].id, horseman: r })),
        tally,
      },
    });
  }, [onComplete, result, responses]);

  // ── Intro ──
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.introCard}>
            <Text style={[styles.introLabel, { color: phaseColor }]}>STEP 4</Text>
            <Text style={styles.introTitle}>My Horseman</Text>
            <View style={styles.divider} />
            <Text style={styles.introBody}>
              John Gottman identified four communication patterns so destructive to relationships
              that he named them the Four Horsemen: Criticism, Contempt, Defensiveness, and Stonewalling.
            </Text>
            <Text style={styles.introBody}>
              We all have a horseman that shows up when we are stressed or hurt.
              Knowing yours is not a sentence -- it is the beginning of choosing differently.
            </Text>
            <Text style={styles.introBody}>
              You will read {SCENARIOS.length} situations. For each, pick the response closest to how
              you would actually react -- not how you wish you would.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('quiz')}
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

  // ── Quiz ──
  if (phase === 'quiz') {
    const scenario = SCENARIOS[currentIndex];

    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
            <Text style={[styles.progressText, { color: phaseColor }]}>
              {currentIndex + 1} of {SCENARIOS.length}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: phaseColor,
                    width: `${((currentIndex + 1) / SCENARIOS.length) * 100}%`,
                  },
                ]}
              />
            </View>
          </Animated.View>

          {/* Scenario */}
          <Animated.View
            key={scenario.id}
            entering={FadeInDown.duration(500).delay(100)}
            style={styles.scenarioCard}
          >
            <Text style={styles.scenarioLabel}>THE SITUATION</Text>
            <Text style={styles.scenarioText}>{scenario.situation}</Text>
          </Animated.View>

          {/* Options */}
          <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.quizOptions}>
            <Text style={styles.quizOptionsLabel}>CLOSEST TO YOUR REACTION</Text>
            {scenario.options.map((option, i) => (
              <Animated.View
                key={`${scenario.id}-${i}`}
                entering={FadeInUp.duration(300).delay(400 + i * 80)}
              >
                <TouchableOpacity
                  style={styles.quizOptionButton}
                  onPress={() => handleSelect(option.horseman)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Option ${String.fromCharCode(65 + i)}`}
                >
                  <View style={[styles.optionMarker, { backgroundColor: phaseColor + '30' }]}>
                    <Text style={[styles.optionMarkerText, { color: phaseColor }]}>
                      {String.fromCharCode(65 + i)}
                    </Text>
                  </View>
                  <Text style={styles.quizOptionText}>{option.text}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ── Result ──
  const { primary, info, sorted } = result;

  return (
    <View style={styles.container}>
      <Header onSkip={onSkip} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.resultLabelContainer}>
          <Text style={[styles.resultLabel, { color: phaseColor }]}>YOUR HORSEMAN</Text>
        </Animated.View>

        {/* Vintage Postcard Result */}
        <Animated.View entering={FadeInDown.duration(700).delay(200)} style={styles.postcardOuter}>
          <View style={styles.postcardInner}>
            <View style={styles.postcardCornerTL} />
            <View style={styles.postcardCornerTR} />
            <View style={styles.postcardCornerBL} />
            <View style={styles.postcardCornerBR} />
            <Text style={styles.postcardName}>{info.name}</Text>
            <View style={styles.postcardDivider} />
            <Text style={styles.postcardDescription}>{info.description}</Text>
          </View>
        </Animated.View>

        {/* Antidote Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.antidoteCard}>
          <Text style={[styles.antidoteLabel, { color: phaseColor }]}>YOUR ANTIDOTE</Text>
          <Text style={styles.antidoteName}>{info.antidote}</Text>
          <View style={styles.antidoteDivider} />
          <Text style={styles.antidoteDescription}>{info.antidoteDescription}</Text>
        </Animated.View>

        {/* Distribution */}
        <Animated.View entering={FadeInUp.duration(500).delay(800)} style={styles.distributionCard}>
          <Text style={styles.distributionTitle}>Your Tendencies</Text>
          {sorted.map(([horseman, count], i) => (
            <Animated.View
              key={horseman}
              entering={FadeInUp.duration(300).delay(900 + i * 100)}
              style={styles.distributionRow}
            >
              <Text style={styles.distributionLabel}>
                {HORSEMAN_DATA[horseman].name}
              </Text>
              <View style={styles.distributionBarTrack}>
                <View
                  style={[
                    styles.distributionBarFill,
                    {
                      backgroundColor: horseman === primary ? phaseColor : Colors.border,
                      width: `${(count / SCENARIOS.length) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.distributionCount}>{count}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Reframe */}
        <Animated.View entering={FadeInUp.duration(500).delay(1100)}>
          <Text style={styles.reframeText}>{info.reframe}</Text>
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
          <Animated.View entering={FadeInUp.duration(400).delay(1300)}>
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

// ── Header ───────────────────────────────────────────────

function Header({ onSkip }: { onSkip: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Horseman</Text>
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

// ── Styles ───────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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

  // Intro
  introCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  introLabel: {
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

  // Scenario
  scenarioCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  scenarioLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  scenarioText: {
    ...Typography.bodyLarge,
    color: Colors.text,
    lineHeight: 26,
  },

  // Quiz Options
  quizOptions: {
    gap: Spacing.sm,
  },
  quizOptionsLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  quizOptionButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  optionMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  optionMarkerText: {
    ...Typography.buttonSmall,
    fontSize: 13,
  },
  quizOptionText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },

  // Result
  resultLabelContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultLabel: {
    ...Typography.label,
  },

  // Vintage Postcard
  postcardOuter: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: 3,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  postcardInner: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: 'center',
    position: 'relative',
  },
  postcardCornerTL: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 16,
    height: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: Colors.border,
  },
  postcardCornerTR: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
  },
  postcardCornerBL: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 16,
    height: 16,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: Colors.border,
  },
  postcardCornerBR: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 16,
    height: 16,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
  },
  postcardName: {
    ...Typography.serifHeading,
    fontSize: 28,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  postcardDivider: {
    width: 48,
    height: 2,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  postcardDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Antidote
  antidoteCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  antidoteLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  antidoteName: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  antidoteDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  antidoteDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  // Distribution
  distributionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  distributionTitle: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  distributionLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    width: 100,
  },
  distributionBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.progressTrack,
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionBarFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 4,
  },
  distributionCount: {
    ...Typography.label,
    color: Colors.textMuted,
    width: 20,
    textAlign: 'right',
  },

  // Reframe
  reframeText: {
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
