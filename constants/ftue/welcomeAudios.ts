/**
 * Welcome Audio Configs — Maps screen keys to welcome audio files.
 *
 * Each screen has an optional audio file that plays the first time
 * the user enters. Set source to null for screens without audio yet.
 */

import { AVPlaybackSource } from 'expo-av';

export interface WelcomeAudioConfig {
  /** Screen key (matches FirstTimeContext.heardAudios entries) */
  screenKey: string;
  /** Display title in the audio player bar */
  title: string;
  /** Display subtitle */
  subtitle: string;
  /** Audio file source (null = no audio available yet) */
  source: AVPlaybackSource | null;
}

export const WELCOME_AUDIO_CONFIGS: Record<string, WelcomeAudioConfig> = {
  assessment: {
    screenKey: 'assessment',
    title: 'About the Assessment',
    subtitle: 'What to expect',
    source: require('@/assets/audio/welcome_assessment.mp3'),
  },
  courses: {
    screenKey: 'courses',
    title: 'Learning Courses',
    subtitle: 'How courses work',
    source: require('@/assets/audio/welcome_courses.mp3'),
  },
  journal: {
    screenKey: 'journal',
    title: 'Your Journal',
    subtitle: 'Tracking your growth',
    source: require('@/assets/audio/welcome_journal.mp3'),
  },
  portrait: {
    screenKey: 'portrait',
    title: 'Your Portrait',
    subtitle: 'Understanding your results',
    source: require('@/assets/audio/welcome_portrait.mp3'),
  },
  // Audio files not yet recorded — gracefully skipped
  community: {
    screenKey: 'community',
    title: 'Community',
    subtitle: 'Stories and resources',
    source: null,
  },
  results: {
    screenKey: 'results',
    title: 'Your Results',
    subtitle: 'Understanding your scores',
    source: null,
  },
  portal: {
    screenKey: 'portal',
    title: 'Relationship Portal',
    subtitle: 'The space between you',
    source: null,
  },
};
