/**
 * Field Games — WebView ↔ React Native bridge types.
 *
 * Messages flow from the WebView game to RN via postMessage,
 * and from RN to the game via injectedJavaScript / injectJavaScript.
 */

// ─── Messages FROM the game (WebView → RN) ─────────────

export type FieldGameMessage =
  | { type: 'game:ready' }
  | { type: 'game:complete'; data: { score?: number; practiceData?: Record<string, string> } }
  | { type: 'game:practice_complete'; data: { responses: Record<string, string> } }
  | { type: 'game:close' };

// ─── Messages TO the game (RN → WebView) ────────────────

export interface FieldGameParams {
  stepNumber: number;
  partnerName?: string;
  userId?: string;
  mode: 'solo' | 'couple_async' | 'couple_live';
}

// ─── Registry metadata ──────────────────────────────────

export interface FieldGameMeta {
  id: string;
  stepNumber: number;
  zoneName: string;
  zoneIcon: string;
  subtitle: string;
  /** Estimated play time in minutes */
  estimatedMinutes: number;
}
