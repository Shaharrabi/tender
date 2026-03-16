/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-04
 * Component:   IllustrationStep04
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 4
 * Description: Step 4 — Examine our part — figure with compass lens, looking at own shadow
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep04 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep04 width={screenWidth} />
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

export function IllustrationStep04({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/><line x1="0" y1="200" x2="300" y2="200"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#7A9E8E" opacity=".07">4</text>
<!-- figure examining their own reflection/shadow — looking at self with lens -->
<!-- body looking downward, seeing their own shape cast below -->
<path d="M100 188 Q82 166 80 142 Q78 120 90 100 Q102 80 118 74 Q134 68 146 80 Q158 92 160 114 Q162 136 148 162 Q134 186 116 194Z" fill="#B5593A" opacity=".82" style="animation:breathe 5s ease-in-out infinite;transform-origin:120px 134px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M82 108 Q116 102 158 106"/><path d="M80 122 Q115 117 159 120"/><path d="M80 136 Q115 131 158 134"/><path d="M81 150 Q115 145 156 148"/></g>
<ellipse cx="120" cy="66" rx="20" ry="24" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M106 54 Q114 44 122 42 Q130 40 136 48" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- figure looking at their shadow self below -->
<!-- shadow/mirror below: same shape, but lighter -->
<path d="M100 210 Q82 198 80 186 Q82 180 86 176 Q90 172 96 174 Q102 176 104 182" fill="none" stroke="#8B7355" stroke-width="1" opacity=".25" stroke-dasharray="2 3"/>
<!-- the lens: honest seeing, small compass rose -->
<g style="animation:drift 4s ease-in-out infinite;transform-origin:214px 100px">
<circle cx="214" cy="100" r="16" fill="none" stroke="#C8923A" stroke-width=".7" opacity=".55"/>
<line x1="214" y1="84" x2="214" y2="116" stroke="#C8923A" stroke-width=".7" opacity=".55"/>
<line x1="198" y1="100" x2="230" y2="100" stroke="#C8923A" stroke-width=".7" opacity=".55"/>
</g>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#7A9E8E" opacity={0.07}>4</SvgText>

      {/* Body (terracotta) — examining self */}
      <Path
        d="M100 188 Q82 166 80 142 Q78 120 90 100 Q102 80 118 74 Q134 68 146 80 Q158 92 160 114 Q162 136 148 162 Q134 186 116 194Z"
        fill="#B5593A"
        opacity={0.82}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M82 108 Q116 102 158 106" />
        <Path d="M80 122 Q115 117 159 120" />
        <Path d="M80 136 Q115 131 158 134" />
        <Path d="M81 150 Q115 145 156 148" />
      </G>
      <Ellipse cx="120" cy="66" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth={1} />
      <Path d="M106 54 Q114 44 122 42 Q130 40 136 48" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />

      {/* Shadow/mirror below */}
      <Path d="M100 210 Q82 198 80 186 Q82 180 86 176 Q90 172 96 174 Q102 176 104 182" fill="none" stroke="#8B7355" strokeWidth={1} opacity={0.25} strokeDasharray="2 3" />

      {/* The lens: compass rose */}
      <Circle cx="214" cy="100" r="16" fill="none" stroke="#C8923A" strokeWidth={0.7} opacity={0.55} />
      <Line x1="214" y1="84" x2="214" y2="116" stroke="#C8923A" strokeWidth={0.7} opacity={0.55} />
      <Line x1="198" y1="100" x2="230" y2="100" stroke="#C8923A" strokeWidth={0.7} opacity={0.55} />

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
