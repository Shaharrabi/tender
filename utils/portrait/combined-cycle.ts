/**
 * Combined Cycle Detection + Cascade Builder
 *
 * Takes two individual portraits and determines the couple's
 * combined negative cycle — how their protective patterns interlock.
 *
 * Grounded in EFT (Sue Johnson), Gottman, Polyvagal, and PACT.
 */

import type { IndividualPortrait, CyclePosition } from '@/types/portrait';
import type {
  CombinedCycle,
  CycleDynamic,
  CombinedTriggerStep,
  ExitPoint,
  RepairStep,
  RDASScores,
  DCIScores,
  CSI16Scores,
} from '@/types/couples';

interface DyadicScoreSet {
  rdas?: { partnerA: RDASScores; partnerB: RDASScores };
  dci?: { partnerA: DCIScores; partnerB: DCIScores };
  csi16?: { partnerA: CSI16Scores; partnerB: CSI16Scores };
}

/** Infer attachment style from protectiveStrategy text */
function inferPosition(portrait: IndividualPortrait): CyclePosition {
  if (portrait.negativeCycle?.position) return portrait.negativeCycle.position;
  const strategy = portrait.fourLens?.attachment?.protectiveStrategy?.toLowerCase() || '';
  if (strategy.includes('pursue') || strategy.includes('protest') || strategy.includes('reassurance'))
    return 'pursuer';
  if (strategy.includes('withdraw') || strategy.includes('self-relian') || strategy.includes('minimize'))
    return 'withdrawer';
  if (strategy.includes('oscillat') || strategy.includes('push-pull'))
    return 'mixed';
  return 'flexible';
}

/** Determine the combined dynamic type */
function determineDynamic(posA: CyclePosition, posB: CyclePosition): CycleDynamic {
  if ((posA === 'pursuer' && posB === 'withdrawer') ||
      (posA === 'withdrawer' && posB === 'pursuer'))
    return 'pursue-withdraw';
  if (posA === 'pursuer' && posB === 'pursuer')
    return 'mutual-pursuit';
  if (posA === 'withdrawer' && posB === 'withdrawer')
    return 'mutual-withdrawal';
  return 'mixed-switching';
}

/** Generate the interlock narrative based on dynamic type */
function generateInterlockNarrative(
  dynamic: CycleDynamic,
  posA: CyclePosition,
  posB: CyclePosition,
): string {
  switch (dynamic) {
    case 'pursue-withdraw': {
      const pursuer = posA === 'pursuer' ? 'Partner A' : 'Partner B';
      const withdrawer = posA === 'pursuer' ? 'Partner B' : 'Partner A';
      return `When stress enters the space between you, ${pursuer} moves toward — seeking, checking, reaching for reassurance. ${withdrawer} moves away — needing space, going internal, shutting down. The more one reaches, the more the other retreats. This is the most common couple pattern in attachment research, and it is also the most treatable — because once both partners see the pattern, they can interrupt it together.`;
    }
    case 'mutual-pursuit':
      return 'You are both wired to move toward when threatened — to seek, to press, to escalate until heard. When both partners pursue simultaneously, the emotional intensity can overwhelm the relational container. Think of it as two people running toward each other at full speed — the collision is louder than either intended. The practice here is taking turns: one pursues while the other holds steady.';
    case 'mutual-withdrawal':
      return 'You both tend to move away when stressed — creating silence where connection used to be. Neither is reaching, so the gap between you grows quietly, almost invisibly. The relationship may function smoothly on the surface, but underneath, both of you may be longing for someone to break the pattern first. The practice is gentle initiation — small bids for connection from either side.';
    case 'mixed-switching':
      return 'Your dance shifts depending on the situation — sometimes one of you pursues while the other withdraws, and sometimes it reverses. This flexibility means you have more range than couples locked in a single pattern. The challenge is that the unpredictability itself can be disorienting. The practice is naming what position you are in, right now, out loud.';
  }
}

/** Build the combined trigger cascade */
function buildTriggerCascade(
  dynamic: CycleDynamic,
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  posA: CyclePosition,
): CombinedTriggerStep[] {
  const isPursuer = posA === 'pursuer';

  if (dynamic === 'pursue-withdraw') {
    return [
      {
        stage: 'trigger',
        partnerA: {
          action: isPursuer
            ? 'Senses the gap instantly. Anxiety rises. "Something is wrong between us."'
            : 'Does not register the gap yet — or experiences it as normal space, not disconnection.',
          internal: isPursuer
            ? 'Attachment system activates — scanning for signs of rejection or distance'
            : 'Nervous system stays in baseline — the gap feels like ordinary separateness',
          dataSource: 'ECR-R attachment anxiety/avoidance',
        },
        partnerB: {
          action: isPursuer
            ? 'Does not register the gap yet — or experiences it as normal space, not disconnection.'
            : 'Senses the gap instantly. Anxiety rises. "Something is wrong between us."',
          internal: isPursuer
            ? 'Nervous system stays in baseline — the gap feels like ordinary separateness'
            : 'Attachment system activates — scanning for signs of rejection or distance',
          dataSource: 'ECR-R attachment anxiety/avoidance',
        },
        fieldState: 'The field shifts — one feels it before the other',
      },
      {
        stage: 'first_moves',
        partnerA: {
          action: isPursuer
            ? 'Seeks reassurance. Starts talking. Asks "are we okay?" Accommodates harder — doing more, being more available.'
            : 'Feels the approach as pressure. Needs space to process. Gives shorter answers. Attention drifts.',
          internal: isPursuer
            ? 'Fear of abandonment driving the reach — "If I can just connect, I will feel safe"'
            : 'Fear of overwhelm or failure — "I cannot handle this intensity right now"',
          dataSource: 'ECR-R + DUTCH conflict style',
        },
        partnerB: {
          action: isPursuer
            ? 'Feels the approach as pressure. Needs space to process. Gives shorter answers. Attention drifts.'
            : 'Seeks reassurance. Starts talking. Asks "are we okay?" Accommodates harder.',
          internal: isPursuer
            ? 'Fear of overwhelm or failure — "I cannot handle this intensity right now"'
            : 'Fear of abandonment driving the reach — "If I can just connect, I will feel safe"',
          dataSource: 'ECR-R + DUTCH conflict style',
        },
        fieldState: 'Urgency meets the need for space — both feel more alone',
      },
      {
        stage: 'escalation',
        partnerA: {
          action: isPursuer
            ? 'Frustration leaks through. More questions, more seeking. May become critical. The suppressed needs erupt.'
            : 'Retreats further. Shorter answers, silence, distraction, leaves the room. May shut down completely.',
          internal: isPursuer
            ? 'Secondary emotion (anger, criticism) covers primary emotion (fear, longing)'
            : 'Dorsal vagal activation — system shutting down to manage overwhelm',
          dataSource: 'SSEIT regulation + DSI-R reactivity',
        },
        partnerB: {
          action: isPursuer
            ? 'Retreats further. Feels blindsided by the eruption. Shuts down or becomes defensive.'
            : 'Frustration leaks through. "I do everything and you do not even see it." The suppressed needs erupt.',
          internal: isPursuer
            ? 'Dorsal vagal activation — system shutting down to manage overwhelm'
            : 'Secondary emotion (anger, criticism) covers primary emotion (fear, longing)',
          dataSource: 'SSEIT regulation + DSI-R reactivity',
        },
        fieldState: 'The gap widens — both are alone in the same room',
      },
      {
        stage: 'aftermath',
        partnerA: {
          action: isPursuer
            ? 'Exhausted. Hurt. Confirmed fear: "They do not really care." Guilt about the eruption.'
            : 'Relieved temporarily, then guilt, then avoidance of the whole topic. "I never know what to say."',
          internal: isPursuer
            ? 'Attachment wound activated — the pattern confirmed the deepest fear'
            : 'Shame and inadequacy — "I failed again to be what they need"',
          dataSource: 'Attachment narrative + values alignment',
        },
        partnerB: {
          action: isPursuer
            ? 'Relieved temporarily, then guilt, then avoidance of the whole topic. "I never know what to say."'
            : 'Exhausted. Hurt. Confirmed fear: "They do not really care."',
          internal: isPursuer
            ? 'Shame and inadequacy — "I failed again to be what they need"'
            : 'Attachment wound activated — the pattern confirmed the deepest fear',
          dataSource: 'Attachment narrative + values alignment',
        },
        fieldState: 'The field freezes. Both waiting for the other to break the silence.',
      },
    ];
  }

  if (dynamic === 'mutual-pursuit') {
    return [
      {
        stage: 'trigger',
        partnerA: {
          action: 'Both sense the disruption simultaneously. Both anxiety systems activate.',
          internal: 'Attachment alarm fires — scanning for threat',
          dataSource: 'ECR-R anxiety scores (both elevated)',
        },
        partnerB: {
          action: 'Both sense the disruption simultaneously. Both anxiety systems activate.',
          internal: 'Attachment alarm fires — scanning for threat',
          dataSource: 'ECR-R anxiety scores (both elevated)',
        },
        fieldState: 'The field becomes electrically charged — both nervous systems on high alert',
      },
      {
        stage: 'first_moves',
        partnerA: {
          action: 'Moves toward with intensity. Presses for answers, seeks clarity, demands attention.',
          internal: 'Need for reassurance is urgent — "We have to fix this NOW"',
          dataSource: 'ECR-R + DUTCH forcing/compromising',
        },
        partnerB: {
          action: 'Also moves toward with intensity. Matches the energy, raises the volume.',
          internal: 'Same urgent need — "Why are you not hearing me?"',
          dataSource: 'ECR-R + DUTCH forcing/compromising',
        },
        fieldState: 'Two forces collide — the intensity overwhelms the container',
      },
      {
        stage: 'escalation',
        partnerA: {
          action: 'Volume and intensity escalate. May become critical or contemptuous.',
          internal: 'Flooded — past the window of tolerance, operating on pure reactivity',
          dataSource: 'SSEIT managing own + DSI-R emotional reactivity',
        },
        partnerB: {
          action: 'Matches the escalation. Neither will back down. Both feel unheard.',
          internal: 'Flooded — past the window of tolerance, operating on pure reactivity',
          dataSource: 'SSEIT managing own + DSI-R emotional reactivity',
        },
        fieldState: 'The field is on fire — neither partner can regulate because both are activated',
      },
      {
        stage: 'aftermath',
        partnerA: {
          action: 'Exhausted. Ashamed of what was said. May apologize immediately but repeat the pattern.',
          internal: 'Deep shame about loss of control — "Why can I not just be calm?"',
          dataSource: 'Values alignment + IPIP neuroticism',
        },
        partnerB: {
          action: 'Exhausted. Also ashamed. Both want repair but neither knows how to start.',
          internal: 'Deep shame about loss of control — "Why can I not just be calm?"',
          dataSource: 'Values alignment + IPIP neuroticism',
        },
        fieldState: 'The fire burns out — both partners in the wreckage, wanting repair but not knowing how to begin',
      },
    ];
  }

  // mutual-withdrawal or mixed-switching
  return [
    {
      stage: 'trigger',
      partnerA: {
        action: 'Something disrupts the connection. Both notice — and both look away.',
        internal: 'Nervous system says "this is dangerous territory — avoid"',
        dataSource: 'ECR-R avoidance + DUTCH avoiding',
      },
      partnerB: {
        action: 'Also notices the disruption but decides it is not worth the risk of engaging.',
        internal: 'Self-protection activates — "If I do not engage, I cannot get hurt"',
        dataSource: 'ECR-R avoidance + DUTCH avoiding',
      },
      fieldState: 'The field goes quiet — a stillness that looks like peace but feels like distance',
    },
    {
      stage: 'first_moves',
      partnerA: {
        action: 'Stays busy. Fills the silence with activity, not conversation.',
        internal: 'Avoidance disguised as productivity — "Everything is fine"',
        dataSource: 'DSI-R emotional cutoff',
      },
      partnerB: {
        action: 'Matches the distance. Also fills the space with independence.',
        internal: 'Relief mixed with loneliness — "At least there is no conflict"',
        dataSource: 'DSI-R emotional cutoff',
      },
      fieldState: 'Two people in the same house living parallel lives',
    },
    {
      stage: 'escalation',
      partnerA: {
        action: 'The distance grows. Days pass without real conversation. Topics become superficial.',
        internal: 'Longing builds underneath the avoidance — but it stays unspoken',
        dataSource: 'IPIP extraversion + agreeableness',
      },
      partnerB: {
        action: 'Accepts the distance as normal. May not even notice how far apart they have drifted.',
        internal: 'Normalization of disconnection — "This is just how relationships are"',
        dataSource: 'IPIP extraversion + agreeableness',
      },
      fieldState: 'The gap between becomes invisible — neither partner is even reaching anymore',
    },
    {
      stage: 'aftermath',
      partnerA: {
        action: 'Eventually a crisis forces engagement — or the relationship slowly withers through neglect.',
        internal: 'Deep loneliness that neither admits to',
        dataSource: 'Values importance vs accordance',
      },
      partnerB: {
        action: 'May feel satisfied on the surface but senses something essential is missing.',
        internal: 'The cost of avoidance: safety without intimacy',
        dataSource: 'Values importance vs accordance',
      },
      fieldState: 'The field is not frozen — it is slowly fading. Connection needs active tending.',
    },
  ];
}

/** Identify exit points where the cycle can be interrupted */
function identifyExitPoints(dynamic: CycleDynamic): ExitPoint[] {
  return [
    {
      stage: 'trigger',
      number: 1,
      forPartnerA: 'I notice I am anxious about us. I am going to name it instead of acting on it.',
      forPartnerB: 'I notice I am wanting to pull away. I am going to stay present for one more minute.',
      forBoth: 'Something shifted between us. Can we name it before it becomes a cycle?',
      modality: 'ACT defusion — holding the story lightly',
    },
    {
      stage: 'first_moves',
      number: 2,
      forPartnerA: dynamic === 'pursue-withdraw'
        ? 'I need connection, but I can ask softly, not urgently.'
        : 'I am going to pause before matching your energy.',
      forPartnerB: dynamic === 'pursue-withdraw'
        ? 'I need space, and I can say "I am coming back" instead of just leaving.'
        : 'I am going to pause before matching your energy.',
      forBoth: 'We are starting our dance. Can we try a different step?',
      modality: 'EFT soft startup + Gottman gentle approach',
    },
    {
      stage: 'escalation',
      number: 3,
      forPartnerA: 'I am outside my window right now. Nothing productive will happen from here.',
      forPartnerB: 'I am outside my window right now. Let us pause and come back.',
      forBoth: 'This is our cycle talking, not us. Can we take 20 minutes and try again?',
      modality: 'DBT distress tolerance + Polyvagal window check',
    },
    {
      stage: 'aftermath',
      number: 4,
      forPartnerA: 'That was our pattern, not us. I want to understand what you were feeling underneath.',
      forPartnerB: 'That was our pattern, not us. Here is what I was really feeling underneath.',
      forBoth: 'Can we do an after-action review? Not to blame, but to understand.',
      modality: 'EFT repair + IFS U-Turn',
    },
  ];
}

/** Build repair pathway based on both partners' strengths */
function buildRepairPathway(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
): RepairStep[] {
  return [
    { step: 1, action: 'Wait until both partners are back inside their window of tolerance (at least 20 minutes)', who: 'both' },
    { step: 2, action: 'The partner who recovers first gently initiates: "I think our dance just happened. Can we talk about it?"', who: 'both' },
    { step: 3, action: 'Take turns sharing the PRIMARY emotion (fear, longing, hurt) — not the secondary emotion (anger, criticism)', who: 'both' },
    { step: 4, action: 'The listener reflects back without defending: "So you were feeling..."', who: 'both' },
    { step: 5, action: 'Name what each person needed but could not ask for', who: 'both' },
    { step: 6, action: 'Identify where you could have exited the cycle — without blame', who: 'both' },
  ];
}

/** Name the gift/strength in this dynamic */
function identifyDynamicStrength(dynamic: CycleDynamic): string {
  switch (dynamic) {
    case 'pursue-withdraw':
      return 'The pursuer keeps the connection alive — ensuring nothing gets swept under the rug. The withdrawer provides stability and groundedness. Together, you have both reach and anchor.';
    case 'mutual-pursuit':
      return 'You both care deeply and passionately. The emotional intensity in your relationship means nothing is superficial — you are fully engaged with each other. That intensity, channeled well, becomes profound intimacy.';
    case 'mutual-withdrawal':
      return 'You both offer each other space and autonomy — a gift many couples struggle to give. Your independence means neither partner feels smothered. The invitation is to add connection to the autonomy you already have.';
    case 'mixed-switching':
      return 'Your flexibility is your strength. You can take different roles depending on what the situation requires. This range means you are not locked in a rigid pattern — you have more options than most couples.';
  }
}

// ─── Main Export ────────────────────────────────────────

export function buildCombinedCycle(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  dyadicScores: DyadicScoreSet,
): CombinedCycle {
  const posA = inferPosition(portraitA);
  const posB = inferPosition(portraitB);
  const dynamic = determineDynamic(posA, posB);

  return {
    dynamic,
    partnerAPosition: posA,
    partnerBPosition: posB,
    interlockDescription: generateInterlockNarrative(dynamic, posA, posB),
    triggerCascade: buildTriggerCascade(dynamic, portraitA, portraitB, posA),
    exitPoints: identifyExitPoints(dynamic),
    repairPathway: buildRepairPathway(portraitA, portraitB),
    strengthInThisDynamic: identifyDynamicStrength(dynamic),
  };
}
