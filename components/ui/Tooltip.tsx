/**
 * Tooltip — Modal-based contextual tooltip with target highlight.
 *
 * Shows a floating card with pointer arrow, title, body, and CTA button,
 * positioned relative to a target element. Uses a semi-transparent backdrop
 * with a highlighted cutout around the target.
 *
 * Usage (via TooltipManager — not used directly):
 *   <Tooltip config={tooltipConfig} onDismiss={handleNext} />
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RefRegistry, TargetMeasurement } from '@/utils/ftue/refRegistry';
import { TooltipConfig } from '@/constants/ftue/tooltips';
import {
  FTUEColors,
  FTUELayout,
  FTUETiming,
  FTUEShadows,
} from '@/constants/ftue/theme';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from '@/constants/theme';

interface TooltipProps {
  /** Tooltip configuration */
  config: TooltipConfig;
  /** Called when tooltip is dismissed (CTA tap, X tap, or backdrop tap) */
  onDismiss: () => void;
}

export const Tooltip: React.FC<TooltipProps> = ({ config, onDismiss }) => {
  const [targetLayout, setTargetLayout] = useState<TargetMeasurement | null>(
    null
  );
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const tooltipWidth = Math.min(screenWidth - 32, FTUELayout.tooltipMaxWidth);

  useEffect(() => {
    // Measure target element after a short delay (let layout settle)
    const timer = setTimeout(async () => {
      const layout = await RefRegistry.measure(config.targetRef);
      if (layout) {
        setTargetLayout(layout);
        setVisible(true);
      } else {
        // Target not found — skip this tooltip
        onDismiss();
      }
    }, FTUETiming.measureDelay);

    return () => clearTimeout(timer);
  }, [config.targetRef]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: FTUETiming.tooltipFadeIn,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: FTUETiming.tooltipFadeOut,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: FTUETiming.tooltipFadeOut,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      onDismiss();
    });
  };

  if (!visible || !targetLayout) return null;

  // Calculate tooltip position
  const padding = 12;
  const pointerOffset = FTUELayout.tooltipPointerSize;

  let tooltipTop: number;
  if (config.position === 'bottom') {
    tooltipTop = targetLayout.y + targetLayout.height + padding + pointerOffset;
  } else {
    tooltipTop = targetLayout.y - padding - pointerOffset; // will be adjusted after measuring
  }

  // Horizontal centering relative to target, clamped to screen
  const tooltipLeft = Math.max(
    16,
    Math.min(
      targetLayout.x + targetLayout.width / 2 - tooltipWidth / 2,
      screenWidth - tooltipWidth - 16
    )
  );

  // Pointer horizontal position (relative to tooltip left edge)
  const pointerLeft = Math.max(
    20,
    Math.min(
      targetLayout.x + targetLayout.width / 2 - tooltipLeft - pointerOffset / 2,
      tooltipWidth - 40
    )
  );

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* Backdrop */}
      <Pressable
        style={styles.backdrop}
        onPress={handleDismiss}
        accessibilityLabel="Dismiss tooltip"
      >
        {/* Target highlight border */}
        <View
          style={[
            styles.targetHighlight,
            {
              top: targetLayout.y - 4,
              left: targetLayout.x - 4,
              width: targetLayout.width + 8,
              height: targetLayout.height + 8,
            },
          ]}
        />
      </Pressable>

      {/* Tooltip bubble */}
      <Animated.View
        style={[
          styles.tooltip,
          {
            width: tooltipWidth,
            top: tooltipTop,
            left: tooltipLeft,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        accessibilityRole="alert"
        accessibilityLabel={`${config.title}. ${config.body}`}
      >
        {/* Pointer arrow */}
        <View
          style={[
            styles.pointer,
            config.position === 'bottom'
              ? [styles.pointerTop, { left: pointerLeft }]
              : [styles.pointerBottom, { left: pointerLeft }],
          ]}
        />

        {/* Content */}
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.body}>{config.body}</Text>

        {/* CTA Button */}
        <Pressable
          style={styles.ctaButton}
          onPress={handleDismiss}
          accessibilityRole="button"
          accessibilityLabel={config.ctaText}
        >
          <Text style={styles.ctaText}>{config.ctaText}</Text>
        </Pressable>

        {/* Close X */}
        <Pressable
          style={styles.closeButton}
          onPress={handleDismiss}
          accessibilityLabel="Close tooltip"
          accessibilityRole="button"
        >
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: FTUEColors.backdrop,
  },
  targetHighlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: FTUEColors.spotlightBorder,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: FTUEColors.cardBg,
    borderRadius: FTUELayout.tooltipBorderRadius,
    padding: FTUELayout.tooltipPadding,
    paddingTop: 20,
    ...FTUEShadows.tooltipCard,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pointer: {
    position: 'absolute',
    width: FTUELayout.tooltipPointerSize,
    height: FTUELayout.tooltipPointerSize,
    backgroundColor: FTUEColors.cardBg,
    transform: [{ rotate: '45deg' }],
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pointerTop: {
    top: -FTUELayout.tooltipPointerSize / 2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  pointerBottom: {
    bottom: -FTUELayout.tooltipPointerSize / 2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  title: {
    ...Typography.headingS,
    color: FTUEColors.title,
    marginBottom: 6,
  },
  body: {
    ...Typography.body,
    color: FTUEColors.body,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  ctaButton: {
    backgroundColor: FTUEColors.ctaBg,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  ctaText: {
    ...Typography.button,
    color: FTUEColors.ctaText,
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 22,
    color: FTUEColors.muted,
    fontWeight: '300',
  },
});
