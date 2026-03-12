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
  const { width, height } = Dimensions.get('window');

  // Comprehensive viewport fix for iOS WebView.
  //
  // Problem: iOS WebView can clamp the viewport to a different size than the
  // actual visible area. The games use `clientWidth/clientHeight` at init and
  // `getBoundingClientRect()` during touch events — if these disagree (because
  // the layout shifted after the modal animated in), paddle tracking and
  // collision detection break.
  //
  // Fix:
  // 1. Force viewport meta tag (prevents iOS scaling)
  // 2. Replace vh-based heights with pixel values from window.innerHeight
  // 3. Monkey-patch initCanvas() to re-measure after a frame
  // 4. Add ResizeObserver to re-init if game-area changes size
  // 5. Fire deferred resize events after modal animation settles
  const injectedJS = `
    (function() {
      var h = window.innerHeight || ${height};
      var w = window.innerWidth || ${width};

      /* 1. Force viewport meta — prevent iOS auto-scaling */
      var meta = document.querySelector('meta[name=viewport]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
      }
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

      /* 2. Force pixel-based dimensions (replaces vh units) */
      var style = document.createElement('style');
      style.textContent =
        'html, body, .phone { height: ' + h + 'px !important; max-height: ' + h + 'px !important; width: ' + w + 'px !important; }' +
        '#game-area { min-height: ' + Math.floor(h * 0.45) + 'px !important; }';
      document.head.appendChild(style);

      /* 3. Monkey-patch initCanvas to re-measure after layout settles */
      var _patchApplied = false;
      function patchInitCanvas() {
        if (_patchApplied || typeof window.initCanvas !== 'function') return;
        _patchApplied = true;
        var origInit = window.initCanvas;
        window.initCanvas = function() {
          origInit();
          /* Re-measure after a frame to catch post-animation layout shifts */
          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              var area = document.getElementById('game-area');
              var cvs = document.getElementById('canvas');
              if (!area || !cvs) return;
              var rect = area.getBoundingClientRect();
              var rW = Math.round(rect.width);
              var rH = Math.round(rect.height);
              if (typeof W !== 'undefined' && (Math.abs(rW - W) > 2 || Math.abs(rH - H) > 2)) {
                W = rW; H = rH;
                cvs.width = W; cvs.height = H;
                /* Re-derive size-dependent constants if they exist */
                if (typeof PADDLE_W !== 'undefined') { PADDLE_W = W * 0.22; }
                if (typeof PADDLE_H !== 'undefined') { PADDLE_H = H * 0.025; }
                if (typeof BALL_R !== 'undefined') { BALL_R = Math.min(W, H) * 0.025; }
                if (typeof BRICK_W !== 'undefined') { BRICK_W = W / 5 - 4; }
                if (typeof BRICK_H !== 'undefined') { BRICK_H = H * 0.04; }
                if (typeof draw === 'function') { draw(); }
              }
            });
          });
        };
      }

      /* 4. ResizeObserver — re-init canvas if game-area changes size */
      function attachResizeObserver() {
        var area = document.getElementById('game-area');
        if (!area || typeof ResizeObserver === 'undefined') return;
        new ResizeObserver(function() {
          if (typeof S !== 'undefined' && S.phase === 'game' && typeof initCanvas === 'function') {
            initCanvas();
            if (typeof draw === 'function') draw();
          }
        }).observe(area);
      }

      /* Apply patches once DOM is ready */
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        patchInitCanvas();
        attachResizeObserver();
      } else {
        document.addEventListener('DOMContentLoaded', function() {
          patchInitCanvas();
          attachResizeObserver();
        });
      }

      /* 5. Deferred resize events — catch post-modal-animation layout shifts */
      [100, 300, 600].forEach(function(delay) {
        setTimeout(function() {
          patchInitCanvas();
          window.dispatchEvent(new Event('resize'));
        }, delay);
      });

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
