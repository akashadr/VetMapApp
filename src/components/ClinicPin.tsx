import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Clinic } from '../types';
import { Colors } from '../theme/colors';

interface ClinicPinProps {
  clinic: Clinic;
  isSelected: boolean;
  onPress: (clinic: Clinic) => void;
}

const SPECIALITY_ICONS: Record<string, string> = {
  'General Practice': '🐾',
  'Internal Medicine': '🩺',
  'Surgery & Orthopedics': '⚕️',
  'Emergency & Critical Care': '🚨',
  'Integrative Medicine': '🌿',
  'Dentistry & Dermatology': '🦷',
  'Preventive Care & Vaccines': '💉',
  'Feline & Canine Medicine': '🐱',
  'Oncology & Imaging': '🔬',
  'Exotic Animals & Avian': '🦜',
  'Rehabilitation & Sports Medicine': '🏃',
};

export const ClinicPin: React.FC<ClinicPinProps> = ({ clinic, isSelected, onPress }) => {
  const icon = SPECIALITY_ICONS[clinic.speciality] ?? '🐾';
  const bg = isSelected ? Colors.pinSelected : Colors.pinDefault;

  return (
    <Marker
      coordinate={clinic.coordinates}
      onPress={() => onPress(clinic)}
      tracksViewChanges={false}
    >
      <View style={[styles.container, { backgroundColor: bg }, isSelected && styles.selected]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.rating}>★ {clinic.rating}</Text>
        <View style={[styles.tail, { borderTopColor: bg }]} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  selected: {
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    transform: [{ scale: 1.1 }],
  },
  icon: { fontSize: 13 },
  rating: { fontSize: 12, fontWeight: '700', color: Colors.pinText },
  tail: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
