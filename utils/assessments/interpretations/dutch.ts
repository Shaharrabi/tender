export interface DUTCHStyleInfo {
  label: string;
  description: string;
  strengths: string;
  watchOut: string;
  growthTip: string;
}

const STYLE_INFO: Record<string, DUTCHStyleInfo> = {
  yielding: {
    label: 'Yielding',
    description:
      'You tend to accommodate your partner\'s needs and prioritize relationship harmony over your own goals. You value peace and often let your partner have their way.',
    strengths:
      'You create a warm, supportive atmosphere and your partner likely feels heard and valued. Your flexibility helps de-escalate tense moments.',
    watchOut:
      'Over time, consistently putting your needs second can lead to resentment or feeling unseen. Your partner may not realize what you\'re sacrificing.',
    growthTip:
      'Practice voicing one need per disagreement — even a small one. Your relationship can hold more honesty than you might think.',
  },
  compromising: {
    label: 'Compromising',
    description:
      'You seek middle ground and believe both partners should give a little to reach agreement. You value fairness and practical solutions.',
    strengths:
      'You\'re effective at finding workable solutions quickly. Your sense of fairness helps both partners feel the outcome is reasonable.',
    watchOut:
      'Compromise can sometimes mean neither person gets what they truly need. Important issues may deserve deeper exploration rather than a quick split.',
    growthTip:
      'For issues that really matter, try pausing before compromising. Ask yourself: "Is splitting the difference enough here, or do we need a deeper conversation?"',
  },
  forcing: {
    label: 'Forcing',
    description:
      'You advocate strongly for your own position and approach conflict with a competitive mindset. You\'re clear about what you want and persistent in pursuing it.',
    strengths:
      'Your directness means your partner always knows where you stand. When decisions need to be made, you step up decisively.',
    watchOut:
      'If your partner feels steamrolled, they may withdraw or avoid bringing up concerns altogether — which can create hidden tensions.',
    growthTip:
      'After stating your position, try asking your partner a genuine question about their perspective. Curiosity alongside conviction creates stronger outcomes.',
  },
  problemSolving: {
    label: 'Problem-Solving',
    description:
      'You seek win-win solutions and approach disagreements as shared challenges to solve together. You\'re collaborative and creative in finding outcomes that work for both of you.',
    strengths:
      'Your approach builds trust and deepens connection. Both partners tend to feel respected and the solutions you find are often more lasting.',
    watchOut:
      'Not every disagreement needs a full collaborative process. Sometimes your partner may just want to feel heard, not problem-solved.',
    growthTip:
      'Check in with your partner at the start: "Do you want us to figure this out together, or do you just need me to listen right now?"',
  },
  avoiding: {
    label: 'Avoiding',
    description:
      'You tend to sidestep or postpone conflict, preferring to withdraw from disagreements rather than engage directly. You value calm and dislike emotional tension.',
    strengths:
      'You can prevent minor issues from escalating and give both partners space to cool down. Some conflicts truly do resolve themselves with time.',
    watchOut:
      'Important issues left unaddressed tend to grow. Your partner may feel shut out or unsure of where you stand, which can erode trust over time.',
    growthTip:
      'Start small: bring up one low-stakes concern this week. Building the muscle for small conversations makes bigger ones feel less overwhelming.',
  },
};

export function getDUTCHInterpretation(style: string): DUTCHStyleInfo {
  return STYLE_INFO[style] || STYLE_INFO.compromising;
}

export function getDUTCHSubscaleLabel(subscale: string): string {
  const labels: Record<string, string> = {
    yielding: 'Yielding',
    compromising: 'Compromising',
    forcing: 'Forcing',
    problemSolving: 'Problem-Solving',
    avoiding: 'Avoiding',
  };
  return labels[subscale] || subscale;
}
