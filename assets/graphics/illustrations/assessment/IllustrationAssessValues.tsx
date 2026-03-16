/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          assess-ch6-full
 * Component:   IllustrationAssessValues
 * Screen:      app/(app)/results.tsx  →  chapter 6 results card
 * Description: Chapter 6 result — compass body with value constellations
 * ViewBox:     0 0 300 200
 *
 * USAGE:
 *   import { IllustrationAssessValues } from '@/assets/graphics/illustrations/index';
 *   <IllustrationAssessValues width={screenWidth} />
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

export function IllustrationAssessValues({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (200 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="16" x2="300" y2="16"/><line x1="0" y1="30" x2="300" y2="30"/><line x1="0" y1="44" x2="300" y2="44"/><line x1="0" y1="58" x2="300" y2="58"/><line x1="0" y1="72" x2="300" y2="72"/><line x1="0" y1="86" x2="300" y2="86"/><line x1="0" y1="100" x2="300" y2="100"/><line x1="0" y1="114" x2="300" y2="114"/><line x1="0" y1="128" x2="300" y2="128"/><line x1="0" y1="142" x2="300" y2="142"/><line x1="0" y1="156" x2="300" y2="156"/><line x1="0" y1="170" x2="300" y2="170"/><line x1="0" y1="184" x2="300" y2="184"/></g>

<!-- MUSTARD body: standing tall, compass rose at chest, values as constellations -->
<path d="M94 182 Q74 158 72 132 Q70 108 82 86 Q94 64 112 58 Q130 52 144 66 Q158 80 160 106 Q162 132 148 160 Q134 184 114 190Z" fill="#C8923A" opacity=".8" style="animation:breathe 5.5s ease-in-out infinite;transform-origin:116px 124px"/>
<g opacity=".18" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round">
<path d="M74 94 Q112 88 158 92"/><path d="M72 108 Q111 103 159 106"/><path d="M72 122 Q111 117 158 120"/><path d="M73 136 Q111 131 157 134"/>
</g>
<ellipse cx="116" cy="50" rx="20" ry="24" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M102 38 Q112 28 118 26 Q124 24 128 32" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>

<!-- compass at chest -->
<g style="animation:drift 6s ease-in-out infinite;transform-origin:116px 120px">
<circle cx="116" cy="120" r="20" fill="none" stroke="#F2EDE4" stroke-width=".8" opacity=".6"/>
<line x1="116" y1="100" x2="116" y2="140" stroke="#F2EDE4" stroke-width=".7" opacity=".5"/>
<line x1="96" y1="120" x2="136" y2="120" stroke="#F2EDE4" stroke-width=".7" opacity=".5"/>
<path d="M113 104 L116 100 L119 104" fill="none" stroke="#F2EDE4" stroke-width=".7" opacity=".7" stroke-linecap="round"/>
</g>

<!-- value constellations floating around: small dots connected -->
<g style="animation:float 4s ease-in-out infinite;transform-origin:196px 70px" opacity=".7">
<circle cx="192" cy="70" r="2.5" fill="#B5593A"/>
<circle cx="202" cy="60" r="2" fill="#B5593A"/>
<circle cx="210" cy="74" r="2" fill="#B5593A"/>
<line x1="192" y1="70" x2="202" y2="60" stroke="#B5593A" stroke-width=".6"/>
<line x1="202" y1="60" x2="210" y2="74" stroke="#B5593A" stroke-width=".6"/>
<text x="200" y="88" text-anchor="middle" font-size="6" fill="#B5593A" opacity=".65" font-family="Georgia,serif">connection</text>
</g>
<g style="animation:float 4s ease-in-out infinite;animation-delay:-1.5s;transform-origin:220px 120px" opacity=".7">
<circle cx="218" cy="118" r="2.5" fill="#7A9E8E"/>
<circle cx="230" cy="112" r="2" fill="#7A9E8E"/>
<circle cx="228" cy="126" r="2" fill="#7A9E8E"/>
<line x1="218" y1="118" x2="230" y2="112" stroke="#7A9E8E" stroke-width=".6"/>
<text x="228" y="138" text-anchor="middle" font-size="6" fill="#7A9E8E" opacity=".65" font-family="Georgia,serif">freedom</text>
</g>
<g style="animation:float 4s ease-in-out infinite;animation-delay:-3s;transform-origin:196px 158px" opacity=".7">
<circle cx="194" cy="156" r="2.5" fill="#6E4E6E"/>
<circle cx="208" cy="162" r="2" fill="#6E4E6E"/>
<circle cx="200" cy="168" r="2" fill="#6E4E6E"/>
<line x1="194" y1="156" x2="208" y2="162" stroke="#6E4E6E" stroke-width=".6"/>
<text x="200" y="180" text-anchor="middle" font-size="6" fill="#6E4E6E" opacity=".65" font-family="Georgia,serif">growth</text>
</g>

<text x="150" y="196" text-anchor="middle" font-family="Georgia,serif" font-size="7.5" letter-spacing="2" fill="#2C2C2A" opacity=".4">CH.6 · WHAT MATTERS MOST</text>
</svg>
    */

    <Svg viewBox="0 0 300 200" width={width} height={resolvedHeight} style={style}>

      {/* MUSTARD body: standing tall */}
      {/* TODO: animation breathe 5.5s */}
      <Path d="M94 182 Q74 158 72 132 Q70 108 82 86 Q94 64 112 58 Q130 52 144 66 Q158 80 160 106 Q162 132 148 160 Q134 184 114 190Z" fill="#C8923A" opacity={0.8}/>
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
        <Path d="M74 94 Q112 88 158 92"/>
        <Path d="M72 108 Q111 103 159 106"/>
        <Path d="M72 122 Q111 117 158 120"/>
        <Path d="M73 136 Q111 131 157 134"/>
      </G>
      <Ellipse cx="116" cy="50" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
      <Path d="M102 38 Q112 28 118 26 Q124 24 128 32" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>

      {/* compass at chest */}
      {/* TODO: animation drift 6s */}
      <G>
        <Circle cx="116" cy="120" r="20" fill="none" stroke="#F2EDE4" strokeWidth=".8" opacity={0.6}/>
        <Line x1="116" y1="100" x2="116" y2="140" stroke="#F2EDE4" strokeWidth=".7" opacity={0.5}/>
        <Line x1="96" y1="120" x2="136" y2="120" stroke="#F2EDE4" strokeWidth=".7" opacity={0.5}/>
        <Path d="M113 104 L116 100 L119 104" fill="none" stroke="#F2EDE4" strokeWidth=".7" opacity={0.7} strokeLinecap="round"/>
      </G>

      {/* value constellations: connection */}
      {/* TODO: animation float 4s */}
      <G opacity={0.7}>
        <Circle cx="192" cy="70" r="2.5" fill="#B5593A"/>
        <Circle cx="202" cy="60" r="2" fill="#B5593A"/>
        <Circle cx="210" cy="74" r="2" fill="#B5593A"/>
        <Line x1="192" y1="70" x2="202" y2="60" stroke="#B5593A" strokeWidth=".6"/>
        <Line x1="202" y1="60" x2="210" y2="74" stroke="#B5593A" strokeWidth=".6"/>
        <SvgText x="200" y="88" textAnchor="middle" fontSize="6" fill="#B5593A" opacity={0.65} fontFamily="Georgia,serif">connection</SvgText>
      </G>

      {/* freedom */}
      {/* TODO: animation float 4s delay -1.5s */}
      <G opacity={0.7}>
        <Circle cx="218" cy="118" r="2.5" fill="#7A9E8E"/>
        <Circle cx="230" cy="112" r="2" fill="#7A9E8E"/>
        <Circle cx="228" cy="126" r="2" fill="#7A9E8E"/>
        <Line x1="218" y1="118" x2="230" y2="112" stroke="#7A9E8E" strokeWidth=".6"/>
        <SvgText x="228" y="138" textAnchor="middle" fontSize="6" fill="#7A9E8E" opacity={0.65} fontFamily="Georgia,serif">freedom</SvgText>
      </G>

      {/* growth */}
      {/* TODO: animation float 4s delay -3s */}
      <G opacity={0.7}>
        <Circle cx="194" cy="156" r="2.5" fill="#6E4E6E"/>
        <Circle cx="208" cy="162" r="2" fill="#6E4E6E"/>
        <Circle cx="200" cy="168" r="2" fill="#6E4E6E"/>
        <Line x1="194" y1="156" x2="208" y2="162" stroke="#6E4E6E" strokeWidth=".6"/>
        <SvgText x="200" y="180" textAnchor="middle" fontSize="6" fill="#6E4E6E" opacity={0.65} fontFamily="Georgia,serif">growth</SvgText>
      </G>

      <SvgText x="150" y="196" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2" fill="#2C2C2A" opacity={0.4}>{"CH.6 \u00B7 WHAT MATTERS MOST"}</SvgText>
    </Svg>
  );
}
