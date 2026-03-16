/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          portal-pairing6
 * Component:   IllustrationPairing06
 * Screen:      app/(app)/couple-portal.tsx  →  anxious+dismissive pairing
 * Description: Pairing 6 — Anxious+Dismissive — pursuer leans in, distancer tilts away
 * ViewBox:     0 0 300 240
 *
 * USAGE:
 *   import { IllustrationPairing06 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationPairing06 width={screenWidth} />
 *
 * CONVERSION NOTES (Claude Code — do these in order):
 *   1. Replace <svg>       →  <Svg viewBox="0 0 300 240" width={width} height={resolvedHeight}>
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

export function IllustrationPairing06({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (240 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/><line x1="0" y1="200" x2="300" y2="200"/><line x1="0" y1="214" x2="300" y2="214"/></g>

<!-- open field beneath: the shared ground -->
<g opacity=".18"><path d="M0 208 Q60 198 120 205 Q180 212 240 200 Q270 195 300 198" fill="none" stroke="#7CA4B8" stroke-width="1.4" stroke-linecap="round"/><path d="M0 220 Q60 212 122 218 Q182 224 240 213 Q270 208 300 210" fill="none" stroke="#7CA4B8" stroke-width=".9" stroke-linecap="round" opacity=".65"/></g>

<!-- ANXIOUS: blush, leaning forward, arm reaching -->
<path d="M56 200 Q38 178 36 154 Q34 132 46 112 Q58 92 74 86 Q90 80 102 92 Q114 104 116 128 Q118 152 104 176 Q92 198 74 206Z" fill="#D4909A" opacity=".82" style="animation:breathe 4s ease-in-out infinite;transform-origin:76px 143px"/>
<ellipse cx="74" cy="78" rx="20" ry="24" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M60 66 Q70 56 76 54 Q82 52 86 60" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>
<!-- reaching arm -->
<!-- panic dot: the desperate need -->
<g style="animation:pulse 1.8s ease-in-out infinite"><circle cx="152" cy="122" r="5" fill="#D4909A" opacity=".5"/></g>

<!-- DISMISSIVE-AVOIDANT: navy, leaning away, arms self-hugging -->
<path d="M244 200 Q262 178 264 154 Q266 132 254 112 Q242 92 226 86 Q210 80 198 92 Q186 104 184 128 Q182 152 196 176 Q208 198 226 206Z" fill="#1E3A52" opacity=".82" style="animation:breathe 5s ease-in-out infinite;animation-delay:-2s;transform-origin:224px 143px" transform="rotate(-6 224 143)"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2.2" stroke-linecap="round"><path d="M186 124 Q210 118 262 122"/><path d="M184 138 Q209 133 263 136"/><path d="M185 152 Q209 147 262 150"/></g>
<ellipse cx="224" cy="78" rx="20" ry="24" fill="none" stroke="#2C2C2A" stroke-width="1" transform="rotate(-6 224 78)"/>
<!-- arms self-crossed -->

<!-- the gap between them: the pursue-distance gap -->
<path d="M148 150 Q166 140 184 150" fill="none" stroke="#D6CEBF" stroke-width=".8" stroke-dasharray="2 4" opacity=".45"/>
<text x="166" y="164" text-anchor="middle" font-size="6.5" fill="#8B7355" opacity=".4" font-family="Georgia,serif">the classic dance</text>
<!-- cycle arrows -->
<path d="M128 118 Q150 108 172 118" fill="none" stroke="#8B7355" stroke-width=".7" stroke-dasharray="2 3" opacity=".4"/>
<path d="M172 158 Q150 168 128 158" fill="none" stroke="#8B7355" stroke-width=".7" stroke-dasharray="2 3" opacity=".4"/>

<!-- pairing badge -->
<rect x="96" y="16" width="108" height="16" rx="5" fill="#D4909A" opacity=".15"/>
<text x="150" y="27" text-anchor="middle" font-size="7.5" fill="#B5593A" opacity=".7" font-family="Georgia,serif">anxious-preoccupied + dismissive-avoidant</text>

<text x="150" y="230" text-anchor="middle" font-family="Georgia,serif" font-size="7.5" letter-spacing="2" fill="#2C2C2A" opacity=".4">PAIRING 6 · PURSUER-DISTANCER</text>
</svg>
    */

    <Svg viewBox="0 0 300 240" width={width} height={resolvedHeight} style={style}>
      <G opacity={.18}><Path d="M0 208 Q60 198 120 205 Q180 212 240 200 Q270 195 300 198" fill="none" stroke="#7CA4B8" strokeWidth="1.4" strokeLinecap="round"/><Path d="M0 220 Q60 212 122 218 Q182 224 240 213 Q270 208 300 210" fill="none" stroke="#7CA4B8" strokeWidth=".9" strokeLinecap="round" opacity={.65}/></G>
      <Path d="M56 200 Q38 178 36 154 Q34 132 46 112 Q58 92 74 86 Q90 80 102 92 Q114 104 116 128 Q118 152 104 176 Q92 198 74 206Z" fill="#D4909A" opacity={.82}/>
      <Ellipse cx="74" cy="78" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
      <Path d="M60 66 Q70 56 76 54 Q82 52 86 60" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={.6}/>
      <G><Circle cx="152" cy="122" r="5" fill="#D4909A" opacity={.5}/></G>
      <Path d="M244 200 Q262 178 264 154 Q266 132 254 112 Q242 92 226 86 Q210 80 198 92 Q186 104 184 128 Q182 152 196 176 Q208 198 226 206Z" fill="#1E3A52" opacity={.82} rotation={-6} origin="224, 143"/>
      <G opacity={.2} stroke="#F2EDE4" strokeWidth="2.2" strokeLinecap="round"><Path d="M186 124 Q210 118 262 122"/><Path d="M184 138 Q209 133 263 136"/><Path d="M185 152 Q209 147 262 150"/></G>
      <Ellipse cx="224" cy="78" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1" rotation={-6} origin="224, 78"/>
      <Path d="M148 150 Q166 140 184 150" fill="none" stroke="#D6CEBF" strokeWidth=".8" strokeDasharray="2 4" opacity={.45}/>
      <SvgText x="166" y="168" textAnchor="middle" fontSize="14" fill="#8B7355" opacity={.5} fontFamily="Georgia,serif">the classic dance</SvgText>
      <Path d="M128 118 Q150 108 172 118" fill="none" stroke="#8B7355" strokeWidth=".7" strokeDasharray="2 3" opacity={.4}/>
      <Path d="M172 158 Q150 168 128 158" fill="none" stroke="#8B7355" strokeWidth=".7" strokeDasharray="2 3" opacity={.4}/>
      <Rect x="16" y="12" width="268" height="22" rx="5" fill="#D4909A" opacity={.15}/>
      <SvgText x="150" y="29" textAnchor="middle" fontSize="14" fill="#B5593A" opacity={.8} fontFamily="Georgia,serif">anxious + dismissive-avoidant</SvgText>
      <SvgText x="150" y="232" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" letterSpacing="2" fill="#2C2C2A" opacity={.5}>{"PAIRING 6 · PURSUER-DISTANCER"}</SvgText>
    </Svg>
  );
}
