export interface SSEITLevelInfo {
  level: string;
  warmLabel: string;
  description: string;
  fieldInsight: string;
  growthEdge: string;
  bodyPrompt: string;
}

export function getSSEITLevel(normalized: number): SSEITLevelInfo {
  if (normalized >= 91) {
    return {
      level: 'High',
      warmLabel: 'Deep Attunement',
      description:
        'You have a rare capacity to sense what is alive in the relational field — the unspoken currents, the shifts in mood, the emotional undertow beneath the words. You read your own emotions clearly, you read your partner\'s emotions with accuracy, and you can navigate emotional complexity without losing your footing.\n\nThis is not just intelligence — it is a relational instrument. You are attuned to the space between you and your partner in a way that most people never develop. The invitation is to use this attunement not just for reading the field, but for co-creating it — for shaping the emotional quality of your connection with intention and care.',
      fieldInsight:
        'You sense what is moving in the relational field with precision. Your growth edge is not sensing more — it is choosing how to respond to what you sense with wisdom rather than reactivity.',
      growthEdge:
        'Moving from attunement to co-regulation — using your emotional awareness not just to understand what is happening between you, but to actively shape the warmth and safety of the space.',
      bodyPrompt:
        'When you sense a shift in the relational field, where does that information arrive first in your body? That location is your attunement center. Learn to trust it.',
    };
  }
  if (normalized >= 76) {
    return {
      level: 'Above Average',
      warmLabel: 'Growing Sensitivity',
      description:
        'You have a solid emotional awareness — you generally know what you feel, you can read others with reasonable accuracy, and you manage emotional situations without being overwhelmed. The space between you and your partner is one you can navigate with some skill.\n\nYour emotional intelligence gives you a genuine advantage in your relationship: you can sense when things shift, and you have the capacity to respond rather than just react. The growing edge is in the subtle moments — the micro-shifts in the field that are easy to miss when you are focused on the bigger picture.',
      fieldInsight:
        'You read the relational field well in clear conditions. Under stress, some of that sensitivity narrows. The practice is maintaining your emotional antennae even when the field is charged.',
      growthEdge:
        'Developing consistency — staying emotionally attuned even when your own system is activated. The moments when you lose your read are the moments that matter most.',
      bodyPrompt:
        'Notice the difference between calm attunement and stressed attunement. Where does your emotional reading happen when things are easy? Where does it go when things get hard?',
    };
  }
  if (normalized >= 61) {
    return {
      level: 'Average',
      warmLabel: 'Finding Your Frequency',
      description:
        'Your emotional awareness is in the typical range — you can identify your feelings and respond to others\' emotions in most situations, but the subtler currents in the relational field may slip past your awareness. This is not a limitation — it is a starting point.\n\nThe space between you and your partner carries information that you may not be fully picking up yet. Emotional intelligence is not a fixed trait — it is a capacity that deepens with practice. Every time you pause to notice "what is happening between us right now," you are building that capacity.',
      fieldInsight:
        'You are beginning to tune into the relational field. The information is there — your system is learning to receive it. Like any skill, it strengthens with practice and attention.',
      growthEdge:
        'Building the habit of pausing before reacting — creating a gap between feeling and response where wisdom can enter. This gap is where emotional intelligence lives.',
      bodyPrompt:
        'Start with the basics: before your next conversation with your partner, take three breaths and ask yourself, "What am I feeling right now?" That simple question is the beginning of everything.',
    };
  }
  if (normalized >= 41) {
    return {
      level: 'Below Average',
      warmLabel: 'Awakening Awareness',
      description:
        'There are parts of the emotional landscape — your own and your partner\'s — that may feel unclear, confusing, or difficult to navigate. This is not a personal failing. Emotional awareness is learned, and many people never had the environment that teaches it. You may have grown up in a context where emotions were not named, not welcome, or not safe.\n\nThe relational field between you and your partner is always communicating. Right now, some of those signals may be harder for you to pick up. That is okay. This is learnable, and building even a small amount of emotional fluency can transform your relationship in ways that will surprise you.',
      fieldInsight:
        'The relational field sends signals that your system may not yet be equipped to fully receive. This is not about capacity — it is about practice. Every moment of emotional noticing builds the channel.',
      growthEdge:
        'Start with self-awareness: noticing your own emotional state before trying to read your partner\'s. Name what you feel. That act of naming is the foundation everything else is built on.',
      bodyPrompt:
        'Emotions live in the body before they reach the mind. Start checking in: right now, what does your chest feel like? Your stomach? Your shoulders? Those sensations are emotional information.',
    };
  }
  return {
    level: 'Low',
    warmLabel: 'Uncharted Territory',
    description:
      'The emotional landscape may feel like unfamiliar territory — hard to read, hard to navigate, sometimes overwhelming in its confusion. This is not a flaw. This is what happens when the environment that was supposed to teach you about emotions did not do its job.\n\nHere is what matters: emotional intelligence is one of the most learnable skills there is. It is not something you either have or do not have — it is something that grows with practice. The relational field between you and your partner is waiting for you to learn its language. And the fact that you are here, taking this assessment, means something in you already knows it matters.',
    fieldInsight:
      'The relational field between you and your partner is communicating constantly — through tone, through silence, through the quality of presence. You are at the beginning of learning to listen to it. That beginning is powerful.',
    growthEdge:
      'One word at a time. Literally. Start naming emotions — yours, your partner\'s, the ones you see in movies or songs. Build a vocabulary. The more words you have for what you feel, the more you can do with it.',
    bodyPrompt:
      'Place your hand on your chest right now. What do you feel? Warm? Tight? Numb? Fluttery? Whatever it is, that is your starting point. You do not need to understand it yet. You just need to notice it.',
  };
}

export function getSSEITSubscaleLabel(subscale: string): string {
  const labels: Record<string, string> = {
    perception: 'Sensing What\'s Alive',
    managingOwn: 'Holding Your Own Weather',
    managingOthers: 'Co-Regulating the Field',
    utilization: 'Channeling Emotion into Wisdom',
  };
  return labels[subscale] || subscale;
}

export function getSSEITSubscaleDescription(subscale: string): string {
  const descriptions: Record<string, string> = {
    perception:
      'Your ability to sense what is moving beneath the surface — in yourself and in the space between you and your partner. This includes reading facial expressions, body language, and the emotional undertow that words do not capture.',
    managingOwn:
      'How you hold your own emotional weather — your capacity to stay present with difficult feelings without being swept away, and to return to balance after emotional activation.',
    managingOthers:
      'Your skill at co-regulating the relational field — comforting your partner, creating warmth, and shaping the emotional atmosphere between you with care and intention.',
    utilization:
      'How you channel emotion into wisdom — using what you feel as fuel for insight, creativity, and deeper understanding of yourself and your relationship.',
  };
  return descriptions[subscale] || '';
}
