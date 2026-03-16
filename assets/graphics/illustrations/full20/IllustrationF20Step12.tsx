/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-step12
 * Component:   IllustrationF20Step12
 * Screen:      app/(app)/step-detail.tsx  stepNumber === 12  (alt)
 * Description: Step 12 full-size — foreheads touching, vine fully grown, field alive
 * ViewBox:     0 0 480 300
 *
 * USAGE:
 *   import { IllustrationF20Step12 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20Step12 width={screenWidth} />
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

export function IllustrationF20Step12({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (300 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/></g>

<!-- four attachment quadrants: abstract bodies in each -->
<!-- Secure: center, warm, upright -->
<path d="M196 164 Q184 148 182 132 Q180 118 188 108 Q196 98 204 104 Q212 110 214 126 Q216 142 208 158 Q202 170 198 168Z" fill="#7A9E8E" opacity="0.8" style="animation:breathe 5s ease-in-out infinite;transform-origin:198px 135px"/>
<ellipse cx="196" cy="100" rx="14" ry="16" fill="none" stroke="#2C2C2A" stroke-width="0.85"/>
<text x="196" y="188" text-anchor="middle" font-size="7.5" fill="#7A9E8E" opacity="0.7" font-family="Georgia,serif">secure</text>

<!-- Anxious: reaching, straining left -->
<path d="M84 178 Q68 158 66 136 Q64 116 74 102 Q84 88 96 94 Q108 100 110 120 Q112 140 100 162 Q92 180 86 180Z" fill="#B5593A" opacity="0.78" style="animation:breathe 3.5s ease-in-out infinite;animation-delay:-0.5s;transform-origin:88px 135px"/>
<ellipse cx="84" cy="90" rx="14" ry="16" fill="none" stroke="#2C2C2A" stroke-width="0.85"/>
<text x="84" y="198" text-anchor="middle" font-size="7.5" fill="#B5593A" opacity="0.65" font-family="Georgia,serif">anxious</text>

<!-- Avoidant: turning away, navy, rigid -->
<path d="M336 178 Q354 158 356 136 Q358 116 348 102 Q338 88 326 94 Q314 100 312 120 Q310 140 322 162 Q330 180 334 180Z" fill="#1E3A52" opacity="0.78"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M312 116 Q330 110 356 114"/><path d="M312 130 Q330 125 357 128"/></g>
<ellipse cx="336" cy="90" rx="14" ry="16" fill="none" stroke="#2C2C2A" stroke-width="0.85"/>
<text x="336" y="198" text-anchor="middle" font-size="7.5" fill="#1E3A52" opacity="0.65" font-family="Georgia,serif">avoidant</text>

<!-- Disorganized: fragmented, plum, asymmetric -->
<path d="M408 182 Q392 162 388 138 Q384 116 394 102 Q404 88 416 94 Q428 100 430 120 Q432 140 420 164 Q414 182 410 182Z" fill="#6E4E6E" opacity="0.72" transform="rotate(6 410 140)"/>
<ellipse cx="408" cy="90" rx="14" ry="16" fill="none" stroke="#2C2C2A" stroke-width="0.85"/>
<text x="408" y="198" text-anchor="middle" font-size="7.5" fill="#6E4E6E" opacity="0.65" font-family="Georgia,serif">disorganized</text>

<!-- quadrant lines -->
<line x1="240" y1="70" x2="240" y2="210" stroke="#D6CEBF" stroke-width="0.6" opacity="0.5"/>
<line x1="30" y1="140" x2="450" y2="140" stroke="#D6CEBF" stroke-width="0.6" opacity="0.5"/>
<text x="135" y="78" text-anchor="middle" font-size="7.5" fill="#8B7355" opacity="0.4" font-family="Georgia,serif">high anxiety</text>
<text x="345" y="78" text-anchor="middle" font-size="7.5" fill="#8B7355" opacity="0.4" font-family="Georgia,serif">low anxiety</text>
<text x="40" y="220" font-size="7.5" fill="#8B7355" opacity="0.4" font-family="Georgia,serif" transform="rotate(-90 40 220)">avoidance</text>

<!-- result bar strip -->
<g opacity="0.6">
<text x="30" y="240" font-size="8" fill="#8B7355" font-family="Georgia,serif" letter-spacing="1">your pattern</text>
<rect x="30" y="248" width="200" height="3" rx="1.5" fill="#D6CEBF"/>
<rect x="30" y="248" width="145" height="3" rx="1.5" fill="#B5593A" opacity="0.65"/>
<text x="30" y="264" font-size="8" fill="#8B7355" font-family="Georgia,serif" letter-spacing="1">growing edge</text>
<rect x="30" y="270" width="200" height="3" rx="1.5" fill="#D6CEBF"/>
<rect x="30" y="270" width="88" height="3" rx="1.5" fill="#7A9E8E" opacity="0.65"/>
</g>

<text x="350" y="288" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="3" fill="#2C2C2A" opacity="0.45">ECR-R PORTRAIT</text>
</svg>
    */

    <Svg viewBox="0 0 480 300" width={width} height={resolvedHeight} style={style}>
      <Path d="M196 164 Q184 148 182 132 Q180 118 188 108 Q196 98 204 104 Q212 110 214 126 Q216 142 208 158 Q202 170 198 168Z" fill="#7A9E8E" opacity={0.8}/>
      <Ellipse cx="196" cy="100" rx="14" ry="16" fill="none" stroke="#2C2C2A" strokeWidth="0.85"/>
      <SvgText x="196" y="188" textAnchor="middle" fontSize="7.5" fill="#7A9E8E" opacity={0.7} fontFamily="Georgia,serif">secure</SvgText>
      <Path d="M84 178 Q68 158 66 136 Q64 116 74 102 Q84 88 96 94 Q108 100 110 120 Q112 140 100 162 Q92 180 86 180Z" fill="#B5593A" opacity={0.78}/>
      <Ellipse cx="84" cy="90" rx="14" ry="16" fill="none" stroke="#2C2C2A" strokeWidth="0.85"/>
      <SvgText x="84" y="198" textAnchor="middle" fontSize="7.5" fill="#B5593A" opacity={0.65} fontFamily="Georgia,serif">anxious</SvgText>
      <Path d="M336 178 Q354 158 356 136 Q358 116 348 102 Q338 88 326 94 Q314 100 312 120 Q310 140 322 162 Q330 180 334 180Z" fill="#1E3A52" opacity={0.78}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round"><Path d="M312 116 Q330 110 356 114"/><Path d="M312 130 Q330 125 357 128"/></G>
      <Ellipse cx="336" cy="90" rx="14" ry="16" fill="none" stroke="#2C2C2A" strokeWidth="0.85"/>
      <SvgText x="336" y="198" textAnchor="middle" fontSize="7.5" fill="#1E3A52" opacity={0.65} fontFamily="Georgia,serif">avoidant</SvgText>
      <Path d="M408 182 Q392 162 388 138 Q384 116 394 102 Q404 88 416 94 Q428 100 430 120 Q432 140 420 164 Q414 182 410 182Z" fill="#6E4E6E" opacity={0.72} rotation={6} origin="410, 140"/>
      <Ellipse cx="408" cy="90" rx="14" ry="16" fill="none" stroke="#2C2C2A" strokeWidth="0.85"/>
      <SvgText x="408" y="198" textAnchor="middle" fontSize="7.5" fill="#6E4E6E" opacity={0.65} fontFamily="Georgia,serif">disorganized</SvgText>
      <Line x1="240" y1="70" x2="240" y2="210" stroke="#D6CEBF" strokeWidth="0.6" opacity={0.5}/>
      <Line x1="30" y1="140" x2="450" y2="140" stroke="#D6CEBF" strokeWidth="0.6" opacity={0.5}/>
      <SvgText x="135" y="78" textAnchor="middle" fontSize="7.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">high anxiety</SvgText>
      <SvgText x="345" y="78" textAnchor="middle" fontSize="7.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">low anxiety</SvgText>
      <SvgText x="40" y="220" fontSize="7.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif" rotation={-90} origin="40, 220">avoidance</SvgText>
      <G opacity={0.6}>
      <SvgText x="30" y="240" fontSize="8" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing="1">your pattern</SvgText>
      <Rect x="30" y="248" width="200" height="3" rx="1.5" fill="#D6CEBF"/>
      <Rect x="30" y="248" width="145" height="3" rx="1.5" fill="#B5593A" opacity={0.65}/>
      <SvgText x="30" y="264" fontSize="8" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing="1">growing edge</SvgText>
      <Rect x="30" y="270" width="200" height="3" rx="1.5" fill="#D6CEBF"/>
      <Rect x="30" y="270" width="88" height="3" rx="1.5" fill="#7A9E8E" opacity={0.65}/>
      </G>
      <SvgText x="350" y="288" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="3" fill="#2C2C2A" opacity={0.45}>ECR-R PORTRAIT</SvgText>
    </Svg>
  );
}
