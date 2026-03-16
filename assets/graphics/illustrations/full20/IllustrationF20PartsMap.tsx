/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-parts-map
 * Component:   IllustrationF20PartsMap
 * Screen:      microcourse IFS parts map opening slide
 * Description: IFS parts map — Self body with orbit ring, parts orbiting with labels
 * ViewBox:     0 0 480 340
 *
 * USAGE:
 *   import { IllustrationF20PartsMap } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20PartsMap width={screenWidth} />
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

export function IllustrationF20PartsMap({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/><line x1="0" y1="294" x2="480" y2="294"/></g>

<!-- PROTECTOR: large, round, navy, shielding — fills most of left -->
<path d="M60 320 Q30 284 28 244 Q26 206 42 170 Q58 134 86 118 Q114 102 136 116 Q158 130 162 164 Q166 198 150 240 Q134 282 108 322Z" fill="#1E3A52" opacity="0.85" style="animation:breathe 5.5s ease-in-out infinite;transform-origin:96px 212px"/>
<g opacity="0.22" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round">
<path d="M30 180 Q76 172 158 178"/><path d="M28 196 Q75 189 160 194"/><path d="M28 212 Q75 206 160 210"/><path d="M29 228 Q75 222 158 226"/><path d="M30 244 Q75 238 155 242"/>
</g>
<ellipse cx="96" cy="104" rx="28" ry="32" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(-3 96 104)"/>
<path d="M74 90 Q86 77 98 74 Q110 71 118 82" fill="none" stroke="#2C2C2A" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
<!-- arms shielding/extended -->

<!-- EXILE: small, curled, terracotta, nestled behind protector -->
<path d="M168 282 Q158 262 160 242 Q162 224 172 216 Q182 208 190 218 Q198 228 196 248 Q194 268 184 284Z" fill="#B5593A" opacity="0.82" style="animation:breathe 4s ease-in-out infinite;animation-delay:-2s;transform-origin:178px 250px"/>
<ellipse cx="178" cy="208" rx="14" ry="17" fill="none" stroke="#2C2C2A" stroke-width="0.9"/>
<!-- exile: small warm glow -->
<circle cx="178" cy="248" r="14" fill="none" stroke="#C8923A" stroke-width="0.5" opacity="0.4" style="animation:pulse 2.5s ease-in-out infinite"/>

<!-- SELF approaching from right: terracotta + stripes, open -->
<path d="M308 306 Q288 280 286 250 Q284 222 296 198 Q308 174 326 166 Q344 158 356 170 Q368 182 370 208 Q372 234 358 266 Q344 298 326 312Z" fill="#B5593A" opacity="0.82" style="animation:breathe 5s ease-in-out infinite;animation-delay:-1s;transform-origin:328px 238px"/>
<g opacity="0.18" stroke="#1E3A52" stroke-width="2.5" stroke-linecap="round">
<path d="M288 208 Q318 202 368 206"/><path d="M286 224 Q317 218 369 222"/>
</g>
<ellipse cx="328" cy="154" rx="22" ry="26" fill="none" stroke="#2C2C2A" stroke-width="1" transform="rotate(4 328 154)"/>
<!-- Self arm reaching toward protector with curiosity, not force -->
<!-- dialogue dot -->
<circle cx="210" cy="226" r="5" fill="#C8923A" opacity="0.55" style="animation:pulse 2.5s ease-in-out infinite"/>

<!-- right side annotation -->
<text x="390" y="168" font-size="8" fill="#8B7355" opacity="0.55" font-family="Georgia,serif">Self</text>
<text x="390" y="182" font-size="8" fill="#8B7355" opacity="0.4" font-family="Georgia,serif">curious</text>
<line x1="386" y1="176" x2="352" y2="190" stroke="#8B7355" stroke-width="0.5" opacity="0.3"/>
<text x="390" y="228" font-size="8" fill="#1E3A52" opacity="0.5" font-family="Georgia,serif">protector</text>
<text x="390" y="258" font-size="8" fill="#B5593A" opacity="0.5" font-family="Georgia,serif">exile</text>

<text x="240" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">PROTECTOR & EXILE</text>
</svg>
    */

    <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight} style={style}>
      <Path d="M60 320 Q30 284 28 244 Q26 206 42 170 Q58 134 86 118 Q114 102 136 116 Q158 130 162 164 Q166 198 150 240 Q134 282 108 322Z" fill="#1E3A52" opacity={0.85}/>
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
      <Path d="M30 180 Q76 172 158 178"/><Path d="M28 196 Q75 189 160 194"/><Path d="M28 212 Q75 206 160 210"/><Path d="M29 228 Q75 222 158 226"/><Path d="M30 244 Q75 238 155 242"/>
      </G>
      <Ellipse cx="96" cy="104" rx="28" ry="32" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={-3} origin="96, 104"/>
      <Path d="M74 90 Q86 77 98 74 Q110 71 118 82" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.6}/>
      <Path d="M168 282 Q158 262 160 242 Q162 224 172 216 Q182 208 190 218 Q198 228 196 248 Q194 268 184 284Z" fill="#B5593A" opacity={0.82}/>
      <Ellipse cx="178" cy="208" rx="14" ry="17" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      <Circle cx="178" cy="248" r="14" fill="none" stroke="#C8923A" strokeWidth="0.5" opacity={0.4}/>
      <Path d="M308 306 Q288 280 286 250 Q284 222 296 198 Q308 174 326 166 Q344 158 356 170 Q368 182 370 208 Q372 234 358 266 Q344 298 326 312Z" fill="#B5593A" opacity={0.82}/>
      <G opacity={0.18} stroke="#1E3A52" strokeWidth="2.5" strokeLinecap="round">
      <Path d="M288 208 Q318 202 368 206"/><Path d="M286 224 Q317 218 369 222"/>
      </G>
      <Ellipse cx="328" cy="154" rx="22" ry="26" fill="none" stroke="#2C2C2A" strokeWidth="1" rotation={4} origin="328, 154"/>
      <Circle cx="210" cy="226" r="5" fill="#C8923A" opacity={0.55}/>
      <SvgText x="390" y="168" fontSize="8" fill="#8B7355" opacity={0.55} fontFamily="Georgia,serif">Self</SvgText>
      <SvgText x="390" y="182" fontSize="8" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">curious</SvgText>
      <Line x1="386" y1="176" x2="352" y2="190" stroke="#8B7355" strokeWidth="0.5" opacity={0.3}/>
      <SvgText x="390" y="228" fontSize="8" fill="#1E3A52" opacity={0.5} fontFamily="Georgia,serif">protector</SvgText>
      <SvgText x="390" y="258" fontSize="8" fill="#B5593A" opacity={0.5} fontFamily="Georgia,serif">exile</SvgText>
      <SvgText x="240" y="326" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>PROTECTOR & EXILE</SvgText>
    </Svg>
  );
}
