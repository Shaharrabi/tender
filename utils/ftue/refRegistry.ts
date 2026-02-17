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

import { View } from 'react-native';

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
   */
  measure(key: string): Promise<TargetMeasurement | null> {
    const ref = this.refs.get(key);
    if (!ref) return Promise.resolve(null);

    return new Promise((resolve) => {
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
