/**
 * Pairwise Integration Functions
 * ────────────────────────────────────────────
 * 21 pairwise functions — one for each unique pair of 7 domains.
 * Each produces a developmental arc: protection → cost → emergence.
 *
 * Priority pairs (built first):
 * 1. attachment × EQ (foundation × navigation)
 * 2. attachment × conflict (foundation × conflict)
 * 3. attachment × differentiation (foundation × stance)
 * 4. EQ × differentiation (navigation × stance)
 * 5. conflict × values (conflict × compass)
 * 6. EQ × conflict (navigation × conflict)
 *
 * Then remaining 15 pairs.
 */

import type { IntegrationScores, IntegrationResult, DomainId } from './types';
import {
  isAnxious, isAvoidant, isSecure,
  getAnxiety, getAvoidance, getAttachmentStyle,
  getN, getE, getO, getA, getC,
  getEQTotal, getEQPerception, getEQManagingSelf, getEQManagingOthers, getEQUtilization,
  getDSITotal, getReactivity, getIPosition, getFusion, getCutoff,
  getConflictStyle, getSecondaryStyle, getYielding, getAvoiding, getForcing, getProblemSolving,
  getTopValues, getAvgValueGap, getBiggestGapValue,
} from './helpers';

type PairKey = `${DomainId}×${DomainId}`;

/** Registry of all pairwise integration functions */
const PAIRWISE_REGISTRY: Record<string, (s: IntegrationScores) => IntegrationResult> = {};

function register(a: DomainId, b: DomainId, fn: (s: IntegrationScores) => IntegrationResult) {
  // Register both orderings so lookup works regardless of selection order
  PAIRWISE_REGISTRY[`${a}×${b}`] = fn;
  PAIRWISE_REGISTRY[`${b}×${a}`] = fn;
}

/** Look up a pairwise integration by domain pair */
export function getPairwiseIntegration(
  a: DomainId,
  b: DomainId,
  scores: IntegrationScores,
): IntegrationResult | null {
  const fn = PAIRWISE_REGISTRY[`${a}×${b}`];
  if (!fn) return null;
  return fn(scores);
}

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 1: Attachment × EQ (foundation × navigation)
// ═══════════════════════════════════════════════════════

register('foundation', 'navigation', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const secure = isSecure(s);
  const eqHigh = getEQTotal(s) >= 65;
  const perception = getEQPerception(s);
  const managing = getEQManagingSelf(s);

  if (anxious && eqHigh) {
    return {
      title: 'The Empathic Radar',
      subtitle: 'Your attachment × emotional intelligence',
      body: `You feel everything — and you're actually good at reading the room. Your anxiety isn't a flaw in your emotional system; it's a sensitivity that pairs with genuine perceptive ability. The problem isn't that you feel too much. It's that you can't always tell the difference between what you're sensing in another person and what your attachment system is projecting. In Jungian terms, you carry the archetype of the Wounded Healer — your own pain has sharpened your perception of others' pain, but the wound and the gift are so entangled that separating them is the work of a lifetime.\n\nYour EQ perception score (${Math.round(perception)}) shows real skill at reading emotional cues. But when attachment anxiety activates (${getAnxiety(s).toFixed(1)}/7), that same perception gets hijacked — what Stephen Porges calls neuroception shifts from social engagement to threat detection. You start reading FOR threat instead of reading FOR information. Your partner's neutral face becomes evidence of withdrawal. Their silence becomes rejection. In EFT terms, this is the protest behavior of the anxious partner: the radar is real, but the signal is distorted by the desperate need for reassurance. In IFS language, your Hypervigilant Manager part floods the system, drowning out the Self that could receive information calmly.\n\nAs Rainer Maria Rilke wrote, "Perhaps all the dragons in our lives are princesses who are only waiting to see us act, just once, with beauty and courage." Your emotional radar is that dragon — terrifying in its intensity, but underneath it lies a princess: the capacity for profound attunement that most people never develop. The developmental invitation here is what Robert Kegan would call the shift from the Socialized Mind (where your sense of self depends on the other's response) to the Self-Authoring Mind (where you can hold your own emotional experience while receiving theirs). This isn't about feeling less. It's about trusting what you feel enough to let it be information rather than emergency.`,
      arc: {
        protection: 'You developed a hypervigilant emotional radar — what Polyvagal theory describes as a dorsal vagal system tuned to detect micro-shifts in facial affect, vocal prosody, and relational proximity. This was brilliant adaptation: in early relationships where attention wasn\'t guaranteed, your survival depended on reading the room before the room changed. This wasn\'t paranoia — it was necessary intelligence.',
        cost: 'Your genuine emotional perception gets flooded by attachment noise — what EFT researchers call "priming": the anxious system projects past abandonment onto present ambiguity. Your partner feels surveilled rather than seen. They experience your perception not as empathy but as pressure — a constant, unspoken demand: "Prove to me you\'re still here." The tragedy is that the very skill that could create extraordinary intimacy instead creates exhausting vigilance.',
        emergence: 'What wants to emerge is what ACT calls "defusion" — the ability to notice the thought "they\'re pulling away" without fusing with it as truth. This is also Kegan\'s Fourth Order transition: moving from being subject to your emotional radar to having it as an object you can observe and question. Your EQ is real. Your anxiety just keeps turning up the volume. The developmental leap is trusting your perception enough to hold it lightly.',
      },
      practice: 'After your morning coffee together, do this micro-practice: notice one emotional signal from your partner and silently ask yourself, "Am I sensing something real, or am I scanning for danger?" If unsure, say: "I\'m noticing something — can I check it with you?" Then — this is the hard part — let the answer land for a full 10 seconds before responding. This week, do this three times. You\'re training your nervous system to receive before it reacts.',
      oneThing: 'Your radar is real. Let what you feel become information, not instruction.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
    };
  }

  if (anxious && !eqHigh) {
    return {
      title: 'The Unfiltered Signal',
      subtitle: 'Your attachment × emotional intelligence',
      body: `Your attachment system runs hot (anxiety: ${getAnxiety(s).toFixed(1)}/7), and your emotional processing tools are still developing (EQ: ${Math.round(getEQTotal(s))}). This creates a specific pattern: you feel the intensity of connection/disconnection acutely, but have fewer resources for managing those feelings once they arrive. In the language of Polyvagal theory, your autonomic nervous system jumps quickly from ventral vagal (calm connection) to sympathetic activation (fight/flight/pursue) without the "speed bumps" that emotional skill provides.\n\nThis isn't a character flaw — it's a developmental edge. You were shaped by relationships where you needed to feel a lot but didn't get help learning what to do with those feelings. Think of it as a powerful river without levees: the water (emotion) is real and valuable, but without banks to channel it, it floods everything. In IFS terms, your Exile — the young part that carries the terror of abandonment — keeps activating Firefighter parts that react before your Self can respond. In Schema Therapy language, this is the Abandoned Child mode triggering the Detached Protector or Angry Child before the Healthy Adult can intervene.\n\nAs the poet Mary Oliver wrote, "Someone I loved once gave me a box full of darkness. It took me years to understand that this too, was a gift." Your emotional intensity IS the gift — it's the raw material of depth, passion, and fierce love. The work isn't to silence it but to build what DBT calls "distress tolerance" and "emotion regulation" — the capacity to feel the wave without being swept away. This is what Erikson's stage of Intimacy vs. Isolation is really about: not whether you can feel deeply (you already can), but whether you can hold what you feel long enough to share it rather than spray it.\n\nThe signal is real. The filter is what's growing. And every small moment where you pause between feeling and acting is literally rewiring your neural pathways — what Dan Siegel calls "mindsight" — building the prefrontal capacity to be with intensity without being consumed by it.`,
      arc: {
        protection: 'You learned to let your emotions drive action directly — reaching, clinging, protesting — because in your early relational world, the signal genuinely WAS too urgent to process first. A child whose attachment figures were unpredictable learned that hesitation meant missed connection. Your nervous system was right to bypass the filter. It just never learned to build one.',
        cost: 'Without stronger emotional management, your attachment activation triggers what Gottman calls "Diffuse Physiological Arousal" — flooding — which leads to reactive behavior that pushes partners away, confirming the very fear that started the cycle. Your partner experiences not your love but your panic. They feel responsible for a storm they didn\'t create and can\'t calm.',
        emergence: 'Building your EQ alongside your attachment awareness is what developmental psychologists call "earned security" — it doesn\'t require a different history, only a different relationship to the present. In Kegan\'s framework, this is the move from being subject to your emotions (Third Order) to having emotions as objects you can observe (Fourth Order). The intensity doesn\'t need to decrease — your capacity to hold it does.',
      },
      practice: 'After brushing your teeth each morning, place both hands on the bathroom counter and say: "I can feel without reacting." When attachment activation hits during the day (urgency, need to reach out, fear of losing connection), name it out loud: "My attachment system just activated." Then do one grounding thing — hands on a solid surface, three slow breaths — before responding. This week: catch it three times. That\'s the only goal.',
      oneThing: 'You feel deeply. Learning to hold what you feel — even for ten seconds longer — changes everything.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
    };
  }

  if (avoidant && eqHigh) {
    return {
      title: 'The Contained Reader',
      subtitle: 'Your attachment × emotional intelligence',
      body: `Here's the paradox: you're actually quite good at reading emotions (EQ: ${Math.round(getEQTotal(s))}), but your avoidant attachment (${getAvoidance(s).toFixed(1)}/7) means you tend to process those readings at a distance. You can see what someone is feeling without letting it move you. It's like watching weather through a window — perfectly accurate forecasting, but you never feel the rain. In Jungian terms, you embody the archetype of the Observer King: sovereign, perceptive, but enthroned at a distance from the messiness of the kingdom.\n\nThis makes you excellent in crisis — calm, perceptive, steady. In Polyvagal terms, your ventral vagal system stays regulated precisely because your attachment strategy keeps emotional activation at arm's length. What EFT researchers call "deactivating strategies" work beautifully with your emotional intelligence: you read the signal, classify it, and file it — without ever letting it enter the body. In IFS language, your Manager parts have recruited your emotional intelligence as a tool for maintaining safe distance rather than building bridges.\n\nBut in intimate relationships, your partner may feel what John O'Donohue described: "The human soul is not meant to be observed; it is meant to be encountered." They sense that you see them clearly but won't come closer. The gap between your perception and your response creates what Gottman calls "turning away" — not with hostility, but with the quiet deflection of someone who understands perfectly and responds from behind glass.\n\nThe developmental invitation is profound: can your emotional intelligence become participatory rather than observational? Schema Therapy calls this accessing the Vulnerable Child mode — the part of you that your avoidant strategy was built to protect. Your EQ is the bridge. The question is whether you'll walk across it.`,
      arc: {
        protection: 'You learned that emotional information is safer when it doesn\'t require emotional engagement. This is what attachment researchers call "compulsive self-reliance" — seeing without being moved kept you safe in relationships where closeness was overwhelming, intrusive, or unreliable. Your emotional intelligence became a watchtower rather than a bridge.',
        cost: 'Your partner experiences what therapists call "proximity without presence" — a strange loneliness of being seen but not reached. They feel known but not wanted. Your emotional intelligence becomes, paradoxically, a more sophisticated form of distance — you understand their pain so precisely that they can feel how deliberately you\'re choosing not to enter it.',
        emergence: 'What wants to happen is what Kegan calls the shift from Self-Authoring (where your identity is built on autonomous self-regulation) to Self-Transforming (where you allow relationship to genuinely change you). Your EQ already has the skill. The edge is letting it cost you something — letting what you see move you from observation into what Buber called "I-Thou" encounter.',
      },
      practice: 'Once this week, after dinner, when you notice your partner\'s emotional state: don\'t just register it. Let yourself be affected by it. Say what you see AND what it does to you: "I can see you\'re sad, and it makes me want to be closer to you." Let the response be slightly uncomfortable. The discomfort is the bridge. Walk across it.',
      oneThing: 'You see clearly. The invitation is to let what you see move you — from observer to participant.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
    };
  }

  if (avoidant && !eqHigh) {
    return {
      title: 'The Quiet Distance',
      subtitle: 'Your attachment × emotional intelligence',
      body: `Your avoidant attachment (${getAvoidance(s).toFixed(1)}/7) combines with still-developing emotional skills (EQ: ${Math.round(getEQTotal(s))}). This creates a pattern where you pull away from emotional intensity not because you're choosing space, but because you don't quite have the tools to process what's coming at you. Think of it as an ecosystem metaphor from ecopsychology: you're like a tree in thin soil — the roots (emotional skills) haven't gone deep enough to hold you steady when the wind (intimacy) picks up, so the whole system leans away.\n\nThis isn't coldness — it's overwhelm that looks like detachment. In Polyvagal terms, your nervous system shifts quickly from ventral vagal (social engagement) to dorsal vagal (shutdown/withdrawal) because the sympathetic arousal of emotional engagement has nowhere to go. Without the EQ tools to process incoming emotional data, your system does the only rational thing: it retreats. In Schema Therapy, this is the Detached Protector mode — a part that learned early that feelings are dangerous territory you don't have the map for.\n\nAs David Whyte wrote, "The greatest discipline is the willingness to be a stranger to yourself again and again." Your avoidance has made you a stranger not to yourself but to your own emotional interior. The landscape is there — rich, complex, full of information — but you learned to live at its edges rather than venture in. In IFS terms, your Exile (the vulnerable, feeling part) has been so thoroughly exiled that even you have lost contact with it.\n\nThe hopeful truth is that emotional intelligence is a learnable skill, not a fixed trait. Every time you pause and notice — even if what you notice is blankness — you're building the neural pathways that Siegel calls "mindsight." And as those pathways strengthen, the need for distance naturally softens. You don't have to force closeness. You just have to build the equipment that makes closeness survivable.`,
      arc: {
        protection: 'Emotional distance protected you from having to process feelings you weren\'t equipped to handle. In attachment terms, this is "deactivation without alternative strategy" — your system learned to shut down rather than engage because engagement without tools felt like drowning. Retreat became your nervous system\'s default, not your choice.',
        cost: 'Partners experience your distance as rejection — what Gottman calls "stonewalling," though for you it\'s not contempt but overwhelm. You miss emotional information that could actually help the relationship because you\'ve stepped back too far to read it. Over time, partners stop sending signals altogether, and the relationship hollows into parallel lives.',
        emergence: 'Building emotional intelligence alongside softening your avoidance creates what developmental psychologists call a "virtuous spiral." Each small gain in EQ makes closeness less threatening, which provides more relational data, which builds more EQ. This is Erikson\'s Intimacy vs. Isolation stage revisited in adulthood — not as crisis but as invitation. Start impossibly small.',
      },
      practice: 'After your morning routine, before checking your phone, place a hand on your chest and ask: "What am I feeling right now?" Name it, even if the answer is "I don\'t know" or "nothing." That noticing IS the practice. Do it for seven days. You\'re building the most basic and most important emotional skill: awareness that feelings exist inside you.',
      oneThing: 'Getting closer starts with noticing what you feel — not what they need.',
      depth: 'pairwise',
      domains: ['foundation', 'navigation'],
      confidence: 'high',
    };
  }

  // Secure
  return {
    title: 'The Integrated Heart',
    subtitle: 'Your attachment × emotional intelligence',
    body: `Your secure attachment base pairs ${eqHigh ? 'beautifully' : 'well'} with your emotional intelligence. Security means you approach emotional information without the distortion of threat — you can read the room because you're not scanning for danger. In Polyvagal terms, your ventral vagal system stays online during emotional exchanges, giving you access to what Porges calls the "social engagement system" — the full bandwidth of human connection.\n\n${eqHigh ? 'Your high EQ means you have genuine skill at perceiving, managing, and using emotions in relationships. Combined with security, this gives you what EFT researchers describe as "accessible, responsive, and engaged" — the gold standard of intimate partnership. You can be present with difficult emotions without either merging with them (anxious fusion) or running from them (avoidant deactivation). In Jungian terms, you carry the archetype of the Healer — not because you fix, but because your presence itself creates the conditions for others to feel safe enough to feel.' : 'Your EQ is still developing, which means there\'s room to deepen the emotional skills that your secure base makes available. As Khalil Gibran wrote, "Your pain is the breaking of the shell that encloses your understanding." Security gives you the shell; developing EQ cracks it open — not with trauma but with curiosity.'}\n\n${eqHigh ? 'As Pema Chödrön wrote, "Compassion is not a relationship between the healer and the wounded. It\'s a relationship between equals." Your combination of security and emotional intelligence positions you not above others in their struggles, but alongside them — able to witness without rescuing, to feel without drowning.' : 'In developmental terms, your secure base is what Kegan would call the ideal "holding environment" for your own growth. You have the rarest commodity in emotional development: safety to fail, to try, to feel awkwardly and imperfectly without the floor dropping out.'}`,
    arc: {
      protection: 'You were fortunate to develop in relationships where emotional closeness was mostly safe — what attachment researchers call "earned" or "continuous" security. Your protection isn\'t a wall — it\'s what Gottman calls a "flexible boundary" that opens and closes based on actual conditions rather than projected threat. In IFS terms, your Self leads rather than your Managers or Firefighters.',
      cost: eqHigh
        ? 'The cost is subtle but real: you may carry what therapists call "empathy blindness" — difficulty fully appreciating how your security feels to others. Your partner\'s anxiety or avoidance may seem like something they should simply "get over," because from your nervous system\'s perspective, closeness has always been safe. This gap in understanding can create its own form of loneliness for a less secure partner.'
        : 'With developing EQ, you may sometimes miss emotional nuances that partners are broadcasting — what Gottman calls "missed bids for connection." Not because you\'re defending, but because the perceptual skill is still growing. Your security means the misses don\'t destabilize you, but they may slowly erode your partner\'s willingness to bid.',
      emergence: eqHigh
        ? 'What wants to emerge is what Kegan\'s Fifth Order describes: the Self-Transforming mind that can hold multiple emotional realities simultaneously. You can model emotional engagement for a partner who struggles with it — not as teacher, but as what Winnicott called "good enough" presence. Your security becomes a relational commons.'
        : 'What wants to emerge is the full use of your secure base as a learning platform — what developmental psychologists call "the secure base effect." Security gives you the safest possible conditions to grow emotional skill. Use this gift deliberately.',
    },
    practice: eqHigh
      ? 'This week, after your partner shares something difficult, resist the urge to solve or reassure. Instead, sit with them in it for a full two minutes of shared silence. Let your security be a gift of presence, not problem-solving. Say: "I\'m here. You don\'t have to be okay right now."'
      : 'Each evening before bed, pick one emotional skill to practice for 60 seconds: noticing emotions in others, naming your own feelings, or sitting with discomfort without fixing it. Your security makes practice safer than it is for anyone else — use that advantage.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['foundation', 'navigation'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 2: Attachment × Conflict (foundation × conflict)
// ═══════════════════════════════════════════════════════

register('foundation', 'conflict', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const style = getConflictStyle(s);

  if (anxious && (style === 'yielding' || style === 'compromising')) {
    return {
      title: 'The Peace at Any Price',
      subtitle: 'Your attachment × conflict style',
      body: `Your attachment anxiety (${getAnxiety(s).toFixed(1)}/7) meets a yielding/compromising conflict style. This makes perfect developmental sense: when connection feels fragile, disagreement feels dangerous. You've learned to give ground quickly — not because you don't have a position, but because having a position feels like it might cost you the relationship. In IFS terms, your People-Pleaser Manager part has struck a deal with your Exile: "I'll keep the peace so you never have to feel abandoned again."\n\nThe tragedy is that your yielding isn't generosity — it's fear wearing a generous mask. In Schema Therapy, this is the Subjugation schema: the deep belief that your needs are less important than maintaining the relationship. And over time, the things you swallow don't disappear. They accumulate into what Gottman calls "absorbing state" — a reservoir of unspoken grievance that eventually erupts in ways that feel disproportionate to the current issue but are perfectly proportionate to the accumulated weight.\n\nAs bell hooks wrote in All About Love, "When we can see ourselves in truth we are able to nurture the growth of the self we want to become." The self you want to become has a voice. Not a loud one — not forcing, not demanding — but a clear, steady voice that says "this matters to me" without the ground shaking. In ACT terms, this is the shift from experiential avoidance (swallowing your truth to avoid the discomfort of potential rejection) to values-committed action (speaking your truth because authenticity is a value worth the discomfort).\n\nThe Jungian shadow at work here is the archetype of the Martyr — the one who sacrifices not from generosity but from terror, and whose sacrifice carries a hidden invoice that will eventually be presented. Your growth edge is what Bowen called "taking an I-position" — the developmental capacity to say what you think and feel while staying emotionally connected. This is not selfishness. It is the prerequisite for real intimacy.`,
      arc: {
        protection: 'Yielding in conflict preserved the connection — what your nervous system identified as the primary survival need. In Polyvagal terms, your system learned that confrontation triggers dorsal vagal shutdown in the other person (or in you), and that submission keeps the ventral vagal channel open. If you never push back, you never risk the devastating silence of disconnection. This strategy worked brilliantly in its original context.',
        cost: 'You lose yourself in the relationship — what Bowen called "emotional fusion" and what EFT describes as the "pursue-then-collapse" cycle. Your needs go unmet, your voice goes unheard, and the resentment builds underground like a root system that eventually cracks the foundation. Partners may also feel frustrated by the absence of a real "no" — paradoxically, they can\'t trust your "yes" because it\'s never been tested against disagreement.',
        emergence: 'What wants to emerge is what Kegan calls the transition from Socialized Mind (where your identity is authored by the relationship) to Self-Authoring Mind (where you can hold your own perspective while staying connected). Not aggression — just the quiet, grounded confidence that your needs matter as much as the connection. In Erikson\'s terms, this is revisiting Intimacy vs. Isolation with a new truth: real intimacy requires two whole people, not one whole person and one echo.',
      },
      practice: 'This week, after your first meal together, find one small thing you\'d normally yield on and hold your position. It should be low-stakes: what to eat, what to watch, how to spend an hour. Say: "Actually, I\'d prefer ___." Notice how it feels in your body to not immediately give in. That discomfort is not danger — it\'s your nervous system learning that disagreement and disconnection are different things.',
      oneThing: 'Your relationships need your voice, not just your accommodation. The love you\'re protecting can hold more than you think.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
    };
  }

  if (anxious && (style === 'forcing' || style === 'problemSolving')) {
    return {
      title: 'The Urgent Fixer',
      subtitle: 'Your attachment × conflict style',
      body: `Your anxiety (${getAnxiety(s).toFixed(1)}/7) drives urgency, and your ${style === 'forcing' ? 'forcing' : 'problem-solving'} style channels that urgency into action. When conflict arises, you don't just want resolution — you need it now. The distance that disagreement creates feels intolerable, so you push hard toward closure. In Polyvagal terms, your sympathetic nervous system fires into mobilization — not fight exactly, but an urgent, almost frantic need to DO something to restore connection. In IFS, this is a Firefighter part that extinguishes the unbearable feeling of disconnection by forcing resolution before the heat can be felt.\n\nThe irony is that your push for quick resolution often prevents real resolution. What Gottman calls "repair attempts" work only when both partners feel heard first. Your partner feels steamrolled or over-managed, and the surface agreement you achieve doesn't address the underlying tension. In EFT terms, you're trying to skip the "withdrawal" and "re-engagement" stages and jump straight to "bonding" — but the shortcut doesn't actually get you there.\n\nAs Pema Chödrön wrote, "The most difficult times for many of us are the ones we give ourselves." Your urgency creates exactly the pressure that makes your partner pull back, which increases your urgency — the pursue-withdraw cycle that EFT researchers have documented as the most common destructive pattern in couples. The archetype here is the Rescuer — not from the Jungian tradition but from the Karpman Drama Triangle: the one who solves to avoid feeling helpless. But the helplessness your system is running from is actually the doorway to deeper intimacy.\n\nIn ACT terms, the willingness to sit with the discomfort of unresolved tension — what ACT calls "creative hopelessness" followed by "acceptance" — is the very capacity that transforms conflict from a threat into a deepening. Your attachment system reads the pause as danger. But the pause is where trust is actually built.`,
      arc: {
        protection: 'Moving fast in conflict meant moving past the danger zone quickly. In attachment terms, this is hyperactivation channeled through action — if you could solve it or force it closed, you wouldn\'t have to sit in the excruciating uncertainty of disconnection. Your nervous system learned that unresolved conflict = imminent abandonment, so resolution became an emergency rather than a process.',
        cost: 'Your partner feels controlled rather than heard — what Schema Therapy calls triggering their Punitive Parent or Overcontroller mode in response to your urgency. The "solutions" often serve your anxiety more than the actual problem. Real intimacy requires what DBT calls "distress tolerance" — the ability to sit in unresolved tension without your system treating it as a five-alarm fire.',
        emergence: 'What wants to emerge is what Kegan describes as the Fourth Order capacity to "hold" conflict rather than be "held by" it. Not passivity — engaged patience. The developmental leap from Erikson\'s Identity stage ("I must control this") to the Intimacy stage ("we can hold this together"). Trusting that the relationship can survive the gap between the problem and the solution.',
      },
      practice: 'Next time a disagreement starts, set a timer on your phone for 5 minutes. During those 5 minutes, your only job is to listen. No solutions, no positions, no rebuttals. When the timer goes off, say what you heard before saying what you think. Start with: "What I\'m hearing is..." This week: do this once. Just once. Notice what happens in your body during the wait.',
      oneThing: 'The relationship can survive the pause between the problem and the solution. That pause is where trust lives.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
    };
  }

  if (avoidant && (style === 'avoiding' || style === 'yielding')) {
    return {
      title: 'The Vanishing Act',
      subtitle: 'Your attachment × conflict style',
      body: `Your avoidant attachment (${getAvoidance(s).toFixed(1)}/7) pairs with a conflict-avoiding tendency, creating a double withdrawal pattern. When tension rises, everything in you says: leave. Not dramatically — just quietly. Change the subject, agree to end it, go do something else. In Jungian terms, you enact the archetype of the Ghost — present in body, absent in engagement, haunting the relationship with what you won't say.\n\nThis isn't laziness or not caring. Your nervous system learned that conflict = emotional overwhelm, and withdrawal = safety. In Polyvagal terms, this is the dorsal vagal "freeze" response recruited as a relational strategy — your system learned that shutting down was safer than fighting or feeling. The avoidant attachment and conflict avoidance reinforce each other in what systems therapists call a "positive feedback loop" (positive in the systems sense, meaning it amplifies): avoidance confirms that distance is safe, which strengthens avoidance, which confirms distance.\n\nAs David Whyte wrote, "The price of our vitality is the sum of all our fears." Each withdrawal preserves your calm but costs you a small piece of relational aliveness. In EFT terms, your partner's experience of this pattern is "I can't reach you" — the primal panic of Sue Johnson's "Are you there for me?" question being answered with silence. In Gottman's research, stonewalling (which your pattern resembles, even though it doesn't feel like stonewalling to you) is one of the Four Horsemen — a predictor of relational decline not because it's hostile but because it's absent.\n\nThe IFS perspective offers compassion here: your Protector part learned that leaving was the only option when staying meant feeling things your system couldn't handle. But the Self underneath that Protector is capable of staying. The question isn't whether you CAN stay — it's whether you can let yourself discover that staying doesn't destroy you.`,
      arc: {
        protection: 'Double withdrawal created a firewall between you and emotional intensity — what attachment researchers call "compulsive self-reliance" meeting "conflict-avoidant coping." If you never engage with the conflict, you never have to feel the overwhelm your nervous system associates with emotional confrontation. This was adaptive: in your early relational world, engagement may have meant chaos, criticism, or engulfment.',
        cost: 'Your partner carries all the emotional labor — what Gottman calls the "pursuer" role, where they must generate all the relational energy while you absorb none of the relational friction. Issues pile up unaddressed. The relationship slowly hollows out — not with a bang, but with what therapists call "the long, slow death of a thousand quiet retreats." Your partner doesn\'t leave because of one withdrawal. They leave because of the accumulated weight of never being met.',
        emergence: 'What wants to emerge is what Kegan calls the shift from being "subject to" your withdrawal pattern to "having" it as something you can observe and choose about. The developmental invitation is Erikson\'s Intimacy stage: the capacity to stay present with another person even when your system says it\'s dangerous. Not forever. Just five minutes longer than your instinct tells you. That\'s where the growth lives.',
      },
      practice: 'When you notice the pull to withdraw from a conversation, try this script: "I\'m noticing I want to pull back. I\'m going to stay for two more minutes." Then stay. Set a timer if you need to. Two minutes. When the timer ends, you can leave — but tell them: "I need a break. I\'ll come back in 20 minutes." Then actually come back. This week: do this once.',
      oneThing: 'Staying for one more minute is the bravest thing your pattern can do. Start there.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
    };
  }

  if (avoidant && (style === 'forcing' || style === 'problemSolving')) {
    return {
      title: 'The Efficient Resolver',
      subtitle: 'Your attachment × conflict style',
      body: `An interesting combination: avoidant attachment (${getAvoidance(s).toFixed(1)}/7) with a ${style === 'forcing' ? 'forcing' : 'problem-solving'} conflict approach. You don't run from conflict — you run THROUGH it. Quickly, efficiently, with minimal emotional messiness. Get to the solution, move on, return to comfortable distance. In Jungian terms, you embody the Strategist archetype — masterful at resolving the external problem while the inner landscape goes untended.\n\nThis works beautifully at work. In intimate relationships, it can feel to your partner like you're solving a problem they wanted to be heard about. In EFT terms, what Sue Johnson calls "the emotional music" of the conflict — the hurt, the fear, the longing underneath — gets skipped entirely. You solve the lyrics while ignoring the melody. In IFS language, your Manager part has co-opted your problem-solving intelligence to serve avoidance: "If I fix the problem fast enough, I never have to feel what it stirred up."\n\nAs James Hillman wrote, "The soul requires duration." Your efficiency is the enemy of the soul's need to be felt, witnessed, and held. Gottman's research shows that 69% of relationship conflicts are "perpetual" — they're not solvable because they're not really problems. They're expressions of fundamental differences that need ongoing dialogue, not resolution. Your system treats every conflict as a solvable problem because unsolvable tension is intolerable to your avoidant attachment.\n\nThe Schema Therapy lens reveals what's underneath: the Emotionally Deprived Child who learned that feelings wouldn't be met, so problems became the only currency of connection. If you can't be loved for your vulnerability, at least you can be valued for your competence. But your partner isn't hiring a consultant. They're looking for a companion.`,
      arc: {
        protection: 'Quick, logical conflict resolution meant you never had to sit in emotional discomfort — what Polyvagal theory describes as sympathetic arousal without ventral vagal co-regulation. Getting to a solution fast was a sophisticated form of emotional escape. Your competence became your armor: the more efficiently you resolve, the less you feel.',
        cost: 'Your partner feels managed rather than met — what EFT calls "instrumental responding" vs. "emotional responding." The emotional layer of the conflict — the part that matters most in intimacy — gets bypassed entirely. Over time, they stop bringing emotions at all and just bring problems, because that\'s the only language you\'ll receive. The relationship becomes functional but hollow.',
        emergence: 'What wants to emerge is what Kegan calls the Self-Transforming capacity: letting a conflict be about feelings before it\'s about solutions. To hear "I\'m hurt" without immediately jumping to "here\'s how we fix it" is to move from Erikson\'s Industry stage (competence-driven) back to the Intimacy stage (vulnerability-driven). The developmental leap isn\'t adding a skill — it\'s surrendering one.',
      },
      practice: 'Next conflict: before offering any solution, ask "Do you need me to listen or help solve?" If they say listen — set a timer for 5 minutes and just listen. No solutions, no suggestions, no reframing. When the timer ends, say: "Thank you for telling me that." Resist the problem-solving reflex for the entire conversation. Notice what it costs you — that cost is the feeling your system has been avoiding.',
      oneThing: 'Sometimes the solution your partner needs is your presence, not your fix. Staying in the mess IS the repair.',
      depth: 'pairwise',
      domains: ['foundation', 'conflict'],
      confidence: 'high',
    };
  }

  // Secure + any conflict style
  return {
    title: 'The Grounded Engager',
    subtitle: 'Your attachment × conflict style',
    body: `Your secure base gives you something rare in conflict: the ability to disagree without it threatening the foundation of the relationship. Your ${style} conflict style operates from a place of relative safety — you don't fight to preserve the connection or to control the distance. In Polyvagal terms, your ventral vagal system stays online during disagreement, which means your social engagement circuitry — eye contact, prosody, facial expressiveness — remains available even under stress. This is what Gottman calls "physiological soothing" from the inside out.\n\n${style === 'problemSolving' ? 'Your problem-solving approach is genuine rather than anxiety-driven. You actually want to find the best outcome, not just the fastest exit from tension. In EFT terms, you can stay in what Sue Johnson calls "the raw spots" long enough to actually process them, rather than reflexively solving to escape discomfort.' : style === 'compromising' ? 'Your compromising style comes from genuine flexibility rather than fear. You give ground because it makes sense, not because you\'re afraid to stand. In IFS terms, your Self leads in conflict rather than your Protectors — a rare and genuinely integrative capacity.' : 'Even your ' + style + ' tendencies operate differently from a secure base — they\'re choices rather than compulsions. What for an anxious person would be survival strategy is for you a considered approach.'}\n\nAs Khalil Gibran wrote in The Prophet, "Let there be spaces in your togetherness, and let the winds of the heavens dance between you." Your security allows you to hold both the togetherness of engagement and the space of disagreement without either one annihilating the other. This is the archetype of the Sovereign — not ruling over conflict, but holding the space in which conflict can occur safely.`,
    arc: {
      protection: 'Security didn\'t require elaborate conflict strategies. What attachment researchers call "earned security" or "continuous security" gave you an implicit trust that the relationship could hold tension without shattering. You could engage because the foundation felt durable — not because you\'d tested it to destruction, but because it never needed testing.',
      cost: 'You may carry what therapists call "security privilege" — underestimating how disorienting conflict is for less secure partners. Your "just talk about it" expectation may not match their nervous system reality. What feels like a simple conversation to your ventral vagal system feels like a survival threat to their sympathetic or dorsal vagal activation. Bridging this gap requires not just security but active compassion.',
      emergence: 'What wants to emerge is what Kegan\'s Fifth Order (Self-Transforming) looks like in conflict: not just holding your own ground, but genuinely holding the ground for both of you. Your natural ability to model that engagement is safe becomes a relational gift — what Winnicott called "creating a holding environment" where your partner can gradually discover that conflict doesn\'t mean catastrophe.',
    },
    practice: 'This week, in the middle of a disagreement, pause and check in with your partner\'s experience of the conflict itself — not just the topic. Say: "I want to pause the content for a second. How are you feeling about us right now? Are we okay?" Let them know the relationship is safe even in the tension. Then return to the topic. This one move can transform conflict for an insecure partner.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['foundation', 'conflict'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 3: Attachment × Differentiation (foundation × stance)
// ═══════════════════════════════════════════════════════

register('foundation', 'stance', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const diffHigh = getDSITotal(s) >= 60;
  const fusionLow = getFusion(s) < 50;
  const iPositionLow = getIPosition(s) < 50;

  if (anxious && fusionLow) {
    return {
      title: 'The Loving Merger',
      subtitle: 'Your attachment × differentiation',
      body: `Your attachment anxiety (${getAnxiety(s).toFixed(1)}/7) pairs with high fusion (low boundary clarity: ${Math.round(getFusion(s))}). This means you don't just want closeness — you tend to merge. Your partner's feelings become your feelings. Their mood becomes your weather. When they're upset, you're upset. When they're distant, you're lost. In ecopsychological terms, you are like a river without banks — all flow, no form. The water is real and alive, but without boundaries it becomes a flood that erodes everything it touches, including the very landscape that could hold it.\n\nThis merger isn't weakness — it was brilliant adaptation. In early relationships where you had to track the other person's state to stay safe, losing the boundary between their experience and yours was necessary. In IFS terms, you developed what Richard Schwartz calls "enmeshment" — your internal system learned to use the other person's emotional state as its primary reference point. In Schema Therapy, this is the Enmeshment/Undeveloped Self schema: the deep belief that you cannot exist as a complete person without merging with another.\n\nAs Kahlil Gibran wrote, "Let there be spaces in your togetherness... for the pillars of the temple stand apart." Your temple has no pillars — it's all roof and no foundation, all connection and no structure. The Jungian archetype at work is the Lover in its shadow form: so devoted to union that it sacrifices the individuation process that would make true union possible. Bowen's concept of "emotional fusion" describes this precisely: when differentiation is low, closeness becomes a losing-oneself rather than a sharing-of-selves.\n\nThe paradox that developmental psychology reveals is this: true intimacy requires two differentiated selves. What feels like the deepest love — the merger, the "we are one" — is actually the enemy of deep love. Erikson's Intimacy stage presupposes a resolved Identity stage. You're trying to build intimacy on an unfinished foundation of selfhood. The good news: you can build both at once. You just have to build the self INSIDE the relationship, not instead of it.`,
      arc: {
        protection: 'Merging dissolved the space where abandonment could happen — a strategy so elegant it\'s almost invisible. If there\'s no boundary between you and them, they can\'t leave without taking you along. In Polyvagal terms, your nervous system achieved co-regulation by eliminating the "co" — becoming a single fused system rather than two systems in dialogue. This was survival, not pathology.',
        cost: 'You lose yourself — what Bowen called "de-selfing." Your partner feels responsible for your emotional state and begins to experience your closeness as pressure rather than warmth. What EFT describes as the "anxiety-driven pursuit" becomes suffocating because there\'s no "you" pursuing — just a need-state looking for a host. The relationship becomes a pressure cooker of shared reactivity with no one holding steady ground.',
        emergence: 'What wants to emerge is what Kegan calls the transition from the Socialized Mind (Third Order) to the Self-Authoring Mind (Fourth Order) — the capacity to feel deeply connected while maintaining a clear "I" inside the "we." In Bowen\'s language, this is the lifelong project of differentiation: not distance, but distinction. Not less love, but love with a self inside it.',
      },
      practice: 'When you notice your mood shifting to match your partner\'s — and this will happen daily — pause. Place a hand on your own chest and say internally: "That\'s their feeling. What am I actually feeling right now?" Even if the answer is "I don\'t know" or "the same thing but for different reasons," the act of asking creates the micro-boundary that fusion dissolves. Do this three times this week. The goal isn\'t distance — it\'s distinction.',
      oneThing: 'You can love someone completely without becoming them. The space between is where real intimacy lives.',
      depth: 'pairwise',
      domains: ['foundation', 'stance'],
      confidence: 'high',
    };
  }

  if (anxious && diffHigh) {
    return {
      title: 'The Aware Reacher',
      subtitle: 'Your attachment × differentiation',
      body: `You have an interesting combination: attachment anxiety (${getAnxiety(s).toFixed(1)}/7) with relatively strong differentiation (${Math.round(getDSITotal(s))}). This means you feel the pull toward connection intensely, but you also have the capacity to hold onto yourself while you feel it. You can NOTICE the anxiety without it running the show. In IFS terms, your Self has enough presence to observe the Exile's panic without being blended with it — a rare and hard-won capacity.\n\nThis is actually a powerful position for growth. Many people with attachment anxiety are so fused that they can't see the pattern — they ARE the pattern. You can see it, which means you can work with it. In ACT terms, you have "cognitive defusion" available: the ability to notice the thought "they're leaving me" as a thought rather than as reality. In Jungian language, you carry the archetype of the Conscious Lover — one who feels the pull of eros (connection) but has developed enough ego-strength to hold it rather than be consumed by it.\n\nAs Rumi wrote, "The wound is the place where the Light enters you." Your attachment wound is real — the anxiety, the pull, the fear of loss. But your differentiation means the wound has become a window rather than a whirlpool. You can see into it, learn from it, even use it as a source of compassion and depth. This is what attachment researchers call "earned security in progress" — not the absence of anxiety, but the presence of a self that can hold anxiety without acting from it.\n\nIn Polyvagal terms, your ventral vagal system has enough tone to maintain social engagement even when your sympathetic system is firing attachment alarms. This gives you a choice-point that most anxiously attached people don't experience — the moment between impulse and action where a different future becomes possible.`,
      arc: {
        protection: 'Your anxiety developed in one relational context; your differentiation developed in another — perhaps through education, therapy, or a relationship that was different from the original template. The anxiety is your alarm system; differentiation is your observer. In Bowen\'s framework, you\'ve developed what he called "a self" even though your attachment system still carries the original wound. These two parts don\'t always agree, and that disagreement is actually productive tension.',
        cost: 'You may experience what DBT calls "apparent competence" — looking more regulated than you feel. The internal conflict between the pull to pursue and the awareness that pursuing won\'t help can create paralysis, self-criticism, or a painful gap between knowing better and doing better. Your differentiation can become its own Critic, judging the anxiety rather than holding it with compassion.',
        emergence: 'What wants to emerge is integration — what Kegan\'s Fourth Order makes possible: using your differentiation not to suppress your attachment energy but to channel it into genuine connection rather than anxious pursuit. This is the shift from "I see my pattern and I judge it" to "I see my pattern and I choose what to do with its energy." In Erikson\'s terms, this is Identity and Intimacy working together rather than at cross-purposes.',
      },
      practice: 'When attachment anxiety activates this week, use your differentiation as a container rather than a critic. Say to yourself: "I notice my system wanting to reach. This is my attachment alarm, not an emergency. I\'m going to let this feeling be here without acting on it for 10 minutes." Set a timer. When it ends, check in: "What does the situation actually need right now — my anxiety\'s response, or my considered response?" Choose the latter. Do this once this week.',
      oneThing: 'You already see the pattern. Now trust yourself to choose differently inside it — not against it, but through it.',
      depth: 'pairwise',
      domains: ['foundation', 'stance'],
      confidence: 'high',
    };
  }

  if (avoidant && diffHigh) {
    return {
      title: 'The Fortified Self',
      subtitle: 'Your attachment × differentiation',
      body: `Your avoidance (${getAvoidance(s).toFixed(1)}/7) combines with strong differentiation (${Math.round(getDSITotal(s))}), creating an exceptionally self-contained person. You know who you are, you hold your ground, and you don't easily get pulled into other people's emotional weather. This looks like strength — and in many ways, it is. In Jungian terms, you have a well-developed ego container. The question is whether the container has become a fortress — the archetype of the Armored King, sovereign and untouchable, ruling a kingdom no one can enter.\n\nBut there's a question worth sitting with: is your differentiation genuine self-clarity, or is it avoidance wearing the costume of maturity? Bowen made a crucial distinction between "pseudo-differentiation" (rigid distance that mimics self-definition) and "genuine differentiation" (flexible self-clarity that includes the capacity for emotional closeness). True differentiation includes the ability to stay connected under pressure. If "knowing yourself" always means staying separate, it might be serving distance more than clarity.\n\nAs Wendell Berry wrote, "It is not from ourselves that we learn to be better than we are." Your strength has been built in solitude, but the next level of growth requires what you've been avoiding: letting another person's reality genuinely touch and change yours. In Polyvagal terms, your system is beautifully regulated — but it's self-regulated rather than co-regulated. The developmental edge is learning that co-regulation isn't a weakness but a biological capacity you've been declining to use.\n\nIn Schema Therapy, this pattern often reflects the Emotional Inhibition schema — the belief that letting go of control, even briefly, would result in something catastrophic. IFS would say your Manager parts have built an excellent system, but they've built it at the expense of the Exile who longs for the very connection the Managers are defending against. The Exile is still there. It just doesn't have permission to speak.`,
      arc: {
        protection: 'High differentiation + avoidance created what looks like an impenetrable self — what attachment researchers call "compulsive self-reliance elevated to identity." No one could pull you into their chaos, because you were always clearly, firmly, resolutely "you." This protected you from the vulnerability that early relationships taught you was dangerous.',
        cost: 'You may be differentiated FROM others rather than differentiated IN relationship — what Bowen called the crucial difference. Your partner experiences your self-containment not as strength but as a wall they can\'t climb. The test Bowen proposed is devastating in its simplicity: can you hold your ground AND let someone in? If holding ground always means holding them out, your differentiation is serving avoidance, not selfhood.',
        emergence: 'What wants to emerge is what Kegan calls the Self-Transforming Mind (Fifth Order) — differentiation that softens without dissolving. Self-clarity that doesn\'t require distance. This is Erikson\'s Generativity stage: the capacity to let another person\'s experience genuinely affect yours without losing your center. Knowing who you are while letting another person\'s experience touch you.',
      },
      practice: 'This week, deliberately let your partner influence you on one decision — a restaurant choice, a weekend plan, a way of doing something. When you notice resistance (and you will), say internally: "Letting their input change my mind is not fusion. It\'s flexibility." Notice how it feels in your body. That sensation — the slight loosening of control — is the edge where real differentiation begins.',
      oneThing: 'True strength includes the ability to be moved. The fortress protects, but it also imprisons.',
      depth: 'pairwise',
      domains: ['foundation', 'stance'],
      confidence: 'high',
    };
  }

  if (avoidant && !diffHigh) {
    return {
      title: 'The Reactive Retreater',
      subtitle: 'Your attachment × differentiation',
      body: `Your avoidance (${getAvoidance(s).toFixed(1)}/7) paired with lower differentiation (${Math.round(getDSITotal(s))}) reveals something important: your distance isn't chosen from a place of clarity — it's reactive. You pull away not because you have a clear sense of self, but because closeness overwhelms you before you can find yourself in it. In ecopsychological terms, you're like a young tree in a windstorm — without deep roots (differentiation), the only option when the wind picks up (intimacy) is to bend away or break.\n\nThis is often confused with being "independent." But Bowen's differentiation theory makes a crucial distinction: there is a world of difference between chosen solitude (which comes from a solid self) and reactive distance (which comes from an overwhelmed one). What you may be experiencing is what Schema Therapy calls the Detached Protector mode — emotional overwhelm disguised as self-sufficiency. In IFS terms, your system exiled the Vulnerable Child so thoroughly that even you have forgotten it exists, and your Protectors now run a solitary operation that feels like personality but is actually strategy.\n\nAs John O'Donohue wrote, "A threshold is not a simple boundary; it is a frontier that divides two different territories, rhythms, and atmospheres." You stand at a threshold between isolation and intimacy, but without the differentiated self to hold you steady, crossing it feels like stepping into a river that will sweep you away. In Polyvagal terms, closeness triggers a rapid shift from ventral vagal to dorsal vagal — from social engagement to shutdown — because your system doesn't have the middle gear (sympathetic mobilization channeled into connection) that differentiation provides.\n\nThe hopeful news, supported by Gottman's research on "turning toward," is that selfhood and closeness can be built simultaneously — tiny acts of staying present, followed by tiny acts of self-definition, creating the spiral of growth that Bowen described. You don't have to be fully formed before you can love. But you do have to start knowing who's showing up.`,
      arc: {
        protection: 'Retreat looked like self-reliance but was actually protection from what DBT calls "emotional dysregulation" — without strong differentiation, closeness felt like losing yourself. Your nervous system correctly identified that you didn\'t yet have the internal structure to maintain a "you" inside a "we," so it chose the safest option: avoid the "we" entirely.',
        cost: 'You get lonely in your own retreat — what Erikson identified as the cost of choosing Isolation over Intimacy. Partners feel shut out and eventually stop knocking. And the distance doesn\'t actually build the self-clarity you need — it just postpones the overwhelm to the next time someone gets close. The fortress becomes a prison.',
        emergence: 'What wants to emerge is what Kegan calls the transition from Third Order (where you need external definition) to Fourth Order (where you can define yourself from within). Not closeness first — selfhood first. From a clearer "I," closeness becomes less threatening. This is Bowen\'s prescription exactly: build differentiation, and the capacity for healthy attachment naturally follows.',
      },
      practice: 'Before you withdraw from emotional intensity this week, pause and ask: "Am I choosing space, or am I being pushed by overwhelm?" If overwhelm, try saying: "I need ten minutes — I\'m coming back at [specific time]." Set an alarm. Then actually come back. The coming-back IS the differentiation practice — it proves to your system that closeness can be temporary without being permanent.',
      oneThing: 'Build the self first. Closeness will feel less dangerous when you know who\'s showing up.',
      depth: 'pairwise',
      domains: ['foundation', 'stance'],
      confidence: 'high',
    };
  }

  // Secure
  return {
    title: 'The Rooted Partner',
    subtitle: 'Your attachment × differentiation',
    body: `Security (${getAttachmentStyle(s)}) paired with ${diffHigh ? 'strong' : 'developing'} differentiation creates a solid relational foundation. You can be close without losing yourself, and you can hold your ground without it threatening the connection. In Bowen's language, this is the ideal: a well-differentiated self operating from a secure attachment base. In Jungian terms, you embody the archetype of the Sacred Marriage (hieros gamos) — the inner union of connection and individuality that makes outer union possible.${!diffHigh ? '\n\nYour differentiation is still growing, which means there\'s room to develop an even clearer sense of self within your relationships. As Rilke wrote, "For one human being to love another: that is perhaps the most difficult of all our tasks, the ultimate, the last test and proof, the work for which all other work is mere preparation." Your secure base gives you the safest possible conditions for this work.' : '\n\nAs Pema Chödrön observed, "The truth you believe in and cling to makes you unavailable to hear anything new." Your combination of security and differentiation gives you the rare ability to hold your truth loosely enough to be changed by your partner without losing yourself. This is what Kegan\'s Fifth Order (Self-Transforming) looks like in daily life — not an abstract theory but the lived experience of being simultaneously firm and permeable.'}\n\nIn Polyvagal terms, your ventral vagal tone provides the physiological foundation for what Gottman calls "turning toward" — your nervous system stays in social engagement even when intimacy asks you to stretch. In EFT terms, you can access the "bonding" stage of the Tango without needing to pass through the crisis of withdrawal and re-engagement that insecure partners require.`,
    arc: {
      protection: 'A secure base naturally supports healthy differentiation — what attachment researchers call "the secure base effect." You didn\'t need elaborate defenses because closeness wasn\'t threatening. Your protection isn\'t a wall or a strategy — it\'s a flexible, breathing boundary that Winnicott would recognize as the hallmark of a "true self."',
      cost: diffHigh ? 'You may carry what therapists call "security privilege" — taking for granted how hard this balance is for others. Your ease with the closeness-autonomy dance can inadvertently make partners feel inadequate, as though they should be able to do what comes naturally to you.' : 'With developing differentiation, you may occasionally slip into what Bowen called "emotional fusion" without realizing it — losing yourself in a partner\'s needs and mistaking accommodation for generosity. Your security makes this less painful but not less real.',
      emergence: diffHigh
        ? 'In Erikson\'s framework, you\'ve resolved both Identity and Intimacy and are entering the Generativity stage — the invitation to model for others what it looks like to be both deeply connected and fully self-defined. Your presence in a relationship can be a healing environment for a less secure partner.'
        : 'Continue building self-clarity. In Kegan\'s terms, your secure base is the ideal "holding environment" for the transition to Fourth Order (Self-Authoring). Security gives you the safest possible platform to grow — use it deliberately.',
    },
    practice: diffHigh
      ? 'This week, notice one moment where your partner struggles with the balance of closeness and self. Instead of solving it, simply name what you see with warmth: "It looks like you\'re torn between wanting space and wanting connection. Both are okay." Offer your stability as a gift, not a correction.'
      : 'Identify one area where you tend to defer to your partner\'s preferences without even noticing. This week, practice holding your own position — gently, without making it a conflict. Say: "I actually prefer ___." The goal is to notice how easy it is to disappear when the stakes are low.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['foundation', 'stance'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 4: EQ × Differentiation (navigation × stance)
// ═══════════════════════════════════════════════════════

register('navigation', 'stance', (s) => {
  const eqHigh = getEQTotal(s) >= 65;
  const diffHigh = getDSITotal(s) >= 60;
  const fusionScore = getFusion(s);
  const reactivity = getReactivity(s);

  if (eqHigh && !diffHigh) {
    return {
      title: 'The Empathic Sponge',
      subtitle: 'Your EQ × differentiation',
      body: `You have strong emotional perception (EQ: ${Math.round(getEQTotal(s))}) but your differentiation is still developing (${Math.round(getDSITotal(s))}). This means you read the room brilliantly — but you absorb what you read. Other people's emotions become your emotions. You can tell exactly what your partner is feeling, and then you're feeling it too. In ecopsychological terms, you are a wetland without a watershed boundary — every emotional river in the landscape flows into you, and you have no way to filter what comes in or let what needs to drain away.\n\nThis is exhausting. Your emotional intelligence has no filter, no boundary that lets you perceive without merging. In IFS terms, your Caretaker Manager uses your EQ to scan and absorb, but your Self doesn't have enough differentiation to say "that's theirs, this is mine." In Schema Therapy, this pattern often reflects an Enmeshment schema paired with genuine emotional giftedness — you really CAN read people, which makes the boundary problem worse, not better, because the readings are so accurate that they feel like your own experience.\n\nAs Rumi wrote, "Don't be satisfied with stories, how things have gone with others. Unfold your own myth." Your myth has been to live through others' emotional realities — to be the mirror so polished that it reflects everything and holds nothing of its own. The Jungian archetype here is the Empath in shadow: the one whose gift of perception has become a curse because it operates without the container of selfhood.\n\nThe good news from neuroscience is that empathy and self-other distinction are separate neural circuits. Research by Tania Singer shows that compassion training — which includes boundaries — actually activates different brain regions than empathic distress. You can keep your perceptive gift while building the neural pathways that say "I feel FOR you" rather than "I feel AS you." This is Bowen's differentiation project with a neuroscience roadmap.`,
      arc: {
        protection: 'Absorbing others\' emotions was a survival strategy — what trauma researchers call "empathic attunement as hypervigilance." By feeling what they feel, you could predict and respond. In Polyvagal terms, you achieved co-regulation by merging nervous systems rather than by maintaining two distinct systems in dialogue. It kept you attuned and safe, at the cost of having no emotional home of your own.',
        cost: 'Emotional exhaustion — what compassion fatigue researchers call "empathic distress." Loss of self in the other\'s experience. Partners eventually sense you can\'t hold your own ground when emotions get intense, and paradoxically, this makes them feel less safe — because a partner without a self cannot be a stable anchor. Gottman\'s research shows that the ability to self-soothe is a prerequisite for effective co-regulation.',
        emergence: 'What wants to emerge is emotional perception WITH boundaries — what Kegan\'s Fourth Order makes possible. The ability to see what\'s happening in the other person without becoming it. Your EQ stays. The filter develops. In Erikson\'s terms, this is the Identity work that must accompany Intimacy: you cannot truly be with another until you are first with yourself.',
      },
      practice: 'Practice "compassionate witnessing" this week using a physical anchor: when your partner shares difficult emotions, place one hand on your own heart and the other on the arm of your chair. The hand on your heart says "I\'m here with you." The hand on the chair says "I\'m still me." Say: "I can see how hard that is for you" — notice the "for you." Those two words create the boundary. Do this three times this week.',
      oneThing: 'You can see what they feel without carrying it. Compassion has boundaries; absorption does not.',
      depth: 'pairwise',
      domains: ['navigation', 'stance'],
      confidence: 'high',
    };
  }

  if (!eqHigh && diffHigh) {
    return {
      title: 'The Boundaried Observer',
      subtitle: 'Your EQ × differentiation',
      body: `You hold your ground well (differentiation: ${Math.round(getDSITotal(s))}) but your emotional reading skills are still developing (EQ: ${Math.round(getEQTotal(s))}). This means you know who you are and don't easily get pulled — but you may miss the emotional signals that tell you what's happening in the other person. In Jungian terms, you've developed a strong ego container, but the Feeling function (in Jung's typology) remains less developed than your Thinking or Sensing functions.\n\nYour partner may experience you as "solid but hard to reach." You're stable, which they value deeply — in EFT terms, you're experienced as emotionally reliable but not emotionally accessible. Gottman would say your "turning toward" ratio may be lower than it needs to be, not from rejection but from genuine obliviousness to bids you haven't learned to detect. They wish you could see more of what they're going through without them having to spell it out.\n\nAs Mary Oliver wrote, "Attention is the beginning of devotion." Your differentiation is a form of devotion to selfhood — but devotion to relationship requires a different kind of attention: the patient, curious noticing of another person's inner world. In Polyvagal terms, you have excellent self-regulation but underdeveloped neuroception — the automatic detection of safety and danger cues in others' faces, voices, and postures.\n\nThe beautiful thing about your position is that developing EQ from a differentiated base is the safest possible growth path. You don't risk losing yourself (the danger for high-EQ, low-differentiation people). You simply open new channels of perception. In IFS terms, your Self is well-established — now it can safely invite the more vulnerable, emotionally attuned parts to come forward without fear of being overwhelmed.`,
      arc: {
        protection: 'Strong boundaries developed before strong emotional reading — what developmental psychologists might see as an emphasis on Kegan\'s Fourth Order (Self-Authoring) before the relational skills that Kegan\'s Fifth Order (Self-Transforming) requires. This kept you self-defined but potentially isolated from the emotional information that Gottman calls "the lifeblood of intimate relationships."',
        cost: 'Partners feel unseen — not rejected, but invisibly present. In EFT terms, they\'re sending "attachment bids" that go undetected. Your stability can feel like emotional unavailability when you miss their signals. Over time, they may stop signaling altogether — what Gottman calls "the relationship graveyard of missed bids."',
        emergence: 'Growing your emotional intelligence while maintaining your boundaries creates what Bowen described as the ideal: high differentiation WITH high emotional connection. In Erikson\'s framework, you\'ve accomplished Identity; now the Intimacy stage asks you to let that identity develop eyes and ears for the other. Someone who can read the room without being consumed by it.',
      },
      practice: 'Three times a day this week — after waking, after lunch, after dinner — look at your partner for ten seconds and ask yourself: "What might they be feeling right now?" Don\'t ask them, don\'t act on it — just practice perceiving. At the end of the week, check one of your guesses: "Earlier today you seemed ___. Was that right?" You\'re building the perceptual muscle your boundaries have been protecting you from needing.',
      oneThing: 'Your boundaries are strong. Now let them have windows. What you see through those windows will deepen every relationship you have.',
      depth: 'pairwise',
      domains: ['navigation', 'stance'],
      confidence: 'high',
    };
  }

  if (eqHigh && diffHigh) {
    return {
      title: 'The Centered Reader',
      subtitle: 'Your EQ × differentiation',
      body: `This is one of the most powerful combinations in relational life: high emotional intelligence (${Math.round(getEQTotal(s))}) paired with strong differentiation (${Math.round(getDSITotal(s))}). You can read the room AND hold yourself in what you read. You perceive without absorbing, connect without merging, respond without reacting. In Bowen's framework, this IS the goal of lifelong development — emotional awareness married to self-definition. In Jungian terms, you've achieved a measure of what Jung called individuation: the capacity to be fully yourself while remaining in deep relationship with others.\n\nThis is rare. Most people either read well and merge (high EQ, low differentiation — the empathic sponge), or hold themselves and miss signals (high differentiation, low EQ — the boundaried fortress). You do both. In Polyvagal terms, your ventral vagal system is both sensitive (perceiving) and regulated (holding), giving you what Deb Dana calls "the full range of the social engagement system." In IFS, your Self leads — not occasionally, but as a default state.\n\nAs Wendell Berry wrote, "The mind that is not baffled is not employed." Your combination of perception and groundedness means you can sit with bafflement — with the emotional complexity of intimate life — without either drowning in it or retreating from it. The question for you isn't about developing a skill. It's about stewardship: how you use this capacity in service of the people around you.\n\nThe shadow risk — and there is one — is what Pema Chödrön calls "idiot compassion": using your perception and stability to manage others rather than genuinely meet them. Your capacity can become a subtle form of control if you use it to stay one step ahead rather than one step alongside. The highest use of this combination is what Carl Rogers called "unconditional positive regard" — seeing clearly without agenda.`,
      arc: {
        protection: 'These two capacities may have developed independently — emotional intelligence through empathic exposure, differentiation through experiences that required self-definition. Together, they create what Gottman\'s research identifies as the strongest predictor of relationship satisfaction: the ability to be emotionally responsive without losing yourself in the response.',
        cost: 'Others may find your combination intimidating — what therapists sometimes call "the too-differentiated partner problem." You see clearly and aren\'t easily destabilized, which can make less differentiated partners feel exposed, inadequate, or perpetually "behind." Your groundedness, if not offered with genuine humility, can feel like superiority.',
        emergence: 'In Kegan\'s framework, you\'re positioned at the threshold of Fifth Order (Self-Transforming) — the developmental stage where you can hold multiple perspectives simultaneously without needing to resolve them. In Erikson\'s terms, you\'re ready for Generativity: using your capacity not just for your own relationships but to hold space for others\' growth. Use this combination generously.',
      },
      practice: 'This week, notice one moment where someone close to you is struggling with the balance of feeling and holding — overwhelmed by emotion or cut off from it. Offer your presence as a container — not advice, not fixing, just the experience of being with someone who can feel deeply and stay grounded. Say: "I\'m here. Take your time." That\'s all.',
      oneThing: null,
      depth: 'pairwise',
      domains: ['navigation', 'stance'],
      confidence: 'high',
    };
  }

  // Both developing
  return {
    title: 'The Growing Edge',
    subtitle: 'Your EQ × differentiation',
    body: `Both your emotional intelligence (${Math.round(getEQTotal(s))}) and differentiation (${Math.round(getDSITotal(s))}) are in development. This is actually a gift — you're building both skills at the same time, which means they can grow together rather than creating the imbalances that happen when one outpaces the other. In ecological terms, you're planting a forest rather than a single tree — slower to start, but the ecosystem that emerges will be far more resilient than any single towering capacity.\n\nThe simultaneous development of reading emotions AND holding yourself while you read them is the core of relational maturity. In Kegan's framework, you're in the transition zone between Third Order (Socialized Mind, defined by others) and Fourth Order (Self-Authoring Mind, defined from within) — a powerful but disorienting place to be. In IFS terms, your Self is emerging but the Managers still run many operations. In Polyvagal terms, your ventral vagal tone is building — each successful moment of emotional engagement strengthens the circuit.\n\nAs Rilke wrote to a young poet, "Be patient toward all that is unsolved in your heart and try to love the questions themselves." Your current position is full of unsolved questions — "What am I feeling?" "Why did I react that way?" "Where do I end and they begin?" — and each question, simply by being asked, builds the capacity to answer it. This is what DBT's Marsha Linehan meant by "building a life worth living": not arriving at perfection but developing the skills of emotional perception and self-definition that make genuine intimacy possible.\n\nThe research from Gottman's Love Lab is encouraging here: couples who grow together — even from a low baseline — show stronger long-term outcomes than couples who start skilled but stop developing. Your growing edge IS your strength, as long as you keep growing.`,
    arc: {
      protection: 'Neither skill developed far enough to become a crutch — which means neither became a defense. High-EQ people sometimes hide behind emotional perception; highly differentiated people sometimes hide behind boundaries. You\'re spared both of these traps, which keeps you genuinely flexible and open to growth.',
      cost: 'In intense moments, you may feel doubly overwhelmed — what DBT calls "emotional dysregulation" meeting what Bowen calls "reactive fusion." Unable to read what\'s happening clearly AND unable to hold yourself steady in it. This is genuinely hard. The compassionate response is not self-criticism but the recognition that you\'re building two essential skills simultaneously.',
      emergence: 'Small, consistent practice in both areas creates what developmental researchers call "scaffolded growth" — each skill supports the other in an ascending spiral. In Erikson\'s framework, you\'re doing the Identity work and the Intimacy work at the same time, which is harder but ultimately more integrated than doing them sequentially.',
    },
    practice: 'Start with a micro-practice three times daily — after each meal, take ten seconds. Ask: "What am I feeling right now?" (builds EQ). Then: "Is this feeling mine, or am I absorbing someone else\'s?" (builds differentiation). That\'s it — ten seconds, three times a day. By the end of the week, you\'ll have practiced 21 times. Each check-in builds two muscles simultaneously.',
    oneThing: 'Every small check-in builds two muscles at once. Start today. Start small. Start now.',
    depth: 'pairwise',
    domains: ['navigation', 'stance'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 5: Conflict × Values (conflict × compass)
// ═══════════════════════════════════════════════════════

register('conflict', 'compass', (s) => {
  const style = getConflictStyle(s);
  const topValues = getTopValues(s);
  const avgGap = getAvgValueGap(s);
  const biggestGap = getBiggestGapValue(s);
  const gapHigh = avgGap >= 3;

  const topValStr = topValues.slice(0, 3).join(', ');

  if ((style === 'yielding' || style === 'avoiding') && gapHigh) {
    return {
      title: 'The Silent Compromise',
      subtitle: 'Your conflict style × values',
      body: `You value ${topValStr} — but your ${style} conflict style means you rarely fight for what matters to you. The values-action gap (avg: ${avgGap.toFixed(1)}/10${biggestGap ? `, biggest: ${biggestGap.value} at ${biggestGap.gap}/10` : ''}) isn't just about daily habits. It's about what happens when living your values requires confrontation. In ACT terms, this is "experiential avoidance" at the values level: you know your direction, but the emotional cost of walking toward it — specifically, the conflict it would require — keeps you frozen in place.\n\nEvery time you yield or avoid to keep the peace, you're choosing the relationship over your values. That sounds noble — but in IFS terms, your People-Pleaser Manager has struck a deal with the Exile who holds your deepest convictions: "Stay quiet, and we won't get abandoned." Over time, this creates a person who doesn't recognize themselves. The resentment isn't about the argument you didn't have. It's about the self you didn't protect. In Schema Therapy, this is the Subjugation schema meeting the Self-Sacrifice schema — a double bind where both asserting yourself and staying silent feel equally dangerous.\n\nAs the poet David Whyte wrote, "The soul would rather fail at its own life than succeed at someone else's." Your values-action gap is the measure of how far you've traveled into someone else's life at the expense of your own. Each unspoken priority, each swallowed conviction, is a small death of authenticity that Gottman's research links directly to relationship erosion — not through conflict, but through the slow hemorrhage of contempt that builds when one partner perpetually disappears.\n\nThe Jungian archetype here is the Shadow — not as darkness, but as the unlived life. Your values are your unlived life, and they're casting a shadow over the relationship in the form of passive aggression, quiet resentment, and the gnawing sense that something essential is missing.`,
      arc: {
        protection: 'Avoiding conflict about values meant never having to test whether the relationship could hold your real priorities. In Polyvagal terms, your nervous system learned that values-based confrontation triggers dorsal vagal shutdown — either in you or in the other — so silence became a survival strategy. Safer to quietly compromise than risk discovering the relationship can\'t hold your truth.',
        cost: 'Your values-action gap widens into what ACT researchers call "values-incongruent living" — the primary source of existential suffering. You know what matters but can\'t live it because living it would require conversations you\'re unwilling to have. The gap IS the conflict you\'re avoiding. And your partner, paradoxically, suffers too — they\'re in relationship with a version of you that isn\'t fully you.',
        emergence: 'What wants to emerge is what Kegan calls the Self-Authoring Mind — the capacity to hold your own values even under relational pressure. Not as an ultimatum but as what Bowen called an "I-position": "This matters to me, and I need to live it, and I want to find a way to do that inside this relationship." This is Erikson\'s Identity stage revisited: you are being asked, again, to define who you are.',
      },
      practice: `Pick the value with your biggest gap${biggestGap ? ` (${biggestGap.value})` : ''}. This week, identify one way this gap connects to something you've been avoiding discussing. Then, after dinner one evening, have a 5-minute conversation about it. Start with: "Something important to me that I haven't been naming is..." Set a timer if you need to — five minutes is enough. You're not resolving it. You're voicing it.`,
      oneThing: 'Your values can only live in your relationships if you give them a voice. Silence is not peace — it is slow surrender.',
      depth: 'pairwise',
      domains: ['conflict', 'compass'],
      confidence: 'high',
    };
  }

  if ((style === 'forcing' || style === 'problemSolving') && gapHigh) {
    return {
      title: 'The Values Warrior',
      subtitle: 'Your conflict style × values',
      body: `You care deeply about ${topValStr} and you're willing to fight for what matters. But your values-action gap (avg: ${avgGap.toFixed(1)}/10) suggests that the fight itself might be getting in the way of actually living these values. In ACT terms, you've confused "talking about values" with "living values" — the intensity of your advocacy has become a substitute for the quiet daily embodiment that values actually require.\n\nWhen your ${style} style engages around values, it can become what Jungian psychology calls "inflation" — the Warrior archetype in its shadow form, where righteousness replaces relationship. "I'm right because this MATTERS" is a powerful position, but it's a monologue, not a dialogue. The intensity of your engagement may be correct in content but counterproductive in delivery. In Gottman's language, you're fighting for the right things in a way that triggers "Diffuse Physiological Arousal" in your partner — flooding their nervous system and making them unable to hear the very values you're trying to share.\n\nAs Wendell Berry wrote, "The world cannot be discovered by a journey of miles, only by a spiritual journey of inches." Your values can't be imposed across the miles of an argument — they can only be embodied in the inches of daily action. In IFS terms, your Righteous Protector part believes that if it fights hard enough for the value, the value will be lived. But the Exile underneath — the part that actually holds the value — needs something different: not a fighter, but a practitioner.\n\nThe Schema Therapy lens reveals a Demanding Parent mode: the internalized voice that says "This is the right way" and brooks no alternatives. Real values work — what ACT calls "committed action" — looks nothing like winning an argument. It looks like choosing, again and again, in small moments, to act from what matters.`,
      arc: {
        protection: 'Fighting hard for values felt like integrity — what your internal system coded as "if I don\'t fight for this, it means I don\'t believe in it." In Polyvagal terms, your sympathetic mobilization gets recruited in service of values-defense, creating an urgency that feels morally necessary. Anything less felt like compromise, which felt like betrayal of self.',
        cost: 'Your partner experiences your values-driven conflict not as shared conviction but as being lectured or controlled. In EFT terms, the fight about values damages the attachment bond, which is itself one of your deepest values — creating the painful paradox of destroying connection in the name of what you believe in. Gottman\'s research shows that harsh startup in values conversations predicts rejection of the very values being advocated.',
        emergence: 'What wants to emerge is what Kegan\'s Self-Transforming Mind makes possible: holding your values deeply while acknowledging they\'re not the only valid values in the room. Living through invitation rather than insistence. In Erikson\'s Generativity stage, values become gifts to be offered, not positions to be defended. Show rather than argue. Embody rather than enforce.',
      },
      practice: 'This week, pick one value you tend to argue about. Instead of making a case for it, live it visibly for seven days without mentioning it once. If you value quality time, create it — put your phone away, plan something, be present. If you value honesty, share something vulnerable rather than demanding transparency. Let the value speak for itself. At the end of the week, notice: did living it accomplish more than arguing about it?',
      oneThing: 'The most persuasive argument for a value is living it. Your partner can resist your words, but they cannot resist your example.',
      depth: 'pairwise',
      domains: ['conflict', 'compass'],
      confidence: 'high',
    };
  }

  // Low gap or other conflict styles
  return {
    title: 'Where Your Fights Meet Your Heart',
    subtitle: 'Your conflict style × values',
    body: `Your ${style} conflict style meets your core values (${topValStr}).${gapHigh ? ` There\'s a notable gap (${avgGap.toFixed(1)}/10) between what you value and how you live it.` : ' Your values and actions are relatively aligned — what ACT researchers call "values-congruent living," one of the strongest predictors of psychological wellbeing.'}\n\n${gapHigh ? 'The question is: how does your conflict style either help or hinder closing that gap? In ACT terms, every unresolved tension about values is a form of "experiential avoidance" — you know what matters, but the emotional cost of acting on it (which often means conflict) keeps you stuck. The gap IS the conflict you haven\'t had yet.' : 'When your values are aligned with your actions, conflict becomes what Gottman calls "dreams within conflict" — disagreements that serve a purpose because they\'re rooted in genuine meaning rather than accumulated frustration. You fight from a place of clarity rather than unmet need.'}\n\nAs Mary Oliver wrote, "Tell me, what is it you plan to do with your one wild and precious life?" The intersection of your conflict style and your values determines whether that question gets answered through action or remains a beautiful aspiration. In Jungian terms, your values represent the Self's calling — the deepest truth of who you are meant to become — while your conflict style represents the ego's strategy for protecting or advancing that truth in the relational world.`,
    arc: {
      protection: `Your ${style} approach to conflict developed as your nervous system's best strategy for protecting what mattered. In Polyvagal terms, it's the social engagement strategy your system learned for high-stakes moments. It's not random — it's your body's answer to the question: "When something I care about is threatened, what do I do?"`,
      cost: gapHigh
        ? 'The gap between your values and actions may itself be a source of unacknowledged conflict — what IFS would call a "burdened Exile" carrying the weight of unlived conviction. This internal tension leaks into external disagreements, coloring arguments with an urgency or avoidance that has nothing to do with the surface issue.'
        : 'Even with good alignment, be aware of what Gottman calls "gridlocked conflict" — disagreements that recur because they touch your partner\'s values as deeply as yours. They may matter just as deeply about different things, and honoring that requires the developmental humility of Kegan\'s Fifth Order.',
      emergence: gapHigh
        ? 'Closing the values-action gap often requires what ACT calls "creative hopelessness" — the recognition that your current strategy isn\'t working, followed by the courage to try something new. The conflict you need isn\'t with your partner — it\'s with the part of you that\'s been avoiding change. In Erikson\'s terms, this is an Identity revision: choosing again who you want to be.'
        : 'Your alignment gives you what Bowen called a "compass of self" in conflict. Use it to stay oriented to what actually matters when disagreements heat up. In Kegan\'s Fourth Order, you can hold your values as chosen commitments rather than inherited assumptions.',
    },
    practice: gapHigh
      ? `Identify the value with the biggest gap. Before bed tonight, write one sentence: "The conversation I need to have about this value is ___." Tomorrow, have that conversation — with yourself or your partner. Start with: "I want to live more aligned with what I believe. Here's where I'm stuck."`
      : 'In your next disagreement, pause before responding and ask: "Which of my values is this actually about?" Name it out loud: "I think this matters to me because of my value of ___." It grounds the conflict in something real and gives your partner a map to what\'s underneath.',
    oneThing: gapHigh ? 'The gap between your values and your life is waiting for one honest conversation. Have it this week.' : null,
    depth: 'pairwise',
    domains: ['conflict', 'compass'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// PRIORITY PAIR 6: EQ × Conflict (navigation × conflict)
// ═══════════════════════════════════════════════════════

register('navigation', 'conflict', (s) => {
  const eqHigh = getEQTotal(s) >= 65;
  const style = getConflictStyle(s);
  const managingSelf = getEQManagingSelf(s);
  const perception = getEQPerception(s);

  if (eqHigh && (style === 'avoiding' || style === 'yielding')) {
    return {
      title: 'The Aware Avoider',
      subtitle: 'Your EQ × conflict style',
      body: `You see everything (EQ: ${Math.round(getEQTotal(s))}) but you don't engage with what you see (${style} conflict style). This is a specific kind of frustration: you know exactly what's happening in the emotional field of a disagreement — the tension, the hurt, the fear — and you choose to step around it rather than into it. In Jungian terms, you carry the archetype of the Seer — gifted with vision but cursed with the inability to act on what you see, like Cassandra who could prophesy but never be heard.\n\nThis isn't low EQ. It's high EQ deployed defensively. In IFS terms, your Perceptive Manager part has formed an alliance with your Avoider Protector: "I'll show you exactly where the mines are, so you can step around every one." You use your emotional intelligence to anticipate and avoid conflict rather than to navigate through it. In Polyvagal terms, your neuroception is excellent — you detect the shift toward danger with precision — but your social engagement system gets bypassed in favor of dorsal vagal withdrawal.\n\nAs James Hillman wrote, "The psyche generates images ceaselessly, and if we do not give them conscious attention, they become symptoms." Your unspoken perceptions ARE becoming symptoms — tension in the body, passive withdrawal, the growing weight of things seen but not said. Gottman's research shows that "turning away" from conflict bids is more damaging than "turning against" (open disagreement) — silence erodes faster than argument.\n\nThe DBT concept of "opposite action" is precisely what your pattern needs: when every instinct says "don't engage," that is the moment to lean in. Not aggressively, not recklessly, but with the same emotional intelligence you currently use to avoid — now redirected toward skillful engagement. Your EQ isn't the problem. It's the solution you haven't deployed yet.`,
      arc: {
        protection: 'Your emotional perception showed you — with painful clarity — how much conflict costs. Every raised voice, every hurt look, every moment of tension registered at full resolution in your sensitive system. Avoiding wasn\'t ignorance; it was what ACT calls "experiential avoidance" informed by genuine emotional intelligence. You saw the cost and decided not to pay it — for yourself or for them.',
        cost: 'Issues accumulate because you see them but don\'t address them — what Gottman calls the "distance and isolation cascade." Your partner may not even know there\'s a problem until it\'s become too calcified to dissolve. In EFT terms, your awareness becomes a solitary burden, and the relationship loses access to the very perceptiveness that could heal it. You become the loneliest person in the room: the one who sees everything and says nothing.',
        emergence: 'What wants to emerge is using your EQ not just to read conflict but to navigate it — what Kegan\'s Fourth Order makes possible: having your perception rather than being had by it. You already have the map. The developmental edge is walking the territory. In Erikson\'s Intimacy framework, this is the moment where avoiding emotional risk becomes incompatible with genuine closeness.',
      },
      practice: 'This week, notice one thing you\'d normally avoid addressing — you\'ll know it because your body will tighten when you think about it. Instead of routing around it, name it gently after dinner: "I\'ve been noticing something between us about ___. I haven\'t said anything because I was afraid it would be hard. Can we talk about it for five minutes?" Let your EQ guide the conversation rather than prevent it.',
      oneThing: 'You already see it. Now say it. Your silence is not keeping the peace — it is keeping the distance.',
      depth: 'pairwise',
      domains: ['navigation', 'conflict'],
      confidence: 'high',
    };
  }

  if (!eqHigh && (style === 'forcing' || style === 'problemSolving')) {
    return {
      title: 'The Blind Driver',
      subtitle: 'Your EQ × conflict style',
      body: `You engage conflict directly (${style} style) but your emotional reading is still developing (EQ: ${Math.round(getEQTotal(s))}). This means you charge into disagreements without always reading the emotional landscape. You know WHAT you think but may miss HOW your partner is experiencing the conversation. In Jungian terms, your Thinking function dominates while your Feeling function lags — you navigate by logic in a territory that runs on emotion.\n\nThis creates a pattern where you "win" arguments but lose connection. In Gottman's research, this is precisely the pattern he calls "winning the battle, losing the war" — the factual resolution happens, but the emotional repair doesn't because you didn't see the emotional damage in real-time. In EFT terms, the "raw spots" you inadvertently touch during conflict go unnoticed and unhealed, accumulating into what Sue Johnson calls "attachment injuries."\n\nAs Rumi wrote, "Raise your words, not your voice. It is rain that grows flowers, not thunder." Your words may be logically sound, but without emotional perception, they land like thunder — impressive, attention-getting, but ultimately destructive rather than nourishing. In Polyvagal terms, your sympathetic arousal during conflict keeps you mobilized for action (solving, forcing) while your neuroception — the ability to read safety and danger cues in the other person — gets overwhelmed by your own drive.\n\nThe IFS perspective is clarifying: your Manager part has developed a "fix it" strategy that bypasses the need for emotional attunement. Building EQ doesn't mean abandoning your natural directness — it means adding a perceptual channel that lets you see where your directness lands. Same engine, much better steering.`,
      arc: {
        protection: 'Leading with logic and force worked when emotional nuance wasn\'t available — what developmental psychologists might see as an over-reliance on Kegan\'s Third Order cognitive strategies. If you can\'t read the room, you can at least control it. Your ${style} style compensated for a perceptual gap by increasing your behavioral intensity.',
        cost: 'Partners feel bulldozed — what Gottman identifies as "harsh startup" leading to "Diffuse Physiological Arousal." Even when you\'re right, the way you engage leaves emotional wreckage you don\'t fully perceive. In Schema Therapy terms, your Demanding Parent mode dominates conflict, leaving your partner\'s Vulnerable Child feeling unseen and unsafe.',
        emergence: 'Building emotional perception transforms your natural engagement from what DBT calls "interpersonal ineffectiveness" to skilled interpersonal action. In Erikson\'s terms, this is the move from Industry (competence-driven problem solving) to Intimacy (relationally attuned engagement). Same energy, same directness — but now with eyes open.',
      },
      practice: 'In your next disagreement, pause twice — once at the beginning and once in the middle — to ask: "How are you feeling right now — not about the issue, but about how this conversation is going between us?" Listen to the full answer without defending. Then say: "Thank you for telling me that." Adjust your approach based on what you hear. You\'re building the perceptual muscle that turns force into skill.',
      oneThing: 'Slow down enough to see what your words are doing. The relationship needs your strength AND your sight.',
      depth: 'pairwise',
      domains: ['navigation', 'conflict'],
      confidence: 'high',
    };
  }

  if (eqHigh && (style === 'forcing' || style === 'problemSolving')) {
    return {
      title: 'The Skilled Engager',
      subtitle: 'Your EQ × conflict style',
      body: `High EQ (${Math.round(getEQTotal(s))}) meets an engaging conflict style (${style}). This is a powerful combination — you can read the emotional landscape of a disagreement AND you're willing to engage with it. You see what's happening and you show up. In Jungian terms, you carry the archetype of the Strategist-Healer: someone with both the perception to see the wound and the will to act on it.\n\nThe risk is sophistication: you may use your emotional intelligence to strategize in conflict rather than to connect. In IFS terms, a clever Manager part may recruit your EQ as a weapon — reading your partner's vulnerabilities and, consciously or not, leveraging them. Gottman's research on "flooding" shows that even emotionally intelligent conflict engagement can trigger Diffuse Physiological Arousal in a partner who feels outmatched. You may overwhelm less skilled partners with your combination of insight and drive.\n\nAs bell hooks wrote in All About Love, "Knowing how to be solitary is central to the art of loving. When we can be alone, we can be with others without using them as a means of escape." The parallel here is: knowing how to hold your skill is central to using it well. When you can hold your EQ without deploying it as strategy, you can engage conflict without it becoming domination.\n\nThe Polyvagal perspective reveals the subtlety: your ventral vagal system stays online during conflict (good), but your social engagement system may be operating in "influence mode" rather than "receptive mode." The shift from strategic empathy to genuine empathy is the shift from using perception to serve your goals to using it to serve the relationship.`,
      arc: {
        protection: 'This combination developed as a sophisticated way to maintain both connection and control in difficult conversations. In Schema Therapy terms, your Healthy Adult mode has access to both emotional intelligence and assertiveness — but the Overcontroller mode may sometimes hijack these tools for its own purposes.',
        cost: 'Partners may feel outmatched — what therapists call "asymmetric emotional competence" in conflict. Your ability to both read AND engage means arguments feel unbalanced. They can\'t read you as well as you read them. In EFT terms, the power differential undermines the "safe haven" that intimate conflict requires. They stop fighting and start performing — telling you what your EQ will accept rather than what they actually feel.',
        emergence: 'The highest use of this combination is what Kegan\'s Fifth Order describes: using your skill to create safety rather than advantage. In Gottman\'s framework, this means using your EQ to "turn toward" your partner\'s emotional reality during conflict, not to outmaneuver it. The developmental invitation is moving from "skilled combatant" to "skilled witness" — helping the OTHER person feel seen, not winning more effectively.',
      },
      practice: 'Next disagreement: set an intention before engaging. Say to yourself: "My job for the first five minutes is to understand, not to persuade." Use your EQ to focus entirely on your partner\'s experience. Reflect what you see: "It sounds like you\'re feeling ___ about this." Don\'t advocate for your position until they confirm you\'ve understood theirs. Then — and only then — share your perspective. Notice the difference.',
      oneThing: null,
      depth: 'pairwise',
      domains: ['navigation', 'conflict'],
      confidence: 'high',
    };
  }

  // Low EQ + avoiding/yielding
  return {
    title: 'The Quiet Struggle',
    subtitle: 'Your EQ × conflict style',
    body: `Your developing EQ (${Math.round(getEQTotal(s))}) pairs with a ${style} conflict approach. This combination can create a cycle where you don't fully understand what's happening emotionally in disagreements, so you default to avoidance or accommodation. In Polyvagal terms, conflict triggers sympathetic arousal (the body's stress response) without the ventral vagal social engagement skills to channel that arousal into productive communication — so your system defaults to the safest option: withdraw or submit.\n\nIt's not that you don't care — it's that conflict feels confusing. Without clear emotional perception, disagreements feel like navigating a storm with no weather map. In IFS terms, your system doesn't have a strong enough Self to mediate between the Firefighter parts (that want to flee or appease) and the Exile parts (that hold the hurt, anger, or need underneath). No wonder you'd rather stay inside.\n\nAs John O'Donohue wrote, "In the beginning, we need to be still, to listen, to notice." That stillness and noticing is exactly where your growth begins. In DBT terms, the foundational skill you need is "mindfulness of current emotion" — simply being able to identify what you feel, in real time, without judgment. This single skill, practiced consistently, opens the door to everything else: conflict engagement, emotional expression, relational repair.\n\nThe Jungian archetype here is the Innocent — not naive, but pre-verbal, still learning the language of emotion that will eventually allow full participation in the relational world. Every small act of noticing is a word in that developing language.`,
    arc: {
      protection: 'When you can\'t read the emotional landscape, avoiding it is the most rational strategy available — what ACT researchers call "experiential avoidance in the service of emotional survival." Why engage with territory you can\'t navigate? Your system chose safety over engagement, and given the tools available, that was the right call.',
      cost: 'Issues go unaddressed because you lack both the perception to understand them AND the confidence to engage with them. In Gottman\'s terms, your "bids for connection" during conflict are either absent or so muted that your partner can\'t detect them. The relationship accumulates what EFT calls "unprocessed attachment injuries" — small wounds that never get tended because neither person can fully articulate what happened.',
      emergence: 'Building emotional intelligence naturally changes your conflict capacity — what developmental psychologists call "scaffolded growth." In Kegan\'s framework, each new emotional skill you develop (naming feelings, reading faces, tolerating discomfort) becomes a building block for the next level of relational engagement. In Erikson\'s terms, you\'re building the emotional tools that make Intimacy possible.',
    },
    practice: 'Start building your emotional vocabulary with a daily micro-practice: after your evening meal, ask yourself two questions: "What was I feeling during our conversation?" and "What might they have been feeling?" Write one word for each — even "confused" or "blank" counts. Don\'t act on it yet — just practice noticing. By the end of the week, you\'ll have 14 emotion-words. That\'s more emotional data than most people gather in a month.',
    oneThing: 'Understanding what you feel is the first step toward showing up in conflict. Start by simply noticing.',
    depth: 'pairwise',
    domains: ['navigation', 'conflict'],
    confidence: 'high',
  };
});

// ═══════════════════════════════════════════════════════
// REMAINING PAIRS (11 more)
// ═══════════════════════════════════════════════════════

// Attachment × Personality (foundation × instrument)
register('foundation', 'instrument', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const nHigh = getN(s) >= 65;
  const eHigh = getE(s) >= 65;
  const aHigh = getA(s) >= 65;

  const title = anxious && nHigh ? 'The Amplified Signal'
    : avoidant && !eHigh ? 'The Quiet Fortress'
    : anxious && aHigh ? 'The Gentle Pursuer'
    : avoidant && nHigh ? 'The Hidden Storm'
    : 'Your Temperament × Attachment';

  return {
    title,
    subtitle: 'Your attachment × personality',
    body: anxious && nHigh
      ? `Your high neuroticism (${Math.round(getN(s))}th percentile) amplifies your attachment anxiety — a double dose of sensitivity that creates one of the most intense inner experiences in relational life. The sensitivity that makes you deep and perceptive also makes your attachment alarm louder than most. Every signal of disconnection reverberates through a nervous system already tuned to detect threat. In Polyvagal terms, your neuroception is calibrated to "high sensitivity" on two independent channels: temperamental reactivity AND attachment vigilance.\n\nIn Jungian terms, you carry the archetype of the Sensitive Soul — the one whose wound is also their gift, whose pain is also their perception. As Rilke wrote, "For beauty is nothing but the beginning of terror, which we are still just able to endure." Your experience of relationships IS that beauty-terror threshold, constantly. In IFS, this means multiple Exile parts (the sensitive child AND the anxiously attached child) are both sending distress signals simultaneously, overwhelming your Manager parts' capacity to regulate.\n\nThe clinical picture from Schema Therapy shows the Vulnerability to Harm schema (from temperament) reinforcing the Abandonment schema (from attachment) — each confirming the other's worst fears. But here's the redemptive truth from EFT research: this same sensitivity, once it has a container, becomes the raw material for extraordinary depth of connection. The system that detects every micro-shift in your partner's mood can also detect every micro-moment of genuine warmth, love, and presence. The alarm becomes an instrument.`
      : avoidant && !eHigh
      ? `Your introverted temperament (E: ${Math.round(getE(s))}th percentile) and avoidant attachment reinforce each other in what systems therapists call a "mutually reinforcing loop." Your natural preference for solitude provides the perfect cover for emotional distance. It's hard to tell where temperament ends and avoidance begins — and that ambiguity serves the distance. In Jungian terms, the Hermit archetype has merged with the avoidant defense, creating a self-contained inner world that feels like wisdom but may actually be refuge.\n\nAs David Whyte wrote, "The only choice we have as we mature is how we inhabit our vulnerability." Your combination of introversion and avoidance has created an elegant strategy for NOT inhabiting vulnerability — every time closeness demands more than your system can handle, introversion provides a socially acceptable escape hatch. In Polyvagal terms, your natural baseline is lower arousal (introverted temperament), and your attachment strategy further dampens the social engagement system.\n\nThe IFS perspective is compassionate here: your Protector parts use introversion as a legitimate need (which it is) to justify avoidant withdrawal (which serves a different purpose). The distinction matters because genuine introversion is restorative — you come back refreshed and ready to connect. Avoidant withdrawal is defensive — you come back no more prepared for closeness than when you left. Gottman's research shows that "self-soothing" (healthy introversion) and "stonewalling" (avoidant withdrawal) look identical from the outside but have opposite effects on the relationship.`
      : `Your personality traits shape how your attachment system expresses itself in the world. ${anxious ? 'Your anxiety' : avoidant ? 'Your avoidance' : 'Your security'} gets filtered through your specific temperament — ${nHigh ? 'your sensitivity amplifies it, creating an experience of relationships that runs at higher emotional volume than most' : eHigh ? 'your social energy channels it outward, making your attachment patterns more visible and interpersonally active' : aHigh ? 'your warmth softens it, creating a relational style that is both caring and shaped by your attachment history' : 'creating your unique relational signature — a blend of nature and nurture that is distinctly yours'}.\n\nAs Mary Oliver wrote, "You do not have to be good. You do not have to walk on your knees for a hundred miles through the desert, repenting. You only have to let the soft animal of your body love what it loves." Your temperament IS that soft animal — the biological substrate upon which your attachment patterns were written. In IFS terms, understanding how personality and attachment interact is the beginning of unblending: seeing that "this is my temperament" and "this is my attachment pattern" are two different threads woven into the same fabric.\n\nIn Polyvagal terms, your temperament sets the baseline tone of your autonomic nervous system, while your attachment style determines how that system responds to relational cues. The intersection creates your unique "relational fingerprint" — not a diagnosis, but a starting point for conscious development.`,
    arc: {
      protection: anxious && nHigh
        ? 'Sensitivity + anxiety created a hypervigilant system — what neuroscience researchers call "sensory processing sensitivity" meeting "attachment hyperactivation." It catches every subtle shift in connection, every micro-expression, every change in vocal tone. This was necessary intelligence in your early relational world, not pathology.'
        : avoidant && !eHigh
        ? 'Introversion + avoidance created a self-contained world that felt safe, sustainable, and even noble — the philosophical life of solitude. In Schema Therapy, this reflects the Emotional Inhibition schema reinforced by temperamental preference for low stimulation.'
        : 'Your temperament and attachment style developed in parallel, each reinforcing the other\'s tendencies. This makes the pattern feel natural — "just who I am" — which makes it harder to see as a pattern and easier to accept as fixed identity.',
      cost: anxious && nHigh
        ? 'Emotional exhaustion from a system that\'s always scanning — what compassion fatigue researchers call "hyperempathic distress." False alarms are frequent and draining, and the real signals get buried in noise. Partners may feel that your intensity is about your needs rather than their reality.'
        : avoidant && !eHigh
        ? 'Partners can\'t tell if you need space or are avoiding intimacy. The legitimate need for solitude hides the avoidant pattern so effectively that even you may not know which is operating. In EFT terms, your partner\'s "protest behavior" (trying to reach you) gets met with what looks like a temperamental boundary rather than an attachment defense.'
        : 'Your temperament can make your attachment patterns feel more "natural" than they are — what psychologists call "ego-syntonic" patterns. They\'re harder to see as patterns because they feel like personality, and harder to change because change feels like personality erasure.',
      emergence: anxious && nHigh
        ? 'Channel your sensitivity toward perception rather than protection — what Kegan\'s Fourth Order makes possible. The same system that detects threats can detect beauty, nuance, and genuine connection. In Erikson\'s terms, the Intimacy stage asks you to let sensitivity become your gift to the relationship rather than your burden.'
        : avoidant && !eHigh
        ? 'Distinguish between genuine introversion (restorative solitude that refuels your capacity for connection) and avoidant withdrawal (defensive distance that depletes the relationship). They feel the same in your body but serve different masters. In Kegan\'s framework, this distinction is the beginning of Self-Authoring: choosing rather than defaulting.'
        : 'Notice where personality and attachment overlap — and where they don\'t. The distinction matters because temperament is stable but attachment style is changeable. Knowing which is which opens the door to growth that respects your nature while expanding your capacity.',
    },
    practice: anxious && nHigh
      ? 'When sensitivity spikes this week, pause and label it: "Is this my temperament (I\'m sensitive to everything right now) or my attachment alarm (I\'m specifically afraid of losing connection)?" Write it down. By the end of the week, you\'ll have a map of which system is driving. This distinction alone — naming the source — reduces reactivity by engaging your prefrontal cortex.'
      : avoidant && !eHigh
      ? 'Track your withdrawals this week in a small notebook. After each time you choose solitude over connection, write one honest word: "needed" or "avoiding." Don\'t judge — just track. At the end of the week, look at the pattern. You may be surprised by how often "avoiding" wears the costume of "needed."'
      : 'Notice one way your personality makes your attachment pattern feel "just who I am" this week. When you catch it — the moment where temperament and attachment blur — say to yourself: "That might be pattern, not personality." Question the assumption gently. That questioning IS the growth.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['foundation', 'instrument'],
    confidence: 'high',
  };
});

// Personality × EQ (instrument × navigation)
register('instrument', 'navigation', (s) => {
  const nHigh = getN(s) >= 65;
  const aHigh = getA(s) >= 65;
  const oHigh = getO(s) >= 65;
  const eqHigh = getEQTotal(s) >= 65;

  return {
    title: nHigh && eqHigh ? 'The Sensitive Perceiver'
      : aHigh && eqHigh ? 'The Natural Attunement'
      : nHigh && !eqHigh ? 'The Raw Nerve'
      : 'Your Temperament × Emotional Skill',
    subtitle: 'Your personality × EQ',
    body: nHigh && eqHigh
      ? `Your sensitivity (N: ${Math.round(getN(s))}th) gives you access to a wide emotional range, and your EQ (${Math.round(getEQTotal(s))}) helps you use that range skillfully. You feel deeply AND you know what to do with what you feel. In Jungian terms, you've achieved what Jung called the "union of opposites" — the raw intensity of the Feeling function held within the discipline of emotional skill. This is a powerful combination for relational depth — you access emotions others miss and can channel them constructively.\n\nAs Pema Chödrön wrote, "The most fundamental aggression to ourselves, the most fundamental harm we can do to ourselves, is to remain ignorant by not having the courage and the respect to look at ourselves honestly and gently." Your combination of sensitivity and skill gives you the rare courage to look honestly at what you feel and the equally rare capacity to do something useful with what you see. In Polyvagal terms, your sensitive neuroception provides rich emotional data, and your EQ processes it through a well-developed ventral vagal social engagement system.\n\nIn IFS terms, your Self has learned to be with the Exile's intensity without being overwhelmed by it — to feel the pain, the joy, the complexity, and to respond rather than react. This is what DBT's Marsha Linehan calls "wise mind" — the synthesis of emotional experience and rational skill.`
      : nHigh && !eqHigh
      ? `Your sensitivity (N: ${Math.round(getN(s))}th) gives you intense emotional access, but your EQ (${Math.round(getEQTotal(s))}) hasn't caught up yet. You feel everything at high volume without the processing tools to manage it. This creates overwhelm that isn't about the emotions themselves — it's about the gap between what you feel and what you can do with it. In Polyvagal terms, your nervous system fires into sympathetic activation faster and more intensely than most, without the ventral vagal "brakes" that EQ provides.\n\nThe Jungian archetype here is the Wounded Child — carrying immense emotional energy without the ego-structure to contain it. As Rilke wrote, "Perhaps everything terrible is in its deepest being something helpless that wants help from us." Your emotional flooding is that "something helpless" — not a flaw but a capacity that needs building-around. In Schema Therapy, this is the Vulnerable Child mode operating without access to the Healthy Adult mode that EQ would provide.\n\nIn IFS terms, your Exile parts carry enormous emotional charge, and your Firefighter parts (reactivity, numbing, distraction) activate before your Self can intervene. Building EQ is essentially building Self-energy — the capacity to be present with intensity without being consumed by it. This isn't about feeling less. It's about what Dan Siegel calls expanding your "window of tolerance."`
      : `Your personality traits shape how your emotional intelligence operates in the world. ${aHigh ? 'Your natural warmth (A: ' + Math.round(getA(s)) + 'th) gives your EQ a generous orientation — you tend to use emotional skill in service of others, which in IFS terms means your Caretaker Manager runs the show. This is beautiful, but watch for the shadow: empathy deployed only outward can become a way of avoiding your own emotional needs.' : oHigh ? 'Your openness (O: ' + Math.round(getO(s)) + 'th) lets you approach emotional complexity with curiosity rather than fear — what ACT researchers call "psychological flexibility." You can hold ambiguous, contradictory, or uncomfortable emotions without rushing to resolve them.' : 'Your specific temperament creates a unique emotional style — a particular way of meeting the world\'s emotions that is distinctly yours.'}\n\nAs Mary Oliver wrote, "Instructions for living a life: Pay attention. Be astonished. Tell about it." Your temperament determines WHAT you pay attention to emotionally, your EQ determines what you DO with what astonishes you, and the intersection of both determines what you can tell about it — to yourself and to the people you love.`,
    arc: {
      protection: nHigh
        ? 'Sensitivity was a survival tool — what Elaine Aron\'s research calls "sensory processing sensitivity." Feel everything to miss nothing. Whether that becomes a gift or a burden depends on the processing skills wrapped around it. In early environments, this raw reception was necessary intelligence — but it came without the manual for what to do with the data.'
        : 'Your temperament shaped which emotional skills you developed first and which lagged. In Polyvagal terms, your autonomic nervous system\'s default tone influenced which emotional channels were easiest to develop and which remain underdeveloped.',
      cost: nHigh && !eqHigh
        ? 'Emotional flooding — what Gottman calls "Diffuse Physiological Arousal" and what DBT calls "emotion dysregulation." You react before you can process, and the intensity of your experience can overwhelm both you and your partner. In EFT terms, your partner experiences not your feelings but your overwhelm, which activates their own defensive strategies.'
        : 'There may be a mismatch between the emotions you naturally access and the skills you\'ve built to manage them — what developmental psychologists call "asynchronous development." Your temperament opened certain emotional doors; your EQ may not have keys to all of them yet.',
      emergence: nHigh
        ? 'Building EQ around your sensitivity transforms it from what Elaine Aron calls a "vulnerability factor" to what she calls a "vantage sensitivity" — the same trait that magnifies suffering also magnifies joy, depth, and relational attunement. In Kegan\'s framework, this is the Fourth Order move: from being subject to sensitivity to having it as a tool. The goal isn\'t feeling less — it\'s holding more.'
        : 'Growing into the emotional skills that match your temperament creates authentic emotional intelligence rather than performed emotional management. In Erikson\'s terms, this is Identity work — discovering your genuine emotional style rather than borrowing someone else\'s.',
    },
    practice: nHigh && !eqHigh
      ? 'When emotions spike this week, practice what Dan Siegel calls "name it to tame it": say the emotion out loud ("I\'m feeling overwhelmed" or "I notice anger rising"). This simple act — spoken aloud, not just thought — engages your prefrontal cortex and reduces amygdala reactivity by up to 50%. Do this three times this week. That\'s three moments of building the bridge between sensitivity and skill.'
      : 'This week, identify one emotion you handle well and one that catches you off guard. For the difficult one, practice simply noticing it without reacting: "There it is again." Focus your EQ development on your weaker area — that\'s where the leverage lives.',
    oneThing: nHigh && !eqHigh ? 'Naming what you feel is the bridge between sensitivity and skill. Say it out loud.' : null,
    depth: 'pairwise',
    domains: ['instrument', 'navigation'],
    confidence: 'high',
  };
});

// Personality × Differentiation (instrument × stance)
register('instrument', 'stance', (s) => {
  const nHigh = getN(s) >= 65;
  const eHigh = getE(s) >= 65;
  const diffHigh = getDSITotal(s) >= 60;

  return {
    title: nHigh && !diffHigh ? 'The Reactive Sensitivity'
      : !nHigh && diffHigh ? 'The Steady Core'
      : nHigh && diffHigh ? 'The Differentiated Feeler'
      : 'Your Temperament × Selfhood',
    subtitle: 'Your personality × differentiation',
    body: nHigh && !diffHigh
      ? `High sensitivity (N: ${Math.round(getN(s))}th) meets developing differentiation (${Math.round(getDSITotal(s))}). When emotions run hot and boundaries are porous, every interaction becomes high-stakes. Your partner's mood destabilizes you not because you're weak, but because your sensitive temperament amplifies what your underdeveloped boundaries let in. In ecopsychological terms, you are like a tide pool — exquisitely sensitive to every change in the water's chemistry, temperature, and current, but without the breakwater that would let you maintain your own equilibrium.\n\nIn Polyvagal terms, your high-sensitivity nervous system fires rapidly into sympathetic arousal, and without the differentiated "self" to serve as a vagal brake, the arousal cascades into reactivity. In IFS, this means your Exile parts (carrying the temperamental sensitivity) overwhelm your Manager parts (which try to maintain composure) because there isn't enough Self-energy (differentiation) to hold both. As Jung wrote, "Until you make the unconscious conscious, it will direct your life and you will call it fate." Your reactivity feels like fate — like "just how I am" — but it's actually the unconscious interplay of sensitivity and insufficient selfhood.\n\nIn Schema Therapy, this pattern often reflects the Vulnerability to Harm schema amplified by low differentiation — you feel everything and can't protect yourself from what you feel. DBT's concept of "emotional vulnerability" (the biological tendency to react quickly, intensely, and slowly return to baseline) combined with low distress tolerance creates what Linehan called "the emotional equivalent of third-degree burns — the slightest touch produces unbearable pain."`
      : nHigh && diffHigh
      ? `An unusual and powerful combination: deep sensitivity (N: ${Math.round(getN(s))}th) held by strong differentiation (${Math.round(getDSITotal(s))}). You feel everything intensely but have the self-definition to hold it. You can be touched without being toppled. In Jungian terms, this is the mature Feeler — someone who has individuated enough to contain the full range of emotional experience without being consumed by it.\n\nAs Khalil Gibran wrote, "Your joy is your sorrow unmasked. And the selfsame well from which your laughter rises was oftentimes filled with your tears." You have access to that full well — both the laughter and the tears — and your differentiation gives you the bucket and the rope to draw from it without falling in. In Polyvagal terms, your sensitive neuroception provides rich data, and your strong vagal tone (from differentiation) keeps your system regulated even as it receives intense input.\n\nIn IFS, this looks like a well-led system: your Exile parts are sensitive and feeling, but your Self is present and steady enough to witness them without being overwhelmed. In Bowen's framework, you've achieved what he considered the highest developmental accomplishment: emotional intensity held within self-definition. This is rare, and it's a gift to every relationship you enter.`
      : `Your temperament creates the raw material of your emotional life; your differentiation shapes what you do with it. ${diffHigh ? 'Your strong self-definition gives you what Bowen called "a solid self" — a stable platform from which to engage with whatever your temperament throws at you. In Polyvagal terms, your differentiation acts as a vagal brake, modulating autonomic arousal so that temperamental tendencies don\'t run the show.' : 'As your differentiation develops, it will help you channel your natural temperament more intentionally. In Kegan\'s framework, you\'re moving from being "subject to" your temperament (it runs you) to "having" your temperament (you work with it).'}\n\nAs David Whyte wrote, "Anything or anyone that does not bring you alive is too small for you." Your temperament is what brings you alive — for better and worse. Your differentiation determines whether that aliveness becomes a controlled fire (warming, illuminating) or a wildfire (destructive, chaotic). The intersection of the two is where your relational self lives.`,
    arc: {
      protection: nHigh && !diffHigh
        ? 'Without strong boundaries, your sensitivity made you reactive — what DBT calls "emotional vulnerability" meeting "interpersonal chaos." That reactivity was itself a form of protection: by responding to everything immediately, you never had to sit with the uncertainty of unfelt feelings. Your nervous system stayed in perpetual alert mode because that felt safer than stillness.'
        : 'Your temperament and differentiation developed independently — often in different life contexts — creating either natural alignment or productive tension. In IFS terms, the parts shaped by temperament and the parts shaped by self-definition may not always agree, and that internal dialogue is actually the sound of growth.',
      cost: nHigh && !diffHigh
        ? 'Chronic emotional reactivity that exhausts you and your partners — what Gottman calls the "harsh startup" that comes not from anger but from overwhelming sensitivity meeting insufficient containment. Every interaction feels disproportionately intense because it IS — you\'re processing through what DBT describes as an unfiltered system with a slow return to baseline.'
        : diffHigh ? 'You may not realize how much your differentiation compensates for temperamental tendencies that others struggle with — what therapists call "the curse of competence." Your ease can make you impatient with others\' struggles.' : 'Developing differentiation means learning what ACT calls "acceptance with change" — holding your temperamental impulses without suppressing them and without being run by them.',
      emergence: nHigh && !diffHigh
        ? 'Building differentiation around your sensitivity is the single highest-leverage growth move you can make — what Bowen would call the "primary therapeutic task." In Kegan\'s framework, this is the Third-to-Fourth Order transition: from being your feelings to having your feelings. It doesn\'t reduce feeling — it provides a container, a riverbank for the powerful water that is your emotional life.'
        : 'Continue integrating your natural temperament with your sense of self. In Erikson\'s Identity framework, who you are isn\'t just what you feel — it\'s what you choose to do with what you feel. That choosing is differentiation in action.',
    },
    practice: nHigh && !diffHigh
      ? 'Practice "emotional pausing" three times this week: when reactivity spikes, place your hand on your chest, feel the heartbeat, and say "This is my feeling, not my identity. I can feel this AND choose what to do next." Wait 30 seconds — a full 30 seconds — before responding. The pause IS the container you\'re building.'
      : 'This week, identify one temperamental tendency (sensitivity, introversion, impulsivity, warmth) and notice one moment where your differentiation helps you manage it. Say to yourself: "My temperament is pulling me toward ___. I\'m choosing ___." That conscious choice — temperament noticed, response chosen — IS differentiation in real time.',
    oneThing: nHigh && !diffHigh ? 'Building a container for your feelings changes everything. Start with a 30-second pause.' : null,
    depth: 'pairwise',
    domains: ['instrument', 'stance'],
    confidence: 'high',
  };
});

// Personality × Conflict (instrument × conflict)
register('instrument', 'conflict', (s) => {
  const nHigh = getN(s) >= 65;
  const aHigh = getA(s) >= 65;
  const style = getConflictStyle(s);

  return {
    title: nHigh && style === 'forcing' ? 'The Heated Engager'
      : aHigh && style === 'yielding' ? 'The Natural Yielder'
      : nHigh && style === 'avoiding' ? 'The Overwhelmed Retreater'
      : 'Your Temperament × Conflict Dance',
    subtitle: 'Your personality × conflict style',
    body: nHigh && style === 'forcing'
      ? `High sensitivity (N: ${Math.round(getN(s))}th) meets a forcing conflict style. This creates intense, emotionally charged confrontations — what Gottman would recognize as "harsh startup" driven not by contempt but by overwhelm. You don't just disagree — you feel the disagreement at full volume AND push hard. Your partner may experience this as being hit by a wave they can't stand up in. In Polyvagal terms, your sensitive nervous system shifts rapidly into sympathetic mobilization, and without the vagal brake of emotional regulation, that mobilization becomes confrontational force.\n\nThe Jungian archetype here is the Storm — powerful, necessary for the ecosystem, but destructive when it has no container. As Rumi wrote, "Raise your words, not your voice. It is rain that grows flowers, not thunder." Your words often carry thunder because your sensitivity amplifies the emotional charge of every disagreement. In IFS terms, your sensitive Exile activates a Firefighter that uses intensity as a way to end the unbearable feeling of conflict as quickly as possible. The forcing isn't aggression — it's pain management.\n\nIn EFT terms, your partner's nervous system goes into "flooding" when your intensity hits — Gottman's research shows that once heart rates exceed 100 BPM, the capacity for productive dialogue drops to near zero. Your sensitivity creates the intensity; your forcing style delivers it; your partner's system shuts down in response. The cycle perpetuates itself because neither of you can stay regulated enough to find the real issue underneath.`
      : aHigh && style === 'yielding'
      ? `Your natural warmth (A: ${Math.round(getA(s))}th) and yielding style are deeply intertwined — what personality researchers call "trait-consistent conflict behavior." Being agreeable makes yielding feel natural — even virtuous. But there's a shadow that Jung would immediately recognize: some of your "generosity" in conflict may actually be agreeableness serving avoidance. You don't yield because you've decided to — you yield because disagreeing feels mean, and your agreeable temperament has coded "mean" as "unacceptable."\n\nAs bell hooks wrote, "To begin by always thinking of love as an action rather than a feeling is one way in which anyone using the word 'love' in a manipulative way is unmasked." Your yielding may feel like love, but if it consistently silences your own needs, it's not love — it's appeasement wearing love's mask. In Schema Therapy, this is the Self-Sacrifice schema reinforced by an agreeable temperament — a double lock on your authentic voice. In IFS terms, your Caretaker Manager and your Agreeable part have formed an alliance that exiles your needs so thoroughly you may not even know what they are.\n\nIn Gottman's research, yielding partners eventually develop what he calls "negative sentiment override" — the accumulated resentment from years of unspoken needs colors every interaction with bitterness that seems to come from nowhere. Your warmth is real, but it needs your voice alongside it.`
      : `Your temperament (${nHigh ? 'sensitive' : aHigh ? 'warm' : 'your particular profile'}) shapes how your ${style} conflict style feels from the inside and looks from the outside — what personality researchers call "behavioral style congruence." In Polyvagal terms, your temperamental baseline determines how quickly your nervous system moves from social engagement into defensive mode during disagreement, and your conflict style is the behavioral expression of that neurological shift.\n\nAs David Whyte wrote, "The conversational nature of reality means that we are shaped and changed by every conversation we have." Your temperament shapes which conversations you seek, which you avoid, and how you show up when you can't avoid them. In IFS terms, your temperamental parts and your conflict parts have developed a working relationship — sometimes harmonious, sometimes contentious — that determines your default response when tension rises.\n\nUnderstanding how temperament and conflict style interact gives you what ACT calls "psychological flexibility" — the ability to notice the pull of your default pattern and choose whether to follow it or try something different. This isn't about changing who you are. It's about expanding what you can do.`,
    arc: {
      protection: nHigh && style === 'forcing'
        ? 'Overwhelming intensity was a way to resolve conflict quickly — what Polyvagal theory describes as sympathetic mobilization pressed into interpersonal service. If you push hard enough, the discomfort ends faster. Your sensitive system couldn\'t tolerate extended conflict, so it developed a strategy to end it — not through withdrawal but through overwhelming force.'
        : aHigh && style === 'yielding'
        ? 'Being agreeable was rewarded — in your family, your friendships, your culture. Yielding felt like kindness, and the line between genuine generosity and conflict avoidance was never drawn because no one asked you to draw it. In Schema Therapy terms, the Self-Sacrifice schema was reinforced by temperamental warmth until it became invisible as a pattern.'
        : `Your ${style} approach developed in concert with your temperament — each reinforcing the other in what systems therapists call a "positive feedback loop." In Polyvagal terms, your temperamental baseline shaped which conflict strategies felt neurologically available, and over time, those strategies became automatic.`,
      cost: nHigh && style === 'forcing'
        ? 'Emotional damage — what Gottman calls "the aftermath of failed conflict." Your intensity creates wounds that take longer to heal than the issue takes to resolve. In EFT terms, each intense episode becomes a minor "attachment injury" that accumulates over time, eroding trust not in your love but in your ability to be safe in disagreement.'
        : aHigh && style === 'yielding'
        ? 'You disappear in relationships — what Bowen called "de-selfing" driven by agreeableness rather than anxiety. Your partner never meets your real needs because you\'re too warm, too accommodating, too "nice" to name them. In Gottman\'s research, the yielder\'s accumulated resentment eventually produces the very conflict they\'ve been avoiding — but now amplified by years of compression.'
        : 'Your temperament may make your conflict pattern feel unchangeable — what psychologists call "ego-syntonic" patterns. "That\'s just who I am" becomes the story that prevents growth. In Kegan\'s framework, you\'re subject to the fusion of temperament and behavior, unable to see it as a pattern because it feels like identity.',
      emergence: nHigh && style === 'forcing'
        ? 'Learning to channel intensity without overwhelming the other person — what DBT calls "interpersonal effectiveness" at the intersection of emotional regulation. In Kegan\'s terms, this is the Fourth Order move: having your sensitivity rather than being had by it. Not less feeling — better delivery. Same fire, better hearth.'
        : aHigh && style === 'yielding'
        ? 'Distinguishing between genuine flexibility (a strength) and fear-driven accommodation (a defense) — what Bowen called the crucial distinction between "solid self" choices and "pseudo-self" compliance. Real agreeableness includes the ability to disagree. In Erikson\'s terms, your warmth needs your voice to become Generativity rather than Self-Sacrifice.'
        : 'Noticing where temperament drives conflict behavior vs. where conscious choice does. This awareness IS the developmental move — in Kegan\'s terms, making your temperament-conflict fusion visible so you can work with it rather than from it.',
    },
    practice: nHigh && style === 'forcing'
      ? 'Before engaging in any disagreement this week, rate your emotional intensity 1-10 by placing your hand on your heart and counting your heartbeat for 6 seconds. If your heart rate feels above 7 (or you count more than 7 beats), say: "I need 10 minutes — I want to talk about this, but not at this intensity." Walk, breathe, come back. Same position, calmer delivery.'
      : aHigh && style === 'yielding'
      ? 'This week, disagree with one small thing — a restaurant choice, a plan, a preference. Say: "Actually, I\'d prefer something different." Notice the discomfort in your body. Stay with it for 30 seconds. The discomfort of disagreeing is not the same as being unkind — your nervous system just hasn\'t learned the difference yet.'
      : `This week, notice one moment where your temperament pulled you toward your default ${style} conflict response. Before acting on it, ask: "Is this temperament driving, or am I choosing?" What would a different response look like? You don't have to execute it — just imagine it. That imagining is the first step toward having a choice.`,
    oneThing: null,
    depth: 'pairwise',
    domains: ['instrument', 'conflict'],
    confidence: 'high',
  };
});

// Personality × Values (instrument × compass)
register('instrument', 'compass', (s) => {
  const oHigh = getO(s) >= 65;
  const cHigh = getC(s) >= 65;
  const topValues = getTopValues(s);
  const avgGap = getAvgValueGap(s);

  return {
    title: oHigh ? 'The Curious Values Explorer' : cHigh ? 'The Disciplined Values Keeper' : 'Your Temperament × Values',
    subtitle: 'Your personality × values',
    body: `Your personality shapes HOW you relate to your values (${topValues.slice(0, 3).join(', ')}). ${oHigh ? 'Your openness (O: ' + Math.round(getO(s)) + 'th) means you\'re naturally curious about values — questioning, exploring, possibly changing them over time. In Jungian terms, you relate to values through the archetype of the Explorer: always seeking the next horizon, always wondering if there\'s a truer truth around the bend. This is healthy — what ACT calls "values as direction rather than destination" — but it can also mean your values feel unstable to a partner who wants to know where you stand.\n\nAs Rumi wrote, "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray." Your openness lets you follow that pull, but without commitment, the pull becomes wandering rather than pilgrimage.' : cHigh ? 'Your conscientiousness (C: ' + Math.round(getC(s)) + 'th) means you take values seriously and work hard to live them — what ACT researchers call "committed action" at a temperamental level. This integrity is genuine and admirable. In Jungian terms, you carry the archetype of the Builder: someone who constructs their life according to a blueprint of meaning.\n\nBut as Pema Chödrön warned, "Holding on to beliefs limits our experience of life." The risk is rigidity — holding values so tightly that they become rules rather than guides, what Schema Therapy calls the Punitive Parent mode operating through conscientiousness. Your values become a cage rather than a compass.' : 'Your specific temperament creates a unique relationship with your values — shaping which ones you gravitate toward and how you live them. In ACT terms, your personality determines the "behavioral repertoire" available for values-committed action. Some values come naturally to your temperament; others require deliberate effort.\n\nAs Mary Oliver wrote, "Tell me, what is it you plan to do with your one wild and precious life?" Your temperament is the "wild" — the biological given. Your values are the "precious" — the chosen direction. The intersection determines how you answer that question.'}${avgGap >= 3 ? `\n\nYour values-action gap (${avgGap.toFixed(1)}/10) suggests your temperament may be working against your values in some areas — what ACT researchers call "values-behavior discrepancy." In IFS terms, certain parts driven by temperamental impulses may be overriding the Self's values-directed intentions.` : ''}`,
    arc: {
      protection: oHigh ? 'Keeping values flexible meant never being trapped by them — what ACT calls "values flexibility" taken to an extreme. In Polyvagal terms, your open temperament keeps your system in exploration mode rather than commitment mode, which feels like freedom but can actually be a form of avoidance.' : cHigh ? 'Structured values provided clarity and direction when life was chaotic — what Schema Therapy identifies as the Overcontroller mode finding constructive expression through conscientiousness. Your values became the architecture of safety in an uncertain world.' : 'Your temperament naturally aligned with certain values and resisted others — a process psychologists call "temperament-values congruence." The values that match your temperament feel effortless; the ones that don\'t feel like swimming upstream.',
      cost: oHigh ? 'Partners may wish you\'d commit more firmly to shared values — what Gottman calls "shared meaning systems." Your exploratory relationship with values can feel to a committed partner like the ground is always shifting beneath them. In EFT terms, they can\'t build a secure base on values that might change tomorrow.' : cHigh ? 'Rigidity around values can become what Gottman calls "gridlocked conflict" — disagreements that never resolve because your position is experienced as moral law rather than personal preference. In IFS terms, your Perfectionist Manager uses values as weapons against both yourself and others, creating judgment where compassion is needed.' : 'Some of your "values" may actually be temperamental preferences in disguise — what psychologists call "value-temperament confusion." The difference matters: genuine values can be held loosely while still guiding behavior; temperamental preferences masquerading as values create unnecessary rigidity.',
      emergence: oHigh ? 'Ground your exploration in commitment — what Kegan\'s Fourth Order makes possible: chosen values held firmly enough to guide but loosely enough to question. Values that can\'t withstand questioning aren\'t values. But values that are never held firmly can\'t guide. Find the middle path.' : cHigh ? 'Soften your grip on values enough to let them be alive, not just rules. In Erikson\'s Generativity framework, mature values aren\'t laws to enforce but gifts to offer. A value you can\'t question is just a habit wearing a moral costume.' : 'Distinguish between values you\'ve chosen and temperamental tendencies you\'ve labeled as values. In Kegan\'s terms, this is the move from Third Order (values as inherited assumptions) to Fourth Order (values as conscious commitments). The distinction changes everything.',
    },
    practice: oHigh
      ? 'Pick your most important value this week. Before bed one night, write a paragraph — by hand, not typed — about why it matters and what you\'d sacrifice for it. Let it be specific and committed, not hypothetical. Read it aloud to your partner. Let the commitment be witnessed.'
      : cHigh
      ? 'Pick a value you hold strictly — the one where you\'re most rigid. This week, ask: "If this value could bend without breaking, what would that look like?" Experiment with one day of flexibility: hold the value as a guide rather than a rule. Notice whether the value survives the flexibility. (It will.)'
      : 'List your top 3 values. For each one, ask: "Is this a genuine value I\'ve chosen, or a personality preference I\'ve elevated to a principle?" The distinction matters because values can grow while temperamental preferences just repeat.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['instrument', 'compass'],
    confidence: 'high',
  };
});

// Differentiation × Conflict (stance × conflict)
register('stance', 'conflict', (s) => {
  const diffHigh = getDSITotal(s) >= 60;
  const iPos = getIPosition(s);
  const reactivity = getReactivity(s);
  const style = getConflictStyle(s);

  return {
    title: !diffHigh && style === 'forcing' ? 'The Reactive Escalator'
      : diffHigh && style === 'avoiding' ? 'The Chosen Distance'
      : !diffHigh && style === 'avoiding' ? 'The Flooded Retreater'
      : diffHigh && style === 'problemSolving' ? 'The Grounded Problem-Solver'
      : 'Your Selfhood × Conflict Dance',
    subtitle: 'Your differentiation × conflict style',
    body: !diffHigh && style === 'forcing'
      ? `Low differentiation (${Math.round(getDSITotal(s))}) meets a forcing style. This is the reactive escalator pattern: conflict triggers emotional flooding, and without a solid "I" to anchor to, you fight harder and louder to compensate. The volume isn't confidence — it's the absence of a calm center. In Bowen's terms, this is low differentiation expressed as "emotional reactivity channeled through aggression" — the less self you have to stand on, the louder you stand.\n\nAs Rumi wrote, "Silence is the language of God; all else is poor translation." Your escalation is that poor translation — the raw, unprocessed signal of needs and fears that haven't found words yet. In Polyvagal terms, conflict sends your system directly into sympathetic mobilization without the ventral vagal braking that differentiation provides. In IFS, your Firefighter parts escalate because your Self doesn't have enough presence to hold the tension. In Gottman's research, this pattern predicts what he calls "the Four Horsemen" — criticism, contempt, defensiveness, stonewalling — because escalation inevitably triggers counter-escalation or withdrawal.\n\nThe Jungian archetype is the Berserker — the warrior without a king, all force and no strategy. The king (your differentiated self) is what converts raw power into purposeful action.`
      : diffHigh && style === 'avoiding'
      ? `High differentiation (${Math.round(getDSITotal(s))}) with conflict avoidance is interesting: you CAN hold your ground, but you choose not to engage. This isn't fusion-driven avoidance — it's strategic. You know who you are and what you think. You just don't think most fights are worth having. In Bowen's framework, this is the "over-differentiated" position: so clear about your own perspective that engaging with another's feels like unnecessary friction.\n\nAs Wendell Berry wrote, "It is not from ourselves that we learn to be better than we are." Your strategic avoidance may be protecting your self-definition at the expense of the relational growth that only conflict can provide. In EFT terms, your partner experiences your avoidance not as fear (which they could empathize with) but as dismissal (which triggers their own attachment wounds). In ACT terms, you may be using your differentiation as a form of "experiential avoidance" — choosing not to feel the discomfort of conflict because you have the ego-strength to simply walk away.\n\nThe Jungian archetype is the Sage who has withdrawn from the world — wise but uninvolved. Wisdom without engagement becomes irrelevance.`
      : `Your differentiation (${Math.round(getDSITotal(s))}) shapes the quality of your ${style} conflict style in ways that determine whether conflict strengthens or erodes your relationships. ${diffHigh ? 'With strong self-definition, your conflict engagement comes from what Bowen called "a solid self" — your positions are chosen rather than reactive, your boundaries are clear rather than rigid. In Polyvagal terms, your ventral vagal tone stays online during disagreement, giving you access to the social engagement system that makes productive conflict possible.' : 'As differentiation develops, your conflict style will shift from reactive to chosen — what Kegan describes as the move from being "subject to" your conflict pattern to "having" it as something you can observe and modify.'}\n\nAs Pema Chödrön wrote, "The most difficult times for many of us are the ones we give ourselves." The intersection of selfhood and conflict is precisely where you give yourself the hardest times — or the most transformative ones. In IFS terms, conflict is the arena where your Self's strength (or absence) becomes most visible.`,
    arc: {
      protection: !diffHigh && style === 'forcing'
        ? 'Volume compensated for lack of center — what Bowen would call "emotional reactivity in the absence of a solid self." If you can\'t hold your ground calmly, you hold it loudly. The forcing was never about the issue; it was about the terrifying experience of having no firm ground to stand on when challenged.'
        : diffHigh && style === 'avoiding'
        ? 'You chose battles carefully, preserving your differentiated equilibrium for what truly matters. In ACT terms, this is "workability" — does engagement serve your values? But the strategy can become a blanket policy that avoids ALL conflict, including the conflicts that would deepen the relationship.'
        : `Your ${style} approach reflects your current level of self-definition — in Polyvagal terms, the amount of ventral vagal braking available during interpersonal stress. ${diffHigh ? 'Your strong differentiation gives you a regulated baseline.' : 'Your developing differentiation means conflict can destabilize your sense of self.'}`,
      cost: !diffHigh && style === 'forcing'
        ? 'Escalation damages trust and connection — what Gottman calls "negative sentiment override," where the accumulated impact of intense conflict colors even positive interactions with fear. Partners learn to avoid triggering you, which means real issues go underground and the relationship loses its capacity for honesty.'
        : diffHigh && style === 'avoiding'
        ? 'Your partner may need more engagement than you offer. In EFT terms, your "chosen" avoidance still produces the same result as fear-driven avoidance: unresolved issues and a partner who feels their emotional reality doesn\'t matter enough to you to warrant discomfort. Choosing not to fight can communicate "I don\'t care" — even when you do.'
        : diffHigh ? 'Your groundedness may make you seem inflexible — what partners experience as "you always think you\'re right." In Gottman\'s terms, this can trigger the "Four Horsemen" in the other direction: their defensiveness and contempt in response to your perceived superiority.' : 'Reactivity undermines the valid points you\'re trying to make — what DBT calls "interpersonal ineffectiveness." Your positions may be sound, but the delivery ensures they won\'t be heard.',
      emergence: !diffHigh && style === 'forcing'
        ? 'Building a calm center — what Bowen called "developing a solid self" — transforms your engagement from escalation to advocacy. In Kegan\'s framework, this is the Fourth Order move: having your intensity rather than being had by it. Same position, profoundly different impact. Same fire, but now with a hearth.'
        : 'Balance your current pattern with its opposite: if you avoid, practice what DBT calls "opposite action" — engaging when your system says retreat. If you force, practice pausing — what Gottman calls "physiological self-soothing" before re-engaging. In Erikson\'s Generativity framework, mature conflict serves the relationship, not just the self.',
    },
    practice: !diffHigh && style === 'forcing'
      ? 'When you feel the urge to escalate this week, try this physical grounding: press your feet into the floor, take one deep breath, and silently count to five. Then restate your position at half the volume. Say: "What I\'m trying to say is ___." The content stays; the reactivity leaves. One conflict this week. That\'s the goal.'
      : diffHigh && style === 'avoiding'
      ? 'Pick one issue you\'ve been strategically avoiding — you know which one. This week, bring it up. Start with: "There\'s something I\'ve been choosing not to raise, and I think that\'s not fair to you. Can we talk about ___?" Engage with it — not because you must, but because your partner deserves your willingness to be uncomfortable.'
      : 'This week, notice how your sense of self shifts during conflict. When do you feel most "you"? When do you feel least "you"? Write down one observation. That awareness is the foundation of every conflict skill that follows.',
    oneThing: !diffHigh && style === 'forcing' ? 'Find your center first. Then speak. The world can wait five seconds for your grounded voice.' : null,
    depth: 'pairwise',
    domains: ['stance', 'conflict'],
    confidence: 'high',
  };
});

// Differentiation × Values (stance × compass)
register('stance', 'compass', (s) => {
  const diffHigh = getDSITotal(s) >= 60;
  const iPos = getIPosition(s);
  const topValues = getTopValues(s);
  const avgGap = getAvgValueGap(s);

  return {
    title: !diffHigh && avgGap >= 3 ? 'The Lost Compass'
      : diffHigh && avgGap < 3 ? 'The Integrated Self'
      : 'Your Selfhood × Values',
    subtitle: 'Your differentiation × values',
    body: `${!diffHigh && avgGap >= 3
      ? `When differentiation is developing (${Math.round(getDSITotal(s))}) and values are misaligned with actions (gap: ${avgGap.toFixed(1)}/10), it often means you know what matters but can't hold it against social pressure. Your values (${topValues.slice(0, 3).join(', ')}) get overridden by the need for approval, the pull of fusion, or the fear of standing alone. In Bowen's terms, this is the hallmark of a "pseudo-self" — a self that borrows its values from whoever is closest rather than generating them from within.\n\nAs James Hillman wrote, "We don't describe the soul with too much precision — we evoke it, and let it speak." Your values ARE the soul's speech, but without differentiation, they get drowned out by the noise of social expectation and relational pressure. In ACT terms, this is "values identification without values commitment" — you can name your direction but can't walk toward it because the interpersonal cost feels too high. In IFS, your Self knows what matters, but the Manager parts (focused on approval and safety) override the Self's values-directed intentions.\n\nThe Jungian archetype here is the Exile in the Wilderness — carrying sacred knowledge but unable to return to the community and speak it. Your values are that sacred knowledge. Your differentiation is the road back.`
      : diffHigh && avgGap < 3
      ? `Strong differentiation (${Math.round(getDSITotal(s))}) and aligned values create a person who knows what they stand for and lives it. Your values (${topValues.slice(0, 3).join(', ')}) aren't just ideals — they're lived practice. In Bowen's framework, this is the expression of a "solid self": values that don't shift based on who's in the room. In ACT terms, you demonstrate what researchers call "values-congruent living" — the strongest predictor of psychological wellbeing and relational satisfaction.\n\nAs Wendell Berry wrote, "The world is not to be put in order; the world is order. It is for us to put ourselves in unison with this order." Your aligned values are that unison — the harmony between what you believe and what you do. In Jungian terms, you've achieved a measure of individuation in this domain: your values are genuinely yours, tested by experience, and lived with consistency.\n\nThe gift — and the responsibility — is that this integration radiates outward. Gottman's research shows that values-aligned partners create what he calls "shared meaning systems" that give relationships depth and direction beyond the daily logistics of life together.`
      : `Your differentiation (${Math.round(getDSITotal(s))}) affects how firmly you can hold your values (${topValues.slice(0, 3).join(', ')}) when relationships make it difficult — what Bowen called "the acid test of differentiation."${avgGap >= 3 ? ` The gap (${avgGap.toFixed(1)}/10) suggests there's work to do — not just on values but on the self that holds them.` : ' Your relative alignment suggests a functional relationship between selfhood and values.'}\n\nAs Khalil Gibran wrote, "Say not, 'I have found the truth,' but rather, 'I have found a truth.'" The intersection of differentiation and values is precisely this distinction: the humility to hold your truth as genuinely yours while acknowledging it's not the only truth in the room. In ACT terms, this is "values flexibility" — committed direction without rigid destination.`
    }`,
    arc: {
      protection: !diffHigh ? 'Without strong self-definition, values became negotiable — what Bowen called the "pseudo-self" adapting to whoever was closest. In Polyvagal terms, your nervous system prioritized social harmony (maintaining ventral vagal connection) over values integrity, because standing alone felt neurologically like danger.' : 'Strong self-definition provided an anchor for your values, even under relational pressure — what Bowen called the "solid self" that doesn\'t negotiate its core positions based on anxiety or the need for approval. In IFS terms, your Self leads your values rather than your Manager parts.',
      cost: !diffHigh && avgGap >= 3
        ? 'You live someone else\'s values while your own gather dust — what ACT researchers call "values-incongruent living," the primary source of existential malaise. The resentment isn\'t about them — it\'s about you not standing for what you believe. In Schema Therapy, this is the Subjugation schema at the values level: "My convictions matter less than keeping the peace."'
        : diffHigh && avgGap < 3
        ? 'You may hold your values so firmly that there\'s no room for your partner\'s — what Gottman calls "gridlocked conflict" when two value systems compete rather than coexist. In Kegan\'s Fifth Order (Self-Transforming), integration isn\'t just about living YOUR values — it\'s about creating space for two value systems to exist, sometimes in tension, always in dialogue.'
        : 'The gap between your values and your self-definition creates internal tension — what IFS calls "parts conflict" — that inevitably shows up in relationships as displaced frustration, vague dissatisfaction, or the sense that something essential is missing.',
      emergence: !diffHigh
        ? 'As your differentiation grows, your values will have a voice — what Kegan\'s Fourth Order makes possible. Not rigidity but what Bowen called the "I-position": the quiet, grounded ability to say "this matters to me" without it feeling dangerous. In Erikson\'s Identity framework, this is the foundational work: knowing who you are so that Intimacy can be between two real people.'
        : 'Your integrated self is a gift to your relationships. In Erikson\'s Generativity stage, the invitation is to use your values-alignment not to impose but to inspire — helping your partner find their own values-alignment through your example rather than your instruction.',
    },
    practice: !diffHigh && avgGap >= 3
      ? 'Pick your most important value. This week, live it in one visible way — even if it means slight social discomfort. If you value honesty, tell one truth you\'ve been withholding. If you value presence, put your phone away for an entire evening. Notice how it feels to stand for something. The discomfort is your differentiation growing.'
      : 'This week, share your top value with your partner over a quiet meal. Then ask: "What\'s your most important value right now?" Listen without comparing. Notice where they differ from yours without trying to align them. Two different value systems can coexist — that\'s what mature love looks like.',
    oneThing: !diffHigh && avgGap >= 3 ? 'Your values are waiting for the self that can hold them. Build that self, and they will finally have a home.' : null,
    depth: 'pairwise',
    domains: ['stance', 'compass'],
    confidence: 'high',
  };
});

// EQ × Values (navigation × compass)
register('navigation', 'compass', (s) => {
  const eqHigh = getEQTotal(s) >= 65;
  const topValues = getTopValues(s);
  const avgGap = getAvgValueGap(s);

  return {
    title: eqHigh && avgGap >= 3 ? 'The Perceptive Hypocrite'
      : eqHigh && avgGap < 3 ? 'Emotional Wisdom in Action'
      : 'Your Emotional Skill × Values',
    subtitle: 'Your EQ × values',
    body: eqHigh && avgGap >= 3
      ? `Here's a painful intersection: you have strong emotional perception (EQ: ${Math.round(getEQTotal(s))}) AND a significant values-action gap (${avgGap.toFixed(1)}/10). This means you can SEE the gap — you're emotionally intelligent enough to know you're not living your values (${topValues.slice(0, 3).join(', ')}). But seeing it and closing it are different skills. In ACT terms, this is "cognitive fusion with self-knowledge" — you're so absorbed in knowing the gap that knowing becomes the activity, replacing the action it was supposed to inspire.\n\nThe awareness without the action creates a particular kind of suffering that existential psychologists call "bad faith" — the conscious choice to live inauthentically while being fully aware that you're doing so. In IFS terms, your perceptive Self sees the gap clearly, but a Protector part has convinced the system that seeing the gap is the same as closing it. As T.S. Eliot wrote, "Between the idea and the reality, between the motion and the act, falls the Shadow." Your EQ illuminates the shadow perfectly. But illumination alone doesn't move the body.\n\nIn Schema Therapy, this pattern often reflects the Detached Self-Soother mode: the part that finds comfort in self-knowledge rather than self-change. Your emotional intelligence has become a sophisticated form of emotional avoidance — you process the gap so thoroughly that processing replaces acting. The Jungian archetype is the Analyst — endlessly examining the wound, never applying the balm.`
      : `Your emotional intelligence (${Math.round(getEQTotal(s))}) shapes how you relate to your values (${topValues.slice(0, 3).join(', ')}). ${eqHigh ? 'High EQ means you can navigate the emotional complexity of living your values in relationship — what ACT calls "psychological flexibility in the service of committed action." You can feel the discomfort that values-aligned living sometimes requires and choose to act anyway. In Polyvagal terms, your ventral vagal tone keeps you regulated enough to hold both the emotional challenge and the values direction simultaneously.' : 'As your EQ develops, it will help you manage the emotional challenges of values-aligned living. In ACT terms, every gain in emotional skill makes "committed action" more accessible — you need less willpower and more capacity.'}\n\nAs Mary Oliver wrote, "Tell me, what is it you plan to do with your one wild and precious life?" Your emotional intelligence is the compass needle; your values are magnetic north. ${eqHigh ? 'The needle points true, and you have the skills to follow it.' : 'The needle is still calibrating, but it\'s pointing in the right direction.'}`,
    arc: {
      protection: eqHigh && avgGap >= 3
        ? 'Awareness became a substitute for action — what psychologists call "the insight trap." Knowing you should change felt almost as good as changing, because the knowing itself produced the emotional experience of growth without the behavioral cost. In IFS terms, your Intellectual Manager convinced the system that understanding the gap IS closing it. It\'s a sophisticated, emotionally intelligent way to avoid the discomfort of actual transformation.'
        : 'Your EQ developed as a way to navigate the emotional world. How it serves your values depends on how intentionally you connect perception (what you see) with commitment (what you do). In Polyvagal terms, emotional awareness without values-directed action is like having a compass without legs.',
      cost: eqHigh && avgGap >= 3
        ? 'Self-judgment — what Schema Therapy calls the Punitive Parent mode turning inward. You see the gap, feel it keenly, and judge yourself harshly for it — which paradoxically makes change harder because self-punishment depletes the very energy that change requires. In ACT terms, "fusion with self-as-failure" replaces the flexible self-awareness that could actually motivate action.'
        : !eqHigh ? 'Without strong EQ, living your values in emotionally complex situations (relationships, conflict, vulnerability) becomes harder — what ACT calls "the experiential avoidance barrier." You know what matters but can\'t navigate the feelings that stand between you and living it.' : 'Minimal cost here — this is a powerful combination. The invitation is to use it fully: let your EQ serve your values actively, not just passively.',
      emergence: eqHigh && avgGap >= 3
        ? 'Use your emotional intelligence to understand WHAT keeps the gap open — not as judgment, but as information. In IFS terms, ask: "What part of me is protecting the gap?" In ACT terms, ask: "What emotion am I avoiding by not living this value?" In Kegan\'s Fourth Order, this becomes: "Can I hold both the discomfort and the direction at the same time?" That holding is the doorway.'
        : 'Growing the connection between your emotional skills and your values creates what Erikson called the foundation of Integrity — the final stage of development, where what you know, what you feel, and what you do converge into a single, authentic life.',
    },
    practice: eqHigh && avgGap >= 3
      ? 'Pick the value with the biggest gap. This week, instead of trying to close it through willpower, get curious. Sit down with a journal for ten minutes and answer one question: "What emotion am I avoiding by not living this value?" Don\'t try to fix it. Just let the answer arrive. Your EQ is more than capable of finding it. That answer is the key to the lock you\'ve been pushing against.'
      : 'This week, notice one moment where your emotional state pulled you away from a value — where how you felt overrode what you believe. Don\'t judge it. Just notice: "My feeling of ___ pulled me away from my value of ___." Then ask: "What would it take to hold both the feeling AND the value at the same time?" That question is where emotional intelligence meets integrity.',
    oneThing: eqHigh && avgGap >= 3 ? 'Awareness without action is the most comfortable trap. Your insight is real — now let it move your feet.' : null,
    depth: 'pairwise',
    domains: ['navigation', 'compass'],
    confidence: 'high',
  };
});

// Attachment × Values (foundation × compass)
register('foundation', 'compass', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);
  const topValues = getTopValues(s);
  const avgGap = getAvgValueGap(s);

  return {
    title: anxious ? 'The Values-Connection Tension'
      : avoidant ? 'The Independent Values Keeper'
      : 'Your Attachment × Values',
    subtitle: 'Your attachment × values',
    body: anxious
      ? `Your attachment anxiety pulls toward connection at all costs — and that "all costs" often includes your values (${topValues.slice(0, 3).join(', ')}). When connection feels threatened, values become negotiable. "I believe in honesty, but if being honest might push them away..." This isn't weakness. It's the hierarchy your nervous system learned: connection first, values second — because in your early world, connection WAS survival, and values were a luxury you couldn't afford.\n\nIn IFS terms, your Attachment Manager overrides your Values-Holding Self whenever the system detects a threat to the bond. In Schema Therapy, this reflects the Subjugation schema at the deepest level: "I must abandon my own truth to keep the other person close." As Khalil Gibran wrote, "And stand together yet not too near together: for the pillars of the temple stand apart." Your anxiety has pulled the pillars together until the temple risks collapse.${avgGap >= 3 ? `\n\nYour gap (${avgGap.toFixed(1)}/10) likely reflects this trade-off — each point of that gap represents a moment where you chose connection over conviction. In ACT terms, this is "values-incongruent living driven by attachment fear."` : ''}\n\nThe Jungian archetype at work is the Devoted One in shadow — so committed to the bond that the self within it dissolves. Polyvagal theory explains the mechanism: when your neuroception detects disconnection threat, your ventral vagal system prioritizes social engagement (staying connected) over any other drive, including the drive toward authenticity.`
      : avoidant
      ? `Your avoidant attachment creates space for your values (${topValues.slice(0, 3).join(', ')}) to live independently — you don't compromise them for connection because connection isn't the priority. This looks like integrity, and sometimes it genuinely is. But sometimes "sticking to my values" is avoidance in a philosophical costume. In IFS terms, your Values-Holding parts may be recruited by your Avoidant Protector: "See, I can't get close — my values won't allow it."\n\nAs David Whyte wrote, "The antidote to exhaustion is not necessarily rest. The antidote to exhaustion is wholeheartedness." Your values may be authentic, but if they're being used to justify distance, they're operating at half-heart — protecting rather than expressing the whole self. In Schema Therapy, this can reflect the Emotional Inhibition schema wearing the mask of principled conviction.${avgGap >= 3 ? `\n\nYet your gap (${avgGap.toFixed(1)}/10) shows even self-sufficiency doesn't guarantee values alignment — the gap suggests something else is getting in the way, perhaps the very avoidance that uses values as its shield.` : ''}\n\nThe Jungian archetype is the Hermit-Philosopher — wise and principled but potentially using wisdom as a wall. In Polyvagal terms, your values serve the dorsal vagal need for safe distance as much as they serve the Self's need for meaning.`
      : `Your secure base lets you hold both connection AND values — neither needs to be sacrificed for the other. This is the integrated position that Bowen described as the hallmark of high differentiation and that Erikson identified as the fruit of resolved Identity and Intimacy stages: you can be close and true simultaneously.\n\nAs Rumi wrote, "Out beyond ideas of wrongdoing and rightdoing, there is a field. I'll meet you there." Your security lets you inhabit that field — a space where your values and your partner's values can coexist without either needing to dominate. In Polyvagal terms, your ventral vagal tone is strong enough to hold both the relational engagement and the values commitment without dropping either one.\n\nIn IFS terms, your Self leads — neither the Attachment Manager nor the Values Protector dominates, and both can contribute without hijacking the system. This is rare, and it creates the conditions for what Gottman calls "shared meaning" — the deepest level of relationship satisfaction.`,
    arc: {
      protection: anxious ? 'Sacrificing values preserved connection — what your nervous system identified as the non-negotiable priority. In Polyvagal terms, values can wait; the ventral vagal drive for social bonding can\'t. This makes perfect survival sense: in your early world, abandonment was the primary threat, and authenticity was a risk you couldn\'t afford.' : avoidant ? 'Values served as a reason not to compromise — which also meant not to get too close. In ACT terms, values became "rules for avoidance" rather than "directions for living." "I won\'t compromise" sounds principled but can mean "I won\'t be vulnerable enough to let connection change what I believe."' : 'Security provided the stable foundation for values to develop without being warped by attachment needs — what developmental psychologists call "the secure base effect extending into the moral domain." Your values are genuinely yours because you didn\'t have to sacrifice them for safety.',
      cost: anxious ? 'Accumulated self-betrayal — what ACT researchers call "the long-term cost of experiential avoidance." You traded pieces of yourself for connection and lost track of what you traded. In EFT terms, each compromise created a small "attachment injury" — not with your partner but with yourself.' : avoidant ? 'Using values as barriers to intimacy creates what EFT calls "emotional inaccessibility dressed as principle." "I won\'t compromise" sounds like integrity but can mean "I won\'t be vulnerable." Your partner experiences your values not as conviction but as a wall with a philosophy painted on it.' : 'Be mindful that your privilege of security doesn\'t create what therapists call "empathy blindness" — difficulty understanding how hard this balance is for partners whose nervous systems forced them to choose between connection and conviction.',
      emergence: anxious ? 'Learning what EFT calls "secure functioning" — that true connection INCLUDES your values, not instead of them. In Kegan\'s Fourth Order, your values become non-negotiable aspects of your self-authored identity. A partner who needs you to abandon your values for the relationship isn\'t offering real connection — they\'re offering a deal.' : avoidant ? 'Softening values into invitations rather than walls — what Kegan\'s Fifth Order (Self-Transforming) makes possible. Share what matters to you as a bridge, not a barrier. In Erikson\'s Generativity stage, values become gifts to be offered, not positions to be defended.' : 'Continue modeling what Gottman calls "shared meaning creation" — the capacity for two value systems to coexist and enrich each other.',
    },
    practice: anxious
      ? 'Identify one value you tend to sacrifice for connection. This week, hold it — gently, without ultimatums. When the urge to compromise arises, say to yourself: "My values belong IN this relationship, not outside it." Then say to your partner: "This matters to me, and I need to honor it." Just once. Just one value. Just this week.'
      : avoidant
      ? 'Share a value with your partner this week — not as a boundary or a position, but as vulnerability: "This matters to me because..." and then tell them the personal story behind it. Let the value become a bridge rather than a wall. Let them see what it costs you to care about this. That\'s intimacy.'
      : 'Ask your partner this week: "Which of your values do you find hardest to hold inside our relationship?" Listen without defending. If what they say touches a nerve, notice the nerve without reacting. Their values matter as much as yours.',
    oneThing: anxious ? 'Your values belong in the relationship, not outside it. Any love that requires you to abandon yourself is not love.' : null,
    depth: 'pairwise',
    domains: ['foundation', 'compass'],
    confidence: 'high',
  };
});

// Attachment × Field (foundation × field)
register('foundation', 'field', (s) => {
  const anxious = isAnxious(s);
  const avoidant = isAvoidant(s);

  return {
    title: anxious ? 'The Anxious Antenna'
      : avoidant ? 'The Distant Observer'
      : 'Your Attachment × Relational Field',
    subtitle: 'Your attachment × field awareness',
    body: anxious
      ? `Your attachment anxiety makes you acutely attuned to the relational field — you feel every shift in the space between you and your partner. In ecopsychological terms, you are like a seismograph: exquisitely sensitive to the subtlest tremors in the relational ground. But anxiety distorts the signal. You detect real changes AND project threat onto neutral space. In Polyvagal terms, your neuroception is always scanning the field for danger cues, overlaying threat onto what may actually be safety.\n\nAs Rumi wrote, "The art of knowing is knowing what to ignore." Your growth edge is precisely this: learning to read the field without your attachment alarm adding its own data to the signal. In EFT terms, this is distinguishing between "raw spots" (real relational injuries) and "phantom pain" (attachment projections). In IFS, it's helping your Hypervigilant Manager part trust that the Self can receive field data without panic. The sensitivity is a gift — the distortion is what needs healing.`
      : avoidant
      ? `Your avoidant attachment creates a peculiar relationship with the relational field: you may be able to observe it from a distance but struggle to participate in it. You see the space between as something to manage rather than something to inhabit. In Jungian terms, you relate to the field like an anthropologist rather than a native — studying it without being of it.\n\nAs John O'Donohue wrote, "Real friendship or love is not manufactured or achieved by an act of will or intention. Friendship is always an act of recognition." The relational field is where that recognition happens — but your avoidance keeps you at an observational distance. In Polyvagal terms, your dorsal vagal tendency creates a buffer between you and the field's emotional resonance. In IFS, your Observer Manager watches the field while your Exile — the part that longs to swim in it — stays safely behind the glass.`
      : `Your secure attachment gives you clean access to the relational field — what Martin Buber called the "I-Thou" encounter. Without the distortion of anxiety or the distance of avoidance, you can sense what's actually happening in the space between you and another person. In Polyvagal terms, your ventral vagal tone provides a stable platform for "neuroception" — the automatic detection of relational safety and danger.\n\nAs Khalil Gibran wrote, "Love one another, but make not a bond of love: let it rather be a moving sea between the shores of your souls." Your security lets you swim in that sea without drowning or standing on the shore watching. In EFT terms, this is "emotional accessibility and responsiveness" — the capacity to be moved by the relational field while remaining your own person within it.`,
    arc: {
      protection: anxious ? 'Hypervigilance to the field meant never being surprised by disconnection — in Polyvagal terms, your neuroception was calibrated to "always scanning" because being surprised by abandonment was the original wound. This constant field-reading was exhausting but necessary in its original context.' : avoidant ? 'Observing from outside the field kept you safe from its intensity — what attachment researchers call "deactivating strategies applied to the relational space." If you never fully enter the field, you never fully feel its pull, its warmth, or its pain.' : 'Security allowed natural field awareness without distortion — what Porges calls "neuroception in a regulated state." You read the field from a place of safety rather than survival.',
      cost: anxious ? 'Constant scanning exhausts you and creates false alarms that erode trust — both your trust in your own perception and your partner\'s trust that your readings are accurate. In Gottman\'s terms, your "positive sentiment override" gets replaced by "negative sentiment override" because your field readings consistently lean toward threat.' : avoidant ? 'You miss the richness of what happens when you\'re IN the field rather than watching it. In EFT terms, the co-regulatory power of the relational space — the healing that happens just by being present with another nervous system — goes unused. You observe the medicine without taking it.' : 'Minimal — awareness from security is reliable and undistorted. The only risk is not sharing it, which would waste a gift.',
      emergence: anxious ? 'Trust what the field is actually telling you — what ACT calls "defusion from threat narratives." Practice receiving the signal without amplifying it. In Kegan\'s Fourth Order, you can hold field awareness as data rather than emergency.' : avoidant ? 'Step into the field — what Buber called moving from "I-It" to "I-Thou." Let yourself be affected by the space between, not just aware of it. In Erikson\'s Intimacy stage, this is the invitation to participate in rather than observe relationship.' : 'Your clean field awareness is a relational gift. In Erikson\'s Generativity stage, sharing it — modeling it — becomes your contribution to the relational world.',
    },
    practice: anxious
      ? 'When you sense something in the relational space this week, sit with it for 60 full seconds before naming it. Breathe slowly. Often the initial threat-intensity will settle, and the real signal — quieter, more nuanced — will emerge from underneath. Then say: "I\'m sensing ___ between us. Is that accurate?" Let the answer land before reacting.'
      : avoidant
      ? 'This week, try this once: close your eyes with your partner for 30 seconds. Just breathe together. Don\'t speak, don\'t analyze. Notice what you feel in the space between you — warmth, distance, tension, peace, nothing. Whatever you feel IS the field. You don\'t have to do anything with it. Just notice that it exists.'
      : 'This week, share what you sense in the relational space with your partner at least twice. "I notice we feel really close right now" or "I sense some distance between us today." Model field awareness. Invite them to share their reading. The dialogue about the field IS the field becoming conscious.',
    oneThing: null,
    depth: 'pairwise',
    domains: ['foundation', 'field'],
    confidence: 'emerging',
  };
});

// Personality × Field (instrument × field)
register('instrument', 'field', (s) => ({
  title: 'Your Temperament × The Space Between',
  subtitle: 'Your personality × relational field',
  body: `Your personality traits shape how you experience the relational field — the invisible space between you and your partner where connection lives. ${getN(s) >= 65 ? 'Your sensitivity (N: ' + Math.round(getN(s)) + 'th) means you feel the field intensely — every shift, every nuance, every micro-change in emotional weather. In ecopsychological terms, you are a barometer for the relational atmosphere. As Rilke wrote, "No feeling is final." Your sensitive temperament experiences the field as constantly in motion — which it is, but perhaps not as dramatically as your nervous system reports.' : getE(s) >= 65 ? 'Your extraverted energy (E: ' + Math.round(getE(s)) + 'th) means you tend to fill the field with action and conversation rather than sitting in its quiet. In Jungian terms, your extraversion relates to the field through doing rather than being — filling the space rather than listening to it. As David Whyte wrote, "Silence is the homeland of the soul." Your soul may be homesick for a space your temperament keeps filling.' : 'Your specific temperament creates a unique relationship with the subtle space between you and your partner. In Polyvagal terms, your autonomic baseline determines which frequencies of the relational field you naturally pick up — and which ones fall outside your perceptual range.'}\n\nIn IFS terms, your temperament determines which parts most readily engage with the relational field and which parts stay quiet. The field itself is always broadcasting — the question is which channels your temperament is tuned to receive. In EFT terms, this is about "emotional accessibility" — not just willingness to be present, but the temperamental capacity to perceive what's present.`,
  arc: {
    protection: 'Your temperament determined which aspects of the field you noticed first — and which you learned to ignore. In Polyvagal terms, your autonomic nervous system\'s default setting created a perceptual filter that let some field-data through and blocked the rest. This wasn\'t conscious choice — it was biological inheritance shaping relational experience.',
    cost: getN(s) >= 65 ? 'Oversensitivity to field fluctuations can make the relational space feel unstable — what Gottman calls "negative sentiment override" applied not to behavior but to the field itself. You may read threat in what is actually normal relational ebb and flow.' : getE(s) >= 65 ? 'Filling the space with activity can prevent you from sensing what\'s already there — what contemplative psychologists call "the noise that prevents hearing." In EFT terms, your partner may need you to receive before you broadcast. The field has its own voice; your temperament may be speaking over it.' : 'Your temperamental defaults may blind you to parts of the field that don\'t match your natural attention pattern — like a radio tuned to one frequency, missing the music on other channels.',
    emergence: 'Expanding your field awareness beyond your temperamental default reveals layers of relational experience you\'ve been missing. In Kegan\'s terms, this is making your temperament "object" rather than "subject" — seeing it as a lens rather than assuming it\'s reality. In Erikson\'s Intimacy framework, the field is where two temperaments meet and create something neither could alone.',
  },
  practice: 'This week, spend 5 minutes in shared silence with your partner — no phones, no tasks, no music. Just sit together. Notice what arises in the space between you. What does your temperament want to do with the silence? (Fill it? Analyze it? Flee from it?) Practice letting the silence be. What remains when the noise stops is the field itself.',
  oneThing: null,
  depth: 'pairwise',
  domains: ['instrument', 'field'],
  confidence: 'emerging',
}));

// EQ × Field (navigation × field)
register('navigation', 'field', (s) => ({
  title: getEQTotal(s) >= 65 ? 'The Field Reader' : 'Building Field Perception',
  subtitle: 'Your EQ × relational field',
  body: `Your emotional intelligence (${Math.round(getEQTotal(s))}) is the primary tool for reading the relational field — the invisible space between you and your partner where the real relationship lives. ${getEQTotal(s) >= 65 ? 'Your high EQ gives you natural access to the subtle dynamics of the space between — you can sense shifts in emotional resonance, moments of connection and disconnection, and the quality of presence in the room. In Polyvagal terms, your well-developed neuroception picks up the micro-signals (vocal prosody, facial micro-expressions, body orientation) that constitute the field\'s "language."\n\nAs John O\'Donohue wrote, "The human soul is not meant to be observed; it is meant to be encountered." Your EQ lets you encounter the relational field rather than merely observe it. In IFS terms, your Self has enough presence to receive field-data without being overwhelmed by it — to sense the space between as information rather than emergency. In EFT terms, this is "emotional responsiveness" at its most refined: not just responding to what your partner says or does, but sensing the quality of the space you share.' : 'As your EQ develops, your ability to read the relational field will deepen. Right now, you may catch the big signals — a fight, a warm evening, obvious tension — but miss the subtleties: the moment when connection quietly shifts, the instant when presence becomes absence, the quality of silence that tells you everything.\n\nAs Mary Oliver wrote, "Attention is the beginning of devotion." Building your EQ is building your capacity for the kind of attention that the relational field requires — not analytical attention but what Polyvagal theory calls "neuroceptive awareness": the body\'s automatic reading of safety, danger, and connection in the space between two people. In IFS terms, as your Self gains more leadership, it can receive field-data that your Protector parts currently filter out.'}`,
  arc: {
    protection: 'EQ developed as a way to navigate interpersonal space — what evolutionary psychologists call "social intelligence." The field is where that skill lives and breathes. In Polyvagal terms, your emotional perception evolved precisely to read the relational field: to detect the micro-shifts in safety and danger that determine whether connection is possible.',
    cost: getEQTotal(s) >= 65 ? 'You may over-rely on field reading and miss more direct communication — what therapists call "empathic inference" replacing "empathic inquiry." Not everything needs to be sensed; sometimes it needs to be asked. In Gottman\'s terms, the field can become a substitute for actual conversation, creating a dynamic where your partner feels known but never asked.' : 'Missing field signals means missing context for what\'s happening in the relationship — what EFT calls "attachment cues" that go undetected. Without field awareness, you respond to content (what was said) but miss process (what was happening between you while it was said).',
    emergence: getEQTotal(s) >= 65 ? 'Let your field perception guide you toward naming what you sense — what Kegan\'s Fourth Order makes possible: translating pre-verbal awareness into relational language. The field + language = genuine relational transparency. In Erikson\'s Intimacy framework, this is the deepest level of knowing another person: sensing the invisible and giving it voice.' : 'Each small gain in EQ opens new channels of field awareness — what developmental psychologists call "perceptual scaffolding." In Kegan\'s terms, as you move from Third Order to Fourth Order, your capacity to read the relational field naturally expands because you can hold more complexity.',
  },
  practice: getEQTotal(s) >= 65
    ? 'This week, when you sense something in the relational field, practice naming it aloud: "I notice the space between us feels ___ right now." Warm, tense, distant, peaceful, charged — use whatever word arrives. Then ask your partner: "What are you sensing?" See if your readings match. This dialogue about the field IS the field becoming conscious.'
    : 'Start with the most basic field perception: this week, notice your own emotional state when you\'re with your partner versus when you\'re alone. What shifts? What stays the same? The difference between "me alone" and "me with them" IS the field. Write one observation each day. By the end of the week, you\'ll have a map of the space between.',
  oneThing: null,
  depth: 'pairwise',
  domains: ['navigation', 'field'],
  confidence: 'emerging',
}));

// Differentiation × Field (stance × field)
register('stance', 'field', (s) => ({
  title: getDSITotal(s) >= 60 ? 'The Differentiated Participant' : 'Finding Yourself in the Field',
  subtitle: 'Your differentiation × relational field',
  body: `Differentiation determines whether you can participate in the relational field without losing yourself in it — what Bowen considered the central question of relational maturity. ${getDSITotal(s) >= 60 ? `Your strong differentiation (${Math.round(getDSITotal(s))}) means you can enter the shared space between you and your partner while maintaining a clear sense of self. You can be moved by the field without being swept away by it. In Jungian terms, your ego container is sturdy enough to participate in the collective unconscious of the relationship without dissolving into it.\n\nAs Khalil Gibran wrote, "Sing and dance together and be joyous, but let each one of you be alone, even as the strings of a lute are alone though they quiver with the same music." Your differentiation is what lets you be that separate string — vibrating with shared music while maintaining your own note. In Polyvagal terms, your ventral vagal regulation is strong enough to co-regulate (enter the field) without losing self-regulation (losing yourself).` : `Your developing differentiation (${Math.round(getDSITotal(s))}) means the relational field can sometimes feel overwhelming — you enter the shared space and lose track of where you end and your partner begins. In ecopsychological terms, you are like a river delta: where your waters meet the ocean (the field), the distinction between fresh water and salt water disappears.\n\nAs Rumi wrote, "You are not a drop in the ocean. You are the entire ocean in a drop." But when differentiation is low, entering the relational field feels less like being the ocean in a drop and more like being a drop in the ocean — dissolved, boundary-less, lost. In IFS terms, your Self gets overwhelmed by the field's intensity, and Protector parts either push you into merger (fusion) or pull you to the edges (avoidance). The middle ground — what Bowen called "differentiated participation" — is the developmental frontier.`}`,
  arc: {
    protection: getDSITotal(s) >= 60 ? 'Strong boundaries let you participate in the field safely — what Bowen called "the differentiated self in relationship." In IFS terms, your Self leads even in the heightened emotional space of deep connection, receiving the field\'s data without losing its own perspective.' : 'The field\'s intensity may have taught you to stay at its edges rather than entering — what Polyvagal theory describes as the nervous system preferring the safety of observation over the vulnerability of participation. Without strong differentiation, entering the field felt like stepping into a current that might sweep you away.',
    cost: getDSITotal(s) >= 60 ? 'You might participate analytically rather than fully — what EFT researchers call "emotional engagement without emotional surrender." Your boundaries keep you safe but may keep you shallow. In Buber\'s terms, you risk staying in "I-It" relationship with the field rather than entering "I-Thou."' : 'You either merge with the field or avoid it — what Bowen called the "two extremes of emotional fusion." The middle ground — participated presence — is what DBT calls "wise mind" applied to the relational space: fully present, fully yourself.',
    emergence: 'The ideal is full field participation with maintained selfhood — what Kegan\'s Fifth Order describes: the capacity to be simultaneously transformed by relationship and grounded in self. Like two instruments playing together — distinct voices creating something neither could alone. In Erikson\'s terms, this is Intimacy achieved: the capacity to merge without losing, to differentiate without disconnecting.',
  },
  practice: getDSITotal(s) >= 60
    ? 'In a moment of connection this week — a good conversation, a shared silence, physical closeness — let yourself go slightly deeper than comfortable. Stay for ten more seconds than your boundaries suggest. Notice: you can always find yourself again. The finding-yourself-again IS the proof that your differentiation holds.'
    : 'In a moment of connection this week, practice a gentle internal check: "Am I still me right now?" Not pulling away — just verifying you\'re present as yourself within the shared space. If the answer is "I\'m not sure," that\'s valuable data, not a reason to flee. Just notice. That noticing IS differentiation practicing.',
  oneThing: null,
  depth: 'pairwise',
  domains: ['stance', 'field'],
  confidence: 'emerging',
}));

// Conflict × Field (conflict × field)
register('conflict', 'field', (s) => ({
  title: 'How Conflict Moves the Space Between',
  subtitle: 'Your conflict style × relational field',
  body: `Your ${getConflictStyle(s)} conflict style creates a specific pattern in the relational field — the invisible space where connection lives or dies during disagreement. ${getConflictStyle(s) === 'forcing' ? 'When you force, the field contracts — the space between becomes charged and dense, like the air before a thunderstorm. Your partner\'s room to breathe shrinks. In Polyvagal terms, your sympathetic activation floods the field with fight-energy, triggering your partner\'s nervous system into defense (fight back) or collapse (shut down). In Gottman\'s research, this field distortion is what he calls "the harsh startup" — the moment when the space between stops feeling safe.' : getConflictStyle(s) === 'avoiding' ? 'When you avoid, the field goes quiet — but not peaceful. It\'s the silence of things unsaid, creating a pressure that both of you feel but neither names. As David Whyte wrote, "What you can plan is too small for you to live." The unplanned, unspoken territory of the relational field during avoidance becomes a no-man\'s-land — too charged to enter, too important to ignore. In EFT terms, this is "withdrawal" that creates an emotional vacuum your partner feels as absence.' : getConflictStyle(s) === 'yielding' ? 'When you yield, the field feels imbalanced — one person\'s energy dominates while the other retreats. The space between becomes one-sided, like a room where only one voice echoes. In IFS terms, your Self recedes and a People-Pleasing Manager takes over, offering the field compliance rather than authentic presence. In EFT terms, your partner may sense that they\'re in the room alone — even though you\'re right there.' : 'Your approach to conflict shapes the quality of the relational space during disagreement — for better or worse. In Polyvagal terms, every conflict style creates a specific field distortion: a pattern of nervous system activation that your partner\'s body reads before their mind does.'}\n\nThe Jungian perspective illuminates the archetypal dimension: conflict is the Shadow entering the field. How you relate to conflict is how you relate to the shadow of the relationship — the parts that are uncomfortable, unwanted, or feared. The field during conflict reveals more about a relationship than any amount of harmony.`,
  arc: {
    protection: `Your ${getConflictStyle(s)} style protected the field from something you feared more — ${getConflictStyle(s) === 'forcing' ? 'being controlled, dismissed, or rendered invisible. In Schema Therapy, forcing in the field serves the Overcompensation strategy: "If I fill the space with my energy, no one can erase me"' : getConflictStyle(s) === 'avoiding' ? 'destructive explosion or irreparable rupture. In ACT terms, avoidance in the field is "experiential avoidance" applied to the relational space: "If we don\'t touch this, it can\'t hurt us"' : getConflictStyle(s) === 'yielding' ? 'rejection, abandonment, or the terrifying possibility that the other person would leave if they met your full self. In EFT terms, yielding in the field is the attachment system prioritizing proximity over authenticity' : 'the unpredictability of raw conflict — what Polyvagal theory describes as the nervous system\'s fear of unregulated sympathetic activation in the relational space'}.`,
    cost: 'Every conflict style distorts the relational field in its own characteristic way — what couples therapists call the "process" beneath the "content." Awareness of YOUR specific distortion is what Gottman identifies as the first step toward "repair attempts" that actually work. The field doesn\'t need perfect conflict. It needs honest conflict.',
    emergence: 'Conflict that serves the field — that actually strengthens the space between — is what Gottman calls "constructive conflict": both voices present, both positions held, and the outcome serving the relationship rather than either individual. In Kegan\'s Fifth Order, this is conflict as co-creation: the disagreement itself becomes the material from which deeper understanding is built. In Erikson\'s Generativity framework, mature conflict generates rather than destroys.',
  },
  practice: 'After your next disagreement — even a small one — pause before moving on. Check in with the relational field: "How does the space between us feel right now?" Share your honest reading, then ask your partner for theirs. Say: "I sense the space between us feels ___. What are you sensing?" This two-minute practice after conflict is more healing than any resolution, because it acknowledges that the field was affected and deserves tending.',
  oneThing: null,
  depth: 'pairwise',
  domains: ['conflict', 'field'],
  confidence: 'emerging',
}));

// Values × Field (compass × field)
register('compass', 'field', (s) => ({
  title: 'What the Space Between Values',
  subtitle: 'Your values × relational field',
  body: `Your values (${getTopValues(s).slice(0, 3).join(', ')}) don't just guide YOUR behavior — they shape the relational field. When you live your values visibly, the space between you and your partner becomes colored by those values — what Gottman calls "shared meaning systems" and what the contemplative tradition calls "the quality of presence." When your values go unlived, the field registers the inauthenticity — even if no one names it. In Polyvagal terms, the nervous system detects incongruence (values stated but not lived) as a safety-threat cue, creating a subtle but persistent tension in the relational space.\n\n${getAvgValueGap(s) >= 3 ? `Your values-action gap (${getAvgValueGap(s).toFixed(1)}/10) means the field is absorbing the cost of your misalignment. Your partner may sense something "off" without being able to name it — what therapists call "subclinical relational distress." As Ralph Waldo Emerson wrote, "What you do speaks so loudly that I cannot hear what you say." The field hears what you DO, not what you value. In IFS terms, the gap between your Self's values and your parts' behaviors creates a dissonance that radiates into the relational space.` : 'Your relatively aligned values contribute to a field that feels authentic and trustworthy — what Polyvagal theory describes as a "cue of safety" in the relational space. When what you say and what you do converge, your partner\'s nervous system relaxes into genuine connection.'}\n\nAs Wendell Berry wrote, "The world is not to be put in order; the world is order. It is for us to put ourselves in unison with this order." Your values ARE your attempt at that unison — the bridge between who you are and how you live. The relational field is where that bridge either holds or doesn't, where your partner walks across it or discovers it can't bear their weight.`,
  arc: {
    protection: 'Values provide meaning for the relational space — what existential psychologists call "the ground of being" for the couple. Without them, the field drifts into what Gottman calls "the absence of shared meaning" — the most subtle but perhaps most corrosive form of relational disconnection. Your values, even imperfectly lived, give the field direction.',
    cost: getAvgValueGap(s) >= 3 ? 'The gap between your values and actions creates what ACT researchers call "values-incongruent living" that radiates into the field as subtle dishonesty. Both partners feel it — a background hum of "something isn\'t right" that colors interactions without anyone being able to point to the source. In EFT terms, the gap creates an invisible barrier to the "safe haven" that genuine connection requires.' : 'Even aligned values need to be shared to shape the field. In Gottman\'s research, "shared meaning" requires explicit conversation — values lived silently contribute to personal integrity but not to relational architecture. The field needs your values to be spoken as well as lived.',
    emergence: 'Shared values that are visibly lived create a relational field with direction and purpose — what Gottman calls the "shared meaning layer" and what Erikson\'s Generativity stage describes as "building something together that matters." In Kegan\'s Fifth Order, two value systems held in creative tension create a field richer than either could generate alone. This is what "building something together" actually means — not agreement, but shared commitment to what matters.',
  },
  practice: 'This week, after dinner one evening, share your most important value with your partner. Then ask: "Do you experience me living this value?" Listen without defending. If there\'s a gap between what you claim and what they experience, that gap is where the field\'s trust lives. Thank them for their honesty. That conversation — uncomfortable as it may be — IS the field becoming more authentic.',
  oneThing: null,
  depth: 'pairwise',
  domains: ['compass', 'field'],
  confidence: 'emerging',
}));

/** Get all available pairwise keys */
export function getAvailablePairs(): string[] {
  return Object.keys(PAIRWISE_REGISTRY);
}
