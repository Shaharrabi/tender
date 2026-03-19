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
  },
};
