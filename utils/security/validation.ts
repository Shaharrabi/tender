/**
 * Security validation utilities
 *
 * Input sanitization, email validation, password strength checking,
 * and rate limiting helpers for Tender.
 */

import { Colors } from '@/constants/theme';

// ─── Email Validation ──────────────────────────────────

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// ─── Password Strength ─────────────────────────────────

export interface PasswordStrength {
  score: number; // 0-4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  color: string;
  feedback: string[];
}

export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters');

  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  else feedback.push('Mix of upper and lowercase');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Include a number');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('Include a special character');

  // Cap at 4
  score = Math.min(score, 4);

  const labels: PasswordStrength['label'][] = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = [Colors.error, Colors.accent, Colors.calm, Colors.primary, Colors.primaryDark];

  return {
    score,
    label: labels[score],
    color: colors[score],
    feedback,
  };
}

// ─── Input Sanitization ────────────────────────────────

/**
 * Sanitize text input — strips dangerous characters while
 * preserving normal punctuation and unicode.
 *
 * Matches the server-side sanitization in supabase/functions/chat/index.ts.
 * Both client and server sanitize as defense in depth.
 */
export function sanitizeTextInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/javascript\s*:/gi, '')   // Strip javascript: URIs (with optional whitespace)
    .replace(/on\w+\s*=/gi, '')        // Strip event handlers (onclick=, onerror=, etc.)
    .replace(/\x00/g, '')             // Strip null bytes
    .replace(/data\s*:[^,]*,/gi, '')  // Strip data: URIs (base64 payloads)
    .trim();
}

/**
 * Sanitize user-generated content for display.
 * More aggressive than sanitizeTextInput.
 */
export function sanitizeDisplayContent(input: string): string {
  return sanitizeTextInput(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Rate Limiting (Client-side) ───────────────────────

interface RateLimitState {
  attempts: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const rateLimitStore: Record<string, RateLimitState> = {};

const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  lockoutMs: 5 * 60 * 1000, // 5 minute lockout after too many attempts
};

export function checkRateLimit(key: string): {
  allowed: boolean;
  remainingAttempts: number;
  lockedUntilMs?: number;
} {
  const now = Date.now();
  const state = rateLimitStore[key];

  // No previous attempts
  if (!state) {
    return { allowed: true, remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts };
  }

  // Check if locked out
  if (state.lockedUntil && now < state.lockedUntil) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntilMs: state.lockedUntil - now,
    };
  }

  // Reset if window has passed
  if (now - state.firstAttempt > RATE_LIMIT_CONFIG.windowMs) {
    delete rateLimitStore[key];
    return { allowed: true, remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts };
  }

  const remaining = RATE_LIMIT_CONFIG.maxAttempts - state.attempts;
  return { allowed: remaining > 0, remainingAttempts: Math.max(0, remaining) };
}

export function recordAttempt(key: string): void {
  const now = Date.now();
  const state = rateLimitStore[key];

  if (!state || now - state.firstAttempt > RATE_LIMIT_CONFIG.windowMs) {
    rateLimitStore[key] = { attempts: 1, firstAttempt: now };
    return;
  }

  state.attempts++;

  // Lock out if too many attempts
  if (state.attempts >= RATE_LIMIT_CONFIG.maxAttempts) {
    state.lockedUntil = now + RATE_LIMIT_CONFIG.lockoutMs;
  }
}

export function clearRateLimit(key: string): void {
  delete rateLimitStore[key];
}

// ─── Partner Invite Code Validation ────────────────────

export function isValidInviteCode(code: string): boolean {
  // Invite codes are UUIDs
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return UUID_REGEX.test(code.trim());
}

// ─── Content Length Limits ─────────────────────────────

export const CONTENT_LIMITS = {
  chatMessage: 2000,
  reflection: 1000,
  note: 500,
  displayName: 50,
  inviteCode: 36,
} as const;

export function isWithinLimit(text: string, limit: keyof typeof CONTENT_LIMITS): boolean {
  return text.length <= CONTENT_LIMITS[limit];
}
