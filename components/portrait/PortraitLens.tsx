import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import TenderText from '@/components/ui/TenderText';
import type {
  AttachmentLens,
  PartsLens,
  RegulationLens,
  ValuesLens,
} from '@/types';

type LensData = AttachmentLens | PartsLens | RegulationLens | ValuesLens;

interface Props {
  title: string;
  lens: LensData;
  type: 'attachment' | 'parts' | 'regulation' | 'values';
}

export default function PortraitLens({ title, lens, type }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${expanded ? 'collapse' : 'expand'} details`}
      >
        <TenderText variant="headingM">{title}</TenderText>
        <TenderText variant="bodySmall" color={Colors.primary} style={{ fontWeight: '600' }}>
          {expanded ? 'Less' : 'More'}
        </TenderText>
      </TouchableOpacity>

      <TenderText variant="body" style={{ lineHeight: 24 }}>
        {lens.narrative}
      </TenderText>

      {expanded && renderDetails(lens, type)}
    </View>
  );
}

function renderDetails(lens: LensData, type: string) {
  switch (type) {
    case 'attachment':
      return <AttachmentDetails lens={lens as AttachmentLens} />;
    case 'parts':
      return <PartsDetails lens={lens as PartsLens} />;
    case 'regulation':
      return <RegulationDetails lens={lens as RegulationLens} />;
    case 'values':
      return <ValuesDetails lens={lens as ValuesLens} />;
    default:
      return null;
  }
}

// ─── Attachment Details ──────────────────────────────────

function AttachmentDetails({ lens }: { lens: AttachmentLens }) {
  return (
    <View style={styles.details}>
      <DetailBlock label="Protective Strategy" text={lens.protectiveStrategy} />

      {lens.triggers.length > 0 && (
        <View>
          <TenderText variant="bodySmall" style={{ fontWeight: '700', marginBottom: 4 }}>
            Triggers
          </TenderText>
          {lens.triggers.map((t, i) => (
            <TenderText
              key={i}
              variant="bodySmall"
              style={{ lineHeight: 22, paddingLeft: Spacing.sm }}
            >
              {'\u2022'} {t}
            </TenderText>
          ))}
        </View>
      )}

      <View>
        <TenderText variant="bodySmall" style={{ fontWeight: '700', marginBottom: 4 }}>
          A.R.E. Profile
        </TenderText>
        <AREBar label="Accessible" value={lens.areProfile.accessible} />
        <AREBar label="Responsive" value={lens.areProfile.responsive} />
        <AREBar label="Engaged" value={lens.areProfile.engaged} />
      </View>
    </View>
  );
}

function AREBar({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.areRow}>
      <TenderText variant="caption" style={{ width: 90 }}>
        {label}
      </TenderText>
      <View style={styles.areBarBg}>
        <View
          style={[styles.areBarFill, { width: `${value}%` }]}
        />
      </View>
      <TenderText variant="caption" color={Colors.textSecondary} align="right" style={{ width: 24 }}>
        {value}
      </TenderText>
    </View>
  );
}

// ─── Parts Details ───────────────────────────────────────

function PartsDetails({ lens }: { lens: PartsLens }) {
  return (
    <View style={styles.details}>
      {lens.managerParts.length > 0 && (
        <BulletSection label="Manager Parts" items={lens.managerParts} />
      )}

      {lens.firefighterParts.length > 0 && (
        <BulletSection label="Firefighter Parts" items={lens.firefighterParts} />
      )}

      {lens.polarities.length > 0 && (
        <BulletSection label="Inner Polarities" items={lens.polarities} />
      )}

      <TenderText variant="caption" color={Colors.textSecondary} style={{ fontWeight: '600' }}>
        Self-Leadership Score: {lens.selfLeadershipScore}/100
      </TenderText>
    </View>
  );
}

// ─── Regulation Details ──────────────────────────────────

function RegulationDetails({ lens }: { lens: RegulationLens }) {
  return (
    <View style={styles.details}>
      <TenderText variant="caption" color={Colors.textSecondary} style={{ fontWeight: '600' }}>
        Window Width: {lens.windowWidth}/100
      </TenderText>

      {lens.activationPatterns.length > 0 && (
        <BulletSection label="When Activated" items={lens.activationPatterns} />
      )}

      {lens.shutdownPatterns.length > 0 && (
        <BulletSection label="When Shutdown" items={lens.shutdownPatterns} />
      )}

      {lens.floodingMarkers.length > 0 && (
        <BulletSection label="Flooding Signs" items={lens.floodingMarkers} />
      )}
    </View>
  );
}

// ─── Values Details ──────────────────────────────────────

function ValuesDetails({ lens }: { lens: ValuesLens }) {
  return (
    <View style={styles.details}>
      {lens.coreValues.length > 0 && (
        <View>
          <TenderText variant="bodySmall" style={{ fontWeight: '700', marginBottom: 4 }}>
            Core Values
          </TenderText>
          {lens.coreValues.map((v, i) => (
            <TenderText
              key={i}
              variant="bodySmall"
              style={{ lineHeight: 22, paddingLeft: Spacing.sm }}
            >
              {i + 1}. {v}
            </TenderText>
          ))}
        </View>
      )}

      {lens.significantGaps.length > 0 && (
        <View>
          <TenderText variant="bodySmall" style={{ fontWeight: '700', marginBottom: 4 }}>
            Growth Areas
          </TenderText>
          {lens.significantGaps.map((g, i) => (
            <TenderText
              key={i}
              variant="bodySmall"
              style={{ lineHeight: 22, paddingLeft: Spacing.sm }}
            >
              {'\u2022'} {g.value}: {g.importance}/10 importance, gap of{' '}
              {g.gap.toFixed(1)}
            </TenderText>
          ))}
        </View>
      )}

      {lens.developmentalInvitations.length > 0 && (
        <BulletSection label="Invitations" items={lens.developmentalInvitations} />
      )}
    </View>
  );
}

// ─── Shared Helpers ──────────────────────────────────────

function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <View>
      <TenderText variant="bodySmall" style={{ fontWeight: '700', marginBottom: 4 }}>
        {label}
      </TenderText>
      <TenderText variant="bodySmall" style={{ lineHeight: 20 }}>
        {text}
      </TenderText>
    </View>
  );
}

function BulletSection({ label, items }: { label: string; items: string[] }) {
  return (
    <View>
      <TenderText variant="bodySmall" style={{ fontWeight: '700', marginBottom: 4 }}>
        {label}
      </TenderText>
      {items.map((item, i) => (
        <TenderText
          key={i}
          variant="bodySmall"
          style={{ lineHeight: 22, paddingLeft: Spacing.sm }}
        >
          {'\u2022'} {item}
        </TenderText>
      ))}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  details: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  areRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  areBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  areBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
