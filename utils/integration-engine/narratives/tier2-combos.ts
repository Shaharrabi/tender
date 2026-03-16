/**
 * Tier 2 — Priority Pairwise Cross-Domain Combinations
 * ────────────────────────────────────────────────────────
 * 12 priority combos with conditional branches based on score values.
 * Each branch produces all 6 lens narratives, a developmental arc,
 * a matched practice, and an invitation.
 */

import type { IntegrationScores, IntegrationResult, LensedNarrative, MatchedPractice } from '../types';
import {
  getAnxiety, getAvoidance, isAnxious, isAvoidant, isSecure,
  getEQPerception, getEQManagingSelf, getEQManagingOthers, getEQTotal,
  getReactivity, getIPosition, getFusion, getCutoff, getDSITotal,
  getYielding, getAvoiding, getForcing, getProblemSolving,
  getN, getE, getO, getA, getC,
  getTopValues, getAvgValueGap, getBiggestGapValue,
} from '../helpers';

// ─── Internal helpers ──────────────────────────────────

/** Normalize domain pair to a canonical order for matching */
function domainPair(a: string, b: string): string {
  return `${a}×${b}`;
}

function pairMatches(domA: string, domB: string, targetA: string, targetB: string): boolean {
  return (domA === targetA && domB === targetB) || (domA === targetB && domB === targetA);
}

/** Get average accordance across all values */
function getAvgAccordance(s: IntegrationScores): number {
  const domains = s.values?.domainScores;
  if (!domains) return 0;
  const vals = Object.values(domains).map(d => d.accordance);
  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

// ─── Combo builders ────────────────────────────────────

function combo1(s: IntegrationScores): IntegrationResult | null {
  const anxiety = getAnxiety(s);
  const perception = getEQPerception(s);

  // Branch A: High anxiety (>4.0) + High perception (>65)
  if (anxiety > 4.0 && perception > 65) {
    const lenses: LensedNarrative = {
      therapeutic: `Your emotional radar is remarkably sensitive (perception: ${Math.round(perception)}). EFT research identifies this combination as clinically significant — you detect every shift in the attachment field, but your anxiety system hijacks the reading. The perception is accurate. The interpretation runs through a threat filter. What your perception detects as "something changed," your anxiety rewrites as "something is wrong, and it's about me." Clinical recommendation from the literature: use ACT defusion techniques to separate the sensing from the story.`,
      soulful: `You walk through the relational field awake. Painfully, beautifully awake. You feel the temperature drop between you and your partner before they've said a word. You notice the micro-shift in their posture, the half-second delay in their reply, the way their eyes move to the middle distance. Your radar is extraordinary. And it is wired to your alarm system. What you sense is almost always real. What your anxiety tells you it MEANS is almost always the old wound talking — not the current reality. The invitation: trust the perception. Question the interpretation. "I notice something shifted" is information. "They're pulling away because I'm too much" is a story written by a younger version of you who had very good reasons to believe it.`,
      practical: `You sense something shifted → your anxiety writes a story about what it means → you react to the story, not the shift.\n\nTHIS WEEK: When you sense something changed between you (and you will — your radar is strong), practice the TWO-SENTENCE method:\nSentence 1 (what you sensed): "I notice some tension right now."\nSentence 2 (checking the story): "The story I'm telling myself is that you're pulling away. Is that what's happening?"\n\nSeparate the perception from the interpretation. Out loud. Every time.`,
      developmental: `Your perception represents a genuinely advanced developmental capacity — Kegan's Order 4 ability to take the relational field as an object of observation. But your anxiety keeps pulling you back to Order 3 reactivity, where the observation immediately becomes fusion with the emotion. You SEE the pattern at a 4. You REACT to it at a 3. The developmental edge: building the half-second gap between sensing and reacting. That gap is where growth lives.`,
      relational: `Your partner probably finds your perception both a gift and a burden. A gift: you notice things about them that no one else does. You remember what they said three weeks ago. You catch the sadness behind the smile. A burden: you also notice things they weren't ready to discuss. You pick up on moods they hadn't processed yet. And when your anxiety colors the perception, they feel accused of things they haven't done — because you're responding to the story, not to them.`,
      simple: `You sense everything. Your anxiety rewrites everything. Learn to trust the radar and question the narrator.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'The Two-Sentence Check',
      modality: 'ACT defusion',
      instruction: `When you sense something shifted, say two sentences: 'I notice some tension right now. The story I'm telling myself is [X]. Is that what's happening?' Separate the sensing from the story. Out loud.`,
      whyThisOne: `Your radar is accurate. Your anxiety's interpretation often isn't. This practice separates the two.`,
      frequency: 'Every time you sense a shift — aim for twice this week',
    };

    return {
      title: 'The Accurate Alarm',
      subtitle: 'Your attachment anxiety × emotional perception',
      body: lenses.soulful,
      arc: {
        wound: `You learned to watch for danger in the people you love — because safety was never guaranteed.`,
        protection: `A hypervigilant radar that catches every shift. It kept you one step ahead of abandonment.`,
        cost: `You react to the story your anxiety writes, not to what you actually sensed. Your partner feels accused of things that haven't happened.`,
        emergence: `Trust the perception. Question the interpretation. The radar is real. The narrator needs updating.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Trust the radar. Question the narrator.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
      patternId: 'anxiety_x_perception_high_high',
      lenses,
      matchedPractice,
      invitation: 'Trust the radar. Question the narrator.',
      evidenceLevel: 'strong',
      keyCitations: ['EFT attachment-perception research', 'ACT defusion techniques'],
    };
  }

  // Branch B: High anxiety (>4.0) + Low perception (<40)
  if (anxiety > 4.0 && perception < 40) {
    const lenses: LensedNarrative = {
      therapeutic: `Your attachment anxiety (${anxiety.toFixed(1)}) creates constant threat-scanning, but your emotional perception (${Math.round(perception)}) isn't reliably picking up the actual signals. Research on acceptance and attachment in couples shows attachment explains the greatest variance in relationship instability. Your combination means you react to threats that aren't there and miss signals that are — your anxiety fills the perception gaps with worst-case narratives.`,
      soulful: `Your heart is on high alert, always scanning the horizon for signs of storm. But your radar is blurry. You can't quite read what your partner is feeling — is that sadness? Anger? Tiredness? Indifference? The uncertainty is unbearable for a system wired for threat, so your anxiety fills the blank with the worst possibility. You are not wrong to be watchful. You are reading with blurry vision. The invitation: before you react to what you THINK you're sensing, check. "I can't tell what you're feeling right now. Can you help me?"`,
      practical: `THE PATTERN: Anxiety scans → perception is unclear → anxiety fills the gap with worst-case stories → you react to the story.\n\nTHIS WEEK: Before reacting to what you THINK your partner is feeling, ask: "I'm sensing something but I'm not sure what. Am I reading you right?" Check the data before responding to the interpretation.`,
      developmental: `Low perception combined with high anxiety suggests the threat-detection system overdeveloped while the emotional-reading system underdeveloped — likely because in early environments, detecting DANGER was more survival-critical than accurately reading FEELINGS. The developmental move: building perception as a separate skill. Not to reduce anxiety — but to give it better data.`,
      relational: `Your partner may feel misread — accused of emotions they're not having, while the emotions they ARE having go unnoticed. They might say: "You always think I'm upset when I'm fine, but you never notice when I'm actually sad." That's the perception gap your anxiety fills with its own narrative.`,
      simple: `You feel the danger but can't read the signal. Stop guessing. Start asking.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Check Before Reacting',
      modality: 'EFT + mindfulness',
      instruction: `Before reacting to what you THINK your partner is feeling, ask: 'I'm sensing something but I'm not sure what. Am I reading you right?' Get data before interpreting.`,
      whyThisOne: `Your anxiety fills perception gaps with worst-case stories. Asking gives your system better information.`,
      frequency: 'Once this week',
    };

    return {
      title: 'The Blurry Alarm',
      subtitle: 'Your attachment anxiety × low emotional perception',
      body: lenses.soulful,
      arc: {
        wound: `Detecting danger was more important than reading feelings. Your system prioritized the alarm over the radar.`,
        protection: `Anxiety fills every perceptual gap with worst-case scenarios — better to assume danger than miss it.`,
        cost: `You react to threats that aren't there and miss signals that are. Your partner feels misread.`,
        emergence: `Build the perception alongside the anxiety. Better data means better responses.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Stop guessing. Start asking.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
      patternId: 'anxiety_x_perception_high_low',
      lenses,
      matchedPractice,
      invitation: 'Stop guessing. Start asking.',
      evidenceLevel: 'moderate',
      keyCitations: ['Conradi & Kamphuis, 2025'],
    };
  }

  // Branch C: Low anxiety (<3.0) + High perception (>65)
  if (anxiety < 3.0 && perception > 65) {
    const lenses: LensedNarrative = {
      therapeutic: `This is therapeutically rare and valuable — strong emotional perception without the anxiety distortion. Your reading of the relational field is both accurate and relatively undistorted by threat. Research shows acceptance and emotional accessibility as the strongest predictors of satisfaction — you have the perceptive foundation for both.`,
      soulful: `You have a quiet superpower. You sense the field between you and your partner with clarity — not the anxious, distorted clarity of someone scanning for threats, but the calm clarity of someone who simply notices. The rain without the panic. The temperature change without the alarm. This gives you something most people spend years in therapy trying to build: the ability to hold what you sense without being consumed by it.`,
      practical: `Your perception is an asset that isn't distorted by anxiety. Your edge: USE it. This week, share one observation about the space between you that you normally keep to yourself: "I notice we've been a little distant this week." Your partner will value the attunement.`,
      developmental: `You may already be at Kegan's Order 4 — able to observe the relational field without being fused with it. Your growth edge: can you use this capacity in service of your partner's development, not just your own awareness? Can you share what you see in a way that invites them into the observation?`,
      relational: `Your partner likely experiences you as deeply attentive without being overwhelming. They feel seen without feeling surveilled. This is a relational gift. The only risk: if you see patterns but don't share them, your partner misses the benefit of your clarity.`,
      simple: `You see clearly and you hold it calmly. That's rare. Share what you see.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Share the Observation',
      modality: 'Gottman attunement',
      instruction: `This week, share one observation about the relational space: 'I notice we've been a little distant.' Your calm perception is trustworthy — let your partner benefit from it.`,
      whyThisOne: `You have undistorted perception — rare and valuable. The practice is sharing it.`,
      frequency: 'Once this week',
    };

    return {
      title: 'The Clear Witness',
      subtitle: 'Your secure attachment × high emotional perception',
      body: lenses.soulful,
      arc: {
        protection: `Your calm perception is already a resource — no distortion to overcome.`,
        cost: `The only risk is hoarding your insight. If you see but don't share, your partner misses the gift.`,
        emergence: `Share what you see. Your clarity is a relational resource waiting to be deployed.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'You see clearly. Share what you see.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
      patternId: 'anxiety_x_perception_low_high',
      lenses,
      matchedPractice,
      invitation: 'You see clearly. Share what you see.',
      evidenceLevel: 'moderate',
      keyCitations: ['Conradi & Kamphuis, 2025'],
    };
  }

  return null;
}

function combo2(s: IntegrationScores): IntegrationResult | null {
  const anxiety = getAnxiety(s);
  const yielding = getYielding(s);
  const forcing = getForcing(s);

  // Branch A: High anxiety (>4.0) + High yielding (>3.5)
  if (anxiety > 4.0 && yielding > 3.5) {
    const lenses: LensedNarrative = {
      therapeutic: `EFT and ACT research both address this combination directly. Trials comparing EFT and ACT found both approaches increased positive partner feelings and reduced relationship withdrawal. The mechanism: your yielding isn't a personality trait — it's your anxiety's conflict strategy. Your attachment system reads disagreement as potential abandonment, so it deploys accommodation to eliminate the threat. The research recommends combining EFT emotion access (surfacing the fear underneath) with ACT committed action (building assertion as a values-aligned behavior).`,
      soulful: `You yield not from generosity but from fear. Not the fear of your partner — the fear of the absence of your partner. Every accommodation is a small prayer: please don't leave. Please don't leave. Your nervous system learned this prayer before you had words for it, and it runs now in the background of every disagreement, every difference, every moment when what you want and what your partner wants are not the same. The yielding keeps the surface smooth. Underneath, a slowly building pressure of all the things you've swallowed. One day the pressure finds a crack, and what comes out carries the accumulated weight of years. Your partner will be blindsided. Start relieving the pressure now. One small truth at a time.`,
      practical: `THE PATTERN: Disagreement arises → anxiety says "they'll leave if you push back" → you yield → resentment builds silently → repeat.\n\nTHIS WEEK: In one small disagreement (not the big ones yet), state your actual preference BEFORE yielding: "I'd rather do X, but I'm willing to do Y." You don't have to fight for it. Just name it. Let your partner know you HAVE a position, even when you don't push it.`,
      developmental: `The anxious-yielding combination often traces to environments where expressing needs led to relational rupture. Your system learned: my needs are dangerous. In Kegan's framework, you're operating from the Socialized Mind (Order 3) specifically in conflict — your sense of what's acceptable to want is defined by what you believe your partner can tolerate. The developmental move is authoring your own needs from the inside: "This is what I want, regardless of what my anxiety says about its safety."`,
      relational: `Your partner thinks the relationship is smooth. Conflict-free. Easy. They have no idea you're editing yourself in real time. And they're slowly losing access to who you actually are — because every yield removes another piece of your true self from the relationship. They may eventually feel the flatness and not know where it comes from. It comes from your absence.`,
      simple: `You yield not from agreement but from fear. Your partner can't love someone who's not fully there. Show up. One preference at a time.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'State Before Yielding',
      modality: 'EFT + ACT',
      instruction: `In one small disagreement this week, state your actual preference BEFORE yielding: 'I'd rather do X, but I'm willing to do Y.' You don't have to fight for it — just name it.`,
      whyThisOne: `Your yielding is anxiety's conflict strategy, not your choice. Naming your preference reclaims the choice.`,
      frequency: 'Once this week',
    };

    return {
      title: 'The Anxious Yield',
      subtitle: 'Your attachment anxiety × yielding conflict style',
      body: lenses.soulful,
      arc: {
        wound: `Expressing needs led to rupture. Your system learned: disagreement = abandonment.`,
        protection: `Yielding eliminates the threat of conflict by eliminating your position.`,
        cost: `Resentment builds under the smooth surface. Your partner loses access to who you are.`,
        emergence: `Name your preference before yielding. Let your partner know you HAVE a position.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Show up. One preference at a time.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
      patternId: 'anxiety_x_yielding',
      lenses,
      matchedPractice,
      invitation: 'Show up. One preference at a time.',
      evidenceLevel: 'strong',
      keyCitations: ['EFT-ACT comparison trials', 'Barraca Mairal et al., 2024'],
    };
  }

  // Branch B: High anxiety (>4.0) + High forcing (>3.5)
  if (anxiety > 4.0 && forcing > 3.5) {
    const lenses: LensedNarrative = {
      therapeutic: `When anxiety drives conflict through forcing rather than yielding, the mechanism is different: your attachment system reads distance as danger and responds with escalation rather than accommodation. Gottman's research identifies this as the criticism pathway — not cruelty, but desperate urgency: "If I can make them understand how badly this hurts, they'll change." The transdiagnostic EFT literature recommends regulation before enactment — calming the flooding so the message can land without the volume.`,
      soulful: `Your love is loud. When the distance between you and your partner grows, something ancient rises — not anger exactly, more like urgency. A desperate, burning need to close the gap RIGHT NOW. And the intensity of that need comes out as force. As pressure. As "We need to TALK about this." Your partner backs away from the heat. You pursue harder. They retreat further. The cycle is a closed loop — your love expressed as fire, their love expressed as flight, and neither of you can see the other's caring through the smoke. The same message, at half the volume, would reach them. Your heart doesn't need to be quieter. Your delivery does.`,
      practical: `THE PATTERN: Anxiety detects distance → forcing escalates the approach → partner retreats from intensity → distance grows → anxiety spikes → repeat.\n\nTHIS WEEK: When you feel the urge to press your point, replace the statement with a question: "I'm scared we're disconnecting. Can we slow down?" Same need, no force. Watch what happens.`,
      developmental: `Forcing under anxiety represents a developmental strategy that worked in an environment where the loudest need got met. In environments of inconsistent caregiving, intensity was adaptive — it secured attention. The developmental move: discovering that your adult partner responds to vulnerability, not volume. That's a fundamental update to the nervous system's model of how love works.`,
      relational: `Your partner experiences your anxiety-driven forcing as attack. They can't hear the love underneath the volume. They hear: criticism. Pressure. "I can't get anything right." Their retreat isn't rejection — it's self-protection from the intensity. What they need: "I'm scared right now" instead of "You always do this."`,
      simple: `The intensity is love. But love at that volume deafens. Same heart, half the volume. That's the practice.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Question Instead of Statement',
      modality: 'Gottman soft startup',
      instruction: `When you feel the urge to press your point, replace the statement with a question: 'I'm scared we're disconnecting. Can we slow down?' Same need, delivered as vulnerability instead of force.`,
      whyThisOne: `Your partner can't hear love through the volume. A question reaches them where a demand can't.`,
      frequency: 'Once this week',
    };

    return {
      title: 'The Anxious Pursuit',
      subtitle: 'Your attachment anxiety × forcing conflict style',
      body: lenses.soulful,
      arc: {
        wound: `In your early world, louder got heard. Intensity secured the attention survival required.`,
        protection: `Forcing closes the gap urgently — it's your anxiety's escalation strategy for preventing abandonment.`,
        cost: `Your partner retreats from the heat, confirming the fear, escalating the cycle.`,
        emergence: `Replace the statement with a question. Same need, no force. Your partner responds to vulnerability, not volume.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Same heart, half the volume. That\'s the practice.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
      patternId: 'anxiety_x_forcing',
      lenses,
      matchedPractice,
      invitation: 'Same heart, half the volume. That\'s the practice.',
      evidenceLevel: 'moderate',
      keyCitations: ['Gottman soft startup research', 'Transdiagnostic EFT'],
    };
  }

  return null;
}

function combo3(s: IntegrationScores): IntegrationResult | null {
  const perception = getEQPerception(s);
  const fusion = getFusion(s);

  // Branch A: High perception (>65) + High fusion (>65)
  if (perception > 65 && fusion > 65) {
    const lenses: LensedNarrative = {
      therapeutic: `This combination is central to several clinical patterns. Your strong emotional perception (${Math.round(perception)}) means you read the relational field accurately. Your high fusion (${Math.round(fusion)}) means you ABSORB what you read. Research on actor-partner interdependence confirms that both partners' emotional states are interlinked — but your combination means the interlinking overwhelms your ability to maintain a separate perspective. The 2025 machine-learning attunement study demonstrated that emotional alignment between partners is measurable and real — you're not imagining the merge. You're experiencing it.`,
      soulful: `You live inside a shared emotional body with no skin. Your partner's sadness becomes your sadness. Their anxiety becomes your anxiety. Their withdrawal becomes your abandonment. You don't just empathize — you BECOME the other's emotional state. This is not a flaw. It is a gift turned inward on itself — like a radio receiver so powerful it picks up every station simultaneously and can't distinguish any single signal. The invitation is not less perception. It is a boundary that the perception can flow AROUND instead of THROUGH. Not a wall. A riverbank — shaping the flow without stopping it.`,
      practical: `Three times this week, pause and ask: "Is this feeling MINE, or am I picking it up from the field?" You don't need to answer correctly. Just asking creates a boundary your nervous system can start to recognize.`,
      developmental: `In Kegan's framework, this is the core Order 3→4 transition: you can PERCEIVE the relational field (that's an Order 4 capacity) but you can't yet HOLD yourself separate from it (that's still Order 3 fusion). The developmental edge is becoming the observer who stays grounded while sensing the field. Not less connected — more differentiated within the connection.`,
      relational: `Your partner may feel deeply understood by you — and slightly suffocated. Your attunement is extraordinary. But because you absorb their state rather than observing it, they never get the experience of being WITNESSED — seen from a slight distance by someone who holds their own center. They get merged-with. That's not the same as being known.`,
      simple: `You sense everything and absorb everything. The practice: sense without merging. Observe without becoming. That's the skill.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Mine or Theirs?',
      modality: 'Mindfulness + DSI differentiation',
      instruction: `Three times this week, pause when you notice a strong feeling and ask: 'Is this feeling MINE, or am I picking it up from the field?' You don't need to answer correctly. Just asking creates the boundary.`,
      whyThisOne: `Your perception is extraordinary. The practice is learning to observe the field without being dissolved by it.`,
      frequency: 'Three times this week',
    };

    return {
      title: 'The Absorbing Witness',
      subtitle: 'Your emotional perception × fusion with others',
      body: lenses.soulful,
      arc: {
        protection: `Absorbing the field kept you attuned to others' needs — essential when knowing the emotional weather meant survival.`,
        cost: `You can't tell your feelings from your partner's. The merge overwhelms your own perspective.`,
        emergence: `Add a riverbank to the river. Sense the field without being dissolved by it.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Sense without merging. Observe without becoming.',
      depth: 'pairwise',
      domains: ['navigation', 'stance'],
      confidence: 'high',
      patternId: 'perception_x_fusion',
      lenses,
      matchedPractice,
      invitation: 'Sense without merging. Observe without becoming.',
      evidenceLevel: 'moderate',
      keyCitations: ['Başer et al., 2025 (attunement study)', 'Conradi & Kamphuis, 2025'],
    };
  }

  return null;
}

function combo4(s: IntegrationScores): IntegrationResult | null {
  const avoidance = getAvoidance(s);
  const avoiding = getAvoiding(s);

  // Branch A: High avoidance (>4.0) + High conflict-avoiding (>3.5)
  if (avoidance > 4.0 && avoiding > 3.5) {
    const lenses: LensedNarrative = {
      therapeutic: `Double withdrawal across attachment AND conflict dimensions. Research on acceptance and attachment in 539 couples found attachment explained the largest proportion of variance in relationship instability — and your combination represents both attachment and behavioral avoidance operating simultaneously. EFT's transdiagnostic framework identifies this as a system where defensive exclusion of vulnerability maintains emotional distance and prevents repair. The clinical recommendation: prioritize safety and accessibility before any behavioral activation.`,
      soulful: `The surface between you and your partner is permanently calm. No storms. No raised voices. No tears. From the outside it looks like peace. From the inside you know: it is the absence of weather. Nothing gets in, nothing gets out, nothing gets resolved. Issues accumulate like sediment on a riverbed — invisible until the river changes course and everything dislodges at once. You are not keeping the peace. You are keeping the silence. And silence, in a relationship, is the slowest way to leave.`,
      practical: `THE PATTERN: Something needs discussing → your attachment system says "closeness is dangerous" → your conflict system says "tension is worse" → nothing gets said → distance grows imperceptibly → repeat for years.\n\nTHIS WEEK: Bring up ONE thing you've been sitting on. Doesn't have to be the biggest thing. Start with: "There's something I've been avoiding saying." Then say it. That's the whole practice. Breaking the seal matters more than what comes through it.`,
      developmental: `This combination often represents an early environment where both emotional closeness AND conflict were unsafe. The nervous system found the only available solution: avoid both. In Kegan's terms, you may have achieved a version of the Self-Authoring Mind — but authored through exclusion rather than integration. Real self-authorship includes the capacity to hold tension, not just the capacity to avoid it.`,
      relational: `Your partner lives in a relationship where nothing is ever wrong — and nothing is ever fully right. They may have stopped bringing things up because they learned you'll withdraw. They've adapted to the calm. But underneath their adaptation is a loneliness they can't name: the loneliness of living with someone who is present but unreachable.`,
      simple: `Nothing gets discussed. Nothing gets resolved. Nothing gets better. One hard conversation this week. That's the beginning of everything.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Break the Seal',
      modality: 'EFT + IBCT',
      instruction: `Bring up ONE thing you've been sitting on this week. Start with: 'There's something I've been avoiding saying.' Then say it. Breaking the seal matters more than what comes through it.`,
      whyThisOne: `Double avoidance means nothing gets addressed. The first crack is the hardest and the most important.`,
      frequency: 'Once this week',
    };

    return {
      title: 'The Double Withdrawal',
      subtitle: 'Your attachment avoidance × conflict avoidance',
      body: lenses.soulful,
      arc: {
        wound: `Both emotional closeness and conflict were unsafe. Your system found the only available solution: avoid both.`,
        protection: `Double withdrawal maintains calm by preventing engagement. The surface stays smooth.`,
        cost: `Issues accumulate silently. Your partner lives with presence without connection.`,
        emergence: `Break the seal. One thing you've been sitting on, spoken aloud. The content matters less than the crack.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'One hard conversation. That\'s the beginning of everything.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
      patternId: 'avoidance_x_avoiding',
      lenses,
      matchedPractice,
      invitation: 'One hard conversation. That\'s the beginning of everything.',
      evidenceLevel: 'strong',
      keyCitations: ['Conradi & Kamphuis, 2025', 'EFT defensive exclusion research'],
    };
  }

  return null;
}

function combo5(s: IntegrationScores): IntegrationResult | null {
  const forcing = getForcing(s);
  const biggestGap = getBiggestGapValue(s);

  // Branch A: High forcing (>3.5) + biggest values gap (>2.0)
  if (forcing > 3.5 && biggestGap && biggestGap.gap > 2.0) {
    const lenses: LensedNarrative = {
      therapeutic: `ACT research directly addresses the values-behavior discrepancy: the 2024 meta-analysis reported g = -1.23 for marital satisfaction improvements through ACT protocols. Your combination reveals a specific pattern: you FORCE in conflict (you push your position hard) AND you have a gap on your values (the thing you're pushing may not be the thing that actually matters). Forcing becomes a substitute for vulnerability — you fight ABOUT things because you can't say the thing UNDERNEATH.`,
      soulful: `You have opinions. Positions. Arguments. You know how to push and you know how to win. And underneath all that force is a truth you haven't said. The values gap tells the story: the things you fight about are not the things that matter most. The real truth is quieter than your conflict style knows how to be. It sounds like: "I'm scared." Or: "I need you." Or: "I don't know if this is working." Those sentences require a different kind of strength than forcing. They require the courage to be soft in a moment that feels dangerous.`,
      practical: `THIS WEEK: In your next disagreement, pause and ask yourself: "Is this what I'm ACTUALLY upset about, or is there something underneath?" If there's something underneath, say THAT instead: "I think what I'm really feeling is..."`,
      developmental: `The forcing-with-values-gap pattern often traces to environments where vulnerability was not safe but assertiveness was. You learned to express intensity but not intimacy. The developmental move: building the muscle of vulnerable expression alongside the muscle of forceful expression. Not replacing force with softness — ADDING softness as an option.`,
      relational: `Your partner experiences your force and assumes that's the real you — opinionated, certain, pushing. They don't realize there's something beneath the force that you can't access in the heat of conflict. They might PREFER the vulnerable version. They've never met it.`,
      simple: `You fight about everything except the thing that matters. Say the quiet thing. The one underneath the argument.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'What\'s Underneath?',
      modality: 'ACT + EFT',
      instruction: `In your next disagreement, pause and ask: 'Is this what I'm ACTUALLY upset about?' If there's something underneath, say THAT: 'I think what I'm really feeling is...'`,
      whyThisOne: `Your force hides your vulnerability. Naming what's underneath transforms the conversation.`,
      frequency: 'Once this week',
    };

    return {
      title: 'The Forceful Deflection',
      subtitle: 'Your forcing conflict style × values gap',
      body: lenses.soulful,
      arc: {
        wound: `Vulnerability wasn't safe. Assertiveness was. You learned to express intensity but not intimacy.`,
        protection: `Forcing substitutes for vulnerability — you fight ABOUT things to avoid the thing UNDERNEATH.`,
        cost: `Your partner never meets the vulnerable truth beneath your positions.`,
        emergence: `Add softness as an option. Not replacing force — just giving the quiet truth a voice.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Say the quiet thing. The one underneath the argument.',
      depth: 'pairwise',
      domains: ['conflict', 'compass'],
      confidence: 'high',
      patternId: 'forcing_x_values_gap',
      lenses,
      matchedPractice,
      invitation: 'Say the quiet thing. The one underneath the argument.',
      evidenceLevel: 'strong',
      keyCitations: ['Barraca Mairal et al., 2024'],
    };
  }

  return null;
}

function combo6(s: IntegrationScores): IntegrationResult | null {
  const iPosition = getIPosition(s);
  const avgValueGap = getAvgValueGap(s);
  const avgAccordance = getAvgAccordance(s);

  // Branch A: High I-position (>65) + High values alignment (>80 implied by low gap)
  // + Low average action/accordance
  // High values alignment = low gap, but we also need low accordance relative to importance
  if (iPosition > 65 && avgValueGap < 1.5 && avgAccordance < 3.5) {
    const lenses: LensedNarrative = {
      therapeutic: `You know who you are AND you know what matters — but under relational pressure, you don't act on either. Research shows psychological flexibility (ACT) mediates the connection between values clarity and behavioral change. Your I-position gives you the developmental foundation; your values give you the compass; the gap is in the DOING.`,
      soulful: `You know exactly who you are. Your compass is strong, your values are clear, your sense of self is solid. And yet: the gap. Not in your knowing — in your living. You carry a clear internal truth and set it down at the door of every hard conversation. You walk in without it. Afterward you pick it back up, intact, unused. The truth has never been the problem. The courage to carry it into the room — that is what's developing.`,
      practical: `You have the self. You have the compass. You lack the movement. THIS WEEK: carry one value INTO one conversation. "This matters to me because honesty is one of my core values." Say the value out loud. Inside the conversation. Not after.`,
      developmental: `You may be at a mature Order 4 — self-authored, internally clear. The transition to Order 5 requires letting the relationship TEST your values, not just hold them. Can you speak your truth AND let your partner's response change you? That's inter-independence. That's the next edge.`,
      relational: `Your partner may sense your internal clarity and feel frustrated that it doesn't show up in your shared life. "I know what they believe. I just wish they'd ACT on it with me." They're waiting for your compass to become operational in the relationship, not just in your head.`,
      simple: `You know who you are. Now be that person out loud. In the room. With your partner watching.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Say the Value Out Loud',
      modality: 'ACT committed action',
      instruction: `Carry one value INTO one conversation this week: 'This matters to me because [value] is important to me.' Say it during the conversation, not after.`,
      whyThisOne: `You have the self and the compass. The practice is making them operational in the relationship.`,
      frequency: 'Once this week',
    };

    return {
      title: 'The Silent Compass',
      subtitle: 'Your I-position × values alignment',
      body: lenses.soulful,
      arc: {
        protection: `You hold your values internally — safe, clear, uncompromised. But also unexpressed.`,
        cost: `Your partner never experiences the full force of who you are. Your values stay theoretical in the relationship.`,
        emergence: `Carry the compass into the room. Speak the value during the conversation, not after.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Be that person out loud. In the room. With your partner watching.',
      depth: 'pairwise',
      domains: ['stance', 'compass'],
      confidence: 'high',
      patternId: 'iposition_x_values_alignment',
      lenses,
      matchedPractice,
      invitation: 'Be that person out loud. In the room. With your partner watching.',
      evidenceLevel: 'moderate',
      keyCitations: ['ACT committed action research'],
    };
  }

  return null;
}

function combo7(s: IntegrationScores): IntegrationResult | null {
  const anxiety = getAnxiety(s);
  const fusion = getFusion(s);

  // Branch A: High anxiety (>4.0) + High fusion (>65)
  if (anxiety > 4.0 && fusion > 65) {
    const lenses: LensedNarrative = {
      therapeutic: `This is one of the most common and clinically significant combinations in the research literature. EFT trials consistently find that attachment anxiety combined with low differentiation predicts the greatest relationship distress. Your anxiety pulls you toward closeness, and your fusion means closeness = dissolution. You don't just want connection — you merge with it. The relationship becomes your identity; any threat to it is a threat to your self. Research recommends EFT to access the fear underneath and ACT or differentiation-focused work to build the self that can tolerate closeness without disappearing.`,
      soulful: `Love, for you, is not something you experience. It is something you become. When you are close to someone, the boundary between your feelings and theirs dissolves like salt in water. You don't just love them — you become them. Their sadness is your sadness. Their approval is your survival. Their distance is your annihilation. This is not pathology. This is a heart so hungry for connection that it will sacrifice its own shape to maintain it. But love between two people requires two people. And right now there is one full person and one echo. The invitation is to rediscover your edges — not as walls, but as the place where you meet your partner instead of merging with them.`,
      practical: `THE PATTERN: You need closeness → you get close → you lose yourself in the closeness → your partner feels your weight → they create distance → you panic → you merge harder → repeat.\n\nTHIS WEEK: Do one thing that is entirely yours — that has nothing to do with your partner or the relationship. Notice how it feels to be a separate person who also happens to be in love. That distinction is the foundation of healthy intimacy.`,
      developmental: `Erikson's Intimacy vs. Isolation, complicated: you've achieved the FORM of intimacy (closeness, togetherness) without its SUBSTANCE (two whole selves meeting). Your intimacy is merger, not meeting. In Kegan's terms: Order 3 in the relational domain — your self is constructed from the relationship rather than brought TO it. The developmental move: building an internal center that can tolerate closeness without being dissolved by it.`,
      relational: `Your partner may feel engulfed. Not by your love — by the WEIGHT of being your entire emotional world. They can't take space without it feeling like betrayal. They can't disagree without it feeling like abandonment. The pressure of being someone's everything is suffocating, even when the love is real. What they need: evidence that you can be okay on your own. That your happiness doesn't depend entirely on them. That gives them room to choose you freely instead of feeling trapped by your need.`,
      simple: `You disappear into the people you love. The practice: find yourself first. Then bring that self to the relationship. Both. Not one or the other.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Something Entirely Yours',
      modality: 'Differentiation + ACT',
      instruction: `Do one thing this week that is entirely yours — that has nothing to do with your partner. Notice how it feels to be a separate person who also happens to be in love. That distinction is the foundation.`,
      whyThisOne: `Your fusion dissolves boundaries. This practice rebuilds them from the inside — through action, not theory.`,
      frequency: 'Once this week',
    };

    return {
      title: 'The Anxious Merge',
      subtitle: 'Your attachment anxiety × fusion with others',
      body: lenses.soulful,
      arc: {
        wound: `Connection and self-loss became the same thing. You learned love by dissolving.`,
        protection: `Merging eliminates the gap between you and your partner — no gap means no abandonment.`,
        cost: `Your partner carries the weight of being your entire world. They feel engulfed, not chosen.`,
        emergence: `Rediscover your edges. Not walls — meeting places. Where you end and your partner begins.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Find yourself first. Then bring that self to the relationship.',
      depth: 'pairwise',
      domains: ['foundation', 'stance'],
      confidence: 'high',
      patternId: 'anxiety_x_fusion',
      lenses,
      matchedPractice,
      invitation: 'Find yourself first. Then bring that self to the relationship.',
      evidenceLevel: 'strong',
      keyCitations: ['EFT attachment-differentiation research', 'Conradi & Kamphuis, 2025'],
    };
  }

  return null;
}

function combo8(s: IntegrationScores): IntegrationResult | null {
  const perception = getEQPerception(s);
  const avoiding = getAvoiding(s);

  // Branch A: High perception (>65) + High avoiding (>3.5)
  if (perception > 65 && avoiding > 3.5) {
    const lenses: LensedNarrative = {
      therapeutic: `You read the room and then leave the room. Your perception picks up the tension, but instead of engaging with what you sense, your conflict style pulls you away from it. Research shows this combination can be particularly corrosive because you're AWARE of what needs addressing and you choose not to address it. EFT research on defensive exclusion describes this precisely: the systematic shutting out of awareness that would require engagement. But your awareness isn't shut out — it's just disconnected from action.`,
      soulful: `You see everything. And you carry what you see alone. The tension between you and your partner — you feel it before they do. The unresolved conversation from last week — you sense it hanging in the room. The thing that needs to be said — you know exactly what it is. And you step around it. Again and again. Carrying the knowledge of what's wrong without using that knowledge to change anything. That is a particular kind of loneliness: the loneliness of the person who sees the problem clearly and can't bring themselves to name it.`,
      practical: `You see it. You avoid it. This week: take ONE thing you've been sensing and bring it into the open: "I've been noticing [thing] between us. Can we talk about it?" Your perception did the hard work. Let your voice do the rest.`,
      developmental: `You have Order 4 perception — you can observe the relational field. But your conflict avoidance is operating from Order 3 — driven by the relational system's rules about what's safe to name. The developmental move: letting your perception LEAD instead of your avoidance. You already see the territory. Now walk into it.`,
      relational: `Your partner may have NO IDEA how much you see. They think the relationship is "fine" because you never raise issues. But you're carrying an entire catalogue of unsaid observations. And each one, left unspoken, creates a tiny distance they can't account for.`,
      simple: `You see the problem. You walk around it. The problem doesn't move. This week: walk toward it instead.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Voice What You See',
      modality: 'EFT + Gottman',
      instruction: `Take ONE thing you've been sensing and bring it into the open: 'I've been noticing [thing] between us. Can we talk about it?' Your perception did the hard work. Let your voice do the rest.`,
      whyThisOne: `You see clearly but avoid naming what you see. This practice reconnects perception to voice.`,
      frequency: 'Once this week',
    };

    return {
      title: 'The Silent Seer',
      subtitle: 'Your emotional perception × conflict avoidance',
      body: lenses.soulful,
      arc: {
        protection: `Seeing without naming keeps the peace. Your perception works overtime; your voice stays silent.`,
        cost: `You carry the weight of unsaid observations alone. Your partner thinks everything is fine.`,
        emergence: `Let perception lead instead of avoidance. You already see it. Now name it.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Walk toward the problem. It doesn\'t move on its own.',
      depth: 'pairwise',
      domains: ['navigation', 'conflict'],
      confidence: 'high',
      patternId: 'perception_x_avoiding',
      lenses,
      matchedPractice,
      invitation: 'Walk toward the problem. It doesn\'t move on its own.',
      evidenceLevel: 'moderate',
      keyCitations: ['EFT defensive exclusion research'],
    };
  }

  return null;
}

function combo9(s: IntegrationScores): IntegrationResult | null {
  const N = getN(s);
  const anxiety = getAnxiety(s);

  // Branch A: High N (>70th percentile) + Anxious attachment (anxiety > 4.0)
  if (N > 70 && anxiety > 4.0) {
    const lenses: LensedNarrative = {
      therapeutic: `This amplification pattern is well-documented. High neuroticism increases the volume on ALL emotional signals; anxious attachment biases the interpretation toward threat. Combined, they create a nervous system that is simultaneously hypersensitive and negatively biased — detecting more signals and interpreting more of them as dangerous. Research shows emotional expressivity and attachment predict change trajectories in EFT — and this combination represents the high-expressivity, high-anxiety profile that benefits most from regulation-focused intervention before deeper attachment work.`,
      soulful: `You feel everything twice — once when it happens, and once more when your anxiety tells you what it meant. The sensitivity is not the problem. The volume is not the problem. The problem is that the volume and the alarm system are wired together. Every feeling becomes evidence. Every shift becomes proof. Every silence becomes a verdict. You are living at the intersection of too-much-feeling and too-much-meaning, and it is exhausting. Not because you're fragile. Because you're running a supercomputer of emotional processing on an overloaded circuit. The practice isn't feeling less. It's separating the feeling from the story.`,
      practical: `YOUR COMBINATION: Everything feels bigger (N: ${Math.round(N)}) AND everything feels threatening (anxiety: ${anxiety.toFixed(1)}).\n\nTHIS WEEK: When a feeling arrives with a story attached, practice the split: "I'm feeling [emotion]. The story my mind is adding is [story]. I'm going to sit with the feeling and check the story later."`,
      developmental: `High neuroticism + anxious attachment often reflects an environment where emotional intensity was both the signal and the noise — feelings were big AND interpretation of those feelings was unreliable. The developmental move: building the internal observer who can HOLD the feeling without immediately making meaning from it.`,
      relational: `Your partner may experience you as intensely reactive — responding to everything with the same high voltage. They can't always tell what's a real crisis and what's a sensitivity spike, because the volume is the same for both. What they need: a signal from you about the MAGNITUDE. "This is a big one" vs. "This is me being sensitive about something small."`,
      simple: `You feel everything at full volume. Not all of it needs a response at full volume. Learn to separate the signal from the noise.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Feeling vs. Story',
      modality: 'ACT defusion + mindfulness',
      instruction: `When a feeling arrives with a story: 'I'm feeling [emotion]. The story my mind is adding is [story]. I'll sit with the feeling and check the story later.' Practice the split.`,
      whyThisOne: `Your neuroticism amplifies the signal. Your anxiety writes the story. Separating them gives you choice.`,
      frequency: 'Three times this week',
    };

    return {
      title: 'The Amplified Alarm',
      subtitle: 'Your neuroticism × attachment anxiety',
      body: lenses.soulful,
      arc: {
        wound: `Emotional intensity was both signal and noise. Feelings were big and interpretation was unreliable.`,
        protection: `High sensitivity + threat bias = nothing gets missed. The cost: everything gets amplified.`,
        cost: `Your partner can't tell the big ones from the small ones. Everything arrives at the same volume.`,
        emergence: `Separate the feeling from the story. Hold the emotion. Check the interpretation.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Separate the signal from the noise.',
      depth: 'pairwise',
      domains: ['instrument', 'foundation'],
      confidence: 'high',
      patternId: 'neuroticism_x_anxiety',
      lenses,
      matchedPractice,
      invitation: 'Separate the signal from the noise.',
      evidenceLevel: 'moderate',
      keyCitations: ['Tseng et al., 2024', 'EFT intake predictors'],
    };
  }

  return null;
}

function combo10(s: IntegrationScores): IntegrationResult | null {
  const A = getA(s);
  const fusion = getFusion(s);

  // Branch A: High agreeableness (>70th) + High fusion (>65)
  if (A > 70 && fusion > 65) {
    const lenses: LensedNarrative = {
      therapeutic: `Warmth plus boundary-dissolution. Your agreeableness (${Math.round(A)}) orients you toward harmony, and your fusion (${Math.round(fusion)}) dissolves the boundary that would let harmony include disagreement. Research on behavioral correlates shows acceptance explains large variance in satisfaction — but your "acceptance" may be accommodation wearing acceptance's clothes. Real acceptance includes accepting DIFFERENCE. Your version may be eliminating difference to achieve surface peace.`,
      soulful: `Your warmth is genuine. People feel safe with you. Comfortable. Held. And underneath that warmth, a quieter truth: you have made yourself so agreeable that you have lost the texture of who you actually are. Warmth without edges is fog — pleasant but without shape. The people who love you love the warmth. But they can't find YOU inside it. The invitation: keep the warmth. Add edges. "I love you AND I see this differently." That sentence is the beginning of real intimacy — the kind that includes two distinct people, not one person and their reflection.`,
      practical: `THIS WEEK: disagree with your partner about something small. Not to create conflict — to practice the muscle of difference. "I actually prefer the other option." Watch how the relationship doesn't break. Watch how your partner actually LIKES that you have a preference.`,
      developmental: `High agreeableness + high fusion is the signature of Kegan's Order 3 in its most socially successful form. You are GOOD at relationships — at the Order 3 version of relationships, where harmony is the goal and the self is the material. The move toward Order 4 isn't becoming disagreeable. It's discovering that the relationship can hold difference without breaking.`,
      relational: `Your partner experiences your agreeableness as both comforting and slightly disorienting. They sense that you agree too easily. They might push back on something and watch you fold, and feel a flicker of disappointment — not because they wanted a fight, but because they wanted a PARTNER. Someone to push against. Someone who stays.`,
      simple: `You agree beautifully. You disappear in the agreement. This week: one opinion. Held. Out loud. Despite the discomfort.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'One Small Disagreement',
      modality: 'DSI differentiation + Gottman',
      instruction: `Disagree with your partner about something small this week. Not to fight — to practice difference. 'I actually prefer the other option.' Notice: the relationship survives. Your partner likes that you have a preference.`,
      whyThisOne: `Your warmth is genuine. The practice adds texture to it — so your partner gets a person, not just a pleasant surface.`,
      frequency: 'Once this week',
    };

    return {
      title: 'The Warm Fog',
      subtitle: 'Your agreeableness × fusion with others',
      body: lenses.soulful,
      arc: {
        protection: `Agreeableness + fusion = harmony through self-dissolution. Everyone is comfortable except you.`,
        cost: `Your partner can't find YOU inside the warmth. They get fog when they need texture.`,
        emergence: `Keep the warmth. Add edges. "I love you AND I see this differently."`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Keep the warmth. Add edges.',
      depth: 'pairwise',
      domains: ['instrument', 'stance'],
      confidence: 'high',
      patternId: 'agreeableness_x_fusion',
      lenses,
      matchedPractice,
      invitation: 'Keep the warmth. Add edges.',
      evidenceLevel: 'moderate',
      keyCitations: ['Conradi & Kamphuis, 2025'],
    };
  }

  return null;
}

function combo11(s: IntegrationScores): IntegrationResult | null {
  const managingOwn = getEQManagingSelf(s);
  const reactivity = getReactivity(s);

  // Branch A: Low managing own (<40) + High reactivity (>65)
  if (managingOwn < 40 && reactivity > 65) {
    const lenses: LensedNarrative = {
      therapeutic: `The regulation gap. Your emotional reactivity fires fast (${Math.round(reactivity)}), but your capacity to manage your own emotional states is low (${Math.round(managingOwn)}). EFT's transdiagnostic framework explicitly links this to interactional flooding — the state where heart rate exceeds 100 BPM and cognitive processing narrows. Gottman's research identifies this as Diffuse Physiological Arousal (DPA) — the physiological state that makes productive conversation impossible. The clinical recommendation: regulation FIRST, then engagement.`,
      soulful: `When the wave comes, there is nothing to hold onto. Your emotions arrive with the force of a flash flood, and the banks of your emotional river are too shallow to contain them. You don't choose to react — you ARE the reaction, for seconds or minutes that feel like hours. And in those moments, words come out that don't represent who you are. Promises get broken. Truths get distorted by the volume. Afterward, you barely recognize the person who said those things. The practice is not about feeling less. It is about building deeper banks — more internal ground to hold the water when it rises.`,
      practical: `THE GAP: You react fast (reactivity: ${Math.round(reactivity)}) and regulate slow (managing own: ${Math.round(managingOwn)}).\n\nTHIS WEEK: Build a personal 20-minute rule. When you notice flooding (chest tight, jaw clenched, tunnel vision), say: "I need 20 minutes." Leave the room. Breathe. Walk. Return. THEN continue the conversation. Gottman's research shows this break restores physiological baseline. Without it, nothing productive can happen.`,
      developmental: `The developmental work is building what Dan Siegel calls the "window of tolerance" — the range of emotional arousal within which you can still think, communicate, and choose your response. Your window is currently narrow. Every practice that builds regulation — breathwork, the 20-minute rule, naming emotions in the body — widens it incrementally.`,
      relational: `Your partner walks on eggshells. Not because you're abusive — because they can't predict when the flood will come. Their nervous system is in chronic low-level vigilance, scanning for the signs that you're about to tip over. What they need: the 20-minute rule. Not as a retreat — as a promise: "I'm not leaving. I'm regulating. I'll be back."`,
      simple: `The wave comes too fast. The banks are too shallow. Build deeper banks. Start with a 20-minute pause.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'The 20-Minute Rule',
      modality: 'Gottman + DBT',
      instruction: `When you notice flooding (chest tight, jaw clenched, tunnel vision), say: 'I need 20 minutes.' Leave the room. Breathe. Walk. Return. THEN continue. This break restores physiological baseline.`,
      whyThisOne: `When reactivity overwhelms regulation, nothing productive happens. The break IS the intervention.`,
      frequency: 'Every time you notice flooding',
    };

    return {
      title: 'The Regulation Gap',
      subtitle: 'Your emotional management × reactivity',
      body: lenses.soulful,
      arc: {
        wound: `Your emotional system fires fast — likely shaped by environments where rapid response was necessary for safety.`,
        protection: `Reactivity gets the emotion OUT immediately. No processing delay means no internal buildup.`,
        cost: `Words come out that don't represent who you are. Your partner walks on eggshells.`,
        emergence: `Build deeper banks. The 20-minute rule is the starting point for widening the window.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Build deeper banks. Start with a 20-minute pause.',
      depth: 'pairwise',
      domains: ['navigation', 'stance'],
      confidence: 'high',
      patternId: 'managing_own_x_reactivity',
      lenses,
      matchedPractice,
      invitation: 'Build deeper banks. Start with a 20-minute pause.',
      evidenceLevel: 'strong',
      keyCitations: ['Gottman DPA research', 'EFT transdiagnostic framework'],
    };
  }

  return null;
}

function combo12(s: IntegrationScores): IntegrationResult | null {
  const managingOwn = getEQManagingSelf(s);
  const reactivity = getReactivity(s);
  const perception = getEQPerception(s);

  // Branch A: Narrow window (managing_own < 40 AND reactivity > 60) + Low perception (<45)
  if (managingOwn < 40 && reactivity > 60 && perception < 45) {
    const lenses: LensedNarrative = {
      therapeutic: `Your window of tolerance is narrow — the range of emotional intensity you can hold before flooding or shutting down. And your perception is low — the quality of emotional sensing between you and your partner. These two are connected: a narrow window PREVENTS attunement because you can't stay present long enough to sense the field. Research on co-regulation and physiological synchrony shows that attunement requires both partners to be in their windows simultaneously. If yours is narrow, the window of SHARED regulation shrinks.`,
      soulful: `There is a space between you and your partner where attunement lives. But you can only access it when your nervous system is calm enough to sense it. Right now, your window is narrow — you shift from calm to flooded quickly, and in the flood, the field between you goes dark. Not gone — dark. Like trying to listen to music in a thunderstorm. The music is there. Your system just can't hear it through the noise. Every practice that widens your window — one breath, one pause, one moment of grounding before reacting — opens the channel to the field.`,
      practical: `YOUR BOTTLENECK: Attunement/perception. YOUR CONSTRAINT: Narrow window.\n\nThe window is the thing to widen. Everything else improves when it improves.\n\nTHIS WEEK: Three times a day, pause for 30 seconds and feel your feet on the floor. That's it. You're training the nervous system to drop into the body — which is where the window widens.`,
      developmental: `Window width is not fixed. It's a developmental capacity that grows through practice. Research on neuroplasticity in the therapy context confirms that regulation pathways strengthen with repeated use. Your current window is where you START, not where you stay.`,
      relational: `Your partner may feel like connection with you has a time limit. Things are good for a while, then something shifts and you're suddenly unreachable — either flooded or shut down. They've learned to keep things light because depth activates your system past its window. What they need: evidence that the window is widening. One conversation that goes 60 seconds deeper than usual without you leaving.`,
      simple: `Your window is narrow. Everything good happens inside the window. Widen it. One breath at a time.`,
    };

    const matchedPractice: MatchedPractice = {
      name: '30-Second Grounding',
      modality: 'Somatic + mindfulness',
      instruction: `Three times a day, pause for 30 seconds and feel your feet on the floor. That's it. You're training the nervous system to drop into the body — which is where the window widens and attunement becomes possible.`,
      whyThisOne: `Your narrow window prevents attunement. Widening the window is the single most impactful practice.`,
      frequency: 'Three times daily',
    };

    return {
      title: 'The Narrow Window',
      subtitle: 'Your window of tolerance × attunement bottleneck',
      body: lenses.soulful,
      arc: {
        wound: `Your nervous system learned to keep the window narrow — wide windows meant overwhelm in environments that were too much.`,
        protection: `A narrow window prevents overwhelm by limiting how much gets in. Effective but limiting.`,
        cost: `You can't stay present long enough to attune. Connection has a time limit your partner can feel.`,
        emergence: `The window widens through practice. Every grounding moment is neuroplasticity in action.`,
      },
      practice: matchedPractice.instruction,
      oneThing: 'Widen the window. One breath at a time.',
      depth: 'pairwise',
      domains: ['navigation', 'stance'],
      confidence: 'high',
      patternId: 'window_x_bottleneck',
      lenses,
      matchedPractice,
      invitation: 'Widen the window. One breath at a time.',
      evidenceLevel: 'moderate',
      keyCitations: ['Neuroplasticity research in therapy', "Siegel's window of tolerance model"],
    };
  }

  return null;
}

// ─── Main matcher ──────────────────────────────────────

/**
 * Check if two selected domains match any of the 12 priority pairwise combos.
 * Evaluates conditional branches based on score thresholds and returns
 * the matching result with all 6 lenses. Returns null if no combo matches.
 */
export function matchTier2Combo(
  domainA: string,
  domainB: string,
  scores: IntegrationScores,
): IntegrationResult | null {
  let result: IntegrationResult | null = null;

  // ─── foundation × navigation (Combo 1: Anxiety × Perception) ───
  if (pairMatches(domainA, domainB, 'foundation', 'navigation')) {
    result = combo1(scores);
    if (result) return result;
  }

  // ─── foundation × conflict (Combo 4 first: Avoidance × Avoiding, then Combo 2: Anxiety × Yielding/Forcing) ───
  if (pairMatches(domainA, domainB, 'foundation', 'conflict')) {
    // Check Combo 4 first — more specific (avoidance + avoiding)
    result = combo4(scores);
    if (result) return result;
    // Then Combo 2 — anxiety + yielding/forcing
    result = combo2(scores);
    if (result) return result;
  }

  // ─── navigation × stance (Combo 12 first: Window × Bottleneck, then Combo 11: Managing Own × Reactivity, then Combo 3: Perception × Fusion) ───
  if (pairMatches(domainA, domainB, 'navigation', 'stance')) {
    // Check Combo 12 first — most specific (composite proxy: narrow window + low perception)
    result = combo12(scores);
    if (result) return result;
    // Then Combo 11 — managing own × reactivity
    result = combo11(scores);
    if (result) return result;
    // Then Combo 3 — perception × fusion
    result = combo3(scores);
    if (result) return result;
  }

  // ─── conflict × compass (Combo 5: Forcing × Values Gap) ───
  if (pairMatches(domainA, domainB, 'conflict', 'compass')) {
    result = combo5(scores);
    if (result) return result;
  }

  // ─── stance × compass (Combo 6: I-position × Values) ───
  if (pairMatches(domainA, domainB, 'stance', 'compass')) {
    result = combo6(scores);
    if (result) return result;
  }

  // ─── foundation × stance (Combo 7: Anxiety × Fusion) ───
  if (pairMatches(domainA, domainB, 'foundation', 'stance')) {
    result = combo7(scores);
    if (result) return result;
  }

  // ─── navigation × conflict (Combo 8: Perception × Avoiding) ───
  if (pairMatches(domainA, domainB, 'navigation', 'conflict')) {
    result = combo8(scores);
    if (result) return result;
  }

  // ─── instrument × foundation (Combo 9: Neuroticism × Attachment) ───
  if (pairMatches(domainA, domainB, 'instrument', 'foundation')) {
    result = combo9(scores);
    if (result) return result;
  }

  // ─── instrument × stance (Combo 10: Agreeableness × Fusion) ───
  if (pairMatches(domainA, domainB, 'instrument', 'stance')) {
    result = combo10(scores);
    if (result) return result;
  }

  return null;
}
