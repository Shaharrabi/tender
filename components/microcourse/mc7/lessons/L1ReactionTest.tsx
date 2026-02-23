/**
 * L1ReactionTest — MC7 Lesson 1
 *
 * Phone-style UI: a text message from "partner" appears as a notification.
 * Three response options appear as sendable message bubbles.
 * User taps one. Then we show what that text FEELS like to receive.
 * 4 rounds of increasingly emotional messages.
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
import { MC7_PALETTE, MC7_TIMING } from '@/constants/mc7Theme';
import { PhoneIcon, ChatBubbleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Scenarios ───────────────────────────────────────────

interface ResponseOption {
  text: string;
  landing: string; // How it feels to receive this
  type: 'connecting' | 'neutral' | 'disconnecting';
}

interface TextScenario {
  id: string;
  partnerMessage: string;
  context: string;
  options: ResponseOption[];
}

const SCENARIOS: TextScenario[] = [
  {
    id: 'scenario-1',
    partnerMessage: "I had the worst day at work today.",
    context: 'Your partner just got home and sends this text from the other room.',
    options: [
      {
        text: "That sucks. What happened?",
        landing: "This lands as genuine curiosity. Your partner feels heard and invited to share.",
        type: 'connecting',
      },
      {
        text: "Yeah, me too.",
        landing: "This lands as competition. Your partner feels dismissed — their experience doesn't matter.",
        type: 'disconnecting',
      },
      {
        text: "Sorry to hear that.",
        landing: "This lands as polite but distant. Acknowledges but doesn't invite more.",
        type: 'neutral',
      },
    ],
  },
  {
    id: 'scenario-2',
    partnerMessage: "Do we really have to go to your mom's this weekend?",
    context: 'Sent on Wednesday evening while making dinner plans.',
    options: [
      {
        text: "You always do this. Yes, we're going.",
        landing: "This lands as dismissal and control. The word 'always' triggers defensiveness instantly.",
        type: 'disconnecting',
      },
      {
        text: "Sounds like you're feeling drained. Want to talk about it?",
        landing: "This lands as empathy. You saw the feeling beneath the question — that's repair magic.",
        type: 'connecting',
      },
      {
        text: "I'll think about it.",
        landing: "This lands as avoidance. It delays conflict but leaves your partner's concern unaddressed.",
        type: 'neutral',
      },
    ],
  },
  {
    id: 'scenario-3',
    partnerMessage: "You forgot to pick up the groceries again.",
    context: 'Sent mid-afternoon. You can feel the frustration.',
    options: [
      {
        text: "I'm sorry, I got pulled into meetings. I'll go now.",
        landing: "This lands as accountability and action. No excuses, just ownership — deeply connecting.",
        type: 'connecting',
      },
      {
        text: "You could have gone yourself.",
        landing: "This lands as counter-attack. Instead of addressing the issue, you deflect blame back.",
        type: 'disconnecting',
      },
      {
        text: "Oh right. My bad.",
        landing: "This lands as minimal acknowledgment. Brief, but lacks warmth or repair effort.",
        type: 'neutral',
      },
    ],
  },
  {
    id: 'scenario-4',
    partnerMessage: "I don't think you understand how stressed I've been lately.",
    context: 'Late evening text. This feels vulnerable and raw.',
    options: [
      {
        text: "I'm stressed too, you know.",
        landing: "This lands as invalidation. In their most vulnerable moment, you made it about yourself.",
        type: 'disconnecting',
      },
      {
        text: "You're right — I haven't been paying enough attention. Tell me more.",
        landing: "This lands as deep connection. You validated their experience AND opened the door wider.",
        type: 'connecting',
      },
      {
        text: "What do you want me to do about it?",
        landing: "This lands as dismissive problem-solving. They wanted to be seen, not fixed.",
        type: 'neutral',
      },
    ],
  },
];

type Phase = 'intro' | 'game' | 'results' | 'done';

interface RoundChoice {
  scenarioId: string;
  chosenText: string;
  type: 'connecting' | 'neutral' | 'disconnecting';
}

// ─── Component ───────────────────────────────────────────

interface L1ReactionTestProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L1ReactionTest({ content, onComplete }: L1ReactionTestProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [roundIndex, setRoundIndex] = useState(0);
  const [choices, setChoices] = useState<RoundChoice[]>([]);
  const [showLanding, setShowLanding] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ResponseOption | null>(null);

  // Animations
  const introFade = useRef(new Animated.Value(0)).current;
  const messageSlide = useRef(new Animated.Value(-50)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const optionsFade = useRef(new Animated.Value(0)).current;
  const landingFade = useRef(new Animated.Value(0)).current;
  const sendAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'intro') {
      Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [phase]);

  const animateNewMessage = useCallback(() => {
    messageSlide.setValue(-50);
    messageOpacity.setValue(0);
    optionsFade.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(messageSlide, { toValue: 0, duration: MC7_TIMING.messageSlide, useNativeDriver: true }),
        Animated.timing(messageOpacity, { toValue: 1, duration: MC7_TIMING.messageSlide, useNativeDriver: true }),
      ]),
      Animated.delay(300),
      Animated.timing(optionsFade, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [messageSlide, messageOpacity, optionsFade]);

  const animateSend = useCallback(() => {
    sendAnim.setValue(0);
    landingFade.setValue(0);

    Animated.sequence([
      Animated.timing(sendAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(MC7_TIMING.typingDots),
      Animated.timing(landingFade, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [sendAnim, landingFade]);

  const startGame = useCallback(() => {
    haptics.tap();
    setPhase('game');
    setTimeout(() => animateNewMessage(), 100);
  }, [haptics, animateNewMessage]);

  const handleChooseOption = useCallback((option: ResponseOption) => {
    haptics.tap();
    setSelectedOption(option);

    const choice: RoundChoice = {
      scenarioId: SCENARIOS[roundIndex].id,
      chosenText: option.text,
      type: option.type,
    };
    setChoices(prev => [...prev, choice]);
    setShowLanding(true);
    animateSend();
  }, [roundIndex, haptics, animateSend]);

  const advanceRound = useCallback(() => {
    haptics.tap();
    setShowLanding(false);
    setSelectedOption(null);
    landingFade.setValue(0);
    sendAnim.setValue(0);

    const next = roundIndex + 1;
    if (next >= SCENARIOS.length) {
      setPhase('results');
    } else {
      setRoundIndex(next);
      setTimeout(() => animateNewMessage(), 100);
    }
  }, [roundIndex, haptics, animateNewMessage, landingFade, sendAnim]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const connectingCount = choices.filter(c => c.type === 'connecting').length;
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Reaction Test',
      response: JSON.stringify({
        connectingCount,
        total: SCENARIOS.length,
        choices: choices.map(c => ({ scenarioId: c.scenarioId, text: c.chosenText, type: c.type })),
      }),
      type: 'game',
    }];
    onComplete(responses);
  }, [choices, onComplete, haptics]);

  // ─── Render Intro ──────────────────────────────────────

  const renderIntro = () => {
    const paragraphs = content.readContent
      ? content.readContent.split('\n').filter((p: string) => p.trim().length > 0)
      : [];

    return (
      <Animated.View style={[styles.phaseContainer, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}>
            <PhoneIcon size={28} color={MC7_PALETTE.phoneBlue} />
            <Text style={styles.introTitle}>Reaction Test</Text>
          </View>
          {paragraphs.length > 0 ? (
            paragraphs.map((p: string, i: number) => (
              <Text key={i} style={styles.introParagraph}>{p.trim()}</Text>
            ))
          ) : (
            <Text style={styles.introParagraph}>
              How you respond to your partner's texts shapes your relationship more than you think.
              Every text is an opportunity to connect or disconnect. In this game, you'll see real
              messages from a partner and choose how to reply. Then you'll discover how each
              response actually FEELS on the other end.
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // ─── Render Phone UI ───────────────────────────────────

  const renderGame = () => {
    const scenario = SCENARIOS[roundIndex];

    return (
      <View style={styles.phaseContainer}>
        {/* Round indicator */}
        <View style={styles.roundBar}>
          {SCENARIOS.map((_, i) => (
            <View key={i} style={[
              styles.roundDot,
              i < roundIndex && styles.roundDotDone,
              i === roundIndex && styles.roundDotCurrent,
            ]} />
          ))}
        </View>

        {/* Phone frame */}
        <View style={styles.phoneFrame}>
          <View style={styles.phoneHeader}>
            <Text style={styles.phoneHeaderText}>Partner</Text>
          </View>

          <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
            {/* Context */}
            <Text style={styles.contextText}>{scenario.context}</Text>

            {/* Partner message */}
            <Animated.View style={[
              styles.partnerBubble,
              { opacity: messageOpacity, transform: [{ translateY: messageSlide }] },
            ]}>
              <Text style={styles.partnerBubbleText}>{scenario.partnerMessage}</Text>
            </Animated.View>

            {/* User's sent message */}
            {showLanding && selectedOption && (
              <Animated.View style={[
                styles.userBubble,
                { opacity: sendAnim },
              ]}>
                <Text style={styles.userBubbleText}>{selectedOption.text}</Text>
              </Animated.View>
            )}

            {/* Typing indicator */}
            {showLanding && selectedOption && (
              <Animated.View style={[styles.typingIndicator, { opacity: Animated.subtract(sendAnim, landingFade) }]}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, { opacity: 0.6 }]} />
                <View style={[styles.typingDot, { opacity: 0.3 }]} />
              </Animated.View>
            )}

            {/* Landing reveal */}
            {showLanding && selectedOption && (
              <Animated.View style={[styles.landingCard, { opacity: landingFade }]}>
                <View style={[
                  styles.landingBadge,
                  selectedOption.type === 'connecting' && { backgroundColor: MC7_PALETTE.connecting },
                  selectedOption.type === 'neutral' && { backgroundColor: MC7_PALETTE.neutral },
                  selectedOption.type === 'disconnecting' && { backgroundColor: MC7_PALETTE.disconnecting },
                ]}>
                  <Text style={styles.landingBadgeText}>
                    {selectedOption.type === 'connecting' ? 'Connecting' :
                     selectedOption.type === 'neutral' ? 'Neutral' : 'Disconnecting'}
                  </Text>
                </View>
                <Text style={styles.landingText}>{selectedOption.landing}</Text>
              </Animated.View>
            )}
          </ScrollView>
        </View>

        {/* Options or Next button */}
        {!showLanding ? (
          <Animated.View style={[styles.optionsArea, { opacity: optionsFade }]}>
            {scenario.options.map((option, i) => (
              <TouchableOpacity
                key={i}
                style={styles.optionBubble}
                onPress={() => handleChooseOption(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionBubbleText}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        ) : (
          <Animated.View style={{ opacity: landingFade }}>
            <TouchableOpacity style={styles.nextButton} onPress={advanceRound} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>
                {roundIndex + 1 < SCENARIOS.length ? 'Next Message' : 'See Results'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

  // ─── Render Results ────────────────────────────────────

  const renderResults = () => {
    const connectingCount = choices.filter(c => c.type === 'connecting').length;

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <ChatBubbleIcon size={32} color={MC7_PALETTE.phoneBlue} />
          <Text style={styles.resultsTitle}>Your Text Patterns</Text>
        </View>

        <Text style={styles.resultsSummary}>
          You chose {connectingCount} connecting response{connectingCount !== 1 ? 's' : ''} out of {SCENARIOS.length} rounds.
        </Text>

        <View style={styles.resultsGrid}>
          {SCENARIOS.map((scenario, i) => {
            const choice = choices[i];
            if (!choice) return null;
            return (
              <View key={scenario.id} style={styles.resultCard}>
                <Text style={styles.resultPartnerText} numberOfLines={2}>"{scenario.partnerMessage}"</Text>
                <Text style={styles.resultYourText} numberOfLines={2}>You: "{choice.chosenText}"</Text>
                <View style={[
                  styles.resultBadge,
                  choice.type === 'connecting' && { backgroundColor: MC7_PALETTE.connecting + '20' },
                  choice.type === 'neutral' && { backgroundColor: MC7_PALETTE.neutral + '20' },
                  choice.type === 'disconnecting' && { backgroundColor: MC7_PALETTE.disconnecting + '20' },
                ]}>
                  <Text style={[
                    styles.resultBadgeText,
                    choice.type === 'connecting' && { color: MC7_PALETTE.connecting },
                    choice.type === 'neutral' && { color: MC7_PALETTE.neutral },
                    choice.type === 'disconnecting' && { color: MC7_PALETTE.disconnecting },
                  ]}>{choice.type}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.resultsInsight}>
          Every text is a micro-moment of connection or disconnection. The good news?
          You can always choose differently next time. Awareness is the first step.
        </Text>

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
      {(phase === 'results' || phase === 'done') && renderResults()}
    </View>
  );
}

export default L1ReactionTest;

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phaseContainer: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.lg },

  // Intro
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  introParagraph: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },

  // Round bar
  roundBar: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  roundDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.borderLight },
  roundDotDone: { backgroundColor: MC7_PALETTE.phoneBlue },
  roundDotCurrent: { backgroundColor: MC7_PALETTE.phoneBlue, width: 14, height: 14, borderRadius: 7 },

  // Phone frame
  phoneFrame: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: MC7_PALETTE.cardBorder, overflow: 'hidden', marginBottom: Spacing.md, ...Shadows.card },
  phoneHeader: { backgroundColor: MC7_PALETTE.phoneDark, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, alignItems: 'center' },
  phoneHeaderText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: '#FFFFFF', fontWeight: '600' },
  chatArea: { flex: 1 },
  chatContent: { padding: Spacing.md, gap: Spacing.sm },

  // Context
  contextText: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.sm, fontStyle: 'italic' },

  // Bubbles
  partnerBubble: { alignSelf: 'flex-start', backgroundColor: MC7_PALETTE.partnerBubble, borderRadius: 18, borderTopLeftRadius: 4, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, maxWidth: '80%' },
  partnerBubbleText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 22 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: MC7_PALETTE.userBubble, borderRadius: 18, borderTopRightRadius: 4, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, maxWidth: '80%' },
  userBubbleText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 22 },

  // Typing indicator
  typingIndicator: { flexDirection: 'row', alignSelf: 'flex-start', gap: 4, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: MC7_PALETTE.typingDots },

  // Landing card
  landingCard: { backgroundColor: MC7_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, marginTop: Spacing.sm, borderWidth: 1, borderColor: MC7_PALETTE.cardBorder },
  landingBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 99, marginBottom: Spacing.xs },
  landingBadgeText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: '#FFFFFF', fontWeight: '600' },
  landingText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },

  // Options
  optionsArea: { gap: Spacing.sm, paddingBottom: Spacing.lg },
  optionBubble: { backgroundColor: MC7_PALETTE.phoneBlueLight, borderRadius: 18, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: MC7_PALETTE.phoneBlue + '40' },
  optionBubbleText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: MC7_PALETTE.phoneBlueDark, lineHeight: 22 },

  // Next
  nextButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.lg, ...Shadows.subtle },
  nextButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },

  // Results
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  resultsTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  resultsSummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', marginBottom: Spacing.lg, lineHeight: 24 },
  resultsGrid: { gap: Spacing.sm, marginBottom: Spacing.lg },
  resultCard: { backgroundColor: MC7_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC7_PALETTE.cardBorder, gap: 4 },
  resultPartnerText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.textSecondary, fontStyle: 'italic' },
  resultYourText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '500' },
  resultBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, marginTop: 2 },
  resultBadgeText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, fontWeight: '600', textTransform: 'capitalize' },
  resultsInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, textAlign: 'center', fontStyle: 'italic', marginBottom: Spacing.lg },
  continueButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
