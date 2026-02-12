import { AttachmentStyle } from '@/types';

/**
 * Warm, trauma-informed interpretations for each attachment style.
 * Non-judgmental, growth-oriented language — no style is "bad."
 */

interface StyleInfo {
  label: string;
  interpretation: string;
  growthTip: string;
}

const INTERPRETATIONS: Record<AttachmentStyle, StyleInfo> = {
  secure: {
    label: 'Secure',
    interpretation:
      'Your attachment pattern suggests you feel comfortable with both closeness and independence in your relationship. You tend to communicate your needs clearly and trust that your partner is there for you. This foundation of security allows you to be vulnerable when it matters and to support your partner in return.',
    growthTip:
      'Continue nurturing your relationship by practicing intentional moments of deeper vulnerability — sharing fears or dreams you might usually keep to yourself.',
  },
  'anxious-preoccupied': {
    label: 'Anxious-Preoccupied',
    interpretation:
      'Your pattern suggests you deeply value closeness and connection, and you may sometimes worry about whether your partner feels the same way. This sensitivity to your relationship often comes from a place of caring deeply. Your attentiveness to your partner\'s feelings is a real strength — and learning to trust that connection can help it feel even more secure.',
    growthTip:
      'When you notice the urge to seek reassurance, try pausing and grounding yourself first. Remind yourself of concrete evidence that your partner cares — a kind text, a recent moment of connection.',
  },
  'dismissive-avoidant': {
    label: 'Dismissive-Avoidant',
    interpretation:
      'Your pattern suggests you value independence and self-reliance in relationships. You may feel most comfortable when you have space to be yourself. This autonomy is a genuine strength — and it doesn\'t mean you don\'t care. Sometimes, the most growth comes from leaning into closeness, even when it feels unfamiliar.',
    growthTip:
      'Try sharing one small, personal thought or feeling with your partner this week — something you\'d normally keep to yourself. Small steps toward openness can build trust without feeling overwhelming.',
  },
  'fearful-avoidant': {
    label: 'Fearful-Avoidant',
    interpretation:
      'Your pattern suggests you experience a push-and-pull in relationships — wanting closeness but also feeling cautious about it. This is a very human response, often rooted in past experiences. Your awareness of these conflicting feelings is actually a powerful first step toward understanding yourself more deeply in relationships.',
    growthTip:
      'Practice self-compassion when you notice conflicting feelings about closeness. It can help to name what you\'re feeling out loud: "I want to be close, and I also feel nervous." Acknowledging both sides reduces their power.',
  },
};

export function getInterpretation(style: AttachmentStyle): StyleInfo {
  return INTERPRETATIONS[style];
}
