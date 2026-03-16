/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-09
 * Component:   IllustrationStep09
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 9
 * Description: Step 9 — Practice repair — one bowed figure, golden thread restitching
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep09 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep09 width={screenWidth} />
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

export function IllustrationStep09({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#B5593A" opacity=".07">9</text>
<!-- repair: one figure bowed, one open — the moment of acknowledgment -->
<path d="M78 190 Q60 168 58 144 Q56 122 68 102 Q80 82 96 76 Q112 70 124 82 Q136 94 138 116 Q140 138 126 164 Q112 188 94 196Z" fill="#B5593A" opacity=".8" style="transform-origin:98px 133px" transform="rotate(10 98 133)"/>
<g opacity=".18" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M60 110 Q94 104 136 108"/><path d="M58 124 Q93 119 137 122"/></g>
<ellipse cx="96" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1" transform="rotate(10 96 70)"/>
<!-- head bowed: I see that I hurt you -->
<path d="M88 78 Q96 82 102 78" fill="none" stroke="#2C2C2A" stroke-width=".7" opacity=".35"/>
<!-- navy: open, receiving repair -->
<path d="M206 190 Q224 168 226 144 Q228 122 216 102 Q204 82 188 76 Q172 70 160 82 Q148 94 146 116 Q144 138 158 164 Q172 188 190 196Z" fill="#1E3A52" opacity=".85" style="animation:breathe 5s ease-in-out infinite;transform-origin:186px 133px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M148 112 Q174 107 224 110"/><path d="M146 126 Q173 121 225 124"/></g>
<ellipse cx="188" cy="68" rx="19" ry="23" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<!-- repair thread: golden, being stitched -->
<path d="M138 128 Q166 118 146 128" fill="none" stroke="#C8923A" stroke-width="1.2" stroke-dasharray="4 3" style="animation:pulse 2.5s ease-in-out infinite"/>
<!-- rupture line being closed: healing scar -->
<path d="M130 100 Q150 90 166 96" fill="none" stroke="#D6CEBF" stroke-width=".8" opacity=".4"/>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#B5593A" opacity={0.07}>9</SvgText>

      {/* Left body (terracotta) — bowed in repair */}
      <Path
        d="M78 190 Q60 168 58 144 Q56 122 68 102 Q80 82 96 76 Q112 70 124 82 Q136 94 138 116 Q140 138 126 164 Q112 188 94 196Z"
        fill="#B5593A"
        opacity={0.8}
      />
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth={2} strokeLinecap="round">
        <Path d="M60 110 Q94 104 136 108" />
        <Path d="M58 124 Q93 119 137 122" />
      </G>
      <Ellipse cx="96" cy="70" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} rotation={10} origin="96, 70" />
      {/* Head bowed: I see that I hurt you */}
      <Path d="M88 78 Q96 82 102 78" fill="none" stroke="#2C2C2A" strokeWidth={0.7} opacity={0.35} />

      {/* Right body (navy) — open, receiving repair */}
      <Path
        d="M206 190 Q224 168 226 144 Q228 122 216 102 Q204 82 188 76 Q172 70 160 82 Q148 94 146 116 Q144 138 158 164 Q172 188 190 196Z"
        fill="#1E3A52"
        opacity={0.85}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2} strokeLinecap="round">
        <Path d="M148 112 Q174 107 224 110" />
        <Path d="M146 126 Q173 121 225 124" />
      </G>
      <Ellipse cx="188" cy="68" rx="19" ry="23" fill="none" stroke="#2C2C2A" strokeWidth={1} />

      {/* Repair thread: golden, being stitched */}
      <Path d="M138 128 Q166 118 146 128" fill="none" stroke="#C8923A" strokeWidth={1.2} strokeDasharray="4 3" />
      {/* Rupture line being closed */}
      <Path d="M130 100 Q150 90 166 96" fill="none" stroke="#D6CEBF" strokeWidth={0.8} opacity={0.4} />

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
