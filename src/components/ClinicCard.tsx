import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Clinic } from '../types';
import { Colors } from '../theme/colors';
import { formatDistance } from '../utils/distance';

interface ClinicCardProps {
  clinic: Clinic;
  isSelected?: boolean;
  onPress: (clinic: Clinic) => void;
  onPressDetail: (clinic: Clinic) => void;
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

export const ClinicCard: React.FC<ClinicCardProps> = ({
  clinic,
  isSelected,
  onPress,
  onPressDetail,
}) => {
  const icon = SPECIALITY_ICONS[clinic.speciality] ?? '🐾';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(clinic)}
      onLongPress={() => onPressDetail(clinic)}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      {/* Icon badge */}
      <View style={[styles.iconBadge, isSelected && styles.iconBadgeSelected]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{clinic.name}</Text>
          {clinic.isOpenNow ? (
            <View style={styles.openBadge}>
              <Text style={styles.openText}>Open</Text>
            </View>
          ) : (
            <View style={styles.closedBadge}>
              <Text style={styles.closedText}>Closed</Text>
            </View>
          )}
        </View>

        <Text style={styles.speciality} numberOfLines={1}>
          {clinic.speciality}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.rating}>★ {clinic.rating}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.reviews}>{clinic.reviewCount} reviews</Text>
          {clinic.distance !== undefined && (
            <>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.distance}>{formatDistance(clinic.distance)}</Text>
            </>
          )}
        </View>

        <Text style={styles.address} numberOfLines={1}>
          📍 {clinic.address.split(',')[0]}
        </Text>
      </View>

      {/* Arrow */}
      <TouchableOpacity
        style={styles.detailArrow}
        onPress={() => onPressDetail(clinic)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  cardSelected: {
    borderColor: Colors.accent,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBadgeSelected: {
    backgroundColor: Colors.accentLight + '22',
  },
  iconText: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  openBadge: {
    backgroundColor: Colors.accentLight + '33',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  openText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accentDark,
  },
  closedBadge: {
    backgroundColor: Colors.border,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  closedText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  speciality: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.star,
  },
  dot: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  reviews: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  distance: {
    fontSize: 11,
    color: Colors.accent,
    fontWeight: '600',
  },
  address: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  detailArrow: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: Colors.textMuted,
    lineHeight: 28,
  },
});
