import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Clinic } from '../types';
import { ClinicCard } from './ClinicCard';
import { Colors } from '../theme/colors';
import { UIText, FontWeights } from '../theme/typography';
import { Spacing, Radius, Elevation } from '../theme/spacing';

interface BottomSheetPanelProps {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  onCardPress: (clinic: Clinic) => void;
  onCardDetailPress: (clinic: Clinic) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLLAPSED_HEIGHT = 272;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.72;

export const BottomSheetPanel: React.FC<BottomSheetPanelProps> = ({
  clinics,
  selectedClinic,
  onCardPress,
  onCardDetailPress,
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const listRef = useRef<FlatList<Clinic>>(null);

  const snapPoints = useMemo(
    () => [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
    [],
  );

  // Scroll selected card into view when a pin is tapped
  useEffect(() => {
    if (!selectedClinic || clinics.length === 0) return;
    const idx = clinics.findIndex(c => c.id === selectedClinic.id);
    if (idx === -1 || idx >= clinics.length) return;
    sheetRef.current?.snapToIndex(0);
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0 });
    }, 150);
  }, [selectedClinic, clinics]);

  const renderItem = useCallback(
    ({ item }: { item: Clinic }) => (
      <ClinicCard
        clinic={item}
        isSelected={selectedClinic?.id === item.id}
        onPress={onCardPress}
        onPressDetail={onCardDetailPress}
      />
    ),
    [selectedClinic, onCardPress, onCardDetailPress],
  );

  const keyExtractor = useCallback((item: Clinic) => item.id, []);

  const ListHeader = useCallback(
    () => (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {clinics.length} {clinics.length === 1 ? 'Clinic' : 'Clinics'} nearby
        </Text>
        <Text style={styles.headerSub}>Pan map to explore more</Text>
      </View>
    ),
    [clinics.length],
  );

  const ListEmpty = useCallback(
    () => (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🔭</Text>
        <Text style={styles.emptyTitle}>No clinics found</Text>
        <Text style={styles.emptySub}>Try panning the map or clearing your search</Text>
      </View>
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handle}
      style={styles.sheet}
    >
      <BottomSheetFlatList
        ref={listRef as any}
        data={clinics}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheet: {
    ...Elevation.shadowMd,           // shadow card — no border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  sheetBackground: {
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: Radius.sheet,  // 24px bottom sheet
    borderTopRightRadius: Radius.sheet,
  },
  handle: {
    backgroundColor: Colors.border,
    width: 40,
    height: 4,
  },
  listContent: {
    paddingBottom: Spacing.sectionLg,         // 32px bottom
  },
  header: {
    paddingHorizontal: Spacing.screenHorizontal, // 16px screen margin
    paddingTop: Spacing.tight,                // 8px top (tight)
    paddingBottom: Spacing.tight / 2,         // 4px bottom
  },
  headerTitle: {
    ...UIText.subHeadline,           // 15px Medium
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  headerSub: {
    ...UIText.caption,               // 12px Medium
    color: Colors.textMuted,
    marginTop: Spacing.base,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.sectionLg + Spacing.section,
    paddingHorizontal: Spacing.sectionLg,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.tightLg,
  },
  emptyTitle: {
    ...UIText.callout,               // 16px Regular
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.tight - 2,
  },
  emptySub: {
    ...UIText.footnote,              // 13px Regular
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
