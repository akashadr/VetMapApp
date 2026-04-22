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
import { formatDistance } from '../utils/distance';

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Clinic Details
        </Text>
        <View style={styles.backBtn} />
      </View>

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

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: clinic.isOpenNow ? Colors.accent : Colors.error },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: clinic.isOpenNow ? Colors.accentDark : Colors.error },
              ]}
            >
              {clinic.isOpenNow ? 'Open Now' : 'Closed'}
            </Text>
          </View>
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
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={handleBookAppointment}
          activeOpacity={0.85}
        >
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 36,
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: Colors.primary,
    fontWeight: '300',
    lineHeight: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  hero: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  heroIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    fontSize: 36,
  },
  clinicName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  specialityBadge: {
    backgroundColor: Colors.primary + '18',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  specialityText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
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
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  ratingCount: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
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
    backgroundColor: Colors.borderLight,
    marginLeft: 64,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  bookBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
});
