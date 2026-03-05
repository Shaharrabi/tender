/**
 * Step Teachings — Original long-form content for each healing step.
 *
 * Each step contains:
 * - teaching: string[] — 3-5 paragraphs of original therapeutic content
 * - whyAfterPrevious: string | null — connects to the previous step
 * - courseConnection: string | null — links to the micro-course gateway
 *
 * Steps 1-12: Full text.
 *
 * NOTE: Dynamic/personalized content ("What your portrait tells us")
 * is handled by step-bridges.ts, NOT embedded here.
 */

// ─── Types ──────────────────────────────────────────────

export interface StepTeaching {
  stepNumber: number;
  /** The Teaching — 3-5 paragraphs of original therapeutic content */
  teaching: string[];
  /** Why This Step Comes After... — connects to previous step */
  whyAfterPrevious: string | null;
  /** How This Connects to the Course — links to micro-course gateway */
  courseConnection: string | null;
}

// ─── Teaching Content ───────────────────────────────────

const STEP_TEACHINGS: Record<number, StepTeaching> = {

  // ── Step 1: Acknowledge the Strain ──────────────────

  1: {
    stepNumber: 1,
    teaching: [
      'Something brought you here. Not curiosity \u2014 something real. A distance that grew so gradually you almost didn\u2019t notice. An argument that keeps circling back with different words but the same hurt underneath. A quiet ache that says: this isn\u2019t what I signed up for.',
      'Most people wait too long to acknowledge what\u2019s happening. Not because they don\u2019t care, but because acknowledging the strain means admitting that something needs to change \u2014 and change is terrifying.',
      'This step asks you to do one thing: name what\u2019s here. Not fix it. Not analyze it. Just see it clearly. \u201CWe\u2019re struggling\u201D is not a failure. It\u2019s the most honest \u2014 and bravest \u2014 starting point.',
    ],
    whyAfterPrevious: null,
    courseConnection: '\u201CUnderstanding Your Attachment Pattern\u201D will show you WHERE your pattern came from. But first, this step asks you to feel where it LIVES \u2014 in the tension between you and your partner right now.',
  },

  // ── Step 2: Trust the Relational Field ──────────────

  2: {
    stepNumber: 2,
    teaching: [
      'Here\u2019s an idea that might be new: your relationship isn\u2019t just two people. There\u2019s a third thing \u2014 the space between you. Therapists call it different names. In EFT it\u2019s the \u201Cattachment bond.\u201D In PACT it\u2019s the \u201Ccouple bubble.\u201D In relational psychoanalysis it\u2019s the \u201Cthird.\u201D We call it the relational field.',
      'The field is alive. It responds to what you feed it. When you turn toward each other, it warms. When you turn away, it cools. When you fight, it contracts. When you repair, it expands.',
      'Most couples never learn to sense the field. They focus on each other \u2014 what you did, what I need, why you\u2019re wrong. But the shift happens when you both learn to tend the space between you, as if it were a garden that belongs to neither of you alone.',
    ],
    whyAfterPrevious: 'You named the strain. Now you\u2019re learning that the strain isn\u2019t in either of you \u2014 it\u2019s in the field between you. This reframe is the foundation of everything that follows.',
    courseConnection: '\u201CBids for Connection\u201D teaches you the micro-moments that build or break the field. Every time your partner reaches for you \u2014 a look, a question, a touch \u2014 that\u2019s a bid. This step teaches you to notice them.',
  },

  // ── Step 3: Release Certainty ───────────────────────

  3: {
    stepNumber: 3,
    teaching: [
      'Your mind has a story about your relationship. It\u2019s convincing. It explains everything. It probably sounds something like: \u201CIf they would just _____, everything would be fine.\u201D Or: \u201CI\u2019ve tried everything. They never change.\u201D',
      'These stories aren\u2019t lies. They\u2019re maps \u2014 and maps are useful. But the map is not the territory. Your story about your partner captures something real AND misses something essential. It\u2019s like seeing only the shadow of a person and concluding you know their whole shape.',
      'This step is about loosening your grip on the story. Not abandoning your experience \u2014 your hurt is real, your needs are valid. But holding your interpretation more lightly. \u201CI\u2019m having the thought that they don\u2019t care\u201D is very different from \u201CThey don\u2019t care.\u201D',
    ],
    whyAfterPrevious: 'You\u2019ve sensed the field between you. Now you\u2019re learning that your certainty about what\u2019s wrong might be part of what\u2019s keeping the field contracted. The story you tell maintains the pattern.',
    courseConnection: '\u201CUnhooking from the Story\u201D is pure ACT (Acceptance and Commitment Therapy). It teaches cognitive defusion \u2014 the skill of seeing your thoughts as thoughts rather than truths. The practices in this step help you apply that to your relationship stories specifically.',
  },

  // ── Step 4: Examine Our Part ────────────────────────

  4: {
    stepNumber: 4,
    teaching: [
      'This is where most people get uncomfortable. Because this is where we turn the lens inward.',
      'Not to blame yourself. Not to let your partner off the hook. But to see clearly: what do you bring to this dance? Every relational pattern has two partners. Your moves, your reactions, your protections \u2014 they\u2019re part of the choreography. When your partner withdraws, do you pursue harder? When they criticize, do you shut down? When they reach for you, do you stiffen?',
      'These are not flaws. They\u2019re strategies that developed for very good reasons \u2014 usually in childhood, when they were the best you had. Your pursuer strategy kept you connected to an unpredictable caregiver. Your withdrawal strategy kept you safe from an overwhelming one. They worked then. They\u2019re expensive now.',
      'This step isn\u2019t about guilt. It\u2019s about choice. When you can see your part in the dance, you\u2019re no longer dancing on autopilot.',
    ],
    whyAfterPrevious: 'You loosened your grip on the story about your partner. Now you can look at yourself without the defensive shield of \u201Cbut THEY...\u201D The self-examination here would have been impossible at Step 1 \u2014 you would have collapsed into self-blame or deflected entirely.',
    courseConnection: '\u201CYour Nervous System in Love\u201D will show you exactly what happens in your body during the dance. Why your heart races, why your jaw clenches, why you go blank. Understanding the neuroscience makes it easier to observe without judgment.',
  },

  // ── Step 5: Share Our Truths ────────────────────────

  5: {
    stepNumber: 5,
    teaching: [
      'Here\u2019s where things get tender \u2014 in both senses of the word.',
      'This step asks you to share what\u2019s true. Not the surface truth (\u201CI\u2019m annoyed that you forgot to text me\u201D). The deeper one. The one that\u2019s harder to say. \u201CI felt invisible.\u201D \u201CI\u2019m scared you\u2019re pulling away.\u201D \u201CI need to know I matter to you.\u201D',
      'Vulnerability is the most misunderstood word in relationship work. It doesn\u2019t mean weakness. It doesn\u2019t mean crying on command. It means letting your partner see the real feeling underneath your protective behavior. The pursuer shows the fear behind the criticism. The withdrawer shows the overwhelm behind the silence.',
      'This is genuinely risky. Your partner might not respond the way you need. They might get defensive. They might not hear you. But here\u2019s what the research shows: couples who learn to share primary emotions \u2014 the vulnerable ones under the protective ones \u2014 are the ones who heal. Not because vulnerability is magic, but because it\u2019s the only thing that lets your partner see the real you.',
    ],
    whyAfterPrevious: 'You examined your part in the dance. You saw your protective moves. Now you\u2019re being asked to show what those moves are protecting. This sequence matters \u2014 if you tried vulnerability at Step 1, you wouldn\u2019t have had the self-awareness to know WHAT to share. Now you do.',
    courseConnection: null,
  },

  // ── Step 6: Release the Enemy Story ─────────────────

  6: {
    stepNumber: 6,
    teaching: [
      'When we\u2019re hurt, something ancient activates. Our nervous system says: threat. Our mind says: enemy. And suddenly our partner \u2014 the person we chose, the person we love \u2014 becomes the problem. \u201CIf only THEY would change.\u201D',
      'This is the enemy story. And it\u2019s the single biggest obstacle to repair.',
      'Here\u2019s what EFT research shows: couples who heal don\u2019t stop having conflict. They stop seeing each other as the enemy. The real adversary is the pattern \u2014 the cycle that traps you both. When the pursuer sees their partner\u2019s withdrawal not as rejection but as overwhelm, something shifts. When the withdrawer sees their partner\u2019s pursuit not as attack but as desperate reaching, something shifts.',
      'This step is about making that shift. Not by pretending your partner\u2019s behavior doesn\u2019t hurt. It does. But by seeing the PATTERN as what needs to change \u2014 the cycle that hijacks you both \u2014 and choosing to face that together instead of each other.',
    ],
    whyAfterPrevious: 'You shared your truth. Maybe your partner heard it. Maybe they didn\u2019t. Either way, you now have firsthand experience of how hard it is to be vulnerable \u2014 which makes it easier to understand why your PARTNER struggles too. Empathy for your own difficulty creates empathy for theirs.',
    courseConnection: '\u201CFrom Rupture to Repair\u201D teaches that conflict itself isn\u2019t the adversary \u2014 failed repair is. This reframe is the intellectual foundation. The practices in this step help you live it.',
  },

  // ── Step 7: Invite Your Partner In ──────────────────

  7: {
    stepNumber: 7,
    teaching: [
      'Here\u2019s a secret that therapy research has uncovered: the most effective interventions often start with what\u2019s working, not what\u2019s broken.',
      'You\u2019ve done hard work. You\u2019ve acknowledged the strain, sensed the field, loosened your stories, examined your part, shared your truth, and released the enemy narrative. That\u2019s enormous. And it\u2019s been mostly internal work \u2014 changing how YOU relate to the relationship.',
      'This step turns outward. It\u2019s about invitation. About turning toward. About remembering why you chose each other \u2014 not to bypass the hard stuff, but to build the foundation that makes hard conversations possible. Play, appreciation, small gestures, physical touch, laughter \u2014 these aren\u2019t luxuries. They\u2019re medicine. Research shows that couples who maintain a 5:1 ratio of positive to negative interactions are the ones whose hard conversations actually land.',
    ],
    whyAfterPrevious: 'You released the enemy story. For the first time in possibly a long time, you can look at your partner without the filter of blame. That makes genuine invitation possible \u2014 not manipulation disguised as kindness, but real reaching.',
    courseConnection: null,
  },

  // ── Step 8: Create New Patterns ─────────────────────

  8: {
    stepNumber: 8,
    teaching: [
      'Knowledge isn\u2019t enough. You\u2019ve seen your patterns (Steps 1-2). You\u2019ve felt what\u2019s underneath (3-4). You\u2019ve shared your truth and released the enemy story (5-6). You\u2019ve invited your partner in (7).',
      'Now comes the harder part: doing something different.',
      'New patterns don\u2019t emerge from insight alone. They require practice. Repetition. Awkwardness. You\u2019re going to try new moves, and sometimes they\u2019ll feel clunky. You\u2019ll say the Soft Startup phrase and it\u2019ll sound rehearsed. You\u2019ll try to pause before reacting and catch yourself three seconds too late. You\u2019ll reach for your partner when every cell says withdraw.',
      'That\u2019s not failure. That\u2019s neuroplasticity. Your old pattern is like a well-worn path in a forest \u2014 your feet find it automatically. The new pattern is machete work through underbrush. It\u2019s slower, harder, and you\u2019ll want to go back to the path. Keep going. The underbrush becomes a path with practice.',
      'The research is specific: it takes about 66 days for a new behavior to feel automatic. Not 21 \u2014 that\u2019s a myth. Sixty-six days of imperfect practice. This step gives you the structure for that practice.',
    ],
    whyAfterPrevious: 'You invited your partner in. They said yes (or you\u2019re building that capacity solo). Now you have the relational permission to try new things together. Without that foundation of goodwill from Step 7, new patterns feel like demands. With it, they feel like adventures.',
    courseConnection: 'Boundaries That Connect and Boundaries Deep teach what a boundary FEELS like in the body before you speak it. New patterns require clear boundaries \u2014 not walls, but information that serves love.',
  },

  // ── Step 9: Practice Repair ─────────────────────────

  9: {
    stepNumber: 9,
    teaching: [
      'Here\u2019s what the research says \u2014 and it might surprise you: the strongest relationships are not the ones with the least conflict. They\u2019re the ones with the fastest repair.',
      'John Gottman found that masters of relationship don\u2019t avoid rupture. They repair within minutes. Not hours. Not days. Minutes. And they repair genuinely \u2014 not with a perfunctory \u2018sorry\u2019 but with real acknowledgment: \u2018I see that I hurt you. That wasn\u2019t my intention. What do you need right now?\u2019',
      'Repair is a skill. Like any skill, it\u2019s awkward at first. You\u2019ll feel vulnerable saying \u2018I think I messed up\u2019 in the middle of an argument. Your protective parts will scream that you\u2019re giving in, losing ground, being weak. They\u2019re wrong. Repair from a grounded place is the strongest relational move there is.',
      'This step makes repair a reflex. Not something you think about for three days and then bring up over dinner. Something you do in the moment \u2014 or as close to the moment as you can get.',
    ],
    whyAfterPrevious: 'You tried new patterns in Step 8. Some of them worked. Some didn\u2019t. The ones that didn\u2019t created new ruptures \u2014 and THAT\u2019S the material for this step. You have fresh, real, recent moments where things went sideways despite your best efforts. Now you learn to repair them.',
    courseConnection: 'Trust Repair \u2014 After Betrayal for those who need deeper work, plus The Lightness Lab \u2014 Play as Medicine, because repair doesn\u2019t always have to be heavy. Sometimes humor and play are the best repair tools.',
  },

  // ── Step 10: Build Rituals ──────────────────────────

  10: {
    stepNumber: 10,
    teaching: [
      'The research is clear: couples who last have rituals. Not fancy date nights (though those are fine). Small, consistent moments of connection. The goodbye kiss \u2014 every morning, even when you\u2019re annoyed. The how-was-your-day conversation \u2014 where you actually listen, not scroll your phone. The weekly check-in \u2014 20 minutes to ask \u2018how are WE doing?\u2019',
      'Rituals do something that sporadic grand gestures cannot: they create predictability. And predictability is the foundation of safety. When your nervous system knows that connection is reliable \u2014 that it shows up at the same time, in the same way, every day \u2014 it stops bracing for abandonment. It stops scanning for threat. It settles.',
      'This is neuroscience, not sentimentality. Your attachment system needs consistent signals of safety to shift from insecure to earned-secure. Rituals are those signals.',
      'This step is about designing yours. Not imitating someone else\u2019s relationship. Yours. What works for YOU as a couple (or for you as an individual building relational capacity).',
    ],
    whyAfterPrevious: 'You can repair now. Rituals will sometimes get disrupted (life happens). Without repair skills, a missed ritual becomes evidence of failure. With repair skills, a missed ritual becomes a moment of reconnection: \u2018We missed our check-in this week. Let\u2019s do it now.\u2019',
    courseConnection: 'What Matters Most (Together) \u2014 values, shared compass, building a life that reflects what matters. Your rituals should flow from your values.',
  },

  // ── Step 11: Sustain the Patterns ───────────────────

  11: {
    stepNumber: 11,
    teaching: [
      'Growth isn\u2019t a destination. It\u2019s not a finish line you cross and then relax. It\u2019s a practice \u2014 like meditation, like fitness, like sobriety. The 12-step tradition knew this: continued to take personal inventory, and when we were wrong, promptly admitted it.',
      'You\u2019ve come far. You\u2019ve seen your patterns, felt what\u2019s underneath, tried new moves, practiced repair, built rituals. Now comes the longest step: sustaining. Because the old patterns will come back. Not because you failed \u2014 because that\u2019s how neural pathways work. Under stress, the brain defaults to its most practiced route. Your old route has years of mileage on it. Your new route has weeks.',
      'This step is about catching yourself when you drift. Having the tools to come back. And \u2014 crucially \u2014 not shaming yourself for drifting. \u2018Oh, there\u2019s the old pattern. I know this one. Let me try the new move.\u2019',
      'The spiral, not the line. You\u2019ll revisit themes from earlier steps. That\u2019s not going backward \u2014 it\u2019s going deeper. The same issue at Step 11 isn\u2019t the same issue it was at Step 1. You\u2019re different now. You see more. You have more tools. The spiral rises.',
    ],
    whyAfterPrevious: 'Rituals give you the structure for sustaining. Without daily and weekly rituals, sustainability depends on willpower \u2014 and willpower is a depleting resource. With rituals, it depends on structure \u2014 and structure endures.',
    courseConnection: 'The Text Between Us \u2014 because sustaining means tending ALL channels of connection, including the digital one where most daily communication happens.',
  },

  // ── Step 12: Become a Refuge ────────────────────────

  12: {
    stepNumber: 12,
    teaching: [
      'This is the vision: a relationship that\u2019s a refuge. A place where both of you can come as you are \u2014 tired, scared, imperfect \u2014 and be held. Not fixed. Held.',
      'This doesn\u2019t mean no conflict. It means that underneath the conflict, there\u2019s a deep knowing: we\u2019ve got each other. Sue Johnson calls it \u2018hold me tight.\u2019 Stan Tatkin calls it the \u2018couple bubble.\u2019 Bowlby called it a \u2018secure base.\u2019 Different words for the same thing: the feeling that someone has your back, no matter what.',
      'Not everyone will reach this step with a partner. Some of you are doing this alone \u2014 building the capacity to BE a refuge, to OFFER secure attachment, for the relationship you\u2019re in now or the one you\u2019ll enter next. That matters just as much. You can\u2019t build a refuge with someone else until you can be one for yourself.',
      'This step never ends. It\u2019s not a destination. It\u2019s how you live. Every morning you wake up and choose it again. Some days it\u2019s easy. Some days it\u2019s the hardest thing you do. But you keep choosing it \u2014 because this is what you said matters to you, all the way back at Step 1 when you acknowledged the strain and decided: something needs to change.',
      'Something changed. You did.',
    ],
    whyAfterPrevious: 'Everything before this was preparation. Seeing, feeling, shifting, integrating. Now you live it. The 12 steps don\u2019t end \u2014 they become your rhythm. Daily practice, weekly ritual, monthly reflection, quarterly reassessment. The field between you stays alive because you tend it.',
    courseConnection: 'All 14 courses are now available for review and deepening. The Journey becomes a library you return to.',
  },
};

// ─── API ────────────────────────────────────────────────

/** Get the teaching for a step, or null if not found. */
export function getStepTeaching(stepNumber: number): StepTeaching | null {
  return STEP_TEACHINGS[stepNumber] ?? null;
}
