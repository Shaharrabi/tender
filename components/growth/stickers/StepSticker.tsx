/**
 * StepSticker — Animated SVG sticker for each of the 12 Healing Steps.
 *
 * Each step has a unique visual metaphor inspired by the Tender Sticker System
 * (Wes Anderson edition). Uses react-native-svg + RN Animated API
 * for gentle, organic per-element animations matching the HTML reference.
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
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

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

// ─── Reusable animation hook ──────────────────────────────
function useLoop(duration: number, delay = 0) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return anim;
}

export default function StepSticker({ stepNumber, size = 120, animated = true, showLabel = true }: StepStickerProps) {
  const phase = getPhaseForStep(stepNumber);
  const phaseColor = phase?.color ?? Colors.textMuted;

  // ── Container animations ──
  const breathe = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
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
        Animated.timing(glow, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ])
    );

    breatheLoop.start();
    floatLoop.start();
    glowLoop.start();
    return () => { breatheLoop.stop(); floatLoop.stop(); glowLoop.stop(); };
  }, [animated]);

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

          {/* Step-specific artwork with per-element animation */}
          {renderStepArt(stepNumber, phaseColor, animated)}

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

function renderStepArt(step: number, color: string, animated: boolean) {
  switch (step) {
    case 1: return <Step1Art color={color} animated={animated} />;
    case 2: return <Step2Art color={color} animated={animated} />;
    case 3: return <Step3Art color={color} animated={animated} />;
    case 4: return <Step4Art color={color} animated={animated} />;
    case 5: return <Step5Art color={color} animated={animated} />;
    case 6: return <Step6Art color={color} animated={animated} />;
    case 7: return <Step7Art color={color} animated={animated} />;
    case 8: return <Step8Art color={color} animated={animated} />;
    case 9: return <Step9Art color={color} animated={animated} />;
    case 10: return <Step10Art color={color} animated={animated} />;
    case 11: return <Step11Art color={color} animated={animated} />;
    case 12: return <Step12Art color={color} animated={animated} />;
    default: return null;
  }
}

interface ArtProps { color: string; animated: boolean; }

// Step 1 — Acknowledging the Wound: Pulsing heart with crack line drawing in
function Step1Art({ color, animated }: ArtProps) {
  const pulse = useLoop(1800);
  const draw = useLoop(3000, 200);

  const heartR = animated ? pulse.interpolate({ inputRange: [0, 1], outputRange: [3, 4.5] }) : 3.5;
  const heartOp = animated ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.9] }) : 0.7;
  const ringR = animated ? pulse.interpolate({ inputRange: [0, 1], outputRange: [7, 9] }) : 8;
  const ringOp = animated ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.5] }) : 0.4;
  const crackOp = animated ? draw.interpolate({ inputRange: [0, 0.3, 0.7, 1], outputRange: [0.3, 0.8, 0.8, 0.3] }) : 0.6;

  return (
    <G>
      <Circle cx="50" cy="42" r="18" fill="none" stroke={STICKER.blush} strokeWidth={1.2} opacity={0.8} />
      <AnimatedPath d="M50,30 L48,36 L52,40 L49,46 L50,54" fill="none" stroke={STICKER.terracotta} strokeWidth={0.8} strokeDasharray="2,2" opacity={crackOp} />
      <AnimatedCircle cx="50" cy="42" r={heartR} fill={STICKER.blush} opacity={heartOp} />
      <AnimatedCircle cx="50" cy="42" r={ringR} fill="none" stroke={color} strokeWidth={0.6} opacity={ringOp} />
    </G>
  );
}

// Step 2 — Seeing Patterns: Bobbing Venn circles with animated wave
function Step2Art({ color, animated }: ArtProps) {
  const bob1 = useLoop(2500);
  const bob2 = useLoop(2500, 400);
  const bob3 = useLoop(2500, 800);
  const wave = useLoop(3200);

  const y1 = animated ? bob1.interpolate({ inputRange: [0, 1], outputRange: [40, 37] }) : 40;
  const y2 = animated ? bob2.interpolate({ inputRange: [0, 1], outputRange: [40, 36] }) : 40;
  const y3 = animated ? bob3.interpolate({ inputRange: [0, 1], outputRange: [40, 38] }) : 40;
  const waveOp = animated ? wave.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.5] }) : 0.8;

  return (
    <G>
      <AnimatedCircle cx="37" cy={y1} r="10" fill="none" stroke={STICKER.dustyBlue} strokeWidth={1} />
      <AnimatedCircle cx="50" cy={y2} r="10" fill="none" stroke={STICKER.dustyBlue} strokeWidth={1} opacity={0.7} />
      <AnimatedCircle cx="63" cy={y3} r="10" fill="none" stroke={STICKER.dustyBlue} strokeWidth={1} opacity={0.4} />
      <AnimatedPath d="M30,56 Q42,50 50,56 T70,56" fill="none" stroke={STICKER.mustard} strokeWidth={0.8} opacity={waveOp} />
    </G>
  );
}

// Step 3 — Turning Toward: Two figures approaching each other
function Step3Art({ color, animated }: ArtProps) {
  const approach = useLoop(3000);

  const leftX = animated ? approach.interpolate({ inputRange: [0, 1], outputRange: [28, 33] }) : 28;
  const rightX = animated ? approach.interpolate({ inputRange: [0, 1], outputRange: [60, 55] }) : 60;
  const dotOp = animated ? approach.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 0.7, 0.3] }) : 0.5;
  const dotR = animated ? approach.interpolate({ inputRange: [0, 1], outputRange: [2.5, 4] }) : 3;

  return (
    <G>
      <AnimatedRect x={leftX} y="30" width="12" height="24" rx="6" fill="none" stroke={STICKER.sage} strokeWidth={1} />
      <AnimatedRect x={rightX} y="30" width="12" height="24" rx="6" fill="none" stroke={STICKER.sage} strokeWidth={1} />
      <AnimatedCircle cx="50" cy="42" r={dotR} fill={STICKER.mustard} opacity={dotOp} />
      <Path d="M40,42 L46,42" fill="none" stroke={color} strokeWidth={0.5} opacity={0.4} />
      <Path d="M54,42 L60,42" fill="none" stroke={color} strokeWidth={0.5} opacity={0.4} />
    </G>
  );
}

// Step 4 — Softening Defenses: Shield dissolving, petals blooming
function Step4Art({ color, animated }: ArtProps) {
  const bloom = useLoop(3500);

  const shieldOp = animated ? bloom.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.2] }) : 0.35;
  const petalOp = animated ? bloom.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.35] }) : 0.25;
  const coreOp = animated ? bloom.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] }) : 0.4;

  return (
    <G>
      <AnimatedPath d="M50,24 L65,34 L65,50 Q65,62 50,68 Q35,62 35,50 L35,34 Z"
        fill="none" stroke={STICKER.dustyBlue} strokeWidth={0.8} opacity={shieldOp} strokeDasharray="3,2" />
      <AnimatedEllipse cx="50" cy="40" rx="6" ry="10" fill={STICKER.blush} opacity={petalOp} />
      <AnimatedEllipse cx="44" cy="46" rx="5" ry="8" fill={STICKER.blush} opacity={petalOp} transform="rotate(-30 44 46)" />
      <AnimatedEllipse cx="56" cy="46" rx="5" ry="8" fill={STICKER.blush} opacity={petalOp} transform="rotate(30 56 46)" />
      <AnimatedCircle cx="50" cy="45" r="3" fill={color} opacity={coreOp} />
    </G>
  );
}

// Step 5 — Emotional Vulnerability: Door opening, light intensifying
function Step5Art({ color, animated }: ArtProps) {
  const open = useLoop(4000);

  const doorW = animated ? open.interpolate({ inputRange: [0, 1], outputRange: [12, 6] }) : 10;
  const lightOp = animated ? open.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.3] }) : 0.15;
  const lightRx = animated ? open.interpolate({ inputRange: [0, 1], outputRange: [10, 16] }) : 12;

  return (
    <G>
      <Rect x="35" y="24" width="30" height="44" rx="2" fill="none" stroke={STICKER.ink} strokeWidth={0.8} />
      <AnimatedRect x="35" y="24" width={doorW} height="44" rx="1" fill="none" stroke={STICKER.mustard} strokeWidth={0.6} />
      <AnimatedEllipse cx="50" cy="56" rx={lightRx} ry="6" fill={STICKER.mustard} opacity={lightOp} />
      <AnimatedEllipse cx="50" cy="52" rx="8" ry="4" fill={STICKER.mustard} opacity={lightOp} />
      <Circle cx="42" cy="46" r="1.5" fill={color} opacity={0.6} />
    </G>
  );
}

// Step 6 — Rupture & Repair: Jagged line fading, smooth curve strengthening
function Step6Art({ color, animated }: ArtProps) {
  const repair = useLoop(3500);

  const ruptureOp = animated ? repair.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0.2] }) : 0.45;
  const curveOp = animated ? repair.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.0] }) : 0.8;
  const curveW = animated ? repair.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.6] }) : 1.2;
  const healOp = animated ? repair.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 0.8, 0.3] }) : 0.6;
  const healR = animated ? repair.interpolate({ inputRange: [0, 1], outputRange: [2, 3.5] }) : 2.5;

  return (
    <G>
      <AnimatedPath d="M25,38 L32,28 L38,40 L44,26 L50,38 L56,28 L62,40 L68,30 L75,38"
        fill="none" stroke={STICKER.terracotta} strokeWidth={0.7} opacity={ruptureOp} />
      <AnimatedPath d="M25,52 Q50,42 75,52"
        fill="none" stroke={STICKER.sage} strokeWidth={curveW} opacity={curveOp} />
      <AnimatedCircle cx="50" cy="47" r={healR} fill={STICKER.mustard} opacity={healOp} />
    </G>
  );
}

// Step 7 — Building Trust: Blocks stacking up with subtle pulse
function Step7Art({ color, animated }: ArtProps) {
  const stack = useLoop(3000);

  const b1Op = animated ? stack.interpolate({ inputRange: [0, 0.3, 0.6, 1], outputRange: [0.08, 0.15, 0.15, 0.08] }) : 0.08;
  const b2Op = animated ? stack.interpolate({ inputRange: [0, 0.3, 0.6, 1], outputRange: [0.12, 0.2, 0.2, 0.12] }) : 0.12;
  const b3Op = animated ? stack.interpolate({ inputRange: [0, 0.3, 0.6, 1], outputRange: [0.16, 0.28, 0.28, 0.16] }) : 0.16;
  const capR = animated ? stack.interpolate({ inputRange: [0, 1], outputRange: [2.5, 3.5] }) : 3;
  const capOp = animated ? stack.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.7] }) : 0.5;

  return (
    <G>
      <Rect x="37" y="52" width="26" height="10" rx="2" fill="none" stroke={STICKER.sage} strokeWidth={0.8} />
      <Rect x="40" y="42" width="20" height="10" rx="2" fill="none" stroke={STICKER.sage} strokeWidth={0.8} />
      <Rect x="43" y="32" width="14" height="10" rx="2" fill="none" stroke={STICKER.sage} strokeWidth={0.8} />
      <AnimatedCircle cx="50" cy="28" r={capR} fill={STICKER.mustard} opacity={capOp} />
      <AnimatedRect x="37" y="52" width="26" height="10" rx="2" fill={color} opacity={b1Op} />
      <AnimatedRect x="40" y="42" width="20" height="10" rx="2" fill={color} opacity={b2Op} />
      <AnimatedRect x="43" y="32" width="14" height="10" rx="2" fill={color} opacity={b3Op} />
    </G>
  );
}

// Step 8 — Deepening Intimacy: Two spirals drawing toward center
function Step8Art({ color, animated }: ArtProps) {
  const spin = useLoop(4000);

  const centerR = animated ? spin.interpolate({ inputRange: [0, 1], outputRange: [2.5, 4] }) : 3;
  const centerOp = animated ? spin.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 0.7, 0.3] }) : 0.5;
  const s1Op = animated ? spin.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) : 0.85;
  const s2Op = animated ? spin.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) : 0.85;

  return (
    <G>
      <AnimatedPath d="M30,50 Q35,30 50,35 Q60,38 55,50 Q52,58 45,55"
        fill="none" stroke={STICKER.blush} strokeWidth={1} opacity={s1Op} />
      <AnimatedPath d="M70,50 Q65,30 50,35 Q40,38 45,50 Q48,58 55,55"
        fill="none" stroke={STICKER.dustyBlue} strokeWidth={1} opacity={s2Op} />
      <AnimatedCircle cx="50" cy="45" r={centerR} fill={STICKER.mustard} opacity={centerOp} />
    </G>
  );
}

// Step 9 — Shared Meaning: Overlapping frames pulsing at intersection
function Step9Art({ color, animated }: ArtProps) {
  const pulse = useLoop(2800);

  const overlapOp = animated ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.3] }) : 0.15;
  const starOp = animated ? pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 0.8, 0.3] }) : 0.6;

  return (
    <G>
      <Rect x="28" y="28" width="24" height="28" rx="2" fill="none" stroke={STICKER.blush} strokeWidth={0.8} />
      <Rect x="48" y="32" width="24" height="28" rx="2" fill="none" stroke={STICKER.dustyBlue} strokeWidth={0.8} />
      <AnimatedRect x="48" y="32" width="4" height="24" fill={STICKER.mustard} opacity={overlapOp} />
      <SvgText x="50" y="48" textAnchor="middle" fontSize="8" fill={STICKER.mustard} opacity={0.6}>{'✦'}</SvgText>
    </G>
  );
}

// Step 10 — Integration: Puzzle pieces pulsing together
function Step10Art({ color, animated }: ArtProps) {
  const join = useLoop(3000);

  const coreR = animated ? join.interpolate({ inputRange: [0, 1], outputRange: [3.5, 5] }) : 4;
  const coreOp = animated ? join.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 0.5, 0.2] }) : 0.3;
  const innerR = animated ? join.interpolate({ inputRange: [0, 1], outputRange: [1.5, 2.5] }) : 2;

  return (
    <G>
      <Rect x="30" y="28" width="18" height="18" rx="2" fill={STICKER.sage} opacity={0.15} stroke={STICKER.sage} strokeWidth={0.6} />
      <Rect x="52" y="28" width="18" height="18" rx="2" fill={STICKER.dustyBlue} opacity={0.15} stroke={STICKER.dustyBlue} strokeWidth={0.6} />
      <Rect x="30" y="50" width="18" height="18" rx="2" fill={STICKER.blush} opacity={0.15} stroke={STICKER.blush} strokeWidth={0.6} />
      <Rect x="52" y="50" width="18" height="18" rx="2" fill={STICKER.mustard} opacity={0.15} stroke={STICKER.mustard} strokeWidth={0.6} />
      <AnimatedCircle cx="50" cy="48" r={coreR} fill={color} opacity={coreOp} />
      <AnimatedCircle cx="50" cy="48" r={innerR} fill={color} opacity={0.5} />
    </G>
  );
}

// Step 11 — Sustaining Connection: Trees with gently swaying canopies + pulsing roots
function Step11Art({ color, animated }: ArtProps) {
  const sway = useLoop(3500);
  const rootPulse = useLoop(2800, 300);

  const leftCx = animated ? sway.interpolate({ inputRange: [0, 1], outputRange: [37, 39] }) : 38;
  const rightCx = animated ? sway.interpolate({ inputRange: [0, 1], outputRange: [63, 61] }) : 62;
  const rootR = animated ? rootPulse.interpolate({ inputRange: [0, 1], outputRange: [1.5, 3] }) : 2;
  const rootOp = animated ? rootPulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] }) : 0.4;

  return (
    <G>
      <AnimatedCircle cx={leftCx} cy="30" r="10" fill={STICKER.sage} opacity={0.2} />
      <AnimatedCircle cx={leftCx} cy="30" r="7" fill={STICKER.sage} opacity={0.15} />
      <AnimatedCircle cx={rightCx} cy="30" r="10" fill={STICKER.sage} opacity={0.2} />
      <AnimatedCircle cx={rightCx} cy="30" r="7" fill={STICKER.sage} opacity={0.15} />
      <Line x1="38" y1="38" x2="38" y2="52" stroke={STICKER.terracotta} strokeWidth={1.5} />
      <Line x1="62" y1="38" x2="62" y2="52" stroke={STICKER.terracotta} strokeWidth={1.5} />
      <Path d="M38,52 Q38,60 50,62" fill="none" stroke={STICKER.terracotta} strokeWidth={0.8} />
      <Path d="M62,52 Q62,60 50,62" fill="none" stroke={STICKER.terracotta} strokeWidth={0.8} />
      <Path d="M38,52 Q42,58 50,56" fill="none" stroke={STICKER.terracotta} strokeWidth={0.6} opacity={0.5} />
      <Path d="M62,52 Q58,58 50,56" fill="none" stroke={STICKER.terracotta} strokeWidth={0.6} opacity={0.5} />
      <AnimatedCircle cx="50" cy="59" r={rootR} fill={STICKER.mustard} opacity={rootOp} />
    </G>
  );
}

// Step 12 — The Ongoing Practice: Infinity loop with traveling accent points
function Step12Art({ color, animated }: ArtProps) {
  const travel = useLoop(4000);
  const pulse = useLoop(2200, 500);

  const centerR = animated ? pulse.interpolate({ inputRange: [0, 1], outputRange: [3, 4.5] }) : 3.5;
  const centerOp = animated ? pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 0.5, 0.2] }) : 0.3;
  const leftR = animated ? travel.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1.5, 3, 1.5] }) : 2;
  const rightR = animated ? travel.interpolate({ inputRange: [0, 0.5, 1], outputRange: [3, 1.5, 3] }) : 2;
  const lineOp = animated ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.5] }) : 0.3;

  return (
    <G>
      <Path d="M30,45 Q30,28 50,45 Q70,62 70,45 Q70,28 50,45 Q30,62 30,45"
        fill="none" stroke={STICKER.mustard} strokeWidth={1.2} />
      <AnimatedCircle cx="50" cy="45" r={centerR} fill={color} opacity={centerOp} />
      <AnimatedCircle cx="30" cy="45" r={leftR} fill={STICKER.blush} opacity={0.4} />
      <AnimatedCircle cx="70" cy="45" r={rightR} fill={STICKER.dustyBlue} opacity={0.4} />
      <AnimatedLine x1="50" y1="30" x2="50" y2="34" stroke={STICKER.mustard} strokeWidth={0.5} opacity={lineOp} />
      <AnimatedLine x1="50" y1="56" x2="50" y2="60" stroke={STICKER.mustard} strokeWidth={0.5} opacity={lineOp} />
      <AnimatedLine x1="38" y1="34" x2="40" y2="37" stroke={STICKER.mustard} strokeWidth={0.5} opacity={lineOp} />
      <AnimatedLine x1="62" y1="34" x2="60" y2="37" stroke={STICKER.mustard} strokeWidth={0.5} opacity={lineOp} />
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
