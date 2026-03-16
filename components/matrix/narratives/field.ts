/**
 * Field Narrative — "The space between"
 * Instruments: RFAS + WEARE (couple only)
 *
 * Per Addendum 1: In individual mode, shows RFAS data only.
 * Full WEARE data shows only in couple mode.
 */

import type { DomainNarrative } from '../MatrixDomain';

interface FieldInput {
  // RFAS (individual)
  rfasTotalMean?: number;         // 1-7
  fieldRecognition?: number;      // 1-7
  creativeTension?: number;       // 1-7
  presenceAttunement?: number;    // 1-7
  emergentOrientation?: number;   // 1-7
  // WEARE (couple only)
  resonance?: number;             // 0-100
  emergenceDirection?: number;    // -9 to +9
  bottleneck?: string | null;
  movementPhase?: string;
}

export function generateFieldNarrative(input: FieldInput): DomainNarrative {
  const {
    rfasTotalMean, fieldRecognition, creativeTension,
    presenceAttunement, resonance, emergenceDirection, bottleneck,
  } = input;

  // If we have WEARE data (couple mode)
  if (resonance != null && emergenceDirection != null) {
    let body: string;
    let insight: string;

    if (resonance >= 70 && emergenceDirection > 3) {
      body = `The field between you is alive and growing. Resonance at ${Math.round(resonance)} means you're tuned in. Direction at ${emergenceDirection > 0 ? '+' : ''}${emergenceDirection.toFixed(1)} means you're moving forward together. This is the relational equivalent of a tailwind.`;
      insight = `Don't take this for granted. Fields this alive need tending, not autopilot.`;
    } else if (resonance < 40) {
      body = `The space between you needs attention. Resonance at ${Math.round(resonance)} suggests disconnection \u2014 not necessarily conflict, but a field that's gone quiet. ${bottleneck ? `The bottleneck: ${bottleneck}.` : ''}`;
      insight = `A quiet field isn't a dead field. It's waiting for someone to make the first move toward presence.`;
    } else {
      body = `Your relational field is in motion. Resonance at ${Math.round(resonance)}, direction at ${emergenceDirection > 0 ? '+' : ''}${emergenceDirection.toFixed(1)}. ${bottleneck ? `Current bottleneck: ${bottleneck}.` : 'No clear bottleneck \u2014 the field is finding its rhythm.'}`;
      insight = `The field reflects what both of you bring to it. It's not one person's job to fix \u2014 it's both of yours to tend.`;
    }

    return { title: 'Your relational field', body, insight, instruments: ['WEARE', 'RFAS'] };
  }

  // Individual mode — RFAS only
  if (rfasTotalMean != null) {
    const highAwareness = rfasTotalMean >= 5.0;
    const lowAwareness = rfasTotalMean < 3.5;

    let body: string;
    let insight: string;

    if (highAwareness) {
      body = `You have a strong sense of the relational field \u2014 the invisible space between you and your partner where connection lives (field awareness: ${rfasTotalMean.toFixed(1)}/7). You sense shifts, notice tension, and can often feel what's happening before words arrive.`;
      insight = `Field awareness is the foundation of attunement. Your next step: using what you sense with intention rather than reactivity.`;
    } else if (lowAwareness) {
      body = `The relational field \u2014 the invisible space between you and your partner \u2014 is harder for you to sense (field awareness: ${rfasTotalMean.toFixed(1)}/7). This doesn't mean you don't care. It means the signals need to be stronger before you register them.`;
      insight = `Building field awareness starts with one practice: pause before responding and ask "what's happening between us right now?"`;
    } else {
      body = `Your field awareness sits at ${rfasTotalMean.toFixed(1)}/7 \u2014 moderate range. You sense the relational field sometimes, especially during high-intensity moments, but may miss the subtle shifts during everyday interaction.`;
      insight = `The field is always sending signals. Tuning in more consistently \u2014 not just during crisis \u2014 is where the growth lives.`;
    }

    return { title: 'Your field awareness', body, insight, instruments: ['RFAS'] };
  }

  // No field data at all
  return {
    title: 'Your field awareness',
    body: 'Complete the Relational Field assessment to see how you sense the invisible space between you and your partner.',
    insight: '',
    instruments: [],
  };
}
