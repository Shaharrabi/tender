import { VALUE_DOMAINS } from '@/utils/assessments/configs/values';

export function getGapLabel(gap: number): string {
  if (gap <= 1) return 'Living it fully';
  if (gap <= 3) return 'Gentle stretch';
  if (gap <= 5) return 'Calling you forward';
  return 'Deep invitation';
}

export function getGapColor(gap: number): string {
  if (gap <= 1) return '#10B981';
  if (gap <= 3) return '#F59E0B';
  if (gap <= 5) return '#EF4444';
  return '#DC2626';
}

export function getGapDescription(gap: number): string {
  if (gap <= 1) {
    return 'This value is alive in your daily life. You are not just believing in it — you are living it. This alignment between what matters and how you act is one of the most powerful sources of relational well-being.';
  }
  if (gap <= 3) {
    return 'There is a gentle stretch here — a small gap between what you care about and how fully you are living it. This is not a failure. It is an invitation. Something in your life is quietly asking for a little more of your attention.';
  }
  if (gap <= 5) {
    return 'This value matters deeply to you, but your life is not yet reflecting it the way you wish it would. The gap between what you value and how you live creates a kind of quiet ache — not dramatic, but persistent. This gap is calling you forward.';
  }
  return 'There is a significant distance between what matters most to you and how you are currently living. This kind of gap is often painful — it touches something central to who you are and who you want to be. But it is also profoundly meaningful: the pain itself is evidence of how much this value matters.';
}

export function getAvoidanceLabel(score: number): string {
  if (score <= 0.12) return 'Open and engaged';
  if (score <= 0.25) return 'Gentle avoidance';
  if (score <= 0.37) return 'Protective distance';
  if (score <= 0.50) return 'Active avoidance';
  return 'Strong protective wall';
}

export function getAvoidanceDescription(score: number): string {
  if (score <= 0.12) {
    return 'You are facing this value directly — no walls, no distance. You are willing to feel the discomfort of the gap without turning away from it. This openness is a relational strength.';
  }
  if (score <= 0.25) {
    return 'There is a slight tendency to step back from this value when it gets uncomfortable. You know it matters, but leaning into it fully feels risky or hard. That gentle avoidance is protective — and understandable.';
  }
  if (score <= 0.37) {
    return 'You are keeping some distance from fully engaging with this value. This may look like staying busy, intellectualizing, or telling yourself "it is fine." The distance is not random — it protects you from something that feels vulnerable.';
  }
  if (score <= 0.50) {
    return 'You are actively stepping away from this value — not because it does not matter, but because engaging with it feels too exposed, too risky, or too painful. The avoidance itself is information: whatever is being avoided carries weight.';
  }
  return 'There is a significant protective wall between you and this value. Something about fully living this value feels dangerous to your system. Understanding what that danger is — what the wall is protecting you from — is the first step toward lowering it.';
}

export function getDomainLabel(domainId: string): string {
  const domain = VALUE_DOMAINS.find((d) => d.id === domainId);
  return domain?.label || domainId;
}

export function getDomainFieldInsight(domainId: string): string {
  const insights: Record<string, string> = {
    intimacy: 'This value speaks to the depth of the relational field — how close you allow the space between you and your partner to become.',
    honesty: 'This value speaks to the clarity of the relational field — whether the truth can live openly in the space between you.',
    growth: 'This value speaks to the aliveness of the relational field — whether the space between you is evolving or stagnant.',
    security: 'This value speaks to the safety of the relational field — whether the ground beneath your relationship feels solid enough to stand on.',
    adventure: 'This value speaks to the vitality of the relational field — whether the space between you has room for surprise and discovery.',
    independence: 'This value speaks to differentiation within the relational field — your capacity to be fully yourself while fully in the relationship.',
    family: 'This value speaks to the legacy of the relational field — what you and your partner are building that extends beyond the two of you.',
    service: 'This value speaks to the purpose of the relational field — how your relationship connects to something larger than itself.',
    playfulness: 'This value speaks to the lightness of the relational field — whether joy and laughter have space to exist alongside depth and seriousness.',
    spirituality: 'This value speaks to the mystery of the relational field — your openness to what cannot be explained or controlled in the space between you.',
  };
  return insights[domainId] || '';
}

/** Overall values profile interpretation based on gap patterns */
export function getValuesProfileInsight(avgGap: number, topGapDomains: string[]): string {
  if (avgGap <= 1.5) {
    return 'Your values and your life are in remarkable alignment. You are living what you believe in — and that congruence creates a relational foundation your partner can feel. Keep doing what you are doing.';
  }
  if (avgGap <= 3) {
    return 'You have a solid foundation of values-aligned living, with a few areas where life has drifted from what matters most. These gaps are not failures — they are invitations. Each one is pointing you toward something that wants more of your attention.';
  }
  if (avgGap <= 5) {
    return 'There are meaningful gaps between what you value and how you are currently living. These gaps create a subtle but persistent tension — a feeling that something important is not being honored. The good news: naming the gap is the first step toward closing it. And you have just named it.';
  }
  return 'Your values and your daily life are significantly out of alignment. This kind of gap often creates deep frustration, restlessness, or a sense of living someone else\'s life. The distance is painful — but the pain is pointing you toward what matters most. This is where your growth begins.';
}
