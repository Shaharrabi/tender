/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-journal
 * Component:   IllustrationF20Journal
 * Screen:      app/(app)/journal.tsx  alt version
 * Description: Journal — body with inner rings, day arc, four floating symbols, time scroll
 * ViewBox:     0 0 480 340
 *
 * USAGE:
 *   import { IllustrationF20Journal } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20Journal width={screenWidth} />
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

export function IllustrationF20Journal({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/><line x1="0" y1="294" x2="480" y2="294"/></g>

<!-- day arc: sun path -->
<path d="M50 210 Q240 56 430 210" fill="none" stroke="#C8923A" stroke-width="0.9" stroke-dasharray="5 5" opacity="0.32" style="stroke-dasharray:600;animation:unfurl 4s ease-out forwards"/>
<g style="animation:drift 5s ease-in-out infinite;transform-origin:240px 88px">
<circle cx="240" cy="88" r="6" fill="#C8923A" opacity="0.55"/>
<circle cx="240" cy="88" r="11" fill="none" stroke="#C8923A" stroke-width="0.5" opacity="0.25"/>
</g>

<!-- body: seated, deeply inward, Sofia Lind mass -->
<path d="M170 318 Q148 290 146 258 Q144 228 158 200 Q172 172 194 163 Q216 154 232 166 Q248 178 250 206 Q252 234 238 268 Q224 300 204 320Z" fill="#B5593A" opacity="0.85" style="animation:breathe 5.5s ease-in-out infinite;transform-origin:198px 242px"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round">
<path d="M150 208 Q188 200 246 206"/><path d="M148 224 Q186 217 248 222"/><path d="M147 240 Q185 234 248 238"/><path d="M148 256 Q186 250 246 254"/><path d="M150 270 Q186 265 242 268"/>
</g>
<!-- head bowed inward -->
<ellipse cx="200" cy="152" rx="28" ry="33" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(-6 200 152)"/>
<path d="M178 137 Q190 124 202 121 Q214 118 222 130" fill="none" stroke="#2C2C2A" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
<circle cx="208" cy="156" r="2" fill="#2C2C2A" opacity="0.33"/>

<!-- inner rings: tree rings / IFS layers -->
<ellipse cx="198" cy="258" rx="10" ry="13" fill="none" stroke="#C8923A" stroke-width="0.9" style="animation:pulse 2.5s ease-in-out infinite"/>
<ellipse cx="198" cy="258" rx="20" ry="26" fill="none" stroke="#C8923A" stroke-width="0.65" opacity="0.55" style="animation:pulse 2.5s ease-in-out infinite;animation-delay:-0.8s"/>
<ellipse cx="198" cy="258" rx="30" ry="39" fill="none" stroke="#8B7355" stroke-width="0.45" opacity="0.3" style="animation:pulse 2.5s ease-in-out infinite;animation-delay:-1.6s"/>
<circle cx="198" cy="258" r="3" fill="#C8923A" opacity="0.8" style="animation:pulse 2s ease-in-out infinite"/>

<!-- floating daily symbols -->
<g style="animation:float 3.8s ease-in-out infinite;transform-origin:315px 195px">
<path d="M313 195 Q316 187 319 195 Q316 203 313 195Z" fill="#7A9E8E" opacity="0.75"/>
</g>
<g style="animation:drift 5s ease-in-out infinite;transform-origin:330px 230px">
<path d="M322 230 Q328 225 334 230 Q340 235 346 230" fill="none" stroke="#7CA4B8" stroke-width="1.1" stroke-linecap="round" opacity="0.6"/>
</g>
<g style="animation:flicker 2s ease-in-out infinite;transform-origin:320px 265px">
<path d="M320 274 Q317 266 320 258 Q323 266 321 274Z" fill="#C8923A" opacity="0.68"/>
</g>
<g style="animation:float 3.5s ease-in-out infinite;animation-delay:-1s;transform-origin:318px 160px">
<path d="M315 160 Q319 154 323 160 Q319 166 315 160Z" fill="#D4909A" opacity="0.7"/>
</g>

<!-- time scroll -->
<line x1="400" y1="44" x2="400" y2="310" stroke="#D6CEBF" stroke-width="0.7" opacity="0.55"/>
<circle cx="400" cy="82" r="3" fill="#C8923A" opacity="0.7"/>
<circle cx="400" cy="136" r="3" fill="#7CA4B8" opacity="0.55"/>
<circle cx="400" cy="190" r="3" fill="#7A9E8E" opacity="0.45"/>
<circle cx="400" cy="244" r="3" fill="#B5593A" opacity="0.4"/>
<circle cx="400" cy="298" r="2.5" fill="#D6CEBF" opacity="0.5"/>
<text x="414" y="85" font-size="7.5" fill="#8B7355" opacity="0.5" font-family="Georgia,serif">today</text>
<text x="414" y="139" font-size="7.5" fill="#8B7355" opacity="0.38" font-family="Georgia,serif">yesterday</text>
<text x="414" y="193" font-size="7.5" fill="#8B7355" opacity="0.28" font-family="Georgia,serif">3 days</text>

<text x="200" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">JOURNAL</text>
</svg>
    */

    <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight} style={style}>
      <Path d="M50 210 Q240 56 430 210" fill="none" stroke="#C8923A" strokeWidth="0.9" strokeDasharray="5 5" opacity={0.32}/>
      <G>
      <Circle cx="240" cy="88" r="6" fill="#C8923A" opacity={0.55}/>
      <Circle cx="240" cy="88" r="11" fill="none" stroke="#C8923A" strokeWidth="0.5" opacity={0.25}/>
      </G>
      <Path d="M170 318 Q148 290 146 258 Q144 228 158 200 Q172 172 194 163 Q216 154 232 166 Q248 178 250 206 Q252 234 238 268 Q224 300 204 320Z" fill="#B5593A" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
      <Path d="M150 208 Q188 200 246 206"/><Path d="M148 224 Q186 217 248 222"/><Path d="M147 240 Q185 234 248 238"/><Path d="M148 256 Q186 250 246 254"/><Path d="M150 270 Q186 265 242 268"/>
      </G>
      <Ellipse cx="200" cy="152" rx="28" ry="33" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={-6} origin="200, 152"/>
      <Path d="M178 137 Q190 124 202 121 Q214 118 222 130" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.6}/>
      <Circle cx="208" cy="156" r="2" fill="#2C2C2A" opacity={0.33}/>
      <Ellipse cx="198" cy="258" rx="10" ry="13" fill="none" stroke="#C8923A" strokeWidth="0.9"/>
      <Ellipse cx="198" cy="258" rx="20" ry="26" fill="none" stroke="#C8923A" strokeWidth="0.65" opacity={0.55}/>
      <Ellipse cx="198" cy="258" rx="30" ry="39" fill="none" stroke="#8B7355" strokeWidth="0.45" opacity={0.3}/>
      <Circle cx="198" cy="258" r="3" fill="#C8923A" opacity={0.8}/>
      <G>
      <Path d="M313 195 Q316 187 319 195 Q316 203 313 195Z" fill="#7A9E8E" opacity={0.75}/>
      </G>
      <G>
      <Path d="M322 230 Q328 225 334 230 Q340 235 346 230" fill="none" stroke="#7CA4B8" strokeWidth="1.1" strokeLinecap="round" opacity={0.6}/>
      </G>
      <G>
      <Path d="M320 274 Q317 266 320 258 Q323 266 321 274Z" fill="#C8923A" opacity={0.68}/>
      </G>
      <G>
      <Path d="M315 160 Q319 154 323 160 Q319 166 315 160Z" fill="#D4909A" opacity={0.7}/>
      </G>
      <Line x1="400" y1="44" x2="400" y2="310" stroke="#D6CEBF" strokeWidth="0.7" opacity={0.55}/>
      <Circle cx="400" cy="82" r="3" fill="#C8923A" opacity={0.7}/>
      <Circle cx="400" cy="136" r="3" fill="#7CA4B8" opacity={0.55}/>
      <Circle cx="400" cy="190" r="3" fill="#7A9E8E" opacity={0.45}/>
      <Circle cx="400" cy="244" r="3" fill="#B5593A" opacity={0.4}/>
      <Circle cx="400" cy="298" r="2.5" fill="#D6CEBF" opacity={0.5}/>
      <SvgText x="414" y="85" fontSize="7.5" fill="#8B7355" opacity={0.5} fontFamily="Georgia,serif">today</SvgText>
      <SvgText x="414" y="139" fontSize="7.5" fill="#8B7355" opacity={0.38} fontFamily="Georgia,serif">yesterday</SvgText>
      <SvgText x="414" y="193" fontSize="7.5" fill="#8B7355" opacity={0.28} fontFamily="Georgia,serif">3 days</SvgText>
      <SvgText x="200" y="326" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>JOURNAL</SvgText>
    </Svg>
  );
}
