/**
 * IPIP-NEO-120 Interpretations — V2 Relational Reframes
 *
 * Personality through the lens of relationships:
 * "Who You Are in Relationships" — not traits, but relational patterns.
 *
 * Each domain is reframed as a relational capacity, not a personality score.
 * The Big Five relational reframe paragraphs are also surfaced here
 * (see big-five-reframes.ts for cross-assessment triggered paragraphs).
 */

export function getIPIPPercentileLabel(percentile: number): string {
  if (percentile >= 91) return 'Very High';
  if (percentile >= 76) return 'High';
  if (percentile >= 61) return 'Above Average';
  if (percentile >= 41) return 'Average';
  if (percentile >= 26) return 'Below Average';
  if (percentile >= 11) return 'Low';
  return 'Very Low';
}

export interface IPIPDomainInterpretation {
  label: string;
  warmLabel: string;
  description: string;
  fieldInsight: string;
  growthEdge: string;
}

export function getIPIPDomainInterpretation(domain: string, percentile: number): IPIPDomainInterpretation {
  const isHigh = percentile >= 61;

  const interpretations: Record<string, [IPIPDomainInterpretation, IPIPDomainInterpretation]> = {
    neuroticism: [
      // Low neuroticism
      {
        label: 'Emotional Stability',
        warmLabel: 'Steady Ground',
        description:
          'You tend to be emotionally even-keeled — your nervous system does not spike easily, and stress does not knock you off your center. In the relational field, this translates to a stabilizing presence: your partner can feel your steadiness, and it helps regulate the space between you.\n\nThe growing edge: your calm may sometimes read as indifference. Your partner may be in emotional pain and feel like you are not affected — not because you are cold, but because your system processes differently. Naming what you DO feel, even when it is subtle, keeps the field alive.',
        fieldInsight:
          'Your steadiness is a gift to the relational field. Make sure your partner knows you ARE affected — just because your system stays calm does not mean you do not care.',
        growthEdge:
          'Practice naming subtle emotions. "I am not upset, but I notice something — a concern, a tenderness, a slight unease." Your partner needs to know your calm is alive, not empty.',
      },
      // High neuroticism
      {
        label: 'Emotional Sensitivity',
        warmLabel: 'The Instrument',
        description:
          'Your emotional sensitivity is a relational instrument. You pick up on shifts in the space between you and your partner before most people would notice anything has changed. A change in tone, a moment of distance, a flicker of tension — your system registers these signals with remarkable fidelity.\n\nThe challenge is not your sensitivity — it is that your nervous system often reads "something is changing" as "something is wrong." In the relational field, this means you may react to the alarm before you can discern what actually happened. The work is turning alarm into attunement, reactivity into recognition.',
        fieldInsight:
          'You sense what is alive in the relational field with remarkable accuracy. The practice is holding what you sense without immediately reacting to it — using your sensitivity as wisdom instead of alarm.',
        growthEdge:
          'Build a pause between sensing and reacting. When your system detects a shift, take one breath before responding. In that breath, ask: "Am I sensing something real, or is my alarm system adding a story?"',
      },
    ],
    extraversion: [
      // Low extraversion
      {
        label: 'Introversion',
        warmLabel: 'The Deep Well',
        description:
          'You recharge through solitude and quiet. Social energy — including relational energy — has a cost for your system, and you need time alone to restore what closeness draws from you. This is not a deficit. This is how you maintain the quality of your presence.\n\nIn the relational field, your introversion brings depth. You think before you speak. You observe before you act. Your partner may not always know what you are feeling, but when you do share, it tends to carry weight. The growing edge is making sure your need for solitude is not mistaken for disconnection — naming it openly changes everything.',
        fieldInsight:
          'Your presence in the relational field is deep but sometimes invisible. Your partner may need you to make your inner world visible — not all of it, but enough to know you are still there.',
        growthEdge:
          'Name your rhythm: "I need some quiet right now so I can come back to you more present." That one sentence prevents your solitude from being read as withdrawal.',
      },
      // High extraversion
      {
        label: 'Extraversion',
        warmLabel: 'The Spark',
        description:
          'You draw energy from connection — from conversation, shared activity, and the vitality of being with people. In the relational field, you bring warmth, aliveness, and social energy that can light up the space between you and your partner.\n\nThe growing edge: if your partner is more introverted, your different rhythms create a natural tension. You charge through togetherness; they recharge through solitude. This is not a problem to solve — it is creative tension. The field between you can hold both rhythms if you can name them without judgment: "I need more" and "I need less" are both valid signals.',
        fieldInsight:
          'Your energy animates the relational field. Be aware of the difference between energizing the space and filling it — sometimes the field needs your energy, and sometimes it needs your quiet.',
        growthEdge:
          'Practice noticing when your partner\'s energy is lower than yours without interpreting it as disconnection. Their quiet is not rejection — it is their rhythm. Can you be present with their stillness?',
      },
    ],
    openness: [
      // Low openness
      {
        label: 'Groundedness',
        warmLabel: 'The Anchor',
        description:
          'You value the known, the stable, the reliable. In relationships, this translates to deep loyalty and consistency — you show up in predictable, trustworthy ways that your partner can count on. You are not someone who chases novelty or destabilizes the relational field with constant change.\n\nThe growing edge: the relational field between you and your partner is always moving. It is not static because two living people are not static. Becoming comfortable with that aliveness — without needing to control it or retreat from it — is the invitation.',
        fieldInsight:
          'Your consistency anchors the relational field. Make sure that anchor allows movement — a boat that cannot sway with the water eventually snaps its line.',
        growthEdge:
          'Try one small experiment this week: do something slightly different in your routine with your partner. Not a dramatic change — just a variation. Notice what emerges in the space between you when you allow a small surprise.',
      },
      // High openness
      {
        label: 'Openness',
        warmLabel: 'The Explorer',
        description:
          'You are drawn to the new, the curious, the unexplored — in ideas, experiences, and in the depths of your own inner life. In the relational field, you bring a quality of wonder and exploration that keeps the space between you and your partner alive with possibility.\n\nThe growing edge: your love of novelty can sometimes leave your partner feeling like the familiar is not enough — like the relationship itself needs to be perpetually interesting to hold your attention. Your partner may need the comfort of routine while you need the spark of discovery. Both needs are valid.',
        fieldInsight:
          'Your curiosity keeps the relational field dynamic and alive. Be mindful that your partner may also need the field to feel stable and predictable. Both energies serve the relationship.',
        growthEdge:
          'Practice finding depth in the familiar. The most profound exploration is not always outward — it is going deeper into what you already have, discovering what you have not yet seen in the person beside you.',
      },
    ],
    agreeableness: [
      // Low agreeableness
      {
        label: 'Directness',
        warmLabel: 'The Truth-Teller',
        description:
          'You hold your ground well. You know what you think, what you want, and you do not fold easily. In relationships, this is a strength — your partner always knows where they stand with you. You do not perform agreement when you do not feel it, and your authenticity keeps the relational field honest.\n\nThe growing edge: holding your ground AND remaining curious about what emerges in the space between you. Strength does not require walls. Can you be firm AND permeable? Can you hold your truth AND make room for your partner\'s, even when they contradict each other?',
        fieldInsight:
          'Your directness brings clarity to the relational field. Make sure clarity does not become rigidity — the field needs your truth, but it also needs your flexibility.',
        growthEdge:
          'After stating your position, try adding genuine curiosity: "That is where I stand — where are you?" Let the space between hold two truths at once.',
      },
      // High agreeableness
      {
        label: 'Warmth',
        warmLabel: 'The Harmonizer',
        description:
          'You are skilled at harmony and deeply attuned to what others need. In the relational field, you create warmth, safety, and a sense of welcome that makes your partner feel held. You naturally prioritize connection over being right, and the space between you tends to feel soft and open.\n\nThe growing edge: harmony without authenticity is not peace — it is a slow leak. The relational field between you needs BOTH of you to be present, not one person accommodating and the other leading. Your truth matters as much as your partner\'s comfort.',
        fieldInsight:
          'Your warmth is a genuine gift to the relational field. Notice whether that warmth sometimes costs you your own truth. A field that holds both partners\' reality is warmer than a field where one partner disappears.',
        growthEdge:
          'Practice one small act of disagreement this week — not to be difficult, but to bring your full self into the relational field. Your partner needs your truth as much as they need your warmth.',
      },
    ],
    conscientiousness: [
      // Low conscientiousness
      {
        label: 'Flexibility',
        warmLabel: 'The Flow',
        description:
          'You are flexible, spontaneous, and comfortable with improvisation. In the relational field, you bring a quality of ease — you do not need everything planned, structured, or controlled. You go with the flow, and your partner may find your spontaneity refreshing and freeing.\n\nThe growing edge: relational trust is partly built on follow-through. When you say you will do something, your partner\'s nervous system starts to depend on it. Inconsistency — even when it comes from genuine flexibility — can register as unreliability in the relational field.',
        fieldInsight:
          'Your flexibility brings ease and lightness to the relational field. Be mindful that your partner may need more predictability from you than you naturally provide — not to control you, but to feel safe.',
        growthEdge:
          'Pick one small commitment to your partner and keep it consistently for a week. Not because you need to be rigid — but because reliable follow-through speaks directly to your partner\'s nervous system.',
      },
      // High conscientiousness
      {
        label: 'Structure',
        warmLabel: 'The Architect',
        description:
          'You bring structure, follow-through, and reliability to your relationship. Your partner can count on you — you do what you say, you plan ahead, and you take your commitments seriously. In the relational field, your consistency creates a foundation of trust that your partner\'s nervous system can rest on.\n\nThe growing edge: relationships are not projects. They cannot be optimized, managed, or planned into perfection. Sometimes the relational field is asking you to let go of the plan and trust what emerges. Your partner may sometimes need to feel MET, not managed.',
        fieldInsight:
          'Your reliability is a cornerstone of the relational field. Notice when your structure becomes rigidity — when the plan becomes more important than the person in front of you.',
        growthEdge:
          'Practice letting one thing this week be messy, unplanned, or imperfect with your partner. Not everything needs to be organized. Sometimes the best relational moments are the ones that were not on the agenda.',
      },
    ],
  };

  const [low, high] = interpretations[domain] || [
    { label: domain, warmLabel: domain, description: '', fieldInsight: '', growthEdge: '' },
    { label: domain, warmLabel: domain, description: '', fieldInsight: '', growthEdge: '' },
  ];
  return isHigh ? high : low;
}

/** Legacy compatibility — returns just the description string */
export function getIPIPDomainDescription(domain: string, percentile: number): string {
  return getIPIPDomainInterpretation(domain, percentile).description;
}
