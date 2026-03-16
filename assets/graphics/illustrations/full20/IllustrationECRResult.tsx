/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-ecr-result
 * Component:   IllustrationECRResult
 * Screen:      app/(app)/results.tsx  →  attachment result (DYNAMIC dot)
 * Description: ECR-R 4-quadrant result — DYNAMIC: user dot animates to score position
 * ViewBox:     0 0 480 300
 *
 * USAGE:
 *   import { IllustrationECRResult } from '@/assets/graphics/illustrations/index';
 *   <IllustrationECRResult width={screenWidth} />
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

export function IllustrationECRResult({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (300 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/></g>

<!-- two orbs + vesica: WEARE visualization -->
<circle cx="168" cy="130" r="54" fill="none" stroke="#B5593A" stroke-width="0.6" opacity="0.22" style="animation:breathe 5s ease-in-out infinite"/>
<circle cx="168" cy="130" r="40" fill="#B5593A" opacity="0.08" style="animation:breathe 5s ease-in-out infinite;animation-delay:-1s"/>
<circle cx="268" cy="130" r="54" fill="none" stroke="#1E3A52" stroke-width="0.6" opacity="0.22" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s"/>
<circle cx="268" cy="130" r="40" fill="#1E3A52" opacity="0.06" style="animation:breathe 5s ease-in-out infinite;animation-delay:-3.5s"/>
<!-- vesica center -->
<path d="M218 76 Q242 100 242 130 Q242 160 218 184 Q194 160 194 130 Q194 100 218 76Z" fill="#C8923A" opacity="0.11" style="animation:glow 4s ease-in-out infinite"/>
<path d="M218 76 Q242 100 242 130 Q242 160 218 184 Q194 160 194 130 Q194 100 218 76Z" fill="none" stroke="#C8923A" stroke-width="0.8" opacity="0.4" style="animation:pulse 3s ease-in-out infinite"/>
<!-- space score text -->
<text x="218" y="126" text-anchor="middle" font-size="9" fill="#C8923A" opacity="0.7" font-family="Georgia,serif">the space</text>
<text x="218" y="140" text-anchor="middle" font-size="9" fill="#C8923A" opacity="0.7" font-family="Georgia,serif">between you</text>
<text x="218" y="156" text-anchor="middle" font-size="20" fill="#C8923A" opacity="0.6" font-family="Georgia,serif">72</text>

<!-- WEARE variable bars -->
<g opacity="0.65">
<text x="360" y="72" font-size="7.5" fill="#8B7355" font-family="Georgia,serif" letter-spacing="0.8">sensing what is here</text>
<rect x="360" y="78" width="88" height="2.5" rx="1.2" fill="#D6CEBF"/>
<rect x="360" y="78" width="66" height="2.5" rx="1.2" fill="#C8923A" opacity="0.7"/>
<text x="360" y="96" font-size="7.5" fill="#8B7355" font-family="Georgia,serif" letter-spacing="0.8">creating together</text>
<rect x="360" y="102" width="88" height="2.5" rx="1.2" fill="#D6CEBF"/>
<rect x="360" y="102" width="54" height="2.5" rx="1.2" fill="#7A9E8E" opacity="0.7"/>
<text x="360" y="120" font-size="7.5" fill="#8B7355" font-family="Georgia,serif" letter-spacing="0.8">turning understanding into living</text>
<rect x="360" y="126" width="88" height="2.5" rx="1.2" fill="#D6CEBF"/>
<rect x="360" y="126" width="42" height="2.5" rx="1.2" fill="#B5593A" opacity="0.65"/>
<text x="360" y="144" font-size="7.5" fill="#8B7355" font-family="Georgia,serif" letter-spacing="0.8">the openness between you</text>
<rect x="360" y="150" width="88" height="2.5" rx="1.2" fill="#D6CEBF"/>
<rect x="360" y="150" width="72" height="2.5" rx="1.2" fill="#1E3A52" opacity="0.65"/>
<text x="360" y="168" font-size="7.5" fill="#8B7355" font-family="Georgia,serif" letter-spacing="0.8">willingness to be changed</text>
<rect x="360" y="174" width="88" height="2.5" rx="1.2" fill="#D6CEBF"/>
<rect x="360" y="174" width="60" height="2.5" rx="1.2" fill="#7CA4B8" opacity="0.65"/>
</g>

<!-- direction arrow: emergence -->
<g style="animation:float 3s ease-in-out infinite;transform-origin:218px 218px">
<line x1="218" y1="228" x2="218" y2="206" stroke="#C8923A" stroke-width="1.2" opacity="0.6"/>
<path d="M214 210 L218 204 L222 210" fill="none" stroke="#C8923A" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
<text x="218" y="244" text-anchor="middle" font-size="8" fill="#C8923A" opacity="0.5" font-family="Georgia,serif">moving</text>
</g>

<text x="100" y="288" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="3" fill="#2C2C2A" opacity="0.45">WEARE REPORT</text>
</svg>
    */

    <Svg viewBox="0 0 480 300" width={width} height={resolvedHeight} style={style}>
      <Circle cx="168" cy="130" r="54" fill="none" stroke="#B5593A" strokeWidth="0.6" opacity={0.22}/>
      <Circle cx="168" cy="130" r="40" fill="#B5593A" opacity={0.08}/>
      <Circle cx="268" cy="130" r="54" fill="none" stroke="#1E3A52" strokeWidth="0.6" opacity={0.22}/>
      <Circle cx="268" cy="130" r="40" fill="#1E3A52" opacity={0.06}/>
      <Path d="M218 76 Q242 100 242 130 Q242 160 218 184 Q194 160 194 130 Q194 100 218 76Z" fill="#C8923A" opacity={0.11}/>
      <Path d="M218 76 Q242 100 242 130 Q242 160 218 184 Q194 160 194 130 Q194 100 218 76Z" fill="none" stroke="#C8923A" strokeWidth="0.8" opacity={0.4}/>
      <SvgText x="218" y="126" textAnchor="middle" fontSize="9" fill="#C8923A" opacity={0.7} fontFamily="Georgia,serif">the space</SvgText>
      <SvgText x="218" y="140" textAnchor="middle" fontSize="9" fill="#C8923A" opacity={0.7} fontFamily="Georgia,serif">between you</SvgText>
      <SvgText x="218" y="156" textAnchor="middle" fontSize="20" fill="#C8923A" opacity={0.6} fontFamily="Georgia,serif">72</SvgText>
      <G opacity={0.65}>
      <SvgText x="360" y="72" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing="0.8">sensing what is here</SvgText>
      <Rect x="360" y="78" width="88" height="2.5" rx="1.2" fill="#D6CEBF"/>
      <Rect x="360" y="78" width="66" height="2.5" rx="1.2" fill="#C8923A" opacity={0.7}/>
      <SvgText x="360" y="96" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing="0.8">creating together</SvgText>
      <Rect x="360" y="102" width="88" height="2.5" rx="1.2" fill="#D6CEBF"/>
      <Rect x="360" y="102" width="54" height="2.5" rx="1.2" fill="#7A9E8E" opacity={0.7}/>
      <SvgText x="360" y="120" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing="0.8">turning understanding into living</SvgText>
      <Rect x="360" y="126" width="88" height="2.5" rx="1.2" fill="#D6CEBF"/>
      <Rect x="360" y="126" width="42" height="2.5" rx="1.2" fill="#B5593A" opacity={0.65}/>
      <SvgText x="360" y="144" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing="0.8">the openness between you</SvgText>
      <Rect x="360" y="150" width="88" height="2.5" rx="1.2" fill="#D6CEBF"/>
      <Rect x="360" y="150" width="72" height="2.5" rx="1.2" fill="#1E3A52" opacity={0.65}/>
      <SvgText x="360" y="168" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing="0.8">willingness to be changed</SvgText>
      <Rect x="360" y="174" width="88" height="2.5" rx="1.2" fill="#D6CEBF"/>
      <Rect x="360" y="174" width="60" height="2.5" rx="1.2" fill="#7CA4B8" opacity={0.65}/>
      </G>
      <G>
      <Line x1="218" y1="228" x2="218" y2="206" stroke="#C8923A" strokeWidth="1.2" opacity={0.6}/>
      <Path d="M214 210 L218 204 L222 210" fill="none" stroke="#C8923A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity={0.6}/>
      <SvgText x="218" y="244" textAnchor="middle" fontSize="8" fill="#C8923A" opacity={0.5} fontFamily="Georgia,serif">moving</SvgText>
      </G>
      <SvgText x="100" y="288" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="3" fill="#2C2C2A" opacity={0.45}>WEARE REPORT</SvgText>
    </Svg>
  );
}
