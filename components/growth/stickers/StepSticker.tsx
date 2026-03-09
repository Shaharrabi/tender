/**
 * StepSticker — Animated SVG sticker for each of the 12 Healing Steps.
 *
 * Each step has a unique visual metaphor inspired by the Tender Sticker System
 * (Wes Anderson edition). Uses react-native-svg + react-native-reanimated
 * for gentle, organic animations.
 *
 * Size is configurable (default 120). Phase color auto-detected from step number.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path, Line, G, Text as SvgText, Ellipse } from 'react-native-svg';
import { getPhaseForStep } from '@/utils/steps/twelve-steps';
import { Colors } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface StepStickerProps {
  stepNumber: number;
  size?: number;
  animated?: boolean;
  showLabel?: boolean;
}

// ─── Color palette (from sticker system) ──────────────────
const STICKER = {
  blush: '#E8B4B8',
  sage: '#A8B5A2',
  mustard: '#D4A843',
  cream: '#F5F0E8',
  dustyBlue: '#8BA4B8',
  terracotta: '#C4836A',
  plum: '#8B6B7B',
  warmWhite: '#FAF7F2',
  ink: '#3D3530',
  softInk: '#6B5E56',
};

// ─── Step labels ──────────────────────────────────────────
const STEP_LABELS = [
  '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX',
  'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE',
];

export default function StepSticker({ stepNumber, size = 120, animated = true, showLabel = true }: StepStickerProps) {
  const phase = getPhaseForStep(stepNumber);
  const phaseColor = phase?.color ?? Colors.textMuted;

  // ── Breathing animation — gentle scale pulse ──
  const breathe = useRef(new Animated.Value(0)).current;
  // ── Float animation — gentle vertical bob ──
  const float = useRef(new Animated.Value(0)).current;
  // ── Glow animation — pulsing ring opacity ──
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    breatheLoop.start();
    floatLoop.start();
    glowLoop.start();
    return () => { breatheLoop.stop(); floatLoop.stop(); glowLoop.stop(); };
  }, [animated]);

  // Interpolations
  const breathScale = animated
    ? breathe.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.04] })
    : 1;

  const floatY = animated
    ? float.interpolate({ inputRange: [0, 1], outputRange: [0, -5] })
    : 0;

  const glowOpacity = animated
    ? glow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] })
    : 0.5;

  const vb = '0 0 100 100';

  return (
    <View style={[styles.container, { width: size, height: size + 8 }]}>
      <Animated.View style={{
        transform: [
          { scale: breathScale },
          { translateY: floatY },
        ],
      }}>
        <Svg width={size} height={size} viewBox={vb}>
          {/* Outer glow ring */}
          <AnimatedCircle cx="50" cy="50" r="48" fill="none" stroke={phaseColor} strokeWidth={0.5} opacity={glowOpacity} />

          {/* Circular frame */}
          <Circle cx="50" cy="50" r="46" fill={STICKER.cream} stroke={phaseColor} strokeWidth={1.2} opacity={0.7} />

          {/* Inner soft glow */}
          <AnimatedCircle cx="50" cy="50" r="42" fill={phaseColor} opacity={glow.interpolate({ inputRange: [0, 1], outputRange: [0.02, 0.06] })} />

          {/* Step-specific artwork */}
          {renderStepArt(stepNumber, phaseColor)}

          {/* Bottom label */}
          {showLabel && (
            <SvgText
              x="50"
              y="90"
              textAnchor="middle"
              fontFamily="serif"
              fontSize="4.5"
              fill={STICKER.softInk}
            >
              STEP {STEP_LABELS[stepNumber] ?? stepNumber}
            </SvgText>
          )}
        </Svg>
      </Animated.View>
    </View>
  );
}

// ─── Per-step artwork ─────────────────────────────────────

function renderStepArt(step: number, color: string) {
  switch (step) {
    case 1: return <Step1Art color={color} />;
    case 2: return <Step2Art color={color} />;
    case 3: return <Step3Art color={color} />;
    case 4: return <Step4Art color={color} />;
    case 5: return <Step5Art color={color} />;
    case 6: return <Step6Art color={color} />;
    case 7: return <Step7Art color={color} />;
    case 8: return <Step8Art color={color} />;
    case 9: return <Step9Art color={color} />;
    case 10: return <Step10Art color={color} />;
    case 11: return <Step11Art color={color} />;
    case 12: return <Step12Art color={color} />;
    default: return null;
  }
}

// Step 1 — Acknowledging the Wound: Pulsing heart with crack line
function Step1Art({ color }: { color: string }) {
  return (
    <G>
      <Circle cx="50" cy="42" r="18" fill="none" stroke={STICKER.blush} strokeWidth={1.2} opacity={0.8} />
      <Line x1="50" y1="30" x2="50" y2="54" stroke={STICKER.terracotta} strokeWidth={0.8} strokeDasharray="2,2" />
      <Circle cx="50" cy="42" r="3.5" fill={STICKER.blush} opacity={0.7} />
      <Circle cx="50" cy="42" r="8" fill="none" stroke={color} strokeWidth={0.6} opacity={0.4} />
    </G>
  );
}

// Step 2 — Seeing Patterns: Overlapping Venn circles with wave
function Step2Art({ color }: { color: string }) {
  return (
    <G>
      <Circle cx="37" cy="40" r="10" fill="none" stroke={STICKER.dustyBlue} strokeWidth={1} />
      <Circle cx="50" cy="40" r="10" fill="none" stroke={STICKER.dustyBlue} strokeWidth={1} opacity={0.7} />
      <Circle cx="63" cy="40" r="10" fill="none" stroke={STICKER.dustyBlue} strokeWidth={1} opacity={0.4} />
      <Path d="M30,56 Q42,50 50,56 T70,56" fill="none" stroke={STICKER.mustard} strokeWidth={0.8} />
    </G>
  );
}

// Step 3 — Turning Toward: Two figures approaching each other
function Step3Art({ color }: { color: string }) {
  return (
    <G>
      <Rect x="28" y="30" width="12" height="24" rx="6" fill="none" stroke={STICKER.sage} strokeWidth={1} />
      <Rect x="60" y="30" width="12" height="24" rx="6" fill="none" stroke={STICKER.sage} strokeWidth={1} />
      <Circle cx="50" cy="42" r="3" fill={STICKER.mustard} opacity={0.5} />
      <Path d="M40,42 L46,42" fill="none" stroke={color} strokeWidth={0.5} opacity={0.4} />
      <Path d="M54,42 L60,42" fill="none" stroke={color} strokeWidth={0.5} opacity={0.4} />
    </G>
  );
}

// Step 4 — Softening Defenses: Shield dissolving into petals
function Step4Art({ color }: { color: string }) {
  return (
    <G>
      {/* Shield outline (fading) */}
      <Path d="M50,24 L65,34 L65,50 Q65,62 50,68 Q35,62 35,50 L35,34 Z"
        fill="none" stroke={STICKER.dustyBlue} strokeWidth={0.8} opacity={0.35} strokeDasharray="3,2" />
      {/* Petals emerging */}
      <Ellipse cx="50" cy="40" rx="6" ry="10" fill={STICKER.blush} opacity={0.25} />
      <Ellipse cx="44" cy="46" rx="5" ry="8" fill={STICKER.blush} opacity={0.2} transform="rotate(-30 44 46)" />
      <Ellipse cx="56" cy="46" rx="5" ry="8" fill={STICKER.blush} opacity={0.2} transform="rotate(30 56 46)" />
      <Circle cx="50" cy="45" r="3" fill={color} opacity={0.4} />
    </G>
  );
}

// Step 5 — Emotional Vulnerability: Opening door with warm light
function Step5Art({ color }: { color: string }) {
  return (
    <G>
      {/* Door frame */}
      <Rect x="35" y="24" width="30" height="44" rx="2" fill="none" stroke={STICKER.ink} strokeWidth={0.8} />
      {/* Opening door (narrower = opening) */}
      <Rect x="35" y="24" width="10" height="44" rx="1" fill="none" stroke={STICKER.mustard} strokeWidth={0.6} />
      {/* Warm light spill */}
      <Ellipse cx="50" cy="56" rx="12" ry="6" fill={STICKER.mustard} opacity={0.15} />
      <Ellipse cx="50" cy="52" rx="8" ry="4" fill={STICKER.mustard} opacity={0.2} />
      {/* Handle dot */}
      <Circle cx="42" cy="46" r="1.5" fill={color} opacity={0.6} />
    </G>
  );
}

// Step 6 — Rupture & Repair: Jagged line smoothing into curve
function Step6Art({ color }: { color: string }) {
  return (
    <G>
      {/* Jagged rupture line (top) */}
      <Path d="M25,38 L32,28 L38,40 L44,26 L50,38 L56,28 L62,40 L68,30 L75,38"
        fill="none" stroke={STICKER.terracotta} strokeWidth={0.7} opacity={0.45} />
      {/* Smooth repair curve (bottom) */}
      <Path d="M25,52 Q50,42 75,52"
        fill="none" stroke={STICKER.sage} strokeWidth={1.2} />
      {/* Healing point */}
      <Circle cx="50" cy="47" r="2.5" fill={STICKER.mustard} opacity={0.6} />
    </G>
  );
}

// Step 7 — Building Trust: Stacking blocks, steady
function Step7Art({ color }: { color: string }) {
  return (
    <G>
      {/* Three stacked blocks */}
      <Rect x="37" y="52" width="26" height="10" rx="2" fill="none" stroke={STICKER.sage} strokeWidth={0.8} />
      <Rect x="40" y="42" width="20" height="10" rx="2" fill="none" stroke={STICKER.sage} strokeWidth={0.8} />
      <Rect x="43" y="32" width="14" height="10" rx="2" fill="none" stroke={STICKER.sage} strokeWidth={0.8} />
      {/* Keystone/capstone */}
      <Circle cx="50" cy="28" r="3" fill={STICKER.mustard} opacity={0.5} />
      {/* Subtle fill for solidity */}
      <Rect x="37" y="52" width="26" height="10" rx="2" fill={color} opacity={0.08} />
      <Rect x="40" y="42" width="20" height="10" rx="2" fill={color} opacity={0.12} />
      <Rect x="43" y="32" width="14" height="10" rx="2" fill={color} opacity={0.16} />
    </G>
  );
}

// Step 8 — Deepening Intimacy: Two spirals intertwining
function Step8Art({ color }: { color: string }) {
  return (
    <G>
      {/* Spiral 1 — from left */}
      <Path d="M30,50 Q35,30 50,35 Q60,38 55,50 Q52,58 45,55"
        fill="none" stroke={STICKER.blush} strokeWidth={1} />
      {/* Spiral 2 — from right */}
      <Path d="M70,50 Q65,30 50,35 Q40,38 45,50 Q48,58 55,55"
        fill="none" stroke={STICKER.dustyBlue} strokeWidth={1} />
      {/* Center meeting point */}
      <Circle cx="50" cy="45" r="3" fill={STICKER.mustard} opacity={0.5} />
    </G>
  );
}

// Step 9 — Shared Meaning: Overlapping frames/windows
function Step9Art({ color }: { color: string }) {
  return (
    <G>
      {/* Frame 1 */}
      <Rect x="28" y="28" width="24" height="28" rx="2" fill="none" stroke={STICKER.blush} strokeWidth={0.8} />
      {/* Frame 2 — overlapping */}
      <Rect x="48" y="32" width="24" height="28" rx="2" fill="none" stroke={STICKER.dustyBlue} strokeWidth={0.8} />
      {/* Overlap region highlight */}
      <Rect x="48" y="32" width="4" height="24" fill={STICKER.mustard} opacity={0.15} />
      {/* Shared star */}
      <SvgText x="50" y="48" textAnchor="middle" fontSize="8" fill={STICKER.mustard} opacity={0.6}>✦</SvgText>
    </G>
  );
}

// Step 10 — Integration: Puzzle pieces fitting together
function Step10Art({ color }: { color: string }) {
  return (
    <G>
      {/* Four quadrants with puzzle-tab connections */}
      <Rect x="30" y="28" width="18" height="18" rx="2" fill={STICKER.sage} opacity={0.15} stroke={STICKER.sage} strokeWidth={0.6} />
      <Rect x="52" y="28" width="18" height="18" rx="2" fill={STICKER.dustyBlue} opacity={0.15} stroke={STICKER.dustyBlue} strokeWidth={0.6} />
      <Rect x="30" y="50" width="18" height="18" rx="2" fill={STICKER.blush} opacity={0.15} stroke={STICKER.blush} strokeWidth={0.6} />
      <Rect x="52" y="50" width="18" height="18" rx="2" fill={STICKER.mustard} opacity={0.15} stroke={STICKER.mustard} strokeWidth={0.6} />
      {/* Center connecting dot */}
      <Circle cx="50" cy="48" r="4" fill={color} opacity={0.3} />
      <Circle cx="50" cy="48" r="2" fill={color} opacity={0.5} />
    </G>
  );
}

// Step 11 — Sustaining Connection: Two trees with shared roots
function Step11Art({ color }: { color: string }) {
  return (
    <G>
      {/* Left tree canopy */}
      <Circle cx="38" cy="30" r="10" fill={STICKER.sage} opacity={0.2} />
      <Circle cx="38" cy="30" r="7" fill={STICKER.sage} opacity={0.15} />
      {/* Right tree canopy */}
      <Circle cx="62" cy="30" r="10" fill={STICKER.sage} opacity={0.2} />
      <Circle cx="62" cy="30" r="7" fill={STICKER.sage} opacity={0.15} />
      {/* Trunks */}
      <Line x1="38" y1="38" x2="38" y2="52" stroke={STICKER.terracotta} strokeWidth={1.5} />
      <Line x1="62" y1="38" x2="62" y2="52" stroke={STICKER.terracotta} strokeWidth={1.5} />
      {/* Shared roots — intertwined */}
      <Path d="M38,52 Q38,60 50,62" fill="none" stroke={STICKER.terracotta} strokeWidth={0.8} />
      <Path d="M62,52 Q62,60 50,62" fill="none" stroke={STICKER.terracotta} strokeWidth={0.8} />
      <Path d="M38,52 Q42,58 50,56" fill="none" stroke={STICKER.terracotta} strokeWidth={0.6} opacity={0.5} />
      <Path d="M62,52 Q58,58 50,56" fill="none" stroke={STICKER.terracotta} strokeWidth={0.6} opacity={0.5} />
      <Circle cx="50" cy="59" r="2" fill={STICKER.mustard} opacity={0.4} />
    </G>
  );
}

// Step 12 — The Ongoing Practice: Infinity loop, breathing
function Step12Art({ color }: { color: string }) {
  return (
    <G>
      {/* Infinity loop */}
      <Path d="M30,45 Q30,28 50,45 Q70,62 70,45 Q70,28 50,45 Q30,62 30,45"
        fill="none" stroke={STICKER.mustard} strokeWidth={1.2} />
      {/* Accent circles at loop intersections */}
      <Circle cx="50" cy="45" r="3.5" fill={color} opacity={0.3} />
      <Circle cx="30" cy="45" r="2" fill={STICKER.blush} opacity={0.4} />
      <Circle cx="70" cy="45" r="2" fill={STICKER.dustyBlue} opacity={0.4} />
      {/* Radiating subtle lines */}
      <Line x1="50" y1="30" x2="50" y2="34" stroke={STICKER.mustard} strokeWidth={0.5} opacity={0.3} />
      <Line x1="50" y1="56" x2="50" y2="60" stroke={STICKER.mustard} strokeWidth={0.5} opacity={0.3} />
      <Line x1="38" y1="34" x2="40" y2="37" stroke={STICKER.mustard} strokeWidth={0.5} opacity={0.3} />
      <Line x1="62" y1="34" x2="60" y2="37" stroke={STICKER.mustard} strokeWidth={0.5} opacity={0.3} />
    </G>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
