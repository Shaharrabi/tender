/**
 * React Query client configuration for Tender
 *
 * Centralized QueryClient with sensible defaults:
 * - 5 minute stale time (portrait data doesn't change often)
 * - 30 minute cache time
 * - No automatic refetching on window focus (mobile app)
 * - Retry with exponential backoff
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutes — data is fresh for this long
      gcTime: 30 * 60 * 1000,       // 30 minutes — cached data kept this long
      refetchOnWindowFocus: false,    // Mobile app — no window focus events
      refetchOnReconnect: true,       // Refetch when network comes back
      retry: 2,                       // Retry failed requests twice
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// ─── Query Key Factories ─────────────────────────────────
// Hierarchical keys for targeted invalidation.
// e.g., queryClient.invalidateQueries({ queryKey: queryKeys.portrait.all })

export const queryKeys = {
  portrait: {
    all: ['portrait'] as const,
    detail: (userId: string) => ['portrait', userId] as const,
    canGenerate: (userId: string) => ['portrait', 'canGenerate', userId] as const,
    scores: (userId: string) => ['portrait', 'scores', userId] as const,
    previousScores: (userId: string) => ['portrait', 'previousScores', userId] as const,
  },
  couple: {
    all: ['couple'] as const,
    mine: (userId: string) => ['couple', 'mine', userId] as const,
    portrait: (coupleId: string) => ['couple', 'portrait', coupleId] as const,
    deepPortrait: (coupleId: string) => ['couple', 'deepPortrait', coupleId] as const,
    partnerProfile: (userId: string) => ['couple', 'partner', userId] as const,
    dyadicScores: (coupleId: string) => ['couple', 'dyadicScores', coupleId] as const,
  },
  assessments: {
    all: ['assessments'] as const,
    byUser: (userId: string) => ['assessments', userId] as const,
  },
  consent: {
    all: ['consent'] as const,
    user: (userId: string) => ['consent', userId] as const,
    sharing: (userId: string, coupleId: string) =>
      ['consent', 'sharing', userId, coupleId] as const,
  },
};
