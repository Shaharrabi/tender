export interface DSIRLevelInfo {
  level: string;
  description: string;
}

export function getDSIRLevel(normalized: number): DSIRLevelInfo {
  if (normalized >= 76) {
    return {
      level: 'High Differentiation',
      description:
        'You demonstrate a strong sense of self while remaining emotionally connected to others. You can think clearly under stress and maintain your positions without being reactive.',
    };
  }
  if (normalized >= 61) {
    return {
      level: 'Above Average',
      description:
        'You generally maintain a good balance between autonomy and connection. You can manage most emotional situations without losing your sense of self.',
    };
  }
  if (normalized >= 41) {
    return {
      level: 'Average',
      description:
        'Your differentiation is in the typical range. You sometimes struggle with emotional reactivity or maintaining your position under pressure, but manage reasonably well overall.',
    };
  }
  if (normalized >= 26) {
    return {
      level: 'Below Average',
      description:
        'You may find it challenging to maintain your sense of self in close relationships. Emotional reactivity or difficulty setting boundaries may affect your relationship dynamics.',
    };
  }
  return {
    level: 'Low Differentiation',
    description:
      'Maintaining a separate sense of self in relationships is a significant challenge. You may frequently feel overwhelmed by emotions or lose yourself in others\' needs. Building differentiation is possible with awareness and practice.',
  };
}

export function getDSIRSubscaleLabel(subscale: string): string {
  const labels: Record<string, string> = {
    emotionalReactivity: 'Emotional Reactivity',
    iPosition: 'I-Position',
    emotionalCutoff: 'Emotional Cutoff',
    fusionWithOthers: 'Fusion with Others',
  };
  return labels[subscale] || subscale;
}

export function getDSIRSubscaleDescription(subscale: string): string {
  const descriptions: Record<string, string> = {
    emotionalReactivity:
      'How much emotional flooding or reactivity you experience in response to others. Higher scores mean less reactivity (more differentiated).',
    iPosition:
      'Your ability to maintain a clear sense of self and state your beliefs independently, even under pressure. Higher scores mean a stronger I-position.',
    emotionalCutoff:
      'The degree to which you manage anxiety by creating emotional distance from others. Higher scores mean less reliance on cutoff (more differentiated).',
    fusionWithOthers:
      'How much you tend to lose your sense of self in close relationships. Higher scores mean less fusion (more differentiated).',
  };
  return descriptions[subscale] || '';
}
