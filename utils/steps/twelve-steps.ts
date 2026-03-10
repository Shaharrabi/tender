/**
 * Twelve Steps of Relational Healing — Master Data
 *
 * Contains the full step definitions, practice-to-step mapping,
 * phase definitions, and Nuance behavior contexts.
 *
 * The Twelve Steps are the TRANSFORMATIONAL ARC of Tender.
 * Steps live inside Healing Phases. Practices live inside Steps.
 *
 * ─── HOW IT ALL CONNECTS ───────────────────────────────
 *
 * The 12 Steps are NOT a rigid ladder. They are organized by
 * FOUR MOVEMENTS — recurring motions of growth that you cycle
 * through at deeper levels as you progress:
 *
 *   1. RECOGNITION — Seeing what's here (patterns, cycles, parts)
 *      "I can name what's happening between us."
 *
 *   2. RELEASE — Letting go of old stories and certainty
 *      "I can loosen my grip on being right."
 *
 *   3. RESONANCE — Feeling with each other
 *      "I can be moved by your experience."
 *
 *   4. EMBODIMENT — Living it daily through practice
 *      "I can do something different in the moments that matter."
 *
 * Each Step emphasizes 1-2 of these movements. Your PORTRAIT
 * determines which movement needs the most attention, and your
 * INTERVENTION PROTOCOL routes you through the steps in the
 * order that matches YOUR specific assessment profile.
 *
 * The connection chain:
 *   Assessments → Portrait → Protocol → Personalized Step Order → Practices
 *
 * See: utils/steps/intervention-protocols.ts for the protocol engine.
 */

import type { HealingStep, HealingPhase } from '@/types/growth';
import { Colors } from '@/constants/theme';
import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';
import {
  EyeIcon,
  HeartIcon,
  RefreshIcon,
  BookOpenIcon,
  SunIcon,
  SparkleIcon,
  SeedlingIcon,
} from '@/assets/graphics/icons';

// ─── Practice-to-Step Mapping ───────────────────────────
// Maps exercise IDs from the intervention registry to their primary step.
// Some practices appear in multiple steps (e.g., window-check in Steps 1 & 10).

export const PRACTICE_STEP_MAP: Record<string, number[]> = {
  // ─── Regulation (8) ─────────────────────────────────────
  'window-check':               [1, 4, 7, 11],        // Primary: Step 1  | Revisit: 4, 7, 11
  'grounding-5-4-3-2-1':        [9, 3, 4, 11],        // Primary: Step 9  | Revisit: 3, 4, 11
  'self-compassion-break':      [4, 6, 11],            // Primary: Step 4  | Revisit: 6, 11
  'distress-tolerance-together': [9, 3, 7],            // Primary: Step 9  | Revisit: 3, 7
  'opposite-action':            [8, 3, 6],             // Primary: Step 8  | Revisit: 3, 6
  'radical-acceptance':         [11, 6, 9],            // Primary: Step 11 | Revisit: 6, 9
  'assumption-audit':           [9, 3, 6],             // Primary: Step 9  | Revisit: 3, 6  (NEW)
  'back-to-back-breathe':       [7, 5, 9, 12],        // Primary: Step 7  | Revisit: 5, 9, 12 (NEW)

  // ─── Communication (12) ─────────────────────────────────
  'soft-startup':               [8, 5, 9],             // Primary: Step 8  | Revisit: 5, 9
  'repair-attempt':             [9, 6, 11],            // Primary: Step 9  | Revisit: 6, 11
  'turning-toward':             [2, 5, 10],            // Primary: Step 2  | Revisit: 5, 10
  'dreams-within-conflict':     [6, 9, 11],            // Primary: Step 6  | Revisit: 9, 11
  'aftermath-of-fight':         [9, 6, 11],            // Primary: Step 9  | Revisit: 6, 11
  'unified-detachment':         [3, 6, 8, 11],         // Primary: Step 3  | Revisit: 6, 8, 11
  'empathic-joining':           [5, 7, 9, 12],         // Primary: Step 5,7| Revisit: 9, 12
  'dear-man':                   [8, 4, 9],             // Primary: Step 8  | Revisit: 4, 9
  'stress-reducing-conversation': [6, 10, 11, 12],     // Primary: Step 6,10| Revisit: 11, 12
  'four-horsemen-antidotes':    [9, 3, 8],             // Primary: Step 9  | Revisit: 3, 8
  'externalizing-the-problem':  [8, 6, 11],            // Primary: Step 8  | Revisit: 6, 11 (NEW)
  'news-reporter-stance':       [8, 3, 6],             // Primary: Step 8  | Revisit: 3, 6  (NEW)

  // ─── Attachment (12) ────────────────────────────────────
  'emotional-bid':              [2, 5, 10],            // Primary: Step 2  | Revisit: 5, 10
  'love-maps':                  [2, 7, 10],            // Primary: Step 2  | Revisit: 7, 10
  'fondness-admiration':        [2, 10, 12],           // Primary: Step 2  | Revisit: 10, 12
  'recognize-cycle':            [1, 6, 11],            // Primary: Step 1  | Revisit: 6, 11
  'hold-me-tight':              [5, 7, 9, 12],         // Primary: Step 5,7| Revisit: 9, 12
  'couple-bubble':              [2, 7, 10],            // Primary: Step 2  | Revisit: 7, 10
  'accessing-primary-emotions': [4, 5, 7, 12],         // Primary: Step 4,7| Revisit: 5, 12
  'bonding-through-vulnerability': [5, 7, 12],         // Primary: Step 5  | Revisit: 7, 12
  'protest-polka':              [1, 6, 8, 11],         // Primary: Step 1,6| Revisit: 8, 11
  'rituals-of-connection':      [10, 11, 12],          // Primary: Step 10 | Revisit: 11, 12
  'little-you-photo-share':     [7, 5, 12],            // Primary: Step 7  | Revisit: 5, 12 (NEW)
  'reassurance-menu':           [7, 9, 11],            // Primary: Step 7  | Revisit: 9, 11 (NEW)

  // ─── Values (6) ─────────────────────────────────────────
  'values-compass':             [8, 6, 11],            // Primary: Step 8  | Revisit: 6, 11
  'relationship-values-compass': [10, 8, 12],          // Primary: Step 10 | Revisit: 8, 12
  'willingness-stance':         [6, 3, 11],            // Primary: Step 6  | Revisit: 3, 11
  'relationship-mission-statement': [12, 11],          // Primary: Step 12 | Revisit: 11
  'relationship-bullseye':      [10, 8, 12],           // Primary: Step 10 | Revisit: 8, 12 (NEW)
  'eulogy-exercise':            [11, 12],              // Primary: Step 11,12 (NEW)

  // ─── Differentiation (5) ────────────────────────────────
  'parts-check-in':             [3, 4, 7],             // Primary: Step 3  | Revisit: 4, 7
  'defusion-from-stories':      [3, 6, 11],            // Primary: Step 3  | Revisit: 6, 11
  'protector-dialogue':         [4, 7, 11],            // Primary: Step 4  | Revisit: 7, 11
  'emotional-inheritance-scan': [4, 1, 7],             // Primary: Step 4  | Revisit: 1, 7  (NEW)
  'over-functioning-brake':     [8, 4, 11],            // Primary: Step 8  | Revisit: 4, 11 (NEW)
};

/** Get the primary step for a practice (first assigned step). */
export function getPrimaryStep(practiceId: string): number | undefined {
  return PRACTICE_STEP_MAP[practiceId]?.[0];
}

/** Get all practices assigned to a specific step. */
export function getPracticesForStep(stepNumber: number): string[] {
  return Object.entries(PRACTICE_STEP_MAP)
    .filter(([, steps]) => steps.includes(stepNumber))
    .map(([id]) => id);
}

// ─── Step Audio Files ───────────────────────────────────
// Maps step numbers to audio file requires.
// Step 0 = Foundation (auto-plays on first visit)
// Steps 1-12 = Per-step introduction audio
// Step 13 = Closing track (after completing step 12)

export const STEP_AUDIO_MAP: Record<number, any> = {
  0:  require('@/assets/audio/twelve-steps-00-introduction.mp3'),
  1:  require('@/assets/audio/twelve-steps-01-acknowledge-the-strain.mp3'),
  2:  require('@/assets/audio/twelve-steps-02-trust-the-field.mp3'),
  3:  require('@/assets/audio/twelve-steps-03-release-certainty.mp3'),
  4:  require('@/assets/audio/twelve-steps-04-examine-our-part.mp3'),
  5:  require('@/assets/audio/twelve-steps-05-share-our-truths.mp3'),
  6:  require('@/assets/audio/twelve-steps-06-release-enemy-story.mp3'),
  7:  require('@/assets/audio/twelve-steps-07-commit-to-practices.mp3'),
  8:  require('@/assets/audio/twelve-steps-08-prepare-to-repair.mp3'),
  9:  require('@/assets/audio/twelve-steps-09-act-to-rebuild.mp3'),
  10: require('@/assets/audio/twelve-steps-10-maintain-awareness.mp3'),
  11: require('@/assets/audio/twelve-steps-11-seek-shared-insight.mp3'),
  12: require('@/assets/audio/twelve-steps-12-carry-the-message.mp3'),
  13: require('@/assets/audio/twelve-steps-13-closing.mp3'),
};

// ─── The 12 Steps ──────────────────────────────────────

export const TWELVE_STEPS: HealingStep[] = [
  {
    stepNumber: 1,
    title: 'Acknowledge the Strain',
    subtitle: 'Seeing the pattern \u2014 not as personal failure, but as the dance between you',
    quote:
      'We admit that patterns of disconnection have taken hold in our relationship \u2014 patterns we didn\u2019t choose but now must face together.',
    therapeuticGoal:
      'Create shared awareness of disconnection without blame. Move from "you\'re the problem" to "we have a pattern."',
    phase: 'seeing',
    fourMovementsEmphasis: 'Recognition',
    nuanceBehavior: {
      tone: 'curious, gentle, normalizing',
      focus: 'seeing patterns without blame',
      avoids: ['pushing for change too fast', 'assigning blame', 'rushing past acknowledgment'],
    },
    completionCriteria: [
      'Both partners complete Window of Tolerance Check (3x each)',
      'Both partners complete Parts Check-In (2x each)',
      'Couple completes Recognizing Your Negative Cycle together',
      'Couple can name their cycle without blaming',
    ],
    practices: ['window-check', 'recognize-cycle', 'protest-polka', 'emotional-inheritance-scan'],
    introText:
      'Every couple has patterns — ways you move around each other when things get hard. One reaches, the other retreats. Or both go loud. Or both go quiet. These patterns aren’t anyone’s fault. They developed for reasons that made sense once. In this step, you’ll learn to see your pattern together — not as blame, but as something that happens between you.',
    miniGameId: 'pattern-spotter',
    reflectionPrompts: [
      'What\'s the strain you\'re carrying? Name it without judgment.',
      'How long have you been carrying this?',
      'What would it mean if things could be different?',
    ],
    partnerRoundPrompt: 'What made you decide to try this?',
    togetherPractices: ['stress-reducing-conversation'],
    courseGatewayIds: ['mc-attachment-101'],
  },
  {
    stepNumber: 2,
    title: 'Trust the Relational Field',
    subtitle: 'Trusting that the space between you can hold more than you think',
    quote:
      'We come to believe that something wiser than either of us emerges when we meet with openness \u2014 a \u201Cwe\u201D that can heal what \u201CI\u201D cannot.',
    therapeuticGoal:
      'Shift from adversarial orientation to collaborative orientation. Build faith in the relationship itself as an entity worth tending.',
    phase: 'seeing',
    fourMovementsEmphasis: 'Recognition \u2192 Resonance',
    nuanceBehavior: {
      tone: 'warm, inviting, hopeful',
      focus: 'building faith in the "we"',
      avoids: ['cynicism', 'skepticism about repair', 'focusing only on individual growth'],
    },
    completionCriteria: [
      'Couple Bubble exercise completed',
      '7-day streak of Stress-Reducing Conversations',
      'Both partners can identify 3+ types of bids they make',
      'At least one "repair after missing a bid" moment acknowledged',
    ],
    practices: ['turning-toward', 'emotional-bid', 'love-maps', 'fondness-admiration', 'couple-bubble'],
    introText:
      'This step asks something that might feel hard: trust that something good can emerge when you both show up. Not trust that your partner will be perfect. But trust in the “we” — the space between you that comes alive when you’re both present. You don’t start with trust. You start with tiny experiments. Small moments of turning toward instead of away.',
    miniGameId: 'bid-or-miss',
    reflectionPrompts: [
      'What did you notice about the space between you this week?',
      'When did the field feel alive? When did it feel stuck?',
      'What surprised you about your partner\'s inner world?',
    ],
    partnerRoundPrompt: 'When do you feel the space between us is warm? When does it feel cold?',
    togetherPractices: ['turning-toward', 'love-maps'],
    courseGatewayIds: ['mc-bids-connection'],
  },
  {
    stepNumber: 3,
    title: 'Release Certainty',
    subtitle: 'Choosing vulnerability over protection \u2014 leading with the soft move',
    quote:
      'We let go of our fixed stories about each other and our relationship. We choose presence over prediction.',
    therapeuticGoal:
      'Soften rigid narratives. Create space for partner to be more than the story you\'ve told yourself about them.',
    phase: 'feeling',
    fourMovementsEmphasis: 'Release',
    nuanceBehavior: {
      tone: 'gentle, curious, destabilizing (in a safe way)',
      focus: 'loosening grip on certainty',
      avoids: ['reinforcing fixed stories', 'agreeing with black-and-white thinking'],
    },
    completionCriteria: [
      'Both partners complete Defusion from Relationship Stories',
      'Love Maps exercise completed with at least 15 new learnings noted',
      'Each partner identifies one "story I\'ve held that may not be the whole truth"',
    ],
    practices: ['defusion-from-stories', 'parts-check-in', 'unified-detachment'],
    introText:
      'What if the story you tell about your partner isn’t the whole truth? We all carry stories. Some have truth in them. But even true stories become traps when they prevent us from seeing our partner fresh. This step invites you to hold your certainty a little more loosely. Not to pretend you haven’t been hurt — but to wonder: what else might be true?',
    miniGameId: 'story-vs-truth',
    reflectionPrompts: [
      'What story did you notice yourself telling this week?',
      'What happened when you held it more lightly?',
      'What became possible when you weren\'t so certain?',
    ],
    partnerRoundPrompt: 'What\'s a story you\'ve told yourself about me that might not be the whole picture?',
    togetherPractices: ['unified-detachment', 'externalizing-the-problem'],
    courseGatewayIds: ['mc-act-defusion'],
  },
  {
    stepNumber: 4,
    title: 'Examine Our Part',
    subtitle: 'Getting underneath \u2014 what is really driving the pattern',
    quote:
      'We look honestly at how our own patterns contribute to disconnection \u2014 not to blame ourselves, but to reclaim our power to change.',
    therapeuticGoal:
      'Move from victim to agent. Own contribution to the cycle without collapsing into shame.',
    phase: 'feeling',
    fourMovementsEmphasis: 'Release',
    nuanceBehavior: {
      tone: 'honest, compassionate, direct',
      focus: 'owning without shaming',
      avoids: ['enabling blame of partner', 'collapsing into shame', 'bypassing accountability'],
    },
    completionCriteria: [
      'Both partners complete Accessing Primary Emotions',
      'Both partners complete Dialogue with a Protector',
      'Four Horsemen Antidotes completed \u2014 each partner identifies their primary horseman',
      'Both partners can articulate their top 3 relationship values',
    ],
    practices: ['self-compassion-break', 'accessing-primary-emotions', 'protector-dialogue', 'emotional-inheritance-scan'],
    introText:
      'This step turns the spotlight inward — and that can be uncomfortable. But stay with it. Looking at your own patterns isn’t about blame. It’s about power. Because your part is the only part you can actually change. What rises in you before you even decide to respond? None of these reactions make you bad. They make you human.',
    miniGameId: 'my-horseman',
    reflectionPrompts: [
      'What\'s your go-to move when things get hard?',
      'Where did you learn that move?',
      'What\'s underneath it — what are you trying to protect?',
    ],
    partnerRoundPrompt: 'What\'s one move I make in our conflicts that I know doesn\'t help?',
    togetherPractices: ['recognize-cycle', 'protest-polka'],
    courseGatewayIds: ['mc-regulation'],
  },
  {
    stepNumber: 5,
    title: 'Share Our Truths',
    subtitle: 'Sharing your pattern with your partner \u2014 letting yourself be seen',
    quote:
      'We speak what has been hidden \u2014 our fears, our longings, our disappointments \u2014 trusting that truth told with care strengthens the bond.',
    therapeuticGoal:
      'Practice vulnerable disclosure. Build trust through witnessing and being witnessed.',
    phase: 'shifting',
    fourMovementsEmphasis: 'Resonance',
    nuanceBehavior: {
      tone: 'tender, reverent, holding',
      focus: 'creating safety for disclosure',
      avoids: ['rushing', 'intellectualizing', 'minimizing vulnerability'],
    },
    completionCriteria: [
      'Bonding Through Vulnerability completed at least once',
      'Hold Me Tight Conversation completed',
      'Both partners can name one fear they hadn\'t shared before this step',
    ],
    practices: ['bonding-through-vulnerability', 'hold-me-tight', 'empathic-joining'],
    introText:
      'This is the step of vulnerability. There are things you’ve never said. Maybe fears about the relationship itself. Maybe needs you’ve swallowed because asking felt too risky. Vulnerability is not weakness. It’s the foundation of intimacy. Without it, you’re two people performing closeness instead of living it.',
    miniGameId: 'the-unsaid',
    reflectionPrompts: [
      'What truth did you share this week?',
      'What happened when you let yourself be seen?',
      'What\'s still waiting to be said?',
    ],
    partnerRoundPrompt: 'What\'s something true that I\'ve been afraid to tell you?',
    togetherPractices: ['hold-me-tight', 'bonding-through-vulnerability'],
    courseGatewayIds: ['mc-seen'],
  },
  {
    stepNumber: 6,
    title: 'Release the Enemy Story',
    subtitle: 'Releasing the protective moves that once kept you safe but now keep you apart',
    quote:
      'We let go of seeing each other as adversaries. We recognize that the walls between us came from protection, not malice.',
    therapeuticGoal:
      'Soften contempt. See partner\'s behavior through attachment lens rather than character lens.',
    phase: 'shifting',
    fourMovementsEmphasis: 'Release \u2192 Resonance',
    nuanceBehavior: {
      tone: 'compassionate, reframing, curious about partner',
      focus: 'dissolving the enemy image',
      avoids: ['enabling contempt', 'agreeing with demonization'],
    },
    completionCriteria: [
      'Unified Detachment completed \u2014 both can describe cycle in "we" language',
      'Fondness & Admiration completed \u2014 21-day appreciation practice',
      'Each partner can articulate one way their partner\'s "difficult" behavior makes sense given their history',
    ],
    practices: ['dreams-within-conflict', 'stress-reducing-conversation', 'willingness-stance', 'protest-polka'],
    introText:
      'When things are hard, it’s easy to cast your partner as the villain. But what if their walls came from protection, not malice? This step asks you to look behind your partner’s difficult behavior. Not to excuse it. But to understand it. When you understand, something shifts. You stop fighting each other and start fighting the pattern together.',
    miniGameId: 'behind-the-wall',
    reflectionPrompts: [
      'When did you catch yourself seeing your partner as the enemy this week?',
      'What happened when you named the pattern instead?',
      'What does your partner need that\'s hard for them to ask for?',
    ],
    partnerRoundPrompt: 'What\'s one thing I do that I know triggers you? What do you think I\'m actually trying to communicate underneath it?',
    togetherPractices: ['externalizing-the-problem', 'aftermath-of-fight', 'repair-attempt'],
    courseGatewayIds: ['mc-conflict-repair'],
  },
  {
    stepNumber: 7,
    title: 'Commit to Relational Practices',
    subtitle: 'Moving from insight to daily rhythm \u2014 making love a practice, not a feeling',
    quote:
      'We ask for the humility and courage to approach each encounter with curiosity and kindness, making our relationship a daily practice.',
    therapeuticGoal:
      'Move from insight to consistent action. Build sustainable rituals.',
    phase: 'shifting',
    fourMovementsEmphasis: 'Embodiment',
    nuanceBehavior: {
      tone: 'practical, encouraging, coach-like',
      focus: 'building sustainable habits',
      avoids: ['perfectionism', 'overwhelming with too many practices'],
    },
    completionCriteria: [
      'At least 3 Rituals of Connection established and practiced for 2+ weeks',
      'Relationship Values Compass completed \u2014 shared values articulated',
      'Both partners can name their "willingness edges"',
    ],
    practices: ['back-to-back-breathe', 'empathic-joining', 'hold-me-tight', 'little-you-photo-share', 'reassurance-menu', 'accessing-primary-emotions'],
    introText:
      'Understanding is not the same as change. You can know exactly why you fall into old patterns and still fall into them tomorrow. What makes the difference is practice. Not grand gestures, but small, sustainable rituals that keep you oriented toward connection even when life gets hard.',
    miniGameId: 'ritual-builder',
    reflectionPrompts: [
      'What invitation did you extend this week?',
      'How did your partner respond?',
      'What did you remember about why you chose each other?',
    ],
    partnerRoundPrompt: 'What\'s one small thing I do that makes you feel loved?',
    togetherPractices: ['fondness-admiration', 'rituals-of-connection', 'reassurance-menu', 'little-you-photo-share'],
    courseGatewayIds: ['mc-orientation-pleasure', 'mc-fondness-gratitude'],
  },
  {
    stepNumber: 8,
    title: 'Prepare to Repair Harm',
    subtitle: 'Turning toward the ruptures \u2014 not to reopen wounds, but to finally tend them',
    quote:
      'We bring our attention to the ruptures \u2014 the moments of betrayal, withdrawal, or harm \u2014 and prepare to face them together.',
    therapeuticGoal:
      'Surface unresolved wounds without re-traumatizing. Create readiness for repair.',
    phase: 'integrating',
    fourMovementsEmphasis: 'Recognition',
    nuanceBehavior: {
      tone: 'grounded, careful, boundaried',
      focus: 'preparing safely for difficult repair work',
      avoids: ['forcing repair before readiness', 're-traumatizing', 'minimizing harm'],
    },
    completionCriteria: [
      'TIPP Skills practiced together at least twice',
      'At least one Regrettable Incident processed',
      'Both partners identify 1-2 "repair-worthy" moments not yet addressed',
    ],
    practices: ['soft-startup', 'opposite-action', 'dear-man', 'externalizing-the-problem', 'news-reporter-stance', 'values-compass', 'over-functioning-brake'],
    introText:
      'Every relationship has ruptures. Some get repaired. Some get buried — still there, still tender, just not talked about. This step is about bringing attention to what’s been wounded. Not to rip it open. But to finally tend to it properly. You don’t have to do it all at once. You just have to acknowledge that it’s there.',
    miniGameId: 'repair-inventory',
    reflectionPrompts: [
      'What new move did you try this week?',
      'What happened? (No judgment — just observation)',
      'What will you try next?',
    ],
    partnerRoundPrompt: 'What\'s one new move you\'re trying to make? How can I support it?',
    togetherPractices: ['turning-toward', 'dreams-within-conflict', 'empathic-joining'],
    courseGatewayIds: ['mc-boundaries', 'mc-boundaries-deep'],
  },
  {
    stepNumber: 9,
    title: 'Act to Rebuild Trust',
    subtitle: 'Showing up differently \u2014 trust rebuilt through action, not promises',
    quote:
      'We move from intention to action \u2014 listening where we once dismissed, reaching where we once retreated, showing up where we once stayed silent.',
    therapeuticGoal:
      'Take concrete repair actions. Demonstrate change through behavior, not just words.',
    phase: 'integrating',
    fourMovementsEmphasis: 'Embodiment',
    nuanceBehavior: {
      tone: 'action-oriented, accountable, celebrating effort',
      focus: 'supporting follow-through',
      avoids: ['accepting words without action', 'enabling empty apologies'],
    },
    completionCriteria: [
      'Repair Conversation Guide used for at least 2 past ruptures',
      'Soft Startup practiced in at least 3 real conversations',
      'DEAR MAN used by each partner at least once',
      'Both partners can name one concrete behavioral change they\'ve made',
    ],
    practices: ['grounding-5-4-3-2-1', 'distress-tolerance-together', 'assumption-audit', 'repair-attempt', 'aftermath-of-fight', 'four-horsemen-antidotes'],
    introText:
      'Apologies matter. But at some point, you have to show rather than tell. Trust isn’t rebuilt through words alone. It’s rebuilt through consistent action over time — showing up differently, again and again. This step gives you tools for repair and the skill of soft startup — how to begin hard conversations in a way that invites your partner closer.',
    miniGameId: 'soft-startup-sim',
    reflectionPrompts: [
      'What rupture happened this week?',
      'How did you repair it?',
      'What did you learn about what works?',
    ],
    partnerRoundPrompt: 'What\'s the repair gesture from me that works best for you?',
    togetherPractices: ['aftermath-of-fight', 'hold-me-tight', 'couple-bubble'],
    courseGatewayIds: ['mc-trust-repair', 'mc-lightness-lab'],
  },
  {
    stepNumber: 10,
    title: 'Maintain Ongoing Awareness',
    subtitle: 'Old patterns will return \u2014 meeting them with gentleness, not shame',
    quote:
      'We recognize that old patterns will resurface. When they do, we meet them with honesty and gentle recalibration, not shame.',
    therapeuticGoal:
      'Normalize setbacks. Build sustainable maintenance practices. Prevent relapse into old cycles.',
    phase: 'integrating',
    fourMovementsEmphasis: 'Recognition \u2192 Embodiment',
    nuanceBehavior: {
      tone: 'steady, normalizing, non-judgmental',
      focus: 'supporting ongoing awareness without perfectionism',
      avoids: ['shame about setbacks', 'complacency', 'all-or-nothing thinking'],
    },
    completionCriteria: [
      '30-day maintenance tracking established',
      'At least one "we caught ourselves in the old pattern" moment processed',
      'Both partners have a personal regulation practice they do 3x/week',
    ],
    practices: ['rituals-of-connection', 'relationship-values-compass', 'relationship-bullseye', 'stress-reducing-conversation'],
    introText:
      'Here’s something important: you will slip back into old patterns. Not because you failed — because you’re human. The question isn’t whether you’ll stumble. It’s how quickly you catch yourself and how gently you return to connection. When you catch yourselves doing “that thing” again, it’s not defeat — it’s awareness.',
    miniGameId: 'pattern-check-in',
    reflectionPrompts: [
      'What ritual did you practice this week?',
      'How did it feel?',
      'What ritual do you want to keep forever?',
    ],
    partnerRoundPrompt: 'What small ritual do you want us to never lose?',
    togetherPractices: ['rituals-of-connection', 'stress-reducing-conversation', 'relationship-mission-statement', 'eulogy-exercise'],
    courseGatewayIds: ['mc-values-alignment'],
  },
  {
    stepNumber: 11,
    title: 'Seek Shared Insight',
    subtitle: 'Listening to what the relationship itself is trying to tell you',
    quote:
      'We create spaces for the relationship itself to speak \u2014 through reflection, dialogue, and quiet presence together.',
    therapeuticGoal:
      'Develop couple\'s capacity for metacognition. Learn to "check in" with the relationship as an entity.',
    phase: 'sustaining',
    fourMovementsEmphasis: 'Resonance',
    nuanceBehavior: {
      tone: 'spacious, reflective, attuned to something larger',
      focus: 'listening to the relationship itself',
      avoids: ['rushing to solutions', 'staying on surface level'],
    },
    completionCriteria: [
      'Dreams Within Conflict completed for at least one persistent disagreement',
      'Couple has established a regular "relationship check-in" ritual',
      'Both partners can describe what they sense the relationship "needs" right now',
    ],
    practices: ['radical-acceptance', 'eulogy-exercise'],
    introText:
      'By now, something has shifted. You’re not just two individuals managing a relationship — you’re learning to sense the relationship as its own living thing. What does it need right now? Where is it growing? Where is it still tender? This step asks you to create space for the relationship itself to speak.',
    miniGameId: 'the-third-voice',
    reflectionPrompts: [
      'What pattern did you sustain this week?',
      'Where did you drift?',
      'What brought you back?',
    ],
    partnerRoundPrompt: 'What\'s one moment this week where we got it right?',
    togetherPractices: ['stress-reducing-conversation'],
    courseGatewayIds: ['mc-text-between-us'],
  },
  {
    stepNumber: 12,
    title: 'Carry the Message of Connection',
    subtitle: 'Living it \u2014 your healing becomes a gift to every relationship around you',
    quote:
      'Having experienced how openness and presence transform us, we embody these values in all our relationships \u2014 not by demanding others change, but by living as examples.',
    therapeuticGoal:
      'Integration and expansion. The couple becomes a source of relational health in their community.',
    phase: 'sustaining',
    fourMovementsEmphasis: 'Embodiment \u2192 Transmission',
    nuanceBehavior: {
      tone: 'celebratory, humble, looking outward',
      focus: 'integration and service',
      avoids: ['false completion', 'ignoring ongoing work'],
    },
    completionCriteria: [
      'Relationship review completed \u2014 couple reflects on full journey',
      'Each partner identifies how the journey has changed other relationships',
      'Couple creates a "relationship mission statement" or commitment',
    ],
    practices: ['relationship-mission-statement', 'eulogy-exercise', 'back-to-back-breathe', 'fondness-admiration', 'bonding-through-vulnerability'],
    introText:
      'You’ve come a long way. The seeing. The softening. The rebuilding. The practicing. This final step isn’t about adding more work. It’s about integration — letting everything you’ve learned become part of who you are. Changed people change the world around them. Not by preaching, but by being.',
    miniGameId: 'relationship-manifesto',
    reflectionPrompts: [
      'In what moments is your relationship already a refuge?',
      'What\'s still being built?',
      'What do you want to give to this space?',
    ],
    partnerRoundPrompt: undefined, // Step 12 is ongoing — no single prompt
    togetherPractices: ['relationship-mission-statement', 'eulogy-exercise', 'couple-bubble'],
    courseGatewayIds: [
      'mc-attachment-101', 'mc-bids-connection', 'mc-act-defusion', 'mc-regulation',
      'mc-seen', 'mc-conflict-repair', 'mc-orientation-pleasure', 'mc-fondness-gratitude',
      'mc-boundaries', 'mc-boundaries-deep', 'mc-trust-repair', 'mc-lightness-lab',
      'mc-values-alignment', 'mc-text-between-us',
    ],
  },
];

// ─── Healing Phases ─────────────────────────────────────

export interface PhaseDefinition {
  id: HealingPhase;
  name: string;
  subtitle: string;
  weekRange: [number, number | null];
  icon: ComponentType<IconProps>;
  color: string;
  stepRange: [number, number];
  stepFocus: string;
}

export const HEALING_PHASES: PhaseDefinition[] = [
  {
    id: 'seeing',
    name: 'Seeing',
    subtitle: 'Understanding what\u2019s here',
    weekRange: [1, 2],
    icon: EyeIcon,
    color: '#8B9E7E',
    stepRange: [1, 2],
    stepFocus: 'Acknowledge the Strain + Trust the Relational Field',
  },
  {
    id: 'feeling',
    name: 'Feeling',
    subtitle: 'Making contact with what\u2019s underneath',
    weekRange: [3, 4],
    icon: HeartIcon,
    color: Colors.secondary,
    stepRange: [3, 4],
    stepFocus: 'Release Certainty + Examine Our Part',
  },
  {
    id: 'shifting',
    name: 'Shifting',
    subtitle: 'Trying new moves',
    weekRange: [5, 8],
    icon: RefreshIcon,
    color: '#D4A574',
    stepRange: [5, 7],
    stepFocus: 'Share Truths \u2192 Release Enemy Story \u2192 Commit to Practices',
  },
  {
    id: 'integrating',
    name: 'Integrating',
    subtitle: 'Making it stick',
    weekRange: [9, 12],
    icon: BookOpenIcon,
    color: '#9B8EC4',
    stepRange: [8, 10],
    stepFocus: 'Prepare to Repair \u2192 Act to Rebuild \u2192 Maintain Awareness',
  },
  {
    id: 'sustaining',
    name: 'Sustaining',
    subtitle: 'Living it',
    weekRange: [13, null],
    icon: SunIcon,
    color: '#E8C87A',
    stepRange: [11, 12],
    stepFocus: 'Carry the Message of Connection',
  },
];

/** Get the phase that contains a given step number. */
export function getPhaseForStep(stepNumber: number): PhaseDefinition | undefined {
  return HEALING_PHASES.find(
    (phase) => stepNumber >= phase.stepRange[0] && stepNumber <= phase.stepRange[1]
  );
}

/** Get a step by its number. */
export function getStep(stepNumber: number): HealingStep | undefined {
  return TWELVE_STEPS.find((s) => s.stepNumber === stepNumber);
}

// ─── Taglines by Step ───────────────────────────────────

export const TAGLINES_BY_STEP: Record<number, string[]> = {
  1: [
    'The pattern is not the person.',
    'Your cycle makes sense. It just costs too much.',
    'The dance between you is not either person\u2019s fault.',
    'The pattern between you is not the problem. It is the doorway.',
    'You brought this pattern with you. You did not create it on purpose. And you can change it.',
  ],
  2: [
    'Something wiser than either of you emerges when you meet with openness.',
    'The \u201Cwe\u201D can heal what \u201CI\u201D cannot.',
    'Safety is not the absence of danger. It is the presence of connection.',
    'The space between you is alive. It changes when you do.',
    'Co-regulation is not weakness. It is biology.',
  ],
  3: [
    'What if you are wrong about why they do that?',
    'Your story about them might not be the whole truth.',
    'Presence over prediction.',
    'You can hold two truths at once. So can your relationship.',
    'The body always knows before the mind catches up.',
  ],
  4: [
    'What you are feeling underneath is the real conversation.',
    'Every protector has a good reason.',
    'Owning your part is not blame. It is power.',
    'Name it to tame it.',
    'The reach and the retreat are both asking for the same thing.',
  ],
  5: [
    'Vulnerability is not weakness. It is the birthplace of connection.',
    'The strongest relationships are built by people willing to be seen.',
    'Truth told with care strengthens the bond.',
    'Strip it down. See what is singular. See your partner\u2019s version. Let it land.',
  ],
  6: [
    'The walls between you came from protection, not malice.',
    'Can you see the scared child underneath their difficult behavior?',
    'Contempt dissolves when you see your partner\u2019s wound.',
    'What divides you also connects you.',
    'Your differences are resources, not obstacles.',
  ],
  7: [
    'Small, consistent practice changes everything.',
    'Your relationship is a daily practice, not a fixed state.',
    'Rituals of connection are how love lives.',
    'Rhythm over memory. Practice over perfection.',
    'Secure is not a type. It is a practice.',
  ],
  8: [
    'Rupture is inevitable. Repair is a choice.',
    'Old wounds need acknowledgment before healing.',
    'Preparing to repair is an act of courage.',
    'The strongest relationships are not conflict-free. They are repair-rich.',
    'Rupture is inevitable. Repair is a choice.',
  ],
  9: [
    'Coming back is braver than never leaving.',
    'Real repair is behavior change, not just words.',
    'Trust is rebuilt in small, consistent actions.',
    'Every repair is a fresh start.',
    'Love is not a feeling. It is a series of choices.',
  ],
  10: [
    'Old patterns will resurface. Meet them with gentleness.',
    'Catching yourself in the cycle is the practice.',
    'Setbacks are not failures. They are data.',
    'Growth does not move in a straight line. It spirals.',
    'Healing is not linear. Rest is part of the process.',
  ],
  11: [
    'What does your relationship want to tell you?',
    'The deeper meaning is underneath the conflict.',
    'Listen to the \u201Cwe\u201D \u2014 it has wisdom.',
    'The relationship knows things that neither of you individually knows.',
    'What is here? What is between you? What is trying to emerge?',
  ],
  12: [
    'You are already brave enough to be here.',
    'Your healing ripples outward.',
    'Living this way IS the message.',
    'Between stimulus and response, there is a space.',
    'Both of you are doing the best you can with what you have.',
  ],
};

/** Get a random tagline for a step number. */
export function getTaglineForStep(stepNumber: number): string {
  const taglines = TAGLINES_BY_STEP[stepNumber] ?? TAGLINES_BY_STEP[1];
  return taglines[Math.floor(Math.random() * taglines.length)];
}

// ─── Step-Specific Nuance Opening Prompts ──────────────────
// These replace the generic conversation starters when the user
// has an active step. They guide the conversation toward the step's focus.

export const NUANCE_OPENING_PROMPTS: Record<number, string[]> = {
  1: [
    'Help me see the pattern between us',
    'I noticed something keeps happening in our arguments',
    'Why do we keep falling into the same fight?',
  ],
  2: [
    'I want to believe things can get better',
    'What does it mean to trust the relationship itself?',
    'Help me see what\'s good between us',
  ],
  3: [
    'I might be wrong about why my partner does that',
    'I have a story about my partner I want to examine',
    'Help me see my partner with fresh eyes',
  ],
  4: [
    'I want to understand my part in our cycle',
    'What am I bringing to this pattern?',
    'Help me see what I\'m protecting underneath',
  ],
  5: [
    'There\'s something I haven\'t told my partner',
    'I want to be more vulnerable but I\'m scared',
    'Help me find the words for what I\'m feeling',
  ],
  6: [
    'I\'m struggling to see my partner\'s side',
    'I want to stop seeing them as the enemy',
    'Help me understand why they do what they do',
  ],
  7: [
    'I want to build a daily practice for our relationship',
    'What rituals of connection could work for us?',
    'Help me turn my insights into habits',
  ],
  8: [
    'There\'s something between us that needs repair',
    'I hurt my partner and I want to make it right',
    'How do I prepare for a difficult conversation?',
  ],
  9: [
    'I want to show up differently this time',
    'Help me practice a soft startup',
    'I need to repair what happened yesterday',
  ],
  10: [
    'I caught myself falling into the old pattern',
    'How do I stay aware without being hyper-vigilant?',
    'The old cycle came back — help me process it',
  ],
  11: [
    'What does our relationship need right now?',
    'We have a conflict that keeps coming back',
    'Help us explore what\'s underneath this disagreement',
  ],
  12: [
    'I want to reflect on how far we\'ve come',
    'How has this journey changed my other relationships?',
    'Help us create our relationship mission statement',
  ],
};

/** Get opening prompts for Nuance based on current step. */
export function getNuanceOpeningPrompts(stepNumber: number): string[] {
  return NUANCE_OPENING_PROMPTS[stepNumber] ?? NUANCE_OPENING_PROMPTS[1];
}

// ─── How Steps Relate to Your Portrait ────────────────
// This is the "secret sauce" bridge that Shahar asked for:
// How do the 12 steps connect to someone's specific assessment profile?

/**
 * STEP-TO-MOVEMENT MAPPING
 *
 * Each step's primary and secondary movements — used by the
 * intervention protocol engine to determine emphasis.
 */
export const STEP_MOVEMENTS: Record<number, { primary: string; secondary?: string }> = {
  1:  { primary: 'Recognition' },                           // See the pattern
  2:  { primary: 'Recognition', secondary: 'Resonance' },   // See + feel the "we"
  3:  { primary: 'Release' },                                // Let go of fixed stories
  4:  { primary: 'Release' },                                // Own your part
  5:  { primary: 'Resonance' },                              // Share vulnerably
  6:  { primary: 'Release', secondary: 'Resonance' },        // Release enemy story + empathy
  7:  { primary: 'Embodiment' },                             // Build daily practice
  8:  { primary: 'Recognition' },                            // Face the wounds
  9:  { primary: 'Embodiment' },                             // Act to repair
  10: { primary: 'Recognition', secondary: 'Embodiment' },   // Ongoing awareness + practice
  11: { primary: 'Resonance' },                              // Shared insight
  12: { primary: 'Embodiment' },                             // Carry it forward
};

/**
 * MOVEMENT DESCRIPTIONS — User-facing explanations
 * Used in the homepage and growth plan UI to explain what
 * each movement means in plain language.
 */
export const FOUR_MOVEMENTS_EXPLAINED: Record<string, {
  name: string;
  icon: ComponentType<IconProps>;
  question: string;
  description: string;
  howItFeels: string;
  steps: readonly number[];
}> = {
  recognition: {
    name: 'Recognition',
    icon: EyeIcon,
    question: 'Can I see what\'s happening?',
    description:
      'The ability to see your patterns clearly — without blame, without shame. ' +
      'Recognition means you can name your cycle, your triggers, and your protective moves. ' +
      'It\'s the foundation: you can\'t change what you can\'t see.',
    howItFeels:
      'Moments of "Oh — THAT\'S what we\'re doing." The lightbulb of pattern recognition. ' +
      'Seeing your cycle from the outside rather than being stuck inside it.',
    steps: [1, 2, 8, 10],
  },
  release: {
    name: 'Release',
    icon: SparkleIcon,
    question: 'Can I let go of being right?',
    description:
      'The willingness to loosen your grip on certainty — about your partner, ' +
      'about yourself, about what "should" happen. Release is not forgetting; ' +
      'it\'s making space for something new.',
    howItFeels:
      'The softening when you realize your story about them isn\'t the whole truth. ' +
      'The moment of "Maybe I\'ve been wrong about why they do that." Humility without humiliation.',
    steps: [3, 4, 6],
  },
  resonance: {
    name: 'Resonance',
    icon: SparkleIcon,
    question: 'Can I be moved by your experience?',
    description:
      'The capacity to let your partner\'s world touch yours — to feel WITH them, ' +
      'not just think ABOUT them. Resonance is what makes repair possible and connection real.',
    howItFeels:
      'When your partner shares something and you feel it in your body. When their tears ' +
      'become your tears. When you understand not just their words but their world.',
    steps: [2, 5, 11],
  },
  embodiment: {
    name: 'Embodiment',
    icon: SeedlingIcon,
    question: 'Can I live this daily?',
    description:
      'Turning insight into habit. Embodiment is when the new way of being becomes ' +
      'your default — not through willpower, but through consistent practice. Small moves, ' +
      'repeated daily, change everything.',
    howItFeels:
      'When you catch yourself mid-pattern and choose differently — without having to think ' +
      'about it. When the repair attempt comes naturally. When your values are lived, not just believed.',
    steps: [7, 9, 12],
  },
};

/**
 * Get a personalized step order based on intervention protocol emphasis.
 * Instead of going 1-2-3-4..., the protocol determines which steps
 * matter most for THIS person's profile.
 *
 * @param stepEmphasis - Array of step numbers in priority order (from protocol)
 * @returns The full 12-step array reordered with priority steps first
 */
export function getPersonalizedStepOrder(stepEmphasis: number[]): HealingStep[] {
  const prioritySteps = stepEmphasis
    .map(num => TWELVE_STEPS.find(s => s.stepNumber === num))
    .filter((s): s is HealingStep => s !== undefined);

  const remainingSteps = TWELVE_STEPS.filter(
    s => !stepEmphasis.includes(s.stepNumber)
  );

  return [...prioritySteps, ...remainingSteps];
}

/**
 * Get a human-readable summary of why a specific step matters
 * for a given user, based on their portrait data.
 *
 * This powers the "Why This Step" section in the growth plan UI.
 */
export function getStepRelevance(
  stepNumber: number,
  regulationScore: number,
  selfLeadership: number,
  accessibility: number,
  valuesCongruence: number
): string {
  const step = getStep(stepNumber);
  if (!step) return '';

  const movement = STEP_MOVEMENTS[stepNumber];
  const relevance: string[] = [];

  // Add movement context
  relevance.push(
    `This step develops your ${movement.primary} capacity` +
    (movement.secondary ? ` and ${movement.secondary}` : '') +
    '.'
  );

  // Add personalized relevance based on scores
  switch (stepNumber) {
    case 1:
      if (regulationScore < 50)
        relevance.push('Particularly important for you — your regulation scores suggest pattern awareness is your foundation.');
      break;
    case 3:
    case 4:
      if (selfLeadership < 50)
        relevance.push('Your self-leadership score suggests this Release work is a priority — loosening protective patterns opens new possibilities.');
      break;
    case 5:
    case 11:
      if (accessibility < 50)
        relevance.push('This Resonance step stretches your growth edge — building emotional accessibility takes practice, and this step provides the structure.');
      break;
    case 7:
    case 9:
      if (valuesCongruence < 60)
        relevance.push('This Embodiment step directly addresses your values-behavior gap — turning what you believe into what you do.');
      break;
  }

  return relevance.join(' ');
}

// ─── Solo Mode Content Variants ─────────────────────────
// These provide reframed subtitles for solo users.
// The spec says: "12 Steps work for solo users with subtitle/framing changes."

export const SOLO_STEP_SUBTITLES: Record<number, string> = {
  1: 'Seeing your pattern \u2014 what you bring to every relationship',
  2: 'Trusting that you can hold more than you think',
  3: 'Choosing vulnerability \u2014 preparing to lead with openness',
  4: 'Getting underneath \u2014 what drives your protective patterns',
  5: 'Owning your pattern \u2014 seeing it clearly',
  6: 'Releasing protective moves that keep connection at bay',
  7: 'Preparing to invite someone into your inner world',
  8: 'Designing the patterns you want to create',
  9: 'Learning the repair moves you will need',
  10: 'Committing to your relational growth',
  11: 'Envisioning your rituals of connection',
  12: 'Becoming someone who can be a refuge',
};

/** Get the step subtitle appropriate for the user's mode. */
export function getStepSubtitle(stepNumber: number, mode?: string): string {
  if (mode === 'solo') {
    return SOLO_STEP_SUBTITLES[stepNumber] ?? TWELVE_STEPS[stepNumber - 1]?.subtitle ?? '';
  }
  return TWELVE_STEPS[stepNumber - 1]?.subtitle ?? '';
}

/** Solo mode Nuance opening prompts (reframed for individual work). */
export const NUANCE_OPENING_PROMPTS_SOLO: Record<number, string[]> = {
  1: [
    'Help me see the patterns I bring to relationships',
    'I keep ending up in the same dynamic',
    'What does my attachment style look like in action?',
  ],
  2: [
    'I want to believe I can have a healthy relationship',
    'How do I build trust in myself?',
    'Help me understand what co-regulation means',
  ],
  3: [
    'I have a story about my ex I want to examine',
    'I might be wrong about why relationships don\u2019t work for me',
    'Help me see past patterns with fresh eyes',
  ],
  4: [
    'What am I bringing to my relationship patterns?',
    'Help me see what I\u2019m protecting underneath',
    'I want to understand my part in past relationships',
  ],
  5: [
    'I struggle to show my real feelings',
    'I want to practice being more vulnerable',
    'Help me find the words for what I\u2019m feeling inside',
  ],
  6: [
    'I keep blaming my ex for everything',
    'I want to stop seeing people as the enemy',
    'Help me understand why they did what they did',
  ],
  7: [
    'I want to build practices for when I\u2019m in a relationship',
    'What daily habits make relationships healthy?',
    'Help me turn my self-knowledge into action',
  ],
  8: [
    'There are things from past relationships I haven\u2019t processed',
    'I want to learn how to repair after a conflict',
    'How do I prepare for difficult conversations?',
  ],
  9: [
    'I want to learn how to show up differently',
    'Help me practice repair skills',
    'What does a soft startup look like?',
  ],
  10: [
    'I caught myself falling into an old pattern',
    'How do I stay aware of my patterns in daily life?',
    'The old cycle came back \u2014 help me understand why',
  ],
  11: [
    'What do I want a relationship to feel like?',
    'Help me envision the connection I\u2019m building toward',
    'What rituals would I bring to my next relationship?',
  ],
  12: [
    'I want to reflect on how far I\u2019ve come',
    'How has this work changed me?',
    'Help me think about what I\u2019ll bring to my next relationship',
  ],
};

/** Get opening prompts for Nuance, adjusted by mode. */
export function getNuanceOpeningPromptsForMode(stepNumber: number, mode?: string): string[] {
  if (mode === 'solo') {
    return NUANCE_OPENING_PROMPTS_SOLO[stepNumber] ?? NUANCE_OPENING_PROMPTS_SOLO[1];
  }
  return NUANCE_OPENING_PROMPTS[stepNumber] ?? NUANCE_OPENING_PROMPTS[1];
}

// ─── Solo Mode Language Substitutions ──────────────────
// Used by Nuance and UI copy to adapt language for solo users.

export const SOLO_LANGUAGE_MAP: [RegExp, string][] = [
  [/the space between you/gi, 'your relational patterns'],
  [/your partner/gi, 'a partner'],
  [/when you two/gi, 'when you\u2019re in relationship'],
  [/your couple/gi, 'your relating style'],
  [/share with your partner/gi, 'reflect on this'],
  [/do together/gi, 'practice'],
  [/both partners/gi, 'you'],
  [/between you/gi, 'in your patterns'],
];

// ─── Step-Specific Journal Prompts ──────────────────────
// Used on the home page Daily Rhythm section. Each step has
// multiple prompts that rotate by day-of-year.

export interface StepJournalPrompt {
  question: string;
  solo?: string; // solo-mode alternative wording (optional)
}

export const STEP_JOURNAL_PROMPTS: Record<number, StepJournalPrompt[]> = {
  1: [
    { question: 'What pattern did you notice between you today?', solo: 'What pattern did you notice in your relationships today?' },
    { question: 'When did the strain show up this week, and how did you respond?', solo: 'When did relational strain show up this week?' },
    { question: 'What would it look like to acknowledge the strain without trying to fix it?', solo: 'What would it look like to acknowledge strain without trying to fix it?' },
  ],
  2: [
    { question: 'What moment of connection surprised you recently?' },
    { question: 'Where did you feel the relational field shift today \u2014 toward warmth or distance?' },
    { question: 'What would trusting the space between you look like right now?', solo: 'What would trusting the process look like right now?' },
  ],
  3: [
    { question: 'What story did you notice yourself telling about your partner today?', solo: 'What story did you notice yourself telling about a relationship today?' },
    { question: 'Where did you hold on to being right instead of being curious?' },
    { question: 'What would releasing certainty feel like in your body?' },
  ],
  4: [
    { question: 'What part of the pattern do you contribute to?' },
    { question: 'When did your protector show up today, and what was it guarding?' },
    { question: 'What would it mean to truly own your side of the dance?' },
  ],
  5: [
    { question: 'What truth have you been holding back, and what keeps you from sharing it?', solo: 'What truth have you been holding back?' },
    { question: 'When did you feel most known today, and what made that possible?' },
    { question: 'What would safe vulnerability look like in your relationship right now?', solo: 'What would safe vulnerability look like right now?' },
  ],
  6: [
    { question: 'When did you catch yourself seeing your partner as the enemy this week?', solo: 'When did you catch yourself casting someone as the enemy this week?' },
    { question: 'What would it take to see the hurt behind the behavior?' },
    { question: 'Where could you replace judgment with curiosity today?' },
  ],
  7: [
    { question: 'What invitation could you extend to your partner today?', solo: 'What invitation could you extend to someone you care about today?' },
    { question: 'How did you respond to your partner\u2019s last bid for connection?', solo: 'How did you respond to the last bid for connection directed at you?' },
    { question: 'What would it look like to make space for your partner\u2019s experience?', solo: 'What would it look like to make space for someone else\u2019s experience?' },
  ],
  8: [
    { question: 'What new response did you try today, even a small one?' },
    { question: 'Where did you interrupt an old pattern this week?' },
    { question: 'What does the new pattern you\u2019re building feel like compared to the old one?' },
  ],
  9: [
    { question: 'What repair attempt did you make or receive this week?' },
    { question: 'What makes it hard for you to say \u201CI\u2019m sorry\u201D or \u201CI hear you\u201D?' },
    { question: 'Where did you choose repair over retreat today?' },
  ],
  10: [
    { question: 'What small ritual grounds your relationship right now?', solo: 'What small ritual grounds you right now?' },
    { question: 'How did you mark a transition today \u2014 leaving, arriving, or reconnecting?', solo: 'How did you mark a transition today?' },
    { question: 'What ritual of connection would you like to build?', solo: 'What relational ritual would you like to build?' },
  ],
  11: [
    { question: 'What pattern felt easiest to sustain today, and what still takes effort?' },
    { question: 'Where did your growth show up without you trying?' },
    { question: 'What does sustaining feel like compared to striving?' },
  ],
  12: [
    { question: 'How did you offer refuge to your partner today?', solo: 'How did you offer refuge to someone today?' },
    { question: 'Where did you feel most at home in your relationship this week?', solo: 'Where did you feel most at home in yourself this week?' },
    { question: 'What does it mean to become a refuge for someone you love?', solo: 'What does it mean to become a refuge?' },
  ],
};

/** Get today\u2019s journal prompt for a given step, with optional solo-mode wording. */
export function getJournalPromptForStep(stepNumber: number, isSolo?: boolean): string {
  const prompts = STEP_JOURNAL_PROMPTS[stepNumber] ?? STEP_JOURNAL_PROMPTS[1];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const prompt = prompts[dayOfYear % prompts.length];
  return (isSolo && prompt.solo) ? prompt.solo : prompt.question;
}

// ─── Step-Assessment Nudge Mapping ──────────────────────
// Maps specific steps to relevant assessments that deepen the
// step's work. These are gentle invitations, NEVER gates.
// The step journey is always the priority; assessments serve it.

export interface StepAssessmentNudge {
  /** Assessment IDs relevant to this step */
  assessmentIds: string[];
  /** Whether these are couple-only assessments (hidden for solo users) */
  coupleOnly?: boolean;
  /** Whether this is a retake invitation (step 11/12) */
  isRetake?: boolean;
  /** Warm invitation text — NEVER "you need to take this" */
  nudgeText: string;
  /** Short CTA label for the button */
  ctaLabel: string;
}

/**
 * STEP_ASSESSMENT_NUDGES — Which assessments deepen which steps.
 *
 * These appear as gentle invitation cards on the step-detail screen
 * when the relevant assessments haven't been completed (or when
 * it's a retake step like 11 or 12).
 *
 * Rules:
 *   - Never blocks step progression
 *   - Never says "you need to" or "you should"
 *   - Retake nudges always show (even if done before)
 *   - Couple assessments hidden for solo users
 */
export const STEP_ASSESSMENT_NUDGES: Record<number, StepAssessmentNudge> = {
  1: {
    assessmentIds: ['ecr-r'],
    nudgeText:
      'This step comes alive when you understand your attachment pattern. ' +
      'Knowing how you reach for connection \u2014 or pull away \u2014 illuminates the dance.',
    ctaLabel: 'Explore Your Pattern',
  },
  2: {
    assessmentIds: ['dsi-r'],
    nudgeText:
      'Understanding your boundaries illuminates how you hold space for trust. ' +
      'Your differentiation pattern shapes what safety looks like for you.',
    ctaLabel: 'Explore Your Boundaries',
  },
  3: {
    assessmentIds: ['ipip-neo-120'],
    nudgeText:
      'Your personality patterns reveal how you hold on \u2014 and how you might let go. ' +
      'Seeing these tendencies makes releasing certainty feel less like loss.',
    ctaLabel: 'See Your Patterns',
  },
  4: {
    assessmentIds: ['sseit', 'ipip-neo-120'],
    nudgeText:
      'Your emotional intelligence and personality shape how you show up in this step. ' +
      'Understanding what drives your protective moves deepens the work here.',
    ctaLabel: 'Deepen Your Self-Knowledge',
  },
  5: {
    assessmentIds: ['rdas', 'dci', 'csi-16'],
    coupleOnly: true,
    nudgeText:
      'This is a milestone step \u2014 seeing the relationship together. ' +
      'Taking these assessments as a couple reveals how you each experience the space between you.',
    ctaLabel: 'See the Relationship Together',
  },
  6: {
    assessmentIds: ['dutch'],
    nudgeText:
      'Seeing your conflict patterns can help dissolve the enemy story. ' +
      'When you understand how you fight, you stop fighting each other and start seeing the dance.',
    ctaLabel: 'See Your Conflict Style',
  },
  7: {
    assessmentIds: ['sseit'],
    nudgeText:
      'Your emotional awareness shapes how you extend the invitation. ' +
      'Knowing what you feel \u2014 and how you express it \u2014 makes reaching more genuine.',
    ctaLabel: 'Deepen Your Awareness',
  },
  8: {
    assessmentIds: ['values'],
    nudgeText:
      'Your values compass guides the new patterns you\u2019re building. ' +
      'Knowing what matters most helps you design responses that feel like you.',
    ctaLabel: 'Find Your Values Compass',
  },
  9: {
    assessmentIds: ['dutch', 'dsi-r'],
    nudgeText:
      'Conflict and boundary patterns are the raw material of repair. ' +
      'Understanding how you navigate disagreement makes repair more skillful.',
    ctaLabel: 'Map Your Repair Landscape',
  },
  10: {
    assessmentIds: ['values'],
    nudgeText:
      'Your values compass points toward the rituals that will last. ' +
      'When daily practices align with what matters most, they become self-sustaining.',
    ctaLabel: 'Ground Your Rituals',
  },
  11: {
    assessmentIds: ['ecr-r'],
    isRetake: true,
    nudgeText:
      'Curious how your attachment pattern has shifted? ' +
      'Retaking this assessment reveals growth you can\u2019t see from inside the journey.',
    ctaLabel: 'See How You\u2019ve Shifted',
  },
  12: {
    assessmentIds: ['ecr-r', 'sseit', 'ipip-neo-120', 'dutch', 'dsi-r', 'values'],
    isRetake: true,
    nudgeText:
      'The journey spirals. Retaking your assessments now shows how far you\u2019ve come \u2014 ' +
      'the delta between then and now is your evidence of growth.',
    ctaLabel: 'Measure Your Growth',
  },
};

/**
 * Get the assessment nudge for a specific step, if one exists.
 * Returns null for steps without nudges (most steps).
 */
export function getStepAssessmentNudge(stepNumber: number): StepAssessmentNudge | null {
  return STEP_ASSESSMENT_NUDGES[stepNumber] ?? null;
}

// ─── Step-Assessment Gate Mapping ────────────────────────
// Hard gates that BLOCK step completion until required
// assessments are finished. Unlike nudges, these are mandatory.

export interface StepAssessmentGate {
  /** Assessment IDs that must ALL be completed */
  assessmentIds: string[];
  /** Gate only applies to coupled users (solo users pass freely) */
  coupleOnly?: boolean;
  /** Warm but firm explanation of why this gate exists */
  gateText: string;
  /** CTA button label */
  ctaLabel: string;
}

export const STEP_ASSESSMENT_GATES: Record<number, StepAssessmentGate> = {
  4: {
    assessmentIds: ['ecr-r', 'ipip-neo-120', 'sseit', 'dutch', 'dsi-r', 'values'],
    gateText:
      'This step asks you to examine your part in the dance. ' +
      'To do that well, you need a complete picture of yourself. ' +
      'Complete your remaining assessments to continue.',
    ctaLabel: 'Complete Your Assessments',
  },
  6: {
    assessmentIds: ['rdas', 'dci', 'csi-16'],
    coupleOnly: true,
    gateText:
      'Releasing the enemy story works best when you can see the relationship together. ' +
      'Complete your couple assessments to continue.',
    ctaLabel: 'Take Couple Assessments',
  },
};

/**
 * Get the assessment gate for a specific step, if one exists.
 */
export function getStepAssessmentGate(stepNumber: number): StepAssessmentGate | null {
  return STEP_ASSESSMENT_GATES[stepNumber] ?? null;
}
