/**
 * Radical Acceptance (DBT Distress Tolerance)
 *
 * A foundational DBT distress tolerance skill that teaches
 * the difference between acceptance and approval. Radical
 * acceptance means acknowledging reality as it is — without
 * fighting it — so that suffering can begin to soften.
 */

import type { Intervention } from '@/types/intervention';

export const radicalAcceptance: Intervention = {
  id: 'radical-acceptance',
  title: 'Radical Acceptance',
  description:
    'When you are caught in a loop of fighting reality — replaying what should have been, resenting what is — this DBT skill helps you practice accepting what you cannot change. Acceptance is not approval. It is the doorway out of suffering.',
  fieldInsight: 'Accepting what is here \u2014 without needing it to change \u2014 opens space for what comes next.',
  category: 'regulation',
  duration: 8,
  difficulty: 'intermediate',
  mode: 'solo',
  forStates: ['ACTIVATED', 'SHUTDOWN', 'MIXED'],
  forPatterns: [
    'rumination',
    'resentment',
    'stuck_patterns',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'Acceptance Is Not Approval',
      content:
        'Radical acceptance is one of the hardest — and most freeing — skills in DBT. It means fully acknowledging reality as it is, right now, without trying to change it, fight it, or pretend it is different.\n\nThis does not mean you approve of what happened. It does not mean you are giving up. It means you are choosing to stop pouring your energy into a war with what already is.\n\nPain is inevitable. Suffering is pain plus non-acceptance. When we radically accept, we let go of the "it shouldn\'t be this way" and open a door to "given that it is this way, what now?"',
    },
    {
      type: 'prompt',
      title: 'What Are You Fighting?',
      content:
        'Think about something in your relationship or life that you have been struggling against — a reality that you keep wishing were different. It might be something your partner did, a pattern that keeps repeating, or a loss that has not been grieved.\n\nWhat is the reality you have been refusing to accept?',
      promptPlaceholder: 'The reality I have been fighting is...',
    },
    {
      type: 'prompt',
      title: 'Imagine Accepting It',
      content:
        'For a moment, imagine that you fully accepted this reality — not approved of it, not liked it, but simply stopped fighting it. What would change? How would your body feel? What would you do differently tomorrow?\n\nLet yourself explore this honestly, even if it feels uncomfortable.',
      promptPlaceholder: 'If I accepted this, what would change is...',
    },
    {
      type: 'timer',
      title: 'Body Scan for Resistance',
      content:
        'Close your eyes and scan your body from head to toe. Notice where you are holding resistance — tight jaw, clenched fists, a knot in your stomach, tension in your chest. These are the places where non-acceptance lives in your body.\n\nWith each exhale, see if you can soften just slightly into those areas. You are not forcing anything. You are simply inviting your body to release what it has been gripping.',
      duration: 90,
    },
    {
      type: 'reflection',
      title: 'Willingness to Accept',
      content:
        'Radical acceptance is not a one-time event — it is a practice you return to again and again. On a scale from 0 to 10, how willing are you right now to practice acceptance of this reality? What would help you move one point closer?',
      promptPlaceholder: 'My willingness right now is... and what would help is...',
    },
  ],
};
