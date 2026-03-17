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
        therapeutic: `Your emotional radar is remarkably sensitive (perception: ${Math.round(perception)}). EFT research (Sue Johnson) identifies this combination as clinically significant — you detect every shift in the attachment field, but your anxiety system hijacks the reading. In Polyvagal terms (Stephen Porges), your neuroception is highly active: the autonomic nervous system scans for threat signals in facial micro-expressions, vocal prosody, and postural shifts, then triggers a sympathetic fight-or-flight cascade before your cortex can evaluate whether the danger is real. The perception is accurate. The interpretation runs through a threat filter rooted in early relational schemas (Jeffrey Young's Schema Therapy model — likely an Abandonment or Defectiveness schema). What your perception detects as "something changed," your anxiety rewrites as "something is wrong, and it's about me." In IFS terms (Richard Schwartz), a vigilant Protector part has fused with a highly capable Perceiver — the Protector intercepts every reading and adds a threat narrative. ACT (Steven Hayes) offers defusion: the skill of observing your thoughts as mental events rather than truths. DBT's "Wise Mind" (Marsha Linehan) provides the integration point — the place where your accurate emotional sensing meets your rational capacity to evaluate context. Clinical path forward: use ACT defusion to separate the sensing from the story, EFT to access the vulnerable attachment need underneath, and Polyvagal co-regulation exercises with your partner to teach the nervous system that connection is safe.`,
        soulful: `You walk through the relational field like a creature of the deep forest — every sense alive, every nerve tuned to the subtlest shift in weather. Jung would recognize in you the archetype of the Wounded Healer: your sensitivity was forged in early pain, and it has become both your greatest wound and your most extraordinary gift. Your Shadow carries the exile of the one who watched too carefully because watching was survival, and now cannot stop watching even in safety. As Rilke wrote: "Perhaps all the dragons in our lives are princesses who are only waiting to see us act, just once, with beauty and courage."

Your perception is the mycelium of the relational forest — an underground network sensing every tremor, every shift in nutrient and moisture, every distant footfall. But your anxiety is the alarm that interprets every tremor as earthquake. The Anima/Animus — that inner figure of relatedness — is hyperactivated, reading love-signals and danger-signals as the same frequency. You are like Psyche holding the lamp over Eros in the dark: you MUST see, you MUST know, even when the seeing threatens to destroy what you hold most dear.

David Whyte wrote: "The only life you can save is your own." Your radar is saving no one when it is wired to the alarm. The tides of your attention flow in and out relentlessly, scanning the shoreline of your partner's face for signs of storm. But the sea is not always the storm. Sometimes the sea is just the sea. Pema Chodron teaches: "You are the sky. Everything else — it's just weather." The invitation is not to dull the perception. It is to trust it without the alarm. To become the forest that senses the tremor and stays rooted, rather than the animal that senses the tremor and bolts.

John O'Donohue reminds us: "Your soul knows the geography of your destiny." Your perception is part of that geography — sacred, hard-won, irreplaceable. The work is to separate the perception from the panic, to let the lamp illuminate without burning.`,
        practical: `You sense something shifted → your anxiety writes a story about what it means → you react to the story, not the shift. This is the habit loop (James Clear's cue-routine-reward): cue = subtle emotional shift detected, routine = anxious interpretation + reactive behavior, reward = temporary certainty (even if negative).

THIS WEEK: Practice the TWO-SENTENCE method (your atomic habit — James Clear):
Sentence 1 (what you sensed): "I notice some tension right now."
Sentence 2 (checking the story): "The story I'm telling myself is that you're pulling away. Is that what's happening?"

HABIT STACK (BJ Fogg's Tiny Habits): After I notice my chest tighten in response to my partner's mood shift, I will take one breath and say: "I'm sensing something. Can I check my story with you?"

THE BOLD ASK: Tell your partner about this pattern. Say: "My radar is strong but my interpreter is unreliable. I'm going to start checking my stories with you. Will you help me reality-test?"

Stages of change (Prochaska): If you're reading this and recognizing yourself, you're in Contemplation. The Two-Sentence method moves you to Action. Do it three times this week and you've entered Maintenance.`,
        developmental: `Your perception represents a genuinely advanced developmental capacity — Kegan's Order 4 ability to take the relational field as an object of observation. But your anxiety keeps pulling you back to Order 3 reactivity, where the observation immediately becomes fusion with the emotion. You SEE the pattern at a 4. You REACT to it at a 3. In Spiral Dynamics, your cognitive center of gravity may be Green (sensitive, relational, pluralistic) while your threat response drops to Red (impulsive, self-protective, reactive). Ken Wilber's Integral model maps this as a "state-stage" gap: your typical state of consciousness (anxious scanning) lags behind your structural capacity (perceptive observation). Carol Gilligan's ethic of care is relevant here: your perception IS care — but anxiety turns care into control. Erikson's stage of Intimacy vs. Isolation is live: your perception is the bridge to intimacy, your anxiety is the troll under the bridge demanding a toll. The developmental edge: building the half-second gap between sensing and reacting. That gap is where growth lives — where the Order 3 self learns to hand the reading to the Order 4 observer instead of the alarm.`,
        relational: `Your partner inhabits a strange relational space with you: they feel profoundly seen and perpetually accused, sometimes in the same conversation. In Martin Buber's terms, your perception offers them the I-Thou — the deep recognition of their full subjectivity. But your anxiety converts I-Thou to I-It — reducing their complex inner life to evidence for or against your safety. Harville Hendrix's Imago theory would identify your partner as carrying the composite image of your early caretakers — and your perception is ceaselessly scanning them for confirmation that the old wound is about to reopen. Stan Tatkin (PACT model) calls this "being a wave in a relationship that needs an anchor." Your partner's nervous system is constantly co-regulating with yours, and when your alarm fires, their system fires too — even when there's no actual threat. They may feel: "I can't just have a quiet mood without it becoming an event." Gottman's Sound Relationship House needs a strong foundation of trust, and your anxiety-driven interpretation erodes that trust — not because you're dishonest, but because your partner learns that being read accurately doesn't protect them from being misread dramatically. What they long for: to be seen without being surveilled. To have you notice the sadness behind their smile and simply say, "I see you're carrying something" — without the follow-up question of "Is it about us?"`,
        simple: `You sense everything. Your anxiety rewrites everything. Learn to trust the radar and question the narrator. That's the whole game.`,
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
        therapeutic: `Your attachment anxiety (${anxiety.toFixed(1)}) creates constant threat-scanning, but your emotional perception (${Math.round(perception)}) isn't reliably picking up the actual signals. In Polyvagal terms (Porges), your neuroception fires frequently but inaccurately — the autonomic nervous system is biased toward detecting danger in ambiguous social cues, while the ventral vagal "social engagement system" that reads nuanced emotional signals is underdeveloped. Schema Therapy (Jeffrey Young) would identify this as an Abandonment schema running on impoverished data — the schema activates in response to emotional ambiguity, filling perception gaps with worst-case content. In IFS (Schwartz), an anxious Firefighter part leaps to action before the Perceiver part can do its slower, more accurate work. From a CBT lens (Aaron Beck), this is classic emotional reasoning combined with a confirmation bias: "I feel threatened, therefore I am threatened," and you selectively attend to evidence that confirms the threat narrative while missing contradictory signals. AEDP (Diana Fosha) would approach this by building "felt security" in the therapeutic relationship first — helping your nervous system experience what accurate co-regulation feels like, so it can begin to distinguish real signals from anxious projections. The clinical path: build perceptive accuracy through Gestalt awareness exercises (body scanning, present-moment attending) while simultaneously using ACT defusion for the anxious narratives.`,
        soulful: `There is a Jungian image for your experience: wandering through a fog with a compass that spins wildly. Your Shadow contains the one who was never taught to read the emotional weather — perhaps because the emotional weather in your early world was too chaotic to read, or too dangerous to look at directly. So you learned to feel the fear without learning to read the signal. The Trickster archetype is at play here: anxiety disguises itself as perception, whispering false certainties into the fog.

Rumi wrote: "The wound is the place where the Light enters you." Your wound is the gap between sensing danger and understanding what you're sensing. You are like a tree in winter — roots reaching deep into the frozen earth, sensing vibrations but unable to distinguish between the footfall of a deer and the approach of a storm. Everything registers as threat because the instrument of discernment was never fully grown.

This is the ecology of the anxious heart: a root system on high alert, pulling nutrients of meaning from soil that yields mostly ambiguity. Clarissa Pinkola Estes writes in Women Who Run With the Wolves: "The psyche heals itself when it is allowed to feel and name what it feels." Your healing runs along the same path — not silencing the alarm, but training the perception that the alarm needs to function wisely. Like the forest learning to read its own seasons: winter's bareness is not death, and silence is not always abandonment.

The invitation before you: before you react to what the fog suggests, learn to wait for the fog to thin. "I can't tell what you're feeling right now. Can you help me?"`,
        practical: `THE PATTERN: Anxiety scans → perception is unclear → anxiety fills the gap with worst-case stories → you react to the story. James Clear calls this an "identity-based habit": you've unconsciously adopted the identity of "the one who knows what's really going on" when actually you're guessing.

THIS WEEK (your ONE micro-step): Before reacting to what you THINK your partner is feeling, use this exact script: "I'm sensing something but I'm not sure what. Am I reading you right?" Say it once. Just once. That's your atomic habit.

HABIT STACK (BJ Fogg): After I notice my anxiety rising about my partner's mood, I will pause and say "I'm not sure what I'm reading" before I react.

THE BOLD ASK: Tell your partner: "I realize I often react to what I think you're feeling instead of asking. I want to start checking. Can you be patient with me while I learn to read you better?"

Stages of change: Recognizing that your perception is blurry (not your anxiety that's wrong, but your reading that's incomplete) — that's the shift from Precontemplation to Contemplation. Asking once this week is Action.`,
        developmental: `Low perception combined with high anxiety suggests what Wilber's Integral model calls a "line differential" — your emotional-threat line developed far ahead of your emotional-perception line, likely because in early environments, detecting DANGER was more survival-critical than accurately reading FEELINGS. In Kegan's framework, you're operating from the Socialized Mind (Order 3) in the perceptive domain — you rely on your partner's reactions (or your projections of their reactions) to tell you what's happening, rather than developing an independent reading capacity. Erikson's stage of Trust vs. Mistrust is still being negotiated — your nervous system hasn't fully resolved whether the emotional world is readable and safe. Spiral Dynamics maps this as a Purple/Red tension: the communal need for belonging (Purple) meets the self-protective need for control (Red), and without accurate perception, control wins. Carol Gilligan's research shows that the capacity for relational knowing develops through practice, not insight alone. The developmental move: building perception as a separate skill through daily micro-practices of emotional checking, not to reduce anxiety but to give it better data.`,
        relational: `Your partner lives in a strange relational reality: they feel simultaneously over-monitored and deeply misread. In Buber's framework, they experience neither I-Thou (true seeing) nor I-It (functional relating) — but something more disorienting: I-Phantom, where you relate to a projection of them rather than to who they actually are. Hendrix's Imago theory suggests your partner triggers your earliest attachment template, and without clear perception, you respond to the template rather than the person. Tatkin's PACT model would note that your partner's nervous system learns that their actual emotional state doesn't predict your response — your anxiety does. This creates a learned helplessness in them: "It doesn't matter what I'm actually feeling because they'll react the same way regardless." They might say: "You always think I'm upset when I'm fine, but you never notice when I'm actually sad." That's the perception gap your anxiety fills with its own narrative. Gottman's trust metric erodes not from betrayal but from chronic misattunement — the accumulated weight of being consistently misread.`,
        simple: `You feel the danger but can't read the signal. Stop guessing. Start asking. "Am I reading you right?" — three words that change everything.`,
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
        therapeutic: `This is therapeutically rare and valuable — strong emotional perception without the anxiety distortion. In EFT (Sue Johnson), you represent the "securely attached perceiver": your reading of the relational field is both accurate and relatively undistorted by threat. Polyvagal theory (Porges) explains the mechanism: your ventral vagal system — the social engagement circuit — is well-developed, allowing nuanced reading of facial cues, vocal tone, and postural shifts without triggering sympathetic activation. In IFS terms (Schwartz), your Perceiver parts operate without interference from anxious Protectors — the Self can observe the relational field from a grounded, curious position. AEDP (Diana Fosha) would call this "core state" access — the ability to be present with emotional truth without defense. Gestalt therapy would note your strong "contact boundary": you can sense the field without losing yourself in it. Research shows acceptance and emotional accessibility as the strongest predictors of satisfaction — you have the perceptive foundation for both. The clinical opportunity: leveraging this capacity not just for observation but for active relational leadership — sharing what you see in ways that deepen your partner's self-understanding.`,
        soulful: `You carry the archetype Jung called the Self in its most integrated aspect — the capacity to witness without being consumed, to sense without being shattered. Where others walk through the relational forest startling at every snapped twig, you move with the quiet attention of someone who knows the forest well. You hear the owl and recognize it as owl, not omen.

Mary Oliver wrote: "Instructions for living a life: Pay attention. Be astonished. Tell about it." You have mastered the first. You live in the second. The third is your invitation — because perception held in silence is a lantern burning in an empty room.

There is an ecopsychological truth in your pattern: you are the deep lake in autumn — still enough to reflect perfectly, warm enough beneath the surface that life continues even when the air turns cold. The mycelium of your awareness spreads quietly through the relational soil, sensing nutrient and need without alarm. This is not numbness or detachment — it is the rare achievement of what Pema Chodron calls "the ability to stay" — to remain present with whatever arises without the reflex to flee or fight.

Khalil Gibran wrote: "Your hearts know in silence the secrets of the days and the nights." Your heart knows. The question is whether you will let your partner into that knowing. David Whyte reminds us: "What you can plan is too small for you to live." Let your perception become a gift you offer, not a treasure you guard.`,
        practical: `Your perception is an asset that isn't distorted by anxiety. You're in rare territory. Your edge: USE it actively, not passively.

THIS WEEK (one micro-step): Share one observation about the space between you and your partner that you normally keep to yourself: "I notice we've been a little distant this week" or "You seem lighter today — something good happen?"

HABIT STACK (BJ Fogg): After dinner, I will share one thing I noticed about my partner's emotional state that day.

THE BOLD ASK: Tell your partner: "I notice a lot about us that I keep to myself. I want to start sharing more of what I see. Would that feel good to you?"

Stages of change: You're likely in Maintenance on the perception side (it's already a strength). The growth edge is moving from Contemplation to Action on the sharing side. One observation shared per day for a week moves you from private perceiver to relational leader.`,
        developmental: `You may already be at Kegan's Order 4 — able to observe the relational field without being fused with it. In Wilber's Integral map, your cognitive and emotional lines are well-integrated, creating what he calls "vision-logic": the ability to hold multiple perspectives simultaneously without collapsing into any one of them. Spiral Dynamics places this at Green moving toward Teal — sensitive to the relational field AND capable of systemic observation. Erikson's Generativity stage is relevant: your growth edge isn't building more capacity for yourself, but using your existing capacity in service of others. Carol Gilligan's highest stage of moral development — the ethic of care that includes the self — describes your potential well. The Order 5 (Self-Transforming) invitation: can you use this capacity in service of your partner's development, not just your own awareness? Can you share what you see in a way that invites them into the observation rather than delivering a verdict?`,
        relational: `Your partner likely experiences something rare with you: the feeling of being truly seen without the accompanying anxiety of being judged. In Buber's I-Thou framework, you offer genuine encounter — your perception meets their reality without distorting it through your own needs. Hendrix's Imago model would say you've done significant work on your "unconscious relationship" patterns — you can see your partner as they are, not as your childhood template expects them to be. Tatkin (PACT) would identify you as a natural "anchor" — someone whose nervous system provides safety for both people. The Gottman Sound Relationship House is well-built here: your perception feeds the "Love Maps" level (knowing your partner's inner world) and the "Turning Toward" level (noticing their bids for connection). The only relational risk: if you see patterns but don't share them, your partner misses the benefit of your clarity. They feel safe with you but may not know why — and sharing your observations would help them understand both themselves and the relationship more deeply. What your partner would say if they could articulate it: "I feel held by you in a way I can't explain."`,
        simple: `You see clearly and you hold it calmly. That's rare. Don't hoard it — share what you see. Your partner deserves the benefit of your clarity.`,
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
        therapeutic: `This is one of the most common and clinically significant combinations. EFT trials (Sue Johnson) consistently find that attachment anxiety combined with low differentiation predicts the greatest relationship distress. In Polyvagal terms (Porges), your ventral vagal system is calibrated to merge rather than co-regulate — your nervous system doesn't distinguish between "connected to" and "fused with." Schema Therapy (Young) identifies the Enmeshment/Undeveloped Self schema: the belief that closeness requires the surrender of your own identity. IFS (Schwartz) reveals a system where no Self-energy leads — instead, anxious Exiles run the show, desperately seeking to be held by merging with the other's system. In AEDP (Fosha), this is a "defense against aloneness" so total that the person sacrifices self-coherence to avoid it. DBT (Linehan) would target the interpersonal effectiveness deficit: you lack the skill of DEAR MAN — asserting needs while maintaining the relationship AND your self-respect simultaneously. From a Gestalt perspective, the contact boundary has dissolved; there is confluence where there should be contact. The key clinical insight: the relationship becomes your identity; any threat to it is a threat to your self. EFT's Stage 2 work — restructuring the attachment bond — must happen alongside differentiation work, or the new bond will replicate the old fusion.`,
        soulful: `Jung spoke of individuation as the soul's deepest work — the long journey toward becoming who you actually are, separate from the roles and mergers that kept you safe. Your Shadow holds the terrified child who learned that being separate meant being abandoned, and so chose dissolution over solitude. The Anima/Animus — the inner figure of relatedness — has become inflated, swallowing the ego whole. You do not relate TO your partner; you disappear INTO them, the way a river loses itself in the sea.

Rilke understood this with devastating clarity: "I hold this to be the highest task of a bond between two people: that each should stand guard over the solitude of the other." You have not yet learned to stand guard over your own solitude, let alone your partner's. There is no solitude left to guard. Only the hunger.

Ecopsychologically, you are the vine without a trellis — reaching, winding, clinging to whatever structure is near, not from malice but from the simple biological imperative to grow toward light. But a vine that strangles its support destroys both. Clarissa Pinkola Estes writes: "To be ourselves causes us to be exiled by many others, and yet to comply with what others want causes us to be exiled from ourselves." You have chosen the second exile. The invitation is the terrifying, beautiful return from that exile — the rediscovery of your own edges, not as walls but as the shoreline where you meet the ocean of your partner instead of dissolving into it.

James Hillman wrote: "The soul's goal is not adjustment but image-making." What image of yourself exists independent of this relationship? That question is the beginning of everything.`,
        practical: `THE PATTERN: You need closeness → you get close → you lose yourself in the closeness → your partner feels your weight → they create distance → you panic → you merge harder → repeat. James Clear would call this an "identity trap": your current identity is "I am this relationship." The atomic habit shift is building the identity: "I am a person who also has a relationship."

THIS WEEK (ONE micro-step): Do one thing that is entirely yours — that has nothing to do with your partner or the relationship. Go for a walk alone. Read a book they haven't recommended. Call a friend you haven't spoken to in months. Notice how it feels to be a separate person who also happens to be in love.

HABIT STACK (BJ Fogg): After I wake up each morning, I will spend 10 minutes doing something that is mine alone — journaling, stretching, reading — before engaging with my partner.

THE BOLD ASK: Tell your partner: "I want to build more of my own life so I can bring more of myself to ours. Can you support me in having some solo time this week without it meaning anything about us?"

Stages of change (Prochaska): If this description hit you like a truck, you're moving from Precontemplation to Contemplation. One solo activity this week = Action. Doing it without guilt = the real breakthrough.`,
        developmental: `Erikson's Intimacy vs. Isolation, complicated: you've achieved the FORM of intimacy (closeness, togetherness) without its SUBSTANCE (two whole selves meeting). In Kegan's terms: Order 3 in the relational domain — your self is constructed from the relationship rather than brought TO it. You are "subject to" the relationship; it has you rather than you having it. Wilber's Integral model maps this as a "center of gravity" issue: your cognitive line may be at Order 4 (you can reflect on the pattern intellectually) while your relational line remains at Order 3 (you can't actually DO anything about it in real-time). Spiral Dynamics: the Green meme's shadow — communion without agency, belonging without differentiation. Carol Gilligan's research on women's development is directly relevant: the move from "self-sacrifice" (caring for others at the expense of self) to "universal care" (caring for self AND other) is precisely the transition you face. The developmental move: building an internal center that can tolerate closeness without being dissolved by it — not through withdrawal, but through what Murray Bowen called "differentiation of self" while remaining emotionally connected.`,
        relational: `In Buber's framework, your partner cannot experience I-Thou with you because there is no stable "I" on your side of the encounter. They reach for you and find themselves — their own emotions reflected back, their own preferences echoed, their own identity mirrored. Hendrix's Imago theory suggests your partner was unconsciously chosen precisely because they trigger this fusion pattern — they carry the imago of the parent whose love felt conditional on your compliance. Tatkin (PACT) identifies this as a "wave" attachment style: you are the ocean's movement without its depth, constantly in motion toward your partner, unable to hold still. Your partner may feel engulfed — not by your love, but by the WEIGHT of being your entire emotional world. Gottman's research on "flooding" is relevant: your partner's autonomic nervous system may be chronically activated by the pressure of being someone's everything. They can't take space without it feeling like betrayal. They can't disagree without it feeling like abandonment. The pressure of being someone's everything is suffocating, even when the love is real. What they need: evidence that you can be okay on your own. Not independent — just... intact.`,
        simple: `You disappear into the people you love. That's not intimacy — that's eviction from yourself. Find something that's yours. Then bring that self to the relationship. Two whole people, choosing each other. That's the goal.`,
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
        therapeutic: `EFT (Sue Johnson) and ACT (Steven Hayes) both address this combination directly. The mechanism: your yielding isn't a personality trait — it's your anxiety's conflict strategy. Your attachment system reads disagreement as potential abandonment, so it deploys accommodation to eliminate the threat. In Polyvagal terms (Porges), your dorsal vagal "freeze/appease" response activates during conflict, creating a functional shutdown of self-assertion. Schema Therapy (Young) identifies the Subjugation schema: the belief that expressing your own needs will lead to retaliation or abandonment. IFS (Schwartz) reveals a Firefighter that operates through compliance — a part that learned to prevent catastrophe by eliminating all friction. DBT (Linehan) would target this through the FAST skill (Fair, no Apologies, Stick to values, be Truthful) — maintaining self-respect during interpersonal interactions. Aaron Beck's CBT model identifies the cognitive distortion: "If I disagree, they'll leave" — an all-or-nothing prediction that has never been tested because you yield before the test can occur. AEDP (Fosha) would notice that your yielding prevents the experience of "tremulous affect" — the shaky, vulnerable feeling that accompanies authentic self-expression. The research recommends combining EFT emotion access (surfacing the fear underneath) with ACT committed action (building assertion as a values-aligned behavior, not an emotion-driven one).`,
        soulful: `The Persona — Jung's mask of social adaptation — has overtaken you so completely that you may no longer know which face is the mask and which is the self beneath it. Your Shadow holds the one who rages, who wants, who demands — all the assertive energy you have exiled in service of keeping the peace. As bell hooks wrote: "Rarely, if ever, are any of us healed in isolation. Healing is an act of communion." But the communion you practice is counterfeit — built on the erasure of one voice so the other can speak uncontested.

You yield not from generosity but from fear. Not the fear of your partner — the fear of the absence of your partner. Every accommodation is a small prayer: please don't leave. Your nervous system learned this prayer before you had words for it, and it runs now like mycelium beneath the surface of every disagreement — invisible, pervasive, shaping everything that grows above ground.

Kierkegaard wrote: "The most common form of despair is not being who you are." Your yielding is that despair made relational — the slow, daily practice of not being who you are in order to keep love close. The yielding keeps the surface smooth. Underneath, a slowly building pressure of all the things you've swallowed — what Thomas Moore calls "the symptom as the voice of the unlived life."

Mary Oliver asks: "Tell me, what is it you plan to do with your one wild and precious life?" Not this. Not the quiet surrender. Start relieving the pressure now. One small truth at a time. Like the first crocus through late snow — small, insistent, alive.`,
        practical: `THE PATTERN: Disagreement arises → anxiety says "they'll leave if you push back" → you yield → resentment builds silently → repeat. James Clear: "Every action you take is a vote for the type of person you wish to become." Every yield is a vote for the identity: "I am someone without preferences."

THIS WEEK (ONE micro-step): In one small disagreement (not the big ones yet), state your actual preference BEFORE yielding: "I'd rather do X, but I'm willing to do Y." You don't have to fight for it. Just name it. That's the atomic habit.

HABIT STACK (BJ Fogg): After my partner suggests a plan, I will pause for three seconds and check: "Do I actually agree, or am I yielding?" If yielding, I will name my preference first.

THE BOLD ASK: Tell your partner: "I've realized I often agree before checking what I actually want. I'm going to start pausing to check. If I seem slower to respond, that's growth, not resistance."

Stages of change: Naming the preference = Action. Doing it without immediately undercutting yourself ("but whatever you want is fine") = the real shift into Maintenance.`,
        developmental: `The anxious-yielding combination often traces to environments where expressing needs led to relational rupture — Erikson's Trust vs. Mistrust, resolved in the direction of mistrust specifically around self-assertion. In Kegan's framework, you're operating from the Socialized Mind (Order 3) specifically in conflict — your sense of what's acceptable to want is defined by what you believe your partner can tolerate. You are "subject to" the relationship's implicit rules about who gets to have needs. Spiral Dynamics maps this at the Purple/Blue transition: communal belonging (Purple) enforced through conformity to rules (Blue), where the rule is "don't make waves." Carol Gilligan's research on moral development is directly relevant: you're at Level 2 (self-sacrifice as care) and the growth edge is Level 3 (universal care that includes the self). Wilber's Integral model would note that your relational line lags your cognitive line — you can see the pattern but can't yet act from a different center of gravity. The developmental move is authoring your own needs from the inside — not as rebellion, but as an act of bringing your full self to the relationship.`,
        relational: `In Buber's I-Thou, genuine encounter requires two subjects — but your yielding reduces you to an object in service of the other's subjectivity. Your partner thinks the relationship is smooth. Hendrix's Imago model reveals the hidden dynamic: your partner unconsciously chose someone who accommodates because it matches their imago — and your accommodation prevents the "conscious relationship" work that Hendrix identifies as the path to real intimacy. Tatkin (PACT) would note that your partner's nervous system has been trained by your yielding: they expect compliance and may not know how to handle your genuine preferences. Gottman's research on "turning toward" bids applies here: your partner makes a bid, you "turn toward" by yielding — but it's not genuine turning toward, it's anxious capitulation. They're slowly losing access to who you actually are — because every yield removes another piece of your true self from the relationship. Underneath your partner's comfort with the smooth surface, there may be a growing unease they can't name: the sense that they're in a relationship with a mirror instead of a person.`,
        simple: `You give in before you've even checked what you want. Your partner can't love the real you if the real you never shows up. One preference, named out loud, this week. Start small.`,
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
        therapeutic: `Double withdrawal across attachment AND conflict dimensions. Research on 539 couples found attachment explained the largest proportion of variance in relationship instability — and your combination represents both attachment and behavioral avoidance operating simultaneously. EFT (Sue Johnson) identifies this as a "withdraw-withdraw" cycle, the least visible but most dangerous pattern because nothing appears wrong until the relationship quietly dies. Polyvagal theory (Porges) explains the mechanism: your dorsal vagal system (the "shutdown" circuit) activates in response to both intimacy AND conflict, creating a comprehensive numbing that feels like calm but is actually physiological withdrawal. In Schema Therapy (Young), this maps to the Emotional Inhibition and Emotional Deprivation schemas working in tandem — you suppress your own emotional needs while simultaneously believing they won't be met. IFS (Schwartz) reveals a system dominated by a Manager part whose sole strategy is "if nothing happens, nothing can go wrong." CBT (Beck) identifies the core belief: "Engaging emotionally is dangerous." ACT (Hayes) targets experiential avoidance — the systematic avoidance of difficult internal states — as the central process maintaining this pattern. DBT (Linehan) would approach through Distress Tolerance: building the capacity to tolerate the discomfort of engagement, not just the comfort of withdrawal.`,
        soulful: `Jung wrote of the Shadow as "the thing a person has no wish to be." Your Shadow is the one who needs, who reaches, who stays in the room when the room gets hot. You have built what looks like the Persona of the self-sufficient one — composed, independent, unruffled. But the Self beneath knows the truth: this is not peace. It is the absence of weather.

Wendell Berry wrote: "It may be that when we no longer know what to do, we have come to our real work, and that when we no longer know which way to go, we have come to our real journey." You have known which way to go for a long time: away. Away from the conversation, away from the feeling, away from the need. The real journey begins when you stop walking away and stand still in the discomfort.

Ecopsychologically, you are the frozen ground of late winter — everything dormant, everything preserved but nothing growing. The surface between you and your partner is permanently calm. No storms. No raised voices. No tears. Issues accumulate like sediment on a riverbed — invisible until the river changes course and everything dislodges at once. The tides have gone still, and still water, without movement, stagnates.

Rumi wrote: "The wound is the place where the Light enters you." But you have sealed every wound so thoroughly that no light enters at all. You are not keeping the peace. You are keeping the silence. And silence, in a relationship, is the slowest way to leave. James Hillman reminds us: "The soul requires that we move toward what we fear." One sentence. One feeling. One crack in the permafrost. That is where spring begins.`,
        practical: `THE PATTERN: Something needs discussing → your attachment system says "closeness is dangerous" → your conflict system says "tension is worse" → nothing gets said → distance grows imperceptibly → repeat for years. James Clear: "You do not rise to the level of your goals. You fall to the level of your systems." Your system is optimized for avoidance.

THIS WEEK (ONE micro-step): Bring up ONE thing you've been sitting on. Start with: "There's something I've been avoiding saying." Then say it. Breaking the seal matters more than what comes through it.

HABIT STACK (BJ Fogg): After my partner asks "how was your day," I will share one thing that was actually difficult instead of saying "fine."

THE BOLD ASK: Tell your partner: "I know I avoid hard conversations. I want to change that. Can we set aside 15 minutes this week where I practice saying something difficult, and you just listen?"

Stages of change: If you've read this far without closing the app, you're in Contemplation. One hard sentence this week moves you to Action. The discomfort you feel saying it is not a sign you're doing it wrong — it's a sign you're doing it right.`,
        developmental: `This combination often represents an early environment where both emotional closeness AND conflict were unsafe — Erikson's Trust vs. Mistrust resolved by opting out of the game entirely. In Kegan's terms, you may have achieved a version of the Self-Authoring Mind (Order 4) — but authored through exclusion rather than integration. Your independence is real but it was built by walling off the relational domain rather than mastering it. Wilber's Integral model would identify this as a "line split": high autonomy, low communion — one half of the integral equation developed at the expense of the other. Spiral Dynamics maps this at Orange: individual achievement and self-reliance valued, while Green's relational sensitivity and communal awareness remain undeveloped. Carol Gilligan would note that the "justice orientation" (individual rights, autonomy) has developed without the "care orientation" (relational responsiveness, mutual vulnerability). The developmental invitation is Order 5 — the Self-Transforming Mind — where independence and interdependence coexist, where you can be fully yourself AND fully in relationship.`,
        relational: `Your partner lives in a relationship where nothing is ever wrong — and nothing is ever fully right. In Buber's terms, they experience I-It rather than I-Thou: they encounter your functional self (the one who pays bills, makes plans, shows up physically) but not your relational self (the one who needs, fears, hopes, hurts). Hendrix's Imago therapy would identify your partner's deepest frustration: they chose you partly for your stability, but that same stability now feels like a wall. Tatkin (PACT) calls this "island" attachment — self-sufficient to the point of relational deprivation. Gottman's Sound Relationship House is missing the bottom floors: Love Maps (they don't know your inner world because you don't share it) and Turning Toward (you turn away from bids so subtly that it looks like calm rather than rejection). Your partner may have stopped bringing things up because they learned you'll withdraw. Underneath their adaptation is a loneliness they can't name — the loneliness of being with someone who is reliably present and emotionally absent.`,
        simple: `Nothing gets discussed. Nothing gets resolved. Nothing gets better. It's that simple. One real conversation this week. That's the beginning of everything.`,
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
        therapeutic: `Your strong emotional perception (${Math.round(perception)}) means you read the relational field accurately. Your high fusion (${Math.round(fusion)}) means you ABSORB what you read. EFT (Sue Johnson) identifies this as a pattern where emotional accessibility — normally a strength — becomes emotional flooding because the boundary between self and other collapses. Polyvagal theory (Porges) explains the mechanism: your social engagement system is highly active (you read signals beautifully) but your autonomic regulation system lacks the capacity to maintain physiological separateness — your nervous system mirrors and merges rather than mirrors and holds. In IFS (Schwartz), your Perceiver parts are highly developed but they report directly to an Exile rather than to Self — what you perceive goes straight into the wound rather than being processed through a grounded center. Schema Therapy (Young) maps this to the Enmeshment schema combined with high emotional sensitivity — you feel compelled to manage others' emotions because you experience them as your own. Gestalt therapy would name the core issue: "confluence" rather than "contact" — you flow together with your partner's emotional state rather than meeting it from across the contact boundary. AEDP (Fosha) would build your capacity for "differentiated relatedness" — staying emotionally present while maintaining a felt sense of your own separate existence. The clinical paradox: you need MORE perception (self-perception specifically), not less.`,
        soulful: `Jung spoke of "participation mystique" — the archaic identity between subject and object, where the boundary between self and world has not yet differentiated. You live this daily. Your Anima/Animus is not a bridge to the other but a dissolution into the other. The archetype active in you is not the Wounded Healer but the Empath-as-Sacrifice: the one who takes on the world's suffering because they cannot find the membrane between their own heart and the heart of another.

You live inside a shared emotional body with no skin. Your partner's sadness becomes your sadness. Their anxiety becomes your anxiety. You don't just empathize — you BECOME the other's emotional state. John O'Donohue wrote: "Real friendship or love is not manufactured or achieved by an act of will or intention. Friendship is always an act of recognition." But recognition requires distance — the distance of one consciousness looking at another. You cannot recognize what you have already become.

Ecopsychologically, you are the river that has lost its banks. Without banks, a river becomes a flood — powerful, chaotic, destructive to the very landscape it once nourished. The invitation is not less water. It is banks — riverbanks that shape the flow without stopping it. Not a dam. Not a wall. A shore. As Mary Oliver wrote: "Someone I loved once gave me a box full of darkness. It took me years to understand that this too, was a gift." Your gift is not the darkness you absorb but the perception that allows you to sense it. The gift becomes a gift again only when you stop drowning in it.

Pema Chodron teaches: "Compassion is not a relationship between the healer and the wounded. It's a relationship between equals." You cannot be an equal if you are dissolved inside the other's pain.`,
        practical: `Your pattern: you sense accurately → you absorb what you sense → you lose track of your own state → you become your partner's emotional weather → you burn out or collapse → repeat. James Clear: "The most effective way to change your habits is to change your identity." Your current identity: "I am whatever my partner is feeling." New identity: "I am someone who senses deeply AND stays grounded."

THIS WEEK (ONE micro-step): Three times this week, pause and ask: "Is this feeling MINE, or am I picking it up from the field?" You don't need to answer correctly. Just asking creates a boundary your nervous system can start to recognize.

HABIT STACK (BJ Fogg): After I notice a strong emotional shift, I will place my hand on my own chest and ask: "What am I feeling right now — separate from what I'm sensing in the room?"

THE BOLD ASK: Tell your partner: "Sometimes I absorb your emotions without meaning to. If I seem suddenly sad or anxious and it doesn't match my day, can you check in with me? It might be yours, not mine."

Stages of change: Recognizing that you absorb (not just sense) is the shift from Precontemplation to Contemplation. The "Mine or Theirs?" question three times this week = Action.`,
        developmental: `In Kegan's framework, this is the core Order 3→4 transition: you can PERCEIVE the relational field (that's an Order 4 capacity) but you can't yet HOLD yourself separate from it (that's still Order 3 fusion). Wilber's Integral theory maps this as the pre-personal/trans-personal confusion: your capacity feels spiritual or transcendent (union with the other) but it is actually pre-personal (undifferentiated merger). True trans-personal empathy (Turquoise in Spiral Dynamics) requires a solid personal self to transcend FROM. You can't transcend what you haven't yet built. Erikson's Identity vs. Role Confusion is live: your identity is unstable because it shifts with every relational field you enter. Carol Gilligan's highest stage of care — care that includes the self — is your developmental target. The developmental edge is becoming the observer who stays grounded while sensing the field — what Wilber calls the "Witness" position: infinite compassion, infinite distance, held simultaneously.`,
        relational: `Your partner may feel deeply understood by you — and slightly suffocated. In Buber's terms, they do not experience I-Thou (genuine encounter between two separate beings) but something closer to what he called "experiencing" — being processed through the other's system rather than met. Hendrix's Imago model reveals a paradox: your partner chose you partly FOR your attunement, but the fusion version of attunement feels like being consumed rather than seen. Tatkin (PACT) would note that your partner lacks a "separate other" to co-regulate with — they can't lean on you because you've already collapsed into their state. Gottman's repair attempts fail in this configuration because repair requires two positions, and fusion creates only one shared emotional state. Your attunement is extraordinary. But because you absorb their state rather than observing it, they never get the experience of being WITNESSED — seen from a slight distance by someone who holds their own center. That witnessing is the deepest gift of intimacy: someone who sees your pain, holds space for it, and remains intact.`,
        simple: `You feel everything everyone around you feels. That's a superpower with a fatal flaw: you forget which feelings are yours. Three times this week, ask: "Is this mine?" That one question builds the boundary you need.`,
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
        therapeutic: `Your emotional reactivity fires fast (${Math.round(reactivity)}), but your capacity to manage your own emotional states is low (${Math.round(managingSelf)}). Gottman's research identifies this as Diffuse Physiological Arousal (DPA) — the state where heart rate exceeds 100 BPM and productive conversation becomes neurologically impossible. Polyvagal theory (Porges) provides the mechanism: your sympathetic nervous system activates rapidly while your ventral vagal "brake" — the system that modulates arousal back to a tolerable range — is underdeveloped. In DBT terms (Linehan), you lack distress tolerance and emotion regulation skills: the capacity to experience intense affect without acting on it. IFS (Schwartz) reveals a system where Firefighter parts dominate: when emotion rises, these parts take extreme action (yelling, storming out, escalating) to extinguish the unbearable feeling. Schema Therapy (Young) identifies the Insufficient Self-Control schema: the deep belief that you cannot manage your own emotional states, which becomes a self-fulfilling prophecy. AEDP (Fosha) would focus on "affect tolerance" — building the capacity to stay present with intense emotion without collapsing into it or acting it out. CBT (Beck) would address the cognitive distortions that accompany flooding: catastrophizing, emotional reasoning, mind-reading. The clinical recommendation: regulation FIRST, then engagement. You literally cannot process relational content above a certain arousal threshold.`,
        soulful: `Jung wrote: "Everyone carries a shadow, and the less it is embodied in the individual's conscious life, the blacker and denser it is." Your Shadow is not the rage itself — it is the absence of a container for the rage. The Trickster archetype is active in you: that part of the psyche that disrupts and destroys with a mischievous lack of proportion, saying the unsayable, breaking the unbreakable. The Trickster is not evil. It is the soul's way of refusing to be contained by structures too small for it. But without a container, the Trickster becomes chaos rather than transformation.

When the wave comes, there is nothing to hold onto. Your emotions arrive with the force of a flash flood, and the banks of your emotional river are too shallow to contain them. You don't choose to react — you ARE the reaction. And in those moments, words come out that don't represent who you are. As Rilke wrote: "Let everything happen to you: beauty and terror. Just keep going. No feeling is final." But you cannot "let everything happen" when the everything overwhelms the vessel.

Ecopsychologically, you are the volcano — magnificent, creative, and devastating in equal measure. The fire inside you is not the problem. Every forest needs fire to regenerate. The problem is the absence of a hearth — a sacred container for the flame. Wendell Berry wrote: "The world cannot be discovered by a journey of miles, only by a spiritual journey, a journey of one inch, very arduous and humbling and joyful, by which we arrive at the ground at our feet." That one inch — the space between the feeling rising and the words coming out — is your territory to reclaim.

Thomas Moore wrote: "Care of the soul requires ongoing attention to every aspect of life." Your soul needs not less fire but deeper ground.`,
        practical: `THE GAP: You react fast (reactivity: ${Math.round(reactivity)}) and regulate slow (managing own: ${Math.round(managingSelf)}). James Clear: "You don't need to overhaul your entire life. You need a better system for the moments that matter most." For you, the moment that matters most is the 3-second window between the trigger and the explosion.

THIS WEEK (ONE micro-step): Build a personal 20-minute rule. When you notice flooding (chest tight, jaw clenched, tunnel vision), say: "I need 20 minutes." Leave the room. Breathe. Walk. Return. THEN continue the conversation.

HABIT STACK (BJ Fogg): After I notice my heart rate spiking during a conversation, I will say "I need 20 minutes to regulate" and leave the room. After I return, I will re-engage with the conversation.

THE BOLD ASK: Tell your partner IN ADVANCE (not during a fight): "When I get flooded, I lose access to my best self. I'm going to start taking 20-minute breaks. It's not me leaving — it's me coming back to you as the person you deserve."

Stages of change: If you're aware of the gap, you're in Contemplation. The 20-minute rule, used once, moves you to Action. Used consistently for a month, it becomes Maintenance. BJ Fogg: celebrate the tiny win each time you successfully take the break — that celebration wires the new behavior.`,
        developmental: `The developmental work is building what Dan Siegel calls the "window of tolerance" — the range of emotional arousal within which you can still think, communicate, and choose your response. Your window is currently narrow. In Kegan's terms, you're "subject to" your emotional reactivity — it has you rather than you having it. The Order 3→4 transition here is building the observing capacity that can notice "I am flooding" without being the flood. Wilber's Integral model maps this as the "centaur" level: integrating mind and body so that bodily arousal (sympathetic activation) is noticed and modulated by cognitive awareness rather than overwhelming it. Spiral Dynamics: your emotional center drops to Red (impulsive action driven by immediate feeling) when triggered, even though your typical center of gravity may be much higher. Erikson's Generativity vs. Stagnation applies: your reactivity is a form of stagnation, repeating the same cycle without building new capacity. Carol Gilligan's work on moral development shows that care requires the capacity to hold complexity — and you cannot hold complexity when your nervous system is in survival mode. Every practice that builds regulation — breathwork, the 20-minute rule, naming emotions in the body — widens the window incrementally and moves development forward.`,
        relational: `Your partner walks on eggshells. In Buber's framework, they cannot risk the I-Thou encounter — the raw, honest meeting of two beings — because your reactivity makes honesty dangerous. They've learned that bringing up a concern may trigger a flood, so they edit, filter, suppress. Hendrix's Imago model identifies this as a "maximizer" pattern: your emotional intensity overwhelms the relational space, leaving no room for your partner's experience. Tatkin (PACT) calls this a "threat to the couple bubble": when one partner cannot regulate, the shared sense of safety collapses for both. Gottman's "Four Horsemen" are relevant: your reactivity feeds Criticism and Contempt (even when you don't mean them), your partner responds with Defensiveness, and eventually they move to Stonewalling as self-protection. What they need: the 20-minute rule. Not as a retreat — as a promise: "I'm not leaving. I'm regulating. I'll be back." And then: coming back. Consistently. That consistency rebuilds the trust your reactivity has eroded.`,
        simple: `The wave comes too fast. The banks are too shallow. You say things you don't mean. Here's the fix: when you feel the heat rising, say "I need 20 minutes" and walk away. Come back calmer. It's that simple and that hard.`,
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
        therapeutic: `Attachment avoidance (${avoidance.toFixed(1)}) creates emotional distance while emotional cutoff (${Math.round(cutoff)}) severs the signal when feelings get too intense. Together they form a comprehensive distance system — not just behavioral withdrawal but emotional deadening. EFT (Sue Johnson) identifies this as the most deeply defended pattern: "deactivating strategies" (Mikulincer & Shaver) that suppress attachment needs at the source. Polyvagal theory (Porges) maps this to chronic dorsal vagal dominance — the "freeze" state disguised as composure. Your autonomic nervous system has learned to shut down rather than engage, and it does this so efficiently that you may not even register the shutdown as a response — it feels like nothing, which is the point. IFS (Schwartz) reveals a system where Managers have achieved total control: no Exile is ever allowed to surface, no vulnerability ever reaches the light. The cost is that Self-energy — the curious, compassionate core — is also suppressed. Schema Therapy (Young) identifies the Emotional Inhibition schema layered with Defectiveness: "If I show what I feel, I'll be seen as flawed AND I'll lose control." AEDP (Fosha) would approach this with the "undoing of aloneness" — carefully building safety until the defended system can risk one moment of genuine contact. Gestalt therapy names the mechanism: "retroflection" — turning energy that would naturally flow toward the other back against the self. Research shows attachment avoidance at intake predicts change trajectories in therapy, meaning this pattern IS modifiable even though it feels fixed.`,
        soulful: `There is a myth in nearly every culture about the frozen king — the ruler whose heart turned to ice, whose kingdom fell into eternal winter. In Jung's terms, your Self has been enclosed in what he called the "glass coffin" — alive but unreachable, preserved but unable to participate in life. The Persona of composure is so complete that even you may have forgotten there is someone underneath it. Your Shadow holds not darkness but warmth — the vulnerability, the longing, the tears that your system sealed away so long ago you may doubt they still exist.

As John O'Donohue wrote: "There is a place in you where you have never been wounded, where there's a seamlessness in you, and where there is a confidence and tranquility." Beneath the ice, that place still lives. The question is not whether it exists but whether you will risk the thaw.

There is a quiet inside you that you have mistaken for peace. It is not peace. It is the absence of signal — the emotional field turned down so low that neither pain nor joy can reach you. Ecopsychologically, you are the permafrost: structurally sound, endlessly stable, and nothing grows. The surface between you and your partner cannot breathe behind glass. It needs air. Not a hurricane. A breeze. As Rilke wrote: "Perhaps everything terrible is in its deepest being something helpless that wants help from us."

Khalil Gibran wrote: "Your pain is the breaking of the shell that encloses your understanding." You have refused the breaking. And so the understanding remains enclosed. David Whyte offers the way through: "The only choice we have as we mature is how we inhabit our vulnerability."`,
        practical: `THE PATTERN: Something emotional happens → cutoff severs the signal → avoidance pulls you away → nothing gets felt → nothing gets discussed → distance normalizes. James Clear: "Habits are the compound interest of self-improvement." Right now, your compound interest is working against you — every day of sealed-off silence deepens the groove.

THIS WEEK (ONE micro-step): Share one feeling that you would normally process alone: "I had a hard day." "That movie made me sad." "I miss my friend." Let your partner respond. Don't manage their reaction. That's one rep.

HABIT STACK (BJ Fogg): After dinner each evening, I will share one feeling or experience from the day that I would normally keep to myself.

THE BOLD ASK: Tell your partner: "I know I'm hard to reach emotionally. I want to practice being more open. Can you receive it gently when I try? I might be awkward at first."

Stages of change: You may be in Precontemplation ("I don't have a problem, I'm just private") or Contemplation ("I see the pattern but don't know how to change"). One shared feeling = Action. Your partner's response to that one feeling will determine whether you move to Maintenance or relapse. Which is why the Bold Ask matters — you're shaping the environment for success.`,
        developmental: `You may have achieved Self-Authoring (Kegan Order 4) through EXCLUSION rather than INTEGRATION. You authored yourself by cutting off the relational channels — a real achievement, but an incomplete one. Wilber's Integral model calls this a "pathological hierarchy": autonomy without communion, agency without relatedness. The upper-right quadrant (individual behavior) is well-developed; the lower-left (shared meaning and intimacy) is underdeveloped. Spiral Dynamics maps this at Orange: individual achievement, rational self-management, strategic optimization of outcomes — all at the expense of Green's relational depth and vulnerability. Erikson's Intimacy vs. Isolation is resolved toward Isolation, not by circumstance but by architecture — you BUILT the isolation as a structure. Carol Gilligan's research would note that your moral reasoning may prioritize justice (fairness, reciprocity, individual rights) while the care orientation (responsiveness, mutual vulnerability) remains underdeveloped. The developmental invitation is Order 5 — the Self-Transforming Mind — where independence and interdependence coexist, where your well-built autonomous self can risk being changed by encounter with the other.`,
        relational: `Your partner experiences stability, calm, reliability — and a wall. In Buber's I-Thou, encounter requires mutual vulnerability, and you have systematically eliminated your vulnerability from the relational equation. Hendrix (Imago) would identify your partner's deepest frustration: they chose you for your steadiness but now starve for your heart. They reach for you and find composure. Tatkin (PACT) calls this the "island" style — your partner learns that reaching toward you yields nothing, so they stop reaching. Gottman's "emotional bid" research is devastating here: you miss or reject your partner's bids for connection so consistently that they reduce bidding — not from lack of love but from learned futility. Your partner might say: "I know they love me, but I can't FEEL it." They live inside a functional partnership that is emotionally uninhabited. What they need isn't emotion dumped at their feet. It's one crack. One small human moment. "That was a hard day" from someone who never admits to hard days — that sentence can rewire years of relational resignation.`,
        simple: `You built a beautiful wall. It keeps everything out — including the love. You don't need to tear it down. Just install a door. A small one. And open it once this week.`,
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
        therapeutic: `High I-position (${Math.round(iPos)}) combined with high forcing (${forcing.toFixed(1)}) creates a specific pattern: you know what you want AND you push hard for it. EFT (Sue Johnson) recognizes this as a "protest behavior" in secure-leaning individuals — not driven by attachment anxiety but by a rigid certainty that your perspective is correct and your partner simply needs to get on board. Gottman's research on the "harsh startup" applies: conversations that begin with force predict negative outcomes 96% of the time, regardless of the validity of the position. In IFS (Schwartz), a strong Manager part has fused with the I-position — the clarity is real, but the Manager's rigidity distorts it into domination rather than leadership. Schema Therapy (Young) may reveal an Entitlement schema: the belief that your needs and perspectives deserve priority because they are inherently more valid. CBT (Beck) identifies the cognitive distortion: "I'm right, therefore I should prevail" — a conflation of accuracy with authority. ACT (Hayes) would introduce cognitive flexibility: the ability to hold your perspective lightly, as one valid viewpoint among several, without weakening your commitment to it. DBT (Linehan) offers the concept of "dialectical thinking": two opposing truths can coexist, and your job is to hold both rather than forcing one to win. The developmental move: maintaining your position while making room for your partner's.`,
        soulful: `There is a version of strength that Jung would call the inflated Persona — the archetype of the King or Queen in its Shadow form: authority without receptivity, power without wisdom. The healthy King holds the center of the kingdom and makes space for all voices. The Shadow King conquers. As James Hillman wrote: "We don't grow by learning to deal with what's out there, but by facing what's in here." What's in here, beneath the clarity and the force, is often a fear: that if you stop pushing, you will be pushed. That if you make room, you will be erased.

You know who you are. You know what you want. And you know how to get it. This clarity is rare and valuable — like the oak tree in the forest, deeply rooted, unmovable in the storm. But somewhere along the way, "I know my truth" became "my truth is THE truth." Your I-position is a compass. Your forcing turns it into a battering ram.

Rumi wrote: "Out beyond ideas of wrongdoing and rightdoing, there is a field. I'll meet you there." You have stayed on the "rightdoing" side, unwilling to cross into the open field where two truths can coexist. Ecopsychologically, you are the mountain — magnificent, certain, enduring — but the mountain cannot bend. And love, as Khalil Gibran wrote, "possesses not nor would it be possessed; for love is sufficient unto love."

The invitation: hold your ground AND make room. As David Whyte wrote: "The truth about the soul is that it is not merely something we possess but something we must continually apprentice ourselves to." Apprentice yourself to the practice of holding strong AND holding open.`,
        practical: `Your pattern: you see clearly → you state clearly → you push → your partner yields or fights → either way, your position "wins" → relationship loses. James Clear: "Every action is a vote for the type of person you wish to become." Every forced win is a vote for the identity: "I am right and that's what matters."

THIS WEEK (ONE micro-step): In your next disagreement, state your position clearly — then ask: "What's your perspective?" And listen. Actually listen. Not to formulate a rebuttal. To understand. Your I-position stays strong. Your forcing gets replaced with curiosity.

HABIT STACK (BJ Fogg): After I state my position in a disagreement, I will pause, take one breath, and ask: "Help me understand how you see this."

THE BOLD ASK: Tell your partner: "I know I can come on strong. I want to make more room for your perspective. If you feel bulldozed, will you tell me? I'll try to step back instead of leaning in."

Stages of change: If you're recognizing the pattern, you're in Contemplation. The "State Then Ask" practice once this week = Action. The real test: when your partner's perspective genuinely changes yours. That's when you know it's working.`,
        developmental: `You may be at a strong Order 4 (Kegan) — self-authored, internally clear, able to define your own values and positions independent of external validation. This is genuinely impressive. AND it's incomplete. The transition to Order 5 (Self-Transforming) requires letting your partner's perspective genuinely change yours — not as compromise but as expansion. Wilber's Integral model maps your growth edge: you have high agency (individual clarity, self-definition) but underdeveloped communion (mutual influencing, shared meaning-making). Spiral Dynamics places you firmly at Orange (strategic, achievement-oriented, individually clear) with the invitation to develop Green (relational sensitivity, multiple perspectives, collaborative meaning). Erikson's Generativity stage asks: can your clarity serve something larger than your own position? Carol Gilligan's research shows that the integration of justice orientation (your strength — clear, principled positions) with care orientation (your growth edge — responsiveness to the other's reality) creates the highest form of moral reasoning. "Your way of seeing this is making me reconsider mine" — that sentence is the developmental leap.`,
        relational: `Your partner may feel steamrolled. In Buber's I-Thou, genuine encounter requires that both parties bring their full selves AND remain open to being changed by the encounter. You bring your full self. You do not remain open. Hendrix's Imago model identifies what your partner needs but can't get: the experience of being truly heard, not as an obstacle to overcome but as a full subject with their own valid reality. Tatkin (PACT) would note that your partner's nervous system has learned that disagreement with you leads to a battle, so they choose from a limited menu: yield (and resent), fight (and exhaust both of you), or withdraw (and disconnect). None of these serve the relationship. Gottman's "accepting influence" research is directly relevant: couples where one partner (regardless of gender) refuses to accept influence from the other have an 81% chance of relationship dissolution. Your partner doesn't need you to be less clear. They need you to be equally curious. They know your position before you finish the sentence. What they don't know is whether their position matters to you. It might. But your forcing makes it invisible.`,
        simple: `You hold your ground beautifully. Now make room for someone else to stand there too. Same strength. Less bulldozer. Ask "what do you think?" and actually mean it.`,
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
        therapeutic: `Your agreeableness (${Math.round(A)}th percentile) orients you toward harmony, and your fusion (${Math.round(fusion)}) dissolves the boundary that would let harmony include disagreement. EFT (Sue Johnson) distinguishes between genuine emotional accessibility (a strength) and anxious compliance (a defense) — your combination tilts toward the latter. Polyvagal theory (Porges) explains: your ventral vagal system is socially attuned but in a "fawn" configuration — oriented toward appeasing and affiliating as a survival strategy rather than from genuine choice. In IFS (Schwartz), a Pleaser part has taken over the system, running a strategy of preemptive harmony to prevent any possibility of relational disruption. The Self — that curious, compassionate, clear-boundaried center — is obscured by the Pleaser's constant activity. Schema Therapy (Young) identifies the Subjugation schema combined with Approval-Seeking: your warmth is real, but it has been recruited by deeper schemas that say "your value is measured by how comfortable you make others feel." CBT (Beck) reveals the core belief: "If I disagree, I'm not a good person" — a moral identity built on compliance rather than integrity. ACT (Hayes) targets the values confusion: you believe harmony IS your value, when actually harmony is your strategy and your real values (authenticity, self-respect, genuine connection) are being sacrificed to maintain it. DBT (Linehan) offers the radical concept: disagreement IS warmth — because it treats your partner as strong enough to handle your truth.`,
        soulful: `Jung wrote of the "undiscovered self" — the one who lies beneath the agreeable surface, waiting to be found. Your Persona is the most socially successful mask of all: the kind one, the warm one, the one who makes everyone feel at ease. But the Shadow of the kind one is the one who rages in silence, who keeps score in secret, who resents the very harmony they create. As Thomas Moore wrote: "Care of the soul doesn't mean wallowing in the symptom, but it does mean giving the symptom a respectful hearing."

Your warmth is genuine. People feel safe with you. And underneath that warmth, a quieter truth: you have made yourself so agreeable that you have lost the texture of who you actually are. Warmth without edges is fog — pleasant but without shape. You have become the person everyone likes and no one fully knows, because knowing requires that there be something to push against.

Ecopsychologically, you are the morning mist — beautiful, all-encompassing, soft — and just as insubstantial. When the sun comes up (when real life demands real positions), the mist burns off and nothing remains. Rumi wrote: "Don't be satisfied with stories, how things have gone with others. Unfold your own myth." Your myth has been someone else's myth: the helper, the accommodator, the one who makes it easy. Your own myth — the one with edges, with desires, with a voice that says "actually, no" — is still unwritten.

bell hooks wrote: "Knowing how to be solitary is central to the art of loving." You have not been solitary inside your warmth. You have been populated by everyone else's needs. The invitation: "I love you AND I see this differently." That conjunction — AND — is where your real warmth begins.`,
        practical: `Your pattern: someone has a preference → your warmth says "make them happy" → your fusion erases your own preference → you agree → resentment builds invisibly → the warmth calcifies into performance. James Clear: "The ultimate form of intrinsic motivation is when a habit becomes part of your identity." Your current identity: "I'm the easy-going one." New identity: "I'm warm AND I have opinions."

THIS WEEK (ONE micro-step): Disagree with your partner about something small. Not to create conflict — to practice the muscle of difference. "I actually prefer the other option." Watch how the relationship doesn't break.

HABIT STACK (BJ Fogg): After my partner suggests something, I will pause for 3 seconds and check: "What do I actually want?" before responding. If my answer differs, I will say it.

THE BOLD ASK: Tell your partner: "I think I agree too quickly sometimes. I want to be more honest about my preferences, even the small ones. It might feel different at first, but it's me being more real with you."

Stages of change: If "agreeable fog" landed, you're in Contemplation. One genuine disagreement this week = Action. The emotional aftermath (guilt, anxiety, the urge to take it back) = normal. Sit with it. That's the practice.`,
        developmental: `High agreeableness + high fusion is the signature of Kegan's Order 3 in its most socially successful form. You are GOOD at relationships — at the Order 3 version, where the self is defined by the relational context. The move toward Order 4 (Self-Authoring) isn't becoming disagreeable — it's discovering that the relationship can hold difference without breaking. Wilber's Integral model identifies your growth edge: high communion, underdeveloped agency. Spiral Dynamics places you at Green's shadow: sensitivity to others so extreme that the self is sacrificed for group harmony. The healthy Green holds both sensitivity AND assertiveness; your version collapses into the first. Erikson's Identity vs. Role Confusion is live: your identity IS the role of "the agreeable one," and the confusion is: who are you when you're not making others comfortable? Carol Gilligan's developmental stages map your trajectory: from Level 2 (self-sacrifice as care — where you are) to Level 3 (universal care that includes the self — where you're headed). The transition requires a radical act: treating your own preferences as worthy of the same warmth you lavish on everyone else's.`,
        relational: `In Buber's I-Thou, genuine encounter requires two full subjects meeting. But your warmth-fusion combination means your partner encounters their own reflection rather than a separate being. Hendrix's Imago theory reveals why this is more corrosive than it appears: your partner unconsciously needs the friction of two different selves to do their own growth work, and your agreement denies them that friction. Tatkin (PACT) identifies the relational risk: your partner learns that your "yes" is unreliable because it's reflexive rather than considered — and once they doubt your "yes," they begin to doubt everything, including your love. Gottman's research on "soft startups" and "accepting influence" assumes two people with positions — your agreeableness eliminates one position from the system. Your partner senses that you agree too easily. They might push back and watch you fold, feeling a flicker of disappointment — not because they wanted a fight, but because they wanted a PARTNER. Someone whose "yes" means something because they also have access to "no." What your partner needs most: your genuine disagreement, offered warmly. That combination — honesty inside kindness — is what they've been waiting for.`,
        simple: `You agree beautifully. You disappear in the agreement. Your partner doesn't need your compliance — they need your truth. One real opinion, held out loud, this week. The relationship can handle it. Promise.`,
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
        therapeutic: `You read the room and then leave the room. Your perception picks up the tension, but your conflict style pulls you away from it. EFT (Sue Johnson) identifies this as particularly corrosive because you're AWARE of what needs addressing and you choose not to address it — your awareness isn't shut out, it's disconnected from action. Polyvagal theory (Porges) explains the neurological split: your ventral vagal system (social engagement) detects the signal accurately, but your dorsal vagal system (shutdown) activates before you can respond to it — a sequential process where perception triggers avoidance rather than engagement. In IFS (Schwartz), a highly competent Perceiver part reports to a Manager whose only strategy is "don't engage" — the intelligence is excellent but the response protocol is impoverished. Schema Therapy (Young) may reveal a Vulnerability to Harm schema: the belief that naming what you see will create danger, so seeing becomes its own form of suffering rather than a resource for action. ACT (Hayes) targets this directly through "committed action" — the practice of behaving in alignment with your values (which include honesty and connection) even when avoidance feels safer. CBT (Beck) identifies the catastrophic prediction: "If I name this, it will get worse." But the research shows the opposite: unaddressed patterns escalate; named patterns can be worked with. AEDP (Fosha) would build the bridge between perception and expression — helping you experience that sharing what you see, far from being dangerous, creates the "transformance" (healing momentum) that your system is capable of but afraid to access.`,
        soulful: `Jung wrote of the archetype of Cassandra — the prophetess cursed to see the truth and never be believed. Your curse is different: you see the truth and never speak it. The Shadow holds the one who would roar, who would point at the elephant in the room and say its name. But that one was exiled long ago — perhaps when speaking up led to punishment, or when naming a family truth created chaos. Now you carry the weight of the unsaid like stones in your pockets, growing heavier with each truth you swallow.

You see everything. And you carry what you see alone. Kierkegaard wrote: "The most painful state of being is remembering the future, particularly the one you'll never have." You remember the future of every unspoken conversation — you see where the unaddressed pattern leads, you sense the slow erosion, and you watch it happen in silence.

Ecopsychologically, you are the deep root system of an ancient tree — sensing every tremor in the earth, every shift in the water table, every approaching disturbance. But the roots never send the signal to the leaves. The tree looks healthy above ground while the roots register the approaching drought. Mary Oliver wrote: "Tell me, what else should I have done? Doesn't everything die at last, and too soon? Tell me, what is it you plan to do with your one wild and precious life?" Not this silent carrying. Not this eloquent muteness.

David Whyte wrote: "The conversational nature of reality means that what we refuse to speak about eventually speaks itself — in symptoms, in collapse, in the quiet death of what could have been." Let what you see become what you say. One truth at a time. Like the first bird of morning breaking the silence.`,
        practical: `Your pattern: you sense it → you file it → you avoid it → it festers. James Clear: "You don't need more information. You need more courage." Your perception has done the research. Your avoidance is blocking the action step.

THIS WEEK (ONE micro-step): Take ONE thing you've been sensing and bring it into the open: "I've been noticing [thing] between us. Can we talk about it?" Your perception did the hard work. Let your voice do the rest.

HABIT STACK (BJ Fogg): After I notice something between us that needs addressing, I will write it down within the hour. At the end of the week, I will share ONE item from the list.

THE BOLD ASK: Tell your partner: "I notice a lot more than I say. I want to start sharing what I see. Some of it might be uncomfortable. Can we agree that naming something isn't the same as criticizing?"

Stages of change: You've been in Contemplation for a long time (your perception ensures that). The block is the transition to Action. BJ Fogg's research shows that shrinking the behavior to its tiniest possible version ("I will mention one observation") reduces the activation energy enough to break through avoidance. One observation, once, this week.`,
        developmental: `You have Order 4 perception (Kegan) — you can observe the relational field as an object, note patterns, track dynamics over time. But your conflict avoidance is operating from Order 3 — driven by the relational system's rules about what's safe to name. In Wilber's Integral model, your cognitive line and your perceptive line are highly developed, while your assertive/agency line lags significantly — a "line differential" that creates the specific suffering of seeing clearly without being able to act. Spiral Dynamics maps this as Green's shadow: sensitivity without assertiveness, awareness without intervention. Erikson's Generativity stage is blocked: your perception gives you the capacity for meaningful contribution to the relationship, but your avoidance prevents you from sharing that contribution. Carol Gilligan's research identifies the transition you face: from "self-silence" (suppressing your own voice to maintain relationship) to "integrated voice" (speaking your truth as an act of care for both yourself and the relationship). The developmental move: letting your perception LEAD instead of your avoidance — discovering that naming what you see is itself an act of love, not a threat to it.`,
        relational: `In Buber's I-Thou, genuine encounter requires mutual revelation — two beings showing themselves to each other. You withhold half the encounter. Hendrix's Imago therapy calls this a "hidden relationship": the relationship your partner knows about (smooth, conflict-free) and the one you carry internally (full of observations, concerns, unspoken truths). Tatkin (PACT) would identify the cost to the "couple bubble": your partner makes decisions based on incomplete information because you filter what reaches them. They can't build trust with someone they don't fully know. Gottman's research on "emotional bids" shows that your withholding is a form of turning away — your partner makes implicit bids ("Is everything okay between us?") and you respond with "Fine" while carrying a catalogue of unsaid observations. Your partner may have NO IDEA how much you see. They think the relationship is "fine" because you never raise issues. But you're carrying an entire library of unsaid observations. Each one, left unspoken, creates a tiny distance they can't account for. They feel a growing gap and can't explain it because from their perspective, nothing happened. From yours, everything happened — silently.`,
        simple: `You see the problem. You walk around it. The problem doesn't move. You know what you need to do. Name one thing you've been seeing. Out loud. This week. That's it.`,
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
        therapeutic: `High openness (${Math.round(O)}th percentile) combined with high avoidance (${avoidance.toFixed(1)}) creates a specific paradox: you are intellectually and experientially open but emotionally closed. EFT (Sue Johnson) identifies this as "intellectualized relating" — the use of cognitive sophistication to maintain emotional distance while appearing engaged. Polyvagal theory (Porges) reveals the mechanism: your neocortex (thinking brain) is highly active and socially oriented, but your limbic system (feeling brain) is guarded by sympathetic/dorsal vagal defenses — creating a split between your thinking self (available, curious, fascinating) and your feeling self (hidden, protected, unreachable). In IFS (Schwartz), an intellectualizing Manager has created an elaborate system for appearing connected while keeping Exiles (vulnerable, attachment-needing parts) completely sequestered. Your openness may even serve your avoidance — creating the appearance of depth through intellectual engagement while keeping emotional vulnerability at arm's length. Schema Therapy (Young) identifies the Emotional Inhibition schema masked by intellectual vitality: you CAN engage with ideas about feelings; you CANNOT engage with feelings themselves. ACT (Hayes) targets the specific form of experiential avoidance at play: you avoid your own emotional experience by translating it into concepts, frameworks, and ideas. AEDP (Fosha) would gently challenge the defense by asking: "What do you notice in your body right now?" — moving from the head to the heart. Gestalt therapy would note the "deflection" — using intellectual engagement to redirect away from present-moment emotional contact.`,
        soulful: `Jung described the "thinking type" whose inferior function is feeling — someone for whom ideas are the native language and emotions a foreign tongue spoken haltingly, with an accent. Your Shadow holds the one who weeps, who reaches without words, who needs without understanding why. That one has been banished to the basement of the psyche while the intellectual explorer roams the upper floors, cataloguing the world's wonders and never descending the stairs.

You are a deep thinker, an explorer of ideas, a lover of nuance. You can talk for hours about the meaning of life, art, philosophy, the human condition. But when your partner asks "how are you really doing?" — something shifts. The openness contracts. The explorer retreats. Rilke wrote: "The purpose of life is to be defeated by greater and greater things." You have been defeated by ideas — beautifully, willingly. But you have not yet been defeated by love. That defeat requires a different kind of surrender: not the mind's openness to new concepts but the heart's openness to being known.

Ecopsychologically, you are the vast sky — infinite, expansive, holding everything in its gaze. But the sky never touches the earth. The rain must fall for the ground to receive the sky's gift. Your ideas are the sky. Your feelings are the rain. Without the rain, the earth below — your partner, your body, your own heart — remains parched. As Khalil Gibran wrote: "Your reason and your passion are the rudder and the sails of your seafaring soul. If either your sails or your rudder be broken, you can but toss and drift."

Thomas Moore wrote: "Tradition teaches that the soul lies midway between understanding and unconsciousness." You live in understanding. The soul asks you to descend halfway into the unknown territory of your own feeling.`,
        practical: `Your pattern: partner asks how you are → you give an interesting, articulate, analytically rich response → partner still feels distant → neither of you can name why. James Clear: "The most powerful outcomes are delayed." The delay here: every intellectualized response creates a microscopic distance. Over years, those microscopic distances become a canyon.

THIS WEEK (ONE micro-step): When your partner asks how you are, go one layer deeper than your default. If you'd normally say "fine," say what's actually there: "I'm feeling a little distant today." If you'd normally analyze, try: "I don't know how I feel, actually. Let me sit with it." Bring your openness to the emotional domain, not just the intellectual one.

HABIT STACK (BJ Fogg): After my partner asks about my day, I will share one FEELING (not one thought) before talking about events or ideas.

THE BOLD ASK: Tell your partner: "I think I use my mind to avoid my heart sometimes. If I go into 'professor mode' when you're looking for emotional connection, can you gently redirect me? Say something like 'I don't need your analysis right now — I need YOU.'"

Stages of change: You may not even be in Contemplation yet — your intellectual openness can masquerade as emotional openness so convincingly that you don't see the gap. Reading this and feeling a flicker of recognition = entering Contemplation. One feeling-level response this week = Action.`,
        developmental: `Your openness gives you genuine Order 4 capacity (Kegan) — you see complexity, hold paradox, appreciate nuance, take multiple perspectives. But your avoidance keeps the relational domain at Order 2 — need-based, self-protective, instrumental. Wilber's Integral model illuminates this as a dramatic "line split": your cognitive line may be at vision-logic (high Order 4 or early Order 5) while your emotional-relational line languishes at mythic or rational (Order 2-3). This creates the paradox your partner experiences: a person capable of extraordinary depth who becomes shallow at the emotional level. Spiral Dynamics maps this at Orange/Green cognitive with Blue/Orange relational: you think and explore at the world-centric level but feel and relate at the ethnocentric or rational level. Erikson's Intimacy vs. Isolation is live: your resolution has been a sophisticated form of isolation — intimate with ideas, isolated from hearts. Carol Gilligan's work on the integration of justice and care orientations applies: your justice/autonomy line is highly developed (you think about relationships with great sophistication) but your care/responsiveness line (you feel in relationships with great avoidance) lags behind. The integration: bringing your intellectual courage — the willingness to explore unknown territory — to emotional territory. That's the unexplored continent.`,
        relational: `In Buber's I-Thou, your partner encounters a fascinating I-It: they meet your mind but not your heart, your thoughts about feelings but not the feelings themselves. Hendrix's Imago model identifies the specific frustration: your partner chose you for your depth, and now discovers that the depth is a moat — beautifully constructed, intellectually impressive, and uncrossable. Tatkin (PACT) identifies the "island" variant here: not cold withdrawal but warm intellectual engagement that serves the same distancing function — your partner feels entertained and educated and still, somehow, alone. Gottman's Love Maps concept applies: your partner may know your intellectual landscape in exquisite detail (your ideas, your interests, your philosophies) and have almost no map of your emotional terrain (your fears, your longings, your vulnerabilities). They experience a fascinating conversationalist who becomes unreachable at the emotional level. They may feel like they know your mind but not your heart. The gap between how open you are about ideas and how closed you are about feelings is confusing and sometimes lonely for them — like being married to a brilliant book that never opens its last chapter.`,
        simple: `Open mind. Closed heart. You explore everything except your own feelings. This week, when someone asks how you are, skip the analysis and say something real. "I'm scared." "I'm lonely." "I don't know." That's the territory you haven't explored yet.`,
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
        therapeutic: `When anxiety drives conflict through forcing, the mechanism is precise and well-documented. EFT (Sue Johnson) identifies this as the "protest" side of the pursue-withdraw cycle: your attachment system reads distance as danger and responds with escalation. Gottman's research identifies this as the criticism pathway — not cruelty, but desperate urgency: "If I can make them understand how badly this hurts, they'll change." Polyvagal theory (Porges) maps the physiology: your sympathetic nervous system mobilizes for action (fight mode) in response to perceived attachment threat — your body is literally in survival mode, flooding with cortisol and adrenaline, and the neocortex (rational thinking) goes offline. In IFS (Schwartz), a Firefighter part responds to the Exile's terror of abandonment by escalating: "If I'm loud enough, intense enough, urgent enough, they can't ignore me." The Firefighter's intention is protection; its impact is destruction. Schema Therapy (Young) reveals the Abandonment schema activating the Overcompensation mode — instead of collapsing (the Surrender mode), you ATTACK the threat. DBT (Linehan) would identify the emotion regulation deficit: you lack the skill of "opposite action" — when your emotion says "pursue harder," the wise response is often "step back and soften." ACT (Hayes) targets the fusion between the thought ("they're leaving") and the behavior (escalation) — creating space between trigger and response. AEDP (Fosha) would access the primary emotion underneath: not anger but terror. When the terror is reached, the forcing dissolves. The literature recommends regulation before enactment — your body needs to return to baseline before your words can land.`,
        soulful: `There is an archetype that Jung would recognize in your pattern: the Abandoned Child armed with the Warrior's sword — a devastating combination of vulnerability and violence. Your Shadow is not the rage. Your Shadow is the grief underneath it. The rage is the Persona's attempt to protect the grief from being seen. As James Hillman wrote: "The soul has no interest in remedy; it desires an experience of depth." Your forcing is the remedy. The depth — the trembling, aching need that drives the forcing — is what your soul is trying to bring to the surface.

Your love is loud. When the distance between you and your partner grows, something ancient rises — not anger exactly, more like urgency. A desperate need to close the gap RIGHT NOW. As if the gap will swallow you. As if silence is the language of leaving. Clarissa Pinkola Estes wrote: "The doors to the world of the wild Self are few but precious. If you have a deep scar, that is a door." Your scar — the one that equates distance with danger — is a door. But you are using it to charge through rather than to see through.

Ecopsychologically, you are the wildfire — born from the friction of dryness and spark, moving with terrifying speed, consuming everything in your path to reach the other side. But fire in the forest is not always destruction. Controlled burns clear deadwood and nourish the soil. The same fire, held within borders, becomes warmth. As Rumi wrote: "Set your life on fire. Seek those who fan your flames." Your partner cannot fan flames that burn them.

David Whyte wrote: "Anger is the deepest form of compassion, for another, for the world, for the self, for a life, for the body, for a family and for all our ideals, all vulnerable and all, possibly about to be hurt." Your anger IS compassion — for the connection you're terrified of losing. The same message, at half the volume, would reach them. Your heart doesn't need to be quieter. Your delivery does.`,
        practical: `THE PATTERN: Anxiety detects distance → forcing escalates the approach → partner retreats from intensity → distance grows → anxiety spikes → repeat. James Clear calls this a "doom loop": the behavior designed to solve the problem makes the problem worse.

THIS WEEK (ONE micro-step): When you feel the urge to press your point, replace the statement with a question: "I'm scared we're disconnecting. Can we slow down?" Same need, no force. That's your atomic habit.

HABIT STACK (BJ Fogg): After I notice the urge to escalate (voice rising, body leaning forward, words speeding up), I will take one breath and translate my anxiety into vulnerability: "I'm feeling scared right now" instead of "You always do this."

THE BOLD ASK: Tell your partner (during a calm moment, NOT during conflict): "When I get intense, I'm usually scared underneath. I know it comes out as pressure. Can we create a signal for when my volume is too high? Something that reminds me to soften without shutting me down?"

Stages of change: If you've recognized the pattern, you're in Contemplation. The "replace statement with question" practice = Action. Prochaska's model predicts relapse: you WILL escalate again. The practice isn't perfection — it's catching yourself faster each time. BJ Fogg: celebrate the catch, not the perfection.`,
        developmental: `Forcing under anxiety represents a strategy from environments where the loudest need got met — Erikson's Trust vs. Mistrust resolved through volume rather than reliability. In Kegan's framework, your relational self is operating from the Imperial Mind (Order 2): "My needs are urgent and your job is to meet them." Your cognitive self may be at Order 3 or 4, which creates the shame cycle: you can SEE what you're doing (Order 4 observation) but can't STOP doing it (Order 2 reactivity). Wilber's Integral model identifies this as a "state regression" during stress: your typical center of gravity drops 1-2 stages under threat, with Green sensitivity collapsing to Red impulsivity. Spiral Dynamics maps the regression: from Green (sensitive to relational impact) to Red (immediate gratification of the need to be heard) in seconds. Carol Gilligan's framework applies: your care orientation (real, deep, genuine) is expressed through a justice orientation vocabulary ("You SHOULD listen to me, you OWE me attention") — the care underneath is invisible because the delivery is coercive. The developmental move: discovering that your adult partner responds to vulnerability, not volume. That vulnerability IS strength at Order 4, and expressing the fear beneath the fury is the act that shifts the entire dynamic.`,
        relational: `In Buber's I-Thou, genuine encounter requires receptivity — the willingness to be affected by the other. Your forcing eliminates receptivity from the interaction: you are broadcasting, not encountering. Hendrix's Imago model identifies the core dynamic: your partner triggers your deepest attachment wound, and your forcing is the "adaptations to childhood wound" that Hendrix describes — a survival strategy that made sense in the original context but devastates the adult relationship. Tatkin (PACT) maps this as a "wave" in pursuit mode: your energy rolls toward your partner with such force that their nervous system reads it as threat, not love. Their autonomic response: fight back (escalation) or flee (withdrawal). Neither brings connection. Gottman's research on "harsh startup" is definitive: conversations that begin with criticism or urgency predict negative outcomes 96% of the time. Your partner experiences your anxiety-driven forcing as attack. They can't hear the love underneath the volume. They hear: criticism. Pressure. Demand. What they need — what would actually let your love land — is the sentence underneath the shout: "I'm scared right now" instead of "You always do this." That one translation — from accusation to vulnerability — rewires the pursue-withdraw cycle at its source.`,
        simple: `When you're scared of losing someone, you yell louder. But loud love deafens. Same heart, half the volume. Next time you want to press, try: "I'm scared we're disconnecting." Watch what happens.`,
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
