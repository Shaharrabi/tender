/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-11
 * Component:   IllustrationStep11
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 11
 * Description: Step 11 — Sustain patterns — spiral with ascending arrow, small figure at base
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep11 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep11 width={screenWidth} />
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

export function IllustrationStep11({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#8B7355" opacity=".07">11</text>
<!-- spiral returning: same figure, higher on the spiral — old pattern visited again, but different now -->
<path d="M86 192 Q68 170 66 146 Q64 124 76 104 Q88 84 104 78 Q120 72 132 84 Q144 96 146 118 Q148 140 134 166 Q120 190 102 198Z" fill="#B5593A" opacity=".85" style="animation:breathe 5.5s ease-in-out infinite;transform-origin:106px 135px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M68 112 Q102 106 144 110"/><path d="M66 126 Q101 121 145 124"/><path d="M67 140 Q101 135 144 138"/><path d="M68 154 Q101 149 142 152"/></g>
<ellipse cx="104" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M92 58 Q100 48 106 46 Q112 44 116 52" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- spiral path: the returning but at higher level -->
<path d="M170 120 Q190 104 210 116 Q230 128 230 148 Q230 170 210 178 Q190 186 172 174 Q154 162 154 144 Q154 128 168 120" fill="none" stroke="#D6CEBF" stroke-width="1" stroke-dasharray="3 4" opacity=".55"/>
<!-- small figure at lower point on spiral — the old self -->
<ellipse cx="170" cy="174" rx="8" ry="10" fill="none" stroke="#8B7355" stroke-width=".7" opacity=".3"/>
<!-- arrow going up spiral: the spiral rises -->
<path d="M204 178 Q222 172 228 156" fill="none" stroke="#C8923A" stroke-width="1" stroke-dasharray="3 3" style="animation:pulse 2.5s ease-in-out infinite"/>
<path d="M225 148 L229 155 L222 155" fill="none" stroke="#C8923A" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#8B7355" opacity={0.07}>11</SvgText>

      {/* Body (terracotta) — on the spiral */}
      <Path
        d="M86 192 Q68 170 66 146 Q64 124 76 104 Q88 84 104 78 Q120 72 132 84 Q144 96 146 118 Q148 140 134 166 Q120 190 102 198Z"
        fill="#B5593A"
        opacity={0.85}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M68 112 Q102 106 144 110" />
        <Path d="M66 126 Q101 121 145 124" />
        <Path d="M67 140 Q101 135 144 138" />
        <Path d="M68 154 Q101 149 142 152" />
      </G>
      <Ellipse cx="104" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />
      <Path d="M92 58 Q100 48 106 46 Q112 44 116 52" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />

      {/* Spiral path: returning but at higher level */}
      <Path d="M170 120 Q190 104 210 116 Q230 128 230 148 Q230 170 210 178 Q190 186 172 174 Q154 162 154 144 Q154 128 168 120" fill="none" stroke="#D6CEBF" strokeWidth={1} strokeDasharray="3 4" opacity={0.55} />

      {/* Small figure at lower point on spiral — the old self */}
      <Ellipse cx="170" cy="174" rx="8" ry="10" fill="none" stroke="#8B7355" strokeWidth={0.7} opacity={0.3} />

      {/* Arrow going up spiral */}
      <Path d="M204 178 Q222 172 228 156" fill="none" stroke="#C8923A" strokeWidth={1} strokeDasharray="3 3" />
      <Path d="M225 148 L229 155 L222 155" fill="none" stroke="#C8923A" strokeWidth={0.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
