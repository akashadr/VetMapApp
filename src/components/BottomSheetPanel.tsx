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
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  sheetBackground: {
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    backgroundColor: Colors.border,
    width: 40,
    height: 4,
  },
  listContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
