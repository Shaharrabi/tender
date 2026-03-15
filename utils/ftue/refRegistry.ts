/**
 * RefRegistry — Singleton registry for measuring target element positions.
 *
 * Used by the FTUE tooltip and guided tour systems to find where
 * target elements are on screen, without invasive ref threading.
 *
 * Usage in screens:
 *   import { RefRegistry } from '@/utils/ftue/refRegistry';
 *   <View ref={(r) => RefRegistry.register('assessmentCta', r)}>
 *
 * Usage in FTUE components:
 *   const layout = await RefRegistry.measure('assessmentCta');
 */

import { Platform, View } from 'react-native';

export interface TargetMeasurement {
  x: number;
  y: number;
  width: number;
  height: number;
}

class RefRegistryClass {
  private refs: Map<string, View> = new Map();

  /**
   * Register a ref for a target element.
   * Call with null to unregister.
   */
  register(key: string, ref: View | null) {
    if (ref) {
      this.refs.set(key, ref);
    } else {
      this.refs.delete(key);
    }
  }

  /**
   * Measure a registered element's position on screen.
   * Returns null if the ref is not registered or measurement fails.
   *
   * On web: uses getBoundingClientRect for reliable viewport-relative
   * coordinates (measureInWindow returns stale/wrong values after scrolling).
   * On native: uses measureInWindow with a timeout guard.
   */
  measure(key: string): Promise<TargetMeasurement | null> {
    const ref = this.refs.get(key);
    if (!ref) return Promise.resolve(null);

    // Web: use getBoundingClientRect — always correct, even after scroll
    if (Platform.OS === 'web') {
      try {
        const node = ref as any;
        // React Native Web: ref IS the DOM node, or has _nativeTag/getNode()
        const domNode: HTMLElement | null =
          (typeof node.getBoundingClientRect === 'function') ? node :
          node?._nativeTag ?? node?.getNode?.() ?? null;
        if (domNode && typeof domNode.getBoundingClientRect === 'function') {
          const rect = domNode.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) return Promise.resolve(null);
          return Promise.resolve({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          });
        }
      } catch {
        // Fall through to measureInWindow
      }
    }

    const measurePromise = new Promise<TargetMeasurement | null>((resolve) => {
      try {
        ref.measureInWindow((x, y, width, height) => {
          if (width === 0 && height === 0) {
            resolve(null);
          } else {
            resolve({ x, y, width, height });
          }
        });
      } catch {
        resolve(null);
      }
    });

    // Timeout: resolve null after 500ms if callback never fires
    const timeout = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 500)
    );

    return Promise.race([measurePromise, timeout]);
  }

  /**
   * Measure a registered element's position relative to its parent.
   * Unlike measureInWindow, this works for off-screen elements in ScrollViews.
   * Returns { x, y, width, height } relative to the nearest native parent.
   */
  measureLayout(key: string): Promise<TargetMeasurement | null> {
    const ref = this.refs.get(key);
    if (!ref) return Promise.resolve(null);

    const measurePromise = new Promise<TargetMeasurement | null>((resolve) => {
      try {
        // measure() gives (x, y, width, height, pageX, pageY) relative to root
        (ref as any).measure(
          (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            if (width === 0 && height === 0) {
              resolve(null);
            } else {
              // pageX/pageY are relative to the root view (absolute content position)
              resolve({ x: pageX, y: pageY, width, height });
            }
          }
        );
      } catch {
        resolve(null);
      }
    });

    const timeout = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 500)
    );

    return Promise.race([measurePromise, timeout]);
  }

  /**
   * Check if a ref is registered.
   */
  has(key: string): boolean {
    return this.refs.has(key);
  }

  /**
   * Clear all registered refs (e.g. on screen unmount).
   */
  clear() {
    this.refs.clear();
  }

  /**
   * Unregister refs matching a prefix (e.g. 'home_' for home screen refs).
   */
  clearPrefix(prefix: string) {
    for (const key of this.refs.keys()) {
      if (key.startsWith(prefix)) {
        this.refs.delete(key);
      }
    }
  }
}

export const RefRegistry = new RefRegistryClass();
