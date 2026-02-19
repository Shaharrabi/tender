/**
 * useWritingTimer — Tracks active writing time and fires milestone callbacks.
 *
 * Designed for the journal, but reusable anywhere writing happens.
 *
 * How it works:
 * - Timer starts when user begins typing (first onTextChange)
 * - Timer pauses after 30s of inactivity (no typing, no focus)
 * - Timer resumes on next focus/text change
 * - Accumulated active time persists across focus/blur cycles within a session
 * - Session resets on component unmount (leaving the journal screen)
 * - Milestones fire once each at 5, 10, and 20 minutes
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ─────────────────────────────────────────────

export type WritingMilestone = 5 | 10 | 20;

const MILESTONES: WritingMilestone[] = [5, 10, 20];
const IDLE_TIMEOUT_MS = 30_000; // 30 seconds of inactivity pauses the timer
const TICK_INTERVAL_MS = 1_000; // Update every second

export interface WritingTimerResult {
  /** Current session minutes (whole number, floor) */
  sessionMinutes: number;
  /** Whether the user is actively writing (has focus + recent typing) */
  isWriting: boolean;
  /** Currently triggered milestone (null if none). Read and clear. */
  milestone: WritingMilestone | null;
  /** Call when any TextInput receives focus */
  onFieldFocus: () => void;
  /** Call when any TextInput loses focus */
  onFieldBlur: () => void;
  /** Call on every text change (resets idle timer) */
  onTextChange: () => void;
  /** Clear the current milestone after showing the banner */
  clearMilestone: () => void;
}

// ─── Hook ──────────────────────────────────────────────

export function useWritingTimer(): WritingTimerResult {
  // Accumulated active writing time in ms (persists across focus/blur)
  const accumulatedMsRef = useRef(0);
  // When the current active segment started (null = paused)
  const segmentStartRef = useRef<number | null>(null);
  // Idle timeout handle
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tick interval handle
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Track which milestones have already fired
  const firedRef = useRef(new Set<WritingMilestone>());
  // Number of focused fields (supports multiple TextInputs)
  const focusCountRef = useRef(0);

  // Reactive state
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const [milestone, setMilestone] = useState<WritingMilestone | null>(null);

  // ─── Internal helpers ────────────────────────────────

  const getTotalMs = useCallback(() => {
    const segment = segmentStartRef.current
      ? Date.now() - segmentStartRef.current
      : 0;
    return accumulatedMsRef.current + segment;
  }, []);

  const checkMilestones = useCallback((totalMs: number) => {
    const minutes = Math.floor(totalMs / 60_000);
    for (const m of MILESTONES) {
      if (minutes >= m && !firedRef.current.has(m)) {
        firedRef.current.add(m);
        setMilestone(m);
        return; // Fire one at a time
      }
    }
  }, []);

  const startSegment = useCallback(() => {
    if (segmentStartRef.current !== null) return; // Already running
    segmentStartRef.current = Date.now();
    setIsWriting(true);

    // Start the tick interval
    if (!tickRef.current) {
      tickRef.current = setInterval(() => {
        const totalMs = getTotalMs();
        setSessionMinutes(Math.floor(totalMs / 60_000));
        checkMilestones(totalMs);
      }, TICK_INTERVAL_MS);
    }
  }, [getTotalMs, checkMilestones]);

  const pauseSegment = useCallback(() => {
    if (segmentStartRef.current !== null) {
      accumulatedMsRef.current += Date.now() - segmentStartRef.current;
      segmentStartRef.current = null;
    }
    setIsWriting(false);

    // Stop the tick interval
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      pauseSegment();
    }, IDLE_TIMEOUT_MS);
  }, [pauseSegment]);

  // ─── Public callbacks ────────────────────────────────

  const onFieldFocus = useCallback(() => {
    focusCountRef.current += 1;
    startSegment();
    resetIdleTimer();
  }, [startSegment, resetIdleTimer]);

  const onFieldBlur = useCallback(() => {
    focusCountRef.current = Math.max(0, focusCountRef.current - 1);
    // If no fields are focused, start the idle countdown
    if (focusCountRef.current === 0) {
      resetIdleTimer();
    }
  }, [resetIdleTimer]);

  const onTextChange = useCallback(() => {
    // If not already writing (was paused), restart the segment
    if (segmentStartRef.current === null) {
      startSegment();
    }
    resetIdleTimer();
  }, [startSegment, resetIdleTimer]);

  const clearMilestone = useCallback(() => {
    setMilestone(null);
  }, []);

  // ─── Cleanup on unmount ──────────────────────────────

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  return {
    sessionMinutes,
    isWriting,
    milestone,
    onFieldFocus,
    onFieldBlur,
    onTextChange,
    clearMilestone,
  };
}
