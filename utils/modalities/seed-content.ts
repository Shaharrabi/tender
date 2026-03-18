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
      quoteAttribution: 'adapted from Richard Schwartz',
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
      quoteAttribution: 'Common wisdom, adapted for relational context',
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
      quoteAttribution: 'adapted from Bill Plotkin',
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
      quoteAttribution: 'adapted from Deb Dana',
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
      quoteAttribution: 'adapted from Sue Johnson',
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
      quoteAttribution: 'adapted from Steven Hayes',
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
      quoteAttribution: 'Gabor Mate',
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
      quoteAttribution: 'adapted from Steve Hoskinson',
    },
  },
  // ═══════════════════════════════════════════════════════════
  // ANXIOUS BUT AVOIDING — 5 modalities at high severity
  // Feels everything, says nothing. Anxiety screams, behavior goes silent.
  // ═══════════════════════════════════════════════════════════
  {
    patternId: 'anxious_but_avoiding',
    modalityId: 'attachment',
    severity: 'high',
    content: {
      insight:
        'Your attachment system is firing an alarm — it wants you to move toward your partner, reach for reassurance, close the gap. ' +
        'But somewhere along the way, you learned that reaching was dangerous. So you avoid. Not because you don\'t care — ' +
        'because you care so much that the risk of rejection feels unsurvivable. The avoidance isn\'t indifference. It\'s a terrified form of self-protection.',
      bodyCheck:
        'Notice the tension between what your body wants to do (move closer) and what you actually do (go quiet, pull back). ' +
        'That tension — the ache of wanting to reach but not reaching — where do you feel it?',
      practice:
        'This week, when you notice yourself avoiding a conversation you actually want to have, pause and say to your partner: ' +
        '"There\'s something I want to bring up but I\'m scared to. Can you just hear me without fixing it?" The act of naming the avoidance breaks its grip.',
      quote: 'The opposite of avoidance isn\'t confrontation. It\'s presence.',
      quoteAttribution: 'adapted from Sue Johnson',
    },
  },
  {
    patternId: 'anxious_but_avoiding',
    modalityId: 'ifs',
    severity: 'high',
    content: {
      insight:
        'You have a Protector Part that learned silence was safer than asking for what you need. It watches the anxious part rise — ' +
        'the one that wants to cry out "Don\'t leave, I need you" — and slams the door. The Protector says: "If we don\'t ask, we can\'t be rejected." ' +
        'But the exile underneath is starving for connection. Every avoided conversation feeds the Protector and starves the exile.',
      bodyCheck:
        'When you swallow something you wanted to say to your partner, where does it go? Throat? Chest? Stomach? That\'s where the exile holds the unspoken.',
      practice:
        'Next time you notice yourself going quiet when you want to speak, put your hand on the part of your body that tightened. ' +
        'Say internally: "I see you. You\'re trying to keep us safe. But I can handle this conversation." Then say ONE true thing out loud — ' +
        'even just "I\'m having a feeling I don\'t know how to say yet."',
      quote: 'Every part has a positive intention. The part that silences you is trying to prevent a pain it once couldn\'t survive.',
      quoteAttribution: 'adapted from Richard Schwartz',
    },
  },
  {
    patternId: 'anxious_but_avoiding',
    modalityId: 'polyvagal',
    severity: 'high',
    content: {
      insight:
        'Your nervous system is running two programs simultaneously: the sympathetic alarm ("something is wrong, fix it!") and the dorsal vagal shutdown ' +
        '("freeze, go silent, disappear"). When both fire at once, you get the anxious-avoidant freeze: internally activated, externally shut down. ' +
        'Your partner sees calm. Your body is screaming.',
      bodyCheck:
        'Check right now: is your jaw clenched while your body is still? Are your thoughts racing while your face shows nothing? ' +
        'That\'s the anxious-avoidant split — activation wearing a mask of calm.',
      practice:
        'When you feel the freeze (anxious inside, silent outside), do ONE thing to bridge the gap: move your body. Stand up. Walk to your partner. ' +
        'You don\'t have to talk yet — just break the physical stillness. Movement interrupts dorsal vagal shutdown and gives your ventral vagal system a chance to come online.',
      quote: 'Safety is not the absence of threat. It is the presence of connection.',
      quoteAttribution: 'Gabor Mate',
    },
  },
  {
    patternId: 'anxious_but_avoiding',
    modalityId: 'act',
    severity: 'high',
    content: {
      insight:
        'Your mind is telling you a story: "If I bring this up, it will go badly. If I stay quiet, at least nothing gets worse." ' +
        'But avoidance doesn\'t prevent pain — it delays it and adds loneliness to the equation. ' +
        'The willingness to feel the discomfort of speaking is the price of the connection you actually want.',
      bodyCheck:
        'What are you unwilling to feel right now? Name the feeling you\'re avoiding by staying quiet. That feeling is the doorway, not the danger.',
      practice:
        'Choose one avoided conversation this week. Before you have it, write down: (1) What am I afraid will happen? ' +
        '(2) What value of mine does this conversation serve? (3) Am I willing to feel uncomfortable for 10 minutes in service of that value? ' +
        'If the answer to 3 is yes — have the conversation.',
      quote: 'The desire to avoid discomfort is the greatest source of human suffering.',
      quoteAttribution: 'adapted from Steven Hayes',
    },
  },
  {
    patternId: 'anxious_but_avoiding',
    modalityId: 'narrative',
    severity: 'high',
    content: {
      insight:
        'You\'ve written yourself a story: "I\'m the one who keeps things smooth. I don\'t make waves. I handle my feelings privately." ' +
        'This story protects you — but it also traps you. The alternative story is also true: ' +
        '"I\'m someone who feels deeply and is learning to let that depth be visible." Which story do you want to live in?',
      bodyCheck:
        'When you hear yourself think "It\'s not worth bringing up" or "I\'ll get over it" — is that YOUR voice, or is it the story speaking?',
      practice:
        'Write two versions of a recent moment where you stayed quiet: Version 1 — the story you told yourself ("It wasn\'t a big deal, I\'m fine"). ' +
        'Version 2 — what was actually happening underneath ("I was hurt and scared to say so"). Read both out loud. Notice which one your body responds to.',
      quote: 'The person is not the problem. The problem is the problem. And sometimes the problem is the story we\'ve agreed to live inside.',
      quoteAttribution: 'adapted from Michael White',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // EQ PERCEPTION-MANAGEMENT GAP — 5 modalities at high severity
  // Reads the room perfectly, can't manage what they read.
  // ═══════════════════════════════════════════════════════════
  {
    patternId: 'eq_perception_management_gap',
    modalityId: 'polyvagal',
    severity: 'high',
    content: {
      insight:
        'Your neuroception — your body\'s unconscious threat-detection system — is highly calibrated. You pick up micro-shifts in your partner\'s face, ' +
        'voice, and posture that most people miss. But your regulation system hasn\'t caught up to your perception system. ' +
        'It\'s like having a fire alarm that detects smoke at a hundred yards but no extinguisher in the building.',
      bodyCheck:
        'Right now, scan your body for any emotional residue from your last interaction with your partner. Is there something still lingering — ' +
        'a tightness, a heaviness, a buzz — that you picked up from them and haven\'t discharged?',
      practice:
        'After every emotionally charged interaction this week, take 90 seconds alone. Shake your hands vigorously for 30 seconds. ' +
        'Then place both hands on your belly and breathe for 60 seconds. You\'re completing the stress cycle that your perception started and your body didn\'t finish.',
      quote: 'The body keeps the score — but it doesn\'t have to keep it forever.',
      quoteAttribution: 'adapted from Bessel van der Kolk',
    },
  },
  {
    patternId: 'eq_perception_management_gap',
    modalityId: 'dbt',
    severity: 'high',
    content: {
      insight:
        'You have a skill imbalance: your Observe skill is highly developed — you notice emotions in yourself and others with precision. ' +
        'But your Describe and Non-judgmentally Participate skills lag behind. You see the emotion, immediately judge it as dangerous, ' +
        'and react before you can choose. The gap between noticing and flooding is where your growth lives.',
      bodyCheck:
        'When you notice a shift in your partner\'s mood, what happens in your body in the FIRST three seconds? ' +
        'That three-second window is where the skill needs to live.',
      practice:
        'This week, practice the 3-step gap: (1) NOTICE — "I\'m picking up something from my partner." ' +
        '(2) LABEL — "What I\'m sensing is [sadness/tension/withdrawal]." (3) CHOOSE — "Do I need to respond to this, or can I note it and let it be?" ' +
        'Write down what you notice each day. You\'re building the muscle between perception and reaction.',
      quote: 'Between stimulus and response there is a space. In that space is our freedom.',
      quoteAttribution: 'Often attributed to Viktor Frankl',
    },
  },
  {
    patternId: 'eq_perception_management_gap',
    modalityId: 'ifs',
    severity: 'high',
    content: {
      insight:
        'Your Perceiver Part is extraordinary — it was probably the part that kept you safe as a child by reading the emotional weather of the adults around you. ' +
        'But it never learned to hand the information to Self for processing. Instead, it hands it directly to your Firefighter Parts: the reactor, the fixer, the people-pleaser. ' +
        'The work isn\'t dulling your perception — it\'s building a relay station between what you sense and how you respond.',
      bodyCheck:
        'Ask your Perceiver Part: "What are you afraid would happen if you sensed the shift and did nothing about it for 30 seconds?" Listen to the answer. That\'s the exile speaking through the Perceiver.',
      practice:
        'When you notice yourself picking up your partner\'s emotional state, say internally: "Thank you, Perceiver. I see it. I\'m going to hold this for a moment before I act." ' +
        'Then wait 30 seconds. If after 30 seconds you still need to respond, respond from Self — not from the Perceiver\'s urgency.',
      quote: 'The most important part of listening to your parts is learning which one is speaking.',
      quoteAttribution: 'adapted from Richard Schwartz',
    },
  },
  {
    patternId: 'eq_perception_management_gap',
    modalityId: 'act',
    severity: 'high',
    content: {
      insight:
        'You\'re fused with your perceptions — you treat every emotional signal as a call to action. "I sense my partner is upset" immediately becomes "I must fix this NOW." ' +
        'But a perception is just information. It\'s not a command. You can notice your partner\'s mood and choose not to reorganize yourself around it. That\'s not coldness — it\'s wisdom.',
      bodyCheck:
        'Notice: are you tensing right now just READING about not responding to your partner\'s emotions? That tension is the fusion. The perception is fine. The compulsion to act on it is what floods you.',
      practice:
        'Practice defusion with perception: When you notice your partner\'s mood shift, say to yourself: "I\'m having the perception that my partner is [upset/distant/tense]." ' +
        'Then add: "And I\'m having the urge to [fix/ask/accommodate]." Name both. Act on neither for 5 minutes. See what happens.',
      quote: 'You are not your thoughts. You are not your feelings. You are the one who notices them.',
      quoteAttribution: 'adapted from Russ Harris',
    },
  },
  {
    patternId: 'eq_perception_management_gap',
    modalityId: 'organic_intelligence',
    severity: 'high',
    content: {
      insight:
        'Your body learned hypervigilance as a survival strategy — scanning for emotional danger, reading every signal, staying one step ahead of the relational weather. ' +
        'That was brilliant adaptation. But your nervous system is still running the old program in a new context. Your partner\'s bad mood is not the same as the threat your child-body was scanning for.',
      bodyCheck:
        'Place one hand on your heart and one on the back of your neck. The heart registers what you\'re perceiving. The neck holds the old vigilance pattern. Notice if one feels more activated than the other.',
      practice:
        'This week, when you pick up a strong emotional signal from your partner, orient to safety FIRST: look around the room, name 3 things you can see, feel your feet on the ground. ' +
        'THEN return to the signal. You\'re teaching your nervous system: "I can perceive without emergency."',
      quote: 'Trauma is not what happens to you. It\'s what happens inside you as a result of what happens to you.',
      quoteAttribution: 'Gabor Mate',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // HIGH CUTOFF — 5 modalities at high severity
  // Manages intensity by disappearing. Lights on, nobody home.
  // ═══════════════════════════════════════════════════════════
  {
    patternId: 'high_cutoff',
    modalityId: 'bowen',
    severity: 'high',
    content: {
      insight:
        'Emotional cutoff is Bowen\'s term for the way people manage unresolved attachment issues by reducing or completely severing emotional contact. ' +
        'You didn\'t choose this — it was handed down. Somewhere in your family system, someone learned that the way to survive emotional intensity was to leave. ' +
        'Not the room. The feeling. You inherited that exit route, and it activates before you can think.',
      bodyCheck:
        'When did you last go numb during a conversation with your partner? Not angry, not sad — just... gone. That absence is cutoff. ' +
        'Notice whether you can even remember what you were feeling right before the numbness arrived.',
      practice:
        'This week, when you notice yourself going blank during an emotional conversation, say out loud: "I just went somewhere else. I\'m coming back." ' +
        'You don\'t have to stay engaged. You just have to NAME the departure. Naming it interrupts the automation.',
      quote: 'Emotional cutoff is not resolution. It is the illusion of resolution achieved through distance.',
      quoteAttribution: 'adapted from Murray Bowen',
    },
  },
  {
    patternId: 'high_cutoff',
    modalityId: 'ifs',
    severity: 'high',
    content: {
      insight:
        'Your system has a Firefighter Part that specializes in emergency evacuation — when the emotional temperature rises past a threshold, this part pulls the plug. ' +
        'It doesn\'t ask permission. It doesn\'t negotiate. It shuts down feeling, shuts down presence, shuts down connection. ' +
        'This part saved you once. Now it activates in situations that are uncomfortable but not dangerous.',
      bodyCheck:
        'When the shutdown happens, where does your awareness go? Behind your eyes? Above your body? Into your head? That\'s where the Firefighter takes you. That location is the escape room.',
      practice:
        'After a shutdown episode, sit quietly and ask: "Which part pulled the plug? What were they afraid would happen if I stayed present?" ' +
        'Don\'t demand an answer. Just ask and wait. The Firefighter will speak when it trusts that you\'re not trying to eliminate it — just understand it.',
      quote: 'We don\'t want to get rid of any part. We want to help each part find its right role.',
      quoteAttribution: 'adapted from Richard Schwartz',
    },
  },
  {
    patternId: 'high_cutoff',
    modalityId: 'polyvagal',
    severity: 'high',
    content: {
      insight:
        'Your nervous system\'s dorsal vagal pathway — the ancient freeze circuit — activates faster than your social engagement system can respond. ' +
        'When your partner\'s emotions reach a certain intensity, your body reads it as a survival threat and drops into conservation mode: ' +
        'flat affect, reduced eye contact, slowed processing, emotional numbness. This is biology, not choice.',
      bodyCheck:
        'After a shutdown, check: is your breathing shallow? Are your extremities cold? Does the world feel slightly distant or unreal? ' +
        'Those are dorsal vagal signatures — your body\'s way of telling you it went into conservation mode.',
      practice:
        'Build a dorsal vagal exit ramp: when you notice the first signs of shutdown (going blank, losing the thread of conversation, feeling suddenly tired), ' +
        'splash cold water on your face or hold ice cubes. The cold activates your diving reflex, which stimulates the vagus nerve and pulls you toward ventral vagal engagement.',
      quote: 'The autonomic nervous system doesn\'t make a judgment about good or bad. It makes a judgment about safe or dangerous.',
      quoteAttribution: 'adapted from Deb Dana',
    },
  },
  {
    patternId: 'high_cutoff',
    modalityId: 'organic_intelligence',
    severity: 'high',
    content: {
      insight:
        'Your cutoff pattern is a survival response that was once perfectly calibrated to a threatening environment. The nervous system learned: when things get too intense, LEAVE — ' +
        'leave the body, leave the feeling, leave the room if necessary. That brilliance kept you intact. But now the program runs in contexts where intensity means intimacy, not danger.',
      bodyCheck:
        'Place one hand on your belly. Can you feel your own breathing? If the belly feels armored, tight, or simply absent — that\'s the cutoff in your body. The belly is where vulnerability lives. Cutoff walls it off.',
      practice:
        'Twice this day, for 60 seconds each time, practice being in your body when nothing is wrong. Hand on belly. Feel the breath. ' +
        'This is not a crisis exercise — it\'s teaching your nervous system that presence is survivable even when nothing is happening.',
      quote: 'Healing trauma is not about revisiting the wound. It is about completing the response the body couldn\'t finish.',
      quoteAttribution: 'adapted from Steve Hoskinson',
    },
  },
  {
    patternId: 'high_cutoff',
    modalityId: 'contemplative',
    severity: 'high',
    content: {
      insight:
        'In many contemplative traditions, the capacity to be fully present — to stay in the room with what is — is considered the highest spiritual practice. ' +
        'Your cutoff pattern is the opposite of presence: it\'s the soul leaving when the body stays. This isn\'t a moral failing. ' +
        'It\'s a wound that sits at the intersection of your psychology and your spirituality.',
      bodyCheck:
        'The next time you feel yourself leaving during an emotional moment, notice: where does your soul go? Is there a place inside you — or outside — that feels safer than here? ' +
        'That place was your refuge. Now it\'s your exile.',
      practice:
        'Choose one moment this week where you would normally check out and instead stay for 30 seconds longer than feels comfortable. Not forever. Just 30 seconds. ' +
        'Sit with what arises. This is not therapy. This is a contemplative practice — being with what is, without fleeing.',
      quote: 'The soul doesn\'t care about comfort. It cares about truth. And truth asks us to stay.',
      quoteAttribution: 'adapted from James Hollis',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // VALUES HONESTY AVOIDS CONFLICT — 5 modalities at high severity
  // Values honesty above all, avoids every conversation that requires it.
  // ═══════════════════════════════════════════════════════════
  {
    patternId: 'values_honesty_avoids_conflict',
    modalityId: 'act',
    severity: 'high',
    content: {
      insight:
        'You value honesty deeply — it\'s one of your non-negotiables. And yet your dominant conflict strategy is avoidance. This isn\'t hypocrisy. ' +
        'It\'s a values-behavior split: the thing you believe matters most and the thing you actually do are moving in opposite directions. ' +
        'The avoidance isn\'t because honesty doesn\'t matter. It\'s because it matters SO much that the risk of being honest — and having it go badly — feels like a threat to the value itself.',
      bodyCheck:
        'Think of something you haven\'t told your partner. Something that honesty would require you to say. Feel what happens in your body when you imagine saying it. ' +
        'That physical response — the constriction, the dread, the tightness — is the cost your body assigns to living your value.',
      practice:
        'Write down one thing you\'ve been avoiding saying. Then write: "My value of honesty asks me to say this. My fear of conflict asks me to stay quiet. Which one do I want driving?" ' +
        'If honesty wins — say the thing this week. Not perfectly. Not elegantly. Just honestly.',
      quote: 'It\'s not enough to know your values. You have to be willing to feel the discomfort of living them.',
      quoteAttribution: 'adapted from Steven Hayes',
    },
  },
  {
    patternId: 'values_honesty_avoids_conflict',
    modalityId: 'narrative',
    severity: 'high',
    content: {
      insight:
        'You\'ve constructed two stories about yourself that can\'t both be true: "I am an honest person" and "I keep the peace by not saying difficult things." ' +
        'One of these is the dominant story — the one you tell yourself and others. The other is the lived story — the one your body enacts. ' +
        'The gap between the told story and the lived story is where your growth edge lives.',
      bodyCheck:
        'When you tell someone "Honesty is really important to me," notice what your body does. Is there a flinch? A qualification? ' +
        'A small voice that says "except when..."? That\'s the lived story interrupting the told story.',
      practice:
        'Write your "honesty autobiography" in 5 sentences: (1) What honesty meant in your family growing up. (2) A time you were honest and it cost you. ' +
        '(3) A time you stayed silent and it cost you. (4) What honesty means to you now. (5) One honest thing you want to say this month. ' +
        'Read it out loud to yourself. Then decide if you want to share sentence 5 with your partner.',
      quote: 'The person is not the problem. The problem is the problem.',
      quoteAttribution: 'adapted from Michael White',
    },
  },
  {
    patternId: 'values_honesty_avoids_conflict',
    modalityId: 'mi',
    severity: 'high',
    content: {
      insight:
        'You\'re in a state of ambivalence — part of you is ready to be more honest in your relationship, and part of you has very good reasons for avoiding it. ' +
        'Both parts are valid. The avoiding part isn\'t cowardice — it\'s protecting you from outcomes you\'ve learned to fear. ' +
        'The honest part isn\'t naive — it knows that authentic connection requires truth.',
      bodyCheck:
        'On a scale of 1-10, how ready are you to say the thing you\'ve been holding back? Whatever number you said — what would make it one point higher?',
      practice:
        'Answer these three questions in writing: (1) What would change for the better if I started being more honest with my partner? ' +
        '(2) What am I worried would happen? (3) What\'s the smallest honest thing I could say this week that feels survivable? Start there.',
      quote: 'People are generally better persuaded by the reasons which they have themselves discovered than by those which have come into the mind of others.',
      quoteAttribution: 'adapted from Blaise Pascal',
    },
  },
  {
    patternId: 'values_honesty_avoids_conflict',
    modalityId: 'ifs',
    severity: 'high',
    content: {
      insight:
        'Your Peacekeeper Part and your Honesty Part are in a polarity — each one believes the other is dangerous. The Peacekeeper says: ' +
        '"If we\'re honest, they\'ll leave." The Honesty Part says: "If we keep silent, we lose ourselves." ' +
        'Both parts are protecting an exile — probably a young part that learned that truth-telling was punished or that conflict meant abandonment.',
      bodyCheck:
        'Notice where the Peacekeeper lives in your body (often throat or chest — the place that tightens when truth wants to come out). ' +
        'Now notice where the Honesty Part lives (often gut or solar plexus — the part that churns when you swallow something true). Can you feel both at once?',
      practice:
        'Have a conversation between the two parts. Write it out: Peacekeeper says: "..." Honesty Part says: "..." Let them argue. ' +
        'Then ask Self: "What does the little one underneath need to hear to feel safe enough for me to be honest?" That\'s the real question.',
      quote: 'When two parts are polarized, they\'re usually protecting the same exile from different directions.',
      quoteAttribution: 'adapted from Richard Schwartz',
    },
  },
  {
    patternId: 'values_honesty_avoids_conflict',
    modalityId: 'contemplative',
    severity: 'high',
    content: {
      insight:
        'In every wisdom tradition, truth is not merely a moral principle — it is a practice. Your values say honesty matters. Your behavior says safety matters more. ' +
        'The contemplative invitation is not to force honesty or shame the avoidance. It is to ask: ' +
        '"What would it feel like to trust that the truth, spoken with love, will hold the relationship rather than break it?"',
      bodyCheck:
        'Sit quietly. Bring to mind the thing you\'re avoiding saying. Hold it gently. Don\'t rehearse how to say it — just hold the truth itself. ' +
        'Notice: does the truth feel dangerous? Or does the TELLING feel dangerous? They\'re different.',
      practice:
        'Before your next difficult conversation, spend 3 minutes in silence. Not preparing arguments. Not rehearsing words. ' +
        'Just sitting with the truth you carry. Let it settle from your head to your chest to your belly. Speak from the belly, not the head.',
      quote: 'Speak the truth, but not to punish.',
      quoteAttribution: 'adapted from Thich Nhat Hanh',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // ANXIOUS HIGH PERSPECTIVE — 5 modalities at high severity
  // Understands partner perfectly, anxiety overrides it in the moment.
  // ═══════════════════════════════════════════════════════════
  {
    patternId: 'anxious_high_perspective',
    modalityId: 'polyvagal',
    severity: 'high',
    content: {
      insight:
        'Your cognitive empathy is high — you can genuinely see your partner\'s perspective. But perspective-taking is a prefrontal cortex function, ' +
        'and when your attachment alarm fires, the prefrontal cortex goes offline. Your amygdala hijacks the controls. ' +
        'You have the insight BEFORE and AFTER the conflict — but during it, your nervous system overrides everything your mind knows.',
      bodyCheck:
        'Think of your last argument. You probably had a moment where you KNEW your partner\'s point was valid but couldn\'t stop reacting. ' +
        'Where in your body did the knowing live? And where did the reaction live? Notice they\'re in different places.',
      practice:
        'Build a pre-conversation regulation ritual: before any conversation that might trigger your anxiety, spend 60 seconds doing physiological sighing ' +
        '(double inhale through the nose, long exhale through the mouth). This activates the parasympathetic brake BEFORE the alarm fires. ' +
        'You\'re giving your prefrontal cortex a head start.',
      quote: 'You can\'t reason with a dysregulated nervous system. You have to regulate first, reason second.',
      quoteAttribution: 'adapted from Dan Siegel',
    },
  },
  {
    patternId: 'anxious_high_perspective',
    modalityId: 'dbt',
    severity: 'high',
    content: {
      insight:
        'You have strong Interpersonal Effectiveness skills (you understand what your partner needs) but weak Distress Tolerance ' +
        '(you can\'t hold that understanding when your own distress is high). The skill isn\'t perspective-taking — you already have that. ' +
        'The skill is holding your own activation long enough for the perspective to be useful.',
      bodyCheck:
        'In your next disagreement, rate your distress on a 0-10 scale. At what number does your perspective-taking go offline? ' +
        'That\'s your threshold. Everything below it, your insight works. Everything above it, your anxiety takes over.',
      practice:
        'Practice TIPP before difficult conversations: Temperature (cold water on face), Intense exercise (30 seconds of movement), ' +
        'Paced breathing (exhale longer than inhale), Progressive muscle relaxation. Do this BEFORE the conversation, not during it. ' +
        'You\'re lowering your baseline so the alarm fires later — giving your perspective-taking more runway.',
      quote: 'The goal is not to eliminate distress. It is to build the capacity to function within it.',
      quoteAttribution: 'adapted from Marsha Linehan',
    },
  },
  {
    patternId: 'anxious_high_perspective',
    modalityId: 'act',
    severity: 'high',
    content: {
      insight:
        'You\'re fused with the feeling "I must resolve this NOW or something terrible will happen." Your perspective-taking shows you that your partner is not actually threatening the relationship — ' +
        'but your anxiety says otherwise, and you believe the anxiety more than the understanding. ' +
        'Defusion means: you can notice the anxiety AND notice the understanding AND choose which one to act on.',
      bodyCheck:
        'Right now, hold two things at once: "My anxiety says this is an emergency" and "My perspective says my partner is doing their best." ' +
        'Can you feel both without choosing between them? That\'s the defusion space.',
      practice:
        'In your next conflict, try saying — out loud or internally: "My anxiety is telling me [specific fear]. And I can also see that my partner is [what you understand about their position]. ' +
        'I\'m going to respond to what I understand, not what I fear." This is values-based action in the presence of anxiety.',
      quote: 'Willingness is not wanting. It is choosing to open up to what\'s present even when it\'s painful.',
      quoteAttribution: 'adapted from Steven Hayes',
    },
  },
  {
    patternId: 'anxious_high_perspective',
    modalityId: 'ifs',
    severity: 'high',
    content: {
      insight:
        'Your system has a sophisticated Analyst Part that can map your partner\'s perspective with remarkable accuracy — and an Anxious Part that screams louder. ' +
        'In the moment of conflict, the Analyst speaks in a measured voice and the Anxious Part speaks in a siren. ' +
        'Your system follows the siren because it\'s louder, not because it\'s wiser.',
      bodyCheck:
        'In your body, the Analyst usually lives in the head (clear, observing, understanding). The Anxious Part usually lives in the chest or stomach (tight, urgent, desperate). ' +
        'When they\'re both active, you feel split — knowing and panicking simultaneously. Can you feel that split right now?',
      practice:
        'Before your next difficult conversation, spend 2 minutes with each part. Say to the Anxious Part: "I hear you. You\'re scared. I\'m not going to abandon you. ' +
        'But I\'m going to let the one who understands lead this conversation." Say to the Analyst: "I need you online. Stay present even when the alarm fires."',
      quote: 'Self-leadership doesn\'t mean the parts go quiet. It means you\'re the one who decides who speaks next.',
      quoteAttribution: 'adapted from Jay Earley',
    },
  },
  {
    patternId: 'anxious_high_perspective',
    modalityId: 'aqal',
    severity: 'high',
    content: {
      insight:
        'You\'re at a developmental edge: you have the cognitive capacity to take perspectives (a later-stage skill) but the emotional regulation of an earlier stage. ' +
        'This isn\'t regression — it\'s uneven development, which is completely normal. Most people develop cognitive empathy faster than emotional regulation. ' +
        'You\'re not behind. You\'re mid-growth — the understanding arrived before the container to hold it.',
      bodyCheck:
        'Notice the gap between what you KNOW (your partner\'s perspective makes sense) and what you FEEL (terror that the relationship is in danger). ' +
        'That gap is the developmental edge. It\'s uncomfortable because you\'re growing into it.',
      practice:
        'Map your own development: On paper, draw two lines. Line 1: "My ability to understand my partner" — rate it 1-10. ' +
        'Line 2: "My ability to stay calm while understanding my partner" — rate it. The gap between those two lines is your growth edge. ' +
        'Name it: "I am someone who understands more than I can hold. I am building the holding."',
      quote: 'Development is not a ladder. It is an unfolding — and not all parts unfold at the same speed.',
      quoteAttribution: 'adapted from Ken Wilber',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // ANXIOUS YIELDING — 5 modalities at high severity
  // Gives in to everything. Every concession buys temporary relief.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'anxious_yielding', modalityId: 'attachment', severity: 'high', content: {
    insight: 'Your yielding isn\'t generosity — it\'s an attachment strategy. When your anxiety fires, your nervous system calculates: "If I give them what they want, they\'ll stay." Every time you concede, the anxiety briefly quiets. But the relief trains your system to yield MORE, not less. You\'re teaching your attachment system that your needs are the price of love. They\'re not.',
    bodyCheck: 'Think of the last time you agreed to something you didn\'t want. Where did the "yes" come from? Your mouth said yes. What did your stomach say? Your chest? The body keeps the real answer.',
    practice: 'This week, when you feel the urge to agree with your partner to keep the peace, pause for 5 seconds. In those 5 seconds ask: "Am I saying yes because I want to, or because I\'m afraid of what happens if I say no?" You don\'t have to say no. Just know which yes you\'re giving.',
    quote: 'An attachment strategy that sacrifices the self to preserve the bond eventually loses both.', quoteAttribution: 'adapted from Sue Johnson',
  }},
  { patternId: 'anxious_yielding', modalityId: 'ifs', severity: 'high', content: {
    insight: 'Your People-Pleaser Part runs your relationship — it scans for what your partner wants and delivers it before they even ask. Underneath it is an exile who believes: "If I have needs of my own, I\'ll be too much. If I take up space, they\'ll leave." The People-Pleaser protects this exile by making sure you never test the belief.',
    bodyCheck: 'Where does the People-Pleaser live in your body? Many people feel it in the throat — the place where their own truth gets swallowed — or in the shoulders, carrying what isn\'t theirs.',
    practice: 'This week, notice one moment where your People-Pleaser activates. Instead of following its instructions, ask it: "What are you afraid would happen if I said what I actually want?" Write down the answer. That answer is the exile\'s voice.',
    quote: 'The People-Pleaser doesn\'t need to be fired. It needs to be reassured that you can survive your partner\'s displeasure.', quoteAttribution: 'adapted from Bonnie Weiss',
  }},
  { patternId: 'anxious_yielding', modalityId: 'bowen', severity: 'high', content: {
    insight: 'In Bowen\'s framework, this is undifferentiation expressed through compliance. You regulate your anxiety by adapting to your partner\'s emotional field — becoming what they need, erasing the edges where you are different. This isn\'t intimacy. It\'s fusion disguised as harmony. True intimacy requires two defined selves.',
    bodyCheck: 'Can you identify one preference — about anything: food, plans, how to spend the evening — that is YOURS and not a reflection of what your partner would choose? If that\'s hard, notice the difficulty itself.',
    practice: 'Practice micro-differentiation this week: state one preference per day that is purely yours. Not a confrontation. Just: "I\'d prefer Thai tonight" or "I want to watch this, not that." Notice what happens in your body when you state a preference.',
    quote: 'The ability to define yourself in the context of a relationship without losing yourself or the relationship — that is differentiation.', quoteAttribution: 'adapted from Roberta Gilbert',
  }},
  { patternId: 'anxious_yielding', modalityId: 'aca', severity: 'high', content: {
    insight: 'This pattern often has roots in a childhood where love was conditional on compliance. You learned: good children agree. Good children don\'t make waves. You became excellent at that. So excellent that you carried it into adulthood and called it love. But what you\'re doing isn\'t loving your partner — it\'s performing the role that earned you safety as a child.',
    bodyCheck: 'When you imagine disagreeing with your partner about something that matters, does it feel like a relationship risk or does it feel like a SURVIVAL risk? If it\'s survival — that\'s the child speaking, not the adult.',
    practice: 'Write a letter to your younger self — the one who learned that agreement was survival. Tell them: "You did what you needed to do. It worked. But I\'m an adult now, and the person I\'m with can handle hearing what I actually think." Then have one honest conversation this week.',
    quote: 'We don\'t stop playing the roles we learned in childhood. We just forget they\'re roles.', quoteAttribution: 'adapted from Claudia Black',
  }},
  { patternId: 'anxious_yielding', modalityId: 'dbt', severity: 'high', content: {
    insight: 'You need the DEAR MAN skill — not the concept, the actual practice. Describe the situation, Express how you feel, Assert what you need, Reinforce why it matters. Your yielding pattern skips every step: you don\'t describe, don\'t express, don\'t assert. You just accommodate.',
    bodyCheck: 'Think of something you want from your partner that you haven\'t asked for. Is there a physical sensation that accompanies the NOT-asking? A heaviness, a resignation? That sensation is the cost of chronic yielding.',
    practice: 'Choose one small thing you want this week. Use DEAR MAN: (1) Describe: "When we make plans, I notice I usually go along with yours." (2) Express: "I feel invisible when my preferences don\'t get heard." (3) Assert: "I\'d like us to take turns deciding." (4) Reinforce: "I think it would make me more engaged and less resentful." Say it.',
    quote: 'Interpersonal effectiveness is not about getting what you want. It is about being willing to ask.', quoteAttribution: 'adapted from Marsha Linehan',
  }},

  // ═══════════════════════════════════════════════════════════
  // AVOIDANT AVOIDING — 5 modalities at high severity
  // Double avoidance: avoids closeness AND avoids talking about it.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'avoidant_avoiding', modalityId: 'attachment', severity: 'high', content: {
    insight: 'Your attachment system and your conflict system are aligned in the same direction: away. When your partner reaches for closeness, you step back. When they bring up a problem, you change the subject. This isn\'t cruelty — it\'s a coherent protective strategy. Your entire system agrees: distance is safety. The problem is that distance is also loneliness.',
    bodyCheck: 'What does closeness feel like in your body? Not the idea of closeness — the actual physical experience of your partner wanting to be emotionally near you. Is there a tightening? A subtle retreat?',
    practice: 'This week, when your partner initiates emotional connection, notice your first impulse. Don\'t override it. Just notice and name it: "My first impulse is to [change the subject / check my phone / say I\'m fine]." Then choose: follow the impulse, or stay for 30 more seconds.',
    quote: 'Avoidance is not the absence of need. It is need wearing armor.', quoteAttribution: 'adapted from Amir Levine',
  }},
  { patternId: 'avoidant_avoiding', modalityId: 'polyvagal', severity: 'high', content: {
    insight: 'Your nervous system has a strong dorsal vagal preference — when emotional demands rise, you don\'t fight or flee. You conserve. You go flat. You become pleasant, agreeable, and completely unreachable. Your partner experiences this as a wall. Your body experiences it as relief. Both are real.',
    bodyCheck: 'During your next conversation about feelings, monitor your body every 60 seconds. Are you still breathing fully? Can you feel your feet? Is your face expressive or has it gone neutral?',
    practice: 'Practice ventral vagal anchoring: before an emotional conversation, hum for 30 seconds (stimulates the vagus nerve), make eye contact with your partner for 5 seconds, and orient to the room. These three actions pull your nervous system toward social engagement.',
    quote: 'Connection is a biological imperative. The nervous system that avoids it is protecting against something it once couldn\'t survive.', quoteAttribution: 'adapted from Deb Dana',
  }},
  { patternId: 'avoidant_avoiding', modalityId: 'mi', severity: 'high', content: {
    insight: 'You\'re not in denial about the avoidance. You know you pull away. You\'re ambivalent — part of you wants to open up, and part of you has very good reasons for staying closed. The question isn\'t "Why don\'t you just open up?" The question is: "What would make it worth the risk?"',
    bodyCheck: 'On a scale of 1-10, how important is it to you to be more emotionally available to your partner? Now: how confident are you that you COULD be? The gap between importance and confidence is where the work lives.',
    practice: 'Complete this sentence three ways: "If I were more emotionally open with my partner, the best thing that could happen is ___." "The worst thing is ___." "The most LIKELY thing is ___." Notice which feels most real.',
    quote: 'Ambivalence is not the enemy of change. It is the beginning of it.', quoteAttribution: 'adapted from William Miller',
  }},
  { patternId: 'avoidant_avoiding', modalityId: 'narrative', severity: 'high', content: {
    insight: 'You\'ve authored a story: "I\'m independent. I don\'t need that much emotional connection. I\'m low-maintenance." This story serves you — it protects against vulnerability. But there\'s an alternative story that\'s also true: "I am someone who learned to need less because asking for more was dangerous."',
    bodyCheck: 'When you tell yourself "I\'m just not that emotional," does your body agree? Or is there a quieter voice underneath that wants to be known?',
    practice: 'Write the alternative story — not the one you tell, but the one you\'ve been avoiding: "I am someone who ___." Fill in the blank with something honest about what you actually want from intimacy.',
    quote: 'The stories we tell about ourselves are never the whole truth. The question is: which parts have we left out, and why?', quoteAttribution: 'adapted from David Epston',
  }},
  { patternId: 'avoidant_avoiding', modalityId: 'contemplative', severity: 'high', content: {
    insight: 'Every spiritual tradition has a name for the practice you\'re avoiding: presence, witness, being-with. Your avoidance is not just a relational pattern — it\'s a way of moving through life that keeps you at a comfortable distance from your own depth.',
    bodyCheck: 'Sit quietly for 60 seconds. Don\'t distract. Don\'t plan. Just be in the silence. What rises? The thing that rises when the distractions stop — that\'s what you\'re avoiding.',
    practice: 'This week, practice one minute of stillness before bed. No phone, no book. Just you, in the dark, with whatever is there. Start with one minute. See what comes.',
    quote: 'We must be willing to let go of the life we planned so as to have the life that is waiting for us.', quoteAttribution: 'Joseph Campbell',
  }},

  // ═══════════════════════════════════════════════════════════
  // AVOIDANT BUT COLLABORATIVE — 4 modalities at high severity
  // Avoids emotional intimacy but ENGAGES with practical problems.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'avoidant_but_collaborative', modalityId: 'attachment', severity: 'high', content: {
    insight: 'Your problem-solving is your love language — but it\'s also your hiding place. When your partner says "I feel disconnected," you hear a problem to solve rather than a feeling to sit with. Underneath the doing is a belief: "If I\'m useful enough, they won\'t ask me to be vulnerable."',
    bodyCheck: 'When your partner shares a feeling, does your brain immediately translate it into a PROBLEM? "They\'re sad" becomes "What can I do?" That translation — emotion into task — is the avoidance wearing the mask of helpfulness.',
    practice: 'This week, when your partner shares a feeling, practice NOT solving it. Say: "That sounds hard. Tell me more." Then stop. No advice. No fix. Just: "Tell me more." Notice how uncomfortable the silence feels.',
    quote: 'Being heard is so close to being loved that for the average person, they are almost indistinguishable.', quoteAttribution: 'David Augsburger',
  }},
  { patternId: 'avoidant_but_collaborative', modalityId: 'ifs', severity: 'high', content: {
    insight: 'Your Fixer Part is running your relationship — and it\'s exhausted. This part believes that love is earned through competence. But being needed and being loved are different things. The exile underneath holds the terrifying question: "If I stop being useful, am I still wanted?"',
    bodyCheck: 'When there\'s nothing to fix and your partner just wants to sit with you in silence — what happens in your body? Restlessness? The urge to start a project? That\'s the Fixer panicking.',
    practice: 'Schedule 20 minutes this week of deliberate uselessness with your partner. No activity. No planning. If the Fixer starts itching, say internally: "I know you want to do something. We\'re practicing being."',
    quote: 'The most profound thing we can offer another person is our presence — not our solutions.', quoteAttribution: 'adapted from Richard Schwartz',
  }},
  { patternId: 'avoidant_but_collaborative', modalityId: 'act', severity: 'high', content: {
    insight: 'You\'re fused with the thought: "I show love by doing things." And that IS one way — a valuable one. But you\'ve made it the ONLY way, closing the door on other forms of intimacy. The ACT move isn\'t to stop doing. It\'s to expand the repertoire.',
    bodyCheck: 'Think of the last time your partner wanted emotional connection and you offered a solution instead. What were you FEELING right before you started problem-solving? Can you name it?',
    practice: 'This week, before you solve anything your partner brings to you, ask one question first: "Do you want me to listen, or do you want me to help fix it?" If they say listen — LISTEN.',
    quote: 'The willingness to be present to another\'s pain — without fixing it — is one of the highest forms of courage.', quoteAttribution: 'adapted from Russ Harris',
  }},
  { patternId: 'avoidant_but_collaborative', modalityId: 'bowen', severity: 'high', content: {
    insight: 'Your problem-solving is overfunctioning — you take responsibility for the emotional climate by managing, planning, and executing. This lets your partner underfunction emotionally. The reciprocity keeps both of you stuck: you never rest, they never grow, and neither of you is truly intimate.',
    bodyCheck: 'How much of your mental energy is currently occupied by things you\'re managing FOR the relationship? If you stopped, what would happen? The answer reveals what the overfunctioning is protecting.',
    practice: 'This week, consciously underfunction in ONE area you normally manage. Don\'t remind your partner. Let something stay unsolved. Notice what happens — both in the relationship and in your body.',
    quote: 'Overfunctioning for another person is a way of avoiding your own emotional life. It looks like love. It feels like control.', quoteAttribution: 'adapted from Roberta Gilbert',
  }},

  // ═══════════════════════════════════════════════════════════
  // AWARE BUT CAN'T REGULATE — 4 modalities at high severity
  // Narrates flooding in real time but can't stop it.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'aware_but_cant_regulate', modalityId: 'polyvagal', severity: 'high', content: {
    insight: 'Your awareness is top-down — your cortex observes and labels. Your dysregulation is bottom-up — your brainstem activates without consulting your cortex. These two systems aren\'t in conversation. You can WATCH yourself flood without being able to STOP it. This isn\'t a failure of insight. It\'s a failure of neural integration.',
    bodyCheck: 'The next time you\'re activated, notice: can you observe the activation with some part of your awareness? That observing part is your resource. It\'s small right now. But it exists.',
    practice: 'Practice dual awareness: during a calm moment, recall a mildly stressful interaction. Let activation rise to a 3/10. Keep one hand on a solid surface — your anchor. Hold BOTH: the activation AND the anchor. This is titration.',
    quote: 'The goal is not to stop the wave. The goal is to learn to surf.', quoteAttribution: 'adapted from Jon Kabat-Zinn',
  }},
  { patternId: 'aware_but_cant_regulate', modalityId: 'dbt', severity: 'high', content: {
    insight: 'You have Observe mastered. What\'s missing is the Non-judgmental Stance. When you observe yourself flooding, your mind adds: "Here I go again. I KNOW better." That judgment IS the second wave that makes the first worse. The flooding is one problem. The self-criticism about the flooding is a bigger one.',
    bodyCheck: 'When you catch yourself in a pattern, what\'s the FIRST thought? Is it "I\'m flooding" (observation) or "I\'m STILL flooding, what\'s wrong with me" (judgment)? The judgment adds fuel.',
    practice: 'When you notice yourself dysregulated, replace the judgment with a weather report: "A storm is moving through. It\'s a 6/10. I can see it. It will pass." No self-criticism. Just weather.',
    quote: 'Awareness without judgment is the beginning of change. Awareness WITH judgment is the beginning of another cycle.', quoteAttribution: 'adapted from Marsha Linehan',
  }},
  { patternId: 'aware_but_cant_regulate', modalityId: 'organic_intelligence', severity: 'high', content: {
    insight: 'Your body has incomplete survival responses — moments from the past where your nervous system started to fight, flee, or freeze but couldn\'t complete the action. Your high awareness means you FEEL this stored activation acutely. But knowing it\'s there doesn\'t discharge it.',
    bodyCheck: 'When activated and aware of it, notice what your body WANTS to do — push? Run? Curl up? That impulse is the incomplete response. It\'s not irrational. It\'s unfinished.',
    practice: 'In a safe space, let your body complete one small impulse: if it wants to push, push against a wall for 10 seconds. If it wants to curl up, curl up for 60 seconds, then uncurl slowly. The awareness you already have will tell you when the discharge is complete — a shift, a settling, a sigh.',
    quote: 'The body doesn\'t lie. And it doesn\'t forget. But it can complete what it started, if we let it.', quoteAttribution: 'adapted from Steve Hoskinson',
  }},
  { patternId: 'aware_but_cant_regulate', modalityId: 'aqal', severity: 'high', content: {
    insight: 'You\'re at a developmental transition: you\'ve developed self-observation (later-stage cognitive skill) but your emotional regulation is still catching up (earlier-stage embodied skill). This gap is normal — lines develop unevenly. The frustration "I can SEE it but can\'t STOP it" is the felt experience of being between stages.',
    bodyCheck: 'The gap between seeing and stopping feels like failure. Reframe it: it feels like a bridge being built. The seeing side is solid. The stopping side is under construction. You\'re in the middle.',
    practice: 'Track regulation, not awareness. Keep a daily log: "Today my activation peaked at ___/10 and took ___ minutes to return to baseline." Over weeks, watch recovery time shorten. That\'s development.',
    quote: 'The measure of growth is not whether you still get triggered. It is how quickly you return to yourself.', quoteAttribution: 'adapted from Dan Siegel',
  }},

  // ═══════════════════════════════════════════════════════════
  // MODERATE REGULATION CAPACITY — 4 modalities at medium severity
  // Not in crisis. Regulates some of the time. Building reliability.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'moderate_regulation_capacity', modalityId: 'polyvagal', severity: 'medium', content: {
    insight: 'Your regulation capacity is real — it works in many situations. What you\'re noticing is a threshold: below a certain intensity, you regulate well. Above it, the system overwhelms. This threshold isn\'t fixed. Every time you regulate successfully at your edge, you stretch the window slightly wider.',
    bodyCheck: 'Think of a recent moment where you regulated well. Now one where you couldn\'t. What\'s the difference? Intensity? Topic? Fatigue? Finding the conditions that narrow your window is as important as building it.',
    practice: 'Practice edge work: find the 4-5/10 activation level — the edge where you can feel the pull of dysregulation but still maintain your center. Not 2/10 (too easy). Not 8/10 (too much). The edge is where the window stretches.',
    quote: 'Resilience is not built by avoiding difficulty. It is built by meeting difficulty at the edge of your capacity.', quoteAttribution: 'adapted from Deb Dana',
  }},
  { patternId: 'moderate_regulation_capacity', modalityId: 'dbt', severity: 'medium', content: {
    insight: 'You\'re in the middle zone — not crisis-level and not solid either. This is the best place to build skills because you have enough capacity to PRACTICE without being overwhelmed. The skills you need aren\'t emergency skills. They\'re maintenance skills: daily practices that keep your baseline low.',
    bodyCheck: 'Check your baseline right now — not during conflict, just now. Rate tension 0-10. If your RESTING baseline is above 4, you\'re starting every interaction partially activated. Lowering the resting baseline is the highest-leverage change.',
    practice: 'Build a daily 5-minute practice: Morning: 2 minutes paced breathing (inhale 4, hold 4, exhale 6). Midday: 60-second body scan. Evening: name 3 emotions you felt today without judging them. This lowers your resting baseline more reliably than any crisis intervention.',
    quote: 'The goal is not to be calm all the time. The goal is to return to calm more quickly each time.', quoteAttribution: 'adapted from Marsha Linehan',
  }},
  { patternId: 'moderate_regulation_capacity', modalityId: 'act', severity: 'medium', content: {
    insight: 'Your regulation is good enough to support values-based action most of the time. The question isn\'t "Can I regulate?" — you can, often. The question is: "When I can\'t, am I willing to feel the discomfort and act according to my values anyway?" Regulation is ideal. Willingness is the backup.',
    bodyCheck: 'Think of a moment where you were partially activated but still functioned — still said the right thing. That moment wasn\'t perfect regulation. It was willingness plus good-enough regulation. That\'s real.',
    practice: 'This week, notice one moment where your regulation wavers but doesn\'t collapse. Ask: "What value is at stake? Am I willing to feel this discomfort in service of that value?" If yes — act. It won\'t be clean. It will be real.',
    quote: 'Willingness is not wanting to feel discomfort. It is choosing to feel it when something important is at stake.', quoteAttribution: 'adapted from Steven Hayes',
  }},
  { patternId: 'moderate_regulation_capacity', modalityId: 'contemplative', severity: 'medium', content: {
    insight: 'You\'re in the middle of your regulation journey — not at the beginning, not at mastery. Many contemplative traditions honor this in-between space. You are not dysregulated. You are not regulated. You are becoming.',
    bodyCheck: 'Sit with the imperfection of your current capacity. "I can sometimes hold myself through difficulty, and sometimes I can\'t." Can you hold that truth without it collapsing into "I\'m not good enough"?',
    practice: 'After a moment where your regulation was imperfect — messy but managed — take 30 seconds to appreciate the managing. Not the mess. "I stayed. I didn\'t leave. I came back." Self-compassion widens the window. Shame shrinks it.',
    quote: 'The middle of the journey is the hardest place to be — and the most sacred.', quoteAttribution: 'adapted from Pema Chodron',
  }},

  // ═══════════════════════════════════════════════════════════
  // EQ OTHER-FOCUSED — 5 modalities at high severity
  // Regulates everyone except themselves. The caretaker pattern.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'eq_other_focused', modalityId: 'ifs', severity: 'high', content: {
    insight: 'Your Caretaker Part is highly developed — it can sense what others need and provide it with remarkable skill. But this part has a deal with the rest of your system: "I\'ll manage everyone else\'s emotions so that nobody has to manage mine." The exile underneath holds the belief: "My feelings are too much. If I turned this attention inward, I\'d fall apart."',
    bodyCheck: 'When someone you love is in distress, your body activates toward THEM. Now notice: when YOU are in distress, does your body do the same toward yourself? Or does it go blank, tight, dismissive? That asymmetry is the pattern.',
    practice: 'This week, when you notice yourself regulating someone else, pause afterward and ask: "What am I feeling RIGHT NOW that I didn\'t attend to while I was taking care of them?" Write it down. Just notice that your own feeling exists and was waiting.',
    quote: 'The Caretaker\'s greatest fear is being the one who needs care. That fear is the exile speaking.', quoteAttribution: 'Tender',
  }},
  { patternId: 'eq_other_focused', modalityId: 'polyvagal', severity: 'high', content: {
    insight: 'Your ventral vagal system is highly developed in the outward direction. You can co-regulate others because your nervous system naturally broadcasts safety: steady voice, soft eyes, calm presence. But your system hasn\'t learned to direct that same broadcast INWARD. You can be the anchor for others but you\'ve never anchored yourself.',
    bodyCheck: 'Place one hand on your own heart. Say: "I\'m here for you." Notice what happens. If it feels awkward, foreign, or brings up emotion — that\'s the signal. Your nervous system isn\'t used to receiving the care it gives so easily to others.',
    practice: 'Practice self-directed co-regulation: place both hands on your chest. Speak to yourself in the same tone you use when soothing someone you love. Say: "You\'re okay. I\'m here. This feeling will pass." Your vagus nerve doesn\'t distinguish between soothing directed at others and soothing directed at yourself.',
    quote: 'You cannot offer a regulated presence to others from a dysregulated body. Your own regulation comes first.', quoteAttribution: 'adapted from Deb Dana',
  }},
  { patternId: 'eq_other_focused', modalityId: 'aca', severity: 'high', content: {
    insight: 'You probably learned early that your job in the family was to manage the emotional climate — to be the stable one, the mediator, the little therapist. But the child who learned to caretake was ALSO a child who had feelings of their own. That child\'s needs got filed under "later." It\'s later now.',
    bodyCheck: 'When you were growing up, who took care of YOUR emotions? If the answer is "nobody" or "I did it myself" — that\'s the origin. Your body learned: "My feelings are my problem. Other people\'s feelings are my responsibility."',
    practice: 'Write a list of 5 things you do when someone you love is upset. Now ask: "Do I ever do this for myself?" Circle the ones you don\'t. Pick one. Do it for yourself this week. Not because you\'re in crisis. Because you deserve the same care you give others.',
    quote: 'The child who learned to take care of everyone else\'s feelings is still waiting for someone to take care of theirs. That someone is you.', quoteAttribution: 'adapted from Pia Mellody',
  }},
  { patternId: 'eq_other_focused', modalityId: 'dbt', severity: 'high', content: {
    insight: 'Your Interpersonal Effectiveness is high — you know how to navigate others\' emotions. Your Emotion Regulation module is underdeveloped — you don\'t apply those same skills to yourself. This is a skill transfer problem, not a skill deficit. You already HAVE the tools. You just point them in one direction only.',
    bodyCheck: 'After your next emotionally demanding interaction, check in: are you depleted? Irritable? Numb? Those are signs that you spent regulation resources on someone else and have none left for yourself.',
    practice: 'Build a self-regulation routine that mirrors what you do for others: validate ("This is hard and I\'m allowed to feel it"), listen (what does your body need?), comfort (cup of tea, hand on heart, 5 slow breaths). Redirect the skill inward.',
    quote: 'Emotion regulation is not just about managing others\' emotions. It is about giving your own emotions the same respect.', quoteAttribution: 'adapted from Marsha Linehan',
  }},
  { patternId: 'eq_other_focused', modalityId: 'contemplative', severity: 'high', content: {
    insight: 'There is a spiritual trap in caretaking: it can FEEL like selflessness. But when caretaking becomes the only way you know how to exist in relationship — when you cannot be present without attending to someone else\'s experience — it stops being generosity and becomes avoidance of your own interior.',
    bodyCheck: 'Imagine turning off your emotional radar for an hour. Not reading the room, not sensing your partner\'s state. What happens in your body? Relief? Terror? Both? That response tells you whether your EQ is a freely given gift or an obligation.',
    practice: 'Give your emotional intelligence part a vacation — one hour this week where you deliberately DON\'T manage the emotional climate. Let things be what they are. Whatever arises — boredom, anxiety, sadness — is the feeling that lives under all the caretaking.',
    quote: 'If you want to be of service, start by being fully present to yourself. Everything else follows from there.', quoteAttribution: 'adapted from Parker Palmer',
  }},

  // ═══════════════════════════════════════════════════════════
  // EQ UNDERUTILIZED EMOTIONS — 4 modalities at high severity
  // Feels clearly but doesn't USE emotional information.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'eq_underutilized_emotions', modalityId: 'act', severity: 'high', content: {
    insight: 'You feel emotions clearly. You perceive them in yourself and others. But between the feeling and the action, there\'s a gap — the emotion arrives and you either get overwhelmed by it or push past it, rather than asking: "What is this feeling telling me? What action does it point toward?" Emotions are not just experiences. They are information to be used.',
    bodyCheck: 'Think of a recent strong emotion. Did you DO anything with it? Or did it just pass through? If it passed without informing any action, that\'s underutilization.',
    practice: 'This week, treat every significant emotion as a message. When a feeling arises, write: (1) What am I feeling? (2) What is this feeling responding to? (3) What action would honor this feeling? You don\'t have to take the action. But you practice seeing emotions as SIGNALS, not just weather.',
    quote: 'Emotions are not problems to be solved. They are compasses pointing toward what matters.', quoteAttribution: 'adapted from Steven Hayes',
  }},
  { patternId: 'eq_underutilized_emotions', modalityId: 'dbt', severity: 'high', content: {
    insight: 'You\'re strong on Observe but weak on Participate. The missing step is DESCRIBE — translating a felt emotion into language that informs action. "I feel something" becomes "I feel hurt because my need for closeness isn\'t being met, and the action this points to is asking for connection." That chain — feel, name, need, action — is the utilization skill.',
    bodyCheck: 'Right now, name what you\'re feeling. Can you get more specific than a single word? Instead of "fine" — tired, content, mildly anxious, hopeful? The specificity IS the utilization skill.',
    practice: 'Keep a note on your phone. Three times today, write: "I feel [specific emotion] because [trigger]. This suggests I need [need]. One thing I could do is [action]." Over a week, you\'ll have 21 entries. You\'re building the bridge between feeling and doing.',
    quote: 'The ability to name an emotion accurately is the first step toward using it wisely.', quoteAttribution: 'adapted from Marc Brackett',
  }},
  { patternId: 'eq_underutilized_emotions', modalityId: 'ifs', severity: 'high', content: {
    insight: 'Your system has a part that EXPERIENCES emotions and a separate part that ACTS — and they don\'t talk to each other. The Feeler picks up everything. The Doer operates on logic. When the Feeler sends a signal, the Doer ignores it. The work is building a bridge between these two parts.',
    bodyCheck: 'When making a decision about your relationship, where does the input come from — head or body? If it\'s almost always head, the body (where the Feeler lives) is being left out of the decision-making.',
    practice: 'Before your next relational decision, ask your body: "What do you know about this?" Put your hand on your chest or belly and wait 10 seconds. If an image, a word, or a sensation comes — include it in the decision.',
    quote: 'When all parts have a voice, the system makes wiser decisions than any single part could make alone.', quoteAttribution: 'adapted from Richard Schwartz',
  }},
  { patternId: 'eq_underutilized_emotions', modalityId: 'mi', severity: 'high', content: {
    insight: 'You have emotional information but you\'re not yet motivated to use it as a tool. The motivational question is: what would become possible in your relationship if you started using your emotional awareness as a guide for action? Not as a weapon. Not as a demand. As a compass.',
    bodyCheck: 'On a scale of 1-10, how important is it to you to get better at USING your emotions in your relationship? Whatever number you said — what would change if it went up by one?',
    practice: 'Try one emotion-informed conversation this week. Before you initiate it, check in: "What am I feeling right now about us?" Then let that feeling shape what you say. Not "We need to talk about the schedule" (logic-driven). Instead: "I\'ve been feeling distant from you and I want to reconnect" (emotion-driven).',
    quote: 'The emotion you don\'t use becomes the emotion that uses you.', quoteAttribution: 'adapted from William Miller',
  }},

  // ═══════════════════════════════════════════════════════════
  // EQ LOW ANXIOUS — 4 modalities at high severity
  // Low EQ + high anxiety. Can't read, can't manage, can't stop.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'eq_low_anxious', modalityId: 'polyvagal', severity: 'high', content: {
    insight: 'Your nervous system is in chronic alert mode — the sympathetic branch is highly activated, scanning for relational threat. But because your emotional perception is low, the alarm fires without giving you clear information about WHAT triggered it. You feel danger but can\'t name it. This creates a fog of anxiety — generalized dread without a target.',
    bodyCheck: 'Rate your anxiety 0-10. Now try to name what specifically is driving that number. If you can\'t identify a specific cause — if it\'s just "everything" or "I don\'t know" — that\'s the perception gap. The alarm is loud. The signal is unclear.',
    practice: 'Three times a day, stop and ask: "What am I feeling right now? Can I name it? Can I locate it in my body?" Even "I don\'t know" is an answer. Over weeks, "I don\'t know" becomes "I think I\'m worried about..." That progression IS the growth.',
    quote: 'When we can name what we feel, the feeling loses some of its power over us.', quoteAttribution: 'adapted from Dan Siegel',
  }},
  { patternId: 'eq_low_anxious', modalityId: 'dbt', severity: 'high', content: {
    insight: 'You need foundational skills — not advanced techniques. When EQ is low AND anxiety is high, the priority is building a basic emotion vocabulary and a basic regulation toolkit. Not insight. Not analysis. Skills. Think of it like learning a language: you need the basic words before you can have a conversation.',
    bodyCheck: 'When you\'re anxious, can you name 3 different emotions besides "anxious"? Worried? Scared? Hurt? Angry? If they all blur into one undifferentiated feeling, that\'s the first skill to build: differentiation.',
    practice: 'Start an emotion log. Five times today, write: the time, one emotion word (use a feelings wheel if needed), and a 1-10 intensity. Don\'t analyze. Don\'t explain. Just name and rate. This is the most foundational emotional intelligence exercise that exists, and it works.',
    quote: 'You don\'t have to understand your emotions to start working with them. You just have to notice them.', quoteAttribution: 'adapted from Marsha Linehan',
  }},
  { patternId: 'eq_low_anxious', modalityId: 'attachment', severity: 'high', content: {
    insight: 'Your anxiety is attachment anxiety — fear of disconnection, of being left, of not mattering enough. But because your emotional perception is low, the anxiety expresses itself in behaviors rather than words: clinginess, checking, irritability, withdrawal. Building emotional intelligence gives the anxiety a voice — and when anxiety can speak in words, it doesn\'t have to speak in behavior.',
    bodyCheck: 'Think about the last time you did something in your relationship that you later regretted. Before the behavior, there was a feeling. Can you find it now, looking back? That feeling is what your emotional intelligence is learning to catch BEFORE it becomes behavior.',
    practice: 'Next time you feel the urge to ACT on your anxiety (check, test, demand, withdraw), PAUSE. Write one sentence: "Right now I feel ___ because I\'m afraid ___." Writing it interrupts the anxiety-to-behavior pipeline.',
    quote: 'Anxiety that can be named is anxiety that can be managed. Anxiety that stays nameless runs the show.', quoteAttribution: 'adapted from Sue Johnson',
  }},
  { patternId: 'eq_low_anxious', modalityId: 'organic_intelligence', severity: 'high', content: {
    insight: 'Your body is carrying anxiety that your mind doesn\'t have words for. Your body learned to scan for danger without learning to interpret what it found. The body is smart — it\'s keeping you alert. But without the interpretation layer, the alertness becomes chronic and exhausting.',
    bodyCheck: 'Sit quietly for 30 seconds. Notice any sensation that feels like "something is wrong." Don\'t explain it. Where does it live? That location is your body\'s anxiety address. Knowing the address is the beginning of a relationship with the feeling.',
    practice: 'Once a day, put your hand on your anxiety\'s "address." Hold it gently. Breathe into that area. Say: "I feel you. I don\'t understand you yet. But I\'m not running from you." You\'re building a connection between your awareness and your activation, one hand at a time.',
    quote: 'The body has been speaking all along. The work is learning its language.', quoteAttribution: 'adapted from Steve Hoskinson',
  }},

  // ═══════════════════════════════════════════════════════════
  // EQ RESOURCE — 3 modalities (STRENGTH pattern, not deficit)
  // High EQ across all dimensions. Name and reinforce.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'eq_resource', modalityId: 'contemplative', severity: 'low', content: {
    insight: 'Your emotional intelligence is a genuine gift — you read the room, regulate yourself, help others regulate, and use emotional information wisely. This is rare. But a gift that isn\'t recognized can become a burden. You may carry the emotional labor of your relationship without acknowledgment. The contemplative invitation: can you hold this capacity with gratitude rather than resentment?',
    bodyCheck: 'Notice how much emotional information you\'re processing right now — about yourself, about whoever is near you, about the quality of the space. That processing is automatic. It costs energy. When was the last time you acknowledged that cost?',
    practice: 'This week, at the end of each day, take 30 seconds to appreciate your emotional intelligence. "Today I sensed my partner needed space, and I gave it. Today I managed my frustration without dumping it." You\'re not building a skill. You\'re honoring one that already exists.',
    quote: 'The most important relationship you can have is with your own gifts — knowing them, honoring them, and choosing when to offer them.', quoteAttribution: 'adapted from Parker Palmer',
  }},
  { patternId: 'eq_resource', modalityId: 'ifs', severity: 'low', content: {
    insight: 'Your emotional intelligence is likely led by a wise, capable Manager Part. This part deserves recognition. The invitation isn\'t to develop it further — it\'s to ask: does this part ever get to rest? Is there space in your system for NOT managing the emotional field? High EQ can become a prison if the part that provides it never gets a break.',
    bodyCheck: 'Imagine turning off your emotional radar for an hour. What happens at that thought? Relief? Terror? Both? That response tells you whether your EQ is a freely given gift or an obligation you can\'t put down.',
    practice: 'Give your emotional intelligence part a vacation — one hour this week where you deliberately DON\'T manage the emotional climate. Let things be what they are. If discomfort arises, that\'s the part that believes it\'s not safe to stop. Thank it, and keep resting.',
    quote: 'Even the most capable part of you deserves to rest. Self-leadership includes knowing when to lead and when to just be.', quoteAttribution: 'adapted from Richard Schwartz',
  }},
  { patternId: 'eq_resource', modalityId: 'act', severity: 'low', content: {
    insight: 'Your EQ is high and that\'s genuinely good. The ACT question: is your high EQ in service of your values, or has it become automatic — a reflex rather than a choice? There\'s a difference between CHOOSING to attune because connection matters and COMPULSIVELY attuning because you don\'t know how to stop.',
    bodyCheck: 'If you could turn your emotional radar down to 50% for a day, would you? If "yes, that would be a relief" — some of your EQ is compulsive, not chosen. If "no, I value this" — it\'s values-aligned. Both are okay. But knowing which one matters.',
    practice: 'Before each act of emotional attunement this week, ask: "Am I choosing this, or is this happening to me?" If choosing — continue, with full presence. If automatic — pause and ask: "What would I do right now if I weren\'t managing the emotional field?"',
    quote: 'The highest use of a skill is choosing when to use it — and choosing when to set it down.', quoteAttribution: 'adapted from Russ Harris',
  }},

  // ═══════════════════════════════════════════════════════════
  // VALUES INTIMACY AVOIDS CLOSENESS — 5 modalities at high severity
  // Wants deep intimacy, pulls away whenever it's offered.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'values_intimacy_avoids_closeness', modalityId: 'attachment', severity: 'high', content: {
    insight: 'This is the central wound of avoidant attachment: the desire for closeness is intact — you haven\'t lost it. But the approach system has been overridden by a deactivating strategy that says: "Closeness is where you get hurt." So you long for intimacy from a distance. That\'s not ambivalence. That\'s two systems — desire and protection — fighting for the steering wheel.',
    bodyCheck: 'Think about a moment when your partner offered closeness and you pulled away. Hold both: the part that wanted to receive it and the part that couldn\'t. Where does each live? The longing is usually chest or heart. The recoil is usually shoulders, jaw, or full-body tension.',
    practice: 'When your partner offers closeness, notice the recoil AND the longing. Don\'t follow either one. Say: "Part of me wants this. Part of me is scared. Both are true right now." Naming the conflict interrupts the automatic withdrawal.',
    quote: 'The avoidant heart doesn\'t stop wanting love. It stops believing love is safe.', quoteAttribution: 'adapted from Stan Tatkin',
  }},
  { patternId: 'values_intimacy_avoids_closeness', modalityId: 'ifs', severity: 'high', content: {
    insight: 'Your Protector Part and your Longing Part are in a painful polarity. The Longing Part aches for deep connection, real knowing, the surrender of being fully seen. The Protector stands between you and that surrender: "Last time we let someone in, we got destroyed." Both parts are right. The work isn\'t choosing between them — it\'s helping the Protector update its threat assessment.',
    bodyCheck: 'When closeness approaches, the Protector shows up as a physical sensation first — hardening, cooling, turning away. The Longing shows up afterward, once the closeness has passed — as sadness, regret, the quiet "Why did I do that again?" Can you feel the sequence?',
    practice: 'Have a written conversation between the two parts. Longing says: "I want to be close. Why won\'t you let me?" Protector says: "Because ___." Whatever it says is the exile\'s memory. That\'s what needs updating.',
    quote: 'A Protector that blocks intimacy isn\'t the enemy of love. It\'s the guardian of a wound that hasn\'t finished healing.', quoteAttribution: 'adapted from Richard Schwartz',
  }},
  { patternId: 'values_intimacy_avoids_closeness', modalityId: 'polyvagal', severity: 'high', content: {
    insight: 'Your autonomic nervous system has wired closeness to danger. When intimacy approaches, your neuroception fires a warning before your conscious mind can evaluate. Your body says "unsafe" while your mind says "I want this." The body wins. It always wins. Not because the body is right about THIS relationship, but because the body\'s threat library was written by an earlier one.',
    bodyCheck: 'Notice what happens when your partner moves toward you — physically or emotionally. Is there a micro-flinch? A subtle pulling back? A holding of breath? That\'s neuroception overriding desire.',
    practice: 'Practice titrated closeness: ask your partner to sit near you — not touching, just near — for 5 minutes. If your body stays settled, move slightly closer. If it activates, stay where you are. You\'re teaching your nervous system that closeness is survivable.',
    quote: 'The nervous system doesn\'t change through insight. It changes through repeated experiences of safety.', quoteAttribution: 'adapted from Stephen Porges',
  }},
  { patternId: 'values_intimacy_avoids_closeness', modalityId: 'act', severity: 'high', content: {
    insight: 'Your values say intimacy matters more than almost anything. Your behavior says you avoid it. This isn\'t hypocrisy — it\'s experiential avoidance: you\'re avoiding the INTERNAL EXPERIENCE (vulnerability, exposure, risk of rejection) that closeness requires. The question isn\'t "Do you want intimacy?" You clearly do. The question is: "Are you willing to feel the terror that intimacy asks you to feel?"',
    bodyCheck: 'What is the specific feeling you\'re avoiding when you pull away? Not the story. The feeling itself. Exposure? Vulnerability? Loss of control? Being seen? Name it. That\'s what you\'re actually avoiding — not your partner.',
    practice: 'Choose one small act of intimacy this week that your avoidance would normally block. Holding eye contact for 10 seconds. Saying "I missed you." Before you do it, say: "I\'m willing to feel uncomfortable for 60 seconds in service of the intimacy I value." Then do it. Then survive it.',
    quote: 'You don\'t have to want to feel vulnerable. You just have to be willing. Willingness is enough.', quoteAttribution: 'adapted from Steven Hayes',
  }},
  { patternId: 'values_intimacy_avoids_closeness', modalityId: 'contemplative', severity: 'high', content: {
    insight: 'The mystics all describe the same experience: the moment of surrender when the separate self dissolves into union with something larger. Your avoidance is the opposite of surrender — the separate self clinging to its boundaries because the last time those boundaries dissolved, the experience was wounding. Your longing for intimacy is a spiritual impulse — the desire to be fully known. Your avoidance is a survival impulse. Learning that some surrenders are safe is the path.',
    bodyCheck: 'Imagine being completely known by your partner — not the curated version, but all of it. The mess, the fear, the shame, the tenderness you hide. Notice what happens in your body. That reaction IS the work.',
    practice: 'This week, share one thing with your partner that you\'ve never shared — not a trauma. Something small and true: a memory, a fear, a wish. Something that lets them see one more inch of who you are. Surrender is not one big leap. It\'s a thousand small offerings.',
    quote: 'We long for the very thing we fear — to be fully known. That longing is the soul\'s memory of where it came from.', quoteAttribution: 'adapted from James Hollis',
  }},

  // ═══════════════════════════════════════════════════════════
  // VALUES AUTONOMY BUT FUSED — 4 modalities at high severity
  // Values independence but lives in enmeshment.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'values_autonomy_but_fused', modalityId: 'bowen', severity: 'high', content: {
    insight: 'You value independence — it\'s one of your core principles. But your fusion score tells a different story: your emotional life is organized around your partner. Their mood is your weather. Their opinion shapes your decisions. Fusion operates below the level of values — it\'s a relational pattern that runs deeper than belief.',
    bodyCheck: 'Imagine making a significant decision without consulting your partner. Not in secret. Just independently. What happens in your body? If the thought creates anxiety, that\'s the fusion. Your nervous system has wired autonomy to danger.',
    practice: 'This week, make one decision entirely yours — what to eat, where to go, how to spend an evening — without checking with your partner first. Notice the impulse to consult. That impulse is the fusion. Complete the decision without it.',
    quote: 'Differentiation is not distance. It is the ability to be yourself in the presence of another.', quoteAttribution: 'adapted from Murray Bowen',
  }},
  { patternId: 'values_autonomy_but_fused', modalityId: 'ifs', severity: 'high', content: {
    insight: 'You have an Autonomy Part that speaks clearly in your values — and a Fusion Part that runs your behavior. The Autonomy Part is aspirational. The Fusion Part is operational. Every time the Autonomy Part tries to assert itself, the Fusion Part panics: "If we separate even slightly, we\'ll lose them."',
    bodyCheck: 'When your Autonomy Part speaks ("I need space"), where does it speak from? Usually head or chest. When your Fusion Part responds ("But what if they\'re upset?"), where does THAT come from? Usually gut — primal, survival-level.',
    practice: 'Write a dialogue between the two parts. Autonomy says: "I need ___." Fusion says: "But if we ___, then ___." Then ask Self: "Is there a way to honor BOTH?" That third option is differentiation.',
    quote: 'When two parts are polarized, the system is stuck. When Self mediates, movement becomes possible.', quoteAttribution: 'adapted from Richard Schwartz',
  }},
  { patternId: 'values_autonomy_but_fused', modalityId: 'act', severity: 'high', content: {
    insight: 'Your value of autonomy is clear. Your behavior is fused. Is the fusion giving you the relationship you want? Or is it giving you a relationship where you\'re present in body but absent in self? The willingness move is being willing to feel the discomfort of having BOTH — being close AND being separate.',
    bodyCheck: 'How many decisions this week did you make based on what YOU wanted versus what you thought your partner wanted? If the ratio is heavily toward your partner, that\'s the fusion expressing itself through daily choices.',
    practice: 'Identify one value-aligned autonomous action this week. Before you do it, acknowledge the anxiety: "I notice I\'m anxious about doing this separately. I\'m willing to feel that because independence matters to me." Then do it.',
    quote: 'Values without action are just good intentions. Action in the presence of discomfort is where values come to life.', quoteAttribution: 'adapted from Steven Hayes',
  }},
  { patternId: 'values_autonomy_but_fused', modalityId: 'narrative', severity: 'high', content: {
    insight: 'You tell two stories that haven\'t met: "I\'m an independent person" and "I organize my life around my partner." Both are real. The fusion story dominates. Your autonomy story exists but it\'s been marginalized — it shows up in your values but not in your Tuesday.',
    bodyCheck: 'When you describe yourself to others, which story do you tell? "I\'m independent" or "We do everything together"? Notice which one your body believes more.',
    practice: 'Write a "unique outcome" — a time you DID act autonomously and the relationship survived. Maybe improved. Describe it in detail. This single counter-example proves autonomy and connection can coexist. One example is all you need to start re-authoring.',
    quote: 'An alternative story doesn\'t erase the dominant one. It opens a door beside it.', quoteAttribution: 'adapted from Michael White',
  }},

  // ═══════════════════════════════════════════════════════════
  // VALUES GROWTH RESISTS CHANGE — 4 modalities at high severity
  // Values growth but personality resists novelty and change.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'values_growth_resists_change', modalityId: 'mi', severity: 'high', content: {
    insight: 'You value growth — it\'s one of your non-negotiables. And yet your openness score suggests you prefer the familiar. This isn\'t a contradiction. It\'s ambivalence: the part that wants to grow and the part that wants to stay safe are both active. The question isn\'t "Why don\'t you change?" It\'s "What would make change feel safe enough to attempt?"',
    bodyCheck: 'How important is personal growth to you (1-10)? How comfortable are you with the uncertainty growth requires (1-10)? The gap between those numbers is where your resistance lives.',
    practice: 'Answer honestly: "If I fully committed to the growth my values point toward, what would I have to give up?" The thing you\'d have to give up is what your low openness is protecting. Knowing what you\'re protecting makes the resistance intelligible, not shameful.',
    quote: 'People don\'t resist change. They resist the loss that change requires.', quoteAttribution: 'adapted from William Miller',
  }},
  { patternId: 'values_growth_resists_change', modalityId: 'act', severity: 'high', content: {
    insight: 'Your value says grow. Your behavior says stay. What are you unwilling to experience that growth would require? Vulnerability? Failure? Not knowing? The exposure of being a beginner? The specific thing you\'re avoiding is more informative than the general resistance.',
    bodyCheck: 'Imagine committing to one significant change in how you show up in your relationship. A new one. A scary one. What does your body do? The contraction, the "not yet" — that\'s the experiential avoidance blocking the growth your values demand.',
    practice: 'Choose the smallest possible growth action — so small your resistance can\'t argue with it. Not "transform how I communicate." Try: "Ask my partner one genuine question about their inner world that I\'ve never asked before." Micro-growth accumulates.',
    quote: 'You don\'t have to want to grow. You just have to be willing to take the next small step.', quoteAttribution: 'adapted from Russ Harris',
  }},
  { patternId: 'values_growth_resists_change', modalityId: 'narrative', severity: 'high', content: {
    insight: 'Your growth value was authored by the part of you that envisions who you could become. The resistance was authored by the part that remembers what change cost you in the past. We don\'t discard either chapter. We read them side by side and ask: which one gets to write the next page?',
    bodyCheck: 'When you hear advice that resonates, what happens an hour later? Does the resonance fade into "I already knew that"? That fading is the dominant narrative reasserting itself over the alternative story.',
    practice: 'Choose one insight from your Tender portrait that made you uncomfortable. Write it on a card. Put it somewhere visible. Not to shame yourself. To keep the alternative story visible. Growth doesn\'t happen in the moment of insight. It happens when the insight survives the return to routine.',
    quote: 'The problem story doesn\'t disappear. It just makes room for another story to grow alongside it.', quoteAttribution: 'adapted from David Epston',
  }},
  { patternId: 'values_growth_resists_change', modalityId: 'aqal', severity: 'high', content: {
    insight: 'Your values have developed to a stage that prizes growth and transformation, but your personality structure is still operating at an earlier, more conventional stage that prizes stability. This isn\'t hypocrisy. It\'s developmental lag: your values are pulling you forward and your structure is anchoring you. Both are doing their job.',
    bodyCheck: 'Does "growth" feel exciting or threatening in your body? Expansive or exposing? Your body\'s response tells you whether growth is currently experienced as opportunity or danger.',
    practice: 'Identify one area where you\'ve already grown — a way you relate to your partner now that\'s different from two years ago. Name it. This is evidence that your system CAN grow. Use your own history to reassure the part that fears change.',
    quote: 'Development is not a straight line upward. It is a spiral — revisiting the same themes at greater depth each time.', quoteAttribution: 'adapted from Ken Wilber',
  }},

  // ═══════════════════════════════════════════════════════════
  // LOW DIFFERENTIATION FUSED — 5 modalities at high severity
  // No clear "I" position. Identity merged with partner's.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'low_differentiation_fused', modalityId: 'bowen', severity: 'high', content: {
    insight: 'In Bowen\'s framework, this is the foundational issue: you haven\'t yet developed a solid self — a set of beliefs, values, and positions that remain stable under relational pressure. Instead, you have a pseudo-self that shape-shifts to match whoever you\'re closest to. This isn\'t love. It\'s undifferentiation.',
    bodyCheck: 'Ask yourself: what do I believe about [any topic your partner has strong opinions on]? If your first response is your PARTNER\'S position, not your own — that\'s the undifferentiation. Try again: what do YOU believe?',
    practice: 'This week, form one opinion about something that matters — WITHOUT knowing your partner\'s position first. Don\'t ask them. Just decide what YOU think. Write it down. This is I-position practice.',
    quote: 'The ability to define a self, to know what you believe and to act on it, without being dependent on the approval of others — that is the essence of differentiation.', quoteAttribution: 'adapted from Murray Bowen',
  }},
  { patternId: 'low_differentiation_fused', modalityId: 'ifs', severity: 'high', content: {
    insight: 'Your system doesn\'t have a strong Self at the center — the parts are organized around one directive: maintain connection at all costs. The Accommodator reads your partner\'s needs. The Chameleon adjusts your personality. The Peacekeeper suppresses anything that might create distance. These parts are working HARD — but they\'re preserving a connection that isn\'t actually threatened by you having your own self.',
    bodyCheck: 'Sit quietly and ask: "Who am I when I\'m not with my partner?" If the answer feels empty, blurry, or anxious — that\'s the starting point. The emptiness is where the self will grow.',
    practice: 'Spend 20 minutes doing something purely yours — not your partner\'s interest, not a shared activity. If you struggle to identify what that is, start there: make a list of 10 things YOU enjoy. If the list is hard to write, that difficulty IS the diagnostic.',
    quote: 'When Self is present, the parts don\'t disappear. They just stop running the show.', quoteAttribution: 'adapted from Richard Schwartz',
  }},
  { patternId: 'low_differentiation_fused', modalityId: 'aca', severity: 'high', content: {
    insight: 'Undifferentiation often begins in childhood — in families where having your own self was a threat to the family system. You learned: "My job is to fit in, not stand out. My feelings matter less than the family\'s equilibrium." You carried this program into adulthood. Your partner didn\'t create the undifferentiation. Your family of origin did.',
    bodyCheck: 'When you think about asserting yourself, does the resistance feel like a relationship fear or does it feel older? If it connects to something from childhood, that\'s the family-of-origin programming.',
    practice: 'Write a letter to your childhood family system: "In my family, I was expected to ___. I wasn\'t allowed to ___. The role I played was ___. What I learned about having a self was ___." Then write one sentence about what you want to be different now.',
    quote: 'We repeat what we don\'t repair.', quoteAttribution: 'Common therapeutic wisdom',
  }},
  { patternId: 'low_differentiation_fused', modalityId: 'polyvagal', severity: 'high', content: {
    insight: 'Your nervous system has wired separateness to danger — being different from your partner activates your threat system as if you were being abandoned. Your early environment taught: attunement = sameness. If you matched the emotional state of your caregivers, you were safe. If you diverged, you were at risk.',
    bodyCheck: 'The next time you disagree with your partner about something trivial, notice what happens in your body in the first 3 seconds. A jolt? Tightening? Anxiety disproportionate to the disagreement? That\'s your nervous system treating difference as a survival threat.',
    practice: 'Practice micro-disagreement in safe contexts: express a different preference about something low-stakes. Stay present to your body. Breathe through the activation. Let your nervous system learn that difference does not equal disconnection.',
    quote: 'The nervous system that can tolerate difference is the nervous system that can tolerate intimacy.', quoteAttribution: 'Tender',
  }},
  { patternId: 'low_differentiation_fused', modalityId: 'dbt', severity: 'high', content: {
    insight: 'You need the FAST skill: Fair to yourself, no Apologies for existing, Stick to your values, be Truthful. Right now you\'re unfair to yourself, apologizing for having needs, abandoning your values to keep peace, and being untruthful about what you want. FAST isn\'t about being aggressive. It\'s about being present.',
    bodyCheck: 'Think of the last time you abandoned your own position. How did it feel afterward? Resentment? Flatness? Self-contempt? That\'s the cost of chronic undifferentiation. Your body keeps the bill.',
    practice: 'Use FAST this week: (F) "Am I being fair to myself?" (A) Don\'t apologize for stating your preference. (S) "Is what I\'m doing aligned with my values or my fear?" (T) Say one true thing you would normally suppress.',
    quote: 'Self-respect is not built by sacrificing yourself. It is built by showing up as yourself and letting the relationship hold it.', quoteAttribution: 'Tender',
  }},

  // ═══════════════════════════════════════════════════════════
  // REACTIVE UNDEFINED — 4 modalities at high severity
  // High reactivity + no solid self. Erupts with no direction.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'reactive_undefined', modalityId: 'polyvagal', severity: 'high', content: {
    insight: 'Your nervous system has a hair-trigger sympathetic response — it goes from resting to fight-or-flight with almost no warning. And because your sense of self is still forming, there\'s no internal anchor to hold against the surge. Think of a boat in a storm with no keel: every wave throws you completely. Your work is building the keel.',
    bodyCheck: 'Notice how fast you go from calm to activated. Seconds? Minutes? And when activated, is there any part observing, or does it consume you completely? The observer — however faint — is the beginning of the keel.',
    practice: 'When you feel the surge beginning, place both feet flat on the floor and press down. Feel the ground. This is your anchor point. You\'re building the keel one moment of grounding at a time. Not insight. Not understanding. Ground contact.',
    quote: 'Before you can hold a position, you must be able to hold your own body.', quoteAttribution: 'adapted from Deb Dana',
  }},
  { patternId: 'reactive_undefined', modalityId: 'dbt', severity: 'high', content: {
    insight: 'You need two skills urgently: STOP (when reactivity fires) and opposite action (to build the self). STOP keeps you from doing damage during the surge. Opposite action means: when your reactivity says "Explode," you practice deliberate calm. Over time, this builds the self-structure you\'re missing.',
    bodyCheck: 'After your last reactive episode, what did you wish you had done differently? That gap between what happened and what you wanted is where the skill goes.',
    practice: 'Commit to STOP every time: (S) Stop moving and talking. (T) Take a step back, physically. (O) Observe: "I\'m at a 7/10. My body wants to ___." (P) Proceed mindfully: choose ONE response different from your default.',
    quote: 'Opposite action is not about being fake. It is about choosing who you want to be instead of letting your impulses choose for you.', quoteAttribution: 'adapted from Marsha Linehan',
  }},
  { patternId: 'reactive_undefined', modalityId: 'bowen', severity: 'high', content: {
    insight: 'You are experiencing chronic emotional reactivity without the ballast of a defined self. The reactivity isn\'t guided by principles or a clear position — it\'s guided by the emotional weather. You react to tone shifts, perceived slights — not from "this matters to me because ___" but from "something happened and I\'m activated."',
    bodyCheck: 'After a reactive moment, ask: "What was I standing FOR in that reaction?" If the answer is vague or just "I was upset," that\'s the undefined self. Reactivity without purpose is the signal.',
    practice: 'Write down 5 things you believe. Not your partner\'s beliefs. Not what you SHOULD believe. Five things that are YOURS. If you can\'t find 5, start with 1. That one belief — held clearly — is the first brick of your I-position.',
    quote: 'An undefined self is a reactive self. Definition is the first act of emotional maturity.', quoteAttribution: 'adapted from Murray Bowen',
  }},
  { patternId: 'reactive_undefined', modalityId: 'ifs', severity: 'high', content: {
    insight: 'Your system has powerful Firefighter Parts and a very young, undeveloped Self at the center. When a Firefighter fires and there\'s no Self to catch it, the Firefighter IS the response. Building Self-energy gives the Firefighters something to report TO rather than something to take over.',
    bodyCheck: 'In your last reactive episode, was there any moment — even a flash — where you thought "I don\'t want to be doing this"? That flash was Self, briefly visible through the Firefighter\'s smoke.',
    practice: 'After each reactive episode, sit for 2 minutes and ask: "Which part took over? What were they afraid would happen if they didn\'t react?" Don\'t judge. Thank the part: "I see you. Next time, I want to be the one who decides." This builds Self-energy.',
    quote: 'Self doesn\'t develop in the absence of parts. It develops in relationship with them.', quoteAttribution: 'adapted from Richard Schwartz',
  }},

  // ═══════════════════════════════════════════════════════════
  // POROUS BOUNDARIES — 5 modalities at high severity
  // High ER + high fusion. Absorbs partner's emotions, can't distinguish whose is whose.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'porous_boundaries', modalityId: 'bowen', severity: 'high', content: {
    insight: 'Your boundaries are not walls — they\'re membranes. And right now those membranes are too permeable. Everything your partner feels flows through into you. In Bowen\'s terms, this is an undifferentiated ego mass operating at the couple level. The work isn\'t building walls. It\'s thickening the membrane enough that you can feel without being CONSUMED.',
    bodyCheck: 'Scan your emotional state. How much is about YOUR day, and how much leaked in from your partner? If you can\'t tell — that\'s the porous boundary in action.',
    practice: 'Practice emotional sorting three times today: "What am I feeling? Is this mine, theirs, or ours?" Write three columns: MINE, THEIRS, OURS. Sort each feeling. You won\'t be perfectly accurate. The point is practicing the DISTINCTION.',
    quote: 'The boundary between self and other is not a wall. It is a living edge — permeable enough for intimacy, firm enough for identity.', quoteAttribution: 'adapted from Roberta Gilbert',
  }},
  { patternId: 'porous_boundaries', modalityId: 'polyvagal', severity: 'high', content: {
    insight: 'Your nervous system mirrors your partner\'s with unusual fidelity — when they\'re activated, your sympathetic system fires. When they collapse, your dorsal vagal drops. You are neurobiologically entangled. The issue isn\'t that you mirror. The issue is your system has no return-to-self mechanism.',
    bodyCheck: 'After your next interaction, take your emotional temperature. Then ask: "Was this temperature mine BEFORE the interaction, or did I absorb it during?" If you can\'t remember your pre-interaction state, the mirroring is overriding your self-awareness.',
    practice: 'Build a return-to-self ritual: after every charged interaction, 60 seconds alone. Both hands on your belly. Breathe slowly. Say: "I return to myself. What am I feeling that is mine?" Don\'t analyze. Just return to YOUR baseline.',
    quote: 'Co-regulation is the ability to be moved by another\'s state. Self-regulation is the ability to return to your own.', quoteAttribution: 'adapted from Deb Dana',
  }},
  { patternId: 'porous_boundaries', modalityId: 'ifs', severity: 'high', content: {
    insight: 'Your system has a Sponge Part that absorbs the emotional atmosphere with no filter. This part probably developed in childhood as a way to stay safe. Brilliant adaptation. But now it runs continuously, absorbing your partner\'s emotions without checking whether absorption is necessary. The work is helping the Sponge Part install a filter.',
    bodyCheck: 'Where does absorption happen in your body? Most people feel it in the solar plexus or chest. Put your hand there. Ask: "How much of what you\'re holding right now belongs to someone else?"',
    practice: 'Before entering your partner\'s emotional field, take 10 seconds to establish YOUR state: hand on belly, "I feel ___. This is mine." Then enter the interaction. When you notice yourself absorbing, check: "Is this still mine, or did I just pick up theirs?"',
    quote: 'The Sponge Part doesn\'t need to be silenced. It needs to be taught: not everything that passes through your field needs to be absorbed.', quoteAttribution: 'adapted from Richard Schwartz',
  }},
  { patternId: 'porous_boundaries', modalityId: 'ecopsychology', severity: 'high', content: {
    insight: 'In the ecology of your relationship, you are like a wetland — you absorb and filter everything that flows through. Wetlands are essential. But a wetland without boundaries becomes a flood plain. You are the wetland. Your partner\'s emotions are the water. The work is restoring the banks.',
    bodyCheck: 'Go outside. Stand at the edge of something — a curb, a garden border, a shoreline. Feel the edge. Now bring that felt sense of EDGE back to your body. Where is the edge between you and your partner?',
    practice: 'Spend time near water this week. Watch how water has its own surface, its own boundary. It touches the container but doesn\'t BECOME the container. You are not your partner\'s emotions. You are the shore they wash against. Practice feeling the shore.',
    quote: 'Boundaries in nature aren\'t barriers. They\'re the edges where different ecosystems meet — and where the most life happens.', quoteAttribution: 'adapted from Bill Plotkin',
  }},
  { patternId: 'porous_boundaries', modalityId: 'dbt', severity: 'high', content: {
    insight: 'Your boundary porousness means you need FAST and Distress Tolerance skills specifically for emotional absorption. The standard model assumes your distress is YOUR distress. Yours often isn\'t — it\'s distress you absorbed. The first skill isn\'t regulation. It\'s IDENTIFICATION: is this mine?',
    bodyCheck: 'When carrying a heavy emotion, run this check: "Did I have this feeling before I encountered my partner today? Or did it arrive with them?" This simple before-vs-after check is the most practical boundary tool you can develop.',
    practice: 'Create a daily boundary check: morning (before interactions) and evening (after). Morning: "I feel ___. This is my baseline." Evening: "I feel ___. How much arrived from outside?" The gap — beyond what YOUR day accounts for — is what you absorbed. Name it. Set it down.',
    quote: 'The first step of emotion regulation is knowing which emotions are yours to regulate.', quoteAttribution: 'adapted from Marsha Linehan',
  }},

  // ═══════════════════════════════════════════════════════════
  // HEALTHY DEEP EMPATHY — 3 modalities (STRENGTH pattern)
  // High ER + high I-position. Feels deeply AND holds center.
  // ═══════════════════════════════════════════════════════════
  { patternId: 'healthy_deep_empathy', modalityId: 'contemplative', severity: 'low', content: {
    insight: 'You have achieved something rare: the ability to feel deeply without losing yourself. You enter your partner\'s emotional world and feel it genuinely, in your own body. But you don\'t get lost there. You maintain your own center. This is genuine compassion: "I feel with you, and I remain myself." In contemplative traditions, this capacity is considered the fruit of deep practice.',
    bodyCheck: 'Notice how it feels to hold someone\'s pain without collapsing into it. There\'s usually a quality of spaciousness — the pain is present but doesn\'t fill the whole room. That spaciousness IS your differentiation experienced somatically.',
    practice: 'When you hold space for your partner\'s emotion, notice the moment where you feel WITH them but remain YOU. Name it: "I\'m feeling with you and I\'m still here." This naming isn\'t for them. It\'s for you — to recognize what you\'ve built.',
    quote: 'Compassion is not drowning in another\'s suffering. It is standing at the edge of the water, fully feeling the cold, and offering your steady hand.', quoteAttribution: 'adapted from Pema Chodron',
  }},
  { patternId: 'healthy_deep_empathy', modalityId: 'ifs', severity: 'low', content: {
    insight: 'Your Self-energy is strong. When your partner is in distress, your parts don\'t take over — Self stays present. The Empathy Part feels what your partner feels, and Self holds it, and neither collapses. This is Self-leadership in its highest relational expression. Not everyone\'s system works this way. Yours does.',
    bodyCheck: 'When you hold your partner\'s pain, notice your chest. Is there warmth? Expansion? A quality of "I can hold this"? That physical sensation is Self-energy in your body. It\'s different from empathic flooding. Learn to recognize the difference.',
    practice: 'Share this capacity with your partner as an offering: "I want you to know that when you\'re hurting, I feel it with you. And I\'m still here. You don\'t have to protect me from your pain." This gives them permission to bring their full experience into the relationship.',
    quote: 'The goal of all inner work is this: to feel fully and to remain.', quoteAttribution: 'adapted from Richard Schwartz',
  }},
  { patternId: 'healthy_deep_empathy', modalityId: 'ecopsychology', severity: 'low', content: {
    insight: 'You are like an old-growth tree — deeply rooted and also deeply connected to the ecosystem around you. Your roots go down (I-position) and your canopy reaches out (empathic resonance). Both systems are developed. Neither overwhelms the other. In the ecology of your relationship, you are the stabilizing presence.',
    bodyCheck: 'Feel your rootedness — feet on ground, weight in chair. Now extend awareness to whoever is near you — can you sense their state without losing your ground? That simultaneous rooting and reaching is your signature capacity.',
    practice: 'Walk in nature this week and practice your dual capacity: feel the environment while maintaining awareness of your own body, your own mood, your own center. This is what you do in relationship — doing it in nature reinforces the capacity without relational stakes.',
    quote: 'The strongest trees are not the ones that block the wind. They are the ones that learned to bend without breaking.', quoteAttribution: 'Traditional wisdom',
  }},
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
