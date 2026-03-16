/**
 * Pairwise Integration Functions
 * ────────────────────────────────────────────
 * 21 pairwise functions — one for each unique pair of 7 domains.
 * Each produces a developmental arc: protection → cost → emergence.
 *
 * Priority pairs (built first):
 * 1. attachment × EQ (foundation × navigation)
 * 2. attachment × conflict (foundation × conflict)
 * 3. attachment × differentiation (foundation × stance)
 * 4. EQ × differentiation (navigation × stance)
 * 5. conflict × values (conflict × compass)
 * 6. EQ × conflict (navigation × conflict)
 *
 * Then remaining 15 pairs.
 */

import type { IntegrationScores, IntegrationResult, DomainId } from './types';
import {
  isAnxious, isAvoidant, isSecure,
  getAnxiety, getAvoidance, getAttachmentStyle,
  getN, getE, getO, getA, getC,
  getEQTotal, getEQPerception, getEQManagingSelf, getEQManagingOthers, getEQUtilization,
  getDSITotal, getReactivity, getIPosition, getFusion, getCutoff,
  getConflictStyle, getSecondaryStyle, getYielding, getAvoiding, getForcing, getProblemSolving,
  getTopValues, getAvgValueGap, getBiggestGapValue,
} from './helpers';

type PairKey = `${DomainId}×${DomainId}`;

/** Registry of all pairwise integration functions */
const PAIRWISE_REGISTRY: Record<string, (s: IntegrationScores) => IntegrationResult> = {};

function register(a: DomainId, b: DomainId, fn: (s: IntegrationScores) => IntegrationResult) {
  // Register both orderings so lookup works regardless of selection order
  PAIRWISE_REGISTRY[`${a}×${b}`] = fn;
  PAIRWISE_REGISTRY[`${b}×${a}`] = fn;
}

/** Look up a pairwise integration by domain pair */
export function getPairwiseIntegration(
  a: DomainId,
  b: DomainId,
  scores: IntegrationScores,
): IntegrationResult | null {
  const fn = PAIRWISE_REGISTRY[`${a}×${b}`];
  if (!fn) return null;
  return fn(scores);
}

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 1: Attachment × EQ (foundation × navigation)
// ═══════════════════════════════════════════════════════

register('foundation', 'navigation', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const secure = isSecure(s);
  const eqHigh = getEQTotal(s) >= 65;
  const perception = getEQPerception(s);
  const managing = getEQManagingSelf(s);

  if (anxious && eqHigh) {
    return {
      title: 'The Empathic Radar',
      subtitle: 'Your attachment × emotional intelligence',
      body: `You feel everything — and you're actually good at reading the room. Your anxiety isn't a flaw in your emotional system; it's a sensitivity that pairs with genuine perceptive ability. The problem isn't that you feel too much. It's that you can't always tell the difference between what you're sensing in another person and what your attachment system is projecting.\n\nYour EQ perception score (${Math.round(perception)}) shows real skill at reading emotional cues. But when attachment anxiety activates (${getAnxiety(s).toFixed(1)}/7), that same perception gets hijacked. You start reading FOR threat instead of reading FOR information. Your partner's neutral face becomes evidence of withdrawal. Their silence becomes rejection.`,
      arc: {
        protection: 'You developed a hypervigilant emotional radar — constantly scanning for signs of disconnection. This helped you anticipate and prevent abandonment in relationships where attention wasn\'t guaranteed.',
        cost: 'Your genuine emotional perception gets flooded by attachment noise. You read real signals AND phantom ones, and can\'t always tell which is which. This leads to pursuing reassurance for threats that aren\'t there.',
        emergence: 'What wants to emerge is trustworthy perception — the ability to read the room without your attachment alarm adding its own soundtrack. Your EQ is real. Your anxiety just keeps turning up the volume.',
      },
      practice: 'This week, when you notice yourself reading your partner\'s mood: pause. Ask yourself: "Am I sensing something real, or am I scanning for danger?" If you\'re not sure, say: "I\'m noticing something — can I check it with you?" Let the answer land before reacting.',
      oneThing: 'Let what you feel become information, not instruction.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
    };
  }

  if (anxious && !eqHigh) {
    return {
      title: 'The Unfiltered Signal',
      subtitle: 'Your attachment × emotional intelligence',
      body: `Your attachment system runs hot (anxiety: ${getAnxiety(s).toFixed(1)}/7), and your emotional processing tools are still developing (EQ: ${Math.round(getEQTotal(s))}). This creates a specific pattern: you feel the intensity of connection/disconnection acutely, but have fewer resources for managing those feelings once they arrive.\n\nThis isn't a character flaw — it's a developmental edge. You were shaped by relationships where you needed to feel a lot but didn't get help learning what to do with those feelings. The signal is real. The filter is what's growing.`,
      arc: {
        protection: 'You learned to let your emotions drive action directly — reaching, clinging, protesting — because the signal felt too urgent to process first.',
        cost: 'Without stronger emotional management, your attachment activation often leads to reactive behavior that pushes partners away, confirming the very fear that started the cycle.',
        emergence: 'Building your EQ alongside your attachment awareness means learning to feel the pull without being pulled. The intensity doesn\'t need to decrease — your capacity to hold it does.',
      },
      practice: 'When you feel attachment activation (urgency, need to reach out, fear of losing connection): name it out loud to yourself. "My attachment system just activated." Then do one grounding thing (hands on counter, three breaths) before responding.',
      oneThing: 'You feel deeply. Learning to hold what you feel changes everything.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
    };
  }

  if (avoidant && eqHigh) {
    return {
      title: 'The Contained Reader',
      subtitle: 'Your attachment × emotional intelligence',
      body: `Here's the paradox: you're actually quite good at reading emotions (EQ: ${Math.round(getEQTotal(s))}), but your avoidant attachment (${getAvoidance(s).toFixed(1)}/7) means you tend to process those readings at a distance. You can see what someone is feeling without letting it move you. It's like watching weather through a window.\n\nThis makes you excellent in crisis — calm, perceptive, steady. But in intimate relationships, your partner may feel the gap between your perception and your response. They sense that you see them clearly but won't come closer.`,
      arc: {
        protection: 'You learned that emotional information is safer when it doesn\'t require emotional engagement. Seeing without being moved kept you safe in relationships where closeness was overwhelming or unreliable.',
        cost: 'Your partner experiences a strange loneliness — being seen but not reached. Your emotional intelligence becomes a tool for managing distance rather than building connection.',
        emergence: 'What wants to happen is emotional intelligence that doesn\'t just observe but participates. You already have the skill. The edge is letting it cost you something — letting what you see actually move you.',
      },
      practice: 'Once this week, when you notice your partner\'s emotional state: don\'t just register it. Let yourself be affected by it. Say what you see AND what it does to you: "I can see you\'re sad, and it makes me want to be closer to you." Let the response be slightly uncomfortable.',
      oneThing: 'You see clearly. The invitation is to let what you see move you.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
    };
  }

  if (avoidant && !eqHigh) {
    return {
      title: 'The Quiet Distance',
      subtitle: 'Your attachment × emotional intelligence',
      body: `Your avoidant attachment (${getAvoidance(s).toFixed(1)}/7) combines with still-developing emotional skills (EQ: ${Math.round(getEQTotal(s))}). This creates a pattern where you pull away from emotional intensity not because you're choosing space, but because you don't quite have the tools to process what's coming at you.\n\nThis isn't coldness — it's overwhelm that looks like detachment. Your nervous system learned that distance is safer than trying to engage with emotions you can't fully read or manage.`,
      arc: {
        protection: 'Emotional distance protected you from having to process feelings you weren\'t equipped to handle. Retreat became your default coping mechanism.',
        cost: 'Partners experience your distance as rejection. You miss emotional information that could actually help the relationship because you\'ve stepped back too far to read it.',
        emergence: 'Building emotional intelligence alongside softening your avoidance creates a virtuous cycle — the more you can process, the less you need to retreat. Start small.',
      },
      practice: 'Once a day, check in with your own emotional state. Not your partner\'s — yours. "What am I feeling right now?" Name it, even if the answer is "I don\'t know." That noticing IS the practice.',
      oneThing: 'Getting closer starts with noticing what you feel — not what they need.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
    };
  }

  // Secure
  return {
    title: 'The Integrated Heart',
    subtitle: 'Your attachment × emotional intelligence',
    body: `Your secure attachment base pairs ${eqHigh ? 'beautifully' : 'well'} with your emotional intelligence. Security means you approach emotional information without the distortion of threat — you can read the room because you're not scanning for danger.\n\n${eqHigh ? 'Your high EQ means you have genuine skill at perceiving, managing, and using emotions in relationships. Combined with security, this gives you a rare capacity to be present with difficult emotions without either merging with them or running from them.' : 'Your EQ is still developing, which means there\'s room to deepen the emotional skills that your secure base makes available. Security gives you the safety to learn — use it.'}`,
    arc: {
      protection: 'You were fortunate to develop in relationships where emotional closeness was mostly safe. Your protection isn\'t a wall — it\'s a flexible boundary that opens and closes appropriately.',
      cost: eqHigh
        ? 'The cost is subtle: you may not fully appreciate how your security feels to others, or you may underestimate how hard emotional engagement is for people without your base.'
        : 'With developing EQ, you may sometimes miss emotional nuances that partners are broadcasting, not because you\'re defending, but because the skill is still growing.',
      emergence: eqHigh
        ? 'What wants to emerge is mentoring capacity — you can model emotional engagement for a partner who struggles with it.'
        : 'What wants to emerge is the full use of your secure base as a learning platform — security gives you the safest possible conditions to grow emotional skill.',
    },
    practice: eqHigh
      ? 'This week, notice one moment where your partner is struggling emotionally. Instead of solving it, just be with them in it. Let your security be a gift of presence, not problem-solving.'
      : 'Pick one emotional skill to practice: noticing emotions in others, naming your own feelings, or sitting with discomfort without fixing it. Your security makes practice safer.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['foundation', 'navigation'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 2: Attachment × Conflict (foundation × conflict)
// ═══════════════════════════════════════════════════════

register('foundation', 'conflict', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const style = getConflictStyle(s);

  if (anxious && (style === 'yielding' || style === 'compromising')) {
    return {
      title: 'The Peace at Any Price',
      subtitle: 'Your attachment × conflict style',
      body: `Your attachment anxiety (${getAnxiety(s).toFixed(1)}/7) meets a yielding/compromising conflict style. This makes perfect developmental sense: when connection feels fragile, disagreement feels dangerous. You've learned to give ground quickly — not because you don't have a position, but because having a position feels like it might cost you the relationship.\n\nThe tragedy is that your yielding isn't generosity — it's fear wearing a generous mask. And over time, the things you swallow don't disappear. They accumulate into resentment that eventually erupts in ways that feel disproportionate.`,
      arc: {
        protection: 'Yielding in conflict preserved the connection. If you never push back, you never risk being left for pushing back. This kept relationships intact in the short term.',
        cost: 'You lose yourself in the relationship. Your needs go unmet, your voice goes unheard, and the resentment builds underground. Partners may also feel frustrated that they can never get a real "no" from you.',
        emergence: 'What wants to emerge is a voice that can disagree without the ground shaking. Not aggression — just the quiet confidence that your needs matter as much as the connection.',
      },
      practice: 'This week, find one small thing you\'d normally yield on and hold your position. It should be low-stakes: what to eat, what to watch, how to spend an hour. Notice how it feels in your body to not immediately give in. That discomfort is growth.',
      oneThing: 'Your relationships need your voice, not just your accommodation.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
    };
  }

  if (anxious && (style === 'forcing' || style === 'problemSolving')) {
    return {
      title: 'The Urgent Fixer',
      subtitle: 'Your attachment × conflict style',
      body: `Your anxiety (${getAnxiety(s).toFixed(1)}/7) drives urgency, and your ${style === 'forcing' ? 'forcing' : 'problem-solving'} style channels that urgency into action. When conflict arises, you don't just want resolution — you need it now. The distance that disagreement creates feels intolerable, so you push hard toward closure.\n\nThe irony is that your push for quick resolution often prevents real resolution. Your partner feels steamrolled or over-managed, and the surface agreement you achieve doesn't address the underlying tension.`,
      arc: {
        protection: 'Moving fast in conflict meant moving past the danger zone quickly. If you could solve it or force it closed, you wouldn\'t have to sit in the uncertainty of disconnection.',
        cost: 'Your partner feels controlled rather than heard. The "solutions" often serve your anxiety more than the actual problem. Real intimacy requires the ability to sit in unresolved tension.',
        emergence: 'What wants to emerge is the capacity to stay in conflict without needing to close it. Not passivity — engaged patience. Trusting that the relationship can hold disagreement.',
      },
      practice: 'Next time a disagreement starts, set a boundary with yourself: "I will listen for 5 minutes before offering any solution or position." Let your partner finish completely. Then say what you heard before saying what you think.',
      oneThing: 'The relationship can survive the pause between the problem and the solution.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
    };
  }

  if (avoidant && (style === 'avoiding' || style === 'yielding')) {
    return {
      title: 'The Vanishing Act',
      subtitle: 'Your attachment × conflict style',
      body: `Your avoidant attachment (${getAvoidance(s).toFixed(1)}/7) pairs with a conflict-avoiding tendency, creating a double withdrawal pattern. When tension rises, everything in you says: leave. Not dramatically — just quietly. Change the subject, agree to end it, go do something else.\n\nThis isn't laziness or not caring. Your nervous system learned that conflict = emotional overwhelm, and withdrawal = safety. The avoidant attachment and conflict avoidance reinforce each other perfectly — and create the same result: nothing gets resolved, and your partner feels invisible.`,
      arc: {
        protection: 'Double withdrawal created a firewall between you and emotional intensity. If you never engage with the conflict, you never have to feel overwhelmed by it.',
        cost: 'Your partner carries all the emotional labor. Issues pile up unaddressed. The relationship slowly hollows out — not with a bang, but with a thousand quiet retreats.',
        emergence: 'What wants to emerge is the ability to stay — even briefly — when everything says go. Not forever. Just five minutes longer than your instinct tells you.',
      },
      practice: 'When you notice the pull to withdraw from a conversation, say: "I\'m noticing I want to pull back. Can you give me a minute to stay here?" Then stay. For one minute. That\'s the practice.',
      oneThing: 'Staying for one more minute is the bravest thing your pattern can do.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
    };
  }

  if (avoidant && (style === 'forcing' || style === 'problemSolving')) {
    return {
      title: 'The Efficient Resolver',
      subtitle: 'Your attachment × conflict style',
      body: `An interesting combination: avoidant attachment (${getAvoidance(s).toFixed(1)}/7) with a ${style === 'forcing' ? 'forcing' : 'problem-solving'} conflict approach. You don't run from conflict — you run THROUGH it. Quickly, efficiently, with minimal emotional messiness. Get to the solution, move on, return to comfortable distance.\n\nThis works beautifully at work. In intimate relationships, it can feel to your partner like you're solving a problem they wanted to be heard about. The "resolution" serves your need for emotional distance more than it serves the relationship.`,
      arc: {
        protection: 'Quick, logical conflict resolution meant you never had to sit in emotional discomfort. Getting to a solution fast was a form of emotional escape.',
        cost: 'Your partner feels managed rather than met. The emotional layer of the conflict — the part that matters most in intimacy — gets bypassed entirely.',
        emergence: 'What wants to emerge is the willingness to let a conflict be about feelings before it\'s about solutions. To hear "I\'m hurt" without immediately jumping to "here\'s how we fix it."',
      },
      practice: 'Next conflict: before offering any solution, ask "Do you need me to listen or help solve?" If they say listen — just listen. Resist the problem-solving reflex for the entire conversation.',
      oneThing: 'Sometimes the solution your partner needs is your presence, not your fix.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
    };
  }

  // Secure + any conflict style
  return {
    title: 'The Grounded Engager',
    subtitle: 'Your attachment × conflict style',
    body: `Your secure base gives you something rare in conflict: the ability to disagree without it threatening the foundation of the relationship. Your ${style} conflict style operates from a place of relative safety — you don't fight to preserve the connection or to control the distance.\n\n${style === 'problemSolving' ? 'Your problem-solving approach is genuine rather than anxiety-driven. You actually want to find the best outcome, not just the fastest exit from tension.' : style === 'compromising' ? 'Your compromising style comes from genuine flexibility rather than fear. You give ground because it makes sense, not because you\'re afraid to stand.' : 'Even your ' + style + ' tendencies operate differently from a secure base — they\'re choices rather than compulsions.'}`,
    arc: {
      protection: 'Security didn\'t require elaborate conflict strategies. You could engage because the relationship felt durable enough to hold disagreement.',
      cost: 'You may underestimate how disorienting conflict is for less secure partners. Your "just talk about it" expectation may not match their nervous system reality.',
      emergence: 'What wants to emerge is deeper compassion for how hard conflict is for others, paired with your natural ability to model that engagement is safe.',
    },
    practice: 'This week in a disagreement, check in with your partner\'s experience of the conflict itself — not just the topic. "How are you feeling about us right now?" Let them know the relationship is safe even in the tension.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['foundation', 'conflict'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 3: Attachment × Differentiation (foundation × stance)
// ═══════════════════════════════════════════════════════

register('foundation', 'stance', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const diffHigh = getDSITotal(s) >= 60;
  const fusionLow = getFusion(s) < 50;
  const iPositionLow = getIPosition(s) < 50;

  if (anxious && fusionLow) {
    return {
      title: 'The Loving Merger',
      subtitle: 'Your attachment × differentiation',
      body: `Your attachment anxiety (${getAnxiety(s).toFixed(1)}/7) pairs with high fusion (low boundary clarity: ${Math.round(getFusion(s))}). This means you don't just want closeness — you tend to merge. Your partner's feelings become your feelings. Their mood becomes your weather. When they're upset, you're upset. When they're distant, you're lost.\n\nThis merger isn't weakness — it was brilliant adaptation. In early relationships where you had to track the other person's state to stay safe, losing the boundary between their experience and yours was necessary. Now it's the very thing that makes closeness feel suffocating — for both of you.`,
      arc: {
        protection: 'Merging dissolved the space where abandonment could happen. If there\'s no boundary between you and them, they can\'t leave without taking you along.',
        cost: 'You lose yourself. Your partner feels responsible for your emotional state. The relationship becomes a pressure cooker of shared reactivity with no one holding steady ground.',
        emergence: 'What wants to emerge is closeness WITH a self — the ability to feel deeply connected while maintaining a clear "I" inside the "we."',
      },
      practice: 'When you notice your mood shifting to match your partner\'s: pause. Say internally: "That\'s their feeling. What am I actually feeling right now?" The goal isn\'t distance — it\'s distinction.',
      oneThing: 'You can love someone completely without becoming them.',
      depth: 'pairwise',
      domains: ['foundation', 'stance'],
      confidence: 'high',
    };
  }

  if (anxious && diffHigh) {
    return {
      title: 'The Aware Reacher',
      subtitle: 'Your attachment × differentiation',
      body: `You have an interesting combination: attachment anxiety (${getAnxiety(s).toFixed(1)}/7) with relatively strong differentiation (${Math.round(getDSITotal(s))}). This means you feel the pull toward connection intensely, but you also have the capacity to hold onto yourself while you feel it. You can NOTICE the anxiety without it running the show.\n\nThis is actually a powerful position for growth. Many people with attachment anxiety are so fused that they can't see the pattern. You can see it — which means you can work with it.`,
      arc: {
        protection: 'Your anxiety developed in one relational context; your differentiation developed in another. The anxiety is your alarm system; differentiation is your observer.',
        cost: 'You may experience internal conflict — the pull to pursue and the awareness that pursuing won\'t help. This can create paralysis or self-criticism.',
        emergence: 'What wants to emerge is integration: using your differentiation as a tool to channel your attachment energy into genuine connection rather than anxious pursuit.',
      },
      practice: 'When attachment anxiety activates, use your differentiation: "I notice my system wanting to reach. I\'m going to let this feeling be here without acting on it for 10 minutes." Then check in with what actually needs to happen.',
      oneThing: 'You already see the pattern. Now trust yourself to choose differently inside it.',
      depth: 'pairwise',
      domains: ['foundation', 'stance'],
      confidence: 'high',
    };
  }

  if (avoidant && diffHigh) {
    return {
      title: 'The Fortified Self',
      subtitle: 'Your attachment × differentiation',
      body: `Your avoidance (${getAvoidance(s).toFixed(1)}/7) combines with strong differentiation (${Math.round(getDSITotal(s))}), creating an exceptionally self-contained person. You know who you are, you hold your ground, and you don't easily get pulled into other people's emotional weather. This looks like strength — and in many ways, it is.\n\nBut there's a question worth sitting with: is your differentiation genuine self-clarity, or is it avoidance wearing the costume of maturity? True differentiation includes the ability to stay connected under pressure. If "knowing yourself" always means staying separate, it might be serving distance more than clarity.`,
      arc: {
        protection: 'High differentiation + avoidance created an impenetrable self. No one could pull you into their chaos, because you were always clearly "you."',
        cost: 'You may be differentiated FROM others rather than differentiated IN relationship. The test is: can you hold your ground AND let someone in?',
        emergence: 'What wants to emerge is differentiation that softens — self-clarity that doesn\'t require distance. Knowing who you are while letting another person\'s experience touch you.',
      },
      practice: 'This week, let your partner influence you on something. Not something huge — a preference, an opinion, a plan. Notice how it feels to let their input change yours. That flexibility IS differentiation, not fusion.',
      oneThing: 'True strength includes the ability to be moved.',
      depth: 'pairwise',
      domains: ['foundation', 'stance'],
      confidence: 'high',
    };
  }

  if (avoidant && !diffHigh) {
    return {
      title: 'The Reactive Retreater',
      subtitle: 'Your attachment × differentiation',
      body: `Your avoidance (${getAvoidance(s).toFixed(1)}/7) paired with lower differentiation (${Math.round(getDSITotal(s))}) reveals something important: your distance isn't chosen from a place of clarity — it's reactive. You pull away not because you have a clear sense of self, but because closeness overwhelms you before you can find yourself in it.\n\nThis is often confused with being "independent." But true independence comes from a solid self that can handle connection. What you may be experiencing is emotional overwhelm disguised as self-sufficiency.`,
      arc: {
        protection: 'Retreat looked like self-reliance but was actually protection from emotional flooding. Without strong differentiation, closeness felt like losing yourself.',
        cost: 'You get lonely in your own retreat. Partners feel shut out. And the distance doesn\'t actually build the self-clarity you need — it just postpones the overwhelm.',
        emergence: 'What wants to emerge is building a self sturdy enough to stay present. Not closeness first — selfhood first. From a clearer "I," closeness becomes less threatening.',
      },
      practice: 'Before you withdraw from emotional intensity, ask: "Am I choosing space, or am I being pushed by overwhelm?" If overwhelm, try: "I need a few minutes — I\'m coming back." Then actually come back.',
      oneThing: 'Build the self first. Closeness will feel less dangerous when you know who\'s showing up.',
      depth: 'pairwise',
      domains: ['foundation', 'stance'],
      confidence: 'high',
    };
  }

  // Secure
  return {
    title: 'The Rooted Partner',
    subtitle: 'Your attachment × differentiation',
    body: `Security (${getAttachmentStyle(s)}) paired with ${diffHigh ? 'strong' : 'developing'} differentiation creates a solid relational foundation. You can be close without losing yourself, and you can hold your ground without it threatening the connection.${!diffHigh ? ' Your differentiation is still growing, which means there\'s room to develop an even clearer sense of self within your relationships.' : ''}`,
    arc: {
      protection: 'A secure base naturally supports healthy differentiation — you didn\'t need elaborate defenses because closeness wasn\'t threatening.',
      cost: diffHigh ? 'You may take for granted how hard this is for others.' : 'With developing differentiation, you may occasionally lose yourself in a partner\'s needs without realizing it.',
      emergence: diffHigh
        ? 'Model for others what it looks like to be both connected and self-defined.'
        : 'Continue building self-clarity. Your secure base is the perfect platform for it.',
    },
    practice: diffHigh
      ? 'Notice where your partner struggles with the balance of closeness and self. Offer your stability without judgment.'
      : 'Identify one area where you tend to defer to your partner\'s preferences. Practice holding your own position — gently.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['foundation', 'stance'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 4: EQ × Differentiation (navigation × stance)
// ═══════════════════════════════════════════════════════

register('navigation', 'stance', (s) => {
  const eqHigh = getEQTotal(s) >= 65;
  const diffHigh = getDSITotal(s) >= 60;
  const fusionScore = getFusion(s);
  const reactivity = getReactivity(s);

  if (eqHigh && !diffHigh) {
    return {
      title: 'The Empathic Sponge',
      subtitle: 'Your EQ × differentiation',
      body: `You have strong emotional perception (EQ: ${Math.round(getEQTotal(s))}) but your differentiation is still developing (${Math.round(getDSITotal(s))}). This means you read the room brilliantly — but you absorb what you read. Other people's emotions become your emotions. You can tell exactly what your partner is feeling, and then you're feeling it too.\n\nThis is exhausting. Your emotional intelligence has no filter, no boundary that lets you perceive without merging. You're an excellent reader who can't put the book down.`,
      arc: {
        protection: 'Absorbing others\' emotions was a survival strategy — by feeling what they feel, you could predict and respond. It kept you attuned and safe.',
        cost: 'Emotional exhaustion, loss of self in the other\'s experience, and partners who sense you can\'t hold your own ground when emotions get intense.',
        emergence: 'What wants to emerge is emotional perception WITH boundaries — the ability to see what\'s happening in the other person without becoming it. Your EQ stays. The filter develops.',
      },
      practice: 'Practice "compassionate witnessing": when your partner shares difficult emotions, imagine a clear glass wall between you. You can see them. You can feel with them. But their feelings stay on their side. Say: "I can see how hard that is" rather than feeling it yourself.',
      oneThing: 'You can see what they feel without carrying it.',
      depth: 'pairwise',
      domains: ['navigation', 'stance'],
      confidence: 'high',
    };
  }

  if (!eqHigh && diffHigh) {
    return {
      title: 'The Boundaried Observer',
      subtitle: 'Your EQ × differentiation',
      body: `You hold your ground well (differentiation: ${Math.round(getDSITotal(s))}) but your emotional reading skills are still developing (EQ: ${Math.round(getEQTotal(s))}). This means you know who you are and don't easily get pulled — but you may miss the emotional signals that tell you what's happening in the other person.\n\nYour partner may experience you as "solid but hard to reach." You're stable, which they value. But they wish you could see more of what they're going through without them having to spell it out.`,
      arc: {
        protection: 'Strong boundaries developed before strong emotional reading. This kept you self-defined but potentially isolated from the emotional information that relationships run on.',
        cost: 'Partners feel unseen. Your stability can feel like emotional unavailability when you miss their signals. They have to be explicit about feelings you could learn to perceive.',
        emergence: 'Growing your emotional intelligence while maintaining your boundaries creates the ideal: someone who can read the room without being consumed by it.',
      },
      practice: 'This week, practice active emotional noticing: three times a day, look at someone close to you and ask yourself "What might they be feeling right now?" Don\'t act on it — just practice perceiving.',
      oneThing: 'Your boundaries are strong. Now let them have windows.',
      depth: 'pairwise',
      domains: ['navigation', 'stance'],
      confidence: 'high',
    };
  }

  if (eqHigh && diffHigh) {
    return {
      title: 'The Centered Reader',
      subtitle: 'Your EQ × differentiation',
      body: `This is one of the most powerful combinations in relational life: high emotional intelligence (${Math.round(getEQTotal(s))}) paired with strong differentiation (${Math.round(getDSITotal(s))}). You can read the room AND hold yourself in what you read. You perceive without absorbing, connect without merging, respond without reacting.\n\nThis is rare. Most people either read well and merge, or hold themselves and miss signals. You do both. The question for you isn't about developing a skill — it's about how you use this capacity.`,
      arc: {
        protection: 'These two capacities may have developed independently — emotional intelligence through one set of experiences, differentiation through another. Together, they create unusual relational stability.',
        cost: 'Others may find your combination intimidating. You see clearly and aren\'t easily destabilized, which can make less differentiated partners feel exposed or inadequate.',
        emergence: 'Use this combination generously. You can hold space for others\' emotional storms without being swept away — that\'s a gift.',
      },
      practice: 'Notice where others around you struggle with the balance of feeling and holding. Offer your presence as a model — not advice, just the experience of being with someone who can feel deeply and stay grounded.',
      oneThing: null,
      depth: 'pairwise',
      domains: ['navigation', 'stance'],
      confidence: 'high',
    };
  }

  // Both developing
  return {
    title: 'The Growing Edge',
    subtitle: 'Your EQ × differentiation',
    body: `Both your emotional intelligence (${Math.round(getEQTotal(s))}) and differentiation (${Math.round(getDSITotal(s))}) are in development. This is actually a gift — you're building both skills at the same time, which means they can grow together rather than creating the imbalances that happen when one outpaces the other.\n\nThe simultaneous development of reading emotions AND holding yourself while you read them is the core of relational maturity. You're building both muscles at once.`,
    arc: {
      protection: 'Neither skill developed far enough to become a crutch. This keeps you flexible and open to growth.',
      cost: 'In intense moments, you may feel doubly overwhelmed — unable to read what\'s happening clearly AND unable to hold yourself steady in it.',
      emergence: 'Small, consistent practice in both areas creates exponential growth. Each skill supports the other.',
    },
    practice: 'Start with self-awareness: three times daily, check in. "What am I feeling?" (builds EQ) "Is that mine or theirs?" (builds differentiation). This 10-second practice builds both muscles simultaneously.',
    oneThing: 'Every small check-in builds two muscles at once.',
    depth: 'pairwise',
    domains: ['navigation', 'stance'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 5: Conflict × Values (conflict × compass)
// ═══════════════════════════════════════════════════════

register('conflict', 'compass', (s) => {
  const style = getConflictStyle(s);
  const topValues = getTopValues(s);
  const avgGap = getAvgValueGap(s);
  const biggestGap = getBiggestGapValue(s);
  const gapHigh = avgGap >= 3;

  const topValStr = topValues.slice(0, 3).join(', ');

  if ((style === 'yielding' || style === 'avoiding') && gapHigh) {
    return {
      title: 'The Silent Compromise',
      subtitle: 'Your conflict style × values',
      body: `You value ${topValStr} — but your ${style} conflict style means you rarely fight for what matters to you. The values-action gap (avg: ${avgGap.toFixed(1)}/10${biggestGap ? `, biggest: ${biggestGap.value} at ${biggestGap.gap}/10` : ''}) isn't just about daily habits. It's about what happens when living your values requires confrontation.\n\nEvery time you yield or avoid to keep the peace, you're choosing the relationship over your values. That sounds noble — but over time, it creates a person who doesn't recognize themselves. The resentment isn't about the argument you didn't have. It's about the self you didn't protect.`,
      arc: {
        protection: 'Avoiding conflict about values meant never having to test whether the relationship could hold your real priorities. Safer to quietly compromise than risk discovering it can\'t.',
        cost: 'Your values-action gap widens. You know what matters but can\'t live it because living it would require conversations you\'re unwilling to have. The gap IS the conflict you\'re avoiding.',
        emergence: 'What wants to emerge is the courage to say: "This matters to me." Not as an ultimatum — as an invitation. Your values need your voice.',
      },
      practice: `Pick the value with your biggest gap${biggestGap ? ` (${biggestGap.value})` : ''}. Identify one way this gap connects to something you've been avoiding discussing. Have a 5-minute conversation about it. Start with: "Something important to me that I haven't been naming..."`,
      oneThing: 'Your values can only live in your relationships if you give them a voice.',
      depth: 'pairwise',
      domains: ['conflict', 'compass'],
      confidence: 'high',
    };
  }

  if ((style === 'forcing' || style === 'problemSolving') && gapHigh) {
    return {
      title: 'The Values Warrior',
      subtitle: 'Your conflict style × values',
      body: `You care deeply about ${topValStr} and you're willing to fight for what matters. But your values-action gap (avg: ${avgGap.toFixed(1)}/10) suggests that the fight itself might be getting in the way of actually living these values.\n\nWhen your ${style} style engages around values, it can become righteous — "I'm right because this MATTERS." The intensity of your engagement may be correct in content but counterproductive in delivery. You're fighting for the right things in a way that undermines them.`,
      arc: {
        protection: 'Fighting hard for values felt like integrity. If it matters, you should push for it. Anything less felt like compromise.',
        cost: 'Your partner experiences your values-driven conflict as being lectured or controlled. The fight about values damages the relationship, which is itself one of your values.',
        emergence: 'What wants to emerge is living values through invitation rather than insistence. Show rather than argue. Embody rather than enforce.',
      },
      practice: 'This week, pick one value you tend to argue about. Instead of making a case for it, live it visibly. If you value quality time, create it. If you value honesty, share something vulnerable. Let the value speak for itself.',
      oneThing: 'The most persuasive argument for a value is living it.',
      depth: 'pairwise',
      domains: ['conflict', 'compass'],
      confidence: 'high',
    };
  }

  // Low gap or other conflict styles
  return {
    title: 'Where Your Fights Meet Your Heart',
    subtitle: 'Your conflict style × values',
    body: `Your ${style} conflict style meets your core values (${topValStr}).${gapHigh ? ` There\'s a notable gap (${avgGap.toFixed(1)}/10) between what you value and how you live it.` : ' Your values and actions are relatively aligned.'}\n\n${gapHigh ? 'The question is: how does your conflict style either help or hinder closing that gap? Every unresolved tension about values keeps the gap open.' : 'When your values are aligned with your actions, conflict becomes cleaner — you fight from a place of clarity rather than unmet need.'}`,
    arc: {
      protection: `Your ${style} approach to conflict developed to protect what mattered. It's your default strategy for when important things are at stake.`,
      cost: gapHigh
        ? 'The gap between your values and actions may itself be a source of unacknowledged conflict — internal tension that leaks into external disagreements.'
        : 'Even with good alignment, be aware of how your conflict style interacts with your partner\'s values — they may matter just as deeply about different things.',
      emergence: gapHigh
        ? 'Closing the values-action gap often requires a new kind of conflict — not with your partner, but with the part of you that\'s been avoiding change.'
        : 'Your alignment gives you a clear compass in conflict. Use it to stay oriented to what actually matters when disagreements heat up.',
    },
    practice: gapHigh
      ? `Identify the value with the biggest gap. Ask: "Is there a conversation I need to have — with myself or my partner — to start closing this?" Have it.`
      : 'In your next disagreement, pause and ask: "Which of my values is this actually about?" Name it. It grounds the conflict in something real.',
    oneThing: gapHigh ? 'The gap between your values and your life is waiting for one honest conversation.' : null,
    depth: 'pairwise',
    domains: ['conflict', 'compass'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 6: EQ × Conflict (navigation × conflict)
// ═══════════════════════════════════════════════════════

register('navigation', 'conflict', (s) => {
  const eqHigh = getEQTotal(s) >= 65;
  const style = getConflictStyle(s);
  const managingSelf = getEQManagingSelf(s);
  const perception = getEQPerception(s);

  if (eqHigh && (style === 'avoiding' || style === 'yielding')) {
    return {
      title: 'The Aware Avoider',
      subtitle: 'Your EQ × conflict style',
      body: `You see everything (EQ: ${Math.round(getEQTotal(s))}) but you don't engage with what you see (${style} conflict style). This is a specific kind of frustration: you know exactly what's happening in the emotional field of a disagreement — the tension, the hurt, the fear — and you choose to step around it rather than into it.\n\nThis isn't low EQ. It's high EQ deployed defensively. You use your emotional intelligence to anticipate and avoid conflict rather than to navigate through it. You can see the storm perfectly — and you route around it.`,
      arc: {
        protection: 'Your emotional perception showed you how painful conflict can be — for everyone. Avoiding it wasn\'t ignorance; it was informed retreat. You saw the cost and decided not to pay it.',
        cost: 'Issues accumulate because you see them but don\'t address them. Your partner may not even know there\'s a problem until it\'s become too big to handle. Your awareness becomes a burden you carry alone.',
        emergence: 'What wants to emerge is using your EQ not just to read conflict but to engage with it skillfully. You already have the map. The edge is walking the territory.',
      },
      practice: 'This week, notice one thing you\'d normally avoid addressing. Instead of routing around it, name it gently: "I notice there\'s something between us about ___. Can we talk about it?" Let your EQ guide the conversation rather than prevent it.',
      oneThing: 'You already see it. Now say it.',
      depth: 'pairwise',
      domains: ['navigation', 'conflict'],
      confidence: 'high',
    };
  }

  if (!eqHigh && (style === 'forcing' || style === 'problemSolving')) {
    return {
      title: 'The Blind Driver',
      subtitle: 'Your EQ × conflict style',
      body: `You engage conflict directly (${style} style) but your emotional reading is still developing (EQ: ${Math.round(getEQTotal(s))}). This means you charge into disagreements without always reading the emotional landscape. You know WHAT you think but may miss HOW your partner is experiencing the conversation.\n\nThis creates a pattern where you "win" arguments but lose connection. The factual resolution happens, but the emotional repair doesn't — because you didn't see the emotional damage in real-time.`,
      arc: {
        protection: 'Leading with logic and force worked when emotional nuance wasn\'t available. If you can\'t read the room, you can at least control it.',
        cost: 'Partners feel bulldozed. Even when you\'re right, the way you engage leaves emotional wreckage you don\'t fully perceive.',
        emergence: 'Building emotional perception transforms your natural engagement from blunt force to skilled navigation. Same energy, much better outcomes.',
      },
      practice: 'In your next disagreement, stop twice to ask: "How are you feeling right now — not about the issue, but about how this conversation is going?" Listen to the answer. Adjust.',
      oneThing: 'Slow down enough to see what your words are doing.',
      depth: 'pairwise',
      domains: ['navigation', 'conflict'],
      confidence: 'high',
    };
  }

  if (eqHigh && (style === 'forcing' || style === 'problemSolving')) {
    return {
      title: 'The Skilled Engager',
      subtitle: 'Your EQ × conflict style',
      body: `High EQ (${Math.round(getEQTotal(s))}) meets an engaging conflict style (${style}). This is a powerful combination — you can read the emotional landscape of a disagreement AND you're willing to engage with it. You see what's happening and you show up.\n\nThe risk is sophistication: you may use your emotional intelligence to strategize in conflict rather than to connect. You can read your partner's vulnerabilities and — consciously or not — leverage them. Or you may overwhelm less skilled partners with your combination of insight and drive.`,
      arc: {
        protection: 'This combination developed as a sophisticated way to maintain both connection and control in difficult conversations.',
        cost: 'Partners may feel outmatched. Your ability to both read AND engage means arguments feel unbalanced. They can\'t read you as well as you read them.',
        emergence: 'Use your skill to create safety, not advantage. The highest use of EQ in conflict is helping the OTHER person feel seen, not winning more effectively.',
      },
      practice: 'Next disagreement: use your EQ to focus entirely on your partner\'s experience. Don\'t advocate for your position for the first 5 minutes. Just reflect what you see in them. Then share your perspective.',
      oneThing: null,
      depth: 'pairwise',
      domains: ['navigation', 'conflict'],
      confidence: 'high',
    };
  }

  // Low EQ + avoiding/yielding
  return {
    title: 'The Quiet Struggle',
    subtitle: 'Your EQ × conflict style',
    body: `Your developing EQ (${Math.round(getEQTotal(s))}) pairs with a ${style} conflict approach. This combination can create a cycle where you don't fully understand what's happening emotionally in disagreements, so you default to avoidance or accommodation.\n\nIt's not that you don't care — it's that conflict feels confusing. Without clear emotional perception, disagreements feel like storms with no weather map. No wonder you'd rather stay inside.`,
    arc: {
      protection: 'When you can\'t read the emotional landscape, avoiding it is rational. Why engage with territory you can\'t navigate?',
      cost: 'Issues go unaddressed because you lack both the perception to understand them AND the tools to engage with them.',
      emergence: 'Building emotional intelligence naturally changes your conflict capacity. As you learn to read what\'s happening, engaging becomes less frightening.',
    },
    practice: 'Start building your emotional vocabulary. After any interaction with your partner, ask yourself: "What was I feeling? What might they have been feeling?" Don\'t act on it yet — just practice noticing.',
    oneThing: 'Understanding what you feel is the first step toward showing up in conflict.',
    depth: 'pairwise',
    domains: ['navigation', 'conflict'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// REMAINING PAIRS (11 more)
// ═══════════════════════════════════════════════════════

// Attachment × Personality (foundation × instrument)
register('foundation', 'instrument', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const nHigh = getN(s) >= 65;
  const eHigh = getE(s) >= 65;
  const aHigh = getA(s) >= 65;

  const title = anxious && nHigh ? 'The Amplified Signal'
    : avoidant && !eHigh ? 'The Quiet Fortress'
    : anxious && aHigh ? 'The Gentle Pursuer'
    : avoidant && nHigh ? 'The Hidden Storm'
    : 'Your Temperament × Attachment';

  return {
    title,
    subtitle: 'Your attachment × personality',
    body: anxious && nHigh
      ? `Your high neuroticism (${Math.round(getN(s))}th percentile) amplifies your attachment anxiety. The sensitivity that makes you deep and perceptive also makes your attachment alarm louder than most. Every signal of disconnection reverberates through a nervous system already tuned to detect threat.`
      : avoidant && !eHigh
      ? `Your introverted temperament (E: ${Math.round(getE(s))}th percentile) and avoidant attachment reinforce each other. Your natural preference for solitude provides the perfect cover for emotional distance. It's hard to tell where temperament ends and avoidance begins — and that ambiguity serves the distance.`
      : `Your personality traits shape how your attachment system expresses itself. ${anxious ? 'Your anxiety' : avoidant ? 'Your avoidance' : 'Your security'} gets filtered through your specific temperament — ${nHigh ? 'your sensitivity amplifies it' : eHigh ? 'your social energy channels it outward' : aHigh ? 'your warmth softens it' : 'creating your unique relational signature'}.`,
    arc: {
      protection: anxious && nHigh
        ? 'Sensitivity + anxiety created a hypervigilant system that catches every subtle shift in connection.'
        : avoidant && !eHigh
        ? 'Introversion + avoidance created a self-contained world that felt safe and sustainable.'
        : 'Your temperament and attachment style developed together, each reinforcing the other\'s tendencies.',
      cost: anxious && nHigh
        ? 'Emotional exhaustion from a system that\'s always scanning. False alarms are frequent and draining.'
        : avoidant && !eHigh
        ? 'Partners can\'t tell if you need space or are avoiding intimacy. The legitimate need for solitude hides the avoidant pattern.'
        : 'Your temperament can make your attachment patterns feel more "natural" than they are — harder to see as patterns because they feel like personality.',
      emergence: anxious && nHigh
        ? 'Channel your sensitivity toward perception rather than protection. The same system that detects threats can detect beauty, nuance, and genuine connection.'
        : avoidant && !eHigh
        ? 'Distinguish between genuine introversion (restorative solitude) and avoidant withdrawal (defensive distance). They feel the same but serve different masters.'
        : 'Notice where personality and attachment overlap. The distinction matters for growth.',
    },
    practice: anxious && nHigh
      ? 'When sensitivity spikes, label it: "temperament" or "attachment alarm"? This distinction alone reduces reactivity.'
      : avoidant && !eHigh
      ? 'Track your withdrawals this week. After each one, note: "Did I need that space, or was I avoiding something?" Be honest.'
      : 'Notice one way your personality makes your attachment pattern feel "just who I am." Question that assumption gently.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['foundation', 'instrument'],
    confidence: 'high',
  };
});

// Personality × EQ (instrument × navigation)
register('instrument', 'navigation', (s) => {
  const nHigh = getN(s) >= 65;
  const aHigh = getA(s) >= 65;
  const oHigh = getO(s) >= 65;
  const eqHigh = getEQTotal(s) >= 65;

  return {
    title: nHigh && eqHigh ? 'The Sensitive Perceiver'
      : aHigh && eqHigh ? 'The Natural Attunement'
      : nHigh && !eqHigh ? 'The Raw Nerve'
      : 'Your Temperament × Emotional Skill',
    subtitle: 'Your personality × EQ',
    body: nHigh && eqHigh
      ? `Your sensitivity (N: ${Math.round(getN(s))}th) gives you access to a wide emotional range, and your EQ (${Math.round(getEQTotal(s))}) helps you use that range skillfully. You feel deeply AND you know what to do with what you feel. This is a powerful combination for relational depth — you access emotions others miss and can channel them constructively.`
      : nHigh && !eqHigh
      ? `Your sensitivity (N: ${Math.round(getN(s))}th) gives you intense emotional access, but your EQ (${Math.round(getEQTotal(s))}) hasn't caught up yet. You feel everything at high volume without the processing tools to manage it. This creates overwhelm that isn't about the emotions themselves — it's about the gap between what you feel and what you can do with it.`
      : `Your personality traits shape how your emotional intelligence operates. ${aHigh ? 'Your natural warmth gives your EQ a generous orientation — you tend to use emotional skill for others.' : oHigh ? 'Your openness lets you approach emotional complexity with curiosity rather than fear.' : 'Your specific temperament creates a unique emotional style.'}`,
    arc: {
      protection: nHigh
        ? 'Sensitivity was a survival tool — feel everything to miss nothing. Whether that becomes a gift or a burden depends on the processing skills around it.'
        : 'Your temperament shaped which emotional skills you developed first and which lagged.',
      cost: nHigh && !eqHigh
        ? 'Emotional flooding. You react before you can process, and the intensity of your experience can overwhelm both you and your partner.'
        : 'There may be a mismatch between the emotions you naturally access and the skills you\'ve built to manage them.',
      emergence: nHigh
        ? 'Building EQ around your sensitivity transforms it from a vulnerability to a superpower. The goal isn\'t feeling less — it\'s handling more.'
        : 'Growing into the emotional skills that match your temperament creates authentic emotional intelligence rather than performed emotional management.',
    },
    practice: nHigh && !eqHigh
      ? 'When emotions spike, practice the "name it to tame it" approach: say the emotion out loud ("I\'m feeling overwhelmed"). This simple act engages your prefrontal cortex and reduces amygdala reactivity.'
      : 'Identify which emotions you handle well and which catch you off guard. Focus practice on your weaker area.',
    oneThing: nHigh && !eqHigh ? 'Naming what you feel is the bridge between sensitivity and skill.' : null,
    depth: 'pairwise',
    domains: ['instrument', 'navigation'],
    confidence: 'high',
  };
});

// Personality × Differentiation (instrument × stance)
register('instrument', 'stance', (s) => {
  const nHigh = getN(s) >= 65;
  const eHigh = getE(s) >= 65;
  const diffHigh = getDSITotal(s) >= 60;

  return {
    title: nHigh && !diffHigh ? 'The Reactive Sensitivity'
      : !nHigh && diffHigh ? 'The Steady Core'
      : nHigh && diffHigh ? 'The Differentiated Feeler'
      : 'Your Temperament × Selfhood',
    subtitle: 'Your personality × differentiation',
    body: nHigh && !diffHigh
      ? `High sensitivity (N: ${Math.round(getN(s))}th) meets developing differentiation (${Math.round(getDSITotal(s))}). When emotions run hot and boundaries are porous, every interaction becomes high-stakes. Your partner's mood destabilizes you not because you're weak, but because your sensitive temperament amplifies what your underdeveloped boundaries let in.`
      : nHigh && diffHigh
      ? `An unusual and powerful combination: deep sensitivity (N: ${Math.round(getN(s))}th) held by strong differentiation (${Math.round(getDSITotal(s))}). You feel everything intensely but have the self-definition to hold it. You can be touched without being toppled.`
      : `Your temperament creates the raw material; your differentiation shapes what you do with it. ${diffHigh ? 'Your strong self-definition gives you a stable platform regardless of temperamental tendencies.' : 'As your differentiation develops, it will help you channel your natural temperament more intentionally.'}`,
    arc: {
      protection: nHigh && !diffHigh
        ? 'Without strong boundaries, your sensitivity made you reactive — and that reactivity was itself a form of protection, keeping you alert to every relational shift.'
        : 'Your temperament and differentiation developed independently, creating either natural alignment or productive tension.',
      cost: nHigh && !diffHigh
        ? 'Chronic emotional reactivity that exhausts you and your partners. Every interaction feels disproportionately intense because it IS — you\'re processing through an unfiltered system.'
        : diffHigh ? 'You may not realize how much your differentiation compensates for temperamental tendencies that others struggle with.' : 'Developing differentiation means learning to hold your temperamental impulses without suppressing them.',
      emergence: nHigh && !diffHigh
        ? 'Building differentiation around your sensitivity is the single highest-leverage growth move you can make. It doesn\'t reduce feeling — it provides a container for it.'
        : 'Continue integrating your natural temperament with your sense of self. Who you are isn\'t just what you feel — it\'s what you choose to do with it.',
    },
    practice: nHigh && !diffHigh
      ? 'Practice "emotional pausing": when reactivity spikes, place your hand on your chest and say "This is my feeling, not my identity." Wait 30 seconds before responding.'
      : 'Identify one temperamental tendency (e.g., introversion, sensitivity) and notice how your differentiation helps you manage it. Strengthen that connection.',
    oneThing: nHigh && !diffHigh ? 'Building a container for your feelings changes everything.' : null,
    depth: 'pairwise',
    domains: ['instrument', 'stance'],
    confidence: 'high',
  };
});

// Personality × Conflict (instrument × conflict)
register('instrument', 'conflict', (s) => {
  const nHigh = getN(s) >= 65;
  const aHigh = getA(s) >= 65;
  const style = getConflictStyle(s);

  return {
    title: nHigh && style === 'forcing' ? 'The Heated Engager'
      : aHigh && style === 'yielding' ? 'The Natural Yielder'
      : nHigh && style === 'avoiding' ? 'The Overwhelmed Retreater'
      : 'Your Temperament × Conflict Dance',
    subtitle: 'Your personality × conflict style',
    body: nHigh && style === 'forcing'
      ? `High sensitivity (N: ${Math.round(getN(s))}th) meets a forcing conflict style. This creates intense, emotionally charged confrontations. You don't just disagree — you feel the disagreement at full volume AND push hard. Your partner may experience this as being hit by a wave they can't stand up in.`
      : aHigh && style === 'yielding'
      ? `Your natural warmth (A: ${Math.round(getA(s))}th) and yielding style are deeply intertwined. Being agreeable makes yielding feel natural — even virtuous. But there's a shadow: some of your "generosity" in conflict may actually be agreeableness serving avoidance. You don't yield because you've decided to — you yield because disagreeing feels mean.`
      : `Your temperament (${nHigh ? 'sensitive' : aHigh ? 'warm' : 'your particular profile'}) shapes how your ${style} conflict style feels from the inside and looks from the outside.`,
    arc: {
      protection: nHigh && style === 'forcing'
        ? 'Overwhelming intensity was a way to resolve conflict quickly — if you push hard enough, the discomfort ends faster.'
        : aHigh && style === 'yielding'
        ? 'Being agreeable was rewarded. Yielding felt like kindness. The line between genuine generosity and conflict avoidance was never drawn.'
        : `Your ${style} approach developed in concert with your temperament — each reinforcing the other.`,
      cost: nHigh && style === 'forcing'
        ? 'Emotional damage. Your intensity creates wounds that take longer to heal than the issue takes to resolve.'
        : aHigh && style === 'yielding'
        ? 'You disappear in relationships. Your partner never meets your real needs because you\'re too agreeable to name them.'
        : 'Your temperament may make your conflict pattern feel unchangeable — "that\'s just who I am."',
      emergence: nHigh && style === 'forcing'
        ? 'Learning to channel intensity without overwhelming the other person. Not less feeling — better delivery.'
        : aHigh && style === 'yielding'
        ? 'Distinguishing between genuine flexibility and fear-driven accommodation. Real agreeableness includes the ability to disagree.'
        : 'Noticing where temperament drives conflict behavior vs. where conscious choice does.',
    },
    practice: nHigh && style === 'forcing'
      ? 'Before engaging in any disagreement, rate your emotional intensity 1-10. If above 7, say "I need 10 minutes" before engaging. Come back calmer. Same position, calmer delivery.'
      : aHigh && style === 'yielding'
      ? 'This week, disagree with something small. Notice the discomfort. Stay with it. The discomfort of disagreeing is not the same as being unkind.'
      : `Notice one moment where your temperament pulled you toward your default conflict style. What would a different response look like?`,
    oneThing: null,
    depth: 'pairwise',
    domains: ['instrument', 'conflict'],
    confidence: 'high',
  };
});

// Personality × Values (instrument × compass)
register('instrument', 'compass', (s) => {
  const oHigh = getO(s) >= 65;
  const cHigh = getC(s) >= 65;
  const topValues = getTopValues(s);
  const avgGap = getAvgValueGap(s);

  return {
    title: oHigh ? 'The Curious Values Explorer' : cHigh ? 'The Disciplined Values Keeper' : 'Your Temperament × Values',
    subtitle: 'Your personality × values',
    body: `Your personality shapes HOW you relate to your values (${topValues.slice(0, 3).join(', ')}). ${oHigh ? 'Your openness means you\'re naturally curious about values — questioning, exploring, possibly changing them over time. This is healthy, but it can also mean your values feel unstable to a partner who wants to know where you stand.' : cHigh ? 'Your conscientiousness means you take values seriously and work hard to live them. This integrity is genuine. The risk is rigidity — holding values so tightly that they become rules rather than guides.' : 'Your specific temperament creates a unique relationship with your values — shaping which ones you gravitate toward and how you live them.'}${avgGap >= 3 ? `\n\nYour values-action gap (${avgGap.toFixed(1)}/10) suggests your temperament may be working against your values in some areas.` : ''}`,
    arc: {
      protection: oHigh ? 'Keeping values flexible meant never being trapped by them.' : cHigh ? 'Structured values provided clarity and direction when life was chaotic.' : 'Your temperament naturally aligned with certain values and resisted others.',
      cost: oHigh ? 'Partners may wish you\'d commit more firmly to shared values.' : cHigh ? 'Rigidity around values can become judgmental — of yourself and others.' : 'Some of your "values" may actually be temperamental preferences in disguise.',
      emergence: oHigh ? 'Ground your exploration in commitment. Values that can\'t withstand questioning aren\'t values — but values that are never held firmly can\'t guide.' : cHigh ? 'Soften your grip on values enough to let them be alive, not just rules. A value you can\'t question is just a habit.' : 'Distinguish between values you\'ve chosen and temperamental tendencies you\'ve labeled as values.',
    },
    practice: oHigh
      ? 'Pick your most important value. Write a paragraph about why it matters and what you\'d sacrifice for it. Let it be specific and committed — not hypothetical.'
      : cHigh
      ? 'Pick a value you hold strictly. Ask: "If this value could bend, what would it look like?" Experiment with flexibility for one day.'
      : 'List your top 3 values. For each one, ask: "Is this a genuine value or a personality preference?" The distinction matters.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['instrument', 'compass'],
    confidence: 'high',
  };
});

// Differentiation × Conflict (stance × conflict)
register('stance', 'conflict', (s) => {
  const diffHigh = getDSITotal(s) >= 60;
  const iPos = getIPosition(s);
  const reactivity = getReactivity(s);
  const style = getConflictStyle(s);

  return {
    title: !diffHigh && style === 'forcing' ? 'The Reactive Escalator'
      : diffHigh && style === 'avoiding' ? 'The Chosen Distance'
      : !diffHigh && style === 'avoiding' ? 'The Flooded Retreater'
      : diffHigh && style === 'problemSolving' ? 'The Grounded Problem-Solver'
      : 'Your Selfhood × Conflict Dance',
    subtitle: 'Your differentiation × conflict style',
    body: !diffHigh && style === 'forcing'
      ? `Low differentiation (${Math.round(getDSITotal(s))}) meets a forcing style. This is the reactive escalator pattern: conflict triggers emotional flooding, and without a solid "I" to anchor to, you fight harder and louder to compensate. The volume isn't confidence — it's the absence of a calm center.`
      : diffHigh && style === 'avoiding'
      ? `High differentiation (${Math.round(getDSITotal(s))}) with conflict avoidance is interesting: you CAN hold your ground, but you choose not to engage. This isn't fusion-driven avoidance — it's strategic. You know who you are and what you think. You just don't think most fights are worth having.`
      : `Your differentiation (${Math.round(getDSITotal(s))}) shapes the quality of your ${style} conflict style. ${diffHigh ? 'With strong self-definition, your conflict engagement comes from clarity rather than reactivity.' : 'As differentiation develops, your conflict style will shift from reactive to chosen.'}`,
    arc: {
      protection: !diffHigh && style === 'forcing'
        ? 'Volume compensated for lack of center. If you can\'t hold your ground calmly, you hold it loudly.'
        : diffHigh && style === 'avoiding'
        ? 'You chose battles carefully, preserving energy for what truly matters. Strategic, not fearful.'
        : `Your ${style} approach reflects your current level of self-definition.`,
      cost: !diffHigh && style === 'forcing'
        ? 'Escalation damages trust and connection. Partners learn to avoid triggering you, which means real issues go underground.'
        : diffHigh && style === 'avoiding'
        ? 'Your partner may need more engagement than you offer. Choosing not to fight can feel like not caring — even when you do.'
        : diffHigh ? 'Your groundedness may make you seem inflexible.' : 'Reactivity undermines the valid points you\'re trying to make.',
      emergence: !diffHigh && style === 'forcing'
        ? 'Building a calm center transforms your engagement from escalation to advocacy. Same position, profoundly different impact.'
        : 'Balance your current pattern with its opposite: if you avoid, practice engaging. If you force, practice pausing.',
    },
    practice: !diffHigh && style === 'forcing'
      ? 'When you feel the urge to escalate, ground yourself: feet on floor, one deep breath. Then restate your position at half the volume. The content stays; the reactivity leaves.'
      : diffHigh && style === 'avoiding'
      ? 'Pick one issue you\'ve been strategically avoiding. Engage with it this week — not because you must, but because your partner deserves your engagement.'
      : 'Notice how your sense of self shifts during conflict. When do you feel most/least "you"?',
    oneThing: !diffHigh && style === 'forcing' ? 'Find your center first. Then speak.' : null,
    depth: 'pairwise',
    domains: ['stance', 'conflict'],
    confidence: 'high',
  };
});

// Differentiation × Values (stance × compass)
register('stance', 'compass', (s) => {
  const diffHigh = getDSITotal(s) >= 60;
  const iPos = getIPosition(s);
  const topValues = getTopValues(s);
  const avgGap = getAvgValueGap(s);

  return {
    title: !diffHigh && avgGap >= 3 ? 'The Lost Compass'
      : diffHigh && avgGap < 3 ? 'The Integrated Self'
      : 'Your Selfhood × Values',
    subtitle: 'Your differentiation × values',
    body: `${!diffHigh && avgGap >= 3
      ? `When differentiation is developing (${Math.round(getDSITotal(s))}) and values are misaligned with actions (gap: ${avgGap.toFixed(1)}/10), it often means you know what matters but can't hold it against social pressure. Your values (${topValues.slice(0, 3).join(', ')}) get overridden by the need for approval, the pull of fusion, or the fear of standing alone.`
      : diffHigh && avgGap < 3
      ? `Strong differentiation (${Math.round(getDSITotal(s))}) and aligned values create a person who knows what they stand for and lives it. You (${topValues.slice(0, 3).join(', ')}) aren't just ideals — they're lived practice.`
      : `Your differentiation (${Math.round(getDSITotal(s))}) affects how firmly you can hold your values (${topValues.slice(0, 3).join(', ')}) when relationships make it difficult.${avgGap >= 3 ? ` The gap (${avgGap.toFixed(1)}/10) suggests there's work to do.` : ''}`
    }`,
    arc: {
      protection: !diffHigh ? 'Without strong self-definition, values became negotiable — adapted to whoever was closest.' : 'Strong self-definition provided an anchor for your values, even under pressure.',
      cost: !diffHigh && avgGap >= 3
        ? 'You live someone else\'s values while your own gather dust. The resentment isn\'t about them — it\'s about you not standing for what you believe.'
        : diffHigh && avgGap < 3
        ? 'You may hold your values so firmly that there\'s no room for your partner\'s. Integration isn\'t just about you — it\'s about making space for two value systems.'
        : 'The gap between your values and your self-definition creates internal tension that shows up in relationships.',
      emergence: !diffHigh
        ? 'As your differentiation grows, your values will have a voice. Not rigidity — just the quiet ability to say "this matters to me" without it feeling dangerous.'
        : 'Your integrated self is a gift. Use it to help your partner find their own values-alignment, not to impose yours.',
    },
    practice: !diffHigh && avgGap >= 3
      ? 'Pick your most important value. This week, live it in one visible way — even if it means slight social discomfort. Notice how it feels to stand for something.'
      : 'Share your top value with your partner and ask about theirs. Notice where they differ without trying to align them.',
    oneThing: !diffHigh && avgGap >= 3 ? 'Your values are waiting for the self that can hold them.' : null,
    depth: 'pairwise',
    domains: ['stance', 'compass'],
    confidence: 'high',
  };
});

// EQ × Values (navigation × compass)
register('navigation', 'compass', (s) => {
  const eqHigh = getEQTotal(s) >= 65;
  const topValues = getTopValues(s);
  const avgGap = getAvgValueGap(s);

  return {
    title: eqHigh && avgGap >= 3 ? 'The Perceptive Hypocrite'
      : eqHigh && avgGap < 3 ? 'Emotional Wisdom in Action'
      : 'Your Emotional Skill × Values',
    subtitle: 'Your EQ × values',
    body: eqHigh && avgGap >= 3
      ? `Here's a painful intersection: you have strong emotional perception (EQ: ${Math.round(getEQTotal(s))}) AND a significant values-action gap (${avgGap.toFixed(1)}/10). This means you can SEE the gap — you're emotionally intelligent enough to know you're not living your values (${topValues.slice(0, 3).join(', ')}). But seeing it and closing it are different skills.\n\nThe awareness without the action creates a particular kind of suffering: you know exactly what you're not doing.`
      : `Your emotional intelligence (${Math.round(getEQTotal(s))}) shapes how you relate to your values (${topValues.slice(0, 3).join(', ')}). ${eqHigh ? 'High EQ means you can navigate the emotional complexity of living your values in relationship.' : 'As your EQ develops, it will help you manage the emotional challenges of values-aligned living.'}`,
    arc: {
      protection: eqHigh && avgGap >= 3
        ? 'Awareness became a substitute for action. Knowing you should change felt almost as good as changing. It\'s a sophisticated way to avoid the discomfort of actual growth.'
        : 'Your EQ developed as a way to navigate the emotional world. How it serves your values depends on how intentionally you connect the two.',
      cost: eqHigh && avgGap >= 3
        ? 'Self-judgment. You see the gap, feel it keenly, and may judge yourself harshly — which paradoxically makes change harder.'
        : !eqHigh ? 'Without strong EQ, living your values in emotionally complex situations (relationships, conflict) becomes harder.' : 'Minimal — this is a strong combination.',
      emergence: eqHigh && avgGap >= 3
        ? 'Use your emotional intelligence to understand WHAT keeps the gap open — not as judgment, but as information. What feeling does the gap protect you from?'
        : 'Growing the connection between your emotional skills and your values creates authentic, embodied integrity.',
    },
    practice: eqHigh && avgGap >= 3
      ? 'Pick the biggest gap. Instead of trying to close it through willpower, get curious: "What emotion am I avoiding by not living this value?" Sit with the answer.'
      : 'Notice one moment where your emotional state pulled you away from a value. What would it take to hold both the feeling AND the value?',
    oneThing: eqHigh && avgGap >= 3 ? 'Awareness without action is the most comfortable trap.' : null,
    depth: 'pairwise',
    domains: ['navigation', 'compass'],
    confidence: 'high',
  };
});

// Attachment × Values (foundation × compass)
register('foundation', 'compass', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const topValues = getTopValues(s);
  const avgGap = getAvgValueGap(s);

  return {
    title: anxious ? 'The Values-Connection Tension'
      : avoidant ? 'The Independent Values Keeper'
      : 'Your Attachment × Values',
    subtitle: 'Your attachment × values',
    body: anxious
      ? `Your attachment anxiety pulls toward connection at all costs — and that "all costs" often includes your values (${topValues.slice(0, 3).join(', ')}). When connection feels threatened, values become negotiable. "I believe in honesty, but if being honest might push them away..." This isn't weakness. It's the hierarchy your nervous system learned: connection first, values second.${avgGap >= 3 ? ` Your gap (${avgGap.toFixed(1)}/10) likely reflects this trade-off.` : ''}`
      : avoidant
      ? `Your avoidant attachment creates space for your values (${topValues.slice(0, 3).join(', ')}) to live independently — you don't compromise them for connection because connection isn't the priority. This looks like integrity, and sometimes it is. But sometimes "sticking to my values" is avoidance in a philosophical costume.${avgGap >= 3 ? ` Yet your gap (${avgGap.toFixed(1)}/10) shows even self-sufficiency doesn't guarantee values alignment.` : ''}`
      : `Your secure base lets you hold both connection AND values. Neither needs to be sacrificed for the other. This is the integrated position — you can be close and true simultaneously.`,
    arc: {
      protection: anxious ? 'Sacrificing values preserved connection. Values can wait; abandonment can\'t.' : avoidant ? 'Values served as a reason not to compromise — which also meant not to get too close.' : 'Security provided the stability for values to develop without being warped by attachment needs.',
      cost: anxious ? 'Accumulated self-betrayal. You traded pieces of yourself for connection and lost track of what you traded.' : avoidant ? 'Using values as barriers to intimacy. "I won\'t compromise" sounds principled but can mean "I won\'t be vulnerable."' : 'Be mindful that your privilege of security doesn\'t blind you to how hard this balance is for others.',
      emergence: anxious ? 'Learning that true connection includes your values — not instead of them. A partner who needs you to abandon your values for the relationship isn\'t offering real connection.' : avoidant ? 'Softening values into invitations rather than walls. Share what matters to you as a bridge, not a barrier.' : 'Continue modeling that connection and values can coexist.',
    },
    practice: anxious
      ? 'Identify one value you tend to sacrifice for connection. Hold it this week — gently, without ultimatums. Just don\'t let it go.'
      : avoidant
      ? 'Share a value with your partner not as a boundary, but as vulnerability: "This matters to me because..." Let them in.'
      : 'Ask your partner which of their values they find hardest to hold in the relationship. Listen without defending.',
    oneThing: anxious ? 'Your values belong in the relationship, not outside it.' : null,
    depth: 'pairwise',
    domains: ['foundation', 'compass'],
    confidence: 'high',
  };
});

// Attachment × Field (foundation × field)
register('foundation', 'field', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);

  return {
    title: anxious ? 'The Anxious Antenna'
      : avoidant ? 'The Distant Observer'
      : 'Your Attachment × Relational Field',
    subtitle: 'Your attachment × field awareness',
    body: anxious
      ? `Your attachment anxiety makes you acutely attuned to the relational field — you feel every shift in the space between you and your partner. But anxiety distorts the signal. You detect real changes AND project threat onto neutral space. Learning to distinguish between genuine field disturbance and attachment noise is your edge.`
      : avoidant
      ? `Your avoidant attachment creates a peculiar relationship with the relational field: you may be able to observe it from a distance but struggle to participate in it. You see the space between as something to manage rather than something to inhabit.`
      : `Your secure attachment gives you clean access to the relational field. Without the distortion of anxiety or the distance of avoidance, you can sense what's actually happening in the space between you and another person.`,
    arc: {
      protection: anxious ? 'Hypervigilance to the field meant never being surprised by disconnection.' : avoidant ? 'Observing from outside the field kept you safe from its intensity.' : 'Security allowed natural field awareness without distortion.',
      cost: anxious ? 'Constant scanning exhausts you and creates false alarms that erode trust.' : avoidant ? 'You miss the richness of what happens when you\'re IN the field rather than watching it.' : 'Minimal — awareness from security is reliable.',
      emergence: anxious ? 'Trust what the field is actually telling you. Practice receiving the signal without amplifying it.' : avoidant ? 'Step into the field. Let yourself be affected by the space between, not just aware of it.' : 'Your clean field awareness is a relational gift. Share it.',
    },
    practice: anxious
      ? 'When you sense something in the relational space, sit with it for 60 seconds before naming it. Often the initial intensity will settle, and the real signal will become clear.'
      : avoidant
      ? 'Close your eyes with your partner for 30 seconds. Just breathe together. Notice what you feel in the space between you. That\'s the field.'
      : 'Share what you sense in the relational space with your partner. "I notice we feel close right now" or "I sense some distance." Model field awareness.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['foundation', 'field'],
    confidence: 'emerging',
  };
});

// Personality × Field (instrument × field)
register('instrument', 'field', (s) => ({
  title: 'Your Temperament × The Space Between',
  subtitle: 'Your personality × relational field',
  body: `Your personality traits shape how you experience the relational field. ${getN(s) >= 65 ? 'Your sensitivity means you feel the field intensely — every shift, every nuance.' : getE(s) >= 65 ? 'Your extraverted energy means you tend to fill the field with action and conversation rather than sitting in its quiet.' : 'Your specific temperament creates a unique relationship with the subtle space between you and your partner.'}`,
  arc: {
    protection: 'Your temperament determined which aspects of the field you noticed first — and which you learned to ignore.',
    cost: getN(s) >= 65 ? 'Oversensitivity to field fluctuations can make the relational space feel unstable.' : getE(s) >= 65 ? 'Filling the space with activity can prevent you from sensing what\'s already there.' : 'Your temperamental defaults may blind you to parts of the field that don\'t match your natural attention pattern.',
    emergence: 'Expanding your field awareness beyond your temperamental default reveals layers of relational experience you\'ve been missing.',
  },
  practice: 'Spend 5 minutes in shared silence with your partner. Notice what arises in the space. What does your temperament want to do with the silence? Practice letting it be.',
  oneThing: null,
  depth: 'pairwise',
  domains: ['instrument', 'field'],
  confidence: 'emerging',
}));

// EQ × Field (navigation × field)
register('navigation', 'field', (s) => ({
  title: getEQTotal(s) >= 65 ? 'The Field Reader' : 'Building Field Perception',
  subtitle: 'Your EQ × relational field',
  body: `Your emotional intelligence (${Math.round(getEQTotal(s))}) is the primary tool for reading the relational field. ${getEQTotal(s) >= 65 ? 'Your high EQ gives you natural access to the subtle dynamics of the space between — you can sense shifts in emotional resonance, moments of connection and disconnection, and the quality of presence in the room.' : 'As your EQ develops, your ability to read the relational field will deepen. Right now, you may catch the big signals but miss the subtleties.'}`,
  arc: {
    protection: 'EQ developed as a way to navigate interpersonal space. The field is where that skill lives.',
    cost: getEQTotal(s) >= 65 ? 'You may over-rely on field reading and miss more direct communication. Not everything needs to be sensed — sometimes it needs to be said.' : 'Missing field signals means missing context for what\'s happening in the relationship.',
    emergence: getEQTotal(s) >= 65 ? 'Let your field perception guide you toward naming what you sense. The field + language = genuine relational transparency.' : 'Each small gain in EQ opens new channels of field awareness. Practice both.',
  },
  practice: getEQTotal(s) >= 65
    ? 'When you sense something in the relational field, practice naming it: "I notice the space between us feels ___." See if your partner confirms your reading.'
    : 'Start by noticing your own emotional state in your partner\'s presence vs. alone. The difference IS the field.',
  oneThing: null,
  depth: 'pairwise',
  domains: ['navigation', 'field'],
  confidence: 'emerging',
}));

// Differentiation × Field (stance × field)
register('stance', 'field', (s) => ({
  title: getDSITotal(s) >= 60 ? 'The Differentiated Participant' : 'Finding Yourself in the Field',
  subtitle: 'Your differentiation × relational field',
  body: `Differentiation determines whether you can participate in the relational field without losing yourself in it. ${getDSITotal(s) >= 60 ? `Your strong differentiation (${Math.round(getDSITotal(s))}) means you can enter the shared space between you and your partner while maintaining a clear sense of self. You can be moved by the field without being swept away by it.` : `Your developing differentiation (${Math.round(getDSITotal(s))}) means the relational field can sometimes feel overwhelming — you enter the shared space and lose track of where you end and your partner begins.`}`,
  arc: {
    protection: getDSITotal(s) >= 60 ? 'Strong boundaries let you participate in the field safely.' : 'The field\'s intensity may have taught you to stay at its edges rather than entering.',
    cost: getDSITotal(s) >= 60 ? 'You might participate analytically rather than fully. Your boundaries keep you safe but may keep you shallow.' : 'You either merge with the field or avoid it. The middle ground — participated presence — is the growth edge.',
    emergence: 'The ideal is full field participation with maintained selfhood. Like two instruments playing together — distinct voices creating something neither could alone.',
  },
  practice: getDSITotal(s) >= 60
    ? 'In a moment of connection, let yourself go slightly deeper than comfortable. Notice you can always find yourself again.'
    : 'In a moment of connection, practice checking: "Am I still me?" Not pulling away — just verifying you\'re present as yourself.',
  oneThing: null,
  depth: 'pairwise',
  domains: ['stance', 'field'],
  confidence: 'emerging',
}));

// Conflict × Field (conflict × field)
register('conflict', 'field', (s) => ({
  title: 'How Conflict Moves the Space Between',
  subtitle: 'Your conflict style × relational field',
  body: `Your ${getConflictStyle(s)} conflict style creates a specific pattern in the relational field. ${getConflictStyle(s) === 'forcing' ? 'When you force, the field contracts — the space between becomes charged and dense. Your partner\'s room to breathe shrinks.' : getConflictStyle(s) === 'avoiding' ? 'When you avoid, the field goes quiet — but not peaceful. It\'s the silence of things unsaid, creating a pressure that both of you feel but neither names.' : getConflictStyle(s) === 'yielding' ? 'When you yield, the field feels imbalanced — one person\'s energy dominates while the other retreats. The space between becomes one-sided.' : 'Your approach to conflict shapes the quality of the relational space during disagreement.'}`,
  arc: {
    protection: `Your ${getConflictStyle(s)} style protected the field from something you feared more — ${getConflictStyle(s) === 'forcing' ? 'being controlled or dismissed' : getConflictStyle(s) === 'avoiding' ? 'destructive explosion' : getConflictStyle(s) === 'yielding' ? 'rejection or abandonment' : 'the unpredictability of raw conflict'}.`,
    cost: 'Every conflict style distorts the relational field in its own way. Awareness of YOUR distortion is the first step toward repair.',
    emergence: 'Conflict that serves the field — that actually strengthens the space between — is conflict where both voices are present, both positions are held, and the outcome serves the relationship rather than either individual.',
  },
  practice: 'After your next disagreement, check in with the relational field: "How does the space between us feel right now?" Share your reading and invite your partner\'s.',
  oneThing: null,
  depth: 'pairwise',
  domains: ['conflict', 'field'],
  confidence: 'emerging',
}));

// Values × Field (compass × field)
register('compass', 'field', (s) => ({
  title: 'What the Space Between Values',
  subtitle: 'Your values × relational field',
  body: `Your values (${getTopValues(s).slice(0, 3).join(', ')}) don't just guide YOUR behavior — they shape the relational field. When you live your values visibly, the space between you and your partner becomes colored by those values. When your values go unlived, the field registers the inauthenticity — even if no one names it.\n\n${getAvgValueGap(s) >= 3 ? `Your values-action gap (${getAvgValueGap(s).toFixed(1)}/10) means the field is absorbing the cost of your misalignment. Your partner may sense something "off" without being able to name it.` : 'Your relatively aligned values contribute to a field that feels authentic and trustworthy.'}`,
  arc: {
    protection: 'Values provide meaning for the relational space. Without them, the field drifts.',
    cost: getAvgValueGap(s) >= 3 ? 'The gap between your values and actions creates a subtle dishonesty in the field that both partners feel.' : 'Even aligned values need to be shared to shape the field. Silent values don\'t count.',
    emergence: 'Shared values that are visibly lived create a relational field with direction and purpose. This is what "building something together" actually means.',
  },
  practice: 'Share your top value with your partner tonight. Ask if they experience you living it. Listen without defending.',
  oneThing: null,
  depth: 'pairwise',
  domains: ['compass', 'field'],
  confidence: 'emerging',
}));

/** Get all available pairwise keys */
export function getAvailablePairs(): string[] {
  return Object.keys(PAIRWISE_REGISTRY);
}
