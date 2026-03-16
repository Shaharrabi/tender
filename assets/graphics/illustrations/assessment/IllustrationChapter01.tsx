/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          ch1-closeness
 * Component:   IllustrationChapter01
 * Screen:      app/(app)/tender-assessment.tsx  →  chapter 1 intro card
 * Description: Chapter 1 — How You Seek Closeness — 4 attachment style bodies in quadrant
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationChapter01 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationChapter01 width={screenWidth} />
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

export function IllustrationChapter01({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<!-- 4 attachment quadrant: abstract bodies in each corner -->
<!-- SECURE top-right: upright, open, two-tone -->
<path d="M202 88 Q194 76 193 64 Q192 52 198 44 Q204 36 210 40 Q216 44 218 56 Q220 68 214 80 Q210 90 206 92Z" fill="#7A9E8E" opacity=".82" style="animation:breathe 5s ease-in-out infinite;transform-origin:206px 64px"/>
<ellipse cx="204" cy="36" rx="11" ry="13" fill="none" stroke="#2C2C2A" stroke-width=".8"/>
<text x="218" y="96" font-size="7" fill="#7A9E8E" opacity=".65" font-family="Georgia,serif">secure</text>
<!-- ANXIOUS top-left: reaching, straining -->
<path d="M60 84 Q48 68 46 52 Q44 38 52 30 Q60 22 68 28 Q76 34 78 50 Q80 66 70 80 Q66 88 62 88Z" fill="#B5593A" opacity=".78" style="animation:breathe 3.5s ease-in-out infinite;transform-origin:62px 55px"/>
<path d="M78 52 Q90 44 96 48" fill="none" stroke="#B5593A" stroke-width="4.5" stroke-linecap="round" style="animation:float 2.5s ease-in-out infinite"/>
<ellipse cx="60" cy="24" rx="11" ry="13" fill="none" stroke="#2C2C2A" stroke-width=".8"/>
<text x="44" y="100" font-size="7" fill="#B5593A" opacity=".65" font-family="Georgia,serif">anxious</text>
<!-- AVOIDANT bottom-right: turned away, rigid stripes -->
<path d="M202 188 Q214 172 216 156 Q218 142 210 132 Q202 122 194 126 Q186 130 184 144 Q182 158 190 174 Q196 188 202 192Z" fill="#1E3A52" opacity=".78"/>
<g opacity=".18" stroke="#F2EDE4" stroke-width="1.5" stroke-linecap="round"><path d="M184 142 Q200 138 216 140"/><path d="M183 152 Q199 148 217 150"/></g>
<ellipse cx="202" cy="124" rx="11" ry="13" fill="none" stroke="#2C2C2A" stroke-width=".8"/>
<text x="190" y="202" font-size="7" fill="#1E3A52" opacity=".65" font-family="Georgia,serif">avoidant</text>
<!-- DISORGANIZED bottom-left: fragmented -->
<path d="M58 186 Q46 170 44 154 Q42 140 50 130 Q58 120 66 124 Q74 128 76 144 Q78 160 68 176 Q64 188 60 190Z" fill="#6E4E6E" opacity=".72" transform="rotate(5 60 155)"/>
<ellipse cx="58" cy="122" rx="11" ry="13" fill="none" stroke="#2C2C2A" stroke-width=".8"/>
<text x="46" y="202" font-size="7" fill="#6E4E6E" opacity=".65" font-family="Georgia,serif">disorganized</text>
<!-- axes -->
<line x1="150" y1="14" x2="150" y2="200" stroke="#D6CEBF" stroke-width=".6" opacity=".5"/>
<line x1="20" y1="110" x2="280" y2="110" stroke="#D6CEBF" stroke-width=".6" opacity=".5"/>
<text x="80" y="108" font-size="6" fill="#8B7355" opacity=".35" font-family="Georgia,serif" text-anchor="middle">high anxiety</text>
<text x="220" y="108" font-size="6" fill="#8B7355" opacity=".35" font-family="Georgia,serif" text-anchor="middle">low anxiety</text>
<text x="152" y="208" text-anchor="middle" font-family="Georgia,serif" font-size="8" letter-spacing="3" fill="#2C2C2A" opacity=".4">ECR-R</text>
</svg>
    */

    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* SECURE top-right */}
      {/* TODO: animation breathe 5s */}
      <Path d="M202 88 Q194 76 193 64 Q192 52 198 44 Q204 36 210 40 Q216 44 218 56 Q220 68 214 80 Q210 90 206 92Z" fill="#7A9E8E" opacity={0.82}/>
      <Ellipse cx="204" cy="36" rx="11" ry="13" fill="none" stroke="#2C2C2A" strokeWidth=".8"/>
      <SvgText x="218" y="96" fontSize="7" fill="#7A9E8E" opacity={0.65} fontFamily="Georgia,serif">secure</SvgText>

      {/* ANXIOUS top-left */}
      {/* TODO: animation breathe 3.5s */}
      <Path d="M60 84 Q48 68 46 52 Q44 38 52 30 Q60 22 68 28 Q76 34 78 50 Q80 66 70 80 Q66 88 62 88Z" fill="#B5593A" opacity={0.78}/>
      {/* TODO: animation float 2.5s */}
      <Path d="M78 52 Q90 44 96 48" fill="none" stroke="#B5593A" strokeWidth="4.5" strokeLinecap="round"/>
      <Ellipse cx="60" cy="24" rx="11" ry="13" fill="none" stroke="#2C2C2A" strokeWidth=".8"/>
      <SvgText x="44" y="100" fontSize="7" fill="#B5593A" opacity={0.65} fontFamily="Georgia,serif">anxious</SvgText>

      {/* AVOIDANT bottom-right */}
      <Path d="M202 188 Q214 172 216 156 Q218 142 210 132 Q202 122 194 126 Q186 130 184 144 Q182 158 190 174 Q196 188 202 192Z" fill="#1E3A52" opacity={0.78}/>
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth="1.5" strokeLinecap="round">
        <Path d="M184 142 Q200 138 216 140"/>
        <Path d="M183 152 Q199 148 217 150"/>
      </G>
      <Ellipse cx="202" cy="124" rx="11" ry="13" fill="none" stroke="#2C2C2A" strokeWidth=".8"/>
      <SvgText x="190" y="202" fontSize="7" fill="#1E3A52" opacity={0.65} fontFamily="Georgia,serif">avoidant</SvgText>

      {/* DISORGANIZED bottom-left */}
      <Path d="M58 186 Q46 170 44 154 Q42 140 50 130 Q58 120 66 124 Q74 128 76 144 Q78 160 68 176 Q64 188 60 190Z" fill="#6E4E6E" opacity={0.72} rotation={5} origin="60, 155"/>
      <Ellipse cx="58" cy="122" rx="11" ry="13" fill="none" stroke="#2C2C2A" strokeWidth=".8"/>
      <SvgText x="46" y="202" fontSize="7" fill="#6E4E6E" opacity={0.65} fontFamily="Georgia,serif">disorganized</SvgText>

      {/* axes */}
      <Line x1="150" y1="14" x2="150" y2="200" stroke="#D6CEBF" strokeWidth=".6" opacity={0.5}/>
      <Line x1="20" y1="110" x2="280" y2="110" stroke="#D6CEBF" strokeWidth=".6" opacity={0.5}/>
      <SvgText x="80" y="108" fontSize="6" fill="#8B7355" opacity={0.35} fontFamily="Georgia,serif" textAnchor="middle">high anxiety</SvgText>
      <SvgText x="220" y="108" fontSize="6" fill="#8B7355" opacity={0.35} fontFamily="Georgia,serif" textAnchor="middle">low anxiety</SvgText>
      <SvgText x="152" y="208" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>ECR-R</SvgText>
    </Svg>
  );
}
