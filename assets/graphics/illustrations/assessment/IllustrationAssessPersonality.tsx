/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          assess-ch2-full
 * Component:   IllustrationAssessPersonality
 * Screen:      app/(app)/results.tsx  →  chapter 2 results card
 * Description: Chapter 2 result — personality pentagon, Big Five landscape
 * ViewBox:     0 0 220 200
 *
 * USAGE:
 *   import { IllustrationAssessPersonality } from '@/assets/graphics/illustrations/index';
 *   <IllustrationAssessPersonality width={screenWidth} />
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

export function IllustrationAssessPersonality({ width = 220, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (200 / 220));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="16" x2="220" y2="16"/><line x1="0" y1="30" x2="220" y2="30"/><line x1="0" y1="44" x2="220" y2="44"/><line x1="0" y1="58" x2="220" y2="58"/><line x1="0" y1="72" x2="220" y2="72"/><line x1="0" y1="86" x2="220" y2="86"/><line x1="0" y1="100" x2="220" y2="100"/><line x1="0" y1="114" x2="220" y2="114"/><line x1="0" y1="128" x2="220" y2="128"/><line x1="0" y1="142" x2="220" y2="142"/><line x1="0" y1="156" x2="220" y2="156"/><line x1="0" y1="170" x2="220" y2="170"/><line x1="0" y1="184" x2="220" y2="184"/></g>

<!-- Large body: navy, stripe-heavy, with a pentagon INSIDE the torso — landscape not diagnosis -->
<path d="M70 178 Q52 156 50 130 Q48 106 60 84 Q72 62 90 56 Q108 50 122 64 Q136 78 138 104 Q140 130 126 158 Q112 182 92 186Z" fill="#1E3A52" opacity=".8" style="animation:breathe 5.5s ease-in-out infinite;transform-origin:94px 120px"/>
<g opacity=".2" stroke="#F2EDE4" stroke-width="2.5" stroke-linecap="round">
<path d="M52 92 Q90 86 136 90"/><path d="M50 106 Q89 101 137 104"/><path d="M50 120 Q89 115 137 118"/><path d="M51 134 Q89 129 135 132"/><path d="M53 148 Q89 143 132 146"/>
</g>
<ellipse cx="92" cy="48" rx="20" ry="24" fill="none" stroke="#2C2C2A" stroke-width="1"/>
<path d="M78 36 Q88 26 94 24 Q100 22 106 30" fill="none" stroke="#2C2C2A" stroke-width=".9" stroke-linecap="round" opacity=".6"/>

<!-- Pentagon radar inside torso — using mustard/blush/sage/dusty/plum -->
<polygon points="94,72 116,90 108,116 80,116 72,90" fill="none" stroke="#C8923A" stroke-width=".9" opacity=".55" style="animation:pulse 4s ease-in-out infinite"/>
<!-- filled sub-polygon: actual scores would vary this -->
<polygon points="94,82 106,96 100,112 88,112 82,96" fill="#C8923A" opacity=".1"/>

<!-- 5 trait labels at each point -->
<text x="94" y="68" text-anchor="middle" font-size="6" fill="#C8923A" opacity=".75" font-family="Georgia,serif">openness</text>
<text x="122" y="92" font-size="6" fill="#D4909A" opacity=".7" font-family="Georgia,serif">C</text>
<text x="114" y="122" font-size="6" fill="#7CA4B8" opacity=".7" font-family="Georgia,serif">E</text>
<text x="64" y="122" text-anchor="end" font-size="6" fill="#7A9E8E" opacity=".7" font-family="Georgia,serif">A</text>
<text x="66" y="92" text-anchor="end" font-size="6" fill="#6E4E6E" opacity=".7" font-family="Georgia,serif">N</text>

<!-- legend -->
<text x="152" y="72" font-size="5.5" fill="#C8923A" opacity=".6" font-family="Georgia,serif">O openness</text>
<text x="152" y="84" font-size="5.5" fill="#D4909A" opacity=".6" font-family="Georgia,serif">C conscient.</text>
<text x="152" y="96" font-size="5.5" fill="#7CA4B8" opacity=".6" font-family="Georgia,serif">E extraversion</text>
<text x="152" y="108" font-size="5.5" fill="#7A9E8E" opacity=".6" font-family="Georgia,serif">A agreeableness</text>
<text x="152" y="120" font-size="5.5" fill="#6E4E6E" opacity=".6" font-family="Georgia,serif">N neuroticism</text>

<text x="110" y="194" text-anchor="middle" font-family="Georgia,serif" font-size="7.5" letter-spacing="2" fill="#2C2C2A" opacity=".4">CH.2 · WHO YOU ARE IN LOVE</text>
</svg>
    */

    <Svg viewBox="0 0 220 200" width={width} height={resolvedHeight} style={style}>

      {/* Large body: navy, stripe-heavy */}
      {/* TODO: animation breathe 5.5s */}
      <Path d="M70 178 Q52 156 50 130 Q48 106 60 84 Q72 62 90 56 Q108 50 122 64 Q136 78 138 104 Q140 130 126 158 Q112 182 92 186Z" fill="#1E3A52" opacity={0.8}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
        <Path d="M52 92 Q90 86 136 90"/>
        <Path d="M50 106 Q89 101 137 104"/>
        <Path d="M50 120 Q89 115 137 118"/>
        <Path d="M51 134 Q89 129 135 132"/>
        <Path d="M53 148 Q89 143 132 146"/>
      </G>
      <Ellipse cx="92" cy="48" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
      <Path d="M78 36 Q88 26 94 24 Q100 22 106 30" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>

      {/* Pentagon radar inside torso */}
      {/* TODO: animation pulse 4s */}
      <Polygon points="94,72 116,90 108,116 80,116 72,90" fill="none" stroke="#C8923A" strokeWidth=".9" opacity={0.55}/>
      <Polygon points="94,82 106,96 100,112 88,112 82,96" fill="#C8923A" opacity={0.1}/>

      {/* 5 trait labels */}
      <SvgText x="94" y="68" textAnchor="middle" fontSize="6" fill="#C8923A" opacity={0.75} fontFamily="Georgia,serif">openness</SvgText>
      <SvgText x="122" y="92" fontSize="6" fill="#D4909A" opacity={0.7} fontFamily="Georgia,serif">C</SvgText>
      <SvgText x="114" y="122" fontSize="6" fill="#7CA4B8" opacity={0.7} fontFamily="Georgia,serif">E</SvgText>
      <SvgText x="64" y="122" textAnchor="end" fontSize="6" fill="#7A9E8E" opacity={0.7} fontFamily="Georgia,serif">A</SvgText>
      <SvgText x="66" y="92" textAnchor="end" fontSize="6" fill="#6E4E6E" opacity={0.7} fontFamily="Georgia,serif">N</SvgText>

      {/* legend */}
      <SvgText x="152" y="72" fontSize="5.5" fill="#C8923A" opacity={0.6} fontFamily="Georgia,serif">O openness</SvgText>
      <SvgText x="152" y="84" fontSize="5.5" fill="#D4909A" opacity={0.6} fontFamily="Georgia,serif">C conscient.</SvgText>
      <SvgText x="152" y="96" fontSize="5.5" fill="#7CA4B8" opacity={0.6} fontFamily="Georgia,serif">E extraversion</SvgText>
      <SvgText x="152" y="108" fontSize="5.5" fill="#7A9E8E" opacity={0.6} fontFamily="Georgia,serif">A agreeableness</SvgText>
      <SvgText x="152" y="120" fontSize="5.5" fill="#6E4E6E" opacity={0.6} fontFamily="Georgia,serif">N neuroticism</SvgText>

      <SvgText x="110" y="194" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2" fill="#2C2C2A" opacity={0.4}>{"CH.2 \u00B7 WHO YOU ARE IN LOVE"}</SvgText>
    </Svg>
  );
}
