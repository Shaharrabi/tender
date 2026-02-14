export interface DUTCHStyleInfo {
  label: string;
  warmLabel: string;
  description: string;
  strengths: string;
  fieldInsight: string;
  watchOut: string;
  growthTip: string;
  bodyPrompt: string;
}

const STYLE_INFO: Record<string, DUTCHStyleInfo> = {
  yielding: {
    label: 'Yielding',
    warmLabel: 'The Peacekeeper',
    description:
      'You learned to keep the space between you and your partner safe by making yourself smaller — by giving in, by saying "it\'s fine," by letting your needs fade into the background. This is not weakness. This is a protective pattern that once made sense: at some point, you learned that your needs caused friction, and friction felt dangerous. So you became the one who smooths things over.\n\nThe warmth you bring to conflict is real. Your capacity to de-escalate, to create safety, to put your partner\'s needs first — these are genuine relational gifts. The pattern to notice is the cost: the slow accumulation of unspoken needs, the quiet resentment that builds when you keep choosing peace over truth.',
    strengths:
      'You create safety in the relational field. Your partner likely feels held, heard, and valued during disagreements — because you make space for their experience, often at the expense of your own.',
    fieldInsight:
      'The space between you and your partner may feel calm on the surface, but notice whether it\'s the calm of genuine peace or the calm of one person disappearing. A living field needs both voices.',
    watchOut:
      'When you consistently silence your own needs, the field between you becomes lopsided. Your partner is relating to a version of you that is editing itself in real time. Over time, they may sense something is missing without knowing what.',
    growthTip:
      'This week, practice voicing one small need during a disagreement — not as a confrontation, but as information: "Here\'s what\'s true for me right now." Notice what happens in the space between you when both voices are present.',
    bodyPrompt:
      'When you feel the urge to yield, where does it start in your body? A tightening in the throat? A sinking in the chest? That sensation is your truth asking to be spoken.',
  },
  compromising: {
    label: 'Compromising',
    warmLabel: 'The Balancer',
    description:
      'You navigate conflict by seeking the middle ground — the place where both partners give a little and get a little. This pattern reflects a deep commitment to fairness and a belief that relationships work best when no one wins too much or loses too much.\n\nYour sense of equity is a genuine strength. You keep the relational field balanced, and your partner likely trusts that you will be fair. The pattern to notice is whether the middle ground is always the right ground — some things matter too much to split the difference. Some conversations need depth, not compromise.',
    strengths:
      'You maintain equilibrium in the relational field. Your fairness builds trust, and your ability to find workable solutions quickly means disagreements rarely escalate into full ruptures.',
    fieldInsight:
      'The space between you and your partner tends to feel even-keeled. Notice whether that balance comes from both partners being fully expressed, or from both partners holding back equally.',
    watchOut:
      'Compromise can become a way to avoid the deeper conversation. When both partners give a little, neither may get what they actually need. Important needs are not meant to be halved — they are meant to be held.',
    growthTip:
      'Before your next compromise, pause and ask yourself: "Is splitting the difference enough here, or does this need a deeper conversation?" Sometimes the relational field is asking for more than a middle ground.',
    bodyPrompt:
      'When you move toward compromise, notice: does your body feel settled, or does it feel like you\'re managing? A settled body means the middle ground is genuine. A managing body means something still needs to be said.',
  },
  forcing: {
    label: 'Forcing',
    warmLabel: 'The Protector',
    description:
      'You learned to keep yourself safe in conflict by holding your ground fiercely — by being clear, direct, and unwavering about what you need. This is not aggression. This is a protective pattern: at some point, you learned that if you did not advocate strongly for yourself, your needs would not be met.\n\nYour directness is a real strength. Your partner always knows where you stand, and when decisions need to be made, you step forward decisively. The pattern to notice is what happens to the space between you when your conviction takes up all the room — your partner may stop bringing their truth forward, and the field between you narrows.',
    strengths:
      'You bring clarity and conviction to the relational field. In moments of uncertainty, your decisiveness provides structure. Your partner never has to guess where you stand.',
    fieldInsight:
      'The space between you and your partner may feel charged during conflict — alive with your energy, but sometimes too intense for your partner to enter. Notice whether the field has room for two voices, or only one.',
    watchOut:
      'If your partner feels overwhelmed by your intensity, they may withdraw — not because they do not care, but because there is no room for them in the conversation. The field contracts when only one voice fills it.',
    growthTip:
      'After stating your position clearly, try something counterintuitive: ask a genuine question about your partner\'s experience. Not to change your mind, but to widen the field. "I\'ve said what\'s true for me — what\'s true for you?"',
    bodyPrompt:
      'When conflict activates your protective stance, where does the energy gather? Jaw? Fists? Chest? That is your system mobilizing. Can you feel the strength AND make room for curiosity?',
  },
  problemSolving: {
    label: 'Problem-Solving',
    warmLabel: 'The Builder',
    description:
      'You approach conflict as a shared puzzle — something to be solved together, not won or lost. This pattern reflects a deep trust in collaboration and a belief that with enough goodwill and creativity, both partners can get what they need.\n\nYour collaborative instinct is a genuine relational gift. You create win-win outcomes, and your partner likely feels respected and included in the process. The pattern to notice is that not every moment of tension is a problem to be solved. Sometimes the space between you is asking to be felt, not fixed.',
    strengths:
      'You build trust in the relational field through genuine collaboration. Your partner knows that you are working WITH them, not against them. The solutions you create together tend to be durable because both voices shaped them.',
    fieldInsight:
      'The space between you and your partner tends to feel productive and respectful during disagreements. Notice whether that productivity sometimes comes at the expense of deeper emotional contact — solving before feeling.',
    watchOut:
      'The urge to problem-solve can sometimes bypass the emotional layer underneath the disagreement. Your partner may need to feel heard before they are ready to brainstorm — and "let\'s figure this out" can inadvertently communicate "let\'s move past the feelings."',
    growthTip:
      'Before your next collaborative session, try starting with: "Do you want us to figure this out together, or do you just need me to be here with you right now?" Sometimes presence is the solution.',
    bodyPrompt:
      'When a problem appears between you, notice what happens in your body. Does your mind immediately engage? Do you feel an urgency to fix? What happens if you pause the problem-solving and just breathe with your partner for a moment?',
  },
  avoiding: {
    label: 'Avoiding',
    warmLabel: 'The Protector of Calm',
    description:
      'You learned to protect yourself — and the relationship — by stepping back from conflict, by choosing silence over confrontation, by waiting for the storm to pass. This is not cowardice or indifference. This is a protective pattern: at some point, you learned that engaging with conflict made things worse, not better. Withdrawal felt like the safest option.\n\nYour capacity to create space, to not escalate, to give both partners room to breathe — these are real strengths. The pattern to notice is the cost of what goes unspoken: the issues that accumulate, the distance that grows when important conversations never happen, the way your partner may feel shut out of your inner world.',
    strengths:
      'You prevent unnecessary escalation and give the relational field room to breathe. Some conflicts genuinely do resolve themselves with time and space. Your calm is a stabilizing force.',
    fieldInsight:
      'The space between you and your partner may go quiet during tension — not because nothing is happening, but because you are holding everything inside. Notice whether the quiet is peaceful or frozen. A peaceful quiet has warmth in it. A frozen quiet has distance.',
    watchOut:
      'When important things go unspoken, the field between you slowly cools. Your partner may feel uncertain of where they stand, unsure of what you need, or disconnected from your inner world. Avoidance protects in the moment but creates distance over time.',
    growthTip:
      'Start small: bring up one low-stakes concern this week. Not a confrontation — just an observation: "I noticed something I want to share with you." Building the muscle for small conversations makes bigger ones feel less overwhelming.',
    bodyPrompt:
      'When conflict approaches, where does the withdrawal impulse start? A numbing? A pulling inward? A desire to leave the room? That is your protective system activating. You can notice it without obeying it.',
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

export function getDUTCHSubscaleWarmLabel(subscale: string): string {
  const labels: Record<string, string> = {
    yielding: 'The Peacekeeper',
    compromising: 'The Balancer',
    forcing: 'The Protector',
    problemSolving: 'The Builder',
    avoiding: 'The Protector of Calm',
  };
  return labels[subscale] || subscale;
}
