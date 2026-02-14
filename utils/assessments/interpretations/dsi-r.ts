export interface DSIRLevelInfo {
  level: string;
  warmLabel: string;
  description: string;
  fieldInsight: string;
  growthEdge: string;
  bodyPrompt: string;
}

export function getDSIRLevel(normalized: number): DSIRLevelInfo {
  if (normalized >= 76) {
    return {
      level: 'High Differentiation',
      warmLabel: 'Grounded Presence',
      description:
        'You have developed the capacity to stay yourself while staying close — to hold your own truth without disconnecting from your partner, and to enter the intimacy of the relational field without losing your shape. This is one of the most important relational capacities there is.\n\nYou can think clearly under emotional pressure. You can hold your position without attacking your partner\'s. You can feel your partner\'s pain without being consumed by it. This does not mean you are unaffected — it means you can be affected AND remain present. This is not rigidity. This is the kind of groundedness that lets the relational field between you breathe.',
      fieldInsight:
        'The space between you and your partner has room for both of you — your truth and theirs, your emotions and theirs — without one collapsing into the other.',
      growthEdge:
        'Deepening — moving from differentiation as a skill into differentiation as a way of being. Can you hold your ground AND remain curious? Can you be firm AND permeable?',
      bodyPrompt:
        'Notice what it feels like to hold your ground during emotional intensity. Where does that groundedness live in your body? That is your center — the place you can return to when the field gets turbulent.',
    };
  }
  if (normalized >= 61) {
    return {
      level: 'Above Average',
      warmLabel: 'Growing Steadiness',
      description:
        'You generally maintain a solid sense of who you are in your relationship. In most situations, you can hold your own perspective, manage emotional intensity, and stay connected to your partner without losing yourself. This is a real strength.\n\nThe growing edge is in the moments of high activation — the fights that escalate, the conversations that touch old wounds, the moments when your partner\'s emotions pull you out of your own center. In those moments, the balance between self and other becomes harder to hold. That is where your growth lives.',
      fieldInsight:
        'In calm waters, you hold yourself well in the relational field. Under emotional pressure, you may sometimes merge with your partner\'s experience or retreat from it. Both are protective — neither is necessary.',
      growthEdge:
        'Building the capacity to stay centered during high-activation moments. The practice is not about being less affected — it is about being affected without losing your shape.',
      bodyPrompt:
        'When emotional intensity rises, where do you feel yourself start to lose your center? That is the exact spot where your growth practice lives. Name it. Know it. Return to it.',
    };
  }
  if (normalized >= 41) {
    return {
      level: 'Average',
      warmLabel: 'Finding Your Ground',
      description:
        'You are in the territory where most people live — sometimes holding your ground well, sometimes being pulled into emotional reactivity or fusion with your partner. This is not a problem to fix. It is a pattern to notice.\n\nThe relational field between you and your partner is always asking a question: "Can you be close AND separate at the same time?" Right now, your answer sometimes depends on the intensity of the moment. When things are calm, you can. When things heat up, you may find yourself either merging with your partner\'s emotional state or pulling away from it. Both are protective patterns that made sense at some point in your history.',
      fieldInsight:
        'The space between you and your partner oscillates between closeness and distance, but sometimes the closeness becomes fusion and the distance becomes cutoff. Learning to tell the difference is the work.',
      growthEdge:
        'Building awareness of the moment you tip from healthy closeness into fusion, or from healthy space into cutoff. That tipping point is your growth edge — and noticing it is already halfway to changing it.',
      bodyPrompt:
        'During an emotionally charged moment with your partner, check in: am I feeling MY feelings, or have I absorbed theirs? Where does the boundary between "me" and "us" live in my body right now?',
    };
  }
  if (normalized >= 26) {
    return {
      level: 'Below Average',
      warmLabel: 'The Merge',
      description:
        'You may find it hard to hold onto your own truth when your partner\'s emotions are strong — hard to know where you end and they begin, hard to maintain your perspective when theirs is intense. This is not weakness. This is a pattern that developed because, at some point, staying close required giving up parts of yourself.\n\nThe relational field between you and your partner may feel overwhelming at times — too much feeling, too much merging, too much of you disappearing into the needs of the relationship. Or you may swing the other way, cutting off emotionally to protect yourself. Both patterns come from the same root: the belief that you cannot be fully yourself AND fully connected at the same time.',
      fieldInsight:
        'The space between you and your partner may feel like it requires a sacrifice — your truth or your connection, but not both. That is the old pattern talking. Both are possible.',
      growthEdge:
        'One small act of self-definition per week: stating a preference, holding a boundary, saying "I see it differently." Not to create conflict — but to bring more of you into the relational field.',
      bodyPrompt:
        'When your partner\'s emotions feel overwhelming, notice: where do their feelings enter your body? Where do your own feelings live? Can you feel both without the boundary dissolving?',
    };
  }
  return {
    level: 'Low Differentiation',
    warmLabel: 'Learning to Stay',
    description:
      'Maintaining your own sense of self in the intensity of a close relationship is genuinely difficult for you right now. You may frequently feel overwhelmed by emotions — yours or your partner\'s — lose yourself in their needs, or swing between intense closeness and protective shutdown. This is not a character flaw. This is a nervous system that never learned the skill of being close AND separate at the same time.\n\nThe fact that you are here, looking at this pattern, is itself an act of differentiation — you are stepping outside the pattern to see it. That capacity to observe is your foundation. Everything else builds from there.',
    fieldInsight:
      'The relational field may feel like a force that sweeps you up — too intense to navigate, too charged to remain yourself within. You are learning that you can enter the field without losing your shape. This takes practice. It takes time. It is entirely possible.',
    growthEdge:
      'Start with the simplest form of differentiation: naming what is yours. "I feel..." not "You make me feel..." That small shift in language is a radical act of self-ownership.',
    bodyPrompt:
      'Place your feet on the floor. Feel the ground beneath you. That ground is always there, even when the emotional field between you and your partner feels overwhelming. Your body can teach you about groundedness before your mind understands it.',
  };
}

export function getDSIRSubscaleLabel(subscale: string): string {
  const labels: Record<string, string> = {
    emotionalReactivity: 'Emotional Weather',
    iPosition: 'Your Own Voice',
    emotionalCutoff: 'Protective Walls',
    fusionWithOthers: 'The Merge',
  };
  return labels[subscale] || subscale;
}

export function getDSIRSubscaleDescription(subscale: string): string {
  const descriptions: Record<string, string> = {
    emotionalReactivity:
      'How your nervous system responds to emotional intensity in the relational field. Higher scores mean your system can hold more intensity without flooding — you feel the weather without being swept away by it.',
    iPosition:
      'Your capacity to hold your own truth — to say what you believe, to maintain your perspective, and to remain yourself even when your partner sees it differently. This is not stubbornness. This is the foundation of authentic connection.',
    emotionalCutoff:
      'How much you rely on emotional walls to manage the intensity of closeness. Lower cutoff means you can stay connected even when it is uncomfortable. Higher cutoff means your system pulls away to protect itself — understandable, but costly over time.',
    fusionWithOthers:
      'How much you tend to absorb your partner\'s emotional state — losing your own feelings in theirs, losing your perspective in theirs. Less fusion means you can be deeply empathic without disappearing.',
  };
  return descriptions[subscale] || '';
}
