/**
 * trigger-sequences.ts — Trigger → Response → Escalation chain prediction.
 *
 * Models the full cascade: trigger → internal response → behavioral response
 * → partner impact → escalation.
 *
 * Based on cross-assessment data (attachment style + conflict style + personality
 * + differentiation).
 */

import type { ECRRScores, DUTCHScores, IPIPScores, DSIRScores } from '@/types';

// ─── Types ────────────────────────────────────────────

export type TriggerStage =
  | 'trigger'
  | 'internal_response'
  | 'behavioral_response'
  | 'partner_impact'
  | 'escalation';

export interface TriggerStep {
  stage: TriggerStage;
  description: string;
  dataSource: string;
  alternative?: string; // "what you could do differently at this stage"
}

export interface TriggerSequence {
  id: string;
  label: string;
  summary: string;
  steps: TriggerStep[];
}

// ─── Prediction Engine ────────────────────────────────

/**
 * Predict the primary trigger sequence based on assessment data.
 * Returns 1-2 sequences (primary and optional secondary).
 */
export function predictTriggerSequences(
  ecrr: ECRRScores,
  dutch: DUTCHScores,
  ipip: IPIPScores,
  dsir: DSIRScores
): TriggerSequence[] {
  const sequences: TriggerSequence[] = [];
  const anxiety = ecrr.anxietyScore;
  const avoidance = ecrr.avoidanceScore;
  const primaryConflict = dutch.primaryStyle;
  const neuro = ipip.domainPercentiles.neuroticism;
  const iPosition = dsir.subscaleScores.iPosition?.normalized ?? 50;
  const fusionScore = dsir.subscaleScores.fusionWithOthers?.normalized ?? 50;

  // ── Pattern 1: Anxious + Yielding = Invisible Pursuit ──
  if (anxiety > 4.0 && (primaryConflict === 'yielding' || primaryConflict === 'compromising')) {
    sequences.push({
      id: 'anxious_yielding',
      label: 'The Invisible Pursuit',
      summary: 'You accommodate harder when threatened, making your pursuit invisible to your partner',
      steps: [
        {
          stage: 'trigger',
          description: 'Partner becomes distracted, distant, or preoccupied',
          dataSource: 'ECR-R anxiety pattern',
          alternative: 'Name the feeling before acting: "I notice I\'m feeling anxious about the distance"',
        },
        {
          stage: 'internal_response',
          description: 'Anxiety activates — "Something is wrong, they\'re pulling away"',
          dataSource: `ECR-R anxiety (${anxiety.toFixed(1)}/7)${neuro > 65 ? ' amplified by high sensitivity' : ''}`,
          alternative: 'Ground yourself: 90-second body scan before responding',
        },
        {
          stage: 'behavioral_response',
          description: 'You accommodate harder — doing more, being more available, suppressing your own needs',
          dataSource: `DUTCH ${primaryConflict} style${iPosition < 45 ? ' + low I-position' : ''}`,
          alternative: 'Practice one honest statement about what YOU need',
        },
        {
          stage: 'partner_impact',
          description: 'Partner doesn\'t notice because the accommodation is invisible — or feels vaguely suffocated',
          dataSource: 'Negative cycle model',
          alternative: 'Make your needs visible: "I would love some reassurance right now"',
        },
        {
          stage: 'escalation',
          description: 'Resentment accumulates until eruption — "I do everything and you don\'t even see it"',
          dataSource: 'Values gap (honesty) + low I-position',
          alternative: 'Set a check-in ritual: weekly 10-minute needs conversation',
        },
      ],
    });
  }

  // ── Pattern 2: Anxious + High Neuroticism = The Flooding Cascade ──
  if (anxiety > 4.0 && neuro > 70) {
    sequences.push({
      id: 'anxious_flooding',
      label: 'The Flooding Cascade',
      summary: 'Perceived distance triggers rapid emotional escalation that overwhelms your window',
      steps: [
        {
          stage: 'trigger',
          description: 'Ambiguous signal — a short text, a delayed response, a distracted look',
          dataSource: `ECR-R anxiety (${anxiety.toFixed(1)}/7)`,
          alternative: 'Write down the FACT separate from the INTERPRETATION',
        },
        {
          stage: 'internal_response',
          description: 'Full nervous system activation within seconds — catastrophic interpretation',
          dataSource: `IPIP Neuroticism (${neuro}th percentile)`,
          alternative: 'The 5-4-3-2-1 grounding technique before any response',
        },
        {
          stage: 'behavioral_response',
          description: 'Multiple texts, calls, or tearful confrontation demanding immediate resolution',
          dataSource: 'Attachment pursuit pattern',
          alternative: 'Set a 20-minute wait rule before initiating repair',
        },
        {
          stage: 'partner_impact',
          description: 'Partner feels overwhelmed, may withdraw further — confirming the threat',
          dataSource: 'Pursue-withdraw cycle',
          alternative: 'Name the cycle out loud: "I think we\'re doing our thing again"',
        },
        {
          stage: 'escalation',
          description: 'The withdrawal confirms the fear, intensifying the pursuit — feedback loop',
          dataSource: 'Cycle escalation pattern',
          alternative: 'Pre-agreed signal for "I need a break but I\'m coming back"',
        },
      ],
    });
  }

  // ── Pattern 3: Avoidant + Avoiding Conflict = The Slow Freeze ──
  if (avoidance > 3.5 && (primaryConflict === 'avoiding' || primaryConflict === 'yielding')) {
    sequences.push({
      id: 'avoidant_freeze',
      label: 'The Slow Freeze',
      summary: 'Emotional demands trigger progressive withdrawal until your partner escalates',
      steps: [
        {
          stage: 'trigger',
          description: 'Partner raises an emotional topic or expresses a need for closeness',
          dataSource: `ECR-R avoidance (${avoidance.toFixed(1)}/7)`,
          alternative: 'Notice the urge to withdraw — just notice it, don\'t act yet',
        },
        {
          stage: 'internal_response',
          description: 'Internal shutdown — feeling overwhelmed, need space, "I can\'t deal with this right now"',
          dataSource: `DSI-R cutoff pattern${fusionScore < 40 ? ' + fusion anxiety' : ''}`,
          alternative: 'Say "I need a moment but I want to come back to this" instead of just leaving',
        },
        {
          stage: 'behavioral_response',
          description: 'Deflect, change subject, get busy with tasks, or physically leave the room',
          dataSource: `DUTCH ${primaryConflict} style`,
          alternative: 'Stay 10% longer than comfortable — stretch the window gradually',
        },
        {
          stage: 'partner_impact',
          description: 'Partner feels invisible, unimportant — their needs seem less important than your comfort',
          dataSource: 'Pursue-withdraw cycle',
          alternative: 'Schedule a time to return: "Can we talk about this at 8pm?"',
        },
        {
          stage: 'escalation',
          description: 'Partner eventually pursues harder or gives up — either way, distance grows',
          dataSource: 'Negative cycle prediction',
          alternative: 'Initiate first: bring the topic up before they have to',
        },
      ],
    });
  }

  // ── Pattern 4: Fearful + Mixed Conflict = The Push-Pull ──
  if (anxiety > 3.5 && avoidance > 3.5) {
    sequences.push({
      id: 'fearful_push_pull',
      label: 'The Push-Pull',
      summary: 'You oscillate between reaching for and pushing away, confusing both yourself and your partner',
      steps: [
        {
          stage: 'trigger',
          description: 'Any intense emotional moment — positive or negative — activates both systems',
          dataSource: `ECR-R anxiety (${anxiety.toFixed(1)}) + avoidance (${avoidance.toFixed(1)})`,
          alternative: 'Name it: "I notice I want to come close AND pull away right now"',
        },
        {
          stage: 'internal_response',
          description: 'Simultaneous craving for connection and terror of vulnerability',
          dataSource: 'Fearful-avoidant pattern',
          alternative: 'Choose ONE: approach or pause. Don\'t do both in the same moment',
        },
        {
          stage: 'behavioral_response',
          description: 'Rapid switching — intense closeness followed by sudden distance, or vice versa',
          dataSource: `Mixed conflict styles: ${primaryConflict}`,
          alternative: 'Signal: "I\'m in my push-pull right now — give me 5 minutes"',
        },
        {
          stage: 'partner_impact',
          description: 'Partner feels confused, off-balance — never sure which version of you is showing up',
          dataSource: 'Partner experience model',
          alternative: 'Create consistency in small ways: same morning greeting, same bedtime ritual',
        },
        {
          stage: 'escalation',
          description: 'Partner learns to distrust your closeness, creating the very rejection you feared',
          dataSource: 'Self-fulfilling prophecy pattern',
          alternative: 'Window of tolerance work first — expand your capacity to hold ambivalence',
        },
      ],
    });
  }

  // Return top 2
  return sequences.slice(0, 2);
}
