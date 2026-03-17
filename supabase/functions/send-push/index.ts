/**
 * Supabase Edge Function — Send Push Notifications via Expo Push API
 *
 * Accepts a recipient user ID, title, body, and optional data payload.
 * Looks up all Expo push tokens for the recipient and sends notifications.
 *
 * Deploy: supabase functions deploy send-push
 * Secrets: uses SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY (all auto-injected)
 *
 * Called by:
 *   - Database trigger on partner_activity inserts (via pg_net)
 *   - Client-side RPC for custom notifications
 */

// @ts-nocheck — Deno runtime, not Node
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

// ─── CORS — same pattern as chat function ─────────────
const PRODUCTION_ORIGINS = [
  'https://tender-science.netlify.app',
  'https://tenderrelationship.com',
  'https://www.tenderrelationship.com',
];

function isAllowedOrigin(origin: string): boolean {
  if (PRODUCTION_ORIGINS.includes(origin)) return true;
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

// ─── Expo Push API ────────────────────────────────────

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  sound?: string;
  data?: Record<string, unknown>;
}

interface ExpoPushTicket {
  status: 'ok' | 'error';
  id?: string;
  message?: string;
  details?: { error?: string };
}

/**
 * Send push notifications via Expo Push API.
 * Accepts an array of messages and returns the tickets.
 */
async function sendExpoPush(messages: ExpoPushMessage[]): Promise<ExpoPushTicket[]> {
  if (messages.length === 0) return [];

  const response = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('[send-push] Expo API error:', response.status, text);
    throw new Error(`Expo Push API returned ${response.status}: ${text}`);
  }

  const result = await response.json();
  return result.data as ExpoPushTicket[];
}

// ─── Main handler ─────────────────────────────────────

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  try {
    // ─── AUTH VERIFICATION ──────────────────────────────
    // The function can be called two ways:
    //   1. From a client with a user JWT (Authorization: Bearer <jwt>)
    //   2. From a DB trigger via pg_net with the service role key
    // We check for both.

    const authHeader = req.headers.get('Authorization');
    let callerAuthenticated = false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const jwt = authHeader.replace('Bearer ', '');

      // Check if it's the service role key itself (from pg_net trigger)
      if (jwt === SUPABASE_SERVICE_ROLE_KEY) {
        callerAuthenticated = true;
      } else {
        // Verify as user JWT — same multi-approach pattern as chat function
        let authUser: any = null;

        // Approach 1: ANON key client + JWT in global headers
        try {
          const client1 = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY ?? SUPABASE_SERVICE_ROLE_KEY!, {
            global: { headers: { Authorization: `Bearer ${jwt}` } },
          });
          const { data, error } = await client1.auth.getUser();
          if (!error && data?.user) authUser = data.user;
        } catch (e) {
          console.warn('[send-push] Auth approach 1 threw:', e.message);
        }

        // Approach 2: Service-role client + getUser(jwt)
        if (!authUser && SUPABASE_SERVICE_ROLE_KEY) {
          try {
            const client2 = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY);
            const { data, error } = await client2.auth.getUser(jwt);
            if (!error && data?.user) authUser = data.user;
          } catch (e) {
            console.warn('[send-push] Auth approach 2 threw:', e.message);
          }
        }

        if (authUser) callerAuthenticated = true;
      }
    }

    if (!callerAuthenticated) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization. Please sign in again.' }),
        { status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
      );
    }

    // ─── PARSE REQUEST BODY ─────────────────────────────
    const { recipient_user_id, title, body, data } = await req.json();

    if (!recipient_user_id || !title || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: recipient_user_id, title, body' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
      );
    }

    // ─── FETCH PUSH TOKENS ─────────────────────────────
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { data: tokens, error: tokensError } = await supabase
      .from('push_tokens')
      .select('token')
      .eq('user_id', recipient_user_id);

    if (tokensError) {
      console.error('[send-push] Failed to fetch tokens:', tokensError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch push tokens', details: tokensError.message }),
        { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
      );
    }

    if (!tokens || tokens.length === 0) {
      console.log(`[send-push] No push tokens found for user ${recipient_user_id}`);
      return new Response(
        JSON.stringify({ success: true, sent: 0, failed: 0, message: 'No push tokens registered for recipient' }),
        { status: 200, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
      );
    }

    // ─── BUILD & SEND MESSAGES ──────────────────────────
    const messages: ExpoPushMessage[] = tokens.map((t: { token: string }) => ({
      to: t.token,
      title,
      body,
      sound: 'default',
      ...(data ? { data } : {}),
    }));

    console.log(`[send-push] Sending ${messages.length} notification(s) to user ${recipient_user_id}`);

    const tickets = await sendExpoPush(messages);

    // ─── PROCESS RESULTS ────────────────────────────────
    let sent = 0;
    let failed = 0;
    const invalidTokens: string[] = [];

    tickets.forEach((ticket, i) => {
      if (ticket.status === 'ok') {
        sent++;
      } else {
        failed++;
        console.warn(`[send-push] Ticket error for token ${tokens[i].token}:`, ticket.message, ticket.details);

        // Track tokens that should be removed (DeviceNotRegistered = uninstalled app)
        if (ticket.details?.error === 'DeviceNotRegistered') {
          invalidTokens.push(tokens[i].token);
        }
      }
    });

    // ─── CLEAN UP INVALID TOKENS ────────────────────────
    if (invalidTokens.length > 0) {
      console.log(`[send-push] Removing ${invalidTokens.length} invalid token(s)`);
      const { error: deleteError } = await supabase
        .from('push_tokens')
        .delete()
        .in('token', invalidTokens);

      if (deleteError) {
        console.error('[send-push] Failed to delete invalid tokens:', deleteError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, failed, invalidTokensRemoved: invalidTokens.length }),
      { status: 200, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    console.error('[send-push] Unhandled error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
    );
  }
});
