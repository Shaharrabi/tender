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
  StyleSheet,
  Platform,
  Modal,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface ZoneGameProps {
  zoneNumber: number;
  visible: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export default function ZoneGame({ zoneNumber, visible, onComplete, onClose }: ZoneGameProps) {
  const insets = useSafeAreaInsets();
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

  // On web, use relative path (served by the same origin).
  // On native, load from the hosted Netlify site since local files
  // aren't accessible via URI in a WebView.
  const gameSrc = Platform.OS === 'web'
    ? `/games/zone${zoneNumber}.html`
    : `https://couples-app-demo.netlify.app/games/zone${zoneNumber}.html`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A0608" />
      <View style={styles.container}>
        {/* Native close button — always available even if game HTML hasn't loaded */}
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          style={[styles.nativeCloseButton, { top: insets.top + 10 }]}
          accessibilityRole="button"
          accessibilityLabel="Close game"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={20} color="rgba(255,255,255,0.85)" />
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

  // iframe needs position: absolute to fill a flex parent — CSS flex: 1 doesn't
  // work on iframes the same way it does on divs.
  return (
    <View style={styles.iframeWrapper}>
      <iframe
        ref={iframeRef as any}
        src={src}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: '#0A0608',
        } as any}
        allow="autoplay"
      />
    </View>
  );
}

/* ─── Native: WebView ─── */
function NativeWebView({ src, onMessage }: { src: string; onMessage: (data: string) => void }) {
  // Use window dimensions (visible area) instead of screen (full physical screen)
  // to avoid the game overflowing past the safe area / home indicator.
  const { height } = Dimensions.get('window');

  // Inject a script that forces the document to use the WebView's actual visible
  // height via window.innerHeight (most accurate), with a fallback to the RN
  // window height. This prevents the game from being clipped at the bottom.
  const injectedJS = `
    (function() {
      var h = window.innerHeight || ${height};
      var style = document.createElement('style');
      style.textContent = 'html, body, .phone { height: ' + h + 'px !important; max-height: ' + h + 'px !important; }';
      document.head.appendChild(style);
      true;
    })();
  `;

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
        scrollEnabled
        scalesPageToFit={false}
        injectedJavaScript={injectedJS}
        contentMode="mobile"
        automaticallyAdjustContentInsets={false}
        overScrollMode="never"
        bounces={false}
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
  nativeCloseButton: {
    position: 'absolute',
    right: 12,
    zIndex: 100,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iframeWrapper: {
    flex: 1,
    position: 'relative' as any,
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
