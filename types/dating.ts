/**
 * Dating Well — Type Definitions
 *
 * Types for the Dating Well feature: "The Art of Beginning"
 * Covers: The Field game, My Shape profile, Discover, Rooms, Letters, Journal
 */

import type React from 'react';

// ─── Game Types ──────────────────────────────────────────────

/** A single answer in The Field game */
export interface GameAnswer {
  scenarioId: string;
  choiceIndex: number;
  trait: string;
  points: Record<string, number>;
}

/** Trait scores from all game answers aggregated */
export type ArchetypeScores = Record<string, number>;

/** The user's dating constellation — top 3 traits */
export interface ConstellationResult {
  /** Top 3 trait keys, ordered by score */
  topTraits: string[];
  /** Full score breakdown for all traits */
  allScores: ArchetypeScores;
  /** WEARE variable mappings derived from constellation */
  weareMapping: Record<string, number>;
}

/** Icon component props for scenario icons */
export interface IconProps {
  size: number;
  color: string;
}

/** A single game scenario with 3 options */
export interface GameScenario {
  id: string;
  scene: string;
  icon: React.ComponentType<IconProps>;
  options: GameOption[];
}

export interface GameOption {
  text: string;
  trait: string;
  points: Record<string, number>;
}

// ─── Profile Types ───────────────────────────────────────────

/** User's dating preferences */
export interface DatingPreferences {
  genderIdentity: string[];
  lookingFor: string[];
  ageRangeMin: number;
  ageRangeMax: number;
  locationRadius: string | null;
  kids: string | null;
  smoking: string | null;
  drinking: string | null;
  relationshipStyle: string | null;
  therapyStance: string | null;
  spirituality: string | null;
  conflictStyle: string | null;
  loveLanguages: string[];
}

/** Full dating profile (DB row mapped to TS) */
export interface DatingProfile {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

  // Game results
  constellation: ConstellationResult | null;
  gameAnswers: GameAnswer[] | null;
  archetypeScores: ArchetypeScores | null;

  // Preferences
  preferences: DatingPreferences;

  // Bio / Letter
  bio: string | null;

  // Visibility
  isActive: boolean;
  isVisible: boolean;
}

// ─── Letter Types ────────────────────────────────────────────

/** A slow letter between two users */
export interface DatingLetter {
  id: string;
  senderId: string;
  recipientId: string;
  sentAt: string;
  content: string;
  isRead: boolean;
  replyDeadline: string;
  expired: boolean;
}

// ─── Room Types ──────────────────────────────────────────────

/** Room activity record */
export interface DatingRoomActivity {
  id: string;
  userId: string;
  roomType: string;
  content: Record<string, any> | null;
  createdAt: string;
}

/** A V2 meeting room */
export interface MeetingRoom {
  name: string;
  desc: string;
  people: number;
  icon: string;
  Icon?: React.ComponentType<IconProps>;
  status: 'active' | 'upcoming' | 'closed';
  prompt: string;
}

/** A V1 hotel room */
export interface HotelRoom {
  id: string;
  floor: string;
  name: string;
  subtitle: string;
  icon: string;
  Icon?: React.ComponentType<IconProps>;
  color: string;
  description: string;
  content: HotelRoomContent;
}

export type HotelRoomContentType =
  | 'self-check'
  | 'pattern-reveal'
  | 'practices'
  | 'scenarios'
  | 'signals'
  | 'journal'
  | 'transition';

export interface HotelRoomContent {
  type: HotelRoomContentType;
  [key: string]: any;
}

// ─── Journal Types ───────────────────────────────────────────

/** A private dating journal entry */
export interface DatingJournalEntry {
  id: string;
  userId: string;
  createdAt: string;
  bodyToldMe: string | null;
  surprisedMe: string | null;
  carryForward: string | null;
  dateContext: string | null;
}

// ─── Preference Field Types ──────────────────────────────────

export type PreferenceFieldType = 'multi' | 'single' | 'range';

export interface PreferenceField {
  id: string;
  label: string;
  type: PreferenceFieldType;
  options?: string[];
  min?: number;
  max?: number;
}

export interface PreferenceSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  Icon?: React.ComponentType<IconProps>;
  fields: PreferenceField[];
}

// ─── Compatibility Types ─────────────────────────────────────

export interface CompatibilityDimension {
  key: string;
  label: string;
  desc: string;
  icon: string;
  color: string;
}

// ─── Archetype Names ─────────────────────────────────────────

export interface ArchetypeDefinition {
  key: string;
  name: string;
  description: string;
}

// ─── Pattern Types (for Reading Room) ────────────────────────

export interface AttachmentPattern {
  style: string;
  attachment: string;
  color: string;
  icon: string;
  tendency: string;
  gift: string;
  edge: string;
  practice: string;
}

// ─── Practice Types (for Parlor) ─────────────────────────────

export interface DatingPractice {
  principle: string;
  name: string;
  time: string;
  instruction: string;
  why: string;
  weare: string;
}

// ─── Scenario Types (for Ballroom) ───────────────────────────

export interface DateScenario {
  title: string;
  setup: string;
  options: DateScenarioOption[];
}

export interface DateScenarioOption {
  label: string;
  result: 'growth' | 'notice';
  feedback: string;
}

// ─── Signal Types (for Observatory) ──────────────────────────

export interface DatingSignal {
  signal: string;
  weare?: string;
  note?: string;
  body?: string;
}

// ─── Transition Guidepost (for Rooftop) ──────────────────────

export interface TransitionGuidepost {
  title: string;
  text: string;
  practice: string;
}
