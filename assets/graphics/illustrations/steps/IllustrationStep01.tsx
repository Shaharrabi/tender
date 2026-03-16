/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-01
 * Component:   IllustrationStep01
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 1
 * Description: Step 1 — Acknowledge the strain — two bowed bodies, the honest space between them
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep01 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep01 width={screenWidth} />
 *
 * CONVERSION NOTES (Claude Code — do these in order):
 *   1. Replace <svg>       →  <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight}>
 *   2. Replace <path>      →  <Path>
 *   3. Replace <ellipse>   →  <Ellipse>
 *   4. Replace <circle>    →  <Circle>
 *   5. Replace <rect>      →  <Rect>
 *   6. Replace <line>      →  <Line>
 *   7. Replace <polygon>   →  <Polygon>
 *   8. Replace <g>         →  <G>
 *   9. Replace <text>      →  <SvgText>
 *  10. Import from 'react-native-svg'
 *  11. CSS animations → react-native-reanimated (see hooks/useIllustrationAnimation.ts)
 *      breathe   →  useBreathe(5000)
 *      float     →  useFloat(3500, 4)
 *      pulse     →  usePulse(0.35, 0.95, 2500)
 *      flicker   →  useFlicker()
 *      sway      →  useSway(4, 4000)
 *      unfurl    →  useUnfurl(pathLength, 3000)
 *  12. Remove class="ln" and class="lines" groups (paper lines)
 *      OR convert to individual <Line> elements
 *  13. animated={false} for list/thumbnail use
 *
 * DO NOT add arm or hand paths.
 * DO NOT show official assessment names (ECR-R, DUTCH, etc.)
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, {
  Path, Ellipse, Circle, Rect, Line, Polygon, G, Text as SvgText
} from 'react-native-svg';
import ReAnimated from 'react-native-reanimated';
import { useBreathe } from '../hooks/useIllustrationAnimation';

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationStep01({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/><line x1="0" y1="200" x2="300" y2="200"/></g>
<!-- step number ghost -->
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#B5593A" opacity=".07">1</text>
<!-- two bodies: back-to-back, heads slightly bowed — the honest acknowledgment -->
<path d="M72 196 Q56 175 54 152 Q52 130 62 112 Q72 94 86 88 Q100 82 110 92 Q120 102 122 122 Q124 142 112 166 Q100 190 84 200Z" fill="#B5593A" opacity=".85" style="animation:breathe 5s ease-in-out infinite;transform-origin:88px 143px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M54 120 Q84 114 120 118"/><path d="M53 134 Q83 129 121 132"/><path d="M54 148 Q84 143 120 146"/></g>
<ellipse cx="86" cy="80" rx="18" ry="22" fill="none" stroke="#2C2C2A" stroke-width="1" transform="rotate(6 86 80)"/>
<path d="M74 68 Q82 58 88 56 Q94 54 98 62" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- head bowed: chin toward chest -->
<path d="M80 86 Q86 90 92 86" fill="none" stroke="#2C2C2A" stroke-width=".7" opacity=".35"/>
<!-- right body navy, also bowed -->
<path d="M178 196 Q194 175 196 152 Q198 130 188 112 Q178 94 164 88 Q150 82 140 92 Q130 102 128 122 Q126 142 138 166 Q150 190 166 200Z" fill="#1E3A52" opacity=".85" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:162px 143px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M130 118 Q158 113 194 116"/><path d="M128 132 Q157 127 195 130"/><path d="M129 146 Q157 141 194 144"/></g>
<ellipse cx="164" cy="80" rx="18" ry="22" fill="none" stroke="#2C2C2A" stroke-width="1" transform="rotate(-6 164 80)"/>
<path d="M152 68 Q160 58 166 56 Q172 54 176 62" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<path d="M158 86 Q164 90 170 86" fill="none" stroke="#2C2C2A" stroke-width=".7" opacity=".35"/>
<!-- the gap: honest space between them -->
<path d="M122 130 Q150 126 128 130" fill="none" stroke="#D6CEBF" stroke-width="1" stroke-dasharray="2 4" opacity=".5"/>
<text x="150" y="137" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".4" font-family="Georgia,serif">the strain</text>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#B5593A" opacity={0.07}>1</SvgText>

      {/* Left body (terracotta) — bowed, acknowledging the strain */}
      <Path
        d="M72 196 Q56 175 54 152 Q52 130 62 112 Q72 94 86 88 Q100 82 110 92 Q120 102 122 122 Q124 142 112 166 Q100 190 84 200Z"
        fill="#B5593A"
        opacity={0.85}
      />
      {/* Left body texture lines */}
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M54 120 Q84 114 120 118" />
        <Path d="M53 134 Q83 129 121 132" />
        <Path d="M54 148 Q84 143 120 146" />
      </G>
      {/* Left head */}
      <Ellipse cx="86" cy="80" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth={1} rotation={6} origin="86, 80" />
      {/* Left hair */}
      <Path d="M74 68 Q82 58 88 56 Q94 54 98 62" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />
      {/* Left chin bowed */}
      <Path d="M80 86 Q86 90 92 86" fill="none" stroke="#2C2C2A" strokeWidth={0.7} opacity={0.35} />

      {/* Right body (navy) — also bowed */}
      <Path
        d="M178 196 Q194 175 196 152 Q198 130 188 112 Q178 94 164 88 Q150 82 140 92 Q130 102 128 122 Q126 142 138 166 Q150 190 166 200Z"
        fill="#1E3A52"
        opacity={0.85}
      />
      {/* Right body texture lines */}
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2} strokeLinecap="round">
        <Path d="M130 118 Q158 113 194 116" />
        <Path d="M128 132 Q157 127 195 130" />
        <Path d="M129 146 Q157 141 194 144" />
      </G>
      {/* Right head */}
      <Ellipse cx="164" cy="80" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth={1} rotation={-6} origin="164, 80" />
      {/* Right hair */}
      <Path d="M152 68 Q160 58 166 56 Q172 54 176 62" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />
      {/* Right chin bowed */}
      <Path d="M158 86 Q164 90 170 86" fill="none" stroke="#2C2C2A" strokeWidth={0.7} opacity={0.35} />

      {/* The gap: honest space between them */}
      <Path d="M122 130 Q150 126 128 130" fill="none" stroke="#D6CEBF" strokeWidth={1} strokeDasharray="2 4" opacity={0.5} />
      <SvgText x="150" y="137" textAnchor="middle" fontSize="6.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia, serif">the strain</SvgText>

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
