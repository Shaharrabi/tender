/**
 * Adapted 12-Step Content for Support Groups
 *
 * Each of the 12 healing steps has two adaptations:
 * - "The Reach" (anxious) — validation-focused, co-regulation emphasis
 * - "The Retreat" (avoidant) — boundary-focused, structured sharing
 *
 * Same structure as twelve-steps.ts, different therapeutic language.
 */

import type { AdaptedStep, SupportGroupType } from '@/types/support-groups';

// ─── The Reach — Anxious Attachment Adaptations ───────

export const ADAPTED_STEPS_ANXIOUS: AdaptedStep[] = [
  {
    stepNumber: 1,
    standardTitle: 'Acknowledge the Strain',
    adaptedTitle: 'The Reach Is Not the Problem',
    groupFocus:
      'Your reach for connection is not the problem. It is what drives the reach that we are exploring: the alarm underneath, the fear of being left, the story your nervous system tells before your mind catches up.',
    reflectionPrompts: [
      'What does your alarm feel like in your body when you sense distance?',
      'When did you first learn that reaching harder might bring someone back?',
      'Can you separate the healthy desire for closeness from the panic underneath?',
    ],
  },
  {
    stepNumber: 2,
    standardTitle: 'Trust the Relational Field',
    adaptedTitle: 'You Are Not Too Much',
    groupFocus:
      'The story that you are "too much" is not truth — it is a wound speaking. In this group, your intensity is welcome. We are learning to trust that the space between can hold us without disappearing.',
    reflectionPrompts: [
      'When have you been told — directly or indirectly — that you are too much?',
      'What does it feel like when someone stays, even when you expect them to leave?',
      'What would trusting the in-between actually look like in your daily life?',
    ],
  },
  {
    stepNumber: 3,
    standardTitle: 'Release Certainty',
    adaptedTitle: 'Underneath the Reach Is Fear',
    groupFocus:
      'Making contact with what is underneath the reaching. The alarm, the fear of being left, the way your body mobilizes before your mind catches up. This is not weakness — it is your nervous system doing what it learned to do.',
    reflectionPrompts: [
      'Where in your body do you feel the fear of being left?',
      'What is the difference between the alarm and the actual danger?',
      'Can you stay with the feeling for 30 seconds without reaching for reassurance?',
    ],
  },
  {
    stepNumber: 4,
    standardTitle: 'Name the Parts',
    adaptedTitle: 'The Part That Monitors, The Part That Panics',
    groupFocus:
      'Meeting your protector parts — the one that watches for signs of withdrawal, the one that floods with urgency, the one that rehearses the goodbye. These parts kept you safe once. They deserve acknowledgment, not exile.',
    reflectionPrompts: [
      'What does your "monitoring" part look like? What is it scanning for?',
      'What does your "panic" part need you to know?',
      'Can you thank these parts for trying to protect you, even as you learn new ways?',
    ],
  },
  {
    stepNumber: 5,
    standardTitle: 'Share Our Truths',
    adaptedTitle: 'When Closeness First Became Uncertain',
    groupFocus:
      'Witnessing each other is origin stories with safety. When did you first learn that love required vigilance? That closeness could vanish? We share not to fix, but to be seen — and in being seen, to begin healing.',
    reflectionPrompts: [
      'What is your earliest memory of reaching for someone and not being met?',
      'How has that moment shaped the way you love now?',
      'What does it feel like to share this with people who understand?',
    ],
  },
  {
    stepNumber: 6,
    standardTitle: 'Regulate the Body',
    adaptedTitle: 'Grounding Before Reaching',
    groupFocus:
      'Practice: self-soothing when activated. Before you reach for your partner, can you reach for yourself first? Not instead of connection — but before the flood. Grounding is not withdrawal. It is preparation for cleaner connection.',
    reflectionPrompts: [
      'What does it feel like in your body just before you reach?',
      'What is one thing you can do for yourself in that 30-second window before the flood?',
      'How is self-soothing different from the isolation you fear?',
    ],
  },
  {
    stepNumber: 7,
    standardTitle: 'Communicate the Underneath',
    adaptedTitle: "Saying 'I'm Scared' Instead of 'Why Didn't You Call?'",
    groupFocus:
      'Role play: expressing primary emotions. The protest behavior — the accusation, the check-in that is really surveillance, the fight you pick to test if they will stay — is the reach wearing armor. Underneath every "Why didn\'t you?" is an "I\'m scared you won\'t."',
    reflectionPrompts: [
      'What is one protest behavior you recognize in yourself?',
      'What is the primary emotion underneath it?',
      'Can you practice saying the underneath out loud, right now?',
    ],
  },
  {
    stepNumber: 8,
    standardTitle: 'Receive Without Fixing',
    adaptedTitle: "Letting Your Partner's Response Land",
    groupFocus:
      'Practice: receiving without escalating. When your partner does respond, can you let it land? Or does the alarm immediately ask "but is it enough?" Learning to receive is as important as learning to ask.',
    reflectionPrompts: [
      'When your partner reaches back, what happens in your body?',
      'Do you notice a voice that says "but they don\'t really mean it"?',
      'What would it look like to receive a response at face value, just once?',
    ],
  },
  {
    stepNumber: 9,
    standardTitle: 'Repair After Rupture',
    adaptedTitle: 'Coming Back Without the Flood',
    groupFocus:
      'Skill: regulated repair attempts. The flood — the tears, the long texts, the desperate bids — is a repair attempt wearing the clothes of crisis. We practice coming back to the table after a rupture with presence, not panic.',
    reflectionPrompts: [
      'What does your "flood" repair usually look like?',
      'What happens when you repair from a calm place instead?',
      'Can you write a repair script that starts with "I" instead of "You"?',
    ],
  },
  {
    stepNumber: 10,
    standardTitle: 'Build Rituals of Connection',
    adaptedTitle: 'Creating Reliability Your Nervous System Can Trust',
    groupFocus:
      'Design: building consistent connection patterns. Your nervous system does not trust promises — it trusts patterns. We design small, repeatable rituals of connection that give your body evidence that closeness is reliable.',
    reflectionPrompts: [
      'What small daily ritual would give your nervous system evidence of safety?',
      'What is the difference between a ritual and reassurance-seeking?',
      'Can you design one 5-minute ritual you could start this week?',
    ],
  },
  {
    stepNumber: 11,
    standardTitle: 'Expand the Window',
    adaptedTitle: 'Tolerating Uncertainty Without Alarm',
    groupFocus:
      'Challenge: sitting with not-knowing. The hardest practice for the anxious heart — tolerating the gap between a text sent and a text received, between a bid made and a bid met. We practice expanding the window of tolerance for uncertainty.',
    reflectionPrompts: [
      'What is the hardest "not knowing" for you to sit with?',
      'What happens in your body when you resist the urge to check?',
      'Can you give yourself 10 more minutes of uncertainty today than yesterday?',
    ],
  },
  {
    stepNumber: 12,
    standardTitle: 'Carry the Message',
    adaptedTitle: 'Rhythm Over Reassurance',
    groupFocus:
      'Commitment: what will you keep doing? Your warmth, your depth of feeling, your capacity for connection — these are gifts. The work is not to feel less. It is to trust the rhythm of closeness and space, rather than needing constant reassurance that the music is still playing.',
    reflectionPrompts: [
      'What have you learned about yourself in these 12 weeks?',
      'What is one practice you will carry with you?',
      'What would you tell someone just beginning this journey?',
    ],
  },
];

// ─── The Retreat — Avoidant Attachment Adaptations ────

export const ADAPTED_STEPS_AVOIDANT: AdaptedStep[] = [
  {
    stepNumber: 1,
    standardTitle: 'Acknowledge the Strain',
    adaptedTitle: 'See the Wall, Understand Why It Is There',
    groupFocus:
      'The wall you built is not a character flaw. It was once the smartest thing your nervous system could do. We start by seeing the pattern clearly — not to tear the wall down, but to understand what it was protecting you from.',
    reflectionPrompts: [
      'What does your distance protect you from feeling?',
      'When did pulling away first become your go-to response?',
      'Can you see the wall with curiosity instead of judgment?',
    ],
  },
  {
    stepNumber: 2,
    standardTitle: 'Trust the Relational Field',
    adaptedTitle: 'The Retreat Is Not Coldness — It Is Survival',
    groupFocus:
      'The retreat is not coldness — it is survival. Your system learned that needs were dangerous, that closeness came with a cost, that the safest place was inside yourself. We honor that learning while asking: what else might be possible?',
    reflectionPrompts: [
      'When someone says you are "cold" or "distant," what do you actually feel inside?',
      'What would it cost you to need someone? What does your system believe about that cost?',
      'What is one moment when connection did not feel dangerous?',
    ],
  },
  {
    stepNumber: 3,
    standardTitle: 'Release Certainty',
    adaptedTitle: 'What Is Behind the Wall',
    groupFocus:
      'Making contact with what lives behind the shutdown. There is something your system is protecting — a tenderness, a longing, a grief — that the wall keeps out of reach. We do not force it open. We just knock gently.',
    reflectionPrompts: [
      'Where in your body do you feel the pull to disconnect?',
      'If the wall could speak, what would it say it is protecting?',
      'What is one feeling that the shutdown keeps you from reaching?',
    ],
  },
  {
    stepNumber: 4,
    standardTitle: 'Name the Parts',
    adaptedTitle: 'The Part That Intellectualizes, The Part That Numbs',
    groupFocus:
      'Meeting your fortress parts — the one that moves into the head when the heart gets loud, the one that goes blank when feelings arrive, the one that finds a project instead of a conversation. These parts are skilled. They deserve acknowledgment.',
    reflectionPrompts: [
      'What does your "intellectualizer" look like? When does it take over?',
      'What does your "numbing" part need you to know?',
      'Can you thank these parts for their service, even as you explore alternatives?',
    ],
  },
  {
    stepNumber: 5,
    standardTitle: 'Share Our Truths',
    adaptedTitle: 'When Needs First Became Dangerous',
    groupFocus:
      'Small, structured sharing. When did you first learn that having needs was a liability? That asking for comfort made things worse? We share in small doses — timed, boundaried, with the explicit permission to stop.',
    reflectionPrompts: [
      'What is your earliest memory of learning that needs were not welcome?',
      'How has that moment shaped the way you handle closeness now?',
      'Can you share one sentence about this, and notice what happens in your body?',
    ],
  },
  {
    stepNumber: 6,
    standardTitle: 'Regulate the Body',
    adaptedTitle: 'Noticing Before You Are Already Gone',
    groupFocus:
      'Practice: catching the withdrawal earlier. By the time you realize you have shut down, the shutdown is complete. We practice noticing the first whisper of overwhelm — the tightening, the mental drift, the sudden tiredness — and naming it before the wall goes up.',
    reflectionPrompts: [
      'What is the first physical sign that you are beginning to withdraw?',
      'What is happening around you when that sign appears?',
      'What would it look like to say "I am starting to shut down" before you disappear?',
    ],
  },
  {
    stepNumber: 7,
    standardTitle: 'Communicate the Underneath',
    adaptedTitle: "Saying 'I Need Space' Instead of Disappearing",
    groupFocus:
      'Role play: naming needs before shutting down. The disappearance — the sudden silence, the emotional exit, the busy schedule that is really a bunker — is the retreat wearing no clothes at all. Underneath every vanishing act is an "I am overwhelmed and I do not know how to say it."',
    reflectionPrompts: [
      'What is one way you disappear without announcing it?',
      'What would it feel like to say "I need 20 minutes" instead of just going quiet?',
      'Can you practice requesting space out loud, right now?',
    ],
  },
  {
    stepNumber: 8,
    standardTitle: 'Allow Closeness',
    adaptedTitle: 'Letting Someone In Without Drowning',
    groupFocus:
      'Practice: small, timed vulnerability. Closeness does not have to mean engulfment. We practice letting someone in for five minutes, then ten, then fifteen — with the door handle always in your hand. You can leave. The practice is that you do not have to.',
    reflectionPrompts: [
      'What does "letting someone in" physically feel like to you?',
      'What would "timed vulnerability" look like — closeness with a clear exit?',
      'Can you try five minutes of deliberate openness this week and notice what happens?',
    ],
  },
  {
    stepNumber: 9,
    standardTitle: 'Repair After Rupture',
    adaptedTitle: 'Coming Back When You Have Pulled Away',
    groupFocus:
      'Skill: re-engagement after withdrawal. The hardest part is not the pulling away — it is the coming back. We practice returning to the table after distance, not with a grand gesture, but with a quiet "I am here again."',
    reflectionPrompts: [
      'What makes coming back after withdrawal so difficult?',
      'What does your partner need to hear when you return?',
      'Can you write a simple re-engagement script: "I pulled away. I am back. Here is what happened."?',
    ],
  },
  {
    stepNumber: 10,
    standardTitle: 'Build Rituals of Connection',
    adaptedTitle: 'Structured Closeness Your System Can Handle',
    groupFocus:
      'Design: building connection with clear boundaries. Your system needs to know that closeness has edges — that it will not consume you. We design structured rituals of connection with built-in breathing room.',
    reflectionPrompts: [
      'What kind of closeness feels manageable to your system?',
      'Can you design a daily ritual that is close but boundaried — with a clear beginning and end?',
      'What is the difference between structured connection and controlled connection?',
    ],
  },
  {
    stepNumber: 11,
    standardTitle: 'Expand the Window',
    adaptedTitle: 'Staying Present When It Gets Intense',
    groupFocus:
      'Challenge: increasing tolerance for emotional proximity. The hardest practice for the avoidant heart — staying in the room when feelings get loud, in yours or in theirs. We practice staying 10% longer than comfortable.',
    reflectionPrompts: [
      'What is the moment when you typically leave — emotionally or physically?',
      'What would staying 10% longer actually look like?',
      'What happens in your body when you resist the urge to exit?',
    ],
  },
  {
    stepNumber: 12,
    standardTitle: 'Carry the Message',
    adaptedTitle: 'Small Windows, Kept Open',
    groupFocus:
      'Commitment: what will you keep practicing? Your steadiness, your reliability, your capacity for calm — these are gifts. The work is not to feel more. It is to keep the window open a little longer each day, trusting that the air will not overwhelm you.',
    reflectionPrompts: [
      'What have you learned about yourself in these 12 weeks?',
      'What is one practice you will carry with you?',
      'What would you tell someone just beginning this journey?',
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────

/** Get all adapted steps for a group type. */
export function getAdaptedSteps(groupType: SupportGroupType): AdaptedStep[] {
  return groupType === 'anxious' ? ADAPTED_STEPS_ANXIOUS : ADAPTED_STEPS_AVOIDANT;
}

/** Get a specific adapted step by number. */
export function getAdaptedStep(
  groupType: SupportGroupType,
  stepNumber: number,
): AdaptedStep | undefined {
  return getAdaptedSteps(groupType).find((s) => s.stepNumber === stepNumber);
}
