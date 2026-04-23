import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Clinic } from '../types';
import { Colors } from '../theme/colors';
import { UIText, FontWeights } from '../theme/typography';
import { Spacing, Radius, IconSize, Elevation } from '../theme/spacing';
import { formatDistance } from '../utils/distance';
import { Badge } from './Badge';

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
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      <View style={[styles.iconBadge, isSelected && styles.iconBadgeSelected]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{clinic.name}</Text>
          <Badge
            label={clinic.isOpenNow ? 'Open' : 'Closed'}
            variant={clinic.isOpenNow ? 'success' : 'default'}
          />
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
    borderRadius: Radius.card,
    padding: Spacing.tightLg,
    marginHorizontal: Spacing.screenHorizontal,
    marginBottom: Spacing.component,
    ...Elevation.outline,            // card outline — border only, no shadow
  },
  cardSelected: {
    borderColor: Colors.accent,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 6,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.input,      // 12px small card
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.tightLg,
  },
  iconBadgeSelected: {
    backgroundColor: Colors.accentLight + '22',
  },
  iconText: {
    fontSize: IconSize.lg,           // 24px card emoji icon
  },
  content: {
    flex: 1,
    gap: Spacing.tight / 2,          // 4px title→subtitle (micro tight)
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.tight,              // 8px inside name row (tight)
  },
  name: {
    flex: 1,
    ...UIText.subHeadline,           // 15px Medium
    color: Colors.textPrimary,
  },
  speciality: {
    ...UIText.footnoteEmphasis,      // 13px Medium
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  rating: {
    ...UIText.caption,               // 12px Medium
    fontWeight: FontWeights.semiBold,
    color: Colors.star,
  },
  dot: {
    ...UIText.caption,
    color: Colors.textMuted,
  },
  reviews: {
    ...UIText.caption,               // 12px Medium
    color: Colors.textMuted,
  },
  distance: {
    ...UIText.caption,               // 12px Medium
    color: Colors.accent,
  },
  address: {
    ...UIText.footnote,              // 13px Regular
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
