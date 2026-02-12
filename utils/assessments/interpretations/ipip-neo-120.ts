export function getIPIPPercentileLabel(percentile: number): string {
  if (percentile >= 91) return 'Very High';
  if (percentile >= 76) return 'High';
  if (percentile >= 61) return 'Above Average';
  if (percentile >= 41) return 'Average';
  if (percentile >= 26) return 'Below Average';
  if (percentile >= 11) return 'Low';
  return 'Very Low';
}

export function getIPIPDomainDescription(domain: string, percentile: number): string {
  const isHigh = percentile >= 61;
  const descriptions: Record<string, [string, string]> = {
    neuroticism: [
      'You tend to be emotionally stable, calm, and resilient. You handle stress well and are not easily upset.',
      'You tend to experience negative emotions more intensely and may be sensitive to stress. Your emotional depth, however, can also fuel empathy and awareness.',
    ],
    extraversion: [
      'You tend to be more reserved and independent. You draw energy from solitude and prefer deeper one-on-one connections.',
      'You tend to be sociable, energetic, and outgoing. You draw energy from social interactions and enjoy being around others.',
    ],
    openness: [
      'You tend to be practical, grounded, and prefer routine. You value proven approaches and concrete thinking.',
      'You tend to be curious, creative, and open to new experiences. You enjoy exploring ideas and are drawn to novelty.',
    ],
    agreeableness: [
      'You tend to be direct, competitive, and skeptical. You prioritize your own interests and value straightforwardness.',
      'You tend to be cooperative, trusting, and helpful. You prioritize harmony and care about others\' well-being.',
    ],
    conscientiousness: [
      'You tend to be flexible and spontaneous. You prefer to keep your options open and are relaxed about standards.',
      'You tend to be organized, disciplined, and goal-oriented. You follow through on commitments and value structure.',
    ],
  };
  const [low, high] = descriptions[domain] || ['', ''];
  return isHigh ? high : low;
}
