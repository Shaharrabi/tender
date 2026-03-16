/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          assess-ch7-full
 * Component:   IllustrationAssessField
 * Screen:      app/(app)/results.tsx  →  chapter 7 results card
 * Description: Chapter 7 result — concentric field rings with vine at center
 * ViewBox:     0 0 300 200
 *
 * USAGE:
 *   import { IllustrationAssessField } from '@/assets/graphics/illustrations/index';
 *   <IllustrationAssessField width={screenWidth} />
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

export function IllustrationAssessField({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (200 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="16" x2="300" y2="16"/><line x1="0" y1="30" x2="300" y2="30"/><line x1="0" y1="44" x2="300" y2="44"/><line x1="0" y1="58" x2="300" y2="58"/><line x1="0" y1="72" x2="300" y2="72"/><line x1="0" y1="86" x2="300" y2="86"/><line x1="0" y1="100" x2="300" y2="100"/><line x1="0" y1="114" x2="300" y2="114"/><line x1="0" y1="128" x2="300" y2="128"/><line x1="0" y1="142" x2="300" y2="142"/><line x1="0" y1="156" x2="300" y2="156"/><line x1="0" y1="170" x2="300" y2="170"/><line x1="0" y1="184" x2="300" y2="184"/></g>

<!-- The 5 subscales of the field assessment: 5 wave rings emanating from center -->
<!-- Center: the alive field -->
<circle cx="150" cy="100" r="10" fill="#C8923A" opacity=".75" style="animation:pulse 2s ease-in-out infinite"/>
<circle cx="150" cy="100" r="22" fill="none" stroke="#C8923A" stroke-width=".8" opacity=".5" style="animation:pulse 2.5s ease-in-out infinite;animation-delay:-.5s"/>
<circle cx="150" cy="100" r="36" fill="none" stroke="#7CA4B8" stroke-width=".7" opacity=".4" style="animation:pulse 2.5s ease-in-out infinite;animation-delay:-1s"/>
<circle cx="150" cy="100" r="52" fill="none" stroke="#7A9E8E" stroke-width=".6" opacity=".3" style="animation:pulse 2.5s ease-in-out infinite;animation-delay:-1.5s"/>
<circle cx="150" cy="100" r="70" fill="none" stroke="#D4909A" stroke-width=".5" opacity=".2" style="animation:pulse 2.5s ease-in-out infinite;animation-delay:-2s"/>

<!-- 5 subscale labels at the ring edges -->
<text x="150" y="57" text-anchor="middle" font-size="6.5" fill="#C8923A" opacity=".7" font-family="Georgia,serif">field recognition</text>
<text x="150" y="34" text-anchor="middle" font-size="6.5" fill="#7CA4B8" opacity=".65" font-family="Georgia,serif">presence &amp; attunement</text>
<text x="150" y="18" text-anchor="middle" font-size="6.5" fill="#7A9E8E" opacity=".6" font-family="Georgia,serif">creative tension</text>

<text x="224" y="102" font-size="6.5" fill="#C8923A" opacity=".65" font-family="Georgia,serif">emergent</text>
<text x="224" y="112" font-size="6.5" fill="#C8923A" opacity=".65" font-family="Georgia,serif">orientation</text>
<text x="12" y="102" text-anchor="start" font-size="6.5" fill="#D4909A" opacity=".6" font-family="Georgia,serif">boundary</text>
<text x="12" y="112" font-size="6.5" fill="#D4909A" opacity=".6" font-family="Georgia,serif">awareness</text>

<!-- two tiny figures at edges of outermost ring -->
<ellipse cx="96" cy="140" rx="10" ry="16" fill="#B5593A" opacity=".65" style="animation:breathe 5s ease-in-out infinite"/>
<ellipse cx="204" cy="140" rx="10" ry="16" fill="#1E3A52" opacity=".65" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s"/>
<!-- bodies sensing the field — small heads -->
<circle cx="96" cy="122" r="8" fill="none" stroke="#2C2C2A" stroke-width=".7"/>
<circle cx="204" cy="122" r="8" fill="none" stroke="#2C2C2A" stroke-width=".7"/>

<!-- vine in center -->
<g style="animation:float 4s ease-in-out infinite;transform-origin:150px 80px">
<line x1="150" y1="90" x2="150" y2="72" stroke="#2C2C2A" stroke-width=".8" opacity=".38"/>
<path d="M150 72 Q153 64 156 72 Q153 80 150 72Z" fill="#1E3A52" opacity=".65"/>
</g>

<text x="150" y="194" text-anchor="middle" font-family="Georgia,serif" font-size="7.5" letter-spacing="2" fill="#2C2C2A" opacity=".4">CH.7 · THE SPACE BETWEEN</text>
</svg>
    */

    <Svg viewBox="0 0 300 200" width={width} height={resolvedHeight} style={style}>

      {/* 5 wave rings emanating from center */}
      {/* TODO: animation pulse 2s */}
      <Circle cx="150" cy="100" r="10" fill="#C8923A" opacity={0.75}/>
      {/* TODO: animation pulse 2.5s delay -0.5s */}
      <Circle cx="150" cy="100" r="22" fill="none" stroke="#C8923A" strokeWidth=".8" opacity={0.5}/>
      {/* TODO: animation pulse 2.5s delay -1s */}
      <Circle cx="150" cy="100" r="36" fill="none" stroke="#7CA4B8" strokeWidth=".7" opacity={0.4}/>
      {/* TODO: animation pulse 2.5s delay -1.5s */}
      <Circle cx="150" cy="100" r="52" fill="none" stroke="#7A9E8E" strokeWidth=".6" opacity={0.3}/>
      {/* TODO: animation pulse 2.5s delay -2s */}
      <Circle cx="150" cy="100" r="70" fill="none" stroke="#D4909A" strokeWidth=".5" opacity={0.2}/>

      {/* 5 subscale labels */}
      <SvgText x="150" y="57" textAnchor="middle" fontSize="6.5" fill="#C8923A" opacity={0.7} fontFamily="Georgia,serif">field recognition</SvgText>
      <SvgText x="150" y="34" textAnchor="middle" fontSize="6.5" fill="#7CA4B8" opacity={0.65} fontFamily="Georgia,serif">{"presence & attunement"}</SvgText>
      <SvgText x="150" y="18" textAnchor="middle" fontSize="6.5" fill="#7A9E8E" opacity={0.6} fontFamily="Georgia,serif">creative tension</SvgText>

      <SvgText x="224" y="102" fontSize="6.5" fill="#C8923A" opacity={0.65} fontFamily="Georgia,serif">emergent</SvgText>
      <SvgText x="224" y="112" fontSize="6.5" fill="#C8923A" opacity={0.65} fontFamily="Georgia,serif">orientation</SvgText>
      <SvgText x="12" y="102" textAnchor="start" fontSize="6.5" fill="#D4909A" opacity={0.6} fontFamily="Georgia,serif">boundary</SvgText>
      <SvgText x="12" y="112" fontSize="6.5" fill="#D4909A" opacity={0.6} fontFamily="Georgia,serif">awareness</SvgText>

      {/* two tiny figures at edges */}
      {/* TODO: animation breathe 5s */}
      <Ellipse cx="96" cy="140" rx="10" ry="16" fill="#B5593A" opacity={0.65}/>
      {/* TODO: animation breathe 5s delay -2.5s */}
      <Ellipse cx="204" cy="140" rx="10" ry="16" fill="#1E3A52" opacity={0.65}/>
      <Circle cx="96" cy="122" r="8" fill="none" stroke="#2C2C2A" strokeWidth=".7"/>
      <Circle cx="204" cy="122" r="8" fill="none" stroke="#2C2C2A" strokeWidth=".7"/>

      {/* vine in center */}
      {/* TODO: animation float 4s */}
      <G>
        <Line x1="150" y1="90" x2="150" y2="72" stroke="#2C2C2A" strokeWidth=".8" opacity={0.38}/>
        <Path d="M150 72 Q153 64 156 72 Q153 80 150 72Z" fill="#1E3A52" opacity={0.65}/>
      </G>

      <SvgText x="150" y="194" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2" fill="#2C2C2A" opacity={0.4}>{"CH.7 \u00B7 THE SPACE BETWEEN"}</SvgText>
    </Svg>
  );
}
