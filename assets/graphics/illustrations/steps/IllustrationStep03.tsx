/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          step-03
 * Component:   IllustrationStep03
 * Screen:      app/(app)/step-detail.tsx  →  stepNumber === 3
 * Description: Step 3 — Release certainty — figure holding a dissolving block (the story)
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationStep03 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationStep03 width={screenWidth} />
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

export function IllustrationStep03({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  const animStyle = useBreathe(5000);

    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/><line x1="0" y1="200" x2="300" y2="200"/></g>
<text x="228" y="80" font-family="Georgia,serif" font-size="72" fill="#C8923A" opacity=".07">3</text>
<!-- one figure holding a solid block (the story/certainty), starting to release it -->
<path d="M80 196 Q62 172 60 146 Q58 122 70 100 Q82 78 98 72 Q114 66 126 78 Q138 90 140 114 Q142 138 128 166 Q114 192 96 200Z" fill="#B5593A" opacity=".85" style="animation:breathe 5s ease-in-out infinite;transform-origin:100px 136px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round"><path d="M62 108 Q94 102 138 106"/><path d="M60 122 Q93 117 139 120"/><path d="M61 136 Q93 131 138 134"/><path d="M62 150 Q93 145 136 148"/></g>
<ellipse cx="98" cy="64" rx="20" ry="24" fill="none" stroke="#2C2C2A" stroke-width="1" transform="rotate(4 98 64)"/>
<path d="M84 52 Q92 42 100 40 Q108 38 114 46" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- arms holding something heavy: the certainty block -->
<!-- the solid block / certainty: rigid rectangle starting to dissolve at edges -->
<rect x="18" y="108" width="32" height="22" rx="3" fill="#8B7355" opacity=".3"/>
<rect x="18" y="108" width="32" height="22" rx="3" fill="none" stroke="#8B7355" stroke-width=".6" opacity=".4" stroke-dasharray="3 4"/>
<text x="34" y="123" text-anchor="middle" font-size="5.5" fill="#8B7355" opacity=".5" font-family="Georgia,serif">the story</text>
<!-- particles releasing from block: certainty dissolving -->
<g style="animation:float 3s ease-in-out infinite;transform-origin:10px 100px"><circle cx="10" cy="100" r="2" fill="#8B7355" opacity=".3"/></g>
<g style="animation:float 3s ease-in-out infinite;animation-delay:-.8s;transform-origin:8px 86px"><circle cx="8" cy="86" r="1.5" fill="#8B7355" opacity=".2"/></g>
<g style="animation:float 3s ease-in-out infinite;animation-delay:-1.5s;transform-origin:16px 78px"><circle cx="16" cy="78" r="1.5" fill="#D6CEBF" opacity=".5"/></g>
<!-- right side: open space, territory not map -->
<text x="195" y="110" text-anchor="middle" font-size="7.5" fill="#8B7355" opacity=".38" font-family="Georgia,serif">the map</text>
<text x="230" y="110" text-anchor="middle" font-size="7.5" fill="#8B7355" opacity=".38" font-family="Georgia,serif">≠</text>
<text x="265" y="110" text-anchor="middle" font-size="7.5" fill="#7A9E8E" opacity=".45" font-family="Georgia,serif">the territory</text>
</svg>
    */

  const svgContent = (
    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* Step number ghost */}
      <SvgText x="228" y="80" fontFamily="Georgia, serif" fontSize="72" fill="#C8923A" opacity={0.07}>3</SvgText>

      {/* Body (terracotta) — holding the certainty block */}
      <Path
        d="M80 196 Q62 172 60 146 Q58 122 70 100 Q82 78 98 72 Q114 66 126 78 Q138 90 140 114 Q142 138 128 166 Q114 192 96 200Z"
        fill="#B5593A"
        opacity={0.85}
      />
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth={2.5} strokeLinecap="round">
        <Path d="M62 108 Q94 102 138 106" />
        <Path d="M60 122 Q93 117 139 120" />
        <Path d="M61 136 Q93 131 138 134" />
        <Path d="M62 150 Q93 145 136 148" />
      </G>
      <Ellipse cx="98" cy="64" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth={1} rotation={4} origin="98, 64" />
      <Path d="M84 52 Q92 42 100 40 Q108 38 114 46" fill="none" stroke="#2C2C2A" strokeWidth={0.9} strokeLinecap="round" opacity={0.6} />

      {/* The certainty block — dissolving at edges */}
      <Rect x="18" y="108" width="32" height="22" rx="3" fill="#8B7355" opacity={0.3} />
      <Rect x="18" y="108" width="32" height="22" rx="3" fill="none" stroke="#8B7355" strokeWidth={0.6} opacity={0.4} strokeDasharray="3 4" />
      <SvgText x="34" y="123" textAnchor="middle" fontSize="5.5" fill="#8B7355" opacity={0.5} fontFamily="Georgia, serif">the story</SvgText>

      {/* Particles releasing from block */}
      <Circle cx="10" cy="100" r="2" fill="#8B7355" opacity={0.3} />
      <Circle cx="8" cy="86" r="1.5" fill="#8B7355" opacity={0.2} />
      <Circle cx="16" cy="78" r="1.5" fill="#D6CEBF" opacity={0.5} />

      {/* Right side: territory not map */}
      <SvgText x="195" y="110" textAnchor="middle" fontSize="7.5" fill="#8B7355" opacity={0.38} fontFamily="Georgia, serif">the map</SvgText>
      <SvgText x="230" y="110" textAnchor="middle" fontSize="7.5" fill="#8B7355" opacity={0.38} fontFamily="Georgia, serif">{"≠"}</SvgText>
      <SvgText x="265" y="110" textAnchor="middle" fontSize="7.5" fill="#7A9E8E" opacity={0.45} fontFamily="Georgia, serif">the territory</SvgText>

    </Svg>
  );

  return animated ? (
    <ReAnimated.View style={animStyle}>
      {svgContent}
    </ReAnimated.View>
  ) : svgContent;
}
