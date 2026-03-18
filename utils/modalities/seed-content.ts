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
      quoteAttribution: 'Sue Johnson',
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
      quoteAttribution: 'Richard Schwartz',
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
      quoteAttribution: 'Stephen Porges',
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
      quoteAttribution: 'Steven Hayes',
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
      quoteAttribution: 'Michael White',
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
      quoteAttribution: 'Viktor Frankl',
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
      quoteAttribution: 'Richard Schwartz',
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
      quoteAttribution: 'Russ Harris',
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
      quoteAttribution: 'Murray Bowen',
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
      quoteAttribution: 'Richard Schwartz',
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
      quoteAttribution: 'Deb Dana',
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
      quoteAttribution: 'Steve Hoskinson',
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
      quoteAttribution: 'James Hollis',
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
      quoteAttribution: 'Steven Hayes',
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
      quoteAttribution: 'Michael White',
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
      quoteAttribution: 'Blaise Pascal',
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
      quoteAttribution: 'Richard Schwartz',
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
      quoteAttribution: 'Thich Nhat Hanh',
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
      quoteAttribution: 'Dan Siegel',
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
      quoteAttribution: 'Marsha Linehan',
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
      quoteAttribution: 'Steven Hayes',
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
      quoteAttribution: 'Jay Earley',
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
      quoteAttribution: 'Ken Wilber',
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
