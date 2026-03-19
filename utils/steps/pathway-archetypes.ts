/**
 * Pathway Archetypes — Personalized 12-Step Journey Types
 *
 * Each user is assigned a pathway archetype based on their assessment data.
 * The pathway determines the LENS through which each step is presented —
 * same step themes, different emphasis, different practices, different voice.
 *
 * Pathways are assigned progressively:
 *   After ECR-R only: preliminary (Pursuer or Protector)
 *   After 3 assessments: refined
 *   After all 6: final with secondary pathway
 *
 * 6 Archetypes:
 *   1. The Pursuer's Path — from reaching outward to internal security
 *   2. The Protector's Path — from distance-as-safety to chosen closeness
 *   3. The Feeler's Path — from absorbing everything to bounded empathy
 *   4. The Thinker's Path — from intellectual understanding to embodied experience
 *   5. The Accommodator's Path — from self-erasure to self-authorship
 *   6. The Rebuilder's Path — foundational building across all dimensions
 */

export type PathwayId =
  | 'pursuer'
  | 'protector'
  | 'feeler'
  | 'thinker'
  | 'accommodator'
  | 'rebuilder';

export interface PathwayArchetype {
  id: PathwayId;
  name: string;
  subtitle: string;
  journey: string;
  icon: string;
  /** Color accent for this pathway */
  color: string;
  /** One-line description shown on home screen */
  homeLabel: string;
}

export const PATHWAY_ARCHETYPES: Record<PathwayId, PathwayArchetype> = {
  pursuer: {
    id: 'pursuer',
    name: "The Pursuer's Path",
    subtitle: 'From reaching outward to building internal security',
    journey: 'Your journey is about learning that connection is safest when you can hold your own center. The reaching is love — learning to reach without desperation is freedom.',
    icon: '',
    color: '#c4616e',
    homeLabel: 'Built for someone who feels deeply and reaches for connection',
  },
  protector: {
    id: 'protector',
    name: "The Protector's Path",
    subtitle: 'From distance-as-safety to chosen closeness',
    journey: 'Your journey is about discovering that closeness doesn\'t have to cost you yourself. The walls kept you safe once. Now you\'re learning which ones to keep and which to open.',
    icon: '',
    color: '#8fa8bc',
    homeLabel: 'Built for someone who values autonomy and is learning to let others in',
  },
  feeler: {
    id: 'feeler',
    name: "The Feeler's Path",
    subtitle: 'From absorbing everything to feeling deeply WITH boundaries',
    journey: 'Your journey is about keeping your extraordinary empathy while building a container for it. You don\'t need to feel less — you need to feel from a grounded place.',
    icon: '',
    color: '#9daa95',
    homeLabel: 'Built for someone with deep empathy learning to feel without drowning',
  },
  thinker: {
    id: 'thinker',
    name: "The Thinker's Path",
    subtitle: 'From intellectual understanding to embodied experience',
    journey: 'Your journey is about moving from knowing to feeling. You understand patterns beautifully — the work is letting that understanding drop from your head into your body and your relationship.',
    icon: '',
    color: '#d4a843',
    homeLabel: 'Built for someone who understands deeply and is learning to feel fully',
  },
  accommodator: {
    id: 'accommodator',
    name: "The Accommodator's Path",
    subtitle: 'From self-erasure to self-authorship',
    journey: 'Your journey is about finding your own voice inside the relationship. You\'ve been so good at reading what others need that you forgot to ask what YOU need. That question is where the path begins.',
    icon: '',
    color: '#927585',
    homeLabel: 'Built for someone rediscovering their own voice in relationship',
  },
  rebuilder: {
    id: 'rebuilder',
    name: "The Rebuilder's Path",
    subtitle: 'Building the foundation from the ground up',
    journey: 'Your journey is foundational — building regulation, awareness, and relational skills that others take for granted. This isn\'t behind. This is honest. And honest is where real growth starts.',
    icon: '',
    color: '#c9876a',
    homeLabel: 'Built for someone building relational skills from a strong foundation',
  },
};

// ─── Pathway Assignment Logic ────────────────────────────

export interface PathwayScores {
  /** ECR-R anxiety (1-7 scale) */
  anxiety?: number;
  /** ECR-R avoidance (1-7 scale) */
  avoidance?: number;
  /** EQ empathic resonance (0-100) */
  empathicResonance?: number;
  /** Regulation composite (0-100) */
  regulation?: number;
  /** Openness percentile (0-100) */
  openness?: number;
  /** EQ managing own (0-100) */
  managingOwn?: number;
  /** DUTCH primary style */
  dutchPrimary?: string;
  /** DSI-R fusion (0-100) */
  fusion?: number;
  /** Differentiation composite (0-100) */
  differentiation?: number;
  /** EQ total normalized (0-100) */
  eqTotal?: number;
  /** Number of assessments completed */
  assessmentCount: number;
}

export interface PathwayAssignment {
  /** Primary pathway */
  primary: PathwayId;
  /** Secondary pathway (available after all assessments) */
  secondary: PathwayId | null;
  /** Confidence level */
  confidence: 'preliminary' | 'refined' | 'final';
  /** Why this pathway was assigned */
  rationale: string;
  /** The archetype details */
  archetype: PathwayArchetype;
}

/**
 * Assign a pathway archetype based on available assessment data.
 * Called progressively as more assessments are completed.
 */
export function assignPathway(scores: PathwayScores): PathwayAssignment {
  const { assessmentCount } = scores;

  // ─── Preliminary (ECR-R only) ─────────────────────
  if (assessmentCount <= 1) {
    if (scores.anxiety && scores.anxiety > 4.0) {
      return {
        primary: 'pursuer',
        secondary: null,
        confidence: 'preliminary',
        rationale: 'Your attachment assessment shows you track connection closely — you notice distance quickly and move toward it.',
        archetype: PATHWAY_ARCHETYPES.pursuer,
      };
    }
    if (scores.avoidance && scores.avoidance > 4.0) {
      return {
        primary: 'protector',
        secondary: null,
        confidence: 'preliminary',
        rationale: 'Your attachment assessment shows you value independence in closeness — you maintain space to feel safe.',
        archetype: PATHWAY_ARCHETYPES.protector,
      };
    }
    // Default for secure or unclear
    return {
      primary: 'pursuer',
      secondary: null,
      confidence: 'preliminary',
      rationale: 'Your pathway will become clearer as you complete more assessments. For now, we\'re starting with the foundations.',
      archetype: PATHWAY_ARCHETYPES.pursuer,
    };
  }

  // ─── Refined (3+ assessments) or Final (all 6) ────

  // Score each pathway
  const pathwayScores: Record<PathwayId, number> = {
    pursuer: 0,
    protector: 0,
    feeler: 0,
    thinker: 0,
    accommodator: 0,
    rebuilder: 0,
  };

  // Pursuer signals
  if (scores.anxiety && scores.anxiety > 4.0) pathwayScores.pursuer += 3;
  if (scores.anxiety && scores.anxiety > 5.0) pathwayScores.pursuer += 2;
  if (scores.avoidance && scores.avoidance < 3.0) pathwayScores.pursuer += 1;

  // Protector signals
  if (scores.avoidance && scores.avoidance > 4.0) pathwayScores.protector += 3;
  if (scores.avoidance && scores.avoidance > 5.0) pathwayScores.protector += 2;
  if (scores.anxiety && scores.anxiety < 3.0) pathwayScores.protector += 1;

  // Feeler signals
  if (scores.empathicResonance && scores.empathicResonance > 65) pathwayScores.feeler += 2;
  if (scores.empathicResonance && scores.empathicResonance > 80) pathwayScores.feeler += 2;
  if (scores.regulation && scores.regulation < 45) pathwayScores.feeler += 2;
  if (scores.fusion && scores.fusion > 60) pathwayScores.feeler += 1;

  // Thinker signals
  if (scores.openness && scores.openness > 65) pathwayScores.thinker += 2;
  if (scores.empathicResonance && scores.empathicResonance < 35) pathwayScores.thinker += 2;
  if (scores.managingOwn && scores.managingOwn < 40) pathwayScores.thinker += 1;
  if (scores.openness && scores.openness > 75) pathwayScores.thinker += 1;

  // Accommodator signals
  if (scores.dutchPrimary === 'yielding') pathwayScores.accommodator += 3;
  if (scores.fusion && scores.fusion > 55) pathwayScores.accommodator += 2;
  if (scores.anxiety && scores.anxiety > 3.5 && scores.avoidance && scores.avoidance < 3.0) {
    pathwayScores.accommodator += 1;
  }

  // Rebuilder signals (multiple low scores)
  let lowCount = 0;
  if (scores.regulation && scores.regulation < 35) lowCount++;
  if (scores.differentiation && scores.differentiation < 35) lowCount++;
  if (scores.eqTotal && scores.eqTotal < 40) lowCount++;
  if (lowCount >= 2) pathwayScores.rebuilder += 4;
  if (lowCount >= 3) pathwayScores.rebuilder += 2;

  // Find primary and secondary
  const sorted = Object.entries(pathwayScores)
    .sort(([, a], [, b]) => b - a) as [PathwayId, number][];

  const primary = sorted[0][0];
  const secondary = sorted[1][1] > 0 ? sorted[1][0] : null;
  const confidence = assessmentCount >= 6 ? 'final' : 'refined';

  // Generate rationale
  const rationales: Record<PathwayId, string> = {
    pursuer: 'Your assessment data shows a pattern of tracking connection closely — anxiety about distance, sensitivity to your partner\'s availability, and a tendency to move toward when threatened.',
    protector: 'Your assessment data shows a pattern of managing closeness through space — maintaining independence, self-regulating through distance, and valuing autonomy in relationships.',
    feeler: 'Your assessment data shows deep empathic capacity combined with a still-developing regulation system — you feel everything intensely and need tools to hold that intensity without flooding.',
    thinker: 'Your assessment data shows strong intellectual and creative capacity with a gap in emotional embodiment — you understand patterns clearly but the understanding hasn\'t yet become felt experience.',
    accommodator: 'Your assessment data shows a pattern of adapting to your partner\'s needs — yielding in conflict, high fusion, and a tendency to lose your own position in service of harmony.',
    rebuilder: 'Your assessment data shows multiple areas in early development — regulation, differentiation, and emotional intelligence all need foundational work. This isn\'t behind. This is honest starting.',
  };

  return {
    primary,
    secondary,
    confidence,
    rationale: rationales[primary],
    archetype: PATHWAY_ARCHETYPES[primary],
  };
}

// ─── Step-Pathway Content ────────────────────────────────

export interface PathwayStepContent {
  /** 3-4 sentences about what THIS step means for THIS archetype */
  pathwayIntro: string;
  /** What to watch for during this step */
  watchFor: string;
  /** A completion suggestion (not enforced) */
  completionSuggestion: string;
}

/**
 * Get pathway-specific content for a step.
 * Returns null if no specific content exists for this combination.
 */
export function getPathwayStepContent(
  stepNumber: number,
  pathwayId: PathwayId,
): PathwayStepContent | null {
  const content = PATHWAY_STEP_CONTENT[pathwayId]?.[stepNumber];
  return content ?? null;
}

// Step content for each pathway × step combination
// Steps 1-4 covered for all pathways; Steps 5-12 for primary pathways
const PATHWAY_STEP_CONTENT: Record<PathwayId, Record<number, PathwayStepContent>> = {
  pursuer: {
    1: {
      pathwayIntro: "For you, acknowledging the strain means noticing HOW you notice — your radar is always on, scanning for signs of disconnection. This step asks you to see that radar as a pattern, not a truth. The strain is real. The story your anxiety writes about it may not be.",
      watchFor: "The urge to fix the strain immediately. Your system wants resolution NOW. This step practices sitting with the discomfort of not-knowing.",
      completionSuggestion: "Write down one moment this week where you noticed distance and paused before reacting. What happened in those seconds of pause?",
    },
    2: {
      pathwayIntro: "Trusting the relational field is your central challenge — because your system says the field is dangerous until proven safe. Every silence is a threat. Every delay is evidence. This step asks you to trust that the space between you can hold more than your alarm system believes.",
      watchFor: "Reassurance-seeking disguised as connection. There's a difference between genuine reaching and anxiety-driven checking.",
      completionSuggestion: "Practice one 'trust fall' this week: let a text go unanswered for 2 hours without following up. Notice what your body does.",
    },
    3: {
      pathwayIntro: "Seeing your part as a pursuer means recognizing that your intensity — which comes from love — can feel like pressure to your partner. The pursuit itself becomes part of the pattern. This step helps you see the chase without stopping the caring.",
      watchFor: "Self-blame ('I'm too much') vs. self-awareness ('My pattern is pursuit'). One shames. The other liberates.",
      completionSuggestion: "Ask your partner: 'When I come toward you with intensity, what does it feel like on your side?' Listen without defending.",
    },
    4: {
      pathwayIntro: "Feeling without fixing is the pursuer's hardest step. Your system equates feeling with doing — if you feel the disconnection, you must ACT on it. This step builds the muscle of feeling the anxiety AND choosing not to pursue. Not because pursuing is wrong, but because sometimes staying still is the bravest move.",
      watchFor: "The moment when sitting with the feeling becomes unbearable and you reach for your phone, start a conversation, or create urgency. That's the edge.",
      completionSuggestion: "Sit with an uncomfortable feeling for 90 seconds without acting on it. Time it. Write what you notice.",
    },
    5: {
      pathwayIntro: "Sharing your truth as a pursuer means sharing the FEAR underneath the pursuit — not the complaint on top of it. You've been saying 'you never...' when what you mean is 'I'm terrified you'll leave.' This step asks you to lead with the soft underbelly, not the sharp claws.",
      watchFor: "Turning vulnerability into a demand. 'I need you to reassure me RIGHT NOW' is pursuit wearing a vulnerability costume. Real sharing sounds quieter.",
      completionSuggestion: "Tell your partner one fear you've never said out loud — not what they do wrong, but what you're afraid of. Start with: 'The thing I've been afraid to say is...'",
    },
    6: {
      pathwayIntro: "Your enemy story is that your partner doesn't care enough. That their distance is indifference. But what if their withdrawal is their own version of overwhelm — not a statement about your worth? Releasing the enemy story means holding the possibility that your partner's silence is pain, not rejection.",
      watchFor: "The righteous certainty that you've 'figured them out.' The moment you say 'they ALWAYS...' or 'they NEVER...' — that's the enemy story speaking, not observation.",
      completionSuggestion: "Write your partner's enemy story about YOU from their perspective. What might they believe about your pursuit that isn't the full truth?",
    },
    7: {
      pathwayIntro: "Committing to relational practices is where your energy finally becomes an asset. You've always been willing to DO the work — the risk is doing too much, too fast, then burning out or resenting that your partner isn't matching your pace. This step channels your natural drive into sustainable rhythms.",
      watchFor: "Over-committing to practices as a new form of pursuit. If you're doing all the exercises to PROVE you're trying, that's the old pattern in a new outfit.",
      completionSuggestion: "Choose ONE practice to do consistently for 7 days. Just one. When you feel the urge to add more, notice that urge — it's your pursuit energy looking for a target.",
    },
    8: {
      pathwayIntro: "Preparing to repair harm means looking at how your pursuit itself caused wounds — the late-night texts when they needed space, the conversations pushed past their capacity, the intensity that felt like love to you and like siege to them. This isn't about shame. It's about seeing clearly.",
      watchFor: "Defending the pursuit: 'But I was just trying to connect!' True. And it still caused harm. Both things are real.",
      completionSuggestion: "Identify one specific moment where your pursuit crossed your partner's boundary. Don't explain it. Just name it. 'I pushed past your no when ___.'",
    },
    9: {
      pathwayIntro: "Rebuilding trust as a pursuer means proving you can hold back — that you can be close WITHOUT being consuming. Your partner needs evidence that your love has a dimmer switch, not just an on/off. Trust rebuilds when they see you respect their space AND stay connected.",
      watchFor: "Impatience with the pace of trust-building. 'I've changed, why don't you see it?' is pursuit of validation. Trust builds on THEIR timeline, not yours.",
      completionSuggestion: "This week, notice one moment where your partner pulls away and choose to let them go without following. Afterward, tell them: 'I noticed you needed space and I wanted you to have it.'",
    },
    10: {
      pathwayIntro: "Maintaining awareness means recognizing that your pursuit pattern will return — especially under stress, during transitions, or when your partner seems distant. The goal isn't to eliminate the radar. It's to hear it beep without obeying it blindly.",
      watchFor: "Subtle pursuit: increased texting frequency, 'casually' checking their mood, over-interpreting tone. Your radar gets quieter but it never fully turns off. That's normal.",
      completionSuggestion: "Create a personal 'alarm protocol': when you feel the pull to pursue, do three things first — breathe, name the fear, check if it's present-moment or old story. Then choose your response.",
    },
    11: {
      pathwayIntro: "Seeking shared insight as a pursuer means finally hearing what the relationship has been trying to teach you: that your reaching was always about connection, and connection was always possible without the reaching. The insight isn't that you were wrong to want closeness — it's that closeness was never as far away as your alarm system believed.",
      watchFor: "Making the insight into another project. 'Now I understand! Let me explain to my partner what I've learned!' — that's pursuit of intellectual connection. Let the insight settle before you share it.",
      completionSuggestion: "Sit quietly and ask: 'What has this relationship been trying to teach me about trust?' Write whatever comes without editing.",
    },
    12: {
      pathwayIntro: "Carrying the message means modeling what it looks like to love without gripping. Your journey from pursuit to presence is a gift — not just to your partner, but to every relationship you touch. You now know that the deepest connection comes not from chasing but from being still enough to be found.",
      watchFor: "Evangelizing your growth. Telling everyone how much you've changed is one last form of pursuit — pursuit of recognition. Let your presence speak.",
      completionSuggestion: "Write a letter to the pursuer you were at Step 1. What would you want them to know? What would you want them to feel?",
    },
  },

  protector: {
    1: {
      pathwayIntro: "For you, acknowledging the strain means admitting it exists — because your default is to minimize. 'It's fine' is your shield. This step asks you to put down the shield long enough to see what's actually happening between you and your partner.",
      watchFor: "The impulse to rationalize the strain away. 'Every couple goes through this' is true AND it can be used to avoid seeing YOUR specific pattern.",
      completionSuggestion: "Name one thing in your relationship that isn't 'fine' — not to your partner yet, just to yourself. Write it down.",
    },
    2: {
      pathwayIntro: "Trusting the relational field means trusting that closeness won't consume you. Your system learned that the field is dangerous — that intimacy costs autonomy. This step gently challenges that equation: what if you could be close AND still be you?",
      watchFor: "Intellectualizing trust instead of feeling it. You might 'understand' the field conceptually while your body stays armored.",
      completionSuggestion: "Spend 5 minutes sitting close to your partner in silence. No agenda. No conversation. Just proximity. Notice what your body does.",
    },
    3: {
      pathwayIntro: "Seeing your part as a protector means recognizing that your distance — which feels like independence — registers as rejection to your partner. The wall you built for safety is the same wall that blocks connection. This step helps you see the wall without tearing it down prematurely.",
      watchFor: "Defensiveness ('I'm just independent') vs. curiosity ('I wonder why I need this much space'). One protects the pattern. The other opens it.",
      completionSuggestion: "Notice one moment this week where you withdrew and ask yourself: was I protecting myself, or was I hiding?",
    },
    4: {
      pathwayIntro: "Feeling without fixing looks different for you — your version of 'fixing' is leaving. When emotions rise, your system exits: physically, emotionally, or mentally. This step practices staying in the room for one minute longer than feels comfortable.",
      watchFor: "The shutdown sequence: first your face goes neutral, then your breathing shallows, then your mind starts planning your exit. Catch it at the face.",
      completionSuggestion: "When you feel the urge to withdraw, say out loud: 'I'm noticing I want to leave. I'm going to stay for 60 more seconds.' Then stay.",
    },
    5: {
      pathwayIntro: "Sharing your truth as a protector is the step that scares you most — because truth requires proximity, and proximity is what your system avoids. But here's what you may not realize: your partner isn't asking for a flood of emotion. They're asking for a single honest sentence. You can do one sentence.",
      watchFor: "Over-preparing what you'll say until the moment passes. Perfectionism about vulnerability is still avoidance.",
      completionSuggestion: "Share one thing with your partner that you normally keep inside. It doesn't have to be big. 'I missed you today' counts. Say it and notice what happens in your chest.",
    },
    6: {
      pathwayIntro: "Your enemy story is that your partner is too needy — that their emotions are a drain on your energy and autonomy. But what if their reaching is love, not neediness? What if what feels like demand is actually desire to be close to YOU specifically? Releasing this story means considering that their intensity might be a compliment, not a burden.",
      watchFor: "Subtle contempt: eye-rolling, sighing, the internal 'here we go again.' These are the enemy story's body language.",
      completionSuggestion: "Write down three things your partner does that you label as 'too much.' Now rewrite each one as an expression of love. What shifts?",
    },
    7: {
      pathwayIntro: "Committing to relational practices asks you to show up consistently — which is harder for you than showing up intensely. You can handle a crisis. It's the daily drip of connection that feels unnatural. This step builds the muscle of small, reliable gestures that tell your partner: I'm still here.",
      watchFor: "Treating practice as obligation rather than offering. 'Fine, I'll do the thing' carries a different energy than 'I'm choosing to show up.' Your partner can feel the difference.",
      completionSuggestion: "Initiate one small connection each day this week — a touch, a question, a text. Nothing dramatic. Consistency is the practice, not intensity.",
    },
    8: {
      pathwayIntro: "Preparing to repair harm means looking at the cost of your walls — the birthdays you were present for but not really there, the conversations you ended by going silent, the moments your partner reached and found you gone. Your withdrawal wasn't malicious. It was self-protection. AND it left marks.",
      watchFor: "Minimizing the impact: 'I just needed space, it wasn't that bad.' It might not have been bad for you. Ask your partner what it was like for them.",
      completionSuggestion: "Name one specific time your withdrawal hurt your partner. Not the category ('I pull away sometimes') but the instance ('When you cried about your mom and I went to the other room').",
    },
    9: {
      pathwayIntro: "Rebuilding trust as a protector means proving you can stay — not just physically, but emotionally. Your partner needs evidence that when things get hard, you won't disappear. Trust rebuilds every time you lean in instead of pulling away, even slightly.",
      watchFor: "Performing presence while mentally checked out. Your partner needs your attention, not just your body in the room.",
      completionSuggestion: "This week, when your partner brings something emotional, resist the urge to problem-solve or exit. Instead say: 'Tell me more.' Then listen for two full minutes.",
    },
    10: {
      pathwayIntro: "Maintaining awareness means knowing that your wall will want to go back up — after a fight, during stress, when closeness starts to feel like too much. The goal isn't to never retreat. It's to retreat consciously: 'I need 20 minutes' instead of vanishing for three hours without a word.",
      watchFor: "The slow fade: not a dramatic withdrawal but a gradual emotional dimming. You stop initiating. You answer in shorter sentences. You're physically present but relationally absent. Catch it early.",
      completionSuggestion: "Create a 'withdrawal signal' with your partner: a word or gesture that means 'I need space but I'm coming back.' Use it instead of just going quiet.",
    },
    11: {
      pathwayIntro: "Seeking shared insight as a protector means discovering what the relationship has been teaching you: that closeness doesn't cost you yourself. That the wall kept you safe AND kept you lonely. The insight isn't that protection was wrong — it's that you're strong enough now to need less of it.",
      watchFor: "Intellectualizing the insight without feeling it. You might create a perfect theory about your avoidance without actually letting yourself feel the loss of all the closeness you missed.",
      completionSuggestion: "Ask yourself: 'What did my wall cost me?' Sit with the answer for five minutes. Don't fix it. Just feel it.",
    },
    12: {
      pathwayIntro: "Carrying the message means showing others what it looks like to choose closeness when distance feels safer. Your journey from protection to presence is rare and hard-won. You now know that the bravest thing a protector can do is not to guard — it's to open the gate.",
      watchFor: "Retreating into the identity of 'the one who grew.' Growth is ongoing, not a destination you arrive at and defend.",
      completionSuggestion: "Write a letter to the protector you were at Step 1. What would you want them to know about what's on the other side of the wall?",
    },
  },

  feeler: {
    1: {
      pathwayIntro: "For you, acknowledging the strain means separating YOUR strain from your PARTNER'S strain — because right now they blur together. You feel the relationship's pain as if it's all happening inside your body. This step helps you identify whose feelings are whose.",
      watchFor: "Emotional flooding when you start looking at the strain. Your empathy may turn the examination into an overwhelming experience. Go slowly.",
      completionSuggestion: "Draw two columns: 'What I feel about us' and 'What my partner seems to feel about us.' Notice where they overlap and where they're different.",
    },
    2: {
      pathwayIntro: "You already sense the relational field — you've been swimming in it your whole life. Your challenge isn't trusting it. It's learning to sense it without merging with it. The field is real. You don't have to become it to trust it.",
      watchFor: "Absorbing your partner's emotions during this process. You might start feeling THEIR anxiety about the relationship as if it were your own.",
      completionSuggestion: "Practice the boundary check: 'Is this feeling mine, theirs, or ours?' Do it three times today.",
    },
    3: {
      pathwayIntro: "Seeing your part as a feeler means recognizing that your emotional absorption IS a part — it's not passive, it's a strategy. You absorb to stay connected. You merge to prevent abandonment. The empathy is real AND it serves a protective function.",
      watchFor: "The belief that feeling more is the same as understanding more. Sometimes your flooding prevents you from seeing clearly.",
      completionSuggestion: "Identify one emotion you've been carrying this week that might not be yours. Say: 'I'm setting this down. It's not mine to carry.'",
    },
    4: {
      pathwayIntro: "Feeling without fixing is paradoxically hard for you — because you feel SO much that the only relief seems to be doing something about it. Your version of this step is feeling without ABSORBING. Can you witness your partner's pain without taking it into your body?",
      watchFor: "Physical symptoms of emotional absorption: heaviness in chest, sudden fatigue, mood shifts that track your partner's state.",
      completionSuggestion: "After an emotional conversation, spend 5 minutes alone with your hand on your belly. Breathe and ask: 'What am I feeling that is mine right now?'",
    },
    5: {
      pathwayIntro: "Sharing your truth as a feeler means sharing what YOU need — not what you sense everyone else needs. You've spent your life translating other people's emotions. This step asks you to find your own voice underneath all that empathic noise. What do YOU want? What hurts YOU?",
      watchFor: "Starting your truth with your partner's experience: 'I can tell you're stressed, so...' That's their truth, not yours. Start with 'I.'",
      completionSuggestion: "Complete this sentence five times without mentioning your partner: 'I need ___.' Not 'I need you to ___.' Just 'I need ___.'",
    },
    6: {
      pathwayIntro: "Your enemy story is more subtle than most — it's not that your partner is bad, it's that they don't feel enough. You secretly believe you're the only one who really CARES, who really FEELS the relationship. Releasing this story means acknowledging that your partner may experience love differently, not less deeply.",
      watchFor: "Emotional superiority: 'I'm the sensitive one, they're the closed one.' This positions you as the hero of the emotional world and your partner as the villain of flatness.",
      completionSuggestion: "Ask your partner: 'How do you experience love?' Listen without comparing it to how YOU experience love. Their answer might surprise you.",
    },
    7: {
      pathwayIntro: "Committing to practices as a feeler means practicing with BOUNDARIES — not losing yourself in the exercises. You'll naturally go deep. The challenge is coming back up. Your relational practices need a beginning AND an end, not an endless immersion.",
      watchFor: "Using practices as another portal into emotional fusion. If the grounding exercise makes you feel MORE merged rather than more centered, you're doing your pattern, not the practice.",
      completionSuggestion: "Set a timer for each practice. When the timer ends, stop — even if you feel like there's more to process. Practice the ending.",
    },
    8: {
      pathwayIntro: "Preparing to repair harm means recognizing that your empathic merging itself caused wounds — the times you couldn't hold space because you were too flooded, the times your partner's feelings became YOUR emergency, the times you responded to their pain with more pain instead of steadiness.",
      watchFor: "Taking on ALL the guilt because you can feel how much your partner was hurt. Feeling their pain intensely is not the same as being responsible for all of it.",
      completionSuggestion: "Identify one moment where your emotional flooding made things harder for your partner. Name it specifically, without drowning in the feeling of it.",
    },
    9: {
      pathwayIntro: "Rebuilding trust as a feeler means showing your partner that you can be emotionally present WITHOUT being emotionally consumed. They need to trust that your empathy has a floor — that you can hold their experience without collapsing into it. Trust builds when they see you stay solid.",
      watchFor: "Over-empathizing as a repair strategy: 'I feel EVERYTHING you feel!' can feel like merging rather than connecting. Your partner may need you to be a steady shore, not another wave.",
      completionSuggestion: "This week, when your partner shares something painful, practice staying in YOUR body while listening. Feel your feet on the floor. Witness without absorbing.",
    },
    10: {
      pathwayIntro: "Maintaining awareness means recognizing when you're starting to merge again — when your mood perfectly mirrors your partner's, when you can't tell whose anxiety you're carrying, when you lose yourself in their emotional weather. The radar for you is an internal boundary check.",
      watchFor: "Compassion fatigue disguised as closeness. When you feel exhausted after every conversation, it's not because you care too much — it's because your boundaries dissolved again.",
      completionSuggestion: "Three times today, pause and ask: 'What am I feeling that is purely mine right now?' If you can't answer, that's information.",
    },
    11: {
      pathwayIntro: "Seeking shared insight means discovering that the relationship has been teaching you about the difference between empathy and enmeshment. Your capacity to feel deeply is your greatest gift. The insight is that you can offer it WITHOUT losing yourself — that boundaried empathy is deeper than boundaryless absorption.",
      watchFor: "Grieving your old identity as 'the empath.' If feeling everything was who you WERE, who are you with boundaries? The answer: someone who can actually help.",
      completionSuggestion: "Reflect: 'What does my empathy look like when it has a container?' Write about the difference between open-hearted and wide-open.",
    },
    12: {
      pathwayIntro: "Carrying the message means modeling what boundaried empathy looks like — feeling deeply without losing yourself, being present without being consumed. Your journey teaches others that sensitivity is not weakness, and boundaries are not walls. The feeler who learns to hold their own center becomes the most powerful healer in the room.",
      watchFor: "Absorbing other people's growth journeys as your responsibility. You can inspire without carrying.",
      completionSuggestion: "Write a letter to the feeler you were at Step 1 — the one who couldn't tell whose feelings were whose. What do you know now about love with edges?",
    },
  },

  thinker: {
    1: {
      pathwayIntro: "For you, acknowledging the strain means dropping from understanding to feeling. You probably already have a clear analysis of what's wrong. This step asks: can you FEEL the strain, not just think about it? The knowing is in your head. The work is in your body.",
      watchFor: "Pattern-recognition as avoidance. You might map the entire relationship dynamic beautifully — and use that map to avoid actually being IN the territory.",
      completionSuggestion: "Close your eyes and feel the strain in your body. Where does it live? Don't analyze it. Just locate it.",
    },
    2: {
      pathwayIntro: "You likely understand the relational field conceptually. This step asks you to feel it — not as an idea, but as a living presence between you and your partner. Can you sense the quality of the space right now, without analyzing it?",
      watchFor: "Theorizing about trust instead of practicing it. 'I think trust is important' is different from 'I am choosing to trust right now.'",
      completionSuggestion: "Sit with your partner and describe what you sense between you — not what you think, but what you FEEL in the space. Use body words, not head words.",
    },
    3: {
      pathwayIntro: "Seeing your part as a thinker means recognizing that your understanding can become a hiding place. You see patterns so clearly that you can narrate the relationship from the outside — which keeps you from being fully inside it. The insight is a gift. The detachment is the pattern.",
      watchFor: "Using therapy language as armor. 'I notice my avoidant attachment activating' can be insight OR intellectual distance from the feeling underneath.",
      completionSuggestion: "This week, try saying 'I feel ___' instead of 'I notice ___' or 'I think ___.' Feel the difference in your body.",
    },
    4: {
      pathwayIntro: "Feeling without fixing is your central growth edge. Your mind wants to solve every feeling — to turn emotion into insight, pain into pattern, experience into understanding. This step practices BEING with the feeling before your mind files it away.",
      watchFor: "Rapid intellectualization: feeling arrives → mind labels it → feeling disappears into the label. The label is accurate. The feeling is gone.",
      completionSuggestion: "When a feeling arises, set a timer for 2 minutes. Feel it in your body for the full 2 minutes before you think about what it means.",
    },
    5: {
      pathwayIntro: "Sharing your truth as a thinker means sharing the FEELING, not the analysis. You can explain your relationship dynamic brilliantly. What your partner needs is not your explanation — it's your heart. 'I feel scared' is more vulnerable than 'I notice a pattern of anxious-avoidant complementarity.'",
      watchFor: "Packaging your vulnerability in insight. 'I've been reflecting on my attachment patterns and I think...' — your partner's eyes just glazed over. Try: 'I'm lonely.'",
      completionSuggestion: "Share something with your partner using ONLY feeling words. No analysis, no framework references, no 'I think.' Just 'I feel ___ when ___.'",
    },
    6: {
      pathwayIntro: "Your enemy story is sophisticated — it's not crude anger, it's a comprehensive theory about why your partner is the problem. You've built an airtight case, complete with evidence and psychological frameworks. Releasing it means admitting that your brilliant analysis might be your most elaborate defense mechanism.",
      watchFor: "Intellectual certainty that feels like truth. 'I've objectively assessed our dynamic and...' — objectivity in relationships is a myth you use to stay in control.",
      completionSuggestion: "Take your most well-constructed theory about your partner's issue and ask: 'What if I'm wrong about this? What would that mean about me?'",
    },
    7: {
      pathwayIntro: "Committing to practices is where your knowledge finally meets your body. You've read the books. You understand the science. Now: can you DO the thing without turning it into a research project? Your practice is embodiment, not analysis of embodiment.",
      watchFor: "Optimizing the practice instead of doing it. Researching the 'best' meditation app, reading about grounding instead of grounding, planning the perfect ritual instead of imperfectly showing up.",
      completionSuggestion: "Do one practice this week without reading about it first. Just do it. Messy, imperfect, un-optimized. Notice how that feels.",
    },
    8: {
      pathwayIntro: "Preparing to repair harm means seeing how your intellectualization itself caused wounds — the times your partner needed comfort and got an explanation, the times they cried and you analyzed, the times they begged for your heart and you offered your mind. Your insight was never the problem. Your absence from your own feelings was.",
      watchFor: "Analyzing the harm instead of feeling it. 'I understand cognitively that my detachment was hurtful' — do you FEEL that? In your body? Where?",
      completionSuggestion: "Ask your partner: 'When did my understanding hurt you the most?' Listen with your body, not your analytical mind.",
    },
    9: {
      pathwayIntro: "Rebuilding trust as a thinker means showing your partner that you can be emotionally present — not just intellectually engaged. They need to see that when they share pain, you won't immediately explain it. Trust rebuilds when they feel FELT by you, not just understood.",
      watchFor: "Replacing emotional attunement with helpful insights. 'Have you considered that your reaction might stem from...' is not connection. Try: 'That sounds really hard.'",
      completionSuggestion: "This week, when your partner shares something, respond ONLY with emotional validation for the first two minutes. No analysis. No suggestions. Just: 'I hear you. That makes sense.'",
    },
    10: {
      pathwayIntro: "Maintaining awareness means noticing when you retreat to your head — when the conversation gets emotional and your mind starts narrating instead of participating. The awareness practice for you is body-based: where are your feet? What's happening in your chest? These questions pull you out of the observation deck and back into the room.",
      watchFor: "Meta-cognition as escape: thinking ABOUT your feelings instead of HAVING them. 'I notice I'm having a feeling' is three steps removed from the feeling itself.",
      completionSuggestion: "Set three body-check alarms during the day. When they go off, stop thinking and ask: 'What does my body feel right now?' Just the body. Not your thoughts about the body.",
    },
    11: {
      pathwayIntro: "Seeking shared insight is where your gift becomes useful — but differently than before. The insight you seek now isn't analytical. It's the kind of knowing that comes from having been IN the experience, not above it. You've learned that the deepest understanding comes not from observation but from participation.",
      watchFor: "Turning the insight into a TED talk. The temptation to package your growth into a coherent narrative is strong. Let it stay messy. Messy is honest.",
      completionSuggestion: "Reflect: 'What do I know now that I can't explain?' Write about the understanding that lives in your body, not your mind.",
    },
    12: {
      pathwayIntro: "Carrying the message means modeling what it looks like to be both wise AND embodied — to understand deeply AND feel fully. Your journey from the head to the heart is one of the hardest paths. You now know that the most profound insight in any relationship is not a theory — it's the willingness to be present.",
      watchFor: "Teaching instead of being. The thinker's version of 'carrying the message' can become another lecture. Let your presence teach. Your partner will notice.",
      completionSuggestion: "Write a letter to the thinker you were at Step 1 — the one who thought understanding was enough. What do you know now that you couldn't think your way to?",
    },
  },

  accommodator: {
    1: {
      pathwayIntro: "For you, acknowledging the strain means acknowledging YOUR strain — not your partner's, not the relationship's. Yours. You've been so focused on keeping the peace that your own experience has become invisible. This step asks: what do YOU feel about how things are?",
      watchFor: "Immediately shifting to your partner's perspective ('They're under a lot of stress'). That's your pattern — redirecting attention away from your own experience.",
      completionSuggestion: "Complete this sentence five times: 'Something I haven't said about our relationship is ___.' Don't edit.",
    },
    2: {
      pathwayIntro: "Trusting the relational field for you means trusting that the field can hold YOUR truth — not just your partner's. You've been the field's caretaker. Now you're learning to be a full participant. The field needs both of you to show up as yourselves.",
      watchFor: "Automatically adjusting your 'truth' to match what you think the field (or your partner) can handle.",
      completionSuggestion: "State one preference today without checking your partner's reaction first. Not a confrontation. Just: 'I'd prefer ___.'",
    },
    3: {
      pathwayIntro: "Seeing your part as an accommodator means recognizing that your accommodation IS a relational move — it's not neutral. Every time you yield, you're shaping the dynamic. Your partner is in a relationship with someone who's editing themselves. They may not even know it.",
      watchFor: "The belief that accommodation equals love. 'I do it because I care' can be true AND it can be a way to avoid the risk of being yourself.",
      completionSuggestion: "Track one day: how many times did you adjust your preference to match your partner's? No judgment. Just count.",
    },
    4: {
      pathwayIntro: "Feeling without fixing looks unique for you — your 'fixing' is accommodating. When discomfort arises, you smooth it over by giving in. This step practices feeling the discomfort of disagreement without automatically yielding to make it stop.",
      watchFor: "The moment when you feel your 'no' forming and watch yourself swallow it. That swallowing IS the pattern.",
      completionSuggestion: "Practice saying 'Let me think about that' instead of immediately agreeing. Buy yourself 10 seconds of real consideration.",
    },
    5: {
      pathwayIntro: "Sharing your truth as an accommodator is the most radical thing you can do — because your entire system is built to share THEIR truth, to smooth, to harmonize. This step asks you to cause discomfort on purpose: to say what you actually think, even if it creates a moment of tension. That tension is not a problem. It's proof you exist.",
      watchFor: "Softening your truth until it disappears: 'I kind of maybe sometimes feel like possibly...' Say it plainly. One clear sentence.",
      completionSuggestion: "Tell your partner one thing you disagree about. It doesn't have to be big. 'I actually prefer the other restaurant.' Start there.",
    },
    6: {
      pathwayIntro: "Your enemy story is invisible even to you — because you don't have an enemy story about your PARTNER. You have one about YOURSELF: that you're not important enough to have needs, that your preferences don't matter, that keeping the peace is more valuable than being honest. Releasing this means recognizing that self-erasure is not love. It's a slow disappearing act.",
      watchFor: "The belief that having an enemy story is selfish. It's not. It's honest. You're allowed to see clearly, even when what you see is uncomfortable.",
      completionSuggestion: "Write down three resentments you've been hiding. Not to share them yet — just to acknowledge they exist. They're yours. They're valid.",
    },
    7: {
      pathwayIntro: "Committing to practices means committing to practices FOR YOURSELF — not as a way to improve the relationship for your partner. You've spent your life doing things for others. This step asks: what practice nourishes YOU? What would you do if no one was watching and no one needed you to be different?",
      watchFor: "Choosing practices based on what your partner would approve of. If your practice selection feels like another act of accommodation, it is.",
      completionSuggestion: "Choose one practice that is entirely for you. Not because it will make you a better partner. Because it feeds something in you that's been hungry.",
    },
    8: {
      pathwayIntro: "Preparing to repair harm means confronting a paradox: your accommodation was a gift AND it caused damage. By hiding yourself, you denied your partner a real relationship. They've been loving a curated version of you. The harm isn't what you did — it's what you withheld. The real you.",
      watchFor: "Apologizing for having needs ('I'm sorry I want things'). That's not repair. That's more accommodation. Repair means showing up as yourself, not apologizing for your existence.",
      completionSuggestion: "Identify one way your yielding shaped the relationship in a direction your partner didn't choose. They deserve to know who you really are.",
    },
    9: {
      pathwayIntro: "Rebuilding trust as an accommodator means proving you'll tell the truth — even when it's easier to agree. Your partner needs to trust that your 'yes' means yes and your 'fine' actually means fine. Trust rebuilds when they see you choose honesty over harmony.",
      watchFor: "Performing assertiveness while internally capitulating. Saying 'no' with your words while saying 'I'm sorry' with your body language. Alignment matters.",
      completionSuggestion: "This week, catch yourself about to say 'whatever you want' and replace it with what you actually want. Even once. That's rebuilding trust.",
    },
    10: {
      pathwayIntro: "Maintaining awareness means catching the accommodation reflex before it fires — the moment between feeling your preference and swallowing it. That gap is getting wider as you grow. But under stress, it shrinks. The old pattern whispers: 'Just go along. It's easier.' Your work is to hear that whisper and choose differently.",
      watchFor: "Accommodation in new disguises: 'I don't mind' (you do), 'It doesn't matter' (it does), 'Whatever works for you' (you have a preference). Your body knows. Listen to it.",
      completionSuggestion: "At the end of each day, ask: 'Did I swallow anything today?' If yes, write it down. Tomorrow, try saying it instead.",
    },
    11: {
      pathwayIntro: "Seeking shared insight means discovering what the relationship has been teaching you: that you matter. That your voice is not a disruption — it's a contribution. That real love requires a real you, not a pleasant ghost. The insight is that accommodation was never about kindness. It was about fear of being too much.",
      watchFor: "Deflecting the insight onto your partner: 'They need to learn to ask for less.' No. This insight is about YOU learning to show up as more.",
      completionSuggestion: "Reflect: 'Who am I when I'm not managing everyone's comfort?' Write about the person underneath the accommodation. They're still there.",
    },
    12: {
      pathwayIntro: "Carrying the message means modeling what it looks like to show up fully without apology. Your journey from self-erasure to self-authorship is quiet but revolutionary. You now know that the most loving thing an accommodator can do is stop accommodating — and start being real.",
      watchFor: "Returning to the old pattern under the guise of 'being kind.' Kindness that costs you your self is not kindness. It's a transaction.",
      completionSuggestion: "Write a letter to the accommodator you were at Step 1 — the one who thought disappearing was the price of love. What do you know now about showing up?",
    },
  },

  rebuilder: {
    1: {
      pathwayIntro: "Acknowledging the strain is your starting point — and it takes courage to be here. Your assessment data shows multiple areas in early development, which means every step you take matters more. You're not behind. You're building a foundation that others take for granted.",
      watchFor: "Shame spirals ('I should be better at this by now'). Your nervous system may interpret self-awareness as self-criticism. They're different.",
      completionSuggestion: "Write one thing you're proud of about how you show up in your relationship. Even something small. That's your foundation.",
    },
    2: {
      pathwayIntro: "Trusting the relational field is simpler than it sounds: it means believing that the space between you and your partner can be good. Not perfect. Good. Your system may not have much evidence for this yet. That's okay. This step starts building the evidence.",
      watchFor: "Overwhelm. When everything needs building, it's easy to feel paralyzed. Focus on ONE thing: presence. Just showing up is the practice.",
      completionSuggestion: "Spend 3 minutes with your partner doing nothing. No phones. No TV. Just being together. That IS the practice.",
    },
    3: {
      pathwayIntro: "Seeing your part is straightforward for you — not because it's easy, but because the work is honest. You're building skills that others learned earlier. Seeing your pattern isn't about shame. It's about direction. Now you know where to grow.",
      watchFor: "Comparing yourself to where you 'should' be. There is no should. There is where you are and where you're heading.",
      completionSuggestion: "Name one pattern you want to change — just one. Not five. One. That's your focus for the next month.",
    },
    4: {
      pathwayIntro: "Feeling without fixing starts with feeling at all. Your regulation capacity is still developing, which means feelings can be overwhelming. This step builds tolerance in small doses — not the full ocean, just a cup at a time.",
      watchFor: "Flooding and then shutting down completely. If the feeling gets too big, it's okay to take a break. Come back in 10 minutes.",
      completionSuggestion: "Practice naming one emotion per day — just naming it. 'Right now I feel ___.' That's the first brick of emotional intelligence.",
    },
    5: {
      pathwayIntro: "Sharing your truth as a rebuilder starts simple: say one real thing. You don't need to share your deepest wound or your most complex feeling. Just one honest sentence. 'I had a hard day.' 'I felt hurt when that happened.' For you, any truth shared is a victory — because the foundation is being built one brick at a time.",
      watchFor: "The belief that your truth isn't interesting or important enough to share. It is. Every human truth matters.",
      completionSuggestion: "Share one real thing with your partner today — not what happened at work, but how you FELT about something. Even 'I felt good today' counts.",
    },
    6: {
      pathwayIntro: "Your enemy story might be about yourself — that you're broken, that you're too far behind, that you can't do this. Or it might be about relationships in general — that love is for people who had better starts. Releasing this story means accepting that you're building something new, and new things don't need to compare themselves to old things.",
      watchFor: "Hopelessness disguised as realism. 'I'm just not good at relationships' is a story, not a fact. You're here. That's evidence against it.",
      completionSuggestion: "Write down one story you tell yourself about why you can't have a good relationship. Then write one piece of evidence that contradicts it.",
    },
    7: {
      pathwayIntro: "Committing to practices is your superpower — because you're building from scratch, every practice matters more. You're not unlearning decades of a complex pattern. You're learning for the first time. That means every practice is genuinely new territory. There's no 'going back to old habits' because these habits are being formed right now.",
      watchFor: "Skipping practices because they feel too basic. 'This is too simple' might mean it's exactly what you need. Foundations are supposed to be simple.",
      completionSuggestion: "Choose the simplest practice offered and do it perfectly for one week. Mastering something small builds more confidence than attempting something big.",
    },
    8: {
      pathwayIntro: "Preparing to repair harm is gentler for you — not because harm didn't happen, but because much of the harm was unconscious. You weren't strategically withdrawing or pursuing. You were surviving with limited tools. Repair means acknowledging impact without drowning in shame. 'I didn't know how to show up. I'm learning now.'",
      watchFor: "Shame overwhelming the repair process. If looking at harm makes you want to shut down entirely, slow down. You can repair in small doses.",
      completionSuggestion: "Tell your partner: 'I know I haven't always been able to show up the way you needed. I want to learn. Can you tell me one thing that would help?'",
    },
    9: {
      pathwayIntro: "Rebuilding trust as a rebuilder is literal — you're building it for the first time, not rebuilding something that broke. Each small, consistent action teaches your partner (and yourself) that you can be relied on. You don't need grand gestures. You need showing up, again and again.",
      watchFor: "Comparing your pace to others' ('Most people already know how to do this'). Your pace is your pace. Consistency matters more than speed.",
      completionSuggestion: "Pick one small thing you'll do every day for your partner this week — a text, a question, a small act. Do it every single day. That IS trust-building.",
    },
    10: {
      pathwayIntro: "Maintaining awareness is about celebrating how far you've come while staying honest about how much is still growing. You started with a foundation that needed building. Now you have walls, maybe a roof. The house isn't finished — but it's standing. Keep noticing what needs attention without losing sight of what's already built.",
      watchFor: "All-or-nothing thinking: 'I messed up once so I'm back to zero.' You're not. One setback doesn't demolish the foundation. It tests it. And it held.",
      completionSuggestion: "Write two lists: 'What I can do now that I couldn't at Step 1' and 'What I'm still learning.' Let both be true at the same time.",
    },
    11: {
      pathwayIntro: "Seeking shared insight means discovering that the relationship has been your greatest teacher — not because it was easy, but because it asked you to grow in ways you never imagined. The insight is that you WERE capable all along. You just needed the foundation, the tools, and the willingness to try.",
      watchFor: "Discounting your growth: 'Anyone could have done this.' No. Not everyone starts where you started. What you've built is real.",
      completionSuggestion: "Ask your partner: 'What's one way you've seen me change?' Listen. Let it land. You did that.",
    },
    12: {
      pathwayIntro: "Carrying the message means showing others that it's never too late to learn. Your journey from ground zero to here is the most inspiring path of all — because you had the least to work with and you built the most. You now know that love is a skill, not a gift. And skills can be learned at any age.",
      watchFor: "Imposter syndrome: 'Who am I to carry any message?' You're the person who built a relationship from the foundation up. That's who.",
      completionSuggestion: "Write a letter to the rebuilder you were at Step 1 — the one who wondered if they could do this at all. Tell them what you built.",
    },
  },
};
