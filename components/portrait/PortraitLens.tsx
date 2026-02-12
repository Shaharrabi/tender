import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
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
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.toggle}>{expanded ? 'Less' : 'More'}</Text>
      </TouchableOpacity>

      <Text style={styles.narrative}>{lens.narrative}</Text>

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
          <Text style={styles.detailLabel}>Triggers</Text>
          {lens.triggers.map((t, i) => (
            <Text key={i} style={styles.bullet}>
              {'\u2022'} {t}
            </Text>
          ))}
        </View>
      )}

      <View>
        <Text style={styles.detailLabel}>A.R.E. Profile</Text>
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
      <Text style={styles.areLabel}>{label}</Text>
      <View style={styles.areBarBg}>
        <View
          style={[styles.areBarFill, { width: `${value}%` }]}
        />
      </View>
      <Text style={styles.areValue}>{value}</Text>
    </View>
  );
}

// ─── Parts Details ───────────────────────────────────────

function PartsDetails({ lens }: { lens: PartsLens }) {
  return (
    <View style={styles.details}>
      {lens.managerParts.length > 0 && (
        <View>
          <Text style={styles.detailLabel}>Manager Parts</Text>
          {lens.managerParts.map((p, i) => (
            <Text key={i} style={styles.bullet}>
              {'\u2022'} {p}
            </Text>
          ))}
        </View>
      )}

      {lens.firefighterParts.length > 0 && (
        <View>
          <Text style={styles.detailLabel}>Firefighter Parts</Text>
          {lens.firefighterParts.map((p, i) => (
            <Text key={i} style={styles.bullet}>
              {'\u2022'} {p}
            </Text>
          ))}
        </View>
      )}

      {lens.polarities.length > 0 && (
        <View>
          <Text style={styles.detailLabel}>Inner Polarities</Text>
          {lens.polarities.map((p, i) => (
            <Text key={i} style={styles.bullet}>
              {'\u2022'} {p}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.detailMeta}>
        Self-Leadership Score: {lens.selfLeadershipScore}/100
      </Text>
    </View>
  );
}

// ─── Regulation Details ──────────────────────────────────

function RegulationDetails({ lens }: { lens: RegulationLens }) {
  return (
    <View style={styles.details}>
      <Text style={styles.detailMeta}>
        Window Width: {lens.windowWidth}/100
      </Text>

      {lens.activationPatterns.length > 0 && (
        <View>
          <Text style={styles.detailLabel}>When Activated</Text>
          {lens.activationPatterns.map((p, i) => (
            <Text key={i} style={styles.bullet}>
              {'\u2022'} {p}
            </Text>
          ))}
        </View>
      )}

      {lens.shutdownPatterns.length > 0 && (
        <View>
          <Text style={styles.detailLabel}>When Shutdown</Text>
          {lens.shutdownPatterns.map((p, i) => (
            <Text key={i} style={styles.bullet}>
              {'\u2022'} {p}
            </Text>
          ))}
        </View>
      )}

      {lens.floodingMarkers.length > 0 && (
        <View>
          <Text style={styles.detailLabel}>Flooding Signs</Text>
          {lens.floodingMarkers.map((m, i) => (
            <Text key={i} style={styles.bullet}>
              {'\u2022'} {m}
            </Text>
          ))}
        </View>
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
          <Text style={styles.detailLabel}>Core Values</Text>
          {lens.coreValues.map((v, i) => (
            <Text key={i} style={styles.bullet}>
              {i + 1}. {v}
            </Text>
          ))}
        </View>
      )}

      {lens.significantGaps.length > 0 && (
        <View>
          <Text style={styles.detailLabel}>Growth Areas</Text>
          {lens.significantGaps.map((g, i) => (
            <Text key={i} style={styles.bullet}>
              {'\u2022'} {g.value}: {g.importance}/10 importance, gap of{' '}
              {g.gap.toFixed(1)}
            </Text>
          ))}
        </View>
      )}

      {lens.developmentalInvitations.length > 0 && (
        <View>
          <Text style={styles.detailLabel}>Invitations</Text>
          {lens.developmentalInvitations.map((inv, i) => (
            <Text key={i} style={styles.bullet}>
              {'\u2022'} {inv}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────

function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailText}>{text}</Text>
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
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
  },
  toggle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  narrative: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
  details: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  detailLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  detailText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  detailMeta: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  bullet: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    paddingLeft: Spacing.sm,
    flexShrink: 1,
  },
  areRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  areLabel: {
    width: 90,
    fontSize: FontSizes.caption,
    color: Colors.text,
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
  areValue: {
    width: 24,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
});
