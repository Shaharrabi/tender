/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          assess-ch1-full
 * Component:   IllustrationAssessCloseness
 * Screen:      app/(app)/results.tsx  →  chapter 1 results card
 * Description: Chapter 1 result — 4 style bodies with labels, for results screen
 * ViewBox:     0 0 220 200
 *
 * USAGE:
 *   import { IllustrationAssessCloseness } from '@/assets/graphics/illustrations/index';
 *   <IllustrationAssessCloseness width={screenWidth} />
 *
 * CONVERSION NOTES (Claude Code — do these in order):
 *   1. Replace <svg>       →  <Svg viewBox="0 0 220 200" width={width} height={resolvedHeight}>
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

export function IllustrationAssessCloseness({ width = 220, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (200 / 220));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="16" x2="220" y2="16"/><line x1="0" y1="30" x2="220" y2="30"/><line x1="0" y1="44" x2="220" y2="44"/><line x1="0" y1="58" x2="220" y2="58"/><line x1="0" y1="72" x2="220" y2="72"/><line x1="0" y1="86" x2="220" y2="86"/><line x1="0" y1="100" x2="220" y2="100"/><line x1="0" y1="114" x2="220" y2="114"/><line x1="0" y1="128" x2="220" y2="128"/><line x1="0" y1="142" x2="220" y2="142"/><line x1="0" y1="156" x2="220" y2="156"/><line x1="0" y1="170" x2="220" y2="170"/><line x1="0" y1="184" x2="220" y2="184"/></g>

<!-- Four abstract bodies — distinct poses for each attachment style -->
<!-- SECURE: standing open, warm sage, both arms gently out -->
<path d="M152 170 Q142 152 140 132 Q138 114 146 100 Q154 86 164 82 Q174 78 180 88 Q186 98 186 118 Q186 138 178 156 Q172 170 162 174Z" fill="#7A9E8E" opacity=".82" style="animation:breathe 5s ease-in-out infinite;transform-origin:163px 128px"/>
<ellipse cx="162" cy="74" rx="14" ry="17" fill="none" stroke="#2C2C2A" stroke-width=".9"/>
<path d="M153 64 Q160 56 164 54 Q168 52 172 58" fill="none" stroke="#2C2C2A" stroke-width=".8" stroke-linecap="round" opacity=".6"/>
<text x="163" y="183" text-anchor="middle" font-size="7" fill="#7A9E8E" opacity=".7" font-family="Georgia,serif">secure</text>

<!-- ANXIOUS-PREOCCUPIED: round body, leaning/reaching — NOT phallic, wider squat shape -->
<path d="M30 166 Q18 148 18 128 Q18 110 28 96 Q38 82 50 78 Q62 74 68 84 Q74 94 72 114 Q70 134 58 154 Q50 166 38 170Z" fill="#D4909A" opacity=".82" style="animation:breathe 4s ease-in-out infinite;transform-origin:46px 124px"/>
<!-- arm reaching: horizontal, not vertical -->
<ellipse cx="46" cy="70" rx="16" ry="14" fill="none" stroke="#2C2C2A" stroke-width=".9" transform="rotate(5 46 70)"/>
<path d="M36 63 Q44 56 50 55 Q56 54 60 60" fill="none" stroke="#2C2C2A" stroke-width=".8" stroke-linecap="round" opacity=".6"/>
<text x="46" y="180" text-anchor="middle" font-size="7" fill="#D4909A" opacity=".7" font-family="Georgia,serif">anxious-preoccupied</text>

<!-- DISMISSIVE-AVOIDANT: tall navy body, arms crossed, turned slightly away -->
<path d="M102 172 Q90 152 88 130 Q86 110 96 94 Q106 78 118 74 Q130 70 136 82 Q142 94 140 118 Q138 142 126 164 Q118 178 108 176Z" fill="#1E3A52" opacity=".82"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M90 108 Q112 103 138 106"/><path d="M89 120" /><path d="M90 120 Q112 116 138 118"/></g>
<!-- arms crossed self: folded across chest -->
<ellipse cx="112" cy="66" rx="14" ry="17" fill="none" stroke="#2C2C2A" stroke-width=".9" transform="rotate(-4 112 66)"/>
<path d="M102 56 Q110 48 114 46 Q118 44 122 50" fill="none" stroke="#2C2C2A" stroke-width=".8" stroke-linecap="round" opacity=".6"/>
<text x="112" y="183" text-anchor="middle" font-size="7" fill="#1E3A52" opacity=".65" font-family="Georgia,serif">dismissive-avoidant</text>

<!-- FEARFUL-AVOIDANT: plum body, slightly twisted, ambivalent posture -->
<path d="M180 170 Q170 150 168 128 Q166 108 176 92 Q186 76 198 74 Q210 72 214 86 Q218 100 214 124 Q210 148 200 168 Q194 178 186 174Z" fill="#6E4E6E" opacity=".78" transform="rotate(6 190 124)"/>
<!-- ambivalent: one arm reaching, one pulling back -->
<ellipse cx="194" cy="66" rx="14" ry="17" fill="none" stroke="#2C2C2A" stroke-width=".9"/>

<text x="110" y="194" text-anchor="middle" font-family="Georgia,serif" font-size="7.5" letter-spacing="2" fill="#2C2C2A" opacity=".4">CH.1 · HOW YOU SEEK CLOSENESS</text>
</svg>
    */

    <Svg viewBox="0 0 220 200" width={width} height={resolvedHeight} style={style}>

      {/* SECURE: standing open, warm sage */}
      {/* TODO: animation breathe 5s */}
      <Path d="M152 170 Q142 152 140 132 Q138 114 146 100 Q154 86 164 82 Q174 78 180 88 Q186 98 186 118 Q186 138 178 156 Q172 170 162 174Z" fill="#7A9E8E" opacity={0.82}/>
      <Ellipse cx="162" cy="74" rx="14" ry="17" fill="none" stroke="#2C2C2A" strokeWidth=".9"/>
      <Path d="M153 64 Q160 56 164 54 Q168 52 172 58" fill="none" stroke="#2C2C2A" strokeWidth=".8" strokeLinecap="round" opacity={0.6}/>
      <SvgText x="163" y="183" textAnchor="middle" fontSize="7" fill="#7A9E8E" opacity={0.7} fontFamily="Georgia,serif">secure</SvgText>

      {/* ANXIOUS-PREOCCUPIED: round body, leaning/reaching */}
      {/* TODO: animation breathe 4s */}
      <Path d="M30 166 Q18 148 18 128 Q18 110 28 96 Q38 82 50 78 Q62 74 68 84 Q74 94 72 114 Q70 134 58 154 Q50 166 38 170Z" fill="#D4909A" opacity={0.82}/>
      <Ellipse cx="46" cy="70" rx="16" ry="14" fill="none" stroke="#2C2C2A" strokeWidth=".9" rotation={5} origin="46, 70"/>
      <Path d="M36 63 Q44 56 50 55 Q56 54 60 60" fill="none" stroke="#2C2C2A" strokeWidth=".8" strokeLinecap="round" opacity={0.6}/>
      <SvgText x="46" y="180" textAnchor="middle" fontSize="7" fill="#D4909A" opacity={0.7} fontFamily="Georgia,serif">anxious-preoccupied</SvgText>

      {/* DISMISSIVE-AVOIDANT: tall navy body, arms crossed */}
      <Path d="M102 172 Q90 152 88 130 Q86 110 96 94 Q106 78 118 74 Q130 70 136 82 Q142 94 140 118 Q138 142 126 164 Q118 178 108 176Z" fill="#1E3A52" opacity={0.82}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
        <Path d="M90 108 Q112 103 138 106"/>
        <Path d="M89 120" />
        <Path d="M90 120 Q112 116 138 118"/>
      </G>
      <Ellipse cx="112" cy="66" rx="14" ry="17" fill="none" stroke="#2C2C2A" strokeWidth=".9" rotation={-4} origin="112, 66"/>
      <Path d="M102 56 Q110 48 114 46 Q118 44 122 50" fill="none" stroke="#2C2C2A" strokeWidth=".8" strokeLinecap="round" opacity={0.6}/>
      <SvgText x="112" y="183" textAnchor="middle" fontSize="7" fill="#1E3A52" opacity={0.65} fontFamily="Georgia,serif">dismissive-avoidant</SvgText>

      {/* FEARFUL-AVOIDANT: plum body, slightly twisted */}
      <Path d="M180 170 Q170 150 168 128 Q166 108 176 92 Q186 76 198 74 Q210 72 214 86 Q218 100 214 124 Q210 148 200 168 Q194 178 186 174Z" fill="#6E4E6E" opacity={0.78} rotation={6} origin="190, 124"/>
      <Ellipse cx="194" cy="66" rx="14" ry="17" fill="none" stroke="#2C2C2A" strokeWidth=".9"/>

      <SvgText x="110" y="194" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2" fill="#2C2C2A" opacity={0.4}>{"CH.1 \u00B7 HOW YOU SEEK CLOSENESS"}</SvgText>
    </Svg>
  );
}
