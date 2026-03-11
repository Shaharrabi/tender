/**
 * NetworkContext — Provides `isOffline` boolean to the entire app.
 *
 * Wraps the services/network.ts listener in a React context so any
 * component can show offline-aware UI without importing netinfo.
 *
 * Usage:
 *   const { isOffline } = useNetwork();
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToNetwork, type NetworkStatus } from '@/services/network';

interface NetworkContextValue {
  /** True when the device is definitely offline */
  isOffline: boolean;
  /** True while the first connectivity check hasn't finished */
  isLoading: boolean;
}

const NetworkContext = createContext<NetworkContextValue>({
  isOffline: false,
  isLoading: true,
});

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isLoading: true,
  });

  useEffect(() => {
    const unsubscribe = subscribeToNetwork(setStatus);
    return unsubscribe;
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isOffline: !status.isConnected,
        isLoading: status.isLoading,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  return useContext(NetworkContext);
}
