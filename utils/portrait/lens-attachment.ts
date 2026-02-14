import type {
  ECRRScores,
  AttachmentStyle,
  CompositeScores,
  DetectedPattern,
  AttachmentLens,
} from '@/types';
import { tailorNarrative, buildTailoringContext } from './attachment-tailoring';

/**
 * Lens 1: Attachment & Protection
 * Theoretical foundation: EFT, Attachment Theory, PACT
 */
export function analyzeAttachmentProtection(
  ecrr: ECRRScores,
  composite: CompositeScores,
  patterns: DetectedPattern[]
): AttachmentLens {
  const { attachmentStyle, anxietyScore, avoidanceScore } = ecrr;

  const rawNarrative = buildNarrative(attachmentStyle, anxietyScore, avoidanceScore);
  const ctx = buildTailoringContext(attachmentStyle, anxietyScore, avoidanceScore);
  const narrative = tailorNarrative(rawNarrative, ctx, 'attachment');
  const protectiveStrategy = getProtectiveStrategy(attachmentStyle);
  const triggers = getTriggers(attachmentStyle, anxietyScore, avoidanceScore);
  const areProfile = {
    accessible: composite.accessibility,
    responsive: composite.responsiveness,
    engaged: composite.engagement,
  };

  return { narrative, protectiveStrategy, triggers, areProfile };
}

// ─── Narrative ───────────────────────────────────────────

function buildNarrative(
  style: AttachmentStyle,
  anxiety: number,
  avoidance: number
): string {
  switch (style) {
    case 'secure':
      return (
        'You generally feel comfortable with both closeness and independence. ' +
        'Your nervous system reads relationship as safe enough to be vulnerable ' +
        'and steady enough to trust. This security is a real foundation — ' +
        'it means you can hold space for your partner without losing yourself.'
      );

    case 'anxious-preoccupied': {
      let text =
        'Your heart is oriented toward connection. You notice distance quickly ' +
        'and move toward it — seeking reassurance, wanting to resolve. ' +
        'This sensitivity comes from how much relationships matter to you.';
      if (anxiety > 5.5) {
        text +=
          ' At times, the intensity of this longing can feel overwhelming ' +
          '— both to you and to your partner. Learning to self-soothe while ' +
          'staying connected is your key edge.';
      }
      return text;
    }

    case 'dismissive-avoidant': {
      let text =
        'You value independence and self-reliance. Closeness can feel like ' +
        "pressure, and you're most comfortable when you have space to be " +
        'yourself. This autonomy is genuine — not a defense against caring.';
      if (avoidance > 5.5) {
        text +=
          ' Partners may experience this as emotional distance or unavailability, ' +
          "even when you don't intend it that way. The challenge is staying " +
          'present when vulnerability is requested.';
      }
      return text;
    }

    case 'fearful-avoidant':
      return (
        "You experience a push-and-pull — wanting closeness but also feeling " +
        "cautious about it. This isn't confusion; it's your system trying to " +
        'navigate conflicting needs for connection and safety. You learned that ' +
        'love is both needed and potentially dangerous, so you approach ' +
        'carefully and sometimes retreat when things get too close.'
      );
  }
}

// ─── Protective Strategy ─────────────────────────────────

function getProtectiveStrategy(style: AttachmentStyle): string {
  switch (style) {
    case 'secure':
      return (
        'Direct communication — you can name what you need and trust ' +
        'that your partner can hear it.'
      );
    case 'anxious-preoccupied':
      return (
        'Pursue and seek reassurance — when you sense distance, ' +
        'you move closer to restore connection.'
      );
    case 'dismissive-avoidant':
      return (
        'Withdraw and self-regulate — when emotions rise, ' +
        'you create space to regain equilibrium.'
      );
    case 'fearful-avoidant':
      return (
        'Oscillate between pursuit and withdrawal — approach ' +
        'when lonely, retreat when overwhelmed.'
      );
  }
}

// ─── Triggers ────────────────────────────────────────────

function getTriggers(
  style: AttachmentStyle,
  anxiety: number,
  avoidance: number
): string[] {
  const triggers: string[] = [];

  if (anxiety > 4.0) {
    triggers.push('Partner seeming distant or preoccupied');
    triggers.push('Unclear messages or delayed responses');
    triggers.push('Feeling like a low priority');
  }

  if (avoidance > 4.0) {
    triggers.push('Requests for emotional closeness or vulnerability');
    triggers.push("Partner's emotional intensity");
    triggers.push('Feeling pressured to share feelings');
  }

  if (style === 'fearful-avoidant') {
    triggers.push('Getting too close too fast');
    triggers.push('Conflict that threatens the relationship');
  }

  if (style === 'secure') {
    triggers.push('Sustained disconnection or stonewalling');
    triggers.push('Repeated broken promises');
  }

  return triggers;
}
