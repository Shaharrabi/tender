/**
 * Support Groups — Type Definitions
 *
 * Attachment-based group therapy support (The Reach / The Retreat).
 */

import type { AttachmentStyle } from './index';

// ─── Enums ────────────────────────────────────────────

export type SupportGroupType = 'anxious' | 'avoidant';
export type MemberStatus = 'pending' | 'active' | 'waitlisted' | 'inactive';
export type GroupStatus = 'forming' | 'active' | 'completed' | 'paused';
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

// ─── Database Models ──────────────────────────────────

export interface SupportGroup {
  id: string;
  groupType: SupportGroupType;
  name: string;
  description: string | null;
  maxMembers: number;
  cohortNumber: number;
  zoomLink: string | null;
  scheduleDay: string | null;
  scheduleTime: string | null;
  scheduleTimezone: string;
  durationMinutes: number;
  currentStep: number;
  status: GroupStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportGroupMember {
  id: string;
  groupId: string;
  userId: string;
  preferredName: string | null;
  timezone: string | null;
  preferredTimes: string[] | null;
  inTherapy: boolean | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  consentGiven: boolean;
  consentGivenAt: string | null;
  status: MemberStatus;
  waitlistPosition: number | null;
  attachmentStyle: AttachmentStyle | null;
  anxietyScore: number | null;
  avoidanceScore: number | null;
  registrationData: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupportGroupSession {
  id: string;
  groupId: string;
  sessionNumber: number;
  stepNumber: number;
  sessionDate: string;
  sessionTime: string | null;
  zoomLink: string | null;
  status: SessionStatus;
  facilitatorNotes: string | null;
  createdAt: string;
}

export interface SupportGroupAttendance {
  id: string;
  sessionId: string;
  userId: string;
  attended: boolean;
  personalNotes: string | null;
  reflection: Record<string, any> | null;
  createdAt: string;
}

// ─── Registration Form ────────────────────────────────

export interface RegistrationFormData {
  preferredName: string;
  timezone: string;
  preferredTimes: string[];
  inTherapy: boolean | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
  consentGiven: boolean;
}

// ─── Adapted Step Content ─────────────────────────────

export interface AdaptedStep {
  stepNumber: number;
  standardTitle: string;
  adaptedTitle: string;
  groupFocus: string;
  reflectionPrompts: string[];
}

// ─── Routing ──────────────────────────────────────────

export interface GroupRecommendation {
  recommendedGroup: SupportGroupType | null;
  reason: string;
  attachmentStyle: AttachmentStyle | null;
  isFearfulAvoidant: boolean;
}
