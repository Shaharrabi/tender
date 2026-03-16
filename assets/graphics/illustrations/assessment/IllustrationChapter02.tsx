/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          ch2-love
 * Component:   IllustrationChapter02
 * Screen:      app/(app)/tender-assessment.tsx  →  chapter 2 intro card
 * Description: Chapter 2 — Who You Are in Love — body with pentagon radar inside torso
 * ViewBox:     0 0 300 220
 *
 * USAGE:
 *   import { IllustrationChapter02 } from '@/assets/graphics/illustrations/index';
 *   <IllustrationChapter02 width={screenWidth} />
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

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationChapter02({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (220 / 300));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
<g class="ln"><line x1="0" y1="18" x2="300" y2="18"/><line x1="0" y1="32" x2="300" y2="32"/><line x1="0" y1="46" x2="300" y2="46"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="74" x2="300" y2="74"/><line x1="0" y1="88" x2="300" y2="88"/><line x1="0" y1="102" x2="300" y2="102"/><line x1="0" y1="116" x2="300" y2="116"/><line x1="0" y1="130" x2="300" y2="130"/><line x1="0" y1="144" x2="300" y2="144"/><line x1="0" y1="158" x2="300" y2="158"/><line x1="0" y1="172" x2="300" y2="172"/><line x1="0" y1="186" x2="300" y2="186"/></g>
<!-- Big Five: pentagon radar as organic body-within-body shape -->
<!-- body at center -->
<path d="M96 188 Q76 164 74 138 Q72 114 84 92 Q96 70 114 64 Q132 58 146 72 Q160 86 162 110 Q164 134 148 162 Q132 188 112 196Z" fill="#B5593A" opacity=".75" style="animation:breathe 5.5s ease-in-out infinite;transform-origin:118px 130px"/>
<ellipse cx="114" cy="56" rx="18" ry="22" fill="none" stroke="#2C2C2A" stroke-width=".9"/>
<!-- pentagon inside body: the 5 traits -->
<polygon points="118,80 140,98 132,122 104,122 96,98" fill="none" stroke="#C8923A" stroke-width=".8" opacity=".55" style="animation:pulse 3s ease-in-out infinite"/>
<!-- trait labels radiating from pentagon points -->
<text x="118" y="76" text-anchor="middle" font-size="6.5" fill="#C8923A" opacity=".65" font-family="Georgia,serif">openness</text>
<text x="148" y="98" font-size="6.5" fill="#C8923A" opacity=".6" font-family="Georgia,serif">conscient.</text>
<text x="140" y="130" font-size="6.5" fill="#7CA4B8" opacity=".6" font-family="Georgia,serif">extraversion</text>
<text x="72" y="130" text-anchor="end" font-size="6.5" fill="#7A9E8E" opacity=".6" font-family="Georgia,serif">agreeable.</text>
<text x="82" y="98" text-anchor="end" font-size="6.5" fill="#D4909A" opacity=".6" font-family="Georgia,serif">neuroticism</text>
<!-- relational reframe note -->
<text x="214" y="100" font-size="6.5" fill="#8B7355" opacity=".4" font-family="Georgia,serif">not a diagnosis</text>
<text x="214" y="114" font-size="6.5" fill="#8B7355" opacity=".4" font-family="Georgia,serif">a landscape</text>
<text x="150" y="208" text-anchor="middle" font-family="Georgia,serif" font-size="8" letter-spacing="3" fill="#2C2C2A" opacity=".4">BIG FIVE</text>
</svg>
    */

    <Svg viewBox="0 0 300 220" width={width} height={resolvedHeight} style={style}>

      {/* body at center */}
      {/* TODO: animation breathe 5.5s */}
      <Path d="M96 188 Q76 164 74 138 Q72 114 84 92 Q96 70 114 64 Q132 58 146 72 Q160 86 162 110 Q164 134 148 162 Q132 188 112 196Z" fill="#B5593A" opacity={0.75}/>
      <Ellipse cx="114" cy="56" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth=".9"/>

      {/* pentagon inside body */}
      {/* TODO: animation pulse 3s */}
      <Polygon points="118,80 140,98 132,122 104,122 96,98" fill="none" stroke="#C8923A" strokeWidth=".8" opacity={0.55}/>

      {/* trait labels */}
      <SvgText x="118" y="76" textAnchor="middle" fontSize="6.5" fill="#C8923A" opacity={0.65} fontFamily="Georgia,serif">openness</SvgText>
      <SvgText x="148" y="98" fontSize="6.5" fill="#C8923A" opacity={0.6} fontFamily="Georgia,serif">conscient.</SvgText>
      <SvgText x="140" y="130" fontSize="6.5" fill="#7CA4B8" opacity={0.6} fontFamily="Georgia,serif">extraversion</SvgText>
      <SvgText x="72" y="130" textAnchor="end" fontSize="6.5" fill="#7A9E8E" opacity={0.6} fontFamily="Georgia,serif">agreeable.</SvgText>
      <SvgText x="82" y="98" textAnchor="end" fontSize="6.5" fill="#D4909A" opacity={0.6} fontFamily="Georgia,serif">neuroticism</SvgText>

      {/* relational reframe note */}
      <SvgText x="214" y="100" fontSize="6.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">not a diagnosis</SvgText>
      <SvgText x="214" y="114" fontSize="6.5" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">a landscape</SvgText>

      <SvgText x="150" y="208" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>BIG FIVE</SvgText>
    </Svg>
  );
}
