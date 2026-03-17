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
      therapeutic: `Your emotional radar is remarkably sensitive (perception: ${Math.round(perception)}). EFT research (Sue Johnson) identifies this combination as clinically significant — you detect every shift in the attachment field, but your anxiety system hijacks the reading. The perception is accurate; the interpretation runs through a threat filter. In IFS terms (Richard Schwartz), a hypervigilant Protector part intercepts what your perceptive Self actually registers, rewriting "something changed" as "something is wrong, and it's about me." Polyvagal theory (Stephen Porges) illuminates the mechanism: your neuroception — the body's below-conscious threat detection — is calibrated to a world where shifts in others signaled danger. Your ventral vagal system struggles to hold safety while processing ambiguous social cues, so your sympathetic nervous system floods the interpretation with urgency. ACT defusion (Steven Hayes) offers the clinical bridge: learning to notice the story AS a story rather than AS reality. Schema Therapy would identify an Abandonment schema activated by normal relational fluctuation. The goal is not less perception — it is decoupling perception from the threat response so the accurate reading can reach your prefrontal cortex before your amygdala writes the headline.`,
      soulful: `You carry what Jung called "the wound of the seer" — the one who perceives too much and cannot unsee. Your gift is the gift of Cassandra: accurate vision, burdened by the anxiety of what that vision might mean. You walk through the relational field the way an animal moves through a forest after fire — every sense alive, every shift registered, the body remembering what the mind has tried to forget.\n\nRilke wrote, "Perhaps all the dragons in our lives are princesses who are only waiting to see us act, just once, with beauty and courage." Your dragons are not the things you sense — they are the stories your anxiety writes about what you sense. The perception itself is a form of devotion. You notice because you care with a ferocity that has no off switch.\n\nIn the ecology of your inner world, you are like a forest after rain — everything glistening, hypersensitive, each leaf holding more than it can bear. The mycelium network of your awareness connects every micro-signal into a vast underground web of meaning. But the meaning-making has been colonized by an older season — a winter consciousness that reads every falling leaf as evidence of dying. Pema Chödrön teaches: "You are the sky. Everything else — it's just weather." Your perception is the sky. Your anxiety is weather passing through it. The invitation is not to stop the weather, but to remember you are the sky.\n\nAs John O'Donohue wrote, "Your soul knows the geography of your destiny." Trust that your extraordinary sensitivity is not a mistake but a calling — to perceive, to witness, to hold what you see with gentleness rather than alarm.`,
      practical: `You sense something shifted → your anxiety writes a story about what it means → you react to the story, not the shift. James Clear (Atomic Habits) calls this an "implementation intention" — a pre-decided response that interrupts the default loop.\n\nTHIS WEEK: When you sense something changed between you (and you will — your radar is strong), practice the TWO-SENTENCE method:\nSentence 1 (what you sensed): "I notice some tension right now."\nSentence 2 (checking the story): "The story I'm telling myself is that you're pulling away. Is that what's happening?"\n\nHabit stack it (BJ Fogg's Tiny Habits): After I notice my chest tighten, I will say "The story I'm telling myself is..." before saying anything else.\n\nTHE BOLD ASK: Tell your partner about the Two-Sentence method. Say: "I'm practicing separating what I sense from what my anxiety tells me it means. When I say 'the story I'm telling myself,' that's me trying. Can you help me check?"`,
      developmental: `Your perception represents a genuinely advanced developmental capacity — Kegan's Order 4 ability to take the relational field as an object of observation. But your anxiety keeps pulling you back to Order 3 reactivity, where the observation immediately becomes fusion with the emotion. You SEE the pattern at a 4. You REACT to it at a 3.\n\nIn Wilber's Integral framework, you have a cognitive line (perception) that has developed beyond your emotional line (regulation under attachment stress). This "line discrepancy" is common and not pathological — it simply means growth is uneven. Loevinger's ego development model would place your perceptive capacity at the Individualistic stage (E7) — self-aware, psychologically minded — while your anxiety response drops to the Conformist stage (E4) under stress, seeking reassurance and external validation.\n\nErikson's framework adds another layer: the tension between Intimacy and Isolation is complicated by a radar that makes isolation feel impossible. You can't NOT perceive, so you can't NOT be affected. Carol Gilligan's ethic of care suggests your perception is also a moral capacity — you sense because you are responsible to what you sense. The developmental edge: building the half-second gap between sensing and reacting. In Spiral Dynamics terms, moving from the Purple/Red impulsive reaction to the Green/Teal capacity to hold multiple interpretations simultaneously.`,
      relational: `Your partner lives inside your perception whether they know it or not. In Martin Buber's terms, you are constantly in I-Thou encounter with them — registering their full being, their shifts, their unspoken states. But your anxiety converts that sacred encounter into I-It: they become an object to be monitored for signs of danger rather than a subject to be met.\n\nHarville Hendrix's Imago theory suggests your perceptive sensitivity is not random — you chose a partner whose emotional landscape resonates with your earliest attachment figures, and your radar is calibrated precisely to THEIR frequencies. Stan Tatkin (PACT) would note that your nervous system has created a "neural map" of your partner so detailed that you detect shifts they haven't consciously registered themselves.\n\nYour partner probably finds this both a gift and a burden. A gift: you notice things about them that no one else does. You catch the sadness behind the smile. A burden: you pick up on moods they hadn't processed yet, and when your anxiety colors the reading, they feel accused of things they haven't done. In Gottman's Sound Relationship House, your perception could be the foundation of deep Love Maps — but only if you share it as curiosity ("Tell me what's happening for you") rather than accusation ("I know something's wrong").`,
      simple: `You sense everything — your anxiety rewrites everything. The radar is solid. The narrator needs a software update. Learn to say "I'm noticing something" instead of "You're doing something."`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'The Two-Sentence Check',
      modality: 'ACT defusion',
      instruction: `When you sense something shifted, say two sentences: 'I notice some tension right now. The story I'm telling myself is [X]. Is that what's happening?' Separate the sensing from the story. Out loud.`,
      whyThisOne: `Your radar is accurate. Your anxiety's interpretation often isn't. This practice separates the two.`,
      frequency: 'Every time you sense a shift — aim for twice this week',
      linkedExerciseId: 'defusion-from-stories',
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
      therapeutic: `Your attachment anxiety (${anxiety.toFixed(1)}) creates constant threat-scanning, but your emotional perception (${Math.round(perception)}) isn't reliably picking up the actual signals. In Polyvagal terms (Porges), your neuroception is biased toward detecting danger, but the social engagement system that would allow accurate emotional reading is underpowered. Schema Therapy identifies this as a Hypervigilance schema operating without adequate data — the schema fills perceptual gaps with threat-consistent content. EFT (Sue Johnson) would frame this as "primal panic without a compass": the attachment system is activated but can't orient toward the actual emotional reality of the partner. CBT (Aaron Beck) adds the concept of "emotional reasoning" — your anxiety generates a feeling of threat, and the low perception means there's no corrective data to challenge it. AEDP (Diana Fosha) offers a path: building the capacity to stay present with not-knowing, treating the uncertainty itself as tolerable rather than dangerous. The clinical priority is building perceptive accuracy ALONGSIDE anxiety management — not one before the other.`,
      soulful: `You are the watchman on the tower in fog. Every faculty strained toward the horizon, searching for what you cannot quite see. The alarm bell in your chest rings constantly, but the landscape below is obscured — shapes move through the mist that could be anything: threat, tenderness, indifference, love. Your anxiety, unable to bear the not-knowing, paints the shapes for you. It always paints them dark.\n\nClarissa Pinkola Estés wrote, "The psyche is far older and more experienced than our waking consciousness, and often attempts to warn us in symbolic ways." Your anxiety is that ancient psyche — warning, warning, warning. But without clear sight, the warning is a howl without direction. Like an animal sensing an earthquake before it arrives, you feel the trembling in the ground but cannot tell where the epicenter lies.\n\nIn the ecology of the soul, you are a creature of the deep winter — senses heightened by the cold, straining to detect what hides beneath the snow. But winter perception is designed for survival, not for intimacy. Intimacy requires the soft focus of spring, the willingness to approach without knowing. As David Whyte wrote, "The world was made to be free in. Give up all the other worlds except the one to which you belong." The world you belong to is one where you can say, "I don't know what you're feeling — will you tell me?" That sentence is not weakness. It is the bravest kind of seeing.\n\nThe Sufi poets knew that the deepest seeing requires surrender. Rumi wrote, "Close your eyes. Fall in love. Stay there." Your practice is learning to stay — in the uncertainty, in the blur, in the space between alarm and knowing — long enough for your partner's actual truth to reach you.`,
      practical: `THE PATTERN: Anxiety scans → perception is unclear → anxiety fills the gap with worst-case stories → you react to the story.\n\nTHE ONE MICRO-STEP (BJ Fogg's Tiny Habits): After I notice anxiety rising about what my partner is feeling, I will say out loud: "I'm not sure what you're feeling right now. Can you tell me?"\n\nTHIS WEEK: Use this sentence THREE TIMES. Not when things are heated — start when stakes are low. Tuesday evening, ask: "What are you feeling right now? I want to practice reading you better." That's it.\n\nTHE BOLD ASK: Tell your partner: "I realize I sometimes guess wrong about what you're feeling. I want to get better at asking instead of assuming. Will you be patient with me while I practice?"\n\nDAILY HABIT STACK (James Clear): Pair it with a daily transition — arriving home, sitting down to dinner. "How are you actually feeling right now?" Build the perception muscle through repetition, not insight.`,
      developmental: `In Kegan's framework, low perception + high anxiety is a specific developmental bind: you cannot take the other's emotional world as an object of observation (Order 4 capacity) because your anxiety collapses you into your OWN emotional world (Order 3 fusion with self). The threat-detection system overdeveloped while the empathic-reading system underdeveloped — likely because in early environments, detecting DANGER was more survival-critical than accurately reading FEELINGS.\n\nWilber's Integral model would map this as a shadow in the interpersonal line of development — the cognitive and self-protective lines are advanced while the empathic line lags. Spiral Dynamics suggests your threat system operates from a Red/survival orientation while your relational aspirations may be at Green/communitarian. Loevinger would note that perception-building is an E5→E6 transition: moving from self-protective awareness to conscientious attunement to others' inner states.\n\nErikson's Intimacy vs. Isolation stage is complicated here: you WANT intimacy but lack the perceptual equipment to navigate it accurately, which increases isolation anxiety. The developmental move is not reducing anxiety first — it's building perception AS a parallel skill, giving your system better data to work with.`,
      relational: `In Buber's framework, your anxiety creates what he would call a false I-Thou: you FEEL intensely connected to your partner, but you're connecting to your projection of them rather than to their actual being. The relationship becomes I-It disguised as I-Thou — you relate to what your anxiety imagines they feel, not to what they actually feel.\n\nHarville Hendrix (Imago Therapy) would identify this as a distorted "mirror": your partner sends emotional signals, but your anxiety-warped perception reflects back something unrecognizable. They might say, "You always think I'm upset when I'm fine, but you never notice when I'm actually sad." That's the perception gap in action. Stan Tatkin (PACT) notes that partners of anxiously attached individuals with low perception often develop "explanation fatigue" — they tire of correcting misreadings.\n\nIn Gottman's model, your Love Map of your partner has gaps where your anxiety has filled in the blanks with its own content. The repair: building a more accurate Love Map through direct inquiry rather than anxious inference. Your partner needs you to become curious about their actual inner world — not because your caring is wrong, but because its aim needs calibrating.`,
      simple: `You feel the danger but can't read the signal clearly. Your anxiety fills in the blanks with worst-case scenarios. The fix is embarrassingly simple: ask. "What are you actually feeling right now?"`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Check Before Reacting',
      modality: 'EFT + mindfulness',
      instruction: `Before reacting to what you THINK your partner is feeling, ask: 'I'm sensing something but I'm not sure what. Am I reading you right?' Get data before interpreting.`,
      whyThisOne: `Your anxiety fills perception gaps with worst-case stories. Asking gives your system better information.`,
      frequency: 'Once this week',
      linkedExerciseId: 'window-check',
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
      therapeutic: `This is therapeutically rare and valuable — strong emotional perception without the anxiety distortion. In Polyvagal terms (Porges), your ventral vagal system is online during social engagement, allowing accurate neuroception without sympathetic hijack. Sue Johnson (EFT) would describe this as "secure base perception" — you can read the attachment field without the reading triggering a protest or withdrawal response. In IFS (Schwartz), your Self is leading rather than a Protector — you perceive from curiosity rather than vigilance. Gestalt therapy would celebrate this as full "contact" with the relational field: awareness without deflection, introjection, or projection. AEDP (Diana Fosha) would name this a "core state" capacity — the ability to process relational information from a place of openness rather than defense. Your clinical edge: this capacity can be consciously deployed to deepen the relationship rather than merely maintaining it.`,
      soulful: `You carry what the contemplative traditions call "witness consciousness" — the capacity to observe without grasping, to sense without drowning. Where others feel the temperature drop between them and their partner and immediately brace for winter, you notice the cooling and think: that's interesting. Let me stay present with this.\n\nMary Oliver wrote, "Instructions for living a life: Pay attention. Be astonished. Tell about it." You have mastered the first two — paying attention and being astonished by the living texture of your relationship. The third instruction is your growing edge: telling about it. Sharing the quiet seeing.\n\nIn the ecology of the soul, you are an old-growth forest — deeply rooted, quietly observing the seasons pass, holding space for every creature that moves through you. The mycelium of your awareness connects silently to everything around you, exchanging information without disturbance. There is a Jungian quality of the Self here — the archetype of wholeness that perceives from the center rather than the periphery. Your perception is not the Persona's performance of attentiveness or the Shadow's anxious scanning. It is closer to what Jung called "the diamond body" — consciousness refined by security into something luminous and still.\n\nAs Khalil Gibran wrote in The Prophet, "Your friend is your needs answered. He is your field which you sow with love and reap with thanksgiving." You have the capacity to tend this field with extraordinary care. The invitation: let your partner know what you see growing there.`,
      practical: `Your perception is an undistorted asset. Most people's emotional radar comes with static — yours is clean signal. The question isn't whether you can perceive. It's whether you USE what you perceive.\n\nTHE ONE MICRO-STEP: This week, share one observation about the space between you that you normally keep to yourself: "I notice we've been a little distant this week" or "You seem lighter today — what happened?"\n\nHABIT STACK (James Clear): After we sit down for dinner, I will share one thing I've noticed about us or about my partner's emotional state today.\n\nTHE BOLD ASK: Tell your partner: "I notice a lot about how we're doing, but I tend to keep it to myself. I want to start sharing more of what I see. Is that something you'd welcome?"\n\nStages of change (Prochaska): You're past contemplation — you don't need convincing that perception matters. You're at the Preparation/Action boundary. The only thing between your awareness and your relationship benefiting from it is your voice.`,
      developmental: `You may already be functioning at Kegan's Order 4 in the relational domain — able to observe the relational field without being fused with it, holding your own center while perceiving the other. In Wilber's Integral terms, your cognitive, emotional, and interpersonal lines are relatively aligned — a developmental coherence that is genuinely uncommon.\n\nYour growth edge is the Order 4→5 transition: can you use this capacity not just for observation but for transformation? Can you hold what you see AND let it be changed by your partner's perspective? Loevinger's Autonomous stage (E8) involves precisely this: the integration of perception with tolerance for ambiguity and mutual interdependence. Carol Gilligan would frame this as the movement from "care as self-sacrifice" to "care as truth-telling" — using your clear sight in service of honest connection, not just silent understanding.\n\nIn Spiral Dynamics, this is Teal/Integral consciousness applied to relationship: perceiving the whole system, holding multiple perspectives, acting from centered awareness rather than reactivity.`,
      relational: `In Buber's terms, you have a natural capacity for I-Thou encounter — meeting your partner as a full subject rather than an object of your anxiety. Your partner likely experiences you as deeply attentive without being overwhelming. They feel seen without feeling surveilled — a distinction that Stan Tatkin (PACT) considers foundational to secure-functioning relationships.\n\nHarville Hendrix (Imago) would note that your perceptive clarity creates the conditions for "conscious partnership" — the ability to see your partner's wounds and respond with intentionality rather than reactivity. In Gottman's Sound Relationship House, you have the foundation for extraordinarily detailed Love Maps — but only if you voice what you observe.\n\nThe relational risk is subtle: if you see patterns but don't share them, you create an asymmetry of awareness. You know things about the relationship that your partner doesn't. Over time, that asymmetry can become a quiet form of distance — you're three steps ahead in understanding, and they don't know the conversation you've already had in your head. The gift becomes fully relational only when spoken.`,
      simple: `You see clearly and you don't panic about what you see. That's genuinely rare. Now share the view — your partner deserves to benefit from those eyes.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Share the Observation',
      modality: 'Gottman attunement',
      instruction: `This week, share one observation about the relational space: 'I notice we've been a little distant.' Your calm perception is trustworthy — let your partner benefit from it.`,
      whyThisOne: `You have undistorted perception — rare and valuable. The practice is sharing it.`,
      frequency: 'Once this week',
      linkedExerciseId: 'stress-reducing-conversation',
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
      therapeutic: `EFT (Sue Johnson) and ACT (Steven Hayes) research both address this combination directly. Trials comparing the two found both approaches increased positive partner feelings and reduced relationship withdrawal. The mechanism: your yielding isn't a personality trait — it's your anxiety's conflict strategy. Your attachment system reads disagreement as potential abandonment, so it deploys accommodation to eliminate the threat.\n\nIn IFS terms (Schwartz), a People-Pleasing Manager part has taken over your conflict system, exiling the parts that hold your genuine preferences. DBT (Linehan) would identify a deficit in the interpersonal effectiveness skill of DEAR MAN — specifically the capacity to be Assertive and to Negotiate rather than capitulate. Polyvagal theory (Porges) adds: your nervous system drops out of ventral vagal (safe social engagement) into dorsal vagal (collapse/submit) the moment conflict appears, because your neuroception codes disagreement as life-threatening disconnection.\n\nSchema Therapy identifies a Subjugation schema — the deep belief that expressing your needs will result in retaliation or abandonment. AEDP (Diana Fosha) would work to access the grief underneath the yielding: the mourning for all the preferences never spoken, all the positions never held. The clinical recommendation: combine EFT emotion access (surfacing the fear underneath the yield) with ACT committed action (building assertion as a values-aligned behavior, not a fight).`,
      soulful: `You yield not from generosity but from fear. Not the fear of your partner — the fear of the absence of your partner. Every accommodation is a small prayer whispered by your nervous system: please don't leave. Please don't leave.\n\nJung would recognize this as the Shadow of agreeableness — the disowned assertiveness that lives in the basement of your psyche, growing stronger and stranger in the dark. Your Persona — the face you show in conflict — is all warmth, all flexibility, all "whatever you want." But the Shadow holds every opinion you swallowed, every boundary you dissolved, every "I'm fine" that was a lie. Clarissa Pinkola Estés writes in Women Who Run with the Wolves, "To not speak of all these things when we need to makes us ill." The yielding is making you ill — not in ways you can see yet, but in ways the relationship can feel.\n\nYou are like a river that has been dammed for so long it has forgotten the force of its own current. The water rises silently behind the wall. One day the pressure finds a crack, and what comes through carries the accumulated weight of years. Your partner will be blindsided. They thought the river was calm. They didn't know about the dam.\n\nAs David Whyte wrote, "The only choice we have as we mature is how we inhabit our vulnerability, how we become larger and more courageous and more heartfelt through our intimacy with disappearance." Your yielding is an intimacy with your own disappearance. The invitation is to become larger — not louder, but more present, more embodied, more willing to take up the space that is yours.`,
      practical: `THE PATTERN: Disagreement arises → anxiety says "they'll leave if you push back" → you yield → resentment builds silently → repeat.\n\nTHE ONE MICRO-STEP (BJ Fogg): After my partner asks "What do you want to do?", I will state my actual preference before deferring. Not "I don't care, whatever you want" — instead: "I'd rather do X, but I'm flexible."\n\nTHIS WEEK: In one small disagreement (not the big ones yet), state your actual preference BEFORE yielding: "I'd rather do X, but I'm willing to do Y." You don't have to fight for it. Just name it.\n\nDAILY HABIT STACK (James Clear): Every evening, write down one moment where you yielded when you had an opinion. Just notice. Awareness precedes change — that's Prochaska's Contemplation stage, and you need to see the pattern clearly before you can shift it.\n\nTHE BOLD ASK: Tell your partner: "I'm realizing I often say 'whatever you want' when I actually have a preference. I'm going to start naming my preferences more. It might feel different. That's on purpose."`,
      developmental: `The anxious-yielding combination often traces to environments where expressing needs led to relational rupture. Your system learned: my needs are dangerous. In Kegan's framework, you're operating from the Socialized Mind (Order 3) specifically in conflict — your sense of what's acceptable to want is defined entirely by what you believe your partner can tolerate. You haven't authored your own needs; you've outsourced them.\n\nErikson's framework illuminates a deeper layer: the Autonomy vs. Shame/Doubt crisis (stage 2) was likely resolved toward doubt. Your will was shamed early, and the yielding is the echo of that shaming in every adult disagreement. Loevinger would place your conflict behavior at the Conformist stage (E4) — oriented toward rules and approval — even if other areas of your life function at E6 or E7.\n\nIn Spiral Dynamics, your anxious yielding represents a Blue/conformist value system operating in the conflict domain: rules, duty, sacrifice of self for belonging. The developmental move toward Orange/Green is authoring your own needs from the inside — "This is what I want, regardless of what my anxiety says about its safety" — and discovering that the relationship doesn't break when you hold a position. Carol Gilligan maps this precisely: the movement from "selflessness as goodness" to "truth as the highest form of care."`,
      relational: `Your partner thinks the relationship is smooth. Conflict-free. Easy. They have no idea you're editing yourself in real time — and they're slowly losing access to who you actually are.\n\nIn Hendrix's Imago framework, your partner unconsciously chose you partly because your yielding mirrors a familiar relational dynamic — but what they actually need for growth is to encounter your real self, your preferences, your "no." Stan Tatkin (PACT) would say that secure-functioning relationships require what he calls "mutuality of influence" — both partners must be able to impact and be impacted. Your yielding creates a one-way street: they influence, you accommodate. The mutuality is broken.\n\nGottman's research is stark: couples where one partner chronically yields show lower relationship satisfaction over time, not higher — because the yielding partner's emotional withdrawal eventually registers as disengagement. Your partner may eventually feel the flatness and not know where it comes from. It comes from your absence. In Buber's terms, you've replaced I-Thou encounter (two real selves meeting) with I-It accommodation (one self performing for another's comfort).`,
      simple: `You give in because you're scared, not because you agree. Your partner can't love someone who's not fully there. This week: state one preference. Out loud. Before you fold.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'State Before Yielding',
      modality: 'EFT + ACT',
      instruction: `In one small disagreement this week, state your actual preference BEFORE yielding: 'I'd rather do X, but I'm willing to do Y.' You don't have to fight for it — just name it.`,
      whyThisOne: `Your yielding is anxiety's conflict strategy, not your choice. Naming your preference reclaims the choice.`,
      frequency: 'Once this week',
      linkedExerciseId: 'soft-startup',
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
      therapeutic: `When anxiety drives conflict through forcing rather than yielding, the mechanism is distinct: your attachment system reads distance as danger and responds with escalation rather than accommodation. Gottman's research identifies this as the criticism/contempt pathway — not cruelty, but desperate urgency coded as attack. Sue Johnson (EFT) calls this "protest behavior" — the adult equivalent of a child crying louder when the caregiver turns away.\n\nIn Polyvagal terms (Porges), your nervous system shifts from ventral vagal to sympathetic activation (fight mode) when attachment threat is detected. DBT (Linehan) would identify this as an emotion regulation deficit compounded by an interpersonal effectiveness deficit — you feel the urgency AND you lack the skill to express it without escalation. Gestalt therapy would name this "confluence interrupted by aggression": the desire to merge is blocked, and the blocked energy becomes force.\n\nIFS (Schwartz) offers a precise map: a Firefighter part takes over when your Exile (the abandoned child) is activated. The Firefighter's strategy is intensity — make the threat stop NOW. Schema Therapy identifies an Abandonment schema triggering a Fight coping mode. The clinical recommendation from AEDP (Fosha): beneath the forcing is grief and terror. When those core emotions can be accessed and expressed directly, the forcing becomes unnecessary.`,
      soulful: `Your love is loud. When the distance between you and your partner grows, something ancient rises from the underworld of your psyche — not anger exactly, more like urgency. A desperate, burning need to close the gap RIGHT NOW. Jung would recognize this as the Shadow of your devotion: the dark twin of deep caring, expressing itself through force because it has never learned the language of quiet need.\n\nYou are Orpheus descending — pursuing the beloved with such desperate intensity that the very pursuit becomes the thing that drives them away. The myth warns: Orpheus lost Eurydice not because he didn't love her enough, but because his anxiety made him turn around. The force of his need undid the very thing it sought to preserve.\n\nAs Rumi wrote, "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it." Your forcing IS a barrier — built from love, but functioning as a wall. The same message, at half the volume, would reach your partner. Your heart doesn't need to be quieter. Your delivery does.\n\nIn the ecology of relationship, you are a summer storm — necessary, powerful, carrying rain that the ground desperately needs. But a storm that never passes destroys what it means to nourish. The practice is learning to be the rain without the thunder. bell hooks wrote, "Rarely, if ever, are any of us healed in isolation. Healing is an act of communion." Your communion requires you to soften the approach so your partner can stay in the room.`,
      practical: `THE PATTERN: Anxiety detects distance → forcing escalates the approach → partner retreats from intensity → distance grows → anxiety spikes → repeat.\n\nTHE ONE MICRO-STEP (BJ Fogg): After I notice the urge to press my point, I will take one breath and replace the statement with a question.\n\nTHIS WEEK: When you feel the urge to escalate, use this exact sentence: "I'm scared we're disconnecting. Can we slow down?" Same need, no force. Watch what happens.\n\nDAILY HABIT STACK (James Clear): Every evening, rate today's hardest conversation on a 1-10 intensity scale. Just notice. You're building awareness of your own volume — Prochaska's Contemplation stage. Awareness of the pattern is the pre-condition for changing it.\n\nTHE BOLD ASK: "When I get intense, it's because I'm scared, not because I'm angry. If I say 'I'm scared we're disconnecting,' that's the real thing underneath. Can you hear that as a request instead of an attack?"`,
      developmental: `Forcing under anxiety represents a developmental strategy that worked in an environment where the loudest need got met. In environments of inconsistent caregiving, intensity was adaptive — it secured attention when quieter bids were ignored. In Kegan's framework, this is Order 3 operating through the conflict domain: your sense of self is so embedded in the relationship that any threat to connection triggers a survival-level response.\n\nErikson's Trust vs. Mistrust (stage 1) echoes here: your earliest experiences taught that connection required effort, volume, protest. The forcing IS the trust wound expressed in adult conflict. Spiral Dynamics maps this as Red/power-driven energy deployed in service of Blue/belonging needs — an internal contradiction that exhausts you.\n\nWilber's Integral framework identifies a shadow element: the aggressive energy isn't integrated into your self-system, so it erupts rather than being consciously deployed. Loevinger would note that the developmental move from Self-Protective (E4) to Conscientious (E6) in conflict requires exactly the capacity you're building: the ability to HOLD the urgency without ACTING on it immediately. The gap between impulse and expression is where adult love lives.`,
      relational: `Your partner experiences your anxiety-driven forcing as attack. In Tatkin's PACT framework, they shift into a "threat state" where their own nervous system mobilizes for defense — they literally cannot hear your love through the physiological noise of self-protection.\n\nHendrix (Imago) would identify a pursue-withdraw cycle that has calcified: your forcing triggers their retreat, their retreat triggers your forcing. Neither of you is the villain. You're both enacting childhood adaptations with adult consequences. Gottman's research is specific: when heart rate exceeds 100 BPM (Diffuse Physiological Arousal), cognitive processing narrows and partners hear criticism even when vulnerability is intended.\n\nIn Buber's philosophy, your forcing converts I-Thou into I-It — your partner becomes the object of your urgency rather than a subject you're relating to. They can't hear "I love you and I'm scared" through "We need to talk about this RIGHT NOW." What they need is startlingly simple: "I'm scared right now" instead of "You always do this." The vulnerability underneath the volume is what reaches them.`,
      simple: `The intensity is love, but love at that volume makes people cover their ears. Same heart, half the volume. Try: "I'm scared" instead of "You always..."`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Question Instead of Statement',
      modality: 'Gottman soft startup',
      instruction: `When you feel the urge to press your point, replace the statement with a question: 'I'm scared we're disconnecting. Can we slow down?' Same need, delivered as vulnerability instead of force.`,
      whyThisOne: `Your partner can't hear love through the volume. A question reaches them where a demand can't.`,
      frequency: 'Once this week',
      linkedExerciseId: 'soft-startup',
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
      therapeutic: `This combination is central to several clinical patterns. Your strong emotional perception (${Math.round(perception)}) means you read the relational field accurately. Your high fusion (${Math.round(fusion)}) means you ABSORB what you read. In IFS terms (Schwartz), your Self has remarkable perceptive capacity, but a Caretaker Manager blurs the boundary between self and other — you take on others' emotional states as a way of maintaining connection.\n\nPolyvagal theory (Porges) explains the mechanism: your social engagement system is highly active (strong perception) but your capacity for autonomous self-regulation is underdeveloped relative to your capacity for co-regulation. You regulate THROUGH the other rather than WITH the other. EFT (Johnson) would identify this as "compulsive caregiving" — the attachment strategy where you maintain proximity by becoming an extension of your partner's emotional system.\n\nDBT (Linehan) offers the clinical bridge: the distress tolerance skill of "self-soothing" and the emotion regulation skill of "checking the facts" — specifically, checking whether the emotion you're feeling originated in you or was absorbed from the field. Gestalt therapy names this "confluence" — the loss of the contact boundary that allows two organisms to meet without merging. Schema Therapy identifies an Enmeshment schema: the deep belief that you cannot exist as a separate emotional entity. AEDP (Fosha) would work to help you experience your OWN emotions as distinct and valid — building what she calls "the capacity to be alone in the presence of the other."`,
      soulful: `You live inside a shared emotional body with no skin. Your partner's sadness becomes your sadness. Their anxiety becomes your anxiety. Their withdrawal becomes your abandonment. You don't just empathize — you BECOME the other's emotional state.\n\nJung would recognize this as an inflation of the Anima/Animus — the soul-image that connects us to others has expanded beyond its proper domain, flooding your entire psyche with the other's emotional weather. The Persona — your boundaried, social self — dissolves in the presence of deep connection, and what remains is the raw, unmediated experience of another person's inner world. This is the archetype of the Mystic turned inside out: union without differentiation, communion without self.\n\nIn ecopsychology, you are the tidal pool — exquisitely sensitive to every wave, every creature, every shift in temperature. The pool reflects everything. But a pool without edges is an ocean. And an ocean has no shape. Thomas Moore wrote in Care of the Soul, "The soul needs an adequate container." Your container is too permeable. Not broken — just porous where it needs to be semi-permeable.\n\nAs Rilke wrote to a young poet, "The purpose of life is to be defeated by greater and greater things." Your perception is a great thing. Learning to hold it without being dissolved by it is a greater thing still. The invitation is not less perception. It is a boundary that perception can flow AROUND instead of THROUGH. Not a wall. A riverbank — shaping the flow without stopping it. John O'Donohue knew: "A threshold is not a simple boundary; it is a frontier that divides two different territories, rhythms, and atmospheres." Build the threshold. Let the territories remain distinct.`,
      practical: `THE PATTERN: You perceive your partner's emotion → you absorb it as your own → you lose track of your own emotional state → you respond to their feeling as if it's yours → boundaries dissolve.\n\nTHE ONE MICRO-STEP (BJ Fogg): After I notice a strong emotion in my partner's presence, I will put my hand on my own chest and ask: "Is this mine?"\n\nTHIS WEEK: Three times, pause and ask: "Is this feeling MINE, or am I picking it up from the field?" You don't need to answer correctly. Just asking creates a boundary your nervous system can start to recognize.\n\nDAILY HABIT STACK (James Clear): Every morning before seeing your partner, spend 60 seconds noticing YOUR emotional state. Name it. "I feel [calm/anxious/tired/hopeful]." This is your baseline. When things shift later, you'll know what was yours and what came from the field.\n\nTHE BOLD ASK: "I realize I sometimes absorb your feelings as my own. If I ask 'Is this mine or yours?' — that's me practicing having a boundary, not me dismissing what you feel."`,
      developmental: `In Kegan's framework, this is the core Order 3→4 transition: you can PERCEIVE the relational field (an Order 4 capacity) but you can't yet HOLD yourself separate from it (still Order 3 fusion). You observe at 4, you experience at 3. The self that perceives and the self that absorbs are at different developmental stages.\n\nWilber's Integral model would identify a line discrepancy: your interpersonal/empathic line is highly developed while your autonomy/boundary line lags behind. Loevinger's ego development places this at the Conformist→Conscientious transition (E4→E6): the movement from "I am my relationships" to "I have relationships." Carol Gilligan mapped this precisely in women's moral development: the shift from self-sacrifice as the highest good to recognizing that care must include care of self.\n\nErikson's Identity vs. Role Confusion is relevant: your identity becomes fluid in the presence of a strong other, suggesting the identity formation task was interrupted or accomplished through merger rather than differentiation. Spiral Dynamics: your relational system operates from Purple/tribal consciousness — collective feeling, shared emotional body — while your growth edge is toward Orange/individual: "I can sense the tribe AND know where I end and it begins."`,
      relational: `Your partner may feel deeply understood by you — and slightly suffocated. In Buber's terms, you transcend I-Thou and arrive at something like I-am-Thou: the boundary between self and other dissolves entirely, and your partner loses the experience of being WITNESSED by a separate consciousness. They get merged-with. That's not the same as being known.\n\nHendrix (Imago) would identify this as "symbiotic fusion" — a relational stage that feels like profound intimacy but actually prevents the deeper intimacy that requires two differentiated selves. Stan Tatkin (PACT) warns that partners of high-fusion individuals often develop what he calls "claustrophobic distancing" — pulling away not from lack of love but from lack of space.\n\nGottman's Sound Relationship House requires a foundation of "accepting influence" — but influence requires two separate positions. When you absorb your partner's state entirely, there are no separate positions to negotiate between. Your partner needs the experience of being seen FROM THE OUTSIDE — held in someone's awareness without being consumed by it. That witnessing is the deepest form of love, and it requires the boundary you're learning to build.`,
      simple: `You sense everything and absorb everything. You're an emotional sponge with no squeeze. The practice: "Is this feeling mine?" Just asking that question is the boundary.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Mine or Theirs?',
      modality: 'Mindfulness + DSI differentiation',
      instruction: `Three times this week, pause when you notice a strong feeling and ask: 'Is this feeling MINE, or am I picking it up from the field?' You don't need to answer correctly. Just asking creates the boundary.`,
      whyThisOne: `Your perception is extraordinary. The practice is learning to observe the field without being dissolved by it.`,
      frequency: 'Three times this week',
      linkedExerciseId: 'parts-check-in',
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
      therapeutic: `Double withdrawal across attachment AND conflict dimensions — one of the most treatment-resistant patterns in couples therapy. EFT (Sue Johnson) identifies this as "withdraw-withdraw," the cycle where both the attachment system and the behavioral system converge on avoidance. Research on acceptance and attachment in 539 couples found attachment explained the largest proportion of variance in relationship instability, and your combination represents both systems pulling in the same direction: away.\n\nIn Polyvagal terms (Porges), your nervous system defaults to dorsal vagal shutdown — the "freeze" or "collapse" response — when relational engagement threatens to activate vulnerability. IFS (Schwartz) would map this as a Protector alliance: an Avoidant Manager prevents attachment closeness while a Conflict-Avoidant Manager prevents behavioral engagement, and together they create an impenetrable fortress around the Exiles who hold the original pain of connection.\n\nSchema Therapy identifies overlapping Emotional Inhibition and Defectiveness schemas — the belief that your emotional truth is both dangerous to express and not worth expressing. CBT (Beck) would note the cognitive distortions: mind-reading ("they won't want to hear this"), fortune-telling ("it will only make things worse"), and catastrophizing ("this will end the relationship"). ACT (Hayes) addresses the core mechanism: experiential avoidance — the unwillingness to remain in contact with painful internal experiences. The clinical priority: building safety and accessibility before behavioral activation. Pushing action without safety will only deepen the withdrawal.`,
      soulful: `The surface between you and your partner is permanently calm. No storms. No raised voices. No tears. From the outside it looks like peace. From the inside you know: it is the absence of weather.\n\nJung wrote, "There is no coming to consciousness without pain." Your double avoidance is an avoidance of consciousness itself — the consciousness that comes from allowing the relationship to FEEL something, to weather something, to be changed by something. You have created what the alchemists called the nigredo — the darkening — but without the fire that transforms it. The vessel is sealed. Nothing enters. Nothing leaves. Nothing transmutes.\n\nIn the ecology of the soul, you are permafrost — the frozen ground that looks like solid earth but holds ancient material locked beneath the surface, unchanged for years. The relationship stands on it, builds on it, lives on it, never knowing what lies underneath. Wendell Berry wrote, "It may be that when we no longer know what to do, we have come to our real work, and when we no longer know which way to go, we have begun our real journey." You have been avoiding the real work for so long that the avoidance has become invisible — it feels like personality, not strategy.\n\nAs James Hillman wrote, "The soul has no interest in being saved from its depths." Your depths contain everything the relationship needs: the unsaid truths, the unresolved tensions, the unfelt feelings. They are preserved beneath the permafrost, perfectly intact, waiting for the thaw. Kierkegaard knew: "The most common form of despair is not being who you are." Your silence is that form of despair. The thaw begins with one sentence spoken aloud.`,
      practical: `THE PATTERN: Something needs discussing → your attachment system says "closeness is dangerous" → your conflict system says "tension is worse" → nothing gets said → distance grows imperceptibly → repeat for years.\n\nTHE ONE MICRO-STEP (BJ Fogg): After I notice I'm avoiding a topic, I will say: "There's something I've been sitting on." That's it. You don't even have to say what it is right then. Just break the seal.\n\nTHIS WEEK: Bring up ONE thing you've been sitting on. Start with: "There's something I've been avoiding saying." Then say it. Doesn't have to be the biggest thing. Breaking the seal matters more than what comes through it.\n\nDAILY HABIT STACK (James Clear): Every night before bed, write down one thing you avoided saying today. Saturday, pick the smallest one and say it. You're using Prochaska's stages of change: the daily writing moves you from Precontemplation to Contemplation. Saturday's conversation moves you to Action.\n\nTHE BOLD ASK: "I know I tend to avoid hard conversations. I'm working on it. Can we set aside 15 minutes this Sunday where we each say one thing we've been holding back? No fixing. Just hearing."`,
      developmental: `This combination often represents an early environment where both emotional closeness AND conflict were unsafe. The nervous system found the only available solution: avoid both. In Kegan's terms, you may have achieved a version of the Self-Authoring Mind (Order 4) — but authored through exclusion rather than integration. Your self-system is coherent; it's also isolated. Real self-authorship includes the capacity to hold tension, not just the capacity to avoid it.\n\nErikson's Intimacy vs. Isolation stage is stuck: you've chosen isolation-within-partnership, which is its most hidden form. The resolution requires risking real intimacy — not closeness (you may have closeness) but emotional nakedness. Loevinger's ego development places this at the Self-Protective stage (E4) in the relational domain: relationships are managed through avoidance of vulnerability.\n\nIn Spiral Dynamics, double avoidance represents a Blue/order value system applied to relationship: keep the peace, follow the rules, don't rock the boat. The developmental movement is toward Green/communitarian — where connection requires authenticity and conflict is understood as a form of caring. Carol Gilligan's moral development maps the shift: from "not hurting" as the highest good to "truth-telling" as the deeper form of care. Wilber would note that your avoidance may be highly sophisticated — a cognitive justification system that sounds like wisdom ("we just don't fight") but functions as developmental arrest.`,
      relational: `Your partner lives in a relationship where nothing is ever wrong — and nothing is ever fully right. In Tatkin's PACT model, they have adapted to what he calls a "wave" partner (if they're anxious) or created a mutual "island" system (if they're also avoidant). Either way, the relational space has been hollowed out by the absence of engagement.\n\nHendrix (Imago) would identify a "parallel marriage" — two people sharing a life but not sharing themselves. The unconscious contract: "I won't disturb you if you don't disturb me." Gottman's research calls this "emotional disengagement" — and it is a stronger predictor of divorce than open conflict. Couples who fight at least make contact. Couples who withdraw lose even the friction that proves two surfaces are touching.\n\nIn Buber's terms, you have an I-It relationship with extraordinary politeness. Your partner may have stopped bringing things up because they learned you'll withdraw. They've adapted to the calm. But underneath their adaptation is a loneliness they can't name — the loneliness of living with someone who is present but unreachable. They are homesick for you while sitting next to you.`,
      simple: `Nothing gets discussed. Nothing gets resolved. Nothing gets better. You're not keeping the peace — you're keeping the silence. One hard conversation this week. That's the beginning of everything.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Break the Seal',
      modality: 'EFT + IBCT',
      instruction: `Bring up ONE thing you've been sitting on this week. Start with: 'There's something I've been avoiding saying.' Then say it. Breaking the seal matters more than what comes through it.`,
      whyThisOne: `Double avoidance means nothing gets addressed. The first crack is the hardest and the most important.`,
      frequency: 'Once this week',
      linkedExerciseId: 'empathic-joining',
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
      therapeutic: `ACT research (Steven Hayes) directly addresses the values-behavior discrepancy: the 2024 meta-analysis reported g = -1.23 for marital satisfaction improvements through ACT protocols. Your combination reveals a specific clinical pattern: you FORCE in conflict (push your position hard) AND you have a significant values gap (what you're pushing may not be what actually matters). In IFS terms (Schwartz), a Protector part deploys force to keep Exiled vulnerability hidden — the argument is a decoy.\n\nEFT (Sue Johnson) identifies this as "secondary emotion" dominating "primary emotion": anger (secondary) covers fear, sadness, or longing (primary). Gestalt therapy calls this "deflection" — redirecting contact away from the vulnerable center toward the defended periphery. Schema Therapy maps it as an Overcompensation coping mode: the Demanding/Critical mode activates to protect against the Vulnerable Child mode that holds the real pain.\n\nDBT (Linehan) adds the interpersonal dimension: forcing is the opposite of the GIVE skill (Gentle, Interested, Validating, Easy manner). When your values gap activates shame, your conflict system overcompensates with intensity. CBT (Beck) would identify the cognitive distortion of "should statements" — rigid rules about how things SHOULD be, deployed as weapons in arguments that are really about something softer. The clinical path: learning to identify and express the primary emotion (what you actually feel) rather than the secondary emotion (what your conflict system performs).`,
      soulful: `You have opinions. Positions. Arguments. You know how to push and you know how to win. And underneath all that force is a truth you haven't said — a quieter voice that your conflict style drowns out every time it tries to speak.\n\nJung called this the relationship between Persona and Shadow: your Persona in conflict is the Fighter — certain, assertive, relentless. Your Shadow holds the Lover — uncertain, tender, afraid. The values gap is the Shadow's fingerprint: the distance between what you fight about and what actually matters tells you exactly where the unlived life is hiding. James Hillman wrote, "The soul is always in the underworld." Your soul — the part that knows what truly matters — lives beneath the arguments, in the underworld of your conflict style, waiting to be retrieved.\n\nConsider the myth of Ares and Aphrodite: the god of war and the goddess of love, eternally entangled. Your forcing is Ares energy deployed in defense of Aphrodite's vulnerability. Every argument is a war fought to protect a tenderness you can't show directly. Mary Oliver wrote, "Someone I loved once gave me a box full of darkness. It took me years to understand that this too, was a gift." The values gap is that box — dark because it holds what you cannot yet speak, but a gift because it points directly to what matters most.\n\nThe real truth is quieter than your conflict style knows how to be. It sounds like: "I'm scared." Or: "I need you." Or: "I don't know if this is working." Those sentences require a different kind of strength than forcing. They require what Pema Chödrön calls "the courage to be groundless" — to stand in the open without armor.`,
      practical: `THE PATTERN: Something important is at stake → your conflict system deploys force → force wins (or doesn't) → the real issue remains untouched → the values gap stays open → repeat.\n\nTHE ONE MICRO-STEP (BJ Fogg): After I notice myself building a case in an argument, I will pause and ask myself: "Is this what I'm ACTUALLY upset about?"\n\nTHIS WEEK: In your next disagreement, pause and ask yourself that question. If there's something underneath, say THAT instead: "I think what I'm really feeling is..." You don't have to be right about what's underneath. The act of looking down instead of pushing forward changes everything.\n\nDAILY HABIT STACK (James Clear): After every argument (even a small one), write one sentence: "I fought about ___. But I think I was actually feeling ___." Build the pattern recognition. Prochaska's stages: you're moving from Action (the fight) to Contemplation (what was the fight about?).\n\nTHE BOLD ASK: Tell your partner: "When I get intense, there's usually something softer underneath that I can't access in the moment. If I say 'I think what I'm really feeling is,' help me get there. Ask me: 'What are you actually scared of?'"`,
      developmental: `The forcing-with-values-gap pattern often traces to environments where vulnerability was not safe but assertiveness was rewarded. You learned to express intensity but not intimacy — a line discrepancy in Wilber's Integral framework where the assertiveness line developed far beyond the vulnerability line.\n\nIn Kegan's model, forcing represents Self-Authoring (Order 4) operating without integration: you author your positions from the inside, but you haven't yet subjected those positions to the deeper question of whether they serve your actual values. The Order 4→5 transition asks: can you hold your force AND question whether it's serving the thing that matters? Loevinger's Individualistic stage (E7) requires exactly this capacity: self-awareness about the gap between your performed self and your felt self.\n\nErikson's Generativity vs. Stagnation is relevant: forcing that deflects from values creates stagnation disguised as engagement. You're busy, you're active, you're fighting — but nothing moves toward what matters. Spiral Dynamics maps this as Orange/achievement energy (winning the argument) disconnected from Green/values energy (living what matters). Carol Gilligan would say you've mastered the "justice" orientation (rights, positions, fairness) at the expense of the "care" orientation (vulnerability, connection, responsiveness). The developmental move: not replacing force with softness — ADDING softness as an option.`,
      relational: `Your partner experiences your force and assumes that's the real you — opinionated, certain, pushing. In Hendrix's Imago framework, they've constructed an image of you based on your conflict Persona, not your full self. They may fight back, withdraw, or yield — but in every case, they're responding to the force, not to the person underneath it.\n\nTatkin (PACT) would note that your partner's nervous system has been trained to brace for intensity during disagreements. They enter the room already armored, already scanning for the escalation. This means they literally cannot perceive vulnerability from you during conflict even if you tried — their threat detection is activated, filtering for danger. You'd need to express vulnerability BEFORE the conflict escalates, not during it.\n\nIn Buber's terms, your forcing creates an I-It encounter in the precise moments when I-Thou is most needed. Gottman's "dreams within conflict" method directly addresses your pattern: beneath every gridlocked position is a dream, a value, a story. Your partner might PREFER the vulnerable version of you in conflict. They've never met it. The first time you say "I think I'm actually scared" instead of "You never listen" — watch their face change. That's the moment real contact happens.`,
      simple: `You fight about the dishes when you're actually scared about the relationship. Say the quiet thing — the one underneath the argument. Your partner is waiting for it.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'What\'s Underneath?',
      modality: 'ACT + EFT',
      instruction: `In your next disagreement, pause and ask: 'Is this what I'm ACTUALLY upset about?' If there's something underneath, say THAT: 'I think what I'm really feeling is...'`,
      whyThisOne: `Your force hides your vulnerability. Naming what's underneath transforms the conversation.`,
      frequency: 'Once this week',
      linkedExerciseId: 'accessing-primary-emotions',
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
      therapeutic: `You know who you are AND you know what matters — but under relational pressure, you don't act on either. ACT (Steven Hayes) research identifies this as the gap between "values clarity" and "committed action" — psychological flexibility mediates the connection, and your flexibility is currently stuck. In IFS terms (Schwartz), your Self has clarity, but a Protector part intervenes at the threshold of action, preventing the internal truth from becoming external speech.\n\nEFT (Sue Johnson) would frame this as a "withdrawn" position in the attachment dance — not from avoidance of closeness, but from a subtler defense: the fear that expressing your values will create conflict or rejection. DBT (Linehan) adds the interpersonal effectiveness framework: you may have the DEARMAN knowledge (what to say) but lack the practice of deploying it under relational stress. Gestalt therapy would identify "retroflection" — turning energy that should go outward (toward the partner) back inward (into private reflection).\n\nPolyvagal theory (Porges) adds a somatic layer: your ventral vagal system may support social engagement in LOW-stakes interactions, but under the implicit threat of relational consequences, your system shifts to dorsal vagal (freeze), and the values that are clear in your mind become inaccessible to your voice. Schema Therapy identifies a possible Emotional Inhibition schema — the belief that expressing your authentic position will have negative consequences, despite evidence that you have a strong self to express FROM.`,
      soulful: `You know exactly who you are. Your compass is strong, your values are clear, your sense of self is solid. And yet: the gap. Not in your knowing — in your living. You carry a clear internal truth and set it down at the door of every hard conversation. You walk in without it. Afterward you pick it back up, intact, unused.\n\nJung would recognize this as the tension between the Self (the archetype of wholeness, which knows) and the Persona (the social mask, which performs). Your Self has done its work — you have individuated internally, built a coherent identity, mapped your values. But your Persona hasn't caught up. It still performs the safer, smaller version of you in relational moments that call for the real one. The Trickster archetype is at play: it shows you the irony of being fully formed inside and partially expressed outside, whispering that the gap itself is the teacher.\n\nKierkegaard wrote, "The most common form of despair is not being who you are." Not the dramatic despair of crisis, but the quiet despair of holding your truth like a lantern — illuminating your own path, never sharing the light. David Whyte knew this territory: "The greatest sin is to say what you don't mean, but the second greatest is to know what you mean and refuse to say it."\n\nIn the ecology of the soul, you are a seed that has germinated underground — roots established, shoot formed, ready to break the surface. But the surface is where weather happens. Where others can see you. Where your values become testable by reality instead of held in the safety of inner certainty. As Rilke wrote, "Let everything happen to you: beauty and terror. Just keep going. No feeling is final." Let your values happen to the relationship. Let the relationship happen to your values.`,
      practical: `You have the self. You have the compass. You lack the movement.\n\nTHE ONE MICRO-STEP (BJ Fogg): After I notice I'm holding back a value-driven opinion, I will say: "This matters to me because..." and name the value.\n\nTHIS WEEK: Carry one value INTO one conversation. "This matters to me because honesty is one of my core values." Say the value out loud. Inside the conversation. Not after.\n\nDAILY HABIT STACK (James Clear): After dinner, reflect: "Did I express what mattered to me today, or did I edit it?" Just track it. Monday through Friday. Saturday: pick one edited moment and redo it — say the thing you held back.\n\nStages of change (Prochaska): You're at the Preparation stage — you KNOW what you value, you KNOW you're not acting on it, you're READY to change. The Action stage requires exactly one thing: opening your mouth. The internal work is done. The external work is one sentence away.\n\nTHE BOLD ASK: "I realize I know what matters to me but I don't always say it. I want to start being more honest about my values in our conversations. When I say 'this matters to me because...' — I'm practicing being more fully myself with you."`,
      developmental: `You may be at a mature Order 4 (Kegan) — self-authored, internally coherent, with a clear value system authored from the inside. The transition to Order 5 (Self-Transforming Mind) requires something your current position resists: letting the relationship TEST your values, not just hold them. Can you speak your truth AND let your partner's response change you? That's inter-independence. That's the next edge.\n\nWilber's Integral model identifies your pattern as a "translation" issue rather than a "transformation" issue: you have the developmental altitude, but you're translating it only internally, not enacting it relationally. Loevinger would place your internal development at the Autonomous stage (E8) but your relational expression at the Conscientious stage (E6) — you hold complexity inside while performing simpler versions outside.\n\nErikson's Generativity vs. Stagnation is directly relevant: your values are generative IN POTENTIAL but stagnant IN PRACTICE within the relationship. Carol Gilligan's framework adds the moral dimension: care that remains internal is care that serves the self but not the relationship. Spiral Dynamics maps your edge as the Yellow/integral challenge — you see the whole system but haven't yet become a participant in it. The compass is useless if it stays in your pocket.`,
      relational: `Your partner may sense your internal clarity and feel frustrated that it doesn't show up in your shared life. In Hendrix's Imago framework, they chose you partly because they sensed your depth — and they're waiting for that depth to surface in your life together. "I know what they believe. I just wish they'd ACT on it with me."\n\nTatkin (PACT) calls this a "one-person system" — your values operate as a personal resource but not as a shared one. Your partner is excluded from the most developed part of who you are. In Buber's terms, your I-Thou encounter is incomplete: you bring a partial "I" to the meeting, holding back the parts that feel most true.\n\nGottman's research on "shared meaning" in the Sound Relationship House requires both partners to know and engage with each other's deepest values. If yours stay internal, the shared meaning system can't include them. Your partner is building a life with a version of you that doesn't include your compass — and they can feel the incompleteness even if they can't name it. They're waiting for your compass to become operational in the relationship, not just in your head.`,
      simple: `You know who you are. You just don't say it out loud when it counts. This week: "This matters to me because..." Finish that sentence. In the room. With your partner listening.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Say the Value Out Loud',
      modality: 'ACT committed action',
      instruction: `Carry one value INTO one conversation this week: 'This matters to me because [value] is important to me.' Say it during the conversation, not after.`,
      whyThisOne: `You have the self and the compass. The practice is making them operational in the relationship.`,
      frequency: 'Once this week',
      linkedExerciseId: 'values-compass',
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
      therapeutic: `This is one of the most common and clinically significant combinations in couples therapy research. EFT (Sue Johnson) trials consistently find that attachment anxiety combined with low differentiation predicts the greatest relationship distress. Your anxiety pulls you toward closeness; your fusion means closeness = dissolution. The relationship becomes your identity, and any threat to it is a threat to your self.\n\nIn IFS terms (Schwartz), your entire system is organized around an Exile who holds the terror of abandonment, with Managers and Firefighters whose sole job is maintaining connection at any cost — including the cost of selfhood. Polyvagal theory (Porges) explains the physiology: your nervous system reads ANY distance as dorsal vagal collapse (the freeze/shutdown of disconnection), so it drives you toward sympathetic activation (anxious pursuit) or ventral vagal merger (fusion) — never toward regulated autonomy.\n\nSchema Therapy identifies overlapping Abandonment and Enmeshment schemas: "I will be left" AND "I cannot exist separate from you." AEDP (Diana Fosha) would work to access the core grief underneath the merger — the mourning of the self that was traded for connection. Gestalt therapy names the mechanism: "confluence" — the loss of the contact boundary that allows genuine meeting. DBT (Linehan) adds that distress tolerance is the key missing skill: you cannot tolerate the distress of separateness, so you eliminate it through merger. ACT (Hayes) would frame the work as building willingness to experience the discomfort of being a separate self while maintaining connection — both/and rather than either/or.`,
      soulful: `Love, for you, is not something you experience. It is something you become. When you are close to someone, the boundary between your feelings and theirs dissolves like salt in water. Their sadness is your sadness. Their approval is your survival. Their distance is your annihilation.\n\nJung would recognize this as a possession by the Anima/Animus — the soul-image that connects us to the beloved has flooded the entire psyche, leaving no dry ground from which to observe the relationship. You are IN the river with no bank to stand on. The archetype of the Self — the center that holds all opposites — has been projected entirely onto the partner. They carry your wholeness because you have not yet claimed it as your own. Jung wrote, "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed." But transformation requires two distinct substances. If one has already dissolved into the other, there is no meeting — only absorption.\n\nIn the ecology of the soul, you are a vine that has grown so completely around its host tree that it can no longer distinguish its own bark from the tree's. The vine is alive — vibrantly, urgently alive — but it has no independent shape. If the tree moves, the vine moves. If the tree falls, the vine falls. Khalil Gibran wrote in The Prophet, "Let there be spaces in your togetherness, and let the winds of the heavens dance between you." The winds cannot dance where there is no space.\n\nAs bell hooks wrote, "Rarely, if ever, are any of us healed in isolation. Healing is an act of communion." But communion is not the same as merger. Communion requires two who remain two even as they become one. The invitation is to rediscover your edges — not as walls, but as the place where you meet your partner instead of merging with them. Thomas Moore writes, "The soul is always in search of its own image." Find your own image. Then bring it to the love.`,
      practical: `THE PATTERN: You need closeness → you get close → you lose yourself in the closeness → your partner feels your weight → they create distance → you panic → you merge harder → repeat.\n\nTHE ONE MICRO-STEP (BJ Fogg): After I notice the urge to check on my partner or ask for reassurance, I will do one thing that is mine alone for 10 minutes first.\n\nTHIS WEEK: Do one thing that is entirely yours — that has nothing to do with your partner or the relationship. A walk alone. A hobby. A conversation with a friend about something that isn't the relationship. Notice how it feels to be a separate person who also happens to be in love. That distinction is the foundation of healthy intimacy.\n\nDAILY HABIT STACK (James Clear): Every morning, before engaging with your partner, spend 5 minutes doing something that is just yours — journaling, stretching, reading. You're building what Prochaska calls "maintenance": the daily practice that reinforces the new pattern of separateness-within-connection.\n\nTHE BOLD ASK: "I love you and I'm realizing I need to develop more of my own life so that our relationship has two full people in it. When I take space, it's not because I love you less. It's because I'm trying to be more of a person for you to love."`,
      developmental: `Erikson's Intimacy vs. Isolation stage is complicated here: you've achieved the FORM of intimacy (closeness, togetherness) without its SUBSTANCE (two whole selves meeting). Your intimacy is merger, not meeting. In Kegan's terms, you're at Order 3 in the relational domain — your self is constructed FROM the relationship rather than brought TO it. The relationship IS the self, so threats to the relationship are experienced as existential.\n\nThe developmental move is the Order 3→4 transition: building an internal center that can tolerate closeness without being dissolved by it. Wilber's Integral framework maps this as the critical shift from pre-personal fusion (undifferentiated) through personal differentiation (autonomous self) to transpersonal integration (self-in-relation). You're trying to jump from stage 1 to stage 3 without passing through stage 2. The differentiation stage cannot be skipped.\n\nLoevinger's ego development places this at the Conformist→Conscientious transition (E4→E6): from "I am defined by my relationships" to "I bring a defined self to my relationships." Spiral Dynamics maps the shift from Purple/tribal (merged identity) through Orange/individual (autonomous identity) toward Green/communitarian (interdependent identity). Carol Gilligan's framework adds the gender dimension: fusion is often socialized as love, especially in women's development, making the differentiation work feel like betrayal of the relationship rather than service to it.`,
      relational: `Your partner may feel engulfed. Not by your love — by the WEIGHT of being your entire emotional world. In Tatkin's PACT model, this creates what he calls an "asymmetric burden": one partner carries the regulatory function for both, and the weight eventually exhausts the carrier or collapses the relationship.\n\nHendrix (Imago) would identify this as the "symbiotic stage" extended indefinitely — the early merger that should naturally give way to differentiation has calcified. Your partner can't take space without it feeling like betrayal. They can't disagree without it feeling like abandonment. The pressure of being someone's everything is suffocating, even when the love is real.\n\nIn Buber's philosophy, genuine I-Thou encounter requires two "I"s. When one "I" has dissolved into the other, the encounter becomes I-I — a hall of mirrors where your partner sees only their own reflection in you, never a separate face looking back. Gottman's research shows that the strongest predictor of long-term satisfaction is not closeness but "accepting influence" — which requires two differentiated positions to negotiate between. What your partner needs: evidence that you can be okay on your own. That gives them room to choose you freely instead of feeling trapped by your need.`,
      simple: `You disappear into the people you love. That's not intimacy — it's self-erasure with a romantic soundtrack. Find yourself first. Then bring that self to the relationship.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Something Entirely Yours',
      modality: 'Differentiation + ACT',
      instruction: `Do one thing this week that is entirely yours — that has nothing to do with your partner. Notice how it feels to be a separate person who also happens to be in love. That distinction is the foundation.`,
      whyThisOne: `Your fusion dissolves boundaries. This practice rebuilds them from the inside — through action, not theory.`,
      frequency: 'Once this week',
      linkedExerciseId: 'over-functioning-brake',
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
      therapeutic: `You read the room and then leave the room. Your perception picks up the tension, but instead of engaging with what you sense, your conflict style pulls you away from it. EFT (Sue Johnson) research on "defensive exclusion" describes a system where awareness is shut out — but your variation is more subtle and potentially more corrosive: the awareness is INTACT. You KNOW what needs addressing. The exclusion is between perception and action.\n\nIn IFS terms (Schwartz), your Self perceives clearly, but a Conflict-Avoidant Manager intercepts the information before it reaches your voice. The Manager's logic: "If we name it, it becomes real. If it becomes real, we have to deal with it. Dealing with it is dangerous." ACT (Hayes) identifies this as experiential avoidance in a specific domain — you're willing to experience the AWARENESS of the problem but not the DISCOMFORT of addressing it.\n\nPolyvagal theory (Porges) adds: your social engagement system (ventral vagal) supports perception but collapses into dorsal vagal (shutdown) at the threshold of conflict, creating a neurological disconnect between seeing and speaking. Gestalt therapy names this "egotism" — excessive deliberation that prevents full contact. You process endlessly but never make the move from thought to speech. Schema Therapy identifies a possible Emotional Inhibition schema compounded by a Punitiveness schema: the belief that naming what you see will be punished, even when evidence suggests otherwise. DBT (Linehan) offers the bridge: the interpersonal effectiveness skill of DEAR MAN — specifically the "A" (Assert) — is the precise muscle that connects your perception to your voice.`,
      soulful: `You see everything. And you carry what you see alone. The tension between you and your partner — you feel it before they do. The unresolved conversation from last week — you sense it hanging in the room like weather that won't break. The thing that needs to be said — you know exactly what it is. And you step around it. Again and again.\n\nJung wrote, "Knowing your own darkness is the best method for dealing with the darknesses of other people." You know the darkness between you. You've mapped it with your extraordinary perception. But knowing and naming are different acts. Your Shadow holds the namer — the one who could speak, who could break the silence, who could transform the seeing into truth. Instead, the Persona performs calm while the soul carries the weight of unsaid things.\n\nIn the ecology of relationship, you are a deep lake — clear enough to see all the way to the bottom, but so still that nothing ripples the surface. Fish move in the depths. Currents shift. The entire underwater world is visible to you. And the surface remains glass. Mary Oliver wrote, "Tell me, what is it you plan to do with your one wild and precious life?" Carrying unsaid truths alone is not the answer. David Whyte knew this particular loneliness: "The conversational nature of reality means that everything we say and do eventually ripples out... even our silence. Our not speaking has consequences."\n\nThat is the particular tragedy of the Silent Seer: the loneliness of the person who sees the problem clearly and can't bring themselves to name it. Not from ignorance — from an excess of knowing paired with a deficit of daring. As Pema Chödrön teaches, "The truth you don't speak becomes the lie you live."`,
      practical: `THE PATTERN: You sense something → you catalogue it internally → you avoid naming it → the catalogue grows → emotional distance increases → your partner has no idea why.\n\nTHE ONE MICRO-STEP (BJ Fogg): After I notice I've been sensing something for more than 24 hours, I will say: "I've been noticing something between us." Just that opening line. You can figure out the rest after the door is open.\n\nTHIS WEEK: Take ONE thing you've been sensing and bring it into the open: "I've been noticing [thing] between us. Can we talk about it?" Your perception did the hard work. Let your voice do the rest.\n\nDAILY HABIT STACK (James Clear): Every evening, write down one thing you sensed today but didn't say. Sunday, pick the easiest one and say it. You're building the bridge between perception and speech — Prochaska would call this the Action stage for someone who's been in Contemplation for years.\n\nTHE BOLD ASK: "I realize I notice a lot about us but I don't always share it. I want to start. When I say 'I've been noticing something,' I'm trying to use my awareness to help us, not to start a fight. Can you meet me there?"`,
      developmental: `You have Order 4 perception (Kegan) — you can observe the relational field with remarkable clarity. But your conflict avoidance operates from Order 3 — driven by the relational system's rules about what's safe to name. You SEE from 4, you SPEAK from 3. The developmental move is alignment: letting your perception LEAD instead of your avoidance.\n\nIn Wilber's Integral framework, your cognitive line has outpaced your interpersonal assertiveness line — a common developmental asymmetry in introspective, perceptive individuals. Loevinger's ego development places your perception at the Individualistic stage (E7) but your conflict behavior at the Conformist stage (E4) — you think independently but act according to implicit relational rules about what can be said.\n\nErikson's framework connects this to Industry vs. Inferiority: if early experiences taught that your observations were unwelcome or burdensome, you learned that seeing was acceptable but speaking was not. Spiral Dynamics: your perceptive capacity operates from Green/Teal (systemic awareness) while your conflict behavior operates from Blue (rule-following, peace-keeping). Carol Gilligan maps the moral dimension: you've prioritized "not hurting" (silence) over "not abandoning" (truth). The deeper care is the one that speaks.`,
      relational: `Your partner may have NO IDEA how much you see. In Tatkin's PACT framework, they're operating with partial information — they think the relationship is "fine" because you never raise issues. But you're carrying an entire catalogue of unsaid observations, and each one, left unspoken, creates a tiny distance they can't account for.\n\nHendrix (Imago) would call this "invisible leaving" — you're present in body but increasingly absent in shared reality. Your partner senses the distance but can't trace it to a source. In Buber's philosophy, you're maintaining the form of I-Thou encounter while withholding its substance — the honest encounter that Buber considered the foundation of all genuine meeting.\n\nGottman's research on "turning toward vs. turning away" applies in reverse: your partner may be making bids for deeper connection, and your avoidance of naming what you see IS a turning away — not from them, but from the truth between you. Over time, Gottman's research shows, these accumulated turnings-away erode trust more reliably than open conflict does. Your partner needs to know what you see. Not all of it at once — but enough to close the gap between your private awareness and your shared reality.`,
      simple: `You see the problem clearly, then walk around it like it's a puddle. Spoiler: it's growing. This week, point at it and say, "Can we talk about that?"`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Voice What You See',
      modality: 'EFT + Gottman',
      instruction: `Take ONE thing you've been sensing and bring it into the open: 'I've been noticing [thing] between us. Can we talk about it?' Your perception did the hard work. Let your voice do the rest.`,
      whyThisOne: `You see clearly but avoid naming what you see. This practice reconnects perception to voice.`,
      frequency: 'Once this week',
      linkedExerciseId: 'stress-reducing-conversation',
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
      therapeutic: `This amplification pattern is well-documented across multiple clinical frameworks. High neuroticism increases the volume on ALL emotional signals; anxious attachment biases the interpretation toward threat. Combined: a nervous system simultaneously hypersensitive and negatively biased — detecting more signals and interpreting more of them as dangerous.\n\nIn Polyvagal terms (Porges), your autonomic nervous system has a low threshold for sympathetic activation — the fight-or-flight system fires before the ventral vagal (social engagement) system can assess the actual level of threat. IFS (Schwartz) would map this as multiple Protector parts activated simultaneously: a Hypervigilant Manager scanning for threats AND an Anxious Firefighter deploying emergency responses to signals that may not warrant emergency.\n\nDBT (Linehan) directly addresses this combination with the "emotion mind vs. wise mind" distinction — your system defaults to emotion mind, where feeling IS reality. The clinical goal is accessing wise mind, where feeling is INFORMATION to be evaluated. EFT (Johnson) research shows this combination — high expressivity plus high anxiety — benefits most from regulation-focused intervention BEFORE deeper attachment work. ACT (Hayes) adds the concept of "cognitive fusion": you don't just HAVE the feeling-plus-story, you ARE the feeling-plus-story. Defusion — learning to observe the package rather than be consumed by it — is the therapeutic lever. Schema Therapy identifies Vulnerability to Harm as a core schema: the world is dangerous, feelings prove it, and hypervigilance is the only rational response.`,
      soulful: `You feel everything twice — once when it happens, and once more when your anxiety tells you what it meant. The sensitivity is not the problem. The volume is not the problem. The problem is that the volume and the alarm system are wired together, and together they create a world where nothing is neutral and everything is evidence.\n\nJung would recognize this as the Shadow of sensitivity — the dark side of a gift. Your capacity to feel deeply is extraordinary. But when it fuses with the anxiety's threat-detection system, the gift becomes a haunting. You are the figure in myth who hears the music of the spheres and cannot sleep — Orpheus with his lyre, hearing everything, unable to stop the song from becoming a dirge. The Trickster archetype plays here too: showing you that the very intensity that makes you feel alive is the same intensity that exhausts you.\n\nIn the ecology of the soul, you are a seismograph in earthquake country — registering every tremor, every shift in the tectonic plates of your relationship, unable to distinguish the micro-tremor from the precursor to the main event. James Hillman wrote, "We don't get over things; we get deeper into them." Your depth is not the problem. Your inability to surface from it IS.\n\nRilke wrote, "Perhaps everything that frightens us is, in its deepest essence, something helpless that wants our love." Your feelings, arriving at full volume with threat stories attached, are helpless things wearing the masks of certainty. Beneath the alarm is almost always a simpler emotion — sadness, loneliness, the ancient wish to be held. As John O'Donohue wrote, "When you learn to befriend your solitude, your life will be richer." Befriend the feeling without the story. The feeling itself is a friend. The story is the uninvited guest.`,
      practical: `YOUR COMBINATION: Everything feels bigger (N: ${Math.round(N)}) AND everything feels threatening (anxiety: ${anxiety.toFixed(1)}). Together, they create a one-two punch: amplified feeling + threat interpretation.\n\nTHE ONE MICRO-STEP (BJ Fogg): After I notice a strong emotional reaction, I will say to myself: "Feeling, not fact. Feeling, not fact." Three times. Then decide what to do.\n\nTHIS WEEK: When a feeling arrives with a story attached, practice the split: "I'm feeling [emotion]. The story my mind is adding is [story]. I'm going to sit with the feeling and check the story later." Do this three times.\n\nDAILY HABIT STACK (James Clear): Every evening, write down today's biggest emotional spike. Rate it: Was the volume a 7 but the actual situation was a 3? Just track the gap. You're building what Prochaska calls "consciousness raising" — the Contemplation stage skill of seeing the pattern clearly before trying to change it.\n\nTHE BOLD ASK: "My feelings are big and my anxiety is real. When I'm activated, I may not have perspective. Help me by asking: 'Is this a big one or a loud one?' That question gives me a way to check the volume."`,
      developmental: `High neuroticism + anxious attachment often reflects an environment where emotional intensity was both the signal and the noise — feelings were big AND interpretation of those feelings was unreliable. In Kegan's framework, you're oscillating between Order 3 (fused with the emotional experience) and Order 4 (able to observe it) — and the neuroticism determines which order you're at in any given moment. Under low stress: 4. Under high stress: 3. The developmental work is stabilizing the observer so it holds even when the volume spikes.\n\nWilber's Integral model identifies this as a "state-stage" issue: your developmental altitude is accessible in calm states but regresses under emotional activation. Loevinger would note the oscillation between Conscientious (E6, reflective) and Self-Protective (E4, reactive) depending on arousal level. Erikson's framework connects to Trust vs. Mistrust: the amplification exists because the world was not reliably safe, so the system compensated with volume — better to over-detect than to miss.\n\nSpiral Dynamics maps the complexity: your intellectual self may operate from Green/Teal (nuanced, systemic) while your emotional self under stress drops to Red/Blue (urgent, absolute, seeking certainty). Carol Gilligan adds: the amplification may serve a care function — you feel MORE because you care MORE — but care without regulation becomes burden rather than gift. The developmental move: building the internal observer who can HOLD the feeling without immediately making meaning from it.`,
      relational: `Your partner may experience you as intensely reactive — responding to everything with the same high voltage. In Tatkin's PACT framework, they've developed what he calls "partner-reading fatigue": they can't always tell what's a real crisis and what's a sensitivity spike because the volume is the same for both. Their nervous system stays in low-level vigilance, never quite sure when the next wave will come.\n\nHendrix (Imago) would note that your intensity may paradoxically mirror something in your partner's history — they may have chosen someone whose emotional volume is familiar, even if it's exhausting. In Buber's terms, the challenge is that your I-Thou encounter is always at high intensity, and your partner needs the experience of low-intensity meeting too — the quiet I-Thou of two people sitting together without the air being charged.\n\nGottman's research shows that when both partners' heart rates exceed 100 BPM, productive conversation becomes physiologically impossible. Your neuroticism + anxiety means you cross that threshold faster than most. What your partner needs: a signal from you about the MAGNITUDE. "This is a big one" vs. "This is me being sensitive about something small." That meta-communication — rating the signal's size — is more valuable than anything you say about the content. It tells your partner how to calibrate their response.`,
      simple: `Everything feels like a 9 out of 10 to your system. It's not. Learn to rate the actual situation separately from the feeling's volume. Ask yourself: "Loud, or actually big?"`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'Feeling vs. Story',
      modality: 'ACT defusion + mindfulness',
      instruction: `When a feeling arrives with a story: 'I'm feeling [emotion]. The story my mind is adding is [story]. I'll sit with the feeling and check the story later.' Practice the split.`,
      whyThisOne: `Your neuroticism amplifies the signal. Your anxiety writes the story. Separating them gives you choice.`,
      frequency: 'Three times this week',
      linkedExerciseId: 'defusion-from-stories',
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
      therapeutic: `Warmth plus boundary-dissolution — one of the most socially rewarded yet relationally corrosive patterns. Your agreeableness (${Math.round(A)}) orients you toward harmony; your fusion (${Math.round(fusion)}) dissolves the boundary that would let harmony include disagreement. In IFS terms (Schwartz), a Caretaker/Pleaser Manager runs your relational system, while the parts that hold your authentic preferences — your opinions, your "no," your difference — are exiled.\n\nACT (Hayes) makes a critical distinction here: acceptance versus accommodation. Your "acceptance" may be accommodation wearing acceptance's clothes. Real psychological flexibility includes accepting DIFFERENCE — holding two contradictory positions without collapsing into the other's. EFT (Johnson) would note that your agreeableness functions as a "soft" withdrawal — you're present, warm, engaged, but your actual self is absent from the exchange.\n\nDBT (Linehan) identifies the missing skill as interpersonal effectiveness — specifically, the balance between DEAR MAN (getting what you want) and GIVE (maintaining the relationship). You've overdeveloped GIVE and underdeveloped DEAR MAN. Schema Therapy maps this as a Subjugation schema overlapping with a Self-Sacrifice schema: you believe both that your needs are less important AND that maintaining harmony is your responsibility. Polyvagal theory (Porges) adds: your ventral vagal system is highly active (warm, engaged) but it achieves regulation through OTHER-regulation rather than self-regulation — you stay calm by keeping everyone else calm, at the cost of your own authenticity. Gestalt therapy would name this "introjection" — swallowing the other's preferences whole without chewing them into something that includes your own.`,
      soulful: `Your warmth is genuine. People feel safe with you. Comfortable. Held. And underneath that warmth, a quieter truth: you have made yourself so agreeable that you have lost the texture of who you actually are.\n\nJung would recognize this as an inflation of the Persona — the social mask has become so complete, so polished, so warm, that the individual underneath has forgotten they exist separately from it. Your Shadow holds everything you've edited out: your opinions, your sharpness, your capacity to say "no" and mean it. The Shadow isn't dark because it's bad. It's dark because it's been denied light. Clarissa Pinkola Estés writes, "If you have ever been called defiant, incorrigible, forward, cunning, insurgent, unruly, rebellious, you're on the right track. Let them hold the door for you." Your warmth has kept every door closed to your defiance.\n\nIn the ecology of the soul, you are morning fog — gentle, enveloping, beautiful in its way. But fog obscures. No one can see the landscape through it. No one can find the specific tree, the particular stone, the YOU in the pleasant mist. Wendell Berry wrote, "The mind that is not baffled is not employed. The impeded stream is the one that sings." You have removed every impediment from the relational stream. It flows smoothly, noiselessly, without song.\n\nAs Khalil Gibran wrote, "Your children are not your children. They are the sons and daughters of Life's longing for itself." In the same way, your warmth is not just warmth — it is Life's longing for genuine contact, for the meeting of two real selves. But the meeting requires edges. Thomas Moore wrote in Care of the Soul, "Love allows its object to be imperfect." The invitation: keep the warmth. Add edges. "I love you AND I see this differently." That sentence is the beginning of real intimacy.`,
      practical: `THE PATTERN: Difference arises → agreeableness says "keep it smooth" → fusion dissolves your position → you agree → the real you retreats further → repeat.\n\nTHE ONE MICRO-STEP (BJ Fogg): After my partner asks my opinion, I will state my actual preference first, even if I'm willing to flex. "I'd prefer X" before "but whatever works for you."\n\nTHIS WEEK: Disagree with your partner about something small. Not to create conflict — to practice the muscle of difference. "I actually prefer the other option." Watch how the relationship doesn't break. Watch how your partner actually LIKES that you have a preference.\n\nDAILY HABIT STACK (James Clear): Three times this week, when asked "What do you want?", answer with what you ACTUALLY want before offering the compromise. Track it. Prochaska's stages: you're moving from Contemplation (knowing you over-accommodate) to Action (practicing preference).\n\nTHE BOLD ASK: "I realize I agree with everything too easily. I'm going to start sharing my actual opinions more. If I say 'I actually prefer...' — that's me practicing being a real person instead of a mirror. Encourage me."`,
      developmental: `High agreeableness + high fusion is the signature of Kegan's Order 3 in its most socially successful form. You are GOOD at relationships — at the Order 3 version of relationships, where harmony is the goal and the self is the material sacrificed to achieve it. The move toward Order 4 isn't becoming disagreeable. It's discovering that the relationship can hold difference without breaking.\n\nIn Wilber's Integral model, your interpersonal warmth has developed as a "bright shadow" — a genuine strength that also serves as a defense against the harder developmental work of differentiation. Loevinger's ego development places this at the Conformist stage (E4) in its most appealing form: you conform warmly, gracefully, in ways that are rewarded by everyone except the person who wants to know who you actually are.\n\nErikson's Identity vs. Role Confusion is subtly relevant: your identity may have been formed THROUGH agreeableness rather than BEFORE it. You didn't discover who you are and then become warm — you became warm as a strategy and never circled back to discover who you are underneath the warmth. Spiral Dynamics: Green/communitarian values taken to their pathological extreme — harmony at the cost of authenticity. Carol Gilligan mapped this precisely: the transition from "selflessness" (I exist through others' approval) to "honest care" (I care for others AND for the truth, even when they conflict) is your exact developmental edge.`,
      relational: `Your partner experiences your agreeableness as both comforting and slightly disorienting. In Tatkin's PACT model, they sense the absence of a "two-person system" — there should be friction, negotiation, the texture of two different people meeting. Instead, they get frictionless agreement and an uneasy feeling that something is missing.\n\nHendrix (Imago) would identify this as a "fused" relational style where the partner's need for a distinct Other goes unmet. They might push back on something and watch you fold, and feel a flicker of disappointment — not because they wanted a fight, but because they wanted a PARTNER. Someone to push against. Someone who stays.\n\nIn Buber's philosophy, your warmth creates a beautiful I-Thou atmosphere, but without the "I" being fully present, the encounter is actually I-fog-Thou. Your partner reaches for you and finds pleasantness where they expected a person. Gottman's research on "accepting influence" requires that there BE influence to accept — two positions, two perspectives, two wills in dialogue. When you eliminate your position, the dialogue becomes a monologue your partner didn't ask to deliver. They need you to show up as someone they can disagree with, negotiate with, be changed by. That's love between adults.`,
      simple: `You're so agreeable you've become wallpaper — pleasant, inoffensive, and invisible. This week: one actual opinion, held for more than three seconds, even if it's just about where to eat.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'One Small Disagreement',
      modality: 'DSI differentiation + Gottman',
      instruction: `Disagree with your partner about something small this week. Not to fight — to practice difference. 'I actually prefer the other option.' Notice: the relationship survives. Your partner likes that you have a preference.`,
      whyThisOne: `Your warmth is genuine. The practice adds texture to it — so your partner gets a person, not just a pleasant surface.`,
      frequency: 'Once this week',
      linkedExerciseId: 'unified-detachment',
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
      therapeutic: `The regulation gap. Your emotional reactivity fires fast (${Math.round(reactivity)}), but your capacity to manage your own emotional states is low (${Math.round(managingOwn)}). Gottman's research identifies this as Diffuse Physiological Arousal (DPA) — when heart rate exceeds 100 BPM, cognitive processing narrows and productive conversation becomes physiologically impossible.\n\nIn Polyvagal terms (Porges), your nervous system shifts rapidly from ventral vagal (calm engagement) to sympathetic activation (fight/flight) with a very low threshold — and critically, the return path (sympathetic back to ventral vagal) is slow and unreliable. DBT (Linehan) was designed precisely for this pattern: the distress tolerance module (TIPP — Temperature, Intense exercise, Paced breathing, Paired muscle relaxation) provides emergency regulation skills for the moment of flooding. The emotion regulation module builds the longer-term capacity.\n\nIFS (Schwartz) would map this as Firefighter parts that hijack the system when emotional intensity exceeds the Managers' capacity to contain it — the Firefighters' strategy is immediate discharge: say it, throw it, slam it, anything to reduce the internal pressure NOW. EFT (Johnson) links this to "emotional overwhelm" in the attachment system — flooding is what happens when the attachment alarm and the regulation deficit collide. Schema Therapy identifies a possible Insufficient Self-Control schema: the belief (and experience) that you cannot manage your own emotional intensity. AEDP (Fosha) offers a corrective: in the presence of a calm, regulated other, your window of tolerance naturally expands — co-regulation as a bridge to self-regulation.`,
      soulful: `When the wave comes, there is nothing to hold onto. Your emotions arrive with the force of a flash flood — not a gentle rising but a sudden, overwhelming surge that fills every channel of your being before you can brace for it.\n\nIn the mythology of the psyche, this is Poseidon's realm — the god of the sea whose earthquakes and storms represent the untamed forces beneath the surface of consciousness. Jung wrote, "People will do anything, no matter how absurd, in order to avoid facing their own soul." But your problem isn't avoidance — it's that you face the soul's full force without the container to hold it. The alchemists called this the solutio: the dissolving of solid structures in emotional waters. Transformation requires the dissolving. But it also requires the vessel — the container strong enough to hold the process without shattering.\n\nIn ecopsychology, you are a river in flash-flood season — the water comes too fast for the banks you have. Not because the river is wrong, but because the banks haven't been built to match the river's power. Every regulation practice — every breath, every pause, every 20-minute walk — is a sandbag placed along the bank. Slowly, over time, the banks deepen. The river still runs strong, but the ground can hold it.\n\nPema Chödrön teaches: "You are the sky. Everything else — it's just weather." Right now, you ARE the weather. The practice is becoming the sky. As David Whyte wrote, "Anything or anyone that does not bring you alive is too small for you." Your emotional intensity is not too big. Your container is too small. Build the container. The intensity is the gift inside.`,
      practical: `THE GAP: You react fast (reactivity: ${Math.round(reactivity)}) and regulate slow (managing own: ${Math.round(managingOwn)}). The space between stimulus and response is where your entire relationship lives — and right now that space is paper-thin.\n\nTHE ONE MICRO-STEP (BJ Fogg): After I notice my chest tighten or my jaw clench, I will take one slow exhale (6 seconds out) before saying anything.\n\nTHIS WEEK: Build a personal 20-minute rule. When you notice flooding (chest tight, jaw clenched, tunnel vision), say: "I need 20 minutes. I'm not leaving — I'm regulating. I'll be back." Leave the room. Breathe. Walk. Return. THEN continue. Gottman's research shows this break restores physiological baseline.\n\nDAILY HABIT STACK (James Clear): Every morning, do 2 minutes of box breathing (4 seconds in, 4 hold, 4 out, 4 hold). You're not waiting for a flood — you're pre-building the banks. This is Prochaska's Maintenance stage: daily practice that makes the regulation pathway stronger and more automatic.\n\nTHE BOLD ASK: "When I say 'I need 20 minutes,' it's not me running away. It's me doing the one thing that will let us actually talk productively. Can you trust that I'll come back? I will."`,
      developmental: `Dan Siegel's "window of tolerance" is the core concept: the range of emotional arousal within which you can still think, communicate, and choose your response. Your window is currently narrow. In Kegan's framework, you have the capacity for Order 4 self-observation in calm states, but flooding collapses you to Order 2 — the Imperial Mind where needs are immediate and impulse IS action.\n\nWilber's Integral model maps this as a "state regression": your developmental altitude is available at baseline but becomes inaccessible under arousal. The work is stabilizing the altitude across states. Loevinger's ego development framework places the shift you're building at the Self-Protective→Conformist→Conscientious transition: from "I act on impulse" (E4) to "I have standards for my behavior" (E5) to "I can observe my impulses and choose my response" (E6).\n\nErikson's Initiative vs. Guilt is relevant: if early environments punished your emotional expression, you learned neither to suppress (which some children do) nor to express skillfully — you learned to FLOOD, because the environment provided no model for regulated expression. Spiral Dynamics: your emotional system operates from Red (immediate, impulsive, power-driven) while your relational aspirations are at Green (empathic, connected). The developmental work is building the Orange capacity in between: self-regulation, delayed gratification, the ability to HOLD intensity without immediately discharging it. Carol Gilligan adds: the regulation capacity IS a care capacity — learning to manage your storms is an act of love toward the people who weather them with you.`,
      relational: `Your partner walks on eggshells. Not because you're abusive — because they can't predict when the flood will come. In Tatkin's PACT framework, their nervous system has entered what he calls "chronic low-level threat scanning" — they're reading your face, your tone, your body language for early warning signs, diverting enormous cognitive resources to monitoring you rather than being present with you.\n\nHendrix (Imago) would note that your partner's vigilance may mirror a childhood pattern of their own — they may have chosen someone whose emotional volatility is familiar, even if painful. In Buber's terms, the flooding converts I-Thou into I-storm: your partner can't encounter YOU during a flood, only the weather system passing through you. The person they love disappears behind the intensity.\n\nGottman's research shows that repair attempts CANNOT land during DPA — the flooded brain literally cannot process conciliatory language. So your partner's experience is: they try to reach you, you're unreachable, and they don't know when you'll return. What they need is the 20-minute rule framed as a PROMISE, not a retreat: "I'm not leaving. I'm regulating. I'll be back, and when I come back, I'll be able to hear you." That sentence — said before you leave — is the difference between abandonment and responsible self-regulation.`,
      simple: `Your emotions go from 0 to 100 before your brain catches up. The fix: "I need 20 minutes." Leave, breathe, come back. The conversation will still be there. You'll be better for it.`,
    };

    const matchedPractice: MatchedPractice = {
      name: 'The 20-Minute Rule',
      modality: 'Gottman + DBT',
      instruction: `When you notice flooding (chest tight, jaw clenched, tunnel vision), say: 'I need 20 minutes.' Leave the room. Breathe. Walk. Return. THEN continue. This break restores physiological baseline.`,
      whyThisOne: `When reactivity overwhelms regulation, nothing productive happens. The break IS the intervention.`,
      frequency: 'Every time you notice flooding',
      linkedExerciseId: 'distress-tolerance-together',
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
      therapeutic: `Your window of tolerance (Dan Siegel) is narrow — the range of emotional intensity you can hold before flooding or shutting down. And your perception is low (${Math.round(perception)}) — the quality of emotional sensing between you and your partner. These are causally linked: a narrow window PREVENTS attunement because you can't stay present long enough to sense the field accurately.\n\nIn Polyvagal terms (Porges), your ventral vagal system — the "social engagement" circuit that enables accurate perception of others' emotions — goes offline quickly under arousal, replaced by sympathetic (fight/flight) or dorsal vagal (freeze/shutdown) responses that are incompatible with attunement. IFS (Schwartz) maps this as Protector parts that slam the perceptual door shut when emotional intensity approaches the Exiles: "Better to go blind than to see something we can't handle."\n\nDBT (Linehan) addresses this with the foundational skill of mindfulness — specifically, "observing without judging" — which widens the window incrementally by teaching the nervous system that emotional awareness doesn't have to lead to overwhelm. EFT (Johnson) research on co-regulation and physiological synchrony shows that attunement requires both partners to be in their windows simultaneously. If yours is narrow, the window of SHARED regulation shrinks proportionally. ACT (Hayes) adds: the window narrows further when you're fused with the belief "I can't handle intense feelings." The belief becomes self-fulfilling. Gestalt therapy would focus on "staying with" — the practice of maintaining contact with emerging experience for just a few seconds longer than feels comfortable, which is the exact mechanism by which the window widens.`,
      soulful: `There is a space between you and your partner where attunement lives — a field of mutual sensing, a shared emotional atmosphere. But you can only access it when your nervous system is calm enough to perceive it. Right now, your window is narrow. You shift from calm to flooded quickly, and in the flood, the field between you goes dark.\n\nJung spoke of the "temenos" — the sacred, protected space where psychological work can happen. Your window of tolerance IS your temenos. When it's wide enough, you can hold the complexity of another person's inner world alongside your own. When it narrows, the sacred space collapses, and all that remains is the survival response — fight, flee, freeze. The perception that would let you sense your partner goes offline. Not because you don't care, but because your nervous system has decided that caring is a luxury it can't afford right now.\n\nIn the ecology of the soul, you are a young tree in a storm — roots still shallow, trunk still thin, swaying dangerously in winds that an older tree would absorb without effort. But trees grow deeper roots and thicker trunks over time. Every season strengthens the structure. Wendell Berry wrote, "The world cannot be discovered by a journey of miles, only by a spiritual journey of inches." Your window widens in inches. Each breath, each grounding practice, each moment you stay present when your system screams to leave — that is an inch.\n\nAs Rilke wrote, "Be patient toward all that is unsolved in your heart and try to love the questions themselves." The question your nervous system asks — "Can I stay present through this?" — is itself the practice. Mary Oliver knew: "Attention is the beginning of devotion." Your devotion to your partner begins with the capacity to attend. The window is where attention lives.`,
      practical: `YOUR BOTTLENECK: Attunement/perception (${Math.round(perception)}). YOUR CONSTRAINT: Narrow window (reactivity ${Math.round(reactivity)}, managing own ${Math.round(managingOwn)}).\n\nThe window is the thing to widen. Everything else — perception, attunement, communication, intimacy — improves when it improves. This is the ONE THING.\n\nTHE ONE MICRO-STEP (BJ Fogg): After I sit down (any chair, any time), I will feel my feet on the floor for 10 seconds. That's it. You're building the neural pathway for grounding.\n\nTHIS WEEK: Three times a day, pause for 30 seconds and feel your feet on the floor. Morning, midday, evening. You're training the nervous system to drop into the body — which is where the window widens.\n\nDAILY HABIT STACK (James Clear): Stack it onto existing habits: after brushing teeth (morning), after lunch, after putting phone on charger (night) — 30 seconds of feet-on-floor grounding. Prochaska's stages: this is pure Action stage. No contemplation needed. The practice IS the understanding.\n\nTHE BOLD ASK: "I'm working on staying present longer in our conversations, especially the hard ones. If you notice me checking out or getting flooded, say 'feet on the floor.' It's a grounding cue. It helps me stay in the room with you."`,
      developmental: `Window width is not fixed — it's a developmental capacity that grows through practice. In Kegan's framework, a narrow window keeps you oscillating between Order 2 (immediate, reactive) and Order 3 (relational, other-focused) without stable access to Order 4 (self-observing). The window IS the developmental infrastructure. Widen it and every other developmental capacity becomes accessible.\n\nWilber's Integral model identifies this as a "state-capacity" issue: your developmental altitude exists but is only accessible in narrow state-conditions (calm, rested, unstressed). The work is expanding the range of states in which your highest capacity remains online. Research on neuroplasticity confirms that regulation pathways strengthen with repeated use — the synaptic connections that support your window literally get thicker and faster with practice.\n\nLoevinger's ego development framework maps the window-widening process: from Impulsive (E3, pure reactivity) through Self-Protective (E4, strategic regulation) to Conscientious (E6, internalized regulation standards). Erikson's framework connects to Industry vs. Inferiority: building regulation is WORK — patient, incremental, sometimes boring work that nonetheless builds the fundamental infrastructure of relational competence. Spiral Dynamics: the window widens as you move from Red (impulsive) through Blue (disciplined practice) toward Orange (self-managed). Your current window is where you START, not where you stay.`,
      relational: `Your partner may feel like connection with you has a time limit — a countdown clock they can sense but can't see. In Tatkin's PACT model, they've learned to "titrate" emotional depth with you, carefully managing the intensity to keep you in your window. They keep things light because depth activates your system past its capacity. This creates a painful irony: they want more of you, but they've learned that reaching for more pushes you past your edge.\n\nHendrix (Imago) would note that your partner's adaptation to your narrow window may echo a familiar pattern from their own history — perhaps they grew up managing someone else's capacity, learning to be the calm one, the careful one. In Buber's terms, the I-Thou encounter is time-limited by your window: your partner gets glimpses of genuine meeting, followed by withdrawal or flooding, followed by a period of recovery before the next attempt.\n\nGottman's Sound Relationship House requires "turning toward" — which requires BEING PRESENT to notice the bid. When your window is narrow, you miss bids because your system is offline. What your partner needs: evidence that the window is widening. One conversation that goes 60 seconds deeper than usual without you shutting down or flooding. That 60 seconds is worth more to your partner than a hundred surface-level exchanges. It tells them you're growing. It tells them the time limit is changing.`,
      simple: `Your window for real connection is narrow — you go from fine to flooded or checked-out fast. Widen it: 30 seconds of feet-on-floor, three times a day. Small, boring, life-changing.`,
    };

    const matchedPractice: MatchedPractice = {
      name: '30-Second Grounding',
      modality: 'Somatic + mindfulness',
      instruction: `Three times a day, pause for 30 seconds and feel your feet on the floor. That's it. You're training the nervous system to drop into the body — which is where the window widens and attunement becomes possible.`,
      whyThisOne: `Your narrow window prevents attunement. Widening the window is the single most impactful practice.`,
      frequency: 'Three times daily',
      linkedExerciseId: 'grounding-5-4-3-2-1',
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
