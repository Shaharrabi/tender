/**
 * Couple Portal Enhancements — Three components in one file.
 *
 * 1. TonightTryThis — Daily micro-action based on CycleDynamic
 * 2. ConversationPrompts — Per-assessment dialogue starters
 * 3. AnchorSOSButton — Floating quick-access repair phrases
 *
 * Verified types from @/types/couples:
 *   DeepCouplePortrait, CoupleAnchorSet, CoupleGrowthEdge
 *   CycleDynamic = 'pursue-withdraw' | 'mutual-pursuit' | 'mutual-withdrawal' | 'mixed-switching'
 *   CoupleAnchorSet.repairStarters: string[]
 *   CoupleAnchorSet.whenInTheCycle: CoupleAnchor[] (each has .text, .context?)
 *
 * Colors verified: Colors.accentGold='#D4A843', Colors.accent='#D8A499'
 */

import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { HeartPulseIcon, CloseIcon, ChatBubbleIcon, RefreshIcon } from '@/assets/graphics/icons';
import type { DeepCouplePortrait, CoupleAnchorSet, CoupleAnchor } from '@/types/couples';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ═══ 1. TONIGHT TRY THIS ═══════════════════════════════

interface TonightTryThisProps {
  deepPortrait: DeepCouplePortrait;
}

interface MicroAction {
  action: string;
  why: string;
  basedOn: string;
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

function buildMicroActions(dp: DeepCouplePortrait): MicroAction[] {
  const dynamic = dp.patternInterlock.combinedCycle.dynamic;
  const pA = dp.partnerAName || 'Partner A';
  const pB = dp.partnerBName || 'Partner B';
  const edge = dp.coupleGrowthEdges?.[0];
  const actions: MicroAction[] = [];

  if (dynamic === 'pursue-withdraw') {
    actions.push(
      { action: `When you see each other after work, pause for 10 seconds of eye contact before speaking. Your pattern tends to skip the greeting.`, why: 'The pause interrupts the pursue-withdraw autopilot.', basedOn: 'Your cycle pattern' },
      { action: `${pB}: Before retreating tonight, say \u201CI need a pause, but I\u2019m coming back.\u201D ${pA}: Let them go without following.`, why: 'Named retreats feel different than silent disappearances.', basedOn: 'Your cycle pattern' },
      { action: `Tonight, the pursuer goes second. Ask your partner one question, then wait in silence for the full answer.`, why: 'Space invites depth. Pursuit invites defense.', basedOn: 'Your cycle pattern' },
    );
  } else if (dynamic === 'mutual-withdrawal') {
    actions.push(
      { action: `Set a timer for 10 minutes tonight. Sit together. No phones. If no one speaks, that\u2019s okay \u2014 presence counts.`, why: 'Two withdrawers need structured proximity before connection emerges.', basedOn: 'Your cycle pattern' },
      { action: `Send one text today that names a feeling, not a fact. \u201CI missed you at lunch\u201D instead of \u201CWhat\u2019s for dinner?\u201D`, why: 'Breaking the factual-only channel opens emotional bandwidth.', basedOn: 'Your cycle pattern' },
    );
  } else if (dynamic === 'mutual-pursuit') {
    actions.push(
      { action: `Tonight, take turns speaking for 2 minutes each. The listener cannot respond until their turn. Use a timer.`, why: 'Two pursuers need structure to hear rather than react.', basedOn: 'Your cycle pattern' },
      { action: `Before your next conversation, each write down ONE thing you need. Share papers. No discussion \u2014 just read and nod.`, why: 'Written words bypass the escalation loop.', basedOn: 'Your cycle pattern' },
    );
  } else {
    actions.push(
      { action: `Tonight, name which mode you\u2019re each in: \u201CI\u2019m in reaching mode\u201D or \u201CI\u2019m in retreat mode.\u201D Just name it.`, why: 'Your switching pattern becomes manageable when both can see it.', basedOn: 'Your cycle pattern' },
    );
  }

  if (edge) {
    actions.push({ action: `Practice your growth edge tonight: ${(edge.practiceForBoth ?? edge.theInvitation ?? '').slice(0, 120)}`, why: `Targets your #1 couple growth edge: ${edge.title}.`, basedOn: 'Your top growth edge' });
  }
  return actions;
}

export function TonightTryThis({ deepPortrait }: TonightTryThisProps) {
  const actions = buildMicroActions(deepPortrait);
  const today = actions[getDayOfYear() % actions.length];
  if (!today) return null;

  return (
    <Animated.View entering={FadeIn.delay(300).duration(500)}>
      <View style={tttStyles.card}>
        <TenderText variant="label" color={Colors.accentGold} style={tttStyles.eyebrow}>{'\uD83C\uDF05'} TONIGHT, TRY THIS</TenderText>
        <TenderText variant="body" color={Colors.text} style={tttStyles.action}>{today.action}</TenderText>
        <TenderText variant="caption" color={Colors.textSecondary} style={{ fontStyle: 'italic' }}>{today.why}</TenderText>
        <TenderText variant="caption" color={Colors.textMuted}>Based on: {today.basedOn} {'\u00B7'} Refreshes daily</TenderText>
      </View>
    </Animated.View>
  );
}

const tttStyles = StyleSheet.create({
  card: { backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: Colors.accentGold + '40', padding: Spacing.lg, gap: Spacing.sm, ...Shadows.card },
  eyebrow: { letterSpacing: 2, fontSize: 10 },
  action: { lineHeight: 26 },
});

// ═══ 2. CONVERSATION PROMPTS ════════════════════════════

interface ConversationPromptsProps {
  assessmentType: 'csi16' | 'rdas' | 'dci';
  hasGap: boolean;
}

const PROMPTS: Record<string, { withGap: string[]; noGap: string[] }> = {
  csi16: {
    withGap: [
      '\u201COn a scale of 1\u201310, how happy are you with us this week? I\u2019ll go first.\u201D',
      '\u201CWhat\u2019s one thing I did recently that made you feel closer to me?\u201D',
      '\u201CIs there something weighing on your satisfaction that I might not see?\u201D',
    ],
    noGap: [
      '\u201CWhat\u2019s working well between us right now? I want to name it.\u201D',
      '\u201CIf one thing could get even better, what would it be?\u201D',
    ],
  },
  rdas: {
    withGap: [
      '\u201CWhere do you feel most aligned with me? Where do you feel the biggest gap?\u201D',
      '\u201CIs there a decision we\u2019ve been avoiding because we don\u2019t agree?\u201D',
      '\u201CWhat does a really good day together look like for you?\u201D',
    ],
    noGap: [
      '\u201CWhat\u2019s one area where we used to disagree but found our way?\u201D',
      '\u201CHow do you feel about how much we do together vs. apart?\u201D',
    ],
  },
  dci: {
    withGap: [
      '\u201CWhen I\u2019m stressed, what does helpful support look like to you? What I\u2019m offering might not be what you need.\u201D',
      '\u201CDo you feel like I take on enough when you\u2019re overwhelmed? Be honest.\u201D',
      '\u201CWhat\u2019s one thing I could do differently when you\u2019re having a hard day?\u201D',
    ],
    noGap: [
      '\u201CWhen was the last time you felt truly supported by me? What did I do?\u201D',
      '\u201CHow can we get better at co-regulating when BOTH of us are stressed?\u201D',
    ],
  },
};

export function ConversationPrompts({ assessmentType, hasGap }: ConversationPromptsProps) {
  const [expanded, setExpanded] = useState(false);
  const prompts = PROMPTS[assessmentType]?.[hasGap ? 'withGap' : 'noGap'] ?? [];
  if (prompts.length === 0) return null;

  return (
    <View style={cpStyles.container}>
      <TouchableOpacity
        style={cpStyles.trigger}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(!expanded);
        }}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <TenderText variant="bodySmall" color={Colors.accent} style={{ fontWeight: '600' }}>
          {'\uD83D\uDCAC'} Start a Conversation About This {expanded ? '\u25BE' : '\u25B8'}
        </TenderText>
      </TouchableOpacity>
      {expanded && (
        <View style={cpStyles.list}>
          {prompts.map((p, i) => (
            <View key={i} style={cpStyles.promptCard}>
              <TenderText variant="bodySmall" color={Colors.text} style={{ fontStyle: 'italic', lineHeight: 22 }}>{p}</TenderText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const cpStyles = StyleSheet.create({
  container: { marginTop: Spacing.sm },
  trigger: { backgroundColor: Colors.accentLight, borderWidth: 1, borderColor: Colors.accent + '30', borderRadius: BorderRadius.md, paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.md },
  list: { marginTop: Spacing.sm, gap: Spacing.xs },
  promptCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.borderLight, padding: Spacing.sm + 4 },
});

// ═══ 3. ANCHOR SOS BUTTON ═══════════════════════════════

interface AnchorSOSButtonProps {
  anchors: CoupleAnchorSet;
}

export function AnchorSOSButton({ anchors }: AnchorSOSButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FAB + label */}
      <View style={sosStyles.fabContainer}>
        <TouchableOpacity
          style={sosStyles.fab}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setOpen(!open);
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={open ? 'Close repair tools' : 'Quick repair tools'}
        >
          {open
            ? <CloseIcon size={15} color={Colors.white} />
            : <HeartPulseIcon size={17} color={Colors.white} />}
        </TouchableOpacity>
        {!open && (
          <TenderText variant="caption" color={Colors.accent} style={sosStyles.fabLabel}>
            SOS
          </TenderText>
        )}
      </View>

      {/* Panel */}
      {open && (
        <View style={sosStyles.panel}>
          <View style={sosStyles.panelHeader}>
            <HeartPulseIcon size={14} color={Colors.accent} />
            <TenderText variant="headingS" color={Colors.text} style={{ fontSize: 15 }}>
              Quick Repair
            </TenderText>
          </View>
          <TenderText variant="caption" color={Colors.textMuted} style={sosStyles.panelDesc}>
            Words to reach for in a difficult moment.
          </TenderText>

          {/* Repair starters */}
          <View style={sosStyles.sectionLabel}>
            <ChatBubbleIcon size={11} color={Colors.textMuted} />
            <TenderText variant="label" color={Colors.textMuted} style={{ fontSize: 10, letterSpacing: 1.5 }}>
              TRY SAYING
            </TenderText>
          </View>
          {anchors.repairStarters.slice(0, 3).map((phrase, i) => (
            <View key={i} style={sosStyles.row}>
              <TenderText variant="serifItalic" color={Colors.text} style={sosStyles.repairPhrase}>
                {'\u201C'}{phrase}{'\u201D'}
              </TenderText>
            </View>
          ))}

          {/* Cycle anchors */}
          {anchors.whenInTheCycle.length > 0 && (
            <>
              <View style={[sosStyles.sectionLabel, { marginTop: Spacing.sm }]}>
                <RefreshIcon size={11} color={Colors.textMuted} />
                <TenderText variant="label" color={Colors.textMuted} style={{ fontSize: 10, letterSpacing: 1.5 }}>
                  IN YOUR CYCLE
                </TenderText>
              </View>
              {anchors.whenInTheCycle.slice(0, 2).map((a: CoupleAnchor, i: number) => (
                <View key={`c${i}`} style={sosStyles.row}>
                  <TenderText variant="bodySmall" color={Colors.textSecondary} style={{ lineHeight: 21 }}>
                    {a.text}
                  </TenderText>
                </View>
              ))}
            </>
          )}
        </View>
      )}
    </>
  );
}

const sosStyles = StyleSheet.create({
  fabContainer: {
    position: 'absolute', bottom: 80, right: Spacing.md,
    alignItems: 'center', zIndex: 30,
  },
  fab: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent + 'D9',
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.elevated,
  },
  fabLabel: {
    fontSize: 9, letterSpacing: 1, marginTop: 2,
    fontWeight: '600',
  },
  panel: {
    position: 'absolute', bottom: 130, right: Spacing.md, width: 280,
    backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.lg,
    borderLeftWidth: 3, borderLeftColor: Colors.accent,
    padding: Spacing.lg, gap: 2,
    ...Shadows.elevated, zIndex: 30,
    borderWidth: 1, borderColor: Colors.accent + '20',
  },
  panelHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2,
  },
  panelDesc: {
    marginBottom: Spacing.sm, lineHeight: 18,
  },
  sectionLabel: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginBottom: Spacing.xs,
  },
  row: {
    paddingVertical: 2,
  },
  repairPhrase: {
    fontSize: 14, lineHeight: 22,
  },
});
