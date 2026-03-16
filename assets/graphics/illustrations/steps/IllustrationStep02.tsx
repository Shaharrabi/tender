/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-02
 * Component:   IllustrationStep02
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 2
 * Description: Step 2 — Trust the relational field — two bodies tending a living garden between them
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep02 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep02 width={screenWidth} />
 *
 * CONVERSION NOTES (Claude Code — do these in order):
 *   1. Replace <svg>       →  <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight}>
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
import ReAnimated from 'react-native-reanimated';
import { useBreathe } from '../hooks/useIllustrationAnimation';

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationStep02({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/><line x1="0" y1="200" x2="300" y2="200"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#1E3A52" opacity=".07">2</text>
<!-- the garden: two bodies tending a shared center — the field -->
<!-- field lines -->
<g opacity=".2"><path d="M0 168 Q60 158 120 165 Q180 172 240 160 Q270 154 300 158" fill="none" stroke="#7CA4B8" stroke-width="1.4" stroke-linecap="round"/><path d="M0 180 Q60 172 120 177 Q180 183 240 173 Q270 168 300 171" fill="none" stroke="#7CA4B8" stroke-width=".9" stroke-linecap="round" opacity=".65"/></g>
<!-- left body: tending, reaching down to garden -->
<path d="M54 192 Q40 172 39 150 Q38 130 46 112 Q54 94 66 88 Q78 82 88 90 Q98 98 100 118 Q102 138 92 160 Q82 182 68 196Z" fill="#B5593A" opacity=".85" style="animation:breathe 5s ease-in-out infinite;transform-origin:70px 140px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M40 118 Q66 112 100 116"/><path d="M39 132 Q66 126 101 130"/><path d="M40 146 Q66 141 100 144"/></g>
<ellipse cx="68" cy="80" rx="17" ry="20" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M57 68 Q64 58 70 56 Q76 54 80 62" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- right body navy: tending the other side -->
<path d="M246 192 Q260 172 261 150 Q262 130 254 112 Q246 94 234 88 Q222 82 212 90 Q202 98 200 118 Q198 138 208 160 Q218 182 232 196Z" fill="#1E3A52" opacity=".85" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:230px 140px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M200 116 Q224 111 260 114"/><path d="M199 130 Q224 125 261 128"/><path d="M200 144 Q224 139 260 142"/></g>
<ellipse cx="232" cy="80" rx="17" ry="20" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M222 68 Q229 58 234 56 Q239 54 243 62" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- living garden between them: amber -->
<g style="animation:glow 3.5s ease-in-out infinite;transform-origin:150px 165px"><ellipse cx="150" cy="165" rx="40" ry="22" fill="#C8923A" opacity=".12"/></g>
<path d="M115 164 Q133 156 150 160 Q168 156 186 164" fill="none" stroke="#C8923A" stroke-width=".8" opacity=".4" style="animation:pulse 3s ease-in-out infinite"/>
<!-- seedling in garden center -->
<g style="animation:float 3.5s ease-in-out infinite;transform-origin:150px 148px"><line x1="150" y1="163" x2="150" y2="144" stroke="#2C2C2A" stroke-width=".8" opacity=".38"/><path d="M150 144 Q153 136 156 144 Q153 152 150 144Z" fill="#7A9E8E" opacity=".72"/></g>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#1E3A52" opacity={0.07}>2</SvgText>

      {/* Field lines */}
      <G opacity={0.2}>
        <Path d="M0 168 Q60 158 120 165 Q180 172 240 160 Q270 154 300 158" fill="none" stroke="#7CA4B8" strokeWidth={1.4} strokeLinecap="round" />
        <Path d="M0 180 Q60 172 120 177 Q180 183 240 173 Q270 168 300 171" fill="none" stroke="#7CA4B8" strokeWidth={0.9} strokeLinecap="round" opacity={0.65} />
      </G>

      {/* Left body (terracotta) — tending the garden */}
      <Path
        d="M54 192 Q40 172 39 150 Q38 130 46 112 Q54 94 66 88 Q78 82 88 90 Q98 98 100 118 Q102 138 92 160 Q82 182 68 196Z"
        fill="#B5593A"
        opacity={0.85}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M40 118 Q66 112 100 116" />
        <Path d="M39 132 Q66 126 101 130" />
        <Path d="M40 146 Q66 141 100 144" />
      </G>
      <Ellipse cx="68" cy="80" rx="17" ry="20" fill="none" stroke="#2C2C2A" strokeWidth={1} />
      <Path d="M57 68 Q64 58 70 56 Q76 54 80 62" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />

      {/* Right body (navy) — tending the other side */}
      <Path
        d="M246 192 Q260 172 261 150 Q262 130 254 112 Q246 94 234 88 Q222 82 212 90 Q202 98 200 118 Q198 138 208 160 Q218 182 232 196Z"
        fill="#1E3A52"
        opacity={0.85}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2} strokeLinecap="round">
        <Path d="M200 116 Q224 111 260 114" />
        <Path d="M199 130 Q224 125 261 128" />
        <Path d="M200 144 Q224 139 260 142" />
      </G>
      <Ellipse cx="232" cy="80" rx="17" ry="20" fill="none" stroke="#2C2C2A" strokeWidth={1} />
      <Path d="M222 68 Q229 58 234 56 Q239 54 243 62" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />

      {/* Living garden between them: amber glow */}
      <Ellipse cx="150" cy="165" rx="40" ry="22" fill="#C8923A" opacity={0.12} />
      <Path d="M115 164 Q133 156 150 160 Q168 156 186 164" fill="none" stroke="#C8923A" strokeWidth={0.8} opacity={0.4} />

      {/* Seedling in garden center */}
      <Line x1="150" y1="163" x2="150" y2="144" stroke="#2C2C2A" strokeWidth={0.8} opacity={0.38} />
      <Path d="M150 144 Q153 136 156 144 Q153 152 150 144Z" fill="#7A9E8E" opacity={0.72} />

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
