/**
 * DailyLifeScenario — "Your Pattern in Daily Life" concrete scenario card.
 *
 * Translates abstract portrait data into Tuesday-evening behavior.
 * Pure function: generateScenario(portrait) → { situation, pattern, growthMove, trySaying }
 *
 * Verified types: IndividualPortrait from @/types/portrait
 *   Colors.accent='#D8A499' (Warm Terracotta), Colors.success='#6B9080'
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { IndividualPortrait } from '@/types/portrait';
import { SwirlyIcon, SeedlingIcon, ChatBubbleIcon } from '@/assets/graphics/icons';

interface DailyLifeScenarioProps {
  portrait: IndividualPortrait;
}

function generateScenario(p: IndividualPortrait) {
  const pos = p.negativeCycle.position;
  const reg = p.compositeScores.regulationScore;
  const acc = p.compositeScores.accessibility;

  if (pos === 'withdrawer') {
    return {
      situation: 'Your partner comes home stressed and starts venting about their day.',
      pattern: reg < 50
        ? 'You\u2019ll likely go quiet, retreat to another room, or shift to problem-solving mode. Your nervous system reads their stress as too much to hold right now.'
        : 'You\u2019ll listen for a while, but if the intensity rises, you\u2019ll start pulling inward \u2014 shorter responses, less eye contact, body angled away.',
      growthMove: acc < 50
        ? 'Stay present for 30 more seconds before retreating. Name what\u2019s happening: \u201CI notice I\u2019m pulling back.\u201D'
        : 'Instead of fixing, try mirroring: \u201CThat sounds really frustrating.\u201D Then stay in the room.',
      trySaying: '\u201CI can see you\u2019re stressed. I\u2019m here. I might need a pause in a few minutes, but I\u2019m with you right now.\u201D',
    };
  }
  if (pos === 'pursuer') {
    return {
      situation: 'Your partner seems distant after dinner \u2014 scrolling their phone, giving one-word answers.',
      pattern: reg < 50
        ? 'You\u2019ll feel the distance immediately and start testing: asking questions, suggesting activities, interpreting their quiet as rejection.'
        : 'You\u2019ll notice the distance and feel a pull to close it \u2014 but it might come out as criticism rather than the need underneath.',
      growthMove: 'Notice the urgency in your body before acting on it. Take three breaths. Then ask one question and wait for the full answer.',
      trySaying: '\u201CI\u2019m noticing I want to connect. Is now a good time, or would later work better?\u201D',
    };
  }
  return {
    situation: 'A small disagreement about weekend plans starts escalating.',
    pattern: 'Your response shifts mid-conversation \u2014 first you reach, then you retreat when it doesn\u2019t land. The switching itself confuses both of you.',
    growthMove: 'Name which mode you\u2019re in as it happens: \u201CI notice I\u2019m starting to withdraw right now.\u201D Naming it interrupts the autopilot.',
    trySaying: '\u201CWait \u2014 I can feel myself shifting. Can we pause for a second? I want to stay in this conversation.\u201D',
  };
}

export default function DailyLifeScenario({ portrait }: DailyLifeScenarioProps) {
  const s = generateScenario(portrait);

  return (
    <Animated.View entering={FadeIn.delay(400).duration(500)}>
      <View style={styles.card}>
        <TenderText variant="label" color={Colors.accent} style={styles.eyebrow}>YOUR PATTERN IN DAILY LIFE</TenderText>
        <TenderText variant="bodySmall" color={Colors.textMuted} style={styles.situation}>{s.situation}</TenderText>

        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <SwirlyIcon size={12} color={Colors.textMuted} />
            <TenderText variant="label" color={Colors.textMuted} style={styles.sectionLabel}>YOUR LIKELY MOVE</TenderText>
          </View>
          <TenderText variant="body" color={Colors.textSecondary} style={styles.sectionText}>{s.pattern}</TenderText>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <SeedlingIcon size={12} color={Colors.success} />
            <TenderText variant="label" color={Colors.success} style={styles.sectionLabel}>YOUR GROWTH MOVE</TenderText>
          </View>
          <TenderText variant="body" color={Colors.textSecondary} style={styles.sectionText}>{s.growthMove}</TenderText>
        </View>
        <View style={styles.tryCard}>
          <View style={styles.sectionLabelRow}>
            <ChatBubbleIcon size={12} color={Colors.primary} />
            <TenderText variant="label" color={Colors.primary} style={styles.sectionLabel}>TRY SAYING</TenderText>
          </View>
          <TenderText variant="serifItalic" color={Colors.text} style={styles.trySaying}>{s.trySaying}</TenderText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg, borderLeftWidth: 4, borderLeftColor: Colors.accent, padding: Spacing.lg, gap: Spacing.md, ...Shadows.card },
  eyebrow: { letterSpacing: 2, fontSize: 10 },
  situation: { lineHeight: 20, fontStyle: 'italic' },
  section: { gap: Spacing.xs },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sectionLabel: { fontSize: 10, letterSpacing: 1.5 },
  sectionText: { lineHeight: 24 },
  tryCard: { backgroundColor: Colors.backgroundAlt, borderRadius: BorderRadius.sm, padding: Spacing.md, gap: Spacing.xs },
  trySaying: { fontSize: 15, lineHeight: 24 },
});
