/**
 * Network state listener — thin wrapper around @react-native-community/netinfo.
 *
 * Exposes a subscribe function so the NetworkContext (and tests) can
 * listen for connectivity changes without importing netinfo directly.
 */

import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export type NetworkStatus = {
  isConnected: boolean;
  /** True while we haven't received the first update yet */
  isLoading: boolean;
};

/**
 * Subscribe to connectivity changes.
 * Returns an unsubscribe function (call on cleanup).
 */
export function subscribeToNetwork(
  callback: (status: NetworkStatus) => void,
): () => void {
  let firstUpdate = true;

  const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    callback({
      isConnected: state.isConnected ?? true, // assume connected if null
      isLoading: false,
    });
    firstUpdate = false;
  });

  // If the first event hasn't fired synchronously, expose a loading state
  if (firstUpdate) {
    callback({ isConnected: true, isLoading: true });
  }

  return unsubscribe;
}

/** One-shot check — useful for guard clauses before API calls */
export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected ?? true;
}
