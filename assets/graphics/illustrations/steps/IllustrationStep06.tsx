/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-06
 * Component:   IllustrationStep06
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 6
 * Description: Step 6 — Release enemy story — side-by-side bodies facing the pattern (not each other)
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep06 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep06 width={screenWidth} />
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

export function IllustrationStep06({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#6E4E6E" opacity=".07">6</text>
<!-- two bodies: facing same direction, shoulder to shoulder — the pattern is the adversary now, not each other -->
<path d="M70 192 Q52 170 50 146 Q48 124 60 104 Q72 84 88 78 Q104 72 116 84 Q128 96 130 118 Q132 140 118 166 Q104 190 86 198Z" fill="#B5593A" opacity=".85" style="animation:breathe 5s ease-in-out infinite;transform-origin:90px 136px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M52 112 Q86 106 128 110"/><path d="M50 126 Q85 121 129 124"/><path d="M51 140 Q85 135 128 138"/></g>
<ellipse cx="88" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M76 58 Q84 48 90 46 Q96 44 100 52" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- navy body: side by side not opposed -->
<path d="M156 192 Q138 170 136 146 Q134 124 146 104 Q158 84 174 78 Q190 72 202 84 Q214 96 216 118 Q218 140 204 166 Q190 190 172 198Z" fill="#1E3A52" opacity=".85" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:176px 136px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M138 110 Q166 105 214 108"/><path d="M136 124 Q165 119 215 122"/><path d="M137 138 Q165 133 214 136"/></g>
<ellipse cx="174" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<!-- the pattern/cycle: a knot of line between/above them — the real adversary -->
<path d="M234 88 Q242 76 250 88 Q258 100 250 110 Q242 120 234 110 Q226 100 234 88" fill="none" stroke="#8B7355" stroke-width="1.1" opacity=".4"/>
<!-- X through the enemy story: releasing it -->
<line x1="228" y1="82" x2="256" y2="116" stroke="#D6CEBF" stroke-width="1" opacity=".4"/>
<line x1="256" y1="82" x2="228" y2="116" stroke="#D6CEBF" stroke-width="1" opacity=".4"/>
<text x="241" y="134" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".4" font-family="Georgia,serif">the pattern</text>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#6E4E6E" opacity={0.07}>6</SvgText>

      {/* Left body (terracotta) — shoulder to shoulder */}
      <Path
        d="M70 192 Q52 170 50 146 Q48 124 60 104 Q72 84 88 78 Q104 72 116 84 Q128 96 130 118 Q132 140 118 166 Q104 190 86 198Z"
        fill="#B5593A"
        opacity={0.85}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M52 112 Q86 106 128 110" />
        <Path d="M50 126 Q85 121 129 124" />
        <Path d="M51 140 Q85 135 128 138" />
      </G>
      <Ellipse cx="88" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />
      <Path d="M76 58 Q84 48 90 46 Q96 44 100 52" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />

      {/* Right body (navy) — side by side, not opposed */}
      <Path
        d="M156 192 Q138 170 136 146 Q134 124 146 104 Q158 84 174 78 Q190 72 202 84 Q214 96 216 118 Q218 140 204 166 Q190 190 172 198Z"
        fill="#1E3A52"
        opacity={0.85}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2} strokeLinecap="round">
        <Path d="M138 110 Q166 105 214 108" />
        <Path d="M136 124 Q165 119 215 122" />
        <Path d="M137 138 Q165 133 214 136" />
      </G>
      <Ellipse cx="174" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />

      {/* The pattern/cycle: a knot — the real adversary */}
      <Path d="M234 88 Q242 76 250 88 Q258 100 250 110 Q242 120 234 110 Q226 100 234 88" fill="none" stroke="#8B7355" strokeWidth={1.1} opacity={0.4} />
      {/* X through the enemy story */}
      <Line x1="228" y1="82" x2="256" y2="116" stroke="#D6CEBF" strokeWidth={1} opacity={0.4} />
      <Line x1="256" y1="82" x2="228" y2="116" stroke="#D6CEBF" strokeWidth={1} opacity={0.4} />
      <SvgText x="241" y="134" textAnchor="middle" fontSize="6.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia, serif">the pattern</SvgText>

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
