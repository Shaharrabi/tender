/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          ch6-values
 * Component:   IllustrationChapter07
 * Screen:      app/(app)/tender-assessment.tsx  →  chapter 6 values card
 * Description: Chapter 6 — What Matters Most — mustard body with compass rose, value constellations
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationChapter07 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationChapter07 width={screenWidth} />
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

export function IllustrationChapter07({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<!-- values compass: body with compass rose, values radiating as lines with dots -->
<path d="M86 190 Q68 166 66 140 Q64 116 76 94 Q88 72 106 66 Q124 60 138 74 Q152 88 154 112 Q156 136 140 164 Q124 190 104 198Z" fill="#B5593A" opacity=".8" style="animation:breathe 5.5s ease-in-out infinite;transform-origin:110px 130px"/>
<g opacity=".18" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M68 102 Q102 96 152 100"/><path d="M66 116 Q101 111 153 114"/><path d="M66 130 Q101 125 152 128"/><path d="M67 144 Q101 139 150 142"/></g>
<ellipse cx="108" cy="58" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<!-- compass rose with values -->
<g style="animation:drift 6s ease-in-out infinite;transform-origin:200px 112px">
<circle cx="200" cy="112" r="26" fill="none" stroke="#C8923A" stroke-width=".8" opacity=".5"/>
<line x1="200" y1="86" x2="200" y2="138" stroke="#C8923A" stroke-width=".7" opacity=".5"/>
<line x1="174" y1="112" x2="226" y2="112" stroke="#C8923A" stroke-width=".7" opacity=".5"/>
<path d="M196 90 L200 84 L204 90" fill="none" stroke="#C8923A" stroke-width=".7" opacity=".6"/>
</g>
<text x="200" y="80" text-anchor="middle" font-size="6.5" fill="#C8923A" opacity=".6" font-family="Georgia,serif">connection</text>
<text x="232" y="116" font-size="6.5" fill="#C8923A" opacity=".55" font-family="Georgia,serif">growth</text>
<text x="198" y="148" text-anchor="middle" font-size="6.5" fill="#7A9E8E" opacity=".55" font-family="Georgia,serif">freedom</text>
<text x="162" y="116" text-anchor="end" font-size="6.5" fill="#7CA4B8" opacity=".55" font-family="Georgia,serif">safety</text>
<text x="150" y="208" text-anchor="middle" font-family="Georgia,serif" font-size="8" letter-spacing="3" fill="#2C2C2A" opacity=".4">PERSONAL VALUES</text>
</svg>
    */

    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* values compass: body with compass rose */}
      {/* TODO: animation breathe 5.5s */}
      <Path d="M86 190 Q68 166 66 140 Q64 116 76 94 Q88 72 106 66 Q124 60 138 74 Q152 88 154 112 Q156 136 140 164 Q124 190 104 198Z" fill="#B5593A" opacity={0.8}/>
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
        <Path d="M68 102 Q102 96 152 100"/>
        <Path d="M66 116 Q101 111 153 114"/>
        <Path d="M66 130 Q101 125 152 128"/>
        <Path d="M67 144 Q101 139 150 142"/>
      </G>
      <Ellipse cx="108" cy="58" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth="1"/>

      {/* compass rose with values */}
      {/* TODO: animation drift 6s */}
      <G>
        <Circle cx="200" cy="112" r="26" fill="none" stroke="#C8923A" strokeWidth=".8" opacity={0.5}/>
        <Line x1="200" y1="86" x2="200" y2="138" stroke="#C8923A" strokeWidth=".7" opacity={0.5}/>
        <Line x1="174" y1="112" x2="226" y2="112" stroke="#C8923A" strokeWidth=".7" opacity={0.5}/>
        <Path d="M196 90 L200 84 L204 90" fill="none" stroke="#C8923A" strokeWidth=".7" opacity={0.6}/>
      </G>

      <SvgText x="200" y="80" textAnchor="middle" fontSize="6.5" fill="#C8923A" opacity={0.6} fontFamily="Georgia,serif">connection</SvgText>
      <SvgText x="232" y="116" fontSize="6.5" fill="#C8923A" opacity={0.55} fontFamily="Georgia,serif">growth</SvgText>
      <SvgText x="198" y="148" textAnchor="middle" fontSize="6.5" fill="#7A9E8E" opacity={0.55} fontFamily="Georgia,serif">freedom</SvgText>
      <SvgText x="162" y="116" textAnchor="end" fontSize="6.5" fill="#7CA4B8" opacity={0.55} fontFamily="Georgia,serif">safety</SvgText>

      <SvgText x="150" y="208" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>PERSONAL VALUES</SvgText>
    </Svg>
  );
}
