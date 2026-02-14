/**
 * Micro-Course Lesson Content
 *
 * All 30 lessons across 6 micro-courses, transcribed from
 * TENDER_MICROCOURSE_CONTENT.md. Each lesson has:
 *   - Read section (psychoeducation / framing)
 *   - Exercise section (reflection, identification, behavioral experiment)
 *   - Reflection prompt (1-2 sentence completion, stored for Nuance)
 *   - Attachment variants where content differs (MC1 primarily)
 *
 * Voice: warm, direct, never clinical, never pathologizing.
 * Second person. Short paragraphs. Body as anchor.
 */

import type { AttachmentStyle } from '@/types';

// ─── Types ──────────────────────────────────────────────

export type LessonType =
  | 'psychoeducation'
  | 'reflection'
  | 'perspective-taking'
  | 'behavioral-experiment'
  | 'commitment'
  | 'couple-exercise'
  | 'skill-building'
  | 'reframe'
  | 'mindfulness'
  | 'identification';

export interface MicroCourseLesson {
  id: string;
  courseId: string;
  lessonNumber: number;
  title: string;
  type: LessonType;
  durationMinutes: number;
  /** Universal read section */
  readContent: string;
  /** Anxious-specific read variant (if different from universal) */
  readContentAnxious?: string;
  /** Avoidant-specific read variant */
  readContentAvoidant?: string;
  /** Universal exercise instructions */
  exerciseContent: string;
  /** Anxious-specific exercise variant */
  exerciseContentAnxious?: string;
  /** Avoidant-specific exercise variant */
  exerciseContentAvoidant?: string;
  /** The sentence-completion reflection prompt */
  reflectionPrompt: string;
  /** Commitment template for anxious users (MC1 L5) */
  commitmentTemplateAnxious?: string;
  /** Commitment template for avoidant users (MC1 L5) */
  commitmentTemplateAvoidant?: string;
}

export interface ResolvedLessonContent {
  readContent: string;
  exerciseContent: string;
  reflectionPrompt: string;
  commitmentTemplate?: string;
}

// ─── Helpers ────────────────────────────────────────────

/**
 * Get all lessons for a course, ordered by lesson number.
 */
export function getLessonsForCourse(courseId: string): MicroCourseLesson[] {
  return ALL_LESSONS.filter((l) => l.courseId === courseId).sort(
    (a, b) => a.lessonNumber - b.lessonNumber
  );
}

/**
 * Get a specific lesson.
 */
export function getLesson(
  courseId: string,
  lessonNumber: number
): MicroCourseLesson | undefined {
  return ALL_LESSONS.find(
    (l) => l.courseId === courseId && l.lessonNumber === lessonNumber
  );
}

/**
 * Resolve lesson content for a given attachment style.
 * Falls back to universal content when no variant exists.
 */
export function getLessonContent(
  lesson: MicroCourseLesson,
  attachmentStyle?: AttachmentStyle
): ResolvedLessonContent {
  const isAnxious = attachmentStyle === 'anxious-preoccupied';
  const isAvoidant = attachmentStyle === 'dismissive-avoidant';

  return {
    readContent: isAnxious && lesson.readContentAnxious
      ? lesson.readContentAnxious
      : isAvoidant && lesson.readContentAvoidant
        ? lesson.readContentAvoidant
        : lesson.readContent,
    exerciseContent: isAnxious && lesson.exerciseContentAnxious
      ? lesson.exerciseContentAnxious
      : isAvoidant && lesson.exerciseContentAvoidant
        ? lesson.exerciseContentAvoidant
        : lesson.exerciseContent,
    reflectionPrompt: lesson.reflectionPrompt,
    commitmentTemplate: isAnxious
      ? lesson.commitmentTemplateAnxious
      : isAvoidant
        ? lesson.commitmentTemplateAvoidant
        : undefined,
  };
}

// ═══════════════════════════════════════════════════════════
//  MC1: UNDERSTANDING YOUR ATTACHMENT PATTERN
//  Placement: End of Seeing phase
//  Prerequisites: ECR-R complete
// ═══════════════════════════════════════════════════════════

const MC1_LESSONS: MicroCourseLesson[] = [
  {
    id: 'mc-attachment-101-lesson-1',
    courseId: 'mc-attachment-101',
    lessonNumber: 1,
    title: 'Where Your Pattern Came From',
    type: 'psychoeducation',
    durationMinutes: 5,
    readContent:
      'Before you were in this relationship, before you were an adult, you were a small person learning one of the most important lessons of your life: what happens when I need someone?\n\n' +
      'If the people around you were mostly warm and consistent, your nervous system learned: reaching out works. People come. I can count on this. That became a pattern \u2014 a blueprint your body carries into every relationship you enter.\n\n' +
      'If the people around you were sometimes there and sometimes not \u2014 loving one moment, distracted or overwhelmed the next \u2014 your nervous system learned something different: connection is possible but unreliable. I need to watch carefully. I need to make sure it does not disappear.\n\n' +
      'If the people around you were emotionally distant, uncomfortable with your needs, or simply not equipped to meet them, your nervous system learned: I am safest when I handle things alone. Needing someone is risky. Better to keep a comfortable distance.\n\n' +
      'None of these responses were choices. They were your nervous system doing its job \u2014 protecting you with the tools it had. The pattern you carry now is not a flaw. It is a survival strategy that worked once and may not be serving you anymore.',
    exerciseContent:
      'Think about your earliest memory of needing comfort from someone. What happened?\n\n' +
      'Not the story you tell about your childhood \u2014 the felt memory. What happened in your body when you needed someone? Did you reach? Did you wait? Did you learn to stop needing?\n\n' +
      'There is no right answer. Just notice what comes up.',
    reflectionPrompt: 'When I was young and I needed comfort, what I learned was:',
  },
  {
    id: 'mc-attachment-101-lesson-2',
    courseId: 'mc-attachment-101',
    lessonNumber: 2,
    title: 'How It Shows Up Now',
    type: 'reflection',
    durationMinutes: 5,
    readContent:
      'Your assessment revealed a pattern in how you connect. Now let us look at how that pattern shows up in your daily life \u2014 in the moments between you and your partner that matter most.',
    readContentAnxious:
      'Your assessment shows a pattern of heightened sensitivity to connection and disconnection. In attachment research, this is called an anxious pattern. Here is what that looks like in practice:\n\n' +
      'You notice shifts in the space between you and your partner quickly \u2014 sometimes before they do. A change in tone, a delayed text, a moment of distraction \u2014 your system registers it immediately. This is not you being "too much." This is a nervous system that was trained to monitor connection because connection was not reliable.\n\n' +
      'The challenge is what happens next. Your system does not just detect the shift \u2014 it interprets it. Something changed becomes something is wrong becomes they are pulling away becomes I am about to be left. And before you have had time to check whether any of that is true, you are already reaching, pursuing, asking for reassurance, or feeling the familiar flood of anxiety.\n\n' +
      'The reach itself is not the problem. Reaching for your partner is healthy. The pattern to notice is what drives the reach: is it desire for closeness, or is it alarm?',
    readContentAvoidant:
      'Your assessment shows a pattern of self-reliance and independence in relationships. In attachment research, this is called an avoidant pattern. Here is what that looks like in practice:\n\n' +
      'When emotional intensity rises in your relationship \u2014 when your partner needs something, when conflict emerges, when vulnerability is requested \u2014 your system has a well-practiced response: create distance. Not because you do not care. Because your nervous system learned early that emotional closeness comes with a cost, and the safest strategy is to manage things on your own.\n\n' +
      'You may notice it as a pull to withdraw, to get busy, to intellectualize rather than feel, or to feel suddenly irritated when your partner asks for emotional engagement. This is not coldness. This is a nervous system that was trained to equate emotional needs with danger \u2014 either the danger of being overwhelmed, or the danger of discovering that your needs will not be met anyway.\n\n' +
      'The independence itself is not the problem. Self-reliance is a genuine strength. The pattern to notice is when it activates: do you withdraw because you genuinely need space, or because closeness activated an old alarm?',
    exerciseContent:
      'Think about a recent moment when you felt disconnected from your partner. What did your body do? Not your thoughts \u2014 your body. Did your chest tighten? Did you feel heat? Did you go numb? Did you feel an urge to move toward your partner or away?',
    reflectionPrompt:
      'When I feel disconnected, my body does this: ___. And then I usually:',
  },
  {
    id: 'mc-attachment-101-lesson-3',
    courseId: 'mc-attachment-101',
    lessonNumber: 3,
    title: 'What Your Partner Experiences',
    type: 'perspective-taking',
    durationMinutes: 5,
    readContent:
      'When your pattern activates, you experience it one way. Your partner experiences it differently. Neither perspective is wrong \u2014 they are two sides of the same dance.',
    readContentAnxious:
      'When your anxiety activates \u2014 when you reach, ask questions, seek reassurance, check in more frequently \u2014 you experience it as caring. You experience it as trying to maintain the connection.\n\n' +
      'Your partner may experience it differently. They may feel pressure. They may feel like nothing they do is enough. They may feel like their freedom to be imperfect or distracted is being monitored. They may pull back \u2014 not because they do not love you, but because the intensity of the reaching feels like a demand rather than a desire.\n\n' +
      'This is not your fault. And it is not their fault. This is the pattern between you \u2014 the dance where your reach triggers their retreat, and their retreat triggers your reach. Neither of you is the problem. The cycle is.\n\n' +
      'Here is the part that might be hard to hear: the reassurance you seek does not actually reassure you. You have noticed this. It works for a moment, and then the anxiety returns. That is because the anxiety is not about what your partner is doing right now. It is about what your nervous system learned a long time ago.',
    readContentAvoidant:
      'When your system activates \u2014 when you withdraw, go quiet, get busy, or shut down emotionally \u2014 you experience it as self-regulation. You are managing the intensity. You are preventing things from getting worse.\n\n' +
      'Your partner may experience it differently. They may feel abandoned. They may feel like they are standing in front of a door that just closed. They may interpret your silence as punishment, your independence as rejection, your calm as not caring.\n\n' +
      'This is not your fault. And it is not their fault. This is the pattern between you \u2014 the dance where your withdrawal triggers their pursuit, and their pursuit triggers your withdrawal.\n\n' +
      'Here is the part that might be hard to hear: the distance you create does not actually make you feel safe. It makes you feel in control \u2014 which is not the same thing. Beneath the independence, there may be a loneliness that you have learned to tolerate so well you barely notice it anymore.',
    exerciseContent:
      'Imagine your partner describing their experience of your pattern to a trusted friend. Not in anger \u2014 but honestly. What would they say? "When my partner does ___, I feel ___."\n\n' +
      'Try to hold what they might say without defending yourself. Just hear it. That is their experience of the dance, and it is as real as yours.',
    reflectionPrompt: 'I think my partner experiences my pattern as:',
  },
  {
    id: 'mc-attachment-101-lesson-4',
    courseId: 'mc-attachment-101',
    lessonNumber: 4,
    title: 'Your First Small Shift',
    type: 'behavioral-experiment',
    durationMinutes: 5,
    readContent:
      'Now that you can see your pattern, it is time to try something different. Not a dramatic transformation \u2014 a small, intentional shift.',
    readContentAnxious:
      'The shift for you is not to feel less. It is to notice more.\n\n' +
      'Your nervous system is fast \u2014 it detects, interprets, and reacts before your conscious mind catches up. The practice is to insert a pause between detection and reaction. Not to suppress the feeling, but to give yourself a moment to ask: Is this alarm about right now, or about then?\n\n' +
      'Here is a specific experiment to try this week:\n\n' +
      'The 90-Second Rule: Neuroscientist Jill Bolte Taylor discovered that the chemical lifespan of an emotion in the body is roughly 90 seconds. After that, any remaining emotional intensity is being maintained by the story you are telling yourself about what happened.\n\n' +
      'The next time you feel the familiar pull of anxiety in your relationship \u2014 the urge to check, to ask, to reach \u2014 try this:\n' +
      '1. Notice the feeling in your body. Name it: "This is anxiety."\n' +
      '2. Set a mental timer for 90 seconds.\n' +
      '3. During those 90 seconds, do nothing except feel the feeling. Do not text. Do not ask. Do not reach. Just breathe and feel.\n' +
      '4. After 90 seconds, check in: is the intensity the same? Less? Different?\n' +
      '5. Now choose what you want to do \u2014 from this calmer place.\n\n' +
      'You are not denying yourself connection. You are giving yourself the space to choose connection rather than react from alarm.',
    readContentAvoidant:
      'The shift for you is not to need less space. It is to let someone in a little more.\n\n' +
      'Your nervous system has a highly effective distancing strategy \u2014 it has kept you safe your whole life. The practice is not to dismantle it. It is to build a small window alongside the wall. Somewhere your partner can see in, and you can let something out, without the whole structure collapsing.\n\n' +
      'Here is a specific experiment to try this week:\n\n' +
      'The One-Sentence Share: Once a day, share one internal experience with your partner. Not a report about your day \u2014 a feeling, a reaction, something that is happening inside you.\n\n' +
      'It can be small:\n' +
      '\u2022 "I felt proud of myself today when I solved that problem at work."\n' +
      '\u2022 "I noticed I felt tense when you asked me about this weekend."\n' +
      '\u2022 "I am tired in a way that feels heavier than usual."\n\n' +
      'That is it. One sentence. You do not need to discuss it, process it, or have a conversation about it. Just say it out loud. Let it land between you.\n\n' +
      'This practice builds the neural pathway for disclosure. It teaches your system that sharing does not lead to overwhelm. It is a structured, predictable way to let your partner in \u2014 which is exactly what your system needs. Not a flood of emotion. A drip.',
    exerciseContent:
      'Choose which experiment you will try this week. Commit to a specific number of times you will practice.',
    reflectionPrompt: 'The experiment I will try this week is:',
  },
  {
    id: 'mc-attachment-101-lesson-5',
    courseId: 'mc-attachment-101',
    lessonNumber: 5,
    title: 'Making It Stick',
    type: 'commitment',
    durationMinutes: 5,
    readContent:
      'You now know three things:\n' +
      '1. Where your pattern came from (and that it is not a flaw)\n' +
      '2. How it shows up (and what it costs)\n' +
      '3. What your partner experiences when it activates\n\n' +
      'This is the Seeing phase of your journey \u2014 and seeing clearly is the foundation for everything that comes next. You cannot change what you cannot see.\n\n' +
      'But insight alone does not change patterns. Patterns change through practice \u2014 small, consistent, repeated actions that teach your nervous system something new. Not a dramatic transformation. A gradual rewiring.\n\n' +
      'Here is what the research says about changing attachment patterns:\n\n' +
      'Attachment patterns CAN change. Researchers call it "earned security" \u2014 the capacity to develop secure attachment through intentional relationship experiences, even if your early experiences were not secure. It happens through what psychologists call "corrective emotional experiences" \u2014 moments where you expect the old pattern to repeat, but something different happens instead.\n\n' +
      'Every time you pause before reacting, you are creating a corrective experience for your nervous system. Every time you share one honest sentence, you are building evidence that vulnerability does not destroy connection. These are small acts. But they are the acts that change everything.',
    exerciseContent:
      'Write a brief commitment \u2014 not a promise to be perfect, but a practice intention.',
    commitmentTemplateAnxious:
      'This week, I commit to practicing the 90-second pause at least ___ times when I feel the pull to seek reassurance. I will notice my body, name the feeling, and give myself 90 seconds before choosing what to do.',
    commitmentTemplateAvoidant:
      'This week, I commit to the one-sentence share at least ___ times. I will share one internal experience with my partner without needing to discuss it further.',
    reflectionPrompt: 'One thing I want to remember from this course is:',
  },
];

// ═══════════════════════════════════════════════════════════
//  MC2: YOUR NERVOUS SYSTEM IN LOVE
//  Placement: Start of Feeling phase
//  Prerequisites: MC1 complete
// ═══════════════════════════════════════════════════════════

const MC2_LESSONS: MicroCourseLesson[] = [
  {
    id: 'mc-regulation-lesson-1',
    courseId: 'mc-regulation',
    lessonNumber: 1,
    title: 'Window of Tolerance 101',
    type: 'psychoeducation',
    durationMinutes: 5,
    readContent:
      'Your nervous system has a zone where you function best. Researcher Dan Siegel calls it the "window of tolerance" \u2014 the range of emotional arousal where you can think clearly, feel your feelings without being overwhelmed, and respond rather than react.\n\n' +
      'Inside your window, you can hear your partner, hold complexity, and make choices. Outside your window, you cannot. It is that simple.\n\n' +
      'There are two ways to leave your window:\n\n' +
      'Up \u2014 into hyperarousal. Your system activates. Heart races, muscles tense, breath quickens. You might feel anxious, angry, panicky, or keyed up. You want to move, talk, fix, fight. In relationships, hyperarousal often looks like pursuing, criticizing, demanding, or overwhelming your partner with emotion.\n\n' +
      'Down \u2014 into hypoarousal. Your system shuts down. You feel numb, foggy, flat, disconnected. You might feel like you cannot think or that nothing matters. In relationships, hypoarousal often looks like stonewalling, going blank, withdrawing, or physically leaving.\n\n' +
      'Both responses are your nervous system trying to protect you. Neither is a choice you are making.\n\n' +
      'The critical insight: when you are outside your window, your partner cannot reach you and you cannot reach them. The most loving words in the world will not land if your nervous system is in survival mode. This is why regulate before you reason is one of the core principles in this app. Connection requires being inside your window.',
    exerciseContent:
      'Place yourself where you are RIGHT NOW. Not where you were during your last argument \u2014 right now, in this calm moment. This is your baseline.',
    reflectionPrompt:
      'Right now I am: inside my window / slightly above / slightly below / well outside',
  },
  {
    id: 'mc-regulation-lesson-2',
    courseId: 'mc-regulation',
    lessonNumber: 2,
    title: 'Your Activation Signature',
    type: 'identification',
    durationMinutes: 5,
    readContent:
      'Everyone has a personal activation signature \u2014 the specific way YOUR body leaves the window. Learning yours is one of the most useful skills you will develop.\n\n' +
      'When you begin to leave your window upward (hyperarousal), you might notice:\n' +
      '\u2022 Chest tightening or heart pounding\n' +
      '\u2022 Heat in your face or neck\n' +
      '\u2022 Jaw clenching, fists tightening\n' +
      '\u2022 Urge to speak faster or louder\n' +
      '\u2022 Restlessness, inability to sit still\n' +
      '\u2022 Tunnel vision \u2014 locked onto the "threat"\n\n' +
      'When you begin to leave your window downward (hypoarousal), you might notice:\n' +
      '\u2022 Heaviness in your limbs\n' +
      '\u2022 Feeling far away or "behind glass"\n' +
      '\u2022 Difficulty finding words\n' +
      '\u2022 Flat or empty feeling in your chest\n' +
      '\u2022 Wanting to sleep or disappear\n' +
      '\u2022 Loss of interest \u2014 "I do not care anymore" (you do, but your system has gone offline)\n\n' +
      'The key word is BEGIN. By the time you are fully outside your window, your prefrontal cortex (the thinking, choosing part of your brain) is already offline. The practice is to catch the early signals \u2014 the first 10% of the shift \u2014 and intervene while you still can.\n\n' +
      'Think of it like a temperature gauge. You want to notice when the needle starts to move, not when it hits the red zone.',
    exerciseContent:
      'Close your eyes for 30 seconds. Think about a recent moment of conflict with your partner \u2014 not the worst one, just a typical one. Notice what your body does as you think about it. Where does the activation start? What is the first signal?\n\n' +
      'Now think about a moment when you felt shut down or numb in the relationship. Where does THAT show up? What is the first signal?',
    reflectionPrompt:
      'My early warning signal for hyperarousal is: ___. For hypoarousal:',
  },
  {
    id: 'mc-regulation-lesson-3',
    courseId: 'mc-regulation',
    lessonNumber: 3,
    title: 'Grounding When Hyperaroused',
    type: 'skill-building',
    durationMinutes: 5,
    readContent:
      'When your system is activated upward \u2014 heart racing, chest tight, thoughts spiraling \u2014 you need practices that slow your system down. These are not relaxation techniques. They are nervous system interventions that work with your biology.\n\n' +
      'The Physiological Sigh (discovered by Stanford neuroscientist Andrew Huberman)\n\n' +
      'This is the fastest known way to calm your nervous system in real time:\n' +
      '1. Inhale through your nose\n' +
      '2. At the top of the inhale, take one more short inhale (a "double inhale") \u2014 this inflates the tiny air sacs in your lungs\n' +
      '3. Exhale slowly through your mouth, making the exhale at least twice as long as the inhale\n\n' +
      'That is it. One cycle takes about 10 seconds. Research shows a single physiological sigh can measurably reduce heart rate and cortisol levels.\n\n' +
      'Do three of these right now.\n\n' +
      '5-4-3-2-1 Sensory Grounding\n\n' +
      'When your thoughts are spiraling, bring your attention back to your body and surroundings:\n' +
      '\u2022 Name 5 things you can see\n' +
      '\u2022 Name 4 things you can touch (and touch them)\n' +
      '\u2022 Name 3 things you can hear\n' +
      '\u2022 Name 2 things you can smell\n' +
      '\u2022 Name 1 thing you can taste\n\n' +
      'This works because your sensory system is anchored in the present moment. Anxiety lives in the future ("What if..."). Your senses live in the now.',
    exerciseContent:
      'Practice the physiological sigh three times right now. Then do the 5-4-3-2-1. Notice what shifts.',
    reflectionPrompt: 'After practicing, I notice:',
  },
  {
    id: 'mc-regulation-lesson-4',
    courseId: 'mc-regulation',
    lessonNumber: 4,
    title: 'Waking Up When Shut Down',
    type: 'skill-building',
    durationMinutes: 5,
    readContent:
      'When your system has gone offline \u2014 numb, foggy, disconnected, flat \u2014 you need a different approach. Calming practices will not help because you are already too calm. Your system needs gentle activation.\n\n' +
      'Orienting\n\n' +
      'When you feel numb or disconnected, your awareness has collapsed inward. Orienting expands it outward:\n' +
      '1. Slowly look around the room. Really look. Not scanning \u2014 seeing.\n' +
      '2. Name five things you see out loud: "I see a blue mug. I see light coming through the window."\n' +
      '3. Let your eyes rest on whatever feels interesting or pleasant.\n' +
      '4. Notice if anything shifts in your body.\n\n' +
      'This works because the act of orienting activates your social engagement system (the newest, most evolved part of your nervous system). It tells your body: you are here. You are present. It is safe to come back online.\n\n' +
      'Gentle Activation Sequence\n\n' +
      'Start from your extremities and work inward:\n' +
      '1. Wiggle your toes. Press your feet into the floor.\n' +
      '2. Squeeze your calves gently, then release.\n' +
      '3. Press your thighs against your chair.\n' +
      '4. Squeeze your hands into fists, hold for 5 seconds, release.\n' +
      '5. Roll your shoulders up, back, and down.\n' +
      '6. Gently turn your head left and right, slowly.\n' +
      '7. Take one deep breath with a long, audible exhale.\n\n' +
      'You are not forcing yourself to feel. You are inviting your body to come back. Gently. At its own pace.',
    exerciseContent:
      'Try the gentle activation sequence right now. Notice: does anything shift? Does your body feel more present?',
    reflectionPrompt: 'What I noticed during the activation sequence:',
  },
  {
    id: 'mc-regulation-lesson-5',
    courseId: 'mc-regulation',
    lessonNumber: 5,
    title: 'Co-Regulation \u2014 Your Partner as Home Base',
    type: 'couple-exercise',
    durationMinutes: 5,
    readContent:
      'Here is something your nervous system already knows but your mind might resist: you are wired to regulate through connection. Not just self-regulation \u2014 CO-regulation. Using another person\'s calm, steady presence to help your own system settle.\n\n' +
      'This is not weakness. It is biology. Polyvagal researcher Stephen Porges calls it "the social engagement system" \u2014 the most evolved part of your nervous system, the part that reads safety in another person\'s face, voice, and touch.\n\n' +
      'When your partner is calm and present, their nervous system sends signals to yours: safe, safe, safe. Your heart rate synchronizes. Your breathing slows. Your body relaxes \u2014 not because you decided to, but because another regulated nervous system is in proximity.\n\n' +
      'This is the couple bubble. Not a metaphor \u2014 a physiological reality.\n\n' +
      'The 2-Minute Co-Regulation Practice:\n' +
      '1. Sit facing each other. Close enough to touch.\n' +
      '2. One partner places their hand on the other\'s chest (over the heart). The other partner places their hand on top.\n' +
      '3. Both close your eyes.\n' +
      '4. Breathe together. Not forced \u2014 just notice each other\'s rhythm and let yours naturally synchronize.\n' +
      '5. Two minutes. No talking.\n\n' +
      'This practice does more for your nervous system in two minutes than twenty minutes of talking about the problem. Bodies before words.',
    exerciseContent:
      'Try the 2-minute co-regulation practice with your partner. If your partner is not available right now, practice by placing your own hand on your chest and breathing slowly for two minutes, imagining the steady presence of someone who cares about you.',
    reflectionPrompt: 'During co-regulation, I noticed:',
  },
];

// ═══════════════════════════════════════════════════════════
//  MC3: FROM RUPTURE TO REPAIR
//  Placement: Mid-Shifting phase
//  Prerequisites: MC1 + MC2 complete
// ═══════════════════════════════════════════════════════════

const MC3_LESSONS: MicroCourseLesson[] = [
  {
    id: 'mc-conflict-repair-lesson-1',
    courseId: 'mc-conflict-repair',
    lessonNumber: 1,
    title: 'Why Conflict Is Not the Enemy',
    type: 'psychoeducation',
    durationMinutes: 5,
    readContent:
      'Here is a finding that surprises most people: relationship researcher John Gottman discovered that 69% of all relationship conflicts are perpetual. They never get resolved. Happy couples and unhappy couples have roughly the same number of unsolvable problems.\n\n' +
      'The difference is not whether you fight. It is how you fight \u2014 and whether you repair.\n\n' +
      'The strongest relationships are not conflict-free. They are repair-rich. Couples who stay together and stay satisfied are not better at avoiding rupture. They are better at coming back from it. They rupture and repair, rupture and repair \u2014 hundreds of times. Each repair deposits trust into the relationship. Each unrepaired rupture withdraws it.\n\n' +
      'Conflict is not the enemy. Contempt is. Conflict without repair is. But conflict itself \u2014 the friction of two different people trying to build a life together \u2014 is not just normal. It is necessary. Your differences are where the growth lives.\n\n' +
      'The pattern between you when things go wrong is not proof that your relationship is failing. It is the doorway to something deeper \u2014 if you can learn to walk through it instead of around it.',
    exerciseContent:
      'Think about the last argument you had with your partner. Can you separate the CONTENT (what you argued about) from the PATTERN (what happened between you)?\n\n' +
      'The content: we argued about ___.\n' +
      'The pattern: when it started, I did ___ and they did ___, and then I did ___ and they did ___.\n\n' +
      'The content changes. The pattern stays the same. That is what we are working on.',
    reflectionPrompt:
      'The pattern, not the content: when conflict starts between us, the dance usually goes:',
  },
  {
    id: 'mc-conflict-repair-lesson-2',
    courseId: 'mc-conflict-repair',
    lessonNumber: 2,
    title: 'The Four Horsemen and Their Antidotes',
    type: 'identification',
    durationMinutes: 5,
    readContent:
      'Gottman identified four behaviors that predict relationship failure with over 90% accuracy. He called them the Four Horsemen. The good news: each one has a specific, learnable antidote.\n\n' +
      '1. Criticism \u2192 Antidote: Gentle Startup\n' +
      'Criticism attacks your partner\'s character: "You never think about anyone but yourself."\n' +
      'The antidote is to complain about the behavior without blaming the person. Lead with "I feel" and state what you need: "I felt forgotten when you did not call. I need to know I am on your mind."\n' +
      'Same message. Completely different impact.\n\n' +
      '2. Contempt \u2192 Antidote: Culture of Appreciation\n' +
      'Contempt is criticism plus disgust \u2014 eye-rolling, mockery, name-calling. It communicates: I am superior to you. Research shows it is the single greatest predictor of divorce.\n' +
      'The antidote is not a single conversation. It is a daily practice: express appreciation, gratitude, and respect more than you express frustration. Gottman found the "magic ratio" is 5 positive interactions for every 1 negative.\n\n' +
      '3. Defensiveness \u2192 Antidote: Taking Responsibility\n' +
      'Defensiveness is self-protection: "It is not my fault. You are the one who..."\n' +
      'The antidote is to accept some responsibility for your part, even a small part: "You are right, I should have called. I got caught up and I am sorry."\n' +
      'This does not mean you are wrong about everything. It means you are willing to own your piece of the dance.\n\n' +
      '4. Stonewalling \u2192 Antidote: Self-Soothing + Re-engagement\n' +
      'Stonewalling is shutting down \u2014 going blank, walking away, refusing to engage. It usually happens when your nervous system is flooded (outside your window of tolerance).\n' +
      'The antidote is to recognize flooding, take a break (at least 20 minutes \u2014 that is how long it takes for stress hormones to clear), do something calming, and then come back and re-engage.',
    exerciseContent:
      'Which horseman shows up most in YOUR conflicts? Which one does your PARTNER tend to use? Be honest, and be compassionate. These are patterns, not character defects.',
    reflectionPrompt:
      'My most frequent horseman is: ___. The antidote I want to practice is:',
  },
  {
    id: 'mc-conflict-repair-lesson-3',
    courseId: 'mc-conflict-repair',
    lessonNumber: 3,
    title: 'The Anatomy of a Repair Attempt',
    type: 'skill-building',
    durationMinutes: 5,
    readContent:
      'A repair attempt is any statement or action \u2014 verbal or nonverbal \u2014 that prevents negativity from escalating out of control. Gottman found that the success or failure of repair attempts is one of the primary factors that determine whether a relationship succeeds.\n\n' +
      'Repair attempts can be obvious or subtle:\n' +
      '\u2022 "I am sorry. That came out wrong. Let me try again."\n' +
      '\u2022 "Can we take a break? I am getting flooded."\n' +
      '\u2022 Reaching for your partner\'s hand during an argument\n' +
      '\u2022 Making a joke (carefully \u2014 timing matters)\n' +
      '\u2022 "I can see this is really important to you."\n' +
      '\u2022 "We are on the same team here."\n' +
      '\u2022 "I do not want to fight. I want to understand."\n' +
      '\u2022 Taking a breath and starting over\n\n' +
      'The critical finding: it is not just whether you MAKE repair attempts. It is whether your partner ACCEPTS them. And acceptance is easier when there is a foundation of goodwill \u2014 that 5:1 ratio of positive to negative interactions.\n\n' +
      'Here is a repair conversation template you can use after a conflict:\n' +
      'Step 1: "I want to understand what happened between us."\n' +
      'Step 2: "Here is how I experienced it: ___" (your perspective, not blame)\n' +
      'Step 3: "What I think I did that did not help: ___" (take responsibility for your piece)\n' +
      'Step 4: "What I needed from you was: ___" (the primary emotion underneath)\n' +
      'Step 5: "What can we do differently next time?"',
    exerciseContent:
      'Think about a recent conflict that ended badly. Using the 5-step template above, draft what you might say to your partner. Write it down. You do not need to share it yet \u2014 just practice formulating the words.',
    reflectionPrompt:
      'The hardest part of the repair template for me is step ___. Because:',
  },
  {
    id: 'mc-conflict-repair-lesson-4',
    courseId: 'mc-conflict-repair',
    lessonNumber: 4,
    title: 'Practicing Repair (Guided)',
    type: 'couple-exercise',
    durationMinutes: 5,
    readContent:
      'This is a structured repair conversation for you and your partner. Choose a small conflict from the past week \u2014 NOT your biggest issue. Start with something manageable.\n\n' +
      'Ground rules:\n' +
      '\u2022 No interrupting. Each partner speaks fully before the other responds.\n' +
      '\u2022 Lead with feelings, not accusations.\n' +
      '\u2022 Listen to understand, not to defend.\n' +
      '\u2022 If either partner gets flooded (outside their window), pause. Come back when you are both inside your windows.\n\n' +
      'The Conversation:\n\n' +
      'Partner A goes first:\n' +
      '1. "The situation I want to talk about is: ___"\n' +
      '2. "When that happened, I felt: ___" (one feeling, not a paragraph)\n' +
      '3. "What I needed was: ___"\n' +
      '4. "What I think I did that did not help the situation: ___"\n\n' +
      'Partner B responds:\n' +
      '1. "What I hear you saying is: ___" (reflect, not defend)\n' +
      '2. "That makes sense to me because: ___" (validate)\n' +
      '3. "What I think I did that did not help: ___"\n' +
      '4. "What I needed was: ___"\n\n' +
      'Both partners:\n' +
      '"Next time this pattern starts, what we could try instead is: ___"\n\n' +
      'Then switch roles. Partner B shares their experience of the same situation.',
    exerciseContent:
      'Do this conversation with your partner. If it feels too hard, start by writing your answers and sharing the written version. The format provides the safety.',
    reflectionPrompt: 'What surprised me during the repair conversation:',
  },
  {
    id: 'mc-conflict-repair-lesson-5',
    courseId: 'mc-conflict-repair',
    lessonNumber: 5,
    title: 'Building a Repair Culture',
    type: 'commitment',
    durationMinutes: 5,
    readContent:
      'A single repair conversation is valuable. A repair CULTURE is transformative.\n\n' +
      'A repair culture means that rupture is expected, not feared. It means both partners know: we will disconnect sometimes. That is the rhythm. And we have a way to come back.\n\n' +
      'Building a repair culture involves three practices:\n\n' +
      '1. The Daily Check-in (2 minutes)\n' +
      'Once a day, ask each other: "How are we?" Not "how are you" \u2014 "how are WE." How is the space between us today? Warm? Cool? Tense? Open?\n' +
      'This takes 2 minutes. It prevents small disconnections from becoming entrenched.\n\n' +
      '2. The 24-Hour Repair Rule\n' +
      'Make an agreement: when a rupture happens, you will attempt repair within 24 hours. Not to resolve the issue \u2014 just to acknowledge the disconnection and express willingness to work on it. Even a simple "I know things are off between us. I do not want to leave it like this" counts as a repair attempt.\n\n' +
      '3. The Weekly Relationship Weather Report\n' +
      'Once a week (pick a consistent time), sit together for 10-15 minutes and discuss:\n' +
      '\u2022 What went well between us this week?\n' +
      '\u2022 Was there a moment of disconnection? What happened?\n' +
      '\u2022 What does the space between us need this week?\n\n' +
      'These rituals seem small. They are not. They are the rhythms that keep the relational field alive.',
    exerciseContent:
      'With your partner, agree on one of the three rituals above that you will try this week. Pick the one that feels most doable, not the one that feels most needed.',
    reflectionPrompt: 'The ritual we are going to try this week:',
  },
];

// ═══════════════════════════════════════════════════════════
//  MC4: BOUNDARIES THAT CONNECT (NOT JUST PROTECT)
//  Placement: Mid-Shifting phase
//  Prerequisites: MC1 complete + DSI-R assessment
// ═══════════════════════════════════════════════════════════

const MC4_LESSONS: MicroCourseLesson[] = [
  {
    id: 'mc-boundaries-lesson-1',
    courseId: 'mc-boundaries',
    lessonNumber: 1,
    title: 'What Boundaries Actually Are',
    type: 'psychoeducation',
    durationMinutes: 5,
    readContent:
      'Boundaries are not walls. And they are not punishment.\n\n' +
      'A boundary is information. It tells the people around you where you end and they begin \u2014 what you are responsible for and what you are not, what you can tolerate and what you cannot, what you need and what you will not accept.\n\n' +
      'In healthy relationships, boundaries serve connection. They make intimacy safe by ensuring that neither partner loses themselves in the process. Without boundaries, closeness becomes fusion \u2014 a merging where one person accommodates and the other dominates, or both disappear into a foggy "we" that has no room for either "I."\n\n' +
      'The research on differentiation of self \u2014 developed by family therapist Murray Bowen \u2014 shows that the most satisfying relationships involve two well-differentiated people. That means: each partner can hold their own position, manage their own anxiety, and stay connected to their partner without needing to control, appease, or retreat.\n\n' +
      'Differentiation is not distance. Distance is leaving the room. Differentiation is staying in the room, knowing what you feel, and saying it \u2014 without needing your partner to agree, and without falling apart if they do not.\n\n' +
      'Many people confuse boundaries with ultimatums: "If you do X, I will leave." That is not a boundary. A boundary sounds more like: "I am not willing to have this conversation when voices are raised. I need us to take a break and come back when we can both speak calmly."\n\n' +
      'One is a threat. The other is care \u2014 for yourself AND the relationship.',
    exerciseContent:
      'Think about a recent moment when you wished you had set a boundary but did not. What stopped you? Fear of conflict? Fear of hurting your partner? Not knowing how to say it?',
    reflectionPrompt:
      'The thing that usually stops me from setting a boundary is:',
  },
  {
    id: 'mc-boundaries-lesson-2',
    courseId: 'mc-boundaries',
    lessonNumber: 2,
    title: 'Fusion vs. Connection vs. Distance',
    type: 'identification',
    durationMinutes: 5,
    readContent:
      'There are three relational positions, and they look very different:\n\n' +
      'Fusion looks like closeness, but it is not. In fusion, you absorb your partner\'s emotions as your own. When they are anxious, you become anxious. When they are happy, you are relieved. Your mood depends on theirs. You agree to things you do not want. You suppress your opinions to keep the peace. From outside, it looks like harmony. From inside, it feels like disappearing.\n\n' +
      'Signs of fusion: you do not know what you want until you know what they want. You feel guilty saying no. You take responsibility for their feelings. You lose track of your own preferences.\n\n' +
      'Distance looks like independence, but it is also not. In distance, you protect yourself by staying on your side of the wall. You manage your emotions alone. You do not let your partner\'s distress affect you \u2014 because you have learned to shut it out. You may call it "not being codependent." It may actually be emotional cutoff.\n\n' +
      'Signs of distance: you feel irritated when your partner has emotional needs. You would rather solve a problem alone than ask for help. You feel most relaxed when your partner is not around. You describe yourself as "not very emotional."\n\n' +
      'Connection is the middle ground. In connection, you can feel your partner\'s experience without being swallowed by it. You can hold your position without needing to leave the room. You can say "I love you AND I disagree with you" and mean both.\n\n' +
      'Connection requires differentiation \u2014 the capacity to be a separate self in the presence of another person. This is the goal.',
    exerciseContent:
      'Where do you tend to land: fusion, distance, or connection? Be honest. Most of us lean toward one side. And your partner probably leans toward the other \u2014 which is part of the pattern between you.',
    reflectionPrompt:
      'I tend more toward fusion / distance (circle one). This shows up as:',
  },
  {
    id: 'mc-boundaries-lesson-3',
    courseId: 'mc-boundaries',
    lessonNumber: 3,
    title: 'The I-Position Practice',
    type: 'skill-building',
    durationMinutes: 5,
    readContent:
      'The "I-Position" is a concept from Bowen family therapy. It means: stating what you think, feel, or need \u2014 clearly and calmly \u2014 without blaming your partner and without needing them to agree.\n\n' +
      'It sounds simple. It is one of the hardest relational skills to learn.\n\n' +
      'An I-Position is NOT:\n' +
      '\u2022 "I feel like YOU are being selfish" (that is a disguised you-statement)\n' +
      '\u2022 "I think WE should..." (that may be avoiding your own position)\n' +
      '\u2022 "I just want you to..." (that is a request framed as a feeling)\n\n' +
      'An I-Position IS:\n' +
      '\u2022 "I need some time alone this evening."\n' +
      '\u2022 "I disagree with that decision."\n' +
      '\u2022 "I am not willing to discuss this when we are both this activated."\n' +
      '\u2022 "I felt hurt by what happened, and I need you to know that."\n\n' +
      'The I-Position has three components:\n' +
      '1. What I think or feel (your inner truth, stated plainly)\n' +
      '2. What I need or want (your request, without demand)\n' +
      '3. Without requiring a specific response (your partner gets to have their own reaction)\n\n' +
      'The hardest part for people who lean toward fusion: the third component. Saying what you need AND letting go of controlling how your partner responds. Their response is their responsibility, not yours.\n\n' +
      'The hardest part for people who lean toward distance: the first component. Actually identifying what you think or feel \u2014 because you may have been managing emotions by not having them.',
    exerciseContent:
      'Think of something you have been wanting to say to your partner but have not. Now write it as an I-Position statement:\n\n' +
      '"I feel/think ___. What I need is ___. And I want you to know that your response is yours."',
    reflectionPrompt: 'The I-Position statement I want to practice is:',
  },
  {
    id: 'mc-boundaries-lesson-4',
    courseId: 'mc-boundaries',
    lessonNumber: 4,
    title: 'Holding a Boundary Without Guilt',
    type: 'behavioral-experiment',
    durationMinutes: 5,
    readContent:
      'If you grew up in an environment where saying "no" led to conflict, withdrawal, or punishment, your nervous system learned to associate boundaries with danger. Setting a limit now may trigger guilt, shame, or the fear that your partner will leave.\n\n' +
      'This is your attachment system talking. Not truth. Not reality. An old alarm triggered by an old pattern.\n\n' +
      'Here is the reframe: a boundary is an act of care. It protects the space between you. When you set a boundary, you are saying: I value this relationship enough to be honest about what I need for it to work.\n\n' +
      'Partners may not always like your boundaries. That is their right. But a partner who consistently punishes you for having boundaries is not offering love \u2014 they are offering control.\n\n' +
      'The Boundary-Setting Template:\n\n' +
      '1. Name the situation: "When ___ happens..."\n' +
      '2. Name your experience: "I feel ___..."\n' +
      '3. Name your need: "What I need is ___..."\n' +
      '4. Name your action: "And so I am going to ___..."\n\n' +
      'Example: "When our conversations escalate to yelling, I feel flooded and unsafe. What I need is for us to pause and come back when we are calmer. So when I notice the yelling starting, I am going to say \'I need 20 minutes\' and step away. I will come back."',
    exerciseContent:
      'Write one boundary statement using the template above. Choose something real but manageable.',
    reflectionPrompt: 'The boundary I am ready to practice is:',
  },
  {
    id: 'mc-boundaries-lesson-5',
    courseId: 'mc-boundaries',
    lessonNumber: 5,
    title: 'Boundaries as Care, Not Rejection',
    type: 'reframe',
    durationMinutes: 5,
    readContent:
      'Here is the paradox of boundaries in relationships: the clearer your boundaries, the safer the relationship becomes. Not for one partner at the expense of the other \u2014 for both.\n\n' +
      'When you know where you end and your partner begins, there is space for both of you. Your partner does not have to guess what you need or walk on eggshells. You do not have to monitor their emotions or suppress your own. The couple bubble becomes a place where two whole people meet, rather than two halves trying to become whole through each other.\n\n' +
      'This is what differentiation looks like in practice \u2014 the idea that both partners can hold their own truth simultaneously without either truth being invalidated. I can be fully myself AND fully in this relationship. That is not contradiction. That is maturity.\n\n' +
      'Your homework from this course:\n\n' +
      '1. Practice one I-Position statement this week\n' +
      '2. Set one boundary using the template\n' +
      '3. Notice what happens in your body when you do \u2014 guilt? Relief? Fear? All of the above?\n' +
      '4. Whatever happens, notice it without judgment. The feeling is not the truth. It is the old pattern adjusting to a new move.',
    exerciseContent:
      'Review your I-Position statement and your boundary statement from the previous lessons. Commit to practicing both this week.',
    reflectionPrompt: 'What I am taking from this course into my relationship:',
  },
];

// ═══════════════════════════════════════════════════════════
//  MC5: UNHOOKING FROM THE STORY
//  Placement: Mid-Feeling phase
//  Prerequisites: MC1 complete
//  Primary modality: ACT
// ═══════════════════════════════════════════════════════════

const MC5_LESSONS: MicroCourseLesson[] = [
  {
    id: 'mc-act-defusion-lesson-1',
    courseId: 'mc-act-defusion',
    lessonNumber: 1,
    title: 'The Story You Tell About Your Partner',
    type: 'identification',
    durationMinutes: 5,
    readContent:
      'You have a story about your partner. Everyone does. It is a running narrative \u2014 assembled from hundreds of interactions, interpretations, and assumptions \u2014 that your mind uses to predict what will happen next.\n\n' +
      '"They never listen." "They always shut down." "They do not really care." "They only think about themselves."\n\n' +
      'The story feels true because your mind collects evidence for it. Every time your partner does something that confirms the story, your mind says: See? I told you. Every time they do something that contradicts it, your mind either ignores it or explains it away.\n\n' +
      'This is not a character flaw. This is how human minds work. Psychologists call it "confirmation bias." In ACT, they call it "fusion" \u2014 being so tangled up with your thoughts that you cannot see they are thoughts. You experience them as facts.\n\n' +
      'The story about your partner is not your partner. It is a story. It may contain truth \u2014 most stories do. But it is not the whole truth, and it is not happening right now. It is a compilation of past moments, interpreted through the filter of your attachment patterns, your personality, and your fears.\n\n' +
      'The question is not whether the story is true. The question is: what happens in the space between you when you relate to your partner through the story rather than through what is actually happening right now?',
    exerciseContent:
      'Write down "the story" you carry about your partner \u2014 the one that plays like a loop in your mind, especially during conflict. Not the balanced version. The raw one. The one you would never say out loud.\n\n' +
      'Then read it back. Notice: when did this story become THE story? How long have you been carrying it?',
    reflectionPrompt: 'The story I carry about my partner:',
  },
  {
    id: 'mc-act-defusion-lesson-2',
    courseId: 'mc-act-defusion',
    lessonNumber: 2,
    title: 'Thoughts as Thoughts, Not Facts',
    type: 'skill-building',
    durationMinutes: 5,
    readContent:
      'Here is a shift that changes everything: learning to see your thoughts AS thoughts, rather than as direct reports about reality.\n\n' +
      'When your mind says "they do not care," that is a thought. It is not a fact. It is a sentence your mind generated based on a pattern of interpretation.\n\n' +
      'Try this: take the story-thought you wrote in the last lesson, and put these words in front of it:\n\n' +
      '"I am having the thought that ___."\n\n' +
      'Example: Instead of "they never listen" \u2192 "I am having the thought that they never listen."\n\n' +
      'Notice what shifts. The content is the same. But your relationship to the content has changed. You went from being inside the thought to observing it.\n\n' +
      'ACT therapists call this "defusion" \u2014 unhooking from thoughts so you can see them clearly rather than looking through them at everything else.\n\n' +
      'Now try this version: "My mind is telling me the story that ___."\n\n' +
      '"My mind is telling me the story that they do not really care." Can you feel the difference? You are not denying the thought. You are not arguing with it. You are just holding it lightly instead of gripping it like a weapon.',
    exerciseContent:
      'Take three of your most frequent negative thoughts about your partner and rewrite them:\n\n' +
      'Original: "They always ___"\n' +
      'Defused: "I am having the thought that they always ___"\n\n' +
      'Original: "They never ___"\n' +
      'Defused: "My mind is telling me the story that they never ___"\n\n' +
      'Original: "They do not ___"\n' +
      'Defused: "I notice my mind generating the thought that they do not ___"',
    reflectionPrompt: 'When I defuse from the story, what I notice is:',
  },
  {
    id: 'mc-act-defusion-lesson-3',
    courseId: 'mc-act-defusion',
    lessonNumber: 3,
    title: 'The Observer Self in Conflict',
    type: 'mindfulness',
    durationMinutes: 5,
    readContent:
      'In ACT, there is a concept called the "observer self" \u2014 the part of you that can watch your thoughts and feelings without being swept away by them. It is the part of you that can say: I notice I am angry, rather than I AM angry.\n\n' +
      'During conflict, most of us lose access to the observer self entirely. We become the anger, the fear, the hurt. We are fully identified with whatever our nervous system and our story-mind are generating. And from that place, we say and do things that serve the pattern rather than the relationship.\n\n' +
      'The practice is to cultivate the observer \u2014 the "fly on the wall" perspective \u2014 even during activation. Not to detach from your feelings, but to hold them while also maintaining a larger awareness.\n\n' +
      'The Observer Practice:\n\n' +
      'The next time you are in a mild disagreement with your partner (not a major fight \u2014 start small), try this:\n\n' +
      '1. Notice the feeling arising. Name it silently: "Anger is here." "Fear is here." "Hurt is here."\n' +
      '2. Notice the story your mind is generating: "My mind is saying: they do not respect me."\n' +
      '3. Notice the urge your body has: "My body wants to raise my voice." "My body wants to walk away."\n' +
      '4. Choose: Is the urge serving the relationship, or the pattern?\n' +
      '5. Respond from the observer, not the reaction.\n\n' +
      'This takes practice. You will lose the observer many times. That is not failure. Noticing that you lost it IS the observer returning.',
    exerciseContent:
      'For the next 60 seconds, sit quietly and observe your thoughts without engaging with them. Imagine you are sitting beside a stream, and each thought is a leaf floating by. You do not need to pick up the leaf. Just watch it pass. Notice how many thoughts come. Notice the space between them.',
    reflectionPrompt: 'What I noticed as the observer:',
  },
  {
    id: 'mc-act-defusion-lesson-4',
    courseId: 'mc-act-defusion',
    lessonNumber: 4,
    title: 'Willingness \u2014 Showing Up Even When Hard',
    type: 'reflection',
    durationMinutes: 5,
    readContent:
      'Willingness is one of the core concepts in ACT. It does not mean wanting to. It does not mean liking it. It means choosing to experience what is here \u2014 the discomfort, the vulnerability, the uncertainty \u2014 because doing so serves something you value.\n\n' +
      'In relationships, willingness looks like:\n' +
      '\u2022 Staying in a difficult conversation instead of walking away (even though your body is screaming to leave)\n' +
      '\u2022 Sharing something vulnerable even though it might not be received well\n' +
      '\u2022 Listening to your partner\'s pain without defending yourself\n' +
      '\u2022 Showing up to a practice even though you would rather not\n' +
      '\u2022 Feeling the anxiety about the relationship without immediately seeking reassurance\n\n' +
      'Willingness is the opposite of avoidance. And experiential avoidance \u2014 the habit of avoiding uncomfortable internal experiences \u2014 is what keeps most patterns locked in place.\n\n' +
      'Your attachment pattern IS a form of experiential avoidance. Anxious pursuit avoids the feeling of abandonment. Avoidant withdrawal avoids the feeling of overwhelm. Both are strategies to avoid something painful. And both keep you from the relationship you actually want.\n\n' +
      'Willingness says: I am willing to feel this \u2014 the fear, the vulnerability, the not-knowing \u2014 because connection with my partner matters more than comfort.\n\n' +
      'This is not reckless. It is not "letting your guard down." It is conscious, chosen, values-driven courage.',
    exerciseContent:
      'Complete this sentence: "What I have been avoiding feeling in my relationship is: ___"\n\n' +
      'Now: "And the value that makes it worth feeling anyway is: ___"',
    reflectionPrompt: 'I am willing to feel ___ in service of',
  },
  {
    id: 'mc-act-defusion-lesson-5',
    courseId: 'mc-act-defusion',
    lessonNumber: 5,
    title: 'Committed Action \u2014 Doing What Matters',
    type: 'behavioral-experiment',
    durationMinutes: 5,
    readContent:
      'Defusion (unhooking from the story), the observer self (watching rather than reacting), and willingness (choosing to feel discomfort) all lead to one thing: committed action. Doing what your values call for, even when your pattern is pulling you the other direction.\n\n' +
      'Committed action is not a grand gesture. It is a small move in the direction of the partner and relationship you want to be \u2014 made repeatedly, imperfectly, and with self-compassion when you fall back into the old pattern.\n\n' +
      'Your committed action plan:\n\n' +
      '1. Name the pattern you want to change:\n' +
      '"When ___ happens, I usually ___."\n\n' +
      '2. Name the value it costs you:\n' +
      '"This pattern keeps me from ___."\n\n' +
      '3. Name the new move:\n' +
      '"Instead, I am going to try ___."\n\n' +
      '4. Name the discomfort you are willing to feel:\n' +
      '"This will feel ___, and I am willing to feel that because ___."\n\n' +
      'Example (anxious): "When my partner gets quiet, I usually flood them with questions. This keeps me from the trust I want. Instead, I am going to notice the urge, take three breaths, and wait. This will feel terrifying, and I am willing to feel that because I value giving my partner space."\n\n' +
      'Example (avoidant): "When my partner asks what I am feeling, I usually say \'fine\' or change the subject. This keeps me from the intimacy I actually want. Instead, I am going to answer with one honest sentence. This will feel exposed, and I am willing to feel that because I value being known."',
    exerciseContent:
      'Write your committed action plan. Be specific. Be honest about what it will cost. And be compassionate \u2014 you are learning a new dance, and the old one has had years of practice.',
    reflectionPrompt:
      'My committed action this week: When ___, instead of ___, I will',
  },
];

// ═══════════════════════════════════════════════════════════
//  MC6: WHAT MATTERS MOST (TOGETHER)
//  Placement: Start of Shifting phase
//  Prerequisites: Values assessment complete
//  Primary modality: ACT values work + Gottman shared meaning
// ═══════════════════════════════════════════════════════════

const MC6_LESSONS: MicroCourseLesson[] = [
  {
    id: 'mc-values-alignment-lesson-1',
    courseId: 'mc-values-alignment',
    lessonNumber: 1,
    title: 'Your Values, Their Values',
    type: 'reflection',
    durationMinutes: 5,
    readContent:
      'Your values assessment revealed what matters most to you. Your partner has their own set \u2014 which may overlap with yours and may diverge significantly.\n\n' +
      'This is where most couples make one of two mistakes:\n\n' +
      'Mistake 1: Assuming your values should be the same. "If they loved me, they would value what I value." This is fusion \u2014 the belief that love means sameness. It leads to resentment when your partner inevitably turns out to be a different person with different priorities.\n\n' +
      'Mistake 2: Ignoring the difference. "We just do not talk about that." This is avoidance \u2014 the belief that naming the difference will create conflict. It leads to a slow erosion of authenticity.\n\n' +
      'The alternative: hold both. Your values AND your partner\'s values are valid. They do not need to be the same. They need to be respected \u2014 and the differences need to be named, explored, and held with curiosity rather than judgment.\n\n' +
      'This is what we call "creative tension" \u2014 the idea that your differences are not obstacles to connection. They are resources for growth. The friction between your values and your partner\'s values is where something new can emerge \u2014 if you can stay in the tension long enough.',
    exerciseContent:
      'Look at your top 3 values from the assessment. Now guess your partner\'s top 3. Where do they overlap? Where do they diverge? Can you see the divergence as creative tension rather than a problem?',
    reflectionPrompt:
      'Our values overlap on: ___. They diverge on: ___. The divergence might be a resource because:',
  },
  {
    id: 'mc-values-alignment-lesson-2',
    courseId: 'mc-values-alignment',
    lessonNumber: 2,
    title: 'Where Values Clash \u2014 and What That Means',
    type: 'reframe',
    durationMinutes: 5,
    readContent:
      'When your values and your partner\'s values clash, your first instinct may be to decide who is right. The ACT perspective says: you are both right. Values are not facts that can be evaluated for correctness. They are directions \u2014 like compass points. Your partner is not wrong for valuing independence when you value closeness. They are just facing a different direction.\n\n' +
      'The deeper question is: can you build a relationship that honors both compass points? Can you move toward closeness WITHOUT requiring your partner to abandon their independence? Can they protect their autonomy WITHOUT leaving you alone?\n\n' +
      'If the answer is yes, you are describing differentiation. Two people, two compass points, one shared journey.\n\n' +
      'If the answer is "only if they change first" \u2014 that is the pattern talking. That is your attachment system demanding that the world conform to its need for certainty.\n\n' +
      'Gottman calls the unsolvable values differences "perpetual problems" and says they make up 69% of all relationship conflicts. The couples who thrive are the ones who can discuss them with humor and affection rather than with entrenched positions.',
    exerciseContent:
      'Pick one value where you and your partner diverge. Now answer: "How might their value SERVE the relationship, even though it frustrates me?"',
    reflectionPrompt: 'Their value of ___ serves our relationship by:',
  },
  {
    id: 'mc-values-alignment-lesson-3',
    courseId: 'mc-values-alignment',
    lessonNumber: 3,
    title: 'Shared Values as Compass',
    type: 'couple-exercise',
    durationMinutes: 5,
    readContent:
      'Alongside your differences, there are values you share. These are the foundation of your relationship \u2014 the compass that points you both in the same direction, even when the terrain is rough.\n\n' +
      'Gottman\'s research on "shared meaning" shows that couples who build rituals, roles, goals, and symbols around their shared values report significantly higher relationship satisfaction. It is not enough to know you share values. You need to live them together.\n\n' +
      'The Shared Values Conversation:\n\n' +
      'Sit with your partner and discuss:\n' +
      '1. What are 2-3 values we share? (Name them together)\n' +
      '2. How are we currently living these values in our relationship?\n' +
      '3. Where are we falling short?\n' +
      '4. What is one small thing we could do this week to move closer to one shared value?\n\n' +
      'This conversation should feel like dreaming together, not problem-solving. You are co-creating a vision, not diagnosing a dysfunction.',
    exerciseContent:
      'Have this conversation with your partner. If you are not ready for a face-to-face conversation, each write your answers separately and share them.',
    reflectionPrompt:
      'The shared value we want to live more fully this week:',
  },
  {
    id: 'mc-values-alignment-lesson-4',
    courseId: 'mc-values-alignment',
    lessonNumber: 4,
    title: 'Living Your Values This Week',
    type: 'behavioral-experiment',
    durationMinutes: 5,
    readContent:
      'Values without action are just words. The ACT principle of "committed action" says: the measure of a value is not whether you believe in it. It is whether you act on it, especially when it is hard.\n\n' +
      'This week, choose ONE valued direction and take a small, concrete step toward it. Not a grand gesture. A move that your partner will notice and that costs you something \u2014 some time, some comfort, some pride.\n\n' +
      'If you value presence: put your phone in another room during dinner. Every night.\n\n' +
      'If you value kindness: say one specific thing you appreciate about your partner, out loud, every day.\n\n' +
      'If you value honesty: share one feeling you have been holding back. Just one. Without needing a response.\n\n' +
      'If you value adventure: plan something unexpected for this weekend. It does not need to be big. Just different.\n\n' +
      'If you value safety: have the repair conversation you have been avoiding. Use the template from the conflict course.',
    exerciseContent:
      'Write your committed action for this week:\n\n' +
      '"The value I am moving toward: ___"\n' +
      '"The specific action I will take: ___"\n' +
      '"The day and time I will do it: ___"\n\n' +
      'Specificity matters. "I will be more present" is a wish. "I will put my phone in the bedroom at 6pm every evening this week" is a committed action.',
    reflectionPrompt: 'My specific committed action this week is:',
  },
  {
    id: 'mc-values-alignment-lesson-5',
    courseId: 'mc-values-alignment',
    lessonNumber: 5,
    title: 'Values Review \u2014 Walking Toward or Away?',
    type: 'reflection',
    durationMinutes: 5,
    readContent:
      'This is a practice you can return to again and again. In ACT, the values review is a regular check-in: am I walking toward what matters to me, or away from it?\n\n' +
      'It is not a judgment. It is a compass check. And the answer changes \u2014 sometimes week to week, sometimes hour to hour. There will be days when you walk toward your values with clarity and courage. There will be days when the old pattern pulls you sideways. Both are part of the journey.\n\n' +
      'The spiral, not the line. You will revisit the same themes. You will have the same argument again. You will fall back into the same pattern. And each time, if you notice it a little faster, recover a little quicker, or repair a little more skillfully \u2014 that is growth. Even if it does not feel like it.\n\n' +
      'Weekly Values Check-in (2 minutes):\n\n' +
      'Ask yourself:\n' +
      '1. This week, did I act in line with what matters most to me in this relationship?\n' +
      '2. Where did I drift?\n' +
      '3. What pulled me off course? (A trigger? A fear? The old pattern?)\n' +
      '4. What is one thing I want to do differently next week?\n\n' +
      'No beating yourself up. No promises to be perfect. Just honest observation and a gentle redirect.',
    exerciseContent:
      'Do the values check-in right now. Answer the four questions above. Notice how it feels to review without judging.',
    reflectionPrompt:
      'This week, I walked toward: ___. Next week, I want to adjust:',
  },
];

// ═══════════════════════════════════════════════════════════
//  COMBINED EXPORT
// ═══════════════════════════════════════════════════════════

export const ALL_LESSONS: MicroCourseLesson[] = [
  ...MC1_LESSONS,
  ...MC2_LESSONS,
  ...MC3_LESSONS,
  ...MC4_LESSONS,
  ...MC5_LESSONS,
  ...MC6_LESSONS,
];
