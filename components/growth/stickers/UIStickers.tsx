/**
 * UIStickers — Animated SVG stickers for navigation and UI elements.
 *
 * Portal, Loading, Completion, Check-In, Partner Invite, Solo Mode.
 * Part of the Tender Sticker System — Wes Anderson Edition.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, {
  Circle, Rect, Path, Line, G, Text as SvgText, Ellipse,
} from 'react-native-svg';

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

export type UIStickerType =
  | 'portal'
  | 'loading'
  | 'completion'
  | 'check-in'
  | 'partner-invite'
  | 'solo-mode'
  | 'daily-rhythm'
  | 'course';

interface UIStickerProps {
  type: UIStickerType;
  size?: number;
  showLabel?: boolean;
  animated?: boolean;
}

const UI_LABELS: Record<UIStickerType, string> = {
  'portal': 'TENDER PORTAL',
  'loading': 'LOADING',
  'completion': 'COMPLETE',
  'check-in': 'CHECK-IN',
  'partner-invite': 'INVITE',
  'solo-mode': 'SOLO',
  'daily-rhythm': 'DAILY',
  'course': 'COURSE',
};

export default function UISticker({ type, size = 120, showLabel = true, animated = true }: UIStickerProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Rect x="5" y="5" width="90" height="90" rx="8" fill={S.cream} stroke={S.ink} strokeWidth={0.8} />
        {renderUI(type)}
        {showLabel && (
          <>
            <Line x1="20" y1="80" x2="80" y2="80" stroke={S.ink} strokeWidth={0.4} />
            <SvgText x="50" y="88" textAnchor="middle" fontFamily="serif" fontSize="3.8" fill={S.softInk}>
              {UI_LABELS[type]}
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
}

function renderUI(type: UIStickerType) {
  switch (type) {
    case 'portal': return <PortalArt />;
    case 'loading': return <LoadingArt />;
    case 'completion': return <CompletionArt />;
    case 'check-in': return <CheckInArt />;
    case 'partner-invite': return <PartnerInviteArt />;
    case 'solo-mode': return <SoloModeArt />;
    case 'daily-rhythm': return <DailyRhythmArt />;
    case 'course': return <CourseArt />;
    default: return null;
  }
}

// Portal — Two arcs reaching toward each other, spark between
function PortalArt() {
  return (
    <G>
      <Path d="M25,55 Q35,40 45,48" fill="none" stroke={S.blush} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M75,55 Q65,40 55,48" fill="none" stroke={S.dustyBlue} strokeWidth={1.5} strokeLinecap="round" />
      {/* Spark between */}
      <Circle cx="50" cy="47" r="3" fill={S.mustard} opacity={0.7} />
      <Circle cx="50" cy="47" r="6" fill={S.mustard} opacity={0.15} />
      {/* Small sparkle lines */}
      <Line x1="50" y1="38" x2="50" y2="41" stroke={S.mustard} strokeWidth={0.5} opacity={0.5} />
      <Line x1="43" y1="44" x2="45" y2="46" stroke={S.mustard} strokeWidth={0.5} opacity={0.5} />
      <Line x1="57" y1="44" x2="55" y2="46" stroke={S.mustard} strokeWidth={0.5} opacity={0.5} />
    </G>
  );
}

// Loading — Two dashed rings rotating in opposite directions
function LoadingArt() {
  return (
    <G>
      <Circle cx="50" cy="45" r="18" fill="none" stroke={S.blush} strokeWidth={0.8} strokeDasharray="8,4" opacity={0.5} />
      <Circle cx="50" cy="45" r="12" fill="none" stroke={S.dustyBlue} strokeWidth={0.8} strokeDasharray="5,3" opacity={0.5} />
      <Circle cx="50" cy="45" r="3" fill={S.mustard} opacity={0.6} />
    </G>
  );
}

// Completion — Soft star-burst from a check circle
function CompletionArt() {
  return (
    <G>
      {/* Star rays */}
      <Line x1="50" y1="22" x2="50" y2="28" stroke={S.mustard} strokeWidth={0.8} />
      <Line x1="65" y1="30" x2="61" y2="33" stroke={S.mustard} strokeWidth={0.8} />
      <Line x1="35" y1="30" x2="39" y2="33" stroke={S.mustard} strokeWidth={0.8} />
      <Line x1="50" y1="62" x2="50" y2="56" stroke={S.mustard} strokeWidth={0.8} />
      <Line x1="68" y1="45" x2="63" y2="45" stroke={S.mustard} strokeWidth={0.8} />
      <Line x1="32" y1="45" x2="37" y2="45" stroke={S.mustard} strokeWidth={0.8} />
      {/* Center check */}
      <Circle cx="50" cy="44" r="12" fill="none" stroke={S.sage} strokeWidth={1.5} />
      <Path d="M42,44 L48,50 L58,38" fill="none" stroke={S.sage} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </G>
  );
}

// Check-In — Sunrise with gentle rays
function CheckInArt() {
  return (
    <G>
      {/* Horizon */}
      <Line x1="25" y1="52" x2="75" y2="52" stroke={S.ink} strokeWidth={0.6} opacity={0.3} />
      {/* Sun */}
      <Circle cx="50" cy="52" r="12" fill={S.mustard} opacity={0.25} />
      <Path d="M38,52 A12,12 0 0,1 62,52" fill={S.mustard} opacity={0.4} />
      {/* Rays */}
      <Line x1="50" y1="32" x2="50" y2="37" stroke={S.mustard} strokeWidth={0.7} opacity={0.6} />
      <Line x1="62" y1="36" x2="59" y2="40" stroke={S.mustard} strokeWidth={0.7} opacity={0.5} />
      <Line x1="38" y1="36" x2="41" y2="40" stroke={S.mustard} strokeWidth={0.7} opacity={0.5} />
      <Line x1="68" y1="45" x2="64" y2="47" stroke={S.mustard} strokeWidth={0.6} opacity={0.4} />
      <Line x1="32" y1="45" x2="36" y2="47" stroke={S.mustard} strokeWidth={0.6} opacity={0.4} />
      {/* Ground warmth */}
      <Ellipse cx="50" cy="60" rx="18" ry="4" fill={S.blush} opacity={0.15} />
    </G>
  );
}

// Partner Invite — Envelope with heart seal
function PartnerInviteArt() {
  return (
    <G>
      {/* Envelope body */}
      <Rect x="26" y="32" width="48" height="32" rx="2" fill="none" stroke={S.dustyBlue} strokeWidth={1} />
      {/* Envelope flap */}
      <Path d="M26,32 L50,48 L74,32" fill="none" stroke={S.dustyBlue} strokeWidth={1} />
      {/* Heart seal */}
      <Path d="M46,40 C46,37 50,35 50,38 C50,35 54,37 54,40 C54,43 50,46 50,46 C50,46 46,43 46,40Z" fill={S.blush} opacity={0.7} />
      {/* Sparkle */}
      <Circle cx="64" cy="28" r="1.5" fill={S.mustard} opacity={0.5} />
      <Circle cx="68" cy="32" r="1" fill={S.mustard} opacity={0.3} />
    </G>
  );
}

// Solo Mode — Single figure in self-embrace
function SoloModeArt() {
  return (
    <G>
      {/* Head */}
      <Circle cx="50" cy="32" r="7" fill="none" stroke={S.sage} strokeWidth={1} />
      {/* Body */}
      <Line x1="50" y1="39" x2="50" y2="56" stroke={S.sage} strokeWidth={0.8} />
      {/* Arms wrapping self */}
      <Path d="M50,44 Q42,42 40,48 Q38,52 44,52" fill="none" stroke={S.sage} strokeWidth={0.8} strokeLinecap="round" />
      <Path d="M50,44 Q58,42 60,48 Q62,52 56,52" fill="none" stroke={S.sage} strokeWidth={0.8} strokeLinecap="round" />
      {/* Warm glow */}
      <Circle cx="50" cy="46" r="10" fill={S.mustard} opacity={0.08} />
      <Circle cx="50" cy="46" r="6" fill={S.mustard} opacity={0.12} />
    </G>
  );
}

// Daily Rhythm — Clock with gentle pulse
function DailyRhythmArt() {
  return (
    <G>
      {/* Clock face */}
      <Circle cx="50" cy="43" r="18" fill="none" stroke={S.dustyBlue} strokeWidth={0.8} />
      <Circle cx="50" cy="43" r="16" fill="none" stroke={S.dustyBlue} strokeWidth={0.3} opacity={0.3} />
      {/* Hour marks */}
      <Line x1="50" y1="27" x2="50" y2="30" stroke={S.ink} strokeWidth={0.6} />
      <Line x1="50" y1="56" x2="50" y2="59" stroke={S.ink} strokeWidth={0.6} />
      <Line x1="34" y1="43" x2="37" y2="43" stroke={S.ink} strokeWidth={0.6} />
      <Line x1="63" y1="43" x2="66" y2="43" stroke={S.ink} strokeWidth={0.6} />
      {/* Hands */}
      <Line x1="50" y1="43" x2="50" y2="33" stroke={S.ink} strokeWidth={0.8} />
      <Line x1="50" y1="43" x2="58" y2="40" stroke={S.terracotta} strokeWidth={0.6} />
      {/* Center dot */}
      <Circle cx="50" cy="43" r="1.5" fill={S.mustard} />
      {/* Sun arc */}
      <Path d="M35,62 Q50,56 65,62" fill="none" stroke={S.mustard} strokeWidth={0.6} opacity={0.4} />
    </G>
  );
}

// Course — Open book with sparkle
function CourseArt() {
  return (
    <G>
      {/* Book spine */}
      <Line x1="50" y1="28" x2="50" y2="62" stroke={S.ink} strokeWidth={0.6} />
      {/* Left page */}
      <Path d="M50,30 Q38,28 28,32 L28,58 Q38,54 50,58" fill="none" stroke={S.dustyBlue} strokeWidth={0.8} />
      {/* Right page */}
      <Path d="M50,30 Q62,28 72,32 L72,58 Q62,54 50,58" fill="none" stroke={S.dustyBlue} strokeWidth={0.8} />
      {/* Text lines left */}
      <Line x1="34" y1="38" x2="46" y2="38" stroke={S.ink} strokeWidth={0.3} opacity={0.3} />
      <Line x1="34" y1="42" x2="44" y2="42" stroke={S.ink} strokeWidth={0.3} opacity={0.3} />
      <Line x1="34" y1="46" x2="46" y2="46" stroke={S.ink} strokeWidth={0.3} opacity={0.3} />
      {/* Text lines right */}
      <Line x1="54" y1="38" x2="66" y2="38" stroke={S.ink} strokeWidth={0.3} opacity={0.3} />
      <Line x1="54" y1="42" x2="64" y2="42" stroke={S.ink} strokeWidth={0.3} opacity={0.3} />
      <Line x1="54" y1="46" x2="66" y2="46" stroke={S.ink} strokeWidth={0.3} opacity={0.3} />
      {/* Sparkle */}
      <Circle cx="62" cy="26" r="2" fill={S.mustard} opacity={0.5} />
      <Line x1="62" y1="22" x2="62" y2="24" stroke={S.mustard} strokeWidth={0.4} opacity={0.4} />
      <Line x1="59" y1="26" x2="61" y2="26" stroke={S.mustard} strokeWidth={0.4} opacity={0.4} />
    </G>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
