/**
 * PatternSpotter -- Step 1 "The Pattern Spotter"
 *
 * A multiple-choice pattern recognition quiz. The user identifies which
 * relational conflict patterns feel familiar, then receives a summary
 * of their primary pattern with therapeutic insights.
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

// ── Scenario Data ────────────────────────────────────────

interface Scenario {
  id: string;
  title: string;
  description: string;
  patternType: 'pursue-withdraw' | 'mutual-avoidance' | 'criticize-defend' | 'escalation' | 'freeze-appease';
}

const SCENARIOS: Scenario[] = [
  {
    id: 'pursue-withdraw',
    title: 'The Pursuit',
    description:
      'When one of you pulls away, the other follows more intensely -- asking more questions, seeking reassurance, needing to talk it through right now. The distance only makes the pursuit stronger.',
    patternType: 'pursue-withdraw',
  },
  {
    id: 'mutual-avoidance',
    title: 'The Silence',
    description:
      'Both of you go quiet. The tension sits in the room like a guest neither of you invited. Days can pass before anyone names what happened. It feels safer not to say anything at all.',
    patternType: 'mutual-avoidance',
  },
  {
    id: 'criticize-defend',
    title: 'The Shield and the Sword',
    description:
      'One of you names what went wrong -- sometimes sharply. The other immediately explains why it wasn\'t their fault. It becomes a loop: critique, defense, escalation, exhaustion.',
    patternType: 'criticize-defend',
  },
  {
    id: 'escalation',
    title: 'The Wildfire',
    description:
      'Small sparks become big flames quickly. Voices rise, old grievances resurface, and before long the original issue is buried under a pile of everything else. Someone eventually walks away.',
    patternType: 'escalation',
  },
  {
    id: 'freeze-appease',
    title: 'The Peace at Any Price',
    description:
      'One of you freezes -- unable to think clearly in the heat of it -- while the other smooths things over, agrees too quickly, or takes the blame just to make it stop. The real feelings stay hidden.',
    patternType: 'freeze-appease',
  },
];

const PATTERN_RESULTS: Record<string, { name: string; description: string; insights: string[] }> = {
  'pursue-withdraw': {
    name: 'Pursue-Withdraw',
    description:
      'One partner reaches out for connection while the other needs space. Both are seeking safety -- just in opposite ways.',
    insights: [
      'The pursuer is often driven by a fear of disconnection.',
      'The withdrawer is often protecting the relationship from their own overwhelm.',
      'Neither strategy is wrong -- they just need to be understood.',
    ],
  },
  'mutual-avoidance': {
    name: 'Mutual Avoidance',
    description:
      'Both partners retreat to protect themselves from the vulnerability of conflict. The peace is real, but so is the distance.',
    insights: [
      'Silence can feel like safety, but it often leaves important things unsaid.',
      'Both of you may be protecting the other by not speaking up.',
      'Small moments of gentle honesty can bridge the gap without overwhelming either of you.',
    ],
  },
  'criticize-defend': {
    name: 'Criticize-Defend',
    description:
      'One partner expresses frustration and the other deflects. Both are trying to be heard, but the pattern keeps either from truly listening.',
    insights: [
      'Criticism often hides a deeper request -- "I need you to see me."',
      'Defensiveness is a natural response to feeling attacked, not a character flaw.',
      'Softening the start of a conversation can change the entire trajectory.',
    ],
  },
  escalation: {
    name: 'Escalation',
    description:
      'Conflicts accelerate quickly, pulling in past hurts and building intensity. The energy of the argument overtakes its original purpose.',
    insights: [
      'Escalation often means both partners feel urgently unheard.',
      'The speed of the conflict bypasses your ability to think clearly.',
      'Learning to pause -- even briefly -- can break the cycle entirely.',
    ],
  },
  'freeze-appease': {
    name: 'Freeze-Appease',
    description:
      'One partner shuts down while the other smooths over. Resolution comes quickly on the surface but rarely reaches the root.',
    insights: [
      'Freezing is your nervous system protecting you, not a choice.',
      'Appeasing keeps the peace but at the cost of your own truth.',
      'Creating safety for the freeze to thaw is the first step toward real repair.',
    ],
  },
};

// ── Component ────────────────────────────────────────────

type Phase = 'welcome' | 'questions' | 'result';

export default function PatternSpotter({ onComplete, onSkip, phaseColor }: MiniGameComponentProps) {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  const handleResponse = useCallback(
    (familiar: boolean) => {
      const scenario = SCENARIOS[currentIndex];
      const next = { ...selections, [scenario.id]: familiar };
      setSelections(next);

      if (currentIndex < SCENARIOS.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setPhase('result');
      }
    },
    [currentIndex, selections],
  );

  // Determine primary pattern
  const result = useMemo(() => {
    const selected = Object.entries(selections)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (selected.length === 0) {
      // No patterns selected — return a neutral "none" result
      return {
        selectedPatterns: [] as string[],
        primary: {
          name: 'No Pattern Identified',
          description: 'No common relational pattern was identified in this session. That\'s perfectly okay — patterns often emerge over time.',
          insights: [
            'None of the common patterns felt familiar right now.',
            'Patterns often become visible over time as you observe your interactions.',
            'This is a great starting point — keep noticing.',
          ],
        },
        patternType: 'none',
      };
    }

    // Primary = first one selected (order matters -- it's the one that resonated first)
    const primaryType = selected[0];
    return {
      selectedPatterns: selected,
      primary: PATTERN_RESULTS[primaryType],
      patternType: primaryType,
    };
  }, [selections]);

  const handleFinish = useCallback(() => {
    onComplete({
      title: result.primary.name,
      insights: result.primary.insights,
      data: {
        selectedPatterns: result.selectedPatterns,
        patternType: result.patternType,
        allResponses: selections,
      },
    });
  }, [onComplete, result, selections]);

  // ── Welcome Screen ──
  if (phase === 'welcome') {
    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.welcomeCard}>
            <Text style={[styles.welcomeLabel, { color: phaseColor }]}>STEP 1</Text>
            <Text style={styles.welcomeTitle}>The Pattern Spotter</Text>
            <View style={styles.divider} />
            <Text style={styles.welcomeBody}>
              Every couple develops patterns -- predictable dances that show up whenever tension arises.
              These patterns are not failures. They are habits your relationship learned in order to survive.
            </Text>
            <Text style={styles.welcomeBody}>
              In this exercise, you will read through five common conflict patterns.
              Simply notice which ones feel familiar. There are no wrong answers.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: phaseColor }]}
              onPress={() => setPhase('questions')}
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

  // ── Questions Phase ──
  if (phase === 'questions') {
    const scenario = SCENARIOS[currentIndex];
    const progress = `${currentIndex + 1} of ${SCENARIOS.length}`;

    return (
      <View style={styles.container}>
        <Header onSkip={onSkip} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.progressRow}>
            <Text style={[styles.progressText, { color: phaseColor }]}>{progress}</Text>
            <View style={styles.progressTrack}>
              <Animated.View
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

          {/* Scenario Card */}
          <Animated.View
            key={scenario.id}
            entering={FadeInDown.duration(500).delay(100)}
            style={styles.scenarioCard}
          >
            <Text style={styles.scenarioTitle}>{scenario.title}</Text>
            <View style={styles.scenarioLine} />
            <Text style={styles.scenarioDescription}>{scenario.description}</Text>
          </Animated.View>

          {/* Response Buttons */}
          <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.responseRow}>
            <TouchableOpacity
              style={[styles.responseButton, styles.familiarButton]}
              onPress={() => handleResponse(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="This feels familiar"
            >
              <Text style={[styles.responseButtonText, { color: phaseColor }]}>
                This feels familiar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.responseButton, styles.notUsButton]}
              onPress={() => handleResponse(false)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Not us"
            >
              <Text style={styles.notUsButtonText}>Not us</Text>
            </TouchableOpacity>
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
          <Text style={[styles.resultLabel, { color: phaseColor }]}>YOUR PRIMARY PATTERN</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.resultCard}>
          <Text style={styles.resultName}>{result.primary.name}</Text>
          <View style={styles.resultDivider} />
          <Text style={styles.resultDescription}>{result.primary.description}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(500)} style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>What to Notice</Text>
          {result.primary.insights.map((insight, i) => (
            <Animated.View
              key={i}
              entering={FadeInUp.duration(400).delay(600 + i * 150)}
              style={styles.insightRow}
            >
              <View style={[styles.insightDot, { backgroundColor: phaseColor }]} />
              <Text style={styles.insightText}>{insight}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {result.selectedPatterns.length === 0 && (
          <Animated.View entering={FadeIn.duration(400).delay(800)} style={styles.noSelectionNote}>
            <Text style={styles.noSelectionText}>
              None of the patterns felt familiar right now -- and that is perfectly fine.
              Patterns often become visible over time. This is just a starting point.
            </Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.duration(400).delay(900)}>
          <Text style={styles.closingText}>
            Recognizing a pattern is not a diagnosis. It is the first gentle step toward changing the dance.
          </Text>
        </Animated.View>

        {/* On web, reanimated entering animations with delays can block
            touch events. Use a plain View to ensure the button is interactive. */}
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
          <Animated.View entering={FadeInUp.duration(400).delay(1100)}>
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

// ── Header Sub-Component ────────────────────────────────

function Header({ onSkip }: { onSkip: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>The Pattern Spotter</Text>
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  // Welcome
  welcomeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  welcomeLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  welcomeTitle: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  welcomeBody: {
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

  // Scenario Card
  scenarioCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  scenarioTitle: {
    ...Typography.serifHeading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  scenarioLine: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  scenarioDescription: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    lineHeight: 26,
  },

  // Response Buttons
  responseRow: {
    gap: Spacing.sm,
  },
  responseButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familiarButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  responseButtonText: {
    ...Typography.button,
  },
  notUsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  notUsButtonText: {
    ...Typography.buttonSmall,
    color: Colors.textMuted,
  },

  // Result
  resultLabelContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultLabel: {
    ...Typography.label,
  },
  resultCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.card,
  },
  resultName: {
    ...Typography.serifHeading,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  resultDivider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  resultDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
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

  noSelectionNote: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  noSelectionText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
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
