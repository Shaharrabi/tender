/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-grounding
 * Component:   IllustrationF20Grounding
 * Screen:      exercise.tsx 5-4-3-2-1 grounding exercise
 * Description: Grounding 5-4-3-2-1 — half-submerged body, 5 sense labels floating
 * ViewBox:     0 0 480 340
 *
 * USAGE:
 *   import { IllustrationF20Grounding } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20Grounding width={screenWidth} />
 *
 * CONVERSION NOTES (Claude Code — do these in order):
 *   1. Replace <svg>       →  <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight}>
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

export function IllustrationF20Grounding({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/><line x1="0" y1="294" x2="480" y2="294"/></g>

<!-- orbit ring -->
<circle cx="200" cy="185" r="120" fill="none" stroke="#D6CEBF" stroke-width="0.8" stroke-dasharray="4 5" opacity="0.5"/>

<!-- Self body — both colors, merged -->
<path d="M152 296 Q132 270 130 240 Q128 212 142 188 Q156 164 176 157 Q196 150 208 164 Q220 178 222 204 Q224 230 210 260 Q196 290 178 300Z" fill="#B5593A" opacity="0.82" style="animation:breathe 5s ease-in-out infinite;transform-origin:176px 228px"/>
<g opacity="0.18" stroke="#1E3A52" stroke-width="3" stroke-linecap="round">
<path d="M134 200 Q166 193 220 198"/><path d="M132 216 Q165 210 221 214"/><path d="M133 232 Q165 226 220 230"/>
</g>
<ellipse cx="176" cy="144" rx="24" ry="28" fill="none" stroke="#2C2C2A" stroke-width="1.1"/>
<path d="M157 130 Q168 118 178 115 Q188 112 194 122" fill="none" stroke="#2C2C2A" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
<!-- SELF dot: golden center in torso -->
<circle cx="176" cy="228" r="4" fill="#C8923A" opacity="0.85" style="animation:pulse 2s ease-in-out infinite"/>

<!-- inner rings inside body -->
<ellipse cx="176" cy="228" rx="12" ry="16" fill="none" stroke="#C8923A" stroke-width="0.8" style="animation:pulse 2.5s ease-in-out infinite;animation-delay:-0.5s"/>
<ellipse cx="176" cy="228" rx="24" ry="32" fill="none" stroke="#C8923A" stroke-width="0.55" opacity="0.5" style="animation:pulse 2.5s ease-in-out infinite;animation-delay:-1.2s"/>

<!-- orbiting PARTS: labeled, colored -->
<g style="transform-origin:200px 185px;animation:orbit 9s linear infinite">
<circle cx="200" cy="65" r="16" fill="none" stroke="#B5593A" stroke-width="0.8" opacity="0.5"/>
<text x="200" y="69" text-anchor="middle" font-size="7.5" fill="#B5593A" opacity="0.7" font-family="Georgia,serif">protector</text>
</g>
<g style="transform-origin:200px 185px;animation:orbit 9s linear infinite;animation-delay:-3s">
<circle cx="200" cy="65" r="16" fill="none" stroke="#7CA4B8" stroke-width="0.8" opacity="0.5"/>
<text x="200" y="69" text-anchor="middle" font-size="7.5" fill="#7CA4B8" opacity="0.7" font-family="Georgia,serif">exile</text>
</g>
<g style="transform-origin:200px 185px;animation:orbit 9s linear infinite;animation-delay:-6s">
<circle cx="200" cy="65" r="16" fill="none" stroke="#7A9E8E" stroke-width="0.8" opacity="0.5"/>
<text x="200" y="69" text-anchor="middle" font-size="7.5" fill="#7A9E8E" opacity="0.7" font-family="Georgia,serif">manager</text>
</g>

<!-- right: SELF quality labels -->
<g opacity="0.65">
<text x="345" y="148" font-size="8.5" fill="#C8923A" font-family="Georgia,serif" letter-spacing="0.5">C — curious</text>
<text x="345" y="166" font-size="8.5" fill="#C8923A" font-family="Georgia,serif" letter-spacing="0.5">C — calm</text>
<text x="345" y="184" font-size="8.5" fill="#C8923A" font-family="Georgia,serif" letter-spacing="0.5">C — compassion</text>
<text x="345" y="202" font-size="8.5" fill="#C8923A" font-family="Georgia,serif" letter-spacing="0.5">C — connected</text>
<text x="345" y="220" font-size="8.5" fill="#C8923A" font-family="Georgia,serif" letter-spacing="0.5">C — creative</text>
<text x="345" y="238" font-size="8.5" fill="#C8923A" font-family="Georgia,serif" letter-spacing="0.5">C — courageous</text>
<text x="345" y="256" font-size="8.5" fill="#C8923A" font-family="Georgia,serif" letter-spacing="0.5">C — confident</text>
<text x="345" y="274" font-size="8.5" fill="#C8923A" font-family="Georgia,serif" letter-spacing="0.5">C — clarity</text>
<text x="336" y="292" font-size="7" fill="#8B7355" font-family="Georgia,serif" opacity="0.5">the 8 C's of Self</text>
</g>

<text x="240" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">IFS · PARTS MAP</text>
</svg>
    */

    <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight} style={style}>
      <Circle cx="200" cy="185" r="120" fill="none" stroke="#D6CEBF" strokeWidth="0.8" strokeDasharray="4 5" opacity={0.5}/>
      <Path d="M152 296 Q132 270 130 240 Q128 212 142 188 Q156 164 176 157 Q196 150 208 164 Q220 178 222 204 Q224 230 210 260 Q196 290 178 300Z" fill="#B5593A" opacity={0.82}/>
      <G opacity={0.18} stroke="#1E3A52" strokeWidth="3" strokeLinecap="round">
      <Path d="M134 200 Q166 193 220 198"/><Path d="M132 216 Q165 210 221 214"/><Path d="M133 232 Q165 226 220 230"/>
      </G>
      <Ellipse cx="176" cy="144" rx="24" ry="28" fill="none" stroke="#2C2C2A" strokeWidth="1.1"/>
      <Path d="M157 130 Q168 118 178 115 Q188 112 194 122" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.6}/>
      <Circle cx="176" cy="228" r="4" fill="#C8923A" opacity={0.85}/>
      <Ellipse cx="176" cy="228" rx="12" ry="16" fill="none" stroke="#C8923A" strokeWidth="0.8"/>
      <Ellipse cx="176" cy="228" rx="24" ry="32" fill="none" stroke="#C8923A" strokeWidth="0.55" opacity={0.5}/>
      <G>
      <Circle cx="200" cy="65" r="16" fill="none" stroke="#B5593A" strokeWidth="0.8" opacity={0.5}/>
      <SvgText x="200" y="69" textAnchor="middle" fontSize="7.5" fill="#B5593A" opacity={0.7} fontFamily="Georgia,serif">protector</SvgText>
      </G>
      <G>
      <Circle cx="200" cy="65" r="16" fill="none" stroke="#7CA4B8" strokeWidth="0.8" opacity={0.5}/>
      <SvgText x="200" y="69" textAnchor="middle" fontSize="7.5" fill="#7CA4B8" opacity={0.7} fontFamily="Georgia,serif">exile</SvgText>
      </G>
      <G>
      <Circle cx="200" cy="65" r="16" fill="none" stroke="#7A9E8E" strokeWidth="0.8" opacity={0.5}/>
      <SvgText x="200" y="69" textAnchor="middle" fontSize="7.5" fill="#7A9E8E" opacity={0.7} fontFamily="Georgia,serif">manager</SvgText>
      </G>
      <G opacity={0.65}>
      <SvgText x="345" y="148" fontSize="8.5" fill="#C8923A" fontFamily="Georgia,serif" letterSpacing="0.5">C — curious</SvgText>
      <SvgText x="345" y="166" fontSize="8.5" fill="#C8923A" fontFamily="Georgia,serif" letterSpacing="0.5">C — calm</SvgText>
      <SvgText x="345" y="184" fontSize="8.5" fill="#C8923A" fontFamily="Georgia,serif" letterSpacing="0.5">C — compassion</SvgText>
      <SvgText x="345" y="202" fontSize="8.5" fill="#C8923A" fontFamily="Georgia,serif" letterSpacing="0.5">C — connected</SvgText>
      <SvgText x="345" y="220" fontSize="8.5" fill="#C8923A" fontFamily="Georgia,serif" letterSpacing="0.5">C — creative</SvgText>
      <SvgText x="345" y="238" fontSize="8.5" fill="#C8923A" fontFamily="Georgia,serif" letterSpacing="0.5">C — courageous</SvgText>
      <SvgText x="345" y="256" fontSize="8.5" fill="#C8923A" fontFamily="Georgia,serif" letterSpacing="0.5">C — confident</SvgText>
      <SvgText x="345" y="274" fontSize="8.5" fill="#C8923A" fontFamily="Georgia,serif" letterSpacing="0.5">C — clarity</SvgText>
      <SvgText x="336" y="292" fontSize="7" fill="#8B7355" fontFamily="Georgia,serif" opacity={0.5}>the 8 C's of Self</SvgText>
      </G>
      <SvgText x="240" y="326" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>{"IFS \u00B7 PARTS MAP"}</SvgText>
    </Svg>
  );
}
