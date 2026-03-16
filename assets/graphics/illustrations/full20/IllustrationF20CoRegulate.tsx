/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-coregulate
 * Component:   IllustrationF20CoRegulate
 * Screen:      exercise.tsx breathing exercises
 * Description: Co-regulation — two bodies, shared breath wave between them
 * ViewBox:     0 0 480 340
 *
 * USAGE:
 *   import { IllustrationF20CoRegulate } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20CoRegulate width={screenWidth} />
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

export function IllustrationF20CoRegulate({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/><line x1="0" y1="294" x2="480" y2="294"/></g>

<!-- water zone: half submerged -->
<rect x="0" y="200" width="480" height="140" fill="#7CA4B8" opacity="0.06"/>
<path d="M0 200 Q60 192 120 200 Q180 208 240 200 Q300 192 360 200 Q420 208 480 200" fill="none" stroke="#7CA4B8" stroke-width="1.1" opacity="0.5"/>

<!-- body: half terra above, half navy below, arms raised -->
<path d="M188 196 Q170 174 172 150 Q174 128 186 116 Q198 104 210 110 Q222 116 224 136 Q226 156 214 180 Q202 200 194 200Z" fill="#B5593A" opacity="0.88"/>
<path d="M188 200 Q172 222 174 248 Q176 272 188 288 Q200 304 212 298 Q224 292 226 270 Q228 248 216 224 Q204 200 196 200Z" fill="#1E3A52" opacity="0.75"/>
<g opacity="0.18" stroke="#F2EDE4" stroke-width="1.5" stroke-linecap="round">
<path d="M174 218 Q200 212 224 216"/><path d="M174 232 Q200 226 225 230"/><path d="M175 246 Q200 240 224 244"/>
</g>
<!-- head -->
<ellipse cx="198" cy="100" rx="22" ry="26" fill="none" stroke="#2C2C2A" stroke-width="1.1"/>
<path d="M180 86 Q192 74 200 72 Q208 70 214 80" fill="none" stroke="#2C2C2A" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
<!-- arms lifted: grounding gesture up -->

<!-- 5 sense objects floating: 5-4-3-2-1 grounding -->
<g style="animation:float 3.5s ease-in-out infinite;transform-origin:310px 110px"><circle cx="310" cy="110" r="6" fill="none" stroke="#C8923A" stroke-width="0.9"/><text x="310" y="114" text-anchor="middle" font-size="7" fill="#C8923A" opacity="0.7" font-family="Georgia,serif">see</text></g>
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-0.7s;transform-origin:342px 144px"><path d="M338 144 Q342 138 346 144 Q342 150 338 144Z" fill="#7A9E8E" opacity="0.75"/><text x="342" y="160" text-anchor="middle" font-size="7" fill="#7A9E8E" opacity="0.6" font-family="Georgia,serif">touch</text></g>
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-1.4s;transform-origin:360px 90px"><path d="M355 90 Q362 84 368 90" fill="none" stroke="#7CA4B8" stroke-width="1.1" stroke-linecap="round"/><text x="362" y="106" text-anchor="middle" font-size="7" fill="#7CA4B8" opacity="0.6" font-family="Georgia,serif">hear</text></g>
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-2s;transform-origin:388px 128px"><ellipse cx="388" cy="128" rx="7" ry="5" fill="#8B7355" opacity="0.3"/><text x="388" y="142" text-anchor="middle" font-size="7" fill="#8B7355" opacity="0.55" font-family="Georgia,serif">smell</text></g>
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-2.7s;transform-origin:378px 168px"><circle cx="378" cy="168" r="4" fill="#D4909A" opacity="0.55"/><text x="378" y="182" text-anchor="middle" font-size="7" fill="#D4909A" opacity="0.6" font-family="Georgia,serif">taste</text></g>

<text x="240" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">GROUNDING · 5-4-3-2-1</text>
</svg>
    */

    <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight} style={style}>
      <Rect x="0" y="200" width="480" height="140" fill="#7CA4B8" opacity={0.06}/>
      <Path d="M0 200 Q60 192 120 200 Q180 208 240 200 Q300 192 360 200 Q420 208 480 200" fill="none" stroke="#7CA4B8" strokeWidth="1.1" opacity={0.5}/>
      <Path d="M188 196 Q170 174 172 150 Q174 128 186 116 Q198 104 210 110 Q222 116 224 136 Q226 156 214 180 Q202 200 194 200Z" fill="#B5593A" opacity={0.88}/>
      <Path d="M188 200 Q172 222 174 248 Q176 272 188 288 Q200 304 212 298 Q224 292 226 270 Q228 248 216 224 Q204 200 196 200Z" fill="#1E3A52" opacity={0.75}/>
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth="1.5" strokeLinecap="round">
      <Path d="M174 218 Q200 212 224 216"/><Path d="M174 232 Q200 226 225 230"/><Path d="M175 246 Q200 240 224 244"/>
      </G>
      <Ellipse cx="198" cy="100" rx="22" ry="26" fill="none" stroke="#2C2C2A" strokeWidth="1.1"/>
      <Path d="M180 86 Q192 74 200 72 Q208 70 214 80" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.6}/>
      <G><Circle cx="310" cy="110" r="6" fill="none" stroke="#C8923A" strokeWidth="0.9"/><SvgText x="310" y="130" textAnchor="middle" fontSize="20" fill="#C8923A" opacity={0.85} fontFamily="Georgia,serif">see</SvgText></G>
      <G><Path d="M338 144 Q342 138 346 144 Q342 150 338 144Z" fill="#7A9E8E" opacity={0.75}/><SvgText x="342" y="170" textAnchor="middle" fontSize="20" fill="#7A9E8E" opacity={0.8} fontFamily="Georgia,serif">touch</SvgText></G>
      <G><Path d="M355 90 Q362 84 368 90" fill="none" stroke="#7CA4B8" strokeWidth="1.1" strokeLinecap="round"/><SvgText x="362" y="112" textAnchor="middle" fontSize="20" fill="#7CA4B8" opacity={0.8} fontFamily="Georgia,serif">hear</SvgText></G>
      <G><Ellipse cx="388" cy="128" rx="7" ry="5" fill="#8B7355" opacity={0.3}/><SvgText x="388" y="152" textAnchor="middle" fontSize="20" fill="#8B7355" opacity={0.75} fontFamily="Georgia,serif">smell</SvgText></G>
      <G><Circle cx="378" cy="168" r="4" fill="#D4909A" opacity={0.55}/><SvgText x="378" y="192" textAnchor="middle" fontSize="20" fill="#D4909A" opacity={0.8} fontFamily="Georgia,serif">taste</SvgText></G>
      <SvgText x="240" y="326" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" letterSpacing="3" fill="#2C2C2A" opacity={0.55}>{"GROUNDING \u00B7 5-4-3-2-1"}</SvgText>
    </Svg>
  );
}
