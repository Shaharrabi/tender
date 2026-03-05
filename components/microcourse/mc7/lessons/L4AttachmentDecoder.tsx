/**
 * L4AttachmentDecoder — MC7 Lesson 4
 *
 * Swipeable gallery of 5 text exchanges. Each shows a brief text conversation.
 * User taps "What's really happening here?" button. Reveal card shows the
 * attachment pattern underneath. User sorts into "My pattern" / "My partner's
 * pattern" / "Neither."
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
import { EyeIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

// ─── Data ────────────────────────────────────────────────

interface TextExchange {
  id: string;
  messages: { sender: 'A' | 'B'; text: string }[];
  patternName: string;
  patternType: 'anxious-reaching' | 'avoidant-withdrawal' | 'secure-checkin';
  decode: string;
}

const EXCHANGES: TextExchange[] = [
  {
    id: 'ex-1',
    messages: [
      { sender: 'A', text: "Hey, are you okay? You've been quiet all day." },
      { sender: 'B', text: "I'm fine." },
      { sender: 'A', text: "Are you sure? Did I do something wrong?" },
      { sender: 'A', text: "Please just tell me what's going on." },
    ],
    patternName: 'Anxious Reaching',
    patternType: 'anxious-reaching',
    decode: "Person A is seeking reassurance through repeated questions. The silence from B triggers anxiety, leading to pursuit. This is the anxious attachment pattern in action — the need to KNOW they're still connected.",
  },
  {
    id: 'ex-2',
    messages: [
      { sender: 'A', text: "Can we talk about what happened last night?" },
      { sender: 'B', text: "There's nothing to talk about." },
      { sender: 'A', text: "I feel like there is. I want to understand." },
      { sender: 'B', text: "I need space right now." },
    ],
    patternName: 'Avoidant Withdrawal',
    patternType: 'avoidant-withdrawal',
    decode: "Person B is pulling away when emotions get close. 'I need space' can be a legitimate request, but here it's used to avoid emotional engagement. This is the avoidant pattern — distance feels safer than vulnerability.",
  },
  {
    id: 'ex-3',
    messages: [
      { sender: 'A', text: "I noticed you seemed stressed at dinner. Want to talk?" },
      { sender: 'B', text: "Yeah, work has been rough. Thanks for noticing." },
      { sender: 'A', text: "I'm here whenever you want to vent. No pressure." },
    ],
    patternName: 'Secure Check-in',
    patternType: 'secure-checkin',
    decode: "Person A notices and names what they see, then offers support without demanding it. Person B receives it openly. This is secure relating — observing, offering, no pressure.",
  },
  {
    id: 'ex-4',
    messages: [
      { sender: 'A', text: "I called you three times. Why didn't you pick up?" },
      { sender: 'B', text: "I was in a meeting. Relax." },
      { sender: 'A', text: "You could have texted me back at least." },
      { sender: 'A', text: "I just worry when I can't reach you." },
    ],
    patternName: 'Anxious Reaching',
    patternType: 'anxious-reaching',
    decode: "The inability to reach their partner triggers a cascade of anxiety. Multiple calls, checking behavior, and the final reveal of the underlying worry. The anxious pattern turns reasonable gaps into emergencies.",
  },
  {
    id: 'ex-5',
    messages: [
      { sender: 'A', text: "I had a really hard day. Can we just hang out tonight?" },
      { sender: 'B', text: "Sure, but I was going to work out." },
      { sender: 'A', text: "Never mind, it's not important." },
      { sender: 'B', text: "No wait, let me reschedule. Tell me about your day." },
    ],
    patternName: 'Secure Check-in',
    patternType: 'secure-checkin',
    decode: "Person A starts with avoidant withdrawal ('never mind') but Person B catches it and turns toward. The key moment is B's choice to prioritize connection over routine. This is how secure partners repair in real-time.",
  },
];

type Categorization = 'mine' | 'partner' | 'neither';

type Phase = 'intro' | 'game' | 'results';

interface DecodedExchange {
  exchangeId: string;
  categorization: Categorization;
}

// ─── Component ───────────────────────────────────────────

interface L4AttachmentDecoderProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export default function L4AttachmentDecoder({ content, onComplete }: L4AttachmentDecoderProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDecode, setShowDecode] = useState(false);
  const [showCategorize, setShowCategorize] = useState(false);
  const [decoded, setDecoded] = useState<DecodedExchange[]>([]);

  const introFade = useRef(new Animated.Value(0)).current;
  const decodeFade = useRef(new Animated.Value(0)).current;
  const catFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'intro') {
      Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [phase]);

  const startGame = useCallback(() => {
    haptics.tap();
    setPhase('game');
  }, [haptics]);

  const handleDecode = useCallback(() => {
    haptics.playExerciseReveal();
    setShowDecode(true);
    decodeFade.setValue(0);
    Animated.timing(decodeFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [haptics, decodeFade]);

  const handleShowCategorize = useCallback(() => {
    haptics.tap();
    setShowCategorize(true);
    catFade.setValue(0);
    Animated.timing(catFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [haptics, catFade]);

  const handleCategorize = useCallback((cat: Categorization) => {
    haptics.tap();
    setDecoded(prev => [...prev, { exchangeId: EXCHANGES[currentIndex].id, categorization: cat }]);

    const next = currentIndex + 1;
    if (next >= EXCHANGES.length) {
      setPhase('results');
    } else {
      setCurrentIndex(next);
      setShowDecode(false);
      setShowCategorize(false);
    }
  }, [currentIndex, haptics]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Attachment Decoder',
      response: JSON.stringify({
        exchanges: decoded.map(d => ({
          exchangeId: d.exchangeId,
          pattern: EXCHANGES.find(e => e.id === d.exchangeId)?.patternType,
          categorization: d.categorization,
        })),
      }),
      type: 'game',
    }];
    onComplete(responses);
  }, [decoded, onComplete, haptics]);

  // ─── Render ────────────────────────────────────────────

  const renderIntro = () => {
    const paragraphs = content.readContent
      ? content.readContent.split('\n').filter((p: string) => p.trim().length > 0)
      : [];

    return (
      <Animated.View style={[styles.phaseContainer, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}>
            <EyeIcon size={28} color={MC7_PALETTE.phoneBlue} />
            <Text style={styles.introTitle}>Attachment Decoder</Text>
          </View>
          {paragraphs.length > 0 ? (
            paragraphs.map((p: string, i: number) => (
              <Text key={i} style={styles.introParagraph}>{p.trim()}</Text>
            ))
          ) : (
            <Text style={styles.introParagraph}>
              Every text conversation carries patterns beneath the surface. In this exercise,
              you'll read real text exchanges and decode the attachment pattern driving them.
              Then you'll reflect on whether these patterns show up in your own relationship.
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
    const exchange = EXCHANGES[currentIndex];

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: Spacing.lg }]} showsVerticalScrollIndicator={false}>
        <View style={styles.progressRow}>
          {EXCHANGES.map((_, i) => (
            <View key={i} style={[styles.dot, i < currentIndex && styles.dotDone, i === currentIndex && styles.dotCurrent]} />
          ))}
        </View>

        {/* Conversation */}
        <View style={styles.conversationCard}>
          {exchange.messages.map((msg, i) => (
            <View key={i} style={[styles.bubble, msg.sender === 'A' ? styles.bubbleA : styles.bubbleB]}>
              <Text style={styles.bubbleText}>{msg.text}</Text>
            </View>
          ))}
        </View>

        {!showDecode && (
          <TouchableOpacity style={styles.decodeButton} onPress={handleDecode} activeOpacity={0.8}>
            <EyeIcon size={18} color="#FFFFFF" />
            <Text style={styles.decodeButtonText}>What's really happening here?</Text>
          </TouchableOpacity>
        )}

        {showDecode && (
          <Animated.View style={[styles.decodeCard, { opacity: decodeFade }]}>
            <View style={[styles.patternBadge,
              exchange.patternType === 'anxious-reaching' && { backgroundColor: MC7_PALETTE.neutral },
              exchange.patternType === 'avoidant-withdrawal' && { backgroundColor: MC7_PALETTE.disconnecting },
              exchange.patternType === 'secure-checkin' && { backgroundColor: MC7_PALETTE.connecting },
            ]}>
              <Text style={styles.patternBadgeText}>{exchange.patternName}</Text>
            </View>
            <Text style={styles.decodeText}>{exchange.decode}</Text>

            {!showCategorize && (
              <TouchableOpacity style={styles.categorizePromptButton} onPress={handleShowCategorize} activeOpacity={0.8}>
                <Text style={styles.categorizePromptText}>Who does this remind you of?</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {showCategorize && (
          <Animated.View style={[styles.categorizeRow, { opacity: catFade }]}>
            {([
              { key: 'mine' as Categorization, label: 'My Pattern' },
              { key: 'partner' as Categorization, label: "Partner's" },
              { key: 'neither' as Categorization, label: 'Neither' },
            ]).map(opt => (
              <TouchableOpacity key={opt.key} style={styles.catButton} onPress={() => handleCategorize(opt.key)} activeOpacity={0.7}>
                <Text style={styles.catButtonText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    );
  };

  const renderResults = () => {
    const mineCount = decoded.filter(d => d.categorization === 'mine').length;
    const partnerCount = decoded.filter(d => d.categorization === 'partner').length;

    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <SparkleIcon size={32} color={MC7_PALETTE.phoneBlue} />
          <Text style={styles.resultsTitle}>Your Patterns Decoded</Text>
        </View>

        <Text style={styles.resultsSummary}>
          You recognized {mineCount} pattern{mineCount !== 1 ? 's' : ''} as your own
          and {partnerCount} as your partner's.
        </Text>

        <View style={styles.resultsGrid}>
          {EXCHANGES.map((ex, i) => {
            const d = decoded[i];
            return (
              <View key={ex.id} style={styles.resultItem}>
                <View style={[styles.resultDot,
                  ex.patternType === 'anxious-reaching' && { backgroundColor: MC7_PALETTE.neutral },
                  ex.patternType === 'avoidant-withdrawal' && { backgroundColor: MC7_PALETTE.disconnecting },
                  ex.patternType === 'secure-checkin' && { backgroundColor: MC7_PALETTE.connecting },
                ]} />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultPattern}>{ex.patternName}</Text>
                  <Text style={styles.resultCat}>
                    {d?.categorization === 'mine' ? 'Your pattern' : d?.categorization === 'partner' ? "Partner's pattern" : 'Neither'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.resultsInsight}>
          Recognizing these patterns in your texts is the first step to changing them.
          When you see the pattern, you can choose a different response.
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

  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingBottom: Spacing.md },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.borderLight },
  dotDone: { backgroundColor: MC7_PALETTE.phoneBlue },
  dotCurrent: { backgroundColor: MC7_PALETTE.phoneBlue, width: 14, height: 14, borderRadius: 7 },

  conversationCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: Spacing.lg, ...Shadows.card, borderWidth: 1, borderColor: MC7_PALETTE.cardBorder, gap: Spacing.sm },
  bubble: { borderRadius: 18, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, maxWidth: '85%' },
  bubbleA: { alignSelf: 'flex-start', backgroundColor: MC7_PALETTE.partnerBubble, borderTopLeftRadius: 4 },
  bubbleB: { alignSelf: 'flex-end', backgroundColor: MC7_PALETTE.userBubble, borderTopRightRadius: 4 },
  bubbleText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },

  decodeButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, ...Shadows.subtle, marginBottom: Spacing.md },
  decodeButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },

  decodeCard: { backgroundColor: MC7_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.lg, ...Shadows.subtle, gap: Spacing.md, marginBottom: Spacing.md },
  patternBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 99 },
  patternBadgeText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: '#FFFFFF', fontWeight: '600' },
  decodeText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },

  categorizePromptButton: { backgroundColor: MC7_PALETTE.phoneBlueLight, borderRadius: BorderRadius.lg, paddingVertical: Spacing.sm, alignItems: 'center' },
  categorizePromptText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: MC7_PALETTE.phoneBlueDark, fontWeight: '600' },

  categorizeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  catButton: { flex: 1, backgroundColor: '#FFFFFF', paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', borderWidth: 1.5, borderColor: MC7_PALETTE.phoneBlue + '40' },
  catButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: MC7_PALETTE.phoneBlueDark, fontWeight: '600' },

  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  resultsTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  resultsSummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg },
  resultsGrid: { gap: Spacing.sm, marginBottom: Spacing.lg },
  resultItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: MC7_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC7_PALETTE.cardBorder },
  resultDot: { width: 12, height: 12, borderRadius: 6 },
  resultInfo: { flex: 1 },
  resultPattern: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '600' },
  resultCat: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.textSecondary },
  resultsInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, fontStyle: 'italic', marginBottom: Spacing.lg },

  continueButton: { backgroundColor: MC7_PALETTE.phoneBlue, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
