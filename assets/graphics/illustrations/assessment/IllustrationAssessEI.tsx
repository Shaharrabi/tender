/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          assess-ch3-full
 * Component:   IllustrationAssessEI
 * Screen:      app/(app)/results.tsx  →  chapter 3 results card
 * Description: Chapter 3 result — EI petals flower around sage body
 * ViewBox:     0 0 220 200
 *
 * USAGE:
 *   import { IllustrationAssessEI } from '@/assets/graphics/illustrations/index';
 *   <IllustrationAssessEI width={screenWidth} />
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

export function IllustrationAssessEI({ width = 220, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (200 / 220));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="16" x2="220" y2="16"/><line x1="0" y1="30" x2="220" y2="30"/><line x1="0" y1="44" x2="220" y2="44"/><line x1="0" y1="58" x2="220" y2="58"/><line x1="0" y1="72" x2="220" y2="72"/><line x1="0" y1="86" x2="220" y2="86"/><line x1="0" y1="100" x2="220" y2="100"/><line x1="0" y1="114" x2="220" y2="114"/><line x1="0" y1="128" x2="220" y2="128"/><line x1="0" y1="142" x2="220" y2="142"/><line x1="0" y1="156" x2="220" y2="156"/><line x1="0" y1="170" x2="220" y2="170"/><line x1="0" y1="184" x2="220" y2="184"/></g>

<!-- SAGE body: wide, open — with 4 floating EI petals around it like a flower -->
<path d="M62 180 Q46 160 44 136 Q42 114 54 94 Q66 74 82 68 Q98 62 112 74 Q126 86 128 110 Q130 134 116 160 Q102 182 82 186Z" fill="#7A9E8E" opacity=".8" style="animation:breathe 5s ease-in-out infinite;transform-origin:86px 124px"/>
<ellipse cx="84" cy="60" rx="18" ry="22" fill="none" stroke="#2C2C2A" stroke-width=".9"/>
<path d="M72 48 Q80 40 86 38 Q92 36 96 44" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>

<!-- 4 EI petal zones: perceiving, using, understanding, managing -->
<!-- PERCEIVING: top, blush -->
<g style="animation:float 3.5s ease-in-out infinite;transform-origin:84px 30px">
<ellipse cx="84" cy="30" rx="22" ry="16" fill="#D4909A" opacity=".2"/>
<text x="84" y="26" text-anchor="middle" font-size="6.5" fill="#B5593A" opacity=".7" font-family="Georgia,serif">perceiving</text>
<text x="84" y="36" text-anchor="middle" font-size="6.5" fill="#B5593A" opacity=".55" font-family="Georgia,serif">emotions</text>
</g>
<!-- USING: right, mustard -->
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-.9s;transform-origin:168px 88px">
<ellipse cx="168" cy="88" rx="30" ry="16" fill="#C8923A" opacity=".18" transform="rotate(-15 168 88)"/>
<text x="166" y="84" text-anchor="middle" font-size="6.5" fill="#C8923A" opacity=".7" font-family="Georgia,serif">using</text>
<text x="166" y="96" text-anchor="middle" font-size="6.5" fill="#C8923A" opacity=".55" font-family="Georgia,serif">emotions</text>
</g>
<!-- UNDERSTANDING: bottom, dusty blue -->
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-1.8s;transform-origin:84px 170px">
<ellipse cx="84" cy="170" rx="22" ry="14" fill="#7CA4B8" opacity=".22"/>
<text x="84" y="166" text-anchor="middle" font-size="6.5" fill="#1E3A52" opacity=".7" font-family="Georgia,serif">understanding</text>
<text x="84" y="176" text-anchor="middle" font-size="6.5" fill="#1E3A52" opacity=".55" font-family="Georgia,serif">emotions</text>
</g>
<!-- MANAGING: left, plum -->
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-2.7s;transform-origin:18px 124px">
<ellipse cx="20" cy="124" rx="14" ry="22" fill="#6E4E6E" opacity=".18"/>
<text x="20" y="120" text-anchor="middle" font-size="6" fill="#6E4E6E" opacity=".65" font-family="Georgia,serif">managing</text>
<text x="20" y="130" text-anchor="middle" font-size="6" fill="#6E4E6E" opacity=".5" font-family="Georgia,serif">emotions</text>
</g>

<text x="110" y="194" text-anchor="middle" font-family="Georgia,serif" font-size="7.5" letter-spacing="2" fill="#2C2C2A" opacity=".4">CH.3 · HOW YOU READ THE ROOM</text>
</svg>
    */

    <Svg viewBox="0 0 220 200" width={width} height={resolvedHeight} style={style}>

      {/* SAGE body with 4 floating EI petals */}
      {/* TODO: animation breathe 5s */}
      <Path d="M62 180 Q46 160 44 136 Q42 114 54 94 Q66 74 82 68 Q98 62 112 74 Q126 86 128 110 Q130 134 116 160 Q102 182 82 186Z" fill="#7A9E8E" opacity={0.8}/>
      <Ellipse cx="84" cy="60" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth=".9"/>
      <Path d="M72 48 Q80 40 86 38 Q92 36 96 44" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>

      {/* PERCEIVING: top, blush */}
      {/* TODO: animation float 3.5s */}
      <G>
        <Ellipse cx="84" cy="30" rx="22" ry="16" fill="#D4909A" opacity={0.2}/>
        <SvgText x="84" y="26" textAnchor="middle" fontSize="6.5" fill="#B5593A" opacity={0.7} fontFamily="Georgia,serif">perceiving</SvgText>
        <SvgText x="84" y="36" textAnchor="middle" fontSize="6.5" fill="#B5593A" opacity={0.55} fontFamily="Georgia,serif">emotions</SvgText>
      </G>

      {/* USING: right, mustard */}
      {/* TODO: animation float 3.5s delay -0.9s */}
      <G>
        <Ellipse cx="168" cy="88" rx="30" ry="16" fill="#C8923A" opacity={0.18} rotation={-15} origin="168, 88"/>
        <SvgText x="166" y="84" textAnchor="middle" fontSize="6.5" fill="#C8923A" opacity={0.7} fontFamily="Georgia,serif">using</SvgText>
        <SvgText x="166" y="96" textAnchor="middle" fontSize="6.5" fill="#C8923A" opacity={0.55} fontFamily="Georgia,serif">emotions</SvgText>
      </G>

      {/* UNDERSTANDING: bottom, dusty blue */}
      {/* TODO: animation float 3.5s delay -1.8s */}
      <G>
        <Ellipse cx="84" cy="170" rx="22" ry="14" fill="#7CA4B8" opacity={0.22}/>
        <SvgText x="84" y="166" textAnchor="middle" fontSize="6.5" fill="#1E3A52" opacity={0.7} fontFamily="Georgia,serif">understanding</SvgText>
        <SvgText x="84" y="176" textAnchor="middle" fontSize="6.5" fill="#1E3A52" opacity={0.55} fontFamily="Georgia,serif">emotions</SvgText>
      </G>

      {/* MANAGING: left, plum */}
      {/* TODO: animation float 3.5s delay -2.7s */}
      <G>
        <Ellipse cx="20" cy="124" rx="14" ry="22" fill="#6E4E6E" opacity={0.18}/>
        <SvgText x="20" y="120" textAnchor="middle" fontSize="6" fill="#6E4E6E" opacity={0.65} fontFamily="Georgia,serif">managing</SvgText>
        <SvgText x="20" y="130" textAnchor="middle" fontSize="6" fill="#6E4E6E" opacity={0.5} fontFamily="Georgia,serif">emotions</SvgText>
      </G>

      <SvgText x="110" y="194" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2" fill="#2C2C2A" opacity={0.4}>{"CH.3 \u00B7 HOW YOU READ THE ROOM"}</SvgText>
    </Svg>
  );
}
