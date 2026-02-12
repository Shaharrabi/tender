export interface SSEITLevelInfo {
  level: string;
  description: string;
}

export function getSSEITLevel(normalized: number): SSEITLevelInfo {
  if (normalized >= 91) {
    return {
      level: 'High',
      description:
        'You demonstrate strong emotional intelligence across areas. You likely read emotions well, regulate your own moods effectively, and navigate social situations with skill.',
    };
  }
  if (normalized >= 76) {
    return {
      level: 'Above Average',
      description:
        'You show solid emotional awareness and management. You generally handle emotional situations well and are attuned to others\' feelings.',
    };
  }
  if (normalized >= 61) {
    return {
      level: 'Average',
      description:
        'Your emotional intelligence is in the typical range. You have a reasonable awareness of emotions and can manage them in most situations.',
    };
  }
  if (normalized >= 41) {
    return {
      level: 'Below Average',
      description:
        'There may be areas of emotional awareness or management that could benefit from attention. Building these skills can significantly improve your relationships.',
    };
  }
  return {
    level: 'Low',
    description:
      'Emotional awareness and management may be challenging areas for you. The good news is that emotional intelligence can be developed with practice and intention.',
  };
}

export function getSSEITSubscaleLabel(subscale: string): string {
  const labels: Record<string, string> = {
    perception: 'Perception of Emotion',
    managingOwn: 'Managing Own Emotions',
    managingOthers: 'Managing Others\' Emotions',
    utilization: 'Utilization of Emotion',
  };
  return labels[subscale] || subscale;
}

export function getSSEITSubscaleDescription(subscale: string): string {
  const descriptions: Record<string, string> = {
    perception:
      'Your ability to recognize and identify emotions in yourself and others, including reading non-verbal cues and body language.',
    managingOwn:
      'How effectively you regulate and manage your own emotional states, including maintaining positive moods and controlling negative ones.',
    managingOthers:
      'Your skill at influencing others\' emotional states positively — comforting, motivating, and creating enjoyable experiences.',
    utilization:
      'How well you channel emotions to facilitate thinking, problem-solving, creativity, and motivation.',
  };
  return descriptions[subscale] || '';
}
