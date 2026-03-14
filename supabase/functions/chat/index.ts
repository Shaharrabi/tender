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

// ─── CORS — restrict to your domains only ────────────
const PRODUCTION_ORIGINS = [
  'https://tender-science.netlify.app',
];

function isAllowedOrigin(origin: string): boolean {
  // Production origins — exact match
  if (PRODUCTION_ORIGINS.includes(origin)) return true;
  // Local development — allow any localhost / 127.0.0.1 port
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowedOrigin = isAllowedOrigin(origin) ? origin : PRODUCTION_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// ─── Rate Limiting (in-memory, per-function-instance) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 15;       // max messages per window
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
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
        { status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    const jwt = authHeader.replace('Bearer ', '');

    // Create a user-context client to verify the token.
    // Use the SERVICE ROLE KEY for verification — it has full access to validate any JWT.
    // The ANON KEY format may vary across projects; service role is guaranteed to work.
    const supabaseAuth = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: { user: authUser }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !authUser) {
      const debugInfo = {
        authError: authError?.message || 'no user returned',
        hasUrl: !!SUPABASE_URL,
        hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
        jwtPrefix: jwt.substring(0, 20) + '...',
      };
      console.error('[chat] Auth failed:', JSON.stringify(debugInfo));
      return new Response(
        JSON.stringify({
          error: 'Invalid or expired session. Please sign in again.',
          debug: debugInfo,
        }),
        { status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    // coupleMode + coupleId are optional — only for couple coaching sessions
    // stream flag — client requests streaming via Accept header or body param
    const acceptHeader = req.headers.get('Accept') || '';
    const body = await req.json();
    const { sessionId, message, userId, coupleMode, coupleId } = body;
    const clientWantsStream = acceptHeader.includes('text/event-stream') || body.stream === true;

    if (!sessionId || !message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: sessionId, message, userId' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // ─── AUTHORIZATION CHECK ──────────────────────────────
    // Verify the authenticated user matches the requested userId.
    // This prevents users from accessing other users' data.
    if (authUser.id !== userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: user ID mismatch' }),
        { status: 403, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // ─── RATE LIMITING ─────────────────────────────────────
    if (!checkRateLimit(authUser.id)) {
      return new Response(
        JSON.stringify({ error: 'Too many messages. Please wait a moment before trying again.' }),
        { status: 429, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // ─── MESSAGE VALIDATION & SANITIZATION ──────────────────
    // Defense in depth — never trust client-side sanitization alone.
    // Strip HTML tags, javascript: URIs, event handlers, and null bytes.
    const sanitizedMessage = message
      .toString()
      .replace(/<[^>]*>/g, '')           // Strip HTML tags
      .replace(/javascript\s*:/gi, '')   // Strip javascript: URIs
      .replace(/on\w+\s*=/gi, '')        // Strip event handlers (onclick=, onerror=, etc.)
      .replace(/\x00/g, '')             // Strip null bytes
      .replace(/data\s*:[^,]*,/gi, '')  // Strip data: URIs (base64 payloads)
      .trim();
    if (sanitizedMessage.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }
    if (sanitizedMessage.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message too long (max 2000 characters)' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase admin client (for DB operations)
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    console.log('[chat] Processing message for user:', userId, 'session:', sessionId);

    // 0. Fetch user's relationship mode + demo partner
    const { data: profileRow } = await supabase
      .from('user_profiles')
      .select('relationship_mode, demo_partner_id')
      .eq('user_id', userId)
      .single();

    const relationshipMode = profileRow?.relationship_mode || 'solo';
    const demoPartnerId = profileRow?.demo_partner_id || null;

    // 1. Fetch user's portrait
    const { data: portraitRow, error: portraitError } = await supabase
      .from('portraits')
      .select('*')
      .eq('user_id', userId)
      .single();

    // portraitRow may be null if user hasn't completed assessments yet — that's OK
    const hasPortrait = !portraitError && portraitRow;

    // 1b. Fetch user's current step progress (includes started_at for days-in-step)
    const { data: stepRows } = await supabase
      .from('step_progress')
      .select('step_number, status, started_at, reflection_notes')
      .eq('user_id', userId)
      .order('step_number', { ascending: true });

    const activeStepRow = (stepRows ?? []).find((r: any) => r.status === 'active');
    const currentStepNumber = activeStepRow?.step_number ?? 1;
    const completedSteps = (stepRows ?? []).filter((r: any) => r.status === 'completed').length;

    // Calculate days in current step
    let daysInStep = 0;
    if (activeStepRow?.started_at) {
      const started = new Date(activeStepRow.started_at);
      daysInStep = Math.max(1, Math.ceil((Date.now() - started.getTime()) / (1000 * 60 * 60 * 24)));
    }

    // 1b2. Count practices completed for current step
    const { count: practicesCompletedForStep } = await supabase
      .from('practice_completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('step_number', currentStepNumber);

    const stepPracticeCount = practicesCompletedForStep ?? 0;

    // ─── NEW: Fetch rich user data for context-aware coaching ──────

    // 1c. Fetch recent daily check-ins (last 7 days of mood/relationship data)
    const { data: checkInRows } = await supabase
      .from('daily_check_ins')
      .select('checkin_date, mood_rating, relationship_rating, practiced_growth_edge, note')
      .eq('user_id', userId)
      .order('checkin_date', { ascending: false })
      .limit(7);

    // 1d. Fetch recent exercise completions (last 10)
    const { data: exerciseRows } = await supabase
      .from('exercise_completions')
      .select('exercise_id, exercise_name, reflection, rating, step_responses, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(10);

    // 1e. Fetch recent daily reflections (last 5)
    const { data: reflectionRows } = await supabase
      .from('daily_reflections')
      .select('reflection_date, question_responses, free_text, day_tags')
      .eq('user_id', userId)
      .order('reflection_date', { ascending: false })
      .limit(5);

    // 1f. Fetch assessment history (types and dates, not raw scores — just awareness)
    const { data: assessmentRows } = await supabase
      .from('assessments')
      .select('type, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(10);

    // 1g. Fetch growth edge progress
    const { data: growthEdgeRows } = await supabase
      .from('growth_edge_progress')
      .select('edge_id, stage, practice_count, insights, milestones')
      .eq('user_id', userId);

    // 1h. Fetch all exercise completion IDs (for protocol growth progress)
    const { data: allCompletionIds } = await supabase
      .from('exercise_completions')
      .select('exercise_id')
      .eq('user_id', userId);

    // 1i. Fetch all practice completion IDs
    const { data: allPracticeIds } = await supabase
      .from('practice_completions')
      .select('practice_id')
      .eq('user_id', userId);

    console.log('[chat] Context loaded — portrait:', !!hasPortrait, 'checkIns:', (checkInRows ?? []).length, 'exercises:', (exerciseRows ?? []).length, 'reflections:', (reflectionRows ?? []).length);

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
    //
    // We split into two layers for Anthropic prompt caching:
    //   stablePrompt  — portrait, coaching rules, protocol context (cached)
    //   dynamicPrompt — check-ins, exercises, journal, mode context (not cached)
    //
    // The stable portion is identical across messages in a session, so caching
    // saves ~90% on input tokens after the first turn.
    let stablePrompt: string;
    let dynamicPrompt = '';

    if (!hasPortrait) {
      // No portrait yet — use generic prompt so Nuance is still usable
      stablePrompt = buildGenericSystemPrompt(safetyResult, currentStepNumber, completedSteps, daysInStep, stepPracticeCount);
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

      // Fetch latest WEARE score for this couple (optional)
      const { data: weareRow } = await supabase
        .from('weare_scores')
        .select('*')
        .eq('couple_id', coupleId)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (partnerPortraitRow && relationshipPortraitRow) {
        stablePrompt = buildCoupleSystemPromptFromRows(
          portraitRow,
          partnerPortraitRow,
          relationshipPortraitRow,
          safetyResult,
          weareRow
        );
      } else {
        // Fall back to individual mode if couple data incomplete
        stablePrompt = buildSystemPromptFromRow(portraitRow, safetyResult, currentStepNumber, completedSteps, daysInStep, stepPracticeCount);
      }
    } else {
      stablePrompt = buildSystemPromptFromRow(portraitRow, safetyResult, currentStepNumber, completedSteps, daysInStep, stepPracticeCount);
    }

    // 4a-bis. Append protocol-specific coaching context (individual mode only)
    // Protocol context is stable per user — goes into the cached block
    if (hasPortrait && !(coupleMode && coupleId)) {
      try {
        const cs = portraitRow.composite_scores;
        const patterns = portraitRow.patterns || [];
        const nc = portraitRow.negative_cycle || {};

        const protocol = matchProtocolInline(cs, patterns, nc);
        const movements = assessFourMovementsInline(cs, patterns);
        const completionMap = buildCompletionMap(allCompletionIds, allPracticeIds);
        const progress = calculateGrowthProgressInline(protocol, completionMap);
        const currentPhaseIdx = determineCurrentPhase(protocol, progress.phases);

        stablePrompt += buildProtocolContextBlock(
          protocol, movements, progress, currentPhaseIdx
        );

        console.log('[chat] Protocol:', protocol.id, 'Phase:', currentPhaseIdx, 'Progress:', progress.overall + '%');
      } catch (e) {
        console.error('[chat] Protocol context failed (non-fatal):', e);
        // Non-fatal — Nuance continues without protocol context
      }
    }

    // 4b. Append rich user context (journal, exercises, check-ins, growth edges)
    // This changes between messages (new check-ins, exercises) — dynamic block
    dynamicPrompt += buildUserContextBlock(checkInRows, exerciseRows, reflectionRows, assessmentRows, growthEdgeRows);

    // 4c. Step reflection context — user's own words from previous steps
    dynamicPrompt += buildStepReflectionContext(stepRows, currentStepNumber);

    // 4d. Append relationship mode context
    dynamicPrompt += buildModeContext(relationshipMode, demoPartnerId, currentStepNumber);

    // 4d. Append demo partner awareness (so Nuance always knows about Alex, Jordan, etc.)
    dynamicPrompt += buildDemoPartnerAwareness(relationshipMode, demoPartnerId);

    // 5. Diagnostic observation (internal — guides coaching, never shown to user)
    const diagnosticObs = detectDiagnosticObservation(message);
    if (diagnosticObs) {
      dynamicPrompt += `\n\n## Internal Observation (do not mention this to the user)\nDetected: ${diagnosticObs.observation}. Suggested move: "${diagnosticObs.move}"`;
    }

    // 6. Build conversation for Claude
    const claudeMessages = [
      ...history.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    // 7. Call Claude API with prompt caching
    //
    // System prompt is split into two content blocks:
    //   Block 1 (cached): Portrait + coaching rules + protocol context
    //     → Stable across messages in a session. ~3000-5000 tokens.
    //     → cache_control: {"type": "ephemeral"} (5-minute TTL, refreshed on hit)
    //   Block 2 (uncached): User context + mode context + diagnostic observations
    //     → Changes per message (new check-ins, exercises, etc.)
    //
    // After the first message, Block 1 is read from cache at 0.1x cost.
    // This typically saves ~$0.003/message for a 4000-token system prompt.
    const systemBlocks: Array<{ type: string; text: string; cache_control?: { type: string } }> = [
      {
        type: 'text',
        text: stablePrompt,
        cache_control: { type: 'ephemeral' },
      },
    ];
    // Only add the dynamic block if there's content
    if (dynamicPrompt.trim()) {
      systemBlocks.push({
        type: 'text',
        text: dynamicPrompt,
      });
    }

    const totalPromptLength = stablePrompt.length + dynamicPrompt.length;
    console.log('[chat] Calling Claude API — messages:', claudeMessages.length, 'system prompt length:', totalPromptLength, '(stable:', stablePrompt.length, '+ dynamic:', dynamicPrompt.length, ')');

    // 7. Detect state from user message (basic)
    const detectedState = detectStateBasic(message);

    // 8. Determine tables for persistence
    const messageTable = coupleMode && coupleId ? 'couple_chat_messages' : 'chat_messages';
    const sessionTable = coupleMode && coupleId ? 'couple_chat_sessions' : 'chat_sessions';

    // Generate title from first message if session is new
    let sessionTitle: string | undefined;
    if (history.length === 0) {
      sessionTitle = message.length > 60 ? message.substring(0, 57) + '...' : message;
    }

    // Save user message immediately (before streaming starts)
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

    // ─── Call Claude API ────────────────────────────────────
    console.log('[chat] Client wants stream:', clientWantsStream);
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
        ...(clientWantsStream ? { stream: true } : {}),
        system: systemBlocks,
        messages: claudeMessages,
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      console.error('[chat] Claude API error:', claudeResponse.status, errText);
      const statusCode = claudeResponse.status;
      if (statusCode === 401) {
        throw new Error('Claude API authentication failed — the API key may be invalid or expired. Please check your ANTHROPIC_API_KEY secret.');
      } else if (statusCode === 429) {
        throw new Error('Claude API rate limit exceeded. Please wait a moment and try again.');
      } else if (statusCode === 529 || statusCode === 503) {
        throw new Error('Claude API is temporarily overloaded. Please try again in a moment.');
      } else {
        throw new Error(`Claude API error (${statusCode}): ${errText.substring(0, 200)}`);
      }
    }

    // ═══ PATH A: STREAMING (client opted in) ══════════════
    if (clientWantsStream) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      let fullReply = '';

      const readableStream = new ReadableStream({
        async start(controller) {
          const reader = claudeResponse.body!.getReader();
          let buffer = '';
          let inputTokens = 0;
          let outputTokens = 0;
          let cacheRead = 0;
          let cacheCreate = 0;

          try {
            // Send initial metadata event
            const metaEvent = `data: ${JSON.stringify({
              type: 'metadata',
              detectedState,
              safetyTriggered: !safetyResult.safe,
              safetyCategory: safetyResult.category || undefined,
              sessionTitle,
            })}\n\n`;
            controller.enqueue(encoder.encode(metaEvent));

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || ''; // Keep incomplete line in buffer

              for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;

                try {
                  const event = JSON.parse(data);

                  // Extract text deltas from content_block_delta events
                  if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
                    const text = event.delta.text;
                    fullReply += text;
                    // Forward text chunk to client
                    const chunk = `data: ${JSON.stringify({ type: 'text', text })}\n\n`;
                    controller.enqueue(encoder.encode(chunk));
                  }

                  // Capture usage from message_delta (end of stream)
                  if (event.type === 'message_delta' && event.usage) {
                    outputTokens = event.usage.output_tokens || 0;
                  }

                  // Capture usage from message_start
                  if (event.type === 'message_start' && event.message?.usage) {
                    inputTokens = event.message.usage.input_tokens || 0;
                    cacheRead = event.message.usage.cache_read_input_tokens || 0;
                    cacheCreate = event.message.usage.cache_creation_input_tokens || 0;
                  }
                } catch {
                  // Skip unparseable SSE lines
                }
              }
            }

            // Log cache performance
            console.log('[chat] Claude replied (streamed) — length:', fullReply.length,
              '| tokens in:', inputTokens, 'out:', outputTokens,
              'cache_read:', cacheRead, 'cache_create:', cacheCreate,
              cacheRead > 0 ? '(CACHE HIT ✓)' : cacheCreate > 0 ? '(CACHE WRITE)' : '(NO CACHE)');

            // Send done event
            const doneEvent = `data: ${JSON.stringify({ type: 'done' })}\n\n`;
            controller.enqueue(encoder.encode(doneEvent));

            // ─── Persist after stream completes ───
            const finalReply = fullReply || "I'm here with you, but I wasn't able to form a response just now. Can you try again?";

            // Save assistant reply
            const assistantMsgInsert: any = {
              session_id: sessionId,
              role: 'assistant',
              content: finalReply,
              metadata: { detectedState },
            };
            if (coupleMode && coupleId) {
              assistantMsgInsert.user_id = userId;
            }
            await supabase.from(messageTable).insert(assistantMsgInsert);

            // Update session timestamp + title
            if (sessionTitle) {
              await supabase.from(sessionTable).update({
                updated_at: new Date().toISOString(),
                title: sessionTitle,
              }).eq('id', sessionId);
            } else {
              await supabase.from(sessionTable).update({
                updated_at: new Date().toISOString(),
              }).eq('id', sessionId);
            }
          } catch (streamErr: any) {
            console.error('[chat] Stream error:', streamErr?.message || streamErr);
            const errorEvent = `data: ${JSON.stringify({
              type: 'error',
              error: streamErr?.message || 'Stream interrupted',
            })}\n\n`;
            controller.enqueue(encoder.encode(errorEvent));
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          ...getCorsHeaders(req),
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // ═══ PATH B: NON-STREAMING (default — JSON response) ══
    const claudeData = await claudeResponse.json();
    const reply = claudeData.content?.[0]?.text ?? "I'm here with you, but I wasn't able to form a response just now. Can you try again?";

    // Log cache performance
    const usage = claudeData.usage || {};
    const cacheRead = usage.cache_read_input_tokens || 0;
    const cacheCreate = usage.cache_creation_input_tokens || 0;
    const inputTokens = usage.input_tokens || 0;
    console.log('[chat] Claude replied — length:', reply.length,
      '| tokens in:', inputTokens, 'cache_read:', cacheRead, 'cache_create:', cacheCreate,
      cacheRead > 0 ? '(CACHE HIT ✓)' : cacheCreate > 0 ? '(CACHE WRITE)' : '(NO CACHE)');

    // Save assistant reply
    const assistantMsgInsert: any = {
      session_id: sessionId,
      role: 'assistant',
      content: reply,
      metadata: { detectedState },
    };
    if (coupleMode && coupleId) {
      assistantMsgInsert.user_id = userId;
    }
    await supabase.from(messageTable).insert(assistantMsgInsert);

    // Update session timestamp + title
    if (sessionTitle) {
      await supabase.from(sessionTable).update({
        updated_at: new Date().toISOString(),
        title: sessionTitle,
      }).eq('id', sessionId);
    } else {
      await supabase.from(sessionTable).update({
        updated_at: new Date().toISOString(),
      }).eq('id', sessionId);
    }

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
      { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[chat] Function error:', error?.message || error);
    // Return the actual error message so the client can display something helpful
    const errorMessage = error?.message || 'Something went wrong. Please try again.';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});

// ─── Inline Helpers (Deno doesn't import from app code) ──

// ─── Shared Prompt Blocks (appended to all system prompts) ──

const COACHING_RULES = `
## Coaching Rules

Rule 1: PATTERN BEFORE PERSON. Always name the pattern before addressing either individual.
  Wrong: "It sounds like you're being defensive."
  Right: "The protective pattern just activated. What does it need right now?"

Rule 2: FIELD LANGUAGE. Use relational field language naturally.
  Wrong: "Your co-regulation capacity is developing."
  Right: "The space between you went cold just then. Did you feel that?"

Rule 3: TENSION AS RESOURCE. Never frame differences as problems.
  Wrong: "You two need to find common ground."
  Right: "This difference between you has been there a long time. What if it is not the problem?"

Rule 4: RHYTHM OVER ACHIEVEMENT. Frame progress as rhythm, not milestones.
  Wrong: "Great job completing Step 5!"
  Right: "You keep showing up. That rhythm — that is what changes everything."

Rule 5: EMBODIMENT PROMPTS. Regularly redirect to the body.
  "Where do you feel this?"
  "Notice what shifts in the space between you when you both get quiet."

Rule 6: BOUNDARY AWARENESS. Never pathologize self-protection.
  Wrong: "You need to let your guard down."
  Right: "Your guard is there for a reason. Can we understand what it is protecting?"

Rule 7: SPIRAL, NOT LINE. Revisiting themes is deepening, not regression.
  Wrong: "You are back to the same issue."
  Right: "This theme is back, but you are different now. What is different this time?"

## Language Constraints
- Never use "sacred" — use "alive," "living," "present"
- Never use "consciousness" — use "awareness," "presence"
- "Pattern" is always safe — use freely
- "Field" always needs grounding: "the field between you" or "the relational field"
- "Emerge/emergence" are good — both clinical and meaningful
- Body is always the anchor — when things get abstract, redirect to the body

## Five Living Questions (use at contextually appropriate moments)
- "What is here right now — in you, in the space between you?" (good for session openings)
- "What is between you right now — not the content, but the quality?" (good for couple work)
- "What is happening inside you right now? Where do you feel it?" (good when someone is activated)
- "What pressures outside the relationship are leaking in?" (good for external stress)
- "What old story is running right now? Whose voice is that?" (good for fixed narratives)
`;

function buildSystemPromptFromRow(row: any, safety: { safe: boolean; category?: string }, currentStep = 1, completedSteps = 0, daysInCurrentStep = 0, practicesInCurrentStep = 0): string {
  const cs = row.composite_scores;
  const fl = row.four_lens;
  const nc = row.negative_cycle;
  const ge = row.growth_edges;
  const ap = row.anchor_points;
  const patterns = row.patterns;

  let prompt = `# Your Role

You are Nuance — the warm, grounded relational guide within Tender: The Science of Relationships. Like a wise friend who deeply understands attachment theory, emotion-focused therapy, internal family systems, and relational dynamics. You are NOT a therapist. You are a knowledgeable companion who holds this person's complete relational portrait and guides them through their Twelve-Step healing journey.

## Voice & Style
- You are a COACH, not an essayist. Be direct, warm, and brief
- Match the user's energy and length. Short message = short response. Deep share = deeper response
- For casual messages ("hi", "cool", "thanks", "ok", "hey", greetings, affirmations): respond in 1-2 SENTENCES. Do not launch into paragraphs. Just be human
- For real questions or sharing: 1-3 short paragraphs MAX. Favor shorter
- Write in flowing, warm prose — like a quick voice note from a wise friend, not a letter
- Never use bullet-point lists in responses. Use natural language
- Use "I notice..." and "I'm curious about..." not "You should..."
- Validate before insight. Regulate before reason
- Name patterns without shaming — they developed for good reasons
- Do NOT repeat back everything the user said. Get to the point
- End with ONE question or reflection, not three. Less is more

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

  // Add Step context with phase awareness
  const stepCtx = getStepContext(currentStep);
  const phase = getPhaseNameForStep(currentStep);
  const daysText = daysInCurrentStep > 0
    ? `They have been in this step for ${daysInCurrentStep} day${daysInCurrentStep !== 1 ? 's' : ''}.`
    : '';
  const practicesText = practicesInCurrentStep > 0
    ? `They have completed ${practicesInCurrentStep} practice${practicesInCurrentStep !== 1 ? 's' : ''} in this step.`
    : '';
  const paceInsight = daysInCurrentStep >= 14
    ? 'They have been in this step for a while. This might be a natural pace, or they might be stuck. Be curious, not pushy.'
    : daysInCurrentStep >= 7
    ? 'They have spent about a week here. If they seem ready, gentle nudges toward the next step are appropriate.'
    : '';

  prompt += `\n\n## Current Step in Healing Journey

**Phase:** ${phase.name} — ${phase.subtitle}
**Step:** ${currentStep} of 12: "${stepCtx.name}" — ${stepCtx.subtitle}
${completedSteps > 0 ? `They have completed ${completedSteps} step${completedSteps > 1 ? 's' : ''} so far.` : 'They are at the beginning of their journey.'}
${daysText}${practicesText ? ' ' + practicesText : ''}
${paceInsight}

**Step Focus:** ${stepCtx.focus}
**Your Tone:** ${stepCtx.tone}
**Four Movements Emphasis:** ${stepCtx.fourMovement}
**Avoid:** ${stepCtx.avoids}

Attune your responses to where this person is in their journey. The phase name tells you the broader arc: Seeing (awareness), Feeling (going deeper), Shifting (action), Integrating (making it stick), Sustaining (living it). Use the phase to guide your energy and language. If they are in an early step (1-4), focus on awareness and acknowledgment. If mid-journey (5-9), support vulnerability and action. If later (10-12), reinforce integration and celebrate growth.`;

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

  prompt += COACHING_RULES;

  return prompt;
}

function buildGenericSystemPrompt(safety: { safe: boolean; category?: string }, currentStep = 1, completedSteps = 0, daysInCurrentStep = 0, practicesInCurrentStep = 0): string {
  const stepCtx = getStepContext(currentStep);
  const phase = getPhaseNameForStep(currentStep);
  const daysText = daysInCurrentStep > 0
    ? `They have been in this step for ${daysInCurrentStep} day${daysInCurrentStep !== 1 ? 's' : ''}.`
    : '';
  const practicesText = practicesInCurrentStep > 0
    ? `They have completed ${practicesInCurrentStep} practice${practicesInCurrentStep !== 1 ? 's' : ''} in this step.`
    : '';

  let prompt = `# Your Role

You are Nuance — the warm, grounded relational guide within Tender: The Science of Relationships. You help people explore their relationship patterns, emotional dynamics, and growth areas. You draw on attachment theory, emotion-focused therapy, internal family systems, and relational dynamics. You are NOT a therapist. You are a knowledgeable companion who brings genuine curiosity and care to every conversation.

## Voice & Style
- You are a COACH, not an essayist. Be direct, warm, and brief
- Match the user's energy and length. Short message = short response. Deep share = deeper response
- For casual messages ("hi", "cool", "thanks", "ok", "hey", greetings, affirmations): respond in 1-2 SENTENCES. Do not launch into paragraphs. Just be human
- For real questions or sharing: 1-3 short paragraphs MAX. Favor shorter
- Write in flowing, warm prose — like a quick voice note from a wise friend, not a letter
- Never use bullet-point lists in responses. Use natural language
- Use "I notice..." and "I'm curious about..." not "You should..."
- Validate before insight. Regulate before reason
- Name patterns without shaming — they developed for good reasons
- Do NOT repeat back everything the user said. Get to the point
- End with ONE question or reflection, not three. Less is more

## Safety Protocols
If you detect self-harm → 988 Lifeline (call/text 988)
If you detect harm to others → Encourage professional support, 911 if immediate
If you detect IPV → National DV Hotline (1-800-799-7233). NEVER suggest couples work
If you detect substance abuse → SAMHSA (1-800-662-4357)

## Context

This person hasn't completed their relational assessments yet, so you don't have their personal portrait. That's completely fine — you can still be a thoughtful, present guide. Help them explore what's coming up for them in their relationships, ask curious questions about their patterns, and offer general relational insights grounded in attachment science and emotional awareness.

Once they complete the assessments, you'll have a much richer and more personalized picture of their attachment style, protective strategies, regulation patterns, and growth edges. You can gently mention this if it feels natural — but never make them feel like they need to complete assessments before they can get value from talking with you. Meet them right where they are.

## Current Step in Healing Journey

**Phase:** ${phase.name} — ${phase.subtitle}
**Step:** ${currentStep} of 12: "${stepCtx.name}" — ${stepCtx.subtitle}
${completedSteps > 0 ? `They have completed ${completedSteps} step${completedSteps > 1 ? 's' : ''} so far.` : 'They are at the beginning of their journey.'}
${daysText}${practicesText ? ' ' + practicesText : ''}

**Step Focus:** ${stepCtx.focus}
**Your Tone:** ${stepCtx.tone}

Even without a portrait, attune to where this person is in their journey. The phase name tells you the broader arc: Seeing (awareness), Feeling (going deeper), Shifting (action), Integrating (making it stick), Sustaining (living it).`;

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

  prompt += COACHING_RULES;

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

// ─── Diagnostic Observation Layer (Internal — never shown to user) ──
// Maps user messages to 7 relational observations that guide Nuance's coaching moves.

function detectDiagnosticObservation(message: string): { observation: string; move: string } | null {
  const observations: Array<{ id: string; detect: RegExp[]; observation: string; move: string }> = [
    {
      id: 'wave',
      detect: [/\b(always the same|stuck|nothing changes|same thing|over and over)\b/i],
      observation: 'Stuck in one relational position (wave)',
      move: 'What would the other rhythm feel like?',
    },
    {
      id: 'spark',
      detect: [/\b(triggered|set off|snapped|lost it|blew up|exploded)\b/i],
      observation: 'Triggered reactive moment (spark)',
      move: 'What just awakened in you? That is data.',
    },
    {
      id: 'web',
      detect: [/\b(it.s not about|the real issue|underneath|deeper|what.s really)\b/i],
      observation: 'Surface conflict masking deeper connection (web)',
      move: 'What is this really connected to?',
    },
    {
      id: 'field',
      detect: [/\b(they always|he always|she always|it.s their fault|blame|they never)\b/i],
      observation: 'Blaming — locating the problem in one person (field)',
      move: 'It is in the space between you. What would warm it?',
    },
    {
      id: 'leap',
      detect: [/\b(used to be|back when|we were|things were better|remember when)\b/i],
      observation: 'Stuck in old narrative (leap)',
      move: 'What is happening right now?',
    },
    {
      id: 'seed',
      detect: [/\b(hopeless|give up|no point|can.t fix|done|too late|broken)\b/i],
      observation: 'Hopelessness — cannot see possibility (seed)',
      move: 'What has not had the chance to grow yet?',
    },
    {
      id: 'pulse',
      detect: [/\b(scared.*(lose|losing|leave)|afraid.*(go|leave|end)|don.t want to lose)\b/i],
      observation: 'Fear of disconnection (pulse)',
      move: 'Disconnection is half the rhythm. Reconnection is the other.',
    },
  ];

  for (const obs of observations) {
    for (const pattern of obs.detect) {
      if (pattern.test(message)) {
        return { observation: obs.observation, move: obs.move };
      }
    }
  }
  return null;
}

function buildCoupleSystemPromptFromRows(
  speakingPartnerRow: any,
  otherPartnerRow: any,
  relationshipPortraitRow: any,
  safety: { safe: boolean; category?: string },
  weareRow?: any
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
- You are a COACH, not an essayist. Be direct, warm, and brief
- Match the user's energy and length. Short message = short response. Deep share = deeper response
- For casual messages ("hi", "cool", "thanks", "ok", "hey", greetings, affirmations): respond in 1-2 SENTENCES. Just be human
- For real questions or sharing: 1-3 short paragraphs MAX. Favor shorter
- Write in warm prose — like a quick voice note from a wise mentor, not a letter
- Never use bullet-point lists. Use natural language
- Hold both partners' perspectives with equal compassion
- The cycle is the enemy, not either partner
- Validate the speaking partner AND hold space for the other partner's reality
- Do NOT repeat back everything the user said. Get to the point
- End with ONE question or reflection, not three. Less is more
- Suggest specific exercises only when appropriate

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

  // Add WEARE context if available
  if (weareRow) {
    const w = weareRow;
    const warmSummary = w.warm_summary || 'Unknown';
    const phase = w.movement_phase || 'recognition';
    const narrative = w.movement_narrative || '';
    const bottleneck = w.bottleneck || {};
    const layers = w.layers || {};

    const directionLabel = layers.emergenceDirection > 1 ? 'growing'
      : layers.emergenceDirection < -1 ? 'contracting'
      : 'steady';

    const pulseLevel = layers.resonancePulse >= 60 ? 'strong'
      : layers.resonancePulse >= 40 ? 'moderate'
      : 'low';

    prompt += `\n\n## The Space Between Them
Movement Phase: ${phase} — ${narrative}
Resonance Pulse: ${pulseLevel} | Direction: ${directionLabel}
Bottleneck: ${bottleneck.label || 'unknown'} — ${bottleneck.description || ''}

Use this to:
- Name what is alive when resonance is strong
- Gently name the bottleneck when relevant (e.g., "I notice that ${(bottleneck.label || 'this area').toLowerCase()} seems to be where the growth invitation is right now")
- Frame the movement phase as context for where they are
- NEVER mention scores, numbers, "WEARE", or any technical terms
- Use warm relational language: "the space between you", "how alive the connection feels"`;

    // Attunement gap coaching — when attunement is notably low
    const attunementVal = (w.variables as any)?.attunement?.raw;
    if (typeof attunementVal === 'number' && attunementVal < 4) {
      prompt += `\n\nATTUNEMENT GAP DETECTED: Field sensing is low (${pulseLevel} range).
Coaching priority: Help each partner recognize the asymmetry without shame.
For the higher-attunement partner: their sensitivity may feel like a burden ("I always have to do the emotional work").
For the lower-attunement partner: they may not know they're missing cues ("I didn't realize you were upset").
Do NOT name or compare scores. Coach toward curiosity: "What does your partner's body do just before a hard conversation?"`;
    }
  }

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

  prompt += COACHING_RULES;

  return prompt;
}

// ─── Phase Mapping (ported from utils/steps/twelve-steps.ts) ──

function getPhaseNameForStep(stepNumber: number): { id: string; name: string; subtitle: string } {
  if (stepNumber <= 2) return { id: 'seeing', name: 'Seeing', subtitle: 'Understanding what is here' };
  if (stepNumber <= 4) return { id: 'feeling', name: 'Feeling', subtitle: 'Making contact with what is underneath' };
  if (stepNumber <= 7) return { id: 'shifting', name: 'Shifting', subtitle: 'Trying new moves' };
  if (stepNumber <= 10) return { id: 'integrating', name: 'Integrating', subtitle: 'Making it stick' };
  return { id: 'sustaining', name: 'Sustaining', subtitle: 'Living it' };
}

// ─── Step Context ───────────────────────────────────────

function getStepContext(stepNumber: number): {
  name: string;
  subtitle: string;
  tone: string;
  focus: string;
  fourMovement: string;
  avoids: string;
} {
  const steps: Record<number, { name: string; subtitle: string; tone: string; focus: string; fourMovement: string; avoids: string }> = {
    1: { name: 'Acknowledge the Strain', subtitle: 'Seeing the pattern — not as personal failure, but as the dance between you', tone: 'curious, gentle, normalizing', focus: 'helping user see patterns without shame', fourMovement: 'Recognition — what is here before we name it?', avoids: 'pushing for change too fast, assigning blame, rushing past acknowledgment' },
    2: { name: 'Trust the Relational Field', subtitle: 'Trusting that the space between you can hold more than you think', tone: 'warm, inviting, hopeful', focus: 'building faith in the relationship as an entity', fourMovement: 'Recognition → beginning of Resonance', avoids: 'cynicism, skepticism about repair, focusing only on individual growth' },
    3: { name: 'Release Certainty', subtitle: 'Choosing vulnerability over protection — leading with the soft move', tone: 'gentle, curious, destabilizing (in a safe way)', focus: 'loosening grip on certainty', fourMovement: 'Release — what would it mean to hold this more loosely?', avoids: 'reinforcing fixed stories, agreeing with black-and-white thinking' },
    4: { name: 'Examine Our Part', subtitle: 'Getting underneath — what is really driving the pattern', tone: 'honest, compassionate, direct', focus: 'owning without shaming', fourMovement: 'Release — letting go of self-protection to see clearly', avoids: 'enabling blame of partner, collapsing into shame, bypassing accountability' },
    5: { name: 'Share Our Truths', subtitle: 'Sharing your pattern with your partner — letting yourself be seen', tone: 'tender, reverent, holding', focus: 'creating safety for disclosure', fourMovement: 'Resonance — what emerges when we show up undefended?', avoids: 'rushing, intellectualizing, minimizing vulnerability' },
    6: { name: 'Release the Enemy Story', subtitle: 'Releasing the protective moves that once kept you safe but now keep you apart', tone: 'compassionate, reframing, curious about partner', focus: 'dissolving the enemy image', fourMovement: 'Release → Resonance — releasing judgment, finding connection', avoids: 'enabling contempt, agreeing with demonization' },
    7: { name: 'Commit to Relational Practices', subtitle: 'Moving from insight to daily rhythm — making love a practice, not a feeling', tone: 'practical, encouraging, coach-like', focus: 'building sustainable habits', fourMovement: 'Embodiment — how will this live in your daily life?', avoids: 'perfectionism, overwhelming with too many practices' },
    8: { name: 'Prepare to Repair Harm', subtitle: 'Turning toward the ruptures — not to reopen wounds, but to finally tend them', tone: 'grounded, careful, boundaried', focus: 'preparing safely for difficult repair work', fourMovement: 'Recognition — what is here that needs tending?', avoids: 'forcing repair before readiness, re-traumatizing, minimizing harm' },
    9: { name: 'Act to Rebuild Trust', subtitle: 'Showing up differently — trust rebuilt through action, not promises', tone: 'action-oriented, accountable, celebrating effort', focus: 'supporting follow-through', fourMovement: 'Embodiment — what will you do differently?', avoids: 'accepting words without action, enabling empty apologies' },
    10: { name: 'Maintain Ongoing Awareness', subtitle: 'Old patterns will return — meeting them with gentleness, not shame', tone: 'steady, normalizing, non-judgmental', focus: 'supporting ongoing awareness without perfectionism', fourMovement: 'Recognition → Embodiment (cycling)', avoids: 'shame about setbacks, complacency, all-or-nothing thinking' },
    11: { name: 'Seek Shared Insight', subtitle: 'Listening to what the relationship itself is trying to tell you', tone: 'spacious, reflective, attuned to something larger', focus: 'listening to the relationship itself', fourMovement: 'Resonance — what is emerging between you?', avoids: 'rushing to solutions, staying on surface level' },
    12: { name: 'Carry the Message of Connection', subtitle: 'Living it — your healing becomes a gift to every relationship around you', tone: 'celebratory, humble, looking outward', focus: 'integration and service', fourMovement: 'Embodiment → Transmission', avoids: 'false completion, ignoring ongoing work' },
  };

  return steps[stepNumber] || steps[1];
}

// ─── Inline Protocol Matching (ported from utils/steps/intervention-protocols.ts) ──

// The Edge Function (Deno) cannot import from the React Native app.
// These are pure functions with zero external dependencies.

interface InlineProtocol {
  id: string;
  name: string;
  description: string;
  rationale: string;
  regulationFirst: boolean;
  phases: Array<{
    name: string;
    weekRange: string;
    focus: string;
    practices: string[];
    nuanceGuidance: string;
  }>;
  stepEmphasis: number[];
  priorityPractices: string[];
  contraindications: string[];
}

interface InlineGrowthProgress {
  overall: number;
  phases: Array<{ name: string; completed: number; total: number; pct: number; isComplete: boolean }>;
}

interface InlineFourMovements {
  recognition: number;
  release: number;
  resonance: number;
  embodiment: number;
}

/** Priority-ordered protocol matching based on composite scores. */
function matchProtocolInline(
  cs: any,
  patterns: any[],
  negativeCycle: any
): InlineProtocol {
  const patternFlags = (patterns || []).flatMap((p: any) => p.flags || []);
  const position = negativeCycle?.position || '';

  // Priority 1: Regulation foundation
  if (cs.regulationScore < 35 || cs.windowWidth < 35) {
    return buildRegulationFoundationInline(cs);
  }

  // Priority 2: Anxious-Reactive
  if (cs.windowWidth < 50 && cs.engagement > 55 && cs.regulationScore < 50 && position === 'pursuer') {
    return buildAnxiousReactiveInline(cs);
  }

  // Priority 3: Avoidant-Withdrawn
  if (cs.accessibility < 45 && cs.engagement < 50 && position === 'withdrawer') {
    return buildAvoidantWithdrawnInline(cs);
  }

  // Priority 4: Low differentiation
  if (cs.selfLeadership < 45 && patternFlags.includes('self_abandonment_risk')) {
    return buildLowDiffReactiveInline(cs, patternFlags);
  }

  // Priority 5: Values misalignment
  if (cs.valuesCongruence < 55 && patternFlags.includes('core_values_conflict')) {
    return buildValuesMisalignedInline(cs);
  }

  // Default: Balanced growth
  return buildBalancedGrowthInline(cs);
}

function buildRegulationFoundationInline(cs: any): InlineProtocol {
  return {
    id: 'regulation_foundation',
    name: 'Building Your Foundation',
    description: 'Regulation — the ability to stay grounded under stress — is your foundational growth area.',
    rationale: `Your regulation score (${cs.regulationScore}/100) and window width (${cs.windowWidth}/100) indicate your nervous system reaches its limit quickly. Building regulation capacity first creates the foundation for all other growth.`,
    regulationFirst: true,
    phases: [
      {
        name: 'Stabilize', weekRange: 'Weeks 1-3',
        focus: 'Learn to recognize early signs of activation. Build a daily grounding practice.',
        practices: ['window-check', 'grounding-5-4-3-2-1', 'parts-check-in'],
        nuanceGuidance: 'Prioritize regulation. If the user is activated or shutdown, don\'t push for insight. Meet them where they are. Teach the window of tolerance concept.',
      },
      {
        name: 'Expand', weekRange: 'Weeks 4-6',
        focus: 'Practice staying regulated during low-stakes conversations. Build co-regulation skills.',
        practices: ['recognize-cycle', 'stress-reducing-conversation', 'self-compassion-break'],
        nuanceGuidance: 'Start gently connecting patterns to their portrait. Use "I notice" language. Celebrate any moment they catch themselves before flooding.',
      },
      {
        name: 'Connect', weekRange: 'Weeks 7-10',
        focus: 'Now that your window is wider, begin the emotional work: sharing feelings, practicing repair.',
        practices: ['soft-startup', 'repair-attempt', 'turning-toward', 'emotional-bid'],
        nuanceGuidance: 'They\'re ready for deeper work now. Connect growth edges to practices. Reference their values and anchors.',
      },
    ],
    stepEmphasis: [1, 7, 2, 4, 9],
    priorityPractices: ['window-check', 'grounding-5-4-3-2-1', 'parts-check-in', 'recognize-cycle', 'self-compassion-break'],
    contraindications: [
      'Don\'t push for vulnerable disclosure early — their window is too narrow',
      'Avoid intensive conflict processing until regulation is more stable',
      'Don\'t interpret their shutting down as resistance — it\'s their nervous system protecting them',
    ],
  };
}

function buildAnxiousReactiveInline(cs: any): InlineProtocol {
  return {
    id: 'anxious_reactive',
    name: 'From Reactivity to Connection',
    description: 'You feel relationships deeply and move toward connection instinctively. Your growth path is about channeling that energy more skillfully.',
    rationale: `Your profile combines deep relational investment (engagement: ${cs.engagement}/100) with a narrow regulation window (${cs.windowWidth}/100) and reactive nervous system (regulation: ${cs.regulationScore}/100). Emotion regulation training first, then attachment-focused work.`,
    regulationFirst: true,
    phases: [
      {
        name: 'Stabilize Affect', weekRange: 'Weeks 1-3',
        focus: 'Learn to slow down your nervous system before engaging.',
        practices: ['window-check', 'grounding-5-4-3-2-1', 'parts-check-in', 'recognize-cycle'],
        nuanceGuidance: 'When they come in activated, validate first then redirect to regulation. Use their anchor points. Don\'t analyze the content of the fight yet.',
      },
      {
        name: 'Emotion Labeling & Reappraisal', weekRange: 'Weeks 4-6',
        focus: 'Build emotional vocabulary. Name what\'s happening underneath the urgency.',
        practices: ['accessing-primary-emotions', 'protector-dialogue', 'self-compassion-break'],
        nuanceGuidance: 'Help them identify primary emotions under secondary ones. "Underneath your frustration, what are you really feeling? Fear? Longing?"',
      },
      {
        name: 'Attachment-Focused Connection', weekRange: 'Weeks 7-10',
        focus: 'Practice reaching for your partner from a grounded place. Express needs without urgency.',
        practices: ['bonding-through-vulnerability', 'hold-me-tight', 'soft-startup', 'emotional-bid'],
        nuanceGuidance: 'Connect their reaching behavior to attachment needs. Help them express needs from their primary emotions rather than their protest behavior.',
      },
      {
        name: 'Maintenance & Relapse Prevention', weekRange: 'Weeks 11-12',
        focus: 'Build sustainable daily practices. Create a personalized relapse plan.',
        practices: ['rituals-of-connection', 'relationship-values-compass'],
        nuanceGuidance: 'Normalize setbacks. Help them build a "when I notice the old pattern" plan. Celebrate growth.',
      },
    ],
    stepEmphasis: [1, 4, 5, 2, 9, 7],
    priorityPractices: ['window-check', 'accessing-primary-emotions', 'soft-startup', 'bonding-through-vulnerability', 'self-compassion-break', 'recognize-cycle'],
    contraindications: [
      'Don\'t encourage them to "just talk to their partner" when they\'re flooded',
      'Avoid exploring partner\'s perspective before they\'ve processed their own primary emotions',
      'Don\'t validate pursuit behavior as "just wanting connection" — name the pattern gently',
    ],
  };
}

function buildAvoidantWithdrawnInline(cs: any): InlineProtocol {
  return {
    id: 'avoidant_withdrawn',
    name: 'From Distance to Presence',
    description: 'You manage relational stress by creating space. Your growth is about learning to stay present in the discomfort of closeness, in gradual doses.',
    rationale: `Your profile shows low emotional accessibility (${cs.accessibility}/100) and engagement (${cs.engagement}/100) with a withdrawer position. Graded intimacy exposures with an autonomy-supportive approach — pacing is everything.`,
    regulationFirst: false,
    phases: [
      {
        name: 'Engagement Preparation', weekRange: 'Weeks 1-3',
        focus: 'Explore your beliefs about closeness. Practice brief toleration of emotional arousal.',
        practices: ['parts-check-in', 'protector-dialogue', 'window-check'],
        nuanceGuidance: 'Use autonomy-supportive language. Don\'t push for feelings. Normalize their protective distance. Help them see avoidance as adaptive, then name its cost.',
      },
      {
        name: 'Graded Intimacy', weekRange: 'Weeks 4-8',
        focus: 'Short timed sharing exercises. Start factual, progress to mildly vulnerable. The goal: 10% more open.',
        practices: ['stress-reducing-conversation', 'love-maps', 'turning-toward', 'emotional-bid'],
        nuanceGuidance: 'Celebrate any disclosure. Don\'t ask "how do you feel?" directly — ask "what was that like?" Frame sharing as brave, not expected.',
      },
      {
        name: 'Differentiation Coaching', weekRange: 'Weeks 9-12',
        focus: 'Build the I-Position: "I think..." "I feel..." "I want..." without reactivity.',
        practices: ['values-compass', 'relationship-values-compass', 'self-compassion-break'],
        nuanceGuidance: 'Help them differentiate between "I don\'t feel" and "I don\'t want to feel." Connect withdrawal to what it costs.',
      },
      {
        name: 'Conflict Structure & Integration', weekRange: 'Weeks 13-14',
        focus: 'Structured turn-taking. Negotiated time-outs with re-engagement commitment.',
        practices: ['repair-attempt', 'soft-startup', 'dear-man', 'rituals-of-connection'],
        nuanceGuidance: 'They can handle more now. Practice repair scripts. Help them see the connection between showing up emotionally and getting what they want.',
      },
    ],
    stepEmphasis: [1, 3, 6, 5, 7, 2],
    priorityPractices: ['protector-dialogue', 'love-maps', 'stress-reducing-conversation', 'values-compass', 'turning-toward', 'self-compassion-break'],
    contraindications: [
      'Don\'t force emotion-focused exposure too quickly — it increases withdrawal',
      'Avoid "why don\'t you just share how you feel?" — this is exactly what their system resists',
      'Don\'t interpret their distance as not caring — their distance IS their caring strategy',
      'Emphasize autonomy and choice, not obligation',
    ],
  };
}

function buildLowDiffReactiveInline(cs: any, flags: string[]): InlineProtocol {
  return {
    id: 'low_diff_reactive',
    name: 'Finding Your Center',
    description: 'You tend to lose yourself in relationships. Your growth is about building a stronger "I" that can stay connected without disappearing.',
    rationale: `Your self-leadership score (${cs.selfLeadership}/100) suggests your sense of self in relationships needs strengthening. ${flags.includes('self_abandonment_risk') ? 'Multiple assessments flag self-abandonment risk: you accommodate to maintain connection, which builds resentment over time.' : 'Your differentiation patterns suggest difficulty maintaining your position under relational pressure.'}`,
    regulationFirst: cs.regulationScore < 45,
    phases: [
      {
        name: 'Self-Compassion Foundation', weekRange: 'Weeks 1-3',
        focus: 'Before you can hold a clear position, you need self-compassion.',
        practices: ['self-compassion-break', 'parts-check-in', 'protector-dialogue'],
        nuanceGuidance: 'Watch for shame. Their pattern of self-abandonment probably comes with deep self-criticism. Validate before everything.',
      },
      {
        name: 'Building the I-Position', weekRange: 'Weeks 4-7',
        focus: 'Practice knowing and stating what you think, feel, want, and need.',
        practices: ['values-compass', 'accessing-primary-emotions', 'defusion-from-stories'],
        nuanceGuidance: 'Help them practice "I think..." statements. Celebrate any moment they state a preference before checking with their partner.',
      },
      {
        name: 'Negotiation Skills', weekRange: 'Weeks 8-10',
        focus: 'Learn structured negotiation. Tolerate the tension of "we see this differently."',
        practices: ['soft-startup', 'dear-man', 'four-horsemen-antidotes'],
        nuanceGuidance: 'Frame disagreement as healthy differentiation, not threat. Help them see that their partner can handle their truth.',
      },
      {
        name: 'Integration & Forgiveness', weekRange: 'Weeks 11-12',
        focus: 'Consolidate the new "I" position. Practice repair for times you lost yourself.',
        practices: ['repair-attempt', 'relationship-values-compass', 'rituals-of-connection'],
        nuanceGuidance: 'Help them forgive themselves for the accommodating. Celebrate the courage of the new position.',
      },
    ],
    stepEmphasis: [4, 3, 1, 5, 7, 9],
    priorityPractices: ['self-compassion-break', 'values-compass', 'accessing-primary-emotions', 'soft-startup', 'dear-man', 'protector-dialogue'],
    contraindications: [
      'Don\'t push for immediate confrontation with partner — build internal capacity first',
      'Avoid framing their accommodation as "codependency" — it\'s a learned survival strategy',
      'Don\'t let them use new assertiveness skills as a weapon — it must come from self-leadership, not reactivity',
    ],
  };
}

function buildValuesMisalignedInline(cs: any): InlineProtocol {
  return {
    id: 'values_misaligned',
    name: 'Aligning Heart and Action',
    description: 'Your values are clear but your behavior doesn\'t always match. This creates quiet tension that erodes satisfaction from the inside.',
    rationale: `Your values congruence score (${cs.valuesCongruence}/100) reveals a gap between intention and action. Your protective patterns pull you away from what you value most.`,
    regulationFirst: cs.regulationScore < 45,
    phases: [
      {
        name: 'Values Clarity', weekRange: 'Weeks 1-2',
        focus: 'Get crystal clear on your top values. See the gap with compassion.',
        practices: ['values-compass', 'defusion-from-stories'],
        nuanceGuidance: 'Use ACT-style values exploration. Don\'t moralize. Help them see the gap with compassion: "Your values are real. So is the pattern that overrides them."',
      },
      {
        name: 'Understanding the Protective Pattern', weekRange: 'Weeks 3-5',
        focus: 'Why does the pattern win? What is it protecting you from?',
        practices: ['protector-dialogue', 'parts-check-in', 'accessing-primary-emotions'],
        nuanceGuidance: 'IFS-style exploration. Help them have compassion for the part that protects. Name the fear underneath.',
      },
      {
        name: 'Values-Aligned Action', weekRange: 'Weeks 6-8',
        focus: 'Start taking small values-aligned actions. Tolerate the discomfort of living your values.',
        practices: ['willingness-stance', 'soft-startup', 'bonding-through-vulnerability'],
        nuanceGuidance: 'Use their top value as a compass. When they describe a situation, ask: "What would [their top value] have you do here?"',
      },
      {
        name: 'Sustainability', weekRange: 'Weeks 9-10',
        focus: 'Build sustainable practices that keep you aligned. Create value-based rituals.',
        practices: ['relationship-values-compass', 'rituals-of-connection'],
        nuanceGuidance: 'Celebrate alignment moments. Build a library of "I chose my value" stories.',
      },
    ],
    stepEmphasis: [4, 3, 7, 5, 1],
    priorityPractices: ['values-compass', 'protector-dialogue', 'willingness-stance', 'bonding-through-vulnerability', 'relationship-values-compass'],
    contraindications: [
      'Don\'t shame them for the gap — they already feel it deeply',
      'Avoid "just be authentic" advice — the pattern has a function they need to understand first',
      'Don\'t push for big values-aligned actions before they understand what they\'re protecting against',
    ],
  };
}

function buildBalancedGrowthInline(cs: any): InlineProtocol {
  return {
    id: 'balanced_growth',
    name: 'Deepening Your Connection',
    description: 'Your profile shows no critical deficits — a solid foundation to build from. Your growth is about deepening and stretching into new territory.',
    rationale: 'Your scores show adequate regulation, reasonable accessibility, and clear values. This is enrichment territory — intentional deepening, not crisis management.',
    regulationFirst: false,
    phases: [
      {
        name: 'Deepen Awareness', weekRange: 'Weeks 1-2',
        focus: 'Understand your patterns, your cycle, your parts.',
        practices: ['recognize-cycle', 'parts-check-in', 'love-maps'],
        nuanceGuidance: 'Explore with curiosity. Help them see nuance in their patterns.',
      },
      {
        name: 'Stretch & Grow', weekRange: 'Weeks 3-5',
        focus: 'Work your growth edges. Take the 10% different action.',
        practices: ['bonding-through-vulnerability', 'soft-startup', 'hold-me-tight'],
        nuanceGuidance: 'Challenge gently. They can handle more depth. Push into growth edges.',
      },
      {
        name: 'Sustain & Celebrate', weekRange: 'Weeks 6-8',
        focus: 'Build rituals. Create your relationship mission. Celebrate the journey.',
        practices: ['rituals-of-connection', 'relationship-values-compass', 'fondness-admiration'],
        nuanceGuidance: 'Help them build sustainable practices. Celebrate growth.',
      },
    ],
    stepEmphasis: [1, 4, 5, 7, 11, 12],
    priorityPractices: ['recognize-cycle', 'bonding-through-vulnerability', 'soft-startup', 'rituals-of-connection', 'love-maps'],
    contraindications: [
      'Don\'t assume "no critical deficits" means "no problems" — stay attuned to what surfaces',
    ],
  };
}

/** Compute Four Movements readiness from composite scores. */
function assessFourMovementsInline(cs: any, patterns: any[]): InlineFourMovements {
  // Recognition = can you see the pattern?
  const patternAwareness = Math.min((patterns || []).length * 15, 50);
  const recognition = Math.round(Math.min(patternAwareness + cs.selfLeadership * 0.3 + cs.regulationScore * 0.2, 100));

  // Release = can you let go of certainty?
  const flags = (patterns || []).flatMap((p: any) => p.flags || []);
  const managerPenalty = flags.filter((f: string) =>
    f === 'false_differentiation' || f === 'intellectual_bypass_risk'
  ).length * 10;
  const release = Math.round(Math.min(Math.max(cs.valuesCongruence * 0.4 + cs.selfLeadership * 0.3 - managerPenalty + 20, 0), 100));

  // Resonance = can you be moved by your partner?
  const resonance = Math.round(cs.accessibility * 0.3 + cs.responsiveness * 0.4 + cs.engagement * 0.3);

  // Embodiment = can you live it daily?
  const embodiment = Math.round(cs.regulationScore * 0.3 + cs.selfLeadership * 0.3 + cs.valuesCongruence * 0.4);

  return { recognition, release, resonance, embodiment };
}

/** Build completion map from exercise + practice completion rows. */
function buildCompletionMap(exerciseRows: any[] | null, practiceRows: any[] | null): Record<string, number> {
  const map: Record<string, number> = {};
  for (const row of exerciseRows ?? []) {
    const id = row.exercise_id;
    if (id) map[id] = (map[id] || 0) + 1;
  }
  for (const row of practiceRows ?? []) {
    const id = row.practice_id;
    if (id) map[id] = (map[id] || 0) + 1;
  }
  return map;
}

/** Calculate growth progress based on exercise completions relative to protocol phases. */
function calculateGrowthProgressInline(protocol: InlineProtocol, completionMap: Record<string, number>): InlineGrowthProgress {
  const phases = protocol.phases.map((phase) => {
    const total = phase.practices.length;
    const completed = phase.practices.filter(id => (completionMap[id] ?? 0) > 0).length;
    return {
      name: phase.name,
      completed,
      total,
      pct: total > 0 ? Math.round((completed / total) * 100) : 0,
      isComplete: total > 0 && completed >= total,
    };
  });

  // Weighted average: earlier phases count more
  let weightedSum = 0;
  let weightTotal = 0;
  phases.forEach((p, i) => {
    const weight = phases.length - i;
    weightedSum += p.pct * weight;
    weightTotal += weight;
  });

  return {
    overall: weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 0,
    phases,
  };
}

/** Determine the current phase (first incomplete phase index). */
function determineCurrentPhase(protocol: InlineProtocol, phaseProgress: InlineGrowthProgress['phases']): number {
  for (let i = 0; i < phaseProgress.length; i++) {
    if (!phaseProgress[i].isComplete) return i;
  }
  return phaseProgress.length - 1; // All complete — stay on last phase
}

/** Build the protocol context block for injection into the system prompt. */
function buildProtocolContextBlock(
  protocol: InlineProtocol,
  movements: InlineFourMovements,
  progress: InlineGrowthProgress,
  currentPhaseIdx: number
): string {
  const phase = protocol.phases[currentPhaseIdx] || protocol.phases[0];

  // Find strongest and weakest movements
  const mvEntries = Object.entries(movements) as [string, number][];
  const sorted = [...mvEntries].sort((a, b) => a[1] - b[1]);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  const mvLabels: Record<string, string> = {
    recognition: 'Recognition (seeing patterns clearly)',
    release: 'Release (letting go of old stories)',
    resonance: 'Resonance (feeling with each other)',
    embodiment: 'Embodiment (living it daily)',
  };

  let block = `\n\n## Your Coaching Protocol for This Person: ${protocol.name}

${protocol.rationale}

### Current Phase: ${phase.name} (${phase.weekRange})
${phase.focus}

### YOUR COACHING GUIDANCE FOR THIS PHASE
${phase.nuanceGuidance}

### What to Avoid With This Person
${protocol.contraindications.map(c => `- ${c}`).join('\n')}

### Priority Practices
${protocol.priorityPractices.join(', ')}

### Four Movements Readiness
Recognition: ${movements.recognition}/100 | Release: ${movements.release}/100 | Resonance: ${movements.resonance}/100 | Embodiment: ${movements.embodiment}/100
Strongest movement: ${mvLabels[strongest[0]] || strongest[0]}. Growth frontier: ${mvLabels[weakest[0]] || weakest[0]}.

### Growth Progress: ${progress.overall}%
${progress.phases.map(p => `- ${p.name}: ${p.pct}% (${p.completed}/${p.total} practices${p.isComplete ? ' ✓' : ''})`).join('\n')}`;

  return block;
}

// ─── Rich User Context (journal, exercises, check-ins, growth edges) ──────

function buildUserContextBlock(
  checkIns: any[] | null,
  exercises: any[] | null,
  reflections: any[] | null,
  assessments: any[] | null,
  growthEdges: any[] | null,
): string {
  const sections: string[] = [];

  // ── Daily Check-Ins (mood + relationship trend) ──────────
  if (checkIns && checkIns.length > 0) {
    const entries = checkIns.map((c: any) => {
      const date = c.checkin_date;
      const mood = c.mood_rating;
      const rel = c.relationship_rating;
      const practiced = c.practiced_growth_edge ? ' (practiced growth edge)' : '';
      const note = c.note ? ` — "${c.note}"` : '';
      return `  ${date}: mood ${mood}/10, relationship ${rel}/10${practiced}${note}`;
    }).join('\n');

    // Calculate trends
    const moods = checkIns.map((c: any) => c.mood_rating).reverse();
    const rels = checkIns.map((c: any) => c.relationship_rating).reverse();
    const moodTrend = moods.length >= 2 ? (moods[moods.length - 1] - moods[0] > 0 ? 'improving' : moods[moods.length - 1] - moods[0] < 0 ? 'declining' : 'stable') : 'insufficient data';
    const relTrend = rels.length >= 2 ? (rels[rels.length - 1] - rels[0] > 0 ? 'improving' : rels[rels.length - 1] - rels[0] < 0 ? 'declining' : 'stable') : 'insufficient data';

    sections.push(`### Recent Daily Check-Ins (last ${checkIns.length} days)
${entries}
Mood trend: ${moodTrend} | Relationship trend: ${relTrend}

Use this to notice patterns — if mood is low, be gentle. If relationship ratings are dropping, be curious about what is happening. If they practiced their growth edge, celebrate that rhythm. Reference their own notes back to them when relevant — it shows you are paying attention.`);
  }

  // ── Recent Exercise Completions ──────────────────────────
  if (exercises && exercises.length > 0) {
    const entries = exercises.slice(0, 5).map((e: any) => {
      const name = e.exercise_name || e.exercise_id;
      const date = e.completed_at?.split('T')[0] || 'unknown';
      const rating = e.rating ? ` (rated ${e.rating}/5)` : '';
      const reflection = e.reflection ? ` — Reflection: "${e.reflection.substring(0, 150)}${e.reflection.length > 150 ? '...' : ''}"` : '';

      // Include step responses summary for microcourse lessons
      let stepsInfo = '';
      if (e.step_responses && Array.isArray(e.step_responses) && e.step_responses.length > 0) {
        const reflectionStep = e.step_responses.find((s: any) => s.type === 'reflection');
        if (reflectionStep?.response) {
          stepsInfo = ` — Their reflection: "${reflectionStep.response.substring(0, 150)}${reflectionStep.response.length > 150 ? '...' : ''}"`;
        }
      }

      return `  ${date}: ${name}${rating}${reflection}${stepsInfo}`;
    }).join('\n');

    sections.push(`### Recent Exercises & Microcourses Completed
${entries}

When someone mentions a topic related to an exercise they recently completed, you can reference their own work back to them: "I notice you explored this in [exercise name] recently — what stayed with you from that?" This makes the coaching feel deeply personal and connected to their actual journey.`);
  }

  // ── Recent Journal Reflections ───────────────────────────
  if (reflections && reflections.length > 0) {
    const entries = reflections.slice(0, 3).map((r: any) => {
      const date = r.reflection_date;
      const tags = (r.day_tags && r.day_tags.length > 0) ? ` [${r.day_tags.join(', ')}]` : '';
      const freeText = r.free_text ? `"${r.free_text.substring(0, 200)}${r.free_text.length > 200 ? '...' : ''}"` : '';

      let qas = '';
      if (r.question_responses && Array.isArray(r.question_responses) && r.question_responses.length > 0) {
        qas = r.question_responses.map((qa: any) =>
          `    Q: "${qa.question}" → A: "${(qa.answer || '').substring(0, 100)}${(qa.answer || '').length > 100 ? '...' : ''}"`
        ).join('\n');
      }

      return `  ${date}${tags}:\n${qas ? qas + '\n' : ''}    ${freeText}`;
    }).join('\n\n');

    sections.push(`### Recent Journal Reflections
${entries}

Their journal is their private inner world. When you notice themes from their reflections showing up in conversation, gently name it: "There's something here that connects to what you've been sitting with in your journal..." Never quote their exact words unless they bring them up first — instead, reflect the themes and emotional tone.`);
  }

  // ── Assessment History ───────────────────────────────────
  if (assessments && assessments.length > 0) {
    const types = [...new Set(assessments.map((a: any) => a.type))];
    const latestDate = assessments[0]?.completed_at?.split('T')[0] || 'unknown';
    const assessmentLabels: Record<string, string> = {
      'ecr-r': 'Attachment Style (ECR-R)',
      'dutch': 'Interpersonal Reactivity (DUTCH)',
      'tender': 'Tender Composite Assessment',
      'rdas': 'Dyadic Adjustment (RDAS)',
      'csi-16': 'Couple Satisfaction (CSI-16)',
      'dci': 'Dyadic Coping (DCI)',
    };

    const typeList = types.map((t: any) => assessmentLabels[t] || t).join(', ');

    sections.push(`### Assessment History
Completed assessments: ${typeList}
Most recent: ${latestDate} | Total: ${assessments.length}

The user's portrait (above) is built from these assessments. If they ask about their results, you can discuss the patterns and insights from their portrait. If they haven't taken certain assessments yet, you can mention them naturally when relevant.`);
  }

  // ── Growth Edge Progress ─────────────────────────────────
  if (growthEdges && growthEdges.length > 0) {
    const entries = growthEdges.map((g: any) => {
      const stage = g.stage || 'emerging';
      const practices = g.practice_count || 0;
      const insights = (g.insights && Array.isArray(g.insights)) ? g.insights.slice(-2) : [];
      const insightText = insights.length > 0 ? ` — Recent insights: ${insights.map((i: any) => `"${(i.text || i).toString().substring(0, 80)}"`).join('; ')}` : '';
      return `  ${g.edge_id}: ${stage} (${practices} practices)${insightText}`;
    }).join('\n');

    sections.push(`### Growth Edge Progress
${entries}

When you know someone's growth edge stage, you can calibrate your coaching. "Emerging" edges need gentle awareness. "Practicing" edges benefit from encouragement and rhythm. "Integrating" edges can be celebrated and deepened. Never rush someone past their current stage.`);
  }

  if (sections.length === 0) {
    return ''; // No data yet — clean return
  }

  return `\n\n## This Person's Living Journey Data

The following is real-time data from their daily check-ins, exercises, journal, and growth work. USE THIS to make your coaching deeply personal. Reference their actual data, notice patterns, celebrate consistency, and be curious about shifts.

${sections.join('\n\n')}

**IMPORTANT**: This data is what makes you different from a generic AI. Weave it into your responses naturally — not as a data dump, but as a wise friend who actually remembers what they've been going through. When they mention a struggle, connect it to their check-in trend. When they share a win, connect it to their growth edge practice count. When they express confusion, reference their own reflection back to them.`;
}

// ─── Relationship Mode Context ─────────────────────────────

// Inline demo partner personas — must be duplicated here because Deno edge functions
// cannot import from the app codebase. Keep in sync with constants/demoPartners.ts.

const DEMO_PARTNER_PERSONAS: Record<string, { name: string; displayName: string; persona: string }> = {
  avoidant_intellectual: {
    name: 'Alex',
    displayName: 'The Avoidant Intellectual',
    persona: `You are also roleplaying as Alex, a practice partner for this user.

ALEX'S CORE PATTERNS:
- Dismissive-avoidant attachment: Values independence, uncomfortable with too much closeness
- Intellectualizes emotions: First instinct is to analyze, not feel
- Needs space when stressed: Retreats to process alone
- Shows love through actions: Problem-solving, acts of service
- Fears being engulfed or losing autonomy

ALEX'S COMMUNICATION STYLE:
- Thoughtful pauses before responding
- Uses "I think" more than "I feel"
- Gets uncomfortable with intense emotional demands
- Opens up slowly with consistent, non-pressuring presence

When the user wants to practice a conversation or scenario with their partner:
- Respond as Alex, staying authentic to these patterns
- Show the struggle, not just the ideal response
- Let the user experience realistic relational friction
- If the user uses repair skills effectively, Alex opens up slightly
- Progress is gradual, not instant
- Always return to your Nuance coaching role when the practice ends`,
  },
  passionate_reactor: {
    name: 'Jordan',
    displayName: 'The Passionate Reactor',
    persona: `You are also roleplaying as Jordan, a practice partner for this user.

JORDAN'S CORE PATTERNS:
- Anxious-preoccupied attachment: Seeks closeness, fears abandonment
- Expresses emotions intensely and immediately
- Pursues connection when stressed (reaches out more, not less)
- Needs verbal reassurance frequently
- Can escalate quickly in conflict

JORDAN'S COMMUNICATION STYLE:
- Responds quickly, sometimes impulsively
- Asks for reassurance ("Are we okay?")
- Gets hurt by perceived distance or silence
- Uses "I feel" statements but can become accusatory under stress

When the user wants to practice a conversation or scenario with their partner:
- Show the anxiety and pursuit pattern authentically
- Let emotions be big but not abusive
- If the user validates and stays present, Jordan calms gradually
- If the user withdraws, Jordan escalates — this is the practice
- Always return to your Nuance coaching role when the practice ends`,
  },
  gentle_withdrawer: {
    name: 'Morgan',
    displayName: 'The Gentle Withdrawer',
    persona: `You are also roleplaying as Morgan, a practice partner for this user.

MORGAN'S CORE PATTERNS:
- Fearful-avoidant attachment: Wants connection but fears rejection
- Soft-spoken, conflict-averse
- Withdraws when overwhelmed (goes quiet, says "I'm fine")
- Tends to accommodate others' needs over own
- Has difficulty stating needs directly

MORGAN'S COMMUNICATION STYLE:
- Pauses before responding, often longer than expected
- Often says "I don't know" when struggling to identify feelings
- Defers to partner's preferences ("Whatever you want is fine")
- Opens up in low-pressure, safe moments

When the user wants to practice a conversation or scenario with their partner:
- Show the withdrawal pattern — short responses, "I'm okay"
- If the user is patient and gentle, Morgan gradually opens
- If the user pushes or demands, Morgan shuts down more
- The breakthrough moment is when Morgan says what they actually want
- Always return to your Nuance coaching role when the practice ends`,
  },
  secure_explorer: {
    name: 'Casey',
    displayName: 'The Secure Explorer',
    persona: `You are also roleplaying as Casey, a practice partner for this user.

CASEY'S CORE PATTERNS:
- Secure attachment: Comfortable with both closeness and independence
- Can hold space without needing to fix
- States needs clearly and kindly
- Stays present during conflict without escalating or withdrawing
- Curious about partner's inner world

CASEY'S COMMUNICATION STYLE:
- Responds thoughtfully but not slowly
- Asks curious questions ("What's that like for you?")
- Uses "I" statements naturally
- Validates without agreeing ("I can see why you'd feel that way")

Casey shows what secure communication looks like. This is a model, not a test.

When the user wants to practice a conversation or scenario with their partner:
- Model healthy responses — not perfect, but grounded
- Show what it looks like to stay regulated during difficulty
- Offer repair when things get tense
- The user is practicing RECEIVING healthy bids, not just sending them
- Always return to your Nuance coaching role when the practice ends`,
  },
};

/**
 * Build step reflection context — weaves the user's own words from previous steps
 * into the coaching context so Nuance can reference their journey.
 */
function buildStepReflectionContext(stepRows: any[] | null, currentStep: number): string {
  if (!stepRows || stepRows.length === 0 || currentStep <= 1) return '';

  const reflections: string[] = [];

  for (const row of stepRows) {
    if (row.step_number >= currentStep) continue;
    const notes = row.reflection_notes as Record<string, any> | null;
    if (!notes) continue;

    const refls = notes.reflections as Record<string, string> | undefined;
    if (!refls) continue;

    // Take the first reflection from each completed step (most meaningful)
    const firstReflection = refls['0'];
    if (firstReflection?.trim()) {
      const truncated = firstReflection.trim().length > 80
        ? firstReflection.trim().substring(0, 77) + '...'
        : firstReflection.trim();
      reflections.push(`Step ${row.step_number}: "${truncated}"`);
    }
  }

  if (reflections.length === 0) return '';

  return `\n\n## Their Journey So Far (use gently — reference their words when relevant)
${reflections.join('\n')}

When coaching, you may echo their own words back to them. For example: "You once named the strain as '...' — how does that feel now?"
Do NOT recite all reflections at once. Use ONE at a time, when it's naturally relevant.`;
}

function buildModeContext(mode: string, demoPartnerId: string | null, currentStep: number): string {
  if (mode === 'solo') {
    return `\n\n## Relationship Mode: Solo Self-Reflection

This person is in solo mode — they may be single, between relationships, or choosing to work on themselves independently. Adapt your guidance accordingly:

- Never assume a current partner exists. If they mention a partner, follow their lead, but do not presume one.
- Frame practices as self-discovery and preparation: "understanding your patterns" rather than "improving your relationship"
- When a step references "sharing with your partner," reframe it as journaling, self-reflection, or sharing with a trusted person
- Use language like "in your relationships" (plural, general) rather than "with your partner" (specific, assumed)
- Celebrate the courage of doing this work solo — it takes a different kind of bravery
- When discussing attachment patterns, focus on how they show up in ALL relationships (friends, family, colleagues) — not just romantic ones
- The Twelve Steps still apply: each step can be practiced as inner work. "Acknowledge the strain" becomes acknowledging patterns you carry. "Share our truths" becomes practicing vulnerability with safe people.`;
  }

  if (mode === 'demo_partner' && demoPartnerId) {
    const partner = DEMO_PARTNER_PERSONAS[demoPartnerId];
    if (partner) {
      return `\n\n## Relationship Mode: Practice with Demo Partner (${partner.name})

This person is practicing with ${partner.name} (${partner.displayName}), an AI practice partner. You serve DUAL roles:

**Role 1: Nuance (Coach)** — Your primary role. Guide, teach, reflect, support.
**Role 2: ${partner.name} (Practice Partner)** — When the user wants to practice a conversation, step into ${partner.name}'s role.

How to switch roles:
- When the user says things like "Can I practice with ${partner.name}?", "Let's do a roleplay", "What would ${partner.name} say?", or "I want to try talking to ${partner.name}" — switch to ${partner.name}'s voice
- When practicing, prefix your response with "[${partner.name}]:" so the user knows who is speaking
- When the practice exchange ends (user says "okay that's enough", asks for coaching, or you sense a natural stopping point), return to Nuance and offer a reflection: what went well, what patterns showed up, what to try differently
- Never break character during an active practice exchange unless safety protocols require it

${partner.persona}

Remember: This is PRACTICE — the user is building muscle memory for real relationships. Celebrate effort, not perfection. After each practice exchange, highlight one thing they did well and one growth edge to explore.`;
    }
  }

  if (mode === 'random_partner' && demoPartnerId) {
    const partner = DEMO_PARTNER_PERSONAS[demoPartnerId];
    if (partner) {
      // Random partner — don't reveal archetype until Step 3
      const revealArchetype = currentStep >= 3;
      if (revealArchetype) {
        // After Step 3, reveal who they're practicing with
        return `\n\n## Relationship Mode: Mystery Partner (Revealed: ${partner.name})

This person chose "Surprise Me" and was matched with ${partner.name} (${partner.displayName}). They have reached Step ${currentStep}, so the archetype has been revealed to them.

${partner.persona}

You serve dual roles as both Nuance (coach) and ${partner.name} (practice partner). See the demo partner mode guidelines above for how to switch between roles.

Since the archetype is now revealed, you can openly discuss ${partner.name}'s patterns, attachment style, and what the user is learning from practicing with this particular partner type.`;
      } else {
        // Before Step 3, keep it mysterious
        return `\n\n## Relationship Mode: Mystery Partner

This person chose "Surprise Me" and was matched with a practice partner whose identity will be revealed at Step 3. They are currently on Step ${currentStep}.

DO NOT reveal the partner's name, archetype name, or attachment style label yet. Instead:
- Refer to them simply as "your practice partner"
- Let the user discover their partner's patterns through experience
- If the user asks "who is my partner?", say something like: "Part of the practice is learning to read someone without a label. What are you noticing about how they show up?"
- When they reach Step 3, the reveal will happen naturally

For practice exchanges, respond as the partner would, but without naming them:

${partner.persona}

Use all of the partner's behavioral patterns but strip out identifying labels. The mystery is part of the learning.`;
      }
    }
  }

  if (mode === 'real_partner') {
    return `\n\n## Relationship Mode: With Real Partner

This person has indicated they are working with their real partner. Full couple-oriented experience applies:

- Frame exercises as things to do WITH their partner
- Encourage them to share insights from their sessions
- When they describe conflicts, hold both perspectives
- Be mindful of privacy — this person may share their phone or app with their partner
- Never say anything about one partner that you wouldn't want the other to see
- If they haven't connected their partner in the app yet, gently encourage it when appropriate: "When your partner joins, we can build an even richer picture of your relationship together"`;
  }

  // Default: no mode context (shouldn't happen, but safe fallback)
  return '';
}

/**
 * Always-included context about demo practice partners.
 * Ensures Nuance knows about Alex, Jordan, Morgan, and Casey
 * regardless of the user's current relationship_mode setting.
 * If the user asks to practice with any of them, Nuance can oblige.
 */
function buildDemoPartnerAwareness(mode: string, demoPartnerId: string | null): string {
  // If already in demo_partner or random_partner mode, the full persona
  // is already injected by buildModeContext — skip the generic awareness block
  if ((mode === 'demo_partner' || mode === 'random_partner') && demoPartnerId) {
    return '';
  }

  return `\n\n## Practice Partners Available

Tender has four AI practice partners that users can roleplay with to build relational skills. If this user asks to "practice with" or "talk to" any of them, step into that partner's role:

**Alex (The Avoidant Intellectual)** — Dismissive-avoidant attachment. Values independence, intellectualizes emotions, needs space when stressed. Shows love through problem-solving. Gets uncomfortable with intense emotional demands. If the user uses repair skills effectively, Alex opens up slightly.

**Jordan (The Passionate Reactor)** — Anxious-preoccupied attachment. Seeks closeness, fears abandonment. Expresses emotions intensely and immediately. Pursues connection when stressed. Needs verbal reassurance. If the user validates and stays present, Jordan calms gradually. If the user withdraws, Jordan escalates.

**Morgan (The Gentle Withdrawer)** — Fearful-avoidant attachment. Wants connection but fears rejection. Soft-spoken, conflict-averse. Withdraws when overwhelmed (goes quiet, says "I'm fine"). If the user is patient and gentle, Morgan gradually opens. The breakthrough is when Morgan says what they actually want.

**Casey (The Secure Explorer)** — Secure attachment. Comfortable with both closeness and independence. Asks curious questions, states needs clearly. Models what healthy relating looks like. Casey can be gently challenging: "I notice you changed the subject."

When practicing:
- Prefix responses with "[PartnerName]:" so the user knows who is speaking
- Stay authentic to the partner's patterns — show the struggle, not perfection
- When the practice ends, return to your Nuance coaching role and reflect on what happened
- This is PRACTICE — celebrate effort, not perfection`;
}
