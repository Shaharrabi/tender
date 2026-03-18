/**
 * Modality Content Seed — V2.1b
 *
 * Initial content entries for 4 patterns × 2-4 modalities each.
 * This is the clinical writing that powers the modality routing engine.
 */

import { MODALITY_CONTENT, type ModalityContentEntry } from './modality-content';

const SEED: ModalityContentEntry[] = [
  // ═══════════════════════════════════════════════════════════
  // EMPATHIC ENMESHMENT — 4 modalities at high severity
  // ═══════════════════════════════════════════════════════════
  {
    patternId: 'empathic_enmeshment',
    modalityId: 'ifs',
    severity: 'high',
    content: {
      insight:
        'A part of you learned early that feeling everything your partner feels was the price of love. ' +
        'This Empath Part absorbed others\' pain as a way to stay connected — if I carry your suffering, you won\'t leave. ' +
        'The exile underneath holds the belief: "If I stop feeling your feelings, I\'ll be alone." ' +
        'That\'s the part that needs to hear: your love doesn\'t require you to disappear.',
      bodyCheck:
        'Where do you hold your partner\'s emotions in your body? That heaviness in your chest — is it yours, or did you absorb it?',
      practice:
        'This week, before each conversation with your partner, put your hand on your chest and ask: ' +
        '"What am I feeling that\'s mine right now?" Write it down. Then ask: "What am I carrying that\'s theirs?" ' +
        'Write that separately. The act of sorting is the beginning of differentiation.',
      quote: 'The goal is not to stop feeling. The goal is to feel deeply from a place of Self, not from a place of fusion.',
      quoteAttribution: 'Richard Schwartz',
    },
  },
  {
    patternId: 'empathic_enmeshment',
    modalityId: 'dbt',
    severity: 'high',
    content: {
      insight:
        'Your emotional system doesn\'t have a clear boundary between "mine" and "theirs." ' +
        'When your partner is distressed, your nervous system activates as if YOU are in distress. ' +
        'This is empathic flooding — and it\'s the reason you can\'t help your partner regulate, ' +
        'because you need regulation yourself first.',
      bodyCheck:
        'Right now, scan your body. Is there any tension or discomfort that isn\'t about YOUR day but about something your partner is carrying?',
      practice:
        'Practice the STOP skill specifically for empathic flooding: Stop what you\'re doing. Take a breath. ' +
        'Observe: "Is this feeling mine or am I absorbing theirs?" Proceed: if it\'s theirs, name it out loud — ' +
        '"I notice I\'m picking up your stress" — and consciously set it down.',
      quote: 'You can\'t pour from an empty cup — but more importantly, you can\'t pour from a cup that\'s full of someone else\'s water.',
      quoteAttribution: 'adapted from Marsha Linehan',
    },
  },
  {
    patternId: 'empathic_enmeshment',
    modalityId: 'ecopsychology',
    severity: 'high',
    content: {
      insight:
        'In the ecology of your relationship, you\'ve become the soil — absorbing everything that falls, ' +
        'holding every root, supporting every growing thing. But soil that takes in everything without rest ' +
        'becomes depleted. Even the earth has seasons of lying fallow. Your enmeshment isn\'t weakness — ' +
        'it\'s an ecosystem out of balance.',
      bodyCheck:
        'Go outside. Put your bare feet on the ground. Notice: the earth holds you without absorbing you. ' +
        'That\'s the boundary you\'re learning.',
      practice:
        'Spend 10 minutes this week in nature, alone. Not thinking about your relationship. Just being a body ' +
        'in a landscape. Notice how the trees around you exist fully without merging into each other. ' +
        'They share root systems AND maintain their own trunk. That\'s differentiation in nature.',
      quote: 'We are not separate from the world. But we are distinct within it.',
      quoteAttribution: 'Bill Plotkin',
    },
  },
  {
    patternId: 'empathic_enmeshment',
    modalityId: 'polyvagal',
    severity: 'high',
    content: {
      insight:
        'Your ventral vagal system — the part that enables safe connection — gets hijacked by your partner\'s ' +
        'distress signals. Your body reads their dysregulation as YOUR emergency. This is neuroception at work: ' +
        'your nervous system can\'t distinguish between "my partner is upset" and "I am in danger."',
      bodyCheck:
        'When your partner is upset, notice what happens in your chest and belly within the first 5 seconds. ' +
        'That\'s your nervous system mirroring theirs.',
      practice:
        'Before entering a conversation where your partner is distressed, spend 30 seconds with one hand on your ' +
        'heart and one on your belly. Breathe until you feel YOUR baseline — not theirs. ' +
        'Then enter the conversation from YOUR nervous system, not a mirror of theirs.',
      quote: 'Co-regulation is not absorbing another\'s state. It is offering your regulated presence as an anchor.',
      quoteAttribution: 'Deb Dana',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // EMPATHIC DISCONNECTION — 3 modalities at high severity
  // ═══════════════════════════════════════════════════════════
  {
    patternId: 'empathic_disconnection',
    modalityId: 'attachment',
    severity: 'high',
    content: {
      insight:
        'Your emotional cutoff is a deactivating strategy — your attachment system learned that ' +
        'feeling others\' emotions was dangerous, so it shut down the channel. This kept you safe once. ' +
        'Now it keeps your partner feeling invisible.',
      bodyCheck:
        'When your partner shares something emotional, notice what happens in your body. Do you go still? ' +
        'Numb? Does your mind start problem-solving? That\'s the cutoff activating.',
      practice:
        'This week, when your partner shares something emotional, resist the urge to fix, advise, or deflect. ' +
        'Instead, say: "Tell me more about what that feels like." Stay with their answer for 30 seconds ' +
        'without responding. Just receive.',
      quote: 'The opposite of avoidance is not approach. It is presence.',
      quoteAttribution: 'Sue Johnson',
    },
  },
  {
    patternId: 'empathic_disconnection',
    modalityId: 'polyvagal',
    severity: 'high',
    content: {
      insight:
        'Your dorsal vagal system — the freeze/shutdown response — activates when emotional intensity rises. ' +
        'It\'s not that you don\'t care. It\'s that your nervous system reads emotional proximity as threat ' +
        'and collapses the connection to protect you.',
      bodyCheck:
        'Notice where you go numb first. Is it your face? Your chest? Your hands? ' +
        'That\'s your body\'s map of where connection shuts down.',
      practice:
        'Practice "titrated closeness": sit with your partner for 2 minutes in silence. ' +
        'If you feel the shutdown starting, say "I\'m noticing I\'m going numb." Naming it is the opposite of doing it.',
    },
  },
  {
    patternId: 'empathic_disconnection',
    modalityId: 'mi',
    severity: 'high',
    content: {
      insight:
        'You may not be ready to feel your partner\'s experience fully — and that\'s OK. ' +
        'Readiness is not all-or-nothing. The question is: on a scale of 1-10, how willing are you ' +
        'to let one more feeling in this week? Even moving from a 3 to a 4 is meaningful.',
      bodyCheck:
        'Check your willingness right now: if your partner were upset beside you, how open does your body feel? ' +
        'Not your mind — your body. Notice the number without judging it.',
      practice:
        'Pick one conversation this week where your partner shares something emotional. ' +
        'Before you respond, pause and silently rate your openness 1-10. ' +
        'If it\'s below 5, just say: "I want to hear this. Give me a moment to arrive."',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // AVOIDANT LOW PERSPECTIVE — 3 modalities at high severity
  // ═══════════════════════════════════════════════════════════
  {
    patternId: 'avoidant_low_perspective',
    modalityId: 'attachment',
    severity: 'high',
    content: {
      insight:
        'Your avoidant system pulls you away at the exact moment your partner needs you to lean in. ' +
        'Combined with low perspective-taking, you withdraw without understanding WHY they\'re reaching. ' +
        'To them, it feels like abandonment. To you, it feels like self-preservation.',
      bodyCheck:
        'When your partner reaches for you and you feel the pull to withdraw, notice what happens in your legs. ' +
        'Do they tense? Do you want to walk away? That\'s the flight response, not a choice.',
      practice:
        'Before your next withdrawal, ask one question: "What do you need from me right now?" ' +
        'You don\'t have to provide it. You just have to hear it. That alone changes the pattern.',
    },
  },
  {
    patternId: 'avoidant_low_perspective',
    modalityId: 'act',
    severity: 'high',
    content: {
      insight:
        'Your withdrawal isn\'t a values-aligned choice — it\'s experiential avoidance. ' +
        'The discomfort of your partner\'s emotions feels so threatening that you\'ll do anything to escape it, ' +
        'including abandoning the connection you value most.',
      bodyCheck:
        'When the urge to withdraw hits, notice: what are you avoiding? Is it their pain, your helplessness, or the fear of being consumed?',
      practice:
        'This week, practice willingness: when you feel the pull to leave, stay 5 minutes longer. ' +
        'Not to fix anything. Not to talk. Just to be a body in the room with their body. ' +
        'That\'s the beginning of approach.',
      quote: 'Willingness is not wanting. It is choosing to have what you have, fully and without defense.',
      quoteAttribution: 'Steven Hayes',
    },
  },
  {
    patternId: 'avoidant_low_perspective',
    modalityId: 'mi',
    severity: 'high',
    content: {
      insight:
        'You know this pattern costs you. The question isn\'t whether withdrawal works — ' +
        'it\'s what it costs. What has your partner stopped asking for because they know you\'ll leave? ' +
        'What conversations have gone unfinished?',
      bodyCheck:
        'Think of the last time you withdrew from a conversation. Where did you go? What did you do? ' +
        'And what was your partner doing when you left? Stay with that image for a moment.',
      practice:
        'After your next withdrawal, come back within 1 hour and say: "I left because I was overwhelmed. ' +
        'I want to hear what you were saying." The return is the repair.',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // LOW REGULATION CAPACITY — 3 modalities at high severity
  // ═══════════════════════════════════════════════════════════
  {
    patternId: 'regulation_capacity',
    modalityId: 'polyvagal',
    severity: 'high',
    content: {
      insight:
        'Your window of tolerance is narrow — the range between "calm enough to think" and "too activated to function" ' +
        'is smaller than most. This means emotions hit fast, hit hard, and take longer to settle. ' +
        'In relationships, this translates to quick activation and slow recovery.',
      bodyCheck:
        'Right now, rate your nervous system 1-10 (1=frozen, 5=calm, 10=activated). ' +
        'Where is your resting baseline? If it\'s above 6 even at rest, your window is already narrowed.',
      practice:
        'Practice the "3-3-3 reset" three times daily: 3 deep belly breaths, notice 3 things you can see, ' +
        'feel 3 points of contact with the ground. This trains your vagal brake — the thing that brings you back to window.',
      quote: 'Safety is not the absence of threat. It is the presence of connection.',
      quoteAttribution: 'Stephen Porges',
    },
  },
  {
    patternId: 'regulation_capacity',
    modalityId: 'dbt',
    severity: 'high',
    content: {
      insight:
        'Your emotional intensity is high and your regulation toolkit is thin. ' +
        'This isn\'t a character flaw — it\'s a skills gap. The emotions are real and valid. ' +
        'What\'s missing is the capacity to ride the wave without being swept away.',
      bodyCheck:
        'Notice your body temperature. When regulation is low, your body runs hot — flushed face, ' +
        'tight jaw, heat in the chest. These are your early warning signals.',
      practice:
        'Learn the TIPP skill for emergency regulation: Temperature (splash cold water on your face), ' +
        'Intense exercise (60 seconds of jumping jacks), Paced breathing (exhale longer than inhale), ' +
        'Progressive muscle relaxation (tense and release each muscle group). Do one TIPP per day this week as prevention, not just crisis response.',
    },
  },
  {
    patternId: 'regulation_capacity',
    modalityId: 'organic_intelligence',
    severity: 'high',
    content: {
      insight:
        'Your nervous system is carrying activation that may predate this relationship. ' +
        'The narrow window isn\'t just about your partner — it\'s about accumulated stress that never fully discharged. ' +
        'Your body is still completing survival responses from before.',
      bodyCheck:
        'Find a quiet place. Close your eyes. Notice if any part of your body holds a tremor, ' +
        'a buzzing, a restlessness that doesn\'t match what\'s happening right now. That\'s stored activation.',
      practice:
        'Twice this week, lie on your back and let your body do what it wants for 5 minutes. ' +
        'It might shake, twitch, sigh, or go very still. Don\'t control it. The body knows how to complete what was interrupted.',
      quote: 'The body keeps the score — but it also knows the cure.',
      quoteAttribution: 'Steve Hoskinson',
    },
  },
];

// ─── Register seed content ───────────────────────────────

export function registerSeedContent(): void {
  for (const entry of SEED) {
    // Avoid duplicates
    const exists = MODALITY_CONTENT.some(
      (e) => e.patternId === entry.patternId && e.modalityId === entry.modalityId && e.severity === entry.severity,
    );
    if (!exists) {
      MODALITY_CONTENT.push(entry);
    }
  }
}

// Auto-register on import
registerSeedContent();
