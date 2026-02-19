import { CSI16Scores } from '@/types/couples';

export interface CSI16Interpretation {
  label: string;
  warmLabel: string;
  interpretation: string;
  fieldInsight: string;
  growthEdge: string;
}

type SatisfactionLevel = CSI16Scores['satisfactionLevel'];

const INTERPRETATIONS: Record<SatisfactionLevel, CSI16Interpretation> = {
  high: {
    label: 'Deeply Satisfied',
    warmLabel: 'A Living Warmth',
    interpretation:
      'Something real lives in the space between you and your partner. The kind of satisfaction you are experiencing is not perfection — it is presence. You have built something together that holds: a relationship where both people feel seen, enjoyed, and chosen. That does not happen by accident. It happens because, again and again, you both turned toward instead of away.\n\nThis is worth pausing to feel. Not as a destination you have reached, but as a living thing you are tending. The warmth between you is not a given — it is a practice, and you are practicing it well.',
    fieldInsight:
      'The relational field between you carries a quality of ease and mutual delight. Your partner likely feels the steadiness of your presence, and you likely feel the safety of theirs. This kind of reciprocal warmth creates a foundation that can hold difficulty when it comes — and it will come, because that is what being alive together means.',
    growthEdge:
      'When satisfaction is high, the invitation is not to fix but to deepen. What would it look like to share something you have never said — a gratitude, a vulnerability, a dream you have been holding privately? The space between you can hold more than you think. Let it.',
  },
  moderate: {
    label: 'Satisfied',
    warmLabel: 'Solid Ground',
    interpretation:
      'You have a real foundation here — something genuine and worth tending. Your relationship carries enough warmth and goodness that both of you feel, on most days, that this is where you want to be. That matters more than you might think.\n\nAt the same time, you may sense places where the connection could be richer, where something unnamed sits just beneath the surface. That awareness is not a sign of failure. It is a sign of care — you notice because you want more for the two of you, and that wanting is itself a form of love.',
    fieldInsight:
      'The space between you has a kind of comfortable reliability. You know each other well enough to move through daily life together, and there is genuine regard in the way you relate. The edge to explore is whether comfort has quietly replaced curiosity — whether you still ask each other real questions, or whether the familiarity has settled into pleasant autopilot.',
    growthEdge:
      'The growth here is about intentional deepening. Choose one evening this week to be genuinely curious about your partner — not about logistics, but about their inner world. What are they dreaming about? What is weighing on them? Small moments of real attention have an outsized effect on satisfaction. The foundation is strong. Now build upward.',
  },
  low: {
    label: 'Struggling',
    warmLabel: 'The Quiet Distance',
    interpretation:
      'Something has shifted in the space between you and your partner — a distance that may have arrived so gradually you cannot point to when it started. You are not imagining it. The gap between what you hoped this relationship would feel like and what it feels like right now is real, and it deserves honest attention.\n\nThis does not mean the relationship is broken. It means something important is asking to be seen. Dissatisfaction is not a verdict — it is information. It is your heart telling you that the way things are is not the way they need to stay. And the fact that you are paying attention, that you are willing to look at this honestly, is itself a kind of courage.',
    fieldInsight:
      'The relational field between you may feel thin right now — like the easy warmth that once flowed between you has been replaced by something more effortful. You might notice more silence, more surface-level exchanges, or a kind of loneliness that is particular to being with someone and still feeling unseen. This is one of the hardest places to be in a relationship.',
    growthEdge:
      'The work here is both brave and simple: name what you are feeling without blame. Not "you never..." but "I have been feeling distant, and I miss us." Repair does not start with grand gestures. It starts with one honest sentence spoken with care. If the distance feels too wide to bridge alone, a couples therapist can help you build the bridge together.',
  },
  crisis: {
    label: 'In Distress',
    warmLabel: 'A Hard Season',
    interpretation:
      'You are in pain, and this score reflects that honestly. The relationship that was supposed to be your refuge may feel like a source of hurt, exhaustion, or numbness right now. That is an incredibly difficult place to be, and you deserve compassion — not judgment — for what you are going through.\n\nLow satisfaction does not mean low worth. It does not mean you chose wrong or that you are failing. It means something in the relationship needs serious, caring attention — and possibly professional support. The fact that you completed this assessment, that you are willing to look at the truth of your experience, speaks to a part of you that has not given up. Honor that part.',
    fieldInsight:
      'The space between you may feel heavy, contracted, or even hostile. You might be moving through the same house without truly meeting each other. The daily rituals that once carried warmth — a greeting, a meal together, a goodnight — may have become hollow or loaded. This kind of relational pain affects everything: your sleep, your mood, your sense of self.',
    growthEdge:
      'This is not a moment for self-improvement tips. This is a moment to be honest about what you need. If the relationship can be repaired, it will require both partners showing up with willingness and vulnerability — and almost certainly with the help of a skilled therapist. If the relationship cannot be repaired, you deserve support in navigating that truth with dignity. Either way, you do not have to carry this alone.',
  },
};

export function getCSI16Interpretation(
  level: SatisfactionLevel,
): CSI16Interpretation {
  return INTERPRETATIONS[level];
}
