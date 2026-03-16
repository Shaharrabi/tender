/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          assess-ch5-full
 * Component:   IllustrationAssessConflict
 * Screen:      app/(app)/results.tsx  →  chapter 5 results card
 * Description: Chapter 5 result — conflict interaction with horsemen + antidotes
 * ViewBox:     0 0 300 200
 *
 * USAGE:
 *   import { IllustrationAssessConflict } from '@/assets/graphics/illustrations/index';
 *   <IllustrationAssessConflict width={screenWidth} />
 *
 * CONVERSION NOTES (Claude Code — do these in order):
 *   1. Replace <svg>       →  <Svg viewBox="0 0 300 200" width={width} height={resolvedHeight}>
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

export function IllustrationAssessConflict({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (200 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="16" x2="300" y2="16"/><line x1="0" y1="30" x2="300" y2="30"/><line x1="0" y1="44" x2="300" y2="44"/><line x1="0" y1="58" x2="300" y2="58"/><line x1="0" y1="72" x2="300" y2="72"/><line x1="0" y1="86" x2="300" y2="86"/><line x1="0" y1="100" x2="300" y2="100"/><line x1="0" y1="114" x2="300" y2="114"/><line x1="0" y1="128" x2="300" y2="128"/><line x1="0" y1="142" x2="300" y2="142"/><line x1="0" y1="156" x2="300" y2="156"/><line x1="0" y1="170" x2="300" y2="170"/><line x1="0" y1="184" x2="300" y2="184"/></g>

<!-- Conflict dynamic: two bodies in tension, the four horsemen above them -->
<!-- BLUSH body left: criticism pose — leaning forward with pointing arm -->
<path d="M56 178 Q40 158 38 136 Q36 116 46 98 Q56 80 70 74 Q84 68 94 80 Q104 92 106 114 Q108 136 96 160 Q86 178 72 184Z" fill="#D4909A" opacity=".82" style="animation:breathe 4s ease-in-out infinite;transform-origin:72px 126px"/>
<ellipse cx="72" cy="66" rx="18" ry="22" fill="none" stroke="#2C2C2A" stroke-width=".9" transform="rotate(5 72 66)"/>
<!-- pointed arm: criticism -->
<!-- NAVY body right: stone-walling pose — arms crossed, turned away -->
<path d="M196 178 Q214 158 216 136 Q218 116 208 98 Q198 80 184 74 Q170 68 160 80 Q150 92 148 114 Q146 136 158 160 Q168 178 182 184Z" fill="#1E3A52" opacity=".82"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M150 112 Q174 107 214 110"/><path d="M149 124 Q173 119 215 122"/></g>
<ellipse cx="182" cy="66" rx="18" ry="22" fill="none" stroke="#2C2C2A" stroke-width=".9" transform="rotate(-5 182 66)"/>
<!-- arms crossed: stonewalling -->

<!-- THE FOUR HORSEMEN: floating above the conflict space -->
<g opacity=".5">
<rect x="120" y="16" width="60" height="14" rx="4" fill="#D4909A" opacity=".25"/>
<text x="150" y="26" text-anchor="middle" font-size="6.5" fill="#B5593A" font-family="Georgia,serif">contempt</text>
<rect x="120" y="34" width="60" height="14" rx="4" fill="#7CA4B8" opacity=".2"/>
<text x="150" y="44" text-anchor="middle" font-size="6.5" fill="#1E3A52" font-family="Georgia,serif">stonewalling</text>
<rect x="120" y="52" width="60" height="14" rx="4" fill="#C8923A" opacity=".2"/>
<text x="150" y="62" text-anchor="middle" font-size="6.5" fill="#C8923A" font-family="Georgia,serif">defensiveness</text>
<rect x="120" y="70" width="60" height="14" rx="4" fill="#D4909A" opacity=".18"/>
<text x="150" y="80" text-anchor="middle" font-size="6.5" fill="#B5593A" font-family="Georgia,serif">criticism</text>
</g>

<!-- ANTIDOTES: right side -->
<g opacity=".45">
<text x="234" y="26" font-size="6.5" fill="#7A9E8E" font-family="Georgia,serif">→ admiration</text>
<text x="234" y="44" font-size="6.5" fill="#7A9E8E" font-family="Georgia,serif">→ self-soothe</text>
<text x="234" y="62" font-size="6.5" fill="#7A9E8E" font-family="Georgia,serif">→ take resp.</text>
<text x="234" y="80" font-size="6.5" fill="#7A9E8E" font-family="Georgia,serif">→ soft startup</text>
</g>

<text x="150" y="194" text-anchor="middle" font-family="Georgia,serif" font-size="7.5" letter-spacing="2" fill="#2C2C2A" opacity=".4">CH.5 · HOW YOU NAVIGATE CONFLICT</text>
</svg>
    */

    <Svg viewBox="0 0 300 200" width={width} height={resolvedHeight} style={style}>

      {/* BLUSH body left: criticism pose */}
      {/* TODO: animation breathe 4s */}
      <Path d="M56 178 Q40 158 38 136 Q36 116 46 98 Q56 80 70 74 Q84 68 94 80 Q104 92 106 114 Q108 136 96 160 Q86 178 72 184Z" fill="#D4909A" opacity={0.82}/>
      <Ellipse cx="72" cy="66" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth=".9" rotation={5} origin="72, 66"/>

      {/* NAVY body right: stone-walling pose */}
      <Path d="M196 178 Q214 158 216 136 Q218 116 208 98 Q198 80 184 74 Q170 68 160 80 Q150 92 148 114 Q146 136 158 160 Q168 178 182 184Z" fill="#1E3A52" opacity={0.82}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
        <Path d="M150 112 Q174 107 214 110"/>
        <Path d="M149 124 Q173 119 215 122"/>
      </G>
      <Ellipse cx="182" cy="66" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth=".9" rotation={-5} origin="182, 66"/>

      {/* THE FOUR HORSEMEN */}
      <G opacity={0.5}>
        <Rect x="120" y="16" width="60" height="14" rx="4" fill="#D4909A" opacity={0.25}/>
        <SvgText x="150" y="26" textAnchor="middle" fontSize="6.5" fill="#B5593A" fontFamily="Georgia,serif">contempt</SvgText>
        <Rect x="120" y="34" width="60" height="14" rx="4" fill="#7CA4B8" opacity={0.2}/>
        <SvgText x="150" y="44" textAnchor="middle" fontSize="6.5" fill="#1E3A52" fontFamily="Georgia,serif">stonewalling</SvgText>
        <Rect x="120" y="52" width="60" height="14" rx="4" fill="#C8923A" opacity={0.2}/>
        <SvgText x="150" y="62" textAnchor="middle" fontSize="6.5" fill="#C8923A" fontFamily="Georgia,serif">defensiveness</SvgText>
        <Rect x="120" y="70" width="60" height="14" rx="4" fill="#D4909A" opacity={0.18}/>
        <SvgText x="150" y="80" textAnchor="middle" fontSize="6.5" fill="#B5593A" fontFamily="Georgia,serif">criticism</SvgText>
      </G>

      {/* ANTIDOTES */}
      <G opacity={0.45}>
        <SvgText x="234" y="26" fontSize="6.5" fill="#7A9E8E" fontFamily="Georgia,serif">{"\u2192 admiration"}</SvgText>
        <SvgText x="234" y="44" fontSize="6.5" fill="#7A9E8E" fontFamily="Georgia,serif">{"\u2192 self-soothe"}</SvgText>
        <SvgText x="234" y="62" fontSize="6.5" fill="#7A9E8E" fontFamily="Georgia,serif">{"\u2192 take resp."}</SvgText>
        <SvgText x="234" y="80" fontSize="6.5" fill="#7A9E8E" fontFamily="Georgia,serif">{"\u2192 soft startup"}</SvgText>
      </G>

      <SvgText x="150" y="194" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2" fill="#2C2C2A" opacity={0.4}>{"CH.5 \u00B7 HOW YOU NAVIGATE CONFLICT"}</SvgText>
    </Svg>
  );
}
