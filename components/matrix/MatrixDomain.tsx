/**
 * MatrixDomain — A single domain row in the Tender Matrix.
 *
 * Shows domain title + 2-4 colored cells in a horizontal row.
 * Tapping expands the cross-instrument narrative panel below.
 * Only one domain is expanded at a time.
 *
 * Addendum 2: Shows confidence badge (high / emerging / needs more data)
 * and visually distinguishes raw vs. composite vs. interpreted data.
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  useWindowDimensions,
} from 'react-native';
import TenderText from '@/components/ui/TenderText';
import MatrixCell, { type MatrixCellData } from './MatrixCell';
import { MATRIX_COLORS, CONFIDENCE_COLORS, type MatrixColorKey, type ConfidenceLevel } from './constants/matrix-colors';
import { Colors, Spacing, BorderRadius, Shadows, FontFamilies } from '@/constants/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface DomainNarrative {
  title: string;
  body: string;
  insight: string;        // Cross-pattern line (italicized)
  instruments: string[];  // Which instruments feed this
}

export interface MatrixDomainData {
  id: string;
  title: string;
  subtitle?: string;
  cells: MatrixCellData[];
  narrative: DomainNarrative;
  color: MatrixColorKey;
  confidence: ConfidenceLevel;
}

interface MatrixDomainProps {
  domain: MatrixDomainData;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  cellSelectable?: boolean;
  selectedCells?: string[];
  onCellSelect?: (cellLabel: string) => void;
  onRowSelect?: () => void;
}

export default function MatrixDomain({ domain, isExpanded, onToggle, selectable = false, selected = false, cellSelectable = false, selectedCells = [], onCellSelect, onRowSelect }: MatrixDomainProps) {
  const expandAnim = useRef(new Animated.Value(0)).current;
  const palette = MATRIX_COLORS[domain.color];
  const confidenceStyle = CONFIDENCE_COLORS[domain.confidence];
  const { width } = useWindowDimensions();
  const isNarrow = width < 400;

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const handlePress = () => {
    if (selectable && onRowSelect) {
      // In integrate mode, tapping the row header selects all cells in this row
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onRowSelect();
    } else {
      // Normal mode — expand/collapse narrative
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onToggle(domain.id);
    }
  };

  return (
    <View style={[
      styles.container,
      { borderColor: palette.accent + '40' },
      selectable && selected && styles.selectedContainer,
      selectable && selected && { borderColor: palette.bg, borderWidth: 2 },
    ]}>
      {/* Domain header */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={selectable
          ? `${domain.title}. ${selected ? 'Selected. Tap to deselect.' : 'Tap to select for integration.'}`
          : `${domain.title}. ${isExpanded ? 'Collapse' : 'Expand'} narrative.`}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {selectable ? (
              <View style={[styles.selectionIndicator, { borderColor: palette.bg }, selected && { backgroundColor: palette.bg }]}>
                {selected && <TenderText variant="caption" style={styles.checkMark}>✓</TenderText>}
              </View>
            ) : (
              <View style={[styles.colorDot, { backgroundColor: palette.bg }]} />
            )}
            <View style={styles.headerText}>
              <TenderText variant="headingS" style={{ color: palette.text }}>
                {domain.title}
              </TenderText>
              {domain.subtitle && (
                <TenderText variant="caption" style={{ color: Colors.textMuted }}>
                  {domain.subtitle}
                </TenderText>
              )}
            </View>
          </View>
          <View style={[styles.confidenceBadge, { backgroundColor: confidenceStyle.bg }]}>
            <TenderText variant="caption" style={[styles.confidenceText, { color: confidenceStyle.text }]}>
              {confidenceStyle.label}
            </TenderText>
          </View>
        </View>

        {/* Cell grid */}
        {cellSelectable ? (
          <View style={[styles.cellRow, isNarrow && styles.cellRowNarrow]}>
            {domain.cells.map((cell, i) => (
              <MatrixCell
                key={i}
                cell={cell}
                selectable
                selected={selectedCells.includes(cell.label)}
                onSelect={() => onCellSelect?.(cell.label)}
              />
            ))}
          </View>
        ) : (
          <View style={[styles.cellRow, isNarrow && styles.cellRowNarrow]}>
            {domain.cells.map((cell, i) => (
              <MatrixCell key={i} cell={cell} />
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Expandable narrative */}
      {isExpanded && (
        <Animated.View
          style={[
            styles.narrativePanel,
            {
              backgroundColor: palette.bg + '30',
              borderTopColor: palette.accent + '30',
            },
          ]}
        >
          <TenderText variant="headingS" style={[styles.narrativeTitle, { color: palette.text }]}>
            {domain.narrative.title}
          </TenderText>
          <TenderText variant="body" style={[styles.narrativeBody, { color: Colors.text }]}>
            {domain.narrative.body}
          </TenderText>
          {domain.narrative.insight ? (
            <TenderText
              variant="bodySmall"
              style={[styles.narrativeInsight, { color: palette.label }]}
            >
              {domain.narrative.insight}
            </TenderText>
          ) : null}

          {/* Source instruments */}
          <View style={styles.instrumentsRow}>
            {domain.narrative.instruments.map((inst, i) => (
              <View key={i} style={[styles.instrumentChip, { backgroundColor: palette.bg + '60' }]}>
                <TenderText variant="caption" style={{ color: palette.text, fontSize: 9 }}>
                  {inst}
                </TenderText>
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  headerText: {
    flex: 1,
  },
  confidenceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  confidenceText: {
    fontSize: 9,
    letterSpacing: 0.5,
    fontFamily: 'Jost_500Medium',
  },
  cellRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  cellRowNarrow: {
    gap: 2,
    paddingHorizontal: Spacing.xs,
  },
  narrativePanel: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  narrativeTitle: {
    marginBottom: Spacing.xs,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 14,
  },
  narrativeBody: {
    lineHeight: 20,
    fontSize: 13,
    fontFamily: 'JosefinSans_400Regular',
    marginBottom: Spacing.sm,
  },
  narrativeInsight: {
    fontStyle: 'italic',
    lineHeight: 20,
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  instrumentsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  instrumentChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  selectedContainer: {
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 14,
  },
});
