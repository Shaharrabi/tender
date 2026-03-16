/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-step2
 * Component:   IllustrationF20Step02
 * Screen:      app/(app)/step-detail.tsx  stepNumber === 2  (alt)
 * Description: Step 2 full-size — two bodies tending garden, seedling in golden center
 * ViewBox:     0 0 480 300
 *
 * USAGE:
 *   import { IllustrationF20Step02 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20Step02 width={screenWidth} />
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

export function IllustrationF20Step02({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (300 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/></g>

<!-- STEP 5: SHARE OUR TRUTHS -->
<!-- body: rigid outer shell (armor rect) dissolving, soft inner emerging -->
<rect x="96" y="130" width="96" height="136" rx="12" fill="none" stroke="#8B7355" stroke-width="0.7" opacity="0.25" stroke-dasharray="4 5"/>
<!-- soft inner body opening: moving toward navy figure -->
<path d="M106 270 Q88 248 86 220 Q84 194 96 172 Q108 150 124 144 Q140 138 152 150 Q164 162 166 186 Q168 210 154 238 Q140 266 122 274Z" fill="#B5593A" opacity="0.84" style="animation:breathe 5s ease-in-out infinite;transform-origin:126px 209px"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M88 180 Q120 174 164 178"/><path d="M87 196 Q120 190 165 194"/></g>
<ellipse cx="122" cy="134" rx="22" ry="26" fill="none" stroke="#2C2C2A" stroke-width="1.1"/>
<!-- vulnerability symbol: heart emerging from chest -->
<g style="animation:pulse 2s ease-in-out infinite;transform-origin:166px 186px">
<path d="M163 186 Q168 178 174 186 Q168 194 163 186Z" fill="#D4909A" opacity="0.8"/>
</g>

<!-- receiving figure: navy, open, witness -->
<path d="M320 270 Q342 246 344 216 Q346 188 334 164 Q322 140 304 133 Q286 126 274 138 Q262 150 260 176 Q258 202 272 232 Q286 262 304 274Z" fill="#1E3A52" opacity="0.85" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:302px 200px"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M262 172 Q288 166 342 170"/><path d="M260 188 Q287 182 343 186"/><path d="M260 204 Q287 199 342 202"/></g>
<ellipse cx="302" cy="122" rx="22" ry="26" fill="none" stroke="#2C2C2A" stroke-width="1.1"/>
<!-- receiving arm: open, not solving -->

<text x="396" y="64" text-anchor="middle" font-family="Georgia,serif" font-size="42" fill="#D4909A" opacity="0.12">5</text>
<text x="396" y="84" text-anchor="middle" font-size="9" letter-spacing="2" fill="#8B7355" opacity="0.45" font-family="Georgia,serif">share our truths</text>
<text x="240" y="290" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">STEP 5 · VULNERABILITY</text>
</svg>
    */

    <Svg viewBox="0 0 480 300" width={width} height={resolvedHeight} style={style}>
      <Rect x="96" y="130" width="96" height="136" rx="12" fill="none" stroke="#8B7355" strokeWidth="0.7" opacity={0.25} strokeDasharray="4 5"/>
      <Path d="M106 270 Q88 248 86 220 Q84 194 96 172 Q108 150 124 144 Q140 138 152 150 Q164 162 166 186 Q168 210 154 238 Q140 266 122 274Z" fill="#B5593A" opacity={0.84}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round"><Path d="M88 180 Q120 174 164 178"/><Path d="M87 196 Q120 190 165 194"/></G>
      <Ellipse cx="122" cy="134" rx="22" ry="26" fill="none" stroke="#2C2C2A" strokeWidth="1.1"/>
      <G>
      <Path d="M163 186 Q168 178 174 186 Q168 194 163 186Z" fill="#D4909A" opacity={0.8}/>
      </G>
      <Path d="M320 270 Q342 246 344 216 Q346 188 334 164 Q322 140 304 133 Q286 126 274 138 Q262 150 260 176 Q258 202 272 232 Q286 262 304 274Z" fill="#1E3A52" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round"><Path d="M262 172 Q288 166 342 170"/><Path d="M260 188 Q287 182 343 186"/><Path d="M260 204 Q287 199 342 202"/></G>
      <Ellipse cx="302" cy="122" rx="22" ry="26" fill="none" stroke="#2C2C2A" strokeWidth="1.1"/>
      <SvgText x="396" y="64" textAnchor="middle" fontFamily="Georgia,serif" fontSize="42" fill="#D4909A" opacity={0.12}>5</SvgText>
      <SvgText x="396" y="84" textAnchor="middle" fontSize="9" letterSpacing="2" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">share our truths</SvgText>
      <SvgText x="240" y="290" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>{"STEP 5 \u00B7 VULNERABILITY"}</SvgText>
    </Svg>
  );
}
