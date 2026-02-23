/**
 * L4ThirtySecondGames.tsx
 * ─────────────────────────────────────────────────────────────────
 * MC9 Lesson 4 — Three 30-Second Mini-Games
 *
 * The most playful, dopamine-hitting lesson in the app.
 * Three timed games that exercise appreciation, knowledge,
 * and silly creativity in rapid-fire 30-second bursts.
 *
 * Games:
 *   1. Appreciation Blitz — free-text appreciation list
 *   2. Memory Lane — 5 rapid-fire relationship trivia questions
 *   3. Silly Compliment Generator — mix-and-match adjective + noun
 *
 * Architecture: single phase-machine component with animated
 * circular countdown timer and confetti-burst feedback.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { MC9_PALETTE } from '@/constants/mc9Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import {
  SparkleIcon,
  CheckmarkIcon,
  TrophyIcon,
  StarIcon,
} from '@/assets/graphics/icons';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

// ─── Props ──────────────────────────────────────────────────────

interface L4ThirtySecondGamesProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

// ─── Phase Machine ──────────────────────────────────────────────

type Phase =
  | 'intro'
  | 'game1'
  | 'game1-results'
  | 'game2'
  | 'game2-results'
  | 'game3'
  | 'game3-results'
  | 'summary';

// ─── Game 2 Quiz Data ───────────────────────────────────────────

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'The #1 predictor of relationship satisfaction is...',
    options: ['Great sex', 'Friendship', 'Money', 'Attraction'],
    correctIndex: 1,
    explanation: 'Gottman found friendship is the foundation of lasting love.',
  },
  {
    question:
      'Happy couples have a ratio of positive to negative interactions of...',
    options: ['2:1', '3:1', '5:1', '10:1'],
    correctIndex: 2,
    explanation: 'The magic ratio is 5:1 positive to negative.',
  },
  {
    question: 'Most relationship conflicts are...',
    options: ['Solvable', 'Perpetual', 'About money', 'About kids'],
    correctIndex: 1,
    explanation: '69% of conflicts are perpetual, rooted in personality differences.',
  },
  {
    question: "A 'bid for connection' can be...",
    options: ['Only words', 'Only touch', 'Anything', 'Only grand gestures'],
    correctIndex: 2,
    explanation: 'A bid can be a glance, a sigh, a question, or a touch.',
  },
  {
    question: 'The best time to discuss a conflict is...',
    options: ['Right away', 'Never', 'After calming down', 'Via text'],
    correctIndex: 2,
    explanation: 'Self-soothing first leads to more productive repair.',
  },
];

// ─── Game 3 Word Banks ──────────────────────────────────────────

const ADJECTIVES = [
  'Magnificent',
  'Radiant',
  'Extraordinary',
  'Delightful',
  'Sparkling',
  'Majestic',
  'Adorable',
  'Legendary',
];

const NOUNS = [
  'Waffle',
  'Sunshine',
  'Potato',
  'Cupcake',
  'Penguin',
  'Marshmallow',
  'Unicorn',
  'Avocado',
];

// ─── Constants ──────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TIMER_SIZE = 80;
const TIMER_STROKE = 6;
const TIMER_RADIUS = (TIMER_SIZE - TIMER_STROKE) / 2;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;
const GAME_DURATION = 30; // seconds
const QUESTION_DURATION = 6; // seconds per quiz question

// ─── Confetti Burst Component ───────────────────────────────────

interface ConfettiBurstProps {
  visible: boolean;
  color?: string;
}

function ConfettiBurst({ visible, color = MC9_PALETTE.sunshine }: ConfettiBurstProps) {
  const particles = useRef(
    Array.from({ length: 8 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotation: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!visible) return;

    const burstColors = [
      MC9_PALETTE.sunshine,
      MC9_PALETTE.pink,
      MC9_PALETTE.coral,
      MC9_PALETTE.lavender,
    ];

    particles.forEach((p, i) => {
      const angle = (i / particles.length) * 2 * Math.PI;
      const distance = 40 + Math.random() * 30;

      p.x.setValue(0);
      p.y.setValue(0);
      p.opacity.setValue(1);
      p.scale.setValue(0.3);
      p.rotation.setValue(0);

      Animated.parallel([
        Animated.timing(p.x, {
          toValue: Math.cos(angle) * distance,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(p.y, {
          toValue: Math.sin(angle) * distance,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(p.scale, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(p.scale, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotation, {
          toValue: Math.random() * 360,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [visible]);

  if (!visible) return null;

  const burstColors = [
    MC9_PALETTE.sunshine,
    MC9_PALETTE.pink,
    MC9_PALETTE.coral,
    MC9_PALETTE.lavender,
    MC9_PALETTE.sunshineLight,
    MC9_PALETTE.pinkLight,
    MC9_PALETTE.coralLight,
    MC9_PALETTE.lavenderLight,
  ];

  return (
    <View style={styles.confettiContainer} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiParticle,
            {
              backgroundColor: burstColors[i % burstColors.length],
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                { scale: p.scale },
                {
                  rotate: p.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: p.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Circular Countdown Timer ───────────────────────────────────

interface CountdownTimerProps {
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
}

function CountdownTimer({ seconds, totalSeconds, isRunning }: CountdownTimerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isUrgent = seconds <= 5;
  const isCritical = seconds <= 3;

  useEffect(() => {
    if (isCritical && isRunning) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isCritical, isRunning]);

  const progress = totalSeconds > 0 ? seconds / totalSeconds : 0;
  const strokeDashoffset = TIMER_CIRCUMFERENCE * (1 - progress);
  const ringColor = isUrgent ? MC9_PALETTE.coral : MC9_PALETTE.sunshine;

  return (
    <Animated.View
      style={[
        styles.timerContainer,
        { transform: [{ scale: pulseAnim }] },
      ]}
    >
      <View style={styles.timerSvgWrap}>
        {/* Background circle */}
        <View
          style={[
            styles.timerRingBg,
            {
              width: TIMER_SIZE,
              height: TIMER_SIZE,
              borderRadius: TIMER_SIZE / 2,
              borderWidth: TIMER_STROKE,
              borderColor: Colors.borderLight,
            },
          ]}
        />
        {/* Progress circle — simulated with rotating half-circles */}
        <View
          style={[
            styles.timerRingProgress,
            {
              width: TIMER_SIZE,
              height: TIMER_SIZE,
              borderRadius: TIMER_SIZE / 2,
              borderWidth: TIMER_STROKE,
              borderColor: ringColor,
              borderRightColor: 'transparent',
              borderBottomColor: progress > 0.25 ? ringColor : 'transparent',
              borderLeftColor: progress > 0.5 ? ringColor : 'transparent',
              borderTopColor: progress > 0.75 ? ringColor : 'transparent',
              transform: [{ rotate: '-90deg' }],
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.timerText,
          isUrgent && { color: MC9_PALETTE.coral },
          isCritical && { color: MC9_PALETTE.incorrect },
        ]}
      >
        {seconds}
      </Text>
    </Animated.View>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export default function L4ThirtySecondGames({
  content,
  attachmentStyle,
  onComplete,
}: L4ThirtySecondGamesProps) {
  const haptics = useSoundHaptics();

  // Phase state
  const [phase, setPhase] = useState<Phase>('intro');

  // Timer state
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTimerRunning = useRef(false);

  // Game 1 state — Appreciation Blitz
  const [appreciationText, setAppreciationText] = useState('');
  const [appreciationCount, setAppreciationCount] = useState(0);

  // Game 2 state — Memory Lane
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTimeLeft, setQuizTimeLeft] = useState(QUESTION_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const quizTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Game 3 state — Silly Compliment Generator
  const [selectedAdjective, setSelectedAdjective] = useState<string | null>(null);
  const [selectedNoun, setSelectedNoun] = useState<string | null>(null);
  const [compliments, setCompliments] = useState<string[]>([]);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scorePopAnim = useRef(new Animated.Value(0)).current;

  // ─── Animation Helpers ──────────────────────────────────────

  const animateIn = useCallback(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const popScore = useCallback(() => {
    scorePopAnim.setValue(0);
    Animated.sequence([
      Animated.timing(scorePopAnim, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scorePopAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scorePopAnim]);

  // ─── Timer Logic ──────────────────────────────────────────────

  const startTimer = useCallback(
    (duration: number, onComplete: () => void) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeLeft(duration);
      isTimerRunning.current = true;

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            isTimerRunning.current = false;
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    []
  );

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isTimerRunning.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (quizTimerRef.current) clearInterval(quizTimerRef.current);
    };
  }, [stopTimer]);

  // Animate on phase change
  useEffect(() => {
    animateIn();
  }, [phase, animateIn]);

  // ─── Game 1: Appreciation Blitz ───────────────────────────────

  const startGame1 = useCallback(() => {
    setPhase('game1');
    setAppreciationText('');
    haptics.playLessonStart();
    startTimer(GAME_DURATION, () => {
      // Timer ended — calculate score
      const lines = appreciationTextRef.current
        .split('\n')
        .filter((line) => line.trim().length > 0);
      setAppreciationCount(lines.length);
      setPhase('game1-results');
      haptics.playConfetti();
      setShowConfetti(true);
      popScore();
      setTimeout(() => setShowConfetti(false), 600);
    });
  }, [startTimer, haptics, popScore]);

  // We need a ref for appreciation text since the timer callback captures stale state
  const appreciationTextRef = useRef('');
  useEffect(() => {
    appreciationTextRef.current = appreciationText;
  }, [appreciationText]);

  // ─── Game 2: Memory Lane (Quiz) ───────────────────────────────

  const startQuizTimer = useCallback(() => {
    if (quizTimerRef.current) clearInterval(quizTimerRef.current);
    setQuizTimeLeft(QUESTION_DURATION);
    setSelectedAnswer(null);
    setShowQuizFeedback(false);

    quizTimerRef.current = setInterval(() => {
      setQuizTimeLeft((prev) => {
        if (prev <= 1) {
          if (quizTimerRef.current) clearInterval(quizTimerRef.current);
          quizTimerRef.current = null;
          // Time ran out — mark as unanswered, advance
          handleQuizTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Use a ref so timeout handler sees current quiz index
  const quizIndexRef = useRef(0);
  useEffect(() => {
    quizIndexRef.current = quizIndex;
  }, [quizIndex]);

  const quizScoreRef = useRef(0);
  useEffect(() => {
    quizScoreRef.current = quizScore;
  }, [quizScore]);

  const quizAnswersRef = useRef<(number | null)[]>([]);
  useEffect(() => {
    quizAnswersRef.current = quizAnswers;
  }, [quizAnswers]);

  const handleQuizTimeout = useCallback(() => {
    setShowQuizFeedback(true);
    setQuizAnswers((prev) => [...prev, null]);
    haptics.playError();

    setTimeout(() => {
      advanceQuiz();
    }, 1200);
  }, [haptics]);

  const handleQuizAnswer = useCallback(
    (answerIndex: number) => {
      if (showQuizFeedback) return;
      if (quizTimerRef.current) clearInterval(quizTimerRef.current);
      quizTimerRef.current = null;

      setSelectedAnswer(answerIndex);
      setShowQuizFeedback(true);

      const currentQuestion = QUIZ_QUESTIONS[quizIndexRef.current];
      const isCorrect = answerIndex === currentQuestion.correctIndex;

      if (isCorrect) {
        setQuizScore((prev) => prev + 1);
        haptics.success();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 600);
      } else {
        haptics.playError();
      }

      setQuizAnswers((prev) => [...prev, answerIndex]);

      setTimeout(() => {
        advanceQuiz();
      }, 1200);
    },
    [showQuizFeedback, haptics]
  );

  const advanceQuiz = useCallback(() => {
    const nextIndex = quizIndexRef.current + 1;
    if (nextIndex >= QUIZ_QUESTIONS.length) {
      // Quiz done
      setPhase('game2-results');
      haptics.playConfetti();
      setShowConfetti(true);
      popScore();
      setTimeout(() => setShowConfetti(false), 600);
    } else {
      setQuizIndex(nextIndex);
      setSelectedAnswer(null);
      setShowQuizFeedback(false);
      startQuizTimer();
    }
  }, [haptics, popScore, startQuizTimer]);

  const startGame2 = useCallback(() => {
    setPhase('game2');
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswers([]);
    setSelectedAnswer(null);
    setShowQuizFeedback(false);
    haptics.playLessonStart();
    startQuizTimer();
  }, [haptics, startQuizTimer]);

  // ─── Game 3: Silly Compliment Generator ───────────────────────

  const startGame3 = useCallback(() => {
    setPhase('game3');
    setSelectedAdjective(null);
    setSelectedNoun(null);
    setCompliments([]);
    haptics.playLessonStart();
    startTimer(GAME_DURATION, () => {
      setPhase('game3-results');
      haptics.playConfetti();
      setShowConfetti(true);
      popScore();
      setTimeout(() => setShowConfetti(false), 600);
    });
  }, [startTimer, haptics, popScore]);

  const handleAdjectiveSelect = useCallback(
    (adj: string) => {
      setSelectedAdjective(adj);
      haptics.tapSoft();

      // If noun already selected, create compliment
      setSelectedNoun((currentNoun) => {
        if (currentNoun) {
          const compliment = `${adj} ${currentNoun}`;
          setCompliments((prev) => [...prev, compliment]);
          haptics.success();
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 400);
          setSelectedAdjective(null);
          return null;
        }
        return currentNoun;
      });
    },
    [haptics]
  );

  const handleNounSelect = useCallback(
    (noun: string) => {
      setSelectedNoun(noun);
      haptics.tapSoft();

      // If adjective already selected, create compliment
      setSelectedAdjective((currentAdj) => {
        if (currentAdj) {
          const compliment = `${currentAdj} ${noun}`;
          setCompliments((prev) => [...prev, compliment]);
          haptics.success();
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 400);
          setSelectedNoun(null);
          return null;
        }
        return currentAdj;
      });
    },
    [haptics]
  );

  // ─── Summary / Completion ─────────────────────────────────────

  const handleComplete = useCallback(() => {
    haptics.playLessonComplete();

    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Appreciation Blitz',
        response: JSON.stringify({
          count: appreciationCount,
          text: appreciationText,
        }),
        type: 'game',
      },
      {
        step: 2,
        prompt: 'Memory Lane Quiz',
        response: JSON.stringify({
          score: quizScore,
          total: QUIZ_QUESTIONS.length,
          answers: quizAnswers,
        }),
        type: 'game',
      },
      {
        step: 3,
        prompt: 'Silly Compliment Generator',
        response: JSON.stringify({
          count: compliments.length,
          compliments,
        }),
        type: 'game',
      },
    ];

    onComplete(responses);
  }, [
    haptics,
    appreciationCount,
    appreciationText,
    quizScore,
    quizAnswers,
    compliments,
    onComplete,
  ]);

  // ─── Computed Values ──────────────────────────────────────────

  const totalPlayfulness =
    appreciationCount * 10 + quizScore * 20 + compliments.length * 15;

  const introText = content.readContent
    .split('\n')
    .filter((p) => p.trim().length > 0)
    .slice(0, 2)
    .join('\n\n');

  // ─── Render Helpers ───────────────────────────────────────────

  const renderIntro = () => (
    <Animated.View
      style={[
        styles.phaseContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.introIconRow}>
        <SparkleIcon size={32} color={MC9_PALETTE.sunshine} />
      </View>
      <Text style={styles.phaseTitle}>30-Second Games</Text>
      <Text style={styles.phaseSubtitle}>
        Three rapid-fire rounds of playfulness
      </Text>

      <View style={styles.introCard}>
        <Text style={styles.introText}>{introText}</Text>
      </View>

      <View style={styles.gamePreviewRow}>
        {['Appreciation Blitz', 'Memory Lane', 'Silly Compliments'].map(
          (name, i) => (
            <View key={name} style={styles.gamePreviewChip}>
              <Text style={styles.gamePreviewNumber}>{i + 1}</Text>
              <Text style={styles.gamePreviewLabel}>{name}</Text>
            </View>
          )
        )}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          haptics.tap();
          startGame1();
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Ready?</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderGame1 = () => (
    <Animated.View
      style={[
        styles.phaseContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.gameHeader}>
        <View style={styles.gameHeaderLeft}>
          <Text style={styles.gameNumber}>Game 1</Text>
          <Text style={styles.gameTitle}>Appreciation Blitz</Text>
        </View>
        <CountdownTimer
          seconds={timeLeft}
          totalSeconds={GAME_DURATION}
          isRunning={isTimerRunning.current}
        />
      </View>

      <Text style={styles.gamePrompt}>
        Type as many things you appreciate about your partner as you can!
      </Text>
      <Text style={styles.gameHint}>One per line — go fast!</Text>

      <View style={styles.textInputWrapper}>
        <TextInput
          style={styles.appreciationInput}
          multiline
          autoFocus
          placeholder="Kind eyes&#10;Makes me laugh&#10;Great cook&#10;..."
          placeholderTextColor={Colors.textMuted}
          value={appreciationText}
          onChangeText={setAppreciationText}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.liveCountRow}>
        <SparkleIcon size={16} color={MC9_PALETTE.sunshine} />
        <Text style={styles.liveCountText}>
          {
            appreciationText
              .split('\n')
              .filter((l) => l.trim().length > 0).length
          }{' '}
          appreciations so far
        </Text>
      </View>
    </Animated.View>
  );

  const renderGame1Results = () => (
    <Animated.View
      style={[
        styles.phaseContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <ConfettiBurst visible={showConfetti} />

      <View style={styles.resultsIconRow}>
        <SparkleIcon size={36} color={MC9_PALETTE.sunshine} />
      </View>

      <Animated.Text
        style={[
          styles.resultsBigNumber,
          { transform: [{ scale: scorePopAnim }] },
        ]}
      >
        {appreciationCount}
      </Animated.Text>
      <Text style={styles.resultsLabel}>
        appreciations in 30 seconds
      </Text>
      <Text style={styles.resultsSubtext}>
        Your partner is lucky.
      </Text>

      <View style={styles.resultsCard}>
        <Text style={styles.resultsCardTitle}>Your Appreciations</Text>
        {appreciationText
          .split('\n')
          .filter((l) => l.trim().length > 0)
          .slice(0, 6)
          .map((line, i) => (
            <View key={i} style={styles.appreciationLineRow}>
              <CheckmarkIcon size={14} color={MC9_PALETTE.correct} />
              <Text style={styles.appreciationLineText}>{line.trim()}</Text>
            </View>
          ))}
        {appreciationCount > 6 && (
          <Text style={styles.andMoreText}>
            ...and {appreciationCount - 6} more
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          haptics.tap();
          startGame2();
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Next Game</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderGame2 = () => {
    const question = QUIZ_QUESTIONS[quizIndex];
    if (!question) return null;

    return (
      <Animated.View
        style={[
          styles.phaseContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.gameHeader}>
          <View style={styles.gameHeaderLeft}>
            <Text style={styles.gameNumber}>Game 2</Text>
            <Text style={styles.gameTitle}>Memory Lane</Text>
          </View>
          <CountdownTimer
            seconds={quizTimeLeft}
            totalSeconds={QUESTION_DURATION}
            isRunning={!showQuizFeedback}
          />
        </View>

        <View style={styles.quizProgressRow}>
          {QUIZ_QUESTIONS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.quizProgressDot,
                i < quizIndex && {
                  backgroundColor:
                    quizAnswers[i] === QUIZ_QUESTIONS[i].correctIndex
                      ? MC9_PALETTE.correct
                      : MC9_PALETTE.incorrect,
                },
                i === quizIndex && {
                  backgroundColor: MC9_PALETTE.sunshine,
                  borderColor: MC9_PALETTE.sunshineDark,
                  borderWidth: 2,
                },
              ]}
            />
          ))}
        </View>

        <Text style={styles.quizQuestion}>{question.question}</Text>

        <ConfettiBurst visible={showConfetti} />

        <View style={styles.quizOptionsGrid}>
          {question.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = i === question.correctIndex;
            const showCorrectHighlight =
              showQuizFeedback && isCorrect;
            const showIncorrectHighlight =
              showQuizFeedback && isSelected && !isCorrect;

            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.quizOption,
                  showCorrectHighlight && styles.quizOptionCorrect,
                  showIncorrectHighlight && styles.quizOptionIncorrect,
                  isSelected &&
                    !showQuizFeedback && {
                      borderColor: MC9_PALETTE.sunshine,
                      backgroundColor: MC9_PALETTE.sunshineLight + '40',
                    },
                ]}
                onPress={() => handleQuizAnswer(i)}
                disabled={showQuizFeedback}
                activeOpacity={0.7}
              >
                <Text style={styles.quizOptionLabel}>
                  {['A', 'B', 'C', 'D'][i]}
                </Text>
                <Text
                  style={[
                    styles.quizOptionText,
                    showCorrectHighlight && { color: Colors.white },
                    showIncorrectHighlight && { color: Colors.white },
                  ]}
                >
                  {option}
                </Text>
                {showCorrectHighlight && (
                  <View style={styles.quizOptionIcon}>
                    <CheckmarkIcon size={18} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {showQuizFeedback && (
          <Animated.View style={styles.quizExplanation}>
            <Text style={styles.quizExplanationText}>
              {question.explanation}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderGame2Results = () => (
    <Animated.View
      style={[
        styles.phaseContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <ConfettiBurst visible={showConfetti} />

      <View style={styles.resultsIconRow}>
        <StarIcon size={36} color={MC9_PALETTE.sunshine} />
      </View>

      <Animated.Text
        style={[
          styles.resultsBigNumber,
          { transform: [{ scale: scorePopAnim }] },
        ]}
      >
        {quizScore}/{QUIZ_QUESTIONS.length}
      </Animated.Text>
      <Text style={styles.resultsLabel}>correct answers</Text>
      <Text style={styles.resultsSubtext}>
        {quizScore >= 4
          ? 'Relationship science expert!'
          : quizScore >= 2
          ? 'Solid knowledge! Keep learning.'
          : 'Every bit of knowledge helps.'}
      </Text>

      <View style={styles.quizResultsGrid}>
        {QUIZ_QUESTIONS.map((q, i) => {
          const userAnswer = quizAnswers[i];
          const isCorrect = userAnswer === q.correctIndex;
          return (
            <View
              key={i}
              style={[
                styles.quizResultCard,
                {
                  borderLeftColor: isCorrect
                    ? MC9_PALETTE.correct
                    : MC9_PALETTE.incorrect,
                },
              ]}
            >
              <View style={styles.quizResultHeader}>
                {isCorrect ? (
                  <CheckmarkIcon size={16} color={MC9_PALETTE.correct} />
                ) : (
                  <View style={styles.wrongMark}>
                    <Text style={styles.wrongMarkText}>X</Text>
                  </View>
                )}
                <Text
                  style={styles.quizResultQuestion}
                  numberOfLines={1}
                >
                  Q{i + 1}
                </Text>
              </View>
              <Text style={styles.quizResultAnswer}>
                {q.options[q.correctIndex]}
              </Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          haptics.tap();
          startGame3();
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Next Game</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderGame3 = () => (
    <Animated.View
      style={[
        styles.phaseContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.gameHeader}>
        <View style={styles.gameHeaderLeft}>
          <Text style={styles.gameNumber}>Game 3</Text>
          <Text style={styles.gameTitle}>Silly Compliments</Text>
        </View>
        <CountdownTimer
          seconds={timeLeft}
          totalSeconds={GAME_DURATION}
          isRunning={isTimerRunning.current}
        />
      </View>

      <Text style={styles.gamePrompt}>
        Tap one adjective + one noun to create a silly compliment!
      </Text>

      <ConfettiBurst visible={showConfetti} />

      <View style={styles.chipsContainer}>
        {/* Adjectives column */}
        <View style={styles.chipColumn}>
          <Text style={styles.chipColumnLabel}>Adjective</Text>
          {ADJECTIVES.map((adj) => (
            <TouchableOpacity
              key={adj}
              style={[
                styles.chip,
                styles.chipAdjective,
                selectedAdjective === adj && styles.chipSelected,
              ]}
              onPress={() => handleAdjectiveSelect(adj)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedAdjective === adj && styles.chipTextSelected,
                ]}
              >
                {adj}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nouns column */}
        <View style={styles.chipColumn}>
          <Text style={styles.chipColumnLabel}>Noun</Text>
          {NOUNS.map((noun) => (
            <TouchableOpacity
              key={noun}
              style={[
                styles.chip,
                styles.chipNoun,
                selectedNoun === noun && styles.chipSelected,
              ]}
              onPress={() => handleNounSelect(noun)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedNoun === noun && styles.chipTextSelected,
                ]}
              >
                {noun}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Created compliments list */}
      {compliments.length > 0 && (
        <View style={styles.complimentsList}>
          <Text style={styles.complimentsListTitle}>
            Your Compliments ({compliments.length})
          </Text>
          {compliments.map((c, i) => (
            <View key={i} style={styles.complimentCard}>
              <SparkleIcon size={14} color={MC9_PALETTE.sunshine} />
              <Text style={styles.complimentCardText}>{c}</Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );

  const renderGame3Results = () => (
    <Animated.View
      style={[
        styles.phaseContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <ConfettiBurst visible={showConfetti} />

      <View style={styles.resultsIconRow}>
        <SparkleIcon size={36} color={MC9_PALETTE.pink} />
      </View>

      <Animated.Text
        style={[
          styles.resultsBigNumber,
          { transform: [{ scale: scorePopAnim }] },
        ]}
      >
        {compliments.length}
      </Animated.Text>
      <Text style={styles.resultsLabel}>silly compliments created</Text>
      {compliments.length > 0 && (
        <Text style={styles.resultsSubtext}>
          Our favorite: {compliments[0]}
        </Text>
      )}

      <View style={styles.complimentResultsGrid}>
        {compliments.map((c, i) => (
          <View key={i} style={styles.complimentResultChip}>
            <Text style={styles.complimentResultText}>{c}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          haptics.tap();
          setPhase('summary');
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>See Results</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSummary = () => (
    <Animated.View
      style={[
        styles.phaseContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.summaryIconRow}>
        <TrophyIcon size={40} color={MC9_PALETTE.sunshine} />
      </View>

      <Text style={styles.summaryTitle}>Your Playfulness Score</Text>

      <Animated.Text
        style={[
          styles.summaryBigScore,
          { transform: [{ scale: scorePopAnim }] },
        ]}
      >
        {totalPlayfulness}
      </Animated.Text>
      <Text style={styles.summaryScoreLabel}>points</Text>

      {/* Individual game scores */}
      <View style={styles.summaryCardsRow}>
        <View style={[styles.summaryCard, { borderTopColor: MC9_PALETTE.sunshine }]}>
          <SparkleIcon size={20} color={MC9_PALETTE.sunshine} />
          <Text style={styles.summaryCardNumber}>{appreciationCount}</Text>
          <Text style={styles.summaryCardLabel}>Appreciations</Text>
          <Text style={styles.summaryCardPoints}>
            {appreciationCount * 10} pts
          </Text>
        </View>

        <View style={[styles.summaryCard, { borderTopColor: MC9_PALETTE.lavender }]}>
          <StarIcon size={20} color={MC9_PALETTE.lavender} />
          <Text style={styles.summaryCardNumber}>
            {quizScore}/{QUIZ_QUESTIONS.length}
          </Text>
          <Text style={styles.summaryCardLabel}>Trivia</Text>
          <Text style={styles.summaryCardPoints}>
            {quizScore * 20} pts
          </Text>
        </View>

        <View style={[styles.summaryCard, { borderTopColor: MC9_PALETTE.pink }]}>
          <SparkleIcon size={20} color={MC9_PALETTE.pink} />
          <Text style={styles.summaryCardNumber}>{compliments.length}</Text>
          <Text style={styles.summaryCardLabel}>Compliments</Text>
          <Text style={styles.summaryCardPoints}>
            {compliments.length * 15} pts
          </Text>
        </View>
      </View>

      <Text style={styles.summaryMessage}>
        {totalPlayfulness >= 150
          ? 'Incredible playful energy! Your relationship thrives on this kind of joy.'
          : totalPlayfulness >= 80
          ? 'Great spirit! Playfulness is a superpower in relationships.'
          : 'Every playful moment counts. The joy you bring matters.'}
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          haptics.tap();
          handleComplete();
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // ─── Main Render ──────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {phase === 'intro' && renderIntro()}
      {phase === 'game1' && renderGame1()}
      {phase === 'game1-results' && renderGame1Results()}
      {phase === 'game2' && renderGame2()}
      {phase === 'game2-results' && renderGame2Results()}
      {phase === 'game3' && renderGame3()}
      {phase === 'game3-results' && renderGame3Results()}
      {phase === 'summary' && renderSummary()}
    </ScrollView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },

  // ── Phase Container ────────────────────────────────────────
  phaseContainer: {
    flex: 1,
    alignItems: 'center',
  },

  // ── Intro ──────────────────────────────────────────────────
  introIconRow: {
    marginBottom: Spacing.md,
  },
  phaseTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    letterSpacing: 1.2,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  phaseSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  introCard: {
    backgroundColor: MC9_PALETTE.cardBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: MC9_PALETTE.cardBorder,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    width: '100%',
    ...Shadows.card,
  },
  introText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
  gamePreviewRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    flexWrap: 'wrap',
  },
  gamePreviewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MC9_PALETTE.sunshineLight + '60',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  gamePreviewNumber: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: MC9_PALETTE.sunshineDark,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: MC9_PALETTE.sunshine,
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
  },
  gamePreviewLabel: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: MC9_PALETTE.sunshineDark,
  },

  // ── Game Header ────────────────────────────────────────────
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.md,
  },
  gameHeaderLeft: {
    flex: 1,
  },
  gameNumber: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: MC9_PALETTE.sunshine,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  gameTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.text,
    letterSpacing: 1,
  },
  gamePrompt: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    width: '100%',
    lineHeight: 24,
  },
  gameHint: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  // ── Timer ──────────────────────────────────────────────────
  timerContainer: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerSvgWrap: {
    position: 'absolute',
    width: TIMER_SIZE,
    height: TIMER_SIZE,
  },
  timerRingBg: {
    position: 'absolute',
  },
  timerRingProgress: {
    position: 'absolute',
  },
  timerText: {
    fontFamily: FontFamilies.accent,
    fontSize: 28,
    color: MC9_PALETTE.sunshine,
    letterSpacing: -0.5,
  },

  // ── Game 1: Appreciation Input ─────────────────────────────
  textInputWrapper: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: MC9_PALETTE.sunshineLight,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  appreciationInput: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    padding: Spacing.md,
    minHeight: 200,
    maxHeight: 300,
  },
  liveCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  liveCountText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: MC9_PALETTE.sunshineDark,
  },

  // ── Results Screens ────────────────────────────────────────
  resultsIconRow: {
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  resultsBigNumber: {
    fontFamily: FontFamilies.accent,
    fontSize: 56,
    color: MC9_PALETTE.sunshine,
    letterSpacing: -1,
    lineHeight: 64,
  },
  resultsLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  resultsSubtext: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  resultsCard: {
    backgroundColor: MC9_PALETTE.cardBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: MC9_PALETTE.cardBorder,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  resultsCardTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  appreciationLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  appreciationLineText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    flex: 1,
  },
  andMoreText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },

  // ── Game 2: Quiz ───────────────────────────────────────────
  quizProgressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  quizProgressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.borderLight,
  },
  quizQuestion: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 28,
    width: '100%',
  },
  quizOptionsGrid: {
    width: '100%',
    gap: Spacing.sm,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    minHeight: 52,
    ...Shadows.subtle,
  },
  quizOptionCorrect: {
    backgroundColor: MC9_PALETTE.correct,
    borderColor: MC9_PALETTE.correct,
  },
  quizOptionIncorrect: {
    backgroundColor: MC9_PALETTE.incorrect,
    borderColor: MC9_PALETTE.incorrect,
  },
  quizOptionLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    color: MC9_PALETTE.sunshineDark,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: MC9_PALETTE.sunshineLight + '60',
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
  },
  quizOptionText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    flex: 1,
  },
  quizOptionIcon: {
    marginLeft: 'auto',
  },
  quizExplanation: {
    backgroundColor: MC9_PALETTE.sunshineLight + '40',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    width: '100%',
  },
  quizExplanationText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: MC9_PALETTE.sunshineDark,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Game 2 Results ─────────────────────────────────────────
  quizResultsGrid: {
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quizResultCard: {
    flexDirection: 'column',
    backgroundColor: MC9_PALETTE.cardBg,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: MC9_PALETTE.correct,
    padding: Spacing.sm,
    ...Shadows.subtle,
  },
  quizResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  quizResultQuestion: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  quizResultAnswer: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    marginLeft: 22,
  },
  wrongMark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: MC9_PALETTE.incorrectLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrongMarkText: {
    fontFamily: FontFamilies.heading,
    fontSize: 10,
    color: MC9_PALETTE.incorrect,
    lineHeight: 14,
  },

  // ── Game 3: Chips ──────────────────────────────────────────
  chipsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  chipColumn: {
    flex: 1,
    gap: Spacing.xs,
  },
  chipColumnLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  chip: {
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    minHeight: 40,
  },
  chipAdjective: {
    backgroundColor: MC9_PALETTE.sunshineLight + '40',
    borderColor: MC9_PALETTE.sunshineLight,
  },
  chipNoun: {
    backgroundColor: MC9_PALETTE.pinkLight + '40',
    borderColor: MC9_PALETTE.pinkLight,
  },
  chipSelected: {
    backgroundColor: MC9_PALETTE.sunshine,
    borderColor: MC9_PALETTE.sunshineDark,
  },
  chipText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  chipTextSelected: {
    color: Colors.white,
  },

  // ── Game 3: Compliment Cards ───────────────────────────────
  complimentsList: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  complimentsListTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  complimentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: MC9_PALETTE.cardBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: MC9_PALETTE.cardBorder,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    ...Shadows.subtle,
  },
  complimentCardText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: MC9_PALETTE.pinkDark,
    letterSpacing: 0.5,
  },

  // ── Game 3 Results ─────────────────────────────────────────
  complimentResultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  complimentResultChip: {
    backgroundColor: MC9_PALETTE.pinkLight + '60',
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: MC9_PALETTE.pinkLight,
  },
  complimentResultText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    color: MC9_PALETTE.pinkDark,
    letterSpacing: 0.3,
  },

  // ── Summary ────────────────────────────────────────────────
  summaryIconRow: {
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  summaryTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  summaryBigScore: {
    fontFamily: FontFamilies.accent,
    fontSize: 64,
    color: MC9_PALETTE.sunshine,
    letterSpacing: -1,
    lineHeight: 72,
  },
  summaryScoreLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.lg,
  },
  summaryCardsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: MC9_PALETTE.cardBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: MC9_PALETTE.cardBorder,
    borderTopWidth: 3,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadows.card,
  },
  summaryCardNumber: {
    fontFamily: FontFamilies.accent,
    fontSize: 24,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  summaryCardLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  summaryCardPoints: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: MC9_PALETTE.sunshineDark,
  },
  summaryMessage: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },

  // ── Confetti ───────────────────────────────────────────────
  confettiContainer: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: 0,
    height: 0,
    zIndex: 10,
  },
  confettiParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
  },

  // ── Primary Button ─────────────────────────────────────────
  primaryButton: {
    backgroundColor: MC9_PALETTE.sunshine,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    minHeight: 52,
    ...Shadows.card,
  },
  primaryButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
