/**
 * Tier 1 Clinical Patterns — Integration Engine
 * ────────────────────────────────────────────
 * 8 named clinical patterns, each with:
 *   - Pattern ID, name, required boxes, score conditions
 *   - All 6 lens narratives (therapeutic, soulful, practical, developmental, relational, simple)
 *   - Developmental arc (wound, protection, cost, emergence)
 *   - Matched practice
 *   - Invitation (the screenshot moment)
 *   - Evidence metadata
 *
 * Checked in priority order; first match wins.
 */

import type {
  IntegrationScores,
  IntegrationResult,
  LensedNarrative,
  DevelopmentalArc,
  MatchedPractice,
  DomainId,
} from '../types';

import {
  getAnxiety, getAvoidance, isAnxious, isAvoidant,
  getEQPerception, getEQManagingSelf, getEQManagingOthers,
  getReactivity, getIPosition, getFusion, getCutoff,
  getYielding, getAvoiding, getForcing, getProblemSolving,
  getN, getE, getO, getA, getC,
  getTopValues, getAvgValueGap, getBiggestGapValue,
} from '../helpers';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PATTERN 1 — THE INVISIBLE PARTNER
// Fires when: anxiety > 4.0 AND perception > 65 AND yielding > 3.5 AND fusion > 65
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchInvisiblePartner(s: IntegrationScores): IntegrationResult | null {
  const anxiety = getAnxiety(s);
  const perception = getEQPerception(s);
  const yielding = getYielding(s);
  const fusion = getFusion(s);

  if (!(anxiety > 4.0 && perception > 65 && yielding > 3.5 && fusion > 65)) return null;

  const lenses: LensedNarrative = {
    therapeutic: `You're running a sophisticated internal system: your emotional perception detects every shift in the relational field (perception: ${Math.round(perception)}). Your attachment system reads those shifts as potential threats (anxiety: ${anxiety.toFixed(1)}). Your conflict strategy is to yield — accommodate, agree, disappear the friction (yielding: ${yielding.toFixed(1)}). And your low differentiation means the accommodation isn't just behavioral — you actually lose your position, absorb your partner's reality as your own (fusion: ${Math.round(fusion)}).

In EFT terms, you're a soft pursuer — you pursue connection not through demand but through dissolution. The feeling underneath is what Sue Johnson calls primal panic: "Am I enough to keep you?" In IFS language, a managerial part learned early that anticipating others' needs keeps you safe. The exile it protects carries the belief: "If I need too much, people leave."

The research supports two pathways: EFT to access the vulnerable affect underneath the accommodation (the fear, the longing), and ACT to build values-committed assertion — expressing what's true even when your nervous system says it's dangerous. Trials show both approaches reduce self-silencing and increase positive partner feelings.`,

    soulful: `Something in you learned to become invisible in order to stay close. Not all at once — slowly, like a tide going out so gently you didn't notice the water leaving. You sense everything in the field between you. Every shift, every cooling, every unnamed tension. Your radar is extraordinary. And what you sense, you serve.

Jung called this the loss of the Self through the inflation of the Persona. You became so good at reading what was needed that the mask fused with the face. The Persona — that social self we present to the world — ate the person underneath. Not through cruelty, but through devotion. As David Whyte wrote: "The soul would rather fail at its own life than succeed at someone else's."

This is the archetype of the Invisible One — the figure in every myth who gives their name away to keep the peace, who trades their voice for belonging. Think of the selkie who shed her skin to walk on land. Think of Persephone before she chose her own descent. The accommodation kept people near. The perception kept you useful. Together they made you the person everyone finds easy to be around. But ecopsychology teaches us that every ecosystem needs diversity to thrive. A forest of identical trees is a plantation, not a wilderness. Your relationship needs your weather — all of it. The storms AND the sun.

Rilke understood this: "Perhaps all the dragons in our lives are princesses who are only waiting to see us act, just once, with beauty and courage." The dragon here is your own voice. It feels dangerous because an ancient part of you decided it was. The field between you needs both of you present. Not one person and one echo. Your partner fell in love with weather — with the full sky of who you are. Right now they're getting a forecast that always says "mild and pleasant." But you are not mild. You are someone with a thunderstorm inside who has learned to present sunshine.

The invitation is not to stop sensing. It is to let what you sense travel somewhere new: from your accommodation to your voice. As John O'Donohue wrote: "You can never love another person unless you are equally involved in the beautiful but difficult spiritual work of learning to love yourself." One true sentence. That is enough. That is everything.`,

    practical: `THE PATTERN: You sense something is off → anxiety says "danger" → you accommodate → you disappear.

THE COST: Your partner is in love with your performance, not with you.

YOUR ATOMIC HABIT (start today):
Stack this onto an existing routine. After dinner, before you clear the table, say ONE true thing about your day. Not "fine." Something real. "Work was frustrating." "I missed you." "I'm tired." Habit stack: meal ends → one true sentence → then clear the table.

THIS WEEK'S MICRO-SHIFT:
When you sense something is off (your radar is strong — you WILL sense it), say it out loud within 60 seconds. One sentence:

"Something feels off to me right now."

Don't explain. Don't fix. Don't apologize for saying it. Just say it.

THE BOLD ASK: Set a phone reminder for 8pm every day this week. When it goes off, text your partner one real feeling. Not a question about them. A statement about YOU. "I felt proud today." "I'm anxious about tomorrow." Five seconds. That's the whole practice.

NOTICE: The relationship survived. Your partner wanted to know. The sky didn't fall. That's the data your nervous system needs. James Clear calls this "casting votes for your new identity." Each sentence is a vote for the person who speaks instead of disappears.`,

    developmental: `In Erikson's framework, you're deep in the work of Intimacy vs. Isolation — but with a specific twist. You've achieved intimacy's FORM (closeness, togetherness, partnership) without its SUBSTANCE (two full selves meeting). Your intimacy is built on one self dissolving into the other.

In Kegan's developmental map, your profile suggests the Socialized Mind (Order 3) — your sense of self is constructed from how others see you and what they need from you. The transition to the Self-Authoring Mind (Order 4) is the developmental move your data is pointing toward: building an internal compass that works even when your partner wants something different from what it says.

Your high perception is actually an Order 4 capacity — you CAN see patterns, you CAN observe the field. But your high fusion means you can't yet HOLD yourself separate from what you see. You see the pattern AND you're swept into it. The developmental edge: becoming the observer who stays grounded while sensing the field. That's not a personality change. It's a developmental emergence that's already underway. The awkwardness you feel when you try to assert yourself? That's the transition happening in real time.`,

    relational: `Here's what your partner probably experiences, even if they can't name it:

They feel easy with you. Conversations are smooth. Conflict is rare. You sense what they need and provide it — often before they ask. Most people would call this a wonderful relationship.

But underneath, they sense something missing. A flatness. They might describe it as: "Everything is fine but something feels... off." What's off is that they're in a relationship with your accommodation, not with you. They're getting their needs met beautifully — and they have no idea that yours aren't being met at all, because you've never told them.

Here's the paradox Gottman's research reveals: you catch every one of your partner's bids for connection and respond. But you make almost no bids of your own. Your yielding means you don't ask for what you need. Your fusion means you may not even know what you need. The relationship looks balanced from the outside. From the inside, it's a one-way mirror.

What they need from you isn't more agreement. It's texture. Difference. The moment you say "I actually feel differently about this," you become three-dimensional again. That's not a risk to the relationship. That's when the real relationship begins.`,

    simple: `You see everything.
You say almost nothing.
The gap between those two is where your relationship lives.

Close it. One sentence at a time.`,
  };

  const arc: DevelopmentalArc = {
    wound: 'Somewhere, you learned that your needs were too much — that the price of closeness was becoming invisible.',
    protection: 'So you built a system: sense what they need, provide it before they ask. Beautiful engineering.',
    cost: 'Your partner is in a relationship with your accommodation, not with you. The real you has been offstage for a long time.',
    emergence: 'Let what you sense travel to your voice, not your accommodation. The same instrument, pointed toward courage.',
  };

  const matchedPractice: MatchedPractice = {
    name: 'One True Sentence',
    modality: 'EFT + ACT',
    instruction: "When you sense something is off between you and your partner this week, say it out loud within 60 seconds. One sentence: 'Something feels off to me right now.' Don't explain, don't fix, don't apologize. Just name what you sense. Then notice: the relationship survived. Your partner wanted to know.",
    whyThisOne: 'Your radar is strong — you WILL sense it. The practice is letting the perception reach your voice instead of your accommodation.',
    frequency: 'Once this week',
    linkedExerciseId: 'hold-me-tight',
  };

  return {
    title: 'The Invisible Partner',
    subtitle: 'You sense everything and say almost nothing',
    body: lenses.soulful,
    arc,
    practice: matchedPractice.instruction,
    oneThing: 'Let what you feel become information, not instruction.',
    depth: 'quad',
    domains: ['foundation', 'navigation', 'conflict', 'stance'],
    confidence: 'high',
    patternId: 'invisible_partner',
    patternName: 'The Invisible Partner',
    lenses,
    matchedPractice,
    invitation: 'Let what you feel become information, not instruction.',
    evidenceLevel: 'strong',
    keyCitations: ['Bazyari et al., 2024', 'Barraca Mairal et al., 2024', 'Conradi & Kamphuis, 2025'],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PATTERN 2 — THE FORTRESS
// Fires when: avoidance > 4.0 AND cutoff > 65 AND avoiding > 3.5 AND perception < 45
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchFortress(s: IntegrationScores): IntegrationResult | null {
  const avoidance = getAvoidance(s);
  const cutoff = getCutoff(s);
  const avoiding = getAvoiding(s);
  const perception = getEQPerception(s);

  if (!(avoidance > 4.0 && cutoff > 65 && avoiding > 3.5 && perception < 45)) return null;

  const lenses: LensedNarrative = {
    therapeutic: `Your profile shows a comprehensive distance system operating across every dimension. Attachment avoidance (${avoidance.toFixed(1)}) keeps emotional closeness at bay. Emotional cutoff (${Math.round(cutoff)}) severs the signal when feelings get too intense. Conflict avoidance (${avoiding.toFixed(1)}) ensures tension never gets addressed. And low perception (${Math.round(perception)}) means the emotional field is muted — you don't pick up the signals that would pull you toward engagement.

Multiple clinical models illuminate this pattern:

POLYVAGAL THEORY (Porges): Your nervous system may be operating from a dorsal vagal state — not acute freeze, but chronic low-energy withdrawal that looks calm from outside. The ventral vagal system (social engagement) is underactivated. The work is not "be more emotional" — it's gradually expanding your window of tolerance for social-emotional arousal.

EFT (Sue Johnson): This is "defensive exclusion" — the systematic shutting out of vulnerability your system learned was necessary for survival. Johnson's research shows that avoidant partners can access vulnerable affect when the therapeutic context is safe enough. The key is NOT pushing for emotion, but creating safety FIRST.

IFS (Richard Schwartz): There isn't one protector running the show. There's an entire TEAM — a committee of parts that collectively ensure nothing gets through. The exile they're protecting likely carries the consistent message that emotional needs would not be met, so it was safer to stop having them. Schwartz's approach: befriend the protectors before trying to reach the exile.

SCHEMA THERAPY (Jeffrey Young): This maps to the Emotional Inhibition and Detached Protector schemas — strategies that develop when emotional expression was punished, ignored, or met with withdrawal in childhood. The antidote is not insight alone but corrective emotional experiences in relationship.

CBT (Aaron Beck): Cognitive distortions maintain the pattern: "If I show emotion, I'll be overwhelmed." "Needing people means I'm weak." "I can handle everything alone." These beliefs feel like facts because your system has never tested them in a safe relationship context.`,

    soulful: `There is a quiet inside you that you have mistaken for peace. It is not peace. It is the absence of signal — the emotional field turned down so low that neither pain nor joy can reach you. The walls you built are elegant. They work perfectly. And they are slowly starving the very thing they were built to protect.

In Jungian terms, you are living in the archetype of the Armored Knight — the figure who made the armor so well that it cannot be removed, even to eat, even to sleep, even to be touched by the person they love. The Shadow here is not aggression or chaos — your Shadow is tenderness itself. The soft animal of your body, as Mary Oliver called it, has been locked in the basement while the competent, controlled self runs the show upstairs. Jung wrote: "That which we need the most will be found where we least want to look."

You did not build these walls from cruelty. You built them from wisdom — the wisdom of a nervous system that learned the only safe feeling is no feeling. Ecopsychology speaks of "nature-deficit disorder" — how we suffer when cut off from the living world. Your emotional system has its own version: feeling-deficit. The numbness that looks like strength is actually a form of chronic drought. As Wendell Berry wrote: "It may be that when we no longer know what to do, we have come to our real work, and when we no longer know which way to go, we have begun our real journey."

But the field between you and the person you chose — it cannot breathe behind glass. James Hillman, the great archetypal psychologist, said: "We don't heal in isolation but in community." Your healing is not a solo project done inside the fortress. It happens in the micro-moment of contact — when one feeling, however small, travels from the inside of you to the outside air. Not a hurricane. A breeze. The door is a sentence. Any true sentence. "I felt sad today." And on the other side of it: the field between you, waiting, still alive. As Pema Chödrön teaches: "The most fundamental aggression to ourselves is to remain ignorant by not having the courage to look at ourselves honestly and gently."`,

    practical: `THE PATTERN: Something emotional happens → your system shuts down the signal → you withdraw → nothing gets discussed → distance grows → repeat.

THE COST: Your partner feels like they're living with someone who's present but not there.

YOUR ATOMIC HABIT (start tonight):
BJ Fogg's Tiny Habits formula: After [existing routine], I will [tiny behavior]. After you get into bed, before you turn off the light, tell your partner one thing you felt today. One word counts. "Stressed." "Grateful." "Lonely." That's it. Under 5 seconds. Repeat nightly until it's automatic.

THIS WEEK'S MICRO-SHIFT:
Once — just once — share one feeling with your partner that you would normally process alone. Not a crisis. Not a confession. Something small:

"I had a hard day."
"That movie made me sad."
"I missed you today."

THE BOLD ASK: Write your partner a 3-line text right now. "Thinking about you. Today was [one word]. Love you." Send before you overthink it. Your brain will scream "that's unnecessary." Send it anyway.

STAGES OF CHANGE CHECK: If you're in Contemplation (thinking about being more open but not doing it yet), the one-word bedtime habit is your entry point. If you're in Preparation (you've tried small shares before), upgrade to the 60-second version: share one thing that happened and how it made you feel. Not what you did about it — how it made you FEEL.

Your partner will probably light up. Because they've been waiting for a crack in the wall. Not to invade. To connect.`,

    developmental: `Your profile maps to a specific developmental position. In Kegan's framework, you may have achieved Self-Authoring (Order 4) in a particular way — you have a strong internal compass, you know what you think, you don't need external validation. But you've achieved it through EXCLUSION rather than INTEGRATION. You authored yourself by cutting off the relational channels, not by holding them alongside your independence.

The developmental invitation is not to become dependent. It's to move toward what Kegan calls the Self-Transforming Mind (Order 5) — where you can be fully yourself AND be changed by relationship. Where independence and interdependence coexist. Your avoidance has given you half of that equation (the independence). The other half (allowing influence without losing yourself) is the edge your data points to.

In Erikson's terms, you may have resolved Industry vs. Inferiority beautifully — you're competent, reliable, effective. But Intimacy vs. Isolation is the stage that's unresolved. Not because you lack the capacity. Because the nervous system that protects your competence also blocks the vulnerability that intimacy requires.`,

    relational: `Here's what your partner experiences being with you:

Stability. Calm. Reliability. You're steady, even-keeled, unflappable. They can count on you to show up, be consistent, not create drama. Many people would be grateful for this.

But here's what they also experience: a wall. They reach for you and find composure. Competence. Control. Everything except the vulnerable human underneath. They might describe it as: "I know they love me, but I can't FEEL it." Or: "They're there, but they're not... there."

Your emotional cutoff isn't just about protecting yourself. It creates an experience of emotional solitary confinement for your partner. They're in the room with you but alone. And the worst part: they can't reach you. Not because you're angry. Because you're sealed.

Research on actor-partner effects shows that BOTH partners' accessibility predicts relationship satisfaction. Your partner's acceptance of you is probably high — they've adapted to the wall. But their unspoken loneliness is the cost of your protection.

What they need isn't emotion dumped at their feet. It's one crack. One small human moment: "I'm having a hard day." Not a problem to solve. A feeling to share. That's what would change everything for them.`,

    simple: `You built a beautiful wall.
It keeps everything out.
Including the love.

Install a door. A small one. Open it once this week.`,
  };

  const arc: DevelopmentalArc = {
    wound: "Somewhere, you learned that feelings weren't safe — that the world responded better to your competence than your vulnerability.",
    protection: "So you built walls. Elegant, effective walls that keep everything managed and nothing gets through. It worked. You survived.",
    cost: "Your partner lives with someone who is present but unreachable. They've adapted to the calm. Underneath their adaptation is a loneliness they can't name.",
    emergence: 'Install a door. Not demolish the walls — just a door. One feeling, shared out loud, to one person. That\'s the beginning.',
  };

  const matchedPractice: MatchedPractice = {
    name: 'One Small Feeling, Shared',
    modality: 'EFT + ACT',
    instruction: "Once this week, share one feeling with your partner that you would normally process alone. Something small: 'I had a hard day.' 'That movie made me sad.' 'I missed you today.' Then notice their response. They will probably light up.",
    whyThisOne: "Your walls don't need demolishing — they need a door. One shared feeling IS the door.",
    frequency: 'Once this week',
    linkedExerciseId: 'accessing-primary-emotions',
  };

  return {
    title: 'The Fortress',
    subtitle: 'You built a beautiful wall — including against the love',
    body: lenses.soulful,
    arc,
    practice: matchedPractice.instruction,
    oneThing: 'The wall keeps you safe AND alone. Install a door.',
    depth: 'quad',
    domains: ['foundation', 'stance', 'conflict', 'navigation'],
    confidence: 'high',
    patternId: 'fortress',
    patternName: 'The Fortress',
    lenses,
    matchedPractice,
    invitation: 'The wall keeps you safe AND alone. Install a door.',
    evidenceLevel: 'strong',
    keyCitations: ['Tseng et al., 2024', 'Conradi & Kamphuis, 2025'],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PATTERN 3 — THE FIRE ALARM
// Fires when: anxiety > 4.5 AND reactivity > 65 AND forcing > 3.5 AND managing_own < 40
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchFireAlarm(s: IntegrationScores): IntegrationResult | null {
  const anxiety = getAnxiety(s);
  const reactivity = getReactivity(s);
  const forcing = getForcing(s);
  const managingOwn = getEQManagingSelf(s);

  if (!(anxiety > 4.5 && reactivity > 65 && forcing > 3.5 && managingOwn < 40)) return null;

  const lenses: LensedNarrative = {
    therapeutic: `Your nervous system is stuck in sympathetic activation — the fight response. High emotional sensitivity detects the threat. Attachment anxiety (${anxiety.toFixed(1)}) amplifies it. Emotional reactivity (${Math.round(reactivity)}) ignites. Forcing (${forcing.toFixed(1)}) expresses it. And low self-regulation (${Math.round(managingOwn)}) means there's no brake pedal.

In Gottman's framework, this pattern produces criticism — the first of the Four Horsemen. Not because you're cruel, but because your anxiety says "if I can make them understand how badly this hurts, they'll change." The antidote Gottman identified: the soft startup. "I feel [emotion] about [situation], and I need [request]." Same content, completely different nervous system impact.

The transdiagnostic EFT research explicitly links chronic emotional vulnerability — including anxiety and flooding — to interactional cycles and outlines strategies to soothe vulnerabilities within the couple context. The clinical recommendation from the research: start with regulation BEFORE enactment. Brief calming, containment, and acceptance strategies to reduce flooding so that deeper relational work can proceed safely.

In IFS terms, a firefighter part takes over when your system gets overwhelmed. It's not trying to win the argument. It's trying to stop the pain RIGHT NOW. The urgency is real. The strategy creates more of what it's trying to prevent.`,

    soulful: `There is a fire in you that was never meant to burn this hot. The sensitivity that makes you feel everything — every shift, every distance, every change in your partner's tone — that sensitivity is a gift. A rare one. Most people walk through the relational field half-asleep. You are painfully, beautifully awake.

In Jungian psychology, fire belongs to the archetype of the Passionate Seeker — the one who cannot rest when something is wrong, who pursues truth and closeness with an intensity that both attracts and overwhelms. The fire is sacred. In every tradition, fire is both destroyer and transformer — Prometheus stole it to give humanity consciousness itself. Your fire is consciousness. But consciousness without containment is a wildfire. As Rumi wrote: "Set your life on fire. Seek those who fan your flames." The question is whether your flame warms or burns those closest to you.

The Shadow of this archetype is not the fire itself — it's the unconscious belief that intensity equals connection. That if you can make them FEEL how much this hurts, they'll finally understand. But as bell hooks observed: "Rarely, if ever, are any of us healed in isolation. Healing is an act of communion." Communion requires two nervous systems that can be in the same room. When yours is on fire, theirs shuts down. Not because they don't care. Because biology won't let them stay.

The field between you does not need less fire. It needs a hearth — the ancient symbol of home, where fire is held by stone, where warmth radiates without consuming. In ecopsychology, we learn that controlled burns are essential to forest health — fire that is tended renews the soil, clears deadwood, makes space for new growth. Uncontrolled fire destroys. The difference is not the fire. It's the container. As the poet David Whyte wrote: "The only choice we have as we mature is how we inhabit our vulnerability, how we become larger and more courageous and more compassionate through our intimacy with disappearance."

One hand on your chest. One breath before the next word. That is the hearth. That is everything.`,

    practical: `THE PATTERN: Anxiety detects distance → reactivity ignites → you escalate → partner retreats → distance grows → anxiety spikes → repeat.

THE COST: Your partner can't hear the love underneath the volume.

THIS WEEK: When the fire rises — and you'll feel it in your body first (chest tightens, jaw clenches, heat rises) — do ONE thing before speaking:

Put your hand on your chest. Take one breath. Then say: "I'm getting activated. Give me 60 seconds."

That's not weakness. That's the strongest relational move there is. You're choosing the relationship over the reaction.

AFTER 60 seconds: say what you were going to say, but at half the volume. Same message. Different delivery.`,

    developmental: `In Erikson's framework, you're doing the work of Intimacy vs. Isolation with a specific challenge: your emotional intensity creates the very isolation you're fighting against. You WANT closeness. You pursue it fiercely. But the intensity of the pursuit pushes people away.

Developmentally, this pattern often traces to environments where emotional needs were inconsistently met — sometimes responded to, sometimes ignored. The nervous system learned: louder gets heard. More intense gets noticed. The escalation was adaptive once. It got you the attention that survival required.

In Kegan's framework, the developmental move is from reactive (your emotions drive your behavior) to reflective (you can HAVE your emotions without BEING them). That's the subject-to-object shift: anxiety moves from being something you ARE to something you NOTICE. You don't feel less. You see more. And in the gap between feeling and acting, you find choice.`,

    relational: `Here's what your partner experiences when the fire alarm goes off:

First: the shift. They see your face change, your body tense, your voice sharpen. Before you've said a word, their nervous system has already registered: incoming.

Then: the intensity. You ARE sensing something real. Your perception is accurate. Something DID shift between you. But the delivery — fueled by anxiety and low regulation — overwhelms the message. Your partner can't hear the love underneath the force. They hear: attack. And they respond to the attack, not to the love.

Here's the tragedy: the VOLUME is proportional to how much this relationship matters to you. The more you care, the louder it gets. But your partner experiences it as pressure, as criticism, as "I can't get anything right." They retreat — which confirms your fear — which escalates your intensity. The cycle is airtight.

What they need: the same care, at half the volume. "I'm worried about us" instead of "You NEVER listen." Same heart, completely different nervous system impact on the person you love.`,

    simple: `The fire in you is love.
But love at that temperature scalds.
Your partner can't hear you through the heat.

Same message. Half the volume.
That's the whole practice.`,
  };

  const arc: DevelopmentalArc = {
    wound: 'Your needs were met inconsistently — sometimes heard, sometimes ignored. Your nervous system learned: louder gets attended to.',
    protection: 'You developed intensity as a strategy for being heard. The fire was adaptive — it cut through the noise and secured attention.',
    cost: "Your partner can't hear the love underneath the volume. They retreat from the heat, which confirms your fear, which escalates the fire.",
    emergence: 'Same fire, contained in a hearth. Not less feeling — more capacity to hold the feeling. One breath between the sensation and the sentence.',
  };

  const matchedPractice: MatchedPractice = {
    name: 'The 60-Second Pause',
    modality: 'Gottman + DBT',
    instruction: "When the fire rises (chest tight, jaw clenched, heat rising), put your hand on your chest. Take one breath. Say: 'I'm getting activated. Give me 60 seconds.' After 60 seconds, say what you were going to say at half the volume. Same message, different delivery.",
    whyThisOne: "Your intensity IS caring. The practice isn't feeling less — it's delivering the same care at a temperature your partner can receive.",
    frequency: 'Every time the fire rises — aim for once this week',
    linkedExerciseId: 'repair-attempt',
  };

  return {
    title: 'The Fire Alarm',
    subtitle: 'Your love burns so hot it scalds',
    body: lenses.soulful,
    arc,
    practice: matchedPractice.instruction,
    oneThing: 'Same love. Half the volume. That\'s the whole practice.',
    depth: 'quad',
    domains: ['foundation', 'stance', 'conflict', 'navigation'],
    confidence: 'high',
    patternId: 'fire_alarm',
    patternName: 'The Fire Alarm',
    lenses,
    matchedPractice,
    invitation: 'Same love. Half the volume. That\'s the whole practice.',
    evidenceLevel: 'moderate',
    keyCitations: ['Bazyari et al., 2024', 'Gottman Method longitudinal research'],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PATTERN 4 — THE WISE HELPER
// Fires when: perception > 70 AND managing_others > 70 AND agreeableness > 70 AND fusion > 60
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchWiseHelper(s: IntegrationScores): IntegrationResult | null {
  const perception = getEQPerception(s);
  const managingOthers = getEQManagingOthers(s);
  const agreeableness = getA(s);
  const fusion = getFusion(s);

  if (!(perception > 70 && managingOthers > 70 && agreeableness > 70 && fusion > 60)) return null;

  const lenses: LensedNarrative = {
    therapeutic: `Your emotional intelligence is genuinely high — you read others accurately (${Math.round(perception)}) and you're skilled at helping them regulate (${Math.round(managingOthers)}). Your agreeableness (${Math.round(agreeableness)}) means you orient toward harmony and others' wellbeing. But your fusion score (${Math.round(fusion)}) reveals the cost: you merge with others' emotional states so completely that you lose track of your own.

In IFS terms, a caretaker part has become your primary identity. It developed in a context where your value came from what you provided, not who you were. Research on EFT shows that "over-functioning" creates reciprocity imbalances that erode mutuality — one partner gives, the other receives, and neither experiences the full relational exchange.

Clinical trials demonstrate that EFT can surface the emotional costs of chronic giving and create corrective experiences where needs are met reciprocally. The matched intervention: EFT to help the helper experience and communicate their OWN needs, followed by concrete reciprocity practices to rebalance the exchange.`,

    soulful: `You hold space for everyone. In every friendship, in every room, in every crisis — you are the steady one. The one who senses what others need and provides it. The one who absorbs the tension and gives back calm. The one who is never too much, never inconvenient, never the one who needs holding.

Jung would recognize you as living in the archetype of the Great Mother — the universal nurturer, the one whose identity is woven from the act of giving. But Jung also warned: the Great Mother has a shadow. When giving becomes compulsive, when the identity cannot survive without someone to save, the nurturer becomes a prisoner of their own generosity. As Clarissa Pinkola Estés wrote in Women Who Run With the Wolves: "If you have ever been called defiant, incorrigible, forward, cunning, insurgent, unruly, rebellious, you're on the right track." Your rebellion — should you choose it — is the act of receiving.

Who holds space for you? Not because they won't. Because you never let them. Khalil Gibran understood this architecture of love: "Let there be spaces in your togetherness, and let the winds of the heavens dance between you." But in your togetherness, there is only one wind — yours, always blowing toward them. Thomas Moore, in Care of the Soul, wrote that genuine care requires both giving AND receiving: "The soul needs the experience of being dependent, of being cared for, as much as it needs to care."

Ecopsychology teaches that in healthy ecosystems, reciprocity is the law. The mycorrhizal network beneath a forest — the "wood wide web" — flows nutrients in both directions. Trees that only give without receiving eventually hollow out. You are hollowing. Not visibly. The outside still looks strong, still looks giving, still looks fine. But the inside aches with a hunger you've forbidden yourself to name.

The field between you and your partner is tilted. Love flows one way. Not because your partner is selfish — because you've trained them, with years of gentle over-functioning, to expect that you'll be fine. As Pema Chödrön teaches: "Compassion is not a relationship between the healer and the wounded. It's a relationship between equals." The invitation: let someone in. Not to help. Just to see you. As Mary Oliver asked in her luminous simplicity: "Tell me, what is it you plan to do with your one wild and precious life?" Perhaps the answer begins with letting it be held by someone other than yourself.`,

    practical: `THE PATTERN: Others feel something → you sense it → you help them regulate → they feel better → you feel needed → your own feelings stay unprocessed → repeat.

THE COST: You're everyone's therapist and no one's partner.

THIS WEEK: When your partner asks "How was your day?" — don't say "Fine." Say something true. Not a crisis. Just something real:

"Actually, it was hard."
"I felt lonely today."
"I need some quiet tonight."

Then — this is the hard part — LET THEM RESPOND. Don't manage their reaction. Don't reassure them that you're okay. Let them hold something for you, even if it's small.`,

    developmental: `Your developmental position is complex. You've developed extraordinary OTHER-awareness (perception, managing others) — capacities that most people spend years in therapy trying to build. But your SELF-awareness and self-differentiation are lagging behind.

In Kegan's terms, you may be at a sophisticated version of the Socialized Mind (Order 3) — your identity is constructed through relationships, through being needed, through how others experience you. The move toward Self-Authoring (Order 4) requires a specific and uncomfortable recognition: your value exists independently of what you provide.

This is the developmental crisis of the helper: the skills that make you extraordinary in relationship are the same skills that prevent you from being fully IN the relationship as yourself. The move is not to become less empathic. It's to add a second channel: empathy toward SELF, running alongside empathy toward other. Both at once. That's differentiation. Not a wall — a second instrument.`,

    relational: `Here's what your partner experiences:

They feel incredibly cared for. Understood. Held. You anticipate their needs, you regulate their emotions, you make the relationship feel safe and warm. They probably tell their friends how lucky they are.

But there's something they can't quite name. A distance. An asymmetry. They might say: "I never really know how they're doing." Or: "They always say they're fine." Or, most painfully: "Sometimes I feel like I'm their project, not their partner."

They've tried to give back. But you deflect care the way other people deflect criticism — smoothly, invisibly, without either of you noticing. They offer help; you say you've got it. They ask what you need; you redirect to what they need. The pattern is so gentle, so loving, so competent, that neither of you realizes: you're starving in front of a full table because you won't let anyone serve you.

What they need: to feel USEFUL to you. To know that you need them, not just that they need you. One vulnerable request would change the entire dynamic.`,

    simple: `You hold space for everyone.
No one holds space for you.
Not because they won't.
Because you never let them.

Let someone in this week. Not to help you. To see you.`,
  };

  const arc: DevelopmentalArc = {
    wound: 'Somewhere, you learned that your value came from what you provided — not from who you are.',
    protection: 'You became the one who holds, who senses, who gives. A beautiful, exhausting identity built on service.',
    cost: "You're starving in front of a full table because you won't let anyone serve you. Your partner feels the asymmetry even if they can't name it.",
    emergence: 'Add a second channel: empathy toward self, running alongside empathy toward other. Let someone hold space for you.',
  };

  const matchedPractice: MatchedPractice = {
    name: 'Let Them Hold Something',
    modality: 'EFT',
    instruction: "When your partner asks 'How was your day?' — don't say 'Fine.' Say something true: 'Actually, it was hard.' Then LET THEM RESPOND. Don't manage their reaction. Don't reassure them. Let them hold something for you, even if it's small.",
    whyThisOne: "Your partner needs to feel useful to you — not just needed BY you. One vulnerable request rebalances the entire dynamic.",
    frequency: 'Once this week',
    linkedExerciseId: 'hold-me-tight',
  };

  return {
    title: 'The Wise Helper',
    subtitle: 'You hold space for everyone — except yourself',
    body: lenses.soulful,
    arc,
    practice: matchedPractice.instruction,
    oneThing: "You've held space for everyone. Let someone hold space for you.",
    depth: 'quad',
    domains: ['navigation', 'instrument', 'stance'],
    confidence: 'high',
    patternId: 'wise_helper',
    patternName: 'The Wise Helper',
    lenses,
    matchedPractice,
    invitation: "You've held space for everyone. Let someone hold space for you.",
    evidenceLevel: 'moderate',
    keyCitations: ['EFT reciprocity research', 'Conradi & Kamphuis, 2025'],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PATTERN 5 — THE RELATIONAL PHILOSOPHER
// Fires when: openness > 65 AND perception > 65 AND i_position > 60 AND problem_solving > 3.5
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchRelationalPhilosopher(s: IntegrationScores): IntegrationResult | null {
  const openness = getO(s);
  const perception = getEQPerception(s);
  const iPosition = getIPosition(s);
  const problemSolving = getProblemSolving(s);

  if (!(openness > 65 && perception > 65 && iPosition > 60 && problemSolving > 3.5)) return null;

  const lenses: LensedNarrative = {
    therapeutic: `Your profile reveals a specific and common therapeutic challenge: the insight-action gap. Your perception is strong (${Math.round(perception)}), your openness to experience is high (${Math.round(openness)}), your I-position is solid (${Math.round(iPosition)}), and your conflict approach is problem-solving (${problemSolving.toFixed(1)}). You have the relational intelligence to SEE patterns clearly.

Research addresses this directly. EFT's experiential techniques are designed to move clients from conceptual understanding to felt affect and corrective interactional experiences. ACT's committed action component converts insight into repeated, values-consistent behavioral experiments. The clinical recommendation: experiential access first (EFT) to create felt motivation, then small behavioral experiments (ACT) to build embodiment and habit.`,

    soulful: `You understand everything. You can name your attachment style, describe your negative cycle, explain why your partner does what they do. You've read the books. You've thought the thoughts. Your mind is a beautiful instrument for seeing relational patterns.

And yet. Jung himself warned of this exact trap: "One does not become enlightened by imagining figures of light, but by making the darkness conscious." You have made the darkness conscious. Brilliantly. But consciousness was never the destination — it was the trailhead. The archetype here is the Eternal Student — the one who gathers wisdom endlessly but delays the moment of descent into the underworld where wisdom must be lived, not known. In every hero's journey, there comes the moment when the map must be put down and the territory entered. Odysseus couldn't read his way home. He had to sail.

The existentialists understood this. Kierkegaard wrote: "Life can only be understood backwards; but it must be lived forwards." You've mastered the backwards understanding. The forwards living — the messy, awkward, unscripted act of doing something different in your body, in real time — that's where your edge lives. Thomas Moore wrote in Care of the Soul: "The soul doesn't evolve or grow, it cycles and deepens." Your cycling has been entirely cerebral. The deepening requires descent into the body, into action, into the possibility of failure.

This is not a failure of intelligence. It is the specific spiritual crisis of the intellectual — what James Hillman called "psychologizing as defense": using insight to avoid the raw experience insight was meant to prepare you for. The gap between your relational IQ and your relational behavior is the most important distance in your life right now. As Pema Chödrön taught: "Nothing ever goes away until it has taught us what we need to know." Your pattern has taught you everything. Now it's waiting for you to move. One different action. Today.`,

    practical: `THE PATTERN: You see the pattern → you understand the pattern → you explain the pattern → you continue doing the exact same thing.

THE COST: Understanding without action is just sophisticated stuckness.

THIS WEEK: Pick ONE insight you've had about your relationship — something you KNOW but haven't DONE. And do it. Once. Imperfectly.

If you know you should soften your approach: soften it once.
If you know you should share more: share once.
If you know you should stay instead of leaving: stay once, for 60 seconds longer.

Not understanding more. DOING one thing differently. That's the only insight that counts.`,

    developmental: `You've achieved something rare: the capacity to observe your own relational patterns while they're happening. In Kegan's framework, this is the hallmark of the Self-Authoring Mind (Order 4) — you can take your own emotions and behaviors as OBJECT, examining them from a distance rather than being driven by them.

The developmental edge: you've OVER-developed the observation and UNDER-developed the embodiment. You can watch yourself from the balcony with extraordinary clarity. But you've forgotten how to dance on the floor. The developmental move isn't more observation — it's DESCENT. Coming down from the balcony into the body. Into the awkward, messy, unscripted moment of doing something different without knowing how it'll land.

In Erikson's terms, your Generativity might be trapped in the conceptual — generating ideas about relationship instead of generating relational life itself.`,

    relational: `Here's what your partner experiences:

Conversations with you about the relationship are brilliant. You can articulate the dynamic, name the pattern, explain both sides with insight and compassion. They leave these conversations feeling understood and hopeful.

Then nothing changes. The same patterns play out the same way. And your partner realizes: the conversations ARE the thing. Not preparation for change. A substitute for it.

They might describe it as: "They get it. They really get it. But then it's like the conversation never happened." This is deeply confusing for a partner, because the understanding is genuine. The gap isn't in your SEEING. It's in your DOING.

What they need isn't another insightful conversation. It's one moment where you do something DIFFERENT. Without explaining it first, without analyzing it after. Just one changed action. That would mean more to them than all the understanding in the world.`,

    simple: `You understand everything.
You embody almost nothing.
The gap between insight and action is the only one that matters.

This week: one thing you know, done differently. Not understood differently. Done.`,
  };

  const arc: DevelopmentalArc = {
    wound: 'You learned that understanding was power — and it was. Insight protected you from being blindsided by relational pain.',
    protection: 'You became the observer, the analyzer, the one who sees everything from the balcony. Safe, clear, above the mess.',
    cost: 'Your partner gets brilliant conversations and unchanged behavior. Understanding has become a substitute for action.',
    emergence: 'Come down from the balcony. One different action, imperfectly done, is worth more than perfect insight.',
  };

  const matchedPractice: MatchedPractice = {
    name: 'One Different Action',
    modality: 'ACT',
    instruction: "Pick ONE insight you've had about your relationship — something you KNOW but haven't DONE. And do it. Once. Imperfectly. If you know you should soften: soften once. If you know you should share: share once. If you know you should stay: stay once, for 60 seconds longer.",
    whyThisOne: "You have enough insight. What you need is embodiment — the awkward, messy practice of doing something different.",
    frequency: 'Once this week',
    linkedExerciseId: 'relationship-values-compass',
  };

  return {
    title: 'The Relational Philosopher',
    subtitle: 'You understand everything — and embody almost nothing',
    body: lenses.soulful,
    arc,
    practice: matchedPractice.instruction,
    oneThing: 'You understand enough. Start embodying.',
    depth: 'quad',
    domains: ['instrument', 'navigation', 'stance', 'conflict'],
    confidence: 'high',
    patternId: 'relational_philosopher',
    patternName: 'The Relational Philosopher',
    lenses,
    matchedPractice,
    invitation: 'You understand enough. Start embodying.',
    evidenceLevel: 'moderate',
    keyCitations: ['EFT experiential techniques', 'Barraca Mairal et al., 2024'],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PATTERN 6 — THE ANXIOUS-AVOIDANT IN ONE BODY
// Fires when: anxiety > 4.0 AND avoidance > 4.0
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchAnxiousAvoidant(s: IntegrationScores): IntegrationResult | null {
  const anxiety = getAnxiety(s);
  const avoidance = getAvoidance(s);

  if (!(anxiety > 4.0 && avoidance > 4.0)) return null;

  const lenses: LensedNarrative = {
    therapeutic: `This is the most painful attachment configuration. Your nervous system is running two contradictory programs simultaneously: approach (anxiety: ${anxiety.toFixed(1)}) and withdraw (avoidance: ${avoidance.toFixed(1)}). You want closeness AND you're terrified of it. The behavioral result is what partners experience as unpredictability — warmth followed by retreat, reaching followed by pushing away.

In attachment theory, this maps to the fearful-avoidant or disorganized style, which research associates with the most distress and the most complex therapeutic needs. The transdiagnostic EFT literature acknowledges this as competing attachment strategies that maintain unstable cycles. The clinical recommendation: individualized sequencing that prioritizes safety and clarity around ambivalent needs with EFT mapping, then ACT strategies to build committed actions that tolerate the ambivalence.

In IFS terms, you have protectors pulling in opposite directions — one part reaching desperately for connection, another part slamming the door the moment connection gets close. Neither is wrong. Both are trying to keep you safe. The work is in Self-leadership: the capacity to hold both parts with compassion without letting either hijack the whole system.`,

    soulful: `You want closeness. You are terrified of closeness. Both at once. Every day. This is the archetype of the Shapeshifter — the figure who moves between worlds, never fully belonging to either. In mythology, shapeshifters are sacred and terrifying: Proteus, who held all forms and none. The selkie, caught between ocean and shore. Your inner life is that liminal space — the threshold between reaching and retreating, longing and defense.

Jung called this the union of opposites — the central work of individuation. But for you, the opposites are not abstract concepts. They live in your body. The warmth that floods your chest when your partner smiles, and the cold terror that follows three seconds later: "If I let this in, it can destroy me." As Rumi wrote: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it." Your barriers are not walls. They are oscillations — the exhausting rhythm of approach-retreat that never resolves into either full contact or clean distance.

This is the wound the alchemists called the nigredo — the blackening, the stage of dissolution where opposites war within the vessel before integration can occur. Clarissa Pinkola Estés understood: "The doors to the world of the wild Self are few but precious. If you have a deep scar, that is a door. If you have an old, old story, that is a door." Your oscillation IS the door. Not a malfunction — a passage. The exhaustion you feel is labor, not failure. Something is trying to be born in you: the capacity to hold both the reaching and the fear, simultaneously, without letting either one drive.

Here is what no one has told you: this pattern is the most rational response to an irrational situation. Your nervous system solved an impossible problem: loving people who were both source of comfort and source of pain. As the Sufi poets knew: "The wound is the place where the Light enters you." One small step toward. Not a leap. A step. Then rest. Then another. Then rest. The rest is not retreat. It is the breath between contractions.`,

    practical: `THE PATTERN: You approach → closeness triggers fear → you retreat → distance triggers longing → you approach → repeat.

THE COST: Your partner never knows which version of you is arriving.

THIS WEEK: Pick one direction and stay in it for one day. Not forever. One day.

If you choose TOWARD: reach once, and when the urge to retreat comes (it will), tell your partner: "I want to stay close right now, even though part of me wants to pull away."

If you choose AWAY: take your space, and when the urge to reach comes (it will), tell your partner: "I need space right now, but I'm not leaving. I'll be back."

The practice isn't in choosing the "right" direction. It's in NAMING what's happening, out loud, so your partner isn't left guessing.`,

    developmental: `In developmental terms, this pattern often reflects an early environment where the attachment figure was simultaneously the source of safety and the source of threat — what attachment research calls the "fright without solution" paradox. The child cannot approach (because the parent is scary) and cannot flee (because the parent is the only safety).

Your development was disrupted at the most fundamental level: the capacity to organize a coherent attachment strategy. Other patterns (anxious, avoidant) are organized — they have a consistent strategy. Yours has two, and they contradict each other.

The developmental work is INTEGRATION — not choosing between approach and avoidance, but developing the capacity to hold both needs simultaneously with awareness. In Kegan's terms, making both strategies OBJECT rather than SUBJECT. "I notice the part of me that wants to reach, AND the part that wants to retreat" — that observation IS the integration. It's the beginning of a third option: staying present with the ambivalence instead of being driven by whichever impulse is loudest.`,

    relational: `Here's what your partner experiences:

Confusion. Deep, disorienting confusion. Monday you're warm, present, reaching for them. Tuesday you're distant, sealed, unreachable. They learn to walk on eggshells — not because you're angry, but because they never know which relational weather to prepare for.

They may describe it as: "I never know where I stand." Or: "Just when I think we're close, they disappear." They're not wrong. They're reading you accurately. But what they can't see is that you're experiencing the same confusion FROM THE INSIDE. You don't know which impulse will win either.

What they need is narration. Not prediction (you can't predict it). Narration: "I'm feeling pulled in two directions right now — I want to be close AND I want space." That sentence doesn't solve anything. But it transforms your partner's experience from "they're being erratic" to "they're being honest about something really hard." That's the bridge.`,

    simple: `You want closeness.
You fear closeness.
Both true. Every day.

One small step toward. Then rest. Then another.`,
  };

  const arc: DevelopmentalArc = {
    wound: 'The people you loved were both comfort and threat. Your nervous system solved an impossible problem: approach and avoid at the same time.',
    protection: 'The oscillation IS the protection — never fully committing to closeness (which could hurt) or distance (which could abandon).',
    cost: "Your partner lives in relational weather they can never predict. The exhaustion — yours and theirs — is enormous.",
    emergence: 'Integration: holding both impulses with awareness instead of being driven by whichever is loudest. Naming the contradiction IS the third option.',
  };

  const matchedPractice: MatchedPractice = {
    name: 'Name the Direction',
    modality: 'EFT + ACT',
    instruction: "Pick one direction and stay in it for one day. If TOWARD: reach once, and when the urge to retreat comes, say 'I want to stay close right now, even though part of me wants to pull away.' If AWAY: take space, and say 'I need space right now, but I'm not leaving. I'll be back.'",
    whyThisOne: "The practice isn't choosing the right direction — it's NAMING what's happening so your partner isn't left guessing.",
    frequency: 'Once this week',
    linkedExerciseId: 'recognize-cycle',
  };

  return {
    title: 'The Anxious-Avoidant in One Body',
    subtitle: 'You want closeness AND fear it — both true, every day',
    body: lenses.soulful,
    arc,
    practice: matchedPractice.instruction,
    oneThing: "You want closeness AND fear it. Both are true. Move toward it anyway, one inch at a time.",
    depth: 'pairwise',
    domains: ['foundation'],
    confidence: 'high',
    patternId: 'anxious_avoidant_one_body',
    patternName: 'The Anxious-Avoidant in One Body',
    lenses,
    matchedPractice,
    invitation: "You want closeness AND fear it. Both are true. Move toward it anyway, one inch at a time.",
    evidenceLevel: 'strong',
    keyCitations: ['Transdiagnostic EFT literature', 'Tseng et al., 2024'],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PATTERN 7 — THE VALUES-BEHAVIOR SPLIT
// Fires when: any values_gap > 2.5 AND (avoiding > 3.5 OR yielding > 3.5)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchValuesBehaviorSplit(s: IntegrationScores): IntegrationResult | null {
  const biggestGap = getBiggestGapValue(s);
  const avoiding = getAvoiding(s);
  const yielding = getYielding(s);

  if (!biggestGap || !(biggestGap.gap > 2.5 && (avoiding > 3.5 || yielding > 3.5))) return null;

  const gapDomain = biggestGap.value;
  const gapSize = biggestGap.gap;

  const lenses: LensedNarrative = {
    therapeutic: `ACT research provides the strongest framework for this pattern. A 2024 meta-analysis reported a large effect on marital satisfaction (g = -1.23) for ACT in couple contexts. An RCT with 52 couples showed significant improvements in empathy, adaptability, and couple functioning after 8 sessions of ACT.

The mechanism: psychological flexibility — the capacity to hold uncomfortable internal experiences while still moving toward what matters. Your values are clear (your importance scores are high). Your behavior under pressure goes the other direction. ACT calls this fusion with internal experience — the discomfort of values-aligned action feels too large to tolerate, so the behavior defaults to safety (avoidance or yielding) rather than truth.

The intervention is sequential: EFT to secure the attachment context (make it safe enough to be honest), then ACT values clarification and committed action — specific behavioral experiments that build the muscle of doing what matters even when it's uncomfortable.`,

    soulful: `You know what matters. Your compass is clear — your top value is not a vague aspiration. It is a deep, felt knowing about who you want to be in this relationship. And there is a gap between that knowing and your living. Jung called this the tension between the Self (who you truly are) and the Persona (who you perform to keep the peace). The gap between them is where the Shadow grows — not evil, but exiled truth.

That gap is where the suffering lives. Not in the conflict. Not in your partner's behavior. In the distance between who you are and who you know yourself to be. As Søren Kierkegaard wrote: "The most common form of despair is not being who you are." Every time you swallow the truth, every time you accommodate when your compass says "speak," every time you choose safety over authenticity — the gap widens. The alchemists called this the prima materia — the raw, unworked material of the soul that must be confronted before gold can emerge. Your prima materia is the unsaid.

In ecopsychology, there is a concept called "ecological grief" — the sorrow we feel when we witness living systems being diminished. Your relationship has its own ecology, and every swallowed truth is a small extinction. The songbird of your authenticity goes quiet. The river of your desire runs underground. Eventually the landscape looks fine — maintained, orderly, pleasant — but something essential has been removed. Wendell Berry wrote: "The world is not a problem to be solved; it is a living being to which we belong." Your relationship is not a problem to be managed with accommodation. It is a living being that needs your full presence to thrive.

You are not a hypocrite. You are a person whose nervous system hasn't learned yet that the discomfort of truth is survivable. As David Whyte wrote: "The courageous conversation is the one you don't want to have." The gap closes one sentence at a time. One small, true thing. "That matters to me." "I feel differently." Each sentence is a step toward the person your values know you already are. As Rilke counseled: "Let everything happen to you: beauty and terror. Just keep going. No feeling is final."`,

    practical: `THE GAP: Your biggest values gap is in ${gapDomain} (gap: ${gapSize.toFixed(1)}) — where your importance score is high but your accordance (how much you live it) is low.

THE PATTERN: You know what's true → discomfort arrives → you avoid or yield → the truth stays unspoken → the gap grows.

THIS WEEK: Say one thing that closes the gap by one millimeter. The smallest possible values-aligned action:

"That matters to me."
"I'd prefer something different."
"I haven't been fully honest about this."

Not the hardest truth. The easiest one you've been avoiding. Start there.`,

    developmental: `In ACT terms, you're experiencing the gap between values clarity (which is high — you KNOW what matters) and committed action (which is low — you don't DO what matters under pressure). This gap is not a character flaw. It's a developmental stage.

Kegan would describe it as the moment where your values have reached Order 4 (self-authored, clear, internally generated) but your behavior is still at Order 3 (socially determined, shaped by what feels safe in the relationship, responsive to the other rather than to your internal compass). Your mind has grown faster than your nervous system.

The developmental move: building tolerance for the discomfort of alignment. Every time you speak a truth that your anxiety says is dangerous, you're TRAINING the nervous system to update its threat model. "I said the hard thing. The relationship survived. I survived." That's not just a practice — it's neuroplasticity. The gap closes through accumulated evidence that honesty is survivable.`,

    relational: `Here's what your partner may not realize:

Every accommodation costs you something. Every "I'm fine" when you're not fine creates a micro-distance. They can't feel it yet — the relationship looks smooth, conflict-free, easy. But underneath, resentment is building. Not angry resentment. Sad resentment. The kind that sounds like: "They don't even know me. And it's my fault, because I never showed them."

Your partner would almost certainly rather hear your truth than your accommodation. Research consistently shows that partners prefer authenticity over ease. The temporary discomfort of honesty is far less damaging than the slow erosion of inauthenticity.

When you finally do speak — and you will, because the pressure eventually finds a crack — it may come out at higher volume than intended, carrying the accumulated weight of everything you swallowed. Your partner will be blindsided: "Where did this come from? I thought everything was fine." The answer: it was never fine. You just never said so.

Start small. Start now. Before the pressure builds.`,

    simple: `You know what's true.
You can't bring yourself to say it.
Every silence makes the gap wider.

One true sentence this week. Start there.`,
  };

  const arc: DevelopmentalArc = {
    wound: 'Speaking your truth was risky — the relationship, the peace, the connection felt too fragile to survive your honesty.',
    protection: 'You swallowed what was true to keep what was safe. It worked — the surface stayed smooth.',
    cost: 'A quiet despair: betraying yourself in slow motion. Resentment building under accommodation.',
    emergence: 'The discomfort of truth is survivable. One small, true thing, spoken aloud, closes the gap.',
  };

  const matchedPractice: MatchedPractice = {
    name: 'One Values-Aligned Sentence',
    modality: 'ACT',
    instruction: "Say one thing this week that closes the gap between your values and your behavior. The smallest possible truth: 'That matters to me.' 'I'd prefer something different.' 'I haven't been fully honest about this.' Not the hardest truth — the easiest one you've been avoiding.",
    whyThisOne: 'Your values are clear. Your behavior under pressure defaults to safety. This practice builds the muscle of alignment.',
    frequency: 'Once this week',
    linkedExerciseId: 'relationship-values-compass',
  };

  return {
    title: 'The Values-Behavior Split',
    subtitle: 'You know what matters — and swallow it under pressure',
    body: lenses.soulful,
    arc,
    practice: matchedPractice.instruction,
    oneThing: 'The discomfort of truth is less than the slow erosion of swallowing it.',
    depth: 'pairwise',
    domains: ['compass', 'conflict'],
    confidence: 'high',
    patternId: 'values_behavior_split',
    patternName: 'The Values-Behavior Split',
    lenses,
    matchedPractice,
    invitation: 'The discomfort of truth is less than the slow erosion of swallowing it.',
    evidenceLevel: 'strong',
    keyCitations: ['Barraca Mairal et al., 2024', 'Mirbagheri et al., 2025'],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PATTERN 8 — THE UNLIVED LIFE
// Fires when: perception > 65 AND i_position > 60 AND biggest values gap > 2.5
// (Distinct from VALUES-BEHAVIOR SPLIT: person generally DOES take action —
//  some values have high accordance alongside the gap)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function matchUnlivedLife(s: IntegrationScores): IntegrationResult | null {
  const perception = getEQPerception(s);
  const iPosition = getIPosition(s);
  const biggestGap = getBiggestGapValue(s);

  if (!biggestGap || !(perception > 65 && iPosition > 60 && biggestGap.gap > 2.5)) return null;

  // Distinguish from Values-Behavior Split: check that the person has SOME values
  // with high accordance (they generally DO take action, just not in the gap domain)
  const domains = s.values?.domainScores;
  if (domains) {
    const accordances = Object.values(domains).map(d => d.accordance);
    const hasHighAccordance = accordances.some(a => a >= 3.5);
    if (!hasHighAccordance) return null; // If no high accordance, this is Values-Behavior Split territory
  }

  const gapDomain = biggestGap.value;
  const gapSize = biggestGap.gap;

  const lenses: LensedNarrative = {
    therapeutic: `This pattern is distinct from the Values-Behavior Split because you DO take values-aligned action in general. You have the capacity AND the willingness. But something is holding you back in the specific domains where your gaps are largest.

Your high perception and solid I-position mean you have the internal resources. This isn't a skills deficit. It's an existential question: what are you waiting for? Research shows that couples with the capacity for deep intimacy who don't activate it experience a specific kind of frustration — the suffering of unused potential. The intervention is less about building capacity (you have it) and more about removing the obstacle to using it.`,

    soulful: `You have everything you need. The perception to sense the field. The ground to hold your own center. The values to know what matters. And yet: a gap in the domain that matters most. Not because you can't. Because you haven't.

Jung wrote about the unlived life with devastating clarity: "Nothing has a stronger influence psychologically on their environment and especially on their children than the unlived life of the parent." But the unlived life doesn't only haunt children. It haunts the one who carries it. You are the archetype of the Reluctant Hero — standing at the threshold of the cave, sword in hand, allies beside you, and still you wait. Joseph Campbell called this the "Refusal of the Call" — the most dangerous moment in the hero's journey, because the longer you wait, the more the cave seems to darken.

This is the most bittersweet pattern in the matrix. Not the pain of inability — the ache of the unlived. As the poet Mary Oliver asked: "Tell me, what is it you plan to do with your one wild and precious life?" You know the answer. The answer is clear inside you like a bell. But there is a strange comfort in potential — in keeping the dream alive by never testing it. Perhaps the deepest fear is not failure but confirmation: if you actually showed up fully and it still wasn't enough... that would be a grief with no bottom.

Ecopsychology offers a mirror: in nature, a seed that has everything it needs — soil, water, sun — but refuses to germinate is not "cautious." It is unlived. And eventually, the season passes. The poet David Whyte understood: "The price of our vitality is the sum of all our fears." Your vitality is not low — it is held in reserve. And the field between you — that living space between you and the person you love — it can feel the difference between someone who is fully here and someone who is holding back. As John O'Donohue wrote: "Your soul knows the geography of your destiny. Your soul alone has the map of your future."

You have everything you need. The threshold is not going to get more inviting. Go.`,

    practical: `You have the capacity. You have the values. You have the self.

THE QUESTION: What are you waiting for?

THIS WEEK: Take ONE action toward closing your biggest gap (${gapDomain}, gap: ${gapSize.toFixed(1)}). Not the safe version. The real one. The one you've been saving for "when the time is right."

The time is right. It's been right. Go.`,

    developmental: `In Erikson's framework, you may be at the edge of Generativity vs. Stagnation — the stage where the question becomes "Am I creating something meaningful with this life?" Your relationship is the primary canvas. Your values gaps suggest the canvas has space that hasn't been painted yet.

In Kegan's map, you have the Self-Authoring Mind. The next developmental horizon is Self-Transforming — where you let the relationship itself become a source of growth, not just a context for applying what you already know. The unlived parts of your relationship might be the very things that would catalyze that transformation.`,

    relational: `Your partner may sense that you're holding something in reserve. Not dishonesty — restraint. A sense that there's more of you than you're bringing. They might say: "I know there's more. I wish they'd let me see it." Or they might not say it at all, because the relationship is good enough that pushing feels ungrateful.

But "good enough" is the enemy of "profound." You have the capacity for profound. Your partner probably does too. The only thing missing is the full deployment of what you both have.`,

    simple: `You have everything you need.
You're using half of it.

The relationship you want is on the other side of the risk you haven't taken.
Go.`,
  };

  const arc: DevelopmentalArc = {
    wound: "Perhaps: the sense that if you showed up fully and it STILL wasn't enough, that would be unbearable. Safer to hold back.",
    protection: "You keep the possibility alive by never fully testing it. Potential feels safer than proof.",
    cost: "Good enough is the enemy of profound. You have the capacity for profound and you're settling for good enough.",
    emergence: "Deploy what you have. The relationship you want is on the other side of the risk you haven't taken.",
  };

  const matchedPractice: MatchedPractice = {
    name: 'The Real Version',
    modality: 'ACT + Existential',
    instruction: "Take ONE action this week toward closing your biggest values gap. Not the safe version — the real one. The one you've been saving for 'when the time is right.' The time is right. Go.",
    whyThisOne: "You have everything you need — capacity, values, self-awareness. The only thing missing is deployment.",
    frequency: 'Once this week',
    linkedExerciseId: 'relationship-values-compass',
  };

  return {
    title: 'The Unlived Life',
    subtitle: 'You have everything you need — and you\'re using half of it',
    body: lenses.soulful,
    arc,
    practice: matchedPractice.instruction,
    oneThing: 'You have everything you need. Start using it.',
    depth: 'triple',
    domains: ['navigation', 'stance', 'compass'],
    confidence: 'high',
    patternId: 'unlived_life',
    patternName: 'The Unlived Life',
    lenses,
    matchedPractice,
    invitation: 'You have everything you need. Start using it.',
    evidenceLevel: 'theoretical',
    keyCitations: ['ACT committed action framework', 'Existential therapy literature'],
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN MATCHER — checks all 8 patterns in priority order
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function matchTier1Pattern(scores: IntegrationScores, selectedDomains?: DomainId[]): IntegrationResult | null {
  const matchers = [
    matchInvisiblePartner,
    matchFortress,
    matchFireAlarm,
    matchWiseHelper,
    matchRelationalPhilosopher,
    matchAnxiousAvoidant,
    matchValuesBehaviorSplit,
    matchUnlivedLife,
  ];

  for (const matcher of matchers) {
    const result = matcher(scores);
    if (result) {
      // If specific domains were selected, require at least 2 of the pattern's
      // domains to overlap with the selection — otherwise the pattern is irrelevant.
      if (selectedDomains && selectedDomains.length > 0) {
        const overlap = result.domains.filter(d => selectedDomains.includes(d));
        if (overlap.length < 2) continue;
      }
      return result;
    }
  }
  return null;
}
