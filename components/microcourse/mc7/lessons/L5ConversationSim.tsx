/**
 * L5ConversationSim — MC7 Lesson 5
 *
 * Live text conversation with a simulated partner. User chooses from 3 response
 * options at each turn (5 turns total). Conversation branches based on choices.
 * After completion, conversation is replayed with connection annotations.
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
import { FlagIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

// ─── Conversation Tree ──────────────────────────────────

interface Option {
  text: string;
  type: 'connecting' | 'neutral' | 'disconnecting';
  annotation: string;
  partnerReply: string;
}

interface ConversationTurn {
  partnerMessage: string;
  options: Option[];
}

const CONVERSATION: ConversationTurn[] = [
  {
    partnerMessage: "Hey, I wanted to talk to you about something that's been on my mind.",
    options: [
      {
        text: "Of course, I'm all ears. What's going on?",
        type: 'connecting',
        annotation: "Opening the door wide. Your partner feels safe to share.",
        partnerReply: "I've been feeling like we haven't had real quality time in a while.",
      },
      {
        text: "Can it wait? I'm kind of in the middle of something.",
        type: 'disconnecting',
        annotation: "Door closed. Your partner's courage to bring something up just got punished.",
        partnerReply: "Oh... okay. I guess it's not that important anyway.",
      },
      {
        text: "Sure, what's up?",
        type: 'neutral',
        annotation: "Door's open, but barely. Minimal effort, minimal invitation.",
        partnerReply: "Well, I've been feeling like we haven't really connected lately.",
      },
    ],
  },
  {
    partnerMessage: "(continues from above)",
    options: [
      {
        text: "I've noticed that too. I miss us. What do you think we need?",
        type: 'connecting',
        annotation: "Validating their experience AND inviting collaboration. This is repair gold.",
        partnerReply: "Maybe we could set aside one evening a week? Just for us?",
      },
      {
        text: "We see each other every day. What more do you want?",
        type: 'disconnecting',
        annotation: "Invalidating their need. Proximity is not the same as connection.",
        partnerReply: "Seeing each other isn't the same as being present with each other.",
      },
      {
        text: "Yeah, we've been busy. Things will calm down soon.",
        type: 'neutral',
        annotation: "Acknowledging but dismissing. 'Soon' is a promise with no commitment.",
        partnerReply: "I feel like we always say that though...",
      },
    ],
  },
  {
    partnerMessage: "(continues from above)",
    options: [
      {
        text: "You're right. Let's actually put something on the calendar right now.",
        type: 'connecting',
        annotation: "Words + action = trust. Moving from talk to commitment shows you mean it.",
        partnerReply: "Really? That would mean so much to me. How about Thursday evenings?",
      },
      {
        text: "I don't know, my schedule is pretty packed.",
        type: 'disconnecting',
        annotation: "Prioritizing everything else over the relationship. Your partner hears: 'You're not worth making time for.'",
        partnerReply: "Right. I understand. Forget I said anything.",
      },
      {
        text: "Okay, let me check my schedule and get back to you.",
        type: 'neutral',
        annotation: "Reasonable, but non-committal. The emotional momentum dies here.",
        partnerReply: "Okay. Just... please actually follow up this time?",
      },
    ],
  },
  {
    partnerMessage: "(continues from above)",
    options: [
      {
        text: "I will. And I want you to know I care about this — about us.",
        type: 'connecting',
        annotation: "Naming the deeper value. You just told your partner: 'We matter to me.'",
        partnerReply: "That really means a lot to hear. Thank you for listening to me.",
      },
      {
        text: "Don't guilt trip me about it.",
        type: 'disconnecting',
        annotation: "Hearing a request as an attack. This shuts down vulnerability completely.",
        partnerReply: "I wasn't trying to guilt trip you... I was just asking for time together.",
      },
      {
        text: "I'll try my best.",
        type: 'neutral',
        annotation: "'Try' leaves an escape hatch. It hedges commitment without refusing it.",
        partnerReply: "I hope so. I really miss feeling close to you.",
      },
    ],
  },
  {
    partnerMessage: "(continues from above)",
    options: [
      {
        text: "I miss that too. Let's make it happen, starting this week.",
        type: 'connecting',
        annotation: "Full circle: vulnerability met with vulnerability. A complete repair moment.",
        partnerReply: "I love you. Thank you for hearing me.",
      },
      {
        text: "Okay okay, I get it. Can we drop it now?",
        type: 'disconnecting',
        annotation: "Shutting it down at the finish line. Your partner opened their heart and you closed the door.",
        partnerReply: "...Fine.",
      },
      {
        text: "Yeah, let's see how it goes.",
        type: 'neutral',
        annotation: "Still hedging. Still not fully showing up. Your partner senses the distance.",
        partnerReply: "Okay. I'm going to hold you to that.",
      },
    ],
  },
];

type Phase = 'intro' | 'game' | 'replay' | 'done';

interface ChatMessage {
  sender: 'partner' | 'user';
  text: string;
  type?: 'connecting' | 'neutral' | 'disconnecting';
  annotation?: string;
}

// ─── Component ───────────────────────────────────────────

interface L5ConversationSimProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export default function L5ConversationSim({ content, onComplete }: L5ConversationSimProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [turnIndex, setTurnIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  const introFade = useRef(new Animated.Value(0)).current;
  const typingFade = useRef(new Animated.Value(0)).current;
  const optionsFade = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (phase === 'intro') {
      Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [phase]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const startConversation = useCallback(() => {
    haptics.tap();
    setPhase('game');

    // Show first partner message with typing delay
    setShowTyping(true);
    Animated.timing(typingFade, { toValue: 1, duration: 200, useNativeDriver: true }).start();

    setTimeout(() => {
      setShowTyping(false);
      typingFade.setValue(0);
      setChatHistory([{ sender: 'partner', text: CONVERSATION[0].partnerMessage }]);
      setShowOptions(true);
      optionsFade.setValue(0);
      Animated.timing(optionsFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      scrollToBottom();
    }, MC7_TIMING.typingDots);
  }, [haptics, typingFade, optionsFade, scrollToBottom]);

  const handleChooseOption = useCallback((option: Option) => {
    haptics.tap();
    setShowOptions(false);

    // Add user message
    const userMsg: ChatMessage = { sender: 'user', text: option.text, type: option.type, annotation: option.annotation };
    setChatHistory(prev => [...prev, userMsg]);
    scrollToBottom();

    // Show typing then partner reply
    setTimeout(() => {
      setShowTyping(true);
      Animated.timing(typingFade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      scrollToBottom();
    }, 300);

    setTimeout(() => {
      setShowTyping(false);
      typingFade.setValue(0);

      const partnerMsg: ChatMessage = { sender: 'partner', text: option.partnerReply };
      setChatHistory(prev => [...prev, partnerMsg]);
      scrollToBottom();

      const nextTurn = turnIndex + 1;
      if (nextTurn >= CONVERSATION.length) {
        // Conversation over
        setTimeout(() => setPhase('replay'), 500);
      } else {
        setTurnIndex(nextTurn);
        // Show next partner message after brief delay
        setTimeout(() => {
          if (CONVERSATION[nextTurn].partnerMessage !== '(continues from above)') {
            setChatHistory(prev => [...prev, { sender: 'partner', text: CONVERSATION[nextTurn].partnerMessage }]);
          }
          setShowOptions(true);
          optionsFade.setValue(0);
          Animated.timing(optionsFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
          scrollToBottom();
        }, 600);
      }
    }, MC7_TIMING.typingDots);
  }, [turnIndex, haptics, typingFade, optionsFade, scrollToBottom]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const connectingCount = chatHistory.filter(m => m.type === 'connecting').length;
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Conversation Simulator',
      response: JSON.stringify({
        connectingCount,
        totalTurns: CONVERSATION.length,
        choices: chatHistory.filter(m => m.sender === 'user').map(m => ({ text: m.text, type: m.type })),
      }),
      type: 'game',
    }];
    onComplete(responses);
  }, [chatHistory, onComplete, haptics]);

  // ─── Renders ───────────────────────────────────────────

  const renderIntro = () => {
    const paragraphs = content.readContent
      ? content.readContent.split('\n').filter((p: string) => p.trim().length > 0)
      : [];

    return (
      <Animated.View style={[styles.phaseContainer, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}>
            <FlagIcon size={28} color={MC7_PALETTE.phoneBlue} />
            <Text style={styles.introTitle}>Conversation Sim</Text>
          </View>
          {paragraphs.length > 0 ? (
            paragraphs.map((p: string, i: number) => (
              <Text key={i} style={styles.introParagraph}>{p.trim()}</Text>
            ))
          ) : (
            <Text style={styles.introParagraph}>
              This is a live text conversation. Your partner wants to talk about
              something important. You'll have 5 turns to respond. Each choice
              changes the direction of the conversation. Afterward, we'll replay
              the whole exchange with connection annotations.
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startButton} onPress={startConversation} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Conversation</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderGame = () => {
    const turn = CONVERSATION[turnIndex];

    return (
      <View style={styles.phaseContainer}>
        <View style={styles.phoneHeader}>
          <Text style={styles.phoneHeaderText}>Partner</Text>
          <Text style={styles.turnCounter}>Turn {Math.min(turnIndex + 1, CONVERSATION.length)}/{CONVERSATION.length}</Text>
        </View>

        <ScrollView ref={scrollRef} style={styles.chatScroll} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
          {chatHistory.map((msg, i) => (
            <View key={i} style={[styles.chatBubble, msg.sender === 'partner' ? styles.chatBubblePartner : styles.chatBubbleUser]}>
              <Text style={[styles.chatBubbleText, msg.sender === 'user' && styles.chatBubbleTextUser]}>{msg.text}</Text>
            </View>
          ))}

          {showTyping && (
            <Animated.View style={[styles.typingRow, { opacity: typingFade }]}>
              <View style={styles.typingDot} />
              <View style={[styles.typingDot, { opacity: 0.6 }]} />
              <View style={[styles.typingDot, { opacity: 0.3 }]} />
            </Animated.View>
          )}
        </ScrollView>

        {showOptions && (
          <Animated.View style={[styles.optionsArea, { opacity: optionsFade }]}>
            {turn?.options.map((opt, i) => (
              <TouchableOpacity key={i} style={styles.optionBubble} onPress={() => handleChooseOption(opt)} activeOpacity={0.7}>
                <Text style={styles.optionText}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>
    );
  };

  const renderReplay = () => {
    const connectingCount = chatHistory.filter(m => m.type === 'connecting').length;

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.replayHeader}>
          <SparkleIcon size={32} color={MC7_PALETTE.phoneBlue} />
          <Text style={styles.replayTitle}>Conversation Replay</Text>
        </View>

        <Text style={styles.replaySummary}>
          You made {connectingCount} connecting choice{connectingCount !== 1 ? 's' : ''} out of {CONVERSATION.length} turns.
        </Text>

        <View style={styles.replayChat}>
          {chatHistory.map((msg, i) => (
            <View key={i}>
              <View style={[styles.replayBubble, msg.sender === 'partner' ? styles.replayBubblePartner : styles.replayBubbleUser]}>
                <Text style={styles.replayBubbleText}>{msg.text}</Text>
              </View>
              {msg.annotation && (
                <View style={[styles.annotationBar,
                  msg.type === 'connecting' && { borderLeftColor: MC7_PALETTE.connecting },
                  msg.type === 'neutral' && { borderLeftColor: MC7_PALETTE.neutral },
                  msg.type === 'disconnecting' && { borderLeftColor: MC7_PALETTE.disconnecting },
                ]}>
                  <Text style={styles.annotationText}>{msg.annotation}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.commitmentCard}>
          <Text style={styles.commitmentTitle}>Your Texting Commitment</Text>
          <Text style={styles.commitmentText}>
            One small shift in how you text can transform your daily connection.
            Which pattern from this conversation do you want to practice this week?
          </Text>
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
      {(phase === 'replay' || phase === 'done') && renderReplay()}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phaseContainer: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.scrollPadBottom, paddingHorizontal: Spacing.lg },

  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  introParagraph: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginHorizontal: Spacing.lg, marginBottom: Spacing.xl, ...Shadows.subtle },
  startButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },

  phoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: MC7_PALETTE.phoneDark, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
  phoneHeaderText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: '#FFFFFF', fontWeight: '600' },
  turnCounter: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: '#FFFFFF80' },

  chatScroll: { flex: 1 },
  chatContent: { padding: Spacing.md, gap: Spacing.sm },
  chatBubble: { borderRadius: 18, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, maxWidth: '85%' },
  chatBubblePartner: { alignSelf: 'flex-start', backgroundColor: MC7_PALETTE.partnerBubble, borderTopLeftRadius: 4 },
  chatBubbleUser: { alignSelf: 'flex-end', backgroundColor: MC7_PALETTE.userBubble, borderTopRightRadius: 4 },
  chatBubbleText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 22 },
  chatBubbleTextUser: { color: Colors.text },

  typingRow: { flexDirection: 'row', alignSelf: 'flex-start', gap: 4, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: MC7_PALETTE.typingDots },

  optionsArea: { gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.borderLight, backgroundColor: Colors.surfaceElevated },
  optionBubble: { backgroundColor: MC7_PALETTE.phoneBlueLight, borderRadius: 18, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: MC7_PALETTE.phoneBlue + '30' },
  optionText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: MC7_PALETTE.phoneBlueDark, lineHeight: 22 },

  replayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  replayTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  replaySummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg },

  replayChat: { gap: Spacing.sm, marginBottom: Spacing.lg },
  replayBubble: { borderRadius: 18, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, maxWidth: '85%' },
  replayBubblePartner: { alignSelf: 'flex-start', backgroundColor: MC7_PALETTE.partnerBubble, borderTopLeftRadius: 4 },
  replayBubbleUser: { alignSelf: 'flex-end', backgroundColor: MC7_PALETTE.userBubble, borderTopRightRadius: 4 },
  replayBubbleText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },

  annotationBar: { marginLeft: Spacing.xl, marginTop: 2, marginBottom: Spacing.sm, borderLeftWidth: 3, paddingLeft: Spacing.sm, paddingVertical: 4 },
  annotationText: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.textSecondary, fontStyle: 'italic', lineHeight: 18 },

  commitmentCard: { backgroundColor: MC7_PALETTE.phoneBlueLight + '40', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 1, borderColor: MC7_PALETTE.phoneBlue + '20', gap: Spacing.sm },
  commitmentTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: MC7_PALETTE.phoneBlueDark, fontWeight: '600' },
  commitmentText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },

  continueButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
