/**
 * Dating Well — Service Layer
 *
 * Supabase CRUD for dating_profiles, dating_letters,
 * dating_room_activity, and dating_journal tables.
 */

import { supabase } from './supabase';
import type {
  DatingProfile,
  DatingPreferences,
  DatingLetter,
  DatingRoomActivity,
  DatingJournalEntry,
  ConstellationResult,
  GameAnswer,
  ArchetypeScores,
} from '@/types/dating';

// ─── Mappers ─────────────────────────────────────────────────

function mapDatingProfile(row: any): DatingProfile {
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    constellation: row.constellation,
    gameAnswers: row.game_answers,
    archetypeScores: row.archetype_scores,
    preferences: {
      genderIdentity: row.gender_identity || [],
      lookingFor: row.looking_for || [],
      ageRangeMin: row.age_range_min ?? 18,
      ageRangeMax: row.age_range_max ?? 80,
      locationRadius: row.location_radius,
      kids: row.kids,
      smoking: row.smoking,
      drinking: row.drinking,
      relationshipStyle: row.relationship_style,
      therapyStance: row.therapy_stance,
      spirituality: row.spirituality,
      conflictStyle: row.conflict_style,
      loveLanguages: row.love_languages || [],
    },
    bio: row.bio,
    isActive: row.is_active ?? true,
    isVisible: row.is_visible ?? true,
  };
}

function mapDatingLetter(row: any): DatingLetter {
  return {
    id: row.id,
    senderId: row.sender_id,
    recipientId: row.recipient_id,
    sentAt: row.sent_at,
    content: row.content,
    isRead: row.is_read ?? false,
    replyDeadline: row.reply_deadline,
    expired: row.expired ?? false,
  };
}

function mapRoomActivity(row: any): DatingRoomActivity {
  return {
    id: row.id,
    userId: row.user_id,
    roomType: row.room_type,
    content: row.content,
    createdAt: row.created_at,
  };
}

function mapJournalEntry(row: any): DatingJournalEntry {
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    bodyToldMe: row.body_told_me,
    surprisedMe: row.surprised_me,
    carryForward: row.carry_forward,
    dateContext: row.date_context,
  };
}

// ─── Dating Profile ──────────────────────────────────────────

/** Get user's dating profile */
export async function getDatingProfile(userId: string): Promise<DatingProfile | null> {
  const { data, error } = await supabase
    .from('dating_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return mapDatingProfile(data);
}

/** Save game results to dating profile (upsert) */
export async function saveGameResults(
  userId: string,
  gameAnswers: GameAnswer[],
  constellation: ConstellationResult,
  archetypeScores: ArchetypeScores,
): Promise<DatingProfile> {
  const { data, error } = await supabase
    .from('dating_profiles')
    .upsert(
      {
        user_id: userId,
        game_answers: gameAnswers,
        constellation: constellation,
        archetype_scores: archetypeScores,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) throw error;
  return mapDatingProfile(data);
}

/** Update dating profile preferences */
export async function updateDatingProfile(
  userId: string,
  updates: {
    preferences?: Partial<DatingPreferences>;
    bio?: string;
    isActive?: boolean;
    isVisible?: boolean;
  },
): Promise<DatingProfile> {
  const dbUpdates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.preferences) {
    const p = updates.preferences;
    if (p.genderIdentity !== undefined) dbUpdates.gender_identity = p.genderIdentity;
    if (p.lookingFor !== undefined) dbUpdates.looking_for = p.lookingFor;
    if (p.ageRangeMin !== undefined) dbUpdates.age_range_min = p.ageRangeMin;
    if (p.ageRangeMax !== undefined) dbUpdates.age_range_max = p.ageRangeMax;
    if (p.locationRadius !== undefined) dbUpdates.location_radius = p.locationRadius;
    if (p.kids !== undefined) dbUpdates.kids = p.kids;
    if (p.smoking !== undefined) dbUpdates.smoking = p.smoking;
    if (p.drinking !== undefined) dbUpdates.drinking = p.drinking;
    if (p.relationshipStyle !== undefined) dbUpdates.relationship_style = p.relationshipStyle;
    if (p.therapyStance !== undefined) dbUpdates.therapy_stance = p.therapyStance;
    if (p.spirituality !== undefined) dbUpdates.spirituality = p.spirituality;
    if (p.conflictStyle !== undefined) dbUpdates.conflict_style = p.conflictStyle;
    if (p.loveLanguages !== undefined) dbUpdates.love_languages = p.loveLanguages;
  }

  if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
  if (updates.isVisible !== undefined) dbUpdates.is_visible = updates.isVisible;

  const { data, error } = await supabase
    .from('dating_profiles')
    .update(dbUpdates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return mapDatingProfile(data);
}

/** Check if user has completed The Field game */
export async function hasCompletedGame(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('dating_profiles')
    .select('constellation')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  return data.constellation !== null;
}

// ─── Dating Letters ──────────────────────────────────────────

/** Send a letter to another user */
export async function sendLetter(
  senderId: string,
  recipientId: string,
  content: string,
): Promise<DatingLetter> {
  const { data, error } = await supabase
    .from('dating_letters')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return mapDatingLetter(data);
}

/** Get letters for a user (sent or received) */
export async function getLettersForUser(userId: string): Promise<DatingLetter[]> {
  const { data, error } = await supabase
    .from('dating_letters')
    .select('*')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('sent_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapDatingLetter);
}

/** Mark a letter as read */
export async function markLetterRead(letterId: string): Promise<void> {
  const { error } = await supabase
    .from('dating_letters')
    .update({ is_read: true })
    .eq('id', letterId);

  if (error) throw error;
}

// ─── Room Activity ───────────────────────────────────────────

/** Save room activity */
export async function saveRoomActivity(
  userId: string,
  roomType: string,
  content?: Record<string, any>,
): Promise<DatingRoomActivity> {
  const { data, error } = await supabase
    .from('dating_room_activity')
    .insert({
      user_id: userId,
      room_type: roomType,
      content: content || null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRoomActivity(data);
}

/** Get room activity for a user */
export async function getRoomActivity(
  userId: string,
  roomType?: string,
): Promise<DatingRoomActivity[]> {
  let query = supabase
    .from('dating_room_activity')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (roomType) {
    query = query.eq('room_type', roomType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapRoomActivity);
}

// ─── Dating Journal ──────────────────────────────────────────

/** Save a dating journal entry */
export async function saveDatingJournal(
  userId: string,
  entry: {
    bodyToldMe?: string;
    surprisedMe?: string;
    carryForward?: string;
    dateContext?: string;
  },
): Promise<DatingJournalEntry> {
  const { data, error } = await supabase
    .from('dating_journal')
    .insert({
      user_id: userId,
      body_told_me: entry.bodyToldMe || null,
      surprised_me: entry.surprisedMe || null,
      carry_forward: entry.carryForward || null,
      date_context: entry.dateContext || null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapJournalEntry(data);
}

/** Get dating journal entries for a user */
export async function getDatingJournalEntries(userId: string): Promise<DatingJournalEntry[]> {
  const { data, error } = await supabase
    .from('dating_journal')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapJournalEntry);
}
