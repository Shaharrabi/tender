/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-05
 * Component:   IllustrationStep05
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 5
 * Description: Step 5 — Share our truths — armor dissolving, heart emerging, open receiving figure
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep05 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep05 width={screenWidth} />
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

export function IllustrationStep05({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#D4909A" opacity=".08">5</text>
<!-- armor dissolving left, heart emerging, soft receiving right -->
<!-- armor: rigid dashed outline around left body -->
<rect x="46" y="78" width="72" height="120" rx="10" fill="none" stroke="#8B7355" stroke-width=".7" opacity=".22" stroke-dasharray="4 5"/>
<!-- left body: terracotta, opening -->
<path d="M64 192 Q48 170 46 146 Q44 124 56 104 Q68 84 84 78 Q100 72 112 84 Q124 96 126 118 Q128 140 114 166 Q100 190 82 198Z" fill="#B5593A" opacity=".82" style="animation:breathe 5s ease-in-out infinite;transform-origin:86px 138px"/>
<g opacity=".18" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M48 112 Q82 106 124 110"/><path d="M46 126 Q81 121 125 124"/><path d="M47 140 Q81 135 124 138"/></g>
<ellipse cx="84" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M72 58 Q80 48 86 46 Q92 44 96 52" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- heart/vulnerability emerging from chest -->
<g style="animation:pulse 2.2s ease-in-out infinite;transform-origin:128px 122px">
<path d="M125 122 Q130 115 136 122 Q130 130 125 122Z" fill="#D4909A" opacity=".85"/>
<circle cx="130" cy="122" r="9" fill="none" stroke="#D4909A" stroke-width=".5" opacity=".3"/>
</g>
<!-- right body: navy, open arms, witness not fixer -->
<path d="M210 190 Q228 168 230 144 Q232 120 220 100 Q208 80 192 74 Q176 68 164 80 Q152 92 150 116 Q148 140 162 166 Q176 190 194 198Z" fill="#1E3A52" opacity=".82" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:190px 136px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M152 112 Q178 107 228 110"/><path d="M150 126 Q177 121 229 124"/><path d="M151 140 Q177 135 228 138"/></g>
<ellipse cx="192" cy="66" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<!-- arm: open, receiving, not fixing -->
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#D4909A" opacity={0.08}>5</SvgText>

      {/* Armor: rigid dashed outline around left body */}
      <Rect x="46" y="78" width="72" height="120" rx="10" fill="none" stroke="#8B7355" strokeWidth={0.7} opacity={0.22} strokeDasharray="4 5" />

      {/* Left body (terracotta) — opening */}
      <Path
        d="M64 192 Q48 170 46 146 Q44 124 56 104 Q68 84 84 78 Q100 72 112 84 Q124 96 126 118 Q128 140 114 166 Q100 190 82 198Z"
        fill="#B5593A"
        opacity={0.82}
      />
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M48 112 Q82 106 124 110" />
        <Path d="M46 126 Q81 121 125 124" />
        <Path d="M47 140 Q81 135 124 138" />
      </G>
      <Ellipse cx="84" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />
      <Path d="M72 58 Q80 48 86 46 Q92 44 96 52" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />

      {/* Heart/vulnerability emerging from chest */}
      <Path d="M125 122 Q130 115 136 122 Q130 130 125 122Z" fill="#D4909A" opacity={0.85} />
      <Circle cx="130" cy="122" r="9" fill="none" stroke="#D4909A" strokeWidth={0.5} opacity={0.3} />

      {/* Right body (navy) — witness, not fixer */}
      <Path
        d="M210 190 Q228 168 230 144 Q232 120 220 100 Q208 80 192 74 Q176 68 164 80 Q152 92 150 116 Q148 140 162 166 Q176 190 194 198Z"
        fill="#1E3A52"
        opacity={0.82}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2} strokeLinecap="round">
        <Path d="M152 112 Q178 107 228 110" />
        <Path d="M150 126 Q177 121 229 124" />
        <Path d="M151 140 Q177 135 228 138" />
      </G>
      <Ellipse cx="192" cy="66" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
