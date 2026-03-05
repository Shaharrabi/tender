/**
 * L3TextLab — MC7 Lesson 3
 *
 * A/B comparison + rewrite builder. Two versions of the same text exchange
 * shown side-by-side: "Disconnecting" vs "Connecting." User identifies which
 * is which. Then a "Text Rewrite Workshop" — user taps word-chips to
 * construct a connecting rewrite from a disconnecting text.
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
import { MC7_PALETTE } from '@/constants/mc7Theme';
import { PuzzleIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

// ─── Data ────────────────────────────────────────────────

interface ABPair {
  id: string;
  situation: string;
  textA: string;
  textB: string;
  connectingIs: 'A' | 'B';
  explanation: string;
}

const AB_PAIRS: ABPair[] = [
  {
    id: 'ab-1',
    situation: 'Partner comes home late from work without texting.',
    textA: "Where were you? You never tell me anything.",
    textB: "I was worried when I didn't hear from you. Everything okay?",
    connectingIs: 'B',
    explanation: 'Text B names the feeling (worry) without blame. Text A uses "never" — a word that puts people on the defensive instantly.',
  },
  {
    id: 'ab-2',
    situation: 'Deciding what to do this weekend.',
    textA: "I don't care, you pick.",
    textB: "I'm up for anything! What sounds fun to you?",
    connectingIs: 'B',
    explanation: '"I don\'t care" dismisses the invitation to co-create. "I\'m up for anything" brings enthusiasm and shared decision-making.',
  },
  {
    id: 'ab-3',
    situation: 'Partner shares they had a tough conversation with a friend.',
    textA: "Well, you probably shouldn't have said that to them.",
    textB: "That sounds hard. How are you feeling about it?",
    connectingIs: 'B',
    explanation: 'Text A jumps to judgment. Text B validates the difficulty and opens space for feelings. People need empathy before advice.',
  },
];

interface RewriteChallenge {
  id: string;
  disconnecting: string;
  chips: string[];
  correctOrder: number[];
  rewriteResult: string;
}

const REWRITE_CHALLENGES: RewriteChallenge[] = [
  {
    id: 'rw-1',
    disconnecting: "You always leave your stuff everywhere. I'm not your maid.",
    chips: ["I feel overwhelmed", "when the house is messy.", "Could we figure out", "a system together?"],
    correctOrder: [0, 1, 2, 3],
    rewriteResult: "I feel overwhelmed when the house is messy. Could we figure out a system together?",
  },
  {
    id: 'rw-2',
    disconnecting: "Fine. Do whatever you want. I don't care anymore.",
    chips: ["I'm feeling hurt", "right now.", "Can we talk about this", "when we've both calmed down?"],
    correctOrder: [0, 1, 2, 3],
    rewriteResult: "I'm feeling hurt right now. Can we talk about this when we've both calmed down?",
  },
];

type Phase = 'intro' | 'compare' | 'rewrite' | 'results';

// ─── Component ───────────────────────────────────────────

interface L3TextLabProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export default function L3TextLab({ content, onComplete }: L3TextLabProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [compareIndex, setCompareIndex] = useState(0);
  const [compareChoices, setCompareChoices] = useState<string[]>([]);
  const [showCompareResult, setShowCompareResult] = useState(false);
  const [lastCompareCorrect, setLastCompareCorrect] = useState(false);

  const [rewriteIndex, setRewriteIndex] = useState(0);
  const [selectedChips, setSelectedChips] = useState<number[]>([]);
  const [rewriteComplete, setRewriteComplete] = useState(false);

  const introFade = useRef(new Animated.Value(0)).current;
  const resultFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'intro') {
      Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [phase]);

  const startGame = useCallback(() => {
    haptics.tap();
    setPhase('compare');
  }, [haptics]);

  // ─── Compare Phase ─────────────────────────────────────

  const handleCompareChoice = useCallback((choice: 'A' | 'B') => {
    const pair = AB_PAIRS[compareIndex];
    const correct = choice === pair.connectingIs;
    setLastCompareCorrect(correct);
    setCompareChoices(prev => [...prev, choice]);
    setShowCompareResult(true);

    if (correct) haptics.playExerciseReveal();
    else haptics.tap();

    resultFade.setValue(0);
    Animated.timing(resultFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [compareIndex, haptics, resultFade]);

  const advanceCompare = useCallback(() => {
    haptics.tap();
    setShowCompareResult(false);
    const next = compareIndex + 1;
    if (next >= AB_PAIRS.length) {
      setPhase('rewrite');
    } else {
      setCompareIndex(next);
    }
  }, [compareIndex, haptics]);

  // ─── Rewrite Phase ─────────────────────────────────────

  const handleChipTap = useCallback((chipIndex: number) => {
    haptics.tap();
    const challenge = REWRITE_CHALLENGES[rewriteIndex];

    if (selectedChips.includes(chipIndex)) {
      setSelectedChips(prev => prev.filter(i => i !== chipIndex));
      return;
    }

    const newSelected = [...selectedChips, chipIndex];
    setSelectedChips(newSelected);

    if (newSelected.length === challenge.chips.length) {
      setRewriteComplete(true);
      haptics.playExerciseReveal();
    }
  }, [rewriteIndex, selectedChips, haptics]);

  const advanceRewrite = useCallback(() => {
    haptics.tap();
    const next = rewriteIndex + 1;
    if (next >= REWRITE_CHALLENGES.length) {
      setPhase('results');
    } else {
      setRewriteIndex(next);
      setSelectedChips([]);
      setRewriteComplete(false);
    }
  }, [rewriteIndex, haptics]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const correctCompares = compareChoices.filter((c, i) => c === AB_PAIRS[i].connectingIs).length;
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Text Lab',
      response: JSON.stringify({
        comparesCorrect: correctCompares,
        totalCompares: AB_PAIRS.length,
        rewritesCompleted: REWRITE_CHALLENGES.length,
      }),
      type: 'game',
    }];
    onComplete(responses);
  }, [compareChoices, onComplete, haptics]);

  // ─── Render ────────────────────────────────────────────

  const renderIntro = () => {
    const paragraphs = content.readContent
      ? content.readContent.split('\n').filter((p: string) => p.trim().length > 0)
      : [];

    return (
      <Animated.View style={[styles.phaseContainer, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}>
            <PuzzleIcon size={28} color={MC7_PALETTE.phoneBlue} />
            <Text style={styles.introTitle}>Text Lab</Text>
          </View>
          {paragraphs.length > 0 ? (
            paragraphs.map((p: string, i: number) => (
              <Text key={i} style={styles.introParagraph}>{p.trim()}</Text>
            ))
          ) : (
            <Text style={styles.introParagraph}>
              Time to get hands-on with text communication. First, you'll compare
              two versions of the same text exchange — one connecting, one
              disconnecting. Then you'll step into the lab and rewrite disconnecting
              texts into connecting ones using word chips.
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Enter the Lab</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderCompare = () => {
    const pair = AB_PAIRS[compareIndex];

    return (
      <View style={styles.phaseContainer}>
        <View style={styles.progressRow}>
          <Text style={styles.phaseLabel}>Part 1: Spot the Connection</Text>
          <Text style={styles.progressText}>{compareIndex + 1}/{AB_PAIRS.length}</Text>
        </View>

        <Text style={styles.situationText}>{pair.situation}</Text>

        <View style={styles.compareRow}>
          <TouchableOpacity
            style={[styles.compareCard, showCompareResult && pair.connectingIs === 'A' && styles.compareCardCorrect, showCompareResult && pair.connectingIs !== 'A' && styles.compareCardWrong]}
            onPress={() => !showCompareResult && handleCompareChoice('A')}
            activeOpacity={showCompareResult ? 1 : 0.7}
            disabled={showCompareResult}
          >
            <Text style={styles.compareLabel}>Text A</Text>
            <Text style={styles.compareText}>{pair.textA}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.compareCard, showCompareResult && pair.connectingIs === 'B' && styles.compareCardCorrect, showCompareResult && pair.connectingIs !== 'B' && styles.compareCardWrong]}
            onPress={() => !showCompareResult && handleCompareChoice('B')}
            activeOpacity={showCompareResult ? 1 : 0.7}
            disabled={showCompareResult}
          >
            <Text style={styles.compareLabel}>Text B</Text>
            <Text style={styles.compareText}>{pair.textB}</Text>
          </TouchableOpacity>
        </View>

        {!showCompareResult && (
          <Text style={styles.promptText}>Which text is more connecting? Tap to choose.</Text>
        )}

        {showCompareResult && (
          <Animated.View style={[styles.compareResultCard, { opacity: resultFade }]}>
            <View style={[styles.badge, { backgroundColor: lastCompareCorrect ? MC7_PALETTE.correct : MC7_PALETTE.incorrect }]}>
              <Text style={styles.badgeText}>{lastCompareCorrect ? 'Correct!' : 'Not quite'}</Text>
            </View>
            <Text style={styles.explanationText}>{pair.explanation}</Text>
            <TouchableOpacity style={styles.nextButton} onPress={advanceCompare} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>{compareIndex + 1 < AB_PAIRS.length ? 'Next Pair' : 'Start Rewriting'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

  const renderRewrite = () => {
    const challenge = REWRITE_CHALLENGES[rewriteIndex];
    const builtText = selectedChips.map(i => challenge.chips[i]).join(' ');

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: Spacing.lg }]} showsVerticalScrollIndicator={false}>
        <View style={styles.progressRow}>
          <Text style={styles.phaseLabel}>Part 2: Rewrite Workshop</Text>
          <Text style={styles.progressText}>{rewriteIndex + 1}/{REWRITE_CHALLENGES.length}</Text>
        </View>

        <View style={styles.disconnectingBox}>
          <Text style={styles.disconnectingLabel}>Disconnecting text:</Text>
          <Text style={styles.disconnectingText}>"{challenge.disconnecting}"</Text>
        </View>

        <Text style={styles.rewritePrompt}>Build a connecting rewrite by tapping the phrases in order:</Text>

        <View style={styles.builtTextBox}>
          <Text style={styles.builtText}>{builtText || 'Tap phrases below to build your rewrite...'}</Text>
        </View>

        <View style={styles.chipsContainer}>
          {challenge.chips.map((chip, i) => {
            const isSelected = selectedChips.includes(i);
            const order = selectedChips.indexOf(i);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleChipTap(i)}
                activeOpacity={0.7}
              >
                {isSelected && <Text style={styles.chipOrder}>{order + 1}</Text>}
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{chip}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {rewriteComplete && (
          <View style={styles.rewriteSuccessCard}>
            <SparkleIcon size={20} color={MC7_PALETTE.connecting} />
            <Text style={styles.rewriteSuccessText}>
              Beautiful rewrite! Notice how naming feelings and making requests creates connection.
            </Text>
            <TouchableOpacity style={styles.nextButton} onPress={advanceRewrite} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>
                {rewriteIndex + 1 < REWRITE_CHALLENGES.length ? 'Next Rewrite' : 'See Summary'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderResults = () => {
    const correctCompares = compareChoices.filter((c, i) => c === AB_PAIRS[i].connectingIs).length;

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <SparkleIcon size={32} color={MC7_PALETTE.phoneBlue} />
          <Text style={styles.resultsTitle}>Lab Complete</Text>
        </View>

        <Text style={styles.resultsSummary}>
          You identified {correctCompares}/{AB_PAIRS.length} connecting texts and
          rewrote {REWRITE_CHALLENGES.length} disconnecting messages.
        </Text>

        <View style={styles.keyTakeawayCard}>
          <Text style={styles.keyTakeawayTitle}>Key Takeaways</Text>
          <Text style={styles.keyTakeawayItem}>Name feelings instead of blaming</Text>
          <Text style={styles.keyTakeawayItem}>Ask questions instead of assuming</Text>
          <Text style={styles.keyTakeawayItem}>Make requests, not demands</Text>
          <Text style={styles.keyTakeawayItem}>Validate before advising</Text>
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
      {phase === 'compare' && renderCompare()}
      {phase === 'rewrite' && renderRewrite()}
      {phase === 'results' && renderResults()}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phaseContainer: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.scrollPadBottom, paddingHorizontal: Spacing.lg },

  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  introParagraph: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },

  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  phaseLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: MC7_PALETTE.phoneBlue, fontWeight: '600' },
  progressText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: Colors.textSecondary, fontWeight: '600' },

  situationText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, marginBottom: Spacing.lg, textAlign: 'center', fontStyle: 'italic' },

  compareRow: { gap: Spacing.md, marginBottom: Spacing.md },
  compareCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 2, borderColor: MC7_PALETTE.cardBorder, ...Shadows.subtle },
  compareCardCorrect: { borderColor: MC7_PALETTE.connecting, backgroundColor: MC7_PALETTE.correctLight },
  compareCardWrong: { borderColor: MC7_PALETTE.disconnecting + '40', opacity: 0.7 },
  compareLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: Colors.textMuted, fontWeight: '600', marginBottom: Spacing.xs },
  compareText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, fontStyle: 'italic' },

  promptText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: Colors.textSecondary, textAlign: 'center' },

  compareResultCard: { backgroundColor: MC7_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.lg, ...Shadows.subtle, gap: Spacing.md, marginTop: Spacing.md },
  badge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 99 },
  badgeText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: '#FFFFFF', fontWeight: '600' },
  explanationText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },
  nextButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', ...Shadows.subtle },
  nextButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },

  disconnectingBox: { backgroundColor: MC7_PALETTE.incorrectLight, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderLeftWidth: 3, borderLeftColor: MC7_PALETTE.disconnecting, marginBottom: Spacing.lg },
  disconnectingLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC7_PALETTE.disconnecting, fontWeight: '600', marginBottom: Spacing.xs },
  disconnectingText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, fontStyle: 'italic' },

  rewritePrompt: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: Colors.text, marginBottom: Spacing.md },

  builtTextBox: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: MC7_PALETTE.connecting + '40', minHeight: 80, marginBottom: Spacing.lg },
  builtText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },

  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  chip: { backgroundColor: MC7_PALETTE.phoneBlueLight, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, borderWidth: 1, borderColor: MC7_PALETTE.phoneBlue + '30' },
  chipSelected: { backgroundColor: MC7_PALETTE.phoneBlue, borderColor: MC7_PALETTE.phoneBlue },
  chipOrder: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: '#FFFFFF', fontWeight: '700', width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 18 },
  chipText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: MC7_PALETTE.phoneBlueDark },
  chipTextSelected: { color: '#FFFFFF' },

  rewriteSuccessCard: { backgroundColor: MC7_PALETTE.correctLight, borderRadius: BorderRadius.lg, padding: Spacing.lg, gap: Spacing.md, alignItems: 'center' },
  rewriteSuccessText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24, textAlign: 'center' },

  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  resultsTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  resultsSummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg },

  keyTakeawayCard: { backgroundColor: MC7_PALETTE.phoneBlueLight + '40', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg, gap: Spacing.sm, borderWidth: 1, borderColor: MC7_PALETTE.phoneBlue + '20' },
  keyTakeawayTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: MC7_PALETTE.phoneBlueDark, fontWeight: '600', marginBottom: Spacing.xs },
  keyTakeawayItem: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22, paddingLeft: Spacing.md },

  continueButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
