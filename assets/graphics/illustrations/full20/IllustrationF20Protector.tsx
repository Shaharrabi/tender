/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-protector
 * Component:   IllustrationF20Protector
 * Screen:      microcourse IFS protector+exile lesson
 * Description: Protector+Exile — large shielding body, small exile behind, Self approaching
 * ViewBox:     0 0 480 300
 *
 * USAGE:
 *   import { IllustrationF20Protector } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20Protector width={screenWidth} />
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

export function IllustrationF20Protector({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (300 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/></g>

<!-- two bodies back to back but leaning slightly in — they are here, acknowledging -->
<path d="M104 276 Q82 252 80 222 Q78 194 90 170 Q102 146 120 138 Q138 130 150 142 Q162 154 164 178 Q166 202 152 232 Q138 262 120 280Z" fill="#B5593A" opacity="0.82" style="animation:breathe 5s ease-in-out infinite;transform-origin:122px 210px"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round">
<path d="M82 180 Q116 174 162 178"/><path d="M80 196 Q115 190 163 194"/><path d="M80 212 Q115 207 162 210"/>
</g>
<ellipse cx="120" cy="126" rx="22" ry="26" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(6 120 126)"/>
<path d="M103 113 Q113 101 122 98 Q131 96 136 105" fill="none" stroke="#2C2C2A" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
<!-- head bowed -->
<path d="M113 130 Q120 134 127 130" fill="none" stroke="#2C2C2A" stroke-width="0.7" opacity="0.38"/>

<path d="M296 276 Q318 252 320 222 Q322 194 310 170 Q298 146 280 138 Q262 130 250 142 Q238 154 236 178 Q234 202 248 232 Q262 262 280 280Z" fill="#1E3A52" opacity="0.82" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:278px 210px"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round">
<path d="M238 176 Q264 170 318 174"/><path d="M236 192 Q263 186 320 190"/><path d="M236 208 Q263 203 319 206"/>
</g>
<ellipse cx="280" cy="126" rx="22" ry="26" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(-6 280 126)"/>
<path d="M263 113 Q273 101 282 98 Q291 96 298 105" fill="none" stroke="#2C2C2A" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
<path d="M272 130 Q280 134 286 130" fill="none" stroke="#2C2C2A" stroke-width="0.7" opacity="0.38"/>

<!-- gap between them: the honest space -->
<path d="M164 186 Q200 182 236 186" fill="none" stroke="#D6CEBF" stroke-width="1.2" opacity="0.5" stroke-dasharray="2 4"/>
<!-- small text in the gap -->
<text x="200" y="196" text-anchor="middle" font-size="7.5" fill="#8B7355" opacity="0.45" font-family="Georgia,serif">the honest breath</text>

<!-- step number -->
<text x="396" y="64" text-anchor="middle" font-family="Georgia,serif" font-size="42" fill="#B5593A" opacity="0.12">1</text>
<text x="396" y="84" text-anchor="middle" font-size="9" letter-spacing="2" fill="#B5593A" opacity="0.5" font-family="Georgia,serif">acknowledge</text>

<text x="240" y="290" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">STEP 1 · THE STRAIN</text>
</svg>
    */

    <Svg viewBox="0 0 480 300" width={width} height={resolvedHeight} style={style}>
      <Path d="M104 276 Q82 252 80 222 Q78 194 90 170 Q102 146 120 138 Q138 130 150 142 Q162 154 164 178 Q166 202 152 232 Q138 262 120 280Z" fill="#B5593A" opacity={0.82}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
      <Path d="M82 180 Q116 174 162 178"/><Path d="M80 196 Q115 190 163 194"/><Path d="M80 212 Q115 207 162 210"/>
      </G>
      <Ellipse cx="120" cy="126" rx="22" ry="26" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={6} origin="120, 126"/>
      <Path d="M103 113 Q113 101 122 98 Q131 96 136 105" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.6}/>
      <Path d="M113 130 Q120 134 127 130" fill="none" stroke="#2C2C2A" strokeWidth="0.7" opacity={0.38}/>
      <Path d="M296 276 Q318 252 320 222 Q322 194 310 170 Q298 146 280 138 Q262 130 250 142 Q238 154 236 178 Q234 202 248 232 Q262 262 280 280Z" fill="#1E3A52" opacity={0.82}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
      <Path d="M238 176 Q264 170 318 174"/><Path d="M236 192 Q263 186 320 190"/><Path d="M236 208 Q263 203 319 206"/>
      </G>
      <Ellipse cx="280" cy="126" rx="22" ry="26" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={-6} origin="280, 126"/>
      <Path d="M263 113 Q273 101 282 98 Q291 96 298 105" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.6}/>
      <Path d="M272 130 Q280 134 286 130" fill="none" stroke="#2C2C2A" strokeWidth="0.7" opacity={0.38}/>
      <Path d="M164 186 Q200 182 236 186" fill="none" stroke="#D6CEBF" strokeWidth="1.2" opacity={0.5} strokeDasharray="2 4"/>
      <SvgText x="200" y="196" textAnchor="middle" fontSize="7.5" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">the honest breath</SvgText>
      <SvgText x="396" y="64" textAnchor="middle" fontFamily="Georgia,serif" fontSize="42" fill="#B5593A" opacity={0.12}>1</SvgText>
      <SvgText x="396" y="84" textAnchor="middle" fontSize="9" letterSpacing="2" fill="#B5593A" opacity={0.5} fontFamily="Georgia,serif">acknowledge</SvgText>
      <SvgText x="240" y="290" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>{"STEP 1 \u00B7 THE STRAIN"}</SvgText>
    </Svg>
  );
}
