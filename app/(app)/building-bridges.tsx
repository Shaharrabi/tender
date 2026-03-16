/**
 * Building Bridges — Card Game Screen
 *
 * A flippable card game for relationship connection.
 * Modes: Draw a Card, Browse by Category, Open Heart, My Progress.
 * Cards flip with 3D animation, users reflect and earn XP.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
import {
  Colors,
  Spacing,
  BorderRadius,
  FontFamilies,
  FontSizes,
  Typography,
  Shadows,
} from '@/constants/theme';
import {
  ArrowLeftIcon,
  HeartIcon,
  SparkleIcon,
  RefreshIcon,
  CheckmarkIcon,
  ChatBubbleIcon,
  BookOpenIcon,
  StarIcon,
} from '@/assets/graphics/icons';
import QuickLinksBar from '@/components/QuickLinksBar';
import { useScrollHideBar } from '@/hooks/useScrollHideBar';
import FlippableCard from '@/components/card-game/FlippableCard';
import CardFront from '@/components/card-game/CardFront';
import CardBack from '@/components/card-game/CardBack';
import {
  ALL_CARDS,
  CONNECTION_BUILDER_CARDS,
  OPEN_HEART_CARDS,
  getRandomCard,
  getRandomCardByCategory,
  getCardsByCategory,
  type GameCard,
} from '@/constants/card-game/cards';
import {
  CATEGORIES,
  OPEN_HEART_DECK,
  type CardCategory,
} from '@/constants/card-game/categories';
import {
  saveCardCompletion,
  getCompletionStats,
  type CompletionStats,
} from '@/services/building-bridges';

// ─── Types ──────────────────────────────────────────────

type Phase = 'home' | 'playing' | 'reflecting' | 'complete';
type HomeTab = 'draw' | 'browse' | 'open-heart' | 'progress';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(300, SCREEN_WIDTH - 48);
const CARD_HEIGHT = Math.round(CARD_WIDTH * 1.47);

// ─── Component ──────────────────────────────────────────

export default function BuildingBridgesScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { awardXP: awardGamificationXP } = useGamification();
  const userId = session?.user?.id;
  const { handleScroll, animatedStyle: quickLinksAnimStyle, BAR_HEIGHT } = useScrollHideBar();

  // State
  const [phase, setPhase] = useState<Phase>('home');
  const [homeTab, setHomeTab] = useState<HomeTab>('draw');
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reflection, setReflection] = useState('');
  const [xpEarned, setXpEarned] = useState(0);
  const [sessionCards, setSessionCards] = useState<string[]>([]);
  const [connectionTokens, setConnectionTokens] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | null>(null);
  const [stats, setStats] = useState<CompletionStats | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load stats
  useEffect(() => {
    if (userId) {
      getCompletionStats(userId).then(setStats).catch(() => {});
    }
  }, [userId, phase]);

  // Timer logic
  const startTimer = useCallback((duration: number) => {
    setTimerSeconds(duration);
    setTimerActive(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ─── Actions ────────────────────────────────────────────

  const drawCard = useCallback((deck?: 'connection-builder' | 'open-heart', category?: CardCategory) => {
    let card: GameCard | null = null;
    if (category) {
      card = getRandomCardByCategory(category, sessionCards);
    } else {
      card = getRandomCard(deck, sessionCards);
    }
    if (!card) {
      // All cards played — reset exclusion list
      card = getRandomCard(deck);
    }
    if (card) {
      setCurrentCard(card);
      setIsFlipped(false);
      setReflection('');
      setPhase('playing');
    }
  }, [sessionCards]);

  const handleFlip = useCallback((flipped: boolean) => {
    setIsFlipped(flipped);
  }, []);

  const handleReadyToReflect = useCallback(() => {
    setPhase('reflecting');
  }, []);

  const handleComplete = useCallback(async () => {
    if (!currentCard || !userId) return;

    const reflectionBonus = reflection.split(/[.!?]+/).filter((s) => s.trim().length > 0).length >= 3 ? 10 : 0;
    const baseXP = currentCard.xpReward;
    const totalXP = baseXP + reflectionBonus;
    setXpEarned(totalXP);

    // Save completion
    try {
      await saveCardCompletion(userId, currentCard.id, currentCard.deck, currentCard.category, reflection, totalXP);
    } catch (e) {
      console.warn('[BuildingBridges] Save error:', e);
    }

    // Award XP
    try {
      await awardGamificationXP('scenario_complete', `bb-${currentCard.id}`, `Completed card: ${currentCard.title}`);
      if (reflectionBonus > 0) {
        await awardGamificationXP('reflection', `bb-ref-${currentCard.id}`, 'Card reflection bonus');
      }
    } catch (e) {
      console.warn('[BuildingBridges] XP error:', e);
    }

    // Track session
    setSessionCards((prev) => [...prev, currentCard.id]);
    setConnectionTokens((prev) => prev + 1);
    setPhase('complete');
  }, [currentCard, userId, reflection, awardGamificationXP]);

  const handleDrawAnother = useCallback(() => {
    if (currentCard?.deck === 'open-heart') {
      drawCard('open-heart');
    } else if (selectedCategory) {
      drawCard('connection-builder', selectedCategory);
    } else {
      drawCard('connection-builder');
    }
  }, [currentCard, selectedCategory, drawCard]);

  const handleGoHome = useCallback(() => {
    setPhase('home');
    setCurrentCard(null);
    setIsFlipped(false);
    setReflection('');
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleAskNuance = useCallback(() => {
    if (!currentCard) return;
    router.push({
      pathname: '/(app)/chat',
      params: { topic: `Building Bridges: ${currentCard.title}` },
    } as any);
  }, [currentCard, router]);

  // ─── Render ─────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => phase === 'home' ? (router.canGoBack() ? router.back() : router.replace('/(app)/home' as any)) : handleGoHome()}
          style={styles.headerBackBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeftIcon size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerPre}>Tender presents</Text>
          <Text style={styles.headerTitle}>Building Bridges</Text>
          <Text style={styles.headerSub}>A Relationship Connection Game</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Session counter */}
      {sessionCards.length > 0 && phase !== 'home' && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.sessionBar}>
          <Text style={styles.sessionText}>
            Session: {sessionCards.length} card{sessionCards.length !== 1 ? 's' : ''} played
          </Text>
          {connectionTokens > 0 && (
            <Text style={styles.tokenText}>{connectionTokens} connection tokens</Text>
          )}
        </Animated.View>
      )}

      {/* Content */}
      {phase === 'home' && (
        <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: BAR_HEIGHT + 20 }]} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
          <HomeView
            homeTab={homeTab}
            setHomeTab={setHomeTab}
            drawCard={drawCard}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            stats={stats}
            sessionCards={sessionCards}
          />
        </ScrollView>
      )}

      {phase === 'playing' && currentCard && (
        <PlayingView
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          onReadyToReflect={handleReadyToReflect}
          timerActive={timerActive}
          timerSeconds={timerSeconds}
          onStartTimer={() => startTimer(currentCard.timerDuration ?? 180)}
        />
      )}

      {phase === 'reflecting' && currentCard && (
        <ReflectingView
          card={currentCard}
          reflection={reflection}
          setReflection={setReflection}
          onComplete={handleComplete}
          onSkip={() => {
            setReflection('');
            handleComplete();
          }}
        />
      )}

      {phase === 'complete' && currentCard && (
        <CompleteView
          card={currentCard}
          xpEarned={xpEarned}
          reflection={reflection}
          onDrawAnother={handleDrawAnother}
          onAskNuance={handleAskNuance}
          onDone={handleGoHome}
        />
      )}

      <Animated.View style={[styles.quickLinksWrapper, quickLinksAnimStyle]}>
        <QuickLinksBar currentScreen="bridges" />
      </Animated.View>
    </SafeAreaView>
  );
}

// ─── Sub-Components ─────────────────────────────────────

function HomeView({
  homeTab,
  setHomeTab,
  drawCard,
  selectedCategory,
  setSelectedCategory,
  stats,
  sessionCards,
}: {
  homeTab: HomeTab;
  setHomeTab: (tab: HomeTab) => void;
  drawCard: (deck?: 'connection-builder' | 'open-heart', category?: CardCategory) => void;
  selectedCategory: CardCategory | null;
  setSelectedCategory: (cat: CardCategory | null) => void;
  stats: CompletionStats | null;
  sessionCards: string[];
}) {
  return (
    <Animated.View entering={FadeIn.duration(400)}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        {([
          { id: 'draw' as HomeTab, label: 'Draw' },
          { id: 'browse' as HomeTab, label: 'Browse' },
          { id: 'open-heart' as HomeTab, label: 'Open Heart' },
          { id: 'progress' as HomeTab, label: 'Progress' },
        ]).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, homeTab === tab.id && styles.tabActive]}
            onPress={() => setHomeTab(tab.id)}
            accessibilityRole="button"
          >
            <Text style={[styles.tabLabel, homeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Draw tab */}
      {homeTab === 'draw' && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Draw a Card</Text>
          <Text style={styles.sectionDesc}>
            Shuffle the deck and draw a random Connection Builder card. Both partners discuss together — or use it as a solo reflection.
          </Text>

          {/* Card deck visual */}
          <View style={styles.deckVisual}>
            <View style={[styles.deckCard, styles.deckCard3]} />
            <View style={[styles.deckCard, styles.deckCard2]} />
            <View style={[styles.deckCard, styles.deckCard1]}>
              <Text style={styles.deckCount}>40</Text>
              <Text style={styles.deckLabel}>Connection{'\n'}Builder Cards</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => drawCard('connection-builder')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Draw a Card"
          >
            <SparkleIcon size={18} color={Colors.textOnPrimary} />
            <Text style={styles.primaryButtonText}>Draw a Card</Text>
          </TouchableOpacity>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>How to Play</Text>
            <Text style={styles.tipsText}>1. Draw a card and read it aloud together</Text>
            <Text style={styles.tipsText}>2. Tap the card to flip and see the exercise</Text>
            <Text style={styles.tipsText}>3. Discuss the prompt and share reflections</Text>
            <Text style={styles.tipsText}>4. Write your reflection to earn XP</Text>
            <Text style={styles.tipsText}>5. The goal is connection, not perfection</Text>
          </View>
        </Animated.View>
      )}

      {/* Browse tab */}
      {homeTab === 'browse' && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <Text style={styles.sectionDesc}>
            Choose the area you want to explore right now.
          </Text>

          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                selectedCategory === cat.id && { borderColor: cat.color, borderWidth: 2 },
              ]}
              onPress={() => {
                setSelectedCategory(cat.id);
              }}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryDesc}>{cat.description}</Text>
                <Text style={styles.categoryCount}>{cat.cardCount} cards</Text>
              </View>
              <View style={{ transform: [{ rotate: '180deg' }] }}>
                <ArrowLeftIcon size={14} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))}

          {selectedCategory && (
            <Animated.View entering={FadeIn.duration(300)}>
              <TouchableOpacity
                style={[styles.primaryButton, { marginTop: Spacing.md }]}
                onPress={() => drawCard('connection-builder', selectedCategory)}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <SparkleIcon size={18} color={Colors.textOnPrimary} />
                <Text style={styles.primaryButtonText}>
                  Draw from {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      )}

      {/* Open Heart tab */}
      {homeTab === 'open-heart' && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Open Heart Cards</Text>
          <Text style={styles.sectionDesc}>
            These cards go deeper. They invite you into vulnerability, tenderness, and emotional honesty. Draw when you feel ready to share something real.
          </Text>

          {/* Open Heart deck visual */}
          <View style={styles.deckVisual}>
            <View style={[styles.deckCard, styles.deckCard3, { backgroundColor: OPEN_HEART_DECK.colorLight }]} />
            <View style={[styles.deckCard, styles.deckCard2, { backgroundColor: OPEN_HEART_DECK.colorLight }]} />
            <View style={[styles.deckCard, styles.deckCard1, { backgroundColor: Colors.surfaceElevated, borderColor: OPEN_HEART_DECK.color }]}>
              <HeartIcon size={24} color={OPEN_HEART_DECK.color} />
              <Text style={[styles.deckCount, { color: OPEN_HEART_DECK.color }]}>20</Text>
              <Text style={[styles.deckLabel, { color: OPEN_HEART_DECK.color }]}>Open Heart{'\n'}Cards</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: OPEN_HEART_DECK.color }]}
            onPress={() => drawCard('open-heart')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Draw an Open Heart Card"
          >
            <HeartIcon size={18} color={Colors.textOnPrimary} />
            <Text style={styles.primaryButtonText}>Draw an Open Heart Card</Text>
          </TouchableOpacity>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Before you draw</Text>
            <Text style={styles.tipsText}>These cards ask for real vulnerability. There is no pressure — you can skip any card at any time.</Text>
            <Text style={[styles.tipsText, { fontStyle: 'italic', marginTop: Spacing.xs }]}>
              Every card is a step forward, not a test to pass.
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Progress tab */}
      {homeTab === 'progress' && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Your Progress</Text>

          {stats ? (
            <>
              {/* Overall stats */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{stats.totalCompleted}</Text>
                  <Text style={styles.statLabel}>Cards{'\n'}Completed</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{stats.totalXP}</Text>
                  <Text style={styles.statLabel}>Total{'\n'}XP Earned</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{stats.reflectionCount}</Text>
                  <Text style={styles.statLabel}>Reflections{'\n'}Written</Text>
                </View>
              </View>

              {/* Category progress */}
              <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Category Progress</Text>
              {CATEGORIES.map((cat) => {
                const completed = stats.byCategory[cat.id] ?? 0;
                const pct = Math.round((completed / cat.cardCount) * 100);
                return (
                  <View key={cat.id} style={styles.progressRow}>
                    <View style={[styles.progressDot, { backgroundColor: cat.color }]} />
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressName}>{cat.name}</Text>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${pct}%` as any, backgroundColor: cat.color }]} />
                      </View>
                    </View>
                    <Text style={styles.progressCount}>{completed}/{cat.cardCount}</Text>
                  </View>
                );
              })}

              {/* Open Heart progress */}
              <View style={styles.progressRow}>
                <View style={[styles.progressDot, { backgroundColor: OPEN_HEART_DECK.color }]} />
                <View style={styles.progressInfo}>
                  <Text style={styles.progressName}>{OPEN_HEART_DECK.name}</Text>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.round(((stats.openHeartCompleted ?? 0) / 20) * 100)}%` as any,
                          backgroundColor: OPEN_HEART_DECK.color,
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.progressCount}>{stats.openHeartCompleted ?? 0}/20</Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <BookOpenIcon size={32} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Draw your first card to begin your journey</Text>
            </View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

function PlayingView({
  card,
  isFlipped,
  onFlip,
  onReadyToReflect,
  timerActive,
  timerSeconds,
  onStartTimer,
}: {
  card: GameCard;
  isFlipped: boolean;
  onFlip: (flipped: boolean) => void;
  onReadyToReflect: () => void;
  timerActive: boolean;
  timerSeconds: number;
  onStartTimer: () => void;
}) {
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.playingContainer}>
      <FlippableCard
        frontContent={<CardFront card={card} width={CARD_WIDTH} height={CARD_HEIGHT} />}
        backContent={<CardBack card={card} width={CARD_WIDTH} height={CARD_HEIGHT} />}
        onFlip={onFlip}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
      />

      <View style={styles.playingActions}>
        {/* Timer button */}
        {card.requiresTimer && !timerActive && isFlipped && (
          <Animated.View entering={FadeInUp.duration(300)}>
            <TouchableOpacity style={styles.timerButton} onPress={onStartTimer} activeOpacity={0.8} accessibilityRole="button">
              <Text style={styles.timerButtonText}>
                Start {Math.floor((card.timerDuration ?? 180) / 60)}-min Timer
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Timer display */}
        {timerActive && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.timerDisplay}>
            <Text style={styles.timerTime}>{formatTime(timerSeconds)}</Text>
          </Animated.View>
        )}

        {/* Ready to reflect */}
        {isFlipped && (
          <Animated.View entering={FadeInUp.duration(400).delay(200)}>
            <TouchableOpacity style={styles.primaryButton} onPress={onReadyToReflect} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Ready to Reflect">
              <Text style={styles.primaryButtonText}>Ready to Reflect</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {!isFlipped && (
          <Text style={styles.flipPrompt}>Tap the card to flip it over</Text>
        )}
      </View>
    </Animated.View>
  );
}

function ReflectingView({
  card,
  reflection,
  setReflection,
  onComplete,
  onSkip,
}: {
  card: GameCard;
  reflection: string;
  setReflection: (text: string) => void;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const sentenceCount = reflection.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const hasBonus = sentenceCount >= 3;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.reflectingContent} keyboardShouldPersistTaps="handled">
      <Animated.View entering={FadeIn.duration(400)}>
        <Text style={styles.reflectTitle}>{card.title}</Text>
        <Text style={styles.reflectSubtitle}>{card.backContent.discussionPrompt}</Text>

        <View style={styles.reflectInputContainer}>
          <TextInput
            style={styles.reflectInput}
            placeholder="What came up for you? Write freely — there are no wrong answers..."
            placeholderTextColor={Colors.textMuted}
            value={reflection}
            onChangeText={setReflection}
            multiline
            textAlignVertical="top"
            autoFocus={Platform.OS !== 'web'}
          accessibilityRole="text"
            accessibilityLabel="What came up for you? Write freely — there are no wrong answers..."
          />
          {reflection.length > 0 && (
            <View style={styles.reflectMeta}>
              <Text style={[styles.reflectMetaText, hasBonus && { color: Colors.success }]}>
                {sentenceCount} sentence{sentenceCount !== 1 ? 's' : ''}
                {hasBonus ? ' (+10 XP bonus)' : sentenceCount > 0 ? ` (${3 - sentenceCount} more for bonus)` : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Solo mode hint */}
        {card.soloAdaptation && (
          <View style={styles.soloHint}>
            <Text style={styles.soloHintLabel}>Solo reflection</Text>
            <Text style={styles.soloHintText}>{card.soloAdaptation}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, reflection.length === 0 && styles.buttonMuted]}
          onPress={onComplete}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Mark Complete"
        >
          <CheckmarkIcon size={18} color={Colors.textOnPrimary} />
          <Text style={styles.primaryButtonText}>Mark Complete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={onSkip} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Skip reflection">
          <Text style={styles.skipButtonText}>Skip reflection</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

function CompleteView({
  card,
  xpEarned,
  reflection,
  onDrawAnother,
  onAskNuance,
  onDone,
}: {
  card: GameCard;
  xpEarned: number;
  reflection: string;
  onDrawAnother: () => void;
  onAskNuance: () => void;
  onDone: () => void;
}) {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.completeContent}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.completeInner}>
        {/* Celebration */}
        <View style={styles.celebrationBadge}>
          <StarIcon size={28} color={Colors.accentGold} />
        </View>
        <Text style={styles.completeTitle}>Beautiful</Text>
        <Text style={styles.completeSubtitle}>
          You just completed "{card.title}"
        </Text>

        {/* XP earned */}
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{xpEarned} XP</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.primaryButton} onPress={onDrawAnother} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Draw Another Card">
          <RefreshIcon size={18} color={Colors.textOnPrimary} />
          <Text style={styles.primaryButtonText}>Draw Another Card</Text>
        </TouchableOpacity>

        {reflection.length > 0 && (
          <TouchableOpacity style={styles.secondaryButton} onPress={onAskNuance} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Ask Nuance About This">
            <ChatBubbleIcon size={18} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Ask Nuance About This</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.skipButton} onPress={onDone} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Done for now">
          <Text style={styles.skipButtonText}>Done for now</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  quickLinksWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.scrollPadBottom,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerBackBtn: {
    padding: Spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerPre: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.micro,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 1,
  },
  headerSub: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  headerSpacer: {
    width: 36,
  },

  // Session bar
  sessionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surfaceElevated,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  sessionText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  tokenText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.accentGold,
    fontWeight: '600',
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.surface,
    ...Shadows.subtle,
  },
  tabLabel: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  tabContent: {
    padding: Spacing.md,
  },

  // Section text
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  sectionDesc: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },

  // Deck visual
  deckVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: Spacing.lg,
  },
  deckCard: {
    width: 140,
    height: 160,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  deckCard1: {
    zIndex: 3,
  },
  deckCard2: {
    zIndex: 2,
    transform: [{ rotate: '-5deg' }, { translateX: -8 }],
    opacity: 0.8,
  },
  deckCard3: {
    zIndex: 1,
    transform: [{ rotate: '5deg' }, { translateX: 8 }],
    opacity: 0.6,
  },
  deckCount: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingXL,
    fontWeight: '700',
    color: Colors.text,
  },
  deckLabel: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Category cards
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  categoryDesc: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  categoryCount: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.tiny,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Buttons
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  primaryButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textOnPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  secondaryButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  buttonMuted: {
    opacity: 0.6,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.xs,
  },
  skipButtonText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
  },

  // Tips card
  tipsCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tipsTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  tipsText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },

  // Playing view
  playingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  playingActions: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  flipPrompt: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.md,
  },

  // Timer
  timerButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  timerButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textOnSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  timerDisplay: {
    backgroundColor: Colors.surfaceElevated,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  timerTime: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 2,
  },

  // Reflecting view
  reflectingContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.scrollPadBottom,
  },
  reflectTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  reflectSubtitle: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  reflectInputContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  reflectInput: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    padding: Spacing.md,
    minHeight: 160,
    lineHeight: 24,
  },
  reflectMeta: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  reflectMetaText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  soloHint: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.calm,
  },
  soloHintLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.tiny,
    fontWeight: '600',
    color: Colors.calm,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  soloHintText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Complete view
  completeContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
  },
  completeInner: {
    alignItems: 'center',
    width: '100%',
  },
  celebrationBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accentCream + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xl,
  },
  completeTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  completeSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  xpBadge: {
    backgroundColor: Colors.accentGold + '20',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.xl,
  },
  xpText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    color: Colors.accentGold,
    letterSpacing: 1,
  },

  // Progress
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  statNumber: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.tiny,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressInfo: {
    flex: 1,
  },
  progressName: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressCount: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    width: 40,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
