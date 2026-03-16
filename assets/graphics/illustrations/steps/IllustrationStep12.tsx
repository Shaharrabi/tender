/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-12
 * Component:   IllustrationStep12
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 12
 * Description: Step 12 — Become a refuge — foreheads touching, vine fully grown with leaves
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep12 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep12 width={screenWidth} />
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

export function IllustrationStep12({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#C8923A" opacity=".08">12</text>
<!-- two bodies merged close, foreheads touching — the refuge, fully arrived -->
<!-- field fully alive behind them: open flowing lines -->
<g opacity=".2"><path d="M0 184 Q60 174 120 180 Q180 186 240 176 Q270 171 300 174" fill="none" stroke="#7CA4B8" stroke-width="1.5" stroke-linecap="round"/><path d="M0 196 Q60 188 122 193 Q182 198 240 189 Q271 184 300 186" fill="none" stroke="#7CA4B8" stroke-width="1" stroke-linecap="round" opacity=".65"/></g>
<!-- left body: terracotta, leaning in -->
<path d="M64 196 Q46 172 44 146 Q42 122 54 100 Q66 78 84 72 Q102 66 116 78 Q130 90 132 114 Q134 138 118 166 Q102 192 82 200Z" fill="#B5593A" opacity=".87" style="animation:breathe 5.5s ease-in-out infinite;transform-origin:88px 133px"/>
<g opacity=".22" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M46 108 Q82 102 130 106"/><path d="M44 122 Q81 117 131 120"/><path d="M44 136 Q81 131 130 134"/><path d="M45 150 Q81 145 128 148"/><path d="M47 164 Q81 159 124 162"/></g>
<ellipse cx="86" cy="64" rx="20" ry="24" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(7 86 64)"/>
<path d="M72 52 Q80 42 88 40 Q96 38 102 46" fill="none" stroke="#2C2C2A" stroke-width="1" stroke-linecap="round" opacity=".65"/>
<!-- right body navy, leaning in -->
<path d="M210 196 Q228 172 230 146 Q232 122 220 100 Q208 78 190 72 Q172 66 158 78 Q144 90 142 114 Q140 138 156 166 Q172 192 192 200Z" fill="#1E3A52" opacity=".87" style="animation:breathe 5.5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:186px 133px"/>
<g opacity=".22" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M144 104 Q170 99 228 102"/><path d="M142 118 Q169 113 229 116"/><path d="M142 132 Q169 127 229 130"/><path d="M143 146 Q169 141 228 144"/><path d="M145 160 Q169 155 225 158"/></g>
<ellipse cx="188" cy="64" rx="20" ry="24" fill="none" stroke="#2C2C2A" stroke-width="1.1" transform="rotate(-7 188 64)"/>
<!-- foreheads touching -->
<line x1="104" y1="60" x2="170" y2="60" stroke="#D6CEBF" stroke-width=".5"/>
<!-- vine FULLY GROWN at crown: two leaves, branching -->
<g style="animation:float 4.5s ease-in-out infinite;transform-origin:137px 28px">
<line x1="137" y1="60" x2="137" y2="26" stroke="#2C2C2A" stroke-width="1.1" opacity=".45"/>
<path d="M137 26 Q140 16 144 26 Q140 36 137 26Z" fill="#1E3A52" opacity=".8"/>
<path d="M137 26 Q134 18 130 26 Q134 34 137 26Z" fill="#1E3A52" opacity=".58"/>
<path d="M134 34 Q126 31 124 37 Q130 38 134 34Z" fill="#1E3A52" opacity=".38"/>
<path d="M140 30 Q148 27 150 33 Q145 34 140 30Z" fill="#1E3A52" opacity=".32"/>
<path d="M133 42 Q125 40 124 45 Q130 46 133 42Z" fill="#7A9E8E" opacity=".35"/>
<path d="M141 38 Q148 36 150 41 Q145 42 141 38Z" fill="#7A9E8E" opacity=".3"/>
</g>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#C8923A" opacity={0.08}>12</SvgText>

      {/* Field fully alive behind them */}
      <G opacity={0.2}>
        <Path d="M0 184 Q60 174 120 180 Q180 186 240 176 Q270 171 300 174" fill="none" stroke="#7CA4B8" strokeWidth={1.5} strokeLinecap="round" />
        <Path d="M0 196 Q60 188 122 193 Q182 198 240 189 Q271 184 300 186" fill="none" stroke="#7CA4B8" strokeWidth={1} strokeLinecap="round" opacity={0.65} />
      </G>

      {/* Left body (terracotta) — leaning in */}
      <Path
        d="M64 196 Q46 172 44 146 Q42 122 54 100 Q66 78 84 72 Q102 66 116 78 Q130 90 132 114 Q134 138 118 166 Q102 192 82 200Z"
        fill="#B5593A"
        opacity={0.87}
      />
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M46 108 Q82 102 130 106" />
        <Path d="M44 122 Q81 117 131 120" />
        <Path d="M44 136 Q81 131 130 134" />
        <Path d="M45 150 Q81 145 128 148" />
        <Path d="M47 164 Q81 159 124 162" />
      </G>
      <Ellipse cx="86" cy="64" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth={1.1} rotation={7} origin="86, 64" />
      <Path d="M72 52 Q80 42 88 40 Q96 38 102 46" fill="none" stroke="#2C2C2A" strokeWidth={1} strokeLinecap="round" opacity={0.65} />

      {/* Right body (navy) — leaning in */}
      <Path
        d="M210 196 Q228 172 230 146 Q232 122 220 100 Q208 78 190 72 Q172 66 158 78 Q144 90 142 114 Q140 138 156 166 Q172 192 192 200Z"
        fill="#1E3A52"
        opacity={0.87}
      />
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth={2} strokeLinecap="round">
        <Path d="M144 104 Q170 99 228 102" />
        <Path d="M142 118 Q169 113 229 116" />
        <Path d="M142 132 Q169 127 229 130" />
        <Path d="M143 146 Q169 141 228 144" />
        <Path d="M145 160 Q169 155 225 158" />
      </G>
      <Ellipse cx="188" cy="64" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth={1.1} rotation={-7} origin="188, 64" />

      {/* Foreheads touching */}
      <Line x1="104" y1="60" x2="170" y2="60" stroke="#D6CEBF" strokeWidth={0.5} />

      {/* Vine fully grown at crown: two leaves, branching */}
      <G>
        <Line x1="137" y1="60" x2="137" y2="26" stroke="#2C2C2A" strokeWidth={1.1} opacity={0.45} />
        <Path d="M137 26 Q140 16 144 26 Q140 36 137 26Z" fill="#1E3A52" opacity={0.8} />
        <Path d="M137 26 Q134 18 130 26 Q134 34 137 26Z" fill="#1E3A52" opacity={0.58} />
        <Path d="M134 34 Q126 31 124 37 Q130 38 134 34Z" fill="#1E3A52" opacity={0.38} />
        <Path d="M140 30 Q148 27 150 33 Q145 34 140 30Z" fill="#1E3A52" opacity={0.32} />
        <Path d="M133 42 Q125 40 124 45 Q130 46 133 42Z" fill="#7A9E8E" opacity={0.35} />
        <Path d="M141 38 Q148 36 150 41 Q145 42 141 38Z" fill="#7A9E8E" opacity={0.3} />
      </G>

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
