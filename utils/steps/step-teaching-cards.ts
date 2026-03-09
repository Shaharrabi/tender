/**
 * Step Teaching Cards — Bite-sized content for the TeachingCardStack.
 *
 * Each step's teaching broken into 3–5 cards with one concept per card.
 * Full teaching in step-teachings.ts remains unchanged — this is additive.
 *
 * Also includes keyTakeaway: the single sentence users carry with them.
 *
 * NEW FILE — does not modify step-teachings.ts or twelve-steps.ts.
 */

export interface TeachingCard {
  title: string;
  body: string;
  /** Emoji accent for visual warmth */
  accent?: string;
}

export interface StepTeachingCards {
  stepNumber: number;
  keyTakeaway: string;
  cards: TeachingCard[];
  readMinutes: number;
}

const STEP_TEACHING_CARDS: Record<number, StepTeachingCards> = {
  1: {
    stepNumber: 1,
    keyTakeaway: 'The pattern is not the person. You have a dance \u2014 not a character flaw.',
    readMinutes: 4,
    cards: [
      { title: 'Something Brought You Here', body: 'Not curiosity \u2014 something alive. A distance that grew so slowly you almost didn\u2019t notice. An argument that keeps returning wearing different words but carrying the same ache underneath.', accent: '\uD83C\uDF3F' },
      { title: 'The Strain Is Not a Failure', body: 'We scroll instead of feeling. We perform closeness instead of risking it. The strain between you is not a personal failure \u2014 it\u2019s the cost of living disconnected from ourselves and each other.', accent: '\uD83C\uDF00' },
      { title: 'Just See It', body: 'This step asks one thing: name what is here. Not fix it. Not explain it. Not assign blame. \u201CWe are struggling\u201D is not weakness. It is the first honest breath.', accent: '\uD83D\uDC41\uFE0F' },
      { title: 'The Doorway', body: 'Every therapeutic tradition agrees: awareness precedes change. The strain is not the enemy. The strain is the doorway. Walk through it together.', accent: '\uD83D\uDEAA' },
    ],
  },
  2: {
    stepNumber: 2,
    keyTakeaway: 'Something wiser than either of you emerges when you meet with openness.',
    readMinutes: 5,
    cards: [
      { title: 'The Third Presence', body: 'Your relationship is not just two people. There is a third presence \u2014 the space between you. Therapists call it the attachment bond, the couple bubble, the relational field. It\u2019s alive.', accent: '\u2728' },
      { title: 'The Field Has Rhythms', body: 'When you turn toward each other, the field warms. When you turn away, it cools. When you fight, it contracts. When you repair, it expands. You can\u2019t see it. But you can feel it.', accent: '\uD83C\uDF0A' },
      { title: 'Tend the Garden', body: 'Most couples focus on each other \u2014 what you did, what I need, why you\u2019re wrong. The shift happens when you both tend the space between you, as if it were a garden that belongs to neither of you alone.', accent: '\uD83C\uDF31' },
      { title: 'Trust What Emerges', body: 'Every time you have felt truly met by another person \u2014 truly seen \u2014 that meeting happened in the field. Not in either of you. Between. That\u2019s what we\u2019re learning to trust.', accent: '\uD83E\uDD1D' },
    ],
  },
  3: {
    stepNumber: 3,
    keyTakeaway: 'Your story about your partner captures something real AND misses something essential.',
    readMinutes: 4,
    cards: [
      { title: 'The Convincing Story', body: 'Your mind has built a story about your relationship. It\u2019s convincing. It probably sounds like: \u201CIf they would just _____, everything would be fine.\u201D Or: \u201CI\u2019ve tried everything. They\u2019ll never change.\u201D', accent: '\uD83D\uDCD6' },
      { title: 'Maps vs Territory', body: 'These stories are not lies. They are maps \u2014 and maps are useful. But the map is never the territory. Your story captures something real AND misses something essential.', accent: '\uD83D\uDDFA\uFE0F' },
      { title: 'The Addiction to Certainty', body: 'Releasing certainty feels like losing ground. But what you lose is the illusion. What you gain is the territory \u2014 the real, breathing, surprising person in front of you.', accent: '\uD83E\uDEB6' },
      { title: 'Thoughts vs Prison', body: '\u201CI\u2019m having the thought that they don\u2019t care\u201D is very different from \u201CThey don\u2019t care.\u201D One is weather. The other is a prison sentence.', accent: '\uD83D\uDD13' },
    ],
  },
  4: {
    stepNumber: 4,
    keyTakeaway: 'Your part is the only part you can change. Not through guilt \u2014 through seeing.',
    readMinutes: 4,
    cards: [
      { title: 'This Gets Uncomfortable', body: 'This is where we turn the lens inward. Not to blame yourself. Not to let your partner off the hook. But to see with honest eyes: what do you bring to this dance?', accent: '\uD83E\uDE9E' },
      { title: 'Your Moves in the Dance', body: 'When your partner withdraws, do you pursue harder? When they criticize, do you shut down? When they reach for you, do you stiffen? These are strategies, not flaws.', accent: '\uD83C\uDF00' },
      { title: 'Strategies That Made Sense', body: 'These moves developed for good reasons \u2014 usually in childhood. The pursuer strategy kept you connected to an unpredictable caregiver. The withdrawal kept you safe from an overwhelming one.', accent: '\uD83E\uDDD2' },
      { title: 'Curiosity Over Contempt', body: 'When you can say \u201Cthere I go again\u201D with curiosity instead of contempt \u2014 you\u2019re no longer on autopilot. You\u2019re choosing.', accent: '\uD83D\uDCA1' },
    ],
  },
  5: {
    stepNumber: 5,
    keyTakeaway: 'Vulnerability is not weakness. It\u2019s the only thing that can actually reach another person.',
    readMinutes: 4,
    cards: [
      { title: 'The Underneath', body: 'This step asks you to share what is true. Not the surface \u2014 \u201CI\u2019m annoyed you forgot.\u201D The one underneath: \u201CI felt invisible.\u201D \u201CI\u2019m scared you\u2019re pulling away.\u201D', accent: '\uD83E\uDEC6' },
      { title: 'Armor Off', body: 'The pursuer reveals the fear behind the criticism. The withdrawer reveals the overwhelm behind the silence. When the armor comes off, what\u2019s left is not weakness \u2014 it\u2019s the only thing that reaches.', accent: '\uD83D\uDEE1\uFE0F' },
      { title: 'Genuinely Risky', body: 'Your partner might not respond the way you need. But decades of research show: couples who share primary emotions \u2014 the vulnerable ones \u2014 are the ones who heal.', accent: '\uD83C\uDF0A' },
      { title: 'The Real You', body: 'Vulnerability lets your partner see the real you. And the real you is who they fell in love with.', accent: '\uD83D\uDC9C' },
    ],
  },
  6: {
    stepNumber: 6,
    keyTakeaway: 'The walls between you came from protection, not malice.',
    readMinutes: 4,
    cards: [
      { title: 'The Enemy Activates', body: 'When we\u2019re hurt, something ancient activates. The nervous system says: threat. The mind says: enemy. Suddenly the person you love becomes the problem.', accent: '\u26A1' },
      { title: 'Righteous Anger Is False Fuel', body: 'The enemy story gives temporary coherence \u2014 righteous anger feels like power. But every time you cast your partner as the villain, you fracture the field further.', accent: '\uD83D\uDD25' },
      { title: 'See the Pattern, Not the Enemy', body: 'When the pursuer sees withdrawal as overwhelm (not rejection), something shifts. When the withdrawer sees pursuit as desperate reaching (not attack), something shifts.', accent: '\uD83C\uDF05' },
      { title: 'The Scared Child', body: 'Can you see the scared child underneath the difficult behavior? The walls came from protection, not malice. Fight the pattern together instead of fighting each other.', accent: '\uD83E\uDDD2' },
    ],
  },
  7: {
    stepNumber: 7,
    keyTakeaway: 'Small, consistent practice changes everything. Love is a daily practice, not a fixed state.',
    readMinutes: 4,
    cards: [
      { title: 'Start with What Works', body: 'Therapy research keeps discovering: the most effective interventions start with what is working, not what\u2019s broken. You\u2019ve done hard internal work. Now turn outward.', accent: '\uD83C\uDF31' },
      { title: 'Invitation, Not Demand', body: 'This step is about turning toward. Remembering why you chose each other. Not to bypass the hard stuff \u2014 but to build the foundation that makes hard conversations possible.', accent: '\uD83E\uDD1D' },
      { title: '5:1 Is the Ratio', body: 'Research shows couples who maintain a 5:1 ratio of positive to negative interactions are the ones whose difficult conversations land. Play, appreciation, laughter \u2014 these are medicine.', accent: '\u2696\uFE0F' },
      { title: 'Ordinary Devotion', body: 'The goodbye kiss when you\u2019re annoyed. The \u201Chow was your day?\u201D when you actually listen. Steps 1\u20136 ended the war. This step builds the refuge.', accent: '\uD83C\uDFE1' },
    ],
  },
  8: {
    stepNumber: 8,
    keyTakeaway: 'Imperfect practice is still practice. The underbrush becomes a path.',
    readMinutes: 4,
    cards: [
      { title: 'Knowledge Is Not Enough', body: 'You\u2019ve seen your patterns, felt what\u2019s underneath, shared your truth. That\u2019s recognition and release. Now comes the harder part: embodiment.', accent: '\uD83C\uDFCB\uFE0F' },
      { title: 'Expect Clumsiness', body: 'You\u2019ll try the Soft Startup and it\u2019ll sound rehearsed. You\u2019ll try to pause before reacting and catch yourself three seconds too late. That\u2019s not failure \u2014 that\u2019s neuroplasticity at work.', accent: '\uD83E\uDDE0' },
      { title: 'The Forest Path', body: 'Your old pattern is a well-worn path \u2014 your feet find it without thinking. The new pattern is machete work through underbrush. Slower, harder. But the underbrush becomes a path with practice.', accent: '\uD83C\uDF32' },
      { title: '66 Days, Not 21', body: 'It takes roughly 66 days for a new behavior to feel automatic. Sixty-six days of imperfect, awkward, courageous practice. Structure is not the opposite of freedom \u2014 it\u2019s what makes freedom possible.', accent: '\uD83D\uDCC5' },
    ],
  },
  9: {
    stepNumber: 9,
    keyTakeaway: 'The strongest relationships aren\u2019t conflict-free. They\u2019re repair-rich.',
    readMinutes: 4,
    cards: [
      { title: 'Fastest Repair Wins', body: 'Gottman found that masters of relationship repair within minutes \u2014 not hours, not days. And they repair genuinely: \u201CI see that I hurt you. What do you need right now?\u201D', accent: '\u26A1' },
      { title: 'Repair Feels Exposed', body: 'You\u2019ll feel exposed saying \u201CI think I got that wrong\u201D in the middle of an argument. Your protective parts will insist you\u2019re giving in. They\u2019re wrong. Repair is the strongest relational move there is.', accent: '\uD83D\uDEE1\uFE0F' },
      { title: 'Repair as Reflex', body: 'This step makes repair automatic \u2014 not something you think about for three days and bring up over dinner. Something that happens in the moment, while it still matters.', accent: '\uD83D\uDCAC' },
      { title: 'Fresh Wounds Heal Fastest', body: 'Ruptures are like fresh wounds: they heal when tended immediately. Left alone, they scar. Coming back is braver than never leaving.', accent: '\uD83E\uDE79' },
    ],
  },
  10: {
    stepNumber: 10,
    keyTakeaway: 'Rituals create predictability. Predictability is the foundation of safety.',
    readMinutes: 4,
    cards: [
      { title: 'Small and Consistent', body: 'Couples who last have rituals. Not elaborate date nights. Small, consistent moments: the goodbye kiss every morning, the \u201Chow was your day\u201D where you actually listen.', accent: '\uD83D\uDD01' },
      { title: 'Safety Through Predictability', body: 'When your nervous system learns that connection is reliable \u2014 same time, same form, every day \u2014 the vigilance softens. The scanning for threat quiets. The body settles into trust.', accent: '\uD83E\uDDE0' },
      { title: 'Signals of Safety', body: 'Your attachment system needs consistent signals to shift from insecure to earned-secure. Rituals ARE those signals. They tell your partner\u2019s nervous system: I\u2019m here. I\u2019m not leaving.', accent: '\uD83C\uDFE1' },
      { title: 'Rituals That Feel Like You', body: 'What does connection look like with YOUR schedules, temperaments, and values? The rituals that last are the ones that feel like you.', accent: '\u2728' },
    ],
  },
  11: {
    stepNumber: 11,
    keyTakeaway: 'Growth is a spiral, not a line. Every return is a deepening.',
    readMinutes: 4,
    cards: [
      { title: 'Not a Finish Line', body: 'Growth is not a destination you cross and then relax. It\u2019s a practice \u2014 like meditation, like music, like love itself.', accent: '\uD83C\uDF00' },
      { title: 'The Old Dance Returns', body: 'Under stress, the brain defaults to its most practiced route. Your old route has years of mileage. Your new route has weeks. The old patterns WILL return. That\u2019s not failure.', accent: '\uD83E\uDDE0' },
      { title: 'Gentleness Over Shame', body: '\u201COh \u2014 there\u2019s the old dance. I recognize this one. I know what it wants. Let me try the new move instead.\u201D That recognition IS the practice.', accent: '\uD83E\uDEB7' },
      { title: 'The Spiral Rises', body: 'You\u2019ll revisit themes from earlier steps. That\u2019s not regression \u2014 it\u2019s deepening. The same issue at Step 11 is not the same issue it was at Step 1. You are different now.', accent: '\uD83C\uDF00' },
    ],
  },
  12: {
    stepNumber: 12,
    keyTakeaway: 'Not by becoming someone new \u2014 by remembering who you were before the patterns took hold.',
    readMinutes: 5,
    cards: [
      { title: 'A Refuge', body: 'A place where both of you can arrive as you are \u2014 tired, scared, imperfect \u2014 and be held. Not fixed. Held.', accent: '\uD83C\uDFE1' },
      { title: 'Hold Me Tight', body: 'The feeling that someone has your back, no matter what. Different traditions, different languages \u2014 secure base, couple bubble, hold me tight \u2014 same recognition.', accent: '\uD83D\uDC9C' },
      { title: 'Building Solo Counts Too', body: 'Some of you are here alone \u2014 building the capacity to BE a refuge. You can\u2019t build one with someone else until you can be one for yourself. That work matters just as much.', accent: '\uD83E\uDE9E' },
      { title: 'Every Morning You Choose', body: 'This step never ends. Some days it\u2019s easy. Some days it\u2019s the hardest thing you do. But you keep choosing \u2014 because this is what you said matters, all the way back at Step 1.', accent: '\uD83C\uDF05' },
      { title: 'You Remembered', body: 'Something changed. You did. Not by becoming someone new \u2014 by remembering who you were before the patterns, the protections, the addictions to certainty took hold.', accent: '\u2728' },
    ],
  },
};

/** Get teaching cards for a step, or null if not defined. */
export function getStepTeachingCards(stepNumber: number): StepTeachingCards | null {
  return STEP_TEACHING_CARDS[stepNumber] ?? null;
}

/** Get just the key takeaway for a step. */
export function getKeyTakeaway(stepNumber: number): string | null {
  return STEP_TEACHING_CARDS[stepNumber]?.keyTakeaway ?? null;
}

/** Practice-to-step "why" text. Keyed by practiceId → stepNumber → description. */
export const PRACTICE_WHY: Record<string, Record<number, string>> = {
  'window-check': {
    1: 'Helps you notice when you\u2019re activated \u2014 the first step to interrupting the cycle.',
    4: 'Maps where your window narrows so you can widen it intentionally.',
    7: 'Checks your capacity before reaching toward your partner.',
    11: 'Your regulation baseline \u2014 notice how it\u2019s changed since Step 1.',
  },
  'recognize-cycle': {
    1: 'Maps your pursue-withdraw dance so you can see it from the outside.',
    6: 'Revisit the cycle with softer eyes now that the enemy story has dissolved.',
    11: 'See how the dance has changed \u2014 where it still catches you.',
  },
  'protest-polka': {
    1: 'Names the specific moves each partner makes when the cycle fires up.',
    6: 'Tracks how your moves have shifted since you started.',
    8: 'The polka is the old path. Name it to choose the new one.',
  },
  'emotional-inheritance-scan': {
    4: 'Traces your dance moves to their origin story \u2014 where you first learned them.',
    1: 'See how childhood patterns echo in your current relationship.',
  },
  'parts-check-in': {
    3: 'Notices which internal part is driving your certainty right now.',
    4: 'Identifies the protector parts that shape your dance moves.',
    7: 'Checks which part is showing up before you reach toward your partner.',
  },
  'defusion-from-stories': {
    3: 'Creates distance between you and the story \u2014 so you can see it instead of live it.',
    6: 'Loosens the enemy narrative enough to see your partner fresh.',
  },
  'turning-toward': {
    2: 'Practices noticing and responding to small bids for connection.',
    5: 'Builds the muscle of reaching, even when it feels risky.',
    10: 'The simplest ritual: turning toward instead of away.',
  },
  'soft-startup': {
    8: 'Replaces criticism with curiosity \u2014 the single biggest conversation upgrade.',
    9: 'Repairs start better when the first words are soft.',
  },
  'repair-attempt': {
    9: 'Practices the hardest relational move: coming back after rupture.',
    6: 'Repair while the enemy story is still dissolving takes courage.',
  },
  'hold-me-tight': {
    5: 'The core EFT exercise \u2014 reaching for your partner from the underneath.',
    7: 'Deepening the reach now that your partner knows what\u2019s under your armor.',
    9: 'Hold Me Tight after a rupture \u2014 repair at its most powerful.',
  },
  'bonding-through-vulnerability': {
    5: 'Structured vulnerability \u2014 safer than free-form, deeper than surface.',
    7: 'The reach continues. Each share builds the trust muscle.',
  },
  'self-compassion-break': {
    4: 'A pause between seeing your part and judging yourself for it.',
    6: 'Compassion for yourself makes compassion for your partner possible.',
  },
  'back-to-back-breathe': {
    7: 'Co-regulation through the body \u2014 your nervous systems syncing without words.',
    9: 'After a rupture, back-to-back breathing resets both systems.',
  },
};

/** Get the "why" text for a practice in a specific step context. */
export function getPracticeWhy(practiceId: string, stepNumber: number): string | null {
  return PRACTICE_WHY[practiceId]?.[stepNumber] ?? null;
}
