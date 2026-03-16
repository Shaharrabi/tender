/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-07
 * Component:   IllustrationStep07
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 7
 * Description: Step 7 — Invite partner in — figure leaning toward, 5:1 ratio dots above
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep07 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep07 width={screenWidth} />
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

export function IllustrationStep07({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#C8923A" opacity=".07">7</text>
<!-- One figure reaching toward the other with an open hand — invitation, not demand -->
<path d="M68 194 Q50 172 48 148 Q46 126 58 106 Q70 86 86 80 Q102 74 114 86 Q126 98 128 120 Q130 142 116 168 Q102 192 84 198Z" fill="#B5593A" opacity=".85" style="animation:breathe 5s ease-in-out infinite;transform-origin:88px 137px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M50 114 Q84 108 126 112"/><path d="M48 128 Q83 123 127 126"/><path d="M49 142 Q83 137 126 140"/></g>
<ellipse cx="86" cy="72" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M74 60 Q82 50 88 48 Q94 46 98 54" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- invitation arm: open palm, reaching toward -->
<!-- second body navy: turning toward, responding -->
<path d="M202 190 Q220 170 222 146 Q224 124 212 104 Q200 84 184 78 Q168 72 156 84 Q144 96 142 118 Q140 140 154 166 Q168 190 186 198Z" fill="#1E3A52" opacity=".8" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2s;transform-origin:182px 136px" transform="rotate(-5 182 136)"/>
<g opacity=".18" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M144 114 Q170 109 220 112"/><path d="M142 128 Q169 123 221 126"/></g>
<ellipse cx="182" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1" transform="rotate(-5 182 70)"/>
<!-- 5:1 ratio suggestion: 5 small golden marks near top -->
<g opacity=".55">
<circle cx="232" cy="44" r="3.5" fill="#C8923A"/><circle cx="246" cy="44" r="3.5" fill="#C8923A"/><circle cx="260" cy="44" r="3.5" fill="#C8923A"/><circle cx="274" cy="44" r="3.5" fill="#C8923A"/><circle cx="288" cy="44" r="3.5" fill="#C8923A"/>
<circle cx="240" cy="58" r="3.5" fill="#B5593A" opacity=".5"/>
<text x="260" y="74" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".4" font-family="Georgia,serif">5 : 1</text>
</g>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#C8923A" opacity={0.07}>7</SvgText>

      {/* Left body (terracotta) — reaching toward */}
      <Path
        d="M68 194 Q50 172 48 148 Q46 126 58 106 Q70 86 86 80 Q102 74 114 86 Q126 98 128 120 Q130 142 116 168 Q102 192 84 198Z"
        fill="#B5593A"
        opacity={0.85}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M50 114 Q84 108 126 112" />
        <Path d="M48 128 Q83 123 127 126" />
        <Path d="M49 142 Q83 137 126 140" />
      </G>
      <Ellipse cx="86" cy="72" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />
      <Path d="M74 60 Q82 50 88 48 Q94 46 98 54" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />

      {/* Right body (navy) — turning toward, responding */}
      <Path
        d="M202 190 Q220 170 222 146 Q224 124 212 104 Q200 84 184 78 Q168 72 156 84 Q144 96 142 118 Q140 140 154 166 Q168 190 186 198Z"
        fill="#1E3A52"
        opacity={0.8}
      />
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth={2} strokeLinecap="round">
        <Path d="M144 114 Q170 109 220 112" />
        <Path d="M142 128 Q169 123 221 126" />
      </G>
      <Ellipse cx="182" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} rotation={-5} origin="182, 70" />

      {/* 5:1 ratio — 5 golden marks and 1 terracotta */}
      <G opacity={0.55}>
        <Circle cx="232" cy="44" r="3.5" fill="#C8923A" />
        <Circle cx="246" cy="44" r="3.5" fill="#C8923A" />
        <Circle cx="260" cy="44" r="3.5" fill="#C8923A" />
        <Circle cx="274" cy="44" r="3.5" fill="#C8923A" />
        <Circle cx="288" cy="44" r="3.5" fill="#C8923A" />
        <Circle cx="240" cy="58" r="3.5" fill="#B5593A" opacity={0.5} />
        <SvgText x="260" y="74" textAnchor="middle" fontSize="6.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia, serif">5 : 1</SvgText>
      </G>

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
