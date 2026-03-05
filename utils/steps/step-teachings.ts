/**
 * Step Teachings — Original long-form content for each healing step.
 *
 * Each step contains:
 * - teaching: string[] — 3-5 paragraphs of original therapeutic content
 * - whyAfterPrevious: string | null — connects to the previous step
 * - courseConnection: string | null — links to the micro-course gateway
 *
 * Steps 1-7: Full text.
 * Steps 8-12: Placeholder text (to be replaced with full content later).
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

  // ── Step 8: Create New Patterns (placeholder) ───────

  8: {
    stepNumber: 8,
    teaching: [
      'Knowledge isn\u2019t enough. New patterns require new moves \u2014 and new moves feel awkward. That\u2019s how you know they\u2019re working.',
      'Your old pattern is like a well-worn path in a forest. The new pattern is machete work through underbrush. It\u2019s slower, harder, and you\u2019ll want to go back to the path. Don\u2019t. The underbrush becomes a path with practice.',
    ],
    whyAfterPrevious: 'You\u2019ve invited your partner in. Now comes the work of building new ways of being together \u2014 moves that feel foreign at first but become natural with practice.',
    courseConnection: 'The Boundaries micro-courses deepen this step \u2014 teaching you where healthy limits create safety for new patterns to take root.',
  },

  // ── Step 9: Practice Repair (placeholder) ───────────

  9: {
    stepNumber: 9,
    teaching: [
      'It\u2019s not whether you fight. It\u2019s whether you repair. Research shows that masters of relationships aren\u2019t conflict-free \u2014 they repair quickly, genuinely, and completely.',
      'This step makes repair a reflex, not an afterthought.',
    ],
    whyAfterPrevious: 'You\u2019ve started creating new patterns. But new patterns will break sometimes \u2014 that\u2019s guaranteed. What matters is what happens next. This step teaches you to come back.',
    courseConnection: '\u201CTrust Repair\u201D and \u201CThe Lightness Lab\u201D work together here \u2014 one teaches the hard skill of rebuilding after rupture, the other reminds you that play and lightness are part of healing.',
  },

  // ── Step 10: Build Rituals (placeholder) ────────────

  10: {
    stepNumber: 10,
    teaching: [
      'Small consistent moments beat grand gestures. The goodbye kiss. The how-was-your-day conversation. The weekly check-in. Rituals are values made visible.',
      'This step is about choosing the moments that matter and protecting them \u2014 not because they\u2019re dramatic, but because they\u2019re reliable.',
    ],
    whyAfterPrevious: 'You\u2019ve learned to repair. Now you\u2019re building the daily fabric that reduces the need for repair in the first place \u2014 small, consistent deposits into the relational field.',
    courseConnection: '\u201CWhat Matters Most (Together)\u201D helps you align your rituals with your deepest values \u2014 so what you do every day reflects what you say matters most.',
  },

  // ── Step 11: Sustain the Patterns (placeholder) ─────

  11: {
    stepNumber: 11,
    teaching: [
      'Growth isn\u2019t a destination. It\u2019s a practice. This step is about catching yourself when you drift \u2014 and having the tools to come back.',
      'The patterns you\u2019ve built are real. But they\u2019re also fragile without attention. Like a garden, they need tending.',
    ],
    whyAfterPrevious: 'You\u2019ve built rituals. Now comes the long game \u2014 sustaining what you\u2019ve created through the inevitable seasons of closeness and distance.',
    courseConnection: '\u201CThe Text Between Us\u201D adds a layer of digital awareness \u2014 how your communication patterns in text reflect and shape the field between you.',
  },

  // ── Step 12: Become a Refuge (placeholder) ──────────

  12: {
    stepNumber: 12,
    teaching: [
      'Your relationship can be a sanctuary \u2014 for both of you. Not perfect. Not conflict-free. But a place where both of you can come as you are and be held.',
      'This isn\u2019t an ending. It\u2019s a way of living. The journey continues \u2014 it just becomes how you show up, every day.',
    ],
    whyAfterPrevious: 'You\u2019ve sustained your patterns through difficulty. The relationship itself has become the practice \u2014 a living, breathing thing you both tend.',
    courseConnection: 'Every micro-course is now open to you. Revisit, deepen, explore. The learning never stops.',
  },
};

// ─── API ────────────────────────────────────────────────

/** Get the teaching for a step, or null if not found. */
export function getStepTeaching(stepNumber: number): StepTeaching | null {
  return STEP_TEACHINGS[stepNumber] ?? null;
}
