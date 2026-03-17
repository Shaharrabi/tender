/**
 * useCourseSession — Supabase Realtime hook for live couple course play.
 *
 * Manages session lifecycle: create → join → play rounds → complete.
 * Uses Supabase Realtime channels for presence and event broadcast
 * so both partners see each other's state in real time.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/services/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type SessionStatus = 'idle' | 'lobby' | 'active' | 'complete';

export interface CourseScores {
  connection: number;
  insight: number;
  bids: number;
}

export interface PartnerPresence {
  partnerId: string;
  online: boolean;
  currentRound: number;
  hasResponded: boolean;
}

interface CourseSessionState {
  sessionId: string | null;
  status: SessionStatus;
  currentRound: number;
  scores: CourseScores;
  partnerPresence: PartnerPresence | null;
  myResponses: Map<number, { type: 'choice' | 'slider'; choiceIndex?: number; sliderValue?: number }>;
  partnerResponses: Map<number, { type: 'choice' | 'slider'; choiceIndex?: number; sliderValue?: number }>;
  error: string | null;
}

export function useCourseSession(
  coupleId: string | null,
  userId: string | null,
  courseId: string | null,
) {
  const [state, setState] = useState<CourseSessionState>({
    sessionId: null,
    status: 'idle',
    currentRound: 0,
    scores: { connection: 0, insight: 0, bids: 0 },
    partnerPresence: null,
    myResponses: new Map(),
    partnerResponses: new Map(),
    error: null,
  });

  const channelRef = useRef<RealtimeChannel | null>(null);

  // ── Create or join a session ──
  const startSession = useCallback(async () => {
    if (!coupleId || !userId || !courseId) return;

    try {
      // Check for existing active/lobby session
      const { data: existing } = await supabase
        .from('course_sessions')
        .select('*')
        .eq('couple_id', coupleId)
        .eq('course_id', courseId)
        .in('status', ['lobby', 'active'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existing) {
        // Join existing session — set partner_b_id if not already set
        if (existing.started_by !== userId && !existing.partner_b_id) {
          await supabase
            .from('course_sessions')
            .update({ partner_b_id: userId })
            .eq('id', existing.id); // Non-blocking — presence handles activation
        }
        setState(s => ({
          ...s,
          sessionId: existing.id,
          status: existing.status as SessionStatus,
          currentRound: existing.current_round,
          scores: existing.scores as CourseScores,
        }));
        return existing.id;
      }

      // Create new session
      const { data: session, error } = await supabase
        .from('course_sessions')
        .insert({
          couple_id: coupleId,
          course_id: courseId,
          started_by: userId,
          partner_a_id: userId,
          status: 'lobby',
          current_round: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setState(s => ({
        ...s,
        sessionId: session.id,
        status: 'lobby',
        currentRound: 0,
        scores: { connection: 0, insight: 0, bids: 0 },
        myResponses: new Map(),
        partnerResponses: new Map(),
      }));

      return session.id;
    } catch (err: any) {
      setState(s => ({ ...s, error: err.message }));
      return null;
    }
  }, [coupleId, userId, courseId]);

  // ── Subscribe to Realtime channel ──
  useEffect(() => {
    if (!state.sessionId || !userId) return;

    const channelName = `course:${state.sessionId}`;
    const channel = supabase.channel(channelName, {
      config: { presence: { key: userId } },
    });

    // Track presence
    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      const partnerEntries = Object.entries(presenceState).filter(
        ([key]) => key !== userId,
      );

      if (partnerEntries.length > 0) {
        const [partnerId, data] = partnerEntries[0];
        const partnerData = (data as any[])[0] || {};
        setState(s => ({
          ...s,
          partnerPresence: {
            partnerId,
            online: true,
            currentRound: partnerData.currentRound ?? 0,
            hasResponded: partnerData.hasResponded ?? false,
          },
        }));

        // If both present and in lobby → activate
        if (state.status === 'lobby') {
          activateSession();
        }
      } else {
        setState(s => ({ ...s, partnerPresence: null }));
      }
    });

    // Listen for round responses
    channel.on('broadcast', { event: 'response' }, ({ payload }) => {
      if (payload.userId !== userId) {
        setState(s => {
          const newPartnerResponses = new Map(s.partnerResponses);
          newPartnerResponses.set(payload.roundIndex, {
            type: payload.responseType,
            choiceIndex: payload.choiceIndex,
            sliderValue: payload.sliderValue,
          });
          return { ...s, partnerResponses: newPartnerResponses };
        });
      }
    });

    // Listen for round advances
    channel.on('broadcast', { event: 'advance' }, ({ payload }) => {
      setState(s => ({
        ...s,
        currentRound: payload.round,
        scores: payload.scores ?? s.scores,
      }));
    });

    // Listen for completion
    channel.on('broadcast', { event: 'complete' }, ({ payload }) => {
      setState(s => ({
        ...s,
        status: 'complete',
        scores: payload.scores ?? s.scores,
      }));
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          currentRound: state.currentRound,
          hasResponded: false,
        });
      }
    });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [state.sessionId, userId]);

  // ── Activate session (both partners present) ──
  const activateSession = useCallback(async () => {
    if (!state.sessionId) return;

    await supabase
      .from('course_sessions')
      .update({ status: 'active' })
      .eq('id', state.sessionId);

    setState(s => ({ ...s, status: 'active' }));
  }, [state.sessionId]);

  // ── Submit a response ──
  const submitResponse = useCallback(async (
    roundIndex: number,
    responseType: 'choice' | 'slider',
    choiceIndex?: number,
    sliderValue?: number,
  ) => {
    if (!state.sessionId || !userId) return;

    // Save to DB
    await supabase.from('course_responses').upsert({
      session_id: state.sessionId,
      user_id: userId,
      round_index: roundIndex,
      response_type: responseType,
      choice_index: choiceIndex ?? null,
      slider_value: sliderValue ?? null,
    }, { onConflict: 'session_id,user_id,round_index' });

    // Update local state
    setState(s => {
      const newMyResponses = new Map(s.myResponses);
      newMyResponses.set(roundIndex, { type: responseType, choiceIndex, sliderValue });

      // Update scores
      const newScores = { ...s.scores };
      newScores.connection += 1;
      if (responseType === 'slider') {
        newScores.insight += 1;
      } else {
        newScores.bids += 1;
        if (choiceIndex === 0 || choiceIndex === 3) {
          newScores.insight += 1;
        }
      }

      return { ...s, myResponses: newMyResponses, scores: newScores };
    });

    // Broadcast to partner
    channelRef.current?.send({
      type: 'broadcast',
      event: 'response',
      payload: { userId, roundIndex, responseType, choiceIndex, sliderValue },
    });

    // Update presence
    channelRef.current?.track({
      currentRound: roundIndex,
      hasResponded: true,
    });
  }, [state.sessionId, userId]);

  // ── Advance to next round ──
  const advanceRound = useCallback(async () => {
    if (!state.sessionId) return;

    const nextRound = state.currentRound + 1;

    await supabase
      .from('course_sessions')
      .update({ current_round: nextRound })
      .eq('id', state.sessionId);

    setState(s => ({ ...s, currentRound: nextRound }));

    channelRef.current?.send({
      type: 'broadcast',
      event: 'advance',
      payload: { round: nextRound, scores: state.scores },
    });
  }, [state.sessionId, state.currentRound, state.scores]);

  // ── Complete the course ──
  const completeCourse = useCallback(async () => {
    if (!state.sessionId) return;

    await supabase
      .from('course_sessions')
      .update({
        status: 'complete',
        completed_at: new Date().toISOString(),
        scores: state.scores,
      })
      .eq('id', state.sessionId);

    setState(s => ({ ...s, status: 'complete' }));

    channelRef.current?.send({
      type: 'broadcast',
      event: 'complete',
      payload: { scores: state.scores },
    });
  }, [state.sessionId, state.scores]);

  // ── Earn badge ──
  const earnBadge = useCallback(async (badgeName: string) => {
    if (!coupleId || !userId || !courseId || !state.sessionId) return;

    await supabase.from('course_badges').upsert({
      user_id: userId,
      couple_id: coupleId,
      course_id: courseId,
      badge_name: badgeName,
      session_id: state.sessionId,
    }, { onConflict: 'user_id,couple_id,course_id' });
  }, [coupleId, userId, courseId, state.sessionId]);

  // ── Reset session ──
  const resetSession = useCallback(() => {
    channelRef.current?.unsubscribe();
    channelRef.current = null;
    setState({
      sessionId: null,
      status: 'idle',
      currentRound: 0,
      scores: { connection: 0, insight: 0, bids: 0 },
      partnerPresence: null,
      myResponses: new Map(),
      partnerResponses: new Map(),
      error: null,
    });
  }, []);

  // ── Get completed courses ──
  const getCompletedCourses = useCallback(async (): Promise<string[]> => {
    if (!coupleId) return [];

    const { data } = await supabase
      .from('course_sessions')
      .select('course_id')
      .eq('couple_id', coupleId)
      .eq('status', 'complete');

    return [...new Set((data ?? []).map(d => d.course_id))];
  }, [coupleId]);

  // ── Get earned badges ──
  const getEarnedBadges = useCallback(async () => {
    if (!userId || !coupleId) return [];

    const { data } = await supabase
      .from('course_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('couple_id', coupleId);

    return data ?? [];
  }, [userId, coupleId]);

  return {
    ...state,
    startSession,
    submitResponse,
    advanceRound,
    completeCourse,
    earnBadge,
    resetSession,
    getCompletedCourses,
    getEarnedBadges,
    isPartnerOnline: !!state.partnerPresence?.online,
  };
}
