/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-step1
 * Component:   IllustrationF20Step01
 * Screen:      app/(app)/step-detail.tsx  stepNumber === 1  (alt)
 * Description: Step 1 full-size — two bowed bodies back-to-back, honest strain
 * ViewBox:     0 0 480 300
 *
 * USAGE:
 *   import { IllustrationF20Step01 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20Step01 width={screenWidth} />
 *
 * CONVERSION NOTES (Claude Code — do these in order):
 *   1. Replace <svg>       →  <Svg viewBox="0 0 480 300" width={width} height={resolvedHeight}>
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

export function IllustrationF20Step01({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (300 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/></g>

<!-- the garden: open field between two bodies tending something together -->
<!-- field lines — alive -->
<g opacity="0.2">
<path d="M0 222 Q80 208 160 218 Q240 228 320 214 Q400 200 480 206" fill="none" stroke="#7CA4B8" stroke-width="1.5" stroke-linecap="round"/>
<path d="M0 236 Q80 224 162 232 Q244 240 322 228 Q402 216 480 220" fill="none" stroke="#7CA4B8" stroke-width="1.1" stroke-linecap="round"/>
<path d="M0 250 Q80 240 162 246 Q244 252 322 242 Q402 232 480 235" fill="none" stroke="#7CA4B8" stroke-width="0.7" stroke-linecap="round" opacity="0.65"/>
</g>

<!-- left body tending -->
<path d="M92 270 Q72 246 70 218 Q68 192 80 170 Q92 148 110 141 Q128 134 140 146 Q152 158 154 182 Q156 206 142 234 Q128 262 110 274Z" fill="#B5593A" opacity="0.85" style="animation:breathe 5s ease-in-out infinite;transform-origin:112px 207px"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M72 178 Q104 172 152 176"/><path d="M70 194 Q103 188 153 192"/><path d="M70 210 Q103 205 152 208"/></g>
<ellipse cx="110" cy="130" rx="22" ry="26" fill="none" stroke="#2C2C2A" stroke-width="1.1"/>
<!-- arm tending the field: reaching down into the garden -->

<!-- right body tending -->
<path d="M388 270 Q408 246 410 218 Q412 192 400 170 Q388 148 370 141 Q352 134 340 146 Q328 158 326 182 Q324 206 338 234 Q352 262 370 274Z" fill="#1E3A52" opacity="0.85" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:368px 207px"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M328 178 Q356 172 408 176"/><path d="M326 194 Q355 188 410 192"/><path d="M327 210 Q355 205 409 208"/></g>
<ellipse cx="370" cy="130" rx="22" ry="26" fill="none" stroke="#2C2C2A" stroke-width="1.1"/>

<!-- the garden itself: center, alive, amber glow -->
<g style="animation:glow 3s ease-in-out infinite;transform-origin:240px 228px">
<ellipse cx="240" cy="228" rx="48" ry="26" fill="#C8923A" opacity="0.12"/>
</g>
<path d="M200 228 Q220 218 240 222 Q260 218 280 228" fill="none" stroke="#C8923A" stroke-width="0.9" opacity="0.45" style="animation:pulse 3s ease-in-out infinite"/>
<!-- small seedling in the garden -->
<g style="animation:float 3.5s ease-in-out infinite;transform-origin:240px 208px">
<line x1="240" y1="228" x2="240" y2="204" stroke="#2C2C2A" stroke-width="0.9" opacity="0.4"/>
<path d="M240 204 Q243 196 246 204 Q243 212 240 204Z" fill="#7A9E8E" opacity="0.72"/>
</g>

<text x="396" y="64" text-anchor="middle" font-family="Georgia,serif" font-size="42" fill="#1E3A52" opacity="0.1">2</text>
<text x="396" y="84" text-anchor="middle" font-size="9" letter-spacing="2" fill="#1E3A52" opacity="0.45" font-family="Georgia,serif">trust the field</text>
<text x="240" y="290" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">STEP 2 · THE RELATIONAL FIELD</text>
</svg>
    */

    <Svg viewBox="0 0 480 300" width={width} height={resolvedHeight} style={style}>
      <G opacity={0.2}>
      <Path d="M0 222 Q80 208 160 218 Q240 228 320 214 Q400 200 480 206" fill="none" stroke="#7CA4B8" strokeWidth="1.5" strokeLinecap="round"/>
      <Path d="M0 236 Q80 224 162 232 Q244 240 322 228 Q402 216 480 220" fill="none" stroke="#7CA4B8" strokeWidth="1.1" strokeLinecap="round"/>
      <Path d="M0 250 Q80 240 162 246 Q244 252 322 242 Q402 232 480 235" fill="none" stroke="#7CA4B8" strokeWidth="0.7" strokeLinecap="round" opacity={0.65}/>
      </G>
      <Path d="M92 270 Q72 246 70 218 Q68 192 80 170 Q92 148 110 141 Q128 134 140 146 Q152 158 154 182 Q156 206 142 234 Q128 262 110 274Z" fill="#B5593A" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round"><Path d="M72 178 Q104 172 152 176"/><Path d="M70 194 Q103 188 153 192"/><Path d="M70 210 Q103 205 152 208"/></G>
      <Ellipse cx="110" cy="130" rx="22" ry="26" fill="none" stroke="#2C2C2A" strokeWidth="1.1"/>
      <Path d="M388 270 Q408 246 410 218 Q412 192 400 170 Q388 148 370 141 Q352 134 340 146 Q328 158 326 182 Q324 206 338 234 Q352 262 370 274Z" fill="#1E3A52" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round"><Path d="M328 178 Q356 172 408 176"/><Path d="M326 194 Q355 188 410 192"/><Path d="M327 210 Q355 205 409 208"/></G>
      <Ellipse cx="370" cy="130" rx="22" ry="26" fill="none" stroke="#2C2C2A" strokeWidth="1.1"/>
      <G>
      <Ellipse cx="240" cy="228" rx="48" ry="26" fill="#C8923A" opacity={0.12}/>
      </G>
      <Path d="M200 228 Q220 218 240 222 Q260 218 280 228" fill="none" stroke="#C8923A" strokeWidth="0.9" opacity={0.45}/>
      <G>
      <Line x1="240" y1="228" x2="240" y2="204" stroke="#2C2C2A" strokeWidth="0.9" opacity={0.4}/>
      <Path d="M240 204 Q243 196 246 204 Q243 212 240 204Z" fill="#7A9E8E" opacity={0.72}/>
      </G>
      <SvgText x="396" y="64" textAnchor="middle" fontFamily="Georgia,serif" fontSize="42" fill="#1E3A52" opacity={0.1}>2</SvgText>
      <SvgText x="396" y="84" textAnchor="middle" fontSize="9" letterSpacing="2" fill="#1E3A52" opacity={0.45} fontFamily="Georgia,serif">trust the field</SvgText>
      <SvgText x="240" y="290" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>{"STEP 2 \u00B7 THE RELATIONAL FIELD"}</SvgText>
    </Svg>
  );
}
