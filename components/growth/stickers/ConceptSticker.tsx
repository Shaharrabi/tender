/**
 * ConceptSticker — Animated SVG stickers for core therapeutic concepts.
 *
 * Each concept has a unique visual metaphor matching the Tender Sticker System.
 * These appear in teaching sections, tooltips, and the learning modules.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Path, Line, G, Text as SvgText, Ellipse } from 'react-native-svg';

const S = {
  blush: '#E8B4B8',
  sage: '#A8B5A2',
  mustard: '#D4A843',
  cream: '#F5F0E8',
  dustyBlue: '#8BA4B8',
  terracotta: '#C4836A',
  plum: '#8B6B7B',
  ink: '#3D3530',
  softInk: '#6B5E56',
};

export type ConceptType =
  | 'window-of-tolerance'
  | 'co-regulation'
  | 'attachment-styles'
  | 'safe-haven'
  | 'emotional-flooding'
  | 'nervous-system'
  | 'bid-response'
  | 'protest-behavior'
  | 'repair-attempt'
  | 'relational-field';

interface ConceptStickerProps {
  concept: ConceptType;
  size?: number;
  showLabel?: boolean;
}

const CONCEPT_LABELS: Record<ConceptType, string> = {
  'window-of-tolerance': 'WINDOW OF TOLERANCE',
  'co-regulation': 'CO-REGULATION',
  'attachment-styles': 'ATTACHMENT STYLES',
  'safe-haven': 'SAFE HAVEN',
  'emotional-flooding': 'EMOTIONAL FLOODING',
  'nervous-system': 'NERVOUS SYSTEM',
  'bid-response': 'BID & RESPONSE',
  'protest-behavior': 'PROTEST BEHAVIOR',
  'repair-attempt': 'REPAIR ATTEMPT',
  'relational-field': 'RELATIONAL FIELD',
};

export default function ConceptSticker({ concept, size = 120, showLabel = true }: ConceptStickerProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Rect x="5" y="5" width="90" height="90" rx="8" fill={S.cream} stroke={S.ink} strokeWidth={0.8} />
        {renderConcept(concept)}
        {showLabel && (
          <>
            <Line x1="20" y1="80" x2="80" y2="80" stroke={S.ink} strokeWidth={0.4} />
            <SvgText x="50" y="88" textAnchor="middle" fontFamily="serif" fontSize="3.8" fill={S.softInk}>
              {CONCEPT_LABELS[concept]}
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
}

function renderConcept(concept: ConceptType) {
  switch (concept) {
    case 'window-of-tolerance': return <WindowOfToleranceArt />;
    case 'co-regulation': return <CoRegulationArt />;
    case 'attachment-styles': return <AttachmentStylesArt />;
    case 'safe-haven': return <SafeHavenArt />;
    case 'emotional-flooding': return <EmotionalFloodingArt />;
    case 'nervous-system': return <NervousSystemArt />;
    case 'bid-response': return <BidResponseArt />;
    case 'protest-behavior': return <ProtestBehaviorArt />;
    case 'repair-attempt': return <RepairAttemptArt />;
    case 'relational-field': return <RelationalFieldArt />;
    default: return null;
  }
}

// Window of Tolerance — 3-zone diagram with dot
function WindowOfToleranceArt() {
  return (
    <G>
      <Rect x="25" y="20" width="50" height="50" rx="2" fill="none" stroke={S.ink} strokeWidth={0.8} />
      <Line x1="25" y1="33" x2="75" y2="33" stroke={S.terracotta} strokeWidth={0.6} strokeDasharray="2,1" />
      <Line x1="25" y1="57" x2="75" y2="57" stroke={S.dustyBlue} strokeWidth={0.6} strokeDasharray="2,1" />
      <SvgText x="50" y="29" textAnchor="middle" fontFamily="monospace" fontSize="3.5" fill={S.terracotta}>HYPER</SvgText>
      <SvgText x="50" y="47" textAnchor="middle" fontFamily="monospace" fontSize="4" fill={S.sage}>WINDOW</SvgText>
      <SvgText x="50" y="66" textAnchor="middle" fontFamily="monospace" fontSize="3.5" fill={S.dustyBlue}>HYPO</SvgText>
      <Circle cx="50" cy="45" r="3" fill={S.mustard} opacity={0.7} />
    </G>
  );
}

// Co-Regulation — Synced breathing circles with waves
function CoRegulationArt() {
  return (
    <G>
      <Circle cx="38" cy="40" r="12" fill="none" stroke={S.blush} strokeWidth={0.8} />
      <Circle cx="62" cy="40" r="12" fill="none" stroke={S.dustyBlue} strokeWidth={0.8} />
      <Path d="M28,58 Q38,53 50,58 T72,58" fill="none" stroke={S.blush} strokeWidth={0.6} />
      <Path d="M28,62 Q38,57 50,62 T72,62" fill="none" stroke={S.dustyBlue} strokeWidth={0.6} />
      <Circle cx="50" cy="40" r="2" fill={S.mustard} opacity={0.4} />
    </G>
  );
}

// Attachment Styles — 4-quadrant dots
function AttachmentStylesArt() {
  return (
    <G>
      <Line x1="50" y1="18" x2="50" y2="68" stroke={S.ink} strokeWidth={0.4} opacity={0.25} />
      <Line x1="22" y1="43" x2="78" y2="43" stroke={S.ink} strokeWidth={0.4} opacity={0.25} />
      <Circle cx="36" cy="31" r="6" fill={S.sage} opacity={0.5} />
      <Circle cx="64" cy="31" r="5" fill={S.blush} opacity={0.5} />
      <Circle cx="36" cy="55" r="5" fill={S.dustyBlue} opacity={0.5} />
      <Circle cx="64" cy="55" r="4.5" fill={S.terracotta} opacity={0.5} />
      <SvgText x="36" y="34" textAnchor="middle" fontFamily="monospace" fontSize="3" fill={S.ink}>SEC</SvgText>
      <SvgText x="64" y="34" textAnchor="middle" fontFamily="monospace" fontSize="3" fill={S.ink}>ANX</SvgText>
      <SvgText x="36" y="58" textAnchor="middle" fontFamily="monospace" fontSize="3" fill={S.ink}>AVO</SvgText>
      <SvgText x="64" y="58" textAnchor="middle" fontFamily="monospace" fontSize="3" fill={S.ink}>DIS</SvgText>
    </G>
  );
}

// Safe Haven — House with warm glow
function SafeHavenArt() {
  return (
    <G>
      <Path d="M50,22 L72,38 L72,62 L28,62 L28,38 Z" fill="none" stroke={S.sage} strokeWidth={1} />
      <Rect x="44" y="46" width="12" height="16" rx="1" fill="none" stroke={S.mustard} strokeWidth={0.8} />
      <Ellipse cx="50" cy="58" rx="8" ry="4" fill={S.mustard} opacity={0.15} />
      <Ellipse cx="50" cy="56" rx="5" ry="3" fill={S.mustard} opacity={0.2} />
      {/* Chimney smoke */}
      <Circle cx="63" cy="22" r="2" fill={S.dustyBlue} opacity={0.2} />
      <Circle cx="64" cy="17" r="2.5" fill={S.dustyBlue} opacity={0.12} />
    </G>
  );
}

// Emotional Flooding — Rising water with figure
function EmotionalFloodingArt() {
  return (
    <G>
      {/* Water lines */}
      <Path d="M20,55 Q30,52 40,55 T60,55 T80,55" fill="none" stroke={S.dustyBlue} strokeWidth={0.8} />
      <Path d="M20,48 Q30,45 40,48 T60,48 T80,48" fill="none" stroke={S.dustyBlue} strokeWidth={0.6} opacity={0.6} />
      <Path d="M20,41 Q30,38 40,41 T60,41 T80,41" fill="none" stroke={S.dustyBlue} strokeWidth={0.5} opacity={0.35} />
      {/* Small figure */}
      <Circle cx="50" cy="34" r="5" fill="none" stroke={S.terracotta} strokeWidth={0.8} />
      <Line x1="50" y1="39" x2="50" y2="52" stroke={S.terracotta} strokeWidth={0.6} />
      <Rect x="20" y="55" width="60" height="15" fill={S.dustyBlue} opacity={0.08} />
    </G>
  );
}

// Nervous System — Traffic light (fight/flight/freeze/fawn)
function NervousSystemArt() {
  return (
    <G>
      <Rect x="40" y="18" width="20" height="52" rx="4" fill="none" stroke={S.ink} strokeWidth={0.8} />
      <Circle cx="50" cy="28" r="5" fill={S.terracotta} opacity={0.5} />
      <Circle cx="50" cy="42" r="5" fill={S.mustard} opacity={0.5} />
      <Circle cx="50" cy="56" r="5" fill={S.sage} opacity={0.5} />
      <SvgText x="68" y="30" fontSize="3" fill={S.softInk} fontFamily="monospace">FIGHT</SvgText>
      <SvgText x="68" y="44" fontSize="3" fill={S.softInk} fontFamily="monospace">ALERT</SvgText>
      <SvgText x="68" y="58" fontSize="3" fill={S.softInk} fontFamily="monospace">SAFE</SvgText>
    </G>
  );
}

// Bid & Response — Hand reaching, hand meeting
function BidResponseArt() {
  return (
    <G>
      <Path d="M22,50 Q32,38 44,44" fill="none" stroke={S.blush} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M78,50 Q68,38 56,44" fill="none" stroke={S.dustyBlue} strokeWidth={1.2} strokeLinecap="round" />
      <Circle cx="50" cy="44" r="2.5" fill={S.mustard} opacity={0.6} />
      {/* Small sparkle */}
      <Line x1="50" y1="36" x2="50" y2="39" stroke={S.mustard} strokeWidth={0.5} opacity={0.4} />
      <Line x1="46" y1="40" x2="48" y2="42" stroke={S.mustard} strokeWidth={0.5} opacity={0.4} />
      <Line x1="54" y1="40" x2="52" y2="42" stroke={S.mustard} strokeWidth={0.5} opacity={0.4} />
    </G>
  );
}

// Protest Behavior — Push-pull motion
function ProtestBehaviorArt() {
  return (
    <G>
      {/* Two figures with arrows */}
      <Circle cx="35" cy="42" r="7" fill="none" stroke={S.blush} strokeWidth={0.8} />
      <Circle cx="65" cy="42" r="7" fill="none" stroke={S.dustyBlue} strokeWidth={0.8} />
      {/* Push arrow (top) */}
      <Path d="M42,36 L58,36" fill="none" stroke={S.terracotta} strokeWidth={0.6} />
      <Path d="M55,33 L58,36 L55,39" fill="none" stroke={S.terracotta} strokeWidth={0.6} />
      {/* Pull arrow (bottom) */}
      <Path d="M58,48 L42,48" fill="none" stroke={S.sage} strokeWidth={0.6} />
      <Path d="M45,45 L42,48 L45,51" fill="none" stroke={S.sage} strokeWidth={0.6} />
    </G>
  );
}

// Repair Attempt — Bridge being built
function RepairAttemptArt() {
  return (
    <G>
      {/* Two pillars */}
      <Rect x="25" y="35" width="8" height="30" fill="none" stroke={S.ink} strokeWidth={0.6} />
      <Rect x="67" y="35" width="8" height="30" fill="none" stroke={S.ink} strokeWidth={0.6} />
      {/* Bridge arc */}
      <Path d="M33,38 Q50,25 67,38" fill="none" stroke={S.sage} strokeWidth={1.2} />
      {/* Bridge deck (partial — being built) */}
      <Line x1="33" y1="42" x2="55" y2="42" stroke={S.mustard} strokeWidth={1} />
      <Line x1="55" y1="42" x2="67" y2="42" stroke={S.mustard} strokeWidth={1} strokeDasharray="3,2" opacity={0.4} />
      {/* Warm glow at meeting point */}
      <Circle cx="55" cy="42" r="2" fill={S.mustard} opacity={0.5} />
    </G>
  );
}

// Relational Field — Energy between two points
function RelationalFieldArt() {
  return (
    <G>
      {/* Two anchor points */}
      <Circle cx="30" cy="45" r="5" fill={S.blush} opacity={0.4} />
      <Circle cx="70" cy="45" r="5" fill={S.dustyBlue} opacity={0.4} />
      {/* Energy field lines */}
      <Path d="M35,45 Q50,35 65,45" fill="none" stroke={S.mustard} strokeWidth={0.6} opacity={0.5} />
      <Path d="M35,45 Q50,40 65,45" fill="none" stroke={S.mustard} strokeWidth={0.4} opacity={0.4} />
      <Path d="M35,45 Q50,50 65,45" fill="none" stroke={S.mustard} strokeWidth={0.4} opacity={0.4} />
      <Path d="M35,45 Q50,55 65,45" fill="none" stroke={S.mustard} strokeWidth={0.6} opacity={0.5} />
      {/* Center glow */}
      <Circle cx="50" cy="45" r="4" fill={S.mustard} opacity={0.15} />
      <Circle cx="50" cy="45" r="2" fill={S.mustard} opacity={0.3} />
    </G>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
