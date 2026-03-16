/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          ch4-ground
 * Component:   IllustrationChapter04
 * Screen:      app/(app)/tender-assessment.tsx  →  chapter 4 intro card
 * Description: Chapter 4 — How You Hold Your Ground — fused bodies vs differentiated bodies
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationChapter04 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationChapter04 width={screenWidth} />
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

export function IllustrationChapter04({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<!-- two bodies: overlapping vs separated — differentiation spectrum -->
<!-- FUSED: bodies overlapping, losing individual shape -->
<g opacity=".7">
<path d="M46 170 Q36 152 35 134 Q34 118 42 104 Q50 90 60 86 Q70 82 76 90 Q82 98 84 114 Q86 130 78 148 Q70 166 60 174Z" fill="#B5593A" opacity=".65"/>
<path d="M70 170 Q60 152 59 134 Q58 118 66 104 Q74 90 84 86 Q94 82 100 90 Q106 98 108 114 Q110 130 102 148 Q94 166 84 174Z" fill="#1E3A52" opacity=".55"/>
</g>
<text x="68" y="188" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".4" font-family="Georgia,serif">fused</text>
<!-- DIFFERENTIATED: distinct, connected, space between -->
<path d="M172 166 Q160 148 158 130 Q156 114 164 100 Q172 86 182 80 Q192 74 200 82 Q208 90 210 106 Q212 122 204 140 Q196 158 186 168Z" fill="#B5593A" opacity=".85" style="animation:breathe 5s ease-in-out infinite;transform-origin:184px 121px"/>
<path d="M220 166 Q232 148 234 130 Q236 114 228 100 Q220 86 210 80 Q200 74 192 82 Q184 90 182 106 Q180 122 188 140 Q196 158 206 168Z" fill="#1E3A52" opacity=".85" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:208px 121px"/>
<line x1="214" y1="124" x2="218" y2="124" stroke="#D6CEBF" stroke-width="1" opacity=".5"/>
<text x="204" y="183" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".4" font-family="Georgia,serif">differentiated</text>
<!-- spectrum arrow between -->
<line x1="110" y1="130" x2="154" y2="130" stroke="#8B7355" stroke-width=".7" opacity=".4"/>
<path d="M150 127 L154 130 L150 133" fill="none" stroke="#8B7355" stroke-width=".7" opacity=".4"/>
<text x="132" y="124" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".35" font-family="Georgia,serif">the spectrum</text>
<text x="150" y="208" text-anchor="middle" font-family="Georgia,serif" font-size="8" letter-spacing="3" fill="#2C2C2A" opacity=".4">DSI-R</text>
</svg>
    */

    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* FUSED: bodies overlapping */}
      <G opacity={0.7}>
        <Path d="M46 170 Q36 152 35 134 Q34 118 42 104 Q50 90 60 86 Q70 82 76 90 Q82 98 84 114 Q86 130 78 148 Q70 166 60 174Z" fill="#B5593A" opacity={0.65}/>
        <Path d="M70 170 Q60 152 59 134 Q58 118 66 104 Q74 90 84 86 Q94 82 100 90 Q106 98 108 114 Q110 130 102 148 Q94 166 84 174Z" fill="#1E3A52" opacity={0.55}/>
      </G>
      <SvgText x="68" y="188" textAnchor="middle" fontSize="6.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">fused</SvgText>

      {/* DIFFERENTIATED: distinct, connected */}
      {/* TODO: animation breathe 5s */}
      <Path d="M172 166 Q160 148 158 130 Q156 114 164 100 Q172 86 182 80 Q192 74 200 82 Q208 90 210 106 Q212 122 204 140 Q196 158 186 168Z" fill="#B5593A" opacity={0.85}/>
      {/* TODO: animation breathe 5s delay -2.5s */}
      <Path d="M220 166 Q232 148 234 130 Q236 114 228 100 Q220 86 210 80 Q200 74 192 82 Q184 90 182 106 Q180 122 188 140 Q196 158 206 168Z" fill="#1E3A52" opacity={0.85}/>
      <Line x1="214" y1="124" x2="218" y2="124" stroke="#D6CEBF" strokeWidth="1" opacity={0.5}/>
      <SvgText x="204" y="183" textAnchor="middle" fontSize="6.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">differentiated</SvgText>

      {/* spectrum arrow */}
      <Line x1="110" y1="130" x2="154" y2="130" stroke="#8B7355" strokeWidth=".7" opacity={0.4}/>
      <Path d="M150 127 L154 130 L150 133" fill="none" stroke="#8B7355" strokeWidth=".7" opacity={0.4}/>
      <SvgText x="132" y="124" textAnchor="middle" fontSize="6.5" fill="#8B7355" opacity={0.35} fontFamily="Georgia,serif">the spectrum</SvgText>

      <SvgText x="150" y="208" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>DSI-R</SvgText>
    </Svg>
  );
}
