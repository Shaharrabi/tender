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

export interface StepTransitions {
  /** Shown between teaching/bridge and the course section */
  afterTeaching: string;
  /** Shown between the course section and practices */
  afterCourse: string;
  /** Shown between practices and the exchange / reflection */
  afterPractices: string;
  /** Shown between partner exchange and reflection / together practices */
  afterExchange: string;
}

export interface StepTeaching {
  stepNumber: number;
  /** The Teaching — 3-5 paragraphs of original therapeutic content */
  teaching: string[];
  /** Why This Step Comes After... — connects to previous step */
  whyAfterPrevious: string | null;
  /** How This Connects to the Course — links to micro-course gateway */
  courseConnection: string | null;
  /** Connector phrases between sections — makes the flow cohesive */
  transitions: StepTransitions;
}

// ─── Teaching Content ───────────────────────────────────

const STEP_TEACHINGS: Record<number, StepTeaching> = {

  // ── Step 1: Acknowledge the Strain ──────────────────

  1: {
    stepNumber: 1,
    teaching: [
      'Something brought you here. Not curiosity \u2014 something alive. A distance that grew so slowly between you that you almost didn\u2019t notice it growing. An argument that keeps returning wearing different words but carrying the same ache underneath. A quiet exhaustion that whispers: this is not what we signed up for.',
      'We live in a culture addicted to certainty, control, and distraction. We scroll instead of feeling. We perform closeness instead of risking it. We blame each other for the distance because naming the system that fragments us feels too large. But the strain between you is not a personal failure. It is the cost of living disconnected \u2014 from ourselves, from each other, from the field that holds us.',
      'This step asks one thing: name what is here. Not fix it. Not explain it. Not assign blame for it. Just see it \u2014 the way you might notice your own breathing for the first time. \u201CWe are struggling\u201D is not weakness. It is the first honest breath. And from that breath, everything else becomes possible.',
      'Every therapeutic tradition agrees on this: awareness precedes change. In attachment theory, this is called \u201Cearning security\u201D \u2014 choosing to face what is, rather than what you wish were true. The strain is not the enemy. The strain is the doorway. Walk through it together.',
    ],
    whyAfterPrevious: null,
    courseConnection: 'The course \u201CUnderstanding Your Attachment Pattern\u201D shows you WHERE your pattern formed \u2014 in childhood, in the nervous system, in the stories you learned about what love requires. But first, this step asks you to feel where that pattern LIVES right now \u2014 in the space between you and the person you chose.',
    transitions: {
      afterTeaching: 'Now that you can see what is here, let\u2019s look at what it means for YOU specifically.',
      afterCourse: 'The course plants the seed. These practices help it grow roots.',
      afterPractices: 'After you have practiced, share what stirred \u2014 with your partner or with yourself.',
      afterExchange: 'Let what emerged between you settle. Some truths need time to find their shape.',
    },
  },

  // ── Step 2: Trust the Relational Field ──────────────

  2: {
    stepNumber: 2,
    teaching: [
      'Here is an idea that might change everything: your relationship is not just two people. There is a third presence \u2014 the space between you. Therapists call it by different names. In EFT it is the \u201Cattachment bond.\u201D In PACT it is the \u201Ccouple bubble.\u201D In relational psychoanalysis it is simply \u201Cthe third.\u201D We call it the relational field.',
      'The field is alive. It has its own rhythms, its own intelligence, its own way of knowing. When you turn toward each other, the field warms. When you turn away, it cools. When you fight, it contracts. When you repair, it expands. You cannot see it. But you can feel it \u2014 in the silence after a hard conversation, in the ease of a shared laugh, in the ache of distance that has no name.',
      'Most couples have never been taught to sense the field. They focus on each other \u2014 what you did, what I need, why you are wrong. But the shift happens when you both learn to tend the space between you, as if it were a garden that belongs to neither of you alone. Not your garden. Not theirs. The garden.',
      'To trust the relational field is to trust that life itself is wiser between us than within us alone. This is not blind faith. It is a recognition: every time you have felt truly met by another person \u2014 truly seen \u2014 that meeting happened in the field. Not in either of you. Between.',
    ],
    whyAfterPrevious: 'You named the strain in Step 1. Now you are learning that the strain does not live inside either of you. It lives in the field between you \u2014 and the field can heal when tended.',
    courseConnection: '\u201CBids for Connection\u201D teaches you the micro-moments that build or erode the field. Every time your partner reaches for you \u2014 a glance, a question, a touch on the shoulder \u2014 that is a bid. This step teaches you to notice them. Because the field is built one bid at a time.',
    transitions: {
      afterTeaching: 'You have sensed the field. Now let\u2019s learn what tends it.',
      afterCourse: 'Understanding bids is the beginning. Noticing them is the practice.',
      afterPractices: 'You have been paying attention to the field. Share what you sensed.',
      afterExchange: 'What you shared with each other is its own kind of tending.',
    },
  },

  // ── Step 3: Release Certainty ───────────────────────

  3: {
    stepNumber: 3,
    teaching: [
      'Your mind has built a story about your relationship. The story is convincing. It explains everything. It probably sounds something like: \u201CIf they would just _____, everything would be fine.\u201D Or perhaps: \u201CI have tried everything. They will never change.\u201D',
      'These stories are not lies. They are maps \u2014 and maps are useful. But the map is never the territory. Your story about your partner captures something real AND misses something essential. It is like seeing only the shadow of a person and deciding you know their shape.',
      'We are addicted to certainty. It is one of the primary addictions of our time \u2014 needing a fixed story, a hero, a villain, a \u201Cside,\u201D so we do not have to sit in the unbearable ambiguity of a world (and a relationship) in flux. Releasing certainty feels like losing ground. But what you lose is the illusion. What you gain is the territory.',
      'This step is about loosening your grip. Not abandoning your experience \u2014 your hurt is real, your needs are valid. But holding your interpretation more lightly. \u201CI am having the thought that they do not care\u201D is a very different experience than \u201CThey do not care.\u201D One is a weather pattern. The other is a prison sentence.',
    ],
    whyAfterPrevious: 'You have sensed the field between you. Now you are learning that your certainty about what is wrong might be part of what keeps the field contracted. The story you tell about your partner maintains the very pattern you want to change.',
    courseConnection: '\u201CUnhooking from the Story\u201D draws from ACT \u2014 Acceptance and Commitment Therapy. It teaches cognitive defusion: seeing your thoughts as thoughts, not as truths. The practices in this step help you apply that skill specifically to the stories you carry about your relationship.',
    transitions: {
      afterTeaching: 'The story loosens. Now let\u2019s see what lives underneath it.',
      afterCourse: 'Defusion is the skill. These practices bring it into the body.',
      afterPractices: 'You noticed the story without being swallowed by it. Share what you saw.',
      afterExchange: 'Hearing each other\u2019s stories \u2014 without needing to be right \u2014 is its own kind of release.',
    },
  },

  // ── Step 4: Examine Our Part ────────────────────────

  4: {
    stepNumber: 4,
    teaching: [
      'This is where it gets uncomfortable. This is where we turn the lens inward.',
      'Not to blame yourself. Not to let your partner off the hook. But to see with honest eyes: what do you bring to this dance? Every relational pattern has two partners. Your moves, your reactions, your protections \u2014 they are part of the choreography. When your partner withdraws, do you pursue harder? When they criticize, do you shut down? When they reach for you, do you stiffen?',
      'These are not flaws. They are strategies that developed for good reasons \u2014 usually in childhood, when they were the best you had. The pursuer strategy kept you connected to an unpredictable caregiver. The withdrawal strategy kept you safe from an overwhelming one. They worked then. They are expensive now.',
      'Here is the liberating truth: your part is the only part you can change. Not through guilt. Not through self-punishment. Through seeing. When you can observe your moves in the dance without collapsing into shame \u2014 when you can say \u201Cthere I go again\u201D with curiosity instead of contempt \u2014 you are no longer dancing on autopilot. You are choosing.',
    ],
    whyAfterPrevious: 'You loosened your grip on the story about your partner. That was hard. Now comes the harder thing: looking at yourself without the defensive shield of \u201Cbut THEY...\u201D This self-examination was impossible at Step 1. You would have collapsed into blame or deflected entirely. Now you have the ground for it.',
    courseConnection: '\u201CYour Nervous System in Love\u201D shows you what happens in your body during the dance \u2014 why your heart races, why your jaw tightens, why you go blank. Understanding the neuroscience does not replace the feeling. But it makes it easier to watch without being swept away.',
    transitions: {
      afterTeaching: 'You have seen your part in the dance. This course shows you what drives it.',
      afterCourse: 'The neuroscience removes the shame. These practices build the awareness.',
      afterPractices: 'You have been watching your moves. Share what you noticed \u2014 gently.',
      afterExchange: 'Seeing the dance together is different from seeing it alone.',
    },
  },

  // ── Step 5: Share Our Truths ────────────────────────

  5: {
    stepNumber: 5,
    teaching: [
      'Here is where things get tender \u2014 in both senses of the word.',
      'This step asks you to share what is true. Not the surface truth \u2014 \u201CI am annoyed that you forgot to text me.\u201D The one underneath. The one that is harder to say. \u201CI felt invisible.\u201D \u201CI am scared you are pulling away.\u201D \u201CI need to know that I matter to you.\u201D',
      'Vulnerability is the most misunderstood word in relationship work. It does not mean weakness. It does not mean performance. It means letting your partner see the real feeling underneath your protective behavior. The pursuer reveals the fear behind the criticism. The withdrawer reveals the overwhelm behind the silence. When the armor comes off, what is left is not weakness. It is the only thing that can actually reach another person.',
      'This is genuinely risky. Your partner might not respond the way you need. They might get defensive. They might not hear you. But here is what decades of research show: couples who learn to share primary emotions \u2014 the vulnerable ones under the protective ones \u2014 are the ones who heal. Not because vulnerability is magic, but because it is the only thing that lets your partner see the real you. And the real you is who they fell in love with.',
    ],
    whyAfterPrevious: 'You examined your part in the dance. You saw your protective moves. Now you are being asked to show what those moves are protecting. This sequence matters \u2014 vulnerability without self-awareness is just reactivity wearing a different mask. Now you know what to share.',
    courseConnection: null,
    transitions: {
      afterTeaching: 'Vulnerability is not a technique. It is the teaching itself.',
      afterCourse: 'Knowledge supports the leap. These practices are the leap.',
      afterPractices: 'You have been building the courage. Now share what is true \u2014 underneath the armor.',
      afterExchange: 'What was shared between you is sacred. Let it settle without rushing to the next thing.',
    },
  },

  // ── Step 6: Release the Enemy Story ─────────────────

  6: {
    stepNumber: 6,
    teaching: [
      'When we are hurt, something ancient activates. The nervous system says: threat. The mind says: enemy. And suddenly the person you chose \u2014 the person you love \u2014 becomes the problem. \u201CIf only THEY would change.\u201D',
      'This is the enemy story. We are addicted to it. It gives temporary coherence to isolated selves \u2014 righteous anger is a false fuel that feels like power. But every time you cast your partner as the villain, you fracture the field further. The addiction to outrage \u2014 even private, quiet outrage \u2014 prevents the deeper coherence you long for.',
      'Here is what EFT research shows: couples who heal do not stop having conflict. They stop seeing each other as the enemy. The real adversary is the pattern \u2014 the cycle that traps you both. When the pursuer sees their partner\u2019s withdrawal not as rejection but as overwhelm, something shifts. When the withdrawer sees their partner\u2019s pursuit not as attack but as desperate reaching, something shifts. The enemy dissolves. The dance remains. And now you can face the dance together.',
      'Releasing the enemy story does not mean pretending your partner\u2019s behavior does not hurt. It does. But it means seeing the PATTERN as what hijacks you both \u2014 and choosing to fight that together instead of fighting each other. The walls between you came from protection, not malice. Can you see the scared child underneath the difficult behavior?',
    ],
    whyAfterPrevious: 'You shared your truth in Step 5. Maybe your partner heard it. Maybe they did not. Either way, you now have firsthand experience of how hard it is to be vulnerable. That experience \u2014 the difficulty of it \u2014 is exactly what helps you understand why your PARTNER struggles too. Empathy for your own difficulty creates empathy for theirs.',
    courseConnection: '\u201CFrom Rupture to Repair\u201D teaches that conflict itself is not the enemy \u2014 failed repair is. The distinction changes everything. Conflict is energy. Failed repair is where the energy turns toxic. The practices in this step help you transform conflict from destruction into fuel.',
    transitions: {
      afterTeaching: 'The enemy dissolves when you see the pattern. This course deepens the seeing.',
      afterCourse: 'Conflict is not the enemy. Failed repair is. These practices teach the difference.',
      afterPractices: 'You have been practicing seeing pattern instead of villain. Share what shifted.',
      afterExchange: 'Something softened between you. That softening is the field beginning to heal.',
    },
  },

  // ── Step 7: Invite Your Partner In ──────────────────

  7: {
    stepNumber: 7,
    teaching: [
      'Here is something therapy research keeps discovering: the most effective interventions start with what is working, not what is broken.',
      'You have done hard work. Acknowledged the strain. Sensed the field. Loosened your stories. Examined your part. Shared your truth. Released the enemy narrative. That is enormous. And it has been mostly internal \u2014 changing how YOU relate to the relationship.',
      'This step turns outward. It is about invitation. Turning toward. Remembering why you chose each other \u2014 not to bypass the hard stuff, but to build the foundation that makes hard conversations possible. Play, appreciation, small gestures, touch, laughter \u2014 these are not luxuries. They are medicine. Research shows that couples who maintain a 5:1 ratio of positive to negative interactions are the ones whose difficult conversations actually land.',
      'Think of it this way: you cannot build a refuge in a war zone. Steps 1-6 ended the war. This step starts building the refuge. Not through grand romantic gestures, but through daily acts of ordinary devotion. The goodbye kiss when you are annoyed. The question \u201Chow was your day?\u201D when you actually listen. The hand on the shoulder when no words are needed.',
    ],
    whyAfterPrevious: 'You released the enemy story. For the first time in possibly a long time, you can look at your partner without the filter of blame. That makes genuine invitation possible \u2014 not manipulation dressed as kindness, but real reaching from a grounded place.',
    courseConnection: null,
    transitions: {
      afterTeaching: 'Invitation starts not with words but with remembering.',
      afterCourse: 'You remembered what drew you together. Now let those feelings move into action.',
      afterPractices: 'You have been reaching toward each other. Share what it felt like.',
      afterExchange: 'The invitation has been extended. Let it breathe \u2014 no need to force what wants to unfold.',
    },
  },

  // ── Step 8: Create New Patterns ─────────────────────

  8: {
    stepNumber: 8,
    teaching: [
      'Knowledge is not enough. You have seen your patterns. Felt what is underneath. Shared your truth. Released the enemy story. Invited your partner in. That is the recognition and the release. Now comes the harder part: embodiment.',
      'New patterns do not emerge from insight alone. They require practice. Repetition. Awkwardness. You are going to try new relational moves, and sometimes they will feel clunky. You will attempt the Soft Startup and it will sound rehearsed. You will try to pause before reacting and catch yourself three seconds too late. You will reach for your partner when every cell screams withdraw.',
      'That is not failure. That is neuroplasticity at work. Your old pattern is like a well-worn path through a forest \u2014 your feet find it without thinking. The new pattern is machete work through underbrush. Slower, harder, and you will want to go back to the familiar path. Do not. The underbrush becomes a path with practice.',
      'The research is specific: it takes roughly 66 days for a new behavior to feel automatic. Not 21 \u2014 that is a myth. Sixty-six days of imperfect, awkward, courageous practice. This step gives you the structure for it. And here is the thing about structure: it is not the opposite of freedom. It is what makes freedom possible.',
    ],
    whyAfterPrevious: 'You invited your partner in. They said yes \u2014 or you are building that capacity for when they do. Now you have the relational permission to try new things together. Without the goodwill from Step 7, new patterns feel like demands. With it, they feel like adventures.',
    courseConnection: '\u201CBoundaries That Connect\u201D and \u201CBoundaries Deep\u201D teach what a boundary FEELS like in the body before you speak it. New patterns require clear boundaries \u2014 not walls, not punishment. Information that serves love.',
    transitions: {
      afterTeaching: 'Embodiment begins with structure. This course teaches the felt boundary.',
      afterCourse: 'You know what the new move is. Now comes the awkward, courageous practice.',
      afterPractices: 'You tried something new. Share what it felt like \u2014 the awkwardness is the evidence.',
      afterExchange: 'Awkward is how new feels. That discomfort is neuroplasticity at work.',
    },
  },

  // ── Step 9: Practice Repair ─────────────────────────

  9: {
    stepNumber: 9,
    teaching: [
      'Here is what the research says \u2014 and it might surprise you: the strongest relationships are not the ones with the least conflict. They are the ones with the fastest repair.',
      'John Gottman found that masters of relationship do not avoid rupture. They repair within minutes. Not hours. Not days. Minutes. And they repair genuinely \u2014 not with a reflexive \u201Csorry\u201D but with real acknowledgment: \u201CI see that I hurt you. That was not what I intended. What do you need right now?\u201D',
      'Repair is a skill. Like any skill, it is awkward at first. You will feel exposed saying \u201CI think I got that wrong\u201D in the middle of an argument. Your protective parts will insist that you are giving in, losing ground, being weak. They are wrong. Repair from a grounded, centered place is the strongest relational move there is. It says: this relationship matters more than my need to be right.',
      'This step makes repair a reflex. Not something you think about for three days and bring up over dinner. Something that happens in the moment \u2014 or as close to the moment as you can get. Because ruptures are like fresh wounds: they heal fastest when tended immediately. Left alone, they scar.',
    ],
    whyAfterPrevious: 'You tried new patterns in Step 8. Some worked. Some did not. The ones that did not created fresh ruptures \u2014 and THAT is the material for this step. You have real, recent moments where things went sideways despite your best efforts. Now you learn to repair them.',
    courseConnection: '\u201CTrust Repair \u2014 After Betrayal\u201D goes deeper for those who need it. And \u201CThe Lightness Lab \u2014 Play as Medicine\u201D reminds you that repair does not always have to be heavy. Sometimes humor and play are the most powerful repair tools. Laughter after tears is how the field knows it is safe again.',
    transitions: {
      afterTeaching: 'Repair is the skill that changes everything. These courses sharpen it.',
      afterCourse: 'Tools without practice stay theoretical. These exercises make repair a reflex.',
      afterPractices: 'You have practiced repair. Share what you learned \u2014 the attempt matters more than perfection.',
      afterExchange: 'Repair happened between you. That is the strongest thing a relationship can do.',
    },
  },

  // ── Step 10: Build Rituals ──────────────────────────

  10: {
    stepNumber: 10,
    teaching: [
      'Couples who last have rituals. Not elaborate date nights \u2014 though those are fine. Small, consistent moments of connection. The goodbye kiss, every morning, even when you are annoyed. The \u201Chow was your day?\u201D where you actually set down your phone and listen. The weekly check-in \u2014 twenty minutes to ask \u201Chow are WE doing?\u201D',
      'Rituals create something that grand gestures cannot: predictability. And predictability is the foundation of safety. When your nervous system learns that connection is reliable \u2014 that it shows up at the same time, in the same form, every day \u2014 something profound happens. The vigilance softens. The scanning for threat quiets. The body settles into trust.',
      'This is neuroscience, not sentimentality. Your attachment system needs consistent signals of safety to shift from insecure to earned-secure. Rituals ARE those signals. They are how you tell your partner\u2019s nervous system: I am here. I am not leaving. You can rest.',
      'This step is about designing YOUR rituals. Not imitating someone else\u2019s relationship. Not following a template. What works for you \u2014 as a couple, or as an individual building relational capacity? What does connection look like in your life, with your schedules, your temperaments, your values? The rituals that last are the ones that feel like you.',
    ],
    whyAfterPrevious: 'You can repair now. That is crucial \u2014 because rituals WILL get disrupted. Life happens. Without repair skills, a missed ritual becomes evidence of failure: \u201CSee? They don\u2019t really care.\u201D With repair skills, a missed ritual becomes a moment of reconnection: \u201CWe missed our check-in this week. Let\u2019s do it now.\u201D',
    courseConnection: '\u201CWhat Matters Most (Together)\u201D helps you identify the values your rituals should express. When daily practices align with what matters most, they stop feeling like obligations and start feeling like prayers.',
    transitions: {
      afterTeaching: 'Rituals grow from values. This course helps you name what matters most.',
      afterCourse: 'You know your values. These practices help you build daily rhythms around them.',
      afterPractices: 'You have been designing your rituals. Share what you chose \u2014 and why it matters.',
      afterExchange: 'The rituals you design together carry the weight of shared intention.',
    },
  },

  // ── Step 11: Sustain the Patterns ───────────────────

  11: {
    stepNumber: 11,
    teaching: [
      'Growth is not a destination. It is not a finish line you cross and then relax. It is a practice \u2014 like meditation, like music, like love itself. The 12-step tradition understood this: \u201Ccontinued to take personal inventory, and when we were wrong, promptly admitted it.\u201D',
      'You have come far. Seen your patterns. Felt what is underneath. Tried new moves. Practiced repair. Built rituals. Now comes the longest step: sustaining. Because the old patterns will return. Not because you failed \u2014 because that is how neural pathways work. Under stress, the brain defaults to its most practiced route. Your old route has years of mileage. Your new route has weeks.',
      'This step is about meeting the old patterns with gentleness instead of shame. \u201COh \u2014 there is the old dance. I recognize this one. I know what it wants. Let me try the new move instead.\u201D That recognition IS the practice. Every time you catch yourself mid-pattern, you are already different from who you were at Step 1.',
      'The spiral, not the line. You will revisit themes from earlier steps. That is not regression \u2014 it is deepening. The same issue at Step 11 is not the same issue it was at Step 1. You are different now. You see more. You feel more. You have more tools. The spiral rises, even when it circles back.',
    ],
    whyAfterPrevious: 'Rituals from Step 10 give you the structure for sustaining. Without rituals, sustainability depends on willpower \u2014 and willpower depletes. With rituals, it depends on structure \u2014 and structure endures.',
    courseConnection: '\u201CThe Text Between Us\u201D \u2014 because sustaining means tending ALL channels of connection, including the digital one where most daily communication now happens. Your attachment pattern lives inside your phone. This course shows you how.',
    transitions: {
      afterTeaching: 'Sustaining means tending every channel. This course focuses on the digital one.',
      afterCourse: 'The practice now is consistency. These exercises help you build the rhythm.',
      afterPractices: 'You have been practicing the long game. Share what you noticed about your rhythm.',
      afterExchange: 'Consistency is built in moments exactly like this one. The spiral rises.',
    },
  },

  // ── Step 12: Become a Refuge ────────────────────────

  12: {
    stepNumber: 12,
    teaching: [
      'This is the vision: a relationship that is a refuge. A place where both of you can arrive as you are \u2014 tired, scared, imperfect \u2014 and be held. Not fixed. Held.',
      'This does not mean no conflict. It means that underneath the conflict, there is a knowing so deep it lives in the body: we have each other. Sue Johnson calls it \u201Chold me tight.\u201D Stan Tatkin calls it the \u201Ccouple bubble.\u201D Bowlby called it a \u201Csecure base.\u201D Different traditions, different languages, same recognition: the feeling that someone has your back, no matter what.',
      'Not everyone reaches this step with a partner. Some of you are here alone \u2014 building the capacity to BE a refuge, to offer secure attachment, for the relationship you are in or the one you will enter next. That work matters just as much. You cannot build a refuge with someone else until you can be one for yourself.',
      'This step never ends. It is not a destination. It is how you live. Every morning you wake up and choose it. Some days it is easy. Some days it is the hardest thing you do. But you keep choosing \u2014 because this is what you said matters to you, all the way back at Step 1 when you named the strain and decided: something needs to change.',
      'Something changed. You did. Not by becoming someone new \u2014 by remembering who you were before the patterns, the protections, the addictions to certainty took hold. The pattern was always you. And the field between you \u2014 the one you have been tending these twelve steps \u2014 it is alive. It holds the memory of belonging you forgot, and the future coherence you cannot yet imagine.',
    ],
    whyAfterPrevious: 'Everything before this was preparation. Seeing. Feeling. Shifting. Integrating. Now you live it. The twelve steps do not end \u2014 they become your rhythm. Daily practice, weekly ritual, monthly reflection, quarterly reassessment. The field stays alive because you tend it.',
    courseConnection: 'All 14 courses become your library. Return to any of them when you need to. The journey was never a straight line. It was always a spiral. And the spiral is how wholeness grows.',
    transitions: {
      afterTeaching: 'You have arrived \u2014 not at an ending, but at a way of living. These courses are your library now.',
      afterCourse: 'Every practice you have done is still here. Return to any of them when you need to.',
      afterPractices: 'The journey does not end here. It continues in how you live, how you love, how you tend.',
      afterExchange: 'What you have built together is real. The field remembers. Keep tending it.',
    },
  },
};

// ─── API ────────────────────────────────────────────────

/** Get the teaching for a step, or null if not found. */
export function getStepTeaching(stepNumber: number): StepTeaching | null {
  return STEP_TEACHINGS[stepNumber] ?? null;
}
