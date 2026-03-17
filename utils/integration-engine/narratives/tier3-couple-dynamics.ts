/**
 * Tier 3 Couple Dynamics — "Our Matrix"
 * 10 named couple dynamics × 6 lenses
 * Compares both partners' assessment data to name relationship patterns.
 */

import type { LensType } from '../types';

export type CoupleDomain =
  | 'attachment'
  | 'personality'
  | 'eq'
  | 'differentiation'
  | 'conflict'
  | 'values'
  | 'weare';

export interface CoupleNarrativeEntry {
  id: string;
  dynamicName: string;
  domain: CoupleDomain;
  lenses: Record<LensType, string>;
  coupleArc: {
    pattern: string;
    eachPartnersWound: string;
    theCost: string;
    theInvitation: string;
  };
  couplePractice: {
    name: string;
    description: string;
    frequency: string;
    bothPartners: boolean;
    partnerATask?: string;
    partnerBTask?: string;
    linkedExerciseId?: string;
  };
  coupleInvitation: string;
  evidenceLevel: 'strong' | 'moderate' | 'theoretical';
  keyCitations: string[];
}

interface PartnerScores {
  ecrr?: { anxietyScore: number; avoidanceScore: number; attachmentStyle: string };
  dutch?: { subscaleScores?: Record<string, { mean: number }>; primaryStyle?: string };
  values?: { top5Values?: string[]; domainScores?: Record<string, any> };
  dsir?: { totalNormalized?: number; subscaleScores?: Record<string, { normalized: number }> };
}

/** Helper: interpolate {A_name} / {B_name} into narrative strings */
export function interpolateCouple(text: string, aName: string, bName: string, extra?: Record<string, string>): string {
  let result = text.replace(/\{A_name\}/g, aName).replace(/\{B_name\}/g, bName);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
  }
  return result;
}

// ─── DYNAMIC 1: Pursue-Withdraw ───────────────────────────────────────────────
const pursueWithdraw: CoupleNarrativeEntry = {
  id: 'couple-pursue-withdraw',
  dynamicName: 'The Pursue-Withdraw Cycle',
  domain: 'attachment',
  lenses: {
    therapeutic: `This is the most researched couple pattern in the clinical literature. Sue Johnson's EFT identifies the pursue-withdraw cycle as the primary target of intervention — not because either partner is doing something wrong, but because the CYCLE itself has become the enemy of the relationship. The pursuer's attachment system reads distance as danger and responds with protest behavior: criticism, questioning, emotional intensity. The withdrawer's system reads that intensity as threat and responds with deactivation: stonewalling, physical exit, emotional shutdown. Each partner's protective strategy triggers the other's deepest wound.

From a Polyvagal perspective (Stephen Porges), the pursuer is stuck in sympathetic activation — fight mode masquerading as connection-seeking. The withdrawer drops into dorsal vagal shutdown — a freeze response that looks like indifference but is actually overwhelm. Neither partner is in the ventral vagal state where genuine connection is neurologically possible. This is why "just talk about it" fails: both nervous systems are in survival mode.

IFS (Richard Schwartz) would identify the pursuer's critical part as a firefighter protecting an exile who carries the terror of abandonment. The withdrawer's stonewalling part is a protector guarding an exile who carries the overwhelm of intrusion or engulfment. In Schema Therapy terms, the pursuer activates an Abandonment schema; the withdrawer activates a Subjugation or Enmeshment schema. The Gottman Method documents this as the most common of the "Four Horsemen" precursors — with the pursuer's criticism and the withdrawer's stonewalling forming a self-reinforcing loop. The clinical path forward: EFT Stage 2 work where the pursuer accesses the soft vulnerability beneath the protest ("I'm terrified I'm losing you") and the withdrawer accesses the overwhelm beneath the wall ("I shut down because the intensity floods me, not because I don't care"). AEDP (Diana Fosha) calls this "dropping down" — moving from defensive affect to core affect, where real contact becomes possible.`,

    soulful: `There is an ancient story the Greeks told about Orpheus descending into the underworld to retrieve Eurydice. He was told: walk forward, and she will follow. But do not turn around to check. He could not bear it. He turned. And she vanished. This is your cycle. {A_name}, you are Orpheus — turning back, reaching, needing to see that love is still there. {B_name}, you are not Eurydice choosing to leave — you are being pulled back into the underworld by the very force of that turning. The reaching itself creates the disappearing.

Jung would recognize this as the dance of Anima and Shadow. The pursuer carries the archetype of the Lover in its desperate form — eros reaching across the void, terrified of the emptiness. The withdrawer carries the Hermit, the one who must descend alone to find ground. Neither is wrong. Both are incomplete without the other. As Jung wrote, "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed." But the transformation requires that each of you stop trying to make the other into your missing piece and instead turn toward your own unlived life.

Your cycle is a season stuck on repeat — the pursuer living in perpetual spring, desperate to bloom, reaching toward warmth; the withdrawer caught in winter's necessary withdrawal, needing the dormancy that precedes all real growth. Rilke understood this when he wrote: "Perhaps all the dragons in our lives are princesses who are only waiting to see us act, just once, with beauty and courage. Perhaps everything that frightens us is, in its deepest essence, something helpless that wants our love." The pursuit is a dragon that is actually helpless terror. The withdrawal is a dragon that is actually overwhelmed love. As John O'Donohue wrote, "In the night of your heart, trust the absence — for the flame you seek is already flickering there, waiting for your stillness to find it."`,

    practical: `THE CYCLE: {A_name} senses distance → pursues harder (criticism, questions, intensity) → {B_name} feels flooded → withdraws (silence, physical exit, emotional shutdown) → {A_name} reads withdrawal as confirmation of abandonment → pursues harder → repeat.

THIS WEEK — TWO PRACTICES, ONE FOR EACH:

{A_name} (the pursuer): When you feel the urge to press, PAUSE. Put your hand on your own chest. Take three breaths. Then translate the urgency into one vulnerable sentence: "I'm feeling disconnected and it scares me. Can we find a time to reconnect?" Then WAIT. Do not follow up for at least two hours. Do not text. Do not bring it up again. James Clear's first law of habit change: make the new behavior obvious. Write this sentence on a sticky note where you'll see it during conflict. BJ Fogg's Tiny Habits model: anchor the new response to the old trigger — "After I feel the urge to press, I will put my hand on my chest and breathe three times."

{B_name} (the withdrawer): When you feel the urge to retreat, name it out loud BEFORE you go: "I'm starting to feel flooded. I need 20 minutes, but I'm not leaving this conversation. I'll come back at [specific time]." Then COME BACK. Set a timer. The return is everything — it rewrites the pursuer's prediction that withdrawal means abandonment. Your micro-step this week: practice the exit line once when stakes are LOW (a minor disagreement), so the neural pathway exists when stakes are high.`,

    developmental: `This pattern maps precisely onto Ken Wilber's Integral framework as a collision between two different developmental centers of gravity. The pursuer often operates from a strong emotional-relational line of development but an underdeveloped self-regulation line. The withdrawer may have a strong autonomy line but an underdeveloped relational-vulnerability line. Neither is at a "lower" stage — they are unevenly developed in complementary ways.

In Kegan's framework, the pursuer may be at Order 3 (the Socialized Mind) in attachment — their sense of self is embedded in the relationship, so distance feels like self-dissolution. The withdrawer may also be at Order 3 but embedded in their internal equilibrium — intensity feels like self-dissolution. The developmental move for both is toward Order 4 (Self-Authoring): the pursuer learns "I can feel the fear of disconnection without being consumed by it," while the withdrawer learns "I can stay present in emotional intensity without being annihilated by it."

From Erikson's framework, both partners are reworking the Trust vs. Mistrust crisis of infancy within the Intimacy vs. Isolation stage of adulthood. The pursuer mistrusts the durability of connection; the withdrawer mistrusts the safety of closeness. Spiral Dynamics offers another lens: the pursuer may be strongly anchored in the Green/communitarian value meme (connection is everything), while the withdrawer operates from Orange/autonomous achievement (self-sufficiency is strength). The couple's growth trajectory is toward Second Tier integration — holding both autonomy AND connection without one canceling the other.`,

    relational: `This is the relationship's central paradox, and Martin Buber's I-Thou framework illuminates it precisely: both partners are reaching for genuine encounter — the I-Thou moment where two beings truly meet — but the cycle keeps collapsing them into I-It. The pursuer treats the withdrawer as an object to be secured. The withdrawer treats the pursuer as a stimulus to be managed. Neither intends this. The cycle does it to them.

Harville Hendrix's Imago theory explains WHY you chose each other: the pursuer unconsciously selected a partner who would recreate the familiar wound of unavailability, offering the chance to finally heal it. The withdrawer selected a partner whose emotional intensity recreates the familiar wound of intrusion, offering the same chance. You are each other's healing opportunity — and each other's deepest trigger. Stan Tatkin's PACT framework calls this the "couple bubble" — the implicit agreement that "I will protect you from the world, and you will protect me." When the cycle activates, the bubble bursts: both partners feel unprotected by the very person who promised safety.

What the relationship itself is trying to become is a space where pursuit transforms into vulnerable reaching and withdrawal transforms into regulated presence. Gottman's research shows that couples who master this — where the pursuer can make "soft startups" and the withdrawer can practice "physiological self-soothing" and return — have the strongest long-term satisfaction. The relationship is not broken. It is a chrysalis. The cycle is the pressure that, if met with awareness rather than reactivity, produces the butterfly.`,

    simple: `One of you chases. The other hides. Both of you are scared. The chaser is scared of being left. The hider is scared of being overwhelmed. Name the fear out loud instead of acting on it — that one move changes everything.`,
  },
  coupleArc: {
    pattern: 'One pursues. One withdraws. The pursuit triggers withdrawal. The withdrawal triggers more pursuit. Nobody wins. Both lose.',
    eachPartnersWound: 'The pursuer learned that love is inconsistent — amplify the signal or be left. The withdrawer learned that intensity is dangerous — retreat or be overwhelmed.',
    theCost: 'The cycle replaces actual connection. Both partners are exhausted and further apart after each round.',
    theInvitation: 'Name the fear underneath the strategy. Hear the fear underneath your partner\'s strategy. The cycle loses its power when both fears are finally audible.',
  },
  couplePractice: {
    name: 'The Translation Practice',
    description: 'Pursuer translates urgency into vulnerability. Withdrawer names flooding before going.',
    frequency: 'Daily — when the cycle begins',
    bothPartners: false,
    partnerATask: 'When you feel the urge to press: "I\'m feeling disconnected and it scares me. Can we find a time to reconnect?"',
    partnerBTask: 'When you feel the urge to retreat: "I\'m starting to feel flooded. I need 20 minutes but I\'m coming back."',
    linkedExerciseId: 'hold-me-tight',
  },
  coupleInvitation: 'Learn each other\'s dialect. Urgency is fear. Silence is care. Both are love.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Johnson, S. (2019). Attachment theory in practice: EFT with individuals, couples, and families.',
    'Schachner et al. (2012). 539-couple longitudinal attachment study.',
    'Greenman & Johnson (2013). EFT for couples meta-analysis.',
    'Porges, S. (2011). The Polyvagal Theory.',
    'Schwartz, R. (2001). Internal Family Systems Therapy.',
    'Gottman, J. & Silver, N. (1999). The Seven Principles for Making Marriage Work.',
  ],
};

// ─── DYNAMIC 2: Mutual Withdrawal ────────────────────────────────────────────
const mutualWithdrawal: CoupleNarrativeEntry = {
  id: 'couple-mutual-withdrawal',
  dynamicName: 'Mutual Withdrawal',
  domain: 'conflict',
  lenses: {
    therapeutic: `Research on attachment identifies this pattern as the "silent crisis" — couples who never fight but slowly drift into parallel lives. In EFT's framework, both partners have deactivated their attachment needs, creating a relationship that functions but doesn't nourish. Sue Johnson calls this "the ice couple" — not frozen in conflict but frozen in absence. The 539-couple study found attachment avoidance predicted instability through a different pathway than anxiety: not through conflict, but through emotional absence.

From a Polyvagal lens (Porges), both partners default to a blend of dorsal vagal immobilization and social engagement that LOOKS calm but lacks the ventral vagal warmth of genuine connection. The nervous systems have co-regulated around flatness — each partner's stillness reinforcing the other's. DBT (Marsha Linehan) would frame this as mutual emotional avoidance — both partners are skilled at distress tolerance but underdeveloped in emotional expression. They tolerate the absence of intimacy rather than risking the vulnerability that would create it.

In IFS terms, both partners have strong Manager parts running the show — keeping things organized, functional, and safe — while their Exile parts (carrying loneliness, longing, unmet need) remain locked away. Schema Therapy identifies the Emotional Deprivation schema in both partners, often paired with Emotional Inhibition: the belief that emotional needs won't be met, combined with the rule that expressing them is dangerous or weak. Aaron Beck's cognitive model would note the shared automatic thought: "If I bring this up, it will only make things worse — better to leave it." The thought feels rational. It is the engine of the drift. Gottman's research on "turning away" from bids for connection shows that consistent non-response — not dramatic rejection, just absence — erodes trust at the rate of approximately 0.04% per ignored bid, compounding silently over years.`,

    soulful: `There is a myth of two trees that grew so close their canopies touched, but their roots never intertwined. From above, they looked like one great organism. Below the surface, two separate root systems drew from different wells, never sharing water, never sending nutrients across the gap. This is the myth of your togetherness — a canopy of shared life above, and below, two solitudes that have forgotten how to reach toward each other.

Jung called this the danger of the Persona — the mask that becomes so comfortable it replaces the face. Both of you have perfected the Persona of the "fine" couple. The relationship's Shadow — its unlived emotional life, its unspoken hungers, its uncried tears — grows larger in direct proportion to the Persona's polish. James Hillman wrote, "The soul requires mess, confusion, and emotional upheaval to deepen." Your relationship has traded depth for tidiness, and the soul of the bond is starving in the quiet.

Ecologically, you are in a kind of emotional drought. The soil between you is dry — not barren, but waiting. Wendell Berry understood: "The mind that is not baffled is not employed. The impeded stream is the one that sings." Your stream flows without impediment, without song. It needs a stone dropped in — a single vulnerable truth — to create the turbulence that makes music. Mary Oliver asked the question that belongs to both of you: "Tell me, what is it you plan to do with your one wild and precious life?" The wildness is what's missing. Not chaos — aliveness. Pema Chodron reminds us: "The most fundamental aggression to ourselves, the most fundamental harm we can do to ourselves, is to remain ignorant by not having the courage and the respect to look at ourselves honestly and gently." The silence between you is not gentleness. It is the gentlest form of aggression against the bond.`,

    practical: `THE PATTERN: Something needs saying → both of you sense it → neither of you says it → the moment passes → distance grows by one invisible increment → multiply by months and years.

THIS WEEK — TWO CONCRETE STEPS:

STEP 1 (Together): The 10-Minute Temperature Check. Set a timer. Each partner shares one thing they've been carrying silently — not a complaint, not a problem to solve, just something real. Use this starter: "Something I haven't said out loud is..." The other partner's only job: listen. Not fix. Not deflect. Not say "me too." Listen. Then switch. James Clear's habit stacking: attach this to something you already do — right after dinner, before screens come out.

STEP 2 (Individual micro-steps):
{A_name}: Once this week, initiate physical contact that has no agenda — a hand on the shoulder, a longer-than-usual hug. BJ Fogg says: after I sit down on the couch next to my partner, I will reach for their hand. That's the whole habit. Tiny.
{B_name}: Once this week, share something you enjoyed today — not logistics, not plans, just: "I liked this moment." Text it if saying it feels too exposed. The medium doesn't matter. The reaching does.

Stages of change reality check: if you're both in Contemplation (thinking about change but not acting), these micro-steps move you into Preparation. Don't skip to Action with a grand romantic gesture — that's how avoidant systems get spooked and retreat further.`,

    developmental: `Two avoidant partners often found each other precisely BECAUSE the other person didn't demand emotional engagement. The early relationship felt safe — no one pushing, no one overwhelming. In Erikson's framework, both partners are navigating Stage 6 (Intimacy vs. Isolation) with the tools of Stage 5 (Identity) — strong individual identity, underdeveloped capacity for mutual vulnerability. The result is Isolation wearing the mask of Intimacy: sharing a home, a life, a bed — without sharing an interior.

In Kegan's terms, both partners may be solidly at Order 4 (Self-Authoring) — clear, coherent, internally organized. The developmental edge is Order 5 (Self-Transforming or Inter-Individual), where two self-authored selves risk being genuinely changed by the encounter with the other. Not losing their structure — discovering what emerges when two structures interpenetrate.

Spiral Dynamics maps this as two partners anchored in Orange (achievement, autonomy, competence) needing to integrate Green (connection, feeling, vulnerability) without abandoning the Orange strengths. Wilber's Integral model would say both partners have strong Upper-Left (individual interior/cognitive) development but underdeveloped Lower-Left (shared interior/relational) space. The couple's growth trajectory is to develop the "We-space" — the intersubjective field between them — which requires both partners to risk being seen in their incompleteness.`,

    relational: `Martin Buber wrote, "All real living is meeting." What you have built together is a masterpiece of parallel existence — two I's that have never fully risked the encounter that would make them We. The relationship exists in what Buber called the "I-It" mode: functional, respectful, organized, but missing the trembling aliveness of I-Thou, where one being turns fully toward another and says, without words, "I see you. I am here. I am affected by you."

Harville Hendrix's Imago therapy identifies this as the "invisible divorce" — partners who remain legally and physically together but have emotionally left the marriage without either one acknowledging the departure. The Imago framework would ask: what did each of you learn in childhood about the cost of emotional need? What made it safer to need nothing than to need something and be disappointed?

Stan Tatkin's PACT approach would focus on the couple's nervous system co-regulation pattern: you have settled into a low-arousal equilibrium that feels stable but is actually stagnant. The relationship itself is trying to become a place where two fiercely independent people discover that interdependence is not weakness — it is the next evolution of strength. Gottman's Sound Relationship House model would identify the missing floor: emotional attunement. The friendship may be intact. The fondness may be present. But the "turning toward" that keeps the emotional bank account funded has dropped to near-zero, and neither partner has noticed because neither is making withdrawals either.`,

    simple: `You two are basically expert roommates who happen to love each other. No fights, no drama — but also no real feeling getting through. One honest sentence from each of you this week. That's it. Start small.`,
  },
  coupleArc: {
    pattern: 'Both withdraw. Nothing is said. The silence normalizes. The distance grows without anyone choosing it.',
    eachPartnersWound: 'Both learned that needing things from others is risky or futile — independence became protection.',
    theCost: 'A relationship that functions but doesn\'t nourish. Parallel lives in the same house.',
    theInvitation: 'One real sentence of vulnerability this week. From each of you. The antidote is not therapy. It is contact.',
  },
  couplePractice: {
    name: 'The 10-Minute Temperature Check',
    description: 'Each partner shares one thing carried silently. The other listens without fixing.',
    frequency: 'Weekly',
    bothPartners: true,
    linkedExerciseId: 'emotional-bid',
  },
  coupleInvitation: 'You built a life together. Now build a home in each other. One sentence at a time.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Schachner et al. (2012). 539-couple attachment study.',
    'Erikson, E. (1963). Childhood and Society. Stage 6: Intimacy vs. Isolation.',
    'Porges, S. (2011). The Polyvagal Theory.',
    'Linehan, M. (1993). Cognitive-Behavioral Treatment of Borderline Personality Disorder.',
    'Gottman, J. (1999). The Marriage Clinic. Turning toward research.',
  ],
};

// ─── DYNAMIC 3: Escalation-Escalation ────────────────────────────────────────
const escalationEscalation: CoupleNarrativeEntry = {
  id: 'couple-escalation',
  dynamicName: 'Escalation-Escalation',
  domain: 'conflict',
  lenses: {
    therapeutic: `Gottman's research identifies mutual escalation as the pattern most associated with Diffuse Physiological Arousal (DPA) — the state where heart rate exceeds 100 BPM and productive conversation becomes neurologically impossible. When both partners escalate, the interaction enters a positive feedback loop with no natural brake. The Four Horsemen ride in pairs here: criticism meets counter-criticism, contempt meets counter-contempt.

From a Polyvagal perspective, both partners are locked in sympathetic nervous system activation — full fight response. Stephen Porges's research shows that in this state, the middle ear muscles literally retune to detect low-frequency threat sounds rather than human speech frequencies. You are biologically unable to hear each other's words as intended. Everything sounds like an attack because the nervous system is filtering for danger.

EFT understands both partners as expressing attachment urgency simultaneously — both are reaching for connection through intensity, neither can hear through the other's volume. In IFS terms, both partners' Firefighter parts have taken over — impulsive, reactive protectors that will do anything to stop the pain of the Exile's activation, including scorching the relationship. DBT's biosocial model (Linehan) explains the escalation chain: emotional vulnerability + invalidating response = emotional dysregulation. When BOTH partners are emotionally vulnerable AND both feel invalidated simultaneously, the dysregulation compounds exponentially.

Schema Therapy identifies the dynamic as mutual Counterattack — a coping mode triggered when the Punitive Parent schema activates in both partners. ACT (Steven Hayes) would note that both partners have fused with their anger — they ARE the anger rather than observing it — and the behavioral repertoire narrows to a single response: fight. The clinical path: building the "pause muscle" through practiced self-regulation before attempting any content-level conversation. Gottman's repair attempts research shows that in escalation-escalation couples, repair attempts are made but not received — the listener's nervous system is too activated to register the olive branch.`,

    soulful: `In Norse mythology, there is Ragnarok — the twilight of the gods, where even the divine destroy each other in a conflagration that consumes the world. And after Ragnarok, something extraordinary: the world is reborn. Greener. More alive. Washed clean by the fire. Your conflicts carry this mythic structure — destruction that holds within it the seed of renewal, if you can learn to contain the fire rather than be consumed by it.

Jung saw in every eruption the archetype of the Trickster — the force that destroys old forms to make way for new ones. Your fights are Trickster energy running wild, uncontained. The Shadow of your relationship lives in these eruptions: everything repressed, everything swallowed, everything unfelt comes roaring up like lava through a fissure. As Jung wrote, "There is no coming to consciousness without pain. People will do anything, no matter how absurd, to avoid facing their own soul." Your escalations are what happens when two souls refuse to avoid each other — but lack the vessel to hold what emerges.

Think of yourselves as two weather systems colliding — each bringing enormous energy, enormous moisture, enormous electrical charge. The collision produces thunderstorms of devastating power. But thunderstorms also produce rain. The same energy that destroys can nourish, if the landscape can hold it. David Whyte wrote, "The conversation you need to have is the one you are most afraid to have." You are not afraid of conversation — you are afraid of the silence after it, the vulnerability beneath the volume. Rumi understood: "The wound is the place where the Light enters you." Your wounds are real. The light trying to enter through them is also real. Build a container — not to suppress the fire, but to let it illuminate rather than immolate.`,

    practical: `THE CYCLE: Issue arises → {A_name} escalates → {B_name} matches → {A_name} raises → {B_name} raises → both are flooding → words become weapons → eventual exhaustion → nothing resolved → resentment stored → next time the fuse is shorter.

THIS WEEK — THE CIRCUIT BREAKER (Two Steps):

STEP 1: Agree on a code word NOW, before the next fight. Something absurd — "pineapple," "penguin," whatever makes you both almost-smile. When EITHER of you says the word, it means: we are both flooding and nothing good can happen right now. 20-minute mandatory separation. Both leave. Both do something physical — walk, cold water on wrists, jumping jacks. The nervous system needs a somatic discharge, not more thinking.

STEP 2 (the micro-steps):
{A_name}: Your one habit this week — when you notice your voice getting louder, drop it one notch. Not to a whisper. Just one notch quieter than the impulse. BJ Fogg's anchor: "After I hear myself getting loud, I will take one breath and lower my volume by 20%." That's the whole habit.
{B_name}: Your one habit — when you feel the counterattack rising, buy yourself 5 seconds. Say "Hold on" (not "shut up," not "whatever" — just "hold on"). In those 5 seconds, ask yourself: "What am I actually hurt about right now?" You won't always find the answer. The pause itself is the point.

Stages of change: if you're reading this, you're at least in Contemplation. The code word agreement moves you to Preparation. Using it once moves you to Action. Don't try to fix the whole pattern — just interrupt it once this week.`,

    developmental: `Two escalators often grew up in environments where intensity was the only signal that worked. In Erikson's terms, the Initiative vs. Guilt stage may have resolved toward Initiative-without-restraint — assertiveness that learned no natural boundary because the environment either ignored moderate signals or punished them, rewarding only the loudest voice.

In Kegan's framework, both partners may be operating from Order 3 (Socialized Mind) during conflict — embedded in the emotional field, unable to step back and observe it. The developmental leap is to Order 4: the capacity to HAVE an emotion without BEING the emotion. "I notice I'm furious" is a fundamentally different cognitive structure than "I AM furious." The first has a self observing the fury. The second has no self — only fury.

Spiral Dynamics maps this pattern as Red value meme activation — raw power, dominance, "I will not be dominated." Both partners access Red in conflict even if they operate from Green or Orange in daily life. The developmental trajectory is not to eliminate Red (which carries vitality, passion, and the refusal to be erased) but to integrate it: passion in service of connection rather than in service of dominance. Wilber's Integral model notes that the couple needs to develop the Upper-Right quadrant (behavioral skills, nervous system regulation) alongside the Upper-Left (cognitive reframing) — insight alone won't interrupt a pattern this physiologically driven.`,

    relational: `Martin Buber described the I-Thou encounter as a moment where two beings face each other in full presence — but he also warned of the I-It collapse, where the other becomes merely an obstacle or a means. In your escalations, you cycle between I-Thou and I-It at dizzying speed: you begin with the genuine urgency of wanting to be SEEN (I-Thou), but the moment the other's response feels inadequate, you collapse into I-It — now they are the enemy, the problem, the wall.

Harville Hendrix's Imago theory reveals the hidden structure: you are both drawn to each other because your partner carries the face of your original wound. The intensity of your fights is proportional to the depth of the childhood material being activated. When {A_name} raises their voice, they are not just talking to {B_name} — they are talking to every person who ever dismissed them. When {B_name} fires back, they are fighting every silencing they ever endured. The relationship is trying to become a place where these ancient battles can finally be fought to completion — not through more war, but through witnessed vulnerability.

Stan Tatkin's PACT framework would name this: you are both "islands" who become "waves" in conflict — or both "waves" who amplify each other. The couple bubble has no shock absorber. The relationship itself needs to develop what Tatkin calls "mutual regulation" — the shared capacity to bring each other DOWN from arousal, not just UP. Gottman's research on "masters vs. disasters" of relationships shows the crucial variable is not whether couples fight — it's whether they can repair. Your repair mechanism is intact (you always come back to each other). Your repair TIMING needs work — the repair attempt must come before the damage, not after.`,

    simple: `You fight like you're both trying to win a war, but you're on the same side. Pick a ridiculous code word. When either of you says it, take a 20-minute break. Come back calmer. Same passion, better container.`,
  },
  coupleArc: {
    pattern: 'Both escalate simultaneously. The cycle has no natural brake. Neither person can be the one to soften first.',
    eachPartnersWound: 'Both learned: if you\'re not loud, you\'re invisible. Intensity was the only signal that worked.',
    theCost: 'Words become weapons. Nothing resolves. Resentment compounds. The fuse gets shorter each time.',
    theInvitation: 'Build a circuit breaker together. A code word. A pause. A return. The passion is a resource — it needs a container.',
  },
  couplePractice: {
    name: 'The Circuit Breaker',
    description: 'Agree on a code word. When either says it: 20-minute pause, both leave, both return, try again at half the volume.',
    frequency: 'Whenever escalation begins',
    bothPartners: true,
    linkedExerciseId: 'repair-attempt',
  },
  coupleInvitation: 'The passion between you is not the problem. It needs a container. Build one together.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Gottman, J. (1994). What Predicts Divorce. DPA research.',
    'Greenman & Johnson (2013). EFT transdiagnostic framework.',
    'Porges, S. (2011). The Polyvagal Theory.',
    'Linehan, M. (1993). DBT biosocial model.',
    'Schwartz, R. (2001). Internal Family Systems Therapy.',
  ],
};

// ─── DYNAMIC 4: The Leader-Accommodator ──────────────────────────────────────
const leaderAccommodator: CoupleNarrativeEntry = {
  id: 'couple-leader-accommodator',
  dynamicName: 'The Leader-Accommodator',
  domain: 'conflict',
  lenses: {
    therapeutic: `This pattern often appears conflict-free on the surface — decisions get made, action gets taken, nobody fights. But underneath the efficiency lies a clinical concern that multiple frameworks illuminate. ACT's values-based framework (Steven Hayes) asks the decisive question: is the accommodator yielding because they genuinely don't mind, or because asserting their own position feels dangerous? The first is easy temperament. The second is slowly eroding selfhood — what ACT calls "experiential avoidance" applied to the relational domain: avoiding the discomfort of self-assertion at the cost of living a values-congruent life.

In IFS terms (Richard Schwartz), the accommodator's Self is likely blended with a People-Pleasing manager part — a protector that learned early that harmony is purchased through self-erasure. The leader's parts system may include an over-functioning Manager that fills relational vacuums automatically. Neither partner's Self is leading. Schema Therapy would identify the accommodator's Subjugation schema ("my needs don't matter; others' needs come first") potentially paired with the leader's Entitlement/Grandiosity schema ("my way of seeing things is naturally correct").

Polyvagal theory adds a body-level understanding: the accommodator may experience a fawn response — a survival strategy where the nervous system reads relational assertion as threat and defaults to appeasement. This is not a personality trait; it is a nervous system strategy. From a Gottman perspective, the pattern produces what looks like positive sentiment override (no criticism, no contempt), but the accommodator's suppressed resentment accumulates in what Gottman calls "negative absorbing states" — eventually erupting in what appears to be an inexplicable emotional explosion, which is actually years of ungiven "no's" arriving all at once. DBT's interpersonal effectiveness module (DEAR MAN) provides concrete skills for the accommodator to assert needs while maintaining the relationship — proving that self-expression and connection are not mutually exclusive.`,

    soulful: `Clarissa Pinkola Estes wrote in Women Who Run With the Wolves: "To be ourselves causes us to be exiled by many others, and yet to comply with what others want causes us to be exiled from ourselves." This is the accommodator's exile — not from the relationship, but from their own interior life. And this is the leader's quieter exile — from the truth that leading a partner who cannot say no is leading no one at all.

There is a Jungian archetype alive in this dynamic: the Hero and the Shadow of the Hero. The leader carries the Hero archetype — decisiveness, direction, the capacity to act. But the Hero's Shadow is the Tyrant: one who leads not because others choose to follow, but because others have forgotten they can choose. The accommodator carries the archetype of the Wise Old Woman/Man in its dormant form — a deep knowing that has gone silent, a perspective that the relationship desperately needs but has stopped asking for. As Jung observed, "The privilege of a lifetime is to become who you truly are." The accommodator has put that privilege on indefinite hold.

Picture a river and its bank. The leader is the current — always moving, always deciding the direction. The accommodator is the bank — shaping the river's path through quiet containment. But a bank that never redirects the current is not a bank. It is eroded earth. And a river that never meets resistance is not a river. It is a flood. Khalil Gibran wrote in The Prophet: "Let there be spaces in your togetherness, and let the winds of the heavens dance between you." But you need more than spaces — you need two winds. David Whyte understood this: "The courageous conversation is the one we most want to avoid, the one that will change us if we dare to show up for it." The accommodator's courageous conversation is saying, for the first time: "Actually, I want something different."`,

    practical: `THIS WEEK — THREE CONCRETE MOVES:

MOVE 1 (Role Reversal): For three decisions this week (what to eat, what to watch, where to go), {B_name} chooses FIRST and {A_name} follows. No debate. No "are you sure?" No subtle steering. Just: you lead, I follow.

MOVE 2 (Micro-steps for each):
{B_name} (the accommodator): Your one tiny habit — BJ Fogg style: "After my partner suggests something, I will pause for 5 seconds and check: do I actually want this?" You don't have to disagree. You just have to CHECK. Put a hand on your stomach — your gut often knows before your mind does. If you notice a "no," practice saying "Let me think about it" instead of automatic "sure." That buys you time without requiring confrontation.

{A_name} (the leader): Your one tiny habit: "After I state a preference, I will add: 'What do you think?'" — and then WAIT. Count to ten silently. Do not fill the pause. The accommodator needs silence to find their voice. Every second you fill is a second their voice stays buried.

MOVE 3 (James Clear's environment design): {B_name}, put a small object — a stone, a ring, anything tactile — in your pocket this week. Every time you touch it, it's a reminder: I have a preference. I'm allowed to name it.

Stages of change: the accommodator is likely in Precontemplation ("this is just how I am") or Contemplation ("I notice I always defer but..."). These micro-steps are designed for Contemplation-to-Preparation. Don't aim for a dramatic confrontation — that's Action-stage work, and it will backfire without the groundwork.`,

    developmental: `The leader-accommodator pattern maps cleanly to Kegan's developmental framework. The leader is often operating from Order 4 (Self-Authoring — "I know what I want and I pursue it"). The accommodator may be at Order 3 (the Socialized Mind — "my sense of what's okay to want is defined by the relationship and my partner's reactions"). At Order 3, the accommodator cannot separate their own desires from what the relationship seems to demand — they ARE their role.

The developmental invitation is twofold. For the accommodator: the journey from Order 3 to Order 4 — discovering "I have values, preferences, and perspectives that exist independently of what my partner wants or what keeps the peace." This is not selfishness. It is the birth of a self. For the leader: the transition from Order 4 to Order 5 (Self-Transforming) requires recognizing that your partner's emergence may challenge your framework — and that's the point, not the problem. Order 5 consciousness can hold the paradox: "I have a clear perspective AND my partner's different perspective can genuinely change mine."

Erikson's framework maps this to Generativity vs. Stagnation: is the leader generating growth in the relationship, or stagnating into comfortable control? Is the accommodator generating their own voice, or stagnating into comfortable silence? Spiral Dynamics notes the leader may be solidly Orange (strategic, efficient, goal-directed) while the accommodator operates from Blue (loyalty, duty, role-adherence) or early Green (harmony above all). The couple's growth trajectory requires the accommodator to access their own Orange (self-authorship, strategic self-expression) while the leader integrates Green (receptivity, genuine curiosity about the other's interior).`,

    relational: `The relationship itself has become what Buber would call a monologue disguised as dialogue — one voice speaking, one voice echoing, the space between them filled with agreement that is actually absence. The "We" that exists here is really an expanded "I" — the leader's I, with the accommodator providing accompaniment rather than counterpoint.

Harville Hendrix's Imago framework reveals why this pairing formed: the leader likely had a childhood where agency was the path to love ("I was valued for being competent, decisive, in charge"), and unconsciously sought a partner who would reinforce that identity. The accommodator likely had a childhood where compliance was the path to safety ("I was loved when I was easy, agreeable, no trouble"), and unconsciously sought a partner whose certainty provided structure. Each got what they sought — and each is now trapped by it.

Stan Tatkin's PACT approach would identify this as an "anchor-wave" pairing where the anchor has become the entire relationship's operating system. The wave's energy — their spontaneity, their otherness, their capacity to surprise — has been suppressed. The relationship is trying to become what Tatkin calls a "two-person psychological system" — where both nervous systems have equal weight, both voices shape the direction, both partners feel the exhilarating discomfort of being genuinely influenced by someone who sees the world differently. Gottman's research on "accepting influence" shows that relationships where one partner consistently fails to accept the other's influence have an 81% chance of deterioration. The question is not whether the leader is willing to listen — it's whether the accommodator is willing to speak.`,

    simple: `One of you always picks the restaurant. The other always says "I don't mind." You both mind, actually. This week, the quiet one picks three things. The loud one follows. See what happens.`,
  },
  coupleArc: {
    pattern: 'One decides. One accommodates. No conflict. But one voice slowly disappears.',
    eachPartnersWound: 'The leader learned that clarity gets things done. The accommodator learned that asserting preferences creates conflict or rupture — better to yield.',
    theCost: 'The accommodator loses their voice. The leader loses a real partner. Both lose the friction that makes connection real.',
    theInvitation: 'The accommodator reclaims their voice. The leader makes room for it. A relationship needs two people present.',
  },
  couplePractice: {
    name: 'Role Reversal',
    description: 'For three decisions this week, the usual follower chooses first and the usual leader follows without overriding.',
    frequency: 'Three times this week',
    bothPartners: false,
    partnerATask: 'Follow without debating or overriding. Notice what it feels like to receive instead of lead.',
    partnerBTask: 'Choose first. Sit with the discomfort of asserting instead of deferring.',
    linkedExerciseId: 'soft-startup',
  },
  coupleInvitation: 'A relationship of one voice is a monologue. Bring both voices to the table.',
  evidenceLevel: 'moderate',
  keyCitations: [
    'Hayes, S. et al. (2006). ACT values-based framework in couples.',
    'Kegan, R. (1994). In Over Our Heads. Orders 3-5.',
    'Christensen et al. Integrative Behavioral Couples Therapy.',
    'Schwartz, R. (2001). Internal Family Systems Therapy.',
    'Linehan, M. (1993). DBT interpersonal effectiveness module.',
    'Gottman, J. (1999). Accepting influence research.',
  ],
};

// ─── DYNAMIC 5: Natural Negotiators ──────────────────────────────────────────
const naturalNegotiators: CoupleNarrativeEntry = {
  id: 'couple-natural-negotiators',
  dynamicName: 'Natural Negotiators',
  domain: 'conflict',
  lenses: {
    therapeutic: `This is the most stable conflict interaction pattern in the research. When both partners orient toward problem-solving or compromise, the couple has a natural repair mechanism — disagreements become collaborative rather than adversarial. Gottman's research confirms that partner-directed positive behaviors predict satisfaction more strongly than the absence of negative behaviors. This couple is generating positive conflict behaviors consistently — what Gottman calls a 5:1 positive-to-negative ratio during conflict discussions.

The clinical consideration is subtle but important: ensure that the problem-solving orientation includes space for emotional processing, not just solution generation. Sue Johnson (EFT) warns that "fix-it" couples can become so efficient at resolving surface issues that they never reach the attachment-level emotions underneath. ACT (Steven Hayes) frames this as a potential values trap: if "we solve problems well" becomes the couple's identity, they may avoid bringing up issues that DON'T have clean solutions — existential concerns, grief, ambivalence, desire.

From a CBT perspective (Aaron Beck), this couple has strong collaborative empiricism — the ability to treat problems as shared puzzles rather than blame exchanges. Their automatic thoughts during conflict tend toward "we can figure this out" rather than "you're the problem." This cognitive architecture is genuinely protective. From an IFS perspective, both partners have good Self-energy during conflict — curious, compassionate, clear. The growth edge: can they maintain that Self-energy when the issue touches exile-level pain (old wounds, deep fears, identity threats)? Polyvagal theory notes this couple likely co-regulates well — both stay in ventral vagal (social engagement) during disagreements, which is neurologically optimal. The edge: when something pushes one partner into sympathetic activation (fight/flight), can the other tolerate the disruption to their comfortable collaborative mode?`,

    soulful: `You have a gift that most couples spend years in therapy trying to build: the ability to sit across from each other in disagreement and still see a partner, not an enemy. Do not take this for granted. It is rarer than you know. As Rumi wrote, "Out beyond ideas of wrongdoing and rightdoing, there is a field. I'll meet you there." You meet each other in that field naturally. Your workshop of shared problem-solving is sacred ground.

And yet — the archetype of the Wise Old Man and Wise Old Woman carries a shadow: the Technician. The one who has mastered the mechanics of connection so thoroughly that they've bypassed the mystery. Jung wrote: "Your vision will become clear only when you can look into your own heart. Who looks outside, dreams; who looks inside, awakes." Your excellence at looking outward at problems together may be concealing an invitation to look inward — at the feelings that don't resolve neatly, the longings that have no action item, the parts of you that don't want a solution but want to be WITNESSED.

Consider the ecology of a well-maintained garden versus a wild meadow. Your relationship is the garden — tended, organized, productive. Beautiful. And the wild meadow, with its tangles and its unexpected blossoms and its creatures that arrive uninvited, carries a different kind of beauty: the beauty of what emerges when you stop managing and start marveling. Thomas Moore wrote in Care of the Soul: "The soul doesn't want to be fixed; it wants simply to be seen and heard." Let your next disagreement include a moment where neither of you reaches for a solution — where you simply sit in the discomfort of not-knowing together, and discover what lives in that pause.`,

    practical: `YOUR STRENGTH: You solve problems together well. That puts you ahead of 80% of couples.
YOUR EDGE: Don't skip the feeling on the way to the fix.

THIS WEEK — ONE NEW HABIT:
When a disagreement arises, before EITHER of you proposes a solution, each partner shares one sentence about how they FEEL about it. Not what should be done. What it feels like. Use the format: "When [this happens], I feel [emotion word]."

{A_name}'s micro-step (BJ Fogg): "After I notice we're in problem-solving mode, I will pause and say: 'Before we fix this — how are you feeling about it?'" That question is your tiny habit.
{B_name}'s micro-step: "After my partner asks how I'm feeling, I will name ONE emotion before jumping to solutions." No explanation needed. Just the word: frustrated, sad, scared, unseen.

James Clear's identity-based habit: You already identify as "people who solve things together." Add one word: "people who FEEL and solve things together." That identity shift changes which behaviors feel natural.

Why this matters: research on emotional attunement (Gottman) shows that when partners feel heard emotionally BEFORE problem-solving begins, they rate the solutions as more satisfying — even when the solutions are identical. The feeling isn't a detour. It's the foundation.`,

    developmental: `You may both be at Kegan's Order 4 — self-authoring minds that bring clear positions to the table and negotiate skillfully. Your conflict is mature, organized, and productive. The transition to Order 5 (Inter-Individual or Self-Transforming) requires something counterintuitive for a couple this competent: moments of genuine not-knowing.

Order 5 consciousness is not about better negotiation — it's about allowing the OTHER's perspective to genuinely transform your own. Not "I'll give you this if you give me that" (that's Order 4 at its best) but "Your way of seeing this is making me reconsider my entire framework" (that's Order 5). The difference: compromise preserves both original positions in reduced form. Transformation creates a third position that neither partner could have reached alone.

In Wilber's Integral framework, you have strong development in the cognitive and interpersonal lines but may have an underdeveloped contemplative or spiritual line — the capacity to hold paradox, to rest in ambiguity, to let something emerge rather than engineering it. Spiral Dynamics maps your pattern as healthy Green (consensus, collaboration, mutual care) reaching toward Second Tier (Yellow/Teal) — where the system itself becomes visible and the couple can observe its own patterns with curiosity rather than just operating within them. Erikson's Generativity stage applies: your generative capacity is strong in the practical domain. Can you become generative in the emotional domain — creating new depths of feeling together, not just new solutions?`,

    relational: `Buber would recognize in your relationship the achievement of genuine dialogue — the I-Thou encounter where two beings face each other with openness and good faith. This is not small. Most couples cycle between monologue (one speaks, the other waits to speak) and technical exchange (information transfer without presence). You have something alive.

The relational growth edge, from Hendrix's Imago perspective, is this: your efficient conflict resolution may be unconsciously protecting both of you from the deeper Imago encounter — the moment where the childhood wound surfaces and demands not a solution but a HOLDING. The Imago dialogue's three steps (mirroring, validation, empathy) slow the process deliberately, creating space for the emotional content that your natural efficiency might bypass.

Stan Tatkin's PACT framework celebrates your pattern — you are a "secure-functioning couple" in the conflict domain. The invitation from PACT: use that security as a platform for deeper risk-taking. Since you trust each other in disagreement, you can afford to bring the harder material: "I sometimes wonder if we're just good roommates." "I'm afraid that when we solve everything so quickly, we skip the part where we actually FEEL together." The relationship is not trying to become better at negotiation. It is trying to discover what lives underneath the competence — the tender, unresolved, unsolvable things that make two people truly intimate rather than merely effective.`,

    simple: `You two are actually good at disagreeing — that's rare and valuable. Your one edge: slow down enough to feel before you fix. The solution works better when both hearts are in it.`,
  },
  coupleArc: {
    pattern: 'Disagreement → collaboration → resolution. Clean cycle. Rare gift.',
    eachPartnersWound: 'Both learned that problems can be solved — a belief that empowers the relationship.',
    theCost: 'Sometimes the efficiency skips the emotional content. The fix happens before the feeling is heard.',
    theInvitation: 'Feel first. Fix second. Both matter, and the feeling needs to come first.',
  },
  couplePractice: {
    name: 'Feel Before Fix',
    description: 'Before proposing any solution to a disagreement, each partner shares one sentence about how they feel about it first.',
    frequency: 'Every disagreement this week',
    bothPartners: true,
    linkedExerciseId: 'dreams-within-conflict',
  },
  coupleInvitation: 'You already build well together. Now feel before you fix. That\'s the missing step.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Christensen & Jacobson (2000). Reconcilable Differences. Behavioral frequency research.',
    'Kegan, R. (1994). In Over Our Heads. Order 4-5 transitions.',
    'Gottman, J. (1999). The Seven Principles for Making Marriage Work.',
    'Johnson, S. (2008). Hold Me Tight.',
    'Hayes, S. (2005). ACT couples intervention framework.',
  ],
};

// ─── DYNAMIC 6: The Anxious-Anxious Loop ─────────────────────────────────────
const anxiousAnxious: CoupleNarrativeEntry = {
  id: 'couple-anxious-anxious',
  dynamicName: 'The Anxious-Anxious Loop',
  domain: 'attachment',
  lenses: {
    therapeutic: `Two anxiously attached partners create a unique system: mutual hyperactivation with no deactivating partner to break the cycle. Sue Johnson's EFT research identifies this as an escalation pattern distinct from pursue-withdraw — both partners pursue simultaneously, creating an intensity spiral with no natural off-ramp. Where pursue-withdraw has a complementary structure (one up, one down), anxious-anxious is symmetrical escalation driven by the same underlying fear in both people.

Polyvagal theory (Porges) explains the neurobiological mechanism: both nervous systems are stuck in sympathetic activation — hypervigilant, scanning for threat, unable to settle. Neither partner can provide the ventral vagal calm that would down-regulate the other's alarm. The result is a system with no thermostat — emotional temperature rises with no cooling mechanism. DBT (Linehan) offers critical tools here: distress tolerance skills give each partner a way to self-regulate when the other cannot co-regulate. The TIPP skills (Temperature change, Intense exercise, Paced breathing, Progressive relaxation) offer immediate nervous system intervention.

IFS (Schwartz) would identify activated Firefighter parts in both partners during distress — frantic, impulsive protectors trying to put out the fire of abandonment terror. Both partners' Exiles carry the same wound: the terrified child who learned that love disappears without warning. Schema Therapy identifies the Abandonment/Instability schema in both partners, often triggering the Demanding/Reassurance-Seeking coping mode simultaneously. AEDP (Diana Fosha) offers a specific pathway: helping each partner access the "core state" beneath the anxiety — the moment where the terror is simply felt rather than defended against, and the partner witnesses that feeling without trying to fix it. Gottman's research on flooding shows that when both partners exceed 100 BPM simultaneously, the conversation must stop — not because they don't care enough, but because caring too much without regulation is neurologically indistinguishable from panic.`,

    soulful: `In Hindu mythology, the god Shiva and the goddess Shakti are sometimes depicted in a dance so intense that the universe trembles — creation and destruction indistinguishable, two cosmic forces meeting in an embrace that generates worlds and annihilates them simultaneously. Your love carries this mythic intensity. Both of you feel EVERYTHING. Both of you are tuned to the frequency of loss. Both of you reach with the urgency of someone who has known what it is to reach and find empty air.

Jung would recognize the Self archetype trying to emerge through the chaos — the integrating center that holds opposites together. But when two people are both in the grip of the Anima or Animus in its undifferentiated form — raw emotional intensity, overwhelming need, the archetypal Lover in its desperate aspect — the Self cannot consolidate. As Pema Chodron writes, "You are the sky. Everything else — it's just weather." Your shared work is to become the sky together, rather than two weather systems amplifying each other into a hurricane.

There is an old Sufi teaching that Rumi carried: "Don't go back to sleep. Don't go back to sleep. People are going back and forth across the doorsill where the two worlds touch. The door is round and open." Your anxious systems keep you both exquisitely awake, exquisitely at the doorsill. You are not asleep to love — you are almost too awake to it. bell hooks wrote, "Rarely, if ever, are any of us healed in isolation. Healing is an act of communion." You cannot heal each other's anxiety individually. But you can build a shared practice — a ritual, a container, an anchor — that holds you both when neither of you can hold the other. That anchor IS the healing. Not because it removes the fear, but because it proves the fear wrong: love stayed.`,

    practical: `THE PATTERN: {A_name} feels anxious → reaches for {B_name} → {B_name} is ALSO anxious → can't provide reassurance → {A_name}'s anxiety spikes → {B_name}'s anxiety spikes → mutual escalation → no one can be the calm one.

THIS WEEK — TWO PRACTICES:

PRACTICE 1 (Together): The Anchor Practice. Hold hands for 60 seconds in silence. No talking. No reassuring. Not even eye contact if that's too intense. Just: hands. Bodies. Present. Set a timer. The nervous systems will co-regulate through physical contact even when neither mind can provide words of comfort. BJ Fogg's anchor: "After we both notice we're spiraling, we will sit down and hold hands for 60 seconds." Do this BEFORE attempting to talk it through.

PRACTICE 2 (Individual micro-steps):
{A_name}: When anxiety hits, before texting/calling/reaching for {B_name}, do ONE self-soothing action first: hand on heart, three deep breaths, or cold water on wrists. James Clear's "2-minute rule" — the self-soothing takes less than 2 minutes. You're not replacing connection with isolation. You're arriving at connection from a slightly calmer place.
{B_name}: Same practice, different anchor. When you feel the pull to seek reassurance, write down the fear in one sentence ("I'm afraid they're pulling away") before voicing it. The act of writing engages the prefrontal cortex and slightly down-regulates the amygdala. Then share it — but now you're sharing a thought, not broadcasting a panic signal.

Stages of change: you're likely both in Action already — you WANT to change, you TRY to change. The issue is Maintenance. These practices need to become automatic, which takes 66 days on average (not 21). Be patient with backsliding. It's not failure. It's the process.`,

    developmental: `Two anxious partners often bonded over the SHARED experience of insecurity — finally, someone who understands. That bond is real and valuable. In Erikson's framework, both partners are re-navigating Trust vs. Mistrust within the context of adult Intimacy. The core developmental question: can I learn to trust that love persists even when I can't feel it in this exact moment?

Kegan's Order 3 (Socialized Mind) is the developmental center of gravity for anxious attachment: the self is embedded in the relationship, unable to distinguish between "I feel disconnected" and "the relationship is ending." The move to Order 4 (Self-Authoring) means developing the capacity to observe the anxiety without being consumed by it: "I notice my system is activating. The feeling is real. The story it's telling me ('they're leaving') may not be."

Spiral Dynamics maps this as two partners strongly anchored in Green (communitarian, feelings-centered, prioritizing connection above all) who need to integrate some healthy Orange (individual self-regulation, cognitive reframing, strategic self-management) without losing the Green warmth. Wilber's Integral model identifies the growth as primarily in the Upper-Right quadrant (behavioral/embodied skills) — both partners need somatic self-regulation tools, not more emotional processing. The couple's developmental trajectory is toward what Wilber calls "integrated autonomy-in-communion": each partner develops a solid individual container that ALLOWS deeper communion, rather than communion that dissolves individual boundaries.`,

    relational: `Buber's I-Thou encounter requires two differentiated I's meeting across genuine distance. In the anxious-anxious loop, the distance collapses — not into true meeting, but into fusion. The "We" space becomes a single undifferentiated anxiety field where neither partner can locate where their own feelings end and the other's begin. This is not intimacy. It is enmeshment wearing intimacy's mask.

Harville Hendrix's Imago theory identifies why this pairing is so magnetic: both partners' Imago (the unconscious image of the ideal partner, shaped by childhood) includes someone who FEELS as deeply as they do. The initial recognition — "finally, someone who understands" — is intoxicating. The challenge emerges when understanding is not enough: both partners need regulation, and neither can provide it. The Imago dialogue's structured format (mirroring, validation, empathy) gives this couple something essential: a FORM for the feeling, a container that prevents the emotional content from becoming a flood.

Stan Tatkin's PACT framework would identify this as a "wave-wave" pairing — two partners who are externally regulated, meaning each depends on the other for emotional equilibrium. Tatkin's prescription is specific: create "thirds" — rituals, practices, objects, phrases that exist outside either partner and serve as shared anchoring points. The relationship itself is trying to become the secure base that neither partner received in childhood. Not through one person being the anchor (that's the secure-anxious pattern) but through the BOND itself — the rituals, the agreements, the practiced returns — becoming the anchor. Gottman would add: the couple needs to build a rich "love map" (detailed knowledge of each other's inner world) so that during distress, each partner can draw on knowledge rather than assumptions: "I know this is your fear talking, because I know where this fear comes from."`,

    simple: `You're both feeling everything at maximum volume, all the time. That's exhausting. You need an anchor that isn't a person — a ritual, a hand-hold, a 60-second pause. Something that says "we're okay" when neither of you can say it.`,
  },
  coupleArc: {
    pattern: 'Both reach simultaneously. Both alarm systems fire at once. No one can be the harbor because both need one.',
    eachPartnersWound: 'Both learned that love is inconsistent — need to amplify the signal to prevent abandonment.',
    theCost: 'Reassurance-seeking creates more anxiety. The loop feeds itself. The intensity exhausts both partners.',
    theInvitation: 'Build the anchor together. A ritual that holds you both when neither can hold the other.',
  },
  couplePractice: {
    name: 'The Anchor Practice',
    description: 'Hold hands for 60 seconds in silence. No words. No reassuring. Just physical presence. The nervous systems co-regulate through contact.',
    frequency: 'Daily — especially during distress',
    bothPartners: true,
    linkedExerciseId: 'grounding-5-4-3-2-1',
  },
  coupleInvitation: 'Build an anchor that belongs to both of you. When neither can be steady, the ritual holds you.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Johnson, S. (2019). Attachment theory in practice.',
    'Schachner et al. (2012). Attachment and emotional expressivity research.',
    'Porges, S. (2011). The Polyvagal Theory.',
    'Linehan, M. (1993). DBT distress tolerance skills.',
    'Fosha, D. (2000). The Transforming Power of Affect. AEDP.',
  ],
};

// ─── DYNAMIC 7: The Avoidant-Avoidant Drift ──────────────────────────────────
const avoidantAvoidant: CoupleNarrativeEntry = {
  id: 'couple-avoidant-avoidant',
  dynamicName: 'The Avoidant-Avoidant Drift',
  domain: 'attachment',
  lenses: {
    therapeutic: `This pairing is often overlooked clinically because these couples rarely present for therapy — the relationship doesn't feel distressed, it feels distant. Research shows avoidant-avoidant pairings have lower overt conflict but also lower intimacy and satisfaction over time. The risk is not rupture but erosion — a slow drift into parallel lives that may eventually cross a threshold into genuine disconnection.

EFT (Sue Johnson) identifies both partners as having deactivated attachment systems, meaning neither one initiates the vulnerability that would deepen connection. The clinical challenge: both partners have strong Protector parts (IFS) guarding against the very thing that would heal them — emotional exposure. In IFS terms, both partners' Managers are running the show with extreme efficiency, keeping Exiles (who carry loneliness, unmet need, grief) locked securely away. The tragedy: both partners' Exiles are carrying the same wound, and if they could be witnessed by each other, both would heal. But the Managers won't allow it.

Schema Therapy identifies overlapping schemas: Emotional Deprivation ("My emotional needs will not be met by others"), Emotional Inhibition ("Expressing emotions is dangerous or weak"), and potentially Defectiveness/Shame ("If you really saw me, you'd leave"). The deactivating strategies are not the problem — they are the solution to a problem that no longer exists but that the nervous system hasn't updated. Polyvagal theory: both partners have well-developed dorsal vagal tone (capacity to be alone, self-regulate, manage internal states) but underdeveloped co-regulation pathways. The ventral vagal "social engagement system" has been underused for so long that initiating it feels foreign — like speaking a language you learned in childhood but haven't spoken in decades. AEDP's approach would be particularly effective: small doses of emotional exposure, titrated carefully, with the therapist modeling the response the partner can't yet give.`,

    soulful: `There is a Japanese concept — "mono no aware" — the bittersweet awareness of the transience of things. It carries a gentle ache, a beauty found in what is passing. Your relationship lives in this register: two people who have built something enduring and beautiful, and who may not notice it passing until it has passed. Not with a bang. With the quietest of sighs.

Jung would see in your dynamic two highly developed Persona structures — the masks so polished, so complete, that even the wearers have forgotten there are faces underneath. The Shadow of your relationship is not anger or conflict (those would at least be alive) — it is the unlived tenderness, the unspoken longing, the hand that almost reached but thought better of it. As James Hillman wrote, "We don't describe our soul so much as it describes us." Your souls are describing you right now through the very absence you feel and cannot name.

You are two ancient trees in the same forest, roots running deep, canopies magnificent, trunks standing parallel — close enough that in a strong wind, your branches might touch. But the mycelium network that connects all living things in a forest — the underground web of mutual nourishment, of chemical signals that say "I am here, I need, I offer" — has gone quiet between your root systems. Mary Oliver wrote: "Someone I loved once gave me a box full of darkness. It took me years to understand that this too, was a gift." The darkness between you is not emptiness. It is potential. It is the rich soil of everything you've never risked saying, waiting for a single seed of honesty to crack it open. John O'Donohue offered this: "The human soul is not meant to be understood. It is meant to be welcomed." Welcome each other back in. Not with grand confession — with one true sentence, spoken softly, into the space between your ancient trunks.`,

    practical: `THE DRIFT: You don't fight → you don't connect → you don't fight about not connecting → the distance normalizes → years pass → one day someone says "what happened to us?" and neither of you has an answer.

THIS WEEK — TWO MICRO-BRIDGES:

BRIDGE 1 (Together): One sentence. Each of you. Something you haven't said because it felt unnecessary or too vulnerable. Use this format if free-form feels impossible: "Something I appreciate about you that I never say is..." or "A moment I felt close to you recently was..." The sentence doesn't have to be perfect. It has to be real.

BRIDGE 2 (Individual micro-steps):
{A_name}: BJ Fogg's Tiny Habit: "After I come home and put down my bag, I will find my partner and make eye contact for 3 seconds." Not a conversation. Not a demand. Just: I see you. You exist to me. Three seconds.
{B_name}: "After we sit down for dinner, I will share one thing from my day that had an emotional charge — even a small one." Not logistics. Something that made you feel something: "I was surprisingly moved by a song today." "I felt frustrated at work in a way I couldn't shake." The content matters less than the act of SHARING internal experience.

James Clear's "habit scorecard" approach: each of you, keep a private tally this week — how many times did you share something real vs. something logistical? No judgment. Just awareness. Avoidant systems change through gentle noticing, not through forced emotional expression.

Stages of change: the biggest risk for this couple is STAYING in Precontemplation ("we're fine, we don't need to change anything"). If you're reading this, you've moved to Contemplation. Protect that movement. Don't let the avoidant system pull you back to "fine."`,

    developmental: `Two avoidant partners have often achieved strong individual differentiation — clear I-positions, low fusion, emotional self-reliance. In Kegan's terms, both may be solidly at Order 4: self-authored, internally coherent, capable of holding their own perspective without needing external validation. This is genuine developmental achievement. Many people never reach Order 4.

The developmental edge is Order 5 — Inter-Individual or Self-Transforming — where two self-authored selves risk the boundaries they've carefully built. Not to lose themselves, but to discover what exists in the space between two whole people who are willing to be affected by each other. Order 5 consciousness holds a paradox: "I am complete in myself AND I am changed by encountering you. Both are true. Neither cancels the other."

Erikson's framework maps this precisely: both partners have resolved Identity vs. Role Confusion (Stage 5) with strong individual identity. They are now facing Intimacy vs. Isolation (Stage 6) — and choosing Isolation while believing they've chosen Intimacy, because they share a life. The distinction is crucial: Intimacy in Erikson's sense requires mutual vulnerability, the willingness to lose the self's sharp edges in the blending with another. This is exactly what the avoidant system protects against.

Spiral Dynamics: both partners likely anchor in Orange (autonomy, achievement, rational self-management) with possible Yellow (systemic thinking, self-sufficiency as a value). The integration of Green (communal feeling, relational warmth, vulnerability as strength) is the growth trajectory. Wilber's Integral framework identifies the Lower-Left quadrant (shared interior, "We-space") as the underdeveloped dimension — both partners have strong Upper-Left (individual interior) but the intersubjective space between them remains thin, uninhabited, waiting to be explored.`,

    relational: `Buber wrote, "When two people relate to each other authentically and humanly, God is the electricity that surges between them." The electricity between you has dimmed — not from lack of love but from lack of current. Two self-sufficient beings, each a complete circuit, generating no charge between them because neither sends a signal across the gap.

Harville Hendrix's Imago theory explains the attraction: both of you selected a partner who wouldn't demand emotional exposure — the unconscious Imago said, "Find someone safe, someone who won't intrude, someone who understands that love means leaving each other alone." The early relationship felt like a relief: no drama, no intensity, no one dismantling your carefully constructed independence. The Imago's deeper purpose — to recreate the conditions of your original wound so you can heal it — is being thwarted by the very safety you both sought. The wound (emotional deprivation, neglect, invisibility) can only heal through visibility, and you are both hiding in plain sight.

Stan Tatkin's PACT framework identifies this as an "anchor-anchor" pairing — two people who are internally regulated and don't need external input to feel okay. Tatkin's challenge to this couple is direct: "You don't NEED each other. Can you learn to WANT each other?" The shift from need to want is the developmental leap. The relationship is trying to evolve from a functional partnership into what Tatkin calls a "couple bubble" — a two-person system where both partners CHOOSE vulnerability as an ongoing practice, not because they must, but because the alternative (comfortable distance forever) is a slow death of the bond. Gottman's "emotional bank account" metaphor applies starkly: both partners have stopped making deposits. The account isn't overdrawn — it's just... empty. One deposit. One sentence. That's how it refills.`,

    simple: `Two very capable, very independent people who forgot to actually connect. You don't need to become clingy. Just say one real thing to each other this week. Something true. Something small. That's the whole assignment.`,
  },
  coupleArc: {
    pattern: 'Both maintain independence. Neither reaches. The distance normalizes until it\'s the relationship.',
    eachPartnersWound: 'Both learned that needing others leads to disappointment or intrusion — independence became protection.',
    theCost: 'Not rupture but erosion. Parallel lives. A relationship that exists on paper and in habit, but not in contact.',
    theInvitation: 'Two whole people, willing to be affected by each other. Not losing yourself — discovering what lives between you.',
  },
  couplePractice: {
    name: 'The Bridge Sentence',
    description: 'Each partner says one real thing they\'ve been holding silently — not a complaint, just something true and small.',
    frequency: 'Once this week to start — then weekly',
    bothPartners: true,
    linkedExerciseId: 'turning-toward',
  },
  coupleInvitation: 'One sentence. From each shore. That\'s how islands become a continent.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Schachner et al. (2012). Avoidant attachment and relationship satisfaction over time.',
    'Kegan, R. (1994). In Over Our Heads. Order 4-5.',
    'Johnson, S. (2008). Hold Me Tight.',
    'Schwartz, R. (2001). Internal Family Systems Therapy.',
    'Tatkin, S. (2012). Wired for Love.',
  ],
};

// ─── DYNAMIC 8: Secure-Anxious Stabilization ─────────────────────────────────
const secureAnxious: CoupleNarrativeEntry = {
  id: 'couple-secure-anxious',
  dynamicName: 'Secure-Anxious Stabilization',
  domain: 'attachment',
  lenses: {
    therapeutic: `The secure partner provides a natural regulatory function — a biological anchor for the anxious partner's activated system. Sue Johnson's EFT research on "earned security" suggests that a consistently responsive secure partner can help the anxious partner develop new internal working models over time. This is the mechanism: repeated experience of reaching and being met rewrites the attachment system's predictions. Neuroscience confirms this — the anxious partner's amygdala response to perceived threat gradually attenuates when the partner's response is consistently warm and available.

Polyvagal theory (Porges) maps the mechanism precisely: the secure partner's ventral vagal tone — their calm, present, socially engaged nervous system — acts as a neuroception signal for the anxious partner: "You are safe here." Over time, the anxious partner's nervous system begins to internalize this signal, developing its own ventral vagal capacity through repeated co-regulation. This is literally how earned security forms in the brain.

The clinical consideration is compassion fatigue. IFS (Schwartz) identifies the risk: the secure partner's Self-led presence is a genuine resource, but if the anxious partner's Firefighter parts (reassurance-seeking, checking, testing) activate too frequently, the secure partner's own Protector parts eventually take over — manifesting as withdrawal, irritation, or emotional flatness. This can mimic avoidant attachment, confusing both partners. Schema Therapy notes the secure partner may develop a Self-Sacrifice schema ("I must always be available") that erodes their own wellbeing. DBT's concept of "limits" applies: effective compassion requires boundaries. AEDP (Fosha) offers a frame for the secure partner: your steady presence is not just "being nice" — it is a transformational resource. AND you are allowed to need things. Your needs don't threaten the system; they humanize it. Gottman's research shows that even in secure-anxious pairings, the 5:1 positive-to-negative ratio must be maintained — and the anxious partner's reassurance-seeking counts as a bid for connection, not a burden, if received with warmth.`,

    soulful: `There is an old Celtic myth of the Selkie — a seal who sheds their skin to walk on land with a human lover. The Selkie brings the wildness of the deep, the tidal pull of emotion, the ancient knowing of the sea. The human partner brings the hearth, the shore, the steady ground where the Selkie can rest between dives into the depths. Neither is diminished by the other. Both are enlarged.

{A_name}, you are the shore — steady, present, warm. You hold space the way the earth holds roots: without fanfare, without asking for credit, simply by being solid enough for another life to grip. {B_name}, you are the tide — feeling everything, pulled by moons you cannot see, bringing treasures and storms from depths the shore will never visit alone. As Khalil Gibran wrote in The Prophet: "Let there be spaces in your togetherness, and let the winds of the heavens dance between you. Love one another, but make not a bond of love: let it rather be a moving sea between the shores of your souls."

But here is the deeper teaching, drawn from the well of Jungian understanding: the Healer archetype that {A_name} carries has a Shadow — the Martyr, the one who gives until giving becomes self-erasure. And the Seeker archetype that {B_name} carries has a Shadow — the Dependent, the one who seeks until seeking replaces finding. Clarissa Pinkola Estes writes, "If you have ever been called defiant, incorrigible, forward, cunning, insurgent, unruly, rebellious, you're on the right track." {B_name}, your intensity is not a deficiency — it is an insurgency of the heart against the lie that love is conditional. {A_name}, your steadiness is not a duty — it is a gift. But gifts given endlessly without receiving become debts. As John O'Donohue wrote, "In the shelter of each other, the people live." Both of you deserve shelter. Not just one.`,

    practical: `THE POSITIVE CYCLE: {B_name} feels anxious → reaches for {A_name} → {A_name} responds with presence → {B_name}'s system settles → connection deepens. This works. Protect it.

THE EDGE: When {B_name}'s anxiety exceeds {A_name}'s bandwidth — when the reaching becomes relentless, when reassurance doesn't land, when the seeking feels bottomless — {A_name} starts to withdraw. Not from avoidance, but from exhaustion. And {B_name} reads the exhaustion as abandonment, which spikes the anxiety further.

THIS WEEK — TWO MICRO-STEPS, ONE FOR EACH:

{B_name} (the anxious partner): BJ Fogg's Tiny Habit — "After I feel the urge to seek reassurance, I will put my hand on my heart and take three breaths BEFORE reaching for {A_name}." This is not replacing connection with isolation. It's arriving at connection from one notch calmer. You're building an internal resource alongside the external one. James Clear's identity reframe: "I am someone who can hold myself for 60 seconds." That's the new identity. Sixty seconds.

{A_name} (the secure partner): Your micro-step — "After I notice I'm approaching my limit, I will say: 'I love you and I'm getting stretched. Can we reconnect in an hour?'" The key: NAME the limit before you hit it. If you wait until you're depleted, the naming comes out as irritation, which {B_name}'s system reads as rejection. Honest early is kinder than patient-until-snapping. BJ Fogg's anchor: "After I notice tightness in my chest or a desire to be alone, I will name it out loud within 5 minutes."

Stages of change: {B_name} is likely in Action (actively trying to manage anxiety). {A_name} may be in Precontemplation about their OWN needs ("I'm fine, I'm the stable one"). Both need movement.`,

    developmental: `This pairing has natural developmental momentum. {B_name} is learning — through lived experience, not theory — that reaching can be met. That is an earned-security trajectory, one of the most powerful developmental shifts in adult attachment. In Erikson's framework, {B_name} is reworking Trust vs. Mistrust in adulthood, with {A_name} providing the "good enough" responsiveness that Winnicott described.

Kegan's framework maps {B_name}'s growth trajectory from Order 3 (embedded in the relationship's emotional weather, unable to observe it) toward Order 4 (able to have feelings about the relationship without being consumed by them). The critical support: {A_name}'s consistent presence provides the holding environment that makes Order 3-to-4 growth possible — you can't develop a self-observing capacity while your survival system is in alarm.

The developmental invitation for {A_name} is different and equally important: don't just be the steady one. The move from Order 4 to Order 5 requires letting {B_name} see YOUR vulnerability. A relationship where only one person is emotionally exposed is not intimacy — it's caregiving. Erikson's Generativity stage asks: are you generating growth in both directions, or only providing it? Wilber's Integral model identifies {A_name}'s growth edge in the Lower-Left quadrant (shared vulnerability, mutual interior access) — the capacity to be affected, to need, to not-know, to be held.

Spiral Dynamics: {A_name} may anchor in Orange (competent, self-sufficient, rational) with strong Green integration. {B_name} may be heavily Green (emotionally attuned, connection-oriented) with developing Orange. The couple's trajectory is toward Second Tier, where both partners can fluidly access both autonomy and communion without one threatening the other.`,

    relational: `Buber's I-Thou encounter requires genuine risk from both parties. In this pairing, {B_name} risks constantly — every bid for reassurance is a small act of courage, even when it doesn't look like it. {A_name}'s risk is different and often invisible: the risk of being truly seen as limited, tired, needy. The relationship achieves I-Thou most fully in the moments when {A_name} drops the anchor role and says, "I don't know how to help right now. I'm struggling too." That moment of shared humanity — two imperfect beings meeting in their imperfection — is where the deepest bonding occurs.

Harville Hendrix's Imago theory explains the selection: {B_name}'s Imago sought someone who embodies the steady, available parent they needed but didn't consistently receive. {A_name}'s Imago sought someone who brings emotional depth, intensity, and the invitation to feel more deeply than their secure system naturally accesses. Both got what they sought. The Imago's deeper purpose: {B_name} heals the wound of inconsistent caregiving by internalizing {A_name}'s consistency. {A_name} heals the wound of emotional flatness (the hidden cost of security) by learning from {B_name}'s emotional depth.

Stan Tatkin's PACT framework identifies this as an "anchor-wave" pairing — the most common configuration and, when both partners understand the structure, one of the most growth-producing. Tatkin's specific guidance: the anchor must learn to be a wave sometimes (showing need, expressing vulnerability, initiating emotional contact). The wave must learn to be an anchor sometimes (self-soothing, providing reassurance, being the steady one). The relationship is trying to become a place where both partners can occupy BOTH roles — where the roles are fluid rather than fixed, and neither person is trapped in their position.`,

    simple: `One of you is the calm one. The other feels everything at full blast. It works — until the calm one gets tired. So: the feeler learns to self-soothe for 60 seconds before reaching. The calm one learns to say "I need a break" before they hit empty. Both stay human.`,
  },
  coupleArc: {
    pattern: 'The anxious partner reaches. The secure partner steadies. The system works — until the secure partner exhausts.',
    eachPartnersWound: 'The anxious partner learned: reach urgently or be left. The secure partner learned: being steady is how you keep love safe.',
    theCost: 'The secure partner becomes a caregiver rather than a partner. The anxious partner\'s internal regulation doesn\'t develop — the external resource does all the work.',
    theInvitation: 'The wave builds an internal anchor. The anchor shows their own depth. Both become more whole.',
  },
  couplePractice: {
    name: 'Self-Soothe First',
    description: 'The anxious partner practices one moment of self-soothing before reaching. The secure partner names their limits honestly.',
    frequency: 'Daily during distress',
    bothPartners: false,
    partnerATask: 'Name when you\'re approaching your limit. "I love you and I\'m getting stretched. Can we reconnect in an hour?" Honesty protects the system.',
    partnerBTask: 'Hand on heart, three breaths, then ask for what you need. Build the internal alongside the external.',
    linkedExerciseId: 'couple-bubble',
  },
  coupleInvitation: 'The anchor is allowed to need things too. The wave is allowed to be steady sometimes. Meet in the middle.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Johnson, S. (2019). Earned security in EFT.',
    'Schachner et al. (2012). Attachment style interaction effects.',
    'Porges, S. (2011). The Polyvagal Theory.',
    'Fosha, D. (2000). AEDP and transformational affect.',
    'Tatkin, S. (2012). Wired for Love.',
  ],
};

// ─── DYNAMIC 9: The Secure-Avoidant Thaw ─────────────────────────────────────
const secureAvoidant: CoupleNarrativeEntry = {
  id: 'couple-secure-avoidant',
  dynamicName: 'The Secure-Avoidant Thaw',
  domain: 'attachment',
  lenses: {
    therapeutic: `The secure partner provides what the avoidant partner's system needs but doesn't trust: consistent, non-demanding presence. Research on earned security shows that avoidant attachment can shift over time in relationships where the partner is reliably available without being intrusive. The clinical distinction is crucial: the secure partner's challenge is patience without pursuit. The moment warmth becomes demand, the avoidant system reads it as intrusion and the thaw reverses.

Polyvagal theory (Porges) maps this beautifully: the avoidant partner's neuroception — their unconscious threat-detection system — is calibrated to read emotional closeness as danger. The secure partner's ventral vagal state (warm, calm, socially engaged) sends a different signal than what the avoidant system expects. Over time, with repeated non-threatening exposure, the avoidant partner's neuroception recalibrates: "This closeness is not the kind that overwhelmed me before. This is safe." The process is slow because neuroception updates operate below conscious awareness — you can't think your way to feeling safe. You have to EXPERIENCE safety, repeatedly, until the body believes what the mind already knows.

IFS (Schwartz) identifies the avoidant partner's primary Protectors: managers who maintain distance, independence, and emotional self-sufficiency. These parts developed for excellent reasons — they protected the system from intrusion, engulfment, or the pain of needs that were never met. The therapeutic approach is not to dismantle these Protectors but to help them trust that the system is now in a different environment. The secure partner is part of that new environment. Schema Therapy identifies the avoidant partner's likely schemas: Emotional Deprivation, Emotional Inhibition, and possibly Defectiveness/Shame ("If you really knew me, you'd be disappointed"). EFT's Stage 2 work — accessing and sharing primary emotions — is the path, but it must be titrated carefully. ACT (Hayes) contributes the concept of "willingness" — the avoidant partner doesn't need to WANT vulnerability; they need to be WILLING to experience it, even while their system protests, because it serves their deeper values (connection, intimacy, not living alone inside themselves).

AEDP (Fosha) offers perhaps the most precise clinical frame: the avoidant partner needs "undoing aloneness" — the transformational experience of having a vulnerable moment witnessed with delight rather than judgment, producing what Fosha calls "transformance" — the innate drive toward healing that the avoidant system has been suppressing. Gottman's "turning toward" research shows that avoidant partners make fewer bids for connection but respond to their partner's bids at a lower rate — not from malice but from a nervous system that doesn't register bids as invitations. The secure partner's patience in making bids that don't demand immediate reciprocity is the mechanism of change.`,

    soulful: `In fairy tales, there is always a frozen kingdom. A spell has been cast. The rivers don't move. The trees hold their leaves in suspended animation. The people stand in mid-gesture, waiting without knowing they're waiting. And then someone arrives — not with fire (fire would destroy the frozen things) but with warmth. Patient, steady, undemanding warmth. The kind that thaws from the outside in, slowly, so nothing cracks.

{A_name}, you are the warmth-bringer. Not the Hero who storms the castle — the Wise One who sits at the gate, year after year, simply present. Jung would recognize in you the archetype of the Self — the integrating center that holds space for the Shadow to emerge safely. Your gift is not action but BEING — the quality of your presence that says, without words, "I am here. I will not overwhelm you. I will not leave. Take your time."

{B_name}, you are the frozen kingdom. But "frozen" is not dead — it is alive in suspension, waiting for conditions safe enough to resume. Under the ice, the river still moves. Under the stillness, your heart still aches toward connection. As Rilke wrote, "Perhaps everything terrible is in its deepest being something helpless that wants help from us." Your avoidance is not rejection. It is the most elegant protection a young nervous system could design against a world where closeness meant danger. It is something helpless that wants help — and cannot yet ask.

The ecology of your relationship is the ecology of permafrost and spring. The thaw is not sudden. It happens in layers — first the surface warms, then moisture appears, then a green shoot. Some seasons the frost returns. That is not failure; that is the rhythm of geological change. Wendell Berry wrote, "The world is not to be put in order. The world is order. It is for us to put ourselves in unison with this order." The order of your bond is the order of seasons: patient, cyclical, trustworthy. Pema Chodron offers this: "Nothing ever goes away until it has taught us what we need to know." The avoidance is not going away — it is teaching both of you about the precise quality of warmth that melts without destroying.`,

    practical: `THE POSITIVE CYCLE: {A_name} offers warmth → {B_name} receives it cautiously → if {A_name} doesn't escalate → {B_name} opens slightly more → trust builds incrementally → closeness increases at {B_name}'s pace.

THE RISK: If {A_name} gets impatient and pushes → {B_name}'s system reads it as intrusion → withdrawal intensifies → {A_name} pushes more → now it's pursue-withdraw. The patience IS the intervention. Losing it undoes months of progress.

THIS WEEK — TWO MICRO-STEPS:

{A_name} (the secure partner): BJ Fogg's Tiny Habit — "After I feel the urge to push for more closeness, I will offer ONE small gesture and then step back." A touch on the shoulder. A brief "I'm glad you're here." A cup of tea made without being asked. Then SPACE. No follow-up question. No "did you notice I did that?" Let the gesture land on its own timeline. James Clear's environment design: remove cues that trigger pushing (e.g., don't initiate deep conversations at bedtime when {B_name} is most guarded — try morning, in passing, low-stakes).

{B_name} (the avoidant partner): Your micro-step is internal, not behavioral — and that's okay. "After I notice a moment of warmth from {A_name}, I will let it register for 3 seconds before my system deflects it." You don't have to respond. You don't have to reciprocate. Just NOTICE. The warmth arrived. It didn't destroy you. Three seconds of noticing. That's the whole habit. Over time, 3 seconds becomes 5, then 10, then eventually you find yourself reaching back — not because you should, but because the reaching has become safe.

Stages of change: {A_name} is in Maintenance (already offering warmth consistently). {B_name} is likely in Contemplation or early Preparation. Honor where each of you is. The worst thing this couple can do is set a timeline for the thaw.`,

    developmental: `The secure-avoidant pairing has a particular developmental potential: the avoidant partner can develop earned security through the experience of non-intrusive warmth. This is not therapy. This is the RELATIONSHIP itself being therapeutic — what Alexander called a "corrective emotional experience" and what Kegan would call a developmental holding environment.

In Kegan's terms, the avoidant partner may operate from Order 4 (Self-Authoring) — fiercely independent, internally coherent, capable of managing their own emotional life. The developmental edge is not LESS independence but MORE permeability: Order 5 (Self-Transforming), where the self-authored self discovers it can be genuinely affected by another person without dissolving. "I can let you in without losing me." That is the Order 5 insight, and it is available to the avoidant partner specifically because they have already built the strong self that Order 5 requires.

The secure partner's growth edge is equally important. Erikson's Generativity vs. Stagnation stage asks: are you generating growth or performing caretaking? The distinction matters. Generativity requires that the secure partner also RECEIVE — that the relationship be bidirectional, not a one-way flow of warmth toward a thawing object. The secure partner needs to discover what the avoidant partner uniquely offers: depth of inner life, capacity for solitude, freedom from emotional reactivity, a groundedness that the secure partner's agreeableness sometimes lacks.

Spiral Dynamics: the avoidant partner likely anchors in Orange (autonomy, achievement, rational self-management). The secure partner may integrate Orange and Green naturally. The couple's growth trajectory requires the avoidant partner to integrate Green (feeling, connection, vulnerability) — not replacing Orange but enriching it. Wilber's Integral model: the avoidant partner's growth is primarily in the Lower-Left quadrant (intersubjective, shared interiority) — learning that "we-space" is not threatening but generative.`,

    relational: `Buber wrote, "The world is not comprehensible, but it is embraceable: through the embracing of one of its beings." The avoidant partner's life philosophy has been comprehension — understanding the world from a safe distance, managing it through competence and self-reliance. The invitation of this relationship is to move from comprehension to embrace — and an embrace requires vulnerability, the willingness to hold without controlling.

Harville Hendrix's Imago theory reveals the hidden symmetry: {A_name}'s Imago sought someone with emotional depth that exists below the surface — the unavailability is actually an indicator of an interior life so rich that it cannot be easily accessed. {B_name}'s Imago sought someone who embodies the warmth they secretly crave but have learned to live without — the secure partner IS the childhood need that was never met, walking toward them with open arms.

Stan Tatkin's PACT framework identifies this as an "anchor-island" pairing and prescribes specific relational practices: the anchor must make bids without requiring immediate reciprocity. The island must practice "approach behaviors" — small, voluntary moves toward the partner that don't depend on the partner's initiation. Tatkin's key insight: the island doesn't need to become a wave (emotionally expressive, externally regulated). They need to become a CONNECTED island — one whose bridge to the mainland is used regularly, even if the island remains the primary residence.

The relationship itself is trying to become what Donald Winnicott called a "transitional space" — a place between two people that is neither fully one person's territory nor the other's, but a shared field where new things can be created, played with, risked. For the avoidant partner, this space has been the most dangerous territory in the world. For the secure partner, it's the most natural. The bond is trying to teach both of them that the space between is where love lives — not in either person alone, but in the reaching between.`,

    simple: `One of you is warm and patient. The other is slowly, cautiously opening up. Don't rush it. Don't push. Warmth offered without pressure — that's the whole recipe. The thaw is real, even when you can't see it yet.`,
  },
  coupleArc: {
    pattern: 'The secure partner offers steady warmth. The avoidant partner receives it cautiously. Trust builds at the avoidant partner\'s pace.',
    eachPartnersWound: 'The secure partner learned to trust consistently. The avoidant partner learned: closeness leads to overwhelm or loss of self.',
    theCost: 'If the secure partner loses patience and pushes, the thaw reverses. The avoidant partner needs non-demanding presence to open.',
    theInvitation: 'Warmth without pressure. Patience without passivity. The thaw is geological but real.',
  },
  couplePractice: {
    name: 'Offer and Space',
    description: 'The warm partner offers closeness without demanding reciprocity, then gives space. The thawing partner notices one moment of warmth and lets it register without pulling away.',
    frequency: 'Daily this week',
    bothPartners: false,
    partnerATask: 'Offer closeness (a touch, a word), then give space. Let them come to you in their timing.',
    partnerBTask: 'Notice one moment of warmth this week and don\'t pull away. Just let it register. That\'s enough.',
    linkedExerciseId: 'bonding-through-vulnerability',
  },
  coupleInvitation: 'The warmth doesn\'t push. The thaw doesn\'t rush. Trust the pace of the geological.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Johnson, S. (2019). Corrective emotional experience in EFT.',
    'Schachner et al. (2012). Earned security trajectories.',
    'Porges, S. (2011). The Polyvagal Theory. Neuroception.',
    'Fosha, D. (2000). AEDP: Undoing aloneness.',
    'Tatkin, S. (2012). Wired for Love. Anchor-island dynamics.',
    'Hayes, S. (2005). ACT willingness framework.',
  ],
};

// ─── DYNAMIC 10: The Values Collision ────────────────────────────────────────
const valuesCollision: CoupleNarrativeEntry = {
  id: 'couple-values-collision',
  dynamicName: 'The Values Collision',
  domain: 'values',
  lenses: {
    therapeutic: `ACT research on psychological flexibility in couples (meta-analytic effect g = -1.23 for marital satisfaction) directly addresses values conflicts. Steven Hayes's core insight: values are not beliefs to be debated — they are directions to be lived. When partners hold genuinely different core values, the therapeutic goal is not alignment but UNDERSTANDING, and not just understanding but what ACT calls "perspective-taking in the service of compassion." Each partner must comprehend WHY the other values what they value, and where flexibility exists versus where it doesn't.

CBT (Aaron Beck) identifies the cognitive distortions that escalate values conflicts: mind-reading ("they don't care about what I care about"), overgeneralization ("we're incompatible"), and black-and-white thinking ("either we agree on this or we can't be together"). The cognitive restructuring work: "My partner values something different" is not the same as "my partner is wrong" or "my partner doesn't value ME." Schema Therapy identifies how values conflicts activate core schemas — Mistrust/Abuse ("they're trying to control me"), Subjugation ("I always have to give in to their priorities"), or Unrelenting Standards ("there's a right way to live, and my partner is doing it wrong").

EFT (Johnson) adds the attachment dimension: when a partner dismisses or overrides your values, it doesn't just feel like a disagreement — it feels like not being seen, which triggers the attachment system's alarm. "You don't care about what matters to me" is, at the attachment level, "You don't see me. I don't exist to you." IFS (Schwartz) would explore which PARTS hold each value most tightly — often a Protector part that links the value to survival. When {A_name} says "honesty is non-negotiable," there may be an Exile underneath who was devastated by deception. When {B_name} says "freedom is everything," there may be an Exile who was suffocated by control.

Gottman's research on "perpetual problems" is essential here: 69% of all couple conflicts are perpetual — they never resolve because they are rooted in fundamental personality or value differences. The goal is not resolution but DIALOGUE — an ongoing conversation that maintains warmth and curiosity despite the difference. DBT's dialectical framework (Linehan) offers the synthesis: "I can fully hold my own values AND fully respect that your different values are equally valid." This is not compromise. It is dialectical integration — holding two truths simultaneously.`,

    soulful: `There is a creation myth from the Navajo tradition in which First Man and First Woman come from different worlds — he from the eastern mountains, she from the western sea. They speak different languages of meaning. They organize the stars differently. They disagree about which direction is sacred. And yet they build the world TOGETHER, placing their different stars in the same sky, because a sky organized by one perspective alone would be half-dark.

Jung wrote, "The shoe that fits one person pinches another; there is no recipe for living that suits all cases." Your values are your shoes — shaped by every road you've walked, every stone that bruised you, every path that led you home. When your partner's shoes don't match yours, it is not because they chose poorly. It is because they walked a different road, and that road was real.

The Jungian archetype alive in this dynamic is the Coniunctio — the sacred marriage of opposites that produces the philosophical gold. Alchemy understood that gold does not come from mixing similar things. It comes from the collision of opposites — sulfur and mercury, fire and water, your truth and theirs — held in a vessel strong enough to contain the reaction. As Rilke counseled, "I hold this to be the highest task of a bond between two people: that each should stand guard over the solitude of the other." Guarding each other's solitude means guarding each other's values — not adopting them, not dismantling them, but protecting each other's right to be shaped by a different road.

bell hooks wrote in All About Love: "Rarely, if ever, are any of us healed in isolation. Healing is an act of communion." The communion you are being asked to build is not communion of sameness but communion of difference — two compasses pointing different directions, held by two hands walking the same path. David Whyte understood: "The conversational nature of reality means that everything is waiting to be spoken to, and everything is waiting to speak to us." Your partner's values are speaking to you. Not demanding agreement. Asking to be heard.`,

    practical: `YOUR OVERLAP: {shared_values_count} of your top 5 values align.
YOUR FRICTION POINTS: {divergent_domains}

THIS WEEK — THREE CONCRETE STEPS:

STEP 1 (The Values Story — 30 minutes together): Sit down. Each partner names their top 3 values and tells the STORY behind each one. Not "I value honesty" but "I value honesty because growing up in my family, the things that weren't said did the most damage. Honesty isn't a principle for me — it's a survival need." When you hear the STORY, the value stops being an abstract principle and becomes a person's attempt to heal something. You don't have to share the value. You do have to respect the wound it comes from.

STEP 2 (Individual micro-steps):
{A_name}: BJ Fogg's Tiny Habit — "After {B_name} acts from a value I don't share, I will say to myself: 'That's their road speaking.' " This internal reframe takes 2 seconds and prevents the automatic "they're wrong/they don't care about me" cascade. James Clear's cue-routine-reward: Cue = partner does something from their values. Routine = internal reframe. Reward = reduced conflict, increased curiosity.

{B_name}: Same structure, different anchor — "After {A_name} insists on something that doesn't matter to me, I will ask: 'Tell me why this matters to you.' " Not as a debate tactic. As genuine curiosity. The question itself is the practice.

STEP 3 (Shared architecture): Identify ONE domain where your values overlap this week and make a decision together from that shared ground. Build from overlap outward, not from friction inward. This creates positive momentum for tackling the harder terrain later.

Stages of change: values conflicts often feel like they're in Maintenance of the problem (entrenched, permanent). The Values Story exercise moves both partners into Contemplation of the OTHER's experience — which is the actual first step toward change.`,

    developmental: `Values differences between partners become most acute at Kegan's Order 4 (Self-Authoring), where each person has built their own value system and holds it with conviction. At Order 4, "I know what I believe and I stand by it" is the pinnacle of development. The collision between two Order 4 systems — each internally coherent, each convinced of its own rightness — produces the friction that is both the problem and the invitation.

The Order 5 (Self-Transforming) move is not abandoning your values — it's recognizing that your value system is ONE way of organizing the good life, and your partner's is ANOTHER, and neither is complete alone. Not relativism (where nothing matters). Something harder: holding your conviction AND its limits simultaneously. "I believe deeply in X, AND I can see that my belief in X is shaped by my particular history, and my partner's belief in Y is shaped by theirs, and both are genuine attempts to live well."

Spiral Dynamics provides a particularly useful map here. Values collisions often occur between different value memes: Blue (tradition, duty, order) vs. Orange (achievement, autonomy, progress); Orange vs. Green (community, equality, feeling); or even Green vs. Yellow (systemic thinking, integration, paradox). The collision is not personal — it is developmental. Each value meme is a legitimate stage of human development, and each partner may anchor at a different stage in different life domains.

Wilber's Integral framework offers the most complete resolution: both partners develop the capacity to TAKE the perspective of the other's value system without abandoning their own — what Wilber calls "transcend and include." Erikson's Generativity stage applies: can you be generative toward a value system different from your own? Can you help your partner LIVE their values, even when those values aren't yours? That is love at its most mature.`,

    relational: `Buber's I-Thou encounter is tested most severely when the "Thou" holds values fundamentally different from the "I." It is easy to see the divine in someone who mirrors your beliefs. The deeper I-Thou encounter is seeing the divine in someone who organizes meaning differently — whose sacred is not your sacred, whose north is not your north. That encounter is the forge of genuine love.

Harville Hendrix's Imago theory reveals the paradox: you likely chose each other BECAUSE of the difference, not despite it. The unconscious Imago includes the qualities you need to develop — and your partner's different values represent exactly the growth your psyche is seeking. The partner who values spontaneity married the partner who values security because BOTH qualities are needed for a full life, and neither partner carries both alone. The collision is the curriculum.

Stan Tatkin's PACT approach would focus on the couple's "shared principles of governance" — the meta-values that transcend individual values. Do you both value fairness? Do you both value each other's wellbeing? Do you both believe the relationship should serve both partners' flourishing? These meta-values provide the constitutional framework within which individual value differences can be negotiated. Without them, every disagreement becomes a sovereignty dispute.

The relationship itself is trying to become what the philosopher Hegel called "synthesis" — not the triumph of one value over another (thesis defeating antithesis) but the emergence of a third thing that holds both without erasing either. This is the most creative act a relationship can perform: building a shared life that is NOT a compromise between two positions but an ARCHITECTURE that makes room for both. As Gibran wrote, "Your children are not your children... You may house their bodies but not their souls, for their souls dwell in the house of tomorrow." Your values are not your partner's values. You may house them together but not force them to merge. The house you build must have rooms for each and a shared hearth between.`,

    simple: `You see the world differently. That's not a bug — it's a feature. This week, ask each other: "Why does this matter to you? What's the story behind it?" Understanding doesn't require agreeing. It just requires listening.`,
  },
  coupleArc: {
    pattern: 'Two different value systems producing friction in decisions, priorities, and how life should be lived.',
    eachPartnersWound: 'Each partner carries a history that made their particular values feel essential to survival or flourishing.',
    theCost: 'Decisions become battles. Each partner feels unseen or opposed. The friction wears on both.',
    theInvitation: 'Architecture, not compromise. Build a shared life with room for two different ways of being.',
  },
  couplePractice: {
    name: 'The Values Story',
    description: 'Each partner shares the story behind their top 3 values — not the value itself, but why it matters. Where did it come from? What was it trying to heal or protect?',
    frequency: 'Once this week — set aside 30 minutes',
    bothPartners: true,
    linkedExerciseId: 'relationship-values-compass',
  },
  coupleInvitation: 'You don\'t have to share the value. You have to respect the wound it comes from.',
  evidenceLevel: 'moderate',
  keyCitations: [
    'Hayes et al. (2006). ACT and marital satisfaction meta-analysis.',
    'Kegan, R. (1994). In Over Our Heads. Order 4-5.',
    'Doss et al. (2012). ACT for incompatible couples.',
    'Gottman, J. (1999). Perpetual problems research (69%).',
    'Linehan, M. (1993). Dialectical thinking framework.',
    'Schwartz, R. (2001). IFS parts and values.',
  ],
};

// ─── ALL DYNAMICS ─────────────────────────────────────────────────────────────

export const ALL_COUPLE_DYNAMICS: CoupleNarrativeEntry[] = [
  pursueWithdraw,
  mutualWithdrawal,
  escalationEscalation,
  leaderAccommodator,
  naturalNegotiators,
  anxiousAnxious,
  avoidantAvoidant,
  secureAnxious,
  secureAvoidant,
  valuesCollision,
];

// ─── ROUTER ──────────────────────────────────────────────────────────────────

/** Result from couple dynamic routers — includes swap flag and extra interpolation vars */
export interface CoupleRouteResult {
  entry: CoupleNarrativeEntry;
  /** When true, A_name and B_name should be swapped at render time */
  swap: boolean;
  /** Extra template variables for interpolation (e.g. {shared_values_count}) */
  extras?: Record<string, string>;
}

/** Route attachment domain to the appropriate couple dynamic */
export function routeAttachmentDynamic(
  aScores: PartnerScores,
  bScores: PartnerScores
): CoupleRouteResult | null {
  const aAnxiety = aScores.ecrr?.anxietyScore ?? 3.5;
  const bAnxiety = bScores.ecrr?.anxietyScore ?? 3.5;
  const aAvoidance = aScores.ecrr?.avoidanceScore ?? 3.5;
  const bAvoidance = bScores.ecrr?.avoidanceScore ?? 3.5;

  const aAnxious = aAnxiety > 4.0;
  const bAnxious = bAnxiety > 4.0;
  const aAvoidant = aAvoidance > 4.0;
  const bAvoidant = bAvoidance > 4.0;
  const aSecure = !aAnxious && !aAvoidant;
  const bSecure = !bAnxious && !bAvoidant;

  if ((aAnxious && bAvoidant) || (aAvoidant && bAnxious)) return { entry: pursueWithdraw, swap: false };
  if (aAnxious && bAnxious) return { entry: anxiousAnxious, swap: false };
  if (aAvoidant && bAvoidant) return { entry: avoidantAvoidant, swap: false };
  if (aSecure && bAnxious) return { entry: secureAnxious, swap: false };
  if (aSecure && bAvoidant) return { entry: secureAvoidant, swap: false };
  // Partner A is insecure, B is secure — swap so narratives read correctly
  if (aAnxious && bSecure) return { entry: secureAnxious, swap: true };
  if (aAvoidant && bSecure) return { entry: secureAvoidant, swap: true };
  return null;
}

/** Route conflict domain to the appropriate couple dynamic */
export function routeConflictDynamic(
  aScores: PartnerScores,
  bScores: PartnerScores
): CoupleRouteResult | null {
  const aSub = aScores.dutch?.subscaleScores ?? {};
  const bSub = bScores.dutch?.subscaleScores ?? {};
  const aForcing = aSub.forcing?.mean ?? 2.5;
  const bForcing = bSub.forcing?.mean ?? 2.5;
  const aAvoiding = aSub.avoiding?.mean ?? 2.5;
  const bAvoiding = bSub.avoiding?.mean ?? 2.5;
  const aYielding = aSub.yielding?.mean ?? 2.5;
  const bYielding = bSub.yielding?.mean ?? 2.5;
  const aProblemSolving = aSub.problemSolving?.mean ?? 2.5;
  const bProblemSolving = bSub.problemSolving?.mean ?? 2.5;
  const aCompromising = aSub.compromising?.mean ?? 2.5;
  const bCompromising = bSub.compromising?.mean ?? 2.5;

  if (aForcing > 3.5 && bForcing > 3.5) return { entry: escalationEscalation, swap: false };
  if (aAvoiding > 3.5 && bAvoiding > 3.5) return { entry: mutualWithdrawal, swap: false };
  if (aProblemSolving > 3.5 && bYielding > 3.5) return { entry: leaderAccommodator, swap: false };
  if (bProblemSolving > 3.5 && aYielding > 3.5) return { entry: leaderAccommodator, swap: true };
  if ((aCompromising > 3.5 && bCompromising > 3.5) || (aProblemSolving > 3.5 && bProblemSolving > 3.5)) return { entry: naturalNegotiators, swap: false };
  return null;
}

/** Route values domain to the appropriate couple dynamic */
export function routeValuesDynamic(
  aScores: PartnerScores,
  bScores: PartnerScores
): CoupleRouteResult | null {
  const aTop5 = aScores.values?.top5Values ?? [];
  const bTop5 = bScores.values?.top5Values ?? [];
  const sharedCount = aTop5.filter(v => bTop5.includes(v)).length;

  // Check for divergent domain scores
  const aDomains = aScores.values?.domainScores ?? {};
  const bDomains = bScores.values?.domainScores ?? {};
  const divergentDomains = Object.keys(aDomains).filter(domain => {
    const aGap = aDomains[domain]?.gap ?? 0;
    const bGap = bDomains[domain]?.gap ?? 0;
    return Math.abs(aGap - bGap) > 2.0;
  });

  if (sharedCount < 2 && divergentDomains.length >= 2) {
    return {
      entry: valuesCollision,
      swap: false,
      extras: {
        shared_values_count: String(sharedCount),
        divergent_domains: divergentDomains.join(', ') || 'none identified',
      },
    };
  }
  return null;
}
