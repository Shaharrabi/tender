import { AssessmentConfig, GenericQuestion, LikertOption, SSEITScores } from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Rarely true of me' },
  { value: 2, label: 'Occasionally true of me' },
  { value: 3, label: 'Sometimes true of me' },
  { value: 4, label: 'Often true of me' },
  { value: 5, label: 'Almost always true of me' },
];

// 0-based indices of reverse-scored items (items 4, 7, 11, 16)
const REVERSE_ITEMS = new Set([3, 6, 10, 15]);

const QUESTIONS: GenericQuestion[] = [
  // ── Perception (Items 1–4) ──
  { id: 1, text: 'I can usually sense how my partner is feeling before they say anything.', inputType: 'likert', subscale: 'perception' },
  { id: 2, text: 'I notice shifts in the mood between us — even small ones — as they happen.', inputType: 'likert', subscale: 'perception' },
  { id: 3, text: 'When I walk into a room, I pick up on the emotional atmosphere quickly.', inputType: 'likert', subscale: 'perception' },
  { id: 4, text: 'I\'m often the last to realize that someone close to me has been upset.', inputType: 'likert', subscale: 'perception', reverseScored: true },

  // ── Managing Own Emotions (Items 5–7) ──
  { id: 5, text: 'When a difficult conversation starts to overwhelm me, I can usually find a way to steady myself before I react.', inputType: 'likert', subscale: 'managingOwn' },
  { id: 6, text: 'I can sit with uncomfortable feelings — sadness, frustration, uncertainty — without needing to immediately do something about them.', inputType: 'likert', subscale: 'managingOwn' },
  { id: 7, text: 'When strong emotions hit me, they take over — I can\'t think clearly or respond the way I want to.', inputType: 'likert', subscale: 'managingOwn', reverseScored: true },

  // ── Managing Others' Emotions (Items 8–11) ──
  { id: 8, text: 'When my partner is upset, I can be a steady presence for them without trying to fix the problem right away.', inputType: 'likert', subscale: 'managingOthers' },
  { id: 9, text: 'I generally know whether someone needs me to listen quietly or needs me to actively help.', inputType: 'likert', subscale: 'managingOthers' },
  { id: 10, text: 'I can hold space for someone else\'s difficult emotions without getting pulled into them myself.', inputType: 'likert', subscale: 'managingOthers' },
  { id: 11, text: 'When someone I love is in pain, I often freeze up — I don\'t know what they need from me.', inputType: 'likert', subscale: 'managingOthers', reverseScored: true },

  // ── Utilization (Items 12–16) ──
  { id: 12, text: 'My emotions give me useful information about what\'s happening in my relationships.', inputType: 'likert', subscale: 'utilization' },
  { id: 13, text: 'I can channel frustration into a productive conversation instead of letting it become an argument.', inputType: 'likert', subscale: 'utilization' },
  { id: 14, text: 'When something feels \'off\' between me and my partner, I trust that feeling — even before I can name exactly what\'s wrong.', inputType: 'likert', subscale: 'utilization' },
  { id: 15, text: 'I use my emotional reactions as signals. They tell me what matters and what needs attention.', inputType: 'likert', subscale: 'utilization' },
  { id: 16, text: 'Strong emotions tend to cloud my judgment rather than help me understand what\'s really going on.', inputType: 'likert', subscale: 'utilization', reverseScored: true },
];

const SUBSCALE_ITEMS: Record<string, number[]> = {
  perception: [0, 1, 2, 3],          // 4 items
  managingOwn: [4, 5, 6],            // 3 items
  managingOthers: [7, 8, 9, 10],     // 4 items
  utilization: [11, 12, 13, 14, 15], // 5 items
};

function scoreSSEIT(responses: (number | string | string[] | null)[]): SSEITScores {
  const nums = responses as number[];
  if (nums.length !== 16) throw new Error('SSEIT requires 16 responses');

  // Apply reverse scoring: score = (6 - response) for reverse items
  const scored = nums.map((r, i) => (REVERSE_ITEMS.has(i) ? 6 - r : r));

  // Calculate subscale scores
  const subscaleScores: Record<string, { sum: number; mean: number; itemCount: number }> = {};
  const subscaleNormalized: Record<string, number> = {};

  for (const [scale, items] of Object.entries(SUBSCALE_ITEMS)) {
    const sum = items.reduce((s, i) => s + scored[i], 0);
    const itemCount = items.length;
    subscaleScores[scale] = {
      sum,
      mean: Math.round((sum / itemCount) * 100) / 100,
      itemCount,
    };
    subscaleNormalized[scale] = Math.round(((sum - itemCount) / (4 * itemCount)) * 100);
  }

  const totalSum = scored.reduce((s, r) => s + r, 0);

  return {
    totalScore: totalSum,
    totalMean: Math.round((totalSum / 16) * 100) / 100,
    totalNormalized: Math.round(((totalSum - 16) / (4 * 16)) * 100),
    subscaleScores,
    subscaleNormalized,
  };
}

export const sseitConfig: AssessmentConfig = {
  type: 'sseit',
  name: 'Emotional Intelligence',
  shortName: 'SSEIT',
  description: 'Explore how you sense, navigate, and use emotions in your relationships.',
  instructions:
    'For each statement, indicate how true it is of you in your relationships. There are no right or wrong answers — just be honest about how you typically experience things.',
  estimatedMinutes: 5,
  totalQuestions: 16,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreSSEIT,
  progressKey: 'sseit_progress',
};
