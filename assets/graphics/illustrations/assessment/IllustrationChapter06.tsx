/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          ch6and7-field
 * Component:   IllustrationChapter06
 * Screen:      app/(app)/tender-assessment.tsx  →  chapter 6+7 intro card
 * Description: Chapter 6+7 — Relational Field — twin orbs + vesica, five concentric ring labels
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationChapter06 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationChapter06 width={screenWidth} />
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

export function IllustrationChapter06({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<!-- THE SPACE BETWEEN: individual field awareness + couple field -->
<!-- Twin orb mini version with labeled subscales -->
<circle cx="96" cy="100" r="46" fill="none" stroke="#B5593A" stroke-width=".6" opacity=".2" style="animation:breathe 5s ease-in-out infinite"/>
<circle cx="96" cy="100" r="34" fill="#B5593A" opacity=".08"/>
<circle cx="192" cy="100" r="46" fill="none" stroke="#1E3A52" stroke-width=".6" opacity=".2" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s"/>
<circle cx="192" cy="100" r="34" fill="#1E3A52" opacity=".06"/>
<!-- vesica -->
<path d="M144 60 Q162 78 162 100 Q162 122 144 140 Q126 122 126 100 Q126 78 144 60Z" fill="#C8923A" opacity=".1" style="animation:glow 4s ease-in-out infinite"/>
<path d="M144 60 Q162 78 162 100 Q162 122 144 140 Q126 122 126 100 Q126 78 144 60Z" fill="none" stroke="#C8923A" stroke-width=".8" opacity=".4" style="animation:pulse 3s ease-in-out infinite"/>
<!-- subscale labels: field recognition, presence, creative tension, emergence -->
<text x="56" y="72" font-size="6" fill="#B5593A" opacity=".55" font-family="Georgia,serif" text-anchor="middle">field</text>
<text x="56" y="82" font-size="6" fill="#B5593A" opacity=".55" font-family="Georgia,serif" text-anchor="middle">recognition</text>
<text x="56" y="118" font-size="6" fill="#B5593A" opacity=".5" font-family="Georgia,serif" text-anchor="middle">presence &amp;</text>
<text x="56" y="128" font-size="6" fill="#B5593A" opacity=".5" font-family="Georgia,serif" text-anchor="middle">attunement</text>
<text x="232" y="72" font-size="6" fill="#1E3A52" opacity=".55" font-family="Georgia,serif" text-anchor="middle">creative</text>
<text x="232" y="82" font-size="6" fill="#1E3A52" opacity=".55" font-family="Georgia,serif" text-anchor="middle">tension</text>
<text x="232" y="118" font-size="6" fill="#1E3A52" opacity=".5" font-family="Georgia,serif" text-anchor="middle">emergent</text>
<text x="232" y="128" font-size="6" fill="#1E3A52" opacity=".5" font-family="Georgia,serif" text-anchor="middle">orientation</text>
<!-- vine in vesica -->
<g style="animation:float 4s ease-in-out infinite;transform-origin:144px 80px">
<line x1="144" y1="108" x2="144" y2="76" stroke="#2C2C2A" stroke-width=".8" opacity=".38"/>
<path d="M144 76 Q147 68 150 76 Q147 84 144 76Z" fill="#1E3A52" opacity=".7"/>
</g>
<!-- bottom: Values -->
<text x="30" y="170" font-size="7" fill="#8B7355" opacity=".45" font-family="Georgia,serif">Assessment 6 · The Space Between Us (20 items)</text>
<text x="30" y="184" font-size="7" fill="#8B7355" opacity=".38" font-family="Georgia,serif">Assessment 7 · What Lives Between You (15 items, couples)</text>
<text x="150" y="208" text-anchor="middle" font-family="Georgia,serif" font-size="8" letter-spacing="3" fill="#2C2C2A" opacity=".4">RELATIONAL FIELD · COUPLE FIELD</text>
</svg>
    */

    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Twin orb mini version */}
      {/* TODO: animation breathe 5s */}
      <Circle cx="96" cy="100" r="46" fill="none" stroke="#B5593A" strokeWidth=".6" opacity={0.2}/>
      <Circle cx="96" cy="100" r="34" fill="#B5593A" opacity={0.08}/>
      {/* TODO: animation breathe 5s delay -2.5s */}
      <Circle cx="192" cy="100" r="46" fill="none" stroke="#1E3A52" strokeWidth=".6" opacity={0.2}/>
      <Circle cx="192" cy="100" r="34" fill="#1E3A52" opacity={0.06}/>

      {/* vesica */}
      {/* TODO: animation glow 4s */}
      <Path d="M144 60 Q162 78 162 100 Q162 122 144 140 Q126 122 126 100 Q126 78 144 60Z" fill="#C8923A" opacity={0.1}/>
      {/* TODO: animation pulse 3s */}
      <Path d="M144 60 Q162 78 162 100 Q162 122 144 140 Q126 122 126 100 Q126 78 144 60Z" fill="none" stroke="#C8923A" strokeWidth=".8" opacity={0.4}/>

      {/* subscale labels */}
      <SvgText x="56" y="72" fontSize="6" fill="#B5593A" opacity={0.55} fontFamily="Georgia,serif" textAnchor="middle">field</SvgText>
      <SvgText x="56" y="82" fontSize="6" fill="#B5593A" opacity={0.55} fontFamily="Georgia,serif" textAnchor="middle">recognition</SvgText>
      <SvgText x="56" y="118" fontSize="6" fill="#B5593A" opacity={0.5} fontFamily="Georgia,serif" textAnchor="middle">{"presence &"}</SvgText>
      <SvgText x="56" y="128" fontSize="6" fill="#B5593A" opacity={0.5} fontFamily="Georgia,serif" textAnchor="middle">attunement</SvgText>
      <SvgText x="232" y="72" fontSize="6" fill="#1E3A52" opacity={0.55} fontFamily="Georgia,serif" textAnchor="middle">creative</SvgText>
      <SvgText x="232" y="82" fontSize="6" fill="#1E3A52" opacity={0.55} fontFamily="Georgia,serif" textAnchor="middle">tension</SvgText>
      <SvgText x="232" y="118" fontSize="6" fill="#1E3A52" opacity={0.5} fontFamily="Georgia,serif" textAnchor="middle">emergent</SvgText>
      <SvgText x="232" y="128" fontSize="6" fill="#1E3A52" opacity={0.5} fontFamily="Georgia,serif" textAnchor="middle">orientation</SvgText>

      {/* vine in vesica */}
      {/* TODO: animation float 4s */}
      <G>
        <Line x1="144" y1="108" x2="144" y2="76" stroke="#2C2C2A" strokeWidth=".8" opacity={0.38}/>
        <Path d="M144 76 Q147 68 150 76 Q147 84 144 76Z" fill="#1E3A52" opacity={0.7}/>
      </G>

      {/* bottom labels */}
      <SvgText x="30" y="170" fontSize="7" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">{"Assessment 6 \u00B7 The Space Between Us (20 items)"}</SvgText>
      <SvgText x="30" y="184" fontSize="7" fill="#8B7355" opacity={0.38} fontFamily="Georgia,serif">{"Assessment 7 \u00B7 What Lives Between You (15 items, couples)"}</SvgText>

      <SvgText x="150" y="208" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>{"RELATIONAL FIELD \u00B7 COUPLE FIELD"}</SvgText>
    </Svg>
  );
}
