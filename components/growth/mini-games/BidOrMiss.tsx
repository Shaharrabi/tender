/**
 * BidOrMiss -- Step 2 "Bid or Miss"
 *
 * A card-based exercise about recognizing emotional bids. The user reads
 * everyday moments and decides whether to turn toward, turn away, or
 * turn against the bid. Warm, non-judgmental feedback after each card.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows, Typography } from '@/constants/theme';
import type { MiniGameComponentProps } from '../StepMiniGame';

// ── Bid Data ─────────────────────────────────────────────

type BidResponse = 'toward' | 'away' | 'against';

interface BidCard {
  id: string;
  situation: string;
  correctAnswer: BidResponse;
  feedback: {
    toward: string;
    away: string;
    against: string;
  };
}

const BID_CARDS: BidCard[] = [
  {
    id: 'sigh',
    situation:
      'Your partner sighs heavily while staring at their phone, then sets it face-down on the table.',
    correctAnswer: 'toward',
    feedback: {
      toward:
        'Exactly. That sigh is a quiet bid -- "Something is bothering me." Asking gently opens the door.',
      away:
        'That sigh was actually a small bid for connection -- a signal that something is weighing on them. Noticing these quiet moments matters.',
      against:
        'That sigh was a small bid for connection, not an attempt to be dramatic. Meeting it with irritation can close the door they were trying to open.',
    },
  },
  {
    id: 'sunset',
    situation:
      'Your partner pauses at the window and says, "Look at this sunset."',
    correctAnswer: 'toward',
    feedback: {
      toward:
        'Yes -- this is one of the clearest bids there is. "Share this moment with me." Turning toward it builds trust in small, beautiful ways.',
      away:
        'When your partner invites you to notice something beautiful, they are really saying "Be here with me." Even a brief pause to look builds connection.',
      against:
        'Dismissing a moment like this can feel small, but it sends a message: "Your wonder doesn\'t matter to me." These tiny moments add up.',
    },
  },
  {
    id: 'how-was-day',
    situation:
      'Your partner asks "How was your day?" while chopping vegetables for dinner.',
    correctAnswer: 'toward',
    feedback: {
      toward:
        'Right. Even routine questions carry a bid underneath: "I want to know about your world." A real answer -- not just "fine" -- honors that.',
      away:
        'This everyday question is a bid for connection, even when it sounds routine. A thoughtful response -- beyond "fine" -- turns toward your partner.',
      against:
        '"How was your day?" is one of the most common bids in a relationship. Snapping back -- "Why do you always ask that?" -- punishes the reaching out.',
    },
  },
  {
    id: 'article',
    situation:
      'Your partner texts you a link to an article with the message "thought of you."',
    correctAnswer: 'toward',
    feedback: {
      toward:
        'That little text means "You\'re on my mind." Acknowledging it -- even briefly -- tells them they matter.',
      away:
        'When someone sends you something they thought you\'d like, they are saying "I know you." Not responding is turning away from that knowing.',
      against:
        'Replying with "I don\'t have time for this" shuts down a tender gesture. The article matters less than the fact that they were thinking of you.',
    },
  },
  {
    id: 'laugh',
    situation:
      'Your partner laughs out loud at something on their laptop and looks up at you with bright eyes.',
    correctAnswer: 'toward',
    feedback: {
      toward:
        'That look is pure bid -- "I want to share my joy with you." Meeting it with curiosity is one of the simplest gifts.',
      away:
        'When your partner looks up with laughter in their eyes, they are inviting you into their happiness. Not looking up misses a moment of easy connection.',
      against:
        'Responding with "Can you keep it down?" turns against a moment of joy. These small rejections teach your partner to stop sharing.',
    },
  },
  {
    id: 'tired',
    situation:
      'Your partner says "I\'m so tired" as they collapse onto the couch after work.',
    correctAnswer: 'toward',
    feedback: {
      toward:
        'Good instinct. "I\'m tired" is often code for "I need comfort." Sitting down beside them or asking what they need turns toward the bid.',
      away:
        '"I\'m tired" is often a bid for empathy, not a statement of fact. Acknowledging their exhaustion -- even with just "I know, that sounds rough" -- makes a difference.',
      against:
        'Responding with "We\'re all tired" dismisses the vulnerability it took to say it. They were reaching for comfort, not a competition.',
    },
  },
  {
    id: 'quiet-room',
    situation:
      'You are both reading in the same room. Your partner reaches over and briefly touches your arm without saying anything.',
    correctAnswer: 'toward',
    feedback: {
      toward:
        'A wordless touch is one of the purest bids -- "I\'m glad you\'re here." A small response -- a smile, a touch back -- closes the circuit.',
      away:
        'That quiet touch was your partner saying "I love being near you." Not noticing it is not harmful, but noticing it builds something invisible and strong.',
      against:
        'Pulling away from a gentle, unsolicited touch sends a sharp message, even if unintended. These wordless bids are the heartbeat of intimacy.',
    },
  },
];

const RESPONSE_OPTIONS: { key: BidResponse; label: string; sublabel: string }[] = [
  { key: 'toward', label: 'Turn Toward', sublabel: 'Accept the bid' },
  { key: 'away', label: 'Turn Away', sublabel: 'Ignore it' },
  { key: 'against', label: 'Turn Against', sublabel: 'Reject it' },
];

// ── Component ────────────────────────────────────────────

type Phase = 'intro' | 'cards' | 'feedback' | 'result';

interface UserResponse {
  cardId: string;
  answer: BidResponse;
  correct: boolean;
}

export default function BidOrMiss({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [lastAnswer, setLastAnswer] = useState<BidResponse | null>(null);

  const currentCard = BID_CARDS[currentIndex];

  const handleAnswer = useCallback(
    (answer: BidResponse) => {
      const card = BID_CARDS[currentIndex];
      const correct = answer === card.correctAnswer;
      setResponses((prev) => [...prev, { cardId: card.id, answer, correct }]);
      setLastAnswer(answer);
      setPhase('feedback');
    },
    [currentIndex],
  );

  const handleNextCard = useCallback(() => {
    if (currentIndex < BID_CARDS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setLastAnswer(null);
      setPhase('cards');
    } else {
      setPhase('result');
    }
  }, [currentIndex]);

  const score = useMemo(() => responses.filter((r) => r.correct).length, [responses]);

  const resultInsights = useMemo(() => {
    const total = BID_CARDS.length;
    const pct = score / total;
    const insights: string[] = [];

    if (pct >= 0.8) {
      insights.push('You have a strong instinct for recognizing bids. Your partner is likely to feel seen by you.');
      insights.push('The challenge now is consistency -- noticing bids even when you are tired, stressed, or distracted.');
    } else if (pct >= 0.5) {
      insights.push('You catch many bids, but some of the quieter ones slip past. This is completely normal.');
      insights.push('Practice pausing when your partner does or says something -- even something small -- and asking yourself: "Is this a bid?"');
    } else {
      insights.push('Many of these bids were subtle, and that is exactly the point. Bids are often quiet, easy to miss.');
      insights.push('The good news: simply knowing what a bid looks like changes everything. You will start noticing them everywhere.');
    }
    insights.push(`You correctly identified ${score} out of ${total} emotional bids.`);
    return insights;
  }, [score]);

  const handleFinish = useCallback(() => {
    onComplete({
      title: 'Your Bid Radar',
      insights: resultInsights,
      data: {
        score,
        totalCards: BID_CARDS.length,
        responses: responses.map((r) => ({ cardId: r.cardId, answer: r.answer, correct: r.correct })),
      },
    });
  }, [onComplete, resultInsights, score, responses]);

  // ── Intro ──
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.introCard}>
            <Text style={[styles.introLabel, { color: phaseColor }]}>STEP 2</Text>
            <Text style={styles.introTitle}>Bid or Miss</Text>
            <View style={styles.divider} />
            <Text style={styles.introBody}>
              Emotional bids are small moments of reaching out for connection. A glance, a sigh, a question,
              a touch. They are easy to miss -- and that is what makes them so important.
            </Text>
            <Text style={styles.introBody}>
              John Gottman found that couples who stay together turn toward each other's bids 86% of the time.
              Those who separate? Only 33%.
            </Text>
            <Text style={styles.introBody}>
              You will see {BID_CARDS.length} everyday moments. For each one, decide: would you turn toward,
              turn away, or turn against?
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('cards')}
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

  // ── Feedback ──
  if (phase === 'feedback' && lastAnswer) {
    const card = BID_CARDS[currentIndex];
    const isCorrect = lastAnswer === card.correctAnswer;
    const feedbackText = card.feedback[lastAnswer];

    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress */}
          <View style={styles.progressRow}>
            <Text style={[styles.progressText, { color: phaseColor }]}>
              {currentIndex + 1} of {BID_CARDS.length}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: phaseColor,
                    width: `${((currentIndex + 1) / BID_CARDS.length) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          <Animated.View entering={FadeInDown.duration(500)} style={styles.feedbackCard}>
            <View style={[styles.feedbackBadge, { backgroundColor: isCorrect ? Colors.success + '18' : Colors.accent + '18' }]}>
              <Text style={[styles.feedbackBadgeText, { color: isCorrect ? Colors.success : Colors.accent }]}>
                {isCorrect ? 'Well spotted' : 'A closer look'}
              </Text>
            </View>
            <Text style={styles.feedbackText}>{feedbackText}</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(400).delay(300)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={handleNextCard}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={currentIndex < BID_CARDS.length - 1 ? 'Next' : 'See results'}
            >
              <Text style={styles.primaryButtonText}>
                {currentIndex < BID_CARDS.length - 1 ? 'NEXT' : 'SEE RESULTS'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ── Card Phase ──
  if (phase === 'cards') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
            <Text style={[styles.progressText, { color: phaseColor }]}>
              {currentIndex + 1} of {BID_CARDS.length}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: phaseColor,
                    width: `${((currentIndex + 1) / BID_CARDS.length) * 100}%`,
                  },
                ]}
              />
            </View>
          </Animated.View>

          {/* Situation Card */}
          <Animated.View
            key={currentCard.id}
            entering={FadeInDown.duration(500).delay(100)}
            style={styles.situationCard}
          >
            <Text style={styles.situationLabel}>THE MOMENT</Text>
            <Text style={styles.situationText}>{currentCard.situation}</Text>
          </Animated.View>

          {/* Response Options */}
          <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.optionsContainer}>
            <Text style={styles.optionsLabel}>HOW WOULD YOU RESPOND?</Text>
            <View style={styles.optionsRow}>
              {RESPONSE_OPTIONS.map((option, i) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionButton,
                    option.key === 'toward' && styles.optionToward,
                    option.key === 'away' && styles.optionAway,
                    option.key === 'against' && styles.optionAgainst,
                  ]}
                  onPress={() => handleAnswer(option.key)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`${option.label}, ${option.sublabel}`}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      option.key === 'toward' && { color: Colors.success },
                      option.key === 'away' && { color: Colors.textSecondary },
                      option.key === 'against' && { color: Colors.error },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.optionSublabel}>{option.sublabel}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ── Result Screen ──
  return (
    <View style={styles.container}>
      <Header onSkip={onSkip} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.resultLabelContainer}>
          <Text style={[styles.resultLabel, { color: phaseColor }]}>YOUR BID RADAR</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.scoreCard}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreDenom}>out of {BID_CARDS.length}</Text>
          <Text style={styles.scoreSubtext}>bids recognized</Text>
        </Animated.View>

        {/* Score bar visual */}
        <Animated.View entering={FadeIn.duration(500).delay(400)} style={styles.scoreBarContainer}>
          <View style={styles.scoreBarTrack}>
            <Animated.View
              entering={FadeIn.duration(800).delay(600)}
              style={[
                styles.scoreBarFill,
                {
                  backgroundColor: phaseColor,
                  width: `${(score / BID_CARDS.length) * 100}%`,
                },
              ]}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(600)} style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>What This Tells You</Text>
          {resultInsights.map((insight, i) => (
            <Animated.View
              key={i}
              entering={FadeInUp.duration(400).delay(700 + i * 150)}
              style={styles.insightRow}
            >
              <View style={[styles.insightDot, { backgroundColor: phaseColor }]} />
              <Text style={styles.insightText}>{insight}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(1000)}>
          <Text style={styles.closingText}>
            Every bid you notice is a chance to say, without words: "You matter to me."
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(1200)}>
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

// ── Header ───────────────────────────────────────────────

function Header({ onSkip }: { onSkip: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Bid or Miss</Text>
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
    paddingBottom: Spacing.xxxl,
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

  // Situation Card
  situationCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  situationLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  situationText: {
    ...Typography.serifBody,
    color: Colors.text,
    lineHeight: 28,
  },

  // Options
  optionsContainer: {
    gap: Spacing.sm,
  },
  optionsLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    ...Shadows.subtle,
  },
  optionToward: {
    backgroundColor: Colors.success + '08',
    borderColor: Colors.success + '40',
  },
  optionAway: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  optionAgainst: {
    backgroundColor: Colors.error + '06',
    borderColor: Colors.error + '30',
  },
  optionLabel: {
    ...Typography.buttonSmall,
    marginBottom: 2,
  },
  optionSublabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },

  // Feedback
  feedbackCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  feedbackBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  feedbackBadgeText: {
    ...Typography.label,
  },
  feedbackText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  // Result
  resultLabelContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultLabel: {
    ...Typography.label,
  },
  scoreCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  scoreNumber: {
    ...Typography.serifScore,
    color: Colors.text,
  },
  scoreDenom: {
    ...Typography.headingS,
    color: Colors.textSecondary,
    marginTop: -4,
  },
  scoreSubtext: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },

  // Score bar
  scoreBarContainer: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  scoreBarTrack: {
    height: 8,
    backgroundColor: Colors.progressTrack,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Insights
  insightsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  insightsTitle: {
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
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
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
