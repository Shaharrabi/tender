/**
 * L1BidSpotter — MC9 Lesson 1
 *
 * Quick-fire identification game. 5 everyday micro-moments flash on screen.
 * User taps "It's a Bid!" or "Not a Bid." Twist: they're ALL bids.
 * Teaches that a bid is any attempt to connect — even a sigh.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { MC9_PALETTE, MC9_TIMING } from '@/constants/mc9Theme';
import {
  SparkleIcon,
  CheckmarkIcon,
  HeartPulseIcon,
} from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Bid Scenarios ───────────────────────────────────────

interface BidScenario {
  id: string;
  text: string;
  bidType: string;
  explanation: string;
}

const BID_SCENARIOS: BidScenario[] = [
  {
    id: 'bid-1',
    text: 'Your partner sighs loudly while looking at their phone.',
    bidType: 'Emotional Bid',
    explanation:
      'A sigh is often an invitation to ask "What\'s wrong?" It\'s a bid for emotional support, even if it doesn\'t look like one.',
  },
  {
    id: 'bid-2',
    text: 'Your partner shows you a funny meme on their phone.',
    bidType: 'Humor Bid',
    explanation:
      'Sharing something funny is a bid for shared joy. They want to laugh WITH you. Turning toward means giving it your attention.',
  },
  {
    id: 'bid-3',
    text: 'Your partner starts doing dishes without being asked.',
    bidType: 'Action Bid',
    explanation:
      'Starting a chore nearby is often a bid for companionship or acknowledgment. A "thank you" or joining in turns toward this bid.',
  },
  {
    id: 'bid-4',
    text: 'Your partner mentions a coworker\'s name you\'ve never heard.',
    bidType: 'Information Bid',
    explanation:
      'Sharing details about their world is a bid for you to know them better. Asking "Who\'s that?" turns toward this bid beautifully.',
  },
  {
    id: 'bid-5',
    text: 'Your partner reaches over and touches your arm while you\'re reading.',
    bidType: 'Physical Bid',
    explanation:
      'A casual touch is one of the most common bids. It says "I\'m here and I want to feel connected." Even a brief acknowledgment counts.',
  },
];

// ─── Types ───────────────────────────────────────────────

type Phase = 'intro' | 'game' | 'reveal' | 'done';

interface PlayerChoice {
  scenarioId: string;
  answeredBid: boolean;
  correct: boolean;
}

// ─── Props ───────────────────────────────────────────────

interface L1BidSpotterProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

// ─── Component ───────────────────────────────────────────

export function L1BidSpotter({
  content,
  attachmentStyle,
  onComplete,
}: L1BidSpotterProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState<PlayerChoice[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  // Animations
  const cardSlide = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const correctPulse = useRef(new Animated.Value(1)).current;
  const introFade = useRef(new Animated.Value(0)).current;
  const scorePop = useRef(new Animated.Value(1)).current;
  const revealCardAnims = useRef(
    BID_SCENARIOS.map(() => new Animated.Value(0))
  ).current;

  // ─── Intro fade in ────────────────────────────────────

  useEffect(() => {
    if (phase === 'intro') {
      Animated.timing(introFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [phase]);

  // ─── Animation helpers ────────────────────────────────

  const animateCardIn = useCallback(() => {
    cardSlide.setValue(SCREEN_WIDTH);
    cardScale.setValue(0.85);
    Animated.parallel([
      Animated.spring(cardSlide, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardSlide, cardScale]);

  const animateCorrect = useCallback(() => {
    correctPulse.setValue(1);
    Animated.sequence([
      Animated.timing(correctPulse, {
        toValue: 1.08,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(correctPulse, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [correctPulse]);

  const showFeedbackAnim = useCallback(() => {
    feedbackOpacity.setValue(0);
    Animated.timing(feedbackOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [feedbackOpacity]);

  const popScoreAnim = useCallback(() => {
    scorePop.setValue(1);
    Animated.sequence([
      Animated.timing(scorePop, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scorePop, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scorePop]);

  // ─── Phase transitions ────────────────────────────────

  const startGame = useCallback(() => {
    haptics.tap();
    setPhase('game');
    setTimeout(() => animateCardIn(), 100);
  }, [haptics, animateCardIn]);

  const handleAnswer = useCallback(
    (answeredBid: boolean) => {
      // Every scenario IS a bid, so correct = answeredBid === true
      const correct = answeredBid === true;
      const choice: PlayerChoice = {
        scenarioId: BID_SCENARIOS[currentIndex].id,
        answeredBid,
        correct,
      };

      setChoices((prev) => [...prev, choice]);
      setLastAnswerCorrect(correct);

      if (correct) {
        setScore((prev) => prev + 1);
        haptics.playExerciseReveal();
        animateCorrect();
        popScoreAnim();
      } else {
        haptics.tap();
      }

      setShowFeedback(true);
      showFeedbackAnim();
    },
    [currentIndex, haptics, animateCorrect, showFeedbackAnim, popScoreAnim]
  );

  const advanceCard = useCallback(() => {
    haptics.tap();
    setShowFeedback(false);
    feedbackOpacity.setValue(0);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= BID_SCENARIOS.length) {
      setPhase('reveal');
      // Stagger fan-out animation
      revealCardAnims.forEach((anim, i) => {
        setTimeout(() => {
          Animated.spring(anim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }).start();
        }, i * 100);
      });
    } else {
      setCurrentIndex(nextIndex);
      setTimeout(() => animateCardIn(), 50);
    }
  }, [currentIndex, haptics, feedbackOpacity, revealCardAnims, animateCardIn]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();

    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Bid Spotter Game',
        response: JSON.stringify({
          score,
          total: BID_SCENARIOS.length,
          choices: choices.map((c) => ({
            scenarioId: c.scenarioId,
            answeredBid: c.answeredBid,
            correct: c.correct,
          })),
        }),
        type: 'game',
      },
    ];
    onComplete(responses);
  }, [score, choices, onComplete, haptics]);

  // ─── Render Intro ─────────────────────────────────────

  const renderIntro = () => {
    const paragraphs = content.readContent
      ? content.readContent.split('\n').filter((p: string) => p.trim().length > 0)
      : [];

    return (
      <Animated.View style={[styles.phaseContainer, { opacity: introFade }]}>
        <ScrollView
          style={styles.introScroll}
          contentContainerStyle={styles.introScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introHeader}>
            <SparkleIcon size={28} color={MC9_PALETTE.sunshine} />
            <Text style={styles.introTitle}>Bid Spotter</Text>
          </View>

          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph: string, idx: number) => (
              <Text key={idx} style={styles.introParagraph}>
                {paragraph.trim()}
              </Text>
            ))
          ) : (
            <Text style={styles.introParagraph}>
              In every relationship, partners constantly send small signals to
              each other — attempts to connect. Dr. John Gottman calls these
              "bids for connection." A bid can be a question, a look, a sigh, a
              touch, or even starting a chore nearby. The key to lasting love is
              learning to spot these bids and turning toward them.
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.startButton}
          onPress={startGame}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // ─── Render Score Tracker ─────────────────────────────

  const renderScoreTracker = () => (
    <View style={styles.scoreBar}>
      <View style={styles.progressDots}>
        {BID_SCENARIOS.map((_, i) => {
          const answered = i < choices.length;
          const isCorrect = answered && choices[i]?.correct;
          return (
            <View
              key={i}
              style={[
                styles.progressDot,
                answered && isCorrect && styles.progressDotCorrect,
                answered && !isCorrect && styles.progressDotWrong,
                i === currentIndex && !answered && styles.progressDotCurrent,
              ]}
            />
          );
        })}
      </View>
      <Animated.View
        style={[styles.scoreContainer, { transform: [{ scale: scorePop }] }]}
      >
        <Text style={styles.scoreText}>
          {score}/{BID_SCENARIOS.length}
        </Text>
      </Animated.View>
    </View>
  );

  // ─── Render Game ──────────────────────────────────────

  const renderGame = () => {
    const scenario = BID_SCENARIOS[currentIndex];

    return (
      <View style={styles.phaseContainer}>
        {renderScoreTracker()}

        <View style={styles.cardArea}>
          <Animated.View
            style={[
              styles.scenarioCard,
              {
                transform: [
                  { translateX: cardSlide },
                  { scale: cardScale },
                ],
              },
              showFeedback && lastAnswerCorrect && {
                borderColor: MC9_PALETTE.confettiGreen,
              },
              showFeedback && !lastAnswerCorrect && {
                borderColor: MC9_PALETTE.sunshine,
              },
            ]}
          >
            <Animated.View
              style={
                showFeedback && lastAnswerCorrect
                  ? { transform: [{ scale: correctPulse }] }
                  : undefined
              }
            >
              <Text style={styles.scenarioNumber}>
                {currentIndex + 1} of {BID_SCENARIOS.length}
              </Text>
              <Text style={styles.scenarioText}>{scenario.text}</Text>
            </Animated.View>
          </Animated.View>
        </View>

        {!showFeedback ? (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.bidButton}
              onPress={() => handleAnswer(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.bidButtonText}>It's a Bid!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notBidButton}
              onPress={() => handleAnswer(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.notBidButtonText}>Not a Bid</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View
            style={[styles.feedbackContainer, { opacity: feedbackOpacity }]}
          >
            <View style={styles.feedbackCard}>
              <View style={styles.feedbackHeaderRow}>
                <View
                  style={[
                    styles.feedbackBadge,
                    {
                      backgroundColor: lastAnswerCorrect
                        ? MC9_PALETTE.confettiGreen
                        : MC9_PALETTE.playPink,
                    },
                  ]}
                >
                  <Text style={styles.feedbackBadgeText}>
                    {lastAnswerCorrect
                      ? 'Correct!'
                      : 'Actually, this IS a bid'}
                  </Text>
                </View>
              </View>
              <Text style={styles.feedbackBidType}>{scenario.bidType}</Text>
              <Text style={styles.feedbackExplanation}>
                {scenario.explanation}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={advanceCard}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex + 1 < BID_SCENARIOS.length
                  ? 'Next'
                  : 'See Results'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

  // ─── Render Reveal ────────────────────────────────────

  const renderReveal = () => (
    <ScrollView
      style={styles.revealScroll}
      contentContainerStyle={styles.revealScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.revealHeader}>
        <HeartPulseIcon size={32} color={MC9_PALETTE.sunshine} />
        <Text style={styles.revealTitle}>The Big Reveal</Text>
      </View>
      <Text style={styles.revealSubtitle}>Every single one was a bid.</Text>
      <Text style={styles.revealBody}>
        A bid is any attempt to connect — verbal, physical, or emotional.
        Research shows that most couples miss about 50% of bids their partner
        makes. The couples who thrive are the ones who learn to spot even the
        subtlest bids and turn toward them.
      </Text>
      <Text style={styles.revealScore}>
        You spotted {score} out of {BID_SCENARIOS.length} bids.
      </Text>

      <View style={styles.revealGrid}>
        {BID_SCENARIOS.map((scenario, i) => {
          const choice = choices[i];
          const wasCorrect = choice?.correct ?? false;

          return (
            <Animated.View
              key={scenario.id}
              style={[
                styles.revealCard,
                {
                  opacity: revealCardAnims[i],
                  transform: [
                    {
                      scale: revealCardAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 1],
                      }),
                    },
                    {
                      translateY: revealCardAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
                wasCorrect
                  ? styles.revealCardCorrect
                  : styles.revealCardMissed,
              ]}
            >
              <Text style={styles.revealCardNumber}>{i + 1}</Text>
              <Text style={styles.revealCardText} numberOfLines={3}>
                {scenario.text}
              </Text>
              <View
                style={[
                  styles.revealCardTag,
                  wasCorrect
                    ? styles.revealCardTagCorrect
                    : styles.revealCardTagMissed,
                ]}
              >
                <Text
                  style={[
                    styles.revealCardTagText,
                    wasCorrect
                      ? styles.revealCardTagTextCorrect
                      : styles.revealCardTagTextMissed,
                  ]}
                >
                  {wasCorrect ? 'Spotted' : 'Missed'}
                </Text>
              </View>
              <Text style={styles.revealCardBidType}>{scenario.bidType}</Text>
            </Animated.View>
          );
        })}
      </View>

      <Text style={styles.revealClosing}>
        Even a sigh is a bid. Now that you can see them, you can start turning
        toward your partner every single day.
      </Text>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleFinish}
        activeOpacity={0.8}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ─── Main Render ──────────────────────────────────────

  return (
    <View style={styles.container}>
      {phase === 'intro' && renderIntro()}
      {phase === 'game' && renderGame()}
      {phase === 'reveal' && renderReveal()}
      {phase === 'done' && renderReveal()}
    </View>
  );
}

export default L1BidSpotter;

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ─── Phases ──────────────────────────────
  phaseContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // ─── Intro ───────────────────────────────
  introScroll: {
    flex: 1,
  },
  introScrollContent: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  introTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    fontWeight: '700',
  },
  introParagraph: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  startButton: {
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.subtle,
  },
  startButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // ─── Score bar ───────────────────────────
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.borderLight,
  },
  progressDotCorrect: {
    backgroundColor: MC9_PALETTE.confettiGreen,
  },
  progressDotWrong: {
    backgroundColor: MC9_PALETTE.playPink,
  },
  progressDotCurrent: {
    backgroundColor: MC9_PALETTE.sunshine,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  scoreContainer: {
    backgroundColor: MC9_PALETTE.sunshine,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 99,
  },
  scoreText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // ─── Game card ───────────────────────────
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  scenarioCard: {
    width: SCREEN_WIDTH - Spacing.lg * 2,
    backgroundColor: MC9_PALETTE.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.subtle,
    minHeight: 180,
    justifyContent: 'center',
  },
  scenarioNumber: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  scenarioText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },

  // ─── Answer buttons ──────────────────────
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  bidButton: {
    flex: 1,
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  bidButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notBidButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  notBidButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  // ─── Feedback ────────────────────────────
  feedbackContainer: {
    paddingBottom: Spacing.xl,
  },
  feedbackCard: {
    backgroundColor: MC9_PALETTE.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  feedbackHeaderRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  feedbackBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 99,
  },
  feedbackBadgeText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  feedbackBidType: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: MC9_PALETTE.sunshine,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  feedbackExplanation: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  nextButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // ─── Reveal ──────────────────────────────
  revealScroll: {
    flex: 1,
  },
  revealScrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  revealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  revealTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    fontWeight: '700',
  },
  revealSubtitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: MC9_PALETTE.sunshine,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  revealBody: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  revealScore: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: MC9_PALETTE.playPink,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontWeight: '600',
  },
  revealGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  revealCard: {
    backgroundColor: MC9_PALETTE.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    ...Shadows.subtle,
  },
  revealCardCorrect: {
    borderColor: MC9_PALETTE.confettiGreen,
  },
  revealCardMissed: {
    borderColor: MC9_PALETTE.playPink,
  },
  revealCardNumber: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  revealCardText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  revealCardTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    marginBottom: 4,
  },
  revealCardTagCorrect: {
    backgroundColor: MC9_PALETTE.confettiGreen + '22',
  },
  revealCardTagMissed: {
    backgroundColor: MC9_PALETTE.playPink + '22',
  },
  revealCardTagText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },
  revealCardTagTextCorrect: {
    color: MC9_PALETTE.confettiGreen,
  },
  revealCardTagTextMissed: {
    color: MC9_PALETTE.playPink,
  },
  revealCardBidType: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: MC9_PALETTE.sunshine,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  revealClosing: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },

  // ─── Continue button ─────────────────────
  continueButton: {
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.subtle,
  },
  continueButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
