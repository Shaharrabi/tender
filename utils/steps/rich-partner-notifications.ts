/**
 * Rich Partner Notifications — Context-Aware Activity Messages
 *
 * Generates detailed, warm notification content when partners
 * complete steps, courses, or assessments. Includes what the
 * activity means and what the receiving partner can do.
 */

import { PATHWAY_ARCHETYPES, type PathwayId } from './pathway-archetypes';

// ─── Step Completion Notifications ───────────────────────

const STEP_NAMES: Record<number, string> = {
  1: 'Acknowledge the Strain',
  2: 'Trust the Relational Field',
  3: 'Release Certainty',
  4: 'Examine Our Part',
  5: 'Share Our Truths',
  6: 'Release the Enemy Story',
  7: 'Commit to Relational Practices',
  8: 'Prepare to Repair Harm',
  9: 'Act to Rebuild Trust',
  10: 'Maintain Ongoing Awareness',
  11: 'Seek Shared Insight',
  12: 'Carry the Message of Connection',
};

const STEP_CONTEXT: Record<number, string> = {
  1: 'This step is about learning to see relational patterns without blame. They\'re building awareness of the dance between you.',
  2: 'This step is about trusting that the space between you can hold more than either of you thought. They\'re learning to lean into connection.',
  3: 'This step is about softening rigid stories about you and the relationship. They\'re practicing curiosity over certainty.',
  4: 'This step is about owning their contribution to patterns without shame. They\'re moving from victim to agent.',
  5: 'This step is about vulnerable sharing — letting themselves be seen. This is one of the hardest steps.',
  6: 'This step is about releasing the protective story that kept them safe but kept you at arm\'s length.',
  7: 'This step is about turning insights into daily practice. They\'re building rituals of connection.',
  8: 'This step is about getting ready to face past hurts — not to reopen wounds, but to finally tend them.',
  9: 'This step is about showing change through action. They\'re demonstrating with behavior, not promises.',
  10: 'This step is about maintaining growth when old patterns try to return. They\'re building sustainable change.',
  11: 'This step is about listening to what the relationship itself is teaching. They\'re developing couple wisdom.',
  12: 'This step is about sharing what they\'ve learned. Their healing is becoming a gift to everyone around them.',
};

const STEP_PARTNER_HINTS: Record<number, string> = {
  1: 'You might notice them naming patterns out loud this week. That\'s the step talking.',
  2: 'They might seem more present or more intentional about connection. Receive it.',
  3: 'They might ask you questions they\'ve never asked before. Answer honestly.',
  4: 'They might apologize for things you didn\'t know bothered them. Accept gracefully.',
  5: 'They might share something vulnerable. The most important thing you can do: listen without fixing.',
  6: 'They might seem softer toward you. This is real, not a performance.',
  7: 'They might suggest new rituals or practices. Try them, even if they feel awkward at first.',
  8: 'They might bring up old hurts carefully. This isn\'t re-starting fights — it\'s trying to heal them.',
  9: 'You might notice them doing things differently — small changes. Name what you see: "I noticed you..."',
  10: 'They might catch themselves mid-pattern and correct course. That\'s growth in real time.',
  11: 'They might want to have deeper conversations about "us." Lean in.',
  12: 'They might seem more at peace. This is earned, not accidental.',
};

/**
 * Generate a rich step completion notification.
 */
export function getStepCompletionNotification(
  partnerName: string,
  stepNumber: number,
  pathwayId?: PathwayId | null,
): { title: string; body: string; hint: string } {
  const stepName = STEP_NAMES[stepNumber] ?? `Step ${stepNumber}`;
  const context = STEP_CONTEXT[stepNumber] ?? '';
  const hint = STEP_PARTNER_HINTS[stepNumber] ?? '';
  const pathway = pathwayId ? PATHWAY_ARCHETYPES[pathwayId] : null;

  const pathwaySuffix = pathway ? ` on ${pathway.name}` : '';

  return {
    title: `${partnerName} completed Step ${stepNumber}: ${stepName}`,
    body: `${context}${pathwaySuffix ? `\n\nThey\'re following ${pathway!.name} — ${pathway!.subtitle}.` : ''}`,
    hint,
  };
}

// ─── Course Completion Notifications ─────────────────────

const COURSE_CONTEXT: Record<string, { description: string; conversationStarter: string }> = {
  'mc-attachment-101': {
    description: 'They explored how attachment styles shape your relationship — why some people reach and others retreat.',
    conversationStarter: 'What did you learn about your attachment style?',
  },
  'mc-negative-cycle': {
    description: 'They mapped your negative cycle — the dance you both do when stress enters the room.',
    conversationStarter: 'Can you show me the cycle you mapped? I want to see how you see our dance.',
  },
  'mc-window-widening': {
    description: 'They practiced building regulation capacity — widening their window of tolerance for emotional intensity.',
    conversationStarter: 'What regulation technique worked best for you?',
  },
  'mc-edge-between-us': {
    description: 'They explored the boundary between closeness and individuality — the delicate edge where two selves meet.',
    conversationStarter: 'What did you discover about where you end and I begin?',
  },
  'mc-conflict-as-resource': {
    description: 'They explored how conflict can become a resource rather than a threat — creative tension that helps you grow.',
    conversationStarter: 'Did anything surprise you about how you handle conflict?',
  },
  'mc-family-echo': {
    description: 'They explored how childhood patterns echo in your relationship — the family-of-origin roots of current dynamics.',
    conversationStarter: 'What did you learn about your family patterns? Is there something you want to share with me?',
  },
  'mc-values-alignment': {
    description: 'They explored where your values converge and diverge — the shared ground and the creative tension between you.',
    conversationStarter: 'What values do you think we share most deeply?',
  },
  'mc-repair-101': {
    description: 'They practiced repair skills — the art of returning after rupture and rebuilding trust through action.',
    conversationStarter: 'Is there something between us you\'d like to repair?',
  },
};

/**
 * Generate a rich course completion notification.
 */
export function getCourseCompletionNotification(
  partnerName: string,
  courseId: string,
  courseName: string,
): { title: string; body: string; conversationStarter: string } {
  const context = COURSE_CONTEXT[courseId];

  if (context) {
    return {
      title: `${partnerName} finished ${courseName}`,
      body: context.description,
      conversationStarter: context.conversationStarter,
    };
  }

  return {
    title: `${partnerName} finished ${courseName}`,
    body: `They completed a course that deepens their understanding of your relationship. This is real investment in your future together.`,
    conversationStarter: `What was the most interesting thing you learned in ${courseName}?`,
  };
}

// ─── Assessment Completion Notifications ─────────────────

const ASSESSMENT_CONTEXT: Record<string, string> = {
  'ecr-r': 'Their attachment assessment just landed — revealing how they reach for connection and what happens when distance appears.',
  'tender-personality-60': 'Their personality assessment is in — showing who they are in love and how their personality shifts in the intimacy zone.',
  'sseit': 'Their emotional intelligence assessment revealed how they read and manage emotions — theirs and yours.',
  'dsi-r': 'Their differentiation assessment mapped how they hold their ground in closeness — boundaries, fusion, and self-leadership.',
  'dutch': 'Their conflict assessment showed their natural moves when disagreement arrives.',
  'values': 'Their values assessment mapped what matters most to them — and where their heart and their actions are aligned.',
  'rdas': 'They completed a couple assessment about your relationship quality. Your couple portrait just got richer.',
  'dci': 'They completed a couple assessment about how you cope with stress together. New insights about your partnership are available.',
  'csi-16': 'They completed a couple assessment about relationship satisfaction. Your couple portrait now has more depth.',
};

/**
 * Generate a rich assessment completion notification.
 */
export function getAssessmentCompletionNotification(
  partnerName: string,
  assessmentType: string,
): { title: string; body: string } {
  const context = ASSESSMENT_CONTEXT[assessmentType];

  return {
    title: `${partnerName} completed a new assessment`,
    body: context ?? `Their portrait just got richer — and so did your couple portrait. New insights are available in your couple portal.`,
  };
}
