/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          ch5-conflict
 * Component:   IllustrationChapter05
 * Screen:      app/(app)/tender-assessment.tsx  →  chapter 5 intro card
 * Description: Chapter 5 — How You Navigate Conflict — two tension bodies, four horsemen labels
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationChapter05 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationChapter05 width={screenWidth} />
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

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationChapter05({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<!-- conflict: two bodies, tension visible, the space between them contracted -->
<path d="M72 188 Q56 166 54 142 Q52 120 64 100 Q76 80 92 74 Q108 68 120 80 Q132 92 134 114 Q136 136 122 162 Q108 186 90 194Z" fill="#B5593A" opacity=".82" style="animation:breathe 4s ease-in-out infinite;transform-origin:94px 134px" transform="rotate(8 94 134)"/>
<ellipse cx="90" cy="66" rx="18" ry="22" fill="none" stroke="#2C2C2A" stroke-width=".9"/>
<path d="M78 54 Q86 44 92 42 Q98 40 102 48" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<path d="M180 188 Q196 166 198 142 Q200 120 188 100 Q176 80 160 74 Q144 68 132 80 Q120 92 118 114 Q116 136 130 162 Q144 186 162 194Z" fill="#1E3A52" opacity=".82" style="animation:breathe 4s ease-in-out infinite;animation-delay:-2s;transform-origin:158px 134px" transform="rotate(-8 158 134)"/>
<g opacity=".18" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M120 110 Q148 105 196 108"/><path d="M118 124 Q147 119 197 122"/></g>
<ellipse cx="160" cy="66" rx="18" ry="22" fill="none" stroke="#2C2C2A" stroke-width=".9"/>
<!-- conflict energy: jagged lines in the contracted space between them -->
<path d="M134 110 Q138 104 142 110 Q146 116 150 110 Q154 104 158 110 Q162 116 166 110" fill="none" stroke="#B5593A" stroke-width="1" opacity=".35"/>
<!-- the four horsemen ghosts: small labels -->
<text x="148" y="92" text-anchor="middle" font-size="6" fill="#8B7355" opacity=".35" font-family="Georgia,serif">the four horsemen</text>
<g opacity=".3">
<text x="76" y="200" font-size="6" fill="#B5593A" font-family="Georgia,serif">criticism</text>
<text x="118" y="200" font-size="6" fill="#B5593A" font-family="Georgia,serif">contempt</text>
<text x="162" y="200" font-size="6" fill="#1E3A52" font-family="Georgia,serif">defensiveness</text>
<text x="222" y="200" font-size="6" fill="#1E3A52" font-family="Georgia,serif">stonewalling</text>
</g>
<text x="150" y="210" text-anchor="middle" font-family="Georgia,serif" font-size="8" letter-spacing="3" fill="#2C2C2A" opacity=".4">DUTCH</text>
</svg>
    */

    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* conflict: two bodies in tension */}
      {/* TODO: animation breathe 4s */}
      <Path d="M72 188 Q56 166 54 142 Q52 120 64 100 Q76 80 92 74 Q108 68 120 80 Q132 92 134 114 Q136 136 122 162 Q108 186 90 194Z" fill="#B5593A" opacity={0.82} rotation={8} origin="94, 134"/>
      <Ellipse cx="90" cy="66" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth=".9"/>
      <Path d="M78 54 Q86 44 92 42 Q98 40 102 48" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>

      {/* TODO: animation breathe 4s delay -2s */}
      <Path d="M180 188 Q196 166 198 142 Q200 120 188 100 Q176 80 160 74 Q144 68 132 80 Q120 92 118 114 Q116 136 130 162 Q144 186 162 194Z" fill="#1E3A52" opacity={0.82} rotation={-8} origin="158, 134"/>
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
        <Path d="M120 110 Q148 105 196 108"/>
        <Path d="M118 124 Q147 119 197 122"/>
      </G>
      <Ellipse cx="160" cy="66" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth=".9"/>

      {/* conflict energy: jagged lines */}
      <Path d="M134 110 Q138 104 142 110 Q146 116 150 110 Q154 104 158 110 Q162 116 166 110" fill="none" stroke="#B5593A" strokeWidth="1" opacity={0.35}/>

      {/* the four horsemen */}
      <SvgText x="148" y="92" textAnchor="middle" fontSize="6" fill="#8B7355" opacity={0.35} fontFamily="Georgia,serif">the four horsemen</SvgText>
      <G opacity={0.3}>
        <SvgText x="76" y="200" fontSize="6" fill="#B5593A" fontFamily="Georgia,serif">criticism</SvgText>
        <SvgText x="118" y="200" fontSize="6" fill="#B5593A" fontFamily="Georgia,serif">contempt</SvgText>
        <SvgText x="162" y="200" fontSize="6" fill="#1E3A52" fontFamily="Georgia,serif">defensiveness</SvgText>
        <SvgText x="222" y="200" fontSize="6" fill="#1E3A52" fontFamily="Georgia,serif">stonewalling</SvgText>
      </G>

      <SvgText x="150" y="210" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>DUTCH</SvgText>
    </Svg>
  );
}
