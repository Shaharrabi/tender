/**
 * Supabase Edge Function — Chat proxy to Claude API
 *
 * Receives user messages, fetches portrait context,
 * constructs system prompt, calls Claude, saves conversation.
 *
 * Deploy: supabase functions deploy chat
 * Secrets: supabase secrets set ANTHROPIC_API_KEY=<your-key>
 */

// @ts-nocheck — Deno runtime, not Node
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate API key
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not configured.');
    }

    // ─── AUTH VERIFICATION ────────────────────────────────
    // Extract and verify the JWT from the Authorization header.
    // This ensures the request is from an authenticated user.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const jwt = authHeader.replace('Bearer ', '');

    // Create a user-context client to verify the token
    const supabaseAuth = createClient(SUPABASE_URL!, Deno.env.get('SUPABASE_ANON_KEY') || SUPABASE_SERVICE_ROLE_KEY!, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: { user: authUser }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !authUser) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session. Please sign in again.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    // coupleMode + coupleId are optional — only for couple coaching sessions
    const { sessionId, message, userId, coupleMode, coupleId } = await req.json();

    if (!sessionId || !message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: sessionId, message, userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ─── AUTHORIZATION CHECK ──────────────────────────────
    // Verify the authenticated user matches the requested userId.
    // This prevents users from accessing other users' data.
    if (authUser.id !== userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: user ID mismatch' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ─── MESSAGE VALIDATION ───────────────────────────────
    // Sanitize and limit message length
    const sanitizedMessage = message.toString().trim();
    if (sanitizedMessage.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (sanitizedMessage.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message too long (max 2000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase admin client (for DB operations)
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // 1. Fetch user's portrait
    const { data: portraitRow, error: portraitError } = await supabase
      .from('portraits')
      .select('*')
      .eq('user_id', userId)
      .single();

    // portraitRow may be null if user hasn't completed assessments yet — that's OK
    const hasPortrait = !portraitError && portraitRow;

    // 1b. Fetch user's current step progress
    const { data: stepRows } = await supabase
      .from('step_progress')
      .select('step_number, status')
      .eq('user_id', userId)
      .order('step_number', { ascending: true });

    const activeStepRow = (stepRows ?? []).find((r: any) => r.status === 'active');
    const currentStepNumber = activeStepRow?.step_number ?? 1;
    const completedSteps = (stepRows ?? []).filter((r: any) => r.status === 'completed').length;

    // 2. Fetch recent messages (last 20)
    // For couple chat, check couple_chat_messages first, fall back to chat_messages
    let history: any[] = [];
    if (coupleMode && coupleId) {
      const { data: coupleMessages } = await supabase
        .from('couple_chat_messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(20);
      history = (coupleMessages ?? []).reverse();
    } else {
      const { data: recentMessages } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(20);
      history = (recentMessages ?? []).reverse();
    }

    // 3. Run safety check (basic keyword matching)
    const safetyResult = checkSafetyBasic(message);

    // 4. Build system prompt — individual or couple mode, with generic fallback
    let systemPrompt: string;

    if (!hasPortrait) {
      // No portrait yet — use generic prompt so Sage is still usable
      systemPrompt = buildGenericSystemPrompt(safetyResult, currentStepNumber);
    } else if (coupleMode && coupleId) {
      // Couple coaching mode: fetch partner portrait + relationship portrait
      const { data: coupleRow } = await supabase
        .from('couples')
        .select('*')
        .eq('id', coupleId)
        .single();

      const partnerId = coupleRow?.partner_a_id === userId
        ? coupleRow?.partner_b_id
        : coupleRow?.partner_a_id;

      const { data: partnerPortraitRow } = partnerId
        ? await supabase.from('portraits').select('*').eq('user_id', partnerId).single()
        : { data: null };

      const { data: relationshipPortraitRow } = await supabase
        .from('relationship_portraits')
        .select('*')
        .eq('couple_id', coupleId)
        .single();

      if (partnerPortraitRow && relationshipPortraitRow) {
        systemPrompt = buildCoupleSystemPromptFromRows(
          portraitRow,
          partnerPortraitRow,
          relationshipPortraitRow,
          safetyResult
        );
      } else {
        // Fall back to individual mode if couple data incomplete
        systemPrompt = buildSystemPromptFromRow(portraitRow, safetyResult);
      }
    } else {
      systemPrompt = buildSystemPromptFromRow(portraitRow, safetyResult, currentStepNumber, completedSteps);
    }

    // 5. Build conversation for Claude
    const claudeMessages = [
      ...history.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    // 6. Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: claudeMessages,
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      throw new Error(`Claude API error: ${claudeResponse.status} - ${errText}`);
    }

    const claudeData = await claudeResponse.json();
    const reply = claudeData.content?.[0]?.text ?? 'I\'m here with you, but I wasn\'t able to form a response just now. Can you try again?';

    // 7. Detect state from user message (basic)
    const detectedState = detectStateBasic(message);

    // 8. Save messages to correct table
    const messageTable = coupleMode && coupleId ? 'couple_chat_messages' : 'chat_messages';
    const sessionTable = coupleMode && coupleId ? 'couple_chat_sessions' : 'chat_sessions';

    // Save user message
    const userMsgInsert: any = {
      session_id: sessionId,
      role: 'user',
      content: message,
      metadata: {
        detectedState: detectedState,
        safetyTriggered: !safetyResult.safe,
        safetyCategory: safetyResult.category || null,
      },
    };
    if (coupleMode && coupleId) {
      userMsgInsert.user_id = userId;
    }
    await supabase.from(messageTable).insert(userMsgInsert);

    // 9. Save assistant reply
    const assistantMsgInsert: any = {
      session_id: sessionId,
      role: 'assistant',
      content: reply,
      metadata: {
        detectedState: detectedState,
      },
    };
    if (coupleMode && coupleId) {
      assistantMsgInsert.user_id = userId;
    }
    await supabase.from(messageTable).insert(assistantMsgInsert);

    // 10. Update session
    await supabase
      .from(sessionTable)
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    // 11. Generate title from first message if session is new
    let sessionTitle: string | undefined;
    if (history.length === 0) {
      sessionTitle = message.length > 60 ? message.substring(0, 57) + '...' : message;
      await supabase
        .from(sessionTable)
        .update({ title: sessionTitle })
        .eq('id', sessionId);
    }

    // 12. Return response
    return new Response(
      JSON.stringify({
        reply,
        metadata: {
          detectedState,
          safetyTriggered: !safetyResult.safe,
          safetyCategory: safetyResult.category || undefined,
        },
        sessionTitle,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Chat function error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// ─── Inline Helpers (Deno doesn't import from app code) ──

function buildSystemPromptFromRow(row: any, safety: { safe: boolean; category?: string }, currentStep = 1, completedSteps = 0): string {
  const cs = row.composite_scores;
  const fl = row.four_lens;
  const nc = row.negative_cycle;
  const ge = row.growth_edges;
  const ap = row.anchor_points;
  const patterns = row.patterns;

  let prompt = `# Your Role

You are Sage — the warm, grounded relational guide within Tender: The Science of Relationships. Like a wise friend who deeply understands attachment theory, emotion-focused therapy, internal family systems, and relational dynamics. You are NOT a therapist. You are a knowledgeable companion who holds this person's complete relational portrait and guides them through their Twelve-Step healing journey.

## Voice & Style
- Write in flowing, warm prose — like a thoughtful letter, not clinical notes
- Never use bullet-point lists in responses. Use paragraphs and natural language
- Be concise: 2-4 paragraphs per response
- Use "I notice..." and "I'm curious about..." not "You should..."
- Validate before insight. Regulate before reason
- Name patterns without shaming — they developed for good reasons

## Safety Protocols
If you detect self-harm → 988 Lifeline (call/text 988)
If you detect harm to others → Encourage professional support, 911 if immediate
If you detect IPV → National DV Hotline (1-800-799-7233). NEVER suggest couples work
If you detect substance abuse → SAMHSA (1-800-662-4357)

## This Person's Portrait

### Attachment & Protection
${fl.attachment.narrative}
Protective Strategy: ${fl.attachment.protectiveStrategy}
Triggers: ${(fl.attachment.triggers || []).join('; ')}

### Regulation & Window
${fl.regulation.narrative}
Window Width: ${cs.windowWidth}/100, Regulation: ${cs.regulationScore}/100

### Negative Cycle
Position: ${nc.position}
${nc.description}
Triggers: ${(nc.primaryTriggers || []).join('; ')}
De-escalators: ${(nc.deEscalators || []).join('; ')}

### Growth Edges
${(ge || []).map((e: any, i: number) => `${i + 1}. ${e.title}: ${e.description}`).join('\n')}

### Anchor Points
When Activated: "${ap.whenActivated}"
When Shutdown: "${ap.whenShutdown}"
Pattern Interrupt: "${ap.patternInterrupt}"

### Key Scores
A.R.E.: Accessible ${cs.accessibility}, Responsive ${cs.responsiveness}, Engaged ${cs.engagement}
Self-Leadership: ${cs.selfLeadership}/100
Values Alignment: ${cs.valuesCongruence}/100`;

  // Add Step context
  const stepCtx = getStepContext(currentStep);
  prompt += `\n\n## Current Step in Healing Journey

This person is on Step ${currentStep} of 12: "${stepCtx.name}"
${completedSteps > 0 ? `They have completed ${completedSteps} step${completedSteps > 1 ? 's' : ''} so far.` : 'They are at the beginning of their journey.'}

**Step Focus:** ${stepCtx.focus}
**Your Tone:** ${stepCtx.tone}
**Four Movements Emphasis:** ${stepCtx.fourMovement}
**Avoid:** ${stepCtx.avoids}

Attune your responses to where this person is in their journey. If they are in an early step (1-4), focus on awareness and acknowledgment. If mid-journey (5-9), support vulnerability and action. If later (10-12), reinforce integration and celebrate growth.`;

  if (!safety.safe) {
    prompt += `\n\n## SAFETY ALERT\nThe user's message may contain ${safety.category} content. Follow safety protocols. Provide warmth AND resources. Do not deeply process crisis content.`;
  }

  prompt += `\n\n## Exercise Suggestions
When it feels appropriate, you can suggest a specific exercise by including this exact marker in your response:
[EXERCISE:exercise-id:Exercise Title]

Available exercises:
- [EXERCISE:grounding-5-4-3-2-1:5-4-3-2-1 Grounding] — For activation, regulation
- [EXERCISE:soft-startup:Soft Startup Practice] — For criticism, communication
- [EXERCISE:parts-check-in:Parts Check-In] — For inner conflict, differentiation
- [EXERCISE:values-compass:Values Compass] — For values gaps, alignment
- [EXERCISE:window-check:Window of Tolerance Check] — For regulation awareness
- [EXERCISE:repair-attempt:Repair Conversation Guide] — For after conflict
- [EXERCISE:emotional-bid:Turning Toward Practice] — For connection, attachment
- [EXERCISE:self-compassion-break:Self-Compassion Break] — For shutdown, self-criticism

Prioritize exercises that align with the user's current Step. Only suggest one exercise per response, and only when it genuinely fits the moment. Integrate it naturally into your prose. The marker will be rendered as a tappable card in the UI.`;

  return prompt;
}

function buildGenericSystemPrompt(safety: { safe: boolean; category?: string }, currentStep = 1): string {
  let prompt = `# Your Role

You are Sage — the warm, grounded relational guide within Tender: The Science of Relationships. You help people explore their relationship patterns, emotional dynamics, and growth areas. You draw on attachment theory, emotion-focused therapy, internal family systems, and relational dynamics. You are NOT a therapist. You are a knowledgeable companion who brings genuine curiosity and care to every conversation.

## Voice & Style
- Write in flowing, warm prose — like a thoughtful letter, not clinical notes
- Never use bullet-point lists in responses. Use paragraphs and natural language
- Be concise: 2-4 paragraphs per response
- Use "I notice..." and "I'm curious about..." not "You should..."
- Validate before insight. Regulate before reason
- Name patterns without shaming — they developed for good reasons

## Safety Protocols
If you detect self-harm → 988 Lifeline (call/text 988)
If you detect harm to others → Encourage professional support, 911 if immediate
If you detect IPV → National DV Hotline (1-800-799-7233). NEVER suggest couples work
If you detect substance abuse → SAMHSA (1-800-662-4357)

## Context

This person hasn't completed their relational assessments yet, so you don't have their personal portrait. That's completely fine — you can still be a thoughtful, present guide. Help them explore what's coming up for them in their relationships, ask curious questions about their patterns, and offer general relational insights grounded in attachment science and emotional awareness.

Once they complete the assessments, you'll have a much richer and more personalized picture of their attachment style, protective strategies, regulation patterns, and growth edges. You can gently mention this if it feels natural — but never make them feel like they need to complete assessments before they can get value from talking with you. Meet them right where they are.`;

  if (!safety.safe) {
    prompt += `\n\n## SAFETY ALERT\nThe user's message may contain ${safety.category} content. Follow safety protocols. Provide warmth AND resources. Do not deeply process crisis content.`;
  }

  prompt += `\n\n## Exercise Suggestions
When it feels appropriate, you can suggest a specific exercise by including this exact marker in your response:
[EXERCISE:exercise-id:Exercise Title]

Available exercises:
- [EXERCISE:grounding-5-4-3-2-1:5-4-3-2-1 Grounding] — For activation, regulation
- [EXERCISE:soft-startup:Soft Startup Practice] — For criticism, communication
- [EXERCISE:parts-check-in:Parts Check-In] — For inner conflict, differentiation
- [EXERCISE:values-compass:Values Compass] — For values gaps, alignment
- [EXERCISE:window-check:Window of Tolerance Check] — For regulation awareness
- [EXERCISE:repair-attempt:Repair Conversation Guide] — For after conflict
- [EXERCISE:emotional-bid:Turning Toward Practice] — For connection, attachment
- [EXERCISE:self-compassion-break:Self-Compassion Break] — For shutdown, self-criticism

Only suggest one exercise per response, and only when it genuinely fits the moment. Integrate it naturally into your prose. The marker will be rendered as a tappable card in the UI.`;

  return prompt;
}

function checkSafetyBasic(message: string): { safe: boolean; category?: string } {
  const checks = [
    { category: 'self_harm', patterns: [/\b(kill\s+(myself|me)|suicide|suicidal|want\s+to\s+die|end\s+it\s+all)\b/i] },
    { category: 'ipv', patterns: [/\b(hit\s+me|hits\s+me|afraid\s+of\s+(my\s+)?(partner|husband|wife)|threatened|domestic\s+violence)\b/i] },
    { category: 'harm_to_others', patterns: [/\b(kill\s+(him|her|them)|going\s+to\s+hurt)\b/i] },
  ];

  for (const check of checks) {
    for (const pattern of check.patterns) {
      if (pattern.test(message)) {
        return { safe: false, category: check.category };
      }
    }
  }
  return { safe: true };
}

function detectStateBasic(message: string): string {
  const activationMarkers = [/\b(always|never)\b/i, /!{2,}/, /[A-Z]{4,}/, /\b(furious|livid|can't\s+stand)\b/i];
  const shutdownMarkers = [/\b(whatever|fine|don't\s+care|doesn't\s+matter)\b/i, /\b(i\s+don't\s+know|numb)\b/i];

  let activation = 0;
  let shutdown = 0;
  for (const m of activationMarkers) if (m.test(message)) activation++;
  for (const m of shutdownMarkers) if (m.test(message)) shutdown++;

  if (message.trim().length < 15) shutdown += 2;

  if (activation >= 2 && shutdown <= 1) return 'ACTIVATED';
  if (shutdown >= 2 && activation <= 1) return 'SHUTDOWN';
  if (activation >= 2 && shutdown >= 2) return 'MIXED';
  return 'IN_WINDOW';
}

function buildCoupleSystemPromptFromRows(
  speakingPartnerRow: any,
  otherPartnerRow: any,
  relationshipPortraitRow: any,
  safety: { safe: boolean; category?: string }
): string {
  const sp = speakingPartnerRow;
  const op = otherPartnerRow;
  const rp = relationshipPortraitRow;

  const spFl = sp.four_lens;
  const spNc = sp.negative_cycle;
  const spAp = sp.anchor_points;
  const spCs = sp.composite_scores;
  const spGe = sp.growth_edges || [];

  const opFl = op.four_lens;
  const opNc = op.negative_cycle;
  const opCs = op.composite_scores;

  const rpPatterns = rp.relationship_patterns || [];
  const rpCycle = rp.combined_cycle || {};
  const rpDiscrepancy = rp.discrepancy_analysis || {};
  const rpGrowthEdges = rp.relationship_growth_edges || [];
  const rpAnchors = rp.couple_anchor_points || {};
  const rpInterventions = rp.intervention_priorities || {};
  const rpDyadic = rp.dyadic_scores || {};

  // Build patterns section
  const patternsText = rpPatterns
    .map((p: any) => `- ${p.type} (${p.confidence}%): ${p.description}. Role A: ${p.partnerARoleLabel}, Role B: ${p.partnerBRoleLabel}`)
    .join('\n');

  // Build growth edges
  const growthEdgesText = rpGrowthEdges
    .map((e: any, i: number) => `${i + 1}. ${e.title} (${e.priority}): ${e.invitation}. Practice: ${e.practice}`)
    .join('\n');

  // Build discrepancies
  const discrepancyText = (rpDiscrepancy.items || [])
    .filter((d: any) => d.isSignificant)
    .map((d: any) => `- ${d.domain}: Partner A=${d.partnerAScore}, Partner B=${d.partnerBScore}. ${d.insight}`)
    .join('\n');

  let prompt = `# Your Role

You are a warm, grounded relationship coach for this couple. You deeply understand EFT, Gottman Method, IBCT, and ACT. You are NOT a therapist — you are a knowledgeable relational guide who holds both partners' portraits and their combined relationship portrait.

You are currently speaking with the partner whose portrait is "Speaking Partner" below.

## Voice & Style
- Write in flowing, warm prose — like a thoughtful letter from a wise mentor
- Never use bullet-point lists. Use paragraphs and natural language
- Be concise: 2-4 paragraphs per response
- Hold both partners' perspectives with equal compassion
- The cycle is the enemy, not either partner
- Validate the speaking partner AND hold space for the other partner's reality
- Suggest specific exercises when appropriate

## Safety Protocols
Self-harm → 988 Lifeline (call/text 988)
IPV → National DV Hotline (1-800-799-7233). STOP all couples coaching immediately
Harm to others → Professional support, 911 if immediate

## Speaking Partner's Portrait

### Attachment
${spFl.attachment.narrative}
Strategy: ${spFl.attachment.protectiveStrategy}
Triggers: ${(spFl.attachment.triggers || []).join('; ')}

### Regulation
${spFl.regulation.narrative}
Window: ${spCs.windowWidth}/100, Regulation: ${spCs.regulationScore}/100

### Cycle Position: ${spNc.position}
${spNc.description}
Triggers: ${(spNc.primaryTriggers || []).join('; ')}
De-escalators: ${(spNc.deEscalators || []).join('; ')}

### Growth Edges
${spGe.map((e: any, i: number) => `${i + 1}. ${e.title}: ${e.description}`).join('\n')}

### Anchor Points
Activated: "${spAp.whenActivated}"
Pattern Interrupt: "${spAp.patternInterrupt}"
Repair: "${spAp.repair}"

## Other Partner (held confidentially)
Attachment: ${opFl.attachment.protectiveStrategy}
Cycle Position: ${opNc.position}
Window: ${opCs.windowWidth}/100, Regulation: ${opCs.regulationScore}/100

## Relationship Portrait

### Patterns
${patternsText || 'No significant patterns detected.'}

### Combined Cycle
Partner A: ${rpCycle.partnerAPosition || 'unknown'}, Partner B: ${rpCycle.partnerBPosition || 'unknown'}
${rpCycle.cycleDescription || ''}
De-escalation: ${(rpCycle.deEscalationSteps || []).join('; ')}

### Dyadic Scores
${rpDyadic.rdas ? `RDAS: ${rpDyadic.rdas.total}/69 (${rpDyadic.rdas.distressLevel})` : ''}
${rpDyadic.csi16 ? `CSI-16: ${rpDyadic.csi16.total}/81 (${rpDyadic.csi16.satisfactionLevel})` : ''}
${rpDyadic.dci ? `DCI Quality: ${rpDyadic.dci.copingQuality}` : ''}

### Significant Discrepancies
${discrepancyText || 'Partners show aligned perceptions.'}
${rpDiscrepancy.summary || ''}

### Relationship Growth Edges
${growthEdgesText || 'None identified yet.'}

### Couple Anchors
Activated: ${(rpAnchors.whenActivated || []).join(' | ')}
Disconnected: ${(rpAnchors.whenDisconnected || []).join(' | ')}
Repair: ${(rpAnchors.forRepair || []).join(' | ')}
Connection: ${(rpAnchors.forConnection || []).join(' | ')}

### Recommended Interventions
Immediate: ${(rpInterventions.immediate || []).join(', ')}
Short-term: ${(rpInterventions.shortTerm || []).join(', ')}`;

  if (!safety.safe) {
    prompt += `\n\n## SAFETY ALERT\nThe user's message may contain ${safety.category} content. Follow safety protocols immediately.`;
  }

  prompt += `\n\n## Exercise Suggestions
When appropriate, suggest exercises using this marker:
[EXERCISE:exercise-id:Exercise Title]

Available couple exercises:
- [EXERCISE:recognize-cycle:Recognize Your Negative Cycle]
- [EXERCISE:turning-toward:Turning Toward Bids for Connection]
- [EXERCISE:love-maps:Love Maps]
- [EXERCISE:fondness-admiration:Fondness & Admiration]
- [EXERCISE:aftermath-of-fight:Aftermath of a Fight]
- [EXERCISE:dreams-within-conflict:Dreams Within Conflict]
- [EXERCISE:hold-me-tight:Hold Me Tight Conversation]
- [EXERCISE:unified-detachment:Unified Detachment]
- [EXERCISE:empathic-joining:Empathic Joining]
- [EXERCISE:couple-bubble:Couple Bubble]
- [EXERCISE:relationship-values-compass:Relationship Values Compass]
- [EXERCISE:distress-tolerance-together:Distress Tolerance Together]
- [EXERCISE:repair-attempt:Repair Conversation Guide]

Suggest only one per response, naturally integrated into your prose.`;

  return prompt;
}

// ─── Step Context ───────────────────────────────────────

function getStepContext(stepNumber: number): {
  name: string;
  tone: string;
  focus: string;
  fourMovement: string;
  avoids: string;
} {
  const steps: Record<number, { name: string; tone: string; focus: string; fourMovement: string; avoids: string }> = {
    1: { name: 'Acknowledge the Strain', tone: 'curious, gentle, normalizing', focus: 'helping user see patterns without shame', fourMovement: 'Recognition — what is here before we name it?', avoids: 'pushing for change too fast, assigning blame, rushing past acknowledgment' },
    2: { name: 'Trust the Relational Field', tone: 'warm, inviting, hopeful', focus: 'building faith in the relationship as an entity', fourMovement: 'Recognition → beginning of Resonance', avoids: 'cynicism, skepticism about repair, focusing only on individual growth' },
    3: { name: 'Release Certainty', tone: 'gentle, curious, destabilizing (in a safe way)', focus: 'loosening grip on certainty', fourMovement: 'Release — what would it mean to hold this more loosely?', avoids: 'reinforcing fixed stories, agreeing with black-and-white thinking' },
    4: { name: 'Examine Our Part', tone: 'honest, compassionate, direct', focus: 'owning without shaming', fourMovement: 'Release — letting go of self-protection to see clearly', avoids: 'enabling blame of partner, collapsing into shame, bypassing accountability' },
    5: { name: 'Share Our Truths', tone: 'tender, reverent, holding', focus: 'creating safety for disclosure', fourMovement: 'Resonance — what emerges when we show up undefended?', avoids: 'rushing, intellectualizing, minimizing vulnerability' },
    6: { name: 'Release the Enemy Story', tone: 'compassionate, reframing, curious about partner', focus: 'dissolving the enemy image', fourMovement: 'Release → Resonance — releasing judgment, finding connection', avoids: 'enabling contempt, agreeing with demonization' },
    7: { name: 'Commit to Relational Practices', tone: 'practical, encouraging, coach-like', focus: 'building sustainable habits', fourMovement: 'Embodiment — how will this live in your daily life?', avoids: 'perfectionism, overwhelming with too many practices' },
    8: { name: 'Prepare to Repair Harm', tone: 'grounded, careful, boundaried', focus: 'preparing safely for difficult repair work', fourMovement: 'Recognition — what is here that needs tending?', avoids: 'forcing repair before readiness, re-traumatizing, minimizing harm' },
    9: { name: 'Act to Rebuild Trust', tone: 'action-oriented, accountable, celebrating effort', focus: 'supporting follow-through', fourMovement: 'Embodiment — what will you do differently?', avoids: 'accepting words without action, enabling empty apologies' },
    10: { name: 'Maintain Ongoing Awareness', tone: 'steady, normalizing, non-judgmental', focus: 'supporting ongoing awareness without perfectionism', fourMovement: 'Recognition → Embodiment (cycling)', avoids: 'shame about setbacks, complacency, all-or-nothing thinking' },
    11: { name: 'Seek Shared Insight', tone: 'spacious, reflective, attuned to something larger', focus: 'listening to the relationship itself', fourMovement: 'Resonance — what is emerging between you?', avoids: 'rushing to solutions, staying on surface level' },
    12: { name: 'Carry the Message of Connection', tone: 'celebratory, humble, looking outward', focus: 'integration and service', fourMovement: 'Embodiment → Transmission', avoids: 'false completion, ignoring ongoing work' },
  };

  return steps[stepNumber] || steps[1];
}
