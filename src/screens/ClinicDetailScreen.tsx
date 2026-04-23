import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { Colors } from '../theme/colors';
import { UIText, Display, FontWeights } from '../theme/typography';
import { Spacing, Radius, IconSize, Elevation } from '../theme/spacing';
import { formatDistance } from '../utils/distance';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { TopNavBar } from '../components/TopNavBar';

type DetailRouteProp = RouteProp<RootStackParamList, 'ClinicDetail'>;

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

export const ClinicDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<DetailRouteProp>();
  const { clinic } = route.params;

  const icon = SPECIALITY_ICONS[clinic.speciality] ?? '🐾';

  const handleOpenMaps = useCallback(() => {
    const { latitude, longitude } = clinic.coordinates;
    const label = encodeURIComponent(clinic.name);
    if (Platform.OS === 'ios') {
      const nativeUrl = `maps:0,0?q=${label}@${latitude},${longitude}`;
      Linking.openURL(nativeUrl).catch(() =>
        Linking.openURL(`https://maps.apple.com/?q=${label}&ll=${latitude},${longitude}`),
      );
    } else {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      );
    }
  }, [clinic]);

  const handleCall = useCallback(() => {
    Linking.openURL(`tel:${clinic.phone}`);
  }, [clinic.phone]);

  const handleBookAppointment = useCallback(() => {
    Alert.alert(
      'Book Appointment',
      `Request an appointment at ${clinic.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'default',
          onPress: () =>
            Alert.alert('Requested!', 'The clinic will contact you to confirm.'),
        },
      ],
    );
  }, [clinic.name]);

  const renderInfoRow = (icon: string, label: string, value: string, onPress?: () => void) => (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.infoIconWrap}>
        <Text style={styles.infoIcon}>{icon}</Text>
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, onPress && styles.infoValueLink]}>
          {value}
        </Text>
      </View>
      {onPress && <Text style={styles.infoArrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopNavBar
        title="Clinic Details"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero section */}
        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Text style={styles.heroIcon}>{icon}</Text>
          </View>
          <Text style={styles.clinicName}>{clinic.name}</Text>
          <View style={styles.specialityBadge}>
            <Text style={styles.specialityText}>{clinic.speciality}</Text>
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingStars}>
              {'★'.repeat(Math.round(clinic.rating))}
              {'☆'.repeat(5 - Math.round(clinic.rating))}
            </Text>
            <Text style={styles.ratingValue}>{clinic.rating}</Text>
            <Text style={styles.ratingCount}>({clinic.reviewCount} reviews)</Text>
          </View>

          <Badge
            label={clinic.isOpenNow ? 'Open Now' : 'Closed'}
            variant={clinic.isOpenNow ? 'success' : 'default'}
          />
        </View>

        {/* Info cards */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.infoCard}>
            {renderInfoRow('📍', 'Address', clinic.address, handleOpenMaps)}
            <View style={styles.divider} />
            {renderInfoRow('📞', 'Phone', clinic.phone, handleCall)}
            <View style={styles.divider} />
            {renderInfoRow(
              '🕐',
              'Hours',
              `${clinic.hours.open} – ${clinic.hours.close}`,
            )}
            <View style={styles.divider} />
            {renderInfoRow('📅', 'Days', clinic.hours.days)}
            {clinic.distance !== undefined && (
              <>
                <View style={styles.divider} />
                {renderInfoRow(
                  '📏',
                  'Distance',
                  formatDistance(clinic.distance),
                )}
              </>
            )}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{clinic.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{clinic.reviewCount}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {clinic.distance !== undefined ? `${clinic.distance}km` : '—'}
            </Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
        </View>

        {/* Spacer for CTA */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Book CTA */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          label="Book Appointment"
          onPress={handleBookAppointment}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.screenVertical,
  },
  hero: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    paddingTop: Spacing.screenVertical,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.screenHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  heroIconWrap: {
    width: 80,
    height: 80,
    borderRadius: Radius.sheet,      // 24px large hero panel
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    fontSize: IconSize.lg * 2,       // 48px hero emoji — large surface
  },
  clinicName: {
    fontSize: 22,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.black,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  specialityBadge: {
    backgroundColor: Colors.accent + '18',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: Radius.pill,       // pill badge
    marginBottom: 12,
  },
  specialityText: {
    fontSize: 12,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.bold,
    color: Colors.accent,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  ratingStars: {
    fontSize: 14,
    color: Colors.star,
  },
  ratingValue: {
    fontSize: 15,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.black,
    color: Colors.textPrimary,
  },
  ratingCount: {
    fontSize: 13,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.regular,
    color: Colors.textMuted,
  },
  infoSection: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.bold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: 'hidden',
    ...Elevation.outline,            // card outline — border only
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.input,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoIcon: {
    fontSize: IconSize.sm,           // 16px inline row icon
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  infoValueLink: {
    color: Colors.accent,
  },
  infoArrow: {
    fontSize: 22,
    color: Colors.textMuted,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 64,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.screenHorizontal,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    alignItems: 'center',
    paddingVertical: 16,
    ...Elevation.outline,            // card outline — border only
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.black,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Satoshi-Variable',
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
