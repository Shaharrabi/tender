/**
 * RoomContent — Switch-case renderer for hotel room content types
 *
 * Each hotel room has a different content type:
 * - self-check: The Lobby — reflection questions
 * - pattern-reveal: The Reading Room — attachment patterns
 * - practices: The Parlor — 7 dating practices
 * - scenarios: The Ballroom — interactive date scenarios
 * - signals: The Observatory — green/amber/red signals
 * - journal: The Writing Desk — post-date journal prompts
 * - transition: The Rooftop — when it's becoming something
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import PatternCard from './PatternCard';
import PracticeCard from './PracticeCard';
import ScenarioCard from './ScenarioCard';
import SignalRow from './SignalRow';
import JournalPrompt from './JournalPrompt';
import type { HotelRoom } from '@/types/dating';

interface RoomContentProps {
  room: HotelRoom;
}

export default function RoomContent({ room }: RoomContentProps) {
  const { content } = room;

  switch (content.type) {
    case 'self-check':
      return <SelfCheckContent content={content} />;
    case 'pattern-reveal':
      return <PatternRevealContent content={content} />;
    case 'practices':
      return <PracticesContent content={content} />;
    case 'scenarios':
      return <ScenariosContent content={content} />;
    case 'signals':
      return <SignalsContent content={content} />;
    case 'journal':
      return <JournalContent content={content} />;
    case 'transition':
      return <TransitionContent content={content} />;
    default:
      return null;
  }
}

// ─── Self-Check (Lobby) ──────────────────────────────────────

function SelfCheckContent({ content }: { content: any }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  return (
    <View style={styles.contentGap}>
      <Text style={styles.promptText}>{content.prompt}</Text>

      {content.questions.map((q: any, qi: number) => (
        <View key={qi} style={styles.card}>
          <Text style={styles.questionText}>{q.text}</Text>
          <View style={styles.optionList}>
            {q.options.map((opt: string, oi: number) => (
              <TouchableOpacity
                key={oi}
                style={[styles.optionButton, answers[qi] === oi && styles.optionSelected]}
                onPress={() => setAnswers({ ...answers, [qi]: oi })}
                accessibilityRole="button"
                accessibilityLabel={`Option: ${opt}`}
                accessibilityState={{ selected: answers[qi] === oi }}
              >
                <Text style={[styles.optionText, answers[qi] === oi && styles.optionTextSelected]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {Object.keys(answers).length === content.questions.length && (
        <Animated.View entering={FadeIn.duration(500)} style={styles.completionCard}>
          <Text style={styles.completionTitle}>You've arrived.</Text>
          <Text style={styles.completionText}>
            There are no wrong answers here. Whatever you selected — that's data,
            not judgment. Carry this awareness into the next room.
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Pattern Reveal (Reading Room) ───────────────────────────

function PatternRevealContent({ content }: { content: any }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <View style={styles.contentGap}>
      {content.patterns.map((pattern: any, i: number) => (
        <PatternCard
          key={i}
          pattern={pattern}
          expanded={expanded === i}
          onToggle={() => setExpanded(expanded === i ? null : i)}
        />
      ))}
    </View>
  );
}

// ─── Practices (Parlor) ─────────────────────────────────────

function PracticesContent({ content }: { content: any }) {
  return (
    <View style={styles.contentGap}>
      <Text style={styles.introText}>{content.intro}</Text>
      {content.practices.map((p: any, i: number) => (
        <PracticeCard key={i} practice={p} index={i} />
      ))}
    </View>
  );
}

// ─── Scenarios (Ballroom) ────────────────────────────────────

function ScenariosContent({ content }: { content: any }) {
  return (
    <View style={styles.contentGapLarge}>
      <Text style={styles.introTextItalic}>{content.intro}</Text>
      {content.scenarios.map((s: any, i: number) => (
        <ScenarioCard key={i} scenario={s} index={i} />
      ))}
    </View>
  );
}

// ─── Signals (Observatory) ───────────────────────────────────

function SignalsContent({ content }: { content: any }) {
  return (
    <View>
      <Text style={styles.introTextItalic}>{content.intro}</Text>

      <View style={styles.signalSection}>
        <Text style={[styles.signalHeader, { color: Colors.success }]}>○ Green Lights</Text>
        {content.greenLights.map((g: any, i: number) => (
          <SignalRow key={i} signal={g.signal} type="green" extra={g.weare} />
        ))}
      </View>

      <View style={styles.signalSection}>
        <Text style={[styles.signalHeader, { color: Colors.accentGold }]}>◐ Amber Lights</Text>
        {content.amberLights.map((a: any, i: number) => (
          <SignalRow key={i} signal={a.signal} type="amber" extra={a.note} />
        ))}
      </View>

      <View style={styles.signalSection}>
        <Text style={[styles.signalHeader, { color: Colors.error }]}>● Red Flags</Text>
        {content.redFlags.map((r: any, i: number) => (
          <SignalRow key={i} signal={r.signal} type="red" extra={`Your body says: ${r.body}`} />
        ))}
      </View>
    </View>
  );
}

// ─── Journal (Writing Desk) ──────────────────────────────────

function JournalContent({ content }: { content: any }) {
  return (
    <View style={styles.contentGap}>
      {content.prompts.map((p: any, i: number) => (
        <JournalPrompt key={i} prompt={p} />
      ))}

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerSymbol}>◆</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Bonus: Pattern Tracker */}
      <View style={styles.bonusCard}>
        <Text style={styles.bonusTitle}>{content.bonus.title}</Text>
        <Text style={styles.bonusDesc}>{content.bonus.description}</Text>
        {content.bonus.questions.map((q: string, i: number) => (
          <Text key={i} style={styles.bonusQuestion}>{q}</Text>
        ))}
      </View>
    </View>
  );
}

// ─── Transition (Rooftop) ────────────────────────────────────

function TransitionContent({ content }: { content: any }) {
  return (
    <View style={styles.contentGapLarge}>
      <Text style={styles.transitionIntro}>{content.intro}</Text>

      {content.guideposts.map((g: any, i: number) => (
        <View key={i} style={styles.guidepostCard}>
          <Text style={styles.guidepostTitle}>{g.title}</Text>
          <Text style={styles.guidepostText}>{g.text}</Text>
          <View style={styles.practiceBubble}>
            <Text style={styles.practiceLabel}>Practice</Text>
            <Text style={styles.practiceText}>{g.practice}</Text>
          </View>
        </View>
      ))}

      {/* "Ready to Go Deeper?" CTA */}
      <View style={styles.readyCard}>
        <Text style={styles.readyTitle}>Ready to Go Deeper?</Text>
        <Text style={styles.readyText}>{content.invitation}</Text>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  contentGap: { gap: Spacing.md },
  contentGapLarge: { gap: Spacing.lg },

  promptText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 17,
    lineHeight: 26,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  introText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  introTextItalic: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },

  // Self-check
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  questionText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 14,
  },
  optionList: {
    gap: 8,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  optionText: {
    ...Typography.body,
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.primaryDark,
  },
  completionCard: {
    backgroundColor: `${Colors.success}11`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.success}33`,
    alignItems: 'center',
  },
  completionTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: Colors.success,
    fontWeight: '600',
  },
  completionText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },

  // Signals
  signalSection: {
    marginBottom: Spacing.lg,
  },
  signalHeader: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  // Journal
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    paddingHorizontal: 40,
    gap: Spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerSymbol: {
    color: Colors.textMuted,
    fontSize: 10,
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
  bonusCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  bonusTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 17,
    color: Colors.accent,
    fontWeight: '700',
    marginBottom: 4,
  },
  bonusDesc: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  bonusQuestion: {
    ...Typography.body,
    color: Colors.text,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },

  // Transition
  transitionIntro: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    lineHeight: 26,
    textAlign: 'center',
  },
  guidepostCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderTopWidth: 3,
    borderTopColor: Colors.primaryLight,
  },
  guidepostTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  guidepostText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 14,
  },
  practiceBubble: {
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.sm,
    padding: 14,
  },
  practiceLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 11,
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  practiceText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 22,
  },
  readyCard: {
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.primaryLight}44`,
  },
  readyTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: Colors.primaryDark,
    fontWeight: '700',
    marginBottom: 8,
  },
  readyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
});
