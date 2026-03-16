/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-10
 * Component:   IllustrationStep10
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 10
 * Description: Step 10 — Build rituals — two bodies, repeated daily dots above
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep10 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep10 width={screenWidth} />
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

export function IllustrationStep10({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#7A9E8E" opacity=".07">10</text>
<!-- ritual: two bodies side by side, repeated small gesture — the daily kiss, the weekly check-in -->
<path d="M68 190 Q50 168 48 144 Q46 122 58 102 Q70 82 86 76 Q102 70 114 82 Q126 94 128 116 Q130 138 116 164 Q102 188 84 196Z" fill="#B5593A" opacity=".85" style="animation:breathe 5s ease-in-out infinite;transform-origin:88px 133px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M50 110 Q84 104 126 108"/><path d="M48 124 Q83 119 127 122"/><path d="M49 138 Q83 133 126 136"/></g>
<ellipse cx="86" cy="68" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M74 56 Q82 46 88 44 Q94 42 98 50" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<path d="M182 190 Q200 168 202 144 Q204 122 192 102 Q180 82 164 76 Q148 70 136 82 Q124 94 122 116 Q120 138 134 164 Q148 188 166 196Z" fill="#1E3A52" opacity=".85" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2.5s;transform-origin:162px 133px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M124 110 Q152 105 200 108"/><path d="M122 124 Q151 119 201 122"/><path d="M123 138 Q151 133 200 136"/></g>
<ellipse cx="164" cy="68" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<!-- ritual: repeated small dots = daily rhythm -->
<g opacity=".6">
<circle cx="48" cy="40" r="3" fill="#C8923A"/><circle cx="60" cy="40" r="3" fill="#C8923A"/><circle cx="72" cy="40" r="3" fill="#C8923A"/><circle cx="84" cy="40" r="3" fill="#C8923A"/><circle cx="96" cy="40" r="3" fill="#C8923A"/><circle cx="108" cy="40" r="3" fill="#C8923A"/>
<text x="80" y="26" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".45" font-family="Georgia,serif">small moments · repeated · every day</text>
</g>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#7A9E8E" opacity={0.07}>10</SvgText>

      {/* Left body (terracotta) */}
      <Path
        d="M68 190 Q50 168 48 144 Q46 122 58 102 Q70 82 86 76 Q102 70 114 82 Q126 94 128 116 Q130 138 116 164 Q102 188 84 196Z"
        fill="#B5593A"
        opacity={0.85}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M50 110 Q84 104 126 108" />
        <Path d="M48 124 Q83 119 127 122" />
        <Path d="M49 138 Q83 133 126 136" />
      </G>
      <Ellipse cx="86" cy="68" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />
      <Path d="M74 56 Q82 46 88 44 Q94 42 98 50" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />

      {/* Right body (navy) */}
      <Path
        d="M182 190 Q200 168 202 144 Q204 122 192 102 Q180 82 164 76 Q148 70 136 82 Q124 94 122 116 Q120 138 134 164 Q148 188 166 196Z"
        fill="#1E3A52"
        opacity={0.85}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2} strokeLinecap="round">
        <Path d="M124 110 Q152 105 200 108" />
        <Path d="M122 124 Q151 119 201 122" />
        <Path d="M123 138 Q151 133 200 136" />
      </G>
      <Ellipse cx="164" cy="68" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />

      {/* Ritual: repeated small dots = daily rhythm */}
      <G opacity={0.6}>
        <Circle cx="48" cy="40" r="3" fill="#C8923A" />
        <Circle cx="60" cy="40" r="3" fill="#C8923A" />
        <Circle cx="72" cy="40" r="3" fill="#C8923A" />
        <Circle cx="84" cy="40" r="3" fill="#C8923A" />
        <Circle cx="96" cy="40" r="3" fill="#C8923A" />
        <Circle cx="108" cy="40" r="3" fill="#C8923A" />
        <SvgText x="80" y="26" textAnchor="middle" fontSize="6.5" fill="#8B7355" opacity={0.45} fontFamily="Georgia, serif">{"small moments \u00B7 repeated \u00B7 every day"}</SvgText>
      </G>

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
