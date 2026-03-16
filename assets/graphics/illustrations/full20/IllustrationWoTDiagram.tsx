/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-wot-diagram
 * Component:   IllustrationWoTDiagram
 * Screen:      microcourse WoT psychoeducation opening slide
 * Description: WoT full diagram — 3 zones with labeled bodies in each: hyper/regulated/hypo
 * ViewBox:     0 0 480 340
 *
 * USAGE:
 *   import { IllustrationWoTDiagram } from '@/assets/graphics/illustrations/index';
 *   <IllustrationWoTDiagram width={screenWidth} />
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

export function IllustrationWoTDiagram({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/><line x1="0" y1="294" x2="480" y2="294"/></g>

<!-- heat zone -->
<rect x="0" y="0" width="480" height="100" fill="#B5593A" opacity="0.04"/>

<!-- BODY: hyper-aroused, exploded stripes, rising energy, abstract urgency -->
<path d="M140 318 Q108 282 104 242 Q100 204 116 172 Q132 140 158 128 Q184 116 202 130 Q220 144 224 180 Q228 216 212 258 Q196 300 172 322Z" fill="#B5593A" opacity="0.88" style="animation:rise 2.2s ease-in-out infinite;transform-origin:164px 225px"/>
<g opacity="0.25" stroke="#F2EDE4" stroke-width="3" stroke-linecap="round">
<path d="M106 186 Q148 177 220 184"/><path d="M104 204 Q147 196 222 202"/><path d="M104 222 Q147 215 220 219"/>
</g>
<g opacity="0.15" stroke="#F2EDE4" stroke-width="1.5" stroke-linecap="round">
<path d="M108 240 Q148 233 218 237"/><path d="M110 256 Q148 250 216 253"/>
</g>
<ellipse cx="164" cy="116" rx="30" ry="36" fill="none" stroke="#2C2C2A" stroke-width="1.2" transform="rotate(-4 164 116)"/>
<path d="M144 100 Q156 86 166 83 Q176 80 184 90" fill="none" stroke="#2C2C2A" stroke-width="1.1" stroke-linecap="round" opacity="0.65"/>

<!-- heat lines rising from body like energy leaking out -->
<g style="animation:rise 1.8s ease-in-out infinite;transform-origin:300px 150px">
<path d="M290 200 Q285 180 290 162 Q295 180 293 200Z" fill="#C8923A" opacity="0.6"/>
<path d="M308 190 Q303 172 308 156 Q313 172 311 190Z" fill="#C8923A" opacity="0.45"/>
<path d="M326 205 Q321 187 326 170 Q331 187 329 205Z" fill="#C8923A" opacity="0.35"/>
</g>

<!-- jagged horizontal line: above the window -->
<path d="M30 100 Q80 88 130 100 Q180 112 230 96 Q280 80 330 96 Q380 112 430 96 Q460 88 480 94" fill="none" stroke="#B5593A" stroke-width="1" opacity="0.35" stroke-dasharray="4 3"/>
<text x="340" y="92" font-size="8" fill="#B5593A" opacity="0.5" font-family="Georgia,serif">above window</text>

<!-- grounding object: small stone lower right -->
<ellipse cx="400" cy="280" rx="22" ry="14" fill="#8B7355" opacity="0.25" style="animation:breathe 6s ease-in-out infinite"/>
<text x="400" y="284" text-anchor="middle" font-size="7.5" fill="#8B7355" opacity="0.55" font-family="Georgia,serif">ground</text>

<text x="240" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">HYPERAROUSAL</text>
</svg>
    */

    <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight} style={style}>
      <Rect x="0" y="0" width="480" height="100" fill="#B5593A" opacity={0.04}/>
      <Path d="M140 318 Q108 282 104 242 Q100 204 116 172 Q132 140 158 128 Q184 116 202 130 Q220 144 224 180 Q228 216 212 258 Q196 300 172 322Z" fill="#B5593A" opacity={0.88}/>
      <G opacity={0.25} stroke="#F2EDE4" strokeWidth="3" strokeLinecap="round">
      <Path d="M106 186 Q148 177 220 184"/><Path d="M104 204 Q147 196 222 202"/><Path d="M104 222 Q147 215 220 219"/>
      </G>
      <G opacity={0.15} stroke="#F2EDE4" strokeWidth="1.5" strokeLinecap="round">
      <Path d="M108 240 Q148 233 218 237"/><Path d="M110 256 Q148 250 216 253"/>
      </G>
      <Ellipse cx="164" cy="116" rx="30" ry="36" fill="none" stroke="#2C2C2A" strokeWidth="1.2" rotation={-4} origin="164, 116"/>
      <Path d="M144 100 Q156 86 166 83 Q176 80 184 90" fill="none" stroke="#2C2C2A" strokeWidth="1.1" strokeLinecap="round" opacity={0.65}/>
      <G>
      <Path d="M290 200 Q285 180 290 162 Q295 180 293 200Z" fill="#C8923A" opacity={0.6}/>
      <Path d="M308 190 Q303 172 308 156 Q313 172 311 190Z" fill="#C8923A" opacity={0.45}/>
      <Path d="M326 205 Q321 187 326 170 Q331 187 329 205Z" fill="#C8923A" opacity={0.35}/>
      </G>
      <Path d="M30 100 Q80 88 130 100 Q180 112 230 96 Q280 80 330 96 Q380 112 430 96 Q460 88 480 94" fill="none" stroke="#B5593A" strokeWidth="1" opacity={0.35} strokeDasharray="4 3"/>
      <SvgText x="340" y="92" fontSize="8" fill="#B5593A" opacity={0.5} fontFamily="Georgia,serif">above window</SvgText>
      <Ellipse cx="400" cy="280" rx="22" ry="14" fill="#8B7355" opacity={0.25}/>
      <SvgText x="400" y="284" textAnchor="middle" fontSize="7.5" fill="#8B7355" opacity={0.55} fontFamily="Georgia,serif">ground</SvgText>
      <SvgText x="240" y="326" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>HYPERAROUSAL</SvgText>
    </Svg>
  );
}
