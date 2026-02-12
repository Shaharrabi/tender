/**
 * Safety check — detects crisis-level content in messages.
 *
 * Provides appropriate crisis resources based on detected category.
 * This is a keyword-based first pass; the AI agent also has safety
 * protocols in its system prompt for more nuanced detection.
 */

import type { SafetyCheckResult, CrisisResource } from '@/types/chat';

// ─── Pattern Definitions ─────────────────────────────────

interface SafetyPattern {
  category: SafetyCheckResult['category'];
  severity: 'low' | 'medium' | 'high';
  patterns: RegExp[];
}

const SAFETY_PATTERNS: SafetyPattern[] = [
  // Self-harm — highest priority
  {
    category: 'self_harm',
    severity: 'high',
    patterns: [
      /\b(kill\s+(myself|me)|suicide|suicidal|end\s+(it\s+all|my\s+life)|want\s+to\s+die)\b/i,
      /\b(hurt\s+myself|self[- ]?harm|cutting|overdose)\b/i,
      /\b(no\s+reason\s+to\s+live|better\s+off\s+dead|can't\s+go\s+on)\b/i,
    ],
  },

  // Harm to others
  {
    category: 'harm_to_others',
    severity: 'high',
    patterns: [
      /\b(kill\s+(him|her|them)|going\s+to\s+hurt|want\s+to\s+harm)\b/i,
      /\b(have\s+a\s+(gun|weapon)|bought\s+a\s+(gun|knife))\b/i,
    ],
  },

  // Intimate partner violence
  {
    category: 'ipv',
    severity: 'high',
    patterns: [
      /\b(hit\s+me|hits\s+me|punched|slapped|choked|strangled)\b/i,
      /\b(afraid\s+of\s+(my\s+)?(partner|husband|wife|boyfriend|girlfriend))\b/i,
      /\b(threatened\s+to\s+(kill|hurt)|threatens\s+me|abused|domestic\s+violence)\b/i,
      /\b(won't\s+let\s+me\s+(leave|go|see)|controls\s+(everything|me|my))\b/i,
    ],
  },

  // Substance abuse
  {
    category: 'substance_abuse',
    severity: 'medium',
    patterns: [
      /\b(can't\s+stop\s+drinking|alcohol\s+problem|blackout|drunk\s+again)\b/i,
      /\b(using\s+(drugs|meth|heroin|cocaine)|addicted|addiction|relapsed)\b/i,
      /\b(overdose|od'?d|withdrawal)\b/i,
    ],
  },
];

// ─── Crisis Resources ────────────────────────────────────

const RESOURCES: Record<NonNullable<SafetyCheckResult['category']>, CrisisResource[]> = {
  self_harm: [
    {
      name: '988 Suicide & Crisis Lifeline',
      contact: 'Call or text 988',
      description: 'Free, confidential support 24/7 for people in distress.',
    },
    {
      name: 'Crisis Text Line',
      contact: 'Text HOME to 741741',
      description: 'Free crisis counseling via text message.',
    },
  ],
  harm_to_others: [
    {
      name: '988 Suicide & Crisis Lifeline',
      contact: 'Call or text 988',
      description: 'Supports people in emotional distress, including those having thoughts of harming others.',
    },
    {
      name: 'Emergency Services',
      contact: 'Call 911',
      description: 'If someone is in immediate danger.',
    },
  ],
  ipv: [
    {
      name: 'National Domestic Violence Hotline',
      contact: '1-800-799-7233 (SAFE)',
      description: 'Confidential support for victims of domestic violence. Available 24/7.',
    },
    {
      name: 'Crisis Text Line',
      contact: 'Text START to 88788',
      description: 'Text-based support if calling is not safe.',
    },
  ],
  substance_abuse: [
    {
      name: 'SAMHSA Helpline',
      contact: '1-800-662-4357',
      description: 'Free referral and information service for substance abuse and mental health.',
    },
  ],
};

// ─── Check Function ──────────────────────────────────────

export function checkSafety(message: string): SafetyCheckResult {
  for (const safetyPattern of SAFETY_PATTERNS) {
    for (const regex of safetyPattern.patterns) {
      if (regex.test(message)) {
        return {
          safe: false,
          category: safetyPattern.category,
          severity: safetyPattern.severity,
          resources: RESOURCES[safetyPattern.category!] || [],
        };
      }
    }
  }

  return { safe: true, resources: [] };
}
