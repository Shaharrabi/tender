/**
 * MessageFlow — texting-style conversation bubbles (iMessage / WhatsApp).
 *
 * Nuance messages: left-aligned, light surface bubbles with avatar label.
 * User messages: right-aligned, green bubbles with white text.
 * Includes typing indicator, message grouping, and animated entrance.
 */

import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { COACH } from '@/constants/coach';
import type { ChatMessage } from '@/types/chat';

// ─── Props ──────────────────────────────────────────────

interface Props {
  messages: ChatMessage[];
  sending: boolean;
  onExerciseTap?: (exerciseId: string) => void;
  onSuggestedTap?: (text: string) => void;
  /** Step-specific opening prompts (from Twelve Steps) */
  suggestedStarters?: string[];
}

// ─── Default conversation starters ──────────────────────

const DEFAULT_STARTERS = [
  'I had a tough conversation with my partner',
  'Help me understand my patterns',
  'I want to practice a new skill',
];

// ─── Main component ─────────────────────────────────────

export default function MessageFlow({
  messages,
  sending,
  onExerciseTap,
  onSuggestedTap,
  suggestedStarters,
}: Props) {
  const starters = suggestedStarters ?? DEFAULT_STARTERS;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length, sending]);

  // ── Empty state: welcome screen ──

  if (messages.length === 0) {
    return (
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.emptyContent}
      >
        <Text style={styles.emptyAvatar}>{COACH.avatar}</Text>
        <Text style={styles.emptyTitle}>Meet {COACH.name}</Text>
        <Text style={styles.emptyGreeting}>{COACH.greeting}</Text>

        <View style={styles.startersContainer}>
          {starters.map((starter) => (
            <TouchableOpacity
              key={starter}
              style={styles.starterPill}
              activeOpacity={0.7}
              onPress={() => onSuggestedTap?.(starter)}
            >
              <Text style={styles.starterText}>{starter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }

  // ── Messages list ──

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {messages.map((msg, index) => {
        const prevMsg = index > 0 ? messages[index - 1] : null;
        const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
        const isFirstInGroup = !prevMsg || prevMsg.role !== msg.role;
        const isLastInGroup = !nextMsg || nextMsg.role !== msg.role;
        const showTimestamp = shouldShowTimestamp(msg, prevMsg);

        return (
          <React.Fragment key={msg.id}>
            {showTimestamp && (
              <Text style={styles.timestamp}>
                {formatTimestamp(msg.createdAt)}
              </Text>
            )}
            <MesnuanceBubble
              message={msg}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
              isLastMessage={index === messages.length - 1}
              onExerciseTap={onExerciseTap}
            />
          </React.Fragment>
        );
      })}

      {sending && <TypingIndicator />}
    </ScrollView>
  );
}

// ─── Timestamp logic ────────────────────────────────────

function shouldShowTimestamp(
  current: ChatMessage,
  previous: ChatMessage | null
): boolean {
  if (!previous) return true; // Always show before first message
  const currentTime = new Date(current.createdAt).getTime();
  const previousTime = new Date(previous.createdAt).getTime();
  // Show timestamp if more than 5 minutes between messages
  return currentTime - previousTime > 5 * 60 * 1000;
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeStr = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (diffDays === 0) {
    return timeStr;
  } else if (diffDays === 1) {
    return `Yesterday ${timeStr}`;
  } else if (diffDays < 7) {
    const dayName = date.toLocaleDateString([], { weekday: 'long' });
    return `${dayName} ${timeStr}`;
  } else {
    const dateFormatted = date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
    return `${dateFormatted} ${timeStr}`;
  }
}

// ─── Exercise parser ────────────────────────────────────

function parseExerciseSuggestions(
  content: string
): { text: string; exerciseId?: string; exerciseTitle?: string }[] {
  const regex = /\[EXERCISE:([a-z0-9-]+):([^\]]+)\]/g;
  const parts: { text: string; exerciseId?: string; exerciseTitle?: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: content.substring(lastIndex, match.index) });
    }
    parts.push({
      text: '',
      exerciseId: match[1],
      exerciseTitle: match[2],
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ text: content.substring(lastIndex) });
  }

  if (parts.length === 0) {
    parts.push({ text: content });
  }

  return parts;
}

// ─── Message Bubble ─────────────────────────────────────

function MesnuanceBubble({
  message,
  isFirstInGroup,
  isLastInGroup,
  isLastMessage,
  onExerciseTap,
}: {
  message: ChatMessage;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  isLastMessage: boolean;
  onExerciseTap?: (exerciseId: string) => void;
}) {
  const slideAnim = useRef(new Animated.Value(isLastMessage ? 20 : 0)).current;
  const opacityAnim = useRef(new Animated.Value(isLastMessage ? 0 : 1)).current;

  useEffect(() => {
    if (isLastMessage) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, []);

  const isUser = message.role === 'user';
  const translateDirection = isUser ? 1 : -1;

  if (isUser) {
    return (
      <Animated.View
        style={[
          styles.bubbleRow,
          styles.bubbleRowUser,
          !isLastInGroup && styles.groupedSpacing,
          {
            opacity: opacityAnim,
            transform: [
              { translateX: Animated.multiply(slideAnim, translateDirection) },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.bubble,
            styles.userBubble,
            isFirstInGroup && styles.userBubbleFirst,
            isLastInGroup && styles.userBubbleLast,
          ]}
        >
          <Text style={styles.userBubbleText}>{message.content}</Text>
        </View>
      </Animated.View>
    );
  }

  // Assistant (Nuance) message
  const parts = parseExerciseSuggestions(message.content);

  return (
    <Animated.View
      style={[
        styles.bubbleRow,
        styles.bubbleRowNuance,
        !isLastInGroup && styles.groupedSpacing,
        {
          opacity: opacityAnim,
          transform: [
            { translateX: Animated.multiply(slideAnim, translateDirection) },
          ],
        },
      ]}
    >
      {/* Avatar column */}
      <View style={styles.avatarColumn}>
        {isFirstInGroup ? (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{COACH.avatar}</Text>
          </View>
        ) : (
          <View style={styles.avatarSpacer} />
        )}
      </View>

      <View style={styles.nuanceBubbleColumn}>
        {/* Nuance name label above first message in group */}
        {isFirstInGroup && (
          <Text style={styles.nuanceLabel}>
            {COACH.name} {COACH.avatar}
          </Text>
        )}

        {/* Bubble content */}
        {parts.map((part, idx) => {
          if (part.exerciseId) {
            return (
              <TouchableOpacity
                key={`ex-${idx}`}
                style={styles.exerciseCard}
                onPress={() => onExerciseTap?.(part.exerciseId!)}
                activeOpacity={0.8}
              >
                <View style={styles.exerciseBadge}>
                  <Text style={styles.exerciseBadgeText}>Exercise</Text>
                </View>
                <Text style={styles.exerciseTitle}>{part.exerciseTitle}</Text>
                <Text style={styles.exerciseCta}>Tap to start</Text>
              </TouchableOpacity>
            );
          }
          if (part.text.trim()) {
            return (
              <View
                key={`txt-${idx}`}
                style={[
                  styles.bubble,
                  styles.nuanceBubble,
                  isFirstInGroup && idx === 0 && styles.nuanceBubbleFirst,
                  isLastInGroup &&
                    idx === parts.filter((p) => p.text.trim() || p.exerciseId).length - 1 &&
                    styles.nuanceBubbleLast,
                ]}
              >
                <Text style={styles.nuanceBubbleText}>{part.text.trim()}</Text>
              </View>
            );
          }
          return null;
        })}
      </View>
    </Animated.View>
  );
}

// ─── Typing Indicator ───────────────────────────────────

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -6,
            duration: 300,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      ).start();
    };
    bounce(dot1, 0);
    bounce(dot2, 150);
    bounce(dot3, 300);
  }, []);

  return (
    <View style={[styles.bubbleRow, styles.bubbleRowNuance]}>
      <View style={styles.avatarColumn}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>{COACH.avatar}</Text>
        </View>
      </View>
      <View style={[styles.bubble, styles.nuanceBubble, styles.typingBubble]}>
        <View style={styles.dotsRow}>
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: dot1 }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: dot2 }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: dot3 }] }]}
          />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const BUBBLE_MAX_WIDTH = '78%';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  // ── Empty / welcome state ──
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  emptyAvatar: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyGreeting: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: Spacing.xl,
  },
  startersContainer: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  starterPill: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    maxWidth: 320,
  },
  starterText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // ── Timestamp ──
  timestamp: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },

  // ── Bubble rows ──
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    alignItems: 'flex-end',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowNuance: {
    justifyContent: 'flex-start',
  },
  groupedSpacing: {
    marginBottom: 3,
  },

  // ── Avatar ──
  avatarColumn: {
    width: 32,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 16,
  },
  avatarSpacer: {
    width: 28,
    height: 28,
  },

  // ── Nuance label ──
  nuanceLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 2,
    marginLeft: 2,
  },

  // ── Nuance bubble column ──
  nuanceBubbleColumn: {
    maxWidth: BUBBLE_MAX_WIDTH,
    flexShrink: 1,
  },

  // ── Generic bubble ──
  bubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },

  // ── User bubbles ──
  userBubble: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.sm,
    maxWidth: BUBBLE_MAX_WIDTH,
    ...Shadows.subtle,
  },
  userBubbleFirst: {
    borderTopRightRadius: BorderRadius.lg,
  },
  userBubbleLast: {
    borderBottomRightRadius: BorderRadius.sm,
  },
  userBubbleText: {
    fontSize: FontSizes.body,
    color: Colors.textOnPrimary,
    lineHeight: 22,
  },

  // ── Nuance bubbles ──
  nuanceBubble: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.sm,
    ...Shadows.subtle,
  },
  nuanceBubbleFirst: {
    borderTopLeftRadius: BorderRadius.lg,
  },
  nuanceBubbleLast: {
    borderBottomLeftRadius: BorderRadius.sm,
  },
  nuanceBubbleText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
  },

  // ── Exercise card (embedded in Nuance stream) ──
  exerciseCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  exerciseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  exerciseBadgeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
  },
  exerciseTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  exerciseCta: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '600',
  },

  // ── Typing indicator ──
  typingBubble: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
});
