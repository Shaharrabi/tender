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

import type { HealingStep, HealingPhase, IntegrationInsight } from '@/types/growth';
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
    integrationInsights: [
      {
        domains: ['foundation', 'navigation'],
        title: 'When Your Alarm System Meets Your Radar',
        insight: 'Your attachment style is essentially your nervous system\'s alarm system — it decides what feels dangerous before you even think about it. Your emotional intelligence is the radar that picks up signals from your partner. When anxious attachment meets low emotional perception, you feel the alarm but can\'t read the signal clearly, so you escalate. When avoidant attachment meets high emotional perception, you actually sense everything — you just learned to shut the alarm off. As Sue Johnson writes, "The drama of love is all about this dance of seeking and finding emotional connection." Understanding which alarm-radar combination you carry is the first step to seeing your pattern without shame.',
        microPractice: 'This week: When you feel the alarm go off (heart racing, stomach tightening, jaw clenching), pause and ask yourself: "What signal am I actually picking up from my partner right now?" Write down the alarm and the signal separately.',
      },
      {
        domains: ['foundation', 'conflict', 'stance'],
        title: 'The Attachment-Conflict Cascade',
        insight: 'Here is something most couples never realize: your conflict style is not a personality trait — it is your attachment system\'s battle strategy. The person who accommodates learned that their needs were dangerous to express. The person who dominates learned that vulnerability was never safe. Gottman\'s research shows that 69% of couple conflicts are perpetual — they never get "solved." But they become gridlocked only when attachment insecurity turns disagreement into a threat to the bond itself. Your differentiation level determines whether you can stay present in that threat or whether you fuse with your partner\'s emotions or cut off entirely.',
        microPractice: 'This week: During a disagreement, notice which comes first — the conflict behavior (withdrawing, criticizing, accommodating) or the attachment fear (abandonment, engulfment, inadequacy). Name it silently: "There\'s my fear of ___ driving my move to ___."',
      },
      {
        domains: ['instrument', 'field'],
        title: 'Your Personality as a Lens on the Field',
        insight: 'Jung wrote, "Until you make the unconscious conscious, it will direct your life and you will call it fate." Your Big Five personality traits are the lens through which you perceive the relational field — the living space between you and your partner. High neuroticism narrows the lens, making threats seem larger and safety seem smaller. High agreeableness can blur the lens, making you see harmony where there is actually suppression. Low openness can freeze the lens, preventing you from seeing new possibilities in old patterns. The field between you is always transmitting — but your personality determines what you receive.',
        microPractice: 'This week: Ask yourself, "Is the field actually tense right now, or is my personality amplifying something small?" Check with your partner: "How are you experiencing the space between us right now?"',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['field', 'foundation', 'navigation'],
        title: 'The Field Is Real — Your Nervous Systems Prove It',
        insight: 'Polyvagal theory reveals something couples intuitively know but rarely articulate: your nervous systems are in constant dialogue, beneath words, beneath conscious awareness. Stephen Porges calls this "neuroception" — your body\'s below-awareness detection of safety or danger. The relational field is not a metaphor; it is the real-time co-regulation happening between two nervous systems. When your attachment system is secure, you broadcast safety signals that your partner\'s vagus nerve picks up. When it is activated, you broadcast threat — and your partner\'s emotional intelligence determines whether they can read that broadcast accurately or whether they misinterpret your fear as hostility.',
        microPractice: 'This week: Sit facing your partner for two minutes in silence. Notice what your body does — does it settle or tighten? That is the field speaking through your nervous system. Share what you noticed afterward.',
      },
      {
        domains: ['compass', 'field'],
        title: 'Values as the Field\'s North Star',
        insight: 'Rumi wrote, "Out beyond ideas of wrongdoing and rightdoing, there is a field. I\'ll meet you there." The relational field becomes trustworthy when both partners orient toward shared values rather than individual rightness. ACT therapy teaches that values are not goals you achieve but directions you walk toward. When a couple discovers that they share a deep value — say, honesty or growth — the field gains a kind of gravitational center. Conflicts stop being battles about who is right and become collaborative navigations: "We both value honesty. How do we live that together right now, even though we see this situation differently?"',
        microPractice: 'This week: Name one value you believe you share with your partner. Ask them to name one they believe you share. See where you overlap — and where the surprise is.',
      },
      {
        domains: ['instrument', 'foundation'],
        title: 'Why Your Partner\'s Personality Feels Like a Threat (And Isn\'t)',
        insight: 'Here is a pattern that derails millions of couples: you mistake your partner\'s personality for a relational wound. Their introversion feels like withdrawal. Their conscientiousness feels like criticism. Their openness feels like instability. But as James Hillman argued, "The soul doesn\'t want to be fixed — it wants to be seen." Your partner\'s Big Five traits are not strategies designed to hurt you. They are the instrument through which their soul expresses itself. When your attachment system is activated, you cannot see their personality clearly — you see only the threat. Trusting the field means learning to see your partner\'s instrument as music, not noise.',
        microPractice: 'This week: Identify one personality trait of your partner\'s that triggers your attachment alarm. Reframe it: "Their [trait] is not about me. It is how they are built. What would it mean to appreciate this instead of fear it?"',
      },
      {
        domains: ['stance', 'field'],
        title: 'Differentiation: The Paradox of "We"',
        insight: 'David Schnarch wrote that differentiation is "your ability to maintain your sense of self when you are emotionally or physically close to others — especially as they become increasingly important to you." Here is the paradox of the relational field: you can only trust the "we" to the degree that you can hold onto your "I" within it. Undifferentiated partners do not actually merge — they oscillate between fusion and emotional cutoff, never truly meeting. The field comes alive not when two people become one, but when two distinct selves choose to remain present to each other. That is what makes the space between you sacred rather than suffocating.',
        microPractice: 'This week: Notice one moment where you lost yourself in your partner\'s emotional state (fusion) or one moment where you cut off to protect yourself (cutoff). What would "staying you while staying close" have looked like instead?',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['instrument', 'navigation', 'stance'],
        title: 'The Certainty Trap: How Personality Hardens Stories',
        insight: 'Low openness in the Big Five creates a cognitive style that favors certainty — familiar interpretations feel safe, novel perspectives feel threatening. When this combines with low emotional perception (not reading your partner\'s actual emotional state), you end up responding to the story you wrote about your partner rather than the person in front of you. Pema Chodron teaches that "the root of suffering is resisting the certainty that no matter what the circumstances, uncertainty is all we really have." Differentiation is what allows you to hold your story lightly enough to let your partner surprise you. Without it, you will always prefer the comfort of your narrative over the discomfort of their reality.',
        microPractice: 'This week: Catch yourself telling a story about your partner\'s motivation ("They did that because they don\'t care"). Replace it with a question: "I noticed you did X. What was going on for you?" Listen to the answer as if hearing them for the first time.',
      },
      {
        domains: ['foundation', 'conflict'],
        title: 'Attachment Stories Become Conflict Scripts',
        insight: 'Your attachment style writes a script for conflict before the conflict even begins. Anxious attachment writes: "They will leave, so I must escalate to be heard." Avoidant attachment writes: "They will overwhelm me, so I must withdraw to survive." These scripts become self-fulfilling prophecies — the anxious partner\'s escalation triggers the avoidant partner\'s withdrawal, which confirms the anxious partner\'s fear. Gottman calls this "absorbing state" — a conflict pattern so powerful it overrides all other relational data. Releasing certainty means recognizing that your conflict script was written by a younger version of you who needed protection. The question is whether that script still serves the relationship you are trying to build now.',
        microPractice: 'This week: Before your next disagreement, write down what you expect will happen. After, compare your prediction with what actually happened. Where was the script accurate? Where was it wrong?',
      },
      {
        domains: ['compass', 'stance'],
        title: 'When Values Become Weapons',
        insight: 'There is a shadow side to values that few therapists name directly: values can become certainty traps. "I value honesty" can become "I have the right to say anything I want, regardless of impact." "I value loyalty" can become "You must never disagree with me." Jung called this enantiodromia — the tendency of any principle, taken to its extreme, to flip into its opposite. Your differentiation level determines whether you can hold your values as living, breathing orientations or whether they calcify into rigid rules you use to judge your partner. As Brene Brown writes, "Clear is kind. Unclear is unkind." But certainty is not clarity — it is the refusal to stay in the discomfort of not knowing.',
        microPractice: 'This week: Identify one value you hold strongly. Ask yourself: "Have I ever used this value as a weapon? Have I ever used it to end a conversation instead of opening one?" Share your reflection with your partner.',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['foundation', 'stance', 'navigation'],
        title: 'The Parts Beneath the Pattern',
        insight: 'IFS therapy reveals that what looks like "your part in the problem" is actually a constellation of protective parts, each with its own logic. Your attachment style determines which protectors show up first — anxious attachment activates the Pursuer, who floods with emotion to maintain connection; avoidant attachment activates the Firefighter, who numbs or distracts to escape overwhelm. Your emotional intelligence determines whether you can even detect these parts before they take over. As Richard Schwartz writes, "There are no bad parts." Your protectors developed in response to real threats. The work of this step is not to silence them but to understand what they are protecting — and to discover the exiled vulnerability underneath.',
        microPractice: 'This week: When you notice yourself doing "your thing" in a conflict, pause and ask internally: "Which part just took over? What is it protecting? What is it afraid will happen if it stops?" Write a brief letter to that part, thanking it for its service.',
      },
      {
        domains: ['instrument', 'conflict'],
        title: 'Your Personality\'s Shadow in Conflict',
        insight: 'Jung taught that the shadow is not evil — it is simply the part of yourself you have refused to see. Your Big Five profile creates both your gifts and your shadows. High agreeableness shadows into conflict avoidance and resentment that builds silently. High conscientiousness shadows into rigidity and contempt for your partner\'s "messiness." Low neuroticism shadows into emotional dismissiveness — "I don\'t see why you\'re so upset." Your conflict style is often the behavioral expression of your personality\'s shadow. The person who accommodates may be living in the shadow of their agreeableness. The person who dominates may be living in the shadow of their low agreeableness. Examining your part means examining which personality gifts have become relational liabilities.',
        microPractice: 'This week: Name your top personality strength. Then ask: "What is the shadow of this strength? How does it show up when I am stressed or threatened in my relationship?" Ask your partner if they recognize this shadow.',
      },
      {
        domains: ['navigation', 'compass', 'field'],
        title: 'Emotional Inheritance and Value Wounds',
        insight: 'The values you hold most fiercely often point to your deepest emotional wounds. Someone who is passionate about fairness may have been treated unfairly as a child. Someone who insists on independence may have been controlled. Your emotional intelligence in this area — your ability to use emotions as information — is what determines whether you recognize the wound driving the value or whether you simply feel righteous. As James Hillman wrote, "The wound is the place where the Light enters you." In the relational field, examining your part means seeing how your values-driven reactions create impact on your partner that you never intended. Your emotional inheritance is not your fault. But it is your responsibility.',
        microPractice: 'This week: Choose your most deeply held value. Trace it backward: "When did I first learn this value mattered? What happened that made it essential?" Share the origin story with your partner.',
      },
      {
        domains: ['conflict', 'foundation'],
        title: 'The Horseman You Ride Without Knowing',
        insight: 'Gottman identified four conflict behaviors that predict relationship failure with 93% accuracy: criticism, contempt, defensiveness, and stonewalling. But here is what most people miss — each horseman maps directly to an attachment strategy. Criticism is the anxious partner\'s attempt to be heard when bids have been missed too many times. Stonewalling is the avoidant partner\'s nervous system shutting down under emotional flooding. Defensiveness is the disorganized partner\'s attempt to manage contradictory impulses to approach and flee simultaneously. Contempt — the most destructive — emerges when attachment wounds have calcified into resentment over time. Knowing your horseman is knowing your attachment system\'s emergency broadcast.',
        microPractice: 'This week: Identify your primary horseman. Then trace it to its attachment root: "I criticize because I am afraid of ___. I stonewall because I am overwhelmed by ___." Share this with your partner as a vulnerability, not a justification.',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['foundation', 'navigation', 'field'],
        title: 'Vulnerability Is a Nervous System Event',
        insight: 'When Sue Johnson describes the "Hold Me Tight" conversation, she is describing something that happens in the body before it happens in words. Sharing your truth requires your ventral vagal system to be online — the part of your nervous system that enables social engagement, eye contact, and vocal prosody. If you are in sympathetic activation (fight-or-flight) or dorsal vagal shutdown (freeze-collapse), you literally cannot be vulnerable; your neurobiology will not allow it. Your emotional intelligence determines whether you can sense when your partner\'s nervous system is ready to receive your truth. The relational field either holds you or drops you in these moments, and you can feel the difference in your body before either of you speaks a word.',
        microPractice: 'This week: Before sharing something vulnerable, check in with your body first. Place a hand on your chest. If your heart is racing or your throat is tight, co-regulate first — breathe together, hold hands, make eye contact — before sharing. The body must feel safe before the truth can travel.',
      },
      {
        domains: ['stance', 'foundation'],
        title: 'The Differentiation Paradox of Disclosure',
        insight: 'Schnarch identified a profound paradox: true intimacy requires differentiation. You can only share your deepest truth when you can tolerate the possibility that your partner may not respond the way you need. Anxious attachment makes disclosure feel desperate — "If I tell you, you must validate me immediately or I will fall apart." Avoidant attachment makes disclosure feel impossible — "If I show you my insides, you will have too much power over me." The differentiated self can say, as Rilke wrote, "I want to unfold. I don\'t want to stay folded anywhere, because where I am folded, there I am a lie." This is the courage of self-validated intimacy: sharing not because you need your partner to complete you, but because hiding diminishes you.',
        microPractice: 'This week: Share one truth with your partner that you have been holding back. Before sharing, silently tell yourself: "I am sharing this because it is true and it matters, not because I need a specific response." Notice what shifts when you release the outcome.',
      },
      {
        domains: ['instrument', 'compass'],
        title: 'What Your Personality Won\'t Let You Say',
        insight: 'Your Big Five profile creates a truth-telling fingerprint. High agreeableness suppresses truths that might create conflict — you swallow your needs to keep the peace until resentment poisons the well. Low openness suppresses truths that feel too abstract or emotional — "I can\'t put it into words" becomes "It doesn\'t matter." High neuroticism can make every truth feel catastrophic, so you either blurt everything in a flood or say nothing at all. Your values system adds another layer: if you value loyalty, you may silence truths that feel disloyal. If you value strength, you may silence truths that feel weak. As Brene Brown writes, "Vulnerability is not about winning or losing. It\'s having the courage to show up when you can\'t control the outcome."',
        microPractice: 'This week: Complete this sentence and share it with your partner: "Something true about me that my personality makes hard to say is ___." Notice which part of your personality resisted — was it the peacekeeper, the stoic, the worrier, or the loyalist?',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['foundation', 'navigation', 'conflict'],
        title: 'The Enemy Story Is an Attachment Fever Dream',
        insight: 'When your attachment system is fully activated, your partner is no longer a person — they become a threat. Your emotional perception narrows dramatically under stress (what neuroscientists call "amygdala hijack"), and you begin to read neutral expressions as hostile, ambiguous tones as contemptuous, and ordinary human imperfection as deliberate cruelty. Your conflict style then kicks in as the defense strategy against this hallucinated enemy. Sue Johnson calls this "demon dialogue" — the cycle where both partners are fighting phantoms of each other rather than the real person. Releasing the enemy story requires your emotional intelligence to come back online, which only happens when your nervous system drops below the flooding threshold. You cannot think your way out of an enemy story. You must calm your way out.',
        microPractice: 'This week: When you notice the enemy story activating ("They always..." "They never..."), place both feet on the floor and take five slow breaths. Then ask: "Is this my partner, or is this my attachment system\'s version of my partner?" Wait until the fever breaks before responding.',
      },
      {
        domains: ['instrument', 'stance'],
        title: 'How Personality Differences Become Character Indictments',
        insight: 'One of the most destructive things couples do is pathologize personality differences. Your partner\'s introversion becomes "emotional unavailability." Your partner\'s spontaneity becomes "irresponsibility." Your partner\'s sensitivity becomes "being too much." Jung called this projecting the shadow — we reject in our partner the qualities we have rejected in ourselves. A highly conscientious person may carry contempt for their partner\'s flexibility because they secretly long for the permission to be less rigid. A highly open person may dismiss their partner\'s need for structure because they fear what would happen if they slowed down. Differentiation is the capacity to honor your partner\'s instrument without needing it to play your song.',
        microPractice: 'This week: Name one trait of your partner\'s that irritates you. Then honestly ask: "Is this actually harmful, or is it just different from me? And what would it mean if I let them be different without making it wrong?"',
      },
      {
        domains: ['compass', 'field', 'foundation'],
        title: 'The Dream Beneath the Gridlock',
        insight: 'Gottman discovered that behind every perpetual conflict lies an unfulfilled dream — a deeply held value or life aspiration that the partner experiences as being blocked. When you release the enemy story, you begin to see that your partner\'s frustrating position is not stubbornness but the expression of something sacred to them. Their insistence on saving money may carry a childhood dream of security they never had. Their desire for adventure may express a value of aliveness that feels essential to their soul. The relational field transforms when both partners shift from "You are blocking me" to "Tell me about the dream underneath your position." As Rumi writes, "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it."',
        microPractice: 'This week: Choose your most persistent disagreement. Ask your partner: "What is the dream underneath your position? What does this represent for you that goes beyond this specific issue?" Listen without defending your own position.',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['foundation', 'instrument', 'field'],
        title: 'Rituals That Rewire Your Attachment System',
        insight: 'Neuroscience has confirmed what contemplatives have known for millennia: repeated practice physically changes the brain. When you establish daily rituals of connection — a six-second kiss, a stress-reducing conversation, a bedtime gratitude exchange — you are literally building new neural pathways that compete with your old attachment programming. Your personality determines which rituals will feel natural and which will require stretch. An introverted partner may thrive with quiet parallel presence; an extraverted partner may need face-to-face verbal connection. Neither is wrong. The field between you strengthens not when you practice the "right" ritual but when you practice consistently in ways that honor both instruments. As the Zen saying goes, "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water."',
        microPractice: 'This week: Choose one small ritual that honors your personality and one that stretches it. Practice both daily. Notice which feels nourishing and which feels effortful — both are building new wiring.',
      },
      {
        domains: ['compass', 'conflict', 'stance'],
        title: 'Values-Aligned Practice vs. Avoidance in Disguise',
        insight: 'There is a trap in relational practice that therapists call "spiritual bypassing" or what ACT calls "experiential avoidance dressed as acceptance." A couple might establish a nightly check-in ritual that actually serves to manage anxiety rather than build connection. An accommodating conflict style can masquerade as "being flexible." A partner who is low in differentiation might practice "turning toward" as a way to fuse rather than connect. The test is simple: does this practice bring you closer to your values, or does it help you avoid discomfort? As Pema Chodron teaches, "The most fundamental aggression to ourselves, the most fundamental harm we can do to ourselves, is to remain ignorant by not having the courage and the respect to look at ourselves honestly and gently." Practice with honesty. Practice with courage. Do not practice to perform.',
        microPractice: 'This week: Review your current relational practices. For each one, honestly ask: "Am I doing this to connect, or am I doing this to avoid something uncomfortable?" If the answer is avoidance, name what you are avoiding.',
      },
      {
        domains: ['navigation', 'foundation'],
        title: 'Reading the Bid Behind the Behavior',
        insight: 'Gottman\'s research on bids for connection reveals that couples who thrive turn toward each other\'s bids 86% of the time, while couples who divorce turn toward only 33% of the time. But here is the integration insight that changes everything: your emotional intelligence determines whether you can even detect a bid, and your attachment style determines whether you interpret it as an invitation or a demand. An avoidantly attached partner with low emotional perception will miss bids entirely — their partner\'s "How was your day?" registers as noise, not as a hand reaching across the gap. An anxiously attached partner with high emotional perception may detect every bid but respond with such intensity that the partner feels overwhelmed rather than met. The practice is not just turning toward — it is learning to calibrate your response to match the bid.',
        microPractice: 'This week: Track your partner\'s bids for three days. For each one, note: (1) What was the bid? (2) Did I detect it in the moment? (3) How did I respond? (4) What response would have matched the bid\'s actual size and need?',
      },
      {
        domains: ['stance', 'field'],
        title: 'The Discipline of Showing Up Differentiated',
        insight: 'Commitment to practice requires a specific kind of psychological muscle: the ability to show up for your partner without losing yourself, day after day, even when it is not reciprocated in the moment. This is differentiation in action — not as a concept but as a daily discipline. Schnarch calls this "holding on to yourself" — maintaining your own emotional center while remaining emotionally available to your partner. The relational field deepens not through grand gestures but through what Rilke called "the love that consists in this: that two solitudes protect and border and greet each other." Your practice is not about becoming your partner\'s emotional caretaker. It is about becoming a steady, differentiated presence that the field can organize around.',
        microPractice: 'This week: Choose one practice you will do regardless of your partner\'s mood, response, or participation. Do it as an expression of your values, not as a bid for reciprocity. Notice what shifts in you when you practice for its own sake.',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['foundation', 'conflict', 'navigation'],
        title: 'Why Repair Terrifies Your Attachment System',
        insight: 'Preparing to repair harm activates the deepest layer of your attachment programming. For the anxiously attached, repair feels urgent — they want to rush in, fix it now, hear "it\'s okay" before the wound has even been fully witnessed. For the avoidantly attached, repair feels like walking into a minefield — acknowledging harm means acknowledging vulnerability, which their system has spent a lifetime defending against. Your emotional intelligence here serves a critical function: it determines whether you can accurately sense your partner\'s readiness for repair or whether you project your own timeline onto them. As Sue Johnson teaches, "Emotional injuries need emotional healing." The preparation is not about scripting the right words. It is about getting your nervous system regulated enough to truly show up for the conversation your partner needs to have.',
        microPractice: 'This week: Think of one unresolved hurt between you. Without bringing it up yet, journal about it: "What is my attachment system\'s impulse around this repair? Rush in? Avoid? How does my partner\'s readiness actually seem, separate from my own urgency or avoidance?"',
      },
      {
        domains: ['compass', 'stance', 'field'],
        title: 'The Values Required for Genuine Repair',
        insight: 'Genuine repair requires a specific constellation of values held in tension: honesty without cruelty, accountability without self-flagellation, empathy without losing your own perspective. Your differentiation level determines whether you can hold this tension or whether you collapse into one pole — all empathy (losing yourself) or all self-protection (losing your partner). The relational field during repair is exquisitely sensitive; both partners can feel whether the repair is genuine or performative. As Brene Brown writes, "Accountability is a prerequisite for meaningful change, but shame is not." The values you bring to repair — courage, humility, patience — are not strategies. They are the bedrock that makes the field safe enough for the wound to finally breathe.',
        microPractice: 'This week: Name the value that is hardest for you to hold during repair (honesty? humility? patience?). Sit with why it is hard. What does your history tell you about what happened when you practiced that value before?',
      },
      {
        domains: ['instrument', 'conflict'],
        title: 'Your Personality\'s Repair Signature',
        insight: 'Your Big Five profile creates a distinctive repair signature — a default way you approach (or avoid) making things right. High agreeableness repairs through accommodation, which can look generous but may skip genuine accountability: "I\'ll just give them what they want." Low agreeableness repairs through problem-solving, which can feel dismissive: "Here\'s how we fix it" before the hurt has been felt. High neuroticism repairs through emotional flooding — the apology becomes about your guilt rather than their pain. High conscientiousness repairs through perfectionism — crafting the "right" apology instead of the real one. DBT teaches that effective repair requires the middle path between emotional mind and reasonable mind. Your personality pulls you toward one side. Knowing your signature means you can consciously move toward what the moment actually requires.',
        microPractice: 'This week: Recall your last attempt at repair. Which personality trait drove your approach? What would repair look like if you led with the opposite quality — emotional presence instead of logic, or calm accountability instead of emotional overwhelm?',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['foundation', 'field', 'navigation'],
        title: 'Trust Rebuilds Through the Nervous System, Not the Mind',
        insight: 'Cognitive apologies land in the prefrontal cortex, but trust lives in the limbic system and the vagus nerve. This is why your partner can say "I forgive you" and still flinch when you raise your voice — their thinking brain has updated but their nervous system has not. Rebuilding trust is fundamentally a Polyvagal project: you must provide enough repeated experiences of safety that your partner\'s neuroception recalibrates. Your emotional intelligence serves as the feedback loop — can you sense when your partner\'s nervous system is still on guard, even when their words say otherwise? The relational field carries the accumulated weight of every rupture and every repair. Each genuine repair deposits safety. Each broken promise withdraws it. As Sue Johnson says, "Forgiveness is not an event. It is a process — a series of small steps toward renewed trust."',
        microPractice: 'This week: After a repair conversation, check in with your partner\'s body, not just their words: "I hear you saying it\'s okay. How does your body feel about it — settled or still on guard?" Honor whatever answer comes.',
      },
      {
        domains: ['conflict', 'compass', 'stance'],
        title: 'From Conflict Style to Repair Style',
        insight: 'Your DUTCH conflict style predicts not just how you fight but how you repair — or fail to. Accommodators repair by giving in, which creates a false peace that erodes over time. Avoiders repair by pretending it never happened, which leaves the wound untreated. Dominators repair by declaring the solution, which bypasses the partner\'s experience entirely. Compromisers repair by splitting the difference, which can leave both partners partially unseen. Only problem-solving as a repair mode — when combined with differentiation and values-alignment — creates the conditions for genuine resolution. But here is the deeper truth: real repair often requires you to use a conflict style that is not your default. The avoider must stay present. The dominator must yield. The accommodator must hold their ground. Acting to rebuild trust means acting against your conditioning.',
        microPractice: 'This week: Identify your default repair style. Then deliberately try its opposite in one small moment. If you normally avoid, stay and name the discomfort. If you normally accommodate, state what you actually need. Notice what happens in the field when you show up differently.',
      },
      {
        domains: ['instrument', 'foundation'],
        title: 'Consistency Is the Language Your Partner\'s Attachment System Speaks',
        insight: 'Your partner\'s attachment system does not respond to grand gestures — it responds to pattern recognition. One beautiful date night cannot override months of emotional absence. One vulnerable conversation cannot undo a pattern of defensiveness. The research is clear: trust rebuilds through small, consistent, predictable actions over time. Your Big Five personality determines how natural consistency is for you. High conscientiousness makes follow-through easier but can make it feel mechanical. Low conscientiousness makes spontaneity easy but reliability hard. The integration insight is that trust-building is not a personality trait — it is a practice. As Aristotle wrote and psychologists have confirmed: "We are what we repeatedly do. Excellence, then, is not an act but a habit." Your partner does not need you to be perfect. They need you to be predictable in the ways that matter.',
        microPractice: 'This week: Choose one small trust-building action and do it every single day for seven days. Not something dramatic — something sustainable. A good-morning text. A question about their day. A six-second hug. Consistency over intensity.',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['foundation', 'navigation', 'field'],
        title: 'The Setback Is the Teacher',
        insight: 'Here is what Polyvagal theory teaches about relapse into old patterns: your nervous system has multiple states, and stress, illness, sleep deprivation, or external threat can drop you from ventral vagal (safe and social) back into sympathetic (fight-or-flight) or dorsal vagal (shutdown) in seconds. When this happens, your attachment system reactivates its oldest programming — the anxious partner starts pursuing again, the avoidant partner starts withdrawing again — and it feels like all your growth has evaporated. It has not. Your emotional intelligence is the key difference: you can now detect the shift happening. You can name it: "My nervous system just dropped. I\'m in old programming." The relational field holds a memory of every repair you have made, and that memory is stronger than any single setback. As Pema Chodron writes, "Fail. Fail again. Fail better."',
        microPractice: 'This week: When you catch yourself in an old pattern, celebrate the catching rather than shaming the slipping. Say to your partner: "I notice I just did my old thing. I\'m coming back." Track how quickly you catch yourself — that speed is the real measure of growth.',
      },
      {
        domains: ['compass', 'stance', 'instrument'],
        title: 'Values as Your Compass Through the Fog',
        insight: 'When old patterns resurface, your values system is the compass that keeps you oriented. ACT therapy teaches that values are not destinations but directions — you never "arrive" at kindness or courage; you walk toward them, step by step, forever. Your personality traits determine which values feel accessible under stress and which go offline. High neuroticism can make the value of "calmness" feel unreachable during activation. Low openness can make the value of "growth" feel meaningless when you are scared. Differentiation is what allows you to hold your values even when your emotional weather is stormy — to say, "I am feeling flooded AND I still choose to respond with care." This is what Schnarch calls "the crucible of marriage" — the relationship as a container for becoming the person you most want to be.',
        microPractice: 'This week: Write your three core relational values on a card and keep it where you will see it daily. When you notice a setback, read the card and ask: "Which value can I practice right now, even imperfectly?"',
      },
      {
        domains: ['conflict', 'foundation', 'field'],
        title: 'Perpetual Problems as Ongoing Practice',
        insight: 'Gottman\'s research reveals that 69% of couple conflicts are perpetual — they will never be fully resolved because they arise from fundamental personality differences or core values divergences. This sounds depressing until you realize the reframe: perpetual problems are not evidence of failure. They are the curriculum of your relationship. Your attachment security determines whether you can engage these problems with curiosity or whether each recurrence feels like proof of doom. Your conflict style determines whether you engage productively or destructively. The awareness you are building in this step transforms your perpetual problems from recurring wounds into recurring invitations to practice everything you have learned — regulation, vulnerability, repair, and differentiated presence. As Rilke wrote to a young poet: "Have patience with everything unresolved in your heart and try to love the questions themselves."',
        microPractice: 'This week: Name your most perpetual problem. Instead of trying to solve it, have a 15-minute "dream within the conflict" conversation about it. The goal is not resolution but understanding. End with: "What did I learn about you today that I did not know before?"',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['field', 'navigation', 'foundation'],
        title: 'Listening to the Third Body',
        insight: 'The poet Robert Bly wrote about "the third body" — the entity that exists between two lovers, composed of neither person alone. This is the relational field in its most alive form: not a metaphor but an emergent property of two nervous systems in sustained, attuned contact. Seeking shared insight means developing the capacity to sense this third body — to ask not just "What do I need?" or "What do you need?" but "What does the relationship need right now?" Your emotional intelligence is the organ of perception for this sensing. Your attachment security determines whether you trust what you sense or dismiss it. Jung called this the "transcendent function" — the capacity to hold opposites until something new emerges that neither person could have created alone. The relational field speaks in feelings, dreams, synchronicities, and recurring themes. Learning to listen to it is the most advanced relational skill there is.',
        microPractice: 'This week: At the end of each day, sit quietly with your partner and ask: "If our relationship could speak right now, what would it say it needs?" Do not think — sense. Share whatever image, feeling, or word arises, no matter how strange.',
      },
      {
        domains: ['compass', 'stance', 'field'],
        title: 'Shared Values as Living Architecture',
        insight: 'By this step, your individual values have been tested, refined, and — if you have done the work — woven into something larger: a shared values architecture that gives the relational field its structure. This is not compromise, where both partners sacrifice. It is integration, where individual values are held within a larger container that honors both. Differentiation makes this possible — you can say "This is deeply important to me AND I can hold it alongside what is deeply important to you." Without differentiation, shared values become either imposed values (one partner dominates) or vague values (both partners accommodate until nothing has substance). As James Hillman wrote, "The soul requires beauty as much as it requires truth." Your shared values architecture should be beautiful — not in an aesthetic sense, but in the sense that it reflects something true and alive about who you are becoming together.',
        microPractice: 'This week: Together, create a simple "values architecture" for your relationship: name three values you both hold sacred, and for each one, describe one way you currently live it and one way you want to live it more fully.',
      },
      {
        domains: ['instrument', 'conflict', 'compass'],
        title: 'Your Differences as Complementary Intelligence',
        insight: 'At this stage of the journey, something extraordinary becomes possible: you can begin to see your personality differences and conflict style differences not as problems to manage but as complementary forms of intelligence. The conscientious partner provides structure; the open partner provides possibility. The agreeable partner holds the peace; the direct partner holds the truth. The avoiding partner provides space; the engaging partner provides presence. As Rilke wrote, "Love consists of this: two solitudes that meet, protect, and greet each other." Your differences are not obstacles to shared insight — they are the very source of it. The relationship\'s wisdom is wider than either partner\'s because it contains both perspectives. Seeking shared insight means learning to harvest the intelligence that lives in the tension between your different ways of seeing.',
        microPractice: 'This week: Identify one difference between you and your partner that has been a source of conflict. Reframe it together: "Your [quality] and my [quality] are actually complementary in this way: ___." Name one situation where having both perspectives made you stronger as a couple.',
      },
    ],
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
    integrationInsights: [
      {
        domains: ['foundation', 'stance', 'compass'],
        title: 'The Integrated Self in Love',
        insight: 'You began this journey with an attachment style that operated on autopilot, a differentiation level that either fused you with your partner or cut you off from them, and values that were clear in theory but muddled under pressure. Jung described individuation as "becoming who you already are" — not inventing a new self but uncovering the one that was always there beneath the defenses. Step 12 is about integration in this Jungian sense: your attachment anxiety or avoidance has not vanished, but you have transcended being driven by it. Your differentiation has grown not by eliminating your need for connection but by holding that need alongside your need for selfhood. Your values have been pressure-tested through every conflict and repair, and the ones that survived are truly yours — not inherited, not performative, but lived. As Rilke wrote, "Perhaps all the dragons in our lives are princesses who are only waiting to see us act, just once, with beauty and courage."',
        microPractice: 'This week: Write a letter to the person you were at Step 1. What do you know now about your attachment, your stance, and your values that you did not know then? What dragon turned out to be a princess? Share this letter with your partner.',
      },
      {
        domains: ['field', 'navigation', 'instrument'],
        title: 'From Pattern Recognition to Field Generation',
        insight: 'The journey from Step 1 to Step 12 mirrors what developmental psychologists call the shift from reactive consciousness to generative consciousness. In the early steps, your emotional intelligence helped you detect patterns. Your personality shaped how you responded to them. Your field awareness told you something was happening between you. Now, in Step 12, these same capacities flip from receptive to creative: you do not just sense the relational field, you actively shape it. You do not just respond to emotions, you generate emotional realities through your presence and practices. As Erikson would frame it, you have moved from Intimacy (the capacity to be in relationship) to Generativity (the capacity to create something through relationship that extends beyond yourselves). Your personality — once a source of friction — has become an instrument of creation. Your emotional intelligence — once a survival tool — has become a way of tending the world. Changed people change the world. Not by preaching but by being.',
        microPractice: 'This week: Identify one relationship in your wider life — a friend, family member, or colleague — that could benefit from something you have learned in this journey. Without preaching, model one practice you have learned. Let the ripple begin.',
      },
      {
        domains: ['conflict', 'foundation', 'compass'],
        title: 'The Ongoing Practice of Love',
        insight: 'Step 12 is not a graduation — it is a commencement. As Pema Chodron teaches, "We think that the point is to pass the test or to overcome the problem, but the truth is that things don\'t really get solved. They come together and they fall apart." Your conflict skills, attachment security, and values alignment will all be tested again — by stress, by change, by the ordinary erosion of daily life. The difference is that now you have a map — your map, built from your own data, your own patterns, your own growth. When the old cycle returns (and it will), you will not be starting from zero. You will catch it earlier, name it faster, and return to connection with less shame and more speed. That acceleration is the transformation. Love, as the philosopher Erich Fromm wrote, "is not a sentiment which can be enjoyed by anyone regardless of the level of maturity. All attempts at love are bound to fail unless one tries most actively to develop one\'s total personality." You have been developing your total personality. This is the gift you carry forward.',
        microPractice: 'This week: Create a "relapse plan" together. Write down: "When we notice [your pattern name] starting, the first person to see it says [your code word], and we both [your agreed micro-practice]." Put it somewhere you will both see it. This is not a sign of failure — it is the ultimate sign of maturity.',
      },
      {
        domains: ['instrument', 'field', 'stance'],
        title: 'The Archetype of the Wounded Healer',
        insight: 'Jung wrote extensively about the Wounded Healer archetype — the idea that the very wounds that once crippled you become the source of your capacity to help others. Your personality traits that once created friction in your relationship have been integrated into strengths. Your field awareness that once picked up only threat now senses beauty and possibility. Your differentiation that once manifested as walls or fusion now allows you to be deeply present without losing yourself. The couple that has done this work together becomes what Jung called a "temenos" — a sacred container where transformation happens naturally. You do not need to teach anyone what you have learned. You simply need to live it. As Rumi wrote, "Let the beauty we love be what we do. There are hundreds of ways to kneel and kiss the ground." Your relationship, imperfect and ongoing, is one of those ways.',
        microPractice: 'This week: Together, name one wound you have integrated — one pain that has become a source of wisdom or compassion. Acknowledge it together: "We turned this wound into this gift." Let that acknowledgment be its own celebration.',
      },
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
    assessmentIds: ['tender-personality-60'],
    nudgeText:
      'Your personality patterns reveal how you hold on \u2014 and how you might let go. ' +
      'Seeing these tendencies makes releasing certainty feel less like loss.',
    ctaLabel: 'See Your Patterns',
  },
  4: {
    assessmentIds: ['sseit', 'tender-personality-60'],
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
    assessmentIds: ['ecr-r', 'sseit', 'tender-personality-60', 'dutch', 'dsi-r', 'values'],
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
    assessmentIds: ['ecr-r', 'tender-personality-60', 'sseit', 'dutch', 'dsi-r', 'values'],
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

// ─── Dynamic Step Intro ─────────────────────────────────
//
// Returns a personalized paragraph for key steps based on the user's
// assessment profile. Weaves attachment, conflict style, and
// differentiation data into step-specific language.

interface DynamicStepScores {
  /** ECR-R attachment style */
  attachmentStyle?: string;
  /** ECR-R anxiety score (1-7 scale) */
  ecrAnxiety?: number;
  /** ECR-R avoidance score (1-7 scale) */
  ecrAvoidance?: number;
  /** DUTCH primary conflict style */
  dutchPrimaryStyle?: string;
  /** DSI-R fusionWithOthers subscale normalized (0-100) */
  dsirFusionWithOthers?: number;
  /** DSI-R emotionalCutoff subscale normalized (0-100) */
  dsirEmotionalCutoff?: number;
  /** Cycle position from negative cycle */
  cyclePosition?: string;
}

/**
 * Get a personalized paragraph for the given step based on the user's scores.
 * Returns null for steps without personalization, or when scores are missing.
 *
 * Use this to enhance step intro text with person-specific context.
 */
export function getDynamicStepIntro(
  stepNumber: number,
  userScores: DynamicStepScores
): string | null {
  const {
    attachmentStyle,
    ecrAnxiety = 4.0,
    ecrAvoidance = 4.0,
    dutchPrimaryStyle,
    dsirFusionWithOthers = 50,
    dsirEmotionalCutoff = 50,
    cyclePosition,
  } = userScores;

  const isAnxious  = ecrAnxiety > 4.0
    || attachmentStyle === 'anxious-preoccupied'
    || cyclePosition === 'pursuer';
  const isAvoidant = ecrAvoidance > 4.0
    || attachmentStyle === 'dismissive-avoidant'
    || attachmentStyle === 'fearful-avoidant'
    || cyclePosition === 'withdrawer';

  switch (stepNumber) {
    case 1: // Acknowledge the Strain
      if (isAnxious) {
        return "Presence is harder when your nervous system is scanning for distance. This step is about learning to feel safe in the present moment — not by eliminating your anxiety, but by giving it something solid to rest on.";
      }
      if (isAvoidant) {
        return "Presence is harder when closeness feels like too much. This step isn't about forcing openness — it's about expanding your window of comfort, one degree at a time.";
      }
      return null;

    case 4: // Examine Our Part — based on DUTCH style
      if (dutchPrimaryStyle === 'avoiding') {
        return "Your default is to step away from conflict. In this step, we'll practice staying — not to fight, but to be present with what's uncomfortable.";
      }
      if (dutchPrimaryStyle === 'forcing') {
        return "Your default is to press your point. In this step, we'll practice softening — not to lose your voice, but to make room for another voice alongside it.";
      }
      if (dutchPrimaryStyle === 'yielding') {
        return "You give in to keep the peace. In this step, we'll practice finding and expressing your actual position — not to create conflict, but to be fully present in it.";
      }
      return null;

    case 6: // Release Enemy Story — based on DSI-R differentiation
      if (dsirFusionWithOthers > 70) {
        return "Your boundaries tend to dissolve in closeness. That's not weakness — it's love without a container. This step builds the container.";
      }
      if (dsirEmotionalCutoff > 70) {
        return "Your boundaries are strong — maybe too strong. This step isn't about building walls higher. It's about adding doors.";
      }
      return null;

    case 8: // Prepare to Repair — based on attachment + conflict combo
      if (isAnxious && dutchPrimaryStyle === 'forcing') {
        return "Your repair instinct is to pursue harder. In this step, you'll learn to repair by stepping back — which feels wrong to your system but is exactly what creates the space for your partner to come toward you.";
      }
      if (isAvoidant && (dutchPrimaryStyle === 'avoiding' || !dutchPrimaryStyle)) {
        return "Repair requires re-engagement — the very thing your system wants to avoid. In this step, you'll practice making small moves toward reconnection, even when it feels unnecessary.";
      }
      return null;

    default:
      return null;
  }
}
