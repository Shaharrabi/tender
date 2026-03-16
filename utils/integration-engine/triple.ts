/**
 * Triple Integration Functions
 * ────────────────────────────────────────────
 * When 3 domains are selected, something deeper emerges.
 * Each triple weaves a developmental arc that couldn't exist
 * from any pair alone.
 *
 * 10 priority triples:
 * 1. attachment × EQ × differentiation (foundation × navigation × stance)
 * 2. attachment × conflict × differentiation (foundation × conflict × stance)
 * 3. attachment × EQ × conflict (foundation × navigation × conflict)
 * 4. attachment × personality × EQ (foundation × instrument × navigation)
 * 5. EQ × differentiation × conflict (navigation × stance × conflict)
 * 6. attachment × differentiation × values (foundation × stance × compass)
 * 7. attachment × conflict × values (foundation × conflict × compass)
 * 8. EQ × conflict × values (navigation × conflict × compass)
 * 9. personality × EQ × differentiation (instrument × navigation × stance)
 * 10. differentiation × conflict × values (stance × conflict × compass)
 */

import type { IntegrationScores, IntegrationResult, DomainId } from './types';
import {
  isAnxious, isAvoidant, isSecure,
  getAnxiety, getAvoidance, getAttachmentStyle,
  getN, getE, getA, getO, getC,
  getEQTotal, getEQPerception, getEQManagingSelf, getEQManagingOthers,
  getDSITotal, getReactivity, getIPosition, getFusion,
  getConflictStyle, getYielding, getAvoiding, getForcing, getProblemSolving,
  getTopValues, getAvgValueGap, getBiggestGapValue,
} from './helpers';

type TripleKey = string; // sorted domain IDs joined with ×

const TRIPLE_REGISTRY: Record<string, (s: IntegrationScores) => IntegrationResult> = {};

function sortKey(domains: DomainId[]): string {
  return [...domains].sort().join('×');
}

function register(domains: [DomainId, DomainId, DomainId], fn: (s: IntegrationScores) => IntegrationResult) {
  TRIPLE_REGISTRY[sortKey(domains)] = fn;
}

/** Look up a triple integration by domains */
export function getTripleIntegration(
  domains: [DomainId, DomainId, DomainId],
  scores: IntegrationScores,
): IntegrationResult | null {
  const fn = TRIPLE_REGISTRY[sortKey(domains)];
  if (!fn) return null;
  return fn(scores);
}

// ═══════════════════════════════════════════════════════
// TRIPLE 1: Attachment × EQ × Differentiation
// The "core triangle" — the three systems that define relational capacity
// ═══════════════════════════════════════════════════════

register(['foundation', 'navigation', 'stance'], (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const eqHigh = getEQTotal(s) >= 65;
  const diffHigh = getDSITotal(s) >= 60;

  if (anxious && eqHigh && !diffHigh) {
    // The Empathic Merger
    return {
      title: 'The Empathic Merger',
      subtitle: 'Attachment × EQ × Differentiation',
      body: `Three forces converge: your attachment anxiety pulls you toward connection, your high EQ (${Math.round(getEQTotal(s))}) lets you read every emotional signal, and your developing differentiation (${Math.round(getDSITotal(s))}) means you can't hold boundaries against that pull. The result: you merge.\n\nNot clumsily — empathically. You dissolve into the other person through genuine emotional intelligence. You feel what they feel, you know what they need, you anticipate before they ask. It looks like love. And it is love. But it's love without a self.\n\nThe developmental sequence matters here: your anxiety creates the pull, your EQ gives you the tools to merge skillfully, and your underdeveloped differentiation means there's no counterforce saying "stay." All three systems agree on the same strategy: dissolve the boundary. It works until you can't find yourself anymore.`,
      arc: {
        protection: 'Merging through empathy was the safest response to anxiety in relationships where you had to track the other person to stay safe. Your EQ made you excellent at it. Your lack of differentiation meant nothing stopped you.',
        cost: 'You lose yourself so skillfully that neither you nor your partner notices until the resentment builds. The merger that felt like intimacy reveals itself as self-abandonment. Both of you wonder where YOU went.',
        emergence: 'What wants to emerge is the one thing you\'ve never tried: staying empathic while holding a boundary. Feeling everything without becoming it. Your EQ stays. Your anxiety stays. What changes is the "I" that can hold both. That\'s differentiation — and it\'s the missing piece.',
      },
      practice: 'This week, practice empathic witnessing WITHOUT action. When you sense your partner\'s emotion, say: "I can see you\'re feeling ___." Then — this is the hard part — don\'t do anything about it. Let them have their experience while you have yours. The distinction IS the practice.',
      oneThing: 'You can feel everything they feel and still be you.',
      depth: 'triple',
      domains: ['foundation', 'navigation', 'stance'],
      confidence: 'high',
    };
  }

  if (avoidant && !eqHigh && diffHigh) {
    // The Functional Fortress
    return {
      title: 'The Functional Fortress',
      subtitle: 'Attachment × EQ × Differentiation',
      body: `You've built something impressive and isolating: avoidant attachment (${getAvoidance(s).toFixed(1)}/7), developing EQ (${Math.round(getEQTotal(s))}), and strong differentiation (${Math.round(getDSITotal(s))}). You know who you are, you keep your distance, and you don't read the emotional landscape particularly well — or particularly need to.\n\nThis architecture is highly functional. You succeed at work, you manage yourself well, you don't create drama. But intimate relationship is precisely the context where this fortress fails, because intimacy requires exactly what you've fortified against: emotional closeness, mutual reading, and the willingness to be changed by another person.\n\nYour differentiation is real but incomplete. True differentiation includes connection capacity — holding yourself while being close. Yours may be differentiation FROM rather than differentiation IN.`,
      arc: {
        protection: 'The fortress protected you from emotional overwhelm by keeping everything that might overwhelm you at arm\'s length. Self-sufficiency became identity.',
        cost: 'Loneliness that looks like independence. A partner who can\'t reach you. A self that\'s defined by what it doesn\'t need rather than what it can hold.',
        emergence: 'The fortress doesn\'t need to come down — it needs windows and doors. Building EQ creates the windows. Softening avoidance creates the doors. The structure of differentiation stays, but it becomes inhabitable rather than impregnable.',
      },
      practice: 'This week, let your partner teach you something about their inner world. Not facts — feelings. Ask: "What\'s something you feel that you think I don\'t notice?" Listen without defending your awareness. Let the answer land.',
      oneThing: 'Strength that can\'t be touched isn\'t strength. It\'s armor.',
      depth: 'triple',
      domains: ['foundation', 'navigation', 'stance'],
      confidence: 'high',
    };
  }

  if (anxious && !eqHigh && !diffHigh) {
    // The Overwhelmed Heart
    return {
      title: 'The Overwhelmed Heart',
      subtitle: 'Attachment × EQ × Differentiation',
      body: `All three systems are in a vulnerable configuration: attachment anxiety (${getAnxiety(s).toFixed(1)}/7) creates urgency, developing EQ (${Math.round(getEQTotal(s))}) means limited tools for processing, and developing differentiation (${Math.round(getDSITotal(s))}) means no steady center to anchor to.\n\nRelationships feel like being at sea without a compass or a hull. You feel the waves (anxiety) but can't read the weather (EQ) or steer the ship (differentiation). Everything is reactive, intense, and exhausting — for you and your partner.\n\nBut here's the hidden gift: everything is growing at once. No single system has over-developed to compensate. This means you can build all three together, and they'll support each other naturally.`,
      arc: {
        protection: 'Without differentiation or EQ, anxiety ran the whole show. Every relational moment was an emergency because you had no tools and no ground to stand on.',
        cost: 'Chronic overwhelm, relationship burnout, partners who can\'t keep up with the intensity. You don\'t just feel a lot — you feel a lot with no container for it.',
        emergence: 'Start with differentiation — it\'s the foundation for everything else. A "self" to return to makes anxiety manageable and creates the stability from which EQ can grow.',
      },
      practice: 'Daily grounding practice: place your hand on your chest. Say: "I am here. I am me. This feeling will pass." This builds the sense of self (differentiation) that stabilizes everything else. Three minutes, every morning.',
      oneThing: 'You don\'t need to feel less. You need somewhere to stand while you feel.',
      depth: 'triple',
      domains: ['foundation', 'navigation', 'stance'],
      confidence: 'high',
    };
  }

  if (isSecure(s) && eqHigh && diffHigh) {
    // The Integrated Partner
    return {
      title: 'The Integrated Partner',
      subtitle: 'Attachment × EQ × Differentiation',
      body: `This is rare: secure attachment, high emotional intelligence (${Math.round(getEQTotal(s))}), and strong differentiation (${Math.round(getDSITotal(s))}). All three core relational systems are working well and working together.\n\nYou can be close without losing yourself. You can read the room without absorbing it. You can hold your ground without it becoming a wall. This creates a relational capacity that most people are building toward.\n\nThe invitation for you isn't about building something new — it's about how you use what you have. With this foundation, you can hold space for a partner who's still developing these capacities. You can model what integrated relating looks like.`,
      arc: {
        protection: 'You developed in conditions that supported all three capacities. Not all luck — you also made choices that maintained these systems.',
        cost: 'You may underestimate how hard relationships are for less integrated partners. Your ease can feel like dismissiveness if you\'re not careful. "Just talk about it" isn\'t simple for everyone.',
        emergence: 'Use your integration as a gift — not by teaching, but by being. Your presence in difficulty is itself a regulation resource for others.',
      },
      practice: 'This week, notice where your partner struggles with something that comes naturally to you. Instead of helping or advising, just be present with their struggle. Your stability IS the support.',
      oneThing: null,
      depth: 'triple',
      domains: ['foundation', 'navigation', 'stance'],
      confidence: 'high',
    };
  }

  // General case
  return {
    title: 'Your Core Relational Triangle',
    subtitle: 'Attachment × EQ × Differentiation',
    body: `These three dimensions form the core of your relational architecture. Your attachment style (${getAttachmentStyle(s)}) determines how you approach connection, your EQ (${Math.round(getEQTotal(s))}) determines how you read and manage the emotional landscape, and your differentiation (${Math.round(getDSITotal(s))}) determines whether you can hold yourself while doing both.\n\nEach one shapes the other two. ${anxious ? 'Anxiety' : avoidant ? 'Avoidance' : 'Security'} filters what your EQ perceives. Your differentiation level determines whether your EQ serves connection or defense. And your attachment pattern either supports or undermines the boundaries your differentiation tries to build.`,
    arc: {
      protection: 'These three systems developed as a package — each protecting you in its own way, each reinforcing the others\' strategies.',
      cost: 'Where the three misalign, relational stress lives. The tension between them IS the work.',
      emergence: 'Integration of these three systems is the foundation of relational maturity. When all three work together, you can be close, aware, and self-defined simultaneously.',
    },
    practice: 'Identify which of the three feels strongest. Which feels weakest? This week, give 10 minutes daily to the weakest one. If it\'s attachment: practice being present. If it\'s EQ: practice noticing emotions. If it\'s differentiation: practice holding your position.',
    oneThing: 'Three systems, one relationship. Grow the weakest link.',
    depth: 'triple',
    domains: ['foundation', 'navigation', 'stance'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// TRIPLE 2: Attachment × Conflict × Differentiation
// ═══════════════════════════════════════════════════════

register(['foundation', 'conflict', 'stance'], (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const style = getConflictStyle(s);
  const diffHigh = getDSITotal(s) >= 60;

  if (anxious && (style === 'yielding' || style === 'avoiding') && !diffHigh) {
    return {
      title: 'The Disappearing Act',
      subtitle: 'Attachment × Conflict × Differentiation',
      body: `Three systems conspire to make you vanish in relationships: anxiety makes connection feel urgent, ${style} makes conflict feel dangerous, and low differentiation means you don't have a strong enough "self" to risk either confrontation or disconnection.\n\nSo you disappear. Not physically — you're right there. But your needs, your voice, your positions, your boundaries — they all go underground. You become whoever keeps the peace and preserves the connection.\n\nThis is one of the most common and most painful relational patterns. It's also one of the most treatable, because breaking it at any one of the three points changes the whole system.`,
      arc: {
        protection: 'Disappearing was the safest option when connection was fragile, conflict was dangerous, and you didn\'t have a self sturdy enough to risk either.',
        cost: 'Complete self-loss in relationship. Mounting resentment. Partners who don\'t know who you really are because you\'ve never shown them. Eventually: explosion or implosion.',
        emergence: 'One moment of NOT yielding. One moment of naming a need. One moment of staying in the room when everything says run. Any one of these breaks the pattern, because the three systems are interconnected — shift one, and the others must adjust.',
      },
      practice: 'This week: agree on a signal with your partner. When you notice yourself yielding or avoiding to keep the peace, use the signal. It doesn\'t have to lead to confrontation. Just naming "I\'m doing my thing" is revolutionary.',
      oneThing: 'One real "no" changes everything.',
      depth: 'triple',
      domains: ['foundation', 'conflict', 'stance'],
      confidence: 'high',
    };
  }

  if (avoidant && style === 'avoiding' && diffHigh) {
    return {
      title: 'The Principled Withdrawal',
      subtitle: 'Attachment × Conflict × Differentiation',
      body: `You avoid conflict (${style}) and avoid closeness (avoidance: ${getAvoidance(s).toFixed(1)}/7) — but your strong differentiation (${Math.round(getDSITotal(s))}) means these aren't reactive retreats. They're chosen positions. You've decided that most conflict isn't worth having and most closeness isn't worth the vulnerability.\n\nFrom the outside, this looks like wisdom. From the inside, it might feel like control. From your partner's perspective, it feels like a wall with a philosophy painted on it.`,
      arc: {
        protection: 'Differentiation provided the intellectual framework for avoidance. "I know who I am, and I don\'t need conflict or dependency" sounds mature. It\'s also a perfect shield.',
        cost: 'Your partner can\'t reach you — not because you\'re confused, but because you\'ve made a case for being unreachable. The clarity of your position makes it harder to challenge.',
        emergence: 'True differentiation includes choosing connection even when it\'s uncomfortable. Your edge isn\'t clarity — it\'s vulnerability. Can you be differentiated AND dependent? AND engaged in conflict?',
      },
      practice: 'This week, engage in one conflict you would normally avoid. Not a huge one — just something you\'d typically let go. Stay in it for 10 minutes. Notice what your differentiation can hold that your avoidance says it can\'t.',
      oneThing: 'Chosen distance is still distance.',
      depth: 'triple',
      domains: ['foundation', 'conflict', 'stance'],
      confidence: 'high',
    };
  }

  // General case
  return {
    title: 'How You Fight for Connection',
    subtitle: 'Attachment × Conflict × Differentiation',
    body: `Your attachment (${anxious ? 'anxious' : avoidant ? 'avoidant' : 'secure'}), conflict approach (${style}), and differentiation (${Math.round(getDSITotal(s))}) together determine how you handle the hardest moments in relationship — when connection and disagreement happen simultaneously.\n\n${diffHigh ? 'Your strong differentiation gives you a center to return to during conflict, regardless of attachment activation.' : 'Developing differentiation means conflict can feel destabilizing — there\'s no firm ground to stand on when emotions run high.'} Your ${style} conflict style is ${anxious ? 'shaped by the urgency to restore connection' : avoidant ? 'influenced by the preference for distance' : 'relatively free from attachment distortion'}.`,
    arc: {
      protection: 'These three systems work as a package during relational stress. Together, they determine your conflict personality.',
      cost: `${!diffHigh && anxious ? 'Without differentiation, anxiety drives conflict behavior — you fight for connection rather than resolution.' : !diffHigh && avoidant ? 'Low differentiation + avoidance means you retreat not by choice but by overwhelm.' : 'Even functional patterns have costs when they operate automatically.'}`,
      emergence: 'The goal: conflict that serves both partners\' growth while maintaining connection. This requires adequate differentiation to hold steady, adequate emotional management to not be reactive, and enough security to trust the relationship can survive disagreement.',
    },
    practice: 'After your next disagreement, rate yourself 1-10 on three things: (1) Did I stay connected? (2) Did I stay true to myself? (3) Did we actually address the issue? Where you score lowest is your growth edge.',
    oneThing: null,
    depth: 'triple',
    domains: ['foundation', 'conflict', 'stance'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// TRIPLE 3: Attachment × EQ × Conflict
// ═══════════════════════════════════════════════════════

register(['foundation', 'navigation', 'conflict'], (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const eqHigh = getEQTotal(s) >= 65;
  const style = getConflictStyle(s);

  if (anxious && eqHigh && style === 'yielding') {
    return {
      title: 'The Compassionate Surrender',
      subtitle: 'Attachment × EQ × Conflict',
      body: `You see exactly what's happening (EQ: ${Math.round(getEQTotal(s))}), you feel the urgency of the connection at stake (anxiety: ${getAnxiety(s).toFixed(1)}/7), and you yield. Every time. Not because you can't see another option — but because your emotional perception shows you what a fight would cost, and your anxiety can't afford it.\n\nThis is the cruelest combination in a way: you have the intelligence to navigate conflict skillfully, but your attachment system vetoes every attempt. You see the move but can't make it.`,
      arc: {
        protection: 'Seeing what conflict would cost AND being unable to afford that cost made yielding the only rational choice. Your EQ confirmed what your anxiety feared: engagement could break the connection.',
        cost: 'Your emotional intelligence becomes a tool for more sophisticated surrender. You don\'t just yield — you yield with full awareness of what you\'re losing.',
        emergence: 'Use your EQ to SEE the fight AND see that the relationship can hold it. Your perception is accurate about the emotional stakes. It\'s your anxiety\'s prediction about the outcome that\'s wrong.',
      },
      practice: 'In a low-stakes disagreement, use your EQ to narrate what you see: "I notice we\'re both getting tense. I want to yield right now because I\'m scared of what happens if I don\'t. But I think we can handle this." Then share your actual position.',
      oneThing: 'Your emotional intelligence sees the risk. Trust it to also see the relationship\'s strength.',
      depth: 'triple',
      domains: ['foundation', 'navigation', 'conflict'],
      confidence: 'high',
    };
  }

  // General case
  return {
    title: 'When Feelings Meet the Fight',
    subtitle: 'Attachment × EQ × Conflict',
    body: `Your attachment (${anxious ? 'anxious' : avoidant ? 'avoidant' : 'secure'}), emotional intelligence (${Math.round(getEQTotal(s))}), and conflict style (${style}) create a specific pattern for how you handle emotionally charged disagreements.\n\n${eqHigh ? 'Your strong EQ means you can read the emotional landscape of the conflict.' : 'Your developing EQ means some emotional signals may be missed during conflict.'} ${anxious ? 'Your anxiety adds urgency — conflict doesn\'t just need resolution, it needs it NOW, because disconnection is intolerable.' : avoidant ? 'Your avoidance means conflict carries the additional threat of unwanted emotional intimacy.' : 'Your security gives you the freedom to engage conflict from a stable base.'}`,
    arc: {
      protection: 'Each system had a job: attachment monitored the connection, EQ read the emotional field, and your conflict style handled the strategy. Together, they kept you as safe as possible during relational stress.',
      cost: `${!eqHigh && (style === 'forcing') ? 'Engaging forcefully without emotional awareness creates collateral damage you don\'t fully perceive.' : eqHigh && (style === 'avoiding') ? 'Seeing clearly but not engaging wastes your emotional intelligence.' : 'The default strategy protects something but always costs something else.'}`,
      emergence: 'Use EQ to read, attachment awareness to understand your urgency/distance, and then CHOOSE a conflict response rather than defaulting to your habitual one.',
    },
    practice: 'Before your next disagreement, check in: "What does my attachment need right now?" "What is my EQ telling me?" "What does the situation actually need?" Let the third question guide your response.',
    oneThing: null,
    depth: 'triple',
    domains: ['foundation', 'navigation', 'conflict'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// TRIPLE 4: Attachment × Personality × EQ
// ═══════════════════════════════════════════════════════

register(['foundation', 'instrument', 'navigation'], (s) => {
  const anxious = isAnxious(s);
  const nHigh = getN(s) >= 65;
  const eqHigh = getEQTotal(s) >= 65;

  return {
    title: anxious && nHigh && eqHigh ? 'The Brilliant Storm'
      : anxious && nHigh && !eqHigh ? 'The Raw Lightning'
      : 'Your Relational Nervous System',
    subtitle: 'Attachment × Personality × EQ',
    body: anxious && nHigh
      ? `Three amplifiers: attachment anxiety (${getAnxiety(s).toFixed(1)}/7), high neuroticism (${Math.round(getN(s))}th percentile), and ${eqHigh ? 'high' : 'developing'} EQ (${Math.round(getEQTotal(s))}). ${eqHigh ? 'You feel everything at maximum volume AND you actually understand what you\'re feeling — which is both a gift and an overwhelm.' : 'You feel everything at maximum volume with limited tools for processing it all. The intensity is real; the container is still growing.'}\n\nThis isn't a flaw in your system — it's a system designed for maximum sensitivity. In the right conditions, it produces extraordinary depth of connection and perception.`
      : `Your attachment pattern, temperament, and emotional intelligence together create your relational nervous system — the way you experience, process, and respond to the emotional world of partnership. Each shapes the other two in ways that create your unique relational signature.`,
    arc: {
      protection: anxious && nHigh ? 'Maximum sensitivity = maximum preparation. You never miss a signal because your whole system is tuned to detect.' : 'Your nervous system developed a characteristic way of engaging with relational stimuli.',
      cost: anxious && nHigh && !eqHigh ? 'Emotional exhaustion, overwhelm, reactivity that damages the connections you\'re trying to protect.' : anxious && nHigh && eqHigh ? 'You see and feel everything, which is beautiful but exhausting. The volume never turns down.' : 'Your default setting may not serve every relational context equally.',
      emergence: anxious && nHigh ? 'Channel the sensitivity toward connection rather than threat detection. The same system that warns also warms.' : 'Growing awareness of your relational nervous system gives you the ability to modulate rather than simply react.',
    },
    practice: anxious && nHigh
      ? 'When your nervous system spikes, label the source: "attachment alarm," "sensitivity," or "genuine signal." This sorting reduces reactivity by 40%.'
      : 'Notice which of the three systems (attachment, temperament, EQ) tends to drive your reactions in different contexts. Name the driver.',
    oneThing: anxious && nHigh ? 'Your sensitivity is a gift. Learning to hold it changes who you become.' : null,
    depth: 'triple',
    domains: ['foundation', 'instrument', 'navigation'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// TRIPLE 5: EQ × Differentiation × Conflict
// ═══════════════════════════════════════════════════════

register(['navigation', 'stance', 'conflict'], (s) => {
  const eqHigh = getEQTotal(s) >= 65;
  const diffHigh = getDSITotal(s) >= 60;
  const style = getConflictStyle(s);

  return {
    title: eqHigh && diffHigh ? 'The Skilled Navigator'
      : !eqHigh && !diffHigh && style === 'forcing' ? 'The Reactive Escalator'
      : 'Your Conflict Architecture',
    subtitle: 'EQ × Differentiation × Conflict',
    body: `These three determine the quality of your conflict: EQ (${Math.round(getEQTotal(s))}) reads the emotional landscape, differentiation (${Math.round(getDSITotal(s))}) determines whether you can hold steady in it, and your ${style} style determines what you do.\n\n${eqHigh && diffHigh ? 'You have the rare combination of strong reading, strong grounding, and engaged strategy. This means you can actually navigate conflict well — sensing what\'s happening, holding your center, and responding with skill.' : !eqHigh && !diffHigh ? 'With both EQ and differentiation developing, conflict is essentially reactive: you can\'t fully read what\'s happening AND you can\'t hold yourself steady while it happens. This isn\'t a character flaw — it\'s a developmental stage.' : 'One of these systems is stronger than the other, creating a specific imbalance in how you handle conflict.'}`,
    arc: {
      protection: 'Your conflict architecture developed as a complete system — each piece supporting the others in keeping you safe during relational stress.',
      cost: !eqHigh && !diffHigh ? 'Reactive conflict that damages trust and fails to resolve issues. Both the reading and the holding need development.' : eqHigh && !diffHigh ? 'You see everything clearly but can\'t hold your ground — you capitulate or get swept up.' : !eqHigh && diffHigh ? 'You hold your position without reading the emotional impact — you stand firm but may stand alone.' : 'Even skilled conflict can become strategic rather than genuine if you\'re not careful.',
      emergence: eqHigh && diffHigh ? 'Use your capacity to model healthy conflict for your partner. Create safety for THEIR engagement.' : 'Build the weaker system. EQ and differentiation together transform conflict from something you survive into something that deepens the relationship.',
    },
    practice: eqHigh && diffHigh
      ? 'In conflict, focus on creating safety for your partner\'s engagement rather than advancing your position. You can afford to — your skills will ensure you\'re heard.'
      : 'Identify whether you need more reading (EQ) or more holding (differentiation) in conflict. Practice that one thing this week.',
    oneThing: !eqHigh && !diffHigh ? 'Conflict gets better when you can see AND stand.' : null,
    depth: 'triple',
    domains: ['navigation', 'stance', 'conflict'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// TRIPLE 6: Attachment × Differentiation × Values
// ═══════════════════════════════════════════════════════

register(['foundation', 'stance', 'compass'], (s) => {
  const anxious = isAnxious(s);
  const diffHigh = getDSITotal(s) >= 60;
  const avgGap = getAvgValueGap(s);
  const topValues = getTopValues(s);

  return {
    title: anxious && !diffHigh && avgGap >= 3 ? 'The Abandoned Self'
      : 'Your Identity × Connection × Compass',
    subtitle: 'Attachment × Differentiation × Values',
    body: anxious && !diffHigh && avgGap >= 3
      ? `This triple reveals a core pattern: attachment anxiety drives you toward connection, low differentiation (${Math.round(getDSITotal(s))}) means you lack a firm "I" to anchor to, and your values gap (${avgGap.toFixed(1)}/10) confirms that what matters to you (${topValues.slice(0, 3).join(', ')}) isn't being lived.\n\nThe thread connecting all three: you sacrifice self for connection. Your values are the casualty. Your differentiation is the missing piece. Your anxiety is the driver.`
      : `Attachment shapes how you pursue connection. Differentiation determines how much of yourself you can maintain in that pursuit. Values are your compass for whether the trade-offs you're making are worth it.\n\n${diffHigh ? 'Your strong differentiation helps you hold values while staying connected.' : 'Developing differentiation means your values may bend under relational pressure.'} ${avgGap >= 3 ? `The values gap (${avgGap.toFixed(1)}/10) suggests the trade-offs aren't serving you.` : 'Your aligned values suggest you\'re navigating this well.'}`,
    arc: {
      protection: anxious && !diffHigh ? 'Connection took priority over everything — including your own values and self-definition.' : 'Your three systems negotiated a balance between connection, selfhood, and values.',
      cost: anxious && !diffHigh && avgGap >= 3 ? 'You\'ve traded yourself for the relationship. The values gap is the measure of what you\'ve given away.' : 'Any imbalance among these three shows up as either self-loss, disconnection, or values drift.',
      emergence: anxious && !diffHigh ? 'Build differentiation. It\'s the keystone. With a firmer self, your values have something to anchor to, and your anxiety has a ground to stand on.' : 'These three systems in balance create a person who can be close, true to themselves, and living their values simultaneously.',
    },
    practice: anxious && !diffHigh && avgGap >= 3
      ? 'Pick your most important value. Name one way you compromise it for your relationship. This week, hold it once — gently, without ultimatum. "This matters to me" is enough.'
      : 'Check: are your relationship choices aligned with your values? Not perfectly — but directionally?',
    oneThing: anxious && !diffHigh && avgGap >= 3 ? 'Your values are the breadcrumbs back to yourself.' : null,
    depth: 'triple',
    domains: ['foundation', 'stance', 'compass'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// TRIPLE 7: Attachment × Conflict × Values
// ═══════════════════════════════════════════════════════

register(['foundation', 'conflict', 'compass'], (s) => {
  const anxious = isAnxious(s);
  const style = getConflictStyle(s);
  const avgGap = getAvgValueGap(s);
  const topValues = getTopValues(s);

  return {
    title: anxious && style === 'yielding' && avgGap >= 3 ? 'The Values Sacrifice'
      : 'When Your Heart, Voice, and Compass Disagree',
    subtitle: 'Attachment × Conflict × Values',
    body: `What do you do when living your values requires a fight your attachment system doesn't want to have?\n\n${anxious && (style === 'yielding' || style === 'avoiding')
      ? `Your anxiety says "keep the peace," your ${style} conflict style complies, and your values (${topValues.slice(0, 3).join(', ')}) go undefended. The gap (${avgGap.toFixed(1)}/10) is the measure of what you\'ve surrendered.`
      : `Your ${anxious ? 'anxious' : isAvoidant(s) ? 'avoidant' : 'secure'} attachment interacts with your ${style} conflict style to create a specific pattern for how you defend — or abandon — what matters to you.`}`,
    arc: {
      protection: 'Whichever of these three is strongest tends to dominate. If attachment wins, values yield. If conflict style wins, connection may suffer. If values win, the relationship may feel rigid.',
      cost: avgGap >= 3 ? `A gap of ${avgGap.toFixed(1)}/10 suggests your values are consistently losing. They need representation in your relational life.` : 'Even without a large gap, the potential for values compromise exists whenever attachment and conflict intersect.',
      emergence: 'Integration means you can fight for what matters without losing the connection. This requires all three systems to cooperate rather than dominate.',
    },
    practice: 'Identify one value you\'ve been yielding on. Name it to your partner as something important to you. Not as a demand — as sharing. "I want you to know this matters to me, even when I don\'t fight for it."',
    oneThing: avgGap >= 3 ? 'Your values need your voice, especially in the moments you want to stay quiet.' : null,
    depth: 'triple',
    domains: ['foundation', 'conflict', 'compass'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// TRIPLE 8: EQ × Conflict × Values
// ═══════════════════════════════════════════════════════

register(['navigation', 'conflict', 'compass'], (s) => {
  const eqHigh = getEQTotal(s) >= 65;
  const style = getConflictStyle(s);
  const avgGap = getAvgValueGap(s);

  return {
    title: eqHigh && style === 'avoiding' && avgGap >= 3 ? 'The Aware Compromiser'
      : 'Your Skill, Strategy, and Compass',
    subtitle: 'EQ × Conflict × Values',
    body: `Your emotional intelligence (${Math.round(getEQTotal(s))}) determines how you read what's at stake. Your conflict style (${style}) determines what you do about it. Your values (${getTopValues(s).slice(0, 3).join(', ')}) determine whether it was worth it.\n\n${eqHigh && avgGap >= 3 ? 'You see clearly, but your conflict approach isn\'t serving your values. The emotional intelligence shows you the gap — your conflict style maintains it.' : !eqHigh ? 'Growing your EQ will help you navigate the intersection of conflict and values more skillfully — seeing both what matters and what the fight will cost.' : 'Your alignment is working — continue refining the balance.'}`,
    arc: {
      protection: 'These three systems represent your head (EQ reads the situation), your strategy (conflict style acts), and your heart (values motivate). When they align, you\'re unstoppable.',
      cost: avgGap >= 3 ? 'Your strategy isn\'t serving your heart. The head sees the problem. Something needs to change.' : 'Watch for moments when strategy overrides values or EQ overrides genuine conviction.',
      emergence: 'The ideal: emotional perception that serves values-aligned engagement. You see clearly, act skillfully, and stay true to what matters.',
    },
    practice: 'Before your next important conversation, ask three questions: "What do I see happening?" (EQ), "What do I usually do?" (conflict style), "What actually matters here?" (values). Let the third question lead.',
    oneThing: null,
    depth: 'triple',
    domains: ['navigation', 'conflict', 'compass'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// TRIPLE 9: Personality × EQ × Differentiation
// ═══════════════════════════════════════════════════════

register(['instrument', 'navigation', 'stance'], (s) => {
  const nHigh = getN(s) >= 65;
  const eqHigh = getEQTotal(s) >= 65;
  const diffHigh = getDSITotal(s) >= 60;

  return {
    title: nHigh && eqHigh && diffHigh ? 'The Sensitive Sage'
      : nHigh && !eqHigh && !diffHigh ? 'The Raw Flame'
      : 'Your Nature × Skill × Self',
    subtitle: 'Personality × EQ × Differentiation',
    body: `Your temperament is the raw material (N: ${Math.round(getN(s))}th, E: ${Math.round(getE(s))}th), your EQ (${Math.round(getEQTotal(s))}) is the skill set, and your differentiation (${Math.round(getDSITotal(s))}) is the container.\n\n${nHigh && eqHigh && diffHigh ? 'All three are strong: deep sensitivity, skilled processing, and solid containment. You feel everything, understand it, and can hold it. This is emotional maturity at its best.' : nHigh && !eqHigh && !diffHigh ? 'You have intense raw material with developing tools and a still-forming container. The sensitivity is real; what you need is the infrastructure to hold it.' : 'The balance between these three determines your emotional architecture — how much you feel, what you do with it, and whether you can hold yourself through it.'}`,
    arc: {
      protection: 'Your temperament came first. EQ and differentiation developed around it, either supporting or compensating for your natural intensity.',
      cost: nHigh && (!eqHigh || !diffHigh) ? 'When the tools or container can\'t match the intensity, the result is overwhelm — not because you feel too much, but because the support hasn\'t caught up.' : 'Even balanced systems have blind spots.',
      emergence: 'The goal isn\'t changing your temperament — it\'s building the EQ and differentiation to match its intensity. Nature stays; capacity grows.',
    },
    practice: nHigh && (!eqHigh || !diffHigh)
      ? 'Daily 5-minute check-in: name three emotions you\'re feeling (builds EQ) and ask "are these mine?" (builds differentiation).'
      : 'Notice which of your three systems takes the lead in different contexts. Where does your temperament dominate? Where does skill compensate? Where does your self-definition anchor you?',
    oneThing: nHigh && !eqHigh && !diffHigh ? 'Your intensity isn\'t the problem. The container is still growing.' : null,
    depth: 'triple',
    domains: ['instrument', 'navigation', 'stance'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// TRIPLE 10: Differentiation × Conflict × Values
// ═══════════════════════════════════════════════════════

register(['stance', 'conflict', 'compass'], (s) => {
  const diffHigh = getDSITotal(s) >= 60;
  const style = getConflictStyle(s);
  const avgGap = getAvgValueGap(s);

  return {
    title: !diffHigh && style === 'yielding' && avgGap >= 3 ? 'The Surrendered Compass'
      : diffHigh && style === 'forcing' && avgGap < 3 ? 'The Values Warrior'
      : 'Your Ground, Your Fight, Your Heart',
    subtitle: 'Differentiation × Conflict × Values',
    body: `How firmly can you stand (differentiation: ${Math.round(getDSITotal(s))}), how do you engage (${style}), and what are you standing for (${getTopValues(s).slice(0, 3).join(', ')})?\n\n${!diffHigh && avgGap >= 3 ? 'Without strong self-definition AND a significant values gap, your conflict style — whatever it is — isn\'t serving what actually matters to you. You can\'t fight for values you can\'t hold.' : diffHigh && avgGap < 3 ? 'Your strong self-definition supports aligned values. You know what matters, you live it, and you can engage conflict from that grounded place.' : 'The interaction of these three shapes whether you can advocate effectively for what matters most in your relational life.'}`,
    arc: {
      protection: `${!diffHigh ? 'Without firm ground, your conflict style was reactive rather than values-driven.' : 'Your solid ground gave your conflict style something real to defend.'}`,
      cost: !diffHigh && avgGap >= 3 ? 'Values without differentiation are wishes. You know what matters but can\'t hold it against relational pressure.' : 'Even strong systems can become rigid. Make sure your ground has some give.',
      emergence: 'The integrated version: clear self-definition that holds values, a conflict style that serves those values, and values that are worth the fight.',
    },
    practice: !diffHigh && avgGap >= 3
      ? 'Write down your three most important values. For each one, write: "I am the kind of person who ___." Live one of those statements this week.'
      : 'In your next disagreement, pause and ask: "Which of my values is at stake here?" Let the answer orient your engagement.',
    oneThing: !diffHigh && avgGap >= 3 ? 'You can\'t fight for what you can\'t hold. Build the ground first.' : null,
    depth: 'triple',
    domains: ['stance', 'conflict', 'compass'],
    confidence: 'high',
  };
});

/** Get all registered triple keys */
export function getAvailableTriples(): string[] {
  return Object.keys(TRIPLE_REGISTRY);
}
