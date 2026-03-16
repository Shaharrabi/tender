/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-step5
 * Component:   IllustrationF20Step05
 * Screen:      app/(app)/step-detail.tsx  stepNumber === 5  (alt)
 * Description: Step 5 full-size — armor dissolving, heart emerging, receiving figure
 * ViewBox:     0 0 480 300
 *
 * USAGE:
 *   import { IllustrationF20Step05 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20Step05 width={screenWidth} />
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

export function IllustrationF20Step05({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (300 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/></g>

<!-- STEP 12: BECOME A REFUGE -->
<!-- two bodies merged/overlapping, holding each other — the arrival -->
<path d="M116 274 Q88 244 84 210 Q80 178 96 150 Q112 122 136 112 Q160 102 178 116 Q196 130 200 160 Q204 190 188 226 Q172 262 150 278Z" fill="#B5593A" opacity="0.85" style="animation:breathe 5.5s ease-in-out infinite;transform-origin:142px 193px"/>
<g opacity="0.22" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M86 162 Q128 155 196 160"/><path d="M84 178 Q127 172 197 176"/><path d="M83 194 Q126 188 197 192"/><path d="M84 210 Q126 204 196 208"/><path d="M86 226 Q126 221 192 224"/></g>
<ellipse cx="140" cy="100" rx="26" ry="30" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(5 140 100)"/>

<path d="M280 272 Q308 242 312 208 Q316 176 300 148 Q284 120 260 110 Q236 100 218 114 Q200 128 196 158 Q192 188 208 224 Q224 260 248 276Z" fill="#1E3A52" opacity="0.85" style="animation:breathe 5.5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:254px 191px"/>
<g opacity="0.22" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M198 156 Q230 150 310 154"/><path d="M196 172 Q228 166 312 170"/><path d="M195 188 Q228 182 312 186"/><path d="M196 204 Q228 198 310 202"/><path d="M198 220 Q229 215 308 218"/></g>
<ellipse cx="256" cy="98" rx="26" ry="30" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(-5 256 98)"/>
<!-- foreheads touching -->
<line x1="164" y1="96" x2="230" y2="96" stroke="#D6CEBF" stroke-width="0.5"/>

<!-- vine + leaf at the crown: fully grown now -->
<g style="animation:float 4.5s ease-in-out infinite;transform-origin:198px 50px">
<line x1="198" y1="94" x2="198" y2="52" stroke="#2C2C2A" stroke-width="1.1" opacity="0.45"/>
<path d="M198 52 Q202 40 206 52 Q202 64 198 52Z" fill="#1E3A52" opacity="0.78"/>
<path d="M198 52 Q194 42 190 52 Q194 62 198 52Z" fill="#1E3A52" opacity="0.55"/>
<path d="M195 60 Q186 57 184 63 Q190 65 195 60Z" fill="#1E3A52" opacity="0.38"/>
<path d="M202 56 Q210 53 212 59 Q206 60 202 56Z" fill="#1E3A52" opacity="0.32"/>
</g>
<!-- full field behind them -->
<g opacity="0.18"><path d="M0 260 Q100 248 200 256 Q300 264 400 252 Q450 246 480 249" fill="none" stroke="#7CA4B8" stroke-width="1.5" stroke-linecap="round"/><path d="M0 272 Q100 262 200 268 Q300 274 400 264 Q452 258 480 261" fill="none" stroke="#7CA4B8" stroke-width="1" stroke-linecap="round" opacity="0.65"/></g>

<text x="396" y="64" text-anchor="middle" font-family="Georgia,serif" font-size="42" fill="#C8923A" opacity="0.12">12</text>
<text x="396" y="84" text-anchor="middle" font-size="9" letter-spacing="2" fill="#8B7355" opacity="0.45" font-family="Georgia,serif">become a refuge</text>
<text x="240" y="290" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">STEP 12 · THE ARRIVAL</text>
</svg>
    */

    <Svg viewBox="0 0 480 300" width={width} height={resolvedHeight} style={style}>
      <Path d="M116 274 Q88 244 84 210 Q80 178 96 150 Q112 122 136 112 Q160 102 178 116 Q196 130 200 160 Q204 190 188 226 Q172 262 150 278Z" fill="#B5593A" opacity={0.85}/>
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round"><Path d="M86 162 Q128 155 196 160"/><Path d="M84 178 Q127 172 197 176"/><Path d="M83 194 Q126 188 197 192"/><Path d="M84 210 Q126 204 196 208"/><Path d="M86 226 Q126 221 192 224"/></G>
      <Ellipse cx="140" cy="100" rx="26" ry="30" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={5} origin="140, 100"/>
      <Path d="M280 272 Q308 242 312 208 Q316 176 300 148 Q284 120 260 110 Q236 100 218 114 Q200 128 196 158 Q192 188 208 224 Q224 260 248 276Z" fill="#1E3A52" opacity={0.85}/>
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round"><Path d="M198 156 Q230 150 310 154"/><Path d="M196 172 Q228 166 312 170"/><Path d="M195 188 Q228 182 312 186"/><Path d="M196 204 Q228 198 310 202"/><Path d="M198 220 Q229 215 308 218"/></G>
      <Ellipse cx="256" cy="98" rx="26" ry="30" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={-5} origin="256, 98"/>
      <Line x1="164" y1="96" x2="230" y2="96" stroke="#D6CEBF" strokeWidth="0.5"/>
      <G>
      <Line x1="198" y1="94" x2="198" y2="52" stroke="#2C2C2A" strokeWidth="1.1" opacity={0.45}/>
      <Path d="M198 52 Q202 40 206 52 Q202 64 198 52Z" fill="#1E3A52" opacity={0.78}/>
      <Path d="M198 52 Q194 42 190 52 Q194 62 198 52Z" fill="#1E3A52" opacity={0.55}/>
      <Path d="M195 60 Q186 57 184 63 Q190 65 195 60Z" fill="#1E3A52" opacity={0.38}/>
      <Path d="M202 56 Q210 53 212 59 Q206 60 202 56Z" fill="#1E3A52" opacity={0.32}/>
      </G>
      <G opacity={0.18}><Path d="M0 260 Q100 248 200 256 Q300 264 400 252 Q450 246 480 249" fill="none" stroke="#7CA4B8" strokeWidth="1.5" strokeLinecap="round"/><Path d="M0 272 Q100 262 200 268 Q300 274 400 264 Q452 258 480 261" fill="none" stroke="#7CA4B8" strokeWidth="1" strokeLinecap="round" opacity={0.65}/></G>
      <SvgText x="396" y="64" textAnchor="middle" fontFamily="Georgia,serif" fontSize="42" fill="#C8923A" opacity={0.12}>12</SvgText>
      <SvgText x="396" y="84" textAnchor="middle" fontSize="9" letterSpacing="2" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">become a refuge</SvgText>
      <SvgText x="240" y="290" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>{"STEP 12 \u00B7 THE ARRIVAL"}</SvgText>
    </Svg>
  );
}
