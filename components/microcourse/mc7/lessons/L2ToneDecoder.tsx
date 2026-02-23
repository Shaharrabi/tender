/**
 * L2ToneDecoder — MC7 Lesson 2
 *
 * Swipe-to-categorize card game. 5 identical text messages shown one at a time
 * (e.g., "Fine."), each with different context. User categorizes as WARM / NEUTRAL / COLD.
 * After sorting, reveals how tone is shaped by context, not words.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { MC7_PALETTE, MC7_TIMING } from '@/constants/mc7Theme';
import { ChatBubbleIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

// ─── Card Data ───────────────────────────────────────────

interface ToneCard {
  id: string;
  message: string;
  context: string;
  correctTone: 'warm' | 'neutral' | 'cold';
  explanation: string;
}

const TONE_CARDS: ToneCard[] = [
  {
    id: 'tone-1',
    message: "Fine.",
    context: "Your partner asks how you're feeling after a romantic date night together.",
    correctTone: 'warm',
    explanation: "After a beautiful evening together, 'Fine' with a period can actually mean 'I'm content and peaceful.' The context transforms a potentially cold word into warmth.",
  },
  {
    id: 'tone-2',
    message: "Fine.",
    context: "You just told your partner you can't make it to their important event.",
    correctTone: 'cold',
    explanation: "After a disappointment, 'Fine.' becomes a wall. It says 'I'm hurt but won't show it.' The period adds finality — a door closing.",
  },
  {
    id: 'tone-3',
    message: "Fine.",
    context: "Your partner asks if pizza works for dinner tonight.",
    correctTone: 'neutral',
    explanation: "For a low-stakes question, 'Fine.' is genuinely neutral — just a quick agreement. No hidden meaning, just efficiency.",
  },
  {
    id: 'tone-4',
    message: "Fine.",
    context: "You forgot your partner's request for the third time this week.",
    correctTone: 'cold',
    explanation: "After repeated letdowns, 'Fine.' carries the weight of accumulated frustration. It means 'I've given up asking.' That period is resignation.",
  },
  {
    id: 'tone-5',
    message: "Fine.",
    context: "Your partner just surprised you with your favorite coffee.",
    correctTone: 'warm',
    explanation: "After a sweet gesture, 'Fine.' becomes playful understatement — like saying 'you're okay I guess' with a smile. Tone lives in context, not words.",
  },
];

type Phase = 'intro' | 'game' | 'results';

type Tone = 'warm' | 'neutral' | 'cold';

interface SortChoice {
  cardId: string;
  chosen: Tone;
  correct: Tone;
  isCorrect: boolean;
}

// ─── Component ───────────────────────────────────────────

interface L2ToneDecoderProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export default function L2ToneDecoder({ content, onComplete }: L2ToneDecoderProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<SortChoice[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastChoice, setLastChoice] = useState<SortChoice | null>(null);

  const introFade = useRef(new Animated.Value(0)).current;
  const cardFlip = useRef(new Animated.Value(0)).current;
  const explanationFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'intro') {
      Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'game') {
      cardFlip.setValue(0);
      Animated.spring(cardFlip, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }).start();
    }
  }, [phase, currentIndex]);

  const startGame = useCallback(() => {
    haptics.tap();
    setPhase('game');
  }, [haptics]);

  const handleChooseTone = useCallback((chosen: Tone) => {
    const card = TONE_CARDS[currentIndex];
    const isCorrect = chosen === card.correctTone;
    const choice: SortChoice = { cardId: card.id, chosen, correct: card.correctTone, isCorrect };

    if (isCorrect) {
      haptics.playExerciseReveal();
    } else {
      haptics.tap();
    }

    setLastChoice(choice);
    setChoices(prev => [...prev, choice]);
    setShowExplanation(true);

    explanationFade.setValue(0);
    Animated.timing(explanationFade, { toValue: 1, duration: MC7_TIMING.toneReveal, useNativeDriver: true }).start();
  }, [currentIndex, haptics, explanationFade]);

  const advanceCard = useCallback(() => {
    haptics.tap();
    setShowExplanation(false);
    setLastChoice(null);

    const next = currentIndex + 1;
    if (next >= TONE_CARDS.length) {
      setPhase('results');
    } else {
      setCurrentIndex(next);
    }
  }, [currentIndex, haptics]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const correctCount = choices.filter(c => c.isCorrect).length;
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Tone Decoder Game',
      response: JSON.stringify({
        correctCount,
        total: TONE_CARDS.length,
        choices: choices.map(c => ({ cardId: c.cardId, chosen: c.chosen, correct: c.correct, isCorrect: c.isCorrect })),
      }),
      type: 'game',
    }];
    onComplete(responses);
  }, [choices, onComplete, haptics]);

  // ─── Render ────────────────────────────────────────────

  const toneColor = (tone: Tone) =>
    tone === 'warm' ? MC7_PALETTE.connecting
    : tone === 'neutral' ? MC7_PALETTE.neutral
    : MC7_PALETTE.disconnecting;

  const toneLabel = (tone: Tone) =>
    tone === 'warm' ? 'Warm' : tone === 'neutral' ? 'Neutral' : 'Cold';

  const renderIntro = () => {
    const paragraphs = content.readContent
      ? content.readContent.split('\n').filter((p: string) => p.trim().length > 0)
      : [];

    return (
      <Animated.View style={[styles.phaseContainer, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}>
            <ChatBubbleIcon size={28} color={MC7_PALETTE.phoneBlue} />
            <Text style={styles.introTitle}>Tone Decoder</Text>
          </View>
          {paragraphs.length > 0 ? (
            paragraphs.map((p: string, i: number) => (
              <Text key={i} style={styles.introParagraph}>{p.trim()}</Text>
            ))
          ) : (
            <Text style={styles.introParagraph}>
              The same word can mean completely different things depending on context.
              "Fine." can be warm, neutral, or ice-cold. In this exercise, you'll see
              the same message five times — but each time with different context.
              Your job: decode the real tone.
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Decoding</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderGame = () => {
    const card = TONE_CARDS[currentIndex];

    return (
      <View style={styles.phaseContainer}>
        <View style={styles.progressRow}>
          {TONE_CARDS.map((_, i) => (
            <View key={i} style={[
              styles.progressDot,
              i < currentIndex && styles.progressDotDone,
              i === currentIndex && styles.progressDotCurrent,
            ]} />
          ))}
        </View>

        <Animated.View style={[styles.toneCard, { opacity: cardFlip, transform: [{ scale: cardFlip.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }]}>
          <Text style={styles.messageLabel}>The message:</Text>
          <Text style={styles.messageText}>"{card.message}"</Text>
          <View style={styles.contextBox}>
            <Text style={styles.contextLabel}>Context:</Text>
            <Text style={styles.contextText}>{card.context}</Text>
          </View>
        </Animated.View>

        {!showExplanation ? (
          <View style={styles.toneButtons}>
            <Text style={styles.tonePrompt}>What tone does this carry?</Text>
            <View style={styles.toneRow}>
              {(['warm', 'neutral', 'cold'] as Tone[]).map(tone => (
                <TouchableOpacity
                  key={tone}
                  style={[styles.toneButton, { borderColor: toneColor(tone) }]}
                  onPress={() => handleChooseTone(tone)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.toneDotInner, { backgroundColor: toneColor(tone) }]} />
                  <Text style={[styles.toneButtonText, { color: toneColor(tone) }]}>{toneLabel(tone)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <Animated.View style={[styles.explanationArea, { opacity: explanationFade }]}>
            <View style={styles.explanationCard}>
              <View style={[styles.resultBadge, { backgroundColor: lastChoice?.isCorrect ? MC7_PALETTE.correct : MC7_PALETTE.incorrect }]}>
                <Text style={styles.resultBadgeText}>
                  {lastChoice?.isCorrect ? 'Correct!' : `Actually: ${toneLabel(card.correctTone)}`}
                </Text>
              </View>
              <Text style={styles.explanationText}>{card.explanation}</Text>
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={advanceCard} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>{currentIndex + 1 < TONE_CARDS.length ? 'Next Card' : 'See Results'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

  const renderResults = () => {
    const correctCount = choices.filter(c => c.isCorrect).length;

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <SparkleIcon size={32} color={MC7_PALETTE.phoneBlue} />
          <Text style={styles.resultsTitle}>Tone is Contextual</Text>
        </View>

        <Text style={styles.resultsSummary}>
          You decoded {correctCount} out of {TONE_CARDS.length} tones correctly.
        </Text>

        <Text style={styles.resultsInsight}>
          The same words can carry completely different emotional weight.
          When reading your partner's texts, always consider: What just happened?
          How are they feeling? What might they really be saying?
        </Text>

        <View style={styles.resultsGrid}>
          {TONE_CARDS.map((card, i) => {
            const choice = choices[i];
            return (
              <View key={card.id} style={[styles.resultCard, { borderLeftColor: toneColor(card.correctTone), borderLeftWidth: 3 }]}>
                <Text style={styles.resultCardContext} numberOfLines={2}>{card.context}</Text>
                <View style={styles.resultCardRow}>
                  <Text style={[styles.resultCardTone, { color: toneColor(card.correctTone) }]}>{toneLabel(card.correctTone)}</Text>
                  {choice && !choice.isCorrect && (
                    <Text style={styles.resultCardYours}>(you said: {toneLabel(choice.chosen)})</Text>
                  )}
                  {choice?.isCorrect && <Text style={styles.resultCardCheck}>{'\u2713'}</Text>}
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleFinish} activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {phase === 'intro' && renderIntro()}
      {phase === 'game' && renderGame()}
      {phase === 'results' && renderResults()}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phaseContainer: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.lg },

  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  introParagraph: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },

  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.borderLight },
  progressDotDone: { backgroundColor: MC7_PALETTE.phoneBlue },
  progressDotCurrent: { backgroundColor: MC7_PALETTE.phoneBlue, width: 14, height: 14, borderRadius: 7 },

  toneCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: Spacing.xl, marginVertical: Spacing.lg, ...Shadows.card, borderWidth: 1, borderColor: MC7_PALETTE.cardBorder, alignItems: 'center' },
  messageLabel: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.textMuted, marginBottom: Spacing.xs },
  messageText: { fontFamily: FontFamilies.accent, fontSize: FontSizes.headingXL, color: Colors.text, textAlign: 'center', marginBottom: Spacing.lg },
  contextBox: { backgroundColor: MC7_PALETTE.phoneBlueLight + '40', borderRadius: BorderRadius.md, padding: Spacing.md, width: '100%' },
  contextLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC7_PALETTE.phoneBlueDark, fontWeight: '600', marginBottom: 4 },
  contextText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },

  toneButtons: { gap: Spacing.md, paddingBottom: Spacing.xl },
  tonePrompt: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', fontWeight: '600' },
  toneRow: { flexDirection: 'row', gap: Spacing.sm },
  toneButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 2, alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF' },
  toneDotInner: { width: 12, height: 12, borderRadius: 6 },
  toneButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, fontWeight: '600' },

  explanationArea: { gap: Spacing.md, paddingBottom: Spacing.xl },
  explanationCard: { backgroundColor: MC7_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.lg, ...Shadows.subtle, gap: Spacing.sm },
  resultBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 99 },
  resultBadgeText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: '#FFFFFF', fontWeight: '600' },
  explanationText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },
  nextButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', ...Shadows.subtle },
  nextButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },

  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  resultsTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  resultsSummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', marginBottom: Spacing.md, lineHeight: 24 },
  resultsInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg, fontStyle: 'italic' },
  resultsGrid: { gap: Spacing.sm, marginBottom: Spacing.lg },
  resultCard: { backgroundColor: MC7_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC7_PALETTE.cardBorder },
  resultCardContext: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 20, marginBottom: Spacing.xs },
  resultCardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  resultCardTone: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, fontWeight: '600' },
  resultCardYours: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.textMuted },
  resultCardCheck: { fontSize: 14, color: MC7_PALETTE.correct, fontWeight: '700' },

  continueButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
