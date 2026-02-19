/**
 * L4: Scenario Carousel -- Boundary Moments
 *
 * Four boundary scenarios presented sequentially. Each scenario offers
 * three response options (avoidance / boundary / reactive). User picks
 * one, sees the outcome, then advances.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC4_PALETTE } from '@/constants/mc4Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

// ─── Types ────────────────────────────────────────────────

type Phase = 'intro' | 'scenarios' | 'results';
type OptionType = 'avoidance' | 'boundary' | 'reactive';

interface ScenarioOption {
  type: OptionType;
  text: string;
  outcome: string;
}

interface Scenario {
  id: number;
  situation: string;
  guiltyThought: string;
  options: ScenarioOption[];
}

// ─── Data ─────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    situation: "Your partner wants to spend every evening together, but you need alone time to recharge.",
    guiltyThought: "If I need space, maybe I don\u2019t love them enough.",
    options: [
      { type: 'avoidance', text: "Go along with it and silently resent the lost time", outcome: "Your resentment builds. You start picking fights about unrelated things." },
      { type: 'boundary', text: "Say: \u2018I love our time together. I also need two evenings a week for myself \u2014 it helps me show up better for us.\u2019", outcome: "Your partner feels reassured by the warmth and respects your need. You return refreshed." },
      { type: 'reactive', text: "Snap: \u2018You\u2019re so clingy! I can\u2019t breathe!\u2019", outcome: "Your partner feels attacked and withdraws. The distance grows wider than the space you needed." },
    ],
  },
  {
    id: 2,
    situation: "Your in-laws give unsolicited parenting advice every visit and your partner stays silent.",
    guiltyThought: "Maybe I\u2019m being too sensitive. They\u2019re just trying to help.",
    options: [
      { type: 'avoidance', text: "Smile and nod, then cry in the car on the way home", outcome: "The pattern continues. You start dreading family visits and resenting your partner\u2019s silence." },
      { type: 'boundary', text: "Tell your partner privately: \u2018I need us to be a team here. Can we agree on how to handle advice together?\u2019", outcome: "Your partner steps up. Together you create a united front that strengthens your bond." },
      { type: 'reactive', text: "Confront the in-laws at dinner: \u2018Mind your own business!\u2019", outcome: "A family rift forms. Your partner feels caught in the middle and pulls away from you." },
    ],
  },
  {
    id: 3,
    situation: "Your partner reads your private journal without permission.",
    guiltyThought: "If I have nothing to hide, why does this bother me so much?",
    options: [
      { type: 'avoidance', text: "Stop writing in your journal altogether", outcome: "You lose an important outlet. Your inner world shrinks to avoid vulnerability." },
      { type: 'boundary', text: "Say: \u2018My journal is private, and I need you to respect that. If you\u2019re worried about something, ask me directly.\u2019", outcome: "Clear boundary stated with care. Your partner apologizes and learns to communicate directly." },
      { type: 'reactive', text: "Go through their phone to \u2018even the score\u2019", outcome: "Trust erodes on both sides. You\u2019ve both now violated each other\u2019s privacy." },
    ],
  },
  {
    id: 4,
    situation: "Your partner frequently cancels plans you\u2019ve made together to hang out with friends instead.",
    guiltyThought: "Maybe I\u2019m not fun enough. I should just be more easygoing.",
    options: [
      { type: 'avoidance', text: "Stop making plans altogether to avoid disappointment", outcome: "You disconnect from your own desires. The relationship loses structure and intentionality." },
      { type: 'boundary', text: "Say: \u2018Our time together matters to me. Can we protect our plans and schedule friend time separately?\u2019", outcome: "Your partner realizes the impact and you create a rhythm that honors both connections." },
      { type: 'reactive', text: "Give the silent treatment when they come home", outcome: "Passive aggression breeds confusion. Your partner doesn\u2019t understand what went wrong." },
    ],
  },
];

const OPTION_COLORS: Record<OptionType, string> = {
  avoidance: MC4_PALETTE.porousRose,
  boundary: MC4_PALETTE.successGreen,
  reactive: MC4_PALETTE.rigidBlue,
};

// ─── Component ────────────────────────────────────────────

interface L4ScenarioCarouselProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L4ScenarioCarousel({ content, attachmentStyle, onComplete }: L4ScenarioCarouselProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [choices, setChoices] = useState<(OptionType | null)[]>([null, null, null, null]);
  const [revealed, setRevealed] = useState(false);

  const introFade = useRef(new Animated.Value(1)).current;
  const scenarioFade = useRef(new Animated.Value(0)).current;
  const outcomeFade = useRef(new Animated.Value(0)).current;

  const scenario = SCENARIOS[currentIdx];
  const chosen = choices[currentIdx];

  const transitionTo = useCallback((fadeOut: Animated.Value, fadeIn: Animated.Value, cb?: () => void) => {
    Animated.timing(fadeOut, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      cb?.();
      fadeIn.setValue(0);
      Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    });
  }, []);

  const handleStart = useCallback(() => {
    haptics.tap();
    transitionTo(introFade, scenarioFade, () => setPhase('scenarios'));
  }, [haptics, introFade, scenarioFade, transitionTo]);

  const handleSelect = useCallback((type: OptionType) => {
    if (revealed) return;
    haptics.tap();
    const next = [...choices];
    next[currentIdx] = type;
    setChoices(next);
    setRevealed(true);
    outcomeFade.setValue(0);
    Animated.timing(outcomeFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [revealed, haptics, choices, currentIdx, outcomeFade]);

  const handleNext = useCallback(() => {
    haptics.tap();
    if (currentIdx < SCENARIOS.length - 1) {
      scenarioFade.setValue(0);
      setRevealed(false);
      outcomeFade.setValue(0);
      setCurrentIdx(currentIdx + 1);
      Animated.timing(scenarioFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    } else {
      // Finish
      const boundaryCount = choices.filter((c) => c === 'boundary').length;
      const responses: StepResponseEntry[] = [{
        step: 1,
        prompt: 'Boundary Scenarios',
        response: JSON.stringify({
          choices: SCENARIOS.map((s, i) => ({
            scenarioId: s.id,
            chosen: choices[i],
            choseBoundary: choices[i] === 'boundary',
          })),
          boundaryScore: `${boundaryCount}/4`,
        }),
        type: 'interactive',
      }];
      haptics.playConfetti();
      setPhase('results');
      onComplete(responses);
    }
  }, [haptics, currentIdx, choices, scenarioFade, outcomeFade, onComplete]);

  // ─── Intro ──────────────────────────────────

  if (phase === 'intro') {
    return (
      <Animated.View style={[styles.container, { opacity: introFade }]}>
        <View style={styles.centered}>
          <Text style={styles.title}>BOUNDARY MOMENTS</Text>
          <Text style={styles.description}>
            Four real-world scenarios. Each one offers three paths{'\u2009'}{'\u2014'}{'\u2009'}
            avoidance, a clear boundary, or a reactive response.{'\n\n'}
            See what happens when you choose.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.7}>
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ─── Results ────────────────────────────────

  if (phase === 'results') {
    const boundaryCount = choices.filter((c) => c === 'boundary').length;
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>YOUR RESULTS</Text>
        <Text style={styles.scoreText}>{boundaryCount} / 4</Text>
        <Text style={styles.scoreSub}>boundary choices</Text>
        <Text style={styles.description}>
          {boundaryCount === 4
            ? 'You chose the boundary path every time. Impressive clarity.'
            : boundaryCount >= 2
              ? 'You found the boundary in most moments. Keep practicing \u2014 it gets easier.'
              : 'Boundaries are a skill, not a talent. Each scenario you revisit builds the muscle.'}
        </Text>
      </View>
    );
  }

  // ─── Scenarios ──────────────────────────────

  const chosenOption = scenario.options.find((o) => o.type === chosen);

  return (
    <Animated.View style={[styles.container, { opacity: scenarioFade }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.progress}>Scenario {currentIdx + 1} of 4</Text>

        {/* Scenario Card */}
        <View style={styles.scenarioCard}>
          <Text style={styles.situation}>{scenario.situation}</Text>
          <Text style={styles.guiltyThought}>{'\u201C'}{scenario.guiltyThought}{'\u201D'}</Text>
        </View>

        {/* Options */}
        {scenario.options.map((opt) => {
          const isChosen = chosen === opt.type;
          const isDimmed = chosen !== null && !isChosen;
          const color = OPTION_COLORS[opt.type];

          return (
            <TouchableOpacity
              key={opt.type}
              style={[
                styles.optionCard,
                isChosen && { backgroundColor: color, borderColor: color },
                isDimmed && styles.optionDimmed,
              ]}
              onPress={() => handleSelect(opt.type)}
              activeOpacity={0.7}
              disabled={revealed}
            >
              <Text style={[styles.optionText, isChosen && styles.optionTextChosen]}>
                {opt.text}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Outcome Reveal */}
        {revealed && chosenOption && (
          <Animated.View style={[styles.outcomeCard, { opacity: outcomeFade }]}>
            {chosen === 'boundary' ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Great choice!</Text>
              </View>
            ) : (
              <Text style={styles.hint}>
                The boundary option was:{' '}
                <Text style={{ fontStyle: 'italic' }}>
                  {scenario.options.find((o) => o.type === 'boundary')?.text}
                </Text>
              </Text>
            )}
            <Text style={styles.outcomeText}>{chosenOption.outcome}</Text>
          </Animated.View>
        )}

        {/* Next Button */}
        {revealed && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.7}>
            <Text style={styles.nextButtonText}>
              {currentIdx < SCENARIOS.length - 1 ? 'NEXT SCENARIO' : 'SEE RESULTS'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },

  title: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 3,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },

  // Intro
  startButton: {
    backgroundColor: MC4_PALETTE.teal,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.xl,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 2,
  },

  // Scenarios
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  progress: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  scenarioCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  situation: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
  guiltyThought: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },

  // Options
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  optionDimmed: { opacity: 0.45 },
  optionText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  optionTextChosen: { color: '#FFF', fontWeight: '600' },

  // Outcome
  outcomeCard: {
    backgroundColor: MC4_PALETTE.softMint,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: MC4_PALETTE.teal,
  },
  outcomeText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: MC4_PALETTE.successGreen,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    color: '#FFF',
    fontSize: FontSizes.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },

  // Next
  nextButton: {
    backgroundColor: MC4_PALETTE.deepTeal,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: Spacing.lg,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 1.5,
  },

  // Results
  scoreText: {
    fontFamily: FontFamilies.accent,
    fontSize: 48,
    color: MC4_PALETTE.successGreen,
    marginTop: Spacing.lg,
  },
  scoreSub: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
});
