/**
 * Reassurance Menu (EFT / Secure Attachment)
 *
 * Partners co-create a menu of reassurance gestures organized
 * by "course" — small appetizers, main course reassurance,
 * and dessert (repair/fun). Based on EFT's emphasis on
 * creating accessible, responsive, and engaged (A.R.E.)
 * connection.
 */

import type { Intervention } from '@/types/intervention';

export const reassuranceMenu: Intervention = {
  id: 'reassurance-menu',
  title: 'The Reassurance Menu',
  description:
    'Build a shared menu of reassurance gestures — from small daily touches to major repair rituals. When you know exactly what settles your partner\'s nervous system, you can offer it before they have to ask.',
  fieldInsight:
    'Knowing what calms your partner — and offering it without being asked — is secure attachment in action.',
  category: 'attachment',
  duration: 10,
  difficulty: 'beginner',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'insecure_attachment',
    'reassurance_seeking',
    'emotional_distance',
    'unmet_needs',
  ],
  steps: [
    // ─── Step 1: Context ────────────────────────────────
    {
      type: 'instruction',
      title: 'Your Reassurance Menu',
      content:
        'Secure attachment isn\'t a personality trait — it\'s a set of behaviors. Sue Johnson\'s EFT research shows that feeling safe in a relationship comes down to three questions:\n\n• Are you accessible? (Can I reach you?)\n• Are you responsive? (Do you respond when I need you?)\n• Are you engaged? (Do I know I matter to you?)\n\nThis exercise helps you build a concrete menu of gestures that answer "yes" to all three. Think of it like a restaurant menu — appetizers (small daily gestures), main courses (big reassurance), and desserts (repair and fun).',
    },

    // ─── Step 2: Appetizers checklist ───────────────────
    {
      type: 'checklist',
      title: 'Appetizers: Small Daily Gestures',
      content:
        'Check the small gestures that would make YOU feel reassured on a daily basis:',
      interactiveConfig: {
        kind: 'checklist',
        items: [
          { id: 'morning-text', text: 'A good morning text', subtext: 'Even just "thinking of you"' },
          { id: 'hug', text: 'A real hug (10+ seconds)', subtext: 'Long enough to feel each other breathe' },
          { id: 'eye-contact', text: 'Eye contact when talking', subtext: 'Phone down, face up' },
          { id: 'touch', text: 'A hand on the back or shoulder', subtext: 'Physical presence without words' },
          { id: 'ask', text: '"How are you really?"', subtext: 'Said with genuine curiosity' },
          { id: 'name', text: 'Using a pet name or term of endearment', subtext: 'The private language of your couple' },
          { id: 'listen', text: 'Listening without fixing', subtext: 'Just being present with what is' },
        ],
        minRequired: 2,
      },
    },

    // ─── Step 3: Main courses checklist ─────────────────
    {
      type: 'checklist',
      title: 'Main Courses: Big Reassurance',
      content:
        'Check the bigger gestures that deeply settle you when you\'re feeling insecure:',
      interactiveConfig: {
        kind: 'checklist',
        items: [
          { id: 'words', text: '"I\'m not going anywhere"', subtext: 'Direct verbal reassurance of commitment' },
          { id: 'priority', text: 'Canceling something to be with you', subtext: 'Choosing you over other obligations' },
          { id: 'remember', text: 'Remembering something you mentioned', subtext: 'Proof they were listening' },
          { id: 'initiate', text: 'Initiating intimacy or connection', subtext: 'You don\'t always have to be the one reaching' },
          { id: 'defend', text: 'Defending you to others', subtext: 'Taking your side publicly' },
          { id: 'plan', text: 'Making plans for the future together', subtext: '"Next summer, let\'s..."' },
        ],
        minRequired: 1,
      },
    },

    // ─── Step 4: Desserts checklist ─────────────────────
    {
      type: 'checklist',
      title: 'Desserts: Repair & Fun',
      content:
        'Check the gestures that help you recover after a disconnection:',
      interactiveConfig: {
        kind: 'checklist',
        items: [
          { id: 'humor', text: 'A private joke to break the tension', subtext: 'Humor as a repair attempt' },
          { id: 'note', text: 'A handwritten note or message', subtext: 'Something tangible to hold' },
          { id: 'sorry', text: '"I\'m sorry. I see what I did."', subtext: 'Specific, non-defensive apology' },
          { id: 'space-then-return', text: 'Taking space, then coming back', subtext: '"I need 20 minutes, but I\'m coming back"' },
          { id: 'adventure', text: 'A surprise outing or adventure', subtext: 'Breaking the routine together' },
          { id: 'gratitude', text: 'Naming 3 things you appreciate', subtext: 'Specific, not generic' },
        ],
        minRequired: 1,
      },
    },

    // ─── Step 5: Share and compare ──────────────────────
    {
      type: 'prompt',
      title: 'Share Your Menus',
      content:
        'Share your selections with each other. What surprised you about your partner\'s choices? Were there items you expected them to pick that they didn\'t?\n\nThe goal is to learn what specifically settles YOUR partner — not what you assume they want.',
      promptPlaceholder: 'I was surprised that my partner chose...',
    },

    // ─── Step 6: Reflection ─────────────────────────────
    {
      type: 'reflection',
      title: 'Your Commitment',
      content:
        'Choose one item from your partner\'s menu — appetizer, main, or dessert — that you will offer this week without being asked. Write it here.',
      promptPlaceholder: 'This week, I will offer my partner...',
    },
  ],
};
