/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-home
 * Component:   IllustrationF20Home
 * Screen:      app/(app)/home.tsx  alt version
 * Description: Full-size home — two abstract bodies with vine and open field
 * ViewBox:     0 0 480 340
 *
 * USAGE:
 *   import { IllustrationF20Home } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20Home width={screenWidth} />
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

export function IllustrationF20Home({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/><line x1="0" y1="294" x2="480" y2="294"/><line x1="0" y1="312" x2="480" y2="312"/></g>

<!-- open field: not a shape, a breath -->
<g opacity="0.25">
<path d="M30 252 Q100 234 180 244 Q260 254 340 238 Q400 225 460 230" fill="none" stroke="#7CA4B8" stroke-width="1.8" stroke-linecap="round"/>
<path d="M20 268 Q95 252 176 260 Q258 268 338 253 Q402 240 462 245" fill="none" stroke="#7CA4B8" stroke-width="1.3" stroke-linecap="round" opacity="0.75"/>
<path d="M25 282 Q98 268 178 274 Q260 280 340 266 Q403 254 462 258" fill="none" stroke="#7CA4B8" stroke-width="0.9" stroke-linecap="round" opacity="0.5"/>
<path d="M28 295 Q100 282 180 287 Q262 292 340 279 Q403 268 462 272" fill="none" stroke="#7CA4B8" stroke-width="0.6" stroke-linecap="round" opacity="0.3"/>
</g>

<!-- LEFT BODY: terracotta, abstract pour, heavy stripes -->
<path d="M68 318 Q46 290 44 260 Q42 232 54 205 Q66 178 86 167 Q106 156 120 166 Q134 176 136 202 Q138 228 126 262 Q114 296 98 320Z" fill="#B5593A" opacity="0.87" style="animation:breathe 5s ease-in-out infinite;transform-origin:90px 242px"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round">
<path d="M48 212 Q82 204 132 210"/><path d="M46 228 Q80 221 134 226"/><path d="M45 244 Q80 238 134 242"/><path d="M46 260 Q80 254 132 258"/><path d="M48 274 Q80 269 128 273"/>
</g>
<!-- head left -->
<ellipse cx="102" cy="150" rx="26" ry="31" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(7 102 150)"/>
<path d="M82 133 Q93 120 104 117 Q115 114 123 125" fill="none" stroke="#2C2C2A" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
<circle cx="110" cy="152" r="2" fill="#2C2C2A" opacity="0.35"/>
<rect x="97" y="178" width="8" height="10" fill="#B5593A" rx="3"/>

<!-- RIGHT BODY: navy, denser stripes, leaning in -->
<path d="M360 316 Q338 288 336 258 Q334 230 346 203 Q358 176 378 165 Q398 154 412 164 Q426 174 428 200 Q430 226 418 260 Q406 294 390 318Z" fill="#1E3A52" opacity="0.87" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:382px 240px"/>
<g opacity="0.22" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round">
<path d="M338 206 Q368 199 426 204"/><path d="M336 220 Q366 214 428 218"/><path d="M335 234 Q365 228 428 232"/><path d="M336 248 Q365 243 426 246"/><path d="M337 262 Q366 257 424 260"/><path d="M339 276 Q367 272 420 274"/>
</g>
<ellipse cx="395" cy="148" rx="26" ry="31" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(-7 395 148)"/>
<path d="M376 131 Q386 118 397 115 Q408 112 416 123" fill="none" stroke="#2C2C2A" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
<circle cx="385" cy="150" r="2" fill="#2C2C2A" opacity="0.35"/>
<rect x="390" y="176" width="8" height="10" fill="#1E3A52" rx="3"/>

<!-- vine arc -->
<path d="M136 178 Q200 138 240 122 Q280 106 346 136 Q362 148 372 166" fill="none" stroke="#2C2C2A" stroke-width="1.4" stroke-linecap="round" opacity="0.6" stroke-dasharray="380" style="animation:unfurl 3s ease-out forwards"/>
<!-- leaf -->
<g style="animation:float 4s ease-in-out infinite;transform-origin:240px 90px">
<path d="M240 120 Q243 108 246 98 Q248 110 245 120Z" fill="#1E3A52" opacity="0.8"/>
<path d="M240 120 Q237 110 234 100 Q236 112 239 120Z" fill="#1E3A52" opacity="0.56"/>
<line x1="240" y1="98" x2="240" y2="120" stroke="#2C2C2A" stroke-width="0.8" opacity="0.45"/>
<path d="M237 108 Q230 105 229 110 Q234 112 237 108Z" fill="#1E3A52" opacity="0.4"/>
</g>
<!-- breath dashes -->
<line x1="134" y1="162" x2="184" y2="138" stroke="#2C2C2A" stroke-width="0.75" stroke-dasharray="3 5" opacity="0.35" style="animation:pulse 3s ease-in-out infinite"/>
<line x1="368" y1="160" x2="318" y2="136" stroke="#2C2C2A" stroke-width="0.75" stroke-dasharray="3 5" opacity="0.35" style="animation:pulse 3s ease-in-out infinite;animation-delay:-1.5s"/>

<text x="240" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">HOME</text>
</svg>
    */

    <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight} style={style}>
      <G opacity={0.25}>
      <Path d="M30 252 Q100 234 180 244 Q260 254 340 238 Q400 225 460 230" fill="none" stroke="#7CA4B8" strokeWidth="1.8" strokeLinecap="round"/>
      <Path d="M20 268 Q95 252 176 260 Q258 268 338 253 Q402 240 462 245" fill="none" stroke="#7CA4B8" strokeWidth="1.3" strokeLinecap="round" opacity={0.75}/>
      <Path d="M25 282 Q98 268 178 274 Q260 280 340 266 Q403 254 462 258" fill="none" stroke="#7CA4B8" strokeWidth="0.9" strokeLinecap="round" opacity={0.5}/>
      <Path d="M28 295 Q100 282 180 287 Q262 292 340 279 Q403 268 462 272" fill="none" stroke="#7CA4B8" strokeWidth="0.6" strokeLinecap="round" opacity={0.3}/>
      </G>
      <Path d="M68 318 Q46 290 44 260 Q42 232 54 205 Q66 178 86 167 Q106 156 120 166 Q134 176 136 202 Q138 228 126 262 Q114 296 98 320Z" fill="#B5593A" opacity={0.87}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
      <Path d="M48 212 Q82 204 132 210"/><Path d="M46 228 Q80 221 134 226"/><Path d="M45 244 Q80 238 134 242"/><Path d="M46 260 Q80 254 132 258"/><Path d="M48 274 Q80 269 128 273"/>
      </G>
      <Ellipse cx="102" cy="150" rx="26" ry="31" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={7} origin="102, 150"/>
      <Path d="M82 133 Q93 120 104 117 Q115 114 123 125" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.6}/>
      <Circle cx="110" cy="152" r="2" fill="#2C2C2A" opacity={0.35}/>
      <Rect x="97" y="178" width="8" height="10" fill="#B5593A" rx="3"/>
      <Path d="M360 316 Q338 288 336 258 Q334 230 346 203 Q358 176 378 165 Q398 154 412 164 Q426 174 428 200 Q430 226 418 260 Q406 294 390 318Z" fill="#1E3A52" opacity={0.87}/>
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
      <Path d="M338 206 Q368 199 426 204"/><Path d="M336 220 Q366 214 428 218"/><Path d="M335 234 Q365 228 428 232"/><Path d="M336 248 Q365 243 426 246"/><Path d="M337 262 Q366 257 424 260"/><Path d="M339 276 Q367 272 420 274"/>
      </G>
      <Ellipse cx="395" cy="148" rx="26" ry="31" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={-7} origin="395, 148"/>
      <Path d="M376 131 Q386 118 397 115 Q408 112 416 123" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.6}/>
      <Circle cx="385" cy="150" r="2" fill="#2C2C2A" opacity={0.35}/>
      <Rect x="390" y="176" width="8" height="10" fill="#1E3A52" rx="3"/>
      <Path d="M136 178 Q200 138 240 122 Q280 106 346 136 Q362 148 372 166" fill="none" stroke="#2C2C2A" strokeWidth="1.4" strokeLinecap="round" opacity={0.6} strokeDasharray="380"/>
      <G>
      <Path d="M240 120 Q243 108 246 98 Q248 110 245 120Z" fill="#1E3A52" opacity={0.8}/>
      <Path d="M240 120 Q237 110 234 100 Q236 112 239 120Z" fill="#1E3A52" opacity={0.56}/>
      <Line x1="240" y1="98" x2="240" y2="120" stroke="#2C2C2A" strokeWidth="0.8" opacity={0.45}/>
      <Path d="M237 108 Q230 105 229 110 Q234 112 237 108Z" fill="#1E3A52" opacity={0.4}/>
      </G>
      <Line x1="134" y1="162" x2="184" y2="138" stroke="#2C2C2A" strokeWidth="0.75" strokeDasharray="3 5" opacity={0.35}/>
      <Line x1="368" y1="160" x2="318" y2="136" stroke="#2C2C2A" strokeWidth="0.75" strokeDasharray="3 5" opacity={0.35}/>
      <SvgText x="240" y="326" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>HOME</SvgText>
    </Svg>
  );
}
