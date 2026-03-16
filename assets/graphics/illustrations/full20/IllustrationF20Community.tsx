/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-community
 * Component:   IllustrationF20Community
 * Screen:      app/(app)/community.tsx  alt version
 * Description: Community — 6 diverse bodies + attachment room bubbles floating above
 * ViewBox:     0 0 480 340
 *
 * USAGE:
 *   import { IllustrationF20Community } from '@/assets/graphics/illustrations/index';
 *   <IllustrationF20Community width={screenWidth} />
 *
 * CONVERSION NOTES (Claude Code — do these in order):
 *   1. Replace <svg>       →  <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight}>
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

export function IllustrationF20Community({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 480));
  // TODO: Convert CSS animations to Reanimated hooks
  // import { useBreathe, useFloat, usePulse } from '@/hooks/useIllustrationAnimation';

  return (
    // ── PASTE CONVERTED SVG BELOW (replace tags as per notes above) ──
    // Raw SVG source preserved as comment for reference during conversion:

    /*
<svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg">
<g class="lines"><line x1="0" y1="24" x2="480" y2="24"/><line x1="0" y1="42" x2="480" y2="42"/><line x1="0" y1="60" x2="480" y2="60"/><line x1="0" y1="78" x2="480" y2="78"/><line x1="0" y1="96" x2="480" y2="96"/><line x1="0" y1="114" x2="480" y2="114"/><line x1="0" y1="132" x2="480" y2="132"/><line x1="0" y1="150" x2="480" y2="150"/><line x1="0" y1="168" x2="480" y2="168"/><line x1="0" y1="186" x2="480" y2="186"/><line x1="0" y1="204" x2="480" y2="204"/><line x1="0" y1="222" x2="480" y2="222"/><line x1="0" y1="240" x2="480" y2="240"/><line x1="0" y1="258" x2="480" y2="258"/><line x1="0" y1="276" x2="480" y2="276"/><line x1="0" y1="294" x2="480" y2="294"/></g>

<!-- shared field all figures stand in -->
<g opacity="0.2">
<path d="M0 296 Q80 282 160 290 Q240 298 320 284 Q400 270 480 276" fill="none" stroke="#7CA4B8" stroke-width="1.8" stroke-linecap="round"/>
<path d="M0 310 Q80 298 162 305 Q244 312 322 298 Q402 284 480 290" fill="none" stroke="#7CA4B8" stroke-width="1.2" stroke-linecap="round" opacity="0.65"/>
</g>

<!-- attachment style rings floating above — their rooms -->
<g style="animation:float 4s ease-in-out infinite;transform-origin:90px 72px">
<circle cx="90" cy="72" r="24" fill="none" stroke="#B5593A" stroke-width="0.75" opacity="0.38"/>
<text x="90" y="76" text-anchor="middle" font-size="7.5" fill="#B5593A" opacity="0.55" font-family="Georgia,serif">anxious</text>
</g>
<g style="animation:float 4s ease-in-out infinite;animation-delay:-1s;transform-origin:200px 56px">
<circle cx="200" cy="56" r="24" fill="none" stroke="#1E3A52" stroke-width="0.75" opacity="0.38"/>
<text x="200" y="60" text-anchor="middle" font-size="7.5" fill="#1E3A52" opacity="0.55" font-family="Georgia,serif">avoidant</text>
</g>
<g style="animation:float 4s ease-in-out infinite;animation-delay:-2s;transform-origin:310px 68px">
<circle cx="310" cy="68" r="24" fill="none" stroke="#7A9E8E" stroke-width="0.75" opacity="0.38"/>
<text x="310" y="72" text-anchor="middle" font-size="7.5" fill="#7A9E8E" opacity="0.55" font-family="Georgia,serif">secure</text>
</g>
<g style="animation:float 4s ease-in-out infinite;animation-delay:-3s;transform-origin:410px 60px">
<circle cx="410" cy="60" r="26" fill="none" stroke="#C8923A" stroke-width="0.75" opacity="0.38"/>
<text x="410" y="64" text-anchor="middle" font-size="7" fill="#C8923A" opacity="0.55" font-family="Georgia,serif">disorganized</text>
</g>

<!-- 6 community figures, wildly different -->
<!-- Fig 1: terracotta stripe, tall -->
<path d="M44 296 Q36 272 39 246 Q42 222 54 214 Q66 206 72 218 Q78 230 74 258 Q70 284 60 300Z" fill="#B5593A" opacity="0.8" style="animation:breathe 4.8s ease-in-out infinite"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="2" stroke-linecap="round"><path d="M38 228 Q55 222 72 227"/><path d="M37 242 Q55 236 73 241"/></g>
<ellipse cx="54" cy="204" rx="14" ry="17" fill="none" stroke="#2C2C2A" stroke-width="0.9"/>
<!-- Fig 2: sage/teal, round, small -->
<path d="M106 298 Q100 278 102 258 Q104 240 116 233 Q128 226 132 240 Q136 254 130 276 Q124 298 114 302Z" fill="#7A9E8E" opacity="0.75" style="animation:breathe 5s ease-in-out infinite;animation-delay:-1.2s"/>
<ellipse cx="114" cy="224" rx="13" ry="16" fill="none" stroke="#2C2C2A" stroke-width="0.85"/>
<!-- Fig 3: navy, dense stripes, medium -->
<path d="M172 296 Q164 272 167 245 Q170 220 184 212 Q198 204 204 218 Q210 232 204 260 Q198 288 186 300Z" fill="#1E3A52" opacity="0.85" style="animation:breathe 5.2s ease-in-out infinite;animation-delay:-2s"/>
<g opacity="0.2" stroke="#F2EDE4" stroke-width="1.8" stroke-linecap="round"><path d="M166 228 Q184 222 206 226"/><path d="M165 242 Q183 237 207 240"/><path d="M166 256 Q183 251 205 254"/></g>
<ellipse cx="184" cy="202" rx="14" ry="17" fill="none" stroke="#2C2C2A" stroke-width="0.9"/>
<!-- Fig 4: mustard, tall, open arms -->
<path d="M256 294 Q246 266 249 236 Q252 208 268 198 Q284 188 290 206 Q296 224 288 256 Q280 288 266 298Z" fill="#C8923A" opacity="0.72" style="animation:breathe 5.8s ease-in-out infinite;animation-delay:-0.5s"/>
<ellipse cx="268" cy="186" rx="16" ry="20" fill="none" stroke="#2C2C2A" stroke-width="0.9"/>
<!-- Fig 5: blush, round, soft -->
<path d="M344 296 Q336 274 339 250 Q342 228 356 220 Q370 212 374 228 Q378 244 370 270 Q362 296 350 302Z" fill="#D4909A" opacity="0.7" style="animation:breathe 4.5s ease-in-out infinite;animation-delay:-3s"/>
<ellipse cx="354" cy="210" rx="14" ry="17" fill="none" stroke="#2C2C2A" stroke-width="0.85"/>
<!-- Fig 6: plum, small, leaning -->
<path d="M418 296 Q412 276 414 255 Q416 236 428 229 Q440 222 444 236 Q448 250 442 272 Q436 294 426 300Z" fill="#6E4E6E" opacity="0.7" style="animation:breathe 4s ease-in-out infinite;animation-delay:-1.5s"/>
<ellipse cx="428" cy="220" rx="13" ry="16" fill="none" stroke="#2C2C2A" stroke-width="0.85"/>

<!-- connecting threads -->
<g style="animation:pulse 3s ease-in-out infinite" opacity="0.3">
<line x1="72" y1="252" x2="102" y2="252" stroke="#C8923A" stroke-width="0.7" stroke-dasharray="3 4"/>
<line x1="132" y1="248" x2="166" y2="248" stroke="#C8923A" stroke-width="0.7" stroke-dasharray="3 4"/>
<line x1="204" y1="244" x2="248" y2="242" stroke="#C8923A" stroke-width="0.7" stroke-dasharray="3 4"/>
<line x1="290" y1="240" x2="338" y2="242" stroke="#C8923A" stroke-width="0.7" stroke-dasharray="3 4"/>
<line x1="374" y1="244" x2="414" y2="246" stroke="#C8923A" stroke-width="0.7" stroke-dasharray="3 4"/>
</g>
<text x="240" y="326" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="4" fill="#2C2C2A" opacity="0.45">COMMUNITY</text>
</svg>
    */

    <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight} style={style}>
      <G opacity={0.2}>
      <Path d="M0 296 Q80 282 160 290 Q240 298 320 284 Q400 270 480 276" fill="none" stroke="#7CA4B8" strokeWidth="1.8" strokeLinecap="round"/>
      <Path d="M0 310 Q80 298 162 305 Q244 312 322 298 Q402 284 480 290" fill="none" stroke="#7CA4B8" strokeWidth="1.2" strokeLinecap="round" opacity={0.65}/>
      </G>
      <G>
      <Circle cx="90" cy="72" r="24" fill="none" stroke="#B5593A" strokeWidth="0.75" opacity={0.38}/>
      <SvgText x="90" y="76" textAnchor="middle" fontSize="7.5" fill="#B5593A" opacity={0.55} fontFamily="Georgia,serif">anxious</SvgText>
      </G>
      <G>
      <Circle cx="200" cy="56" r="24" fill="none" stroke="#1E3A52" strokeWidth="0.75" opacity={0.38}/>
      <SvgText x="200" y="60" textAnchor="middle" fontSize="7.5" fill="#1E3A52" opacity={0.55} fontFamily="Georgia,serif">avoidant</SvgText>
      </G>
      <G>
      <Circle cx="310" cy="68" r="24" fill="none" stroke="#7A9E8E" strokeWidth="0.75" opacity={0.38}/>
      <SvgText x="310" y="72" textAnchor="middle" fontSize="7.5" fill="#7A9E8E" opacity={0.55} fontFamily="Georgia,serif">secure</SvgText>
      </G>
      <G>
      <Circle cx="410" cy="60" r="26" fill="none" stroke="#C8923A" strokeWidth="0.75" opacity={0.38}/>
      <SvgText x="410" y="64" textAnchor="middle" fontSize="7" fill="#C8923A" opacity={0.55} fontFamily="Georgia,serif">disorganized</SvgText>
      </G>
      <Path d="M44 296 Q36 272 39 246 Q42 222 54 214 Q66 206 72 218 Q78 230 74 258 Q70 284 60 300Z" fill="#B5593A" opacity={0.8}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round"><Path d="M38 228 Q55 222 72 227"/><Path d="M37 242 Q55 236 73 241"/></G>
      <Ellipse cx="54" cy="204" rx="14" ry="17" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      <Path d="M106 298 Q100 278 102 258 Q104 240 116 233 Q128 226 132 240 Q136 254 130 276 Q124 298 114 302Z" fill="#7A9E8E" opacity={0.75}/>
      <Ellipse cx="114" cy="224" rx="13" ry="16" fill="none" stroke="#2C2C2A" strokeWidth="0.85"/>
      <Path d="M172 296 Q164 272 167 245 Q170 220 184 212 Q198 204 204 218 Q210 232 204 260 Q198 288 186 300Z" fill="#1E3A52" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="1.8" strokeLinecap="round"><Path d="M166 228 Q184 222 206 226"/><Path d="M165 242 Q183 237 207 240"/><Path d="M166 256 Q183 251 205 254"/></G>
      <Ellipse cx="184" cy="202" rx="14" ry="17" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      <Path d="M256 294 Q246 266 249 236 Q252 208 268 198 Q284 188 290 206 Q296 224 288 256 Q280 288 266 298Z" fill="#C8923A" opacity={0.72}/>
      <Ellipse cx="268" cy="186" rx="16" ry="20" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      <Path d="M344 296 Q336 274 339 250 Q342 228 356 220 Q370 212 374 228 Q378 244 370 270 Q362 296 350 302Z" fill="#D4909A" opacity={0.7}/>
      <Ellipse cx="354" cy="210" rx="14" ry="17" fill="none" stroke="#2C2C2A" strokeWidth="0.85"/>
      <Path d="M418 296 Q412 276 414 255 Q416 236 428 229 Q440 222 444 236 Q448 250 442 272 Q436 294 426 300Z" fill="#6E4E6E" opacity={0.7}/>
      <Ellipse cx="428" cy="220" rx="13" ry="16" fill="none" stroke="#2C2C2A" strokeWidth="0.85"/>
      <G opacity={0.3}>
      <Line x1="72" y1="252" x2="102" y2="252" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
      <Line x1="132" y1="248" x2="166" y2="248" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
      <Line x1="204" y1="244" x2="248" y2="242" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
      <Line x1="290" y1="240" x2="338" y2="242" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
      <Line x1="374" y1="244" x2="414" y2="246" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
      </G>
      <SvgText x="240" y="326" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>COMMUNITY</SvgText>
    </Svg>
  );
}
