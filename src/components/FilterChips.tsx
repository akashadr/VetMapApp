import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors } from '../theme/colors';
import { UIText, FontWeights } from '../theme/typography';
import { Radius } from '../theme/spacing';
import { SPECIALITIES } from '../data/mockClinics';

interface FilterChipsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const BASE_CHIPS = [
  { id: 'all', label: 'All Clinics', icon: '🗺️' },
  { id: 'open_now', label: 'Open Now', icon: '🟢' },
];

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const chips = [
    ...BASE_CHIPS,
    ...SPECIALITIES.map(s => ({ id: s, label: s, icon: '' })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {chips.map(chip => {
        const isActive = activeFilter === chip.id;
        return (
          <TouchableOpacity
            key={chip.id}
            onPress={() => onFilterChange(chip.id)}
            style={[styles.chip, isActive && styles.chipActive]}
            activeOpacity={0.75}
          >
            {chip.icon ? (
              <Text style={styles.chipIcon}>{chip.icon}</Text>
            ) : null}
            <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  chipActive: {
    backgroundColor: Colors.accentBg,
    borderColor: Colors.accent,
  },
  chipIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  chipLabel: {
    ...UIText.caption,
    color: Colors.textPrimary,
  },
  chipLabelActive: {
    fontWeight: FontWeights.semiBold,
    color: Colors.accent,
  },
});
