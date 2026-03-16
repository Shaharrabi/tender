/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-wot-hyper
 * Component:   IllustrationF20WoTHyper
 * Screen:      microcourse WoT hyperarousal lesson
 * Description: WoT hyperarousal scene — fire lines, body rising above window line
 * ViewBox:     0 0 480 340
 *
 * USAGE:
 *   import { IllustrationF20WoTHyper } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20WoTHyper width={screenWidth} />
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

export function IllustrationF20WoTHyper({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/><line x1="0" y1="294" x2="480" y2="294"/></g>

<!-- calm body right: navy, regulated -->
<path d="M298 312 Q278 286 276 256 Q274 228 286 202 Q298 176 318 166 Q338 156 352 168 Q366 180 368 206 Q370 232 356 266 Q342 300 322 316Z" fill="#1E3A52" opacity="0.85" style="animation:breathe 5s ease-in-out infinite;transform-origin:322px 241px"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round">
<path d="M278 212 Q308 205 366 210"/><path d="M276 228 Q307 222 368 226"/><path d="M276 244 Q307 238 367 242"/><path d="M277 260 Q307 254 365 258"/>
</g>
<ellipse cx="320" cy="154" rx="24" ry="28" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(-5 320 154)"/>

<!-- activated body left: terracotta, leaning toward calm -->
<path d="M128 314 Q106 288 104 258 Q102 228 114 202 Q126 176 148 166 Q170 156 184 168 Q198 180 200 208 Q202 236 188 270 Q174 302 152 318Z" fill="#B5593A" opacity="0.85" style="animation:breathe 4s ease-in-out infinite;animation-delay:-1s;transform-origin:152px 242px"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round">
<path d="M106 216 Q142 208 198 214"/><path d="M104 232 Q141 225 200 230"/><path d="M104 248 Q141 242 198 246"/>
</g>
<ellipse cx="152" cy="154" rx="24" ry="28" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(5 152 154)"/>

<!-- shared breath arcs: waves of co-regulation -->
<g style="animation:pulse 2.5s ease-in-out infinite">
<path d="M200 230 Q240 218 278 230" fill="none" stroke="#7CA4B8" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
<path d="M202 246 Q240 234 276 246" fill="none" stroke="#7CA4B8" stroke-width="1.1" stroke-linecap="round" opacity="0.4"/>
<path d="M203 260 Q240 250 277 260" fill="none" stroke="#7CA4B8" stroke-width="0.8" stroke-linecap="round" opacity="0.25"/>
</g>
<!-- small inhale / exhale labels -->
<text x="240" y="212" text-anchor="middle" font-size="7.5" fill="#7CA4B8" opacity="0.5" font-family="Georgia,serif">breathe together</text>

<text x="240" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">CO-REGULATION</text>
</svg>
    */

    <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight} style={style}>
      <Path d="M298 312 Q278 286 276 256 Q274 228 286 202 Q298 176 318 166 Q338 156 352 168 Q366 180 368 206 Q370 232 356 266 Q342 300 322 316Z" fill="#1E3A52" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
      <Path d="M278 212 Q308 205 366 210"/><Path d="M276 228 Q307 222 368 226"/><Path d="M276 244 Q307 238 367 242"/><Path d="M277 260 Q307 254 365 258"/>
      </G>
      <Ellipse cx="320" cy="154" rx="24" ry="28" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={-5} origin="320, 154"/>
      <Path d="M128 314 Q106 288 104 258 Q102 228 114 202 Q126 176 148 166 Q170 156 184 168 Q198 180 200 208 Q202 236 188 270 Q174 302 152 318Z" fill="#B5593A" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
      <Path d="M106 216 Q142 208 198 214"/><Path d="M104 232 Q141 225 200 230"/><Path d="M104 248 Q141 242 198 246"/>
      </G>
      <Ellipse cx="152" cy="154" rx="24" ry="28" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={5} origin="152, 154"/>
      <G>
      <Path d="M200 230 Q240 218 278 230" fill="none" stroke="#7CA4B8" strokeWidth="1.5" strokeLinecap="round" opacity={0.6}/>
      <Path d="M202 246 Q240 234 276 246" fill="none" stroke="#7CA4B8" strokeWidth="1.1" strokeLinecap="round" opacity={0.4}/>
      <Path d="M203 260 Q240 250 277 260" fill="none" stroke="#7CA4B8" strokeWidth="0.8" strokeLinecap="round" opacity={0.25}/>
      </G>
      <SvgText x="240" y="212" textAnchor="middle" fontSize="7.5" fill="#7CA4B8" opacity={0.5} fontFamily="Georgia,serif">breathe together</SvgText>
      <SvgText x="240" y="326" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>CO-REGULATION</SvgText>
    </Svg>
  );
}
