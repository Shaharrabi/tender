/**
 * The Field — 8 Game Scenarios
 *
 * Each scenario presents 3 choices that map to attachment traits
 * and WEARE-compatible point values. Your choices build your
 * "dating constellation" — the pattern of energies you bring
 * to new connections.
 */

import {
  CompassIcon,
  MirrorIcon,
  WaveIcon,
  PersonIcon,
  MailboxIcon,
  LinkIcon,
  WindIcon,
} from '@/assets/graphics/icons';
import type { GameScenario } from '@/types/dating';

export const GAME_SCENARIOS: GameScenario[] = [
  {
    id: 'entrance',
    scene: 'You enter a dimly lit room. Two doors ahead.',
    icon: CompassIcon,
    options: [
      { text: 'Rush to the brighter door', trait: 'pursuer', points: { anxious: 2, openness: 1 } },
      { text: 'Stand still. Listen first.', trait: 'observer', points: { secure: 2, presence: 1 } },
      { text: 'Check for the exit behind you', trait: 'protector', points: { avoidant: 2, caution: 1 } },
    ],
  },
  {
    id: 'mirror',
    scene: 'A mirror shows you, but 5 years from now. What do you notice first?',
    icon: MirrorIcon,
    options: [
      { text: 'Am I alone or with someone?', trait: 'connection-seeker', points: { anxious: 1, intimacy: 2 } },
      { text: 'Do I look happy?', trait: 'self-aware', points: { secure: 1, growth: 2 } },
      { text: 'Is that really me?', trait: 'questioning', points: { fearful: 1, depth: 2 } },
    ],
  },
  {
    id: 'music',
    scene: "Music starts playing. It's a song that reminds you of someone.",
    icon: WaveIcon,
    options: [
      { text: 'Let the feeling wash over you', trait: 'feeler', points: { openness: 2, vulnerability: 1 } },
      { text: 'Change the song', trait: 'controller', points: { avoidant: 1, independence: 2 } },
      { text: 'Sit down and remember', trait: 'processor', points: { secure: 1, depth: 2 } },
    ],
  },
  {
    id: 'stranger',
    scene: "A stranger appears. They look kind but you can't read them.",
    icon: PersonIcon,
    options: [
      { text: 'Say hello immediately', trait: 'initiator', points: { anxious: 1, courage: 2 } },
      { text: 'Smile and wait for them to speak', trait: 'receiver', points: { secure: 2, patience: 1 } },
      { text: 'Observe them from a distance first', trait: 'scanner', points: { avoidant: 1, caution: 2 } },
    ],
  },
  {
    id: 'gift',
    scene: "The stranger hands you a sealed envelope. 'This is what I see in you.'",
    icon: MailboxIcon,
    options: [
      { text: 'Open it immediately \u2014 you need to know', trait: 'eager', points: { anxious: 2, openness: 1 } },
      { text: 'Thank them and open it later, alone', trait: 'private', points: { avoidant: 1, independence: 2 } },
      { text: "Open it together \u2014 'Read it with me?'", trait: 'connector', points: { secure: 2, intimacy: 1 } },
    ],
  },
  {
    id: 'bridge',
    scene: 'A bridge appears over dark water. It only holds one at a time.',
    icon: LinkIcon,
    options: [
      { text: "Cross first \u2014 you'll catch them on the other side", trait: 'leader', points: { courage: 2, anxious: 1 } },
      { text: "Let them go first \u2014 you'll follow", trait: 'supporter', points: { patience: 2, avoidant: 1 } },
      { text: 'Find another way across together', trait: 'creative', points: { secure: 1, growth: 2 } },
    ],
  },
  {
    id: 'storm',
    scene: 'A storm rolls in. The stranger reaches for your hand.',
    icon: WindIcon,
    options: [
      { text: 'Take their hand without hesitation', trait: 'trust-leaper', points: { vulnerability: 2, intimacy: 1 } },
      { text: 'Hesitate, then take it', trait: 'cautious-connector', points: { fearful: 1, growth: 2 } },
      { text: "Say 'I'm okay' and stand on your own", trait: 'self-reliant', points: { avoidant: 2, independence: 1 } },
    ],
  },
  {
    id: 'door',
    scene: "You reach the final door. It says: 'What you bring matters more than what you find.'",
    icon: CompassIcon,
    options: [
      { text: 'I bring my whole messy heart', trait: 'authentic', points: { vulnerability: 2, courage: 1 } },
      { text: "I bring curiosity about who's on the other side", trait: 'curious', points: { openness: 2, presence: 1 } },
      { text: "I bring myself \u2014 and that's enough", trait: 'grounded', points: { secure: 2, growth: 1 } },
    ],
  },
];

/** Human-readable archetype names for each trait key */
export const ARCHETYPE_NAMES: Record<string, string> = {
  secure: 'The Steady Flame',
  anxious: 'The Bright Seeker',
  avoidant: 'The Lone Star',
  fearful: 'The Tender Storm',
  openness: 'The Open Window',
  vulnerability: 'The Brave Heart',
  courage: 'The First Step',
  patience: 'The Long Game',
  growth: 'The Spiral',
  intimacy: 'The Deep Diver',
  independence: 'The Free Range',
  depth: 'The Still Water',
  presence: 'The Here & Now',
  caution: 'The Careful Keeper',
};
