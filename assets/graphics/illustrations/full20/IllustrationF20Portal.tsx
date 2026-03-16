/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-portal
 * Component:   IllustrationF20Portal
 * Screen:      app/(app)/couple-portal.tsx  full-size version
 * Description: Couple portal — twin orbs + vesica + WEARE score bars on right
 * ViewBox:     0 0 480 340
 *
 * USAGE:
 *   import { IllustrationF20Portal } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20Portal width={screenWidth} />
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

export function IllustrationF20Portal({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/><line x1="0" y1="294" x2="480" y2="294"/><line x1="0" y1="312" x2="480" y2="312"/></g>

<!-- Three zones -->
<rect x="30" y="28" width="290" height="62" rx="4" fill="#B5593A" opacity="0.06"/>
<rect x="30" y="120" width="290" height="100" rx="4" fill="#7A9E8E" opacity="0.08"/>
<rect x="30" y="250" width="290" height="62" rx="4" fill="#1E3A52" opacity="0.05"/>

<!-- zone labels -->
<text x="42" y="52" font-size="9" fill="#B5593A" opacity="0.65" font-family="Georgia,serif" letter-spacing="1">above the window</text>
<text x="42" y="64" font-size="8" fill="#B5593A" opacity="0.45" font-family="-apple-system,sans-serif">fight · flight · hyperarousal · alarm</text>
<text x="42" y="138" font-size="9" fill="#2E5040" opacity="0.65" font-family="Georgia,serif" letter-spacing="1">window of tolerance</text>
<text x="42" y="150" font-size="8" fill="#2E5040" opacity="0.45" font-family="-apple-system,sans-serif">present · connected · able to feel and think</text>
<text x="42" y="264" font-size="9" fill="#1E3A52" opacity="0.55" font-family="Georgia,serif" letter-spacing="1">below the window</text>
<text x="42" y="276" font-size="8" fill="#1E3A52" opacity="0.4" font-family="-apple-system,sans-serif">freeze · collapse · hypoarousal · numb</text>

<!-- window boundary lines -->
<line x1="30" y1="120" x2="320" y2="120" stroke="#7A9E8E" stroke-width="1.2" opacity="0.55"/>
<line x1="30" y1="220" x2="320" y2="220" stroke="#7A9E8E" stroke-width="1.2" opacity="0.55"/>

<!-- THREE BODIES: each in its zone -->
<!-- hyper body: rigid, leaning back, flame above -->
<path d="M356 82 Q344 66 346 50 Q348 36 356 30 Q364 24 370 34 Q376 44 372 60 Q368 76 362 86Z" fill="#B5593A" opacity="0.82" style="animation:rise 2s ease-in-out infinite;transform-origin:360px 57px"/>
<ellipse cx="358" cy="24" rx="12" ry="14" fill="none" stroke="#2C2C2A" stroke-width="0.9"/>
<g style="animation:flicker 1.5s ease-in-out infinite;transform-origin:390px 44px">
<path d="M390 62 Q386 50 390 40 Q394 50 392 62Z" fill="#C8923A" opacity="0.8"/>
</g>
<!-- regulated body: calm, open, breathe rings -->
<path d="M356 202 Q344 182 346 162 Q348 144 358 137 Q368 130 374 142 Q380 154 376 174 Q372 194 364 206Z" fill="#B5593A" opacity="0.85" style="animation:breathe 5s ease-in-out infinite;transform-origin:362px 170px"/>
<ellipse cx="358" cy="130" rx="13" ry="15" fill="none" stroke="#2C2C2A" stroke-width="0.9"/>
<ellipse cx="400" cy="170" rx="10" ry="13" fill="none" stroke="#7CA4B8" stroke-width="0.6" style="animation:pulse 2.5s ease-in-out infinite"/>
<ellipse cx="400" cy="170" rx="18" ry="22" fill="none" stroke="#7CA4B8" stroke-width="0.4" opacity="0.35"/>
<!-- hypo body: collapsed, heavy, barely moving -->
<path d="M354 306 Q342 290 344 272 Q346 256 356 250 Q366 244 372 256 Q378 268 374 286 Q370 304 362 310Z" fill="#1E3A52" opacity="0.78" transform="rotate(12 360 278)"/>
<ellipse cx="354" cy="243" rx="12" ry="14" fill="none" stroke="#2C2C2A" stroke-width="0.85"/>
<!-- drooped head indicator -->
<path d="M348 250 Q354 254 360 250" fill="none" stroke="#2C2C2A" stroke-width="0.7" opacity="0.35"/>

<text x="240" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">WINDOW OF TOLERANCE</text>
</svg>
    */

    <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight} style={style}>
      <Rect x="30" y="28" width="290" height="62" rx="4" fill="#B5593A" opacity={0.06}/>
      <Rect x="30" y="120" width="290" height="100" rx="4" fill="#7A9E8E" opacity={0.08}/>
      <Rect x="30" y="250" width="290" height="62" rx="4" fill="#1E3A52" opacity={0.05}/>
      <SvgText x="42" y="52" fontSize="9" fill="#B5593A" opacity={0.65} fontFamily="Georgia,serif" letterSpacing="1">above the window</SvgText>
      <SvgText x="42" y="64" fontSize="8" fill="#B5593A" opacity={0.45} fontFamily="-apple-system,sans-serif">{"fight \u00B7 flight \u00B7 hyperarousal \u00B7 alarm"}</SvgText>
      <SvgText x="42" y="138" fontSize="9" fill="#2E5040" opacity={0.65} fontFamily="Georgia,serif" letterSpacing="1">window of tolerance</SvgText>
      <SvgText x="42" y="150" fontSize="8" fill="#2E5040" opacity={0.45} fontFamily="-apple-system,sans-serif">{"present \u00B7 connected \u00B7 able to feel and think"}</SvgText>
      <SvgText x="42" y="264" fontSize="9" fill="#1E3A52" opacity={0.55} fontFamily="Georgia,serif" letterSpacing="1">below the window</SvgText>
      <SvgText x="42" y="276" fontSize="8" fill="#1E3A52" opacity={0.4} fontFamily="-apple-system,sans-serif">{"freeze \u00B7 collapse \u00B7 hypoarousal \u00B7 numb"}</SvgText>
      <Line x1="30" y1="120" x2="320" y2="120" stroke="#7A9E8E" strokeWidth="1.2" opacity={0.55}/>
      <Line x1="30" y1="220" x2="320" y2="220" stroke="#7A9E8E" strokeWidth="1.2" opacity={0.55}/>
      <Path d="M356 82 Q344 66 346 50 Q348 36 356 30 Q364 24 370 34 Q376 44 372 60 Q368 76 362 86Z" fill="#B5593A" opacity={0.82}/>
      <Ellipse cx="358" cy="24" rx="12" ry="14" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      <G>
      <Path d="M390 62 Q386 50 390 40 Q394 50 392 62Z" fill="#C8923A" opacity={0.8}/>
      </G>
      <Path d="M356 202 Q344 182 346 162 Q348 144 358 137 Q368 130 374 142 Q380 154 376 174 Q372 194 364 206Z" fill="#B5593A" opacity={0.85}/>
      <Ellipse cx="358" cy="130" rx="13" ry="15" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      <Ellipse cx="400" cy="170" rx="10" ry="13" fill="none" stroke="#7CA4B8" strokeWidth="0.6"/>
      <Ellipse cx="400" cy="170" rx="18" ry="22" fill="none" stroke="#7CA4B8" strokeWidth="0.4" opacity={0.35}/>
      <Path d="M354 306 Q342 290 344 272 Q346 256 356 250 Q366 244 372 256 Q378 268 374 286 Q370 304 362 310Z" fill="#1E3A52" opacity={0.78} rotation={12} origin="360, 278"/>
      <Ellipse cx="354" cy="243" rx="12" ry="14" fill="none" stroke="#2C2C2A" strokeWidth="0.85"/>
      <Path d="M348 250 Q354 254 360 250" fill="none" stroke="#2C2C2A" strokeWidth="0.7" opacity={0.35}/>
      <SvgText x="240" y="326" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>WINDOW OF TOLERANCE</SvgText>
    </Svg>
  );
}
