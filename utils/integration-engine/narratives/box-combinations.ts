/**
 * Box-Level Combinations — Layer 1.5
 * ────────────────────────────────────────────
 * 25 subscale × subscale combinations with full 6-lens narratives.
 * These fire when individual cells are selected (not whole domains).
 *
 * Box key format: "domainId:CellLabel" → normalized to lowercase for matching.
 */

import type {
  IntegrationScores,
  IntegrationResult,
  LensedNarrative,
  DevelopmentalArc,
  MatchedPractice,
} from '../types';

import {
  getAnxiety, getAvoidance,
  getEQPerception, getEQManagingSelf,
  getReactivity, getIPosition, getFusion, getCutoff,
  getYielding, getAvoiding, getForcing, getProblemSolving,
  getN, getO, getA,
} from '../helpers';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Normalize "domainId:CellLabel" → lowercase key without domain prefix */
function normalizeBoxKeys(selectedBoxes: string[]): string[] {
  return selectedBoxes.map(b => {
    const parts = b.split(':');
    return (parts[1] || parts[0]).toLowerCase().replace(/[-\s]/g, '_');
  });
}

/** Check if normalized keys contain both a and b */
function hasPair(keys: string[], a: string, b: string): boolean {
  return keys.includes(a) && keys.includes(b);
}

function buildResult(opts: {
  title: string;
  subtitle: string;
  patternId: string;
  patternName: string;
  domains: string[];
  lenses: LensedNarrative;
  arc: DevelopmentalArc;
  practice: MatchedPractice;
  invitation: string;
  evidenceLevel: 'strong' | 'moderate' | 'theoretical';
  keyCitations: string[];
}): IntegrationResult {
  return {
    title: opts.title,
    subtitle: opts.subtitle,
    body: opts.lenses.soulful,
    arc: opts.arc,
    practice: opts.practice.instruction,
    oneThing: opts.invitation,
    depth: 'pairwise',
    domains: opts.domains as any[],
    confidence: 'high',
    patternId: opts.patternId,
    patternName: opts.patternName,
    lenses: opts.lenses,
    matchedPractice: opts.practice,
    invitation: opts.invitation,
    evidenceLevel: opts.evidenceLevel,
    keyCitations: opts.keyCitations,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 1: Anxiety × Perception
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchAnxietyPerception(s: IntegrationScores): IntegrationResult | null {
  const anxiety = getAnxiety(s);
  const perception = getEQPerception(s);

  if (anxiety > 4.0 && perception > 65) {
    // Branch A: High anxiety + High perception
    return buildResult({
      title: 'The Hyper-Aware Alarm',
      subtitle: 'When your radar meets your alarm system',
      patternId: 'anxiety_x_perception_high_high',
      patternName: 'Anxiety × Perception (High-High)',
      domains: ['foundation', 'navigation'],
      lenses: {
        therapeutic: `Your emotional radar is remarkably sensitive (perception: ${Math.round(perception)}). EFT research identifies this combination as clinically significant — you detect every shift in the attachment field, but your anxiety system hijacks the reading. The perception is accurate. The interpretation runs through a threat filter. What your perception detects as "something changed," your anxiety rewrites as "something is wrong, and it's about me." Clinical recommendation from the literature: use ACT defusion techniques to separate the sensing from the story.`,
        soulful: `You walk through the relational field awake. Painfully, beautifully awake. You feel the temperature drop between you and your partner before they've said a word. You notice the micro-shift in their posture, the half-second delay in their reply, the way their eyes move to the middle distance. Your radar is extraordinary. And it is wired to your alarm system. What you sense is almost always real. What your anxiety tells you it MEANS is almost always the old wound talking — not the current reality. The invitation: trust the perception. Question the interpretation. "I notice something shifted" is information. "They're pulling away because I'm too much" is a story written by a younger version of you who had very good reasons to believe it.`,
        practical: `You sense something shifted → your anxiety writes a story about what it means → you react to the story, not the shift.\n\nTHIS WEEK: When you sense something changed between you (and you will — your radar is strong), practice the TWO-SENTENCE method:\nSentence 1 (what you sensed): "I notice some tension right now."\nSentence 2 (checking the story): "The story I'm telling myself is that you're pulling away. Is that what's happening?"\n\nSeparate the perception from the interpretation. Out loud. Every time.`,
        developmental: `Your perception represents a genuinely advanced developmental capacity — Kegan's Order 4 ability to take the relational field as an object of observation. But your anxiety keeps pulling you back to Order 3 reactivity, where the observation immediately becomes fusion with the emotion. You SEE the pattern at a 4. You REACT to it at a 3. The developmental edge: building the half-second gap between sensing and reacting. That gap is where growth lives.`,
        relational: `Your partner probably finds your perception both a gift and a burden. A gift: you notice things about them that no one else does. You remember what they said three weeks ago. You catch the sadness behind the smile. A burden: you also notice things they weren't ready to discuss. You pick up on moods they hadn't processed yet. And when your anxiety colors the perception, they feel accused of things they haven't done — because you're responding to the story, not to them.`,
        simple: `You sense everything. Your anxiety rewrites everything. Learn to trust the radar and question the narrator.`,
      },
      arc: {
        wound: 'You learned to watch because watching kept you safe.',
        protection: 'Your perception became an early warning system — brilliant engineering.',
        cost: 'Every shift becomes a threat. Every silence becomes evidence.',
        emergence: 'Trust what you sense. Question what it means.',
      },
      practice: {
        name: 'The Two-Sentence Method',
        instruction: 'When you sense a shift, say two sentences: (1) what you sensed and (2) the story your anxiety is writing. Then ask if the story is accurate.',
        whyThisOne: 'Separates your accurate perception from your anxious interpretation.',
        frequency: 'Every time you sense a shift this week',
        modality: 'ACT + EFT',
      },
      invitation: 'Trust the radar. Question the narrator.',
      evidenceLevel: 'strong',
      keyCitations: ['Conradi & Kamphuis, 2025', 'Bazyari et al., 2024'],
    });
  }

  if (anxiety > 4.0 && perception < 40) {
    // Branch B: High anxiety + Low perception
    return buildResult({
      title: 'The Blurry Alarm',
      subtitle: 'When threat meets uncertainty',
      patternId: 'anxiety_x_perception_high_low',
      patternName: 'Anxiety × Perception (High-Low)',
      domains: ['foundation', 'navigation'],
      lenses: {
        therapeutic: `Your attachment anxiety (${anxiety.toFixed(1)}) creates constant threat-scanning, but your emotional perception (${Math.round(perception)}) isn't reliably picking up the actual signals. Your combination means you react to threats that aren't there and miss signals that are — your anxiety fills the perception gaps with worst-case narratives.`,
        soulful: `Your heart is on high alert, always scanning the horizon for signs of storm. But your radar is blurry. You can't quite read what your partner is feeling — is that sadness? Anger? Tiredness? Indifference? The uncertainty is unbearable for a system wired for threat, so your anxiety fills the blank with the worst possibility. You are not wrong to be watchful. You are reading with blurry vision. The invitation: before you react to what you THINK you're sensing, check. "I can't tell what you're feeling right now. Can you help me?"`,
        practical: `THE PATTERN: Anxiety scans → perception is unclear → anxiety fills the gap with worst-case stories → you react to the story.\n\nTHIS WEEK: Before reacting to what you THINK your partner is feeling, ask: "I'm sensing something but I'm not sure what. Am I reading you right?" Check the data before responding to the interpretation.`,
        developmental: `Low perception combined with high anxiety suggests the threat-detection system overdeveloped while the emotional-reading system underdeveloped — likely because in early environments, detecting DANGER was more survival-critical than accurately reading FEELINGS. The developmental move: building perception as a separate skill. Not to reduce anxiety — but to give it better data.`,
        relational: `Your partner may feel misread — accused of emotions they're not having, while the emotions they ARE having go unnoticed. They might say: "You always think I'm upset when I'm fine, but you never notice when I'm actually sad." That's the perception gap your anxiety fills with its own narrative.`,
        simple: `You feel the danger but can't read the signal. Stop guessing. Start asking.`,
      },
      arc: {
        protection: 'Your anxiety fills perception gaps with worst-case stories.',
        cost: 'You react to threats that aren\'t there and miss signals that are.',
        emergence: 'Ask before interpreting. Check before reacting.',
      },
      practice: {
        name: 'Check Before Reacting',
        instruction: 'Before reacting to what you think your partner is feeling, ask: "I\'m sensing something but I\'m not sure what. Am I reading you right?"',
        whyThisOne: 'Replaces anxious guessing with actual data.',
        frequency: 'Once this week',
        modality: 'EFT',
      },
      invitation: 'Stop guessing. Start asking.',
      evidenceLevel: 'strong',
      keyCitations: ['Conradi & Kamphuis, 2025'],
    });
  }

  if (anxiety < 3.0 && perception > 65) {
    // Branch C: Low anxiety + High perception
    return buildResult({
      title: 'The Clear Reader',
      subtitle: 'Perception without distortion',
      patternId: 'anxiety_x_perception_low_high',
      patternName: 'Anxiety × Perception (Low-High)',
      domains: ['foundation', 'navigation'],
      lenses: {
        therapeutic: `This is therapeutically rare and valuable — strong emotional perception without the anxiety distortion. Your reading of the relational field is both accurate and relatively undistorted by threat. Research shows acceptance and emotional accessibility as the strongest predictors of satisfaction — you have the perceptive foundation for both.`,
        soulful: `You have a quiet superpower. You sense the field between you and your partner with clarity — not the anxious, distorted clarity of someone scanning for threats, but the calm clarity of someone who simply notices. The rain without the panic. The temperature change without the alarm. This gives you something most people spend years in therapy trying to build: the ability to hold what you sense without being consumed by it.`,
        practical: `Your perception is an asset that isn't distorted by anxiety. Your edge: USE it. This week, share one observation about the space between you that you normally keep to yourself: "I notice we've been a little distant this week." Your partner will value the attunement.`,
        developmental: `You may already be at Kegan's Order 4 — able to observe the relational field without being fused with it. Your growth edge: can you use this capacity in service of your partner's development, not just your own awareness? Can you share what you see in a way that invites them into the observation?`,
        relational: `Your partner likely experiences you as deeply attentive without being overwhelming. They feel seen without feeling surveilled. This is a relational gift. The only risk: if you see patterns but don't share them, your partner misses the benefit of your clarity.`,
        simple: `You see clearly and you hold it calmly. That's rare. Share what you see.`,
      },
      arc: {
        protection: 'Your perception and calm work together naturally.',
        cost: 'If you see but don\'t share, clarity stays private.',
        emergence: 'Share what you sense. Let your partner benefit from your clarity.',
      },
      practice: {
        name: 'Share the Observation',
        instruction: 'Share one observation about the relational field this week that you normally keep to yourself.',
        whyThisOne: 'Your perception is accurate and undistorted — sharing it deepens connection.',
        frequency: 'Once this week',
        modality: 'EFT',
      },
      invitation: 'You see clearly. Share what you see.',
      evidenceLevel: 'strong',
      keyCitations: ['Conradi & Kamphuis, 2025'],
    });
  }

  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 2: Anxiety × Fusion
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchAnxietyFusion(s: IntegrationScores): IntegrationResult | null {
  const anxiety = getAnxiety(s);
  const fusion = getFusion(s);

  if (anxiety > 4.0 && fusion > 65) {
    return buildResult({
      title: 'The Dissolving Self',
      subtitle: 'When attachment hunger meets boundary loss',
      patternId: 'anxiety_x_fusion_high_high',
      patternName: 'Anxiety × Fusion (High-High)',
      domains: ['foundation', 'stance'],
      lenses: {
        therapeutic: `This is one of the most common and clinically significant combinations. EFT trials consistently find that attachment anxiety combined with low differentiation predicts the greatest relationship distress. Your anxiety pulls you toward closeness, and your fusion means closeness = dissolution. You don't just want connection — you merge with it. The relationship becomes your identity; any threat to it is a threat to your self.`,
        soulful: `Love, for you, is not something you experience. It is something you become. When you are close to someone, the boundary between your feelings and theirs dissolves like salt in water. You don't just love them — you become them. Their sadness is your sadness. Their approval is your survival. Their distance is your annihilation. This is not pathology. This is a heart so hungry for connection that it will sacrifice its own shape to maintain it. But love between two people requires two people. And right now there is one full person and one echo. The invitation is to rediscover your edges — not as walls, but as the place where you meet your partner instead of merging with them.`,
        practical: `THE PATTERN: You need closeness → you get close → you lose yourself in the closeness → your partner feels your weight → they create distance → you panic → you merge harder → repeat.\n\nTHIS WEEK: Do one thing that is entirely yours — that has nothing to do with your partner or the relationship. Notice how it feels to be a separate person who also happens to be in love. That distinction is the foundation of healthy intimacy.`,
        developmental: `Erikson's Intimacy vs. Isolation, complicated: you've achieved the FORM of intimacy (closeness, togetherness) without its SUBSTANCE (two whole selves meeting). In Kegan's terms: Order 3 in the relational domain — your self is constructed from the relationship rather than brought TO it. The developmental move: building an internal center that can tolerate closeness without being dissolved by it.`,
        relational: `Your partner may feel engulfed. Not by your love — by the WEIGHT of being your entire emotional world. They can't take space without it feeling like betrayal. They can't disagree without it feeling like abandonment. The pressure of being someone's everything is suffocating, even when the love is real. What they need: evidence that you can be okay on your own.`,
        simple: `You disappear into the people you love. The practice: find yourself first. Then bring that self to the relationship. Both. Not one or the other.`,
      },
      arc: {
        wound: 'You learned that love means losing yourself.',
        protection: 'Merging became the way to secure connection.',
        cost: 'Your partner is in a relationship with their echo, not with you.',
        emergence: 'Rediscover your edges. They\'re where real meeting happens.',
      },
      practice: {
        name: 'One Thing That\'s Yours',
        instruction: 'Do one activity this week that is entirely yours — unrelated to your partner or the relationship. Notice the feeling of being a separate person.',
        whyThisOne: 'Builds the internal center that healthy intimacy requires.',
        frequency: 'Once this week',
        modality: 'ACT + Differentiation',
      },
      invitation: 'Find yourself first. Then bring that self to love.',
      evidenceLevel: 'strong',
      keyCitations: ['Bazyari et al., 2024', 'Barraca Mairal et al., 2024'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 3: Anxiety × Yielding
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchAnxietyYielding(s: IntegrationScores): IntegrationResult | null {
  const anxiety = getAnxiety(s);
  const yielding = getYielding(s);

  if (anxiety > 4.0 && yielding > 3.5) {
    return buildResult({
      title: 'The Silent Surrender',
      subtitle: 'When fear drives accommodation',
      patternId: 'anxiety_x_yielding',
      patternName: 'Anxiety × Yielding',
      domains: ['foundation', 'conflict'],
      lenses: {
        therapeutic: `EFT and ACT research both address this combination directly. The mechanism: your yielding isn't a personality trait — it's your anxiety's conflict strategy. Your attachment system reads disagreement as potential abandonment, so it deploys accommodation to eliminate the threat. The research recommends combining EFT emotion access (surfacing the fear underneath) with ACT committed action (building assertion as a values-aligned behavior).`,
        soulful: `You yield not from generosity but from fear. Not the fear of your partner — the fear of the absence of your partner. Every accommodation is a small prayer: please don't leave. Your nervous system learned this prayer before you had words for it, and it runs now in the background of every disagreement. The yielding keeps the surface smooth. Underneath, a slowly building pressure of all the things you've swallowed. Start relieving the pressure now. One small truth at a time.`,
        practical: `THE PATTERN: Disagreement arises → anxiety says "they'll leave if you push back" → you yield → resentment builds silently → repeat.\n\nTHIS WEEK: In one small disagreement (not the big ones yet), state your actual preference BEFORE yielding: "I'd rather do X, but I'm willing to do Y." You don't have to fight for it. Just name it.`,
        developmental: `The anxious-yielding combination often traces to environments where expressing needs led to relational rupture. In Kegan's framework, you're operating from the Socialized Mind (Order 3) specifically in conflict — your sense of what's acceptable to want is defined by what you believe your partner can tolerate. The developmental move is authoring your own needs from the inside.`,
        relational: `Your partner thinks the relationship is smooth. They have no idea you're editing yourself in real time. And they're slowly losing access to who you actually are — because every yield removes another piece of your true self from the relationship.`,
        simple: `You yield not from agreement but from fear. Your partner can't love someone who's not fully there. Show up. One preference at a time.`,
      },
      arc: {
        wound: 'Expressing needs once led to loss.',
        protection: 'Yielding eliminates the threat of conflict.',
        cost: 'Your partner is in a relationship with your accommodation, not you.',
        emergence: 'Name one preference before yielding. Let them see you.',
      },
      practice: {
        name: 'Name Before Yielding',
        instruction: 'In one small disagreement, state your actual preference before accommodating: "I\'d rather do X, but I\'m willing to do Y."',
        whyThisOne: 'Reveals you have a position without requiring you to fight for it.',
        frequency: 'Once this week',
        modality: 'ACT + EFT',
      },
      invitation: 'One preference, named out loud, before the yielding.',
      evidenceLevel: 'strong',
      keyCitations: ['Barraca Mairal et al., 2024', 'Mirbagheri et al., 2025'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 4: Avoidance × Avoiding
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchAvoidanceAvoiding(s: IntegrationScores): IntegrationResult | null {
  const avoidance = getAvoidance(s);
  const avoiding = getAvoiding(s);

  if (avoidance > 4.0 && avoiding > 3.5) {
    return buildResult({
      title: 'The Double Withdrawal',
      subtitle: 'When distance meets silence',
      patternId: 'avoidance_x_avoiding',
      patternName: 'Avoidance × Avoiding',
      domains: ['foundation', 'conflict'],
      lenses: {
        therapeutic: `Double withdrawal across attachment AND conflict dimensions. Research on 539 couples found attachment explained the largest proportion of variance in relationship instability — and your combination represents both attachment and behavioral avoidance operating simultaneously. EFT's transdiagnostic framework identifies this as a system where defensive exclusion of vulnerability maintains emotional distance and prevents repair.`,
        soulful: `The surface between you and your partner is permanently calm. No storms. No raised voices. No tears. From the outside it looks like peace. From the inside you know: it is the absence of weather. Nothing gets in, nothing gets out, nothing gets resolved. Issues accumulate like sediment on a riverbed — invisible until the river changes course and everything dislodges at once. You are not keeping the peace. You are keeping the silence. And silence, in a relationship, is the slowest way to leave.`,
        practical: `THE PATTERN: Something needs discussing → your attachment system says "closeness is dangerous" → your conflict system says "tension is worse" → nothing gets said → distance grows imperceptibly → repeat for years.\n\nTHIS WEEK: Bring up ONE thing you've been sitting on. Start with: "There's something I've been avoiding saying." Then say it. Breaking the seal matters more than what comes through it.`,
        developmental: `This combination often represents an early environment where both emotional closeness AND conflict were unsafe. The nervous system found the only available solution: avoid both. In Kegan's terms, you may have achieved a version of the Self-Authoring Mind — but authored through exclusion rather than integration.`,
        relational: `Your partner lives in a relationship where nothing is ever wrong — and nothing is ever fully right. They may have stopped bringing things up because they learned you'll withdraw. Underneath their adaptation is a loneliness they can't name.`,
        simple: `Nothing gets discussed. Nothing gets resolved. Nothing gets better. One hard conversation this week. That's the beginning of everything.`,
      },
      arc: {
        wound: 'Both closeness and conflict were unsafe.',
        protection: 'You avoid both — elegant, airtight, lonely.',
        cost: 'Nothing gets resolved. Distance grows by millimeters.',
        emergence: 'Break the seal. One thing. This week.',
      },
      practice: {
        name: 'Break the Seal',
        instruction: 'Bring up ONE thing you\'ve been sitting on. Start with: "There\'s something I\'ve been avoiding saying." Then say it.',
        whyThisOne: 'Breaking the pattern of dual avoidance once changes the system permanently.',
        frequency: 'Once this week',
        modality: 'EFT',
      },
      invitation: 'One hard sentence. That\'s the beginning of everything.',
      evidenceLevel: 'strong',
      keyCitations: ['Conradi & Kamphuis, 2025', 'Tseng et al., 2024'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 5: Perception × Fusion
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchPerceptionFusion(s: IntegrationScores): IntegrationResult | null {
  const perception = getEQPerception(s);
  const fusion = getFusion(s);

  if (perception > 65 && fusion > 65) {
    return buildResult({
      title: 'The Boundary-Less Empath',
      subtitle: 'When sensing becomes absorbing',
      patternId: 'perception_x_fusion',
      patternName: 'Perception × Fusion',
      domains: ['navigation', 'stance'],
      lenses: {
        therapeutic: `Your strong emotional perception (${Math.round(perception)}) means you read the relational field accurately. Your high fusion (${Math.round(fusion)}) means you ABSORB what you read. Research on actor-partner interdependence confirms that both partners' emotional states are interlinked — but your combination means the interlinking overwhelms your ability to maintain a separate perspective.`,
        soulful: `You live inside a shared emotional body with no skin. Your partner's sadness becomes your sadness. Their anxiety becomes your anxiety. You don't just empathize — you BECOME the other's emotional state. This is not a flaw. It is a gift turned inward on itself — like a radio receiver so powerful it picks up every station simultaneously. The invitation is not less perception. It is a boundary that the perception can flow AROUND instead of THROUGH. Not a wall. A riverbank — shaping the flow without stopping it.`,
        practical: `Three times this week, pause and ask: "Is this feeling MINE, or am I picking it up from the field?" You don't need to answer correctly. Just asking creates a boundary your nervous system can start to recognize.`,
        developmental: `In Kegan's framework, this is the core Order 3→4 transition: you can PERCEIVE the relational field (that's an Order 4 capacity) but you can't yet HOLD yourself separate from it (that's still Order 3 fusion). The developmental edge is becoming the observer who stays grounded while sensing the field.`,
        relational: `Your partner may feel deeply understood by you — and slightly suffocated. Your attunement is extraordinary. But because you absorb their state rather than observing it, they never get the experience of being WITNESSED — seen from a slight distance by someone who holds their own center.`,
        simple: `You sense everything and absorb everything. The practice: sense without merging. Observe without becoming. That's the skill.`,
      },
      arc: {
        protection: 'You sense the field so well that you became it.',
        cost: 'You lose yourself inside what you sense.',
        emergence: 'Build a riverbank. Sense the flow without becoming it.',
      },
      practice: {
        name: 'Mine or Theirs?',
        instruction: 'Three times this week, pause and ask: "Is this feeling MINE, or am I picking it up from the field?"',
        whyThisOne: 'Builds the boundary between perception and absorption.',
        frequency: 'Three times this week',
        modality: 'Differentiation + ACT',
      },
      invitation: 'Sense without merging. Observe without becoming.',
      evidenceLevel: 'moderate',
      keyCitations: ['Başer et al., 2025'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 6: Reactivity × Self-Regulation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchReactivityRegulation(s: IntegrationScores): IntegrationResult | null {
  const reactivity = getReactivity(s);
  const managingSelf = getEQManagingSelf(s);

  if (reactivity > 65 && managingSelf < 40) {
    return buildResult({
      title: 'The Regulation Gap',
      subtitle: 'When intensity outpaces containment',
      patternId: 'reactivity_x_self_regulation',
      patternName: 'Reactivity × Self-Regulation',
      domains: ['stance', 'navigation'],
      lenses: {
        therapeutic: `Your emotional reactivity fires fast (${Math.round(reactivity)}), but your capacity to manage your own emotional states is low (${Math.round(managingSelf)}). Gottman's research identifies this as Diffuse Physiological Arousal (DPA) — the state where heart rate exceeds 100 BPM and productive conversation becomes neurologically impossible. Clinical recommendation: regulation FIRST, then engagement.`,
        soulful: `When the wave comes, there is nothing to hold onto. Your emotions arrive with the force of a flash flood, and the banks of your emotional river are too shallow to contain them. You don't choose to react — you ARE the reaction. And in those moments, words come out that don't represent who you are. The practice is not about feeling less. It is about building deeper banks — more internal ground to hold the water when it rises.`,
        practical: `THE GAP: You react fast (reactivity: ${Math.round(reactivity)}) and regulate slow (managing own: ${Math.round(managingSelf)}).\n\nTHIS WEEK: Build a personal 20-minute rule. When you notice flooding (chest tight, jaw clenched, tunnel vision), say: "I need 20 minutes." Leave the room. Breathe. Walk. Return. THEN continue the conversation.`,
        developmental: `The developmental work is building what Dan Siegel calls the "window of tolerance" — the range of emotional arousal within which you can still think, communicate, and choose your response. Your window is currently narrow. Every practice that builds regulation — breathwork, the 20-minute rule, naming emotions in the body — widens it incrementally.`,
        relational: `Your partner walks on eggshells. Not because you're abusive — because they can't predict when the flood will come. What they need: the 20-minute rule. Not as a retreat — as a promise: "I'm not leaving. I'm regulating. I'll be back."`,
        simple: `The wave comes too fast. The banks are too shallow. Build deeper banks. Start with a 20-minute pause.`,
      },
      arc: {
        protection: 'Your reactivity was once the only way to be heard.',
        cost: 'The flood damages everything in its path — including the love.',
        emergence: 'Build the container. The fire doesn\'t need to go out — it needs a hearth.',
      },
      practice: {
        name: 'The 20-Minute Rule',
        instruction: 'When you notice flooding (chest tight, jaw clenched), say: "I need 20 minutes." Leave. Breathe. Return. Then continue.',
        whyThisOne: 'Gottman\'s research shows this break restores physiological baseline.',
        frequency: 'Every time flooding occurs',
        modality: 'Gottman + Polyvagal',
      },
      invitation: 'Same fire. Deeper banks. That\'s the practice.',
      evidenceLevel: 'strong',
      keyCitations: ['Bazyari et al., 2024'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 7: Avoidance × Cutoff
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchAvoidanceCutoff(s: IntegrationScores): IntegrationResult | null {
  const avoidance = getAvoidance(s);
  const cutoff = getCutoff(s);

  if (avoidance > 4.0 && cutoff > 65) {
    return buildResult({
      title: 'The Sealed System',
      subtitle: 'When distance reinforces disconnection',
      patternId: 'avoidance_x_cutoff',
      patternName: 'Avoidance × Cutoff',
      domains: ['foundation', 'stance'],
      lenses: {
        therapeutic: `Attachment avoidance (${avoidance.toFixed(1)}) creates emotional distance while emotional cutoff (${Math.round(cutoff)}) severs the signal when feelings get too intense. Together they form a comprehensive distance system — not just behavioral withdrawal but emotional deadening. Research shows attachment avoidance at intake predicts change trajectories in therapy, meaning this pattern IS modifiable even though it feels fixed.`,
        soulful: `There is a quiet inside you that you have mistaken for peace. It is not peace. It is the absence of signal — the emotional field turned down so low that neither pain nor joy can reach you. You did not build these walls from cruelty. You built them from wisdom — the wisdom of a nervous system that learned: the only safe feeling is no feeling. The field between you and your partner cannot breathe behind glass. It needs air. Not a hurricane. A breeze.`,
        practical: `THE PATTERN: Something emotional happens → cutoff severs the signal → avoidance pulls you away → nothing gets felt → nothing gets discussed → distance normalizes.\n\nTHIS WEEK: Share one feeling that you would normally process alone: "I had a hard day." "That movie made me sad." Let your partner respond. Don't manage their reaction.`,
        developmental: `You may have achieved Self-Authoring (Kegan Order 4) through EXCLUSION rather than INTEGRATION. You authored yourself by cutting off the relational channels. The developmental invitation is Order 5 — where independence and interdependence coexist.`,
        relational: `Your partner experiences stability, calm, reliability — and a wall. They reach for you and find composure. They might say: "I know they love me, but I can't FEEL it." What they need isn't emotion dumped at their feet. It's one crack. One small human moment.`,
        simple: `You built a beautiful wall. It keeps everything out. Including the love. Install a door. A small one.`,
      },
      arc: {
        wound: 'The only safe feeling was no feeling.',
        protection: 'Distance + disconnection = control.',
        cost: 'Your partner is in the room but alone.',
        emergence: 'One feeling, named out loud. That is the door.',
      },
      practice: {
        name: 'One Feeling, Out Loud',
        instruction: 'Share one feeling with your partner that you would normally process alone. Not a crisis. Something small. Let them respond.',
        whyThisOne: 'One crack in the sealed system changes the whole dynamic.',
        frequency: 'Once this week',
        modality: 'EFT',
      },
      invitation: 'Install a door. A small one. Open it once.',
      evidenceLevel: 'strong',
      keyCitations: ['Tseng et al., 2024', 'Conradi & Kamphuis, 2025'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 8: I-Position × Forcing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchIPositionForcing(s: IntegrationScores): IntegrationResult | null {
  const iPos = getIPosition(s);
  const forcing = getForcing(s);

  if (iPos > 65 && forcing > 3.5) {
    return buildResult({
      title: 'The Bulldozer',
      subtitle: 'When clarity becomes force',
      patternId: 'iposition_x_forcing',
      patternName: 'I-Position × Forcing',
      domains: ['stance', 'conflict'],
      lenses: {
        therapeutic: `High I-position (${Math.round(iPos)}) combined with high forcing (${forcing.toFixed(1)}) creates a specific pattern: you know what you want AND you push hard for it. Research on differentiation shows that I-position is a strength — but when paired with forcing as the primary conflict strategy, clarity becomes coercion. The developmental move: maintaining your position while making room for your partner's.`,
        soulful: `You know who you are. You know what you want. And you know how to get it. This clarity is rare and valuable. But somewhere along the way, "I know my truth" became "my truth is THE truth." Your I-position is a compass. Your forcing turns it into a battering ram. The invitation: hold your ground AND make room. Two truths can coexist in the same room if neither one is trying to conquer the other.`,
        practical: `THIS WEEK: In your next disagreement, state your position clearly — then ask: "What's your perspective?" And listen. Actually listen. Not to formulate a rebuttal. To understand. Your I-position stays strong. Your forcing gets replaced with curiosity.`,
        developmental: `You may be at a strong Order 4 — self-authored, internally clear. The transition to Order 5 requires letting your partner's perspective genuinely change yours. Not compromise — transformation. "Your way of seeing this is making me reconsider mine."`,
        relational: `Your partner may feel steamrolled. Not silenced — just... overrun. They know your position before you finish the sentence. What they don't know is whether their position matters to you. It might. But your forcing makes it invisible.`,
        simple: `You hold your ground beautifully. Now make room for someone else's. Same strength. Less force.`,
      },
      arc: {
        protection: 'Clarity kept you safe. Forcing kept you in control.',
        cost: 'Your partner\'s truth goes underground.',
        emergence: 'Hold your ground AND make room. Both at once.',
      },
      practice: {
        name: 'State Then Ask',
        instruction: 'State your position clearly. Then ask "What\'s your perspective?" and listen — not to rebut, but to understand.',
        whyThisOne: 'Preserves your clarity while creating space for your partner\'s.',
        frequency: 'Once this week in a disagreement',
        modality: 'Gottman + Differentiation',
      },
      invitation: 'Hold your ground and make room. Both at once.',
      evidenceLevel: 'moderate',
      keyCitations: ['Conradi & Kamphuis, 2025'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 9: Warmth × Fusion
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchWarmthFusion(s: IntegrationScores): IntegrationResult | null {
  const A = getA(s);
  const fusion = getFusion(s);

  if (A > 70 && fusion > 65) {
    return buildResult({
      title: 'The Agreeable Fog',
      subtitle: 'When warmth dissolves edges',
      patternId: 'warmth_x_fusion',
      patternName: 'Warmth × Fusion',
      domains: ['instrument', 'stance'],
      lenses: {
        therapeutic: `Your agreeableness (${Math.round(A)}th percentile) orients you toward harmony, and your fusion (${Math.round(fusion)}) dissolves the boundary that would let harmony include disagreement. Your "acceptance" may be accommodation wearing acceptance's clothes. Real acceptance includes accepting DIFFERENCE.`,
        soulful: `Your warmth is genuine. People feel safe with you. And underneath that warmth, a quieter truth: you have made yourself so agreeable that you have lost the texture of who you actually are. Warmth without edges is fog — pleasant but without shape. The invitation: keep the warmth. Add edges. "I love you AND I see this differently."`,
        practical: `THIS WEEK: Disagree with your partner about something small. Not to create conflict — to practice the muscle of difference. "I actually prefer the other option." Watch how the relationship doesn't break.`,
        developmental: `High agreeableness + high fusion is the signature of Kegan's Order 3 in its most socially successful form. You are GOOD at relationships — at the Order 3 version. The move toward Order 4 isn't becoming disagreeable. It's discovering that the relationship can hold difference without breaking.`,
        relational: `Your partner senses that you agree too easily. They might push back and watch you fold, feeling a flicker of disappointment — not because they wanted a fight, but because they wanted a PARTNER. Someone whose "yes" means something because they also have access to "no."`,
        simple: `You agree beautifully. You disappear in the agreement. This week: one opinion. Held. Out loud. Despite the discomfort.`,
      },
      arc: {
        protection: 'Agreeableness eliminated conflict. Fusion made it effortless.',
        cost: 'You\'ve become fog — warm but shapeless.',
        emergence: 'Keep the warmth. Add edges.',
      },
      practice: {
        name: 'One Disagreement',
        instruction: 'Disagree with your partner about something small. "I actually prefer the other option." Notice the relationship doesn\'t break.',
        whyThisOne: 'Builds the muscle of difference inside the safety of warmth.',
        frequency: 'Once this week',
        modality: 'Differentiation',
      },
      invitation: 'Keep the warmth. Add the edges.',
      evidenceLevel: 'moderate',
      keyCitations: ['Conradi & Kamphuis, 2025'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 10: Perception × Avoiding
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchPerceptionAvoiding(s: IntegrationScores): IntegrationResult | null {
  const perception = getEQPerception(s);
  const avoiding = getAvoiding(s);

  if (perception > 65 && avoiding > 3.5) {
    return buildResult({
      title: 'The Silent Witness',
      subtitle: 'When seeing meets silence',
      patternId: 'perception_x_avoiding',
      patternName: 'Perception × Avoiding',
      domains: ['navigation', 'conflict'],
      lenses: {
        therapeutic: `You read the room and then leave the room. Your perception picks up the tension, but your conflict style pulls you away from it. This combination can be particularly corrosive because you're AWARE of what needs addressing and you choose not to address it. Your awareness isn't shut out — it's just disconnected from action.`,
        soulful: `You see everything. And you carry what you see alone. The tension between you and your partner — you feel it before they do. The unresolved conversation from last week — you sense it hanging in the room. The thing that needs to be said — you know exactly what it is. And you step around it. That is a particular kind of loneliness: the loneliness of the person who sees the problem clearly and can't bring themselves to name it.`,
        practical: `You see it. You avoid it. This week: take ONE thing you've been sensing and bring it into the open: "I've been noticing [thing] between us. Can we talk about it?" Your perception did the hard work. Let your voice do the rest.`,
        developmental: `You have Order 4 perception — you can observe the relational field. But your conflict avoidance is operating from Order 3 — driven by the relational system's rules about what's safe to name. The developmental move: letting your perception LEAD instead of your avoidance.`,
        relational: `Your partner may have NO IDEA how much you see. They think the relationship is "fine" because you never raise issues. But you're carrying an entire catalogue of unsaid observations. Each one, left unspoken, creates a tiny distance they can't account for.`,
        simple: `You see the problem. You walk around it. The problem doesn't move. This week: walk toward it instead.`,
      },
      arc: {
        protection: 'Seeing without saying keeps the peace.',
        cost: 'You carry the weight of everything unsaid.',
        emergence: 'Your perception did the work. Now let your voice finish it.',
      },
      practice: {
        name: 'Name What You See',
        instruction: 'Take ONE thing you\'ve been sensing and bring it into the open: "I\'ve been noticing [thing] between us. Can we talk about it?"',
        whyThisOne: 'Connects your powerful perception to the action it\'s pointing toward.',
        frequency: 'Once this week',
        modality: 'EFT + ACT',
      },
      invitation: 'You see clearly. Now speak clearly.',
      evidenceLevel: 'moderate',
      keyCitations: ['Başer et al., 2025'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 11: Openness × Avoidance
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchOpennessAvoidance(s: IntegrationScores): IntegrationResult | null {
  const O = getO(s);
  const avoidance = getAvoidance(s);

  if (O > 65 && avoidance > 4.0) {
    return buildResult({
      title: 'The Open Mind, Closed Heart',
      subtitle: 'When intellectual curiosity meets emotional distance',
      patternId: 'openness_x_avoidance',
      patternName: 'Openness × Avoidance',
      domains: ['instrument', 'foundation'],
      lenses: {
        therapeutic: `High openness (${Math.round(O)}th percentile) combined with high avoidance (${avoidance.toFixed(1)}) creates a specific paradox: you are intellectually and experientially open but emotionally closed. You welcome new ideas, perspectives, and experiences — but not new levels of emotional intimacy. Your openness may even serve your avoidance, creating the appearance of depth through intellectual engagement while keeping emotional vulnerability at arm's length.`,
        soulful: `You are a deep thinker, an explorer of ideas, a lover of nuance. You can talk for hours about the meaning of life, art, philosophy, the human condition. But when your partner asks "how are you really doing?" — something shifts. The openness contracts. The explorer retreats. You are open to everything except the one thing that scares you: being truly known by someone who could leave.`,
        practical: `THIS WEEK: When your partner asks how you are, go one layer deeper than your default. If you'd normally say "fine," say what's actually there: "I'm feeling a little distant today." Bring your openness to the emotional domain, not just the intellectual one.`,
        developmental: `Your openness gives you Order 4 capacity — you see complexity, hold paradox, appreciate nuance. But your avoidance keeps the relational domain at Order 2 — need-based, self-protective. The integration: bringing your intellectual courage to emotional territory.`,
        relational: `Your partner experiences a fascinating conversationalist who becomes unreachable at the emotional level. They may feel like they know your mind but not your heart. The gap between how open you are about ideas and how closed you are about feelings is confusing and sometimes lonely for them.`,
        simple: `Open mind. Closed heart. Bring your curiosity to the emotional domain. That's the unexplored territory.`,
      },
      arc: {
        protection: 'Intellectual openness created the appearance of depth without the risk.',
        cost: 'Your partner knows your mind but not your heart.',
        emergence: 'Apply your curiosity to your own emotional landscape.',
      },
      practice: {
        name: 'One Layer Deeper',
        instruction: 'When asked how you are, go one layer deeper than your default. Bring your openness to the emotional domain.',
        whyThisOne: 'Bridges the gap between intellectual and emotional openness.',
        frequency: 'Once this week',
        modality: 'EFT',
      },
      invitation: 'Bring your curiosity to your own heart. That\'s the unexplored territory.',
      evidenceLevel: 'moderate',
      keyCitations: ['Tseng et al., 2024'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMBINATION 12: Anxiety × Forcing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchAnxietyForcing(s: IntegrationScores): IntegrationResult | null {
  const anxiety = getAnxiety(s);
  const forcing = getForcing(s);

  if (anxiety > 4.0 && forcing > 3.5) {
    return buildResult({
      title: 'The Urgent Pursuer',
      subtitle: 'When fear drives force',
      patternId: 'anxiety_x_forcing',
      patternName: 'Anxiety × Forcing',
      domains: ['foundation', 'conflict'],
      lenses: {
        therapeutic: `When anxiety drives conflict through forcing, the mechanism is: your attachment system reads distance as danger and responds with escalation. Gottman's research identifies this as the criticism pathway — not cruelty, but desperate urgency: "If I can make them understand how badly this hurts, they'll change." The literature recommends regulation before enactment.`,
        soulful: `Your love is loud. When the distance between you and your partner grows, something ancient rises — not anger exactly, more like urgency. A desperate need to close the gap RIGHT NOW. The intensity comes out as force. Your partner backs away from the heat. You pursue harder. The same message, at half the volume, would reach them. Your heart doesn't need to be quieter. Your delivery does.`,
        practical: `THE PATTERN: Anxiety detects distance → forcing escalates the approach → partner retreats from intensity → distance grows → anxiety spikes → repeat.\n\nTHIS WEEK: When you feel the urge to press your point, replace the statement with a question: "I'm scared we're disconnecting. Can we slow down?" Same need, no force.`,
        developmental: `Forcing under anxiety represents a strategy from environments where the loudest need got met. The developmental move: discovering that your adult partner responds to vulnerability, not volume.`,
        relational: `Your partner experiences your anxiety-driven forcing as attack. They can't hear the love underneath the volume. They hear: criticism. Pressure. What they need: "I'm scared right now" instead of "You always do this."`,
        simple: `The intensity is love. But love at that volume deafens. Same heart, half the volume. That's the practice.`,
      },
      arc: {
        protection: 'Loudness once got you heard.',
        cost: 'Your partner can\'t hear love through the volume.',
        emergence: 'Same heart. Half the volume.',
      },
      practice: {
        name: 'Replace Statement with Question',
        instruction: 'When you feel the urge to press, say: "I\'m scared we\'re disconnecting. Can we slow down?" Same need, no force.',
        whyThisOne: 'Converts anxious forcing into vulnerable connection.',
        frequency: 'Once this week',
        modality: 'EFT + Gottman',
      },
      invitation: 'Same love. Half the volume. That changes everything.',
      evidenceLevel: 'strong',
      keyCitations: ['Bazyari et al., 2024'],
    });
  }
  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN ROUTER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Map cell labels to normalized keys for matching */
const LABEL_TO_KEY: Record<string, string> = {
  'anxiety': 'anxiety',
  'avoidance': 'avoidance',
  'window': 'window',
  'attachment': 'attachment',
  'sensitivity': 'sensitivity',
  'social_energy': 'social_energy',
  'openness': 'openness',
  'warmth': 'warmth',
  'perception': 'perception',
  'self_regulation': 'self_regulation',
  'other_support': 'other_support',
  'emotional_use': 'emotional_use',
  'differentiation': 'differentiation',
  'reactivity': 'reactivity',
  'i_position': 'i_position',
  'fusion': 'fusion',
  'primary_style': 'primary_style',
  'secondary': 'secondary',
  'yielding': 'yielding',
  'avoiding': 'avoiding',
  'top_value': 'top_value',
  'biggest_gap': 'biggest_gap',
  'alignment': 'alignment',
  'action_score': 'action_score',
  'field_awareness': 'field_awareness',
  'recognition': 'recognition',
  'presence': 'presence',
  'emergence': 'emergence',
  // Also handle alternate casing
  'i-position': 'i_position',
  'self-regulation': 'self_regulation',
  'other-support': 'other_support',
  'social energy': 'social_energy',
  'emotional use': 'emotional_use',
  'primary style': 'primary_style',
  'top value': 'top_value',
  'biggest gap': 'biggest_gap',
  'action score': 'action_score',
  'field awareness': 'field_awareness',
};

/**
 * Match selected boxes to a specific subscale×subscale combination.
 *
 * @param selectedBoxes - Array of "domainId:CellLabel" strings
 * @param scores - All available assessment scores
 * @returns IntegrationResult or null
 */
export function matchBoxCombination(
  selectedBoxes: string[],
  scores: IntegrationScores,
): IntegrationResult | null {
  // Normalize to lowercase keys
  const keys = normalizeBoxKeys(selectedBoxes);

  // Try each combination in priority order
  if (hasPair(keys, 'anxiety', 'perception'))      return matchAnxietyPerception(scores);
  if (hasPair(keys, 'anxiety', 'fusion'))           return matchAnxietyFusion(scores);
  if (hasPair(keys, 'anxiety', 'yielding'))         return matchAnxietyYielding(scores);
  if (hasPair(keys, 'anxiety', 'forcing'))          return matchAnxietyForcing(scores);
  if (hasPair(keys, 'avoidance', 'avoiding'))       return matchAvoidanceAvoiding(scores);
  if (hasPair(keys, 'avoidance', 'cutoff'))         return matchAvoidanceCutoff(scores);
  if (hasPair(keys, 'perception', 'fusion'))        return matchPerceptionFusion(scores);
  if (hasPair(keys, 'reactivity', 'self_regulation')) return matchReactivityRegulation(scores);
  if (hasPair(keys, 'warmth', 'fusion'))            return matchWarmthFusion(scores);
  if (hasPair(keys, 'perception', 'avoiding'))      return matchPerceptionAvoiding(scores);
  if (hasPair(keys, 'openness', 'avoidance'))       return matchOpennessAvoidance(scores);
  if (hasPair(keys, 'i_position', 'forcing'))       return matchIPositionForcing(scores);

  return null;
}
