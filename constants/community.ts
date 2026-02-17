/**
 * Community constants — alias system, categories, prompts, resources, and theme.
 */

import type { ComponentType } from 'react';
import type { PostCategory, HealingPhase } from '@/types/community';
import type { IconProps } from '@/assets/graphics/icons';
import {
  EyeIcon,
  HeartIcon,
  RefreshIcon,
  PuzzleIcon,
  SeedlingIcon,
  LinkIcon,
  ChatBubbleIcon,
  BrainIcon,
  ShieldIcon,
  CompassIcon,
  LeafIcon,
  HandshakeIcon,
  MasksIcon,
  LightningIcon,
  ChartBarIcon,
  SparkleIcon,
} from '@/assets/graphics/icons';
import { Colors } from '@/constants/theme';

// ─── Alias Generation ───────────────────────────────────────

export const ALIAS_ADJECTIVES = [
  'Gentle', 'Quiet', 'Warm', 'Tender', 'Steady',
  'Brave', 'Soft', 'True', 'Open', 'Kind',
  'Calm', 'Deep', 'Bright', 'Free', 'Still',
  'Clear', 'Wise', 'Bold', 'Safe', 'Whole',
] as const;

export const ALIAS_NOUNS = [
  'River', 'Harbor', 'Garden', 'Meadow', 'Shore',
  'Lantern', 'Bridge', 'Compass', 'Anchor', 'Feather',
  'Willow', 'Ember', 'Pebble', 'Cloud', 'Bloom',
  'Tide', 'Nest', 'Path', 'Dawn', 'Root',
] as const;

export const ALIAS_COLORS = [
  '#6BA3A0',  // calm teal
  '#C4616E',  // dusty rose
  '#7294D4',  // lobby blue
  '#D8A499',  // terracotta
  '#D4A843',  // concierge gold
  '#6B9080',  // muted sage
  '#5B6B8A',  // depth indigo
  '#8B6914',  // ochre
  '#C6CDF7',  // lavender haze
  '#F1BB7B',  // budapest cream
] as const;

/** Generate a random alias (adjective + noun + color). */
export function generateAlias(): { adjective: string; noun: string; color: string } {
  const adjective = ALIAS_ADJECTIVES[Math.floor(Math.random() * ALIAS_ADJECTIVES.length)];
  const noun = ALIAS_NOUNS[Math.floor(Math.random() * ALIAS_NOUNS.length)];
  const color = ALIAS_COLORS[Math.floor(Math.random() * ALIAS_COLORS.length)];
  return { adjective, noun, color };
}

/** Check if an alias should be auto-rotated (30+ days since last rotation). */
export function shouldRotateAlias(rotatedAt: string): boolean {
  const rotatedDate = new Date(rotatedAt);
  const now = new Date();
  const diffDays = (now.getTime() - rotatedDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 30;
}

// ─── Community Colors (Wes Anderson warm palette) ───────────

export const CommunityColors = {
  cardBackground: '#FDF6EE',
  cardBorder: '#E8DDD0',
  quoteAccent: '#C4956A',
  cardShadow: '#8B7355',
  warmDarkBrown: '#4A3728',
} as const;

// ─── Categories ─────────────────────────────────────────────

export const CATEGORIES: string[] = [
  'All',
  'Attachment',
  'Communication',
  'Conflict',
  'Emotions',
  'Growth',
  'Values',
  'Intimacy',
];

export const POST_CATEGORIES: PostCategory[] = [
  'Attachment',
  'Communication',
  'Conflict',
  'Emotions',
  'Growth',
  'Values',
  'Intimacy',
];

// ─── Healing Phases ─────────────────────────────────────────

export const HEALING_PHASES: { key: HealingPhase; label: string; Icon: ComponentType<IconProps> }[] = [
  { key: 'seeing', label: 'Seeing', Icon: EyeIcon },
  { key: 'feeling', label: 'Feeling', Icon: HeartIcon },
  { key: 'shifting', label: 'Shifting', Icon: RefreshIcon },
  { key: 'integrating', label: 'Integrating', Icon: PuzzleIcon },
  { key: 'sustaining', label: 'Sustaining', Icon: SeedlingIcon },
];

// ─── Writing Prompts ────────────────────────────────────────

export const WRITING_PROMPTS = [
  "What's alive in your relationship right now?",
  'A moment of connection I want to remember...',
  "Something I'm learning about myself...",
  'Something shifted when...',
] as const;

// ─── Letter Prompts (fallback for when no DB prompt is active) ─

export const LETTER_PROMPTS = [
  'What I wish someone had told me when I first realized my pattern...',
  'The moment I knew repair was possible...',
  'Dear younger me, about love...',
  'What "being brave in love" actually looks like for me...',
  'The smallest thing my partner does that means the most...',
  'When I stopped trying to fix and started trying to feel...',
  'The boundary that changed everything...',
  "What I'm learning about the space between us...",
  'To someone who feels like too much or not enough...',
  'The practice that surprised me...',
  "What I want my partner to know but haven't said yet...",
  'A moment of ordinary magic in my relationship...',
] as const;

// ─── Curated Resources ─────────────────────────────────────

export interface CuratedResource {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  Icon: ComponentType<IconProps>;
  iconColor: string;
  source: string;
}

export const CURATED_RESOURCES: CuratedResource[] = [
  {
    id: '1',
    title: '5 Signs of a Secure Relationship',
    category: 'Attachment',
    description: 'Secure relationships share recognizable patterns. Learn the key indicators that signal a healthy, stable bond between partners.',
    readTime: '6 min read',
    Icon: LinkIcon,
    iconColor: Colors.primary,
    source: 'The Gottman Institute',
  },
  {
    id: '2',
    title: 'The Soft Startup: How to Begin Difficult Conversations',
    category: 'Communication',
    description: 'The first three minutes of a conversation predict the outcome. Discover how a gentle approach changes everything.',
    readTime: '5 min read',
    Icon: ChatBubbleIcon,
    iconColor: Colors.primary,
    source: 'The Gottman Institute',
  },
  {
    id: '3',
    title: 'Understanding Your Window of Tolerance',
    category: 'Emotions',
    description: 'Your window of tolerance determines how well you handle stress. Learn to recognize when you are inside or outside your zone.',
    readTime: '7 min read',
    Icon: BrainIcon,
    iconColor: '#5B6B8A',
    source: 'Dr. Dan Siegel',
  },
  {
    id: '4',
    title: 'The Four Horsemen and How to Counter Them',
    category: 'Conflict',
    description: 'Criticism, contempt, defensiveness, and stonewalling predict relationship failure. Here are the antidotes that work.',
    readTime: '8 min read',
    Icon: ShieldIcon,
    iconColor: Colors.secondary,
    source: 'The Gottman Institute',
  },
  {
    id: '5',
    title: 'Values-Based Living in Relationships',
    category: 'Values',
    description: 'When partners align their daily actions with their deepest values, relationships become more meaningful and resilient.',
    readTime: '6 min read',
    Icon: CompassIcon,
    iconColor: '#8B6914',
    source: 'Dr. Russ Harris',
  },
  {
    id: '6',
    title: 'Why Vulnerability is Strength',
    category: 'Growth',
    description: 'Letting your guard down with your partner is not weakness. Research shows vulnerability is the birthplace of connection.',
    readTime: '5 min read',
    Icon: SeedlingIcon,
    iconColor: Colors.primary,
    source: 'Brene Brown',
  },
  {
    id: '7',
    title: 'The Difference Between Reacting and Responding',
    category: 'Emotions',
    description: 'Reactions are automatic; responses are chosen. Learn practical techniques to create space between stimulus and choice.',
    readTime: '4 min read',
    Icon: SparkleIcon,
    iconColor: Colors.calm,
    source: 'Dr. Viktor Frankl',
  },
  {
    id: '8',
    title: 'Turning Toward: Small Moments That Build Trust',
    category: 'Intimacy',
    description: 'Trust is built in the smallest of moments. Discover how everyday bids for connection strengthen your bond over time.',
    readTime: '5 min read',
    Icon: HandshakeIcon,
    iconColor: Colors.primary,
    source: 'The Gottman Institute',
  },
  {
    id: '9',
    title: 'IFS: Getting to Know Your Inner Parts',
    category: 'Growth',
    description: 'Internal Family Systems offers a compassionate way to understand the different parts of yourself that show up in relationships.',
    readTime: '7 min read',
    Icon: MasksIcon,
    iconColor: '#6BA3A0',
    source: 'Dr. Richard Schwartz',
  },
  {
    id: '10',
    title: 'When Conflict Triggers Your Nervous System',
    category: 'Conflict',
    description: 'Your body keeps the score during arguments. Learn to notice flooding and use co-regulation to return to connection.',
    readTime: '6 min read',
    Icon: LightningIcon,
    iconColor: Colors.accent,
    source: 'Dr. Stephen Porges',
  },
  {
    id: '11',
    title: 'The 5:1 Ratio in Happy Relationships',
    category: 'Communication',
    description: 'Stable relationships maintain five positive interactions for every negative one. Learn how to shift your ratio intentionally.',
    readTime: '4 min read',
    Icon: ChartBarIcon,
    iconColor: Colors.secondary,
    source: 'The Gottman Institute',
  },
  {
    id: '12',
    title: 'Differentiation: Being Close Without Losing Yourself',
    category: 'Growth',
    description: 'Healthy intimacy requires holding onto yourself while staying connected. Explore the balance of togetherness and autonomy.',
    readTime: '8 min read',
    Icon: LeafIcon,
    iconColor: Colors.primary,
    source: 'Dr. David Schnarch',
  },
];
