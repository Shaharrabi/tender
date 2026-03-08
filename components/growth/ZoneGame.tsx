/**
 * ZoneGame — Renders an HTML zone game inside a fullscreen modal.
 *
 * Each of the 12 steps has a corresponding "zone game" — an immersive,
 * metaphorical HTML game. On web we render via iframe; on native via WebView.
 *
 * The game communicates back via postMessage:
 *   - { event: 'gameComplete', data: { zone } }  → game finished
 *   - { event: 'close', data: { zone } }          → user tapped "return"
 */

import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import { Colors, FontFamilies } from '@/constants/theme';

interface ZoneGameProps {
  zoneNumber: number;
  visible: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export default function ZoneGame({ zoneNumber, visible, onComplete, onClose }: ZoneGameProps) {
  const completedRef = useRef(false);

  const handleMessage = useCallback(
    (rawData: string) => {
      try {
        const msg = JSON.parse(rawData);
        if (msg.event === 'gameComplete' && !completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
        if (msg.event === 'close') {
          onClose();
        }
      } catch {
        // ignore non-JSON messages
      }
    },
    [onComplete, onClose],
  );

  // Reset completed flag when zone changes or modal re-opens
  React.useEffect(() => {
    if (visible) {
      completedRef.current = false;
    }
  }, [visible, zoneNumber]);

  if (!visible) return null;

  const gameSrc = `/games/zone${zoneNumber}.html`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close game"
        >
          <Text style={styles.closeText}>{'\u2715'}</Text>
        </TouchableOpacity>

        {Platform.OS === 'web' ? (
          <WebIframe src={gameSrc} onMessage={handleMessage} />
        ) : (
          <NativeWebView src={gameSrc} onMessage={handleMessage} />
        )}
      </View>
    </Modal>
  );
}

/* ─── Web: iframe ─── */
function WebIframe({ src, onMessage }: { src: string; onMessage: (data: string) => void }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  React.useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (typeof e.data === 'string') {
        onMessage(e.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onMessage]);

  return (
    <iframe
      ref={iframeRef as any}
      src={src}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        border: 'none',
        backgroundColor: '#0A0608',
      } as any}
      allow="autoplay"
    />
  );
}

/* ─── Native: WebView ─── */
function NativeWebView({ src, onMessage }: { src: string; onMessage: (data: string) => void }) {
  // Lazy-require to avoid web bundle issues
  try {
    const { WebView } = require('react-native-webview');
    return (
      <WebView
        source={{ uri: src }}
        style={styles.webview}
        onMessage={(e: any) => onMessage(e.nativeEvent.data)}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState
        originWhitelist={['*']}
      />
    );
  } catch {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>
          Zone games are not yet available on this platform.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0608',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 16,
    right: 16,
    zIndex: 100,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FontFamilies?.body ?? undefined,
  },
  webview: {
    flex: 1,
    backgroundColor: '#0A0608',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  fallbackText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
});
