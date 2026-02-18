/**
 * L3: Repair Scenario — Branching dialogue scenario
 *
 * "The Dinner That Went Wrong" — a realistic conflict scenario plays out
 * as dialogue. User makes choices at decision points. Repair attempts are
 * highlighted with golden glow. After the scenario, a 5-step repair
 * template is revealed step by step.
 */

import React, { useState, useRef, useCallback } from 'react';
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
import { MC3_PALETTE, MC3_TIMING } from '@/constants/mc3Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'scenario' | 'insight' | 'template';

interface L3RepairScenarioProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

interface ScenarioNode {
  speaker: string;
  text: string;
  emotion?: string;
  choices?: Array<{
    id: string;
    text: string;
    label: string;
    isRepairAttempt: boolean;
    nextNode: string;
  }>;
  isEnding?: boolean;
  endingType?: string;
  insight?: string;
}

const REPAIR_SCENARIO: {
  title: string;
  setup: string;
  nodes: Record<string, ScenarioNode>;
} = {
  title: 'The Dinner That Went Wrong',
  setup: "You come home after a long day. Your partner promised to cook dinner but hasn't started. The kitchen is a mess. You're exhausted and hungry.",
  nodes: {
    start: {
      speaker: 'narrator',
      text: 'You walk in the door. The kitchen is untouched. Your partner is on the couch looking at their phone.',
      choices: [
        {
          id: 'criticism',
          text: "\u201CYou said you'd cook. You never follow through.\u201D",
          label: 'Criticism',
          isRepairAttempt: false,
          nextNode: 'partner_defensive',
        },
        {
          id: 'gentle_startup',
          text: "\u201CHey. I'm really tired and I was looking forward to dinner. What happened?\u201D",
          label: 'Gentle Startup',
          isRepairAttempt: true,
          nextNode: 'partner_explains',
        },
        {
          id: 'silent_treatment',
          text: 'Say nothing. Start slamming cabinets as you make your own food.',
          label: 'Passive Aggression',
          isRepairAttempt: false,
          nextNode: 'partner_withdraws',
        },
      ],
    },
    partner_defensive: {
      speaker: 'partner',
      text: "\u201CI had a horrible day too, you know. Not everything is about you.\u201D",
      emotion: 'defensive',
      choices: [
        {
          id: 'escalate',
          text: "\u201CSee? This is what you always do. Deflect.\u201D",
          label: 'Escalation',
          isRepairAttempt: false,
          nextNode: 'full_fight',
        },
        {
          id: 'repair_attempt_1',
          text: "\u201COkay, wait. I think I started this wrong. Let me try again.\u201D",
          label: 'Repair Attempt',
          isRepairAttempt: true,
          nextNode: 'repair_accepted',
        },
      ],
    },
    partner_explains: {
      speaker: 'partner',
      text: "\u201CI'm sorry. I got a terrible call from my boss and I just... shut down. I should have texted you.\u201D",
      emotion: 'vulnerable',
      choices: [
        {
          id: 'validate',
          text: "\u201CThat sounds rough. I'm sorry about your day. Can we figure out dinner together?\u201D",
          label: 'Validate + Collaborate',
          isRepairAttempt: true,
          nextNode: 'connection_restored',
        },
        {
          id: 'dismiss',
          text: "\u201CWell, you still could have at least told me.\u201D",
          label: 'Dismiss Their Feeling',
          isRepairAttempt: false,
          nextNode: 'partner_shuts_down',
        },
      ],
    },
    partner_withdraws: {
      speaker: 'partner',
      text: 'They look up, see the cabinet-slamming, and quietly go to the bedroom. The door closes.',
      emotion: 'withdrawn',
      choices: [
        {
          id: 'follow_pursue',
          text: "Follow them. \u201COh great, now you're going to shut me out?\u201D",
          label: 'Pursue',
          isRepairAttempt: false,
          nextNode: 'pursue_withdraw_cycle',
        },
        {
          id: 'pause_repair',
          text: "Stop. Take a breath. Knock on the door gently. \u201CI'm sorry. Can we start over?\u201D",
          label: 'Pause + Repair',
          isRepairAttempt: true,
          nextNode: 'slow_repair',
        },
      ],
    },
    full_fight: {
      speaker: 'narrator',
      text: "The conversation spirals. Both of you say things you don't mean. You end up in separate rooms, feeling worse than when you walked in.",
      emotion: 'disconnected',
      isEnding: true,
      endingType: 'unrepaired',
      insight: 'This is what happens when criticism meets defensiveness with no repair attempt. The cycle feeds itself.',
    },
    repair_accepted: {
      speaker: 'narrator',
      text: "Your partner pauses. Their shoulders soften. \u201COkay. I'm listening.\u201D",
      emotion: 'opening',
      choices: [
        {
          id: 'try_again',
          text: "\u201CI'm tired and hungry, and I felt let down. But I don't want to fight. What happened on your end?\u201D",
          label: 'Gentle Re-entry',
          isRepairAttempt: true,
          nextNode: 'connection_restored',
        },
      ],
    },
    connection_restored: {
      speaker: 'narrator',
      text: "You end up ordering takeout, sitting together, and talking about both your days. The conflict didn't disappear \u2014 but the connection came back.",
      emotion: 'connected',
      isEnding: true,
      endingType: 'repaired',
      insight: "This is what repair looks like. Not perfection \u2014 reconnection. The rupture happened, and you came back from it.",
    },
    partner_shuts_down: {
      speaker: 'partner',
      text: "\u201CFine. Whatever.\u201D They go quiet. The evening is cold.",
      emotion: 'shutdown',
      isEnding: true,
      endingType: 'partial',
      insight: "Dismissing vulnerability often leads to stonewalling. When your partner shows you what's underneath, meeting it with empathy is the repair.",
    },
    pursue_withdraw_cycle: {
      speaker: 'narrator',
      text: 'You pursue. They withdraw further. You pursue harder. They go completely silent. The classic pursue-withdraw cycle.',
      emotion: 'stuck',
      isEnding: true,
      endingType: 'unrepaired',
      insight: 'This is the pursue-withdraw cycle from MC1. Pursuing harder when someone shuts down pushes them further away. The repair is to STOP and SOFTEN.',
    },
    slow_repair: {
      speaker: 'partner',
      text: "After a moment, the door opens. \u201CI hate when we do this.\u201D A pause. \u201CMe too.\u201D You sit together quietly. No perfect words \u2014 just presence.",
      emotion: 'reconnecting',
      isEnding: true,
      endingType: 'repaired',
      insight: "Sometimes repair is not a conversation. It's a willingness to come back. The knock on the door IS the repair attempt.",
    },
  },
};

const REPAIR_STEPS = [
  { step: 1, text: "\u201CI want to understand what happened between us.\u201D" },
  { step: 2, text: "\u201CHere is how I experienced it: ___\u201D" },
  { step: 3, text: "\u201CWhat I think I did that didn't help: ___\u201D" },
  { step: 4, text: "\u201CWhat I needed from you was: ___\u201D" },
  { step: 5, text: "\u201CWhat can we do differently next time?\u201D" },
];

export function L3RepairScenario({ content, attachmentStyle, onComplete }: L3RepairScenarioProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<Array<{
    nodeId: string;
    choiceId?: string;
    isRepairAttempt?: boolean;
  }>>([]);
  const [dialogueLog, setDialogueLog] = useState<Array<{
    speaker: string;
    text: string;
    emotion?: string;
    isChoice?: boolean;
    isRepairAttempt?: boolean;
  }>>([]);
  const [revealedSteps, setRevealedSteps] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentNode = REPAIR_SCENARIO.nodes[currentNodeId];

  const makeChoice = useCallback((choice: {
    id: string;
    text: string;
    label: string;
    isRepairAttempt: boolean;
    nextNode: string;
  }) => {
    haptics.tap();

    // Add choice to dialogue log
    setDialogueLog(prev => [
      ...prev,
      {
        speaker: 'you',
        text: choice.text,
        isChoice: true,
        isRepairAttempt: choice.isRepairAttempt,
      },
    ]);

    // Track history
    setHistory(prev => [
      ...prev,
      {
        nodeId: currentNodeId,
        choiceId: choice.id,
        isRepairAttempt: choice.isRepairAttempt,
      },
    ]);

    if (choice.isRepairAttempt) {
      haptics.playConfetti();
    }

    // Advance to next node
    setTimeout(() => {
      const nextNode = REPAIR_SCENARIO.nodes[choice.nextNode];
      setCurrentNodeId(choice.nextNode);

      // Add next node's text to dialogue
      setDialogueLog(prev => [
        ...prev,
        {
          speaker: nextNode.speaker,
          text: nextNode.text,
          emotion: nextNode.emotion,
        },
      ]);

      // Check if ending
      if (nextNode.isEnding) {
        setTimeout(() => {
          setPhase('insight');
          fadeAnim.setValue(0);
          Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
        }, 1500);
      }

      // Scroll to bottom
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }, MC3_TIMING.scenarioBranch);
  }, [currentNodeId, haptics, fadeAnim]);

  const handleComplete = useCallback(() => {
    haptics.playConfetti();
    const repairCount = history.filter(h => h.isRepairAttempt).length;
    const endingNode = REPAIR_SCENARIO.nodes[currentNodeId];

    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Repair Scenario',
        response: JSON.stringify({
          choicesMade: history.map(h => ({
            nodeId: h.nodeId,
            choiceId: h.choiceId || '',
            isRepairAttempt: h.isRepairAttempt || false,
          })),
          endingType: endingNode.endingType || 'unknown',
          repairAttemptsMade: repairCount,
        }),
        type: 'interactive',
      },
    ];
    onComplete(responses);
  }, [history, currentNodeId, haptics, onComplete]);

  // ─── Intro Phase ───────────────────────────────

  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.introContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>THE SCENARIO</Text>
        <Text style={styles.subtitle}>
          A conflict is about to unfold. At each decision point, choose how to respond.
          Watch what happens next.
        </Text>

        <View style={styles.setupCard}>
          <Text style={styles.setupTitle}>THE SETUP</Text>
          <Text style={styles.setupText}>{REPAIR_SCENARIO.setup}</Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            haptics.tap();
            setPhase('scenario');
            const startNode = REPAIR_SCENARIO.nodes.start;
            setDialogueLog([{
              speaker: startNode.speaker,
              text: startNode.text,
              emotion: startNode.emotion,
            }]);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>BEGIN</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Insight Phase ─────────────────────────────

  if (phase === 'insight') {
    const endingNode = REPAIR_SCENARIO.nodes[currentNodeId];
    const isRepaired = endingNode.endingType === 'repaired';

    return (
      <Animated.View style={[styles.insightContainer, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.insightContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            {isRepaired ? 'REPAIR ACHIEVED' : 'WHAT HAPPENED'}
          </Text>

          <View style={[
            styles.insightCard,
            isRepaired ? styles.insightCardSuccess : styles.insightCardWarning,
          ]}>
            <Text style={styles.insightText}>{endingNode.insight}</Text>
          </View>

          {/* Choice summary */}
          <View style={styles.choiceSummary}>
            <Text style={styles.summaryTitle}>YOUR PATH</Text>
            {history.map((h, idx) => (
              <View key={idx} style={styles.summaryRow}>
                <View style={[
                  styles.summaryDot,
                  h.isRepairAttempt ? styles.summaryDotRepair : styles.summaryDotConflict,
                ]} />
                <Text style={styles.summaryText}>
                  {h.isRepairAttempt ? '\u2727 Repair attempt' : '\u2192 Escalation/avoidance'}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              haptics.tap();
              setPhase('template');
              fadeAnim.setValue(0);
              Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>LEARN THE TEMPLATE</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Template Phase ────────────────────────────

  if (phase === 'template') {
    return (
      <Animated.View style={[styles.templateContainer, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.templateContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>THE REPAIR TEMPLATE</Text>
          <Text style={styles.subtitle}>
            Tap to reveal each step of a repair conversation
          </Text>

          {REPAIR_STEPS.map((step, idx) => (
            <View
              key={step.step}
              style={[
                styles.templateStep,
                idx >= revealedSteps && styles.templateStepHidden,
              ]}
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.step}</Text>
              </View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (revealedSteps < REPAIR_STEPS.length) {
                haptics.tap();
                setRevealedSteps(revealedSteps + 1);
              } else {
                handleComplete();
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>
              {revealedSteps < REPAIR_STEPS.length ? 'REVEAL NEXT STEP' : 'CONTINUE'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Scenario Phase ────────────────────────────

  return (
    <View style={styles.scenarioContainer}>
      <ScrollView
        ref={scrollRef}
        style={styles.dialogueScroll}
        contentContainerStyle={styles.dialogueContent}
        showsVerticalScrollIndicator={false}
      >
        {dialogueLog.map((entry, idx) => (
          <View
            key={idx}
            style={[
              styles.dialogueBubble,
              entry.speaker === 'you' && styles.dialogueBubbleYou,
              entry.speaker === 'partner' && styles.dialogueBubblePartner,
              entry.speaker === 'narrator' && styles.dialogueBubbleNarrator,
              entry.isRepairAttempt && styles.dialogueBubbleRepair,
            ]}
          >
            {entry.speaker !== 'narrator' && (
              <Text style={styles.speakerLabel}>
                {entry.speaker === 'you' ? 'YOU' : 'PARTNER'}
              </Text>
            )}
            <Text style={[
              styles.dialogueText,
              entry.speaker === 'narrator' && styles.narratorText,
            ]}>
              {entry.text}
            </Text>
            {entry.isRepairAttempt && (
              <View style={styles.repairBadge}>
                <Text style={styles.repairBadgeText}>{'\u2727'} Repair Attempt</Text>
              </View>
            )}
            {entry.emotion && entry.speaker === 'partner' && (
              <Text style={styles.emotionTag}>
                Partner feels: {entry.emotion}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Choices */}
      {currentNode.choices && !currentNode.isEnding && (
        <View style={styles.choicesContainer}>
          <Text style={styles.chooseLabel}>HOW DO YOU RESPOND?</Text>
          {currentNode.choices.map(choice => (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choiceButton,
                choice.isRepairAttempt && styles.choiceButtonRepair,
              ]}
              onPress={() => makeChoice(choice)}
              activeOpacity={0.7}
            >
              <Text style={styles.choiceText}>{choice.text}</Text>
              <Text style={styles.choiceLabel}>{choice.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  introContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 3,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  setupCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: '100%',
    ...Shadows.subtle,
  },
  setupTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  setupText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // ─── Scenario ──────────────────────
  scenarioContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  dialogueScroll: {
    flex: 1,
  },
  dialogueContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  dialogueBubble: {
    marginBottom: Spacing.sm,
    padding: 14,
    borderRadius: 16,
    maxWidth: '85%',
  },
  dialogueBubbleYou: {
    backgroundColor: MC3_PALETTE.amber,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  dialogueBubblePartner: {
    backgroundColor: Colors.surfaceElevated,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dialogueBubbleNarrator: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    maxWidth: '90%',
  },
  dialogueBubbleRepair: {
    borderWidth: 2,
    borderColor: MC3_PALETTE.gold,
  },
  speakerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(0,0,0,0.4)',
    marginBottom: 4,
  },
  dialogueText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
  },
  narratorText: {
    fontStyle: 'italic',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  repairBadge: {
    marginTop: 6,
    backgroundColor: MC3_PALETTE.gold,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  repairBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  emotionTag: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
  },
  choicesContainer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.surfaceElevated,
  },
  chooseLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  choiceButton: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: 14,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  choiceButtonRepair: {
    borderColor: MC3_PALETTE.gold,
    borderWidth: 1.5,
  },
  choiceText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  choiceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },

  // ─── Insight ───────────────────────
  insightContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  insightContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  insightCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderLeftWidth: 4,
    ...Shadows.subtle,
  },
  insightCardSuccess: {
    borderLeftColor: MC3_PALETTE.repairGreen,
  },
  insightCardWarning: {
    borderLeftColor: MC3_PALETTE.warmCoral,
  },
  insightText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
  },
  choiceSummary: {
    marginTop: Spacing.lg,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  summaryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  summaryDotRepair: {
    backgroundColor: MC3_PALETTE.gold,
  },
  summaryDotConflict: {
    backgroundColor: MC3_PALETTE.warmCoral,
  },
  summaryText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
  },

  // ─── Template ──────────────────────
  templateContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  templateContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  templateStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    width: '100%',
  },
  templateStepHidden: {
    opacity: 0.15,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: MC3_PALETTE.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  stepText: {
    flex: 1,
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
