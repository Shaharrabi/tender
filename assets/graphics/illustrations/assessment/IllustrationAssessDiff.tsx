/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          assess-ch4-full
 * Component:   IllustrationAssessDiff
 * Screen:      app/(app)/results.tsx  →  chapter 4 results card
 * Description: Chapter 4 result — fused vs differentiated spectrum
 * ViewBox:     0 0 220 200
 *
 * USAGE:
 *   import { IllustrationAssessDiff } from '@/assets/graphics/illustrations/index';
 *   <IllustrationAssessDiff width={screenWidth} />
 *
 * CONVERSION NOTES (Claude Code — do these in order):
 *   1. Replace <svg>       →  <Svg viewBox="0 0 220 200" width={width} height={resolvedHeight}>
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

export function IllustrationAssessDiff({ width = 220, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (200 / 220));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="16" x2="220" y2="16"/><line x1="0" y1="30" x2="220" y2="30"/><line x1="0" y1="44" x2="220" y2="44"/><line x1="0" y1="58" x2="220" y2="58"/><line x1="0" y1="72" x2="220" y2="72"/><line x1="0" y1="86" x2="220" y2="86"/><line x1="0" y1="100" x2="220" y2="100"/><line x1="0" y1="114" x2="220" y2="114"/><line x1="0" y1="128" x2="220" y2="128"/><line x1="0" y1="142" x2="220" y2="142"/><line x1="0" y1="156" x2="220" y2="156"/><line x1="0" y1="170" x2="220" y2="170"/><line x1="0" y1="184" x2="220" y2="184"/></g>

<!-- Differentiation spectrum: left=fused (two blobs merging), right=differentiated (two distinct with space) -->
<!-- FUSED side: two bodies bleeding into each other, colours mixing -->
<path d="M24 168 Q14 150 14 130 Q14 112 22 98 Q30 84 40 80 Q50 76 56 84 Q62 92 62 112 Q62 132 54 150 Q48 164 38 170Z" fill="#B5593A" opacity=".65"/>
<path d="M46 168 Q36 150 36 130 Q36 112 44 98 Q52 84 62 80 Q72 76 78 84 Q84 92 84 112 Q84 132 76 150 Q70 164 60 170Z" fill="#1E3A52" opacity=".55"/>
<!-- overlap zone glow: no clear border between them -->
<ellipse cx="54" cy="128" rx="12" ry="30" fill="#8B7355" opacity=".1"/>
<text x="49" y="182" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".45" font-family="Georgia,serif">fused</text>

<!-- DIFFERENTIATED side: same two bodies, clear space, both complete -->
<path d="M122 168 Q110 148 108 126 Q106 106 116 90 Q126 74 138 70 Q150 66 158 78 Q166 90 166 114 Q166 138 154 160 Q146 174 134 174Z" fill="#B5593A" opacity=".85" style="animation:breathe 5s ease-in-out infinite;transform-origin:137px 120px"/>
<path d="M168 166 Q158 148 156 128 Q154 110 162 96 Q170 82 182 78 Q194 74 200 86 Q206 98 206 120 Q206 142 196 160 Q188 172 178 172Z" fill="#1E3A52" opacity=".82" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:181px 125px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M156 106 Q172 101 204 104"/><path d="M155 118 Q171 113 205 116"/></g>
<!-- space between them: the healthy gap -->
<line x1="165" y1="124" x2="157" y2="124" stroke="#D6CEBF" stroke-width="1.2" opacity=".5"/>
<text x="161" y="182" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".4" font-family="Georgia,serif">differentiated</text>

<!-- spectrum arrow -->
<line x1="88" y1="124" x2="104" y2="124" stroke="#8B7355" stroke-width=".7" opacity=".4"/>
<path d="M100 121 L104 124 L100 127" fill="none" stroke="#8B7355" stroke-width=".7" opacity=".4"/>

<text x="110" y="194" text-anchor="middle" font-family="Georgia,serif" font-size="7.5" letter-spacing="2" fill="#2C2C2A" opacity=".4">CH.4 · HOW YOU HOLD YOUR GROUND</text>
</svg>
    */

    <Svg viewBox="0 0 220 200" width={width} height={resolvedHeight} style={style}>

      {/* FUSED side: two bodies bleeding into each other */}
      <Path d="M24 168 Q14 150 14 130 Q14 112 22 98 Q30 84 40 80 Q50 76 56 84 Q62 92 62 112 Q62 132 54 150 Q48 164 38 170Z" fill="#B5593A" opacity={0.65}/>
      <Path d="M46 168 Q36 150 36 130 Q36 112 44 98 Q52 84 62 80 Q72 76 78 84 Q84 92 84 112 Q84 132 76 150 Q70 164 60 170Z" fill="#1E3A52" opacity={0.55}/>
      <Ellipse cx="54" cy="128" rx="12" ry="30" fill="#8B7355" opacity={0.1}/>
      <SvgText x="49" y="182" textAnchor="middle" fontSize="6.5" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">fused</SvgText>

      {/* DIFFERENTIATED side: same two bodies, clear space */}
      {/* TODO: animation breathe 5s */}
      <Path d="M122 168 Q110 148 108 126 Q106 106 116 90 Q126 74 138 70 Q150 66 158 78 Q166 90 166 114 Q166 138 154 160 Q146 174 134 174Z" fill="#B5593A" opacity={0.85}/>
      {/* TODO: animation breathe 5s delay -2.5s */}
      <Path d="M168 166 Q158 148 156 128 Q154 110 162 96 Q170 82 182 78 Q194 74 200 86 Q206 98 206 120 Q206 142 196 160 Q188 172 178 172Z" fill="#1E3A52" opacity={0.82}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
        <Path d="M156 106 Q172 101 204 104"/>
        <Path d="M155 118 Q171 113 205 116"/>
      </G>
      <Line x1="165" y1="124" x2="157" y2="124" stroke="#D6CEBF" strokeWidth="1.2" opacity={0.5}/>
      <SvgText x="161" y="182" textAnchor="middle" fontSize="6.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">differentiated</SvgText>

      {/* spectrum arrow */}
      <Line x1="88" y1="124" x2="104" y2="124" stroke="#8B7355" strokeWidth=".7" opacity={0.4}/>
      <Path d="M100 121 L104 124 L100 127" fill="none" stroke="#8B7355" strokeWidth=".7" opacity={0.4}/>

      <SvgText x="110" y="194" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2" fill="#2C2C2A" opacity={0.4}>{"CH.4 \u00B7 HOW YOU HOLD YOUR GROUND"}</SvgText>
    </Svg>
  );
}
