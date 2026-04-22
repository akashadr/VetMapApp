import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
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
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipLabelActive: {
    color: Colors.textInverse,
  },
});
