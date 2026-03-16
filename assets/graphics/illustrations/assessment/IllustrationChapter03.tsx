/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          ch3-room
 * Component:   IllustrationChapter03
 * Screen:      app/(app)/tender-assessment.tsx  →  chapter 3 intro card
 * Description: Chapter 3 — How You Read the Room — body with 4 EI petals floating around it
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationChapter03 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationChapter03 width={screenWidth} />
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

export function IllustrationChapter03({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<!-- EI: figure with emotional landscape — different emotions as colored zones in/around body -->
<path d="M96 192 Q76 168 74 142 Q72 118 84 96 Q96 74 114 68 Q132 62 146 76 Q160 90 162 114 Q164 138 148 166 Q132 192 112 200Z" fill="#B5593A" opacity=".82" style="animation:breathe 5s ease-in-out infinite;transform-origin:118px 133px"/>
<ellipse cx="114" cy="60" rx="20" ry="24" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M100 48 Q110 38 116 36 Q122 34 126 42" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- four EI domains: floating colored zones -->
<g style="animation:float 3.5s ease-in-out infinite;transform-origin:196px 72px">
<circle cx="196" cy="72" r="18" fill="#D4909A" opacity=".18"/>
<text x="196" y="68" text-anchor="middle" font-size="7" fill="#B5593A" opacity=".65" font-family="Georgia,serif">perceiving</text>
<text x="196" y="80" text-anchor="middle" font-size="7" fill="#B5593A" opacity=".5" font-family="Georgia,serif">emotions</text>
</g>
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-1s;transform-origin:216px 124px">
<circle cx="216" cy="124" r="18" fill="#C8923A" opacity=".15"/>
<text x="216" y="120" text-anchor="middle" font-size="7" fill="#C8923A" opacity=".65" font-family="Georgia,serif">using</text>
<text x="216" y="132" text-anchor="middle" font-size="7" fill="#C8923A" opacity=".5" font-family="Georgia,serif">emotions</text>
</g>
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-2s;transform-origin:204px 174px">
<circle cx="204" cy="174" r="18" fill="#7CA4B8" opacity=".18"/>
<text x="204" y="170" text-anchor="middle" font-size="7" fill="#1E3A52" opacity=".65" font-family="Georgia,serif">understanding</text>
<text x="204" y="182" text-anchor="middle" font-size="7" fill="#1E3A52" opacity=".5" font-family="Georgia,serif">emotions</text>
</g>
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-3s;transform-origin:176px 220px">
<text x="176" y="212" text-anchor="middle" font-size="7" fill="#7A9E8E" opacity=".65" font-family="Georgia,serif">managing emotions</text>
</g>
<text x="150" y="210" text-anchor="middle" font-family="Georgia,serif" font-size="8" letter-spacing="3" fill="#2C2C2A" opacity=".4">SSEIT</text>
</svg>
    */

    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* EI: figure with emotional landscape */}
      {/* TODO: animation breathe 5s */}
      <Path d="M96 192 Q76 168 74 142 Q72 118 84 96 Q96 74 114 68 Q132 62 146 76 Q160 90 162 114 Q164 138 148 166 Q132 192 112 200Z" fill="#B5593A" opacity={0.82}/>
      <Ellipse cx="114" cy="60" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
      <Path d="M100 48 Q110 38 116 36 Q122 34 126 42" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>

      {/* perceiving */}
      {/* TODO: animation float 3.5s */}
      <G>
        <Circle cx="196" cy="72" r="18" fill="#D4909A" opacity={0.18}/>
        <SvgText x="196" y="68" textAnchor="middle" fontSize="7" fill="#B5593A" opacity={0.65} fontFamily="Georgia,serif">perceiving</SvgText>
        <SvgText x="196" y="80" textAnchor="middle" fontSize="7" fill="#B5593A" opacity={0.5} fontFamily="Georgia,serif">emotions</SvgText>
      </G>

      {/* using */}
      {/* TODO: animation float 3.5s delay -1s */}
      <G>
        <Circle cx="216" cy="124" r="18" fill="#C8923A" opacity={0.15}/>
        <SvgText x="216" y="120" textAnchor="middle" fontSize="7" fill="#C8923A" opacity={0.65} fontFamily="Georgia,serif">using</SvgText>
        <SvgText x="216" y="132" textAnchor="middle" fontSize="7" fill="#C8923A" opacity={0.5} fontFamily="Georgia,serif">emotions</SvgText>
      </G>

      {/* understanding */}
      {/* TODO: animation float 3.5s delay -2s */}
      <G>
        <Circle cx="204" cy="174" r="18" fill="#7CA4B8" opacity={0.18}/>
        <SvgText x="204" y="170" textAnchor="middle" fontSize="7" fill="#1E3A52" opacity={0.65} fontFamily="Georgia,serif">understanding</SvgText>
        <SvgText x="204" y="182" textAnchor="middle" fontSize="7" fill="#1E3A52" opacity={0.5} fontFamily="Georgia,serif">emotions</SvgText>
      </G>

      {/* managing */}
      {/* TODO: animation float 3.5s delay -3s */}
      <G>
        <SvgText x="176" y="212" textAnchor="middle" fontSize="7" fill="#7A9E8E" opacity={0.65} fontFamily="Georgia,serif">managing emotions</SvgText>
      </G>

      <SvgText x="150" y="210" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>SSEIT</SvgText>
    </Svg>
  );
}
