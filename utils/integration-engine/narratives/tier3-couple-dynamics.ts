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
    therapeutic: `This is the most researched couple pattern in the clinical literature. EFT identifies the pursue-withdraw cycle as the primary target of intervention — not because either partner is doing something wrong, but because the CYCLE itself has become the problem. The pursuer's anxiety reads distance as danger and responds with escalation. The withdrawer's avoidance reads intensity as danger and responds with retreat. Each partner's protective strategy triggers the other's wound. EFT's change process involves helping the pursuer access the vulnerability underneath the pursuit ("I'm scared I'm losing you") and the withdrawer access the overwhelm underneath the withdrawal ("I shut down because the intensity floods me, not because I don't care"). Research with 539 couples confirms attachment explains the largest variance in relationship instability — and this cycle IS the attachment system in action between two people.`,
    soulful: `One of you reaches. The other pulls away. And the reaching gets louder because the pulling-away feels like disappearing. And the pulling-away gets further because the reaching feels like drowning. This is not a fight. It is two nervous systems speaking different dialects of the same fear: please don't leave me. {A_name} says it by moving toward. {B_name} says it by needing space to feel safe enough to stay. Neither of you can hear the other's love through the static of your own alarm system. The pursuing is not neediness — it is love in the only language your attachment system knows. The withdrawing is not rejection — it is the only way your system knows to protect the connection from your own overwhelm. You are both trying to save the relationship. You are both using the strategy that makes the other one feel it's ending. The invitation: learn each other's dialect. When {A_name} reaches, that is fear wearing urgency's clothing. When {B_name} retreats, that is care wearing silence's mask. Name the fear. Name the care. The cycle will slow.`,
    practical: `THE CYCLE: {A_name} senses distance → pursues harder (criticism, questions, intensity) → {B_name} feels flooded → withdraws (silence, physical exit, emotional shutdown) → {A_name} reads withdrawal as confirmation of abandonment → pursues harder → repeat.\n\nTHIS WEEK — TWO PRACTICES, ONE FOR EACH:\n\n{A_name} (the pursuer): When you feel the urge to press, pause and translate the urgency into vulnerability: "I'm feeling disconnected and it scares me. Can we find a time to reconnect?" Then WAIT. Do not follow up. Do not escalate. Give the translation time to land.\n\n{B_name} (the withdrawer): When you feel the urge to retreat, name it out loud BEFORE you go: "I'm starting to feel flooded. I need 20 minutes, but I'm not leaving this conversation. I'll come back." Then COME BACK. The return is everything.`,
    developmental: `This pattern often traces to complementary early environments. {A_name} likely grew up in a context where connection was inconsistent — you learned to amplify your signal to be heard. {B_name} likely grew up where emotional intensity was overwhelming — you learned to regulate by creating distance. Both strategies were brilliant adaptations. In the current relationship, they create a feedback loop that neither of you authored. The developmental move is not for the pursuer to stop pursuing or the withdrawer to stop withdrawing — it is for each of you to build a SECOND strategy. The pursuer learns to self-soothe without external reassurance. The withdrawer learns to stay present without flooding. Neither of you loses your first language. You both gain a second one.`,
    relational: `*What {A_name} experiences:* The silence is deafening. When {B_name} retreats, it doesn't feel like space — it feels like vanishing. Like watching someone you love walk away in slow motion. The panic that rises isn't about this conversation — it's about every time someone important went quiet and didn't come back. The pursuing isn't a choice. It's a reflex, ancient and urgent: if I can just get through, if I can just make them hear me, they'll stay.\n\n*What {B_name} experiences:* The intensity is a wall of sound. When {A_name} escalates, it doesn't feel like love — it feels like a fire alarm in a small room. Everything gets loud and close and there's nowhere to breathe. The withdrawal isn't a choice either. It's the nervous system pulling the emergency brake: shut down, protect, survive. The silence isn't punishment. It's the only way to keep from saying something that makes everything worse.`,
    simple: `One of you reaches harder. The other pulls further. Both of you are afraid. Name the fear instead of acting on it. That changes everything.`,
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
  },
  coupleInvitation: 'Learn each other\'s dialect. Urgency is fear. Silence is care. Both are love.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Johnson, S. (2019). Attachment theory in practice: EFT with individuals, couples, and families.',
    'Schachner et al. (2012). 539-couple longitudinal attachment study.',
    'Greenman & Johnson (2013). EFT for couples meta-analysis.',
  ],
};

// ─── DYNAMIC 2: Mutual Withdrawal ────────────────────────────────────────────
const mutualWithdrawal: CoupleNarrativeEntry = {
  id: 'couple-mutual-withdrawal',
  dynamicName: 'Mutual Withdrawal',
  domain: 'conflict',
  lenses: {
    therapeutic: `Research on attachment identifies this pattern as the "silent crisis" — couples who never fight but slowly drift into parallel lives. In EFT's framework, both partners have deactivated their attachment needs, creating a relationship that functions but doesn't nourish. The 539-couple study found attachment avoidance predicted instability through a different pathway than anxiety: not through conflict, but through emotional absence. Clinical recommendation: both partners need to take small risks of vulnerability — not to create conflict, but to create contact. The therapeutic goal is not more fighting. It is more FEELING, expressed.`,
    soulful: `From the outside, your relationship looks peaceful. Effortless. You don't fight. You don't raise your voices. You navigate life side by side with a quiet competence that others might envy. And underneath that calm surface, a stillness that is not peace but absence. You have both learned to need nothing from each other — or to need it so silently that the need becomes invisible even to you. The distance between you is not miles. It is millimeters. But those millimeters are made of everything unsaid, unfelt, unrisked. You have built a life together. You have not built a home in each other. The invitation is not to create storms. It is to create weather — any weather. A warm current. A small rain. Something that says: I am here, and I notice you, and this space between us is alive.`,
    practical: `THE PATTERN: Something needs saying → both of you sense it → neither of you says it → the moment passes → distance grows by one invisible increment → multiply by months and years.\n\nTHIS WEEK — ONE PRACTICE, TOGETHER:\nThe 10-Minute Temperature Check. Set a timer. Each partner shares one thing they've been carrying silently — not a complaint, not a problem to solve, just something real: "I've been feeling a little lonely this week." "I missed you today." The other partner's only job: listen. Not fix. Not deflect. Listen. Then switch.\n\nThis practice breaks the seal of silence without creating the intensity that made you both withdraw in the first place. Small vulnerability. Regularly. That is the antidote.`,
    developmental: `Two avoidant partners often found each other precisely BECAUSE the other person didn't demand emotional engagement. The early relationship felt safe — no one pushing, no one overwhelming. But Erikson's intimacy stage requires mutual vulnerability, and two people who both avoid it create a form of Isolation that masquerades as togetherness. The developmental move: discovering that emotional risk inside a safe relationship is different from emotional risk in the environments that taught you to withdraw.`,
    relational: `*What {A_name} experiences:* The relationship feels stable. Predictable. And sometimes, in a quiet moment, you notice a hollowness — not pain exactly, more like something missing. You wouldn't call it lonely. You'd call it fine. But fine has a texture, and the texture is flat.\n\n*What {B_name} experiences:* You appreciate the calm. No drama. No demands. And sometimes you wonder: is this all there is? Not because the relationship is bad — because you can't quite feel it. It's there. You know it's there. You just can't reach the warmth from where you're standing.`,
    simple: `No storms. No warmth. The calm is not peace — it's absence. One real sentence this week. From each of you. That's the beginning.`,
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
  },
  coupleInvitation: 'You built a life together. Now build a home in each other. One sentence at a time.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Schachner et al. (2012). 539-couple attachment study.',
    'Erikson, E. (1963). Childhood and Society. Stage 6: Intimacy vs. Isolation.',
  ],
};

// ─── DYNAMIC 3: Escalation-Escalation ────────────────────────────────────────
const escalationEscalation: CoupleNarrativeEntry = {
  id: 'couple-escalation',
  dynamicName: 'Escalation-Escalation',
  domain: 'conflict',
  lenses: {
    therapeutic: `Gottman's research identifies mutual escalation as the pattern most associated with Diffuse Physiological Arousal (DPA) — the state where heart rate exceeds 100 BPM and productive conversation becomes neurologically impossible. When both partners escalate, the interaction enters a positive feedback loop with no natural brake. EFT understands both partners as expressing attachment urgency simultaneously — both are reaching for connection through intensity, neither can hear through the other's volume. The transdiagnostic EFT framework recommends structured repair protocols with enforced pauses, because the couple's natural repair mechanism (one person softens) is disabled when both are in fight mode.`,
    soulful: `When the spark catches, it catches you both. Neither of you backs down. Neither of you goes quiet. The volume rises in stereo — two hearts on fire, two mouths open, two nervous systems in full alarm. The heat is real. The caring underneath the heat is real too — you don't fight this hard with someone you don't love this much. But the caring can't survive the fire. Words land like blows. Wounds get reopened that took months to close. And afterward, the silence isn't peace — it's exhaustion. Two people standing in the wreckage of a conversation that started about dishes and ended about everything. The passion between you is a resource. It becomes destructive only when it has no container. The practice is not less passion. It is a bigger vessel to hold it.`,
    practical: `THE CYCLE: Issue arises → {A_name} escalates → {B_name} matches → {A_name} raises → {B_name} raises → both are flooding → words become weapons → eventual exhaustion → nothing resolved → resentment stored → next time the fuse is shorter.\n\nTHIS WEEK — THE CIRCUIT BREAKER:\nAgree on a code word. Something absurd — "pineapple," "penguin," whatever makes you both almost-smile. When EITHER of you says the word, it means: we are both flooding and nothing good can happen right now. 20-minute mandatory pause. Both leave. Both breathe. Both return. THEN try again at half the volume. The word is not a weapon. It is a shared commitment to the relationship being more important than winning.`,
    developmental: `Two escalators often grew up in environments where intensity was the only signal that worked. You learned: if you're not loud, you're invisible. Both of you brought that lesson to a relationship where, for the first time, the other person is equally loud. The collision is two survival strategies designed for environments where nobody listened meeting in an environment where someone actually could — if the volume allowed it.`,
    relational: `*What {A_name} experiences:* You can't believe they're escalating back. Can't they see how important this is? The volume feels necessary because NOTHING ELSE has gotten through. If they would just LISTEN, you wouldn't have to yell.\n\n*What {B_name} experiences:* Exactly the same thing. Mirror image. You can't believe they won't stop. The volume feels necessary because you can't be the one who backs down. You tried that once, and it felt like losing yourself.`,
    simple: `Two fires. No extinguisher. Create one together: a code word, a pause, a return. Same passion, shared container.`,
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
  },
  coupleInvitation: 'The passion between you is not the problem. It needs a container. Build one together.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Gottman, J. (1994). What Predicts Divorce. DPA research.',
    'Greenman & Johnson (2013). EFT transdiagnostic framework.',
  ],
};

// ─── DYNAMIC 4: The Leader-Accommodator ──────────────────────────────────────
const leaderAccommodator: CoupleNarrativeEntry = {
  id: 'couple-leader-accommodator',
  dynamicName: 'The Leader-Accommodator',
  domain: 'conflict',
  lenses: {
    therapeutic: `This pattern often appears conflict-free on the surface — decisions get made, action gets taken, nobody fights. Research on behavioral frequency and acceptance in relationships shows this dynamic can be stable when the accommodator is genuinely flexible. But it becomes clinically significant when the yielding is anxiety-driven rather than preference-driven. ACT's values-based framework asks: is the accommodator yielding because they genuinely don't mind, or because asserting their own position feels dangerous? The distinction matters — the first is easy temperament, the second is slowly eroding selfhood.`,
    soulful: `One of you leads. The other follows. And from the outside it looks like harmony — decisions happen, plans get made, the relationship has direction. {A_name} provides the structure. {B_name} provides the flexibility. But look closer. Is {B_name}'s flexibility genuine preference, or is it the absence of voice? Is {A_name}'s leadership genuine clarity, or is it expanding to fill the vacuum of the other's silence? A relationship of one voice is a monologue. Even a beautiful one. What's missing is the friction that makes two people real to each other — the moment when {B_name} says "actually, I want something different" and {A_name} discovers their partner is a person, not an echo.`,
    practical: `THIS WEEK — ROLE REVERSAL EXPERIMENT:\nFor three decisions this week (what to eat, what to watch, where to go), {B_name} chooses FIRST and {A_name} follows. No debate. No "are you sure?" Just: you lead, I follow. Notice what it feels like. Both of you.\n\n{B_name}: Notice if choosing feels uncomfortable, and sit with that discomfort instead of deferring.\n{A_name}: Notice if following feels like losing control, and sit with that instead of overriding.`,
    developmental: `The leader-accommodator pattern maps cleanly to Kegan. The leader is often operating from Order 4 (self-authoring — I know what I want and I pursue it). The accommodator may be at Order 3 (the socialized mind — my sense of what's okay to want is defined by the relationship). The developmental invitation is not for the leader to become less clear, but for the accommodator to find their own authorship. And for the leader: the transition to Order 5 requires recognizing that your partner's emergence may challenge your framework — and that's the point, not the problem.`,
    relational: `*What {A_name} experiences:* The efficiency feels good. You know what you want, and your partner goes along. But sometimes you catch a flicker — do they agree, or have they just stopped trying? You might miss having someone to push against. Someone whose "yes" means something because they also have access to "no."\n\n*What {B_name} experiences:* The ease feels good. No conflict. No negotiation. But sometimes a small voice asks: when was the last time I chose something? Not because they won't let you — because you stopped trying. The accommodation is so automatic now you barely notice it's happening.`,
    simple: `One leads. One follows. Both lose something in the arrangement. This week: the follower leads three times. See what emerges.`,
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
  },
  coupleInvitation: 'A relationship of one voice is a monologue. Bring both voices to the table.',
  evidenceLevel: 'moderate',
  keyCitations: [
    'Hayes, S. et al. (2006). ACT values-based framework in couples.',
    'Kegan, R. (1994). In Over Our Heads. Orders 3-5.',
    'Christensen et al. Integrative Behavioral Couples Therapy.',
  ],
};

// ─── DYNAMIC 5: Natural Negotiators ──────────────────────────────────────────
const naturalNegotiators: CoupleNarrativeEntry = {
  id: 'couple-natural-negotiators',
  dynamicName: 'Natural Negotiators',
  domain: 'conflict',
  lenses: {
    therapeutic: `This is the most stable conflict interaction pattern in the research. When both partners orient toward problem-solving or compromise, the couple has a natural repair mechanism — disagreements become collaborative rather than adversarial. Research on acceptance and behavioral frequency confirms that partner-directed positive behaviors predict satisfaction more strongly than the absence of negative behaviors. This couple is generating positive conflict behaviors consistently. The clinical consideration: ensure that the problem-solving orientation includes space for emotional expression, not just solution generation. A couple can be excellent at fixing things and still miss the emotional content underneath.`,
    soulful: `You have something rare: a shared language for disagreement. When tension arises, neither of you reaches for weapons. You reach for solutions. The space between you during conflict is not a battlefield — it is a workshop. You build things there. Compromises. Plans. Paths forward. Honor this. It is not something most couples can take for granted. And — gently — notice whether the workshop sometimes runs so efficiently that it skips the step where someone says: "I'm not looking for a solution right now. I'm looking to be heard." The ability to fix things is a gift. The willingness to sit with things before fixing them — that is the growth edge.`,
    practical: `YOUR STRENGTH: You solve problems together well.\nYOUR EDGE: Don't skip the feeling on the way to the fix.\n\nTHIS WEEK: When a disagreement arises, before EITHER of you proposes a solution, each partner shares one sentence about how they FEEL about it. Not what should be done. What it feels like. Then solve.`,
    developmental: `You may both be at Order 4 — self-authoring minds that bring clear positions to the table and negotiate skillfully. The transition to Order 5 (inter-individual) requires moments where you let the OTHER's perspective genuinely change your mind, not just compromise with it. Not "I'll give you this if you give me that" but "Your way of seeing this is making me reconsider mine."`,
    relational: `*What {A_name} experiences:* The relief of a partner who engages rather than attacks or retreats. You can bring problems to the table knowing they'll be met with collaboration, not defense. That safety is not nothing. It is everything.\n\n*What {B_name} experiences:* The comfort of knowing that disagreement is not danger. That having a different opinion doesn't threaten the relationship. That comfort frees you to be honest in ways that other couples can't.`,
    simple: `You disagree well. Rare gift. The edge: feel first, fix second. Both matter.`,
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
  },
  coupleInvitation: 'You already build well together. Now feel before you fix. That\'s the missing step.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Christensen & Jacobson (2000). Reconcilable Differences. Behavioral frequency research.',
    'Kegan, R. (1994). In Over Our Heads. Order 4-5 transitions.',
  ],
};

// ─── DYNAMIC 6: The Anxious-Anxious Loop ─────────────────────────────────────
const anxiousAnxious: CoupleNarrativeEntry = {
  id: 'couple-anxious-anxious',
  dynamicName: 'The Anxious-Anxious Loop',
  domain: 'attachment',
  lenses: {
    therapeutic: `Two anxiously attached partners create a unique system: mutual hyperactivation with no deactivating partner to break the cycle. EFT research identifies this as an escalation pattern distinct from pursue-withdraw — both partners pursue simultaneously, creating an intensity spiral with no natural off-ramp. Research on emotional expressivity and attachment shows this pairing benefits from regulation-focused work before attachment deepening, because both partners' alarm systems fire simultaneously during distress.`,
    soulful: `You found each other in the wanting. Both of you know what it is to need and not be sure the need will be met. Both of you scan the horizon for signs of storm. Both of you reach. And when you both reach at the same time — for reassurance, for closeness, for proof that this is real — the reaching creates a kind of urgency that feeds on itself. Two hearts in alarm, neither one calm enough to be the harbor. It is not that you love too much. It is that you fear too much — and the fear is a hall of mirrors, your anxiety reflecting off your partner's anxiety back to you, amplified. What this relationship needs is not less love. It is an anchor that neither of you has to provide alone. Practices. Rituals. A shared ground that holds you both when neither of you can hold the other.`,
    practical: `THE PATTERN: {A_name} feels anxious → reaches for {B_name} → {B_name} is ALSO anxious → can't provide reassurance → {A_name}'s anxiety spikes → {B_name}'s anxiety spikes → mutual escalation → no one can be the calm one.\n\nTHIS WEEK — THE ANCHOR PRACTICE:\nCreate a physical ritual that means "we're okay" without requiring either of you to be the calm one. Hold hands for 60 seconds in silence. Not talking. Not reassuring. Just: hands. Bodies. Present. The nervous systems will co-regulate through the physical contact even when neither mind can provide words of comfort.`,
    developmental: `Two anxious partners often bonded over the SHARED experience of insecurity — finally, someone who understands. That bond is real and valuable. The developmental edge: building a shared secure base that doesn't depend on either person being secure INDIVIDUALLY. The relationship itself becomes the container through rituals, agreements, and practices — an earned security that belongs to the US, not to either I.`,
    relational: `*What {A_name} experiences:* You understand {B_name}'s anxiety because you feel it too. But when you're BOTH spiraling, there's no ground. You reach for them and find someone equally terrified. The empathy is real. The capacity to soothe in that moment is not.\n\n*What {B_name} experiences:* The same. Exactly the same. And that sameness is both the deepest connection and the deepest challenge. Nobody is pretending to be fine. Nobody can pretend to be steady either.`,
    simple: `Two alarms. No anchor. Build one together: a ritual, a touch, a practice that says "we're okay" when neither of you can say it alone.`,
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
  },
  coupleInvitation: 'Build an anchor that belongs to both of you. When neither can be steady, the ritual holds you.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Johnson, S. (2019). Attachment theory in practice.',
    'Schachner et al. (2012). Attachment and emotional expressivity research.',
  ],
};

// ─── DYNAMIC 7: The Avoidant-Avoidant Drift ──────────────────────────────────
const avoidantAvoidant: CoupleNarrativeEntry = {
  id: 'couple-avoidant-avoidant',
  dynamicName: 'The Avoidant-Avoidant Drift',
  domain: 'attachment',
  lenses: {
    therapeutic: `This pairing is often overlooked clinically because these couples rarely present for therapy — the relationship doesn't feel distressed, it feels distant. Research shows avoidant-avoidant pairings have lower overt conflict but also lower intimacy and satisfaction over time. The risk is not rupture but erosion — a slow drift into parallel lives. EFT's framework identifies both partners as having deactivated attachment systems, meaning neither one initiates the vulnerability that would deepen connection. Clinical recommendation: start with small, structured emotional disclosure before either partner's system identifies the intervention as threatening.`,
    soulful: `You are two islands. Close enough to see each other's shoreline. Too far to touch. The space between you is comfortable — neither of you demanded it, it simply grew. Week by week. Year by year. The imperceptible widening of a gap that started as breathing room and became a canyon. You do not fight. You do not cry. You do not reach. And the absence of reaching has become so familiar that you have both forgotten what it felt like to want to. Somewhere underneath the competent independence, two hearts that once chose each other are waiting to remember why. The invitation is not grand gesture. It is the smallest possible bridge: one moment of "I miss this" spoken out loud.`,
    practical: `THE DRIFT: You don't fight → you don't connect → you don't fight about not connecting → the distance normalizes → years pass.\n\nTHIS WEEK: One sentence. Each of you. Something you haven't said because it felt unnecessary or too vulnerable: "I like it when we sit together." "I missed you today." "I don't know how to start this conversation, but I want to." The sentence doesn't have to be perfect. It has to be real.`,
    developmental: `Two avoidant partners have often achieved strong individual differentiation — clear I-positions, low fusion, emotional self-reliance. In Kegan's terms, both may be at Order 4: self-authored, internally coherent. The developmental edge is Order 5 — inter-individual — where two self-authored selves risk the boundaries they've carefully built. Not to lose themselves, but to discover what exists in the space between two whole people who are willing to be affected by each other.`,
    relational: `*What {A_name} experiences:* The independence feels earned. You don't need your partner to complete you. But there are moments — usually late at night, or in a crowd, or after a long day — when you notice the absence of something you can't name. It's not loneliness. It's something quieter. Like a room that used to have music in it.\n\n*What {B_name} experiences:* The self-sufficiency is a source of pride. You handle your own emotions. You don't burden. You don't demand. And sometimes you wonder if your partner even knows you're in the room. Not because they're cruel. Because you've both gotten so good at not needing that the needing went silent.`,
    simple: `Two islands. Close but untouching. One bridge sentence this week. From each shore.`,
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
  },
  coupleInvitation: 'One sentence. From each shore. That\'s how islands become a continent.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Schachner et al. (2012). Avoidant attachment and relationship satisfaction over time.',
    'Kegan, R. (1994). In Over Our Heads. Order 4-5.',
  ],
};

// ─── DYNAMIC 8: Secure-Anxious Stabilization ─────────────────────────────────
const secureAnxious: CoupleNarrativeEntry = {
  id: 'couple-secure-anxious',
  dynamicName: 'Secure-Anxious Stabilization',
  domain: 'attachment',
  lenses: {
    therapeutic: `The secure partner provides a natural regulatory function — a biological anchor for the anxious partner's activated system. EFT research on "earned security" suggests that a consistently responsive secure partner can help the anxious partner develop new internal working models over time. This is the mechanism: repeated experience of reaching and being met rewrites the attachment system's predictions. The clinical consideration: the secure partner's patience has limits. If the anxious partner's needs consistently exceed the secure partner's capacity, even a securely attached person can develop compassion fatigue or begin withdrawing.`,
    soulful: `One of you is the anchor. One of you is the wave. {A_name} brings a steadiness that {B_name} can feel in their body — a calm that says, without words, "I'm here. I'm not going anywhere." And {B_name} brings a depth of emotional awareness that {A_name} might never access alone — a sensitivity to the relational field that keeps the connection alive and noticed. This is not a relationship between a healthy person and a broken one. It is a relationship between two different nervous systems, each offering what the other needs. The anchor gives ground. The wave gives depth. The invitation: {A_name}, your steadiness is a gift — make sure you also receive. You are allowed to need things. {B_name}, your sensitivity is a gift — trust that it is being met, even when the reassurance comes quieter than your alarm system expects.`,
    practical: `THE DYNAMIC: {B_name} feels anxious → reaches for {A_name} → {A_name} responds with presence → {B_name}'s system settles → connection deepens. That's the POSITIVE cycle. It works.\n\nTHE EDGE: When {B_name}'s anxiety exceeds {A_name}'s bandwidth — when the reaching becomes relentless, when reassurance doesn't land, when the seeking feels bottomless — {A_name} starts to withdraw. Not from avoidance, but from exhaustion.\n\nTHIS WEEK:\n{B_name}: Practice one moment of self-soothing BEFORE reaching for {A_name}. Hand on heart, three breaths, then ask for what you need. This builds the internal resource alongside the external one.\n{A_name}: Name when you're approaching your limit: "I love you and I'm getting stretched. Can we pause and reconnect in an hour?" Honesty protects the system better than silent endurance.`,
    developmental: `This pairing has natural developmental momentum. {B_name} is learning — through lived experience, not theory — that reaching can be met. That is an earned-security trajectory. The developmental invitation for {A_name}: don't just be the steady one. Let {B_name} see your vulnerability too. A relationship where only one person is human is not intimacy. It's caregiving.`,
    relational: `*What {A_name} experiences:* The role of anchor comes naturally. You enjoy being the steady one. But sometimes the weight is heavy. Sometimes you wish your partner could see that you're calm, not invulnerable. That being the rock doesn't mean you don't have your own tremors.\n\n*What {B_name} experiences:* The steadiness is lifesaving. Literally, it feels like oxygen after drowning. But the gratitude sits next to a quieter fear: am I too much? Is this sustainable? Will they eventually tire of being the strong one? That fear, unspoken, becomes its own source of anxiety.`,
    simple: `One is the anchor. One is the wave. The anchor needs depth. The wave needs ground. Meet in the middle.`,
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
  },
  coupleInvitation: 'The anchor is allowed to need things too. The wave is allowed to be steady sometimes. Meet in the middle.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Johnson, S. (2019). Earned security in EFT.',
    'Schachner et al. (2012). Attachment style interaction effects.',
  ],
};

// ─── DYNAMIC 9: The Secure-Avoidant Thaw ─────────────────────────────────────
const secureAvoidant: CoupleNarrativeEntry = {
  id: 'couple-secure-avoidant',
  dynamicName: 'The Secure-Avoidant Thaw',
  domain: 'attachment',
  lenses: {
    therapeutic: `The secure partner provides what the avoidant partner's system needs but doesn't trust: consistent, non-demanding presence. Research on earned security shows that avoidant attachment can shift over time in relationships where the partner is reliably available without being intrusive. The clinical distinction: the secure partner's challenge is not to take the avoidance personally — the withdrawal is not about them, it's about the avoidant partner's internal working model. The risk: if the secure partner begins pursuing (because they misread distance as disinterest), they can inadvertently trigger a pursue-withdraw cycle that didn't need to exist.`,
    soulful: `One of you is warm. The other is thawing. {A_name} offers a steady presence — not pushing, not pulling, just: here. Available. Warm. And {B_name} feels that warmth the way a frozen lake feels spring. Slowly. From the surface down. Layer by layer. The thawing is not visible most days. But it is happening. Every moment that {A_name} stays without demanding, {B_name}'s system takes one more data point: this person is safe. This closeness will not overwhelm me. I can stay without losing myself. The thaw is not dramatic. It is geological. And it is real.`,
    practical: `THE DYNAMIC: {A_name} offers warmth → {B_name} receives it cautiously → if {A_name} doesn't escalate → {B_name} opens slightly more → trust builds incrementally → closeness increases at {B_name}'s pace.\n\nTHE RISK: If {A_name} gets impatient and pushes → {B_name}'s system reads it as intrusion → withdrawal → {A_name} pushes more → now it's pursue-withdraw.\n\nTHIS WEEK:\n{A_name}: Offer closeness without demanding reciprocity. A touch. A word. Then give space. Let {B_name} come to you in their timing.\n{B_name}: Notice one moment this week when you feel the warmth and don't pull away. Just notice it. You don't have to do anything with it. Just let it register.`,
    developmental: `The secure-avoidant pairing has a particular developmental potential: the avoidant partner can develop earned security through the experience of non-intrusive warmth. Not through therapy (though that helps) but through the RELATIONSHIP itself being therapeutic — a corrective emotional experience in Kegan's terms. The secure partner's growth edge: not becoming a therapist. Staying a partner. Expecting reciprocity even while being patient about its timing.`,
    relational: `*What {A_name} experiences:* You love someone who is slowly learning to let you in. The patience comes naturally — mostly. But sometimes you wonder: will they ever fully arrive? Will there always be a piece held back? The answer is: probably. And the love is in the "anyway."\n\n*What {B_name} experiences:* The warmth is disorienting. Not because it's unwelcome — because your system doesn't quite know what to do with consistent, non-threatening closeness. It's like someone speaking a language you understand but never learned to speak. You receive it. You're learning to return it. The pace is yours.`,
    simple: `One is warm. One is thawing. The warmth doesn't push. The thaw doesn't rush. Both are patient with the pace.`,
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
  },
  coupleInvitation: 'The warmth doesn\'t push. The thaw doesn\'t rush. Trust the pace of the geological.',
  evidenceLevel: 'strong',
  keyCitations: [
    'Johnson, S. (2019). Corrective emotional experience in EFT.',
    'Schachner et al. (2012). Earned security trajectories.',
  ],
};

// ─── DYNAMIC 10: The Values Collision ────────────────────────────────────────
const valuesCollision: CoupleNarrativeEntry = {
  id: 'couple-values-collision',
  dynamicName: 'The Values Collision',
  domain: 'values',
  lenses: {
    therapeutic: `ACT research on psychological flexibility in couples (meta-analytic effect g = -1.23 for marital satisfaction) directly addresses values conflicts. When partners hold genuinely different core values, the therapeutic goal is not alignment but UNDERSTANDING — each partner comprehending WHY the other values what they value, and where flexibility exists versus where it doesn't. Research on incompatible young couples found ACT improved empathy, adaptability, and couple functioning even when the underlying value differences remained. The clinical framework: values themselves don't need to match. The relationship needs enough overlap to build a shared life and enough respect for difference to maintain two separate selves within it.`,
    soulful: `You built your lives around different compasses. What {A_name} moves toward, {B_name} may move away from — not out of opposition, but out of a genuinely different understanding of what makes a life worth living. This is not incompatibility. It is complexity. Two people with identical values would never challenge each other to grow. Two people with no shared values would have no ground to stand on. You are somewhere between — enough overlap to love, enough divergence to grow, and the persistent question: how do two people who see the world differently build one life? The answer is not compromise (which asks both to give up what matters). The answer is architecture: building a shared structure with room inside it for two different ways of being.`,
    practical: `YOUR OVERLAP: {shared_values_count} of your top 5 values align.\nYOUR FRICTION POINTS: {divergent_domains}\n\nTHIS WEEK — THE VALUES CONVERSATION:\nSit down. Each partner names their top 3 values and tells the STORY behind each: not "I value honesty" but "I value honesty because growing up in my family, the things that weren't said did the most damage." When you hear the STORY, the value stops being an abstract principle and becomes a person's attempt to heal something. You don't have to share the value. You do have to respect the wound it comes from.`,
    developmental: `Values differences between partners become most acute at Kegan's Order 4, where each person has authored their own value system and holds it with conviction. The Order 5 move is not abandoning your values — it's recognizing that your value system is ONE way of organizing the good life, and your partner's is ANOTHER, and neither is complete alone. Not relativism. Something harder: holding your conviction AND its limits simultaneously.`,
    relational: `*What {A_name} experiences:* When {B_name} acts from values that differ from yours, it can feel like a rejection of what you hold most important. It isn't. They are not choosing against your values. They are choosing toward their own. The difference matters.\n\n*What {B_name} experiences:* When {A_name} insists on something that doesn't matter to you, it can feel like being drafted into someone else's war. It isn't a war. It's a compass. Understanding WHY it matters to them doesn't mean it has to matter to you in the same way. It means you see the person behind the principle.`,
    simple: `Different compasses. Same journey. Learn the story behind each other's direction. Respect doesn't require agreement.`,
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
  },
  coupleInvitation: 'You don\'t have to share the value. You have to respect the wound it comes from.',
  evidenceLevel: 'moderate',
  keyCitations: [
    'Hayes et al. (2006). ACT and marital satisfaction meta-analysis.',
    'Kegan, R. (1994). In Over Our Heads. Order 4-5.',
    'Doss et al. (2012). ACT for incompatible couples.',
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

/** Route attachment domain to the appropriate couple dynamic */
export function routeAttachmentDynamic(
  aScores: PartnerScores,
  bScores: PartnerScores
): CoupleNarrativeEntry | null {
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

  if ((aAnxious && bAvoidant) || (aAvoidant && bAnxious)) return pursueWithdraw;
  if (aAnxious && bAnxious) return anxiousAnxious;
  if (aAvoidant && bAvoidant) {
    // Distinguish between avoidant-avoidant and mutual withdrawal
    return avoidantAvoidant;
  }
  if (aSecure && bAnxious) return secureAnxious;
  if (aSecure && bAvoidant) return secureAvoidant;
  if (aAnxious && bSecure) return secureAnxious; // swap perspective at render time
  if (aAvoidant && bSecure) return secureAvoidant; // swap perspective at render time
  return null;
}

/** Route conflict domain to the appropriate couple dynamic */
export function routeConflictDynamic(
  aScores: PartnerScores,
  bScores: PartnerScores
): CoupleNarrativeEntry | null {
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

  if (aForcing > 3.5 && bForcing > 3.5) return escalationEscalation;
  if (aAvoiding > 3.5 && bAvoiding > 3.5) return mutualWithdrawal;
  if ((aProblemSolving > 3.5 && bYielding > 3.5) || (bProblemSolving > 3.5 && aYielding > 3.5)) return leaderAccommodator;
  if ((aCompromising > 3.5 && bCompromising > 3.5) || (aProblemSolving > 3.5 && bProblemSolving > 3.5)) return naturalNegotiators;
  return null;
}

/** Route values domain to the appropriate couple dynamic */
export function routeValuesDynamic(
  aScores: PartnerScores,
  bScores: PartnerScores
): CoupleNarrativeEntry | null {
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

  if (sharedCount < 2 && divergentDomains.length >= 2) return valuesCollision;
  return null;
}
