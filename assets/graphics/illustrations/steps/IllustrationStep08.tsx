/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-08
 * Component:   IllustrationStep08
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 8
 * Description: Step 8 — Create new patterns — both bodies mid-new-move, slightly awkward
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep08 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep08 width={screenWidth} />
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

export function IllustrationStep08({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#7CA4B8" opacity=".07">8</text>
<!-- two bodies mid-new-move: slightly awkward, experimenting — the new dance -->
<!-- one reaching in new direction, uncertain but trying -->
<path d="M76 190 Q58 168 56 144 Q54 122 66 102 Q78 82 94 76 Q110 70 122 82 Q134 94 136 116 Q138 138 124 164 Q110 188 92 196Z" fill="#B5593A" opacity=".82" style="animation:sway 4s ease-in-out infinite;transform-origin:96px 133px"/>
<g opacity=".18" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M58 110 Q92 104 134 108"/><path d="M56 124 Q91 119 135 122"/><path d="M57 138 Q91 133 134 136"/></g>
<ellipse cx="94" cy="68" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<!-- arm: new gesture, uncertain angle -->
<!-- navy body: trying new move too -->
<path d="M210 190 Q228 168 230 144 Q232 122 220 102 Q208 82 192 76 Q176 70 164 82 Q152 94 150 116 Q148 138 162 164 Q176 188 194 196Z" fill="#1E3A52" opacity=".82" style="animation:sway 4s ease-in-out infinite;animation-delay:-2s;transform-origin:190px 133px"/>
<g opacity=".18" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M152 110 Q178 105 228 108"/><path d="M150 124 Q177 119 229 122"/></g>
<ellipse cx="192" cy="68" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<!-- awkward gap between them — new territory -->
<path d="M136 128 Q152 120 150 128" fill="none" stroke="#D6CEBF" stroke-width="1" stroke-dasharray="2 5" opacity=".45"/>
<text x="144" y="142" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".35" font-family="Georgia,serif">awkward is how new feels</text>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#7CA4B8" opacity={0.07}>8</SvgText>

      {/* Left body (terracotta) — trying new move */}
      <Path
        d="M76 190 Q58 168 56 144 Q54 122 66 102 Q78 82 94 76 Q110 70 122 82 Q134 94 136 116 Q138 138 124 164 Q110 188 92 196Z"
        fill="#B5593A"
        opacity={0.82}
      />
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M58 110 Q92 104 134 108" />
        <Path d="M56 124 Q91 119 135 122" />
        <Path d="M57 138 Q91 133 134 136" />
      </G>
      <Ellipse cx="94" cy="68" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />

      {/* Right body (navy) — also trying new move */}
      <Path
        d="M210 190 Q228 168 230 144 Q232 122 220 102 Q208 82 192 76 Q176 70 164 82 Q152 94 150 116 Q148 138 162 164 Q176 188 194 196Z"
        fill="#1E3A52"
        opacity={0.82}
      />
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth={2} strokeLinecap="round">
        <Path d="M152 110 Q178 105 228 108" />
        <Path d="M150 124 Q177 119 229 122" />
      </G>
      <Ellipse cx="192" cy="68" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />

      {/* Awkward gap — new territory */}
      <Path d="M136 128 Q152 120 150 128" fill="none" stroke="#D6CEBF" strokeWidth={1} strokeDasharray="2 5" opacity={0.45} />
      <SvgText x="144" y="142" textAnchor="middle" fontSize="6.5" fill="#8B7355" opacity={0.35} fontFamily="Georgia, serif">awkward is how new feels</SvgText>

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
