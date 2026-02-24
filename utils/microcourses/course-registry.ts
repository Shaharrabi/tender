/**
 * Micro-Course Registry
 *
 * 14 micro-courses, each with 5 lessons (~20-30 min total per course).
 * Courses are placed at specific points in the healing journey
 * and gated by assessment prerequisites.
 */

import type { HealingPhase } from '@/types/growth';
import type { AttachmentStyle } from '@/types';

// ─── Types ──────────────────────────────────────────────

export interface MicroCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  totalLessons: number;
  estimatedMinutes: number;
  healingPhase: HealingPhase;
  phasePosition: 'start' | 'mid' | 'end';
  prerequisites: string[];
  weareVariable: string;
  primaryModality: string;
  hasAttachmentVariants: boolean;
  /** Icon name for display (from a hypothetical icon set) */
  icon: string;
}

export interface LessonProgress {
  lessonId: string;
  courseId: string;
  completed: boolean;
  completedAt?: string;
  reflectionText?: string;
}

export interface CourseProgress {
  courseId: string;
  lessonsCompleted: number;
  totalLessons: number;
  currentLesson: number;
  lastAccessedAt?: string;
  completedAt?: string;
}

// ─── Course Definitions ──────────────────────────────────

export const MICRO_COURSES: MicroCourse[] = [
  {
    id: 'mc-attachment-101',
    title: 'Understanding Your Attachment Pattern',
    subtitle: 'Where your pattern came from, how it shows up, and your first shift',
    description:
      'Five lessons that take you from understanding your attachment pattern to making your first intentional shift. You will learn where your pattern came from, how it shows up in your body and relationship, what your partner experiences, and how to begin changing the dance.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'seeing',
    phasePosition: 'end',
    prerequisites: ['ecr-r-complete'],
    weareVariable: 'individual',
    primaryModality: 'attachment-psychoeducation',
    hasAttachmentVariants: true,
    icon: 'heart-pulse',
  },
  {
    id: 'mc-regulation',
    title: 'Your Nervous System in Love',
    subtitle: 'Window of tolerance, activation signatures, and co-regulation',
    description:
      'Five lessons on your nervous system in relationships. Learn your window of tolerance, discover your personal activation signature, practice grounding when hyperaroused, waking up when shut down, and co-regulating with your partner.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'feeling',
    phasePosition: 'start',
    prerequisites: [],
    weareVariable: 'space',
    primaryModality: 'polyvagal-regulation',
    hasAttachmentVariants: false,
    icon: 'brain',
  },
  {
    id: 'mc-conflict-repair',
    title: 'From Rupture to Repair',
    subtitle: 'Why conflict is not the enemy, and how to come back from it',
    description:
      'Five lessons on transforming conflict from a threat into a doorway. Learn why conflict is not the enemy, identify the Four Horsemen, master the anatomy of repair, practice structured repair conversations, and build a repair culture.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'shifting',
    phasePosition: 'mid',
    prerequisites: [],
    weareVariable: 'attunement',
    primaryModality: 'gottman-eft',
    hasAttachmentVariants: false,
    icon: 'refresh-cw',
  },
  {
    id: 'mc-boundaries',
    title: 'Boundaries That Connect',
    subtitle: 'Not walls. Not punishment. Information that serves love.',
    description:
      'Five lessons on boundaries as an act of care. Learn what boundaries actually are, distinguish fusion from connection from distance, practice the I-Position, hold boundaries without guilt, and reframe boundaries as care rather than rejection.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'shifting',
    phasePosition: 'mid',
    prerequisites: [],
    weareVariable: 'space',
    primaryModality: 'bowen-act',
    hasAttachmentVariants: false,
    icon: 'shield',
  },
  {
    id: 'mc-act-defusion',
    title: 'Unhooking from the Story',
    subtitle: 'See the story your mind tells. Hold it lightly. Choose what matters.',
    description:
      'Five ACT-based lessons on defusing from the narratives that keep you stuck. Identify the story you carry about your partner, learn to see thoughts as thoughts, cultivate the observer self, practice willingness, and take committed action toward your values.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'feeling',
    phasePosition: 'mid',
    prerequisites: [],
    weareVariable: 'resistance',
    primaryModality: 'act',
    hasAttachmentVariants: false,
    icon: 'wind',
  },
  {
    id: 'mc-values-alignment',
    title: 'What Matters Most (Together)',
    subtitle: 'Your values, their values, and the shared compass you build',
    description:
      'Five lessons on living your values in relationship. Explore where your values overlap and diverge from your partner, reframe value clashes as creative tension, build shared meaning, take committed action toward what matters, and establish a weekly values review.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'shifting',
    phasePosition: 'start',
    prerequisites: ['values-complete'],
    weareVariable: 'coCreation',
    primaryModality: 'act-gottman',
    hasAttachmentVariants: false,
    icon: 'compass',
  },
  {
    id: 'mc-text-between-us',
    title: 'The Text Between Us',
    subtitle: 'How your attachment pattern lives inside your phone',
    description:
      'Five lessons on digital communication through an attachment lens. Discover your texting triggers, decode the missing data in text messages, practice rewriting reactive texts, and learn how your nervous system fills in the blanks when tone is absent.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'shifting',
    phasePosition: 'mid',
    prerequisites: ['ecr-r-complete'],
    weareVariable: 'attunement',
    primaryModality: 'communication-science',
    hasAttachmentVariants: true,
    icon: 'phone',
  },
  {
    id: 'mc-boundaries-deep',
    title: 'Boundaries Deep \u2014 The Body Knows',
    subtitle: 'What a boundary feels like before you speak it',
    description:
      'Five somatic lessons that take boundaries from concept to lived experience. Map where YES and NO live in your body, trace the cost of chronic override, practice holding the line while staying connected, and build boundary statements from the body up.',
    totalLessons: 5,
    estimatedMinutes: 30,
    healingPhase: 'shifting',
    phasePosition: 'end',
    prerequisites: ['mc-boundaries-complete'],
    weareVariable: 'space',
    primaryModality: 'somatic-bowen',
    hasAttachmentVariants: false,
    icon: 'meditation',
  },
  {
    id: 'mc-lightness-lab',
    title: 'The Lightness Lab \u2014 Play as Medicine',
    subtitle: 'Because play is not the opposite of depth. It is the method of depth.',
    description:
      'Five playful lessons on rebuilding the positive sentiment reservoir in your relationship. Take a bid census, map your relationship\'s lightness timeline, discover your play styles, try 30-second micro-games, and design a lightness ritual.',
    totalLessons: 5,
    estimatedMinutes: 20,
    healingPhase: 'feeling',
    phasePosition: 'mid',
    prerequisites: [],
    weareVariable: 'coCreation',
    primaryModality: 'gottman-positive-psychology',
    hasAttachmentVariants: false,
    icon: 'sparkle',
  },
  {
    id: 'mc-seen',
    title: 'Seen \u2014 The Art of Feeling Known',
    subtitle: 'The foundation of love that lasts is the feeling of being deeply known',
    description:
      'Five intimate lessons on cultivating deep knowing and genuine appreciation. Build a knowledge map of your partner\'s inner world, practice specific noticing, generate curiosity questions, write a gratitude transmission, and design a "being seen" ritual.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'sustaining',
    phasePosition: 'start',
    prerequisites: ['ecr-r-complete', 'values-complete'],
    weareVariable: 'attunement',
    primaryModality: 'gottman-gratitude',
    hasAttachmentVariants: false,
    icon: 'eye',
  },
  {
    id: 'mc-orientation-pleasure',
    title: 'Orientation to Pleasure',
    subtitle: 'What if healing started with what already feels good?',
    description:
      'Five lessons grounded in Organic Intelligence theory. Learn that healing begins by orienting toward what already feels good. Shatter pleasure myths, hunt for sensory treasures, build a pleasure palette, practice amplifying pleasant intensity, and create a daily orientation ritual.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'feeling',
    phasePosition: 'mid',
    prerequisites: [],
    weareVariable: 'space',
    primaryModality: 'organic-intelligence',
    hasAttachmentVariants: false,
    icon: 'sun',
  },
  {
    id: 'mc-bids-connection',
    title: 'Bids for Connection',
    subtitle: 'The tiny moments that make or break a relationship',
    description:
      'Five lessons on Gottman\'s bid framework. Learn to catch the small bids your partner makes every day, understand the three responses (turning toward, away, against), track your bid patterns, train your turning-toward reflex, and build a daily deposit ritual.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'shifting',
    phasePosition: 'mid',
    prerequisites: [],
    weareVariable: 'attunement',
    primaryModality: 'gottman-bids',
    hasAttachmentVariants: false,
    icon: 'chat-bubble',
  },
  {
    id: 'mc-fondness-gratitude',
    title: 'Fondness & Gratitude',
    subtitle: 'The antidote to contempt is cultivated admiration',
    description:
      'Five lessons on rebuilding fondness and gratitude. Assess your magic ratio of positive to negative interactions, excavate cherished memories, master specific appreciation, sprint through gratitude, and compose an appreciation letter to your partner.',
    totalLessons: 5,
    estimatedMinutes: 25,
    healingPhase: 'sustaining',
    phasePosition: 'mid',
    prerequisites: [],
    weareVariable: 'attunement',
    primaryModality: 'gottman-positive-psychology',
    hasAttachmentVariants: false,
    icon: 'heart',
  },
  {
    id: 'mc-trust-repair',
    title: 'Trust Repair \u2014 After Betrayal',
    subtitle: 'When the wound goes deeper than a bad fight',
    description:
      'Five advanced lessons on rebuilding trust after significant betrayal. Understand the anatomy of betrayal, sort genuine atonement from hollow apology, locate yourself on the rebuild timeline, practice structured repair conversations, and create your 90-day rebuild plan.',
    totalLessons: 5,
    estimatedMinutes: 30,
    healingPhase: 'shifting',
    phasePosition: 'end',
    prerequisites: ['mc-conflict-repair-complete'],
    weareVariable: 'attunement',
    primaryModality: 'gottman-eft-advanced',
    hasAttachmentVariants: false,
    icon: 'flag',
  },
];

// ─── Helpers ────────────────────────────────────────────

export function getCourseById(id: string): MicroCourse | undefined {
  return MICRO_COURSES.find((c) => c.id === id);
}

export function getCoursesForPhase(phase: HealingPhase): MicroCourse[] {
  return MICRO_COURSES.filter((c) => c.healingPhase === phase);
}

export function getNextCourse(
  completedCourseIds: string[]
): MicroCourse | undefined {
  // Return first course whose prerequisites are all met
  return MICRO_COURSES.find((course) => {
    if (completedCourseIds.includes(course.id)) return false;
    return course.prerequisites.every(
      (prereq) =>
        completedCourseIds.includes(prereq) ||
        // Assessment prereqs (not course prereqs) are assumed met
        !prereq.endsWith('-complete') ||
        !prereq.startsWith('mc-')
    );
  });
}

/**
 * Calculate course progress from lesson completions.
 */
export function calculateCourseProgress(
  courseId: string,
  lessonCompletions: LessonProgress[]
): CourseProgress {
  const course = getCourseById(courseId);
  if (!course) {
    return {
      courseId,
      lessonsCompleted: 0,
      totalLessons: 5,
      currentLesson: 0,
    };
  }

  const courseCompletions = lessonCompletions.filter(
    (lp) => lp.courseId === courseId && lp.completed
  );
  const lessonsCompleted = courseCompletions.length;
  const currentLesson = Math.min(lessonsCompleted, course.totalLessons - 1);

  const lastAccess = courseCompletions
    .filter((lp) => lp.completedAt)
    .sort(
      (a, b) =>
        new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
    )[0];

  return {
    courseId,
    lessonsCompleted,
    totalLessons: course.totalLessons,
    currentLesson: lessonsCompleted < course.totalLessons ? lessonsCompleted : course.totalLessons - 1,
    lastAccessedAt: lastAccess?.completedAt,
    completedAt:
      lessonsCompleted >= course.totalLessons
        ? lastAccess?.completedAt
        : undefined,
  };
}
