/**
 * Early Assessment Insights — Personalization before a full portrait exists.
 *
 * When a user has completed a relevant assessment but doesn't yet have
 * a full portrait (needs all 6 assessments), this module generates a
 * 1-2 sentence insight from their raw scores for the current step.
 *
 * This fills the gap between:
 *   - "No data" (shows assessment nudge)
 *   - "Full portrait" (shows portrait bridge)
 *
 * Language rules: qualitative, warm, never raw numbers, never "failed",
 * "weakness", "fix". Use "growth edge", "building", "your pattern".
 */

// ─── Types ──────────────────────────────────────────────

export interface EarlyInsight {
  /** The insight text — 1-2 sentences, qualitative */
  text: string;
  /** Label for the card, e.g. "From Your Attachment Assessment" */
  label: string;
  /** Assessment that generated this insight */
  assessmentName: string;
}

/**
 * Score records from fetchAllScores — keyed by assessment type.
 * Each value has { id, scores } where scores is assessment-specific.
 */
type AllScores = Record<string, { id: string; scores: any }>;

// ─── Step-to-Assessment Primary Mapping ─────────────────
// Each step maps to one primary assessment. This determines which
// assessment's scores generate the early insight for that step.

const STEP_PRIMARY_ASSESSMENT: Record<number, string> = {
  1: 'ecr-r',
  2: 'dsi-r',
  3: 'tender-personality-60',
  4: 'sseit',
  5: 'ecr-r',
  6: 'dutch',
  7: 'sseit',
  8: 'values',
  9: 'dutch',
  10: 'values',
  11: 'ecr-r',
  12: 'ecr-r',
};

// ─── Assessment Display Names ───────────────────────────

const ASSESSMENT_NAMES: Record<string, string> = {
  'ecr-r': 'Attachment Assessment',
  'tender-personality-60': 'Personality Assessment',
  'sseit': 'Emotional Intelligence Assessment',
  'dsi-r': 'Differentiation Assessment',
  'dutch': 'Conflict Style Assessment',
  'values': 'Values Assessment',
};

// ─── Main API ───────────────────────────────────────────

/**
 * Generate an early insight for a specific step based on available
 * assessment scores. Returns null if the relevant assessment hasn't
 * been completed yet.
 */
export function getEarlyInsight(
  stepNumber: number,
  allScores: AllScores | null
): EarlyInsight | null {
  if (!allScores) return null;

  const assessmentType = STEP_PRIMARY_ASSESSMENT[stepNumber];
  if (!assessmentType) return null;

  const scoreData = allScores[assessmentType];
  if (!scoreData?.scores) return null;

  const builder = INSIGHT_BUILDERS[stepNumber];
  if (!builder) return null;

  const text = builder(scoreData.scores, allScores);
  if (!text) return null;

  return {
    text,
    label: `From Your ${ASSESSMENT_NAMES[assessmentType] ?? 'Assessment'}`,
    assessmentName: ASSESSMENT_NAMES[assessmentType] ?? assessmentType,
  };
}

// ─── Insight Builders ───────────────────────────────────
// Each builder receives the primary assessment's scores and optionally
// all scores, and returns a qualitative insight string.

type InsightBuilder = (scores: any, all: AllScores) => string | null;

const INSIGHT_BUILDERS: Record<number, InsightBuilder> = {
  1: buildStep1Insight,
  2: buildStep2Insight,
  3: buildStep3Insight,
  4: buildStep4Insight,
  5: buildStep5Insight,
  6: buildStep6Insight,
  7: buildStep7Insight,
  8: buildStep8Insight,
  9: buildStep9Insight,
  10: buildStep10Insight,
  11: buildStep11Insight,
  12: buildStep12Insight,
};

// ── Step 1: Acknowledge the Strain (ECR-R) ──────────────

function buildStep1Insight(scores: any): string | null {
  const anxiety = scores.anxietyScore;
  const avoidance = scores.avoidanceScore;
  const style = scores.attachmentStyle;

  if (!anxiety || !avoidance) return null;

  if (style === 'secure') {
    return (
      'Your attachment pattern leans toward security \u2014 you tend to feel relatively ' +
      'comfortable with closeness. This step helps you notice the subtler strains ' +
      'that even secure relating can overlook.'
    );
  }

  if (anxiety > avoidance) {
    return (
      'You tend to move toward connection under stress \u2014 reaching, checking, sometimes ' +
      'pursuing reassurance. This step helps you see that reach clearly, with compassion ' +
      'rather than judgment.'
    );
  }

  if (avoidance > anxiety) {
    return (
      'You tend to pull inward when things get intense \u2014 creating space, going quiet, ' +
      'managing alone. This step helps you notice what your system is protecting, ' +
      'and what it costs.'
    );
  }

  return (
    'Your pattern moves between reaching and withdrawing depending on the situation. ' +
    'This step helps you see both moves clearly, without judging either one.'
  );
}

// ── Step 2: Trust the Relational Field (DSI-R) ─────────

function buildStep2Insight(scores: any): string | null {
  const subscales = scores.subscaleScores;
  if (!subscales) return null;

  const iPosition = subscales['I-Position'] ?? subscales['i-position'];
  const fusion = subscales['Fusion with Others'] ?? subscales['fusion-with-others'];

  if (iPosition?.normalized !== undefined && iPosition.normalized < 40) {
    return (
      'Holding your own ground in relationships is a growing edge for you. ' +
      'Trusting the relational field starts with trusting that you can stay yourself ' +
      'while staying connected.'
    );
  }

  if (fusion?.normalized !== undefined && fusion.normalized < 40) {
    return (
      'You may carry strong boundaries \u2014 sometimes stronger than you need. ' +
      'This step invites you to soften just enough to feel the space between you, ' +
      'where something alive is already growing.'
    );
  }

  return (
    'Your differentiation pattern shapes how you experience the relational field. ' +
    'This step helps you feel what\u2019s alive in the space between you and another person.'
  );
}

// ── Step 3: Release Certainty (IPIP-NEO-120) ────────────

function buildStep3Insight(scores: any): string | null {
  const percentiles = scores.domainPercentiles;
  if (!percentiles) return null;

  const openness = percentiles['Openness to Experience'] ?? percentiles['openness'];
  const agreeableness = percentiles['Agreeableness'] ?? percentiles['agreeableness'];

  if (openness !== undefined && openness < 40) {
    return (
      'You tend toward the familiar and tested \u2014 certainty feels like safety. ' +
      'Releasing certainty may feel like a bigger stretch for you, and that\u2019s okay. ' +
      'Start with small moments of "what if I\u2019m wrong about this."'
    );
  }

  if (agreeableness !== undefined && agreeableness < 40) {
    return (
      'You tend to hold your position firmly. That\u2019s a strength in many contexts, ' +
      'but in this step, it may mean the stories you tell about conflict feel especially true. ' +
      'What would it cost to hold them more lightly?'
    );
  }

  if (openness !== undefined && openness > 70) {
    return (
      'Your openness is a genuine asset here \u2014 you\u2019re naturally curious about other ' +
      'perspectives. This step may come naturally. Use it to notice where certainty ' +
      'still hides, even in open-minded people.'
    );
  }

  return (
    'Your personality patterns shape how tightly you hold your stories. ' +
    'This step invites you to notice which certainties protect you \u2014 and which ones keep you stuck.'
  );
}

// ── Step 4: Examine Our Part (SSEIT) ────────────────────

function buildStep4Insight(scores: any): string | null {
  const total = scores.totalNormalized;
  const subscales = scores.subscaleNormalized;

  if (total === undefined) return null;

  if (total < 40) {
    return (
      'Your emotional awareness is a growing edge \u2014 and that\u2019s exactly what this step ' +
      'develops. Examining your part becomes easier when you can name what you\u2019re feeling, ' +
      'and this step builds that capacity gently.'
    );
  }

  const managingOwn = subscales?.['Managing Own Emotions'] ?? subscales?.['managing-own-emotions'];
  if (managingOwn !== undefined && managingOwn < 40) {
    return (
      'You sense emotions well but managing them under pressure is a growing edge. ' +
      'This step helps you see how your emotional reactions shape the dance \u2014 ' +
      'the first step toward doing something different with them.'
    );
  }

  if (total > 70) {
    return (
      'Your emotional awareness is a quiet strength. You likely already sense your part ' +
      'in the pattern. This step asks you to go deeper \u2014 past what you know ' +
      'into what you haven\u2019t wanted to see.'
    );
  }

  return (
    'Your emotional intelligence shapes how you see your part in the dance. ' +
    'This step builds on that foundation \u2014 looking honestly at what you bring to the pattern.'
  );
}

// ── Step 5: Share Our Truths (ECR-R) ────────────────────

function buildStep5Insight(scores: any): string | null {
  const anxiety = scores.anxietyScore;
  const avoidance = scores.avoidanceScore;

  if (!anxiety || !avoidance) return null;

  if (avoidance > 4.5) {
    return (
      'Sharing feels risky for you \u2014 your system tends to keep your inner world private. ' +
      'This step doesn\u2019t ask you to change who you are. It invites you to try ' +
      '10% more openness and notice what happens.'
    );
  }

  if (anxiety > 4.5) {
    return (
      'You may share a lot \u2014 but sometimes from the protective layer rather than the ' +
      'tender truth underneath. This step helps you get underneath the frustration ' +
      'to what you\u2019re really asking for.'
    );
  }

  return (
    'Your attachment pattern shapes what feels safe to share. This step pushes ' +
    'past the comfortable level of sharing into the truths that actually connect.'
  );
}

// ── Step 6: Release the Enemy Story (DUTCH) ─────────────

function buildStep6Insight(scores: any): string | null {
  const subscales = scores.subscaleScores;
  const primary = scores.primaryStyle;

  if (!subscales) return null;

  if (primary === 'Forcing' || primary === 'forcing') {
    return (
      'Your conflict style leans toward pushing your position. The enemy story ' +
      'often sounds like "if they would just listen." This step helps you see ' +
      'what\u2019s underneath the push \u2014 and what your partner sees from their side.'
    );
  }

  if (primary === 'Avoiding' || primary === 'avoiding') {
    return (
      'Your conflict style tends toward avoidance \u2014 the enemy story stays internal, ' +
      'unspoken but powerful. This step helps you bring the story into the light, ' +
      'where it can soften.'
    );
  }

  if (primary === 'Yielding' || primary === 'yielding') {
    return (
      'You tend to accommodate \u2014 which can look like releasing the enemy story, ' +
      'but sometimes it\u2019s just burying it. This step helps you tell the difference ' +
      'between genuine letting go and quiet resentment.'
    );
  }

  return (
    'Your conflict patterns shape the enemy stories you carry. Understanding ' +
    'how you navigate disagreement reveals where the story lives \u2014 and where it can dissolve.'
  );
}

// ── Step 7: Invite Your Partner In (SSEIT) ──────────────

function buildStep7Insight(scores: any): string | null {
  const total = scores.totalNormalized;
  const subscales = scores.subscaleNormalized;

  if (total === undefined) return null;

  const managingOthers = subscales?.['Managing Others\' Emotions'] ?? subscales?.['managing-others-emotions'];

  if (managingOthers !== undefined && managingOthers > 60) {
    return (
      'You have a gift for reading and holding space for others\u2019 emotions. ' +
      'This step channels that gift into deliberate invitation \u2014 reaching out not ' +
      'because you sense need, but because you choose connection.'
    );
  }

  if (total < 40) {
    return (
      'Invitation may feel awkward when emotions are hard to read \u2014 yours or theirs. ' +
      'Start small. The practices here are calibrated for people who find the ' +
      'emotional landscape unfamiliar territory.'
    );
  }

  return (
    'Your emotional awareness shapes the quality of your invitations. ' +
    'This step is about extending genuine reach \u2014 the kind that comes from knowing ' +
    'what you feel and being willing to show it.'
  );
}

// ── Step 8: Create New Patterns (Values) ────────────────

function buildStep8Insight(scores: any): string | null {
  const domains = scores.domainScores;
  const topValues = scores.top5Values;
  const highGaps = scores.highGapDomains;

  if (!domains && !topValues) return null;

  if (highGaps && highGaps.length > 0) {
    return (
      'There\u2019s a gap between what matters most to you and how you\u2019re living it. ' +
      'The new patterns you build in this step are your bridge \u2014 turning your values ' +
      'from aspirations into daily practice.'
    );
  }

  if (topValues && topValues.length > 0) {
    const topCategory = formatValueName(topValues[0]);
    return (
      `Your top value centers around ${topCategory}. The new patterns you design ` +
      'here should reflect what matters most \u2014 when your daily moves align with ' +
      'your deepest values, change becomes self-sustaining.'
    );
  }

  return (
    'Your values compass guides the new patterns you\u2019re building. ' +
    'Knowing what matters most helps you design responses that feel authentic.'
  );
}

// ── Step 9: Practice Repair (DUTCH) ─────────────────────

function buildStep9Insight(scores: any): string | null {
  const primary = scores.primaryStyle;
  const secondary = scores.secondaryStyle;

  if (!primary) return null;

  if (primary === 'Problem-Solving' || primary === 'problem-solving') {
    return (
      'Your natural conflict style favors collaboration \u2014 that\u2019s a real asset for repair. ' +
      'This step helps you bring that problem-solving energy to emotional repair, ' +
      'where the "solution" is often just being present.'
    );
  }

  if (primary === 'Avoiding' || primary === 'avoiding') {
    return (
      'Your tendency to avoid conflict means repair often gets delayed. ' +
      'This step gives you structured, gentle ways to initiate repair ' +
      'before distance becomes the default.'
    );
  }

  if (primary === 'Forcing' || primary === 'forcing') {
    return (
      'Repair asks for something different than your default conflict style. ' +
      'Instead of pushing for resolution, this step teaches you to soften into ' +
      'the rupture \u2014 to listen before you fix.'
    );
  }

  return (
    'Your conflict style shapes how you approach repair. Understanding your ' +
    'patterns helps you repair more skillfully \u2014 timing, tone, and genuine presence.'
  );
}

// ── Step 10: Build Rituals (Values) ─────────────────────

function buildStep10Insight(scores: any): string | null {
  const topValues = scores.top5Values;
  const domains = scores.domainScores;
  const avoidance = scores.avoidanceTendency;

  if (!topValues && !domains) return null;

  if (avoidance !== undefined && avoidance > 0.5) {
    return (
      'Your values responses show a tendency toward caution in action. ' +
      'The rituals you build here are your practice ground \u2014 small, safe ways ' +
      'to close the gap between what you believe and how you live.'
    );
  }

  if (topValues && topValues.length >= 2) {
    const first = formatValueName(topValues[0]);
    const second = formatValueName(topValues[1]);
    return (
      `Your deepest values center around ${first} and ${second}. ` +
      'The rituals that will last are the ones that express these values daily \u2014 ' +
      'small, consistent moments that say "this is who we are."'
    );
  }

  return (
    'Your values point toward the rituals that will last. When daily practices ' +
    'align with what matters most, they become self-sustaining.'
  );
}

// ── Step 11: Sustain the Patterns (ECR-R) ───────────────

function buildStep11Insight(scores: any): string | null {
  const style = scores.attachmentStyle;

  if (!style) return null;

  if (style === 'secure') {
    return (
      'Your secure foundation gives you a natural advantage in sustaining new patterns. ' +
      'This step is about deepening what\u2019s already working \u2014 and noticing ' +
      'where even secure patterns can grow.'
    );
  }

  return (
    'Your attachment pattern shapes how you handle setbacks. When the old pattern returns ' +
    '(and it will), remembering your starting point helps you see how far you\u2019ve come. ' +
    'Consider retaking this assessment to measure your growth.'
  );
}

// ── Step 12: Become a Refuge (ECR-R) ────────────────────

function buildStep12Insight(scores: any): string | null {
  const style = scores.attachmentStyle;
  const anxiety = scores.anxietyScore;
  const avoidance = scores.avoidanceScore;

  if (!style) return null;

  if (style === 'secure') {
    return (
      'Your attachment pattern already carries the seeds of refuge. ' +
      'This step is about living intentionally from that place \u2014 letting your ' +
      'security become a gift to every relationship around you.'
    );
  }

  if (anxiety > 4 && avoidance > 4) {
    return (
      'Becoming a refuge is your deepest growth edge \u2014 and the most transformative one. ' +
      'Every step you\u2019ve taken has been building this capacity. ' +
      'Refuge isn\u2019t about being perfect. It\u2019s about being present.'
    );
  }

  return (
    'Your journey from your starting pattern to this step is your evidence of growth. ' +
    'Becoming a refuge means holding all of it \u2014 the reaching, the retreating, the learning \u2014 ' +
    'with gentleness.'
  );
}

// ─── Helpers ────────────────────────────────────────────

/** Convert a value domain ID into human-readable form. */
function formatValueName(domainId: string): string {
  const MAP: Record<string, string> = {
    'intimacy-connection': 'intimacy and connection',
    'honesty-authenticity': 'honesty and authenticity',
    'growth-learning': 'growth and learning',
    'security-stability': 'security and stability',
    'adventure-novelty': 'adventure and novelty',
    'independence-autonomy': 'independence and autonomy',
    'family-legacy': 'family and legacy',
    'service-contribution': 'service and contribution',
    'playfulness-humor': 'playfulness and humor',
    'spirituality-meaning': 'spirituality and meaning',
  };

  return MAP[domainId] ?? domainId.replace(/-/g, ' ');
}
