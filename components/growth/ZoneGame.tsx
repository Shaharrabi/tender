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
import { Colors } from '@/constants/theme';

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
        {Platform.OS === 'web' ? (
          <WebIframe src={gameSrc} onMessage={handleMessage} onClose={onClose} />
        ) : (
          <NativeWebView src={gameSrc} onMessage={handleMessage} />
        )}
      </View>
    </Modal>
  );
}

/* ─── Web: iframe ─── */
function WebIframe({
  src,
  onMessage,
  onClose,
}: {
  src: string;
  onMessage: (data: string) => void;
  onClose: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [status, setStatus] = React.useState<'loading' | 'loaded' | 'failed'>('loading');
  const [attempt, setAttempt] = React.useState(0);

  const markLoaded = useCallback(() => setStatus('loaded'), []);
  const markFailed = useCallback(() => setStatus('failed'), []);

  React.useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (typeof e.data === 'string') {
        onMessage(e.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onMessage]);

  React.useEffect(() => {
    setStatus('loading');
  }, [src, attempt]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const iframe = iframeRef.current;
      if (!iframe) {
        markFailed();
        return;
      }

      try {
        const href = iframe.contentWindow?.location?.href ?? '';
        const body = iframe.contentDocument?.body;
        const isBlank = href === 'about:blank' || href === '';
        const isEmpty = !body || body.childElementCount === 0;
        if (isBlank || isEmpty) {
          markFailed();
        }
      } catch {
        // If the browser blocks inspection or the frame has not resolved,
        // show the fallback instead of a blank modal.
        markFailed();
      }
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [src, attempt, markFailed]);

  const retry = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  // iframe needs position: absolute to fill a flex parent — CSS flex: 1 doesn't
  // work on iframes the same way it does on divs.
  return (
    <View style={styles.iframeWrapper}>
      <iframe
        ref={iframeRef as any}
        key={`${src}-${attempt}`}
        src={src}
        title={`Zone ${src.split('zone').pop()?.replace('.html', '') ?? ''} game`}
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
          opacity: status === 'failed' ? 0 : 1,
          transition: 'opacity 180ms ease',
        } as any}
        allow="autoplay"
        onLoad={() => {
          const iframe = iframeRef.current;
          if (!iframe) {
            markFailed();
            return;
          }

          try {
            const href = iframe.contentWindow?.location?.href ?? '';
            const body = iframe.contentDocument?.body;
            const isBlank = href === 'about:blank' || href === '';
            const isEmpty = !body || body.childElementCount === 0;
            if (isBlank || isEmpty) {
              markFailed();
              return;
            }
            markLoaded();
          } catch {
            markFailed();
          }
        }}
        onError={markFailed}
      />

      {status !== 'loaded' ? (
        <View style={styles.webOverlay}>
          {status === 'loading' ? (
            <>
              <Text style={styles.webEyebrow}>Tender Zone</Text>
              <Text style={styles.webTitle}>Loading the practice</Text>
              <Text style={styles.webBody}>
                We&apos;re opening the interactive field. If it takes more than a moment,
                we&apos;ll offer a web-safe fallback.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.webEyebrow}>Tender Zone</Text>
              <Text style={styles.webTitle}>This practice is not opening on web yet</Text>
              <Text style={styles.webBody}>
                The game is available in the app, and we&apos;re also restoring the web
                version. You can try again now, or keep moving in the app for the
                full experience.
              </Text>
              <View style={styles.webActions}>
                <TouchableOpacity style={styles.retryButton} onPress={retry} activeOpacity={0.85}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dismissButton} onPress={onClose} activeOpacity={0.85}>
                  <Text style={styles.dismissButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      ) : null}
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
  iframeWrapper: {
    flex: 1,
    position: 'relative' as any,
  },
  webOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
    borderRadius: 28,
    backgroundColor: 'rgba(253, 246, 240, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(216,164,153,0.35)',
    paddingHorizontal: 28,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#130E11',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  webEyebrow: {
    fontSize: 12,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: '#8B3A4A',
    marginBottom: 10,
  },
  webTitle: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    color: '#2D2226',
    marginBottom: 14,
    fontWeight: '600',
  },
  webBody: {
    fontSize: 17,
    lineHeight: 27,
    textAlign: 'center',
    color: '#54484B',
    maxWidth: 420,
  },
  webActions: {
    marginTop: 22,
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    minWidth: 180,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6B9080',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  dismissButton: {
    minWidth: 120,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(45,34,38,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.76)',
  },
  dismissButtonText: {
    color: '#2D2226',
    fontSize: 13,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    fontWeight: '600',
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
